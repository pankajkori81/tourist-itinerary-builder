
// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession }          from "next-auth/next";
// import { authOptions }               from "@/app/api/auth/[...nextauth]/route";
// import { Resend }                    from "resend";
// import crypto                        from "crypto";
// import dbConnect                     from "@/app/lib/dbconnect";
// import ShareLink                     from "@/app/models/ShareLink";
// import Itinerary                     from "@/app/models/Itinerary";
// import ItineraryShareEmail from "@/emails/ItineraryShareEmail"; // Your React Email template

// // Import so Mongoose knows about these models for .populate()
// import "@/app/models/User";

// // ── Resend client (uses your RESEND_API_KEY from .env) ────────
// const resend = new Resend(process.env.RESEND_API_KEY);

// // ── Helpers ───────────────────────────────────────────────────

// // Generate a secure random token for the URL
// // Example output: "a3f8b2c1d9e4f7a6b5c2d1e8f3a4b7c6"
// const generateToken = (): string =>
//   crypto.randomBytes(32).toString("hex");

// // Calculate expiry date from days offset
// const getExpiryDate = (days: number): Date => {
//   const d = new Date();
//   d.setDate(d.getDate() + days);
//   return d;
// };

// // ══════════════════════════════════════════════════════════════
// // POST: Admin creates a new share link + sends email to client
// // ══════════════════════════════════════════════════════════════
// export const POST = async (req: NextRequest) => {
//   await dbConnect();

