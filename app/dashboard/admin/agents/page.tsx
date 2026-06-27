// "use client";

// import React, { useState, useEffect } from 'react';
// import { 
//   Users, CheckCircle2, XCircle, Ban, Building2, 
//   Mail, Clock, Search, ShieldCheck, Loader2 
// } from 'lucide-react';

// // Defines the data structure coming from your MongoDB
// interface Agent {
//   _id: string;
//   name: string;
//   email: string;
//   agencyName: string;
//   status: 'pending' | 'active' | 'suspended' | 'rejected';
//   createdAt: string;
// }

// export default function AgentApprovalDashboard() {
//   const [agents, setAgents] = useState<Agent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [processingId, setProcessingId] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
//   const [searchQuery, setSearchQuery] = useState("");

//   // 1. Fetch Agents on Load
//   const fetchAgents = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/admin/agents");
//       const json = await res.json();
//       if (json.success) {
//         setAgents(json.data);
//       }
//     } catch (error) {
//       console.error("Failed to load agents:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAgents();
//   }, []);

//   // 2. Handle Status Changes (Approve / Reject / Suspend)
//   const handleStatusChange = async (agentId: string, newStatus: string) => {
//     const isConfirmed = confirm(`Are you sure you want to mark this agent as ${newStatus.toUpperCase()}?`);
//     if (!isConfirmed) return;

//     try {
//       setProcessingId(agentId); // Show spinner on the specific button
      
//       const res = await fetch("/api/admin/agents", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ agentId, status: newStatus }),
//       });

//       const json = await res.json();
//       if (json.success) {
//         // Update local state without reloading the whole page
//         setAgents(prev => 
//           prev.map(agent => agent._id === agentId ? { ...agent, status: newStatus as any } : agent)
//         );
//       } else {
//         alert(json.message);
//       }
//     } catch (error) {
//       alert("Failed to update status. Please try again.");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // 3. Filter data for the table
//   const filteredAgents = agents.filter(agent => {
//     // Tab filter
//     if (activeTab === 'pending' && agent.status !== 'pending') return false;
//     if (activeTab === 'active' && !['active', 'suspended'].includes(agent.status)) return false;
    
//     // Search filter
//     const searchLower = searchQuery.toLowerCase();
//     return (
//       (agent.name && agent.name.toLowerCase().includes(searchLower)) ||
//       (agent.agencyName && agent.agencyName.toLowerCase().includes(searchLower)) ||
//       (agent.email && agent.email.toLowerCase().includes(searchLower))
//     );
//   });

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <ShieldCheck className="text-purple-600" size={28} /> 
//             Agent Approvals
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">Review and manage external B2B travel partners.</p>
//         </div>

//         {/* Search Bar */}
//         <div className="relative w-full md:w-80">
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//           <input 
//             type="text" 
//             placeholder="Search agency, name, email..." 
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow bg-white shadow-sm"
//           />
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-4 mb-6 border-b border-gray-200">
//         <button 
//           onClick={() => setActiveTab('pending')}
//           className={`pb-3 px-2 text-sm font-bold tracking-wide transition-colors flex items-center gap-2 relative ${
//             activeTab === 'pending' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
//           }`}
//         >
//           <Clock size={16} /> Pending Requests
//           {activeTab === 'pending' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-md"></span>}
          
//           {/* Badge Counter */}
//           {agents.filter(a => a.status === 'pending').length > 0 && (
//             <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">
//               {agents.filter(a => a.status === 'pending').length}
//             </span>
//           )}
//         </button>

//         <button 
//           onClick={() => setActiveTab('active')}
//           className={`pb-3 px-2 text-sm font-bold tracking-wide transition-colors flex items-center gap-2 relative ${
//             activeTab === 'active' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
//           }`}
//         >
//           <Users size={16} /> Active Directory
//           {activeTab === 'active' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-md"></span>}
//         </button>
//       </div>

//       {/* Main Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         {loading ? (
//           <div className="p-10 flex justify-center items-center text-gray-400">
//             <Loader2 className="animate-spin mr-2" size={20} /> Loading partners...
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 text-xs uppercase tracking-wider">
//                 <tr>
//                   <th className="py-4 px-6 font-bold">Agency Name</th>
//                   <th className="py-4 px-6 font-bold">Agent Contact</th>
//                   <th className="py-4 px-6 font-bold">Status</th>
//                   <th className="py-4 px-6 font-bold">Registration Date</th>
//                   <th className="py-4 px-6 font-bold text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100 text-sm">
                
//                 {filteredAgents.length === 0 && (
//                   <tr>
//                     <td colSpan={5} className="py-10 text-center text-gray-400 font-medium">
//                       No agents found in this category.
//                     </td>
//                   </tr>
//                 )}

//                 {filteredAgents.map((agent) => (
//                   <tr key={agent._id} className="hover:bg-gray-50/50 transition-colors">
                    
