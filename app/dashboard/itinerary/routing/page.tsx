
// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { Plus, Trash2, GripVertical, Plane, Building2, Search, X, Calendar, ArrowLeft, Clock, ArrowRight, Save } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useItinerary } from '@/app/context/ItineraryContext';
// // import { CITIES_BY_COUNTRY, TRANSPORT_MODES } from './constants'; 



// const CitySelect = ({ 
//   value, 
//   onChange 
// }: { 
//   value: string, 
//   onChange: (name: string, type: 'city' | 'airport') => void 
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [search, setSearch] = useState('');
//   const [results, setResults] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const { itineraryData } = useItinerary();
//   const wrapperRef = useRef<HTMLDivElement>(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false);
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // --- THE SEARCH ENGINE (DEBOUNCED) ---
//   useEffect(() => {
//     // Only search if user types at least 2 characters
//     if (search.length < 2) {
//       setResults([]);
//       return;
//     }

//     const delayDebounceFn = setTimeout(async () => {
//       setIsLoading(true);
//       try {
//         const countries = itineraryData.selectedCountries?.join(',') || '';
//         const response = await fetch(`/api/locations/search?q=${encodeURIComponent(search)}&countries=${encodeURIComponent(countries)}`);
//         const json = await response.json();
        
//         if (json.success) {
//           setResults(json.data);
//         }
//       } catch (error) {
//         console.error("Search API Error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }, 300); // 300ms delay

//     return () => clearTimeout(delayDebounceFn);
//   }, [search, itineraryData.selectedCountries]);

//   return (
//     <div className={`relative w-full ${isOpen ? 'z-50' : 'z-auto'}`} ref={wrapperRef}>
//       <div 
//         onClick={() => setIsOpen(!isOpen)} 
//         className={`w-full px-4 py-3 border bg-white rounded-lg text-sm flex items-center justify-between cursor-pointer transition-all ${
//           isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-400'
//         }`}
//       >
//         <span className={value ? "text-gray-900 font-bold" : "text-gray-400"}>
//           {value || "Search City or Airport..."}
//         </span>
//         <Search size={14} className="text-gray-400" />
//       </div>
      
//       {isOpen && (
//         <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden left-0 animate-in fade-in zoom-in duration-150">
          
//           <div className="p-3 bg-gray-50 border-b shrink-0" onClick={(e) => e.stopPropagation()}>
//             <input 
//               type="text" 
//               placeholder="Start typing (e.g. Rome)..." 
//               className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
//               value={search} 
//               onChange={(e) => setSearch(e.target.value)} 
//               autoFocus 
//             />
//           </div>
          
//           <div className="max-h-[250px] overflow-y-auto">
//             {isLoading && (
//                <div className="px-4 py-6 text-center text-sm text-blue-500 font-medium animate-pulse italic">
//                  Searching database...
//                </div>
//             )}

//             {!isLoading && results.map((opt, idx) => (
//                <div 
//                  key={idx} 
//                  onClick={() => { 
//                    onChange(opt.name, opt.type); 
//                    setIsOpen(false); 
//                    setSearch(''); 
//                  }} 
//                  className="flex flex-col gap-0.5 px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 group"
//                >
//                  <div className="flex items-center gap-2">
//                    {opt.type === 'city' ? <Building2 size={14} className="text-gray-400"/> : <Plane size={14} className="text-blue-500"/>}
//                    <span className="font-bold text-gray-800 group-hover:text-blue-700">{opt.name}</span>
//                  </div>
//                  <div className="text-[10px] text-gray-400 ml-5 font-medium uppercase tracking-wider">
//                    {opt.stateName ? `${opt.stateName}, ` : ''}{opt.countryName}
//                  </div>
//                </div>
//             ))}

//             {!isLoading && search.length >= 2 && results.length === 0 && (
//                <div className="px-3 py-8 text-center text-sm text-gray-400 italic">
//                  No matches found in your selected countries.
//                </div>
//             )}
            
//             {search.length < 2 && !isLoading && (
//               <div className="px-3 py-8 text-center text-xs text-gray-400 uppercase tracking-widest font-bold">
//                 Type 2+ characters to search
//               </div>
//             )}
//           </div>

//         </div>
//       )}
//     </div>
//   );
// };


// export default function RoutingPage() {
//   const router = useRouter();
//   // 1. Get completeStep
//   const { itineraryData, updateRoutingData, saveItinerary, isSaving, saveSuccess, completeStep } = useItinerary();
  
//   const [isHydrated, setIsHydrated] = useState(false);
//   const [startDate, setStartDate] = useState<string>('');
//   const [endDate, setEndDate] = useState<string>('');
//   const [routes, setRoutes] = useState<any[]>([
//     {
//       id: 1,
//       dayNumber: 1,
//       date: '',
//       nights: 2,
//       cities: [{ name: '', type: 'city' }],
//       transportMode: 'vehicle',
//     }
//   ]);

