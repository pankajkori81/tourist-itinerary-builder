// "use client";

// import { useState } from 'react';
// import { 
//   ShieldAlert, Radar, Search, AlertTriangle, 
//   MapPin, Activity, Users, ChevronRight 
// } from 'lucide-react';

// export default function CrisisHubPage() {
//   const [location, setLocation] = useState('');
//   const [isScanning, setIsScanning] = useState(false);
//   const [travelers, setTravelers] = useState<any[]>([]);
//   const [hasScanned, setHasScanned] = useState(false);

//   // Calls the Radar API we built
//   const handleScan = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!location.trim()) return;
    
//     setIsScanning(true);
//     setHasScanned(false);
    
//     try {
//       const res = await fetch(`/api/crisis/scan?location=${encodeURIComponent(location)}`);
//       const data = await res.json();
      
//       if (data.success) {
//         setTravelers(data.data);
//       } else {
//         alert("Scan failed: " + data.message);
//       }
//     } catch (error) {
//       console.error("Scan error:", error);
//     } finally {
//       setIsScanning(false);
//       setHasScanned(true);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-10 font-sans selection:bg-red-500/30">
      
//       {/* --- HEADER --- */}
//       <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-6">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
//             <ShieldAlert size={28} />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
//               Crisis Command Center
//               <span className="flex h-2.5 w-2.5 relative">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
//               </span>
//             </h1>
//             <p className="text-slate-400 text-sm mt-1">Live Threat Tracking & Duty of Care Operations</p>
//           </div>
//         </div>
//         <div className="text-right">
//           <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">System Status</div>
//           <div className="text-sm font-medium text-emerald-400 flex items-center justify-end gap-2">
//             <Activity size={14} /> Operational
//           </div>
//         </div>
//       </div>

//       {/* --- THE THREAT SCANNER --- */}
//       <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 relative overflow-hidden shadow-2xl">
//         {/* Subtle background glow */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[100px] bg-red-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        
//         <div className="bg-slate-950 rounded-xl p-8 relative z-10">
//           <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//             <Radar size={20} className="text-slate-400" /> Initialize Threat Radar
//           </h2>
          
//           <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative group">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <MapPin size={20} className="text-slate-500 group-focus-within:text-red-400 transition-colors" />
//               </div>
//               <input 
//                 type="text" 
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 placeholder="Enter country, city, or region (e.g., 'Rome', 'Israel')" 
//                 className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-slate-600 text-lg"
//                 disabled={isScanning}
//               />
//             </div>
            
//             <button 
//               type="submit" 
//               disabled={isScanning || !location.trim()}
//               className={`px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
//                 isScanning || !location.trim()
//                   ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
//                   : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] active:scale-[0.98]'
//               }`}
//             >
//               {isScanning ? (
//                 <>
//                   <Radar className="animate-spin" size={20} /> Scanning Grid...
//                 </>
//               ) : (
//                 <>
//                   <Search size={20} /> Run Scan
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* --- RESULTS PLACEHOLDER (Part 2 will go here) --- */}
//       <div className="mt-8">
//         {isScanning && (
//           <div className="flex flex-col items-center justify-center py-20 opacity-70">
//             <div className="relative flex items-center justify-center w-24 h-24 mb-4">
//                <div className="absolute w-full h-full border-2 border-red-500/20 rounded-full animate-ping"></div>
//                <div className="absolute w-3/4 h-3/4 border-2 border-red-500/40 rounded-full animate-ping" style={{ animationDelay: '0.2s'}}></div>
//                <Radar size={40} className="text-red-500 animate-pulse" />
//             </div>
//             <p className="text-slate-400 font-medium animate-pulse">Cross-referencing global itineraries...</p>
//           </div>
//         )}

//         {!isScanning && hasScanned && travelers.length === 0 && (
//           <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-10 text-center">
//             <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
//               <ShieldAlert size={32} />
//             </div>
//             <h3 className="text-xl font-bold text-emerald-400 mb-2">Zone Clear</h3>
//             <p className="text-slate-400">No active Travdek clients found in {location} for today's date.</p>
//           </div>
//         )}

//         {!isScanning && hasScanned && travelers.length > 0 && (
//           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//             {/* We will inject the ImpactManifestTable here in Step 2 */}
//             <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl flex justify-between items-center text-red-400 font-bold">
//                <span>⚠️ {travelers.length} Travelers identified in Danger Zone.</span>
//                <span>(Ready for Step 2: The Manifest Table)</span>
//             </div>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// } 

























// "use client";