//                     {/* Agency Info */}
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center border border-purple-200 flex-shrink-0">
//                           <Building2 size={18} />
//                         </div>
//                         <div>
//                           <p className="font-bold text-gray-900 text-base">{agent.agencyName || "Unknown Agency"}</p>
//                           <p className="text-xs text-gray-500 font-medium tracking-wide">ID: {agent._id.slice(-6).toUpperCase()}</p>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Contact Info */}
//                     <td className="py-4 px-6">
//                       <p className="font-bold text-gray-800">{agent.name}</p>
//                       <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
//                         <Mail size={12} /> {agent.email}
//                       </p>
//                     </td>

//                     {/* Status Badge */}
//                     <td className="py-4 px-6">
//                       <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
//                         ${agent.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 
//                           agent.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
//                           'bg-red-50 text-red-700 border-red-200'}
//                       `}>
//                         {agent.status}
//                       </span>
//                     </td>

//                     {/* Date */}
//                     <td className="py-4 px-6 text-gray-600 font-medium">
//                       {new Date(agent.createdAt).toLocaleDateString('en-GB', { 
//                         day: 'numeric', month: 'short', year: 'numeric' 
//                       })}
//                     </td>

//                     {/* Action Buttons */}
//                     <td className="py-4 px-6 text-right">
//                       <div className="flex items-center justify-end gap-2">
                        
//                         {/* If Pending: Show Approve/Reject */}
//                         {agent.status === 'pending' && (
//                           <>
//                             <button 
//                               onClick={() => handleStatusChange(agent._id, 'active')}
//                               disabled={processingId === agent._id}
//                               className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-600 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
//                             >
//                               {processingId === agent._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Approve
//                             </button>
//                             <button 
//                               onClick={() => handleStatusChange(agent._id, 'rejected')}
//                               disabled={processingId === agent._id}
//                               className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
//                             >
//                               {processingId === agent._id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Reject
//                             </button>
//                           </>
//                         )}

//                         {/* If Active: Show Suspend */}
//                         {agent.status === 'active' && (
//                           <button 
//                             onClick={() => handleStatusChange(agent._id, 'suspended')}
//                             disabled={processingId === agent._id}
//                             className="px-3 py-1.5 bg-white text-gray-600 border border-gray-300 hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
//                           >
//                             {processingId === agent._id ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />} Suspend
//                           </button>
//                         )}

//                         {/* If Suspended: Show Reactivate */}
//                         {agent.status === 'suspended' && (
//                            <button 
//                            onClick={() => handleStatusChange(agent._id, 'active')}
//                            disabled={processingId === agent._id}
//                            className="px-3 py-1.5 bg-white text-gray-600 border border-gray-300 hover:bg-green-50 hover:text-green-700 hover:border-green-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
//                          >
//                            {processingId === agent._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Reactivate
//                          </button>
//                         )}

//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// }
















// "use client";

// import React, { useState, useEffect } from 'react';
// import { 
//   Users, CheckCircle2, XCircle, Ban, Building2, 
//   Mail, Clock, Search, ShieldCheck, Loader2, X, Percent, FileText, Phone,
//   Edit3
// } from 'lucide-react';

// interface Agent {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   agencyName: string;
//   status: 'pending' | 'active' | 'suspended' | 'rejected';
//   createdAt: string;
//   commissionRate?: number;
//   internalNotes?: string;
// }

// export default function AgentApprovalDashboard() {
//   const [agents, setAgents] = useState<Agent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [processingId, setProcessingId] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
//   const [searchQuery, setSearchQuery] = useState("");

//   // Modal States
//   const [approvalModalAgent, setApprovalModalAgent] = useState<Agent | null>(null);
//   const [commissionRate, setCommissionRate] = useState<number>(70); // Default to 70%
//   const [internalNotes, setInternalNotes] = useState("");

//   // Drawer State
//   const [quickViewAgent, setQuickViewAgent] = useState<Agent | null>(null);

//   const fetchAgents = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/admin/agents");
//       const json = await res.json();
//       if (json.success) setAgents(json.data);
//     } catch (error) {
//       console.error("Failed to load agents:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchAgents(); }, []);

//   // Standard Status Update (Reject, Suspend, Reactivate)
//   const handleStatusChange = async (agentId: string, newStatus: string) => {
//     const isConfirmed = confirm(`Are you sure you want to mark this agent as ${newStatus.toUpperCase()}?`);
//     if (!isConfirmed) return;
//     executeStatusUpdate(agentId, newStatus);
//   };

//   // Approval Submission with Terms
//   const handleConfirmApproval = async () => {
//     if (!approvalModalAgent) return;
//     await executeStatusUpdate(approvalModalAgent._id, 'active', commissionRate, internalNotes);
//     setApprovalModalAgent(null); // Close Modal
//   };

