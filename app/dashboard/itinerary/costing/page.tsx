// "use client";

// import React, { useState, useEffect, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   Calculator, Download, FileText,
//   ArrowLeft, Calendar, Sparkles, User, Printer, Save,
//   Plus, Trash2, Check, Briefcase,
//   CheckCircle2, XCircle, Unlock, ThumbsDown, AlertOctagon, ThumbsUp
// } from 'lucide-react';
// import { useUser } from '@/app/context/UserContext';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { useItinerary } from '@/app/context/ItineraryContext';
// import { useSRM } from '@/app/context/SRMContext';
// import { useCurrency } from '@/hooks/useCurrency';
// import { DayPlan } from '../create-day/constants/daywiseConstants';
// import { FixedDeparture } from '@/utils/itineraryStorage';

// // --- HELPERS ---
// const isItemIncluded = (status?: string) => !status || status.toLowerCase() === 'included';
// const safeNum = (val: any) => {
//   const num = parseFloat(val);
//   return isNaN(num) ? 0 : num;
// };
// const getShareLabel = (pax: number) => {
//   if (pax === 1) return "Single";
//   if (pax === 2) return "Twin/Double";
//   if (pax === 3) return "Triple";
//   if (pax === 4) return "Quad";
//   return `${pax}-Pax`;
// };

// // --- SUB COMPONENT: LEDGER ROW (With Manual Input) ---
// const LedgerRow = ({
//     itemId, typeLabel, typeColor, details, inclusionType, config,
//     manualNetTotal, onCostChange, divisor,
//     currency, formatPrice, isGhost, vendorName,
//     rowSpan = 1, isSubRow = false
// }: any) => {

//     // AUTOMATIC CALCULATION: Net Total / Divisor = PP Cost
//     // If it's excluded or ghost, cost is 0 visually but we keep input enabled for admin adjustments
//     const isIncluded = isItemIncluded(inclusionType);
//     const ppCost = (divisor > 0 && isIncluded) ? (manualNetTotal / divisor) : 0;

//     let rowClass = "border-b border-gray-200 hover:bg-blue-50/30 transition-colors";
//     if (isGhost) rowClass += " bg-gray-50/80 text-gray-400";
//     else if (!isIncluded) rowClass += " opacity-60 bg-red-50/20";

//     return (
//         <tr className={rowClass}>
//             {!isSubRow && (
//                 <td rowSpan={rowSpan} className="py-3 px-4 align-top w-[90px] border-r border-gray-300">
//                      <span className={`text-[11px] font-bold uppercase tracking-wider ${typeColor || "text-gray-500"}`}>
//                         {typeLabel}
//                     </span>
//                 </td>
//             )}
//             <td className="py-3 px-4 align-middle">
//                 <span className="font-medium text-sm block text-gray-800">
//                     {details}
//                     {!isIncluded && <span className="ml-2 text-[10px] uppercase font-bold text-red-500">({inclusionType})</span>}
//                 </span>
//             </td>

//             <td className="py-3 px-4 align-middle">
//                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded truncate max-w-[100px] block">
//                     {vendorName}
//                  </span>
//             </td>

//             <td className="py-3 px-4 align-middle">
//                 <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded inline-block whitespace-nowrap">
//                    {config}
//                 </span>
//             </td>

//             {/* 👇 MANUAL ENTRY FIELD (Net Total) */}
//             <td className="py-3 px-4 align-middle text-right">
//                 {!isGhost ? (
//                     <div className="flex items-center justify-end gap-1">
//                         <span className="text-xs font-bold text-gray-400">{currency}</span>
//                         <input
//                             type="number"
//                             min="0"
//                             value={manualNetTotal === 0 ? '' : manualNetTotal}
//                             onChange={(e) => onCostChange(itemId, parseFloat(e.target.value) || 0)}
//                             placeholder="0"
//                             className="w-24 p-1.5 text-right font-bold text-gray-900 border border-blue-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
//                         />
//                     </div>
//                 ) : (
//                     <span className="text-xs text-gray-400 italic">Included in primary</span>
//                 )}
//             </td>

//             {/* 👇 AUTOMATIC FIELD (PP Cost) */}
//             <td className="py-3 px-4 align-middle text-right border-l border-gray-100 bg-gray-50/50">
//                 {!isGhost && (
//                     <>
//                         <span className="font-mono text-xs font-bold text-blue-600">
//                             {formatPrice(ppCost, currency)}
//                         </span>
//                         <div className="text-[9px] text-gray-400">/ person</div>
//                     </>
//                 )}
//             </td>
//         </tr>
//     );
// };

// export default function CostingPage() {
//   const router = useRouter();
//   const { user } = useUser();
//   const {
//     itineraryData,
//     updateItineraryData,
//     saveItinerary,
//     approveCosting,
//     rejectCosting,
//     revertToPending,
//     allowReEdit
//   } = useItinerary();
//   const { suppliers } = useSRM();

//   const rawDayPlans = (itineraryData?.dayWiseActivities || []) as DayPlan[];
//   const travelerCount = safeNum(itineraryData?.numberOfTravelers) || 1;
// const { currency, setCurrency, convert, formatPrice, rates, loading } = useCurrency('USD');

//   // --- STATE ---
//   const [markupPercent, setMarkupPercent] = useState<number>(20);
//   const [roundingMode, setRoundingMode] = useState<string>('none');
//   const [fixedDepartures, setFixedDepartures] = useState<FixedDeparture[]>([]);

//   // 👇 MONTHLY MATRIX LOGIC
//   const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
//   const [selectedMonth, setSelectedMonth] = useState<string>('JAN');

//   // Pricing Matrix State
//   const [pricingMatrix, setPricingMatrix] = useState<Record<string, Record<string, number>>>(
//     itineraryData.pricingMatrix || {}
//   );

//   // Helper to safely get cost for current month & item
//   const getCost = (itemId: string | number) => {
//     return pricingMatrix[selectedMonth]?.[itemId.toString()] || 0;
//   };

//   // Handler: When Admin types "Net Total", update the Matrix
//   const handleManualCostChange = (itemId: string | number, value: number) => {
//     const updatedMatrix = {
//       ...pricingMatrix,
//       [selectedMonth]: {
//         ...(pricingMatrix[selectedMonth] || {}),
//         [itemId.toString()]: value
//       }
//     };

//     setPricingMatrix(updatedMatrix);
//     updateItineraryData({ pricingMatrix: updatedMatrix });
//   };

//   // SECURITY GUARD
//   useEffect(() => {
//     if (user?.role !== 'admin') {
//        alert("Access Denied: Only Admins can access Costing.");
//        router.push('/dashboard/itinerary/create-day');
//     }
//   }, [user, router]);

//   // SYNC STATE
//   useEffect(() => {
//     if (itineraryData.selectedCurrency && itineraryData.selectedCurrency !== currency) {
//         setCurrency(itineraryData.selectedCurrency);
//     }
//     if (itineraryData.markupPercentage !== undefined) setMarkupPercent(itineraryData.markupPercentage);
//     if (itineraryData.roundingMode) setRoundingMode(itineraryData.roundingMode);
//     if (itineraryData.fixedDepartures) setFixedDepartures(itineraryData.fixedDepartures);
//     // Sync Matrix if loaded from storage
//     if (itineraryData.pricingMatrix) setPricingMatrix(itineraryData.pricingMatrix);
//   }, [itineraryData]);

//   // HELPER: Get Vendor Name
//   const getVendorName = (id?: string) => {
//      if (!id) return '-';
//      const sup = suppliers.find(s => s.id === id);
//      return sup ? sup.name : 'Unknown';
//   };

//   const handleMarkupChange = (val: number) => {
//     setMarkupPercent(val);
//     updateItineraryData({ markupPercentage: val });
//   };

//   const handleRoundingChange = (mode: string) => {
//     setRoundingMode(mode);
//     updateItineraryData({ roundingMode: mode } as any);
//   };

//   // --- ACTIONS ---
//   const handleReject = () => {
//     const reason = prompt("Please enter the reason for requesting changes:");
//     if (reason) {
//       rejectCosting(reason);
//       router.push('/dashboard/itinerary/library');
//     }
//   };

//   const handleCurrencyChange = (value: string) => {
//       setCurrency(value);
//       updateItineraryData({ selectedCurrency: value });
//   };

//   // --- DATA PROCESSING (Process Ghosts) ---
//   const processedDayPlans = useMemo(() => {
//     const plansWithGhosts = JSON.parse(JSON.stringify(rawDayPlans)) as DayPlan[];
//     rawDayPlans.forEach((day) => {
//         if (!day.stays) return;
//         day.stays.forEach(stay => {
//             const nights = safeNum(stay.nights);
//             if (nights > 1) {
//                 const currentDayNum = day.dayNumber;
//                 for (let i = 1; i < nights; i++) {
//                     const targetDayNum = currentDayNum + i;
//                     const targetDay = plansWithGhosts.find(d => d.dayNumber === targetDayNum);
//                     if (targetDay) {
//                         if (!targetDay.stays) targetDay.stays = [];
//                         targetDay.stays.push({ ...stay, id: -Math.random(), costPerNight: 0, isGhost: true });
//                     }
//                 }
//             }
//         });
//     });
//     return plansWithGhosts;
//   }, [rawDayPlans]);

//   // --- CALCULATE TOTALS (Based on Matrix) ---
//   const totals = useMemo(() => {
//       let totalNet = 0;

//       const currentMonthCosts = pricingMatrix[selectedMonth] || {};

//       rawDayPlans.forEach(day => {
//           day.stays?.forEach(s => { if(isItemIncluded(s.inclusionType)) totalNet += (currentMonthCosts[s.id.toString()] || 0); });
//           day.transports?.forEach(t => { if(isItemIncluded(t.inclusionType)) totalNet += (currentMonthCosts[t.id.toString()] || 0); });
//           day.activities?.forEach(a => { if(isItemIncluded(a.inclusionType)) totalNet += (currentMonthCosts[a.id.toString()] || 0); });
//           day.meals?.forEach(m => { if(isItemIncluded(m.inclusionType)) totalNet += (currentMonthCosts[m.id.toString()] || 0); });
//       });

//       return { totalNet };
//   }, [rawDayPlans, pricingMatrix, selectedMonth]);

//   // --- PRICING LOGIC ---
//   const netInSelected = totals.totalNet;

//   let finalPerPerson = 0;
//   let finalGrandTotal = 0;
//   let calculatedMarkupAmount = 0;

//   const markupAmount = netInSelected * (markupPercent / 100);
//   calculatedMarkupAmount = markupAmount;
//   const exactGrandTotal = netInSelected + markupAmount;
//   const exactPerPerson = travelerCount > 0 ? exactGrandTotal / travelerCount : 0;

//   finalPerPerson = exactPerPerson;
//   if (roundingMode === '5') finalPerPerson = Math.ceil(exactPerPerson / 5) * 5;
//   else if (roundingMode === '10') finalPerPerson = Math.ceil(exactPerPerson / 10) * 10;
//   else if (roundingMode === '100') finalPerPerson = Math.ceil(exactPerPerson / 100) * 100;

//   finalGrandTotal = finalPerPerson * travelerCount;

//   // --- FIXED DEPARTURE HANDLERS ---
//   const addDepartureRow = () => { const newRow: FixedDeparture = { id: Date.now().toString(), date: '', label: '', price: 0, status: 'Open', isSelected: false }; const updated = [...fixedDepartures, newRow]; setFixedDepartures(updated); updateItineraryData({ fixedDepartures: updated }); };
//   const updateDepartureRow = (id: string, field: keyof FixedDeparture, value: any) => { const updated = fixedDepartures.map(d => { if (d.id === id) { if (field === 'date') { const dateObj = new Date(value); const label = isNaN(dateObj.getTime()) ? value : dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }); return { ...d, [field]: value, label: label }; } return { ...d, [field]: value }; } return d; }); setFixedDepartures(updated); updateItineraryData({ fixedDepartures: updated }); };
//   const removeDepartureRow = (id: string) => { const updated = fixedDepartures.filter(d => d.id !== id); setFixedDepartures(updated); updateItineraryData({ fixedDepartures: updated }); };

//   const handleDownloadExcel = () => { alert("Excel Download"); };
//   const handleDownloadPDF = () => { alert("PDF Download"); };
//   const handleSaveQuote = async () => { await saveItinerary('quick'); alert("Quote saved!"); };

//   if (loading || !user) return <div className="p-10 text-center">Loading...</div>;

//   // --- HELPER FOR STAY ROWS ---
//   const getStayRows = (stay: any) => {
//       // Default to one row logic if no occupancy split
//       if (!stay.roomOccupancy || stay.roomOccupancy.length === 0) {
//           return [{
//               details: stay.hotelName,
//               config: `${stay.numRooms} Room(s) x ${travelerCount} Pax x ${stay.nights} Nights`,
//               ppDivisor: travelerCount
//           }];
//       }

//       // If occupancy split exists (e.g. 2 rooms: 2 pax, 1 pax)
//       const groups: Record<number, number> = {};
//       stay.roomOccupancy.forEach((pax: number) => groups[pax] = (groups[pax] || 0) + 1);

//       return Object.entries(groups).map(([paxStr, roomCount]) => {
//           const pax = parseInt(paxStr);
//           return {
//               details: `${stay.hotelName} (${getShareLabel(pax)} Share)`,
//               config: `${roomCount} Room(s) x ${pax} Pax x ${stay.nights} Nights`,
//               ppDivisor: pax // Divisor is the number of people in THAT room type
//           };
//       });
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen font-sans text-gray-800">

//       {/* 1. RE-EDIT REQUEST BANNER */}
//       {itineraryData.status === 'reedit_requested' && (
//          <div className="bg-orange-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
//             <div className="flex items-center gap-3">
//                <div className="p-2 bg-white/20 rounded-full"><AlertOctagon size={24} /></div>
//                <div>
//                   <h3 className="font-bold text-lg">Re-Edit Requested</h3>
//                   <p className="text-sm opacity-90">Reason: "{itineraryData.reEditReason}"</p>
//                </div>
//             </div>
//             <div className="flex gap-3">
//                <button onClick={revertToPending} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold border border-white/30 flex items-center gap-2"><ThumbsDown size={16}/> Deny</button>
//                <button onClick={allowReEdit} className="px-6 py-2 bg-white text-orange-700 hover:bg-gray-100 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2"><ThumbsUp size={16}/> Allow (Unlock)</button>
//             </div>
//          </div>
//       )}

//       {/* HEADER */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4 flex justify-between items-center shadow-sm">
//         <div>
//            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//              <FileText className="text-blue-600" size={24}/> Seasonal Pricing
//            </h1>
//            <p className="text-xs text-gray-500 mt-0.5">Total Days: {rawDayPlans.length} • Travelers: {travelerCount}</p>
//         </div>

//         <div className="flex gap-3">
//              <button onClick={() => router.push('/dashboard/itinerary/create-day')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"><ArrowLeft size={16} /> Edit</button>

