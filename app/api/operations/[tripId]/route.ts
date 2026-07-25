// // // app/api/operations/[tripId]/route.ts
// import { NextResponse } from 'next/server';
// import dbConnect from '@/app/lib/dbconnect'; // Adjust path if needed
// import { TravelOperation } from '@/app/models/TravelOperation';


// // 🌟 THE FIX: { params } must be a Promise
// export async function GET(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
//   try {
//     await dbConnect();
    
//     // 🌟 THE FIX: Await params
//     const { tripId } = await params;
    
//     console.log("Fetching operations for:", tripId);
    
//     const operation = await TravelOperation.findOne({ tripId: tripId });
    
//     if (!operation) {
//       console.log("Manifest not found for ID:", tripId);
//       return NextResponse.json({ error: 'Operation manifest not found' }, { status: 404 });
//     }

//     return NextResponse.json(operation, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching operation:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }




import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect'; 
import { TravelOperation } from '@/app/models/TravelOperation';
// 👇 NEW IMPORTS: We need these to fetch the Client and Agent details
import Itinerary from '@/app/models/Itinerary';
import User from '@/app/models/User';

// 🌟 THE FIX: { params } must be a Promise
export async function GET(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    await dbConnect();
    
    // Await params
    const { tripId } = await params;
    
    console.log("Fetching operations for:", tripId);
    
    // 1. Fetch the raw operation document using .lean() so we can inject new properties into it
    const operation = await TravelOperation.findOne({ tripId: tripId }).lean();
    
    if (!operation) {
      console.log("Manifest not found for ID:", tripId);
      return NextResponse.json({ error: 'Operation manifest not found' }, { status: 404 });
    }

    // 2. Initialize our default Context Header Data
    let contextData = {
        tripName: operation.tripName || "Unknown Trip",
        clientName: "Unknown Client",
        agentName: "Internal Sale",
        startDate: "TBA",
        endDate: "TBA",
        duration: "N/A"
    };

    // 3. Fetch the attached Itinerary to get Client and Date info
    if (operation.itineraryId) {
        const itinerary = await Itinerary.findById(operation.itineraryId).lean();
        
        if (itinerary) {
            // Smart Client Name Fallback (Just like we did in Commissions!)
            let displayClientName = itinerary.leadGuestName;
            if (!displayClientName && itinerary.travelers && itinerary.travelers.length > 0) {
                displayClientName = itinerary.travelers[0].name || itinerary.travelers[0].firstName;
            }
            contextData.clientName = displayClientName || "Unknown Client";

            // Extract Exact Dates and Duration
            if (itinerary.routingData) {
                contextData.startDate = itinerary.routingData.startDate || "TBA";
                contextData.endDate = itinerary.routingData.endDate || "TBA";
                
                if (itinerary.routingData.routes) {
                    const totalNights = itinerary.routingData.routes.reduce((acc: number, r: any) => acc + (parseInt(r.nights) || 0), 0);
                    contextData.duration = `${totalNights + 1} Days / ${totalNights} Nights`;
                }
            }

            // 4. Fetch the attached Agent to see who sold it
            if (itinerary.assignedAgentId) {
                const agent = await User.findById(itinerary.assignedAgentId).lean();
                if (agent) {
                    contextData.agentName = `${agent.name} (${agent.agencyName || 'Independent'})`;
                }
            }
        }
    }

    // 5. Package it all together. We spread `...operation` so your existing frontend code 
    // doesn't break, and attach `tripContext` for our new banner.
    return NextResponse.json({
        ...operation,
        tripContext: contextData
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching operation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}