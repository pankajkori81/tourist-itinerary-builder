// ══════════════════════════════════════════════════════════════
// FILE: app/api/reports/sales/route.ts
// PURPOSE: Sales Pipeline & Agent Performance Analytics
// ══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/lib/dbconnect";

import Lead from "@/app/models/Lead";
import Itinerary from "@/app/models/Itinerary";
import User from "@/app/models/User"; // Required for $lookup population

export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get("timeframe") || "ytd";
    
    // 1. Compute Dynamic Date Ranges
    const now = new Date();
    let currStart: Date, currEnd: Date = new Date();

    if (timeframe === "ytd") {
      currStart = new Date(now.getFullYear(), 0, 1);
    } else if (timeframe === "this_quarter") {
      const qStartMonth = Math.floor(now.getMonth() / 3) * 3;
      currStart = new Date(now.getFullYear(), qStartMonth, 1);
    } else if (timeframe === "last_month") {
      currStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      currEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    } else {
      currStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }

    const dateFilter = { createdAt: { $gte: currStart, $lte: currEnd } };

    // 2. CONCURRENT AGGREGATIONS FOR PERFORMANCE
    const [leadPipeline, agentLeaderboard, totalAgents] = await Promise.all([
      
      // A. Lead Funnel Aggregation
    Lead.aggregate([
        { $match: dateFilter },
        { $group: { 
            _id: "$status", 
            count: { $sum: 1 },
            pipelineValue: { $sum: "$budget" } // Calculates the money on the table
        }}
      ]),

      // B. Agent Leaderboard (Closed Revenue)
      Itinerary.aggregate([
        // Only count Won/Closed itineraries that are assigned to an agent
        { $match: { ...dateFilter, bookingStatus: { $in: ['confirmed', 'completed'] }, assignedAgentId: { $ne: null } } },
        { $group: { 
            _id: "$assignedAgentId", 
            totalRevenue: { $sum: "$finalSellPrice" },
            dealsClosed: { $sum: 1 }
        }},
        // Join with User collection to get Agent Details
        { $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "agentDetails"
        }},
        { $unwind: "$agentDetails" },
        { $project: {
            agentId: "$_id",
            name: "$agentDetails.name",
            avatar: "$agentDetails.profilePicture",
            role: "$agentDetails.role",
            totalRevenue: 1,
            dealsClosed: 1
        }},
        { $sort: { totalRevenue: -1 } } // Sort highest revenue first
      ]),

      // C. Get active sales staff count for KPIs
      User.countDocuments({ role: { $in: ["admin", "employee", "agent"] }, status: "active" })
    ]);

    // 3. PROCESS FUNNEL DATA
    const funnelMap: Record<string, { count: number, value: number }> = { 
      'New': { count: 0, value: 0 }, 
      'Contacted': { count: 0, value: 0 }, 
      'Quoted': { count: 0, value: 0 }, 
      'Won': { count: 0, value: 0 }, 
      'Lost': { count: 0, value: 0 } 
    };
    let totalLeads = 0;
    let wonLeads = 0;

    leadPipeline.forEach(stage => {
      const status = stage._id as string;
      if (funnelMap[status] !== undefined) {
        funnelMap[status].count = stage.count;
        funnelMap[status].value = stage.pipelineValue || 0;
        totalLeads += stage.count;
        if (status === 'Won') wonLeads = stage.count;
      }
    });

    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0.0";


    // 4. RETURN PAYLOAD
  return NextResponse.json({
      success: true,
      timeframe,
      kpis: {
        totalLeads,
        conversionRate: Number(conversionRate),
        activeAgents: totalAgents
      },
      funnel: [
        { stage: "New", count: funnelMap['New'].count, value: funnelMap['New'].value, color: "bg-slate-200 text-slate-700" },
        { stage: "Contacted", count: funnelMap['Contacted'].count, value: funnelMap['Contacted'].value, color: "bg-indigo-100 text-indigo-700" },
        { stage: "Quoted", count: funnelMap['Quoted'].count, value: funnelMap['Quoted'].value, color: "bg-amber-100 text-amber-700" },
        { stage: "Won", count: funnelMap['Won'].count, value: funnelMap['Won'].value, color: "bg-emerald-100 text-emerald-700" },
        { stage: "Lost", count: funnelMap['Lost'].count, value: funnelMap['Lost'].value, color: "bg-rose-100 text-rose-700" }
      ],
      leaderboard: agentLeaderboard
    });

  } catch (error: any) {
    console.error("Sales Analytics API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate sales report" },
      { status: 500 }
    );
  }
};