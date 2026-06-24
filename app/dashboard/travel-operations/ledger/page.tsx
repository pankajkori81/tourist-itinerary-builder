// "use client";

// import { useEffect, useState } from 'react';
// import { Wallet, AlertTriangle, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// export default function GlobalLedgerPage() {
//     const [ledger, setLedger] = useState<any[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const router = useRouter();

//     useEffect(() => {
//         const fetchLedger = async () => {
//             try {
//                 const res = await fetch('/api/operations/ledger');
//                 if (res.ok) {
//                     const data = await res.json();
//                     setLedger(data.ledger);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch ledger", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchLedger();
//     }, []);

//     // Helper to calculate days until deadline
//     const getDaysUntil = (dateString: string | null) => {
//         if (!dateString) return null;
//         const deadline = new Date(dateString);
//         const today = new Date();
//         const diffTime = deadline.getTime() - today.getTime();
//         return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
//     };

//     if (isLoading) {
//         return <div className="p-10 flex justify-center items-center h-screen bg-slate-50"><div className="animate-pulse font-bold text-gray-500">Loading Financial Ledger...</div></div>;
//     }

//     return (
//         <div className="min-h-screen bg-slate-50 p-8">
//             <div className="max-w-7xl mx-auto">
                
//                 {/* Header */}
//                 <div className="flex justify-between items-end mb-8">
//                     <div>
//                         <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
//                             <Wallet className="text-indigo-600" size={32} />
//                             Global Payment Ledger
//                         </h1>
//                         <p className="text-slate-500 mt-2 font-medium">Master accounts payable overview across all active trips.</p>
//                     </div>
//                     <div className="flex gap-4">
//                         <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-center min-w-[120px]">
//                             <p className="text-xs font-bold text-slate-400 uppercase">Unpaid Items</p>
//                             <p className="text-xl font-black text-red-600">{ledger.filter(l => l.paymentStatus === 'Unpaid').length}</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* The Ledger Table */}
//                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             <tr className="bg-slate-100 text-[11px] text-slate-500 font-black uppercase border-b border-slate-200">
//                                 <th className="p-4 w-40">Payment Deadline</th>
//                                 <th className="p-4">Supplier / Service</th>
//                                 <th className="p-4">Trip Reference</th>
//                                 <th className="p-4 w-32 text-right">Amount Due</th>
//                                 <th className="p-4 w-40 text-center">Payment Status</th>
//                                 <th className="p-4 w-20"></th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-100">
//                             {ledger.map((item, index) => {
//                                 const daysUntil = getDaysUntil(item.paymentDeadline);
//                                 const isUnpaid = item.paymentStatus === 'Unpaid';
//                                 const isUrgent = isUnpaid && daysUntil !== null && daysUntil <= 7;
//                                 const costToDisplay = item.actualInvoice > 0 ? item.actualInvoice : item.netCost;

//                                 return (
//                                     <tr key={index} className={`transition-colors hover:bg-slate-50 ${isUrgent ? 'bg-red-50/50' : ''}`}>
                                        
//                                         {/* Deadline Column with Urgent Highlighting */}
//                                         <td className="p-4">
//                                             {item.paymentDeadline ? (
//                                                 <div className="flex items-center gap-2">
//                                                     <Calendar size={14} className={isUrgent ? 'text-red-500' : 'text-slate-400'} />
//                                                     <div>
//                                                         <p className={`text-sm font-bold ${isUrgent ? 'text-red-700' : 'text-slate-700'}`}>
//                                                             {new Date(item.paymentDeadline).toLocaleDateString()}
//                                                         </p>
//                                                         {isUrgent && <p className="text-[10px] uppercase font-black text-red-500 animate-pulse">Due in {daysUntil} Days!</p>}
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <span className="text-xs text-slate-400 font-medium italic">No deadline set</span>
//                                             )}
//                                         </td>

