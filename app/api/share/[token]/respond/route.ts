

import { NextRequest, NextResponse } from "next/server";
import { Resend }                    from "resend";
import dbConnect                     from "@/app/lib/dbconnect";
import ShareLink                     from "@/app/models/ShareLink";
import Itinerary                     from "@/app/models/Itinerary";

import "@/app/models/User";

// ── Resend client ─────────────────────────────────────────────
const resend = new Resend(process.env.RESEND_API_KEY);


export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) => {
  await dbConnect();

  try {
    // ── 1. Await params (Next.js 15 requirement) ──────────────
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Invalid link" },
        { status: 400 }
      );
    }

    // ── 2. Parse client's response body ──────────────────────
    const body = await req.json();

    const {
      action,         // "approved" | "changes_requested"
      clientMessage,  // Optional message from client
      selectedMonth,  // Which pricing month client chose
      selectedPax,    // How many travelers client confirmed
      clientName,     // Client's name (if provided)
    } = body;

    // ── 3. Validate action ────────────────────────────────────
    const validActions = ["approved", "changes_requested"];
    if (!action || !validActions.includes(action)) {
      return NextResponse.json(
        {
          success : false,
          message : "Invalid action. Must be 'approved' or 'changes_requested'",
        },
        { status: 400 }
      );
    }

    // ── 4. Find the ShareLink ─────────────────────────────────
    const shareLink = await ShareLink.findOne({ token }).lean() as any;

    if (!shareLink) {
      return NextResponse.json(
        { success: false, message: "Link not found" },
        { status: 404 }
      );
    }

    // ── 5. Validate link is still usable ─────────────────────
    if (!shareLink.isActive) {
      return NextResponse.json(
        { success: false, message: "This link has been deactivated" },
        { status: 403 }
      );
    }

    if (new Date(shareLink.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, message: "This link has expired" },
        { status: 410 }
      );
    }

    // Prevent double submission
    if (
      shareLink.status === "approved" ||
      shareLink.status === "changes_requested"
    ) {
      return NextResponse.json(
        {
          success : false,
          message : "You have already responded to this itinerary",
          status  : shareLink.status,
        },
        { status: 409 }
      );
    }

    // ── 6. Update ShareLink with client's response ────────────
    await ShareLink.findByIdAndUpdate(shareLink._id, {
      status        : action,
      clientMessage : clientMessage || "",
      selectedMonth : selectedMonth || "",
      selectedPax   : selectedPax   || null,
      respondedAt   : new Date(),
    });

    // ── 7. If APPROVED → update itinerary bookingStatus ───────
    // This auto-confirms the booking in your system
    if (action === "approved") {
      await Itinerary.findByIdAndUpdate(shareLink.itineraryId, {
        $set: {
          bookingStatus : "confirmed",
          // Add to audit log
          $push: {
            auditLog: {
              action    : "client_approved",
              timestamp : new Date(),
              note      : `Client ${shareLink.clientName || clientName || shareLink.clientEmail} approved via share link`,
              version   : "client_action",
            },
          },
        },
      });
    }

    // ── 8. Fetch itinerary for email context ──────────────────
    const itinerary = await Itinerary.findById(shareLink.itineraryId)
      .select("tripName tripId selectedCountries")
      .lean() as any;

    const tripName  = itinerary?.tripName  || "Itinerary";
    const countries = (itinerary?.selectedCountries || []).join(", ");
    const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";
    const baseUrl   = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const adminEmail= process.env.ADMIN_EMAIL || "sandeep@travdek.com";

    // ── 9. Send notification email to ADMIN ───────────────────
    const isApproved      = action === "approved";
    const actionLabel     = isApproved ? "✅ APPROVED" : "📝 Changes Requested";
    const actionColor     = isApproved ? "#059669" : "#d97706";
    const clientDisplay   = shareLink.clientName || clientName || shareLink.clientEmail;

    await resend.emails.send({
      from    : `Travdek <${fromEmail}>`,
      to      : [adminEmail],
      subject : `${actionLabel}: ${tripName} — ${clientDisplay}`,
      html    : `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f0f4ff;
          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

          <table width="100%" cellpadding="0" cellspacing="0"
            style="background:#f0f4ff;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                  style="background:#ffffff;border-radius:16px;
                         overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                  <!-- HEADER -->
                  <tr>
                    <td style="background:#1d4ed8;padding:28px 40px;">
                      <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:900;">
                        TRAVDEK
                      </h1>
                      <p style="color:#bfdbfe;margin:4px 0 0;font-size:13px;">
                        Client Response Notification
                      </p>
                    </td>
                  </tr>

                  <!-- STATUS BANNER -->
                  <tr>
                    <td style="background:${actionColor};padding:16px 40px;text-align:center;">
                      <p style="color:#ffffff;margin:0;font-size:18px;font-weight:900;">
                        ${actionLabel}
                      </p>
                    </td>
                  </tr>

                  <!-- BODY -->
                  <tr>
                    <td style="padding:32px 40px;">

                      <p style="color:#1e293b;font-size:16px;margin:0 0 24px;">
                        A client has responded to their itinerary.
                      </p>

                      <!-- DETAILS TABLE -->
                      <table width="100%" cellpadding="0" cellspacing="0"
                        style="background:#f8fafc;border:1px solid #e2e8f0;
                               border-radius:12px;margin-bottom:24px;">
                        <tr>
                          <td style="padding:20px;">

                            <table width="100%" cellpadding="8" cellspacing="0">
                              <tr>
                                <td style="color:#64748b;font-size:13px;width:40%;
                                           font-weight:600;">
                                  Client:
                                </td>
                                <td style="color:#0f172a;font-size:13px;font-weight:700;">
                                  ${clientDisplay}
                                </td>
                              </tr>
                              <tr>
                                <td style="color:#64748b;font-size:13px;font-weight:600;">
                                  Email:
                                </td>
                                <td style="color:#1d4ed8;font-size:13px;">
                                  ${shareLink.clientEmail}
                                </td>
                              </tr>
                              <tr>
                                <td style="color:#64748b;font-size:13px;font-weight:600;">
                                  Trip:
                                </td>
                                <td style="color:#0f172a;font-size:13px;font-weight:700;">
                                  ${tripName}
                                </td>
                              </tr>
                              ${countries ? `
                              <tr>
                                <td style="color:#64748b;font-size:13px;font-weight:600;">
                                  Destination:
                                </td>
                                <td style="color:#0f172a;font-size:13px;">
                                  ${countries}
                                </td>
                              </tr>` : ""}
                              ${selectedMonth ? `
                              <tr>
                                <td style="color:#64748b;font-size:13px;font-weight:600;">
                                  Selected Month:
                                </td>
                                <td style="color:#0f172a;font-size:13px;font-weight:700;">
                                  ${selectedMonth}
                                </td>
                              </tr>` : ""}
                              ${selectedPax ? `
                              <tr>
                                <td style="color:#64748b;font-size:13px;font-weight:600;">
                                  Travelers:
                                </td>
                                <td style="color:#0f172a;font-size:13px;">
                                  ${selectedPax} Pax
                                </td>
                              </tr>` : ""}
                              ${clientMessage ? `
                              <tr>
                                <td style="color:#64748b;font-size:13px;
                                           font-weight:600;vertical-align:top;">
                                  Message:
                                </td>
                                <td style="color:#0f172a;font-size:13px;
                                           font-style:italic;">
                                  "${clientMessage}"
                                </td>
                              </tr>` : ""}
                              <tr>
                                <td style="color:#64748b;font-size:13px;font-weight:600;">
                                  Responded At:
                                </td>
                                <td style="color:#0f172a;font-size:13px;">
                                  ${new Date().toLocaleString("en-US", {
                                    month   : "long",
                                    day     : "numeric",
                                    year    : "numeric",
                                    hour    : "2-digit",
                                    minute  : "2-digit",
                                  })}
                                </td>
                              </tr>
                            </table>

                          </td>
                        </tr>
                      </table>

                      ${isApproved ? `
                      <!-- CONFIRMED NOTICE -->
                      <table width="100%" cellpadding="0" cellspacing="0"
                        style="background:#ecfdf5;border:1px solid #a7f3d0;
                               border-radius:12px;margin-bottom:24px;">
                        <tr>
                          <td style="padding:16px 20px;">
                            <p style="color:#059669;font-size:14px;
                                      font-weight:700;margin:0;">
                              ✅ Booking automatically confirmed in Travdek
                            </p>
                            <p style="color:#065f46;font-size:13px;margin:4px 0 0;">
                              The itinerary status has been updated to "Confirmed"
                            </p>
                          </td>
                        </tr>
                      </table>` : `
                      <!-- CHANGES NOTICE -->
                      <table width="100%" cellpadding="0" cellspacing="0"
                        style="background:#fffbeb;border:1px solid #fcd34d;
                               border-radius:12px;margin-bottom:24px;">
                        <tr>
                          <td style="padding:16px 20px;">
                            <p style="color:#d97706;font-size:14px;
                                      font-weight:700;margin:0;">
                              📝 Client has requested changes
                            </p>
                            <p style="color:#92400e;font-size:13px;margin:4px 0 0;">
                              Please review their message and update the itinerary
                            </p>
                          </td>
                        </tr>
                      </table>`}

                      <!-- CTA -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <a href="${baseUrl}/dashboard/itinerary/preview"
                              style="display:inline-block;background:#1d4ed8;
                                     color:#ffffff;text-decoration:none;
                                     padding:14px 32px;border-radius:10px;
                                     font-size:14px;font-weight:700;">
                              View in Dashboard →
                            </a>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td style="padding:20px 40px;border-top:1px solid #e2e8f0;
                               text-align:center;">
                      <p style="color:#94a3b8;font-size:11px;margin:0;">
                        © Travdek · Official B2B Travel Network
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>

        </body>
        </html>
      `,
    });

    // ── 10. Send confirmation email back to CLIENT ─────────────
    await resend.emails.send({
      from    : `Travdek <${fromEmail}>`,
      to      : [shareLink.clientEmail],
      subject : isApproved
        ? `✅ Your ${tripName} is Confirmed!`
        : `📝 Changes Request Received — ${tripName}`,
      html    : `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f0f4ff;
          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

          <table width="100%" cellpadding="0" cellspacing="0"
            style="background:#f0f4ff;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                  style="background:#ffffff;border-radius:16px;overflow:hidden;
                         box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                  <!-- HEADER -->
                  <tr>
                    <td style="background:#1d4ed8;padding:28px 40px;text-align:center;">
                      <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:900;">
                        TRAVDEK
                      </h1>
                    </td>
                  </tr>

                  <!-- BODY -->
                  <tr>
                    <td style="padding:40px;text-align:center;">

                      <div style="font-size:48px;margin-bottom:16px;">
                        ${isApproved ? "🎉" : "📝"}
                      </div>

                      <h2 style="color:#0f172a;font-size:22px;
                                 font-weight:900;margin:0 0 12px;">
                        ${isApproved
                          ? "Your Trip is Confirmed!"
                          : "We Got Your Request!"}
                      </h2>

                      <p style="color:#475569;font-size:15px;
                                line-height:1.6;margin:0 0 24px;">
                        ${isApproved
                          ? `Thank you for approving <strong>${tripName}</strong>. 
                             Your travel advisor will be in touch shortly with 
                             your booking confirmation details.`
                          : `Thank you for your feedback on <strong>${tripName}</strong>. 
                             Your travel advisor will review your requested changes 
                             and get back to you shortly.`}
                      </p>

                      <table width="100%" cellpadding="0" cellspacing="0"
                        style="background:#f8fafc;border:1px solid #e2e8f0;
                               border-radius:12px;margin-bottom:24px;text-align:left;">
                        <tr>
                          <td style="padding:20px;">
                            <p style="color:#64748b;font-size:12px;
                                      font-weight:700;text-transform:uppercase;
                                      letter-spacing:1px;margin:0 0 8px;">
                              Trip Details
                            </p>
                            <p style="color:#0f172a;font-size:15px;
                                      font-weight:900;margin:0 0 4px;">
                              ${tripName}
                            </p>
                            ${countries ? `
                            <p style="color:#475569;font-size:14px;margin:0;">
                              📍 ${countries}
                            </p>` : ""}
                            ${selectedMonth ? `
                            <p style="color:#475569;font-size:14px;margin:4px 0 0;">
                              📅 Selected: ${selectedMonth}
                            </p>` : ""}
                          </td>
                        </tr>
                      </table>

                      <p style="color:#64748b;font-size:14px;margin:0;">
                        Questions? Contact your travel advisor:<br>
                        <a href="mailto:sandeep@travdek.com"
                          style="color:#1d4ed8;font-weight:600;">
                          sandeep@travdek.com
                        </a>
                        &nbsp;|&nbsp; +1 650 759 4331
                      </p>

                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td style="padding:20px 40px;border-top:1px solid #e2e8f0;
                               text-align:center;">
                      <p style="color:#94a3b8;font-size:11px;margin:0;">
                        © Travdek · Official B2B Travel Network
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>

        </body>
        </html>
      `,
    });

    // ── 11. Return success ────────────────────────────────────
    return NextResponse.json({
      success : true,
      action,
      message : isApproved
        ? "Thank you! Your trip has been confirmed. We will contact you shortly."
        : "Thank you! Your change request has been received. We will get back to you shortly.",
    });

  } catch (error: any) {
    console.error("Share Respond Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error. Please try again." },
      { status: 500 }
    );
  }
};