
// "use client";

// import React, { useState, useEffect } from 'react';
// import { 
//   Users, Plus, Mail, Shield, Briefcase, 
//   Search, Loader2, X, CheckCircle2, UserPlus, Target,
//   Edit2, Ban, Trash2, Power , Phone, Lock
// } from 'lucide-react';

// interface Employee {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
//   department: string;
//   status: string;
//   monthlyTarget: number;
//   lastLogin?: string;
//   phone?: string;
//   position?: string;
// }

// export default function EmployeesPage() {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [processingId, setProcessingId] = useState<string | null>(null);
  
//   // Modal States
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [submitLoading, setSubmitLoading] = useState(false);
//   const [error, setError] = useState("");
  
//   // Form States
//   const [formData, setFormData] = useState({
//     name: "", email: "", password: "", role: "employee", 
//     department: "", position: "", phone: "", monthlyTarget: 0
//   });

//   const [editData, setEditData] = useState<Partial<Employee>>({});

//   // 1. Fetch Employees
//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/employees");
//       const json = await res.json();
//       if (json.success) setEmployees(json.data);
//     } catch (error) {
//       console.error("Failed to load employees:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchEmployees(); }, []);

//   // 2. Add Employee
//   const handleAddEmployee = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/employees", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const json = await res.json();
//       if (json.success) {
//         setIsAddModalOpen(false);
//         setFormData({ name: "", email: "", password: "", role: "employee", department: "", position: "", phone: "", monthlyTarget: 0 });
//         fetchEmployees();
//       } else {
//         setError(json.message);
//       }
//     } catch (err) { setError("Something went wrong."); } 
//     finally { setSubmitLoading(false); }
//   };

//   // 👇 NEW: 3. Edit Employee
//   const openEditModal = (emp: Employee) => {
//       setEditData(emp);
//       setIsEditModalOpen(true);
//   };

//   const handleEditEmployee = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitLoading(true);
//     try {
//       const res = await fetch("/api/employees", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id: editData._id, ...editData }),
//       });
//       if (res.ok) {
//         setIsEditModalOpen(false);
//         fetchEmployees();
//       } else {
//           alert("Failed to update employee.");
//       }
//     } catch (err) { console.error(err); } 
//     finally { setSubmitLoading(false); }
//   };

//   // 👇 NEW: 4. Change Status (Suspend / Reactivate)
//   const handleStatusChange = async (id: string, newStatus: string) => {
//       setProcessingId(id);
//       try {
//         const res = await fetch("/api/employees", {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ id, status: newStatus }),
//         });
//         if (res.ok) fetchEmployees();
//       } catch (err) { console.error(err); } 
//       finally { setProcessingId(null); }
//   };

//   // 👇 NEW: 5. Delete Employee
//   const handleDelete = async (id: string) => {
//       if (!confirm("Are you sure you want to permanently delete this employee?")) return;
//       setProcessingId(id);
//       try {
//         const res = await fetch(`/api/employees?id=${id}`, { method: "DELETE" });
//         if (res.ok) fetchEmployees();
//       } catch (err) { console.error(err); } 
//       finally { setProcessingId(null); }
//   };

//   // Filter Data
//   const filteredEmployees = employees.filter(emp => 
//     (emp.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
//     (emp.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
//     (emp.department || "").toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     // 👇 NEW: Dark Blue/Black Ambience Background
//     <div className="min-h-screen relative p-8 font-sans height-hidden">
      
//       {/* Background Image & Overlay */}
//       <div className="absolute inset-0 z-0">
//           {/* Use any high-quality unsplash image here. I used a dark mountain landscape */}
//           <img 
//             src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" 
//             alt="background" 
//             className="w-full h-full object-cover"
//           />
//           {/* Heavy Dark Overlay to make it moody */}
//           <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md"></div>
//       </div>

//       {/* Main Content Container */}
//       <div className="relative z-10 max-w-8xl mx-auto">

//           {/* Header */}
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//             <div>
//               <h1 className="text-3xl font-bold text-white flex items-center gap-3">
//                 <Users className="text-blue-400" size={32} /> 
//                 Internal Team
//               </h1>
//               <p className="text-sm text-gray-300 mt-1 ml-11">Manage TRAVDEK staff, roles, and targets.</p>
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="relative w-full md:w-64">
//                 <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//                 <input 
//                   type="text" 
//                   placeholder="Search staff..." 
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all"
//                 />
//               </div>
//               <button 
//                 onClick={() => setIsAddModalOpen(true)}
//                 className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-colors whitespace-nowrap"
//               >
//                 <Plus size={16} /> Add Employee
//               </button>
//             </div>
//           </div>

//           {/* 👇 NEW: Glassmorphism Table */}
//         {/* Added max-h-[75vh] and overflow-y-auto to create a scrollable table area */}
//           <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-2xl max-h-[75vh] flex flex-col">
//             {loading ? (
//               <div className="p-16 flex flex-col justify-center items-center text-blue-200">
//                 <Loader2 className="animate-spin mb-4" size={32} />
//                 <p>Loading directory...</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead className="bg-white/5 text-gray-300 border-b border-white/10 text-xs uppercase tracking-wider">
//                     <tr>
//                       <th className="py-5 px-6 font-bold">Employee</th>
//                       <th className="py-5 px-6 font-bold">Role / Dept</th>
//                       <th className="py-5 px-6 font-bold">Monthly Target</th>
//                       <th className="py-5 px-6 font-bold">Status</th>
//                       <th className="py-5 px-6 font-bold text-right">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-white/5 text-sm">
                    
//                     {filteredEmployees.length === 0 && (
//                       <tr>
//                         <td colSpan={5} className="py-10 text-center text-gray-400 font-medium">
//                           No employees found.
//                         </td>
//                       </tr>
//                     )}

