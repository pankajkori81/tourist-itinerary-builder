
// "use client";

// import React, { useState, useMemo } from 'react';
// import { 
//   MapPin, Clock, Users, Briefcase, Car, 
//   CheckCircle2, Ban, PlusSquare 
// } from 'lucide-react';
// import { 
//   Transport, 
//   TRANSPORT_MODES, 
//   VEHICLE_TYPES, 
//   VEHICLE_SPECS,
//   Stay, 
//   Activity
// } from '../constants/daywiseConstants';
// import { useSRM } from '@/app/context/SRMContext'; // Import SRM Context

// // Default Factory
// const createDefaultTransport = (id: number): Transport => ({
//     id,
//     type: 'transport',
//     mode: 'vehicle',
//     subType: 'transfer', 
//     inclusionType: 'included',
//     vehicleType: 'Sedan Car',
//     vehicleCount: 1,
//     pickupLocation: '',
//     pickupTime: '09:00',
//     dropoffLocation: '', 
//     dropoffTime: '10:00',
//     duration: '',
//     price: 0,
// });

// interface TransportFormProps {
//   initialData?: Transport;
//   currentStay?: Stay;          
//   existingActivities?: Activity[]; 
//   city: string;
//   dayDate: string;
//   onSave: (data: Transport) => void;
//   onCancel: () => void;
// }

// export default function TransportForm({ 
//   initialData, 
//   currentStay, 
//   existingActivities = [],
//   city, 
//   dayDate, 
//   onSave, 
//   onCancel 
// }: TransportFormProps) {
  
//   // --- 1. GET SRM DATA ---
//   const { transports } = useSRM();

//   // --- 2. FILTER VEHICLES FOR CURRENT CITY ---
//   // Find vehicles in SRM that match the current city (active only)
//   const availableSrmVehicles = useMemo(() => {
//     if (!city) return [];
//     return transports.filter(t => 
//       (t.city || "").toLowerCase() === (city || "").toLowerCase() && 
//       t.status === 'Active'
//     );
//   }, [transports, city]);

//   // --- STATE ---
//   const [formData, setFormData] = useState<Transport>(
//       initialData || { 
//         ...createDefaultTransport(Date.now()),
//         pickupLocation: currentStay ? currentStay.hotelName : ''
//       }
//   );
  
//   // --- 3. DYNAMIC VISUAL SPECS ---
//   // If the selected vehicle is in SRM, use those specs. Otherwise, use default constants.
//   const currentSpecs = useMemo(() => {
//     const srmMatch = availableSrmVehicles.find(t => t.vehicleType === formData.vehicleType);
    
//     if (srmMatch) {
//         return {
//             guests: srmMatch.maxGuests,
//             // Map SRM 'luggageCapacity' to the visual card
//             luggageCheck: srmMatch.luggageCapacity || 'See Desc', 
//             luggageCarry: 'Standard', // Default as SRM doesn't have this field yet
//             seats: srmMatch.maxGuests + 1 // Estimate
//         };
//     }
//     return VEHICLE_SPECS[formData.vehicleType] || VEHICLE_SPECS['default'];
//   }, [formData.vehicleType, availableSrmVehicles]);

//   // --- HANDLERS ---
//   const updateField = (field: keyof Transport, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   // Special Handler for Vehicle Selection to Auto-fill Price
//   const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//       const newType = e.target.value;
//       const srmMatch = availableSrmVehicles.find(t => t.vehicleType === newType);
      
//       setFormData(prev => ({ 
//           ...prev, 
//           vehicleType: newType,
//           // Auto-fill price from SRM if available, else keep 0
//           price: srmMatch ? srmMatch.basePrice : 0 
//       }));
//   };

//   return (
//     <div className="flex flex-col h-full bg-white rounded-xl shadow-xl overflow-hidden w-full border border-gray-300">
      
//       {/* --- HEADER --- */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
//          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
//             {TRANSPORT_MODES.map((mode) => {
//                 const Icon = mode.icon;
//                 const isActive = formData.mode === mode.id;
//                 return (
//                     <button 
//                         key={mode.id}
//                         onClick={() => updateField('mode', mode.id)}
//                         className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all text-xs uppercase tracking-wide ${
//                             isActive ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'
//                         }`}
//                     >
//                         <Icon size={14} /> {mode.label}
//                     </button>
//                 );
//             })}
//          </div>
//          <div className="flex items-center gap-3">
//            <button onClick={onCancel} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
//            <button onClick={() => onSave(formData)} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm shadow-md">
//              Save Transport
//            </button>
//          </div>
//       </div>

//       {/* --- SCROLLABLE BODY --- */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
//         {/* 1. SERVICE CONFIGURATION */}
//         <section>
//             <div className="flex gap-6 border-b border-gray-100 pb-4 mb-4">
//                 <label className="flex items-center gap-3 cursor-pointer group">
//                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.subType === 'transfer' ? 'border-green-600' : 'border-gray-300'}`}>
//                         {formData.subType === 'transfer' && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
//                     </div>
//                     <input type="radio" className="hidden" checked={formData.subType === 'transfer'} onChange={() => updateField('subType', 'transfer')} />
//                     <div>
//                         <div className="text-sm font-bold text-gray-800">Transfer (Point-to-Point)</div>
//                         <div className="text-[10px] text-gray-400">A to B drop (e.g. Airport to Hotel)</div>
//                     </div>
//                 </label>

//                 <label className="flex items-center gap-3 cursor-pointer group">
//                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.subType === 'disposal' ? 'border-green-600' : 'border-gray-300'}`}>
//                         {formData.subType === 'disposal' && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
//                     </div>
//                     <input type="radio" className="hidden" checked={formData.subType === 'disposal'} onChange={() => updateField('subType', 'disposal')} />
//                     <div>
//                         <div className="text-sm font-bold text-gray-800">Disposal (Package)</div>
//                         <div className="text-[10px] text-gray-400">Hourly/Day rental (e.g. 8Hr / 80km)</div>
//                     </div>
//                 </label>
//             </div>
//         </section>

//         {/* 2. VEHICLE SELECTION */}
//         {formData.mode === 'vehicle' && (
//             <section className="grid grid-cols-12 gap-6">
                
//                 {/* Inputs */}
//                 <div className="col-span-7 space-y-4">
//                     <div>
//                         <label className="block text-xs font-bold text-gray-500 mb-1 flex justify-between">
//                             Vehicle Type
//                             {availableSrmVehicles.some(v => v.vehicleType === formData.vehicleType) && (
//                                 <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
//                                     SRM Price Linked
//                                 </span>
//                             )}
//                         </label>
//                         <select 
//                             value={formData.vehicleType}
//                             onChange={handleVehicleChange} // Updated Handler
//                             className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 outline-none focus:border-green-500"
//                         >
//                             {/* Option Group 1: SRM Vehicles (Prioritized) */}
//                             {availableSrmVehicles.length > 0 && (
//                                 <optgroup label={`Available in ${city}`}>
//                                     {availableSrmVehicles.map(v => (
//                                         <option key={v.id} value={v.vehicleType}>
//                                             {v.vehicleType} — ${v.basePrice}
//                                         </option>
//                                     ))}
//                                 </optgroup>
//                             )}

