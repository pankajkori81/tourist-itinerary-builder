// "use client";

// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, User, Mail, Phone, MapPin, Briefcase, DollarSign, Calendar } from "lucide-react";

// interface ClientDrawerProps {
//   isOpen: boolean;
//   onClose: () => void;
//   client: any; // The selected client object
// }

// export default function ClientDrawer({ isOpen, onClose, client }: ClientDrawerProps) {
//   if (!client) return null;

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div 
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
//           />
          
//           {/* Drawer */}
//           <motion.div 
//             initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
//             transition={{ type: "spring", damping: 25, stiffness: 200 }}
//             className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
//           >
//             {/* Header */}
//             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
//               <h2 className="text-lg font-black text-gray-900">Client Profile</h2>
//               <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={18}/></button>
//             </div>

//             {/* Body */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-8">
//                {/* User Basic Info */}
//                <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-black">
//                      {client.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-black text-gray-900">{client.name}</h3>
//                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Client since {new Date(client.createdAt).getFullYear()}</p>
//                   </div>
//                </div>

//                {/* Contact Details */}
//                <div className="space-y-3">
//                   <div className="flex items-center gap-3 text-sm font-semibold text-gray-600"><Mail size={16} className="text-gray-400"/> {client.email || "No email provided"}</div>
//                   <div className="flex items-center gap-3 text-sm font-semibold text-gray-600"><Phone size={16} className="text-gray-400"/> {client.phone || "No phone provided"}</div>
//                </div>

//                {/* Stats Grid */}
//                <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
//                      <p className="text-[10px] font-black text-gray-400 uppercase">Total Trips</p>
//                      <p className="text-2xl font-black text-gray-900">{client.totalTrips || 0}</p>
//                   </div>
//                   <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
//                      <p className="text-[10px] font-black text-emerald-600 uppercase">Lifetime Value</p>
//                      <p className="text-2xl font-black text-emerald-700">
//                         {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(client.lifetimeValue || 0)}
//                      </p>
//                   </div>
//                </div>

//                {/* Placeholder for History */}
//                <div>
//                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Trip History</h4>
//                   <div className="text-sm text-gray-500 italic">No past trips recorded yet.</div>
//                </div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }





// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, Mail, Phone, Edit2, Loader2, Check } from "lucide-react";

// interface ClientDrawerProps {
//   isOpen: boolean;
//   onClose: () => void;
//   client: any; // The selected client object
//   onUpdate: () => void; // Triggered after saving to refresh the master list
// }

// export default function ClientDrawer({ isOpen, onClose, client, onUpdate }: ClientDrawerProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

//   // Reset the form whenever a new client is opened
//   useEffect(() => {
//     if (client) {
//       setFormData({ name: client.name, email: client.email || "", phone: client.phone || "" });
//       setIsEditing(false);
//     }
//   }, [client]);

//   if (!client) return null;

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/clients", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           clientId: client._id, 
//           name: formData.name, 
//           email: formData.email, 
//           phone: formData.phone 
//         }),
//       });

//       const json = await res.json();
//       if (json.success) {
//         setIsEditing(false);
//         onUpdate(); // Tell the dashboard to refresh the table!
//       } else {
//         alert(json.message);
//       }
//     } catch (error) {
//       alert("Failed to update client.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div 
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
//           />
          
//           {/* Drawer */}
//           <motion.div 
//             initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
//             transition={{ type: "spring", damping: 25, stiffness: 200 }}
//             className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
//           >
//             {/* Header */}
//             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
//               <h2 className="text-lg font-black text-gray-900">Client Profile</h2>
//               <div className="flex gap-2">
//                 {!isEditing && (
//                   <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Edit Profile">
//                     <Edit2 size={16}/>
//                   </button>
//                 )}
//                 <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors">
//                   <X size={18}/>
//                 </button>
//               </div>
//             </div>

//             {/* Body */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-8">
               
