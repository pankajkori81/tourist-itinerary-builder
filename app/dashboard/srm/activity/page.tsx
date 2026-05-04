
// "use client";

// import React, { useState, useRef, useMemo, useEffect } from 'react';
// import { 
//   Plus, MapPin, Search, Star, 
//   Trash2, X, Save, Image as ImageIcon, 
//   ChevronDown, ChevronRight, Globe, Clock, Ticket, User, Edit,
//   DollarSign, Briefcase, Phone
// } from 'lucide-react';
// import { useSRM } from '@/app/context/SRMContext';
// import { AttractionData, saveAttraction, deleteAttraction } from '@/utils/srmStorage';

// export default function ActivitySRMPage() {
//   // 1. GET SUPPLIERS FROM CONTEXT
//   const { attractions, suppliers, refreshAll, searchText } = useSRM();
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Nested Accordion State
//   const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
//   const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

//   // 2. FILTER SUPPLIERS (Only show Active + Activity Providers)
//   const activitySuppliers = useMemo(() => {
//     return suppliers.filter(s => s.status === 'Active' && s.services.includes('Activity'));
//   }, [suppliers]);

//   // Form State
//   const initialForm: AttractionData = {
//     id: '', name: '', type: 'Monument', city: '', country: '',
//     linkedSupplierId: '', // <--- NEW FIELD
//     duration: '2 Hours', suggestedSlot: 'Morning', startTime: '09:00',
//     pickupLocation: '', entranceFee: 0, activityFee: 0,
//     isGuideRequired: false, guideFee: 0, rating: 5, reviewsCount: 0,
//     providerLink: '', description: '', imageUrl: '', status: 'Active'
//   };
//   const [formData, setFormData] = useState<AttractionData>(initialForm);

//   // Helper to get selected supplier details for preview
//   const selectedSupplierData = activitySuppliers.find(s => s.id === formData.linkedSupplierId);

//   // --- NESTED GROUPING LOGIC ---
//   const groupedData = useMemo(() => {
//     const filtered = attractions.filter(a => 
//       (a.name || "").toLowerCase().includes(searchText.toLowerCase()) || 
//       (a.city || "").toLowerCase().includes(searchText.toLowerCase()) ||
//       (a.country || "").toLowerCase().includes(searchText.toLowerCase())
//     );

//     const groups: Record<string, Record<string, AttractionData[]>> = {};
    
//     filtered.forEach(item => {
//       const country = (item.country || "Other Locations").trim();
//       const city = (item.city || "General").trim();

//       if (!groups[country]) groups[country] = {};
//       if (!groups[country][city]) groups[country][city] = [];
      
//       groups[country][city].push(item);
//     });

//     return Object.keys(groups).sort().reduce((acc, country) => {
//       acc[country] = groups[country];
//       return acc;
//     }, {} as Record<string, Record<string, AttractionData[]>>);

//   }, [attractions, searchText]);

//   // --- LOGIC: AUTO-EXPAND ON SEARCH ---
//   useEffect(() => {
//     if (searchText) {
//       const allCountries = Object.keys(groupedData);
//       const newExpCountries = allCountries.reduce((acc, key) => ({...acc, [key]: true}), {});
//       setExpandedCountries(newExpCountries);
      
//       const newExpCities: Record<string, boolean> = {};
//       allCountries.forEach(c => {
//           Object.keys(groupedData[c]).forEach(city => {
//               newExpCities[`${c}-${city}`] = true;
//           });
//       });
//       setExpandedCities(newExpCities);
//     }
//   }, [searchText, groupedData]);

//   // --- ACTIONS ---
//   const handleEdit = (item: AttractionData) => { setFormData(item); setIsModalOpen(true); };
  
//   const handleDelete = (id: string) => { 
//       if (confirm('Delete this activity?')) { 
//           deleteAttraction(id); 
//           refreshAll(); 
//       } 
//   };
  
//   const handleSave = () => {
//     if (!formData.name || !formData.city) return alert("Name and City required");
    
//     const cleanData = {
//         ...formData,
//         country: formData.country.trim().charAt(0).toUpperCase() + formData.country.trim().slice(1)
//     };

//     saveAttraction(cleanData);
//     refreshAll();
//     setIsModalOpen(false);
//     setFormData(initialForm);
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
//       reader.readAsDataURL(file);
//     }
//   };

//   const existingCountries = Array.from(new Set(attractions.map(a => a.country).filter(Boolean))).sort();

//   return (
//    <div className="h-full w-full flex flex-col relative overflow-hidden">
      
//       {/* BACKGROUND */}
//       <div className="absolute inset-0 z-0" style={{ 
//           backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop")', 
//           backgroundSize: 'cover', 
//           backgroundPosition: 'center' 
//       }} />
//       <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm" />

//       {/* CONTENT */}
//      <div className="flex-1 flex flex-col relative z-10 h-full">
          
//           {/* HEADER */}
//           <div className="bg-white/95 border-b border-white/50 px-6 py-4 flex justify-between items-center backdrop-blur-md shadow-sm z-10">
//              <div>
//                 <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                     <Ticket className="text-blue-600" /> Activity Inventory
//                 </h1>
//                 <p className="text-xs text-gray-600 font-medium">Manage tours, monuments, and experiences.</p>
//              </div>
//              <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
//                <Plus size={18} /> Add Activity
//              </button>
//           </div>

//           {/* LIST VIEW */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
//              {Object.keys(groupedData).length === 0 ? (
//                  <div className="flex flex-col items-center justify-center h-64 text-gray-600 bg-white/40 rounded-xl border border-white/50 backdrop-blur-sm">
//                     <Ticket size={48} className="opacity-50 mb-2"/>
//                     <p className="font-bold">No activities found.</p>
//                     <p className="text-sm">Click "Add Activity" to start.</p>
//                  </div>
//              ) : (
//                  Object.entries(groupedData).map(([country, cities]) => (
//                     <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
//                         {/* Country Header */}
//                         <div 
//                             onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))}
//                             className="flex items-center bg-white/95 p-4 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white transition-all select-none border border-white/50 backdrop-blur-sm mb-2"
//                         >
//                             <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:text-blue-800 transition-colors">
//                                 {expandedCountries[country] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
//                             </div>
//                             <div className="flex-1">
//                                 <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
//                                     <Globe size={18} className="text-blue-600" />
//                                     {country}
//                                 </h3>
//                             </div>
//                             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
//                                 {Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Activities
//                             </span>
//                         </div>

//                         {/* Cities List */}
//                         {expandedCountries[country] && (
//                             <div className="ml-4 pl-4 border-l-2 border-white/40 space-y-3">
//                                 {Object.entries(cities).map(([city, items]) => {
//                                     const cityKey = `${country}-${city}`;
//                                     return (
//                                         <div key={city}>
//                                             <div 
//                                                 onClick={() => setExpandedCities(prev => ({...prev, [cityKey]: !prev[cityKey]}))}
//                                                 className="flex items-center bg-white/95 p-3 rounded-lg gap-2 cursor-pointer hover:bg-white/80 transition-all select-none border border-white/30 backdrop-blur-sm mb-2"
//                                             >
//                                                 {expandedCities[cityKey] ? <ChevronDown size={16} className="text-gray-500"/> : <ChevronRight size={16} className="text-gray-500"/>}
//                                                 <MapPin size={16} className="text-red-800" />
//                                                 <span className="font-bold text-gray-900">{city}</span>
//                                                 <span className="text-xs text-gray-900 bg-blue-200 px-2 py-0.5 rounded-full">
//                                                     {items.length}
//                                                 </span>
//                                             </div>

//                                             {/* Activities Grid */}
//                                             {expandedCities[cityKey] && (
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-6 mb-4">
//                                                     {items.map((item) => (
//                                                         <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col overflow-hidden">
//                                                             {/* Card Image */}
//                                                             <div className="h-32 bg-gray-100 relative shrink-0 overflow-hidden">
//                                                                 {item.imageUrl ? (
//                                                                     <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> 
//                                                                 ) : (
//                                                                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500 shadow-inner border border-white/10 group">
//                                                                         <ImageIcon size={48} className="text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
//                                                                     </div>
//                                                                 )}
//                                                                 <span className="absolute top-3 left-3 text-[10px] bg-white/90 backdrop-blur-md px-2 py-1 rounded shadow uppercase font-bold tracking-wide border border-white/50">
//                                                                     {item.type}
//                                                                 </span>
//                                                                 <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded shadow text-xs font-bold flex items-center gap-1">
//                                                                     <Star size={10} className="fill-yellow-700 text-yellow-700"/> {item.rating}
//                                                                 </div>
//                                                             </div>