//                             {/* Option Group 2: Standard Fallbacks */}
//                             <optgroup label="Standard Vehicle Types">
//                                 {VEHICLE_TYPES
//                                     // Don't show duplicates if already in SRM list
//                                     .filter(t => !availableSrmVehicles.find(srm => srm.vehicleType === t))
//                                     .map(t => <option key={t} value={t}>{t}</option>)
//                                 }
//                             </optgroup>
//                         </select>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-xs font-bold text-gray-500 mb-1">No. of Vehicles</label>
//                             <input 
//                                 type="number" min="1"
//                                 value={formData.vehicleCount}
//                                 onChange={(e) => updateField('vehicleCount', parseInt(e.target.value) || 1)}
//                                 className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold outline-none focus:border-green-500"
//                             />
//                         </div>
//                         <div>
//                              <label className="block text-xs font-bold text-gray-500 mb-1">Ref No. (Optional)</label>
//                              <input 
//                                 type="text" placeholder="Flight/Train No."
//                                 value={formData.flightNumber || ''}
//                                 onChange={(e) => updateField('flightNumber', e.target.value)}
//                                 className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500"
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Visual Spec Card */}
//                 <div className="col-span-5">
//                     <div className="bg-green-50 border border-green-200 rounded-xl p-4 h-full flex flex-col justify-between">
//                         <div className="flex justify-between items-start">
//                             <div className="p-2 bg-white rounded-full text-green-600 shadow-sm"><Car size={20} /></div>
//                             <span className="text-[10px] font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded">SPECS</span>
//                         </div>
                        
//                         <div className="mt-4 space-y-3">
//                             <div className="flex items-center justify-between text-xs text-green-900 border-b border-green-200 pb-2">
//                                 <span className="flex items-center gap-1"><Users size={12}/> Max Guests</span>
//                                 <span className="font-bold">{currentSpecs.guests} Pax</span>
//                             </div>
//                             <div className="flex items-center justify-between text-xs text-green-900 border-b border-green-200 pb-2">
//                                 <span className="flex items-center gap-1"><Briefcase size={12}/> Check-in Bags</span>
//                                 <span className="font-bold">{currentSpecs.luggageCheck}</span>
//                             </div>
//                             <div className="flex items-center justify-between text-xs text-green-900">
//                                 <span className="flex items-center gap-1"><Briefcase size={12}/> Carry-on</span>
//                                 <span className="font-bold">{currentSpecs.luggageCarry}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         )}

//         {/* --- NEW SECTION: JOURNEY DESCRIPTION --- */}
//         <section className="mt-6">
//             <label className="block text-xs font-bold text-gray-500 mb-2 uppercase flex items-center gap-2">
//                 <span className="bg-blue-100 text-blue-600 p-1 rounded"><Briefcase size={12}/></span>
//                 Journey / Service Description
//             </label>
//             <textarea 
//                 rows={3}
//                 placeholder="e.g. From Barcelona, journey to Montserrat Mountain to marvel at its unique peaks..."
//                 value={formData.serviceDescription || ''}
//                 onChange={(e) => updateField('serviceDescription', e.target.value)}
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:bg-white focus:border-green-500 transition-all resize-none shadow-sm"
//             />
//             <p className="text-[10px] text-gray-400 mt-1 text-right">
//                 This text will appear on the client's itinerary.
//             </p>
//         </section>

//         {/* 3. LOGISTICS */}
//         <section className="bg-gray-50 rounded-xl p-5 border border-gray-200 mt-6">
//             <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
//                 <MapPin size={14}/> Logistics Details
//             </h3>

//             <div className="grid grid-cols-12 gap-6">
                
//                 {/* PICKUP SECTION */}
//                 <div className="col-span-6 space-y-3">
//                     <label className="text-xs font-bold text-gray-600 uppercase block">Pick-up</label>
                    
//                     <div className="relative">
//                         <input 
//                             type="text" 
//                             value={formData.pickupLocation} 
//                             onChange={e => updateField('pickupLocation', e.target.value)}
//                             className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:border-green-500 outline-none" 
//                             placeholder="Pickup Location"
//                         />
//                         {currentStay && !initialData && (
//                             <div className="absolute right-2 top-2.5 text-[10px] text-green-600 font-bold bg-green-50 px-1.5 rounded">
//                                 From Hotel
//                             </div>
//                         )}
//                     </div>

//                     <div className="flex items-center gap-2">
//                         <Clock size={14} className="text-gray-400"/>
//                         <input 
//                             type="time" 
//                             value={formData.pickupTime} 
//                             onChange={e => updateField('pickupTime', e.target.value)} 
//                             className="p-2 border rounded-md text-sm outline-none focus:border-green-500"
//                         />
//                     </div>
//                 </div>

//                 {/* DROP-OFF / DURATION SECTION */}
//                 <div className="col-span-6 space-y-3 border-l border-gray-200 pl-6">
                    
//                     {formData.subType === 'transfer' ? (
//                         <>
//                             <div className="flex justify-between items-center">
//                                 <label className="text-xs font-bold text-gray-600 uppercase">Drop-off</label>
                                
//                                 {existingActivities.length > 0 && (
//                                     <select 
//                                         className="text-[10px] bg-white border border-gray-300 rounded px-1 py-0.5 outline-none max-w-[120px]"
//                                         onChange={(e) => updateField('dropoffLocation', e.target.value)}
//                                         value=""
//                                     >
//                                         <option value="" disabled>Select Activity...</option>
//                                         {existingActivities.map(act => (
//                                             <option key={act.id} value={act.heading}>{act.heading}</option>
//                                         ))}
//                                     </select>
//                                 )}
//                             </div>

//                             <input 
//                                 type="text" 
//                                 value={formData.dropoffLocation} 
//                                 onChange={e => updateField('dropoffLocation', e.target.value)}
//                                 className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:border-green-500 outline-none" 
//                                 placeholder="Drop-off Location"
//                             />
//                              <div className="flex items-center gap-2">
//                                 <Clock size={14} className="text-gray-400"/>
//                                 <input 
//                                     type="time" 
//                                     value={formData.dropoffTime || ''} 
//                                     onChange={e => updateField('dropoffTime', e.target.value)} 
//                                     className="p-2 border rounded-md text-sm outline-none focus:border-green-500"
//                                 />
//                             </div>
//                         </>
//                     ) : (
//                         <>
//                             <label className="text-xs font-bold text-gray-600 uppercase">Duration</label>
//                             <div className="relative">
//                                 <input 
//                                     type="text" 
//                                     value={formData.duration || ''} 
//                                     onChange={e => updateField('duration', e.target.value)}
//                                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:border-green-500 outline-none" 
//                                     placeholder="e.g. 8 Hours / 80 Km"
//                                 />
//                                 <Clock className="absolute right-3 top-3 text-gray-400" size={16} />
//                             </div>
//                             <p className="text-[10px] text-gray-400 mt-1">Vehicle remains with you for this duration.</p>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </section>

//         {/* 4. COSTING & STATUS (UPDATED) */}
//         <section className="space-y-4 border-t border-gray-100 pt-4">
            
//             <div className="grid grid-cols-12 gap-6">
                
//                 {/* A. PACKAGING STATUS SELECTOR */}
//                 <div className="col-span-5">
//                     <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Packaging Status</label>
//                     <div className="grid grid-cols-3 gap-2">
//                         {/* Included */}
//                         <div 
//                             onClick={() => updateField('inclusionType', 'included')}
//                             className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all ${
//                                 formData.inclusionType === 'included' 
//                                 ? 'bg-green-50 border-green-500 shadow-sm' 
//                                 : 'bg-white border-gray-200 hover:border-gray-300'
//                             }`}
//                         >
//                             <CheckCircle2 size={16} className={formData.inclusionType === 'included' ? "text-green-600" : "text-gray-400"} />
//                             <span className={`text-[10px] font-bold ${formData.inclusionType === 'included' ? "text-green-700" : "text-gray-500"}`}>Included</span>
//                         </div>