//              {/* ADMIN ACTIONS */}
//              {user?.role === 'admin' && itineraryData.status === 'pending_costing' && (
//                <>
//                  <button onClick={handleReject} className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-2"><XCircle size={16} /> Request Changes</button>
//                  <button onClick={approveCosting} className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 shadow-sm animate-pulse"><CheckCircle2 size={16} /> Approve & Release</button>
//                </>
//              )}

//              {user?.role === 'admin' && itineraryData.status === 'approved' && (
//                  <button onClick={revertToPending} className="px-4 py-2 text-sm font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded-lg flex items-center gap-2 shadow-sm"><Unlock size={16} /> Unlock to Fix</button>
//              )}
//         </div>
//       </header>

//       <main className="max-w-[1600px] mx-auto p-6 flex flex-col xl:flex-row gap-6 items-start">

//         {/* LEFT: LEDGER */}
//         <div className="flex-1 w-full space-y-6">

//             {/* 👇 MONTH TABS */}
//             <div className="bg-white border border-gray-300 rounded-xl p-2 flex gap-2 overflow-x-auto shadow-sm">
//                {MONTHS.map(month => (
//                   <button
//                     key={month}
//                     onClick={() => setSelectedMonth(month)}
//                     className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
//                         selectedMonth === month
//                         ? 'bg-blue-600 text-white shadow-md'
//                         : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
//                     }`}
//                   >
//                     {month}
//                   </button>
//                ))}
//             </div>

//             <div className="bg-white border border-gray-400 rounded-xl shadow-sm overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                         <thead className="bg-gray-50 text-gray-500 border-b border-gray-400">
//                             <tr>
//                                 <th className="py-3 px-4 text-xs font-bold uppercase w-[80px]">Type</th>
//                                 <th className="py-3 px-4 text-xs font-bold uppercase">Item Details</th>
//                                 <th className="py-3 px-4 text-xs font-bold uppercase w-[120px] text-blue-600">Supplier</th>
//                                 <th className="py-3 px-4 text-xs font-bold uppercase w-[150px]">Config</th>
//                                 <th className="py-3 px-4 text-xs font-bold uppercase text-right w-[140px]">Net Total</th>
//                                 <th className="py-3 px-4 text-xs font-bold uppercase text-right w-[100px]">PP Cost</th>
//                             </tr>
//                         </thead>
//                         <tbody className="text-sm">
//                             {processedDayPlans.map((day) => (
//                                 <React.Fragment key={day.dayNumber}>
//                                     <tr className="bg-gray-100 border-b border-gray-400">
//                                         <td colSpan={6} className="py-2 px-4"><div className="flex items-center gap-2 text-gray-700 font-bold"><Calendar size={14} className="text-blue-500"/><span>DAY {day.dayNumber} - {day.city}</span></div></td>
//                                     </tr>

//                                     {/* STAYS */}
//                                     {(day.stays || []).map((s: any, i: number) => {
//                                         const rows = getStayRows(s);
//                                         return rows.map((row, idx) => (
//                                             <LedgerRow
//                                                 key={`s-${i}-${idx}`}
//                                                 itemId={s.id}
//                                                 typeLabel="Stay"
//                                                 typeColor={s.isGhost ? "text-gray-400" : "text-gray-900"}
//                                                 details={row.details}
//                                                 inclusionType={s.inclusionType}
//                                                 config={s.isGhost ? "Continuing" : row.config}
//                                                 manualNetTotal={getCost(s.id)}
//                                                 onCostChange={handleManualCostChange}
//                                                 divisor={row.ppDivisor}
//                                                 currency={currency}
//                                                 formatPrice={formatPrice}
//                                                 isGhost={s.isGhost}
//                                                 vendorName={getVendorName(s.linkedSupplierId)}
//                                                 rowSpan={idx === 0 ? rows.length : 1}
//                                                 isSubRow={idx > 0}
//                                             />
//                                         ));
//                                     })}

//                                     {/* TRANSPORT */}
//                                     {(day.transports || []).map((t: any, i: number) => {
//                                         const divisor = t.paxCount || travelerCount;
//                                         return (
//                                             <LedgerRow
//                                                 key={`t-${i}`}
//                                                 itemId={t.id}
//                                                 typeLabel="Transport"
//                                                 typeColor="text-gray-900"
//                                                 details={t.vehicleType}
//                                                 inclusionType={t.inclusionType}
//                                                 config={`${t.vehicleCount} Veh / ${divisor} Pax`}
//                                                 manualNetTotal={getCost(t.id)}
//                                                 onCostChange={handleManualCostChange}
//                                                 divisor={divisor}
//                                                 currency={currency}
//                                                 formatPrice={formatPrice}
//                                                 vendorName={getVendorName(t.linkedSupplierId)}
//                                             />
//                                         );
//                                     })}

//                                     {/* ACTIVITY */}
//                                     {(day.activities || []).map((a: any, i: number) => {
//                                         const pax = a.paxCount || travelerCount;
//                                         return (
//                                             <LedgerRow
//                                                 key={`a-${i}`}
//                                                 itemId={a.id}
//                                                 typeLabel="Activity"
//                                                 typeColor="text-gray-900"
//                                                 details={a.heading}
//                                                 inclusionType={a.inclusionType}
//                                                 config={`${pax} Pax`}
//                                                 manualNetTotal={getCost(a.id)}
//                                                 onCostChange={handleManualCostChange}
//                                                 divisor={pax}
//                                                 currency={currency}
//                                                 formatPrice={formatPrice}
//                                                 vendorName={getVendorName(a.linkedSupplierId)}
//                                             />
//                                         );
//                                     })}

//                                     {/* MEAL */}
//                                     {(day.meals || []).map((m: any, i: number) => {
//                                         return (
//                                             <LedgerRow
//                                                 key={`m-${i}`}
//                                                 itemId={m.id}
//                                                 typeLabel="Meal"
//                                                 typeColor="text-gray-900"
//                                                 details={m.restaurantName}
//                                                 inclusionType={m.inclusionType}
//                                                 config={m.mealType}
//                                                 manualNetTotal={getCost(m.id)}
//                                                 onCostChange={handleManualCostChange}
//                                                 divisor={travelerCount}
//                                                 currency={currency}
//                                                 formatPrice={formatPrice}
//                                                 vendorName={getVendorName(m.linkedSupplierId)}
//                                             />
//                                         );
//                                     })}
//                                 </React.Fragment>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* FIXED DEPARTURES TABLE */}
//             <div className="bg-white border border-gray-400 rounded-xl shadow-md overflow-hidden p-6">
//                  <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-800 flex items-center gap-2"><Calendar size={18} className="text-orange-500" />Fixed Departures & Pricing (Dates)</h3><button onClick={addDepartureRow} className="text-sm flex items-center gap-1 bg-blue-50 text-blue-100 px-3 py-1.5 rounded-md font-bold hover:bg-blue-500 transition bg-blue-600"><Plus size={15} /> Add Date</button></div>
//                  <div className="overflow-x-auto ">
//                     <table className="w-full text-left text-sm border border-gray-400">
//                         <thead className="bg-gray-200 text-gray-500 uppercase text-xs  border-b border-gray-400">
//                             <tr>
//                                 <th className="py-3 px-4 w-[200px]">Date</th>
//                                 <th className="py-3 px-4">Label</th>
//                                 <th className="py-3 px-4 w-[150px]">Surcharge/Price</th>
//                                 <th className="py-3 px-4 w-[120px]">Status</th>
//                                 <th className="py-3 px-4 w-[50px]"></th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-300 border border-gray-400">
//                             {fixedDepartures.map((row) => (
//                                 <tr key={row.id} className="hover:bg-gray-50">
//                                     <td className="py-3 px-4"><input type="date" value={row.date} onChange={(e) => updateDepartureRow(row.id, 'date', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-gray-700 outline-none"/></td>
//                                     <td className="py-3 px-4"><input type="text" value={row.label} onChange={(e) => updateDepartureRow(row.id, 'label', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-gray-700 bg-transparent outline-none"/></td>
//                                     <td className="py-3 px-4"><div className="flex items-center gap-2"><span className="text-xs font-bold text-gray-500">{currency}</span><input type="number" value={row.price} onChange={(e) => updateDepartureRow(row.id, 'price', parseFloat(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1.5 font-mono font-bold text-gray-800 outline-none"/></div></td>
//                                     <td className="py-3 px-4"><select value={row.status} onChange={(e) => updateDepartureRow(row.id, 'status', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-bold bg-white"><option value="Open">Open</option><option value="Filling Fast">Filling Fast</option><option value="Sold Out">Sold Out</option></select></td>
//                                     <td className="py-3 px-4 text-center"><button onClick={() => removeDepartureRow(row.id)} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                  </div>
//             </div>
//         </div>

//         {/* RIGHT: CALCULATOR & PAYABLES */}
//         <div className="w-full xl:w-[400px] shrink-0 sticky top-24 flex flex-col gap-4">

//             {/* Currency Selector */}
//             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-300 flex items-center justify-between">
//                 <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Currency</div>
//                 <select value={currency} onChange={(e) => handleCurrencyChange(e.target.value)} className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold">
//                     {rates && Object.keys(rates).map(r => <option key={r} value={r}>{r}</option>)}
//                 </select>
//             </div>

//             {/* VENDOR PAYABLES BOX */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
//                 <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
//                     <h3 className="text-xs font-bold text-gray-700 uppercase flex items-center gap-2"><Briefcase size={14}/> {selectedMonth} Cost Breakdown</h3>
//                 </div>
//                 <div className="p-4 space-y-2">
//                     <div className="flex justify-between text-sm font-bold">
//                         <span>Total Net ({selectedMonth})</span>
//                         <span className="text-blue-600">{formatPrice(netInSelected, currency)}</span>
//                     </div>
//                 </div>
//             </div>

//             {/* CALCULATOR */}
//             <div className={`bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden transition-all duration-300`}>
//                 <div className={`bg-gray-900 text-white px-5 py-4 flex items-center justify-between`}>
//                     <div className="flex items-center gap-2"><Calculator size={18} className="text-green-400"/><span className="font-bold tracking-wide text-sm">Quote Calculator ({selectedMonth})</span></div>
//                 </div>

//                 <div className="p-5 space-y-5">
//                     <div className="flex justify-between items-center text-sm">
//                         <span className="text-gray-500 font-medium">Total Net Cost</span>
//                         <span className="font-mono font-bold text-gray-800 text-lg">{formatPrice(netInSelected, currency)}</span>
//                     </div>

//                     <div className="grid grid-cols-1 gap-4">
//                         <div className="space-y-1">
//                             <div className="flex justify-between">
//                                 <label className="text-[10px] font-bold text-gray-400 uppercase">Margin / Markup %</label>
//                             </div>
//                             <div className="relative">
//                                 <input type="number" value={markupPercent} onChange={(e) => handleMarkupChange(parseFloat(e.target.value) || 0)} className={`w-full p-2 border rounded-lg font-bold text-sm bg-white border-gray-300 text-gray-800`}/>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="border-t border-gray-100"></div>

//                     <div className={`space-y-3`}>
//                         <div className="flex items-center gap-2 text-purple-600">
//                             <Sparkles size={14} fill="currentColor" className="text-purple-200"/><span className="text-xs font-bold uppercase tracking-wide">Pricing Strategy</span>
//                         </div>
//                         <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-lg">
//                             {['none', '5', '10', '100'].map((mode) => (
//                                 <button key={mode} onClick={() => handleRoundingChange(mode)} className={`text-[10px] font-bold py-1.5 rounded-md ${roundingMode === mode ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-400'}`}>{mode === 'none' ? 'Exact' : `+${mode}`}</button>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-xl shadow-inner text-white space-y-4 relative overflow-hidden">
//                          <div className="flex justify-between items-start relative z-10">
//                             <div>
//                                 <div className="text-blue-200 font-bold text-xs uppercase mb-1">Selling Price / Per Person</div>
//                                 <div className="font-mono font-black text-3xl tracking-tight">{formatPrice(finalPerPerson, currency)}</div>
//                             </div>
//                             <User size={24} className="text-blue-400/50" />
//                         </div>
//                         <div className="pt-3 border-t border-blue-500/30 flex justify-between items-center relative z-10">
//                             <span className="text-blue-200 font-medium text-xs">Total Group Value ({travelerCount} Pax)</span>
//                             <span className="font-mono font-bold text-lg text-white">{formatPrice(finalGrandTotal, currency)}</span>
//                         </div>
//                     </div>

//                      <div className="bg-gray-50 px-5 py-4 border-t border-gray-200 grid grid-cols-2 gap-3">
//                       <button onClick={handleDownloadExcel} className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded-lg text-xs shadow-sm"><Download size={14}/> Excel</button>
//                       <button onClick={handleDownloadPDF}  className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded-lg text-xs shadow-sm"><Printer size={14}/> PDF</button>
//                       <button onClick={handleSaveQuote} className="col-span-2 flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3 rounded-lg text-sm shadow-md"><Save size={16}/> Save Quote</button>
//                   </div>
//                 </div>
//             </div>
//         </div>
//       </main>
//     </div>
//   );
// }









"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  saveItineraryToStorage,
  SpecificDeparture,
} from "@/utils/itineraryStorage";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calculator,
  Download,
  FileText,
  ArrowLeft,
  Calendar,
  Sparkles,
  User,
  Printer,
  Save,
  Plus,
  Trash2,
  Check,
  Briefcase,
  CheckCircle2,
  XCircle,
  Unlock,
  ThumbsDown,
  AlertOctagon,
  ThumbsUp,
  Clock, // Icons
  Info,
  AlertTriangle,
  Loader2,
  GripVertical,
} from "lucide-react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { useUser } from "@/app/context/UserContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useItinerary } from "@/app/context/ItineraryContext";
import { useSRM } from "@/app/context/SRMContext";
import { useCurrency } from "@/hooks/useCurrency";
import { DayPlan } from "../create-day/constants/daywiseConstants";
import { FixedDeparture } from "@/utils/itineraryStorage";
import { getAllTariffs } from "@/utils/tariffAPI";

// --- HELPERS ---
const isItemIncluded = (status?: string) =>
  !status || status.toLowerCase() === "included";
const safeNum = (val: any) => {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
};
const getShareLabel = (pax: number) => {
  if (pax === 1) return "Single";
  if (pax === 2) return "Twin/Double";
  if (pax === 3) return "Triple";
  if (pax === 4) return "Quad";
  return `${pax}-Pax`;
};

// Date Formatter: "10 Jan 2026"
const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return "TBA";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "TBA";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Date Calculator: Start Date + Days
const getCalculatedDate = (startStr: string, dayOffset: number) => {
  if (!startStr) return "";
  const d = new Date(startStr);
  if (isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + dayOffset);
  return ` | ${formatDisplayDate(d.toISOString())}`;
};

