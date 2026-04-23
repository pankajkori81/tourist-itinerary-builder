
// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Camera, Hotel, Bus, Utensils, 
//   Calendar, Trash2, Edit, User, Clock,
//   Star, Moon, Car, Plane, Train, Ship, ArrowRight, ArrowLeft,
//   Ban, CheckCircle2, PlusSquare, Briefcase, AlertTriangle, 
//   Map,
//   MapPin , GripVertical
// } from 'lucide-react';


// import { useItinerary } from '@/app/context/ItineraryContext';
// import { useSRM } from '@/app/context/SRMContext'; 
// import { DayPlan } from './constants/daywiseConstants';
// import { useUser } from '@/app/context/UserContext';

// // --- SUB COMPONENTS ---
// import StayForm from './Stay/page';
// import ActivityForm from './activity/page';
// import TransportForm from './Transport/page';
// import MealForm from './meal/page';

// type ViewMode = 'list' | 'add_activity' | 'add_stay' | 'add_transport' | 'add_meal';

// // --- HELPER FUNCTIONS ---
// const formatDatePretty = (dateStr?: string) => {
//   if (!dateStr) return 'Date Not Set';
//   const date = new Date(dateStr);
//   if (isNaN(date.getTime())) return dateStr;
//   return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
// };

// // 👇 ADD THIS NEW HELPER
// const formatHeaderDate = (dateStr?: string) => {
//   if (!dateStr) return '';
//   const [year, month, day] = dateStr.split('-');
//   const date = new Date(Number(year), Number(month) - 1, Number(day));
//   return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
// };

// // --- STATUS BADGE HELPER ---
// const StatusBadge = ({ status }: { status: string }) => {
//   if (status === 'excluded') {
//     return (
//       <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 font-bold uppercase tracking-wider">
//         <Ban size={10} /> Excluded
//       </span>
//     );
//   }
//   if (status === 'optional') {
//     return (
//       <span className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-bold uppercase tracking-wider">
//         <PlusSquare size={10} /> Optional
//       </span>
//     );
//   }
//   return (
//     <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 font-bold uppercase tracking-wider">
//       <CheckCircle2 size={10} /> Included
//     </span>
//   );
// };

// export default function DaywisePage() {
//   const router = useRouter();
//   const { user } = useUser();
//   const { itineraryData, updateItineraryData, completeStep , logAction } = useItinerary();
//   const { suppliers } = useSRM();
  
//   const [selectedDayIndex, setSelectedDayIndex] = useState(0);
//   const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
//   const [viewMode, setViewMode] = useState<ViewMode>('list');
//   const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
//   const [editingItem, setEditingItem] = useState<any | null>(null);

//   const isMasterMode = itineraryData.isMasterItinerary;


//   // 👇 LOGIC: Handles dropping the day and instantly syncing the Routing
//   const handleDrop = (dropIndex: number) => {
//     if (draggedIndex === null || draggedIndex === dropIndex) return;

//     // 1. Reorder the array
//     const newPlans = [...dayPlans];
//     const [draggedItem] = newPlans.splice(draggedIndex, 1);
//     newPlans.splice(dropIndex, 0, draggedItem);

//     // 2. Re-index Day Numbers and Dates chronologically
//     let runningDate = itineraryData.routingData?.startDate ? new Date(itineraryData.routingData.startDate) : new Date();

//     const reindexedPlans = newPlans.map((plan, index) => {
//         const dateString = (itineraryData.routingData?.startDate && !isMasterMode)
//             ? runningDate.toISOString().split('T')[0] : '';
        
//         if (itineraryData.routingData?.startDate && !isMasterMode) {
//             runningDate.setDate(runningDate.getDate() + 1);
//         }
//         return { ...plan, dayNumber: index + 1, date: dateString };
//     });

//     // 3. ✨ REBUILD ROUTING DATA ✨ (This stops the refresh from breaking your changes!)
//     // It groups the dragged cities back into Nights (e.g. Rome x2, Florence x2)
//     const newRoutes: any[] = [];
//     if (reindexedPlans.length > 1) {
//         let currentCity = reindexedPlans[0].city;
//         let currentNights = 0;

//         // Loop through all days except the last one (the Departure day is 0 nights)
//         for (let i = 0; i < reindexedPlans.length - 1; i++) {
//             const plan = reindexedPlans[i];
//             if (plan.city === currentCity) {
//                 currentNights++;
//             } else {
//                 newRoutes.push({ id: Date.now() + i, cities: [{ name: currentCity }], nights: currentNights });
//                 currentCity = plan.city;
//                 currentNights = 1;
//             }
//         }
//         if (currentNights > 0) {
//            newRoutes.push({ id: Date.now() + 1000, cities: [{ name: currentCity }], nights: currentNights });
//         }
//     }



//     // 4. Save both the new days AND the new routing to the global database
//     setDayPlans(reindexedPlans);

//     updateItineraryData({ 
//         dayWiseActivities: reindexedPlans,
//         // 👇 TS FIX: Safely merge the object and bypass the strict type error
//         routingData: {
//             ...(itineraryData.routingData || {}),
//             routes: newRoutes
//         } as any
//     });
 
//     // 5. Keep the UI selection smooth so the blue highlight stays on the right box
//     if (selectedDayIndex === draggedIndex) setSelectedDayIndex(dropIndex);
//     else if (selectedDayIndex > draggedIndex && selectedDayIndex <= dropIndex) setSelectedDayIndex(selectedDayIndex - 1);
//     else if (selectedDayIndex < draggedIndex && selectedDayIndex >= dropIndex) setSelectedDayIndex(selectedDayIndex + 1);

//     setDraggedIndex(null);
//   };

//   // --- LOGIC: Expand Routes into Days based on Nights ---
//   useEffect(() => {
//     if (itineraryData.routingData?.routes) {
//       const routes = itineraryData.routingData.routes;
//       const savedPlans = (itineraryData.dayWiseActivities as DayPlan[]) || [];
//       const startDateStr = itineraryData.routingData.startDate; 

//       const generatedDayPlans: DayPlan[] = [];
//       let globalDayCounter = 1;
      
//       let runningDate = startDateStr ? new Date(startDateStr) : new Date();

//       routes.forEach((route) => {
//         const nightsCount = parseInt(route.nights?.toString() || '0') || 0;
//         const loopCount = nightsCount === 0 ? 1 : nightsCount; 

//         for (let i = 0; i < loopCount; i++) {
//           const existingPlan = savedPlans.find(p => p.dayNumber === globalDayCounter);
//           const dateString = (startDateStr && !isMasterMode) ? runningDate.toISOString().split('T')[0] : ''; 

//           generatedDayPlans.push({
//             dayNumber: globalDayCounter,
//             date: dateString,
//             city: route.cities && route.cities.length > 0 ? route.cities[0].name : 'Transit / Unknown',
//             activities: existingPlan?.activities || [],
//             stays: existingPlan?.stays || [],
//             transports: existingPlan?.transports || [],
//             meals: existingPlan?.meals || [],
//           });

//           globalDayCounter++;
//           if (startDateStr && !isMasterMode) {
//              runningDate.setDate(runningDate.getDate() + 1);
//           }
//         }
//       });

//       if (routes.length > 0) {
//           const lastRoute = routes[routes.length - 1];
//           const existingPlan = savedPlans.find(p => p.dayNumber === globalDayCounter);
//           const dateString = (startDateStr && !isMasterMode) ? runningDate.toISOString().split('T')[0] : '';

//           generatedDayPlans.push({
//               dayNumber: globalDayCounter,
//               date: dateString,
//               city: lastRoute.cities && lastRoute.cities.length > 0 ? lastRoute.cities[0].name : 'Departure', 
//               activities: existingPlan?.activities || [],
//               stays: existingPlan?.stays || [],
//               transports: existingPlan?.transports || [],
//               meals: existingPlan?.meals || [],
//           });
//       }

//       setDayPlans(generatedDayPlans);
//     }
//   }, [itineraryData.routingData, isMasterMode]);

//   const currentDay = dayPlans[selectedDayIndex];

//   if (!currentDay) {
//     return (
//       <div className="p-8 text-center">
//         <div className="text-gray-400 mb-2">Loading Days...</div>
//         <button onClick={() => router.push('/dashboard/itinerary/routing')} className="text-blue-500 underline text-sm">
//             Go back to Routing if this takes too long.
//         </button>

//       </div>
//     );
//   }




//   // --- HANDLERS ---
//   const handleSaveItem = (type: 'activity' | 'stay' | 'transport' | 'meal', data: any) => {
//     const updatedPlans = [...dayPlans];
//     const plan = updatedPlans[selectedDayIndex];

//     if(type === 'activity') { data.entranceFeePP = 0; data.activityFeePP = 0; data.guideFee = 0; }
//     if(type === 'stay') { data.costPerNight = 0; }
//     if(type === 'transport') { data.price = 0; }
//     if(type === 'meal') { data.adultCost = 0; data.childCost = 0; }

//     let isEdit = false;
//     let itemName = '';

//     if (type === 'activity') {
//       itemName = data.heading;
//       const idx = plan.activities.findIndex(a => a.id === data.id);
//       if (idx >= 0) { plan.activities[idx] = data; isEdit = true; } else plan.activities.push(data);
//     } else if (type === 'stay') {
//       itemName = data.hotelName;
//       const idx = plan.stays.findIndex(s => s.id === data.id);
//       if (idx >= 0) { plan.stays[idx] = data; isEdit = true; } else plan.stays.push(data);
//     } else if (type === 'transport') {
//       itemName = data.vehicleType;
//       const idx = plan.transports.findIndex(t => t.id === data.id);
//       if (idx >= 0) { plan.transports[idx] = data; isEdit = true; } else plan.transports.push(data);
//     } else if(type === 'meal'){
//       itemName = data.restaurantName;
//       const idx = plan.meals.findIndex(m => m.id === data.id);
//       if (idx >= 0) { plan.meals[idx] = data; isEdit = true; } else plan.meals.push(data);
//     }