//   // const availableOptions = (itineraryData.selectedCountries || []).flatMap(
//   //   (country) => CITIES_BY_COUNTRY[country] || []
//   // );

//   // 2. SECURITY GUARD: Redirect if Intro (Step 1) is not complete
//   useEffect(() => {
//     // If we have no trip name, it means Intro wasn't filled.
//     if (!itineraryData.tripName) {
//         router.push('/dashboard/itinerary/create');
//     }
//   }, [itineraryData.tripName, router]);

//   // --- EFFECT 1: HYDRATION ---
//   useEffect(() => {
//     if (isHydrated) return;

//     if (itineraryData.routingData && itineraryData.routingData.routes.length > 0) {
//        setRoutes(itineraryData.routingData.routes);
//        setStartDate(itineraryData.routingData.startDate || '');
//        setEndDate(itineraryData.routingData.endDate || '');
//        setIsHydrated(true); 
//     } else if (itineraryData.tripId) {
//         setIsHydrated(true); 
//     }
//   }, [itineraryData.routingData, itineraryData.tripId, isHydrated]);

//   // --- EFFECT 2: CALCULATOR (With Master Itinerary Logic) ---
//   useEffect(() => {
//     if (!isHydrated) return; 

//     const calculateTimeline = () => {
//       let currentDayCount = 1;
//       // If Master Itinerary, currentDateObj will be null (dates disabled)
//       let currentDateObj = (startDate && !itineraryData.isMasterItinerary) ? new Date(startDate) : null;
      
//       const updatedRoutes = routes.map((route) => {
//         const rowDay = currentDayCount;
//         const rowDate = currentDateObj ? currentDateObj.toISOString().split('T')[0] : '';
//         const duration = Math.max(0, parseInt(route.nights) || 0); 
        
//         currentDayCount += duration;
//         if (currentDateObj) currentDateObj.setDate(currentDateObj.getDate() + duration);

//         return { ...route, dayNumber: rowDay, date: rowDate };
//       });

//       if (JSON.stringify(updatedRoutes) !== JSON.stringify(routes)) {
//          setRoutes(updatedRoutes);
//       }

//       const calcEndDate = currentDateObj ? currentDateObj.toISOString().split('T')[0] : '';
//       if (calcEndDate !== endDate) setEndDate(calcEndDate);

//       const newRoutingData = {
//           startDate: itineraryData.isMasterItinerary ? '' : startDate,
//           endDate: itineraryData.isMasterItinerary ? '' : calcEndDate,
//           routes: updatedRoutes
//       };

//       const contextStr = JSON.stringify(itineraryData.routingData);
//       const newStr = JSON.stringify(newRoutingData);

//       if (contextStr !== newStr) {
//           updateRoutingData(newRoutingData);
//       }
//     };

//     calculateTimeline();
//   }, [startDate, routes, isHydrated, itineraryData.isMasterItinerary]); 


//   // --- HANDLERS (Unchanged mostly) ---
//   const handleAddDays = (count: number) => {
//     const baseTime = Date.now();
//     const newRows = Array.from({ length: count }).map((_, i) => ({
//       id: baseTime + i, 
//       dayNumber: 0,
//       date: '',
//       nights: 1,
//       cities: [{ name: '', type: 'city' }],
//       transportMode: 'vehicle',
//     }));
//     setRoutes(prev => [...prev, ...newRows]);
//   };

//   const removeDay = (id: number) => {
//     if (routes.length <= 1) return;
//     setRoutes(prev => prev.filter(r => r.id !== id));
//   };

//   const updateRouteField = (id: number, field: string, value: any) => {
//     setRoutes(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
//   };

//   const updateCity = (routeId: number, cityIdx: number, field: 'name'|'type', value: string) => {
//     setRoutes(prev => prev.map(r => {
//       if (r.id === routeId) {
//         const newCities = [...r.cities];
//         newCities[cityIdx] = { ...newCities[cityIdx], [field]: value };
//         return { ...r, cities: newCities };
//       }
//       return r;
//     }));
//   };

//   const addCitySlot = (routeId: number) => { /* ... */ }; // Kept as is if needed, but not used in UI currently
//   const removeCitySlot = (routeId: number, cityIdx: number) => {
//     setRoutes(prev => prev.map(r => {
//       if (r.id === routeId && r.cities.length > 1) {
//         return { ...r, cities: r.cities.filter((_: any, i: number) => i !== cityIdx) };
//       }
//       return r;
//     }));
//   };

//   const handleNext = async () => {
//     const hasEmptyCities = routes.some(r => r.cities.some((c:any) => !c.name));
//     if(hasEmptyCities) {
//         alert("Please select cities for all days before proceeding.");
//         return;
//     }
//     await saveItinerary('quick'); 
//     // 3. UNLOCK CREATE DAY
//     completeStep('routing');
//     router.push('/dashboard/itinerary/create-day');
//   };

