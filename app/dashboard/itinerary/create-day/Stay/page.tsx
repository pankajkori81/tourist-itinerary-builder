

// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   X, Save, MapPin, Building2, PlusCircle, 
//   Wallet, Calendar, Clock, Star, BedDouble, Utensils
// } from 'lucide-react';
// import { 
//   Stay, HOTEL_CATEGORIES, HOTEL_TYPES, MEAL_PLANS, RECOMMENDED_HOTELS 
// } from '../constants/daywiseConstants';

// interface StayFormProps {
//   initialData?: Stay;
//   city: string;
//   dayDate: string;
//   onSave: (data: Stay) => void;
//   onCancel: () => void;
// }

// export default function StayForm({ initialData, city, dayDate, onSave, onCancel }: StayFormProps) {
  
//   // --- 1. STATE ---
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
    
//     mealPlan: 'Breakfast',
    
//     checkInDate: dayDate || '',
//     checkInTime: '14:00',
//     checkOutDate: '',     
//     checkOutTime: '11:00',
//     nights: 1,
    
//     costPerNight: 0,
//     numRooms: 1,
    
//     customImage: '',
//   });

//   const [showSidebar, setShowSidebar] = useState(true);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const recommendedList = RECOMMENDED_HOTELS[city] || RECOMMENDED_HOTELS['default'];

//   // --- 2. EFFECTS ---
  
//   // Auto-calculate Check-out based on nights
//   useEffect(() => {
//     if (formData.checkInDate && formData.nights > 0) {
//       const date = new Date(formData.checkInDate);
//       date.setDate(date.getDate() + formData.nights);
//       // Format YYYY-MM-DD
//       const dateStr = date.toISOString().split('T')[0];
//       setFormData(prev => ({ ...prev, checkOutDate: dateStr }));
//     }
//   }, [formData.checkInDate, formData.nights]);

//   // --- 3. HANDLERS ---
//   const handleChange = (field: keyof Stay, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
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

//   const selectRecommended = (hotel: any) => {
//     setFormData(prev => ({
//       ...prev,
//       hotelName: hotel.name,
//       rating: hotel.rating.toString(),
//       customImage: hotel.image,
//       address: hotel.address,
//       description: `Located at ${hotel.address}. Excellent choice for stay.`,
//       // Auto-fill cost if available in constants, else keep 0
//       costPerNight: hotel.price || prev.costPerNight,
//       stayType: hotel.type || 'Standard'
//     }));
//     // On mobile, maybe close sidebar
//     if (window.innerWidth < 768) setShowSidebar(false);
//   };

//   const calculateTotal = () => {
//     return formData.costPerNight * formData.numRooms * formData.nights;
//   };

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
          
//           {/* --- SECTION A: HOTEL DETAILS --- */}
//           <section className="space-y-4">
//              {/* Hotel Name Input + Sidebar Toggle */}
//              <div className="flex gap-2">
//                 <div className="flex-1">
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Stay Name <span className="text-red-500">*</span></label>
//                   <input 
//                     type="text" 
//                     value={formData.hotelName}
//                     onChange={(e) => handleChange('hotelName', e.target.value)}
//                     placeholder="e.g. The Taj Mahal Hotel"
//                     className="w-full p-3 bg-purple-50 border border-purple-100 rounded-lg text-sm font-bold text-gray-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
//                   />
//                 </div>
//                 <button 
//                    onClick={() => setShowSidebar(!showSidebar)}
//                    className={`mt-6 px-3 border rounded-lg transition-colors ${showSidebar ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-gray-50 text-gray-500'}`}
//                    title="Toggle Suggestions"
//                 >
//                   <PlusCircle size={20} />
//                 </button>
//               </div>

//               {/* Grid for Cats/Types */}
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
              
//               {/* Description & Image */}
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

//           {/* --- SECTION B: ROOM CONFIG & MEAL --- */}
//           <section className="space-y-4">
//             <div className="flex items-center gap-2 text-orange-600 mb-2">
//               <BedDouble size={18} />
//               <span className="text-xs font-bold uppercase tracking-wider">Room</span>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//                <div>
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Room Category</label>
//                   <input type="text" value={formData.roomCategory} onChange={(e) => handleChange('roomCategory', e.target.value)} placeholder="e.g. Superior Sea View" className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none"/>
//                </div>
             
