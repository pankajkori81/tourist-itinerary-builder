
// "use client";

// import React, { useState, useRef } from 'react';
// import { 
//   Plus, Search, MapPin, Clock, DollarSign, 
//   Edit, Trash2, X, Save, Tag, Image as ImageIcon, User
// } from 'lucide-react';
// import { useSRM } from '@/app/context/SRMContext';
// import { AttractionData, saveAttraction, deleteAttraction } from '@/utils/srmStorage';

// export default function ActivitySRMPage() {
//   const { attractions, refreshAll, searchText } = useSRM();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Empty State
//   const initialForm: AttractionData = {
//     id: '',
//     name: '',
//     type: 'Monument',
//     city: '',
//     country: '',
//     duration: '2 Hours',
//     suggestedSlot: 'Morning',
//     entranceFee: 0,
//     activityFee: 0,
//     isGuideRequired: false,
//     description: '',
//     imageUrl: '',
//     status: 'Active'
//   };

//   const [formData, setFormData] = useState<AttractionData>(initialForm);

//   // --- ACTIONS ---
//   const handleEdit = (item: AttractionData) => { setFormData(item); setIsModalOpen(true); };
  
//   const handleDelete = (id: string) => {
//     if (confirm('Delete this activity?')) { deleteAttraction(id); refreshAll(); }
//   };

//   const handleSave = () => {
//     if (!formData.name || !formData.city) return alert("Name and City are required");
//     saveAttraction(formData);
//     refreshAll();
//     setIsModalOpen(false);
//     setFormData(initialForm);
//   };

//   // Image Handler (Simple Base64 for local demo)
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Filter List
//   const filteredList = attractions.filter(a => 
//     (a.name || "").toLowerCase().includes(searchText.toLowerCase()) || 
//     (a.city || "").toLowerCase().includes(searchText.toLowerCase())
//   );

//   return (
//     <div className="h-full flex flex-col bg-gray-50">
//       {/* TOOLBAR */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
//          <div>
//             <h1 className="text-xl font-bold text-gray-800">Activity Inventory</h1>
//             <p className="text-xs text-gray-600">Manage sightseeing, shows, and attractions.</p>
//          </div>
//          <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm">
//            <Plus size={18} /> Add Activity
//          </button>
//       </div>

//       {/* GRID LIST */}
//       <div className="flex-1 overflow-y-auto p-6">
//          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredList.map((item) => (
//                 <div key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden group">
//                 {/* Image Area */}
//                 <div className="h-32 bg-gray-200 relative">
//                     {item.imageUrl ? (
//                         <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
//                     ) : (
//                         <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={24} /></div>
//                     )}
//                     <span className="absolute top-2 right-2 text-[10px] bg-white/90 px-2 py-0.5 rounded border shadow uppercase font-bold">{item.type}</span>
//                 </div>
                
//                 <div className="p-4">
//                     <h3 className="font-bold text-gray-800 text-lg truncate" title={item.name}>{item.name}</h3>
//                     <div className="text-xs text-gray-600 mb-3 flex items-center gap-1"><MapPin size={12}/> {item.city}, {item.country}</div>
                    
//                     <div className="grid grid-cols-2 gap-2 mb-3">
//                         <div className="bg-gray-50 p-2 rounded border border-gray-100">
//                             <div className="text-[10px] text-gray-400 uppercase font-bold">Entrance</div>
//                             <div className="text-sm font-bold text-gray-800">${item.entranceFee}</div>
//                         </div>
//                         <div className="bg-gray-50 p-2 rounded border border-gray-100">
//                             <div className="text-[10px] text-gray-400 uppercase font-bold">Activity</div>
//                             <div className="text-sm font-bold text-gray-800">${item.activityFee}</div>
//                         </div>
//                     </div>
                    
//                     {item.isGuideRequired && (
//                         <div className="mb-3 text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded border border-orange-100 flex items-center gap-1">
//                             <User size={12}/> Guide Mandatory
//                         </div>
//                     )}

//                     <div className="flex gap-2 pt-2 border-t border-gray-100 opacity-60 group-hover:opacity-100 transition-opacity">
//                         <button onClick={() => handleEdit(item)} className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded">Edit</button>
//                         <button onClick={() => handleDelete(item.id)} className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded">Delete</button>
//                     </div>
//                 </div>
//                 </div>
//             ))}
//          </div>
//       </div>

//       {/* MODAL FORM */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                  <h2 className="text-lg font-bold text-gray-800">{formData.id ? 'Edit Activity' : 'Add New Activity'}</h2>
//                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
//               </div>

//               <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
//                  {/* Image Upload */}
//                  <div 
//                     onClick={() => fileInputRef.current?.click()}
//                     className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 bg-cover bg-center relative group"
//                     style={{ backgroundImage: `url(${formData.imageUrl})` }}
//                  >
//                     {!formData.imageUrl && (
//                         <div className="flex flex-col items-center text-gray-400">
//                             <ImageIcon size={32} />
//                             <span className="text-xs font-bold mt-2">Click to Upload Image</span>
//                         </div>
//                     )}
//                     <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
//                  </div>

//                  {/* Basic Info */}
//                  <div className="grid grid-cols-2 gap-4">
//                     <div>
//                        <label className="block text-xs font-bold text-gray-600 mb-1">Activity Name *</label>
//                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm font-bold" />
//                     </div>
//                     <div>
//                        <label className="block text-xs font-bold text-gray-600 mb-1">Type</label>
//                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
//                          <option>Monument</option><option>Attraction</option><option>Museum</option><option>Adventure</option><option>Show</option>
//                        </select>
//                     </div>
//                  </div>

//                  <div className="grid grid-cols-2 gap-4">
//                     <div>
//                        <label className="block text-xs font-bold text-gray-600 mb-1">City *</label>
//                        <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
//                     </div>
//                     <div>
//                        <label className="block text-xs font-bold text-gray-600 mb-1">Country</label>
//                        <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
//                     </div>
//                  </div>

