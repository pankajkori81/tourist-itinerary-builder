// // ══════════════════════════════════════════════════════════════
// // FILE: app/api/share/[token]/route.ts
// // PURPOSE:
// //   GET  → PUBLIC (no auth) — client fetches itinerary by token
// //          STRIPS all sensitive data before sending
// //   ⚠️  This endpoint has NO authentication on purpose —
// //       the token itself IS the security key
// // ══════════════════════════════════════════════════════════════

// import { NextRequest, NextResponse } from "next/server";
// import dbConnect                     from "@/app/lib/dbconnect";
// import ShareLink                     from "@/app/models/ShareLink";
// import Itinerary                     from "@/app/models/Itinerary";

// // Import so Mongoose can populate references
// import "@/app/models/User";

// // ══════════════════════════════════════════════════════════════
// // HELPER: Strip ALL sensitive fields before sending to client
// // This runs on the server — client NEVER sees these fields
// // ══════════════════════════════════════════════════════════════
// const buildClientSafeData = (itinerary: any, shareLink: any) => {
//   return {
//     // ── Trip Identity ────────────────────────────────────────
//     // Safe: client needs to know what trip this is
//     tripId      : itinerary.tripId,
//     tripName    : itinerary.tripName,
//     packageType : itinerary.packageType,
//     tripStyle   : itinerary.tripStyle,
//     tripCategory: itinerary.tripCategory,

//     // ── Destination Info ──────────────────────────────────────
//     // Safe: client needs to know where they're going
//     selectedCountries: itinerary.selectedCountries || [],

//     // ── Duration + Routing ────────────────────────────────────
//     // Safe: city names + nights — NO pricing
//     routingData: itinerary.routingData
//       ? {
//           // Include city/route info
//           routes     : (itinerary.routingData?.routes || []).map((r: any) => ({
//             city   : r.city,
//             nights : r.nights,
//             date   : r.date,
//             // ❌ NO: r.hotelCost, r.netRate, r.supplierRate
//           })),
//           startDate  : itinerary.routingData?.startDate,
//           endDate    : itinerary.routingData?.endDate,
//           startCity  : itinerary.routingData?.startCity,
//           endCity    : itinerary.routingData?.endCity,
//         }
//       : null,

//     // ── Traveler Count ────────────────────────────────────────
//     // Safe: client knows how many pax
//     numberOfTravelers: itinerary.numberOfTravelers,

//     // ── Day-wise Activities ───────────────────────────────────
//     // Safe: activity names, descriptions, timings
//     // ❌ STRIPS: supplier costs, net rates, margins
//     dayWiseActivities: (itinerary.dayWiseActivities || []).map((day: any) => ({
//       dayNumber : day.dayNumber,
//       city      : day.city,
//       date      : day.date,
//       items     : (day.items || []).map((item: any) => ({
//         type        : item.type,        // STAY / ACTIVITY / TRANSPORT / MEAL
//         name        : item.name,
//         description : item.description,
//         isOptional  : item.isOptional,
//         isIncluded  : item.isIncluded,
//         // Hotel details (name only, no cost)
//         hotelName   : item.hotelName   || item.name,
//         roomType    : item.roomType    || "",
//         starRating  : item.starRating  || null,
//         // Activity details
//         slot        : item.slot        || "",
//         duration    : item.duration    || "",
//         startTime   : item.startTime   || "",
//         pickup      : item.pickup      || "",
//         dropoff     : item.dropoff     || "",
//         // Transport details
//         vehicleType : item.vehicleType || "",
//         journeyInfo : item.journeyInfo || "",
//         // ❌ NEVER include:
//         // item.netCost, item.supplierRate, item.margin,
//         // item.costPerPax, item.supplierName + rate
//       })),
//     })),

//     // ── Pricing (SELL PRICE ONLY) ─────────────────────────────
//     // ❌ NEVER send: netCost, margin, markupPercentage
//     // ✅ ONLY send: the final sell price client pays
//     fixedDepartures: (itinerary.fixedDepartures || []).map((d: any) => ({
//       month    : d.month,
//       baseMonth: d.baseMonth,
//       // ✅ Sell prices only
//       priceDBL : d.priceDBL  || 0,   // Double/Twin price
//       priceSGL : d.priceSGL  || 0,   // Single price
//       priceTRP : d.priceTRP  || 0,   // Triple price
//       priceQUD : d.priceQUD  || 0,   // Quad price
//       // ❌ NO: d.netCost, d.margin, d.supplierCost
//     })),

//     // Final sell price (what client pays per person)
//     finalSellPrice : itinerary.finalSellPrice || 0,
//     selectedCurrency: itinerary.selectedCurrency || "USD",

//     // ── Validity ──────────────────────────────────────────────
//     seasonStartDate : itinerary.seasonStartDate,
//     seasonEndDate   : itinerary.seasonEndDate,