//                                                             {/* Card Content */}
//                                                             <div className="p-5 flex-1 flex flex-col">
//                                                                 <h3 className="font-bold text-gray-900 text-[16px] leading-tight truncate " title={item.name}>{item.name}</h3>
//                                                                 <div className="flex items-center text-xs text-gray-700 font-medium mb-1 mt-1">
//                                                                     <MapPin size={14} className="mr-1 text-blue-500 shrink-0" />
//                                                                     <span className="truncate">{item.city}, {item.country}</span>
//                                                                 </div>

//                                                                 {/* Display Supplier Name if linked */}
//                                                                 {item.linkedSupplierId && (() => {
//                                                                     const sup = suppliers.find(s => s.id === item.linkedSupplierId);
//                                                                     return sup ? (
//                                                                         <div className="flex items-center gap-1 mb-2 text-[10px] bg-blue-50 text-blue-800 px-2 py-1 rounded w-fit">
//                                                                             <Briefcase size={10} /> <span className="truncate max-w-[150px]">By: {sup.name}</span>
//                                                                         </div>
//                                                                     ) : null;
//                                                                 })()}

//                                                                 <div className="grid grid-cols-2 gap-2 mb-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
//                                                                    <div>
//                                                                         <div className="text-[10px] text-gray-600 uppercase font-bold tracking-wide">Time Slot</div>
//                                                                         <div className="text-sm font-bold text-gray-700">{item.suggestedSlot}</div>
//                                                                     </div>
//                                                                     <div>
//                                                                         <div className="text-[10px] text-gray-600 uppercase font-bold tracking-wide">Duration</div>
//                                                                         <div className="text-sm font-bold text-gray-700 flex items-center gap-1"><Clock size={12}/> {item.duration}</div>
//                                                                     </div>
//                                                                     <div>
//                                                                         <div className="text-[10px] text-gray-600 uppercase font-bold tracking-wide mt-1">Total Cost</div>
//                                                                         <div className="text-sm font-bold text-green-700">
//                                                                             ${item.entranceFee + item.activityFee + (item.isGuideRequired ? item.guideFee : 0)}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>

//                                                                 <div className="mt-auto border-t border-gray-100 flex items-center gap-3 pt-2">
//                                                                     <button onClick={() => handleEdit(item)} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors">
//                                                                         <Edit size={14} /> Edit
//                                                                     </button>
//                                                                     <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors">
//                                                                          <Trash2 size={14} /> Delete
//                                                                     </button>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         )}
//                     </div>
//                  ))
//              )}
//           </div>
//       </div>

//       {/* MODAL FORM */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
//            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
//                  <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Activity' : 'Add New Activity'}</h2>
//                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
//               </div>

//               <div className="p-6 overflow-y-auto">
//                  <div className="grid grid-cols-12 gap-6">
             
//                      {/* LEFT COLUMN */}
//                     <div className="col-span-4 space-y-4">
//                         <div 
//                             onClick={() => fileInputRef.current?.click()}
//                             className="h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 bg-cover bg-center relative group transition-colors"
//                             style={{ backgroundImage: `url(${formData.imageUrl})` }}
//                         >
//                             {!formData.imageUrl && (
//                                 <div className="flex flex-col items-center text-gray-400">
//                                     <ImageIcon size={40} className="mb-2"/>
//                                     <span className="text-xs font-bold">Upload Activity Image</span>
//                                 </div>
//                             )}
//                             <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
//                         </div>

//                         <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
//                            <label className="block text-xs font-bold text-yellow-800 mb-2">Rating & Reviews</label>
//                            <div className="flex gap-2">
//                               <div className="relative w-20">
//                                 <Star size={14} className="absolute left-2 top-2.5 text-yellow-600" />
//                                 <input type="number" max="5" min="1" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value) || 0})} className="w-full pl-7 p-2 border border-yellow-300 bg-white rounded-lg text-sm font-bold" />
//                               </div>
//                               <input type="number" placeholder="Count" value={formData.reviewsCount} onChange={e => setFormData({...formData, reviewsCount: parseInt(e.target.value) || 0})} className="flex-1 p-2 border border-yellow-300 bg-white rounded-lg text-sm" />
//                            </div>
//                         </div>
//                     </div>

//                     {/* RIGHT COLUMN */}
//                     <div className="col-span-8 space-y-5">
                        
//                         {/* --- 1. SUPPLIER LINKAGE (THE NEW LINK) --- */}
//                         <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-4 items-start">
//                             <div className="flex-1">
//                                 <label className="block text-xs font-bold text-blue-900 mb-2 flex items-center gap-1">
//                                     <Briefcase size={14} /> Fulfillment Partner (DMC)
//                                 </label>
//                                 <select 
//                                     className="w-full p-2.5 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
//                                     value={formData.linkedSupplierId || ""}
//                                     onChange={(e) => setFormData({...formData, linkedSupplierId: e.target.value})}
//                                 >
//                                     <option value="">-- Direct / Unknown --</option>
//                                     {activitySuppliers.map(s => (
//                                         <option key={s.id} value={s.id}>
//                                             {s.name} ({s.city}) {s.isPreferred ? '★' : ''}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
                            
//                             {/* Intelligence Panel (Preview) */}
//                             {selectedSupplierData && (
//                                 <div className="flex-1 bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-xs">
//                                     <div className="font-bold text-gray-800 mb-1 flex justify-between">
//                                         <span>{selectedSupplierData.contactPerson}</span>
//                                         <span className="text-blue-600 bg-blue-50 px-1.5 rounded">{selectedSupplierData.paymentTerms}</span>
//                                     </div>
//                                     <div className="text-gray-500 space-y-1">
//                                         <div className="flex items-center gap-1"><Phone size={10}/> {selectedSupplierData.phone}</div>
//                                         <div className="truncate">📧 {selectedSupplierData.email}</div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* --- Basic Info --- */}
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-500 mb-1">Activity Name *</label>
//                                 <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Colosseum Tour" />
//                             </div>
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
//                                 <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white">
//                                     <option>Monument</option><option>Attraction</option><option>Museum</option><option>Adventure</option><option>Show</option><option>None</option>
//                                 </select>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-500 mb-1">City *</label>
//                                 <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Rome"/>
//                             </div>
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-500 mb-1">Country</label>
//                                 <input 
//                                     list="country-suggestions"
//                                     type="text" 
//                                     value={formData.country} 
//                                     onChange={e => setFormData({...formData, country: e.target.value})} 
//                                     className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" 
//                                     placeholder="Type or select..."
//                                 />
//                                 <datalist id="country-suggestions">
//                                     {existingCountries.map(c => <option key={c} value={c} />)}
//                                 </datalist>
//                             </div>
//                         </div>

//                         {/* Logistics */}
//                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-3 gap-4">
//                             <div><label className="block text-xs font-bold text-gray-500 mb-1">Time Slot</label><select value={formData.suggestedSlot} onChange={e => setFormData({...formData, suggestedSlot: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Full Day</option><option>Half Day</option></select></div>
//                             <div><label className="block text-xs font-bold text-gray-500 mb-1">Start Time</label><input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" /></div>
//                             <div><label className="block text-xs font-bold text-gray-500 mb-1">Duration</label><input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. 2 Hours" /></div>
//                             <div className="col-span-3"><label className="block text-xs font-bold text-gray-500 mb-1">Default Pickup Location</label><input type="text" value={formData.pickupLocation} onChange={e => setFormData({...formData, pickupLocation: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Hotel Lobby" /></div>
//                         </div>
                            
//                         <div><label className="block text-xs font-bold text-gray-500 mb-1">Description</label><textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Short description..." /></div>

//                         {/* Costing */}
//                         <div className="bg-green-50 p-4 rounded-xl border border-green-200">
//                             <div className="flex items-center gap-2 mb-3">
//                                 <DollarSign size={16} className="text-green-700"/>
//                                 <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Pricing Configuration</span>
//                             </div>
//                             <div className="grid grid-cols-2 gap-4 mb-4">
//                                 <div><label className="block text-xs font-bold text-green-700 mb-1">Entrance Fee ($)</label><input type="number" value={formData.entranceFee} onChange={e => setFormData({...formData, entranceFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-green-300 rounded-lg text-sm font-bold" /></div>
//                                 <div><label className="block text-xs font-bold text-green-700 mb-1">Activity Fee ($)</label><input type="number" value={formData.activityFee} onChange={e => setFormData({...formData, activityFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-green-300 rounded-lg text-sm font-bold" /></div>
//                             </div>
//                             <div className="pt-3 border-t border-green-200">
//                                 <div className="flex items-center gap-2 mb-2"><input type="checkbox" checked={formData.isGuideRequired} onChange={e => setFormData({...formData, isGuideRequired: e.target.checked})} className="w-4 h-4 text-blue-600 rounded cursor-pointer" /><span className="text-sm font-bold text-gray-700">Guide is Required?</span></div>
//                                 {formData.isGuideRequired && (<div className="animate-in fade-in slide-in-from-top-1"><label className="block text-xs font-bold text-green-700 mb-1">Guide Fee ($)</label><input type="number" value={formData.guideFee} onChange={e => setFormData({...formData, guideFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-green-300 rounded-lg text-sm font-bold bg-white" placeholder="Cost for the Guide" /></div>)}
//                             </div>
//                         </div>
//                     </div>
//                  </div>
//               </div>

