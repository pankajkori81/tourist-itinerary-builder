
// "use client";

// import React, { useState, useRef, useMemo, useEffect } from 'react';
// import { 
//   Plus, MapPin, Building2, Star, 
//   Trash2, X, Save, Image as ImageIcon, 
//   ChevronDown, ChevronRight, BedDouble, PlusCircle, Globe, Calendar, MinusCircle,
//   Edit
// } from 'lucide-react';
// import { useSRM } from '@/app/context/SRMContext';
// import { StayData, RoomCategory, saveStay, deleteStay, RateCard } from '@/utils/srmStorage';

// // Default empty rates
// const DEFAULT_RATES = {
//   jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
//   jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0
// };

// export default function StaySRMPage() {
//   const { stays, refreshAll, searchText } = useSRM();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState<'info' | 'rooms'>('info');
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Nested Accordion State
//   const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
//   const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

//   // --- FORM STATE ---
//   const initialForm: StayData = {
//     id: '', name: '', type: 'Hotel', city: '', country: '', address: '',
//     rating: 4.5, description: '', images: [],
//     roomCategories: [], // Start empty
//     status: 'Active', createdAt: '', updatedAt: ''
//   };
//   const [formData, setFormData] = useState<StayData>(initialForm);

//   // --- 1. NESTED GROUPING LOGIC (Country -> City -> Hotels) ---
//   const groupedData = useMemo(() => {
//     const filtered = stays.filter(s => 
//       (s.name || "").toLowerCase().includes(searchText.toLowerCase()) || 
//       (s.city || "").toLowerCase().includes(searchText.toLowerCase()) ||
//       (s.country || "").toLowerCase().includes(searchText.toLowerCase())
//     );

//     // Structure: { "Italy": { "Rome": [Hotel1, Hotel2], "Florence": [Hotel3] } }
//     const groups: Record<string, Record<string, StayData[]>> = {};

//     filtered.forEach(item => {
//       // Normalize casing
//       const country = (item.country || "Uncategorized").trim();
//       const city = (item.city || "Unknown City").trim();

//       if (!groups[country]) groups[country] = {};
//       if (!groups[country][city]) groups[country][city] = [];
      
//       groups[country][city].push(item);
//     });

//     // Sort keys alphabetically
//     return Object.keys(groups).sort().reduce((acc, country) => {
//         acc[country] = groups[country];
//         return acc;
//     }, {} as Record<string, Record<string, StayData[]>>);
//   }, [stays, searchText]);

//   // Auto-expand on search
//   useEffect(() => {
//     if (searchText) {
//        const allCountries = Object.keys(groupedData);
//        const newExpCountries = allCountries.reduce((acc, key) => ({...acc, [key]: true}), {});
//        setExpandedCountries(newExpCountries);
       
//        const newExpCities: Record<string, boolean> = {};
//        allCountries.forEach(c => {
//            Object.keys(groupedData[c]).forEach(city => {
//                newExpCities[`${c}-${city}`] = true; // Unique key for city accordion
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
//     // Normalize text
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

//   // --- 2. ROOM & MATRIX HANDLERS (Dynamic Years) ---
  
//   const addRoomCategory = () => {
//     const currentYear = new Date().getFullYear();
//     const newRoom: RoomCategory = {
//       id: Date.now().toString(),
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

//   // DYNAMIC YEAR LOGIC
//   const addYearToRoom = (roomIndex: number) => {
//     const newCategories = [...formData.roomCategories];
//     const room = newCategories[roomIndex];
    
//     // Find max year currently exists
//     const maxYear = room.rateCards.length > 0 
//         ? Math.max(...room.rateCards.map(c => c.year)) 
//         : new Date().getFullYear() - 1;

//     room.rateCards.push({
//         year: maxYear + 1,
//         rates: { ...DEFAULT_RATES }
//     });
    
//     // Sort years ascending
//     room.rateCards.sort((a, b) => a.year - b.year);
    
//     setFormData({ ...formData, roomCategories: newCategories });
//   };

//   const removeYearFromRoom = (roomIndex: number, yearToDelete: number) => {
//     const newCategories = [...formData.roomCategories];
//     newCategories[roomIndex].rateCards = newCategories[roomIndex].rateCards.filter(rc => rc.year !== yearToDelete);
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

//         {/* CONTENT: Nested Grouped List */}
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
                        
