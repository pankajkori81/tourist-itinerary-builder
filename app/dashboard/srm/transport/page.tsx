

// "use client";

// import React, { useState, useMemo, useEffect } from 'react';
// import { 
//   Plus, MapPin, Car, Trash2, X, Save, 
//   ChevronDown, ChevronRight, Users, Briefcase, 
//   Edit, DollarSign, Plane, Train, Ship,
//   Navigation,
//   Globe
// } from 'lucide-react';
// import { useSRM } from '@/app/context/SRMContext';
// import { TransportData, saveTransport, deleteTransport } from '@/utils/srmStorage';
// import { VEHICLE_TYPES } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';

// export default function TransportSRMPage() {
//   const { transports, refreshAll, searchText } = useSRM();
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   // Nested Accordion State
//   const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
//   const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

//   // --- FORM STATE ---
//   // serviceType is hardcoded to 'Transfer'
//   const initialForm: TransportData & { 
//     description?: string; 
//     defaultPickup?: string; 
//     defaultDropoff?: string; 
//     defaultDuration?: string; 
//   } = {
//     id: '',
//     vehicleType: 'Sedan Car',
//     serviceType: 'Transfer', // Fixed to Transfer
//     city: '',
//     country: '',
//     maxGuests: 3,
//     luggageCapacity: '2 Bags',
//     basePrice: 0,
//     status: 'Active',
//     description: '',       
//     defaultPickup: '',     
//     defaultDropoff: '',    
//     defaultDuration: '',   
//     createdAt: '',
//     updatedAt: ''
//   };
  
//   const [formData, setFormData] = useState(initialForm);

//   // --- 1. NESTED GROUPING LOGIC (Country -> City -> Transports) ---
//   const groupedData = useMemo(() => {
//     const filtered = transports.filter(t => 
//       (t.vehicleType || "").toLowerCase().includes(searchText.toLowerCase()) || 
//       (t.city || "").toLowerCase().includes(searchText.toLowerCase()) ||
//       (t.country || "").toLowerCase().includes(searchText.toLowerCase())
//     );

//     const groups: Record<string, Record<string, TransportData[]>> = {};

//     filtered.forEach(item => {
//       const country = (item.country || "Uncategorized").trim();
//       const city = (item.city || "General").trim();

//       if (!groups[country]) groups[country] = {};
//       if (!groups[country][city]) groups[country][city] = [];
      
//       groups[country][city].push(item);
//     });

//     return Object.keys(groups).sort().reduce((acc, country) => {
//         acc[country] = groups[country];
//         return acc;
//     }, {} as Record<string, Record<string, TransportData[]>>);
//   }, [transports, searchText]);

//   // Auto-expand on search
//   useEffect(() => {
//     if (searchText) {
//        const allCountries = Object.keys(groupedData);
//        const newExpCountries = allCountries.reduce((acc, key) => ({...acc, [key]: true}), {});
//        setExpandedCountries(newExpCountries);
       
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
//   const handleEdit = (item: TransportData) => { 
//     setFormData(JSON.parse(JSON.stringify(item))); 
//     setIsModalOpen(true); 
//   };

//   const handleDelete = (id: string) => { 
//     if (confirm('Delete this transport service?')) { 
//       deleteTransport(id); 
//       refreshAll(); 
//     } 
//   };

//   const handleSave = () => {
//     if (!formData.vehicleType || !formData.city) return alert("Vehicle Type and City are required");
    
//     const cleanData = {
//         ...formData,
//         serviceType: 'Transfer', // Ensure it is always Transfer
//         city: formData.city.trim(),
//         country: formData.country.trim()
//     };
//     saveTransport(cleanData as any);
//     refreshAll();
//     setIsModalOpen(false);
//   };

//   const getIcon = (name: string) => {
//     const lower = name.toLowerCase();
//     if (lower.includes('flight') || lower.includes('air')) return <Plane size={20} />;
//     if (lower.includes('train') || lower.includes('rail')) return <Train size={20} />;
//     if (lower.includes('ferry') || lower.includes('boat')) return <Ship size={20} />;
//     return <Car size={20} />;
//   };

//   return (
//    <div className="h-full w-full flex flex-col relative overflow-hidden">
      
//       {/* BACKGROUND */}
//       <div className="absolute inset-0 z-0" style={{ 
//           backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=60")', 
//           backgroundSize: 'cover', 
//           backgroundPosition: 'center' 
//       }} />
//       <div className="absolute inset-0 z-0 bg-black/50 backdrop-blur-sm" />

//       {/* CONTENT */}
//       <div className="flex-1 flex flex-col relative z-10 h-full">
        
//         {/* HEADER */}
//         <div className="bg-white/95 border-b border-white/50 px-6 py-4 flex justify-between items-center backdrop-blur-md shadow-sm z-10">
//             <div>
//                 <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                 <Car className="text-blue-700"/> Transport Fleet & Services
//                 </h1>
//                 <p className="text-xs text-gray-600 font-medium">Manage vehicle inventory, transfer costs, and service details.</p>
//             </div>
//             <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
//             <Plus size={18} /> Add Transport
//             </button>
//         </div>

//         {/* CONTENT: Nested Grouped List */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
//             {Object.keys(groupedData).length === 0 ? (
//                  <div className="flex flex-col items-center justify-center h-64 text-gray-600 bg-white/40 rounded-xl border border-white/50 backdrop-blur-sm">
//                     <Car size={48} className="opacity-50 mb-2"/>
//                     <p className="font-bold">No transport services found.</p>
//                     <p className="text-sm">Click "Add Transport" to start.</p>
//                  </div>
//              ) : (
//                 Object.entries(groupedData).map(([country, cities]) => (
//                     <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        
//                         {/* 1. COUNTRY HEADER */}
//                         <div 
//                             onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))}
//                             className="flex items-center bg-white/95 p-4 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white transition-all select-none border border-white/50 backdrop-blur-sm mb-2"
//                         >
//                             <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:text-blue-800 transition-colors">
//                                 {expandedCountries[country] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
//                             </div>
//                             <div className="flex-1">
//                                 <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
//                                    <Globe size={18} className="text-blue-800 " />
//                                     {country}
//                                 </h3>
//                             </div>
//                             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
//                                 {Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Transport
//                             </span>
//                         </div>
                        
//                         {/* 2. CITIES LIST */}
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
//                                                <MapPin size={18} className="text-red-800" />
//                                                 <span className="font-bold text-gray-900">{city}</span>
//                                                 <span className="text-xs text-gray-900 bg-blue-200 px-2 py-0.5 rounded-full">
//                                                     {items.length}
//                                                 </span>
//                                             </div>

//                                             {/* 3. TRANSPORTS GRID */}
//                                             {expandedCities[cityKey] && (
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-6 mb-4">
//                                                     {items.map(item => (
//                                                         <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col overflow-hidden relative">
                                                            
//                                                             {/* Top Stripe (Service Type) - Always Green for Transfer */}
//                                                             <div className="h-2 w-full bg-green-500" />
                                            
//                                                             <div className="p-5 flex-1 flex flex-col">
                                                                
