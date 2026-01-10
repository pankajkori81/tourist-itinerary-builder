
// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   LayoutGrid, List, Plus, Loader2, 
//   Eye, Trash2, Edit, MoreVertical, Copy, MapPin, Clock, Calendar,
//   CheckCircle, User, DollarSign, AlertCircle, FileText
// } from 'lucide-react';
// import { 
//   getLibrary, 
//   deleteFromLibrary, 
//   cloneItinerary, 
//   getItineraryById, 
//   StoredItineraryData,
//   updateItineraryStatus // Import the new helper
// } from '@/utils/itineraryStorage';
// import { useItinerary } from '@/app/context/ItineraryContext';

// // --- CONFIRMATION MODAL COMPONENT ---
// const ConfirmTripModal = ({ isOpen, onClose, onConfirm, itinerary }: any) => {
//   const [guestName, setGuestName] = useState('');
//   const [sellPrice, setSellPrice] = useState<number>(0);
//   const [error, setError] = useState('');

//   // Validate Start Date exists
//   const hasStartDate = !!itinerary?.routingData?.startDate;

//   useEffect(() => {
//     if(isOpen) {
//         setGuestName('');
//         // Attempt to guess price from existing calculation logic logic if available, else 0
//         setSellPrice(0); 
//         setError('');
//     }
//   }, [isOpen]);

//   const handleConfirm = () => {
//     if (!hasStartDate) {
//         setError('Cannot confirm: Start Date is missing in Routing.');
//         return;
//     }
//     if (!guestName.trim()) {
//         setError('Lead Guest Name is required.');
//         return;
//     }
//     if (sellPrice <= 0) {
//         setError('Please enter the Final Sell Price.');
//         return;
//     }
//     onConfirm(guestName, sellPrice);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
//             <div className="bg-[#1e293b] p-4 flex justify-between items-center">
//                 <h3 className="text-white font-bold flex items-center gap-2"><CheckCircle size={18}/> Confirm Trip</h3>
//                 <button onClick={onClose} className="text-gray-400 hover:text-white"><AlertCircle size={20}/></button>
//             </div>
//             <div className="p-6 space-y-4">
//                 <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
//                     <p className="text-xs text-blue-800 font-bold mb-1">TRIP: {itinerary.tripName}</p>
//                     {!hasStartDate ? (
//                         <p className="text-xs text-red-600 font-bold flex items-center gap-1"><AlertCircle size={12}/> Error: No Start Date set in Routing.</p>
//                     ) : (
//                         <p className="text-xs text-green-700 flex items-center gap-1"><Calendar size={12}/> Start Date: {itinerary.routingData.startDate}</p>
//                     )}
//                 </div>

//                 <div>
//                     <label className="block text-xs font-bold text-gray-600 mb-1">Lead Guest Name <span className="text-red-500">*</span></label>
//                     <div className="relative">
//                         <User className="absolute left-3 top-2.5 text-gray-400" size={16}/>
//                         <input 
//                             type="text" 
//                             className="w-full pl-9 p-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
//                             placeholder="e.g. Mr. John Smith"
//                             value={guestName}
//                             onChange={(e) => setGuestName(e.target.value)}
//                         />
//                     </div>
//                 </div>

//                 <div>
//                     <label className="block text-xs font-bold text-gray-600 mb-1">Final Sell Price ({itinerary.selectedCurrency || 'USD'}) <span className="text-red-500">*</span></label>
//                     <div className="relative">
//                         <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={16}/>
//                         <input 
//                             type="number" 
//                             className="w-full pl-9 p-2 border border-gray-300 rounded-lg text-sm font-bold text-green-700 focus:ring-2 focus:ring-green-500 outline-none"
//                             placeholder="0.00"
//                             value={sellPrice}
//                             onChange={(e) => setSellPrice(parseFloat(e.target.value))}
//                         />
//                     </div>
//                 </div>

