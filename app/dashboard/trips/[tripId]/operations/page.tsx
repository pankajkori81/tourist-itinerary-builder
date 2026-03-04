// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { 
//   ArrowLeft, CreditCard, Building2, FileText, 
//   CheckCircle, AlertCircle, Plus 
// } from 'lucide-react';
// import { getItineraryById, StoredItineraryData } from '@/utils/itineraryStorage';

// export default function TripOperationsPage() {
//   const router = useRouter();
//   const params = useParams();
//   const tripId = params.tripId as string;
  
//   const [trip, setTrip] = useState<StoredItineraryData | null>(null);
//   const [activeTab, setActiveTab] = useState<'payments' | 'vendors' | 'docs'>('payments');

//   useEffect(() => {
//     if (tripId) {
//       const data = getItineraryById(tripId);
//       if (data) setTrip(data);
//     }
//   }, [tripId]);

//   if (!trip) return <div className="p-8 text-center">Loading Trip Data...</div>;

//   return (
//     <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
//       {/* --- Header --- */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
//         <div className="flex items-center gap-4">
//           <button 
//             onClick={() => router.back()} 
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <ArrowLeft size={20} className="text-gray-600"/>
//           </button>
//           <div>
//             <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//               Operations Dashboard
//               <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-200">
//                 {trip.bookingStatus?.toUpperCase()}
//               </span>
//             </h1>
//             <p className="text-sm text-gray-500">Managing: {trip.tripName} ({trip.tripId})</p>
//           </div>
//         </div>
//         <div className="text-right">
//            <p className="text-xs font-bold text-gray-500 uppercase">Total Value</p>
//            <p className="text-lg font-bold text-green-700">
//              {new Intl.NumberFormat('en-US', { style: 'currency', currency: trip.selectedCurrency || 'USD' }).format(trip.finalSellPrice || 0)}
//            </p>
//         </div>
//       </div>

//       {/* --- Tabs --- */}
//       <div className="bg-white border-b border-gray-200 px-6 flex gap-6">
//         {[
//           { id: 'payments', label: 'Client Payments', icon: CreditCard },
//           { id: 'vendors', label: 'Vendor Bookings', icon: Building2 },
//           { id: 'docs', label: 'Documents & Vouchers', icon: FileText },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id as any)}
//             className={`flex items-center gap-2 py-3 text-sm font-bold border-b-2 transition-all ${
//               activeTab === tab.id 
//                 ? 'border-indigo-600 text-indigo-600' 
//                 : 'border-transparent text-gray-500 hover:text-gray-800'
//             }`}
//           >
//             <tab.icon size={16} />
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* --- Content Area --- */}
//       <div className="flex-1 overflow-y-auto p-6">
        
//         {/* 1. PAYMENTS TAB */}
//         {activeTab === 'payments' && (
//           <div className="max-w-4xl mx-auto space-y-6">
//             <div className="grid grid-cols-3 gap-4">
//               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs text-gray-500 font-bold uppercase">Total Received</p>
//                 <p className="text-2xl font-bold text-green-600">$0.00</p>
//               </div>
//               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs text-gray-500 font-bold uppercase">Pending Balance</p>
//                 <p className="text-2xl font-bold text-red-500">
//                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: trip.selectedCurrency || 'USD' }).format(trip.finalSellPrice || 0)}
//                 </p>
//               </div>
//               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center">
//                  <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700">
//                     <Plus size={16}/> Record Payment
//                  </button>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
//                     <h3 className="font-bold text-gray-700">Payment History</h3>
//                 </div>
//                 <div className="p-8 text-center text-gray-500 text-sm">
//                     No payments recorded yet.
//                 </div>
//             </div>
//           </div>
//         )}

//         {/* 2. VENDORS TAB */}
//         {activeTab === 'vendors' && (
//           <div className="max-w-5xl mx-auto">
//              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex gap-3">
//                 <AlertCircle className="text-yellow-600 shrink-0" size={20}/>
//                 <p className="text-sm text-yellow-800">
//                     This section tracks which hotels and drivers you have actually booked and paid. 
//                     It connects to your "Costing" data.
//                 </p>
//              </div>
//              {/* Placeholder for Vendor List */}
//              <div className="grid gap-4">
//                 {['Hotel: Grand Hyatt', 'Transport: Toyota Innova', 'Activity: Scuba Diving'].map((item, i) => (
//                     <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
//                         <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
//                                 <Building2 size={18}/>
//                             </div>
//                             <div>
//                                 <p className="font-bold text-gray-800">{item}</p>
//                                 <p className="text-xs text-red-500 font-medium">Payment Pending</p>
//                             </div>
//                         </div>
//                         <button className="text-xs font-bold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">
//                             Manage Booking
//                         </button>
//                     </div>
//                 ))}
//              </div>
//           </div>
//         )}

//         {/* 3. DOCS TAB */}
//         {activeTab === 'docs' && (
//           <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6">
//              <div className="bg-white p-6 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer h-48">
//                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
//                     <FileText size={24}/>
//                  </div>
//                  <h3 className="font-bold text-gray-700">Generate Vouchers</h3>
//                  <p className="text-xs text-gray-500 mt-1">Auto-generate PDF vouchers for hotels</p>
//              </div>
//              <div className="bg-white p-6 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer h-48">
//                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
//                     <CheckCircle size={24}/>
//                  </div>
//                  <h3 className="font-bold text-gray-700">Upload Tickets</h3>
//                  <p className="text-xs text-gray-500 mt-1">Upload flight/train tickets for the client</p>
//              </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// } 






























// "use client";

// import { useState, useEffect, useMemo } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { 
//   ArrowLeft, CreditCard, Building2, FileText, 
//   CheckCircle, AlertCircle, Plus, Calendar, Save, 
//   Download, Loader2, X, AlertTriangle, User
// } from 'lucide-react';
// import { 
//   getItineraryById, 
//   initializeOperations, 
//   saveOperationsData,
//   StoredItineraryData, 
//   OperationsData,
//   VendorBooking
// } from '@/utils/itineraryStorage';
// // Add these imports at the top
// import { getSuppliers, SupplierData } from '@/utils/srmStorage'; // Assuming your SRM logic is here

// // --- SUB-COMPONENTS ---

// // 1. Payment Modal
// const PaymentModal = ({ isOpen, onClose, onSave }: any) => {
//     const [amount, setAmount] = useState('');
//     const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
//     const [mode, setMode] = useState('Bank Transfer');
//     const [refId, setRefId] = useState('');

//     if (!isOpen) return null;

//     const handleSubmit = () => {
//         if(!amount || !refId) return alert("Amount and Reference ID are required");
//         onSave({ 
//             id: Date.now().toString(), 
//             date, 
//             amount: parseFloat(amount), 
//             mode, 
//             referenceId: refId 
//         });
//         // Reset
//         setAmount(''); setRefId(''); onClose();
//     };

//     return (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
//                 <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
//                     <h3 className="font-bold flex items-center gap-2"><CreditCard size={18}/> Record Payment</h3>
//                     <button onClick={onClose}><X size={20}/></button>
//                 </div>
//                 <div className="p-6 space-y-4">
//                     <div>
//                         <label className="block text-xs font-bold text-gray-500 mb-1">Payment Date</label>
//                         <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full p-2 border rounded-lg text-sm font-bold text-gray-700"/>
//                     </div>
//                     <div>
//                         <label className="block text-xs font-bold text-gray-500 mb-1">Amount</label>
//                         <input type="number" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full p-2 border rounded-lg text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500"/>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                              <label className="block text-xs font-bold text-gray-500 mb-1">Mode</label>
//                              <select value={mode} onChange={e=>setMode(e.target.value)} className="w-full p-2 border rounded-lg text-sm">
//                                 {['Bank Transfer','Credit Card','Cash','UPI','Cheque'].map(m=><option key={m} value={m}>{m}</option>)}
//                              </select>
//                         </div>
//                         <div>
//                             <label className="block text-xs font-bold text-gray-500 mb-1">Reference / ID</label>
//                             <input type="text" placeholder="Txn ID" value={refId} onChange={e=>setRefId(e.target.value)} className="w-full p-2 border rounded-lg text-sm"/>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
//                     <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded-lg">Cancel</button>
//                     <button onClick={handleSubmit} className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Record</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- MAIN PAGE ---
// export default function TripOperationsPage() {
//   const router = useRouter();
//   const params = useParams();
//   const tripId = params.tripId as string;
  
//   const [trip, setTrip] = useState<StoredItineraryData | null>(null);
//   const [opsData, setOpsData] = useState<OperationsData | null>(null);
//   const [activeTab, setActiveTab] = useState<'payments' | 'vendors' | 'docs'>('payments');
//   const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
//   // --- 1. LOAD & INITIALIZE ---
//   useEffect(() => {
//     if (tripId) {
//       const rawData = getItineraryById(tripId);
//       // NEW: Load Suppliers for dropdown
//       const allSuppliers = getSuppliers(); 
//       setSuppliers(allSuppliers);
//       if (rawData) {
//           // KEY LOGIC: Initialize if fresh trip
//           const initializedData = initializeOperations(rawData);
//           setTrip(initializedData);
//           setOpsData(initializedData.operations || null);

          
//           // Save the initialized state immediately if it wasn't there
//           if(!rawData.operations) {
//              saveOperationsData(tripId, initializedData.operations);
//           }
//       }
//       setLoading(false);
//     }
//   }, [tripId]);

//   // --- 2. CALCULATIONS ---
//   const financials = useMemo(() => {
//       if(!trip || !opsData) return { total: 0, received: 0, pending: 0, profit: 0 };
      
//       const total = trip.finalSellPrice || 0;
//       const received = opsData.clientPayments.reduce((acc, curr) => acc + curr.amount, 0);
      
//       // Calculate Vendor Spend (Actual Cost takes priority over Estimated)
//       const vendorSpend = opsData.vendorBookings.reduce((acc, curr) => acc + (curr.actualCost > 0 ? curr.actualCost : 0), 0);
      
//       return {
//           total,
//           received,
//           pending: total - received,
//           vendorSpend
//       };
//   }, [trip, opsData]);

//   // --- 3. ACTIONS ---

//   const handleAddPayment = (payment: any) => {
//       if(!opsData) return;
//       const updatedOps = {
//           ...opsData,
//           clientPayments: [...opsData.clientPayments, payment]
//       };
//       setOpsData(updatedOps);
//       saveOperationsData(tripId, updatedOps);
//   };

//   const handleUpdateBooking = (id: string, field: keyof VendorBooking, value: any) => {
//       if(!opsData) return;
//       const updatedBookings = opsData.vendorBookings.map(b => 
//           b.id === id ? { ...b, [field]: value } : b
//       );
//       const updatedOps = { ...opsData, vendorBookings: updatedBookings };
//       setOpsData(updatedOps);
//       saveOperationsData(tripId, updatedOps);
//   };

//   const formatCurrency = (val: number) => {
//       return new Intl.NumberFormat('en-US', { style: 'currency', currency: trip?.selectedCurrency || 'USD' }).format(val);
//   };

//   if (loading || !trip) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>;

//   return (
//     <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      
//       {/* --- Header (UNCHANGED DESIGN) --- */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
//         <div className="flex items-center gap-4">
//           <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//             <ArrowLeft size={20} className="text-gray-600"/>
//           </button>
//           <div>
//             <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//               Operations Dashboard
//               <span className={`text-xs px-2 py-0.5 rounded-full border ${
//                   trip.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' : 
//                   'bg-green-100 text-green-700 border-green-200'
//               }`}>
//                 {trip.bookingStatus?.toUpperCase()}
//               </span>
//             </h1>
//             <p className="text-sm text-gray-500">Managing: {trip.tripName} ({trip.tripId})</p>
//           </div>
//         </div>
//         <div className="text-right">
//            <p className="text-xs font-bold text-gray-500 uppercase">Total Trip Value</p>
//            <p className="text-lg font-bold text-green-700">{formatCurrency(trip.finalSellPrice || 0)}</p>
//         </div>
//       </div>

//       {/* --- Tabs (UNCHANGED DESIGN) --- */}
//       <div className="bg-white border-b border-gray-200 px-6 flex gap-6 shadow-sm z-10">
//         {[
//           { id: 'payments', label: 'Client Payments', icon: CreditCard },
//           { id: 'vendors', label: 'Vendor Bookings', icon: Building2 },
//           { id: 'docs', label: 'Documents & Vouchers', icon: FileText },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id as any)}
//             className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all ${
//               activeTab === tab.id 
//                 ? 'border-indigo-600 text-indigo-600' 
//                 : 'border-transparent text-gray-500 hover:text-gray-800'
//             }`}
//           >
//             <tab.icon size={16} />
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* --- Content Area --- */}
//       <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
        
//         {/* ========================================================= */}
//         {/* TAB 1: CLIENT PAYMENTS (DYNAMIC LOGIC)                    */}
//         {/* ========================================================= */}
//         {activeTab === 'payments' && (
//           <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
//             {/* 1. Summary Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Received</p>
//                 <p className="text-2xl font-bold text-green-600">{formatCurrency(financials.received)}</p>
//                 <div className="w-full bg-gray-100 h-1.5 mt-3 rounded-full overflow-hidden">
//                     <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${Math.min((financials.received / financials.total) * 100, 100)}%` }}></div>
//                 </div>
//               </div>
//               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pending Balance</p>
//                 <p className={`text-2xl font-bold ${financials.pending <= 0 ? 'text-gray-400' : 'text-red-500'}`}>
//                    {formatCurrency(Math.max(financials.pending, 0))}
//                 </p>
//                 {financials.pending <= 0 && <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full mt-1 inline-block">PAID IN FULL</span>}
//               </div>
//               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center">
//                  <button 
//                     onClick={() => setPaymentModalOpen(true)}
//                     className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105"
//                  >
//                     <Plus size={18}/> Record Payment
//                  </button>
//               </div>
//             </div>

//             {/* 2. Ledger List */}
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//                 <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                     <h3 className="font-bold text-gray-700 flex items-center gap-2"><CreditCard size={16}/> Payment History</h3>
//                 </div>
                
//                 {opsData?.clientPayments.length === 0 ? (
//                     <div className="p-12 text-center text-gray-400 text-sm flex flex-col items-center">
//                         <CreditCard size={48} className="mb-3 opacity-20"/>
//                         No payments recorded yet. Click "Record Payment" to start.
//                     </div>
//                 ) : (
//                     <table className="w-full text-sm text-left">
//                         <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs border-b border-gray-200">
//                             <tr>
//                                 <th className="px-6 py-3">Date</th>
//                                 <th className="px-6 py-3">Mode</th>
//                                 <th className="px-6 py-3">Reference ID</th>
//                                 <th className="px-6 py-3 text-right">Amount</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {opsData?.clientPayments.map((pay) => (
//                                 <tr key={pay.id} className="hover:bg-gray-50/50">
//                                     <td className="px-6 py-4 font-medium text-gray-700">{new Date(pay.date).toLocaleDateString()}</td>
//                                     <td className="px-6 py-4">
//                                         <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">{pay.mode}</span>
//                                     </td>
//                                     <td className="px-6 py-4 text-gray-500 font-mono text-xs">{pay.referenceId}</td>
//                                     <td className="px-6 py-4 text-right font-bold text-green-700">{formatCurrency(pay.amount)}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//           </div>
//         )}

//         {/* ========================================================= */}
//         {/* TAB 2: VENDOR BOOKINGS (SMART LOGIC & SPLITTER)           */}
//         {/* =========================================================  */}
//          {activeTab === 'vendors' && (
//           <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
             
     
//              <div className="flex gap-4 mb-6">
//                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex-1 flex gap-3 items-start">
//                     <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={18}/>
//                     <div>
//                         <p className="text-sm font-bold text-yellow-800">Operational Logic</p>
//                         <p className="text-xs text-yellow-700 mt-1">
//                             Use this tab to track actual bookings. Entering a <b>Confirmation Number</b> is required to unlock voucher generation in the next tab.
//                         </p>
//                     </div>
//                  </div>
              
//                  <div className="bg-white border border-gray-200 rounded-xl p-4 w-64 shadow-sm">
//                     <p className="text-xs text-gray-400 font-bold uppercase">Estimated Net Profit</p>
//                     <div className="flex items-end gap-2">
//                          <p className={`text-xl font-bold ${financials.total - (financials.vendorSpend ?? 0) > 0 ? 'text-emerald-600' : 'text-gray-600'}`}>
//                              {formatCurrency(financials.total - (financials.vendorSpend ?? 0))}
//                          </p>
//                     </div>
//                  </div>
//              </div>

//              <div className="space-y-3">
//                 {opsData?.vendorBookings.map((booking) => {
//                     // Logic: Splitter detection visual
//                     const isGuide = booking.category === 'Guide';
                    
//                     return (
//                         <div key={booking.id} className={`bg-white p-4 rounded-xl border shadow-sm transition-all ${
//                             booking.bookingStatus === 'Confirmed' ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-indigo-300'
//                         }`}>
//                             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                
                                
//                                 <div className="flex items-center gap-4 w-full md:w-1/3">
//                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
//                                         isGuide ? 'bg-purple-100 text-purple-600' : 
//                                         booking.category === 'Stay' ? 'bg-indigo-100 text-indigo-600' : 
//                                         'bg-orange-100 text-orange-600'
//                                     }`}>
//                                         {booking.category === 'Stay' && <Building2 size={18}/>}
//                                         {booking.category === 'Transport' && <User size={18}/>} 
//                                         {booking.category === 'Activity' && <Calendar size={18}/>}
//                                         {booking.category === 'Guide' && <User size={18}/>}
//                                     </div>
//                                     <div className="min-w-0">
//                                         <p className="font-bold text-gray-800 truncate" title={booking.name}>{booking.name}</p>
//                                         <div className="flex items-center gap-2 mt-1">
//                                             <span className="text-xs text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded">{booking.category}</span>
//                                             <span className="text-xs text-gray-400">{booking.serviceDate}</span>
//                                         </div>
//                                     </div>
//                                 </div>

                               
//                                 <div className="flex items-center gap-3 w-full md:w-1/3">
//                                     <div className="flex-1">
//                                         <label className="text-[10px] font-bold text-gray-400 uppercase">Actual Cost</label>
//                                         <input 
//                                             type="number" 
//                                             value={booking.actualCost || ''} 
//                                             placeholder={String(booking.estimatedCost)}
//                                             onChange={(e) => handleUpdateBooking(booking.id, 'actualCost', parseFloat(e.target.value))}
//                                             className="w-full text-sm font-bold p-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 bg-white"
//                                         />
//                                     </div>
//                                     <div className="flex-1">
//                                         <label className="text-[10px] font-bold text-gray-400 uppercase">Confirmation Ref #</label>
//                                         <input 
//                                             type="text" 
//                                             value={booking.confirmationNumber || ''} 
//                                             placeholder="Required"
//                                             onChange={(e) => handleUpdateBooking(booking.id, 'confirmationNumber', e.target.value)}
//                                             className={`w-full text-sm font-bold p-1.5 border rounded focus:ring-1 focus:ring-indigo-500 ${
//                                                 !booking.confirmationNumber ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
//                                             }`}
//                                         />
//                                     </div>
//                                 </div>

                            
//                                 <div className="w-full md:w-auto flex justify-end">
//                                      <select 
//                                         value={booking.bookingStatus}
//                                         onChange={(e) => handleUpdateBooking(booking.id, 'bookingStatus', e.target.value)}
//                                         className={`text-xs font-bold px-3 py-2 rounded-lg border cursor-pointer outline-none ${
//                                             booking.bookingStatus === 'Confirmed' 
//                                             ? 'bg-green-600 text-white border-green-600' 
//                                             : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//                                         }`}
//                                      >
//                                         <option value="Pending">Pending</option>
//                                         <option value="Requested">Requested</option>
//                                         <option value="Confirmed">Confirmed</option>
//                                         <option value="Cancelled">Cancelled</option>
//                                      </select>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//              </div>
//           </div>
//         )}


       

//         {/* ========================================================= */}
//         {/* TAB 3: DOCUMENTS (WITH LOGIC GATE)                        */}
//         {/* ========================================================= */}
//         {activeTab === 'docs' && (
//           <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             
//              <h3 className="font-bold text-gray-800 text-lg">Generated Vouchers</h3>
//              <p className="text-sm text-gray-500 -mt-4">Vouchers are available only for items with a Confirmation Number.</p>

//              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                  {opsData?.vendorBookings
//                     .filter(b => b.category === 'Stay' || b.category === 'Activity' || b.category === 'Transport')
//                     .map((booking) => {
//                         const isLocked = !booking.confirmationNumber || booking.bookingStatus !== 'Confirmed';
                        
//                         return (
//                             <div key={booking.id} className={`p-5 rounded-xl border flex items-center justify-between group transition-all ${
//                                 isLocked ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-indigo-100 hover:border-indigo-300 hover:shadow-md'
//                             }`}>
//                                 <div className="flex items-center gap-3 overflow-hidden">
//                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
//                                          isLocked ? 'bg-gray-200 text-gray-400' : 'bg-indigo-50 text-indigo-600'
//                                      }`}>
//                                          {isLocked ? <AlertTriangle size={18}/> : <FileText size={18}/>}
//                                      </div>
//                                      <div className="min-w-0">
//                                          <p className="font-bold text-gray-700 text-sm truncate">{booking.name}</p>
//                                          <p className="text-xs text-gray-400">
//                                             {isLocked ? 'Missing Confirmation #' : `Ref: ${booking.confirmationNumber}`}
//                                          </p>
//                                      </div>
//                                 </div>
                                
//                                 <div className="relative">
//                                     <button 
//                                         disabled={isLocked}
//                                         title={isLocked ? "Enter Confirmation Number in Vendor Tab to Unlock" : "Download PDF"}
//                                         className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
//                                             isLocked 
//                                             ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
//                                             : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:-translate-y-0.5'
//                                         }`}
//                                     >
//                                         {isLocked ? 'Locked' : <><Download size={14}/> Download</>}
//                                     </button>
//                                 </div>
//                             </div>
//                         );
//                  })}
//              </div>

//           </div>
//         )}

//       </div>

//       {/* MODALS */}
//       <PaymentModal 
//          isOpen={isPaymentModalOpen} 
//          onClose={() => setPaymentModalOpen(false)} 
//          onSave={handleAddPayment} 
//       />

//     </div>
//   );
// } 


































// "use client";

// import { useState, useEffect, useMemo } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { 
//   ArrowLeft, CreditCard, Building2, FileText, 
//   CheckCircle, AlertCircle, Plus, Calendar, Save, 
//   Download, Loader2, X, AlertTriangle, User
// } from 'lucide-react';
// import { 
//   getItineraryById, 
//   initializeOperations, 
//   saveOperationsData,
//   StoredItineraryData, 
//   OperationsData,
//   VendorBooking
// } from '@/utils/itineraryStorage';
// import { getSuppliers, SupplierData } from '@/utils/srmStorage';