//                         {/* 1. COUNTRY HEADER */}
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
                        
//                         {/* 2. CITIES LIST */}
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

//                                             {/* 3. HOTELS GRID */}
//                                             {expandedCities[cityKey] && (
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-6 mb-4">
//                                                     {hotels.map(hotel => (
//                                                         <div key={hotel.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col overflow-hidden">
    
//                                                             {/* --- A. IMAGE AREA --- */}
//                                                             <div className="h-35 bg-gray-100 relative shrink-0 overflow-hidden">
//                                                                 {hotel.images?.[0] ? (
//                                                                     <img 
//                                                                         src={hotel.images[0]} 
//                                                                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
//                                                                         alt={hotel.name}
//                                                                     />
//                                                                 ) : (
//                                                                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 shadow-inner border border-white/10 group">
//                                                                         <ImageIcon
//                                                                             size={48}
//                                                                             className="text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
//                                                                         />
//                                                                     </div>
//                                                                 )}
                                                                
                                                          
//                                                                 {/* Type Badge */}
//                                                                 <div className="absolute bottom-3 left-3 flex">
//                                                                     <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/10">
//                                                                         {hotel.type}
//                                                                     </span>

//                                                                           {/* Rating Badge */}
//                                                                 <div className="ml-82 bg-white/85 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1.5 border border-white/50">
//                                                                     <Star size={12} className="fill-yellow-700 text-yellow-700"/> 
//                                                                     <span className="text-gray-800">{hotel.rating}</span>
//                                                                 </div>
//                                                                 </div>
//                                                             </div>
                                                            
//                                                             {/* --- B. CONTENT AREA --- */}
//                                                             <div className="p-5 flex-1 flex flex-col">
                                                                
//                                                                 {/* Header: Name & Location */}
//                                                                 <div className="mb-3">
//                                                                     <h4 className="font-bold text-gray-900 text-lg leading-tight truncate mb-1" title={hotel.name}>
//                                                                         {hotel.name}
//                                                                     </h4>
//                                                                     <div className="flex items-center text-xs text-gray-700 font-medium">
//                                                                         <MapPin size={14} className="mr-1 text-purple-600 shrink-0" />
//                                                                         <span className="truncate">{hotel.city}, {hotel.country}</span>
//                                                                     </div>
                                                                         
//                                                                 </div>

                                                           


//                                                                 {/* Room Categories List */}
//                                                                 <div className="mb-4 flex-1">
//                                                                     <div className="flex items-center gap-1.5 mb-2.5">
//                                                                         <BedDouble size={14} className="text-gray-600"/>
//                                                                         <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Room Types</span>
//                                                                     </div>
                                                                    
//                                                                     <div className="flex flex-wrap gap-2">
//                                                                         {(hotel.roomCategories || []).length > 0 ? (
//                                                                             hotel.roomCategories.map((rc, idx) => (
//                                                                                 <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 transition-colors cursor-default">
//                                                                                     {rc.name}
//                                                                                 </span>
//                                                                             ))
//                                                                         ) : (
//                                                                             <span className="text-xs text-gray-400 italic pl-1">No rooms configured</span>
//                                                                         )}
//                                                                     </div>
//                                                                 </div>
                                                                
//                                                                 {/* --- C. ACTION FOOTER --- */}
//                                                                 <div className="mt-auto  border-t border-gray-100 flex items-center gap-3">
//                                                                     <button 
//                                                                         onClick={() => handleEdit(hotel)} 
//                                                                         className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all active:scale-95 flex items-center justify-center gap-2"
//                                                                     >
//                                                                         <Edit size={14} /> Edit Rates
//                                                                     </button>

//                                                                         <button 
//                                                                         onClick={() => handleDelete(hotel.id)} 
//                                                                         className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all active:scale-95 flex items-center justify-center gap-2"
//                                                                     >
//                                                                         <Trash2 size={14} /> Delete 
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
//                 ))
//             )}
//         </div>
//       </div>


 

//       {/* --- ADD/EDIT MODAL --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
//            <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
//               {/* Modal Header */}
//               <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//                  <div>
//                     <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Property' : 'Add New Property'}</h2>
//                     <p className="text-xs text-gray-500">Configure property details and seasonal pricing</p>
//                  </div>
//                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><X size={20}/></button>
//               </div>

