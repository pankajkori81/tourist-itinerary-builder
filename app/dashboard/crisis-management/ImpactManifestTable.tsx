// "use client";

// import { Users, MapPin, Hotel, Car, AlertOctagon } from 'lucide-react';

// interface ImpactManifestTableProps {
//   travelers: any[];
// }

// export default function ImpactManifestTable({ travelers }: ImpactManifestTableProps) {
//   return (
//     <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
//       {/* Table Header */}
//       <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
//         <h3 className="text-xl font-bold text-white flex items-center gap-2">
//           <Users size={20} className="text-red-400" />
//           Active Manifest: <span className="text-red-400">{travelers.length} Travelers at Risk</span>
//         </h3>
//         {/* Note: Mass SOS Broadcast Button will go here in Part 3 */}
//       </div>

//       {/* The Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-left text-sm text-slate-300">
//           <thead className="bg-slate-950/50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
//             <tr>
//               <th className="px-6 py-4">Guest Info</th>
//               <th className="px-6 py-4">Current Location</th>
//               <th className="px-6 py-4">Today's Logistics</th>
//               <th className="px-6 py-4">Safety Status</th>
//               <th className="px-6 py-4 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-800/50">
//             {travelers.map((t) => (
//               <tr key={t._id} className="hover:bg-slate-800/40 transition-colors">
                
//                 {/* Guest Details */}
//                 <td className="px-6 py-4">
//                   <div className="font-bold text-white text-base">{t.leadGuestName}</div>
//                   <div className="text-xs text-slate-500 mt-1 font-mono">ID: {t.tripId} • {t.pax} Pax</div>
//                 </td>
                
//                 {/* Location Details */}
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-1.5 text-slate-200 font-medium bg-slate-800/50 w-fit px-2 py-1 rounded">
//                     <MapPin size={14} className="text-red-400" /> {t.currentCity}
//                   </div>
//                   <div className="text-xs text-slate-500 mt-2">Day {t.currentDay} of Itinerary</div>
//                 </td>
                
//                 {/* Logistics Details (Pulled directly from your DayWise logic) */}
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-2 text-slate-300 mb-2">
//                     <Hotel size={14} className="text-blue-400" /> 
//                     <span className="truncate max-w-[200px]" title={t.todayLogistics.hotelName}>
//                       {t.todayLogistics.hotelName}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 text-slate-300">
//                     <Car size={14} className="text-emerald-400" /> 
//                     <span className="truncate max-w-[200px]" title={t.todayLogistics.transportType}>
//                       {t.todayLogistics.transportType}
//                     </span>
//                   </div>
//                 </td>
                
//                 {/* Safety Status Badge */}
//                 <td className="px-6 py-4">
//                   <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
//                     t.safetyStatus === 'safe' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
//                     t.safetyStatus === 'sos' ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' :
//                     t.safetyStatus === 'evacuated' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
//                     'bg-slate-500/10 text-slate-400 border-slate-500/20'
//                   }`}>
//                     <span className={`w-1.5 h-1.5 rounded-full ${t.safetyStatus === 'sos' ? 'bg-red-500' : 'bg-current'}`}></span>
//                     {t.safetyStatus === 'none' ? 'Pending Check' : t.safetyStatus}
//                   </span>
//                 </td>
                
//                 {/* Actions */}
//                 <td className="px-6 py-4 text-right">
//                   <button className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition-colors flex items-center gap-2 ml-auto">
//                     <AlertOctagon size={14} className="text-slate-400" /> Update
//                   </button>
//                 </td>
//               </tr>
//             ))} 
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



















// "use client";

// import { useState } from 'react';
// import { Users, MapPin, Hotel, Car, AlertOctagon } from 'lucide-react';
// import StatusUpdateModal from './StatusUpdateModal';

// interface ImpactManifestTableProps {
//   travelers: any[];
// }

// export default function ImpactManifestTable({ travelers: initialTravelers }: ImpactManifestTableProps) {
//   // We use local state here so the table updates instantly without needing a full page refresh
//   const [travelers, setTravelers] = useState(initialTravelers);
//   const [selectedTraveler, setSelectedTraveler] = useState<any | null>(null);

//   // When the modal saves successfully, update that specific traveler in our table
//   const handleUpdateSuccess = (updatedTraveler: any) => {
//     setTravelers(prev => prev.map(t => t._id === updatedTraveler._id ? updatedTraveler : t));
//   };