//     // 👇 TRIGGER AUDIT LOG (Silently saves to history)
//     const actionType = isEdit ? 'EDIT' : 'ADD';
//     const actionDetails = `${isEdit ? 'Modified' : 'Added'} ${type} '${itemName}' on Day ${plan.dayNumber}`;
//     logAction(actionType, type.charAt(0).toUpperCase() + type.slice(1), actionDetails, user?.role || 'System');

//     setDayPlans(updatedPlans);
//     updateItineraryData({ dayWiseActivities: updatedPlans });
//     setViewMode('list');
//     setEditingItem(null);
//   };

//   const handleDeleteItem = (type: 'activity' | 'stay' | 'transport' | 'meal', id: number) => {
//     if (!confirm('Delete this item?')) return;
//     const updatedPlans = [...dayPlans];
//     const plan = updatedPlans[selectedDayIndex];
    
//     let itemName = 'Unknown Item';

//     // Find the item first to get its name for the log, then filter it out
//     if (type === 'activity') {
//         const item = plan.activities.find(a => a.id === id);
//         if (item) itemName = item.heading;
//         plan.activities = plan.activities.filter(a => a.id !== id);
//     }
//     else if (type === 'stay') {
//         const item = plan.stays.find(s => s.id === id);
//         if (item) itemName = item.hotelName;
//         plan.stays = plan.stays.filter(s => s.id !== id);
//     }
//     else if (type === 'transport') {
//         const item = plan.transports.find(t => t.id === id);
//         if (item) itemName = item.vehicleType;
//         plan.transports = plan.transports.filter(t => t.id !== id);
//     }
//     else if (type === 'meal') {
//         const item = plan.meals.find(m => m.id === id);
//         if (item) itemName = item.restaurantName;
//         plan.meals = plan.meals.filter(m => m.id !== id);
//     }
    
//     // 👇 TRIGGER AUDIT LOG (Silently saves to history)
//     const actionDetails = `Removed ${type} '${itemName}' from Day ${plan.dayNumber}`;
//     logAction('DELETE', type.charAt(0).toUpperCase() + type.slice(1), actionDetails, user?.role || 'System');

//     setDayPlans(updatedPlans);
//     updateItineraryData({ dayWiseActivities: updatedPlans });
//   };

//   const openAdd = (mode: ViewMode) => { setEditingItem(null); setViewMode(mode); };
//   const openEdit = (item: any, mode: ViewMode) => { setEditingItem(item); setViewMode(mode); };

//   const getSupplierName = (linkedId?: string) => {
//       if (!linkedId) return null;
//       const sup = suppliers.find(s => s.id === linkedId);
//       return sup ? sup.name : null;
//   };

//   const getGhostStays = () => {
//     const ghosts: any[] = [];
//     for (let i = 0; i < selectedDayIndex; i++) {
//       const pastDay = dayPlans[i];
//       pastDay.stays.forEach(stay => {
//         const stayEndIndex = i + stay.nights;
//         if (stayEndIndex > selectedDayIndex) {
//           ghosts.push({
//             ...stay,
//             isContinued: true, 
//             id: `ghost-${stay.id}-${selectedDayIndex}`
//           });
//         }
//       });
//     }
//     return ghosts;
//   };

//   const displayItems = [
//     ...getGhostStays(),
//     ...currentDay.activities,
//     ...currentDay.stays,
//     ...currentDay.transports,
//     ...(currentDay.meals || [])
//   ]; 

//   const handleBack = async () => router.push('/dashboard/itinerary/routing');
  
//   // 👇 HIGHLIGHT: Simply Move to Review Page
//   const handleNext = async () => {
//       completeStep('createDay'); 
//       router.push('/dashboard/itinerary/review');
//   };

//   return (
//     <div>
//       {/* INFO BANNER (If Admin Requested Changes) - Just for info, not locking */}
//       {itineraryData.status === 'reedit_requested' && itineraryData.adminComment && (
//         <div className="mx-4 mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm animate-in slide-in-from-top-2">
//           <div className="flex items-start gap-3">
//             <AlertTriangle className="text-blue-600 mt-0.5" size={20} />
//             <div>
//               <p className="font-bold text-blue-800 text-sm">Note from Admin</p>
//               <p className="text-blue-700 text-sm mt-1">"{itineraryData.adminComment}"</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex h-full min-h-[calc(100vh-180px)] gap-4 p-4">
        
//         {/* --- LEFT: MAIN CONTENT AREA --- */}
//         <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          
//           {viewMode === 'list' ? (
//             <div className="flex flex-col h-full">
              
//               {/* Toolbar Header */}
//               <div className="bg-white/10 border-b border-white/10 p-6 flex justify-between items-end">
//                  {/* <div>
//                     <h1 className="text-3xl font-bold text-white mb-1">{currentDay.city}</h1>
//                     <p className="text-gray-300 flex items-center gap-2">
//                         <Calendar size={16}/> 
//                         {isMasterMode ? (
//                             <span>Day Sequence: <span className="text-blue-300 font-bold">Day {currentDay.dayNumber}</span></span>
//                         ) : (
//                             <>
//                                 {formatDatePretty(currentDay.date)} | <span className="text-blue-300 font-bold">Day {currentDay.dayNumber}</span>
//                             </>
//                         )}
//                     </p>
//                  </div> */}

//                  <div>
//                     <h1 className="text-3xl font-bold text-white mb-1">{currentDay.city}</h1>
//                     {/* 👇 CHANGED: Now shows "Day X | April 08, 2026" */}
//                     <p className="text-gray-300 flex items-center gap-2">
//                         <Calendar size={16}/> 
//                         {isMasterMode || !currentDay.date ? (
//                             <span>Day Sequence: <span className="text-blue-300 font-bold">Day {currentDay.dayNumber}</span></span>
//                         ) : (
//                             <span>
//                                 Day Sequence: <span className="text-blue-300 font-bold">Day {currentDay.dayNumber}</span> | {formatHeaderDate(currentDay.date)}
//                             </span>
//                         )}
//                     </p>
//                  </div>

//                  {/* ADD BUTTONS (ALWAYS VISIBLE) */}
//                  <div className="flex gap-4">
//                         <NavIcon icon={<Camera size={24}/>} label="Activity" onClick={() => openAdd('add_activity')} color="bg-blue-500" />
//                         <NavIcon icon={<Hotel size={24}/>} label="Stay" onClick={() => openAdd('add_stay')} color="bg-purple-600" />
//                         <NavIcon icon={<Bus size={24}/>} label="Transport" onClick={() => openAdd('add_transport')} color="bg-green-500" />
//                         <NavIcon icon={<Utensils size={24}/>} label="Meal" onClick={() => openAdd('add_meal')} color="bg-orange-500" />
//                  </div>
//               </div>

//               {/* Main List Area */}
//               <div className="flex-1 overflow-y-auto p-6 space-y-6">
//                 {displayItems.length === 0 && (
//                   <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-500/30 rounded-xl text-gray-400">
//                      <p>No plans yet for Day {currentDay.dayNumber}.</p>
//                   </div>
//                 )}

//                 {displayItems.map((item: any) => {
//                   const supplierName = getSupplierName(item.linkedSupplierId);

//                   return (
//                   <div key={`${item.type}-${item.id}`} className="relative group">
                    
//                     {/* ACTIVITY CARD */}
//                     {item.type === 'activity' && (
//                       <div className={`bg-white rounded-xl p-5 shadow-lg border-l-4 ${item.inclusionType === 'excluded' ? 'border-red-500 opacity-90' : 'border-blue-500'} flex gap-5`}>
//                          <div className={`w-24 rounded-lg flex-shrink-0 flex flex-col items-center justify-center border ${item.inclusionType === 'excluded' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
//                              <Camera size={32} />
//                          </div>
//                          <div className="flex-1">
//                             <div className="flex justify-between items-start">
//                                <div>
//                                  <div className="flex items-center gap-3">
//                                      <h4 className="font-bold text-xl text-gray-800 flex items-center gap-2">{item.heading}</h4>
//                                      <StatusBadge status={item.inclusionType} />
//                                  </div>
//                                  {supplierName && <div className="mt-1 inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[10px] border border-blue-100"><Briefcase size={10} /><span className="font-bold">By: {supplierName}</span></div>}
//                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
//                                     <div className="text-[10px] font-bold uppercase tracking-wider mt-3 mb-1 opacity-70 flex gap-4">
//                                       <span>Slot: {item.slot || 'Activity'}</span>
//                                       {item.startTime && <span>Start: {item.startTime}</span>}
//                                       <span>Duration: {item.duration || 'N/A'}</span> 
//                                    </div>
//                                </div>

//                                {/* EDIT/DELETE ALWAYS VISIBLE */}
//                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                     <button onClick={() => openEdit(item, 'add_activity')} className="text-green-600 hover:bg-green-50 p-1.5 rounded-md"><Edit size={16}/></button>
//                                     <button onClick={() => handleDeleteItem('activity', item.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"><Trash2 size={16}/></button>
//                                </div>
//                             </div>
                            
                     


//                             <div className="mt-4 grid grid-cols-12 gap-3">
//                                {/* Combined Pickup & Drop-off Block */}
//                                <div className="col-span-8 bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between gap-4">
//                                   <div className="flex-1 overflow-hidden">
//                                      <div className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1 mb-1"><MapPin size={10} /> Pickup</div>
//                                      <div className="text-xs font-bold text-gray-700 truncate" title={item.pickupLocation}>{item.pickupLocation || 'Not Set'}</div>
//                                      <div className="text-[10px] font-bold text-blue-600 mt-1">{item.pickupTime || '--:--'}</div>
//                                   </div>
                                  