//             </div>
//           </section>

//           <hr className="border-gray-100" />

//           {/* --- SECTION C: DATES & COSTING --- */}
//           <section className="space-y-4">
//              <div className="flex items-center gap-2 text-green-600 mb-2">
//               <Wallet size={18} />
//               <span className="text-xs font-bold uppercase tracking-wider">Dates & Costing</span>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                {/* Date Row */}
//                <div className="grid grid-cols-12 gap-3 items-end mb-4">
//                   <div className="col-span-4">
//                      <label className="text-[10px] uppercase font-bold text-gray-500">Check-In</label>
//                      <input type="date" value={formData.checkInDate} onChange={(e) => handleChange('checkInDate', e.target.value)} className="w-full p-1.5 border rounded text-xs font-bold"/>
//                   </div>
//                   <div className="col-span-2">
//                      <label className="text-[10px] uppercase font-bold text-gray-500">Time</label>
//                      <input type="time" value={formData.checkInTime} onChange={(e) => handleChange('checkInTime', e.target.value)} className="w-full p-1.5 border rounded text-xs"/>
//                   </div>
//                   <div className="col-span-2">
//                      <label className="text-[10px] uppercase font-bold text-gray-500 text-center block">Nights</label>
//                      <input type="number" min="1" value={formData.nights} onChange={(e) => handleChange('nights', parseInt(e.target.value) || 1)} className="w-full p-1.5 border border-purple-300 bg-purple-50 text-purple-700 font-bold rounded text-xs text-center"/>
//                   </div>
//                   <div className="col-span-4">
//                      <label className="text-[10px] uppercase font-bold text-gray-500">Check-Out</label>
//                      <input type="date" value={formData.checkOutDate} readOnly className="w-full p-1.5 bg-gray-100 border rounded text-xs text-gray-500"/>
//                   </div>
//                </div>

//                {/* Cost Row */}
//                <div className="grid grid-cols-12 gap-4">
//                   <div className="col-span-4">
//                      <label className="block text-xs font-semibold text-gray-500 mb-1">No. of Rooms</label>
//                      <input type="number" min="1" value={formData.numRooms} onChange={(e) => handleChange('numRooms', parseInt(e.target.value) || 1)} className="w-full p-2 border border-gray-200 rounded-lg text-sm font-semibold"/>
//                   </div>
//                   <div className="col-span-4">
//                      <label className="block text-xs font-semibold text-gray-500 mb-1">Cost Per Room (Night)</label>
//                      <div className="relative">
//                         <span className="absolute left-2 top-3 text-gray-700 text-xs">$</span>
//                         <input type="number" value={formData.costPerNight} onChange={(e) => handleChange('costPerNight', parseFloat(e.target.value) || 0)} className="w-full pl-5 p-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-800"/>
//                      </div>
//                   </div>
//                   <div className="col-span-4 flex flex-col justify-end">
//                      <div className="bg-green-100 p-2 rounded-lg border border-green-200 text-center">
//                         <div className="text-[10px] text-green-600 font-bold uppercase">Total Stay Cost</div>
//                         <div className="text-lg font-bold text-green-800">${calculateTotal().toLocaleString()}</div>
//                      </div>
//                   </div>
//                </div>
//                <p className="text-[10px] text-gray-400 mt-2">* Cost includes selected Meal Plan for all rooms and nights.</p>
//             </div>
//           </section>

//         </div>
//       </div>

//       {/* --- RIGHT SIDE: SIDEBAR --- */}
//       <div 
//         className={`absolute top-0 right-0 bottom-0 w-80 bg-white border-l border-gray-300 shadow-2xl z-20 transition-transform duration-300 ease-in-out transform flex flex-col ${
//             showSidebar ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//           <div className="p-4 bg-purple-600 text-white flex justify-between items-center shrink-0">
//              <div>
//                 <h3 className="text-xs font-bold opacity-80 uppercase">Recommended Stays</h3>
//                 <div className="font-bold text-sm">{city}</div>
//              </div>
//              <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-purple-700 rounded text-white">
//                 <X size={16} />
//              </button>
//           </div>
          
