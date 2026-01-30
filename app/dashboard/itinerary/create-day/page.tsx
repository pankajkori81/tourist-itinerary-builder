
// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Camera, Hotel, Bus, Utensils, 
//   Calendar, MapPin, Trash2, Edit, User, Clock, DollarSign, IndianRupee,
//   Info, CheckCircle , Star , Moon , Car, Plane, Train, Ship, ArrowRight , ArrowLeft,
//   Ban, CheckCircle2, PlusSquare // Imported icons for status
// } from 'lucide-react';
// import { useItinerary } from '@/app/context/ItineraryContext';
// import { DayPlan } from './constants/daywiseConstants';

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

// // --- NEW HELPER: STATUS BADGE ---
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
//   // Default to Included
//   return (
//     <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 font-bold uppercase tracking-wider">
//       <CheckCircle2 size={10} /> Included
//     </span>
//   );
// };

// export default function DaywisePage() {
//   const router = useRouter();
//   const { itineraryData, updateItineraryData } = useItinerary();
  
//   const [selectedDayIndex, setSelectedDayIndex] = useState(0);
//   const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
//   const [viewMode, setViewMode] = useState<ViewMode>('list');
//   const [editingItem, setEditingItem] = useState<any | null>(null);

//   // --- CRITICAL LOGIC: Expand Routes into Days based on Nights ---
//   useEffect(() => {
//     if (itineraryData.routingData?.routes) {
//       const routes = itineraryData.routingData.routes;
//       const savedPlans = (itineraryData.dayWiseActivities as DayPlan[]) || [];
//       const startDateStr = itineraryData.routingData.startDate; 

//       const generatedDayPlans: DayPlan[] = [];
//       let globalDayCounter = 1;
      
//       let runningDate = startDateStr ? new Date(startDateStr) : new Date();

//       // 1. LOOP THROUGH ROUTES
//       routes.forEach((route) => {
//         const nightsCount = parseInt(route.nights?.toString() || '0') || 0;
//         const loopCount = nightsCount === 0 ? 1 : nightsCount; 

//         for (let i = 0; i < loopCount; i++) {
//           const existingPlan = savedPlans.find(p => p.dayNumber === globalDayCounter);
//           const dateString = startDateStr ? runningDate.toISOString().split('T')[0] : ''; 

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
//           if (startDateStr) {
//              runningDate.setDate(runningDate.getDate() + 1);
//           }
//         }
//       });

//       // 2. CHECKOUT DAY
//       if (routes.length > 0) {
//           const lastRoute = routes[routes.length - 1];
//           const existingPlan = savedPlans.find(p => p.dayNumber === globalDayCounter);
//           const dateString = startDateStr ? runningDate.toISOString().split('T')[0] : '';

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
//   }, [itineraryData.routingData]);

//   const currentDay = dayPlans[selectedDayIndex];

//   // --- HANDLERS ---
//   const handleSaveItem = (type: 'activity' | 'stay' | 'transport' | 'meal', data: any) => {
//     if (!currentDay) return;
    
//     const updatedPlans = [...dayPlans];
//     const plan = updatedPlans[selectedDayIndex];

//     if (type === 'activity') {
//       const idx = plan.activities.findIndex(a => a.id === data.id);
//       if (idx >= 0) plan.activities[idx] = data; else plan.activities.push(data);
//     } else if (type === 'stay') {
//       const idx = plan.stays.findIndex(s => s.id === data.id);
//       if (idx >= 0) plan.stays[idx] = data; else plan.stays.push(data);
//     } else if (type === 'transport') {
//       const idx = plan.transports.findIndex(t => t.id === data.id);
//       if (idx >= 0) plan.transports[idx] = data; else plan.transports.push(data);
//     }else if(type === 'meal'){
//       const idx = plan.meals.findIndex(m => m.id === data.id);
//       if (idx >= 0) plan.meals[idx] = data; else plan.meals.push(data);
//     }

//     setDayPlans(updatedPlans);
//     updateItineraryData({ dayWiseActivities: updatedPlans });
//     setViewMode('list');
//     setEditingItem(null);
//   };

//   const handleDeleteItem = (type: 'activity' | 'stay' | 'transport' | 'meal', id: number) => {
//     if (!confirm('Delete this item?')) return;
//     const updatedPlans = [...dayPlans];
//     const plan = updatedPlans[selectedDayIndex];
    
//     if (type === 'activity') plan.activities = plan.activities.filter(a => a.id !== id);
//     else if (type === 'stay') plan.stays = plan.stays.filter(s => s.id !== id);
//     else if (type === 'transport') plan.transports = plan.transports.filter(t => t.id !== id);
//     else if (type === 'meal') plan.meals = plan.meals.filter(m => m.id !== id);
    
//     setDayPlans(updatedPlans);
//     updateItineraryData({ dayWiseActivities: updatedPlans });
//   };

//   const openAdd = (mode: ViewMode) => { setEditingItem(null); setViewMode(mode); };
//   const openEdit = (item: any, mode: ViewMode) => { setEditingItem(item); setViewMode(mode); };

//   const calculateTotalActivityCost = (item: any) => {
//     if (item.inclusionType === 'excluded') return 0;
//     const entrance = item.entranceFeePP || 0;
//     const activity = item.activityFeePP || 0;
//     const guide = (item.guideType === 'guided' ? item.guideFee : 0) || 0;
//     return entrance + activity + guide;
//   };

//   if (!currentDay) return <div className="p-8 text-white">Loading Days... Please set up Routing first.</div>;

//   // --- GHOST STAYS ---
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
//   const handleNext = async () => router.push('/dashboard/itinerary/costing');

//   return (
//     <div>
//       <div className="flex h-full min-h-[calc(100vh-140px)] gap-4 p-4">
        
//         {/* --- LEFT: MAIN CONTENT AREA --- */}
//         <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          
//           {viewMode === 'list' ? (
//             <div className="flex flex-col h-full">
              
//               {/* Toolbar Header */}
//               <div className="bg-white/10 border-b border-white/10 p-6 flex justify-between items-end">
//                  <div>
//                     <h1 className="text-3xl font-bold text-white mb-1">{currentDay.city}</h1>
//                     <p className="text-gray-300 flex items-center gap-2">
//                         <Calendar size={16}/> {formatDatePretty(currentDay.date)} | <span className="text-blue-300 font-bold">Day {currentDay.dayNumber}</span>
//                     </p>
//                  </div>
//                  <div className="flex gap-4">
//                     <NavIcon icon={<Camera size={24}/>} label="Activity" onClick={() => openAdd('add_activity')} color="bg-blue-500" />
//                     <NavIcon icon={<Hotel size={24}/>} label="Stay" onClick={() => openAdd('add_stay')} color="bg-purple-600" />
//                     <NavIcon icon={<Bus size={24}/>} label="Transport" onClick={() => openAdd('add_transport')} color="bg-green-500" />
//                     <NavIcon icon={<Utensils size={24}/>} label="Meal" onClick={() => openAdd('add_meal')} color="bg-orange-500" />
//                  </div>
//               </div>

