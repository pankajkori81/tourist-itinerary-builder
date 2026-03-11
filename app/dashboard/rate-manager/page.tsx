

// "use client";

// import React, { useState, useEffect, useMemo } from 'react';
// import { useUser } from '@/app/context/UserContext';
// import { 
//     Landmark, Plus, Save, Loader2, AlertCircle, 
//     Trash2, Building2, Globe, MapPin, ChevronDown, ChevronRight 
// } from 'lucide-react';
// import { getAllTariffs, saveTariff } from '@/utils/tariffAPI';

// export default function RateManagerPage() {
//   const { user, loading: userLoading } = useUser();
  
//   // Data States
//   const [srmItems, setSrmItems] = useState<any[]>([]);
//   const [tariffs, setTariffs] = useState<any[]>([]);
//   const [isLoadingData, setIsLoadingData] = useState(true);

//   // Form & UI States
//   const [selectedServiceId, setSelectedServiceId] = useState('');
//   const [activeTariff, setActiveTariff] = useState<any>(null);
//   const [isSaving, setIsSaving] = useState(false);
  
//   // Accordion States for Sidebar
//   const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
//   const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

//   // 1. SECURITY CHECK
//   if (!userLoading && user?.role !== 'admin') {
//       return (
//           <div className="flex flex-col items-center justify-center h-full text-red-600 p-10 bg-gray-50">
//               <AlertCircle size={48} className="mb-4" />
//               <h2 className="text-2xl font-bold">Access Denied</h2>
//               <p>Only Administrators can access the Rate & Tariff Manager.</p>
//           </div>
//       );
//   }

//   // 2. FETCH DATA
//   const loadData = async () => {
//       setIsLoadingData(true);
//       try {
//           const stayRes = await fetch('/api/srm/stays'); 
//           if (!stayRes.ok) throw new Error(`API Error`);
//           const stayJson = await stayRes.json();
//           const tariffData = await getAllTariffs();

//           setSrmItems(stayJson.data || []);
//           setTariffs(tariffData || []);
//       } catch (error) {
//           console.error("Error loading Rate Manager data:", error);
//       } finally {
//           setIsLoadingData(false);
//       }
//   };

//   useEffect(() => {
//       if (user?.role === 'admin') loadData();
//   }, [user]);

//   // 🌟 NEW: GROUPING ENGINE (Country -> City -> Hotel) 🌟
//   const groupedData = useMemo(() => {
//     const groups: Record<string, Record<string, any[]>> = {};

//     srmItems.forEach(item => {
//       const country = (item.country || "Uncategorized").trim();
//       const city = (item.city || "Unknown City").trim();

//       if (!groups[country]) groups[country] = {};
//       if (!groups[country][city]) groups[country][city] = [];
//       groups[country][city].push(item);
//     });

//     // Sort alphabetically
//     return Object.keys(groups).sort().reduce((acc, country) => {
//         acc[country] = groups[country];
//         return acc;
//     }, {} as Record<string, Record<string, any[]>>);
//   }, [srmItems]);

//   // Auto-expand the first country and city on load
// //   useEffect(() => {
// //       if (Object.keys(groupedData).length > 0 && Object.keys(expandedCountries).length === 0) {
// //           const firstCountry = Object.keys(groupedData);
// //           setExpandedCountries({ [firstCountry]: true });
          
// //           const firstCity = Object.keys(groupedData[firstCountry]);
// //           setExpandedCities({ [`${firstCountry}-${firstCity}`]: true });
// //       }
// //   }, [groupedData]);


// // Auto-expand the first country and city on load
//   useEffect(() => {
//       if (Object.keys(groupedData).length > 0 && Object.keys(expandedCountries).length === 0) {
//           const firstCountry = Object.keys(groupedData)[0]; // Get first element
//           setExpandedCountries({ [firstCountry]: true });
          
//           const firstCity = Object.keys(groupedData[firstCountry])[0]; // Get first element
//           setExpandedCities({ [`${firstCountry}-${firstCity}`]: true });
//       }
//   }, [groupedData]);

//   // 3. HANDLE HOTEL SELECTION
//   const handleServiceSelect = (serviceId: string) => {
//       setSelectedServiceId(serviceId);
//       const serviceData = srmItems.find(item => item._id === serviceId);
      
//       if (!serviceData) {
//           setActiveTariff(null);
//           return;
//       }

//       const existingTariff = tariffs.find(t => t.serviceId === serviceId);

//       if (existingTariff) {
//           setActiveTariff(existingTariff);
//       } else {
//           // Auto-generate blank rooms based on SRM data
//           const defaultRates = (serviceData.roomCategories || []).map((room: any) => ({
//               name: room.name,
//               netPrice: 0
//           }));

//           setActiveTariff({
//               serviceId: serviceId,
//               serviceName: serviceData.name,
//               serviceType: 'Stay',
//               seasons: [{
//                   seasonName: 'Default Season',
//                   startDate: '',
//                   endDate: '',
//                   rates: defaultRates.length > 0 ? defaultRates : [{ name: 'Standard Room', netPrice: 0 }]
//               }]
//           });
//       }
//   };

//   // 4. FORM HANDLERS
//   const updateSeason = (seasonIndex: number, field: string, value: any) => {
//       const updated = { ...activeTariff };
//       updated.seasons[seasonIndex][field] = value;
//       setActiveTariff(updated);
//   };

//   const deleteSeason = (seasonIndex: number) => {
//       if (!confirm("Are you sure you want to delete this entire season?")) return;
//       const updated = { ...activeTariff };
//       updated.seasons.splice(seasonIndex, 1);
//       setActiveTariff(updated);
//   };

//   const addRoomRate = (seasonIndex: number) => {
//       const updated = { ...activeTariff };
//       updated.seasons[seasonIndex].rates.push({ name: 'New Room Category', netPrice: 0 });
//       setActiveTariff(updated);
//   };

//   const removeRoomRate = (seasonIndex: number, rateIndex: number) => {
//       const updated = { ...activeTariff };
//       updated.seasons[seasonIndex].rates.splice(rateIndex, 1);
//       setActiveTariff(updated);
//   };

//   const updateRateName = (seasonIndex: number, rateIndex: number, value: string) => {
//       const updated = { ...activeTariff };
//       updated.seasons[seasonIndex].rates[rateIndex].name = value;
//       setActiveTariff(updated);
//   };

//   const updateRatePrice = (seasonIndex: number, rateIndex: number, value: number) => {
//       const updated = { ...activeTariff };
//       updated.seasons[seasonIndex].rates[rateIndex].netPrice = value;
//       setActiveTariff(updated);
//   };

//   const handleSave = async () => {
//       setIsSaving(true);
//       const success = await saveTariff(activeTariff);
//       if (success) {
//           alert("Tariff Saved Successfully!");
//           await loadData();
//       } else {
//           alert("Failed to save tariff.");
//       }
//       setIsSaving(false);
//   };

//   if (userLoading || isLoadingData) return (
//       <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-blue-600">
//           <Loader2 size={48} className="animate-spin mb-4" />
//           <p className="font-bold uppercase tracking-widest text-sm">Accessing Secure Vault...</p>
//       </div>
//   );

//   return (
//     <div className="h-full flex flex-col bg-gray-100 overflow-hidden">
//         {/* Header */}
//         <div className="bg-[#0a1f44] text-white px-8 py-4 shadow-md shrink-0 z-10 flex justify-between items-center">
//             <div>
//                 <h1 className="text-xl font-bold flex items-center gap-1">
//                     <Landmark className="text-yellow-400" size={24} /> Contract & Rate Manager
//                 </h1>
//                 <p className="text-sm text-blue-200 mt-0 font-medium">Manage confidential B2B Net Cost matrices.</p>
//             </div>
//             {activeTariff && (
//                 <button 
//                     onClick={handleSave} 
//                     disabled={isSaving}
//                     className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
//                 >
//                     {isSaving ? <Loader2 size={20} className="animate-spin"/> : <Save size={20}/>}
//                     Save Contract
//                 </button>
//             )}
//         </div>

//         {/* Main Workspace (Split View) */}
//         <div className="flex-1 flex overflow-hidden">
            
//             {/* 🌟 LEFT SIDEBAR: Hierarchical Navigation 🌟 */}
//             <div className="w-[300px] bg-gray-200 border-r border-gray-200 overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0">
//                 <div className="p-5 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
//                     <h3 className="font-extrabold text-gray-900 uppercase tracking-wider text-xs">Directory Navigation</h3>
//                     <p className="text-xs text-gray-600 mt-1">Select a property to manage rates</p>
//                 </div>

