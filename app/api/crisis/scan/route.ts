// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/app/lib/dbconnect";
// import Itinerary from "@/app/models/Itinerary";

// export async function GET(req: NextRequest) {
//     await dbConnect();
//     try {
//         const searchParams = req.nextUrl.searchParams;
//         const dangerLocation = searchParams.get('location')?.toLowerCase();

//         if (!dangerLocation) {
//             return NextResponse.json({ success: false, message: "Location is required" }, { status: 400 });
//         }

//         // 1. Fetch only confirmed trips. (We filter dates in JS because 'Mixed' type schemas can have unpredictable date strings)
//         const activeTrips = await Itinerary.find({ bookingStatus: 'confirmed' });

//         const today = new Date();
//         today.setHours(0, 0, 0, 0); // Reset to midnight for accurate day calculation
//         const todayTime = today.getTime();

//         const affectedTravelers: any[] = [];

//         activeTrips.forEach(trip => {
//             if (!trip.routingData || !trip.routingData.startDate) return;

//             const startDate = new Date(trip.routingData.startDate);
//             let endDate = trip.routingData.endDate ? new Date(trip.routingData.endDate) : new Date(startDate);
            
//             // Fallback: If no explicit end date, calculate it from the total nights
//             if (!trip.routingData.endDate && trip.routingData.routes) {
//                 const totalNights = trip.routingData.routes.reduce((acc: number, route: any) => acc + (parseInt(route.nights) || 0), 0);
//                 endDate.setDate(startDate.getDate() + totalNights);
//             }

//             // 2. Check if the trip is happening RIGHT NOW
//             if (todayTime >= startDate.getTime() && todayTime <= endDate.getTime()) {
                
//                 // 3. Calculate exactly what day of the itinerary they are on today
//                 const diffTime = Math.abs(todayTime - startDate.getTime());
//                 const currentDayNumber = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // e.g., Day 3

//                 // Find today's specific day plan
//                 const todaysPlan = (trip.dayWiseActivities || []).find((d: any) => d.dayNumber === currentDayNumber);
//                 const currentCity = todaysPlan ? todaysPlan.city : 'Unknown Transit';

//                 // 4. Check if their overall country OR their exact city today matches the Danger Zone
//                 const isCountryMatch = (trip.selectedCountries || []).some((c: string) => c.toLowerCase().includes(dangerLocation));
//                 const isCityMatch = currentCity.toLowerCase().includes(dangerLocation);

//                 if (isCountryMatch || isCityMatch) {
                    
//                     // Extract Hotel and Transport contacts specifically for TODAY
//                     let todayHotel = null;
//                     let todayDriver = null;

//                     if (todaysPlan) {
//                         if (todaysPlan.stays && todaysPlan.stays.length > 0) todayHotel = todaysPlan.stays[0];
//                         if (todaysPlan.transports && todaysPlan.transports.length > 0) todayDriver = todaysPlan.transports[0];
//                     }

//                     affectedTravelers.push({
//                         _id: trip._id,
//                         tripId: trip.tripId,
//                         leadGuestName: trip.leadGuestName || 'Unknown Guest',
//                         pax: trip.numberOfTravelers || 1,
//                         agentId: trip.assignedAgentId || null,
//                         currentDay: currentDayNumber,
//                         currentCity: currentCity,
//                         safetyStatus: trip.crisisManagement?.safetyStatus || 'none',
//                         lastPingedAt: trip.crisisManagement?.lastPingedAt || null,
//                         emergencyNotes: trip.crisisManagement?.emergencyNotes || '',
//                         todayLogistics: {
//                             hotelName: todayHotel?.hotelName || 'No Hotel Today',
//                             hotelSupplierId: todayHotel?.linkedSupplierId || null, 
//                             transportType: todayDriver?.vehicleType || 'No Transport Today',
//                             transportSupplierId: todayDriver?.linkedSupplierId || null
//                         }
//                     });
//                 }
//             }
//         });

//         return NextResponse.json({ success: true, data: affectedTravelers });

//     } catch (error) {
//         console.error("Crisis Scan Error:", error);
//         return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
//     }
// } 













// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/app/lib/dbconnect";
// import Itinerary from "@/app/models/Itinerary";

// export async function GET(req: NextRequest) {
//     await dbConnect();
//     try {
//         const searchParams = req.nextUrl.searchParams;
//         const dangerLocation = searchParams.get('location')?.toLowerCase();