//               {/* Main List Area */}
//               <div className="flex-1 overflow-y-auto p-6 space-y-6">
//                 {displayItems.length === 0 && (
//                   <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-500/30 rounded-xl text-gray-400">
//                      <p>No plans yet for Day {currentDay.dayNumber}.</p>
//                   </div>
//                 )}

//                 {displayItems.map((item: any) => (
//                   <div key={`${item.type}-${item.id}`} className="relative group">
                    
//                     {/* --- ACTIVITY CARD --- */}
//                     {item.type === 'activity' && (
//                       <div className={`bg-white rounded-xl p-5 shadow-lg border-l-4 ${item.inclusionType === 'excluded' ? 'border-red-500 opacity-90' : 'border-blue-500'} flex gap-5`}>
                         
//                          <div className={`w-24 rounded-lg flex-shrink-0 flex flex-col items-center justify-center border ${item.inclusionType === 'excluded' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
//                              <Camera size={32} />
//                          </div>

//                          <div className="flex-1">
//                             <div className="flex justify-between items-start">
//                                <div>
//                                  <div className="flex items-center gap-3">
//                                      <h4 className="font-bold text-xl text-gray-800 flex items-center gap-2">
//                                        {item.heading}
//                                      </h4>
//                                      {/* NEW: Status Badge */}
//                                      <StatusBadge status={item.inclusionType} />
//                                  </div>
//                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>

//                                     <div className="text-[10px] font-bold uppercase tracking-wider mt-3 mb-1 opacity-70 flex gap-4">
//                                       <span>Slot: {item.slot || 'Activity'}</span>
//                                       {item.startTime && <span>Start: {item.startTime}</span>}
//                                       <span>Duration: {item.duration || 'N/A'}</span> 
//                                    </div>
//                                </div>

//                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                   <button onClick={() => openEdit(item, 'add_activity')} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md"><Edit size={16}/></button>
//                                   <button onClick={() => handleDeleteItem('activity', item.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"><Trash2 size={16}/></button>
//                                </div>
//                             </div>
                            
//                             <div className="mt-4 grid grid-cols-3 gap-4">

//                                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
//                                   <div className="text-[10px] text-gray-500 uppercase font-bold  flex items-center gap-1">
//                                     <Clock size={10} /> Pickup
//                                   </div>
//                                   <div className="text-xs font-bold mt-1 text-gray-700">
//                                    Time: {item.pickupTime}
//                                   </div>
//                                   <div className="text-[12px] font-bold text-gray-700 truncate" title={item.pickupLocation}>
//                                    Location: {item.pickupLocation || 'Not Set'}
//                                   </div>
//                                </div>

//                                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
//                                   <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
//                                     <User size={10} /> Guide Option
//                                   </div>
//                                   <div className="text-sm font-bold text-gray-700 capitalize">
//                                     {item.guideType === 'guided' ? 'Guided Tour' : 'Self Guided'}
//                                   </div>
//                                </div>

//                                <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
//                                   <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
//                                    <DollarSign size={10} /> Per Person Fee
//                                   </div>
//                                   <div className={`text-sm font-bold ${item.inclusionType === 'excluded' ? 'text-red-500' : 'text-green-700'}`}>
//                                     {item.inclusionType === 'excluded' ? 'Excluded' : `$${calculateTotalActivityCost(item).toLocaleString()}`}
//                                   </div>
//                                </div>
                            
//                             </div>
//                          </div>
//                       </div>
//                     )}

              
//                      {/* STAY PAGE */}
//                     {item.type === 'stay' && (
//                       <div className={`rounded-xl p-8 shadow-lg border-l-4 flex gap-5 group relative ${
//                           item.isContinued 
//                             ? 'bg-gray-50 border-gray-400 opacity-90' // Dimmed style for Continued
//                             : item.inclusionType === 'excluded'
//                               ? 'bg-white border-red-500'
//                               : 'bg-white border-purple-500'            // Normal style for New
//                       }`}>
                          
//                           {/* Left: Image & Badge */}
//                           <div className="w-24 h-37 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden group-hover:shadow-md transition-all">
//                                <div className={`w-24 mt-15 rounded-lg flex-shrink-0 flex flex-col items-center justify-center border ${item.inclusionType === 'excluded' ? 'text-red-600 border-red-100' : 'text-purple-600 border-purple-100'}`}>
//                                <Hotel size={24} />
//                                 </div>
                              
//                               {/* BADGE LOGIC */}
//                               <div className={`absolute top-0 left-0 text-white text-[10px] font-bold px-1 py-1 rounded-br-lg z-10 ${
//                                   item.isContinued ? 'bg-gray-500' : (item.inclusionType === 'excluded' ? 'bg-red-500' : 'bg-purple-600')
//                               }`}>
//                                   {item.isContinued ? 'CONTINUED STAY' : 'STAY'}
//                               </div>
//                           </div>

//                           {/* Right: Content */}
//                           <div className="flex-1 flex flex-col justify-between">
                              
//                               {/* Header Row */}
//                               <div className="flex justify-between items-start">
//                                   <div>
//                                       <h4 className="font-bold text-xl text-gray-800 leading-tight">{item.hotelName}</h4>
//                                       <div className="flex gap-2 mt-1.5 items-center">
//                                           {/* NEW: Status Badge for Stay (Only show if not continued) */}
//                                           {!item.isContinued && <StatusBadge status={item.inclusionType} />}
                                          
//                                           <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-gray-900 px-2 py-0.5 rounded border border-purple-100">
//                                               {item.category} • {item.stayType}
//                                           </span>
//                                           <span className='text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-gray-900 px-2 py-0.5 rounded border border-orange-100 flex items-center gap-1'>
//                                           Rating: <Star size={10} className="fill-yellow-500 text-yellow-500" /> {item.rating}
//                                           </span>
//                                       </div>
//                                   </div>

//                                   {/* ACTION BUTTONS: Hide if isContinued is true */}
//                                   {!item.isContinued && (
//                                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                         <button onClick={() => openEdit(item, 'add_stay')} className="text-purple-600 hover:bg-purple-50 p-1.5 rounded-md transition-colors"><Edit size={16}/></button>
//                                         <button onClick={() => handleDeleteItem('stay', item.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors"><Trash2 size={16}/></button>
//                                     </div>
//                                   )}
//                               </div>

//                               {/* Info Grid */}
//                               <div className="grid grid-cols-12 gap-3 mt-5">
                                  
//                                   <div className="col-span-3 bg-white border border-gray-200 rounded p-2">
//                                       <div className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Room</div>
//                                       <div className="text-xs font-bold text-gray-700 truncate" title={item.roomCategory}>
//                                           {item.numRooms} x {item.roomCategory}
//                                       </div>
//                                   </div>

