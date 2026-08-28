// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/app/lib/dbconnect";
// import Itinerary from "@/app/models/Itinerary";

// // 🟢 GET: Fetch all itineraries (or one specific ID)
// export async function GET(req: NextRequest) {
//   await dbConnect();
//   try {
//     const id = req.nextUrl.searchParams.get("id");
    
//     if (id) {
//        // Return single itinerary
//        const itinerary = await Itinerary.findById(id);
//        if (!itinerary) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
//        return NextResponse.json({ success: true, data: itinerary });
//     } else {
//        // Return all itineraries for Library Page
//        const itineraries = await Itinerary.find({}).sort({ updatedAt: -1 });
//        return NextResponse.json({ success: true, data: itineraries });
//     }
//   } catch (error) { 
//     console.error("GET Itinerary Error:", error);
//     return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 }); 
//   }
// }

// // 🔵 POST: Create a brand new itinerary
// export async function POST(req: NextRequest) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const newItinerary = await Itinerary.create(body);
//     return NextResponse.json({ success: true, data: newItinerary });
//   } catch (error: any) { 
//     console.error("POST Itinerary Error:", error);
//     return NextResponse.json({ success: false, message: "Failed to create itinerary" }, { status: 500 }); 
//   }
// }

// // 🟠 PUT: Update an existing itinerary
// export async function PUT(req: NextRequest) {
//   await dbConnect();
//   try {
//     const body = await req.json();
    
//     if (!body._id) {
//         return NextResponse.json({ success: false, message: "Missing document _id" }, { status: 400 });
//     }

//     const updatedItinerary = await Itinerary.findByIdAndUpdate(body._id, body, { new: true });
//     return NextResponse.json({ success: true, data: updatedItinerary });
//   } catch (error: any) { 
//     console.error("PUT Itinerary Error:", error);
//     return NextResponse.json({ success: false, message: "Failed to update itinerary" }, { status: 500 }); 
//   }
// }

// // 🔴 DELETE: Remove an itinerary
// export async function DELETE(req: NextRequest) {
//   await dbConnect();
//   try {
//     const id = req.nextUrl.searchParams.get("id");
//     if (!id) return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });

//     await Itinerary.findByIdAndDelete(id);
//     return NextResponse.json({ success: true, message: "Deleted successfully" });
//   } catch (error: any) { 
//     console.error("DELETE Itinerary Error:", error);
//     return NextResponse.json({ success: false, message: "Failed to delete itinerary" }, { status: 500 }); 
//   }
// }





































import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbconnect";
import Itinerary from "@/app/models/Itinerary";
import mongoose from "mongoose";
import User from "@/app/models/User";
import { TravelOperation } from "@/app/models/TravelOperation";
import { Commission } from "@/app/models/Commission";

// 🟢 GET: Fetch all itineraries (or one specific ID)
export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const id = req.nextUrl.searchParams.get("id");
    
    if (id) {
       // 👇 SAFETY CHECK: Ensure ID is valid Mongo Format before searching
       if (!mongoose.Types.ObjectId.isValid(id)) {
           return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 });
       }
       const itinerary = await Itinerary.findById(id);
       if (!itinerary) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
       return NextResponse.json({ success: true, data: itinerary });
    } else {
       const itineraries = await Itinerary.find({}).sort({ updatedAt: -1 });
       return NextResponse.json({ success: true, data: itineraries });
    }
  } catch (error) { 
    console.error("GET Itinerary Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 }); 
  }
}




// 🔵 POST: Create a brand new itinerary (Or Clone an existing one)
// export async function POST(req: NextRequest) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     // 🌟 CRITICAL FIX 1: Remove existing MongoDB _id so it creates a fresh one
//     delete body._id;
    
//     // 🌟 CRITICAL FIX 2: Generate unique IDs to prevent the E11000 duplicate key crash!
//     const uniqueId = `TRIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//     body.tripId = uniqueId;
    
//     // This stops the EXACT error in your logs: "dup key: { itineraryCode: null }"
//     body.itineraryCode = uniqueId; 

//     const newItinerary = await Itinerary.create(body);
//     return NextResponse.json({ success: true, data: newItinerary });
    
//   } catch (error: any) { 
//     console.error("POST Itinerary Error:", error);
//     return NextResponse.json({ success: false, message: "Failed to create itinerary" }, { status: 500 }); 
//   }
// }



// export async function POST(req: NextRequest) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     // 🌟 CRITICAL FIX 1: Remove existing MongoDB _id so it creates a fresh one
//     delete body._id;
    
//     // 🔧 CHANGED: only generate a fallback tripId if the client didn't already
//     // send a real one. Previously this line ran unconditionally and overwrote
//     // the correctly-computed smart ID (e.g. "1-AT50-2026") from the Intro page
//     // on every single create, which is why new trips always showed as
//     // "ID Pending..." in the Library until a second (PUT) save fixed it.
//     if (!body.tripId) {
//         const uniqueId = `TRIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//         body.tripId = uniqueId;
//     }
    
//     // 🔧 CHANGED: same guard for itineraryCode — only fall back if missing,
//     // and reuse the real tripId when one exists instead of a second random value.
//     if (!body.itineraryCode) {
//         body.itineraryCode = body.tripId || `TRIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//     }

//     const newItinerary = await Itinerary.create(body);
//     return NextResponse.json({ success: true, data: newItinerary });
    
//   } catch (error: any) { 
//     console.error("POST Itinerary Error:", error);
//     return NextResponse.json({ success: false, message: "Failed to create itinerary" }, { status: 500 }); 
//   }
// }