//                 <div className="p-3 space-y-2">
//                     {Object.keys(groupedData).length === 0 ? (
//                         <div className="p-6 text-center text-gray-400 text-sm">No properties found in SRM.</div>
//                     ) : (
//                         Object.entries(groupedData).map(([country, cities]) => (
//                             <div key={country} className="select-none">
//                                 {/* TIER 1: COUNTRY */}
//                                 <div 
//                                     onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))}
//                                     className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors border border-slate-200 mb-1"
//                                 >
//                                     <div className="text-slate-500">
//                                         {expandedCountries[country] ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
//                                     </div>
//                                     <Globe size={16} className="text-blue-600" />
//                                     <span className="font-bold text-slate-800 text-sm">{country}</span>
//                                 </div>

//                                 {/* TIER 2: CITIES */}
//                                 {expandedCountries[country] && (
//                                     <div className="ml-5 pl-3 border-l-2 border-slate-100 space-y-1 mt-1 mb-3">
//                                         {Object.entries(cities).map(([city, hotels]) => {
//                                             const cityKey = `${country}-${city}`;
//                                             return (
//                                                 <div key={city}>
//                                                     <div 
//                                                         onClick={() => setExpandedCities(prev => ({...prev, [cityKey]: !prev[cityKey]}))}
//                                                         className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
//                                                     >
//                                                         <div className="text-slate-400">
//                                                             {expandedCities[cityKey] ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
//                                                         </div>
//                                                         <MapPin size={14} className="text-red-500" />
//                                                         <span className="font-bold text-slate-700 text-sm">{city}</span>
//                                                         <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{hotels.length}</span>
//                                                     </div>

//                                                     {/* TIER 3: HOTELS (Clickable) */}
//                                                     {expandedCities[cityKey] && (
//                                                         <div className="ml-6 mt-1 space-y-1 mb-2">
//                                                             {hotels.map(hotel => {
//                                                                 const hasTariff = tariffs.some(t => t.serviceId === hotel._id);
//                                                                 const isActive = selectedServiceId === hotel._id;

//                                                                 return (
//                                                                     <button
//                                                                         key={hotel._id}
//                                                                         onClick={() => handleServiceSelect(hotel._id)}
//                                                                         className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${
//                                                                             isActive 
//                                                                             ? 'bg-blue-600 text-white shadow-md' 
//                                                                             : 'hover:bg-blue-50 text-slate-600'
//                                                                         }`}
//                                                                     >
//                                                                         <span className={`text-xs font-semibold truncate pr-2 ${isActive ? 'text-white' : 'text-slate-700'}`}>
//                                                                             {hotel.name}
//                                                                         </span>
//                                                                         <span className="shrink-0" title={hasTariff ? 'Contract Active' : 'Rates Missing'}>
//                                                                             {hasTariff ? '✅' : '⚠️'}
//                                                                         </span>
//                                                                     </button>
//                                                                 );
//                                                             })}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 )}
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>

//             {/* 🌟 RIGHT SIDE: Pricing Matrix Workspace 🌟 */}
//             <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
                
//                 {!activeTariff ? (
//                     <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
//                         <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
//                             <Building2 size={40} className="text-blue-300" />
//                         </div>
//                         <h3 className="text-2xl font-bold text-gray-800 mb-2">Workspace Ready</h3>
//                         <p className="text-gray-500 leading-relaxed">
//                             Use the directory on the left to select a property. You can then define seasonal contracts and manage net pricing matrices.
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
//                         {/* Title for Active Property */}
//                         <div className="flex items-center gap-3 mb-2">
//                             <h2 className="text-2xl font-extrabold text-gray-800">{activeTariff.serviceName}</h2>
//                             <span className="px-3 py-0 bg-blue-100 text-blue-800 text-xs font-bold uppercase rounded-full border border-blue-200 shadow-sm">
//                                 Direct Contract
//                             </span>
//                         </div>

//                         {/* Seasons Loop */}
//                         {activeTariff.seasons.map((season: any, sIndex: number) => (
//                             <div key={sIndex} className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden group">
                                
//                                 {/* Season Header Bar */}
//                                 <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200 flex flex-wrap gap-6 items-center">
//                                     <div className="flex-1 min-w-[200px]">
//                                         <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider mb-1 block">Season Name</label>
//                                         <input 
//                                             type="text" 
//                                             value={season.seasonName} 
//                                             onChange={e => updateSeason(sIndex, 'seasonName', e.target.value)} 
//                                             className="w-full p-2 bg-white border border-gray-300 rounded-lg font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500" 
//                                             placeholder="e.g. Peak Season 2026"
//                                         />
//                                     </div>
//                                     <div className="flex items-center gap-4 bg-white p-1 rounded-md border border-gray-200 shadow-sm">
//                                         <div>
//                                             <label className="text-[9px] font-bold text-gray-600 uppercase ml-1 block">Start Date</label>
//                                             <input type="date" value={season.startDate} onChange={e => updateSeason(sIndex, 'startDate', e.target.value)} className="p-2 font-bold text-gray-700 outline-none bg-transparent cursor-pointer"/>
//                                         </div>
//                                         <div className="w-6 h-px bg-gray-300"></div>
//                                         <div>
//                                             <label className="text-[9px] font-bold text-gray-600 uppercase ml-1 block">End Date</label>
//                                             <input type="date" value={season.endDate} onChange={e => updateSeason(sIndex, 'endDate', e.target.value)} className="p-2 font-bold text-gray-700 outline-none bg-transparent cursor-pointer"/>
//                                         </div>
//                                     </div>
//                                     <button onClick={() => deleteSeason(sIndex)} className="p-3 text-gray-400 hover:text-white hover:bg-red-500 rounded-xl transition-colors shadow-sm bg-white border border-gray-200" title="Delete Season">
//                                         <Trash2 size={20} />
//                                     </button>
//                                 </div>

//                                 {/* Room Rates Grid */}
//                                 <div className="p-6">
//                                     <h4 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Net Room Rates Matrix</h4>
                                    
//                                     <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
//                                         {season.rates.map((rate: any, rIndex: number) => (
//                                             <div key={rIndex} className="relative flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors group/rate">
                                                
//                                                 <input 
//                                                     type="text" 
//                                                     value={rate.name} 
//                                                     onChange={(e) => updateRateName(sIndex, rIndex, e.target.value)}
//                                                     className="w-[80%] text-sm font-bold text-gray-800 bg-transparent outline-none mb-3 border-b border-transparent focus:border-blue-400"
//                                                     placeholder="Room Name"
//                                                 />
                                                
//                                                 <div className="flex items-center gap-2 mt-auto">
//                                                     <div className="bg-white border border-gray-300 rounded-lg p-1 flex-1 flex items-center focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
//                                                         <span className="px-3 text-gray-400 font-bold">$</span>
//                                                         <input 
//                                                             type="number" min="0"
//                                                             value={rate.netPrice || ''} 
//                                                             onChange={(e) => updateRatePrice(sIndex, rIndex, parseFloat(e.target.value) || 0)}
//                                                             className="w-full py-1 text-md font-black text-gray-800 outline-none bg-transparent"
//                                                             placeholder="0"
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 <button 
//                                                     onClick={() => removeRoomRate(sIndex, rIndex)} 
//                                                     className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover/rate:opacity-100 transition-opacity p-1"
//                                                     title="Remove Room"
//                                                 >
//                                                     <Trash2 size={16} />
//                                                 </button>
//                                             </div>
//                                         ))}
                                        
//                                         {/* Add New Room Button */}
//                                         <button 
//                                             onClick={() => addRoomRate(sIndex)} 
//                                             className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all min-h-[100px]"
//                                         >
//                                             <Plus size={24} className="mb-2" />
//                                             <span className="text-xs font-bold uppercase tracking-wider">Add Room Type</span>
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
                        
//                         <button 
//                             onClick={() => {
//                                 const updated = {...activeTariff};
//                                 const lastSeasonIndex = updated.seasons.length > 0 ? updated.seasons.length - 1 : 0;
//                                 let newRates = [];
                                
//                                 if (updated.seasons.length > 0) {
//                                     newRates = updated.seasons[lastSeasonIndex].rates.map((r:any) => ({ name: r.name, netPrice: 0 }));
//                                 } else {
//                                     newRates = [{ name: 'Standard Room', netPrice: 0 }]; 
//                                 }

//                                 updated.seasons.push({ seasonName: 'New Season', startDate: '', endDate: '', rates: newRates });
//                                 setActiveTariff(updated);
//                             }}
//                             className="w-full py-4 border-2 border-dashed border-blue-400 bg-blue-50/50 text-blue-700 font-extrabold text-sm tracking-wide rounded-2xl hover:bg-blue-100 hover:border-blue-500 transition-all flex items-center justify-center gap-2 shadow-sm"
//                         >
//                             <Plus size={20} strokeWidth={3} /> ADD NEW SEASON TIMEFRAME
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     </div>
//   );
// } 





































