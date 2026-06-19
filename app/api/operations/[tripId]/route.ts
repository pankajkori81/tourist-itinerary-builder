// // app/api/operations/[tripId]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect'; // Adjust path if needed
import { TravelOperation } from '@/app/models/TravelOperation';


// 🌟 THE FIX: { params } must be a Promise
export async function GET(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    await dbConnect();
    
    // 🌟 THE FIX: Await params
    const { tripId } = await params;
    
    console.log("Fetching operations for:", tripId);
    
    const operation = await TravelOperation.findOne({ tripId: tripId });
    
    if (!operation) {
      console.log("Manifest not found for ID:", tripId);
      return NextResponse.json({ error: 'Operation manifest not found' }, { status: 404 });
    }

    return NextResponse.json(operation, { status: 200 });
  } catch (error) {
    console.error('Error fetching operation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// export async function GET(request: Request, { params }: { params: { tripId: string } }) {
//   try {
//     await dbConnect();
    
//     const operation = await TravelOperation.findOne({ tripId: params.tripId });
    
//     if (!operation) {
//       return NextResponse.json({ error: 'Operation manifest not found' }, { status: 404 });
//     }

//     return NextResponse.json(operation, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching operation:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }



// export async function GET(request: Request, { params }: { params: { tripId: string } }) {
//   try {
//     await dbConnect();
    
//     // Log what tripId is coming in
//     console.log("Fetching operations for:", params.tripId);
    
//     const operation = await TravelOperation.findOne({ tripId: params.tripId });
    
//     // Log what we found
//     console.log("Found operation:", operation);
    
//     if (!operation) {
//       return NextResponse.json({ error: 'Operation manifest not found' }, { status: 404 });
//     }

//     return NextResponse.json(operation, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching operation:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }










// // app/api/operations/[tripId]/route.ts
// export async function GET(request: Request, { params }: { params: Promise<{ tripId: string }> }) {
//   try {
//     await dbConnect();
    
//     // 👇 THIS IS THE FIX: Unwrap params
//     const { tripId } = await params;
    
//     console.log("Fetching operations for:", tripId);
    
//     const operation = await TravelOperation.findOne({ tripId: tripId });
    
//     console.log("Found operation:", operation);
    
//     if (!operation) {
//       return NextResponse.json({ error: 'Operation manifest not found' }, { status: 404 });
//     }

//     return NextResponse.json(operation, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching operation:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// } 