//   const totalNights = routes.reduce((acc, route) => acc + (parseInt(route.nights) || 0), 0);
//   const totalDays = totalNights + 1; 

//   if (!isHydrated) return <div className="p-10 text-center text-gray-500">Loading Itinerary...</div>;

//   return (
//     <div className="p-4 md:p-6 pb-40 min-h-screen"> 
      
//       {/* 1. TOP BAR */}
//       <div className="bg-[#1f2544] rounded-t-xl shadow-lg p-5 border-b border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6">
//           <div className="flex items-center gap-4">
//              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Add Cities</span>
//              <div className="flex gap-2">
//                {[1, 2, 3 , 4 , 5].map(num => (
//                   <button key={num} onClick={() => handleAddDays(num)}
//                     className="px-4 py-1.5 bg-[#3b4358] hover:bg-blue-600 text-gray-200 hover:text-white rounded-md text-xs font-bold transition-all border border-gray-600 hover:border-blue-500">
//                     +{num} {num === 1 ? 'City' : 'Cities'}
//                   </button>
//                ))}
//              </div>
//           </div>

//           <div className="flex items-center gap-4">
//              {saveSuccess && <span className="text-green-400 text-xs font-bold animate-pulse">Saved!</span>}
//              {isSaving && <span className="text-blue-400 text-xs font-bold">Saving...</span>}
             
//              {/* DATE PICKER (HIDDEN IF MASTER) */}
//              {!itineraryData.isMasterItinerary ? (
//                  <div className="flex items-center gap-4 bg-gray-300 p-1 rounded-lg border border-gray-600">
//                     <div className="relative group">
//                     <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
//                         className="pl-9 pr-3 py-1 bg text-gray-700 text-sm focus:outline-none w-38 cursor-pointer" />
//                     </div>
//                     <div className="h-4 w-px bg-gray-600"></div>
//                     <div className="relative">
//                         <span className="absolute left-3 top-2 text-gray-600"><Calendar size={14}/></span>
//                         <input type="date" value={endDate} disabled className="pl-9 pr-3 py-1.5 bg-transparent text-gray-500 text-sm w-36 cursor-not-allowed" />
//                     </div>
//                 </div>
//              ) : (
//                  <div className="px-4 py-1.5 bg-blue-900/50 border border-blue-500/30 rounded-lg text-blue-200 text-xs font-bold flex items-center gap-2">
//                     {/* <Calendar size={14} /> Master Itinerary Mode (Generic Dates) */}
//                  </div>
//              )}
//           </div>
//       </div>

//       {/* 2. MAIN TABLE */}
//       <div className="bg-white/10 rounded-b-xl shadow-xl border border-gray-800 overflow-visible min-h-[500px]">
//          <div className="px-6 py-4 border-b border-gray-100 bg-[#1f2544] flex items-center justify-between">
//             <h3 className="flex items-center gap-2 text-red-500 font-bold text-lg">
//                <Clock className="text-red-500" size={18} />
//                <span>Total Duration: <span className="text-gray-100">{totalNights} Nights</span> / <span className="text-gray-100">{totalDays} Days</span></span>
//             </h3>
//          </div>

//          {/* <div className="overflow-x-auto overflow-y-visible"> */}
//           {/* ADDED pb-48: This gives the dropdowns physical room to open without getting cut off by the scroll boundary */}
//          <div className="overflow-x-auto pb-48">
//             <table className="w-full min-w-[900px] table-auto">
//               <thead className="bg-white border-b border-gray-200">
//                 <tr>
//                    <th className="w-12 py-4"></th>
//                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase w-24">Day</th>
//                    {/* Hide Date Column Header if Master */}
//                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase w-40">
//                        {itineraryData.isMasterItinerary ? "Day Sequence" : "Date"}
//                    </th>
//                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase w-32">Nights</th>
//                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Cities / Airports</th>
//                    <th className="px-9 py-4 text-left text-xs font-bold text-gray-700 uppercase w-48">Remove City </th>
//                    <th className="w-16 py-4"></th>
//                 </tr>
//               </thead>
              
//               <tbody className="divide-y divide-gray-200">
//                 {routes.map((route) => (
//                   <tr key={route.id} className="hover:bg transition-colors group">
//                     <td className="px-2 py-6 align-top text-center"><button className="text-gray-300 hover:text-gray-500 cursor-grab mt-3"><GripVertical size={20} /></button></td>
//                     <td className="px-6 py-6 align-top"><div className="mt-1 w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 font-bold rounded-lg text-sm border border-blue-100">{route.dayNumber}</div></td>
                    
//                     {/* Date Column Logic */}
//                     <td className="px-6 py-6 align-top">
//                         {itineraryData.isMasterItinerary ? (
//                             <div className="mt-3 text-sm font-bold text-gray-100 px-2 py-1 bg-white/10 rounded inline-block">
//                                 Day {route.dayNumber}
//                             </div>
//                         ) : (
//                             <div className={`mt-3 text-sm font-medium px-2 py-1 rounded ${route.date ? 'text-gray-100' : 'text-gray-300 italic'}`}>
//                                 {route.date || '--'}
//                             </div>
//                         )}
//                     </td>