//               {/* Modal Tabs */}
//               <div className="flex border-b border-gray-200 px-6 gap-6 bg-white shrink-0">
//                   <button onClick={() => setActiveTab('info')} className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>
//                       Basic Info
//                   </button>
//                   <button onClick={() => setActiveTab('rooms')} className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'rooms' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>
//                       Rooms & Rates (Matrix)
//                   </button>
//               </div>

//               {/* Modal Body */}
//               <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  
//                   {/* TAB 1: BASIC INFO */}
//                   {activeTab === 'info' && (
//                       <div className="grid grid-cols-12 gap-6">
//                           <div className="col-span-4 space-y-4">
//                               <div 
//                                 onClick={() => fileInputRef.current?.click()}
//                                 className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white bg-cover bg-center transition-all bg-gray-100"
//                                 style={{ backgroundImage: `url(${formData.images[0]})` }}
//                               >
//                                   {!formData.images[0] && (
//                                     <div className="text-center text-gray-400">
//                                         <ImageIcon className="mx-auto mb-2"/>
//                                         <span className="text-xs font-bold">Upload Cover Image</span>
//                                     </div>
//                                   )}
//                                   <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
//                               </div>
//                               <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
//                                   <label className="text-xs font-bold text-gray-700 mb-2 block">Star Rating</label>
//                                   <div className="flex items-center gap-2">
//                                       <input type="number" min="1" max="5" step="0.5" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} className="w-16 p-1 border rounded font-bold text-center"/>
//                                       <div className="flex text-yellow-400"><Star className="fill-current" size={16}/></div>
//                                   </div>
//                               </div>
//                           </div>
                          
//                           <div className="col-span-8 space-y-4">
//                               <div className="grid grid-cols-2 gap-4">
//                                   <div>
//                                       <label className="text-xs font-bold text-gray-700 mb-1 block">Hotel Name *</label>
//                                       <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg font-bold" placeholder="e.g. Grand Hotel"/>
//                                   </div>
//                                   <div>
//                                       <label className="text-xs font-bold text-gray-700 mb-1 block">Type</label>
//                                       <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg bg-white">
//                                           <option>Hotel</option><option>Resort</option><option>Villa</option><option>Apartment</option>
//                                       </select>
//                                   </div>
//                               </div>
//                               <div className="grid grid-cols-2 gap-4">
//                                   <div>
//                                       <label className="text-xs font-bold text-gray-700 mb-1 block">City *</label>
//                                       <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="e.g. Rome"/>
//                                   </div>
//                                   <div>
//                                       <label className="text-xs font-bold text-gray-700 mb-1 block">Country *</label>
//                                       <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="e.g. Italy"/>
//                                   </div>
//                               </div>
//                               <div>
//                                   <label className="text-xs font-bold text-gray-700 mb-1 block">Address</label>
//                                   <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Full address..."/>
//                               </div>
//                               <div>
//                                   <label className="text-xs font-bold text-gray-700 mb-1 block">Description</label>
//                                   <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Property description..."/>
//                               </div>
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
//                                   <button onClick={addRoomCategory} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors">
//                                       + Add First Room Category
//                                   </button>
//                               </div>
//                           ) : (
//                               <div className="space-y-8">
//                                   {formData.roomCategories.map((room, rIndex) => (
//                                       <div key={room.id} className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm">
//                                           {/* Room Header */}
//                                           <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 flex justify-between items-center">
//                                               <div className="flex gap-4 items-center flex-1">
//                                                   <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">{rIndex + 1}</div>
//                                                   <input 
//                                                     type="text" 
//                                                     value={room.name} 
//                                                     onChange={(e) => updateRoomField(rIndex, 'name', e.target.value)}
//                                                     className="font-bold text-gray-800 bg-transparent border-b border-dashed border-gray-400 focus:border-purple-600 outline-none w-64 px-1"
//                                                     placeholder="Room Name (e.g. Deluxe)"
//                                                   />
//                                               </div>
//                                               <div className="flex gap-4 items-center">
//                                                   <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-gray-300 shadow-sm">
//                                                       <span className="text-xs text-gray-700 uppercase font-bold">Max Pax:</span>
//                                                       <input type="number" value={room.maxOccupancy} onChange={(e) => updateRoomField(rIndex, 'maxOccupancy', parseInt(e.target.value))} className="w-10 text-center font-bold outline-none text-purple-700"/>
//                                                   </div>
//                                                   <button onClick={() => removeRoom(rIndex)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"><Trash2 size={16}/></button>
//                                               </div>
//                                           </div>