//                                   <div className="col-span-2 bg-white border border-gray-200 rounded p-2">
//                                       <div className="text-[10px] text-gray-500 uppercase font-bold mb-0.5 flex items-center gap-1">Duration</div>
//                                       <div className="text-xs font-bold text-gray-700 flex items-center gap-1">
//                                           <Moon size={12} className="text-purple-400" /> {item.nights} Nights
//                                       </div>
//                                   </div>

//                                   <div className="col-span-4 bg-white border border-gray-200 rounded p-2">
//                                       <div className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Schedule</div>
//                                       <div className="text-xs font-bold text-gray-700 flex justify-between">
//                                           <span>Check-In: {item.checkInTime}</span>
//                                           <span className="text-gray-300">|</span>
//                                           <span>Check-Out: {item.checkOutTime}</span>
//                                       </div>
//                                   </div>

//                                   {/* PRICE BOX LOGIC */}
//                                   <div className={`col-span-3 rounded p-2 border relative overflow-hidden ${
//                                       item.isContinued 
//                                         ? 'bg-gray-100 border-gray-200' 
//                                         : item.inclusionType === 'excluded' 
//                                             ? 'bg-red-50 border-red-100' 
//                                             : 'bg-green-50 border-green-100'
//                                   }`}>
//                                       <div className={`text-[10px] uppercase font-bold mb-0.5 ${
//                                           item.isContinued ? 'text-gray-500' : (item.inclusionType === 'excluded' ? 'text-red-600' : 'text-green-600')
//                                       }`}>
//                                           {item.isContinued ? 'Cost Status' : 'Total Cost'}
//                                       </div>
//                                       <div className={`text-sm font-bold ${
//                                           item.isContinued ? 'text-gray-600 italic' : (item.inclusionType === 'excluded' ? 'text-red-800' : 'text-green-800')
//                                       }`}>
//                                           {item.isContinued 
//                                               ? "Included in Check-in" 
//                                             : item.inclusionType === 'excluded' 
//                                                 ? 'Excluded'
//                                                 : `$${(item.costPerNight * item.numRooms * item.nights).toLocaleString()}`
//                                           }
//                                       </div>
//                                   </div>

//                               </div>
//                           </div>
//                       </div>
//                     )}





//                     {/* --- TRANSPORT CARD (UPDATED WITH DESCRIPTION) --- */}
// {item.type === 'transport' && (
//     <div className={`bg-white rounded-xl p-5 shadow-lg border-l-4 ${item.inclusionType === 'excluded' ? 'border-red-500' : 'border-green-500'} flex gap-5 group`}>
        
//         {/* Left: Dynamic Icon based on Mode */}
//         <div className={`w-24 rounded-lg flex-shrink-0 flex flex-col items-center justify-center border ${item.inclusionType === 'excluded' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
//             {item.mode === 'flight' ? <Plane size={24}/> : 
//              item.mode === 'rail' ? <Train size={24}/> : 
//              item.mode === 'ferry' ? <Ship size={24}/> : 
//              <Car size={24}/>}
//             <span className="text-[10px] font-bold uppercase mt-1 tracking-wider">{item.mode}</span>
//         </div>

//         {/* Right: Content */}
//         <div className="flex-1 flex flex-col justify-between">
            
//             {/* 1. Header Row */}
//             <div className="flex justify-between items-start">
//                 <div>
//                     <div className="flex items-center gap-3">
//                         <h4 className="font-bold text-xl text-gray-800 flex items-center gap-2">
//                             {item.vehicleType || 'Transport'}
//                         </h4>
//                         {/* Status Badge */}
//                         <StatusBadge status={item.inclusionType} />
//                     </div>
                    
//                     <span className="text-[10px] bg-gray-100 text-gray-600 px-5 py-0.5 mt-2 rounded-full border border-gray-200 font-bold uppercase inline-block">
//                         {item.subType}
//                     </span>

//                     <div className="text-xs text-gray-600 mt-2 font-medium flex gap-3">
//                         <span>Vehicle Qty: <strong>{item.vehicleCount || 1}</strong></span>
//                         {item.flightNumber && <span>• Ref: {item.flightNumber}</span>}
//                     </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <button onClick={() => openEdit(item, 'add_transport')} className="text-green-600 hover:bg-green-50 p-1.5 rounded-md"><Edit size={16}/></button>
//                     <button onClick={() => handleDeleteItem('transport', item.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"><Trash2 size={16}/></button>
//                 </div>
//             </div>

//             {/* 2. NEW: Service Description (Journey Narrative) */}
//             {/* Added here between Header and Logistics */}
//             {item.serviceDescription && (
//                 <div className="mt-2 mb-1">
//                     <p className="text-sm text-gray-600 leading-relaxed border-l-2 border-gray-200 pl-3 py-1">
//                         “{item.serviceDescription}”
//                     </p>
//                 </div>
//             )}

//             {/* 3. Info Grid (Logistics & Cost) */}
//             <div className="mt-2 grid grid-cols-12 gap-3 mb-1">
                
//                 {/* Logistics Block */}
//                 <div className="col-span-9 bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col justify-center">
//                     <div className="flex items-center gap-2">
//                         <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
//                         <div className="flex items-center justify-start w-full overflow-hidden">
//                             <span className="text-xs font-bold text-gray-700 truncate mr-2" title={item.pickupLocation}>
//                                 Pickup: {item.pickupLocation || 'Not set'}
//                             </span>
//                             <span className="text-xs font-bold text-gray-700 whitespace-nowrap ml-5">
//                                 Time: {item.pickupTime}
//                             </span>
//                         </div>
//                     </div>
                    
//                     {item.subType === 'disposal' ? (
//                         <div className="flex items-center gap-2">
//                             <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2"></div>
//                             <span className="text-xs font-bold text-gray-700 truncate mt-2">
//                                 Duration: {item.duration || 'N/A'}
//                             </span>
//                         </div>
//                     ) : (
//                         <div className="flex items-center mt-2 gap-2">
//                             <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-2"></div>
//                             <div className="flex items-center justify-start w-full overflow-hidden">
//                                 <span className="text-xs font-bold text-gray-700 truncate mr-2 mt-2" title={item.dropoffLocation}>
//                                     Drop: {item.dropoffLocation || 'Not set'}
//                                 </span>
//                                 <span className="text-xs font-bold text-gray-700 whitespace-nowrap ml-8 mt-2">
//                                     Time: {item.dropoffTime || '--:--'}
//                                 </span>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Total Cost */}
//                 <div className={`col-span-3 rounded-lg border flex flex-col justify-center items-end pr-3 ${item.inclusionType === 'excluded' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
//                     <div className={`text-[10px] uppercase font-bold flex items-center gap-1 ${item.inclusionType === 'excluded' ? 'text-red-600' : 'text-green-600'}`}>
//                         <DollarSign size={10} /> Total Cost 
//                     </div>
//                     <div className={`text-sm font-bold ${item.inclusionType === 'excluded' ? 'text-red-700' : 'text-green-700'}`}>
//                         {item.inclusionType === 'excluded' ? 'Excluded' : `$${((item.price || 0) * (item.vehicleCount || 1)).toLocaleString()}`}
//                     </div>
//                 </div>