//                  {/* Costing Split */}
//                  <div className="grid grid-cols-3 gap-4 bg-green-50 p-4 rounded-lg border border-green-100">
//                     <div>
//                        <label className="block text-xs font-bold text-green-700 mb-1">Entrance Fee ($)</label>
//                        <input type="number" value={formData.entranceFee} onChange={e => setFormData({...formData, entranceFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-green-200 rounded-lg text-sm font-bold" />
//                     </div>
//                     <div>
//                        <label className="block text-xs font-bold text-green-700 mb-1">Activity Fee ($)</label>
//                        <input type="number" value={formData.activityFee} onChange={e => setFormData({...formData, activityFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-green-200 rounded-lg text-sm font-bold" />
//                     </div>
//                     <div className="flex items-center pt-5">
//                         <label className="flex items-center gap-2 cursor-pointer">
//                             <input type="checkbox" checked={formData.isGuideRequired} onChange={e => setFormData({...formData, isGuideRequired: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
//                             <span className="text-xs font-bold text-gray-700">Guide Required?</span>
//                         </label>
//                     </div>
//                  </div>

//                  <div>
//                     <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
//                     <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
//                  </div>
//               </div>

//               <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
//                  <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 shadow"><Save size={18} /> Save</button>
//               </div>
//            </div>
//         </div>
//       )}
//     </div>
//   );
// } 




























// "use client";

// import React, { useState, useRef } from 'react';
// import { 
//   Plus, Search, MapPin, Clock, DollarSign, 
//   Edit, Trash2, X, Save, Tag, Image as ImageIcon, User, Star, Link as LinkIcon
// } from 'lucide-react';
// import { useSRM } from '@/app/context/SRMContext';
// import { AttractionData, saveAttraction, deleteAttraction } from '@/utils/srmStorage';

// export default function ActivitySRMPage() {
//   const { attractions, refreshAll, searchText } = useSRM();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Updated Initial State
//   const initialForm: AttractionData = {
//     id: '',
//     name: '',
//     type: 'Monument',
//     city: '',
//     country: '',
//     duration: '2 Hours',
//     suggestedSlot: 'Morning',
//     startTime: '09:00',
//     pickupLocation: '',
//     entranceFee: 0,
//     activityFee: 0,
//     isGuideRequired: false,
//     guideFee: 0,
//     rating: 5,
//     reviewsCount: 0,
//     providerLink: '',
//     description: '',
//     imageUrl: '',
//     status: 'Active'
//   };

//   const [formData, setFormData] = useState<AttractionData>(initialForm);

//   // --- ACTIONS ---
//   const handleEdit = (item: AttractionData) => { setFormData(item); setIsModalOpen(true); };
  
//   const handleDelete = (id: string) => {
//     if (confirm('Delete this activity?')) { deleteAttraction(id); refreshAll(); }
//   };

//   const handleSave = () => {
//     if (!formData.name || !formData.city) return alert("Name and City are required");
//     saveAttraction(formData);
//     refreshAll();
//     setIsModalOpen(false);
//     setFormData(initialForm);
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Filter List
//   const filteredList = attractions.filter(a => 
//     (a.name || "").toLowerCase().includes(searchText.toLowerCase()) || 
//     (a.city || "").toLowerCase().includes(searchText.toLowerCase())
//   );

//   return (

//     <div className="h-full flex flex-col relative overflow-hidden">
      
//       {/* 1. BACKGROUND IMAGE LAYER [NEW] */}
//       {/* You can replace the URL below with your own hosted image link */}
//       <div 
//         className="absolute inset-0 z-0"
//         style={{
//           backgroundImage: 'url("https://images.unsplash.com/photo-1499678329028-101435549a4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aXRhbHl8ZW58MHx8MHx8fDA%3D")',
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       />

//       {/* 2. BLUR OVERLAY LAYER [NEW] */}
//       {/* bg-white/40 gives it a glass effect. Increase number for less transparency */}
//       <div className="absolute inset-0 z-0 bg-white/6 backdrop-blur-md" />

//       {/* 3. CONTENT LAYER */}
//       <div className="flex-1 flex flex-col relative z-10">
          
//           {/* TOOLBAR - Made slightly transparent to blend with background */}
//           <div className="bg-white border-b border-gray-200/50 px-6 py-4 flex justify-between items-center backdrop-blur-sm shadow-sm">
//              <div>
//                 <h1 className="text-xl font-bold text-gray-800">Activity Inventory</h1>
//                 <p className="text-xs text-gray-600 font-medium">Manage sightseeing, shows, and attractions.</p>
//              </div>
//              <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-105">
//                <Plus size={18} /> Add Activity
//              </button>
//           </div>

//           {/* GRID LIST */}
//           <div className="flex-1 overflow-y-auto p-6">
//              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredList.map((item) => (
//                     <div key={item.id} className="bg-white border border-gray-300 rounded-xl shadow-3xl hover:shadow-4xl p-2 transition-all overflow-hidden group flex flex-col backdrop-blur-sm">
//                     {/* Image Area */}
//                     <div className="h-32 bg-gray-200 relative shrink-0">
//                         {item.imageUrl ? (
//                             <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
//                         ) : (
//                             <div className="w-full h-full flex items-center justify-center text-blue-400"><ImageIcon size={24} /></div>
//                         )}
//                         <span className="absolute top-2 right-2 text-[10px] bg-white/90 px-2 py-0.5 rounded border shadow uppercase font-bold">{item.type}</span>
//                         <div className="absolute bottom-2 left-2 flex gap-1">
//                             <span className="text-[10px] bg-black/70 text-white px-2 py-0.5 rounded flex items-center gap-1"><Star size={10} className="fill-yellow-400 text-yellow-400"/> {item.rating}</span>
//                         </div>
//                     </div>
                    