//                         {/* Excluded */}
//                         <div 
//                             onClick={() => updateField('inclusionType', 'excluded')}
//                             className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all ${
//                                 formData.inclusionType === 'excluded' 
//                                 ? 'bg-red-50 border-red-500 shadow-sm' 
//                                 : 'bg-white border-gray-200 hover:border-gray-300'
//                             }`}
//                         >
//                             <Ban size={16} className={formData.inclusionType === 'excluded' ? "text-red-600" : "text-gray-400"} />
//                             <span className={`text-[10px] font-bold ${formData.inclusionType === 'excluded' ? "text-red-700" : "text-gray-500"}`}>Excluded</span>
//                         </div>

//                         {/* Optional */}
//                         <div 
//                             onClick={() => updateField('inclusionType', 'optional')}
//                             className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all ${
//                                 formData.inclusionType === 'optional' 
//                                 ? 'bg-blue-50 border-blue-500 shadow-sm' 
//                                 : 'bg-white border-gray-200 hover:border-gray-300'
//                             }`}
//                         >
//                             <PlusSquare size={16} className={formData.inclusionType === 'optional' ? "text-blue-600" : "text-gray-400"} />
//                             <span className={`text-[10px] font-bold ${formData.inclusionType === 'optional' ? "text-blue-700" : "text-gray-500"}`}>Optional</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* B. COSTING INPUTS (CONDITIONAL) */}
//                 <div className="col-span-7 flex flex-col justify-end">
//                     {formData.inclusionType === 'excluded' ? (
//                         <div className="h-full flex items-center p-3 bg-red-50 border border-red-100 rounded-lg gap-3">
//                             <Ban className="text-red-400 shrink-0" size={16} />
//                             <p className="text-xs text-red-600 leading-tight">
//                                 This transport is <strong>excluded</strong>. <br/> No costs will be calculated.
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="flex gap-4 items-start justify-end ">
//                             <div className="text-right">
//                                 <label className="block text-xs font-bold text-gray-500 mb-1">Vehicle Price</label>
//                                 <div className="relative">
//                                     <span className="absolute left-3 top-2.5 text-gray-700 text-sm">$</span>
//                                     <input 
//                                         type="number" 
//                                         value={formData.price} 
//                                         onChange={e => updateField('price', parseFloat(e.target.value) || 0)}
//                                         className="w-32 pl-6 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-right focus:border-green-500 outline-none"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200 w-28">
//                                 <div className="text-[10px] text-green-600 font-bold uppercase">Total Cost</div>
//                                 <div className="text-xl font-bold text-green-800">
//                                     ${(formData.price * formData.vehicleCount).toLocaleString()}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//             </div>
//         </section>

//       </div>
//     </div>
//   );
// } 












































// "use client";

// import React, { useState, useMemo, useEffect } from 'react';
// import { 
//   MapPin, Clock, Users, Briefcase, Car, 
//   CheckCircle2, Ban, PlusSquare, 
//   Phone, Mail, DollarSign, CreditCard // [CHANGE 1: Added Icons]
// } from 'lucide-react';
// import { 
//   Transport, 
//   TRANSPORT_MODES, 
//   VEHICLE_TYPES, 
//   VEHICLE_SPECS,
//   Stay, 
//   Activity
// } from '../constants/daywiseConstants';

// // --- [CHANGE 1: IMPORT CONTEXT] ---
// import { useItinerary } from '@/app/context/ItineraryContext';
// import { useSRM } from '@/app/context/SRMContext'; // Import SRM Context

// // Default Factory
// const createDefaultTransport = (id: number): Transport => ({
//     id,
//     type: 'transport',
//     mode: 'vehicle',
//     subType: 'transfer', 
//     inclusionType: 'included',
//     vehicleType: 'Sedan Car',
//     vehicleCount: 1,
//     paxCount: 1,
//     pickupLocation: '',
//     pickupTime: '09:00',
//     dropoffLocation: '', 
//     dropoffTime: '10:00',
//     duration: '',
//     price: 0,
//     linkedSupplierId: '' // [CHANGE 2: Added Field]
// });

// interface TransportFormProps {
//   initialData?: Transport;
//   currentStay?: Stay;          
//   existingActivities?: Activity[]; 
//   city: string;
//   dayDate: string;
//   onSave: (data: Transport) => void;
//   onCancel: () => void;
// }

// export default function TransportForm({ 
//   initialData, 
//   currentStay, 
//   existingActivities = [],
//   city, 
//   dayDate, 
//   onSave, 
//   onCancel 
// }: TransportFormProps) {


//     // --- [CHANGE 2: GET GLOBAL PAX] ---
//   const { itineraryData } = useItinerary();
//   // Safe fallback to 2 if undefined
//   const globalPax = (itineraryData && typeof itineraryData.numberOfTravelers === 'number') 
//     ? itineraryData.numberOfTravelers 
//     : 2;
//   // ----------------------------------
  
//   // --- 1. GET SRM DATA ---
//   const { transports, suppliers } = useSRM(); // [CHANGE 3: Access Suppliers]

//   // --- 2. FILTER VEHICLES FOR CURRENT CITY ---
//   const availableSrmVehicles = useMemo(() => {
//     if (!city) return [];
//     return transports.filter(t => 
//       (t.city || "").toLowerCase() === (city || "").toLowerCase() && 
//       t.status === 'Active'
//     );
//   }, [transports, city]);

//   // --- STATE ---
// //   const [formData, setFormData] = useState<Transport>(
// //       initialData || { 
// //         ...createDefaultTransport(Date.now()),
// //         pickupLocation: currentStay ? currentStay.hotelName : ''
// //       }
// //   );


// // --- [CHANGE: SAFE STATE INITIALIZATION] ---
//   const [formData, setFormData] = useState<Transport>(() => {
//     // 1. If Editing: Use existing data, backfill paxCount if missing (prevents crash)
//     if (initialData) {
//       return {
//         ...initialData,
//         paxCount: (initialData.paxCount !== undefined && initialData.paxCount !== null) 
//                   ? initialData.paxCount 
//                   : globalPax // Fallback for old items
//       };
//     }
    
//     // 2. If New: Use Defaults + Global Pax
//     return { 
//       ...createDefaultTransport(Date.now()),
//       paxCount: globalPax, 
//       pickupLocation: currentStay ? currentStay.hotelName : ''
//     };
//   });
//   // ---------------------------------------------

//   // --- [CHANGE 4: SMART SUPPLIER LOGIC] ---
  
//   // A. Filter Suppliers (Must be Active + 'Transport' Service + Match City)
//   const availableSuppliers = useMemo(() => {
//     return suppliers.filter(s => {
//       const basicCheck = s.status === 'Active' && s.services.includes('Transport');
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
  
//   // --- [CHANGE 5: DEFINE TICKET MODE] ---
//   const isTicketMode = useMemo(() => {
//     return ['flight', 'rail', 'bus'].includes(formData.mode);
//   }, [formData.mode]);
//   // ----------------------------------------

