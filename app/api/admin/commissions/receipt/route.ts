// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import dbConnect from "@/app/lib/dbconnect";
// import { Commission } from "@/app/models/Commission";
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// // Import related models so Mongoose knows about them for .populate()
// import User from "@/app/models/User";
// import { TravelOperation } from "@/app/models/TravelOperation";
// import Itinerary from "@/app/models/Itinerary";

// // Helper to verify Admin access
// async function verifyAdmin() {
//   const session = await getServerSession(authOptions);
//   if (!session || (session.user as any).role !== "admin") return null;
//   return session.user;
// }

// export const POST = async (req: NextRequest) => {
//   await dbConnect();

//   try {
//     const isAdmin = await verifyAdmin();
//     if (!isAdmin) {
//       return NextResponse.json({ success: false, message: "Unauthorized Admin Access" }, { status: 403 });
//     }

//     const { bookingId } = await req.json();

//     if (!bookingId) {
//       return NextResponse.json({ success: false, message: "Missing commission record ID" }, { status: 400 });
//     }

//     // 1. Fetch the Commission Record and populate relational data
//     const commissionRecord = await Commission.findById(bookingId)
//       .populate("agentId", "name agencyName")
//       .populate("travelOperationId", "tripName")
//       .populate("itineraryId", "leadGuestName travelers tripName")
//       .lean();

//     if (!commissionRecord) {
//       return NextResponse.json({ success: false, message: "Commission record not found" }, { status: 404 });
//     }

//     // 2. Security Check: Only generate receipts for Paid commissions
//     if (commissionRecord.status !== 'Paid') {
//         return NextResponse.json({ success: false, message: "Cannot generate receipt. Commission is not marked as paid." }, { status: 400 });
//     }

//     // 3. Generate the PDF in Memory
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage([600, 400]); 
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//     // --- Draw PDF Content ---
//     page.drawText('TRAVDEK', { x: 50, y: 340, size: 24, font: boldFont, color: rgb(0.4, 0.2, 0.9) }); // Purple branding
//     page.drawText('Official Commission Payout Receipt', { x: 50, y: 320, size: 14, font: font, color: rgb(0.4, 0.4, 0.4) });
    
//     page.drawLine({ start: { x: 50, y: 300 }, end: { x: 550, y: 300 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });

//     // Client/Trip Info Extraction
//     const tripName = (commissionRecord as any).travelOperationId?.tripName || (commissionRecord as any).itineraryId?.tripName || "Unknown Trip";
//     const agentName = (commissionRecord as any).agentId?.name || "Independent Advisor";
//     const agencyName = (commissionRecord as any).agentId?.agencyName || "";
    
//     const payoutDate = commissionRecord.paidAt ? new Date(commissionRecord.paidAt).toLocaleDateString() : new Date().toLocaleDateString();

//     page.drawText(`Payout Date: ${payoutDate}`, { x: 50, y: 270, size: 12, font });
//     page.drawText(`Advisor Name: ${agentName} ${agencyName ? `(${agencyName})` : ''}`, { x: 50, y: 250, size: 12, font });
//     page.drawText(`Trip Details: ${tripName}`, { x: 50, y: 230, size: 12, font });
//     page.drawText(`Receipt ID: TXN-${commissionRecord._id.toString().substring(0, 8).toUpperCase()}`, { x: 50, y: 210, size: 10, font, color: rgb(0.5, 0.5, 0.5) });

//     // Financial Breakdown
//     page.drawText(`Total Client Payment: $${commissionRecord.totalSalePrice.toLocaleString()}`, { x: 350, y: 270, size: 12, font });
//     page.drawText(`Gross Profit: $${commissionRecord.grossProfit.toLocaleString()}`, { x: 350, y: 250, size: 12, font });
    
//     page.drawLine({ start: { x: 350, y: 235 }, end: { x: 550, y: 235 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    
//     // Final Cut
//     page.drawText(`Amount Paid: $${commissionRecord.agentCut.toLocaleString()}`, { x: 350, y: 210, size: 16, font: boldFont, color: rgb(0.1, 0.6, 0.1) });

//     // 4. Serialize PDF to Base64 String
//     const pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: false });

//     return NextResponse.json({ 
//       success: true, 
//       pdfBase64: pdfBase64 
//     });

//   } catch (error) {
//     console.error("Receipt Generation Error:", error);
//     return NextResponse.json({ success: false, message: "Server Error generating receipt" }, { status: 500 });
//   }
// };























// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import dbConnect from "@/app/lib/dbconnect";
// import { Commission } from "@/app/models/Commission";
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// import User from "@/app/models/User";
// import { TravelOperation } from "@/app/models/TravelOperation";
// import Itinerary from "@/app/models/Itinerary";