// // --- SUB-COMPONENT: PAYMENT MODAL ---
// const PaymentModal = ({ isOpen, onClose, onSave }: any) => {
//     const [amount, setAmount] = useState('');
//     const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
//     const [mode, setMode] = useState('Bank Transfer');
//     const [refId, setRefId] = useState('');

//     if (!isOpen) return null;

//     const handleSubmit = () => {
//         if(!amount || !refId) return alert("Amount and Reference ID are required");
//         onSave({ 
//             id: Date.now().toString(), 
//             date, 
//             amount: parseFloat(amount), 
//             mode, 
//             referenceId: refId 
//         });
//         setAmount(''); setRefId(''); onClose();
//     };

//     return (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
//                 <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
//                     <h3 className="font-bold flex items-center gap-2"><CreditCard size={18}/> Record Payment</h3>
//                     <button onClick={onClose}><X size={20}/></button>
//                 </div>
//                 <div className="p-6 space-y-4">
//                     <div>
//                         <label className="block text-xs font-bold text-gray-500 mb-1">Payment Date</label>
//                         <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full p-2 border rounded-lg text-sm font-bold text-gray-700"/>
//                     </div>
//                     <div>
//                         <label className="block text-xs font-bold text-gray-500 mb-1">Amount</label>
//                         <input type="number" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full p-2 border rounded-lg text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500"/>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                              <label className="block text-xs font-bold text-gray-500 mb-1">Mode</label>
//                              <select value={mode} onChange={e=>setMode(e.target.value)} className="w-full p-2 border rounded-lg text-sm">
//                                 {['Bank Transfer','Credit Card','Cash','UPI','Cheque'].map(m=><option key={m} value={m}>{m}</option>)}
//                              </select>
//                         </div>
//                         <div>
//                             <label className="block text-xs font-bold text-gray-500 mb-1">Reference / ID</label>
//                             <input type="text" placeholder="Txn ID" value={refId} onChange={e=>setRefId(e.target.value)} className="w-full p-2 border rounded-lg text-sm"/>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
//                     <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded-lg">Cancel</button>
//                     <button onClick={handleSubmit} className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Record</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- MAIN PAGE ---
// export default function TripOperationsPage() {
//   const router = useRouter();
//   const params = useParams();
//   const tripId = params.tripId as string;
  
//   const [trip, setTrip] = useState<StoredItineraryData | null>(null);
//   const [opsData, setOpsData] = useState<OperationsData | null>(null);
//   const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
//   const [activeTab, setActiveTab] = useState<'payments' | 'vendors' | 'docs'>('payments');
//   const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // --- 1. LOAD DATA ---
//   useEffect(() => {
//     if (tripId) {
//       const rawData = getItineraryById(tripId);
//       if (rawData) {
//           // Initialize Operations Data
//           const initializedData = initializeOperations(rawData);
//           setTrip(initializedData);
//           setOpsData(initializedData.operations || null);
          
//           if(!rawData.operations) {
//              saveOperationsData(tripId, initializedData.operations);
//           }
//       }
//       // Load Suppliers
//       const allSuppliers = getSuppliers();
//       setSuppliers(allSuppliers);
      
//       setLoading(false);
//     }
//   }, [tripId]);

//   // --- 2. CALCULATIONS ---
//   const financials = useMemo(() => {
//       if(!trip || !opsData) return { total: 0, received: 0, pending: 0, vendorSpend: 0 };
      
//       const total = trip.finalSellPrice || 0;
//       const received = opsData.clientPayments.reduce((acc, curr) => acc + curr.amount, 0);
//       const vendorSpend = opsData.vendorBookings.reduce((acc, curr) => acc + (curr.actualCost > 0 ? curr.actualCost : 0), 0);
      
//       return { total, received, pending: total - received, vendorSpend };
//   }, [trip, opsData]);

//   // --- 3. ACTIONS ---
//   const handleAddPayment = (payment: any) => {
//       if(!opsData) return;
//       const updatedOps = {
//           ...opsData,
//           clientPayments: [...opsData.clientPayments, payment]
//       };
//       setOpsData(updatedOps);
//       saveOperationsData(tripId, updatedOps);
//   };

//   const handleUpdateBooking = (id: string, field: keyof VendorBooking, value: any) => {
//       if(!opsData) return;
//       const updatedBookings = opsData.vendorBookings.map(b => 
//           b.id === id ? { ...b, [field]: value } : b
//       );
//       const updatedOps = { ...opsData, vendorBookings: updatedBookings };
//       setOpsData(updatedOps);
//       saveOperationsData(tripId, updatedOps);
//   };

//   const formatCurrency = (val: number) => {
//       return new Intl.NumberFormat('en-US', { style: 'currency', currency: trip?.selectedCurrency || 'USD' }).format(val);
//   };

//   if (loading || !trip) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>;

//   return (
//     <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      
//       {/* HEADER */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
//         <div className="flex items-center gap-4">
//           <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//             <ArrowLeft size={20} className="text-gray-600"/>
//           </button>
//           <div>
//             <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//               Operations Dashboard
//               <span className={`text-xs px-2 py-0.5 rounded-full border ${
//                   trip.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' : 
//                   'bg-green-100 text-green-700 border-green-200'
//               }`}>
//                 {trip.bookingStatus?.toUpperCase()}
//               </span>
//             </h1>
//             <p className="text-sm text-gray-500">Managing: {trip.tripName} ({trip.tripId})</p>
//           </div>
//         </div>
//         <div className="text-right">
//            <p className="text-xs font-bold text-gray-500 uppercase">Total Value</p>
//            <p className="text-lg font-bold text-green-700">{formatCurrency(trip.finalSellPrice || 0)}</p>
//         </div>
//       </div>

//       {/* TABS */}
//       <div className="bg-white border-b border-gray-200 px-6 flex gap-6 shadow-sm z-10">
//         {[
//           { id: 'payments', label: 'Client Payments', icon: CreditCard },
//           { id: 'vendors', label: 'Vendor Bookings', icon: Building2 },
//           { id: 'docs', label: 'Documents & Vouchers', icon: FileText },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id as any)}
//             className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all ${
//               activeTab === tab.id 
//                 ? 'border-indigo-600 text-indigo-600' 
//                 : 'border-transparent text-gray-500 hover:text-gray-800'
//             }`}
//           >
//             <tab.icon size={16} />
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* CONTENT AREA */}
//       <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
        
//         {/* TAB 1: PAYMENTS */}
//         {activeTab === 'payments' && (
//           <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Received</p>
//                 <p className="text-2xl font-bold text-green-600">{formatCurrency(financials.received)}</p>
//                 <div className="w-full bg-gray-100 h-1.5 mt-3 rounded-full overflow-hidden">
//                     <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${Math.min((financials.received / financials.total) * 100, 100)}%` }}></div>
//                 </div>
//               </div>
//               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pending Balance</p>
//                 <p className={`text-2xl font-bold ${financials.pending <= 0 ? 'text-gray-400' : 'text-red-500'}`}>
//                    {formatCurrency(Math.max(financials.pending, 0))}
//                 </p>
//                 {financials.pending <= 0 && <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full mt-1 inline-block">PAID IN FULL</span>}
//               </div>
//               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center">
//                  <button onClick={() => setPaymentModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105">
//                     <Plus size={18}/> Record Payment
//                  </button>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//                 <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                     <h3 className="font-bold text-gray-700 flex items-center gap-2"><CreditCard size={16}/> Payment History</h3>
//                 </div>
//                 {opsData?.clientPayments.length === 0 ? (
//                     <div className="p-12 text-center text-gray-400 text-sm flex flex-col items-center">
//                         <CreditCard size={48} className="mb-3 opacity-20"/> No payments recorded yet.
//                     </div>
//                 ) : (
//                     <table className="w-full text-sm text-left">
//                         <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs border-b border-gray-200">
//                             <tr>
//                                 <th className="px-6 py-3">Date</th>
//                                 <th className="px-6 py-3">Mode</th>
//                                 <th className="px-6 py-3">Reference ID</th>
//                                 <th className="px-6 py-3 text-right">Amount</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {opsData?.clientPayments.map((pay) => (
//                                 <tr key={pay.id} className="hover:bg-gray-50/50">
//                                     <td className="px-6 py-4 font-medium text-gray-700">{new Date(pay.date).toLocaleDateString()}</td>
//                                     <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">{pay.mode}</span></td>
//                                     <td className="px-6 py-4 text-gray-500 font-mono text-xs">{pay.referenceId}</td>
//                                     <td className="px-6 py-4 text-right font-bold text-green-700">{formatCurrency(pay.amount)}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//           </div>
//         )}

//         {/* TAB 2: VENDOR BOOKINGS (UPDATED) */}
//         {activeTab === 'vendors' && (
//           <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
             
//              <div className="flex gap-4 mb-6">
//                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex-1 flex gap-3 items-start">
//                     <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={18}/>
//                     <div>
//                         <p className="text-sm font-bold text-yellow-800">Operational Logic</p>
//                         <p className="text-xs text-yellow-700 mt-1">
//                             Use this tab to track actual bookings. Entering a <b>Confirmation Number</b> is required to unlock voucher generation in the next tab.
//                         </p>
//                     </div>
//                  </div>
//                  <div className="bg-white border border-gray-200 rounded-xl p-4 w-64 shadow-sm">
//                     <p className="text-xs text-gray-400 font-bold uppercase">Estimated Net Profit</p>
//                     <div className="flex items-end gap-2">
//                          <p className={`text-xl font-bold ${financials.total - financials.vendorSpend > 0 ? 'text-emerald-600' : 'text-gray-600'}`}>
//                              {formatCurrency(financials.total - financials.vendorSpend)}
//                          </p>
//                     </div>
//                  </div>
//              </div>

//              <div className="space-y-3">
//                 {opsData?.vendorBookings.map((booking) => {
//                     const isGuide = booking.category === 'Guide';
//                     return (
//                         <div key={booking.id} className={`bg-white p-4 rounded-xl border shadow-sm transition-all ${
//                             booking.bookingStatus === 'Confirmed' ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-indigo-300'
//                         }`}>
//                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3 border-b border-gray-100 pb-3">
//                                 <div className="flex items-center gap-4 w-full md:w-1/3">
//                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
//                                         isGuide ? 'bg-purple-100 text-purple-600' : 
//                                         booking.category === 'Stay' ? 'bg-indigo-100 text-indigo-600' : 
//                                         'bg-orange-100 text-orange-600'
//                                     }`}>
//                                         {booking.category === 'Stay' && <Building2 size={18}/>}
//                                         {booking.category === 'Transport' && <User size={18}/>} 
//                                         {booking.category === 'Activity' && <Calendar size={18}/>}
//                                         {booking.category === 'Guide' && <User size={18}/>}
//                                     </div>
//                                     <div className="min-w-0">
//                                         <p className="font-bold text-gray-800 truncate" title={booking.name}>{booking.name}</p>
//                                         <div className="flex items-center gap-2 mt-1">
//                                             <span className="text-xs text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded">{booking.category}</span>
//                                             <span className="text-xs text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1">
//                                                 <Calendar size={10}/> {booking.serviceDate}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="w-full md:w-2/5">
//                                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Assigned Vendor</label>
//                                      <select 
//                                          value={booking.assignedSupplierId || ''}
//                                          onChange={(e) => handleUpdateBooking(booking.id, 'assignedSupplierId', e.target.value)}
//                                          className="w-full text-xs font-semibold p-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
//                                      >
//                                          <option value="">-- Select Vendor --</option>
//                                          {suppliers.map(s => (
//                                              <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
//                                          ))}
//                                      </select>
//                                 </div>
//                             </div>

//                             <div className="flex flex-col md:flex-row items-center gap-3">
//                                 <div className="flex items-end gap-2 w-full md:w-1/3">
//                                     <div className="flex-1">
//                                         <label className="text-[10px] font-bold text-gray-400 uppercase">Actual Cost</label>
//                                         <input 
//                                             type="number" 
//                                             value={booking.actualCost || ''} 
//                                             placeholder={String(booking.estimatedCost)}
//                                             onChange={(e) => handleUpdateBooking(booking.id, 'actualCost', parseFloat(e.target.value))}
//                                             className="w-full text-sm font-bold p-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 bg-white"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Payment</label>
//                                         <select 
//                                             value={booking.paymentStatus || 'Unpaid'}
//                                             onChange={(e) => handleUpdateBooking(booking.id, 'paymentStatus', e.target.value)}
//                                             className={`text-xs font-bold px-2 py-2 rounded border outline-none ${
//                                                 booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' :
//                                                 booking.paymentStatus === 'Partial' ? 'bg-orange-100 text-orange-700 border-orange-200' :
//                                                 'bg-red-50 text-red-600 border-red-200'
//                                             }`}
//                                         >
//                                             <option value="Unpaid">Unpaid</option>
//                                             <option value="Partial">Partial</option>
//                                             <option value="Paid">Paid</option>
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <div className="flex-1 w-full">
//                                     <label className="text-[10px] font-bold text-gray-400 uppercase">Confirmation Ref #</label>
//                                     <input 
//                                         type="text" 
//                                         value={booking.confirmationNumber || ''} 
//                                         placeholder="Required"
//                                         onChange={(e) => handleUpdateBooking(booking.id, 'confirmationNumber', e.target.value)}
//                                         className={`w-full text-sm font-bold p-1.5 border rounded focus:ring-1 focus:ring-indigo-500 ${
//                                             !booking.confirmationNumber ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
//                                         }`}
//                                     />
//                                 </div>

//                                 <div className="w-full md:w-auto flex justify-end">
//                                      <select 
//                                         value={booking.bookingStatus}
//                                         onChange={(e) => handleUpdateBooking(booking.id, 'bookingStatus', e.target.value)}
//                                         className={`text-xs font-bold px-3 py-2 rounded-lg border cursor-pointer outline-none ${
//                                             booking.bookingStatus === 'Confirmed' 
//                                             ? 'bg-green-600 text-white border-green-600' 
//                                             : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//                                         }`}
//                                      >
//                                         <option value="Pending">Pending</option>
//                                         <option value="Requested">Requested</option>
//                                         <option value="Confirmed">Confirmed</option>
//                                         <option value="Cancelled">Cancelled</option>
//                                      </select>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//              </div>
//           </div>
//         )}

//         {/* TAB 3: DOCUMENTS */}
//         {activeTab === 'docs' && (
//           <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
//              <h3 className="font-bold text-gray-800 text-lg">Generated Vouchers</h3>
//              <p className="text-sm text-gray-500 -mt-4">Vouchers are available only for items with a Confirmation Number.</p>
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                  {opsData?.vendorBookings
//                     .filter(b => b.category === 'Stay' || b.category === 'Activity' || b.category === 'Transport')
//                     .map((booking) => {
//                         const isLocked = !booking.confirmationNumber || booking.bookingStatus !== 'Confirmed';
//                         return (
//                             <div key={booking.id} className={`p-5 rounded-xl border flex items-center justify-between group transition-all ${
//                                 isLocked ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-indigo-100 hover:border-indigo-300 hover:shadow-md'
//                             }`}>
//                                 <div className="flex items-center gap-3 overflow-hidden">
//                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
//                                          isLocked ? 'bg-gray-200 text-gray-400' : 'bg-indigo-50 text-indigo-600'
//                                      }`}>
//                                          {isLocked ? <AlertTriangle size={18}/> : <FileText size={18}/>}
//                                      </div>
//                                      <div className="min-w-0">
//                                          <p className="font-bold text-gray-700 text-sm truncate">{booking.name}</p>
//                                          <p className="text-xs text-gray-400">
//                                             {isLocked ? 'Missing Confirmation #' : `Ref: ${booking.confirmationNumber}`}
//                                          </p>
//                                      </div>
//                                 </div>
//                                 <div className="relative">
//                                     <button 
//                                         disabled={isLocked}
//                                         title={isLocked ? "Enter Confirmation Number in Vendor Tab to Unlock" : "Download PDF"}
//                                         className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
//                                             isLocked 
//                                             ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
//                                             : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:-translate-y-0.5'
//                                         }`}
//                                     >
//                                         {isLocked ? 'Locked' : <><Download size={14}/> Download</>}
//                                     </button>
//                                 </div>
//                             </div>
//                         );
//                  })}
//              </div>
//           </div>
//         )}

//       </div>

//       <PaymentModal 
//          isOpen={isPaymentModalOpen} 
//          onClose={() => setPaymentModalOpen(false)} 
//          onSave={handleAddPayment} 
//       />

//     </div>
//   );
// } 












































// "use client";

// import { useState, useEffect, useMemo } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { 
//   ArrowLeft, CreditCard, Building2, FileText, 
//   CheckCircle, AlertCircle, Plus, Calendar, Save, 
//   Download, Loader2, X, AlertTriangle, User, Briefcase, Mail, Phone
// } from 'lucide-react';
// import { 
//   getItineraryById, 
//   initializeOperations, 
//   saveOperationsData,
//   StoredItineraryData, 
//   OperationsData,
//   VendorBooking
// } from '@/utils/itineraryStorage';
// import { getSuppliers, SupplierData } from '@/utils/srmStorage';

// // --- SUB-COMPONENT: PAYMENT MODAL ---
// const PaymentModal = ({ isOpen, onClose, onSave }: any) => {
//     const [amount, setAmount] = useState('');
//     const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
//     const [mode, setMode] = useState('Bank Transfer');
//     const [refId, setRefId] = useState('');

//     if (!isOpen) return null;

//     const handleSubmit = () => {
//         if(!amount || !refId) return alert("Amount and Reference ID are required");
//         onSave({ 
//             id: Date.now().toString(), 
//             date, 
//             amount: parseFloat(amount), 
//             mode, 
//             referenceId: refId 
//         });
//         setAmount(''); setRefId(''); onClose();
//     };

//     return (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
//                 <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
//                     <h3 className="font-bold flex items-center gap-2"><CreditCard size={18}/> Record Payment</h3>
//                     <button onClick={onClose}><X size={20}/></button>
//                 </div>
//                 <div className="p-6 space-y-4">
//                     <div>
//                         <label className="block text-xs font-bold text-gray-500 mb-1">Payment Date</label>
//                         <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full p-2 border rounded-lg text-sm font-bold text-gray-700"/>
//                     </div>
//                     <div>
//                         <label className="block text-xs font-bold text-gray-500 mb-1">Amount</label>
//                         <input type="number" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full p-2 border rounded-lg text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500"/>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                              <label className="block text-xs font-bold text-gray-500 mb-1">Mode</label>
//                              <select value={mode} onChange={e=>setMode(e.target.value)} className="w-full p-2 border rounded-lg text-sm">
//                                 {['Bank Transfer','Credit Card','Cash','UPI','Cheque'].map(m=><option key={m} value={m}>{m}</option>)}
//                              </select>
//                         </div>
//                         <div>
//                             <label className="block text-xs font-bold text-gray-500 mb-1">Reference / ID</label>
//                             <input type="text" placeholder="Txn ID" value={refId} onChange={e=>setRefId(e.target.value)} className="w-full p-2 border rounded-lg text-sm"/>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
//                     <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded-lg">Cancel</button>
//                     <button onClick={handleSubmit} className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Record</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- MAIN PAGE ---
// export default function TripOperationsPage() {
//   const router = useRouter();
//   const params = useParams();
//   const tripId = params.tripId as string;
  
//   const [trip, setTrip] = useState<StoredItineraryData | null>(null);
//   const [opsData, setOpsData] = useState<OperationsData | null>(null);
//   const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
//   const [activeTab, setActiveTab] = useState<'payments' | 'vendors' | 'docs'>('payments');
//   const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // --- 1. LOAD DATA ---
//   useEffect(() => {
//     if (tripId) {
//       const rawData = getItineraryById(tripId);
//       if (rawData) {
//           // Initialize Operations Data (This now runs the MERGE logic to fix dates)
//           const initializedData = initializeOperations(rawData);
//           setTrip(initializedData);
//           setOpsData(initializedData.operations || null);
          
//           // Force save the merged/fixed data
//           saveOperationsData(tripId, initializedData.operations);
//       }
      
//       const allSuppliers = getSuppliers();
//       setSuppliers(allSuppliers);
      
//       setLoading(false);
//     }
//   }, [tripId]);

//   // --- 2. CALCULATIONS ---
//   const financials = useMemo(() => {
//       if(!trip || !opsData) return { total: 0, received: 0, pending: 0, vendorSpend: 0 };
      
//       const total = trip.finalSellPrice || 0;
//       const received = opsData.clientPayments.reduce((acc, curr) => acc + curr.amount, 0);
//       const vendorSpend = opsData.vendorBookings.reduce((acc, curr) => acc + (curr.actualCost > 0 ? curr.actualCost : 0), 0);
      
//       return { total, received, pending: total - received, vendorSpend };
//   }, [trip, opsData]);

//   // --- 3. ACTIONS ---
//   const handleAddPayment = (payment: any) => {
//       if(!opsData) return;
//       const updatedOps = {
//           ...opsData,
//           clientPayments: [...opsData.clientPayments, payment]
//       };
//       setOpsData(updatedOps);
//       saveOperationsData(tripId, updatedOps);
//   };

//   const handleUpdateBooking = (id: string, field: keyof VendorBooking, value: any) => {
//       if(!opsData) return;
//       const updatedBookings = opsData.vendorBookings.map(b => 
//           b.id === id ? { ...b, [field]: value } : b
//       );
//       const updatedOps = { ...opsData, vendorBookings: updatedBookings };
//       setOpsData(updatedOps);
//       saveOperationsData(tripId, updatedOps);
//   };

//   const formatCurrency = (val: number) => {
//       return new Intl.NumberFormat('en-US', { style: 'currency', currency: trip?.selectedCurrency || 'USD' }).format(val);
//   };

//   // Helper to Format Date for Display
//   const formatServiceDate = (dateStr: string) => {
//       if (!dateStr || dateStr === 'TBA') return 'TBA';
//       const date = new Date(dateStr);
//       return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
//   };

//   if (loading || !trip) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>;

//   return (
//     <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      
//       {/* HEADER */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
//         <div className="flex items-center gap-4">
//           <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//             <ArrowLeft size={20} className="text-gray-600"/>
//           </button>
//           <div>
//             <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//               Operations Dashboard
//               <span className={`text-xs px-2 py-0.5 rounded-full border ${
//                   trip.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' : 
//                   'bg-green-100 text-green-700 border-green-200'
//               }`}>
//                 {trip.bookingStatus?.toUpperCase()}
//               </span>
//             </h1>
//             <p className="text-sm text-gray-500">Managing: {trip.tripName} ({trip.tripId})</p>
//           </div>
//         </div>
//         <div className="text-right">
//            <p className="text-xs font-bold text-gray-500 uppercase">Total Value</p>
//            <p className="text-lg font-bold text-green-700">{formatCurrency(trip.finalSellPrice || 0)}</p>
//         </div>
//       </div>

//       {/* TABS */}
//       <div className="bg-white border-b border-gray-200 px-6 flex gap-6 shadow-sm z-10">
//         {[
//           { id: 'payments', label: 'Client Payments', icon: CreditCard },
//           { id: 'vendors', label: 'Vendor Bookings', icon: Building2 },
//           { id: 'docs', label: 'Documents & Vouchers', icon: FileText },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id as any)}
//             className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all ${
//               activeTab === tab.id 
//                 ? 'border-indigo-600 text-indigo-600' 
//                 : 'border-transparent text-gray-500 hover:text-gray-800'
//             }`}
//           >
//             <tab.icon size={16} />
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* CONTENT AREA */}
//       <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
        
