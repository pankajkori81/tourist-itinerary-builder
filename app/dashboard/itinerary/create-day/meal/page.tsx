

// "use client";

// import React, { useState, useMemo, useEffect } from 'react';
// import { 
//   X, Save, Utensils, MapPin, PlusCircle, 
//   Wallet, Car, Star,
//   CheckCircle2, Ban, PlusSquare, Calculator,
//   Briefcase, Phone, Mail, CreditCard, DollarSign // [CHANGE 1: Added Icons]
// } from 'lucide-react';
// import { Meal } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';
// import { useSRM } from '@/app/context/SRMContext';
// import { MealData } from '@/utils/srmStorage';
// import { useItinerary } from '@/app/context/ItineraryContext';

// interface MealFormProps {
//   initialData?: Meal;
//   city: string;
//   dayDate: string;
//   onSave: (data: Meal) => void;
//   onCancel: () => void;
// }

// export default function MealForm({ initialData, city, dayDate, onSave, onCancel }: MealFormProps) {
  
//   // 1. Get Globals for Defaults
//   const { itineraryData } = useItinerary();
//   // Safe parsing for global counts
//   const globalAdults = typeof itineraryData.adultCount === 'number' ? itineraryData.adultCount : (itineraryData.numberOfTravelers || 2);
//   const globalChildren = typeof itineraryData.childCount === 'number' ? itineraryData.childCount : 0;

//   // [CHANGE 2: Get Suppliers from Context]
//   const { meals, suppliers } = useSRM();

//   const srmSuggestions = useMemo(() => {
//     const normalizedCity = city.trim().toLowerCase();
//     return meals.filter(m => 
//        (m.city || "").toLowerCase() === normalizedCity || 
//        (m.city || "").toLowerCase().includes(normalizedCity)
//     );
//   }, [meals, city]);

//   // 2. Initialize State
//   const [formData, setFormData] = useState<Meal>(() => {
//     if (initialData) {
//       return {
//         ...initialData,
//         paxAdult: typeof initialData.paxAdult === 'number' ? initialData.paxAdult : globalAdults,
//         paxChild: typeof initialData.paxChild === 'number' ? initialData.paxChild : globalChildren,
//         // @ts-ignore
//         linkedSupplierId: initialData.linkedSupplierId || '' 
//       };
//     } else {
//       return {
//         id: Date.now(),
//         type: 'meal',
//         restaurantName: '',
//         cuisine: '',
//         rating: '4.0',
//         address: city,
//         mealType: 'Lunch',
//         menuType: 'Buffet',
//         mealTime: '13:00',
//         inclusionType: 'included',
//         adultCost: 0,
//         childCost: 0,
//         paxAdult: globalAdults,
//         paxChild: globalChildren,
//         description: '',
//         requiresTransfer: false,
//         pickupLocation: '',
//         dropoffLocation: '',
//         // @ts-ignore
//         linkedSupplierId: '' // [CHANGE 3: Initialize Field]
//       };
//     }
//   });

//   const [showSidebar, setShowSidebar] = useState(true);
  
//   // --- [CHANGE 4: SMART SUPPLIER LOGIC] ---
  
//   // A. Filter Suppliers (Must be Active + 'Meal' Service + Match City)
//   const availableSuppliers = useMemo(() => {
//     return suppliers.filter(s => {
//       const basicCheck = s.status === 'Active' && s.services.includes('Meal');
//       const cityCheck = s.city.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(s.city.toLowerCase());
//       return basicCheck && cityCheck;
//     });
//   }, [suppliers, city]);

//   // B. Auto-Select "Preferred" Supplier
//   useEffect(() => {
//      // @ts-ignore
//      if (!formData.linkedSupplierId) {
//         const preferred = availableSuppliers.find(s => s.isPreferred);
//         if (preferred) {
//            // @ts-ignore
//            setFormData(prev => ({ ...prev, linkedSupplierId: preferred.id }));
//         }
//      }
//   }, [availableSuppliers]);

//   // C. Get Selected Supplier Data
//   // @ts-ignore
//   const selectedSupplier = suppliers.find(s => s.id === formData.linkedSupplierId);
//   // ----------------------------------------

