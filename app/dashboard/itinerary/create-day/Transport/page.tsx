
// "use client";

// import React, { useState, useEffect } from 'react';
// import { 
//   MapPin, Clock, Users, Briefcase, Car, Plane, Train, Ship, Info, ArrowRight 
// } from 'lucide-react';
// import { 
//   Transport, 
//   TRANSPORT_MODES, 
//   VEHICLE_TYPES, 
//   VEHICLE_SPECS,
//   Stay, 
//   Activity
// } from '../constants/daywiseConstants';

// // Default Factory
// const createDefaultTransport = (id: number): Transport => ({
//     id,
//     type: 'transport',
//     mode: 'vehicle',
//     subType: 'transfer', // Default to Transfer
//     serviceType: 'Planned',
    
//     vehicleType: 'Sedan Car',
//     vehicleCount: 1,
    
//     pickupLocation: '',
//     pickupTime: '09:00',
//     dropoffLocation: '', // Default empty
//     dropoffTime: '10:00',
//     duration: '',
    
//     price: 0,
// });

// interface TransportFormProps {
//   initialData?: Transport;
//   currentStay?: Stay;          // <--- For Auto-Filling Pickup
//   existingActivities?: Activity[]; // <--- For Suggesting Drop-offs
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
  
//   // --- STATE ---
//   const [formData, setFormData] = useState<Transport>(
//       initialData || { 
//         ...createDefaultTransport(Date.now()),
//         // SMART LOGIC: Auto-fill Pickup from Stay if new
//         pickupLocation: currentStay ? currentStay.hotelName : ''
//       }
//   );
  
//   // Get Visual Specs
//   const currentSpecs = VEHICLE_SPECS[formData.vehicleType] || VEHICLE_SPECS['default'];

//   // --- HANDLERS ---
//   const updateField = (field: keyof Transport, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
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
        
//         {/* 1. SERVICE CONFIGURATION (Transfer vs Disposal) */}
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

//         {/* 2. VEHICLE SELECTION (Visual Card) */}
//         {formData.mode === 'vehicle' && (
//             <section className="grid grid-cols-12 gap-6">
                
//                 {/* Inputs */}
//                 <div className="col-span-7 space-y-4">
//                     <div>
//                         <label className="block text-xs font-bold text-gray-500 mb-1">Vehicle Type</label>
//                         <select 
//                             value={formData.vehicleType}
//                             onChange={(e) => updateField('vehicleType', e.target.value)}
//                             className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 outline-none focus:border-green-500"
//                         >
//                             {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
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
//                         {/* Optional Flight Number if needed */}
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

//         {/* 3. LOGISTICS (Smart Auto-fill) */}
//         <section className="bg-gray-50 rounded-xl p-5 border border-gray-200">
//             <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
//                 <MapPin size={14}/> Logistics Details
//             </h3>

//             <div className="grid grid-cols-12 gap-6">
                
//                 {/* PICKUP SECTION */}
//                 <div className="col-span-6 space-y-3">
//                     <label className="text-xs font-bold text-gray-600 uppercase block">Pick-up</label>
                    
//                     {/* Location Input */}
//                     <div className="relative">
//                         <input 
//                             type="text" 
//                             value={formData.pickupLocation} 
//                             onChange={e => updateField('pickupLocation', e.target.value)}
//                             className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:border-green-500 outline-none" 
//                             placeholder="Pickup Location"
//                         />
//                         {/* Helper Text showing source */}
//                         {currentStay && !initialData && (
//                             <div className="absolute right-2 top-2.5 text-[10px] text-green-600 font-bold bg-green-50 px-1.5 rounded">
//                                 From Hotel
//                             </div>
//                         )}
//                     </div>

//                     {/* Time Input */}
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
                                
//                                 {/* Quick Fill from Activities */}
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