//                 {error && <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded">{error}</p>}
//             </div>
//             <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
//                 <button onClick={onClose} className="px-4 py-2 text-gray-600 text-sm font-bold hover:bg-gray-200 rounded-lg">Cancel</button>
//                 <button 
//                     onClick={handleConfirm} 
//                     disabled={!hasStartDate}
//                     className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                     Confirm & Move to Trips
//                 </button>
//             </div>
//         </div>
//     </div>
//   );
// };


// export default function LibraryPage() {
//   const router = useRouter();
//   const { clearSavedItinerary } = useItinerary();
//   const [activeTab, setActiveTab] = useState<'templates' | 'quotes'>('templates'); // NEW TAB STATE
//   const [libraries, setLibraries] = useState<StoredItineraryData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, itinerary: any | null}>({isOpen: false, itinerary: null});

//   useEffect(() => {
//     loadLibraries();
//   }, [activeTab]); // Reload when tab changes

//   const loadLibraries = () => {
//     setLoading(true);
//     const savedLibraries = getLibrary();
    
//     let filtered;
//     if (activeTab === 'templates') {
//         // Show Master Templates
//         filtered = savedLibraries.filter(lib => lib.isMasterItinerary === true);
//     } else {
//         // Show Quotes (Not Master, AND Not Confirmed yet)
//         filtered = savedLibraries.filter(lib => 
//             lib.isMasterItinerary === false && 
//             (lib.bookingStatus === 'quote' || !lib.bookingStatus) // Include undefined as legacy drafts
//         );
//     }
    
//     setLibraries(filtered);
//     setLoading(false);
//   };

//   const handleConfirmTrip = (id: string, leadGuest: string, price: number) => {
//       const success = updateItineraryStatus(id, 'confirmed', {
//           leadGuestName: leadGuest,
//           finalSellPrice: price
//       });
      
//       if(success) {
//           setConfirmModal({isOpen: false, itinerary: null});
//           loadLibraries(); // Refresh list (item will disappear from quotes)
//           alert("✅ Trip Confirmed! Moved to Trips Dashboard.");
//       } else {
//           alert("Failed to confirm trip.");
//       }
//   };
  
//   // ... (Keep existing helper functions like calculateDuration, handleEdit, handleClone, handleDelete) ...
//   const calculateDuration = (itinerary: StoredItineraryData) => {
//     if (!itinerary.routingData?.routes || itinerary.routingData.routes.length === 0) return 'Duration Not Set';
//     const totalNights = itinerary.routingData.routes.reduce((acc: number, route: any) => acc + (route.nights || 0), 0);
//     return `${totalNights + 1} Days / ${totalNights} Nights`;
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
//   const handleClone = (id: string) => {
//     const cloned = cloneItinerary(id);
//     if (cloned) { loadLibraries(); alert(`✅ Cloned: ${cloned.tripName}`); }
//   };
//   const handleDelete = (id: string) => {
//     if (confirm('Delete this itinerary?')) { deleteFromLibrary(id); loadLibraries(); }
//   };
//   const handleView = (id: string) => { router.push(`/dashboard/itinerary/preview/${id}`); };


//   return (
//     <div className="h-full flex flex-col bg-gray-50">
//       {/* HEADER */}
//       <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-sm z-20">
//         <div>
//            <h1 className="text-gray-900 font-extrabold text-2xl tracking-tight flex items-center gap-2">
//              <FileText className="text-blue-600" size={24}/> 
//              Library & Quotes
//            </h1>
//            <p className="text-gray-500 text-sm mt-1">Manage Master Templates and Open Client Quotes</p>
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

//       <div className="flex flex-1 overflow-hidden">
        
//         {/* SIDEBAR STATS */}
//         <div className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block overflow-y-auto">
//            <button 
//               onClick={handleCreateNew}
//               className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 mb-8"
//             >
//               <Plus size={20} /> Create New
//             </button>