//   return (
//     <>
//       <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        
//         {/* Table Header */}
//         {/* <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
//           <h3 className="text-xl font-bold text-white flex items-center gap-2">
//             <Users size={20} className="text-red-400" />
//             Active Manifest: <span className="text-red-400">{travelers.length} Travelers at Risk</span>
//           </h3>
//         </div> */}


//         <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-black/20">
//           <h3 className="text-xl font-bold text-white flex items-center gap-3">
//             {/* 1. Calculate how many are NOT safe or evacuated */}
//             {(() => {
//               const atRiskCount = travelers.filter(t => t.safetyStatus !== 'safe' && t.safetyStatus !== 'evacuated').length;
//               const isAllSafe = atRiskCount === 0;

//               return (
//                 <>
//                   <Users size={20} className={isAllSafe ? "text-emerald-500" : "text-red-500"} />
//                   Active Manifest: 
//                   <span className={isAllSafe ? "text-emerald-400 ml-1" : "text-red-400 ml-1"}>
//                     {travelers.length} in Zone <span className="text-slate-500 text-sm font-normal">({atRiskCount} Action Required)</span>
//                   </span>
//                 </>
//               );
//             })()}
//           </h3>
//         </div>

//         {/* The Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm text-slate-300">
//             <thead className="bg-slate-950/50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
//               <tr>
//                 <th className="px-6 py-4">Guest Info</th>
//                 <th className="px-6 py-4">Current Location</th>
//                 <th className="px-6 py-4">Today's Logistics</th>
//                 <th className="px-6 py-4">Safety Status</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-800/50">
//               {travelers.map((t) => (
//                 <tr key={t._id} className="hover:bg-slate-800/40 transition-colors">
                  
//                   {/* Guest Details */}
//                   <td className="px-6 py-4">
//                     <div className="font-bold text-white text-base">{t.leadGuestName}</div>
//                     <div className="text-xs text-slate-500 mt-1 font-mono">ID: {t.tripId} • {t.pax} Pax</div>
//                     {/* Show quick emergency notes preview if they exist */}
//                     {t.emergencyNotes && (
//                       <div className="mt-2 text-[10px] text-slate-400 italic bg-slate-950 px-2 py-1 rounded border border-slate-800 line-clamp-1">
//                         "{t.emergencyNotes}"
//                       </div>
//                     )}
//                   </td>
                  
//                   {/* Location Details */}
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-1.5 text-slate-200 font-medium bg-slate-800/50 w-fit px-2 py-1 rounded">
//                       <MapPin size={14} className="text-red-400" /> {t.currentCity}
//                     </div>
//                     <div className="text-xs text-slate-500 mt-2">Day {t.currentDay} of Itinerary</div>
//                   </td>
                  
//                   {/* Logistics Details */}
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2 text-slate-300 mb-2">
//                       <Hotel size={14} className="text-blue-400" /> 
//                       <span className="truncate max-w-[200px]" title={t.todayLogistics.hotelName}>{t.todayLogistics.hotelName}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-slate-300">
//                       <Car size={14} className="text-emerald-400" /> 
//                       <span className="truncate max-w-[200px]" title={t.todayLogistics.transportType}>{t.todayLogistics.transportType}</span>
//                     </div>
//                   </td>
                  
//                   {/* Safety Status Badge */}
//                   <td className="px-6 py-4">
//                     <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
//                       t.safetyStatus === 'safe' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
//                       t.safetyStatus === 'sos' ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' :
//                       t.safetyStatus === 'evacuated' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
//                       'bg-slate-500/10 text-slate-400 border-slate-500/20'
//                     }`}>
//                       <span className={`w-1.5 h-1.5 rounded-full ${t.safetyStatus === 'sos' ? 'bg-red-500' : 'bg-current'}`}></span>
//                       {t.safetyStatus === 'none' ? 'Pending Check' : t.safetyStatus}
//                     </span>
//                   </td>
                  
//                   {/* Actions - 👇 OPENS THE MODAL 👇 */}
//                   <td className="px-6 py-4 text-right">
//                     <button 
//                       onClick={() => setSelectedTraveler(t)}
//                       className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition-colors flex items-center gap-2 ml-auto"
//                     >
//                       <AlertOctagon size={14} className={t.safetyStatus === 'sos' ? 'text-red-400 animate-pulse' : 'text-slate-400'} /> 
//                       Update
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* RENDER THE MODAL IF A TRAVELER IS SELECTED */}
//       {selectedTraveler && (
//         <StatusUpdateModal 
//           traveler={selectedTraveler} 
//           onClose={() => setSelectedTraveler(null)} 
//           onSuccess={handleUpdateSuccess}
//         />
//       )}
//     </>
//   );
// } 












