//               <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 shrink-0">
//                  <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"><Save size={18} /> Save Activity</button>
//               </div>
//            </div>
//         </div>
//       )}
//     </div>
//   );
// } 






























// "use client";

// import React, { useState, useRef, useMemo, useEffect } from 'react';
// import { 
//   Plus, MapPin, Search, Star, 
//   Trash2, X, Save, Image as ImageIcon, 
//   ChevronDown, ChevronRight, Globe, Clock, Ticket, User, Edit,
//   DollarSign, Briefcase, Phone, Mail, CreditCard
// } from 'lucide-react';
// import { useSRM } from '@/app/context/SRMContext';
// import { AttractionData, saveAttraction, deleteAttraction } from '@/utils/srmStorage';
// import { TIME_SLOTS } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants'; // Adjust path as needed
// // import { generatePO } from '@/utils/generatePO';


// export default function ActivitySRMPage() {
//   const { attractions, suppliers, refreshAll, searchText } = useSRM();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Accordion State
//   const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
//   const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

//   // Form State
//   const initialForm: AttractionData = {
//     id: '', name: '', type: 'Monument', city: '', country: '',
//     linkedSupplierId: '', duration: '2 Hours', suggestedSlot: 'Morning', startTime: '09:00',
//     pickupLocation: '', entranceFee: 0, activityFee: 0,
//     isGuideRequired: false, guideFee: 0, rating: 5, reviewsCount: 0,
//     providerLink: '', description: '', imageUrl: '', status: 'Active'
//   };
//   const [formData, setFormData] = useState<AttractionData>(initialForm);

//   // --- LOGIC 1: SMART SUPPLIER FILTERING ---
//   // Only show suppliers that:
//   // 1. Are Active
//   // 2. Have the 'Activity' service
//   // 3. Match the City entered in the form (if any)
//   const availableSuppliers = useMemo(() => {
//     return suppliers.filter(s => {
//       const basicCheck = s.status === 'Active' && s.services.includes('Activity');
//       const cityCheck = formData.city 
//         ? s.city.toLowerCase().trim() === formData.city.toLowerCase().trim() 
//         : true; // If no city typed yet, show all activity providers
//       return basicCheck && cityCheck;
//     });
//   }, [suppliers, formData.city]);

//   // --- LOGIC 2: AUTO-DEFAULT SELECTION ---
//   // When City changes, find if there is a PREFERRED partner in that city.
//   // If yes, auto-select them.
//   useEffect(() => {
//      if(isModalOpen && formData.city && !formData.linkedSupplierId) {
//         // Find a preferred supplier in this specific city
//         const preferred = suppliers.find(s => 
//            s.status === 'Active' &&
//            s.services.includes('Activity') &&
//            s.city.toLowerCase().trim() === formData.city.toLowerCase().trim() &&
//            s.isPreferred
//         );

//         if(preferred) {
//            setFormData(prev => ({...prev, linkedSupplierId: preferred.id}));
//         }
//      }
//   }, [formData.city, isModalOpen, suppliers]);

//   // --- LOGIC 3: INFO PANEL DATA ---
//   const selectedSupplierData = suppliers.find(s => s.id === formData.linkedSupplierId);

//   // --- VIEW LOGIC: GROUPING ---
//   const groupedData = useMemo(() => {
//     const filtered = attractions.filter(a => 
//       (a.name || "").toLowerCase().includes(searchText.toLowerCase()) || 
//       (a.city || "").toLowerCase().includes(searchText.toLowerCase())
//     );

//     const groups: Record<string, Record<string, AttractionData[]>> = {};
//     filtered.forEach(item => {
//       const country = (item.country || "Other Locations").trim();
//       const city = (item.city || "General").trim();
//       if (!groups[country]) groups[country] = {};
//       if (!groups[country][city]) groups[country][city] = [];
//       groups[country][city].push(item);
//     });

//     return Object.keys(groups).sort().reduce((acc, country) => {
//       acc[country] = groups[country];
//       return acc;
//     }, {} as Record<string, Record<string, AttractionData[]>>);

//   }, [attractions, searchText]);

//   // Auto-Expand Logic
//   useEffect(() => {
//     if (searchText) {
//       const allCountries = Object.keys(groupedData);
//       setExpandedCountries(allCountries.reduce((acc, key) => ({...acc, [key]: true}), {}));
//       const newExpCities: Record<string, boolean> = {};
//       allCountries.forEach(c => {
//           Object.keys(groupedData[c]).forEach(city => newExpCities[`${c}-${city}`] = true);
//       });
//       setExpandedCities(newExpCities);
//     }
//   }, [searchText, groupedData]);

//   const handleEdit = (item: AttractionData) => { setFormData(item); setIsModalOpen(true); };
//   const handleDelete = (id: string) => { if (confirm('Delete?')) { deleteAttraction(id); refreshAll(); } };
  
//   const handleSave = () => {
//     if (!formData.name || !formData.city) return alert("Name and City required");
//     const cleanData = { ...formData, country: formData.country.trim().charAt(0).toUpperCase() + formData.country.trim().slice(1) };
//     saveAttraction(cleanData);
//     refreshAll();
//     setIsModalOpen(false);
//     setFormData(initialForm);
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
//       reader.readAsDataURL(file);
//     }
//   };

//   const existingCountries = Array.from(new Set(attractions.map(a => a.country).filter(Boolean))).sort();



//   return (
//    <div className="h-full w-full flex flex-col relative overflow-hidden">
//       <div className="absolute inset-0 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
//       <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm" />

//      <div className="flex-1 flex flex-col relative z-10 h-full">
//           <div className="bg-white/95 border-b border-white/50 px-6 py-4 flex justify-between items-center backdrop-blur-md shadow-sm z-10">
//              <div>
//                 <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Ticket className="text-blue-600" /> Activity Inventory</h1>
//                 <p className="text-xs text-gray-600 font-medium">Manage tours, monuments, and experiences.</p>
//              </div>
//              <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
//                <Plus size={18} /> Add Activity
//              </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
//              {Object.keys(groupedData).length === 0 ? (
//                  <div className="flex flex-col items-center justify-center h-64 text-gray-600 bg-white/40 rounded-xl border border-white/50 backdrop-blur-sm">
//                     <Ticket size={48} className="opacity-50 mb-2"/>
//                     <p className="font-bold">No activities found.</p>
//                  </div>
//              ) : (
//                  Object.entries(groupedData).map(([country, cities]) => (
//                     <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
//                         <div onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))} className="flex items-center bg-white/95 p-4 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white transition-all select-none border border-white/50 backdrop-blur-sm mb-2">
//                             <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:text-blue-800 transition-colors">
//                                 {expandedCountries[country] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
//                             </div>
//                             <div className="flex-1"><h3 className="font-bold text-gray-800 text-lg flex items-center gap-2"><Globe size={18} className="text-blue-600" />{country}</h3></div>
//                             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Activities</span>
//                         </div>
//                         {expandedCountries[country] && (
//                             <div className="ml-4 pl-4 border-l-2 border-white/40 space-y-3">
//                                 {Object.entries(cities).map(([city, items]) => {
//                                     const cityKey = `${country}-${city}`;
//                                     return (
//                                         <div key={city}>
//                                             <div onClick={() => setExpandedCities(prev => ({...prev, [cityKey]: !prev[cityKey]}))} className="flex items-center bg-white/95 p-3 rounded-lg gap-2 cursor-pointer hover:bg-white/80 transition-all select-none border border-white/30 backdrop-blur-sm mb-2">
//                                                 {expandedCities[cityKey] ? <ChevronDown size={16} className="text-gray-500"/> : <ChevronRight size={16} className="text-gray-500"/>}
//                                                 <MapPin size={16} className="text-red-800" /><span className="font-bold text-gray-900">{city}</span>
//                                                 <span className="text-xs text-gray-900 bg-blue-200 px-2 py-0.5 rounded-full">{items.length}</span>
//                                             </div>
//                                             {expandedCities[cityKey] && (
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-6 mb-4">
//                                                     {items.map((item) => {
//                                                         const sup = suppliers.find(s => s.id === item.linkedSupplierId);
//                                                         return (
//                                                             <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col overflow-hidden">
//                                                                 <div className="h-32 bg-gray-100 relative shrink-0 overflow-hidden">
//                                                                     {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500"><ImageIcon size={48} className="text-white opacity-50"/></div>}
//                                                                     <span className="absolute top-3 left-3 text-[10px] bg-white/90 backdrop-blur-md px-2 py-1 rounded shadow uppercase font-bold tracking-wide border border-white/50">{item.type}</span>
//                                                                     <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded shadow text-xs font-bold flex items-center gap-1"><Star size={10} className="fill-yellow-700 text-yellow-700"/> {item.rating}</div>
//                                                                 </div>
//                                                                 <div className="p-5 flex-1 flex flex-col">
//                                                                     <h3 className="font-bold text-gray-900 text-[16px] leading-tight truncate " title={item.name}>{item.name}</h3>
//                                                                     <div className="flex items-center text-xs text-gray-700 font-medium mb-1 mt-1"><MapPin size={14} className="mr-1 text-blue-500 shrink-0" /><span className="truncate">{item.city}, {item.country}</span></div>
//                                                                     {sup && <div className="flex items-center gap-1 mb-2 text-[10px] bg-blue-50 text-blue-800 px-2 py-1 rounded w-fit"><Briefcase size={10} /> <span className="truncate max-w-[150px]">By: {sup.name}</span></div>}
//                                                                     <div className="grid grid-cols-2 gap-2 mb-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
//                                                                        <div><div className="text-[10px] text-gray-600 uppercase font-bold tracking-wide">Time Slot</div><div className="text-sm font-bold text-gray-700">{item.suggestedSlot}</div></div>
//                                                                        <div><div className="text-[10px] text-gray-600 uppercase font-bold tracking-wide">Duration</div><div className="text-sm font-bold text-gray-700 flex items-center gap-1"><Clock size={12}/> {item.duration}</div></div>
//                                                                        <div><div className="text-[10px] text-gray-600 uppercase font-bold tracking-wide mt-1">Total Cost</div><div className="text-sm font-bold text-green-700">${item.entranceFee + item.activityFee + (item.isGuideRequired ? item.guideFee : 0)}</div></div>
//                                                                     </div>
//                                                                     <div className="mt-auto border-t border-gray-100 flex items-center gap-3 pt-2">
//                                                                         <button onClick={() => handleEdit(item)} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"><Edit size={14} /> Edit</button>
//                                                                         <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"><Trash2 size={14} /> Delete</button>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         );
//                                                     })}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         )}
//                     </div>
//                  ))
//              )}
//           </div>
//       </div>