//             </div>
//         </div>
//     </div>
// )}





//                     {/* --- MEAL CARD (NEW) --- */}
//                     {item.type === 'meal' && (
//                       <div className={`bg-white rounded-xl p-5 shadow-lg border-l-4 ${item.inclusionType === 'excluded' ? 'border-red-500' : 'border-orange-500'} flex gap-5 group`}>
                          
//                           {/* Icon */}
//                           <div className={`w-24 rounded-lg flex-shrink-0 flex flex-col items-center justify-center border ${item.inclusionType === 'excluded' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
//                                <Utensils size={24} />
//                           </div>

//                           {/* Content */}
//                           <div className="flex-1 flex flex-col justify-between">
//                               <div className="flex justify-between items-start">
//                                   <div>
//                                       <div className="flex items-center gap-3">
//                                           <h4 className="font-bold text-xl text-gray-800">{item.restaurantName}</h4>
//                                           {/* Status Badge */}
//                                           <StatusBadge status={item.inclusionType} />
//                                       </div>
                                      
//                                       <div className="flex gap-2 mt-1">
//                                           <span className="text-[12px] font-bold bg-gray-100 mt-2 text-gray-800 px-2 py-0.5 rounded border border-gray-200">
//                                               {item.mealType}
//                                           </span>

//                                           <span className="text-[12px] font-bold text-yellow-700 mt-2 ml-5 px-2 py-0.5 rounded flex items-center gap-1">
//                                               Rating:<Star size={8} className="fill-current"/> {item.rating}
//                                           </span>
//                                       </div>
//                                   </div>

//                                   {/* Actions */}
//                                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                       <button onClick={() => openEdit(item, 'add_meal')} className="text-orange-600 hover:bg-orange-50 p-1.5 rounded-md"><Edit size={16}/></button>
//                                       <button onClick={() => handleDeleteItem('meal', item.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"><Trash2 size={16}/></button>
//                                   </div>
//                               </div>

//                               <div className="mt-5 grid grid-cols-12 gap-3">
//                                   {/* Address */}
//                                   <div className="col-span-5 bg-gray-50 p-3 rounded-lg border border-gray-100">
//                                       <div className="text-[11px] text-gray-600 uppercase font-bold mb-0.5">Location</div>
//                                       <div className="text-xs font-bold text-gray-800 mt-1 truncate" title={item.address}>{item.address}</div>
//                                   </div>

//                                   {/* Payment/Inclusion */}
//                                   <div className="col-span-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
//                                       <div className="text-[11px] text-gray-600 uppercase font-bold mb-0.5">Payment</div>
//                                       <div className={`text-xs font-bold capitalize ${item.inclusionType === 'included' ? 'text-green-600' : 'text-gray-600'}`}>
//                                           {item.inclusionType === 'included' ? 'Pre-Paid' : 'Direct Pay'}
//                                       </div>
//                                   </div>

//                                   {/* Cost (Updated Logic) */}
//                                   <div className={`col-span-4 p-3 mb-2 rounded-lg border flex flex-col items-end ${item.inclusionType === 'excluded' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
//                                       <div className={`text-[11px] uppercase font-bold mb-0.5 ${item.inclusionType === 'excluded' ? 'text-red-600' : 'text-gray-600'}`}>
//                                           Total Meal Cost
//                                       </div>
//                                       <div className={`text-sm font-bold ${item.inclusionType === 'excluded' ? 'text-red-700' : 'text-green-800'}`}>
//                                           {item.inclusionType === 'excluded' 
//                                             ? 'Excluded'
//                                             : item.inclusionType === 'included' 
//                                               // THIS IS THE FIX: Calculate total based on saved pax counts
//                                               ? `$${((item.adultCost * (item.paxAdult || 0)) + (item.childCost * (item.paxChild || 0))).toLocaleString()}`
//                                               : <span className="text-gray-400 italic text-xs">Direct Pay</span>
//                                           }
//                                       </div>
//                                       {/* NEW: Show breakdown if included */}
//                                       {item.inclusionType === 'included' && (
//                                          <div className="text-[10px] text-gray-500 mt-0.5 flex gap-2">
//                                             <span>Ad: {item.paxAdult || 0}</span>
//                                             <span>Ch: {item.paxChild || 0}</span>
//                                          </div>
//                                       )}
//                                   </div>
//                               </div>
//                           </div>
//                       </div>
//                     )}

//                   </div>
//                 ))}
//               </div>

//             </div>
//           ) : (
//             // --- SUB FORMS RENDER ---
//             <div className="h-full p-6">
//                 {viewMode === 'add_activity' && (
//                     <ActivityForm 
//                         initialData={editingItem} 
//                         existingActivities={currentDay.activities}
//                         city={currentDay.city} 
//                         dayDate={currentDay.date} 
//                         onSave={(d) => handleSaveItem('activity', d)} 
//                         onCancel={() => setViewMode('list')} 
//                     />
//                 )}
//                 {viewMode === 'add_stay' && (
//                     <StayForm 
//                         initialData={editingItem} city={currentDay.city} dayDate={currentDay.date} 
//                         onSave={(d) => handleSaveItem('stay', d)} onCancel={() => setViewMode('list')} 
//                     />
//                 )}
//                 {viewMode === 'add_transport' && (
//                     <TransportForm 
//                         initialData={editingItem} city={currentDay.city} dayDate={currentDay.date} 
//                         onSave={(d) => handleSaveItem('transport', d)} onCancel={() => setViewMode('list')} 
//                     />
//                 )}
//                 {viewMode === 'add_meal' && (
//                     <MealForm 
//                         initialData={editingItem} 
//                         city={currentDay.city} 
//                         dayDate={currentDay.date} 
//                         onSave={(d) => handleSaveItem('meal', d)} 
//                         onCancel={() => setViewMode('list')} 
//                     />
//                 )}
//             </div>
//           )}
//         </div>

//         {/* --- RIGHT: DAY SELECTOR --- */}
//         <div className="w-58 bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-3 overflow-y-auto">
//           <h2 className="text-gray-100 font-bold text-lg mb-4 border-b border-white/10 pb-2 uppercase">Day Journey</h2>
//           <div className="space-y-2">
//             {dayPlans.map((day, idx) => (
//               <button
//                 key={day.dayNumber} 
//                 onClick={() => { setSelectedDayIndex(idx); setViewMode('list'); }}
//                 className={`w-full text-left p-2 rounded-xl transition-all border ${
//                   idx === selectedDayIndex 
//                   ? 'bg-blue-500 border-blue-400 text-white shadow-lg' 
//                   : 'bg-white border-transparent text-gray-900 hover:bg-white/90'
//                 }`}
//               >
//                   <div className="text-[10px] font-bold opacity-80 uppercase text-gray-900">Day {day.dayNumber}</div>
//                   <div className="font-bold truncate text-sm text-gray-900">{day.city}</div>
//                   <div className="text-[10px] opacity-60 mt-0.5 text-gray-600">{formatDatePretty(day.date)}</div>
                  
