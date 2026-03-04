

// "use client";

// import React, { useState, useEffect } from 'react';
// import { 
//   X, Save, MapPin, FileText, PlusCircle, 
//   Ban, CheckCircle2, PlusSquare, 
//   Clock, Phone, Mail, Briefcase, 
//   ImageIcon
// } from 'lucide-react';
// import { useItinerary } from '@/app/context/ItineraryContext';
// import { useSRM } from '@/app/context/SRMContext'; 
// import { Activity, TIME_SLOTS } from '../constants/daywiseConstants';

// interface ActivityFormProps {
//   initialData?: Activity;
//   existingActivities?: Activity[];
//   city: string;
//   dayDate: string;
//   onSave: (data: Activity) => void;
//   onCancel: () => void;
// }

// export default function ActivityForm({ 
//   initialData, 
//   existingActivities = [], 
//   city, 
//   dayDate, 
//   onSave, 
//   onCancel 
// }: ActivityFormProps) {
  
//   const { itineraryData } = useItinerary(); 
//   const { attractions, suppliers } = useSRM();

//   const globalPax = (itineraryData && typeof itineraryData.numberOfTravelers === 'number') 
//     ? itineraryData.numberOfTravelers 
//     : 2;

//   const cityAttractions = attractions.filter(a => 
//     (a.city || "").toLowerCase().trim() === city.toLowerCase().trim()
//   );

//   const availableSuppliers = suppliers.filter(s => 
//       s.status === 'Active' && 
//       s.services.includes('Activity') &&
//       (s.city.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(s.city.toLowerCase()))
//   );

//   const [formData, setFormData] = useState<Activity>(() => {
//     if (initialData) {
//       return { ...initialData, paxCount: initialData.paxCount ?? globalPax };
//     }
//     return {
//       id: Date.now(),
//       type: 'activity',
//       paxCount: globalPax,
//       heading: '', description: '', slot: '', startTime: '', duration: '',
//       inclusionType: 'included', 
//       entranceFeePP: 0, activityFeePP: 0, guideFee: 0, // Default 0, handled in Costing
//       guideType: 'guided',
//       pickupLocation: '', pickupDate: dayDate || '', pickupTime: '09:00',
//       dropoffLocation: '', dropoffDate: dayDate || '', dropoffTime: '11:00',
//       activityType: 'attractions', linkedSupplierId: ''
//     };
//   });

//   const [showSidebar, setShowSidebar] = useState(false);

//   // Auto-select preferred supplier
//   useEffect(() => {
//       if (!formData.linkedSupplierId) {
//           const preferred = availableSuppliers.find(s => s.isPreferred);
//           if (preferred) setFormData(prev => ({ ...prev, linkedSupplierId: preferred.id }));
//       }
//   }, [availableSuppliers]);

//   const selectedSupplier = suppliers.find(s => s.id === formData.linkedSupplierId);

//   // Sidebar logic
//   useEffect(() => { if (formData.slot) setShowSidebar(true); }, [formData.slot]);
  
//   const sidebarList = formData.slot 
//     ? cityAttractions.filter(a => !a.suggestedSlot || a.suggestedSlot === formData.slot || a.suggestedSlot === 'Full Day')
//     : cityAttractions;

//   const isSlotDisabled = (slotToCheck: string) => {
//     const otherActivities = initialData ? existingActivities.filter(a => a.id !== initialData.id) : existingActivities;
//     const hasFullDayActivity = otherActivities.some(a => a.slot === 'Full Day');
//     if (hasFullDayActivity) return true;
//     if (slotToCheck === 'Full Day') return otherActivities.some(a => ['Early Morning', 'Morning', 'Afternoon', 'Evening'].includes(a.slot));
//     return otherActivities.some(a => a.slot === slotToCheck);
//   };

//   const handleChange = (field: keyof Activity, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSRMSelect = (srmItem: any) => {
//     setFormData(prev => ({
//       ...prev,
//       heading: srmItem.name,
//       description: srmItem.description || '',
//       startTime: srmItem.startTime || prev.startTime,
//       duration: srmItem.duration || '2 Hours',
//       slot: srmItem.suggestedSlot || prev.slot,
//       pickupLocation: srmItem.pickupLocation || prev.pickupLocation,
//       activityType: srmItem.type.toLowerCase(),
//       guideType: srmItem.isGuideRequired ? 'guided' : 'self_guided',
//       inclusionType: 'included',
//     }));
//     if (window.innerWidth < 768) setShowSidebar(false);
//   };