//       {/* MODAL FORM */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
//            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
//                  <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Activity' : 'Add New Activity'}</h2>
//                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
//               </div>
//               <div className="p-6 overflow-y-auto">
//                  <div className="grid grid-cols-12 gap-6">
//                     <div className="col-span-4 space-y-4">
//                         <div onClick={() => fileInputRef.current?.click()} className="h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 bg-cover bg-center relative group transition-colors" style={{ backgroundImage: `url(${formData.imageUrl})` }}>
//                             {!formData.imageUrl && (<div className="flex flex-col items-center text-gray-400"><ImageIcon size={40} className="mb-2"/><span className="text-xs font-bold">Upload Activity Image</span></div>)}
//                             <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
//                         </div>
//                         <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
//                            <label className="block text-xs font-bold text-yellow-800 mb-2">Rating & Reviews</label>
//                            <div className="flex gap-2">
//                               <div className="relative w-20"><Star size={14} className="absolute left-2 top-2.5 text-yellow-600" /><input type="number" max="5" min="1" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value) || 0})} className="w-full pl-7 p-2 border border-yellow-300 bg-white rounded-lg text-sm font-bold" /></div>
//                               <input type="number" placeholder="Count" value={formData.reviewsCount} onChange={e => setFormData({...formData, reviewsCount: parseInt(e.target.value) || 0})} className="flex-1 p-2 border border-yellow-300 bg-white rounded-lg text-sm" />
//                            </div>
//                         </div>
//                     </div>

//                     <div className="col-span-8 space-y-5">
//                         {/* --- INTELLIGENT SUPPLIER SECTION --- */}
//                         <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-4 items-start">
//                             <div className="flex-1">
//                                 <label className="block text-xs font-bold text-blue-900 mb-2 flex items-center gap-1"><Briefcase size={14} /> Fulfillment Partner (DMC)</label>
//                                 <select 
//                                     className="w-full p-2.5 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
//                                     value={formData.linkedSupplierId || ""}
//                                     onChange={(e) => setFormData({...formData, linkedSupplierId: e.target.value})}
//                                 >
//                                     <option value="">-- Direct / Unknown --</option>
//                                     {availableSuppliers.map(s => (
//                                         <option key={s.id} value={s.id}>
//                                             {s.name} ({s.city}) {s.isPreferred ? '★ Preferred' : ''}
//                                         </option>
//                                     ))}
//                                     {/* Fallback: If current linked supplier is not in the list (e.g., changed city), show it anyway */}
//                                     {formData.linkedSupplierId && !availableSuppliers.find(s => s.id === formData.linkedSupplierId) && selectedSupplierData && (
//                                          <option value={selectedSupplierData.id}>{selectedSupplierData.name} (Current) - *Warning: Different City*</option>
//                                     )}
//                                 </select>
//                                 {availableSuppliers.length === 0 && formData.city && (
//                                     <p className="text-[10px] text-red-500 mt-1">No Activity suppliers found in {formData.city}.</p>
//                                 )}
//                             </div>
                            
//                             {/* ENHANCED PREVIEW BOX */}
//                             {selectedSupplierData && (
//                                 <div className="flex-1 bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-xs">
//                                     <div className="font-bold text-gray-800 mb-2 flex justify-between items-center border-b border-gray-100 pb-1">
//                                         <span>{selectedSupplierData.contactPerson}</span>
//                                         {selectedSupplierData.isPreferred && <span className="bg-orange-100 text-orange-700 px-1.5 rounded text-[10px]">Preferred</span>}
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-600">
//                                         <div className="flex items-center gap-1"><Phone size={10}/> {selectedSupplierData.phone}</div>
//                                         <div className="flex items-center gap-1"><CreditCard size={10}/> {selectedSupplierData.paymentTerms}</div>
//                                         <div className="col-span-2 flex items-center gap-1 truncate" title={selectedSupplierData.email}><Mail size={10}/> {selectedSupplierData.email}</div>
//                                         <div className="col-span-2 flex items-center gap-1 font-bold text-blue-800 bg-blue-50 px-1 rounded"><DollarSign size={10}/> Currency: {selectedSupplierData.currency || 'USD'}</div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Basic Fields */}
//                         <div className="grid grid-cols-2 gap-4">
//                             <div><label className="block text-xs font-bold text-gray-500 mb-1">Activity Name *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Colosseum Tour" /></div>
//                             <div><label className="block text-xs font-bold text-gray-500 mb-1">Type</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white"><option>Monument</option><option>Attraction</option><option>Museum</option><option>Adventure</option><option>Show</option><option>None</option></select></div>
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div><label className="block text-xs font-bold text-gray-500 mb-1">City *</label><input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Rome"/></div>
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-500 mb-1">Country</label>
//                                 <input list="country-suggestions" type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Type or select..." />
//                                 <datalist id="country-suggestions">{existingCountries.map(c => <option key={c} value={c} />)}</datalist>
//                             </div>
//                         </div>
//                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-3 gap-4">
//                             <div><label className="block text-xs font-bold text-gray-500 mb-1">Time Slot</label>
//                             {/* <select value={formData.suggestedSlot} onChange={e => setFormData({...formData, suggestedSlot: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"><option>Early Morning</option><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Full Day</option>
//                             </select> */}
                            
//                             <select 
//     value={formData.suggestedSlot} 
//     onChange={e => setFormData({...formData, suggestedSlot: e.target.value})} 
//     className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"
// >
//     {/* Option 1: Map the constant so it is always 100% same as builder */}
//     {TIME_SLOTS.map(slot => (
//         <option key={slot.value} value={slot.value}>{slot.label}</option>
//     ))}
// </select>
//                             </div>
//                             <div><label className="block text-xs font-bold text-gray-500 mb-1">Start Time</label><input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" /></div>
//                             <div><label className="block text-xs font-bold text-gray-500 mb-1">Duration</label><input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. 2 Hours" /></div>
//                             <div className="col-span-3"><label className="block text-xs font-bold text-gray-500 mb-1">Default Pickup Location</label><input type="text" value={formData.pickupLocation} onChange={e => setFormData({...formData, pickupLocation: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Hotel Lobby" /></div>
//                         </div>
//                         <div><label className="block text-xs font-bold text-gray-500 mb-1">Description</label><textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Short description..." /></div>
//                         <div className="bg-green-50 p-4 rounded-xl border border-green-200">
//                             <div className="flex items-center gap-2 mb-3"><DollarSign size={16} className="text-green-700"/><span className="text-xs font-bold text-green-800 uppercase tracking-wider">Pricing Configuration</span></div>
//                             <div className="grid grid-cols-2 gap-4 mb-4">
//                                 <div><label className="block text-xs font-bold text-green-700 mb-1">Entrance Fee ($)</label><input type="number" value={formData.entranceFee} onChange={e => setFormData({...formData, entranceFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-green-300 rounded-lg text-sm font-bold" /></div>
//                                 <div><label className="block text-xs font-bold text-green-700 mb-1">Activity Fee ($)</label><input type="number" value={formData.activityFee} onChange={e => setFormData({...formData, activityFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-green-300 rounded-lg text-sm font-bold" /></div>
//                             </div>
//                             <div className="pt-3 border-t border-green-200">
//                                 <div className="flex items-center gap-2 mb-2"><input type="checkbox" checked={formData.isGuideRequired} onChange={e => setFormData({...formData, isGuideRequired: e.target.checked})} className="w-4 h-4 text-blue-600 rounded cursor-pointer" /><span className="text-sm font-bold text-gray-700">Guide is Required?</span></div>
//                                 {formData.isGuideRequired && (<div className="animate-in fade-in slide-in-from-top-1"><label className="block text-xs font-bold text-green-700 mb-1">Guide Fee ($)</label><input type="number" value={formData.guideFee} onChange={e => setFormData({...formData, guideFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-green-300 rounded-lg text-sm font-bold bg-white" placeholder="Cost for the Guide" /></div>)}
//                             </div>
//                         </div>
//                     </div>
//                  </div>
//               </div>
//               <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 shrink-0">
//                  <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"><Save size={18} /> Save Activity</button>
//               </div>
//            </div>
//         </div>
//       )}
//     </div>
//   );
// }



































































