// import { useState } from 'react';
// import { 
//   ShieldAlert, Radar, Search, Activity, MapPin, CheckCircle2 
// } from 'lucide-react';

// import dynamic from 'next/dynamic'; // <--- 1. Add this import here

// // We will import Part 2 here!
// import ImpactManifestTable from './ImpactManifestTable'

// // --- 2. ADD THE DYNAMIC MAP IMPORT HERE ---
// // Next.js specific way to import the map without crashing the server
// const GlobalRadarMap = dynamic(() => import('./GlobalRadarMap'), { 
//   ssr: false, 
//   loading: () => <div className="h-[450px] w-full bg-slate-900/50 backdrop-blur-md rounded-2xl animate-pulse flex items-center justify-center border border-white/10 text-slate-400">Loading Radar Grid...</div>
// });

// // // We will import Part 2 here!
// // import ImpactManifestTable from './ImpactManifestTable'

// export default function RiskManagementPage() {
//   const [location, setLocation] = useState('');
//   const [isScanning, setIsScanning] = useState(false);
//   const [travelers, setTravelers] = useState<any[]>([]);
//   const [hasScanned, setHasScanned] = useState(false);

//   // Calls the Radar API we built
//   const handleScan = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!location.trim()) return;
    
//     setIsScanning(true);
//     setHasScanned(false);
    
//     try {
//       const res = await fetch(`/api/crisis/scan?location=${encodeURIComponent(location)}`);
//       const data = await res.json();
      
//       if (data.success) {
//         setTravelers(data.data);
//       } else {
//         alert("Scan failed: " + data.message);
//       }
//     } catch (error) {
//       console.error("Scan error:", error);
//     } finally {
//       setIsScanning(false);
//       setHasScanned(true);
//     }
//   };

//   return (
//     // <div className="min-h-screen bg-gray-200 text-slate-200 p-6  font-sans selection:bg-red-500/30">
//       // <div className="flex flex-col min-h-screen bg-slate-50  font-sans">
//         <div className="flex flex-col h-screen font-sans w-full">

//       {/* --- HEADER --- */}
//       <div className="bg-gray-100 border border-slate-200 p-3 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between mb-0 gap-4">
//         <div className="flex items-center gap-5">
//           <div className="w-14 h-14 rounded-xl bg-red-200 border border-red-100 flex items-center justify-center text-red-700 shadow-sm">
//             <ShieldAlert size={28} />
//           </div>
//           <div>
//             <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
//               Crisis Management Center
//               <span className="flex h-3 w-3 relative">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
//               </span>
//             </h1>
//             <p className="text-slate-700 text-sm mt-1 font-medium">Duty of Care & Global Threat Tracking</p>
//           </div>
//         </div>
        
//         <div className="text-right bg-slate-50 border border-slate-100 px-5 py-3 rounded-xl min-w-[160px]">
//           <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-1">System Status</div>
//           <div className="text-sm font-bold text-emerald-700 flex items-center justify-end md:justify-center gap-1.5">
//             <Activity size={16} /> Operational
//           </div>
//         </div>
//       </div>


// <div 
//         className="flex-1 overflow-y-auto p-6 md:p-10 bg-cover bg-center bg-no-repeat bg-fixed relative selection:bg-red-500/30 text-slate-200"  
//         style={{ 
//           // This adds a dark blue/slate overlay over a global network satellite image
//           backgroundImage: `linear-gradient(to bottom, rgba(151, 175, 235, 0.58), rgba(0, 0, 0, 0.95)), url('https://images.unsplash.com/photo-1747233368217-7d6bbdd3f553?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` 
//         }}
//       >
//       {/* --- THE THREAT SCANNER --- */}
//       <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 relative overflow-hidden shadow-2xl">
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[100px] bg-red-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        
//         <div className="bg-slate-950 rounded-xl p-8 relative z-10">
//           <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//             <Radar size={20} className="text-slate-400" /> Initialize Threat Radar
//           </h2>
          
//           <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative group">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <MapPin size={20} className="text-slate-500 group-focus-within:text-red-400 transition-colors" />
//               </div>
//               <input 
//                 type="text" 
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 placeholder="Enter country, city, or region (e.g., 'Rome', 'Israel')" 
//                 className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-slate-600 text-lg"
//                 disabled={isScanning}
//               />
//             </div>
            
