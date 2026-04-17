
// "use client";

// import React, { useState, useMemo, useEffect } from 'react';
// import { 
//   MapPin, Clock, Users, Briefcase, Car, 
//   CheckCircle2, Ban, PlusSquare, 
//   Phone, Mail, DollarSign, Train
// } from 'lucide-react';
// import { 
//   Transport, 
//   TRANSPORT_MODES, 
//   VEHICLE_TYPES, 
//   VEHICLE_SPECS,
//   Stay, 
//   Activity
// } from '../constants/daywiseConstants';
// import { useItinerary } from '@/app/context/ItineraryContext';
// import { useSRM } from '@/app/context/SRMContext'; 

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
//     price: 0, // Kept in data structure but input removed
//     linkedSupplierId: '' 
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

//   const { itineraryData } = useItinerary();
//   // Safe fallback to 2 if undefined
//   const globalPax = (itineraryData && typeof itineraryData.numberOfTravelers === 'number') 
//     ? itineraryData.numberOfTravelers 
//     : 2;
  
//   const { transports, suppliers } = useSRM(); 

//   // Filter Vehicles
//   const availableSrmVehicles = useMemo(() => {
//     if (!city) return [];
//     return transports.filter(t => 
//       (t.city || "").toLowerCase() === (city || "").toLowerCase() && 
//       t.status === 'Active'
//     );
//   }, [transports, city]);

//   // Initialize State
//   const [formData, setFormData] = useState<Transport>(() => {
//     if (initialData) {
//       return {
//         ...initialData,
//         paxCount: (initialData.paxCount !== undefined && initialData.paxCount !== null) 
//                   ? initialData.paxCount 
//                   : globalPax 
//       };
//     }
//     return { 
//       ...createDefaultTransport(Date.now()),
//       paxCount: globalPax, 
//       pickupLocation: currentStay ? currentStay.hotelName : ''
//     };
//   });

//   // Smart Supplier Logic
//   const availableSuppliers = useMemo(() => {
//     return suppliers.filter(s => {
//       const basicCheck = s.status === 'Active' && s.services.includes('Transport');
//       const cityCheck = s.city.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(s.city.toLowerCase());
//       return basicCheck && cityCheck;
//     });
//   }, [suppliers, city]);

//   useEffect(() => {
//      if (!formData.linkedSupplierId) {
//         const preferred = availableSuppliers.find(s => s.isPreferred);
//         if (preferred) {
//            // @ts-ignore
//            setFormData(prev => ({ ...prev, linkedSupplierId: preferred.id }));
//         }
//      }
//   }, [availableSuppliers]);

//   // @ts-ignore
//   const selectedSupplier = suppliers.find(s => s.id === formData.linkedSupplierId);
  
//   // 🌟 NEW: Updated Ticket Mode Check (Added 'ferry', Removed 'bus')
//   const isTicketMode = useMemo(() => {
//     return ['flight', 'rail', 'ferry'].includes(formData.mode);
//   }, [formData.mode]);

//   // 🌟 NEW: SMART AUTO-DURATION CALCULATOR FOR TICKETS
//   useEffect(() => {
//     if (isTicketMode && formData.pickupTime && formData.dropoffTime) {
//         const [startH, startM] = formData.pickupTime.split(':').map(Number);
//         const [endH, endM] = formData.dropoffTime.split(':').map(Number);

//         let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
        
//         // Handle overnight journeys (e.g. 23:00 to 02:00)
//         if (diffMins < 0) {
//             diffMins += 24 * 60; 
//         }

//         const h = Math.floor(diffMins / 60);
//         const m = diffMins % 60;
        
//         // Format to "1 h 30 min"
//         const durationStr = `${h > 0 ? h + ' h ' : ''}${m} min`.trim();

//         if (formData.duration !== durationStr) {
//             setFormData(prev => ({ ...prev, duration: durationStr }));
//         }
//     }
//   }, [formData.pickupTime, formData.dropoffTime, isTicketMode]);


