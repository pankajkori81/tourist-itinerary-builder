// "use client";

// import React, { useState, useEffect } from 'react';
// import { 
//   X, Save, Utensils, MapPin, PlusCircle, 
//   Wallet, Clock, CheckCircle, Info, Car, Star
// } from 'lucide-react';
// import { Meal, RESTAURANT_DATA } from '../constants/daywiseConstants';

// interface MealFormProps {
//   initialData?: Meal;
//   city: string;
//   dayDate: string;
//   onSave: (data: Meal) => void;
//   onCancel: () => void;
// }

// export default function MealForm({ initialData, city, dayDate, onSave, onCancel }: MealFormProps) {
  
//   // --- 1. STATE ---
//   const [formData, setFormData] = useState<Meal>(initialData || {
//     id: Date.now(),
//     type: 'meal',
    
//     restaurantName: '',
//     cuisine: '',
//     rating: '4.0',
//     address: city, // Default to city name

//     mealType: 'Lunch',
//     menuType: 'Buffet',
//     mealTime: '13:00',

//     inclusionType: 'included',
//     adultCost: 0,
//     childCost: 0,

//     description: '',

//     requiresTransfer: false,
//     pickupLocation: '',
//     dropoffLocation: ''
//   });

//   const [showSidebar, setShowSidebar] = useState(true);
  
//   // Get suggestions based on city
//   const restaurantList = RESTAURANT_DATA[city] || RESTAURANT_DATA['default'];

//   // --- 2. HANDLERS ---
//   const handleChange = (field: keyof Meal, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleRestaurantSelect = (resto: any) => {
//     setFormData(prev => ({
//       ...prev,
//       restaurantName: resto.name,
//       cuisine: resto.cuisine,
//       rating: resto.rating,
//       address: resto.address,
//       adultCost: resto.cost || 0, // Auto-suggest cost
//       childCost: (resto.cost ? resto.cost / 2 : 0),
//       description: `Reserved at ${resto.name}. ${resto.cuisine} cuisine.`
//     }));
//     // On mobile, close sidebar automatically
//     if (window.innerWidth < 768) setShowSidebar(false);
//   };

//   const calculateTotal = () => {
//     // Basic calculation logic - assumes 2 adults 0 kids for display, 
//     // real calculation happens in Cost Sheet based on actual pax.
//     return formData.adultCost; 
//   };

//   return (
//     <div className="relative flex h-full w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-300">
      
//       {/* --- LEFT SIDE: MAIN FORM --- */}
//       <div className="flex-1 flex flex-col h-full bg-white relative z-10">
        
//         {/* HEADER */}
//         <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
//           <div>
//             <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//                <Utensils className="text-orange-500" size={20}/>
//                {initialData ? 'Edit Meal' : 'Add New Meal'}
//             </h2>
//             <p className="text-xs text-gray-500 flex items-center gap-2">
//               <span className="font-semibold text-orange-600">{city}</span>
//               <span>•</span>
//               <span>{dayDate}</span>
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button onClick={onCancel} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
//               Cancel
//             </button>
//             <button onClick={() => onSave(formData)} className="px-6 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-md transition-all flex items-center gap-2">
//               <Save size={16} /> Save Meal
//             </button>
//           </div>
//         </div>

//         {/* SCROLLABLE FORM BODY */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
//           {/* --- SECTION A: RESTAURANT & TIMING (The "Where") --- */}
//           <section className="space-y-4">
//              <div className="flex gap-2">
//                 <div className="flex-1">
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Restaurant Name <span className="text-red-500">*</span></label>
//                   <input 
//                     type="text" 
//                     value={formData.restaurantName}
//                     onChange={(e) => handleChange('restaurantName', e.target.value)}
//                     placeholder="Search or Type Name..."
//                     className="w-full p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm font-bold text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
//                   />
//                   {/* Read-Only Auto-Filled Details */}
//                   {formData.restaurantName && (
//                       <div className="flex gap-3 mt-2 text-[12px] text-gray-500 pl-1">
//                           <span className="flex items-center gap-1"><MapPin size={10}/> {formData.address}</span>
//                           <span className="flex items-center gap-1"><Star size={10} className="text-yellow-500 fill-yellow-500"/> {formData.rating}</span>
//                           <span className="flex items-center gap-1 bg-gray-100 px-1.5 rounded text-gray-700">{formData.cuisine}</span>
//                       </div>
//                   )}
//                 </div>
//                 <button 
//                    onClick={() => setShowSidebar(!showSidebar)}
//                    className={`mt-6 px-3 border rounded-lg transition-colors ${showSidebar ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-gray-50 text-gray-500'}`}
//                    title="Toggle Suggestions"
//                 >
//                   <PlusCircle size={20} />
//                 </button>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                  <div>
//                     <label className="block text-xs font-semibold text-gray-500 mb-1">Meal Type</label>
//                     <select value={formData.mealType} onChange={(e) => handleChange('mealType', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium outline-none">
//                        <option value="Breakfast">Breakfast</option>
//                        <option value="Lunch">Lunch</option>
//                        <option value="Dinner">Dinner</option>
//                        <option value="High Tea">High Tea</option>
//                     </select>
//                  </div>
//                  <div>
//                     <label className="block text-xs font-semibold text-gray-500 mb-1">Start Time</label>
//                     <input type="time" value={formData.mealTime} onChange={(e) => handleChange('mealTime', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none"/>
//                  </div>
//               </div>
//           </section>

