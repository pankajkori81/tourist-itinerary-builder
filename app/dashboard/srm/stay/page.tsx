
// "use client";

// import React, { useState, useRef, useMemo, useEffect } from 'react';
// import { 
//   Plus, MapPin, Building2, Star, 
//   Trash2, X, Save, Image as ImageIcon, 
//   ChevronDown, ChevronRight, BedDouble, PlusCircle, Globe, 
//   Edit, Briefcase, Phone, Mail, CreditCard, DollarSign
// } from 'lucide-react';
// import { useSRM } from '@/app/context/SRMContext';
// import { StayData, RoomCategory, saveStay, deleteStay } from '@/utils/srmStorage';

// // Default empty rates
// const DEFAULT_RATES = {
//   jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
//   jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0
// };

// export default function StaySRMPage() {
//   const { stays, suppliers, refreshAll, searchText } = useSRM(); // [CHANGE: Added suppliers context]
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState<'info' | 'rooms'>('info');
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Nested Accordion State
//   const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
//   const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

//   // --- FORM STATE ---
//   // [CHANGE: Added linkedSupplierId to initialForm]
//   const initialForm: StayData = {
//     id: '', name: '', type: 'Hotel', city: '', country: '', address: '',
//     rating: 4.5, description: '', images: [],
//     roomCategories: [], 
//     status: 'Active', createdAt: '', updatedAt: '',
//     linkedSupplierId: '' // <--- NEW FIELD
//   };
//   const [formData, setFormData] = useState<StayData>(initialForm);

//   // --- [NEW LOGIC START]: SMART SUPPLIER FILTERING ---
//   // 1. Filter Suppliers: Must be Active + Provide "Stay" + Match City (if typed)
//   const availableSuppliers = useMemo(() => {
//     return suppliers.filter(s => {
//       const basicCheck = s.status === 'Active' && s.services.includes('Stay');
//       const cityCheck = formData.city 
//         ? s.city.toLowerCase().trim() === formData.city.toLowerCase().trim() 
//         : true; 
//       return basicCheck && cityCheck;
//     });
//   }, [suppliers, formData.city]);

//   // 2. Auto-Select "Preferred" Supplier when City changes
//   useEffect(() => {
//      if(isModalOpen && formData.city && !formData.linkedSupplierId) {
//         const preferred = suppliers.find(s => 
//            s.status === 'Active' &&
//            s.services.includes('Stay') &&
//            s.city.toLowerCase().trim() === formData.city.toLowerCase().trim() &&
//            s.isPreferred
//         );
//         if(preferred) {
//            setFormData(prev => ({...prev, linkedSupplierId: preferred.id}));
//         }
//      }
//   }, [formData.city, isModalOpen, suppliers]);

//   // 3. Get Data for the "Intelligence Box"
//   const selectedSupplierData = suppliers.find(s => s.id === formData.linkedSupplierId);
//   // --- [NEW LOGIC END] ---

//   // --- NESTED GROUPING LOGIC (Country -> City -> Hotels) ---
//   const groupedData = useMemo(() => {
//     const filtered = stays.filter(s => 
//       (s.name || "").toLowerCase().includes(searchText.toLowerCase()) || 
//       (s.city || "").toLowerCase().includes(searchText.toLowerCase()) ||
//       (s.country || "").toLowerCase().includes(searchText.toLowerCase())
//     );

//     const groups: Record<string, Record<string, StayData[]>> = {};

//     filtered.forEach(item => {
//       const country = (item.country || "Uncategorized").trim();
//       const city = (item.city || "Unknown City").trim();

//       if (!groups[country]) groups[country] = {};
//       if (!groups[country][city]) groups[country][city] = [];
      
//       groups[country][city].push(item);
//     });

//     return Object.keys(groups).sort().reduce((acc, country) => {
//         acc[country] = groups[country];
//         return acc;
//     }, {} as Record<string, Record<string, StayData[]>>);
//   }, [stays, searchText]);

//   // Auto-expand on search
//   useEffect(() => {
//     if (searchText) {
//        const allCountries = Object.keys(groupedData);
//        setExpandedCountries(allCountries.reduce((acc, key) => ({...acc, [key]: true}), {}));
//        const newExpCities: Record<string, boolean> = {};
//        allCountries.forEach(c => {
//            Object.keys(groupedData[c]).forEach(city => {
//                newExpCities[`${c}-${city}`] = true;
//            });
//        });
//        setExpandedCities(newExpCities);
//     }
//   }, [searchText, groupedData]);

//   // --- HANDLERS ---
//   const handleEdit = (item: StayData) => { 
//     setFormData(JSON.parse(JSON.stringify(item))); 
//     setActiveTab('info');
//     setIsModalOpen(true); 
//   };

//   const handleDelete = (id: string) => { 
//     if (confirm('Delete this hotel and all its rates?')) { 
//       deleteStay(id); 
//       refreshAll(); 
//     } 
//   };