//   // Dynamic Visual Specs
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

//   // Handlers
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
//                   serviceDescription: srmMatch.description || prev.serviceDescription || '', 
//                   pickupLocation: srmMatch.defaultPickup || prev.pickupLocation, 
//                   dropoffLocation: srmMatch.defaultDropoff || prev.dropoffLocation,
//                   duration: srmMatch.defaultDuration || prev.duration
//               };
//           } else {
//               return { ...prev, vehicleType: newType };
//           }
//       });
//   };

//   return (
//     <div className="flex flex-col h-full bg-white rounded-xl shadow-xl overflow-hidden w-full border border-gray-300">
      
//       {/* --- HEADER --- */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
//          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
//             {/* 🌟 NEW: Filtered out "bus" from the tabs dynamically */}
//             {TRANSPORT_MODES.filter(mode => ['vehicle', 'flight', 'rail', 'ferry'].includes(mode.id)).map((mode) => {
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
        
//         {/* 1. SERVICE CONFIGURATION (Transfer vs Disposal) - HIDDEN IF TICKET MODE */}
//         {!isTicketMode && (
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
//                         <div className="text-sm font-bold text-gray-800">Disposal (Full Day)</div>
//                         <div className="text-[10px] text-gray-400">Vehicle stays with client (e.g. 8 Hrs / 80 Km)</div>
//                     </div>
//                 </label>
//             </div>
//         </section>
//         )}

//         {/* 2. VEHICLE / TICKET SELECTION */}
//         <section className="grid grid-cols-12 gap-6">
                
//                 {/* Inputs Column */}
//                 <div className={`${isTicketMode ? 'col-span-12' : 'col-span-7'} space-y-4`}>
                    
//                     {/* Vehicle/Transport Type Selection */}
//                     <div>
//                         <label className="block text-xs font-bold text-gray-500 mb-1 flex justify-between">
//                             {isTicketMode ? 'Ticket / Transport Class' : 'Vehicle Type'}
                            
//                             {!isTicketMode && availableSrmVehicles.some(v => v.vehicleType === formData.vehicleType) && (
//                                 <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
//                                     SRM Spec Available
//                                 </span>
//                             )}
//                         </label>

//                         {isTicketMode ? (
//                             <input 
//                                 type="text" placeholder="e.g. Economy Class, 2nd AC, Premium"
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
//                                             {v.vehicleType}
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

//                     {/* --- [INPUTS GRID - Quantity Only] --- */}
//                     <div className={`grid ${isTicketMode ? 'grid-cols-4' : 'grid-cols-2'} gap-4`}>
                        
//                         {/* 1. QUANTITY (Vehicles or Tickets) */}
//                         <div className={`${isTicketMode ? 'col-span-2' : ''}`}>
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
//                             // If Ticket mode, show Ref No next to it
//                             <div className="col-span-2">
//                                 <label className="block text-xs font-bold text-gray-500 mb-1">Ref No. (Optional)</label>
//                                 <input 
//                                     type="text" placeholder="Train/PNR No."
//                                     value={formData.flightNumber || ''}
//                                     onChange={(e) => updateField('flightNumber', e.target.value)}
//                                     className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500"
//                                 />
//                             </div>
//                         ) : (
//                             // If Vehicle mode, show PAX COUNT here
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
//                 </div>

//                 {/* Visual Spec Card - Only show for Vehicles */}
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

//         {/* 🌟 NEW: DYNAMIC LOGISTICS RENDERER */}
//         {isTicketMode ? (
//             // ============================================
//             // TICKET MODE: 6-COLUMN GRID (RAIL/FLIGHT/FERRY)
//             // ============================================
//             <section className="bg-gray-50 rounded-xl p-5 border border-gray-200 mt-6 shadow-sm">
//                 <h3 className="text-xs font-bold text-gray-600 uppercase mb-4 flex items-center gap-2">
//                     <Train size={14}/> Transit Schedule & Details
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
//                     {/* Col 1: Start Time */}
//                     <div className="flex flex-col">
//                         <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">Start Time</label>
//                         <input 
//                             type="time" 
//                             value={formData.pickupTime} 
//                             onChange={e => updateField('pickupTime', e.target.value)} 
//                             className="p-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium outline-none focus:border-green-500"
//                         />
//                     </div>
                    
