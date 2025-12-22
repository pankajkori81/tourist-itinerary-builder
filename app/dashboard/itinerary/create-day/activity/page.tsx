
// "use client";

// import React, { useState, useEffect } from 'react';
// import { 
//   X, Save, MapPin, FileText, PlusCircle, 
//   Wallet, User, Calendar, Clock, CheckCircle, Circle
// } from 'lucide-react';
// import { Activity, TIME_SLOTS, CITY_ATTRACTIONS } from '../constants/daywiseConstants';

// interface ActivityFormProps {
//   initialData?: Activity;
//   existingActivities?: Activity[]; // Optional to prevent crash
//   city: string;
//   dayDate: string;
//   onSave: (data: Activity) => void;
//   onCancel: () => void;
// }

// export default function ActivityForm({ 
//   initialData, 
//   existingActivities = [], // Default to empty array to prevent "undefined" error
//   city, 
//   dayDate, 
//   onSave, 
//   onCancel 
// }: ActivityFormProps) {
  
//   // --- 1. STATE ---
//   const [formData, setFormData] = useState<Activity>(initialData || {
//     id: Date.now(),
//     type: 'activity',
//     heading: '',
//     description: '',
    
//     // Timing
//     slot: '',
//     startTime: '',
//     duration: '',

//     // Costing Details
//     inclusionType: 'included',
//     entranceFeePP: 0,
//     activityFeePP: 0,
    
//     // Guide Details
//     guideType: 'guided',
//     guideFee: 0,

//     // Logistics
//     pickupLocation: '',
//     pickupDate: dayDate || '',
//     pickupTime: '09:00',
//     dropoffLocation: '',
//     dropoffDate: dayDate || '',
//     dropoffTime: '11:00',

//     // Defaults
//     activityType: 'attractions',
//   });

//   const [showSidebar, setShowSidebar] = useState(false);
//   const [filteredAttractions, setFilteredAttractions] = useState<any[]>([]);

//   // --- 2. LOGIC: STRICT SLOT VALIDATION ---
//   const isSlotDisabled = (slotToCheck: string) => {
//     // 1. Filter out the *current* activity if we are editing.
//     // We shouldn't block the slot that the current activity currently holds.
//     const otherActivities = initialData 
//       ? existingActivities.filter(a => a.id !== initialData.id) 
//       : existingActivities;

//     // 2. CHECK: Is there already a "Full Day" activity in the other activities?
//     const hasFullDayTaken = otherActivities.some(a => a.slot === 'Full Day');
    
//     if (hasFullDayTaken) {
//       // If someone else has "Full Day", NO slots are available at all.
//       return true;
//     }

//     // 3. CHECK: Logic for the "Full Day" option specifically
//     if (slotToCheck === 'Full Day') {
//       // You can only pick "Full Day" if NO other activities exist at all.
//       // If there is even one Morning/Afternoon/Evening activity, Full Day is disabled.
//       return otherActivities.length > 0;
//     }

//     // 4. CHECK: Logic for specific slots (Morning, Afternoon, Evening)
//     // Disable if this specific slot is already present in other activities
//     return otherActivities.some(a => a.slot === slotToCheck);
//   };

//   // --- 3. EFFECT: FILTER ATTRACTIONS ---
//   useEffect(() => {
//     const allAttractions = CITY_ATTRACTIONS[city] || [];
//     if (formData.slot) {
//       const filtered = allAttractions.filter(attr => 
//         attr.suggestedSlot === formData.slot || !attr.suggestedSlot
//       );
//       setFilteredAttractions(filtered);
//       if (filtered.length > 0) setShowSidebar(true);
//     } else {
//       setFilteredAttractions(allAttractions);
//     }
//   }, [formData.slot, city]);

//   // --- 4. HANDLERS ---
//   const handleChange = (field: keyof Activity, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleAttractionSelect = (attr: any) => {
//     setFormData(prev => ({
//       ...prev,
//       heading: attr.name,
//       description: attr.description,
//       entranceFeePP: attr.price || 0,
//       activityType: attr.type === 'monument' ? 'monuments' : 'attractions',
//       duration: '2 Hours'
//     }));
//     setShowSidebar(false);
//   };

//   const handleSubmit = () => {
//     if (!formData.heading) {
//       alert("Please enter an activity name");
//       return;
//     }
    