//             <div className="space-y-4">
//                 <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
//                     <p className="text-xs font-bold text-blue-600 uppercase">Total Items</p>
//                     <p className="text-2xl font-bold text-blue-900">{libraries.length}</p>
//                 </div>
//                 {activeTab === 'quotes' && (
//                     <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
//                         <p className="text-xs font-bold text-orange-600 uppercase">Pending Sales</p>
//                         <p className="text-sm text-orange-800 mt-1">Convert quotes to trips to move them to operations.</p>
//                     </div>
//                 )}
//             </div>
//         </div>

//         {/* MAIN LIST */}
//         <div className="flex-1 overflow-y-auto p-8">
//             {libraries.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
//                     <FileText size={48} className="mb-4 opacity-20"/>
//                     <p className="text-lg font-bold text-gray-500">No {activeTab === 'templates' ? 'Templates' : 'Quotes'} Found</p>
//                     <button onClick={handleCreateNew} className="text-blue-600 font-bold hover:underline mt-2">Create One Now</button>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {libraries.map((item) => (
//                         <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden">
//                             {/* Card Header */}
//                             <div className={`h-2 w-full ${activeTab === 'templates' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                            
//                             <div className="p-5 flex-1 flex flex-col">
//                                 <div className="flex justify-between items-start mb-2">
//                                     <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2" title={item.tripName}>
//                                         {item.tripName}
//                                     </h3>
//                                     {/* Action Dropdown would go here (simplified for brevity, use existing logic) */}
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
//                                 </div>

//                                 <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
//                                     <button onClick={() => handleEdit(item.id!)} className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1">
//                                         <Edit size={14}/> Edit
//                                     </button>
                                    
//                                     {activeTab === 'quotes' ? (
//                                         <button 
//                                             onClick={() => setConfirmModal({isOpen: true, itinerary: item})}
//                                             className="flex-1 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-md"
//                                         >
//                                             <CheckCircle size={14}/> Confirm
//                                         </button>
//                                     ) : (
//                                         <button onClick={() => handleClone(item.id!)} className="flex-1 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1">
//                                             <Copy size={14}/> Clone
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       <ConfirmTripModal 
//         isOpen={confirmModal.isOpen} 
//         onClose={() => setConfirmModal({isOpen: false, itinerary: null})}
//         onConfirm={(guest: string, price: number) => handleConfirmTrip(confirmModal.itinerary.id, guest, price)}
//         itinerary={confirmModal.itinerary}
//       />
//     </div>
//   );
// } 















































































// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   LayoutGrid, List, Plus, Loader2, 
//   Eye, Trash2, Edit, MoreVertical, Copy, MapPin, Clock, Calendar,
//   CheckCircle, User, DollarSign, AlertCircle, FileText, ArrowRight
// } from 'lucide-react';
// import { 
//   getLibrary, 
//   deleteFromLibrary, 
//   cloneItinerary, 
//   getItineraryById, 
//   StoredItineraryData,
//   updateItineraryStatus 
// } from '@/utils/itineraryStorage';
// import { useItinerary } from '@/app/context/ItineraryContext';

// // --- CONFIRMATION MODAL ---
// const ConfirmTripModal = ({ isOpen, onClose, onConfirm, itinerary }: any) => {
//   const [guestName, setGuestName] = useState('');
//   const [sellPrice, setSellPrice] = useState<number>(0);
//   const [error, setError] = useState('');

//   // Use the itinerary's existing travel date if available
//   const hasStartDate = !!itinerary?.routingData?.startDate;

//   useEffect(() => {
//     if(isOpen) {
//         setGuestName('');
//         setSellPrice(0); 
//         setError('');
//     }
//   }, [isOpen]);