//                     <td className="px-6 py-6 align-top">
//                       <div className="relative">
//                         <select value={route.nights} onChange={(e) => updateRouteField(route.id, 'nights', parseInt(e.target.value))} 
//                           className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:border-blue-500 outline-none hover:border-gray-300">
//                           {[0,1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
//                         </select>
//                         <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400 text-xs">▼</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-6 align-top">
//                         <div className="space-y-3">
//                              {route.cities.map((city: any, cityIndex: number) => (
//                              <div key={cityIndex} className="flex items-center gap-2">
//                                 {/* <CitySelect value={city.name} options={availableOptions} onChange={(name, type) => updateCity(route.id, cityIndex, 'name', name)} /> */}
//                                 <CitySelect 
//   value={city.name} 
//   onChange={(name, type) => updateCity(route.id, cityIndex, 'name', name)} 
// />
//                                 {route.cities.length > 1 && (
//                                     <button onClick={() => removeCitySlot(route.id, cityIndex)} className="text-gray-300 hover:text-red-500 "><X size={16}/></button>
//                                 )}
//                               </div>
//                              ))}
                          
//                         </div>
//                     </td>
                
//                     <td className="px-5 py-6 align-top text-center ">
//                       <button onClick={() => removeDay(route.id)} disabled={routes.length === 1}
//                         className={`p-2 rounded-lg transition-all bg-gray-600 mt-1 ${routes.length === 1 ? 'text-gray-100 cursor-not-allowed' : 'text-gray-200 hover:bg-red-50 hover:text-red-500'}`}>
//                         <Trash2 size={19} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="p-6 bg border-t border-gray-100 flex justify-end rounded-b-xl">
//                <button onClick={() => handleAddDays(1)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-sm text-sm"><Plus size={16} /> Add City</button>
//             </div>
//          </div>
//       </div>

//       {/* 3. NAVIGATION BUTTONS */}
//       <div className="flex justify-between items-center mt-8">
//         <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white px-6 py-3 rounded-lg font-medium hover:bg-white/5"><ArrowLeft size={18} /> Back</button>
//         <button onClick={handleNext} className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02]">
//             Next Step: Create Day <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//         </button>
//       </div>

//     </div>
//   );
// }
















"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, GripVertical, Plane, Building2, Search, X, Calendar, ArrowLeft, Clock, ArrowRight, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useItinerary } from '@/app/context/ItineraryContext';