//   const handleChange = (field: keyof Meal, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleRestaurantSelect = (srmItem: MealData) => {
//     let derivedAdultCost = 0;
//     let derivedChildCost = 0;
    
//     // Pricing Logic
//     const currentYear = new Date().getFullYear();
//     const rateCard = srmItem.rateCards?.find(rc => rc.year === currentYear) || srmItem.rateCards?.[0];

//     if (rateCard && rateCard.rates) {
//         const firstMonthKey = Object.keys(rateCard.rates)[0];
//         const firstMonth = rateCard.rates[firstMonthKey];
        
//         if(firstMonth) {
//             const isDinner = formData.mealType === 'Dinner';
//             derivedAdultCost = isDinner ? firstMonth.dinnerAdult : firstMonth.lunchAdult;
//             derivedChildCost = isDinner ? firstMonth.dinnerChild : firstMonth.lunchChild;
//         }
//     }

//     setFormData(prev => ({
//       ...prev,
//       restaurantName: srmItem.restaurantName,
//       cuisine: srmItem.cuisine,
//       rating: srmItem.rating,
//       address: srmItem.address || srmItem.city,
//       menuType: srmItem.menuType,
//       adultCost: derivedAdultCost,
//       childCost: derivedChildCost,
//       description: srmItem.inclusions ? `Inclusions: ${srmItem.inclusions}` : prev.description
//     }));

//     if (window.innerWidth < 768) setShowSidebar(false);
//   };

//   // 3. Calculation for UI Display
//   const safeAdults = formData.paxAdult || 0;
//   const safeChildren = formData.paxChild || 0;
//   const totalCost = (formData.adultCost * safeAdults) + (formData.childCost * safeChildren);

//   return (
//     <div className="relative flex h-full w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-300">
      
//       {/* LEFT SIDE FORM */}
//       <div className="flex-1 flex flex-col h-full bg-white relative z-10">
        
//         {/* Header */}
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
//             <button onClick={onCancel} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
//             <button onClick={() => onSave(formData)} className="px-6 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-md flex items-center gap-2">
//               <Save size={16} /> Save Meal
//             </button>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
//           {/* Section A: Restaurant Info */}
//           <section className="space-y-4">
             
//              {/* --- [CHANGE 5: SUPPLIER SECTION INJECTED HERE] --- */}
//              <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex gap-4 items-start mb-2">
//                 <div className="flex-1">
//                     <label className="block text-xs font-bold text-orange-900 mb-2 flex items-center gap-1">
//                         <Briefcase size={14} /> Fulfillment Partner (Meal)
//                     </label>
//                     <select 
//                         className="w-full p-2.5 border border-orange-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500 outline-none"
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
//                         <p className="text-[10px] text-gray-400 mt-1">No 'Meal' suppliers found for {city}.</p>
//                     )}
//                 </div>
                
//                 {/* Intelligence Box */}
//                 {selectedSupplier && (
//                     <div className="flex-1 bg-white p-3 rounded-lg border border-orange-100 shadow-sm text-xs">
//                         <div className="font-bold text-gray-800 mb-2 flex justify-between items-center border-b border-gray-100 pb-1">
//                             <span>{selectedSupplier.contactPerson}</span>
//                             <span className="text-orange-600 bg-orange-50 px-1.5 rounded">{selectedSupplier.paymentTerms}</span>
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
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Restaurant Name <span className="text-red-500">*</span></label>
//                   <input 
//                     type="text" 
//                     value={formData.restaurantName}
//                     onChange={(e) => handleChange('restaurantName', e.target.value)}
//                     className="w-full p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm font-bold text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
//                     placeholder="Search or Type Name..."
//                   />
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

//           {/* SECTION B: COST BREAKDOWN */}
//           <section className="space-y-4">
//             <div className="flex items-center gap-2 text-green-600 mb-2">
//               <Wallet size={18} />
//               <span className="text-xs font-bold uppercase tracking-wider">Menu & Cost Breakdown</span>
//             </div>

//             <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-6">
               