//                                         {/* Supplier Details */}
//                                         <td className="p-4">
//                                             <p className="font-bold text-sm text-slate-900">{item.serviceName}</p>
//                                             <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">{item.serviceType}</p>
//                                         </td>

//                                         {/* Trip Link */}
//                                         <td className="p-4">
//                                             <p className="font-bold text-sm text-indigo-700 truncate max-w-[200px]" title={item.tripName}>{item.tripName}</p>
//                                             <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {item.tripId}</p>
//                                         </td>

//                                         {/* Financials */}
//                                         <td className="p-4 text-right">
//                                             <p className="font-mono font-bold text-sm text-slate-900">{item.currency} {costToDisplay}</p>
//                                             {item.actualInvoice > 0 && <p className="text-[9px] uppercase text-slate-400 font-bold">Based on Invoice</p>}
//                                         </td>

//                                         {/* Status Badge */}
//                                         <td className="p-4 text-center">
//                                             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
//                                                 item.paymentStatus === 'Fully Paid' ? 'bg-green-100 text-green-700 border border-green-200' :
//                                                 item.paymentStatus === 'Deposit Paid' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
//                                                 'bg-slate-100 text-slate-600 border border-slate-200'
//                                             }`}>
//                                                 {item.paymentStatus}
//                                             </span>
//                                         </td>

//                                         {/* Quick Action */}
//                                         <td className="p-4 text-center">
//                                             <button 
//                                                 onClick={() => router.push(`/dashboard/travel-operations/${item.tripId}`)}
//                                                 className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                                                 title="Go to Trip Manifest"
//                                             >
//                                                 <ArrowRight size={18} />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
                            
//                             {ledger.length === 0 && (
//                                 <tr>
//                                     <td colSpan={6} className="p-10 text-center text-slate-500 font-bold">No active payables found in the system.</td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }












// "use client";

// import { useEffect, useState, useMemo } from 'react';
// import { Wallet, Calendar, ArrowRight, TrendingDown, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// export default function GlobalLedgerPage() {
//     const [ledger, setLedger] = useState<any[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const router = useRouter();

//     useEffect(() => {
//         const fetchLedger = async () => {
//             try {
//                 const res = await fetch('/api/operations/ledger');
//                 if (res.ok) {
//                     const data = await res.json();
//                     setLedger(data.ledger);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch ledger", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchLedger();
//     }, []);

//     // ==========================================
//     // 📊 FINANCIAL ANALYTICS ENGINE
//     // ==========================================
//     const analytics = useMemo(() => {
//         let totalUnpaid = 0;
//         let totalOverdue = 0;
//         let expectedCosts = 0;
//         let actualCosts = 0;
        
//         const cashflowMap: Record<string, number> = {};

//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         ledger.forEach(item => {
//             const costToPay = item.actualInvoice > 0 ? item.actualInvoice : item.netCost;

//             // 1. KPI Calculations
//             if (item.paymentStatus === 'Unpaid') {
//                 totalUnpaid += costToPay;
//                 if (item.paymentDeadline && new Date(item.paymentDeadline) < today) {
//                     totalOverdue += costToPay;
//                 }

//                 // 2. Cashflow Grouping (By Month-Year)
//                 if (item.paymentDeadline) {
//                     const d = new Date(item.paymentDeadline);
//                     const monthYear = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
//                     cashflowMap[monthYear] = (cashflowMap[monthYear] || 0) + costToPay;
//                 }
//             }

//             // 3. Cost Variance (Only check items that have an actual invoice)
//             if (item.actualInvoice > 0) {
//                 expectedCosts += item.netCost;
//                 actualCosts += item.actualInvoice;
//             }
//         });

//         // Format for Recharts
//         const cashflowData = Object.keys(cashflowMap)
//             .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) // Sort chronologically
//             .map(key => ({ name: key, Amount: cashflowMap[key] }));