//     const finalData = {
//         ...formData,
//         guideFee: formData.guideType === 'self_guided' ? 0 : formData.guideFee
//     };
//     onSave(finalData);
//   };

//   return (
//     <div className="relative flex h-full w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-300">
      
//       {/* --- LEFT SIDE: MAIN FORM --- */}
//       <div className="flex-1 flex flex-col h-full bg-white relative z-10">
        
//         {/* HEADER */}
//         <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
//           <div>
//             <h2 className="text-lg font-bold text-gray-800">
//               {initialData ? 'Edit Activity' : 'Add New Activity'}
//             </h2>
//             <p className="text-xs text-gray-500 flex items-center gap-2">
//               <span className="font-semibold text-blue-600">{city}</span>
//               <span>•</span>
//               <span>{dayDate}</span>
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button onClick={onCancel} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
//               Cancel
//             </button>
//             <button onClick={handleSubmit} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all flex items-center gap-2">
//               <Save size={16} /> Save
//             </button>
//           </div>
//         </div>

//         {/* SCROLLABLE FORM BODY */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
//           {/* --- SECTION A: ACTIVITY DETAILS --- */}
//           <section className="space-y-4">
//             <div className="flex items-center gap-2 text-blue-600 mb-2">
//               <FileText size={18} />
//               <span className="text-xs font-bold uppercase tracking-wider">Activity Details</span>
//             </div>
            
//             <div className="space-y-4">
//               <div className="flex gap-2">
//                 <div className="flex-1">
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Activity Name <span className="text-red-500">*</span></label>
//                   <input 
//                     type="text" 
//                     value={formData.heading}
//                     onChange={(e) => handleChange('heading', e.target.value)}
//                     placeholder="e.g. Guided Visit to Taj Mahal"
//                     className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//                   />
//                 </div>
//                 <button 
//                    onClick={() => setShowSidebar(!showSidebar)}
//                    className="mt-6 px-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
//                    title="View Suggestions"
//                 >
//                   <PlusCircle size={20} />
//                 </button>
//               </div>

//               <div className="grid grid-cols-3 gap-4">
//                  <div>
//                     <label className="block text-xs font-semibold text-gray-500 mb-1">Time Slot</label>
//                     <select 
//                       value={formData.slot}
//                       onChange={(e) => handleChange('slot', e.target.value)}
//                       className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none cursor-pointer"
//                     >
//                       <option value="">-- Select Slot --</option>
//                       {TIME_SLOTS.map(slot => {
//                           const disabled = isSlotDisabled(slot.value);
//                           return (
//                             <option 
//                                 key={slot.value} 
//                                 value={slot.value} 
//                                 disabled={disabled}
//                                 className={disabled ? "text-gray-400 bg-gray-100" : "text-gray-900"}
//                             >
//                                 {slot.label} {disabled ? "(Unavailable)" : ""}
//                             </option>
//                           );
//                       })}
//                     </select>
//                  </div>
                 
//                  <div>
//                     <label className="block text-xs font-semibold text-gray-500 mb-1">Start Time</label>
//                     <input 
//                       type="time" 
//                       value={formData.startTime || ''}
//                       onChange={(e) => handleChange('startTime', e.target.value)}
//                       className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
//                     />
//                  </div>

//                  <div>
//                     <label className="block text-xs font-semibold text-gray-500 mb-1">Duration</label>
//                     <input 
//                       type="text" 
//                       value={formData.duration}
//                       onChange={(e) => handleChange('duration', e.target.value)}
//                       placeholder="e.g. 2 Hours"
//                       className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
//                     />
//                  </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
//                 <textarea 
//                   rows={2}
//                   value={formData.description}
//                   onChange={(e) => handleChange('description', e.target.value)}
//                   placeholder="Describe what the guest will experience..."
//                   className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:border-blue-500 outline-none resize-none"
//                 />
//               </div>
//             </div>
//           </section>

//           <hr className="border-gray-100" />

//           {/* --- SECTION B: INCLUSIONS & COSTING --- */}
//           <section className="space-y-4">
//           <div className="flex items-center gap-2 text-green-600 mb-2">
//               <Wallet size={18} />
//               <span className="text-xs font-bold uppercase tracking-wider">Inclusions & Costing (USD)</span>
//             </div>

//             <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-5">
              