//   const executeStatusUpdate = async (agentId: string, status: string, commRate?: number, notes?: string) => {
//     try {
//       setProcessingId(agentId);
//       const payload: any = { agentId, status };
//       if (commRate !== undefined) payload.commissionRate = commRate;
//       if (notes !== undefined) payload.internalNotes = notes;

//       const res = await fetch("/api/admin/agents", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const json = await res.json();
//       if (json.success) {
//         setAgents(prev => prev.map(agent => agent._id === agentId ? { ...agent, status: status as any, commissionRate: commRate || agent.commissionRate, internalNotes: notes || agent.internalNotes } : agent));
//       } else {
//         alert(json.message);
//       }
//     } catch (error) {
//       alert("Failed to update status. Please try again.");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const filteredAgents = agents.filter(agent => {
//     if (activeTab === 'pending' && agent.status !== 'pending') return false;
//     if (activeTab === 'active' && !['active', 'suspended'].includes(agent.status)) return false;
//     const searchLower = searchQuery.toLowerCase();
//     return (
//       (agent.name && agent.name.toLowerCase().includes(searchLower)) ||
//       (agent.agencyName && agent.agencyName.toLowerCase().includes(searchLower)) ||
//       (agent.email && agent.email.toLowerCase().includes(searchLower))
//     );
//   });

//   // function handleConfirmTerms(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
//   //   throw new Error('Function not implemented.');
//   // }


//   // Approval / Edit Submission with Terms
//   const handleConfirmTerms = async () => {
//     if (!approvalModalAgent) return;
    
//     // If they are pending, approve them to active. If already active/suspended, keep their current status.
//     const newStatus = approvalModalAgent.status === 'pending' ? 'active' : approvalModalAgent.status;
    
//     // Execute the database update
//     await executeStatusUpdate(approvalModalAgent._id, newStatus, commissionRate, internalNotes);
    
//     // Close the Modal
//     setApprovalModalAgent(null); 
//   };

//   // function openEditModal(agent: Agent, e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
//   //   throw new Error('Function not implemented.');
//   // }

//   // Function to open the modal to EDIT an existing active agent
//   const openEditModal = (agent: Agent, e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevents the quick-view drawer from opening instead
//     setCommissionRate(agent.commissionRate || 0);
//     setInternalNotes(agent.internalNotes || "");
//     setApprovalModalAgent(agent);
//   };
//   return (


//     <d className="relative min-h-screen w-full flex flex-col font-sans overflow-hidden">
      
//       {/* --- BACKGROUND LAYER --- */}
//       <div 
//         className="absolute inset-0 z-0 fixed" 
//         style={{ 
//             backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')",
//             backgroundSize: 'cover',
//             backgroundPosition: 'center'
//         }} 
//       />
//       <div className="absolute inset-0 z-0 fixed bg-black/60 backdrop-blur-sm" />
//     // <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">

      
      
      
//       {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <ShieldCheck className="text-purple-600" size={28} /> 
//             Agent Approvals
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">Review and manage external B2B travel partners.</p>
//         </div>
//         <div className="relative w-full md:w-80">
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//           <input 
//             type="text" placeholder="Search agency, name, email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
//           />
//         </div>
//       </div>

     
//       <div className="flex gap-4 mb-6 border-b border-gray-200">
//         <button onClick={() => setActiveTab('pending')} className={`pb-3 px-2 text-sm font-bold tracking-wide transition-colors flex items-center gap-2 relative ${activeTab === 'pending' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}>
//           <Clock size={16} /> Pending Requests
//           {activeTab === 'pending' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-md"></span>}
//           {agents.filter(a => a.status === 'pending').length > 0 && (
//             <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">{agents.filter(a => a.status === 'pending').length}</span>
//           )}
//         </button>
//         <button onClick={() => setActiveTab('active')} className={`pb-3 px-2 text-sm font-bold tracking-wide transition-colors flex items-center gap-2 relative ${activeTab === 'active' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}>
//           <Users size={16} /> Active Directory
//           {activeTab === 'active' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-md"></span>}
//         </button>
//       </div> */}

      

//       {/* Main Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         {loading ? (
//           <div className="p-10 flex justify-center items-center text-gray-400"><Loader2 className="animate-spin mr-2" size={20} /> Loading partners...</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 text-xs uppercase tracking-wider">
//                 <tr>
//                   <th className="py-4 px-6 font-bold">Agency Name</th>
//                   <th className="py-4 px-6 font-bold">Agent Contact</th>
//                   <th className="py-4 px-6 font-bold">Status</th>
//                   {activeTab === 'active' && <th className="py-4 px-6 font-bold text-center">Comm. Split</th>}
//                   <th className="py-4 px-6 font-bold">Reg. Date</th>
//                   <th className="py-4 px-6 font-bold text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100 text-sm">
//                 {filteredAgents.length === 0 && (<tr><td colSpan={6} className="py-10 text-center text-gray-400 font-medium">No agents found.</td></tr>)}