const CitySelect = ({ 
  value, 
  onChange 
}: { 
  value: string, 
  onChange: (name: string, type: 'city' | 'airport') => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { itineraryData } = useItinerary();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 1. Keep the input box synced with the actual saved value when closed
  useEffect(() => {
      if (!isOpen) {
          setSearch(value || '');
      }
  }, [value, isOpen]);

  // 2. Click Outside Logic (The "Abort" Action)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearch(value || ''); // 🌟 100% LOGIC: Revert to the saved value if they click away!
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  // 3. The Search Engine (Debounced)
  useEffect(() => {
    if (search.length < 2 || search === value) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const countries = itineraryData.selectedCountries?.join(',') || '';
        const response = await fetch(`/api/locations/search?q=${encodeURIComponent(search)}&countries=${encodeURIComponent(countries)}`);
        const json = await response.json();
        
        if (json.success) {
          setResults(json.data);
        }
      } catch (error) {
        console.error("Search API Error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, value, itineraryData.selectedCountries]);

  // 4. Manual Entry Logic
  const handleManualSubmit = () => {
      if (search.trim().length > 0) {
          onChange(search.trim(), 'city');
          setIsOpen(false);
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          handleManualSubmit();
      }
  };

  return (
    <div className={`relative w-full ${isOpen ? 'z-50' : 'z-auto'}`} ref={wrapperRef}>
      
      {/* The Closed State / Trigger Button */}
      <div 
        onClick={() => {
            setIsOpen(true);
            setSearch(value || ''); // Ensure they see what they are editing
        }} 
        className={`w-full px-4 py-3 border bg-white rounded-lg text-sm flex items-center justify-between cursor-pointer transition-all ${
          isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-400'
        }`}
      >
        <span className={value && !isOpen ? "text-gray-900 font-bold" : "text-gray-400"}>
          {isOpen ? "Type to search..." : (value || "Search City or Airport...")}
        </span>
        <Search size={14} className="text-gray-400" />
      </div>
      
      {/* The Open Dropdown State */}
      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden left-0 animate-in fade-in zoom-in duration-150">
          
          {/* The Actual Input Box */}
          <div className="p-3 bg-gray-50 border-b shrink-0" onClick={(e) => e.stopPropagation()}>
            <input 
              type="text" 
              placeholder="Start typing (e.g. Rome)..." 
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-900" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              onKeyDown={handleKeyDown}
              autoFocus 
            />
          </div>
          
          <div className="max-h-[300px] overflow-y-auto flex flex-col">
            
            {/* Loading State */}
            {isLoading && (
               <div className="px-4 py-6 text-center text-sm text-blue-500 font-medium animate-pulse italic">
                 Searching database...
               </div>
            )}

            {/* Database Results */}
            {!isLoading && results.map((opt, idx) => (
               <div 
                 key={idx} 
                 onClick={() => { 
                   onChange(opt.name, opt.type); 
                   setIsOpen(false); 
                 }} 
                 className="flex flex-col gap-0.5 px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 group"
               >
                 <div className="flex items-center gap-2">
                   {opt.type === 'city' ? <Building2 size={14} className="text-gray-400"/> : <Plane size={14} className="text-blue-500"/>}
                   <span className="font-bold text-gray-800 group-hover:text-blue-700">{opt.name}</span>
                 </div>
                 <div className="text-[10px] text-gray-400 ml-5 font-medium uppercase tracking-wider">
                   {opt.stateName ? `${opt.stateName}, ` : ''}{opt.countryName}
                 </div>
               </div>
            ))}

            {/* The Manual Override Button */}
            {!isLoading && search.trim().length > 0 && search !== value && (
                <div 
                    onClick={handleManualSubmit}
                    className="px-4 py-3 mt-auto bg-green-50 hover:bg-green-100 border-t border-green-200 cursor-pointer transition-colors group flex items-center justify-between"
                >
                    <div className="flex items-center gap-2">
                        <div className="bg-green-200 text-green-700 p-1 rounded"><Plus size={14} /></div>
                        <span className="font-bold text-green-800 text-sm group-hover:text-green-900 truncate max-w-[200px]">
                            Use "{search.trim()}"
                        </span>
                    </div>
                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider shrink-0">Manual Entry</span>
                </div>
            )}

            {/* Empty State Instructions */}
            {search.length < 2 && !isLoading && (
              <div className="px-3 py-8 text-center text-xs text-gray-400 uppercase tracking-widest font-bold">
                Type 2+ characters to search
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

// const CitySelect = ({ 
//   value, 
//   onChange 
// }: { 
//   value: string, 
//   onChange: (name: string, type: 'city' | 'airport') => void 
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [search, setSearch] = useState('');
//   const [results, setResults] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const { itineraryData } = useItinerary();
//   const wrapperRef = useRef<HTMLDivElement>(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false);
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // --- THE SEARCH ENGINE (DEBOUNCED) ---
//   useEffect(() => {
//     // Only search if user types at least 2 characters
//     if (search.length < 2) {
//       setResults([]);
//       return;
//     }

//     const delayDebounceFn = setTimeout(async () => {
//       setIsLoading(true);
//       try {
//         const countries = itineraryData.selectedCountries?.join(',') || '';
//         const response = await fetch(`/api/locations/search?q=${encodeURIComponent(search)}&countries=${encodeURIComponent(countries)}`);
//         const json = await response.json();
        
//         if (json.success) {
//           setResults(json.data);
//         }
//       } catch (error) {
//         console.error("Search API Error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }, 300); // 300ms delay

//     return () => clearTimeout(delayDebounceFn);
//   }, [search, itineraryData.selectedCountries]);

//   return (
//     <div className={`relative w-full ${isOpen ? 'z-50' : 'z-auto'}`} ref={wrapperRef}>
//       <div 
//         onClick={() => setIsOpen(!isOpen)} 
//         className={`w-full px-4 py-3 border bg-white rounded-lg text-sm flex items-center justify-between cursor-pointer transition-all ${
//           isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-400'
//         }`}
//       >
//         <span className={value ? "text-gray-900 font-bold" : "text-gray-400"}>
//           {value || "Search City or Airport..."}
//         </span>
//         <Search size={14} className="text-gray-400" />
//       </div>
      
//       {isOpen && (
//         <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden left-0 animate-in fade-in zoom-in duration-150">
          
//           <div className="p-3 bg-gray-50 border-b shrink-0" onClick={(e) => e.stopPropagation()}>
//             <input 
//               type="text" 
//               placeholder="Start typing (e.g. Rome)..." 
//               className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
//               value={search} 
//               onChange={(e) => setSearch(e.target.value)} 
//               autoFocus 
//             />
//           </div>
          
//           <div className="max-h-[250px] overflow-y-auto">
//             {isLoading && (
//                <div className="px-4 py-6 text-center text-sm text-blue-500 font-medium animate-pulse italic">
//                  Searching database...
//                </div>
//             )}

//             {!isLoading && results.map((opt, idx) => (
//                <div 
//                  key={idx} 
//                  onClick={() => { 
//                    onChange(opt.name, opt.type); 
//                    setIsOpen(false); 
//                    setSearch(''); 
//                  }} 
//                  className="flex flex-col gap-0.5 px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 group"
//                >
//                  <div className="flex items-center gap-2">
//                    {opt.type === 'city' ? <Building2 size={14} className="text-gray-400"/> : <Plane size={14} className="text-blue-500"/>}
//                    <span className="font-bold text-gray-800 group-hover:text-blue-700">{opt.name}</span>
//                  </div>
//                  <div className="text-[10px] text-gray-400 ml-5 font-medium uppercase tracking-wider">
//                    {opt.stateName ? `${opt.stateName}, ` : ''}{opt.countryName}
//                  </div>
//                </div>
//             ))}

//             {!isLoading && search.length >= 2 && results.length === 0 && (
//                <div className="px-3 py-8 text-center text-sm text-gray-400 italic">
//                  No matches found in your selected countries.
//                </div>
//             )}
            
//             {search.length < 2 && !isLoading && (
//               <div className="px-3 py-8 text-center text-xs text-gray-400 uppercase tracking-widest font-bold">
//                 Type 2+ characters to search
//               </div>
//             )}
//           </div>

//         </div>
//       )}
//     </div>
//   );
// };


export default function RoutingPage() {
  const router = useRouter();
  // 1. Get completeStep
  // const { itineraryData, updateRoutingData, saveItinerary, isSaving, saveSuccess, completeStep } = useItinerary();
  const { itineraryData, updateRoutingData, updateItineraryData, saveItinerary, isSaving, saveSuccess, completeStep } = useItinerary();
  
  const [isHydrated, setIsHydrated] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [routes, setRoutes] = useState<any[]>([
    {
      id: 1,
      dayNumber: 1,
      date: '',
      nights: 2,
      cities: [{ name: '', type: 'city' }],
      transportMode: 'vehicle',
    }
  ]);

  // 2. SECURITY GUARD: Redirect if Intro (Step 1) is not complete
  useEffect(() => {
    if (!itineraryData.tripName) {
        router.push('/dashboard/itinerary/create');
    }
  }, [itineraryData.tripName, router]);

  // --- EFFECT 1: HYDRATION ---
  useEffect(() => {
    if (isHydrated) return;

    if (itineraryData.routingData && itineraryData.routingData.routes.length > 0) {
       setRoutes(itineraryData.routingData.routes);
       setStartDate(itineraryData.routingData.startDate || '');
       setEndDate(itineraryData.routingData.endDate || '');
       setIsHydrated(true); 
    } else if (itineraryData.tripId) {
        setIsHydrated(true); 
    }
  }, [startDate, routes, isHydrated, itineraryData.isMasterItinerary]);

  // --- EFFECT 2: CALCULATOR (Dates are now optional for all) ---
  useEffect(() => {
    if (!isHydrated) return; 

    const calculateTimeline = () => {
      let currentDayCount = 1;
      
      // If a date is picked, use it. Otherwise, it stays null (optional)
      let currentDateObj = startDate ? new Date(startDate) : null;
      
      const updatedRoutes = routes.map((route) => {
        const rowDay = currentDayCount;
        const rowDate = currentDateObj ? currentDateObj.toISOString().split('T')[0] : '';
        const duration = Math.max(0, parseInt(route.nights) || 0); 
        
        currentDayCount += duration;
        if (currentDateObj) currentDateObj.setDate(currentDateObj.getDate() + duration);

        return { ...route, dayNumber: rowDay, date: rowDate };
      });

      if (JSON.stringify(updatedRoutes) !== JSON.stringify(routes)) {
         setRoutes(updatedRoutes);
      }

      const calcEndDate = currentDateObj ? currentDateObj.toISOString().split('T')[0] : '';
      if (calcEndDate !== endDate) setEndDate(calcEndDate);

      const newRoutingData = {
          startDate: startDate,
          endDate: calcEndDate,
          routes: updatedRoutes
      };

      const contextStr = JSON.stringify(itineraryData.routingData);
      const newStr = JSON.stringify(newRoutingData);

      if (contextStr !== newStr) {
          updateRoutingData(newRoutingData);
      }
    };

    calculateTimeline();
  }, [startDate, routes, isHydrated]); 


  // --- HANDLERS (Mathematical Tab Logic) ---
  const handleSetTotalCities = (targetTotal: number) => {
    const currentCount = routes.length;
    if (targetTotal <= currentCount) return; // Prevent deleting rows accidentally
    
    const rowsToAdd = targetTotal - currentCount;
    const baseTime = Date.now();
    const newRows = Array.from({ length: rowsToAdd }).map((_, i) => ({
      id: baseTime + i, 
      dayNumber: 0,
      date: '',
      nights: 1,
      cities: [{ name: '', type: 'city' }],
      transportMode: 'vehicle',
    }));
    setRoutes(prev => [...prev, ...newRows]);
  };

  const handleAddSingleCity = () => {
     handleSetTotalCities(routes.length + 1);
  };

  const removeDay = (id: number) => {
    if (routes.length <= 1) return;
    setRoutes(prev => prev.filter(r => r.id !== id));
  };

  const updateRouteField = (id: number, field: string, value: any) => {
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const updateCity = (routeId: number, cityIdx: number, field: 'name'|'type', value: string) => {
    setRoutes(prev => prev.map(r => {
      if (r.id === routeId) {
        const newCities = [...r.cities];
        newCities[cityIdx] = { ...newCities[cityIdx], [field]: value };
        return { ...r, cities: newCities };
      }
      return r;
    }));
  };

  const removeCitySlot = (routeId: number, cityIdx: number) => {
    setRoutes(prev => prev.map(r => {
      if (r.id === routeId && r.cities.length > 1) {
        return { ...r, cities: r.cities.filter((_: any, i: number) => i !== cityIdx) };
      }
      return r;
    }));
  };



  const handleNext = async () => {
    const hasEmptyCities = routes.some(r => r.cities.some((c:any) => !c.name));
    if(hasEmptyCities) {
        alert("Please select cities for all days before proceeding.");
        return;
    }

    // 🌟 NEW: GLOBAL CLEANUP SCRIPT (Upgraded for BOTH ways) 🌟
    // This scans every hotel in the itinerary. If the user changed the routing nights
    // (up or down), it instantly forces the hotels to match *before* the Create Day page loads!
    if (itineraryData.dayWiseActivities && itineraryData.dayWiseActivities.length > 0) {
        let hasChanges = false;
        
        const updatedDays = itineraryData.dayWiseActivities.map((day: any) => {
            if (!day.stays || day.stays.length === 0) return day;

            // 1. Find the current routing limit for this specific day's city
            const matchingRoute = routes.find((route: any) =>
                route.cities?.some((c: any) => c.name?.toLowerCase() === day.city?.toLowerCase())
            );
            const maxNights = matchingRoute ? (parseInt(String(matchingRoute.nights)) || 1) : 1;

            // 2. Check and correct each stay if it does not EXACTLY match the routing
            const correctedStays = day.stays.map((stay: any) => {
                if (stay.nights !== maxNights) { // 👈 FIX: Changed from > to !==
                    hasChanges = true;
                    return { ...stay, nights: maxNights };
                }
                return stay;
            });

            return { ...day, stays: correctedStays };
        });

        // 3. Save the cleaned-up data to global memory instantly
        if (hasChanges) {
            updateItineraryData({ dayWiseActivities: updatedDays } as any);
        }
    }

    await saveItinerary('quick'); 
    
    // UNLOCK CREATE DAY
    completeStep('routing');
    router.push('/dashboard/itinerary/create-day');
  };


  // Helper function to format the table date to "March 15, 2026"
  const formatTableDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // 👇 ADD THIS NEW FUNCTION HERE: Forces MM/DD/YYYY format for the Top Bar
  const formatAmericanDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${month}/${day}/${year}`;
  };

  const totalNights = routes.reduce((acc, route) => acc + (parseInt(route.nights) || 0), 0);
  const totalDays = totalNights + 1; 

  if (!isHydrated) return <div className="p-10 text-center text-gray-500">Loading Itinerary...</div>;

  return (
    <div className="p-4 md:p-6 pb-40 min-h-screen"> 
      
      {/* 1. TOP BAR */}
      <div className="bg-[#1f2544] rounded-t-xl shadow-lg p-5 border-b border-gray-700 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-wrap">
             <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Set Total Cities</span>
             <div className="flex flex-wrap gap-2">
               {/* 🌟 FIX: Tabs now only highlight the currently active count, and display "+X Cities" */}
               {[2, 3, 4, 5, 6].map(num => (
                  <button key={num} onClick={() => handleSetTotalCities(num)}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all border ${
                        routes.length === num 
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md' 
                        : 'bg-[#3b4358] text-gray-200 hover:bg-blue-500 hover:text-white border-gray-600 hover:border-blue-400'
                    }`}>
                    +{num} Cities
                  </button>
               ))}
             </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
             {saveSuccess && <span className="text-green-400 text-xs font-bold animate-pulse">Saved!</span>}
             {isSaving && <span className="text-blue-400 text-xs font-bold">Saving...</span>}
            

            {/* 🌟 FIX: Locked American Format (MM/DD/YYYY) with Custom Overlay */}
             <div className="flex items-center bg-gray-200 p-1 rounded-xl border border-gray-400 shadow-inner">
                
                {/* START DATE */}
                <div className="relative flex items-center">
                    {/* This span holds our forced American format */}
                    <span className="absolute left-3 text-gray-800 text-sm font-bold pointer-events-none z-10">
                        {startDate ? formatAmericanDate(startDate) : "MM/DD/YYYY"}
                    </span>
                    {/* The native input is made transparent so it just acts as a clickable trigger */}
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                        className="pl-5 pr-2 py-2 bg-transparent text-sm focus:outline-none cursor-pointer w-[140px] relative z-20" 
                        style={{ color: 'transparent' }} 
                    />
                </div>
                
                <div className="h-6 w-px bg-gray-400 mx-1"></div>
                
                {/* END DATE */}
                <div className="relative flex items-center opacity-70">
                    <Calendar size={14} className="absolute left-3 text-gray-600 pointer-events-none z-10" />
                    <span className="absolute left-9 text-gray-800 text-sm font-bold pointer-events-none z-10">
                        {endDate ? formatAmericanDate(endDate) : "MM/DD/YYYY"}
                    </span>
                    <input 
                        type="date" 
                        value={endDate} 
                        disabled 
                        className="pl-9 pr-2 py-2 bg-transparent text-sm focus:outline-none cursor-not-allowed w-[150px] relative z-20" 
                        style={{ color: 'transparent' }}
                    />
                </div>
                
            </div>
          </div>
      </div>

      {/* 2. MAIN TABLE */}
      <div className="bg-white/10 rounded-b-xl shadow-xl border border-gray-800 overflow-visible min-h-[500px]">
         <div className="px-6 py-4 border-b border-gray-100 bg-[#1f2544] flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-red-500 font-bold text-lg">
               <Clock className="text-red-500" size={18} />
               <span>Total Duration: <span className="text-gray-100">{totalNights} Nights</span> / <span className="text-gray-100">{totalDays} Days</span></span>
            </h3>
         </div>

         <div className="overflow-x-auto pb-48">
            <table className="w-full min-w-[900px] table-auto">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                   <th className="w-12 py-4"></th>
                   <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase w-24">Day</th>
                   <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase w-48">Date / Sequence</th>
                   <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase w-32">Nights</th>
                   <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Cities / Airports</th>
                   <th className="px-9 py-4 text-left text-xs font-bold text-gray-700 uppercase w-48">Remove City </th>
                   <th className="w-16 py-4"></th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200">
                {routes.map((route) => (
                  <tr key={route.id} className="hover:bg transition-colors group">
                    <td className="px-2 py-6 align-top text-center"><button className="text-gray-300 hover:text-gray-500 cursor-grab mt-3"><GripVertical size={20} /></button></td>
                    <td className="px-6 py-6 align-top"><div className="mt-1 w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 font-bold rounded-lg text-sm border border-blue-100">{route.dayNumber}</div></td>
                    
                    {/* 🌟 FIX: Formatted Table Date Logic ("March 15, 2026") */}
                    <td className="px-6 py-6 align-top">
                        <div className={`mt-3 text-[13px] font-medium px-3 py-1.5 rounded-md inline-block shadow-sm ${route.date ? 'bg-blue-50 text-blue-800 border border-blue-100' : 'text-gray-300 bg-white/5 border border-transparent'}`}>
                            {route.date ? formatTableDate(route.date) : `Day ${route.dayNumber}`}
                        </div>
                    </td>

                    <td className="px-6 py-6 align-top">
                      <div className="relative">
                        <select value={route.nights} onChange={(e) => updateRouteField(route.id, 'nights', parseInt(e.target.value))} 
                          className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:border-blue-500 outline-none hover:border-gray-300">
                          {[0,1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400 text-xs">▼</div>
                      </div>
                    </td>
                    <td className="px-6 py-6 align-top">
                        <div className="space-y-3">
                             {route.cities.map((city: any, cityIndex: number) => (
                             <div key={cityIndex} className="flex items-center gap-2">
                                <CitySelect 
                                  value={city.name} 
                                  onChange={(name, type) => updateCity(route.id, cityIndex, 'name', name)} 
                                />
                                {route.cities.length > 1 && (
                                    <button onClick={() => removeCitySlot(route.id, cityIndex)} className="text-gray-300 hover:text-red-500 "><X size={16}/></button>
                                )}
                              </div>
                             ))}
                        </div>
                    </td>
                
                    <td className="px-5 py-6 align-top text-center ">
                      <button onClick={() => removeDay(route.id)} disabled={routes.length === 1}
                        className={`p-2 rounded-lg transition-all bg-gray-600 mt-1 ${routes.length === 1 ? 'text-gray-100 cursor-not-allowed' : 'text-gray-200 hover:bg-red-50 hover:text-red-500'}`}>
                        <Trash2 size={19} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-6 bg border-t border-gray-100 flex justify-end rounded-b-xl">
               <button onClick={handleAddSingleCity} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-sm text-sm"><Plus size={16} /> Add City</button>
            </div>
         </div>
      </div>

      {/* 3. NAVIGATION BUTTONS */}
      <div className="flex justify-between items-center mt-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white px-6 py-3 rounded-lg font-medium hover:bg-white/5"><ArrowLeft size={18} /> Back</button>
        <button onClick={handleNext} className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02]">
            Next Step: Create Day <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}