//         {/* TAB 1: PAYMENTS */}
//         {activeTab === 'payments' && (
//           <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Received</p>
//                 <p className="text-2xl font-bold text-green-600">{formatCurrency(financials.received)}</p>
//                 <div className="w-full bg-gray-100 h-1.5 mt-3 rounded-full overflow-hidden">
//                     <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${Math.min((financials.received / financials.total) * 100, 100)}%` }}></div>
//                 </div>
//               </div>
//               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pending Balance</p>
//                 <p className={`text-2xl font-bold ${financials.pending <= 0 ? 'text-gray-400' : 'text-red-500'}`}>
//                    {formatCurrency(Math.max(financials.pending, 0))}
//                 </p>
//                 {financials.pending <= 0 && <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full mt-1 inline-block">PAID IN FULL</span>}
//               </div>
//               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center">
//                  <button onClick={() => setPaymentModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105">
//                     <Plus size={18}/> Record Payment
//                  </button>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//                 <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                     <h3 className="font-bold text-gray-700 flex items-center gap-2"><CreditCard size={16}/> Payment History</h3>
//                 </div>
//                 {opsData?.clientPayments.length === 0 ? (
//                     <div className="p-12 text-center text-gray-400 text-sm flex flex-col items-center">
//                         <CreditCard size={48} className="mb-3 opacity-20"/> No payments recorded yet.
//                     </div>
//                 ) : (
//                     <table className="w-full text-sm text-left">
//                         <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs border-b border-gray-200">
//                             <tr>
//                                 <th className="px-6 py-3">Date</th>
//                                 <th className="px-6 py-3">Mode</th>
//                                 <th className="px-6 py-3">Reference ID</th>
//                                 <th className="px-6 py-3 text-right">Amount</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {opsData?.clientPayments.map((pay) => (
//                                 <tr key={pay.id} className="hover:bg-gray-50/50">
//                                     <td className="px-6 py-4 font-medium text-gray-700">{new Date(pay.date).toLocaleDateString()}</td>
//                                     <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">{pay.mode}</span></td>
//                                     <td className="px-6 py-4 text-gray-500 font-mono text-xs">{pay.referenceId}</td>
//                                     <td className="px-6 py-4 text-right font-bold text-green-700">{formatCurrency(pay.amount)}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//           </div>
//         )}

//         {/* TAB 2: VENDOR BOOKINGS */}
//         {activeTab === 'vendors' && (
//           <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
             
//              <div className="flex gap-4 mb-6">
//                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex-1 flex gap-3 items-start">
//                     <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={18}/>
//                     <div>
//                         <p className="text-sm font-bold text-yellow-800">Operational Logic</p>
//                         <p className="text-xs text-yellow-700 mt-1">
//                             Use this tab to track actual bookings. Entering a <b>Confirmation Number</b> is required to unlock voucher generation in the next tab.
//                         </p>
//                     </div>
//                  </div>
//                  <div className="bg-white border border-gray-200 rounded-xl p-4 w-64 shadow-sm">
//                     <p className="text-xs text-gray-400 font-bold uppercase">Estimated Net Profit</p>
//                     <div className="flex items-end gap-2">
//                          <p className={`text-xl font-bold ${financials.total - financials.vendorSpend > 0 ? 'text-emerald-600' : 'text-gray-600'}`}>
//                              {formatCurrency(financials.total - financials.vendorSpend)}
//                          </p>
//                     </div>
//                  </div>
//              </div>

//              <div className="space-y-3">
//                 {opsData?.vendorBookings.map((booking) => {
//                     const isGuide = booking.category === 'Guide';
//                     return (
//                         <div key={booking.id} className={`bg-white p-4 rounded-xl border shadow-sm transition-all ${
//                             booking.bookingStatus === 'Confirmed' ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-indigo-300'
//                         }`}>
                            
//                             {/* TOP ROW */}
//                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3 border-b border-gray-100 pb-3">
//                                 {/* Left Info */}
//                                 <div className="flex items-center gap-4 w-full md:w-1/3">
//                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
//                                         isGuide ? 'bg-purple-100 text-purple-600' : 
//                                         booking.category === 'Stay' ? 'bg-indigo-100 text-indigo-600' : 
//                                         'bg-orange-100 text-orange-600'
//                                     }`}>
//                                         {booking.category === 'Stay' && <Building2 size={18}/>}
//                                         {booking.category === 'Transport' && <User size={18}/>} 
//                                         {booking.category === 'Activity' && <Calendar size={18}/>}
//                                         {booking.category === 'Guide' && <User size={18}/>}
//                                     </div>
//                                     <div className="min-w-0">
//                                         <p className="font-bold text-gray-800 truncate" title={booking.name}>{booking.name}</p>
//                                         <div className="flex items-center gap-2 mt-1">
//                                             <span className="text-xs text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded">{booking.category}</span>
                                            
//                                             {/* CORRECTED DATE DISPLAY */}
//                                             <span className="text-xs text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1">
//                                                 <Calendar size={10}/> {formatServiceDate(booking.serviceDate)}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Right: Vendor Dropdown */}
//                                 <div className="w-full md:w-2/5">
//                                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Assigned Vendor</label>
//                                      <div className="relative">
//                                         <Briefcase size={12} className="absolute left-2.5 top-3 text-gray-400"/>
//                                         <select 
//                                             value={booking.assignedSupplierId || ''}
//                                             onChange={(e) => handleUpdateBooking(booking.id, 'assignedSupplierId', e.target.value)}
//                                             className="w-full pl-8 p-2 border border-gray-200 rounded-lg text-xs font-semibold bg-gray-50 focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
//                                         >
//                                             <option value="">-- Select Vendor --</option>
//                                             {suppliers.map(s => (
//                                                 <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
//                                             ))}
//                                         </select>
//                                      </div>
//                                 </div>
//                             </div>

//                             {/* BOTTOM ROW */}
//                             <div className="flex flex-col md:flex-row items-center gap-3">
//                                 <div className="flex items-end gap-2 w-full md:w-1/3">
//                                     <div className="flex-1">
//                                         <label className="text-[10px] font-bold text-gray-400 uppercase">Actual Cost</label>
//                                         <input 
//                                             type="number" 
//                                             value={booking.actualCost || ''} 
//                                             placeholder={String(booking.estimatedCost)}
//                                             onChange={(e) => handleUpdateBooking(booking.id, 'actualCost', parseFloat(e.target.value))}
//                                             className="w-full text-sm font-bold p-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 bg-white"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Payment</label>
//                                         <select 
//                                             value={booking.paymentStatus || 'Unpaid'}
//                                             onChange={(e) => handleUpdateBooking(booking.id, 'paymentStatus', e.target.value)}
//                                             className={`text-xs font-bold px-2 py-2 rounded border outline-none ${
//                                                 booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' :
//                                                 booking.paymentStatus === 'Partial' ? 'bg-orange-100 text-orange-700 border-orange-200' :
//                                                 'bg-red-50 text-red-600 border-red-200'
//                                             }`}
//                                         >
//                                             <option value="Unpaid">Unpaid</option>
//                                             <option value="Partial">Partial</option>
//                                             <option value="Paid">Paid</option>
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <div className="flex-1 w-full">
//                                     <label className="text-[10px] font-bold text-gray-400 uppercase">Confirmation Ref #</label>
//                                     <input 
//                                         type="text" 
//                                         value={booking.confirmationNumber || ''} 
//                                         placeholder="Required for Voucher"
//                                         onChange={(e) => handleUpdateBooking(booking.id, 'confirmationNumber', e.target.value)}
//                                         className={`w-full text-sm font-bold p-1.5 border rounded focus:ring-1 focus:ring-indigo-500 ${
//                                             !booking.confirmationNumber ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
//                                         }`}
//                                     />
//                                 </div>

//                                 <div className="w-full md:w-auto flex justify-end">
//                                      <select 
//                                         value={booking.bookingStatus}
//                                         onChange={(e) => handleUpdateBooking(booking.id, 'bookingStatus', e.target.value)}
//                                         className={`text-xs font-bold px-3 py-2 rounded-lg border cursor-pointer outline-none ${
//                                             booking.bookingStatus === 'Confirmed' 
//                                             ? 'bg-green-600 text-white border-green-600' 
//                                             : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//                                         }`}
//                                      >
//                                         <option value="Pending">Pending</option>
//                                         <option value="Requested">Requested</option>
//                                         <option value="Confirmed">Confirmed</option>
//                                         <option value="Cancelled">Cancelled</option>
//                                      </select>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//              </div>
//           </div>
//         )}

