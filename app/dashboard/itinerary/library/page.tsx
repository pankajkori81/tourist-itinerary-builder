




// "use client";

// import { useState, useEffect, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Plus, Trash2, Edit, Copy, MapPin, Clock, 
//   CheckCircle, User, AlertCircle, FileText, ArrowRight, Calendar, Users, X
// } from 'lucide-react';
// import { 
//   getLibrary, 
//   deleteFromLibrary, 
//   cloneItinerary, 
//   getItineraryById, 
//   StoredItineraryData,
//   updateItineraryStatus,
//   FixedDeparture // Ensure this is exported from your utils
// } from '@/utils/itineraryStorage';
// import { useItinerary } from '@/app/context/ItineraryContext';
// import { useCurrency } from '@/hooks/useCurrency'; 
// import FixedDepartureModal from '@/components/FixedDepartureModal'; // Ensure you created this component
// import { useUser } from '@/app/context/UserContext'; // 👈 NEW: Import User Context

// // --- HELPERS (Costing Logic Engine) ---
// const isItemIncluded = (status?: string) => !status || status.toLowerCase() === 'included';
// const safeNum = (val: any) => {
//   const num = parseFloat(val);
//   return isNaN(num) ? 0 : num;
// };

// // --- CONFIRMATION MODAL (INTELLIGENT) ---
// const ConfirmTripModal = ({ isOpen, onClose, onConfirm, itinerary }: { isOpen: boolean, onClose: () => void, onConfirm: (name: string, price: number, pax: number) => void, itinerary: StoredItineraryData | null }) => {
//   const [guestName, setGuestName] = useState('');
//   const [paxCount, setPaxCount] = useState<number>(1);
//   const { currency, convert } = useCurrency('USD'); 

//   useEffect(() => {
//     if(isOpen && itinerary) {
//         setGuestName(itinerary.leadGuestName || '');
//         setPaxCount(safeNum(itinerary.numberOfTravelers) || 1);
//     }
//   }, [isOpen, itinerary]);

//   const pricing = useMemo(() => {
//       if (!itinerary) return { total: 0, pp: 0 };

//       // 1. Check for Fixed Price Override
//       if (itinerary.useFixedPrice && itinerary.fixedDepartures) {
//           const activeFixed = itinerary.fixedDepartures.find(d => d.isSelected);
//           if (activeFixed) {
//               return {
//                   total: activeFixed.price * paxCount,
//                   pp: activeFixed.price
//               };
//           }
//       }

//       // 2. Dynamic Costing (Matches Costing Sheet)
//       let netTotal = 0;
//       const days = itinerary.dayWiseActivities || [];

//       days.forEach(day => {
//           day.stays?.forEach(s => {
//               if(isItemIncluded(s.inclusionType)) {
//                   netTotal += safeNum(s.costPerNight) * safeNum(s.numRooms) * safeNum(s.nights);
//               }
//           });
//           day.transports?.forEach(t => {
//               if(isItemIncluded(t.inclusionType)) {
//                   netTotal += safeNum(t.price) * safeNum(t.vehicleCount);
//               }
//           });
//           day.activities?.forEach(a => {
//               if(isItemIncluded(a.inclusionType)) {
//                   const guideCost = a.guideType === 'guided' ? safeNum(a.guideFee) : 0;
//                   const itemCost = (safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * paxCount;
//                   netTotal += itemCost + guideCost;
//               }
//           });
//           day.meals?.forEach(m => {
//               if(isItemIncluded(m.inclusionType)) {
//                   netTotal += safeNum(m.adultCost) * paxCount; 
//               }
//           });
//       });

//       // 3. Apply Markup
//       const netInCurrency = convert(netTotal, itinerary.selectedCurrency || 'USD'); 
//       const markupPercent = itinerary.markupPercentage || 0;
//       const markupAmount = netInCurrency * (markupPercent / 100);
//       const grandTotal = netInCurrency + markupAmount;
      
//       const exactPP = grandTotal / paxCount;

//       // 4. Apply Rounding
//       let finalPP = exactPP;
//       const mode = itinerary.roundingMode || 'none';
      
//       if (mode === '5') finalPP = Math.ceil(exactPP / 5) * 5;
//       else if (mode === '10') finalPP = Math.ceil(exactPP / 10) * 10;
//       else if (mode === '100') finalPP = Math.ceil(exactPP / 100) * 100;

//       return {
//           total: finalPP * paxCount,
//           pp: finalPP
//       };

//   }, [itinerary, paxCount, convert]);

//   const handleConfirm = () => {
//     if (!guestName.trim()) {
//         alert('Lead Guest Name is required.');
//         return;
//     }
//     onConfirm(guestName, pricing.total, paxCount);
//   };

//   if (!isOpen || !itinerary) return null;

//   const fmt = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: itinerary.selectedCurrency || 'USD', maximumFractionDigits: 0 }).format(amount);

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 ">
//             <div className="bg-[#1e293b] p-4 flex justify-between items-center">
//                 <h3 className="text-white font-bold flex items-center gap-2"><CheckCircle size={18}/> Confirm Booking</h3>
//                 <button onClick={onClose} className="text-gray-400 hover:text-white"><AlertCircle size={20}/></button>
//             </div>
            
//             <div className="p-6 space-y-5">
//                 <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
//                     <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Confirming Trip</p>
//                     <p className="text-sm font-bold text-gray-900">{itinerary.tripName}</p>
//                     {itinerary.routingData?.startDate ? (
//                          <div className="mt-1 flex items-center gap-2 text-xs text-blue-700 font-medium">
//                             <Calendar size={12}/> Start: {itinerary.routingData.startDate}
//                          </div>
//                     ) : (
//                         <div className="mt-1 flex items-center gap-2 text-xs text-red-600 font-bold">
//                             <AlertCircle size={12}/> Date Not Set
//                          </div>
//                     )}
//                 </div>

//                 <div className="space-y-4">
//                     <div>
//                         <label className="block text-xs font-bold text-gray-600 mb-1">Lead Guest Name <span className="text-red-500">*</span></label>
//                         <div className="relative">
//                             <User className="absolute left-3 top-2.5 text-gray-400" size={16}/>
//                             <input 
//                                 type="text" 
//                                 className="w-full pl-9 p-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
//                                 placeholder="e.g. Mr. John Smith"
//                                 value={guestName}
//                                 onChange={(e) => setGuestName(e.target.value)}
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-xs font-bold text-gray-600 mb-1">Total Travelers (Pax) <span className="text-red-500">*</span></label>
//                         <div className="relative">
//                             <Users className="absolute left-3 top-2.5 text-gray-400" size={16}/>
//                             <input 
//                                 type="number" 
//                                 min="1"
//                                 className="w-full pl-9 p-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
//                                 value={paxCount}
//                                 onChange={(e) => setPaxCount(parseInt(e.target.value) || 1)}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-slate-900 rounded-xl p-4 text-white">
//                     <div className="flex justify-between items-center mb-1">
//                         <span className="text-xs text-slate-400 uppercase font-bold">Total Group Price</span>
//                         <span className="text-xl font-bold text-green-400">{fmt(pricing.total)}</span>
//                     </div>
//                     <div className="h-px bg-slate-700 my-2"></div>
//                     <div className="flex justify-between items-center">
//                         <span className="text-xs text-slate-400">Per Person ({paxCount} Pax)</span>
//                         <span className="text-sm font-bold">{fmt(pricing.pp)}</span>
//                     </div>
//                 </div>
//             </div>

