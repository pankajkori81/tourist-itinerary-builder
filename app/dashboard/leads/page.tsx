// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Plus, Phone, MapPin, DollarSign, Users, Briefcase, Calendar, ArrowRight, Loader2, ArrowRightCircle } from 'lucide-react';
// import { useUser } from '@/app/context/UserContext';

// interface Lead {
//   _id: string;
//   customerName: string;
//   phone: string;
//   destination: string;
//   travelDates: string;
//   numberOfTravelers: number;
//   budget: number;
//   status: 'New' | 'Contacted' | 'Quoted' | 'Won' | 'Lost';
//   createdAt: string;
// }

// export default function LeadsDashboard() {
//   const router = useRouter();
//   const { user } = useUser();
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchLeads = async () => {
//     try {
//       const res = await fetch("/api/leads");
//       const json = await res.json();
//       if (json.success) setLeads(json.data);
//     } catch (error) {
//       console.error("Failed to fetch leads");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   const updateStatus = async (leadId: string, newStatus: string) => {
//     try {
//       // Optimistic UI update
//       setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus as any } : l));
      
//       // Backend update
//       await fetch("/api/leads", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ leadId, status: newStatus }),
//       });
//     } catch (error) {
//       alert("Failed to update status");
//       fetchLeads(); // Revert on failure
//     }
//   };

//   // The Magic Bridge!
//   const convertToItinerary = (lead: Lead) => {
//      // Encode data into URL parameters
//      const params = new URLSearchParams({
//         clientName: lead.customerName,
//         dest: lead.destination,
//         pax: String(lead.numberOfTravelers)
//      });
//      router.push(`/dashboard/itinerary/create?${params.toString()}`);
//   };

//   const columns = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];

//   return (
//  // 👇 FIX 1: Root container matches TripsPage perfectly (relative overflow-hidden)
//     <div className="h-full flex flex-col relative overflow-hidden bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 px-8 py-3 flex justify-between items-center shadow-sm shrink-0 relative z-10">
//         <div>
//           <h1 className="text-gray-900 font-extrabold text-xl tracking-tight flex items-center gap-2">
//              <Briefcase className="text-indigo-600" size={22}/> CRM Pipeline
//           </h1>
//           <p className="text-gray-500 text-xs mt-1">Manage inquiries and convert them to trips.</p>
//         </div>
//     {/* 👇 FIX 2: Added 'shrink-0' so the button never gets squished */}
//      <button 
//            onClick={() => router.push('/dashboard/leads/new')} 
//            className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 shrink-0"
//         >
//            <Plus size={16}/> New Inquiry
//         </button>
//       </div>

//       {/* Kanban Board */}
//     {/* 👇 FIX 3: Added 'min-w-0' and 'min-h-0' so the horizontal scrollbar triggers correctly */}
//   <div className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden px-8 py-6 relative z-10">
//         {loading ? (
//             <div className="flex h-full items-center justify-center text-gray-400"><Loader2 className="animate-spin" size={32}/></div>
//         ) : (
//             <div className="flex gap-6 h-full pb-4 w-max">
//             {columns.map(col => {
//                 const columnLeads = leads.filter(l => l.status === col);
                
//                 return (
//                 <div key={col} className="w-80 flex flex-col max-h-full bg-gray-100/50 border border-gray-200 rounded-xl overflow-hidden shrink-0">
                    
//                     {/* Column Header */}
//                     <div className="p-3 border-b border-gray-200 bg-gray-100 flex justify-between items-center shrink-0">
//                         <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
//                             {col === 'New' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
//                             {col === 'Contacted' && <span className="w-2 h-2 rounded-full bg-yellow-500"></span>}
//                             {col === 'Quoted' && <span className="w-2 h-2 rounded-full bg-purple-500"></span>}
//                             {col === 'Won' && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
//                             {col === 'Lost' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
//                             {col.toUpperCase()}
//                         </h3>
//                         <span className="bg-white text-gray-500 text-xs font-bold px-2 py-0.5 rounded shadow-sm">
//                             {columnLeads.length}
//                         </span>
//                     </div>

//                     {/* Cards Container */}
//                     <div className="flex-1 overflow-y-auto p-3 space-y-3">
//                         {columnLeads.map(lead => (
//                             <div key={lead._id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative">
                                
//                                 <h4 className="font-bold text-gray-900 text-base mb-2">{lead.customerName}</h4>
                                
//                                 <div className="space-y-1.5 mb-4">
//                                     <p className="text-xs text-gray-600 flex items-center gap-2"><MapPin size={12} className="text-blue-500"/> {lead.destination}</p>
//                                     <p className="text-xs text-gray-600 flex items-center gap-2"><Calendar size={12} className="text-orange-500"/> {lead.travelDates}</p>
//                                     <div className="flex items-center justify-between text-xs text-gray-600">
//                                         <span className="flex items-center gap-1"><Users size={12} className="text-purple-500"/> {lead.numberOfTravelers} Pax</span>
//                                         <span className="font-bold text-green-700 flex items-center gap-0.5"><DollarSign size={12}/>{lead.budget.toLocaleString()}</span>
//                                     </div>
//                                     <p className="text-xs text-gray-500 flex items-center gap-2 pt-1 border-t border-gray-100 mt-2"><Phone size={12}/> {lead.phone}</p>
//                                 </div>

//                                 <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
//                                     <select 
//                                         value={lead.status}
//                                         onChange={(e) => updateStatus(lead._id, e.target.value)}
//                                         className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded px-1 py-1 outline-none w-1/2"
//                                     >
//                                         {columns.map(c => <option key={c} value={c}>Move to {c}</option>)}
//                                     </select>

//                                     {/* THE MAGIC BRIDGE BUTTON */}
//                                     <button 
//                                         onClick={() => convertToItinerary(lead)}
//                                         className="w-1/2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-[10px] font-bold py-1.5 rounded transition-colors flex items-center justify-center gap-1 border border-blue-100"
//                                         title="Convert to Itinerary Draft"
//                                     >
//                                         Build Trip <ArrowRightCircle size={12}/>
//                                     </button>
//                                 </div>

//                             </div>
//                         ))}
//                     </div>
//                 </div>
//                 );
//             })}
//             </div>
//         )}
//       </div>
//     </div>
//   );
// } 






// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Plus, Phone, MapPin, DollarSign, Users, Briefcase, Calendar, ArrowRightCircle, Loader2 } from 'lucide-react';
// import { useUser } from '@/app/context/UserContext';

// interface Lead {
//   _id: string;
//   customerName: string;
//   phone: string;
//   destination: string;
//   travelDates: string;
//   numberOfTravelers: number;
//   budget: number;
//   status: 'New' | 'Contacted' | 'Quoted' | 'Won' | 'Lost';
//   createdAt: string;
// }

// export default function LeadsDashboard() {
//   const router = useRouter();
//   const { user } = useUser();
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchLeads = async () => {
//     try {
//       const res = await fetch("/api/leads");
//       const json = await res.json();
//       if (json.success) setLeads(json.data);
//     } catch (error) {
//       console.error("Failed to fetch leads");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   const updateStatus = async (leadId: string, newStatus: string) => {
//     try {
//       // Optimistic UI update
//       setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus as any } : l));
      
//       // Backend update
//       await fetch("/api/leads", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ leadId, status: newStatus }),
//       });
//     } catch (error) {
//       alert("Failed to update status");
//       fetchLeads(); // Revert on failure
//     }
//   };

//   // The Magic Bridge!
//   const convertToItinerary = (lead: Lead) => {
//      // Encode data into URL parameters
//      const params = new URLSearchParams({
//         clientName: lead.customerName,
//         dest: lead.destination,
//         pax: String(lead.numberOfTravelers)
//      });
//      router.push(`/dashboard/itinerary/create?${params.toString()}`);
//   };

//   const columns = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];

//   return (
//     // 👇 FIX 1: Root container matches TripsPage perfectly (relative overflow-hidden)
//     <div className="h-full flex flex-col relative overflow-hidden bg-gray-50">
       

      
//       {/* Header */}
//       {/* 👇 FIX 2: Header padding matches TripsPage (px-8 py-3) */}
//       <div className="bg-white border-b border-gray-200 px-8 py-3 flex justify-between items-center shadow-sm shrink-0 relative z-10">
//         <div className="min-w-0">
//           <h1 className="text-gray-900 font-extrabold text-xl tracking-tight flex items-center gap-2">
//              <Briefcase className="text-indigo-600" size={22}/> CRM Pipeline
//           </h1>
//           <p className="text-gray-500 text-xs mt-1">Manage inquiries and convert them to trips.</p>
//         </div>
        
//         {/* 👇 FIX 3: shrink-0 prevents the button from squishing or disappearing */}
//         <button 
//            onClick={() => router.push('/dashboard/leads/new')} 
//            className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 shrink-0"
//         >
//            <Plus size={16}/> New Inquiry
//         </button>
//       </div>

//       {/* Kanban Board Container */}
//       {/* 👇 FIX 4: flex-1 min-w-0 is the MAGIC FIX. It stops the wide Kanban board from stretching the screen width! */}
//       <div className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden px-8 py-6 relative z-10">
//         {loading ? (
//             <div className="flex h-full items-center justify-center text-gray-400"><Loader2 className="animate-spin" size={32}/></div>
//         ) : (
//             <div className="flex gap-6 h-full pb-4 w-max">
//             {columns.map(col => {
//                 const columnLeads = leads.filter(l => l.status === col);
                
//                 return (
//                 <div key={col} className="w-70 flex flex-col h-full max-h-full bg-gray-100/50 border border-gray-200 rounded-xl overflow-hidden shrink-0">
                    
//                     {/* Column Header */}
//                     <div className="p-3 border-b border-gray-200 bg-gray-100 flex justify-between items-center shrink-0">
//                         <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
//                             {col === 'New' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
//                             {col === 'Contacted' && <span className="w-2 h-2 rounded-full bg-yellow-500"></span>}
//                             {col === 'Quoted' && <span className="w-2 h-2 rounded-full bg-purple-500"></span>}
//                             {col === 'Won' && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
//                             {col === 'Lost' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
//                             {col.toUpperCase()}
//                         </h3>
//                         <span className="bg-white text-gray-500 text-xs font-bold px-2 py-0.5 rounded shadow-sm">
//                             {columnLeads.length}
//                         </span>
//                     </div>

//                     {/* Cards Container */}
//                     <div className="flex-1 overflow-y-auto p-3 space-y-3">
//                         {columnLeads.map(lead => (
//                             <div key={lead._id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative">
                                
//                                 <h4 className="font-bold text-gray-900 text-base mb-2 truncate" title={lead.customerName}>{lead.customerName}</h4>
                                
//                                 <div className="space-y-1.5 mb-4">
//                                     <p className="text-xs text-gray-600 flex items-center gap-2 truncate"><MapPin size={12} className="text-blue-500 shrink-0"/> {lead.destination}</p>
//                                     <p className="text-xs text-gray-600 flex items-center gap-2 truncate"><Calendar size={12} className="text-orange-500 shrink-0"/> {lead.travelDates}</p>
//                                     <div className="flex items-center justify-between text-xs text-gray-600">
//                                         <span className="flex items-center gap-1"><Users size={12} className="text-purple-500"/> {lead.numberOfTravelers} Pax</span>
//                                         <span className="font-bold text-green-700 flex items-center gap-0.5"><DollarSign size={12}/>{lead.budget.toLocaleString()}</span>
//                                     </div>
//                                     <p className="text-xs text-gray-500 flex items-center gap-2 pt-1 border-t border-gray-100 mt-2 truncate"><Phone size={12} className="shrink-0"/> {lead.phone}</p>
//                                 </div>

//                                 <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
//                                     <select 
//                                         value={lead.status}
//                                         onChange={(e) => updateStatus(lead._id, e.target.value)}
//                                         className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded px-1 py-1 outline-none w-1/2"
//                                     >
//                                         {columns.map(c => <option key={c} value={c}>Move to {c}</option>)}
//                                     </select>

//                                     {/* THE MAGIC BRIDGE BUTTON */}
//                                     <button 
//                                         onClick={() => convertToItinerary(lead)}
//                                         className="w-1/2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-[10px] font-bold py-1.5 rounded transition-colors flex items-center justify-center gap-1 border border-blue-100"
//                                         title="Convert to Itinerary Draft"
//                                     >
//                                         Build Trip <ArrowRightCircle size={12}/>
//                                     </button>
//                                 </div>

//                             </div>
//                         ))}
//                     </div>
//                 </div>
//                 );
//             })}
//             </div>
//         )}
//       </div>
//     </div>
//   );
// } 















































"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Phone, MapPin, DollarSign, Users, Briefcase, 
  Calendar, ArrowRightCircle, Loader2, Search, AlignLeft, Inbox
} from 'lucide-react';
import { useUser } from '@/app/context/UserContext';

interface Lead {
  _id: string;
  customerName: string;
  phone: string;
  destination: string;
  travelDates: string;
  numberOfTravelers: number;
  budget: number;
  status: 'New' | 'Contacted' | 'Quoted' | 'Won' | 'Lost';
  createdAt: string;
}

const COLUMNS = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'] as const;

// --- Helpers ---
const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
};