// "use client";

// import React, { useState, useRef, useMemo, useEffect } from 'react';
// import { 
//   Plus, MapPin, Search, Star, 
//   Trash2, X, Save, Image as ImageIcon, 
//   ChevronDown, ChevronRight, Globe, Clock, Ticket, User, Edit,
//   Briefcase, Phone, Mail, CreditCard, DollarSign
// } from 'lucide-react';
// import { useSRM } from '@/app/context/SRMContext';
// import { AttractionData, saveAttraction, deleteAttraction } from '@/utils/srmStorage';
// import { TIME_SLOTS } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants'; // Adjust path as needed
// // import { generatePO } from '@/utils/generatePO';


// export default function ActivitySRMPage() {
//   const { attractions, suppliers, refreshAll, searchText } = useSRM();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Accordion State
//   const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
//   const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

//   // Form State
//   const initialForm: AttractionData = {
//     id: '', name: '', type: 'Monument', city: '', country: '',
//     linkedSupplierId: '', duration: '2 Hours', suggestedSlot: 'Morning', startTime: '09:00',
//     pickupLocation: '', entranceFee: 0, activityFee: 0,
//     isGuideRequired: false, guideFee: 0, rating: 5, reviewsCount: 0,
//     providerLink: '', description: '', imageUrl: '', status: 'Active'
//   };
//   const [formData, setFormData] = useState<AttractionData>(initialForm);

//   // --- LOGIC 1: SMART SUPPLIER FILTERING ---
//   // Only show suppliers that:
//   // 1. Are Active
//   // 2. Have the 'Activity' service
//   // 3. Match the City entered in the form (if any)
//   const availableSuppliers = useMemo(() => {
//     return suppliers.filter(s => {
//       const basicCheck = s.status === 'Active' && s.services.includes('Activity');
//       const cityCheck = formData.city 
//         ? s.city.toLowerCase().trim() === formData.city.toLowerCase().trim() 
//         : true; // If no city typed yet, show all activity providers
//       return basicCheck && cityCheck;
//     });
//   }, [suppliers, formData.city]);

//   // --- LOGIC 2: AUTO-DEFAULT SELECTION ---
//   // When City changes, find if there is a PREFERRED partner in that city.
//   // If yes, auto-select them.
//   useEffect(() => {
//      if(isModalOpen && formData.city && !formData.linkedSupplierId) {
//         // Find a preferred supplier in this specific city
//         const preferred = suppliers.find(s => 
//            s.status === 'Active' &&
//            s.services.includes('Activity') &&
//            s.city.toLowerCase().trim() === formData.city.toLowerCase().trim() &&
//            s.isPreferred
//         );

//         if(preferred) {
//            setFormData(prev => ({...prev, linkedSupplierId: preferred.id}));
//         }
//      }
//   }, [formData.city, isModalOpen, suppliers]);

//   // --- LOGIC 3: INFO PANEL DATA ---
//   const selectedSupplierData = suppliers.find(s => s.id === formData.linkedSupplierId);

//   // --- VIEW LOGIC: GROUPING ---
//   const groupedData = useMemo(() => {
//     const filtered = attractions.filter(a => 
//       (a.name || "").toLowerCase().includes(searchText.toLowerCase()) || 
//       (a.city || "").toLowerCase().includes(searchText.toLowerCase())
//     );

//     const groups: Record<string, Record<string, AttractionData[]>> = {};
//     filtered.forEach(item => {
//       const country = (item.country || "Other Locations").trim();
//       const city = (item.city || "General").trim();
//       if (!groups[country]) groups[country] = {};
//       if (!groups[country][city]) groups[country][city] = [];
//       groups[country][city].push(item);
//     });

//     return Object.keys(groups).sort().reduce((acc, country) => {
//       acc[country] = groups[country];
//       return acc;
//     }, {} as Record<string, Record<string, AttractionData[]>>);

//   }, [attractions, searchText]);

//   // Auto-Expand Logic
//   useEffect(() => {
//     if (searchText) {
//       const allCountries = Object.keys(groupedData);
//       setExpandedCountries(allCountries.reduce((acc, key) => ({...acc, [key]: true}), {}));
//       const newExpCities: Record<string, boolean> = {};
//       allCountries.forEach(c => {
//           Object.keys(groupedData[c]).forEach(city => newExpCities[`${c}-${city}`] = true);
//       });
//       setExpandedCities(newExpCities);
//     }
//   }, [searchText, groupedData]);

//   const handleEdit = (item: AttractionData) => { setFormData(item); setIsModalOpen(true); };
//   const handleDelete = (id: string) => { if (confirm('Delete?')) { deleteAttraction(id); refreshAll(); } };
  
//   const handleSave = () => {
//     if (!formData.name || !formData.city) return alert("Name and City required");
//     const cleanData = { ...formData, country: formData.country.trim().charAt(0).toUpperCase() + formData.country.trim().slice(1) };
//     saveAttraction(cleanData);
//     refreshAll();
//     setIsModalOpen(false);
//     setFormData(initialForm);
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
//       reader.readAsDataURL(file);
//     }
//   };

//   const existingCountries = Array.from(new Set(attractions.map(a => a.country).filter(Boolean))).sort();



//   return (
//    <div className="h-full w-full flex flex-col relative overflow-hidden">
//       <div className="absolute inset-0 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
//       <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm" />