//           <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
//              {recommendedList.map((item, i) => (
//                 <div key={i} onClick={() => selectRecommended(item)} className="bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-purple-500 group overflow-hidden">
//                     <div className="h-24 bg-gray-200 relative">
//                         <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
//                         <div className="absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow">
//                            <Star size={10} className="text-yellow-500 fill-yellow-500"/> {item.rating}
//                         </div>
//                     </div>
//                     <div className="p-3">
//                         <div className="font-bold text-gray-800 text-sm group-hover:text-purple-600">{item.name}</div>
//                         <div className="flex justify-between items-center mt-1">
//                            <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">{item.type}</span>
//                            <span className="text-xs font-bold text-green-700">${item.price} <span className="text-[9px] font-normal text-gray-400">/night</span></span>
//                         </div>
//                         <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10}/> {item.address}</p>
//                     </div>
//                 </div>
//              ))}
//           </div>
//       </div>

//     </div>
//   );
// } 




























// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   X, Save, MapPin, Building2, PlusCircle, 
//   Wallet, BedDouble, Star, 
//   CheckCircle2, Ban, PlusSquare // Added new icons
// } from 'lucide-react';
// import { 
//   Stay, HOTEL_CATEGORIES, HOTEL_TYPES, RECOMMENDED_HOTELS 
// } from '../constants/daywiseConstants';

// interface StayFormProps {
//   initialData?: Stay;
//   city: string;
//   dayDate: string;
//   onSave: (data: Stay) => void;
//   onCancel: () => void;
// }

// export default function StayForm({ initialData, city, dayDate, onSave, onCancel }: StayFormProps) {
  
//   // --- 1. STATE ---
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
   
    
//     // NEW FIELD
//     inclusionType: 'included',

//     checkInDate: dayDate || '',
//     checkInTime: '14:00',
//     checkOutDate: '',     
//     checkOutTime: '11:00',
//     nights: 1,
    
//     costPerNight: 0,
//     numRooms: 1,
    
//     customImage: '',
//   });

//   const [showSidebar, setShowSidebar] = useState(true);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const recommendedList = RECOMMENDED_HOTELS[city] || RECOMMENDED_HOTELS['default'];

//   // --- 2. EFFECTS ---
  
//   // Auto-calculate Check-out based on nights
//   useEffect(() => {
//     if (formData.checkInDate && formData.nights > 0) {
//       const date = new Date(formData.checkInDate);
//       date.setDate(date.getDate() + formData.nights);
//       // Format YYYY-MM-DD
//       const dateStr = date.toISOString().split('T')[0];
//       setFormData(prev => ({ ...prev, checkOutDate: dateStr }));
//     }
//   }, [formData.checkInDate, formData.nights]);

//   // --- 3. HANDLERS ---
//   const handleChange = (field: keyof Stay, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
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

//   const selectRecommended = (hotel: any) => {
//     setFormData(prev => ({
//       ...prev,
//       hotelName: hotel.name,
//       rating: hotel.rating.toString(),
//       customImage: hotel.image,
//       address: hotel.address,
//       description: `Located at ${hotel.address}. Excellent choice for stay.`,
//       costPerNight: hotel.price || prev.costPerNight,
//       stayType: hotel.type || 'Standard'
//     }));
//     if (window.innerWidth < 768) setShowSidebar(false);
//   };

//   const calculateTotal = () => {
//     return formData.costPerNight * formData.numRooms * formData.nights;
//   };

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
          
//           {/* --- SECTION A: HOTEL DETAILS --- */}
//           <section className="space-y-4">
//              {/* Hotel Name Input + Sidebar Toggle */}
//              <div className="flex gap-2">
//                 <div className="flex-1">
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Stay Name <span className="text-red-500">*</span></label>
//                   <input 
//                     type="text" 
//                     value={formData.hotelName}
//                     onChange={(e) => handleChange('hotelName', e.target.value)}
//                     placeholder="e.g. The Taj Mahal Hotel"
//                     className="w-full p-3 bg-purple-50 border border-purple-100 rounded-lg text-sm font-bold text-gray-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
//                   />
//                 </div>
//                 <button 
//                    onClick={() => setShowSidebar(!showSidebar)}
//                    className={`mt-6 px-3 border rounded-lg transition-colors ${showSidebar ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-gray-50 text-gray-500'}`}
//                    title="Toggle Suggestions"
//                 >
//                   <PlusCircle size={20} />
//                 </button>
//               </div>