//                                   <div className="w-px bg-gray-200"></div> {/* Vertical Divider */}
                                  
//                                   <div className="flex-1 overflow-hidden">
//                                      <div className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1 mb-1"><MapPin size={10} /> Drop-off</div>
//                                      <div className="text-xs font-bold text-gray-700 truncate" title={item.dropoffLocation}>{item.dropoffLocation || 'Not Set'}</div>
//                                      <div className="text-[10px] font-bold text-blue-600 mt-1">{item.dropoffTime || '--:--'}</div>
//                                   </div>
//                                </div>
                             
//                                {/* Guide Option Block */}
//                                <div className="col-span-4 bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col justify-center">
//                                   <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1"><User size={10} /> Guide Option</div>
//                                   <div className="text-xs font-bold text-gray-700 capitalize mt-1">{item.guideType === 'guided' ? 'Guided Tour' : 'Self Guided'}</div>
//                                </div>
//                             </div>



//                          </div>
//                       </div>
//                     )}

//                     {/* STAY CARD */}
//                     {item.type === 'stay' && (
//                       <div className={`rounded-xl p-6 shadow-lg border-l-4 flex gap-5 group relative ${item.isContinued ? 'bg-gray-50 border-gray-400 opacity-90' : item.inclusionType === 'excluded' ? 'bg-white border-red-500' : 'bg-white border-purple-500'}`}>
//                           <div className="w-24 h-32 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden group-hover:shadow-md transition-all flex flex-col items-center justify-center">
//                                <Hotel size={32} className={item.inclusionType === 'excluded' ? 'text-red-500' : 'text-purple-600'} />
//                               <div className={`absolute top-0 left-0 text-white text-[10px] font-bold px-1 py-1 rounded-br-lg z-10 ${item.isContinued ? 'bg-gray-500' : (item.inclusionType === 'excluded' ? 'bg-red-500' : 'bg-purple-600')}`}>{item.isContinued ? 'CONTINUED' : 'STAY'}</div>
//                           </div>
//                           <div className="flex-1 flex flex-col justify-between">
//                               <div className="flex justify-between items-start">
//                                   <div>
//                                       <h4 className="font-bold text-xl text-gray-800 leading-tight">{item.hotelName}</h4>
//                                       {!item.isContinued && supplierName && <div className="mt-1 inline-flex items-center gap-1 bg-purple-50 text-purple-800 px-2 py-0.5 rounded text-[10px] border border-purple-100"><Briefcase size={10} /><span className="font-bold">By: {supplierName}</span></div>}
//                                       <div className="flex gap-2 mt-1.5 items-center">
//                                           {!item.isContinued && <StatusBadge status={item.inclusionType} />}
//                                           <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-gray-900 px-2 py-0.5 rounded border border-purple-100">{item.category} • {item.stayType}</span>
//                                           <span className='text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-gray-900 px-2 py-0.5 rounded border border-orange-100 flex items-center gap-1'><Star size={10} className="fill-yellow-500 text-yellow-500" /> {item.rating}</span>
//                                       </div>
//                                   </div>
//                                   {!item.isContinued && (
//                                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                         <button onClick={() => openEdit(item, 'add_stay')} className="text-green-600 hover:bg-green-50 p-1.5 rounded-md"><Edit size={16}/></button>
//                                         <button onClick={() => handleDeleteItem('stay', item.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"><Trash2 size={16}/></button>
//                                     </div>
//                                   )}
//                               </div>
//                               <div className="grid grid-cols-12 gap-3 mt-4">
//                                   <div className="col-span-4 bg-white border border-gray-200 rounded p-2">
//                                       <div className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Room</div>
//                                       <div className="text-xs font-bold text-gray-700 truncate" title={item.roomCategory}>{item.numRooms} x {item.roomCategory}</div>
//                                   </div>
//                                   <div className="col-span-4 bg-white border border-gray-200 rounded p-2">
//                                       <div className="text-[10px] text-gray-500 uppercase font-bold mb-0.5 flex items-center gap-1">Duration</div>
//                                       <div className="text-xs font-bold text-gray-700 flex items-center gap-1"><Moon size={12} className="text-purple-400" /> {item.nights} Nights</div>
//                                   </div>
//                                   <div className="col-span-4 bg-white border border-gray-200 rounded p-2">
//                                       <div className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Schedule</div>
//                                       <div className="text-xs font-bold text-gray-700 flex justify-between"><span>In: {item.checkInTime}</span><span className="text-gray-300">|</span><span>Out: {item.checkOutTime}</span></div>
//                                   </div>
//                               </div>
//                           </div>
//                       </div>
//                     )}

//                     {/* TRANSPORT CARD */}
//                     {item.type === 'transport' && (
//                         <div className={`bg-white rounded-xl p-5 shadow-lg border-l-4 ${item.inclusionType === 'excluded' ? 'border-red-500' : 'border-green-500'} flex gap-5 group`}>
//                             <div className={`w-24 rounded-lg flex-shrink-0 flex flex-col items-center justify-center border ${item.inclusionType === 'excluded' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
//                                 {item.mode === 'flight' ? <Plane size={24}/> : item.mode === 'rail' ? <Train size={24}/> : item.mode === 'ferry' ? <Ship size={24}/> : <Car size={24}/>}
//                                 <span className="text-[10px] font-bold uppercase mt-1 tracking-wider">{item.mode}</span>
//                             </div>
//                             <div className="flex-1 flex flex-col justify-between">
//                                 <div className="flex justify-between items-start">
//                                     <div>
//                                         <div className="flex items-center gap-3">
//                                             <h4 className="font-bold text-xl text-gray-800 flex items-center gap-2">{item.vehicleType || 'Transport'}</h4>
//                                             <StatusBadge status={item.inclusionType} />
//                                         </div>
//                                         {supplierName && <div className="mt-1 inline-flex items-center gap-1 bg-green-50 text-green-800 px-2 py-0.5 rounded text-[10px] border border-green-100"><Briefcase size={10} /><span className="font-bold">By: {supplierName}</span></div>}
//                                         <span className="text-[10px] bg-gray-100 text-gray-600 px-5 py-0.5 mt-2 rounded-full border border-gray-200 font-bold uppercase inline-block ml-2">{item.subType}</span>
//                                     </div>
                                    
//                                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                             <button onClick={() => openEdit(item, 'add_transport')} className="text-green-600 hover:bg-green-50 p-1.5 rounded-md"><Edit size={16}/></button>
//                                             <button onClick={() => handleDeleteItem('transport', item.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"><Trash2 size={16}/></button>
//                                     </div>
//                                 </div>
//                                 {item.serviceDescription && <div className="mt-2 mb-1"><p className="text-sm text-gray-600 leading-relaxed border-l-2 border-gray-200 pl-3 py-1 italic">“{item.serviceDescription}”</p></div>}
//                                 <div className="mt-2 grid grid-cols-12 gap-3 mb-1">
//                                     <div className="col-span-12 bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col justify-center">
//                                         <div className="flex items-center gap-2">
//                                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
//                                             <div className="flex items-center justify-start w-full overflow-hidden"><span className="text-xs font-bold text-gray-700 truncate mr-2">Pickup: {item.pickupLocation || 'Not set'}</span><span className="text-xs font-bold text-gray-700 whitespace-nowrap ml-5">Time: {item.pickupTime}</span></div>
//                                         </div>
//                                         <div className="flex items-center mt-2 gap-2">
//                                             <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></div>
//                                             <div className="flex items-center justify-start w-full overflow-hidden"><span className="text-xs font-bold text-gray-700 truncate mr-2">{item.subType === 'transfer' ? `Drop: ${item.dropoffLocation || 'Not set'}` : `Duration: ${item.duration}`}</span></div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* MEAL CARD */}
//                     {item.type === 'meal' && (
//                       <div className={`bg-white rounded-xl p-5 shadow-lg border-l-4 ${item.inclusionType === 'excluded' ? 'border-red-500' : 'border-orange-500'} flex gap-5 group`}>
//                           <div className={`w-24 rounded-lg flex-shrink-0 flex flex-col items-center justify-center border ${item.inclusionType === 'excluded' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
//                                <Utensils size={24} />
//                           </div>
//                           <div className="flex-1 flex flex-col justify-between">
//                               <div className="flex justify-between items-start">
//                                   <div>
//                                       <div className="flex items-center gap-3">
//                                           <h4 className="font-bold text-xl text-gray-800">{item.restaurantName}</h4>
//                                           <StatusBadge status={item.inclusionType} />
//                                       </div>
//                                       {supplierName && <div className="mt-1 inline-flex items-center gap-1 bg-orange-50 text-orange-800 px-2 py-0.5 rounded text-[10px] border border-orange-100"><Briefcase size={10} /><span className="font-bold">By: {supplierName}</span></div>}
//                                       <div className="flex gap-2 mt-1">
//                                           <span className="text-[12px] font-bold bg-gray-100 mt-2 text-gray-800 px-2 py-0.5 rounded border border-gray-200">{item.mealType}</span>
//                                           <span className="text-[12px] font-bold text-yellow-700 mt-2 ml-5 px-2 py-0.5 rounded flex items-center gap-1">Rating:<Star size={8} className="fill-current"/> {item.rating}</span>
//                                       </div>
//                                   </div>
                                  