//                                                                 {/* Header */}
//                                                                 <div className="flex justify-between items-start mb-4">
//                                                                     <div className="flex items-center gap-3">
//                                                                         <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
//                                                                             {getIcon(item.vehicleType)}
//                                                                         </div>
//                                                                         <div>
//                                                                             <h4 className="font-bold text-gray-900 text-lg leading-tight">
//                                                                                 {item.vehicleType}
//                                                                             </h4>
//                                                                             <div className="flex items-center gap-2 mt-1">
//                                                                                     <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-green-100 text-green-700">
//                                                                                     Transfer
//                                                                                     </span>
//                                                                                     <span className="text-[10px] text-gray-700">|</span>
//                                                                                     <span className="text-xs text-gray-700">{item.city}</span>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="text-right">
//                                                                         <div className="text-xl font-bold text-green-800">${item.basePrice}</div>
//                                                                         <div className="text-[10px] text-gray-700 uppercase">Base Rate</div>
//                                                                     </div>
//                                                                 </div>
                                            
//                                                                 {/* Specs Grid (Pax & Luggage) */}
//                                                                 <div className="grid grid-cols-2 gap-2 mb-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
//                                                                     <div className="flex items-center gap-2">
//                                                                         <Users size={14} className="text-gray-700"/>
//                                                                         <div className="flex flex-col">
//                                                                             <span className="text-[10px] font-bold text-gray-700 uppercase">Capacity </span>
//                                                                             <span className="text-xs font-bold text-gray-700">{item.maxGuests} Pax</span>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="flex items-center gap-2">
//                                                                         <Briefcase size={14} className="text-gray-700"/>
//                                                                         <div className="flex flex-col">
//                                                                             <span className="text-[10px] font-bold text-gray-700 uppercase">Luggage </span>
//                                                                             <span className="text-xs font-bold text-gray-700">{item.luggageCapacity}</span>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
                                            
//                                                                 {/* Logistics Info (Modified for Transfer Only) */}
//                                                                 <div className="mb-1 p-3 rounded-lg border border-gray-100">
//                                                                     <div className="space-y-2 flex justify-between">
//                                                                         <div className="flex gap-2">
//                                                                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
//                                                                             <div className="flex flex-col">
//                                                                                 <span className="text-[10px] font-bold text-blue-800 uppercase">Pickup</span>
//                                                                                 <span className="text-xs font-bold text-gray-700 leading-tight">
//                                                                                     {item.defaultPickup || <span className="text-gray-400 italic">Not set</span>}
//                                                                                 </span>
//                                                                             </div>
//                                                                         </div>
//                                                                         <div className="flex gap-2">
//                                                                             <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
//                                                                             <div className="flex flex-col">
//                                                                                 <span className="text-[10px] font-bold text-blue-800 uppercase">Drop</span>
//                                                                                 <span className="text-xs font-bold text-gray-700 leading-tight">
//                                                                                     {item.defaultDropoff || <span className="text-gray-400 italic">Not set</span>}
//                                                                                 </span>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
                                            
//                                                                 {/* Footer Actions */}
//                                                                 <div className="mt-auto border-t border-gray-100 flex items-center gap-3">
//                                                                     <button 
//                                                                         onClick={() => handleEdit(item)} 
//                                                                         className="flex-1 py-2 bg-blue-500 text-white hover:bg-blue-500 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
//                                                                     >
//                                                                         <Edit size={14} /> Edit Details
//                                                                     </button>

//                                                                        <button 
//                                                                       onClick={() => handleDelete(item.id)} 
//                                                                         className="flex-1 py-2 bg-red-500 text-white hover:bg-red-500 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
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
//            {/* WIDTH: max-w-6xl */}
//            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
              
//               {/* Modal Header */}
//               <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//                  <div>
//                     <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Transport' : 'Add New Transport'}</h2>
//                     <p className="text-xs text-gray-500">Configure vehicle details, pricing, and logistics</p>
//                  </div>
//                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><X size={20}/></button>
//               </div>

//               {/* Modal Body */}
//               <div className="flex-1 overflow-y-auto p-8 bg-white">
                  
//                   <div className="grid grid-cols-13 gap-8">
                    
//                     {/* LEFT COLUMN: Core Info */}
//                     <div className="col-span-12 lg:col-span-7 space-y-6">
                        
//                         {/* 1. Vehicle Selection (Service Type Fixed Label Added) */}
//                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
//                              <h3 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
//                                 <Car size={14}/> Core Configuration
//                              </h3>
//                              <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="text-xs font-bold text-gray-700 mb-1 block">Service Type</label>
//                                     <div className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm font-bold">
//                                         Transfer
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label className="text-xs font-bold text-gray-700 mb-1 block">Vehicle Type</label>
//                                     <select 
//                                       value={formData.vehicleType} 
//                                       onChange={e => setFormData({...formData, vehicleType: e.target.value})} 
//                                       className="w-full p-2 border border-gray-400 rounded-lg bg-white outline-none focus:border-blue-500"
//                                     >
//                                        {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
//                                     </select>
//                                 </div>
//                              </div>
//                         </div>

//                         {/* 2. Location */}
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="text-xs font-bold text-gray-700 mb-1 block">City *</label>
//                                 <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500" placeholder="e.g. Rome"/>
//                             </div>
//                             <div>
//                                 <label className="text-xs font-bold text-gray-700 mb-1 block">Country *</label>
//                                 <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500" placeholder="e.g. Italy"/>
//                             </div>
//                         </div>

//                         {/* 3. Specs & Price */}
//                         <div className="grid grid-cols-3 gap-4">
//                             <div>
//                                 <label className="text-xs font-bold text-gray-700 mb-1 block">Max Guests</label>
//                                 <div className="relative">
//                                     <Users size={15} className="absolute left-3 top-3 text-gray-500"/>
//                                     <input type="number" value={formData.maxGuests} onChange={e => setFormData({...formData, maxGuests: parseInt(e.target.value)})} className="w-full pl-9 p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"/>
//                                 </div>
//                             </div>
//                             <div>
//                                 <label className="text-xs font-bold text-gray-700 mb-1 block">Luggage Cap</label>
//                                 <div className="relative">
//                                     <Briefcase size={15} className="absolute left-3 top-3 text-gray-500"/>
//                                     <input type="text" value={formData.luggageCapacity} onChange={e => setFormData({...formData, luggageCapacity: e.target.value})} className="w-full pl-9 p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"/>
//                                 </div>
//                             </div>
//                             <div>
//                                 <label className="text-xs font-bold text-gray-700 mb-1 block">Base Price</label>
//                                 <div className="relative">
//                                     <DollarSign size={15} className="absolute left-3 top-3 text-gray-500"/>
//                                     <input type="number" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value)})} className="w-full pl-8 p-2 border border-gray-400 rounded-lg font-bold text-green-700 outline-none focus:border-green-500"/>
//                                 </div>
//                             </div>
//                         </div>

//                     </div>

//                     {/* RIGHT COLUMN: Logistics only (Description removed) */}
//                     <div className="col-span-13 lg:col-span-6 space-y-6">
                        
//                         {/* 4. Logistics (Modified Labels, No Disposal logic) */}
//                         <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 h-full">
//                              <h3 className="text-xs font-bold text-blue-800 uppercase mb-3 flex items-center gap-2">
//                                 <Navigation size={14}/> Logistics
//                              </h3>
                             
//                              <div className="space-y-4">
//                                 <div>
//                                     <label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Pickup Location</label>
//                                     <input 
//                                         type="text" 
//                                         value={formData.defaultPickup || " "} 
//                                         onChange={e => setFormData({...formData, defaultPickup: e.target.value})} 
//                                         className="w-full p-2 border border-blue-200 rounded-lg text-sm" 
//                                         placeholder="e.g. FCO Airport / Hotel"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Dropoff Location</label>
//                                     <input 
//                                         type="text" 
//                                         value={formData.defaultDropoff || " "} 
//                                         onChange={e => setFormData({...formData, defaultDropoff: e.target.value})} 
//                                         className="w-full p-2 border border-blue-200 rounded-lg text-sm" 
//                                         placeholder="e.g. City Center Hotel"
//                                     />
//                                 </div>
//                              </div>
//                         </div>