//   const handleSubmit = () => {
//     if (!formData.heading) { alert("Please enter an activity name"); return; }
//     onSave(formData);
//   };

//   return (
//     <div className="relative flex h-full w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-300">
//       <div className="flex-1 flex flex-col h-full bg-white relative z-10">
//         <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
//           <div>
//             <h2 className="text-lg font-bold text-gray-800">{initialData ? 'Edit Activity' : 'Add New Activity'}</h2>
//             <p className="text-xs text-gray-500 flex items-center gap-2"><span className="font-semibold text-blue-600">{city}</span><span>•</span><span>{dayDate}</span></p>
//           </div>
//           <div className="flex gap-2">
//             <button onClick={onCancel} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
//             <button onClick={handleSubmit} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md flex items-center gap-2"><Save size={16} /> Save</button>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6 space-y-8">
//           {/* ACTIVITY DETAILS */}
//           <section className="space-y-4">
//             <div className="flex items-center gap-2 text-blue-600 mb-2">
//               <FileText size={18} />
//               <span className="text-xs font-bold uppercase tracking-wider">Activity Details</span>
//             </div>

//             <div className="space-y-4">
//                 {/* SUPPLIER SELECTOR */}
//                 <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-4 flex gap-4 items-start">
//                     <div className="flex-1">
//                         <label className="block text-xs font-bold text-blue-900 mb-2 flex items-center gap-1"><Briefcase size={14} /> Fulfillment Partner (DMC)</label>
//                         <select className="w-full p-2.5 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={formData.linkedSupplierId || ""} onChange={(e) => handleChange('linkedSupplierId', e.target.value)}>
//                             <option value="">-- Admin will Assign --</option>
//                             {availableSuppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.city}) {s.isPreferred ? '★' : ''}</option>)}
//                         </select>
//                     </div>
//                     {selectedSupplier && (
//                         <div className="flex-1 bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-xs">
//                             <div className="font-bold text-gray-800 mb-1">{selectedSupplier.contactPerson}</div>
//                             <div className="text-gray-500 space-y-1">
//                                 <div className="flex items-center gap-1"><Phone size={10}/> {selectedSupplier.phone}</div>
//                                 <div className="truncate"><Mail size={10} className="inline mr-1"/>{selectedSupplier.email}</div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <div className="flex gap-2">
//                     <div className="flex-1">
//                     <label className="block text-xs font-semibold text-gray-500 mb-1">Activity Name *</label>
//                     <input type="text" value={formData.heading} onChange={(e) => handleChange('heading', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Guided Visit to Taj Mahal" />
//                     </div>
//                     <button onClick={() => setShowSidebar(!showSidebar)} className="mt-6 px-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors" title="View SRM Inventory"><PlusCircle size={20} /></button>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                     <div>
//                         <label className="block text-xs font-semibold text-gray-500 mb-1">Time Slot</label>
//                         <select value={formData.slot} onChange={(e) => handleChange('slot', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none cursor-pointer">
//                         <option value="">-- Select Slot --</option>
//                         {TIME_SLOTS.map(slot => {
//                             const disabled = isSlotDisabled(slot.value);
//                             const isCurrentSelection = formData.slot === slot.value;
//                             return <option key={slot.value} value={slot.value} disabled={disabled && !isCurrentSelection} className={(disabled && !isCurrentSelection) ? "text-gray-400 bg-gray-100" : "text-gray-900"}>{slot.label}</option>;
//                         })}
//                         </select>
//                     </div>
//                     <div>
//                         <label className="block text-xs font-semibold text-gray-500 mb-1">Start Time</label>
//                         <input type="time" value={formData.startTime} onChange={(e) => handleChange('startTime', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"/>
//                     </div>
//                     <div>
//                         <label className="block text-xs font-semibold text-gray-500 mb-1">Duration</label>
//                         <input type="text" value={formData.duration} onChange={(e) => handleChange('duration', e.target.value)} placeholder="e.g. 2 Hours" className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"/>
//                     </div>
//                 </div>
                