//         {/* 4. COSTING */}
//         <section className="flex items-end justify-between border-t border-gray-100 pt-4">
//             <div>
//                 <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
//                 <div className="flex gap-2">
//                     {['Planned', 'Optional'].map(status => (
//                         <button
//                             key={status}
//                             onClick={() => updateField('serviceType', status)}
//                             className={`px-3 py-1 text-xs rounded border ${
//                                 formData.serviceType === status 
//                                 ? 'bg-gray-800 text-white border-gray-800' 
//                                 : 'bg-white text-gray-600 border-gray-300'
//                             }`}
//                         >
//                             {status}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             <div className="flex gap-4 items-end">
//                 <div className="text-right">
//                     <label className="block text-xs font-bold text-gray-500 mb-1">Vehicle Price</label>
//                     <div className="relative">
//                         <span className="absolute left-3 top-2.5 text-gray-700 text-sm">$</span>
//                         <input 
//                             type="number" 
//                             value={formData.price} 
//                             onChange={e => updateField('price', parseFloat(e.target.value) || 0)}
//                             className="w-32 pl-6 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-right focus:border-green-500 outline-none"
//                         />
//                     </div>
//                 </div>
//                 <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
//                     <div className="text-[10px] text-green-600 font-bold uppercase">Total Cost</div>
//                     <div className="text-xl font-bold text-green-800">
//                         ${(formData.price * formData.vehicleCount).toLocaleString()}
//                     </div>
//                 </div>
//             </div>
//         </section>

//       </div>
//     </div>
//   );
// } 




















































"use client";

import React, { useState } from 'react';
import { 
  MapPin, Clock, Users, Briefcase, Car, 
  CheckCircle2, Ban, PlusSquare // Added new icons
} from 'lucide-react';
import { 
  Transport, 
  TRANSPORT_MODES, 
  VEHICLE_TYPES, 
  VEHICLE_SPECS,
  Stay, 
  Activity
} from '../constants/daywiseConstants';