//               {/* Grid for Cats/Types */}
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
              
//               {/* Description & Image */}
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

//           {/* --- SECTION B: ROOM CONFIG & MEAL --- */}
//           <section className="space-y-4">
//             <div className="flex items-center gap-2 text-orange-600 mb-2">
//               <BedDouble size={18} />
//               <span className="text-xs font-bold uppercase tracking-wider">Room</span>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//                <div>
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Room Category</label>
//                   <input type="text" value={formData.roomCategory} onChange={(e) => handleChange('roomCategory', e.target.value)} placeholder="e.g. Superior Sea View" className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none"/>
//                </div>
//                {/* You can add meal plan here if needed, or keeping it implicit as per previous code */}
//             </div>
//           </section>

//           <hr className="border-gray-100" />

//           {/* --- SECTION C: DATES & COSTING (UPDATED) --- */}
//           <section className="space-y-4">
//              <div className="flex items-center gap-2 text-green-600 mb-2">
//               <Wallet size={18} />
//               <span className="text-xs font-bold uppercase tracking-wider">Dates & Costing</span>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-5">
               
//                {/* 1. PACKAGING STATUS (NEW) */}
//                <div>
//                 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Packaging Status</label>
//                 <div className="grid grid-cols-3 gap-3">
                  
//                   {/* INCLUDED */}
//                   <div 
//                     onClick={() => handleChange('inclusionType', 'included')}
//                     className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${
//                       formData.inclusionType === 'included' 
//                         ? 'bg-green-50 border-green-500 shadow-sm' 
//                         : 'bg-white border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <CheckCircle2 size={20} className={formData.inclusionType === 'included' ? "text-green-600" : "text-gray-400"} />
//                     <span className={`text-xs font-bold ${formData.inclusionType === 'included' ? "text-green-700" : "text-gray-500"}`}>Included</span>
//                   </div>

//                   {/* EXCLUDED */}
//                   <div 
//                     onClick={() => handleChange('inclusionType', 'excluded')}
//                     className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${
//                       formData.inclusionType === 'excluded' 
//                         ? 'bg-red-50 border-red-500 shadow-sm' 
//                         : 'bg-white border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <Ban size={20} className={formData.inclusionType === 'excluded' ? "text-red-600" : "text-gray-400"} />
//                     <span className={`text-xs font-bold ${formData.inclusionType === 'excluded' ? "text-red-700" : "text-gray-500"}`}>Excluded</span>
//                   </div>

//                    {/* OPTIONAL */}
//                    <div 
//                     onClick={() => handleChange('inclusionType', 'optional')}
//                     className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${
//                       formData.inclusionType === 'optional' 
//                         ? 'bg-blue-50 border-blue-500 shadow-sm' 
//                         : 'bg-white border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <PlusSquare size={20} className={formData.inclusionType === 'optional' ? "text-blue-600" : "text-gray-400"} />
//                     <span className={`text-xs font-bold ${formData.inclusionType === 'optional' ? "text-blue-700" : "text-gray-500"}`}>Optional</span>
//                   </div>
//                 </div>
//               </div>

//                {/* 2. DATE ROW (ALWAYS VISIBLE) */}
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