//   const handleSave = () => {
//     if (!formData.name || !formData.city) return alert("Hotel Name and City are required");
//     const cleanData = {
//         ...formData,
//         city: formData.city.trim(),
//         country: formData.country.trim()
//     };
//     saveStay(cleanData);
//     refreshAll();
//     setIsModalOpen(false);
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({ ...prev, images: [reader.result as string] }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // --- ROOM & MATRIX HANDLERS ---
//   const addRoomCategory = () => {
//     const currentYear = new Date().getFullYear();
//     const newRoom: RoomCategory = {
//       name: 'Standard Room',
//       maxOccupancy: 2,
//       bedType: 'Double',
//       inclusions: ['Breakfast'],
//       rateCards: [
//         { year: currentYear, rates: { ...DEFAULT_RATES } },
//         { year: currentYear + 1, rates: { ...DEFAULT_RATES } }
//       ]
//     };
//     setFormData(prev => ({ ...prev, roomCategories: [...prev.roomCategories, newRoom] }));
//   };

//   const addYearToRoom = (roomIndex: number) => {
//     const newCategories = [...formData.roomCategories];
//     const room = newCategories[roomIndex];
//     const maxYear = room.rateCards.length > 0 
//         ? Math.max(...room.rateCards.map((c: { year: any; }) => c.year)) 
//         : new Date().getFullYear() - 1;

//     room.rateCards.push({ year: maxYear + 1, rates: { ...DEFAULT_RATES } });
//     room.rateCards.sort((a: { year: number; }, b: { year: number; }) => a.year - b.year);
//     setFormData({ ...formData, roomCategories: newCategories });
//   };

//   const removeYearFromRoom = (roomIndex: number, yearToDelete: number) => {
//     const newCategories = [...formData.roomCategories];
//     newCategories[roomIndex].rateCards = newCategories[roomIndex].rateCards.filter((rc: { year: number; }) => rc.year !== yearToDelete);
//     setFormData({ ...formData, roomCategories: newCategories });
//   };

//   const updateRate = (roomIndex: number, yearIndex: number, month: string, value: number) => {
//     const newCategories = [...formData.roomCategories];
//     // @ts-ignore
//     newCategories[roomIndex].rateCards[yearIndex].rates[month] = value;
//     setFormData({ ...formData, roomCategories: newCategories });
//   };

//   const updateRoomField = (index: number, field: keyof RoomCategory, value: any) => {
//     const newCategories = [...formData.roomCategories];
//     // @ts-ignore
//     newCategories[index][field] = value;
//     setFormData({ ...formData, roomCategories: newCategories });
//   };

//   const removeRoom = (index: number) => {
//     if(confirm("Delete this room category?")) {
//       const newCategories = formData.roomCategories.filter((_, i) => i !== index);
//       setFormData({ ...formData, roomCategories: newCategories });
//     }
//   };

//   return (
//    <div className="h-full w-full flex flex-col relative overflow-hidden">
      
//       {/* BACKGROUND */}
//       <div className="absolute inset-0 z-0" style={{ 
//           backgroundImage: 'url("https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D")', 
//           backgroundSize: 'cover', 
//           backgroundPosition: 'center' 
//       }} />
//       <div className="absolute inset-0 z-0 bg-black/20 backdrop-blur-sm" />

//       {/* CONTENT */}
//       <div className="flex-1 flex flex-col relative z-10 h-full">
        
//         {/* HEADER */}
//         <div className="bg-white/95 border-b border-white/50 px-6 py-4 flex justify-between items-center backdrop-blur-md shadow-sm z-10">
//             <div>
//                 <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                 <Building2 className="text-purple-700"/> Stay Inventory
//                 </h1>
//                 <p className="text-xs text-gray-600 font-medium">Manage hotels, room types, and seasonal rate cards.</p>
//             </div>
//             <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
//             <Plus size={18} /> Add Hotel
//             </button>
//         </div>

//         {/* LIST VIEW */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
//             {Object.keys(groupedData).length === 0 ? (
//                  <div className="flex flex-col items-center justify-center h-64 text-gray-600 bg-white/40 rounded-xl border border-white/50 backdrop-blur-sm">
//                     <Building2 size={48} className="opacity-50 mb-2"/>
//                     <p className="font-bold">No properties found.</p>
//                     <p className="text-sm">Click "Add Hotel" to start.</p>
//                  </div>
//              ) : (
//                 Object.entries(groupedData).map(([country, cities]) => (
//                     <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
//                         {/* COUNTRY HEADER */}
//                         <div 
//                             onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))}
//                             className="flex items-center bg-white/95 p-4 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white transition-all select-none border border-white/50 backdrop-blur-sm mb-2"
//                         >
//                             <div className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:text-purple-800 transition-colors">
//                                 {expandedCountries[country] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
//                             </div>
//                             <div className="flex-1">
//                                 <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
//                                     <Globe size={18} className="text-purple-600" />
//                                     {country}
//                                 </h3>
//                             </div>
//                             <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
//                                 {Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Hotels
//                             </span>
//                         </div>
                        
//                         {/* CITIES LIST */}
//                         {expandedCountries[country] && (
//                             <div className="ml-4 pl-4 border-l-2 border-white/40 space-y-3">
//                                 {Object.entries(cities).map(([city, hotels]) => {
//                                     const cityKey = `${country}-${city}`;
//                                     return (
//                                         <div key={city}>
//                                             <div 
//                                                 onClick={() => setExpandedCities(prev => ({...prev, [cityKey]: !prev[cityKey]}))}
//                                                 className="flex items-center bg-white/95 p-3 rounded-lg gap-2 cursor-pointer hover:bg-white/80 transition-all select-none border border-white/30 backdrop-blur-sm mb-2"
//                                             >
//                                                 {expandedCities[cityKey] ? <ChevronDown size={16} className="text-gray-500"/> : <ChevronRight size={16} className="text-gray-500"/>}
//                                                 <MapPin size={16} className="text-red-900" />
//                                                 <span className="font-bold text-gray-900">{city}</span>
//                                                 <span className="text-xs text-gray-900 bg-blue-200 px-2 py-0.5 rounded-full">
//                                                     {hotels.length}
//                                                 </span>
//                                             </div>

//                                             {/* HOTELS GRID */}
//                                             {expandedCities[cityKey] && (
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-6 mb-4">
//                                                     {hotels.map(hotel => {
//                                                         // [CHANGE: Find linked supplier to display "By: X"]
//                                                         const sup = suppliers.find(s => s.id === hotel.linkedSupplierId);
                                                        
//                                                         return (
//                                                             <div key={hotel.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col overflow-hidden">
//                                                                 {/* IMAGE */}
//                                                                 <div className="h-35 bg-gray-100 relative shrink-0 overflow-hidden">
//                                                                     {hotel.images?.[0] ? (
//                                                                         <img src={hotel.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={hotel.name}/>
//                                                                     ) : (
//                                                                         <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 shadow-inner group"><ImageIcon size={48} className="text-white drop-shadow-lg"/></div>
//                                                                     )}
//                                                                     <div className="absolute bottom-3 left-3 flex">
//                                                                         <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/10">{hotel.type}</span>
//                                                                         <div className="ml-82 bg-white/85 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1.5 border border-white/50"><Star size={12} className="fill-yellow-700 text-yellow-700"/> <span className="text-gray-800">{hotel.rating}</span></div>
//                                                                     </div>
//                                                                 </div>
                                                                
//                                                                 {/* CONTENT */}
//                                                                 <div className="p-5 flex-1 flex flex-col">
//                                                                     <div className="mb-3">
//                                                                         <h4 className="font-bold text-gray-900 text-lg leading-tight truncate mb-1" title={hotel.name}>{hotel.name}</h4>
//                                                                         <div className="flex items-center text-xs text-gray-700 font-medium">
//                                                                             <MapPin size={14} className="mr-1 text-purple-600 shrink-0" />
//                                                                             <span className="truncate">{hotel.city}, {hotel.country}</span>
//                                                                         </div>
//                                                                         {/* [CHANGE: Show Supplier Badge] */}
//                                                                         {sup && (
//                                                                             <div className="mt-2 inline-flex items-center gap-1 bg-purple-50 text-purple-800 px-2 py-1 rounded text-[10px] border border-purple-100">
//                                                                                 <Briefcase size={10} /> 
//                                                                                 <span className="font-bold truncate max-w-[150px]">By: {sup.name}</span>
//                                                                             </div>
//                                                                         )}
//                                                                     </div>

//                                                                     <div className="mb-4 flex-1">
//                                                                         <div className="flex items-center gap-1.5 mb-2.5">
//                                                                             <BedDouble size={14} className="text-gray-600"/>
//                                                                             <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Room Types</span>
//                                                                         </div>
//                                                                         <div className="flex flex-wrap gap-2">
//                                                                             {(hotel.roomCategories || []).length > 0 ? (
//                                                                                 hotel.roomCategories.map((rc, idx) => (
//                                                                                     <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">{rc.name}</span>
//                                                                                 ))
//                                                                             ) : <span className="text-xs text-gray-400 italic pl-1">No rooms</span>}
//                                                                         </div>
//                                                                     </div>
                                                                    
//                                                                     <div className="mt-auto border-t border-gray-100 flex items-center gap-3 pt-3">
//                                                                         <button onClick={() => handleEdit(hotel)} className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm"><Edit size={14} /> Edit Rates</button>
//                                                                         <button onClick={() => handleDelete(hotel.id)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm"><Trash2 size={14} /> Delete</button>
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
//                 ))
//             )}
//         </div>
//       </div>

//       {/* --- ADD/EDIT MODAL --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
//            <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
//               <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//                  <div>
//                     <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Property' : 'Add New Property'}</h2>
//                     <p className="text-xs text-gray-500">Configure property details and seasonal pricing</p>
//                  </div>
//                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><X size={20}/></button>
//               </div>

//               <div className="flex border-b border-gray-200 px-6 gap-6 bg-white shrink-0">
//                   <button onClick={() => setActiveTab('info')} className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>Basic Info</button>
//                   <button onClick={() => setActiveTab('rooms')} className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'rooms' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>Rooms & Rates</button>
//               </div>

//               <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
//                   {/* TAB 1: BASIC INFO */}
//                   {activeTab === 'info' && (
//                       <div className="grid grid-cols-12 gap-6">
//                           <div className="col-span-4 space-y-4">
//                               <div onClick={() => fileInputRef.current?.click()} className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white bg-cover bg-center transition-all bg-gray-100" style={{ backgroundImage: `url(${formData.images[0]})` }}>
//                                   {!formData.images[0] && (<div className="text-center text-gray-400"><ImageIcon className="mx-auto mb-2"/><span className="text-xs font-bold">Upload Cover Image</span></div>)}
//                                   <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
//                               </div>
//                               <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
//                                   <label className="text-xs font-bold text-gray-700">Star Rating</label>
//                                   <input type="number" min="1" max="5" step="0.5" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} className="w-16 p-1 border rounded font-bold text-center"/>
//                                   <div className="flex text-yellow-400"><Star className="fill-current" size={16}/></div>
//                               </div>
//                           </div>
                          
//                           <div className="col-span-8 space-y-4">
//                               {/* --- [CHANGE: SUPPLIER LINKAGE SECTION] --- */}
//                               <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 flex gap-4 items-start">
//                                   <div className="flex-1">
//                                       <label className="block text-xs font-bold text-purple-900 mb-2 flex items-center gap-1">
//                                           <Briefcase size={14} /> Fulfillment Partner (Stay)
//                                       </label>
//                                       <select 
//                                           className="w-full p-2.5 border border-purple-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none"
//                                           value={formData.linkedSupplierId || ""}
//                                           onChange={(e) => setFormData({...formData, linkedSupplierId: e.target.value})}
//                                       >
//                                           <option value="">-- Direct / Unknown --</option>
//                                           {availableSuppliers.map(s => (
//                                               <option key={s.id} value={s.id}>
//                                                   {s.name} ({s.city}) {s.isPreferred ? '★ Preferred' : ''}
//                                               </option>
//                                           ))}
//                                           {formData.linkedSupplierId && !availableSuppliers.find(s => s.id === formData.linkedSupplierId) && selectedSupplierData && (
//                                                <option value={selectedSupplierData.id}>{selectedSupplierData.name} (Current) - *City Mismatch*</option>
//                                           )}
//                                       </select>
//                                       {availableSuppliers.length === 0 && formData.city && (
//                                           <p className="text-[10px] text-red-500 mt-1">No 'Stay' suppliers found in {formData.city}.</p>
//                                       )}
//                                   </div>
                                  
//                                   {/* [CHANGE: ENHANCED INTELLIGENCE BOX] */}
//                                   {selectedSupplierData && (
//                                       <div className="flex-1 bg-white p-3 rounded-lg border border-purple-100 shadow-sm text-xs">
//                                           <div className="font-bold text-gray-800 mb-2 flex justify-between items-center border-b border-gray-100 pb-1">
//                                               <span>{selectedSupplierData.contactPerson}</span>
//                                               {selectedSupplierData.isPreferred && <span className="bg-orange-100 text-orange-700 px-1.5 rounded text-[10px]">Preferred</span>}
//                                           </div>
//                                           <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-600">
//                                               <div className="flex items-center gap-1"><Phone size={10}/> {selectedSupplierData.phone}</div>
//                                               <div className="flex items-center gap-1"><CreditCard size={10}/> {selectedSupplierData.paymentTerms}</div>
//                                               <div className="col-span-2 flex items-center gap-1 truncate" title={selectedSupplierData.email}><Mail size={10}/> {selectedSupplierData.email}</div>
//                                               <div className="col-span-2 flex items-center gap-1 font-bold text-purple-800 bg-purple-50 px-1 rounded"><DollarSign size={10}/> Currency: {selectedSupplierData.currency || 'USD'}</div>
//                                           </div>
//                                       </div>
//                                   )}
//                               </div>

//                               <div className="grid grid-cols-2 gap-4">
//                                   <div><label className="text-xs font-bold text-gray-700 mb-1 block">Hotel Name *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg font-bold" placeholder="e.g. Grand Hotel"/></div>
//                                   <div><label className="text-xs font-bold text-gray-700 mb-1 block">Type</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg bg-white"><option>Hotel</option><option>Resort</option><option>Villa</option><option>Apartment</option></select></div>
//                               </div>
//                               <div className="grid grid-cols-2 gap-4">
//                                   <div><label className="text-xs font-bold text-gray-700 mb-1 block">City *</label><input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="e.g. Rome"/></div>
//                                   <div><label className="text-xs font-bold text-gray-700 mb-1 block">Country *</label><input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="e.g. Italy"/></div>
//                               </div>
//                               <div><label className="text-xs font-bold text-gray-700 mb-1 block">Address</label><input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Full address..."/></div>
//                               <div><label className="text-xs font-bold text-gray-700 mb-1 block">Description</label><textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Property description..."/></div>
//                           </div>
//                       </div>
//                   )}

//                   {/* TAB 2: ROOMS & RATES (THE MATRIX) */}
//                   {activeTab === 'rooms' && (
//                       <div className="space-y-6">
//                           {formData.roomCategories.length === 0 ? (
//                               <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-xl">
//                                   <BedDouble className="mx-auto text-gray-300 mb-3" size={48}/>
//                                   <p className="text-gray-500 font-medium mb-4">No rooms configured yet.</p>
//                                   <button onClick={addRoomCategory} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors">+ Add First Room Category</button>
//                               </div>
//                           ) : (
//                               <div className="space-y-8">
//                                   {formData.roomCategories.map((room, rIndex) => (
//                                       <div key={room.id} className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm">
//                                           <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 flex justify-between items-center">
//                                               <div className="flex gap-4 items-center flex-1">
//                                                   <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">{rIndex + 1}</div>
//                                                   <input type="text" value={room.name} onChange={(e) => updateRoomField(rIndex, 'name', e.target.value)} className="font-bold text-gray-800 bg-transparent border-b border-dashed border-gray-400 focus:border-purple-600 outline-none w-64 px-1" placeholder="Room Name (e.g. Deluxe)"/>
//                                               </div>
//                                               <div className="flex gap-4 items-center">
//                                                   <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-gray-300 shadow-sm"><span className="text-xs text-gray-700 uppercase font-bold">Max Pax:</span><input type="number" value={room.maxOccupancy} onChange={(e) => updateRoomField(rIndex, 'maxOccupancy', parseInt(e.target.value))} className="w-10 text-center font-bold outline-none text-purple-700"/></div>
//                                                   <button onClick={() => removeRoom(rIndex)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"><Trash2 size={16}/></button>
//                                               </div>
//                                           </div>
//                                           <div className="p-4 overflow-x-auto">
//                                               {room.rateCards.map((card: { year: boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.Key | null | undefined; rates: { [x: string]: string | number | readonly string[] | undefined; }; }, yIndex: number) => (
//                                                   <div key={String(card.year)} className="mb-6 last:mb-0 relative group">
//                                                       <div className="flex items-center justify-between mb-2">
//                                                           <div className="flex items-center gap-2"><span className="bg-gray-800 text-white px-3 py-1 rounded text-xs font-bold shadow-sm">{card.year} Rate Card</span><span className="text-[10px] text-gray-600 uppercase tracking-wide">USD per Night</span></div>
//                                                           <button onClick={() => removeYearFromRoom(rIndex, card.year)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600 p-1" title="Remove Year"><Trash2 size={14}/></button>
//                                                       </div>
//                                                       <div className="grid grid-cols-6 lg:grid-cols-12 gap-2">
//                                                           {Object.keys(DEFAULT_RATES).map((month) => (
//                                                               <div key={month} className="flex flex-col">
//                                                                   <span className="text-[10px] font-bold text-gray-700 uppercase mb-1 pl-1">{month}</span>
//                                                                   <div className="relative">
//                                                                       <span className="absolute left-2 top-1.5 text-gray-700 text-xs">$</span>
//                                                                       <input 
//                                                                         // @ts-ignore
//                                                                         value={card.rates[month]} type="number" onChange={(e) => updateRate(rIndex, yIndex, month, parseFloat(e.target.value))} className="w-full pl-4 pr-1 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 outline-none font-bold text-gray-700 shadow-sm"
//                                                                       />
//                                                                   </div>
//                                                               </div>
//                                                           ))}
//                                                       </div>
//                                                   </div>
//                                               ))}
//                                               <button onClick={() => addYearToRoom(rIndex)} className="mt-4 text-xs font-bold text-purple-600 flex items-center gap-1 hover:bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors"><PlusCircle size={14} /> Add Next Year</button>
//                                           </div>
//                                       </div>
//                                   ))}
//                                   <button onClick={addRoomCategory} className="w-full py-3 border-2 border-dashed border-purple-300 bg-purple-50 text-purple-700 font-bold rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"><PlusCircle size={20}/> Add Another Room Category</button>
//                               </div>
//                           )}
//                       </div>
//                   )}
//               </div>

//               <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
//                   <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
//                   <button onClick={handleSave} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition-transform active:scale-95"><Save size={18}/> Save Property</button>
//               </div>
//            </div>
//         </div>
//       )}
//    </div>
//   );
// }
 































































































"use client";

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Plus, MapPin, Building2, Star, 
  Trash2, X, Save, Image as ImageIcon, 
  ChevronDown, ChevronRight, BedDouble, PlusCircle, Globe, 
  Edit, Briefcase, Phone, Mail, CreditCard, DollarSign, Loader2 , Upload, Download
} from 'lucide-react';
// import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';
import { motion, AnimatePresence } from 'framer-motion';
import { useSRM } from '@/app/context/SRMContext';
import { StayData, RoomCategory, saveStay, deleteStay } from '@/utils/srmStorage';