//                     </div>
//                   </div>

//               </div>

//               {/* Modal Footer */}
//               <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
//                   <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
//                   <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition-transform active:scale-95">
//                       <Save size={18}/> Save Transport
//                   </button>
//               </div>
//            </div>
//         </div>
//       )}
//    </div>
//   );
// }





















































// "use client";

// import React, { useState, useMemo, useEffect } from 'react';
// import { 
//   Plus, MapPin, Car, Trash2, X, Save, 
//   ChevronDown, ChevronRight, Users, Briefcase, 
//   Edit, DollarSign, Plane, Train, Ship,
//   Navigation, Globe, Phone, Mail, CreditCard // Added Icons
// } from 'lucide-react';
// import { useSRM } from '@/app/context/SRMContext';
// import { TransportData, saveTransport, deleteTransport } from '@/utils/srmStorage';
// import { VEHICLE_TYPES } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';

// export default function TransportSRMPage() {
//   // [CHANGE 1: Added 'suppliers' to context]
//   const { transports, suppliers, refreshAll, searchText } = useSRM();
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
//   const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

//   // --- FORM STATE ---
//   const initialForm: TransportData & { 
//     description?: string; 
//     defaultPickup?: string; 
//     defaultDropoff?: string; 
//     defaultDuration?: string;
//     linkedSupplierId?: string; // [CHANGE 2: Added linkedSupplierId]
//   } = {
//     id: '',
//     vehicleType: 'Sedan Car',
//     serviceType: 'Transfer',
//     city: '',
//     country: '',
//     maxGuests: 3,
//     luggageCapacity: '2 Bags',
//     basePrice: 0,
//     status: 'Active',
//     description: '',       
//     defaultPickup: '',     
//     defaultDropoff: '',    
//     defaultDuration: '',
//     linkedSupplierId: '', // [CHANGE 2]
//     createdAt: '',
//     updatedAt: ''
//   };
  
//   const [formData, setFormData] = useState(initialForm);

//   // --- [NEW LOGIC START]: SMART SUPPLIER FILTERING ---
//   // 1. Filter Suppliers: Must be Active + Provide "Transport" + Match City (if typed)
//   const availableSuppliers = useMemo(() => {
//     return suppliers.filter(s => {
//       const basicCheck = s.status === 'Active' && s.services.includes('Transport');
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
//            s.services.includes('Transport') &&
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

//   // ... (Grouping Logic remains exactly the same) ...
//   const groupedData = useMemo(() => {
//     const filtered = transports.filter(t => 
//       (t.vehicleType || "").toLowerCase().includes(searchText.toLowerCase()) || 
//       (t.city || "").toLowerCase().includes(searchText.toLowerCase()) ||
//       (t.country || "").toLowerCase().includes(searchText.toLowerCase())
//     );

//     const groups: Record<string, Record<string, TransportData[]>> = {};

//     filtered.forEach(item => {
//       const country = (item.country || "Uncategorized").trim();
//       const city = (item.city || "General").trim();

//       if (!groups[country]) groups[country] = {};
//       if (!groups[country][city]) groups[country][city] = [];
      
//       groups[country][city].push(item);
//     });

//     return Object.keys(groups).sort().reduce((acc, country) => {
//         acc[country] = groups[country];
//         return acc;
//     }, {} as Record<string, Record<string, TransportData[]>>);
//   }, [transports, searchText]);

//   useEffect(() => {
//     if (searchText) {
//        const allCountries = Object.keys(groupedData);
//        const newExpCountries = allCountries.reduce((acc, key) => ({...acc, [key]: true}), {});
//        setExpandedCountries(newExpCountries);
       
//        const newExpCities: Record<string, boolean> = {};
//        allCountries.forEach(c => {
//            Object.keys(groupedData[c]).forEach(city => {
//                newExpCities[`${c}-${city}`] = true;
//            });
//        });
//        setExpandedCities(newExpCities);
//     }
//   }, [searchText, groupedData]);

//   const handleEdit = (item: TransportData) => { 
//     setFormData(JSON.parse(JSON.stringify(item))); 
//     setIsModalOpen(true); 
//   };

//   const handleDelete = (id: string) => { 
//     if (confirm('Delete this transport service?')) { 
//       deleteTransport(id); 
//       refreshAll(); 
//     } 
//   };

//   const handleSave = () => {
//     if (!formData.vehicleType || !formData.city) return alert("Vehicle Type and City are required");
    
//     const cleanData = {
//         ...formData,
//         serviceType: 'Transfer',
//         city: formData.city.trim(),
//         country: formData.country.trim()
//     };
//     saveTransport(cleanData as any);
//     refreshAll();
//     setIsModalOpen(false);
//   };

//   const getIcon = (name: string) => {
//     const lower = name.toLowerCase();
//     if (lower.includes('flight') || lower.includes('air')) return <Plane size={20} />;
//     if (lower.includes('train') || lower.includes('rail')) return <Train size={20} />;
//     if (lower.includes('ferry') || lower.includes('boat')) return <Ship size={20} />;
//     return <Car size={20} />;
//   };

//   return (
//    <div className="h-full w-full flex flex-col relative overflow-hidden">
//       <div className="absolute inset-0 z-0" style={{ 
//           backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=60")', 
//           backgroundSize: 'cover', 
//           backgroundPosition: 'center' 
//       }} />
//       <div className="absolute inset-0 z-0 bg-black/50 backdrop-blur-sm" />

//       <div className="flex-1 flex flex-col relative z-10 h-full">
//         <div className="bg-white/95 border-b border-white/50 px-6 py-4 flex justify-between items-center backdrop-blur-md shadow-sm z-10">
//             <div>
//                 <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                 <Car className="text-blue-700"/> Transport Fleet & Services
//                 </h1>
//                 <p className="text-xs text-gray-600 font-medium">Manage vehicle inventory, transfer costs, and service details.</p>
//             </div>
//             <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
//             <Plus size={18} /> Add Transport
//             </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
//             {Object.keys(groupedData).length === 0 ? (
//                  <div className="flex flex-col items-center justify-center h-64 text-gray-600 bg-white/40 rounded-xl border border-white/50 backdrop-blur-sm">
//                     <Car size={48} className="opacity-50 mb-2"/>
//                     <p className="font-bold">No transport services found.</p>
//                     <p className="text-sm">Click "Add Transport" to start.</p>
//                  </div>
//              ) : (
//                 Object.entries(groupedData).map(([country, cities]) => (
//                     <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
//                         <div 
//                             onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))}
//                             className="flex items-center bg-white/95 p-4 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white transition-all select-none border border-white/50 backdrop-blur-sm mb-2"
//                         >
//                             <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:text-blue-800 transition-colors">
//                                 {expandedCountries[country] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
//                             </div>
//                             <div className="flex-1">
//                                 <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
//                                    <Globe size={18} className="text-blue-800 " />
//                                     {country}
//                                 </h3>
//                             </div>
//                             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
//                                 {Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Transport
//                             </span>
//                         </div>
                        
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
//                                                <MapPin size={18} className="text-red-800" />
//                                                 <span className="font-bold text-gray-900">{city}</span>
//                                                 <span className="text-xs text-gray-900 bg-blue-200 px-2 py-0.5 rounded-full">
//                                                     {items.length}
//                                                 </span>
//                                             </div>

