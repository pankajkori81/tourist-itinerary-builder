"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Calendar, MapPin, Edit, 
  Printer, Clock, User, Car, Hotel, Camera
} from 'lucide-react';
import { getItineraryById, StoredItineraryData } from '@/utils/itineraryStorage';

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [itinerary, setItinerary] = useState<StoredItineraryData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load Data
  useEffect(() => {
    // Handle array or string param safely
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    
    if (id) {
      const data = getItineraryById(id as string);
      if (data) {
        setItinerary(data);
      }
    }
    setLoading(false);
  }, [params]);

  const handleEdit = () => {
    if (itinerary?.id) {
      sessionStorage.setItem('editing_itinerary_id', itinerary.id);
      router.push('/dashboard/itinerary/create');
    }
  };

  const handleBack = () => {
    if (itinerary?.isMasterItinerary) {
      router.push('/dashboard/itinerary/library');
    } else {
      router.push('/dashboard/itinerary/agent-guest'); // Assuming this page exists
    }
  };

  const calculateTotalDuration = () => {
    if (!itinerary?.routingData?.routes) return { days: 0, nights: 0 };
    const totalNights = itinerary.routingData.routes.reduce((acc: number, r: any) => acc + (r.nights || 0), 0);
    return { days: totalNights + 1, nights: totalNights };
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-500">Loading Itinerary...</div>;
  if (!itinerary) return <div className="h-screen flex items-center justify-center text-red-500">Itinerary Not Found</div>;

  const duration = calculateTotalDuration();
  const isMaster = itinerary.isMasterItinerary;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft size={18} /> Back
          </button>
          
          <div className="flex gap-3">
             <button onClick={handleEdit} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-all">
                <Edit size={16}/> Edit Itinerary
             </button>
             <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-50">
                <Printer size={16}/> Print PDF
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        
        {/* --- TITLE & INFO CARD --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-700 relative">
               <div className="absolute -bottom-10 left-8">
                  <div className="w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center">
                     <MapPin size={32} className="text-blue-600"/>
                  </div>
               </div>
           </div>
           <div className="pt-12 px-8 pb-8">
               <div className="flex justify-between items-start">
                  <div>
                      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{itinerary.tripName}</h1>
                      <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${isMaster ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                            {isMaster ? 'Master Template' : 'Custom Trip'}
                          </span>
                          <span className="text-gray-400">|</span>
                          {/* <span className="text-gray-600 text-sm font-medium">Trip ID: {itinerary.tripId}</span> */}
                          <span className="text-gray-600 text-sm font-medium">Trip ID: {'********'}</span>
                      </div>
                  </div>
                  <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">{duration.days}D / {duration.nights}N</div>
                      <div className="text-gray-500 text-sm">Total Duration</div>
                  </div>
               </div>

               {/* Meta Grid */}
               <div className="grid grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-100">
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Destinations</label>
                      <div className="font-semibold text-gray-800">{itinerary.selectedCountries?.join(', ') || '-'}</div>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Created For</label>
                      <div className="font-semibold text-gray-800 capitalize">{itinerary.creatingFor}</div>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Type</label>
                      <div className="font-semibold text-gray-800">{itinerary.tripType || 'N/A'}</div>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Start Date</label>
                      <div className="font-semibold text-gray-800">
                          {itinerary.routingData?.startDate ? new Date(itinerary.routingData.startDate).toLocaleDateString() : 'TBD'}
                      </div>
                   </div>
               </div>
           </div>
        </div>

        {/* --- ROUTING SUMMARY --- */}
        {itinerary.routingData?.routes && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
             <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-blue-500"/> Route Summary
             </h2>
             <div className="relative">
                 {/* Vertical Line */}
                 <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-200"></div>

                 <div className="space-y-6">
                    {itinerary.routingData.routes.map((route: any, idx: number) => (
                        <div key={idx} className="relative flex items-start gap-6 group">
                            {/* Dot */}
                            <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center z-10 text-xs font-bold text-blue-700 shrink-0">
                                {route.day}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100 group-hover:border-blue-200 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-gray-800">
                                        {route.cities.map((c: any) => c.name).join(' ➝ ')}
                                    </h4>
                                    <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-gray-200 text-gray-600 shadow-sm">
                                        {route.nights} Nights
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                   <span>{route.date}</span>
                                   <span className="uppercase tracking-wider">{route.mode}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
             </div>
          </div>
        )}

        {/* --- DAY WISE DETAILS --- */}
        {itinerary.dayWiseActivities && itinerary.dayWiseActivities.length > 0 && (
           <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                 <Calendar className="text-orange-500"/> Day-by-Day Details
              </h2>
              
              {itinerary.dayWiseActivities.map((day: any) => (
                 <div key={day.dayNumber} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Day Header */}
                    <div className="bg-slate-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div>
                           <span className="text-lg font-bold text-slate-800">Day {day.dayNumber}: {day.city}</span>
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                           {day.date}
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* ACTIVITIES */}
                        {day.activities?.map((act: any) => (
                           <div key={act.id} className="flex gap-4 border-l-4 border-blue-500 pl-4 py-2">
                               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                   <Camera className="text-blue-600" size={20}/>
                               </div>
                               <div className="flex-1">
                                   <div className="flex justify-between items-start">
                                       <h4 className="font-bold text-gray-800">{act.heading}</h4>
                                       <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded">{act.slot}</span>
                                   </div>
                                   <p className="text-sm text-gray-600 mt-1">{act.description}</p>
                                   <div className="mt-2 text-xs text-gray-500 flex gap-4">
                                      <span>Pickup: {act.pickupTime}</span>
                                      <span>Type: {act.serviceType}</span>
                                   </div>
                               </div>
                           </div>
                        ))}

                        {/* STAYS */}
                        {day.stays?.map((stay: any) => (
                           <div key={stay.id} className="flex gap-4 border-l-4 border-purple-500 pl-4 py-2">
                               <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                                   <Hotel className="text-purple-600" size={20}/>
                               </div>
                               <div className="flex-1">
                                   <div className="flex justify-between items-start">
                                       <h4 className="font-bold text-gray-800">{stay.hotelName}</h4>
                                       <div className="flex gap-1">
                                          {[...Array(parseInt(stay.rating) || 0)].map((_, i) => (
                                              <span key={i} className="text-yellow-400 text-xs">★</span>
                                          ))}
                                       </div>
                                   </div>
                                   <div className="flex gap-2 mt-1 text-xs">
                                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{stay.category}</span>
                                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{stay.roomType}</span>
                                   </div>
                                   <div className="mt-2 text-xs text-gray-500">
                                      Check-in: {stay.checkInTime} | Nights: {stay.nights}
                                   </div>
                               </div>
                           </div>
                        ))}

                        {/* TRANSPORT */}
                        {day.transports?.map((trans: any) => (
                           <div key={trans.id} className="flex gap-4 border-l-4 border-green-500 pl-4 py-2">
                               <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                                   <Car className="text-green-600" size={20}/>
                               </div>
                               <div className="flex-1">
                                   <div className="flex justify-between items-start">
                                       <h4 className="font-bold text-gray-800">
                                          {trans.serviceMode === 'package' ? trans.selectedPackage : trans.selectedIndividualService}
                                       </h4>
                                       <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded capitalize">{trans.vehicleType}</span>
                                   </div>
                                   <div className="mt-2 text-xs text-gray-500 flex gap-4">
                                      <span>Pickup: {trans.pickupLocation}</span>
                                      <span>Drop: {trans.dropoffLocation}</span>
                                   </div>
                               </div>
                           </div>
                        ))}

                        {(!day.activities?.length && !day.stays?.length && !day.transports?.length) && (
                            <div className="text-center py-4 text-gray-400 italic text-sm">No items planned for this day.</div>
                        )}
                    </div>
                 </div>
              ))}
           </div>
        )}

      </div>
    </div>
  );
}