// app/dashboard/srm/stay/page.tsx  →  add below the existing imports
import StayImportPreview, { DuplicateMode } from '@/components/srm/StayImportPreview';
import { parseStayFile, stayKey } from '@/utils/stayImport';
import type { StayImportResult, ParsedStayRow, Overrides, StayField } from '@/utils/stayImport';


// app/dashboard/srm/stay/page.tsx  →  add ABOVE `export default function StaySRMPage()`

// Runs `worker` over items with at most `limit` running at once
async function runPool<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) { const item = items[i++]; await worker(item); }
    })
  );
}

// "Update" mode: file values fill in / overwrite, but empty file cells never blank out
// existing data, and images / rooms / status are never touched.
const SKIP_ON_UPDATE = ['images', 'roomCategories', 'status'];
function mergeForUpdate(existing: StayData, incoming: Record<string, any>): StayData {
  const patch: Record<string, any> = {};
  Object.entries(incoming).forEach(([k, v]) => {
    if (SKIP_ON_UPDATE.includes(k)) return;
    if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) return;
    if (k === 'rating' && v === 0) return;
    patch[k] = v;
  });
  const merged: any = { ...existing, ...patch };
  if (!merged.linkedSupplierId) delete merged.linkedSupplierId; // empty ObjectId breaks Mongoose
  return merged as StayData;
}