//         {/* TAB 3: DOCUMENTS */}
//         {activeTab === 'docs' && (
//           <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
//              <h3 className="font-bold text-gray-800 text-lg">Generated Vouchers</h3>
//              <p className="text-sm text-gray-500 -mt-4">Vouchers are available only for items with a Confirmation Number.</p>
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                  {opsData?.vendorBookings
//                     .filter(b => b.category === 'Stay' || b.category === 'Activity' || b.category === 'Transport')
//                     .map((booking) => {
//                         const isLocked = !booking.confirmationNumber || booking.bookingStatus !== 'Confirmed';
//                         return (
//                             <div key={booking.id} className={`p-5 rounded-xl border flex items-center justify-between group transition-all ${
//                                 isLocked ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-indigo-100 hover:border-indigo-300 hover:shadow-md'
//                             }`}>
//                                 <div className="flex items-center gap-3 overflow-hidden">
//                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
//                                          isLocked ? 'bg-gray-200 text-gray-400' : 'bg-indigo-50 text-indigo-600'
//                                      }`}>
//                                          {isLocked ? <AlertTriangle size={18}/> : <FileText size={18}/>}
//                                      </div>
//                                      <div className="min-w-0">
//                                          <p className="font-bold text-gray-700 text-sm truncate">{booking.name}</p>
//                                          <p className="text-xs text-gray-400">
//                                             {isLocked ? 'Missing Confirmation #' : `Ref: ${booking.confirmationNumber}`}
//                                          </p>
//                                      </div>
//                                 </div>
//                                 <div className="relative">
//                                     <button 
//                                         disabled={isLocked}
//                                         title={isLocked ? "Enter Confirmation Number in Vendor Tab to Unlock" : "Download PDF"}
//                                         className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
//                                             isLocked 
//                                             ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
//                                             : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:-translate-y-0.5'
//                                         }`}
//                                     >
//                                         {isLocked ? 'Locked' : <><Download size={14}/> Download</>}
//                                     </button>
//                                 </div>
//                             </div>
//                         );
//                  })}
//              </div>
//           </div>
//         )}

//       </div>

//       <PaymentModal 
//          isOpen={isPaymentModalOpen} 
//          onClose={() => setPaymentModalOpen(false)} 
//          onSave={handleAddPayment} 
//       />

//     </div>
//   );
// } 
























// "use client";

// import { useState, useEffect, useMemo } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { 
//   ArrowLeft, CreditCard, Building2, FileText, 
//   CheckCircle, AlertCircle, Plus, Calendar, Save, 
//   Download, Loader2, X, AlertTriangle, User, Briefcase, Mail, Phone,
//   Pencil, Trash2
// } from 'lucide-react';
// import { 
//   getItineraryById, 
//   initializeOperations, 
//   saveOperationsData,
//   StoredItineraryData, 
//   OperationsData,
//   VendorBooking,
//   ClientPayment
// } from '@/utils/itineraryStorage';
// import { getSuppliers, SupplierData } from '@/utils/srmStorage';

// // --- SUB-COMPONENT: SMART PAYMENT MODAL ---
// interface PaymentModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave: (data: ClientPayment) => void;
//     editingPayment?: ClientPayment | null;
//     currentBalance: number; // Needed for the warning logic
// }

// const PaymentModal = ({ isOpen, onClose, onSave, editingPayment, currentBalance }: PaymentModalProps) => {
//     const [amount, setAmount] = useState('');
//     const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
//     const [mode, setMode] = useState('Bank Transfer');
//     const [status, setStatus] = useState<'Cleared' | 'Pending'>('Cleared');
//     const [refId, setRefId] = useState('');
//     const [note, setNote] = useState('');

//     // Load data when editing
//     useEffect(() => {
//         if (editingPayment) {
//             setAmount(String(editingPayment.amount));
//             setDate(editingPayment.date);
//             setMode(editingPayment.mode);
//             setStatus(editingPayment.status || 'Cleared');
//             setRefId(editingPayment.referenceId);
//             setNote(editingPayment.note || '');
//         } else {
//             // Reset for new entry
//             setAmount('');
//             setDate(new Date().toISOString().split('T')[0]);
//             setMode('Bank Transfer');
//             setStatus('Cleared');
//             setRefId('');
//             setNote('');
//         }
//     }, [editingPayment, isOpen]);

//     if (!isOpen) return null;

//     // Logic: Warning Calculation
//     // If editing, we add back the old amount to the balance before comparing
//     const effectiveBalance = editingPayment ? (currentBalance + editingPayment.amount) : currentBalance;
//     const isOverpayment = parseFloat(amount || '0') > effectiveBalance;

//     const handleSubmit = () => {
//         if (!amount || !refId) return alert("Amount and Reference ID are required");
        
//         onSave({ 
//             id: editingPayment ? editingPayment.id : Date.now().toString(), // Keep ID if editing
//             date, 
//             amount: parseFloat(amount), 
//             mode: mode as any,
//             status,
//             referenceId: refId,
//             note
//         });
//         onClose();
//     };

//     return (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
//                 <div className="bg-gray-900 p-4 text-white flex justify-between items-center">
//                     <h3 className="font-bold flex items-center gap-2">
//                         <CreditCard size={18} className="text-green-400"/> 
//                         {editingPayment ? 'Edit Payment Record' : 'Record New Payment'}
//                     </h3>
//                     <button onClick={onClose} className="hover:bg-white/20 p-1 rounded"><X size={20}/></button>
//                 </div>
                
//                 <div className="p-6 space-y-5">
//                     {/* OVERPAYMENT WARNING BANNER */}
//                     {isOverpayment && (
//                         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded flex items-start gap-3">
//                             <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={18}/>
//                             <div className="text-xs text-yellow-800">
//                                 <span className="font-bold block">Overpayment Warning</span>
//                                 This amount (${parseFloat(amount).toLocaleString()}) exceeds the pending balance (${effectiveBalance.toLocaleString()}). 
//                                 This will create a credit on the account.
//                             </div>
//                         </div>
//                     )}

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-xs font-bold text-gray-500 mb-1">Amount ($)</label>
//                             <input 
//                                 type="number" 
//                                 placeholder="0.00" 
//                                 value={amount} 
//                                 onChange={e=>setAmount(e.target.value)} 
//                                 className="w-full p-2.5 border border-gray-300 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-xs font-bold text-gray-500 mb-1">Payment Date</label>
//                             <input 
//                                 type="date" 
//                                 value={date} 
//                                 onChange={e=>setDate(e.target.value)} 
//                                 className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                              <label className="block text-xs font-bold text-gray-500 mb-1">Payment Mode</label>
//                              <select value={mode} onChange={e=>setMode(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white">
//                                 {['Bank Transfer','Credit Card','Cash','UPI','Cheque'].map(m=><option key={m} value={m}>{m}</option>)}
//                              </select>
//                         </div>
//                         <div>
//                             <label className="block text-xs font-bold text-gray-500 mb-1">Transaction Status</label>
//                             <div className="flex bg-gray-100 p-1 rounded-lg">
//                                 <button 
//                                     onClick={() => setStatus('Cleared')}
//                                     className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${status === 'Cleared' ? 'bg-green-500 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
//                                 >Cleared</button>
//                                 <button 
//                                     onClick={() => setStatus('Pending')}
//                                     className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${status === 'Pending' ? 'bg-orange-400 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
//                                 >Pending</button>
//                             </div>
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-xs font-bold text-gray-500 mb-1">Reference ID / Cheque No.</label>
//                         <input type="text" placeholder="e.g. TXN-889922" value={refId} onChange={e=>setRefId(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500 outline-none"/>
//                     </div>

//                     <div>
//                         <label className="block text-xs font-bold text-gray-500 mb-1">Notes (Optional)</label>
//                         <textarea 
//                             rows={2}
//                             placeholder="e.g. Received from Wells Fargo account ending in 1234" 
//                             value={note} 
//                             onChange={e=>setNote(e.target.value)} 
//                             className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-green-500 outline-none"
//                         />
//                     </div>
//                 </div>

//                 <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
//                     <button onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
//                     <button onClick={handleSubmit} className="px-6 py-2.5 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-black shadow-lg transition-all flex items-center gap-2">
//                         <Save size={14}/> {editingPayment ? 'Update Payment' : 'Save Record'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- MAIN PAGE ---
// export default function TripOperationsPage() {
//   const router = useRouter();
//   const params = useParams();
//   const tripId = params.tripId as string;
  
//   const [trip, setTrip] = useState<StoredItineraryData | null>(null);
//   const [opsData, setOpsData] = useState<OperationsData | null>(null);
//   const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
//   const [activeTab, setActiveTab] = useState<'payments' | 'vendors' | 'docs'>('payments');
  
//   // Modal State
//   const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
//   const [editingPayment, setEditingPayment] = useState<ClientPayment | null>(null);
  
//   const [loading, setLoading] = useState(true);

//   // --- 1. LOAD DATA ---
//   useEffect(() => {
//     if (tripId) {
//       const rawData = getItineraryById(tripId);
//       if (rawData) {
//           const initializedData = initializeOperations(rawData);
//           setTrip(initializedData);
//           setOpsData(initializedData.operations || null);
//           if(!rawData.operations) {
//              saveOperationsData(tripId, initializedData.operations);
//           }
//       }
//       const allSuppliers = getSuppliers();
//       setSuppliers(allSuppliers);
//       setLoading(false);
//     }
//   }, [tripId]);

//   // --- 2. SMART FINANCIAL CALCULATIONS ---
//   const financials = useMemo(() => {
//       if(!trip || !opsData) return { total: 0, receivedCleared: 0, receivedPending: 0, balance: 0, status: 'Unpaid', vendorSpend: 0 };
      
//       const total = trip.finalSellPrice || 0;
      
//       // Separate Cleared vs Pending
//       const receivedCleared = opsData.clientPayments
//         .filter(p => p.status === 'Cleared')
//         .reduce((acc, curr) => acc + curr.amount, 0);
        
//       const receivedPending = opsData.clientPayments
//         .filter(p => p.status === 'Pending')
//         .reduce((acc, curr) => acc + curr.amount, 0);
      
//       const balance = total - receivedCleared;
      
//       // Calculate Vendor Spend
//       const vendorSpend = opsData.vendorBookings.reduce((acc, curr) => acc + (curr.actualCost > 0 ? curr.actualCost : 0), 0);
      
//       let status = 'Unpaid';
//       if (balance <= 0) status = 'Paid';
//       else if (receivedCleared > 0) status = 'Partial';

//       return { total, receivedCleared, receivedPending, balance, status, vendorSpend };
//   }, [trip, opsData]);

//   // --- 3. ACTIONS ---
  
//   // SAVE (Create or Update)
//   const handleSavePayment = (payment: ClientPayment) => {
//       if(!opsData) return;
      
//       let updatedPayments = [...opsData.clientPayments];
//       const existingIndex = updatedPayments.findIndex(p => p.id === payment.id);

//       if (existingIndex >= 0) {
//           // Update existing
//           updatedPayments[existingIndex] = payment;
//       } else {
//           // Create new
//           updatedPayments.push(payment);
//       }

//       const updatedOps = { ...opsData, clientPayments: updatedPayments };
//       setOpsData(updatedOps);
//       saveOperationsData(tripId, updatedOps);
//   };

//   // DELETE
//   const handleDeletePayment = (id: string) => {
//       if(!confirm("Are you sure you want to permanently delete this payment record?")) return;
      
//       if(!opsData) return;
//       const updatedPayments = opsData.clientPayments.filter(p => p.id !== id);
//       const updatedOps = { ...opsData, clientPayments: updatedPayments };
      
//       setOpsData(updatedOps);
//       saveOperationsData(tripId, updatedOps);
//   };

//   // OPEN MODAL FOR EDIT
//   const openEditModal = (payment: ClientPayment) => {
//       setEditingPayment(payment);
//       setPaymentModalOpen(true);
//   };

//   // OPEN MODAL FOR NEW
//   const openNewModal = () => {
//       setEditingPayment(null);
//       setPaymentModalOpen(true);
//   };

//   // Generic Update for Vendors (unchanged)
//   const handleUpdateBooking = (id: string, field: keyof VendorBooking, value: any) => {
//       if(!opsData) return;
//       const updatedBookings = opsData.vendorBookings.map(b => 
//           b.id === id ? { ...b, [field]: value } : b
//       );
//       const updatedOps = { ...opsData, vendorBookings: updatedBookings };
//       setOpsData(updatedOps);
//       saveOperationsData(tripId, updatedOps);
//   };

//   const formatCurrency = (val: number) => {
//       return new Intl.NumberFormat('en-US', { style: 'currency', currency: trip?.selectedCurrency || 'USD' }).format(val);
//   };

//   const formatServiceDate = (dateStr: string) => {
//       if (!dateStr || dateStr === 'TBA') return 'TBA';
//       const date = new Date(dateStr);
//       return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
//   };

//   if (loading || !trip) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>;

//   return (
//     <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      
//       {/* HEADER */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
//         <div className="flex items-center gap-4">
//           <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//             <ArrowLeft size={20} className="text-gray-600"/>
//           </button>
//           <div>
//             <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//               Operations Dashboard
//               <span className={`text-xs px-2 py-0.5 rounded-full border ${
//                   trip.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' : 
//                   'bg-green-100 text-green-700 border-green-200'
//               }`}>
//                 {trip.bookingStatus?.toUpperCase()}
//               </span>
//             </h1>
//             <p className="text-sm text-gray-500">Managing: {trip.tripName} ({trip.tripId})</p>
//           </div>
//         </div>
//         <div className="text-right">
//            <p className="text-xs font-bold text-gray-500 uppercase">Total Value</p>
//            <p className="text-lg font-bold text-green-700">{formatCurrency(trip.finalSellPrice || 0)}</p>
//         </div>
//       </div>

//       {/* TABS */}
//       <div className="bg-white border-b border-gray-200  px-6 flex gap-6 shadow-sm z-10">
//         {[
//           { id: 'payments', label: 'Client Payments', icon: CreditCard },
//           { id: 'vendors', label: 'Vendor Bookings', icon: Building2 },
//           { id: 'docs', label: 'Documents & Vouchers', icon: FileText },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id as any)}
//             className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all ${
//               activeTab === tab.id 
//                 ? 'border-indigo-600 text-indigo-600' 
//                 : 'border-transparent text-gray-500 hover:text-gray-800'
//             }`}
//           >
//             <tab.icon size={16} />
//             {tab.label}
//           </button>
//         ))}
//       </div>



//       {/* CONTENT AREA */}
//       <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-t from-[ #a5b6d1ff] via-[#414d61ff] to-[#676e7eff]">
        
//         {/* ============================================================== */}
//         {/* TAB 1: PAYMENTS (REDESIGNED)                                   */}
//         {/* ============================================================== */}
//         {activeTab === 'payments' && (
//           <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
//             {/* 1. FINANCIAL SUMMARY CARDS */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
//               {/* Card 1: Total Trip Value */}
//               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs text-gray-500 font-bold uppercase mb-1">Contract Value</p>
//                 <p className="text-2xl font-bold text-gray-900">{formatCurrency(financials.total)}</p>
//               </div>

//               {/* Card 2: Received (Cleared) */}
//               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
//                 <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
//                 <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Cleared</p>
//                 <p className="text-2xl font-bold text-green-600">{formatCurrency(financials.receivedCleared)}</p>
//                 {financials.receivedPending > 0 && (
//                     <p className="text-xs text-orange-500 font-medium mt-1 flex items-center gap-1">
//                         + {formatCurrency(financials.receivedPending)} Pending Clearance
//                     </p>
//                 )}
//               </div>

//               {/* Card 3: Balance (Smart Color Logic) */}
//               <div className={`p-5 rounded-xl border shadow-sm relative overflow-hidden ${
//                   financials.balance < 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
//               }`}>
//                 {financials.balance < 0 && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
//                 {financials.balance > 0 && <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>}
                
//                 <p className="text-xs text-gray-500 font-bold uppercase mb-1">
//                     {financials.balance < 0 ? 'Credit / Overpaid' : 'Balance Due'}
//                 </p>
//                 <p className={`text-2xl font-bold ${
//                     financials.balance < 0 ? 'text-blue-700' : (financials.balance === 0 ? 'text-gray-400' : 'text-red-600')
//                 }`}>
//                    {financials.balance < 0 ? `+ ${formatCurrency(Math.abs(financials.balance))}` : formatCurrency(financials.balance)}
//                 </p>
//                 {financials.balance === 0 && (
//                     <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">Paid In Full</span>
//                 )}
//               </div>

//               {/* Card 4: Action Button */}
//               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center gap-2">
//                  <button 
//                     onClick={openNewModal}
//                     className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition-all hover:scale-[1.02]"
//                  >
//                     <Plus size={18}/> Record Payment
//                  </button>
//               </div>
//             </div>

//             {/* 2. PAYMENT LEDGER TABLE */}
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//                 <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                     <h3 className="font-bold text-gray-700 flex items-center gap-2"><CreditCard size={16}/> Payment Ledger</h3>
//                 </div>
                
//                 {opsData?.clientPayments.length === 0 ? (
//                     <div className="p-16 text-center text-gray-400 text-sm flex flex-col items-center">
//                         <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
//                             <CreditCard size={32} className="opacity-30"/>
//                         </div>
//                         <p>No payments recorded yet.</p>
//                         <p className="text-xs mt-1">Click "Record Payment" to add the first entry.</p>
//                     </div>
//                 ) : (
//                     <div className="overflow-x-auto">
//                     <table className="w-full text-sm text-left">
//                         <thead className="bg-gray-100 text-gray-500 font-bold uppercase text-xs border-b border-gray-200">
//                             <tr>
//                                 <th className="px-6 py-3 w-32">Date</th>
//                                 <th className="px-6 py-3 w-32">Mode</th>
//                                 <th className="px-6 py-3 w-40">Ref ID</th>
//                                 <th className="px-6 py-3">Notes</th>
//                                 <th className="px-6 py-3 w-24">Status</th>
//                                 <th className="px-6 py-3 text-right w-32">Amount</th>
//                                 <th className="px-6 py-3 w-24 text-center">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {opsData?.clientPayments.map((pay) => (
//                                 <tr key={pay.id} className="hover:bg-gray-50/50 group transition-colors">
//                                     <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">
//                                         {new Date(pay.date).toLocaleDateString()}
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <span className="bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
//                                             {pay.mode}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 font-mono text-xs text-gray-600">
//                                         {pay.referenceId}
//                                     </td>
//                                     <td className="px-6 py-4 text-gray-500 text-xs truncate max-w-[200px]" title={pay.note}>
//                                         {pay.note || '-'}
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
//                                             pay.status === 'Cleared' 
//                                             ? 'bg-green-50 text-green-700 border-green-200' 
//                                             : 'bg-orange-50 text-orange-700 border-orange-200'
//                                         }`}>
//                                             {pay.status || 'Cleared'}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 text-right font-bold text-gray-800">
//                                         {formatCurrency(pay.amount)}
//                                     </td>
//                                     <td className="px-6 py-4 text-center">
//                                         <div className="flex items-center justify-center gap-2  group-hover:opacity-100 transition-opacity">
//                                             <button 
//                                                 onClick={() => openEditModal(pay)}
//                                                 className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md transition-colors" 
//                                                 title="Edit Payment"
//                                             >
//                                                 <Pencil size={14}/>
//                                             </button>
//                                             <button 
//                                                 onClick={() => handleDeletePayment(pay.id)}
//                                                 className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors" 
//                                                 title="Delete Payment"
//                                             >
//                                                 <Trash2 size={14}/>
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     </div>
//                 )}
//             </div>
//           </div>
//         )}

//         {/* ========================================================== */}
//         {/* TAB 2: VENDOR BOOKINGS (EXISTING)                          */}
//         {/* ========================================================== */}
//         {activeTab === 'vendors' && (
//           <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
//              <div className="flex gap-4 mb-6">
//                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex-1 flex gap-3 items-start">
//                     <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={18}/>
//                     <div>
//                         <p className="text-sm font-bold text-yellow-800">Operational Logic</p>
//                         <p className="text-xs text-yellow-700 mt-1">
//                             Use this tab to track actual bookings. Entering a <b>Confirmation Number</b> is required to unlock voucher generation.
//                         </p>
//                     </div>
//                  </div>
//                  <div className="bg-white border border-gray-200 rounded-xl p-4 w-64 shadow-sm">
//                     <p className="text-xs text-gray-400 font-bold uppercase">Estimated Net Profit</p>
//                     <div className="flex items-end gap-2">
//                          <p className={`text-xl font-bold ${financials.total - financials.vendorSpend > 0 ? 'text-emerald-600' : 'text-gray-600'}`}>
//                              {formatCurrency(financials.total - financials.vendorSpend)}
//                          </p>
//                     </div>
//                  </div>
//              </div>

//              <div className="space-y-3">
//                 {opsData?.vendorBookings.map((booking) => {
//                     // (Vendor Booking Card Code - Unchanged from previous step)
//                     // ... [Same Vendor Booking Card Code goes here for brevity] ...
//                     // Since you have the full previous code, I'll paste the card structure below just to be safe.
//                     const isGuide = booking.category === 'Guide';
//                     return (
//                         <div key={booking.id} className={`bg-white p-4 rounded-xl border shadow-sm transition-all ${
//                             booking.bookingStatus === 'Confirmed' ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-indigo-300'
//                         }`}>
//                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3 border-b border-gray-100 pb-3">
//                                 <div className="flex items-center gap-4 w-full md:w-1/3">
//                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
//                                         isGuide ? 'bg-purple-100 text-purple-600' : 
//                                         booking.category === 'Stay' ? 'bg-indigo-100 text-indigo-600' : 
//                                         'bg-orange-100 text-orange-600'
//                                     }`}>
//                                         {booking.category === 'Stay' && <Building2 size={18}/>}
//                                         {booking.category === 'Transport' && <User size={18}/>} 
//                                         {booking.category === 'Activity' && <Calendar size={18}/>}
//                                         {booking.category === 'Guide' && <User size={18}/>}
//                                     </div>
//                                     <div className="min-w-0">
//                                         <p className="font-bold text-gray-800 truncate" title={booking.name}>{booking.name}</p>
//                                         <div className="flex items-center gap-2 mt-1">
//                                             <span className="text-xs text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded">{booking.category}</span>
//                                             <span className="text-xs text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1">
//                                                 <Calendar size={10}/> {formatServiceDate(booking.serviceDate)}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="w-full md:w-2/5">
//                                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Assigned Vendor</label>
//                                      <div className="relative">
//                                         <Briefcase size={12} className="absolute left-2.5 top-3 text-gray-400"/>
//                                         <select 
//                                             value={booking.assignedSupplierId || ''}
//                                             onChange={(e) => handleUpdateBooking(booking.id, 'assignedSupplierId', e.target.value)}
//                                             className="w-full pl-8 p-2 border border-gray-200 rounded-lg text-xs font-semibold bg-gray-50 focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
//                                         >
//                                             <option value="">-- Select Vendor --</option>
//                                             {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.city})</option>)}
//                                         </select>
//                                      </div>
//                                 </div>
//                             </div>
//                             <div className="flex flex-col md:flex-row items-center gap-3">
//                                 <div className="flex items-end gap-2 w-full md:w-1/3">
//                                     <div className="flex-1">
//                                         <label className="text-[10px] font-bold text-gray-400 uppercase">Actual Cost</label>
//                                         <input type="number" value={booking.actualCost || ''} placeholder={String(booking.estimatedCost)} onChange={(e) => handleUpdateBooking(booking.id, 'actualCost', parseFloat(e.target.value))} className="w-full text-sm font-bold p-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 bg-white"/>
//                                     </div>
//                                     <div>
//                                         <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Payment</label>
//                                         <select value={booking.paymentStatus || 'Unpaid'} onChange={(e) => handleUpdateBooking(booking.id, 'paymentStatus', e.target.value)} className={`text-xs font-bold px-2 py-2 rounded border outline-none ${booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' : booking.paymentStatus === 'Partial' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
//                                             <option value="Unpaid">Unpaid</option><option value="Partial">Partial</option><option value="Paid">Paid</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <div className="flex-1 w-full">
//                                     <label className="text-[10px] font-bold text-gray-400 uppercase">Confirmation Ref #</label>
//                                     <input type="text" value={booking.confirmationNumber || ''} placeholder="Required" onChange={(e) => handleUpdateBooking(booking.id, 'confirmationNumber', e.target.value)} className={`w-full text-sm font-bold p-1.5 border rounded focus:ring-1 focus:ring-indigo-500 ${!booking.confirmationNumber ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}/>
//                                 </div>
//                                 <div className="w-full md:w-auto flex justify-end">
//                                      <select value={booking.bookingStatus} onChange={(e) => handleUpdateBooking(booking.id, 'bookingStatus', e.target.value)} className={`text-xs font-bold px-3 py-2 rounded-lg border cursor-pointer outline-none ${booking.bookingStatus === 'Confirmed' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
//                                         <option value="Pending">Pending</option><option value="Requested">Requested</option><option value="Confirmed">Confirmed</option><option value="Cancelled">Cancelled</option>
//                                      </select>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//              </div>
//           </div>
//         )}

//         {/* TAB 3: DOCUMENTS (EXISTING) */}
//         {activeTab === 'docs' && (
//           <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
//              <h3 className="font-bold text-gray-800 text-lg">Generated Vouchers</h3>
//              <p className="text-sm text-gray-500 -mt-4">Vouchers are available only for items with a Confirmation Number.</p>
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                  {opsData?.vendorBookings
//                     .filter(b => b.category === 'Stay' || b.category === 'Activity' || b.category === 'Transport')
//                     .map((booking) => {
//                         const isLocked = !booking.confirmationNumber || booking.bookingStatus !== 'Confirmed';
//                         return (
//                             <div key={booking.id} className={`p-5 rounded-xl border flex items-center justify-between group transition-all ${isLocked ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-indigo-100 hover:border-indigo-300 hover:shadow-md'}`}>
//                                 <div className="flex items-center gap-3 overflow-hidden">
//                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isLocked ? 'bg-gray-200 text-gray-400' : 'bg-indigo-50 text-indigo-600'}`}>
//                                          {isLocked ? <AlertTriangle size={18}/> : <FileText size={18}/>}
//                                      </div>
//                                      <div className="min-w-0">
//                                          <p className="font-bold text-gray-700 text-sm truncate">{booking.name}</p>
//                                          <p className="text-xs text-gray-400">{isLocked ? 'Missing Confirmation #' : `Ref: ${booking.confirmationNumber}`}</p>
//                                      </div>
//                                 </div>
//                                 <div className="relative">
//                                     <button disabled={isLocked} title={isLocked ? "Enter Confirmation Number in Vendor Tab to Unlock" : "Download PDF"} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${isLocked ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:-translate-y-0.5'}`}>
//                                         {isLocked ? 'Locked' : <><Download size={14}/> Download</>}
//                                     </button>
//                                 </div>
//                             </div>
//                         );
//                  })}
//              </div>
//           </div>
//         )}

//       </div>

//       {/* --- SMART MODAL (Now handles Edit, Status & Warnings) --- */}
//       <PaymentModal 
//          isOpen={isPaymentModalOpen} 
//          onClose={() => setPaymentModalOpen(false)} 
//          onSave={handleSavePayment} 
//          editingPayment={editingPayment}
//          currentBalance={financials.balance}
//       />

//     </div>
//   );
// } 



































































// "use client";

// import { useState, useEffect, useMemo, useRef } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { 
//   ArrowLeft, CreditCard, Building2, FileText, 
//   CheckCircle, AlertCircle, Plus, Calendar, Save, 
//   Download, Loader2, X, AlertTriangle, User, Briefcase, Mail, Phone,
//   Pencil, Trash2, ArrowDownLeft, ArrowUpRight, PieChart,
//   MapPin,
//   Clock
// } from 'lucide-react';
// import { 
//   getItineraryById, 
//   initializeOperations, 
//   saveOperationsData,
//   StoredItineraryData, 
//   OperationsData,
//   VendorBooking,
//   ClientPayment,
//   Installment
// } from '@/utils/itineraryStorage';
// import { getSuppliers, SupplierData } from '@/utils/srmStorage';





// // --- [CHANGED] 1. ENHANCED VOUCHER INTERFACE ---
// // We added specific fields for "Best Design" (Location, Time, Pickup)
// interface VoucherData {
//     id: string;
//     type: 'Stay' | 'Transport' | 'Activity' | 'Other';
//     status: 'Confirmed' | 'Pending';
    
//     // Header Info
//     bookingRef: string;     // The Vendor's Conf Number
//     internalRef: string;    // Your System ID
//     issueDate: string;

//     // Client Info
//     guestName: string;
//     paxCount: number;
//     groupName: string;

//     // Vendor Info
//     vendorName: string;
//     vendorPhone: string;
//     vendorAddress: string;

//     // Service Details (The Core Content)
//     serviceDate: string;
//     serviceTitle: string;   // e.g. "Grand Hotel Palatino"
//     serviceSubtitle?: string; // e.g. "Deluxe Room - 2 Nights"
    
//     // The "Grid" Data (Dynamic Rows)
//     particulars: { label: string; value: string }[]; 
    
//     notes?: string;
//     agencyContact: string;
// }





// // This function hunts for the "missing content" inside your itinerary
// // const buildVoucherData = (
// //     booking: VendorBooking, 
// //     trip: StoredItineraryData, 
// //     suppliers: SupplierData[]
// // ): VoucherData | null => {
    
// //     const supplier = suppliers.find(s => s.id === booking.assignedSupplierId);
    
// //     // Default fallback values
// //     let specificDetails: { label: string, value: string }[] = [];
// //     let title = booking.name;
// //     let subtitle = "";
    
// //     // Find the original item in the itinerary to get the "Good Content"
// //     const dayPlans = trip.dayWiseActivities || [];
    
// //     for (const day of dayPlans) {
// //         // --- STAY LOGIC ---
// //         if (booking.category === 'Stay' && day.stays) {
// //             const item = day.stays.find(s => String(s.id) === booking.serviceId);
// //             if (item) {
// //                 title = item.hotelName;
// //                 subtitle = `${item.nights} Night(s) Stay`;
// //                 specificDetails.push(
// //                     { label: "Check-in", value: booking.serviceDate },
// //                     { label: "Check-out", value: "Calculated based on nights" }, // You can calculate this if needed
// //                     { label: "Room Category", value: item.roomCategory || "Standard" },
// //                     { label: "Meal Plan", value: "Breakfast Included" }, // Default or from item
// //                     { label: "Total Rooms", value: String(item.numRooms) },
// //                     { label: "Hotel Address", value: "See Vendor Details" }
// //                 );
// //                 break;
// //             }
// //         }
// //         // --- TRANSPORT LOGIC ---
// //         if (booking.category === 'Transport' && day.transports) {
// //             const item = day.transports.find(t => String(t.id) === booking.serviceId);
// //             if (item) {
// //                 title = `${item.vehicleType} (${item.subType})`;
// //                 subtitle = item.subType === 'transfer' ? 'Point-to-Point Transfer' : 'Disposal Service';
// //                 specificDetails.push(
// //                     { label: "Service Date", value: booking.serviceDate },
// //                     { label: "Pickup Time", value: item.pickupTime || "TBA" },
// //                     { label: "Pickup Location", value: item.pickupLocation || "TBA" },
// //                     { label: "Drop/Duration", value: item.subType === 'transfer' ? (item.dropoffLocation || "TBA") : (item.duration || "N/A") },
// //                     { label: "Vehicle Count", value: String(item.vehicleCount) },
// //                     { label: "Driver Details", value: "To be provided 24hrs prior" }
// //                 );
// //                 break;
// //             }
// //         }
// //         // --- ACTIVITY LOGIC ---
// //         if (booking.category === 'Activity' && day.activities) {
// //             const item = day.activities.find(a => String(a.id) === booking.serviceId);
// //             if (item) {
// //                 title = item.heading;
// //                 subtitle = "Activity / Tour";
// //                 specificDetails.push(
// //                     { label: "Activity Date", value: booking.serviceDate },
// //                     { label: "Start Time", value: item.startTime || "TBA" },
// //                     { label: "Duration", value: item.duration || "N/A" },
// //                     { label: "Meeting Point", value: item.pickupLocation || "Hotel Lobby" },
// //                     { label: "Guide Service", value: item.guideType === 'guided' ? "Included" : "Self-Guided" },
// //                     { label: "Ticket Status", value: "Included" }
// //                 );
// //                 break;
// //             }
// //         }
// //     }

// //     return {
// //         id: booking.id,
// //         type: booking.category as any,
// //         status: booking.bookingStatus === 'Confirmed' ? 'Confirmed' : 'Pending',
// //         bookingRef: booking.confirmationNumber || "PENDING",
// //         internalRef: trip.tripId || "N/A",
// //         issueDate: new Date().toLocaleDateString(),
// //         guestName: trip.leadGuestName || "Lead Guest",
// //         paxCount: Number(trip.numberOfTravelers) || 1,
// //         groupName: trip.tripName,
// //         vendorName: supplier?.name || "Service Provider",
// //         vendorPhone: supplier?.phone || "Not Available",
// //         vendorAddress: supplier?.address || "Address on request",
// //         serviceDate: booking.serviceDate,
// //         serviceTitle: title,
// //         serviceSubtitle: subtitle,
// //         particulars: specificDetails,
// //         agencyContact: "+91 98765 43210", // Hardcoded Agency Contact
// //         notes: "Please present this voucher strictly for the services mentioned above. Any extras must be settled directly."
// //     };
// // };


// // --- [UPDATED] HELPER: BUILD VOUCHER DATA ---
// const buildVoucherData = (
//     booking: VendorBooking, 
//     trip: StoredItineraryData, 
//     suppliers: SupplierData[]
// ): VoucherData | null => {
    

    
//     const supplier = suppliers.find(s => s.id === booking.assignedSupplierId);
//     let specificDetails: { label: string, value: string }[] = [];
//     let title = booking.name;
//     let subtitle = "";

//     // --- [NEW LOGIC START] Helper to calculate Check-out Date ---
//     const calculateCheckOut = (startDate: string, nights: number) => {
//         if (!startDate || startDate === 'TBA') return 'TBA';
//         const d = new Date(startDate);
//         if (isNaN(d.getTime())) return startDate; // Fallback if invalid
        
//         // Add the nights to the date
//         d.setDate(d.getDate() + nights);
        
//         // Return in YYYY-MM-DD format (matches your other dates)
//         return d.toISOString().split('T')[0];
//     };
//     // --- [NEW LOGIC END] ---
    
//     const dayPlans = trip.dayWiseActivities || [];
    
//     for (const day of dayPlans) {
//         // --- STAY LOGIC ---
//         if (booking.category === 'Stay' && day.stays) {
//             const item = day.stays.find(s => String(s.id) === booking.serviceId);
//             if (item) {
//                 title = item.hotelName;
//                 subtitle = `${item.nights} Night(s) Stay`;

//                 // [CHANGED]: We now call the helper function instead of the hardcoded string
//                 const checkOutDate = calculateCheckOut(booking.serviceDate, item.nights || 0);

//                 specificDetails.push(
//                     { label: "Check-in", value: booking.serviceDate },
//                     { label: "Check-out", value: checkOutDate }, // <--- UPDATED LINE
//                     { label: "Room Category", value: item.roomCategory || "Standard" },
//                     { label: "Meal Plan", value: "Breakfast Included" }, 
//                     { label: "Total Rooms", value: String(item.numRooms) },
//                     { label: "Hotel Address", value: supplier?.address || (item as any).city || "Address on request" }
                    
//                 );
//                 break;
//             }
//         }
//         // --- TRANSPORT LOGIC ---
//         if (booking.category === 'Transport' && day.transports) {
//             const item = day.transports.find(t => String(t.id) === booking.serviceId);
//             if (item) {
//                 title = `${item.vehicleType} (${item.subType})`;
//                 subtitle = item.subType === 'transfer' ? 'Point-to-Point Transfer' : 'Disposal Service';
//                 specificDetails.push(
//                     { label: "Service Date", value: booking.serviceDate },
//                     { label: "Pickup Time", value: item.pickupTime || "TBA" },
//                     { label: "Pickup Location", value: item.pickupLocation || "TBA" },
//                     { label: "Drop/Duration", value: item.subType === 'transfer' ? (item.dropoffLocation || "TBA") : (item.duration || "N/A") },
//                     { label: "Vehicle Count", value: String(item.vehicleCount) },
//                     { label: "Driver Details", value: "To be provided 24hrs prior" }
//                 );
//                 break;
//             }
//         }
//         // --- ACTIVITY LOGIC ---
//         if (booking.category === 'Activity' && day.activities) {
//             const item = day.activities.find(a => String(a.id) === booking.serviceId);
//             if (item) {
//                 title = item.heading;
//                 subtitle = "Activity / Tour";
//                 specificDetails.push(
//                     { label: "Activity Date", value: booking.serviceDate },
//                     { label: "Start Time", value: item.startTime || "TBA" },
//                     { label: "Duration", value: item.duration || "N/A" },
//                     { label: "Meeting Point", value: item.pickupLocation || "Hotel Lobby" },
//                     { label: "Guide Service", value: item.guideType === 'guided' ? "Included" : "Self-Guided" },
//                     { label: "Ticket Status", value: "Included" }
//                 );
//                 break;
//             }
//         }
//     }

//     return {
//         id: booking.id,
//         type: booking.category as any,
//         status: booking.bookingStatus === 'Confirmed' ? 'Confirmed' : 'Pending',
//         bookingRef: booking.confirmationNumber || "PENDING",
//         internalRef: trip.tripId || "N/A",
//         issueDate: new Date().toLocaleDateString(),
//         guestName: trip.leadGuestName || "Lead Guest",
//         paxCount: Number(trip.numberOfTravelers) || 1,
//         groupName: trip.tripName,
//         vendorName: supplier?.name || "Service Provider",
//         vendorPhone: supplier?.phone || "Not Available",
//         vendorAddress: supplier?.address || "Address on request",
       
//         serviceDate: booking.serviceDate,
//         serviceTitle: title,
//         serviceSubtitle: subtitle,
//         particulars: specificDetails,
//         agencyContact: "+91 98765 43210", 
//         notes: "Please present this voucher strictly for the services mentioned above. Any extras must be settled directly."
//     };
// };



// // --- [FIXED] 3. "TABULAR GRID" PDF TEMPLATE ---
// // Matches image_82be0d.png with strict table lines (grid format)
// const VoucherPrintTemplate = ({ data }: { data: VoucherData }) => {
    
//     // Exact Colors from your reference
//     const colors = {
//         red: '#c8102e',
//         navy:"#07002cff" ,      // Travdek Red
//         gold: '#c5a065',      // Card Border Gold
//         beige: '#fffbeb',     // Note Background
//         dark: '#111827',      // Text Black
//         gray: '#6b7280',      // Text Gray
//         border: '#e5e7eb',    // Table Line Color
//         headerBg: '#f9fafb',  // Table Label Background
//         white: '#ffffff'
//     };

//     return (
//         <div 
//             id={`voucher-${data.id}`} 
//             style={{ 
//                 width: '210mm', 
//                 minHeight: '297mm', 
//                 backgroundColor: colors.white, 
//                 color: colors.dark,
//                 fontFamily: 'Arial, sans-serif',
//                 position: 'relative',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 boxSizing: 'border-box'
//             }}
//         >
//             {/* 1. HEADER SECTION */}
//             <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'space-between', 
//                 alignItems: 'stretch', 
//                 borderBottom: `4px solid ${colors.red}`,
//                 marginTop: '0px', 
//                 marginLeft: '0px' 
//             }}>
//                 {/* Left: Brand */}
//                 <div style={{ paddingBottom: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//                      <div style={{ 
//                          fontSize: '38px', 
//                          fontWeight: '900', 
//                          color: colors.navy, 
//                          textTransform: 'uppercase', 
//                          lineHeight: '1',
//                          letterSpacing: '0px',
//                           marginLeft: '25px' 
//                      }}>
//                         TRAVDEK
//                      </div>
//                      <div style={{ 
//                          fontSize: '11px', 
//                          fontWeight: 'bold', 
//                          color: '#555', 
//                          letterSpacing: '1px', 
//                          textTransform: 'uppercase',
//                          marginTop: '8px',
//                          marginLeft: '26px' 
//                      }}>
//                         Official Service Voucher
//                      </div>
//                 </div>
                
//                 {/* Right: Confirmation Box */}
//                 <div style={{ 
//                     backgroundColor: colors.red, 
//                     color: colors.white, 
//                     width: '240px', 
//                     padding: '25px',
//                     textAlign: 'center',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'center'
//                 }}>
//                     <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '5px', opacity: 1 }}>
//                         Confirmation Ref 
//                     </div>
//                     <div  style={ {fontSize: '24px', fontFamily: 'Courier New, monospace', fontWeight: 'bold' , marginTop:'1px' }} >
//                         {data.bookingRef}
//                     </div>
                
//                     <div style={{ 
//                         marginTop: '2px', 
                   
//                         padding: '4px', 
//                         borderRadius: '4px', 
//                         fontSize: '12px', 
//                         fontWeight: 'bold', 
//                         textTransform: 'uppercase' 
//                     }}>
//                         {data.status}
//                     </div>
//                 </div>
//             </div>

//             {/* 2. INFO COLUMNS (Guest & Vendor) */}
//             <div style={{ padding: '40px', display: 'flex', gap: '50px'  }}>
//                 {/* Guest Details */}
//                 <div style={{ flex: 1 }}>
//                     <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#303030ff', marginBottom: '10px' }}>
//                          GUEST DETAILS
//                     </h3>
//                     <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>
//                         {data.guestName}
//                     </div>
//                     <div style={{ fontSize: '14px', color: '#444', marginBottom: '4px' }}>
//                         <span style={{ color: '#464646ff' , fontWeight: 'bold' }}>Group:</span> {data.groupName}
//                     </div>
//                     <div style={{ fontSize: '14px', color: '#444' }}>
//                         <span style={{ color: '#464646ff' , fontWeight: 'bold'}}>Travelers:</span> <strong>{data.paxCount} Pax</strong>
//                     </div>
//                 </div>

//                 {/* Divider */}
//                 <div style={{ width: '1px', backgroundColor: '#eee', height: '80px', marginTop: '10px' }}></div>

//                 {/* Service Provider */}
//                 <div style={{ flex: 1 }}>
//                     <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#303030ff', textTransform: 'uppercase', letterSpacing: '0px', marginBottom: '10px' }}>
//                         Service Provider
//                     </h3>
//                     <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>
//                         {data.vendorName}
//                     </div>
//                     <div style={{ fontSize: '14px', color: '#444', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
//                         <span style={{ color: '#444'  , fontWeight: 'bold'}}>Address:</span> {data.vendorAddress}
//                     </div>
//                     <div style={{ fontSize: '14px', color: '#444', display: 'flex', alignItems: 'center', gap: '6px' }}>
//                         <span style={{ color: '#444', fontWeight: 'bold' }}>Phone:</span> {data.vendorPhone}
//                     </div>
//                 </div>
//             </div>

//             {/* 3. SERVICE PARTICULARS CARD (The Table) */}
//             <div style={{ padding: '0 40px', flex: 1 }}>
                
//                 {/* Gold Border Container */}
//                 <div style={{ 
//                     border: `2px solid ${colors.gold}`, 
//                     borderRadius: '8px', 
//                     overflow: 'hidden' 
//                 }}>
                    
//                     {/* A. Red Card Header */}
//                     <div style={{ 
//                         backgroundColor: colors.red, 
//                         color: colors.white, 
//                         padding: '12px 20px',
//                         display: 'flex', 
//                         justifyContent: 'space-between', 
//                         alignItems: 'center'
//                     }}>
//                         <span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px' }}>
//                             Service Details
//                         </span>
//                         <span style={{ fontSize: '13px' }}>Date: {data.serviceDate}</span>
//                     </div>

//                     {/* B. Service Title */}
//                     <div style={{ 
//                         padding: '24px 20px', 
//                         backgroundColor: '#fff', 
//                         borderBottom: `1px solid ${colors.border}` 
//                     }}>
//                         <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px' }}>
//                             {data.serviceTitle}
//                         </div>
//                         {data.serviceSubtitle && (
//                             <div style={{ fontSize: '14px', color: '#666' }}>
//                                 {data.serviceSubtitle}
//                             </div>
//                         )}
//                     </div>

//                     {/* C. THE TABULAR GRID (Strict Lining) */}
//                     <div>
//                         <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
//                             <tbody>
//                                 {data.particulars.map((row, idx) => (
//                                     <tr key={idx}>
//                                         {/* Label Column: Gray Bg + Right Border */}
//                                         <td style={{ 
//                                             padding: '14px 20px', 
//                                             fontWeight: 'bold', 
//                                             color: '#555', 
//                                             textTransform: 'uppercase', 
//                                             fontSize: '11px',
//                                             backgroundColor: colors.headerBg,
//                                             borderBottom: `1px solid ${colors.border}`,
//                                             borderRight: `1px solid ${colors.border}`, // Vertical Divider
//                                             width: '35%'
//                                         }}>
//                                             {row.label}
//                                         </td>
                                        
//                                         {/* Value Column: White Bg + Bottom Border */}
//                                         <td style={{ 
//                                             padding: '14px 20px', 
//                                             color: '#111', 
//                                             fontWeight: '600',
//                                             backgroundColor: colors.white,
//                                             borderBottom: `1px solid ${colors.border}`
//                                         }}>
//                                             {row.value}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* D. Note Footer */}
//                     <div style={{ 
//                         padding: '20px', 
//                         backgroundColor: colors.beige, 
//                         color: '#854d0e',
//                         borderTop: `1px solid ${colors.gold}` // Separator from table
//                     }}>
//                         <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', marginBottom: '4px', color: '#92400e' }}>
//                             Important Note:
//                         </div>
//                         <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
//                             {data.notes}
//                         </div>
//                     </div>

//                 </div>
//             </div>

//             {/* 4. FOOTER */}
//             <div style={{ 
//                 padding: '40px', 
//                 marginTop: 'auto', 
//                 display: 'flex', 
//                 justifyContent: 'space-between', 
//                 fontSize: '11px', 
//                 color: '#999' 
//             }}>
//                 <div>
//                     Generated by TRAVDEK System<br/>
//                     {data.issueDate}
//                 </div>
//                 <div style={{ textAlign: 'right' }}>
//                     Emergency Ops: <strong>{data.agencyContact}</strong><br/>
//                     Valid only for services specified.
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- SUB-COMPONENT: SMART PAYMENT MODAL ---
// interface PaymentModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave: (data: ClientPayment) => void;
//     editingPayment?: ClientPayment | null;
//     currentBalance: number;
//     installments: Installment[];
// }

// const PaymentModal = ({ isOpen, onClose, onSave, editingPayment, currentBalance, installments }: PaymentModalProps) => {
//     const [amount, setAmount] = useState('');
//     const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
//     const [mode, setMode] = useState('Bank Transfer');
//     const [status, setStatus] = useState<'Cleared' | 'Pending'>('Cleared');
//     const [type, setType] = useState<'Payment' | 'Refund'>('Payment'); // NEW: Transaction Type
//     const [refId, setRefId] = useState('');
//     const [allocation, setAllocation] = useState(''); // NEW: Allocation
//     const [note, setNote] = useState('');

//     useEffect(() => {
//         if (editingPayment) {
//             setAmount(String(editingPayment.amount));
//             setDate(editingPayment.date);
//             setMode(editingPayment.mode);
//             setStatus(editingPayment.status || 'Cleared');
//             setType(editingPayment.type || 'Payment');
//             setRefId(editingPayment.referenceId);
//             setAllocation(editingPayment.allocation || '');
//             setNote(editingPayment.note || '');
//         } else {
//             setAmount('');
//             setDate(new Date().toISOString().split('T')[0]);
//             setMode('Bank Transfer');
//             setStatus('Cleared');
//             setType('Payment');
//             setRefId('');
//             setAllocation('');
//             setNote('');
//         }
//     }, [editingPayment, isOpen]);

//     if (!isOpen) return null;

//     // Logic: Warning Calculation
//     const numAmount = parseFloat(amount || '0');
//     // If refund, it increases balance. If payment, decreases.
//     const effectiveBalance = editingPayment 
//         ? (currentBalance + (editingPayment.type === 'Payment' ? editingPayment.amount : -editingPayment.amount)) 
//         : currentBalance;
    
//     const isOverpayment = type === 'Payment' && numAmount > effectiveBalance;

//     const handleSubmit = () => {
//         if (!amount || !refId) return alert("Amount and Reference ID are required");
        
//         onSave({ 
//             id: editingPayment ? editingPayment.id : Date.now().toString(),
//             date, 
//             amount: parseFloat(amount), 
//             mode: mode as any,
//             status,
//             type,
//             referenceId: refId,
//             allocation,
//             note
//         });
//         onClose();
//     };

//     return (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
//                 <div className={`p-4 text-white flex justify-between items-center ${type === 'Refund' ? 'bg-red-600' : 'bg-gray-900'}`}>
//                     <h3 className="font-bold flex items-center gap-2">
//                         {type === 'Refund' ? <ArrowUpRight size={18} className="text-white"/> : <ArrowDownLeft size={18} className="text-green-400"/>} 
//                         {editingPayment ? 'Edit Transaction' : 'Record Transaction'}
//                     </h3>
//                     <button onClick={onClose} className="hover:bg-white/20 p-1 rounded"><X size={20}/></button>
//                 </div>
                
//                 <div className="p-6 space-y-5">
            

//                     {isOverpayment && (
//                         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded flex items-start gap-3">
//                             <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={18}/>
//                             <div className="text-xs text-yellow-800">
//                                 <span className="font-bold block">Overpayment Warning</span>
//                                 This amount (${numAmount.toLocaleString()}) exceeds the pending balance (${effectiveBalance.toLocaleString()}). 
//                                 This will create a credit on the account.
//                             </div>
//                         </div>
//                     )}

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-xs font-bold text-gray-500 mb-1">Amount ($)</label>
//                             <input 
//                                 type="number" 
//                                 placeholder="0.00" 
//                                 value={amount} 
//                                 onChange={e=>setAmount(e.target.value)} 
//                                 className="w-full p-2.5 border border-gray-300 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-xs font-bold text-gray-500 mb-1">Transaction Date</label>
//                             <input 
//                                 type="date" 
//                                 value={date} 
//                                 onChange={e=>setDate(e.target.value)} 
//                                 className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                              <label className="block text-xs font-bold text-gray-500 mb-1">Method</label>
//                              <select value={mode} onChange={e=>setMode(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white">
//                                 {['Bank Transfer','Credit Card','Cash','UPI','Cheque'].map(m=><option key={m} value={m}>{m}</option>)}
//                              </select>
//                         </div>
//                         <div>
//                             <label className="block text-xs font-bold text-gray-500 mb-1">Clearance Status</label>
//                             <div className="flex bg-gray-100 p-1 rounded-lg">
//                                 <button 
//                                     onClick={() => setStatus('Cleared')}
//                                     className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${status === 'Cleared' ? 'bg-green-500 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
//                                 >Cleared</button>
//                                 <button 
//                                     onClick={() => setStatus('Pending')}
//                                     className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${status === 'Pending' ? 'bg-orange-400 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
//                                 >Pending</button>
//                             </div>
//                         </div>
//                     </div>

                    
               

//                     <div>
//                         <label className="block text-xs font-bold text-gray-500 mb-1">Reference ID / Cheque No.</label>
//                         <input type="text" placeholder="e.g. TXN-889922" value={refId} onChange={e=>setRefId(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"/>
//                     </div>

//                     <div>
//                         <label className="block text-xs font-bold text-gray-500 mb-1">Notes (Optional)</label>
//                         <textarea 
//                             rows={2}
//                             placeholder="e.g. Received from Wells Fargo account ending in 1234" 
//                             value={note} 
//                             onChange={e=>setNote(e.target.value)} 
//                             className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
//                         />
//                     </div>
//                 </div>

//                 <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
//                     <button onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
//                     <button onClick={handleSubmit} className={`px-6 py-2.5 text-xs font-bold text-white rounded-lg shadow-lg transition-all flex items-center gap-2 ${type === 'Refund' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-black'}`}>
//                         <Save size={14}/> {editingPayment ? 'Update Record' : 'Save Record'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- MAIN PAGE ---
// export default function TripOperationsPage() {
//   const router = useRouter();
//   const params = useParams();
//   const tripId = params.tripId as string;
  
//   const [trip, setTrip] = useState<StoredItineraryData | null>(null);
//   const [opsData, setOpsData] = useState<OperationsData | null>(null);
//   const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
//   const [activeTab, setActiveTab] = useState<'payments' | 'vendors' | 'docs'>('payments');

//   // --- [NEW] VOUCHER PRINTING STATE ---
//   const [printingVouchers, setPrintingVouchers] = useState<VoucherData[]>([]);
//   const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
//   const printRef = useRef<HTMLDivElement>(null);
  
//   // Modal State
//   const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
//   const [editingPayment, setEditingPayment] = useState<ClientPayment | null>(null);
  
//   const [loading, setLoading] = useState(true);

//   // --- NEW STATE FOR VENDOR TAB ---
// const [groupBy, setGroupBy] = useState<'day' | 'category'>('day');
// const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

// // Helper: Toggle Selection
// const toggleSelection = (id: string) => {
//     const newSet = new Set(selectedIds);
//     if (newSet.has(id)) newSet.delete(id);
//     else newSet.add(id);
//     setSelectedIds(newSet);
// };

// // Helper: Select All in Group
// const toggleGroupSelection = (ids: string[]) => {
//     const allSelected = ids.every(id => selectedIds.has(id));
//     const newSet = new Set(selectedIds);
//     ids.forEach(id => allSelected ? newSet.delete(id) : newSet.add(id));
//     setSelectedIds(newSet);
// };

// // Helper: Bulk Update Handler
// const handleBulkAction = (field: keyof VendorBooking, value: any) => {
//     if(!opsData) return;
//     const updatedBookings = opsData.vendorBookings.map(b => 
//         selectedIds.has(b.id) ? { ...b, [field]: value } : b
//     );
//     const updatedOps = { ...opsData, vendorBookings: updatedBookings };
//     setOpsData(updatedOps);
//     saveOperationsData(tripId, updatedOps);
//     setSelectedIds(new Set()); // Clear selection after action
// };

//   // --- 1. LOAD DATA ---
//   useEffect(() => {
//     if (tripId) {
//       const rawData = getItineraryById(tripId);
//       if (rawData) {
//           const initializedData = initializeOperations(rawData);
//           setTrip(initializedData);
//           setOpsData(initializedData.operations || null);
//           if(!rawData.operations) {
//              saveOperationsData(tripId, initializedData.operations);
//           }
//       }
//       const allSuppliers = getSuppliers();
//       setSuppliers(allSuppliers);
//       setLoading(false);
//     }
//   }, [tripId]);


//   // --- 2. SMART FINANCIAL CALCULATIONS ---
//   const financials = useMemo(() => {
//       if(!trip || !opsData) return { total: 0, received: 0, refunded: 0, pendingClearance: 0, balance: 0, status: 'Unpaid', vendorSpend: 0 };
      
//       const total = trip.finalSellPrice || 0;
      
//       // Separate Payments vs Refunds
//       const payments = opsData.clientPayments.filter(p => p.type !== 'Refund');
//       const refunds = opsData.clientPayments.filter(p => p.type === 'Refund');

//       const received = payments.filter(p => p.status === 'Cleared').reduce((acc, curr) => acc + curr.amount, 0);
//       const refunded = refunds.filter(p => p.status === 'Cleared').reduce((acc, curr) => acc + curr.amount, 0);
//       const pendingClearance = payments.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
      
//       // Logic: Balance = Total Cost - (Net Received)
//       // Net Received = Received - Refunded
//       const netReceived = received - refunded;
//       const balance = total - netReceived;
      
//       const vendorSpend = opsData.vendorBookings.reduce((acc, curr) => acc + (curr.actualCost > 0 ? curr.actualCost : 0), 0);
      
//       let status = 'Unpaid';
//       if (balance <= 0) status = 'Paid';
//       else if (netReceived > 0) status = 'Partial';

//       return { total, received, refunded, pendingClearance, balance, status, vendorSpend };
//   }, [trip, opsData]);

//   // --- 3. ACTIONS ---
  
//   // SAVE Payment
//   const handleSavePayment = (payment: ClientPayment) => {
//       if(!opsData) return;
      
//       let updatedPayments = [...opsData.clientPayments];
//       const existingIndex = updatedPayments.findIndex(p => p.id === payment.id);

//       if (existingIndex >= 0) {
//           updatedPayments[existingIndex] = payment;
//       } else {
//           updatedPayments.push(payment);
//       }

//       // Update Allocation Status in Installments
//       let updatedInstallments = [...opsData.installments];
//       if(payment.allocation && payment.type === 'Payment' && payment.status === 'Cleared') {
//          // Simple logic: if allocated, mark partially/fully paid (Enhancement for later)
//          // For now, we just store the data
//       }

//       const updatedOps = { ...opsData, clientPayments: updatedPayments, installments: updatedInstallments };
//       setOpsData(updatedOps);
//       saveOperationsData(tripId, updatedOps);
//   };

//   // DELETE Payment
//   const handleDeletePayment = (id: string) => {
//       if(!confirm("Are you sure you want to permanently delete this payment record?")) return;
//       if(!opsData) return;
//       const updatedPayments = opsData.clientPayments.filter(p => p.id !== id);
//       const updatedOps = { ...opsData, clientPayments: updatedPayments };
//       setOpsData(updatedOps);
//       saveOperationsData(tripId, updatedOps);
//   };

//   // Generic Vendor Update
//   const handleUpdateBooking = (id: string, field: keyof VendorBooking, value: any) => {
//       if(!opsData) return;
//       const updatedBookings = opsData.vendorBookings.map(b => 
//           b.id === id ? { ...b, [field]: value } : b
//       );
//       const updatedOps = { ...opsData, vendorBookings: updatedBookings };
//       setOpsData(updatedOps);
//       saveOperationsData(tripId, updatedOps);
//   };

//   // Format Helpers
//   const formatCurrency = (val: number) => {
//       return new Intl.NumberFormat('en-US', { style: 'currency', currency: trip?.selectedCurrency || 'USD' }).format(val);
//   };

//   const formatServiceDate = (dateStr: string) => {
//       if (!dateStr || dateStr === 'TBA') return 'TBA';
//       const date = new Date(dateStr);
//       return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
//   };



// // --- [UPDATED] PDF GENERATION LOGIC ---

// // --- PDF GENERATOR ---
//   const generateVoucherPdf = async (bookingsToPrint: VendorBooking[], fileName: string) => {
//       if (!trip) return;
//       setIsGeneratingPdf(true);
      
//       const voucherQueue = bookingsToPrint
//         .map(b => buildVoucherData(b, trip, suppliers))
//         .filter((v): v is VoucherData => v !== null);

//       if (voucherQueue.length === 0) {
//           alert("No valid voucher data found.");
//           setIsGeneratingPdf(false);
//           return;
//       }

//       setPrintingVouchers(voucherQueue);

//       // Wait longer for React to render (increased to 2000ms to be safe)
//       setTimeout(async () => {
//           if (!printRef.current) {
//               console.error("Print Ref not found");
//               setIsGeneratingPdf(false);
//               return;
//           }

//           try {
//               const element = printRef.current;
              
//               // CHANGE: Simplified html2canvas options
//               const canvas = await html2canvas(element, { 
//                   scale: 2, // Retina quality
//                   useCORS: true,
//                   logging: false
//               });
              
//               const imgData = canvas.toDataURL('image/jpeg', 0.95);
//               const pdf = new jsPDF('p', 'mm', 'a4');
//               const pdfWidth = 210; 
//               // const pdfHeight = 297; 
              
//               // CHANGE: Simplified Loop for multi-page
//               for (let i = 0; i < voucherQueue.length; i++) {
//                  if (i > 0) pdf.addPage();
                 
//                  // Simply print the specific slice of the long canvas
//                  // This assumes the height of one voucher is exactly 297mm (A4)
//                  // Note: 'element' contains ALL vouchers stacked. 
                 
//                  const pageHeightInCanvas = (canvas.width * 297) / 210;

//                  // Add image with a negative offset to show the correct "Page"
//                  pdf.addImage(
//                     imgData, 
//                     'JPEG', 
//                     0, 
//                     -(i * 297), // Move the image UP to reveal the next voucher
//                     pdfWidth, 
//                     (canvas.height * pdfWidth) / canvas.width
//                  );
//               }

//               pdf.save(`${fileName}.pdf`);
//           } catch (err) {
//               console.error("PDF Generation Error:", err);
//               alert("Failed to generate PDF. Check console for details.");
//           } finally {
//               setIsGeneratingPdf(false);
//               setPrintingVouchers([]); 
//           }
//       }, 2000); // 2 seconds wait
//   };

//   // Helper: Format Dates
//   const formatDate = (d: string) => d && d !== 'TBA' ? new Date(d).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}) : 'TBA';

//   if (loading || !trip) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>;

//   return (
//     <div className="h-full flex flex-col bg-gray-50 overflow-hidden relative">
    

//     {/* --- HIDDEN PRINTER ROOM --- */}
//       {/* CHANGE: Explicit white background and fixed A4 width */}
//       <div style={{ 
//           position: 'fixed', 
//           top: 0, 
//           left: '-10000px', // Push off-screen
//           width: '210mm', 
//           backgroundColor: '#ffffff', // Important for html2canvas
//           zIndex: -50 
//       }}>
//          {/* Render all requested vouchers vertically */}
//          <div id="voucher-print-container" ref={printRef}>
//             {printingVouchers.map((vData, idx) => (
//                 <VoucherPrintTemplate key={idx} data={vData} />
//             ))}
//          </div>
//       </div>
      
//       {/* HEADER */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
//         <div className="flex items-center gap-4">
//           <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//             <ArrowLeft size={20} className="text-gray-600"/>
//           </button>
//           <div>
//             <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//               Operations Dashboard
//               <span className={`text-xs px-2 py-0.5 rounded-full border ${
//                   trip.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' : 
//                   'bg-green-100 text-green-700 border-green-200'
//               }`}>
//                 {trip.bookingStatus?.toUpperCase()}
//               </span>
//             </h1>
//             <p className="text-sm text-gray-500">Managing: {trip.tripName} ({trip.tripId})</p>
//           </div>
//         </div>
//         <div className="text-right">
//            <p className="text-xs font-bold text-gray-500 uppercase">Total Value</p>
//            <p className="text-lg font-bold text-green-700">{formatCurrency(trip.finalSellPrice || 0)}</p>
//         </div>
//       </div>

//       {/* TABS */}
//       <div className="bg-white border-b border-gray-200  px-6 flex gap-6 shadow-sm z-10">
//         {[
//           { id: 'payments', label: 'Client Payments', icon: CreditCard },
//           { id: 'vendors', label: 'Vendor Bookings', icon: Building2 },
//           { id: 'docs', label: 'Documents & Vouchers', icon: FileText },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id as any)}
//             className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all ${
//               activeTab === tab.id 
//                 ? 'border-indigo-600 text-indigo-600' 
//                 : 'border-transparent text-gray-500 hover:text-gray-800'
//             }`}
//           >
//             <tab.icon size={16} />
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* CONTENT AREA */}
//       <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-t from-[#a5b6d1ff] via-[#414d61ff] to-[#676e7eff]">
        
//         {/* ============================================================== */}
//         {/* TAB 1: PAYMENTS (ENHANCED)                                     */}
//         {/* ============================================================== */}
//         {activeTab === 'payments' && (
//           <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
//             {/* 1. FINANCIAL SUMMARY CARDS */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {/* Card 1: Total */}
//               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
//                 <p className="text-xs text-gray-500 font-bold uppercase mb-1">Contract Value</p>
//                 <p className="text-2xl font-bold text-gray-900">{formatCurrency(financials.total)}</p>
//               </div>

//               {/* Card 2: Received (Net) */}
//               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
//                 <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
//                 <p className="text-xs text-gray-500 font-bold uppercase mb-1">Net Received</p>
//                 <p className="text-2xl font-bold text-green-600">{formatCurrency(financials.received - financials.refunded)}</p>
                
//                 <div className="flex gap-2 mt-1">
//                     {financials.refunded > 0 && (
//                         <span className="text-[10px] bg-red-100 text-red-700 px-1.5 rounded font-bold">
//                             -{formatCurrency(financials.refunded)} Refunded
//                         </span>
//                     )}
//                     {financials.pendingClearance > 0 && (
//                         <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 rounded font-bold">
//                             +{formatCurrency(financials.pendingClearance)} Pending
//                         </span>
//                     )}
//                 </div>
//               </div>

//               {/* Card 3: Balance */}
//               <div className={`p-5 rounded-xl border shadow-sm relative overflow-hidden ${
//                   financials.balance < 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
//               }`}>
//                 {financials.balance < 0 && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
//                 {financials.balance > 0 && <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>}
                
//                 <p className="text-xs text-gray-500 font-bold uppercase mb-1">
//                     {financials.balance < 0 ? 'Credit / Overpaid' : 'Balance Due'}
//                 </p>
//                 <p className={`text-2xl font-bold ${
//                     financials.balance < 0 ? 'text-blue-700' : (financials.balance === 0 ? 'text-gray-400' : 'text-red-600')
//                 }`}>
//                    {financials.balance < 0 ? `+ ${formatCurrency(Math.abs(financials.balance))}` : formatCurrency(financials.balance)}
//                 </p>
//                 {financials.balance === 0 && (
//                     <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">Paid In Full</span>
//                 )}
//               </div>

//               {/* Card 4: Action */}
//               <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center gap-2">
//                  <button 
//                     onClick={() => { setEditingPayment(null); setPaymentModalOpen(true); }}
//                     className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition-all hover:scale-[1.02]"
//                  >
//                     <Plus size={18}/> Record Transaction
//                  </button>
//               </div>
//             </div>

        
//             {/* 3. PAYMENT LEDGER */}
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//                 <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                     <h3 className="font-bold text-gray-700 flex items-center gap-2"><CreditCard size={16}/> Transaction Ledger</h3>
//                 </div>
                
//                 {opsData?.clientPayments.length === 0 ? (
//                     <div className="p-16 text-center text-gray-400 text-sm flex flex-col items-center">
//                         <CreditCard size={32} className="opacity-30 mb-3"/>
//                         <p>No transactions recorded yet.</p>
//                     </div>
//                 ) : (
//                     <div className="overflow-x-auto">
//                     <table className="w-full text-sm text-left">
//                         <thead className="bg-gray-100 text-gray-500 font-bold uppercase text-xs border-b border-gray-200">
//                             <tr>
//                                 <th className="px-6 py-3 w-32">Date</th>
//                                 <th className="px-6 py-3 w-24">Type</th>
//                                 <th className="px-6 py-3 w-32">Mode</th>
//                                 <th className="px-6 py-3 w-40">Ref ID</th>
//                                 <th className="px-6 py-3">Notes / Allocation</th>
//                                 <th className="px-6 py-3 w-24">Status</th>
//                                 <th className="px-6 py-3 text-right w-32">Amount</th>
//                                 <th className="px-6 py-3 w-24 text-center">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {opsData?.clientPayments.map((pay) => (
//                                 <tr key={pay.id} className="hover:bg-gray-50/50 group transition-colors">
//                                     <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">
//                                         {new Date(pay.date).toLocaleDateString()}
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <span className={`flex items-center gap-1 text-xs font-bold ${pay.type === 'Refund' ? 'text-red-600' : 'text-green-600'}`}>
//                                             {pay.type === 'Refund' ? <ArrowUpRight size={12}/> : <ArrowDownLeft size={12}/>}
//                                             {pay.type || 'Payment'}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <span className="bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
//                                             {pay.mode}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 font-mono text-xs text-gray-600">
//                                         {pay.referenceId}
//                                     </td>
//                                     <td className="px-6 py-4 text-gray-500 text-xs">
//                                         {pay.allocation && (
//                                             <div className="text-indigo-600 font-bold mb-0.5 text-[10px] uppercase">
//                                                 {opsData.installments.find(i => i.id === pay.allocation)?.label || 'Allocated'}
//                                             </div>
//                                         )}
//                                         <div className="truncate max-w-[200px]" title={pay.note}>{pay.note || '-'}</div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
//                                             pay.status === 'Cleared' 
//                                             ? 'bg-green-50 text-green-700 border-green-200' 
//                                             : 'bg-orange-50 text-orange-700 border-orange-200'
//                                         }`}>
//                                             {pay.status || 'Cleared'}
//                                         </span>
//                                     </td>
//                                     <td className={`px-6 py-4 text-right font-bold ${pay.type === 'Refund' ? 'text-red-600' : 'text-gray-800'}`}>
//                                         {pay.type === 'Refund' ? '-' : '+'}{formatCurrency(pay.amount)}
//                                     </td>
//                                     <td className="px-6 py-4 text-center">
//                                         <div className="flex items-center justify-center gap-2 group-hover:opacity-100 transition-opacity">
//                                             <button 
//                                                 onClick={() => { setEditingPayment(pay); setPaymentModalOpen(true); }}
//                                                 className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md transition-colors" 
//                                             >
//                                                 <Pencil size={14}/>
//                                             </button>
//                                             <button 
//                                                 onClick={() => handleDeletePayment(pay.id)}
//                                                 className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors" 
//                                             >
//                                                 <Trash2 size={14}/>
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     </div>
//                 )}
//             </div>
//           </div>
//         )}

//         {/* ========================================================== */}
//         {/* TAB 2: VENDOR BOOKINGS (UNCHANGED LAYOUT, DATA UPDATED)    */}
//         {/* ========================================================== */}
    


// {activeTab === 'vendors' && (
//   <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 pb-24">
     
//      {/* 1. TOP TOOLBAR */}
//      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//         <div>
//             <h2 className="font-bold text-gray-800">Manage Bookings</h2>
//             <p className="text-xs text-gray-600">Track costs, assign vendors, and confirm bookings.</p>
//         </div>
//         <div className="flex items-center gap-3">
//             <span className="text-xs font-bold text-gray-500 uppercase">Group By:</span>
//             <div className="flex bg-gray-100 p-1 rounded-lg">
//                 <button onClick={() => setGroupBy('day')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${groupBy === 'day' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
//                     Service Day
//                 </button>
//                 <button onClick={() => setGroupBy('category')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${groupBy === 'category' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
//                     Category
//                 </button>
                
//             </div>
//         </div>
//      </div>

//      {/* 2. GROUPS RENDERER */}
//      <div className="space-y-6">
//         {(() => {
//             // LOGIC: Group the data
//             const groups: Record<string, VendorBooking[]> = {};
            
//             opsData?.vendorBookings.forEach(booking => {
//                 let key = 'Other';
//                 if (groupBy === 'day') {
//                     // Group by Date (or 'TBA')
//                     key = booking.serviceDate && booking.serviceDate !== 'TBA' 
//                         ? `Day ${new Date(booking.serviceDate).getDate()} - ${formatServiceDate(booking.serviceDate)}` 
//                         : 'Unscheduled / TBA';
//                 } else {
//                     // Group by Category
//                     key = booking.category;
//                 }
//                 if (!groups[key]) groups[key] = [];
//                 groups[key].push(booking);
//             });

//             // LOGIC: Render Groups
//             return Object.entries(groups).map(([groupName, items]) => {
//                 const isGroupSelected = items.every(i => selectedIds.has(i.id));

//                 return (
//                     <div key={groupName} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        
//                         {/* Group Header */}
//                         <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-3">
//                             <input 
//                                 type="checkbox" 
//                                 checked={isGroupSelected} 
//                                 onChange={() => toggleGroupSelection(items.map(i => i.id))}
//                                 className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
//                             />
//                             <h3 className="text-sm font-bold text-gray-700">{groupName}</h3>
//                             <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">{items.length}</span>
//                         </div>

//                         {/* Table Header (Only for context) */}
//                         <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-100">
//                              <div className="col-span-4">Service Details</div>
//                              <div className="col-span-3">Vendor Assignment</div>
//                              <div className="col-span-2 text-right">Costing</div>
//                              <div className="col-span-3">Status & Ref</div>
//                         </div>

//                         {/* Items Rows */}
//                         <div className="divide-y divide-gray-100">
//                             {items.map(booking => {
//                                 const isSelected = selectedIds.has(booking.id);
//                                 return (
//                                     <div key={booking.id} className={`grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-gray-50 transition-colors ${isSelected ? 'bg-indigo-50/40' : ''}`}>
                                        
//                                         {/* COL 1: CHECKBOX & NAME */}
//                                         <div className="col-span-4 flex items-start gap-3">
//                                             <input 
//                                                 type="checkbox" 
//                                                 checked={isSelected}
//                                                 onChange={() => toggleSelection(booking.id)}
//                                                 className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                                             />
//                                             <div className="min-w-0">
//                                                 <div className="flex items-center gap-2 mb-0.5">
//                                                     <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
//                                                         booking.category === 'Stay' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 
//                                                         booking.category === 'Transport' ? 'bg-orange-50 text-orange-700 border-orange-100' : 
//                                                         'bg-emerald-50 text-emerald-700 border-emerald-100'
//                                                     }`}>
//                                                         {booking.category.charAt(0)}
//                                                     </span>
//                                                     <p className="text-sm font-medium text-gray-900 truncate" title={booking.name}>{booking.name}</p>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* COL 2: VENDOR SELECT */}
//                                         <div className="col-span-3">
//                                             <select 
//                                                 value={booking.assignedSupplierId || ''}
//                                                 onChange={(e) => handleUpdateBooking(booking.id, 'assignedSupplierId', e.target.value)}
//                                                 className="w-full py-2 pl-2 text-xs border border-gray-400 rounded-md bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
//                                             >
//                                                 <option value="" className="text-gray-400">Select Vendor...</option>
//                                                 {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//                                             </select>
//                                         </div>

//                                         {/* COL 3: COSTING (Est vs Actual) */}
//                                         <div className="col-span-2 text-right">
//                                             <div className="flex flex-col items-end gap-1">
//                                                 <span className="text-xs text-gray-500" title="Estimated Cost">{formatCurrency(booking.estimatedCost)}</span>
//                                                 <div className="flex items-center justify-end gap-1">
//                                                     {/* Quick Copy Button */}
//                                                     {booking.actualCost === 0 && booking.estimatedCost > 0 && (
//                                                         <button 
//                                                             onClick={() => handleUpdateBooking(booking.id, 'actualCost', booking.estimatedCost)}
//                                                             className="text-[10px] text-blue-600 hover:bg-blue-50 p-0.5 rounded" 
//                                                             title="Copy Estimate"
//                                                         >
//                                                             <ArrowDownLeft size={10}/>
//                                                         </button>
//                                                     )}
//                                                     <input 
//                                                         type="number" 
//                                                         value={booking.actualCost || ''} 
//                                                         placeholder="0"
//                                                         onChange={(e) => handleUpdateBooking(booking.id, 'actualCost', parseFloat(e.target.value))}
//                                                         className="w-20 text-right text-xs font-bold py-1.5 px-1 border border-gray-200 rounded focus:border-indigo-500 outline-none"
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* COL 4: STATUS & REF */}
//                                         <div className="col-span-3 space-y-2">
//                                             <div className="flex gap-1">
//                                                 <select 
//                                                     value={booking.bookingStatus} 
//                                                     onChange={(e) => handleUpdateBooking(booking.id, 'bookingStatus', e.target.value)}
//                                                     className={`w-full text-[10px] font-bold px-1 py-1.5 rounded border outline-none ${
//                                                         booking.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'
//                                                     }`}
//                                                 >
//                                                     <option value="Pending">Pending</option>
//                                                     <option value="Requested">Requested</option>
//                                                     <option value="Confirmed">Confirmed</option>
//                                                     <option value="Cancelled">Cancelled</option>
//                                                 </select>
                                                