//                                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                       <button onClick={() => openEdit(item, 'add_meal')} className="text-orange-600 hover:bg-orange-50 p-1.5 rounded-md"><Edit size={16}/></button>
//                                       <button onClick={() => handleDeleteItem('meal', item.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"><Trash2 size={16}/></button>
//                                   </div>
//                               </div>
//                               <div className="mt-4 grid grid-cols-12 gap-3">
//                                   <div className="col-span-8 bg-gray-50 p-3 rounded-lg border border-gray-100">
//                                       <div className="text-[11px] text-gray-600 uppercase font-bold mb-0.5">Location</div>
//                                       <div className="text-xs font-bold text-gray-800 mt-1 truncate" title={item.address}>{item.address}</div>
//                                   </div>
//                                   <div className="col-span-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
//                                       <div className="text-[11px] text-gray-600 uppercase font-bold mb-0.5">Payment</div>
//                                       <div className={`text-xs font-bold capitalize ${item.inclusionType === 'included' ? 'text-green-600' : 'text-gray-600'}`}>{item.inclusionType === 'included' ? 'Pre-Paid' : 'Direct Pay'}</div>
//                                   </div>
//                               </div>
//                           </div>
//                       </div>
//                     )}

//                   </div>
//                   )
//                 })}
//               </div>

//             </div>
//           ) : (
//             // --- SUB FORMS RENDER ---
//             <div className="h-full p-6">
//                 {viewMode === 'add_activity' && <ActivityForm initialData={editingItem} existingActivities={currentDay.activities} city={currentDay.city} dayDate={currentDay.date} onSave={(d) => handleSaveItem('activity', d)} onCancel={() => setViewMode('list')} />}
//                 {viewMode === 'add_stay' && <StayForm initialData={editingItem} city={currentDay.city} dayDate={currentDay.date} onSave={(d) => handleSaveItem('stay', d)} onCancel={() => setViewMode('list')} />}
//                 {viewMode === 'add_transport' && <TransportForm initialData={editingItem} city={currentDay.city} dayDate={currentDay.date} onSave={(d) => handleSaveItem('transport', d)} onCancel={() => setViewMode('list')} />}
//                 {viewMode === 'add_meal' && <MealForm initialData={editingItem} city={currentDay.city} dayDate={currentDay.date} onSave={(d) => handleSaveItem('meal', d)} onCancel={() => setViewMode('list')} />}
//             </div>
//           )}
//         </div>

  

//         {/* --- RIGHT: DAY SELECTOR (Draggable) --- */}
//         <div className="w-64 bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-3 overflow-y-auto">
//           <h2 className="text-gray-100 font-bold text-lg mb-4 border-b border-white/10 pb-2 uppercase">Day Journey</h2>
//           <div className="space-y-2">
//             {dayPlans.map((day, idx) => (
//               <div 
//                 key={`day-${day.dayNumber}-${idx}`}
//                 draggable 
//                 onDragStart={() => setDraggedIndex(idx)}
//                 onDragOver={(e) => e.preventDefault()} 
//                 onDrop={(e) => { e.preventDefault(); handleDrop(idx); }}
//                 onDragEnd={() => setDraggedIndex(null)}
//                 className={`w-full flex items-stretch p-1 rounded-xl transition-all border ${
//                   idx === selectedDayIndex 
//                     ? 'bg-blue-500 border-blue-400 text-white shadow-lg' 
//                     : 'bg-white border-transparent text-gray-900 hover:bg-white/90'
//                 } ${draggedIndex === idx ? 'opacity-50 border-dashed border-2' : ''}`}
//               >
//                   {/* 👇 The Drag Handle (Grip Icon) */}
//                   <div className={`flex items-center justify-center px-1 cursor-grab active:cursor-grabbing ${idx === selectedDayIndex ? 'text-blue-200' : 'text-gray-400 hover:text-gray-600'}`}>
//                       <GripVertical size={16} />
//                   </div>
                  
//                   {/* The Clickable Button Area */}
//                   <button 
//                       onClick={() => { setSelectedDayIndex(idx); setViewMode('list'); }} 
//                       className="flex-1 text-left p-1 pl-1"
//                   >
//                       <div className={`text-[10px] font-bold uppercase ${idx === selectedDayIndex ? 'text-blue-100' : 'text-gray-500'}`}>
//                           Day {day.dayNumber}
//                       </div>
//                       <div className="font-bold truncate text-sm">{day.city}</div>
//                       {!isMasterMode && <div className={`text-[10px] mt-0.5 ${idx === selectedDayIndex ? 'text-blue-200' : 'text-gray-500'}`}>{formatDatePretty(day.date)}</div>}
                      
//                       <div className="flex gap-1 mt-1 justify-end pr-2">
//                           {day.stays.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-purple-400"/>}
//                           {day.activities.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-blue-300"/>}
//                           {day.transports.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-green-400"/>}
//                       </div>
//                   </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
      
//       <div className="flex justify-between items-center mr-5 mb-5 ">
//          <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white px-6 py-3 rounded-lg font-medium hover:bg-white/5"><ArrowLeft size={18} /> Back</button>

//          <div className="flex gap-3">
//              <button 
//                 onClick={handleNext} 
//                 className="group flex items-center gap-2 px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform hover:scale-[1.02] bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20"
//              >
//                 Next Step: Review Itinerary <ArrowRight size={18} />
//              </button>
//          </div>
//       </div>
//     </div>
//   );
// }

// function NavIcon({icon, label, color, onClick}: {icon: any, label: string, color: string, onClick: () => void}) {
//   return (
//     <button onClick={onClick} className="flex flex-col items-center gap-1 group">
//        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>{icon}</div>
//        <span className="text-[10px] font-bold text-gray-300 group-hover:text-white uppercase tracking-wider">{label}</span>
//     </button>
//   )
// }








































































































"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Camera, Hotel, Bus, Utensils, 
  Calendar, Trash2, Edit, User, Clock,
  Star, Moon, Car, Plane, Train, Ship, ArrowRight, ArrowLeft,
  Ban, CheckCircle2, PlusSquare, Briefcase, AlertTriangle, 
  Map,
  MapPin , GripVertical
} from 'lucide-react';


import { useItinerary } from '@/app/context/ItineraryContext';
import { useSRM } from '@/app/context/SRMContext'; 
import { DayPlan } from './constants/daywiseConstants';
import { useUser } from '@/app/context/UserContext';

// --- SUB COMPONENTS ---
import StayForm from './Stay/page';
import ActivityForm from './activity/page';
import TransportForm from './Transport/page';
import MealForm from './meal/page';

type ViewMode = 'list' | 'add_activity' | 'add_stay' | 'add_transport' | 'add_meal';

// --- HELPER FUNCTIONS ---
const formatDatePretty = (dateStr?: string) => {
  if (!dateStr) return 'Date Not Set';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

// 👇 NEW HELPER: Forces American Format for Header (e.g., April 08, 2026)
const formatHeaderDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
};

// --- STATUS BADGE HELPER ---
const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'excluded') {
    return (
      <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 font-bold uppercase tracking-wider">
        <Ban size={10} /> Excluded
      </span>
    );
  }
  if (status === 'optional') {
    return (
      <span className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-bold uppercase tracking-wider">
        <PlusSquare size={10} /> Optional
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 font-bold uppercase tracking-wider">
      <CheckCircle2 size={10} /> Included
    </span>
  );
};