//                                             {expandedCities[cityKey] && (
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-6 mb-4">
//                                                     {items.map(item => {
//                                                         // [CHANGE 3: Find linked supplier]
//                                                         const sup = suppliers.find(s => s.id === (item as any).linkedSupplierId);

//                                                         return (
//                                                             <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col overflow-hidden relative">
//                                                                 <div className="h-2 w-full bg-green-500" />
//                                                                 <div className="p-5 flex-1 flex flex-col">
//                                                                     <div className="flex justify-between items-start mb-4">
//                                                                         <div className="flex items-center gap-3">
//                                                                             <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
//                                                                                 {getIcon(item.vehicleType)}
//                                                                             </div>
//                                                                             <div>
//                                                                                 <h4 className="font-bold text-gray-900 text-lg leading-tight">
//                                                                                     {item.vehicleType}
//                                                                                 </h4>
//                                                                                 <div className="flex items-center gap-2 mt-1">
//                                                                                         <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-green-100 text-green-700">
//                                                                                         Transfer
//                                                                                         </span>
//                                                                                         <span className="text-[10px] text-gray-700">|</span>
//                                                                                         <span className="text-xs text-gray-700">{item.city}</span>
//                                                                                 </div>
//                                                                                 {/* [CHANGE 4: Added Supplier Badge] */}
//                                                                                 {sup && (
//                                                                                     <div className="mt-2 inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-1 rounded text-[10px] border border-blue-100">
//                                                                                         <Briefcase size={10} /> 
//                                                                                         <span className="font-bold truncate max-w-[150px]">By: {sup.name}</span>
//                                                                                     </div>
//                                                                                 )}
//                                                                             </div>
//                                                                         </div>
//                                                                         <div className="text-right">
//                                                                             <div className="text-xl font-bold text-green-800">${item.basePrice}</div>
//                                                                             <div className="text-[10px] text-gray-700 uppercase">Base Rate</div>
//                                                                         </div>
//                                                                     </div>
                                                
//                                                                     <div className="grid grid-cols-2 gap-2 mb-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
//                                                                         <div className="flex items-center gap-2">
//                                                                             <Users size={14} className="text-gray-700"/>
//                                                                             <div className="flex flex-col">
//                                                                                 <span className="text-[10px] font-bold text-gray-700 uppercase">Capacity </span>
//                                                                                 <span className="text-xs font-bold text-gray-700">{item.maxGuests} Pax</span>
//                                                                             </div>
//                                                                         </div>
//                                                                         <div className="flex items-center gap-2">
//                                                                             <Briefcase size={14} className="text-gray-700"/>
//                                                                             <div className="flex flex-col">
//                                                                                 <span className="text-[10px] font-bold text-gray-700 uppercase">Luggage </span>
//                                                                                 <span className="text-xs font-bold text-gray-700">{item.luggageCapacity}</span>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
                                                
//                                                                     <div className="mb-1 p-3 rounded-lg border border-gray-100">
//                                                                         <div className="space-y-2 flex justify-between">
//                                                                             <div className="flex gap-2">
//                                                                                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
//                                                                                 <div className="flex flex-col">
//                                                                                     <span className="text-[10px] font-bold text-blue-800 uppercase">Pickup</span>
//                                                                                     <span className="text-xs font-bold text-gray-700 leading-tight">
//                                                                                         {item.defaultPickup || <span className="text-gray-400 italic">Not set</span>}
//                                                                                     </span>
//                                                                                 </div>
//                                                                             </div>
//                                                                             <div className="flex gap-2">
//                                                                                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
//                                                                                 <div className="flex flex-col">
//                                                                                     <span className="text-[10px] font-bold text-blue-800 uppercase">Drop</span>
//                                                                                     <span className="text-xs font-bold text-gray-700 leading-tight">
//                                                                                         {item.defaultDropoff || <span className="text-gray-400 italic">Not set</span>}
//                                                                                     </span>
//                                                                                 </div>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
                                                
//                                                                     <div className="mt-auto border-t border-gray-100 flex items-center gap-3">
//                                                                         <button onClick={() => handleEdit(item)} className="flex-1 py-2 bg-blue-500 text-white hover:bg-blue-500 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
//                                                                             <Edit size={14} /> Edit Details
//                                                                         </button>
//                                                                         <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 bg-red-500 text-white hover:bg-red-500 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
//                                                                             <Trash2 size={14} /> Delete
//                                                                         </button>
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

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
//            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
//               <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//                  <div>
//                     <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Transport' : 'Add New Transport'}</h2>
//                     <p className="text-xs text-gray-500">Configure vehicle details, pricing, and logistics</p>
//                  </div>
//                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><X size={20}/></button>
//               </div>

//               <div className="flex-1 overflow-y-auto p-8 bg-white">
//                   <div className="grid grid-cols-13 gap-8">
                    
//                     {/* LEFT COLUMN: Core Info */}
//                     <div className="col-span-12 lg:col-span-7 space-y-6">
                        
//                         {/* [CHANGE 5: SUPPLIER LINKAGE SECTION (Top of Left Col)] */}
//                         <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-4 items-start">
//                             <div className="flex-1">
//                                 <label className="block text-xs font-bold text-blue-900 mb-2 flex items-center gap-1">
//                                     <Briefcase size={14} /> Fulfillment Partner (Transport)
//                                 </label>
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
//                                     {formData.linkedSupplierId && !availableSuppliers.find(s => s.id === formData.linkedSupplierId) && selectedSupplierData && (
//                                          <option value={selectedSupplierData.id}>{selectedSupplierData.name} (Current) - *City Mismatch*</option>
//                                     )}
//                                 </select>
//                                 {availableSuppliers.length === 0 && formData.city && (
//                                     <p className="text-[10px] text-red-500 mt-1">No 'Transport' suppliers found in {formData.city}.</p>
//                                 )}
//                             </div>
                            
//                             {/* [CHANGE 6: ENHANCED INTELLIGENCE BOX] */}
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

//                         {/* 1. Vehicle Selection */}
//                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
//                              <h3 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
//                                 <Car size={14}/> Core Configuration
//                              </h3>
//                              <div className="grid grid-cols-2 gap-4">
//                                 <div><label className="text-xs font-bold text-gray-700 mb-1 block">Service Type</label><div className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm font-bold">Transfer</div></div>
//                                 <div>
//                                     <label className="text-xs font-bold text-gray-700 mb-1 block">Vehicle Type</label>
//                                     <select value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg bg-white outline-none focus:border-blue-500">
//                                        {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
//                                     </select>
//                                 </div>
//                              </div>
//                         </div>

//                         {/* 2. Location */}
//                         <div className="grid grid-cols-2 gap-4">
//                             <div><label className="text-xs font-bold text-gray-700 mb-1 block">City *</label><input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500" placeholder="e.g. Rome"/></div>
//                             <div><label className="text-xs font-bold text-gray-700 mb-1 block">Country *</label><input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500" placeholder="e.g. Italy"/></div>
//                         </div>