// "use client";

// import React, { useState, useEffect, useMemo } from 'react';
// import { useUser } from '@/app/context/UserContext';
// import { 
//     Landmark, Plus, Save, Loader2, AlertCircle, 
//     Trash2, Building2, Globe, MapPin, ChevronDown, ChevronRight 
// } from 'lucide-react';
// import { getAllTariffs, saveTariff } from '@/utils/tariffAPI';
// import { VEHICLE_TYPES } from '../itinerary/create-day/constants/daywiseConstants';

// export default function RateManagerPage() {
//   const { user, loading: userLoading } = useUser();
  
//   const [srmItems, setSrmItems] = useState<any[]>([]);
//   const [transportItems, setTransportItems] = useState<any[]>([]);
//   const [tariffs, setTariffs] = useState<any[]>([]);
//   const [isLoadingData, setIsLoadingData] = useState(true);

//   const [selectedServiceId, setSelectedServiceId] = useState('');
//   const [activeTariff, setActiveTariff] = useState<any>(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [activeModule, setActiveModule] = useState<'Stay' | 'Transport'>('Stay');
  
//   const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
//   const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

//   if (!userLoading && user?.role !== 'admin') {
//       return (
//           <div className="flex flex-col items-center justify-center h-full text-red-600 p-10 bg-gray-50">
//               <AlertCircle size={48} className="mb-4" />
//               <h2 className="text-2xl font-bold">Access Denied</h2>
//               <p>Only Administrators can access the Rate & Tariff Manager.</p>
//           </div>
//       );
//   }

// //   const loadData = async () => {
// //       setIsLoadingData(true);
// //       try {
// //           const stayRes = await fetch('/api/srm/stays'); 
// //           if (!stayRes.ok) throw new Error(`API Error`);
// //           const stayJson = await stayRes.json();
// //           const tariffData = await getAllTariffs();

// //           setSrmItems(stayJson.data || []);
// //           setTariffs(tariffData || []);
// //       } catch (error) {
// //           console.error("Error loading Rate Manager data:", error);
// //       } finally {
// //           setIsLoadingData(false);
// //       }
// //   };


// // 👇 REPLACED loadData FUNCTION
//   const loadData = async () => {
//       setIsLoadingData(true);
//       try {
//           const stayRes = await fetch('/api/srm/stays'); 
//           if (!stayRes.ok) throw new Error(`API Error`);
//           const stayJson = await stayRes.json();
          
//           // Fetch Transports
//           const transRes = await fetch('/api/srm/transports');
//           let mappedTransports = [];
//           if (transRes.ok) {
//               const transJson = await transRes.json();
//               // Map the name here safely!
//               mappedTransports = (transJson.data || []).map((t: any) => ({
//                   ...t,
//                   name: `${t.vehicleType} - ${t.serviceType}`
//               }));
//           }

//           const tariffData = await getAllTariffs();

//           setSrmItems(stayJson.data || []);
//           setTransportItems(mappedTransports); // Set mapped transports
//           setTariffs(tariffData || []);
//       } catch (error) {
//           console.error("Error loading Rate Manager data:", error);
//       } finally {
//           setIsLoadingData(false);
//       }
//   };

//   useEffect(() => {
//       if (user?.role === 'admin') loadData();
//   }, [user]);

// //   const groupedData = useMemo(() => {
// //     const groups: Record<string, Record<string, any[]>> = {};
// //     srmItems.forEach(item => {
// //       const country = (item.country || "Uncategorized").trim();
// //       const city = (item.city || "Unknown City").trim();
// //       if (!groups[country]) groups[country] = {};
// //       if (!groups[country][city]) groups[country][city] = [];
// //       groups[country][city].push(item);
// //     });
// //     return Object.keys(groups).sort().reduce((acc, country) => {
// //         acc[country] = groups[country];
// //         return acc;
// //     }, {} as Record<string, Record<string, any[]>>);
// //   }, [srmItems]);



// // 👇 REPLACED groupedData FUNCTION
//   const groupedData = useMemo(() => {
//     const groups: Record<string, Record<string, any[]>> = {};
//     const dataToGroup = activeModule === 'Stay' ? srmItems : transportItems; // Dynamic selection
    
//     dataToGroup.forEach(item => {
//       const country = (item.country || "Uncategorized").trim();
//       const city = (item.city || "Unknown City").trim();
//       if (!groups[country]) groups[country] = {};
//       if (!groups[country][city]) groups[country][city] = [];
//       groups[country][city].push(item);
//     });
//     return Object.keys(groups).sort().reduce((acc, country) => {
//         acc[country] = groups[country];
//         return acc;
//     }, {} as Record<string, Record<string, any[]>>);
//   }, [srmItems, transportItems, activeModule]); // Added new dependencies

//   useEffect(() => {
//       if (Object.keys(groupedData).length > 0 && Object.keys(expandedCountries).length === 0) {
//           const firstCountry = Object.keys(groupedData)[0]; 
//           setExpandedCountries({ [firstCountry]: true });
//           const firstCity = Object.keys(groupedData[firstCountry])[0]; 
//           setExpandedCities({ [`${firstCountry}-${firstCity}`]: true });
//       }
//   }, [groupedData]);

// //   const handleServiceSelect = (serviceId: string) => {
// //       setSelectedServiceId(serviceId);
// //       const serviceData = srmItems.find(item => item._id === serviceId);
      
// //       if (!serviceData) {
// //           setActiveTariff(null);
// //           return;
// //       }

// //       const existingTariff = tariffs.find(t => t.serviceId === serviceId);

// //       if (existingTariff) {
// //           setActiveTariff(existingTariff);
// //       } else {
// //           // 🌟 UPGRADED: Generates 4 prices per room
// //           const defaultRates = (serviceData.roomCategories || []).map((room: any) => ({
// //               name: room.name,
// //               singleRate: 0, doubleRate: 0, tripleRate: 0, quadRate: 0
// //           }));

// //           setActiveTariff({
// //               serviceId: serviceId,
// //               serviceName: serviceData.name,
// //               serviceType: 'Stay',
// //               seasons: [{
// //                   seasonName: 'Default Season',
// //                   startDate: '', endDate: '',
// //                   rates: defaultRates.length > 0 ? defaultRates : [{ name: 'Standard Room', singleRate: 0, doubleRate: 0, tripleRate: 0, quadRate: 0 }]
// //               }]
// //           });
// //       }
// //   };


// const handleServiceSelect = (serviceId: string) => {
//       setSelectedServiceId(serviceId);
//       // 👇 Dynamically select the list based on the active tab
//       const dataList = activeModule === 'Stay' ? srmItems : transportItems;
//       const serviceData = dataList.find(item => item._id === serviceId);
      
//       if (!serviceData) {
//           setActiveTariff(null);
//           return;
//       }

//       const existingTariff = tariffs.find(t => t.serviceId === serviceId);

//       if (existingTariff) {
//           setActiveTariff(existingTariff);
//       } else {
//           // 👇 NEW LOGIC: Generate different templates based on module
//           if (activeModule === 'Stay') {
//               const defaultRates = (serviceData.roomCategories || []).map((room: any) => ({
//                   name: room.name,
//                   singleRate: 0, doubleRate: 0, tripleRate: 0, quadRate: 0
//               }));

//               setActiveTariff({
//                   serviceId: serviceId,
//                   serviceName: serviceData.name,
//                   serviceType: 'Stay',
//                   seasons: [{ seasonName: 'Default Season', startDate: '', endDate: '', rates: defaultRates.length > 0 ? defaultRates : [{ name: 'Standard Room', singleRate: 0, doubleRate: 0, tripleRate: 0, quadRate: 0 }] }]
//               });
//           } else {
//               // 🚐 Transport Template: Auto-populates all vehicle types with 0
//               const defaultVehicles = VEHICLE_TYPES.map(vt => ({
//                   vehicleType: vt, transferRate: 0, disposalRate: 0
//               }));

//               setActiveTariff({
//                   serviceId: serviceId,
//                   serviceName: serviceData.name, 
//                   serviceType: 'Transport',
//                   seasons: [{ seasonName: 'Default Season', startDate: '', endDate: '', rates: defaultVehicles }]
//               });
//           }
//       }
//   };

//   const updateSeason = (seasonIndex: number, field: string, value: any) => {
//       const updated = { ...activeTariff };
//       updated.seasons[seasonIndex][field] = value;
//       setActiveTariff(updated);
//   };