//                     <div className="p-4 flex-1 flex flex-col">
//                         <h3 className="font-bold text-gray-800 text-sm truncate mb-1" title={item.name}>{item.name}</h3>
//                         <div className="text-xs text-gray-600 mb-3 flex items-center gap-1"><MapPin size={12}/> {item.city}, {item.country}</div>
                        
//                         <div className="grid grid-cols-2 gap-2 mb-3 bg-gray-50/80 p-2 rounded border border-gray-100">
//                             <div>
//                                 <div className="text-[10px] text-gray-400 uppercase font-bold">Total Cost</div>
//                                 <div className="text-sm font-bold text-green-700">${item.entranceFee + item.activityFee + (item.isGuideRequired ? item.guideFee : 0)}</div>
//                             </div>
//                             <div>
//                                 <div className="text-[10px] text-gray-400 uppercase font-bold">Slot</div>
//                                 <div className="text-sm font-bold text-gray-700">{item.suggestedSlot}</div>
//                             </div>
//                         </div>
                        
//                         {/* Action Buttons */}
//                         <div className="mt-auto pt-3 border-t border-gray-100 flex gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
//                             <button onClick={() => handleEdit(item)} className="flex-1 py-1.5 bg-gray-300 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded">Edit</button>
//                             <button onClick={() => handleDelete(item.id)} className="flex-1 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold rounded">Delete</button>
//                         </div>
//                     </div>
//                     </div>
//                 ))}
//              </div>
//           </div>
//       </div>

//       {/* MODAL FORM - INCREASED WIDTH */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
//                  <h2 className="text-lg font-bold text-gray-800">{formData.id ? 'Edit Activity' : 'Add New Activity'}</h2>
//                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
//               </div>

//               <div className="p-6 overflow-y-auto">
//                  <div className="grid grid-cols-12 gap-6">
                    
//                     {/* LEFT COLUMN: Image & Basic Info */}
//                     <div className="col-span-4 space-y-4">
//                         <div 
//                             onClick={() => fileInputRef.current?.click()}
//                             className="h-40 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 bg-cover bg-center relative group"
//                             style={{ backgroundImage: `url(${formData.imageUrl})` }}
//                         >
//                             {!formData.imageUrl && (
//                                 <div className="flex flex-col items-center text-gray-400">
//                                     <ImageIcon size={32} />
//                                     <span className="text-xs font-bold mt-2">Upload Image</span>
//                                 </div>
//                             )}
//                             <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
//                         </div>

//                         <div className='mt-5'>
//                            <label className="block text-xs font-bold text-gray-600 mb-1">Provider Link (Internal)</label>
//                            <div className="flex items-center border border-gray-400 rounded-lg overflow-hidden">
//                               <div className="bg-gray-100 p-2 border-r"><LinkIcon size={14} className="text-gray-600"/></div>
//                               <input type="text" value={formData.providerLink} onChange={e => setFormData({...formData, providerLink: e.target.value})} className="w-full p-2 text-sm outline-none" placeholder="https://..." />
//                            </div>
//                         </div>

//                         <div className="bg-yellow-50 p-3 rounded-lg border border-gray-400">
//                            <label className="block text-xs font-bold text-yellow-800 mb-1">Rating & Reviews</label>
//                            <div className="flex gap-2 mt-2">
//                               <input type="number" max="5" min="1" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value) || 0})} className="w-16 p-1 border border-gray-300 rounded text-sm text-center font-bold" />
//                               <input type="number" placeholder="Reviews" value={formData.reviewsCount} onChange={e => setFormData({...formData, reviewsCount: parseInt(e.target.value) || 0})} className="flex-1 p-1 border border-gray-300 rounded text-sm px-2" />
//                            </div>
//                         </div>
//                     </div>

//                     {/* RIGHT COLUMN: Details */}
//                     <div className="col-span-8 space-y-4">
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-600 mb-1">Activity Name *</label>
//                                 <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg text-sm font-bold" />
//                             </div>
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-600 mb-1">Type</label>
//                                 <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full p-2 border border-gray-400 rounded-lg text-sm bg-white">
//                                     <option>Monument</option><option>Attraction</option><option>Museum</option><option>Adventure</option><option>Show</option><option>None</option>
//                                 </select>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-600 mb-1">City *</label>
//                                 <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg text-sm" />
//                             </div>
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-600 mb-1">Country</label>
//                                 <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg text-sm" />
//                             </div>
//                         </div>

                        

//                         {/* Timing & Logistics */}
//                         <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-600 mb-1">Time Slot</label>
//                                 <select value={formData.suggestedSlot} onChange={e => setFormData({...formData, suggestedSlot: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg text-sm bg-white">
//                                     <option>Morning</option><option>Afternoon</option><option>Evening</option><option>Full Day</option><option>Half Day</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-600 mb-1">Start Time</label>
//                                 <input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg text-sm" />
//                             </div>
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-600 mb-1">Duration</label>
//                                 <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg text-sm" />
//                             </div>

                            
//                             <div className="col-span-3">
//                                 <label className="block text-xs font-bold text-gray-600 mb-1">Default Pickup Location</label>
//                                 <input type="text" value={formData.pickupLocation} onChange={e => setFormData({...formData, pickupLocation: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg text-sm" placeholder="e.g. Hotel Lobby / City Center" />
//                             </div>
//                         </div>

//                             <div>
//                             <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
//                             <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg text-sm" />
//                         </div>