//                         {/* 3. Specs & Price */}
//                         <div className="grid grid-cols-3 gap-4">
//                             <div>
//                                 <label className="text-xs font-bold text-gray-700 mb-1 block">Max Guests</label>
//                                 <div className="relative"><Users size={15} className="absolute left-3 top-3 text-gray-500"/><input type="number" value={formData.maxGuests} onChange={e => setFormData({...formData, maxGuests: parseInt(e.target.value)})} className="w-full pl-9 p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"/></div>
//                             </div>
//                             <div>
//                                 <label className="text-xs font-bold text-gray-700 mb-1 block">Luggage Cap</label>
//                                 <div className="relative"><Briefcase size={15} className="absolute left-3 top-3 text-gray-500"/><input type="text" value={formData.luggageCapacity} onChange={e => setFormData({...formData, luggageCapacity: e.target.value})} className="w-full pl-9 p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"/></div>
//                             </div>
//                             <div>
//                                 <label className="text-xs font-bold text-gray-700 mb-1 block">Base Price</label>
//                                 <div className="relative"><DollarSign size={15} className="absolute left-3 top-3 text-gray-500"/><input type="number" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value)})} className="w-full pl-8 p-2 border border-gray-400 rounded-lg font-bold text-green-700 outline-none focus:border-green-500"/></div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* RIGHT COLUMN */}
//                     <div className="col-span-13 lg:col-span-6 space-y-6">
//                         <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 h-full">
//                              <h3 className="text-xs font-bold text-blue-800 uppercase mb-3 flex items-center gap-2"><Navigation size={14}/> Logistics</h3>
//                              <div className="space-y-4">
//                                 <div><label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Pickup Location</label><input type="text" value={formData.defaultPickup || " "} onChange={e => setFormData({...formData, defaultPickup: e.target.value})} className="w-full p-2 border border-blue-200 rounded-lg text-sm" placeholder="e.g. FCO Airport / Hotel"/></div>
//                                 <div><label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Dropoff Location</label><input type="text" value={formData.defaultDropoff || " "} onChange={e => setFormData({...formData, defaultDropoff: e.target.value})} className="w-full p-2 border border-blue-200 rounded-lg text-sm" placeholder="e.g. City Center Hotel"/></div>
//                              </div>
//                         </div>
//                     </div>
//                   </div>
//               </div>

//               <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
//                   <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
//                   <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition-transform active:scale-95"><Save size={18}/> Save Transport</button>
//               </div>
//            </div>
//         </div>
//       )}
//    </div>
//   );
// } 


























// "use client";

// import React, { useState, useMemo, useEffect } from 'react';
// import { 
//   Plus, MapPin, Car, Trash2, X, Save, 
//   ChevronDown, ChevronRight, Users, Briefcase, 
//   Edit, Plane, Train, Ship,
//   Navigation, Globe, Phone, Mail, CreditCard, DollarSign // Added Icons
// } from 'lucide-react';
// import { useSRM } from '@/app/context/SRMContext';
// import { TransportData, saveTransport, deleteTransport } from '@/utils/srmStorage';
// import { VEHICLE_TYPES } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';

// export default function TransportSRMPage() {
//   // [CHANGE 1: Added 'suppliers' to context]
//   const { transports, suppliers, refreshAll, searchText } = useSRM();
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
//   const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

//   // --- FORM STATE ---
//   const initialForm: TransportData & { 
//     description?: string; 
//     defaultPickup?: string; 
//     defaultDropoff?: string; 
//     defaultDuration?: string;
//     linkedSupplierId?: string; // [CHANGE 2: Added linkedSupplierId]
//   } = {
//     id: '',
//     vehicleType: 'Sedan Car',
//     serviceType: 'Transfer',
//     city: '',
//     country: '',
//     maxGuests: 3,
//     luggageCapacity: '2 Bags',
//     basePrice: 0,
//     status: 'Active',
//     description: '',       
//     defaultPickup: '',     
//     defaultDropoff: '',    
//     defaultDuration: '',
//     linkedSupplierId: '', // [CHANGE 2]
//     createdAt: '',
//     updatedAt: ''
//   };
  
//   const [formData, setFormData] = useState(initialForm);

//   // --- [NEW LOGIC START]: SMART SUPPLIER FILTERING ---
//   // 1. Filter Suppliers: Must be Active + Provide "Transport" + Match City (if typed)
//   const availableSuppliers = useMemo(() => {
//     return suppliers.filter(s => {
//       const basicCheck = s.status === 'Active' && s.services.includes('Transport');
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
//            s.services.includes('Transport') &&
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

//   // ... (Grouping Logic remains exactly the same) ...
//   const groupedData = useMemo(() => {
//     const filtered = transports.filter(t => 
//       (t.vehicleType || "").toLowerCase().includes(searchText.toLowerCase()) || 
//       (t.city || "").toLowerCase().includes(searchText.toLowerCase()) ||
//       (t.country || "").toLowerCase().includes(searchText.toLowerCase())
//     );

//     const groups: Record<string, Record<string, TransportData[]>> = {};

//     filtered.forEach(item => {
//       const country = (item.country || "Uncategorized").trim();
//       const city = (item.city || "General").trim();

//       if (!groups[country]) groups[country] = {};
//       if (!groups[country][city]) groups[country][city] = [];
      
//       groups[country][city].push(item);
//     });

//     return Object.keys(groups).sort().reduce((acc, country) => {
//         acc[country] = groups[country];
//         return acc;
//     }, {} as Record<string, Record<string, TransportData[]>>);
//   }, [transports, searchText]);

//   useEffect(() => {
//     if (searchText) {
//        const allCountries = Object.keys(groupedData);
//        const newExpCountries = allCountries.reduce((acc, key) => ({...acc, [key]: true}), {});
//        setExpandedCountries(newExpCountries);
       
//        const newExpCities: Record<string, boolean> = {};
//        allCountries.forEach(c => {
//            Object.keys(groupedData[c]).forEach(city => {
//                newExpCities[`${c}-${city}`] = true;
//            });
//        });
//        setExpandedCities(newExpCities);
//     }
//   }, [searchText, groupedData]);

//   const handleEdit = (item: TransportData) => { 
//     setFormData(JSON.parse(JSON.stringify(item))); 
//     setIsModalOpen(true); 
//   };

//   const handleDelete = (id: string) => { 
//     if (confirm('Delete this transport service?')) { 
//       deleteTransport(id); 
//       refreshAll(); 
//     } 
//   };

//   const handleSave = () => {
//     if (!formData.vehicleType || !formData.city) return alert("Vehicle Type and City are required");
    
//     const cleanData = {
//         ...formData,
//         serviceType: 'Transfer',
//         city: formData.city.trim(),
//         country: formData.country.trim()
//     };
//     saveTransport(cleanData as any);
//     refreshAll();
//     setIsModalOpen(false);
//   };

//   const getIcon = (name: string) => {
//     const lower = name.toLowerCase();
//     if (lower.includes('flight') || lower.includes('air')) return <Plane size={20} />;
//     if (lower.includes('train') || lower.includes('rail')) return <Train size={20} />;
//     if (lower.includes('ferry') || lower.includes('boat')) return <Ship size={20} />;
//     return <Car size={20} />;
//   };

//   return (
//    <div className="h-full w-full flex flex-col relative overflow-hidden">
//       <div className="absolute inset-0 z-0" style={{ 
//           backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=60")', 
//           backgroundSize: 'cover', 
//           backgroundPosition: 'center' 
//       }} />
//       <div className="absolute inset-0 z-0 bg-black/50 backdrop-blur-sm" />

