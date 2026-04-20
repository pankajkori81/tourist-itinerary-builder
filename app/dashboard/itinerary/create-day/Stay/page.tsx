

// "use client";

// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { 
//   X, Save, MapPin, Building2, PlusCircle, 
//   Wallet, BedDouble, Star, 
//   CheckCircle2, Ban, PlusSquare, Users, Image as ImageIcon,
//   Briefcase, Phone, Mail, CreditCard, DollarSign // [CHANGE 1: Added Icons]
// } from 'lucide-react';
// import { 
//   Stay, HOTEL_CATEGORIES, HOTEL_TYPES 
// } from '../constants/daywiseConstants';
// // IMPORT SRM UTILS & CONTEXT
// import { getStays, StayData, RoomCategory } from '@/utils/srmStorage';
// import { useSRM } from '@/app/context/SRMContext'; // [CHANGE 2: Import Context]

// interface StayFormProps {
//   initialData?: Stay;
//   city: string;
//   dayDate: string; // Format: YYYY-MM-DD
//   onSave: (data: Stay) => void;
//   onCancel: () => void;
// }

// // Helper to map JS Date Month (0-11) to your SRM keys ('jan', 'feb'...)
// const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

// export default function StayForm({ initialData, city, dayDate, onSave, onCancel }: StayFormProps) {
  
//   // --- [CHANGE 3: SRM CONTEXT] ---
//   const { suppliers } = useSRM();

//   // --- 1. STATE ---
//   // Ensure linkedSupplierId is part of the initial state
//   const [formData, setFormData] = useState<Stay>(initialData || {
//     id: Date.now(),
//     type: 'stay',
//     hotelName: '',
//     description: '',
//     address: city,
//     rating: '4.5',
//     category: 'Hotel',
//     stayType: 'Luxury',
//     roomCategory: 'Standard Room',
//     inclusionType: 'included',
//     checkInDate: dayDate || '',
//     checkInTime: '14:00',
//     checkOutDate: '',     
//     checkOutTime: '11:00',
//     nights: 1,
//     costPerNight: 0,
//     numRooms: 1,
//     roomOccupancy: [2], 
//     customImage: '',
//     // @ts-ignore (If type definition isn't updated yet, this prevents crash)
//     linkedSupplierId: '' 
//   });

//   const [showSidebar, setShowSidebar] = useState(true);
//   const [srmHotels, setSrmHotels] = useState<StayData[]>([]); 
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // --- [CHANGE 4: SMART SUPPLIER LOGIC] ---
  
//   // A. Filter Suppliers (Must be Active + 'Stay' Service + Match City)
//   const availableSuppliers = useMemo(() => {
//     return suppliers.filter(s => {
//       const basicCheck = s.status === 'Active' && s.services.includes('Stay');
//       // Loose matching for city
//       const cityCheck = s.city.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(s.city.toLowerCase());
//       return basicCheck && cityCheck;
//     });
//   }, [suppliers, city]);

//   // B. Auto-Select "Preferred" Supplier if none selected
//   useEffect(() => {
//      if (!formData.linkedSupplierId) { // Check if field is empty
//         const preferred = availableSuppliers.find(s => s.isPreferred);
//         if (preferred) {
//            // @ts-ignore
//            setFormData(prev => ({ ...prev, linkedSupplierId: preferred.id }));
//         }
//      }
//   }, [availableSuppliers]);

//   // C. Get Selected Supplier Data for the "Intelligence Box"
//   // @ts-ignore
//   const selectedSupplier = suppliers.find(s => s.id === formData.linkedSupplierId);

//   // ----------------------------------------

//   // --- 2. EFFECTS (Existing Logic) ---

//   // A. FETCH & FILTER SRM HOTELS (Inventory Sidebar)
//   useEffect(() => {
//     const allStays = getStays();
//     const filtered = allStays.filter(stay => 
//         stay.city.toLowerCase().includes(city.toLowerCase()) || 
//         city.toLowerCase().includes(stay.city.toLowerCase())
//     );
//     setSrmHotels(filtered);
//   }, [city]);
  
//   // B. Auto-calculate Check-out based on nights
//   useEffect(() => {
//     if (formData.checkInDate && formData.nights > 0) {
//       const date = new Date(formData.checkInDate);
//       date.setDate(date.getDate() + formData.nights);
//       const dateStr = date.toISOString().split('T')[0];
//       setFormData(prev => ({ ...prev, checkOutDate: dateStr }));
//     }
//   }, [formData.checkInDate, formData.nights]);

//   // C. Sync roomOccupancy
//   useEffect(() => {
//     const currentRooms = formData.numRooms;
//     const currentOccupancy = formData.roomOccupancy || [];
//     if (currentOccupancy.length !== currentRooms) {
//         const newOccupancy = Array(currentRooms).fill(2).map((_, i) => currentOccupancy[i] || 2);
//         setFormData(prev => ({ ...prev, roomOccupancy: newOccupancy }));
//     }
//   }, [formData.numRooms]);

