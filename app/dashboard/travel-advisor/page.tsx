// 'use client';

// import React, { useState } from 'react';
// import { Users, DollarSign, Briefcase, Plus } from 'lucide-react';

// export default function TravelAdvisorPage() {
//     const [activeTab, setActiveTab] = useState('roster');

//     return (
//         <div className="min-h-screen bg-slate-50 p-8">
//             {/* --- HEADER --- */}
//             <div className="flex justify-between items-end bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
//                 <div>
//                     <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
//                         <Users className="text-blue-600" size={32} />
//                         Travel Advisor Management
//                     </h1>
//                     <p className="text-slate-500 mt-2 font-medium">
//                         Manage your agency network, track commissions, and monitor advisor performance.
//                     </p>
//                 </div>
                
//                 <button className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm">
//                     <Plus size={18} /> Add New Advisor
//                 </button>
//             </div>

//             {/* --- NAVIGATION TABS --- */}
//             <div className="flex gap-4 border-b border-slate-200 mb-8">
//                 <button 
//                     onClick={() => setActiveTab('roster')}
//                     className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'roster' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
//                 >
//                     <Briefcase size={18} /> Advisor Roster
//                 </button>
//                 <button 
//                     onClick={() => setActiveTab('commissions')}
//                     className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'commissions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
//                 >
//                     <DollarSign size={18} /> Commission Tracker
//                 </button>
//             </div>

//             {/* --- CONTENT AREA --- */}
//             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
//                 <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
//                     {activeTab === 'roster' ? <Users size={32} /> : <DollarSign size={32} />}
//                 </div>
//                 <h3 className="text-xl font-bold text-slate-800 mb-2">
//                     {activeTab === 'roster' ? 'No Advisors Added Yet' : 'No Commissions to Track'}
//                 </h3>
//                 <p className="text-slate-500 max-w-md">
//                     {activeTab === 'roster' 
//                         ? 'Start building your team by adding travel advisors. You can set their commission splits and access levels here.' 
//                         : 'Once your advisors start closing itineraries, their commission payouts will automatically populate here.'}
//                 </p>
//             </div>
//         </div>
//     );
// }














// 'use client';

// import React, { useState, useEffect } from 'react';
// import { 
//     Users, DollarSign, Briefcase, Plus, Search, 
//     Mail, Phone, Building2, Calendar, Loader2, ArrowRight
// } from 'lucide-react';

// interface Agent {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   agencyName: string;
//   status: string;
//   createdAt: string;
//   commissionRate?: number;
// }

// export default function TravelAdvisorPage() {
//     const [activeTab, setActiveTab] = useState('roster');
//     const [agents, setAgents] = useState<Agent[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [searchQuery, setSearchQuery] = useState("");

//     // Fetch ONLY Active Agents for the Roster
//     useEffect(() => {
//         const fetchActiveAgents = async () => {
//             try {
//                 setLoading(true);
//                 const res = await fetch("/api/admin/agents");
//                 const json = await res.json();
//                 if (json.success) {
//                     // Filter to only show active or suspended agents (exclude pending/rejected)
//                     const rosterAgents = json.data.filter((a: Agent) => 
//                         a.status === 'active' || a.status === 'suspended'
//                     );
//                     setAgents(rosterAgents);
//                 }
//             } catch (error) {
//                 console.error("Failed to load agents:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchActiveAgents();
//     }, []);

//     const filteredAgents = agents.filter(agent => 
//         (agent.name && agent.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (agent.agencyName && agent.agencyName.toLowerCase().includes(searchQuery.toLowerCase()))
//     );

//     return (
//         <div className="relative min-h-screen w-full flex flex-col font-sans overflow-hidden bg-slate-900">
            
//             {/* --- BACKGROUND LAYER --- */}
//             <div 
//                 className="absolute inset-0 z-0 fixed" 
//                 style={{ 
//                     backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')",
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center'
//                 }} 
//             />
//             <div className="absolute inset-0 z-0 fixed bg-black/60 backdrop-blur-sm" />

//             {/* --- MAIN CONTENT LAYER --- */}
//             <div className="relative z-10 flex-1 p-6 md:p-8 h-full overflow-y-auto">
//                 <div className="max-w-7xl mx-auto space-y-6">
                    
//                     {/* --- HEADER --- */}
//                     <div className="flex flex-col md:flex-row justify-between md:items-end bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl gap-4">
//                         <div>
//                             <h1 className="text-3xl font-black text-white flex items-center gap-3">
//                                 <Users className="text-purple-400" size={32} />
//                                 Travel Advisor Network
//                             </h1>
//                             <p className="text-gray-300 mt-2 font-medium">
//                                 Manage your agency network, track commissions, and monitor advisor performance.
//                             </p>
//                         </div>
                        
//                         <button className="flex items-center justify-center gap-2 bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-xl text-sm font-bold transition-transform active:scale-95 shadow-lg shadow-purple-600/20">
//                             <Plus size={18} /> Add New Advisor
//                         </button>
//                     </div>

//                     {/* --- NAVIGATION TABS & SEARCH --- */}
//                     <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10">
//                         <div className="flex gap-2">
//                             <button 
//                                 onClick={() => setActiveTab('roster')}
//                                 className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'roster' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
//                             >
//                                 <Briefcase size={18} /> Advisor Roster
//                             </button>
//                             <button 
//                                 onClick={() => setActiveTab('commissions')}
//                                 className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'commissions' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
//                             >
//                                 <DollarSign size={18} /> Commission Tracker
//                             </button>
//                         </div>

//                         {activeTab === 'roster' && (
//                             <div className="relative w-full md:w-72">
//                                 <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
//                                 <input 
//                                     type="text" 
//                                     placeholder="Search agents..." 
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                     className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                 />
//                             </div>
//                         )}
//                     </div>