//                {/* User Basic Info */}
//                <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-black shrink-0 border border-indigo-200">
//                      {formData.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
//                   </div>
//                   <div className="flex-1">
//                     {isEditing ? (
//                       <input 
//                         type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
//                         className="w-full font-black text-lg border-b-2 border-indigo-500 outline-none bg-indigo-50/50 px-2 py-1 rounded-t"
//                         placeholder="Client Name"
//                       />
//                     ) : (
//                       <>
//                         <h3 className="text-xl font-black text-gray-900 leading-tight">{formData.name}</h3>
//                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
//                           Client since {new Date(client.createdAt).getFullYear()}
//                         </p>
//                       </>
//                     )}
//                   </div>
//                </div>

//                {/* Contact Details */}
//                <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
//                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Information</h4>
                  
//                   <div className="flex items-center gap-3">
//                     <Mail size={16} className="text-gray-400 shrink-0"/> 
//                     {isEditing ? (
//                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-indigo-500" placeholder="Email Address"/>
//                     ) : (
//                        <span className="text-sm font-semibold text-gray-700">{formData.email || "No email provided"}</span>
//                     )}
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <Phone size={16} className="text-gray-400 shrink-0"/> 
//                     {isEditing ? (
//                        <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-indigo-500" placeholder="Phone Number"/>
//                     ) : (
//                        <span className="text-sm font-semibold text-gray-700">{formData.phone || "No phone provided"}</span>
//                     )}
//                   </div>
//                </div>

//                {/* Action Buttons (Only visible while editing) */}
//                {isEditing && (
//                  <div className="flex gap-3 pt-2">
//                    <button onClick={() => setIsEditing(false)} className="flex-1 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
//                      Cancel
//                    </button>
//                    <button onClick={handleSave} disabled={loading} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
//                      {loading ? <Loader2 size={16} className="animate-spin"/> : <Check size={16}/>} Save Profile
//                    </button>
//                  </div>
//                )}

//                {/* Stats Grid */}
//                <div className="grid grid-cols-2 gap-4 pt-2">
//                   <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
//                      <p className="text-[10px] font-black text-gray-400 uppercase">Total Trips</p>
//                      <p className="text-2xl font-black text-gray-900">{client.totalTrips || 0}</p>
//                   </div>
//                   <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
//                      <p className="text-[10px] font-black text-emerald-600 uppercase">Lifetime Value</p>
//                      <p className="text-2xl font-black text-emerald-700">
//                         {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(client.lifetimeValue || 0)}
//                      </p>
//                   </div>
//                </div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// } 






"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, Edit2, Loader2, Check, FileText } from "lucide-react";

interface ClientDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  client: any; // The selected client object
  onUpdate: () => void; // Triggered after saving to refresh the master list
}

interface CustomFieldDef {
  _id: string;
  name: string;
  type: 'text' | 'dropdown' | 'date';
  options?: string[];
}