//   // --- 3. DYNAMIC VISUAL SPECS ---
//   const currentSpecs = useMemo(() => {
//     const srmMatch = availableSrmVehicles.find(t => t.vehicleType === formData.vehicleType);
    
//     if (srmMatch) {
//         return {
//             guests: srmMatch.maxGuests,
//             luggageCheck: srmMatch.luggageCapacity || 'See Desc', 
//             luggageCarry: 'Standard', 
//             seats: srmMatch.maxGuests + 1 
//         };
//     }
//     return VEHICLE_SPECS[formData.vehicleType] || VEHICLE_SPECS['default'];
//   }, [formData.vehicleType, availableSrmVehicles]);

//   // --- HANDLERS ---
//   const updateField = (field: keyof Transport, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//       const newType = e.target.value;
//       const srmMatch = availableSrmVehicles.find(t => t.vehicleType === newType);
      
//       setFormData(prev => {
//           if (srmMatch) {
//               return { 
//                   ...prev, 
//                   vehicleType: newType,
//                   price: srmMatch.basePrice,
//                   serviceDescription: srmMatch.description || prev.serviceDescription || '', 
//                   pickupLocation: srmMatch.defaultPickup || prev.pickupLocation, 
//                   dropoffLocation: srmMatch.defaultDropoff || prev.dropoffLocation,
//                   duration: srmMatch.defaultDuration || prev.duration
//               };
//           } else {
//               return { 
//                   ...prev, 
//                   vehicleType: newType,
//                   price: 0 
//               };
//           }
//       });
//   };

//   return (
//     <div className="flex flex-col h-full bg-white rounded-xl shadow-xl overflow-hidden w-full border border-gray-300">
      
//       {/* --- HEADER --- */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
//          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
//             {TRANSPORT_MODES.map((mode) => {
//                 const Icon = mode.icon;
//                 const isActive = formData.mode === mode.id;
//                 return (
//                     <button 
//                         key={mode.id}
//                         onClick={() => updateField('mode', mode.id)}
//                         className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all text-xs uppercase tracking-wide ${
//                             isActive ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'
//                         }`}
//                     >
//                         <Icon size={14} /> {mode.label}
//                     </button>
//                 );
//             })}
//          </div>
//          <div className="flex items-center gap-3">
//            <button onClick={onCancel} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
//            <button onClick={() => onSave(formData)} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm shadow-md">
//              Save Transport
//            </button>
//          </div>
//       </div>

//       {/* --- SCROLLABLE BODY --- */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
//         {/* 1. SERVICE CONFIGURATION */}
//         <section>
//             <div className="flex gap-6 border-b border-gray-100 pb-4 mb-4">
//                 <label className="flex items-center gap-3 cursor-pointer group">
//                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.subType === 'transfer' ? 'border-green-600' : 'border-gray-300'}`}>
//                         {formData.subType === 'transfer' && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
//                     </div>
//                     <input type="radio" className="hidden" checked={formData.subType === 'transfer'} onChange={() => updateField('subType', 'transfer')} />
//                     <div>
//                         <div className="text-sm font-bold text-gray-800">Transfer (Point-to-Point)</div>
//                         <div className="text-[10px] text-gray-400">A to B drop (e.g. Airport to Hotel)</div>
//                     </div>
//                 </label>
// {/* 
//                  <label className="flex items-center gap-3 cursor-pointer group">
//                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.subType === 'disposal' ? 'border-green-600' : 'border-gray-300'}`}>
//                         {formData.subType === 'disposal' && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
//                     </div>
//                     <input type="radio" className="hidden" checked={formData.subType === 'disposal'} onChange={() => updateField('subType', 'disposal')} />
//                     <div>
//                         <div className="text-sm font-bold text-gray-800">Disposal (Package)</div>
//                         <div className="text-[10px] text-gray-400">Hourly/Day rental (e.g. 8Hr / 80km)</div>
//                     </div>
//                 </label>  */}
//             </div>
//         </section>



//         {/* 2. VEHICLE SELECTION */}
//         {/* 2. VEHICLE SELECTION */}
//         <section className="grid grid-cols-12 gap-6">
                
//                 {/* Inputs Column */}
//                 <div className="col-span-7 space-y-4">
                    
//                      {/* Supplier Section (Unchanged) */}
//                     <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 flex gap-4 items-start">
//                         <div className="flex-1">
//                             <label className="block text-xs font-bold text-green-900 mb-2 flex items-center gap-1">
//                                 <Briefcase size={14} /> Fulfillment Partner (Transport)
//                             </label>
//                             <select 
//                                 className="w-full p-2.5 border border-green-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
//                                 value={formData.linkedSupplierId || ""}
//                                 onChange={(e) => updateField('linkedSupplierId', e.target.value)}
//                             >
//                                 <option value="">-- Direct / Unknown --</option>
//                                 {availableSuppliers.map(s => (
//                                     <option key={s.id} value={s.id}>
//                                         {s.name} ({s.city}) {s.isPreferred ? '★ Preferred' : ''}
//                                     </option>
//                                 ))}
//                             </select>
//                             {availableSuppliers.length === 0 && (
//                                 <p className="text-[10px] text-gray-400 mt-1">No 'Transport' suppliers found for {city}.</p>
//                             )}
//                         </div>
                        
//                         {/* Intelligence Box */}
//                         {selectedSupplier && (
//                             <div className="flex-1 bg-white p-3 rounded-lg border border-green-100 shadow-sm text-xs">
//                                 <div className="font-bold text-gray-800 mb-2 flex justify-between items-center border-b border-gray-100 pb-1">
//                                     <span>{selectedSupplier.contactPerson}</span>
//                                     <span className="text-green-600 bg-green-50 px-1.5 rounded">{selectedSupplier.paymentTerms}</span>
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-600">
//                                     <div className="flex items-center gap-1"><Phone size={10}/> {selectedSupplier.phone}</div>
//                                     <div className="col-span-2 flex items-center gap-1 truncate"><Mail size={10}/> {selectedSupplier.email}</div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Vehicle Type Selection (Unchanged) */}
//                     <div>
//                         <label className="block text-xs font-bold text-gray-500 mb-1 flex justify-between">
//                             {isTicketMode ? 'Transport Type' : 'Vehicle Type'}
                            
//                             {!isTicketMode && availableSrmVehicles.some(v => v.vehicleType === formData.vehicleType) && (
//                                 <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
//                                     SRM Price Linked
//                                 </span>
//                             )}
//                         </label>

//                         {isTicketMode ? (
//                             <input 
//                                 type="text" placeholder="e.g. Economy Class, 2nd AC"
//                                 value={formData.vehicleType}
//                                 onChange={(e) => updateField('vehicleType', e.target.value)}
//                                 className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold outline-none focus:border-green-500"
//                             />
//                         ) : (
//                             <select 
//                                 value={formData.vehicleType}
//                                 onChange={handleVehicleChange} 
//                                 className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 outline-none focus:border-green-500"
//                             >
//                                 <optgroup label={`Available in ${city}`}>
//                                     {availableSrmVehicles.map(v => (
//                                         <option key={v.id} value={v.vehicleType}>
//                                             {v.vehicleType} — ${v.basePrice}
//                                         </option>
//                                     ))}
//                                 </optgroup>
//                                 <optgroup label="Standard Vehicle Types">
//                                     {VEHICLE_TYPES
//                                         .filter(t => !availableSrmVehicles.find(srm => srm.vehicleType === t))
//                                         .map(t => <option key={t} value={t}>{t}</option>)
//                                     }
//                                 </optgroup>
//                             </select>
//                         )}
//                     </div>