//       <div className="flex-1 flex flex-col relative z-10 h-full">
//         <div className="bg-white/95 border-b border-white/50 px-6 py-4 flex justify-between items-center backdrop-blur-md shadow-sm z-10">
//             <div>
//                 <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                 <Car className="text-blue-700"/> Transport Fleet & Services
//                 </h1>
//                 <p className="text-xs text-gray-600 font-medium">Manage vehicle inventory, transfer costs, and service details.</p>
//             </div>
//             <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
//             <Plus size={18} /> Add Transport
//             </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
//             {Object.keys(groupedData).length === 0 ? (
//                  <div className="flex flex-col items-center justify-center h-64 text-gray-600 bg-white/40 rounded-xl border border-white/50 backdrop-blur-sm">
//                     <Car size={48} className="opacity-50 mb-2"/>
//                     <p className="font-bold">No transport services found.</p>
//                     <p className="text-sm">Click "Add Transport" to start.</p>
//                  </div>
//              ) : (
//                 Object.entries(groupedData).map(([country, cities]) => (
//                     <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
//                         <div 
//                             onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))}
//                             className="flex items-center bg-white/95 p-4 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white transition-all select-none border border-white/50 backdrop-blur-sm mb-2"
//                         >
//                             <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:text-blue-800 transition-colors">
//                                 {expandedCountries[country] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
//                             </div>
//                             <div className="flex-1">
//                                 <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
//                                    <Globe size={18} className="text-blue-800 " />
//                                     {country}
//                                 </h3>
//                             </div>
//                             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
//                                 {Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Transport
//                             </span>
//                         </div>
                        
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
//                                                <MapPin size={18} className="text-red-800" />
//                                                 <span className="font-bold text-gray-900">{city}</span>
//                                                 <span className="text-xs text-gray-900 bg-blue-200 px-2 py-0.5 rounded-full">
//                                                     {items.length}
//                                                 </span>
//                                             </div>

//                                             {expandedCities[cityKey] && (
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-6 mb-4">
//                                                     {items.map(item => {
//                                                         // [CHANGE 3: Find linked supplier]
//                                                         const sup = suppliers.find(s => s.id === (item as any).linkedSupplierId);

//                                                         return (
//                                                             <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col overflow-hidden relative">
//                                                                 <div className="h-2 w-full bg-green-500" />
//                                                                 <div className="p-5 flex-1 flex flex-col">
//                                                                     <div className="flex justify-between items-start mb-4">
//                                                                         <div className="flex items-center gap-3">
//                                                                             <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
//                                                                                 {getIcon(item.vehicleType)}
//                                                                             </div>
//                                                                             <div>
//                                                                                 <h4 className="font-bold text-gray-900 text-lg leading-tight">
//                                                                                     {item.vehicleType}
//                                                                                 </h4>
//                                                                                 <div className="flex items-center gap-2 mt-1">
//                                                                                         <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-green-100 text-green-700">
//                                                                                         Transfer
//                                                                                         </span>
//                                                                                         <span className="text-[10px] text-gray-700">|</span>
//                                                                                         <span className="text-xs text-gray-700">{item.city}</span>
//                                                                                 </div>
//                                                                                 {/* [CHANGE 4: Added Supplier Badge] */}
//                                                                                 {sup && (
//                                                                                     <div className="mt-2 inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-1 rounded text-[10px] border border-blue-100">
//                                                                                         <Briefcase size={10} /> 
//                                                                                         <span className="font-bold truncate max-w-[150px]">By: {sup.name}</span>
//                                                                                     </div>
//                                                                                 )}
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
                                                
//                                                                     <div className="grid grid-cols-2 gap-2 mb-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
//                                                                         <div className="flex items-center gap-2">
//                                                                             <Users size={14} className="text-gray-700"/>
//                                                                             <div className="flex flex-col">
//                                                                                 <span className="text-[10px] font-bold text-gray-700 uppercase">Capacity </span>
//                                                                                 <span className="text-xs font-bold text-gray-700">{item.maxGuests} Pax</span>
//                                                                             </div>
//                                                                         </div>
//                                                                         <div className="flex items-center gap-2">
//                                                                             <Briefcase size={14} className="text-gray-700"/>
//                                                                             <div className="flex flex-col">
//                                                                                 <span className="text-[10px] font-bold text-gray-700 uppercase">Luggage </span>
//                                                                                 <span className="text-xs font-bold text-gray-700">{item.luggageCapacity}</span>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
                                                
//                                                                     <div className="mb-1 p-3 rounded-lg border border-gray-100">
//                                                                         <div className="space-y-2 flex justify-between">
//                                                                             <div className="flex gap-2">
//                                                                                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
//                                                                                 <div className="flex flex-col">
//                                                                                     <span className="text-[10px] font-bold text-blue-800 uppercase">Pickup</span>
//                                                                                     <span className="text-xs font-bold text-gray-700 leading-tight">
//                                                                                         {item.defaultPickup || <span className="text-gray-400 italic">Not set</span>}
//                                                                                     </span>
//                                                                                 </div>
//                                                                             </div>
//                                                                             <div className="flex gap-2">
//                                                                                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
//                                                                                 <div className="flex flex-col">
//                                                                                     <span className="text-[10px] font-bold text-blue-800 uppercase">Drop</span>
//                                                                                     <span className="text-xs font-bold text-gray-700 leading-tight">
//                                                                                         {item.defaultDropoff || <span className="text-gray-400 italic">Not set</span>}
//                                                                                     </span>
//                                                                                 </div>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
                                                
//                                                                     <div className="mt-auto border-t border-gray-100 flex items-center gap-3 mt-2 pt-2">
//                                                                         <button onClick={() => handleEdit(item)} className="flex-1 py-2 bg-blue-500 text-white hover:bg-blue-500 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
//                                                                             <Edit size={14} /> Edit Details
//                                                                         </button>
//                                                                         <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 bg-red-500 text-white hover:bg-red-500 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
//                                                                             <Trash2 size={14} /> Delete
//                                                                         </button>
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

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
//            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
//               <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//                  <div>
//                     <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Transport' : 'Add New Transport'}</h2>
//                     <p className="text-xs text-gray-500">Configure vehicle details and logistics</p>
//                  </div>
//                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><X size={20}/></button>
//               </div>

//               <div className="flex-1 overflow-y-auto p-8 bg-white">
//                   <div className="grid grid-cols-13 gap-8">
                    
//                     {/* LEFT COLUMN: Core Info */}
//                     <div className="col-span-12 lg:col-span-7 space-y-6">
                        
//                         {/* [CHANGE 5: SUPPLIER LINKAGE SECTION (Top of Left Col)] */}
//                         <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-4 items-start">
//                             <div className="flex-1">
//                                 <label className="block text-xs font-bold text-blue-900 mb-2 flex items-center gap-1">
//                                     <Briefcase size={14} /> Fulfillment Partner (Transport)
//                                 </label>
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
//                                     {formData.linkedSupplierId && !availableSuppliers.find(s => s.id === formData.linkedSupplierId) && selectedSupplierData && (
//                                          <option value={selectedSupplierData.id}>{selectedSupplierData.name} (Current) - *City Mismatch*</option>
//                                     )}
//                                 </select>
//                                 {availableSuppliers.length === 0 && formData.city && (
//                                     <p className="text-[10px] text-red-500 mt-1">No 'Transport' suppliers found in {formData.city}.</p>
//                                 )}
//                             </div>
                            
//                             {/* [CHANGE 6: ENHANCED INTELLIGENCE BOX] */}
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