//                 <div>
//                     <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
//                     <textarea rows={2} value={formData.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Describe what the guest will experience..." className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:border-blue-500 outline-none resize-none"/>
//                 </div>
//             </div>
//           </section>

//           <hr className="border-gray-100" />

//           {/* SECTION B: LOGISTICS (Status Only - No Cost) */}
//           <section className="space-y-4">
//             <div className="flex items-center gap-2 text-gray-500 mb-2">
//               <span className="text-xs font-bold uppercase tracking-wider">Service Status</span>
//             </div>

//             <div className="grid grid-cols-12 gap-4">
//                 <div className="col-span-6">
//                     <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Packaging Status</label>
//                     <div className="flex gap-2">
//                         {['included', 'excluded', 'optional'].map(type => (
//                             <div key={type} onClick={() => handleChange('inclusionType', type)} className={`cursor-pointer border rounded-lg px-3 py-2 flex items-center gap-2 transition-all ${formData.inclusionType === type ? 'bg-gray-100 border-gray-400 text-gray-900' : 'bg-white border-gray-200 text-gray-400'}`}>
//                                 {type === 'included' && <CheckCircle2 size={14}/>}
//                                 {type === 'excluded' && <Ban size={14}/>}
//                                 {type === 'optional' && <PlusSquare size={14}/>}
//                                 <span className="text-[10px] font-bold uppercase">{type}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
                
//                 <div className="col-span-6">
//                     <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Guide</label>
//                     <div className="flex gap-4 items-center mt-2">
//                         <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="guideType" checked={formData.guideType === 'guided'} onChange={() => handleChange('guideType', 'guided')} className="w-4 h-4 text-blue-600"/><span className="text-sm font-semibold text-gray-700">Guided</span></label>
//                         <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="guideType" checked={formData.guideType === 'self_guided'} onChange={() => handleChange('guideType', 'self_guided')} className="w-4 h-4 text-blue-600"/><span className="text-sm font-semibold text-gray-700">Self Guided</span></label>
//                     </div>
//                 </div>
//             </div>
//           </section>

//           <hr className="border-gray-100" />

//           {/* SECTION C: LOGISTICS (Purely Descriptive) */}
//           <section className="space-y-4">
//              <div className="flex items-center gap-2 text-purple-600 mb-2">
//               <MapPin size={18} />
//               <span className="text-xs font-bold uppercase tracking-wider">Logistics</span>
//             </div>
            
//             <div className="grid grid-cols-12 gap-3">
//                <div className="col-span-6">
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Pickup Location</label>
//                   <input type="text" value={formData.pickupLocation} onChange={(e) => handleChange('pickupLocation', e.target.value)} placeholder="e.g. Hotel Lobby" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-500" />
//                </div>
//                <div className="col-span-6">
//                   <label className="block text-xs font-semibold text-gray-500 mb-1">Time</label>
//                   <input type="time" value={formData.pickupTime} onChange={(e) => handleChange('pickupTime', e.target.value)} className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-500" />
//                </div>
//             </div>
//           </section>

//         </div>
//       </div>

