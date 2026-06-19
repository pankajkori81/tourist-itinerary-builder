// // app/api/operations/generate/route.ts
// import { NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import dbConnect from '@/app/lib/dbconnect';
// // Import your DB connection utility here (e.g., import connectDB from '@/lib/mongodb')

// // Ensure TravelOperation model is available without relying on path aliases
// const TravelOperation = (mongoose.models && mongoose.models.TravelOperation)
//   ? mongoose.models.TravelOperation
//   : mongoose.model(
//       'TravelOperation',
//       new mongoose.Schema(
//         {
//           tripId: { type: String },
//           tripName: { type: String },
//           itineraryId: { type: String },
//           overallStatus: { type: String },
//           services: { type: Array },
//         },
//         { timestamps: true }
//       )
//     );

// export async function POST(request: Request) {
//   try {
//     await dbConnect(); // Ensure your DB is connected

//     const body = await request.json();
//     const { tripId, tripName, itineraryId, dayPlans } = body;

//     if (!tripId || !dayPlans) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     // 1. Check if an operation document already exists for this trip
//     const existingOp = await TravelOperation.findOne({ tripId });
//     if (existingOp) {
//       return NextResponse.json({ error: 'Operations manifest already exists for this trip.' }, { status: 400 });
//     }

//     // 2. Flatten the DayPlans into a single checklist
//     const extractedServices: any[] = [];

//     dayPlans.forEach((day: any) => {
//       // Extract Stays (Hotels)
//       day.stays?.forEach((stay: any) => {
//         // Skip "Residence" (Continued stays) so we don't book the same hotel 3 times!
//         if (stay.status !== 'Residence' && stay.inclusionType !== 'excluded') {
//           extractedServices.push({
//             serviceType: 'hotel',
//             serviceName: stay.hotelName,
//             linkedItemId: stay.id?.toString(),
//             dayNumber: day.dayNumber,
//             supplierId: stay.linkedSupplierId || '',
//           });
//         }
//       });

//       // Extract Transports
//       day.transports?.forEach((transport: any) => {
//         if (transport.inclusionType !== 'excluded') {
//           extractedServices.push({
//             serviceType: transport.mode === 'flight' ? 'flight' : 'transport',
//             serviceName: transport.vehicleType || 'Transport',
//             linkedItemId: transport.id?.toString(),
//             dayNumber: day.dayNumber,
//             supplierId: transport.linkedSupplierId || '',
//           });
//         }
//       });

//       // Extract Activities
//       day.activities?.forEach((activity: any) => {
//         if (activity.inclusionType !== 'excluded') {
//           extractedServices.push({
//             serviceType: 'activity',
//             serviceName: activity.heading,
//             linkedItemId: activity.id?.toString(),
//             dayNumber: day.dayNumber,
//             supplierId: activity.linkedSupplierId || '',
//           });
//         }
//       });

//       // Extract Meals
//       day.meals?.forEach((meal: any) => {
//         if (meal.inclusionType !== 'excluded') {
//           extractedServices.push({
//             serviceType: 'meal',
//             serviceName: meal.restaurantName || meal.mealType,
//             linkedItemId: meal.id?.toString(),
//             dayNumber: day.dayNumber,
//             supplierId: meal.linkedSupplierId || '',
//           });
//         }
//       });
//     });

//     // 3. Save to MongoDB
//     const newOperation = await TravelOperation.create({
//       tripId,
//       tripName,
//       itineraryId,
//       overallStatus: 'Pending',
//       services: extractedServices
//     });

//     return NextResponse.json({ message: 'Operations manifest generated successfully!', operation: newOperation }, { status: 201 });

//   } catch (error) {
//     console.error('Error generating operations:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }










// app/api/operations/generate/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect';

// 👇 1. IMPORT THE ACTUAL MODEL WE CREATED (Adjust path if your models folder is elsewhere)
import { TravelOperation } from '@/app/models/TravelOperation'; 

export async function POST(request: Request) {
  try {
    await dbConnect(); // Ensure your DB is connected

    const body = await request.json();
    const { tripId, tripName, itineraryId, dayPlans } = body;

    if (!tripId || !dayPlans) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Check if an operation document already exists for this trip
    const existingOp = await TravelOperation.findOne({ tripId });
    if (existingOp) {
      return NextResponse.json({ error: 'Operations manifest already exists for this trip.' }, { status: 400 });
    }

    // 2. Flatten the DayPlans into a single checklist
    const extractedServices: any[] = [];

    dayPlans.forEach((day: any) => {
      // Extract Stays (Hotels)
      day.stays?.forEach((stay: any) => {
        // Skip "Residence" (Continued stays) so we don't book the same hotel 3 times!
        if (stay.status !== 'Residence' && stay.inclusionType !== 'excluded') {
          extractedServices.push({
            serviceType: 'hotel',
            serviceName: stay.hotelName,
            linkedItemId: stay.id?.toString(),
            dayNumber: day.dayNumber,
            supplierId: stay.linkedSupplierId || '',
          });
        }
      });

      // Extract Transports
      day.transports?.forEach((transport: any) => {
        if (transport.inclusionType !== 'excluded') {
          extractedServices.push({
            serviceType: transport.mode === 'flight' ? 'flight' : 'transport',
            serviceName: transport.vehicleType || 'Transport',
            linkedItemId: transport.id?.toString(),
            dayNumber: day.dayNumber,
            supplierId: transport.linkedSupplierId || '',
          });
        }
      });

      // Extract Activities
      day.activities?.forEach((activity: any) => {
        if (activity.inclusionType !== 'excluded') {
          extractedServices.push({
            serviceType: 'activity',
            serviceName: activity.heading,
            linkedItemId: activity.id?.toString(),
            dayNumber: day.dayNumber,
            supplierId: activity.linkedSupplierId || '',
          });
        }
      });

      // Extract Meals
      day.meals?.forEach((meal: any) => {
        if (meal.inclusionType !== 'excluded') {
          extractedServices.push({
            serviceType: 'meal',
            serviceName: meal.restaurantName || meal.mealType,
            linkedItemId: meal.id?.toString(),
            dayNumber: day.dayNumber,
            supplierId: meal.linkedSupplierId || '',
          });
        }
      });
    });

    // 3. Save to MongoDB
    const newOperation = await TravelOperation.create({
      tripId,
      tripName,
      itineraryId,
      overallStatus: 'Pending',
      services: extractedServices
    });

    return NextResponse.json({ message: 'Operations manifest generated successfully!', operation: newOperation }, { status: 201 });

  } catch (error) {
    console.error('Error generating operations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}