//   // --- 3. PRICE ENGINE LOGIC ---
//   const getPriceForDate = (room: RoomCategory, dateString: string): number => {
//     if (!dateString) return 0;
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const monthIndex = date.getMonth(); 
//     const monthKey = MONTH_KEYS[monthIndex];

//     const rateCard = room.rateCards.find(rc => rc.year === year);
//     // @ts-ignore
//     return rateCard ? (rateCard.rates[monthKey] || 0) : 0;
//   };

//   // --- 4. HANDLERS ---
//   const handleChange = (field: keyof Stay, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleRoomOccupancyChange = (index: number, value: number) => {
//     const newOccupancy = [...(formData.roomOccupancy || [])];
//     newOccupancy[index] = value;
//     setFormData(prev => ({ ...prev, roomOccupancy: newOccupancy }));
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({ ...prev, customImage: reader.result as string }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // --- SELECT FROM SIDEBAR ---
//   const selectSrmHotel = (hotel: StayData) => {
//     const selectedRoom = hotel.roomCategories[0];
//     const calculatedPrice = selectedRoom 
//         ? getPriceForDate(selectedRoom, formData.checkInDate) 
//         : 0;

//     setFormData(prev => ({
//       ...prev,
//       hotelName: hotel.name,
//       rating: hotel.rating.toString(),
//       category: hotel.type,
//       stayType: 'Luxury', 
//       description: hotel.description || `Located in ${hotel.city}, ${hotel.country}.`,
//       address: hotel.address || `${hotel.city}, ${hotel.country}`,
//       customImage: hotel.images?.[0] || '',
//       roomCategory: selectedRoom?.name || 'Standard Room',
//       costPerNight: calculatedPrice,
//       // If the hotel in SRM has a specific supplier linked (future feature), we could use it here.
//       // For now, we rely on the City logic we added above.
//     }));

//     if (window.innerWidth < 768) setShowSidebar(false);
//   };

//   const calculateTotal = () => {
//     return formData.costPerNight * formData.numRooms * formData.nights;
//   };

//   const totalPax = (formData.roomOccupancy || []).reduce((a, b) => a + b, 0);

//   return (
//     <div className="relative flex h-full w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-300">
      
//       {/* --- LEFT SIDE: MAIN FORM --- */}
//       <div className="flex-1 flex flex-col h-full bg-white relative z-10">
        
//         {/* HEADER */}
//         <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
//           <div>
//             <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//                <Building2 className="text-purple-600" size={20}/>
//                {initialData ? 'Edit Stay' : 'Add New Stay'}
//             </h2>
//             <p className="text-xs text-gray-500 flex items-center gap-2">
//               <span className="font-semibold text-purple-600">{city}</span>
//               <span>•</span>
//               <span>Check-in: {formData.checkInDate}</span>
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button onClick={onCancel} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
//               Cancel
//             </button>
//             <button onClick={() => onSave(formData)} className="px-6 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md transition-all flex items-center gap-2">
//               <Save size={16} /> Save Stay
//             </button>
//           </div>
//         </div>

//         {/* SCROLLABLE FORM BODY */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
//           {/* SECTION A: HOTEL DETAILS */}
//           <section className="space-y-4">
             
//              {/* --- [CHANGE 5: SUPPLIER SECTION INJECTED HERE] --- */}
//              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 flex gap-4 items-start mb-2">
//                 <div className="flex-1">
//                     <label className="block text-xs font-bold text-purple-900 mb-2 flex items-center gap-1">
//                         <Briefcase size={14} /> Fulfillment Partner (Stay)
//                     </label>
//                     <select 
//                         className="w-full p-2.5 border border-purple-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none"
//                         // @ts-ignore
//                         value={formData.linkedSupplierId || ""}
//                         // @ts-ignore
//                         onChange={(e) => handleChange('linkedSupplierId', e.target.value)}
//                     >
//                         <option value="">-- Direct / Unknown --</option>
//                         {availableSuppliers.map(s => (
//                             <option key={s.id} value={s.id}>
//                                 {s.name} ({s.city}) {s.isPreferred ? '★ Preferred' : ''}
//                             </option>
//                         ))}
//                     </select>
//                     {availableSuppliers.length === 0 && (
//                         <p className="text-[10px] text-gray-400 mt-1">No 'Stay' suppliers found for {city}.</p>
//                     )}
//                 </div>
                
//                 {/* Intelligence Box */}
//                 {selectedSupplier && (
//                     <div className="flex-1 bg-white p-3 rounded-lg border border-purple-100 shadow-sm text-xs">
//                         <div className="font-bold text-gray-800 mb-2 flex justify-between items-center border-b border-gray-100 pb-1">
//                             <span>{selectedSupplier.contactPerson}</span>
//                             <span className="text-purple-600 bg-purple-50 px-1.5 rounded">{selectedSupplier.paymentTerms}</span>
//                         </div>
//                         <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-600">
//                             <div className="flex items-center gap-1"><Phone size={10}/> {selectedSupplier.phone}</div>
//                             <div className="flex items-center gap-1"><DollarSign size={10}/> {selectedSupplier.currency || 'USD'}</div>
//                             <div className="col-span-2 flex items-center gap-1 truncate" title={selectedSupplier.email}><Mail size={10}/> {selectedSupplier.email}</div>
//                         </div>
//                     </div>
//                 )}
//              </div>
//              {/* --- [END CHANGE] --- */}

//              <div className="flex gap-2">
//                 <div className="flex-1">
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Stay Name <span className="text-red-500">*</span></label>
//                   <input 
//                     type="text" 
//                     value={formData.hotelName}
//                     onChange={(e) => handleChange('hotelName', e.target.value)}
//                     placeholder="Select from sidebar or type..."
//                     className="w-full p-3 bg-purple-50 border border-purple-100 rounded-lg text-sm font-bold text-gray-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
//                   />
//                 </div>
//                 <button 
//                    onClick={() => setShowSidebar(!showSidebar)}
//                    className={`mt-6 px-3 border rounded-lg transition-colors ${showSidebar ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-gray-50 text-gray-500'}`}
//                    title="Toggle Hotel List"
//                 >
//                   <PlusCircle size={20} />
//                 </button>
//               </div>

//               {/* ... (Rest of existing Design: Categories, Ratings, etc.) ... */}
//               <div className="grid grid-cols-12 gap-4">
//                   <div className="col-span-4">
//                      <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
//                      <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none">
//                         {HOTEL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
//                      </select>
//                   </div>
//                   <div className="col-span-4">
//                      <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
//                      <select value={formData.stayType} onChange={(e) => handleChange('stayType', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none">
//                         {HOTEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
//                      </select>
//                   </div>
//                   <div className="col-span-4">
//                      <label className="block text-xs font-semibold text-gray-500 mb-1">Rating</label>
//                      <div className="flex items-center gap-1 bg-white border border-gray-200 p-2 rounded-lg">
//                         <Star size={14} className="text-yellow-500 fill-yellow-500"/>
//                         <input type="number" step="0.5" max="5" value={formData.rating} onChange={(e) => handleChange('rating', e.target.value)} className="w-full outline-none text-sm font-bold text-gray-700"/>
//                      </div>
//                   </div>
//               </div>
              
//               <div className="grid grid-cols-12 gap-4">
//                  <div className="col-span-8">
//                     <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
//                     <textarea 
//                        rows={3} 
//                        value={formData.description}
//                        onChange={(e) => handleChange('description', e.target.value)}
//                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm resize-none outline-none"
//                        placeholder="Short description of the property..."
//                     />
//                  </div>
//                  <div 
//                     onClick={() => fileInputRef.current?.click()}
//                     className="col-span-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 bg-cover bg-center"
//                     style={{ backgroundImage: `url(${formData.customImage})` }}
//                  >
//                     {!formData.customImage && <span className="text-xs text-gray-400">Upload Image</span>}
//                     <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
//                  </div>
//               </div>
//           </section>

//           <hr className="border-gray-100" />

//           {/* SECTION B: ROOM CONFIG */}
//           <section className="space-y-4">
//             <div className="flex items-center gap-2 text-orange-600 mb-2">
//               <BedDouble size={18} />
//               <span className="text-xs font-bold uppercase tracking-wider">Room Category</span>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//                <div>
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Room Category Name</label>
//                   <input type="text" value={formData.roomCategory} onChange={(e) => handleChange('roomCategory', e.target.value)} placeholder="e.g. Standard Room" className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none"/>
//                </div>
//             </div>
//           </section>

//           <hr className="border-gray-100" />

//           {/* SECTION C: DATES & COSTING */}
//           <section className="space-y-4">
//              <div className="flex items-center gap-2 text-green-600 mb-2">
//               <Wallet size={18} />
//               <span className="text-xs font-bold uppercase tracking-wider">Dates & Costing</span>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-5">
//                {/* Packaging Status */}
//                <div>
//                 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Packaging Status</label>
//                 <div className="grid grid-cols-3 gap-3">
//                   <div onClick={() => handleChange('inclusionType', 'included')} className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.inclusionType === 'included' ? 'bg-green-50 border-green-500 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
//                     <CheckCircle2 size={20} className={formData.inclusionType === 'included' ? "text-green-600" : "text-gray-400"} />
//                     <span className={`text-xs font-bold ${formData.inclusionType === 'included' ? "text-green-700" : "text-gray-500"}`}>Included</span>
//                   </div>
//                   <div onClick={() => handleChange('inclusionType', 'excluded')} className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.inclusionType === 'excluded' ? 'bg-red-50 border-red-500 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
//                     <Ban size={20} className={formData.inclusionType === 'excluded' ? "text-red-600" : "text-gray-400"} />
//                     <span className={`text-xs font-bold ${formData.inclusionType === 'excluded' ? "text-red-700" : "text-gray-500"}`}>Excluded</span>
//                   </div>
//                    <div onClick={() => handleChange('inclusionType', 'optional')} className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.inclusionType === 'optional' ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
//                     <PlusSquare size={20} className={formData.inclusionType === 'optional' ? "text-blue-600" : "text-gray-400"} />
//                     <span className={`text-xs font-bold ${formData.inclusionType === 'optional' ? "text-blue-700" : "text-gray-500"}`}>Optional</span>
//                   </div>
//                 </div>
//               </div>

//                {/* Date Row */}
//                <div className="grid grid-cols-12 gap-3 items-end">
//                   <div className="col-span-4">
//                      <label className="text-[10px] uppercase font-bold text-gray-500">Check-In</label>
//                      <input type="date" value={formData.checkInDate} onChange={(e) => handleChange('checkInDate', e.target.value)} className="w-full p-2 border rounded text-xs font-bold"/>
//                   </div>
//                   <div className="col-span-2">
//                      <label className="text-[10px] uppercase font-bold text-gray-500">Time</label>
//                      <input type="time" value={formData.checkInTime} onChange={(e) => handleChange('checkInTime', e.target.value)} className="w-full p-2 border rounded text-xs"/>
//                   </div>
//                   <div className="col-span-2">
//                      <label className="text-[10px] uppercase font-bold text-gray-500 text-center block">Nights</label>
//                      <input type="number" min="1" value={formData.nights} onChange={(e) => handleChange('nights', parseInt(e.target.value) || 1)} className="w-full p-2 border border-purple-300 bg-purple-50 text-purple-700 font-bold rounded text-xs text-center"/>
//                   </div>
//                   <div className="col-span-4">
//                      <label className="text-[10px] uppercase font-bold text-gray-500">Check-Out</label>
//                      <input type="date" value={formData.checkOutDate} readOnly className="w-full p-2 bg-gray-100 border rounded text-xs text-gray-500"/>
//                   </div>
//                </div>

//                {/* Dynamic Costing */}
//                {formData.inclusionType !== 'excluded' && (
//                  <div className="space-y-3">
//                     <div className="grid grid-cols-12 gap-4">
//                         <div className="col-span-4">
//                             <label className="block text-xs font-semibold text-gray-700 mb-1">Total Rooms</label>
//                             <input 
//                               type="number" 
//                               min="1" 
//                               value={formData.numRooms} 
//                               onChange={(e) => handleChange('numRooms', parseInt(e.target.value) || 1)} 
//                               className="w-full p-2 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-purple-500"
//                             />
//                         </div>
//                         <div className="col-span-4">
//                             <label className="block text-xs font-semibold text-gray-700 mb-1">Cost Per Room (Night)</label>
//                             <div className="relative">
//                                 <span className="absolute left-2 top-2.5 text-gray-700 text-xs">$</span>
//                                 <input 
//                                   type="number" 
//                                   value={formData.costPerNight} 
//                                   onChange={(e) => handleChange('costPerNight', parseFloat(e.target.value) || 0)} 
//                                   className="w-full pl-5 p-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-800"
//                                 />
//                             </div>
//                         </div>
                        
//                         <div className="col-span-4 flex flex-col justify-end">
//                             <div className="bg-green-100 p-2 rounded-lg border border-green-200 text-center">
//                                 <div className="text-[10px] text-green-600 font-bold uppercase">Total Stay Cost</div>
//                                 <div className="text-lg font-bold text-green-800">${calculateTotal().toLocaleString()}</div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Room Breakdown List */}
//                     <div className="bg-white border border-gray-200 rounded-lg p-3">
//                         <div className="flex justify-between items-center mb-2">
//                            <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
//                               <Users size={12}/> Occupancy Breakdown
//                            </label>
//                            <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold">Total Pax: {totalPax}</span>
//                         </div>
                        
//                         <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
//                            {(formData.roomOccupancy || []).map((pax, index) => (
//                               <div key={index} className="flex items-center gap-3 text-sm">
//                                   <span className="text-xs font-bold text-gray-700 w-16">Room {index + 1}:</span>
//                                   <div className="flex items-center gap-2 flex-1">
//                                       <input 
//                                         type="number" 
//                                         min="1" 
//                                         max="4"
//                                         value={pax} 
//                                         onChange={(e) => handleRoomOccupancyChange(index, parseInt(e.target.value) || 1)}
//                                         className="w-16 p-1 text-center border border-gray-300 rounded text-xs font-bold"
//                                       />
//                                       <span className="text-xs text-gray-700">Person(s)</span>
//                                   </div>
//                                   <div className="text-xs font-mono text-green-900 font-bold">
//                                       {formData.costPerNight > 0 
//                                         ? `$${((formData.costPerNight * formData.nights) / pax).toFixed(0)} PP` 
//                                         : '$0 PP'
//                                       }
//                                   </div>
//                               </div>
//                            ))}
//                         </div>
//                     </div>
//                  </div>
//                )}
//             </div>
//           </section>
//         </div>
//       </div>

//       {/* --- RIGHT SIDE: SIDEBAR (UNCHANGED from your original code) --- */}
//       <div 
//         className={`absolute top-0 right-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col transition-transform duration-300 z-20 ${
//             showSidebar ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//           <div className="p-4 bg-purple-600 text-white flex justify-between items-center shrink-0">
//              <div>
//                 <h3 className="text-xs font-bold opacity-80 uppercase">Available Stays</h3>
//                 <div className="font-bold text-sm">{city}</div>
//                 <div className="text-[10px] opacity-70">Showing rates for {formData.checkInDate}</div>
//              </div>
//              <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-purple-700 rounded text-white">
//                 <X size={16} />
//              </button>
//           </div>
          
//           <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
//              {srmHotels.length === 0 ? (
//                  <div className="text-center p-6 text-gray-400 text-sm">
//                     <Building2 className="mx-auto mb-2 opacity-50" size={32} />
//                     No hotels found in SRM for {city}.
//                  </div>
//              ) : (
//                  srmHotels.map((item, i) => {
//                     const displayPrice = item.roomCategories?.[0] 
//                         ? getPriceForDate(item.roomCategories[0], formData.checkInDate) 
//                         : 0;

//                     return (
//                         <div key={item.id} onClick={() => selectSrmHotel(item)} className="bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-purple-500 group overflow-hidden">
//                             <div className="h-24 bg-gray-200 relative">
//                                 {item.images?.[0] ? (
//                                     <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover"/>
//                                 ) : (
//                                     <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={24}/></div>
//                                 )}
//                                 <div className="absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow">
//                                 <Star size={10} className="text-yellow-500 fill-yellow-500"/> {item.rating}
//                                 </div>
//                             </div>
//                             <div className="p-3">
//                                 <div className="font-bold text-gray-800 text-sm group-hover:text-purple-600 truncate">{item.name}</div>
//                                 <div className="flex justify-between items-center mt-1">
//                                 <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">{item.type}</span>
//                                 <span className="text-xs font-bold text-green-700">
//                                     ${displayPrice} <span className="text-[9px] font-normal text-gray-400">/night</span>
//                                 </span>
//                                 </div>
//                                 <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 truncate"><MapPin size={10}/> {item.address || item.city}</p>
//                             </div>
//                         </div>
//                     )
//                  })
//              )}
//           </div>
//       </div>
//     </div>
//   );
// } 


























"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, Save, MapPin, Building2, PlusCircle, 
  Wallet, BedDouble, Star, 
  CheckCircle2, Ban, PlusSquare, Users, Image as ImageIcon,
  Briefcase, Phone, Mail, CreditCard, DollarSign 
} from 'lucide-react';
import { 
  Stay, HOTEL_CATEGORIES, HOTEL_TYPES 
} from '../constants/daywiseConstants';
import { getStays, StayData, RoomCategory } from '@/utils/srmStorage';
import { useSRM } from '@/app/context/SRMContext'; 
import { useItinerary } from '@/app/context/ItineraryContext';