//       {/* RIGHT SIDEBAR (Inventory List - No Prices Shown) */}
//       <div className={`absolute top-0 right-0 bottom-0 w-80 bg-white border-l border-gray-300 shadow-2xl z-20 transition-transform duration-300 ease-in-out transform flex flex-col ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
//           <div className="p-4 bg-blue-600 text-white flex justify-between items-center shrink-0">
//              <div><h3 className="text-xs font-bold opacity-80 uppercase">{formData.slot} Activities</h3><div className="font-bold text-sm">{city}</div></div>
//              <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-blue-700 rounded text-white"><X size={16} /></button>
//           </div>
//           <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
//              {sidebarList.map((item, i) => (
//                 <div key={i} onClick={() => handleSRMSelect(item)} className="bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-blue-500 group overflow-hidden transition-all">
//                     <div className="h-24 bg-gray-200 relative">
//                         {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs flex-col gap-1"><ImageIcon size={16}/><span>No Image</span></div>}
//                         <div className="absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 rounded text-[10px] font-bold shadow">{item.type}</div>
//                     </div>
//                     <div className="p-3">
//                          <div className="font-bold text-gray-800 text-sm group-hover:text-blue-600 line-clamp-2 leading-tight">{item.name}</div>
//                          <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1"><Clock size={10}/> {item.duration || 'N/A'}</div>
//                     </div>
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
  Ban, CheckCircle2, PlusSquare, 
  Clock, Phone, Mail, Briefcase, 
  ImageIcon,
  Star
} from 'lucide-react';
import { useItinerary } from '@/app/context/ItineraryContext'; 
import { useSRM } from '@/app/context/SRMContext'; 
import { Activity, TIME_SLOTS } from '../constants/daywiseConstants';

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
  
  const { itineraryData } = useItinerary(); 
  const { attractions, suppliers } = useSRM();

  const globalPax = (itineraryData && typeof itineraryData.numberOfTravelers === 'number') 
    ? itineraryData.numberOfTravelers 
    : 2;

  const cityAttractions = attractions.filter(a => 
    (a.city || "").toLowerCase().trim() === city.toLowerCase().trim()
  );

  const availableSuppliers = suppliers.filter(s => 
      s.status === 'Active' && 
      s.services.includes('Activity') &&
      (s.city.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(s.city.toLowerCase()))
  );

  // Initialize State
  const [formData, setFormData] = useState<Activity>(() => {
    if (initialData) {
      return { 
        ...initialData, 
        // Ensure paxCount exists
        paxCount: (initialData.paxCount !== undefined && initialData.paxCount !== null) ? initialData.paxCount : globalPax 
      };
    }
    return {
      id: Date.now(),
      type: 'activity',
      paxCount: globalPax,
      heading: '',
      description: '',
      slot: '',
      startTime: '',
      duration: '',
      inclusionType: 'included', 
      // Prices are initialized to 0 since we removed inputs, but data structure keeps them for compatibility
      entranceFeePP: 0,
      activityFeePP: 0,
      guideType: 'guided',
      guideFee: 0,
      pickupLocation: '',
      pickupDate: dayDate || '',
      pickupTime: '09:00',
      dropoffLocation: '',
      dropoffDate: dayDate || '',
      dropoffTime: '11:00',
      activityType: 'attractions',
      linkedSupplierId: ''
    };
  });

  const [showSidebar, setShowSidebar] = useState(false);

  // Auto-select preferred supplier logic
  useEffect(() => {
      if (!formData.linkedSupplierId) {
          const preferred = availableSuppliers.find(s => s.isPreferred);
          if (preferred) {
              setFormData(prev => ({ ...prev, linkedSupplierId: preferred.id }));
          }
      }
  }, [availableSuppliers]); 

  const selectedSupplier = suppliers.find(s => s.id === formData.linkedSupplierId);

  // Sidebar Logic
  useEffect(() => {
    if (formData.slot) {
        setShowSidebar(true);
    }
  }, [formData.slot]);

  const sidebarList = formData.slot 
    ? cityAttractions.filter(a => 
        !a.suggestedSlot || 
        a.suggestedSlot === formData.slot || 
        a.suggestedSlot === 'Full Day'
      )
    : cityAttractions;

  const isSlotDisabled = (slotToCheck: string) => {
    const otherActivities = initialData 
      ? existingActivities.filter(a => a.id !== initialData.id) 
      : existingActivities;

    const hasFullDayActivity = otherActivities.some(a => a.slot === 'Full Day');
    if (hasFullDayActivity) return true;

    if (slotToCheck === 'Full Day') {
        const anyPartialSlotTaken = otherActivities.some(a => 
            ['Early Morning', 'Morning', 'Afternoon', 'Evening'].includes(a.slot)
        );
        return anyPartialSlotTaken; 
    }
    return otherActivities.some(a => a.slot === slotToCheck);
  };

  const handleChange = (field: keyof Activity, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSRMSelect = (srmItem: any) => {
    setFormData(prev => ({
      ...prev,
      heading: srmItem.name,
      description: srmItem.description || '',
      startTime: srmItem.startTime || prev.startTime,
      duration: srmItem.duration || '2 Hours',
      slot: srmItem.suggestedSlot || prev.slot,
      pickupLocation: srmItem.pickupLocation || prev.pickupLocation,
      activityType: srmItem.type.toLowerCase(),
      guideType: srmItem.isGuideRequired ? 'guided' : 'self_guided',
      inclusionType: 'included',
      // Note: We don't set prices from SRM here anymore, as they are handled in Costing
    }));
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  const handleSubmit = () => {
    if (!formData.heading) {
        alert("Please enter an activity name");
        return;
    }
    onSave(formData);
  };

  return (
    <div className="relative flex h-full w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-300">
      
      {/* LEFT SIDE: FORM */}
      <div className="flex-1 flex flex-col h-full bg-white relative z-10">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{initialData ? 'Edit Activity' : 'Add New Activity'}</h2>
            <p className="text-xs text-gray-500 flex items-center gap-2">
                <span className="font-semibold text-blue-600">{city}</span>
                <span>•</span>
                <span>{dayDate}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={onCancel} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleSubmit} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md flex items-center gap-2"><Save size={16} /> Save</button>
          </div>
        </div>

        {/* FORM BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* SECTION A: ACTIVITY DETAILS */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <FileText size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Activity Details</span>
            </div>

            <div className="space-y-4">
                
                {/* SUPPLIER SECTION */}
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-4 flex gap-4 items-start">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-blue-900 mb-2 flex items-center gap-1">
                            <Briefcase size={14} /> Fulfillment Partner (DMC)
                        </label>
                        <select 
                            className="w-full p-2.5 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.linkedSupplierId || ""}
                            onChange={(e) => handleChange('linkedSupplierId', e.target.value)}
                        >
                            <option value="">-- Direct / Unknown --</option>
                            {availableSuppliers.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.city}) {s.isPreferred ? '★ Preferred' : ''}
                                </option>
                            ))}
                        </select>
                        {availableSuppliers.length === 0 && (
                             <p className="text-[10px] text-gray-400 mt-1">No suppliers found for {city}.</p>
                        )}
                    </div>
                    
                    {/* Intelligence Box */}
                    {selectedSupplier && (
                        <div className="flex-1 bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-xs">
                            <div className="font-bold text-gray-800 mb-1 flex justify-between">
                                <span>{selectedSupplier.contactPerson}</span>
                                <span className="text-blue-600 bg-blue-50 px-1.5 rounded">{selectedSupplier.paymentTerms}</span>
                            </div>
                            <div className="text-gray-500 space-y-1">
                                <div className="flex items-center gap-1"><Phone size={10}/> {selectedSupplier.phone}</div>
                                <div className="truncate"><Mail size={10} className="inline mr-1"/>{selectedSupplier.email}</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Activity Name *</label>
                    <input type="text" value={formData.heading} onChange={(e) => handleChange('heading', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Guided Visit to Taj Mahal" />
                    </div>
                    <button onClick={() => setShowSidebar(!showSidebar)} className="mt-6 px-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors" title="View SRM Inventory"><PlusCircle size={20} /></button>
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
                            const isCurrentSelection = formData.slot === slot.value;
                            const actuallyDisabled = disabled && !isCurrentSelection;

                            return (
                                <option 
                                    key={slot.value} 
                                    value={slot.value} 
                                    disabled={actuallyDisabled}
                                    className={actuallyDisabled ? "text-gray-400 bg-gray-100" : "text-gray-900"}
                                >
                                    {slot.label} {actuallyDisabled ? "(Occupied)" : ""}
                                </option>
                            );
                        })}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Start Time</label>
                        <input type="time" value={formData.startTime} onChange={(e) => handleChange('startTime', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"/>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Duration</label>
                        <input type="text" value={formData.duration} onChange={(e) => handleChange('duration', e.target.value)} placeholder="e.g. 2 Hours" className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"/>
                    </div>
                </div>
                
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                    <textarea rows={2} value={formData.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Describe what the guest will experience..." className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:border-blue-500 outline-none resize-none"/>
                </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION B: PACKAGING STATUS (Prices Removed) */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Service Status</span>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Packaging Status</label>
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

                {formData.inclusionType !== 'excluded' && (
                    <div className="space-y-5 animate-in">
                        {/* 1. Pax Input Only (Total Cost box removed) */}
                        <div className="grid grid-cols-12 gap-4 items-end">
                            <div className="col-span-4">
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    No. of Pax (Participating)
                                </label>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={formData.paxCount} 
                                    onChange={(e) => handleChange('paxCount', parseInt(e.target.value) || 1)} 
                                    className="w-full p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm font-bold text-gray-800 focus:ring-2 focus:ring-yellow-400 outline-none" 
                                />
                            </div>
                             {/* The Green Total Cost Box has been REMOVED here as requested */}
                        </div>

                        {/* 2. Guide Option Only (Entrance & Activity Fee Inputs removed) */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Guide Option</label>
                            <div className="flex gap-4 items-center">
                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="guideType" checked={formData.guideType === 'guided'} onChange={() => handleChange('guideType', 'guided')} className="w-4 h-4 text-blue-600 focus:ring-blue-500"/><span className="text-sm font-semibold text-gray-700">Guided</span></label>
                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="guideType" checked={formData.guideType === 'self_guided'} onChange={() => handleChange('guideType', 'self_guided')} className="w-4 h-4 text-blue-600 focus:ring-blue-500"/><span className="text-sm font-semibold text-gray-700">Self Guided</span></label>
                            </div>
                            
                            {/* The Guide Fee Input has been REMOVED here as requested */}
                        </div>
                    </div>
                )}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION C: LOGISTICS (Restored) */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 text-purple-600 mb-2">
              <MapPin size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Logistics</span>
            </div>
            
            <div className="grid grid-cols-12 gap-3">
               <div className="col-span-6">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Pickup Location</label>
                  <input type="text" value={formData.pickupLocation} onChange={(e) => handleChange('pickupLocation', e.target.value)} placeholder="e.g. Hotel Lobby" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-500" />
               </div>
               <div className="col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Pickup Date</label>
                  <input type="date" value={formData.pickupDate} onChange={(e) => handleChange('pickupDate', e.target.value)} className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-500" />
               </div>
               <div className="col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Time</label>
                  <input type="time" value={formData.pickupTime} onChange={(e) => handleChange('pickupTime', e.target.value)} className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-500" />
               </div>
            </div>

            <div className="grid grid-cols-12 gap-3">
               <div className="col-span-6">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Drop-off Location</label>
                  <input type="text" value={formData.dropoffLocation} onChange={(e) => handleChange('dropoffLocation', e.target.value)} placeholder="e.g. City Center" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-500" />
               </div>
               <div className="col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Drop-off Date</label>
                  <input type="date" value={formData.dropoffDate} onChange={(e) => handleChange('dropoffDate', e.target.value)} className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-500" />
               </div>
               <div className="col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Time</label>
                  <input type="time" value={formData.dropoffTime} onChange={(e) => handleChange('dropoffTime', e.target.value)} className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-purple-500" />
               </div>
            </div>
          </section>

        </div>
      </div>

      {/* RIGHT SIDEBAR (Restored Layout with SRM Logic) */}
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
             {sidebarList.length === 0 ? (
                <div className="text-center p-6 text-gray-400 text-xs">
                    <p>No activities found in SRM for <strong>{city}</strong>.</p>
                    <p className="mt-2">Go to SRM Activity to add some.</p>
                </div>
             ) : (
                 sidebarList.map((item, i) => (
                    <div key={i} onClick={() => handleSRMSelect(item)} className="bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-blue-500 group overflow-hidden transition-all">
                        <div className="h-24 bg-gray-200 relative">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs flex-col gap-1">
                                    <ImageIcon size={16}/>
                                    <span>No Image</span>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 rounded text-[10px] font-bold shadow">{item.type}</div>
                            {item.rating > 0 && <div className="absolute bottom-2 left-2 flex gap-1"><span className="text-[10px] bg-black/70 text-white px-2 py-0.5 rounded flex items-center gap-1"><Star size={8} className="fill-yellow-400 text-yellow-400"/> {item.rating} ({item.reviewsCount || 0})</span></div>}
                        </div>
                        
                        <div className="p-3">
                             <div className="font-bold text-gray-800 text-sm group-hover:text-blue-600 line-clamp-2 leading-tight">{item.name}</div>
                             <div className="mt-2 flex justify-between items-center">
                                 <span className="text-[10px] text-gray-500 flex items-center gap-1"><Clock size={10}/> {item.duration || 'N/A'}</span>
                                 {/* Price display removed from Sidebar too to be consistent */}
                             </div>
                        </div>
                    </div>
                 ))
             )}
          </div>
      </div>

    </div>
  );
}