//                         {/* Financials & Guide Logic */}
//                         <div className="bg-gray-50 p-4 rounded-lg border border-green-100 space-y-3">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-xs font-bold text-green-700 mb-1">Entrance Fee ($)</label>
//                                     <input type="number" value={formData.entranceFee} onChange={e => setFormData({...formData, entranceFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-gray-400 rounded-lg text-sm font-bold" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-xs font-bold text-green-700 mb-1">Activity Fee ($)</label>
//                                     <input type="number" value={formData.activityFee} onChange={e => setFormData({...formData, activityFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-gray-400 rounded-lg text-sm font-bold" />
//                                 </div>
//                             </div>
                            
//                             <div className="pt-2 border-t border-green-200">
//                                 <div className="flex items-center gap-2 mb-2">
//                                     <input type="checkbox" checked={formData.isGuideRequired} onChange={e => setFormData({...formData, isGuideRequired: e.target.checked})} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
//                                     <span className="text-sm font-bold text-gray-700">Guide is Required?</span>
//                                 </div>
                                
//                                 {formData.isGuideRequired && (
//                                     <div className="animate-in fade-in slide-in-from-top-1">
//                                         <label className="block text-xs font-bold text-green-700 mb-1">Guide Fee ($)</label>
//                                         <input type="number" value={formData.guideFee} onChange={e => setFormData({...formData, guideFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-gray-400 rounded-lg text-sm font-bold bg-white" placeholder="Cost for the Guide" />
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

                    
//                     </div>
//                  </div>
//               </div>

//               <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 shrink-0">
//                  <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 shadow"><Save size={18} /> Save Activity</button>
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
//   Plus, Search, MapPin, Clock, DollarSign, 
//   Edit, Trash2, X, Save, Tag, Image as ImageIcon, User, Star, Link as LinkIcon,
//   ChevronDown, ChevronRight, Globe,

// } from 'lucide-react';
// import { useSRM } from '@/app/context/SRMContext';
// import { AttractionData, saveAttraction, deleteAttraction } from '@/utils/srmStorage';

// export default function ActivitySRMPage() {
//   const { attractions, refreshAll, searchText } = useSRM();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Accordion State: Which countries are expanded?
//   const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});

//   // Form State
//   const initialForm: AttractionData = {
//     id: '', name: '', type: 'Monument', city: '', country: '',
//     duration: '2 Hours', suggestedSlot: 'Morning', startTime: '09:00',
//     pickupLocation: '', entranceFee: 0, activityFee: 0,
//     isGuideRequired: false, guideFee: 0, rating: 5, reviewsCount: 0,
//     providerLink: '', description: '', imageUrl: '', status: 'Active'
//   };
//   const [formData, setFormData] = useState<AttractionData>(initialForm);

//   // --- LOGIC: FILTER & GROUP ---
//   const groupedData = useMemo(() => {
//     // 1. FILTER FIRST
//     const filtered = attractions.filter(a => 
//       (a.name || "").toLowerCase().includes(searchText.toLowerCase()) || 
//       (a.city || "").toLowerCase().includes(searchText.toLowerCase()) ||
//       (a.country || "").toLowerCase().includes(searchText.toLowerCase())
//     );

//     // 2. GROUP BY COUNTRY
//     const groups: Record<string, AttractionData[]> = {};
    
//     filtered.forEach(item => {
//       // Normalize Country Name (Capitalize First Letter)
//       let country = (item.country || "Other Locations").trim();
//       country = country.charAt(0).toUpperCase() + country.slice(1);
//       if (!groups[country]) groups[country] = [];
//       groups[country].push(item);
//     });

//     // 3. SORT GROUPS ALPHABETICALLY
//     return Object.keys(groups).sort().reduce((acc, key) => {
//       acc[key] = groups[key];
//       return acc;
//     }, {} as Record<string, AttractionData[]>);

//   }, [attractions, searchText]);

//   // --- LOGIC: AUTO-EXPAND ON SEARCH ---
//   useEffect(() => {
//     if (searchText) {
//       // If searching, expand ALL groups that have results
//       const allKeys = Object.keys(groupedData);
//       const newExpanded = allKeys.reduce((acc, key) => ({...acc, [key]: true}), {});
//       setExpandedCountries(newExpanded);
//     }
//   }, [searchText, groupedData]);

//   // --- ACTIONS ---
//   const toggleCountry = (country: string) => {
//     setExpandedCountries(prev => ({ ...prev, [country]: !prev[country] }));
//   };

//   const handleEdit = (item: AttractionData) => { setFormData(item); setIsModalOpen(true); };
//   const handleDelete = (id: string) => { if (confirm('Delete?')) { deleteAttraction(id); refreshAll(); } };
//   const handleSave = () => {
//     if (!formData.name || !formData.city) return alert("Name and City required");
    
//     // Normalize Data before saving
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

//   // Helper: Get Unique Countries for "Smart Select"
//   const existingCountries = Array.from(new Set(attractions.map(a => a.country).filter(Boolean))).sort();

//   return (
//    <div className="h-full w-full flex flex-col relative overflow-hidden ">
      
//       {/* BACKGROUND (Unchanged) */}
//       <div className="absolute inset-0 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1691289973096-8e69998f921f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzJ8fGFjdGl2aXR5JTIwdG91cmlzdCUyMHBsYWNlfGVufDB8fDB8fHww")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
//       <div className="absolute inset-0 z-0 bg-white/2 backdrop-blur-sm" />

//       {/* CONTENT */}
//      <div className="flex-1 flex flex-col relative z-10 h-full">
          
//           {/* TOOLBAR */}
//           <div className="bg-white border-b border-gray-200/50 px-6 py-4 flex justify-between items-center backdrop-blur-sm shadow-sm">
//              <div>
//                 <h1 className="text-xl font-bold text-gray-800">Activity Inventory</h1>
//                 <p className="text-xs text-gray-600 font-medium">
//                     {Object.keys(groupedData).length} Countries • {Object.values(groupedData).flat().length} Activities
//                 </p>
//              </div>
//              <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-105">
//                <Plus size={18} /> Add Activity
//              </button>
//           </div>