//                                           {/* The Pricing Matrix */}
//                                           <div className="p-4 overflow-x-auto">
//                                               {/* Dynamic Year Rate Cards */}
//                                               {room.rateCards.map((card, yIndex) => (
//                                                   <div key={card.year} className="mb-6 last:mb-0 relative group">
//                                                       <div className="flex items-center justify-between mb-2">
//                                                           <div className="flex items-center gap-2">
//                                                               <span className="bg-gray-800 text-white px-3 py-1 rounded text-xs font-bold shadow-sm">{card.year} Rate Card</span>
//                                                               <span className="text-[10px] text-gray-600 uppercase tracking-wide">USD per Night</span>
//                                                           </div>
//                                                           {/* Delete Year Button */}
//                                                           <button 
//                                                             onClick={() => removeYearFromRoom(rIndex, card.year)}
//                                                             className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600 p-1"
//                                                             title="Remove Year"
//                                                           >
//                                                               <Trash2 size={14}/>
//                                                           </button>
//                                                       </div>
//                                                       <div className="grid grid-cols-6 lg:grid-cols-12 gap-2">
//                                                           {Object.keys(DEFAULT_RATES).map((month) => (
//                                                               <div key={month} className="flex flex-col">
//                                                                   <span className="text-[10px] font-bold text-gray-700 uppercase mb-1 pl-1">{month}</span>
//                                                                   <div className="relative">
//                                                                       <span className="absolute left-2 top-1.5 text-gray-700 text-xs">$</span>
//                                                                       <input 
//                                                                         // @ts-ignore
//                                                                         value={card.rates[month]}
//                                                                         type="number"
//                                                                         onChange={(e) => updateRate(rIndex, yIndex, month, parseFloat(e.target.value))}
//                                                                         className="w-full pl-4 pr-1 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 outline-none font-bold text-gray-700 shadow-sm"
//                                                                       />
//                                                                   </div>
//                                                               </div>
//                                                           ))}
//                                                       </div>
//                                                   </div>
//                                               ))}

//                                               {/* Add Year Button */}
//                                               <button 
//                                                 onClick={() => addYearToRoom(rIndex)}
//                                                 className="mt-4 text-xs font-bold text-purple-600 flex items-center gap-1 hover:bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors"
//                                               >
//                                                   <PlusCircle size={14} /> Add Next Year
//                                               </button>
//                                           </div>
//                                       </div>
//                                   ))}
                                  
//                                   <button onClick={addRoomCategory} className="w-full py-3 border-2 border-dashed border-purple-300 bg-purple-50 text-purple-700 font-bold rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2">
//                                       <PlusCircle size={20}/> Add Another Room Category
//                                   </button>
//                               </div>
//                           )}
//                       </div>
//                   )}
//               </div>

//               {/* Modal Footer */}
//               <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
//                   <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
//                   <button onClick={handleSave} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition-transform active:scale-95">
//                       <Save size={18}/> Save Property
//                   </button>
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
  Edit, Briefcase, Phone, Mail, CreditCard, DollarSign
} from 'lucide-react';
import { useSRM } from '@/app/context/SRMContext';
import { StayData, RoomCategory, saveStay, deleteStay } from '@/utils/srmStorage';

// Default empty rates
const DEFAULT_RATES = {
  jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
  jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0
};