//         if (!dangerLocation) {
//             return NextResponse.json({ success: false, message: "Location is required" }, { status: 400 });
//         }

//         // 🌟 FIX: Added .lean() to ensure 'Mixed' schema types are read perfectly as plain JSON objects
//         const activeTrips = await Itinerary.find({ bookingStatus: 'confirmed' }).lean();

//         const today = new Date();
//         today.setHours(0, 0, 0, 0); 
//         const todayTime = today.getTime();

//         const affectedTravelers: any[] = [];

//         activeTrips.forEach((trip: any) => {
//             if (!trip.routingData || !trip.routingData.startDate) return;

//             const startDate = new Date(trip.routingData.startDate);
//             let endDate = trip.routingData.endDate ? new Date(trip.routingData.endDate) : new Date(startDate);
            
//             // Fallback: Calculate end date from total nights
//             if (!trip.routingData.endDate && trip.routingData.routes) {
//                 const totalNights = trip.routingData.routes.reduce((acc: number, route: any) => acc + (parseInt(route.nights) || 0), 0);
//                 endDate.setDate(startDate.getDate() + totalNights);
//             }

//             // Check if the trip is happening RIGHT NOW
//             if (todayTime >= startDate.getTime() && todayTime <= endDate.getTime()) {
                
//                 const diffTime = Math.abs(todayTime - startDate.getTime());
//                 const currentDayNumber = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

//                 const todaysPlan = (trip.dayWiseActivities || []).find((d: any) => d.dayNumber === currentDayNumber);
//                 const currentCity = todaysPlan ? todaysPlan.city : 'Unknown Transit';

//                 const isCountryMatch = (trip.selectedCountries || []).some((c: string) => c.toLowerCase().includes(dangerLocation));
//                 const isCityMatch = currentCity.toLowerCase().includes(dangerLocation);

//                 if (isCountryMatch || isCityMatch) {
                    
//                     let todayHotel = null;
//                     let todayDriver = null;

//                     if (todaysPlan) {
//                         if (todaysPlan.stays && todaysPlan.stays.length > 0) todayHotel = todaysPlan.stays[0];
//                         if (todaysPlan.transports && todaysPlan.transports.length > 0) todayDriver = todaysPlan.transports[0];
//                     }

//                     affectedTravelers.push({
//                         _id: trip._id,
//                         tripId: trip.tripId,
//                         leadGuestName: trip.leadGuestName || 'Unknown Guest',
//                         pax: trip.numberOfTravelers || 1,
//                         agentId: trip.assignedAgentId || null,
//                         currentDay: currentDayNumber,
//                         currentCity: currentCity,
//                         safetyStatus: trip.crisisManagement?.safetyStatus || 'none',
//                         lastPingedAt: trip.crisisManagement?.lastPingedAt || null,
//                         emergencyNotes: trip.crisisManagement?.emergencyNotes || '',
//                         todayLogistics: {
//                             hotelName: todayHotel?.hotelName || 'No Hotel Today',
//                             hotelSupplierId: todayHotel?.linkedSupplierId || null, 
//                             transportType: todayDriver?.vehicleType || 'No Transport Today',
//                             transportSupplierId: todayDriver?.linkedSupplierId || null
//                         }
//                     });
//                 }
//             }
//         });

//         return NextResponse.json({ success: true, data: affectedTravelers });

//     } catch (error) {
//         console.error("Crisis Scan Error:", error);
//         return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
//     }
// } 













// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/app/lib/dbconnect";
// import Itinerary from "@/app/models/Itinerary";

// // --- FREE GEOCODING FUNCTION ---
// // We use a simple cache so if 50 people are in "Rome", we only ask the API once.
// const coordsCache: Record<string, { lat: number, lng: number }> = {};

// async function getCoordinates(city: string) {
//     if (coordsCache[city]) return coordsCache[city];
    
//     try {
//         const res = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&limit=1`, {
//             // OpenStreetMap requires a User-Agent for their free tier
//             headers: { 'User-Agent': 'Travdek-Enterprise-DutyOfCare/1.0' }
//         });
//         const data = await res.json();
        
//         if (data && data.length > 0) {
//             const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
//             coordsCache[city] = coords;
//             return coords;
//         }
//     } catch (error) {
//         console.error(`Geocoding failed for ${city}:`, error);
//     }
    