//   try {
//     // ── 1. Auth check — must be logged in ────────────────────
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json(
//         { success: false, message: "Not authenticated" },
//         { status: 401 }
//       );
//     }

//     const adminId = (session.user as any).id;
//     const body    = await req.json();

//     // ── 2. Validate required fields ──────────────────────────
//     const { itineraryId, clientEmail, clientName, clientPhone, expiryDays } = body;

//     if (!itineraryId) {
//       return NextResponse.json(
//         { success: false, message: "Itinerary ID is required" },
//         { status: 400 }
//       );
//     }
//     if (!clientEmail) {
//       return NextResponse.json(
//         { success: false, message: "Client email is required" },
//         { status: 400 }
//       );
//     }

//     // ── 3. Fetch the itinerary to get trip details ────────────
//     // Only fetch CLIENT-SAFE fields — no costs, no margins
//     const itinerary = await Itinerary.findById(itineraryId)
//       .select(
//         "tripName tripId selectedCountries routingData " +
//         "numberOfTravelers fixedDepartures packageType " +
//         "tripStyle dayWiseActivities"
//       )
//       .lean();

//     if (!itinerary) {
//       return NextResponse.json(
//         { success: false, message: "Itinerary not found" },
//         { status: 404 }
//       );
//     }

//     // ── 4. Generate unique token + expiry ─────────────────────
//     const token     = generateToken();
//     const days      = Number(expiryDays) || 30; // default 30 days
//     const expiresAt = getExpiryDate(days);

//     // ── 5. Build the public URL ───────────────────────────────
//     const baseUrl   = process.env.NEXT_PUBLIC_BASE_URL ||
//                       "http://localhost:3000";
//     const shareUrl  = `${baseUrl}/view/${token}`;

//     // ── 6. Save ShareLink to MongoDB ─────────────────────────
//     const shareLink = await ShareLink.create({
//       itineraryId,
//       token,
//       clientName  : clientName  || "",
//       clientEmail : clientEmail.toLowerCase().trim(),
//       clientPhone : clientPhone || "",
//       expiresAt,
//       createdBy   : adminId,
//       isActive    : true,
//       status      : "pending",
//     });

//     // ── 7. Send email via Resend ──────────────────────────────
//     const tripName   = (itinerary as any).tripName    || "Your Itinerary";
//     const countries  = ((itinerary as any).selectedCountries || []).join(", ");
//     const nights     = ((itinerary as any).routingData?.routes || [])
//       .reduce((sum: number, r: any) => sum + (r.nights || 0), 0);
//     const days2      = nights + 1;
//     const fromEmail  = process.env.FROM_EMAIL || "onboarding@resend.dev";
//     const greeting   = clientName ? `Hi ${clientName},` : "Hi there,";

//     // Format expiry date nicely
//     const expiryFormatted = expiresAt.toLocaleDateString("en-US", {
//       month : "long",
//       day   : "numeric",
//       year  : "numeric",
//     });

//     const emailResult = await resend.emails.send({
//       from    : `Travdek <${fromEmail}>`,
//       to      : [clientEmail],
//       subject : `Your ${tripName} Itinerary is Ready 🌍`,
//       html    : `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         </head>
//         <body style="margin:0;padding:0;background:#f0f4ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          
//           <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4ff;padding:40px 20px;">
//             <tr>
//               <td align="center">
//                 <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                  
//                   <!-- HEADER BAND -->
//                   <tr>
//                     <td style="background:#1d4ed8;padding:32px 40px;text-align:center;">
//                       <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:900;letter-spacing:-0.5px;">
//                         TRAVDEK
//                       </h1>
//                       <p style="color:#bfdbfe;margin:4px 0 0;font-size:13px;">
//                         Your Personal Travel Advisor
//                       </p>
//                     </td>
//                   </tr>

//                   <!-- BODY -->
//                   <tr>
//                     <td style="padding:40px;">
                      
//                       <p style="color:#1e293b;font-size:16px;margin:0 0 8px;">
//                         ${greeting}
//                       </p>
//                       <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 32px;">
//                         Your personalized travel itinerary is ready to review. 
//                         We've put together a detailed plan just for you!
//                       </p>

//                       <!-- TRIP CARD -->
//                       <table width="100%" cellpadding="0" cellspacing="0" 
//                         style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;margin-bottom:32px;">
//                         <tr>
//                           <td style="padding:24px;">
//                             <p style="color:#1d4ed8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">
//                               YOUR TRIP
//                             </p>
//                             <h2 style="color:#0f172a;font-size:22px;font-weight:900;margin:0 0 12px;">
//                               ${tripName}
//                             </h2>
//                             ${countries ? `
//                             <p style="color:#475569;font-size:14px;margin:0 0 6px;">
//                               📍 <strong>${countries}</strong>
//                             </p>` : ""}
//                             ${days2 > 1 ? `
//                             <p style="color:#475569;font-size:14px;margin:0 0 6px;">
//                               📅 <strong>${days2} Days | ${nights} Nights</strong>
//                             </p>` : ""}
//                             <p style="color:#64748b;font-size:13px;margin:12px 0 0;">
//                               ⏰ Link valid until <strong>${expiryFormatted}</strong>
//                             </p>
//                           </td>
//                         </tr>
//                       </table>

//                       <!-- CTA BUTTON -->
//                       <table width="100%" cellpadding="0" cellspacing="0">
//                         <tr>
//                           <td align="center">
//                             <a href="${shareUrl}"
//                               style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;
//                                      padding:16px 40px;border-radius:12px;font-size:16px;font-weight:700;
//                                      letter-spacing:0.3px;box-shadow:0 4px 12px rgba(29,78,216,0.3);">
//                               View Your Itinerary →
//                             </a>
//                           </td>
//                         </tr>
//                       </table>

//                       <p style="color:#94a3b8;font-size:12px;text-align:center;margin:24px 0 0;">
//                         Or copy this link: 
//                         <a href="${shareUrl}" style="color:#1d4ed8;">${shareUrl}</a>
//                       </p>

//                     </td>
//                   </tr>

//                   <!-- DIVIDER -->
//                   <tr>
//                     <td style="padding:0 40px;">
//                       <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;">
//                     </td>
//                   </tr>

//                   <!-- FOOTER -->
//                   <tr>
//                     <td style="padding:24px 40px;text-align:center;">
//                       <p style="color:#64748b;font-size:13px;margin:0 0 4px;">
//                         Questions? Reply to this email or contact us:
//                       </p>
//                       <p style="color:#1d4ed8;font-size:13px;margin:0;font-weight:600;">
//                         Sandeep@TravDek.com &nbsp;|&nbsp; +1 650 759 4331
//                       </p>
//                       <p style="color:#94a3b8;font-size:11px;margin:16px 0 0;">
//                         © Travdek · Official B2B Travel Network
//                       </p>
//                     </td>
//                   </tr>

//                 </table>
//               </td>
//             </tr>
//           </table>

//         </body>
//         </html>
//       `,
//     });

//     // ── 8. Update ShareLink with email sent timestamp ─────────
//     await ShareLink.findByIdAndUpdate(shareLink._id, {
//       emailSentAt: new Date(),
//     });

//     // ── 9. Return success with link details ───────────────────
//     return NextResponse.json({
//       success  : true,
//       message  : "Share link created and email sent successfully",
//       data     : {
//         shareUrl,
//         token,
//         expiresAt,
//         clientEmail,
//         emailId  : emailResult?.data?.id || null,
//       },
//     }, { status: 201 });

//   } catch (error: any) {
//     console.error("Share POST Error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Server Error" },
//       { status: 500 }
//     );
//   }
// };

// // ══════════════════════════════════════════════════════════════
// // GET: Admin fetches all share links for a specific itinerary
// // ══════════════════════════════════════════════════════════════
// export const GET = async (req: NextRequest) => {
//   await dbConnect();

//   try {
//     // ── 1. Auth check ─────────────────────────────────────────
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json(
//         { success: false, message: "Not authenticated" },
//         { status: 401 }
//       );
//     }

//     // ── 2. Get itineraryId from query params ──────────────────
//     const { searchParams } = new URL(req.url);
//     const itineraryId      = searchParams.get("itineraryId");

//     if (!itineraryId) {
//       return NextResponse.json(
//         { success: false, message: "itineraryId query param required" },
//         { status: 400 }
//       );
//     }

//     // ── 3. Fetch all links for this itinerary ─────────────────
//     // Auto-mark expired links
//     const now   = new Date();
//     await ShareLink.updateMany(
//       { itineraryId, expiresAt: { $lt: now }, status: { $nin: ["approved","changes_requested","expired"] } },
//       { $set: { status: "expired" } }
//     );

//     const links = await ShareLink.find({ itineraryId })
//       .sort({ createdAt: -1 }) // newest first
//       .lean();

//     return NextResponse.json({ success: true, data: links });

//   } catch (error: any) {
//     console.error("Share GET Error:", error);
//     return NextResponse.json(
//       { success: false, message: "Server Error" },
//       { status: 500 }
//     );
//   }
// };





// ══════════════════════════════════════════════════════════════
// FILE: app/api/share/route.ts
// PURPOSE:
//   POST → Admin creates a share link + sends email via Resend
//   GET  → Admin lists all share links for an itinerary
// USES: ShareLink model, Itinerary model, User model, Resend, React Email
// ══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { getServerSession }          from "next-auth/next";
import { authOptions }               from "@/app/api/auth/[...nextauth]/route";
import { Resend }                    from "resend";
import crypto                        from "crypto";
import dbConnect                     from "@/app/lib/dbconnect";
import ShareLink                     from "@/app/models/ShareLink";
import Itinerary                     from "@/app/models/Itinerary";
import ItineraryShareEmail           from "@/emails/ItineraryShareEmail"; 

// Import so Mongoose knows about these models for .populate()
import "@/app/models/User";

// ── Resend client (uses your RESEND_API_KEY from .env) ────────
const resend = new Resend(process.env.RESEND_API_KEY);

// ── Helpers ───────────────────────────────────────────────────

// Generate a secure random token for the URL
const generateToken = (): string =>
  crypto.randomBytes(32).toString("hex");

// Calculate expiry date from days offset
const getExpiryDate = (days: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

// ══════════════════════════════════════════════════════════════
// POST: Admin creates a new share link + sends email to client
// ══════════════════════════════════════════════════════════════
export const POST = async (req: NextRequest) => {
  await dbConnect();

  try {
    // ── 1. Auth check — must be logged in ────────────────────
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const adminId = (session.user as any).id;
    const body    = await req.json();

    // ── 2. Validate required fields ──────────────────────────
    const { itineraryId, clientEmail, clientName, clientPhone, expiryDays } = body;

    if (!itineraryId) {
      return NextResponse.json(
        { success: false, message: "Itinerary ID is required" },
        { status: 400 }
      );
    }
    if (!clientEmail) {
      return NextResponse.json(
        { success: false, message: "Client email is required" },
        { status: 400 }
      );
    }

    // ── 3. Fetch the itinerary to get trip details ────────────
    const itinerary = await Itinerary.findById(itineraryId)
      .select(
        "tripName tripId selectedCountries routingData " +
        "numberOfTravelers fixedDepartures packageType " +
        "tripStyle dayWiseActivities"
      )
      .lean();

    if (!itinerary) {
      return NextResponse.json(
        { success: false, message: "Itinerary not found" },
        { status: 404 }
      );
    }

    // ── 4. Generate unique token + expiry ─────────────────────
    const token     = generateToken();
    const days      = Number(expiryDays) || 30; 
    const expiresAt = getExpiryDate(days);

    // ── 5. Build the public URL ───────────────────────────────
    const baseUrl   = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const shareUrl  = `${baseUrl}/view/${token}`;

    // ── 6. Save ShareLink to MongoDB ─────────────────────────
    const shareLink = await ShareLink.create({
      itineraryId,
      token,
      clientName  : clientName  || "",
      clientEmail : clientEmail.toLowerCase().trim(),
      clientPhone : clientPhone || "",
      expiresAt,
      createdBy   : adminId,
      isActive    : true,
      status      : "pending",
    });

    // ── 7. Send email via Resend and React Email ──────────────
    const tripName   = (itinerary as any).tripName    || "Your Itinerary";
    const countries  = ((itinerary as any).selectedCountries || []).join(", ");
    const nights     = ((itinerary as any).routingData?.routes || [])
      .reduce((sum: number, r: any) => sum + (r.nights || 0), 0);
    const totalDays  = nights + 1;
    const fromEmail  = process.env.FROM_EMAIL || "onboarding@resend.dev";

    const expiryFormatted = expiresAt.toLocaleDateString("en-US", {
      month : "long",
      day   : "numeric",
      year  : "numeric",
    });

    const emailResult = await resend.emails.send({
      from    : `Travdek <${fromEmail}>`,
      to      : [clientEmail],
      subject : `Your ${tripName} Itinerary is Ready 🌍`,
      react   : ItineraryShareEmail({
        clientName : clientName || "Valued Client",
        tripName   : tripName,
        countries  : countries,
        days       : totalDays,
        nights     : nights,
        expiryDate : expiryFormatted,
        shareUrl   : shareUrl,
      }),
    });

    if (emailResult.error) {
      console.error("Resend API Error:", emailResult.error);
      return NextResponse.json(
        { success: false, message: "Failed to send email. Check server logs." },
        { status: 500 }
      );
    }

    // ── 8. Update ShareLink with email sent timestamp ─────────
    await ShareLink.findByIdAndUpdate(shareLink._id, {
      emailSentAt: new Date(),
    });

    // ── 9. Return success with link details ───────────────────
    return NextResponse.json({
      success  : true,
      message  : "Share link created and email sent successfully",
      data     : {
        shareUrl,
        token,
        expiresAt,
        clientEmail,
        emailId  : emailResult?.data?.id || null,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error("Share POST Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
};

// ══════════════════════════════════════════════════════════════
// GET: Admin fetches all share links for a specific itinerary
// ══════════════════════════════════════════════════════════════
export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    // ── 1. Auth check ─────────────────────────────────────────
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // ── 2. Get itineraryId from query params ──────────────────
    const { searchParams } = new URL(req.url);
    const itineraryId      = searchParams.get("itineraryId");

    if (!itineraryId) {
      return NextResponse.json(
        { success: false, message: "itineraryId query param required" },
        { status: 400 }
      );
    }

    // ── 3. Fetch all links for this itinerary ─────────────────
    // Auto-mark expired links
    const now   = new Date();
    await ShareLink.updateMany(
      { itineraryId, expiresAt: { $lt: now }, status: { $nin: ["approved","changes_requested","expired"] } },
      { $set: { status: "expired" } }
    );

    const links = await ShareLink.find({ itineraryId })
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return NextResponse.json({ success: true, data: links });

  } catch (error: any) {
    console.error("Share GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
};