const getColumnColor = (col: string) => {
    switch (col) {
        case 'New': return 'bg-blue-500';
        case 'Contacted': return 'bg-yellow-500';
        case 'Quoted': return 'bg-purple-500';
        case 'Won': return 'bg-green-500';
        case 'Lost': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
};

export default function LeadsDashboard() {
  const router = useRouter();
  const { user } = useUser();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- New Features State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<'none' | 'destination' | 'budget'>('none');

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      const json = await res.json();
      if (json.success) setLeads(json.data);
    } catch (error) {
      console.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (leadId: string, newStatus: string) => {
    try {
      setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus as any } : l));
      await fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status: newStatus }),
      });
    } catch (error) {
      alert("Failed to update status");
      fetchLeads(); 
    }
  };

  const convertToItinerary = (lead: Lead) => {
     const params = new URLSearchParams({
        clientName: lead.customerName,
        dest: lead.destination,
        pax: String(lead.numberOfTravelers)
     });
     router.push(`/dashboard/itinerary/create?${params.toString()}`);
  };

  // --- Search & Grouping Logic ---
  const filteredLeads = useMemo(() => {
      return leads.filter(lead => 
          lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.phone.includes(searchQuery)
      );
  }, [leads, searchQuery]);

  const groupedLeads = useMemo(() => {
      if (groupBy === 'none') return { 'All Inquiries': filteredLeads };

      const groups: Record<string, Lead[]> = {};
      
      filteredLeads.forEach(lead => {
          let key = 'Other';
          if (groupBy === 'destination') {
              key = lead.destination || 'Unknown';
          } else if (groupBy === 'budget') {
              if (lead.budget >= 5000) key = 'High Value (>$5k)';
              else if (lead.budget >= 2000) key = 'Medium Value ($2k-$5k)';
              else key = 'Low Value (<$2k)';
          }
          if (!groups[key]) groups[key] = [];
          groups[key].push(lead);
      });
      return groups;
  }, [filteredLeads, groupBy]);

  return (
    // 1. ROOT CONTAINER (Strict Bounds)
    <div className="h-full flex flex-col relative overflow-hidden bg-[#eee] w-full min-w-0">
      
      {/* 2. TOP TOOLBAR (Fixed) */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm shrink-0 relative z-20">
        
        {/* Title */}
        <div className="min-w-0 shrink-0">
          <h1 className="text-gray-900 font-extrabold text-xl tracking-tight flex items-center gap-2">
             <Briefcase className="text-indigo-600" size={22}/> CRM Pipeline
          </h1>
          <p className="text-gray-500 text-xs mt-1">Manage inquiries and track revenue.</p>
        </div>

        {/* Controls (Search, Group, New) */}
        <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16}/>
                <input 
                    type="text" 
                    placeholder="Search client, destination..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
            </div>

            {/* Group By Dropdown */}
            <div className="relative shrink-0">
                <select 
                    value={groupBy} 
                    onChange={(e) => setGroupBy(e.target.value as any)}
                    className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-bold py-2 pl-9 pr-8 rounded-lg outline-none focus:border-indigo-500 cursor-pointer"
                >
                    <option value="none">Group: None</option>
                    <option value="destination">Group: Destination</option>
                    <option value="budget">Group: Budget Size</option>
                </select>
                <AlignLeft className="absolute left-3 top-2.5 text-gray-500" size={16} />
            </div>
            
            {/* New Button */}
            <button 
                onClick={() => router.push('/dashboard/leads/new')} 
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center gap-2 shrink-0"
            >
                <Plus size={16}/> New Inquiry
            </button>
        </div>
      </div>

      {/* 3. KANBAN BOARD AREA (Scrollable) */}
      <div className="flex-1 min-w-0 min-h-0 overflow-auto relative z-10">
        {loading ? (
            <div className="flex h-full items-center justify-center text-gray-400"><Loader2 className="animate-spin" size={32}/></div>
        ) : (
            <div className="p-6 inline-block min-w-full">
                {Object.entries(groupedLeads).map(([groupName, groupItems], groupIndex) => (
                    <div key={groupName} className={groupIndex > 0 ? "mt-10" : ""}>
                        
                        {/* Swimlane Title (If Grouped) */}
                        {groupBy !== 'none' && (
                            <h2 className="text-lg font-extrabold text-gray-800 mb-4 flex items-center gap-2 sticky left-0">
                                <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                                {groupName} 
                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{groupItems.length}</span>
                            </h2>
                        )}

                        {/* Kanban Columns Row */}
                        <div className="flex gap-6 w-70 pb-4">
                            {COLUMNS.map(col => {
                                const columnLeads = groupItems.filter(l => l.status === col);
                                const columnTotal = columnLeads.reduce((sum, lead) => sum + (lead.budget || 0), 0);
                                
                                return (
                                <div key={col} className="w-[290px] flex flex-col bg-gray-100 border border-gray-200 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                    
                                    {/* Column Header (Monday.com Style) */}
                                    <div className="bg-white p-3 border-b border-gray-200 relative shrink-0">
                                        {/* Top Color Strip */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 ${getColumnColor(col)}`} />
                                        
                                        <div className="flex justify-between items-center mt-1">
                                            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2 uppercase tracking-wide">
                                                {col}
                                                <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                    {columnLeads.length}
                                                </span>
                                            </h3>
                                        </div>
                                        <div className="text-xs font-bold text-gray-500 mt-1">
                                            Total: <span className="text-gray-800">{formatCurrency(columnTotal)}</span>
                                        </div>
                                    </div>

                                    {/* Cards Container */}
                                    <div className="flex-1 p-3 space-y-3 min-h-[150px]">
                                        {columnLeads.length === 0 ? (
                                            <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
                                                <Inbox size={20} className="mb-1 opacity-50"/>
                                                <span className="text-xs font-medium">No leads</span>
                                            </div>
                                        ) : (
                                            columnLeads.map(lead => (
                                                <div key={lead._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all group relative cursor-pointer">
                                                    
                                                    {/* Card Header */}
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                                                                {getInitials(lead.customerName)}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="font-bold text-gray-900 text-sm truncate" title={lead.customerName}>{lead.customerName}</h4>
                                                                <p className="text-[10px] text-gray-500 truncate flex items-center gap-1"><Phone size={10}/> {lead.phone}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Card Body (Pills) */}
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 truncate max-w-full">
                                                            <MapPin size={10} className="shrink-0"/> {lead.destination}
                                                        </span>
                                                        <span className="bg-orange-50 text-orange-700 border border-orange-100 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shrink-0">
                                                            <Users size={10}/> {lead.numberOfTravelers} Pax
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between text-xs mb-4 pb-3 border-b border-gray-100">
                                                        <span className="text-gray-500 flex items-center gap-1"><Calendar size={12}/> {lead.travelDates}</span>
                                                        <span className="font-black text-green-700 text-sm">{formatCurrency(lead.budget)}</span>
                                                    </div>

                                                    {/* Actions Footer */}
                                                    <div className="flex items-center gap-2">
                                                        {/* Sleek Status Changer */}
                                                        <div className="relative w-1/2">
                                                            <select 
                                                                value={lead.status}
                                                                onChange={(e) => updateStatus(lead._id, e.target.value)}
                                                                className="appearance-none w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-bold py-2 pl-3 pr-6 rounded-lg outline-none cursor-pointer transition-colors"
                                                            >
                                                                {COLUMNS.map(c => <option key={c} value={c}>Status: {c}</option>)}
                                                            </select>
                                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                                                <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                                            </div>
                                                        </div>

                                                        {/* Build Trip Button */}
                                                        <button 
                                                            onClick={() => convertToItinerary(lead)}
                                                            className="w-1/2 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-[10px] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1 border border-indigo-100 hover:border-indigo-600 shadow-sm"
                                                            title="Convert to Itinerary Draft"
                                                        >
                                                            Build Trip <ArrowRightCircle size={12}/>
                                                        </button>
                                                    </div>

                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}