export default function StaySRMPage() {
  const { stays, suppliers, refreshAll, searchText, isLoading } = useSRM(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState<'info' | 'rooms'>('info');

// const [activeTab, setActiveTab] = useState<'info' | 'rooms' | 'amenities'>('info');
// 🌟 FIX: Added 'rates' to the allowed TypeScript types
const [activeTab, setActiveTab] = useState<'info' | 'rooms' | 'amenities' | 'rates'>('info');
  const [isSaving, setIsSaving] = useState(false); // NEW STATE
  const fileInputRef = useRef<HTMLInputElement>(null);
// app/dashboard/srm/stay/page.tsx  →  add next to the other useState calls
const [importFile, setImportFile] = useState<File | null>(null);
const [importResult, setImportResult] = useState<StayImportResult | null>(null);
const [importOverrides, setImportOverrides] = useState<Overrides>({});
const [importProgress, setImportProgress] = useState<{ done: number; total: number } | null>(null);


  // 👈 NEW STATES FOR IMPORT/EXPORT
  const importInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});




// app/dashboard/srm/stay/page.tsx  →  REPLACE the whole `const initialForm: StayData = {...}`
const initialForm: StayData = {
  id: '', name: '',
  category: 'Hotel',
  type: 'Premium',
  city: '', country: '', address: '',
  rating: 4.5, description: '', images: [],
  stateProvince: '', zipPostal: '', phone: '',
  propertyOverview: '',
  keyAmenities: [],
  monthlyBaseRates: [], 
  roomCategories: [],
  status: 'Active', createdAt: '', updatedAt: '',
  linkedSupplierId: ''
};
  
  const [formData, setFormData] = useState<StayData>(initialForm);

  const availableSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const basicCheck = s.status === 'Active' && s.services.includes('Stay');
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
           s.services.includes('Stay') &&
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
    const filtered = stays.filter(s => 
      (s.name || "").toLowerCase().includes(searchText.toLowerCase()) || 
      (s.city || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (s.country || "").toLowerCase().includes(searchText.toLowerCase())
    );

    const groups: Record<string, Record<string, StayData[]>> = {};

    filtered.forEach(item => {
      const country = (item.country || "Uncategorized").trim();
      const city = (item.city || "Unknown City").trim();

      if (!groups[country]) groups[country] = {};
      if (!groups[country][city]) groups[country][city] = [];
      groups[country][city].push(item);
    });

    return Object.keys(groups).sort().reduce((acc, country) => {
        acc[country] = groups[country];
        return acc;
    }, {} as Record<string, Record<string, StayData[]>>);
  }, [stays, searchText]);

  useEffect(() => {
    if (searchText) {
       const allCountries = Object.keys(groupedData);
       setExpandedCountries(allCountries.reduce((acc, key) => ({...acc, [key]: true}), {}));
       const newExpCities: Record<string, boolean> = {};
       allCountries.forEach(c => {
           Object.keys(groupedData[c]).forEach(city => {
               newExpCities[`${c}-${city}`] = true;
           });
       });
       setExpandedCities(newExpCities);
    }
  }, [searchText, groupedData]);

//   const handleEdit = (item: StayData) => { 
//     setFormData(JSON.parse(JSON.stringify(item))); 
//     setActiveTab('info');
//     setIsModalOpen(true); 
//   };

const handleEdit = (item: StayData) => {
  closeImportPreview();                              // never show the import preview while editing
  setFormData(JSON.parse(JSON.stringify(item)));
  setActiveTab('info');
  setIsModalOpen(true);
};

  // CHANGED: Async
  const handleDelete = async (id: string) => { 
    if (confirm('Delete this hotel and all its rooms?')) { 
      await deleteStay(id); 
      await refreshAll(); 
    } 
  };



// // ==========================================
//   // EXPORT LOGIC (Extended for GDS Fields)
//   // ==========================================