//      <div className="flex-1 flex flex-col relative z-10 h-full">
//           <div className="bg-white/95 border-b border-white/50 px-6 py-4 flex justify-between items-center backdrop-blur-md shadow-sm z-10">
//              <div>
//                 <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Ticket className="text-blue-600" /> Activity Inventory</h1>
//                 <p className="text-xs text-gray-600 font-medium">Manage tours, monuments, and experiences.</p>
//              </div>
//              <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
//                <Plus size={18} /> Add Activity
//              </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
//              {Object.keys(groupedData).length === 0 ? (
//                  <div className="flex flex-col items-center justify-center h-64 text-gray-600 bg-white/40 rounded-xl border border-white/50 backdrop-blur-sm">
//                     <Ticket size={48} className="opacity-50 mb-2"/>
//                     <p className="font-bold">No activities found.</p>
//                  </div>
//              ) : (
//                  Object.entries(groupedData).map(([country, cities]) => (
//                     <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
//                         <div onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))} className="flex items-center bg-white/95 p-4 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white transition-all select-none border border-white/50 backdrop-blur-sm mb-2">
//                             <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:text-blue-800 transition-colors">
//                                 {expandedCountries[country] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
//                             </div>
//                             <div className="flex-1"><h3 className="font-bold text-gray-800 text-lg flex items-center gap-2"><Globe size={18} className="text-blue-600" />{country}</h3></div>
//                             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Activities</span>
//                         </div>
//                         {expandedCountries[country] && (
//                             <div className="ml-4 pl-4 border-l-2 border-white/40 space-y-3">
//                                 {Object.entries(cities).map(([city, items]) => {
//                                     const cityKey = `${country}-${city}`;
//                                     return (
//                                         <div key={city}>
//                                             <div onClick={() => setExpandedCities(prev => ({...prev, [cityKey]: !prev[cityKey]}))} className="flex items-center bg-white/95 p-3 rounded-lg gap-2 cursor-pointer hover:bg-white/80 transition-all select-none border border-white/30 backdrop-blur-sm mb-2">
//                                                 {expandedCities[cityKey] ? <ChevronDown size={16} className="text-gray-500"/> : <ChevronRight size={16} className="text-gray-500"/>}
//                                                 <MapPin size={16} className="text-red-800" /><span className="font-bold text-gray-900">{city}</span>
//                                                 <span className="text-xs text-gray-900 bg-blue-200 px-2 py-0.5 rounded-full">{items.length}</span>
//                                             </div>
//                                             {expandedCities[cityKey] && (
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-6 mb-4">
//                                                     {items.map((item) => {
//                                                         const sup = suppliers.find(s => s.id === item.linkedSupplierId);
//                                                         return (
//                                                             <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col overflow-hidden">
//                                                                 <div className="h-32 bg-gray-100 relative shrink-0 overflow-hidden">
//                                                                     {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500"><ImageIcon size={48} className="text-white opacity-50"/></div>}
//                                                                     <span className="absolute top-3 left-3 text-[10px] bg-white/90 backdrop-blur-md px-2 py-1 rounded shadow uppercase font-bold tracking-wide border border-white/50">{item.type}</span>
//                                                                     <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded shadow text-xs font-bold flex items-center gap-1"><Star size={10} className="fill-yellow-700 text-yellow-700"/> {item.rating}</div>
//                                                                 </div>
//                                                                 <div className="p-5 flex-1 flex flex-col">
//                                                                     <h3 className="font-bold text-gray-900 text-[16px] leading-tight truncate " title={item.name}>{item.name}</h3>
//                                                                     <div className="flex items-center text-xs text-gray-700 font-medium mb-1 mt-1"><MapPin size={14} className="mr-1 text-blue-500 shrink-0" /><span className="truncate">{item.city}, {item.country}</span></div>
//                                                                     {sup && <div className="flex items-center gap-1 mb-2 text-[10px] bg-blue-50 text-blue-800 px-2 py-1 rounded w-fit"><Briefcase size={10} /> <span className="truncate max-w-[150px]">By: {sup.name}</span></div>}
//                                                                     <div className="grid grid-cols-2 gap-2 mb-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
//                                                                        <div><div className="text-[10px] text-gray-600 uppercase font-bold tracking-wide">Time Slot</div><div className="text-sm font-bold text-gray-700">{item.suggestedSlot}</div></div>
//                                                                        <div><div className="text-[10px] text-gray-600 uppercase font-bold tracking-wide">Duration</div><div className="text-sm font-bold text-gray-700 flex items-center gap-1"><Clock size={12}/> {item.duration}</div></div>
//                                                                     </div>
//                                                                     <div className="mt-auto border-t border-gray-100 flex items-center gap-3 pt-2">
//                                                                         <button onClick={() => handleEdit(item)} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"><Edit size={14} /> Edit</button>
//                                                                         <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"><Trash2 size={14} /> Delete</button>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         );
//                                                     })}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         )}
//                     </div>
//                  ))
//              )}
//           </div>
//       </div>

//       {/* MODAL FORM */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
//            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
//                  <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Activity' : 'Add New Activity'}</h2>
//                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
//               </div>
//               <div className="p-6 overflow-y-auto">
//                  <div className="grid grid-cols-12 gap-6">
//                     <div className="col-span-4 space-y-4">
//                         <div onClick={() => fileInputRef.current?.click()} className="h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 bg-cover bg-center relative group transition-colors" style={{ backgroundImage: `url(${formData.imageUrl})` }}>
//                             {!formData.imageUrl && (<div className="flex flex-col items-center text-gray-400"><ImageIcon size={40} className="mb-2"/><span className="text-xs font-bold">Upload Activity Image</span></div>)}
//                             <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
//                         </div>
//                         <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
//                            <label className="block text-xs font-bold text-yellow-800 mb-2">Rating & Reviews</label>
//                            <div className="flex gap-2">
//                               <div className="relative w-20"><Star size={14} className="absolute left-2 top-2.5 text-yellow-600" /><input type="number" max="5" min="1" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value) || 0})} className="w-full pl-7 p-2 border border-yellow-300 bg-white rounded-lg text-sm font-bold" /></div>
//                               <input type="number" placeholder="Count" value={formData.reviewsCount} onChange={e => setFormData({...formData, reviewsCount: parseInt(e.target.value) || 0})} className="flex-1 p-2 border border-yellow-300 bg-white rounded-lg text-sm" />
//                            </div>
//                         </div>
//                     </div>

//                     <div className="col-span-8 space-y-5">
//                         {/* --- INTELLIGENT SUPPLIER SECTION --- */}
//                         <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-4 items-start">
//                             <div className="flex-1">
//                                 <label className="block text-xs font-bold text-blue-900 mb-2 flex items-center gap-1"><Briefcase size={14} /> Fulfillment Partner (DMC)</label>
//                                 <select 
//                                     className="w-full p-2.5 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
//                                     value={formData.linkedSupplierId || ""}
//                                     onChange={(e) => setFormData({...formData, linkedSupplierId: e.target.value})}
//                                 >
//                                     <option value="">-- Direct / Unknown --</option>
//                                     {availableSuppliers.map(s => (
//                                         <option key={s.id} value={s.id}>
//                                             {s.name} ({s.city}) {s.isPreferred ? '★ Preferred' : ''}
//                                         </option>
//                                     ))}
//                                     {/* Fallback: If current linked supplier is not in the list (e.g., changed city), show it anyway */}
//                                     {formData.linkedSupplierId && !availableSuppliers.find(s => s.id === formData.linkedSupplierId) && selectedSupplierData && (
//                                          <option value={selectedSupplierData.id}>{selectedSupplierData.name} (Current) - *Warning: Different City*</option>
//                                     )}
//                                 </select>
//                                 {availableSuppliers.length === 0 && formData.city && (
//                                     <p className="text-[10px] text-red-500 mt-1">No Activity suppliers found in {formData.city}.</p>
//                                 )}
//                             </div>
                            
//                             {/* ENHANCED PREVIEW BOX */}
//                             {selectedSupplierData && (
//                                 <div className="flex-1 bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-xs">
//                                     <div className="font-bold text-gray-800 mb-2 flex justify-between items-center border-b border-gray-100 pb-1">
//                                         <span>{selectedSupplierData.contactPerson}</span>
//                                         {selectedSupplierData.isPreferred && <span className="bg-orange-100 text-orange-700 px-1.5 rounded text-[10px]">Preferred</span>}
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-600">
//                                         <div className="flex items-center gap-1"><Phone size={10}/> {selectedSupplierData.phone}</div>
//                                         <div className="flex items-center gap-1"><CreditCard size={10}/> {selectedSupplierData.paymentTerms}</div>
//                                         <div className="col-span-2 flex items-center gap-1 truncate" title={selectedSupplierData.email}><Mail size={10}/> {selectedSupplierData.email}</div>
//                                         <div className="col-span-2 flex items-center gap-1 font-bold text-blue-800 bg-blue-50 px-1 rounded"><DollarSign size={10}/> Currency: {selectedSupplierData.currency || 'USD'}</div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Basic Fields */}
//                         <div className="grid grid-cols-2 gap-4">
//                             <div><label className="block text-xs font-bold text-gray-500 mb-1">Activity Name *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Colosseum Tour" /></div>
//                             <div><label className="block text-xs font-bold text-gray-500 mb-1">Type</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white"><option>Monument</option><option>Attraction</option><option>Museum</option><option>Adventure</option><option>Show</option><option>None</option></select></div>
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div><label className="block text-xs font-bold text-gray-500 mb-1">City *</label><input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Rome"/></div>
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-500 mb-1">Country</label>
//                                 <input list="country-suggestions" type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Type or select..." />
//                                 <datalist id="country-suggestions">{existingCountries.map(c => <option key={c} value={c} />)}</datalist>
//                             </div>
//                         </div>
//                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-3 gap-4">
//                             <div><label className="block text-xs font-bold text-gray-500 mb-1">Time Slot</label>
                            
//                             <select 
//     value={formData.suggestedSlot} 
//     onChange={e => setFormData({...formData, suggestedSlot: e.target.value})} 
//     className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"
// >
//     {/* Option 1: Map the constant so it is always 100% same as builder */}
//     {TIME_SLOTS.map(slot => (
//         <option key={slot.value} value={slot.value}>{slot.label}</option>
//     ))}
// </select>
//                             </div>
//                             <div><label className="block text-xs font-bold text-gray-500 mb-1">Start Time</label><input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" /></div>
//                             <div><label className="block text-xs font-bold text-gray-500 mb-1">Duration</label><input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. 2 Hours" /></div>
//                             <div className="col-span-3"><label className="block text-xs font-bold text-gray-500 mb-1">Default Pickup Location</label><input type="text" value={formData.pickupLocation} onChange={e => setFormData({...formData, pickupLocation: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Hotel Lobby" /></div>
//                         </div>
//                         <div><label className="block text-xs font-bold text-gray-500 mb-1">Description</label><textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Short description..." /></div>