//             <button 
//               type="submit" 
//               disabled={isScanning || !location.trim()}
//               className={`px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
//                 isScanning || !location.trim()
//                   ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
//                   : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] active:scale-[0.98]'
//               }`}
//             >
//               {isScanning ? (
//                 <><Radar className="animate-spin" size={20} /> Scanning Grid...</>
//               ) : (
//                 <><Search size={20} /> Run Scan</>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* --- RESULTS AREA --- */}
//       <div className="mt-8">
//         {isScanning && (
//           <div className="flex flex-col items-center justify-center py-20 opacity-70">
//             <div className="relative flex items-center justify-center w-24 h-24 mb-4">
//                <div className="absolute w-full h-full border-2 border-red-500/20 rounded-full animate-ping"></div>
//                <div className="absolute w-3/4 h-3/4 border-2 border-red-500/40 rounded-full animate-ping" style={{ animationDelay: '0.2s'}}></div>
//                <Radar size={40} className="text-red-500 animate-pulse" />
//             </div>
//             <p className="text-slate-400 font-medium animate-pulse">Cross-referencing global itineraries...</p>
//           </div>
//         )}

//         {!isScanning && hasScanned && travelers.length === 0 && (
//           <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-10 text-center animate-in fade-in slide-in-from-bottom-4">
//             <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
//               <CheckCircle2 size={32} />
//             </div>
//             <h3 className="text-xl font-bold text-emerald-400 mb-2">Zone Clear</h3>
//             <p className="text-emerald-500/70">No active Travdek clients found in {location} for today's date.</p>
//           </div>
//         )}

//         {/* 👇 INJECTING PART 2 AS A COMPONENT 👇 */}
//         {/* {!isScanning && hasScanned && travelers.length > 0 && (
//           <ImpactManifestTable travelers={travelers} />
//         )} */}

//         {!isScanning && hasScanned && travelers.length > 0 && (
//               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//                 {/* 1. The Interactive Map */}
//                 <GlobalRadarMap travelers={travelers} />
                
//                 {/* 2. The Data Table */}
//                 <ImpactManifestTable travelers={travelers} />
//               </div>
//             )}~
//       </div>
//        </div>

//     </div>
//   );
// } 














































// "use client";

// import { useState, useEffect, useMemo } from 'react';
// import { 
//   ShieldAlert, Search, Activity, CheckCircle2, 
//   Navigation, Calendar, CheckSquare, Loader2
// } from 'lucide-react';

// // 🗑️ REMOVED: GlobalRadarMap has been completely deleted.

// // We import the Table Component
// import ImpactManifestTable from './ImpactManifestTable';

// export default function RiskManagementPage() {
//   // 🌟 NEW STATE: Store all data, loading status, and smart filters
//   const [allTravelers, setAllTravelers] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeTab, setActiveTab] = useState<'ongoing' | 'upcoming' | 'completed'>('ongoing');

//   // 🌟 NEW: Fetch ALL trips automatically when the page loads
//   useEffect(() => {
//     const fetchManifest = async () => {
//       setIsLoading(true);
//       try {
//         const res = await fetch(`/api/crisis/scan`);
//         const data = await res.json();
        
//         if (data.success) {
//           setAllTravelers(data.data);
//         } else {
//           alert("Failed to load manifest: " + data.message);
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchManifest();
//   }, []); // Empty array means it only runs once on page load!

//   // 🌟 NEW: Instant Smart Search Logic (Runs on the frontend)
//   const filteredTravelers = useMemo(() => {
//     return allTravelers.filter(t => {
//       // 1. First, check if the trip matches the selected tab (Ongoing/Upcoming/Completed)
//       if (t.timelineCategory !== activeTab) return false;

//       // 2. Then, check if it matches the Search Bar (Country, City, or Guest Name)
//       if (searchTerm) {
//         const term = searchTerm.toLowerCase();
        
//         const matchesCountry = t.allCountries?.some((c: string) => c.toLowerCase().includes(term));
//         const matchesCity = t.allCities?.some((c: string) => c.toLowerCase().includes(term));
//         const matchesName = t.leadGuestName?.toLowerCase().includes(term);

//         if (!matchesCountry && !matchesCity && !matchesName) {
//           return false;
//         }
//       }

//       return true; // Keep the traveler if they pass both filters
//     });
//   }, [allTravelers, activeTab, searchTerm]);

//   return (
//     <div className="flex flex-col h-screen font-sans w-full">

//       {/* --- HEADER --- */}
//       <div className="bg-gray-100 border border-slate-200 p-3 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between mb-0 gap-4 z-20">
//         <div className="flex items-center gap-5">
//           <div className="w-14 h-14 rounded-xl bg-red-200 border border-red-100 flex items-center justify-center text-red-700 shadow-sm">
//             <ShieldAlert size={28} />
//           </div>
//           <div>
//             <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
//               Crisis Management Center
//               <span className="flex h-3 w-3 relative">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
//               </span>
//             </h1>
//             <p className="text-slate-700 text-sm mt-1 font-medium">Duty of Care & Global Threat Tracking</p>
//           </div>
//         </div>
        