// Default Factory
const createDefaultTransport = (id: number): Transport => ({
    id,
    type: 'transport',
    mode: 'vehicle',
    subType: 'transfer', 
    
    // NEW DEFAULT
    inclusionType: 'included',
    
    vehicleType: 'Sedan Car',
    vehicleCount: 1,
    
    pickupLocation: '',
    pickupTime: '09:00',
    dropoffLocation: '', 
    dropoffTime: '10:00',
    duration: '',
    
    price: 0,
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
  
  // --- STATE ---
  const [formData, setFormData] = useState<Transport>(
      initialData || { 
        ...createDefaultTransport(Date.now()),
        pickupLocation: currentStay ? currentStay.hotelName : ''
      }
  );
  
  // Get Visual Specs
  const currentSpecs = VEHICLE_SPECS[formData.vehicleType] || VEHICLE_SPECS['default'];

  // --- HANDLERS ---
  const updateField = (field: keyof Transport, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                        <div className="text-sm font-bold text-gray-800">Disposal (Package)</div>
                        <div className="text-[10px] text-gray-400">Hourly/Day rental (e.g. 8Hr / 80km)</div>
                    </div>
                </label>
            </div>
        </section>

        {/* 2. VEHICLE SELECTION */}
        {formData.mode === 'vehicle' && (
            <section className="grid grid-cols-12 gap-6">
                
                {/* Inputs */}
                <div className="col-span-7 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Vehicle Type</label>
                        <select 
                            value={formData.vehicleType}
                            onChange={(e) => updateField('vehicleType', e.target.value)}
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 outline-none focus:border-green-500"
                        >
                            {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">No. of Vehicles</label>
                            <input 
                                type="number" min="1"
                                value={formData.vehicleCount}
                                onChange={(e) => updateField('vehicleCount', parseInt(e.target.value) || 1)}
                                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold outline-none focus:border-green-500"
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">Ref No. (Optional)</label>
                             <input 
                                type="text" placeholder="Flight/Train No."
                                value={formData.flightNumber || ''}
                                onChange={(e) => updateField('flightNumber', e.target.value)}
                                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-green-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Visual Spec Card */}
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
                                <span className="flex items-center gap-1"><Briefcase size={12}/> Check-in Bags</span>
                                <span className="font-bold">{currentSpecs.luggageCheck}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-green-900">
                                <span className="flex items-center gap-1"><Briefcase size={12}/> Carry-on</span>
                                <span className="font-bold">{currentSpecs.luggageCarry}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )}

        {/* 3. LOGISTICS */}
        <section className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
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
                        <>
                            <label className="text-xs font-bold text-gray-600 uppercase">Duration</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={formData.duration || ''} 
                                    onChange={e => updateField('duration', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:border-green-500 outline-none" 
                                    placeholder="e.g. 8 Hours / 80 Km"
                                />
                                <Clock className="absolute right-3 top-3 text-gray-400" size={16} />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">Vehicle remains with you for this duration.</p>
                        </>
                    )}
                </div>
            </div>
        </section>

        {/* 4. COSTING & STATUS (UPDATED) */}
        <section className="space-y-4 border-t border-gray-100 pt-4">
            
            <div className="grid grid-cols-12 gap-6">
                
                {/* A. PACKAGING STATUS SELECTOR */}
                <div className="col-span-5">
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Packaging Status</label>
                    <div className="grid grid-cols-3 gap-2">
                        {/* Included */}
                        <div 
                            onClick={() => updateField('inclusionType', 'included')}
                            className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all ${
                                formData.inclusionType === 'included' 
                                ? 'bg-green-50 border-green-500 shadow-sm' 
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <CheckCircle2 size={16} className={formData.inclusionType === 'included' ? "text-green-600" : "text-gray-400"} />
                            <span className={`text-[10px] font-bold ${formData.inclusionType === 'included' ? "text-green-700" : "text-gray-500"}`}>Included</span>
                        </div>

                        {/* Excluded */}
                        <div 
                            onClick={() => updateField('inclusionType', 'excluded')}
                            className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all ${
                                formData.inclusionType === 'excluded' 
                                ? 'bg-red-50 border-red-500 shadow-sm' 
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <Ban size={16} className={formData.inclusionType === 'excluded' ? "text-red-600" : "text-gray-400"} />
                            <span className={`text-[10px] font-bold ${formData.inclusionType === 'excluded' ? "text-red-700" : "text-gray-500"}`}>Excluded</span>
                        </div>

                        {/* Optional */}
                        <div 
                            onClick={() => updateField('inclusionType', 'optional')}
                            className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all ${
                                formData.inclusionType === 'optional' 
                                ? 'bg-blue-50 border-blue-500 shadow-sm' 
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <PlusSquare size={16} className={formData.inclusionType === 'optional' ? "text-blue-600" : "text-gray-400"} />
                            <span className={`text-[10px] font-bold ${formData.inclusionType === 'optional' ? "text-blue-700" : "text-gray-500"}`}>Optional</span>
                        </div>
                    </div>
                </div>

                {/* B. COSTING INPUTS (CONDITIONAL) */}
                <div className="col-span-7 flex flex-col justify-end">
                    {formData.inclusionType === 'excluded' ? (
                        <div className="h-full flex items-center p-3 bg-red-50 border border-red-100 rounded-lg gap-3">
                            <Ban className="text-red-400 shrink-0" size={16} />
                            <p className="text-xs text-red-600 leading-tight">
                                This transport is <strong>excluded</strong>. <br/> No costs will be calculated.
                            </p>
                        </div>
                    ) : (
                        <div className="flex gap-4 items-start justify-end ">
                            <div className="text-right">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Vehicle Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-700 text-sm">$</span>
                                    <input 
                                        type="number" 
                                        value={formData.price} 
                                        onChange={e => updateField('price', parseFloat(e.target.value) || 0)}
                                        className="w-32 pl-6 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-right focus:border-green-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200 w-28">
                                <div className="text-[10px] text-green-600 font-bold uppercase">Total Cost</div>
                                <div className="text-xl font-bold text-green-800">
                                    ${(formData.price * formData.vehicleCount).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </section>

      </div>
    </div>
  );
}