//     // ── Share Link Meta (for the client page UI) ──────────────
//     shareInfo: {
//       clientName   : shareLink.clientName,
//       expiresAt    : shareLink.expiresAt,
//       status       : shareLink.status,
//       token        : shareLink.token,
//     },
//   };
// };

// // ══════════════════════════════════════════════════════════════
// // GET: Public endpoint — no auth required
// // Client visits /view/:token → frontend calls this
// // ══════════════════════════════════════════════════════════════
// export const GET = async (
//   req: NextRequest,
//   { params }: { params: Promise<{ token: string }> }
// ) => {
//   await dbConnect();

//   try {
//     // ── 1. Await params (Next.js 15 requirement) ──────────────
//     const { token } = await params;

//     if (!token) {
//       return NextResponse.json(
//         { success: false, message: "Invalid link" },
//         { status: 400 }
//       );
//     }

//     // ── 2. Find ShareLink by token ────────────────────────────
//     const shareLink = await ShareLink.findOne({ token }).lean() as any;

//     // Token not found in DB
//     if (!shareLink) {
//       return NextResponse.json(
//         {
//           success : false,
//           code    : "NOT_FOUND",
//           message : "This link does not exist or has been removed.",
//         },
//         { status: 404 }
//       );
//     }

//     // ── 3. Check if admin deactivated the link ────────────────
//     if (!shareLink.isActive) {
//       return NextResponse.json(
//         {
//           success : false,
//           code    : "DEACTIVATED",
//           message : "This link has been deactivated. Please contact your travel advisor.",
//         },
//         { status: 403 }
//       );
//     }

//     // ── 4. Check expiry ───────────────────────────────────────
//     const now = new Date();
//     if (new Date(shareLink.expiresAt) < now) {
//       // Auto-update status to expired
//       await ShareLink.findByIdAndUpdate(shareLink._id, {
//         status: "expired",
//       });
//       return NextResponse.json(
//         {
//           success   : false,
//           code      : "EXPIRED",
//           message   : "This link has expired. Please contact your travel advisor for a new link.",
//           expiresAt : shareLink.expiresAt,
//         },
//         { status: 410 }
//       );
//     }

//     // ── 5. Fetch itinerary — ALL fields ──────────────────────
//     // We fetch everything, then STRIP sensitive fields in step 7
//     // This way the stripping logic is fully server-side
//     const itinerary = await Itinerary.findById(
//       shareLink.itineraryId
//     ).lean() as any;

//     if (!itinerary) {
//       return NextResponse.json(
//         {
//           success : false,
//           code    : "ITINERARY_NOT_FOUND",
//           message : "Itinerary not found.",
//         },
//         { status: 404 }
//       );
//     }

//     // ── 6. Track view analytics ───────────────────────────────
//     // Update view count + timestamps without blocking response
//     const updateData: any = {
//       $inc          : { viewCount: 1 },
//       lastViewedAt  : now,
//     };
//     // Only set firstViewedAt once
//     if (!shareLink.firstViewedAt) {
//       updateData.firstViewedAt = now;
//     }
//     // Update status from "pending" to "viewed"
//     if (shareLink.status === "pending") {
//       updateData.status = "viewed";
//     }
//     // Fire-and-forget — don't await so response is instant
//     ShareLink.findByIdAndUpdate(shareLink._id, updateData).exec();

//     // ── 7. Strip ALL sensitive data ───────────────────────────
//     // buildClientSafeData removes costs, margins, supplier rates
//     // Client NEVER sees anything sensitive
//     const clientSafeData = buildClientSafeData(itinerary, shareLink);

//     // ── 8. Return safe data ───────────────────────────────────
//     return NextResponse.json({
//       success : true,
//       data    : clientSafeData,
//     });

//   } catch (error: any) {
//     console.error("Share Token GET Error:", error);
//     return NextResponse.json(
//       { success: false, message: "Server Error" },
//       { status: 500 }
//     );
//   }
// };



























































// ══════════════════════════════════════════════════════════════
// FILE: app/api/share/[token]/route.ts
// PURPOSE:
//   GET  → PUBLIC (no auth) — client fetches itinerary by token
//          STRIPS all sensitive data before sending
// ══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import dbConnect                     from "@/app/lib/dbconnect";
import ShareLink                     from "@/app/models/ShareLink";
import Itinerary                     from "@/app/models/Itinerary";

import "@/app/models/User";

