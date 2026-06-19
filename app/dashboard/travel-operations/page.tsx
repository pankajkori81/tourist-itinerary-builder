// // app/dashboard/travel-operations/page.tsx
// import { redirect } from 'next/navigation';
// import dbConnect from '@/app/lib/dbconnect';
// import { TravelOperation } from '@/app/models/TravelOperation';

// export default async function TravelOperationsRoot() {
//     try {
//         await dbConnect();
        
//         // Find the trip you were most recently working on
//         const latestOp = await TravelOperation.findOne()
//             .sort({ updatedAt: -1 }) 
//             .lean();

//         if (latestOp && latestOp.tripId) {
//             // Instantly redirect the sidebar click to that specific trip!
//             redirect(`/dashboard/travel-operations/${latestOp.tripId}`);
//         } else {
//             redirect('/dashboard/trips');
//         }
//     } catch (error) {
//         redirect('/dashboard/trips');
//     }
// }




// import { redirect } from 'next/navigation';
// import dbConnect from '@/app/lib/dbconnect';
// import { TravelOperation } from '@/app/models/TravelOperation';

// export const dynamic = 'force-dynamic'; // Ensures it doesn't cache an old redirect

// export default async function TravelOperationsRoot() {
//     try {
//         await dbConnect();
        
//         // Search for the most recently worked-on trip
//         const latestOp = await TravelOperation.findOne()
//             .sort({ updatedAt: -1 }) 
//             .lean();

//         if (latestOp && latestOp.tripId) {
//             // 🟢 SUCCESS: Instantly redirect to the latest trip's manifest!
//             redirect(`/dashboard/travel-operations/${latestOp.tripId}`);
//         } else {
//             // 🟡 FALLBACK: No recent trips found. Route to the Global Ledger instead!
//             redirect('/dashboard/travel-operations/ledger');
//         }
//     } catch (error) {
//         console.error("Operations Redirect Error:", error);
//         // 🔴 ERROR: If database connection fails, safely route to Ledger
//         redirect('/dashboard/travel-operations/ledger');
//     }
// }



import { redirect } from 'next/navigation';
import dbConnect from '@/app/lib/dbconnect';
import { TravelOperation } from '@/app/models/TravelOperation';

export const dynamic = 'force-dynamic';

export default async function TravelOperationsRoot() {
    // 1. Set the default destination (The Fallback)
    let destination = '/dashboard/travel-operations/ledger';

    try {
        await dbConnect();
        
        // 2. Search for the most recently worked-on trip
        const latestOp = await TravelOperation.findOne()
            .sort({ updatedAt: -1 }) 
            .lean();

        if (latestOp && latestOp.tripId) {
            // 3. If found, update the destination!
            destination = `/dashboard/travel-operations/${latestOp.tripId}`;
        }
    } catch (error) {
        console.error("Database check failed, using default ledger redirect:", error);
    }

    // 4. Execute the redirect OUTSIDE of the try-catch block!
    redirect(destination);
}