//                 {filteredAgents.map((agent) => (
//                   <tr key={agent._id} onClick={() => setQuickViewAgent(agent)} className="hover:bg-gray-50/80 transition-colors cursor-pointer group">
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center border border-purple-200 flex-shrink-0 group-hover:scale-105 transition-transform"><Building2 size={18} /></div>
//                         <div>
//                           <p className="font-bold text-gray-900 text-base group-hover:text-purple-700 transition-colors">{agent.agencyName || "Unknown Agency"}</p>
//                           <p className="text-xs text-gray-500 font-medium tracking-wide">ID: {agent._id.slice(-6).toUpperCase()}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <p className="font-bold text-gray-800">{agent.name}</p>
//                       <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Mail size={12} /> {agent.email}</p>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${agent.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : agent.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
//                         {agent.status}
//                       </span>
//                     </td>
//                     {/* {activeTab === 'active' && (
//                       <td className="py-4 px-6 text-center">
//                         <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">{agent.commissionRate || 0}%</span>
//                       </td>
//                     )} */}

//                     {activeTab === 'active' && (
//                           <td className="py-4 px-6 text-center">
//                             <div className="flex items-center justify-center gap-2">
//                               <span className="font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 shadow-sm">
//                                 {agent.commissionRate || 0}%
//                               </span>
                              
//                               {/* This is the Edit Button that opens the Modal for Active Agents! */}
//                               <button 
//                                 onClick={(e) => openEditModal(agent, e)} 
//                                 className="text-gray-400 hover:text-purple-600 transition-colors p-1" 
//                                 title="Edit Terms"
//                               >
//                                 <Edit3 size={16} />
//                               </button>
//                             </div>
//                           </td>
//                         )}
//                     <td className="py-4 px-6 text-gray-600 font-medium">{new Date(agent.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
//                     <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
//                       <div className="flex items-center justify-end gap-2">
//                         {agent.status === 'pending' && (
//                           <>
//                             <button onClick={() => { setCommissionRate(70); setInternalNotes(""); setApprovalModalAgent(agent); }} disabled={processingId === agent._id} className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-600 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
//                               {processingId === agent._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Approve
//                             </button>
//                             <button onClick={() => handleStatusChange(agent._id, 'rejected')} disabled={processingId === agent._id} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
//                               {processingId === agent._id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Reject
//                             </button>
//                           </>
//                         )}
//                         {agent.status === 'active' && (
//                           <button onClick={() => handleStatusChange(agent._id, 'suspended')} disabled={processingId === agent._id} className="px-3 py-1.5 bg-white text-gray-600 border border-gray-300 hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
//                             {processingId === agent._id ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />} Suspend
//                           </button>
//                         )}
//                         {agent.status === 'suspended' && (
//                            <button onClick={() => handleStatusChange(agent._id, 'active')} disabled={processingId === agent._id} className="px-3 py-1.5 bg-white text-gray-600 border border-gray-300 hover:bg-green-50 hover:text-green-700 hover:border-green-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
//                            {processingId === agent._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Reactivate
//                          </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* ================================================== */}
//       {/* MODAL 1: APPROVE & SET TERMS */}
//       {/* ================================================== */}

//       {/* ================================================== */}
//       {/* MODAL: APPROVE & EDIT TERMS */}
//       {/* ================================================== */}
//       {approvalModalAgent && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200 border border-white/20">
            
//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-5 flex justify-between items-center text-white">
//               <div>
//                 <h3 className="font-bold text-lg flex items-center gap-2">
//                   {approvalModalAgent.status === 'pending' ? (
//                     <><CheckCircle2 size={20}/> Approve Agent</>
//                   ) : (
//                     <><Edit3 size={20}/> Edit Financial Terms</>
//                   )}
//                 </h3>
//                 <p className="text-purple-200 text-xs mt-0.5">
//                   Set terms for {approvalModalAgent.name}
//                 </p>
//               </div>
//               <button 
//                 onClick={() => setApprovalModalAgent(null)} 
//                 className="text-purple-200 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
//               >
//                 <X size={20}/>
//               </button>
//             </div>
            
//             {/* Modal Body */}
//             <div className="p-6 space-y-5 bg-slate-50">
              
//               {/* Agency Context */}
//               <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
//                 <div>
//                   <p className="text-[10px] font-black text-purple-600 uppercase tracking-wider">Agency Partner</p>
//                   <p className="font-bold text-slate-900">{approvalModalAgent.agencyName}</p>
//                 </div>
//                 <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
//                   <Building2 className="text-purple-400" size={20}/>
//                 </div>
//               </div>