//                {/* 1. Packaging & Menu Style */}
//                <div className="grid grid-cols-12 gap-4">
//                  <div className="col-span-6">
//                     <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Packaging</label>
//                     <div className="grid grid-cols-3 gap-2">
//                       {['included', 'excluded', 'optional'].map((type) => (
//                         <div 
//                           key={type}
//                           // @ts-ignore
//                           onClick={() => handleChange('inclusionType', type)}
//                           className={`cursor-pointer border rounded-lg py-2 flex flex-col items-center justify-center gap-1 transition-all ${
//                             formData.inclusionType === type 
//                               ? (type === 'included' ? 'bg-green-50 border-green-500 text-green-700' : type === 'excluded' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-blue-50 border-blue-500 text-blue-700')
//                               : 'bg-white border-gray-200 hover:border-gray-300 text-gray-400'
//                           }`}
//                         >
//                           {type === 'included' && <CheckCircle2 size={16}/>}
//                           {type === 'excluded' && <Ban size={16}/>}
//                           {type === 'optional' && <PlusSquare size={16}/>}
//                           <span className="text-[10px] font-bold uppercase">{type}</span>
//                         </div>
//                       ))}
//                     </div>
//                  </div>
//                  <div className="col-span-6">
//                     <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Menu Style</label>
//                     {/* @ts-ignore */}
//                     <select value={formData.menuType} onChange={(e) => handleChange('menuType', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium outline-none">
//                        <option value="Buffet">Buffet</option>
//                        <option value="Fixed Menu">Fixed Menu</option>
//                        <option value="A La Carte">A La Carte</option>
//                    </select>
//                  </div>
//                </div>

//                {/* 2. THE PRICING GRID */}
//                {formData.inclusionType === 'excluded' ? (
//                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
//                        <Ban className="text-red-400 shrink-0 mt-0.5" size={16} />
//                        <div>
//                            <p className="text-xs font-bold text-red-700">Costing Disabled</p>
//                            <p className="text-xs text-red-600 mt-1">This meal will appear as an exclusion. No costs will be calculated.</p>
//                        </div>
//                    </div>
//                ) : (
//                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//                       {/* Grid Header */}
//                       <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase py-2 px-4">
//                           <div className="col-span-3">Type</div>
//                           <div className="col-span-3">Rate (PP)</div>
//                           <div className="col-span-3">Pax Count</div>
//                           <div className="col-span-3 text-right">Subtotal</div>
//                       </div>

//                       {/* Adult Row */}
//                       <div className="grid grid-cols-12 items-center py-3 px-4 border-b border-gray-100">
//                           <div className="col-span-3 text-sm font-bold text-gray-800">Adult</div>
//                           <div className="col-span-3 relative">
//                              <span className="absolute left-2 top-2 text-gray-400 text-xs">$</span>
//                              <input 
//                                 type="number" 
//                                 value={formData.adultCost} 
//                                 onChange={(e) => handleChange('adultCost', parseFloat(e.target.value) || 0)} 
//                                 className="w-full pl-5 p-1.5 border border-gray-200 rounded font-bold text-sm outline-none focus:border-green-500"
//                              />
//                           </div>
//                           {/* Binding to paxAdult directly */}
//                           <div className="col-span-3 pl-2">
//                              <input 
//                                 type="number" 
//                                 value={formData.paxAdult} 
//                                 onChange={(e) => handleChange('paxAdult', parseFloat(e.target.value) || 0)} 
//                                 className="w-16 p-1.5 border border-gray-200 rounded font-bold text-sm text-center outline-none focus:border-green-500"
//                              />
//                           </div>
//                           <div className="col-span-3 text-right font-mono font-bold text-gray-700">
//                              ${(formData.adultCost * safeAdults).toLocaleString()}
//                           </div>
//                       </div>

