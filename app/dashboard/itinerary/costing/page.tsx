
// "use client";

// import React, { useState, useEffect, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Calculator, Download, FileText, 
//   ArrowRight, ArrowLeft,
//   Calendar, Sparkles, User , Printer , Save , 
// } from 'lucide-react';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { useItinerary } from '@/app/context/ItineraryContext'; 
// import { useCurrency } from '@/hooks/useCurrency';
// import { DayPlan } from '../create-day/constants/daywiseConstants';

// // --- HELPERS ---
// const isItemIncluded = (status?: string) => !status || status.toLowerCase() === 'included';
// const safeNum = (val: any) => {
//   const num = parseFloat(val);
//   return isNaN(num) ? 0 : num;
// };

// // Helper to determine share type label
// const getShareLabel = (pax: number) => {
//   if (pax === 1) return "Single";
//   if (pax === 2) return "Twin/Double";
//   if (pax === 3) return "Triple";
//   if (pax === 4) return "Quad";
//   return `${pax}-Pax`;
// };

// export default function CostingPage() {
//   const router = useRouter();
//   const { itineraryData, updateItineraryData, saveItinerary } = useItinerary();
//   const rawDayPlans = (itineraryData?.dayWiseActivities || []) as DayPlan[];
//   const travelerCount = safeNum(itineraryData?.numberOfTravelers) || 1;
//   const { currency, setCurrency, convert, formatPrice, rates, loading } = useCurrency('USD');

//   // --- STATE ---
//   const [markupPercent, setMarkupPercent] = useState<number>(20);
//   const [roundingMode, setRoundingMode] = useState<string>('none'); 

//   useEffect(() => {
//     if (itineraryData.selectedCurrency && itineraryData.selectedCurrency !== currency) {
//         setCurrency(itineraryData.selectedCurrency);
//     }
//   }, [itineraryData.selectedCurrency]);

//   const handleCurrencyChange = (newCurrency: string) => {
//     setCurrency(newCurrency);
//     updateItineraryData({ selectedCurrency: newCurrency });
//   };

//   useEffect(() => {
//     if (itineraryData.markupPercentage !== undefined) setMarkupPercent(itineraryData.markupPercentage);
//     if (itineraryData.roundingMode) setRoundingMode(itineraryData.roundingMode);
//   }, [itineraryData.markupPercentage, itineraryData.roundingMode]);

//   const handleMarkupChange = (val: number) => {
//     setMarkupPercent(val);
//     updateItineraryData({ markupPercentage: val });
//   };

//   const handleRoundingChange = (mode: string) => {
//     setRoundingMode(mode);
//     updateItineraryData({ roundingMode: mode } as any);
//   };

//   // --- 5. COST CALCULATION ENGINE ---
//   const calculatedNetTotal = useMemo(() => {
//     let total = 0;
//     rawDayPlans.forEach(day => {
//         if(day.stays) {
//             day.stays.forEach(s => {
//                 if (isItemIncluded(s.inclusionType)) {
//                     total += safeNum(s.costPerNight) * safeNum(s.numRooms) * safeNum(s.nights);
//                 }
//             });
//         }
//         if(day.transports) {
//             day.transports.forEach(t => {
//                 if (isItemIncluded(t.inclusionType)) {
//                     total += safeNum(t.price) * safeNum(t.vehicleCount);
//                 }
//             });
//         }
//         if(day.activities) {
//             day.activities.forEach(a => {
//                 if (isItemIncluded(a.inclusionType)) {
//                     const guideCost = a.guideType === 'guided' ? safeNum(a.guideFee) : 0;
//                     const itemCost = (safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * travelerCount;
//                     total += itemCost + guideCost;
//                 }
//             });
//         }
//         if(day.meals) {
//             day.meals.forEach(m => {
//                 if (isItemIncluded(m.inclusionType)) {
//                     total += safeNum(m.adultCost) * travelerCount;
//                 }
//             });
//         }
//     });
//     return total;
//   }, [rawDayPlans, travelerCount]);

//   // --- FINAL TOTALS ---
//   const netInSelected = convert(calculatedNetTotal, currency);
//   const markupAmount = netInSelected * (markupPercent / 100);
//   const exactGrandTotal = netInSelected + markupAmount;
//   const exactPerPerson = travelerCount > 0 ? exactGrandTotal / travelerCount : 0;

//   // Rounding Logic
//   let finalPerPerson = exactPerPerson;
//   if (roundingMode === '5') finalPerPerson = Math.ceil(exactPerPerson / 5) * 5;
//   else if (roundingMode === '10') finalPerPerson = Math.ceil(exactPerPerson / 10) * 10;
//   else if (roundingMode === '100') finalPerPerson = Math.ceil(exactPerPerson / 100) * 100;

//   const finalGrandTotal = finalPerPerson * travelerCount;


//     // --- 4. DATA PROCESSING: INJECT GHOST STAYS (MULTI-NIGHT LOGIC) ---
//   const processedDayPlans = useMemo(() => {
//     // Deep copy to avoid mutating original context
//     const plansWithGhosts = JSON.parse(JSON.stringify(rawDayPlans)) as DayPlan[];

//     // Iterate to inject "Ghost" stays for display on subsequent days
//     rawDayPlans.forEach((day) => {
//         if (!day.stays) return;
        
//         day.stays.forEach(stay => {
//             const nights = safeNum(stay.nights);
//             if (nights > 1) {
//                 const currentDayNum = day.dayNumber;
                
//                 // Add ghost entries for the following nights
//                 for (let i = 1; i < nights; i++) {
//                     const targetDayNum = currentDayNum + i;
//                     const targetDay = plansWithGhosts.find(d => d.dayNumber === targetDayNum);
                    
//                     if (targetDay) {
//                         if (!targetDay.stays) targetDay.stays = [];
                        
//                         targetDay.stays.push({
//                             ...stay,
//                             id: -Math.random(), // Temp ID for React Key
//                             costPerNight: 0,    // Ghost has 0 cost (already paid in Day 1)
//                             isGhost: true       // Flag for UI
//                         });
//                     }
//                 }
//             }
//         });
//     });

//     return plansWithGhosts;
//   }, [rawDayPlans]);



//   // --- 7. EXPORT: PDF (UPDATED FOR DETAILED ROWS) ---
//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.width;

//     // --- PASTE YOUR BASE64 LOGO STRING HERE ---
//     const logoBase64 = "data:image/png;base64,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";


//     const cleanPrice = (amount: number) => formatPrice(amount, currency);

//     // 1. Header Background Line
//     doc.setFillColor(245, 245, 220); // Light Beige/Gray accent
//     doc.rect(0, 0, pageWidth, 5, 'F');

//     // 2. Logo Logic
//     if (logoBase64 && logoBase64.length > 100) {
//         try {
//             doc.addImage(logoBase64, 'PNG', 14, 8, 50, 12); 
//         } catch (e) {
//             doc.setTextColor(0, 0, 0); doc.setFontSize(22); doc.text("TRAVDEK", 14, 20);
//         }
//     } else {
//         // Fallback if no logo
//         doc.setTextColor(0, 0, 0); doc.setFontSize(22); doc.setFont("helvetica", "bold");
//         doc.text("TRAVDEK", 14, 20);
//     }

//     // 3. Trip Info Header
//     doc.setFont("helvetica", "normal");
//     doc.setTextColor(0, 0, 0);
//     doc.setFontSize(14);
//     doc.text(`Quotation For: ${itineraryData.tripName || 'New Trip'}`, 14, 30);
    
//     doc.setFontSize(10);
//     doc.setTextColor(100, 100, 100);
//     doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 14, 36);
//     doc.text(`Travelers: ${travelerCount}`, 14, 41);
//     doc.text(`Currency: ${currency}`, 14, 46);

//     // 4. Build Table Data
//     const tableBody: any[] = [];

//     processedDayPlans.forEach(day => {
//         const locationTitle = day.city || "";
//         tableBody.push([{ content: `DAY ${day.dayNumber} - ${locationTitle.toUpperCase()}`, colSpan: 6, styles: { fillColor: [240, 240, 240], fontStyle: 'bold', textColor: [50, 50, 50] } }]);

//         // Updated addRow to accept specific PP Cost override and showCategoryLabel logic
//         const addRow = (cat: string, name: string, status: string | undefined, config: string, rawCost: number, isGhost: boolean = false, overridePPCost?: number, showCategoryLabel: boolean = true) => {
//             const isIncluded = isItemIncluded(status);
//             const cost = (isIncluded && !isGhost) ? convert(rawCost, currency) : 0;
            
//             // Calculate PP Cost: If override provided (for stays), use it; otherwise use average
//             let ppCost = 0;
//             if (overridePPCost !== undefined) {
//                ppCost = (isIncluded && !isGhost) ? convert(overridePPCost, currency) : 0;
//             } else {
//                ppCost = travelerCount > 0 ? cost / travelerCount : 0;
//             }
            
//             let displayConfig = config;
//             if(isGhost) displayConfig = "Continuing Stay";

//             const displayStatus = status ? status.toUpperCase() : "INCLUDED";

//             // If showCategoryLabel is false (sub-row), we pass an empty string to simulate "RowSpan" visual
//             const categoryCell = showCategoryLabel ? cat : "";

//             tableBody.push([
//                 categoryCell, 
//                 name + (!isIncluded ? ` (${displayStatus})` : ''), 
//                 displayStatus, 
//                 displayConfig, 
//                 cleanPrice(ppCost), // Specific PP Cost
//                 cleanPrice(cost)    // Net Column
//             ]);
//         };

//         // --- UPDATED PDF LOOP FOR STAYS ---
//         if(day.stays) {
//             day.stays.forEach((s: any) => {
//                 // Get split rows (Twin, Quad, etc.)
//                 const splitRows = getStayRows(s);

//                 splitRows.forEach((row, idx) => {
//                     addRow(
//                         'Stay',
//                         row.details, // e.g., "Hotel... (Quad Share)"
//                         s.inclusionType,
//                         row.config, // e.g., "2 Room(s) x 4 Pax"
//                         row.rawCost, // Net cost for this group
//                         s.isGhost,
//                         row.ppCost, // Specific PP cost for this group
//                         idx === 0   // Only show "Stay" label on the first row
//                     );
//                 });
//             });
//         }

//         // --- OTHER ITEMS REMAIN UNCHANGED ---
//         if(day.transports) day.transports.forEach(t => addRow('Transport', t.vehicleType, t.inclusionType, `${t.vehicleCount} Veh`, safeNum(t.price) * safeNum(t.vehicleCount)));
//         if(day.activities) day.activities.forEach(a => {
//             const guideCost = a.guideType === 'guided' ? safeNum(a.guideFee) : 0;
//             const totalCost = ((safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * travelerCount) + guideCost;
//             addRow('Activity', a.heading, a.inclusionType, 'Entry/Guide', totalCost);
//         });
//         if(day.meals) day.meals.forEach(m => addRow('Meal', m.restaurantName, m.inclusionType, m.mealType, safeNum(m.adultCost) * travelerCount));
//     });

//     // 5. Render Table
//     autoTable(doc, {
//       startY: 55, 
//       head: [['Category', 'Details', 'Status', 'Config', 'PP Cost', 'Net Cost']],
//       body: tableBody,
//       theme: 'grid',
//       styles: { fontSize: 8, cellPadding: 3 },
//       columnStyles: { 
//           4: { halign: 'right' },
//           5: { halign: 'right' } 
//       }
//     });

//     // 6. TOTALS SECTION
//     // @ts-ignore
//     const finalY = doc.lastAutoTable.finalY + 10;
    
//     // Check page break for footer
//     if (finalY > 240) {
//          doc.addPage();
//     }

//     // Draw Line above totals
//     doc.setDrawColor(200, 200, 200);
//     doc.line(100, finalY, 196, finalY);

//     let currentY = finalY + 8;

//     // --- A. NET AMOUNT ---
//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");
//     doc.setTextColor(100, 100, 100); // Gray Text
//     doc.text("Net Amount:", 150, currentY, { align: "right" });
    
//     doc.setTextColor(0, 0, 0); // Black Numbers
//     doc.text(cleanPrice(netInSelected), 190, currentY, { align: "right" });

//     // --- B. MARKUP AMOUNT ---
//     currentY += 6;
//     doc.setTextColor(100, 100, 100);
//     doc.text(`Markup (${markupPercent}%):`, 150, currentY, { align: "right" });
    
//     doc.setTextColor(0, 0, 0);
//     doc.text(cleanPrice(markupAmount), 190, currentY, { align: "right" });

//     // Separator line before Grand Total
//     currentY += 4;
//     doc.setDrawColor(220, 220, 220);
//     doc.line(140, currentY, 196, currentY);
//     currentY += 6;

//     // --- C. TOTAL GROUP COST ---
//     doc.setFontSize(11);
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(0, 0, 0);
//     doc.text("Total Group Cost:", 150, currentY, { align: "right" });
    
//     doc.setFont("courier", "bold"); 
//     doc.text(cleanPrice(finalGrandTotal), 190, currentY, { align: "right" });

//     // --- D. PRICE PER PERSON ---
//     currentY += 8;
//     // Highlight Box for PP
//     doc.setFillColor(240, 248, 255); // AliceBlue
//     doc.rect(110, currentY - 5, 90, 10, 'F');
    
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(0, 100, 0); // Dark Green
//     doc.text("Price Per Person:", 150, currentY, { align: "right" });
    
//     doc.setFontSize(12);
//     doc.text(cleanPrice(finalPerPerson), 190, currentY, { align: "right" });

//     // Save
//     doc.save(`Quote_${itineraryData.tripId || 'Travdek'}.pdf`);
//   };

//   const handleSaveQuote = async () => {
//     await saveItinerary('quick');
//     alert("Quote saved!");
//   };



//    // --- 7. EXPORT: EXCEL (Updated with PP Column) ---
//   const handleDownloadExcel = () => {
//     const ws_data = [
//       ["TRAVDEK TRIP QUOTATION"],
//       [`Trip: ${itineraryData.tripName}`, `Travelers: ${travelerCount}`],
//       // ADDED: "PP Cost" Column
//       ["Day / Location", "Category", "Item Details", "Status", "Config", `PP Cost (${currency})`, `Total Cost (${currency})`],
//     ];

//     processedDayPlans.forEach((day) => {
//       const locationTitle = day.city || "Unknown";
      
//       const processItem = (category: string, name: string, status: string | undefined, config: string, rawCost: number, isGhost: boolean = false) => {
//          const isIncluded = isItemIncluded(status);
//          const cost = (isIncluded && !isGhost) ? convert(rawCost, currency) : 0;
//          const ppCost = travelerCount > 0 ? cost / travelerCount : 0;
         
//          let displayConfig = config;
//          if(isGhost) displayConfig = "Continuing Stay (Pre-paid)";

//          const displayStatus = status ? status.toUpperCase() : "INCLUDED";

//          ws_data.push([
//             `Day ${day.dayNumber} - ${locationTitle}`, 
//             category, 
//             name, 
//             displayStatus, 
//             displayConfig,
//             formatPrice(ppCost, currency).replace(/[^0-9.]/g, ''), // PP Value
//             formatPrice(cost, currency).replace(/[^0-9.]/g, '')     // Total Value
//          ]);
//       };

//       if(day.stays) {
//           day.stays.forEach((s: any) => {
//               const totalCost = safeNum(s.costPerNight) * safeNum(s.numRooms) * safeNum(s.nights);
//               processItem("Accommodation", s.hotelName, s.inclusionType, `${s.numRooms} Rooms x ${s.nights} Nights`, totalCost, s.isGhost);
//           });
//       }
//       if(day.transports) {
//           day.transports.forEach(t => {
//               const totalCost = safeNum(t.price) * safeNum(t.vehicleCount);
//               processItem("Transport", t.vehicleType, t.inclusionType, `${t.vehicleCount} Vehicles`, totalCost);
//           });
//       }
//       if(day.activities) {
//           day.activities.forEach(a => {
//               const guideCost = a.guideType === 'guided' ? safeNum(a.guideFee) : 0;
//               const totalCost = ((safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * travelerCount) + guideCost;
//               processItem("Activity", a.heading, a.inclusionType, `${travelerCount} Pax`, totalCost);
//           });
//       }
//       if(day.meals) {
//           day.meals.forEach(m => {
//               const totalCost = safeNum(m.adultCost) * travelerCount;
//               processItem("Meal", m.restaurantName, m.inclusionType, m.mealType, totalCost);
//           });
//       }
//     });
    
//     ws_data.push(
//         ["", "", "", "", "", "", ""], 
//         ["", "", "", "", "", "GRAND TOTAL", formatPrice(finalGrandTotal, currency).replace(/[^0-9.]/g, '')],
//         ["", "", "", "", "", "PER PERSON", formatPrice(finalPerPerson, currency).replace(/[^0-9.]/g, '')]
//     );

//     const ws = XLSX.utils.aoa_to_sheet(ws_data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Quotation");
//     XLSX.writeFile(wb, `Quote_${itineraryData.tripName || 'Trip'}.xlsx`);
//   };



//   // --- HELPER: SPLIT STAYS BY OCCUPANCY ---
//   // Returns an array of rows to render for a single Stay object
//   const getStayRows = (stay: any) => {
//       // If no occupancy data (legacy), default to simple division
//       if (!stay.roomOccupancy || stay.roomOccupancy.length === 0) {
//           const rawCost = safeNum(stay.costPerNight) * safeNum(stay.numRooms) * safeNum(stay.nights);
//           return [{
//              details: stay.hotelName,
//              config: `${stay.numRooms} Room(s)`,
//              rawCost: rawCost,
//              ppCost: rawCost / travelerCount // Fallback average
//           }];
//       }

//       // Group rooms by pax count: { "4": 2, "2": 1 } (2 rooms of 4, 1 room of 2)
//       const groups: Record<number, number> = {};
//       stay.roomOccupancy.forEach((pax: number) => {
//           groups[pax] = (groups[pax] || 0) + 1;
//       });

//       // Generate rows
//       return Object.entries(groups).map(([paxStr, roomCount]) => {
//           const pax = parseInt(paxStr);
//           const totalCostForGroup = safeNum(stay.costPerNight) * roomCount * safeNum(stay.nights);
          
//           // Cost Per Person = (Room Cost * Nights) / Pax in Room
//           const ppCost = (safeNum(stay.costPerNight) * safeNum(stay.nights)) / pax;

//           return {
//               details: `${stay.hotelName} (${getShareLabel(pax)} Share)`,
//               config: `${roomCount} Room(s) x ${pax} Pax`,
//               rawCost: totalCostForGroup,
//               ppCost: ppCost
//           };
//       });
//   };

//   if (loading) return <div className="p-10 text-center">Loading Rates...</div>;