//                     {/* --- [UPDATED INPUTS GRID] --- */}
//                     <div className="grid grid-cols-2 gap-4">
                        
//                         {/* 1. QUANTITY (Vehicles or Tickets) */}
//                         <div>
//                              <label className="block text-xs font-bold text-gray-500 mb-1">
//                                 {isTicketMode ? 'No. of Tickets' : 'No. of Vehicles'}
//                              </label>
                             
//                              {isTicketMode ? (
//                                  <input 
//                                     type="number" min="1"
//                                     value={formData.paxCount}
//                                     onChange={(e) => updateField('paxCount', parseInt(e.target.value) || 1)}
//                                     className="w-full p-2.5 bg-yellow-50 border border-yellow-200 text-gray-800 rounded-lg text-sm font-bold outline-none focus:border-green-500"
//                                 />
//                              ) : (
//                                  <input 
//                                     type="number" min="1"
//                                     value={formData.vehicleCount}
//                                     onChange={(e) => updateField('vehicleCount', parseInt(e.target.value) || 1)}
//                                     className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold outline-none focus:border-green-500"
//                                 />
//                              )}
//                         </div>

//                         {/* 2. SECOND SLOT LOGIC */}
//                         {isTicketMode ? (
//                             // If Ticket mode, show Ref No here to save space
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-500 mb-1">Ref No. (Optional)</label>
//                                 <input 
//                                     type="text" placeholder="Flight/Train No."
//                                     value={formData.flightNumber || ''}
//                                     onChange={(e) => updateField('flightNumber', e.target.value)}
//                                     className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500"
//                                 />
//                             </div>
//                         ) : (
//                             // If Vehicle mode, show PAX COUNT here so you can do ($100 / 4 pax)
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-500 mb-1">
//                                     Total Passengers
//                                 </label>
//                                 <input 
//                                     type="number" min="1"
//                                     value={formData.paxCount}
//                                     onChange={(e) => updateField('paxCount', parseInt(e.target.value) || 1)}
//                                     className="w-full p-2.5 bg-yellow-50 border border-yellow-200 text-gray-800 rounded-lg text-sm font-bold outline-none focus:border-green-500"
//                                 />
//                             </div>
//                         )}

//                         {/* 3. REF NO (Vehicle Mode Only - Moves to new line) */}
//                         {!isTicketMode && (
//                             <div className="col-span-2">
//                                 <label className="block text-xs font-bold text-gray-500 mb-1">Ref No. (Optional)</label>
//                                 <input 
//                                     type="text" placeholder="Flight/Train No."
//                                     value={formData.flightNumber || ''}
//                                     onChange={(e) => updateField('flightNumber', e.target.value)}
//                                     className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500"
//                                 />
//                             </div>
//                         )}
//                     </div>
//                     {/* --- [END UPDATED INPUTS] --- */}
//                 </div>

//                 {/* Visual Spec Card - Only show for Vehicles (Unchanged) */}
//                 {!isTicketMode && (
//                 <div className="col-span-5">
//                     <div className="bg-green-50 border border-green-200 rounded-xl p-4 h-full flex flex-col justify-between">
//                         <div className="flex justify-between items-start">
//                             <div className="p-2 bg-white rounded-full text-green-600 shadow-sm"><Car size={20} /></div>
//                             <span className="text-[10px] font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded">SPECS</span>
//                         </div>
                        
//                         <div className="mt-4 space-y-3">
//                             <div className="flex items-center justify-between text-xs text-green-900 border-b border-green-200 pb-2">
//                                 <span className="flex items-center gap-1"><Users size={12}/> Max Guests</span>
//                                 <span className="font-bold">{currentSpecs.guests} Pax</span>
//                             </div>
//                             <div className="flex items-center justify-between text-xs text-green-900 border-b border-green-200 pb-2">
//                                 <span className="flex items-center gap-1"><Briefcase size={12}/> Luggage</span>
//                                 <span className="font-bold">{currentSpecs.luggageCheck}</span>
//                             </div>
//                              <div className="flex items-center justify-between text-xs text-green-900">
//                                 <span className="flex items-center gap-1"><Briefcase size={12}/> Carry-on</span>
//                                 <span className="font-bold">{currentSpecs.luggageCarry}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 )}
//         </section>

    

//         {/* --- NEW SECTION: JOURNEY DESCRIPTION --- */}
//         <section className="mt-6">
//             <label className="block text-xs font-bold text-gray-500 mb-2 uppercase flex items-center gap-2">
//                 <span className="bg-blue-100 text-blue-600 p-1 rounded"><Briefcase size={12}/></span>
//                 Journey / Service Description
//             </label>
//             <textarea 
//                 rows={3}
//                 placeholder="e.g. From Barcelona, journey to Montserrat Mountain to marvel at its unique peaks..."
//                 value={formData.serviceDescription || ''}
//                 onChange={(e) => updateField('serviceDescription', e.target.value)}
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:bg-white focus:border-green-500 transition-all resize-none shadow-sm"
//             />
//             <p className="text-[10px] text-gray-400 mt-1 text-right">
//                 This text will appear on the client's itinerary.
//             </p>
//         </section>

//         {/* 3. LOGISTICS */}
//         <section className="bg-gray-50 rounded-xl p-5 border border-gray-200 mt-6">
//             <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
//                 <MapPin size={14}/> Logistics Details
//             </h3>

//             <div className="grid grid-cols-12 gap-6">
                
//                 {/* PICKUP SECTION */}
//                 <div className="col-span-6 space-y-3">
//                     <label className="text-xs font-bold text-gray-600 uppercase block">Pick-up</label>
                    
//                     <div className="relative">
//                         <input 
//                             type="text" 
//                             value={formData.pickupLocation} 
//                             onChange={e => updateField('pickupLocation', e.target.value)}
//                             className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:border-green-500 outline-none" 
//                             placeholder="Pickup Location"
//                         />
//                         {currentStay && !initialData && (
//                             <div className="absolute right-2 top-2.5 text-[10px] text-green-600 font-bold bg-green-50 px-1.5 rounded">
//                                 From Hotel
//                             </div>
//                         )}
//                     </div>

//                     <div className="flex items-center gap-2">
//                         <Clock size={14} className="text-gray-400"/>
//                         <input 
//                             type="time" 
//                             value={formData.pickupTime} 
//                             onChange={e => updateField('pickupTime', e.target.value)} 
//                             className="p-2 border rounded-md text-sm outline-none focus:border-green-500"
//                         />
//                     </div>
//                 </div>

//                 {/* DROP-OFF / DURATION SECTION */}
//                 <div className="col-span-6 space-y-3 border-l border-gray-200 pl-6">
                    
//                     {formData.subType === 'transfer' ? (
//                         <>
//                             <div className="flex justify-between items-center">
//                                 <label className="text-xs font-bold text-gray-600 uppercase">Drop-off</label>
                                
//                                 {existingActivities.length > 0 && (
//                                     <select 
//                                         className="text-[10px] bg-white border border-gray-300 rounded px-1 py-0.5 outline-none max-w-[120px]"
//                                         onChange={(e) => updateField('dropoffLocation', e.target.value)}
//                                         value=""
//                                     >
//                                         <option value="" disabled>Select Activity...</option>
//                                         {existingActivities.map(act => (
//                                             <option key={act.id} value={act.heading}>{act.heading}</option>
//                                         ))}
//                                     </select>
//                                 )}
//                             </div>