//                {/* 3. CONDITIONAL COST ROW */}
//                {formData.inclusionType === 'excluded' ? (
//                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
//                     <Ban className="text-red-400 shrink-0 mt-0.5" size={16} />
//                     <div>
//                         <p className="text-xs font-bold text-red-700">Costing Disabled</p>
//                         <p className="text-xs text-red-600 mt-1">
//                             This stay will be listed in the <strong>Exclusions</strong> section. No costs will be calculated.
//                         </p>
//                     </div>
//                 </div>
//                ) : (
//                  <div className="">
//                     <div className="grid grid-cols-12 gap-4">
//                         <div className="col-span-4">
//                             <label className="block text-xs font-semibold text-gray-500 mb-1">No. of Rooms</label>
//                             <input type="number" min="1" value={formData.numRooms} onChange={(e) => handleChange('numRooms', parseInt(e.target.value) || 1)} className="w-full p-2 border border-gray-200 rounded-lg text-sm font-semibold"/>
//                         </div>
//                         <div className="col-span-4">
//                             <label className="block text-xs font-semibold text-gray-500 mb-1">Cost Per Room (Night)</label>
//                             <div className="relative">
//                                 <span className="absolute left-2 top-3 text-gray-700 text-xs">$</span>
//                                 <input type="number" value={formData.costPerNight} onChange={(e) => handleChange('costPerNight', parseFloat(e.target.value) || 0)} className="w-full pl-5 p-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-800"/>
//                             </div>
//                         </div>
//                         <div className="col-span-4 flex flex-col justify-end">
//                             <div className="bg-green-100 p-2 rounded-lg border border-green-200 text-center">
//                                 <div className="text-[10px] text-green-600 font-bold uppercase">Total Stay Cost</div>
//                                 <div className="text-lg font-bold text-green-800">${calculateTotal().toLocaleString()}</div>
                                
//                             </div>
//                         </div>
//                     </div>
//                     <p className="text-[10px] text-gray-400 mt-2">* Cost includes selected Meal Plan for all rooms and nights.</p>
//                  </div>
//                )}
//             </div>
//           </section>

//         </div>
//       </div>

//       {/* --- RIGHT SIDE: SIDEBAR --- */}
//       <div 
//         className={`absolute top-0 right-0 bottom-0 w-80 bg-white  flex flex-col ${
//             showSidebar ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//           <div className="p-4 bg-purple-600 text-white flex justify-between items-center shrink-0">
//              <div>
//                 <h3 className="text-xs font-bold opacity-80 uppercase">Recommended Stays</h3>
//                 <div className="font-bold text-sm">{city}</div>
//              </div>
//              <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-purple-700 rounded text-white">
//                 <X size={16} />
//              </button>
//           </div>
          
//           <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
//              {recommendedList.map((item, i) => (
//                 <div key={i} onClick={() => selectRecommended(item)} className="bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-purple-500 group overflow-hidden">
//                     <div className="h-24 bg-gray-200 relative">
//                         <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
//                         <div className="absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow">
//                            <Star size={10} className="text-yellow-500 fill-yellow-500"/> {item.rating}
//                         </div>
//                     </div>
//                     <div className="p-3">
//                         <div className="font-bold text-gray-800 text-sm group-hover:text-purple-600">{item.name}</div>
//                         <div className="flex justify-between items-center mt-1">
//                            <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">{item.type}</span>
//                            <span className="text-xs font-bold text-green-700">${item.price} <span className="text-[9px] font-normal text-gray-400">/night</span></span>
//                         </div>
//                         <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10}/> {item.address}</p>
//                     </div>
//                 </div>
//              ))}
//           </div>
//       </div>

//     </div>
//   );
// } 




























// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   X, Save, MapPin, Building2, PlusCircle, 
//   Wallet, BedDouble, Star, 
//   CheckCircle2, Ban, PlusSquare, Users 
// } from 'lucide-react';
// import { 
//   Stay, HOTEL_CATEGORIES, HOTEL_TYPES, RECOMMENDED_HOTELS 
// } from '../constants/daywiseConstants';

// interface StayFormProps {
//   initialData?: Stay;
//   city: string;
//   dayDate: string;
//   onSave: (data: Stay) => void;
//   onCancel: () => void;
// }

// export default function StayForm({ initialData, city, dayDate, onSave, onCancel }: StayFormProps) {
  
//   // --- 1. STATE ---
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
//     // Initialize with 1 room of 2 pax by default
//     roomOccupancy: [2], 
//     customImage: '',
//   });

//   const [showSidebar, setShowSidebar] = useState(true);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const recommendedList = RECOMMENDED_HOTELS[city] || RECOMMENDED_HOTELS['default'];

//   // --- 2. EFFECTS ---
  
//   // Auto-calculate Check-out based on nights
//   useEffect(() => {
//     if (formData.checkInDate && formData.nights > 0) {
//       const date = new Date(formData.checkInDate);
//       date.setDate(date.getDate() + formData.nights);
//       const dateStr = date.toISOString().split('T')[0];
//       setFormData(prev => ({ ...prev, checkOutDate: dateStr }));
//     }
//   }, [formData.checkInDate, formData.nights]);