// "use client";

// import { useState, useEffect } from 'react';
// import { Users, MapPin, Hotel, Car, AlertOctagon, Calendar, Globe } from 'lucide-react';
// import StatusUpdateModal from './StatusUpdateModal';

// // 🌟 NEW: Added activeTab to the props so the table knows what type of data it is displaying
// interface ImpactManifestTableProps {
//   travelers: any[];
//   activeTab: 'ongoing' | 'upcoming' | 'completed'; 
// }

// export default function ImpactManifestTable({ travelers: initialTravelers, activeTab }: ImpactManifestTableProps) {
//   const [travelers, setTravelers] = useState(initialTravelers);
//   const [selectedTraveler, setSelectedTraveler] = useState<any | null>(null);

//   // Sync state if the parent passes new filtered data
//   useEffect(() => {
//     setTravelers(initialTravelers);
//   }, [initialTravelers]);

//   const handleUpdateSuccess = (updatedTraveler: any) => {
//     setTravelers(prev => prev.map(t => t._id === updatedTraveler._id ? updatedTraveler : t));
//   };

//   // Helper to format dates nicely
//   const formatDate = (isoString: string) => {
//     return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//   };

//   return (
//     <>
//       <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        
//         <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-black/20">
//           <h3 className="text-xl font-bold text-white flex items-center gap-3">
//             {(() => {
//               const atRiskCount = travelers.filter(t => t.safetyStatus !== 'safe' && t.safetyStatus !== 'evacuated' && t.safetyStatus !== 'none').length;
//               const isDanger = atRiskCount > 0;

//               return (
//                 <>
//                   <Users size={20} className={isDanger ? "text-red-500" : "text-blue-500"} />
//                   {activeTab === 'ongoing' ? 'Active' : activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Manifest: 
//                   <span className={isDanger ? "text-red-400 ml-1" : "text-blue-400 ml-1"}>
//                     {travelers.length} Trips <span className="text-slate-500 text-sm font-normal">({atRiskCount} Active SOS)</span>
//                   </span>
//                 </>
//               );
//             })()}
//           </h3>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm text-slate-300">
//             <thead className="bg-slate-950/50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
//               <tr>
//                 <th className="px-6 py-4">Guest Info</th>
//                 <th className="px-6 py-4">Itinerary Geography</th>
//                 {/* 🌟 CHANGED: Column title changes based on if it's ongoing or not */}
//                 <th className="px-6 py-4">{activeTab === 'ongoing' ? "Today's Status" : "Trip Dates"}</th>
//                 <th className="px-6 py-4">Safety Status</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-800/50">
//               {travelers.map((t) => (
//                 <tr key={t._id} className="hover:bg-slate-800/40 transition-colors">
                  
//                   {/* Guest Details */}
//                   <td className="px-6 py-4">
//                     <div className="font-bold text-white text-base">{t.leadGuestName}</div>
//                     <div className="text-xs text-slate-500 mt-1 font-mono">ID: {t.tripId} • {t.pax} Pax</div>
//                     {t.emergencyNotes && (
//                       <div className="mt-2 text-[10px] text-slate-400 italic bg-slate-950 px-2 py-1 rounded border border-slate-800 line-clamp-1 border-l-2 border-l-red-500">
//                         {t.emergencyNotes}
//                       </div>
//                     )}
//                   </td>
                  
//                   {/* 🌟 NEW: Itinerary Geography (Shows Countries and Cities) */}
//                   <td className="px-6 py-4">
//                     <div className="flex flex-wrap gap-1 mb-2">
//                       {t.allCountries?.map((country: string, i: number) => (
//                         <span key={i} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
//                           <Globe size={10} /> {country}
//                         </span>
//                       ))}
//                     </div>
//                     <div className="text-xs text-slate-400 flex items-center gap-1.5 line-clamp-2 max-w-[250px]" title={t.allCities?.join(', ')}>
//                       <MapPin size={12} className="text-slate-500 shrink-0" /> {t.allCities?.join(', ') || 'No cities defined'}
//                     </div>
//                   </td>
                  