//           <hr className="border-gray-100" />

//           {/* --- SECTION B: MENU & COSTING (The "What") --- */}
//           <section className="space-y-4">
//             <div className="flex items-center gap-2 text-green-600 mb-2">
//               <Wallet size={18} />
//               <span className="text-xs font-bold uppercase tracking-wider">Menu & Inclusions</span>
//             </div>

//             <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-5">
               
//                {/* Row 1: Type & Menu */}
//                <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Payment Status</label>
//                     <div className="flex gap-2">
//                         <button 
//                             onClick={() => handleChange('inclusionType', 'included')}
//                             className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${formData.inclusionType === 'included' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-500 border-gray-200'}`}
//                         >
//                             Included (Pre-paid)
//                         </button>
//                         <button 
//                             onClick={() => handleChange('inclusionType', 'optional')}
//                             className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${formData.inclusionType === 'optional' ? 'bg-gray-700 text-white border-gray-700' : 'bg-white text-gray-500 border-gray-200'}`}
//                         >
//                             Direct Payment
//                         </button>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Menu Style</label>
//                     <select value={formData.menuType} onChange={(e) => handleChange('menuType', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-medium outline-none">
//                        <option value="Buffet">Buffet</option>
//                        <option value="Fixed Menu">Fixed Menu (Thali/Set)</option>
//                        <option value="A La Carte">A La Carte</option>
//                     </select>
//                   </div>
//                </div>

//                {/* Row 2: Costing (Only show if Included) */}
//                {formData.inclusionType === 'included' && (
//                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">Adult Cost (PP)</label>
//                         <div className="relative">
//                            <span className="absolute left-3 top-3 text-gray-700 text-xs">$</span>
//                            <input type="number" value={formData.adultCost} onChange={(e) => handleChange('adultCost', parseFloat(e.target.value) || 0)} className="w-full pl-6 p-2 bg-white border border-green-200 rounded-lg text-sm font-bold outline-none focus:border-green-500"/>
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-gray-600 mb-1">Child Cost (PP)</label>
//                         <div className="relative">
//                            <span className="absolute left-3 top-3 text-gray-700 text-xs">$</span>
//                            <input type="number" value={formData.childCost} onChange={(e) => handleChange('childCost', parseFloat(e.target.value) || 0)} className="w-full pl-6 p-2 bg-white border border-green-200 rounded-lg text-sm font-bold outline-none focus:border-green-500"/>
//                         </div>
//                       </div>
//                    </div>
//                )}
//             </div>
            
//             <div>
//                <label className="block text-xs font-semibold text-gray-500 mb-1">Notes / Special Instructions</label>
//                <textarea 
//                   rows={2}
//                   value={formData.description}
//                   onChange={(e) => handleChange('description', e.target.value)}
//                   placeholder="e.g. Jain Food Required, Table by Window..."
//                   className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:border-orange-500 outline-none resize-none"
//                />
//             </div>
//           </section>

//           <hr className="border-gray-100" />

//           {/* --- SECTION C: LOGISTICS (The "Details") --- */}
//           <section className="space-y-4">
//              <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 text-purple-600">
//                     <Car size={18} />
//                     <span className="text-xs font-bold uppercase tracking-wider">Transfer Details</span>
//                 </div>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                     <input 
//                         type="checkbox" 
//                         checked={formData.requiresTransfer} 
//                         onChange={(e) => handleChange('requiresTransfer', e.target.checked)}
//                         className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
//                     />
//                     <span className="text-xs font-bold text-gray-600">Requires Cab?</span>
//                 </label>
//              </div>
             