// ══════════════════════════════════════════════════════════════
// HELPER: Strip ALL sensitive fields before sending to client
// ══════════════════════════════════════════════════════════════
const buildClientSafeData = (itinerary: any, shareLink: any) => {
  return {
    tripId      : itinerary.tripId,
    tripName    : itinerary.tripName,
    packageType : itinerary.packageType,
    tripStyle   : itinerary.tripStyle,
    tripCategory: itinerary.tripCategory,
    selectedCountries: itinerary.selectedCountries || [],
    numberOfTravelers: itinerary.numberOfTravelers,
    finalSellPrice : itinerary.finalSellPrice || 0,
    selectedCurrency: itinerary.selectedCurrency || "USD",
    seasonStartDate : itinerary.seasonStartDate,
    seasonEndDate   : itinerary.seasonEndDate,

    // 🌟 FIX 1: Keep 'cities' array exactly as frontend expects it
    routingData: itinerary.routingData
      ? {
          routes: (itinerary.routingData?.routes || []).map((r: any) => ({
            cities : r.cities, // Do not change this to r.city
            nights : r.nights,
            date   : r.date,
          })),
          startDate  : itinerary.routingData?.startDate,
          endDate    : itinerary.routingData?.endDate,
          startCity  : itinerary.routingData?.startCity,
          endCity    : itinerary.routingData?.endCity,
        }
      : null,

    // 🌟 FIX 2: Explicitly map activities, stays, transports, meals instead of 'items'
    dayWiseActivities: (itinerary.dayWiseActivities || []).map((day: any) => ({
      dayNumber : day.dayNumber,
      city      : day.city,
      date      : day.date,
      
      activities: (day.activities || []).map((a: any) => ({
        category: 'Activity', heading: a.heading, description: a.description, 
        slot: a.slot, duration: a.duration, startTime: a.startTime, 
        pickupLocation: a.pickupLocation, dropoffLocation: a.dropoffLocation, 
        inclusionType: a.inclusionType
      })),
      
      stays: (day.stays || []).map((s: any) => ({
        category: 'Stay', hotelName: s.hotelName, rating: s.rating, 
        roomCategory: s.roomCategory, inclusionType: s.inclusionType, 
        status: s.status, checkIn: s.checkIn, checkOut: s.checkOut,
        nights: s.nights
      })),
      
      transports: (day.transports || []).map((t: any) => ({
        category: 'Transport', mode: t.mode, vehicleType: t.vehicleType, 
        flightNumber: t.flightNumber, pickupTime: t.pickupTime, 
        pickupLocation: t.pickupLocation, dropoffTime: t.dropoffTime, 
        dropoffLocation: t.dropoffLocation, duration: t.duration, 
        flightStops: t.flightStops, layoverInfo: t.layoverInfo,
        serviceDescription: t.serviceDescription, subType: t.subType, 
        inclusionType: t.inclusionType, arrivalDayOffset: t.arrivalDayOffset
      })),
      
      meals: (day.meals || []).map((m: any) => ({
        category: 'Meal', mealType: m.mealType, restaurantName: m.restaurantName, 
        cuisine: m.cuisine, inclusionType: m.inclusionType
      }))
    })),

    // ── Pricing (SELL PRICE ONLY) ──
    fixedDepartures: (itinerary.fixedDepartures || []).map((d: any) => ({
      month    : d.month,
      baseMonth: d.baseMonth,
      priceDBL : d.priceDBL  || 0,
      priceSGL : d.priceSGL  || 0,
      priceTRP : d.priceTRP  || 0,
      priceQUD : d.priceQUD  || 0,
    })),

    shareInfo: {
      clientName   : shareLink.clientName,
      expiresAt    : shareLink.expiresAt,
      status       : shareLink.status,
      token        : shareLink.token,
    },
  };
};

// ══════════════════════════════════════════════════════════════
// GET: Public endpoint — no auth required
// ══════════════════════════════════════════════════════════════
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) => {
  await dbConnect();

  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ success: false, message: "Invalid link" }, { status: 400 });
    }

    const shareLink = await ShareLink.findOne({ token }).lean() as any;

    if (!shareLink) {
      return NextResponse.json({ success: false, code: "NOT_FOUND", message: "This link does not exist." }, { status: 404 });
    }

    if (!shareLink.isActive) {
      return NextResponse.json({ success: false, code: "DEACTIVATED", message: "This link has been deactivated." }, { status: 403 });
    }

    const now = new Date();
    if (new Date(shareLink.expiresAt) < now) {
      await ShareLink.findByIdAndUpdate(shareLink._id, { status: "expired" });
      return NextResponse.json({ success: false, code: "EXPIRED", message: "This link has expired." }, { status: 410 });
    }

    const itinerary = await Itinerary.findById(shareLink.itineraryId).lean() as any;

    if (!itinerary) {
      return NextResponse.json({ success: false, code: "ITINERARY_NOT_FOUND", message: "Itinerary not found." }, { status: 404 });
    }

    const updateData: any = { $inc: { viewCount: 1 }, lastViewedAt: now };
    if (!shareLink.firstViewedAt) updateData.firstViewedAt = now;
    if (shareLink.status === "pending") updateData.status = "viewed";
    
    ShareLink.findByIdAndUpdate(shareLink._id, updateData).exec();

    // Run the updated buildClientSafeData function
    const clientSafeData = buildClientSafeData(itinerary, shareLink);

    return NextResponse.json({ success: true, data: clientSafeData });

  } catch (error: any) {
    console.error("Share Token GET Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};