//             <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
//                 <button onClick={onClose} className="px-4 py-2 text-gray-600 text-sm font-bold hover:bg-gray-200 rounded-lg">Cancel</button>
//                 <button 
//                     onClick={handleConfirm} 
//                     className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2"
//                 >
//                     Confirm Booking <ArrowRight size={14}/>
//                 </button>
//             </div>
//         </div>
//     </div>
//   );
// };


// // --- MAIN PAGE COMPONENT ---
// export default function LibraryPage() {
//   const router = useRouter();
//   const { clearSavedItinerary } = useItinerary();
//   const { user } = useUser(); // 👈 NEW: Get current logged-in user

//   const [activeTab, setActiveTab] = useState<'templates' | 'quotes'>('templates'); 
//   const [libraries, setLibraries] = useState<StoredItineraryData[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, itinerary: StoredItineraryData | null}>({isOpen: false, itinerary: null});

//   // NEW STATE for Fixed Departures
//   const [isManageDatesOpen, setIsManageDatesOpen] = useState(false);
//   const [activeManagerId, setActiveManagerId] = useState<string | null>(null);
//   const [isDateSelectorOpen, setIsDateSelectorOpen] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState<StoredItineraryData | null>(null);

//   useEffect(() => {
//     loadLibraries();
//   }, [activeTab, user]); // 👈 NEW: Re-run if user or tab changes

//   const loadLibraries = () => {
//     setLoading(true);
//     const savedLibraries = getLibrary();
    
//     let filtered;
//     if (activeTab === 'templates') {
//         filtered = savedLibraries.filter(lib => lib.isMasterItinerary === true);
//     } else {
//         filtered = savedLibraries.filter(lib => 
//             lib.isMasterItinerary === false && 
//             (lib.bookingStatus === 'quote' || !lib.bookingStatus)
//         );

//         // 👈 NEW: AGENT FILTER LOGIC
//         // If the user is an agent, ONLY show quotes they own
//         if (user?.role === 'agent') {
//             filtered = filtered.filter(lib => lib.assignedAgentId === user._id);
//         }
//     }
//     setLibraries(filtered);
//     setLoading(false);
//   };

//   // --- NEW HANDLER: OPEN DATE MANAGER (Modal 1) ---
//   const handleOpenManager = (id: string, e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent card click
//     setActiveManagerId(id);
//     setIsManageDatesOpen(true);
//   };

//   // --- NEW HANDLER: SAVE INVENTORY ---
//   const handleSaveDates = (departures: FixedDeparture[]) => {
//     if (!activeManagerId) return;
    
//     const master = getItineraryById(activeManagerId);
//     if (master) {
//         master.fixedDepartures = departures;
//         master.isFixedDeparture = departures.length > 0; 
        
//         // Save back to storage
//         const allLibs = getLibrary();
//         const idx = allLibs.findIndex(i => i.id === activeManagerId);
//         if(idx !== -1) {
//             allLibs[idx] = master;
//             localStorage.setItem('itinerary_library', JSON.stringify(allLibs));
//         }
        
//         loadLibraries();
//     }
//   };

//   // --- NEW HANDLER: USE TEMPLATE CLICK ---
//   const handleUseTemplate = (item: StoredItineraryData) => {
//     // LOGIC: If it has fixed dates, show selector. If not, standard clone.
//     if (item.fixedDepartures && item.fixedDepartures.length > 0) {
//         setSelectedTemplate(item);
//         setIsDateSelectorOpen(true);
//     } else {
//         // Standard Clone
//         // 👈 NEW: Pass user._id so the clone gets assigned to this Agent
//         const cloned = cloneItinerary(item.id!, true, user?._id); // true = asQuote
//         if (cloned) {
//              alert(`Template copied to Active Quotes! Please set dates.`);
//              setActiveTab('quotes'); 
//              loadLibraries();
//         }
//     }
//   };



// // --- UPDATED HANDLER: BACKGROUND SAVE (No Redirect) ---
//   const handleConfirmDateSelection = (departure: FixedDeparture) => {
//      if (!selectedTemplate) return;

//      // 1. Clone the Itinerary
//      // 👈 NEW: Pass user._id so the clone gets assigned to this Agent
//      const cloned = cloneItinerary(selectedTemplate.id!, true, user?._id); // true = creates as 'Active Quote'
     
//      if (cloned) {
//          // --- A. CALCULATE DATES LOGIC ---
//          const startDateObj = new Date(departure.date); // e.g., 2026-02-13
         
//          // Helper to format YYYY-MM-DD
//          const toDateStr = (date: Date) => date.toISOString().split('T')[0];

//          // 1. Calculate Routes (Update specific dates for every day)
//          let currentDayDate = new Date(startDateObj);
//          const updatedRoutes = (cloned.routingData?.routes || []).map(route => {
//              const rowDate = toDateStr(currentDayDate);
             
//              // Advance the date counter by the number of nights in this row
//              const nights = parseInt(String(route.nights) || '0');
//              currentDayDate.setDate(currentDayDate.getDate() + nights);
             
//              return {
//                  ...route,
//                  date: rowDate // SAVES "2026-02-13", "2026-02-15" etc. immediately
//              };
//          });

//          // 2. Calculate Final End Date (The date after the last night)
//          // Note: currentDayDate is already advanced to the end of the trip by the loop above
//          const finalEndDate = toDateStr(currentDayDate);

//          // --- B. UPDATE CLONED OBJECT ---
//          cloned.routingData = {
//              startDate: departure.date,
//              endDate: finalEndDate, 
//              routes: updatedRoutes 
//          };
         
//          cloned.useFixedPrice = true; // Enable Fixed Pricing
//          cloned.selectedDepartureId = departure.id;
         
//          // Mark the selected date in the array
//          if(cloned.fixedDepartures) {
//              cloned.fixedDepartures = cloned.fixedDepartures.map(d => ({
//                  ...d,
//                  isSelected: d.id === departure.id
//              }));
//          }

//          // --- C. SAVE TO STORAGE ---
//          const allLibs = getLibrary();
//          const idx = allLibs.findIndex(i => i.id === cloned.id);
//          if(idx !== -1) {
//             allLibs[idx] = cloned;
//             localStorage.setItem('itinerary_library', JSON.stringify(allLibs));
//          }

//          // --- D. UPDATE UI (NO REDIRECT) ---
//          setIsDateSelectorOpen(false); // Close Modal
//          setSelectedTemplate(null);    // Clear Selection
//          setActiveTab('quotes');       // Switch to Quotes Tab
//          loadLibraries();              // Refresh the List to show the new quote
//      }
//   };


//   const handleConfirmTrip = (guestName: string, calculatedPrice: number, pax: number) => {
//       if (!confirmModal.itinerary?.id) return;

//       const success = updateItineraryStatus(confirmModal.itinerary.id, 'confirmed', {
//           leadGuestName: guestName,
//           finalSellPrice: calculatedPrice,
//           numberOfTravelers: pax
//       });

//       if(success) {
//           setConfirmModal({isOpen: false, itinerary: null});
//           loadLibraries(); 
//           router.push('/dashboard/trips'); 
//       } else {
//           alert("Failed to confirm trip.");
//       }
//   };

//   const calculateDuration = (itinerary: StoredItineraryData) => {
//     if (!itinerary.routingData?.routes || itinerary.routingData.routes.length === 0) return 'Duration Not Set';
//     const totalNights = itinerary.routingData.routes.reduce((acc: number, route: any) => acc + (route.nights || 0), 0);
//     return `${totalNights + 1} Days / ${totalNights} Nights`;
//   };