//                   {/* 🌟 CHANGED: Contextual Logistics Column */}
//                   <td className="px-6 py-4">
//                     {activeTab === 'ongoing' ? (
//                       // Show Today's Logistics for Ongoing Trips
//                       <>
//                         <div className="flex items-center gap-1.5 text-slate-200 font-medium bg-slate-800/50 w-fit px-2 py-1 rounded mb-2">
//                           <MapPin size={14} className="text-red-400" /> {t.currentCity} (Day {t.currentDay})
//                         </div>
//                         <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
//                           <Hotel size={12} className="text-blue-400 shrink-0" /> 
//                           <span className="truncate max-w-[150px]" title={t.todayLogistics?.hotelName}>{t.todayLogistics?.hotelName || 'No Hotel'}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-slate-400 text-xs">
//                           <Car size={12} className="text-emerald-400 shrink-0" /> 
//                           <span className="truncate max-w-[150px]" title={t.todayLogistics?.transportType}>{t.todayLogistics?.transportType || 'No Transport'}</span>
//                         </div>
//                       </>
//                     ) : (
//                       // Show Trip Dates for Upcoming/Completed Trips
//                       <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50 w-fit">
//                         <div className="flex items-center gap-2 text-xs text-slate-300 mb-1.5">
//                           <Calendar size={14} className="text-slate-500" /> 
//                           <span className="font-semibold">Start:</span> {formatDate(t.startDate)}
//                         </div>
//                         <div className="flex items-center gap-2 text-xs text-slate-300">
//                           <Calendar size={14} className="text-slate-500 opacity-0" /> 
//                           <span className="font-semibold">End:</span> {formatDate(t.endDate)}
//                         </div>
//                       </div>
//                     )}
//                   </td>
                  
//                   {/* Safety Status Badge */}
//                   <td className="px-6 py-4">
//                     <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
//                       t.safetyStatus === 'safe' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
//                       t.safetyStatus === 'sos' ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' :
//                       t.safetyStatus === 'evacuated' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
//                       'bg-slate-500/10 text-slate-400 border-slate-500/20'
//                     }`}>
//                       <span className={`w-1.5 h-1.5 rounded-full ${t.safetyStatus === 'sos' ? 'bg-red-500' : 'bg-current'}`}></span>
//                       {t.safetyStatus === 'none' ? 'Pending Check' : t.safetyStatus}
//                     </span>
//                   </td>
                  