//         <div className="text-right bg-slate-50 border border-slate-100 px-5 py-3 rounded-xl min-w-[160px]">
//           <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-1">System Status</div>
//           <div className="text-sm font-bold text-emerald-700 flex items-center justify-end md:justify-center gap-1.5">
//             <Activity size={16} /> Operational
//           </div>
//         </div>
//       </div>

//       {/* --- MAIN CONTENT AREA --- */}
//       <div 
//         className="flex-1 overflow-y-auto p-6 md:p-10 bg-cover bg-center bg-no-repeat bg-fixed relative selection:bg-blue-500/30 text-slate-200"  
//         style={{ 
//           // Adjusted overlay slightly to look more like a control dashboard
//           backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(0, 0, 0, 0.95)), url('https://images.unsplash.com/photo-1747233368217-7d6bbdd3f553?q=80&w=1170&auto=format&fit=crop')` 
//         }}
//       >
//         <div className="max-w-7xl mx-auto space-y-6 relative z-10">

//           {/* --- NEW COMMAND PANEL --- */}
//           <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-1 relative shadow-2xl">
//             <div className="bg-slate-950/80 rounded-xl p-6 md:p-8 relative z-10">
              
//               <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-6">
//                 <h2 className="text-lg font-semibold text-white flex items-center gap-2">
//                   <Navigation size={20} className="text-slate-400" /> Global Manifest
//                 </h2>

//                 {/* --- TIMELINE TABS --- */}
//                 <div className="flex flex-wrap bg-slate-900 p-1.5 rounded-xl border border-slate-700 gap-1">
//                   <button 
//                     onClick={() => setActiveTab('ongoing')}
//                     className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'ongoing' ? 'bg-red-500/10 text-red-400 shadow-sm border border-red-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
//                   >
//                     <Activity size={16} /> Ongoing
//                   </button>
//                   <button 
//                     onClick={() => setActiveTab('upcoming')}
//                     className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-blue-500/10 text-blue-400 shadow-sm border border-blue-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
//                   >
//                     <Calendar size={16} /> Upcoming
//                   </button>
//                   <button 
//                     onClick={() => setActiveTab('completed')}
//                     className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'completed' ? 'bg-emerald-500/10 text-emerald-400 shadow-sm border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
//                   >
//                     <CheckSquare size={16} /> Completed
//                   </button>
//                 </div>
//               </div>
              
//               {/* --- SMART SEARCH BAR --- */}
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Search size={20} className="text-slate-500 group-focus-within:text-blue-400 transition-colors" />
//                 </div>
//                 <input 
//                   type="text" 
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search by country (e.g., 'Italy'), city (e.g., 'Rome'), or guest name..." 
//                   className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600 text-lg shadow-inner"
//                 />
//               </div>

//             </div>
//           </div>

//           {/* --- RESULTS AREA --- */}
//           <div className="mt-8">
//             {isLoading ? (
//               <div className="flex flex-col items-center justify-center py-20 opacity-70">
//                 <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
//                 <p className="text-slate-400 font-medium animate-pulse">Syncing Global Manifest...</p>
//               </div>
//             ) : filteredTravelers.length === 0 ? (
//               <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-10 text-center animate-in fade-in slide-in-from-bottom-4 backdrop-blur-sm">
//                 <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
//                   <CheckCircle2 size={32} />
//                 </div>
//                 <h3 className="text-xl font-bold text-emerald-400 mb-2">Zone Clear</h3>
//                 <p className="text-emerald-500/70">No {activeTab} trips match your search criteria.</p>
//               </div>
//             ) : (
//               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//                 {/* 👇 PASSING THE FILTERED DATA TO THE TABLE 👇 */}
//                 <ImpactManifestTable travelers={filteredTravelers} activeTab={activeTab} />
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// } 









"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, Search, Activity, CheckCircle2, 
  Navigation, Calendar, CheckSquare, Loader2
} from 'lucide-react';

// We import the Table Component
import ImpactManifestTable from './ImpactManifestTable';