//                     {filteredEmployees.map((emp) => (
//                       <tr key={emp._id} className="hover:bg-white/5 transition-colors">
                        
                      
//                         <td className="py-4 px-6">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 flex items-center justify-center font-bold text-lg">
//                               {emp.name.charAt(0).toUpperCase()}
//                             </div>
//                             <div>
//                               <p className="font-bold text-white text-base">{emp.name}</p>
//                               <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
//                                 <Mail size={12} /> {emp.email}
//                               </p>
//                             </div>
//                           </div>
//                         </td>

//                         <td className="py-4 px-6">
//                           <div className="flex flex-col gap-1">
//                             <span className={`w-fit inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
//                               ${emp.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/10 text-gray-300 border border-white/20'}
//                             `}>
//                               <Shield size={10} /> {emp.role}
//                             </span>
//                             <span className="text-xs text-gray-400 flex items-center gap-1">
//                               <Briefcase size={12} className="text-gray-500"/> {emp.department || "Unassigned"}
//                             </span>
//                           </div>
//                         </td>

                
//                         <td className="py-4 px-6">
//                           <div className="flex items-center gap-1 font-mono font-bold text-blue-200">
//                             <Target size={14} className="text-blue-400 opacity-70" />
//                             ${emp.monthlyTarget.toLocaleString()}
//                           </div>
//                         </td>

                      
//                         <td className="py-4 px-6">
//                           <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
//                             ${emp.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}
//                           `}>
//                             {emp.status}
//                           </span>
//                         </td>

                       
//                         <td className="py-4 px-6 text-right">
//                             <div className="flex items-center justify-end gap-2">
                                
//                                 <button onClick={() => openEditModal(emp)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit Employee">
//                                     <Edit2 size={16} />
//                                 </button>
                              
//                                 {emp.status === 'active' ? (
//                                     <button onClick={() => handleStatusChange(emp._id, 'suspended')} disabled={processingId === emp._id} className="p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors" title="Suspend Access">
//                                         {processingId === emp._id ? <Loader2 size={16} className="animate-spin" /> : <Ban size={16} />}
//                                     </button>
//                                 ) : (
//                                     <button onClick={() => handleStatusChange(emp._id, 'active')} disabled={processingId === emp._id} className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors" title="Reactivate Access">
//                                         {processingId === emp._id ? <Loader2 size={16} className="animate-spin" /> : <Power size={16} />}
//                                     </button>
//                                 )}

                            
//                                 <button onClick={() => handleDelete(emp._id)} disabled={processingId === emp._id} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Permanently Delete">
//                                     {processingId === emp._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
//                                 </button>
//                             </div>
//                         </td>

//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//       </div>

   


//      {/* --- ADD EMPLOYEE MODAL (Exact Match to Reference Image) --- */}
//       {isAddModalOpen && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[900px] overflow-hidden flex flex-col">
            
//             {/* Header section */}
//             <div className="px-8 pt-8 pb-4 flex justify-between items-start bg-white shrink-0">
//               <div className="flex items-center gap-4">
//                 {/* Logo matches the layout of the reference */}
//                 {/* <div className="w-12 h-12 flex flex-col items-center justify-center">
//                     <img src="/logo/Travdek-white.svg" alt="Travdek" className="w-10 h-10 object-contain invert grayscale" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
//                 </div> */}
//                 <div className="flex flex-col justify-center">
//                   <h2 className="text-[22px] font-black text-[#0f172a] tracking-wide uppercase leading-tight">ADD NEW EMPLOYEE</h2>
//                   <p className="text-[13px] font-medium text-gray-500 uppercase tracking-widest leading-tight">Internal Team Directory</p>
//                 </div>
//               </div>
//               <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-800 transition-colors p-1"><X size={24} strokeWidth={1.5} /></button>
//             </div>

//             {/* Subtle Divider */}
//             <div className="px-8">
//                <hr className="border-[#e5e7eb]" />
//             </div>
            
//             <div className="overflow-y-auto px-8 py-6 custom-scrollbar">
//                 {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">{error}</div>}
                
//                 <form id="add-employee-form" onSubmit={handleAddEmployee} className="space-y-4">
                  
//                   {/* Row 1 */}
//                   <div className="grid grid-cols-2 gap-4">
//                     {/* Full Name */}
//                     <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
//                       <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0">
//                         <Users size={18} strokeWidth={2} />
//                       </div>
//                       <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
//                              className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" 
//                              placeholder="Full Name" />
//                     </div>
                    
//                     {/* Position (Visually placed where Last Name is in image) */}
//                     <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
//                       <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0">
//                          <UserPlus size={18} strokeWidth={2} />
//                       </div>
//                       <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} 
//                              className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" 
//                              placeholder="Position / Title" />
//                     </div>
//                   </div>

//                   {/* Row 2 */}
//                   <div className="grid grid-cols-2 gap-4">
//                     {/* Email */}
//                     <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
//                       <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0">
//                         <Mail size={18} strokeWidth={2} />
//                       </div>
//                       <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
//                              className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" 
//                              placeholder="Email Address" />
//                     </div>

//                     {/* Phone */}
//                     <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
//                       <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0">
//                         <Phone size={18} strokeWidth={2} />
//                       </div>
//                       <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} 
//                              className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" 
//                              placeholder="Phone Number" />
//                     </div>
//                   </div>

//                   {/* Row 3 */}
//                   <div className="grid grid-cols-2 gap-4">
//                     {/* Role */}
//                     <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm relative">
//                       <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0 z-10">
//                          <Shield size={18} strokeWidth={2} />
//                       </div>
//                       <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} 
//                               className="flex-1 py-3 pl-3 pr-10 bg-transparent text-[15px] text-gray-800 outline-none font-medium appearance-none cursor-pointer z-20">
//                         <option value="employee">Role (Standard Employee)</option>
//                         <option value="admin">Role (Super Admin)</option>
//                       </select>
//                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 z-10">
//                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
//                       </div>
//                     </div>