//                     {/* Col 2: End Time */}
//                     <div className="flex flex-col">
//                         <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">End Time</label>
//                         <input 
//                             type="time" 
//                             value={formData.dropoffTime || ''} 
//                             onChange={e => updateField('dropoffTime', e.target.value)} 
//                             className="p-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium outline-none focus:border-green-500"
//                         />
//                     </div>

//                     {/* Col 3: Departure */}
//                     <div className="flex flex-col">
//                         <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">Departure</label>
//                         <input 
//                             type="text" 
//                             placeholder="Station"
//                             value={formData.pickupLocation} 
//                             onChange={e => updateField('pickupLocation', e.target.value)}
//                             className="p-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium outline-none focus:border-green-500"
//                         />
//                     </div>

//                     {/* Col 4: Arrival */}
//                     <div className="flex flex-col">
//                         <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">Arrival</label>
//                         <input 
//                             type="text" 
//                             placeholder="Station"
//                             value={formData.dropoffLocation} 
//                             onChange={e => updateField('dropoffLocation', e.target.value)}
//                             className="p-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium outline-none focus:border-green-500"
//                         />
//                     </div>

//                     {/* Col 5: Duration */}
//                     <div className="flex flex-col">
//                         <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">Duration</label>
//                         <input 
//                             type="text" 
//                             placeholder="Calculated"
//                             value={formData.duration || ''} 
//                             onChange={e => updateField('duration', e.target.value)}
//                             className="p-2.5 border border-green-300 bg-green-50/50 text-green-700 rounded-lg text-sm font-bold outline-none focus:border-green-500"
//                         />
//                     </div>

//                     {/* Col 6: Travel Info */}
//                     <div className="flex flex-col">
//                         <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">Travel Info <span className="text-red-500 bg-red-50 px-1 rounded-full border border-red-200">i</span></label>
//                         <input 
//                             type="text" 
//                             placeholder="e.g. Platform 4, Seat 14A"
//                             value={formData.serviceDescription || ''} 
//                             onChange={e => updateField('serviceDescription', e.target.value)}
//                             className="p-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium outline-none focus:border-green-500"
//                         />
//                     </div>
//                 </div>
//             </section>
//         ) : (
//             // ============================================
//             // VEHICLE MODE: ORIGINAL LOGISTICS & DESC
//             // ============================================
//             <>
//                 <section className="mt-6">
//                     <label className="block text-xs font-bold text-gray-500 mb-2 uppercase flex items-center gap-2">
//                         <span className="bg-blue-100 text-blue-600 p-1 rounded"><Briefcase size={12}/></span>
//                         Journey / Service Description
//                     </label>
//                     <textarea 
//                         rows={3}
//                         placeholder="e.g. From Barcelona, journey to Montserrat Mountain to marvel at its unique peaks..."
//                         value={formData.serviceDescription || ''}
//                         onChange={(e) => updateField('serviceDescription', e.target.value)}
//                         className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:bg-white focus:border-green-500 transition-all resize-none shadow-sm"
//                     />
//                     <p className="text-[10px] text-gray-400 mt-1 text-right">
//                         This text will appear on the client's itinerary.
//                     </p>
//                 </section>

//                 <section className="bg-gray-50 rounded-xl p-5 border border-gray-200 mt-6">
//                     <h3 className="text-xs font-bold text-gray-600 uppercase mb-4 flex items-center gap-2">
//                         <MapPin size={14}/> Logistics Details
//                     </h3>