// async function verifyAdmin() {
//   const session = await getServerSession(authOptions);
//   if (!session || (session.user as any).role !== "admin") return null;
//   return session.user;
// }

// const formatCurrency = (value: number) => {
//     return '$' + (value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// };

// export const POST = async (req: NextRequest) => {
//   await dbConnect();

//   try {
//     const isAdmin = await verifyAdmin();
//     if (!isAdmin) {
//       return NextResponse.json({ success: false, message: "Unauthorized Admin Access" }, { status: 403 });
//     }

//     const { bookingId } = await req.json();

//     if (!bookingId) {
//       return NextResponse.json({ success: false, message: "Missing commission record ID" }, { status: 400 });
//     }

//     // 1. Fetch Commission Data
//     const commissionRecord = await Commission.findById(bookingId)
//       .populate("agentId", "name agencyName")
//       .populate("travelOperationId", "tripName")
//       .populate("itineraryId", "leadGuestName travelers tripName")
//       .lean();

//     if (!commissionRecord) {
//       return NextResponse.json({ success: false, message: "Commission record not found" }, { status: 404 });
//     }

//     if (commissionRecord.status !== 'Paid') {
//         return NextResponse.json({ success: false, message: "Cannot generate receipt. Commission is not marked as paid." }, { status: 400 });
//     }

//     // 2. Setup standard A4 PDF document
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions
//     const { width } = page.getSize();
    
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
//     // --- Helper Functions ---
//     const drawText = (text: string, x: number, y: number, size: number, isBold: boolean = false, color = rgb(0.1, 0.1, 0.1)) => {
//         page.drawText(text, { x, y, size, font: isBold ? boldFont : font, color });
//     };
    
//     const drawLine = (y: number, thickness = 1) => {
//         page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness, color: rgb(0.85, 0.85, 0.85) });
//     };

//     // --- DATA EXTRACTION ---
//     const tripName = (commissionRecord as any).travelOperationId?.tripName || (commissionRecord as any).itineraryId?.tripName || "Unknown Trip";
//     const agentName = (commissionRecord as any).agentId?.name || "Independent Advisor";
//     const agencyName = (commissionRecord as any).agentId?.agencyName || "";
    
//     let clientName = (commissionRecord as any).itineraryId?.leadGuestName;
//     if (!clientName && (commissionRecord as any).itineraryId?.travelers?.length > 0) {
//         clientName = (commissionRecord as any).itineraryId.travelers[0].name || (commissionRecord as any).itineraryId.travelers[0].firstName;
//     }
//     clientName = clientName || "Unknown Client";

//     const payoutDate = commissionRecord.paidAt ? new Date(commissionRecord.paidAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString();
//     const receiptId = `TXN-${commissionRecord._id.toString().substring(0, 8).toUpperCase()}`;

//     // ==========================================
//     // PDF DRAWING LOGIC (Top to Bottom)
//     // ==========================================
//     let cursorY = 780;

//     // --- HEADER ---
//     drawText('PAYOUT RECEIPT', 40, cursorY, 32, true);
    
//     drawText('TRAVDEK', width - 200, cursorY + 10, 16, true, rgb(0.4, 0.2, 0.9));
//     drawText('Official B2B Network', width - 200, cursorY - 5, 10);
//     drawText(`Date: ${payoutDate}`, width - 200, cursorY - 25, 10);
//     drawText(`Receipt No: ${receiptId}`, width - 200, cursorY - 40, 10, true);

//     cursorY -= 80;

//     // --- BILLED TO ---
//     drawText('PAID TO :', 40, cursorY, 11, true);
//     drawText(agentName, 40, cursorY - 20, 10);
//     if (agencyName) drawText(agencyName, 40, cursorY - 35, 10);

//     cursorY -= 70;

//     // --- TABLE HEADERS ---
//     drawLine(cursorY, 1.5);
//     cursorY -= 20;
    
//     drawText('DESCRIPTION (TRIP)', 40, cursorY, 9, true);
//     drawText('CLIENT', 260, cursorY, 9, true);
//     drawText('SALE PRICE', 380, cursorY, 9, true);
//     drawText('GROSS PROFIT', 480, cursorY, 9, true);
    
//     cursorY -= 10;
//     drawLine(cursorY);

//     // --- TABLE ROW ---
//     cursorY -= 25;
    
//     // Auto-truncate trip name if too long
//     const shortTripName = tripName.length > 35 ? tripName.substring(0, 32) + '...' : tripName;
//     const shortClientName = clientName.length > 20 ? clientName.substring(0, 17) + '...' : clientName;

//     drawText(shortTripName, 40, cursorY, 10);
//     drawText(shortClientName, 260, cursorY, 10);
//     drawText(formatCurrency(commissionRecord.totalSalePrice), 380, cursorY, 10);
//     drawText(formatCurrency(commissionRecord.grossProfit), 480, cursorY, 10);