//               <div>
//                 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Type</label>
//                 <div className="flex gap-4">
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input 
//                       type="radio" 
//                       name="inclusionType"
//                       checked={formData.inclusionType === 'included'}
//                       onChange={() => handleChange('inclusionType', 'included')}
//                       className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                     />
//                     <span className="text-sm font-semibold text-gray-700">Included</span>
//                   </label>

//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input 
//                       type="radio" 
//                       name="inclusionType"
//                       checked={formData.inclusionType === 'optional'}
//                       onChange={() => handleChange('inclusionType', 'optional')}
//                       className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                     />
//                     <span className="text-sm font-semibold text-gray-700">Optional</span>
//                   </label>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                  <div>
//                     <label className="block text-xs font-medium text-gray-600 mb-1">Entrance Fee (PP)</label>
//                     <div className="relative">
//                       <span className="absolute left-3 top-3 text-gray-700 text-xs">$</span>
//                       <input 
//                         type="number" 
//                         value={formData.entranceFeePP} 
//                         onChange={(e) => handleChange('entranceFeePP', parseFloat(e.target.value) || 0)}
//                         className="w-full pl-6 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold focus:border-green-500 outline-none" 
//                       />
//                     </div>
//                  </div>
//                  <div>
//                     <label className="block text-xs font-medium text-gray-600 mb-1">Activity Fee (PP)</label>
//                     <div className="relative">
//                      <span className="absolute left-3 top-3 text-gray-700 text-xs">$</span>
//                       <input 
//                         type="number" 
//                         value={formData.activityFeePP} 
//                         onChange={(e) => handleChange('activityFeePP', parseFloat(e.target.value) || 0)}
//                         className="w-full pl-6 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold focus:border-green-500 outline-none" 
//                       />
//                     </div>
//                  </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Guide Option</label>
//                 <div className="flex gap-4 items-center">
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input 
//                       type="radio" 
//                       name="guideType"
//                       checked={formData.guideType === 'guided'}
//                       onChange={() => handleChange('guideType', 'guided')}
//                       className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                     />
//                     <span className="text-sm font-semibold text-gray-700">Guided</span>
//                   </label>

//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input 
//                       type="radio" 
//                       name="guideType"
//                       checked={formData.guideType === 'self_guided'}
//                       onChange={() => handleChange('guideType', 'self_guided')}
//                       className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                     />
//                     <span className="text-sm font-semibold text-gray-700">Self Guided</span>
//                   </label>
//                 </div>
//               </div>

//               {formData.guideType === 'guided' && (
//                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
//                     <label className="block text-xs font-medium text-gray-600 mb-1">Guide Charge (Fee)</label>
//                     <div className="relative">
//                      <span className="absolute left-3 top-3 text-gray-700 text-xs">$</span>
//                       <input 
//                         type="number" 
//                         value={formData.guideFee} 
//                         onChange={(e) => handleChange('guideFee', parseFloat(e.target.value) || 0)}
//                         placeholder="0"
//                         className="w-full pl-6 pr-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-semibold focus:border-blue-500 outline-none shadow-sm" 
//                       />
//                     </div>
//                     <p className="text-[10px] text-gray-400 mt-1">
//                        This fee will be added to the Per Person cost calculation.
//                     </p>
//                  </div>
//               )}

//             </div>
//           </section>

//           <hr className="border-gray-100" />

//           {/* --- SECTION C: LOGISTICS --- */}
//           <section className="space-y-4">
//              <div className="flex items-center gap-2 text-purple-600 mb-2">
//               <MapPin size={18} />
//               <span className="text-xs font-bold uppercase tracking-wider">Logistics</span>
//             </div>
            
//             <div className="grid grid-cols-12 gap-3">
//                <div className="col-span-6">
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Pickup Location</label>
//                   <input type="text" value={formData.pickupLocation} onChange={(e) => handleChange('pickupLocation', e.target.value)}
//                      placeholder="e.g. Hotel Lobby" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-500" />
//                </div>
//                <div className="col-span-3">
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Pickup Date</label>
//                   <input type="date" value={formData.pickupDate} onChange={(e) => handleChange('pickupDate', e.target.value)}
//                      className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-500" />
//                </div>
//                <div className="col-span-3">
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Time</label>
//                   <input type="time" value={formData.pickupTime} onChange={(e) => handleChange('pickupTime', e.target.value)}
//                      className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-500" />
//                </div>
//             </div>