//                     <div className="grid grid-cols-12 gap-6">
//                         {/* PICKUP SECTION */}
//                         <div className="col-span-6 space-y-3">
//                             <label className="text-xs font-bold text-gray-600 uppercase block">Pick-up</label>
                            
//                             <div className="relative">
//                                 <input 
//                                     type="text" 
//                                     value={formData.pickupLocation} 
//                                     onChange={e => updateField('pickupLocation', e.target.value)}
//                                     className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:border-green-500 outline-none" 
//                                     placeholder="Pickup Location"
//                                 />
//                                 {currentStay && !initialData && (
//                                     <div className="absolute right-2 top-2.5 text-[10px] text-green-600 font-bold bg-green-50 px-1.5 rounded">
//                                         From Hotel
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="flex items-center gap-2">
//                                 <Clock size={14} className="text-gray-400"/>
//                                 <input 
//                                     type="time" 
//                                     value={formData.pickupTime} 
//                                     onChange={e => updateField('pickupTime', e.target.value)} 
//                                     className="p-2 border rounded-md text-sm outline-none focus:border-green-500"
//                                 />
//                             </div>
//                         </div>

//                         {/* DROP-OFF / DURATION SECTION */}
//                         <div className="col-span-6 space-y-3 border-l border-gray-200 pl-6">
//                             {formData.subType === 'transfer' ? (
//                                 <>
//                                     <div className="flex justify-between items-center">
//                                         <label className="text-xs font-bold text-gray-600 uppercase">Drop-off</label>
                                        
//                                         {existingActivities.length > 0 && (
//                                             <select 
//                                                 className="text-[10px] bg-white border border-gray-300 rounded px-1 py-0.5 outline-none max-w-[120px]"
//                                                 onChange={(e) => updateField('dropoffLocation', e.target.value)}
//                                                 value=""
//                                             >
//                                                 <option value="" disabled>Select Activity...</option>
//                                                 {existingActivities.map(act => (
//                                                     <option key={act.id} value={act.heading}>{act.heading}</option>
//                                                 ))}
//                                             </select>
//                                         )}
//                                     </div>

//                                     <input 
//                                         type="text" 
//                                         value={formData.dropoffLocation} 
//                                         onChange={e => updateField('dropoffLocation', e.target.value)}
//                                         className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:border-green-500 outline-none" 
//                                         placeholder="Drop-off Location"
//                                     />
//                                     <div className="flex items-center gap-2">
//                                         <Clock size={14} className="text-gray-400"/>
//                                         <input 
//                                             type="time" 
//                                             value={formData.dropoffTime || ''} 
//                                             onChange={e => updateField('dropoffTime', e.target.value)} 
//                                             className="p-2 border rounded-md text-sm outline-none focus:border-green-500"
//                                         />
//                                     </div>
//                                 </>
//                             ) : (
//                                 <div className="space-y-3">
//                                     <label className="text-xs font-bold text-gray-600 uppercase">Service Duration</label>
//                                     <div className="relative">
//                                         <input 
//                                             type="text" 
//                                             value={formData.duration || ''} 
//                                             onChange={e => updateField('duration', e.target.value)}
//                                             className="w-full px-3 py-2.5 border border-green-300 bg-green-50/30 rounded-lg text-sm font-bold focus:border-green-500 outline-none" 
//                                             placeholder="e.g. 8 Hours / 80 Km"
//                                         />
//                                         <Clock className="absolute right-3 top-3 text-green-600" size={16} />
//                                     </div>
//                                     <p className="text-[10px] text-gray-400 mt-1 font-medium"></p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </section>
//             </>
//         )}