export async function POST(req: NextRequest) {
  await dbConnect();
  let parsedBody: any = null; // captured outside try so the catch block can safely reuse it

  try {
    const body = await req.json();
    parsedBody = body;

    // Remove existing MongoDB _id so it creates a fresh one
    delete body._id;

    // Only generate a fallback tripId if the client didn't already send one —
    // this is what makes the correctly-computed smart ID (e.g. "3-ZA50-2026")
    // from the Intro page actually get saved, instead of being overwritten.
    if (!body.tripId) {
        const uniqueId = `TRIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        body.tripId = uniqueId;
    }

    if (!body.itineraryCode) {
        body.itineraryCode = body.tripId || `TRIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    const newItinerary = await Itinerary.create(body);
    return NextResponse.json({ success: true, data: newItinerary });

  } catch (error: any) {
    console.error("POST Itinerary Error:", error);

    // 🔧 SAFETY NET: if this exact tripId/itineraryCode already exists
    // (e.g. a leftover record from earlier testing, or a genuine rare
    // collision), don't throw a hard 500 at the employee. Instead, look up
    // the existing document and return it as a success — the frontend
    // still gets a valid real _id to work with, and the user just sees
    // their save go through normally.
    if (error?.code === 11000) {
      const conflictTripId = error?.keyValue?.itineraryCode || error?.keyValue?.tripId || parsedBody?.tripId;

      if (conflictTripId) {
        try {
          const existing = await Itinerary.findOne({
            $or: [{ tripId: conflictTripId }, { itineraryCode: conflictTripId }]
          });
          if (existing) {
            return NextResponse.json({ success: true, data: existing });
          }
        } catch (lookupError) {
          console.error("E11000 recovery lookup failed:", lookupError);
        }
      }

      return NextResponse.json(
        { success: false, message: "A trip with this ID already exists. Please refresh the page and try again." },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: false, message: "Failed to create itinerary" }, { status: 500 });
  }
}


// 🟠 PUT: Update an existing itinerary
export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const { _id, bookingStatus, ...updateData } = body;
    
    // Safety check from your original code
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
        return NextResponse.json({ success: false, message: "Missing or Invalid document _id" }, { status: 400 });
    }

    // 1. Update the Itinerary
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      _id, 
      { $set: { bookingStatus, ...updateData } }, 
      { new: true }
    );

    if (!updatedItinerary) {
        return NextResponse.json({ success: false, message: "Itinerary not found" }, { status: 404 });
    }

    // 2. 🚨 THE COMMISSION TRIGGER 🚨
    // BACK TO SECURE MODE: Only triggers when a trip is actually finalized
    const currentStatus = bookingStatus || updatedItinerary.bookingStatus;
    if (
      (currentStatus === 'confirmed' || currentStatus === 'completed') && 
      updatedItinerary.assignedAgentId
    ) {
      await generateCommissionRecord(updatedItinerary._id);
    }

    return NextResponse.json({ success: true, data: updatedItinerary });
  } catch (error: any) { 
    console.error("PUT Itinerary Error:", error);
    return NextResponse.json({ success: false, message: "Failed to update itinerary" }, { status: 500 }); 
  }
}


// 🔴 DELETE: Remove an itinerary
export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const id = req.nextUrl.searchParams.get("id");
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ success: false, message: "Missing or Invalid ID" }, { status: 400 });
    }

    await Itinerary.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) { 
    console.error("DELETE Itinerary Error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete itinerary" }, { status: 500 }); 
  }
}






// ==========================================
// THE COMMISSION GENERATION HELPER LOGIC
// ==========================================
async function generateCommissionRecord(itineraryId: string) {
  try {
    // 1. Fetch Itinerary
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary || !itinerary.assignedAgentId) return;

    // 2. Fetch Agent for their commission rate
    const agent = await User.findById(itinerary.assignedAgentId);
    if (!agent || agent.role !== 'agent') return;

    // 3. Fetch Travel Operations for the Net Cost
    // const operation = await TravelOperation.findOne({ itineraryId: itinerary._id });

    const operation = await TravelOperation.findOne({ itineraryId: String(itinerary._id) });
    if (!operation) {
      console.warn(`No TravelOperation found for Itinerary ${itineraryId}. Cannot calculate commission.`);
      return; 
    }

    // 4. Calculate Total Net Cost from all services
    let totalNetCost = 0;
    if (operation.services && operation.services.length > 0) {
      operation.services.forEach((service: any) => {
        totalNetCost += (Number(service.netCost) || 0);
      });
    }

    // 5. Calculate Financials
    const totalSalePrice = Number(itinerary.finalSellPrice) || 0;
    const grossProfit = totalSalePrice - totalNetCost;
    
    // Prevent negative commissions if a trip was sold at a loss
    const safeGrossProfit = grossProfit > 0 ? grossProfit : 0; 
    
    const commissionRateApplied = Number(agent.commissionRate) || 0;
    const agentCut = safeGrossProfit * (commissionRateApplied / 100);
    const adminCut = safeGrossProfit - agentCut;

    // 6. Save to Ledger using UPSERT with $setOnInsert fix
    await Commission.findOneAndUpdate(
      { itineraryId: itinerary._id }, 
      {
        $set: {
          agentId: agent._id,
          travelOperationId: operation._id,
          totalSalePrice,
          totalNetCost,
          grossProfit: safeGrossProfit,
          commissionRateApplied,
          agentCut,
          adminCut
        },
        // 👇 This ensures 'status' is ONLY set on creation, never overwritten to Pending if they were already paid.
        $setOnInsert: {
          status: 'Pending'
        }
      },
      { upsert: true, new: true } 
    );

    console.log(`Commission generated/updated for Itinerary: ${itineraryId}`);

  } catch (error) {
    console.error("Failed to generate commission record:", error);
  }
}