//   return (
//     <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      
//       {/* HEADER */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4 flex justify-between items-center shadow-sm">
//         <div>
//            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//              <FileText className="text-blue-600" size={24}/> Quotation Sheet
//            </h1>
//            <p className="text-xs text-gray-500 mt-0.5">Total Days: {rawDayPlans.length} • Travelers: {travelerCount}</p>
//         </div>
//         <div className="flex gap-3">
//              <button onClick={() => router.push('/dashboard/itinerary/create-day')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"><ArrowLeft size={16} /> Edit</button>
//         </div>
//       </header>

//       <main className="max-w-[1600px] mx-auto p-6 flex flex-col xl:flex-row gap-6 items-start">
        
//         {/* ================= LEFT: THE MASTER LEDGER TABLE ================= */}
//         <div className="flex-1 w-full bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead className="bg-gray-50 text-gray-500 border-b border-gray-300">
//                     <tr>
//                         <th className="py-3 px-4 text-xs font-bold uppercase w-[80px]">Type</th>
//                         <th className="py-3 px-4 text-xs font-bold uppercase">Item Details</th>
//                         <th className="py-3 px-4 text-xs font-bold uppercase w-[180px]">Config</th>
//                         <th className="py-3 px-4 text-xs font-bold uppercase text-right w-[120px]">Net Total</th>
//                         <th className="py-3 px-4 text-xs font-bold uppercase text-right w-[100px]">PP Cost</th>
//                     </tr>
//                 </thead>
//                 <tbody className="text-sm">
//                     {rawDayPlans.map((day) => {
//                         const locationTitle = day.city || "Unknown Location";
//                         const hasItems = (day.stays?.length || 0) + (day.transports?.length || 0) + (day.activities?.length || 0) + (day.meals?.length || 0) > 0;

//                         return (
//                             <React.Fragment key={day.dayNumber}>
//                                 <tr className="bg-gray-100 border-b border-gray-400 cell-2 ">
//                                     <td colSpan={5} className="py-2 px-4">
//                                         <div className="flex items-center gap-2 text-gray-700 font-bold">
//                                             <Calendar size={14} className="text-blue-500"/>
//                                             <span>DAY {day.dayNumber} - {locationTitle}</span>
//                                         </div>
//                                     </td>
//                                 </tr>

//                                 {!hasItems && (
//                                     <tr><td colSpan={5} className="p-4 text-center text-gray-400 italic text-xs">No items added.</td></tr>
//                                 )}

//                                 {/* STAYS - UPDATED LOOP FOR ROWSPAN */}
//                                 {(day.stays || []).map((s: any, i: number) => {
//                                     // 1. Get all the split rows for this single hotel
//                                     const rows = getStayRows(s);
                                    
//                                     // 2. Map them, passing RowSpan info
//                                     return rows.map((row, idx) => (
//                                         <LedgerRow 
//                                           key={`s-${i}-${idx}`} 
//                                           typeLabel="Stay"
//                                           typeColor={s.isGhost ? "text-gray-400" : "text-gray-900"}
//                                           details={row.details}
//                                           inclusionType={s.inclusionType}
//                                           config={row.config}
//                                           rawCost={row.rawCost}
//                                           overridePPCost={row.ppCost} 
//                                           travelerCount={travelerCount}
//                                           currency={currency}
//                                           convert={convert}
//                                           formatPrice={formatPrice}
//                                           isGhost={s.isGhost}

//                                           // *** ROWSPAN LOGIC ***
//                                           // Only the first row (idx === 0) gets the label and rowSpan
//                                           // Subsequent rows (idx > 0) are marked as sub-rows
//                                           rowSpan={idx === 0 ? rows.length : 1}
//                                           isSubRow={idx > 0} 
//                                       />
//                                     ));
//                                 })}

//                                 {/* TRANSPORT (Standard Logic) */}
//                                 {(day.transports || []).map((t, i) => {
//                                     const rawCost = safeNum(t.price) * safeNum(t.vehicleCount);
//                                     return (
//                                       <LedgerRow 
//                                           key={`t-${i}`} 
//                                           typeLabel="Transport"
//                                           typeColor="text-gray-900"
//                                           details={t.vehicleType}
//                                           inclusionType={t.inclusionType}
//                                           config={`${t.vehicleCount} Vehicles`}
//                                           rawCost={rawCost}
//                                           travelerCount={travelerCount}
//                                           currency={currency}
//                                           convert={convert}
//                                           formatPrice={formatPrice}
//                                       />
//                                     );
//                                 })}
                                
//                                 {/* ACTIVITIES (Standard Logic) */}
//                                 {(day.activities || []).map((a, i) => {
//                                     const guideCost = a.guideType === 'guided' ? safeNum(a.guideFee) : 0;
//                                     const rawCost = ((safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * travelerCount) + guideCost;
//                                     return (
//                                       <LedgerRow 
//                                           key={`a-${i}`} 
//                                           typeLabel="Activity"
//                                           typeColor="text-gray-900"
//                                           details={a.heading}
//                                           inclusionType={a.inclusionType}
//                                           config={`${travelerCount} Pax • ${a.guideType}`}
//                                           rawCost={rawCost}
//                                           travelerCount={travelerCount}
//                                           currency={currency}
//                                           convert={convert}
//                                           formatPrice={formatPrice}
//                                       />
//                                     );
//                                 })}

//                                 {/* MEALS (Standard Logic) */}
//                                 {(day.meals || []).map((m, i) => {
//                                     const rawCost = safeNum(m.adultCost) * travelerCount;
//                                     return (
//                                       <LedgerRow 
//                                           key={`m-${i}`} 
//                                           typeLabel="Meal"
//                                           typeColor="text-gray-900"
//                                           details={m.restaurantName}
//                                           inclusionType={m.inclusionType}
//                                           config={`${travelerCount} Pax • ${m.mealType}`}
//                                           rawCost={rawCost}
//                                           travelerCount={travelerCount}
//                                           currency={currency}
//                                           convert={convert}
//                                           formatPrice={formatPrice}
//                                       />
//                                     );
//                                 })}
//                             </React.Fragment>
//                         );
//                     })}
//                 </tbody>
//               </table>
//             </div>
//         </div>

//         {/* ================= RIGHT: CALCULATOR (Kept Same) ================= */}
//         <div className="w-full xl:w-[400px] shrink-0 sticky top-24 flex flex-col gap-4">
//             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-300 flex items-center justify-between">
//                 <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Currency</div>
//                 <select 
//                     value={currency} 
//                     onChange={(e) => handleCurrencyChange(e.target.value)}
//                     className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold"
//                 >
//                     {rates && Object.keys(rates).map(r => <option key={r} value={r}>{r}</option>)}
//                 </select>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
//                 <div className="bg-gray-900 text-white px-5 py-4 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                         <Calculator size={18} className="text-green-400"/>
//                         <span className="font-bold tracking-wide text-sm">Quote Calculator</span>
//                     </div>
//                 </div>

//                 <div className="p-5 space-y-5">
//                     <div className="flex justify-between items-center text-sm">
//                         <span className="text-gray-500 font-medium">Total Net Cost (Included Only)</span>
//                         <span className="font-mono font-bold text-gray-800 text-lg">
//                             {formatPrice(netInSelected, currency)}
//                         </span>
//                     </div>

//                     <div className="grid grid-cols-1 gap-4">
//                         <div className="space-y-1">
//                             <label className="text-[10px] font-bold text-gray-400 uppercase">Markup %</label>
//                             <input type="number" value={markupPercent} onChange={(e) => handleMarkupChange(parseFloat(e.target.value) || 0)} className="w-full p-2 border border-gray-300 rounded-lg font-bold text-gray-800 text-sm"/>
//                         </div>
//                     </div>

//                     <div className="border-t border-gray-100"></div>

//                      <div className="space-y-3"> 
//                         <div className="flex items-center gap-2 text-purple-600">
//                             <Sparkles size={14} fill="currentColor" className="text-purple-200"/>
//                             <span className="text-xs font-bold uppercase tracking-wide">Pricing Strategy</span>
//                         </div>
//                         <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-lg">
//                             {['none', '5', '10', '100'].map((mode) => (
//                                 <button 
//                                   key={mode} 
//                                   onClick={() => handleRoundingChange(mode)} 
//                                   className={`text-[10px] font-bold py-1.5 rounded-md ${roundingMode === mode ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-400'}`}
//                                 >
//                                     {mode === 'none' ? 'Exact' : `+${mode}`}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-xl shadow-inner text-white space-y-4">
//                          <div className="flex justify-between items-start">
//                             <div>
//                                 <div className="text-blue-200 font-bold text-xs uppercase mb-1">Selling Price / Per Person</div>
//                                 <div className="font-mono font-black text-3xl tracking-tight">{formatPrice(finalPerPerson, currency)}</div>
//                             </div>
//                             <User size={24} className="text-blue-400/50" />
//                         </div>
//                         <div className="pt-3 border-t border-blue-500/30 flex justify-between items-center">
//                             <span className="text-blue-200 font-medium text-xs">Total Group Value ({travelerCount} Pax)</span>
//                             <span className="font-mono font-bold text-lg text-white">{formatPrice(finalGrandTotal, currency)}</span>
//                         </div>

                        
//                     </div>
//                        <div className="bg-gray-50 px-5 py-4 border-t border-gray-200 grid grid-cols-2 gap-3">
//                      <button onClick={handleDownloadExcel} className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded-lg text-xs shadow-sm"><Download size={14}/> Excel</button>
//                      <button onClick={handleDownloadPDF}  className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded-lg text-xs shadow-sm"><Printer size={14}/> PDF</button>
//                      <button onClick={handleSaveQuote} className="col-span-2 flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3 rounded-lg text-sm shadow-md"><Save size={16}/> Save Quote</button>
//                  </div>
//                 </div>
//             </div> 
//         </div>
//       </main>
//     </div>
//   );
// }

// // --- ROW RENDERER (Updated with RowSpan) ---
// const LedgerRow = ({ 
//     typeLabel, typeColor, details, inclusionType, config, 
//     rawCost, currency, convert, formatPrice, isGhost, travelerCount,
//     overridePPCost,
//     // NEW PROPS FOR ROWSPAN
//     rowSpan = 1,
//     isSubRow = false
// }: any) => {
    
//     const isIncluded = isItemIncluded(inclusionType);
//     const isOptional = inclusionType?.toLowerCase() === 'optional';
    
//     // Total Cost
//     const finalCost = (isIncluded && !isGhost) ? convert(rawCost, currency) : 0;
    
//     // Per Person Cost: Use override if available (for Stays), else calculated average
//     let ppCost = 0;
//     if (overridePPCost !== undefined) {
//         ppCost = (isIncluded && !isGhost) ? convert(overridePPCost, currency) : 0;
//     } else {
//         ppCost = (travelerCount > 0) ? finalCost / travelerCount : 0;
//     }

//     let rowClass = "border-b border-gray-100 transition-colors odd:bg-white even:bg-gray-50/50";
//     let textClass = "font-medium text-sm block text-gray-800";
//     let costClass = "font-mono text-sm font-medium text-gray-500";
    
//     if (isGhost) {
//         rowClass += " bg-gray-50/80";
//         textClass = "font-medium text-sm block text-gray-500";
//         costClass = "font-mono text-sm font-medium text-gray-400";
//     } else if (!isIncluded) {
//         rowClass += " opacity-60 bg-red-50/20";
//         textClass = "font-medium text-sm block text-gray-500 italic";
//         costClass = "font-mono text-sm font-medium text-gray-400 line-through decoration-gray-300";
//     }

//     const displayStatus = inclusionType ? inclusionType.toUpperCase() : "INCLUDED";

//     return (
//         <tr className={rowClass}>
//             {/* 1. ROWSPAN LOGIC: Only render this cell if it is NOT a sub-row */}
//             {!isSubRow && (
//                 <td 
//                     rowSpan={rowSpan} 
//                     className="py-3 px-4 align-top w-[90px] border-r border-gray-100/50" // Added border for cleaner separation
//                 >
//                      <span className={`text-[11px] font-bold uppercase tracking-wider ${typeColor || "text-gray-500"}`}>
//                         {typeLabel}
//                     </span>
//                 </td>
//             )}

//             <td className="py-3 px-4 align-top">
//                 <span className={textClass}>
//                     {details} 
//                     {!isIncluded && <span className={`ml-2 text-[10px] uppercase font-bold border px-1.5 rounded ${isOptional ? 'text-blue-500 border-blue-200' : 'text-red-500 border-red-200'}`}>({displayStatus})</span>}
//                     {isGhost && <span className="ml-2 text-[10px] font-bold text-gray-400 border border-gray-200 px-1.5 rounded bg-white">CONTINUING</span>}
//                 </span>
//             </td>
//             <td className="py-3 px-4 align-top">
//                 <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded inline-block whitespace-nowrap">
//                    {config}
//                 </span>
//             </td>
           
//             {/* TOTAL COST */}
//             <td className="py-3 px-4 align-top text-right">
//                 <span className={costClass}>
//                     {formatPrice(finalCost, currency)}
//                 </span>
//             </td>
//              {/* PER PERSON COLUMN */}
//               <td className="py-3 px-4 align-top text-right">
//                 <span className={costClass}>
//                     {formatPrice(ppCost, currency)}
//                 </span>
//             </td>
//         </tr>
//     );
// }; 






























































// "use client";

// import React, { useState, useEffect, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Calculator, Download, FileText, 
//   ArrowRight, ArrowLeft,
//   Calendar, Sparkles, User , Printer , Save , 
// } from 'lucide-react';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { useItinerary } from '@/app/context/ItineraryContext'; 
// import { useCurrency } from '@/hooks/useCurrency';
// import { DayPlan } from '../create-day/constants/daywiseConstants';

// // --- HELPERS ---
// const isItemIncluded = (status?: string) => !status || status.toLowerCase() === 'included';
// const safeNum = (val: any) => {
//   const num = parseFloat(val);
//   return isNaN(num) ? 0 : num;
// };

// // Helper to determine share type label
// const getShareLabel = (pax: number) => {
//   if (pax === 1) return "Single";
//   if (pax === 2) return "Twin/Double";
//   if (pax === 3) return "Triple";
//   if (pax === 4) return "Quad";
//   return `${pax}-Pax`;
// };

// export default function CostingPage() {
//   const router = useRouter();
//   const { itineraryData, updateItineraryData, saveItinerary } = useItinerary();
//   const rawDayPlans = (itineraryData?.dayWiseActivities || []) as DayPlan[];
//   const travelerCount = safeNum(itineraryData?.numberOfTravelers) || 1;
//   const { currency, setCurrency, convert, formatPrice, rates, loading } = useCurrency('USD');

//   // --- STATE ---
//   const [markupPercent, setMarkupPercent] = useState<number>(20);
//   const [roundingMode, setRoundingMode] = useState<string>('none'); 

//   useEffect(() => {
//     if (itineraryData.selectedCurrency && itineraryData.selectedCurrency !== currency) {
//         setCurrency(itineraryData.selectedCurrency);
//     }
//   }, [itineraryData.selectedCurrency]);

//   const handleCurrencyChange = (newCurrency: string) => {
//     setCurrency(newCurrency);
//     updateItineraryData({ selectedCurrency: newCurrency });
//   };

//   useEffect(() => {
//     if (itineraryData.markupPercentage !== undefined) setMarkupPercent(itineraryData.markupPercentage);
//     if (itineraryData.roundingMode) setRoundingMode(itineraryData.roundingMode);
//   }, [itineraryData.markupPercentage, itineraryData.roundingMode]);

//   const handleMarkupChange = (val: number) => {
//     setMarkupPercent(val);
//     updateItineraryData({ markupPercentage: val });
//   };

//   const handleRoundingChange = (mode: string) => {
//     setRoundingMode(mode);
//     updateItineraryData({ roundingMode: mode } as any);
//   };

//   // --- 4. DATA PROCESSING: INJECT GHOST STAYS (MULTI-NIGHT LOGIC) ---
//   const processedDayPlans = useMemo(() => {
//     // Deep copy to avoid mutating original context
//     const plansWithGhosts = JSON.parse(JSON.stringify(rawDayPlans)) as DayPlan[];

//     // Iterate to inject "Ghost" stays for display on subsequent days
//     rawDayPlans.forEach((day) => {
//         if (!day.stays) return;
        
//         day.stays.forEach(stay => {
//             const nights = safeNum(stay.nights);
//             if (nights > 1) {
//                 const currentDayNum = day.dayNumber;
                
//                 // Add ghost entries for the following nights
//                 for (let i = 1; i < nights; i++) {
//                     const targetDayNum = currentDayNum + i;
//                     const targetDay = plansWithGhosts.find(d => d.dayNumber === targetDayNum);
                    
//                     if (targetDay) {
//                         if (!targetDay.stays) targetDay.stays = [];
                        
//                         targetDay.stays.push({
//                             ...stay,
//                             id: -Math.random(), // Temp ID for React Key
//                             costPerNight: 0,    // Ghost has 0 cost (already paid in Day 1)
//                             isGhost: true       // Flag for UI
//                         });
//                     }
//                 }
//             }
//         });
//     });

//     return plansWithGhosts;
//   }, [rawDayPlans]);

//   // --- 5. COST CALCULATION ENGINE ---
//   const calculatedNetTotal = useMemo(() => {
//     let total = 0;
//     // We use rawDayPlans for calculation to avoid double counting ghosts
//     rawDayPlans.forEach(day => {
//         if(day.stays) {
//             day.stays.forEach(s => {
//                 if (isItemIncluded(s.inclusionType)) {
//                     total += safeNum(s.costPerNight) * safeNum(s.numRooms) * safeNum(s.nights);
//                 }
//             });
//         }
//         if(day.transports) {
//             day.transports.forEach(t => {
//                 if (isItemIncluded(t.inclusionType)) {
//                     total += safeNum(t.price) * safeNum(t.vehicleCount);
//                 }
//             });
//         }
//         if(day.activities) {
//             day.activities.forEach(a => {
//                 if (isItemIncluded(a.inclusionType)) {
//                     const guideCost = a.guideType === 'guided' ? safeNum(a.guideFee) : 0;
//                     const itemCost = (safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * travelerCount;
//                     total += itemCost + guideCost;
//                 }
//             });
//         }
//         if(day.meals) {
//             day.meals.forEach(m => {
//                 if (isItemIncluded(m.inclusionType)) {
//                     total += safeNum(m.adultCost) * travelerCount;
//                 }
//             });
//         }
//     });
//     return total;
//   }, [rawDayPlans, travelerCount]);