//   const handleConfirm = () => {
//     if (!hasStartDate) {
//         setError('Start Date is missing. Please Edit the itinerary to add dates in "Routing" before confirming.');
//         return;
//     }
//     if (!guestName.trim()) {
//         setError('Lead Guest Name is required.');
//         return;
//     }
//     if (sellPrice <= 0) {
//         setError('Please enter the Final Sell Price.');
//         return;
//     }
//     onConfirm(guestName, sellPrice);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
//             <div className="bg-[#1e293b] p-4 flex justify-between items-center">
//                 <h3 className="text-white font-bold flex items-center gap-2"><CheckCircle size={18}/> Confirm Trip</h3>
//                 <button onClick={onClose} className="text-gray-400 hover:text-white"><AlertCircle size={20}/></button>
//             </div>
//             <div className="p-6 space-y-4">
//                 <div className={`p-3 border rounded-lg ${hasStartDate ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'}`}>
//                     <p className="text-xs font-bold mb-1 uppercase tracking-wider text-gray-500">Trip Details</p>
//                     <p className="text-sm font-bold text-gray-800 line-clamp-1">{itinerary.tripName}</p>
                    
//                     {!hasStartDate ? (
//                         <div className="mt-2 text-xs text-red-600 font-bold flex items-center gap-1">
//                              <AlertCircle size={12}/> Missing Start Date
//                         </div>
//                     ) : (
//                         <div className="mt-2 text-xs text-green-700 flex items-center gap-1 font-mono">
//                              <Calendar size={12}/> Start: {itinerary.routingData.startDate}
//                         </div>
//                     )}
//                 </div>

//                 <div>
//                     <label className="block text-xs font-bold text-gray-600 mb-1">Lead Guest Name <span className="text-red-500">*</span></label>
//                     <div className="relative">
//                         <User className="absolute left-3 top-2.5 text-gray-400" size={16}/>
//                         <input 
//                             type="text" 
//                             className="w-full pl-9 p-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
//                             placeholder="e.g. Mr. John Smith"
//                             value={guestName}
//                             onChange={(e) => setGuestName(e.target.value)}
//                         />
//                     </div>
//                 </div>

//                 <div>
//                     <label className="block text-xs font-bold text-gray-600 mb-1">Final Sell Price ({itinerary.selectedCurrency || 'USD'}) <span className="text-red-500">*</span></label>
//                     <div className="relative">
//                         <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={16}/>
//                         <input 
//                             type="number" 
//                             className="w-full pl-9 p-2 border border-gray-300 rounded-lg text-sm font-bold text-green-700 focus:ring-2 focus:ring-green-500 outline-none"
//                             placeholder="0.00"
//                             value={sellPrice}
//                             onChange={(e) => setSellPrice(parseFloat(e.target.value))}
//                         />
//                     </div>
//                 </div>

//                 {error && <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded border border-red-100">{error}</p>}
//             </div>
//             <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
//                 <button onClick={onClose} className="px-4 py-2 text-gray-600 text-sm font-bold hover:bg-gray-200 rounded-lg">Cancel</button>
//                 <button 
//                     onClick={handleConfirm} 
//                     disabled={!hasStartDate} // Block confirmation if no date
//                     className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                     Confirm <ArrowRight size={14}/>
//                 </button>
//             </div>
//         </div>
//     </div>
//   );
// };


// export default function LibraryPage() {
//   const router = useRouter();
//   const { clearSavedItinerary } = useItinerary();
//   const [activeTab, setActiveTab] = useState<'templates' | 'quotes'>('templates'); 
//   const [libraries, setLibraries] = useState<StoredItineraryData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, itinerary: any | null}>({isOpen: false, itinerary: null});

//   useEffect(() => {
//     loadLibraries();
//   }, [activeTab]);

//   const loadLibraries = () => {
//     setLoading(true);
//     const savedLibraries = getLibrary();
    