//              {formData.requiresTransfer && (
//                  <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg animate-in fade-in">
//                     <div>
//                         <label className="block text-xs font-semibold text-gray-500 mb-1">Pickup Location</label>
//                         <input type="text" value={formData.pickupLocation} onChange={(e) => handleChange('pickupLocation', e.target.value)} placeholder="e.g. Hotel" className="w-full p-2 bg-white border border-purple-200 rounded-lg text-sm outline-none"/>
//                     </div>
//                     <div>
//                         <label className="block text-xs font-semibold text-gray-500 mb-1">Drop Location</label>
//                         <input type="text" value={formData.dropoffLocation} onChange={(e) => handleChange('dropoffLocation', e.target.value)} placeholder="e.g. Next Activity" className="w-full p-2 bg-white border border-purple-200 rounded-lg text-sm outline-none"/>
//                     </div>
//                  </div>
//              )}
//           </section>

//         </div>
//       </div>

//       {/* --- RIGHT SIDE: SUGGESTIONS --- */}
//       <div 
//         className={`absolute top-0 right-0 bottom-0 w-80 bg-white border-l border-gray-300 shadow-2xl z-20 transition-transform duration-300 ease-in-out transform flex flex-col ${
//             showSidebar ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//           <div className="p-4 bg-orange-500 text-white flex justify-between items-center shrink-0">
//              <div>
//                 <h3 className="text-xs font-bold opacity-90 uppercase">Popular Restaurants</h3>
//                 <div className="font-bold text-sm">{city}</div>
//              </div>
//              <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-orange-600 rounded text-white">
//                 <X size={16} />
//              </button>
//           </div>
          
//           <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
//              {restaurantList.map((item, i) => (
//                 <div key={i} onClick={() => handleRestaurantSelect(item)} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-orange-500 group">
//                     <div className="flex justify-between items-start">
//                         <div className="font-bold text-gray-800 text-sm group-hover:text-orange-600">{item.name}</div>
//                         <div className="flex items-center gap-1 text-[10px] font-bold bg-yellow-50 text-yellow-700 px-1.5 rounded border border-yellow-200">
//                              <Star size={8} className="fill-current"/> {item.rating}
//                         </div>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">{item.cuisine}</p>
//                     <div className="mt-2 flex justify-between items-center">
//                         <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{item.type}</span>
//                         <span className="text-xs font-bold text-green-700">~${item.cost}</span>
//                     </div>
//                 </div>
//              ))}
//           </div>
//       </div>

//     </div>
//   );
// } 



























"use client";

import React, { useState } from 'react';
import { 
  X, Save, Utensils, MapPin, PlusCircle, 
  Wallet, Car, Star,
  CheckCircle2, Ban, PlusSquare // Added new icons
} from 'lucide-react';
import { Meal, RESTAURANT_DATA } from '../constants/daywiseConstants';

interface MealFormProps {
  initialData?: Meal;
  city: string;
  dayDate: string;
  onSave: (data: Meal) => void;
  onCancel: () => void;
}