//   // --- ADD THIS NEW HELPER FUNCTION HERE ---
//   const getTripDatesDisplay = (item: StoredItineraryData) => {
//       if (!item.routingData?.startDate) return null;
      
//       const start = new Date(item.routingData.startDate);
//       // Try to find End Date or Calculate it
//       let end = item.routingData.endDate ? new Date(item.routingData.endDate) : null;
      
//       // Fallback calculation if endDate is missing
//       if ((!end || isNaN(end.getTime())) && item.routingData.routes) {
//          const nights = item.routingData.routes.reduce((acc, r) => acc + (r.nights || 0), 0);
//          end = new Date(start);
//          end.setDate(start.getDate() + nights);
//       }

//       const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      
//       if(end && !isNaN(end.getTime())) return `${fmt(start)} - ${fmt(end)}`;
//       return `${fmt(start)}`;
//   };


//   const handleCreateNew = () => {
//     sessionStorage.removeItem('editing_itinerary_id');
//     clearSavedItinerary();
//     router.push('/dashboard/itinerary/create');
//   };

//   const handleEdit = (id: string) => {
//     if (getItineraryById(id)) {
//       sessionStorage.setItem('editing_itinerary_id', id);
//       router.push('/dashboard/itinerary/create');
//     }
//   };

//   const handleDelete = (id: string) => {
//     if (window.confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) { 
//         deleteFromLibrary(id); 
//         loadLibraries(); 
//     }
//   };

//   return (
//     <div className="h-full flex flex-col bg-gray-50">
      
//       {/* HEADER */}
//       <div className="bg-[#0e152a]  px-8 py-3 flex justify-between items-center shadow-sm z-30 relative">
//         <div>
//            <h1 className="text-gray-100 font-extrabold text-xl tracking-tight flex items-center gap-2">
//              <FileText className="text-blue-500" size={22}/> 
//              Library & Quotes
//            </h1>
//            <p className="text-gray-200 text-xs mt-1">Manage Master Templates and Open Client Quotes</p>
//         </div>
        
//         <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
//             <button 
//                 onClick={() => setActiveTab('templates')}
//                 className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'templates' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
//             >
//                 Master Templates
//             </button>
//             <button 
//                 onClick={() => setActiveTab('quotes')}
//                 className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'quotes' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
//             >
//                 Active Quotes
//             </button>
//         </div>
//       </div>

//       <div className="flex flex-1 overflow-hidden relative">
        
//         <div className="absolute inset-0 z-0">
//             <img 
//                 src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" 
//                 alt="Background" 
//                 className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
//         </div>

//         {/* SIDEBAR STATS */}
//          <div className="w-62 bg-[#121b29] backdrop-blur border-r border-white/10 p-6 hidden md:block overflow-y-auto z-10">
           
//            {/* 👈 NEW: Only allow Admins/Employees to Create New from scratch here */}
//            {user?.role !== 'agent' && (
//               <button 
//                  onClick={handleCreateNew}
//                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 mb-8"
//                >
//                  <Plus size={20} /> Create New
//                </button>
//            )}

//             <div className="space-y-4">
//                 <div className="p-4 bg-blue-900/40 rounded-xl border border-blue-500/30">
//                     <p className="text-xs font-bold text-center text-blue-200 uppercase">Total Items</p>
//                     <p className="text-2xl font-bold text-center text-white">{libraries.length}</p>
//                 </div>
//             </div>
//         </div>

//         <div className="flex-1 overflow-y-auto p-8 z-10 relative">
//             {libraries.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-white/50 border-2 border-dashed border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm">
//                     <FileText size={48} className="mb-4 opacity-50"/>
//                     <p className="text-lg font-bold text-white">No {activeTab === 'templates' ? 'Templates' : 'Quotes'} Found</p>
//                     <button onClick={handleCreateNew} className="text-blue-300 font-bold hover:text-blue-200 hover:underline mt-2">Create One Now</button>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {libraries.map((item) => (
//                         <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col overflow-hidden relative">
                            
//                             <div className={`h-2 w-full ${activeTab === 'templates' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                            
//                             {/* 👈 NEW: Hide Trash Can if it is an Agent looking at a Master Template */}
//                             {!(activeTab === 'templates' && user?.role === 'agent') && (
//                                 <button 
//                                     onClick={(e) => { 
//                                         e.stopPropagation(); 
//                                         handleDelete(item.id!); 
//                                     }}
//                                     className="absolute top-4 right-4 p-2 bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full shadow-sm border border-gray-100 transition-all opacity-0 group-hover:opacity-100 z-20"
//                                     title="Delete"
//                                 >
//                                     <Trash2 size={16} />
//                                 </button>
//                             )}

//                             {/* --- REPLACED BADGE LOGIC START --- */}
                            
//                             {/* 1. MASTER TEMPLATE: Shows "12 Series Dates" */}
//                             {activeTab === 'templates' && item.fixedDepartures && item.fixedDepartures.length > 0 && (
//                                 <div className="absolute top-4 right-12 px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase rounded border border-purple-200 shadow-sm">
//                                     {item.fixedDepartures.length} Series Dates
//                                 </div>
//                             )}

//                             {/* 2. ACTIVE QUOTE: Shows "Feb 13 - Feb 19" */}
//                             {activeTab === 'quotes' && item.routingData?.startDate && (
//                                 <div className="absolute top-4 right-12 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded border border-blue-200 shadow-sm flex items-center gap-1">
//                                     <Calendar size={10}/>
//                                     {getTripDatesDisplay(item)}
//                                 </div>
//                             )}
//                             {/* --- REPLACED BADGE LOGIC END --- */}
                        

//                             <div className="p-5 flex-1 flex flex-col">
//                                 <div className="flex justify-between items-start mb-2 pr-8"> 
//                                     <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2" title={item.tripName}>
//                                         {item.tripName}
//                                     </h3>
//                                 </div>
                                
//                                 <div className="space-y-2 mt-2 mb-4">
//                                     <div className="flex items-center gap-2 text-xs text-gray-500">
//                                         <MapPin size={14} className="text-blue-500"/> 
//                                         <span className="truncate max-w-[200px]">{item.selectedCountries?.join(', ') || 'N/A'}</span>
//                                     </div>
//                                     <div className="flex items-center gap-2 text-xs text-gray-500">
//                                         <Clock size={14} className="text-orange-500"/> {calculateDuration(item)}
//                                     </div>
//                                     <div className="flex items-center gap-2 text-xs text-gray-500">
//                                         <User size={14} className="text-purple-500"/> {item.creatingFor}
//                                     </div>
//                                     {activeTab === 'quotes' && !item.routingData?.startDate && (
//                                         <div className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-1 rounded inline-block mt-1">
//                                             ⚠️ Date Missing
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="mt-auto pt-8 border-t border-gray-100 flex gap-2">
                                    
//                                     {/* 👈 NEW: Hide Edit button for Agents on Master Templates */}
//                                     {!(activeTab === 'templates' && user?.role === 'agent') && (
//                                         <button onClick={() => handleEdit(item.id!)} className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1">
//                                             <Edit size={14}/> Edit
//                                         </button>
//                                     )}
                                    
//                                     {/* 👈 NEW: Hide Manage Dates button for Agents completely */}
//                                     {activeTab === 'templates' && user?.role !== 'agent' && (
//                                         <button 
//                                             onClick={(e) => handleOpenManager(item.id!, e)}
//                                             className="w-10 flex items-center justify-center bg-gray-100 hover:bg-purple-50 text-gray-600 hover:text-purple-600 rounded-lg border border-gray-200 transition-colors"
//                                             title="Manage Series Inventory"
//                                         >
//                                             <Calendar size={16}/>
//                                         </button>
//                                     )}