//     let filtered;
//     if (activeTab === 'templates') {
//         // Show Master Templates
//         filtered = savedLibraries.filter(lib => lib.isMasterItinerary === true);
//     } else {
//         // Show Quotes (Not Master, AND Not Confirmed yet)
//         filtered = savedLibraries.filter(lib => 
//             lib.isMasterItinerary === false && 
//             (lib.bookingStatus === 'quote' || !lib.bookingStatus)
//         );
//     }
    
//     setLibraries(filtered);
//     setLoading(false);
//   };

//   const handleConfirmTrip = (id: string, leadGuest: string, price: number) => {
//       const success = updateItineraryStatus(id, 'confirmed', {
//           leadGuestName: leadGuest,
//           finalSellPrice: price
//       });
      
//       if(success) {
//           setConfirmModal({isOpen: false, itinerary: null});
//           loadLibraries(); 
//           // Optional: redirect to trips
//           router.push('/dashboard/trips');
//       } else {
//           alert("Failed to confirm trip.");
//       }
//   };

//   // Convert Master to Quote
//   const handleUseTemplate = (id: string) => {
//       const cloned = cloneItinerary(id, true); // true = force non-master
//       if (cloned) {
//           alert(`Template copied to Active Quotes! Please set dates.`);
//           setActiveTab('quotes'); // Switch tab to show it
//           loadLibraries();
//       }
//   };

//   const calculateDuration = (itinerary: StoredItineraryData) => {
//     if (!itinerary.routingData?.routes || itinerary.routingData.routes.length === 0) return 'Duration Not Set';
//     const totalNights = itinerary.routingData.routes.reduce((acc: number, route: any) => acc + (route.nights || 0), 0);
//     return `${totalNights + 1} Days / ${totalNights} Nights`;
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
//   const handleClone = (id: string) => {
//     const cloned = cloneItinerary(id);
//     if (cloned) { loadLibraries(); }
//   };
//   const handleDelete = (id: string) => {
//     if (confirm('Delete this itinerary?')) { deleteFromLibrary(id); loadLibraries(); }
//   };
//   const handleView = (id: string) => { router.push(`/dashboard/itinerary/preview/${id}`); };


//   return (
//     <div className="h-full flex flex-col bg-gray-50">
//       {/* HEADER */}
//       <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-sm z-20">
//         <div>
//            <h1 className="text-gray-900 font-extrabold text-2xl tracking-tight flex items-center gap-2">
//              <FileText className="text-blue-600" size={24}/> 
//              Library & Quotes
//            </h1>
//            <p className="text-gray-500 text-sm mt-1">Manage Master Templates and Open Client Quotes</p>
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

//       <div className="flex flex-1 overflow-hidden">
        
//         {/* SIDEBAR STATS */}
//         <div className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block overflow-y-auto">
//            <button 
//               onClick={handleCreateNew}
//               className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 mb-8"
//             >
//               <Plus size={20} /> Create New
//             </button>

//             <div className="space-y-4">
//                 <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
//                     <p className="text-xs font-bold text-blue-600 uppercase">Total Items</p>
//                     <p className="text-2xl font-bold text-blue-900">{libraries.length}</p>
//                 </div>
//                 {activeTab === 'quotes' && (
//                     <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
//                         <p className="text-xs font-bold text-orange-600 uppercase">Pending Sales</p>
//                         <p className="text-sm text-orange-800 mt-1">Convert quotes to trips to move them to operations.</p>
//                     </div>
//                 )}
//                  {activeTab === 'templates' && (
//                     <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
//                         <p className="text-xs font-bold text-purple-600 uppercase">Pro Tip</p>
//                         <p className="text-sm text-purple-800 mt-1">Click "Use Template" to create a quote from a master itinerary.</p>
//                     </div>
//                 )}
//             </div>
//         </div>