// --- SUB COMPONENT: LEDGER ROW ---
const LedgerRow = ({
  itemId,
  typeLabel,
  typeColor,
  details,
  inclusionType,
  config,
  manualNetTotal,
  onCostChange,
  divisor,
  currency,
  formatPrice,
  isGhost,
  vendorName,
  rowSpan = 1,
  isSubRow = false,
  isEmployeeView = false,
  isOptionalChecked = false,
  onToggleOptional = () => {},
}: any) => {
  // 🌟 FIX: We now allow BOTH 'included' and 'optional' to be priced!
  const isIncluded =
    !inclusionType || inclusionType.toLowerCase() === "included";
  const isOptional = inclusionType?.toLowerCase() === "optional";
  const isCostable = isIncluded || isOptional;

  // Calculate PP Cost for display/editing
  const ppCost = divisor > 0 && isCostable ? manualNetTotal / divisor : 0;

  let rowClass =
    "border-b border-gray-200 hover:bg-blue-50/30 transition-colors";
  if (isGhost) rowClass += " bg-gray-50/80 text-gray-400";
  else if (!isCostable) rowClass += " opacity-60 bg-red-50/20";
  else if (isOptional) rowClass += " bg-orange-50/30"; // Gives optional rows a slight orange tint

  function toggleOptional(arg0: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <tr className={rowClass}>
      {!isSubRow && (
        <td
          rowSpan={rowSpan}
          className="py-3 px-4 align-top w-[90px] border-r border-gray-300"
        >
          <span
            className={`text-[11px] font-bold uppercase tracking-wider ${typeColor || "text-gray-500"}`}
          >
            {typeLabel}
          </span>
        </td>
      )}

      {/* 🌟 UPGRADED: Added the Checkbox for Optional Items */}
      <td className="py-3 px-4 align-middle">
        <span className="font-medium text-sm flex items-center flex-wrap gap-2 text-gray-800">
          {details}
          {!isIncluded && (
            <span
              className={`text-[10px] uppercase font-bold ${isOptional ? "text-orange-500" : "text-red-500"}`}
            >
              ({inclusionType})
            </span>
          )}
          {isOptional && !isEmployeeView && (
            <label className="flex items-center gap-1 cursor-pointer bg-orange-100 hover:bg-orange-200 px-2 py-0.5 rounded text-[10px] font-bold text-orange-700 transition-colors shadow-sm ml-2">
              <input
                type="checkbox"
                checked={isOptionalChecked}
                onChange={() => onToggleOptional(itemId.toString())}
                className="accent-orange-600 cursor-pointer w-3 h-3"
              />
              Add to Quote
            </label>
          )}
        </span>
      </td>

      {!isEmployeeView && (
        <td className="py-3 px-4 align-middle">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded truncate max-w-[100px] block">
            {vendorName}
          </span>
        </td>
      )}

      <td className="py-3 px-4 align-middle">
        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded inline-block whitespace-nowrap">
          {config}
        </span>
      </td>

      {isEmployeeView ? (
        <td className="py-3 px-4 align-middle text-right">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${isOptional ? "text-orange-700 bg-orange-50 border-orange-200" : "text-green-700 bg-green-50 border-green-200"}`}
          >
            {isOptional ? "Optional" : "Included"}
          </span>
        </td>
      ) : (
        <>
          <td className="py-3 px-4 align-middle text-right">
            {!isGhost && isCostable ? (
              <div className="flex items-center justify-end gap-1">
                <span className="text-xs font-bold text-gray-400">
                  {currency}
                </span>
                <input
                  type="number"
                  min="0"
                  value={manualNetTotal === 0 ? "" : manualNetTotal}
                  onChange={(e) =>
                    onCostChange(itemId, parseFloat(e.target.value) || 0, "net")
                  }
                  placeholder="0"
                  className="w-24 p-1.5 text-right font-bold text-gray-900 border border-blue-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                />
              </div>
            ) : (
              <span className="text-xs text-gray-400 italic">
                {isGhost ? "Included" : "-"}
              </span>
            )}
          </td>

          <td className="py-3 px-4 align-middle text-right border-l border-gray-100 bg-gray-50/50">
            {!isGhost && isCostable && (
              <div className="flex flex-col items-end">
                <div className="flex items-center justify-end gap-1">
                  <span className="text-xs font-bold text-gray-400">
                    {currency}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={
                      ppCost === 0
                        ? ""
                        : Number.isInteger(ppCost)
                          ? ppCost
                          : ppCost.toFixed(2)
                    }
                    onChange={(e) =>
                      onCostChange(
                        itemId,
                        (parseFloat(e.target.value) || 0) * divisor,
                        "pp",
                      )
                    }
                    placeholder="0"
                    className="w-20 p-1 text-right font-mono text-xs font-bold text-blue-600 border border-transparent hover:border-blue-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all bg-transparent focus:bg-white"
                  />
                </div>
                <div className="text-[9px] text-gray-400 mr-1">/ person</div>
              </div>
            )}
          </td>
        </>
      )}
    </tr>
  );
};

export default function CostingPage() {
  const router = useRouter();
  const { user } = useUser();
  const {
    itineraryData,
    updateItineraryData,
    saveItinerary,
    approveCosting,
    rejectCosting,
    revertToPending,
    allowReEdit,
  } = useItinerary();
  const { suppliers } = useSRM();

  // Grab the global function
  const { reorderDays } = useItinerary();

  // Handle what happens when the user drops the item
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return; // Dropped outside the list
    if (result.source.index === result.destination.index) return; // Dropped in the same spot

    // Call the global context to update the whole app!
    reorderDays(result.source.index, result.destination.index);
  };

  // 🌟 FIX 1: Calculate the exact number of days from the routing data
  const routes = itineraryData?.routingData?.routes || [];
  const totalNights = routes.reduce(
    (acc: number, curr: any) => acc + (parseInt(curr.nights) || 0),
    0,
  );
  const totalDays =
    totalNights > 0
      ? totalNights + 1
      : (itineraryData?.dayWiseActivities || []).length || 1;

  // 🌟 FIX 2: Slice the array to strictly cut off any "ghost days" left at the end!
  const rawDayPlans = (
    (itineraryData?.dayWiseActivities || []) as DayPlan[]
  ).slice(0, totalDays);
  const travelerCount = safeNum(itineraryData?.numberOfTravelers) || 1;

  // 🌟 NEW: OCCUPANCY LOCKDOWN LOGIC 🌟
  const isSglEnabled = true; // Single is ALWAYS enabled (for solo rooms)
  const isDblEnabled = travelerCount >= 2;
  const isTplEnabled = travelerCount >= 3;
  const isQuadEnabled = travelerCount >= 4;

  const { currency, setCurrency, convert, formatPrice, loading, rates } =
    useCurrency("USD");

  // --- STATE ---
  const [markupPercent, setMarkupPercent] = useState<number>(20);
  const [includedOptionals, setIncludedOptionals] = useState<string[]>(itineraryData.includedOptionals || []);
  const [agentMargin, setAgentMargin] = useState<number>(10);
  const [roundingMode, setRoundingMode] = useState<string>("none");
  const [fixedDepartures, setFixedDepartures] = useState<FixedDeparture[]>([]);
  const [selectedDepartureId, setSelectedDepartureId] = useState<string | null>(
    null,
  );

  // 👇 NEW: Tracks which month is currently opened in Table 3
  const [activeMonthId, setActiveMonthId] = useState<string | null>(null);

  // 🌟 SUPPLIER PDF MODAL STATES
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [hideSupplierPrices, setHideSupplierPrices] = useState(true);

  // 👇 NEW: Agent Assignment States
  const [agents, setAgents] = useState<any[]>([]);
  const [assignedAgentId, setAssignedAgentId] = useState<string>("");

  // MONTHLY MATRIX
  const MONTHS = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    if ((itineraryData as any).simulationDate) {
      const d = new Date((itineraryData as any).simulationDate);
      if (!isNaN(d.getTime())) return MONTHS[d.getMonth()];
    }
    return "JAN";
  });

  

  const toggleOptional = (itemId: string) => {
      // 1. Calculate the new state first (Without using the 'prev =>' callback)
      const newState = includedOptionals.includes(itemId) 
          ? includedOptionals.filter(id => id !== itemId) 
          : [...includedOptionals, itemId];
      
      // 2. Update the local state
      setIncludedOptionals(newState);
      
      // 3. Save it to the global context safely OUTSIDE the setter
      updateItineraryData({ includedOptionals: newState } as any);
      
      // 4. Force save to local storage so it survives the refresh
      const currentData = { ...itineraryData, includedOptionals: newState };
      saveItineraryToStorage(currentData as any);
  };
  // DATE STATE
  const [seasonStart, setSeasonStart] = useState<string>("");
  const [seasonEnd, setSeasonEnd] = useState<string>("");
  const [simulationDate, setSimulationDate] = useState<string>("");

  const [pricingMatrix, setPricingMatrix] = useState<
    Record<string, Record<string, number>>
  >(itineraryData.pricingMatrix || {});

  // 🌟 SMART COSTING STATES 🌟
  const [allTariffs, setAllTariffs] = useState<any[]>([]);
  const [isSyncingRates, setIsSyncingRates] = useState(false);

  // Fetch all tariffs silently in the background when the Admin opens the page
  useEffect(() => {
    const fetchTariffs = async () => {
      const data = await getAllTariffs();
      setAllTariffs(data || []);
    };
    if (user?.role === "admin") fetchTariffs();
  }, [user]);

  // --- 1. CORE HELPER FUNCTIONS (Must be defined here, NOT inside loops) ---
  const getCost = (itemId: string | number) =>
    pricingMatrix[selectedMonth]?.[itemId.toString()] || 0;

  const getVendorName = (id?: string) => {
    if (!id) return "-";
    const sup = suppliers.find((s) => s.id === id);
    return sup ? sup.name : "Unknown";
  };

  const handleManualCostChange = (
    itemId: string | number,
    value: number,
    inputType?: "net" | "pp",
  ) => {
    const updatedMatrix = {
      ...pricingMatrix,
      [selectedMonth]: {
        ...(pricingMatrix[selectedMonth] || {}),
        [itemId.toString()]: value,
      },
    };

    setPricingMatrix(updatedMatrix);
    updateItineraryData({ pricingMatrix: updatedMatrix });
  };

  // =====================================================================
  // 🌟 THE SMART COSTING ENGINE (UPGRADED FOR SGL/DBL/TPL/QUAD) 🌟
  // =====================================================================
  const syncSmartRates = () => {
    if (!simulationDate) {
      alert(
        "Please set a 'Valid From / Ref. Start Date' (top right) so the engine knows what dates to calculate!",
      );
      return;
    }
    setIsSyncingRates(true);

    const updatedMatrix = { ...pricingMatrix };
    if (!updatedMatrix[selectedMonth]) updatedMatrix[selectedMonth] = {};

    let ratesFound = 0;

    rawDayPlans.forEach((day) => {
      // 1. Calculate the exact real-world date for this specific itinerary day
      const dayDate = new Date(simulationDate);
      dayDate.setDate(dayDate.getDate() + (day.dayNumber - 1));
      const dayTime = dayDate.getTime();

      // 2. Helper to find the correct Season block
      const getBestSeason = (supplierId?: string, itemName?: string) => {
        let tariff;
        if (supplierId)
          tariff = allTariffs.find((t) => t.serviceId === supplierId);
        if (!tariff && itemName)
          tariff = allTariffs.find((t) => t.serviceName === itemName);
        if (!tariff) return null;

        const validSeasons = tariff.seasons.filter((s: any) => {
          if (!s.startDate || !s.endDate) return false;
          const start = new Date(s.startDate).getTime();
          const end = new Date(s.endDate).getTime();
          return dayTime >= start && dayTime <= end;
        });

        if (validSeasons.length === 0) return null;

        // Specificity Override: Shortest date range wins (Peak overrides Base)
        validSeasons.sort((a: any, b: any) => {
          const durA =
            new Date(a.endDate).getTime() - new Date(a.startDate).getTime();
          const durB =
            new Date(b.endDate).getTime() - new Date(b.startDate).getTime();
          return durA - durB;
        });

        return validSeasons[0];
      };

      // 3. 🏨 AUTO-FILL STAYS (Advanced SGL/DBL/TPL Math)
      day.stays?.forEach((s) => {
        if (!isItemIncluded(s.inclusionType)) return;

        const bestSeason = getBestSeason(s.linkedSupplierId, s.hotelName);

        if (bestSeason && bestSeason.rates && bestSeason.rates.length > 0) {
          // Find exact room match, or fallback to first room
          const targetRoomName =
            s.roomCategory || s.roomName || "Standard Room";
          let matchedRoom =
            bestSeason.rates.find((r: any) =>
              targetRoomName.toLowerCase().includes(r.name.toLowerCase()),
            ) || bestSeason.rates[0];

          let totalPerNight = 0;
          const occupancies = s.roomOccupancy || [2]; // Array of pax per room (e.g. [2, 1] means 1 DBL, 1 SGL)

          // Add up the correct price for each room based on how many people are in it
          occupancies.forEach((pax: number) => {
            if (pax === 1) totalPerNight += matchedRoom.singleRate || 0;
            else if (pax === 2) totalPerNight += matchedRoom.doubleRate || 0;
            else if (pax === 3) totalPerNight += matchedRoom.tripleRate || 0;
            else if (pax >= 4) totalPerNight += matchedRoom.quadRate || 0;
          });

          // Multiply by number of nights
          const nights = Number(s.nights) || 1;
          const finalNetCost = totalPerNight * nights;

          if (finalNetCost > 0) {
            updatedMatrix[selectedMonth][s.id.toString()] = finalNetCost;
            ratesFound++;
          }
        }
      });

      // 4. 🚗 AUTO-FILL TRANSPORTS (Fully Fixed for Transfer & Disposal)
      day.transports?.forEach((t) => {
        if (!isItemIncluded(t.inclusionType)) return;

        // 1. Look for the EXACT contract name we saved in the DB (e.g., "Rome Transport Fleet")
        const expectedServiceName = day.city
          ? `${day.city} Transport Fleet`
          : undefined;
        const bestSeason = getBestSeason(
          t.linkedSupplierId,
          expectedServiceName,
        );

        if (bestSeason && bestSeason.rates && bestSeason.rates.length > 0) {
          // 2. Find the exact vehicle type (e.g., "Sedan Car")
          const matchedRateRow =
            bestSeason.rates.find(
              (r: any) => r.vehicleType === t.vehicleType,
            ) || bestSeason.rates[0];

          // 3. Check if the Itinerary was set to Disposal or Transfer
          const isDisposal = t.subType === "disposal";

          // 4. Pull the correct price from the correct column
          const ratePerVehicle = isDisposal
            ? matchedRateRow.disposalRate || 0
            : matchedRateRow.transferRate || 0;

          if (ratePerVehicle > 0) {
            const vehicleCount = Number(t.vehicleCount) || 1;
            updatedMatrix[selectedMonth][t.id.toString()] =
              ratePerVehicle * vehicleCount;
            ratesFound++;
          }
        }
      });

      // 5. 🎟️ AUTO-FILL ACTIVITIES (Cost x Pax)
      day.activities?.forEach((a) => {
        if (!isItemIncluded(a.inclusionType)) return;
        const bestSeason = getBestSeason(a.linkedSupplierId, a.heading);
        if (bestSeason && bestSeason.rates && bestSeason.rates.length > 0) {
          const baseRate = bestSeason.rates[0].singleRate || 0;
          if (baseRate > 0) {
            const pax = Number(a.paxCount) || travelerCount;
            updatedMatrix[selectedMonth][a.id.toString()] = baseRate * pax;
            ratesFound++;
          }
        }
      });
    });

    setPricingMatrix(updatedMatrix);
    updateItineraryData({ pricingMatrix: updatedMatrix });
    setIsSyncingRates(false);

    if (ratesFound > 0) {
      alert(
        `Success! Auto-filled ${ratesFound} live rates from the Rate Manager based on exact occupancy and dates.`,
      );
    } else {
      alert(
        "No matching seasonal rates found for these dates. Any items left at $0 require manual pricing.",
      );
    }
  };



  useEffect(() => {
    if (user && user.role !== 'admin') {
       router.push('/dashboard/itinerary/review'); 
    }
  }, [user, router]);

  useEffect(() => {
    if (
      itineraryData.selectedCurrency &&
      itineraryData.selectedCurrency !== currency
    )
      setCurrency(itineraryData.selectedCurrency);
    if (itineraryData.markupPercentage !== undefined)
      setMarkupPercent(itineraryData.markupPercentage);
    if ((itineraryData as any).agentMargin !== undefined)
      setAgentMargin((itineraryData as any).agentMargin);
    if (itineraryData.roundingMode) setRoundingMode(itineraryData.roundingMode);
    if (itineraryData.fixedDepartures)
      setFixedDepartures(itineraryData.fixedDepartures);
    if (itineraryData.pricingMatrix)
      setPricingMatrix(itineraryData.pricingMatrix);
    if (itineraryData.seasonStartDate)
      setSeasonStart(itineraryData.seasonStartDate);
    if (itineraryData.seasonEndDate) setSeasonEnd(itineraryData.seasonEndDate);
    if (itineraryData.selectedDepartureId)
      setSelectedDepartureId(itineraryData.selectedDepartureId);

    // 👇 FIX: Load the saved simulation date on refresh
    if ((itineraryData as any).simulationDate)
      setSimulationDate((itineraryData as any).simulationDate);
    if (itineraryData.includedOptionals) setIncludedOptionals(itineraryData.includedOptionals);
  }, [itineraryData]);


  // 👇 NEW: Fetch active agents for the dropdown (Admin only)
  useEffect(() => {
    if (user?.role === "admin") {
      const fetchAgents = async () => {
        try {
          const res = await fetch("/api/admin/agents");
          const json = await res.json();
          if (json.success) {
            // Only show agents that are actively selling
            setAgents(json.data.filter((a: any) => a.status === 'active'));
          }
        } catch (error) {
          console.error("Failed to fetch agents", error);
        }
      };
      fetchAgents();
    }
  }, [user]);

  // UPDATE YOUR EXISTING useEffect for itineraryData (around line 365) to include this:
  useEffect(() => {
    // ... your existing code ...
    if (itineraryData.includedOptionals) setIncludedOptionals(itineraryData.includedOptionals);
    
    // 👇 NEW: Sync the assigned agent if one was already saved
    if (itineraryData.assignedAgentId) setAssignedAgentId(itineraryData.assignedAgentId);
  }, [itineraryData]);


  // --- HANDLERS ---
  const handleValidityChange = (field: "start" | "end", val: string) => {
    if (field === "start") {
      setSeasonStart(val);
      updateItineraryData({ seasonStartDate: val });
    } else {
      setSeasonEnd(val);
      updateItineraryData({ seasonEndDate: val });
    }
  };

  const handleRoundingChange = (mode: string) => {
    setRoundingMode(mode);
    updateItineraryData({ roundingMode: mode } as any);
  };

  // 👇 HIGHLIGHT FIX: Admin actions must forcefully save the status to the Database to unlock the Agent UI
  const handleReject = () => {
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      rejectCosting(reason);

      // Force save to database so the Agent instantly unlocks
      const allLibs = JSON.parse(
        localStorage.getItem("itinerary_library") || "[]",
      );
      const idx = allLibs.findIndex((i: any) => i.id === itineraryData.id);
      if (idx !== -1) {
        allLibs[idx].status = "reedit_requested";
        allLibs[idx].adminComment = reason;
        localStorage.setItem("itinerary_library", JSON.stringify(allLibs));
      }

      router.push("/dashboard/itinerary/library");
    }
  };

  const handleApprove = () => {
    approveCosting();

    // Force save to database so the Agent instantly gains access to the Costing page
    const allLibs = JSON.parse(
      localStorage.getItem("itinerary_library") || "[]",
    );
    const idx = allLibs.findIndex((i: any) => i.id === itineraryData.id);
    if (idx !== -1) {
      allLibs[idx].status = "approved";
      localStorage.setItem("itinerary_library", JSON.stringify(allLibs));
    }

    alert(
      "Costing Approved! Agent/Employee can now see the Pricing and Preview.",
    );
    router.push("/dashboard/itinerary/library");
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    updateItineraryData({ selectedCurrency: value });
  };


  // 👇 NEW: Handle Agent Assignment
  const handleAssignAgent = (agentId: string) => {
    setAssignedAgentId(agentId);
    
    // Update global context
    updateItineraryData({ assignedAgentId: agentId } as any);
    
    // Force save to storage so it persists to the Preview page
    const currentData = { ...itineraryData, assignedAgentId: agentId };
    saveItineraryToStorage(currentData as any);
  };


  // --- DATA PROCESSING ---
  const processedDayPlans = useMemo(() => {
    const plansWithGhosts = JSON.parse(
      JSON.stringify(rawDayPlans),
    ) as DayPlan[];
    rawDayPlans.forEach((day) => {
      if (!day.stays) return;
      day.stays.forEach((stay) => {
        const nights = safeNum(stay.nights);
        if (nights > 1) {
          const currentDayNum = day.dayNumber;
          for (let i = 1; i < nights; i++) {
            const targetDayNum = currentDayNum + i;
            const targetDay = plansWithGhosts.find(
              (d) => d.dayNumber === targetDayNum,
            );
            if (targetDay) {
              if (!targetDay.stays) targetDay.stays = [];
              targetDay.stays.push({
                ...stay,
                id: -Math.random(),
                costPerNight: 0,
                isGhost: true,
              });
            }
          }
        }
      });
    });
    return plansWithGhosts;
  }, [rawDayPlans]);

  // --- 1. CALCULATE TOTALS (SEPARATING INCLUDED VS OPTIONAL) ---
  const totals = useMemo(() => {
    let totalNet = 0;
    let optionalNet = 0;
    const currentMonthCosts = pricingMatrix[selectedMonth] || {};

    const addCost = (item: any) => {
      const cost = currentMonthCosts[item.id.toString()] || 0;
      const itemIdStr = item.id.toString();

      if (
        !item.inclusionType ||
        item.inclusionType.toLowerCase() === "included"
      ) {
        totalNet += cost;
      } else if (item.inclusionType.toLowerCase() === "optional") {
        // 🌟 NEW LOGIC: Check if the user toggled this optional item to be included!
        if (includedOptionals.includes(itemIdStr)) {
          totalNet += cost; // Shift to the Main Blue Box
        } else {
          optionalNet += cost; // Keep in the Orange Add-on Box
        }
      }
    };

    rawDayPlans.forEach((day) => {
      day.stays?.forEach(addCost);
      day.transports?.forEach(addCost);
      day.activities?.forEach(addCost);
      day.meals?.forEach(addCost);
    });
    return { totalNet, optionalNet };
  }, [rawDayPlans, pricingMatrix, selectedMonth, includedOptionals]); // 👈 Added includedOptionals here

  const netInSelected = totals.totalNet;
  const optionalNetInSelected = totals.optionalNet; // 🌟 NEW
  const isAgent = user?.role === "agent";

  let activeFixedDeparture: any = null;
  let activePriceDBL = 0;

  for (const month of fixedDepartures) {
    if (month.id === selectedDepartureId) {
      activeFixedDeparture = month;
      activePriceDBL = month.priceDBL || 0;
      break;
    }
    const specificDate = month.departures?.find(
      (d: any) => d.id === selectedDepartureId,
    );
    if (specificDate) {
      activeFixedDeparture = specificDate;
      activePriceDBL = specificDate.overridePriceDBL
        ? Number(specificDate.overridePriceDBL)
        : month.priceDBL || 0;
      break;
    }
  }

  // --- 2. B2B WHOLESALE CALCULATION (Admin's Price to Agent) ---
  let wholesalePerPerson = 0;
  let wholesaleGrandTotal = 0;

  if (activeFixedDeparture) {
    wholesalePerPerson = activePriceDBL;
    wholesaleGrandTotal = wholesalePerPerson * travelerCount;
  } else {
    const adminMarkupAmount = netInSelected * (markupPercent / 100);
    wholesaleGrandTotal = netInSelected + adminMarkupAmount;
    wholesalePerPerson =
      travelerCount > 0 ? wholesaleGrandTotal / travelerCount : 0;
  }

  // --- 3. RETAIL CALCULATION (Agent's Price to Client) ---
  let finalPerPerson = 0;
  let finalGrandTotal = 0;
  let displayMarkupPercent = isAgent ? agentMargin : markupPercent;

  if (isAgent) {
    const agencyMarkupAmount = wholesaleGrandTotal * (agentMargin / 100);
    const exactPerPerson =
      travelerCount > 0
        ? (wholesaleGrandTotal + agencyMarkupAmount) / travelerCount
        : 0;

    finalPerPerson = exactPerPerson;
    if (roundingMode === "5")
      finalPerPerson = Math.ceil(exactPerPerson / 5) * 5;
    else if (roundingMode === "10")
      finalPerPerson = Math.ceil(exactPerPerson / 10) * 10;
    else if (roundingMode === "100")
      finalPerPerson = Math.ceil(exactPerPerson / 100) * 100;

    finalGrandTotal = finalPerPerson * travelerCount;
  } else {
    finalPerPerson = wholesalePerPerson;
    if (roundingMode === "5")
      finalPerPerson = Math.ceil(wholesalePerPerson / 5) * 5;
    else if (roundingMode === "10")
      finalPerPerson = Math.ceil(wholesalePerPerson / 10) * 10;
    else if (roundingMode === "100")
      finalPerPerson = Math.ceil(wholesalePerPerson / 100) * 100;

    finalGrandTotal = finalPerPerson * travelerCount;
  }

  // --- 4. 🌟 OPTIONAL ADD-ONS RETAIL CALCULATION 🌟 ---
  // We apply the exact same Admin Markup and Agent Margin to the optional items!
  const adminOptionalMarkup = optionalNetInSelected * (markupPercent / 100);
  const wholesaleOptionalTotal = optionalNetInSelected + adminOptionalMarkup;

  let finalOptionalGrandTotal = 0;
  if (isAgent) {
    finalOptionalGrandTotal =
      wholesaleOptionalTotal + wholesaleOptionalTotal * (agentMargin / 100);
  } else {
    finalOptionalGrandTotal = wholesaleOptionalTotal;
  }

  let finalOptionalPerPerson =
    travelerCount > 0 ? finalOptionalGrandTotal / travelerCount : 0;
  if (roundingMode === "5")
    finalOptionalPerPerson = Math.ceil(finalOptionalPerPerson / 5) * 5;
  else if (roundingMode === "10")
    finalOptionalPerPerson = Math.ceil(finalOptionalPerPerson / 10) * 10;
  else if (roundingMode === "100")
    finalOptionalPerPerson = Math.ceil(finalOptionalPerPerson / 100) * 100;
  finalOptionalGrandTotal = finalOptionalPerPerson * travelerCount;

  // ========================================================
  // --- TIER 2 & 3: MASTER-CHILD INVENTORY LOGIC ---
  // ========================================================

  // 👇 CRITICAL FIX: Save the selection to storage so Preview Page knows what changed
  const toggleDepartureSelection = (id: string) => {
    const isSelecting = selectedDepartureId !== id;
    const newId = isSelecting ? id : null;
    setSelectedDepartureId(newId);

    const updatedData = {
      ...itineraryData,
      selectedDepartureId: newId || undefined,
    };
    updateItineraryData(updatedData);

    // This line is the magic fix! It tells the Preview page that you unselected the package.
    saveItineraryToStorage(updatedData as any);
  };

  // --- 1. Month Actions (Parent / Master) ---
  const addMonthRow = () => {
    const newRow: FixedDeparture = {
      id: Date.now().toString(),
      month: "",
      priceDBL: 0,
      priceSGL: 0,
      priceTPL: 0,
      priceQUAD: 0,
      departures: [],
      date: undefined,
      price: 0,
      isSelected: undefined,
      label: undefined,
      status: "",
    };
    const updated = [...fixedDepartures, newRow];
    setFixedDepartures(updated);
    updateItineraryData({ fixedDepartures: updated });
    setActiveMonthId(newRow.id); // Auto-open Table 3 for the new month
  };

  const updateMonthRow = (id: string, field: string, value: any) => {
    const updated = fixedDepartures.map((d) =>
      d.id === id ? { ...d, [field]: value } : d,
    );
    setFixedDepartures(updated);
    updateItineraryData({ fixedDepartures: updated });
  };

  const removeMonthRow = (id: string) => {
    if (!confirm("Delete this month and all its specific dates?")) return;
    const updated = fixedDepartures.filter((d) => d.id !== id);
    setFixedDepartures(updated);
    updateItineraryData({ fixedDepartures: updated });
    if (activeMonthId === id) setActiveMonthId(null);
  };

  // --- 2. Specific Date Actions (Child) ---
  const addSpecificDate = (monthId: string) => {
    const updated = fixedDepartures.map((month) => {
      if (month.id === monthId) {
        const newDate: SpecificDeparture = {
          id: Date.now().toString(),
          date: "",
          endDate: "",
          status: "Available",
          overridePriceDBL: "",
          overridePriceSGL: "",
          overridePriceTPL: "",
          overridePriceQUAD: "",
          isSelected: false,
        };
        return { ...month, departures: [...(month.departures || []), newDate] };
      }
      return month;
    });
    setFixedDepartures(updated);
    updateItineraryData({ fixedDepartures: updated });
  };

  const updateSpecificDate = (
    monthId: string,
    dateId: string,
    field: string,
    value: any,
  ) => {
    const updated = fixedDepartures.map((month) => {
      if (month.id === monthId) {
        const updatedDepartures = month.departures.map((d) =>
          d.id === dateId ? { ...d, [field]: value } : d,
        );
        return { ...month, departures: updatedDepartures };
      }
      return month;
    });
    setFixedDepartures(updated);
    updateItineraryData({ fixedDepartures: updated });
  };

  const removeSpecificDate = (monthId: string, dateId: string) => {
    const updated = fixedDepartures.map((month) => {
      if (month.id === monthId) {
        return {
          ...month,
          departures: month.departures.filter((d) => d.id !== dateId),
        };
      }
      return month;
    });
    setFixedDepartures(updated);
    updateItineraryData({ fixedDepartures: updated });
  };

  // --- HANDLER: CHANGE MARKUP & SAVE ---
  const handleMarkupChange = (val: number) => {
    // 1. Update Visual State immediately
    setMarkupPercent(val);

    // 2. Update Context
    updateItineraryData({ markupPercentage: val });

    // 3. FORCE SAVE to Storage (Crucial for Refresh)
    // We create a temporary object merging current data with the new markup
    const currentData = { ...itineraryData, markupPercentage: val };
    saveItineraryToStorage(currentData);
  };

  // --- HANDLER: CHANGE SIMULATION DATE & SAVE ---
  const handleSimulationDateChange = (val: string) => {
    // 1. Update visual state
    setSimulationDate(val);

    // 2. SMART SYNC: If they pick "22-Jan-2026", automatically switch the tab to "JAN"
    if (val) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        const newMonthTab = MONTHS[d.getMonth()];
        if (selectedMonth !== newMonthTab) {
          setSelectedMonth(newMonthTab);
        }
      }
    }

    // 3. Update context & storage
    const currentData = { ...itineraryData, simulationDate: val };
    updateItineraryData(currentData as any);
    saveItineraryToStorage(currentData as any);
  };

  // 👇 FIX 3: Dedicated handler to save the Agent's Margin without destroying Admin markup
  const handleAgentMarginChange = (val: number) => {
    setAgentMargin(val);
    updateItineraryData({ agentMargin: val } as any);
    const currentData = { ...itineraryData, agentMargin: val };
    saveItineraryToStorage(currentData as any);
  };

  const handleDownloadExcel = () => {
    alert("Excel Download");
  };

  // --- PDF DOWNLOAD HANDLER ---
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const cleanPrice = (amount: number) => formatPrice(amount, currency);

    // 👇 NEW LOGIC: Check if the user is an Admin
    const isAdmin = user?.role === "admin";

    // --- 1. CALCULATE DATES ---
    // 👇 FIX: Use the actual Trip Validity (Season Start/End) dates from the UI
    const formattedStart = seasonStart ? formatDisplayDate(seasonStart) : "TBA";
    const formattedEnd = seasonEnd ? formatDisplayDate(seasonEnd) : "TBA";
    const tripDateString = `${formattedStart} - ${formattedEnd}`;
    // // --- 2. HEADER ---

    const logoBase64 =
      "data:image/png;base64,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";

    // 1. Header Background
    doc.setFillColor(245, 245, 220);
    doc.rect(0, 0, pageWidth, 5, "F");

    // 2. Logo Logic
    if (logoBase64 && logoBase64.length > 100) {
      try {
        const cleanBase64 = logoBase64
          .replace(/^data:image\/(png|jpg|jpeg);base64,/, "")
          .replace(/\s/g, "");

        doc.addImage(cleanBase64, "PNG", 14, 8, 50, 10);
      } catch (e) {
        console.error("Logo Error:", e);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(22);
        doc.text("TRAVDEK", 14, 20);
      }
    } else {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("TRAVDEK", 14, 20);
    }

    // --- 3. METADATA (Updated Sequence) ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(`Quotation For: ${itineraryData.tripName || "New Trip"}`, 14, 30);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);

    // Row 1: Duration & Travelers
    doc.text(`${tripDuration}  |  ${travelerCount} Travelers`, 14, 38);

    // Row 2: Specific Dates (Replacing Season)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 50, 100); // Dark Blue for emphasis
    doc.text(tripDateString, 14, 44);

    // Row 3: Generated Date
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 50);

    // --- 4. TABLE GENERATION ---
    const tableBody: any[] = [];

    processedDayPlans.forEach((day) => {
      // Calculate specific date for this day
      let dayDateDisplay = "";
      if (activeFixedDeparture || simulationDate) {
        const startRef = activeFixedDeparture
          ? activeFixedDeparture.date
          : simulationDate;
        dayDateDisplay = getCalculatedDate(startRef, day.dayNumber - 1);
      }

      // 👇 FIX: Adjust colSpan dynamically based on role (6 for Admin, 4 for Employee)
      tableBody.push([
        {
          content: `DAY ${day.dayNumber} - ${day.city?.toUpperCase() || ""}${dayDateDisplay}`,
          colSpan: isAdmin ? 6 : 4,
          styles: {
            fillColor: [240, 240, 240],
            fontStyle: "bold",
            textColor: [50, 50, 50],
          },
        },
      ]);

      // Helper to add rows using Pricing Matrix
      const addRow = (
        cat: string,
        name: string,
        status: string | undefined,
        config: string,
        itemId: number,
        divisor: number,
        isGhost: boolean = false,
      ) => {
        const isIncluded = isItemIncluded(status);
        const netTotal = getCost(itemId);
        const cost = isIncluded && !isGhost ? netTotal : 0;
        const ppCost = divisor > 0 && cost > 0 ? cost / divisor : 0;
        const displayConfig = isGhost ? "Continuing Stay" : config;
        const displayStatus = status ? status.toUpperCase() : "INCLUDED";

        // 👇 FIX: If Admin, push 6 columns. If Employee, push 4 columns.
        if (isAdmin) {
          tableBody.push([
            cat,
            name + (!isIncluded ? ` (${displayStatus})` : ""),
            displayStatus,
            displayConfig,
            isIncluded && !isGhost ? cleanPrice(ppCost) : "-",
            isIncluded && !isGhost ? cleanPrice(cost) : "-",
          ]);
        } else {
          tableBody.push([
            cat,
            name + (!isIncluded ? ` (${displayStatus})` : ""),
            displayStatus,
            displayConfig,
          ]);
        }
      };

      // ... (Keep your existing Loop logic for Stays, Transports, Activities, Meals here) ...
      // Copying the loops from your previous code for completeness:
      if (day.stays)
        day.stays.forEach((s: any) => {
          getStayRows(s).forEach((row: any) =>
            addRow(
              "Stay",
              row.details,
              s.inclusionType,
              row.config,
              s.id,
              row.ppDivisor,
              s.isGhost,
            ),
          );
        });
      if (day.transports)
        day.transports.forEach((t: any) => {
          const div = t.paxCount || travelerCount;
          addRow(
            "Transport",
            t.vehicleType,
            t.inclusionType,
            `${t.vehicleCount} Veh / ${div} Pax`,
            t.id,
            div,
          );
        });
      if (day.activities)
        day.activities.forEach((a: any) => {
          const pax = a.paxCount || travelerCount;
          addRow(
            "Activity",
            a.heading,
            a.inclusionType,
            `${pax} Pax`,
            a.id,
            pax,
          );
        });
      if (day.meals)
        day.meals.forEach((m: any) => {
          addRow(
            "Meal",
            m.restaurantName,
            m.inclusionType,
            m.mealType,
            m.id,
            travelerCount,
          );
        });
    });

    autoTable(doc, {
      startY: 55,
      // 👇 FIX: Different Headers for Admin vs Employee
      head: isAdmin
        ? [["Category", "Details", "Status", "Config", "PP Cost", "Net Cost"]]
        : [["Category", "Details", "Status", "Config"]],
      body: tableBody,
      //   head: [['Category', 'Details', 'Status', 'Config', 'PP Cost', 'Net Cost']],
      //   body: tableBody,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3 },

      // 👇 FIX: Apply right alignment only for Admin (columns 4 and 5)
      columnStyles: isAdmin
        ? { 4: { halign: "right" }, 5: { halign: "right" } }
        : {},
    });

    // --- 5. TOTALS ---
    // @ts-ignore
    let finalY = doc.lastAutoTable.finalY + 10;
    if (finalY > 240) {
      doc.addPage();
      finalY = 20;
    }

    doc.setDrawColor(200, 200, 200);
    doc.line(100, finalY, 196, finalY);

    let currentY = finalY + 8;

    // 👇 FIX: HIDE Net and Markup from Employee completely
    if (isAdmin) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      doc.setTextColor(100, 100, 100);
      doc.text(`Total Net (${selectedMonth}):`, 150, currentY, {
        align: "right",
      });
      doc.setTextColor(0, 0, 0);
      doc.text(cleanPrice(netInSelected), 190, currentY, { align: "right" });

      currentY += 6;
      doc.setTextColor(100, 100, 100);
      doc.text(`Markup (${displayMarkupPercent.toFixed(1)}%):`, 150, currentY, {
        align: "right",
      });
      doc.setTextColor(0, 0, 0);

      const markupAmt = activeFixedDeparture
        ? finalGrandTotal - netInSelected
        : netInSelected * (markupPercent / 100);

      doc.text(cleanPrice(markupAmt), 190, currentY, { align: "right" });

      currentY += 4;
      doc.setDrawColor(220, 220, 220);
      doc.line(140, currentY, 196, currentY);
      currentY += 6;
    }

    // Both Admin and Employee see the Final Grand Total & PP Cost
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Total Group Cost:", 150, currentY, { align: "right" });
    doc.setFont("courier", "bold");
    doc.text(cleanPrice(finalGrandTotal), 190, currentY, { align: "right" });

    currentY += 8;
    doc.setFillColor(240, 248, 255);
    doc.rect(110, currentY - 5, 90, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 100, 0);
    doc.text("Price Per Person:", 150, currentY, { align: "right" });
    doc.setFontSize(12);
    doc.text(cleanPrice(finalPerPerson), 190, currentY, { align: "right" });

    doc.save(
      `Quote_${itineraryData.tripId || "Travdek"}_${isAdmin ? "Internal" : "Client"}.pdf`,
    );
  };




  // --- 🌟 UPDATED: SUPPLIER PDF GENERATOR 🌟 ---
  const handleDownloadSupplierPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const cleanPrice = (amount: number) => formatPrice(amount, currency);

    // --- 1. HEADER (Mimicking Preview Page Design) ---
    
    // Trip Name & Duration
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 29, 106); // Dark Blue
    doc.text((itineraryData.tripName || "Draft Itinerary").toUpperCase(), 14, 22);
    
    doc.setFontSize(12);
    doc.text(`${totalDays} DAYS | ${totalNights} NIGHTS`, 14, 30);

    // 👉 FIX 1 & 2: Logo and Company Info (Right Aligned)
    const logoBase64 = "data:image/png;base64,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";
    
    try {
      const cleanBase64 = logoBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "").replace(/\s/g, "");
      if (cleanBase64.length > 100) {
        doc.addImage(cleanBase64, "PNG", 140, 6, 50, 8);
      }
    } catch (e) {
      console.warn("Logo skipped: Invalid Base64 string");
    }

    // Company Info Details (Matches Preview Page exactly)
    doc.setFontSize(6);
    doc.setTextColor(0, 29, 106); 
    doc.text("Email: Sandeep@TravDek.com", 142, 20);
    doc.text("Tel: +1 650 759 4331", 142, 24);
    doc.text("Web: www.TravDek.com", 142, 28);
    doc.text("Add: 750 Alma lane #4459 Foster City, CA 94404 USA", 142, 32);

    // --- 2. META DATA GRID ---
    const formattedStart = seasonStart ? formatDisplayDate(seasonStart) : "TBA";
    const formattedEnd = seasonEnd ? formatDisplayDate(seasonEnd) : "TBA";
    
    // Safely rebuild cities to prevent 'UNDEFINED'
    const validRoutes = itineraryData.routingData?.routes || [];
    const safeCitiesWithNights = validRoutes
      .filter((r: any) => r.cities && r.cities.length > 0 && r.cities[0].name)
      .map((r: any) => {
         const cityNames = r.cities.map((c: any) => c.name || "").filter(Boolean).join(' / ');
         const n = parseInt(r.nights) || 0;
         return n > 0 ? `${cityNames} (${n}N)` : cityNames;
      }).join(' | ') || "TBA";
    
    autoTable(doc, {
      startY: 40, // 👉 FIX 2: Shifted grid down slightly to make room for Company Info
      body: [
        [ { content: "Release Date:", styles: { fillColor: [249, 250, 251] } }, formatDisplayDate(new Date().toISOString()), { content: "Travelers:", styles: { fillColor: [249, 250, 251] } }, `${travelerCount} Pax`],
        [ { content: "Trip Validity:", styles: { fillColor: [249, 250, 251] } }, { content: `${formattedStart} to ${formattedEnd}`, colSpan: 3 } ],
        [ { content: "Country:", styles: { fillColor: [249, 250, 251] } }, { content: (itineraryData.selectedCountries?.join(', ') || "TBA").toUpperCase(), colSpan: 3 }],
        [ { content: "Cities:", styles: { fillColor: [249, 250, 251] } }, { content: safeCitiesWithNights.toUpperCase(), colSpan: 3 }],
        [ { content: "Start / End:", styles: { fillColor: [249, 250, 251] } }, `${startCity} / ${endCity}`, { content: "Route:", styles: { fillColor: [249, 250, 251] } }, `${itineraryData.selectedCountries?.length || 1} Country | ${routes.length} Cities`]
      ],
      theme: "grid",
      styles: { fontSize: 8, fontStyle: "bold", textColor: [29, 78, 216], lineColor: [160, 160, 160], lineWidth: 0.2 },
      columnStyles: { 0: { textColor: [50, 50, 50], cellWidth: 35 }, 2: { textColor: [50, 50, 50], cellWidth: 35 } }
    });

    // --- 3. ITINERARY DETAILS TITLE ---
    // @ts-ignore
    let currentY = doc.lastAutoTable.finalY + 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(153, 27, 27); // Red
    doc.text("ITINERARY DETAILS", 14, currentY);
    
    // 👉 FIX 3: Calculate exact width of text for a perfect underline
    const textWidth = doc.getTextWidth("ITINERARY DETAILS");
    doc.setDrawColor(153, 27, 27);  
    doc.setLineWidth(0.5);
    doc.line(14, currentY + 2, 14 + textWidth, currentY + 2);
    currentY += 8;

    // --- 4. TABLE & FILTERING LOGIC ---
    const tableBody: any[] = [];
    let supplierTotalNet = 0;

    processedDayPlans.forEach((day) => {
      let dayDateDisplay = "";
      if (activeFixedDeparture || simulationDate) {
        const startRef = activeFixedDeparture ? activeFixedDeparture.date : simulationDate;
        dayDateDisplay = getCalculatedDate(startRef, day.dayNumber - 1);
      }

      const dayItems: any[] = [];

      const addItem = (cat: string, name: string, config: string, status: string, cost: number) => {
        if (supplierFilter !== 'all' && supplierFilter !== cat) return; 
        supplierTotalNet += cost;
        
        dayItems.push([
          cat.toUpperCase(),
          name,     
          config,   
          status ? status.toUpperCase() : "INCLUDED" 
        ]);
      };

      if (day.stays) day.stays.forEach((s: any) => {
          getStayRows(s).forEach((row: any) => addItem("Stay", row.details, row.config, s.inclusionType, getCost(s.id)));
      });
      if (day.transports) day.transports.forEach((t: any) => {
          // 👉 FIX 5: Smart Transport Unit Logic
          const unit = ['flight', 'rail', 'ferry'].includes(t.mode?.toLowerCase()) ? 'Tkts' : 'Veh';
          addItem("Transport", t.vehicleType, `${t.vehicleCount || 1} ${unit} / ${t.paxCount || travelerCount} Pax`, t.inclusionType, getCost(t.id));
      });
      if (day.activities) day.activities.forEach((a: any) => {
          addItem("Activity", a.heading, `${a.paxCount || travelerCount} Pax`, a.inclusionType, getCost(a.id));
      });
      if (day.meals) day.meals.forEach((m: any) => {
          addItem("Meal", m.restaurantName, m.mealType, m.inclusionType, getCost(m.id));
      });

      if (dayItems.length > 0) {
        tableBody.push([{
            content: `DAY ${String(day.dayNumber).padStart(2, '0')}   ${day.city?.toUpperCase() || ""}${dayDateDisplay}`,
            colSpan: 4, 
            // 👉 FIX 4: Ensured halign is "left" for Day Headers
            styles: { fillColor: [254, 252, 232], textColor: [153, 27, 27], fontStyle: "bold", halign: "left" } 
        }]);
        tableBody.push(...dayItems);
      }
    });

    autoTable(doc, {
      startY: currentY,
      body: tableBody,
      theme: "plain",
      // 👉 FIX 1: Reduced cellPadding from 6 to 3, adjusted column widths
      styles: { fontSize: 9, cellPadding: 3, lineColor: [160, 160, 160], lineWidth: 0.1 }, 
      columnStyles: {
        // 👉 FIX 6: Left category centering, but bolded colored text as the professional icon alternative
        0: { cellWidth: 30, fontStyle: "bold", textColor: [50, 50, 50], halign: "center", valign: "middle" }, 
        1: { cellWidth: 'auto', textColor: [31, 41, 55], fontStyle: "bold", valign: "middle" }, 
        2: { cellWidth: 40, textColor: [75, 85, 99], valign: "middle" }, 
        3: { cellWidth: 25, halign: "center", valign: "middle", fontStyle: "bold", textColor: [69, 69, 69] } 
      },
    });


    // --- 5. FOOTER (Total Net Cost UI Upgrade & Page Footer) ---
    // @ts-ignore
    let finalY = doc.lastAutoTable.finalY + 15;
    
    if (!hideSupplierPrices) {
      // Check if we need to add a new page so the box doesn't get cut off
      if (finalY > 250) {
        doc.addPage();
        finalY = 20;
      }

      // 👉 FIX 1: Blue Card Design for Total Net Cost (Matching the 5th image)
      
      // Draw Dark Blue Outer Box (Rounded Rectangle)
      doc.setFillColor(37, 99, 235); // Tailwind blue-600
      doc.roundedRect(110, finalY, 86, 28, 3, 3, 'F'); 

      // Header Text inside the dark blue box
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255); // White text
      doc.text("TOTAL DUE TO SUPPLIER", 116, finalY + 7);

      // Draw Light Blue Inner Box for the actual price row
      doc.setFillColor(59, 130, 246); // Tailwind blue-500
      doc.roundedRect(115, finalY + 11, 76, 12, 2, 2, 'F');

      // Text inside the inner light blue box (Left side)
      doc.setFontSize(11);
      doc.text("Total Net Cost", 120, finalY + 19);
      
      // The Price Value inside the inner light blue box (Right aligned)
      doc.setFontSize(16);
      doc.text(cleanPrice(supplierTotalNet), 186, finalY + 19, { align: "right" });
    }

    // 👉 FIX: Add Supplier Terms & Billing cleanly using autoTable so it handles page breaks automatically
    let termsStartY = hideSupplierPrices ? finalY : finalY + 50; // Place it below the pricing box if it exists
    
    autoTable(doc, {
      startY: termsStartY,
      head: [["SUPPLIER TERMS & BILLING"]],
      body: [
        ["• Send all invoices to accounts@travdek.com with reference Ref ID: " + (itineraryData.tripId || "TBA") + "."],
        ["• Do not disclose any invoices or net rates to the guests under any circumstances."],
        ["• All cancellations or modifications must be acknowledged in writing. Standard contracted release periods apply."],
        ["• Transport providers must ensure drivers arrive 15 minutes before the scheduled pickup time and display a 'Travdek' or Client name placard."]
      ],
      theme: "grid",
      showHead: 'firstPage',
      pageBreak: 'avoid',
      headStyles: { fillColor: [243, 244, 246], textColor: [55, 65, 81], fontStyle: "bold", fontSize: 10, lineColor: [229, 231, 235], lineWidth: 0.5 },
      bodyStyles: { fillColor: [255, 255, 255], textColor: [75, 85, 99], fontSize: 8, lineColor: [229, 231, 235], lineWidth: 0.5, cellPadding: 3 }
    });

  

    // 👉 FIX 2: Added the "Generated by..." note at the very bottom center of the PDF
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120); // Subtle gray text
    
    // We place this exactly 10mm from the absolute bottom of the page, centered horizontally
    doc.text(
      "Generated by Travdek. Prices and availability are subject to change.", 
      pageWidth / 2, 
      pageHeight - 10, 
      { align: "center" }
    );

    // Save and close
    doc.save(`Supplier_${supplierFilter}_${itineraryData.tripId || "Manifest"}.pdf`);
    setIsSupplierModalOpen(false);
  };



  const handleSaveQuote = async () => {
    await saveItinerary("quick");
    alert("Quote saved!");
  };

  const getStayRows = (stay: any) => {
    if (!stay.roomOccupancy || stay.roomOccupancy.length === 0) {
      return [
        {
          details: stay.hotelName,
          config: `${stay.numRooms} Room(s) x ${travelerCount} Pax x ${stay.nights} Nights`,
          ppDivisor: travelerCount,
        },
      ];
    }
    const groups: Record<number, number> = {};
    stay.roomOccupancy.forEach(
      (pax: number) => (groups[pax] = (groups[pax] || 0) + 1),
    );
    return Object.entries(groups).map(([paxStr, roomCount]) => {
      const pax = parseInt(paxStr);
      return {
        details: `${stay.hotelName} (${getShareLabel(pax)} Share)`,
        config: `${roomCount} Room(s) x ${pax} Pax x ${stay.nights} Nights`,
        ppDivisor: pax,
      };
    });
  };

  const tripDuration = `${rawDayPlans.length} Days / ${Math.max(0, rawDayPlans.length - 1)} Nights`;
  
  // Calculate cities with nights from routing data
  const citiesWithNights = routes.map((r: any) => `${r.city} (${r.nights}N)`).join(" → ") || rawDayPlans.map((d: any) => d.city).filter(Boolean).join(" → ") || "TBA";
  
  // Extract start and end cities
  // const startCity = routes?.[0]?.city || rawDayPlans?.[0]?.city || "TBA";
  // const endCity = routes?.[routes.length - 1]?.city || rawDayPlans?.[rawDayPlans.length - 1]?.city || "TBA";

  // Extract start and end cities
  const startCity = (routes?.[0]?.cities && routes[0].cities.length > 0) ? routes[0].cities[0].name : (rawDayPlans?.[0]?.city || "TBA");
  
  const endCity = (routes?.[routes.length - 1]?.cities && routes[routes.length - 1].cities.length > 0) ? routes[routes.length - 1].cities[0].name : (rawDayPlans?.[rawDayPlans.length - 1]?.city || "TBA");

  if (loading || !user)
    return <div className="p-10 text-center">Loading...</div>;

  
  
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* 1. RE-EDIT BANNER */}
      {itineraryData.status === "reedit_requested" && (
        <div className="bg-orange-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <AlertOctagon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Re-Edit Requested</h3>
              <p className="text-sm opacity-90">
                Reason: "{itineraryData.reEditReason}"
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={revertToPending}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold border border-white/30 flex items-center gap-2"
            >
              <ThumbsDown size={16} /> Deny
            </button>
            <button
              onClick={allowReEdit}
              className="px-6 py-2 bg-white text-orange-700 hover:bg-gray-100 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2"
            >
              <ThumbsUp size={16} /> Allow (Unlock)
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-blue-600" size={24} /> Quotation Sheet
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 font-bold text-blue-600">
            {tripDuration}{" "}
            <span className="text-gray-400 font-normal">
              • {travelerCount} Travelers
            </span>
          </p>
        </div>

        {/* VALIDITY WIDGET - CENTERED */}
        <div className="hidden md:flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm mx-auto">
          {/* Label Section */}
          <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Calendar size={16} />
            </div>
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wide leading-tight">
              Trip
              <br />
              Validity
            </span>
          </div>

          {/* Date Inputs */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">
                Valid From
              </label>
              <input
                type="date"
                value={seasonStart}
                onChange={(e) => handleValidityChange("start", e.target.value)}
                className="text-xs font-bold text-gray-800 bg-transparent outline-none cursor-pointer hover:text-blue-600 transition-colors"
              />
            </div>

            <div className="text-gray-300 font-light">→</div>

            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">
                Valid Till
              </label>
              <input
                type="date"
                value={seasonEnd}
                onChange={(e) => handleValidityChange("end", e.target.value)}
                className="text-xs font-bold text-gray-800 bg-transparent outline-none cursor-pointer hover:text-blue-600 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard/itinerary/create-day")}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Edit
          </button>
          {user?.role === "admin" &&
            itineraryData.status === "pending_costing" && (
              <>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-2"
                >
                  <XCircle size={16} /> Request Changes
                </button>
                {/* <button onClick={approveCosting} className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 shadow-sm animate-pulse"><CheckCircle2 size={16} /> Approve & Release</button> */}
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 shadow-sm animate-pulse"
                >
                  <CheckCircle2 size={16} /> Approve & Release
                </button>
              </>
            )}
          {user?.role === "admin" && itineraryData.status === "approved" && (
            <button
              onClick={revertToPending}
              className="px-4 py-2 text-sm font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded-lg flex items-center gap-2 shadow-sm"
            >
              <Unlock size={16} /> Unlock to Fix
            </button>
          )}
        </div>
      </header>

     <main className="max-w-[1600px] mx-auto p-4 xl:p-6 flex flex-col xl:flex-row gap-4 xl:gap-6 items-start">
        {/* LEFT: LEDGER */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          <div className="flex items-center justify-between">
            <div className="bg-white border border-gray-300 rounded-xl p-1.5 flex gap-1 shadow-sm overflow-x-auto flex-1 mr-4">
              {MONTHS.map((month) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-bold transition-all ${selectedMonth === month ? "bg-blue-600 text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
                >
                  {month}
                </button>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 flex flex-col items-start min-w-[140px]">
              <span className="text-[9px] font-bold text-blue-600 uppercase flex items-center gap-1">
                <Clock size={10} /> Ref. Start Date
              </span>
              {/* <input type="date" value={simulationDate} onChange={(e) => setSimulationDate(e.target.value)} className="text-xs font-bold bg-transparent text-blue-900 outline-none w-full mt-0.5" /> */}
              <input
                type="date"
                value={simulationDate}
                // 👇 FIX: Use the new handler that saves to storage
                onChange={(e) => handleSimulationDateChange(e.target.value)}
                className="text-xs font-bold bg-transparent text-blue-900 outline-none w-full mt-0.5"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-400 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="costing-days" type="day">
                  {(provided) => (
                    <table
                      className="w-full text-left border-collapse"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <thead className="bg-gray-50 text-gray-500 border-b border-gray-400">
                        
<th className="py-3 px-2 min-[1700px]:px-4 text-xs font-bold uppercase w-[60px] min-[1700px]:w-[80px]">
  Type
</th>
<th className="py-3 px-2 min-[1700px]:px-4 text-xs font-bold uppercase">
  Item Details
</th>
<th className="py-3 px-2 min-[1700px]:px-4 text-xs font-bold uppercase w-[90px] min-[1700px]:w-[120px] text-blue-600">
  Supplier
</th>
<th className="py-3 px-2 min-[1700px]:px-4 text-xs font-bold uppercase w-[110px] min-[1700px]:w-[150px]">
  Config
</th>
<th className="py-3 px-2 min-[1700px]:px-4 text-xs font-bold uppercase text-right w-[110px] min-[1700px]:w-[140px]">
  Net Total
</th>
<th className="py-3 px-2 min-[1700px]:px-4 text-xs font-bold uppercase text-right w-[80px] min-[1700px]:w-[100px]">
  PP Cost
</th>
                       

                      </thead>

                      {processedDayPlans.map((day, index) => (
                        <Draggable
                          key={`day-${day.dayNumber}`}
                          draggableId={`day-${day.dayNumber}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <tbody
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`text-sm transition-all duration-200 ${snapshot.isDragging ? "bg-blue-50 shadow-2xl relative z-50 ring-2 ring-blue-500" : "bg-white"}`}
                            >
                              <tr className="bg-gray-100 border-b border-gray-400">
                                <td colSpan={6} className="py-2 px-4">
                                  <div className="flex items-center gap-2 text-gray-700 font-bold">
                                    {/* 🌟 THE DRAG HANDLE 🌟 */}
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-blue-600 mr-1 p-1 hover:bg-blue-100 rounded transition-colors"
                                      title="Drag to reorder day"
                                    >
                                      <GripVertical size={16} />
                                    </div>

                                    <Calendar
                                      size={14}
                                      className="text-blue-500"
                                    />
                                    <span>
                                      DAY {day.dayNumber} - {day.city}
                                    </span>
                                    <span className="text-gray-400 font-medium text-xs ml-2">
                                      {getCalculatedDate(
                                        simulationDate,
                                        day.dayNumber - 1,
                                      )}
                                    </span>
                                  </div>
                                </td>
                              </tr>

                              {/* The Rows Inside the Day */}
                              {(day.stays || []).map((s: any, i: number) => {
                                const rows = getStayRows(s);
                                return rows.map((row: any, idx: number) => (
                                  <LedgerRow
                                    key={`s-${i}-${idx}`}
                                    itemId={s.id}
                                    typeLabel="Stay"
                                    typeColor={
                                      s.isGhost
                                        ? "text-gray-400"
                                        : "text-gray-900"
                                    }
                                    details={row.details}
                                    inclusionType={s.inclusionType}
                                    config={
                                      s.isGhost ? "Continuing" : row.config
                                    }
                                    manualNetTotal={getCost(s.id)}
                                    onCostChange={handleManualCostChange}
                                    divisor={row.ppDivisor}
                                    currency={currency}
                                    formatPrice={formatPrice}
                                    isGhost={s.isGhost}
                                    vendorName={getVendorName(
                                      s.linkedSupplierId,
                                    )}
                                    rowSpan={idx === 0 ? rows.length : 1}
                                    isSubRow={idx > 0}
                                    isOptionalChecked={includedOptionals.includes(
                                      s.id.toString(),
                                    )}
                                    onToggleOptional={toggleOptional}
                                  />
                                ));
                              })}
                              {(day.transports || []).map(
                                (t: any, i: number) => {
                                  const divisor = t.paxCount || travelerCount;
                                  return (
                                    <LedgerRow
                                      key={`t-${i}`}
                                      itemId={t.id}
                                      typeLabel="Transport"
                                      typeColor="text-gray-900"
                                      details={t.vehicleType}
                                      inclusionType={t.inclusionType}
                                      config={`${t.vehicleCount} Veh / ${divisor} Pax`}
                                      manualNetTotal={getCost(t.id)}
                                      onCostChange={handleManualCostChange}
                                      divisor={divisor}
                                      currency={currency}
                                      formatPrice={formatPrice}
                                      vendorName={getVendorName(
                                        t.linkedSupplierId,
                                      )}
                                      isOptionalChecked={includedOptionals.includes(
                                        t.id.toString(),
                                      )}
                                      onToggleOptional={toggleOptional}
                                    />
                                  );
                                },
                              )}
                              {(day.activities || []).map(
                                (a: any, i: number) => {
                                  const pax = a.paxCount || travelerCount;
                                  return (
                                    <LedgerRow
                                      key={`a-${i}`}
                                      itemId={a.id}
                                      typeLabel="Activity"
                                      typeColor="text-gray-900"
                                      details={a.heading}
                                      inclusionType={a.inclusionType}
                                      config={`${pax} Pax`}
                                      manualNetTotal={getCost(a.id)}
                                      onCostChange={handleManualCostChange}
                                      divisor={pax}
                                      currency={currency}
                                      formatPrice={formatPrice}
                                      vendorName={getVendorName(
                                        a.linkedSupplierId,
                                      )}
                                      isOptionalChecked={includedOptionals.includes(
                                        a.id.toString(),
                                      )}
                                      onToggleOptional={toggleOptional}
                                    />
                                  );
                                },
                              )}
                              {(day.meals || []).map((m: any, i: number) => {
                                return (
                                  <LedgerRow
                                    key={`m-${i}`}
                                    itemId={m.id}
                                    typeLabel="Meal"
                                    typeColor="text-gray-900"
                                    details={m.restaurantName}
                                    inclusionType={m.inclusionType}
                                    config={m.mealType}
                                    manualNetTotal={getCost(m.id)}
                                    onCostChange={handleManualCostChange}
                                    divisor={travelerCount}
                                    currency={currency}
                                    formatPrice={formatPrice}
                                    vendorName={getVendorName(
                                      m.linkedSupplierId,
                                    )}
                                    isOptionalChecked={includedOptionals.includes(
                                      m.id.toString(),
                                    )}
                                    onToggleOptional={toggleOptional}
                                  />
                                );
                              })}
                            </tbody>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </table>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>


          {/* FIXED DEPARTURES TABLE (SERIES INVENTORY MATRIX) */}

          {/* ========================================================= */}
          {/* TABLE 2: MONTH SERIES (PARENT)                            */}
          {/* ========================================================= */}
          <div className="bg-white border border-gray-300 rounded-xl shadow-md overflow-hidden p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <Calendar size={20} className="text-blue-600" /> Dates & Pricing
              </h3>
              <button
                onClick={addMonthRow}
                className="text-sm flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm"
              >
                <Plus size={16} /> Add Month
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b border-t border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-[60px] text-center">Select</th>
                    <th className="py-3 px-4 w-[200px]">Base Month</th>
                    <th className="py-3 px-4 w-[120px] text-center border-l border-slate-200">
                      DBL / TWIN
                    </th>
                    <th className="py-3 px-4 w-[120px] text-center border-l border-slate-200">
                      SINGLE
                    </th>
                    <th className="py-3 px-4 w-[120px] text-center border-l border-slate-200">
                      TRIPLE
                    </th>
                    <th className="py-3 px-4 w-[120px] text-center border-l border-slate-200">
                      QUAD
                    </th>
                    <th className="py-3 px-4 w-[120px] text-center border-l border-slate-200">
                      Dates
                    </th>
                    <th className="py-3 px-4 w-[60px] text-center">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {fixedDepartures.map((monthData: any) => (
                    <tr
                      key={monthData.id}
                      className={`hover:bg-slate-50 transition-colors ${activeMonthId === monthData.id ? "bg-blue-50/40" : ""}`}
                    >
                      {/* 1. RADIO BUTTON FOR CALCULATOR */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleDepartureSelection(monthData.id)}
                          className="group focus:outline-none"
                        >
                          <div
                            className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-200 ${selectedDepartureId === monthData.id ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300 group-hover:border-gray-400"}`}
                          >
                            {selectedDepartureId === monthData.id && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                        </button>
                      </td>

                      {/* 2. MONTH INPUT */}
                      <td className="py-3 px-4">
                        <input
                          type="month"
                          value={monthData.month || ""}
                          onChange={(e) =>
                            updateMonthRow(
                              monthData.id,
                              "month",
                              e.target.value,
                            )
                          }
                          className="border border-slate-300 rounded px-2 py-1.5 text-slate-700 font-bold text-sm uppercase bg-white w-full outline-none focus:border-blue-500"
                        />
                      </td>

                      {/* 3. PRICES (WITH SMART DISABLE LOGIC) */}
                      <td className="py-3 px-2 border-l border-slate-100">
                        <div
                          className={`flex items-center gap-1 border rounded px-2 py-1.5 transition-colors ${!isDblEnabled ? "bg-gray-100 border-gray-200" : "bg-white border-slate-300 focus-within:border-blue-500"}`}
                        >
                          <span
                            className={`text-[10px] font-bold ${!isDblEnabled ? "text-gray-300" : "text-slate-400"}`}
                          >
                            {currency}
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={monthData.priceDBL || ""}
                            onChange={(e) =>
                              updateMonthRow(
                                monthData.id,
                                "priceDBL",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            disabled={!isDblEnabled}
                            className={`w-full font-mono font-bold outline-none text-right ${!isDblEnabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "text-slate-900 bg-white"}`}
                            placeholder={!isDblEnabled ? "-" : "0"}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-2 border-l border-slate-100">
                        <div
                          className={`flex items-center gap-1 border rounded px-2 py-1.5 transition-colors ${!isSglEnabled ? "bg-gray-100 border-gray-200" : "bg-white border-slate-300 focus-within:border-blue-500"}`}
                        >
                          <span
                            className={`text-[10px] font-bold ${!isSglEnabled ? "text-gray-300" : "text-slate-400"}`}
                          >
                            {currency}
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={monthData.priceSGL || ""}
                            onChange={(e) =>
                              updateMonthRow(
                                monthData.id,
                                "priceSGL",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            disabled={!isSglEnabled}
                            className={`w-full font-mono font-bold outline-none text-right ${!isSglEnabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "text-slate-900 bg-white"}`}
                            placeholder={!isSglEnabled ? "-" : "0"}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-2 border-l border-slate-100">
                        <div
                          className={`flex items-center gap-1 border rounded px-2 py-1.5 transition-colors ${!isTplEnabled ? "bg-gray-100 border-gray-200" : "bg-white border-slate-300 focus-within:border-blue-500"}`}
                        >
                          <span
                            className={`text-[10px] font-bold ${!isTplEnabled ? "text-gray-300" : "text-slate-400"}`}
                          >
                            {currency}
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={monthData.priceTPL || ""}
                            onChange={(e) =>
                              updateMonthRow(
                                monthData.id,
                                "priceTPL",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            disabled={!isTplEnabled}
                            className={`w-full font-mono font-bold outline-none text-right ${!isTplEnabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "text-slate-900 bg-white"}`}
                            placeholder={!isTplEnabled ? "-" : "0"}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-2 border-l border-slate-100">
                        <div
                          className={`flex items-center gap-1 border rounded px-2 py-1.5 transition-colors ${!isQuadEnabled ? "bg-gray-100 border-gray-200" : "bg-white border-slate-300 focus-within:border-blue-500"}`}
                        >
                          <span
                            className={`text-[10px] font-bold ${!isQuadEnabled ? "text-gray-300" : "text-slate-400"}`}
                          >
                            {currency}
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={monthData.priceQUAD || ""}
                            onChange={(e) =>
                              updateMonthRow(
                                monthData.id,
                                "priceQUAD",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            disabled={!isQuadEnabled}
                            className={`w-full font-mono font-bold outline-none text-right ${!isQuadEnabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "text-slate-900 bg-white"}`}
                            placeholder={!isQuadEnabled ? "-" : "0"}
                          />
                        </div>
                      </td>

                      {/* 4. OPEN TABLE 3 BUTTON */}
                      <td className="py-3 px-4 text-center border-l border-slate-100">
                        <button
                          onClick={() =>
                            setActiveMonthId(
                              activeMonthId === monthData.id
                                ? null
                                : monthData.id,
                            )
                          }
                          className={`text-xs font-bold px-3 py-1.5 rounded-md border ${activeMonthId === monthData.id ? "bg-blue-600 text-white border-blue-700" : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"}`}
                        >
                          {activeMonthId === monthData.id ? "Close" : "Manage"}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => removeMonthRow(monthData.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {fixedDepartures.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-slate-400 text-sm italic"
                      >
                        No inventory created. Click "Add Month" to start.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TABLE 3: SPECIFIC DATES (CHILD) - Renders BELOW Table 2   */}
          {/* ========================================================= */}
          {activeMonthId && (
            <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg overflow-hidden p-6 mt-6 relative animate-in fade-in slide-in-from-top-4">
              {/* Visual Connector to Table 2 */}
              <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-blue-200"></div>

              {(() => {
                const activeMonthData = fixedDepartures.find(
                  (m) => m.id === activeMonthId,
                );
                if (!activeMonthData) return null;

                return (
                  <>
                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                      <h4 className="font-bold text-blue-900 flex items-center gap-2">
                        <Calendar size={20} className="text-blue-600" />
                        Specific Departures Dates for:{" "}
                        <span className="uppercase bg-blue-100 px-2 py-0.5 rounded text-blue-700">
                          {activeMonthData.month || "Selected Month"}
                        </span>
                      </h4>
                      <button
                        onClick={() => addSpecificDate(activeMonthData.id)}
                        className="text-xs flex items-center gap-1 bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-md font-bold hover:bg-blue-50 transition shadow-sm"
                      >
                        <Plus size={14} /> Add Date
                      </button>
                    </div>

                    {activeMonthData.departures &&
                    activeMonthData.departures.length > 0 ? (
                      <table className="w-full text-left text-xs bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[9px] border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-2 w-[50px] text-center">Select</th>
                            {/* 👇 Separated Headers with balanced widths */}
                            <th className="py-2 px-2 w-[260px] text-center">Start & End Dates</th>
                            
                            <th className="py-2 px-2 w-[110px] text-center">Status</th>
                            <th className="py-2 px-2 text-center border-l border-slate-200">DBL Override</th>
                            <th className="py-2 px-2 text-center border-l border-slate-200">SGL Override</th>
                            <th className="py-2 px-2 text-center border-l border-slate-200">TPL Override</th>
                            <th className="py-2 px-2 text-center border-l border-slate-200">QUAD Override</th>
                            <th className="py-2 px-2 w-[40px] text-center border-l border-slate-200">Del</th>
                          </tr>
                     
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeMonthData.departures.map((dateRow: any) => (
                            <tr
                              key={dateRow.id}
                              className={`hover:bg-blue-50/30 transition-colors ${selectedDepartureId === dateRow.id ? "bg-blue-50/60" : ""}`}
                            >
                              {/* 1. RADIO BUTTON FOR SPECIFIC DATE */}
                              <td className="py-2 px-3 text-center">
                                <button
                                  onClick={() =>
                                    toggleDepartureSelection(dateRow.id)
                                  }
                                  className="group focus:outline-none"
                                >
                                  <div
                                    className={`flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all duration-200 ${selectedDepartureId === dateRow.id ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300 group-hover:border-gray-400"}`}
                                  >
                                    {selectedDepartureId === dateRow.id && (
                                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                    )}
                                  </div>
                                </button>
                              </td>

                          
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="date"
                                    value={dateRow.date || ""}
                                    onChange={(e) =>
                                      updateSpecificDate(
                                        activeMonthData.id,
                                        dateRow.id,
                                        "date",
                                        e.target.value,
                                      )
                                    }
                                    title="Start Date"
                                    className="w-full border border-slate-300 rounded px-2 py-1 text-slate-700 font-bold bg-white outline-none focus:border-blue-500"
                                  />
                                  <span className="text-[9px] font-black text-slate-400 uppercase">To</span>
                                  <input
                                    type="date"
                                    value={dateRow.endDate || ""}
                                    onChange={(e) =>
                                      updateSpecificDate(
                                        activeMonthData.id,
                                        dateRow.id,
                                        "endDate",
                                        e.target.value,
                                      )
                                    }
                                    title="End Date"
                                    className="w-full border border-slate-300 rounded px-2 py-1 text-slate-700 font-bold bg-white outline-none focus:border-blue-500"
                                  />
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                <select
                                  value={dateRow.status || "Available"}
                                  onChange={(e) =>
                                    updateSpecificDate(
                                      activeMonthData.id,
                                      dateRow.id,
                                      "status",
                                      e.target.value,
                                    )
                                  }
                                  className={`w-full border rounded px-2 py-1 font-bold outline-none ${dateRow.status === "Sold Out" ? "bg-red-50 text-red-700 border-red-200" : dateRow.status === "Limited Seat" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-green-50 text-green-700 border-green-200"}`}
                                >
                                  <option value="Available">Available</option>
                                  <option value="Limited Seat">
                                    Limited Seat
                                  </option>
                                  <option value="Sold Out">Sold Out</option>
                                </select>
                              </td>

                              {/* OVERRIDES (WITH SMART DISABLE LOGIC) */}
                              <td className="py-2 px-2 border-l border-slate-100">
                                <input
                                  type="number"
                                  min="0"
                                  placeholder={
                                    !isDblEnabled
                                      ? "-"
                                      : activeMonthData.priceDBL
                                        ? `${currency} ${activeMonthData.priceDBL}`
                                        : "Auto"
                                  }
                                  value={dateRow.overridePriceDBL || ""}
                                  onChange={(e) =>
                                    updateSpecificDate(
                                      activeMonthData.id,
                                      dateRow.id,
                                      "overridePriceDBL",
                                      e.target.value,
                                    )
                                  }
                                  disabled={!isDblEnabled}
                                  className={`w-full border rounded px-1.5 py-1 font-mono text-right outline-none transition-colors ${!isDblEnabled ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed" : "border-dashed border-slate-300 text-slate-800 focus:border-blue-500 focus:bg-white"}`}
                                />
                              </td>
                              <td className="py-2 px-2 border-l border-slate-100">
                                <input
                                  type="number"
                                  min="0"
                                  placeholder={
                                    !isSglEnabled
                                      ? "-"
                                      : activeMonthData.priceSGL
                                        ? `${currency} ${activeMonthData.priceSGL}`
                                        : "Auto"
                                  }
                                  value={dateRow.overridePriceSGL || ""}
                                  onChange={(e) =>
                                    updateSpecificDate(
                                      activeMonthData.id,
                                      dateRow.id,
                                      "overridePriceSGL",
                                      e.target.value,
                                    )
                                  }
                                  disabled={!isSglEnabled}
                                  className={`w-full border rounded px-1.5 py-1 font-mono text-right outline-none transition-colors ${!isSglEnabled ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed" : "border-dashed border-slate-300 text-slate-800 focus:border-blue-500 focus:bg-white"}`}
                                />
                              </td>
                              <td className="py-2 px-2 border-l border-slate-100">
                                <input
                                  type="number"
                                  min="0"
                                  placeholder={
                                    !isTplEnabled
                                      ? "-"
                                      : activeMonthData.priceTPL
                                        ? `${currency} ${activeMonthData.priceTPL}`
                                        : "Auto"
                                  }
                                  value={dateRow.overridePriceTPL || ""}
                                  onChange={(e) =>
                                    updateSpecificDate(
                                      activeMonthData.id,
                                      dateRow.id,
                                      "overridePriceTPL",
                                      e.target.value,
                                    )
                                  }
                                  disabled={!isTplEnabled}
                                  className={`w-full border rounded px-1.5 py-1 font-mono text-right outline-none transition-colors ${!isTplEnabled ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed" : "border-dashed border-slate-300 text-slate-800 focus:border-blue-500 focus:bg-white"}`}
                                />
                              </td>
                              <td className="py-2 px-2 border-l border-slate-100">
                                <input
                                  type="number"
                                  min="0"
                                  placeholder={
                                    !isQuadEnabled
                                      ? "-"
                                      : activeMonthData.priceQUAD
                                        ? `${currency} ${activeMonthData.priceQUAD}`
                                        : "Auto"
                                  }
                                  value={dateRow.overridePriceQUAD || ""}
                                  onChange={(e) =>
                                    updateSpecificDate(
                                      activeMonthData.id,
                                      dateRow.id,
                                      "overridePriceQUAD",
                                      e.target.value,
                                    )
                                  }
                                  disabled={!isQuadEnabled}
                                  className={`w-full border rounded px-1.5 py-1 font-mono text-right outline-none transition-colors ${!isQuadEnabled ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed" : "border-dashed border-slate-300 text-slate-800 focus:border-blue-500 focus:bg-white"}`}
                                />
                              </td>
                              <td className="py-2 px-3 text-center border-l border-slate-100">
                                <button
                                  onClick={() =>
                                    removeSpecificDate(
                                      activeMonthData.id,
                                      dateRow.id,
                                    )
                                  }
                                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                  <XCircle size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center text-slate-500 text-sm italic py-8 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                        No specific dates scheduled. Click "Add Date" to create
                        a departure.
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* RIGHT: CALCULATOR */}
        <div className="w-full xl:w-[clamp(280px,24vw,400px)] shrink-0 sticky top-24 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-300 flex items-center justify-between">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Currency
            </div>
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold"
            >
              {rates &&
                Object.keys(rates).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-700 uppercase flex items-center gap-2">
                <Briefcase size={14} /> {selectedMonth} Cost Breakdown
              </h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span>Total Net ({selectedMonth})</span>
                <span className="text-blue-600">
                  {formatPrice(netInSelected, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* CALCULATOR */}
          <div
            className={`bg-white rounded-xl shadow-lg border ${activeFixedDeparture ? "border-blue-400 ring-1 ring-blue-400" : "border-gray-300"} overflow-hidden transition-all duration-300`}
          >
    

            <div
              className={`bg-gray-900 text-white px-5 py-4 flex items-center justify-between`}
            >
              <div className="flex items-center gap-2">
                <Calculator size={18} className="text-green-400" />
                <span className="font-bold tracking-wide text-sm">
                  {activeFixedDeparture
                    ? "Fixed Package Price"
                    : `Quote Calculator (${selectedMonth})`}
                </span>
              </div>

              {/* 🌟 NEW: THE MAGIC SYNC BUTTON 🌟 */}
              {!activeFixedDeparture && user?.role === "admin" && (
                <button
                  onClick={syncSmartRates}
                  disabled={isSyncingRates}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-md active:scale-95"
                  title="Auto-fill Net Costs from Rate Manager"
                >
                  {isSyncingRates ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} className="text-yellow-300" />
                  )}
                  Sync Smart Rates
                </button>
              )}
            </div>

            <div className="p-5 space-y-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">
                  Total Net Cost
                </span>
                <span className="font-mono font-bold text-gray-800 text-lg">
                  {formatPrice(netInSelected, currency)}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Margin / Markup %
                    </label>
                    {activeFixedDeparture && (
                      <span className="text-[10px] text-blue-600 font-bold italic"></span>
                    )}
                  </div>

                  {/* NEW: MARGIN MATRIX */}
                  {!activeFixedDeparture ? (
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 20, 35, 50].map((pct) => (
                        <button
                          key={pct}
                          // 👇 FIX: Use the handler, not setMarkupPercent
                          onClick={() => handleMarkupChange(pct)}
                          className={`py-2 rounded-lg text-xs font-bold transition-all border ${markupPercent === pct ? "bg-green-100 border-green-500 text-green-700" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}
                        >
                          {pct === 0 ? "Net" : `+${pct}%`}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 bg-gray-100 rounded text-center text-xs font-bold text-gray-500">
                      Implied Margin: {displayMarkupPercent.toFixed(1)}%
                    </div>
                  )}

                  {/* Manual Override Input */}
                  {!activeFixedDeparture && (
                    <div className="relative mt-2">
                      <input
                        type="number"
                        value={markupPercent}
                        // 👇 FIX: Use the handler here too
                        onChange={(e) =>
                          handleMarkupChange(parseFloat(e.target.value) || 0)
                        }
                        className={`w-full p-2 border rounded-lg font-bold text-sm bg-white border-gray-300 text-gray-800`}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100"></div>

              {!activeFixedDeparture && (
                <div className={`space-y-3`}>
                  <div className="flex items-center gap-2 text-purple-600">
                    <Sparkles
                      size={14}
                      fill="currentColor"
                      className="text-purple-200"
                    />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      Pricing Strategy
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-lg">
                    {["none", "5", "10", "100"].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => handleRoundingChange(mode)}
                        className={`text-[10px] font-bold py-1.5 rounded-md ${roundingMode === mode ? "bg-white text-purple-700 shadow-sm" : "text-gray-400"}`}
                      >
                        {mode === "none" ? "Exact" : `+${mode}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-xl shadow-inner text-white space-y-4 relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <div className="text-blue-200 font-bold text-xs uppercase mb-1">
                      Selling Price / Per Person
                    </div>
                    <div className="font-mono font-black text-3xl tracking-tight">
                      {formatPrice(finalPerPerson, currency)}
                    </div>
                  </div>
                  <User size={24} className="text-blue-400/50" />
                </div>
                <div className="pt-3 border-t border-blue-500/30 flex justify-between items-center relative z-10">
                  <span className="text-blue-200 font-medium text-xs">
                    Total Group Value ({travelerCount} Pax)
                  </span>
                  <span className="font-mono font-bold text-lg text-white">
                    {formatPrice(finalGrandTotal, currency)}
                  </span>
                </div>

                {/* 🌟 NEW: OPTIONAL ADD-ONS DISPLAY BOX 🌟 */}
                {finalOptionalGrandTotal > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl shadow-sm border border-orange-200 mt-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-orange-800 font-bold text-xs uppercase tracking-wider">
                        Optional Add-ons
                      </div>
                      <div className="text-[10px] bg-orange-200 text-orange-800 px-2 py-0.5 rounded font-bold">
                        Extra
                      </div>
                    </div>
                    <div className="flex justify-between items-end border-b border-orange-200/50 pb-2 mb-2">
                      <span className="text-orange-600 font-medium text-xs">
                        Per Person
                      </span>
                      <span className="font-mono font-bold text-lg text-orange-700">
                        {formatPrice(finalOptionalPerPerson, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-600 font-medium text-[10px] uppercase">
                        Group Total ({travelerCount} Pax)
                      </span>
                      <span className="font-mono font-bold text-sm text-orange-800">
                        {formatPrice(finalOptionalGrandTotal, currency)}
                      </span>
                    </div>
                  </div>
                )}
              </div>


              {/* 🌟 NEW: ASSIGN TRAVEL ADVISOR DROPDOWN (Admin Only) 🌟 */}
              {user?.role === "admin" && (
                <div className="pt-4 border-t border-gray-100 animate-in fade-in">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                    <User size={14} className="text-blue-500" />
                    Assign Travel Advisor (For Commission)
                  </label>
                  <select
                    value={assignedAgentId || ""}
                    onChange={(e) => handleAssignAgent(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm cursor-pointer"
                  >
                    <option value="">-- No Advisor (Direct Sale / 0% Comm.) --</option>
                    {agents.map(agent => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name} ({agent.agencyName || 'Independent'}) - {agent.commissionRate}% Split
                      </option>
                    ))}
                  </select>
                </div>
              )}

            
            

              <div className="bg-gray-50 px-5 py-4 border-t border-gray-200 grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadExcel}
                  className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded-lg text-xs shadow-sm"
                >
                  <Download size={14} /> Excel
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded-lg text-xs shadow-sm"
                >
                  <Printer size={14} /> Client PDF
                </button>
                
                {/* 🌟 NEW SUPPLIER BUTTON 🌟 */}
                <button
                  onClick={() => setIsSupplierModalOpen(true)}
                  className="col-span-2 flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 font-bold py-2 rounded-lg text-xs shadow-sm transition-colors"
                >
                  <FileText size={14} /> Export Supplier Manifest
                </button>

                <button
                  onClick={handleSaveQuote}
                  className="col-span-2 flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3 rounded-lg text-sm shadow-md"
                >
                  <Save size={16} /> Save Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>


      {/* 👇 NEW: VALIDITY FOOTER & ROLE-BASED NEXT BUTTON (ADMIN VIEW) */}
      <div className="max-w-[1600px] mx-auto px-6 pb-12 pt-4 flex flex-col gap-6">
        {/* Top: Validity Footer */}
        <div className="flex items-start md:items-center gap-3 bg-blue-50/50 border border-blue-100 rounded-xl p-4 shadow-sm w-fit">
          <Info className="text-blue-500 mt-0.5 md:mt-0 shrink-0" size={18} />
          <p className="text-slate-600 text-sm font-medium tracking-wide">
            <span className="font-bold text-blue-900 mr-1">Please Note:</span>
            {(() => {
              let validDate = "TBA";
              if (seasonEnd) {
                const d = new Date(seasonEnd);
                if (!isNaN(d.getTime())) {
                  const m = d.toLocaleDateString("en-US", { month: "short" });
                  const dy = d.toLocaleDateString("en-US", { day: "numeric" });
                  const yr = d.toLocaleDateString("en-US", { year: "2-digit" });
                  validDate = `${m} ${dy} '${yr}`;
                }
              }
              return `Prices are per person, are valid through ${validDate} and may change without notice.`;
            })()}
          </p>
        </div>

      
  
        <div className="flex items-center justify-between w-full gap-4 relative px-1 mt-8">
          
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

          {/* 🌟 2. SHINE ANIMATION STYLES */}
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

          {/* Left Side: BACK BUTTON (Light-Mode Gooey Effect) */}
          <button
            onClick={() => router.push("/dashboard/itinerary/review")}
            className="group relative z-10 inline-flex items-center px-5 py-2 text-gray-600 font-bold bg-white border border-gray-300 rounded-lg overflow-hidden transition-colors duration-700 ease-in-out hover:text-white hover:border-gray-700 shadow-sm"
          >
            {/* Button Content */}
            <span className="relative z-20 flex items-center gap-2">
              <ArrowLeft size={18} /> Back to Review
            </span>

            {/* Gooey Blobs Container */}
            <div
              className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-lg"
              style={{ filter: 'url(#goo)' }}
            >
              <div className="absolute top-0 -left-[5%] w-[34%] h-full bg-gray-700 rounded-full scale-[1.4] translate-y-[125%] transition-transform duration-700 ease-in-out group-hover:translate-y-0" />
              <div className="absolute top-0 left-[30%] w-[34%] h-full bg-gray-700 rounded-full scale-[1.4] translate-y-[125%] transition-transform duration-700 ease-in-out delay-[60ms] group-hover:translate-y-0" />
              <div className="absolute top-0 left-[66%] w-[34%] h-full bg-gray-700 rounded-full scale-[1.4] translate-y-[125%] transition-transform duration-700 ease-in-out delay-[25ms] group-hover:translate-y-0" />
            </div>
          </button>

          {/* Right Side: Warning & Preview Button Wrapper */}
          <div className="flex items-center gap-4">
            
            {/* Warning if the admin tries to go to preview without approving the agent's request first */}
            {itineraryData.status === "pending_costing" && (
              <div className="flex items-center text-orange-600 font-bold text-sm bg-orange-50 px-4 py-2 rounded-lg border border-orange-200 shadow-sm">
                <AlertTriangle size={16} className="mr-2" /> Approve Costing to unlock for Employees/Agents
              </div>
            )}

            {/* "Go to Preview" Button (Animated Shine) */}
            <button
              onClick={() => router.push("/dashboard/itinerary/preview")}
              className="group relative overflow-hidden flex items-center justify-center gap-2 px-8 py-2 bg-blue-600 text-white font-bold rounded-full border-[3px] border-white/30 shadow-[0_10px_20px_rgba(0,0,0,0.15)] outline-none cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:border-white/60"
            >
              <div className="shine-effect absolute top-0 -left-[100px] w-[100px] h-full opacity-60 pointer-events-none bg-gradient-to-r from-transparent via-white/80 to-transparent z-0" />
              <span className="relative z-10">Go to Preview</span>
              <ArrowRight size={18} className="relative z-10 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
            </button>
            
          </div>

        </div>

      </div>

      {/* 🌟 SUPPLIER PDF EXPORT MODAL 🌟 */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-extrabold text-gray-900">Supplier Export</h2>
              <button onClick={() => setIsSupplierModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Filter Services</label>
                <select 
                  value={supplierFilter}
                  onChange={(e) => setSupplierFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 font-bold text-gray-700"
                >
                  <option value="all">All Services</option>
                  <option value="Stay">Stay / Hotels Only</option>
                  <option value="Transport">Transport Only</option>
                  <option value="Activity">Activities Only</option>
                  <option value="Meal">Meals Only</option>
                </select>
              </div>

              <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 p-3 rounded-lg cursor-pointer" onClick={() => setHideSupplierPrices(!hideSupplierPrices)}>
                <input 
                  type="checkbox" 
                  checked={hideSupplierPrices}
                  onChange={(e) => setHideSupplierPrices(e.target.checked)}
                  className="w-4 h-4 accent-orange-600"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">Hide Prices (For RFQs)</span>
                  <span className="text-[10px] text-gray-500 font-medium">Removes the total net cost at the bottom</span>
                </div>
              </div>

              <button 
                onClick={handleDownloadSupplierPDF}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm shadow-md flex justify-center items-center gap-2"
              >
                <Download size={16}/> Generate PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