//                       {/* Child Row */}
//                       <div className="grid grid-cols-12 items-center py-3 px-4 border-b border-gray-100 bg-gray-50/30">
//                           <div className="col-span-3 text-sm font-bold text-gray-800">Child</div>
//                           <div className="col-span-3 relative">
//                              <span className="absolute left-2 top-2 text-gray-400 text-xs">$</span>
//                              <input 
//                                 type="number" 
//                                 value={formData.childCost} 
//                                 onChange={(e) => handleChange('childCost', parseFloat(e.target.value) || 0)} 
//                                 className="w-full pl-5 p-1.5 border border-gray-200 rounded font-bold text-sm outline-none focus:border-green-500"
//                              />
//                           </div>
//                           {/* Binding to paxChild directly */}
//                           <div className="col-span-3 pl-2">
//                              <input 
//                                 type="number" 
//                                 value={formData.paxChild} 
//                                 onChange={(e) => handleChange('paxChild', parseFloat(e.target.value) || 0)} 
//                                 className="w-16 p-1.5 border border-gray-200 rounded font-bold text-sm text-center outline-none focus:border-green-500"
//                              />
//                           </div>
//                           <div className="col-span-3 text-right font-mono font-bold text-gray-700">
//                              ${(formData.childCost * safeChildren).toLocaleString()}
//                           </div>
//                       </div>

//                       {/* Total Footer */}
//                       <div className="grid grid-cols-12 items-center py-3 px-4 bg-green-50">
//                           <div className="col-span-9 text-xs font-bold text-green-700 uppercase flex items-center gap-2">
//                               <Calculator size={14}/> Total Estimated Meal Cost
//                           </div>
//                           <div className="col-span-3 text-right font-mono font-bold text-green-700 text-lg">
//                              ${totalCost.toLocaleString()}
//                           </div>
//                       </div>
//                    </div>
//                )}
//             </div>
            
//             {/* Notes */}
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

//           {/* SECTION C: LOGISTICS */}
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

//       {/* RIGHT SIDE: SUGGESTIONS */}
//       <div 
//         className={`absolute top-0 right-0 bottom-0 w-80 bg-white border-l border-gray-300 shadow-2xl z-20 transition-transform duration-300 ease-in-out transform flex flex-col ${
//             showSidebar ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//           <div className="p-4 bg-orange-500 text-white flex justify-between items-center shrink-0">
//              <div>
//                 <h3 className="text-xs font-bold opacity-90 uppercase">SRM Inventory</h3>
//                 <div className="font-bold text-sm">{city}</div>
//              </div>
//              <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-orange-600 rounded text-white">
//                 <X size={16} />
//              </button>
//           </div>
          
//           <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
//              {srmSuggestions.length === 0 ? (
//                 <div className="text-center py-10 text-gray-400">
//                     <Utensils className="mx-auto mb-2 opacity-50"/>
//                     <p className="text-xs">No restaurants found in <br/><strong className="text-gray-600">{city}</strong></p>
//                     <p className="text-[10px] mt-2">Add them in SRM module first.</p>
//                 </div>
//              ) : (
//                 srmSuggestions.map((item) => (
//                     <div key={item.id} onClick={() => handleRestaurantSelect(item)} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-orange-500 group transition-all">
//                         <div className="flex justify-between items-start">
//                             <div className="font-bold text-gray-800 text-sm group-hover:text-orange-600 truncate">{item.restaurantName}</div>
//                             <div className="flex items-center gap-1 text-[10px] font-bold bg-yellow-50 text-yellow-700 px-1.5 rounded border border-yellow-200 shrink-0">
//                                 <Star size={8} className="fill-current"/> {item.rating}
//                             </div>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-1 truncate">{item.cuisine}</p>
                        
//                         {/* Sidebar Pricing Preview */}
//                         <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
//                             <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-100">{item.menuType}</span>
//                             <span className="text-xs font-bold text-green-700">
//                                {/* Safe check for rate display */}
//                                ${item.rateCards?.[0]?.rates?.[Object.keys(item.rateCards?.[0]?.rates || {})[0]]?.lunchAdult || 0}++
//                             </span>
//                         </div>
//                     </div>
//                 ))
//              )}
//           </div>
//       </div>
//     </div>
//   );
// } 


















"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, Save, Utensils, MapPin, PlusCircle, 
  Wallet, Car, Star,
  CheckCircle2, Ban, PlusSquare,
  Briefcase, Phone, Mail, DollarSign 
} from 'lucide-react';
import { Meal } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';
import { useSRM } from '@/app/context/SRMContext';
import { MealData } from '@/utils/srmStorage';
import { useItinerary } from '@/app/context/ItineraryContext';