//         const varianceData = [
//             { name: 'Expected Net Cost', value: expectedCosts },
//             { name: 'Actual Invoiced', value: actualCosts }
//         ];

//         return { totalUnpaid, totalOverdue, cashflowData, varianceData, expectedCosts, actualCosts };
//     }, [ledger]);

//     const COLORS = ['#6366f1', '#ef4444']; // Indigo for Expected, Red for Actual

//     // Helper for table dates
//     const getDaysUntil = (dateString: string | null) => {
//         if (!dateString) return null;
//         const diffTime = new Date(dateString).getTime() - new Date().getTime();
//         return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
//     };

//     if (isLoading) {
//         return <div className="p-10 flex justify-center items-center h-screen bg-slate-50"><div className="animate-pulse font-bold text-slate-500">Compiling Financial Data...</div></div>;
//     }

//     return (
//      <div className="relative min-h-screen w-full flex flex-col overflow-hidden">
            
//             {/* --- BACKGROUND IMAGE & OVERLAY --- */}
//             <div 
//                 className="absolute inset-0 z-0 fixed" 
//                 style={{ 
//                     backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")', // Sleek corporate financial building
//                     backgroundSize: 'cover', 
//                     backgroundPosition: 'center' 
//                 }} 
//             />
//             <div className="absolute inset-0 z-0 fixed bg-slate-900/40 backdrop-blur-sm" />

//             {/* --- MAIN CONTENT LAYER --- */}
//             <div className="relative z-10 flex-1 p-8 pb-24 h-full overflow-y-auto">
//                 <div className="max-w-8xl mx-auto space-y-6">

//                     <button 
//                         onClick={() => router.back()} 
//                         className="flex items-center gap-2 text-sm font-bold text-slate-800  hover:text-indigo-600 transition-colors pt-2"
//                     >
//                         <ArrowLeft size={16} /> Back
//                     </button>
                    
//                     {/* --- HEADER & KPIs --- */}
//                     <div className="flex justify-between items-end mb-4 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white/50">
//                         <div>
//                             <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
//                                 <Wallet className="text-indigo-600" size={32} />
//                                 Executive Ledger
//                             </h1>
//                             <p className="text-slate-500 mt-2 font-medium">Global accounts payable and financial health.</p>
//                         </div>
//                     </div>

//                 <div className="grid grid-cols-3 gap-6">
//                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
//                         <div className="flex items-center gap-3 text-slate-500 mb-2 font-bold text-sm uppercase tracking-wider">
//                             <Wallet size={18} /> Total Outstanding Payables
//                         </div>
//                         <p className="text-4xl font-black text-slate-900">${analytics.totalUnpaid.toLocaleString()}</p>
//                     </div>
//                     <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100">
//                         <div className="flex items-center gap-3 text-red-600 mb-2 font-bold text-sm uppercase tracking-wider">
//                             <AlertCircle size={18} /> Severely Overdue
//                         </div>
//                         <p className="text-4xl font-black text-red-700">${analytics.totalOverdue.toLocaleString()}</p>
//                     </div>
//                     <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100">
//                         <div className="flex items-center gap-3 text-green-700 mb-2 font-bold text-sm uppercase tracking-wider">
//                             <CheckCircle2 size={18} /> Paid Services
//                         </div>
//                         <p className="text-4xl font-black text-green-800">
//                             {ledger.filter(l => l.paymentStatus === 'Fully Paid').length} <span className="text-base text-green-600 font-medium tracking-normal lowercase">bookings settled</span>
//                         </p>
//                     </div>
//                 </div>