//   // --- FINAL TOTALS ---
//   const netInSelected = convert(calculatedNetTotal, currency);
//   const markupAmount = netInSelected * (markupPercent / 100);
//   const exactGrandTotal = netInSelected + markupAmount;
//   const exactPerPerson = travelerCount > 0 ? exactGrandTotal / travelerCount : 0;

//   // Rounding Logic
//   let finalPerPerson = exactPerPerson;
//   if (roundingMode === '5') finalPerPerson = Math.ceil(exactPerPerson / 5) * 5;
//   else if (roundingMode === '10') finalPerPerson = Math.ceil(exactPerPerson / 10) * 10;
//   else if (roundingMode === '100') finalPerPerson = Math.ceil(exactPerPerson / 100) * 100;

//   const finalGrandTotal = finalPerPerson * travelerCount;


//   // --- HELPER: SPLIT STAYS BY OCCUPANCY (UPDATED WITH NIGHTS IN CONFIG) ---
//   const getStayRows = (stay: any) => {
//       // Logic for building the Config String: "1 Room x 2 Pax x 2 Nights"
      
//       // If no occupancy data (legacy), default to simple division
//       if (!stay.roomOccupancy || stay.roomOccupancy.length === 0) {
//           const rawCost = safeNum(stay.costPerNight) * safeNum(stay.numRooms) * safeNum(stay.nights);
//           return [{
//              details: stay.hotelName,
//              // UPDATED: Added x Nights
//              config: `${stay.numRooms} Room(s) x ${stay.nights} Nights`, 
//              rawCost: rawCost,
//              ppCost: rawCost / travelerCount // Fallback average
//           }];
//       }

//       // Group rooms by pax count: { "4": 2, "2": 1 } (2 rooms of 4, 1 room of 2)
//       const groups: Record<number, number> = {};
//       stay.roomOccupancy.forEach((pax: number) => {
//           groups[pax] = (groups[pax] || 0) + 1;
//       });

//       // Generate rows
//       return Object.entries(groups).map(([paxStr, roomCount]) => {
//           const pax = parseInt(paxStr);
//           const totalCostForGroup = safeNum(stay.costPerNight) * roomCount * safeNum(stay.nights);
          
//           // Cost Per Person = (Room Cost * Nights) / Pax in Room
//           const ppCost = (safeNum(stay.costPerNight) * safeNum(stay.nights)) / pax;

//           return {
//               details: `${stay.hotelName} (${getShareLabel(pax)} Share)`,
//               // UPDATED: Added x Nights to the config string
//               config: `${roomCount} Room(s) x ${pax} Pax x ${stay.nights} Nights`,
//               rawCost: totalCostForGroup,
//               ppCost: ppCost
//           };
//       });
//   };


//    // --- 7. EXPORT: EXCEL ---
//   const handleDownloadExcel = () => {
//     const ws_data = [
//       ["TRAVDEK TRIP QUOTATION"],
//       [`Trip: ${itineraryData.tripName}`, `Travelers: ${travelerCount}`],
//       ["Day / Location", "Category", "Item Details", "Status", "Config", `PP Cost (${currency})`, `Total Cost (${currency})`],
//     ];

//     processedDayPlans.forEach((day) => {
//       const locationTitle = day.city || "Unknown";
      
//       const processItem = (category: string, name: string, status: string | undefined, config: string, rawCost: number, isGhost: boolean = false) => {
//          const isIncluded = isItemIncluded(status);
//          const cost = (isIncluded && !isGhost) ? convert(rawCost, currency) : 0;
//          const ppCost = travelerCount > 0 ? cost / travelerCount : 0;
         
//          let displayConfig = config;
//          if(isGhost) displayConfig = "Continuing Stay";

//          const displayStatus = status ? status.toUpperCase() : "INCLUDED";

//          ws_data.push([
//             `Day ${day.dayNumber} - ${locationTitle}`, 
//             category, 
//             name, 
//             displayStatus, 
//             displayConfig,
//             formatPrice(ppCost, currency).replace(/[^0-9.]/g, ''), 
//             formatPrice(cost, currency).replace(/[^0-9.]/g, '')    
//          ]);
//       };

//       if(day.stays) {
//           day.stays.forEach((s: any) => {
//               // Ensure we use getStayRows here too if we want Excel to match 100%
//               // For simplicity, keeping Excel standard but ensuring Ghosts are marked
//               const totalCost = safeNum(s.costPerNight) * safeNum(s.numRooms) * safeNum(s.nights);
//               const config = s.isGhost ? "Continuing Stay" : `${s.numRooms} Rooms x ${s.nights} Nights`;
//               processItem("Accommodation", s.hotelName, s.inclusionType, config, totalCost, s.isGhost);
//           });
//       }
//       if(day.transports) {
//           day.transports.forEach(t => {
//               const totalCost = safeNum(t.price) * safeNum(t.vehicleCount);
//               processItem("Transport", t.vehicleType, t.inclusionType, `${t.vehicleCount} Vehicles`, totalCost);
//           });
//       }
//       // ... Activities and Meals (Same as before)
//       if(day.activities) {
//           day.activities.forEach(a => {
//               const guideCost = a.guideType === 'guided' ? safeNum(a.guideFee) : 0;
//               const totalCost = ((safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * travelerCount) + guideCost;
//               processItem("Activity", a.heading, a.inclusionType, `${travelerCount} Pax`, totalCost);
//           });
//       }
//       if(day.meals) {
//           day.meals.forEach(m => {
//               const totalCost = safeNum(m.adultCost) * travelerCount;
//               processItem("Meal", m.restaurantName, m.inclusionType, m.mealType, totalCost);
//           });
//       }
//     });
    
//     // ... Grand Total Rows
//     ws_data.push(
//         ["", "", "", "", "", "", ""], 
//         ["", "", "", "", "", "GRAND TOTAL", formatPrice(finalGrandTotal, currency).replace(/[^0-9.]/g, '')],
//         ["", "", "", "", "", "PER PERSON", formatPrice(finalPerPerson, currency).replace(/[^0-9.]/g, '')]
//     );

//     const ws = XLSX.utils.aoa_to_sheet(ws_data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Quotation");
//     XLSX.writeFile(wb, `Quote_${itineraryData.tripName || 'Trip'}.xlsx`);
//   };

//   // --- 8. EXPORT: PDF ---
//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.width;

//        const logoBase64 = "data:image/png;base64,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";


//     const cleanPrice = (amount: number) => formatPrice(amount, currency);

//     // 1. Header Background Line
//     doc.setFillColor(245, 245, 220); // Light Beige/Gray accent
//     doc.rect(0, 0, pageWidth, 5, 'F');

//     // 2. Logo Logic
//     if (logoBase64 && logoBase64.length > 100) {
//         try {
//             // FIX: Remove the "data:image/png;base64," prefix and clean newlines
//             // jsPDF often prefers raw Base64 when 'PNG' format is specified explicitly.
//             const cleanBase64 = logoBase64
//                 .replace(/^data:image\/(png|jpg|jpeg);base64,/, "")
//                 .replace(/\s/g, ""); // Removes any hidden newlines/spaces

//             doc.addImage(cleanBase64, 'PNG', 14, 8, 50, 12); 
//         } catch (e) {
//             console.error("Logo Error:", e); // Log error to console to debug
//             doc.setTextColor(0, 0, 0); doc.setFontSize(22); doc.text("TRAVDEK", 14, 20);
//         }
//     } else {
//         // Fallback if no logo
//         doc.setTextColor(0, 0, 0); doc.setFontSize(22); doc.setFont("helvetica", "bold");
//         doc.text("TRAVDEK", 14, 20);
//     }



//     doc.setFont("helvetica", "normal");
//     doc.setTextColor(0, 0, 0);
//     doc.setFontSize(14);
//     doc.text(`Quotation For: ${itineraryData.tripName || 'New Trip'}`, 14, 30);
    
//     doc.setFontSize(10);
//     doc.setTextColor(100, 100, 100);
//     doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 14, 36);
//     doc.text(`Travelers: ${travelerCount}`, 14, 41);
//     doc.text(`Currency: ${currency}`, 14, 46);

//     // 4. Build Table Data
//     const tableBody: any[] = [];

//     processedDayPlans.forEach(day => {
//         const locationTitle = day.city || "";
//         tableBody.push([{ content: `DAY ${day.dayNumber} - ${locationTitle.toUpperCase()}`, colSpan: 6, styles: { fillColor: [240, 240, 240], fontStyle: 'bold', textColor: [50, 50, 50] } }]);

//         const addRow = (cat: string, name: string, status: string | undefined, config: string, rawCost: number, isGhost: boolean = false, overridePPCost?: number, showCategoryLabel: boolean = true) => {
//             const isIncluded = isItemIncluded(status);
//             const cost = (isIncluded && !isGhost) ? convert(rawCost, currency) : 0;
            
//             let ppCost = 0;
//             if (overridePPCost !== undefined) {
//                ppCost = (isIncluded && !isGhost) ? convert(overridePPCost, currency) : 0;
//             } else {
//                ppCost = travelerCount > 0 ? cost / travelerCount : 0;
//             }
            
//             // PDF Logic for Ghost config
//             let displayConfig = config;
//             if(isGhost) displayConfig = "Continuing Stay"; 

//             const displayStatus = status ? status.toUpperCase() : "INCLUDED";
//             const categoryCell = showCategoryLabel ? cat : "";

//             tableBody.push([
//                 categoryCell, 
//                 name + (!isIncluded ? ` (${displayStatus})` : ''), 
//                 displayStatus, 
//                 displayConfig, 
//                 cleanPrice(ppCost), 
//                 cleanPrice(cost)    
//             ]);
//         };

//         if(day.stays) {
//             day.stays.forEach((s: any) => {
//                 const splitRows = getStayRows(s);

//                 splitRows.forEach((row, idx) => {
//                     addRow(
//                         'Stay',
//                         row.details, 
//                         s.inclusionType,
//                         row.config, 
//                         row.rawCost, 
//                         s.isGhost,
//                         row.ppCost, 
//                         idx === 0   
//                     );
//                 });
//             });
//         }

//         if(day.transports) day.transports.forEach(t => addRow('Transport', t.vehicleType, t.inclusionType, `${t.vehicleCount} Veh`, safeNum(t.price) * safeNum(t.vehicleCount)));
//         if(day.activities) day.activities.forEach(a => {
//             const guideCost = a.guideType === 'guided' ? safeNum(a.guideFee) : 0;
//             const totalCost = ((safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * travelerCount) + guideCost;
//             addRow('Activity', a.heading, a.inclusionType, 'Entry/Guide', totalCost);
//         });
//         if(day.meals) day.meals.forEach(m => addRow('Meal', m.restaurantName, m.inclusionType, m.mealType, safeNum(m.adultCost) * travelerCount));
//     });

//     autoTable(doc, {
//       startY: 55, 
//       head: [['Category', 'Details', 'Status', 'Config', 'PP Cost', 'Net Cost']],
//       body: tableBody,
//       theme: 'grid',
//       styles: { fontSize: 8, cellPadding: 3 },
//       columnStyles: { 
//           4: { halign: 'right' },
//           5: { halign: 'right' } 
//       }
//     });

//     // Totals Section (Same as before)
//     // @ts-ignore
//     const finalY = doc.lastAutoTable.finalY + 10;
//     if (finalY > 240) doc.addPage();
//     doc.setDrawColor(200, 200, 200);
//     doc.line(100, finalY, 196, finalY);

//     let currentY = finalY + 8;
//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");
//     doc.setTextColor(100, 100, 100); 
//     doc.text("Net Amount:", 150, currentY, { align: "right" });
//     doc.setTextColor(0, 0, 0); 
//     doc.text(cleanPrice(netInSelected), 190, currentY, { align: "right" });

//     currentY += 6;
//     doc.setTextColor(100, 100, 100);
//     doc.text(`Markup (${markupPercent}%):`, 150, currentY, { align: "right" });
//     doc.setTextColor(0, 0, 0);
//     doc.text(cleanPrice(markupAmount), 190, currentY, { align: "right" });

//     currentY += 4;
//     doc.setDrawColor(220, 220, 220);
//     doc.line(140, currentY, 196, currentY);
//     currentY += 6;

//     doc.setFontSize(11);
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(0, 0, 0);
//     doc.text("Total Group Cost:", 150, currentY, { align: "right" });
//     doc.setFont("courier", "bold"); 
//     doc.text(cleanPrice(finalGrandTotal), 190, currentY, { align: "right" });

//     currentY += 8;
//     doc.setFillColor(240, 248, 255); 
//     doc.rect(110, currentY - 5, 90, 10, 'F');
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(0, 100, 0); 
//     doc.text("Price Per Person:", 150, currentY, { align: "right" });
//     doc.setFontSize(12);
//     doc.text(cleanPrice(finalPerPerson), 190, currentY, { align: "right" });

//     doc.save(`Quote_${itineraryData.tripId || 'Travdek'}.pdf`);
//   };

//   const handleSaveQuote = async () => {
//     await saveItinerary('quick');
//     alert("Quote saved!");
//   };


//   if (loading) return <div className="p-10 text-center">Loading Rates...</div>;

//   return (
//     <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      
//       {/* HEADER */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4 flex justify-between items-center shadow-sm">
//         <div>
//            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//              <FileText className="text-blue-600" size={24}/> Quotation Sheet
//            </h1>
//            <p className="text-xs text-gray-500 mt-0.5">Total Days: {rawDayPlans.length} • Travelers: {travelerCount}</p>
//         </div>
//         <div className="flex gap-3">
//              <button onClick={() => router.push('/dashboard/itinerary/create-day')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"><ArrowLeft size={16} /> Edit</button>
//         </div>
//       </header>

//       <main className="max-w-[1600px] mx-auto p-6 flex flex-col xl:flex-row gap-6 items-start">
        
//         {/* ================= LEFT: THE MASTER LEDGER TABLE ================= */}
//         <div className="flex-1 w-full bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead className="bg-gray-50 text-gray-500 border-b border-gray-300">
//                     <tr>
//                         <th className="py-3 px-4 text-xs font-bold uppercase w-[80px]">Type</th>
//                         <th className="py-3 px-4 text-xs font-bold uppercase">Item Details</th>
//                         <th className="py-3 px-4 text-xs font-bold uppercase w-[180px]">Config</th>
//                         <th className="py-3 px-4 text-xs font-bold uppercase text-right w-[120px]">Net Total</th>
//                         <th className="py-3 px-4 text-xs font-bold uppercase text-right w-[100px]">PP Cost</th>
//                     </tr>
//                 </thead>
//                 <tbody className="text-sm">
//                     {/* CRITICAL CHANGE: Use processedDayPlans (includes ghosts) instead of rawDayPlans */}
//                     {processedDayPlans.map((day) => {
//                         const locationTitle = day.city || "Unknown Location";
//                         const hasItems = (day.stays?.length || 0) + (day.transports?.length || 0) + (day.activities?.length || 0) + (day.meals?.length || 0) > 0;

//                         return (
//                             <React.Fragment key={day.dayNumber}>
//                                 <tr className="bg-gray-100 border-b border-gray-400 cell-2 ">
//                                     <td colSpan={5} className="py-2 px-4">
//                                         <div className="flex items-center gap-2 text-gray-700 font-bold">
//                                             <Calendar size={14} className="text-blue-500"/>
//                                             <span>DAY {day.dayNumber} - {locationTitle}</span>
//                                         </div>
//                                     </td>
//                                 </tr>

//                                 {!hasItems && (
//                                     <tr><td colSpan={5} className="p-4 text-center text-gray-400 italic text-xs">No items added.</td></tr>
//                                 )}

//                                 {/* STAYS */}
//                                 {(day.stays || []).map((s: any, i: number) => {
//                                     const rows = getStayRows(s);
                                    
//                                     return rows.map((row, idx) => (
//                                         <LedgerRow 
//                                           key={`s-${i}-${idx}`} 
//                                           typeLabel="Stay"
//                                           typeColor={s.isGhost ? "text-gray-400" : "text-gray-900"}
//                                           details={row.details}
//                                           inclusionType={s.inclusionType}
//                                           // CRITICAL CHANGE: If it's a ghost, force "Continuing Stay" string
//                                           config={s.isGhost ? "Continuing Stay" : row.config}
//                                           rawCost={row.rawCost}
//                                           overridePPCost={row.ppCost} 
//                                           travelerCount={travelerCount}
//                                           currency={currency}
//                                           convert={convert}
//                                           formatPrice={formatPrice}
//                                           isGhost={s.isGhost}
//                                           rowSpan={idx === 0 ? rows.length : 1}
//                                           isSubRow={idx > 0} 
//                                       />
//                                     ));
//                                 })}

//                                 {/* TRANSPORT */}
//                                 {(day.transports || []).map((t, i) => {
//                                     const rawCost = safeNum(t.price) * safeNum(t.vehicleCount);
//                                     return (
//                                       <LedgerRow 
//                                           key={`t-${i}`} 
//                                           typeLabel="Transport"
//                                           typeColor="text-gray-900"
//                                           details={t.vehicleType}
//                                           inclusionType={t.inclusionType}
//                                           config={`${t.vehicleCount} Vehicles`}
//                                           rawCost={rawCost}
//                                           travelerCount={travelerCount}
//                                           currency={currency}
//                                           convert={convert}
//                                           formatPrice={formatPrice}
//                                       />
//                                     );
//                                 })}
                                
//                                 {/* ACTIVITIES */}
//                                 {(day.activities || []).map((a, i) => {
//                                     const guideCost = a.guideType === 'guided' ? safeNum(a.guideFee) : 0;
//                                     const rawCost = ((safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * travelerCount) + guideCost;
//                                     return (
//                                       <LedgerRow 
//                                           key={`a-${i}`} 
//                                           typeLabel="Activity"
//                                           typeColor="text-gray-900"
//                                           details={a.heading}
//                                           inclusionType={a.inclusionType}
//                                           config={`${travelerCount} Pax • ${a.guideType}`}
//                                           rawCost={rawCost}
//                                           travelerCount={travelerCount}
//                                           currency={currency}
//                                           convert={convert}
//                                           formatPrice={formatPrice}
//                                       />
//                                     );
//                                 })}

//                                 {/* MEALS */}
//                                 {(day.meals || []).map((m, i) => {
//                                     const rawCost = safeNum(m.adultCost) * travelerCount;
//                                     return (
//                                       <LedgerRow 
//                                           key={`m-${i}`} 
//                                           typeLabel="Meal"
//                                           typeColor="text-gray-900"
//                                           details={m.restaurantName}
//                                           inclusionType={m.inclusionType}
//                                           config={`${travelerCount} Pax • ${m.mealType}`}
//                                           rawCost={rawCost}
//                                           travelerCount={travelerCount}
//                                           currency={currency}
//                                           convert={convert}
//                                           formatPrice={formatPrice}
//                                       />
//                                     );
//                                 })}
//                             </React.Fragment>
//                         );
//                     })}
//                 </tbody>
//               </table>
//             </div>
//         </div>


        