//                   <div className="flex gap-1 mt-1 justify-end">
//                       {day.stays.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-purple-400"/>}
//                       {day.activities.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-blue-300"/>}
//                       {day.transports.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-green-400"/>}
//                   </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
      
//       <div className="flex justify-between items-center mr-5 mb-5 ">
//          <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white px-6 py-3 rounded-lg font-medium hover:bg-white/5"><ArrowLeft size={18} /> Back</button>
//          <button onClick={handleNext} className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02]">
//              Next Step: Costing <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//          </button>
//       </div>
//     </div>
//   );
// }

// function NavIcon({icon, label, color, onClick}: {icon: any, label: string, color: string, onClick: () => void}) {
//   return (
//     <button onClick={onClick} className="flex flex-col items-center gap-1 group">
//        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
//           {icon}
//        </div>
//        <span className="text-[10px] font-bold text-gray-300 group-hover:text-white uppercase tracking-wider">{label}</span>
//     </button>
//   )
// } 



























































"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Camera, Hotel, Bus, Utensils, 
  Calendar, Trash2, Edit, User, Clock, DollarSign,
  Star, Moon, Car, Plane, Train, Ship, ArrowRight, ArrowLeft,
  Ban, CheckCircle2, PlusSquare, Briefcase // [CHANGE 1: Added Briefcase Icon for Supplier]
} from 'lucide-react';
import { useItinerary } from '@/app/context/ItineraryContext';
import { useSRM } from '@/app/context/SRMContext'; // [CHANGE 2: Import SRM Context]
import { DayPlan } from './constants/daywiseConstants';

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
  const { itineraryData, updateItineraryData } = useItinerary();
  const { suppliers } = useSRM(); // [CHANGE 3: Access Suppliers]
  
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // --- LOGIC: Expand Routes into Days based on Nights ---
  useEffect(() => {
    if (itineraryData.routingData?.routes) {
      const routes = itineraryData.routingData.routes;
      const savedPlans = (itineraryData.dayWiseActivities as DayPlan[]) || [];
      const startDateStr = itineraryData.routingData.startDate; 

      const generatedDayPlans: DayPlan[] = [];
      let globalDayCounter = 1;
      
      let runningDate = startDateStr ? new Date(startDateStr) : new Date();

      // 1. LOOP THROUGH ROUTES
      routes.forEach((route) => {
        const nightsCount = parseInt(route.nights?.toString() || '0') || 0;
        const loopCount = nightsCount === 0 ? 1 : nightsCount; 

        for (let i = 0; i < loopCount; i++) {
          const existingPlan = savedPlans.find(p => p.dayNumber === globalDayCounter);
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

      // 2. CHECKOUT DAY
      if (routes.length > 0) {
          const lastRoute = routes[routes.length - 1];
          const existingPlan = savedPlans.find(p => p.dayNumber === globalDayCounter);
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
  }, [itineraryData.routingData]);

  const currentDay = dayPlans[selectedDayIndex];

  // --- HANDLERS ---
  const handleSaveItem = (type: 'activity' | 'stay' | 'transport' | 'meal', data: any) => {
    if (!currentDay) return;
    
    const updatedPlans = [...dayPlans];
    const plan = updatedPlans[selectedDayIndex];

    if (type === 'activity') {
      const idx = plan.activities.findIndex(a => a.id === data.id);
      if (idx >= 0) plan.activities[idx] = data; else plan.activities.push(data);
    } else if (type === 'stay') {
      const idx = plan.stays.findIndex(s => s.id === data.id);
      if (idx >= 0) plan.stays[idx] = data; else plan.stays.push(data);
    } else if (type === 'transport') {
      const idx = plan.transports.findIndex(t => t.id === data.id);
      if (idx >= 0) plan.transports[idx] = data; else plan.transports.push(data);
    } else if(type === 'meal'){
      const idx = plan.meals.findIndex(m => m.id === data.id);
      if (idx >= 0) plan.meals[idx] = data; else plan.meals.push(data);
    }

    setDayPlans(updatedPlans);
    updateItineraryData({ dayWiseActivities: updatedPlans });
    setViewMode('list');
    setEditingItem(null);
  };

  const handleDeleteItem = (type: 'activity' | 'stay' | 'transport' | 'meal', id: number) => {
    if (!confirm('Delete this item?')) return;
    const updatedPlans = [...dayPlans];
    const plan = updatedPlans[selectedDayIndex];
    
    if (type === 'activity') plan.activities = plan.activities.filter(a => a.id !== id);
    else if (type === 'stay') plan.stays = plan.stays.filter(s => s.id !== id);
    else if (type === 'transport') plan.transports = plan.transports.filter(t => t.id !== id);
    else if (type === 'meal') plan.meals = plan.meals.filter(m => m.id !== id);
    
    setDayPlans(updatedPlans);
    updateItineraryData({ dayWiseActivities: updatedPlans });
  };

  const openAdd = (mode: ViewMode) => { setEditingItem(null); setViewMode(mode); };
  const openEdit = (item: any, mode: ViewMode) => { setEditingItem(item); setViewMode(mode); };

  // const calculateTotalActivityCost = (item: any) => {
  //   if (item.inclusionType === 'excluded') return 0;
  //   const entrance = item.entranceFeePP || 0;
  //   const activity = item.activityFeePP || 0;
  //   const guide = (item.guideType === 'guided' ? item.guideFee : 0) || 0;
  //   return entrance + activity + guide;
  // };


  // --- [UPDATED FUNCTION] ---
  const calculateTotalActivityCost = (item: any) => {
    if (item.inclusionType === 'excluded') return 0;
    
    // 1. Get Pax (Fallback to 1 to prevent zero multiplication error)
    const pax = item.paxCount || 1; 
    
    // 2. Variable Costs (Multiplied by Pax)
    const entrance = (item.entranceFeePP || 0) * pax;
    const activity = (item.activityFeePP || 0) * pax;
    
    // 3. Fixed Costs (Guide Fee is usually per group/tour, not per person)
    const guide = (item.guideType === 'guided' ? item.guideFee : 0) || 0;
    
    return entrance + activity + guide;
  };

  // --- [CHANGE 4: HELPER TO FIND SUPPLIER NAME] ---
  const getSupplierName = (linkedId?: string) => {
      if (!linkedId) return null;
      const sup = suppliers.find(s => s.id === linkedId);
      return sup ? sup.name : null; // Return the company name
  };

  if (!currentDay) return <div className="p-8 text-white">Loading Days... Please set up Routing first.</div>;

  // --- GHOST STAYS ---
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

  const displayItems = [
    ...getGhostStays(),
    ...currentDay.activities,
    ...currentDay.stays,
    ...currentDay.transports,
    ...(currentDay.meals || [])
  ]; 

  const handleBack = async () => router.push('/dashboard/itinerary/routing');
  const handleNext = async () => router.push('/dashboard/itinerary/costing');

  return (
    <div>
      <div className="flex h-full min-h-[calc(100vh-140px)] gap-4 p-4">
        
        {/* --- LEFT: MAIN CONTENT AREA --- */}
        <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          
          {viewMode === 'list' ? (
            <div className="flex flex-col h-full">
              
              {/* Toolbar Header */}
              <div className="bg-white/10 border-b border-white/10 p-6 flex justify-between items-end">
                 <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{currentDay.city}</h1>
                    <p className="text-gray-300 flex items-center gap-2">
                        <Calendar size={16}/> {formatDatePretty(currentDay.date)} | <span className="text-blue-300 font-bold">Day {currentDay.dayNumber}</span>
                    </p>
                 </div>
                 <div className="flex gap-4">
                    <NavIcon icon={<Camera size={24}/>} label="Activity" onClick={() => openAdd('add_activity')} color="bg-blue-500" />
                    <NavIcon icon={<Hotel size={24}/>} label="Stay" onClick={() => openAdd('add_stay')} color="bg-purple-600" />
                    <NavIcon icon={<Bus size={24}/>} label="Transport" onClick={() => openAdd('add_transport')} color="bg-green-500" />
                    <NavIcon icon={<Utensils size={24}/>} label="Meal" onClick={() => openAdd('add_meal')} color="bg-orange-500" />
                 </div>
              </div>

              {/* Main List Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {displayItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-500/30 rounded-xl text-gray-400">
                     <p>No plans yet for Day {currentDay.dayNumber}.</p>
                  </div>
                )}

                {displayItems.map((item: any) => {
                  // [CHANGE 5: Fetch Supplier Name for each item]
                  const supplierName = getSupplierName(item.linkedSupplierId);

                  return (
                  <div key={`${item.type}-${item.id}`} className="relative group">
                    
                    {/* ======================================================== */}
                    {/* ACTIVITY CARD (RESTORED DETAIL + SUPPLIER BADGE)        */}
                    {/* ======================================================== */}
                    {item.type === 'activity' && (
                      <div className={`bg-white rounded-xl p-5 shadow-lg border-l-4 ${item.inclusionType === 'excluded' ? 'border-red-500 opacity-90' : 'border-blue-500'} flex gap-5`}>
                         
                         {/* Icon Box */}
                         <div className={`w-24 rounded-lg flex-shrink-0 flex flex-col items-center justify-center border ${item.inclusionType === 'excluded' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                             <Camera size={32} />
                         </div>

                         <div className="flex-1">
                            <div className="flex justify-between items-start">
                               <div>
                                 <div className="flex items-center gap-3">
                                     <h4 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                       {item.heading}
                                     </h4>
                                     <StatusBadge status={item.inclusionType} />
                                 </div>

                                 {/* [CHANGE 6: SUPPLIER BADGE] */}
                                 {supplierName && (
                                     <div className="mt-1 inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[10px] border border-blue-100">
                                         <Briefcase size={10} /> 
                                         <span className="font-bold">By: {supplierName}</span>
                                     </div>
                                 )}

                                 <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>

                                    <div className="text-[10px] font-bold uppercase tracking-wider mt-3 mb-1 opacity-70 flex gap-4">
                                      <span>Slot: {item.slot || 'Activity'}</span>
                                      {item.startTime && <span>Start: {item.startTime}</span>}
                                      <span>Duration: {item.duration || 'N/A'}</span> 
                                   </div>
                               </div>

                               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => openEdit(item, 'add_activity')} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md"><Edit size={16}/></button>
                                  <button onClick={() => handleDeleteItem('activity', item.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"><Trash2 size={16}/></button>
                               </div>
                            </div>
                            
                            {/* DETAILS GRID (RESTORED) */}
                            <div className="mt-4 grid grid-cols-3 gap-4">
                               <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                  <div className="text-[10px] text-gray-500 uppercase font-bold  flex items-center gap-1">
                                    <Clock size={10} /> Pickup
                                  </div>
                                  <div className="text-xs font-bold mt-1 text-gray-700">
                                   Time: {item.pickupTime}
                                  </div>
                                  <div className="text-[12px] font-bold text-gray-700 truncate" title={item.pickupLocation}>
                                   Location: {item.pickupLocation || 'Not Set'}
                                  </div>
                               </div>

                               <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                  <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
                                    <User size={10} /> Guide Option
                                  </div>
                                  <div className="text-sm font-bold text-gray-700 capitalize">
                                    {item.guideType === 'guided' ? 'Guided Tour' : 'Self Guided'}
                                  </div>
                               </div>

                               {/* <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                  <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
                                   <DollarSign size={10} /> Per Person Fee
                                  </div>
                                  <div className={`text-sm font-bold ${item.inclusionType === 'excluded' ? 'text-red-500' : 'text-green-700'}`}>
                                    {item.inclusionType === 'excluded' ? 'Excluded' : `$${calculateTotalActivityCost(item).toLocaleString()}`}
                                  </div>
                               </div> */}

                               {/* --- [UPDATED ACTIVITY COST BLOCK] --- */}
                               <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                  <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
                                   <DollarSign size={10} /> Total Cost
                                  </div>
                                  <div className={`text-sm font-bold ${item.inclusionType === 'excluded' ? 'text-red-500' : 'text-green-700'}`}>
                                    {item.inclusionType === 'excluded' 
                                        ? 'Excluded' 
                                        : `$${calculateTotalActivityCost(item).toLocaleString()}`
                                    }
                                  </div>
                                  {item.inclusionType !== 'excluded' && (
                                      <div className="text-[9px] text-gray-400 mt-0.5 font-medium">
                                          For {item.paxCount || 1} Pax
                                      </div>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                    )}


                    {/* ======================================================== */}
                    {/* STAY CARD (RESTORED DETAIL + SUPPLIER BADGE)            */}
                    {/* ======================================================== */}
                    {item.type === 'stay' && (
                      <div className={`rounded-xl p-6 shadow-lg border-l-4 flex gap-5 group relative ${
                          item.isContinued 
                            ? 'bg-gray-50 border-gray-400 opacity-90' 
                            : item.inclusionType === 'excluded'
                              ? 'bg-white border-red-500'
                              : 'bg-white border-purple-500'
                      }`}>
                          
                          <div className="w-24 h-32 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden group-hover:shadow-md transition-all flex flex-col items-center justify-center">
                               <Hotel size={32} className={item.inclusionType === 'excluded' ? 'text-red-500' : 'text-purple-600'} />
                               
                              <div className={`absolute top-0 left-0 text-white text-[10px] font-bold px-1 py-1 rounded-br-lg z-10 ${
                                  item.isContinued ? 'bg-gray-500' : (item.inclusionType === 'excluded' ? 'bg-red-500' : 'bg-purple-600')
                              }`}>
                                  {item.isContinued ? 'CONTINUED' : 'STAY'}
                              </div>
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                              
                              <div className="flex justify-between items-start">
                                  <div>
                                      <h4 className="font-bold text-xl text-gray-800 leading-tight">{item.hotelName}</h4>
                                      
                                      {/* [CHANGE 7: SUPPLIER BADGE] */}
                                      {!item.isContinued && supplierName && (
                                         <div className="mt-1 inline-flex items-center gap-1 bg-purple-50 text-purple-800 px-2 py-0.5 rounded text-[10px] border border-purple-100">
                                             <Briefcase size={10} /> 
                                             <span className="font-bold">By: {supplierName}</span>
                                         </div>
                                      )}

                                      <div className="flex gap-2 mt-1.5 items-center">
                                          {!item.isContinued && <StatusBadge status={item.inclusionType} />}
                                          
                                          <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-gray-900 px-2 py-0.5 rounded border border-purple-100">
                                              {item.category} • {item.stayType}
                                          </span>
                                          <span className='text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-gray-900 px-2 py-0.5 rounded border border-orange-100 flex items-center gap-1'>
                                          <Star size={10} className="fill-yellow-500 text-yellow-500" /> {item.rating}
                                          </span>
                                      </div>
                                  </div>

                                  {!item.isContinued && (
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(item, 'add_stay')} className="text-purple-600 hover:bg-purple-50 p-1.5 rounded-md transition-colors"><Edit size={16}/></button>
                                        <button onClick={() => handleDeleteItem('stay', item.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors"><Trash2 size={16}/></button>
                                    </div>
                                  )}
                              </div>

                              {/* DETAILS GRID (RESTORED) */}
                              <div className="grid grid-cols-12 gap-3 mt-4">
                                  <div className="col-span-3 bg-white border border-gray-200 rounded p-2">
                                      <div className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Room</div>
                                      <div className="text-xs font-bold text-gray-700 truncate" title={item.roomCategory}>
                                          {item.numRooms} x {item.roomCategory}
                                      </div>
                                  </div>

                                  <div className="col-span-2 bg-white border border-gray-200 rounded p-2">
                                      <div className="text-[10px] text-gray-500 uppercase font-bold mb-0.5 flex items-center gap-1">Duration</div>
                                      <div className="text-xs font-bold text-gray-700 flex items-center gap-1">
                                          <Moon size={12} className="text-purple-400" /> {item.nights} Nights
                                      </div>
                                  </div>

                                  <div className="col-span-4 bg-white border border-gray-200 rounded p-2">
                                      <div className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Schedule</div>
                                      <div className="text-xs font-bold text-gray-700 flex justify-between">
                                          <span>In: {item.checkInTime}</span>
                                          <span className="text-gray-300">|</span>
                                          <span>Out: {item.checkOutTime}</span>
                                      </div>
                                  </div>

                                  <div className={`col-span-3 rounded p-2 border relative overflow-hidden ${
                                      item.isContinued 
                                        ? 'bg-gray-100 border-gray-200' 
                                        : item.inclusionType === 'excluded' 
                                            ? 'bg-red-50 border-red-100' 
                                            : 'bg-green-50 border-green-100'
                                  }`}>
                                      <div className={`text-[10px] uppercase font-bold mb-0.5 ${
                                          item.isContinued ? 'text-gray-500' : (item.inclusionType === 'excluded' ? 'text-red-600' : 'text-green-600')
                                      }`}>
                                          {item.isContinued ? 'Cost Status' : 'Total Cost'}
                                      </div>
                                      <div className={`text-sm font-bold ${
                                          item.isContinued ? 'text-gray-600 italic' : (item.inclusionType === 'excluded' ? 'text-red-800' : 'text-green-800')
                                      }`}>
                                          {item.isContinued 
                                              ? "Included" 
                                            : item.inclusionType === 'excluded' 
                                                ? 'Excluded'
                                                : `$${(item.costPerNight * item.numRooms * item.nights).toLocaleString()}`
                                          }
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                    )}


                    {/* ======================================================== */}
                    {/* TRANSPORT CARD (RESTORED DESCRIPTION + SUPPLIER BADGE)  */}
                    {/* ======================================================== */}
                    {item.type === 'transport' && (
                        <div className={`bg-white rounded-xl p-5 shadow-lg border-l-4 ${item.inclusionType === 'excluded' ? 'border-red-500' : 'border-green-500'} flex gap-5 group`}>
                            
                            <div className={`w-24 rounded-lg flex-shrink-0 flex flex-col items-center justify-center border ${item.inclusionType === 'excluded' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                {item.mode === 'flight' ? <Plane size={24}/> : 
                                 item.mode === 'rail' ? <Train size={24}/> : 
                                 item.mode === 'ferry' ? <Ship size={24}/> : 
                                 <Car size={24}/>}
                                <span className="text-[10px] font-bold uppercase mt-1 tracking-wider">{item.mode}</span>
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                                {item.vehicleType || 'Transport'}
                                            </h4>
                                            <StatusBadge status={item.inclusionType} />
                                        </div>
                                        
                                        {/* [CHANGE 8: SUPPLIER BADGE] */}
                                        {supplierName && (
                                            <div className="mt-1 inline-flex items-center gap-1 bg-green-50 text-green-800 px-2 py-0.5 rounded text-[10px] border border-green-100">
                                                <Briefcase size={10} /> 
                                                <span className="font-bold">By: {supplierName}</span>
                                            </div>
                                        )}

                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-5 py-0.5 mt-2 rounded-full border border-gray-200 font-bold uppercase inline-block ml-2">{item.subType}</span>
                                        <div className="text-xs text-gray-600 mt-2 font-medium flex gap-3">
                                           <span>Vehicle Qty: <strong>{item.vehicleCount || 1}</strong></span>
                                           {item.flightNumber && <span>• Ref: {item.flightNumber}</span>}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(item, 'add_transport')} className="text-green-600 hover:bg-green-50 p-1.5 rounded-md"><Edit size={16}/></button>
                                        <button onClick={() => handleDeleteItem('transport', item.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"><Trash2 size={16}/></button>
                                    </div>
                                </div>

                                {/* RESTORED DESCRIPTION TEXT */}
                                {item.serviceDescription && (
                                    <div className="mt-2 mb-1">
                                        <p className="text-sm text-gray-600 leading-relaxed border-l-2 border-gray-200 pl-3 py-1 italic">
                                            “{item.serviceDescription}”
                                        </p>
                                    </div>
                                )}

                                {/* RESTORED LOGISTICS & COST GRID */}
                                <div className="mt-2 grid grid-cols-12 gap-3 mb-1">
                                    <div className="col-span-9 bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col justify-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                                            <div className="flex items-center justify-start w-full overflow-hidden">
                                                <span className="text-xs font-bold text-gray-700 truncate mr-2">Pickup: {item.pickupLocation || 'Not set'}</span>
                                                <span className="text-xs font-bold text-gray-700 whitespace-nowrap ml-5">Time: {item.pickupTime}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center mt-2 gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></div>
                                            <div className="flex items-center justify-start w-full overflow-hidden">
                                                <span className="text-xs font-bold text-gray-700 truncate mr-2">{item.subType === 'transfer' ? `Drop: ${item.dropoffLocation || 'Not set'}` : `Duration: ${item.duration}`}</span>
                                                {item.subType === 'transfer' && <span className="text-xs font-bold text-gray-700 whitespace-nowrap ml-5">Time: {item.dropoffTime}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className={`col-span-3 rounded-lg border flex flex-col justify-center items-end pr-3 ${item.inclusionType === 'excluded' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                                        <div className={`text-[10px] uppercase font-bold flex items-center gap-1 ${item.inclusionType === 'excluded' ? 'text-red-600' : 'text-green-600'}`}><DollarSign size={10} /> Total Cost</div>
                                        <div className={`text-sm font-bold ${item.inclusionType === 'excluded' ? 'text-red-700' : 'text-green-700'}`}>
                                            {item.inclusionType === 'excluded' ? 'Excluded' : `$${((item.price || 0) * (item.vehicleCount || 1)).toLocaleString()}`}
                                        </div>
                                    </div> */}

                                    {/* --- [UPDATED TRANSPORT COST BLOCK] --- */}
                                    <div className={`col-span-3 rounded-lg border flex flex-col justify-center items-end pr-3 ${item.inclusionType === 'excluded' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                                        <div className={`text-[10px] uppercase font-bold flex items-center gap-1 ${item.inclusionType === 'excluded' ? 'text-red-600' : 'text-green-600'}`}>
                                            <DollarSign size={10} /> Total Cost
                                        </div>
                                        <div className={`text-sm font-bold ${item.inclusionType === 'excluded' ? 'text-red-700' : 'text-green-700'}`}>
                                            {item.inclusionType === 'excluded' ? 'Excluded' : (
                                                // LOGIC: If Ticket Mode -> Price * Pax. If Vehicle Mode -> Price * Vehicles
                                                ['flight', 'rail', 'ferry'].includes(item.mode)
                                                ? `$${((item.price || 0) * (item.paxCount || 1)).toLocaleString()}`
                                                : `$${((item.price || 0) * (item.vehicleCount || 1)).toLocaleString()}`
                                            )}
                                        </div>
                                        
                                        {/* Helper Text to show what was multiplied */}
                                        {item.inclusionType !== 'excluded' && (
                                            <div className="text-[9px] opacity-70 mt-0.5">
                                                {['flight', 'rail', 'ferry'].includes(item.mode)
                                                    ? `(${item.paxCount || 1} Tix)`
                                                    : `(${item.vehicleCount || 1} Veh)`
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- MEAL CARD (WITH BADGE) --- */}
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
                                      
                                      {/* [CHANGE 9: SUPPLIER BADGE] */}
                                      {supplierName && (
                                         <div className="mt-1 inline-flex items-center gap-1 bg-orange-50 text-orange-800 px-2 py-0.5 rounded text-[10px] border border-orange-100">
                                             <Briefcase size={10} /> 
                                             <span className="font-bold">By: {supplierName}</span>
                                         </div>
                                      )}

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
                                  <div className="col-span-5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                      <div className="text-[11px] text-gray-600 uppercase font-bold mb-0.5">Location</div>
                                      <div className="text-xs font-bold text-gray-800 mt-1 truncate" title={item.address}>{item.address}</div>
                                  </div>
                                  <div className="col-span-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                      <div className="text-[11px] text-gray-600 uppercase font-bold mb-0.5">Payment</div>
                                      <div className={`text-xs font-bold capitalize ${item.inclusionType === 'included' ? 'text-green-600' : 'text-gray-600'}`}>{item.inclusionType === 'included' ? 'Pre-Paid' : 'Direct Pay'}</div>
                                  </div>
                                  <div className={`col-span-4 p-3 mb-2 rounded-lg border flex flex-col items-end ${item.inclusionType === 'excluded' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                                      <div className={`text-[11px] uppercase font-bold mb-0.5 ${item.inclusionType === 'excluded' ? 'text-red-600' : 'text-gray-600'}`}>Total Meal Cost</div>
                                      <div className={`text-sm font-bold ${item.inclusionType === 'excluded' ? 'text-red-700' : 'text-green-800'}`}>
                                          {item.inclusionType === 'excluded' ? 'Excluded' : item.inclusionType === 'included' ? `$${((item.adultCost * (item.paxAdult || 0)) + (item.childCost * (item.paxChild || 0))).toLocaleString()}` : <span className="text-gray-400 italic text-xs">Direct Pay</span>}
                                      </div>
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
            // --- SUB FORMS RENDER (UNCHANGED) ---
            <div className="h-full p-6">
                {viewMode === 'add_activity' && <ActivityForm initialData={editingItem} existingActivities={currentDay.activities} city={currentDay.city} dayDate={currentDay.date} onSave={(d) => handleSaveItem('activity', d)} onCancel={() => setViewMode('list')} />}
                {viewMode === 'add_stay' && <StayForm initialData={editingItem} city={currentDay.city} dayDate={currentDay.date} onSave={(d) => handleSaveItem('stay', d)} onCancel={() => setViewMode('list')} />}
                {viewMode === 'add_transport' && <TransportForm initialData={editingItem} city={currentDay.city} dayDate={currentDay.date} onSave={(d) => handleSaveItem('transport', d)} onCancel={() => setViewMode('list')} />}
                {viewMode === 'add_meal' && <MealForm initialData={editingItem} city={currentDay.city} dayDate={currentDay.date} onSave={(d) => handleSaveItem('meal', d)} onCancel={() => setViewMode('list')} />}
            </div>
          )}
        </div>

        {/* --- RIGHT: DAY SELECTOR --- */}
        <div className="w-58 bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-3 overflow-y-auto">
          <h2 className="text-gray-100 font-bold text-lg mb-4 border-b border-white/10 pb-2 uppercase">Day Journey</h2>
          <div className="space-y-2">
            {dayPlans.map((day, idx) => (
              <button key={day.dayNumber} onClick={() => { setSelectedDayIndex(idx); setViewMode('list'); }} className={`w-full text-left p-2 rounded-xl transition-all border ${idx === selectedDayIndex ? 'bg-blue-500 border-blue-400 text-white shadow-lg' : 'bg-white border-transparent text-gray-900 hover:bg-white/90'}`}>
                  <div className="text-[10px] font-bold opacity-80 uppercase text-gray-900">Day {day.dayNumber}</div>
                  <div className="font-bold truncate text-sm text-gray-900">{day.city}</div>
                  <div className="text-[10px] opacity-60 mt-0.5 text-gray-600">{formatDatePretty(day.date)}</div>
                  <div className="flex gap-1 mt-1 justify-end">
                      {day.stays.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-purple-400"/>}
                      {day.activities.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-blue-300"/>}
                      {day.transports.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-green-400"/>}
                  </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mr-5 mb-5 ">
         <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white px-6 py-3 rounded-lg font-medium hover:bg-white/5"><ArrowLeft size={18} /> Back</button>
         <button onClick={handleNext} className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02]">Next Step: Costing <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></button>
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