//         {/* MAIN LIST */}
//         <div className="flex-1 overflow-y-auto p-8">
//             {libraries.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
//                     <FileText size={48} className="mb-4 opacity-20"/>
//                     <p className="text-lg font-bold text-gray-500">No {activeTab === 'templates' ? 'Templates' : 'Quotes'} Found</p>
//                     <button onClick={handleCreateNew} className="text-blue-600 font-bold hover:underline mt-2">Create One Now</button>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {libraries.map((item) => (
//                         <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden relative">
//                             {/* Card Header */}
//                             <div className={`h-2 w-full ${activeTab === 'templates' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                            
//                             <div className="p-5 flex-1 flex flex-col">
//                                 <div className="flex justify-between items-start mb-2">
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
//                                     {/* Date Warning for Quotes */}
//                                     {activeTab === 'quotes' && !item.routingData?.startDate && (
//                                         <div className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-1 rounded inline-block mt-1">
//                                             ⚠️ Date Missing
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
//                                     <button onClick={() => handleEdit(item.id!)} className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1">
//                                         <Edit size={14}/> Edit
//                                     </button>
                                    
//                                     {activeTab === 'quotes' ? (
//                                         <button 
//                                             onClick={() => setConfirmModal({isOpen: true, itinerary: item})}
//                                             className="flex-1 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-md"
//                                         >
//                                             <CheckCircle size={14}/> Confirm
//                                         </button>
//                                     ) : (
//                                         <button 
//                                             onClick={() => handleUseTemplate(item.id!)} 
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

//         {/* Confirmation Modal */}
//         <ConfirmTripModal 
//             isOpen={confirmModal.isOpen} 
//             onClose={() => setConfirmModal({isOpen: false, itinerary: null})}
//             onConfirm={(guest: string, price: number) => handleConfirmTrip(confirmModal.itinerary.id, guest, price)}
//             itinerary={confirmModal.itinerary}
//         />
//     </div>
//   </div>
//   );
// } 





















































"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Loader2, Trash2, Edit, Copy, MapPin, Clock, 
  CheckCircle, User, DollarSign, AlertCircle, FileText, ArrowRight, Calendar
} from 'lucide-react';
import { 
  getLibrary, 
  deleteFromLibrary, 
  cloneItinerary, 
  getItineraryById, 
  StoredItineraryData,
  updateItineraryStatus 
} from '@/utils/itineraryStorage';
import { useItinerary } from '@/app/context/ItineraryContext';