//         {/* ================= RIGHT: CALCULATOR ================= */}
//         <div className="w-full xl:w-[400px] shrink-0 sticky top-24 flex flex-col gap-4">
//             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-300 flex items-center justify-between">
//                 <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Currency</div>
//                 <select 
//                     value={currency} 
//                     onChange={(e) => handleCurrencyChange(e.target.value)}
//                     className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold"
//                 >
//                     {rates && Object.keys(rates).map(r => <option key={r} value={r}>{r}</option>)}
//                 </select>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
//                 <div className="bg-gray-900 text-white px-5 py-4 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                         <Calculator size={18} className="text-green-400"/>
//                         <span className="font-bold tracking-wide text-sm">Quote Calculator</span>
//                     </div>
//                 </div>

//                 <div className="p-5 space-y-5">
//                     <div className="flex justify-between items-center text-sm">
//                         <span className="text-gray-500 font-medium">Total Net Cost (Included Only)</span>
//                         <span className="font-mono font-bold text-gray-800 text-lg">
//                             {formatPrice(netInSelected, currency)}
//                         </span>
//                     </div>

//                     <div className="grid grid-cols-1 gap-4">
//                         <div className="space-y-1">
//                             <label className="text-[10px] font-bold text-gray-400 uppercase">Markup %</label>
//                             <input type="number" value={markupPercent} onChange={(e) => handleMarkupChange(parseFloat(e.target.value) || 0)} className="w-full p-2 border border-gray-300 rounded-lg font-bold text-gray-800 text-sm"/>
//                         </div>
//                     </div>

//                     <div className="border-t border-gray-100"></div>

//                      <div className="space-y-3"> 
//                         <div className="flex items-center gap-2 text-purple-600">
//                             <Sparkles size={14} fill="currentColor" className="text-purple-200"/>
//                             <span className="text-xs font-bold uppercase tracking-wide">Pricing Strategy</span>
//                         </div>
//                         <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-lg">
//                             {['none', '5', '10', '100'].map((mode) => (
//                                 <button 
//                                   key={mode} 
//                                   onClick={() => handleRoundingChange(mode)} 
//                                   className={`text-[10px] font-bold py-1.5 rounded-md ${roundingMode === mode ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-400'}`}
//                                 >
//                                     {mode === 'none' ? 'Exact' : `+${mode}`}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-xl shadow-inner text-white space-y-4">
//                          <div className="flex justify-between items-start">
//                             <div>
//                                 <div className="text-blue-200 font-bold text-xs uppercase mb-1">Selling Price / Per Person</div>
//                                 <div className="font-mono font-black text-3xl tracking-tight">{formatPrice(finalPerPerson, currency)}</div>
//                             </div>
//                             <User size={24} className="text-blue-400/50" />
//                         </div>
//                         <div className="pt-3 border-t border-blue-500/30 flex justify-between items-center">
//                             <span className="text-blue-200 font-medium text-xs">Total Group Value ({travelerCount} Pax)</span>
//                             <span className="font-mono font-bold text-lg text-white">{formatPrice(finalGrandTotal, currency)}</span>
//                         </div>

                        
//                     </div>
//                        <div className="bg-gray-50 px-5 py-4 border-t border-gray-200 grid grid-cols-2 gap-3">
//                      <button onClick={handleDownloadExcel} className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded-lg text-xs shadow-sm"><Download size={14}/> Excel</button>
//                      <button onClick={handleDownloadPDF}  className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded-lg text-xs shadow-sm"><Printer size={14}/> PDF</button>
//                      <button onClick={handleSaveQuote} className="col-span-2 flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3 rounded-lg text-sm shadow-md"><Save size={16}/> Save Quote</button>
//                  </div>
//                 </div>
//             </div> 
//         </div>
//       </main>
//     </div>
//   );
// }

// // --- ROW RENDERER ---
// const LedgerRow = ({ 
//     typeLabel, typeColor, details, inclusionType, config, 
//     rawCost, currency, convert, formatPrice, isGhost, travelerCount,
//     overridePPCost,
//     rowSpan = 1,
//     isSubRow = false
// }: any) => {
    
//     const isIncluded = isItemIncluded(inclusionType);
//     const isOptional = inclusionType?.toLowerCase() === 'optional';
    
//     // Total Cost
//     const finalCost = (isIncluded && !isGhost) ? convert(rawCost, currency) : 0;
    
//     // Per Person Cost
//     let ppCost = 0;
//     if (overridePPCost !== undefined) {
//         ppCost = (isIncluded && !isGhost) ? convert(overridePPCost, currency) : 0;
//     } else {
//         ppCost = (travelerCount > 0) ? finalCost / travelerCount : 0;
//     }

//     let rowClass = "border-b border-gray-100 transition-colors odd:bg-white even:bg-gray-50/50";
//     let textClass = "font-medium text-sm block text-gray-800";
//     let costClass = "font-mono text-sm font-medium text-gray-500";
    
//     if (isGhost) {
//         rowClass += " bg-gray-50/80";
//         textClass = "font-medium text-sm block text-gray-500";
//         costClass = "font-mono text-sm font-medium text-gray-400";
//     } else if (!isIncluded) {
//         rowClass += " opacity-60 bg-red-50/20";
//         textClass = "font-medium text-sm block text-gray-500 italic";
//         costClass = "font-mono text-sm font-medium text-gray-400 line-through decoration-gray-300";
//     }

//     const displayStatus = inclusionType ? inclusionType.toUpperCase() : "INCLUDED";

//     return (
//         <tr className={rowClass}>
//             {!isSubRow && (
//                 <td 
//                     rowSpan={rowSpan} 
//                     className="py-3 px-4 align-top w-[90px] border-r border-gray-100/50" 
//                 >
//                      <span className={`text-[11px] font-bold uppercase tracking-wider ${typeColor || "text-gray-500"}`}>
//                         {typeLabel}
//                     </span>
//                 </td>
//             )}

//             <td className="py-3 px-4 align-top">
//                 <span className={textClass}>
//                     {details} 
//                     {!isIncluded && <span className={`ml-2 text-[10px] uppercase font-bold border px-1.5 rounded ${isOptional ? 'text-blue-500 border-blue-200' : 'text-red-500 border-red-200'}`}>({displayStatus})</span>}
//                     {isGhost && <span className="ml-2 text-[10px] font-bold text-gray-400 border border-gray-200 px-1.5 rounded bg-white">CONTINUING</span>}
//                 </span>
//             </td>
//             <td className="py-3 px-4 align-top">
//                 <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded inline-block whitespace-nowrap">
//                    {config}
//                 </span>
//             </td>
           
//             <td className="py-3 px-4 align-top text-right">
//                 <span className={costClass}>
//                     {formatPrice(finalCost, currency)}
//                 </span>
//             </td>
//               <td className="py-3 px-4 align-top text-right">
//                 <span className={costClass}>
//                     {formatPrice(ppCost, currency)}
//                 </span>
//             </td>
//         </tr>
//     );
// }; 













// "use client";

// import React, { useState, useEffect, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Calculator, Download, FileText, 
//   ArrowLeft, Calendar, Sparkles, User, Printer, Save, 
//   Plus, Trash2, Check, DollarSign, Briefcase,
//   CheckCircle2,
//   XCircle,
//   Unlock,
//   ThumbsDown,
//   AlertOctagon,
//   ThumbsUp
// } from 'lucide-react';
// import { useUser } from '@/app/context/UserContext';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable'; // <--- THIS WAS MISSING OR BROKEN
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

// // Helper to determine share type label
// const getShareLabel = (pax: number) => {
//   if (pax === 1) return "Single";
//   if (pax === 2) return "Twin/Double";
//   if (pax === 3) return "Triple";
//   if (pax === 4) return "Quad";
//   return `${pax}-Pax`;
// };

// export default function CostingPage() {
//   const router = useRouter();
//   const { user } = useUser();
//   const { itineraryData, updateItineraryData, saveItinerary , approveCosting , rejectCosting , revertToPending ,  requestReEdit  } = useItinerary();
//   const { suppliers } = useSRM();
  
//   const rawDayPlans = (itineraryData?.dayWiseActivities || []) as DayPlan[];
//   const travelerCount = safeNum(itineraryData?.numberOfTravelers) || 1;
//   const { currency, setCurrency, convert, formatPrice, rates, loading } = useCurrency('USD');

//   // --- STATE ---
//   const [markupPercent, setMarkupPercent] = useState<number>(20);
//   const [roundingMode, setRoundingMode] = useState<string>('none'); 
//   const [fixedDepartures, setFixedDepartures] = useState<FixedDeparture[]>([]);


//   const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
//   const [selectedMonth, setSelectedMonth] = useState<string>('JAN');
  
  
//   // SECURITY GUARD
//   useEffect(() => {
//     if (user?.role !== 'admin') {
//        alert("Access Denied: Only Admins can access Costing.");
//        router.push('/dashboard/itinerary/create-day'); // Send back
//     }
//   }, [user, router]);

//   // If checking or not admin, show nothing or loading
//   if (!user || user.role !== 'admin') {
//       return (
//         <div className="h-full flex flex-col items-center justify-center text-gray-500">
//            <p className="mb-2">Verifying Permissions...</p>
//         </div>
//       );
//   }

//   // SYNC STATE
//   useEffect(() => {
//     if (itineraryData.selectedCurrency && itineraryData.selectedCurrency !== currency) {
//         setCurrency(itineraryData.selectedCurrency);
//     }
//     if (itineraryData.markupPercentage !== undefined) setMarkupPercent(itineraryData.markupPercentage);
//     if (itineraryData.roundingMode) setRoundingMode(itineraryData.roundingMode);
//     if (itineraryData.fixedDepartures) setFixedDepartures(itineraryData.fixedDepartures);
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

//   // --- DATA PROCESSING ---
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

//   // --- VENDOR BREAKDOWN ---
//   const vendorBreakdown = useMemo(() => {
//      const breakdown: Record<string, number> = {};
//      let total = 0;

//      const addToVendor = (id: string | undefined, amount: number) => {
//          const name = getVendorName(id);
//          breakdown[name] = (breakdown[name] || 0) + amount;
//          total += amount;
//      };

//      rawDayPlans.forEach(day => {
//         day.stays?.forEach(s => {
//              if(isItemIncluded(s.inclusionType)) 
//                 addToVendor(s.linkedSupplierId, safeNum(s.costPerNight) * safeNum(s.numRooms) * safeNum(s.nights));
//         });
//         day.transports?.forEach(t => {
//              if(isItemIncluded(t.inclusionType))
//                 addToVendor(t.linkedSupplierId, safeNum(t.price) * safeNum(t.vehicleCount));
//         });
//         day.activities?.forEach(a => {
//              if(isItemIncluded(a.inclusionType)) {
//                  const guideCost = a.guideType === 'guided' ? safeNum(a.guideFee) : 0;
//                  addToVendor(a.linkedSupplierId, ((safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * travelerCount) + guideCost);
//              }
//         });
//         day.meals?.forEach(m => {
//             if (isItemIncluded(m.inclusionType)) {
//                 const adults = typeof m.paxAdult === 'number' ? m.paxAdult : travelerCount;
//                 const children = typeof m.paxChild === 'number' ? m.paxChild : 0;
//                 addToVendor(m.linkedSupplierId, (safeNum(m.adultCost) * adults) + (safeNum(m.childCost) * children));
//             }
//         });
//      });

//      return { breakdown, total };
//   }, [rawDayPlans, travelerCount, suppliers]);

//   // --- STAY ROWS HELPER ---
//   const getStayRows = (stay: any) => {
//       if (!stay.roomOccupancy || stay.roomOccupancy.length === 0) {
//           const rawCost = safeNum(stay.costPerNight) * safeNum(stay.numRooms) * safeNum(stay.nights);
//           return [{ details: stay.hotelName, config: `${stay.numRooms} Room(s) x ${stay.nights} Nights`, rawCost: rawCost, ppCost: rawCost / travelerCount }];
//       }
//       const groups: Record<number, number> = {};
//       stay.roomOccupancy.forEach((pax: number) => groups[pax] = (groups[pax] || 0) + 1);
//       return Object.entries(groups).map(([paxStr, roomCount]) => {
//           const pax = parseInt(paxStr);
//           const totalCostForGroup = safeNum(stay.costPerNight) * roomCount * safeNum(stay.nights);
//           const ppCost = (safeNum(stay.costPerNight) * safeNum(stay.nights)) / pax;
//           return { details: `${stay.hotelName} (${getShareLabel(pax)} Share)`, config: `${roomCount} Room(s) x ${pax} Pax x ${stay.nights} Nights`, rawCost: totalCostForGroup, ppCost: ppCost };
//       });
//   };

//   // --- PRICING LOGIC ---
//   const netInSelected = convert(vendorBreakdown.total, currency);
//   const activeFixedDeparture = fixedDepartures.find(d => d.isSelected);
  
//   let finalPerPerson = 0;
//   let finalGrandTotal = 0;
//   let displayMarkupPercent = markupPercent;
//   let displayMarkupAmount = 0;
//   let calculatedMarkupAmount = 0; // Separate var for PDF usage

//   if (activeFixedDeparture) {
//     finalPerPerson = activeFixedDeparture.price;
//     finalGrandTotal = finalPerPerson * travelerCount;
//     displayMarkupAmount = finalGrandTotal - netInSelected;
//     calculatedMarkupAmount = displayMarkupAmount;
//     if (netInSelected > 0) displayMarkupPercent = (displayMarkupAmount / netInSelected) * 100;
//   } else {
//     const markupAmount = netInSelected * (markupPercent / 100);
//     calculatedMarkupAmount = markupAmount;
//     const exactGrandTotal = netInSelected + markupAmount;
//     const exactPerPerson = travelerCount > 0 ? exactGrandTotal / travelerCount : 0;
    
//     finalPerPerson = exactPerPerson;
//     if (roundingMode === '5') finalPerPerson = Math.ceil(exactPerPerson / 5) * 5;
//     else if (roundingMode === '10') finalPerPerson = Math.ceil(exactPerPerson / 10) * 10;
//     else if (roundingMode === '100') finalPerPerson = Math.ceil(exactPerPerson / 100) * 100;

//     finalGrandTotal = finalPerPerson * travelerCount;
//     displayMarkupAmount = finalGrandTotal - netInSelected;
//   }


//   // --- EXCEL DOWNLOAD HANDLER ---
//     const handleDownloadExcel = () => { };


// // --- PDF DOWNLOAD HANDLER ---
//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.width;
    
//     // Add your Base64 Logo string here if needed
    

//      const logoBase64 = "data:image/png;base64,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";
  

//     const cleanPrice = (amount: number) => formatPrice(amount, currency);

//     // 1. Header Background
//     doc.setFillColor(245, 245, 220); 
//     doc.rect(0, 0, pageWidth, 5, 'F');

//     // 2. Logo Logic
//     if (logoBase64 && logoBase64.length > 100) {
//         try {
//             const cleanBase64 = logoBase64
//                 .replace(/^data:image\/(png|jpg|jpeg);base64,/, "")
//                 .replace(/\s/g, ""); 

//             doc.addImage(cleanBase64, 'PNG', 14, 8, 50, 10); 
//         } catch (e) {
//             console.error("Logo Error:", e);
//             doc.setTextColor(0, 0, 0); doc.setFontSize(22); doc.text("TRAVDEK", 14, 20);
//         }
//     } else {
//         doc.setTextColor(0, 0, 0); doc.setFontSize(22); doc.setFont("helvetica", "bold");
//         doc.text("TRAVDEK", 14, 20);
//     }

//     // 3. Trip Metadata
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(14);
//     doc.text(`Quotation For: ${itineraryData.tripName || 'New Trip'}`, 14, 30);
    
//     doc.setFontSize(10);
//     doc.setTextColor(100, 100, 100);
//     doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 14, 36);
//     doc.text(`Travelers: ${travelerCount}`, 14, 41);
//     doc.text(`Currency: ${currency}`, 14, 46);

//     // 4. Build Table Rows
//     const tableBody: any[] = [];

//     processedDayPlans.forEach(day => {
//         const locationTitle = day.city || "";
        
//         // Day Header Row
//         tableBody.push([{ content: `DAY ${day.dayNumber} - ${locationTitle.toUpperCase()}`, colSpan: 6, styles: { fillColor: [240, 240, 240], fontStyle: 'bold', textColor: [50, 50, 50] } }]);

//         // Helper to add standard rows
//         const addRow = (cat: string, name: string, status: string | undefined, config: string, rawTotalCost: number, isGhost: boolean = false, overridePPCost?: number, showCategoryLabel: boolean = true) => {
//             const isIncluded = isItemIncluded(status);
            
//             // Calculate Final Costs
//             const cost = (isIncluded && !isGhost) ? convert(rawTotalCost, currency) : 0;
            
//             let ppCost = 0;
//             if (overridePPCost !== undefined) {
//                ppCost = (isIncluded && !isGhost) ? convert(overridePPCost, currency) : 0;
//             } else {
//                // Fallback: If no specific divisor, divide total by global travelers
//                ppCost = travelerCount > 0 ? cost / travelerCount : 0;
//             }
            
//             let displayConfig = config;
//             if(isGhost) displayConfig = "Continuing Stay"; 

//             const displayStatus = status ? status.toUpperCase() : "INCLUDED";
//             const categoryCell = showCategoryLabel ? cat : "";

//             tableBody.push([
//                 categoryCell, 
//                 name + (!isIncluded ? ` (${displayStatus})` : ''), 
//                 displayStatus, 
//                 displayConfig, 
//                 cleanPrice(ppCost), 
//                 cleanPrice(cost)    
//             ]);
//         };

//         // --- A. STAYS ---
//         if(day.stays) {
//             day.stays.forEach((s: any) => {
//                 const splitRows = getStayRows(s);
//                 splitRows.forEach((row, idx) => {
//                     addRow('Stay', row.details, s.inclusionType, row.config, row.rawCost, s.isGhost, row.ppCost, idx === 0);
//                 });
//             });
//         }

//         // --- B. TRANSPORTS (Updated Logic) ---
//         if(day.transports) {
//             day.transports.forEach((t: any) => {
//                 const isTicket = ['flight', 'rail', 'ferry'].includes(t.mode);
                
//                 // Cost Logic: Tickets * Pax  OR  Vehicles * Price
//                 const rawTotal = isTicket 
//                     ? (safeNum(t.price) * (t.paxCount || 1))
//                     : (safeNum(t.price) * (t.vehicleCount || 1));