//               {/* Commission Input */}
//               <div>
//                 <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
//                   <Percent size={14} className="text-purple-600"/> Commission Split (%) <span className="text-red-500">*</span>
//                 </label>
//                 <p className="text-[10px] text-slate-500 mb-2 leading-tight">Percentage of gross profit this agent will retain on confirmed bookings.</p>
//                 <div className="flex items-center gap-3">
//                   <input 
//                     type="number" 
//                     min="0" 
//                     max="100" 
//                     value={commissionRate} 
//                     onChange={(e) => setCommissionRate(Number(e.target.value))} 
//                     className="w-24 p-2.5 border border-slate-300 rounded-xl text-lg font-black focus:ring-2 focus:ring-purple-500 outline-none text-center text-purple-700 bg-white shadow-inner" 
//                   />
//                   <span className="text-slate-600 font-bold text-sm">% to Agent</span>
//                 </div>
//               </div>

//               {/* Internal Notes Input */}
//               <div>
//                 <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
//                   <FileText size={14} className="text-purple-600"/> Internal Notes (Optional)
//                 </label>
//                 <textarea 
//                   rows={3} 
//                   value={internalNotes} 
//                   onChange={(e) => setInternalNotes(e.target.value)} 
//                   placeholder="Add private notes about this partner..." 
//                   className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none shadow-inner bg-white"
//                 ></textarea>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
//               <button 
//                 onClick={() => setApprovalModalAgent(null)} 
//                 className="px-4 py-2 text-slate-600 text-sm font-bold hover:bg-slate-100 rounded-xl transition-colors"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleConfirmTerms} 
//                 className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-md shadow-purple-600/20 transition-transform active:scale-95 flex items-center gap-2"
//               >
//                 {approvalModalAgent.status === 'pending' ? 'Confirm Approval' : 'Save Changes'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* {approvalModalAgent && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200">
//             <div className="bg-purple-600 p-5 flex justify-between items-center text-white">
//               <div>
//                 <h3 className="font-bold text-lg flex items-center gap-2"><CheckCircle2 size={20}/> Approve Agent</h3>
//                 <p className="text-purple-200 text-xs mt-0.5">Set financial terms for {approvalModalAgent.name}</p>
//               </div>
//               <button onClick={() => setApprovalModalAgent(null)} className="text-purple-200 hover:text-white hover:bg-purple-500 p-1.5 rounded-lg transition-colors"><X size={20}/></button>
//             </div>
            
//             <div className="p-6 space-y-5">
//               <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-between">
//                 <div>
//                   <p className="text-[10px] font-black text-purple-600 uppercase tracking-wider">Agency Partner</p>
//                   <p className="font-bold text-slate-900">{approvalModalAgent.agencyName}</p>
//                 </div>
//                 <Building2 className="text-purple-300" size={24}/>
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5"><Percent size={14}/> Commission Split (%) <span className="text-red-500">*</span></label>
//                 <p className="text-[10px] text-slate-400 mb-2 leading-tight">Percentage of gross profit this agent will retain on confirmed bookings.</p>
//                 <div className="flex items-center gap-3">
//                   <input type="number" min="0" max="100" value={commissionRate} onChange={(e) => setCommissionRate(Number(e.target.value))} className="w-24 p-2.5 border border-slate-300 rounded-lg text-lg font-black focus:ring-2 focus:ring-purple-500 outline-none text-center text-purple-700 bg-purple-50" />
//                   <span className="text-slate-500 font-bold">% to Agent</span>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5"><FileText size={14}/> Internal Notes (Optional)</label>
//                 <textarea rows={3} value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} placeholder="Add private notes about this partner..." className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"></textarea>
//               </div>
//             </div>

//             <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
//               <button onClick={() => setApprovalModalAgent(null)} className="px-4 py-2 text-slate-600 text-sm font-bold hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
//               <button onClick={handleConfirmApproval} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-green-600/20 transition-transform active:scale-95 flex items-center gap-2">Confirm Approval</button>
//             </div>
//           </div>
//         </div>
//       )} */}

//       {/* ================================================== */}
//       {/* DRAWER: QUICK VIEW AGENT PROFILE */}
//       {/* ================================================== */}
//       {quickViewAgent && (
//         <>
//           {/* Overlay */}
//           <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setQuickViewAgent(null)} />
          
//           {/* Slide-out Panel */}
//           <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col translate-x-0">
            
//             <div className="h-48 bg-gradient-to-br from-slate-900 to-purple-900 p-6 relative">
//               <button onClick={() => setQuickViewAgent(null)} className="absolute top-4 right-4 text-white/50 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"><X size={20}/></button>
//               <div className="absolute top-25 left-6 flex items-end gap-4">
//                 <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg border border-slate-100 flex items-center justify-center text-purple-600">
//                   <Building2 size={36}/>
//                 </div>
//                 <div className="mb-5">
//                   <h2 className="text-xl font-black text-white">{quickViewAgent.agencyName}</h2>
//                   <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border mt-1
//                         ${quickViewAgent.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 
//                           quickViewAgent.status === 'pending' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : 
//                           'bg-red-500/20 text-red-300 border-red-500/30'}
//                       `}>
//                         {quickViewAgent.status}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6 pt-10 space-y-8">
              
