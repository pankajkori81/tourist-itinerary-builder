// // ══════════════════════════════════════════════════════════════
// // FILE: app/api/reports/financials/route.ts
// // PURPOSE: Enterprise Financial Analytics & Aggregation Engine
// // ══════════════════════════════════════════════════════════════

// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import dbConnect from "@/app/lib/dbconnect";
// import Trip from "@/app/models/Trip";

// import Operation from "@/app/models/Operation"; // Adjust path to your Operation model

// export const GET = async (req: NextRequest) => {
//   await dbConnect();

//   try {
//     // 1. Session Authentication & Security Check
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized access" },
//         { status: 401 }
//       );
//     }

//     // 2. Parse Query Parameters for Flexible Date Filtering
//     const { searchParams } = new URL(req.url);
//     const timeframe = searchParams.get("timeframe") || "ytd"; // ytd | this_quarter | this_year | all | custom
//     const customStart = searchParams.get("startDate");
//     const customEnd = searchParams.get("endDate");

//     // 3. Compute Dynamic Date Range
//     const now = new Date();
//     let startDate: Date;
//     let endDate: Date = new Date();

//     if (timeframe === "ytd") {
//       startDate = new Date(now.getFullYear(), 0, 1); // Jan 1st of current year
//     } else if (timeframe === "this_quarter") {
//       const currentMonth = now.getMonth();
//       const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
//       startDate = new Date(now.getFullYear(), quarterStartMonth, 1);
//     } else if (timeframe === "this_year") {
//       startDate = new Date(now.getFullYear(), 0, 1);
//     } else if (timeframe === "last_month") {
//       startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//       endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
//     } else if (timeframe === "custom" && customStart && customEnd) {
//       startDate = new Date(customStart);
//       endDate = new Date(customEnd);
//     } else {
//       // Default fallback: past 12 months
//       startDate = new Date();
//       startDate.setFullYear(now.getFullYear() - 1);
//     }

//     const dateMatchFilter = {
//       createdAt: { $gte: startDate, $lte: endDate },
//     };

//     // 4. PIPELINE 1: Calculate Gross Booking Value (GBV) & Monthly Breakdown from Trips
//     const gbvAggregation = await Trip.aggregate([
//       { $match: dateMatchFilter },
//       {
//         $group: {
//           _id: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" },
//           },
//           monthlyGBV: {
//             $sum: {
//               $ifNull: ["$pricing.totalAmount", "$totalBudget", "$price", 0],
//             },
//           },
//           tripCount: { $sum: 1 },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } },
//     ]);

//     // 5. PIPELINE 2: Calculate Supplier Costs from Operations (Unwinding Services)
//     const costAggregation = await Operation.aggregate([
//       { $match: dateMatchFilter },
//       { $unwind: "$services" },
//       {
//         $group: {
//           _id: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" },
//           },
//           monthlyCost: {
//             $sum: {
//               $cond: [
//                 { $gt: ["$services.actualInvoice", 0] },
//                 "$services.actualInvoice",
//                 { $ifNull: ["$services.netCost", 0] },
//               ],
//             },
//           },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } },
//     ]);

//     // 6. Merge Aggregated Data into Unified Monthly Timeline
//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const timelineMap: Record<string, { month: string; gbv: number; cost: number; profit: number }> = {};

//     // Initialize all months in range for smooth charts
//     const tempDate = new Date(startDate);
//     while (tempDate <= endDate) {
//       const key = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, "0")}`;
//       const label = `${monthNames[tempDate.getMonth()]} ${tempDate.getFullYear()}`;
//       timelineMap[key] = { month: label, gbv: 0, cost: 0, profit: 0 };
//       tempDate.setMonth(tempDate.getMonth() + 1);
//     }

//     // Map GBV Results
//     gbvAggregation.forEach((item: { _id: { year: any; month: any; }; monthlyGBV: number; }) => {
//       const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
//       if (timelineMap[key]) {
//         timelineMap[key].gbv = item.monthlyGBV;
//       }
//     });

//     // Map Cost Results & Calculate Profit
//     costAggregation.forEach((item: { _id: { year: any; month: any; }; monthlyCost: number; }) => {
//       const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
//       if (timelineMap[key]) {
//         timelineMap[key].cost = item.monthlyCost;
//       }
//     });

//     // Finalize Timeline Array
//     const chartTimeline = Object.values(timelineMap).map((item) => {
//       item.profit = item.gbv - item.cost;
//       return item;
//     });

//     // 7. Calculate Top-Level Executive KPIs
//     const totalGBV = chartTimeline.reduce((acc, curr) => acc + curr.gbv, 0);
//     const totalCosts = chartTimeline.reduce((acc, curr) => acc + curr.cost, 0);
//     const netProfit = totalGBV - totalCosts;
//     const profitMargin = totalGBV > 0 ? ((netProfit / totalGBV) * 100).toFixed(1) : "0.0";

