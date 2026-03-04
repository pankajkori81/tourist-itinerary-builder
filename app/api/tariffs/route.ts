import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbconnect";
import Tariff from "@/app/models/Tariff";

// GET: Fetch all tariffs (or a specific one if serviceId is passed)
export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const serviceId = req.nextUrl.searchParams.get("serviceId");
    
    if (serviceId) {
       // Fetch for a specific hotel/transport
       const tariff = await Tariff.findOne({ serviceId });
       return NextResponse.json({ success: true, data: tariff });
    } else {
       // Fetch all tariffs for the dashboard
       const tariffs = await Tariff.find({}).sort({ updatedAt: -1 });
       return NextResponse.json({ success: true, data: tariffs });
    }
  } catch (error) { 
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 }); 
  }
}

// POST: Create a new Tariff block for a service
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    
    // Check if a tariff already exists for this service to prevent duplicates
    const existing = await Tariff.findOne({ serviceId: body.serviceId });
    if (existing) {
        return NextResponse.json({ success: false, message: "Tariff already exists for this service. Use PUT to update." }, { status: 400 });
    }

    const newTariff = await Tariff.create(body);
    return NextResponse.json({ success: true, data: newTariff });
  } catch (error: any) { 
    console.error("Tariff Creation Error:", error);
    return NextResponse.json({ success: false, message: "Failed to save tariff" }, { status: 500 }); 
  }
}

// PUT: Update an existing Tariff (e.g., adding a new season)
export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const updated = await Tariff.findByIdAndUpdate(body._id, body, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) { 
    return NextResponse.json({ success: false, message: "Failed to update tariff" }, { status: 500 }); 
  }
}