//                                                 <select 
//                                                     value={booking.paymentStatus} 
//                                                     onChange={(e) => handleUpdateBooking(booking.id, 'paymentStatus', e.target.value)}
//                                                     className={`w-20 text-[10px] font-bold px-1 py-1.5 rounded border outline-none ${
//                                                         booking.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-gray-400 border-gray-200'
//                                                     }`}
//                                                 >
//                                                     <option value="Unpaid">Unpaid</option>
//                                                     <option value="Partial">Partial</option>
//                                                     <option value="Paid">Paid</option>
//                                                 </select>
//                                             </div>
//                                             <input 
//                                                 type="text" 
//                                                 value={booking.confirmationNumber || ''} 
//                                                 placeholder="Confirmation Ref #"
//                                                 onChange={(e) => handleUpdateBooking(booking.id, 'confirmationNumber', e.target.value)}
//                                                 className={`w-full text-[10px] py-1.5 px-2 border rounded outline-none ${
//                                                     booking.confirmationNumber ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 placeholder:text-red-300'
//                                                 }`}
//                                             />
//                                         </div>

//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 );
//             });
//         })()}
//      </div>

//      {/* 3. FLOATING BULK ACTION BAR */}
//      {selectedIds.size > 0 && (
//          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-5">
//              <div className="flex items-center gap-3 pr-4 border-r border-gray-700">
//                  <span className="bg-white text-black text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
//                      {selectedIds.size}
//                  </span>
//                  <span className="text-sm font-bold">Selected</span>
//              </div>
             