export default function ClientDrawer({ isOpen, onClose, client, onUpdate }: ClientDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 🌟 NEW: Track the custom field definitions and the data
  const [customFieldsDef, setCustomFieldsDef] = useState<CustomFieldDef[]>([]);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    customData: {} as Record<string, any> // Holds the dynamic answers
  });

  // Fetch the Custom Field Rules when the drawer opens
  useEffect(() => {
    if (isOpen) {
      fetch("/api/custom-fields")
        .then(res => res.json())
        .then(data => {
          if (data.success) setCustomFieldsDef(data.data);
        })
        .catch(err => console.error("Failed to load custom fields"));
    }
  }, [isOpen]);

  // Reset the form whenever a new client is opened
  useEffect(() => {
    if (client) {
      setFormData({ 
        name: client.name, 
        email: client.email || "", 
        phone: client.phone || "",
        customData: client.customData || {} // Load existing custom data if they have it
      });
      setIsEditing(false);
    }
  }, [client]);

  if (!client) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          clientId: client._id, 
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone,
          customData: formData.customData // 🌟 Send the custom data to the backend!
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsEditing(false);
        onUpdate(); // Tell the dashboard to refresh the table!
      } else {
        alert(json.message);
      }
    } catch (error) {
      alert("Failed to update client.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to update specific custom fields
  const handleCustomDataChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customData: {
        ...prev.customData,
        [fieldName]: value
      }
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h2 className="text-lg font-black text-gray-900">Client Profile</h2>
              <div className="flex gap-2">
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Edit Profile">
                    <Edit2 size={16}/>
                  </button>
                )}
                <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={18}/>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
               
               {/* User Basic Info */}
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-black shrink-0 border border-indigo-200">
                     {formData.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <input 
                        type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full font-black text-lg border-b-2 border-indigo-500 outline-none bg-indigo-50/50 px-2 py-1 rounded-t"
                        placeholder="Client Name"
                      />
                    ) : (
                      <>
                        <h3 className="text-xl font-black text-gray-900 leading-tight">{formData.name}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                          Client since {new Date(client.createdAt).getFullYear()}
                        </p>
                      </>
                    )}
                  </div>
               </div>

               {/* Contact Details */}
               <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Information</h4>
                  
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-400 shrink-0"/> 
                    {isEditing ? (
                       <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-indigo-500" placeholder="Email Address"/>
                    ) : (
                       <span className="text-sm font-semibold text-gray-700">{formData.email || "No email provided"}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-gray-400 shrink-0"/> 
                    {isEditing ? (
                       <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-indigo-500" placeholder="Phone Number"/>
                    ) : (
                       <span className="text-sm font-semibold text-gray-700">{formData.phone || "No phone provided"}</span>
                    )}
                  </div>
               </div>

               {/* 🌟 NEW: Dynamic Custom Fields Section */}
               {customFieldsDef.length > 0 && (
                 <div className="space-y-4 bg-indigo-50/30 p-4 rounded-xl border border-indigo-50">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <FileText size={12}/> Additional Details
                    </h4>
                    
                    {customFieldsDef.map((field) => (
                      <div key={field._id} className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500">{field.name}</label>
                        
                        {isEditing ? (
                          // Edit Mode Inputs
                          field.type === 'dropdown' ? (
                            <select 
                              value={formData.customData[field.name] || ""} 
                              onChange={(e) => handleCustomDataChange(field.name, e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 bg-white"
                            >
                              <option value="">Select {field.name}...</option>
                              {field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : field.type === 'date' ? (
                            <input 
                              type="date" 
                              value={formData.customData[field.name] || ""} 
                              onChange={(e) => handleCustomDataChange(field.name, e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 bg-white"
                            />
                          ) : (
                            <input 
                              type="text" 
                              value={formData.customData[field.name] || ""} 
                              onChange={(e) => handleCustomDataChange(field.name, e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 bg-white"
                              placeholder={`Enter ${field.name}`}
                            />
                          )
                        ) : (
                          // View Mode Text
                          <span className="text-sm font-semibold text-gray-800">
                            {formData.customData[field.name] || <span className="text-gray-400 italic">Not specified</span>}
                          </span>
                        )}
                      </div>
                    ))}
                 </div>
               )}

               {/* Stats Grid */}
               <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                     <p className="text-[10px] font-black text-gray-400 uppercase">Total Trips</p>
                     <p className="text-2xl font-black text-gray-900">{client.totalTrips || 0}</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
                     <p className="text-[10px] font-black text-emerald-600 uppercase">Lifetime Value</p>
                     <p className="text-2xl font-black text-emerald-700">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(client.lifetimeValue || 0)}
                     </p>
                  </div>
               </div>
            </div>

            {/* Action Buttons (Only visible while editing) */}
            {isEditing && (
              <div className="p-4 border-t border-gray-100 bg-white flex gap-3 shrink-0">
                <button onClick={() => setIsEditing(false)} className="flex-1 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={loading} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
                  {loading ? <Loader2 size={16} className="animate-spin"/> : <Check size={16}/>} Save Profile
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}