//                     {/* Password */}
//                     <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm relative">
//                       <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0">
//                         <Lock size={18} strokeWidth={2} />
//                       </div>
//                       <input type="password" required minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
//                              className="flex-1 py-3 pl-3 pr-10 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" 
//                              placeholder="Temporary Password" />
//                       <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
//                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Row 4 */}
//                   <div className="grid grid-cols-2 gap-4">
//                     {/* Target */}
//                     <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
//                       <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0">
//                         <Target size={18} strokeWidth={2} />
//                       </div>
//                       <input type="number" value={formData.monthlyTarget || ""} onChange={e => setFormData({...formData, monthlyTarget: Number(e.target.value)})} 
//                              className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" 
//                              placeholder="Monthly Sales Target" />
//                     </div>

//                     {/* Department */}
//                     <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
//                       <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0">
//                         {/* Using Medal icon for "Tier/Department" to match visual */}
//                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
//                       </div>
//                       <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} 
//                              className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" 
//                              placeholder="Department" />
//                     </div>
//                   </div>
//                 </form>
//             </div>

//             {/* Footer section */}
//             <div className="px-8 py-6 flex gap-6 justify-end items-center shrink-0">
//                <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-gray-400 font-bold text-[13px] hover:text-gray-700 transition-colors uppercase tracking-widest">
//                    Cancel
//                </button>
//                <button type="submit" form="add-employee-form" disabled={submitLoading} className="px-6 py-3 bg-[#0a3d8c] text-white font-bold text-[13px] rounded-[8px] hover:bg-[#072c66] shadow-md disabled:opacity-50 flex items-center gap-2 transition-all uppercase tracking-widest">
//                   {submitLoading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <>Create Account <span className="text-blue-200 ml-1 font-normal text-lg leading-none">↗</span></>}
//                </button>
//             </div>
//           </div>
//         </div>
//       )}


// {/* 👇 NEW: EDIT EMPLOYEE MODAL (Premium Card Design) */}
//       {isEditModalOpen && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-[#f8f9fa] rounded-[20px] shadow-2xl w-full max-w-[800px] overflow-hidden flex flex-col">
            
//             {/* Header section */}
//             <div className="px-8 pt-8 pb-4 flex justify-between items-start bg-white shrink-0">
//               <div className="flex items-center gap-4">
//                 {/* Logo Icon Placeholder */}
//                 <div className="w-12 h-12 flex flex-col items-center justify-center bg-blue-50 rounded-full border border-blue-100">
//                     <Edit2 className="text-[#0a3d8c]" size={24} strokeWidth={2} />
//                 </div>
//                 <div className="flex flex-col justify-center">
//                   <h2 className="text-[22px] font-black text-[#0f172a] tracking-wide uppercase leading-tight">EDIT EMPLOYEE</h2>
//                   <p className="text-[13px] font-medium text-gray-500 uppercase tracking-widest leading-tight">Update Team Member Profile</p>
//                 </div>
//               </div>
//               <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-800 transition-colors p-1"><X size={24} strokeWidth={1.5} /></button>
//             </div>

//             {/* Subtle Divider */}
//             <div className="px-8">
//                <hr className="border-[#e5e7eb]" />
//             </div>
            
//             <div className="overflow-y-auto px-8 py-6 custom-scrollbar">
//                 <form id="edit-employee-form" onSubmit={handleEditEmployee} className="space-y-4">
                  
//                   {/* Row 1: Name & Position */}
//                   <div className="grid grid-cols-2 gap-4">
//                     {/* Full Name */}
//                     <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
//                       <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0">
//                         <Users size={18} strokeWidth={2} />
//                       </div>
//                       <input type="text" required value={editData.name || ""} onChange={e => setEditData({...editData, name: e.target.value})} 
//                              className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" 
//                              placeholder="Full Name" />
//                     </div>
                    
//                     {/* Position */}
//                     <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
//                       <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0">
//                          <UserPlus size={18} strokeWidth={2} />
//                       </div>
//                       <input type="text" value={editData.position || ""} onChange={e => setEditData({...editData, position: e.target.value})} 
//                              className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" 
//                              placeholder="Position / Title" />
//                     </div>
//                   </div>

//                   {/* Row 2: Email & Phone */}
//                   <div className="grid grid-cols-2 gap-4">
//                     {/* Email */}
//                     <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
//                       <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0">
//                         <Mail size={18} strokeWidth={2} />
//                       </div>
//                       <input type="email" required value={editData.email || ""} onChange={e => setEditData({...editData, email: e.target.value})} 
//                              className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" 
//                              placeholder="Email Address" />
//                     </div>

//                     {/* Phone */}
//                     <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
//                       <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0">
//                         <Phone size={18} strokeWidth={2} />
//                       </div>
//                       <input type="text" value={editData.phone || ""} onChange={e => setEditData({...editData, phone: e.target.value})} 
//                              className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" 
//                              placeholder="Phone Number" />
//                     </div>
//                   </div>

//                   {/* Row 3: Role & Department */}
//                   <div className="grid grid-cols-2 gap-4">
//                     {/* Role */}
//                     <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm relative">
//                       <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0 z-10">
//                          <Shield size={18} strokeWidth={2} />
//                       </div>
//                       <select value={editData.role || "employee"} onChange={e => setEditData({...editData, role: e.target.value})} 
//                               className="flex-1 py-3 pl-3 pr-10 bg-transparent text-[15px] text-gray-800 outline-none font-medium appearance-none cursor-pointer z-20">
//                         <option value="employee">Role (Standard Employee)</option>
//                         <option value="admin">Role (Super Admin)</option>
//                       </select>
//                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 z-10">
//                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
//                       </div>
//                     </div>

