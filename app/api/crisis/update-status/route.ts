import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbconnect";
import Itinerary from "@/app/models/Itinerary";

export async function PUT(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const { id, safetyStatus, emergencyNotes } = body;

        if (!id || !safetyStatus) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Updates the crisis Management block we added in Step 1
        const updatedTrip = await Itinerary.findByIdAndUpdate(
            id,
            { 
                $set: { 
                    "crisisManagement.safetyStatus": safetyStatus,
                    "crisisManagement.emergencyNotes": emergencyNotes || '',
                    "crisisManagement.lastPingedAt": new Date() // Records the exact time of the update
                } 
            },
            { new: true }
        );

        return NextResponse.json({ success: true, data: updatedTrip });

    } catch (error) {
        console.error("Crisis Update Error:", error);
        return NextResponse.json({ success: false, message: "Failed to update status" }, { status: 500 });
    }
}