export default function MealForm({ initialData, city, dayDate, onSave, onCancel }: MealFormProps) {
  
  // --- 1. STATE ---
  const [formData, setFormData] = useState<Meal>(initialData || {
    id: Date.now(),
    type: 'meal',
    
    restaurantName: '',
    cuisine: '',
    rating: '4.0',
    address: city,

    mealType: 'Lunch',
    menuType: 'Buffet',
    mealTime: '13:00',

    // Default to included
    inclusionType: 'included',
    
    adultCost: 0,
    childCost: 0,

    description: '',

    requiresTransfer: false,
    pickupLocation: '',
    dropoffLocation: ''
  });

  const [showSidebar, setShowSidebar] = useState(true);
  
  // Get suggestions based on city
  const restaurantList = RESTAURANT_DATA[city] || RESTAURANT_DATA['default'];

  // --- 2. HANDLERS ---
  const handleChange = (field: keyof Meal, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRestaurantSelect = (resto: any) => {
    setFormData(prev => ({
      ...prev,
      restaurantName: resto.name,
      cuisine: resto.cuisine,
      rating: resto.rating,
      address: resto.address,
      adultCost: resto.cost || 0,
      childCost: (resto.cost ? resto.cost / 2 : 0),
      description: `Reserved at ${resto.name}. ${resto.cuisine} cuisine.`
    }));
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  return (
    <div className="relative flex h-full w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-300">
      
      {/* --- LEFT SIDE: MAIN FORM --- */}
      <div className="flex-1 flex flex-col h-full bg-white relative z-10">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
               <Utensils className="text-orange-500" size={20}/>
               {initialData ? 'Edit Meal' : 'Add New Meal'}
            </h2>
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <span className="font-semibold text-orange-600">{city}</span>
              <span>•</span>
              <span>{dayDate}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={onCancel} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button onClick={() => onSave(formData)} className="px-6 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-md transition-all flex items-center gap-2">
              <Save size={16} /> Save Meal
            </button>
          </div>
        </div>

        {/* SCROLLABLE FORM BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* --- SECTION A: RESTAURANT & TIMING (The "Where") --- */}
          <section className="space-y-4">
             <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Restaurant Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.restaurantName}
                    onChange={(e) => handleChange('restaurantName', e.target.value)}
                    placeholder="Search or Type Name..."
                    className="w-full p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm font-bold text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                  {formData.restaurantName && (
                      <div className="flex gap-3 mt-2 text-[12px] text-gray-500 pl-1">
                          <span className="flex items-center gap-1"><MapPin size={10}/> {formData.address}</span>
                          <span className="flex items-center gap-1"><Star size={10} className="text-yellow-500 fill-yellow-500"/> {formData.rating}</span>
                          <span className="flex items-center gap-1 bg-gray-100 px-1.5 rounded text-gray-700">{formData.cuisine}</span>
                      </div>
                  )}
                </div>
                <button 
                   onClick={() => setShowSidebar(!showSidebar)}
                   className={`mt-6 px-3 border rounded-lg transition-colors ${showSidebar ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-gray-50 text-gray-500'}`}
                   title="Toggle Suggestions"
                >
                  <PlusCircle size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Meal Type</label>
                    <select value={formData.mealType} onChange={(e) => handleChange('mealType', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium outline-none">
                       <option value="Breakfast">Breakfast</option>
                       <option value="Lunch">Lunch</option>
                       <option value="Dinner">Dinner</option>
                       <option value="High Tea">High Tea</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Start Time</label>
                    <input type="time" value={formData.mealTime} onChange={(e) => handleChange('mealTime', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none"/>
                 </div>
              </div>
          </section>

          <hr className="border-gray-100" />

          {/* --- SECTION B: MENU & COSTING (The "What") - MAJOR UPDATE --- */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Wallet size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Menu & Inclusions</span>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-6">
               
               {/* 1. PACKAGING STATUS (NEW) */}
               <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Packaging Status</label>
                <div className="grid grid-cols-3 gap-3">
                  
                  {/* INCLUDED */}
                  <div 
                    onClick={() => handleChange('inclusionType', 'included')}
                    className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${
                      formData.inclusionType === 'included' 
                        ? 'bg-green-50 border-green-500 shadow-sm' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CheckCircle2 size={20} className={formData.inclusionType === 'included' ? "text-green-600" : "text-gray-400"} />
                    <span className={`text-xs font-bold ${formData.inclusionType === 'included' ? "text-green-700" : "text-gray-500"}`}>Included</span>
                  </div>

                  {/* EXCLUDED */}
                  <div 
                    onClick={() => handleChange('inclusionType', 'excluded')}
                    className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${
                      formData.inclusionType === 'excluded' 
                        ? 'bg-red-50 border-red-500 shadow-sm' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Ban size={20} className={formData.inclusionType === 'excluded' ? "text-red-600" : "text-gray-400"} />
                    <span className={`text-xs font-bold ${formData.inclusionType === 'excluded' ? "text-red-700" : "text-gray-500"}`}>Excluded</span>
                  </div>

                   {/* OPTIONAL */}
                   <div 
                    onClick={() => handleChange('inclusionType', 'optional')}
                    className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${
                      formData.inclusionType === 'optional' 
                        ? 'bg-blue-50 border-blue-500 shadow-sm' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <PlusSquare size={20} className={formData.inclusionType === 'optional' ? "text-blue-600" : "text-gray-400"} />
                    <span className={`text-xs font-bold ${formData.inclusionType === 'optional' ? "text-blue-700" : "text-gray-500"}`}>Optional</span>
                  </div>
                </div>
              </div>

               {/* 2. MENU & COSTING (CONDITIONAL) */}
               <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Menu Style</label>
                   <select value={formData.menuType} onChange={(e) => handleChange('menuType', e.target.value)} className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-medium outline-none mb-4">
                       <option value="Buffet">Buffet</option>
                       <option value="Fixed Menu">Fixed Menu (Thali/Set)</option>
                       <option value="A La Carte">A La Carte</option>
                   </select>

                   {formData.inclusionType === 'excluded' ? (
                       <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                           <Ban className="text-red-400 shrink-0 mt-0.5" size={16} />
                           <div>
                               <p className="text-xs font-bold text-red-700">Costing Disabled</p>
                               <p className="text-xs text-red-600 mt-1">
                                   This meal will be listed in the <strong>Exclusions</strong> section. No costs will be calculated.
                               </p>
                           </div>
                       </div>
                   ) : (
                       <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Adult Cost (PP)</label>
                            <div className="relative">
                               <span className="absolute left-3 top-3 text-gray-700 text-xs">$</span>
                               <input type="number" value={formData.adultCost} onChange={(e) => handleChange('adultCost', parseFloat(e.target.value) || 0)} className="w-full pl-6 p-2 bg-white border border-green-200 rounded-lg text-sm font-bold outline-none focus:border-green-500"/>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Child Cost (PP)</label>
                            <div className="relative">
                               <span className="absolute left-3 top-3 text-gray-700 text-xs">$</span>
                               <input type="number" value={formData.childCost} onChange={(e) => handleChange('childCost', parseFloat(e.target.value) || 0)} className="w-full pl-6 p-2 bg-white border border-green-200 rounded-lg text-sm font-bold outline-none focus:border-green-500"/>
                            </div>
                          </div>
                       </div>
                   )}
               </div>
            </div>
            
            <div>
               <label className="block text-xs font-semibold text-gray-500 mb-1">Notes / Special Instructions</label>
               <textarea 
                  rows={2}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="e.g. Jain Food Required, Table by Window..."
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:border-orange-500 outline-none resize-none"
               />
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* --- SECTION C: LOGISTICS (The "Details") --- */}
          <section className="space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-600">
                    <Car size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Transfer Details</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={formData.requiresTransfer} 
                        onChange={(e) => handleChange('requiresTransfer', e.target.checked)}
                        className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-xs font-bold text-gray-600">Requires Cab?</span>
                </label>
             </div>
             
             {formData.requiresTransfer && (
                 <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg animate-in fade-in">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Pickup Location</label>
                        <input type="text" value={formData.pickupLocation} onChange={(e) => handleChange('pickupLocation', e.target.value)} placeholder="e.g. Hotel" className="w-full p-2 bg-white border border-purple-200 rounded-lg text-sm outline-none"/>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Drop Location</label>
                        <input type="text" value={formData.dropoffLocation} onChange={(e) => handleChange('dropoffLocation', e.target.value)} placeholder="e.g. Next Activity" className="w-full p-2 bg-white border border-purple-200 rounded-lg text-sm outline-none"/>
                    </div>
                 </div>
             )}
          </section>

        </div>
      </div>

      {/* --- RIGHT SIDE: SUGGESTIONS --- */}
      <div 
        className={`absolute top-0 right-0 bottom-0 w-80 bg-white border-l border-gray-300 shadow-2xl z-20 transition-transform duration-300 ease-in-out transform flex flex-col ${
            showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
          <div className="p-4 bg-orange-500 text-white flex justify-between items-center shrink-0">
             <div>
                <h3 className="text-xs font-bold opacity-90 uppercase">Popular Restaurants</h3>
                <div className="font-bold text-sm">{city}</div>
             </div>
             <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-orange-600 rounded text-white">
                <X size={16} />
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
             {restaurantList.map((item, i) => (
                <div key={i} onClick={() => handleRestaurantSelect(item)} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-orange-500 group">
                    <div className="flex justify-between items-start">
                        <div className="font-bold text-gray-800 text-sm group-hover:text-orange-600">{item.name}</div>
                        <div className="flex items-center gap-1 text-[10px] font-bold bg-yellow-50 text-yellow-700 px-1.5 rounded border border-yellow-200">
                             <Star size={8} className="fill-current"/> {item.rating}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.cuisine}</p>
                    <div className="mt-2 flex justify-between items-center">
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{item.type}</span>
                        <span className="text-xs font-bold text-green-700">~${item.cost}</span>
                    </div>
                </div>
             ))}
          </div>
      </div>

    </div>
  );
}