export default function DaywisePage() {
  const router = useRouter();
  const { user } = useUser();
  const { itineraryData, updateItineraryData, completeStep , logAction } = useItinerary();
  const { suppliers } = useSRM();
  
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const isMasterMode = itineraryData.isMasterItinerary;


  // 👇 LOGIC: Handles dropping the day and instantly syncing the Routing
  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    // 1. Reorder the array
    const newPlans = [...dayPlans];
    const [draggedItem] = newPlans.splice(draggedIndex, 1);
    newPlans.splice(dropIndex, 0, draggedItem);

    // 2. Re-index Day Numbers and Dates chronologically
    let runningDate = itineraryData.routingData?.startDate ? new Date(itineraryData.routingData.startDate) : new Date();

    const reindexedPlans = newPlans.map((plan, index) => {
        // 🌟 FIX: Removed !isMasterMode so dragged dates calculate correctly if they exist
        const dateString = itineraryData.routingData?.startDate ? runningDate.toISOString().split('T')[0] : '';
        
        if (itineraryData.routingData?.startDate) {
            runningDate.setDate(runningDate.getDate() + 1);
        }
        return { ...plan, dayNumber: index + 1, date: dateString };
    });

    // 3. ✨ REBUILD ROUTING DATA ✨ (This stops the refresh from breaking your changes!)
    const newRoutes: any[] = [];
    if (reindexedPlans.length > 1) {
        let currentCity = reindexedPlans[0].city;
        let currentNights = 0;

        // Loop through all days except the last one (the Departure day is 0 nights)
        for (let i = 0; i < reindexedPlans.length - 1; i++) {
            const plan = reindexedPlans[i];
            if (plan.city === currentCity) {
                currentNights++;
            } else {
                newRoutes.push({ id: Date.now() + i, cities: [{ name: currentCity }], nights: currentNights });
                currentCity = plan.city;
                currentNights = 1;
            }
        }
        if (currentNights > 0) {
           newRoutes.push({ id: Date.now() + 1000, cities: [{ name: currentCity }], nights: currentNights });
        }
    }

    // 4. Save both the new days AND the new routing to the global database
    setDayPlans(reindexedPlans);

    updateItineraryData({ 
        dayWiseActivities: reindexedPlans,
        // 👇 TS FIX: Safely merge the object and bypass the strict type error
        routingData: {
            ...(itineraryData.routingData || {}),
            routes: newRoutes
        } as any
    });
 
    // 5. Keep the UI selection smooth so the blue highlight stays on the right box
    if (selectedDayIndex === draggedIndex) setSelectedDayIndex(dropIndex);
    else if (selectedDayIndex > draggedIndex && selectedDayIndex <= dropIndex) setSelectedDayIndex(selectedDayIndex - 1);
    else if (selectedDayIndex < draggedIndex && selectedDayIndex >= dropIndex) setSelectedDayIndex(selectedDayIndex + 1);

    setDraggedIndex(null);
  };

  // --- LOGIC: Expand Routes into Days based on Nights ---
  useEffect(() => {
    if (itineraryData.routingData?.routes) {
      const routes = itineraryData.routingData.routes;
      const savedPlans = (itineraryData.dayWiseActivities as DayPlan[]) || [];
      const startDateStr = itineraryData.routingData.startDate; 

      const generatedDayPlans: DayPlan[] = [];
      let globalDayCounter = 1;
      
      let runningDate = startDateStr ? new Date(startDateStr) : new Date();

      routes.forEach((route) => {
        const nightsCount = parseInt(route.nights?.toString() || '0') || 0;
        const loopCount = nightsCount === 0 ? 1 : nightsCount; 

        for (let i = 0; i < loopCount; i++) {
          const existingPlan = savedPlans.find(p => p.dayNumber === globalDayCounter);
          // 🌟 FIX: Removed !isMasterMode so dates load correctly on initial render
          const dateString = startDateStr ? runningDate.toISOString().split('T')[0] : ''; 

          generatedDayPlans.push({
            dayNumber: globalDayCounter,
            date: dateString,
            city: route.cities && route.cities.length > 0 ? route.cities[0].name : 'Transit / Unknown',
            activities: existingPlan?.activities || [],
            stays: existingPlan?.stays || [],
            transports: existingPlan?.transports || [],
            meals: existingPlan?.meals || [],
          });

          globalDayCounter++;
          if (startDateStr) {
             runningDate.setDate(runningDate.getDate() + 1);
          }
        }
      });

      if (routes.length > 0) {
          const lastRoute = routes[routes.length - 1];
          const existingPlan = savedPlans.find(p => p.dayNumber === globalDayCounter);
          // 🌟 FIX: Removed !isMasterMode here too
          const dateString = startDateStr ? runningDate.toISOString().split('T')[0] : '';

          generatedDayPlans.push({
              dayNumber: globalDayCounter,
              date: dateString,
              city: lastRoute.cities && lastRoute.cities.length > 0 ? lastRoute.cities[0].name : 'Departure', 
              activities: existingPlan?.activities || [],
              stays: existingPlan?.stays || [],
              transports: existingPlan?.transports || [],
              meals: existingPlan?.meals || [],
          });
      }

      setDayPlans(generatedDayPlans);
    }
  }, [itineraryData.routingData, isMasterMode]);

  const currentDay = dayPlans[selectedDayIndex];

  if (!currentDay) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-2">Loading Days...</div>
        <button onClick={() => router.push('/dashboard/itinerary/routing')} className="text-blue-500 underline text-sm">
            Go back to Routing if this takes too long.
        </button>

      </div>
    );
  }

  // --- HANDLERS ---
  const handleSaveItem = (type: 'activity' | 'stay' | 'transport' | 'meal', data: any) => {
    const updatedPlans = [...dayPlans];
    const plan = updatedPlans[selectedDayIndex];

    if(type === 'activity') { data.entranceFeePP = 0; data.activityFeePP = 0; data.guideFee = 0; }
    if(type === 'stay') { data.costPerNight = 0; }
    if(type === 'transport') { data.price = 0; }
    if(type === 'meal') { data.adultCost = 0; data.childCost = 0; }

    let isEdit = false;
    let itemName = '';

    if (type === 'activity') {
      itemName = data.heading;
      const idx = plan.activities.findIndex(a => a.id === data.id);
      if (idx >= 0) { plan.activities[idx] = data; isEdit = true; } else plan.activities.push(data);
    } else if (type === 'stay') {
      itemName = data.hotelName;
      const idx = plan.stays.findIndex(s => s.id === data.id);
      if (idx >= 0) { plan.stays[idx] = data; isEdit = true; } else plan.stays.push(data);
    } else if (type === 'transport') {
      itemName = data.vehicleType;
      const idx = plan.transports.findIndex(t => t.id === data.id);
      if (idx >= 0) { plan.transports[idx] = data; isEdit = true; } else plan.transports.push(data);
    } else if(type === 'meal'){
      itemName = data.restaurantName;
      const idx = plan.meals.findIndex(m => m.id === data.id);
      if (idx >= 0) { plan.meals[idx] = data; isEdit = true; } else plan.meals.push(data);
    }

    // 👇 TRIGGER AUDIT LOG (Silently saves to history)
    const actionType = isEdit ? 'EDIT' : 'ADD';
    const actionDetails = `${isEdit ? 'Modified' : 'Added'} ${type} '${itemName}' on Day ${plan.dayNumber}`;
    logAction(actionType, type.charAt(0).toUpperCase() + type.slice(1), actionDetails, user?.role || 'System');

    setDayPlans(updatedPlans);
    updateItineraryData({ dayWiseActivities: updatedPlans });
    setViewMode('list');
    setEditingItem(null);
  };

  const handleDeleteItem = (type: 'activity' | 'stay' | 'transport' | 'meal', id: number) => {
    if (!confirm('Delete this item?')) return;
    const updatedPlans = [...dayPlans];
    const plan = updatedPlans[selectedDayIndex];
    
    let itemName = 'Unknown Item';

    // Find the item first to get its name for the log, then filter it out
    if (type === 'activity') {
        const item = plan.activities.find(a => a.id === id);
        if (item) itemName = item.heading;
        plan.activities = plan.activities.filter(a => a.id !== id);
    }
    else if (type === 'stay') {
        const item = plan.stays.find(s => s.id === id);
        if (item) itemName = item.hotelName;
        plan.stays = plan.stays.filter(s => s.id !== id);
    }
    else if (type === 'transport') {
        const item = plan.transports.find(t => t.id === id);
        if (item) itemName = item.vehicleType;
        plan.transports = plan.transports.filter(t => t.id !== id);
    }
    else if (type === 'meal') {
        const item = plan.meals.find(m => m.id === id);
        if (item) itemName = item.restaurantName;
        plan.meals = plan.meals.filter(m => m.id !== id);
    }
    
    // 👇 TRIGGER AUDIT LOG (Silently saves to history)
    const actionDetails = `Removed ${type} '${itemName}' from Day ${plan.dayNumber}`;
    logAction('DELETE', type.charAt(0).toUpperCase() + type.slice(1), actionDetails, user?.role || 'System');

    setDayPlans(updatedPlans);
    updateItineraryData({ dayWiseActivities: updatedPlans });
  };

  const openAdd = (mode: ViewMode) => { setEditingItem(null); setViewMode(mode); };
  const openEdit = (item: any, mode: ViewMode) => { setEditingItem(item); setViewMode(mode); };

  const getSupplierName = (linkedId?: string) => {
      if (!linkedId) return null;
      const sup = suppliers.find(s => s.id === linkedId);
      return sup ? sup.name : null;
  };

  const getGhostStays = () => {
    const ghosts: any[] = [];
    for (let i = 0; i < selectedDayIndex; i++) {
      const pastDay = dayPlans[i];
      pastDay.stays.forEach(stay => {
        const stayEndIndex = i + stay.nights;
        if (stayEndIndex > selectedDayIndex) {
          ghosts.push({
            ...stay,
            isContinued: true, 
            id: `ghost-${stay.id}-${selectedDayIndex}`
          });
        }
      });
    }
    return ghosts;
  };

  // const displayItems = [
  //   ...getGhostStays(),
  //   ...currentDay.activities,
  //   ...currentDay.stays,
  //   ...currentDay.transports,
  //   ...(currentDay.meals || [])
  // ]; 




  // ==========================================
  // 🌟 NEW: CHRONOLOGICAL TIME SORTING ALGORITHM
  // ==========================================
  const getSortedDisplayItems = () => {
    // 1. Gather all items for the day into one unsorted list
    const allItems = [
      ...getGhostStays(),
      ...currentDay.activities,
      ...currentDay.stays,
      ...currentDay.transports,
      ...(currentDay.meals || [])
    ];

    // 2. The Math Helper: Converts "HH:MM" string into pure minutes past midnight
    const timeToMinutes = (timeStr?: string) => {
      if (!timeStr) return 1439; // If no time exists, assign 1439 mins (23:59) so it drops to the bottom
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return 1439;
      return (hours * 60) + minutes;
    };

    // 3. Normalize the times, attach mathematical value, and sort!
    return allItems.map(item => {
      let timeStr = "23:59"; // Default fallback
      
      if (item.type === 'stay' && item.isContinued) {
          timeStr = "00:00"; // Ghost Stays (waking up at hotel) forced to Midnight so they stay at the top
      } else if (item.type === 'stay') {
          timeStr = item.checkInTime || "14:00"; // Standard hotel check-in
      } else if (item.type === 'transport') {
          timeStr = item.pickupTime; // Transport relies on pickup
      } else if (item.type === 'activity') {
          timeStr = item.startTime; // Activities rely on start time
      } else if (item.type === 'meal') {
          timeStr = item.time || "23:59"; // Meals rely on reservation time
      }

      // Return the item with our new secret sorting variable attached
      return { ...item, _sortMinutes: timeToMinutes(timeStr) };
      
    }).sort((a, b) => a._sortMinutes - b._sortMinutes); // 4. Sort lowest to highest
  };

  // Assign the sorted array so the rest of your JSX renders it flawlessly
  const displayItems = getSortedDisplayItems();

  const handleBack = async () => router.push('/dashboard/itinerary/routing');
  
  // 👇 HIGHLIGHT: Simply Move to Review Page
  const handleNext = async () => {
      completeStep('createDay'); 
      router.push('/dashboard/itinerary/review');
  };

  return (
    <div>
      {/* INFO BANNER (If Admin Requested Changes) - Just for info, not locking */}
      {itineraryData.status === 'reedit_requested' && itineraryData.adminComment && (
        <div className="mx-4 mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-blue-600 mt-0.5" size={20} />
            <div>
              <p className="font-bold text-blue-800 text-sm">Note from Admin</p>
              <p className="text-blue-700 text-sm mt-1">"{itineraryData.adminComment}"</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-full min-h-[calc(100vh-180px)] gap-4 p-4">
        
        {/* --- LEFT: MAIN CONTENT AREA --- */}
        <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          
          {viewMode === 'list' ? (
            <div className="flex flex-col h-full">
              
              {/* Toolbar Header */}
              <div className="bg-white/10 border-b border-white/10 p-6 flex justify-between items-end">
                 <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{currentDay.city}</h1>
                    {/* 🌟 FIX: Beautiful Header Date Formatting */}
                    <p className="text-gray-300 flex items-center gap-2">
                        <Calendar size={16}/> 
                        {currentDay.date ? (
                            <span>Day Sequence: <span className="text-blue-300 font-bold">Day {currentDay.dayNumber}</span> <span className="text-gray-500 mx-1">|</span> <span className="text-blue-100 font-bold tracking-wide">{formatHeaderDate(currentDay.date)}</span></span>
                        ) : (
                            <span>Day Sequence: <span className="text-blue-300 font-bold">Day {currentDay.dayNumber}</span></span>
                        )}
                    </p>
                 </div>



                 {/* CENTER: Guiding Instruction (Vibrant Pointer) */}
                 <div className="hidden xl:flex flex-col items-center justify-center">
                     <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 rounded-full flex items-center gap-3 shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/50">
                        <PlusSquare size={16} className="text-white" />
                        <span className="text-sm text-white font-bold tracking-wide">Build your itinerary</span>
                        <ArrowRight size={16} className="text-white animate-pulse" />
                     </div>
                 </div>

                 {/* ADD BUTTONS (ALWAYS VISIBLE) */}
                 <div className="flex gap-4">
                        <NavIcon icon={<Camera size={24}/>} label="Activity" onClick={() => openAdd('add_activity')} color="bg-blue-500" />
                        <NavIcon icon={<Hotel size={24}/>} label="Stay" onClick={() => openAdd('add_stay')} color="bg-purple-600" />
                        <NavIcon icon={<Bus size={24}/>} label="Transport" onClick={() => openAdd('add_transport')} color="bg-green-500" />
                        <NavIcon icon={<Utensils size={24}/>} label="Meal" onClick={() => openAdd('add_meal')} color="bg-orange-500" />
                 </div>
              </div>

              {/* Main List Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
                {/* 🌟 FIX: Professional Empty State CTA (Luminous Canvas) */}
                {displayItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 px-6 mt-4 bg-[#0f172a]/50 border-2 border-dashed border-blue-400/40 rounded-2xl backdrop-blur-md text-center shadow-[inset_0_0_50px_rgba(37,99,235,0.05)] relative overflow-hidden">
                     
                     {/* Decorative background glow */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                     <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mb-6 shadow-[0_0_25px_rgba(37,99,235,0.6)] relative z-10">
                         {/* Inner pulse ring */}
                         <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-50"></div>
                         <Calendar size={36} strokeWidth={2.5} />
                     </div>
                     
                     <h3 className="text-2xl font-black text-white mb-3 tracking-tight relative z-10">
                         Plan your itinerary for Day {currentDay.dayNumber}
                     </h3>
                     
                     <p className="text-blue-100 text-sm max-w-md leading-relaxed font-medium relative z-10 opacity-90">
                        Build out your timeline by adding stay, activities, transport and meals above.
                     </p>
                  </div>
                )}

                {displayItems.map((item: any) => {
                  const supplierName = getSupplierName(item.linkedSupplierId);

                  return (
                  <div key={`${item.type}-${item.id}`} className="relative group">
                    
                    {/* ACTIVITY CARD */}
                    {item.type === 'activity' && (
                      <div className={`bg-white rounded-xl p-5 shadow-lg border-l-4 ${item.inclusionType === 'excluded' ? 'border-red-500 opacity-90' : 'border-blue-500'} flex gap-5`}>
                         <div className={`w-24 rounded-lg flex-shrink-0 flex flex-col items-center justify-center border ${item.inclusionType === 'excluded' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                             <Camera size={32} />
                         </div>
                         <div className="flex-1">
                            <div className="flex justify-between items-start">
                               <div>
                                 <div className="flex items-center gap-3">
                                     <h4 className="font-bold text-xl text-gray-800 flex items-center gap-2">{item.heading}</h4>
                                     <StatusBadge status={item.inclusionType} />
                                 </div>
                                 {supplierName && <div className="mt-1 inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[10px] border border-blue-100"><Briefcase size={10} /><span className="font-bold">By: {supplierName}</span></div>}
                                 <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                                    <div className="text-[10px] font-bold uppercase tracking-wider mt-3 mb-1 opacity-70 flex gap-4">
                                      <span>Slot: {item.slot || 'Activity'}</span>
                                      {item.startTime && <span>Start: {item.startTime}</span>}
                                      <span>Duration: {item.duration || 'N/A'}</span> 
                                   </div>
                               </div>

                               {/* EDIT/DELETE ALWAYS VISIBLE */}
                               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(item, 'add_activity')} className="text-green-600 hover:bg-green-50 p-1.5 rounded-md"><Edit size={16}/></button>
                                    <button onClick={() => handleDeleteItem('activity', item.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"><Trash2 size={16}/></button>
                               </div>
                            </div>
                            
                     


                            <div className="mt-4 grid grid-cols-12 gap-3">
                               {/* Combined Pickup & Drop-off Block */}
                               <div className="col-span-8 bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between gap-4">
                                  <div className="flex-1 overflow-hidden">
                                     <div className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1 mb-1"><MapPin size={10} /> Pickup</div>
                                     <div className="text-xs font-bold text-gray-700 truncate" title={item.pickupLocation}>{item.pickupLocation || 'Not Set'}</div>
                                     <div className="text-[10px] font-bold text-blue-600 mt-1">{item.pickupTime || '--:--'}</div>
                                  </div>
                                  
                                  <div className="w-px bg-gray-200"></div> {/* Vertical Divider */}
                                  
                                  <div className="flex-1 overflow-hidden">
                                     <div className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1 mb-1"><MapPin size={10} /> Drop-off</div>
                                     <div className="text-xs font-bold text-gray-700 truncate" title={item.dropoffLocation}>{item.dropoffLocation || 'Not Set'}</div>
                                     <div className="text-[10px] font-bold text-blue-600 mt-1">{item.dropoffTime || '--:--'}</div>
                                  </div>
                               </div>
                             
                               {/* Guide Option Block */}
                               <div className="col-span-4 bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col justify-center">
                                  <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1"><User size={10} /> Guide Option</div>
                                  <div className="text-xs font-bold text-gray-700 capitalize mt-1">{item.guideType === 'guided' ? 'Guided Tour' : 'Self Guided'}</div>
                               </div>
                            </div>



                         </div>
                      </div>
                    )}

                    {/* STAY CARD */}
                    {item.type === 'stay' && (
                      <div className={`rounded-xl p-6 shadow-lg border-l-4 flex gap-5 group relative ${item.isContinued ? 'bg-gray-50 border-gray-400 opacity-90' : item.inclusionType === 'excluded' ? 'bg-white border-red-500' : 'bg-white border-purple-500'}`}>
                          <div className="w-24 h-32 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden group-hover:shadow-md transition-all flex flex-col items-center justify-center">
                               <Hotel size={32} className={item.inclusionType === 'excluded' ? 'text-red-500' : 'text-purple-600'} />
                              <div className={`absolute top-0 left-0 text-white text-[10px] font-bold px-1 py-1 rounded-br-lg z-10 ${item.isContinued ? 'bg-gray-500' : (item.inclusionType === 'excluded' ? 'bg-red-500' : 'bg-purple-600')}`}>{item.isContinued ? 'CONTINUED' : 'STAY'}</div>
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                              <div className="flex justify-between items-start">
                                  <div>
                                      <h4 className="font-bold text-xl text-gray-800 leading-tight">{item.hotelName}</h4>
                                      {!item.isContinued && supplierName && <div className="mt-1 inline-flex items-center gap-1 bg-purple-50 text-purple-800 px-2 py-0.5 rounded text-[10px] border border-purple-100"><Briefcase size={10} /><span className="font-bold">By: {supplierName}</span></div>}
                                      <div className="flex gap-2 mt-1.5 items-center">
                                          {!item.isContinued && <StatusBadge status={item.inclusionType} />}
                                          <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-gray-900 px-2 py-0.5 rounded border border-purple-100">{item.category} • {item.stayType}</span>
                                          <span className='text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-gray-900 px-2 py-0.5 rounded border border-orange-100 flex items-center gap-1'><Star size={10} className="fill-yellow-500 text-yellow-500" /> {item.rating}</span>
                                      </div>
                                  </div>
                                  {!item.isContinued && (
                                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(item, 'add_stay')} className="text-green-600 hover:bg-green-50 p-1.5 rounded-md"><Edit size={16}/></button>
                                        <button onClick={() => handleDeleteItem('stay', item.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"><Trash2 size={16}/></button>
                                    </div>
                                  )}
                              </div>
                              <div className="grid grid-cols-12 gap-3 mt-4">
                                  <div className="col-span-4 bg-white border border-gray-200 rounded p-2">
                                      <div className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Room</div>
                                      <div className="text-xs font-bold text-gray-700 truncate" title={item.roomCategory}>{item.numRooms} x {item.roomCategory}</div>
                                  </div>
                                  <div className="col-span-4 bg-white border border-gray-200 rounded p-2">
                                      <div className="text-[10px] text-gray-500 uppercase font-bold mb-0.5 flex items-center gap-1">Duration</div>
                                      <div className="text-xs font-bold text-gray-700 flex items-center gap-1"><Moon size={12} className="text-purple-400" /> {item.nights} Nights</div>
                                  </div>
                                  <div className="col-span-4 bg-white border border-gray-200 rounded p-2">
                                      <div className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Schedule</div>
                                      <div className="text-xs font-bold text-gray-700 flex justify-between"><span>In: {item.checkInTime}</span><span className="text-gray-300">|</span><span>Out: {item.checkOutTime}</span></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                    )}

            
                    {/* TRANSPORT CARD */}
                    {item.type === 'transport' && (
                        <div className={`bg-white rounded-xl p-5 shadow-lg border-l-4 ${item.inclusionType === 'excluded' ? 'border-red-500' : 'border-green-500'} flex gap-5 group`}>
                            <div className={`w-24 rounded-lg flex-shrink-0 flex flex-col items-center justify-center border ${item.inclusionType === 'excluded' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                {item.mode === 'flight' ? <Plane size={24}/> : item.mode === 'rail' ? <Train size={24}/> : item.mode === 'ferry' ? <Ship size={24}/> : <Car size={24}/>}
                                <span className="text-[10px] font-bold uppercase mt-1 tracking-wider">{item.mode}</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                
                                {/* Header Details */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            {/* 🌟 DYNAMIC TITLE: Attach Flight/Train Number */}
                                            <h4 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                                {item.vehicleType || 'Transport'}
                                                {item.mode !== 'vehicle' && item.flightNumber && (
                                                    <span className="text-gray-400 font-medium text-base"> • <span className="text-blue-600">{item.flightNumber}</span></span>
                                                )}
                                            </h4>
                                            <StatusBadge status={item.inclusionType} />
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mt-1">
                                            {supplierName && <div className="inline-flex items-center gap-1 bg-green-50 text-green-800 px-2 py-0.5 rounded text-[10px] border border-green-100"><Briefcase size={10} /><span className="font-bold">By: {supplierName}</span></div>}
                                            {['flight', 'rail', 'ferry'].includes(item.mode) ? (
                                                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-bold uppercase">Transit Ticket</span>
                                            ) : (
                                                <span className="text-[10px] bg-gray-100 text-gray-600 px-3 py-0.5 rounded-full border border-gray-200 font-bold uppercase">{item.subType}</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(item, 'add_transport')} className="text-green-600 hover:bg-green-50 p-1.5 rounded-md"><Edit size={16}/></button>
                                            <button onClick={() => handleDeleteItem('transport', item.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"><Trash2 size={16}/></button>
                                    </div>
                                </div>

                                {/* Dynamic Logistics Block */}
                                <div className="mt-4">
                                    {item.mode === 'flight' ? (
                               
                                        // ============================================
                                        // 🌟 PREMIUM FLIGHT UI (Layover Dots & +1 Day) - COMPACT
                                        // ============================================
                                        <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                                            
                                            <div className="flex items-center justify-between w-full">
                                                
                                                {/* Left: Departure */}
                                                <div className="flex flex-col w-1/3">
                                                    <div className="text-sm font-black text-gray-900 tracking-tight">{item.pickupTime || '--:--'}</div>
                                                    <div className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">{item.pickupLocation || 'Not Set'}</div>
                                                </div>

                                                {/* Middle: Flight Path & Layovers */}
                                                <div className="flex flex-col items-center flex-1 px-4">
                                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                        <Clock size={10} /> {item.duration || 'Duration --'}
                                                    </div>
                                                    
                                                    <div className="w-full flex items-center relative py-1">
                                                        {/* The horizontal line */}
                                                        <div className="h-[2px] bg-gray-300 w-full absolute top-1/2 left-0 transform -translate-y-1/2 rounded-full"></div>
                                                        
                                                        {/* The Layover Dot or Plane Icon */}
                                                        {item.flightStops && item.flightStops !== 'Direct' ? (
                                                            <div className="mx-auto w-2.5 h-2.5 bg-blue-600 rounded-full ring-[2px] ring-slate-50 relative z-10 shadow-sm"></div>
                                                        ) : (
                                                            <Plane size={14} className="mx-auto text-blue-500 relative z-10 bg-slate-50 px-1 w-6 h-auto" />
                                                        )}
                                                    </div>
                                                    
                                                    <div className="text-[10px] font-bold mt-1 text-center">
                                                        {item.flightStops && item.flightStops !== 'Direct' ? (
                                                            <span className="text-blue-600">
                                                                {item.flightStops} 
                                                                {item.layoverInfo && <span className="text-gray-500 ml-1">• {item.layoverInfo}</span>}
                                                            </span>
                                                        ) : (
                                                            <span className="text-green-600 tracking-wide">Direct Flight</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right: Arrival */}
                                                <div className="flex flex-col w-1/3 text-right">
                                                    <div className="text-sm font-black text-gray-900 tracking-tight flex items-start justify-end">
                                                        {item.dropoffTime || '--:--'}
                                                        {item.arrivalDayOffset === '+1' && (
                                                            <sup className="text-[10px] font-black text-red-500 ml-0.5 mt-1">+1</sup>
                                                        )}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">{item.dropoffLocation || 'Not Set'}</div>
                                                </div>
                                            </div>
                                            
                                            {/* Footer Info */}
                                            {item.serviceDescription && (
                                                <div className="mt-3 pt-2.5 border-t border-gray-200 flex justify-start items-center">
                                                    <div className="text-[10px] font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">
                                                        Cabin: <span className="text-gray-500">{item.serviceDescription}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                
                                    ) : ['rail', 'ferry'].includes(item.mode) ? (
                                        // ============================================
                                        // TICKET MODE UI (Rail, Ferry)
                                        // ============================================
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            {/* Times */}
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1"><Clock size={10}/> Schedule</div>
                                                <div className="text-xs font-bold text-gray-800">
                                                    {item.pickupTime || '--:--'} <span className="text-gray-500 font-normal mx-1">to</span> {item.dropoffTime || '--:--'}
                                                    {item.arrivalDayOffset === '+1' && <sup className="text-[9px] font-bold text-red-500 ml-0.5">+1</sup>}
                                                </div>
                                            </div>
                                            
                                            {/* Route */}
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
                                                    <MapPin size={10}/> {item.mode === 'ferry' ? 'Ports' : 'Route'}
                                                </div>
                                                <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                                    <span className="truncate max-w-[100px]" title={item.pickupLocation}>{item.pickupLocation || 'Not Set'}</span> 
                                                    <ArrowRight size={12} className="text-gray-600 flex-shrink-0"/> 
                                                    <span className="truncate max-w-[100px]" title={item.dropoffLocation}>{item.dropoffLocation || 'Not Set'}</span>
                                                </div>
                                            </div>

                                            {/* Duration */}
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Duration</div>
                                                <div className="text-xs font-bold text-green-700 bg-green-100/50 inline-block px-1.5 py-0.5 rounded">{item.duration || '--'}</div>
                                            </div>

                                            {/* Travel Info / Ref */}
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                                                    {item.mode === 'ferry' ? 'Deck Info' : 'Travel Info'}
                                                </div>
                                                <div className="text-[11px] font-semibold text-gray-600 truncate flex flex-col gap-0.5" title={item.serviceDescription}>
                                                    <span>{item.serviceDescription || 'No details added'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // ============================================
                                        // VEHICLE MODE UI (Car Transfer / Disposal)
                                        // ============================================
                              <div className={`grid grid-cols-1 ${item.subType === 'transfer' ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100`}>
                                            
                                            {/* Col 1: Pickup Block */}
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Pickup
                                                </div>
                                                <div className="text-xs font-bold text-gray-800 truncate" title={item.pickupLocation}>{item.pickupLocation || 'Not Set'}</div>
                                                <div className="text-[10px] font-bold text-blue-600 mt-1">{item.pickupTime || '--:--'}</div>
                                            </div>

                                            {/* Col 2: Drop-off (ONLY shows if it is a Transfer) */}
                                            {item.subType === 'transfer' && (
                                                <div>
                                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div> Drop-off
                                                    </div>
                                                    <div className="text-xs font-bold text-gray-800 truncate" title={item.dropoffLocation}>{item.dropoffLocation || 'Not Set'}</div>
                                                    <div className="text-[10px] font-bold text-blue-600 mt-1">{item.dropoffTime || '--:--'}</div>
                                                </div>
                                            )}

                                            {/* Col 3: Duration (ALWAYS visible now) */}
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
                                                    <Clock size={10} className="text-gray-400" /> Duration
                                                </div>
                                                <div className="text-xs font-bold text-green-700 bg-green-100/50 px-1.5 py-0.5 rounded inline-block">
                                                    {item.duration || '--'}
                                                </div>
                                            </div>

                                            {/* Col 4: Journey Description / Ref */}
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Journey Info</div>
                                                <div className="text-[11px] font-semibold text-gray-600 flex flex-col gap-0.5">
                                                    <span className="line-clamp-2" title={item.serviceDescription}>{item.serviceDescription || 'No details added'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}
                    


                    {/* MEAL CARD */}
                    {item.type === 'meal' && (
                      <div className={`bg-white rounded-xl p-5 shadow-lg border-l-4 ${item.inclusionType === 'excluded' ? 'border-red-500' : 'border-orange-500'} flex gap-5 group`}>
                          <div className={`w-24 rounded-lg flex-shrink-0 flex flex-col items-center justify-center border ${item.inclusionType === 'excluded' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                               <Utensils size={24} />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                              <div className="flex justify-between items-start">
                                  <div>
                                      <div className="flex items-center gap-3">
                                          <h4 className="font-bold text-xl text-gray-800">{item.restaurantName}</h4>
                                          <StatusBadge status={item.inclusionType} />
                                      </div>
                                      {supplierName && <div className="mt-1 inline-flex items-center gap-1 bg-orange-50 text-orange-800 px-2 py-0.5 rounded text-[10px] border border-orange-100"><Briefcase size={10} /><span className="font-bold">By: {supplierName}</span></div>}
                                      <div className="flex gap-2 mt-1">
                                          <span className="text-[12px] font-bold bg-gray-100 mt-2 text-gray-800 px-2 py-0.5 rounded border border-gray-200">{item.mealType}</span>
                                          <span className="text-[12px] font-bold text-yellow-700 mt-2 ml-5 px-2 py-0.5 rounded flex items-center gap-1">Rating:<Star size={8} className="fill-current"/> {item.rating}</span>
                                      </div>
                                  </div>
                                  
                                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => openEdit(item, 'add_meal')} className="text-orange-600 hover:bg-orange-50 p-1.5 rounded-md"><Edit size={16}/></button>
                                      <button onClick={() => handleDeleteItem('meal', item.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"><Trash2 size={16}/></button>
                                  </div>
                              </div>
                              <div className="mt-4 grid grid-cols-12 gap-3">
                                  <div className="col-span-8 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                      <div className="text-[11px] text-gray-600 uppercase font-bold mb-0.5">Location</div>
                                      <div className="text-xs font-bold text-gray-800 mt-1 truncate" title={item.address}>{item.address}</div>
                                  </div>
                                  <div className="col-span-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                      <div className="text-[11px] text-gray-600 uppercase font-bold mb-0.5">Payment</div>
                                      <div className={`text-xs font-bold capitalize ${item.inclusionType === 'included' ? 'text-green-600' : 'text-gray-600'}`}>{item.inclusionType === 'included' ? 'Pre-Paid' : 'Direct Pay'}</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                    )}

                  </div>
                  )
                })}
              </div>

            </div>
          ) : (
            // --- SUB FORMS RENDER ---
            <div className="h-full p-6">
                {viewMode === 'add_activity' && <ActivityForm initialData={editingItem} existingActivities={currentDay.activities} city={currentDay.city} dayDate={currentDay.date} onSave={(d) => handleSaveItem('activity', d)} onCancel={() => setViewMode('list')} />}
                {viewMode === 'add_stay' && <StayForm initialData={editingItem} city={currentDay.city} dayDate={currentDay.date} onSave={(d) => handleSaveItem('stay', d)} onCancel={() => setViewMode('list')} />}
                {viewMode === 'add_transport' && <TransportForm initialData={editingItem} city={currentDay.city} dayDate={currentDay.date} onSave={(d) => handleSaveItem('transport', d)} onCancel={() => setViewMode('list')} />}
                {viewMode === 'add_meal' && <MealForm initialData={editingItem} city={currentDay.city} dayDate={currentDay.date} onSave={(d) => handleSaveItem('meal', d)} onCancel={() => setViewMode('list')} />}
            </div>
          )}
        </div>

  

        {/* --- RIGHT: DAY SELECTOR (Draggable) --- */}
        <div className="w-64 bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-3 overflow-y-auto">
          <h2 className="text-gray-100 font-bold text-lg mb-4 border-b border-white/10 pb-2 uppercase">Day Journey</h2>
          <div className="space-y-2">
            {dayPlans.map((day, idx) => (
              <div 
                key={`day-${day.dayNumber}-${idx}`}
                draggable 
                onDragStart={() => setDraggedIndex(idx)}
                onDragOver={(e) => e.preventDefault()} 
                onDrop={(e) => { e.preventDefault(); handleDrop(idx); }}
                onDragEnd={() => setDraggedIndex(null)}
                className={`w-full flex items-stretch p-1 rounded-xl transition-all border ${
                  idx === selectedDayIndex 
                    ? 'bg-blue-500 border-blue-400 text-white shadow-lg' 
                    : 'bg-white border-transparent text-gray-900 hover:bg-white/90'
                } ${draggedIndex === idx ? 'opacity-50 border-dashed border-2' : ''}`}
              >
                  {/* 👇 The Drag Handle (Grip Icon) */}
                  <div className={`flex items-center justify-center px-1 cursor-grab active:cursor-grabbing ${idx === selectedDayIndex ? 'text-blue-200' : 'text-gray-400 hover:text-gray-600'}`}>
                      <GripVertical size={16} />
                  </div>
                  
                  {/* The Clickable Button Area */}
                  <button 
                      onClick={() => { setSelectedDayIndex(idx); setViewMode('list'); }} 
                      className="flex-1 text-left p-1 pl-1"
                  >
                      <div className={`text-[10px] font-bold uppercase ${idx === selectedDayIndex ? 'text-blue-100' : 'text-gray-500'}`}>
                          Day {day.dayNumber}
                      </div>
                      <div className="font-bold truncate text-sm">{day.city}</div>
                      {!isMasterMode && <div className={`text-[10px] mt-0.5 ${idx === selectedDayIndex ? 'text-blue-200' : 'text-gray-500'}`}>{formatDatePretty(day.date)}</div>}
                      
                      <div className="flex gap-1 mt-1 justify-end pr-2">
                          {day.stays.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-purple-400"/>}
                          {day.activities.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-blue-300"/>}
                          {day.transports.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-green-400"/>}
                      </div>
                  </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* <div className="flex justify-between items-center mr-5 mb-5 ">
         <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white px-6 py-3 rounded-lg font-medium hover:bg-white/5"><ArrowLeft size={18} /> Back</button>

         <div className="flex gap-3">
             <button 
                onClick={handleNext} 
                className="group flex items-center gap-2 px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform hover:scale-[1.02] bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20"
             >
                Next Step: Review Itinerary <ArrowRight size={18} />
             </button>
         </div>
      </div> */}


            {/* 3. NAVIGATION BUTTONS */}
            <div className="flex justify-between items-center mt-6 mb-5 px-3 relative">
              
              {/* 🌟 1. HIDDEN SVG FILTER FOR THE GOOEY EFFECT */}
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="hidden absolute">
                <defs>
                  <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                    <feBlend in="SourceGraphic" in2="goo" />
                  </filter>
                </defs>
              </svg>
      
              {/* 🌟 2. ANIMATED BACK BUTTON (Gooey Glass Effect) */}
              <button 
                onClick={() => router.back()} 
                className="group relative z-10 inline-flex items-center px-6 py-2 text-gray-400 font-medium uppercase tracking-wide bg-white/5 backdrop-blur-sm border border-gray-600 rounded-lg overflow-hidden transition-colors duration-700 ease-in-out hover:text-white hover:border-gray-400 shadow-sm"
              >
                {/* Button Content (Placed above the blobs) */}
                <span className="relative z-20 flex items-center gap-2">
                  <ArrowLeft size={18} /> Back
                </span>
      
                {/* Gooey Blobs Container */}
                <div 
                  className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-lg"
                  style={{ filter: 'url(#goo)' }}
                >
                  {/* Blob 1 */}
                  <div className="absolute top-0 -left-[5%] w-[34%] h-full bg-gray-600 rounded-full scale-[1.4] translate-y-[125%] transition-transform duration-700 ease-in-out group-hover:translate-y-0" />
                  {/* Blob 2 (Delayed) */}
                  <div className="absolute top-0 left-[30%] w-[34%] h-full bg-gray-600 rounded-full scale-[1.4] translate-y-[125%] transition-transform duration-700 ease-in-out delay-[60ms] group-hover:translate-y-0" />
                  {/* Blob 3 (Most Delayed) */}
                  <div className="absolute top-0 left-[66%] w-[34%] h-full bg-gray-600 rounded-full scale-[1.4] translate-y-[125%] transition-transform duration-700 ease-in-out delay-[25ms] group-hover:translate-y-0" />
                </div>
              </button>
      
      
              {/* 🌟 3. ANIMATED NEXT BUTTON (Shine Effect) */}
              <style>{`
                @keyframes shine {
                  0% { left: -100px; }
                  60% { left: 100%; }
                  100% { left: 100%; }
                }
                .group:hover .shine-effect {
                  animation: shine 1.5s ease-out infinite;
                }
              `}</style>
      
              <button 
                onClick={handleNext} 
                className="group relative overflow-hidden flex items-center justify-center gap-2.5 px-8 py-2 bg-blue-600 text-white font-bold text-[15px] rounded-full border-[3px] border-white/30 shadow-[0_10px_20px_rgba(0,0,0,0.2)] outline-none cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:border-white/60"
              >
                {/* The Shine Effect Element */}
                <div className="shine-effect absolute top-0 -left-[100px] w-[100px] h-full opacity-60 pointer-events-none bg-gradient-to-r from-transparent via-white/80 to-transparent z-0" />
                
                <span className="relative z-10">Next Step: Create Day</span>
                
                <ArrowRight 
                  size={20} 
                  className="relative z-10 transition-transform duration-300 ease-in-out group-hover:translate-x-1" 
                />
              </button>
      
            </div>
    </div>
  );
}

function NavIcon({icon, label, color, onClick}: {icon: any, label: string, color: string, onClick: () => void}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group">
       <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>{icon}</div>
       <span className="text-[10px] font-bold text-gray-300 group-hover:text-white uppercase tracking-wider">{label}</span>
    </button>
  )
}