//         {/* 3. PACKAGING STATUS (Shown for both Vehicle and Ticket modes) */}
//         <section className="space-y-4 ml-4 pt-4 border-t border-gray-100">
//             <div className="grid grid-cols-12 gap-6 items-center">
//                 {/* PACKAGING SELECTOR */}
//                 <div className="col-span-12">
//                     <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Packaging Status</label>
//                     <div className="flex gap-2">
//                         {['included', 'excluded', 'optional'].map(type => (
//                             <div 
//                                 key={type}
//                                 // @ts-ignore
//                                 onClick={() => updateField('inclusionType', type)}
//                                 className={`cursor-pointer border rounded-lg px-4 py-2 flex items-center gap-2 transition-all ${
//                                     formData.inclusionType === type 
//                                     ? (type === 'included' ? 'bg-green-50 border-green-500 text-green-700' : type === 'excluded' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-blue-50 border-blue-500 text-blue-700')
//                                     : 'bg-white border-gray-200 hover:border-gray-300 text-gray-400'
//                                 }`}
//                             >
//                                 {type === 'included' && <CheckCircle2 size={16}/>}
//                                 {type === 'excluded' && <Ban size={16}/>}
//                                 {type === 'optional' && <PlusSquare size={16}/>}
//                                 <span className="text-[12px] font-bold capitalize">{type}</span>
//                             </div>
//                         ))}
//                     </div>
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
  Phone, Mail, DollarSign, Train, Plane, Ship
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
const createDefaultTransport = (id: number, mode: string = 'vehicle'): Transport => ({
    id,
    type: 'transport',
    mode: mode as any,
    subType: 'transfer', 
    inclusionType: 'included',
    vehicleType: mode === 'rail' ? '2nd AC Sleeper Class' : mode === 'flight' ? 'Economy Class' : mode === 'ferry' ? 'Standard Ferry' : 'Sedan Car',
    vehicleCount: 1,
    paxCount: 1,
    pickupLocation: '',
    pickupTime: '09:00',
    dropoffLocation: '', 
    dropoffTime: '10:00',
    duration: '',
    price: 0, 
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

  // 🌟 NEW: THE "LOCKER" SYSTEM (Tab-Isolated State Management) 🌟
  // Track which tab is active (Defaults to 'vehicle' or the mode being edited)
  const [activeTab, setActiveTab] = useState<string>(initialData?.mode || 'vehicle');

  // Store independent objects for each tab
  const [tabData, setTabData] = useState<Record<string, Transport>>(() => {
      const basePickup = currentStay ? currentStay.hotelName : '';
      
      const defaults: Record<string, Transport> = {
          vehicle: { ...createDefaultTransport(Date.now(), 'vehicle'), paxCount: globalPax, pickupLocation: basePickup },
          flight: { ...createDefaultTransport(Date.now() + 1, 'flight'), paxCount: globalPax, pickupLocation: basePickup },
          rail: { ...createDefaultTransport(Date.now() + 2, 'rail'), paxCount: globalPax, pickupLocation: basePickup },
          ferry: { ...createDefaultTransport(Date.now() + 3, 'ferry'), paxCount: globalPax, pickupLocation: basePickup },
      };

      // If editing an existing item, overwrite its specific locker
      if (initialData && initialData.mode) {
          defaults[initialData.mode] = {
              ...initialData,
              paxCount: (initialData.paxCount !== undefined && initialData.paxCount !== null) 
                  ? initialData.paxCount 
                  : globalPax 
          };
      }

      return defaults;
  });

  // 🌟 THE POINTER: Always points to the currently active locker
  const formData = tabData[activeTab];

  // Smart Supplier Logic
  const availableSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const basicCheck = s.status === 'Active' && s.services.includes('Transport');
      const cityCheck = s.city.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(s.city.toLowerCase());
      return basicCheck && cityCheck;
    });
  }, [suppliers, city]);

  // Smart Supplier Injection (Updates only the active locker)
  useEffect(() => {
     if (!formData.linkedSupplierId) {
        const preferred = availableSuppliers.find(s => s.isPreferred);
        if (preferred) {
           setTabData(prev => ({
               ...prev,
               [activeTab]: { ...prev[activeTab], linkedSupplierId: preferred.id as any }
           }));
        }
     }
  }, [availableSuppliers, activeTab, formData.linkedSupplierId]);

  const selectedSupplier = suppliers.find(s => s.id === formData.linkedSupplierId);
  
  const isTicketMode = useMemo(() => {
    return ['flight', 'rail', 'ferry'].includes(activeTab);
  }, [activeTab]);

  // SMART AUTO-DURATION CALCULATOR FOR TICKETS (Updates only the active locker)

  // 🌟 SMART AUTO-DURATION CALCULATOR FOR TICKETS (Updates only the active locker)

  // 🌟 SMART AUTO-DURATION CALCULATOR (Now works for Vehicle Transfers too!)
  useEffect(() => {
    // 👇 Added "|| formData.subType === 'transfer'" so cars calculate automatically
    if ((isTicketMode || formData.subType === 'transfer') && formData.pickupTime && formData.dropoffTime) {
        const [startH, startM] = formData.pickupTime.split(':').map(Number);
        const [endH, endM] = formData.dropoffTime.split(':').map(Number);

        let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
        
        // Handle overnight
        if ((formData as Record<string, any>).arrivalDayOffset === '+1') {
            diffMins += (24 * 60); 
        } else if (diffMins < 0) {
            diffMins += (24 * 60); 
        }

        const h = Math.floor(diffMins / 60);
        const m = diffMins % 60;
        const durationStr = `${h > 0 ? h + ' h ' : ''}${m} min`.trim();

        if (formData.duration !== durationStr) {
            setTabData(prev => ({
                ...prev,
                [activeTab]: { ...prev[activeTab], duration: durationStr }
            }));
        }
    }
  }, [formData.pickupTime, formData.dropoffTime, (formData as Record<string, any>).arrivalDayOffset, isTicketMode, formData.subType, activeTab]);

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
    setTabData(prev => ({
        ...prev,
        [activeTab]: { 
            ...prev[activeTab], 
            [field]: value 
        }
    }));
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newType = e.target.value;
      const srmMatch = availableSrmVehicles.find(t => t.vehicleType === newType);
      
      setTabData(prev => {
          if (srmMatch) {
              return { 
                  ...prev, 
                  [activeTab]: {
                      ...prev[activeTab],
                      vehicleType: newType,
                      serviceDescription: srmMatch.description || prev[activeTab].serviceDescription || '', 
                      pickupLocation: srmMatch.defaultPickup || prev[activeTab].pickupLocation, 
                      dropoffLocation: srmMatch.defaultDropoff || prev[activeTab].dropoffLocation,
                      duration: srmMatch.defaultDuration || prev[activeTab].duration
                  }
              };
          } else {
              return {
                  ...prev,
                  [activeTab]: {
                      ...prev[activeTab],
                      vehicleType: newType
                  }
              };
          }
      });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-xl overflow-hidden w-full border border-gray-300">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
         <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {TRANSPORT_MODES.filter(mode => ['vehicle', 'flight', 'rail', 'ferry'].includes(mode.id)).map((mode) => {
                const Icon = mode.icon;
                const isActive = activeTab === mode.id; // 🌟 checks the activeTab state
                return (
                    <button 
                        key={mode.id}
                        // 🌟 Instead of changing data, we just change the viewing tab
                        onClick={() => setActiveTab(mode.id)}
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
        
        {/* 1. SERVICE CONFIGURATION (Transfer vs Disposal) - HIDDEN IF TICKET MODE */}
        {!isTicketMode && (
        <section>
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
        )}


        {/* 2. VEHICLE / TICKET SELECTION */}

        {/* 2. VEHICLE / TICKET SELECTION */}
        <section className="grid grid-cols-12 gap-6">
                
                {/* Inputs Column */}
                <div className={`${isTicketMode ? 'col-span-12' : 'col-span-7'} space-y-4`}>
                    
                    {/* Vehicle/Transport Type Selection */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 flex justify-between">
                            {/* 🌟 DYNAMIC LABEL: Airline vs Ferry vs Train */}
                            {activeTab === 'flight' ? 'Airline Name' : activeTab === 'ferry' ? 'Ferry Operator / Vessel' : isTicketMode ? 'Ticket / Transport Class' : 'Vehicle Type'}
                            
                            {!isTicketMode && availableSrmVehicles.some(v => v.vehicleType === formData.vehicleType) && (
                                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                    SRM Spec Available
                                </span>
                            )}
                        </label>

                        {isTicketMode ? (
                            <input 
                                type="text" 
                                placeholder={activeTab === 'flight' ? 'e.g. Swiss Airlines, Delta' : activeTab === 'ferry' ? 'e.g. Blue Star Ferries' : 'e.g. 2nd AC, Premium'}
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
                    <div className={`grid ${isTicketMode ? 'grid-cols-4' : 'grid-cols-2'} gap-4`}>
                        
                        {/* 1. QUANTITY (Vehicles or Tickets) */}
                        <div className={`${isTicketMode ? 'col-span-2' : ''}`}>
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
                            // If Ticket mode, show Ref No next to it
                            <div className="col-span-2">
                                {/* 🌟 DYNAMIC LABEL: Flight No vs Booking Ref */}
                                <label className="block text-xs font-bold text-gray-500 mb-1">
                                    {activeTab === 'flight' ? 'Flight No.' : activeTab === 'ferry' ? 'Booking Ref' : 'Train/PNR No.'}
                                </label>
                                <input 
                                    type="text" 
                                    placeholder={activeTab === 'flight' ? 'e.g. LX 123' : 'Optional'}
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

        {/* 🌟 NEW: DYNAMIC LOGISTICS RENDERER */}
        {isTicketMode ? (
            // ============================================
            // TICKET MODE: MULTI-ROW GRID (RAIL/FLIGHT/FERRY)
            // ============================================
            <section className="bg-gray-50 rounded-xl p-5 border border-gray-200 mt-6 shadow-sm">
                <h3 className="text-xs font-bold text-gray-600 uppercase mb-4 flex items-center gap-2">
                    {activeTab === 'flight' ? <Plane size={14}/> : activeTab === 'rail' ? <Train size={14}/> : <Ship size={14}/>} 
                    Transit Schedule & Details
                </h3>

                {/* ROW 1: Times and Locations */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Start Time */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">Start Time</label>
                        <input 
                            type="time" 
                            value={formData.pickupTime} 
                            onChange={e => updateField('pickupTime', e.target.value)} 
                            className="p-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium outline-none focus:border-green-500"
                        />
                    </div>
                    
                    {/* End Time (+1 Day Logic for Flights) */}
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">End Time</label>
                            {activeTab === 'flight' && (
                                <label className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded cursor-pointer flex items-center gap-1 border border-blue-200">
                              <input 
                                        type="checkbox" 
                                        className="w-2.5 h-2.5 accent-blue-600 cursor-pointer"
                                        checked={(formData as any).arrivalDayOffset === '+1'}
                                        onChange={(e) => updateField('arrivalDayOffset' as any, e.target.checked ? '+1' : '')}
                                    />
                                    +1 Day
                                </label>
                            )}
                        </div>
                        <input 
                            type="time" 
                            value={formData.dropoffTime || ''} 
                            onChange={e => updateField('dropoffTime', e.target.value)} 
                            className="p-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium outline-none focus:border-green-500"
                        />
                    </div>

                    {/* Departure */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">
                            {activeTab === 'flight' ? 'Dep. Airport & Terminal' : activeTab === 'ferry' ? 'Departure Port' : 'Departure Station'}
                        </label>
                        <input 
                            type="text" 
                            placeholder={activeTab === 'flight' ? 'e.g. SFO - T3' : activeTab === 'ferry' ? 'Port/Pier' : 'Station'}
                            value={formData.pickupLocation} 
                            onChange={e => updateField('pickupLocation', e.target.value)}
                            className="p-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium outline-none focus:border-green-500"
                        />
                    </div>

                    {/* Arrival */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">
                            {activeTab === 'flight' ? 'Arr. Airport & Terminal' : activeTab === 'ferry' ? 'Arrival Port' : 'Arrival Station'}
                        </label>
                        <input 
                            type="text" 
                            placeholder={activeTab === 'flight' ? 'e.g. JFK - T1' : activeTab === 'ferry' ? 'Port/Pier' : 'Station'}
                            value={formData.dropoffLocation} 
                            onChange={e => updateField('dropoffLocation', e.target.value)}
                            className="p-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium outline-none focus:border-green-500"
                        />
                    </div>
                </div>

                {/* ROW 2: Duration, Info, and Flight Extras */}
                <div className={`grid grid-cols-1 ${activeTab === 'flight' ? 'md:grid-cols-4' : 'md:grid-cols-2'} gap-4`}>
                    {/* Duration */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">Duration</label>
                        <input 
                            type="text" 
                            placeholder="Calculated"
                            value={formData.duration || ''} 
                            onChange={e => updateField('duration', e.target.value)}
                            className="p-2.5 border border-green-300 bg-green-50/50 text-green-700 rounded-lg text-sm font-bold outline-none focus:border-green-500"
                        />
                    </div>

                    {/* Travel Info */}
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                            {activeTab === 'flight' ? 'Cabin / Class' : activeTab === 'ferry' ? 'Seating / Deck' : 'Travel Info'}
                        </label>
                        <input 
                            type="text" 
                            placeholder={activeTab === 'flight' ? 'e.g. Economy, Seat 12A' : activeTab === 'ferry' ? 'e.g. Deck Lounge' : 'e.g. Platform 4, Seat 14A'}
                            value={formData.serviceDescription || ''} 
                            onChange={e => updateField('serviceDescription', e.target.value)}
                            className="p-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium outline-none focus:border-green-500"
                        />
                    </div>

           
                    {/* 🌟 FLIGHT ONLY: Stops & Layovers */}
                    {activeTab === 'flight' && (
                        <>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">Stops</label>
                                <select 
                                    // Tell TS to ignore the missing property error using (formData as any)
                                    value={(formData as any).flightStops || 'Direct'} 
                                    onChange={e => updateField('flightStops' as any, e.target.value)}
                                    className="p-2.5 border border-gray-300 bg-white rounded-lg text-sm font-medium outline-none focus:border-green-500"
                                >
                                    <option value="Direct">Direct Flight</option>
                                    <option value="1 stop">1 Stop</option>
                                    <option value="2 stops">2+ Stops</option>
                                </select>
                            </div>

                            {/* Show Layover input ONLY if it's not a Direct flight */}
                            {(formData as any).flightStops && (formData as any).flightStops !== 'Direct' && (
                                <div className="flex flex-col animate-in fade-in duration-200">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1">Layover Hub(s)</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 2h 35m in ZRH"
                                        value={(formData as any).layoverInfo || ''} 
                                        onChange={e => updateField('layoverInfo' as any, e.target.value)}
                                        className="p-2.5 border border-blue-300 bg-blue-50/50 text-blue-800 rounded-lg text-sm font-medium outline-none focus:border-blue-500"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        ) : (
            // ============================================
            // VEHICLE MODE: ORIGINAL LOGISTICS & DESC
            // ============================================
            <>
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
                                    <p className="text-[10px] text-gray-400 mt-1 font-medium"></p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </>
        )}
     

    

        {/* 3. PACKAGING STATUS (Shown for both Vehicle and Ticket modes) */}
        <section className="space-y-4 ml-4 pt-4 border-t border-gray-100">
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

      </div>
    </div>
  );
}