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

































// // ══════════════════════════════════════════════════════════════
// // FILE: app/api/reports/financials/route.ts
// // PURPOSE: Enterprise Financial Analytics & Aggregation Engine
// // ══════════════════════════════════════════════════════════════

// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import dbConnect from "@/app/lib/dbconnect";

// // 🌟 Correct Import Paths and Names based on your actual models
// import Itinerary from "@/app/models/Itinerary";
// import { TravelOperation } from "@/app/models/TravelOperation"; // Requires curly braces due to named export

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
//     const timeframe = searchParams.get("timeframe") || "ytd"; 
//     const customStart = searchParams.get("startDate");
//     const customEnd = searchParams.get("endDate");

//     // 3. Compute Dynamic Date Range
//     const now = new Date();
//     let startDate: Date;
//     let endDate: Date = new Date();

//     if (timeframe === "ytd") {
//       startDate = new Date(now.getFullYear(), 0, 1); 
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

//     // 4. PIPELINE 1: Calculate Gross Booking Value (GBV) from Itinerary Model
//     const gbvAggregation = await Itinerary.aggregate([
//       { $match: dateMatchFilter },
//       {
//         $group: {
//           _id: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" },
//           },
//           monthlyGBV: {
//             // Mapped to your actual revenue field
//             $sum: { $ifNull: ["$finalSellPrice", 0] },
//           },
//           tripCount: { $sum: 1 },
//         },
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } },
//     ]);

//     // 5. PIPELINE 2: Calculate Supplier Costs from TravelOperation Model
//     const costAggregation = await TravelOperation.aggregate([
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
//                 // Mapped to your actual invoice field
//                 { $gt: ["$services.supplierInvoiceAmount", 0] },
//                 "$services.supplierInvoiceAmount",
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

import Itinerary from "@/app/models/Itinerary";
import { TravelOperation } from "@/app/models/TravelOperation";

// Helper for percentage change
const calcTrend = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? "+100.0%" : "0.0%";
  const percent = ((current - previous) / previous) * 100;
  return `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`;
};