//   // Sync roomOccupancy array size if numRooms changes manually
//   useEffect(() => {
//     const currentRooms = formData.numRooms;
//     const currentOccupancy = formData.roomOccupancy || [];
    
//     if (currentOccupancy.length !== currentRooms) {
//         // Create new array preserving existing values where possible
//         const newOccupancy = Array(currentRooms).fill(2).map((_, i) => currentOccupancy[i] || 2);
//         setFormData(prev => ({ ...prev, roomOccupancy: newOccupancy }));
//     }
//   }, [formData.numRooms]);

//   // --- 3. HANDLERS ---
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

//   const selectRecommended = (hotel: any) => {
//     setFormData(prev => ({
//       ...prev,
//       hotelName: hotel.name,
//       rating: hotel.rating.toString(),
//       customImage: hotel.image,
//       address: hotel.address,
//       description: `Located at ${hotel.address}. Excellent choice for stay.`,
//       costPerNight: hotel.price || prev.costPerNight,
//       stayType: hotel.type || 'Standard'
//     }));
//     if (window.innerWidth < 768) setShowSidebar(false);
//   };

//   const calculateTotal = () => {
//     return formData.costPerNight * formData.numRooms * formData.nights;
//   };

//   // Helper to sum total pax
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
          
//           {/* --- SECTION A: HOTEL DETAILS (Kept Same) --- */}
//           <section className="space-y-4">
//              <div className="flex gap-2">
//                 <div className="flex-1">
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Stay Name <span className="text-red-500">*</span></label>
//                   <input 
//                     type="text" 
//                     value={formData.hotelName}
//                     onChange={(e) => handleChange('hotelName', e.target.value)}
//                     placeholder="e.g. The Taj Mahal Hotel"
//                     className="w-full p-3 bg-purple-50 border border-purple-100 rounded-lg text-sm font-bold text-gray-800 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
//                   />
//                 </div>
//                 <button 
//                    onClick={() => setShowSidebar(!showSidebar)}
//                    className={`mt-6 px-3 border rounded-lg transition-colors ${showSidebar ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-gray-50 text-gray-500'}`}
//                    title="Toggle Suggestions"
//                 >
//                   <PlusCircle size={20} />
//                 </button>
//               </div>

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

//           {/* --- SECTION B: ROOM CONFIG --- */}
//           <section className="space-y-4">
//             <div className="flex items-center gap-2 text-orange-600 mb-2">
//               <BedDouble size={18} />
//               <span className="text-xs font-bold uppercase tracking-wider">Room Category</span>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//                <div>
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Room Category Name</label>
//                   <input type="text" value={formData.roomCategory} onChange={(e) => handleChange('roomCategory', e.target.value)} placeholder="e.g. Superior Sea View" className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none"/>
//                </div>
//             </div>
//           </section>

//           <hr className="border-gray-100" />

//           {/* --- SECTION C: DATES & COSTING (UPDATED) --- */}
//           <section className="space-y-4">
//              <div className="flex items-center gap-2 text-green-600 mb-2">
//               <Wallet size={18} />
//               <span className="text-xs font-bold uppercase tracking-wider">Dates & Costing</span>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-5">
               
//                {/* 1. PACKAGING STATUS (Included/Excluded) */}
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

//                {/* 2. DATE ROW */}
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

//                {/* 3. DYNAMIC ROOM & OCCUPANCY COSTING (THE MAJOR UPDATE) */}
//                {formData.inclusionType !== 'excluded' && (
//                  <div className="space-y-3">
//                     {/* Top Controls: Rooms & Base Cost */}
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
                        
//                         {/* Total Summary */}
//                         <div className="col-span-4 flex flex-col justify-end">
//                             <div className="bg-green-100 p-2 rounded-lg border border-green-200 text-center">
//                                 <div className="text-[10px] text-green-600 font-bold uppercase">Total Stay Cost</div>
//                                 <div className="text-lg font-bold text-green-800">${calculateTotal().toLocaleString()}</div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* DYNAMIC ROOM BREAKDOWN LIST */}
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
//                         <p className="text-[10px] text-gray-400 mt-2 italic">* Adjust "Total Rooms" above to add/remove rows.</p>
//                     </div>

