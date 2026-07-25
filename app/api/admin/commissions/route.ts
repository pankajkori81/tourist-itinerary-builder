import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import dbConnect from "@/app/lib/dbconnect";
import { Commission } from "@/app/models/Commission";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

// IMPORTANT: Import related models so Mongoose knows about them for .populate()
import User from "@/app/models/User";
import { TravelOperation } from "@/app/models/TravelOperation";
import Itinerary from "@/app/models/Itinerary";


import "@/app/models/TravelOperation"; 
import "@/app/models/Itinerary";       
import "@/app/models/User";


// 👇 FIX: New Helper to verify Admin access using NextAuth
async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  
  // Check if session exists AND if the user's role is admin
  if (!session || (session.user as any).role !== "admin") {
    return null;
  }
  
  return session.user;
}

export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized Admin Access" }, { status: 403 });
    }

    // Fetch all commissions and populate the relational data
    const ledger = await Commission.find()
      .populate("agentId", "name agencyName")
      .populate("travelOperationId", "tripName overallStatus")
      // 👇 FIX: Added 'travelers' and 'tripName' to the populate list so the map function can see them!
      .populate("itineraryId", "leadGuestName travelers tripName tripId")
      .sort({ createdAt: -1 }) // Newest first
      .lean();
      
    // Map the data slightly to match what your frontend table expects
    const formattedLedger = ledger.map((record: any) => {
      
      // Smart Client Name Fallback
      let displayClientName = record.itineraryId?.leadGuestName;
      if (!displayClientName && record.itineraryId?.travelers?.length > 0) {
          displayClientName = record.itineraryId.travelers[0].name || record.itineraryId.travelers[0].firstName;
      }

      return {
        _id: record._id,
        itineraryName: record.travelOperationId?.tripName || record.itineraryId?.tripName || "Unknown Trip",
        clientName: displayClientName || "Unknown Client",
        totalSalePrice: record.totalSalePrice, // 👈 NEW: Exposing the total client payment
        totalNetCost: record.totalNetCost,     // 👈 NEW: Exposing the total supplier cost
        totalGrossProfit: record.grossProfit,
        agentCutAmount: record.agentCut,
        adminCutAmount: record.adminCut,
        payoutStatus: record.status.toLowerCase(), 
        createdAt: record.createdAt,
        agentId: record.agentId 
      };
    });

    return NextResponse.json({ success: true, data: formattedLedger });
  } catch (error) {
    console.error("Fetch Commissions Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};

// ==========================================
// 2. PUT: Mark a Commission as 'Paid'
// ==========================================
export const PUT = async (req: NextRequest) => {
  await dbConnect();

  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized Admin Access" }, { status: 403 });
    }

    const { bookingId } = await req.json(); // Note: Frontend sends `bookingId`

    if (!bookingId) {
      return NextResponse.json({ success: false, message: "Missing commission record ID" }, { status: 400 });
    }

    const updatedCommission = await Commission.findByIdAndUpdate(
      bookingId,
      { 
        $set: { 
          status: 'Paid', 
          paidAt: new Date() 
        } 
      },
      { new: true }
    );

    if (!updatedCommission) {
      return NextResponse.json({ success: false, message: "Commission record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Marked as paid successfully", data: updatedCommission });

  } catch (error) {
    console.error("Update Commission Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};