//                         {/* 1. Vehicle Selection */}
//                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
//                              <h3 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
//                                 <Car size={14}/> Core Configuration
//                              </h3>
//                              <div className="grid grid-cols-2 gap-4">
//                                 <div><label className="text-xs font-bold text-gray-700 mb-1 block">Service Type</label><div className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm font-bold">Transfer</div></div>
//                                 <div>
//                                     <label className="text-xs font-bold text-gray-700 mb-1 block">Vehicle Type</label>
//                                     <select value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg bg-white outline-none focus:border-blue-500">
//                                        {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
//                                     </select>
//                                 </div>
//                              </div>
//                         </div>

//                         {/* 2. Location */}
//                         <div className="grid grid-cols-2 gap-4">
//                             <div><label className="text-xs font-bold text-gray-700 mb-1 block">City *</label><input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500" placeholder="e.g. Rome"/></div>
//                             <div><label className="text-xs font-bold text-gray-700 mb-1 block">Country *</label><input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500" placeholder="e.g. Italy"/></div>
//                         </div>

//                         {/* 3. Specs */}
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="text-xs font-bold text-gray-700 mb-1 block">Max Guests</label>
//                                 <div className="relative"><Users size={15} className="absolute left-3 top-3 text-gray-500"/><input type="number" value={formData.maxGuests} onChange={e => setFormData({...formData, maxGuests: parseInt(e.target.value)})} className="w-full pl-9 p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"/></div>
//                             </div>
//                             <div>
//                                 <label className="text-xs font-bold text-gray-700 mb-1 block">Luggage Cap</label>
//                                 <div className="relative"><Briefcase size={15} className="absolute left-3 top-3 text-gray-500"/><input type="text" value={formData.luggageCapacity} onChange={e => setFormData({...formData, luggageCapacity: e.target.value})} className="w-full pl-9 p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"/></div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* RIGHT COLUMN */}
//                     <div className="col-span-13 lg:col-span-6 space-y-6">
//                         <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 h-full">
//                              <h3 className="text-xs font-bold text-blue-800 uppercase mb-3 flex items-center gap-2"><Navigation size={14}/> Logistics</h3>
//                              <div className="space-y-4">
//                                 <div><label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Pickup Location</label><input type="text" value={formData.defaultPickup || " "} onChange={e => setFormData({...formData, defaultPickup: e.target.value})} className="w-full p-2 border border-blue-200 rounded-lg text-sm" placeholder="e.g. FCO Airport / Hotel"/></div>
//                                 <div><label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Dropoff Location</label><input type="text" value={formData.defaultDropoff || " "} onChange={e => setFormData({...formData, defaultDropoff: e.target.value})} className="w-full p-2 border border-blue-200 rounded-lg text-sm" placeholder="e.g. City Center Hotel"/></div>
//                              </div>
//                         </div>
//                     </div>
//                   </div>
//               </div>

//               <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
//                   <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
//                   <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition-transform active:scale-95"><Save size={18}/> Save Transport</button>
//               </div>
//            </div>
//         </div>
//       )}
//    </div>
//   );
// } 












































































"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, MapPin, Car, Trash2, X, Save, 
  ChevronDown, ChevronRight, Users, Briefcase, 
  Edit, Plane, Train, Ship,
  Navigation, Globe, Phone, Mail, CreditCard, DollarSign, Loader2
} from 'lucide-react';
import { useSRM } from '@/app/context/SRMContext';
import { TransportData, saveTransport, deleteTransport } from '@/utils/srmStorage';
import { VEHICLE_TYPES } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';