//                 {/* --- ANALYTICS CHARTS --- */}
//                 <div className="grid grid-cols-3 gap-6">
//                     {/* Cashflow Bar Chart */}
//                     <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[350px] flex flex-col">
//                         <h3 className="font-bold text-slate-800 mb-6">Upcoming Cashflow Requirements (Unpaid)</h3>
//                         <div className="flex-1 w-full h-full">
//                             {analytics.cashflowData.length > 0 ? (
//                                 <ResponsiveContainer width="100%" height="100%">
//                                     <BarChart data={analytics.cashflowData}>
//                                         <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
//                                         <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
//                                         <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
//                                         <Bar dataKey="Amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
//                                     </BarChart>
//                                 </ResponsiveContainer>
//                             ) : (
//                                 <div className="h-full flex items-center justify-center text-slate-400 font-medium">No upcoming payables scheduled.</div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Variance Donut Chart */}
//                     <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[350px] flex flex-col relative">
//                         <h3 className="font-bold text-slate-800">Cost Variance</h3>
//                         <p className="text-xs text-slate-500 mb-2">Expected vs Actual Invoiced</p>
                        
//                         {analytics.expectedCosts > 0 ? (
//                             <div className="flex-1 w-full h-full relative">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                     <PieChart>
//                                         <Pie data={analytics.varianceData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
//                                             {analytics.varianceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
//                                         </Pie>
//                                         <Tooltip formatter={(value:any) => `$${value}`} />
//                                         <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px'}}/>
//                                     </PieChart>
//                                 </ResponsiveContainer>
                                
//                                 {/* Center Warning Text */}
//                                 {analytics.actualCosts > analytics.expectedCosts && (
//                                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-30px]">
//                                         <TrendingDown className="text-red-500 mb-1" size={24}/>
//                                         <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Margin Loss</span>
//                                     </div>
//                                 )}
//                             </div>
//                         ) : (
//                             <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center italic">No invoices logged yet.<br/>Generate POs to track variance.</div>
//                         )}
//                     </div>
//                 </div>

//                 {/* --- THE LEDGER TABLE --- */}
//                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//                     <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
//                         <h3 className="text-white font-bold tracking-wide flex items-center gap-2">
//                             Accounts Payable Schedule
//                         </h3>
//                     </div>
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             <tr className="bg-slate-50 text-[10px] text-slate-500 font-black uppercase tracking-wider border-b border-slate-200">
//                                 <th className="p-4 w-40">Deadline</th>
//                                 <th className="p-4">Supplier / Service</th>
//                                 <th className="p-4">Trip Reference</th>
//                                 <th className="p-4 w-32 text-right">Amount Due</th>
//                                 <th className="p-4 w-40 text-center">Status</th>
//                                 <th className="p-4 w-16"></th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-100">
//                             {ledger.map((item, index) => {
//                                 const daysUntil = getDaysUntil(item.paymentDeadline);
//                                 const isUnpaid = item.paymentStatus === 'Unpaid';
//                                 const isUrgent = isUnpaid && daysUntil !== null && daysUntil <= 7;
//                                 const costToDisplay = item.actualInvoice > 0 ? item.actualInvoice : item.netCost;