//                  </div>
//                )}
//             </div>
//           </section>
//         </div>
//       </div>

//       {/* --- RIGHT SIDE: SIDEBAR (Kept Same) --- */}
//       <div 
//         className={`absolute top-0 right-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col transition-transform duration-300 z-20 ${
//             showSidebar ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//           <div className="p-4 bg-purple-600 text-white flex justify-between items-center shrink-0">
//              <div>
//                 <h3 className="text-xs font-bold opacity-80 uppercase">Recommended Stays</h3>
//                 <div className="font-bold text-sm">{city}</div>
//              </div>
//              <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-purple-700 rounded text-white">
//                 <X size={16} />
//              </button>
//           </div>
          
//           <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
//              {recommendedList.map((item, i) => (
//                 <div key={i} onClick={() => selectRecommended(item)} className="bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-purple-500 group overflow-hidden">
//                     <div className="h-24 bg-gray-200 relative">
//                         <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
//                         <div className="absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow">
//                            <Star size={10} className="text-yellow-500 fill-yellow-500"/> {item.rating}
//                         </div>
//                     </div>
//                     <div className="p-3">
//                         <div className="font-bold text-gray-800 text-sm group-hover:text-purple-600">{item.name}</div>
//                         <div className="flex justify-between items-center mt-1">
//                            <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">{item.type}</span>
//                            <span className="text-xs font-bold text-green-700">${item.price} <span className="text-[9px] font-normal text-gray-400">/night</span></span>
//                         </div>
//                         <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10}/> {item.address}</p>
//                     </div>
//                 </div>
//              ))}
//           </div>
//       </div>
//     </div>
//   );
// } 


