//   const deleteSeason = (seasonIndex: number) => {
//       if (!confirm("Are you sure you want to delete this entire season?")) return;
//       const updated = { ...activeTariff };
//       updated.seasons.splice(seasonIndex, 1);
//       setActiveTariff(updated);
//   };

// //   const addRoomRate = (seasonIndex: number) => {
// //       const updated = { ...activeTariff };
// //       // 🌟 UPGRADED: Pushes new room with 4 pricing tiers
// //       updated.seasons[seasonIndex].rates.push({ name: 'New Room Category', singleRate: 0, doubleRate: 0, tripleRate: 0, quadRate: 0 });
// //       setActiveTariff(updated);
// //   };


// const addRoomRate = (seasonIndex: number) => {
//       const updated = { ...activeTariff };
//       if (updated.serviceType === 'Stay') {
//           updated.seasons[seasonIndex].rates.push({ name: 'New Room Category', singleRate: 0, doubleRate: 0, tripleRate: 0, quadRate: 0 });
//       } else {
//           updated.seasons[seasonIndex].rates.push({ vehicleType: 'Sedan Car', transferRate: 0, disposalRate: 0 });
//       }
//       setActiveTariff(updated);
//   };

//   const removeRoomRate = (seasonIndex: number, rateIndex: number) => {
//       const updated = { ...activeTariff };
//       updated.seasons[seasonIndex].rates.splice(rateIndex, 1);
//       setActiveTariff(updated);
//   };

//   const updateRateName = (seasonIndex: number, rateIndex: number, value: string) => {
//       const updated = { ...activeTariff };
//       updated.seasons[seasonIndex].rates[rateIndex].name = value;
//       setActiveTariff(updated);
//   };

//   // 🌟 UPGRADED: Dynamic field updater for the different occupancies
//   const updateRatePrice = (seasonIndex: number, rateIndex: number, field: string, value: number) => {
//       const updated = { ...activeTariff };
//       updated.seasons[seasonIndex].rates[rateIndex][field] = value;
//       setActiveTariff(updated);
//   };

//   const handleSave = async () => {
//       setIsSaving(true);
//       const success = await saveTariff(activeTariff);
//       if (success) {
//           alert("Tariff Saved Successfully!");
//           await loadData();
//       } else {
//           alert("Failed to save tariff.");
//       }
//       setIsSaving(false);
//   };

//   if (userLoading || isLoadingData) return (
//       <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-blue-600">
//           <Loader2 size={48} className="animate-spin mb-4" />
//           <p className="font-bold uppercase tracking-widest text-sm">Accessing Secure Vault...</p>
//       </div>
//   );

//   return (
//     <div className="h-full flex flex-col bg-gray-100 overflow-hidden">
//         <div className="bg-[#0a1f44] text-white px-8 py-4 shadow-md shrink-0 z-10 flex justify-between items-center">
//             <div>
//                 <h1 className="text-xl font-bold flex items-center gap-1">
//                     <Landmark className="text-yellow-400" size={24} /> Contract & Rate Manager
//                 </h1>
//                 <p className="text-sm text-blue-200 mt-0 font-medium">Manage confidential B2B Per-Night Net Cost matrices.</p>
//             </div>
//             {activeTariff && (
//                 <button onClick={handleSave} disabled={isSaving} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
//                     {isSaving ? <Loader2 size={20} className="animate-spin"/> : <Save size={20}/>}
//                     Save Contract
//                 </button>
//             )}
//         </div>

//         <div className="flex-1 flex overflow-hidden">
//             {/* LEFT SIDEBAR */}
//             <div className="w-[300px] bg-gray-200 border-r border-gray-200 overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0">
//                 {/* <div className="p-5 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
//                     <h3 className="font-extrabold text-gray-900 uppercase tracking-wider text-xs">Directory Navigation</h3>
//                     <p className="text-xs text-gray-600 mt-1">Select a property to manage rates</p>
//                 </div> */}


//                 {/* 👇 NEW: Sidebar Tab Toggles */}
// <div className="flex px-4 pt-3 pb-2 gap-2 bg-gray-50 border-b border-gray-200 sticky top-[80px] z-10">
//     <button 
//         onClick={() => { setActiveModule('Stay'); setActiveTariff(null); }}
//         className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeModule === 'Stay' ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
//     >
//         🏨 Hotels
//     </button>
//     <button 
//         onClick={() => { setActiveModule('Transport'); setActiveTariff(null); }}
//         className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeModule === 'Transport' ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
//     >
//         🚐 Transport
//     </button>
// </div>
//                 <div className="p-3 space-y-2">
//                     {Object.keys(groupedData).length === 0 ? (
//                         <div className="p-6 text-center text-gray-400 text-sm">No properties found in SRM.</div>
//                     ) : (
//                         Object.entries(groupedData).map(([country, cities]) => (
//                             <div key={country} className="select-none">
//                                 <div onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))} className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors border border-slate-200 mb-1">
//                                     <div className="text-slate-500">{expandedCountries[country] ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}</div>
//                                     <Globe size={16} className="text-blue-600" />
//                                     <span className="font-bold text-slate-800 text-sm">{country}</span>
//                                 </div>
//                                 {expandedCountries[country] && (
//                                     <div className="ml-5 pl-3 border-l-2 border-slate-100 space-y-1 mt-1 mb-3">
//                                         {Object.entries(cities).map(([city, hotels]) => {
//                                             const cityKey = `${country}-${city}`;
//                                             return (
//                                                 <div key={city}>
//                                                     <div onClick={() => setExpandedCities(prev => ({...prev, [cityKey]: !prev[cityKey]}))} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
//                                                         <div className="text-slate-400">{expandedCities[cityKey] ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}</div>
//                                                         <MapPin size={14} className="text-red-500" />
//                                                         <span className="font-bold text-slate-700 text-sm">{city}</span>
//                                                         <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{hotels.length}</span>
//                                                     </div>
//                                                     {expandedCities[cityKey] && (
//                                                         <div className="ml-6 mt-1 space-y-1 mb-2">
//                                                             {hotels.map(hotel => {
//                                                                 const hasTariff = tariffs.some(t => t.serviceId === hotel._id);
//                                                                 const isActive = selectedServiceId === hotel._id;
//                                                                 return (
//                                                                     <button key={hotel._id} onClick={() => handleServiceSelect(hotel._id)} className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${isActive ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-blue-50 text-slate-600'}`}>
//                                                                         <span className={`text-xs font-semibold truncate pr-2 ${isActive ? 'text-white' : 'text-slate-700'}`}>{hotel.name}</span>
//                                                                         <span className="shrink-0" title={hasTariff ? 'Contract Active' : 'Rates Missing'}>{hasTariff ? '✅' : '⚠️'}</span>
//                                                                     </button>
//                                                                 );
//                                                             })}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 )}
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>

//             {/* RIGHT SIDE: Pricing Matrix Workspace */}
//             <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
//                 {!activeTariff ? (
//                     <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
//                         <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
//                             <Building2 size={40} className="text-blue-300" />
//                         </div>
//                         <h3 className="text-2xl font-bold text-gray-800 mb-2">Workspace Ready</h3>
//                         <p className="text-gray-500 leading-relaxed">Use the directory on the left to select a property. You can then define seasonal contracts and manage net pricing matrices.</p>
//                     </div>
//                 ) : (
//                     <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//                         <div className="flex items-center gap-3 mb-2">
//                             <h2 className="text-2xl font-extrabold text-gray-800">{activeTariff.serviceName}</h2>
//                             <span className="px-3 py-0 bg-blue-100 text-blue-800 text-xs font-bold uppercase rounded-full border border-blue-200 shadow-sm">Direct Contract</span>
//                         </div>

//                         {activeTariff.seasons.map((season: any, sIndex: number) => (
//                             <div key={sIndex} className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden group">
//                                 <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200 flex flex-wrap gap-6 items-center">
//                                     <div className="flex-1 min-w-[200px]">
//                                         <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider mb-1 block">Season Name</label>
//                                         <input type="text" value={season.seasonName} onChange={e => updateSeason(sIndex, 'seasonName', e.target.value)} className="w-full p-2 bg-white border border-gray-300 rounded-lg font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Peak Season 2026"/>
//                                     </div>
//                                     <div className="flex items-center gap-4 bg-white p-1 rounded-md border border-gray-200 shadow-sm">
//                                         <div>
//                                             <label className="text-[9px] font-bold text-gray-600 uppercase ml-1 block">Start Date</label>
//                                             <input type="date" value={season.startDate} onChange={e => updateSeason(sIndex, 'startDate', e.target.value)} className="p-2 font-bold text-gray-700 outline-none bg-transparent cursor-pointer"/>
//                                         </div>
//                                         <div className="w-6 h-px bg-gray-300"></div>
//                                         <div>
//                                             <label className="text-[9px] font-bold text-gray-600 uppercase ml-1 block">End Date</label>
//                                             <input type="date" value={season.endDate} onChange={e => updateSeason(sIndex, 'endDate', e.target.value)} className="p-2 font-bold text-gray-700 outline-none bg-transparent cursor-pointer"/>
//                                         </div>
//                                     </div>
//                                     <button onClick={() => deleteSeason(sIndex)} className="p-3 text-gray-400 hover:text-white hover:bg-red-500 rounded-xl transition-colors shadow-sm bg-white border border-gray-200" title="Delete Season"><Trash2 size={20} /></button>
//                                 </div>