//     return { lat: 0, lng: 0 }; // Fallback if city isn't found
// }

// export async function GET(req: NextRequest) {
//     await dbConnect();
//     try {
//         const searchParams = req.nextUrl.searchParams;
//         const dangerLocation = searchParams.get('location')?.toLowerCase();

//         if (!dangerLocation) {
//             return NextResponse.json({ success: false, message: "Location is required" }, { status: 400 });
//         }

//         const activeTrips = await Itinerary.find({ bookingStatus: 'confirmed' }).lean();

//         const today = new Date();
//         today.setHours(0, 0, 0, 0); 
//         const todayTime = today.getTime();

//         const affectedTravelers: any[] = [];

//         // We use a regular for...of loop here instead of forEach because we need to use 'await' for the coordinates
//         for (const trip of activeTrips as any[]) {
//             if (!trip.routingData || !trip.routingData.startDate) continue;

//             const startDate = new Date(trip.routingData.startDate);
//             let endDate = trip.routingData.endDate ? new Date(trip.routingData.endDate) : new Date(startDate);
            
//             if (!trip.routingData.endDate && trip.routingData.routes) {
//                 const totalNights = trip.routingData.routes.reduce((acc: number, route: any) => acc + (parseInt(route.nights) || 0), 0);
//                 endDate.setDate(startDate.getDate() + totalNights);
//             }

//             if (todayTime >= startDate.getTime() && todayTime <= endDate.getTime()) {
                
//                 const diffTime = Math.abs(todayTime - startDate.getTime());
//                 const currentDayNumber = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

//                 const todaysPlan = (trip.dayWiseActivities || []).find((d: any) => d.dayNumber === currentDayNumber);
//                 const currentCity = todaysPlan ? todaysPlan.city : 'Unknown Transit';

//                 const isCountryMatch = (trip.selectedCountries || []).some((c: string) => c.toLowerCase().includes(dangerLocation));
//                 const isCityMatch = currentCity.toLowerCase().includes(dangerLocation);

//                 if (isCountryMatch || isCityMatch) {
                    
//                     let todayHotel = null;
//                     let todayDriver = null;

//                     if (todaysPlan) {
//                         if (todaysPlan.stays && todaysPlan.stays.length > 0) todayHotel = todaysPlan.stays[0];
//                         if (todaysPlan.transports && todaysPlan.transports.length > 0) todayDriver = todaysPlan.transports[0];
//                     }

//                     // --- NEW: FETCH COORDINATES ---
//                     const baseCoords = await getCoordinates(currentCity);
                    
//                     // Pin Spreader: Adds a tiny random offset (approx 1-2km) so multiple pins in the same city don't perfectly overlap
//                     const latOffset = (Math.random() - 0.5) * 0.03;
//                     const lngOffset = (Math.random() - 0.5) * 0.03;

//                     affectedTravelers.push({
//                         _id: trip._id,
//                         tripId: trip.tripId,
//                         leadGuestName: trip.leadGuestName || 'Unknown Guest',
//                         pax: trip.numberOfTravelers || 1,
//                         agentId: trip.assignedAgentId || null,
//                         currentDay: currentDayNumber,
//                         currentCity: currentCity,
//                         // Injecting the coordinates directly into the traveler object!
//                         coordinates: { 
//                             lat: baseCoords.lat === 0 ? 0 : baseCoords.lat + latOffset, 
//                             lng: baseCoords.lng === 0 ? 0 : baseCoords.lng + lngOffset 
//                         },
//                         safetyStatus: trip.crisisManagement?.safetyStatus || 'none',
//                         lastPingedAt: trip.crisisManagement?.lastPingedAt || null,
//                         emergencyNotes: trip.crisisManagement?.emergencyNotes || '',
//                         todayLogistics: {
//                             hotelName: todayHotel?.hotelName || 'No Hotel Today',
//                             hotelSupplierId: todayHotel?.linkedSupplierId || null, 
//                             transportType: todayDriver?.vehicleType || 'No Transport Today',
//                             transportSupplierId: todayDriver?.linkedSupplierId || null
//                         }
//                     });
//                 }
//             }
//         }

//         return NextResponse.json({ success: true, data: affectedTravelers });

//     } catch (error) {
//         console.error("Crisis Scan Error:", error);
//         return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
//     }
// } 











































































