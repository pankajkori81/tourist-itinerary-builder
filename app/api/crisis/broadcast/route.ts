import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbconnect";
import Itinerary from "@/app/models/Itinerary";

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const { itineraryIds, message, channel } = body; 
        // channel could be 'email', 'sms', or 'whatsapp'

        if (!itineraryIds || !Array.isArray(itineraryIds) || itineraryIds.length === 0) {
            return NextResponse.json({ success: false, message: "No travelers selected for broadcast." }, { status: 400 });
        }

        if (!message) {
            return NextResponse.json({ success: false, message: "Broadcast message cannot be empty." }, { status: 400 });
        }

        // 1. Fetch all the affected itineraries to get the traveler details
        const affectedTrips = await Itinerary.find({ _id: { $in: itineraryIds } });

        let successCount = 0;
        let failedCount = 0;

        // 2. Loop through each trip and "send" the message
        for (const trip of affectedTrips) {
            try {
                // Here is where you will eventually connect Twilio (for SMS/WhatsApp) or SendGrid/Nodemailer (for Email)
                // Example: await sendTwilioSMS(trip.customerPhone, message);
                
                // For now, we simulate a successful send and log it for the Admin
                console.log(`[SOS ALERT SENT via ${channel.toUpperCase()}] To Trip: ${trip.tripId} | Lead Guest: ${trip.leadGuestName}`);
                console.log(`Message: ${message}`);
                
                // Update the lastPingedAt time in the database so we know when we reached out
                await Itinerary.findByIdAndUpdate(trip._id, {
                    $set: { "crisisManagement.lastPingedAt": new Date() }
                });

                successCount++;
            } catch (err) {
                console.error(`Failed to send to trip ${trip.tripId}:`, err);
                failedCount++;
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: `Broadcast complete. Sent: ${successCount}, Failed: ${failedCount}` 
        });

    } catch (error) {
        console.error("Crisis Broadcast Error:", error);
        return NextResponse.json({ success: false, message: "Failed to send mass broadcast" }, { status: 500 });
    }
} 