//               {/* Agent Details */}
//               <section>
//                 <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Contact Information</h4>
//                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Users size={14}/></div>
//                     <div><p className="text-[10px] uppercase font-bold text-slate-500">Agent Name</p><p className="text-sm font-bold text-slate-900">{quickViewAgent.name}</p></div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Mail size={14}/></div>
//                     <div><p className="text-[10px] uppercase font-bold text-slate-500">Email Address</p><p className="text-sm font-bold text-slate-900">{quickViewAgent.email}</p></div>
//                   </div>
//                 </div>
//               </section>

//               {/* Terms (Only visible if active/suspended and terms exist) */}
//               {(quickViewAgent.status === 'active' || quickViewAgent.status === 'suspended') && quickViewAgent.commissionRate !== undefined && (
//                 <section>
//                   <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Financial Terms</h4>
//                   <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-bold text-slate-900">Commission Split</p>
//                       <p className="text-xs text-purple-600 font-medium mt-0.5">Standard YTD Rate</p>
//                     </div>
//                     <span className="text-2xl font-black text-purple-700 bg-white px-3 py-1 rounded-lg shadow-sm">{quickViewAgent.commissionRate}%</span>
//                   </div>
//                 </section>
//               )}

//               {/* Internal Notes */}
//               <section>
//                 <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Internal Notes</h4>
//                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-h-[100px]">
//                   {quickViewAgent.internalNotes ? (
//                     <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{quickViewAgent.internalNotes}</p>
//                   ) : (
//                     <p className="text-sm text-slate-400 italic">No notes have been added for this agent.</p>
//                   )}
//                 </div>
//               </section>
//             </div>
//           </div>
//         </>
//       )}

//     </div>
//     </d
//   );
// } 
















"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, XCircle, Ban, Building2, 
  Mail, Clock, Search, ShieldCheck, Loader2, X, Percent, FileText, Edit3
} from 'lucide-react';

// --- DATA INTERFACE ---
interface Agent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  agencyName: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  createdAt: string;
  commissionRate?: number;
  internalNotes?: string;
}