//                     </div>
//                  </div>
//               </div>
//               <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 shrink-0">
//                  <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"><Save size={18} /> Save Activity</button>
//               </div>
//            </div>
//         </div>
//       )}
//     </div>
//   );
// } 




















































































"use client";

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Plus, MapPin, Star, Trash2, X, Save, Image as ImageIcon, 
  ChevronDown, ChevronRight, Globe, Clock, Ticket, Edit,
  Briefcase, Phone, Mail, CreditCard, DollarSign, Loader2 , Download, Upload
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useSRM } from '@/app/context/SRMContext';
import { AttractionData, saveAttraction, deleteAttraction } from '@/utils/srmStorage';
import { TIME_SLOTS } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants'; 

export default function ActivitySRMPage() {
  const { attractions, suppliers, refreshAll, searchText, isLoading } = useSRM();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // NEW STATE
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 👈 NEW STATES FOR IMPORT/EXPORT
  const importInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

  const initialForm: AttractionData = {
    id: '', name: '', type: 'Monument', city: '', country: '',
    linkedSupplierId: '', duration: '2 Hours', suggestedSlot: 'Morning', startTime: '09:00',
    pickupLocation: '', isGuideRequired: false, rating: 5, reviewsCount: 0,
    providerLink: '', description: '', imageUrl: '', status: 'Active'
  };
  const [formData, setFormData] = useState<AttractionData>(initialForm);

  const availableSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const basicCheck = s.status === 'Active' && s.services.includes('Activity');
      const cityCheck = formData.city 
        ? s.city.toLowerCase().trim() === formData.city.toLowerCase().trim() 
        : true; 
      return basicCheck && cityCheck;
    });
  }, [suppliers, formData.city]);

  useEffect(() => {
     if(isModalOpen && formData.city && !formData.linkedSupplierId) {
        const preferred = suppliers.find(s => 
           s.status === 'Active' &&
           s.services.includes('Activity') &&
           s.city.toLowerCase().trim() === formData.city.toLowerCase().trim() &&
           s.isPreferred
        );
        if(preferred) {
           setFormData(prev => ({...prev, linkedSupplierId: preferred.id}));
        }
     }
  }, [formData.city, isModalOpen, suppliers]);

  const selectedSupplierData = suppliers.find(s => s.id === formData.linkedSupplierId);

  const groupedData = useMemo(() => {
    const filtered = attractions.filter(a => 
      (a.name || "").toLowerCase().includes(searchText.toLowerCase()) || 
      (a.city || "").toLowerCase().includes(searchText.toLowerCase())
    );

    const groups: Record<string, Record<string, AttractionData[]>> = {};
    filtered.forEach(item => {
      const country = (item.country || "Other Locations").trim();
      const city = (item.city || "General").trim();
      if (!groups[country]) groups[country] = {};
      if (!groups[country][city]) groups[country][city] = [];
      groups[country][city].push(item);
    });

    return Object.keys(groups).sort().reduce((acc, country) => {
      acc[country] = groups[country];
      return acc;
    }, {} as Record<string, Record<string, AttractionData[]>>);

  }, [attractions, searchText]);

  useEffect(() => {
    if (searchText) {
      const allCountries = Object.keys(groupedData);
      setExpandedCountries(allCountries.reduce((acc, key) => ({...acc, [key]: true}), {}));
      const newExpCities: Record<string, boolean> = {};
      allCountries.forEach(c => {
          Object.keys(groupedData[c]).forEach(city => newExpCities[`${c}-${city}`] = true);
      });
      setExpandedCities(newExpCities);
    }
  }, [searchText, groupedData]);

  const handleEdit = (item: AttractionData) => { setFormData(item); setIsModalOpen(true); };
  
  // CHANGED: Async
  const handleDelete = async (id: string) => { 
    if (confirm('Delete?')) { 
      await deleteAttraction(id); 
      await refreshAll(); 
    } 
  };
  
  // CHANGED: Async
//   const handleSave = async () => {
//     if (!formData.name || !formData.city) return alert("Name and City required");
//     setIsSaving(true);
//     const cleanData = { ...formData, country: formData.country.trim().charAt(0).toUpperCase() + formData.country.trim().slice(1) };
//     const success = await saveAttraction(cleanData);
//     if(success) {
//       await refreshAll();
//       setIsModalOpen(false);
//       setFormData(initialForm);
//     } else {
//       alert("Failed to save.");
//     }
//     setIsSaving(false);
//   };


// --- EXPORT LOGIC ---
  const handleExport = () => {
    if (attractions.length === 0) return alert("No activities to export.");

    // Map data to user-friendly column names, EXCLUDING image URLs and IDs
    const exportData = attractions.map(item => ({
      'Activity Name': item.name,
      'Type': item.type || 'None',
      'City': item.city,
      'Country': item.country,
      'Time Slot': item.suggestedSlot || 'Morning',
      'Start Time': item.startTime || '09:00',
      'Duration': item.duration || '2 Hours',
      'Pickup Location': item.pickupLocation || '',
      'Rating': item.rating || 5,
      'Reviews Count': item.reviewsCount || 0,
      'Description': item.description || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activities");
    XLSX.writeFile(workbook, "Activity_Inventory.xlsx");
  };

  // --- IMPORT LOGIC ---
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const binaryStr = event.target?.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as any[];

        let successCount = 0;
        let errorCount = 0;

        // Loop through each row in the Excel/CSV file
        for (const row of parsedData) {
          const rowCity = row['City']?.toString().trim();
          const rowCountry = row['Country']?.toString().trim();

          // REQUIREMENT: City and Country must exist
          if (!rowCity || !rowCountry) {
            errorCount++;
            continue; 
          }

          // Format country properly (Capitalize first letter)
          const formattedCountry = rowCountry.charAt(0).toUpperCase() + rowCountry.slice(1);

          // Build the payload with defaults for optional fields
          const newActivity: any = {
            city: rowCity,
            country: formattedCountry,
            // If name is missing, generate a default one so the DB doesn't crash
            name: row['Activity Name'] || `Unnamed Activity in ${rowCity}`,
            type: row['Type'] || 'None',
            suggestedSlot: row['Time Slot'] || 'Morning',
            startTime: row['Start Time'] || '09:00',
            duration: row['Duration'] || '2 Hours',
            pickupLocation: row['Pickup Location'] || '',
            rating: parseFloat(row['Rating']) || 5,
            reviewsCount: parseInt(row['Reviews Count']) || 0,
            description: row['Description'] || '',
            status: 'Active',
            imageUrl: '', // Explicitly blank per requirements
            isGuideRequired: false,
          };

          // Save to database
          const success = await saveAttraction(newActivity);
          if (success) successCount++;
          else errorCount++;
        }

        alert(`Import Complete!\nSuccessfully added: ${successCount}\nSkipped/Failed (Missing City/Country): ${errorCount}`);
        
        // Refresh the UI to show the new folders instantly
        await refreshAll();

      } catch (error) {
        console.error("Import parsing error:", error);
        alert("Failed to read the file. Please ensure it is a valid Excel or CSV file.");
      } finally {
        setIsImporting(false);
        if (importInputRef.current) importInputRef.current.value = ''; // Reset input
      }
    };

    reader.readAsBinaryString(file);
  };