//                 // Divisor for Per Person calculation
//                 const divisor = t.paxCount || travelerCount;
//                 const ppRaw = rawTotal / divisor;

//                 // Config String
//                 const configStr = isTicket 
//                     ? `${t.paxCount || 1} Tix` 
//                     : `${t.vehicleCount || 1} Veh x ${t.paxCount || 1} Pax`;

//                 addRow('Transport', t.vehicleType, t.inclusionType, configStr, rawTotal, false, ppRaw);
//             });
//         }

//         // --- C. ACTIVITIES (Updated Logic) ---
//         if(day.activities) {
//             day.activities.forEach((a: any) => {
//                 const pax = a.paxCount || travelerCount;
                
//                 const variableCost = (safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * pax;
//                 const fixedCost = a.guideType === 'guided' ? safeNum(a.guideFee) : 0;
                
//                 const rawTotal = variableCost + fixedCost;
//                 const ppRaw = rawTotal / pax; // Specific PP calculation

//                 addRow('Activity', a.heading, a.inclusionType, `${pax} Pax`, rawTotal, false, ppRaw);
//             });
//         }

//         // --- D. MEALS ---
//         if(day.meals) {
//             day.meals.forEach((m: any) => {
//                 const adults = typeof m.paxAdult === 'number' ? m.paxAdult : travelerCount;
//                 const children = typeof m.paxChild === 'number' ? m.paxChild : 0;
                
//                 const rawTotal = (safeNum(m.adultCost) * adults) + (safeNum(m.childCost) * children);
//                 const totalPax = adults + children;
//                 const ppRaw = totalPax > 0 ? rawTotal / totalPax : 0;

//                 addRow('Meal', m.restaurantName, m.inclusionType, m.mealType, rawTotal, false, ppRaw);
//             });
//         }
//     });

//     // 5. Generate Table
//     autoTable(doc, {
//       startY: 55, 
//       head: [['Category', 'Details', 'Status', 'Config', 'PP Cost', 'Net Cost']],
//       body: tableBody,
//       theme: 'grid',
//       styles: { fontSize: 8, cellPadding: 3 },
//       columnStyles: { 
//           4: { halign: 'right' },
//           5: { halign: 'right' } 
//       }
//     });

//     // 6. Totals Section
//     // @ts-ignore
//     const finalY = doc.lastAutoTable.finalY + 10;
//     if (finalY > 240) doc.addPage();
//     doc.setDrawColor(200, 200, 200);
//     doc.line(100, finalY, 196, finalY);

//     let currentY = finalY + 8;
//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");
//     doc.setTextColor(100, 100, 100); 
//     doc.text("Net Amount:", 150, currentY, { align: "right" });
//     doc.setTextColor(0, 0, 0); 
//     doc.text(cleanPrice(netInSelected), 190, currentY, { align: "right" });

//     // --- [NEW: NET PER PERSON (Before Markup)] ---
//     currentY += 5; // Add small spacing
//     const netPerPerson = travelerCount > 0 ? netInSelected / travelerCount : 0;
    
//     doc.setFontSize(9); // Slightly smaller font to distinguish
//     doc.setTextColor(120, 120, 120); // Lighter gray
//     doc.text(`Net Per Person (${travelerCount} Pax):`, 150, currentY, { align: "right" });
    
//     doc.setTextColor(0, 0, 0); // Darker gray for value
//     doc.text(cleanPrice(netPerPerson), 190, currentY, { align: "right" });
//     // ---------------------------------------------

//     currentY += 6;
//     doc.setTextColor(100, 100, 100);
//     doc.text(`Markup (${markupPercent}%):`, 150, currentY, { align: "right" });
//     doc.setTextColor(0, 0, 0);
//     // Calculated markup variable from your main component scope
//     doc.text(cleanPrice(calculatedMarkupAmount), 190, currentY, { align: "right" });

//     currentY += 4;
//     doc.setDrawColor(220, 220, 220);
//     doc.line(140, currentY, 196, currentY);
//     currentY += 6;

//     doc.setFontSize(11);
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(0, 0, 0);
//     doc.text("Total Group Cost:", 150, currentY, { align: "right" });
//     doc.setFont("courier", "bold"); 
//     doc.text(cleanPrice(finalGrandTotal), 190, currentY, { align: "right" });

//     currentY += 8;
//     doc.setFillColor(240, 248, 255); 
//     doc.rect(110, currentY - 5, 90, 10, 'F');
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(0, 100, 0); 
//     doc.text("Price Per Person:", 150, currentY, { align: "right" });
//     doc.setFontSize(12);
//     doc.text(cleanPrice(finalPerPerson), 190, currentY, { align: "right" });

//     doc.save(`Quote_${itineraryData.tripId || 'Travdek'}.pdf`);
//   };

//    const handleSaveQuote = async () => { await saveItinerary('quick'); alert("Quote saved!"); };



//   // --- FIXED DEPARTURE HANDLERS ---
//   const addDepartureRow = () => { 
//     const newRow: FixedDeparture = { id: Date.now().toString(), date: '', label: '', price: 0, status: 'Open', isSelected: false };
//     const updated = [...fixedDepartures, newRow]; setFixedDepartures(updated); updateItineraryData({ fixedDepartures: updated });
//   };
//   const updateDepartureRow = (id: string, field: keyof FixedDeparture, value: any) => { 
//     const updated = fixedDepartures.map(d => {
//         if (d.id === id) {
//             if (field === 'date') { const dateObj = new Date(value); const label = isNaN(dateObj.getTime()) ? value : dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }); return { ...d, [field]: value, label: label }; }
//             return { ...d, [field]: value };
//         } return d;
//     }); setFixedDepartures(updated); updateItineraryData({ fixedDepartures: updated });
//   };
//   const selectDepartureRow = (id: string) => { 
//     const isCurrentlySelected = fixedDepartures.find(d => d.id === id)?.isSelected;
//     const updated = fixedDepartures.map(d => ({ ...d, isSelected: d.id === id ? !isCurrentlySelected : false }));
//     setFixedDepartures(updated); updateItineraryData({ fixedDepartures: updated, useFixedPrice: !isCurrentlySelected });
//   };
//   const removeDepartureRow = (id: string) => { 
//     const updated = fixedDepartures.filter(d => d.id !== id); setFixedDepartures(updated); updateItineraryData({ fixedDepartures: updated });
//   };

//   if (loading) return <div className="p-10 text-center">Loading Rates...</div>;

//     function handleCurrencyChange(value: string): void {
//         throw new Error('Function not implemented.');
//     }

//     // 👇 ADD HANDLER
//   const handleReject = () => {
//     const reason = prompt("Please enter the reason for requesting changes:");
//     if (reason) {
//       rejectCosting(reason);
//       router.push('/dashboard/itinerary/library'); // Send admin back to library
//     }
//   };

//     function allowReEdit(): void {
//         revertToPending();
//     }

//   return (
//     <div className="bg-gray-50 min-h-screen font-sans text-gray-800">

//         {/* 👇 1. RE-EDIT REQUEST BANNER (Top of page) */}
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
//                <button 
//                   onClick={revertToPending} // Deny: Moves status to pending_costing (effectively ignoring the request to draft)
//                   className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold border border-white/30 flex items-center gap-2"
//                >
//                   <ThumbsDown size={16}/> Deny
//                </button>
//                <button 
//                   onClick={allowReEdit} // Grant: Moves status to draft
//                   className="px-6 py-2 bg-white text-orange-700 hover:bg-gray-100 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2"
//                >
//                   <ThumbsUp size={16}/> Allow (Unlock)
//                </button>
//             </div>
//          </div>
//       )}
      
//       {/* HEADER */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4 flex justify-between items-center shadow-sm">
//         <div>
//            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//              <FileText className="text-blue-600" size={24}/> Quotation Sheet
//            </h1>
//            <p className="text-xs text-gray-500 mt-0.5">Total Days: {rawDayPlans.length} • Travelers: {travelerCount}</p>
//         </div>
//         <div className="flex gap-3">
//              <button onClick={() => router.push('/dashboard/itinerary/create-day')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"><ArrowLeft size={16} /> Edit</button>
// {/*         
//         {user?.role === 'admin' && itineraryData.status === 'pending_costing' && (
//          <button 
//             onClick={approveCosting} 
//             className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 shadow-sm animate-pulse"
//          >
//             <CheckCircle2 size={16} /> Approve & Release
//          </button>
//      )} */}


//      {/* 👇 ADMIN ACTIONS: APPROVE & REJECT */}
//              {user?.role === 'admin' && itineraryData.status === 'pending_costing' && (
//                <>
//                  <button 
//                     onClick={handleReject} 
//                     className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-2"
//                  >
//                     <XCircle size={16} /> Request Changes
//                  </button>

//                  <button 
//                     onClick={approveCosting} 
//                     className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 shadow-sm animate-pulse"
//                  >
//                     <CheckCircle2 size={16} /> Approve & Release
//                  </button>
//                </>
//              )}

//              {user?.role === 'admin' && itineraryData.status === 'approved' && (
//                  <button 
//                     onClick={revertToPending} 
//                     className="px-4 py-2 text-sm font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded-lg flex items-center gap-2 shadow-sm"
//                  >
//                     <Unlock size={16} /> Unlock to Fix
//                  </button>
//              )}
//         </div>
//       </header>

//       <main className="max-w-[1600px] mx-auto p-6 flex flex-col xl:flex-row gap-6 items-start">
        
//         {/* LEFT: LEDGER */}
//         <div className="flex-1 w-full space-y-6">
            
//             <div className="bg-white border border-gray-400 rounded-xl shadow-sm overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                         <thead className="bg-gray-50 text-gray-500 border-b border-gray-400">
//                             <tr>
//                                 <th className="py-3 px-4 text-xs font-bold uppercase w-[80px]">Type</th>
//                                 <th className="py-3 px-4 text-xs font-bold uppercase">Item Details</th>
//                                 <th className="py-3 px-4 text-xs font-bold uppercase w-[120px] text-blue-600">Supplier</th> 
//                                 <th className="py-3 px-4 text-xs font-bold uppercase w-[150px]">Config</th>
//                                 <th className="py-3 px-4 text-xs font-bold uppercase text-right w-[100px]">Net Total</th>
//                                 <th className="py-3 px-4 text-xs font-bold uppercase text-right w-[100px]">PP Cost</th>
//                             </tr>
//                         </thead>
//                         <tbody className="text-sm">
//                             {processedDayPlans.map((day) => {
//                                 const locationTitle = day.city || "Unknown Location";
//                                 const hasItems = (day.stays?.length || 0) + (day.transports?.length || 0) + (day.activities?.length || 0) + (day.meals?.length || 0) > 0;

//                                 return (
//                                     <React.Fragment key={day.dayNumber}>
//                                         <tr className="bg-gray-100 border-b border-gray-400">
//                                             <td colSpan={7} className="py-2 px-4">
//                                                 <div className="flex items-center gap-2 text-gray-700 font-bold">
//                                                     <Calendar size={14} className="text-blue-500"/>
//                                                     <span>DAY {day.dayNumber} - {locationTitle}</span>
//                                                 </div>
//                                             </td>
//                                         </tr>

//                                         {!hasItems && <tr><td colSpan={7} className="p-4 text-center text-gray-400 italic text-xs">No items.</td></tr>}

//                                         {(day.stays || []).map((s: any, i: number) => {
//                                             const rows = getStayRows(s);
//                                             return rows.map((row, idx) => (
//                                                 <LedgerRow 
//                                                     key={`s-${i}-${idx}`} typeLabel="Stay" typeColor={s.isGhost ? "text-gray-400" : "text-gray-900"}
//                                                     details={row.details} inclusionType={s.inclusionType} config={s.isGhost ? "Continuing" : row.config}
//                                                     rawCost={row.rawCost} travelerCount={travelerCount} currency={currency} convert={convert} formatPrice={formatPrice}
//                                                     isGhost={s.isGhost} rowSpan={idx === 0 ? rows.length : 1} isSubRow={idx > 0} 
//                                                     vendorName={getVendorName(s.linkedSupplierId)} overridePPCost={row.ppCost}
//                                                 />
//                                             ));
//                                         })}

                                 


//                                         {/* --- [UPDATED TRANSPORT MAPPING] --- */}
//                                         {(day.transports || []).map((t: any, i: number) => {
//                                             // 1. Identify Mode
//                                             const isTicket = ['flight', 'rail', 'ferry'].includes(t.mode);
                                            
//                                             // 2. Calculate Costs
//                                             // Ticket Mode: Price * Pax
//                                             // Vehicle Mode: Price * Vehicles
//                                             const rawTotal = isTicket 
//                                                 ? (safeNum(t.price) * (t.paxCount || 1))
//                                                 : (safeNum(t.price) * (t.vehicleCount || 1));

//                                             // 3. Calculate Per Person (The logic you requested)
//                                             // For Vehicles: Total / Total Passengers (paxCount)
//                                             // For Tickets: Total / Ticket Count (paxCount) -> equals Price per Ticket
//                                             const divisor = t.paxCount || travelerCount; // Fallback to global if 0
//                                             const ppCost = rawTotal / divisor;

//                                             // 4. Config String
//                                             const configStr = isTicket 
//                                                 ? `${t.paxCount || 1} Tix` 
//                                                 : `${t.vehicleCount || 1} Veh x ${t.paxCount || 1} Pax`;

//                                             return (
//                                                 <LedgerRow 
//                                                     key={`t-${i}`} 
//                                                     typeLabel="Transport" 
//                                                     typeColor="text-gray-900"
//                                                     details={t.vehicleType} 
//                                                     inclusionType={t.inclusionType} 
//                                                     config={configStr}
//                                                     rawCost={rawTotal} 
//                                                     travelerCount={travelerCount} 
//                                                     currency={currency} 
//                                                     convert={convert} 
//                                                     formatPrice={formatPrice}
//                                                     vendorName={getVendorName(t.linkedSupplierId)}
//                                                     // Pass the specific PP cost we calculated
//                                                     overridePPCost={ppCost}
//                                                 />
//                                             );
//                                         })}
                                        
//                                         {/* --- [UPDATED ACTIVITY MAPPING] --- */}
//                                         {(day.activities || []).map((a: any, i: number) => {
//                                             // 1. Get Pax (Local or fallback to Global)
//                                             // Important: If you edited an old activity without saving, it might lack paxCount.
//                                             const pax = a.paxCount || travelerCount;

//                                             // 2. Calculate Costs
//                                             // Variable: (Entrance + Activity) * Pax
//                                             // Fixed: Guide Fee (One time)
//                                             const variableCost = (safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * pax;
//                                             const fixedCost = a.guideType === 'guided' ? safeNum(a.guideFee) : 0;
//                                             const rawTotal = variableCost + fixedCost;

//                                             // 3. Calculate Per Person
//                                             // Total / Participating Pax
//                                             const ppCost = rawTotal / pax;

//                                             return (
//                                                 <LedgerRow 
//                                                     key={`a-${i}`} 
//                                                     typeLabel="Activity" 
//                                                     typeColor="text-gray-900"
//                                                     details={a.heading} 
//                                                     inclusionType={a.inclusionType} 
//                                                     config={`${pax} Pax`}
//                                                     rawCost={rawTotal}
//                                                     travelerCount={travelerCount} 
//                                                     currency={currency} 
//                                                     convert={convert} 
//                                                     formatPrice={formatPrice}
//                                                     vendorName={getVendorName(a.linkedSupplierId)}
//                                                     // Pass the specific PP cost we calculated
//                                                     overridePPCost={ppCost}
//                                                 />
//                                             );
//                                         })}

//                                         {(day.meals || []).map((m: any, i: number) => (
//                                             <LedgerRow 
//                                                 key={`m-${i}`} typeLabel="Meal" typeColor="text-gray-900"
//                                                 details={m.restaurantName} inclusionType={m.inclusionType} config={m.mealType}
//                                                 rawCost={(safeNum(m.adultCost) * (m.paxAdult||travelerCount)) + (safeNum(m.childCost) * (m.paxChild||0))}
//                                                 travelerCount={travelerCount} currency={currency} convert={convert} formatPrice={formatPrice}
//                                                 vendorName={getVendorName(m.linkedSupplierId)}
//                                             />
//                                         ))}
//                                     </React.Fragment>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* FIXED DEPARTURES TABLE */}
//             <div className="bg-white border border-gray-400 rounded-xl shadow-md overflow-hidden p-6">
//                  <div className="flex justify-between items-center mb-4">
//                     <h3 className="font-bold text-gray-800 flex items-center gap-2"><Calendar size={18} className="text-orange-500" />Fixed Departures & Pricing</h3>
//                     <button onClick={addDepartureRow} className="text-sm flex items-center gap-1 bg-blue-50 text-blue-100 px-3 py-1.5 rounded-md font-bold hover:bg-blue-500 transition bg-blue-600"><Plus size={15} /> Add Date</button>
//                  </div>
//                  <div className="overflow-x-auto ">
//                     <table className="w-full text-left text-sm border border-gray-400">
//                         <thead className="bg-gray-200 text-gray-500 uppercase text-xs  border-b border-gray-400">
//                             <tr>
//                                 <th className="py-3 px-4 w-[60px] text-center">Select</th>
//                                 <th className="py-3 px-4 w-[200px]">Date</th>
//                                 <th className="py-3 px-4">Display Label</th>
//                                 <th className="py-3 px-4 w-[150px]">Price (PP)</th>
//                                 <th className="py-3 px-4 w-[120px]">Status</th>
//                                 <th className="py-3 px-4 w-[50px]"></th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-300 border border-gray-400">
//                             {fixedDepartures.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400 italic">No fixed dates added. Click "Add Date" to create packages.</td></tr>}
//                             {fixedDepartures.map((row) => (
//                                 <tr key={row.id} className={row.isSelected ? 'bg-blue-50/60' : 'hover:bg-gray-50'}>
//                                     <td className="py-3 px-4 text-center">
//                                         <button onClick={() => selectDepartureRow(row.id)} className="group focus:outline-none">
//                                             <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 ${row.isSelected ? 'bg-blue-600 border-blue-600 scale-110' : 'bg-white border-gray-300 group-hover:border-gray-400'}`}>
//                                                 {row.isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
//                                             </div>
//                                         </button>
//                                     </td>
//                                     <td className="py-3 px-4"><input type="date" value={row.date} onChange={(e) => updateDepartureRow(row.id, 'date', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-gray-700 focus:border-blue-500 outline-none"/></td>
//                                     <td className="py-3 px-4"><input type="text" value={row.label} onChange={(e) => updateDepartureRow(row.id, 'label', e.target.value)} placeholder="e.g. Fri, Jan 09, 2026" className="w-full border border-gray-300 rounded px-2 py-1.5 text-gray-700 bg-transparent focus:border-blue-500 outline-none"/></td>
//                                     <td className="py-3 px-4">
//                                         <div className="flex items-center gap-2">
//                                             <span className="text-xs font-bold text-gray-500">{currency}</span>
//                                             <input type="number" value={row.price} onChange={(e) => updateDepartureRow(row.id, 'price', parseFloat(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1.5 font-mono font-bold text-gray-800 focus:border-blue-500 outline-none"/>
//                                         </div>
//                                     </td>
//                                     <td className="py-3 px-4">
//                                         <select value={row.status} onChange={(e) => updateDepartureRow(row.id, 'status', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-bold text-gray-600 bg-white">
//                                             <option value="Open">Open</option><option value="Filling Fast">Filling Fast</option><option value="Sold Out">Sold Out</option>
//                                         </select>
//                                     </td>
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