// --- CONFIRMATION MODAL ---
const ConfirmTripModal = ({ isOpen, onClose, onConfirm, itinerary }: any) => {
  const [guestName, setGuestName] = useState('');
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [error, setError] = useState('');

  const hasStartDate = !!itinerary?.routingData?.startDate;

  useEffect(() => {
    if(isOpen) {
        setGuestName('');
        setSellPrice(0); 
        setError('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!hasStartDate) {
        setError('Start Date is missing. Please Edit the itinerary to add dates in "Routing" before confirming.');
        return;
    }
    if (!guestName.trim()) {
        setError('Lead Guest Name is required.');
        return;
    }
    if (sellPrice <= 0) {
        setError('Please enter the Final Sell Price.');
        return;
    }
    onConfirm(guestName, sellPrice);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#1e293b] p-4 flex justify-between items-center">
                <h3 className="text-white font-bold flex items-center gap-2"><CheckCircle size={18}/> Confirm Trip</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white"><AlertCircle size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
                <div className={`p-3 border rounded-lg ${hasStartDate ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'}`}>
                    <p className="text-xs font-bold mb-1 uppercase tracking-wider text-gray-500">Trip Details</p>
                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{itinerary.tripName}</p>
                    
                    {!hasStartDate ? (
                        <div className="mt-2 text-xs text-red-600 font-bold flex items-center gap-1">
                             <AlertCircle size={12}/> Missing Start Date
                        </div>
                    ) : (
                        <div className="mt-2 text-xs text-green-700 flex items-center gap-1 font-mono">
                             <Calendar size={12}/> Start: {itinerary.routingData.startDate}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Lead Guest Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 text-gray-400" size={16}/>
                        <input 
                            type="text" 
                            className="w-full pl-9 p-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Mr. John Smith"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Final Sell Price ({itinerary.selectedCurrency || 'USD'}) <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={16}/>
                        <input 
                            type="number" 
                            className="w-full pl-9 p-2 border border-gray-300 rounded-lg text-sm font-bold text-green-700 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="0.00"
                            value={sellPrice}
                            onChange={(e) => setSellPrice(parseFloat(e.target.value))}
                        />
                    </div>
                </div>

                {error && <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded border border-red-100">{error}</p>}
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 text-gray-600 text-sm font-bold hover:bg-gray-200 rounded-lg">Cancel</button>
                <button 
                    onClick={handleConfirm} 
                    disabled={!hasStartDate} 
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    Confirm <ArrowRight size={14}/>
                </button>
            </div>
        </div>
    </div>
  );
};


export default function LibraryPage() {
  const router = useRouter();
  const { clearSavedItinerary } = useItinerary();
  const [activeTab, setActiveTab] = useState<'templates' | 'quotes'>('templates'); 
  const [libraries, setLibraries] = useState<StoredItineraryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, itinerary: any | null}>({isOpen: false, itinerary: null});

  useEffect(() => {
    loadLibraries();
  }, [activeTab]);

  const loadLibraries = () => {
    setLoading(true);
    const savedLibraries = getLibrary();
    
    let filtered;
    if (activeTab === 'templates') {
        filtered = savedLibraries.filter(lib => lib.isMasterItinerary === true);
    } else {
        filtered = savedLibraries.filter(lib => 
            lib.isMasterItinerary === false && 
            (lib.bookingStatus === 'quote' || !lib.bookingStatus)
        );
    }
    setLibraries(filtered);
    setLoading(false);
  };

  const handleConfirmTrip = (id: string, leadGuest: string, price: number) => {
      const success = updateItineraryStatus(id, 'confirmed', {
          leadGuestName: leadGuest,
          finalSellPrice: price
      });
      if(success) {
          setConfirmModal({isOpen: false, itinerary: null});
          loadLibraries(); 
          router.push('/dashboard/trips');
      } else {
          alert("Failed to confirm trip.");
      }
  };

  const handleUseTemplate = (id: string) => {
      const cloned = cloneItinerary(id, true); 
      if (cloned) {
          alert(`Template copied to Active Quotes! Please set dates.`);
          setActiveTab('quotes'); 
          loadLibraries();
      }
  };

  const calculateDuration = (itinerary: StoredItineraryData) => {
    if (!itinerary.routingData?.routes || itinerary.routingData.routes.length === 0) return 'Duration Not Set';
    const totalNights = itinerary.routingData.routes.reduce((acc: number, route: any) => acc + (route.nights || 0), 0);
    return `${totalNights + 1} Days / ${totalNights} Nights`;
  };

  const handleCreateNew = () => {
    sessionStorage.removeItem('editing_itinerary_id');
    clearSavedItinerary();
    router.push('/dashboard/itinerary/create');
  };

  const handleEdit = (id: string) => {
    if (getItineraryById(id)) {
      sessionStorage.setItem('editing_itinerary_id', id);
      router.push('/dashboard/itinerary/create');
    }
  };

  // --- DELETE FUNCTION ---
  const handleDelete = (id: string) => {
    // Native confirmation dialog
    if (window.confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) { 
        deleteFromLibrary(id); 
        loadLibraries(); 
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      
      {/* HEADER */}
      <div className="bg-white/95 border-b border-gray-200 px-8 py-3 flex justify-between items-center shadow-sm z-30 relative">
        <div>
           <h1 className="text-gray-900 font-extrabold text-xl tracking-tight flex items-center gap-2">
             <FileText className="text-blue-600" size={22}/> 
             Library & Quotes
           </h1>
           <p className="text-gray-500 text-xs mt-1">Manage Master Templates and Open Client Quotes</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
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
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* --- BACKGROUND IMAGE & OVERLAY --- */}
        <div className="absolute inset-0 z-0">
            {/* You can replace this URL with your preferred travel image */}
            <img 
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" 
                alt="Background" 
                className="w-full h-full object-cover"
            />
            {/* Dim Black + Blur Effect */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>

        {/* SIDEBAR STATS (Left Panel) */}
        <div className="w-62 bg-white/5 backdrop-blur  border-r border-gray-400 p-6 hidden md:block overflow-y-auto z-10">
           <button 
              onClick={handleCreateNew}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 mb-8"
            >
              <Plus size={20} /> Create New
            </button>

            <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs font-bold text-center text-blue-600 uppercase">Total Items</p>
                    <p className="text-2xl font-bold text-center text-blue-900">{libraries.length}</p>
                </div>
                {activeTab === 'quotes' && (
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <p className="text-xs font-bold text-orange-600 uppercase">Pending Sales</p>
                        <p className="text-sm text-orange-800 mt-1">Convert quotes to trips to move them to operations.</p>
                    </div>
                )}
                 {activeTab === 'templates' && (
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <p className="text-xs font-bold text-purple-600 uppercase">Pro Tip:</p>
                        <p className="text-xs text-purple-800 mt-1">Click "Use Template" to create a quote from a master itinerary.</p>
                    </div>
                )}
            </div>
        </div>

        {/* MAIN CONTENT AREA (Cards) */}
        <div className="flex-1 overflow-y-auto p-8 z-10 relative">
            {libraries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/50 border-2 border-dashed border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm">
                    <FileText size={48} className="mb-4 opacity-50"/>
                    <p className="text-lg font-bold text-white">No {activeTab === 'templates' ? 'Templates' : 'Quotes'} Found</p>
                    <button onClick={handleCreateNew} className="text-blue-300 font-bold hover:text-blue-200 hover:underline mt-2">Create One Now</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {libraries.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col overflow-hidden relative">
                            
                            {/* Card Color Strip */}
                            <div className={`h-2 w-full ${activeTab === 'templates' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                            
                            {/* --- DELETE BUTTON (Top Right) --- */}
                            {/* Visible on hover (group-hover:opacity-100) or always visible on touch devices */}
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation(); // Prevent clicking the card background
                                    handleDelete(item.id!); 
                                }}
                                className="absolute top-4 right-4 p-2 bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full shadow-sm border border-gray-100 transition-all opacity-0 group-hover:opacity-100 z-20"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2 pr-8"> 
                                    {/* pr-8 to prevent text overlap with delete button */}
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
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <User size={14} className="text-purple-500"/> {item.creatingFor}
                                    </div>
                                    {/* Date Warning for Quotes */}
                                    {activeTab === 'quotes' && !item.routingData?.startDate && (
                                        <div className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-1 rounded inline-block mt-1">
                                            ⚠️ Date Missing
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                                    <button onClick={() => handleEdit(item.id!)} className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1">
                                        <Edit size={14}/> Edit
                                    </button>
                                    
                                    {activeTab === 'quotes' ? (
                                        <button 
                                            onClick={() => setConfirmModal({isOpen: true, itinerary: item})}
                                            className="flex-1 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-md"
                                        >
                                            <CheckCircle size={14}/> Confirm
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleUseTemplate(item.id!)} 
                                            className="flex-1 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Copy size={14}/> Use Template
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Confirmation Modal */}
        <ConfirmTripModal 
            isOpen={confirmModal.isOpen} 
            onClose={() => setConfirmModal({isOpen: false, itinerary: null})}
            onConfirm={(guest: string, price: number) => handleConfirmTrip(confirmModal.itinerary.id, guest, price)}
            itinerary={confirmModal.itinerary}
        />
    </div>
  </div>
  );
}