interface MealFormProps {
  initialData?: Meal;
  city: string;
  dayDate: string;
  onSave: (data: Meal) => void;
  onCancel: () => void;
}

export default function MealForm({ initialData, city, dayDate, onSave, onCancel }: MealFormProps) {
  
  const { itineraryData } = useItinerary();
  // Safe parsing for global counts
  const globalAdults = typeof itineraryData.adultCount === 'number' ? itineraryData.adultCount : (itineraryData.numberOfTravelers || 2);
  const globalChildren = typeof itineraryData.childCount === 'number' ? itineraryData.childCount : 0;

  const { meals, suppliers } = useSRM();

  const srmSuggestions = useMemo(() => {
    const normalizedCity = city.trim().toLowerCase();
    return meals.filter(m => 
       (m.city || "").toLowerCase() === normalizedCity || 
       (m.city || "").toLowerCase().includes(normalizedCity)
    );
  }, [meals, city]);

  // Initialize State
  const [formData, setFormData] = useState<Meal>(() => {
    if (initialData) {
      return {
        ...initialData,
        paxAdult: typeof initialData.paxAdult === 'number' ? initialData.paxAdult : globalAdults,
        paxChild: typeof initialData.paxChild === 'number' ? initialData.paxChild : globalChildren,
        // @ts-ignore
        linkedSupplierId: initialData.linkedSupplierId || '' 
      };
    } else {
      return {
        id: Date.now(),
        type: 'meal',
        restaurantName: '',
        cuisine: '',
        rating: '4.0',
        address: city,
        mealType: 'Lunch',
        menuType: 'Buffet',
        mealTime: '13:00',
        inclusionType: 'included',
        adultCost: 0, // Kept in data, input removed
        childCost: 0, // Kept in data, input removed
        paxAdult: globalAdults,
        paxChild: globalChildren,
        description: '',
        requiresTransfer: false,
        pickupLocation: '',
        dropoffLocation: '',
        // @ts-ignore
        linkedSupplierId: '' 
      };
    }
  });

  const [showSidebar, setShowSidebar] = useState(true);
  
  // Smart Supplier Logic
  const availableSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const basicCheck = s.status === 'Active' && s.services.includes('Meal');
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

  const handleChange = (field: keyof Meal, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRestaurantSelect = (srmItem: MealData) => {
    // We retain the logic to fetch details, but we don't need to calculate cost anymore
    setFormData(prev => ({
      ...prev,
      restaurantName: srmItem.restaurantName,
      cuisine: srmItem.cuisine,
      rating: srmItem.rating,
      address: srmItem.address || srmItem.city,
      menuType: srmItem.menuType,
      // Costs are left as is (0) since they are handled in Costing Sheet
      description: srmItem.inclusions ? `Inclusions: ${srmItem.inclusions}` : prev.description
    }));

    if (window.innerWidth < 768) setShowSidebar(false);
  };

  return (
    <div className="relative flex h-full w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-300">
      
      {/* LEFT SIDE FORM */}
      <div className="flex-1 flex flex-col h-full bg-white relative z-10">
        
        {/* Header */}
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
            <button onClick={onCancel} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
            <button onClick={() => onSave(formData)} className="px-6 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-md flex items-center gap-2">
              <Save size={16} /> Save Meal
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section A: Restaurant Info */}
          <section className="space-y-4">
             
          

             <div className="flex gap-2">
                {/* <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Restaurant Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.restaurantName}
                    onChange={(e) => handleChange('restaurantName', e.target.value)}
                    className="w-full p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm font-bold text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Search or Type Name..."
                  />
                </div> */}

              <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Restaurant Name (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.restaurantName}
                    onChange={(e) => handleChange('restaurantName', e.target.value)}
                    className="w-full p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm font-bold text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Leave blank for standard hotel meal..."
                  />
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

          {/* SECTION B: CONFIGURATION (Cost Grid Removed) */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Wallet size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Configuration</span>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-6">
               
               {/* 1. Packaging & Menu Style */}
               <div className="grid grid-cols-12 gap-4">
                 <div className="col-span-6">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Packaging</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['included', 'excluded', 'optional'].map((type) => (
                        <div 
                          key={type}
                          // @ts-ignore
                          onClick={() => handleChange('inclusionType', type)}
                          className={`cursor-pointer border rounded-lg py-2 flex flex-col items-center justify-center gap-1 transition-all ${
                            formData.inclusionType === type 
                              ? (type === 'included' ? 'bg-green-50 border-green-500 text-green-700' : type === 'excluded' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-blue-50 border-blue-500 text-blue-700')
                              : 'bg-white border-gray-200 hover:border-gray-300 text-gray-400'
                          }`}
                        >
                          {type === 'included' && <CheckCircle2 size={16}/>}
                          {type === 'excluded' && <Ban size={16}/>}
                          {type === 'optional' && <PlusSquare size={16}/>}
                          <span className="text-[10px] font-bold uppercase">{type}</span>
                        </div>
                      ))}
                    </div>
                 </div>
                 <div className="col-span-6">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Menu Style</label>
                    {/* @ts-ignore */}
                    <select value={formData.menuType} onChange={(e) => handleChange('menuType', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium outline-none">
                       <option value="Buffet">Buffet</option>
                       <option value="Fixed Menu">Fixed Menu</option>
                       <option value="A La Carte">A La Carte</option>
                   </select>
                 </div>
               </div>

               {/* PRICING GRID REMOVED HERE */}
               {/* PAX COUNT INPUTS RETAINED */}
               {formData.inclusionType !== 'excluded' && (
                  <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-6">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adult Pax</label>
                          <input 
                             type="number" 
                             value={formData.paxAdult} 
                             onChange={(e) => handleChange('paxAdult', parseFloat(e.target.value) || 0)} 
                             className="w-full p-2 border border-gray-300 rounded font-bold text-sm outline-none focus:border-green-500"
                          />
                      </div>
                      <div className="col-span-6">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Child Pax</label>
                          <input 
                             type="number" 
                             value={formData.paxChild} 
                             onChange={(e) => handleChange('paxChild', parseFloat(e.target.value) || 0)} 
                             className="w-full p-2 border border-gray-300 rounded font-bold text-sm outline-none focus:border-green-500"
                          />
                      </div>
                  </div>
               )}
            </div>
            
            {/* Notes */}
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

          {/* SECTION C: LOGISTICS */}
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

      {/* RIGHT SIDE: SUGGESTIONS */}
      <div 
        className={`absolute top-0 right-0 bottom-0 w-80 bg-white border-l border-gray-300 shadow-2xl z-20 transition-transform duration-300 ease-in-out transform flex flex-col ${
            showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
          <div className="p-4 bg-orange-500 text-white flex justify-between items-center shrink-0">
             <div>
                <h3 className="text-xs font-bold opacity-90 uppercase">SRM Inventory</h3>
                <div className="font-bold text-sm">{city}</div>
             </div>
             <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-orange-600 rounded text-white">
                <X size={16} />
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
             {srmSuggestions.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                    <Utensils className="mx-auto mb-2 opacity-50"/>
                    <p className="text-xs">No restaurants found in <br/><strong className="text-gray-600">{city}</strong></p>
                    <p className="text-[10px] mt-2">Add them in SRM module first.</p>
                </div>
             ) : (
                srmSuggestions.map((item) => (
                    <div key={item.id} onClick={() => handleRestaurantSelect(item)} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-orange-500 group transition-all">
                        <div className="flex justify-between items-start">
                            <div className="font-bold text-gray-800 text-sm group-hover:text-orange-600 truncate">{item.restaurantName}</div>
                            <div className="flex items-center gap-1 text-[10px] font-bold bg-yellow-50 text-yellow-700 px-1.5 rounded border border-yellow-200 shrink-0">
                                <Star size={8} className="fill-current"/> {item.rating}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">{item.cuisine}</p>
                        
                        {/* Sidebar Pricing Preview REMOVED for consistency */}
                    </div>
                ))
             )}
          </div>
      </div>
    </div>
  );
}