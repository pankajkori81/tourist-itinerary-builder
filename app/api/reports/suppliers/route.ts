// import { NextResponse } from "next/server";
// import dbConnect from "@/app/lib/dbconnect";
// import { TravelOperation } from "@/app/models/TravelOperation";
// import Supplier from "@/app/models/Supplier";

// export async function GET(req: Request) {
//   await dbConnect();

//   try {
//     // 1. Aggregate: Spend by Service Type (For the Pie Chart)
//  // 1. Aggregate: Spend by Service Type (For the Pie Chart)
//     const spendByType = await TravelOperation.aggregate([
//       { $unwind: "$services" },
//       { $match: { "services.status": "Confirmed" } }, 
//       { 
//         $group: { 
//           _id: "$services.serviceType",
//           // FIX: Force MongoDB to treat these as numbers (doubles) so the math actually works
//           rawInvoice: { $sum: { $convert: { input: "$services.supplierInvoiceAmount", to: "double", onError: 0, onNull: 0 } } },
//           netCost: { $sum: { $convert: { input: "$services.netCost", to: "double", onError: 0, onNull: 0 } } }
//         } 
//       },
//       {
//         $project: {
//           // Fall back to netCost if invoice is 0
//           value: { $cond: [{ $gt: ["$rawInvoice", 0] }, "$rawInvoice", "$netCost"] }
//         }
//       },
//       // Hide slices that equal 0 so the chart doesn't break
//       { $match: { value: { $gt: 0 } } }, 
//       { $sort: { value: -1 } }
//     ]);

//     // 2. Aggregate: Top Suppliers & Cost Leakage
//     const supplierPerformance = await TravelOperation.aggregate([
//       { $unwind: "$services" },
//       { 
//         $match: { 
//           "services.status": "Confirmed",
//           "services.supplierId": { $exists: true, $ne: "" }
//         } 
//       },
//       {
//         $group: {
//           _id: "$services.supplierId",
//           // FIX: Use actual invoice amount, but if it is 0, fall back to netCost
//           totalSpend: { 
//             $sum: { 
//               $cond: [{ $gt: ["$services.supplierInvoiceAmount", 0] }, "$services.supplierInvoiceAmount", "$services.netCost"] 
//             } 
//           },
//           expectedCost: { $sum: "$services.netCost" }
//         }
//       },
//       // FIX: Advanced lookup that checks both custom ID (TD/SP/...) AND standard Mongo _id
//       {
//         $lookup: {
//           from: "suppliers",
//           let: { opSupplierId: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $or: [
//                     { $eq: ["$supplierId", "$$opSupplierId"] },
//                     { $eq: [{ $toString: "$_id" }, "$$opSupplierId"] }
//                   ]
//                 }
//               }
//             }
//           ],
//           as: "supplierDetails"
//         }
//       },
//       { $unwind: { path: "$supplierDetails", preserveNullAndEmptyArrays: true } },
//       {
//         $project: {
//           name: { $ifNull: ["$supplierDetails.name", "Unknown Supplier"] },
//           totalSpend: 1,
//           expectedCost: 1,
//           // Calculate leakage normally
//           leakage: { $subtract: ["$totalSpend", "$expectedCost"] }
//         }
//       },
//       { $sort: { totalSpend: -1 } },
//       { $limit: 10 }
//     ]);

//     const colorMap: Record<string, string> = {
//       "hotel": "#818cf8",
//       "flight": "#34d399",
//       "transport": "#fbbf24",
//       "activity": "#f87171",
//       "meal": "#a78bfa"
//     };

//  const formattedSpend = spendByType.map(item => ({
//       // Safely check if _id exists before capitalizing
//       name: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : "Other",
//       value: item.value,
//       color: colorMap[item._id] || "#94a3b8"
//     }));

//     return NextResponse.json({
//       success: true,
//       spendByType: formattedSpend,
//       topSuppliers: supplierPerformance
//     });

//   } catch (error: any) {
//     console.error("❌ OPERATIONS REPORT ERROR:", error);
//     return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
//   }
// }



































import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbconnect";
import { TravelOperation } from "@/app/models/TravelOperation";
import Supplier from "@/app/models/Supplier";