//     return NextResponse.json({
//       success: true,
//       timeframe,
//       range: { startDate, endDate },
//       kpis: {
//         totalGBV,
//         totalCosts,
//         netProfit,
//         profitMargin: Number(profitMargin),
//       },
//       chartData: chartTimeline,
//     });
//   } catch (error: any) {
//     console.error("Financials Report API Error:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to generate financial report" },
//       { status: 500 }
//     );
//   }
// };

































// ══════════════════════════════════════════════════════════════
// FILE: app/api/reports/financials/route.ts
// PURPOSE: Enterprise Financial Analytics & Aggregation Engine
// ══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/lib/dbconnect";

// 🌟 Correct Import Paths and Names based on your actual models
import Itinerary from "@/app/models/Itinerary";
import { TravelOperation } from "@/app/models/TravelOperation"; // Requires curly braces due to named export

export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    // 1. Session Authentication & Security Check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    // 2. Parse Query Parameters for Flexible Date Filtering
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get("timeframe") || "ytd"; 
    const customStart = searchParams.get("startDate");
    const customEnd = searchParams.get("endDate");

    // 3. Compute Dynamic Date Range
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date();

    if (timeframe === "ytd") {
      startDate = new Date(now.getFullYear(), 0, 1); 
    } else if (timeframe === "this_quarter") {
      const currentMonth = now.getMonth();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      startDate = new Date(now.getFullYear(), quarterStartMonth, 1);
    } else if (timeframe === "this_year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else if (timeframe === "last_month") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    } else if (timeframe === "custom" && customStart && customEnd) {
      startDate = new Date(customStart);
      endDate = new Date(customEnd);
    } else {
      // Default fallback: past 12 months
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 1);
    }

    const dateMatchFilter = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    // 4. PIPELINE 1: Calculate Gross Booking Value (GBV) from Itinerary Model
    const gbvAggregation = await Itinerary.aggregate([
      { $match: dateMatchFilter },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          monthlyGBV: {
            // Mapped to your actual revenue field
            $sum: { $ifNull: ["$finalSellPrice", 0] },
          },
          tripCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // 5. PIPELINE 2: Calculate Supplier Costs from TravelOperation Model
    const costAggregation = await TravelOperation.aggregate([
      { $match: dateMatchFilter },
      { $unwind: "$services" },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          monthlyCost: {
            $sum: {
              $cond: [
                // Mapped to your actual invoice field
                { $gt: ["$services.supplierInvoiceAmount", 0] },
                "$services.supplierInvoiceAmount",
                { $ifNull: ["$services.netCost", 0] },
              ],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // 6. Merge Aggregated Data into Unified Monthly Timeline
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const timelineMap: Record<string, { month: string; gbv: number; cost: number; profit: number }> = {};

    // Initialize all months in range for smooth charts
    const tempDate = new Date(startDate);
    while (tempDate <= endDate) {
      const key = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, "0")}`;
      const label = `${monthNames[tempDate.getMonth()]} ${tempDate.getFullYear()}`;
      timelineMap[key] = { month: label, gbv: 0, cost: 0, profit: 0 };
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    // Map GBV Results
    gbvAggregation.forEach((item: { _id: { year: any; month: any; }; monthlyGBV: number; }) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
      if (timelineMap[key]) {
        timelineMap[key].gbv = item.monthlyGBV;
      }
    });

    // Map Cost Results & Calculate Profit
    costAggregation.forEach((item: { _id: { year: any; month: any; }; monthlyCost: number; }) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
      if (timelineMap[key]) {
        timelineMap[key].cost = item.monthlyCost;
      }
    });

    // Finalize Timeline Array
    const chartTimeline = Object.values(timelineMap).map((item) => {
      item.profit = item.gbv - item.cost;
      return item;
    });

    // 7. Calculate Top-Level Executive KPIs
    const totalGBV = chartTimeline.reduce((acc, curr) => acc + curr.gbv, 0);
    const totalCosts = chartTimeline.reduce((acc, curr) => acc + curr.cost, 0);
    const netProfit = totalGBV - totalCosts;
    const profitMargin = totalGBV > 0 ? ((netProfit / totalGBV) * 100).toFixed(1) : "0.0";

    return NextResponse.json({
      success: true,
      timeframe,
      range: { startDate, endDate },
      kpis: {
        totalGBV,
        totalCosts,
        netProfit,
        profitMargin: Number(profitMargin),
      },
      chartData: chartTimeline,
    });
  } catch (error: any) {
    console.error("Financials Report API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate financial report" },
      { status: 500 }
    );
  }
};