//                   {/* Actions */}
//                   <td className="px-6 py-4 text-right">
//                     <button 
//                       onClick={() => setSelectedTraveler(t)}
//                       className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition-colors flex items-center gap-2 ml-auto"
//                     >
//                       <AlertOctagon size={14} className={t.safetyStatus === 'sos' ? 'text-red-400 animate-pulse' : 'text-slate-400'} /> 
//                       Update
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {selectedTraveler && (
//         <StatusUpdateModal 
//           traveler={selectedTraveler} 
//           onClose={() => setSelectedTraveler(null)} 
//           onSuccess={handleUpdateSuccess}
//         />
//       )}
//     </>
//   );
// } 









































"use client";

import { useState, useEffect } from 'react';
import { Users, MapPin, Hotel, Car, AlertOctagon, Calendar, Globe } from 'lucide-react';
import StatusUpdateModal from './StatusUpdateModal';

interface ImpactManifestTableProps {
  travelers: any[];
  activeTab: 'ongoing' | 'upcoming' | 'completed'; 
}

export default function ImpactManifestTable({ travelers: initialTravelers, activeTab }: ImpactManifestTableProps) {
  const [travelers, setTravelers] = useState(initialTravelers);
  const [selectedTraveler, setSelectedTraveler] = useState<any | null>(null);

  useEffect(() => {
    setTravelers(initialTravelers);
  }, [initialTravelers]);

  const handleUpdateSuccess = (updatedTraveler: any) => {
    setTravelers(prev => prev.map(t => t._id === updatedTraveler._id ? updatedTraveler : t));
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <div className="bg-white border border-gray-400 rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            {(() => {
              const atRiskCount = travelers.filter(t => t.safetyStatus !== 'safe' && t.safetyStatus !== 'evacuated' && t.safetyStatus !== 'none').length;
              const isDanger = atRiskCount > 0;

              return (
                <>
                  <Users size={20} className={isDanger ? "text-red-600" : "text-blue-600"} />
                  {activeTab === 'ongoing' ? 'Active' : activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Manifest: 
                  <span className={isDanger ? "text-red-600 ml-1" : "text-blue-600 ml-1"}>
                    {travelers.length} Trips <span className="text-slate-500 text-sm font-normal">({atRiskCount} Active SOS)</span>
                  </span>
                </>
              );
            })()}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-50 text-slate-800 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Guest Info</th>
                <th className="px-6 py-4">Itinerary Geography</th>
                <th className="px-6 py-4">{activeTab === 'ongoing' ? "Today's Status" : "Trip Dates"}</th>
                <th className="px-6 py-4">Safety Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {travelers.map((t) => (
                <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                  
                  {/* Guest Details */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-base">{t.leadGuestName}</div>
                    <div className="text-xs text-slate-500 mt-1 font-mono">ID: {t.tripId} • {t.pax} Pax</div>
                    {t.emergencyNotes && (
                      <div className="mt-2 text-[10px] text-slate-700 italic bg-red-50 px-2 py-1 rounded border border-red-100 line-clamp-1 border-l-2 border-l-red-500">
                        {t.emergencyNotes}
                      </div>
                    )}
                  </td>
                  
                  {/* Itinerary Geography */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {t.allCountries?.map((country: string, i: number) => (
                        <span key={i} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                          <Globe size={10} /> {country}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-slate-700 flex items-center gap-1.5 line-clamp-2 max-w-[250px]" title={t.allCities?.join(', ')}>
                      <MapPin size={12} className="text-slate-400 shrink-0" /> {t.allCities?.join(', ') || 'No cities defined'}
                    </div>
                  </td>
                  
                  {/* Contextual Logistics Column */}
                  <td className="px-6 py-4">
                    {activeTab === 'ongoing' ? (
                      <>
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium bg-slate-100 w-fit px-2 py-1 rounded mb-2 border border-slate-200">
                          <MapPin size={14} className="text-red-500" /> {t.currentCity} (Day {t.currentDay})
                        </div>
                        <div className="flex items-center gap-2 text-slate-800 text-xs mb-1">
                          <Hotel size={12} className="text-blue-500 shrink-0" /> 
                          <span className="truncate max-w-[150px]" title={t.todayLogistics?.hotelName}>{t.todayLogistics?.hotelName || 'No Hotel'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-800 text-xs">
                          <Car size={12} className="text-emerald-500 shrink-0" /> 
                          <span className="truncate max-w-[150px]" title={t.todayLogistics?.transportType}>{t.todayLogistics?.transportType || 'No Transport'}</span>
                        </div>
                      </>
                    ) : (
                      <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 w-fit">
                        <div className="flex items-center gap-2 text-xs text-slate-700 mb-1.5">
                          <Calendar size={14} className="text-slate-400" /> 
                          <span className="font-semibold text-slate-700">Start:</span> {formatDate(t.startDate)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-700">
                          <Calendar size={14} className="text-slate-400 opacity-0" /> 
                          <span className="font-semibold text-slate-700">End:</span> {formatDate(t.endDate)}
                        </div>
                      </div>
                    )}
                  </td>
                  
                  {/* Safety Status Badge */}
                  {/* <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      t.safetyStatus === 'safe' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      t.safetyStatus === 'sos' ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' :
                      t.safetyStatus === 'evacuated' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${t.safetyStatus === 'sos' ? 'bg-red-500' : 'bg-current'}`}></span>
                      {t.safetyStatus === 'none' ? 'Pending Check' : t.safetyStatus}
                    </span>
                  </td> */}

                  {/* Safety Status Badge */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      t.safetyStatus === 'safe' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      t.safetyStatus === 'sos' ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' :
                      t.safetyStatus === 'evacuated' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      t.safetyStatus === 'suspended' ? 'bg-orange-50 text-orange-700 border-orange-200' : // 👈 ADDED SUSPENDED COLOR
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${t.safetyStatus === 'sos' ? 'bg-red-500' : t.safetyStatus === 'suspended' ? 'bg-orange-500' : 'bg-current'}`}></span>
                      {t.safetyStatus === 'none' ? 'Pending Check' : t.safetyStatus}
                    </span>
                  </td>
                  
                  {/* Actions Button */}
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedTraveler(t)}
                      className="text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg border border-slate-200 transition-colors flex items-center gap-2 ml-auto shadow-sm"
                    >
                      <AlertOctagon size={14} className={t.safetyStatus === 'sos' ? 'text-red-500 animate-pulse' : 'text-slate-400'} /> 
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTraveler && (
        <StatusUpdateModal 
          traveler={selectedTraveler} 
          onClose={() => setSelectedTraveler(null)} 
          onSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
}