//           {/* GROUPED LIST VIEW */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-28">
//              {Object.keys(groupedData).length === 0 ? (
//                  <div className="text-center py-20 text-gray-600">No activities found. Try adding one!</div>
//              ) : (
//                  Object.entries(groupedData).map(([country, items]) => (
//                     <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        
//                         {/* COUNTRY HEADER (Accordion) */}
//                         <div 
//                             onClick={() => toggleCountry(country)}
//                             className="flex items-center bg-white p-5 rounded gap-3 cursor-pointer group mb-3 select-none"
//                         >
//                             <div className="p-2 bg-gray-200 rounded-xl hover:bg-gray-300 shadow-sm text-gray-600 group-hover:text-blue-600 transition-colors">
//                                 {expandedCountries[country] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
//                             </div>
//                             <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 ">
//                                 <Globe size={20} className="text-blue-700  "/> 
//                                 {country}
//                                 <span className="text-sm font-normal bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{items.length}</span>
//                             </h2>
//                             {/* <div className="h-px flex-1 bg-gray-300/50 ml-2 group-hover:bg-blue-200 transition-colors"/> */}
//                         </div>

//                         {/* ACTIVITY GRID (Only if Expanded) */}
//                         {expandedCountries[country] && (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-4 pl-4 border-l-2 border-gray-200/50">
//                                 {items.map((item) => (
//                                     <div key={item.id} className="bg-white border border-white/50 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden group flex flex-col backdrop-blur-sm">
//                                         {/* Same Card Design as Before */}
//                                         <div className="h-32 bg-gray-200 relative shrink-0">
//                                             {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-blue-500"><ImageIcon size={24} /></div>}
//                                             <span className="absolute top-2 right-2 text-[10px] bg-white/90 px-2 py-0.5 rounded border shadow uppercase font-bold">{item.type}</span>
//                                             <div className="absolute bottom-2 left-2 flex gap-1"><span className="text-[10px] bg-black/70 text-white px-2 py-0.5 rounded flex items-center gap-1"><Star size={10} className="fill-yellow-400 text-yellow-400"/> {item.rating}</span></div>
//                                         </div>
//                                         <div className="p-4 flex-1 flex flex-col">
//                                             <h3 className="font-bold text-gray-800 text-sm truncate mb-1" title={item.name}>{item.name}</h3>
//                                             <div className="text-xs text-gray-600 mb-3 flex items-center gap-1"><MapPin size={12}/> {item.city}</div>
//                                             <div className="grid grid-cols-2 gap-2 mb-3 bg-gray-50/80 p-2 rounded border border-gray-100">
//                                                 <div><div className="text-[10px] text-gray-600 uppercase font-bold">Total Cost</div><div className="text-sm font-bold text-green-700">${item.entranceFee + item.activityFee + (item.isGuideRequired ? item.guideFee : 0)}</div></div>
//                                                 <div><div className="text-[10px] text-gray-600 uppercase font-bold">Slot</div><div className="text-sm font-bold text-gray-700">{item.suggestedSlot}</div></div>
//                                             </div>
//                                             <div className="mt-auto pt-3 border-t border-gray-100 flex gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
//                                                 <button onClick={() => handleEdit(item)} className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded">Edit</button>
//                                                 <button onClick={() => handleDelete(item.id)} className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded">Delete</button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                  ))
//              )}
//           </div>
//       </div>




//       {/* MODAL FORM (Unchanged Design + Smart Country Input) */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
//                  <h2 className="text-lg font-bold text-gray-800">{formData.id ? 'Edit Activity' : 'Add New Activity'}</h2>
//                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
//               </div>

//               <div className="p-6 overflow-y-auto">
//                  <div className="grid grid-cols-12 gap-6">
             
//                      {/* LEFT COLUMN: Image & Basic Info */}
//                     <div className="col-span-4 space-y-4">
//                         <div 
//                             onClick={() => fileInputRef.current?.click()}
//                             className="h-40 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 bg-cover bg-center relative group"
//                             style={{ backgroundImage: `url(${formData.imageUrl})` }}
//                         >
//                             {!formData.imageUrl && (
//                                 <div className="flex flex-col items-center text-gray-400">
//                                     <ImageIcon size={32} />
//                                     <span className="text-xs font-bold mt-2">Upload Image</span>
//                                 </div>
//                             )}
//                             <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
//                         </div>

//                         <div className='mt-5'>
//                            <label className="block text-xs font-bold text-gray-600 mb-1">Provider Link (Internal)</label>
//                            <div className="flex items-center border border-gray-400 rounded-lg overflow-hidden">
//                               <div className="bg-gray-100 p-2 border-r"><LinkIcon size={14} className="text-gray-600"/></div>
//                               <input type="text" value={formData.providerLink} onChange={e => setFormData({...formData, providerLink: e.target.value})} className="w-full p-2 text-sm outline-none" placeholder="https://..." />
//                            </div>
//                         </div>

//                         <div className="bg-yellow-50 p-3 rounded-lg border border-gray-400">
//                            <label className="block text-xs font-bold text-yellow-800 mb-1">Rating & Reviews</label>
//                            <div className="flex gap-2 mt-2">
//                               <input type="number" max="5" min="1" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value) || 0})} className="w-16 p-1 border border-gray-300 rounded text-sm text-center font-bold" />
//                               <input type="number" placeholder="Reviews" value={formData.reviewsCount} onChange={e => setFormData({...formData, reviewsCount: parseInt(e.target.value) || 0})} className="flex-1 p-1 border border-gray-300 rounded text-sm px-2" />
//                            </div>
//                         </div>
//                     </div>