// ==========================================
  // EXPORT LOGIC (Extended for GDS Fields)
  // ==========================================
  const handleExport = () => {
    if (stays.length === 0) return alert("No hotels to export.");

    // One amenity per line: "Key: Details" (newlines inside details are flattened)
    const fmtAmenities = (list: StayData['keyAmenities']) =>
      (list || [])
        .map(a => {
          const k = a.key.replace(/:\s/g, ' - ');
          const d = (a.details || '').replace(/\s*\n\s*/g, ' ').trim();
          return d ? `${k}: ${d}` : k;
        })
        .join('\n');

    // 🌟 FIX 1: Rearranged columns to match the exact order requested by the client
    const exportData = stays.map(item => ({
      'Property Name': item.name,
      'Category': item.category || 'Hotel',
      'Star Rating': item.rating || 0,
      'Street Address': item.address || '',
      'City': item.city,
      'State / Province': item.stateProvince || '',
      'Country': item.country,
      'Zip / Postal': item.zipPostal || '',
      'Phone': item.phone || '',
      'Review Rating': item.reviewRating ?? '',
      'Property Overview': item.description || item.propertyOverview || '',
      'Amenities': fmtAmenities(item.keyAmenities),

    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // 🌟 FIX 2: Set responsive column widths so the text isn't squished
    worksheet['!cols'] = [
      { wch: 25 }, // Property Name
      { wch: 12 }, // Category
      { wch: 12 }, // Star Rating
      { wch: 35 }, // Street Address
      { wch: 15 }, // City
      { wch: 20 }, // State / Province
      { wch: 15 }, // Country
      { wch: 12 }, // Zip / Postal
      { wch: 18 }, // Phone
      { wch: 15 }, // Review Rating
      { wch: 45 }, // Property Overview
      { wch: 40 }, // Amenities
      
    ];

    // 🌟 FIX 3: Apply the Blue Header Styling (Requires 'xlsx-js-style')
    const range = XLSX.utils.decode_range(worksheet['!ref'] || "A1:N1");
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1"; // Targets Row 1 (Headers)
      if (!worksheet[address]) continue;
      
      worksheet[address].s = {
        font: { bold: true, color: { rgb: "000000" } }, // Bold black text
        fill: { fgColor: { rgb: "9BC2E6" } },           // Client's Light Blue background
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hotels");
    XLSX.writeFile(workbook, "Stay_Inventory_Extended.xlsx");
  };


//   const handleExport = () => {
//     if (stays.length === 0) return alert("No hotels to export.");



// // One amenity per line: "Key: Details" (newlines inside details are flattened so the format stays parseable)
// const fmtAmenities = (list: StayData['keyAmenities']) =>
//   (list || [])
//     .map(a => {
//       const k = a.key.replace(/:\s/g, ' - ');
//       const d = (a.details || '').replace(/\s*\n\s*/g, ' ').trim();
//       return d ? `${k}: ${d}` : k;
//     })
//     .join('\n');


//     // app/dashboard/srm/stay/page.tsx  →  in handleExport, REPLACE the whole `const exportData = ...` block
// const exportData = stays.map(item => ({
//   'Property Name': item.name,
//   'Category': item.category || 'Hotel',
// //   'Class Type': item.type || 'Premium',
// //   'Chain Code': item.chainCode || '',
// //   'Brand': item.brand || '',
//   'Street Address': item.address || '',
//   'City': item.city,
//   'State / Province': item.stateProvince || '',
//   'Country': item.country,
//   'Zip / Postal': item.zipPostal || '',
//   'Phone': item.phone || '',
//   'Star Rating': item.rating || 0,
//   'Review Rating': item.reviewRating ?? '',
//   'Property Overview': item.description || item.propertyOverview || '',
//   'Amenities': fmtAmenities(item.keyAmenities),
// }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Hotels");
//     XLSX.writeFile(workbook, "Stay_Inventory_Extended.xlsx");
//   };


// name+city -> existing stay, used to detect duplicates
const stayLookup = useMemo(() => {
  const m = new Map<string, StayData>();
  stays.forEach(s => m.set(stayKey(s.name, s.city), s));
  return m;
}, [stays]);
const duplicateKeys = useMemo(() => new Set(stayLookup.keys()), [stayLookup]);

const runParse = async (file: File, overrides: Overrides) => {
  setIsImporting(true);
  try {
    setImportResult(await parseStayFile(file, overrides));
  } catch (err) {
    console.error('Import parsing error:', err);
    alert('Could not read this file. Please use a valid .xlsx, .xls or .csv file.');
    setImportResult(null);
  } finally {
    setIsImporting(false);
  }
};




// app/dashboard/srm/stay/page.tsx  →  REPLACE the existing handleImport
const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setIsModalOpen(false);                             // ✅ NEW: close the Add/Edit form if it is open
  if (importInputRef.current) importInputRef.current.value = ''; // lets you re-pick the same file
  setImportFile(file);
  setImportOverrides({});
  await runParse(file, {});
};


// 2) User changed a column mapping in the modal -> re-parse with that override
const handleRemap = async (headerKey: string, field: StayField | 'ignore') => {
  if (!importFile) return;
  const next = { ...importOverrides, [headerKey]: field };
  setImportOverrides(next);
  await runParse(importFile, next);
};

const closeImportPreview = () => {
  setImportResult(null); setImportFile(null);
  setImportOverrides({}); setImportProgress(null);
};

// 3) Confirm -> save
const handleConfirmImport = async (rows: ParsedStayRow[], mode: DuplicateMode) => {
  let added = 0, updated = 0, skipped = 0, failed = 0;
  const seen = new Set<string>();
  const tasks: { row: ParsedStayRow; existing?: StayData }[] = [];

  for (const row of rows) {
    const key = stayKey(row.data.name, row.data.city);
    if (seen.has(key)) { skipped++; continue; }          // same hotel twice inside the file
    seen.add(key);
    const existing = stayLookup.get(key);
    if (existing && mode === 'skip') { skipped++; continue; }
    tasks.push({ row, existing });
  }

  setImportProgress({ done: 0, total: tasks.length });
  let done = 0;

  await runPool(tasks, 4, async ({ row, existing }) => {
    const payload = existing ? mergeForUpdate(existing, row.data) : (row.data as StayData);
    const ok = await saveStay(payload);
    if (!ok) failed++;
    else if (existing) updated++;
    else added++;
    setImportProgress({ done: ++done, total: tasks.length });
  });

  await refreshAll();
  closeImportPreview();
  alert(`Import complete\nAdded: ${added}\nUpdated: ${updated}\nSkipped (duplicates): ${skipped}\nFailed: ${failed}`);
};





// 👇 UPDATED handleSave with complete data mapping
  const handleSave = async () => {
    if (!formData.name || !formData.city) return alert("Hotel Name and City are required");
    setIsSaving(true);
    
    try {
      const cleanData = {
          ...formData,
          // Ensure strings and numbers are strictly formatted
        //   chainCode: formData.chainCode || '',
        //   brand: formData.brand || '',
          stateProvince: formData.stateProvince || '',
          zipPostal: formData.zipPostal || '',
          phone: formData.phone || '',
          propertyOverview: formData.propertyOverview || '',
       
          city: formData.city.trim(),
          country: formData.country.trim(),

     keyAmenities: (formData.keyAmenities || [])
    .map(a => ({ key: a.key.trim(), details: (a.details || '').trim() }))
    .filter(a => a.key),
          
      };

      // Prevent empty string ObjectIds from choking Mongoose validation
      if (!cleanData.linkedSupplierId || cleanData.linkedSupplierId === "") {
          delete cleanData.linkedSupplierId;
      }

      const success = await saveStay(cleanData);
      
      if(success) {
        await refreshAll();
        setIsModalOpen(false);
      } else {
        alert("Failed to save property to live database.");
      }
    } catch (error) {
      console.error("Error during save:", error);
      alert("Failed to save. Check the console for validation details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, images: [reader.result as string] }));
      };
      reader.readAsDataURL(file);
    }
  };



// The 4 standard keys used in your supplier sheets (quick-add buttons)
const AMENITY_PRESETS = ['Wi-Fi access/passwords', 'Breakfast hours', 'Parking details', 'Pool/gym availability'];

const addAmenity = (key = '') =>
  setFormData(prev => ({ ...prev, keyAmenities: [...(prev.keyAmenities || []), { key, details: '' }] }));

const updateAmenity = (index: number, field: 'key' | 'details', value: string) =>
  setFormData(prev => ({
    ...prev,
    keyAmenities: (prev.keyAmenities || []).map((a, i) => (i === index ? { ...a, [field]: value } : a)),
  }));

const removeAmenity = (index: number) =>
  setFormData(prev => ({ ...prev, keyAmenities: (prev.keyAmenities || []).filter((_, i) => i !== index) }));


// --- RATES LOGIC ---
  const [bulkYear, setBulkYear] = useState(new Date().getFullYear().toString());
  
  const generateYearRates = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const newRates = months.map(m => ({ period: `${m} ${bulkYear}`, price: 0 }));
      setFormData(prev => ({ ...prev, monthlyBaseRates: [...(prev.monthlyBaseRates || []), ...newRates] }));
  };

  const updateRate = (index: number, price: number) => {
      const updated = [...(formData.monthlyBaseRates || [])];
      updated[index].price = price;
      setFormData(prev => ({ ...prev, monthlyBaseRates: updated }));
  };

  const removeRate = (index: number) => {
      const updated = (formData.monthlyBaseRates || []).filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, monthlyBaseRates: updated }));
  };

  const addRoomCategory = () => {
    const newRoom: RoomCategory = {
        name: 'Standard Room',
        maxOccupancy: 2,
        bedType: 'Double',
        inclusions: ['Breakfast'],
        rateCards: undefined
    };
    setFormData(prev => ({ ...prev, roomCategories: [...prev.roomCategories, newRoom] }));
  };

  const updateRoomField = (index: number, field: keyof RoomCategory, value: any) => {
    const newCategories = [...formData.roomCategories];
    // @ts-ignore
    newCategories[index][field] = value;
    setFormData({ ...formData, roomCategories: newCategories });
  };

  const removeRoom = (index: number) => {
    if(confirm("Delete this room category?")) {
      const newCategories = formData.roomCategories.filter((_, i) => i !== index);
      setFormData({ ...formData, roomCategories: newCategories });
    }
  };

  return (
   <div className="h-full w-full flex flex-col relative overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0" style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
      }} />
      <div className="absolute inset-0 z-0 bg-black/20 backdrop-blur-sm" />

      {/* CONTENT */}
      <div className="flex-1 flex flex-col relative z-10 h-full">
        

        {/* HEADER */}
        <div className="bg-white/95 border-b border-white/50 px-6 py-4 flex justify-between items-center backdrop-blur-md shadow-sm z-10">
            <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="text-purple-700"/> Stay Inventory
                </h1>
                <p className="text-xs text-gray-600 font-medium">Manage hotels and room types.</p>
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
                 className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
               >
                 {isImporting ? <Loader2 size={16} className="animate-spin text-purple-600" /> : <Upload size={16} className="text-gray-500" />}
                 {isImporting ? 'Importing...' : 'Import'}
               </button>

               {/* Export Button */}
               <button 
                 onClick={handleExport} 
                 className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all"
               >
                 <Download size={16} className="text-gray-500" /> Export
               </button>

               {/* Add Hotel Button */}
               {/* <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5">
                 <Plus size={18} /> Add Hotel
               </button> */}

               <button onClick={() => { closeImportPreview(); setFormData(initialForm); setIsModalOpen(true); }} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5">
  <Plus size={18} /> Add Hotel
