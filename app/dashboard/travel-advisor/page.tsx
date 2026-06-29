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
    Ban
} from 'lucide-react';

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

export default function TravelAdvisorPage() {
    // --- UI STATES ---
    const [activeTab, setActiveTab] = useState('roster');
    const [searchQuery, setSearchQuery] = useState("");
    
    // --- DATA STATES ---
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);

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
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-16 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                                <DollarSign size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Commission Ledger Empty</h3>
                            <p className="text-slate-500 max-w-md">
                                Once your advisors start selling itineraries and completing trips, their gross profits and your host agency cuts will populate here automatically.
                            </p>
                        </div>
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