//              <div className="flex items-center gap-2">
//                  {/* Bulk Vendor Assign */}
//                  <select 
//                     onChange={(e) => { if(e.target.value) handleBulkAction('assignedSupplierId', e.target.value); }}
//                     className="bg-gray-800 border border-gray-700 text-xs text-white rounded-lg px-3 py-2 outline-none hover:bg-gray-700 transition-colors cursor-pointer"
//                  >
//                      <option value="">Assign Vendor...</option>
//                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//                  </select>

//                  {/* Bulk Status */}
//                  <button 
//                     onClick={() => handleBulkAction('bookingStatus', 'Confirmed')}
//                     className="bg-green-600 hover:bg-green-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
//                  >
//                     Mark Confirmed
//                  </button>

//                  <button 
//                     onClick={() => handleBulkAction('paymentStatus', 'Paid')}
//                     className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
//                  >
//                     Mark Paid
//                  </button>
//              </div>

//              <button 
//                 onClick={() => setSelectedIds(new Set())}
//                 className="ml-2 text-gray-400 hover:text-white"
//              >
//                 <X size={18}/>
//              </button>
//          </div>
//      )}

//   </div>
// )}




// {activeTab === 'docs' && (
//           <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
             
//              {/* Header */}
//              <div className="flex justify-between items-center">
//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-100">Itinerary Documents</h2>
//                     <p className="text-gray-100 text-sm">Download vouchers individually or grouped by service day.</p>
//                 </div>
                
//                 {/* Master Download Button */}
//                 <button 
//                     onClick={() => {
//                         const allConfirmed = opsData?.vendorBookings.filter(b => b.confirmationNumber && b.bookingStatus === 'Confirmed') || [];
//                         if (allConfirmed.length > 0) generateVoucherPdf(allConfirmed, `Full_Booklet_${trip.tripId}`);
//                         else alert("No confirmed bookings available.");
//                     }}
//                     disabled={isGeneratingPdf}
//                     className="bg-gray-900 text-white hover:bg-black px-4 py-2.5 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2"
//                 >
//                     {isGeneratingPdf ? <Loader2 className="animate-spin" size={16}/> : <FileText size={16}/>}
//                     Download Full Trip Booklet
//                 </button>
//              </div>

//              {/* GROUPING LOGIC START */}
//              <div className="space-y-6">
//                 {(() => {
//                     // 1. Group Bookings by Date
//                     const groups: Record<string, VendorBooking[]> = {};
//                     opsData?.vendorBookings.forEach(b => {
//                         // Only show Stay, Transport, Activity
//                         if(!['Stay','Transport','Activity'].includes(b.category)) return;
                        
//                         const dateKey = b.serviceDate && b.serviceDate !== 'TBA' ? b.serviceDate : 'Unscheduled';
//                         if (!groups[dateKey]) groups[dateKey] = [];
//                         groups[dateKey].push(b);
//                     });

//                     // 2. Sort Dates
//                     const sortedDates = Object.keys(groups).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());

//                     if (sortedDates.length === 0) return <div className="text-center text-gray-400 py-10">No service bookings found.</div>;

//                     // 3. Render Groups
//                     return sortedDates.map(dateKey => {
//                         const items = groups[dateKey];
//                         const confirmedItems = items.filter(i => i.bookingStatus === 'Confirmed' && i.confirmationNumber);
//                         const isDayReady = confirmedItems.length > 0;

//                         return (
//                             <div key={dateKey} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                
//                                 {/* A. Day Header */}
//                                 <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                                     <div className="flex items-center gap-3">
//                                         {/* <div className="bg-white border border-gray-200 p-2 rounded-lg text-center min-w-[50px]"> */}
//                                             {/* <span className="block text-xs text-gray-400 font-bold uppercase">Day</span> */}
//                                             {/* Try to find Day Number from itinerary */}
//                                             {/* <span className="block text-lg font-bold text-gray-800">
//                                                 {trip.dayWiseActivities?.find(d => d.date === dateKey)?.dayNumber || "?"}
//                                             </span> */}
//                                         {/* </div> */}
//                                         <div>
//                                             <h3 className="font-bold text-gray-800 text-lg">
//                                                 {dateKey === 'Unscheduled' ? 'Unscheduled Services' : new Date(dateKey).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
//                                             </h3>
//                                             <p className="text-xs text-gray-500 font-medium">
//                                                 {trip.dayWiseActivities?.find(d => d.date === dateKey)?.city || "Various Locations"}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     {/* Day Download Button */}
//                                     <button
//                                         onClick={() => generateVoucherPdf(confirmedItems, `Vouchers_${dateKey}`)}
//                                         disabled={!isDayReady || isGeneratingPdf}
//                                         className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
//                                             isDayReady 
//                                             ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' 
//                                             : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                         }`}
//                                     >
//                                         <Download size={14}/> Download Day Booklet
//                                     </button>
//                                 </div>