//             {/* VENDOR PAYABLES BOX (New Feature) */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
//                 <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
//                     <h3 className="text-xs font-bold text-gray-700 uppercase flex items-center gap-2"><Briefcase size={14}/> Payables Breakdown</h3>
//                 </div>
//                 <div className="p-4 space-y-2">
//                     {Object.entries(vendorBreakdown.breakdown).map(([name, amount]) => (
//                         <div key={name} className="flex justify-between text-sm">
//                             <span className="text-gray-600 truncate max-w-[200px]">{name}</span>
//                             <span className="font-mono font-bold text-gray-800">{formatPrice(convert(amount, currency), currency)}</span>
//                         </div>
//                     ))}
//                     <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between text-sm font-bold">
//                         <span>Total Net</span>
//                         <span className="text-blue-600">{formatPrice(netInSelected, currency)}</span>
//                     </div>
//                 </div>
//             </div>

//             {/* CALCULATOR */}
//             <div className={`bg-white rounded-xl shadow-lg border ${activeFixedDeparture ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-300'} overflow-hidden transition-all duration-300`}>
//                 <div className={`${activeFixedDeparture ? 'bg-blue-900' : 'bg-gray-900'} text-white px-5 py-4 flex items-center justify-between`}>
//                     <div className="flex items-center gap-2"><Calculator size={18} className="text-green-400"/><span className="font-bold tracking-wide text-sm">{activeFixedDeparture ? 'Fixed Package Calculator' : 'Quote Calculator'}</span></div>
//                     {activeFixedDeparture && <span className="text-[10px] bg-blue-700 px-2 py-0.5 rounded text-white font-medium">FIXED MODE</span>}
//                 </div>

//                 <div className="p-5 space-y-5">
//                     <div className="flex justify-between items-center text-sm">
//                         <span className="text-gray-500 font-medium">Total Net Cost (Included Only)</span>
//                         <span className="font-mono font-bold text-gray-800 text-lg">{formatPrice(netInSelected, currency)}</span>
//                     </div>
//                     <div className="flex justify-between items-center mt-[-10px]">
//                         <span className="text-[10px] uppercase font-bold text-gray-400">Net Per Person ({travelerCount} Pax)</span>
//                         <span className="font-mono text-xs font-bold text-gray-500">{formatPrice(travelerCount > 0 ? netInSelected / travelerCount : 0, currency)}</span>
//                     </div>

//                     <div className="grid grid-cols-1 gap-4">
//                         <div className="space-y-1">
//                             <div className="flex justify-between">
//                                 <label className="text-[10px] font-bold text-gray-400 uppercase">Margin / Markup %</label>
//                                 {activeFixedDeparture && <span className="text-[10px] text-blue-600 font-bold italic">Auto-Adjusted</span>}
//                             </div>
//                             <div className="relative">
//                                 <input type="number" value={activeFixedDeparture ? displayMarkupPercent.toFixed(1) : markupPercent} onChange={(e) => !activeFixedDeparture && handleMarkupChange(parseFloat(e.target.value) || 0)} disabled={!!activeFixedDeparture} className={`w-full p-2 border rounded-lg font-bold text-sm ${activeFixedDeparture ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}/>
//                                 {activeFixedDeparture && <span className="absolute right-3 top-2.5 text-xs text-gray-400">Locked</span>}
//                             </div>
//                         </div>
//                     </div>

//                     <div className="border-t border-gray-100"></div>

//                     <div className={`space-y-3 ${activeFixedDeparture ? 'opacity-50 pointer-events-none' : ''}`}> 
//                         <div className="flex items-center gap-2 text-purple-600">
//                             <Sparkles size={14} fill="currentColor" className="text-purple-200"/>
//                             <span className="text-xs font-bold uppercase tracking-wide">Pricing Strategy</span>
//                         </div>
//                         <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-lg">
//                             {['none', '5', '10', '100'].map((mode) => (
//                                 <button key={mode} onClick={() => handleRoundingChange(mode)} className={`text-[10px] font-bold py-1.5 rounded-md ${roundingMode === mode ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-400'}`}>{mode === 'none' ? 'Exact' : `+${mode}`}</button>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-xl shadow-inner text-white space-y-4 relative overflow-hidden">
//                         {activeFixedDeparture && <div className="absolute top-0 right-0 p-2 opacity-10"><Calendar size={100} /></div>}
//                          <div className="flex justify-between items-start relative z-10">
//                             <div>
//                                 <div className="text-blue-200 font-bold text-xs uppercase mb-1">{activeFixedDeparture ? 'Fixed Package Price' : 'Selling Price / Per Person'}</div>
//                                 <div className="font-mono font-black text-3xl tracking-tight">{formatPrice(finalPerPerson, currency)}</div>
//                                 {activeFixedDeparture && <div className="text-[10px] text-blue-200 mt-1">Date: {activeFixedDeparture.label}</div>}
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

// const LedgerRow = ({ 
//     typeLabel, typeColor, details, inclusionType, config, 
//     rawCost, currency, convert, formatPrice, isGhost, vendorName,
//     travelerCount, overridePPCost, 
//     rowSpan = 1, isSubRow = false
// }: any) => {
//     const isIncluded = isItemIncluded(inclusionType);
//     const finalCost = (isIncluded && !isGhost) ? convert(rawCost, currency) : 0;
    
//     let ppCost = 0;
//     if (overridePPCost !== undefined) {
//         ppCost = (isIncluded && !isGhost) ? convert(overridePPCost, currency) : 0;
//     } else {
//         ppCost = (travelerCount > 0) ? finalCost / travelerCount : 0;
//     }

//     let rowClass = "transition-colors odd:bg-white even:bg-gray-50/50 border-b border-gray-200";
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
//             <td className="py-3 px-4 align-top">
//                 <span className="font-medium text-sm block text-gray-800">
//                     {details} 
//                     {!isIncluded && <span className="ml-2 text-[10px] uppercase font-bold text-red-500">({inclusionType})</span>}
//                 </span>
//             </td>
            
//             <td className="py-3 px-4 align-top">
//                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded truncate max-w-[100px] block">
//                     {vendorName}
//                  </span>
//             </td>

//             <td className="py-3 px-4 align-top">
//                 <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded inline-block whitespace-nowrap">
//                    {config}
//                 </span>
//             </td>

//             <td className="py-3 px-4 align-top text-right">
//                 <span className="font-mono text-sm font-medium text-gray-700">
//                     {formatPrice(finalCost, currency)}
//                 </span>
//             </td>

//             <td className="py-3 px-4 align-top text-right border-l border-gray-100">
//                 <span className="font-mono text-xs font-bold text-gray-500">
//                     {formatPrice(ppCost, currency)}
//                 </span>
//             </td>
//         </tr>
//     );
// }; 



















































































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

import React, { useState, useEffect, useMemo } from 'react';
import { saveItineraryToStorage } from '@/utils/itineraryStorage';
import { useRouter } from 'next/navigation';
import { 
  Calculator, Download, FileText, 
  ArrowLeft, Calendar, Sparkles, User, Printer, Save, 
  Plus, Trash2, Check, Briefcase,
  CheckCircle2, XCircle, Unlock, ThumbsDown, AlertOctagon, ThumbsUp,
  Clock // Icons
} from 'lucide-react';
import { useUser } from '@/app/context/UserContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { useItinerary } from '@/app/context/ItineraryContext'; 
import { useSRM } from '@/app/context/SRMContext'; 
import { useCurrency } from '@/hooks/useCurrency';
import { DayPlan } from '../create-day/constants/daywiseConstants';
import { FixedDeparture } from '@/utils/itineraryStorage';

// --- HELPERS ---
const isItemIncluded = (status?: string) => !status || status.toLowerCase() === 'included';
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
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
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
    itemId, typeLabel, typeColor, details, inclusionType, config, 
    manualNetTotal, onCostChange, divisor, 
    currency, formatPrice, isGhost, vendorName,
    rowSpan = 1, isSubRow = false,
    isEmployeeView = false // 👈 NEW PROP
}: any) => {
    const isIncluded = isItemIncluded(inclusionType);
    const ppCost = (divisor > 0 && isIncluded) ? (manualNetTotal / divisor) : 0;

    let rowClass = "border-b border-gray-200 hover:bg-blue-50/30 transition-colors";
    if (isGhost) rowClass += " bg-gray-50/80 text-gray-400";
    else if (!isIncluded) rowClass += " opacity-60 bg-red-50/20";

    return (
        <tr className={rowClass}>
            {!isSubRow && (
                <td rowSpan={rowSpan} className="py-3 px-4 align-top w-[90px] border-r border-gray-300">
                     <span className={`text-[11px] font-bold uppercase tracking-wider ${typeColor || "text-gray-500"}`}>
                        {typeLabel}
                    </span>
                </td>
            )}
            <td className="py-3 px-4 align-middle">
                <span className="font-medium text-sm block text-gray-800">
                    {details} 
                    {!isIncluded && <span className="ml-2 text-[10px] uppercase font-bold text-red-500">({inclusionType})</span>}
                </span>
            </td>
            
            {/* 👇 HIDE SUPPLIER FOR EMPLOYEE */}
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

            {/* 👇 HIDE NET TOTAL FOR EMPLOYEE & MAKE READ-ONLY */}
            {isEmployeeView ? (
                <td className="py-3 px-4 align-middle text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded">
                        Included
                    </span>
                </td>
            ) : (
                <td className="py-3 px-4 align-middle text-right">
                    {!isGhost ? (
                        <div className="flex items-center justify-end gap-1">
                            <span className="text-xs font-bold text-gray-400">{currency}</span>
                            <input 
                                type="number" 
                                min="0"
                                value={manualNetTotal === 0 ? '' : manualNetTotal} 
                                onChange={(e) => onCostChange(itemId, parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                className="w-24 p-1.5 text-right font-bold text-gray-900 border border-blue-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                            />
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400 italic">Included</span>
                    )}
                </td>
            )}

            {/* 👇 HIDE PP COST FOR EMPLOYEE */}
            {!isEmployeeView && (
                <td className="py-3 px-4 align-middle text-right border-l border-gray-100 bg-gray-50/50">
                    {!isGhost && (
                        <>
                            <span className="font-mono text-xs font-bold text-blue-600">
                                {formatPrice(ppCost, currency)}
                            </span>
                            <div className="text-[9px] text-gray-400">/ person</div>
                        </>
                    )}
                </td>
            )}
        </tr>
    );
};



export default function CostingPage() {
  const router = useRouter();
  const { user } = useUser();
  const { 
    itineraryData, updateItineraryData, saveItinerary, 
    approveCosting, rejectCosting, revertToPending, allowReEdit 
  } = useItinerary();
  const { suppliers } = useSRM();
  
  const rawDayPlans = (itineraryData?.dayWiseActivities || []) as DayPlan[];
  const travelerCount = safeNum(itineraryData?.numberOfTravelers) || 1;
  const { currency, setCurrency, convert, formatPrice, loading, rates } = useCurrency('USD');

  // --- STATE ---
  const [markupPercent, setMarkupPercent] = useState<number>(20);
  const [agentMargin, setAgentMargin] = useState<number>(10);
  const [roundingMode, setRoundingMode] = useState<string>('none'); 
  const [fixedDepartures, setFixedDepartures] = useState<FixedDeparture[]>([]);
  const [selectedDepartureId, setSelectedDepartureId] = useState<string | null>(null);

  // MONTHLY MATRIX
  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
      if ((itineraryData as any).simulationDate) {
          const d = new Date((itineraryData as any).simulationDate);
          if (!isNaN(d.getTime())) return MONTHS[d.getMonth()];
      }
      return 'JAN';
  });
  
  // DATE STATE
  const [seasonStart, setSeasonStart] = useState<string>(''); 
  const [seasonEnd, setSeasonEnd] = useState<string>('');     
  const [simulationDate, setSimulationDate] = useState<string>(''); 

  const [pricingMatrix, setPricingMatrix] = useState<Record<string, Record<string, number>>>(
    itineraryData.pricingMatrix || {}
  );

  // --- 1. CORE HELPER FUNCTIONS (Must be defined here, NOT inside loops) ---
  const getCost = (itemId: string | number) => pricingMatrix[selectedMonth]?.[itemId.toString()] || 0;

  const getVendorName = (id?: string) => {
     if (!id) return '-';
     const sup = suppliers.find(s => s.id === id);
     return sup ? sup.name : 'Unknown';
  };

  const handleManualCostChange = (itemId: string | number, value: number) => {
    const updatedMatrix = {
      ...pricingMatrix,
      [selectedMonth]: { ...(pricingMatrix[selectedMonth] || {}), [itemId.toString()]: value }
    };
    setPricingMatrix(updatedMatrix);
    updateItineraryData({ pricingMatrix: updatedMatrix });
  };





// 👇 HIGHLIGHT: Allow Agents to access the Costing page now
  useEffect(() => {
    if (user && !['admin', 'employee', 'agent'].includes(user.role)) {
       router.push('/dashboard/itinerary/create-day'); 
    }
  }, [user, router]);


  useEffect(() => {
    if (itineraryData.selectedCurrency && itineraryData.selectedCurrency !== currency) setCurrency(itineraryData.selectedCurrency);
    if (itineraryData.markupPercentage !== undefined) setMarkupPercent(itineraryData.markupPercentage);
    if ((itineraryData as any).agentMargin !== undefined) setAgentMargin((itineraryData as any).agentMargin);
    if (itineraryData.roundingMode) setRoundingMode(itineraryData.roundingMode);
    if (itineraryData.fixedDepartures) setFixedDepartures(itineraryData.fixedDepartures);
    if (itineraryData.pricingMatrix) setPricingMatrix(itineraryData.pricingMatrix);
    if (itineraryData.seasonStartDate) setSeasonStart(itineraryData.seasonStartDate);
    if (itineraryData.seasonEndDate) setSeasonEnd(itineraryData.seasonEndDate);
    if (itineraryData.selectedDepartureId) setSelectedDepartureId(itineraryData.selectedDepartureId);
    
    // 👇 FIX: Load the saved simulation date on refresh
    if ((itineraryData as any).simulationDate) setSimulationDate((itineraryData as any).simulationDate);
  }, [itineraryData]);

  // Auto-Update Simulation Date (ONLY if missing or month changes)
  useEffect(() => {
      const year = new Date().getFullYear() + 1; 
      const monthIndex = MONTHS.indexOf(selectedMonth);
      if (monthIndex >= 0) {
          const currentSim = new Date(simulationDate);
          // 👇 FIX: Only auto-generate if no date exists OR the user switched to a completely different month tab
          if (!simulationDate || currentSim.getMonth() !== monthIndex) {
             // Create date at local noon to avoid UTC midnight shifting to previous day (31st Dec)
             const d = new Date(year, monthIndex, 1, 12, 0, 0); 
             const newDate = d.toISOString().split('T')[0];
             
             setSimulationDate(newDate);
             updateItineraryData({ simulationDate: newDate } as any);
          }
      }
  }, [selectedMonth]); // Only triggers when the Month Tab is clicked




  // --- HANDLERS ---
  const handleValidityChange = (field: 'start' | 'end', val: string) => {
      if(field === 'start') { setSeasonStart(val); updateItineraryData({ seasonStartDate: val }); }
      else { setSeasonEnd(val); updateItineraryData({ seasonEndDate: val }); }
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
        const allLibs = JSON.parse(localStorage.getItem('itinerary_library') || '[]');
        const idx = allLibs.findIndex((i:any) => i.id === itineraryData.id);
        if(idx !== -1) {
            allLibs[idx].status = 'reedit_requested';
            allLibs[idx].adminComment = reason;
            localStorage.setItem('itinerary_library', JSON.stringify(allLibs));
        }
        
        router.push('/dashboard/itinerary/library'); 
    }
  };

  const handleApprove = () => {
      approveCosting();
      
      // Force save to database so the Agent instantly gains access to the Costing page
      const allLibs = JSON.parse(localStorage.getItem('itinerary_library') || '[]');
      const idx = allLibs.findIndex((i:any) => i.id === itineraryData.id);
      if(idx !== -1) {
          allLibs[idx].status = 'approved';
          localStorage.setItem('itinerary_library', JSON.stringify(allLibs));
      }
      
      alert("Costing Approved! Agent/Employee can now see the Pricing and Preview.");
      router.push('/dashboard/itinerary/library');
  };

  const handleCurrencyChange = (value: string) => {
      setCurrency(value);
      updateItineraryData({ selectedCurrency: value });
  };

  // --- DATA PROCESSING ---
  const processedDayPlans = useMemo(() => {
    const plansWithGhosts = JSON.parse(JSON.stringify(rawDayPlans)) as DayPlan[];
    rawDayPlans.forEach((day) => {
        if (!day.stays) return;
        day.stays.forEach(stay => {
            const nights = safeNum(stay.nights);
            if (nights > 1) {
                const currentDayNum = day.dayNumber;
                for (let i = 1; i < nights; i++) {
                    const targetDayNum = currentDayNum + i;
                    const targetDay = plansWithGhosts.find(d => d.dayNumber === targetDayNum);
                    if (targetDay) {
                        if (!targetDay.stays) targetDay.stays = [];
                        targetDay.stays.push({ ...stay, id: -Math.random(), costPerNight: 0, isGhost: true });
                    }
                }
            }
        });
    });
    return plansWithGhosts;
  }, [rawDayPlans]);

  // --- CALCULATE TOTALS ---
  const totals = useMemo(() => {
      let totalNet = 0;
      const currentMonthCosts = pricingMatrix[selectedMonth] || {};
      rawDayPlans.forEach(day => {
          day.stays?.forEach(s => { if(isItemIncluded(s.inclusionType)) totalNet += (currentMonthCosts[s.id.toString()] || 0); });
          day.transports?.forEach(t => { if(isItemIncluded(t.inclusionType)) totalNet += (currentMonthCosts[t.id.toString()] || 0); });
          day.activities?.forEach(a => { if(isItemIncluded(a.inclusionType)) totalNet += (currentMonthCosts[a.id.toString()] || 0); });
          day.meals?.forEach(m => { if(isItemIncluded(m.inclusionType)) totalNet += (currentMonthCosts[m.id.toString()] || 0); });
      });
      return { totalNet };
  }, [rawDayPlans, pricingMatrix, selectedMonth]);