//                             <input 
//                                 type="text" 
//                                 value={formData.dropoffLocation} 
//                                 onChange={e => updateField('dropoffLocation', e.target.value)}
//                                 className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:border-green-500 outline-none" 
//                                 placeholder="Drop-off Location"
//                             />
//                              <div className="flex items-center gap-2">
//                                 <Clock size={14} className="text-gray-400"/>
//                                 <input 
//                                     type="time" 
//                                     value={formData.dropoffTime || ''} 
//                                     onChange={e => updateField('dropoffTime', e.target.value)} 
//                                     className="p-2 border rounded-md text-sm outline-none focus:border-green-500"
//                                 />
//                             </div>
//                         </>
//                     ) : (
//                         <>
//                             <label className="text-xs font-bold text-gray-600 uppercase">Duration</label>
//                             <div className="relative">
//                                 <input 
//                                     type="text" 
//                                     value={formData.duration || ''} 
//                                     onChange={e => updateField('duration', e.target.value)}
//                                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:border-green-500 outline-none" 
//                                     placeholder="e.g. 8 Hours / 80 Km"
//                                 />
//                                 <Clock className="absolute right-3 top-3 text-gray-400" size={16} />
//                             </div>
//                             <p className="text-[10px] text-gray-400 mt-1">Vehicle remains with you for this duration.</p>
//                         </>
//                     ) }
//                 </div>
//             </div>
//         </section>

//         {/* 4. COSTING & STATUS (UPDATED) */}
//    {/* 4. COSTING & STATUS (UPDATED) */}
//         <section className="space-y-4 border-t border-gray-100 pt-4">
            
//             <div className="grid grid-cols-12 gap-6 items-center">
                
//                 {/* PACKAGING SELECTOR (Unchanged) */}
//                 <div className="col-span-5">
//                     <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Packaging Status</label>
//                     <div className="grid grid-cols-3 gap-2">
//                         {['included', 'excluded', 'optional'].map(type => (
//                             <div 
//                                 key={type}
//                                 // @ts-ignore
//                                 onClick={() => updateField('inclusionType', type)}
//                                 className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all ${
//                                     formData.inclusionType === type 
//                                     ? (type === 'included' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500')
//                                     : 'bg-white border-gray-200 hover:border-gray-300'
//                                 }`}
//                             >
//                                 <CheckCircle2 size={16} className={formData.inclusionType === type ? "text-green-600" : "text-gray-400"} />
//                                 <span className="text-[10px] font-bold capitalize">{type}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* COSTING INPUTS (UPDATED LAYOUT) */}
//                 <div className="col-span-7 flex flex-col justify-end">
//                     {formData.inclusionType === 'excluded' ? (
//                          <div className="h-full flex items-center p-3 bg-red-50 border border-red-100 rounded-lg gap-3">
//                             <Ban className="text-red-400 shrink-0" size={16} />
//                             <p className="text-xs text-red-600 leading-tight">Excluded from Total.</p>
//                         </div>
//                     ) : (
//                         <div className="flex flex-col gap-3 w-full">
                            
//                             {/* Row 1: Price Input */}
//                             <div className="flex justify-end items-center gap-3">
//                                 <label className="text-xs font-bold text-gray-500">
//                                     {isTicketMode ? 'Price Per Ticket' : 'Price Per Vehicle'}
//                                 </label>
//                                 <div className="relative">
//                                     <span className="absolute left-3 top-2.5 text-gray-700 text-sm">$</span>
//                                     <input 
//                                         type="number" 
//                                         value={formData.price} 
//                                         onChange={e => updateField('price', parseFloat(e.target.value) || 0)}
//                                         className="w-32 pl-6 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-right focus:border-green-500 outline-none"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Row 2: The Logic Box (Total vs PP) */}
//                             <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center px-4">
//                                <div>
//                                    <div className="text-[10px] font-bold text-green-600 uppercase">Total Transport Cost</div>
//                                    <div className="text-lg font-bold text-green-800">
//                                        ${(
//                                            isTicketMode 
//                                            ? (formData.price * (formData.paxCount || 1)) 
//                                            : (formData.price * (formData.vehicleCount || 1))
//                                        ).toLocaleString()}
//                                    </div>
//                                </div>
                               
//                                {/* VISUAL SEPARATOR */}
//                                <div className="h-8 w-px bg-green-200 mx-4"></div>

//                                <div className="text-right">
//                                    <div className="text-[10px] font-bold text-green-600 uppercase">Per Person ({formData.paxCount || 1} Pax)</div>
//                                    <div className="text-sm font-bold text-green-800">
//                                        ${(
//                                            (isTicketMode 
//                                             ? (formData.price * (formData.paxCount || 1)) 
//                                             : (formData.price * (formData.vehicleCount || 1))) 
//                                            / (formData.paxCount || 1)
//                                        ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
//                                    </div>
//                                </div>
//                             </div>

//                         </div>
//                     )}
//                 </div>

//             </div>
//         </section>
//       </div>
//     </div>
//   );
// } 












































"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, Clock, Users, Briefcase, Car, 
  CheckCircle2, Ban, PlusSquare, 
  Phone, Mail, DollarSign 
} from 'lucide-react';
import { 
  Transport, 
  TRANSPORT_MODES, 
  VEHICLE_TYPES, 
  VEHICLE_SPECS,
  Stay, 
  Activity
} from '../constants/daywiseConstants';
import { useItinerary } from '@/app/context/ItineraryContext';
import { useSRM } from '@/app/context/SRMContext'; 

// Default Factory
const createDefaultTransport = (id: number): Transport => ({
    id,
    type: 'transport',
    mode: 'vehicle',
    subType: 'transfer', 
    inclusionType: 'included',
    vehicleType: 'Sedan Car',
    vehicleCount: 1,
    paxCount: 1,
    pickupLocation: '',
    pickupTime: '09:00',
    dropoffLocation: '', 
    dropoffTime: '10:00',
    duration: '',
    price: 0, // Kept in data structure but input removed
    linkedSupplierId: '' 
});

interface TransportFormProps {
  initialData?: Transport;
  currentStay?: Stay;          
  existingActivities?: Activity[]; 
  city: string;
  dayDate: string;
  onSave: (data: Transport) => void;
  onCancel: () => void;
}