//                     {/* --- CONTENT AREA --- */}
//                     {activeTab === 'roster' ? (
//                         loading ? (
//                             <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-20 flex flex-col items-center justify-center text-gray-400">
//                                 <Loader2 className="animate-spin mb-4 text-purple-500" size={40} /> 
//                                 <p className="font-medium">Loading advisor network...</p>
//                             </div>
//                         ) : filteredAgents.length === 0 ? (
//                             <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-12 flex flex-col items-center justify-center text-center">
//                                 <div className="w-20 h-20 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-4">
//                                     <Users size={36} />
//                                 </div>
//                                 <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Advisors Found</h3>
//                                 <p className="text-slate-500 max-w-md">
//                                     You don't have any active advisors matching this criteria. Go to the "Agent Approvals" tab to approve pending requests.
//                                 </p>
//                             </div>
//                         ) : (
//                             /* ADVANCED GRID LAYOUT FOR ROSTER */
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {filteredAgents.map((agent) => (
//                                     <div key={agent._id} className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:-translate-y-1 transition-transform duration-300 group">
                                        
//                                         {/* Card Header */}
//                                         <div className="flex justify-between items-start mb-5">
//                                             <div className="flex items-center gap-4">
//                                                 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
//                                                     {agent.name.charAt(0).toUpperCase()}
//                                                 </div>
//                                                 <div>
//                                                     <h3 className="font-bold text-slate-900 text-lg group-hover:text-purple-700 transition-colors">{agent.name}</h3>
//                                                     <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">{agent.agencyName || "Independent"}</p>
//                                                 </div>
//                                             </div>
//                                             <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${agent.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
//                                                 {agent.status}
//                                             </span>
//                                         </div>

//                                         {/* Financial Details */}
//                                         <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-5 flex justify-between items-center">
//                                             <div>
//                                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Commission Split</p>
//                                                 <p className="text-sm font-bold text-slate-900">Standard Rate</p>
//                                             </div>
//                                             <span className="text-2xl font-black text-indigo-700">{agent.commissionRate || 0}%</span>
//                                         </div>

//                                         {/* Contact Details */}
//                                         <div className="space-y-3 text-sm text-slate-600">
//                                             <div className="flex items-center gap-3">
//                                                 <Mail size={16} className="text-slate-400" />
//                                                 <span className="truncate">{agent.email}</span>
//                                             </div>
//                                             <div className="flex items-center gap-3">
//                                                 <Calendar size={16} className="text-slate-400" />
//                                                 <span>Joined {new Date(agent.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
//                                             </div>
//                                         </div>

//                                         {/* Action Button */}
//                                         <button className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-bold rounded-xl text-sm transition-colors flex justify-center items-center gap-2">
//                                             View Performance <ArrowRight size={16} />
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )
//                     ) : (
//                         /* COMMISSIONS TAB (Placeholder for later) */
//                         <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-16 flex flex-col items-center justify-center text-center">
//                             <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
//                                 <DollarSign size={36} />
//                             </div>
//                             <h3 className="text-xl font-bold text-slate-900 mb-2">Commission Ledger Empty</h3>
//                             <p className="text-slate-500 max-w-md">
//                                 Once your advisors start selling itineraries and completing trips, their gross profits and your host agency cuts will populate here automatically.
//                             </p>
//                         </div>
//                     )}
                    
//                 </div>
//             </div>

            
//         </div>
//     );
// }





























'use client';

import React, { useState, useEffect } from 'react';
import { 
    Users, DollarSign, Briefcase, Plus, Search, 
    Mail, Calendar, Loader2, ArrowRight, X, Building2, Percent, Lock, User,
    Ban , FileDown
} from 'lucide-react';
import jsPDF from "jspdf";


interface Agent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  agencyName: string;
  status: string;
  createdAt: string;
  commissionRate?: number;
}




interface CommissionRecord {
  _id: string;
  itineraryName: string;
  clientName: string;
  totalSalePrice: number; // 👈 Add this
  totalNetCost: number;   // 👈 Add this
  totalGrossProfit: number;
  agentCutAmount: number;
  adminCutAmount: number;
  payoutStatus: string;
  createdAt: string;
  agentId: {
    _id: string;
    name: string;
    agencyName: string;
  };
}

export default function TravelAdvisorPage() {
    // --- UI STATES ---
    const [activeTab, setActiveTab] = useState('roster');
    const [searchQuery, setSearchQuery] = useState("");
    
    // --- DATA STATES ---
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);

    // Add these to your DATA STATES inside TravelAdvisorPage
const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
const [loadingCommissions, setLoadingCommissions] = useState(false);

    // --- MODAL STATES ---
    // --- DRAWER STATES (For View Performance) ---
    const [performanceAgent, setPerformanceAgent] = useState<Agent | null>(null);
    const [drawerTab, setDrawerTab] = useState<'overview' | 'edit'>('overview');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newAdvisor, setNewAdvisor] = useState({
        name: "",
        email: "",
        password: "",
        agencyName: "",
        commissionRate: 70
    });

    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    // --- FETCH FUNCTION (Extracted so we can call it after adding a new agent) ---
    const fetchActiveAgents = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/agents");
            const json = await res.json();
            if (json.success) {
                const rosterAgents = json.data.filter((a: Agent) => 
                    a.status === 'active' || a.status === 'suspended'
                );
                setAgents(rosterAgents);
            }
        } catch (error) {
            console.error("Failed to load agents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveAgents();
    }, []);


    const fetchCommissionsLedger = async () => {
    try {
        setLoadingCommissions(true);
        const res = await fetch("/api/admin/commissions");
        const json = await res.json();
        if (json.success) {
            setCommissions(json.data);
        }
    } catch (error) {
        console.error("Failed to load commissions:", error);
    } finally {
        setLoadingCommissions(false);
    }
};

