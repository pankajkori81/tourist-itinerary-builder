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
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();

    // 🌟 CRITICAL FIX 1: Remove existing MongoDB _id so it creates a fresh one
    delete body._id;
    
    // 🌟 CRITICAL FIX 2: Generate unique IDs to prevent the E11000 duplicate key crash!
    const uniqueId = `TRIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    body.tripId = uniqueId;
    
    // This stops the EXACT error in your logs: "dup key: { itineraryCode: null }"
    body.itineraryCode = uniqueId; 

    const newItinerary = await Itinerary.create(body);
    return NextResponse.json({ success: true, data: newItinerary });
    
  } catch (error: any) { 
    console.error("POST Itinerary Error:", error);
    return NextResponse.json({ success: false, message: "Failed to create itinerary" }, { status: 500 }); 
  }
}

// 🟠 PUT: Update an existing itinerary
export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    
    if (!body._id || !mongoose.Types.ObjectId.isValid(body._id)) {
        return NextResponse.json({ success: false, message: "Missing or Invalid document _id" }, { status: 400 });
    }

    const updatedItinerary = await Itinerary.findByIdAndUpdate(body._id, body, { new: true });
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