//                                 return (
//                                     <tr key={index} className={`transition-colors hover:bg-slate-50 ${isUrgent ? 'bg-red-50/20' : ''}`}>
//                                         <td className="p-4">
//                                             {item.paymentDeadline ? (
//                                                 <div className="flex items-center gap-2">
//                                                     <Calendar size={14} className={isUrgent ? 'text-red-500' : 'text-slate-400'} />
//                                                     <div>
//                                                         <p className={`text-sm font-bold ${isUrgent ? 'text-red-700' : 'text-slate-700'}`}>
//                                                             {new Date(item.paymentDeadline).toLocaleDateString()}
//                                                         </p>
//                                                         {isUrgent && <p className="text-[9px] uppercase font-black text-red-500 mt-0.5">Due in {daysUntil} Days</p>}
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <span className="text-[10px] uppercase font-bold text-slate-300">Unscheduled</span>
//                                             )}
//                                         </td>
//                                         <td className="p-4">
//                                             <p className="font-bold text-sm text-slate-900">{item.serviceName}</p>
//                                             <p className="text-[10px] uppercase font-bold text-indigo-500 mt-0.5">{item.serviceType}</p>
//                                         </td>
//                                         <td className="p-4">
//                                             <p className="font-bold text-sm text-slate-700 truncate max-w-[200px]" title={item.tripName}>{item.tripName}</p>
//                                         </td>
//                                         <td className="p-4 text-right">
//                                             <p className="font-mono font-bold text-sm text-slate-900">{item.currency} {costToDisplay}</p>
//                                             {item.actualInvoice > 0 && <p className="text-[9px] uppercase text-slate-400 font-bold mt-0.5 border border-slate-200 bg-slate-50 inline-block px-1 rounded">Invoiced</p>}
//                                         </td>
//                                         <td className="p-4 text-center">
//                                             <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
//                                                 item.paymentStatus === 'Fully Paid' ? 'bg-green-100 text-green-700' :
//                                                 item.paymentStatus === 'Deposit Paid' ? 'bg-orange-100 text-orange-700' :
//                                                 'bg-slate-100 text-slate-600'
//                                             }`}>
//                                                 {item.paymentStatus}
//                                             </span>
//                                         </td>
//                                         <td className="p-4 text-center">
//                                             <button 
//                                                 onClick={() => router.push(`/dashboard/travel-operations/${item.tripId}`)}
//                                                 className="p-1.5 text-slate-400 hover:text-white hover:bg-indigo-600 rounded transition-colors"
//                                             >
//                                                 <ArrowRight size={16} />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//         </div>
//     );
// }








"use client";