import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbconnect";
import Itinerary from "@/app/models/Itinerary";

// 🗑️ REMOVED: The coordsCache and getCoordinates function have been completely deleted.
// We no longer need to talk to OpenStreetMap, which makes this API 10x faster!

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        // 🗑️ REMOVED: We no longer look for `searchParams.get('location')`.
        // 🌟 CHANGED: We now fetch ALL confirmed trips at once. The frontend will do the filtering.
        const activeTrips = await Itinerary.find({ bookingStatus: 'confirmed' }).lean();

        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const todayTime = today.getTime();

        const allTravelers: any[] = [];

        for (const trip of activeTrips as any[]) {
            if (!trip.routingData || !trip.routingData.startDate) continue;

            const startDate = new Date(trip.routingData.startDate);
            let endDate = trip.routingData.endDate ? new Date(trip.routingData.endDate) : new Date(startDate);
            
            if (!trip.routingData.endDate && trip.routingData.routes) {
                const totalNights = trip.routingData.routes.reduce((acc: number, route: any) => acc + (parseInt(route.nights) || 0), 0);
                endDate.setDate(startDate.getDate() + totalNights);
            }

            // 🌟 CHANGED (NEW FEATURE): Determine Timeline Status
            // Instead of just checking if the trip is happening "today", we categorize EVERY trip.
            let timelineCategory = 'completed';
            if (todayTime < startDate.getTime()) {
                timelineCategory = 'upcoming';
            } else if (todayTime >= startDate.getTime() && todayTime <= endDate.getTime()) {
                timelineCategory = 'ongoing';
            }

            // 🌟 CHANGED: Calculate current day & logistics based on the timeline category
            let currentDayNumber = 0;
            let currentCity = 'TBA';
            let todayHotel = null;
            let todayDriver = null;

            if (timelineCategory === 'ongoing') {
                const diffTime = Math.abs(todayTime - startDate.getTime());
                currentDayNumber = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                
                const todaysPlan = (trip.dayWiseActivities || []).find((d: any) => d.dayNumber === currentDayNumber);
                if (todaysPlan) {
                    currentCity = todaysPlan.city || 'Unknown Transit';
                    if (todaysPlan.stays && todaysPlan.stays.length > 0) todayHotel = todaysPlan.stays[0];
                    if (todaysPlan.transports && todaysPlan.transports.length > 0) todayDriver = todaysPlan.transports[0];
                }
            } else if (timelineCategory === 'upcoming') {
                 // If upcoming, we just pull the first city of the trip so Ops knows where they are going
                 const firstDay = (trip.dayWiseActivities || []).find((d: any) => d.dayNumber === 1);
                 if (firstDay) currentCity = firstDay.city || 'TBA';
            }

            // 🌟 CHANGED (NEW FEATURE): Extract all countries and cities
            // This allows the frontend to instantly search "Italy" and find "Rome" without hitting the database again.
            const allCountries = trip.selectedCountries || [];
            const allCities = [...new Set((trip.dayWiseActivities || []).map((d: any) => d.city).filter(Boolean))];

            // 🗑️ REMOVED: The `if (isCountryMatch || isCityMatch)` check is gone. 
            // We push EVERY traveler into the array now.
            allTravelers.push({
                _id: trip._id,
                tripId: trip.tripId,
                leadGuestName: trip.leadGuestName || 'Unknown Guest',
                pax: trip.numberOfTravelers || 1,
                agentId: trip.assignedAgentId || null,
                
                // 👇 NEW METADATA EXPORTED FOR THE COMMAND CENTER UI 👇
                timelineCategory, 
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                allCountries,
                allCities,
                // ----------------------------------------------------
                
                currentDay: currentDayNumber,
                currentCity: currentCity,
                // 🗑️ REMOVED: 'coordinates' and 'latOffset' properties are completely gone.
                safetyStatus: trip.crisisManagement?.safetyStatus || 'none',
                lastPingedAt: trip.crisisManagement?.lastPingedAt || null,
                emergencyNotes: trip.crisisManagement?.emergencyNotes || '',
                todayLogistics: {
                    hotelName: todayHotel?.hotelName || 'No Hotel Today',
                    transportType: todayDriver?.vehicleType || 'No Transport Today',
                }
            });
        }

        return NextResponse.json({ success: true, data: allTravelers });

    } catch (error) {
        console.error("Global Manifest Error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