// Update your useEffect to fetch this when the tab changes
useEffect(() => {
    if (activeTab === 'roster') {
        fetchActiveAgents();
    } else if (activeTab === 'commissions') {
        fetchCommissionsLedger();
    }
}, [activeTab]);

    // --- CREATE NEW ADVISOR SUBMIT HANDLER ---
    const handleCreateAdvisor = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/admin/agents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAdvisor),
            });

            const data = await res.json();

            if (data.success) {
                // Close modal, reset form, and refresh grid!
                setIsAddModalOpen(false);
                setNewAdvisor({ name: "", email: "", password: "", agencyName: "", commissionRate: 70 });
                fetchActiveAgents(); 
            } else {
                alert(data.message || "Failed to create advisor.");
            }
        } catch (error) {
            console.error("Error creating advisor:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    // ═══════════════════════════════════════════════════════════════
// FUNCTION: handleDownloadReceipt
// PURPOSE: Fetches commission data from API, then generates PDF
//          client-side using jsPDF (same pattern as review page)
// LOCATION: Inside TravelAdvisorPage component, with other handlers
// ═══════════════════════════════════════════════════════════════
// const handleDownloadReceipt = async (bookingId: string) => {
//   setDownloadingId(bookingId);

//   try {
//     // ── 1. Fetch receipt data from our new backend route ──
//     const res  = await fetch("/api/admin/commissions/receipt", {
//       method : "POST",
//       headers: { "Content-Type": "application/json" },
//       body   : JSON.stringify({ bookingId }),
//     });
//     const json = await res.json();

//     if (!json.success || !json.data) {
//       alert(json.message || "Failed to generate receipt.");
//       return;
//     }

//     const d = json.data; // shorthand for receipt data

//     // ── 2. Generate PDF with jsPDF ──
//     const doc = new jsPDF({ unit: "mm", format: "a4" });
//     const pw  = doc.internal.pageSize.width;  // 210mm
//     const ph  = doc.internal.pageSize.height; // 297mm
//     const M   = 14; // left/right margin
//     const RX  = pw - M; // right boundary

//     // Color constants
//     const BLUE    : [number,number,number] = [13,  71, 161];
//     const BLUE_LT : [number,number,number] = [25, 118, 210];
//     const GREEN   : [number,number,number] = [21, 128,  61];
//     const RED     : [number,number,number] = [185,  28,  28];
//     const SLATE   : [number,number,number] = [71,  85, 105];
//     const DARK    : [number,number,number] = [15,  23,  42];
//     const BG_BLUE : [number,number,number] = [239, 246, 255];
//     const LINE    : [number,number,number] = [226, 232, 240];

//     // Receipt number
//     const receiptNo = `TXN-${Math.random().toString(36).toUpperCase().slice(2,10)}`;
//     const today     = new Date().toLocaleDateString("en-US", {
//       year:"numeric", month:"long", day:"numeric"
//     });

//     // ─────────────────────────────────────────────
//     // SECTION 1: TOP BLUE HEADER BAND
//     // ─────────────────────────────────────────────
//     doc.setFillColor(...BLUE);
//     doc.rect(0, 0, pw, 44, "F");

//     // Title
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(18);
//     doc.setTextColor(255, 255, 255);
//     doc.text("PAYOUT RECEIPT", M, 13);

//     // Subtitle
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(7.5);
//     doc.setTextColor(186, 230, 253);
//     doc.text(`Receipt No: ${receiptNo}`, M, 20);
//     doc.text(`Date: ${today}`,           M, 25.5);


//     // ── Logo + Company Info (right side of blue band) ──

//       const logoBase64 = "data:image/png;base64,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";
//     // ── Logo + Company Info (right side of blue band) ──
 

// try {
//   const cleanBase64 = logoBase64
//     .replace(/^data:image\/(png|jpg|jpeg);base64,/, "")
//     .replace(/\s/g, "");

//   if (cleanBase64.length > 100) {
//     doc.addImage(cleanBase64, "PNG", pw - 58, 3, 44, 10);
//   }
// } catch (e) {
//   // Fallback to text if logo fails
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(12);
//   doc.setTextColor(255, 255, 255);
//   doc.text("TRAVDEK", RX, 11, { align: "right" });
// }

// // Company details below logo
// doc.setFont("helvetica", "normal");
// doc.setFontSize(7);
// doc.setTextColor(186, 230, 253);
// const companyInfo = [
//   "Email:  Sandeep@TravDek.com",
//   "Tel:    +1 650 759 4331",
//   "Web:    www.TravDek.com",
//   "Add:    750 Alma lane #4459 Foster City, CA 94404 USA",
// ];
// companyInfo.forEach((line, i) => {
//   doc.text(line, RX, 20 + i * 3.5, { align: "right" });
// });
  

//     // // Company name — right side of band
//     // doc.setFont("helvetica", "bold");
//     // doc.setFontSize(12);
//     // doc.setTextColor(255, 255, 255);
//     // doc.text("TRAVDEK", RX, 11, { align: "right" });

//     // // Company details stacked
//     // doc.setFont("helvetica", "normal");
//     // doc.setFontSize(7);
//     // doc.setTextColor(186, 230, 253);
//     // const companyInfo = [
//     //   "Official B2B Network",
//     //   "Sandeep@TravDek.com  |  +1 650 759 4331",
//     //   "www.TravDek.com",
//     //   "750 Alma lane #4459 Foster City, CA 94404 USA",
//     // ];
//     // companyInfo.forEach((line, i) => {
//     //   doc.text(line, RX, 17 + i * 3.8, { align: "right" });
//     // });

//     let y = 38;

//     // ─────────────────────────────────────────────
//     // SECTION 2: PAID TO CARD
//     // ─────────────────────────────────────────────
//     doc.setFillColor(...BG_BLUE);
//     doc.roundedRect(M, y, pw - M * 2, 26, 3, 3, "F");
//     doc.setDrawColor(...LINE);
//     doc.roundedRect(M, y, pw - M * 2, 26, 3, 3, "S");

//     // Left: agent info
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(7);
//     doc.setTextColor(...SLATE);
//     doc.text("PAID TO", M + 4, y + 6.5);

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(13);
//     doc.setTextColor(...DARK);
//     doc.text(d.agentName, M + 4, y + 14);

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(9);
//     doc.setTextColor(...BLUE_LT);
//     doc.text(d.agencyName, M + 4, y + 20.5);

//     // Right: payment period
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(7);
//     doc.setTextColor(...SLATE);
//     doc.text("PAYMENT PERIOD", RX - 52, y + 6.5);

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(9);
//     doc.setTextColor(...DARK);
//     doc.text(
//       new Date().toLocaleDateString("en-US", { month:"long", year:"numeric" }),
//       RX - 52, y + 14
//     );

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(7.5);
//     doc.setTextColor(...SLATE);
//     doc.text(`Commission Rate: ${d.commissionRate}%`, RX - 52, y + 20.5);

//     y += 34;

//     // ─────────────────────────────────────────────
//     // SECTION 3: TABLE HEADER
//     // ─────────────────────────────────────────────
//     doc.setFillColor(...BLUE);
//     doc.rect(M, y, pw - M * 2, 9, "F");

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(7.5);
//     doc.setTextColor(255, 255, 255);

//     // Column X positions
//     const C = {
//       trip  : M + 3,
//       client: pw * 0.42,
//       sale  : pw * 0.58,
//       cost  : pw * 0.72,
//       profit: RX - 3,
//     };

//     doc.text("DESCRIPTION (TRIP)", C.trip,   y + 6);
//     doc.text("CLIENT",             C.client, y + 6);
//     doc.text("SALE PRICE",         C.sale,   y + 6);
//     doc.text("COST",               C.cost,   y + 6);
//     doc.text("GROSS PROFIT",       C.profit, y + 6, { align: "right" });

//     y += 9;

//     // ─────────────────────────────────────────────
//     // SECTION 4: TABLE ROW (single booking)
//     // ─────────────────────────────────────────────
//     doc.setFillColor(248, 250, 252);
//     doc.rect(M, y, pw - M * 2, 13, "F");

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(9);

//     doc.setTextColor(...DARK);
//     doc.text((d.tripName || "—").slice(0, 30), C.trip, y + 8.5);

//     doc.setTextColor(...SLATE);
//     doc.text((d.clientName || "—").slice(0, 18), C.client, y + 8.5);

//     doc.setTextColor(...DARK);
//     doc.text(`$${Number(d.totalSalePrice).toFixed(2)}`, C.sale, y + 8.5);
//     doc.text(`$${Number(d.totalNetCost).toFixed(2)}`,  C.cost, y + 8.5);

//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(...GREEN);
//     doc.text(
//       `$${Number(d.grossProfit).toFixed(2)}`,
//       C.profit, y + 8.5, { align: "right" }
//     );

//     doc.setDrawColor(...LINE);
//     doc.line(M, y + 13, RX, y + 13);

//     y += 20;

//     // ─────────────────────────────────────────────
//     // SECTION 5: TOTALS BLOCK (right-aligned)
//     // ─────────────────────────────────────────────
//     const TX      = pw * 0.55; // totals start X
//     const hostPct = d.hostCutPercent || 10;
//     const cutAmt  = d.grossProfit * (hostPct / 100);
//     const payout  = d.grossProfit - cutAmt;

//     // Subtotal row
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(8.5);
//     doc.setTextColor(...SLATE);
//     doc.text("Subtotal (Gross Profit)", TX, y);
//     doc.setTextColor(...DARK);
//     doc.setFont("helvetica", "bold");
//     doc.text(`$${Number(d.grossProfit).toFixed(2)}`, RX, y, { align:"right" });

//     y += 7;

//     // Host agency cut
//     doc.setFont("helvetica", "normal");
//     doc.setTextColor(...SLATE);
//     doc.text(`Host Agency Cut (${hostPct}%)`, TX, y);
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(...RED);
//     doc.text(`- $${cutAmt.toFixed(2)}`, RX, y, { align:"right" });

//     y += 5;

//     // Divider
//     doc.setDrawColor(...LINE);
//     doc.line(TX, y, RX, y);
//     y += 6;

//     // Total payout pill
//     doc.setFillColor(...BLUE);
//     doc.roundedRect(TX - 4, y, RX - TX + 4 + M, 13, 2, 2, "F");

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(9);
//     doc.setTextColor(255, 255, 255);
//     doc.text("TOTAL PAYOUT", TX, y + 8.5);

//     doc.setFontSize(11);
//     doc.text(`$${payout.toFixed(2)}`, RX, y + 8.5, { align:"right" });

//     y += 22;

//     // ─────────────────────────────────────────────
//     // SECTION 6: PAYMENT DETAILS + THANK YOU
//     // ─────────────────────────────────────────────
//     doc.setFillColor(...BG_BLUE);
//     doc.roundedRect(M, y, pw - M * 2, 30, 3, 3, "F");
//     doc.setDrawColor(...LINE);
//     doc.roundedRect(M, y, pw - M * 2, 30, 3, 3, "S");

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(8);
//     doc.setTextColor(...DARK);
//     doc.text("PAYMENT DETAILS", M + 4, y + 7);

//     const details = [
//       ["Status",         d.status === "paid" ? "PAID & CLEARED" : "PENDING"],
//       ["Split Applied",  `${d.commissionRate}% to Advisor / ${hostPct}% Host Agency`],
//       ["Trip Reference", d.tripId || receiptNo],
//     ];

//     details.forEach(([label, value], i) => {
//       const ry = y + 13 + i * 5.5;
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(7.5);
//       doc.setTextColor(...SLATE);
//       doc.text(`${label}  :`, M + 4, ry);

//       doc.setFont("helvetica", "bold");
//       if (label === "Status" && value === "PAID & CLEARED") {
//         doc.setTextColor(...GREEN);
//       } else {
//         doc.setTextColor(...DARK);
//       }
//       doc.text(value, M + 42, ry);
//     });

//     // THANK YOU — right side
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(20);
//     doc.setTextColor(...BLUE_LT);
//     doc.text("THANK YOU", RX - 4, y + 17, { align:"right" });

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(7.5);
//     doc.setTextColor(...SLATE);
//     doc.text("for being a Travdek partner", RX - 4, y + 24, { align:"right" });

//     y += 40;

//     // ─────────────────────────────────────────────
//     // SECTION 7: FOOTER BAND
//     // ─────────────────────────────────────────────
//     doc.setFillColor(...BLUE);
//     doc.rect(0, ph - 12, pw, 12, "F");

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(7);
//     doc.setTextColor(186, 230, 253);
//     doc.text(
//       "This is a computer-generated document. No signature required.",
//       pw / 2, ph - 6, { align:"center" }
//     );
//     doc.text(
//       "© Travdek — Official B2B Network  |  www.TravDek.com",
//       pw / 2, ph - 2, { align:"center" }
//     );

//     // ── 3. Save PDF ──
//     const fileName = `Travdek_Payout_${(d.agentName || "Agent").replace(/\s/g,"_")}_${receiptNo}.pdf`;
//     doc.save(fileName);

//   } catch (error) {
//     console.error("Receipt generation error:", error);
//     alert("A network error occurred. Please try again.");
//   } finally {
//     setDownloadingId(null);
//   }
// };



// ══════════════════════════════════════════════════════════════════
// COMPLETE handleDownloadReceipt FUNCTION
// PASTE THIS: Replace your entire existing handleDownloadReceipt
// LOCATION: Inside TravelAdvisorPage component
// NOTE: Replace "YOUR_FULL_BASE64_STRING_HERE" with your actual
//       base64 string from the supplier PDF / review page
// ══════════════════════════════════════════════════════════════════

const handleDownloadReceipt = async (bookingId: string) => {
  setDownloadingId(bookingId);

  try {
    // ── 1. Fetch receipt data from backend ──
    const res  = await fetch("/api/admin/commissions/receipt", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({ bookingId }),
    });
    const json = await res.json();

    if (!json.success || !json.data) {
      alert(json.message || "Failed to generate receipt.");
      return;
    }

    const d = json.data;

    // ── 2. Setup jsPDF ──
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pw  = doc.internal.pageSize.width;   // 210mm
    const ph  = doc.internal.pageSize.height;  // 297mm
    const M   = 14;       // left margin
    const RX  = pw - M;   // right boundary

    // ── COLOR PALETTE ──────────────────────────────────────────
    const NAVY       : [number,number,number] = [15,  30,  80];   // dark navy (page bg)
    const BLUE       : [number,number,number] = [13,  71, 161];   // header band
    const BLUE_LT    : [number,number,number] = [25, 118, 210];   // accent links
    const GREEN      : [number,number,number] = [21, 128,  61];   // profit / paid
    const RED        : [number,number,number] = [185, 28,  28];   // deductions
    const SLATE      : [number,number,number] = [71,  85, 105];   // muted labels
    const DARK       : [number,number,number] = [15,  23,  42];   // primary text
    const WHITE      : [number,number,number] = [255,255, 255];   // white text
    const BG_CARD    : [number,number,number] = [235,240, 255];   // card background (light blue-white)
    const BG_PAGE    : [number,number,number] = [245,247, 252];   // page background
    const LINE       : [number,number,number] = [210,218, 230];   // divider lines
    const GOLD       : [number,number,number] = [180,140,  40];   // total payout accent

    // ── RECEIPT META ───────────────────────────────────────────
    const receiptNo = `TXN-${Math.random().toString(36).toUpperCase().slice(2, 10)}`;
    const today     = new Date().toLocaleDateString("en-US", {
      year:"numeric", month:"long", day:"numeric"
    });

    // ══════════════════════════════════════════════════════════
    // LAYER 0: PAGE BACKGROUND (very light blue-grey)
    // ══════════════════════════════════════════════════════════
    doc.setFillColor(...BG_PAGE);
    doc.rect(0, 0, pw, ph, "F");

    // ══════════════════════════════════════════════════════════
    // SECTION 1: HEADER BAND (dark blue, tall)
    // ══════════════════════════════════════════════════════════
    doc.setFillColor(...BLUE);
    doc.rect(0, 0, pw, 46, "F");

    // Thin gold accent line at bottom of header
    doc.setFillColor(...GOLD);
    doc.rect(0, 46, pw, 1.2, "F");

    // ── PAYOUT RECEIPT title ──
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...WHITE);
    doc.text("PAYOUT RECEIPT", M, 17);

    // ── Receipt No + Date (left, below title) ──
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(200, 220, 255); // soft white-blue
    doc.text(`Receipt No: ${receiptNo}`, M, 27);
    doc.text(`Date: ${today}`,           M, 34);

    // ── LOGO (top right of header) ──
    // IMPORTANT: Replace "YOUR_FULL_BASE64_STRING_HERE" with your
    // actual logo base64 from the review/supplier PDF page
           const logoBase64 = "data:image/png;base64,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";

 

    try {
      const cleanBase64 = logoBase64
        .replace(/^data:image\/(png|jpg|jpeg);base64,/, "")
        .replace(/\s/g, "");
      if (cleanBase64.length > 100) {
        doc.addImage(cleanBase64, "PNG", pw - 58, 5, 44, 10);
      }
    } catch (e) {
      // Fallback: text logo if image fails
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...WHITE);
      doc.text("TRAVDEK", RX, 13, { align: "right" });
    }

    // ── Company info (right side, below logo) ──
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(...WHITE);
    const companyLines = [
      "Email: Sandeep@TravDek.com",
      "Tel: +1 650 759 4331",
      "Web: www.TravDek.com",
      "Add: 750 Alma lane #4459 Foster City, CA 94404 USA",
    ];
    companyLines.forEach((line, i) => {
      doc.text(line, RX, 22 + i * 4.2, { align: "right" });
    });

    let y = 54; // content starts below header + gold line

    // ══════════════════════════════════════════════════════════
    // SECTION 2: PAID TO CARD
    // ══════════════════════════════════════════════════════════
    doc.setFillColor(...BG_CARD);
    doc.roundedRect(M, y, pw - M * 2, 28, 3, 3, "F");
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.4);
    doc.roundedRect(M, y, pw - M * 2, 28, 3, 3, "S");

    // Left — PAID TO label + name + agency
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...SLATE);
    doc.text("PAID TO", M + 5, y + 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...DARK);
    doc.text(d.agentName, M + 5, y + 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...BLUE_LT);
    doc.text(d.agencyName, M + 5, y + 22);

    // Right — PAYMENT PERIOD
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...SLATE);
    doc.text("PAYMENT PERIOD", RX - 52, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.text(
      new Date().toLocaleDateString("en-US", { month:"long", year:"numeric" }),
      RX - 52, y + 15
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE);
    doc.text(`Commission Rate: ${d.commissionRate}%`, RX - 52, y + 22);

    y += 36;

    // ══════════════════════════════════════════════════════════
    // SECTION 3: TABLE HEADER
    // ══════════════════════════════════════════════════════════
    doc.setFillColor(...BLUE);
    doc.roundedRect(M, y, pw - M * 2, 10, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...WHITE);

    // Column X positions
    const C = {
      trip  : M + 4,
      client: pw * 0.40,
      sale  : pw * 0.57,
      cost  : pw * 0.71,
      profit: RX - 3,
    };

    doc.text("DESCRIPTION (TRIP)", C.trip,   y + 7);
    doc.text("CLIENT",             C.client, y + 7);
    doc.text("SALE PRICE",         C.sale,   y + 7);
    doc.text("COST",               C.cost,   y + 7);
    doc.text("GROSS PROFIT",       C.profit, y + 7, { align:"right" });

    y += 10;

    // ══════════════════════════════════════════════════════════
    // SECTION 4: TABLE ROW
    // ══════════════════════════════════════════════════════════
    doc.setFillColor(255, 255, 255);
    doc.rect(M, y, pw - M * 2, 14, "F");
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    doc.rect(M, y, pw - M * 2, 14, "S");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    // Trip name
    doc.setTextColor(...DARK);
    doc.text((d.tripName || "—").slice(0, 32), C.trip, y + 9);

    // Client
    doc.setTextColor(...SLATE);
    doc.text((d.clientName || "—").slice(0, 18), C.client, y + 9);

    // Sale price
    doc.setTextColor(...DARK);
    doc.text(`$${Number(d.totalSalePrice).toFixed(2)}`, C.sale, y + 9);

    // Cost
    doc.text(`$${Number(d.totalNetCost).toFixed(2)}`, C.cost, y + 9);

    // Gross profit (green)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GREEN);
    doc.text(
      `$${Number(d.grossProfit).toFixed(2)}`,
      C.profit, y + 9, { align:"right" }
    );

    y += 22;

    // ══════════════════════════════════════════════════════════
    // SECTION 5: TOTALS BLOCK (right-aligned)
    // ══════════════════════════════════════════════════════════
    const TX       = pw * 0.52;
    const hostPct  = d.hostCutPercent || 10;
    const cutAmt   = Number(d.grossProfit) * (hostPct / 100);
    const payout   = Number(d.grossProfit) - cutAmt;

    // Subtotal row
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...SLATE);
    doc.text("Subtotal (Gross Profit)", TX, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text(`$${Number(d.grossProfit).toFixed(2)}`, RX, y, { align:"right" });

    y += 8;

    // Host cut row
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...SLATE);
    doc.text(`Host Agency Cut (${hostPct}%)`, TX, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RED);
    doc.text(`- $${cutAmt.toFixed(2)}`, RX, y, { align:"right" });

    y += 6;

    // Divider
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.5);
    doc.line(TX, y, RX, y);

    y += 7;

    // TOTAL PAYOUT pill — dark blue with white text
    doc.setFillColor(...BLUE);
    doc.roundedRect(TX - 4, y, RX - TX + 4 + M, 14, 2, 2, "F");

    // Gold accent left stripe on total pill
    doc.setFillColor(...GOLD);
    doc.roundedRect(TX - 4, y, 3, 14, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...WHITE);
    doc.text("TOTAL PAYOUT", TX + 2, y + 9.5);

    doc.setFontSize(12);
    doc.text(`$${payout.toFixed(2)}`, RX, y + 9.5, { align:"right" });

    y += 22;

    // ══════════════════════════════════════════════════════════
    // SECTION 6: PAYMENT DETAILS CARD
    // ══════════════════════════════════════════════════════════
    doc.setFillColor(...BG_CARD);
    doc.roundedRect(M, y, pw - M * 2, 34, 3, 3, "F");
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.4);
    doc.roundedRect(M, y, pw - M * 2, 34, 3, 3, "S");

    // Blue left accent bar on card
    doc.setFillColor(...BLUE);
    doc.roundedRect(M, y, 3, 34, 1, 1, "F");

    // PAYMENT DETAILS title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...DARK);
    doc.text("PAYMENT DETAILS", M + 7, y + 8);

    // Detail rows
    const details: [string, string][] = [
      ["Status",         d.status === "paid" || d.status === "Paid" ? "PAID & CLEARED" : "PENDING"],
      ["Split Applied",  `${d.commissionRate}% to Advisor / ${hostPct}% Host Agency`],
      ["Trip Reference", d.tripId || receiptNo],
    ];

    details.forEach(([label, value], i) => {
      const ry = y + 16 + i * 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...SLATE);
      doc.text(`${label}  :`, M + 7, ry);

      doc.setFont("helvetica", "bold");
      if (label === "Status" && value === "PAID & CLEARED") {
        doc.setTextColor(...GREEN);
      } else {
        doc.setTextColor(...DARK);
      }
      doc.text(value, M + 44, ry);
    });

    // THANK YOU — right side of card
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...BLUE_LT);
    doc.text("THANK YOU", RX - 5, y + 20, { align:"right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE);
    doc.text("for being a Travdek partner", RX - 5, y + 28, { align:"right" });

    y += 42;

    // ══════════════════════════════════════════════════════════
    // SECTION 7: FOOTER BAND
    // ══════════════════════════════════════════════════════════

    // Gold accent line above footer
    doc.setFillColor(...GOLD);
    doc.rect(0, ph - 15, pw, 0.8, "F");

    doc.setFillColor(...BLUE);
    doc.rect(0, ph - 14, pw, 14, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(200, 220, 255);
    doc.text(
      "This is a computer-generated document. No signature required.",
      pw / 2, ph - 8, { align:"center" }
    );
    doc.text(
      "© Travdek — Official B2B Network  |  www.TravDek.com  |  Sandeep@TravDek.com",
      pw / 2, ph - 3.5, { align:"center" }
    );

    // ── 3. Save PDF ──
    const safeName = (d.agentName || "Agent").replace(/\s+/g, "_");
    doc.save(`Travdek_Payout_${safeName}_${receiptNo}.pdf`);

  } catch (error) {
    console.error("Receipt generation error:", error);
    alert("A network error occurred. Please try again.");
  } finally {
    setDownloadingId(null);
  }
};

 

    const filteredAgents = agents.filter(agent => 
        (agent.name && agent.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (agent.agencyName && agent.agencyName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="relative min-h-screen w-full flex flex-col font-sans overflow-hidden bg-slate-900">
            
            {/* --- BACKGROUND LAYER --- */}
            <div 
                className="absolute inset-0 z-0 fixed" 
                style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }} 
            />
            <div className="absolute inset-0 z-0 fixed bg-black/60 backdrop-blur-sm" />

            {/* --- MAIN CONTENT LAYER --- */}
            <div className="relative z-10 flex-1 p-6 md:p-8 h-full overflow-y-auto">
                <div className="max-w-8xl mx-auto space-y-6">
                    
                    {/* --- HEADER --- */}
                    <div className="flex flex-col md:flex-row justify-between md:items-end bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-white flex items-center gap-3">
                                <Users className="text-purple-400" size={32} />
                                Travel Advisor Network
                            </h1>
                            <p className="text-gray-300 mt-2 font-medium">
                                Manage your agency network, track commissions, and monitor advisor performance.
                            </p>
                        </div>
                        
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center justify-center gap-2 bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-xl text-sm font-bold transition-transform active:scale-95 shadow-lg shadow-purple-600/20"
                        >
                            <Plus size={18} /> Add New Advisor
                        </button>
                    </div>

                    {/* --- NAVIGATION TABS & SEARCH --- */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setActiveTab('roster')}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'roster' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Briefcase size={18} /> Advisor Roster
                            </button>
                            <button 
                                onClick={() => setActiveTab('commissions')}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'commissions' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <DollarSign size={18} /> Commission Tracker
                            </button>
                        </div>

                        {activeTab === 'roster' && (
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search agents..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        )}
                    </div>

                    {/* --- CONTENT AREA --- */}
                    {activeTab === 'roster' ? (
                        loading ? (
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-20 flex flex-col items-center justify-center text-gray-400">
                                <Loader2 className="animate-spin mb-4 text-purple-500" size={40} /> 
                                <p className="font-medium">Loading advisor network...</p>
                            </div>
                        ) : filteredAgents.length === 0 ? (
                            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-12 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-4">
                                    <Users size={36} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Advisors Found</h3>
                                <p className="text-slate-500 max-w-md">
                                    You don't have any active advisors matching this criteria. Click "Add New Advisor" or approve pending requests.
                                </p>
                            </div>
                        ) : (
                            /* ADVANCED GRID LAYOUT FOR ROSTER */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAgents.map((agent) => (
                                    <div key={agent._id} className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:-translate-y-1 transition-transform duration-300 group">
                                        
                                        <div className="flex justify-between items-start mb-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                                                    {agent.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-purple-700 transition-colors">{agent.name}</h3>
                                                    <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">{agent.agencyName || "Independent"}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${agent.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                                {agent.status}
                                            </span>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-5 flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Commission Split</p>
                                                <p className="text-sm font-bold text-slate-900">Standard Rate</p>
                                            </div>
                                            <span className="text-2xl font-black text-indigo-700">{agent.commissionRate || 0}%</span>
                                        </div>

                                        <div className="space-y-3 text-sm text-slate-600">
                                            <div className="flex items-center gap-3">
                                                <Mail size={16} className="text-slate-400" />
                                                <span className="truncate">{agent.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Calendar size={16} className="text-slate-400" />
                                                <span>Joined {new Date(agent.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => {
                                                setDrawerTab('overview');
                                                setPerformanceAgent(agent);
                                            }}
                                            className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-bold rounded-xl text-sm transition-colors flex justify-center items-center gap-2"
                                        >
                                            View Performance <ArrowRight size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                
                        ) : (
                        loadingCommissions ? (
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-20 flex flex-col items-center justify-center text-gray-400">
                                <Loader2 className="animate-spin mb-4 text-purple-500" size={40} /> 
                                <p className="font-medium">Loading ledger data...</p>
                            </div>
                        ) : commissions.length === 0 ? (
                            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-16 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                                    <DollarSign size={36} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Commission Ledger Empty</h3>
                                <p className="text-slate-500 max-w-md">
                                    Once your advisors start selling itineraries, their gross profits and your host agency cuts will populate here automatically.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                                <th className="p-4 font-black">Date</th>
                                                <th className="p-4 font-black">Agent / Agency</th>
                                                <th className="p-4 font-black">Trip Details</th>

                                                <th className="p-4 font-black text-right">Sale Price</th>
                                                <th className="p-4 font-black text-right text-red-500">Supplier Cost</th>
                                                <th className="p-4 font-black text-right text-green-600">Gross Profit</th>
                                                <th className="p-4 font-black text-right text-indigo-600">Agent Cut</th>
                                              
                                                <th className="p-4 font-black text-center">Status</th>
                                                <th className="p-4 font-black text-right">Action</th> 
                                                <th className="p-4 font-black text-center">Receipt</th>
                                             
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm divide-y divide-slate-100">
                                            {commissions.map((record) => (
                                                <tr key={record._id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-slate-500 font-medium">
                                                        {new Date(record.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="font-bold text-slate-900">{record.agentId?.name || "Unknown"}</p>
                                                        <p className="text-[10px] uppercase font-bold text-slate-400">{record.agentId?.agencyName}</p>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="font-bold text-slate-700">{record.itineraryName}</p>
                                                        <p className="text-xs text-slate-500">Client: {record.clientName}</p>
                                                    </td>
                                                    

                                                    <td className="p-4 text-right font-bold text-slate-700">
                                                        ${(record.totalSalePrice || 0).toFixed(2)}
                                                    </td>
                                                    <td className="p-4 text-right font-bold text-red-500 bg-red-50/30">
                                                        -${(record.totalNetCost || 0).toFixed(2)}
                                                    </td>
                                                    <td className="p-4 text-right font-black text-green-600 bg-green-50/30">
                                                        ${(record.totalGrossProfit || 0).toFixed(2)}
                                                    </td>
                                                    <td className="p-4 text-right font-black text-indigo-600">
                                                        ${(record.agentCutAmount || 0).toFixed(2)}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${record.payoutStatus === 'paid' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                                                            {record.payoutStatus}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        {record.payoutStatus === 'pending' ? (
                                                            <button 
                                                                onClick={async (e) => {
                                                                    const btn = e.currentTarget as HTMLButtonElement;
                                                                    const originalText = btn.innerText;
                                                                    btn.disabled = true;
                                                                    btn.innerText = "Processing...";
                                                                    
                                                                    try {
                                                                        const res = await fetch("/api/admin/commissions", {
                                                                            method: "PUT",
                                                                            headers: { "Content-Type": "application/json" },
                                                                            body: JSON.stringify({ bookingId: record._id })
                                                                        });
                                                                        
                                                                        if (res.ok) {
                                                                            fetchCommissionsLedger();
                                                                        } else {
                                                                            btn.disabled = false;
                                                                            btn.innerText = originalText;
                                                                            alert("Failed to process payment");
                                                                        }
                                                                    } catch (err) {
                                                                        btn.disabled = false;
                                                                        btn.innerText = originalText;
                                                                        alert("Failed to process payment");
                                                                    }
                                                                }}
                                                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                                                            >
                                                                Mark Paid
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs font-bold text-slate-400 flex items-center justify-end gap-1">
                                                                Cleared
                                                            </span>
                                                        )}
                                                    </td>

<td className="py-4 px-4">
  {record.payoutStatus === 'paid' ? (
    <button
      onClick={() => handleDownloadReceipt(record._id)}
      disabled={downloadingId === record._id}
      className="flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-white bg-purple-50 hover:bg-purple-600 border border-purple-200 hover:border-purple-600 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {downloadingId === record._id
        ? <><Loader2 size={14} className="animate-spin"/> Generating...</>
        : <><FileDown size={14}/> Receipt</>
      }
    </button>
  ) : (
    <span className="text-gray-500 text-sm italic">—</span>
  )}
</td>
                                                   
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                  
                     
                    )}
                </div>
            </div>



            {/* ================================================== */}
            {/* ADD NEW ADVISOR MODAL                              */}
            {/* ================================================== */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200 border border-white/20">
                        
                        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-5 flex justify-between items-center text-white">
                            <div>
                                <h3 className="font-bold text-lg flex items-center gap-2"><Users size={20}/> Add New Advisor</h3>
                                <p className="text-purple-200 text-xs mt-0.5">Manually create an active agent account</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-purple-200 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                                <X size={20}/>
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateAdvisor} className="p-6 space-y-4 bg-slate-50">
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5"><User size={14} className="text-purple-600"/> Full Name *</label>
                                    <input required type="text" value={newAdvisor.name} onChange={(e) => setNewAdvisor({...newAdvisor, name: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white shadow-inner" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Building2 size={14} className="text-purple-600"/> Agency Name</label>
                                    <input type="text" value={newAdvisor.agencyName} onChange={(e) => setNewAdvisor({...newAdvisor, agencyName: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white shadow-inner" placeholder="Independent" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Mail size={14} className="text-purple-600"/> Email Address *</label>
                                <input required type="email" value={newAdvisor.email} onChange={(e) => setNewAdvisor({...newAdvisor, email: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white shadow-inner" placeholder="agent@example.com" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Lock size={14} className="text-purple-600"/> Temporary Password *</label>
                                <input required type="text" minLength={6} value={newAdvisor.password} onChange={(e) => setNewAdvisor({...newAdvisor, password: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white shadow-inner" placeholder="Set a starting password" />
                            </div>

                            <div className="pt-2 border-t border-slate-200">
                                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Percent size={14} className="text-purple-600"/> Starting Commission Split (%) *</label>
                                <div className="flex items-center gap-3 mt-2">
                                    <input required type="number" min="0" max="100" value={newAdvisor.commissionRate} onChange={(e) => setNewAdvisor({...newAdvisor, commissionRate: Number(e.target.value)})} className="w-24 p-2.5 border border-slate-300 rounded-xl text-lg font-black focus:ring-2 focus:ring-purple-500 outline-none text-center text-purple-700 bg-white shadow-inner" />
                                    <span className="text-slate-600 font-bold text-sm">% to Agent</span>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-600 text-sm font-bold hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-md shadow-purple-600/20 transition-transform active:scale-95 flex items-center gap-2">
                                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================================================== */}
            {/* DRAWER: VIEW PERFORMANCE & EDIT AGENT                */}
            {/* ================================================== */}
            {performanceAgent && (
                <>
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setPerformanceAgent(null)} />
                    
                    {/* Slide-out Panel (Notice it's wider: max-w-2xl) */}
                    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-slate-50 shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col">
                        
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-6 flex justify-between items-start text-white">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black shadow-inner">
                                    {performanceAgent.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black">{performanceAgent.name}</h2>
                                    <p className="text-purple-200 text-sm font-medium uppercase tracking-wider">{performanceAgent.agencyName}</p>
                                </div>
                            </div>
                            <button onClick={() => setPerformanceAgent(null)} className="text-purple-200 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-colors">
                                <X size={24}/>
                            </button>
                        </div>

                        {/* Drawer Tabs */}
                        <div className="flex bg-white border-b border-slate-200 px-6">
                            <button 
                                onClick={() => setDrawerTab('overview')} 
                                className={`py-4 px-4 text-sm font-bold border-b-2 transition-colors ${drawerTab === 'overview' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                            >
                                Performance Overview
                            </button>
                            <button 
                                onClick={() => setDrawerTab('edit')} 
                                className={`py-4 px-4 text-sm font-bold border-b-2 transition-colors ${drawerTab === 'edit' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                            >
                                Edit Profile & Access
                            </button>
                        </div>

                        {/* Content Area (Placeholders for Step 2 and 3) */}
                        <div className="flex-1 overflow-y-auto p-6">
                         {drawerTab === 'overview' ? (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    
                                    {/* KPI Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Sales (YTD)</p>
                                            <h4 className="text-2xl font-black text-slate-900 mt-1">$0.00</h4>
                                            <p className="text-[10px] font-bold text-green-500 mt-2 flex items-center gap-1">+0% from last month</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-2xl border border-purple-100 shadow-sm">
                                            <p className="text-xs font-black text-purple-600 uppercase tracking-wider">Commission Earned</p>
                                            <h4 className="text-2xl font-black text-indigo-900 mt-1">$0.00</h4>
                                            <p className="text-[10px] font-bold text-purple-500 mt-2">Based on {performanceAgent.commissionRate || 0}% split</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Active Bookings</p>
                                            <h4 className="text-2xl font-black text-slate-900 mt-1">0</h4>
                                            <p className="text-[10px] font-bold text-slate-400 mt-2">Trips currently in progress</p>
                                        </div>
                                    </div>

                                    {/* Recent Bookings List (Placeholder until database is built) */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="text-sm font-black text-slate-800">Recent Itineraries Sold</h4>
                                            <button className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors">View All</button>
                                        </div>
                                        
                                        <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm mb-3">
                                                <Briefcase size={20} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-600">No bookings yet</p>
                                            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                                                Once {performanceAgent.name} starts creating itineraries and closing deals, their sales history will appear here.
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    
                                    {/* Edit Details Form */}

                                    {/* Edit Details Form */}
                                    <form 
                                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.currentTarget);
                                            const btn = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
                                            const originalText = btn.innerText;
                                            btn.innerText = "Saving...";
                                            btn.disabled = true;

                                            try {
                                                const res = await fetch("/api/admin/agents", {
                                                    method: "PUT",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        agentId: performanceAgent._id,
                                                        name: formData.get("name"),
                                                        agencyName: formData.get("agencyName")
                                                    })
                                                });
                                                const data = await res.json();
                                                if (data.success) {
                                                    alert("Profile updated successfully!");
                                                    fetchActiveAgents(); // Refresh the grid data instantly
                                                } else {
                                                    alert(data.message || "Failed to update profile.");
                                                }
                                            } catch (err) {
                                                alert("An error occurred while saving.");
                                            } finally {
                                                btn.innerText = originalText;
                                                btn.disabled = false;
                                            }
                                        }}
                                    >
                                        <h4 className="text-sm font-black text-slate-800 mb-5">Agent Profile</h4>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                                                    <input type="text" name="name" defaultValue={performanceAgent.name} required className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-1">Agency Name</label>
                                                    <input type="text" name="agencyName" defaultValue={performanceAgent.agencyName} className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                                                <input type="email" defaultValue={performanceAgent.email} disabled className="w-full p-2.5 border border-slate-200 rounded-xl text-sm bg-slate-100 text-slate-500 cursor-not-allowed" />
                                                <p className="text-[10px] text-slate-400 mt-1">Email cannot be changed once registered for security reasons.</p>
                                            </div>
                                            
                                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                                <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                                    Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                  

                                    {/* Security & Access */}
                                 {/* Security & Access */}
                                    <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
                                        <h4 className="text-sm font-black text-red-800 mb-2 flex items-center gap-2">
                                            <Lock size={16} /> Security & Access
                                        </h4>
                                        <p className="text-xs text-red-600 mb-4">Manage system access, temporarily suspend, or permanently remove this agent.</p>
                                        
                                        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                                            {/* 1. Reset Password */}
                                            <button className="px-4 py-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 font-bold rounded-xl text-xs transition-colors shadow-sm">
                                                Reset Password
                                            </button>
                                            
                                            {/* 2. Suspend Account (Temporary) */}
                                            <button 
                                                onClick={async () => {
                                                    const newStatus = performanceAgent.status === 'suspended' ? 'active' : 'suspended';
                                                    try {
                                                        const res = await fetch("/api/admin/agents", {
                                                            method: "PUT",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ agentId: performanceAgent._id, status: newStatus })
                                                        });
                                                        if (res.ok) {
                                                            alert(`Agent successfully ${newStatus}.`);
                                                            setPerformanceAgent(null);
                                                            fetchActiveAgents();
                                                        }
                                                    } catch (err) {
                                                        alert("Failed to update status.");
                                                    }
                                                }}
                                                className="px-4 py-2 bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 hover:border-orange-300 font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                                            >
                                                <Ban size={14} /> {performanceAgent.status === 'suspended' ? 'Reactivate Account' : 'Suspend Account'}
                                            </button>

                                            {/* 3. Remove Agent (Soft Delete / Archive) */}
                                            <button 
                                                onClick={async () => {
                                                    const isConfirmed = window.confirm("Are you sure you want to remove this agent? Their historical sales will be kept for accounting, but they will lose all access and be removed from this roster.");
                                                    if (!isConfirmed) return;

                                                    try {
                                                        const res = await fetch("/api/admin/agents", {
                                                            method: "PUT",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({
                                                                agentId: performanceAgent._id,
                                                                status: "archived"
                                                            })
                                                        });
                                                        const data = await res.json();
                                                        if (data.success) {
                                                            alert("Agent successfully removed.");
                                                            setPerformanceAgent(null); // Close the drawer
                                                            fetchActiveAgents(); // Refresh the grid (they will disappear!)
                                                        } else {
                                                            alert(data.message);
                                                        }
                                                    } catch (err) {
                                                        alert("Failed to remove agent.");
                                                    }
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white border border-red-700 hover:bg-red-700 font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 sm:ml-auto"
                                            >
                                                Remove Agent
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

        </div>
    );
}