interface StayFormProps {
  initialData?: Stay;
  city: string;
  dayDate: string; // Format: YYYY-MM-DD
  onSave: (data: Stay) => void;
  onCancel: () => void;
}

// Helper to map JS Date Month (0-11) to your SRM keys ('jan', 'feb'...)
const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export default function StayForm({ initialData, city, dayDate, onSave, onCancel }: StayFormProps) {
  
  const { itineraryData } = useItinerary();
  const { suppliers } = useSRM();

  // 🌟 STEP 1: Smart Nights Calculator
  // Look through the Routing Data to find this exact city and get the planned nights
  const defaultNights = useMemo(() => {
    if (!itineraryData?.routingData?.routes) return 1;
    
    // Find the route block that contains this city
    const matchingRoute = itineraryData.routingData.routes.find((route: any) => 
        route.cities?.some((c: any) => c.name?.toLowerCase() === city.toLowerCase())
    );

    // Return the nights from that route, or fallback to 1 if something goes wrong
    return matchingRoute ? (parseInt(String(matchingRoute.nights)) || 1) : 1;
  }, [itineraryData, city]);

  // Initialize State
  const [formData, setFormData] = useState<Stay>(initialData || {
    id: Date.now(),
    type: 'stay',
    hotelName: '',
    description: '',
    address: city,
    rating: '4.5',
    category: 'Hotel',
    
    // Smart Link: Uses global category from Create Page
    stayType: itineraryData?.tripCategory || 'Luxury', 
    
    roomCategory: 'Standard Room',
    roomName: 'Standard Room',
    inclusionType: 'included',
    checkInDate: dayDate || '',
    checkInTime: '14:00',
    checkOutDate: '',     
    checkOutTime: '11:00',
    
    // 🌟 STEP 2: Inject the dynamically calculated nights!
    nights: defaultNights, 
    
    costPerNight: 0, 
    numRooms: 1,
    roomOccupancy: [2], 
    customImage: '',
    // @ts-ignore 
    linkedSupplierId: '' 
  });



  const [showSidebar, setShowSidebar] = useState(true);
  const [srmHotels, setSrmHotels] = useState<StayData[]>([]); 
  const fileInputRef = useRef<HTMLInputElement>(null);

// 🌟 STEP 3: The Watcher (Auto-Corrects Nights BOTH Ways)
  // This constantly listens to the Routing page. If the routing nights change 
  // (up OR down), it forces the hotel nights to sync perfectly.
  useEffect(() => {
    // Check if the routing nights differ from the hotel's currently saved nights
    if (defaultNights !== formData.nights) {
      setFormData(prev => ({ ...prev, nights: defaultNights }));
    }
  }, [defaultNights]); // Only trigger this when the routing 'defaultNights' changes

  // Smart Supplier Logic
  const availableSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const basicCheck = s.status === 'Active' && s.services.includes('Stay');
      const cityCheck = s.city.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(s.city.toLowerCase());
      return basicCheck && cityCheck;
    });
  }, [suppliers, city]);

  useEffect(() => {
     if (!formData.linkedSupplierId) { 
        const preferred = availableSuppliers.find(s => s.isPreferred);
        if (preferred) {
           // @ts-ignore
           setFormData(prev => ({ ...prev, linkedSupplierId: preferred.id }));
        }
     }
  }, [availableSuppliers]);

  // @ts-ignore
  const selectedSupplier = suppliers.find(s => s.id === formData.linkedSupplierId);

  // Filter SRM Hotels
  useEffect(() => {
    const loadHotels = async () => {
      const allStays = await getStays();
      const filtered = allStays.filter(stay => 
          stay.city.toLowerCase().includes(city.toLowerCase()) || 
          city.toLowerCase().includes(stay.city.toLowerCase())
      );
      setSrmHotels(filtered);
    };
    loadHotels();
  }, [city]);
  
  // Auto-calculate Check-out
  useEffect(() => {
    if (formData.checkInDate && formData.nights > 0) {
      const date = new Date(formData.checkInDate);
      date.setDate(date.getDate() + formData.nights);
      const dateStr = date.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, checkOutDate: dateStr }));
    }
  }, [formData.checkInDate, formData.nights]);

  // Sync roomOccupancy
  useEffect(() => {
    const currentRooms = formData.numRooms;
    const currentOccupancy = formData.roomOccupancy || [];
    if (currentOccupancy.length !== currentRooms) {
        const newOccupancy = Array(currentRooms).fill(2).map((_, i) => currentOccupancy[i] || 2);
        setFormData(prev => ({ ...prev, roomOccupancy: newOccupancy }));
    }
  }, [formData.numRooms]);

  // Price Engine Logic (Used for Sidebar display only now)
  const getPriceForDate = (room: RoomCategory, dateString: string): number => {
    if (!dateString || !room || !room.rateCards) return 0;
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const monthIndex = date.getMonth(); 
    const monthKey = MONTH_KEYS[monthIndex];

    const rateCard = room.rateCards.find((rc: { year: number; }) => rc.year === year);
    // @ts-ignore
    return rateCard ? (rateCard.rates[monthKey] || 0) : 0;
  };

  

  const handleChange = (field: keyof Stay, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  // --- CLEAR STAY LOGIC ---
  const handleClearStay = () => {
    setFormData(prev => ({
      ...prev,
      hotelName: '',
      description: '',
      rating: '4.5',
      customImage: '',
      roomCategory: 'Standard Room',
      address: city,
      linkedSupplierId: ''
    }));
    setShowSidebar(true);
  };

  const handleRoomOccupancyChange = (index: number, value: number) => {
    const newOccupancy = [...(formData.roomOccupancy || [])];
    newOccupancy[index] = value;
    setFormData(prev => ({ ...prev, roomOccupancy: newOccupancy }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, customImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSrmHotel = (hotel: StayData) => {
    const selectedRoom = hotel.roomCategories[0];
    // We don't set costPerNight here anymore as it's handled in Costing

    setFormData(prev => ({
      ...prev,
      hotelName: hotel.name,
      rating: hotel.rating.toString(),
      category: hotel.type,
      stayType: 'Luxury', 
      description: hotel.description || `Located in ${hotel.city}, ${hotel.country}.`,
      address: hotel.address || `${hotel.city}, ${hotel.country}`,
      customImage: hotel.images?.[0] || '',
      roomCategory: selectedRoom?.name || 'Standard Room',
      // costPerNight remains 0 or unchanged
    }));

    if (window.innerWidth < 768) setShowSidebar(false);
  };

  const totalPax = (formData.roomOccupancy || []).reduce((a, b) => a + b, 0);

  return (
    <div className="relative flex h-full w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-300">
      
      {/* --- LEFT SIDE: MAIN FORM --- */}
      <div className="flex-1 flex flex-col h-full bg-white relative z-10">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
               <Building2 className="text-purple-600" size={20}/>
               {initialData ? 'Edit Stay' : 'Add New Stay'}
            </h2>
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <span className="font-semibold text-purple-600">{city}</span>
              <span>•</span>
              <span>Check-in: {formData.checkInDate}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={onCancel} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button onClick={() => onSave(formData)} className="px-6 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md transition-all flex items-center gap-2">
              <Save size={16} /> Save Stay
            </button>
          </div>
        </div>

        {/* SCROLLABLE FORM BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* SECTION A: HOTEL DETAILS */}
          <section className="space-y-4">
 
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Stay Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.hotelName}
                    onChange={(e) => handleChange('hotelName', e.target.value)}
                    placeholder="Select from sidebar or type..."
                    className="w-full p-3 bg-purple-50 border border-purple-100 rounded-lg text-sm font-bold text-gray-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>
                
                {formData.hotelName ? (
                    <button 
                        onClick={handleClearStay} 
                        className="mt-6 px-3 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm flex items-center justify-center" 
                        title="Clear Stay"
                    >
                        <X size={20} />
                    </button>
                ) : (
                    <button 
                       onClick={() => setShowSidebar(true)}
                       className="mt-6 px-3 py-2.5 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors shadow-sm flex items-center justify-center"
                       title="View SRM Inventory"
                    >
                      <PlusCircle size={20} />
                    </button>
                )}
              </div>

              <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                     <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none">
                        {HOTEL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </div>
                  <div className="col-span-4">
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
                     <select value={formData.stayType} onChange={(e) => handleChange('stayType', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none">
                        {HOTEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                  </div>
                  <div className="col-span-4">
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Rating</label>
                     <div className="flex items-center gap-1 bg-white border border-gray-200 p-2 rounded-lg">
                        <Star size={14} className="text-yellow-500 fill-yellow-500"/>
                        <input type="number" step="0.5" max="5" value={formData.rating} onChange={(e) => handleChange('rating', e.target.value)} className="w-full outline-none text-sm font-bold text-gray-700"/>
                     </div>
                  </div>
              </div>
              
              <div className="grid grid-cols-12 gap-4">
                 <div className="col-span-8">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                    <textarea 
                       rows={3} 
                       value={formData.description}
                       onChange={(e) => handleChange('description', e.target.value)}
                       className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm resize-none outline-none"
                       placeholder="Short description of the property..."
                    />
                 </div>
                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="col-span-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 bg-cover bg-center"
                    style={{ backgroundImage: `url(${formData.customImage})` }}
                 >
                    {!formData.customImage && <span className="text-xs text-gray-400">Upload Image</span>}
                    <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
                 </div>
              </div>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION B: ROOM CONFIG */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <BedDouble size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Room Category</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Room Category Name</label>
                  <input type="text" value={formData.roomCategory} onChange={(e) => handleChange('roomCategory', e.target.value)} placeholder="e.g. Standard Room" className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none"/>
               </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION C: DATES & CONFIG (COST REMOVED) */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 text-green-600 mb-2">
              <Wallet size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Dates & Configuration</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-5">
               {/* Packaging Status */}
               <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Packaging Status</label>
                <div className="grid grid-cols-3 gap-3">
                  <div onClick={() => handleChange('inclusionType', 'included')} className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.inclusionType === 'included' ? 'bg-green-50 border-green-500 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                    <CheckCircle2 size={20} className={formData.inclusionType === 'included' ? "text-green-600" : "text-gray-400"} />
                    <span className={`text-xs font-bold ${formData.inclusionType === 'included' ? "text-green-700" : "text-gray-500"}`}>Included</span>
                  </div>
                  <div onClick={() => handleChange('inclusionType', 'excluded')} className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.inclusionType === 'excluded' ? 'bg-red-50 border-red-500 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                    <Ban size={20} className={formData.inclusionType === 'excluded' ? "text-red-600" : "text-gray-400"} />
                    <span className={`text-xs font-bold ${formData.inclusionType === 'excluded' ? "text-red-700" : "text-gray-500"}`}>Excluded</span>
                  </div>
                   <div onClick={() => handleChange('inclusionType', 'optional')} className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.inclusionType === 'optional' ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                    <PlusSquare size={20} className={formData.inclusionType === 'optional' ? "text-blue-600" : "text-gray-400"} />
                    <span className={`text-xs font-bold ${formData.inclusionType === 'optional' ? "text-blue-700" : "text-gray-500"}`}>Optional</span>
                  </div>
                </div>
              </div>

               {/* Date Row */}
               <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-4">
                     <label className="text-[10px] uppercase font-bold text-gray-500">Check-In</label>
                     <input type="date" value={formData.checkInDate} onChange={(e) => handleChange('checkInDate', e.target.value)} className="w-full p-2 border rounded text-xs font-bold"/>
                  </div>
                  <div className="col-span-2">
                     <label className="text-[10px] uppercase font-bold text-gray-500">Time</label>
                     <input type="time" value={formData.checkInTime} onChange={(e) => handleChange('checkInTime', e.target.value)} className="w-full p-2 border rounded text-xs"/>
                  </div>
                  <div className="col-span-2">
                     <label className="text-[10px] uppercase font-bold text-gray-500 text-center block">Nights</label>
                     <input type="number" min="1" value={formData.nights} onChange={(e) => handleChange('nights', parseInt(e.target.value) || 1)} className="w-full p-2 border border-purple-300 bg-purple-50 text-purple-700 font-bold rounded text-xs text-center"/>
                  </div>
                  <div className="col-span-4">
                     <label className="text-[10px] uppercase font-bold text-gray-500">Check-Out</label>
                     <input type="date" value={formData.checkOutDate} readOnly className="w-full p-2 bg-gray-100 border rounded text-xs text-gray-500"/>
                  </div>
               </div>

               {/* Room Quantity (No Price) */}
               {formData.inclusionType !== 'excluded' && (
                 <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Total Rooms</label>
                            <input 
                              type="number" 
                              min="1" 
                              value={formData.numRooms} 
                              onChange={(e) => handleChange('numRooms', parseInt(e.target.value) || 1)} 
                              className="w-full p-2 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        {/* Cost Per Room input REMOVED */}
                        {/* Total Cost Box REMOVED */}
                    </div>

                    {/* Room Breakdown List (Prices removed from list) */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                           <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
                              <Users size={12}/> Occupancy Breakdown
                           </label>
                           <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold">Total Pax: {totalPax}</span>
                        </div>
                        
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                           {(formData.roomOccupancy || []).map((pax, index) => (
                              <div key={index} className="flex items-center gap-3 text-sm">
                                  <span className="text-xs font-bold text-gray-700 w-16">Room {index + 1}:</span>
                                  <div className="flex items-center gap-2 flex-1">
                                      <input 
                                        type="number" 
                                        min="1" 
                                        max="4"
                                        value={pax} 
                                        onChange={(e) => handleRoomOccupancyChange(index, parseInt(e.target.value) || 1)}
                                        className="w-16 p-1 text-center border border-gray-300 rounded text-xs font-bold"
                                      />
                                      <span className="text-xs text-gray-700">Person(s)</span>
                                  </div>
                                  {/* PP Cost Display REMOVED */}
                              </div>
                           ))}
                        </div>
                    </div>
                 </div>
               )}
            </div>
          </section>
        </div>
      </div>

      {/* --- RIGHT SIDE: SIDEBAR (UNCHANGED from your original code) --- */}
      <div 
        className={`absolute top-0 right-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col transition-transform duration-300 z-20 ${
            showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
          <div className="p-4 bg-purple-600 text-white flex justify-between items-center shrink-0">
             <div>
                <h3 className="text-xs font-bold opacity-80 uppercase">Available Stays</h3>
                <div className="font-bold text-sm">{city}</div>
                <div className="text-[10px] opacity-70">Showing rates for {formData.checkInDate}</div>
             </div>
             <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-purple-700 rounded text-white">
                <X size={16} />
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
             {srmHotels.length === 0 ? (
                 <div className="text-center p-6 text-gray-400 text-sm">
                    <Building2 className="mx-auto mb-2 opacity-50" size={32} />
                    No hotels found in SRM for {city}.
                 </div>
             ) : (
                 srmHotels.map((item, i) => {
                    const displayPrice = item.roomCategories?.[0] 
                        ? getPriceForDate(item.roomCategories[0], formData.checkInDate) 
                        : 0;

                    return (
                        <div key={item.id} onClick={() => selectSrmHotel(item)} className="bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-purple-500 group overflow-hidden">
                            <div className="h-24 bg-gray-200 relative">
                                {item.images?.[0] ? (
                                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover"/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={24}/></div>
                                )}
                                <div className="absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow">
                                <Star size={10} className="text-yellow-500 fill-yellow-500"/> {item.rating}
                                </div>
                            </div>
                            <div className="p-3">
                                <div className="font-bold text-gray-800 text-sm group-hover:text-purple-600 truncate">{item.name}</div>
                                <div className="flex justify-between items-center mt-1">
                                <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">{item.type}</span>
                                {/* Price Display REMOVED from Sidebar for consistency */}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 truncate"><MapPin size={10}/> {item.address || item.city}</p>
                            </div>
                        </div>
                    )
                 })
             )}
          </div>
      </div>
    </div>
  );
}