export async function GET(req: Request) {
  await dbConnect();

  try {
    // 1. Aggregate: Spend by Service Type (For the Pie Chart)
    const spendByType = await TravelOperation.aggregate([
      { $unwind: "$services" },
      { $match: { "services.status": "Confirmed" } }, 
      { 
        $group: { 
          _id: "$services.serviceType",
          rawInvoice: { $sum: { $convert: { input: "$services.supplierInvoiceAmount", to: "double", onError: 0, onNull: 0 } } },
          netCost: { $sum: { $convert: { input: "$services.netCost", to: "double", onError: 0, onNull: 0 } } }
        } 
      },
      {
        $project: {
          value: { $cond: [{ $gt: ["$rawInvoice", 0] }, "$rawInvoice", "$netCost"] }
        }
      },
      { $match: { value: { $gt: 0 } } }, 
      { $sort: { value: -1 } }
    ]);

    // 2. Aggregate: Top Suppliers & Cost Leakage (UPGRADED)
    const supplierPerformance = await TravelOperation.aggregate([
      { $unwind: "$services" },
      { 
        $match: { 
          "services.status": "Confirmed",
          "services.supplierId": { $exists: true, $ne: "" }
        } 
      },
      {
        $group: {
          _id: "$services.supplierId",
          totalSpend: { 
            $sum: { 
              $cond: [{ $gt: ["$services.supplierInvoiceAmount", 0] }, "$services.supplierInvoiceAmount", "$services.netCost"] 
            } 
          },
          expectedCost: { $sum: "$services.netCost" },
          totalBookings: { $sum: 1 } // NEW: Count transaction volume
        }
      },
      {
        $lookup: {
          from: "suppliers",
          let: { opSupplierId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$supplierId", "$$opSupplierId"] },
                    { $eq: [{ $toString: "$_id" }, "$$opSupplierId"] }
                  ]
                }
              }
            }
          ],
          as: "supplierDetails"
        }
      },
      { $unwind: { path: "$supplierDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: { $ifNull: ["$supplierDetails.name", "Unknown Supplier"] },
          totalSpend: 1,
          expectedCost: 1,
          totalBookings: 1,
          leakage: { $subtract: ["$totalSpend", "$expectedCost"] },
          // NEW: Calculate percentage variance to determine Risk Status
          variance: {
            $cond: [
              { $eq: ["$expectedCost", 0] },
              0,
              { $multiply: [{ $divide: [{ $subtract: ["$totalSpend", "$expectedCost"] }, "$expectedCost"] }, 100] }
            ]
          }
        }
      },
      { $sort: { totalSpend: -1 } },
      { $limit: 10 }
    ]);

    // 3. Aggregate: Executive KPI Ribbon Data (NEW)
    const kpiAgg = await TravelOperation.aggregate([
      { $unwind: "$services" },
      { $match: { "services.status": "Confirmed", "services.supplierId": { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: null,
          totalSpend: {
            $sum: { $cond: [{ $gt: ["$services.supplierInvoiceAmount", 0] }, "$services.supplierInvoiceAmount", "$services.netCost"] }
          },
          expectedCost: { $sum: "$services.netCost" },
          uniqueSuppliers: { $addToSet: "$services.supplierId" }
        }
      }
    ]);

    const kpiResult = kpiAgg[0] || { totalSpend: 0, expectedCost: 0, uniqueSuppliers: [] };
    const totalLeakage = kpiResult.totalSpend - kpiResult.expectedCost;
    const variancePercent = kpiResult.expectedCost > 0 ? (totalLeakage / kpiResult.expectedCost) * 100 : 0;

    const kpis = {
      totalSpend: kpiResult.totalSpend,
      totalLeakage: totalLeakage,
      activeSuppliers: kpiResult.uniqueSuppliers.length,
      variancePercent: variancePercent
    };

    // 4. Aggregate: Time-Series Trend Data (NEW)
    // Assumes documents have a 'createdAt' timestamp. 
    const trendAgg = await TravelOperation.aggregate([
      { $unwind: "$services" },
      { $match: { "services.status": "Confirmed" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          expectedCost: { $sum: "$services.netCost" },
          actualCost: {
            $sum: { $cond: [{ $gt: ["$services.supplierInvoiceAmount", 0] }, "$services.supplierInvoiceAmount", "$services.netCost"] }
          }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);

    const formattedTrends = trendAgg.map(item => {
      // Convert "2026-08" to "Aug"
      const date = new Date(item._id + "-01T00:00:00");
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        expectedCost: item.expectedCost,
        actualCost: item.actualCost
      };
    });

    const colorMap: Record<string, string> = {
      "hotel": "#818cf8",
      "flight": "#34d399",
      "transport": "#fbbf24",
      "activity": "#f87171",
      "meal": "#a78bfa"
    };

    const formattedSpend = spendByType.map(item => ({
      name: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : "Other",
      value: item.value,
      color: colorMap[item._id] || "#94a3b8"
    }));

    return NextResponse.json({
      success: true,
      kpis,                    // ADDED
      trendData: formattedTrends, // ADDED
      spendByType: formattedSpend,
      topSuppliers: supplierPerformance
    });

  } catch (error: any) {
    console.error("❌ OPERATIONS REPORT ERROR:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}