const handleSave = async () => {
    if (!formData.name || !formData.city) return alert("Name and City required");
    setIsSaving(true);
    
    try {
      // Safely capitalize country without crashing if it's empty
      const safeCountry = formData.country 
          ? formData.country.trim().charAt(0).toUpperCase() + formData.country.trim().slice(1) 
          : 'Unknown';
          
      const cleanData = { ...formData, country: safeCountry };
      
      // 👇 THE FIX: Strip out the empty string so Mongoose doesn't crash
      if (!cleanData.linkedSupplierId || cleanData.linkedSupplierId === "") {
          delete cleanData.linkedSupplierId;
      }
      
      const success = await saveAttraction(cleanData);
      
      if(success) {
        await refreshAll();
        setIsModalOpen(false);
        setFormData(initialForm);
      } else {
        alert("Failed to save. Please check your database connection.");
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save due to an unexpected error.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const existingCountries = Array.from(new Set(attractions.map(a => a.country).filter(Boolean))).sort();

  return (
   <div className="h-full w-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm" />

     <div className="flex-1 flex flex-col relative z-10 h-full">
        {/* HEADER SECTION */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
             <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Ticket className="text-blue-600" /> Activity Inventory</h1>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Manage tours, monuments, and experiences.</p>
             </div>
             
             <div className="flex items-center gap-3">
               {/* Hidden File Input for Import */}
               <input 
                 type="file" 
                 ref={importInputRef} 
                 onChange={handleImport} 
                 accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                 className="hidden" 
               />

               {/* Import Button */}
               <button 
                 onClick={() => importInputRef.current?.click()} 
                 disabled={isImporting}
                 className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
               >
                 {isImporting ? <Loader2 size={16} className="animate-spin text-blue-600" /> : <Upload size={16} className="text-gray-500" />}
                 {isImporting ? 'Importing...' : 'Import'}
               </button>

               {/* Export Button */}
               <button 
                 onClick={handleExport} 
                 className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all"
               >
                 <Download size={16} className="text-gray-500" /> Export
               </button>

               {/* Add Activity Button */}
               <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                 <Plus size={18} /> Add Activity
               </button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
             {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-white">
                    <Loader2 size={40} className="animate-spin mb-4 text-blue-300" />
                    <p className="font-medium text-lg drop-shadow-md">Loading Activities...</p>
                </div>
             ) : Object.keys(groupedData).length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-gray-600 bg-white/40 rounded-xl border border-white/50 backdrop-blur-sm">
                    <Ticket size={48} className="opacity-50 mb-2"/>
                    <p className="font-bold">No activities found.</p>
                 </div>
             ) : (
                Object.entries(groupedData).map(([country, cities]) => (
                    <motion.div layout key={country} className="mb-2">
                        {/* COUNTRY ACCORDION HEADER */}
                        <motion.div 
                            layout
                            onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))} 
                            className="flex items-center bg-white/95 p-4 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white transition-all select-none border border-white/50 backdrop-blur-sm relative z-10"
                        >
                            <motion.div 
                                animate={{ rotate: expandedCountries[country] ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:text-blue-800 transition-colors"
                            >
                                <ChevronRight size={20}/>
                            </motion.div>
                            <div className="flex-1"><h3 className="font-bold text-gray-800 text-lg flex items-center gap-2"><Globe size={18} className="text-blue-600" />{country}</h3></div>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Activities</span>
                        </motion.div>
                        
                        {/* COUNTRY CONTENT (CITIES) */}
                        <AnimatePresence initial={false}>
                            {expandedCountries[country] && (
                                <motion.div 
                                    key={`content-${country}`}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden" 
                                >
                                    <div className="ml-4 pl-4 border-l-2 border-white/40 space-y-3 pt-3 pb-2">
                                        {Object.entries(cities).map(([city, items]) => {
                                            const cityKey = `${country}-${city}`;
                                            return (
                                                <motion.div layout key={city} className="mb-2">
                                                    {/* CITY ACCORDION HEADER */}
                                                    <motion.div 
                                                        layout
                                                        onClick={() => setExpandedCities(prev => ({...prev, [cityKey]: !prev[cityKey]}))} 
                                                        className="flex items-center bg-white/95 p-3 rounded-lg gap-2 cursor-pointer hover:bg-white/80 transition-all select-none border border-white/30 backdrop-blur-sm relative z-10"
                                                    >
                                                        <motion.div
                                                            animate={{ rotate: expandedCities[cityKey] ? 90 : 0 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <ChevronRight size={16} className="text-gray-500"/>
                                                        </motion.div>
                                                        <MapPin size={16} className="text-red-800" /><span className="font-bold text-gray-900">{city}</span>
                                                        <span className="text-xs text-gray-900 bg-blue-200 px-2 py-0.5 rounded-full">{items.length}</span>
                                                    </motion.div>

                                                    {/* CITY CONTENT (CARDS) */}
                                                    <AnimatePresence initial={false}>
                                                        {expandedCities[cityKey] && (
                                                            <motion.div 
                                                                key={`content-${cityKey}`}
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                className="overflow-hidden" 
                                                            >
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-6 mb-4 pt-3 pb-2">
                                                                    {items.map((item) => {
                                                                        const sup = suppliers.find(s => s.id === item.linkedSupplierId);
                                                                        return (
                                                                            <motion.div 
                                                                                key={item.id} 
                                                                                layout
                                                                                initial={{ opacity: 0, y: 20 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                exit={{ opacity: 0, scale: 0.95 }}
                                                                                whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                                                                                transition={{ duration: 0.2 }}
                                                                                className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden"
                                                                            >
                                                                                <div className="h-32 bg-gray-100 relative shrink-0 overflow-hidden group">
                                                                                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500"><ImageIcon size={48} className="text-white opacity-50"/></div>}
                                                                                    <span className="absolute top-3 left-3 text-[10px] bg-white/90 backdrop-blur-md px-2 py-1 rounded shadow uppercase font-bold tracking-wide border border-white/50">{item.type}</span>
                                                                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded shadow text-xs font-bold flex items-center gap-1"><Star size={10} className="fill-yellow-700 text-yellow-700"/> {item.rating}</div>
                                                                                </div>
                                                                                <div className="p-5 flex-1 flex flex-col">
                                                                                    <h3 className="font-bold text-gray-900 text-[16px] leading-tight truncate " title={item.name}>{item.name}</h3>
                                                                                    <div className="flex items-center text-xs text-gray-700 font-medium mb-1 mt-1"><MapPin size={14} className="mr-1 text-blue-500 shrink-0" /><span className="truncate">{item.city}, {item.country}</span></div>
                                                                                    {sup && <div className="flex items-center gap-1 mb-2 text-[10px] bg-blue-50 text-blue-800 px-2 py-1 rounded w-fit"><Briefcase size={10} /> <span className="truncate max-w-[150px]">By: {sup.name}</span></div>}
                                                                                    <div className="grid grid-cols-2 gap-2 mb-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                                                       <div><div className="text-[10px] text-gray-600 uppercase font-bold tracking-wide">Time Slot</div><div className="text-sm font-bold text-gray-700">{item.suggestedSlot}</div></div>
                                                                                       <div><div className="text-[10px] text-gray-600 uppercase font-bold tracking-wide">Duration</div><div className="text-sm font-bold text-gray-700 flex items-center gap-1"><Clock size={12}/> {item.duration}</div></div>
                                                                                    </div>
                                                                                    <div className="mt-auto border-t border-gray-100 flex items-center gap-3 pt-2">
                                                                                        <button onClick={() => handleEdit(item)} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"><Edit size={14} /> Edit</button>
                                                                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id as string); }} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"><Trash2 size={14} /> Delete</button>
                                                                                    </div>
                                                                                </div>
                                                                            </motion.div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))
             )}
          </div>

          
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
                 <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Activity' : 'Add New Activity'}</h2>
                 <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="text-gray-400 hover:text-gray-600 disabled:opacity-50"><X size={20}/></button>
              </div>
              <div className="p-6 overflow-y-auto">
                 <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-4 space-y-4">
                        <div onClick={() => fileInputRef.current?.click()} className="h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 bg-cover bg-center relative group transition-colors" style={{ backgroundImage: `url(${formData.imageUrl})` }}>
                            {!formData.imageUrl && (<div className="flex flex-col items-center text-gray-400"><ImageIcon size={40} className="mb-2"/><span className="text-xs font-bold">Upload Activity Image</span></div>)}
                            <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                           <label className="block text-xs font-bold text-yellow-800 mb-2">Rating & Reviews</label>
                           <div className="flex gap-2">
                              <div className="relative w-20"><Star size={14} className="absolute left-2 top-2.5 text-yellow-600" /><input type="number" max="5" min="1" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value) || 0})} className="w-full pl-7 p-2 border border-yellow-300 bg-white rounded-lg text-sm font-bold" /></div>
                              <input type="number" placeholder="Count" value={formData.reviewsCount} onChange={e => setFormData({...formData, reviewsCount: parseInt(e.target.value) || 0})} className="flex-1 p-2 border border-yellow-300 bg-white rounded-lg text-sm" />
                           </div>
                        </div>
                    </div>

                    <div className="col-span-8 space-y-5">
                     

                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Activity Name *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Colosseum Tour" /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Type</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white"><option>Monument</option><option>Attraction</option><option>Museum</option><option>Adventure</option><option>Show</option><option>None</option></select></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">City *</label><input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Rome"/></div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Country</label>
                                <input list="country-suggestions" type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Type or select..." />
                                <datalist id="country-suggestions">{existingCountries.map(c => <option key={c} value={c} />)}</datalist>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-3 gap-4">
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Time Slot</label>
                            
                            <select 
                                value={formData.suggestedSlot} 
                                onChange={e => setFormData({...formData, suggestedSlot: e.target.value})} 
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"
                            >
                                {TIME_SLOTS.map(slot => (
                                    <option key={slot.value} value={slot.value}>{slot.label}</option>
                                ))}
                            </select>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Start Time</label><input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Duration</label><input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. 2 Hours" /></div>
                            <div className="col-span-3"><label className="block text-xs font-bold text-gray-500 mb-1">Default Pickup Location</label><input type="text" value={formData.pickupLocation} onChange={e => setFormData({...formData, pickupLocation: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Hotel Lobby" /></div>
                        </div>
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Description</label><textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Short description..." /></div>

                    </div>
                 </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 shrink-0">
                 <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-70">
                    {isSaving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Activity</>}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}