"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Save, MapPin, Building2, PlusCircle, 
  Wallet, BedDouble, Star, 
  CheckCircle2, Ban, PlusSquare, Users, Image as ImageIcon
} from 'lucide-react';
import { 
  Stay, HOTEL_CATEGORIES, HOTEL_TYPES 
} from '../constants/daywiseConstants';
// IMPORT SRM UTILS
import { getStays, StayData, RoomCategory } from '@/utils/srmStorage';

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
  
  // --- 1. STATE ---
  const [formData, setFormData] = useState<Stay>(initialData || {
    id: Date.now(),
    type: 'stay',
    hotelName: '',
    description: '',
    address: city,
    rating: '4.5',
    category: 'Hotel',
    stayType: 'Luxury',
    roomCategory: 'Standard Room',
    inclusionType: 'included',
    checkInDate: dayDate || '',
    checkInTime: '14:00',
    checkOutDate: '',     
    checkOutTime: '11:00',
    nights: 1,
    costPerNight: 0,
    numRooms: 1,
    roomOccupancy: [2], 
    customImage: '',
  });

  const [showSidebar, setShowSidebar] = useState(true);
  const [srmHotels, setSrmHotels] = useState<StayData[]>([]); // Store fetched SRM hotels
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 2. EFFECTS ---

  // A. FETCH & FILTER SRM HOTELS
  useEffect(() => {
    // 1. Get all hotels
    const allStays = getStays();
    
    // 2. Filter by City (Loose matching)
    const filtered = allStays.filter(stay => 
        stay.city.toLowerCase().includes(city.toLowerCase()) || 
        city.toLowerCase().includes(stay.city.toLowerCase())
    );
    
    setSrmHotels(filtered);
  }, [city]);
  
  // B. Auto-calculate Check-out based on nights
  useEffect(() => {
    if (formData.checkInDate && formData.nights > 0) {
      const date = new Date(formData.checkInDate);
      date.setDate(date.getDate() + formData.nights);
      const dateStr = date.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, checkOutDate: dateStr }));
    }
  }, [formData.checkInDate, formData.nights]);

  // C. Sync roomOccupancy
  useEffect(() => {
    const currentRooms = formData.numRooms;
    const currentOccupancy = formData.roomOccupancy || [];
    if (currentOccupancy.length !== currentRooms) {
        const newOccupancy = Array(currentRooms).fill(2).map((_, i) => currentOccupancy[i] || 2);
        setFormData(prev => ({ ...prev, roomOccupancy: newOccupancy }));
    }
  }, [formData.numRooms]);

  // --- 3. PRICE ENGINE LOGIC ---
  const getPriceForDate = (room: RoomCategory, dateString: string): number => {
    if (!dateString) return 0;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const monthIndex = date.getMonth(); // 0 = Jan
    const monthKey = MONTH_KEYS[monthIndex];

    // Find the Rate Card for this Year
    const rateCard = room.rateCards.find(rc => rc.year === year);
    
    // Return specific month rate, or 0 if not found
    // @ts-ignore
    return rateCard ? (rateCard.rates[monthKey] || 0) : 0;
  };

  // --- 4. HANDLERS ---
  const handleChange = (field: keyof Stay, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  // --- THE MAGIC: SELECT FROM SIDEBAR ---
  const selectSrmHotel = (hotel: StayData) => {
    // 1. Pick the first room category by default (or the "Standard" one)
    const selectedRoom = hotel.roomCategories[0];
    
    // 2. Calculate Price based on Check-In Date
    const calculatedPrice = selectedRoom 
        ? getPriceForDate(selectedRoom, formData.checkInDate) 
        : 0;

    // 3. Auto-Fill Form
    setFormData(prev => ({
      ...prev,
      hotelName: hotel.name,
      rating: hotel.rating.toString(),
      category: hotel.type, // e.g. Resort
      stayType: 'Luxury', // You might want to add this to SRM later
      description: hotel.description || `Located in ${hotel.city}, ${hotel.country}.`,
      address: hotel.address || `${hotel.city}, ${hotel.country}`,
      customImage: hotel.images?.[0] || '',
      
      // Auto-fill Room & Cost
      roomCategory: selectedRoom?.name || 'Standard Room',
      costPerNight: calculatedPrice
    }));

    if (window.innerWidth < 768) setShowSidebar(false);
  };

  const calculateTotal = () => {
    return formData.costPerNight * formData.numRooms * formData.nights;
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
             <div className="flex gap-2">
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
                <button 
                   onClick={() => setShowSidebar(!showSidebar)}
                   className={`mt-6 px-3 border rounded-lg transition-colors ${showSidebar ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-gray-50 text-gray-500'}`}
                   title="Toggle Hotel List"
                >
                  <PlusCircle size={20} />
                </button>
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

          {/* SECTION C: DATES & COSTING */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 text-green-600 mb-2">
              <Wallet size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Dates & Costing</span>
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

               {/* Dynamic Costing */}
               {formData.inclusionType !== 'excluded' && (
                 <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Total Rooms</label>
                            <input 
                              type="number" 
                              min="1" 
                              value={formData.numRooms} 
                              onChange={(e) => handleChange('numRooms', parseInt(e.target.value) || 1)} 
                              className="w-full p-2 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="col-span-4">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Cost Per Room (Night)</label>
                            <div className="relative">
                                <span className="absolute left-2 top-2.5 text-gray-700 text-xs">$</span>
                                <input 
                                  type="number" 
                                  value={formData.costPerNight} 
                                  onChange={(e) => handleChange('costPerNight', parseFloat(e.target.value) || 0)} 
                                  className="w-full pl-5 p-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-800"
                                />
                            </div>
                        </div>
                        
                        <div className="col-span-4 flex flex-col justify-end">
                            <div className="bg-green-100 p-2 rounded-lg border border-green-200 text-center">
                                <div className="text-[10px] text-green-600 font-bold uppercase">Total Stay Cost</div>
                                <div className="text-lg font-bold text-green-800">${calculateTotal().toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Room Breakdown List */}
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
                                  <div className="text-xs font-mono text-green-900 font-bold">
                                      {formData.costPerNight > 0 
                                        ? `$${((formData.costPerNight * formData.nights) / pax).toFixed(0)} PP` 
                                        : '$0 PP'
                                      }
                                  </div>
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

      {/* --- RIGHT SIDE: SIDEBAR (UPDATED to use SRM Data) --- */}
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
                    // Logic to find lowest price for card display
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
                                <span className="text-xs font-bold text-green-700">
                                    ${displayPrice} <span className="text-[9px] font-normal text-gray-400">/night</span>
                                </span>
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