//     cursorY -= 20;
//     drawLine(cursorY);

//     // --- TOTALS AREA ---
//     cursorY -= 40;
//     drawText('Subtotal (Gross Profit)', 320, cursorY, 10, true);
//     drawText(formatCurrency(commissionRecord.grossProfit), 480, cursorY, 10);

//     cursorY -= 20;
//     const hostCutPercent = 100 - commissionRecord.commissionRateApplied;
//     drawText(`Host Agency Cut (${hostCutPercent}%)`, 320, cursorY, 10, true);
//     drawText(`- ${formatCurrency(commissionRecord.adminCut)}`, 480, cursorY, 10);

//     cursorY -= 15;
//     drawLine(cursorY);

//     cursorY -= 30;
//     drawText('TOTAL PAYOUT', 320, cursorY, 14, true);
//     drawText(formatCurrency(commissionRecord.agentCut), 480, cursorY, 14, true);

//     // --- FOOTER ---
//     cursorY -= 80;
//     drawText('PAYMENT DETAILS :', 40, cursorY, 10, true);
//     drawText('Status', 40, cursorY - 20, 10);
//     drawText(':  PAID & CLEARED', 120, cursorY - 20, 10, true, rgb(0.1, 0.6, 0.1));
    
//     drawText('Split Applied', 40, cursorY - 35, 10);
//     drawText(`:  ${commissionRecord.commissionRateApplied}% to Advisor`, 120, cursorY - 35, 10);
    
//     drawText('THANK YOU', width - 120, cursorY - 35, 14, true);

//     // 3. Serialize and Return
//     const pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: false });

//     return NextResponse.json({ 
//       success: true, 
//       pdfBase64: pdfBase64 
//     });

//   } catch (error) {
//     console.error("Receipt Generation Error:", error);
//     return NextResponse.json({ success: false, message: "Server Error generating receipt" }, { status: 500 });
//   }
// };








// ═══════════════════════════════════════════════════════════════
// FILE: app/api/admin/commissions/receipt/route.ts
// PURPOSE: Fetches one commission record's full data for PDF generation
// CALLED BY: handleDownloadReceipt() in the commissions frontend page
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbconnect";
import { Commission } from "@/app/models/Commission";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Import models so Mongoose can populate them
import "@/app/models/User";
import "@/app/models/TravelOperation";
import "@/app/models/Itinerary";

export const POST = async (req: NextRequest) => {
  await dbConnect();

  try {
    // ── 1. Auth check — admin only ──
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // ── 2. Get the bookingId from request body ──
    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "Missing bookingId" },
        { status: 400 }
      );
    }

    // ── 3. Fetch the commission with all related data populated ──
    const record = await Commission.findById(bookingId)
      .populate("agentId", "name agencyName email phone commissionRate")
      .populate("travelOperationId", "tripName overallStatus")
      .populate("itineraryId", "leadGuestName travelers tripName tripId")
      .lean() as any;

    if (!record) {
      return NextResponse.json(
        { success: false, message: "Commission record not found" },
        { status: 404 }
      );
    }

    // ── 4. Smart client name fallback ──
    let clientName = record.itineraryId?.leadGuestName;
    if (!clientName && record.itineraryId?.travelers?.length > 0) {
      clientName =
        record.itineraryId.travelers[0].name ||
        record.itineraryId.travelers[0].firstName ||
        "Unknown Client";
    }

    // ── 5. Build the clean receipt data object ──
    const receiptData = {
      // Agent info
      agentName    : record.agentId?.name       || "Unknown Agent",
      agencyName   : record.agentId?.agencyName || "Unknown Agency",
      agentEmail   : record.agentId?.email      || "",
      commissionRate: record.agentId?.commissionRate || 70,

      // Trip info
      tripName     : record.travelOperationId?.tripName
                     || record.itineraryId?.tripName
                     || "Unknown Trip",
      tripId       : record.itineraryId?.tripId || "",
      clientName   : clientName || "Unknown Client",

      // Financial info
      totalSalePrice  : record.totalSalePrice   || 0,
      totalNetCost    : record.totalNetCost      || 0,
      grossProfit     : record.grossProfit       || 0,
      agentCut        : record.agentCut          || 0,
      adminCut        : record.adminCut          || 0,
      hostCutPercent  : 100 - (record.agentId?.commissionRate || 70),

      // Status info
      status          : record.status            || "pending",
      paidAt          : record.paidAt            || null,
      createdAt       : record.createdAt,
    };

    // ── 6. Return data — PDF is generated CLIENT-SIDE with jsPDF ──
    return NextResponse.json({ success: true, data: receiptData });

  } catch (error) {
    console.error("Receipt API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
};