//                                     {activeTab === 'quotes' ? (
//                                         <button 
//                                             onClick={() => setConfirmModal({isOpen: true, itinerary: item})}
//                                             className="flex-1 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-md"
//                                         >
//                                             <CheckCircle size={14}/> Confirm
//                                         </button>
//                                     ) : (
//                                         <button 
//                                             onClick={() => handleUseTemplate(item)} 
//                                             className="flex-1 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1"
//                                         >
//                                             <Copy size={14}/> Use Template
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>

//         {/* MODAL 1: MANAGER */}
//         <FixedDepartureModal 
//            isOpen={isManageDatesOpen}
//            onClose={() => setIsManageDatesOpen(false)}
//            onSave={handleSaveDates}
//            initialData={libraries.find(i => i.id === activeManagerId)?.fixedDepartures || []}
//         />

//         {/* MODAL 2: DATE SELECTOR */}
//         {isDateSelectorOpen && selectedTemplate && (
//            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
//                <div className="bg-white rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 shadow-2xl">
//                    <div className="bg-gray-900 px-5 py-4 border-b border-gray-800 flex justify-between items-center text-white">
//                        <div>
//                            <h3 className="font-bold text-lg">Select Departure Date</h3>
//                            <p className="text-xs text-gray-400">for {selectedTemplate.tripName}</p>
//                        </div>
//                        <button onClick={() => setIsDateSelectorOpen(false)}><X size={20} className="text-gray-400 hover:text-white"/></button>
//                    </div>
                   
//                    <div className="max-h-[60vh] overflow-y-auto p-3 bg-gray-50">
//                        {selectedTemplate.fixedDepartures?.map(dept => {
//                            const isSoldOut = dept.status === 'Sold Out';
//                            return (
//                                <button 
//                                    key={dept.id}
//                                    onClick={() => !isSoldOut && handleConfirmDateSelection(dept)}
//                                    disabled={isSoldOut}
//                                    className={`w-full flex items-center justify-between p-4 mb-2 rounded-xl border transition-all text-left group relative overflow-hidden ${
//                                        isSoldOut
//                                        ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed grayscale' 
//                                        : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5'
//                                    }`}
//                                >
//                                    <div>
//                                        <div className="flex items-center gap-2">
//                                            <span className="font-bold text-gray-800 text-base">
//                                                {new Date(dept.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
//                                            </span>
//                                            {dept.status === 'Filling Fast' && <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Fast Filling</span>}
//                                            {isSoldOut && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Sold Out</span>}
//                                        </div>
//                                        <p className="text-xs text-gray-500 mt-1 font-medium">{dept.label}</p>
//                                    </div>
//                                    <div className="text-right">
//                                        <span className={`block font-extrabold text-lg ${isSoldOut ? 'text-gray-400' : 'text-green-600'}`}>${dept.price}</span>
//                                        <span className="text-[10px] text-gray-400 uppercase font-bold">Per Person</span>
//                                    </div>
//                                </button>
//                            );
//                        })}
                       
//                        {(!selectedTemplate.fixedDepartures || selectedTemplate.fixedDepartures.length === 0) && (
//                            <div className="text-center py-8 text-gray-400 text-sm">No dates available.</div>
//                        )}
//                    </div>
//                </div>
//            </div>
//         )}

//          <ConfirmTripModal 
//             isOpen={confirmModal.isOpen} 
//             onClose={() => setConfirmModal({isOpen: false, itinerary: null})}
//             onConfirm={handleConfirmTrip}
//             itinerary={confirmModal.itinerary}
//         /> 
//     </div>
//   </div>
//   );
// } 































"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Trash2, Edit, Copy, MapPin, Clock, 
  CheckCircle, User, AlertCircle, FileText, ArrowRight, Calendar, Users, X, Bell
} from 'lucide-react';
import { 
  getLibrary, 
  deleteFromLibrary, 
  cloneItinerary, 
  getItineraryById, 
  StoredItineraryData,
  updateItineraryStatus,
  FixedDeparture, 
  saveToLibrary
} from '@/utils/itineraryStorage';
import { useItinerary } from '@/app/context/ItineraryContext';
import { useCurrency } from '@/hooks/useCurrency'; 
import FixedDepartureModal from '@/components/FixedDepartureModal'; 
import { useUser } from '@/app/context/UserContext'; 

// --- HELPERS (Costing Logic Engine) ---
const isItemIncluded = (status?: string) => !status || status.toLowerCase() === 'included';
const safeNum = (val: any) => {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
};