import { useEffect, useState, useMemo } from 'react';
import { Wallet, Calendar, ArrowRight, TrendingDown, AlertCircle, CheckCircle2, ArrowLeft, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import * as XLSX from 'xlsx';

export default function GlobalLedgerPage() {
    const [ledger, setLedger] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('All Time'); // 👈 NEW: State for Quick Filters
    const router = useRouter();

    useEffect(() => {
        const fetchLedger = async () => {
            try {
                const res = await fetch('/api/operations/ledger');
                if (res.ok) {
                    const data = await res.json();
                    setLedger(data.ledger);
                }
            } catch (error) {
                console.error("Failed to fetch ledger", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLedger();
    }, []);

    // ==========================================
    // 📊 FINANCIAL ANALYTICS ENGINE (UPDATED WITH FILTERS)
    // ==========================================
    const analytics = useMemo(() => {
        let totalUnpaid = 0;
        let totalOverdue = 0;
        let expectedCosts = 0;
        let actualCosts = 0;
        
        const cashflowMap: Record<string, number> = {};

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Calculate Date Boundaries for Filters
        const next7Days = new Date(today);
        next7Days.setDate(today.getDate() + 7);

        const next30Days = new Date(today);
        next30Days.setDate(today.getDate() + 30);

        // Find end of current quarter
        const currentMonth = today.getMonth();
        const quarterEndMonth = Math.floor(currentMonth / 3) * 3 + 2;
        const quarterEnd = new Date(today.getFullYear(), quarterEndMonth + 1, 0);

        // 1. Apply Quick Filter Logic
        const filteredLedger = ledger.filter(item => {
            if (timeFilter === 'All Time') return true;
            
            // If item has no deadline, exclude it from time-bounded filters
            if (!item.paymentDeadline) return false;

            const deadline = new Date(item.paymentDeadline);
            
            // Note: We use <= boundary so we ALSO include overdue items from the past!
            if (timeFilter === 'Next 7 Days') return deadline <= next7Days;
            if (timeFilter === 'Next 30 Days') return deadline <= next30Days;
            if (timeFilter === 'This Quarter') return deadline <= quarterEnd;
            
            return true;
        });


        // supplier liabilities accumulator (per supplier)
        const supplierLiabilities: Record<string, number> = {};

        // 2. Calculate KPIs and Chart Data on the FILTERED ledger
        filteredLedger.forEach(item => {
            const costToPay = item.actualInvoice > 0 ? item.actualInvoice : item.netCost;

            if (item.paymentStatus === 'Unpaid') {
                totalUnpaid += costToPay;
                if (item.paymentDeadline && new Date(item.paymentDeadline) < today) {
                    totalOverdue += costToPay;
                }

                if (item.paymentDeadline) {
                    const d = new Date(item.paymentDeadline);
                    const monthYear = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                    cashflowMap[monthYear] = (cashflowMap[monthYear] || 0) + costToPay;
                }

                // Accumulate liabilities per supplier
                supplierLiabilities[item.serviceName] = (supplierLiabilities[item.serviceName] || 0) + costToPay;
            }

            if (item.actualInvoice > 0) {
                expectedCosts += item.netCost;
                actualCosts += item.actualInvoice;
            }
        });

        // Derive top suppliers by outstanding amount
        const topSuppliers = Object.entries(supplierLiabilities)
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5); // Grab only the top 5

        // Format for Recharts
        const cashflowData = Object.keys(cashflowMap)
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) 
            .map(key => ({ name: key, Amount: cashflowMap[key] }));

        const varianceData = [
            { name: 'Expected Net Cost', value: expectedCosts },
            { name: 'Actual Invoiced', value: actualCosts }
        ];

        return { totalUnpaid, totalOverdue, cashflowData, varianceData, expectedCosts, actualCosts, filteredLedger, topSuppliers };
    }, [ledger, timeFilter]);

    const COLORS = ['#6366f1', '#ef4444']; 

    const getDaysUntil = (dateString: string | null) => {
        if (!dateString) return null;
        const diffTime = new Date(dateString).getTime() - new Date().getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    };

    // ==========================================
    // ⬇️ EXPORT TO EXCEL FUNCTION
    // ==========================================
    const exportToExcel = () => {
        // 1. Map your data into a clean array of objects
        const excelData = analytics.filteredLedger.map(item => ({
            'Deadline': item.paymentDeadline ? new Date(item.paymentDeadline).toLocaleDateString() : 'Unscheduled',
            'Supplier': item.serviceName,
            'Type': item.serviceType,
            'Trip Reference': item.tripName,
            'Amount Due': item.actualInvoice > 0 ? item.actualInvoice : item.netCost,
            'Currency': item.currency,
            'Status': item.paymentStatus
        }));

        // 2. Create a new worksheet from the JSON data
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // 3. Optional: Adjust column widths for better readability
        worksheet['!cols'] = [
            { wch: 12 }, // Deadline
            { wch: 30 }, // Supplier
            { wch: 15 }, // Type
            { wch: 25 }, // Trip Reference
            { wch: 12 }, // Amount Due
            { wch: 10 }, // Currency
            { wch: 15 }, // Status
        ];

        // 4. Create a workbook and append the sheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");

        // 5. Trigger the download automatically
        XLSX.writeFile(workbook, `ledger_export_${timeFilter.replace(/\s+/g, '_').toLowerCase()}.xlsx`);
    };

    if (isLoading) {
        return <div className="p-10 flex justify-center items-center h-screen bg-slate-50"><div className="animate-pulse font-bold text-slate-500">Compiling Financial Data...</div></div>;
    }

    return (
     <div className="relative min-h-screen w-full flex flex-col overflow-hidden">
            
            {/* --- BACKGROUND IMAGE & OVERLAY --- */}
            <div 
                className="absolute inset-0 z-0 fixed" 
                style={{ 
                    backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")',
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                }} 
            />
            <div className="absolute inset-0 z-0 fixed bg-slate-900/40 backdrop-blur-sm" />

            {/* --- MAIN CONTENT LAYER --- */}
            <div className="relative z-10 flex-1 p-8 pb-24 h-full overflow-y-auto">
                <div className="max-w-8xl mx-auto space-y-6">

                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors pt-2 bg-white/50 px-3 py-1 rounded-full backdrop-blur-md w-max"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    
                    {/* --- HEADER --- */}
                    <div className="flex justify-between items-end bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white/50">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                                <Wallet className="text-indigo-600" size={32} />
                                Executive Ledger
                            </h1>
                            <p className="text-slate-500 mt-2 font-medium">Global accounts payable and financial health.</p>
                        </div>

                        {/* 👇 UPDATED EXPORT BUTTON */}
                        <button 
                            onClick={exportToExcel}
                            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
                        >
                            <Download size={18} /> Export Excel
                        </button>
                    </div>

                    {/* 👇 NEW: QUICK FILTERS (TIME HORIZONS) */}
                    <div className="flex items-center gap-2 mb-2">
                        {['Next 7 Days', 'Next 30 Days', 'This Quarter', 'All Time'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setTimeFilter(filter)}
                                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                                    timeFilter === filter 
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105' 
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* --- KPIs --- */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 text-slate-500 mb-2 font-bold text-sm uppercase tracking-wider">
                                <Wallet size={18} /> Total Outstanding Payables
                            </div>
                            <p className="text-4xl font-black text-slate-900">${analytics.totalUnpaid.toLocaleString()}</p>
                        </div>
                        <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100">
                            <div className="flex items-center gap-3 text-red-600 mb-2 font-bold text-sm uppercase tracking-wider">
                                <AlertCircle size={18} /> Severely Overdue
                            </div>
                            <p className="text-4xl font-black text-red-700">${analytics.totalOverdue.toLocaleString()}</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100">
                            <div className="flex items-center gap-3 text-green-700 mb-2 font-bold text-sm uppercase tracking-wider">
                                <CheckCircle2 size={18} /> Paid Services
                            </div>
                            <p className="text-4xl font-black text-green-800">
                                {analytics.filteredLedger.filter(l => l.paymentStatus === 'Fully Paid').length} <span className="text-base text-green-600 font-medium tracking-normal lowercase">bookings settled</span>
                            </p>
                        </div>
                    </div>

                    {/* --- ANALYTICS CHARTS --- */}
                   {/* --- ANALYTICS CHARTS (ALL IN ONE ROW) --- */}
                    <div className="grid grid-cols-4 gap-6">
                        
                        {/* Cashflow Bar Chart (Takes 50% width) */}
                        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[350px] flex flex-col">
                            <h3 className="font-bold text-slate-800 mb-6">Upcoming Cashflow Requirements (Unpaid)</h3>
                            <div className="flex-1 w-full h-full">
                                {analytics.cashflowData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={analytics.cashflowData}>
                                            <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                            <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                                            <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                            <Bar dataKey="Amount" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={60} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 font-medium">No upcoming payables scheduled for this timeframe.</div>
                                )}
                            </div>
                        </div>

                        {/* Variance Donut Chart (Takes 25% width) */}
                        <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[350px] flex flex-col relative">
                            <h3 className="font-bold text-slate-800">Cost Variance</h3>
                            <p className="text-xs text-slate-500 mb-2">Expected vs Actual Invoiced</p>
                            
                            {analytics.expectedCosts > 0 ? (
                                <div className="flex-1 w-full h-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={analytics.varianceData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                {analytics.varianceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip formatter={(value:any) => `$${value}`} />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px'}}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    
                                    {/* Center Warning Text */}
                                    {analytics.actualCosts > analytics.expectedCosts && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-30px]">
                                            <TrendingDown className="text-red-500 mb-1" size={24}/>
                                            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Margin Loss</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center italic">No invoices logged yet.<br/>Generate POs to track variance.</div>
                            )}
                        </div>

                        {/* Top 5 Liabilities (Takes 25% width) */}
                        <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[350px] flex flex-col">
                            <h3 className="font-bold text-slate-800 mb-6">Top 5 Liabilities</h3>
                            <div className="flex-1 overflow-y-auto pr-2 space-y-5">
                                {analytics.topSuppliers.length > 0 ? (
                                    analytics.topSuppliers.map((supplier, idx) => (
                                        <div key={idx} className="flex justify-between items-center group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-black group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                    {idx + 1}
                                                </div>
                                                <span className="font-bold text-sm text-slate-700 truncate max-w-[100px]" title={supplier.name}>
                                                    {supplier.name}
                                                </span>
                                            </div>
                                            <span className="font-mono font-bold text-slate-900">
                                                ${supplier.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center italic">No outstanding liabilities.</div>
                                )}
                            </div>
                        </div>

                    </div>
                    

                    {/* --- THE LEDGER TABLE --- */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
                            <h3 className="text-white font-bold tracking-wide flex items-center gap-2">
                                Accounts Payable Schedule ({timeFilter})
                            </h3>
                        </div>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-[10px] text-slate-500 font-black uppercase tracking-wider border-b border-slate-200">
                                    <th className="p-4 w-40">Deadline</th>
                                    <th className="p-4">Supplier / Service</th>
                                    <th className="p-4">Trip Reference</th>
                                    <th className="p-4 w-32 text-right">Amount Due</th>
                                    <th className="p-4 w-40 text-center">Status</th>
                                    <th className="p-4 w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {/* 👇 UPDATED: Mapping over filteredLedger instead of ledger */}
                                {analytics.filteredLedger.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                                            No accounts payable found for {timeFilter}.
                                        </td>
                                    </tr>
                                ) : (
                                    analytics.filteredLedger.map((item, index) => {
                                        const daysUntil = getDaysUntil(item.paymentDeadline);
                                        const isUnpaid = item.paymentStatus === 'Unpaid';
                                        const isUrgent = isUnpaid && daysUntil !== null && daysUntil <= 7;
                                        const costToDisplay = item.actualInvoice > 0 ? item.actualInvoice : item.netCost;

                                        return (
                                            <tr key={index} className={`transition-colors hover:bg-slate-50 ${isUrgent ? 'bg-red-50/20' : ''}`}>
                                                <td className="p-4">
                                                    {item.paymentDeadline ? (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={14} className={isUrgent ? 'text-red-500' : 'text-slate-400'} />
                                                            <div>
                                                                <p className={`text-sm font-bold ${isUrgent ? 'text-red-700' : 'text-slate-700'}`}>
                                                                    {new Date(item.paymentDeadline).toLocaleDateString()}
                                                                </p>
                                                                {isUrgent && <p className="text-[9px] uppercase font-black text-red-500 mt-0.5">Due in {daysUntil} Days</p>}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] uppercase font-bold text-slate-300">Unscheduled</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <p className="font-bold text-sm text-slate-900">{item.serviceName}</p>
                                                    <p className="text-[10px] uppercase font-bold text-indigo-500 mt-0.5">{item.serviceType}</p>
                                                </td>
                                                <td className="p-4">
                                                    <p className="font-bold text-sm text-slate-700 truncate max-w-[200px]" title={item.tripName}>{item.tripName}</p>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <p className="font-mono font-bold text-sm text-slate-900">{item.currency} {costToDisplay}</p>
                                                    {item.actualInvoice > 0 && <p className="text-[9px] uppercase text-slate-400 font-bold mt-0.5 border border-slate-200 bg-slate-50 inline-block px-1 rounded">Invoiced</p>}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                        item.paymentStatus === 'Fully Paid' ? 'bg-green-100 text-green-700' :
                                                        item.paymentStatus === 'Deposit Paid' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {item.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button 
                                                        onClick={() => router.push(`/dashboard/travel-operations/${item.tripId}`)}
                                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-indigo-600 rounded transition-colors"
                                                    >
                                                        <ArrowRight size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}