//                                 <div className="p-6">
                                    
//                                     {/* 🌟 UPGRADED: The New Room Rate Table 🌟 */}
//                                     <div className="overflow-x-auto rounded-md border border-gray-200">
//                                         <div><span className='text-[14px] font-bold ml-3' >Rooms Per Person / Per Night</span></div>
//                                         <table className="w-full text-left text-sm border-collapse">
//                                             <thead className="bg-blue-50 text-blue-800 uppercase text-[10px] font-bold tracking-wider border-b border-blue-100">
                                                
//                                                 <tr>
//                                                     <th className="py-3 px-4 w-[25%]">Room Category</th>
//                                                     <th className="py-3 px-3 text-center border-l border-blue-100/50">SGL (1 Pax)</th>
//                                                     <th className="py-3 px-3 text-center border-l border-blue-100/50">DBL/TWIN (2 Pax)</th>
//                                                     <th className="py-3 px-3 text-center border-l border-blue-100/50">TPL (3 Pax)</th>
//                                                     <th className="py-3 px-3 text-center border-l border-blue-100/50">QUAD (4 Pax)</th>
//                                                     <th className="py-3 px-3 text-center border-l border-blue-100/50 w-[50px]">Del</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody className="divide-y divide-gray-100 bg-white">
//                                                 {season.rates.map((rate: any, rIndex: number) => (
//                                                     <tr key={rIndex} className="hover:bg-gray-50 transition-colors group/rate">
//                                                         <td className="py-3 px-4">
//                                                             <input type="text" value={rate.name} onChange={(e) => updateRateName(sIndex, rIndex, e.target.value)} className="w-full text-sm font-bold text-gray-800 bg-transparent outline-none border-b border-transparent focus:border-blue-400" placeholder="Room Name" />
//                                                         </td>
//                                                         <td className="py-2 px-2 border-l border-gray-100">
//                                                             <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 focus-within:border-blue-500 focus-within:bg-white rounded px-2 py-1.5"><span className="text-[10px] font-bold text-gray-400">$</span><input type="number" min="0" value={rate.singleRate || ''} onChange={(e) => updateRatePrice(sIndex, rIndex, 'singleRate', parseFloat(e.target.value) || 0)} className="w-full font-mono font-bold text-gray-900 outline-none text-right bg-transparent" placeholder="0"/></div>
//                                                         </td>
//                                                         <td className="py-2 px-2 border-l border-gray-100">
//                                                             <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 focus-within:border-blue-500 focus-within:bg-white rounded px-2 py-1.5"><span className="text-[10px] font-bold text-gray-400">$</span><input type="number" min="0" value={rate.doubleRate || ''} onChange={(e) => updateRatePrice(sIndex, rIndex, 'doubleRate', parseFloat(e.target.value) || 0)} className="w-full font-mono font-bold text-gray-900 outline-none text-right bg-transparent" placeholder="0"/></div>
//                                                         </td>
//                                                         <td className="py-2 px-2 border-l border-gray-100">
//                                                             <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 focus-within:border-blue-500 focus-within:bg-white rounded px-2 py-1.5"><span className="text-[10px] font-bold text-gray-400">$</span><input type="number" min="0" value={rate.tripleRate || ''} onChange={(e) => updateRatePrice(sIndex, rIndex, 'tripleRate', parseFloat(e.target.value) || 0)} className="w-full font-mono font-bold text-gray-900 outline-none text-right bg-transparent" placeholder="0"/></div>
//                                                         </td>
//                                                         <td className="py-2 px-2 border-l border-gray-100">
//                                                             <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 focus-within:border-blue-500 focus-within:bg-white rounded px-2 py-1.5"><span className="text-[10px] font-bold text-gray-400">$</span><input type="number" min="0" value={rate.quadRate || ''} onChange={(e) => updateRatePrice(sIndex, rIndex, 'quadRate', parseFloat(e.target.value) || 0)} className="w-full font-mono font-bold text-gray-900 outline-none text-right bg-transparent" placeholder="0"/></div>
//                                                         </td>
//                                                         <td className="py-2 px-3 text-center border-l border-gray-100">
//                                                             <button onClick={() => removeRoomRate(sIndex, rIndex)} className="text-gray-500 hover:text-red-500 group-hover/rate:opacity-100 transition-opacity p-1"><Trash2 size={16} /></button>
//                                                         </td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>
                                    
//                                     <button onClick={() => addRoomRate(sIndex)} className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
//                                         <Plus size={14} /> Add Room Category
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
                        
//                         <button 
//                             onClick={() => {
//                                 const updated = {...activeTariff};
//                                 const lastSeasonIndex = updated.seasons.length > 0 ? updated.seasons.length - 1 : 0;
//                                 let newRates = [];
                                
//                                 if (updated.seasons.length > 0) {
//                                     // 🌟 UPGRADED: Clones the 4 pricing tiers safely
//                                     newRates = updated.seasons[lastSeasonIndex].rates.map((r:any) => ({ 
//                                         name: r.name, 
//                                         singleRate: r.singleRate || 0,
//                                         doubleRate: r.doubleRate || 0,
//                                         tripleRate: r.tripleRate || 0,
//                                         quadRate: r.quadRate || 0
//                                     }));
//                                 } else {
//                                     newRates = [{ name: 'Standard Room', singleRate: 0, doubleRate: 0, tripleRate: 0, quadRate: 0 }]; 
//                                 }

//                                 updated.seasons.push({ seasonName: 'New Season', startDate: '', endDate: '', rates: newRates });
//                                 setActiveTariff(updated);
//                             }}
//                             className="w-full py-4 border-2 border-dashed border-blue-400 bg-blue-50/50 text-blue-700 font-extrabold text-sm tracking-wide rounded-2xl hover:bg-blue-100 hover:border-blue-500 transition-all flex items-center justify-center gap-2 shadow-sm"
//                         >
//                             <Plus size={20} strokeWidth={3} /> ADD NEW SEASON TIMEFRAME
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     </div>
//   );
// } 










































"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/app/context/UserContext';
import { 
    Landmark, Plus, Save, Loader2, AlertCircle, 
    Trash2, Building2, Globe, MapPin, ChevronDown, ChevronRight, Car
} from 'lucide-react';
import { getAllTariffs, saveTariff } from '@/utils/tariffAPI';

// --- CONSTANTS FOR TRANSPORT ---
export const VEHICLE_TYPES = [
  'Sedan Car', 'SUV / Crossover', 'Hatchback', 'Convertible', 'Coupe', 
  'Mini Van', 'Van', 'Pick-up Truck', 'Wagon', 'Mini Coach', 'Coach', 'Limousine'
];

export const VEHICLE_SPECS: Record<string, { seats: number, guests: number, luggageCheck: string, luggageCarry: string }> = {
  'Sedan Car': { seats: 5, guests: 3, luggageCheck: '2 (L75, W47, D30)', luggageCarry: '2 (L56, W45, D10)' },
  'SUV / Crossover': { seats: 5, guests: 4, luggageCheck: '3 (L75, W47, D30)', luggageCarry: '3 (L56, W45, D10)' },
  'Hatchback': { seats: 5, guests: 3, luggageCheck: '1 (L75, W47, D30)', luggageCarry: '2 (L56, W45, D10)' },
  'Convertible': { seats: 4, guests: 2, luggageCheck: '1 (L75, W47, D30)', luggageCarry: '1 (L56, W45, D10)' },
  'Coupe': { seats: 4, guests: 2, luggageCheck: '1 (L75, W47, D30)', luggageCarry: '1 (L56, W45, D10)' },
  'Mini Van': { seats: 7, guests: 6, luggageCheck: '4 (L75, W47, D30)', luggageCarry: '4 (L56, W45, D10)' },
  'Van': { seats: 12, guests: 10, luggageCheck: '10 (L75, W47, D30)', luggageCarry: '10 (L56, W45, D10)' },
  'Pick-up Truck': { seats: 5, guests: 4, luggageCheck: '5 (L75, W47, D30)', luggageCarry: '2 (L56, W45, D10)' },
  'Wagon': { seats: 5, guests: 4, luggageCheck: '3 (L75, W47, D30)', luggageCarry: '3 (L56, W45, D10)' },
  'Mini Coach': { seats: 25, guests: 20, luggageCheck: '20 (L75, W47, D30)', luggageCarry: '20 (L56, W45, D10)' },
  'Coach': { seats: 50, guests: 45, luggageCheck: '45 (L75, W47, D30)', luggageCarry: '45 (L56, W45, D10)' },
  'Limousine': { seats: 8, guests: 8, luggageCheck: '2 (L75, W47, D30)', luggageCarry: '2 (L56, W45, D10)' },
  'default': { seats: 4, guests: 3, luggageCheck: '2 Standard', luggageCarry: '2 Small' }
};