//             <div className="grid grid-cols-12 gap-3">
//                <div className="col-span-6">
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Drop-off Location</label>
//                   <input type="text" value={formData.dropoffLocation} onChange={(e) => handleChange('dropoffLocation', e.target.value)}
//                      placeholder="e.g. City Center" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-500" />
//                </div>
//                <div className="col-span-3">
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Drop-off Date</label>
//                   <input type="date" value={formData.dropoffDate} onChange={(e) => handleChange('dropoffDate', e.target.value)}
//                      className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-500" />
//                </div>
//                <div className="col-span-3">
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Time</label>
//                   <input type="time" value={formData.dropoffTime} onChange={(e) => handleChange('dropoffTime', e.target.value)}
//                      className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-500" />
//                </div>
//             </div>
//           </section>

//         </div>
//       </div>

//       {/* --- RIGHT SIDE: ATTRACTIONS SIDEBAR (Unchanged) --- */}
//       <div 
//         className={`absolute top-0 right-0 bottom-0 w-80 bg-white border-l border-gray-300 shadow-2xl z-20 transition-transform duration-300 ease-in-out transform flex flex-col ${
//             showSidebar ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//           <div className="p-4 bg-blue-600 text-white flex justify-between items-center shrink-0">
//              <div>
//                 <h3 className="text-xs font-bold opacity-80 uppercase">
//                     {formData.slot ? `${formData.slot} Activities` : 'All Activities'}
//                 </h3>
//                 <div className="font-bold text-sm">{city}</div>
//              </div>
//              <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-blue-700 rounded text-white">
//                 <X size={16} />
//              </button>
//           </div>
          
//           <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
//              {filteredAttractions.map((item, i) => (
//                 <div key={i} onClick={() => handleAttractionSelect(item)} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-blue-500 group">
//                     <div className="font-bold text-gray-800 text-sm group-hover:text-blue-600">{item.name}</div>
//                     <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
//                  <div className="mt-2 text-xs font-bold text-green-800">${item.price}</div>
//                 </div>
//              ))}
//           </div>
//       </div>

//     </div>
//   );
// } 

















































"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, Save, MapPin, FileText, PlusCircle, 
  Wallet, Ban, CheckCircle2, PlusSquare
} from 'lucide-react';
import { Activity, TIME_SLOTS, CITY_ATTRACTIONS } from '../constants/daywiseConstants';

interface ActivityFormProps {
  initialData?: Activity;
  existingActivities?: Activity[];
  city: string;
  dayDate: string;
  onSave: (data: Activity) => void;
  onCancel: () => void;
}