export default function TransportForm({ 
  initialData, 
  currentStay, 
  existingActivities = [],
  city, 
  dayDate, 
  onSave, 
  onCancel 
}: TransportFormProps) {

  const { itineraryData } = useItinerary();
  // Safe fallback to 2 if undefined
  const globalPax = (itineraryData && typeof itineraryData.numberOfTravelers === 'number') 
    ? itineraryData.numberOfTravelers 
    : 2;
  
  const { transports, suppliers } = useSRM(); 

  // Filter Vehicles
  const availableSrmVehicles = useMemo(() => {
    if (!city) return [];
    return transports.filter(t => 
      (t.city || "").toLowerCase() === (city || "").toLowerCase() && 
      t.status === 'Active'
    );
  }, [transports, city]);

  // Initialize State
  const [formData, setFormData] = useState<Transport>(() => {
    if (initialData) {
      return {
        ...initialData,
        paxCount: (initialData.paxCount !== undefined && initialData.paxCount !== null) 
                  ? initialData.paxCount 
                  : globalPax 
      };
    }
    return { 
      ...createDefaultTransport(Date.now()),
      paxCount: globalPax, 
      pickupLocation: currentStay ? currentStay.hotelName : ''
    };
  });

  // Smart Supplier Logic
  const availableSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const basicCheck = s.status === 'Active' && s.services.includes('Transport');
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
  
  const isTicketMode = useMemo(() => {
    return ['flight', 'rail', 'bus'].includes(formData.mode);
  }, [formData.mode]);

  // Dynamic Visual Specs
  const currentSpecs = useMemo(() => {
    const srmMatch = availableSrmVehicles.find(t => t.vehicleType === formData.vehicleType);
    
    if (srmMatch) {
        return {
            guests: srmMatch.maxGuests,
            luggageCheck: srmMatch.luggageCapacity || 'See Desc', 
            luggageCarry: 'Standard', 
            seats: srmMatch.maxGuests + 1 
        };
    }
    return VEHICLE_SPECS[formData.vehicleType] || VEHICLE_SPECS['default'];
  }, [formData.vehicleType, availableSrmVehicles]);

  // Handlers
  const updateField = (field: keyof Transport, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newType = e.target.value;
      const srmMatch = availableSrmVehicles.find(t => t.vehicleType === newType);
      
      setFormData(prev => {
          if (srmMatch) {
              return { 
                  ...prev, 
                  vehicleType: newType,
                  // price is handled in costing sheet now, but we keep other details
                  serviceDescription: srmMatch.description || prev.serviceDescription || '', 
                  pickupLocation: srmMatch.defaultPickup || prev.pickupLocation, 
                  dropoffLocation: srmMatch.defaultDropoff || prev.dropoffLocation,
                  duration: srmMatch.defaultDuration || prev.duration
              };
          } else {
              return { ...prev, vehicleType: newType };
          }
      });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-xl overflow-hidden w-full border border-gray-300">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
         <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {TRANSPORT_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = formData.mode === mode.id;
                return (
                    <button 
                        key={mode.id}
                        onClick={() => updateField('mode', mode.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all text-xs uppercase tracking-wide ${
                            isActive ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Icon size={14} /> {mode.label}
                    </button>
                );
            })}
         </div>
         <div className="flex items-center gap-3">
           <button onClick={onCancel} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
           <button onClick={() => onSave(formData)} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm shadow-md">
             Save Transport
           </button>
         </div>
      </div>

      {/* --- SCROLLABLE BODY --- */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* 1. SERVICE CONFIGURATION */}
        {/* <section>
            <div className="flex gap-6 border-b border-gray-100 pb-4 mb-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.subType === 'transfer' ? 'border-green-600' : 'border-gray-300'}`}>
                        {formData.subType === 'transfer' && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
                    </div>
                    <input type="radio" className="hidden" checked={formData.subType === 'transfer'} onChange={() => updateField('subType', 'transfer')} />
                    <div>
                        <div className="text-sm font-bold text-gray-800">Transfer (Point-to-Point)</div>
                        <div className="text-[10px] text-gray-400">A to B drop (e.g. Airport to Hotel)</div>
                    </div>
                </label>
            </div>
        </section> */}


        {/* 1. SERVICE CONFIGURATION (Transfer vs Disposal) */}
<section>
    <div className="flex gap-6 border-b border-gray-100 pb-4 mb-4">
        {/* Transfer Option */}
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.subType === 'transfer' ? 'border-green-600' : 'border-gray-300'}`}>
                {formData.subType === 'transfer' && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
            </div>
            <input type="radio" className="hidden" checked={formData.subType === 'transfer'} onChange={() => updateField('subType', 'transfer')} />
            <div>
                <div className="text-sm font-bold text-gray-800">Transfer (Point-to-Point)</div>
                <div className="text-[10px] text-gray-400">A to B drop (e.g. Airport to Hotel)</div>
            </div>
        </label>

        {/* Disposal Option (NEW) */}
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.subType === 'disposal' ? 'border-green-600' : 'border-gray-300'}`}>
                {formData.subType === 'disposal' && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
            </div>
            <input type="radio" className="hidden" checked={formData.subType === 'disposal'} onChange={() => updateField('subType', 'disposal')} />
            <div>
                <div className="text-sm font-bold text-gray-800">Disposal (Full Day)</div>
                <div className="text-[10px] text-gray-400">Vehicle stays with client (e.g. 8 Hrs / 80 Km)</div>
            </div>
        </label>
    </div>
</section>

        {/* 2. VEHICLE SELECTION */}
        <section className="grid grid-cols-12 gap-6">
                
                {/* Inputs Column */}
                <div className="col-span-7 space-y-4">
                    

                    {/* Vehicle Type Selection */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 flex justify-between">
                            {isTicketMode ? 'Transport Type' : 'Vehicle Type'}
                            
                            {!isTicketMode && availableSrmVehicles.some(v => v.vehicleType === formData.vehicleType) && (
                                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                    SRM Spec Available
                                </span>
                            )}
                        </label>

                        {isTicketMode ? (
                            <input 
                                type="text" placeholder="e.g. Economy Class, 2nd AC"
                                value={formData.vehicleType}
                                onChange={(e) => updateField('vehicleType', e.target.value)}
                                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold outline-none focus:border-green-500"
                            />
                        ) : (
                            <select 
                                value={formData.vehicleType}
                                onChange={handleVehicleChange} 
                                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 outline-none focus:border-green-500"
                            >
                                <optgroup label={`Available in ${city}`}>
                                    {availableSrmVehicles.map(v => (
                                        <option key={v.id} value={v.vehicleType}>
                                            {v.vehicleType}
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="Standard Vehicle Types">
                                    {VEHICLE_TYPES
                                        .filter(t => !availableSrmVehicles.find(srm => srm.vehicleType === t))
                                        .map(t => <option key={t} value={t}>{t}</option>)
                                    }
                                </optgroup>
                            </select>
                        )}
                    </div>

                    {/* --- [INPUTS GRID - Quantity Only] --- */}
                    <div className="grid grid-cols-2 gap-4">
                        
                        {/* 1. QUANTITY (Vehicles or Tickets) */}
                        <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">
                                {isTicketMode ? 'No. of Tickets' : 'No. of Vehicles'}
                             </label>
                             
                             {isTicketMode ? (
                                 <input 
                                    type="number" min="1"
                                    value={formData.paxCount}
                                    onChange={(e) => updateField('paxCount', parseInt(e.target.value) || 1)}
                                    className="w-full p-2.5 bg-yellow-50 border border-yellow-200 text-gray-800 rounded-lg text-sm font-bold outline-none focus:border-green-500"
                                />
                             ) : (
                                 <input 
                                    type="number" min="1"
                                    value={formData.vehicleCount}
                                    onChange={(e) => updateField('vehicleCount', parseInt(e.target.value) || 1)}
                                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold outline-none focus:border-green-500"
                                />
                             )}
                        </div>

                        {/* 2. SECOND SLOT LOGIC */}
                        {isTicketMode ? (
                            // If Ticket mode, show Ref No here to save space
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Ref No. (Optional)</label>
                                <input 
                                    type="text" placeholder="Flight/Train No."
                                    value={formData.flightNumber || ''}
                                    onChange={(e) => updateField('flightNumber', e.target.value)}
                                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500"
                                />
                            </div>
                        ) : (
                            // If Vehicle mode, show PAX COUNT here
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">
                                    Total Passengers
                                </label>
                                <input 
                                    type="number" min="1"
                                    value={formData.paxCount}
                                    onChange={(e) => updateField('paxCount', parseInt(e.target.value) || 1)}
                                    className="w-full p-2.5 bg-yellow-50 border border-yellow-200 text-gray-800 rounded-lg text-sm font-bold outline-none focus:border-green-500"
                                />
                            </div>
                        )}

                        {/* 3. REF NO (Vehicle Mode Only - Moves to new line) */}
                        {!isTicketMode && (
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Ref No. (Optional)</label>
                                <input 
                                    type="text" placeholder="Flight/Train No."
                                    value={formData.flightNumber || ''}
                                    onChange={(e) => updateField('flightNumber', e.target.value)}
                                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Visual Spec Card - Only show for Vehicles */}
                {!isTicketMode && (
                <div className="col-span-5">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="p-2 bg-white rounded-full text-green-600 shadow-sm"><Car size={20} /></div>
                            <span className="text-[10px] font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded">SPECS</span>
                        </div>
                        
                        <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between text-xs text-green-900 border-b border-green-200 pb-2">
                                <span className="flex items-center gap-1"><Users size={12}/> Max Guests</span>
                                <span className="font-bold">{currentSpecs.guests} Pax</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-green-900 border-b border-green-200 pb-2">
                                <span className="flex items-center gap-1"><Briefcase size={12}/> Luggage</span>
                                <span className="font-bold">{currentSpecs.luggageCheck}</span>
                            </div>
                             <div className="flex items-center justify-between text-xs text-green-900">
                                <span className="flex items-center gap-1"><Briefcase size={12}/> Carry-on</span>
                                <span className="font-bold">{currentSpecs.luggageCarry}</span>
                            </div>
                        </div>
                    </div>
                </div>
                )}
        </section>

        {/* --- JOURNEY DESCRIPTION --- */}
        <section className="mt-6">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 p-1 rounded"><Briefcase size={12}/></span>
                Journey / Service Description
            </label>
            <textarea 
                rows={3}
                placeholder="e.g. From Barcelona, journey to Montserrat Mountain to marvel at its unique peaks..."
                value={formData.serviceDescription || ''}
                onChange={(e) => updateField('serviceDescription', e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:bg-white focus:border-green-500 transition-all resize-none shadow-sm"
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">
                This text will appear on the client's itinerary.
            </p>
        </section>


          {/* 3. PACKAGING STATUS (COST REMOVED) */}
        <section className="space-y-4 ml-4  pt-4">
            <div className="grid grid-cols-12 gap-6 items-center">
                {/* PACKAGING SELECTOR */}
                <div className="col-span-12">
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Packaging Status</label>
                    <div className="flex gap-2">
                        {['included', 'excluded', 'optional'].map(type => (
                            <div 
                                key={type}
                                // @ts-ignore
                                onClick={() => updateField('inclusionType', type)}
                                className={`cursor-pointer border rounded-lg px-4 py-2 flex items-center gap-2 transition-all ${
                                    formData.inclusionType === type 
                                    ? (type === 'included' ? 'bg-green-50 border-green-500 text-green-700' : type === 'excluded' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-blue-50 border-blue-500 text-blue-700')
                                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-400'
                                }`}
                            >
                                {type === 'included' && <CheckCircle2 size={16}/>}
                                {type === 'excluded' && <Ban size={16}/>}
                                {type === 'optional' && <PlusSquare size={16}/>}
                                <span className="text-[12px] font-bold capitalize">{type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* 4. LOGISTICS */}
        <section className="bg-gray-50 rounded-xl p-5 border border-gray-200 mt-6">
            <h3 className="text-xs font-bold text-gray-600 uppercase mb-4 flex items-center gap-2">
                <MapPin size={14}/> Logistics Details
            </h3>

            <div className="grid grid-cols-12 gap-6">
                
                {/* PICKUP SECTION */}
                <div className="col-span-6 space-y-3">
                    <label className="text-xs font-bold text-gray-600 uppercase block">Pick-up</label>
                    
                    <div className="relative">
                        <input 
                            type="text" 
                            value={formData.pickupLocation} 
                            onChange={e => updateField('pickupLocation', e.target.value)}
                            className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:border-green-500 outline-none" 
                            placeholder="Pickup Location"
                        />
                        {currentStay && !initialData && (
                            <div className="absolute right-2 top-2.5 text-[10px] text-green-600 font-bold bg-green-50 px-1.5 rounded">
                                From Hotel
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400"/>
                        <input 
                            type="time" 
                            value={formData.pickupTime} 
                            onChange={e => updateField('pickupTime', e.target.value)} 
                            className="p-2 border rounded-md text-sm outline-none focus:border-green-500"
                        />
                    </div>
                </div>

                {/* DROP-OFF / DURATION SECTION */}
                <div className="col-span-6 space-y-3 border-l border-gray-200 pl-6">
                    
                    {formData.subType === 'transfer' ? (
                        <>
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-gray-600 uppercase">Drop-off</label>
                                
                                {existingActivities.length > 0 && (
                                    <select 
                                        className="text-[10px] bg-white border border-gray-300 rounded px-1 py-0.5 outline-none max-w-[120px]"
                                        onChange={(e) => updateField('dropoffLocation', e.target.value)}
                                        value=""
                                    >
                                        <option value="" disabled>Select Activity...</option>
                                        {existingActivities.map(act => (
                                            <option key={act.id} value={act.heading}>{act.heading}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <input 
                                type="text" 
                                value={formData.dropoffLocation} 
                                onChange={e => updateField('dropoffLocation', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:border-green-500 outline-none" 
                                placeholder="Drop-off Location"
                            />
                             <div className="flex items-center gap-2">
                                <Clock size={14} className="text-gray-400"/>
                                <input 
                                    type="time" 
                                    value={formData.dropoffTime || ''} 
                                    onChange={e => updateField('dropoffTime', e.target.value)} 
                                    className="p-2 border rounded-md text-sm outline-none focus:border-green-500"
                                />
                            </div>
                        </>
                    ) : (
                        // <>
                        //     <label className="text-xs font-bold text-gray-600 uppercase">Duration</label>
                        //     <div className="relative">
                        //         <input 
                        //             type="text" 
                        //             value={formData.duration || ''} 
                        //             onChange={e => updateField('duration', e.target.value)}
                        //             className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:border-green-500 outline-none" 
                        //             placeholder="e.g. 8 Hours / 80 Km"
                        //         />
                        //         <Clock className="absolute right-3 top-3 text-gray-400" size={16} />
                        //     </div>
                        //     <p className="text-[10px] text-gray-400 mt-1">Vehicle remains with you for this duration.</p>
                        // </>


                        <div className="space-y-3">
        <label className="text-xs font-bold text-gray-600 uppercase">Service Duration</label>
        <div className="relative">
            <input 
                type="text" 
                value={formData.duration || ''} 
                onChange={e => updateField('duration', e.target.value)}
                className="w-full px-3 py-2.5 border border-green-300 bg-green-50/30 rounded-lg text-sm font-bold focus:border-green-500 outline-none" 
                placeholder="e.g. 8 Hours / 80 Km"
            />
            <Clock className="absolute right-3 top-3 text-green-600" size={16} />
        </div>
        <p className="text-[10px] text-gray-400 mt-1 font-medium">
            
        </p>
    </div>
                    ) }
                </div>
            </div>
        </section>

      
      </div>
    </div>
  );
}