//                     {/* Department */}
//                     <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
//                       <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0">
//                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
//                       </div>
//                       <input type="text" value={editData.department || ""} onChange={e => setEditData({...editData, department: e.target.value})} 
//                              className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" 
//                              placeholder="Department" />
//                     </div>
//                   </div>

//                   {/* Row 4: Target (Single Column) */}
//                   <div className="grid grid-cols-2 gap-4">
//                     {/* Target */}
//                     <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
//                       <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0">
//                         <Target size={18} strokeWidth={2} />
//                       </div>
//                       <input type="number" value={editData.monthlyTarget || ""} onChange={e => setEditData({...editData, monthlyTarget: Number(e.target.value)})} 
//                              className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" 
//                              placeholder="Monthly Sales Target" />
//                     </div>
//                     {/* Empty div to maintain grid structure */}
//                     <div></div>
//                   </div>
//                 </form>
//             </div>

//             {/* Footer section */}
//             <div className="px-8 py-6 flex gap-6 justify-end items-center shrink-0">
//                <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-gray-400 font-bold text-[13px] hover:text-gray-700 transition-colors uppercase tracking-widest">
//                    Cancel
//                </button>
//                <button type="submit" form="edit-employee-form" disabled={submitLoading} className="px-6 py-3 bg-[#0a3d8c] text-white font-bold text-[13px] rounded-[8px] hover:bg-[#072c66] shadow-md disabled:opacity-50 flex items-center gap-2 transition-all uppercase tracking-widest">
//                   {submitLoading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <>Save Changes <span className="text-blue-200 ml-1 font-normal text-lg leading-none">↗</span></>}
//                </button>
//             </div>
//           </div>
//         </div>
//       )}


//     </div>
//   );
// }