//                     {/* RIGHT COLUMN */}
//                     <div className="col-span-8 space-y-4">
//                         <div className="grid grid-cols-2 gap-4">
//                             <div><label className="block text-xs font-bold text-gray-600 mb-1">Activity Name *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm font-bold" /></div>
//                             <div><label className="block text-xs font-bold text-gray-600 mb-1">Type</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"><option>Monument</option><option>Attraction</option><option>Museum</option><option>Adventure</option><option>Show</option><option>None</option></select></div>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4">
//                             <div><label className="block text-xs font-bold text-gray-600 mb-1">City *</label><input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" /></div>
                            
//                             {/* SMART COUNTRY INPUT (The requested Feature) */}
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-600 mb-1">Country</label>
//                                 <input 
//                                     list="country-suggestions"
//                                     type="text" 
//                                     value={formData.country} 
//                                     onChange={e => setFormData({...formData, country: e.target.value})} 
//                                     className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
//                                     placeholder="Type or select..."
//                                 />
//                                 <datalist id="country-suggestions">
//                                     {existingCountries.map(c => <option key={c} value={c} />)}
//                                 </datalist>
//                             </div>
//                         </div>

//                         {/* Timing & Logistics (Same as before) */}
//                         <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-300">
//                             <div><label className="block text-xs font-bold text-gray-600 mb-1">Time Slot</label><select value={formData.suggestedSlot} onChange={e => setFormData({...formData, suggestedSlot: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Full Day</option><option>Half Day</option></select></div>
//                             <div><label className="block text-xs font-bold text-gray-600 mb-1">Start Time</label><input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" /></div>
//                             <div><label className="block text-xs font-bold text-gray-600 mb-1">Duration</label><input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" /></div>
//                             <div className="col-span-3"><label className="block text-xs font-bold text-gray-600 mb-1">Default Pickup Location</label><input type="text" value={formData.pickupLocation} onChange={e => setFormData({...formData, pickupLocation: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Hotel Lobby" /></div>
//                         </div>
                            
//                             <div><label className="block text-xs font-bold text-gray-600 mb-1">Description</label><textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" /></div>

//                         {/* Financials (Same as before) */}
//                         <div className="bg-green-10 p-4 rounded-lg border border-gray-300 space-y-3">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div><label className="block text-xs font-bold text-green-700 mb-1">Entrance Fee ($)</label><input type="number" value={formData.entranceFee} onChange={e => setFormData({...formData, entranceFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-gray-300 rounded-lg text-sm font-bold" /></div>
//                                 <div><label className="block text-xs font-bold text-green-700 mb-1">Activity Fee ($)</label><input type="number" value={formData.activityFee} onChange={e => setFormData({...formData, activityFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-gray-300 rounded-lg text-sm font-bold" /></div>
//                             </div>
//                             <div className="pt-2 border-t border-green-200">
//                                 <div className="flex items-center gap-2 mb-2"><input type="checkbox" checked={formData.isGuideRequired} onChange={e => setFormData({...formData, isGuideRequired: e.target.checked})} className="w-4 h-4 text-blue-600 rounded cursor-pointer" /><span className="text-sm font-bold text-gray-700">Guide is Required?</span></div>
//                                 {formData.isGuideRequired && (<div className="animate-in fade-in slide-in-from-top-1"><label className="block text-xs font-bold text-green-700 mb-1">Guide Fee ($)</label><input type="number" value={formData.guideFee} onChange={e => setFormData({...formData, guideFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-gray-300 rounded-lg text-sm font-bold bg-white" placeholder="Cost for the Guide" /></div>)}
//                             </div>
//                         </div>

                        
//                     </div>
//                  </div>
//               </div>

//               <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 shrink-0">
//                  <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 shadow"><Save size={18} /> Save Activity</button>
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
  Plus, MapPin, Search, Star, 
  Trash2, X, Save, Image as ImageIcon, 
  ChevronDown, ChevronRight, Globe, Clock, Ticket, User, Link as LinkIcon, Edit, Flag,
  DollarSign
} from 'lucide-react';
import { useSRM } from '@/app/context/SRMContext';
import { AttractionData, saveAttraction, deleteAttraction } from '@/utils/srmStorage';