export default function ActivityForm({ 
  initialData, 
  existingActivities = [], 
  city, 
  dayDate, 
  onSave, 
  onCancel 
}: ActivityFormProps) {
  
  // --- 1. STATE ---
  const [formData, setFormData] = useState<Activity>(initialData || {
    id: Date.now(),
    type: 'activity',
    heading: '',
    description: '',
    
    // Timing
    slot: '',
    startTime: '',
    duration: '',

    // Costing Details
    // NOTE: We now support 'included' | 'excluded' | 'optional'
    inclusionType: 'included', 
    entranceFeePP: 0,
    activityFeePP: 0,
    
    // Guide Details
    guideType: 'guided',
    guideFee: 0,

    // Logistics
    pickupLocation: '',
    pickupDate: dayDate || '',
    pickupTime: '09:00',
    dropoffLocation: '',
    dropoffDate: dayDate || '',
    dropoffTime: '11:00',

    // Defaults
    activityType: 'attractions',
  });

  const [showSidebar, setShowSidebar] = useState(false);
  const [filteredAttractions, setFilteredAttractions] = useState<any[]>([]);

  // --- 2. LOGIC: STRICT SLOT VALIDATION ---
  const isSlotDisabled = (slotToCheck: string) => {
    const otherActivities = initialData 
      ? existingActivities.filter(a => a.id !== initialData.id) 
      : existingActivities;

    const hasFullDayTaken = otherActivities.some(a => a.slot === 'Full Day');
    if (hasFullDayTaken) return true;

    if (slotToCheck === 'Full Day') return otherActivities.length > 0;

    return otherActivities.some(a => a.slot === slotToCheck);
  };

  // --- 3. EFFECT: FILTER ATTRACTIONS ---
  useEffect(() => {
    const allAttractions = CITY_ATTRACTIONS[city] || [];
    if (formData.slot) {
      const filtered = allAttractions.filter(attr => 
        attr.suggestedSlot === formData.slot || !attr.suggestedSlot
      );
      setFilteredAttractions(filtered);
      if (filtered.length > 0) setShowSidebar(true);
    } else {
      setFilteredAttractions(allAttractions);
    }
  }, [formData.slot, city]);

  // --- 4. HANDLERS ---
  const handleChange = (field: keyof Activity, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAttractionSelect = (attr: any) => {
    setFormData(prev => ({
      ...prev,
      heading: attr.name,
      description: attr.description,
      entranceFeePP: attr.price || 0,
      activityType: attr.type === 'monument' ? 'monuments' : 'attractions',
      duration: '2 Hours'
    }));
    setShowSidebar(false);
  };

  const handleSubmit = () => {
    if (!formData.heading) {
      alert("Please enter an activity name");
      return;
    }
    
    // If excluded, we force fees to 0 for calculation safety, 
    // or you can leave them as is if you want to remember the price if they switch back.
    // Here I am leaving them as is, assuming your calculation logic ignores 'excluded' items.
    
    const finalData = {
        ...formData,
        guideFee: formData.guideType === 'self_guided' ? 0 : formData.guideFee
    };
    onSave(finalData);
  };

  return (
    <div className="relative flex h-full w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-300">
      
      {/* --- LEFT SIDE: MAIN FORM --- */}
      <div className="flex-1 flex flex-col h-full bg-white relative z-10">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {initialData ? 'Edit Activity' : 'Add New Activity'}
            </h2>
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <span className="font-semibold text-blue-600">{city}</span>
              <span>•</span>
              <span>{dayDate}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={onCancel} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all flex items-center gap-2">
              <Save size={16} /> Save
            </button>
          </div>
        </div>

        {/* SCROLLABLE FORM BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* --- SECTION A: ACTIVITY DETAILS --- */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <FileText size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Activity Details</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Activity Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.heading}
                    onChange={(e) => handleChange('heading', e.target.value)}
                    placeholder="e.g. Guided Visit to Taj Mahal"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <button 
                   onClick={() => setShowSidebar(!showSidebar)}
                   className="mt-6 px-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                   title="View Suggestions"
                >
                  <PlusCircle size={20} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Time Slot</label>
                    <select 
                      value={formData.slot}
                      onChange={(e) => handleChange('slot', e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="">-- Select Slot --</option>
                      {TIME_SLOTS.map(slot => {
                          const disabled = isSlotDisabled(slot.value);
                          return (
                            <option 
                                key={slot.value} 
                                value={slot.value} 
                                disabled={disabled}
                                className={disabled ? "text-gray-400 bg-gray-100" : "text-gray-900"}
                            >
                                {slot.label} {disabled ? "(Unavailable)" : ""}
                            </option>
                          );
                      })}
                    </select>
                 </div>
                 
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Start Time</label>
                    <input 
                      type="time" 
                      value={formData.startTime || ''}
                      onChange={(e) => handleChange('startTime', e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Duration</label>
                    <input 
                      type="text" 
                      value={formData.duration}
                      onChange={(e) => handleChange('duration', e.target.value)}
                      placeholder="e.g. 2 Hours"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                    />
                 </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                <textarea 
                  rows={2}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe what the guest will experience..."
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* --- SECTION B: INCLUSIONS & COSTING (MAJOR UPDATE) --- */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Wallet size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Inclusions & Costing (USD)</span>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-6">
              
              {/* 1. PACKAGE STATUS SELECTOR */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Packaging Status</label>
                <div className="grid grid-cols-3 gap-3">
                  
                  {/* INCLUDED OPTION */}
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

                  {/* EXCLUDED OPTION */}
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

                   {/* OPTIONAL OPTION */}
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

              {/* 2. CONDITIONAL COST FIELDS */}
              {formData.inclusionType === 'excluded' ? (
                // --- IF EXCLUDED ---
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                    <Ban className="text-red-400 shrink-0 mt-0.5" size={16} />
                    <div>
                        <p className="text-xs font-bold text-red-700">Costing Disabled</p>
                        <p className="text-xs text-red-600 mt-1">
                            This activity will be listed in the <strong>Exclusions</strong> section. No costs will be calculated.
                        </p>
                    </div>
                </div>
              ) : (
                // --- IF INCLUDED OR OPTIONAL ---
                <div className="space-y-5 animate-in ">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Entrance Fee (PP)</label>
                            <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-700 text-xs">$</span>
                            <input 
                                type="number" 
                                value={formData.entranceFeePP} 
                                onChange={(e) => handleChange('entranceFeePP', parseFloat(e.target.value) || 0)}
                                className="w-full pl-6 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold focus:border-green-500 outline-none" 
                            />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Activity Fee (PP)</label>
                            <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-700 text-xs">$</span>
                            <input 
                                type="number" 
                                value={formData.activityFeePP} 
                                onChange={(e) => handleChange('activityFeePP', parseFloat(e.target.value) || 0)}
                                className="w-full pl-6 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold focus:border-green-500 outline-none" 
                            />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Guide Option</label>
                        <div className="flex gap-4 items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                            type="radio" 
                            name="guideType"
                            checked={formData.guideType === 'guided'}
                            onChange={() => handleChange('guideType', 'guided')}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-semibold text-gray-700">Guided</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                            type="radio" 
                            name="guideType"
                            checked={formData.guideType === 'self_guided'}
                            onChange={() => handleChange('guideType', 'self_guided')}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-semibold text-gray-700">Self Guided</span>
                        </label>
                        </div>
                    </div>

                    {formData.guideType === 'guided' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Guide Charge (Fee)</label>
                            <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-700 text-xs">$</span>
                            <input 
                                type="number" 
                                value={formData.guideFee} 
                                onChange={(e) => handleChange('guideFee', parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className="w-full pl-6 pr-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-semibold focus:border-blue-500 outline-none shadow-sm" 
                            />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">
                            This fee will be added to the Per Person cost calculation.
                            </p>
                        </div>
                    )}
                </div>
              )}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* --- SECTION C: LOGISTICS --- */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 text-purple-600 mb-2">
              <MapPin size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Logistics</span>
            </div>
            
            <div className="grid grid-cols-12 gap-3">
               <div className="col-span-6">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Pickup Location</label>
                  <input type="text" value={formData.pickupLocation} onChange={(e) => handleChange('pickupLocation', e.target.value)}
                     placeholder="e.g. Hotel Lobby" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-500" />
               </div>
               <div className="col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Pickup Date</label>
                  <input type="date" value={formData.pickupDate} onChange={(e) => handleChange('pickupDate', e.target.value)}
                     className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-500" />
               </div>
               <div className="col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Time</label>
                  <input type="time" value={formData.pickupTime} onChange={(e) => handleChange('pickupTime', e.target.value)}
                     className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-500" />
               </div>
            </div>

            <div className="grid grid-cols-12 gap-3">
               <div className="col-span-6">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Drop-off Location</label>
                  <input type="text" value={formData.dropoffLocation} onChange={(e) => handleChange('dropoffLocation', e.target.value)}
                     placeholder="e.g. City Center" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-500" />
               </div>
               <div className="col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Drop-off Date</label>
                  <input type="date" value={formData.dropoffDate} onChange={(e) => handleChange('dropoffDate', e.target.value)}
                     className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-500" />
               </div>
               <div className="col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Time</label>
                  <input type="time" value={formData.dropoffTime} onChange={(e) => handleChange('dropoffTime', e.target.value)}
                     className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-500" />
               </div>
            </div>
          </section>

        </div>
      </div>

      {/* --- RIGHT SIDE: ATTRACTIONS SIDEBAR (Unchanged) --- */}
      <div 
        className={`absolute top-0 right-0 bottom-0 w-80 bg-white border-l border-gray-300 shadow-2xl z-20 transition-transform duration-300 ease-in-out transform flex flex-col ${
            showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
          <div className="p-4 bg-blue-600 text-white flex justify-between items-center shrink-0">
             <div>
                <h3 className="text-xs font-bold opacity-80 uppercase">
                    {formData.slot ? `${formData.slot} Activities` : 'All Activities'}
                </h3>
                <div className="font-bold text-sm">{city}</div>
             </div>
             <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-blue-700 rounded text-white">
                <X size={16} />
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
             {filteredAttractions.map((item, i) => (
                <div key={i} onClick={() => handleAttractionSelect(item)} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-blue-500 group">
                    <div className="font-bold text-gray-800 text-sm group-hover:text-blue-600">{item.name}</div>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                 <div className="mt-2 text-xs font-bold text-green-800">${item.price}</div>
                </div>
             ))}
          </div>
      </div>

    </div>
  );
}