"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, Plus, Mail, Shield, Briefcase, Search, Loader2, X, CheckCircle2, 
  UserPlus, Target, Edit2, Ban, Trash2, Power, Phone, Lock, 
  Grid, List, Download, Upload, ArrowRightLeft, ChevronLeft, ChevronRight, Filter
} from 'lucide-react';

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  monthlyTarget: number;
  employmentType: string;
  phone?: string;
  position?: string;
  createdAt: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // --- UI & Filter States ---
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  
  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --- Modal States ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // --- Form Data States ---
  const initialFormState = { name: "", email: "", password: "", role: "employee", department: "", position: "", phone: "", monthlyTarget: 0, employmentType: "Fulltime" };
  const [formData, setFormData] = useState(initialFormState);
  const [editData, setEditData] = useState<Partial<Employee>>({});
  const [transferData, setTransferData] = useState({ id: "", newDepartment: "", newRole: "" });

  // --- 1. Fetch Data ---
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/employees");
      const json = await res.json();
      if (json.success) setEmployees(json.data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };
  useEffect(() => { fetchEmployees(); }, []);

  // --- 2. Advanced Filtering & Pagination Logic ---
  // const filteredEmployees = useMemo(() => {
  //   return employees.filter(emp => {
  //     const matchesSearch = (emp.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
  //                           (emp.email || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
  //                           (emp.department || "").toLowerCase().includes(searchQuery.toLowerCase());
  //     const matchesRole = filterRole === "All" || emp.role === filterRole;
  //     const matchesStatus = filterStatus === "All" || emp.status === filterStatus.toLowerCase();
  //     const matchesType = filterType === "All" || emp.employmentType === filterType;
  //     return matchesSearch && matchesRole && matchesStatus && matchesType;
  //   });
  // }, [employees, searchQuery, filterRole, filterStatus, filterType]);


  // --- 2. Advanced Filtering & Pagination Logic ---
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Search Check
      const matchesSearch = (emp.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (emp.email || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (emp.department || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      // Role Check (Safe lowercase comparison)
      const matchesRole = filterRole === "All" || (emp.role || "").toLowerCase() === filterRole.toLowerCase();
      
      // Status Check (Safe lowercase comparison)
      const matchesStatus = filterStatus === "All" || (emp.status || "").toLowerCase() === filterStatus.toLowerCase();
      
      // Type Check (Fallback to 'Fulltime' if undefined for old employees)
      const matchesType = filterType === "All" || (emp.employmentType || "Fulltime").toLowerCase() === filterType.toLowerCase();
      
      return matchesSearch && matchesRole && matchesStatus && matchesType;
    });
  }, [employees, searchQuery, filterRole, filterStatus, filterType]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 if filters change
  useEffect(() => { setCurrentPage(1); }, [searchQuery, filterRole, filterStatus, filterType]);

  // --- 3. Metrics Calculation ---
  const metrics = useMemo(() => {
    const active = employees.filter(e => e.status === 'active').length;
    const contract = employees.filter(e => e.employmentType === 'Contract').length;
    const departments = new Set(employees.map(e => e.department).filter(Boolean)).size;
    return { total: employees.length, active, contract, departments };
  }, [employees]);

  // --- 4. API Handlers ---
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitLoading(true); setError("");
    try {
      const res = await fetch("/api/employees", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const json = await res.json();
      if (json.success) { setIsAddModalOpen(false); setFormData(initialFormState); fetchEmployees(); } 
      else setError(json.message);
    } catch (err) { setError("Something went wrong."); } finally { setSubmitLoading(false); }
  };

  const handleEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitLoading(true);
    try {
      const res = await fetch("/api/employees", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editData._id, ...editData }) });
      if (res.ok) { setIsEditModalOpen(false); fetchEmployees(); } else alert("Failed to update.");
    } catch (err) { console.error(err); } finally { setSubmitLoading(false); }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitLoading(true);
    try {
      const res = await fetch("/api/employees", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: transferData.id, department: transferData.newDepartment, role: transferData.newRole }) });
      if (res.ok) { setIsTransferModalOpen(false); fetchEmployees(); } else alert("Transfer failed.");
    } catch (err) { console.error(err); } finally { setSubmitLoading(false); }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
      setProcessingId(id);
      try { await fetch("/api/employees", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: newStatus }) }); fetchEmployees(); } 
      catch (err) { console.error(err); } finally { setProcessingId(null); }
  };

  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to permanently delete this employee?")) return;
      setProcessingId(id);
      try { await fetch(`/api/employees?id=${id}`, { method: "DELETE" }); fetchEmployees(); } 
      catch (err) { console.error(err); } finally { setProcessingId(null); }
  };

  // --- 5. Import / Export Handlers ---
  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Role", "Department", "Position", "Phone", "Employment Type", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredEmployees.map(e => `"${e.name}","${e.email}","${e.role}","${e.department || ''}","${e.position || ''}","${e.phone || ''}","${e.employmentType}","${e.status}"`)
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `travdek_employees_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''));
        const newEmployees = rows.slice(1).map(row => {
          const values = row.split(',').map(v => v.trim().replace(/["']/g, ''));
          const emp: any = { password: "Travdek@123" }; // Default password for imported users
          headers.forEach((h, i) => { if (h === 'name') emp.name = values[i]; else if (h === 'email') emp.email = values[i]; else if (h === 'role') emp.role = values[i]; else if (h === 'department') emp.department = values[i]; else if (h === 'position') emp.position = values[i]; else if (h === 'employment type') emp.employmentType = values[i]; else if (h === 'phone') emp.phone = values[i]; });
          return emp;
        }).filter(emp => emp.name && emp.email);

        if(newEmployees.length === 0) return alert("No valid data found in CSV.");
        
        setLoading(true);
        const res = await fetch("/api/employees", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newEmployees) });
        const json = await res.json();
        if (json.success) { alert(json.message); fetchEmployees(); } else alert(json.message);
      } catch (err) { alert("Error parsing CSV file."); } finally { setLoading(false); if(fileInputRef.current) fileInputRef.current.value = ""; }
    };
    reader.readAsText(file);
  };

  // Helper for visual IDs
  const getEmpId = (id: string) => `#EMP-${id.substring(id.length - 4).toUpperCase()}`;

  return (
    <div className="min-h-screen relative p-8 font-sans">
      
      {/* Background & Overlay */}
      <div className="fixed inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" alt="bg" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0f172a]/85 backdrop-blur-md"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto flex flex-col h-[calc(100vh-4rem)]">
          
          {/* --- TOP METRICS HEADER --- */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight"><Users className="text-blue-400" size={32} />Internal Team</h1>
              <p className="text-sm text-gray-400 mt-1 ml-11 flex items-center gap-2">Active: <span className="text-green-400 font-bold">{metrics.active}</span> | Inactive: <span className="text-red-400 font-bold">{metrics.total - metrics.active}</span></p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 backdrop-blur-sm"><p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Employees</p><p className="text-xl font-black text-white">{metrics.total}</p></div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 backdrop-blur-sm"><p className="text-xs text-gray-400 font-bold uppercase mb-1">Contract Staff</p><p className="text-xl font-black text-orange-400">{metrics.contract}</p></div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 backdrop-blur-sm"><p className="text-xs text-gray-400 font-bold uppercase mb-1">Departments</p><p className="text-xl font-black text-blue-400">{metrics.departments}</p></div>
            </div>
          </div>

          {/* --- TOOLBAR (Filters, Import/Export, Add) --- */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-6 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 shadow-xl shrink-0">
            
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input type="text" placeholder="Search employees..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500" />
              </div>
              {/* Filters */}
              <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-lg px-3 py-2">
                <Filter size={14} className="text-gray-400" />
                <select value={filterType} onChange={e=>setFilterType(e.target.value)} className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer"><option value="All">All Types</option><option value="Fulltime">Fulltime</option><option value="Contract">Contract</option></select>
              </div>
              <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-lg px-3 py-2">
                <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer"><option value="All">All Status</option><option value="Active">Active</option><option value="Suspended">Suspended</option></select>
              </div>
              <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-lg px-3 py-2">
                <select value={filterRole} onChange={e=>setFilterRole(e.target.value)} className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer"><option value="All">All Roles</option><option value="admin">Admin</option><option value="employee">Employee</option></select>
              </div>
            </div>

            <div className="flex items-center gap-3">
               {/* View Toggles */}
               <div className="flex bg-black/20 border border-white/10 rounded-lg p-1">
                 <button onClick={()=>setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-white'}`}><List size={18}/></button>
                 <button onClick={()=>setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-white'}`}><Grid size={18}/></button>
               </div>
               {/* Actions */}
               <button onClick={()=>setIsTransferModalOpen(true)} className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white px-3 py-2 border border-white/10 rounded-lg bg-white/5 transition-colors"><ArrowRightLeft size={14}/> Transfer</button>
               <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImportCSV} className="hidden" />
               <button onClick={()=>fileInputRef.current?.click()} className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white px-3 py-2 border border-white/10 rounded-lg bg-white/5 transition-colors"><Upload size={14}/> Import</button>
               <button onClick={handleExportCSV} className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white px-3 py-2 border border-white/10 rounded-lg bg-white/5 transition-colors"><Download size={14}/> Export</button>
               <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-colors"><UserPlus size={16} /> Add Employee</button>
            </div>
          </div>

          {/* --- MAIN CONTENT AREA --- */}
          {loading ? (
             <div className="flex-1 flex flex-col justify-center items-center text-blue-200"><Loader2 className="animate-spin mb-4" size={40} /><p>Loading enterprise directory...</p></div>
          ) : viewMode === 'list' ? (
            
            // --- LIST VIEW ---
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-2xl flex-1 flex flex-col min-h-0">
              <div className="overflow-auto custom-scrollbar flex-1">
                <table className="w-full text-left border-collapse relative">
                  <thead className="bg-white/5 text-gray-300 border-b border-white/10 text-xs uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md">
                    <tr><th className="py-4 px-6">ID</th><th className="py-4 px-6">Employee</th><th className="py-4 px-6">Role & Dept</th><th className="py-4 px-6">Type</th><th className="py-4 px-6">Status</th><th className="py-4 px-6 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {paginatedEmployees.map((emp) => (
                      <tr key={emp._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-6 font-mono text-gray-400 text-xs">{getEmpId(emp._id)}</td>
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 flex items-center justify-center font-bold">{emp.name.charAt(0).toUpperCase()}</div>
                            <div><p className="font-bold text-white text-sm">{emp.name}</p><p className="text-xs text-gray-400">{emp.email}</p></div>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex flex-col gap-1"><span className={`w-fit inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${emp.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/10 text-gray-300 border border-white/20'}`}><Shield size={10} /> {emp.role}</span><span className="text-xs text-gray-400 flex items-center gap-1"><Briefcase size={12}/> {emp.department || "Unassigned"}</span></div>
                        </td>
                        {/* <td className="py-3 px-6 text-gray-300 font-medium">{emp.employmentType}</td> */}
                        {/* Updated List View Type Column to include fallback */}
<td className="py-3 px-6 text-gray-300 font-medium">
   {emp.employmentType || "Fulltime"}
</td>
                        <td className="py-3 px-6"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${emp.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>{emp.status}</span></td>
                        <td className="py-3 px-6 text-right">
                            <div className="flex items-center justify-end gap-1">
                                <button onClick={() => {setEditData(emp); setIsEditModalOpen(true);}} className="p-1.5 text-gray-400 hover:text-white rounded transition-colors"><Edit2 size={16} /></button>
                                {emp.status === 'active' ? <button onClick={() => handleStatusChange(emp._id, 'suspended')} disabled={processingId === emp._id} className="p-1.5 text-gray-400 hover:text-orange-400 rounded transition-colors">{processingId === emp._id ? <Loader2 size={16} className="animate-spin" /> : <Ban size={16} />}</button> : <button onClick={() => handleStatusChange(emp._id, 'active')} disabled={processingId === emp._id} className="p-1.5 text-gray-400 hover:text-green-400 rounded transition-colors">{processingId === emp._id ? <Loader2 size={16} className="animate-spin" /> : <Power size={16} />}</button>}
                                <button onClick={() => handleDelete(emp._id)} disabled={processingId === emp._id} className="p-1.5 text-gray-400 hover:text-red-400 rounded transition-colors">{processingId === emp._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}</button>
                            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          ) : (

            // --- GRID VIEW ---
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-4">
                 {paginatedEmployees.map(emp => (
                    <div key={emp._id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 hover:bg-white-[0.15] transition-all shadow-xl group">
                       <div className="flex justify-between items-start mb-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${emp.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}><div className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`}></div> {emp.status}</span>
                          <button onClick={() => {setEditData(emp); setIsEditModalOpen(true);}} className="text-gray-400 hover:text-white p-1"><Edit2 size={14}/></button>
                       </div>
                       <div className="flex flex-col items-center text-center mb-5">
                          <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500/40 text-blue-300 flex items-center justify-center font-black text-2xl mb-3 shadow-inner">{emp.name.charAt(0).toUpperCase()}</div>
                          <h3 className="text-white font-bold text-lg leading-tight">{emp.name}</h3>
                          <p className="text-blue-300 text-sm font-medium">{emp.position || "Staff Member"}</p>
                       </div>
                       <div className="space-y-3 bg-black/20 rounded-xl p-4 border border-white/5">
                          <div className="flex justify-between items-center text-xs"><span className="text-gray-400">ID Number</span><span className="font-mono font-bold text-gray-200">{getEmpId(emp._id)}</span></div>
                          <div className="flex justify-between items-center text-xs"><span className="text-gray-400">Department</span><span className="font-medium text-gray-200">{emp.department || "-"}</span></div>
                          {/* <div className="flex justify-between items-center text-xs"><span className="text-gray-400">Type</span><span className="font-medium text-gray-200">{emp.employmentType}</span></div> */}
                          {/* Updated Grid View Type Row to include fallback */}
<div className="flex justify-between items-center text-xs">
   <span className="text-gray-400">Type</span>
   <span className="font-medium text-gray-200">{emp.employmentType || "Fulltime"}</span>
</div>
                          <div className="pt-2 border-t border-white/10 mt-2 flex flex-col gap-2">
                             <p className="text-xs text-gray-300 flex items-center gap-2 truncate"><Mail size={12} className="text-gray-500 shrink-0"/> {emp.email}</p>
                             <p className="text-xs text-gray-300 flex items-center gap-2"><Phone size={12} className="text-gray-500 shrink-0"/> {emp.phone || "No Phone"}</p>
                          </div>
                       </div>
                    </div>
                 ))}
               </div>
            </div>
          )}

          {/* --- PAGINATION FOOTER --- */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 shrink-0">
               <p className="text-sm text-gray-400">Showing <span className="text-white font-bold">{(currentPage-1)*itemsPerPage + 1}</span> to <span className="text-white font-bold">{Math.min(currentPage*itemsPerPage, filteredEmployees.length)}</span> of <span className="text-white font-bold">{filteredEmployees.length}</span> entries</p>
               <div className="flex gap-2">
                 <button onClick={()=>setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-30 transition-colors"><ChevronLeft size={18}/></button>
                 <div className="flex items-center gap-1 px-2">
                   {Array.from({length: totalPages}, (_, i) => (
                     <button key={i} onClick={()=>setCurrentPage(i+1)} className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${currentPage === i+1 ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/10'}`}>{i+1}</button>
                   ))}
                 </div>
                 <button onClick={()=>setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-30 transition-colors"><ChevronRight size={18}/></button>
               </div>
            </div>
          )}
      </div>

      {/* ========================================= */}
      {/* MODALS: EXACT MATCH TO PREMIUM UI IMAGES */}
      {/* ========================================= */}

      {/* --- 1. ADD EMPLOYEE MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#f8f9fa] rounded-[20px] shadow-2xl w-full max-w-[900px] overflow-hidden flex flex-col">
            <div className="px-8 pt-8 pb-4 flex justify-between items-start bg-white shrink-0">
              <div className="flex items-center gap-4">
                {/* <div className="w-12 h-12 flex flex-col items-center justify-center"><img src="/logo/Travdek-white.svg" alt="Travdek" className="w-10 h-10 object-contain invert grayscale" onError={(e) => { e.currentTarget.style.display = 'none'; }} /></div> */}
                <div className="flex flex-col justify-center"><h2 className="text-[22px] font-black text-[#0f172a] tracking-wide uppercase leading-tight">ADD NEW EMPLOYEE</h2><p className="text-[13px] font-medium text-gray-500 uppercase tracking-widest leading-tight">Internal Team Directory</p></div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-800 transition-colors p-1"><X size={24} strokeWidth={1.5} /></button>
            </div>
            <div className="px-8"><hr className="border-[#e5e7eb]" /></div>
            
            <div className="overflow-y-auto px-8 py-6 custom-scrollbar">
                {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">{error}</div>}
                <form id="add-employee-form" onSubmit={handleAddEmployee} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
                      <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0"><Users size={18} strokeWidth={2} /></div>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" placeholder="Full Name" />
                    </div>
                    <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
                      <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0"><UserPlus size={18} strokeWidth={2} /></div>
                      <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" placeholder="Position / Title" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
                      <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0"><Mail size={18} strokeWidth={2} /></div>
                      <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" placeholder="Email Address" />
                    </div>
                    <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
                      <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0"><Phone size={18} strokeWidth={2} /></div>
                      <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" placeholder="Phone Number" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm relative">
                      <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0 z-10"><Shield size={18} strokeWidth={2} /></div>
                      <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="flex-1 py-3 pl-3 pr-10 bg-transparent text-[15px] text-gray-800 outline-none font-medium appearance-none cursor-pointer z-20"><option value="employee">Role (Standard Employee)</option><option value="admin">Role (Super Admin)</option></select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 z-10"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                    </div>
                    <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm relative">
                      <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0"><Lock size={18} strokeWidth={2} /></div>
                      <input type="password" required minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="flex-1 py-3 pl-3 pr-10 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" placeholder="Temporary Password" />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm relative">
                      <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0 z-10"><Briefcase size={18} strokeWidth={2} /></div>
                      <select value={formData.employmentType} onChange={e => setFormData({...formData, employmentType: e.target.value})} className="flex-1 py-3 pl-3 pr-10 bg-transparent text-[15px] text-gray-800 outline-none font-medium appearance-none cursor-pointer z-20"><option value="Fulltime">Type (Fulltime)</option><option value="Contract">Type (Contract)</option></select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 z-10"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                    </div>
                    <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
                      <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0"><Target size={18} strokeWidth={2} /></div>
                      <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" placeholder="Department" />
                    </div>
                  </div>
                </form>
            </div>
            <div className="px-8 py-6 flex gap-6 justify-end items-center shrink-0">
               <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-gray-400 font-bold text-[13px] hover:text-gray-700 transition-colors uppercase tracking-widest">Cancel</button>
               <button type="submit" form="add-employee-form" disabled={submitLoading} className="px-6 py-3 bg-[#0a3d8c] text-white font-bold text-[13px] rounded-[8px] hover:bg-[#072c66] shadow-md disabled:opacity-50 flex items-center gap-2 transition-all uppercase tracking-widest">{submitLoading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <>Create Account <span className="text-blue-200 ml-1 font-normal text-lg leading-none">↗</span></>}</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 2. EDIT EMPLOYEE MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#f8f9fa] rounded-[20px] shadow-2xl w-full max-w-[800px] overflow-hidden flex flex-col">
            <div className="px-8 pt-8 pb-4 flex justify-between items-start bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex flex-col items-center justify-center bg-blue-50 rounded-full border border-blue-100"><Edit2 className="text-[#0a3d8c]" size={24} strokeWidth={2} /></div>
                <div className="flex flex-col justify-center"><h2 className="text-[22px] font-black text-[#0f172a] tracking-wide uppercase leading-tight">EDIT EMPLOYEE</h2><p className="text-[13px] font-medium text-gray-500 uppercase tracking-widest leading-tight">Update Team Member Profile</p></div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-800 transition-colors p-1"><X size={24} strokeWidth={1.5} /></button>
            </div>
            <div className="px-8"><hr className="border-[#e5e7eb]" /></div>
            <div className="overflow-y-auto px-8 py-6 custom-scrollbar">
                <form id="edit-employee-form" onSubmit={handleEditEmployee} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm"><div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0"><Users size={18} strokeWidth={2} /></div><input type="text" required value={editData.name || ""} onChange={e => setEditData({...editData, name: e.target.value})} className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" placeholder="Full Name" /></div>
                    <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm"><div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0"><UserPlus size={18} strokeWidth={2} /></div><input type="text" value={editData.position || ""} onChange={e => setEditData({...editData, position: e.target.value})} className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" placeholder="Position / Title" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm"><div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0"><Mail size={18} strokeWidth={2} /></div><input type="email" required value={editData.email || ""} onChange={e => setEditData({...editData, email: e.target.value})} className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" placeholder="Email Address" /></div>
                    <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm"><div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0"><Phone size={18} strokeWidth={2} /></div><input type="text" value={editData.phone || ""} onChange={e => setEditData({...editData, phone: e.target.value})} className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" placeholder="Phone Number" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm relative">
                      <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0 z-10"><Shield size={18} strokeWidth={2} /></div>
                      <select value={editData.role || "employee"} onChange={e => setEditData({...editData, role: e.target.value})} className="flex-1 py-3 pl-3 pr-10 bg-transparent text-[15px] text-gray-800 outline-none font-medium appearance-none cursor-pointer z-20"><option value="employee">Role (Standard Employee)</option><option value="admin">Role (Super Admin)</option></select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 z-10"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                    </div>
                    <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm relative">
                      <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0 z-10"><Briefcase size={18} strokeWidth={2} /></div>
                      <select value={editData.employmentType || "Fulltime"} onChange={e => setEditData({...editData, employmentType: e.target.value})} className="flex-1 py-3 pl-3 pr-10 bg-transparent text-[15px] text-gray-800 outline-none font-medium appearance-none cursor-pointer z-20"><option value="Fulltime">Type (Fulltime)</option><option value="Contract">Type (Contract)</option></select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 z-10"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm"><div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 group-focus-within:bg-blue-50 group-focus-within:text-[#0a3d8c] transition-colors shrink-0"><Target size={18} strokeWidth={2} /></div><input type="text" value={editData.department || ""} onChange={e => setEditData({...editData, department: e.target.value})} className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" placeholder="Department" /></div>
                    <div></div>
                  </div>
                </form>
            </div>
            <div className="px-8 py-6 flex gap-6 justify-end items-center shrink-0">
               <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-gray-400 font-bold text-[13px] hover:text-gray-700 transition-colors uppercase tracking-widest">Cancel</button>
               <button type="submit" form="edit-employee-form" disabled={submitLoading} className="px-6 py-3 bg-[#0a3d8c] text-white font-bold text-[13px] rounded-[8px] hover:bg-[#072c66] shadow-md disabled:opacity-50 flex items-center gap-2 transition-all uppercase tracking-widest">{submitLoading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <>Save Changes <span className="text-blue-200 ml-1 font-normal text-lg leading-none">↗</span></>}</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 3. TRANSFER MODAL (Compact Design) --- */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#f8f9fa] rounded-[20px] shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col">
            <div className="px-8 pt-8 pb-4 flex justify-between items-start bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex flex-col items-center justify-center bg-orange-50 rounded-full border border-orange-100"><ArrowRightLeft className="text-orange-600" size={24} strokeWidth={2} /></div>
                <div className="flex flex-col justify-center"><h2 className="text-[22px] font-black text-[#0f172a] tracking-wide uppercase leading-tight">TRANSFER</h2><p className="text-[13px] font-medium text-gray-500 uppercase tracking-widest leading-tight">Change Department/Role</p></div>
              </div>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-gray-500 hover:text-gray-800 transition-colors p-1"><X size={24} strokeWidth={1.5} /></button>
            </div>
            <div className="px-8"><hr className="border-[#e5e7eb]" /></div>
            
            <div className="p-8">
               <form id="transfer-form" onSubmit={handleTransfer} className="space-y-4">
                  <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm relative">
                      <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 z-10"><Users size={18} strokeWidth={2} /></div>
                      <select required value={transferData.id} onChange={e => setTransferData({...transferData, id: e.target.value})} className="flex-1 py-3 pl-3 pr-10 bg-transparent text-[15px] text-gray-800 outline-none font-medium appearance-none cursor-pointer z-20">
                        <option value="" disabled>Select Employee...</option>
                        {employees.filter(e => e.status === 'active').map(e => <option key={e._id} value={e._id}>{e.name} ({e.department || 'No Dept'})</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 z-10"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                  </div>
                  <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm">
                      <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 shrink-0"><Target size={18} strokeWidth={2} /></div>
                      <input type="text" required value={transferData.newDepartment} onChange={e => setTransferData({...transferData, newDepartment: e.target.value})} className="flex-1 py-3 px-3 bg-transparent text-[15px] text-gray-800 outline-none placeholder-gray-800 font-medium" placeholder="New Department" />
                  </div>
                  <div className="flex items-center w-full bg-white border border-[#d1d5db] rounded-[12px] focus-within:border-[#0a3d8c] focus-within:ring-1 focus-within:ring-[#0a3d8c] transition-all group shadow-sm relative">
                      <div className="w-10 h-10 ml-1.5 my-1.5 rounded-[8px] bg-[#f3f4f6] flex items-center justify-center text-gray-500 z-10"><Shield size={18} strokeWidth={2} /></div>
                      <select value={transferData.newRole} onChange={e => setTransferData({...transferData, newRole: e.target.value})} className="flex-1 py-3 pl-3 pr-10 bg-transparent text-[15px] text-gray-800 outline-none font-medium appearance-none cursor-pointer z-20"><option value="">Keep current role</option><option value="employee">Standard Employee</option><option value="admin">Super Admin</option></select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 z-10"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                  </div>
               </form>
            </div>
            
            <div className="px-8 py-6 flex gap-6 justify-end items-center shrink-0">
               <button type="button" onClick={() => setIsTransferModalOpen(false)} className="text-gray-400 font-bold text-[13px] hover:text-gray-700 transition-colors uppercase tracking-widest">Cancel</button>
               <button type="submit" form="transfer-form" disabled={submitLoading || !transferData.id} className="px-6 py-3 bg-[#0a3d8c] text-white font-bold text-[13px] rounded-[8px] hover:bg-[#072c66] shadow-md disabled:opacity-50 flex items-center gap-2 transition-all uppercase tracking-widest">{submitLoading ? <Loader2 size={16} className="animate-spin" /> : <>Execute Transfer <span className="text-blue-200 ml-1 font-normal text-lg leading-none">↗</span></>}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}