export default function ActivitySRMPage() {
  const { attractions, refreshAll, searchText } = useSRM();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Nested Accordion State
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

  // Form State
  const initialForm: AttractionData = {
    id: '', name: '', type: 'Monument', city: '', country: '',
    duration: '2 Hours', suggestedSlot: 'Morning', startTime: '09:00',
    pickupLocation: '', entranceFee: 0, activityFee: 0,
    isGuideRequired: false, guideFee: 0, rating: 5, reviewsCount: 0,
    providerLink: '', description: '', imageUrl: '', status: 'Active'
  };
  const [formData, setFormData] = useState<AttractionData>(initialForm);

  // --- 1. NESTED GROUPING LOGIC (Country -> City -> Activities) ---
  const groupedData = useMemo(() => {
    const filtered = attractions.filter(a => 
      (a.name || "").toLowerCase().includes(searchText.toLowerCase()) || 
      (a.city || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (a.country || "").toLowerCase().includes(searchText.toLowerCase())
    );

    const groups: Record<string, Record<string, AttractionData[]>> = {};
    
    filtered.forEach(item => {
      const country = (item.country || "Other Locations").trim();
      const city = (item.city || "General").trim();

      if (!groups[country]) groups[country] = {};
      if (!groups[country][city]) groups[country][city] = [];
      
      groups[country][city].push(item);
    });

    // Sort Alphabetically
    return Object.keys(groups).sort().reduce((acc, country) => {
      acc[country] = groups[country];
      return acc;
    }, {} as Record<string, Record<string, AttractionData[]>>);

  }, [attractions, searchText]);

  // --- LOGIC: AUTO-EXPAND ON SEARCH ---
  useEffect(() => {
    if (searchText) {
      const allCountries = Object.keys(groupedData);
      const newExpCountries = allCountries.reduce((acc, key) => ({...acc, [key]: true}), {});
      setExpandedCountries(newExpCountries);
      
      const newExpCities: Record<string, boolean> = {};
      allCountries.forEach(c => {
          Object.keys(groupedData[c]).forEach(city => {
              newExpCities[`${c}-${city}`] = true;
          });
      });
      setExpandedCities(newExpCities);
    }
  }, [searchText, groupedData]);

  // --- ACTIONS ---
  const handleEdit = (item: AttractionData) => { setFormData(item); setIsModalOpen(true); };
  
  const handleDelete = (id: string) => { 
      if (confirm('Delete this activity?')) { 
          deleteAttraction(id); 
          refreshAll(); 
      } 
  };
  
  const handleSave = () => {
    if (!formData.name || !formData.city) return alert("Name and City required");
    
    const cleanData = {
        ...formData,
        country: formData.country.trim().charAt(0).toUpperCase() + formData.country.trim().slice(1)
    };

    saveAttraction(cleanData);
    refreshAll();
    setIsModalOpen(false);
    setFormData(initialForm);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  // Helper: Get Unique Countries for "Smart Select"
  const existingCountries = Array.from(new Set(attractions.map(a => a.country).filter(Boolean))).sort();

  return (
   <div className="h-full w-full flex flex-col relative overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0" style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
      }} />
      <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm" />

      {/* CONTENT */}
     <div className="flex-1 flex flex-col relative z-10 h-full">
          
          {/* HEADER */}
          <div className="bg-white/95 border-b border-white/50 px-6 py-4 flex justify-between items-center backdrop-blur-md shadow-sm z-10">
             <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Ticket className="text-blue-600" /> Activity Inventory
                </h1>
                <p className="text-xs text-gray-600 font-medium">Manage tours, monuments, and experiences.</p>
             </div>
             <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
               <Plus size={18} /> Add Activity
             </button>
          </div>

          {/* NESTED GROUPED LIST VIEW */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
             {Object.keys(groupedData).length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-gray-600 bg-white/40 rounded-xl border border-white/50 backdrop-blur-sm">
                    <Ticket size={48} className="opacity-50 mb-2"/>
                    <p className="font-bold">No activities found.</p>
                    <p className="text-sm">Click "Add Activity" to start.</p>
                 </div>
             ) : (
                 Object.entries(groupedData).map(([country, cities]) => (
                    <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        
                        {/* 1. COUNTRY HEADER */}
                        <div 
                            onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))}
                            className="flex items-center bg-white/95 p-4 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white transition-all select-none border border-white/50 backdrop-blur-sm mb-2"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:text-blue-800 transition-colors">
                                {expandedCountries[country] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                    <Globe size={18} className="text-blue-600" />
                                    {country}
                                </h3>
                            </div>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                {Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Activities
                            </span>
                        </div>

                        {/* 2. CITIES LIST */}
                        {expandedCountries[country] && (
                            <div className="ml-4 pl-4 border-l-2 border-white/40 space-y-3">
                                {Object.entries(cities).map(([city, items]) => {
                                    const cityKey = `${country}-${city}`;
                                    return (
                                        <div key={city}>
                                            <div 
                                                onClick={() => setExpandedCities(prev => ({...prev, [cityKey]: !prev[cityKey]}))}
                                                className="flex items-center bg-white/95 p-3 rounded-lg gap-2 cursor-pointer hover:bg-white/80 transition-all select-none border border-white/30 backdrop-blur-sm mb-2"
                                            >
                                                {expandedCities[cityKey] ? <ChevronDown size={16} className="text-gray-500"/> : <ChevronRight size={16} className="text-gray-500"/>}
                                                <MapPin size={16} className="text-red-800" />
                                                <span className="font-bold text-gray-900">{city}</span>
                                                <span className="text-xs text-gray-900 bg-blue-200 px-2 py-0.5 rounded-full">
                                                    {items.length}
                                                </span>
                                            </div>

                                            {/* 3. ACTIVITIES GRID */}
                                            {expandedCities[cityKey] && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-6 mb-4">
                                                    {items.map((item) => (
                                                        <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col overflow-hidden">
                                                            
                                                            {/* IMAGE AREA */}
                                                            <div className="h-32 bg-gray-100 relative shrink-0 overflow-hidden">
                                                                {item.imageUrl ? (
                                                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> 
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500 shadow-inner border border-white/10 group">
                                                                        <ImageIcon
                                                                            size={48}
                                                                            className="text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                                                                        />
                                                                    </div>
                                                                )}
                                                                <span className="absolute top-3 left-3 text-[10px] bg-white/90 backdrop-blur-md px-2 py-1 rounded shadow uppercase font-bold tracking-wide border border-white/50">
                                                                    {item.type}
                                                                </span>
                                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded shadow text-xs font-bold flex items-center gap-1">
                                                                    <Star size={10} className="fill-yellow-700 text-yellow-700"/> {item.rating}
                                                                </div>
                                                            </div>

                                                            {/* CONTENT AREA */}
                                                            <div className="p-5 flex-1 flex flex-col">
                                                                <h3 className="font-bold text-gray-900 text-[16px] leading-tight truncate " title={item.name}>
                                                                    {item.name}
                                                                </h3>
                                                                <div className="flex items-center text-xs text-gray-700 font-medium mb-1 mt-1  ">
                                                                    <MapPin size={14} className="mr-1 text-blue-500 shrink-0" />
                                                                    <span className="truncate">{item.city}, {item.country}</span>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-2 mb-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                                   <div>
                                                                        <div className="text-[10px] text-gray-600 uppercase font-bold tracking-wide">Time Slot:</div>
                                                                        <div className="text-sm font-bold text-gray-700 flex items-center gap-1">
                                                                             {item.suggestedSlot}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[10px] text-gray-600 uppercase font-bold tracking-wide">Duration</div>
                                                                        <div className="text-sm font-bold text-gray-700 flex items-center gap-1">
                                                                            <Clock size={12}/> {item.duration}
                                                                        </div>
                                                                    </div>
                                                                   

                                                                       <div>
                                                                        <div className="text-[10px] text-gray-600 uppercase font-bold tracking-wide mt-1">Total Cost</div>
                                                                        <div className="text-sm font-bold text-green-700">
                                                                            ${item.entranceFee + item.activityFee + (item.isGuideRequired ? item.guideFee : 0)}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* ACTION FOOTER */}
                                                                <div className="mt-auto  border-t border-gray-100 flex items-center gap-3">
                                                                    <button 
                                                                        onClick={() => handleEdit(item)} 
                                                                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all active:scale-95 flex items-center justify-center gap-2"
                                                                    >
                                                                        <Edit size={14} /> Edit
                                                                    </button>
                                                                       <button 
                                                                        onClick={() => handleDelete(item.id)}
                                                                        className="flex-1 py-2.5 bg-red-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all active:scale-95 flex items-center justify-center gap-2"
                                                                    >
                                                                         <Trash2 size={14} className="group-hover/delete:animate-bounce-short"/> Delete
                                                                    </button>
                                                                    {/* <button 
                                                                        onClick={() => handleDelete(item.id)} 
                                                                        className=" flex-2 p-2.5 bg-white text-gray-400 border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors group/delete"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 size={16} className="group-hover/delete:animate-bounce-short"/> Delete
                                                                    </button> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
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

      {/* MODAL FORM (Standard UI - Kept same logic, updated styling to match) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
                 <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Activity' : 'Add New Activity'}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
              </div>

              <div className="p-6 overflow-y-auto">
                 <div className="grid grid-cols-12 gap-6">
             
                     {/* LEFT COLUMN */}
                    <div className="col-span-4 space-y-4">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 bg-cover bg-center relative group transition-colors"
                            style={{ backgroundImage: `url(${formData.imageUrl})` }}
                        >
                            {!formData.imageUrl && (
                                <div className="flex flex-col items-center text-gray-400">
                                    <ImageIcon size={40} className="mb-2"/>
                                    <span className="text-xs font-bold">Upload Activity Image</span>
                                </div>
                            )}
                            <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                           <label className="block text-xs font-bold text-yellow-800 mb-2">Rating & Reviews</label>
                           <div className="flex gap-2">
                              <div className="relative w-20">
                                <Star size={14} className="absolute left-2 top-2.5 text-yellow-600" />
                                <input type="number" max="5" min="1" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value) || 0})} className="w-full pl-7 p-2 border border-yellow-300 bg-white rounded-lg text-sm font-bold" />
                              </div>
                              <input type="number" placeholder="Count" value={formData.reviewsCount} onChange={e => setFormData({...formData, reviewsCount: parseInt(e.target.value) || 0})} className="flex-1 p-2 border border-yellow-300 bg-white rounded-lg text-sm" />
                           </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="col-span-8 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Activity Name *</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Colosseum Tour" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white">
                                    <option>Monument</option><option>Attraction</option><option>Museum</option><option>Adventure</option><option>Show</option><option>None</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">City *</label>
                                <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Rome"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Country</label>
                                <input 
                                    list="country-suggestions"
                                    type="text" 
                                    value={formData.country} 
                                    onChange={e => setFormData({...formData, country: e.target.value})} 
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" 
                                    placeholder="Type or select..."
                                />
                                <datalist id="country-suggestions">
                                    {existingCountries.map(c => <option key={c} value={c} />)}
                                </datalist>
                            </div>
                        </div>

                        {/* Logistics */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-3 gap-4">
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Time Slot</label><select value={formData.suggestedSlot} onChange={e => setFormData({...formData, suggestedSlot: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Full Day</option><option>Half Day</option></select></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Start Time</label><input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Duration</label><input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. 2 Hours" /></div>
                            <div className="col-span-3"><label className="block text-xs font-bold text-gray-500 mb-1">Default Pickup Location</label><input type="text" value={formData.pickupLocation} onChange={e => setFormData({...formData, pickupLocation: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Hotel Lobby" /></div>
                        </div>
                            
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Description</label><textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Short description..." /></div>

                        {/* Costing */}
                        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                            <div className="flex items-center gap-2 mb-3">
                                <DollarSign size={16} className="text-green-700"/>
                                <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Pricing Configuration</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div><label className="block text-xs font-bold text-green-700 mb-1">Entrance Fee ($)</label><input type="number" value={formData.entranceFee} onChange={e => setFormData({...formData, entranceFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-green-300 rounded-lg text-sm font-bold" /></div>
                                <div><label className="block text-xs font-bold text-green-700 mb-1">Activity Fee ($)</label><input type="number" value={formData.activityFee} onChange={e => setFormData({...formData, activityFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-green-300 rounded-lg text-sm font-bold" /></div>
                            </div>
                            <div className="pt-3 border-t border-green-200">
                                <div className="flex items-center gap-2 mb-2"><input type="checkbox" checked={formData.isGuideRequired} onChange={e => setFormData({...formData, isGuideRequired: e.target.checked})} className="w-4 h-4 text-blue-600 rounded cursor-pointer" /><span className="text-sm font-bold text-gray-700">Guide is Required?</span></div>
                                {formData.isGuideRequired && (<div className="animate-in fade-in slide-in-from-top-1"><label className="block text-xs font-bold text-green-700 mb-1">Guide Fee ($)</label><input type="number" value={formData.guideFee} onChange={e => setFormData({...formData, guideFee: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-green-300 rounded-lg text-sm font-bold bg-white" placeholder="Cost for the Guide" /></div>)}
                            </div>
                        </div>
                    </div>
                 </div>
              </div>

              <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 shrink-0">
                 <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"><Save size={18} /> Save Activity</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}