// --- CONFIRMATION MODAL (INTELLIGENT) ---
const ConfirmTripModal = ({ isOpen, onClose, onConfirm, itinerary }: { isOpen: boolean, onClose: () => void, onConfirm: (name: string, price: number, pax: number) => void, itinerary: StoredItineraryData | null }) => {
  const [guestName, setGuestName] = useState('');
  const [paxCount, setPaxCount] = useState<number>(1);
  const { currency, convert } = useCurrency('USD'); 

  useEffect(() => {
    if(isOpen && itinerary) {
        setGuestName(itinerary.leadGuestName || '');
        setPaxCount(safeNum(itinerary.numberOfTravelers) || 1);
    }
  }, [isOpen, itinerary]);

  const pricing = useMemo(() => {
      if (!itinerary) return { total: 0, pp: 0 };

    //   if (itinerary.useFixedPrice && itinerary.fixedDepartures) {
    //       const activeFixed = itinerary.fixedDepartures.find(d => d.isSelected);
    //       if (activeFixed) {
    //           return { total: activeFixed.price * paxCount, pp: activeFixed.price };
    //       }
    //   }


    // 👇 FIX 3: Pulls from 2-Tier structure instead of old flat structure
      if (itinerary.useFixedPrice && itinerary.fixedDepartures && itinerary.selectedDepartureId) {
          let activePrice = 0;
          for (const month of itinerary.fixedDepartures) {
              // Check if a Master Month was selected
              if (month.id === itinerary.selectedDepartureId) {
                  activePrice = month.priceDBL || 0; 
                  break;
              }
              // Check if a Specific Date was selected
              const specificDate = month.departures?.find((d: any) => d.id === itinerary.selectedDepartureId);
              if (specificDate) {
                  activePrice = specificDate.overridePriceDBL ? Number(specificDate.overridePriceDBL) : (month.priceDBL || 0);
                  break;
              }
          }
          if (activePrice > 0) {
              return { total: activePrice * paxCount, pp: activePrice };
          }
      }

      let netTotal = 0;
      const days = itinerary.dayWiseActivities || [];

      days.forEach(day => {
          day.stays?.forEach(s => { if(isItemIncluded(s.inclusionType)) netTotal += safeNum(s.costPerNight) * safeNum(s.numRooms) * safeNum(s.nights); });
          day.transports?.forEach(t => { if(isItemIncluded(t.inclusionType)) netTotal += safeNum(t.price) * safeNum(t.vehicleCount); });
          day.activities?.forEach(a => { if(isItemIncluded(a.inclusionType)) { const guideCost = a.guideType === 'guided' ? safeNum(a.guideFee) : 0; const itemCost = (safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * paxCount; netTotal += itemCost + guideCost; } });
          day.meals?.forEach(m => { if(isItemIncluded(m.inclusionType)) netTotal += safeNum(m.adultCost) * paxCount; });
      });

      const netInCurrency = convert(netTotal, itinerary.selectedCurrency || 'USD'); 
      const markupPercent = itinerary.markupPercentage || 0;
      const markupAmount = netInCurrency * (markupPercent / 100);
      const grandTotal = netInCurrency + markupAmount;
      
      const exactPP = grandTotal / paxCount;

      let finalPP = exactPP;
      const mode = itinerary.roundingMode || 'none';
      if (mode === '5') finalPP = Math.ceil(exactPP / 5) * 5;
      else if (mode === '10') finalPP = Math.ceil(exactPP / 10) * 10;
      else if (mode === '100') finalPP = Math.ceil(exactPP / 100) * 100;

      return { total: finalPP * paxCount, pp: finalPP };

  }, [itinerary, paxCount, convert]);

  const handleConfirm = () => {
    if (!guestName.trim()) { alert('Lead Guest Name is required.'); return; }
    onConfirm(guestName, pricing.total, paxCount);
  };

  if (!isOpen || !itinerary) return null;
  const fmt = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: itinerary.selectedCurrency || 'USD', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 ">
            <div className="bg-[#1e293b] p-4 flex justify-between items-center">
                <h3 className="text-white font-bold flex items-center gap-2"><CheckCircle size={18}/> Confirm Booking</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white"><AlertCircle size={20}/></button>
            </div>
            
            <div className="p-6 space-y-5">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Confirming Trip</p>
                    <p className="text-sm font-bold text-gray-900">{itinerary.tripName}</p>
                    {itinerary.routingData?.startDate ? (
                         <div className="mt-1 flex items-center gap-2 text-xs text-blue-700 font-medium"><Calendar size={12}/> Start: {itinerary.routingData.startDate}</div>
                    ) : (
                        <div className="mt-1 flex items-center gap-2 text-xs text-red-600 font-bold"><AlertCircle size={12}/> Date Not Set</div>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Lead Guest Name <span className="text-red-500">*</span></label>
                        <div className="relative"><User className="absolute left-3 top-2.5 text-gray-400" size={16}/><input type="text" className="w-full pl-9 p-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Mr. John Smith" value={guestName} onChange={(e) => setGuestName(e.target.value)} /></div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Total Travelers (Pax) <span className="text-red-500">*</span></label>
                        <div className="relative"><Users className="absolute left-3 top-2.5 text-gray-400" size={16}/><input type="number" min="1" className="w-full pl-9 p-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" value={paxCount} onChange={(e) => setPaxCount(parseInt(e.target.value) || 1)} /></div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-xl p-4 text-white">
                    <div className="flex justify-between items-center mb-1"><span className="text-xs text-slate-400 uppercase font-bold">Total Group Price</span><span className="text-xl font-bold text-green-400">{fmt(pricing.total)}</span></div>
                    <div className="h-px bg-slate-700 my-2"></div>
                    <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Per Person ({paxCount} Pax)</span><span className="text-sm font-bold">{fmt(pricing.pp)}</span></div>
                </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 text-gray-600 text-sm font-bold hover:bg-gray-200 rounded-lg">Cancel</button>
                <button onClick={handleConfirm} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2">Confirm Booking <ArrowRight size={14}/></button>
            </div>
        </div>
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---
export default function LibraryPage() {
  const router = useRouter();
  const { clearSavedItinerary , loadItineraryForEdit } = useItinerary();
  const { user } = useUser(); 

  // 👇 ADDED 'pending' to activeTab state for Admins
  const [activeTab, setActiveTab] = useState<'templates' | 'quotes' | 'pending'>('templates'); 
  const [libraries, setLibraries] = useState<StoredItineraryData[]>([]);
  const [pendingCount, setPendingCount] = useState(0); // Track pending requests
  const [loading, setLoading] = useState(true);
  
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, itinerary: StoredItineraryData | null}>({isOpen: false, itinerary: null});
  const [isManageDatesOpen, setIsManageDatesOpen] = useState(false);
  const [activeManagerId, setActiveManagerId] = useState<string | null>(null);
  const [isDateSelectorOpen, setIsDateSelectorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<StoredItineraryData | null>(null);

  useEffect(() => {
    loadLibraries();
  }, [activeTab, user]); 

//   const loadLibraries = () => {
//     setLoading(true);
//     const savedLibraries = getLibrary();
    
//     // Calculate global pending count for Admin Badge
//     const pendingReqs = savedLibraries.filter(lib => !lib.isMasterItinerary && (lib.status === 'pending_costing' || lib.status === 'reedit_requested'));
//     setPendingCount(pendingReqs.length);

//     let filtered: StoredItineraryData[] = [];
    
//     if (activeTab === 'templates') {
//         filtered = savedLibraries.filter(lib => lib.isMasterItinerary === true);
//     } 
//     // 👇 NEW ADMIN INBOX TAB: Only shows trips needing pricing approval
//     else if (activeTab === 'pending') {
//         filtered = pendingReqs;
//     } 
//     else { // Active Quotes
//         filtered = savedLibraries.filter(lib => 
//             lib.isMasterItinerary === false && 
//             (lib.bookingStatus === 'quote' || !lib.bookingStatus)
//         );

//         // 👇 THE "DATA WALL" IMPLEMENTATION
//         if (user?.role === 'agent') {
//             // Rule 1: Agents ONLY see trips strictly assigned to their ID
//             filtered = filtered.filter(lib => lib.assignedAgentId === user._id);
//         } else if (user?.role === 'employee') {
//             // Rule 2: Employees ONLY see internal trips (assignedAgentId is empty)
//             filtered = filtered.filter(lib => !lib.assignedAgentId);
//         }
//         // Rule 3: Admin sees everything in active quotes
//     }
    
//     setLibraries(filtered);
//     setLoading(false);
//   };



const loadLibraries = async () => {
    setLoading(true);
    
    // 👇 Await the database call
    const savedLibraries = await getLibrary();
    
    // Calculate global pending count for Admin Badge
    const pendingReqs = savedLibraries.filter(lib => !lib.isMasterItinerary && (lib.status === 'pending_costing' || lib.status === 'reedit_requested'));
    setPendingCount(pendingReqs.length);

    let filtered: StoredItineraryData[] = [];
    
    if (activeTab === 'templates') {
        filtered = savedLibraries.filter(lib => lib.isMasterItinerary === true);
    } 
    else if (activeTab === 'pending') {
        filtered = pendingReqs;
    } 
    else { 
        filtered = savedLibraries.filter(lib => 
            lib.isMasterItinerary === false && 
            (lib.bookingStatus === 'quote' || !lib.bookingStatus)
        );

        if (user?.role === 'agent') {
            filtered = filtered.filter(lib => lib.assignedAgentId === user._id);
        } else if (user?.role === 'employee') {
            filtered = filtered.filter(lib => !lib.assignedAgentId);
        }
    }
    
    setLibraries(filtered);
    setLoading(false);
  };


  const handleOpenManager = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setActiveManagerId(id);
    setIsManageDatesOpen(true);
  };

//   const handleSaveDates = (departures: FixedDeparture[]) => {
//     if (!activeManagerId) return;
//     const master = getItineraryById(activeManagerId);
//     if (master) {
//         master.fixedDepartures = departures;
//         master.isFixedDeparture = departures.length > 0; 
//         const allLibs = getLibrary();
//         const idx = allLibs.findIndex(i => i.id === activeManagerId);
//         if(idx !== -1) { allLibs[idx] = master; localStorage.setItem('itinerary_library', JSON.stringify(allLibs)); }
//         loadLibraries();
//     }
//   };


const handleSaveDates = async (departures: FixedDeparture[]) => {
    if (!activeManagerId) return;
    
    // 👇 Await the DB fetch
    const master = await getItineraryById(activeManagerId);
    
    if (master) {
        master.fixedDepartures = departures;
        master.isFixedDeparture = departures.length > 0; 
        
        // 👇 Save directly to DB and reload
        await saveToLibrary(master); 
        await loadLibraries();
    }
  };


//   const handleUseTemplate = (item: StoredItineraryData) => {
//     if (item.fixedDepartures && item.fixedDepartures.length > 0) {
//         setSelectedTemplate(item);
//         setIsDateSelectorOpen(true);
//     } else {
//         const cloned = cloneItinerary(item.id!, true, user?._id); 
//         if (cloned) {
//              alert(`Template copied to Active Quotes! Please set dates.`);
//              setActiveTab('quotes'); 
//              loadLibraries();
//         }
//     }
//   };



const handleUseTemplate = async (item: StoredItineraryData) => {
    if (item.fixedDepartures && item.fixedDepartures.length > 0) {
        setSelectedTemplate(item);
        setIsDateSelectorOpen(true);
    } else {
        // 👇 Await the clone from the database
        const cloned = await cloneItinerary(item.id!, true, user?._id); 
        if (cloned) {
             alert(`Template copied to Active Quotes! Please set dates.`);
             setActiveTab('quotes'); 
             await loadLibraries();
        }
    }
  };

//   const handleConfirmDateSelection = (departure: FixedDeparture) => {
//      if (!selectedTemplate) return;
//      const cloned = cloneItinerary(selectedTemplate.id!, true, user?._id); 
     
//      if (cloned) {
//          const startDateObj = new Date(departure.date); 
//          const toDateStr = (date: Date) => date.toISOString().split('T')[0];
//          let currentDayDate = new Date(startDateObj);
//          const updatedRoutes = (cloned.routingData?.routes || []).map(route => {
//              const rowDate = toDateStr(currentDayDate);
//              const nights = parseInt(String(route.nights) || '0');
//              currentDayDate.setDate(currentDayDate.getDate() + nights);
//              return { ...route, date: rowDate };
//          });
//          const finalEndDate = toDateStr(currentDayDate);

//          cloned.routingData = { startDate: departure.date, endDate: finalEndDate, routes: updatedRoutes };
//          cloned.useFixedPrice = true; 
//          cloned.selectedDepartureId = departure.id;
//          if(cloned.fixedDepartures) { cloned.fixedDepartures = cloned.fixedDepartures.map(d => ({ ...d, isSelected: d.id === departure.id })); }

//          const allLibs = getLibrary();
//          const idx = allLibs.findIndex(i => i.id === cloned.id);
//          if(idx !== -1) { allLibs[idx] = cloned; localStorage.setItem('itinerary_library', JSON.stringify(allLibs)); }

//          setIsDateSelectorOpen(false); setSelectedTemplate(null); setActiveTab('quotes'); loadLibraries(); 
//      }
//   };


// // 👇 FIX 1: Updated to receive the exact date and specific ID
//   const handleConfirmDateSelection = (exactDate: string, specificDepartureId: string) => {
//      if (!selectedTemplate) return;
//      const cloned = cloneItinerary(selectedTemplate.id!, true, user?._id); 
     
//      if (cloned) {
//          const startDateObj = new Date(exactDate); 
//          const toDateStr = (date: Date) => date.toISOString().split('T')[0];
//          let currentDayDate = new Date(startDateObj);
         
//          const updatedRoutes = (cloned.routingData?.routes || []).map(route => {
//              const rowDate = toDateStr(currentDayDate);
//              const nights = parseInt(String(route.nights) || '0');
//              currentDayDate.setDate(currentDayDate.getDate() + nights);
//              return { ...route, date: rowDate };
//          });
//          const finalEndDate = toDateStr(currentDayDate);

//          cloned.routingData = { startDate: exactDate, endDate: finalEndDate, routes: updatedRoutes };
//          cloned.useFixedPrice = true; 
//          // 👇 Saves the exact ID so Costing Page knows which date was picked
//          cloned.selectedDepartureId = specificDepartureId; 

//          const allLibs = getLibrary();
//          const idx = allLibs.findIndex(i => i.id === cloned.id);
//          if(idx !== -1) { allLibs[idx] = cloned; localStorage.setItem('itinerary_library', JSON.stringify(allLibs)); }

//          setIsDateSelectorOpen(false); setSelectedTemplate(null); setActiveTab('quotes'); loadLibraries(); 
//      }
//   };



// const handleConfirmDateSelection = async (exactDate: string, specificDepartureId: string) => {
//      if (!selectedTemplate) return;
     
//      // 👇 Await clone
//      const cloned = await cloneItinerary(selectedTemplate.id!, true, user?._id); 
     
//      if (cloned) {
//          const startDateObj = new Date(exactDate); 
//          const toDateStr = (date: Date) => date.toISOString().split('T')[0];
//          let currentDayDate = new Date(startDateObj);
         
//          const updatedRoutes = (cloned.routingData?.routes || []).map(route => {
//              const rowDate = toDateStr(currentDayDate);
//              const nights = parseInt(String(route.nights) || '0');
//              currentDayDate.setDate(currentDayDate.getDate() + nights);
//              return { ...route, date: rowDate };
//          });
//          const finalEndDate = toDateStr(currentDayDate);

//          cloned.routingData = { startDate: exactDate, endDate: finalEndDate, routes: updatedRoutes };
//          cloned.useFixedPrice = true; 
//          cloned.selectedDepartureId = specificDepartureId; 

//          // 👇 Save to DB instead of localStorage
//          await saveToLibrary(cloned);

//          setIsDateSelectorOpen(false); 
//          setSelectedTemplate(null); 
//          setActiveTab('quotes'); 
//          await loadLibraries(); 
//      }
//   };



const handleConfirmDateSelection = async (exactDate: string, specificDepartureId: string) => {
     if (!selectedTemplate) return;
     
     try {
         // 1. Await the clone from the fixed backend
         const cloned = await cloneItinerary(selectedTemplate.id!, true, user?._id); 
         
         if (cloned) {
             const startDateObj = new Date(exactDate); 
             const toDateStr = (date: Date) => date.toISOString().split('T')[0];
             let currentDayDate = new Date(startDateObj);
             
             const updatedRoutes = (cloned.routingData?.routes || []).map(route => {
                 const rowDate = toDateStr(currentDayDate);
                 const nights = parseInt(String(route.nights) || '0');
                 currentDayDate.setDate(currentDayDate.getDate() + nights);
                 return { ...route, date: rowDate };
             });
             const finalEndDate = toDateStr(currentDayDate);

             cloned.routingData = { startDate: exactDate, endDate: finalEndDate, routes: updatedRoutes };
             cloned.useFixedPrice = true; 
             cloned.selectedDepartureId = specificDepartureId; 

             // 2. Save the updated dates to DB
             await saveToLibrary(cloned);

             // 3. SUCCESS! Close modal and switch tabs safely
             setIsDateSelectorOpen(false); 
             setSelectedTemplate(null); 
             setActiveTab('quotes'); 
             await loadLibraries(); 
         } else {
             // 👇 If the DB crashes again, it will tell you instead of freezing silently!
             alert("Failed to copy the template. Check terminal for errors.");
         }
     } catch (error) {
         console.error("Error confirming date:", error);
         alert("An unexpected error occurred.");
     }
  };

  

//   const handleConfirmTrip = (guestName: string, calculatedPrice: number, pax: number) => {
//       if (!confirmModal.itinerary?.id) return;
//       const success = updateItineraryStatus(confirmModal.itinerary.id, 'confirmed', { leadGuestName: guestName, finalSellPrice: calculatedPrice, numberOfTravelers: pax });
//       if(success) { setConfirmModal({isOpen: false, itinerary: null}); loadLibraries(); router.push('/dashboard/trips'); } 
//       else { alert("Failed to confirm trip."); }
//   };



const handleConfirmTrip = async (guestName: string, calculatedPrice: number, pax: number) => {
      if (!confirmModal.itinerary?.id) return;
      
      // 👇 Await status update
      const success = await updateItineraryStatus(confirmModal.itinerary.id, 'confirmed', { leadGuestName: guestName, finalSellPrice: calculatedPrice, numberOfTravelers: pax });
      
      if(success) { 
          setConfirmModal({isOpen: false, itinerary: null}); 
          await loadLibraries(); 
          router.push('/dashboard/trips'); 
      } else { 
          alert("Failed to confirm trip."); 
      }
  };


  
  const calculateDuration = (itinerary: StoredItineraryData) => {
    if (!itinerary.routingData?.routes || itinerary.routingData.routes.length === 0) return 'Duration Not Set';
    const totalNights = itinerary.routingData.routes.reduce((acc: number, route: any) => acc + (route.nights || 0), 0);
    return `${totalNights + 1} Days / ${totalNights} Nights`;
  };

  const getTripDatesDisplay = (item: StoredItineraryData) => {
      if (!item.routingData?.startDate) return null;
      const start = new Date(item.routingData.startDate);
      let end = item.routingData.endDate ? new Date(item.routingData.endDate) : null;
      if ((!end || isNaN(end.getTime())) && item.routingData.routes) {
         const nights = item.routingData.routes.reduce((acc, r) => acc + (r.nights || 0), 0);
         end = new Date(start); end.setDate(start.getDate() + nights);
      }
      const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      if(end && !isNaN(end.getTime())) return `${fmt(start)} - ${fmt(end)}`;
      return `${fmt(start)}`;
  };

  const handleCreateNew = () => {
    sessionStorage.removeItem('editing_itinerary_id');
    clearSavedItinerary();
    router.push('/dashboard/itinerary/create');
  };

//   const handleEdit = (id: string) => {
//     if (getItineraryById(id)) {
//       sessionStorage.setItem('editing_itinerary_id', id);
//       router.push('/dashboard/itinerary/create');
//     }
//   };

// const handleEdit = (id: string) => {
//     // 1. DIRECTLY tell the Global Context to load the new data into memory RIGHT NOW.
//     const isLoaded = loadItineraryForEdit(id);
    
//     if (isLoaded) {
//       // 2. Keep the sessionStorage backup just in case the user hits F5 later
//       sessionStorage.setItem('editing_itinerary_id', id);
      
//       // 3. Now route to the page. The Context already has the exact Austria data ready!
//       router.push('/dashboard/itinerary/create');
//     } else {
//       alert("Error: Could not load the itinerary data.");
//     }
//   };


const handleEdit = async (id: string) => {
    // 1. DIRECTLY tell the Global Context to load the new data from MongoDB RIGHT NOW.
    const isLoaded = await loadItineraryForEdit(id);
    
    if (isLoaded) {
      // 2. Keep the sessionStorage backup just in case the user hits F5 later
      sessionStorage.setItem('editing_itinerary_id', id);
      
      // 3. Now route to the page. The Context already has the exact data ready!
      router.push('/dashboard/itinerary/create');
    } else {
      alert("Error: Could not load the itinerary data from the server.");
    }
  };

//   const handleDelete = (id: string) => {
//     if (window.confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) { 
//         deleteFromLibrary(id); 
//         loadLibraries(); 
//     }
//   };


const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) { 
        // 👇 Await deletion and reload
        await deleteFromLibrary(id); 
        await loadLibraries(); 
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      
      {/* HEADER */}
      <div className="bg-[#0e152a]  px-8 py-3 flex justify-between items-center shadow-sm z-30 relative overflow-x-auto">
        <div className="shrink-0 mr-4">
           <h1 className="text-gray-100 font-extrabold text-xl tracking-tight flex items-center gap-2">
             <FileText className="text-blue-500" size={22}/> 
             Library & Quotes
           </h1>
           <p className="text-gray-200 text-xs mt-1">Manage Master Templates and Open Client Quotes</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 shrink-0">
            <button 
                onClick={() => setActiveTab('templates')}
                className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'templates' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Master Templates
            </button>
            <button 
                onClick={() => setActiveTab('quotes')}
                className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'quotes' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Active Quotes
            </button>
            {/* 👇 ADMIN NOTIFICATION INBOX */}
            {user?.role === 'admin' && (
                <button 
                    onClick={() => setActiveTab('pending')}
                    className={`ml-1 px-4 py-2 text-sm font-bold rounded-md transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'bg-red-600 text-white shadow-sm' : 'text-red-500 hover:bg-red-50'}`}
                >
                    <Bell size={14} className={pendingCount > 0 ? "animate-pulse" : ""} />
                    Pending Approvals 
                    {pendingCount > 0 && <span className="bg-white text-red-600 px-1.5 py-0.5 rounded-full text-[10px] ml-1">{pendingCount}</span>}
                </button>
            )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" 
                alt="Background" 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>

        {/* SIDEBAR STATS */}
         <div className="w-62 bg-[#121b29] backdrop-blur border-r border-white/10 p-6 hidden md:block overflow-y-auto z-10">
           {user?.role !== 'agent' && (
              <button 
                 onClick={handleCreateNew}
                 className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 mb-8"
               >
                 <Plus size={20} /> Create New
               </button>
           )}

            <div className="space-y-4">
                <div className="p-4 bg-blue-900/40 rounded-xl border border-blue-500/30">
                    <p className="text-xs font-bold text-center text-blue-200 uppercase">{activeTab.replace('_', ' ')}</p>
                    <p className="text-2xl font-bold text-center text-white">{libraries.length}</p>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 z-10 relative">
            {libraries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/50 border-2 border-dashed border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm">
                    {activeTab === 'pending' ? <Bell size={48} className="mb-4 opacity-50"/> : <FileText size={48} className="mb-4 opacity-50"/>}
                    <p className="text-lg font-bold text-white">No {activeTab.replace('_', ' ')} Found</p>
                    {activeTab === 'templates' && user?.role !== 'agent' && <button onClick={handleCreateNew} className="text-blue-300 font-bold hover:text-blue-200 hover:underline mt-2">Create One Now</button>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {libraries.map((item) => {
                        const isPending = item.status === 'pending_costing' || item.status === 'reedit_requested';
                        const isApproved = item.status === 'approved';

                        return (
                        <div key={item.id} className={`bg-white rounded-xl border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col overflow-hidden relative ${
                            isPending ? 'border-orange-400' : 'border-transparent'
                        }`}>
                            
                            <div className={`h-2 w-full ${activeTab === 'templates' ? 'bg-blue-500' : isPending ? 'bg-orange-500' : 'bg-green-500'}`} />
                            
                            {/* Trash Can */}
                            {!(activeTab === 'templates' && user?.role === 'agent') && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id!); }}
                                    className="absolute top-4 right-4 p-2 bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full shadow-sm border border-gray-100 transition-all opacity-0 group-hover:opacity-100 z-20"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}

                            {/* 1. MASTER TEMPLATE BADGE */}
                            {activeTab === 'templates' && item.fixedDepartures && item.fixedDepartures.length > 0 && (
                                <div className="absolute top-4 right-12 px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase rounded border border-purple-200 shadow-sm">
                                    {item.fixedDepartures.length} Series Dates
                                </div>
                            )}

                            {/* 2. QUOTE / PENDING BADGES */}
                            {(activeTab === 'quotes' || activeTab === 'pending') && (
                                <div className="absolute top-4 right-12 flex flex-col gap-1 items-end">
                                    {item.routingData?.startDate && (
                                        <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded border border-blue-200 shadow-sm flex items-center gap-1">
                                            <Calendar size={10}/> {getTripDatesDisplay(item)}
                                        </div>
                                    )}
                                    {isPending && (
                                        <div className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase rounded border border-orange-200 shadow-sm animate-pulse">
                                            Pricing Requested
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2 pr-8"> 
                                    <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2" title={item.tripName}>
                                        {item.tripName}
                                    </h3>
                                </div>
                                
                                <div className="space-y-2 mt-2 mb-4">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <MapPin size={14} className="text-blue-500"/> 
                                        <span className="truncate max-w-[200px]">{item.selectedCountries?.join(', ') || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Clock size={14} className="text-orange-500"/> {calculateDuration(item)}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold">
                                        <User size={14} className="text-purple-500"/> 
                                        {/* 👇 Shows who owns the quote */}
                                        {item.assignedAgentId ? (
                                            <span className="text-purple-700 bg-purple-50 px-2 rounded border border-purple-100">B2B Agent</span>
                                        ) : (
                                            <span className="text-gray-500">Internal</span>
                                        )}
                                    </div>
                                    {(activeTab === 'quotes' || activeTab === 'pending') && !item.routingData?.startDate && (
                                        <div className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-1 rounded inline-block mt-1">
                                            ⚠️ Date Missing
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                                    
                                    {/* TEMPLATES ACTION BAR */}
                                    {activeTab === 'templates' && (
                                        <>
                                            {user?.role !== 'agent' && (
                                                <button onClick={() => handleEdit(item.id!)} className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1">
                                                    <Edit size={14}/> Edit
                                                </button>
                                            )}
                                            {user?.role !== 'agent' && (
                                                <button onClick={(e) => handleOpenManager(item.id!, e)} className="w-10 flex items-center justify-center bg-gray-100 hover:bg-purple-50 text-gray-600 hover:text-purple-600 rounded-lg border border-gray-200 transition-colors" title="Manage Series Inventory">
                                                    <Calendar size={16}/>
                                                </button>
                                            )}
                                            <button onClick={() => handleUseTemplate(item)} className="flex-1 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1">
                                                <Copy size={14}/> Use Template
                                            </button>
                                        </>
                                    )}

                                    {/* QUOTES ACTION BAR */}
                                    {activeTab === 'quotes' && (
                                        <>
                                            <button onClick={() => handleEdit(item.id!)} className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1">
                                                <Edit size={14}/> {isPending || isApproved ? 'View' : 'Edit'}
                                            </button>
                                            <button 
                                                onClick={() => setConfirmModal({isOpen: true, itinerary: item})}
                                                disabled={isPending}
                                                className={`flex-1 py-2 text-xs font-bold text-white rounded-lg transition-colors flex items-center justify-center gap-1 shadow-md ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                                            >
                                                <CheckCircle size={14}/> Confirm
                                            </button>
                                        </>
                                    )}

                                    {/* PENDING APPROVALS ACTION BAR (ADMIN ONLY) */}
                                    {activeTab === 'pending' && (
                                        <button onClick={() => handleEdit(item.id!)} className="w-full py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
                                            <FileText size={14}/> Review & Price
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* MODAL 1: MANAGER */}
        <FixedDepartureModal 
           isOpen={isManageDatesOpen}
           onClose={() => setIsManageDatesOpen(false)}
           onSave={handleSaveDates}
           initialData={libraries.find(i => i.id === activeManagerId)?.fixedDepartures || []}
        />

        {/* MODAL 2: DATE SELECTOR */}
        {isDateSelectorOpen && selectedTemplate && (
           <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
               <div className="bg-white rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 shadow-2xl">
                   <div className="bg-gray-900 px-5 py-4 border-b border-gray-800 flex justify-between items-center text-white">
                       <div>
                           <h3 className="font-bold text-lg">Select Departure Date</h3>
                           <p className="text-xs text-gray-400">for {selectedTemplate.tripName}</p>
                       </div>
                       <button onClick={() => setIsDateSelectorOpen(false)}><X size={20} className="text-gray-400 hover:text-white"/></button>
                   </div>

                   <div className="max-h-[60vh] overflow-y-auto p-3 bg-gray-50">
                       {/* 👇 FIX 2: Map over Months first, then specific dates */}
                       {selectedTemplate.fixedDepartures?.map(monthBlock => (
                           <div key={monthBlock.id} className="mb-5">
                               {/* Month Header */}
                               <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 bg-blue-100/50 px-3 py-1 rounded">
                                   {monthBlock.month}
                               </h4>
                               
                               {/* Specific Dates inside the Month */}
                               {monthBlock.departures?.map((dateRow: any) => {
                                   const isSoldOut = dateRow.status === 'Sold Out';
                                   // Fallback: If no override price, use the month's base DBL price
                                   const displayPrice = dateRow.overridePriceDBL ? Number(dateRow.overridePriceDBL) : Number(monthBlock.priceDBL || 0);

                                   return (
                                       <button 
                                           key={dateRow.id}
                                           onClick={() => !isSoldOut && handleConfirmDateSelection(dateRow.date, dateRow.id)}
                                           disabled={isSoldOut}
                                           className={`w-full flex items-center justify-between p-4 mb-2 rounded-xl border transition-all text-left group relative overflow-hidden ${
                                               isSoldOut
                                               ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed grayscale' 
                                               : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5'
                                           }`}
                                       >
                                           <div>
                                               <div className="flex items-center gap-2">
                                                   <span className="font-bold text-gray-800 text-base">
                                                       {new Date(dateRow.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                   </span>
                                                   {dateRow.status === 'Limited Seat' && <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Limited Seat</span>}
                                                   {isSoldOut && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Sold Out</span>}
                                               </div>
                                           </div>
                                           <div className="text-right">
                                               <span className={`block font-extrabold text-lg ${isSoldOut ? 'text-gray-400' : 'text-green-600'}`}>${displayPrice}</span>
                                               <span className="text-[10px] text-gray-400 uppercase font-bold">Per Person</span>
                                           </div>
                                       </button>
                                   );
                               })}

                               {(!monthBlock.departures || monthBlock.departures.length === 0) && (
                                   <div className="text-xs text-gray-400 italic px-3">No specific dates available for this month.</div>
                               )}
                           </div>
                       ))}
                       
                       {(!selectedTemplate.fixedDepartures || selectedTemplate.fixedDepartures.length === 0) && (
                           <div className="text-center py-8 text-gray-400 text-sm">No dates available.</div>
                       )}
                   </div>
                   
              
               </div>
           </div>
        )}

         <ConfirmTripModal 
            isOpen={confirmModal.isOpen} 
            onClose={() => setConfirmModal({isOpen: false, itinerary: null})}
            onConfirm={handleConfirmTrip}
            itinerary={confirmModal.itinerary}
        /> 
    </div>
  </div>
  );
}