export default function RateManagerPage() {
  const { user, loading: userLoading } = useUser();
  
  // States
  const [activeModule, setActiveModule] = useState<'Stay' | 'Transport'>('Stay'); // Controls the top tabs
  const [srmItems, setSrmItems] = useState<any[]>([]);
  const [transportItems, setTransportItems] = useState<any[]>([]);
  const [tariffs, setTariffs] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [activeTariff, setActiveTariff] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

  // Security Check
  if (!userLoading && user?.role !== 'admin') {
      return (
          <div className="flex flex-col items-center justify-center h-full text-red-600 p-10 bg-gray-50">
              <AlertCircle size={48} className="mb-4" />
              <h2 className="text-2xl font-bold">Access Denied</h2>
              <p>Only Administrators can access the Rate & Tariff Manager.</p>
          </div>
      );
  }

  // --- DATA LOADING ---
  const loadData = async () => {
      setIsLoadingData(true);
      try {
          // 1. Load Hotels
          const stayRes = await fetch('/api/srm/stays'); 
          if (!stayRes.ok) throw new Error(`API Error`);
          const stayJson = await stayRes.json();
          
          // 2. Load Transports
        //   const transRes = await fetch('/api/srm/transports');
        //   let mappedTransports = [];
        //   if (transRes.ok) {
        //       const transJson = await transRes.json();
        //       // Safely map transport data so it works in the sidebar
        //       mappedTransports = (transJson.data || []).map((t: any) => ({
        //           ...t,
        //           name: `${t.vehicleType} - ${t.serviceType}`
        //       }));
        //   }


        // 1. Map names to a professional "Fleet" label
          const transRes = await fetch('/api/srm/transports');
          let mappedTransports = [];
          if (transRes.ok) {
              const transJson = await transRes.json();
              mappedTransports = (transJson.data || []).map((t: any) => ({
                  ...t,
                  // Change from `${t.vehicleType} - ${t.serviceType}` to a proper Fleet name
                  name: `Transport Fleet` 
              }));
          }

          // 3. Load Existing Tariffs
          const tariffData = await getAllTariffs();

          setSrmItems(stayJson.data || []);
          setTransportItems(mappedTransports);
          setTariffs(tariffData || []);
      } catch (error) {
          console.error("Error loading Rate Manager data:", error);
      } finally {
          setIsLoadingData(false);
      }
  };

  useEffect(() => {
      if (user?.role === 'admin') loadData();
  }, [user]);

  // --- DYNAMIC SIDEBAR GROUPING ---
  const groupedData = useMemo(() => {
    const groups: Record<string, Record<string, any[]>> = {};
    // Switch data source based on Top Tab
    const dataToGroup = activeModule === 'Stay' ? srmItems : transportItems; 
    
    dataToGroup.forEach(item => {
      const country = (item.country || "Uncategorized").trim();
      const city = (item.city || "Unknown City").trim();
      if (!groups[country]) groups[country] = {};
      if (!groups[country][city]) groups[country][city] = [];
      groups[country][city].push(item);
    });
    return Object.keys(groups).sort().reduce((acc, country) => {
        acc[country] = groups[country];
        return acc;
    }, {} as Record<string, Record<string, any[]>>);
  }, [srmItems, transportItems, activeModule]);

  // Auto-expand first country/city
  useEffect(() => {
      if (Object.keys(groupedData).length > 0) {
          const firstCountry = Object.keys(groupedData)[0]; 
          setExpandedCountries({ [firstCountry]: true });
          const firstCity = Object.keys(groupedData[firstCountry])[0]; 
          setExpandedCities({ [`${firstCountry}-${firstCity}`]: true });
      }
  }, [groupedData, activeModule]); // Added activeModule to reset expansion on tab switch

  // --- ACTIONS ---
  const handleServiceSelect = (serviceId: string) => {
      setSelectedServiceId(serviceId);
      const dataList = activeModule === 'Stay' ? srmItems : transportItems;
      const serviceData = dataList.find(item => item._id === serviceId);
      
      if (!serviceData) {
          setActiveTariff(null);
          return;
      }

      const existingTariff = tariffs.find(t => t.serviceId === serviceId);

      if (existingTariff) {
          setActiveTariff(existingTariff);
      } else {
          // Generate appropriate template based on the active tab
          if (activeModule === 'Stay') {
              const defaultRates = (serviceData.roomCategories || []).map((room: any) => ({
                  name: room.name,
                  singleRate: 0, doubleRate: 0, tripleRate: 0, quadRate: 0
              }));
              setActiveTariff({
                  serviceId: serviceId,
                  serviceName: serviceData.name,
                  serviceType: 'Stay',
                  seasons: [{ seasonName: 'Default Season', startDate: '', endDate: '', rates: defaultRates.length > 0 ? defaultRates : [{ name: 'Standard Room', singleRate: 0, doubleRate: 0, tripleRate: 0, quadRate: 0 }] }]
              });
        //   } else {
        //       // Transport template
        //       const defaultVehicles = [{name: 'vt', vehicleType: 'Transportation service', transferRate: 0, disposalRate: 0 }];
        //       setActiveTariff({
        //           serviceId: serviceId,
        //           serviceName: 'Transportation service', 
        //           serviceType: 'Transport',
        //           seasons: [{ seasonName: 'Default Season', startDate: '', endDate: '', rates: defaultVehicles }]
        //       });
        //   }

 } else {
              // 🚐 Transport Template: Generates all cars properly with 0 default prices
              const defaultVehicles = VEHICLE_TYPES.map(vt => ({
                  name: vt, // Satisfies database requirements
                  vehicleType: vt, 
                  transferRate: 0, 
                  disposalRate: 0 
              }));

              const cityName = serviceData.city || 'Local';

              setActiveTariff({
                  serviceId: serviceId,
                  // MUST include the city name here so Costing Page knows which city this contract belongs to
                  serviceName: `${cityName} Transport`, 
                  serviceType: 'Transport',
                  seasons: [{ seasonName: 'Default Season', startDate: '', endDate: '', rates: defaultVehicles }]
              });
          }
      }
  };

  const updateSeason = (seasonIndex: number, field: string, value: any) => {
      const updated = { ...activeTariff };
      updated.seasons[seasonIndex][field] = value;
      setActiveTariff(updated);
  };

  const deleteSeason = (seasonIndex: number) => {
      if (!confirm("Are you sure you want to delete this entire season?")) return;
      const updated = { ...activeTariff };
      updated.seasons.splice(seasonIndex, 1);
      setActiveTariff(updated);
  };

  const addRateRow = (seasonIndex: number) => {
      const updated = { ...activeTariff };
      if (updated.serviceType === 'Stay') {
          updated.seasons[seasonIndex].rates.push({ name: 'New Room', singleRate: 0, doubleRate: 0, tripleRate: 0, quadRate: 0 });
      } else {
          updated.seasons[seasonIndex].rates.push({ vehicleType: 'SUV / Crossover', transferRate: 0, disposalRate: 0 });
      }
      setActiveTariff(updated);
  };

  const removeRateRow = (seasonIndex: number, rateIndex: number) => {
      const updated = { ...activeTariff };
      updated.seasons[seasonIndex].rates.splice(rateIndex, 1);
      setActiveTariff(updated);
  };

  const updateRateData = (seasonIndex: number, rateIndex: number, field: string, value: any) => {
      const updated = { ...activeTariff };
      updated.seasons[seasonIndex].rates[rateIndex][field] = value;
      setActiveTariff(updated);
  };

  const handleSave = async () => {
      setIsSaving(true);
      const success = await saveTariff(activeTariff);
      if (success) {
          alert("Contract Saved Successfully!");
          await loadData();
      } else {
          alert("Failed to save contract.");
      }
      setIsSaving(false);
  };

  if (userLoading || isLoadingData) return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-blue-600">
          <Loader2 size={48} className="animate-spin mb-4" />
          <p className="font-bold uppercase tracking-widest text-sm">Accessing Secure Vault...</p>
      </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-100 overflow-hidden">
        
        {/* --- TOP HEADER WITH CENTERED TABS --- */}
        <div className="bg-[#0a1f44] text-white px-8 py-3 shadow-md shrink-0 z-20 flex justify-between items-center relative">
            {/* Left: Title */}
            <div className="flex-1">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <Landmark className="text-yellow-400" size={24} /> Contract & Rate Manager
                </h1>
            </div>

            {/* Center: Module Tabs */}
            <div className="flex bg-white/10 p-1 rounded-xl absolute left-1/2 -translate-x-1/2">
                <button 
                    onClick={() => { setActiveModule('Stay'); setActiveTariff(null); setSelectedServiceId(''); }}
                    className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                        activeModule === 'Stay' ? 'bg-white text-blue-900 shadow-md' : 'text-gray-300 hover:text-white'
                    }`}
                >
                    <Building2 size={16}/> Hotels & Stays
                </button>
                <button 
                    onClick={() => { setActiveModule('Transport'); setActiveTariff(null); setSelectedServiceId(''); }}
                    className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                        activeModule === 'Transport' ? 'bg-white text-blue-900 shadow-md' : 'text-gray-300 hover:text-white'
                    }`}
                >
                    <Car size={16}/> Transport
                </button>
            </div>

            {/* Right: Save Button */}
            <div className="flex-1 flex justify-end">
                {activeTariff && (
                    <button onClick={handleSave} disabled={isSaving} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                        {isSaving ? <Loader2 size={20} className="animate-spin"/> : <Save size={20}/>}
                        Save Contract
                    </button>
                )}
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative z-10">
            {/* LEFT SIDEBAR (Dynamic List) */}
            <div className="w-[300px] bg-gray-200 border-r border-gray-200 overflow-y-auto shadow-sm shrink-0">
                <div className="p-5 border-b border-gray-100 bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                    <h3 className="font-extrabold text-gray-900 uppercase tracking-wider text-xs">
                        {activeModule === 'Stay' ? 'Hotel Directory' : 'Transport Directory'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Select a property to manage rates</p>
                </div>
                
                <div className="p-3 space-y-2">
                    {Object.keys(groupedData).length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl m-2">
                            No {activeModule.toLowerCase()}s found in SRM.
                        </div>
                    ) : (
                        Object.entries(groupedData).map(([country, cities]) => (
                            <div key={country} className="select-none">
                                <div onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))} className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors border border-slate-200 mb-1">
                                    <div className="text-slate-500">{expandedCountries[country] ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}</div>
                                    <Globe size={16} className="text-blue-600" />
                                    <span className="font-bold text-slate-800 text-sm">{country}</span>
                                </div>
                                {expandedCountries[country] && (
                                    <div className="ml-5 pl-3 border-l-2 border-slate-100 space-y-1 mt-1 mb-3">
                                        {Object.entries(cities).map(([city, items]) => {
                                            const cityKey = `${country}-${city}`;
                                            return (
                                                <div key={city}>
                                                    <div onClick={() => setExpandedCities(prev => ({...prev, [cityKey]: !prev[cityKey]}))} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                                                        <div className="text-slate-400">{expandedCities[cityKey] ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}</div>
                                                        <MapPin size={14} className={activeModule === 'Stay' ? 'text-red-500' : 'text-orange-500'} />
                                                        <span className="font-bold text-slate-700 text-sm">{city}</span>
                                                        <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{items.length}</span>
                                                    </div>
                                                    {expandedCities[cityKey] && (
                                                        <div className="ml-6 mt-1 space-y-1 mb-2">
                                                            {items.map(item => {
                                                                const hasTariff = tariffs.some(t => t.serviceId === item._id);
                                                                const isActive = selectedServiceId === item._id;
                                                                return (
                                                                    <button key={item._id} onClick={() => handleServiceSelect(item._id)} className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${isActive ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-blue-50 text-slate-600'}`}>
                                                                        <span className={`text-xs font-semibold truncate pr-2 ${isActive ? 'text-white' : 'text-slate-700'}`}>{item.name}</span>
                                                                        <span className="shrink-0" title={hasTariff ? 'Contract Active' : 'Rates Missing'}>{hasTariff ? '✅' : '⚠️'}</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT SIDE: Pricing Matrix Workspace */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                {!activeTariff ? (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto opacity-70">
                        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                            {activeModule === 'Stay' ? <Building2 size={40} className="text-blue-300" /> : <Car size={40} className="text-blue-300" />}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Workspace Ready</h3>
                        <p className="text-gray-500 leading-relaxed">Select a {activeModule.toLowerCase()} from the left directory to define seasonal contracts and net pricing matrices.</p>
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                        {/* <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-extrabold text-gray-800">{activeTariff.serviceName}</h2>
                            <span className="px-3 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold uppercase rounded-full border border-indigo-200 shadow-sm">
                                {activeTariff.serviceType === 'Stay' ? 'Hotel Contract' : 'Transport Contract'}
                            </span>
                        </div> */}


{/* 👇 VISUAL UI HEADER: Keeps the display clean as requested! */}
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-extrabold text-gray-800">
                                {activeTariff.serviceType === 'Stay' ? activeTariff.serviceName : 'Transportation Services'}
                            </h2>
                            <span className="px-3 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold uppercase rounded-full border border-indigo-200 shadow-sm">
                                {activeTariff.serviceType === 'Stay' ? 'Hotel Contract' : 'Transport Contract'}
                            </span>
                        </div>
                        {activeTariff.seasons.map((season: any, sIndex: number) => (
                            <div key={sIndex} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden group">
                                
                                {/* Season Header */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200 flex flex-wrap gap-6 items-center">
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1 block">Season Name</label>
                                        <input type="text" value={season.seasonName} onChange={e => updateSeason(sIndex, 'seasonName', e.target.value)} className="w-full p-2.5 bg-white border border-gray-300 rounded-lg font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Summer Peak 2026"/>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
                                        <div>
                                            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1 block">Start Date</label>
                                            <input type="date" value={season.startDate} onChange={e => updateSeason(sIndex, 'startDate', e.target.value)} className="p-2 font-bold text-gray-700 outline-none bg-transparent cursor-pointer"/>
                                        </div>
                                        <div className="w-6 h-px bg-gray-300"></div>
                                        <div>
                                            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1 block">End Date</label>
                                            <input type="date" value={season.endDate} onChange={e => updateSeason(sIndex, 'endDate', e.target.value)} className="p-2 font-bold text-gray-700 outline-none bg-transparent cursor-pointer"/>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteSeason(sIndex)} className="p-3.5 text-gray-400 hover:text-white hover:bg-red-500 rounded-xl transition-colors shadow-sm bg-white border border-gray-200" title="Delete Season"><Trash2 size={20} /></button>
                                </div>

                                <div className="p-6">
                                    
                                    {/* 🏨 TABLE RENDERER: HOTELS */}
                                    {activeTariff.serviceType === 'Stay' ? (
                                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                                            <table className="w-full text-left text-sm border-collapse">
                                                <thead className="bg-blue-50 text-blue-800 uppercase text-[10px] font-bold tracking-wider border-b border-blue-100">
                                                    <tr>
                                                        <th className="py-3 px-4 w-[25%] align-bottom">Room Category</th>
                                                        <th className="py-3 px-3 text-center border-l border-blue-100/50">
                                                            SGL (1 Pax)
                                                            <div className="text-[8px] text-blue-500 font-medium normal-case mt-0.5">Per Room / Night</div>
                                                        </th>
                                                        <th className="py-3 px-3 text-center border-l border-blue-100/50">
                                                            DBL/TWIN (2 Pax)
                                                            <div className="text-[8px] text-blue-500 font-medium normal-case mt-0.5">Per Room / Night</div>
                                                        </th>
                                                        <th className="py-3 px-3 text-center border-l border-blue-100/50">
                                                            TPL (3 Pax)
                                                            <div className="text-[8px] text-blue-500 font-medium normal-case mt-0.5">Per Room / Night</div>
                                                        </th>
                                                        <th className="py-3 px-3 text-center border-l border-blue-100/50">
                                                            QUAD (4 Pax)
                                                            <div className="text-[8px] text-blue-500 font-medium normal-case mt-0.5">Per Room / Night</div>
                                                        </th>
                                                        <th className="py-3 px-3 text-center border-l border-blue-100/50 w-[50px] align-bottom">Del</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 bg-white">
                                                    {season.rates.map((rate: any, rIndex: number) => (
                                                        <tr key={rIndex} className="hover:bg-gray-50 transition-colors group/rate">
                                                            <td className="py-3 px-4">
                                                                <input type="text" value={rate.name} onChange={(e) => updateRateData(sIndex, rIndex, 'name', e.target.value)} className="w-full text-sm font-bold text-gray-800 bg-transparent outline-none border-b border-transparent focus:border-blue-400" placeholder="e.g. Deluxe Ocean View" />
                                                            </td>
                                                            <td className="py-2 px-2 border-l border-gray-100">
                                                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 focus-within:border-blue-500 focus-within:bg-white rounded px-2 py-1.5"><span className="text-[10px] font-bold text-gray-400">$</span><input type="number" min="0" value={rate.singleRate || ''} onChange={(e) => updateRateData(sIndex, rIndex, 'singleRate', parseFloat(e.target.value) || 0)} className="w-full font-mono font-bold text-gray-900 outline-none text-right bg-transparent" placeholder="0"/></div>
                                                            </td>
                                                            <td className="py-2 px-2 border-l border-gray-100">
                                                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 focus-within:border-blue-500 focus-within:bg-white rounded px-2 py-1.5"><span className="text-[10px] font-bold text-gray-400">$</span><input type="number" min="0" value={rate.doubleRate || ''} onChange={(e) => updateRateData(sIndex, rIndex, 'doubleRate', parseFloat(e.target.value) || 0)} className="w-full font-mono font-bold text-gray-900 outline-none text-right bg-transparent" placeholder="0"/></div>
                                                            </td>
                                                            <td className="py-2 px-2 border-l border-gray-100">
                                                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 focus-within:border-blue-500 focus-within:bg-white rounded px-2 py-1.5"><span className="text-[10px] font-bold text-gray-400">$</span><input type="number" min="0" value={rate.tripleRate || ''} onChange={(e) => updateRateData(sIndex, rIndex, 'tripleRate', parseFloat(e.target.value) || 0)} className="w-full font-mono font-bold text-gray-900 outline-none text-right bg-transparent" placeholder="0"/></div>
                                                            </td>
                                                            <td className="py-2 px-2 border-l border-gray-100">
                                                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 focus-within:border-blue-500 focus-within:bg-white rounded px-2 py-1.5"><span className="text-[10px] font-bold text-gray-400">$</span><input type="number" min="0" value={rate.quadRate || ''} onChange={(e) => updateRateData(sIndex, rIndex, 'quadRate', parseFloat(e.target.value) || 0)} className="w-full font-mono font-bold text-gray-900 outline-none text-right bg-transparent" placeholder="0"/></div>
                                                            </td>
                                                            <td className="py-2 px-3 text-center border-l border-gray-100">
                                                                <button onClick={() => removeRateRow(sIndex, rIndex)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover/rate:opacity-100 transition-opacity p-1"><Trash2 size={16} /></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        /* 🚐 TABLE RENDERER: TRANSPORT */
                                        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                                            <table className="w-full text-left text-sm border-collapse">
                                                <thead className="bg-indigo-50 text-indigo-900 uppercase text-[10px] font-bold tracking-wider border-b border-indigo-100">
                                                    <tr>
                                                        <th className="py-3 px-5 w-[40%]">Vehicle Category & Specs</th>
                                                        <th className="py-3 px-4 text-center border-l border-indigo-100/50">
                                                            Transfer Rate
                                                            <div className="text-[8px] text-indigo-500 font-medium normal-case mt-0.5">Point-to-Point Drop</div>
                                                        </th>
                                                        <th className="py-3 px-4 text-center border-l border-indigo-100/50">
                                                            Disposal Rate
                                                            <div className="text-[8px] text-indigo-500 font-medium normal-case mt-0.5">Full Day / 8 Hours</div>
                                                        </th>
                                                        <th className="py-3 px-3 text-center border-l border-indigo-100/50 w-[50px]">Del</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 bg-white">
                                                    {season.rates.map((rate: any, rIndex: number) => {
                                                        const specs = VEHICLE_SPECS[rate.vehicleType] || VEHICLE_SPECS['default'];
                                                        return (
                                                            <tr key={rIndex} className="hover:bg-indigo-50/30 transition-colors group/rate">
                                                                <td className="py-4 px-5">
                                                                    <select 
                                                                        value={rate.vehicleType} 
                                                                        onChange={(e) => updateRateData(sIndex, rIndex, 'vehicleType', e.target.value)} 
                                                                        className="w-full text-sm font-bold text-gray-900 bg-transparent outline-none border-b border-transparent focus:border-indigo-400 mb-1.5 cursor-pointer pb-1"
                                                                    >
                                                                        {VEHICLE_TYPES.map(vt => <option key={vt} value={vt}>{vt}</option>)}
                                                                    </select>
                                                                    <div className="flex flex-wrap gap-2 text-[10px] text-gray-600 mt-1 font-medium">
                                                                        <span className="bg-gray-100 px-2 py-1 rounded-md border border-gray-200">👤 Max {specs.guests} Pax</span>
                                                                        <span className="bg-gray-100 px-2 py-1 rounded-md border border-gray-200">🧳 {specs.luggageCheck}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-4 border-l border-gray-100 align-middle">
                                                                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 focus-within:border-indigo-500 focus-within:bg-white rounded-lg px-3 py-2 max-w-[160px] mx-auto shadow-inner">
                                                                        <span className="text-xs font-bold text-gray-400">$</span>
                                                                        <input type="number" min="0" value={rate.transferRate || ''} onChange={(e) => updateRateData(sIndex, rIndex, 'transferRate', parseFloat(e.target.value) || 0)} className="w-full font-mono font-bold text-gray-900 outline-none text-right bg-transparent text-base" placeholder="0"/>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-4 border-l border-gray-100 align-middle">
                                                                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 focus-within:border-indigo-500 focus-within:bg-white rounded-lg px-3 py-2 max-w-[160px] mx-auto shadow-inner">
                                                                        <span className="text-xs font-bold text-gray-400">$</span>
                                                                        <input type="number" min="0" value={rate.disposalRate || ''} onChange={(e) => updateRateData(sIndex, rIndex, 'disposalRate', parseFloat(e.target.value) || 0)} className="w-full font-mono font-bold text-gray-900 outline-none text-right bg-transparent text-base" placeholder="0"/>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-3 text-center border-l border-gray-100 align-middle">
                                                                    <button onClick={() => removeRateRow(sIndex, rIndex)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover/rate:opacity-100 transition-opacity p-2 rounded-full hover:bg-red-50"><Trash2 size={18} /></button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    
                                    <button onClick={() => addRateRow(sIndex)} className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-blue-50">
                                        <Plus size={14} /> Add {activeTariff.serviceType === 'Stay' ? 'Room Category' : 'Vehicle Type'}
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        <button 
                            onClick={() => {
                                const updated = {...activeTariff};
                                const lastSeasonIndex = updated.seasons.length > 0 ? updated.seasons.length - 1 : 0;
                                let newRates = [];
                                
                                if (updated.seasons.length > 0) {
                                    if (updated.serviceType === 'Stay') {
                                        newRates = updated.seasons[lastSeasonIndex].rates.map((r:any) => ({ 
                                            name: r.name, singleRate: r.singleRate || 0, doubleRate: r.doubleRate || 0, tripleRate: r.tripleRate || 0, quadRate: r.quadRate || 0
                                        }));
                                    } else {
                                        newRates = updated.seasons[lastSeasonIndex].rates.map((r:any) => ({ 
                                            vehicleType: r.vehicleType || 'Sedan Car', transferRate: r.transferRate || 0, disposalRate: r.disposalRate || 0
                                        }));
                                    }
                                } else {
                                    newRates = updated.serviceType === 'Stay' 
                                        ? [{ name: 'Standard Room', singleRate: 0, doubleRate: 0, tripleRate: 0, quadRate: 0 }]
                                        : [{ vehicleType: 'Sedan Car', transferRate: 0, disposalRate: 0 }];
                                }

                                updated.seasons.push({ seasonName: 'New Season', startDate: '', endDate: '', rates: newRates });
                                setActiveTariff(updated);
                            }}
                            className="w-full py-5 border-2 border-dashed border-blue-300 bg-blue-50/50 text-blue-700 font-extrabold text-sm tracking-wide rounded-2xl hover:bg-blue-100 hover:border-blue-400 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Plus size={20} strokeWidth={3} /> ADD NEW SEASON TIMEFRAME
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}