export default function RiskManagementPage() {
  const [allTravelers, setAllTravelers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ongoing' | 'upcoming' | 'completed'>('ongoing');

  // Fetch ALL trips automatically when the page loads
  useEffect(() => {
    const fetchManifest = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/crisis/scan`);
        const data = await res.json();
        
        if (data.success) {
          setAllTravelers(data.data);
        } else {
          alert("Failed to load manifest: " + data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchManifest();
  }, []); 

  // Instant Smart Search Logic (Runs on the frontend)
  const filteredTravelers = useMemo(() => {
    return allTravelers.filter(t => {
      // 1. First, check if the trip matches the selected tab (Ongoing/Upcoming/Completed)
      if (t.timelineCategory !== activeTab) return false;

      // 2. Then, check if it matches the Search Bar (Country, City, or Guest Name)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        
        const matchesCountry = t.allCountries?.some((c: string) => c.toLowerCase().includes(term));
        const matchesCity = t.allCities?.some((c: string) => c.toLowerCase().includes(term));
        const matchesName = t.leadGuestName?.toLowerCase().includes(term);

        if (!matchesCountry && !matchesCity && !matchesName) {
          return false;
        }
      }

      return true; // Keep the traveler if they pass both filters
    });
  }, [allTravelers, activeTab, searchTerm]);

  return (
    <div className="flex flex-col h-screen font-sans w-full">

      {/* --- HEADER --- */}
      <div className="bg-gray-100 border border-slate-200 p-2 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between mb-0 gap-4 z-20">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-red-200 border border-red-100 flex items-center justify-center text-red-700 shadow-sm">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              Crisis Management Center
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </h1>
            <p className="text-slate-700 text-sm mt-1 font-medium">Duty of Care & Global Threat Tracking</p>
          </div>
        </div>
        
        <div className="text-right bg-slate-50 border border-slate-100 px-5 py-3 rounded-xl min-w-[160px]">
          <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-1">System Status</div>
          <div className="text-sm font-bold text-emerald-700 flex items-center justify-end md:justify-center gap-1.5">
            <Activity size={16} /> Operational
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div 
        className="flex-1 overflow-y-auto p-6 md:p-10 bg-cover bg-center bg-no-repeat bg-fixed relative selection:bg-blue-500/30 text-slate-800"  
        style={{ 
          // Lighter overlay for a clean day-mode dashboard feel
          backgroundImage: `linear-gradient(to bottom, rgba(161, 161, 161, 0.62), rgba(232, 232, 232, 0.43)), url('https://images.unsplash.com/photo-1747233368217-7d6bbdd3f553?q=80&w=1170&auto=format&fit=crop')` 
        }}
      >
        <div className="max-w-8xl mx-auto space-y-6 relative z-10">

          {/* --- COMMAND PANEL (LIGHT THEME) --- */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-1 relative shadow-lg">
            <div className="bg-white rounded-xl p-6 md:p-8 relative z-10 shadow-sm border border-slate-100">
              
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Navigation size={24} className="text-blue-600" /> Global Manifest
                </h2>

                {/* --- TIMELINE TABS --- */}
                <div className="flex flex-wrap bg-slate-50 p-1.5 rounded-xl border border-slate-200 gap-1">
                  <button 
                    onClick={() => setActiveTab('ongoing')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'ongoing' ? 'bg-white text-red-600 shadow-sm border border-red-200' : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'}`}
                  >
                    <Activity size={16} /> Ongoing
                  </button>
                  <button 
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-white text-blue-600 shadow-sm border border-blue-200' : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'}`}
                  >
                    <Calendar size={16} /> Upcoming
                  </button>
                  <button 
                    onClick={() => setActiveTab('completed')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'completed' ? 'bg-white text-emerald-600 shadow-sm border border-emerald-200' : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'}`}
                  >
                    <CheckSquare size={16} /> Completed
                  </button>
                </div>
              </div>
              
              {/* --- SMART SEARCH BAR --- */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by country (e.g., 'Italy'), city (e.g., 'Rome'), or guest name..." 
                  className="w-full bg-gray-200 border border-gray-400 text-slate-900 rounded-xl py-4 pl-12 pr-4  focus:outline focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder:text-slate-400 text-lg shadow-inner"
                />
              </div>

            </div>
          </div>

          {/* --- RESULTS AREA --- */}
          <div className="mt-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-70">
                <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Syncing Global Manifest...</p>
              </div>
            ) : filteredTravelers.length === 0 ? (
              <div className="bg-white/80 border border-slate-200 rounded-2xl p-10 text-center animate-in fade-in slide-in-from-bottom-4 backdrop-blur-sm shadow-sm">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500 border border-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Zone Clear</h3>
                <p className="text-slate-500">No {activeTab} trips match your search criteria.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* 👇 PASSING THE FILTERED DATA TO THE TABLE 👇 */}
                <ImpactManifestTable travelers={filteredTravelers} activeTab={activeTab} />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}