export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    // 1. Session Authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    // 2. Parse Query Parameters
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get("timeframe") || "ytd";
    
    // 3. Compute Dynamic Date Ranges (Current vs Previous Period)
    const now = new Date();
    let currStart: Date, currEnd: Date = new Date();
    let prevStart: Date, prevEnd: Date;

    if (timeframe === "ytd") {
      currStart = new Date(now.getFullYear(), 0, 1);
      prevStart = new Date(now.getFullYear() - 1, 0, 1);
      prevEnd = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()); 
    } else if (timeframe === "this_quarter") {
      const qStartMonth = Math.floor(now.getMonth() / 3) * 3;
      currStart = new Date(now.getFullYear(), qStartMonth, 1);
      prevStart = new Date(now.getFullYear(), qStartMonth - 3, 1);
      prevEnd = new Date(now.getFullYear(), qStartMonth, 0, 23, 59, 59);
    } else if (timeframe === "last_month") {
      currStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      currEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      prevStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      prevEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59);
    } else {
      // Default: Last 12 months
      currStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      prevStart = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
      prevEnd = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate() - 1);
    }

    const currentFilter = { createdAt: { $gte: currStart, $lte: currEnd } };
    const previousFilter = { createdAt: { $gte: prevStart, $lte: prevEnd } };

    // 4. FIRE ALL AGGREGATIONS CONCURRENTLY FOR MAXIMUM PERFORMANCE
    const [
      currGbvAgg, currCostAgg, 
      prevGbvAgg, prevCostAgg,
      destinationsAgg, servicesAgg,
      clientLiquidityAgg, supplierPayablesAgg
    ] = await Promise.all([
      
      // -- CURRENT TIMELINE AGGS --
      Itinerary.aggregate([
        { $match: currentFilter },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, gbv: { $sum: { $ifNull: ["$finalSellPrice", 0] } } } }
      ]),
      TravelOperation.aggregate([
        { $match: currentFilter },
        { $unwind: "$services" },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, cost: { $sum: { $cond: [{ $gt: ["$services.supplierInvoiceAmount", 0] }, "$services.supplierInvoiceAmount", { $ifNull: ["$services.netCost", 0] }] } } } }
      ]),

      // -- PREVIOUS PERIOD AGGS (For Trends) --
      Itinerary.aggregate([
        { $match: previousFilter },
        { $group: { _id: null, totalGBV: { $sum: { $ifNull: ["$finalSellPrice", 0] } } } }
      ]),
      TravelOperation.aggregate([
        { $match: previousFilter },
        { $unwind: "$services" },
        { $group: { _id: null, totalCost: { $sum: { $cond: [{ $gt: ["$services.supplierInvoiceAmount", 0] }, "$services.supplierInvoiceAmount", { $ifNull: ["$services.netCost", 0] }] } } } }
      ]),

      // -- DESTINATION BREAKDOWN --
      Itinerary.aggregate([
        { $match: currentFilter },
        { $unwind: "$selectedCountries" },
        { $group: { _id: "$selectedCountries", volume: { $sum: "$finalSellPrice" } } },
        { $sort: { volume: -1 } },
        { $limit: 5 }
      ]),

      // -- SERVICE COST BREAKDOWN --
      TravelOperation.aggregate([
        { $match: currentFilter },
        { $unwind: "$services" },
        // Mapped to accurate field: services.serviceType
        { $group: { _id: { $ifNull: ["$services.serviceType", "OTHER"] }, cost: { $sum: { $cond: [{ $gt: ["$services.supplierInvoiceAmount", 0] }, "$services.supplierInvoiceAmount", { $ifNull: ["$services.netCost", 0] }] } } } },
        { $sort: { cost: -1 } }
      ]),

      // -- CLIENT LIQUIDITY (Receivables) --
      Itinerary.aggregate([
        { $match: { ...currentFilter } },
        { $group: { 
            _id: null, 
            totalBilled: { $sum: "$finalSellPrice" }, 
            // Defaulting to 0 since Itinerary schema does not currently track 'amountPaid'
            totalReceived: { $sum: 0 } 
          } 
        }
      ]),

      // -- SUPPLIER LIQUIDITY (Payables) --
      TravelOperation.aggregate([
        { $match: currentFilter },
        { $unwind: "$services" },
        // Match only services that are not fully paid
        { $match: { "services.paymentStatus": { $in: ["Unpaid", "Deposit Paid"] } } },
        { $group: { 
            _id: null, 
            pendingAmount: { $sum: { $cond: [{ $gt: ["$services.supplierInvoiceAmount", 0] }, "$services.supplierInvoiceAmount", { $ifNull: ["$services.netCost", 0] }] } } 
          } 
        }
      ])
    ]);

    // 5. PROCESS CHART TIMELINE
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const timelineMap: Record<string, { month: string; gbv: number; cost: number; profit: number }> = {};

    let tempDate = new Date(currStart);
    while (tempDate <= currEnd) {
      const key = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, "0")}`;
      timelineMap[key] = { month: `${monthNames[tempDate.getMonth()]} ${tempDate.getFullYear()}`, gbv: 0, cost: 0, profit: 0 };
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    currGbvAgg.forEach((item: any) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
      if (timelineMap[key]) timelineMap[key].gbv = item.gbv;
    });

    currCostAgg.forEach((item: any) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
      if (timelineMap[key]) timelineMap[key].cost = item.cost;
    });

    const chartData = Object.values(timelineMap).map(item => {
      item.profit = item.gbv - item.cost;
      return item;
    });

    // 6. PROCESS KPIs & TRENDS
    const currTotalGBV = chartData.reduce((acc, curr) => acc + curr.gbv, 0);
    const currTotalCost = chartData.reduce((acc, curr) => acc + curr.cost, 0);
    const currNetProfit = currTotalGBV - currTotalCost;
    const currMargin = currTotalGBV > 0 ? (currNetProfit / currTotalGBV) * 100 : 0;

    const prevTotalGBV = prevGbvAgg[0]?.totalGBV || 0;
    const prevTotalCost = prevCostAgg[0]?.totalCost || 0;
    const prevNetProfit = prevTotalGBV - prevTotalCost;
    const prevMargin = prevTotalGBV > 0 ? (prevNetProfit / prevTotalGBV) * 100 : 0;

    // 7. PROCESS LIQUIDITY
    const awaitingFromClients = clientLiquidityAgg[0] ? (clientLiquidityAgg[0].totalBilled - clientLiquidityAgg[0].totalReceived) : 0;
    const pendingToSuppliers = supplierPayablesAgg[0]?.pendingAmount || 0; 

    // 8. FINAL JSON RESPONSE
    return NextResponse.json({
      success: true,
      timeframe,
      kpis: {
        current: {
          totalGBV: currTotalGBV,
          totalCosts: currTotalCost,
          netProfit: currNetProfit,
          profitMargin: Number(currMargin.toFixed(1))
        },
        previous: {
          totalGBV: prevTotalGBV,
          totalCosts: prevTotalCost,
          netProfit: prevNetProfit,
          profitMargin: Number(prevMargin.toFixed(1))
        },
        trends: {
          gbvChange: calcTrend(currTotalGBV, prevTotalGBV),
          profitChange: calcTrend(currNetProfit, prevNetProfit)
        }
      },
      liquidity: {
        awaitingFromClients: Math.max(0, awaitingFromClients),
        pendingToSuppliers: Math.max(0, pendingToSuppliers)
      },
      breakdowns: {
        byDestination: destinationsAgg.map((d: any) => ({ 
          country: d._id, 
          profit: d.volume * (currMargin / 100 || 0.15) // Estimated profit share based on volume
        })),
        byService: servicesAgg.map((s: any) => ({ 
          name: s._id, 
          cost: s.cost 
        }))
      },
      chartData
    });

  } catch (error: any) {
    console.error("Financials Report API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate financial report" },
      { status: 500 }
    );
  }
};