export default function StaySRMPage() {
  const { stays, suppliers, refreshAll, searchText } = useSRM(); // [CHANGE: Added suppliers context]
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'rooms'>('info');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Nested Accordion State
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

  // --- FORM STATE ---
  // [CHANGE: Added linkedSupplierId to initialForm]
  const initialForm: StayData = {
    id: '', name: '', type: 'Hotel', city: '', country: '', address: '',
    rating: 4.5, description: '', images: [],
    roomCategories: [], 
    status: 'Active', createdAt: '', updatedAt: '',
    linkedSupplierId: '' // <--- NEW FIELD
  };
  const [formData, setFormData] = useState<StayData>(initialForm);

  // --- [NEW LOGIC START]: SMART SUPPLIER FILTERING ---
  // 1. Filter Suppliers: Must be Active + Provide "Stay" + Match City (if typed)
  const availableSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const basicCheck = s.status === 'Active' && s.services.includes('Stay');
      const cityCheck = formData.city 
        ? s.city.toLowerCase().trim() === formData.city.toLowerCase().trim() 
        : true; 
      return basicCheck && cityCheck;
    });
  }, [suppliers, formData.city]);

  // 2. Auto-Select "Preferred" Supplier when City changes
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

  // 3. Get Data for the "Intelligence Box"
  const selectedSupplierData = suppliers.find(s => s.id === formData.linkedSupplierId);
  // --- [NEW LOGIC END] ---

  // --- NESTED GROUPING LOGIC (Country -> City -> Hotels) ---
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

  // Auto-expand on search
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

  // --- HANDLERS ---
  const handleEdit = (item: StayData) => { 
    setFormData(JSON.parse(JSON.stringify(item))); 
    setActiveTab('info');
    setIsModalOpen(true); 
  };

  const handleDelete = (id: string) => { 
    if (confirm('Delete this hotel and all its rates?')) { 
      deleteStay(id); 
      refreshAll(); 
    } 
  };

  const handleSave = () => {
    if (!formData.name || !formData.city) return alert("Hotel Name and City are required");
    const cleanData = {
        ...formData,
        city: formData.city.trim(),
        country: formData.country.trim()
    };
    saveStay(cleanData);
    refreshAll();
    setIsModalOpen(false);
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

  // --- ROOM & MATRIX HANDLERS ---
  const addRoomCategory = () => {
    const currentYear = new Date().getFullYear();
    const newRoom: RoomCategory = {
      id: Date.now().toString(),
      name: 'Standard Room',
      maxOccupancy: 2,
      bedType: 'Double',
      inclusions: ['Breakfast'],
      rateCards: [
        { year: currentYear, rates: { ...DEFAULT_RATES } },
        { year: currentYear + 1, rates: { ...DEFAULT_RATES } }
      ]
    };
    setFormData(prev => ({ ...prev, roomCategories: [...prev.roomCategories, newRoom] }));
  };

  const addYearToRoom = (roomIndex: number) => {
    const newCategories = [...formData.roomCategories];
    const room = newCategories[roomIndex];
    const maxYear = room.rateCards.length > 0 
        ? Math.max(...room.rateCards.map(c => c.year)) 
        : new Date().getFullYear() - 1;

    room.rateCards.push({ year: maxYear + 1, rates: { ...DEFAULT_RATES } });
    room.rateCards.sort((a, b) => a.year - b.year);
    setFormData({ ...formData, roomCategories: newCategories });
  };

  const removeYearFromRoom = (roomIndex: number, yearToDelete: number) => {
    const newCategories = [...formData.roomCategories];
    newCategories[roomIndex].rateCards = newCategories[roomIndex].rateCards.filter(rc => rc.year !== yearToDelete);
    setFormData({ ...formData, roomCategories: newCategories });
  };

  const updateRate = (roomIndex: number, yearIndex: number, month: string, value: number) => {
    const newCategories = [...formData.roomCategories];
    // @ts-ignore
    newCategories[roomIndex].rateCards[yearIndex].rates[month] = value;
    setFormData({ ...formData, roomCategories: newCategories });
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
                <p className="text-xs text-gray-600 font-medium">Manage hotels, room types, and seasonal rate cards.</p>
            </div>
            <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
            <Plus size={18} /> Add Hotel
            </button>
        </div>

        {/* LIST VIEW */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
            {Object.keys(groupedData).length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-gray-600 bg-white/40 rounded-xl border border-white/50 backdrop-blur-sm">
                    <Building2 size={48} className="opacity-50 mb-2"/>
                    <p className="font-bold">No properties found.</p>
                    <p className="text-sm">Click "Add Hotel" to start.</p>
                 </div>
             ) : (
                Object.entries(groupedData).map(([country, cities]) => (
                    <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* COUNTRY HEADER */}
                        <div 
                            onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))}
                            className="flex items-center bg-white/95 p-4 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white transition-all select-none border border-white/50 backdrop-blur-sm mb-2"
                        >
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:text-purple-800 transition-colors">
                                {expandedCountries[country] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                    <Globe size={18} className="text-purple-600" />
                                    {country}
                                </h3>
                            </div>
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                                {Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Hotels
                            </span>
                        </div>
                        
                        {/* CITIES LIST */}
                        {expandedCountries[country] && (
                            <div className="ml-4 pl-4 border-l-2 border-white/40 space-y-3">
                                {Object.entries(cities).map(([city, hotels]) => {
                                    const cityKey = `${country}-${city}`;
                                    return (
                                        <div key={city}>
                                            <div 
                                                onClick={() => setExpandedCities(prev => ({...prev, [cityKey]: !prev[cityKey]}))}
                                                className="flex items-center bg-white/95 p-3 rounded-lg gap-2 cursor-pointer hover:bg-white/80 transition-all select-none border border-white/30 backdrop-blur-sm mb-2"
                                            >
                                                {expandedCities[cityKey] ? <ChevronDown size={16} className="text-gray-500"/> : <ChevronRight size={16} className="text-gray-500"/>}
                                                <MapPin size={16} className="text-red-900" />
                                                <span className="font-bold text-gray-900">{city}</span>
                                                <span className="text-xs text-gray-900 bg-blue-200 px-2 py-0.5 rounded-full">
                                                    {hotels.length}
                                                </span>
                                            </div>

                                            {/* HOTELS GRID */}
                                            {expandedCities[cityKey] && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-6 mb-4">
                                                    {hotels.map(hotel => {
                                                        // [CHANGE: Find linked supplier to display "By: X"]
                                                        const sup = suppliers.find(s => s.id === hotel.linkedSupplierId);
                                                        
                                                        return (
                                                            <div key={hotel.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col overflow-hidden">
                                                                {/* IMAGE */}
                                                                <div className="h-35 bg-gray-100 relative shrink-0 overflow-hidden">
                                                                    {hotel.images?.[0] ? (
                                                                        <img src={hotel.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={hotel.name}/>
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 shadow-inner group"><ImageIcon size={48} className="text-white drop-shadow-lg"/></div>
                                                                    )}
                                                                    <div className="absolute bottom-3 left-3 flex">
                                                                        <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/10">{hotel.type}</span>
                                                                        <div className="ml-82 bg-white/85 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1.5 border border-white/50"><Star size={12} className="fill-yellow-700 text-yellow-700"/> <span className="text-gray-800">{hotel.rating}</span></div>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* CONTENT */}
                                                                <div className="p-5 flex-1 flex flex-col">
                                                                    <div className="mb-3">
                                                                        <h4 className="font-bold text-gray-900 text-lg leading-tight truncate mb-1" title={hotel.name}>{hotel.name}</h4>
                                                                        <div className="flex items-center text-xs text-gray-700 font-medium">
                                                                            <MapPin size={14} className="mr-1 text-purple-600 shrink-0" />
                                                                            <span className="truncate">{hotel.city}, {hotel.country}</span>
                                                                        </div>
                                                                        {/* [CHANGE: Show Supplier Badge] */}
                                                                        {sup && (
                                                                            <div className="mt-2 inline-flex items-center gap-1 bg-purple-50 text-purple-800 px-2 py-1 rounded text-[10px] border border-purple-100">
                                                                                <Briefcase size={10} /> 
                                                                                <span className="font-bold truncate max-w-[150px]">By: {sup.name}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="mb-4 flex-1">
                                                                        <div className="flex items-center gap-1.5 mb-2.5">
                                                                            <BedDouble size={14} className="text-gray-600"/>
                                                                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Room Types</span>
                                                                        </div>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {(hotel.roomCategories || []).length > 0 ? (
                                                                                hotel.roomCategories.map((rc, idx) => (
                                                                                    <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">{rc.name}</span>
                                                                                ))
                                                                            ) : <span className="text-xs text-gray-400 italic pl-1">No rooms</span>}
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="mt-auto border-t border-gray-100 flex items-center gap-3 pt-3">
                                                                        <button onClick={() => handleEdit(hotel)} className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm"><Edit size={14} /> Edit Rates</button>
                                                                        <button onClick={() => handleDelete(hotel.id)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm"><Trash2 size={14} /> Delete</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
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

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                 <div>
                    <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Property' : 'Add New Property'}</h2>
                    <p className="text-xs text-gray-500">Configure property details and seasonal pricing</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><X size={20}/></button>
              </div>

              <div className="flex border-b border-gray-200 px-6 gap-6 bg-white shrink-0">
                  <button onClick={() => setActiveTab('info')} className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>Basic Info</button>
                  <button onClick={() => setActiveTab('rooms')} className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'rooms' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>Rooms & Rates</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  {/* TAB 1: BASIC INFO */}
                  {activeTab === 'info' && (
                      <div className="grid grid-cols-12 gap-6">
                          <div className="col-span-4 space-y-4">
                              <div onClick={() => fileInputRef.current?.click()} className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white bg-cover bg-center transition-all bg-gray-100" style={{ backgroundImage: `url(${formData.images[0]})` }}>
                                  {!formData.images[0] && (<div className="text-center text-gray-400"><ImageIcon className="mx-auto mb-2"/><span className="text-xs font-bold">Upload Cover Image</span></div>)}
                                  <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
                              </div>
                              <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
                                  <label className="text-xs font-bold text-gray-700">Star Rating</label>
                                  <input type="number" min="1" max="5" step="0.5" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} className="w-16 p-1 border rounded font-bold text-center"/>
                                  <div className="flex text-yellow-400"><Star className="fill-current" size={16}/></div>
                              </div>
                          </div>
                          
                          <div className="col-span-8 space-y-4">
                              {/* --- [CHANGE: SUPPLIER LINKAGE SECTION] --- */}
                              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 flex gap-4 items-start">
                                  <div className="flex-1">
                                      <label className="block text-xs font-bold text-purple-900 mb-2 flex items-center gap-1">
                                          <Briefcase size={14} /> Fulfillment Partner (Stay)
                                      </label>
                                      <select 
                                          className="w-full p-2.5 border border-purple-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                                          value={formData.linkedSupplierId || ""}
                                          onChange={(e) => setFormData({...formData, linkedSupplierId: e.target.value})}
                                      >
                                          <option value="">-- Direct / Unknown --</option>
                                          {availableSuppliers.map(s => (
                                              <option key={s.id} value={s.id}>
                                                  {s.name} ({s.city}) {s.isPreferred ? '★ Preferred' : ''}
                                              </option>
                                          ))}
                                          {formData.linkedSupplierId && !availableSuppliers.find(s => s.id === formData.linkedSupplierId) && selectedSupplierData && (
                                               <option value={selectedSupplierData.id}>{selectedSupplierData.name} (Current) - *City Mismatch*</option>
                                          )}
                                      </select>
                                      {availableSuppliers.length === 0 && formData.city && (
                                          <p className="text-[10px] text-red-500 mt-1">No 'Stay' suppliers found in {formData.city}.</p>
                                      )}
                                  </div>
                                  
                                  {/* [CHANGE: ENHANCED INTELLIGENCE BOX] */}
                                  {selectedSupplierData && (
                                      <div className="flex-1 bg-white p-3 rounded-lg border border-purple-100 shadow-sm text-xs">
                                          <div className="font-bold text-gray-800 mb-2 flex justify-between items-center border-b border-gray-100 pb-1">
                                              <span>{selectedSupplierData.contactPerson}</span>
                                              {selectedSupplierData.isPreferred && <span className="bg-orange-100 text-orange-700 px-1.5 rounded text-[10px]">Preferred</span>}
                                          </div>
                                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-600">
                                              <div className="flex items-center gap-1"><Phone size={10}/> {selectedSupplierData.phone}</div>
                                              <div className="flex items-center gap-1"><CreditCard size={10}/> {selectedSupplierData.paymentTerms}</div>
                                              <div className="col-span-2 flex items-center gap-1 truncate" title={selectedSupplierData.email}><Mail size={10}/> {selectedSupplierData.email}</div>
                                              <div className="col-span-2 flex items-center gap-1 font-bold text-purple-800 bg-purple-50 px-1 rounded"><DollarSign size={10}/> Currency: {selectedSupplierData.currency || 'USD'}</div>
                                          </div>
                                      </div>
                                  )}
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                  <div><label className="text-xs font-bold text-gray-700 mb-1 block">Hotel Name *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg font-bold" placeholder="e.g. Grand Hotel"/></div>
                                  <div><label className="text-xs font-bold text-gray-700 mb-1 block">Type</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg bg-white"><option>Hotel</option><option>Resort</option><option>Villa</option><option>Apartment</option></select></div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div><label className="text-xs font-bold text-gray-700 mb-1 block">City *</label><input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="e.g. Rome"/></div>
                                  <div><label className="text-xs font-bold text-gray-700 mb-1 block">Country *</label><input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="e.g. Italy"/></div>
                              </div>
                              <div><label className="text-xs font-bold text-gray-700 mb-1 block">Address</label><input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Full address..."/></div>
                              <div><label className="text-xs font-bold text-gray-700 mb-1 block">Description</label><textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Property description..."/></div>
                          </div>
                      </div>
                  )}

                  {/* TAB 2: ROOMS & RATES (THE MATRIX) */}
                  {activeTab === 'rooms' && (
                      <div className="space-y-6">
                          {formData.roomCategories.length === 0 ? (
                              <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-xl">
                                  <BedDouble className="mx-auto text-gray-300 mb-3" size={48}/>
                                  <p className="text-gray-500 font-medium mb-4">No rooms configured yet.</p>
                                  <button onClick={addRoomCategory} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors">+ Add First Room Category</button>
                              </div>
                          ) : (
                              <div className="space-y-8">
                                  {formData.roomCategories.map((room, rIndex) => (
                                      <div key={room.id} className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm">
                                          <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 flex justify-between items-center">
                                              <div className="flex gap-4 items-center flex-1">
                                                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">{rIndex + 1}</div>
                                                  <input type="text" value={room.name} onChange={(e) => updateRoomField(rIndex, 'name', e.target.value)} className="font-bold text-gray-800 bg-transparent border-b border-dashed border-gray-400 focus:border-purple-600 outline-none w-64 px-1" placeholder="Room Name (e.g. Deluxe)"/>
                                              </div>
                                              <div className="flex gap-4 items-center">
                                                  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-gray-300 shadow-sm"><span className="text-xs text-gray-700 uppercase font-bold">Max Pax:</span><input type="number" value={room.maxOccupancy} onChange={(e) => updateRoomField(rIndex, 'maxOccupancy', parseInt(e.target.value))} className="w-10 text-center font-bold outline-none text-purple-700"/></div>
                                                  <button onClick={() => removeRoom(rIndex)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"><Trash2 size={16}/></button>
                                              </div>
                                          </div>
                                          <div className="p-4 overflow-x-auto">
                                              {room.rateCards.map((card, yIndex) => (
                                                  <div key={card.year} className="mb-6 last:mb-0 relative group">
                                                      <div className="flex items-center justify-between mb-2">
                                                          <div className="flex items-center gap-2"><span className="bg-gray-800 text-white px-3 py-1 rounded text-xs font-bold shadow-sm">{card.year} Rate Card</span><span className="text-[10px] text-gray-600 uppercase tracking-wide">USD per Night</span></div>
                                                          <button onClick={() => removeYearFromRoom(rIndex, card.year)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600 p-1" title="Remove Year"><Trash2 size={14}/></button>
                                                      </div>
                                                      <div className="grid grid-cols-6 lg:grid-cols-12 gap-2">
                                                          {Object.keys(DEFAULT_RATES).map((month) => (
                                                              <div key={month} className="flex flex-col">
                                                                  <span className="text-[10px] font-bold text-gray-700 uppercase mb-1 pl-1">{month}</span>
                                                                  <div className="relative">
                                                                      <span className="absolute left-2 top-1.5 text-gray-700 text-xs">$</span>
                                                                      <input 
                                                                        // @ts-ignore
                                                                        value={card.rates[month]} type="number" onChange={(e) => updateRate(rIndex, yIndex, month, parseFloat(e.target.value))} className="w-full pl-4 pr-1 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 outline-none font-bold text-gray-700 shadow-sm"
                                                                      />
                                                                  </div>
                                                              </div>
                                                          ))}
                                                      </div>
                                                  </div>
                                              ))}
                                              <button onClick={() => addYearToRoom(rIndex)} className="mt-4 text-xs font-bold text-purple-600 flex items-center gap-1 hover:bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors"><PlusCircle size={14} /> Add Next Year</button>
                                          </div>
                                      </div>
                                  ))}
                                  <button onClick={addRoomCategory} className="w-full py-3 border-2 border-dashed border-purple-300 bg-purple-50 text-purple-700 font-bold rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"><PlusCircle size={20}/> Add Another Room Category</button>
                              </div>
                          )}
                      </div>
                  )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
                  <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                  <button onClick={handleSave} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition-transform active:scale-95"><Save size={18}/> Save Property</button>
              </div>
           </div>
        </div>
      )}
   </div>
  );
}