</button>
            </div>
        </div>

        {/* LIST VIEW */}

        {/* LIST VIEW */}
       <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">{/* 👈 Clean Gray Background */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Loader2 size={40} className="animate-spin mb-4 text-purple-500" />
                    <p className="font-medium text-lg drop-shadow-md">Loading Hotels...</p>
                </div>
            ) : Object.keys(groupedData).length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                    <Building2 size={48} className="opacity-20 mb-2"/>
                    <p className="font-bold">No Hotels found.</p>
                    <p className="text-sm">Click "Add Hotel" to start.</p>
                 </div>
             ) : (
                Object.entries(groupedData).map(([country, cities]) => (
                    <motion.div layout key={country} className="mb-2">
                        {/* COUNTRY HEADER */}
                        <motion.div 
                            layout
                            onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))}
                            className="flex items-center bg-white p-4 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-gray-50 transition-all select-none border border-gray-200 relative z-10"
                        >
                            <motion.div 
                                animate={{ rotate: expandedCountries[country] ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:text-purple-800 transition-colors"
                            >
                                <ChevronRight size={20}/>
                            </motion.div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                    <Globe size={18} className="text-purple-600" />
                                    {country}
                                </h3>
                            </div>
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                                {Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Hotels
                            </span>
                        </motion.div>                        

                        {/* CITIES LIST */}
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
                                    <div className="ml-4 pl-4 border-l-2 border-gray-200 space-y-3 pt-3 pb-2">
                                        {Object.entries(cities).map(([city, hotels]) => {
                                            const cityKey = `${country}-${city}`;
                                            return (
                                                <motion.div layout key={city} className="mb-2">
                                                    <motion.div 
                                                        layout
                                                        onClick={() => setExpandedCities(prev => ({...prev, [cityKey]: !prev[cityKey]}))}
                                                        className="flex items-center bg-white p-3 rounded-lg gap-2 cursor-pointer hover:bg-gray-50 transition-all select-none border border-gray-200 relative z-10"
                                                    >
                                                        <motion.div animate={{ rotate: expandedCities[cityKey] ? 90 : 0 }} transition={{ duration: 0.2 }}>
                                                            <ChevronRight size={16} className="text-gray-500"/>
                                                        </motion.div>
                                                        <MapPin size={16} className="text-red-700" />
                                                        <span className="font-bold text-gray-900">{city}</span>
                                                        <span className="text-xs text-gray-900 bg-purple-100 px-2 py-0.5 rounded-full">
                                                            {hotels.length}
                                                        </span>
                                                    </motion.div>

                                                    {/* HOTELS GRID */}
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
    {hotels.map(hotel => {
        const sup = suppliers.find(s => s.id === hotel.linkedSupplierId);
        return (
            <motion.div 
                key={hotel.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.15)" }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-md flex flex-col overflow-hidden group cursor-pointer border border-gray-100"
            >
                {/* 1. IMAGE & BADGES SECTION */}
                <div className="h-40 relative shrink-0 overflow-hidden">
                    {hotel.images?.[0] ? (
                        <img src={hotel.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={hotel.name}/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
                            <ImageIcon size={44} className="text-white opacity-90"/>
                        </div>
                    )}
                    
                    {/* Dark Category Badge (Bottom Left) */}
                    <div className="absolute bottom-3 left-3 flex gap-1">
                        <span className="px-2.5 py-1 rounded-md bg-[#3b2b5c] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                             {hotel.category || 'Hotel'}
                        </span>
                    </div>
                    
                    {/* White Rating Badge (Bottom Right) */}
                    <div className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-md text-[11px] font-bold shadow flex items-center gap-1.5 text-gray-800">
                        <Star size={12} className="fill-yellow-500 text-yellow-500"/> <span>{hotel.rating}</span>
                    </div>
                </div>
                
                {/* 2. CARD BODY */}
                <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-4">
                        <h4 className="font-bold text-gray-900 text-[18px] leading-tight truncate mb-1.5" title={hotel.name}>{hotel.name}</h4>
                        <div className="flex items-center text-[12px] text-gray-600 font-medium mb-2.5">
                            <MapPin size={14} className="mr-1.5 text-purple-600 shrink-0" />
                            <span className="truncate">{hotel.city}, {hotel.country}</span>
                        </div>
                       
                    </div>

                    <div className="mb-5 flex-1">
                        <div className="flex items-center gap-1.5 mb-2">
                            <BedDouble size={14} className="text-gray-500"/>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Room Types</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(hotel.roomCategories || []).length > 0 ? (
                                hotel.roomCategories.map((rc, idx) => (
                                    <span key={idx} className="inline-flex items-center px-3 py-1 rounded-md bg-white text-gray-700 text-[11px] font-medium border border-gray-200 shadow-sm truncate max-w-[140px]">{rc.name}</span>
                                ))
                            ) : <span className="text-[11px] text-gray-400 italic">No rooms configured</span>}
                        </div>
                    </div>

                    {/* Quick Rate Summary Badge */}
{/* <div className="mt-3">
    {(hotel.monthlyBaseRates && hotel.monthlyBaseRates.length > 0) ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-green-50 text-green-700 text-[11px] font-bold border border-green-200">
            <DollarSign size={12}/> 
            Rates from ${Math.min(...hotel.monthlyBaseRates.map(r => r.price))}
        </span>
    ) : (
        <span className="text-[10px] text-gray-400 italic">No rates configured</span>
    )}
</div> */}
                    
                    {/* 3. SOLID ACTION BUTTONS */}
                    <div className="mt-auto flex items-center gap-3">
                        <button onClick={() => handleEdit(hotel)} className="flex-1 py-2.5 bg-[#9333ea] hover:bg-[#7e22ce] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"><Edit size={14} /> Edit</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(hotel.id as string); }} className="flex-1 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"><Trash2 size={14} /> Delete</button>
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

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                 <div>
                    <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Property' : 'Add New Property'}</h2>
                    <p className="text-xs text-gray-500">Configure hotel details</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 disabled:opacity-50"><X size={20}/></button>
              </div>

          




              {/* --- TAB HEADERS --- */}
              <div className="flex border-b border-gray-200 px-6 gap-6 bg-white shrink-0">
                  <button 
                      onClick={() => setActiveTab('info')} 
                      className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                  >
                      Basic Info
                  </button>
                  <button 
                      onClick={() => setActiveTab('rooms')} 
                      className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'rooms' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                  >
                      Rooms Configuration
                  </button>

                 
<button
    onClick={() => setActiveTab('amenities')}
    className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'amenities' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
>
    Amenities {(formData.keyAmenities?.length ?? 0) > 0 && (
      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px]">{formData.keyAmenities!.length}</span>
    )}
</button>



<button
    onClick={() => setActiveTab('rates')}
    className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'rates' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
>
    Pricing & Rates {(formData.monthlyBaseRates?.length ?? 0) > 0 && (
      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px]">{formData.monthlyBaseRates!.length}</span>
    )}
</button>



              </div>

              {/* --- TAB CONTENT AREA --- */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  
                  {/* TAB 1: BASIC INFO (Upgraded to OTA Standards) */}
                  {activeTab === 'info' && (
                      <div className="grid grid-cols-12 gap-6">
                          <div className="col-span-4 space-y-4">
                              <div 
                                  onClick={() => fileInputRef.current?.click()} 
                                  className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white bg-cover bg-center transition-all bg-gray-100 overflow-hidden" 
                                  style={{ backgroundImage: `url(${formData.images[0]})` }}
                              >
                                  {!formData.images[0] && (
                                      <div className="text-center text-gray-400">
                                          <ImageIcon className="mx-auto mb-2"/>
                                          <span className="text-xs font-bold">Upload Cover Image</span>
                                      </div>
                                  )}
                                  <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
                              </div>
                         
                          </div>
                          
                          <div className="col-span-8 space-y-4">
                              {/* Row 1: Property Name */}
                              <div>
                                  <label className="text-xs font-bold text-gray-700 mb-1 block">Property Name *</label>
                                  <input 
                                      type="text" 
                                      value={formData.name} 
                                      onChange={e => setFormData({...formData, name: e.target.value})} 
                                      className="w-full p-2 border border-gray-300 rounded-lg font-bold text-gray-900 outline-none focus:border-purple-500" 
                                      placeholder="e.g. Grand Palace Hotel"
                                  />
                              </div>

                              
                              
                              {/* Row 2: Category and Class Type */}
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="text-xs font-bold text-gray-700 mb-1 block">Category</label>
                                      <select 
                                          value={formData.category || 'Hotel'} 
                                          onChange={e => setFormData({...formData, category: e.target.value})} 
                                          className="w-full p-2 border border-gray-300 rounded-lg bg-white outline-none focus:border-purple-500"
                                      >
                                          <option value="Hotel">Hotel</option>
                                          <option value="Resort">Resort</option>
                                          <option value="Villa">Villa</option>
                                          <option value="Apartment">Apartment</option>
                                          <option value="Boutique">Boutique</option>
                                      </select>
                                  </div>

                                <div className="bg-white p-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2">
                                  <label className="text-sm font-bold text-gray-800">Star Rating</label>
                                  <input 
                                      type="number" 
                                      min="1" 
                                      max="5" 
                                      step="0.5" 
                                      value={formData.rating} 
                                      onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} 
                                      className="w-16 p-0 border rounded font-bold text-center outline-none"
                                  />
                                  <div className="flex text-yellow-400"><Star className="fill-current" size={16}/></div>
                              </div>
                                  {/* <div>
                                      <label className="text-xs font-bold text-gray-700 mb-1 block">Class Type</label>
                                      <select 
                                          value={formData.type || 'Premium'} 
                                          onChange={e => setFormData({...formData, type: e.target.value})} 
                                          className="w-full p-2 border border-gray-300 rounded-lg bg-white outline-none focus:border-purple-500"
                                      >
                                          <option value="Luxury">Luxury</option>
                                          <option value="Premium">Premium</option>
                                          <option value="Deluxe">Deluxe</option>
                                          <option value="Standard">Standard</option>
                                          <option value="Budget">Budget</option>
                                      </select>
                                  </div> */}
                              </div>

                              {/* Row 3: Property Overview */}
                              <div>
                                  <label className="text-xs font-bold text-gray-700 mb-1 block">Property Overview / Description</label>
                                  <textarea 
                                      rows={3} 
                                      value={formData.description} 
                                      onChange={e => setFormData({...formData, description: e.target.value})} 
                                      className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none resize-none focus:border-purple-500" 
                                      placeholder="Short overview of the property amenities, vibe, and positioning..."
                                  />
                              </div>

                              {/* 🌟 Upgraded OTA / GDS Distribution Specs Grid 🌟 */}
                              <div className="bg-purple-50/30 border border-purple-100/60 p-4 rounded-xl space-y-4 mt-2">
                                 <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wide border-b border-purple-100 pb-1">
                                    Property Specs
                                 </h3>
                                 
                                 {/* Distribution Brands */}
                                 {/* <div className="grid grid-cols-3 gap-3">
                                    <div>
                                       <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Chain Code</label>
                                       <input type="text" value={formData.chainCode || ''} onChange={e => setFormData({...formData, chainCode: e.target.value})} placeholder="e.g. BW, Marriott" className="w-full p-2 bg-white border border-gray-200 rounded text-xs outline-none focus:border-purple-400"/>
                                    </div>
                                    <div>
                                       <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Brand</label>
                                       <input type="text" value={formData.brand || ''} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="e.g. Best Western Plus" className="w-full p-2 bg-white border border-gray-200 rounded text-xs outline-none focus:border-purple-400"/>
                                    </div>
                                    <div>
                                       <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">GDS Location</label>
                                       <input type="text" value={formData.gdsLocation || ''} onChange={e => setFormData({...formData, gdsLocation: e.target.value})} placeholder="e.g. Resort, Suburban" className="w-full p-2 bg-white border border-gray-200 rounded text-xs outline-none focus:border-purple-400"/>
                                    </div>
                                 </div> */}

                                 {/* Physical Address Hierarchy */}
                                 <div className="grid grid-cols-4 gap-3">
                                    <div className="col-span-2">
                                       <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Street Address</label>
                                       <input type="text" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Main Street" className="w-full p-2 bg-white border border-gray-200 rounded text-xs outline-none focus:border-purple-400"/>
                                    </div>
                                    <div>
                                       <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">City *</label>
                                       <input type="text" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="City" className="w-full p-2 bg-white border border-gray-200 rounded text-xs font-medium text-gray-800 outline-none focus:border-purple-400"/>
                                    </div>
                                    <div>
                                       <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Country</label>
                                       <input type="text" value={formData.country || ''} onChange={e => setFormData({...formData, country: e.target.value})} placeholder="Country" className="w-full p-2 bg-white border border-gray-200 rounded text-xs font-medium text-gray-800 outline-none focus:border-purple-400"/>
                                    </div>
                                 </div>

                                 {/* Deep Regional Location */}
                                 <div className="grid grid-cols-3 gap-3">
                                    <div>
                                       <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">State / Province</label>
                                       <input type="text" value={formData.stateProvince || ''} onChange={e => setFormData({...formData, stateProvince: e.target.value})} placeholder="State / Region" className="w-full p-2 bg-white border border-gray-200 rounded text-xs outline-none focus:border-purple-400"/>
                                    </div>
                                    <div>
                                       <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Zip / Postal</label>
                                       <input type="text" value={formData.zipPostal || ''} onChange={e => setFormData({...formData, zipPostal: e.target.value})} placeholder="Postal code" className="w-full p-2 bg-white border border-gray-200 rounded text-xs outline-none focus:border-purple-400"/>
                                    </div>
                                    <div>
                                       <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase">Phone</label>
                                       <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 555-0199" className="w-full p-2 bg-white border border-gray-200 rounded text-xs outline-none focus:border-purple-400"/>
                                    </div>
                                 </div>

                             
                              </div>
                          </div>
                      </div>
                  )}

                  {/* TAB 2: ROOMS (Maintained exactly per original source logic) */}
                  {activeTab === 'rooms' && (
                      <div className="space-y-6">
                          {formData.roomCategories.length === 0 ? (
                              <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-xl">
                                  <BedDouble className="mx-auto text-gray-300 mb-3" size={48}/>
                                  <p className="text-gray-500 font-medium mb-4">No rooms configured yet.</p>
                                  <button 
                                      onClick={addRoomCategory} 
                                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors"
                                  >
                                      + Add First Room Category
                                  </button>
                              </div>
                          ) : (
                              <div className="space-y-4">
                                  {formData.roomCategories.map((room, rIndex) => (
                                      <div key={rIndex} className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm p-4 flex gap-4 items-center">
                                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                                              {rIndex + 1}
                                          </div>
                                          <div className="flex-1 grid grid-cols-3 gap-4">
                                            <div>
                                              <label className="text-[10px] font-bold text-gray-500 uppercase">Room Name</label>
                                              <input 
                                                  type="text" 
                                                  value={room.name} 
                                                  onChange={(e) => updateRoomField(rIndex, 'name', e.target.value)} 
                                                  className="w-full p-2 border border-gray-300 rounded outline-none" 
                                                  placeholder="e.g. Deluxe"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[10px] font-bold text-gray-500 uppercase">Max Occupancy</label>
                                              <input 
                                                  type="number" 
                                                  value={room.maxOccupancy} 
                                                  onChange={(e) => updateRoomField(rIndex, 'maxOccupancy', parseInt(e.target.value))} 
                                                  className="w-full p-2 border border-gray-300 rounded outline-none"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[10px] font-bold text-gray-500 uppercase">Bed Type</label>
                                              <input 
                                                  type="text" 
                                                  value={room.bedType} 
                                                  onChange={(e) => updateRoomField(rIndex, 'bedType', e.target.value)} 
                                                  className="w-full p-2 border border-gray-300 rounded outline-none" 
                                                  placeholder="e.g. King"
                                              />
                                            </div>
                                          </div>
                                          <button 
                                              onClick={() => removeRoom(rIndex)} 
                                              className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                          >
                                              <Trash2 size={16}/>
                                          </button>
                                      </div>
                                  ))}
                                  <button 
                                      onClick={addRoomCategory} 
                                      className="w-full py-3 border-2 border-dashed border-purple-300 bg-purple-50 text-purple-700 font-bold rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                                  >
                                      <PlusCircle size={20}/> Add Another Room
                                  </button>
                              </div>
                          )}
                      </div>
                  )}


            

{/* TAB 3: KEY AMENITIES */}
{activeTab === 'amenities' && (
    <div className="space-y-4">
        
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Quick add:</span>
            {AMENITY_PRESETS.map(p => (
                <button
                    key={p}
                    onClick={() => addAmenity(p)}
                    disabled={(formData.keyAmenities || []).some(a => a.key === p)}
                    className="px-3 py-1 text-xs font-medium rounded-full border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    + {p}
                </button>
            ))}
        </div>

        {(formData.keyAmenities || []).length === 0 ? (
            <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-xl">
                <p className="text-gray-500 font-medium mb-4">No amenities added yet.</p>
                <button onClick={() => addAmenity()} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors">
                    + Add First Amenity
                </button>
            </div>
        ) : (
            <div className="space-y-3">
                {(formData.keyAmenities || []).map((a, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-300 shadow-sm p-4 flex gap-4 items-start">
                        <div className="w-1/3">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Key Amenity</label>
                            <input
                                type="text"
                                value={a.key}
                                onChange={e => updateAmenity(i, 'key', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded outline-none font-medium focus:border-purple-500"
                                placeholder="e.g. Wi-Fi access/passwords"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Details</label>
                            <textarea
                                rows={2}
                                value={a.details || ''}
                                onChange={e => updateAmenity(i, 'details', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded outline-none text-sm resize-none focus:border-purple-500"
                                placeholder="e.g. Free Wi-Fi is available throughout the hotel."
                            />
                        </div>
                        <button onClick={() => removeAmenity(i)} className="mt-5 text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                <button onClick={() => addAmenity()} className="w-full py-3 border-2 border-dashed border-purple-300 bg-purple-50 text-purple-700 font-bold rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2">
                    <PlusCircle size={20} /> Add Another Amenity
                </button>
            </div>
        )}
    </div>
)}



{/* TAB 4: PRICING & RATES */}
{/* TAB 4: PRICING & RATES */}
{activeTab === 'rates' && (() => {
    // 🌟 LOGIC: Dynamically group the flat rates array by Year for clean rendering
    const ratesByYear = (formData.monthlyBaseRates || []).reduce((acc, rate, index) => {
        const year = rate.period.split(' ')[1]; // Extracts "2027" from "Jan 2027"
        if (!acc[year]) acc[year] = [];
        acc[year].push({ ...rate, originalIndex: index });
        return acc;
    }, {} as Record<string, Array<{ period: string, price: number, originalIndex: number }>>);

    return (
        <div className="space-y-8">
            
            {/* ADD YEAR BAR */}
            <div className="bg-purple-50 p-5 rounded-xl border border-purple-200 flex items-center justify-between shadow-sm">
                <div>
                    <h3 className="text-sm font-bold text-purple-900">Add Pricing Year</h3>
                    <p className="text-[10px] text-purple-700 mt-0.5">Generate a clean 12-month block for a specific year.</p>
                </div>
                <div className="flex items-center gap-3">
                    <input 
                        type="number" 
                        value={bulkYear} 
                        onChange={e => setBulkYear(e.target.value)} 
                        className="w-24 p-2.5 border border-purple-300 rounded-lg outline-none text-sm font-bold text-center bg-white focus:border-purple-600"
                        placeholder="e.g. 2027"
                    />
                    <button 
                        onClick={() => {
                            if ((formData.monthlyBaseRates || []).some(r => r.period.includes(bulkYear))) {
                                return alert(`Rates for the year ${bulkYear} have already been added!`);
                            }
                            generateYearRates();
                        }} 
                        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-md transition-colors"
                    >
                        Generate 12 Months
                    </button>
                </div>
            </div>

            {/* EMPTY STATE OR YEARLY GRIDS */}
            {Object.keys(ratesByYear).length === 0 ? (
                <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-xl">
                    <DollarSign className="mx-auto text-gray-300 mb-3" size={40}/>
                    <p className="text-gray-500 font-medium mb-4">No rates configured yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Map through the grouped years chronologically */}
                    {Object.entries(ratesByYear).sort(([a], [b]) => a.localeCompare(b)).map(([year, rates]) => (
                        <div key={year} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                            
                            {/* Year Header & Delete Button */}
                            {/* <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                                <h4 className="text-lg font-extrabold text-gray-800">Rates for {year}</h4> */}
                                {/* 🌟 FIX: Year Header & Delete Button with Property Name */}
<div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
    <div className="flex flex-col">
        <h4 className="text-lg font-extrabold text-gray-800">Rates for {year}</h4>
        {formData.name && (
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wide mt-0.5">
                {formData.name}
            </span>
        )}
    </div>
                                <button 
                                    onClick={() => {
                                        if (confirm(`Are you sure you want to remove all rates for ${year}?`)) {
                                            const updated = (formData.monthlyBaseRates || []).filter(r => !r.period.includes(year));
                                            setFormData(prev => ({ ...prev, monthlyBaseRates: updated }));
                                        }
                                    }}
                                    className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-100 transition-colors"
                                >
                                    Remove {year}
                                </button>
                            </div>
                            
                            {/* The 12-Month Grid for this specific year */}
                            <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
                                {rates.map((rate) => (
                                    <div key={rate.period} className="bg-gray-50 p-3 rounded-xl border border-gray-200 relative">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">{rate.period}</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-sm text-gray-400 font-bold">$</span>
                                            <input 
                                                type="number" 
                                                value={rate.price || ''} 
                                                onChange={e => updateRate(rate.originalIndex, parseFloat(e.target.value) || 0)} 
                                                className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded text-sm font-bold text-gray-900 outline-none focus:border-purple-500 bg-white"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
})()}
              </div>

              

              <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
                  <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">Cancel</button>
                  <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-70">
                    {isSaving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18}/> Save Hotel</>}
                  </button>
              </div>
           </div>

        </div>


      )}


                           {importResult && (
  <StayImportPreview
    fileName={importFile?.name || ''}
    result={importResult}
    duplicateKeys={duplicateKeys}
    isBusy={isImporting}
    progress={importProgress}
    onRemap={handleRemap}
    onConfirm={handleConfirmImport}
    onCancel={closeImportPreview}
  />
)}
   </div>
  );
}