//                                 {/* B. Items List */}
//                                 <div className="divide-y divide-gray-100">
//                                     {items.map(booking => {
//                                         const isLocked = !booking.confirmationNumber || booking.bookingStatus !== 'Confirmed';
                                        
//                                         return (
//                                             <div key={booking.id} className="px-6 py-4 flex items-center justify-between group hover:bg-gray-50 transition-colors">
//                                                 <div className="flex items-center gap-4">
//                                                     {/* Icon */}
//                                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
//                                                         booking.category === 'Stay' ? 'bg-indigo-50 text-indigo-600' :
//                                                         booking.category === 'Transport' ? 'bg-orange-50 text-orange-600' :
//                                                         'bg-emerald-50 text-emerald-600'
//                                                     }`}>
//                                                         {booking.category === 'Stay' ? <Building2 size={18}/> : booking.category === 'Transport' ? <MapPin size={18}/> : <Clock size={18}/>}
//                                                     </div>
                                                    
//                                                     {/* Text */}
//                                                     <div>
//                                                         <h4 className="text-sm font-bold text-gray-800">{booking.name}</h4>
//                                                         <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
//                                                             <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">{booking.category}</span>
//                                                             {isLocked ? (
//                                                                 <span className="text-orange-500 flex items-center gap-1"><AlertCircle size={10}/> Pending Conf #</span>
//                                                             ) : (
//                                                                 <span className="text-green-600 flex items-center gap-1 font-mono"><CheckCircle size={10}/> Ref: {booking.confirmationNumber}</span>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* Single Action */}
//                                                 <button
//                                                     onClick={() => generateVoucherPdf([booking], `Voucher_${booking.name}`)}
//                                                     disabled={isLocked || isGeneratingPdf}
//                                                     className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
//                                                         isLocked 
//                                                         ? 'text-gray-300 cursor-not-allowed' 
//                                                         : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
//                                                     }`}
//                                                     title={isLocked ? "Unlock in Vendor Tab" : "Download PDF"}
//                                                 >
//                                                     <Download size={16}/>
//                                                 </button>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                         );
//                     });
//                 })()}
//              </div>
//              {/* GROUPING LOGIC END */}
//           </div>
//         )}

//       </div>

//       {/* --- SMART MODAL --- */}
//       <PaymentModal 
//          isOpen={isPaymentModalOpen} 
//          onClose={() => setPaymentModalOpen(false)} 
//          onSave={handleSavePayment} 
//          editingPayment={editingPayment}
//          currentBalance={financials.balance}
//          installments={opsData?.installments || []}
//       />

//     </div>
//   );
// } 

























"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  ArrowLeft, CreditCard, Building2, FileText, 
  CheckCircle, AlertCircle, Plus, Calendar, Save, 
  Download, Loader2, X, AlertTriangle, User, Briefcase, Mail, Phone,
  Pencil, Trash2, ArrowDownLeft, ArrowUpRight, PieChart,
  MapPin,
  Clock
} from 'lucide-react';
import { 
  getItineraryById, 
  initializeOperations, 
  saveOperationsData,
  StoredItineraryData, 
  OperationsData,
  VendorBooking,
  ClientPayment,
  Installment
} from '@/utils/itineraryStorage';
import { getSuppliers, SupplierData } from '@/utils/srmStorage';

// 👈 NEW: Import User Context for RBAC
import { useUser } from '@/app/context/UserContext'; 

// --- [CHANGED] 1. ENHANCED VOUCHER INTERFACE ---
interface VoucherData {
    id: string;
    type: 'Stay' | 'Transport' | 'Activity' | 'Other';
    status: 'Confirmed' | 'Pending';
    
    // Header Info
    bookingRef: string;     
    internalRef: string;    
    issueDate: string;

    // Client Info
    guestName: string;
    paxCount: number;
    groupName: string;

    // Vendor Info
    vendorName: string;
    vendorPhone: string;
    vendorAddress: string;

    // Service Details
    serviceDate: string;
    serviceTitle: string;   
    serviceSubtitle?: string; 
    
    // The "Grid" Data
    particulars: { label: string; value: string }[]; 
    
    notes?: string;
    agencyContact: string;
}

// --- [UPDATED] HELPER: BUILD VOUCHER DATA ---
const buildVoucherData = (
    booking: VendorBooking, 
    trip: StoredItineraryData, 
    suppliers: SupplierData[]
): VoucherData | null => {
    
    const supplier = suppliers.find(s => s.id === booking.assignedSupplierId);
    let specificDetails: { label: string, value: string }[] = [];
    let title = booking.name;
    let subtitle = "";

    const calculateCheckOut = (startDate: string, nights: number) => {
        if (!startDate || startDate === 'TBA') return 'TBA';
        const d = new Date(startDate);
        if (isNaN(d.getTime())) return startDate; 
        
        d.setDate(d.getDate() + nights);
        return d.toISOString().split('T')[0];
    };
    
    const dayPlans = trip.dayWiseActivities || [];
    
    for (const day of dayPlans) {
        // --- STAY LOGIC ---
        if (booking.category === 'Stay' && day.stays) {
            const item = day.stays.find(s => String(s.id) === booking.serviceId);
            if (item) {
                title = item.hotelName;
                subtitle = `${item.nights} Night(s) Stay`;

                const checkOutDate = calculateCheckOut(booking.serviceDate, item.nights || 0);

                specificDetails.push(
                    { label: "Check-in", value: booking.serviceDate },
                    { label: "Check-out", value: checkOutDate }, 
                    { label: "Room Category", value: item.roomCategory || "Standard" },
                    { label: "Meal Plan", value: "Breakfast Included" }, 
                    { label: "Total Rooms", value: String(item.numRooms) },
                    { label: "Hotel Address", value: supplier?.address || (item as any).city || "Address on request" }
                );
                break;
            }
        }
        // --- TRANSPORT LOGIC ---
        if (booking.category === 'Transport' && day.transports) {
            const item = day.transports.find(t => String(t.id) === booking.serviceId);
            if (item) {
                title = `${item.vehicleType} (${item.subType})`;
                subtitle = item.subType === 'transfer' ? 'Point-to-Point Transfer' : 'Disposal Service';
                specificDetails.push(
                    { label: "Service Date", value: booking.serviceDate },
                    { label: "Pickup Time", value: item.pickupTime || "TBA" },
                    { label: "Pickup Location", value: item.pickupLocation || "TBA" },
                    { label: "Drop/Duration", value: item.subType === 'transfer' ? (item.dropoffLocation || "TBA") : (item.duration || "N/A") },
                    { label: "Vehicle Count", value: String(item.vehicleCount) },
                    { label: "Driver Details", value: "To be provided 24hrs prior" }
                );
                break;
            }
        }
        // --- ACTIVITY LOGIC ---
        if (booking.category === 'Activity' && day.activities) {
            const item = day.activities.find(a => String(a.id) === booking.serviceId);
            if (item) {
                title = item.heading;
                subtitle = "Activity / Tour";
                specificDetails.push(
                    { label: "Activity Date", value: booking.serviceDate },
                    { label: "Start Time", value: item.startTime || "TBA" },
                    { label: "Duration", value: item.duration || "N/A" },
                    { label: "Meeting Point", value: item.pickupLocation || "Hotel Lobby" },
                    { label: "Guide Service", value: item.guideType === 'guided' ? "Included" : "Self-Guided" },
                    { label: "Ticket Status", value: "Included" }
                );
                break;
            }
        }
    }

    return {
        id: booking.id,
        type: booking.category as any,
        status: booking.bookingStatus === 'Confirmed' ? 'Confirmed' : 'Pending',
        bookingRef: booking.confirmationNumber || "PENDING",
        internalRef: trip.tripId || "N/A",
        issueDate: new Date().toLocaleDateString(),
        guestName: trip.leadGuestName || "Lead Guest",
        paxCount: Number(trip.numberOfTravelers) || 1,
        groupName: trip.tripName,
        vendorName: supplier?.name || "Service Provider",
        vendorPhone: supplier?.phone || "Not Available",
        vendorAddress: supplier?.address || "Address on request",
        
        serviceDate: booking.serviceDate,
        serviceTitle: title,
        serviceSubtitle: subtitle,
        particulars: specificDetails,
        agencyContact: "+91 98765 43210", 
        notes: "Please present this voucher strictly for the services mentioned above. Any extras must be settled directly."
    };
};