const netInSelected = totals.totalNet;
  const isAgent = user?.role === 'agent';
  const activeFixedDeparture = fixedDepartures.find(d => d.id === selectedDepartureId);
  
  // --- 1. B2B WHOLESALE CALCULATION (Admin's Price to Agent) ---
  let wholesalePerPerson = 0;
  let wholesaleGrandTotal = 0;

  if (activeFixedDeparture) {
      wholesalePerPerson = activeFixedDeparture.price; 
      wholesaleGrandTotal = wholesalePerPerson * travelerCount;
  } else {
      const adminMarkupAmount = netInSelected * (markupPercent / 100);
      wholesaleGrandTotal = netInSelected + adminMarkupAmount;
      wholesalePerPerson = travelerCount > 0 ? wholesaleGrandTotal / travelerCount : 0;
  }

  // --- 2. RETAIL CALCULATION (Agent's Price to Client) ---
  let finalPerPerson = 0;
  let finalGrandTotal = 0;
  let displayMarkupPercent = isAgent ? agentMargin : markupPercent;

  if (isAgent) {
      // Agent adds their margin on TOP of the wholesale cost
      const agencyMarkupAmount = wholesaleGrandTotal * (agentMargin / 100);
      const exactPerPerson = travelerCount > 0 ? (wholesaleGrandTotal + agencyMarkupAmount) / travelerCount : 0;
      
      finalPerPerson = exactPerPerson;
      if (roundingMode === '5') finalPerPerson = Math.ceil(exactPerPerson / 5) * 5;
      else if (roundingMode === '10') finalPerPerson = Math.ceil(exactPerPerson / 10) * 10;
      else if (roundingMode === '100') finalPerPerson = Math.ceil(exactPerPerson / 100) * 100;
      
      finalGrandTotal = finalPerPerson * travelerCount;
  } else {
      // For Admin/Employee, final price equals wholesale price with rounding applied
      finalPerPerson = wholesalePerPerson;
      if (roundingMode === '5') finalPerPerson = Math.ceil(wholesalePerPerson / 5) * 5;
      else if (roundingMode === '10') finalPerPerson = Math.ceil(wholesalePerPerson / 10) * 10;
      else if (roundingMode === '100') finalPerPerson = Math.ceil(wholesalePerPerson / 100) * 100;
      
      finalGrandTotal = finalPerPerson * travelerCount;
  }



// --- FIXED DEPARTURES (INVENTORY MATRIX) ---
  const addDepartureRow = () => { 
      // 👇 Default values updated to Month, Occupancy, and Available
      const newRow = { id: Date.now().toString(), month: '', occupancy: 'Double / Twin Sharing', price: 0, status: 'Available', isSelected: false }; 
      const updated = [...fixedDepartures, newRow as any]; 
      setFixedDepartures(updated); 
      updateItineraryData({ fixedDepartures: updated }); 
  };
  
  const updateDepartureRow = (id: string, field: string, value: any) => { 
      const updated = fixedDepartures.map((d: any) => { 
          if (d.id === id) { return { ...d, [field]: value }; } 
          return d; 
      }); 
      setFixedDepartures(updated); 
      updateItineraryData({ fixedDepartures: updated }); 
  };
  
  const removeDepartureRow = (id: string) => { 
      const updated = fixedDepartures.filter(d => d.id !== id); 
      setFixedDepartures(updated); 
      updateItineraryData({ fixedDepartures: updated }); 
  };

  const toggleDepartureSelection = (id: string) => {
      const isSelecting = selectedDepartureId !== id;
      const newId = isSelecting ? id : null;
      setSelectedDepartureId(newId);
      updateItineraryData({ selectedDepartureId: newId || undefined });
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
      
      // 2. Update context
      updateItineraryData({ simulationDate: val } as any);
      
      // 3. Force save to storage so it survives refresh
      const currentData = { ...itineraryData, simulationDate: val };
      saveItineraryToStorage(currentData as any);
  };



  // 👇 FIX 3: Dedicated handler to save the Agent's Margin without destroying Admin markup
  const handleAgentMarginChange = (val: number) => {
    setAgentMargin(val);
    updateItineraryData({ agentMargin: val } as any);
    const currentData = { ...itineraryData, agentMargin: val };
    saveItineraryToStorage(currentData as any); 
  };
   
  const handleDownloadExcel = () => { alert("Excel Download"); };



  // --- PDF DOWNLOAD HANDLER ---
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const cleanPrice = (amount: number) => formatPrice(amount, currency);

    // 👇 NEW LOGIC: Check if the user is an Admin
    const isAdmin = user?.role === 'admin';


    // --- 1. CALCULATE DATES ---
    // 👇 FIX: Use the actual Trip Validity (Season Start/End) dates from the UI
    const formattedStart = seasonStart ? formatDisplayDate(seasonStart) : 'TBA';
    const formattedEnd = seasonEnd ? formatDisplayDate(seasonEnd) : 'TBA';
    const tripDateString = `${formattedStart} - ${formattedEnd}`;
    // // --- 2. HEADER ---

       const logoBase64 = "data:image/png;base64,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";
  
    // 1. Header Background
    doc.setFillColor(245, 245, 220); 
    doc.rect(0, 0, pageWidth, 5, 'F');

    // 2. Logo Logic
    if (logoBase64 && logoBase64.length > 100) {
        try {
            const cleanBase64 = logoBase64
                .replace(/^data:image\/(png|jpg|jpeg);base64,/, "")
                .replace(/\s/g, ""); 

            doc.addImage(cleanBase64, 'PNG', 14, 8, 50, 10); 
        } catch (e) {
            console.error("Logo Error:", e);
            doc.setTextColor(0, 0, 0); doc.setFontSize(22); doc.text("TRAVDEK", 14, 20);
        }
    } else {
        doc.setTextColor(0, 0, 0); doc.setFontSize(22); doc.setFont("helvetica", "bold");
        doc.text("TRAVDEK", 14, 20);
    }

    // --- 3. METADATA (Updated Sequence) ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(`Quotation For: ${itineraryData.tripName || 'New Trip'}`, 14, 30);
    
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

    processedDayPlans.forEach(day => {
        // Calculate specific date for this day
        let dayDateDisplay = "";
        if(activeFixedDeparture || simulationDate) {
             const startRef = activeFixedDeparture ? activeFixedDeparture.date : simulationDate;
             dayDateDisplay = getCalculatedDate(startRef, day.dayNumber - 1);
        }


        // 👇 FIX: Adjust colSpan dynamically based on role (6 for Admin, 4 for Employee)
        tableBody.push([{ 
            content: `DAY ${day.dayNumber} - ${day.city?.toUpperCase() || ''}${dayDateDisplay}`, 
            colSpan: isAdmin ? 6 : 4, 
            styles: { fillColor: [240, 240, 240], fontStyle: 'bold', textColor: [50, 50, 50] } 
        }]);

  

        // Helper to add rows using Pricing Matrix
        const addRow = (cat: string, name: string, status: string | undefined, config: string, itemId: number, divisor: number, isGhost: boolean = false) => {
            const isIncluded = isItemIncluded(status);
            const netTotal = getCost(itemId); 
            const cost = (isIncluded && !isGhost) ? netTotal : 0;
            const ppCost = (divisor > 0 && cost > 0) ? (cost / divisor) : 0;
            const displayConfig = isGhost ? "Continuing Stay" : config;
            const displayStatus = status ? status.toUpperCase() : "INCLUDED";

     


            // 👇 FIX: If Admin, push 6 columns. If Employee, push 4 columns.
            if (isAdmin) {
                tableBody.push([cat, name + (!isIncluded ? ` (${displayStatus})` : ''), displayStatus, displayConfig, (isIncluded && !isGhost) ? cleanPrice(ppCost) : '-', (isIncluded && !isGhost) ? cleanPrice(cost) : '-']);
            } else {
                tableBody.push([cat, name + (!isIncluded ? ` (${displayStatus})` : ''), displayStatus, displayConfig]);
            }
        };

        // ... (Keep your existing Loop logic for Stays, Transports, Activities, Meals here) ...
        // Copying the loops from your previous code for completeness:
        if(day.stays) day.stays.forEach((s: any) => { getStayRows(s).forEach((row:any) => addRow('Stay', row.details, s.inclusionType, row.config, s.id, row.ppDivisor, s.isGhost)); });
        if(day.transports) day.transports.forEach((t: any) => { const div = t.paxCount || travelerCount; addRow('Transport', t.vehicleType, t.inclusionType, `${t.vehicleCount} Veh / ${div} Pax`, t.id, div); });
        if(day.activities) day.activities.forEach((a: any) => { const pax = a.paxCount || travelerCount; addRow('Activity', a.heading, a.inclusionType, `${pax} Pax`, a.id, pax); });
        if(day.meals) day.meals.forEach((m: any) => { addRow('Meal', m.restaurantName, m.inclusionType, m.mealType, m.id, travelerCount); });
    });

    autoTable(doc, {
      startY: 55, 
      // 👇 FIX: Different Headers for Admin vs Employee
      head: isAdmin ? [['Category', 'Details', 'Status', 'Config', 'PP Cost', 'Net Cost']] : [['Category', 'Details', 'Status', 'Config']],
      body: tableBody,
    //   head: [['Category', 'Details', 'Status', 'Config', 'PP Cost', 'Net Cost']],
    //   body: tableBody,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3 },

      // 👇 FIX: Apply right alignment only for Admin (columns 4 and 5)
      columnStyles: isAdmin ? { 4: { halign: 'right' }, 5: { halign: 'right' } } : {}
  
    //   columnStyles: { 4: { halign: 'right' }, 5: { halign: 'right' } }
    });

    // --- 5. TOTALS ---
    // @ts-ignore
    let finalY = doc.lastAutoTable.finalY + 10;
    if (finalY > 240) { doc.addPage(); finalY = 20; }

    doc.setDrawColor(200, 200, 200);
    doc.line(100, finalY, 196, finalY);

    let currentY = finalY + 8;

    // 👇 FIX: HIDE Net and Markup from Employee completely
    if (isAdmin) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        doc.setTextColor(100, 100, 100); 
        doc.text(`Total Net (${selectedMonth}):`, 150, currentY, { align: "right" });
        doc.setTextColor(0, 0, 0); 
        doc.text(cleanPrice(netInSelected), 190, currentY, { align: "right" });

        currentY += 6;
        doc.setTextColor(100, 100, 100);
        doc.text(`Markup (${displayMarkupPercent.toFixed(1)}%):`, 150, currentY, { align: "right" });
        doc.setTextColor(0, 0, 0);
        
        const markupAmt = activeFixedDeparture 
            ? (finalGrandTotal - netInSelected) 
            : (netInSelected * (markupPercent / 100));
            
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
    doc.rect(110, currentY - 5, 90, 10, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 100, 0); 
    doc.text("Price Per Person:", 150, currentY, { align: "right" });
    doc.setFontSize(12);
    doc.text(cleanPrice(finalPerPerson), 190, currentY, { align: "right" });

    doc.save(`Quote_${itineraryData.tripId || 'Travdek'}_${isAdmin ? 'Internal' : 'Client'}.pdf`);
  };



  const handleSaveQuote = async () => { await saveItinerary('quick'); alert("Quote saved!"); };
  




  const getStayRows = (stay: any) => {
      if (!stay.roomOccupancy || stay.roomOccupancy.length === 0) {
          return [{ details: stay.hotelName, config: `${stay.numRooms} Room(s) x ${travelerCount} Pax x ${stay.nights} Nights`, ppDivisor: travelerCount }];
      }
      const groups: Record<number, number> = {};
      stay.roomOccupancy.forEach((pax: number) => groups[pax] = (groups[pax] || 0) + 1);
      return Object.entries(groups).map(([paxStr, roomCount]) => {
          const pax = parseInt(paxStr);
          return { details: `${stay.hotelName} (${getShareLabel(pax)} Share)`, config: `${roomCount} Room(s) x ${pax} Pax x ${stay.nights} Nights`, ppDivisor: pax };
      });
  };

  const tripDuration = `${rawDayPlans.length} Days / ${Math.max(0, rawDayPlans.length - 1)} Nights`;




  if (loading || !user) return <div className="p-10 text-center">Loading...</div>;