export default function TransportSRMPage() {
  const { transports, suppliers, refreshAll, searchText, isLoading } = useSRM();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // NEW STATE
  
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

  const initialForm: TransportData = {
    id: '',
    vehicleType: 'Sedan Car',
    serviceType: 'Transfer',
    city: '',
    country: '',
    maxGuests: 3,
    luggageCapacity: '2 Bags',
    status: 'Active',
    description: '',       
    defaultPickup: '',     
    defaultDropoff: '',    
    defaultDuration: '',
    linkedSupplierId: '', 
    createdAt: '',
    updatedAt: ''
  };
  
  const [formData, setFormData] = useState(initialForm);

  const availableSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const basicCheck = s.status === 'Active' && s.services.includes('Transport');
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
           s.services.includes('Transport') &&
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
    const filtered = transports.filter(t => 
      (t.vehicleType || "").toLowerCase().includes(searchText.toLowerCase()) || 
      (t.city || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (t.country || "").toLowerCase().includes(searchText.toLowerCase())
    );

    const groups: Record<string, Record<string, TransportData[]>> = {};

    filtered.forEach(item => {
      const country = (item.country || "Uncategorized").trim();
      const city = (item.city || "General").trim();

      if (!groups[country]) groups[country] = {};
      if (!groups[country][city]) groups[country][city] = [];
      
      groups[country][city].push(item);
    });

    return Object.keys(groups).sort().reduce((acc, country) => {
        acc[country] = groups[country];
        return acc;
    }, {} as Record<string, Record<string, TransportData[]>>);
  }, [transports, searchText]);

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

  const handleEdit = (item: TransportData) => { 
    setFormData(JSON.parse(JSON.stringify(item))); 
    setIsModalOpen(true); 
  };

  // CHANGED: Async
  const handleDelete = async (id: string) => { 
    if (confirm('Delete this transport service?')) { 
      await deleteTransport(id); 
      await refreshAll(); 
    } 
  };

  // CHANGED: Async
  const handleSave = async () => {
    if (!formData.vehicleType || !formData.city) return alert("Vehicle Type and City are required");
    setIsSaving(true);
    const cleanData = {
        ...formData,
        serviceType: 'Transfer',
        city: formData.city.trim(),
        country: formData.country.trim()
    };
    const success = await saveTransport(cleanData as any);
    if(success) {
      await refreshAll();
      setIsModalOpen(false);
    } else {
      alert("Failed to save.");
    }
    setIsSaving(false);
  };

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('flight') || lower.includes('air')) return <Plane size={20} />;
    if (lower.includes('train') || lower.includes('rail')) return <Train size={20} />;
    if (lower.includes('ferry') || lower.includes('boat')) return <Ship size={20} />;
    return <Car size={20} />;
  };

  return (
   <div className="h-full w-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=60")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
      }} />
      <div className="absolute inset-0 z-0 bg-black/50 backdrop-blur-sm" />

      <div className="flex-1 flex flex-col relative z-10 h-full">
        <div className="bg-white/95 border-b border-white/50 px-6 py-4 flex justify-between items-center backdrop-blur-md shadow-sm z-10">
            <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Car className="text-blue-700"/> Transport Fleet & Services
                </h1>
                <p className="text-xs text-gray-600 font-medium">Manage vehicle inventory and logistics.</p>
            </div>
            <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
            <Plus size={18} /> Add Transport
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-white">
                    <Loader2 size={40} className="animate-spin mb-4 text-blue-300" />
                    <p className="font-medium text-lg drop-shadow-md">Loading Vehicles...</p>
                </div>
            ) : Object.keys(groupedData).length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-gray-600 bg-white/40 rounded-xl border border-white/50 backdrop-blur-sm">
                    <Car size={48} className="opacity-50 mb-2"/>
                    <p className="font-bold">No transport services found.</p>
                    <p className="text-sm">Click "Add Transport" to start.</p>
                 </div>
             ) : (
                Object.entries(groupedData).map(([country, cities]) => (
                    <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div 
                            onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))}
                            className="flex items-center bg-white/95 p-4 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white transition-all select-none border border-white/50 backdrop-blur-sm mb-2"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:text-blue-800 transition-colors">
                                {expandedCountries[country] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                   <Globe size={18} className="text-blue-800 " />
                                    {country}
                                </h3>
                            </div>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                {Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Transport
                            </span>
                        </div>
                        
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
                                               <MapPin size={18} className="text-red-800" />
                                                <span className="font-bold text-gray-900">{city}</span>
                                                <span className="text-xs text-gray-900 bg-blue-200 px-2 py-0.5 rounded-full">
                                                    {items.length}
                                                </span>
                                            </div>

                                            {expandedCities[cityKey] && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-6 mb-4">
                                                    {items.map(item => {
                                                        const sup = suppliers.find(s => s.id === item.linkedSupplierId);

                                                        return (
                                                            <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col overflow-hidden relative">
                                                                <div className="h-2 w-full bg-green-500" />
                                                                <div className="p-5 flex-1 flex flex-col">
                                                                    <div className="flex justify-between items-start mb-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                                                                {getIcon(item.vehicleType)}
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="font-bold text-gray-900 text-lg leading-tight">
                                                                                    {item.vehicleType}
                                                                                </h4>
                                                                                <div className="flex items-center gap-2 mt-1">
                                                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-green-100 text-green-700">
                                                                                        Transfer
                                                                                        </span>
                                                                                        <span className="text-[10px] text-gray-700">|</span>
                                                                                        <span className="text-xs text-gray-700">{item.city}</span>
                                                                                </div>
                                                                                {sup && (
                                                                                    <div className="mt-2 inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-1 rounded text-[10px] border border-blue-100">
                                                                                        <Briefcase size={10} /> 
                                                                                        <span className="font-bold truncate max-w-[150px]">By: {sup.name}</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                
                                                                    <div className="grid grid-cols-2 gap-2 mb-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                                        <div className="flex items-center gap-2">
                                                                            <Users size={14} className="text-gray-700"/>
                                                                            <div className="flex flex-col">
                                                                                <span className="text-[10px] font-bold text-gray-700 uppercase">Capacity </span>
                                                                                <span className="text-xs font-bold text-gray-700">{item.maxGuests} Pax</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Briefcase size={14} className="text-gray-700"/>
                                                                            <div className="flex flex-col">
                                                                                <span className="text-[10px] font-bold text-gray-700 uppercase">Luggage </span>
                                                                                <span className="text-xs font-bold text-gray-700">{item.luggageCapacity}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                
                                                                    <div className="mb-1 p-3 rounded-lg border border-gray-100">
                                                                        <div className="space-y-2 flex justify-between">
                                                                            <div className="flex gap-2">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-[10px] font-bold text-blue-800 uppercase">Pickup</span>
                                                                                    <span className="text-xs font-bold text-gray-700 leading-tight">
                                                                                        {item.defaultPickup || <span className="text-gray-400 italic">Not set</span>}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex gap-2">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-[10px] font-bold text-blue-800 uppercase">Drop</span>
                                                                                    <span className="text-xs font-bold text-gray-700 leading-tight">
                                                                                        {item.defaultDropoff || <span className="text-gray-400 italic">Not set</span>}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                
                                                                    <div className="mt-auto border-t border-gray-100 flex items-center gap-3 mt-2 pt-2">
                                                                        <button onClick={() => handleEdit(item)} className="flex-1 py-2 bg-blue-500 text-white hover:bg-blue-500 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                                                            <Edit size={14} /> Edit
                                                                        </button>
                                                                        <button onClick={() => handleDelete(item.id as string)} className="flex-1 py-2 bg-red-500 text-white hover:bg-red-500 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                                                            <Trash2 size={14} /> Delete
                                                                        </button>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                 <div>
                    <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Transport' : 'Add New Transport'}</h2>
                    <p className="text-xs text-gray-500">Configure vehicle details and logistics</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 disabled:opacity-50"><X size={20}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-white">
                  <div className="grid grid-cols-13 gap-8">
                    
                    <div className="col-span-12 lg:col-span-7 space-y-6">
                        
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-4 items-start">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-blue-900 mb-2 flex items-center gap-1">
                                    <Briefcase size={14} /> Fulfillment Partner (Transport)
                                </label>
                                <select 
                                    className="w-full p-2.5 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                                    <p className="text-[10px] text-red-500 mt-1">No 'Transport' suppliers found in {formData.city}.</p>
                                )}
                            </div>
                            
                            {selectedSupplierData && (
                                <div className="flex-1 bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-xs">
                                    <div className="font-bold text-gray-800 mb-2 flex justify-between items-center border-b border-gray-100 pb-1">
                                        <span>{selectedSupplierData.contactPerson}</span>
                                        {selectedSupplierData.isPreferred && <span className="bg-orange-100 text-orange-700 px-1.5 rounded text-[10px]">Preferred</span>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-600">
                                        <div className="flex items-center gap-1"><Phone size={10}/> {selectedSupplierData.phone}</div>
                                        <div className="flex items-center gap-1"><CreditCard size={10}/> {selectedSupplierData.paymentTerms}</div>
                                        <div className="col-span-2 flex items-center gap-1 truncate" title={selectedSupplierData.email}><Mail size={10}/> {selectedSupplierData.email}</div>
                                        <div className="col-span-2 flex items-center gap-1 font-bold text-blue-800 bg-blue-50 px-1 rounded"><DollarSign size={10}/> Currency: {selectedSupplierData.currency || 'USD'}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                             <h3 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                                <Car size={14}/> Core Configuration
                             </h3>
                             <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-gray-700 mb-1 block">Service Type</label><div className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm font-bold">Transfer</div></div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 mb-1 block">Vehicle Type</label>
                                    <select value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg bg-white outline-none focus:border-blue-500">
                                       {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                             </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-gray-700 mb-1 block">City *</label><input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500" placeholder="e.g. Rome"/></div>
                            <div><label className="text-xs font-bold text-gray-700 mb-1 block">Country *</label><input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500" placeholder="e.g. Italy"/></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-700 mb-1 block">Max Guests</label>
                                <div className="relative"><Users size={15} className="absolute left-3 top-3 text-gray-500"/><input type="number" value={formData.maxGuests} onChange={e => setFormData({...formData, maxGuests: parseInt(e.target.value)})} className="w-full pl-9 p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"/></div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-700 mb-1 block">Luggage Cap</label>
                                <div className="relative"><Briefcase size={15} className="absolute left-3 top-3 text-gray-500"/><input type="text" value={formData.luggageCapacity} onChange={e => setFormData({...formData, luggageCapacity: e.target.value})} className="w-full pl-9 p-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"/></div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-13 lg:col-span-6 space-y-6">
                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 h-full">
                             <h3 className="text-xs font-bold text-blue-800 uppercase mb-3 flex items-center gap-2"><Navigation size={14}/> Logistics</h3>
                             <div className="space-y-4">
                                <div><label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Pickup Location</label><input type="text" value={formData.defaultPickup || " "} onChange={e => setFormData({...formData, defaultPickup: e.target.value})} className="w-full p-2 border border-blue-200 rounded-lg text-sm" placeholder="e.g. FCO Airport / Hotel"/></div>
                                <div><label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Dropoff Location</label><input type="text" value={formData.defaultDropoff || " "} onChange={e => setFormData({...formData, defaultDropoff: e.target.value})} className="w-full p-2 border border-blue-200 rounded-lg text-sm" placeholder="e.g. City Center Hotel"/></div>
                             </div>
                        </div>
                    </div>
                  </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
                  <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">Cancel</button>
                  <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-70">
                    {isSaving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18}/> Save Transport</>}
                  </button>
              </div>
           </div>
        </div>
      )}
   </div>
  );
}