// --- 3. "TABULAR GRID" PDF TEMPLATE ---
const VoucherPrintTemplate = ({ data }: { data: VoucherData }) => {
    const colors = {
        red: '#c8102e',
        navy:"#07002cff" ,
        gold: '#c5a065', 
        beige: '#fffbeb',
        dark: '#111827', 
        gray: '#6b7280', 
        border: '#e5e7eb', 
        headerBg: '#f9fafb',
        white: '#ffffff'
    };

    return (
        <div 
            id={`voucher-${data.id}`} 
            style={{ 
                width: '210mm', 
                minHeight: '297mm', 
                backgroundColor: colors.white, 
                color: colors.dark,
                fontFamily: 'Arial, sans-serif',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box'
            }}
        >
            {/* 1. HEADER SECTION */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', borderBottom: `4px solid ${colors.red}`, marginTop: '0px', marginLeft: '0px' }}>
                <div style={{ paddingBottom: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                     <div style={{ fontSize: '38px', fontWeight: '900', color: colors.navy, textTransform: 'uppercase', lineHeight: '1', letterSpacing: '0px', marginLeft: '25px' }}>TRAVDEK</div>
                     <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#555', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '8px', marginLeft: '26px' }}>Official Service Voucher</div>
                </div>
                
                <div style={{ backgroundColor: colors.red, color: colors.white, width: '240px', padding: '25px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '5px', opacity: 1 }}>Confirmation Ref </div>
                    <div  style={ {fontSize: '24px', fontFamily: 'Courier New, monospace', fontWeight: 'bold' , marginTop:'1px' }} >{data.bookingRef}</div>
                    <div style={{ marginTop: '2px', padding: '4px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>{data.status}</div>
                </div>
            </div>

            {/* 2. INFO COLUMNS (Guest & Vendor) */}
            <div style={{ padding: '40px', display: 'flex', gap: '50px'  }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#303030ff', marginBottom: '10px' }}>GUEST DETAILS</h3>
                    <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>{data.guestName}</div>
                    <div style={{ fontSize: '14px', color: '#444', marginBottom: '4px' }}><span style={{ color: '#464646ff' , fontWeight: 'bold' }}>Group:</span> {data.groupName}</div>
                    <div style={{ fontSize: '14px', color: '#444' }}><span style={{ color: '#464646ff' , fontWeight: 'bold'}}>Travelers:</span> <strong>{data.paxCount} Pax</strong></div>
                </div>
                <div style={{ width: '1px', backgroundColor: '#eee', height: '80px', marginTop: '10px' }}></div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#303030ff', textTransform: 'uppercase', letterSpacing: '0px', marginBottom: '10px' }}>Service Provider</h3>
                    <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>{data.vendorName}</div>
                    <div style={{ fontSize: '14px', color: '#444', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: '#444'  , fontWeight: 'bold'}}>Address:</span> {data.vendorAddress}</div>
                    <div style={{ fontSize: '14px', color: '#444', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: '#444', fontWeight: 'bold' }}>Phone:</span> {data.vendorPhone}</div>
                </div>
            </div>

            {/* 3. SERVICE PARTICULARS CARD (The Table) */}
            <div style={{ padding: '0 40px', flex: 1 }}>
                <div style={{ border: `2px solid ${colors.gold}`, borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: colors.red, color: colors.white, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px' }}>Service Details</span>
                        <span style={{ fontSize: '13px' }}>Date: {data.serviceDate}</span>
                    </div>
                    <div style={{ padding: '24px 20px', backgroundColor: '#fff', borderBottom: `1px solid ${colors.border}` }}>
                        <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px' }}>{data.serviceTitle}</div>
                        {data.serviceSubtitle && (<div style={{ fontSize: '14px', color: '#666' }}>{data.serviceSubtitle}</div>)}
                    </div>
                    <div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <tbody>
                                {data.particulars.map((row, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: '14px 20px', fontWeight: 'bold', color: '#555', textTransform: 'uppercase', fontSize: '11px', backgroundColor: colors.headerBg, borderBottom: `1px solid ${colors.border}`, borderRight: `1px solid ${colors.border}`, width: '35%' }}>{row.label}</td>
                                        <td style={{ padding: '14px 20px', color: '#111', fontWeight: '600', backgroundColor: colors.white, borderBottom: `1px solid ${colors.border}` }}>{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ padding: '20px', backgroundColor: colors.beige, color: '#854d0e', borderTop: `1px solid ${colors.gold}` }}>
                        <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', marginBottom: '4px', color: '#92400e' }}>Important Note:</div>
                        <div style={{ fontSize: '13px', lineHeight: '1.4' }}>{data.notes}</div>
                    </div>
                </div>
            </div>

            {/* 4. FOOTER */}
            <div style={{ padding: '40px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#999' }}>
                <div>Generated by TRAVDEK System<br/>{data.issueDate}</div>
                <div style={{ textAlign: 'right' }}>Emergency Ops: <strong>{data.agencyContact}</strong><br/>Valid only for services specified.</div>
            </div>
        </div>
    );
};


// --- SUB-COMPONENT: SMART PAYMENT MODAL ---
interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ClientPayment) => void;
    editingPayment?: ClientPayment | null;
    currentBalance: number;
    installments: Installment[];
}

const PaymentModal = ({ isOpen, onClose, onSave, editingPayment, currentBalance, installments }: PaymentModalProps) => {
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [mode, setMode] = useState('Bank Transfer');
    const [status, setStatus] = useState<'Cleared' | 'Pending'>('Cleared');
    const [type, setType] = useState<'Payment' | 'Refund'>('Payment'); 
    const [refId, setRefId] = useState('');
    const [allocation, setAllocation] = useState(''); 
    const [note, setNote] = useState('');

    useEffect(() => {
        if (editingPayment) {
            setAmount(String(editingPayment.amount));
            setDate(editingPayment.date);
            setMode(editingPayment.mode);
            setStatus(editingPayment.status || 'Cleared');
            setType(editingPayment.type || 'Payment');
            setRefId(editingPayment.referenceId);
            setAllocation(editingPayment.allocation || '');
            setNote(editingPayment.note || '');
        } else {
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setMode('Bank Transfer');
            setStatus('Cleared');
            setType('Payment');
            setRefId('');
            setAllocation('');
            setNote('');
        }
    }, [editingPayment, isOpen]);

    if (!isOpen) return null;

    const numAmount = parseFloat(amount || '0');
    const effectiveBalance = editingPayment 
        ? (currentBalance + (editingPayment.type === 'Payment' ? editingPayment.amount : -editingPayment.amount)) 
        : currentBalance;
    
    const isOverpayment = type === 'Payment' && numAmount > effectiveBalance;

    const handleSubmit = () => {
        if (!amount || !refId) return alert("Amount and Reference ID are required");
        
        onSave({ 
            id: editingPayment ? editingPayment.id : Date.now().toString(),
            date, 
            amount: parseFloat(amount), 
            mode: mode as any,
            status,
            type,
            referenceId: refId,
            allocation,
            note
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
                <div className={`p-4 text-white flex justify-between items-center ${type === 'Refund' ? 'bg-red-600' : 'bg-gray-900'}`}>
                    <h3 className="font-bold flex items-center gap-2">
                        {type === 'Refund' ? <ArrowUpRight size={18} className="text-white"/> : <ArrowDownLeft size={18} className="text-green-400"/>} 
                        {editingPayment ? 'Edit Transaction' : 'Record Transaction'}
                    </h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded"><X size={20}/></button>
                </div>
                
                <div className="p-6 space-y-5">
                    {isOverpayment && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded flex items-start gap-3">
                            <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={18}/>
                            <div className="text-xs text-yellow-800">
                                <span className="font-bold block">Overpayment Warning</span>
                                This amount (${numAmount.toLocaleString()}) exceeds the pending balance (${effectiveBalance.toLocaleString()}). 
                                This will create a credit on the account.
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Amount ($)</label>
                            <input 
                                type="number" 
                                placeholder="0.00" 
                                value={amount} 
                                onChange={e=>setAmount(e.target.value)} 
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Transaction Date</label>
                            <input 
                                type="date" 
                                value={date} 
                                onChange={e=>setDate(e.target.value)} 
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">Method</label>
                             <select value={mode} onChange={e=>setMode(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white">
                                {['Bank Transfer','Credit Card','Cash','UPI','Cheque'].map(m=><option key={m} value={m}>{m}</option>)}
                             </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Clearance Status</label>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button 
                                    onClick={() => setStatus('Cleared')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${status === 'Cleared' ? 'bg-green-500 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
                                >Cleared</button>
                                <button 
                                    onClick={() => setStatus('Pending')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${status === 'Pending' ? 'bg-orange-400 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
                                >Pending</button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Reference ID / Cheque No.</label>
                        <input type="text" placeholder="e.g. TXN-889922" value={refId} onChange={e=>setRefId(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"/>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Notes (Optional)</label>
                        <textarea 
                            rows={2}
                            placeholder="e.g. Received from Wells Fargo account ending in 1234" 
                            value={note} 
                            onChange={e=>setNote(e.target.value)} 
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className={`px-6 py-2.5 text-xs font-bold text-white rounded-lg shadow-lg transition-all flex items-center gap-2 ${type === 'Refund' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-black'}`}>
                        <Save size={14}/> {editingPayment ? 'Update Record' : 'Save Record'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
export default function TripOperationsPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.tripId as string;
  
  // 👈 NEW: Get logged in user to check if they are an agent
  const { user } = useUser(); 
  
  const [trip, setTrip] = useState<StoredItineraryData | null>(null);
  const [opsData, setOpsData] = useState<OperationsData | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [activeTab, setActiveTab] = useState<'payments' | 'vendors' | 'docs'>('payments');

  // --- VOUCHER PRINTING STATE ---
  const [printingVouchers, setPrintingVouchers] = useState<VoucherData[]>([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  
  // Modal State
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<ClientPayment | null>(null);
  
  const [loading, setLoading] = useState(true);

  // --- VENDOR TAB STATE ---
  const [groupBy, setGroupBy] = useState<'day' | 'category'>('day');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Helper: Toggle Selection
  const toggleSelection = (id: string) => {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
  };

  // Helper: Select All in Group
  const toggleGroupSelection = (ids: string[]) => {
      const allSelected = ids.every(id => selectedIds.has(id));
      const newSet = new Set(selectedIds);
      ids.forEach(id => allSelected ? newSet.delete(id) : newSet.add(id));
      setSelectedIds(newSet);
  };

  // Helper: Bulk Update Handler
  const handleBulkAction = (field: keyof VendorBooking, value: any) => {
      if(!opsData) return;
      const updatedBookings = opsData.vendorBookings.map(b => 
          selectedIds.has(b.id) ? { ...b, [field]: value } : b
      );
      const updatedOps = { ...opsData, vendorBookings: updatedBookings };
      setOpsData(updatedOps);
      saveOperationsData(tripId, updatedOps);
      setSelectedIds(new Set()); 
  };

// --- 1. LOAD DATA (Corrected for MongoDB Async) ---
  useEffect(() => {
    const loadData = async () => {
      if (tripId) {
        // 👈 CRITICAL: We MUST add 'await' because this returns a Promise now
        const rawData = await getItineraryById(tripId);
        
        if (rawData) {
            const initializedData = initializeOperations(rawData);
            setTrip(initializedData);
            setOpsData(initializedData.operations || null);

            // 👈 ALSO ADD 'await' HERE to ensure data is saved before moving on
            if(!rawData.operations) {
               await saveOperationsData(tripId, initializedData.operations);
            }
        }
        
        const allSuppliers = getSuppliers();
        setSuppliers(await allSuppliers);
        setLoading(false);
      }
    };

    loadData();
  }, [tripId]);


  // --- 2. SMART FINANCIAL CALCULATIONS ---
  const financials = useMemo(() => {
      if(!trip || !opsData) return { total: 0, received: 0, refunded: 0, pendingClearance: 0, balance: 0, status: 'Unpaid', vendorSpend: 0 };
      
      const total = trip.finalSellPrice || 0;
      
      const payments = opsData.clientPayments.filter(p => p.type !== 'Refund');
      const refunds = opsData.clientPayments.filter(p => p.type === 'Refund');

      const received = payments.filter(p => p.status === 'Cleared').reduce((acc, curr) => acc + curr.amount, 0);
      const refunded = refunds.filter(p => p.status === 'Cleared').reduce((acc, curr) => acc + curr.amount, 0);
      const pendingClearance = payments.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
      
      const netReceived = received - refunded;
      const balance = total - netReceived;
      
      const vendorSpend = opsData.vendorBookings.reduce((acc, curr) => acc + (curr.actualCost > 0 ? curr.actualCost : 0), 0);
      
      let status = 'Unpaid';
      if (balance <= 0) status = 'Paid';
      else if (netReceived > 0) status = 'Partial';

      return { total, received, refunded, pendingClearance, balance, status, vendorSpend };
  }, [trip, opsData]);

  // --- 3. ACTIONS ---
  
  // SAVE Payment
  const handleSavePayment = (payment: ClientPayment) => {
      if(!opsData) return;
      
      let updatedPayments = [...opsData.clientPayments];
      const existingIndex = updatedPayments.findIndex(p => p.id === payment.id);

      if (existingIndex >= 0) {
          updatedPayments[existingIndex] = payment;
      } else {
          updatedPayments.push(payment);
      }

      const updatedOps = { ...opsData, clientPayments: updatedPayments };
      setOpsData(updatedOps);
      saveOperationsData(tripId, updatedOps);
  };

  // DELETE Payment
  const handleDeletePayment = (id: string) => {
      if(!confirm("Are you sure you want to permanently delete this payment record?")) return;
      if(!opsData) return;
      const updatedPayments = opsData.clientPayments.filter(p => p.id !== id);
      const updatedOps = { ...opsData, clientPayments: updatedPayments };
      setOpsData(updatedOps);
      saveOperationsData(tripId, updatedOps);
  };

  // Generic Vendor Update
  const handleUpdateBooking = (id: string, field: keyof VendorBooking, value: any) => {
      if(!opsData) return;
      const updatedBookings = opsData.vendorBookings.map(b => 
          b.id === id ? { ...b, [field]: value } : b
      );
      const updatedOps = { ...opsData, vendorBookings: updatedBookings };
      setOpsData(updatedOps);
      saveOperationsData(tripId, updatedOps);
  };

  // Format Helpers
  const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: trip?.selectedCurrency || 'USD' }).format(val);
  };

  const formatServiceDate = (dateStr: string) => {
      if (!dateStr || dateStr === 'TBA') return 'TBA';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };



  // --- PDF GENERATOR ---
  const generateVoucherPdf = async (bookingsToPrint: VendorBooking[], fileName: string) => {
      if (!trip) return;
      setIsGeneratingPdf(true);
      
      const voucherQueue = bookingsToPrint
        .map(b => buildVoucherData(b, trip, suppliers))
        .filter((v): v is VoucherData => v !== null);

      if (voucherQueue.length === 0) {
          alert("No valid voucher data found.");
          setIsGeneratingPdf(false);
          return;
      }

      setPrintingVouchers(voucherQueue);

      setTimeout(async () => {
          if (!printRef.current) {
              console.error("Print Ref not found");
              setIsGeneratingPdf(false);
              return;
          }

          try {
              const element = printRef.current;
              
              const canvas = await html2canvas(element, { 
                  scale: 2, 
                  useCORS: true,
                  logging: false
              });
              
              const imgData = canvas.toDataURL('image/jpeg', 0.95);
              const pdf = new jsPDF('p', 'mm', 'a4');
              const pdfWidth = 210; 
              
              for (let i = 0; i < voucherQueue.length; i++) {
                 if (i > 0) pdf.addPage();
                 const pageHeightInCanvas = (canvas.width * 297) / 210;
                 pdf.addImage(
                    imgData, 
                    'JPEG', 
                    0, 
                    -(i * 297), 
                    pdfWidth, 
                    (canvas.height * pdfWidth) / canvas.width
                 );
              }

              pdf.save(`${fileName}.pdf`);
          } catch (err) {
              console.error("PDF Generation Error:", err);
              alert("Failed to generate PDF. Check console for details.");
          } finally {
              setIsGeneratingPdf(false);
              setPrintingVouchers([]); 
          }
      }, 2000); 
  };

  if (loading || !trip) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>;

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden relative">
    
      {/* --- HIDDEN PRINTER ROOM --- */}
      <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: '-10000px', 
          width: '210mm', 
          backgroundColor: '#ffffff', 
          zIndex: -50 
      }}>
         <div id="voucher-print-container" ref={printRef}>
            {printingVouchers.map((vData, idx) => (
                <VoucherPrintTemplate key={idx} data={vData} />
            ))}
         </div>
      </div>
      
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600"/>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Operations Dashboard
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  trip.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' : 
                  'bg-green-100 text-green-700 border-green-200'
              }`}>
                {trip.bookingStatus?.toUpperCase()}
              </span>
            </h1>
            <p className="text-sm text-gray-500">Managing: {trip.tripName} ({trip.tripId})</p>
          </div>
        </div>
        <div className="text-right">
           <p className="text-xs font-bold text-gray-500 uppercase">Total Value</p>
           <p className="text-lg font-bold text-green-700">{formatCurrency(trip.finalSellPrice || 0)}</p>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white border-b border-gray-200  px-6 flex gap-6 shadow-sm z-10">
        {[
          { id: 'payments', label: 'Client Payments', icon: CreditCard },
          { id: 'vendors', label: 'Vendor Bookings', icon: Building2 },
          { id: 'docs', label: 'Documents & Vouchers', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-t from-[#a5b6d1ff] via-[#414d61ff] to-[#676e7eff]">
        
        {/* ============================================================== */}
        {/* TAB 1: PAYMENTS */}
        {/* ============================================================== */}
        {activeTab === 'payments' && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* 1. FINANCIAL SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Contract Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(financials.total)}</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Net Received</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(financials.received - financials.refunded)}</p>
                
                <div className="flex gap-2 mt-1">
                    {financials.refunded > 0 && (
                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 rounded font-bold">
                            -{formatCurrency(financials.refunded)} Refunded
                        </span>
                    )}
                    {financials.pendingClearance > 0 && (
                        <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 rounded font-bold">
                            +{formatCurrency(financials.pendingClearance)} Pending
                        </span>
                    )}
                </div>
              </div>

              <div className={`p-5 rounded-xl border shadow-sm relative overflow-hidden ${
                  financials.balance < 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              }`}>
                {financials.balance < 0 && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
                {financials.balance > 0 && <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>}
                
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">
                    {financials.balance < 0 ? 'Credit / Overpaid' : 'Balance Due'}
                </p>
                <p className={`text-2xl font-bold ${
                    financials.balance < 0 ? 'text-blue-700' : (financials.balance === 0 ? 'text-gray-400' : 'text-red-600')
                }`}>
                   {financials.balance < 0 ? `+ ${formatCurrency(Math.abs(financials.balance))}` : formatCurrency(financials.balance)}
                </p>
                {financials.balance === 0 && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">Paid In Full</span>
                )}
              </div>

              {/* Card 4: Action (👈 NEW: Hidden for Agents) */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center gap-2">
                 {user?.role !== 'agent' ? (
                     <button 
                        onClick={() => { setEditingPayment(null); setPaymentModalOpen(true); }}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition-all hover:scale-[1.02]"
                     >
                        <Plus size={18}/> Record Transaction
                     </button>
                 ) : (
                     <div className="text-center text-xs text-gray-400">
                         <CreditCard size={24} className="mx-auto mb-2 opacity-30"/>
                         Ledger is view-only.
                     </div>
                 )}
              </div>
            </div>

        
            {/* 3. PAYMENT LEDGER */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2"><CreditCard size={16}/> Transaction Ledger</h3>
                </div>
                
                {opsData?.clientPayments.length === 0 ? (
                    <div className="p-16 text-center text-gray-400 text-sm flex flex-col items-center">
                        <CreditCard size={32} className="opacity-30 mb-3"/>
                        <p>No transactions recorded yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-500 font-bold uppercase text-xs border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 w-32">Date</th>
                                <th className="px-6 py-3 w-24">Type</th>
                                <th className="px-6 py-3 w-32">Mode</th>
                                <th className="px-6 py-3 w-40">Ref ID</th>
                                <th className="px-6 py-3">Notes / Allocation</th>
                                <th className="px-6 py-3 w-24">Status</th>
                                <th className="px-6 py-3 text-right w-32">Amount</th>
                                {/* 👈 NEW: Hide Actions Column Header for Agents */}
                                {user?.role !== 'agent' && <th className="px-6 py-3 w-24 text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {opsData?.clientPayments.map((pay) => (
                                <tr key={pay.id} className="hover:bg-gray-50/50 group transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">
                                        {new Date(pay.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1 text-xs font-bold ${pay.type === 'Refund' ? 'text-red-600' : 'text-green-600'}`}>
                                            {pay.type === 'Refund' ? <ArrowUpRight size={12}/> : <ArrowDownLeft size={12}/>}
                                            {pay.type || 'Payment'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                            {pay.mode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                                        {pay.referenceId}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {pay.allocation && (
                                            <div className="text-indigo-600 font-bold mb-0.5 text-[10px] uppercase">
                                                {opsData.installments.find(i => i.id === pay.allocation)?.label || 'Allocated'}
                                            </div>
                                        )}
                                        <div className="truncate max-w-[200px]" title={pay.note}>{pay.note || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                                            pay.status === 'Cleared' 
                                            ? 'bg-green-50 text-green-700 border-green-200' 
                                            : 'bg-orange-50 text-orange-700 border-orange-200'
                                        }`}>
                                            {pay.status || 'Cleared'}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${pay.type === 'Refund' ? 'text-red-600' : 'text-gray-800'}`}>
                                        {pay.type === 'Refund' ? '-' : '+'}{formatCurrency(pay.amount)}
                                    </td>
                                    {/* 👈 NEW: Hide Actions Column Data for Agents */}
                                    {user?.role !== 'agent' && (
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => { setEditingPayment(pay); setPaymentModalOpen(true); }}
                                                    className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md transition-colors" 
                                                >
                                                    <Pencil size={14}/>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeletePayment(pay.id)}
                                                    className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors" 
                                                >
                                                    <Trash2 size={14}/>
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                )}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: VENDOR BOOKINGS (SECURED FOR AGENTS)                */}
        {/* ========================================================== */}
        {activeTab === 'vendors' && (
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 pb-24">
             
             {/* 1. TOP TOOLBAR */}
             <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div>
                    <h2 className="font-bold text-gray-800">Service Logistics</h2>
                    <p className="text-xs text-gray-600">Track operations and booking status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500 uppercase">Group By:</span>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => setGroupBy('day')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${groupBy === 'day' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                            Service Day
                        </button>
                        <button onClick={() => setGroupBy('category')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${groupBy === 'category' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                            Category
                        </button>
                        
                    </div>
                </div>
             </div>

             {/* 2. GROUPS RENDERER */}
             <div className="space-y-6">
                {(() => {
                    // LOGIC: Group the data
                    const groups: Record<string, VendorBooking[]> = {};
                    
                    opsData?.vendorBookings.forEach(booking => {
                        let key = 'Other';
                        if (groupBy === 'day') {
                            key = booking.serviceDate && booking.serviceDate !== 'TBA' 
                                ? `Day ${new Date(booking.serviceDate).getDate()} - ${formatServiceDate(booking.serviceDate)}` 
                                : 'Unscheduled / TBA';
                        } else {
                            key = booking.category;
                        }
                        if (!groups[key]) groups[key] = [];
                        groups[key].push(booking);
                    });

                    // LOGIC: Render Groups
                    return Object.entries(groups).map(([groupName, items]) => {
                        const isGroupSelected = items.every(i => selectedIds.has(i.id));

                        return (
                            <div key={groupName} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                
                                {/* Group Header */}
                                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-3">
                                    {/* 👈 NEW: Hide Checkbox for Agents */}
                                    {user?.role !== 'agent' && (
                                        <input 
                                            type="checkbox" 
                                            checked={isGroupSelected} 
                                            onChange={() => toggleGroupSelection(items.map(i => i.id))}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        />
                                    )}
                                    <h3 className="text-sm font-bold text-gray-700">{groupName}</h3>
                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">{items.length}</span>
                                </div>

                                {/* Table Header (Dynamic Grid based on Role) */}
                                <div className={`grid gap-4 px-4 py-2 bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-100 ${
                                    user?.role === 'agent' ? 'grid-cols-8' : 'grid-cols-12'
                                }`}>
                                     <div className={user?.role === 'agent' ? 'col-span-5' : 'col-span-4'}>Service Details</div>
                                     {/* 👈 NEW: Hide these columns for Agents */}
                                     {user?.role !== 'agent' && <div className="col-span-3">Vendor Assignment</div>}
                                     {user?.role !== 'agent' && <div className="col-span-2 text-right">Costing</div>}
                                     <div className="col-span-3">Status & Ref</div>
                                </div>

                                {/* Items Rows */}
                                <div className="divide-y divide-gray-100">
                                    {items.map(booking => {
                                        const isSelected = selectedIds.has(booking.id);
                                        return (
                                            <div key={booking.id} className={`grid gap-4 px-4 py-3 items-center hover:bg-gray-50 transition-colors ${
                                                user?.role === 'agent' ? 'grid-cols-8' : 'grid-cols-12'
                                            } ${isSelected ? 'bg-indigo-50/40' : ''}`}>
                                                
                                                {/* COL 1: CHECKBOX & NAME */}
                                                <div className={`${user?.role === 'agent' ? 'col-span-5' : 'col-span-4'} flex items-start gap-3`}>
                                                    {/* 👈 NEW: Hide Checkbox for Agents */}
                                                    {user?.role !== 'agent' && (
                                                        <input 
                                                            type="checkbox" 
                                                            checked={isSelected}
                                                            onChange={() => toggleSelection(booking.id)}
                                                            className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                                                booking.category === 'Stay' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 
                                                                booking.category === 'Transport' ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                                                                'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                            }`}>
                                                                {booking.category.charAt(0)}
                                                            </span>
                                                            <p className="text-sm font-medium text-gray-900 truncate" title={booking.name}>{booking.name}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 👈 NEW: Hide COL 2 (Vendor) and COL 3 (Costing) entirely for Agents */}
                                                {user?.role !== 'agent' && (
                                                    <>
                                                        <div className="col-span-3">
                                                            <select 
                                                                value={booking.assignedSupplierId || ''}
                                                                onChange={(e) => handleUpdateBooking(booking.id, 'assignedSupplierId', e.target.value)}
                                                                className="w-full py-2 pl-2 text-xs border border-gray-400 rounded-md bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                                            >
                                                                <option value="" className="text-gray-400">Select Vendor...</option>
                                                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                            </select>
                                                        </div>

                                                        <div className="col-span-2 text-right">
                                                            <div className="flex flex-col items-end gap-1">
                                                                <span className="text-xs text-gray-500" title="Estimated Cost">{formatCurrency(booking.estimatedCost)}</span>
                                                                <div className="flex items-center justify-end gap-1">
                                                                    {booking.actualCost === 0 && booking.estimatedCost > 0 && (
                                                                        <button 
                                                                            onClick={() => handleUpdateBooking(booking.id, 'actualCost', booking.estimatedCost)}
                                                                            className="text-[10px] text-blue-600 hover:bg-blue-50 p-0.5 rounded" 
                                                                            title="Copy Estimate"
                                                                        >
                                                                            <ArrowDownLeft size={10}/>
                                                                        </button>
                                                                    )}
                                                                    <input 
                                                                        type="number" 
                                                                        value={booking.actualCost || ''} 
                                                                        placeholder="0"
                                                                        onChange={(e) => handleUpdateBooking(booking.id, 'actualCost', parseFloat(e.target.value))}
                                                                        className="w-20 text-right text-xs font-bold py-1.5 px-1 border border-gray-200 rounded focus:border-indigo-500 outline-none"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* COL 4: STATUS & REF (Read-only for Agents) */}
                                                <div className="col-span-3 space-y-2">
                                                    {user?.role === 'agent' ? (
                                                        // 👈 AGENT VIEW: Just show text, no dropdowns
                                                        <div className="flex flex-col gap-1">
                                                            <span className={`inline-block w-fit text-[10px] font-bold px-2 py-1 rounded border ${
                                                                booking.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                                                            }`}>
                                                                {booking.bookingStatus}
                                                            </span>
                                                            {booking.confirmationNumber && (
                                                                <span className="text-[11px] font-mono text-gray-600 bg-gray-50 px-1 py-0.5 border rounded">
                                                                    Ref: {booking.confirmationNumber}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        // 👈 ADMIN/EMPLOYEE VIEW: Show interactive dropdowns
                                                        <>
                                                            <div className="flex gap-1">
                                                                <select 
                                                                    value={booking.bookingStatus} 
                                                                    onChange={(e) => handleUpdateBooking(booking.id, 'bookingStatus', e.target.value)}
                                                                    className={`w-full text-[10px] font-bold px-1 py-1.5 rounded border outline-none ${
                                                                        booking.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                                                                    }`}
                                                                >
                                                                    <option value="Pending">Pending</option>
                                                                    <option value="Requested">Requested</option>
                                                                    <option value="Confirmed">Confirmed</option>
                                                                    <option value="Cancelled">Cancelled</option>
                                                                </select>
                                                                
                                                                <select 
                                                                    value={booking.paymentStatus} 
                                                                    onChange={(e) => handleUpdateBooking(booking.id, 'paymentStatus', e.target.value)}
                                                                    className={`w-20 text-[10px] font-bold px-1 py-1.5 rounded border outline-none ${
                                                                        booking.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-gray-400 border-gray-200'
                                                                    }`}
                                                                >
                                                                    <option value="Unpaid">Unpaid</option>
                                                                    <option value="Partial">Partial</option>
                                                                    <option value="Paid">Paid</option>
                                                                </select>
                                                            </div>
                                                            <input 
                                                                type="text" 
                                                                value={booking.confirmationNumber || ''} 
                                                                placeholder="Confirmation Ref #"
                                                                onChange={(e) => handleUpdateBooking(booking.id, 'confirmationNumber', e.target.value)}
                                                                className={`w-full text-[10px] py-1.5 px-2 border rounded outline-none ${
                                                                    booking.confirmationNumber ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 placeholder:text-red-300'
                                                                }`}
                                                            />
                                                        </>
                                                    )}
                                                </div>

                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    });
                })()}
             </div>

             {/* 3. FLOATING BULK ACTION BAR (👈 NEW: Hidden for Agents) */}
             {user?.role !== 'agent' && selectedIds.size > 0 && (
                 <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-5">
                     <div className="flex items-center gap-3 pr-4 border-r border-gray-700">
                         <span className="bg-white text-black text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                             {selectedIds.size}
                         </span>
                         <span className="text-sm font-bold">Selected</span>
                     </div>
                     
                     <div className="flex items-center gap-2">
                         <select 
                            onChange={(e) => { if(e.target.value) handleBulkAction('assignedSupplierId', e.target.value); }}
                            className="bg-gray-800 border border-gray-700 text-xs text-white rounded-lg px-3 py-2 outline-none hover:bg-gray-700 transition-colors cursor-pointer"
                         >
                             <option value="">Assign Vendor...</option>
                             {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                         </select>

                         <button 
                            onClick={() => handleBulkAction('bookingStatus', 'Confirmed')}
                            className="bg-green-600 hover:bg-green-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                         >
                            Mark Confirmed
                         </button>

                         <button 
                            onClick={() => handleBulkAction('paymentStatus', 'Paid')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                         >
                            Mark Paid
                         </button>
                     </div>

                     <button 
                        onClick={() => setSelectedIds(new Set())}
                        className="ml-2 text-gray-400 hover:text-white"
                     >
                        <X size={18}/>
                     </button>
                 </div>
             )}

          </div>
        )}


        {/* ========================================================== */}
        {/* TAB 3: DOCUMENTS (Open for Everyone)                       */}
        {/* ========================================================== */}
        {activeTab === 'docs' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
             
             {/* Header */}
             <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-100">Itinerary Documents</h2>
                    <p className="text-gray-100 text-sm">Download vouchers individually or grouped by service day.</p>
                </div>
                
                {/* Master Download Button */}
                <button 
                    onClick={() => {
                        const allConfirmed = opsData?.vendorBookings.filter(b => b.confirmationNumber && b.bookingStatus === 'Confirmed') || [];
                        if (allConfirmed.length > 0) generateVoucherPdf(allConfirmed, `Full_Booklet_${trip.tripId}`);
                        else alert("No confirmed bookings available.");
                    }}
                    disabled={isGeneratingPdf}
                    className="bg-gray-900 text-white hover:bg-black px-4 py-2.5 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2"
                >
                    {isGeneratingPdf ? <Loader2 className="animate-spin" size={16}/> : <FileText size={16}/>}
                    Download Full Trip Booklet
                </button>
             </div>

             {/* GROUPING LOGIC START */}
             <div className="space-y-6">
                {(() => {
                    // 1. Group Bookings by Date
                    const groups: Record<string, VendorBooking[]> = {};
                    opsData?.vendorBookings.forEach(b => {
                        if(!['Stay','Transport','Activity'].includes(b.category)) return;
                        
                        const dateKey = b.serviceDate && b.serviceDate !== 'TBA' ? b.serviceDate : 'Unscheduled';
                        if (!groups[dateKey]) groups[dateKey] = [];
                        groups[dateKey].push(b);
                    });

                    // 2. Sort Dates
                    const sortedDates = Object.keys(groups).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());

                    if (sortedDates.length === 0) return <div className="text-center text-gray-400 py-10">No service bookings found.</div>;

                    // 3. Render Groups
                    return sortedDates.map(dateKey => {
                        const items = groups[dateKey];
                        const confirmedItems = items.filter(i => i.bookingStatus === 'Confirmed' && i.confirmationNumber);
                        const isDayReady = confirmedItems.length > 0;

                        return (
                            <div key={dateKey} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                
                                {/* A. Day Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg">
                                                {dateKey === 'Unscheduled' ? 'Unscheduled Services' : new Date(dateKey).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                            </h3>
                                            <p className="text-xs text-gray-500 font-medium">
                                                {trip.dayWiseActivities?.find(d => d.date === dateKey)?.city || "Various Locations"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Day Download Button */}
                                    <button
                                        onClick={() => generateVoucherPdf(confirmedItems, `Vouchers_${dateKey}`)}
                                        disabled={!isDayReady || isGeneratingPdf}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                                            isDayReady 
                                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' 
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <Download size={14}/> Download Day Booklet
                                    </button>
                                </div>

                                {/* B. Items List */}
                                <div className="divide-y divide-gray-100">
                                    {items.map(booking => {
                                        const isLocked = !booking.confirmationNumber || booking.bookingStatus !== 'Confirmed';
                                        
                                        return (
                                            <div key={booking.id} className="px-6 py-4 flex items-center justify-between group hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    {/* Icon */}
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                                        booking.category === 'Stay' ? 'bg-indigo-50 text-indigo-600' :
                                                        booking.category === 'Transport' ? 'bg-orange-50 text-orange-600' :
                                                        'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                        {booking.category === 'Stay' ? <Building2 size={18}/> : booking.category === 'Transport' ? <MapPin size={18}/> : <Clock size={18}/>}
                                                    </div>
                                                    
                                                    {/* Text */}
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-800">{booking.name}</h4>
                                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">{booking.category}</span>
                                                            {isLocked ? (
                                                                <span className="text-orange-500 flex items-center gap-1"><AlertCircle size={10}/> Pending Conf #</span>
                                                            ) : (
                                                                <span className="text-green-600 flex items-center gap-1 font-mono"><CheckCircle size={10}/> Ref: {booking.confirmationNumber}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Single Action */}
                                                <button
                                                    onClick={() => generateVoucherPdf([booking], `Voucher_${booking.name}`)}
                                                    disabled={isLocked || isGeneratingPdf}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                                                        isLocked 
                                                        ? 'text-gray-300 cursor-not-allowed' 
                                                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                                    }`}
                                                    title={isLocked ? "Unlock in Vendor Tab" : "Download PDF"}
                                                >
                                                    <Download size={16}/>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    });
                })()}
             </div>
          </div>
        )}

      </div>

      {/* --- SMART MODAL --- */}
      <PaymentModal 
         isOpen={isPaymentModalOpen} 
         onClose={() => setPaymentModalOpen(false)} 
         onSave={handleSavePayment} 
         editingPayment={editingPayment}
         currentBalance={financials.balance}
         installments={opsData?.installments || []}
      />

    </div>
  );
}



























































