// =====================================================================
  // 👇 EMPLOYEE & AGENT VIEW (READ-ONLY SUMMARY / STOREFRONT) 👇
  // =====================================================================
  if (user?.role === 'employee' || user?.role === 'agent') {
      const isAgent = user?.role === 'agent';

      return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
          {/* HEADER */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4 flex justify-between items-center shadow-sm">
            <div>
               <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                   <FileText className="text-blue-600" size={24}/> 
                   {isAgent ? 'Finalize Quote' : 'Quotation Summary'}
               </h1>
               <p className="text-xs text-gray-500 mt-0.5 font-bold text-blue-600">{tripDuration} <span className="text-gray-400 font-normal">• {travelerCount} Travelers</span></p>
            </div>
            
            {/* VALIDITY WIDGET - CENTERED */}
            <div className="hidden md:flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm mx-auto">
                <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Calendar size={16} /></div>
                    <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wide leading-tight">Trip<br/>Validity</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <label className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Valid From</label>
                        <span className="text-xs font-bold text-gray-800">{seasonStart ? formatDisplayDate(seasonStart) : 'TBA'}</span>
                    </div>
                    <div className="text-gray-300 font-light">→</div>
                    <div className="flex flex-col">
                        <label className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Valid Till</label>
                        <span className="text-xs font-bold text-gray-800">{seasonEnd ? formatDisplayDate(seasonEnd) : 'TBA'}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                 <button onClick={() => router.push('/dashboard/itinerary/create-day')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"><ArrowLeft size={16} /> Back</button>
            </div>
          </header>

          <main className="max-w-[1600px] mx-auto p-6 flex flex-col xl:flex-row gap-6 items-start">
            
            {/* LEFT: THE ITINERARY LEDGER */}
            <div className="flex-1 w-full space-y-6">
                <div className="bg-white border border-gray-400 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-500 border-b border-gray-400">
                                <tr>
                                    <th className="py-3 px-4 text-xs font-bold uppercase w-[80px]">Type</th>
                                    <th className="py-3 px-4 text-xs font-bold uppercase">Item Details</th>
                                    <th className="py-3 px-4 text-xs font-bold uppercase w-[150px]">Config</th>
                                    <th className="py-3 px-4 text-xs font-bold uppercase text-right w-[100px]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {processedDayPlans.map((day) => (
                                    <React.Fragment key={day.dayNumber}>
                                        <tr className="bg-gray-100 border-b border-gray-400">
                                            <td colSpan={4} className="py-2 px-4"><div className="flex items-center gap-2 text-gray-700 font-bold"><Calendar size={14} className="text-blue-500"/><span>DAY {day.dayNumber} - {day.city}</span><span className="text-gray-400 font-medium text-xs ml-2">{getCalculatedDate(simulationDate, day.dayNumber - 1)}</span></div></td>
                                        </tr>
                                        {/* Notice isEmployeeView={true} keeps prices and vendors hidden for BOTH Agent and Employee */}
                                        {(day.stays || []).map((s: any, i: number) => { 
                                            const rows = getStayRows(s);
                                            return rows.map((row:any, idx:number) => (<LedgerRow key={`s-${i}-${idx}`} isEmployeeView={true} typeLabel="Stay" typeColor={s.isGhost ? "text-gray-400" : "text-gray-900"} details={row.details} inclusionType={s.inclusionType} config={s.isGhost ? "Continuing" : row.config} isGhost={s.isGhost} rowSpan={idx === 0 ? rows.length : 1} isSubRow={idx > 0} />)); 
                                        })}
                                        {(day.transports || []).map((t: any, i: number) => { 
                                            const divisor = t.paxCount || travelerCount; 
                                            return (<LedgerRow key={`t-${i}`} isEmployeeView={true} typeLabel="Transport" typeColor="text-gray-900" details={t.vehicleType} inclusionType={t.inclusionType} config={`${t.vehicleCount} Veh / ${divisor} Pax`} />); 
                                        })}
                                        {(day.activities || []).map((a: any, i: number) => { 
                                            const pax = a.paxCount || travelerCount;
                                            return (<LedgerRow key={`a-${i}`} isEmployeeView={true} typeLabel="Activity" typeColor="text-gray-900" details={a.heading} inclusionType={a.inclusionType} config={`${pax} Pax`} />); 
                                        })}
                                        {(day.meals || []).map((m: any, i: number) => {
                                            return (<LedgerRow key={`m-${i}`} isEmployeeView={true} typeLabel="Meal" typeColor="text-gray-900" details={m.restaurantName} inclusionType={m.inclusionType} config={m.mealType} />);
                                        })}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        
            {/* RIGHT: SALES SUMMARY CARD (PREMIUM UI) */}
            <div className="w-full xl:w-[400px] shrink-0 sticky top-24 flex flex-col gap-4">
                
                {/* 1. Currency Selector */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-300 flex items-center justify-between">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Currency</div>
                    <select value={currency} onChange={(e) => handleCurrencyChange(e.target.value)} className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold">
                        {rates && Object.keys(rates).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                {/* 2. Premium Quote Calculator */}
                <div className={`bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden transition-all duration-300`}>
                    
                    {/* Dark Header */}
                    <div className={`bg-gray-900 text-white px-5 py-4 flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                            <Calculator size={18} className="text-blue-400"/>
                            <span className="font-bold tracking-wide text-sm">
                                {isAgent ? 'Finalize Quote (B2B)' : 'Quotation Summary'}
                            </span>
                        </div>
                    </div>

                    <div className="p-5 space-y-5">
                        
                        {/* Wholesale B2B Cost Display */}
                        <div className="flex justify-between items-center text-sm pb-4 border-b border-gray-100">
                            <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Wholesale Cost (B2B)</span>
                            <span className="font-mono font-bold text-gray-800 text-lg">
                                {/* 👇 FIX: Uses the correctly calculated Wholesale price */}
                                {formatPrice(wholesaleGrandTotal, currency)}
                            </span>
                        </div>
                        
                        {/* 👇 HIGHLIGHT FIX: Replaced Slider with Buttons & Input */}
                        {/* Agent Margin Selector (Only for Agents) */}
                        {isAgent && (
                            <div className="space-y-3 pb-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Agency Margin / Markup %</label>
                                </div>
                                
                                {/* Quick-Select Buttons */}
                                <div className="grid grid-cols-4 gap-2">
                                    {[25, 50, 75, 100].map(pct => (
                                        <button 
                                            key={pct} 
                                            onClick={() => handleAgentMarginChange(pct)} 
                                            className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                                                agentMargin === pct 
                                                ? 'bg-blue-100 border-blue-500 text-blue-700' 
                                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                                            }`}
                                        >
                                            {pct}%
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Numeric Input */}
                                <div className="relative mt-2">
                                    <input 
                                        type="number" 
                                        min="0"
                                        value={agentMargin === 0 ? '' : agentMargin} 
                                        onChange={(e) => handleAgentMarginChange(parseFloat(e.target.value) || 0)} 
                                        placeholder="Custom %"
                                        className="w-full p-2.5 border rounded-lg font-bold text-sm bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                    <div className="absolute right-4 top-2.5 text-gray-400 font-bold text-sm pointer-events-none">%</div>
                                </div>
                            </div>
                        )}
                        {/* 👆 END HIGHLIGHT FIX */}

                        {/* Final Blue Selling Block */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-xl shadow-inner text-white space-y-4 relative overflow-hidden mt-4">
                             <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <div className="text-blue-200 font-bold text-xs uppercase mb-1">Selling Price / Per Person</div>
                                    <div className="font-mono font-black text-3xl tracking-tight">{formatPrice(finalPerPerson, currency)}</div>
                                </div>
                                <User size={24} className="text-blue-400/50" />
                            </div>
                            <div className="pt-3 border-t border-blue-500/30 flex justify-between items-center relative z-10">
                                <span className="text-blue-200 font-medium text-xs">Total Retail Value ({travelerCount} Pax)</span>
                                <span className="font-mono font-bold text-lg text-white">{formatPrice(finalGrandTotal, currency)}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 grid grid-cols-2 gap-3">
                            {isAgent && (
                                <button onClick={handleSaveQuote} className="col-span-2 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black transition-colors text-white font-bold py-3 rounded-lg text-sm shadow-md">
                                    <Save size={16}/> Save Margin
                                </button>
                            )}
                            <button onClick={handleDownloadExcel} className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2.5 rounded-lg text-xs shadow-sm hover:bg-gray-50 transition-colors">
                                <Download size={14}/> Excel
                            </button>
                            <button onClick={handleDownloadPDF}  className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2.5 rounded-lg text-xs shadow-sm hover:bg-gray-50 transition-colors">
                                <Printer size={14}/> PDF
                            </button>
                        </div>

                    </div>
                </div>
            </div>
       


          </main>
        </div>
      );
  }
  // =====================================================================
  // 👆 END EMPLOYEE & AGENT VIEW 👆
  // =====================================================================



  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">


        
      
      {/* 1. RE-EDIT BANNER */}
      {itineraryData.status === 'reedit_requested' && (
         <div className="bg-orange-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-white/20 rounded-full"><AlertOctagon size={24} /></div>
               <div><h3 className="font-bold text-lg">Re-Edit Requested</h3><p className="text-sm opacity-90">Reason: "{itineraryData.reEditReason}"</p></div>
            </div>
            <div className="flex gap-3">
               <button onClick={revertToPending} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold border border-white/30 flex items-center gap-2"><ThumbsDown size={16}/> Deny</button>
               <button onClick={allowReEdit} className="px-6 py-2 bg-white text-orange-700 hover:bg-gray-100 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2"><ThumbsUp size={16}/> Allow (Unlock)</button>
            </div>
         </div>
      )}

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
           <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><FileText className="text-blue-600" size={24}/> Quotation Sheet</h1>
           <p className="text-xs text-gray-500 mt-0.5 font-bold text-blue-600">{tripDuration} <span className="text-gray-400 font-normal">• {travelerCount} Travelers</span></p>
        </div>
        
      

        {/* VALIDITY WIDGET - CENTERED */}
        <div className="hidden md:flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm mx-auto">
            {/* Label Section */}
            <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <Calendar size={16} />
                </div>
                <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wide leading-tight">
                    Trip<br/>Validity
                </span>
            </div>

            {/* Date Inputs */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <label className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Valid From</label>
                    <input 
                        type="date" 
                        value={seasonStart} 
                        onChange={(e) => handleValidityChange('start', e.target.value)} 
                        className="text-xs font-bold text-gray-800 bg-transparent outline-none cursor-pointer hover:text-blue-600 transition-colors"
                    />
                </div>
                
                <div className="text-gray-300 font-light">→</div>

                <div className="flex flex-col">
                    <label className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Valid Till</label>
                    <input 
                        type="date" 
                        value={seasonEnd} 
                        onChange={(e) => handleValidityChange('end', e.target.value)} 
                        className="text-xs font-bold text-gray-800 bg-transparent outline-none cursor-pointer hover:text-blue-600 transition-colors"
                    />
                </div>
            </div>
        </div>

        <div className="flex gap-3">
             <button onClick={() => router.push('/dashboard/itinerary/create-day')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"><ArrowLeft size={16} /> Edit</button>
             {user?.role === 'admin' && itineraryData.status === 'pending_costing' && (
               <>
                 <button onClick={handleReject} className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-2"><XCircle size={16} /> Request Changes</button>
                 {/* <button onClick={approveCosting} className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 shadow-sm animate-pulse"><CheckCircle2 size={16} /> Approve & Release</button> */}
               <button onClick={handleApprove} className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 shadow-sm animate-pulse"><CheckCircle2 size={16} /> Approve & Release</button>
               </>
             )}
             {user?.role === 'admin' && itineraryData.status === 'approved' && (
                 <button onClick={revertToPending} className="px-4 py-2 text-sm font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded-lg flex items-center gap-2 shadow-sm"><Unlock size={16} /> Unlock to Fix</button>
             )}
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 flex flex-col xl:flex-row gap-6 items-start">
        
        {/* LEFT: LEDGER */}
        <div className="flex-1 w-full space-y-6">
            
            <div className="flex items-center justify-between">
                <div className="bg-white border border-gray-300 rounded-xl p-1.5 flex gap-1 shadow-sm overflow-x-auto flex-1 mr-4">
                {MONTHS.map(month => (
                    <button key={month} onClick={() => setSelectedMonth(month)}
                        className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-bold transition-all ${selectedMonth === month ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >{month}</button>
                ))}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 flex flex-col items-start min-w-[140px]">
                    <span className="text-[9px] font-bold text-blue-600 uppercase flex items-center gap-1"><Clock size={10}/> Ref. Start Date</span>
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
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-400">
                            <tr>
                                <th className="py-3 px-4 text-xs font-bold uppercase w-[80px]">Type</th>
                                <th className="py-3 px-4 text-xs font-bold uppercase">Item Details</th>
                                <th className="py-3 px-4 text-xs font-bold uppercase w-[120px] text-blue-600">Supplier</th> 
                                <th className="py-3 px-4 text-xs font-bold uppercase w-[150px]">Config</th>
                                <th className="py-3 px-4 text-xs font-bold uppercase text-right w-[140px]">Net Total</th>
                                <th className="py-3 px-4 text-xs font-bold uppercase text-right w-[100px]">PP Cost</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {processedDayPlans.map((day) => (
                                <React.Fragment key={day.dayNumber}>
                                    <tr className="bg-gray-100 border-b border-gray-400">
                                        <td colSpan={6} className="py-2 px-4"><div className="flex items-center gap-2 text-gray-700 font-bold"><Calendar size={14} className="text-blue-500"/><span>DAY {day.dayNumber} - {day.city}</span><span className="text-gray-400 font-medium text-xs ml-2">{getCalculatedDate(simulationDate, day.dayNumber - 1)}</span></div></td>
                                    </tr>
                                    {(day.stays || []).map((s: any, i: number) => { 
                                        const rows = getStayRows(s);
                                        return rows.map((row, idx) => (<LedgerRow key={`s-${i}-${idx}`} itemId={s.id} typeLabel="Stay" typeColor={s.isGhost ? "text-gray-400" : "text-gray-900"} details={row.details} inclusionType={s.inclusionType} config={s.isGhost ? "Continuing" : row.config} manualNetTotal={getCost(s.id)} onCostChange={handleManualCostChange} divisor={row.ppDivisor} currency={currency} formatPrice={formatPrice} isGhost={s.isGhost} vendorName={getVendorName(s.linkedSupplierId)} rowSpan={idx === 0 ? rows.length : 1} isSubRow={idx > 0} />)); 
                                    })}
                                    {(day.transports || []).map((t: any, i: number) => { 
                                        const divisor = t.paxCount || travelerCount; 
                                        return (<LedgerRow key={`t-${i}`} itemId={t.id} typeLabel="Transport" typeColor="text-gray-900" details={t.vehicleType} inclusionType={t.inclusionType} config={`${t.vehicleCount} Veh / ${divisor} Pax`} manualNetTotal={getCost(t.id)} onCostChange={handleManualCostChange} divisor={divisor} currency={currency} formatPrice={formatPrice} vendorName={getVendorName(t.linkedSupplierId)} />); 
                                    })}
                                    {(day.activities || []).map((a: any, i: number) => { 
                                        const pax = a.paxCount || travelerCount;
                                        return (<LedgerRow key={`a-${i}`} itemId={a.id} typeLabel="Activity" typeColor="text-gray-900" details={a.heading} inclusionType={a.inclusionType} config={`${pax} Pax`} manualNetTotal={getCost(a.id)} onCostChange={handleManualCostChange} divisor={pax} currency={currency} formatPrice={formatPrice} vendorName={getVendorName(a.linkedSupplierId)} />); 
                                    })}
                                    {(day.meals || []).map((m: any, i: number) => {
                                        return (<LedgerRow key={`m-${i}`} itemId={m.id} typeLabel="Meal" typeColor="text-gray-900" details={m.restaurantName} inclusionType={m.inclusionType} config={m.mealType} manualNetTotal={getCost(m.id)} onCostChange={handleManualCostChange} divisor={travelerCount} currency={currency} formatPrice={formatPrice} vendorName={getVendorName(m.linkedSupplierId)} />);
                                    })}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FIXED DEPARTURES TABLE */}
      
      {/* FIXED DEPARTURES TABLE (SERIES INVENTORY MATRIX) */}
            <div className="bg-white border border-gray-400 rounded-xl shadow-md overflow-hidden p-6">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-gray-800 flex items-center gap-2"><Calendar size={18} className="text-blue-600" />Series Inventory & Pricing</h3>
                     <button onClick={addDepartureRow} className="text-sm flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md font-bold hover:bg-blue-700 transition"><Plus size={15} /> Add Package</button>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border border-gray-400">
                        <thead className="bg-gray-200 text-gray-600 uppercase text-[10px] tracking-wider border-b border-gray-400">
                            <tr>
                                <th className="py-3 px-4 w-[60px] text-center">Select</th>
                                <th className="py-3 px-4 w-[180px]">Month</th>
                                <th className="py-3 px-4">Occupancy Type</th>
                                <th className="py-3 px-4 w-[150px]">Net Price (B2B)</th>
                                <th className="py-3 px-4 w-[140px]">Status</th>
                                <th className="py-3 px-4 w-[50px] text-center">Del</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300 border border-gray-400">
                            {fixedDepartures.map((row: any) => (
                                <tr key={row.id} className={selectedDepartureId === row.id ? 'bg-blue-50/60' : 'hover:bg-gray-50'}>
                                    <td className="py-3 px-4 text-center">
                                        <button onClick={() => toggleDepartureSelection(row.id)} className="group focus:outline-none">
                                            <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-200 ${selectedDepartureId === row.id ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-gray-400'}`}>
                                                {selectedDepartureId === row.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                        </button>
                                    </td>
                                    {/* 1. MONTH PICKER */}
                                    <td className="py-3 px-4">
                                        <input type="month" value={row.month || ''} onChange={(e) => updateDepartureRow(row.id, 'month', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-gray-700 outline-none font-bold text-xs uppercase"/>
                                    </td>
                                    {/* 2. OCCUPANCY DROPDOWN */}
                                    <td className="py-3 px-4">
                                        <select value={row.occupancy || 'Double / Twin Sharing'} onChange={(e) => updateDepartureRow(row.id, 'occupancy', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-gray-700 bg-white outline-none text-xs font-bold">
                                            <option value="Single Sharing">Single Sharing</option>
                                            <option value="Double / Twin Sharing">Double / Twin Sharing</option>
                                            <option value="Triple Sharing">Triple Sharing</option>
                                            <option value="Quad Sharing">Quad Sharing</option>
                                           
                                        </select>
                                    </td>
                                    {/* 3. PRICE */}
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-2 py-1.5 focus-within:border-blue-500">
                                            <span className="text-xs font-bold text-gray-400">{currency}</span>
                                            <input type="number" min="0" value={row.price} onChange={(e) => updateDepartureRow(row.id, 'price', parseFloat(e.target.value) || 0)} className="w-full font-mono font-bold text-gray-900 outline-none bg-transparent"/>
                                        </div>
                                    </td>
                                    {/* 4. NEW STATUS DROPDOWN */}
                                    <td className="py-3 px-4">
                                        <select value={row.status || 'Available'} onChange={(e) => updateDepartureRow(row.id, 'status', e.target.value)} className={`w-full border rounded px-2 py-1.5 text-xs font-bold outline-none ${row.status === 'Sold' ? 'bg-red-50 text-red-700 border-red-200' : row.status === 'Limited Seat' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                            <option value="Available">Available</option>
                                            <option value="Limited Seat">Limited Seat</option>
                                            <option value="Sold">Sold</option>
                                        </select>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button onClick={() => removeDepartureRow(row.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                            {fixedDepartures.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-400 text-sm italic">No packages added. Click "Add Package" to build inventory.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>

        {/* RIGHT: CALCULATOR */}
        <div className="w-full xl:w-[400px] shrink-0 sticky top-24 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-300 flex items-center justify-between">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Currency</div>
                <select value={currency} onChange={(e) => handleCurrencyChange(e.target.value)} className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold">
                    {rates && Object.keys(rates).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center"><h3 className="text-xs font-bold text-gray-700 uppercase flex items-center gap-2"><Briefcase size={14}/> {selectedMonth} Cost Breakdown</h3></div>
                <div className="p-4 space-y-2"><div className="flex justify-between text-sm font-bold"><span>Total Net ({selectedMonth})</span><span className="text-blue-600">{formatPrice(netInSelected, currency)}</span></div></div>
            </div>

            {/* CALCULATOR */}
            <div className={`bg-white rounded-xl shadow-lg border ${activeFixedDeparture ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-300'} overflow-hidden transition-all duration-300`}>
                <div className={`bg-gray-900 text-white px-5 py-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-2"><Calculator size={18} className="text-green-400"/><span className="font-bold tracking-wide text-sm">{activeFixedDeparture ? 'Fixed Package Price' : `Quote Calculator (${selectedMonth})`}</span></div>
                    {activeFixedDeparture && <span className="text-[10px] bg-blue-700 px-2 py-0.5 rounded text-white font-medium">LOCKED</span>}
                </div>

                <div className="p-5 space-y-5">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Total Net Cost</span>
                        <span className="font-mono font-bold text-gray-800 text-lg">{formatPrice(netInSelected, currency)}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Margin / Markup %</label>
                                {activeFixedDeparture && <span className="text-[10px] text-blue-600 font-bold italic"></span>}
                            </div>
                            
                            {/* NEW: MARGIN MATRIX */}
                            {!activeFixedDeparture ? (
                                <div className="grid grid-cols-4 gap-2">
                                    {[0, 20, 35, 50].map(pct => (
                                        <button 
                                            key={pct} 
                                            // 👇 FIX: Use the handler, not setMarkupPercent
                                            onClick={() => handleMarkupChange(pct)} 
                                            className={`py-2 rounded-lg text-xs font-bold transition-all border ${markupPercent === pct ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                                        >
                                            {pct === 0 ? 'Net' : `+${pct}%`}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-2 bg-gray-100 rounded text-center text-xs font-bold text-gray-500">Implied Margin: {displayMarkupPercent.toFixed(1)}%</div>
                            )}

                            {/* Manual Override Input */}
                            {!activeFixedDeparture && (
                                <div className="relative mt-2">
                                    <input 
                                        type="number" 
                                        value={markupPercent} 
                                        // 👇 FIX: Use the handler here too
                                        onChange={(e) => handleMarkupChange(parseFloat(e.target.value) || 0)} 
                                        className={`w-full p-2 border rounded-lg font-bold text-sm bg-white border-gray-300 text-gray-800`}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {!activeFixedDeparture && (
                        <div className={`space-y-3`}> 
                            <div className="flex items-center gap-2 text-purple-600"><Sparkles size={14} fill="currentColor" className="text-purple-200"/><span className="text-xs font-bold uppercase tracking-wide">Pricing Strategy</span></div>
                            <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-lg">{['none', '5', '10', '100'].map((mode) => (<button key={mode} onClick={() => handleRoundingChange(mode)} className={`text-[10px] font-bold py-1.5 rounded-md ${roundingMode === mode ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-400'}`}>{mode === 'none' ? 'Exact' : `+${mode}`}</button>))}</div>
                        </div>
                    )}

                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-xl shadow-inner text-white space-y-4 relative overflow-hidden">
                         <div className="flex justify-between items-start relative z-10">
                            <div>
                                <div className="text-blue-200 font-bold text-xs uppercase mb-1">Selling Price / Per Person</div>
                                <div className="font-mono font-black text-3xl tracking-tight">{formatPrice(finalPerPerson, currency)}</div>
                            </div>
                            <User size={24} className="text-blue-400/50" />
                        </div>
                        <div className="pt-3 border-t border-blue-500/30 flex justify-between items-center relative z-10">
                            <span className="text-blue-200 font-medium text-xs">Total Group Value ({travelerCount} Pax)</span>
                            <span className="font-mono font-bold text-lg text-white">{formatPrice(finalGrandTotal, currency)}</span>
                        </div>
                    </div>

                     <div className="bg-gray-50 px-5 py-4 border-t border-gray-200 grid grid-cols-2 gap-3">
                      <button onClick={handleDownloadExcel} className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded-lg text-xs shadow-sm"><Download size={14}/> Excel</button>
                      <button onClick={handleDownloadPDF}  className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 rounded-lg text-xs shadow-sm"><Printer size={14}/> PDF</button>
                      <button onClick={handleSaveQuote} className="col-span-2 flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3 rounded-lg text-sm shadow-md"><Save size={16}/> Save Quote</button>
                  </div>
                </div>
            </div> 
        </div> 
      </main>
    </div>
  );
}