export default function AgentApprovalDashboard() {
  // --- STATE MANAGEMENT ---
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [approvalModalAgent, setApprovalModalAgent] = useState<Agent | null>(null);
  const [commissionRate, setCommissionRate] = useState<number>(70); // Default 70%
  const [internalNotes, setInternalNotes] = useState("");

  // Drawer State
  const [quickViewAgent, setQuickViewAgent] = useState<Agent | null>(null);

  // --- API CALLS ---
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/agents");
      const json = await res.json();
      if (json.success) setAgents(json.data);
    } catch (error) {
      console.error("Failed to load agents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAgents(); }, []);

  // --- HANDLERS ---
  
  // 1. Quick Status Updates (Reject / Suspend / Reactivate)
  const handleStatusChange = async (agentId: string, newStatus: string) => {
    const isConfirmed = confirm(`Are you sure you want to mark this agent as ${newStatus.toUpperCase()}?`);
    if (!isConfirmed) return;
    executeStatusUpdate(agentId, newStatus);
  };

  // 2. Open the Edit Modal for Active Agents
  const openEditModal = (agent: Agent, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the quick-view drawer from opening instead
    setCommissionRate(agent.commissionRate || 0);
    setInternalNotes(agent.internalNotes || "");
    setApprovalModalAgent(agent);
  };

  // 3. Submit Terms from the Modal (Works for Approving Pending AND Editing Active)
  const handleConfirmTerms = async () => {
    if (!approvalModalAgent) return;
    
    // If pending, make them active. If already active/suspended, keep current status.
    const newStatus = approvalModalAgent.status === 'pending' ? 'active' : approvalModalAgent.status;
    
    await executeStatusUpdate(approvalModalAgent._id, newStatus, commissionRate, internalNotes);
    setApprovalModalAgent(null); // Close Modal
  };

  // 4. Core Database Update Function
  const executeStatusUpdate = async (agentId: string, status: string, commRate?: number, notes?: string) => {
    try {
      setProcessingId(agentId);
      const payload: any = { agentId, status };
      if (commRate !== undefined) payload.commissionRate = commRate;
      if (notes !== undefined) payload.internalNotes = notes;

      const res = await fetch("/api/admin/agents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setAgents(prev => prev.map(agent => 
          agent._id === agentId 
            ? { ...agent, status: status as any, commissionRate: commRate ?? agent.commissionRate, internalNotes: notes ?? agent.internalNotes } 
            : agent
        ));
      } else {
        alert(json.message);
      }
    } catch (error) {
      alert("Failed to update status. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  // --- FILTERING ---
  const filteredAgents = agents.filter(agent => {
    if (activeTab === 'pending' && agent.status !== 'pending') return false;
    if (activeTab === 'active' && !['active', 'suspended'].includes(agent.status)) return false;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      (agent.name && agent.name.toLowerCase().includes(searchLower)) ||
      (agent.agencyName && agent.agencyName.toLowerCase().includes(searchLower)) ||
      (agent.email && agent.email.toLowerCase().includes(searchLower))
    );
  });

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <ShieldCheck className="text-purple-400" size={32} /> 
                Agent Approvals
              </h1>
              <p className="text-sm text-gray-300 mt-2 font-medium">Review and manage external B2B travel partners.</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search agency, name, email..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* --- TABS & TABLE CONTAINER --- */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            
            {/* Tabs */}
            <div className="flex gap-6 px-6 pt-6 border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('pending')} 
                className={`pb-4 px-2 text-sm font-bold tracking-wide transition-colors flex items-center gap-2 relative ${activeTab === 'pending' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-800'}`}
              >
                <Clock size={18} /> Pending Requests
                {activeTab === 'pending' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-md"></span>}
                {agents.filter(a => a.status === 'pending').length > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">
                    {agents.filter(a => a.status === 'pending').length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('active')} 
                className={`pb-4 px-2 text-sm font-bold tracking-wide transition-colors flex items-center gap-2 relative ${activeTab === 'active' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-800'}`}
              >
                <Users size={18} /> Active Directory
                {activeTab === 'active' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-md"></span>}
              </button>
            </div>

            {/* Main Table */}
            {loading ? (
              <div className="p-16 flex justify-center items-center text-gray-500">
                <Loader2 className="animate-spin mr-2" size={24} /> Loading partners...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-200 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-5 px-6 font-bold">Agency Name</th>
                      <th className="py-5 px-6 font-bold">Agent Contact</th>
                      <th className="py-5 px-6 font-bold">Status</th>
                      {activeTab === 'active' && <th className="py-5 px-6 font-bold text-center">Comm. Split</th>}
                      <th className="py-5 px-6 font-bold">Reg. Date</th>
                      <th className="py-5 px-6 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredAgents.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400 font-medium text-base">
                          No agents found in this tab.
                        </td>
                      </tr>
                    )}

                    {filteredAgents.map((agent) => (
                      <tr key={agent._id} onClick={() => setQuickViewAgent(agent)} className="hover:bg-purple-50/30 transition-colors cursor-pointer group">
                        
                        {/* Agency Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center border border-purple-200 flex-shrink-0 group-hover:scale-105 transition-transform">
                              <Building2 size={18} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-base group-hover:text-purple-700 transition-colors">{agent.agencyName || "Unknown Agency"}</p>
                              <p className="text-xs text-gray-500 font-medium tracking-wide">ID: {agent._id.slice(-6).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-4 px-6">
                          <p className="font-bold text-gray-800">{agent.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Mail size={12} /> {agent.email}</p>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${agent.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : agent.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            {agent.status}
                          </span>
                        </td>

                        {/* Commission Split (Active Only) */}
                        {activeTab === 'active' && (
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 shadow-sm">
                                {agent.commissionRate || 0}% 
                              </span>
                              <button 
                                onClick={(e) => openEditModal(agent, e)} 
                                className="text-gray-400 hover:text-purple-600 transition-colors p-1" 
                                title="Edit Terms"
                              >
                                <Edit3 size={16} />
                              </button>
                            </div>
                          </td>
                        )}

                        {/* Registration Date */}
                        <td className="py-4 px-6 text-gray-600 font-medium">
                          {new Date(agent.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            {agent.status === 'pending' && (
                              <>
                                <button onClick={() => { setCommissionRate(70); setInternalNotes(""); setApprovalModalAgent(agent); }} disabled={processingId === agent._id} className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 hover:bg-green-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5">
                                  {processingId === agent._id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Approve
                                </button>
                                <button onClick={() => handleStatusChange(agent._id, 'rejected')} disabled={processingId === agent._id} className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5">
                                  {processingId === agent._id ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />} Reject
                                </button>
                              </>
                            )}
                            {agent.status === 'active' && (
                              <button onClick={() => handleStatusChange(agent._id, 'suspended')} disabled={processingId === agent._id} className="px-4 py-2 bg-white text-gray-600 border border-gray-300 hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5">
                                {processingId === agent._id ? <Loader2 size={16} className="animate-spin" /> : <Ban size={16} />} Suspend
                              </button>
                            )}
                            {agent.status === 'suspended' && (
                               <button onClick={() => handleStatusChange(agent._id, 'active')} disabled={processingId === agent._id} className="px-4 py-2 bg-white text-gray-600 border border-gray-300 hover:bg-green-50 hover:text-green-700 hover:border-green-200 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5">
                               {processingId === agent._id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Reactivate
                             </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* MODAL: APPROVE PENDING & EDIT ACTIVE TERMS         */}
      {/* ================================================== */}
      {approvalModalAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px] overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200 border border-white/20">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-5 flex justify-between items-center text-white">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {approvalModalAgent.status === 'pending' ? (
                    <><CheckCircle2 size={20}/> Approve Agent</>
                  ) : (
                    <><Edit3 size={20}/> Edit Financial Terms</>
                  )}
                </h3>
                <p className="text-purple-200 text-xs mt-0.5">
                  Set terms for {approvalModalAgent.name}
                </p>
              </div>
              <button 
                onClick={() => setApprovalModalAgent(null)} 
                className="text-purple-200 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X size={20}/>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-5 bg-slate-50">
              
              <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[10px] font-black text-purple-600 uppercase tracking-wider">Agency Partner</p>
                  <p className="font-bold text-slate-900">{approvalModalAgent.agencyName}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Building2 className="text-purple-400" size={20}/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Percent size={14} className="text-purple-600"/> Commission Split (%) <span className="text-red-500">*</span>
                </label>
                <p className="text-[10px] text-slate-500 mb-2 leading-tight">Percentage of gross profit this agent will retain on confirmed bookings.</p>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={commissionRate} 
                    onChange={(e) => setCommissionRate(Number(e.target.value))} 
                    className="w-24 p-2.5 border border-slate-300 rounded-xl text-lg font-black focus:ring-2 focus:ring-purple-500 outline-none text-center text-purple-700 bg-white shadow-inner" 
                  />
                  <span className="text-slate-600 font-bold text-sm">% to Agent</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FileText size={14} className="text-purple-600"/> Internal Notes (Optional)
                </label>
                <textarea 
                  rows={3} 
                  value={internalNotes} 
                  onChange={(e) => setInternalNotes(e.target.value)} 
                  placeholder="Add private notes about this partner..." 
                  className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none shadow-inner bg-white"
                ></textarea>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
              <button 
                onClick={() => setApprovalModalAgent(null)} 
                className="px-4 py-2 text-slate-600 text-sm font-bold hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmTerms} 
                disabled={processingId === approvalModalAgent._id}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-md shadow-purple-600/20 transition-transform active:scale-95 flex items-center gap-2"
              >
                {processingId === approvalModalAgent._id ? <Loader2 size={16} className="animate-spin" /> : null}
                {approvalModalAgent.status === 'pending' ? 'Confirm Approval' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* DRAWER: QUICK VIEW AGENT PROFILE                   */}
      {/* ================================================== */}
      {quickViewAgent && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setQuickViewAgent(null)} />
          
          {/* Slide-out Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col translate-x-0">
            
            <div className="h-48 bg-gradient-to-br from-slate-900 to-purple-900 p-6 relative">
              <button onClick={() => setQuickViewAgent(null)} className="absolute top-4 right-4 text-white/50 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                <X size={20}/>
              </button>
              <div className="absolute top-20 left-6 flex items-end gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg border border-slate-100 flex items-center justify-center text-purple-600">
                  <Building2 size={36}/>
                </div>
                <div className="mb-2">
                  <h2 className="text-xl font-black text-white">{quickViewAgent.agencyName}</h2>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border mt-1
                        ${quickViewAgent.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 
                          quickViewAgent.status === 'pending' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : 
                          'bg-red-500/20 text-red-300 border-red-500/30'}
                      `}>
                        {quickViewAgent.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pt-10 space-y-8">
              
              {/* Agent Details */}
              <section>
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Contact Information</h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Users size={14}/></div>
                    <div><p className="text-[10px] uppercase font-bold text-slate-500">Agent Name</p><p className="text-sm font-bold text-slate-900">{quickViewAgent.name}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Mail size={14}/></div>
                    <div><p className="text-[10px] uppercase font-bold text-slate-500">Email Address</p><p className="text-sm font-bold text-slate-900">{quickViewAgent.email}</p></div>
                  </div>
                </div>
              </section>

              {/* Terms (Only visible if active/suspended and terms exist) */}
              {(quickViewAgent.status === 'active' || quickViewAgent.status === 'suspended') && quickViewAgent.commissionRate !== undefined && (
                <section>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Financial Terms</h4>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Commission Split</p>
                      <p className="text-xs text-purple-600 font-medium mt-0.5">Standard YTD Rate</p>
                    </div>
                    <span className="text-2xl font-black text-purple-700 bg-white px-3 py-1 rounded-lg shadow-sm border border-purple-100">{quickViewAgent.commissionRate}%</span>
                  </div>
                </section>
              )}

              {/* Internal Notes */}
              <section>
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Internal Notes</h4>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-h-[100px]">
                  {quickViewAgent.internalNotes ? (
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{quickViewAgent.internalNotes}</p>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No notes have been added for this agent.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </>
      )}

    </div>
  );
}