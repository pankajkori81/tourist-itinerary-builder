
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, Clock, MapPin, 
  Search, User, 
  Briefcase, ArrowRight, AlertTriangle
} from 'lucide-react';
import { 
  getLibrary, 
  StoredItineraryData,
  parseDate 
} from '@/utils/itineraryStorage';
import { DayPlan } from '../itinerary/create-day/constants/daywiseConstants'; 

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<StoredItineraryData[]>([]);
  const [filter, setFilter] = useState<'upcoming' | 'ongoing' | 'completed'>('ongoing'); 
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    const allItineraries = getLibrary();
    const confirmedTrips = allItineraries.filter(item => 
        item.bookingStatus === 'confirmed' && 
        item.isMasterItinerary === false
    );
    setTrips(confirmedTrips);
  }, []);

  const getFilteredTrips = () => {
    const today = new Date();
    today.setHours(0,0,0,0);

    return trips.filter(trip => {
        const matchesSearch = 
            trip.tripName.toLowerCase().includes(search.toLowerCase()) ||
            trip.tripId.toLowerCase().includes(search.toLowerCase()) ||
            (trip.leadGuestName || '').toLowerCase().includes(search.toLowerCase());

        if (!matchesSearch) return false;

        const startStr = trip.routingData?.startDate;
        const endStr = trip.routingData?.endDate;
        
        const startDate = parseDate(startStr);
        const endDate = parseDate(endStr);

        if (!startDate) {
            return filter === 'upcoming';
        }

        if (filter === 'ongoing') {
            if (endDate) {
                return startDate <= today && endDate >= today;
            }
            return startDate.getTime() === today.getTime();
        } 
        
        else if (filter === 'upcoming') {
            return startDate > today;
        } 
        
        else if (filter === 'completed') {
            if (endDate) {
                return endDate < today;
            }
            return startDate < today;
        }
        
        return false;
    }).sort((a, b) => {
        const dateA = parseDate(a.routingData?.startDate)?.getTime() || 0;
        const dateB = parseDate(b.routingData?.startDate)?.getTime() || 0;
        return dateA - dateB;
    });
  };

  const filteredList = getFilteredTrips();

  const getCoverImage = (trip: StoredItineraryData) => {
      const days = trip.dayWiseActivities as DayPlan[] || [];
      for (const day of days) {
          if (day.stays && day.stays.length > 0 && day.stays[0].customImage) {
              return day.stays[0].customImage; 
          }
      }
      return "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"; 
  };

  const calculateDuration = (trip: StoredItineraryData) => {
    if (!trip.routingData?.routes) return 'N/A';
    const nights = trip.routingData.routes.reduce((acc, r) => acc + (r.nights || 0), 0);
    return `${nights + 1}D / ${nights}N`;
  };

  const handleAction = (type: string) => {
      if(type === 'create') router.push('/dashboard/itinerary/create');
      if(type === 'quotes') router.push('/dashboard/itinerary/library');
  };

  return (
    // Changed bg-gray-50 to relative and added black background as base
    <div className="h-full flex flex-col relative overflow-hidden bg-black">
        
        {/* --- NEW: Background Image & Overlay --- */}
        {/* Image with Blur */}
        <div 
            className="absolute inset-0 z-0 bg-cover bg-center blur-sm scale-105"
            style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')",
            }}
        />
        {/* Dim Black Overlay (50% opacity) */}
        <div className="absolute inset-0 z-0 bg-black/50" />


        {/* --- HEADER (Added relative z-10) --- */}
        <div className="bg-white border-b border-gray-200 px-8 py-3 flex justify-between items-center shadow-sm shrink-0 relative z-10">
            <div>
                <h1 className="text-gray-900 font-extrabold text-xl tracking-tight flex items-center gap-2">
                    <Briefcase className="text-indigo-600" size={22}/> 
                    Trips Dashboard
                </h1>
                <p className="text-gray-500 text-xs mt-1">Manage operations for confirmed bookings.</p>
            </div>
            
            <div className="flex gap-3">
                <button onClick={() => handleAction('create')} className="text-sm font-bold text-gray-700 hover:text-indigo-600 px-3 py-2 bg-gray-300 shadow-lg shadow-gray-100 rounded-xl ">
                    + Create New
                </button>
                <button onClick={() => handleAction('quotes')} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
                    View Quotes
                    <ArrowRight size={16}/>
                </button>
            </div>
        </div>

        {/* --- FILTERS & TABS (Added relative z-10) --- */}
        <div className="px-8 py-4 flex justify-between items-center shrink-0 relative z-10">
             <div className="flex bg-gray-200/90 backdrop-blur-sm p-1 rounded-xl"> {/* Added opacity/backdrop for better visibility */}
                 {['upcoming','ongoing', 'completed'].map((f) => (
                     <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                            filter === f 
                            ? 'bg-white text-indigo-700 shadow-sm' 
                            : 'text-gray-700 hover:text-gray-700'
                        }`}
                     >
                        {f}
                     </button>
                 ))}
             </div>
             
             <div className="relative w-84 ">
                 <Search className="absolute z-50 left-3 top-2.5 text-gray-500" size={16}/>
                 <input 
                    type="text" 
                    placeholder="Search trip, client, ID..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full  pl-9 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
             </div>
        </div>

        {/* --- CONTENT GRID (Added relative z-10) --- */}
        <div className="flex-1 overflow-y-auto px-8 pb-10 relative z-10">
            {filteredList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-gray-300 rounded-2xl bg-white/80 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Briefcase className="text-gray-400" size={32}/>
                    </div>
                    <h3 className="text-lg font-bold text-gray-700">No {filter} trips found</h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-xs text-center">
                        {filter === 'ongoing' 
                           ? "There are no travelers currently on the road."
                           : filter === 'upcoming' 
                            ? "You don't have any confirmed upcoming trips. Go to the Library to convert a quote." 
                            : `No trips currently ${filter}.`
                        }
                    </p>
                    <button onClick={() => handleAction('quotes')} className="mt-6 text-indigo-600 font-bold hover:underline text-sm">
                        Go to Library
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                    {filteredList.map(trip => (
                        <div key={trip.id} className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col overflow-hidden relative">
                            
                            {/* Status Stripe */}
                            <div className={`h-1.5 w-full ${
                                filter === 'upcoming' ? 'bg-blue-500' :
                                filter === 'ongoing' ? 'bg-green-500' : 'bg-gray-400'
                            }`}/>

                            {/* Cover Image */}
                            <div className="h-40 bg-gray-100 relative overflow-hidden">
                                <img 
                                    src={getCoverImage(trip)} 
                                    alt="Trip Cover" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="font-bold text-lg leading-tight line-clamp-1 shadow-black/50 drop-shadow-md">{trip.tripName}</h3>
                                    <p className="text-xs font-medium opacity-90 flex items-center gap-1 mt-1">
                                        <MapPin size={12}/> {trip.selectedCountries[0]} {trip.selectedCountries.length > 1 && `+${trip.selectedCountries.length - 1}`}
                                    </p>
                                </div>
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-gray-800 shadow-sm">
                                    {trip.tripId}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-100">
                                            <User size={14}/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Client</p>
                                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{trip.leadGuestName || trip.creatingFor || 'Guest'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                         <p className="text-xs text-gray-500 font-bold uppercase">Value</p>
                                         <p className="text-sm font-bold text-green-700">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: trip.selectedCurrency || 'USD' }).format(trip.finalSellPrice || 0)}
                                         </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 mb-4">
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1"><Calendar size={10}/> Start Date</p>
                                        <p className="text-xs font-bold text-gray-700">
                                            {trip.routingData?.startDate || <span className="text-red-500 flex items-center gap-1"><AlertTriangle size={10}/> Invalid</span>}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1"><Clock size={10}/> Duration</p>
                                        <p className="text-xs font-bold text-gray-700">{calculateDuration(trip)}</p>
                                    </div>
                                </div>

                                <div className="mt-auto flex gap-3">
                                    <button 
                                        onClick={() => router.push(`/dashboard/itinerary/preview/${trip.id}`)}
                                        className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        View Details
                                    </button>
                                    <button 
                                        className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-md"
                                    >
                                        Operations
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
} 



