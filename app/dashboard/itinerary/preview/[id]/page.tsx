

// "use client";

// import React, { useRef, useState, useMemo , useEffect } from 'react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// import { Download} from "lucide-react";
// import { useItinerary } from '@/app/context/ItineraryContext';

// import { DayPlan } from '../../create-day/constants/daywiseConstants';
// import { useCurrency } from '@/hooks/useCurrency'; 
// import { calculateTripCosts } from '@/utils/costingLogic'; 


// // --- HELPERS (Copied from Costing Sheet for consistency) ---
// const isItemIncluded = (status?: string) => !status || status.toLowerCase() === 'included';
// const safeNum = (val: any) => {
//   const num = parseFloat(val);
//   return isNaN(num) ? 0 : num;
// };

// // --- HELPER TO FORMAT DATES ---
// const formatDate = (dateStr?: string) => {
//   if (!dateStr) return 'TBA';
//   return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
// };

// export default function PreviewPage() {
//   const { itineraryData } = useItinerary();
//   const printRef = useRef<HTMLDivElement>(null);
//   const [isDownloading, setIsDownloading] = useState(false);

//   // --- 1. DATA PREPARATION ---
//   const routes = itineraryData.routingData?.routes || [];
//   const startCity = routes.length > 0 ? routes[0].cities[0]?.name : 'TBA';
//   const endCity = routes.length > 0 ? routes[routes.length - 1].cities[0]?.name : 'TBA';
//   const totalNights = routes.reduce((acc, curr) => acc + (curr.nights || 0), 0);
//   const totalDays = totalNights + 1;
//   const uniqueCities = Array.from(new Set(routes.flatMap(r => r.cities.map(c => c.name)))).join(' | ');
  
//   const rawDayPlans = (itineraryData.dayWiseActivities || []) as DayPlan[];

//   // --- 2. CURRENCY & COST LOGIC (SYNCED WITH COSTING SHEET) ---
//   const { currency, setCurrency, convert, loading } = useCurrency('USD');

//   useEffect(() => {
//     // Priority: 1. Itinerary Specific Currency, 2. Local Storage, 3. Default USD
//     if (itineraryData.selectedCurrency) {
//         setCurrency(itineraryData.selectedCurrency);
//     } else {
//         const savedCurrency = localStorage.getItem('travdek_preferred_currency');
//         if (savedCurrency) setCurrency(savedCurrency);
//     }
//   }, [itineraryData.selectedCurrency]);

//   const travelerCount = safeNum(itineraryData?.numberOfTravelers) || 1;
//   const markupPercent = itineraryData.markupPercentage !== undefined ? itineraryData.markupPercentage : 20; 
//   const roundingMode = itineraryData.roundingMode || 'none';

//   // --- EXACT CALCULATION ENGINE (Copied from CostingPage) ---
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

//   // --- 2. DETERMINE FINAL PRICE ---
//   const netInSelected = convert(calculatedNetTotal, currency);
  
//   // NEW: CHECK FOR FIXED PRICE OVERRIDE
//   let finalPerPerson = 0;

//   // Check if fixed pricing is enabled and a row is selected
//   const activeFixedDeparture = itineraryData.fixedDepartures?.find(d => d.isSelected);

//   if (itineraryData.useFixedPrice && activeFixedDeparture) {
//       // OVERRIDE: Use the manual price
//       finalPerPerson = activeFixedDeparture.price;
//   } else {
//       // STANDARD: Use calculated price
//       const markupAmount = netInSelected * (markupPercent / 100);
//       const exactGrandTotal = netInSelected + markupAmount;
//       const exactPerPerson = travelerCount > 0 ? exactGrandTotal / travelerCount : 0;
      
//       finalPerPerson = exactPerPerson;
//       if (roundingMode === '5') finalPerPerson = Math.ceil(exactPerPerson / 5) * 5;
//       else if (roundingMode === '10') finalPerPerson = Math.ceil(exactPerPerson / 10) * 10;
//       else if (roundingMode === '100') finalPerPerson = Math.ceil(exactPerPerson / 100) * 100;
//   }

// //   // --- FINAL TOTALS CALCULATION (Exact Match) ---
// //   const netInSelected = convert(calculatedNetTotal, currency);
// //   const markupAmount = netInSelected * (markupPercent / 100);
// //   const exactGrandTotal = netInSelected + markupAmount;
// //   const exactPerPerson = travelerCount > 0 ? exactGrandTotal / travelerCount : 0;

// //   // --- ROUNDING LOGIC (The Missing Piece) ---
// //   let finalPerPerson = exactPerPerson;
// //   if (roundingMode === '5') finalPerPerson = Math.ceil(exactPerPerson / 5) * 5;
// //   else if (roundingMode === '10') finalPerPerson = Math.ceil(exactPerPerson / 10) * 10;
// //   else if (roundingMode === '100') finalPerPerson = Math.ceil(exactPerPerson / 100) * 100;
  
//   // Logic for display label
//   const hasFlights = rawDayPlans.some(day => 
//     day.transports?.some(t => t.mode === 'flight' && isItemIncluded(t.inclusionType))
//   );
//   const costLabel = hasFlights ? "(FLIGHTS INCL.)" : "(LAND ONLY)";

//   // --- 3. LOGIC: HANDLE CONTINUED STAYS & FLATTENING ---
//   const getRenderableItemsForDay = (dayIndex: number, currentDay: DayPlan) => {
//     const items: any[] = [];

//     // Add Items (Ensure inclusionType is passed)
//     if(currentDay.activities) currentDay.activities.forEach(a => items.push({ ...a, category: 'Activity' }));
//     if(currentDay.transports) currentDay.transports.forEach(t => items.push({ ...t, category: 'Transport' }));
//     if(currentDay.meals) currentDay.meals.forEach(m => items.push({ ...m, category: 'Meal' }));
    
//     // Add Stays (Check-in)
//     if(currentDay.stays) currentDay.stays.forEach(s => items.push({ ...s, category: 'Stay', status: 'Check-in' }));

//     // Add Ghost Stays (Residence)
//     for (let i = 0; i < dayIndex; i++) {
//         const pastDay = rawDayPlans.find(d => d.dayNumber === (i + 1));
//         if (pastDay && pastDay.stays) {
//             pastDay.stays.forEach(stay => {
//                 const stayEndIndex = i + (stay.nights || 0); 
//                 if (dayIndex > i && dayIndex < stayEndIndex) {
//                     items.push({ ...stay, category: 'Stay', status: 'Residence' });
//                 }
//             });
//         }
//     }

//     return items.sort((a, b) => {
//         const order = { 'Activity': 1, 'Stay': 2 , 'Transport': 3, 'Meal': 4 };
//         return (order[a.category as keyof typeof order] || 5) - (order[b.category as keyof typeof order] || 5);
//     });
//   };


// // --- PDF GENERATION: VISUAL CAPTURE (Preserves HTML Design) ---
//   const handleDownloadPdf = async () => {
//     if (!printRef.current) return;
//     setIsDownloading(true);

//     const element = printRef.current;
    
//     // A4 Dimensions in MM
//     const PDF_WIDTH = 210;
//     const PDF_HEIGHT = 297;
//     const TOP_MARGIN = 0; // Adjust if you want white space at the top of PDF
//     const PAGE_HEIGHT_PX_ESTIMATE = (PDF_HEIGHT * 3.78); // Approx conversion mm to px (96 DPI)

//     // 1. PREPARE DOM FOR SNAPSHOT
//     // (Optional: Hide scrollbars or temporary styles here if needed)
    
//     try {
//         // 2. CAPTURE THE ELEMENT
//         // Scale 2 ensures high quality (Retina-like) for the PDF
//         const canvas = await html2canvas(element, {
//             scale: 2,
//             useCORS: true, 
//             logging: false,
//             backgroundColor: '#ffffff',
//             // Ensure we capture the full scroll height
//             height: element.scrollHeight, 
//             windowHeight: element.scrollHeight,
//             onclone: (clonedDoc) => {
//                 // Fix for missing images or distinct styles during capture can go here
//                 const clonedElement = clonedDoc.getElementById('itinerary-preview-container');
//                 if(clonedElement) {
//                     clonedElement.style.height = 'auto'; 
//                     clonedElement.style.overflow = 'visible';
//                 }
//             }
//         });

//         // 3. CALCULATE DIMENSIONS
//         const imgData = canvas.toDataURL('image/jpeg', 0.95); // JPEG is faster/smaller than PNG
//         const pdf = new jsPDF('p', 'mm', 'a4');
        
//         const imgWidth = canvas.width;
//         const imgHeight = canvas.height;

//         // Calculate the height of the image on the PDF based on A4 Width
//         // formula: (original height * pdf width) / original width
//         const imgHeightInPdf = (imgHeight * PDF_WIDTH) / imgWidth; 
        
//         let heightLeft = imgHeightInPdf;
//         let position = 0; // Starts at top of page

//         // 4. ADD FIRST PAGE
//         pdf.addImage(imgData, 'JPEG', 0, position + TOP_MARGIN, PDF_WIDTH, imgHeightInPdf);
//         heightLeft -= PDF_HEIGHT;

//         // 5. LOOP FOR ADDITIONAL PAGES
//         while (heightLeft > 0) {
//             position = heightLeft - imgHeightInPdf; // Shift position up for next page
//             pdf.addPage();
//             pdf.addImage(imgData, 'JPEG', 0, position + TOP_MARGIN, PDF_WIDTH, imgHeightInPdf);
//             heightLeft -= PDF_HEIGHT;
//         }

//         pdf.save(`${itineraryData.tripName || 'Itinerary'}.pdf`);

//     } catch (error) {
//         console.error("PDF Gen Error:", error);
//         alert("Failed to generate PDF. Please check console.");
//     } finally {
//         setIsDownloading(false);
//     }
//   };



//   if (loading) return <div>Loading Preview...</div>;


// return (
//     <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center gap-6">
      
//       {/* TOOLBAR */}
//       <div className="w-full max-w-[370mm] flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//          <h2 className="font-bold text-gray-700">Print Preview</h2>
//          <button 
//             onClick={handleDownloadPdf}
//             disabled={isDownloading}
//             className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
//          >
//             {isDownloading ? 'Generating...' : <><Download size={18} /> Download PDF</>}
//          </button>
//       </div>

//       {/* --- PRINTABLE AREA --- */}
//       <div 
//         ref={printRef}
//         id="pdf-content"
//         style={{ backgroundColor: '#ffffff', color: '#1f2937', fontFamily: 'Arial, sans-serif' }} 
//         className="w-full max-w-[370mm] min-h-[297mm] shadow-2xl p-0"
//       >
        
//         {/* HEADER */}
//         <div style={{ borderBottom: '4px solid #dc2626' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
//                 <div style={{ flex: 1, padding: '24px' }}>
//                     <div style={{ height: '48px', marginBottom: '16px' }}>
//                         <img src="/logo.png" alt="Company Logo" style={{ height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
//                     </div>
//                     <h1 style={{ color: '#dc2626', fontSize: '30px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, lineHeight: '1.1' }}>{itineraryData.tripName || "Luxury Getaway"}</h1>
//                     <div style={{ display: 'flex', gap: '8px', marginTop: '12px', fontSize: '14px', fontWeight: 'bold', color: '#202020ff' }}>
//                         <span style={{ backgroundColor: '#fef2f2', color:'#bb0000ff' ,  padding: '4px 8px', borderRadius: '4px' }}>{totalDays} Days | {totalNights} Nights</span>
//                         {/* <span style={{ backgroundColor: '#f3f4f6', color:'#202020ff',  padding: '4px 8px', borderRadius: '4px' }}>Ref: {"ITN-" + Math.floor(Math.random() * 10000)}</span> */}
//                         <span style={{ backgroundColor: '#f3f4f6', color:'#202020ff',  padding: '4px 8px', borderRadius: '4px' }}>Ref: ######</span>
//                     </div>
//                 </div>
//                 <div style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '250px', textAlign: 'center' }}>
//                     <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.9, marginBottom: '4px' }}>Starting at</span>
//                     <span style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.025em', lineHeight: '1' }}>
//                        $ {finalPerPerson.toLocaleString(undefined, {currency: currency, maximumFractionDigits: 0 })}
//                         <span style={{ fontSize: '16px', fontWeight: '500', marginLeft: '4px' }}>PP*</span>
//                     </span>
//                     <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8, marginTop: '4px', letterSpacing: '0.05em' }}>{costLabel}</span>
//                 </div>
//             </div>
//             {/* DETAILS GRID */}
//             <div style={{ borderTop: '1px solid #636363ff' }}>
//                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', fontSize: '12px' }}>
//                     <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Release Date:</div>
//                     <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{formatDate(new Date().toISOString())}</div>
//                     <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Trip Validity:</div>
//                     <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{formatDate(itineraryData.routingData?.startDate)} to {formatDate(itineraryData.routingData?.endDate)}</div>
//                     <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Country:</div>
//                     <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{itineraryData.selectedCountries?.join(', ') || "India"}</div>
//                     <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Cities:</div>
//                     <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{uniqueCities}</div>
//                     <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Start / End:</div>
//                     <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{startCity} / {endCity}</div>
//                     <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Route:</div>
//                     <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{itineraryData.selectedCountries?.length || 1} Country | {routes.length} Cities</div>
//                     <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff' }}>Trip Category:</div>
//                     <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', textTransform: 'uppercase', gridColumn: 'span 3' }}>{itineraryData.packageType || "Premium"}</div>
//                 </div>
//             </div>
//         </div>

//         {/* ITINERARY BODY */}
//         <div style={{ marginTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '48px' }}>
//             <h3 style={{ color: '#dc2626', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'underline', marginBottom: '16px', fontSize: '14px', letterSpacing: '0em' }}>Itinerary Details</h3>
            
//             <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #636363ff', fontSize: '14px' }}>
//                 <thead>
//                     <tr style={{ backgroundColor: '#ffedd5', color: '#2c3441ff', textTransform: 'uppercase', fontSize: '12px' }}>
//                         <th style={{ border: '1px solid #636363ff', padding: '12px', width: '96px', textAlign: 'center' }}>Day</th>
//                         <th style={{ border: '1px solid #636363ff', padding: '12px', width: '128px', textAlign: 'left' }}>City</th>
//                         <th style={{ border: '1px solid #636363ff', padding: '12px', width: '120px', textAlign: 'left' }}>Category</th>
//                         <th style={{ border: '1px solid #636363ff', padding: '12px', textAlign: 'left' }}>Description</th>
//                     </tr>
//                 </thead>

//                 {/* --- FIX: Map directly to tbody for page break avoidance --- */}
//                 {rawDayPlans.map((day, idx) => {
//                         const items = getRenderableItemsForDay(idx, day);
//                         return (
//                             <tbody key={day.dayNumber} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                                
//                                 {/* Day Heading Row */}
//                                 <tr style={{ backgroundColor: '#fefce8', borderTop: '2px solid #636363ff' }}>
//                                     <td colSpan={4} style={{ backgroundColor: '#f3f4f6', color: '#303030', padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold' }}>DAY {day.dayNumber} | {formatDate(day.date)}</td>
//                                 </tr>

//                                 {/* Leisure Day Check */}
//                                 {items.length === 0 && (
//                                     <tr>
//                                         <td style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', textAlign: 'center' }}>{day.dayNumber}</td>
//                                         <td style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold' }}>{day.city}</td>
//                                         <td colSpan={2} style={{ border: '1px solid #636363ff', padding: '12px', color: '#9ca3af', fontStyle: 'italic' }}>Leisure day. No activities scheduled.</td>
//                                     </tr>
//                                 )}

//                                 {/* Items Rendering Loop */}
//                                 {items.map((item, itemIdx) => {
                                    
//                                     // Determine Status Color and Text
//                                     const inclusionStatus = item.inclusionType || 'included'; 
//                                     const isExcluded = inclusionStatus === 'excluded';
//                                     const isOptional = inclusionStatus === 'optional';
                                    
//                                     // Visual Styles for Badge
//                                     const badgeBg = isExcluded ? '#fef2f2' : isOptional ? '#eff6ff' : '#f0fdf4';
//                                     const badgeColor = isExcluded ? '#dc2626' : isOptional ? '#1d4ed8' : '#15803d';
//                                     const badgeBorder = isExcluded ? '#fca5a5' : isOptional ? '#93c5fd' : '#86efac';
//                                     const badgeText = isExcluded ? 'Excluded' : isOptional ? 'Optional' : 'Included';

//                                     return (
//                                         <tr key={`${day.dayNumber}-${itemIdx}`} className="pdf-row" >
//                                             {/* Col 1 & 2: Day & City (Merged for first item) */}
//                                             {itemIdx === 0 ? (
//                                                 <>
//                                                     <td rowSpan={items.length} style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#ffffff', verticalAlign: 'top' }}>DAY {day.dayNumber}</td>
//                                                     <td rowSpan={items.length} style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', backgroundColor: '#ffffff', verticalAlign: 'top', color: '#dc2626' }}>{day.city}</td>
//                                                 </>
//                                             ) : null}

//                                             {/* Col 3: Category & INCLUSION STATUS */}
//                                             <td style={{ border: '1px solid #636363ff', padding: '12px', verticalAlign: 'top', color: '#292d33ff' }}>
                                              
//                                                 <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
//                                                     {item.category === 'Stay' ? (
//                                                         <span style={{ color: item.status === 'Check-in' ? '#1f2937' : '#757575ff' }}>Stay</span>
//                                                     ) : item.category}
//                                                 </div>

//                                                 <div style={{ 
//                                                         fontSize: '10px', 
//                                                         fontWeight: 'bold', 
//                                                         textTransform: 'uppercase', 
//                                                         padding: '3px 8px', 
//                                                         borderRadius: '4px', 
//                                                         backgroundColor: badgeBg, 
//                                                         color: badgeColor, 
//                                                         border: `1px solid ${badgeBorder}`,
//                                                         width: 'fit-content', 
//                                                         display: 'block', 
//                                                         marginTop: '10px'
//                                                     }}>
//                                                         {badgeText}
//                                                     </div>
//                                             </td>

//                                             {/* Col 4: Description */}
//                                             <td style={{ border: '1px solid #636363ff', padding: '12px', verticalAlign: 'top' }}>
                                                
//                                                 {item.category === 'Activity' && (
//                                                     <div>
//                                                         <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '16px' }}>{item.heading}</div>
//                                                         <div style={{ color: '#292d33ff', fontSize: '12px', marginTop: '4px', marginBottom: '8px' }}>{item.description}</div>
//                                                         <div style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6', display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', padding: '8px', borderRadius: '4px' }}>
//                                                             <span style={{ color: '#292d33ff', display: 'flex', alignItems: 'center', gap: '4px', }}>Slot: {item.slot}</span>
//                                                             <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Duration: {item.duration}</span>
//                                                             {item.startTime && <span style={{ color: '#292d33ff' }}>Start: {item.startTime}</span>}
//                                                             <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Pickup: {item.pickupLocation || "TBA"}</span>
//                                                         </div>
//                                                     </div>
//                                                 )}

//                                                 {item.category === 'Stay' && (
//                                                     <div style={{ opacity: item.status === 'Residence' ? 0.8 : 1 }}>
//                                                         <div style={{ fontWeight: 'bold', color: '#22252bff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                             {item.hotelName}
//                                                             <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#fff' }}>⭐ {item.rating}</span>
//                                                         </div>
//                                                         <div style={{ marginTop: '2px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
//                                                             {item.status === 'Check-in' ? (
//                                                                 <>
//                                                                     <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Type: {item.stayType} (Stay)</div>
//                                                                     <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
//                                                                     <div style={{ backgroundColor: '#f9fafb', color: '#292d33ff', padding: '2px', borderRadius: '4px' }}>{item.nights} Nights Stay</div>
//                                                                 </>
//                                                             ) : (
//                                                                 <>
//                                                                     <div style={{ gridColumn: 'span 2', fontSize: '12px', color: '#292d33ff', fontStyle: 'italic', marginTop: '2px' }}>Continuing stay at {item.hotelName}. </div>
//                                                                       <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Type: {item.stayType} (Stay)</div>
//                                                                     <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
//                                                                 </>
//                                                            )}
//                                                         </div>
//                                                     </div>
//                                                 )}

//                                                 {/* {item.category === 'Transport' && (
//                                                     <div>
//                                                         <div style={{ fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                             {item.vehicleType}
//                                                             <span style={{ backgroundColor: '#f0fdf4', color: '#292d33ff', fontSize: '10px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', fontWeight: 'normal' }}>{item.subType}</span>
//                                                         </div>
//                                                         <div style={{ marginTop: '4px', fontSize: '12px', color: '#292d33ff', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
//                                                             <div>Pickup: {item.pickupLocation} </div>
//                                                             <div>{item.pickupTime ? `Start Time: ${item.pickupTime}` : ''}</div>
//                                                             <div>{item.subType === 'transfer' ? `Drop: ${item.dropoffLocation}` : `Duration: ${item.duration}`}</div>
//                                                         </div>
//                                                     </div>
//                                                 )} */}



// {item.category === 'Transport' && (
//     <div>
//         {/* 1. Header (Vehicle & Type) */}
//         <div style={{ fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
//             {item.vehicleType}
//             <span style={{ 
//                 backgroundColor: '#f0fdf4', 
//                 color: '#15803d', 
//                 fontSize: '10px', 
//                 textTransform: 'uppercase', 
//                 padding: '2px 6px', 
//                 borderRadius: '4px', 
//                 fontWeight: '600',
//                 border: '1px solid #dcfce7'
//             }}>
//                 {item.subType}
//             </span>
//         </div>

//         {/* 2. NEW: Service Description (The "From Barcelona..." text) */}
//         {/* THIS IS THE PART YOU ARE MISSING */}
//         {item.serviceDescription && (
//             <div style={{ 
//                 marginTop: '6px', 
//                 marginBottom: '8px',
//                 fontSize: '13px', 
//                 color: '#4b5563', 
//                 lineHeight: '1.4',
//                 paddingBottom: '6px',
//                 borderBottom: '1px dashed #e5e7eb'
//             }}>
//                 {item.serviceDescription}
//             </div>
//         )}

//         {/* 3. Logistics (Pickup, Time, Drop) - Better Styled */}
//         <div style={{ 
//             marginTop: '4px', 
//             fontSize: '12px', 
//             color: '#1f2937', 
//             display: 'grid', 
//             gridTemplateColumns: '1fr 1fr', 
//             gap: '8px' 
//         }}>
//             {/* Pickup */}
//             <div>
//                 <span style={{color:'#4e4e4eff', fontWeight:'700', fontSize:'10px', textTransform:'uppercase'}}>Pickup: </span> 
//                 {item.pickupLocation} 
//             </div>
            
//             {/* Time */}
//             <div>
//                 {item.pickupTime ? (
//                     <>
//                     <span style={{color:'#4e4e4eff', fontWeight:'700', fontSize:'10px', textTransform:'uppercase'}}>Start: </span> 
//                     {item.pickupTime}
//                     </>
//                 ) : ''}
//             </div>

//             {/* Drop / Duration */}
//             <div style={{ gridColumn: 'span 2' }}>
//                 <span style={{color:'#4e4e4eff', fontWeight:'700', fontSize:'10px', textTransform:'uppercase'}}>
//                     {item.subType === 'transfer' ? 'Drop: ' : 'Duration: '}
//                 </span> 
//                 {item.subType === 'transfer' ? item.dropoffLocation : item.duration}
//             </div>
//         </div>
//     </div>
// )}
//                                                 {item.category === 'Meal' && (
//                                                     <div>
//                                                         <div style={{ fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                              {item.mealType}: {item.restaurantName}
//                                                         </div>
//                                                         <div style={{ fontSize: '12px', color: '#292d33ff', marginTop: '4px' }}>
//                                                             {item.cuisine} | {item.menuType}
//                                                         </div>
//                                                     </div>
//                                                 )}
                                                
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         );
//                     })}
//             </table>
//         </div>

//         {/* Footer */}
//         <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', marginTop: '32px', padding: '24px', textAlign: 'center', fontSize: '12px', color: '#505050ff' }}>
//             <p>Generated by Travdek. Prices and availability are subject to change.</p>
//         </div>
//       </div>
//     </div> 
//   );
// }














































// "use client";

// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable'; 
// import { 
//   ArrowLeft, Edit, Download, Loader2
// } from 'lucide-react';

// // --- IMPORTS ---
// // We do NOT import useItinerary here. We use getItineraryById instead.
// import { getItineraryById, StoredItineraryData } from '@/utils/itineraryStorage';
// import { DayPlan } from '../../create-day/constants/daywiseConstants'; 
// import { useCurrency } from '@/hooks/useCurrency'; 

// // --- HELPER FUNCTIONS ---
// const isItemIncluded = (status?: string) => !status || status.toLowerCase() === 'included';

// const safeNum = (val: any) => {
//   const num = parseFloat(val);
//   return isNaN(num) ? 0 : num;
// };

// const formatDate = (dateStr?: string) => {
//   if (!dateStr) return 'TBA';
//   const d = new Date(dateStr);
//   if(isNaN(d.getTime())) return dateStr; 
//   return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
// };

// export default function TripDetailsPage() {
//   const params = useParams();
//   const router = useRouter();
  
//   // --- STATE MANAGEMENT ---
//   // We use local state here because we are viewing a specific saved trip, 
//   // not the active global draft.
//   const [itinerary, setItinerary] = useState<StoredItineraryData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isDownloading, setIsDownloading] = useState(false);

//   // --- 1. DATA FETCHING (THE FIX) ---
//   useEffect(() => {
//     // 1. Get the ID from the URL (e.g., Italy's ID)
//     const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    
//     if (id) {
//       // 2. Fetch ONLY that specific trip from storage
//       const data = getItineraryById(id as string);
//       if (data) {
//           setItinerary(data);
//       }
//     }
//     setLoading(false);
//   }, [params]);

//   // --- 2. CURRENCY ---
//   const { currency, setCurrency, convert } = useCurrency('USD');

//   useEffect(() => {
//     if (itinerary?.selectedCurrency) {
//         setCurrency(itinerary.selectedCurrency);
//     }
//   }, [itinerary, setCurrency]);

//   // --- 3. CALCULATIONS ENGINE ---
//   const { totalDays, totalNights, startCity, endCity, uniqueCities, finalPerPerson, costLabel, rawDayPlans } = useMemo(() => {
//     if (!itinerary) return { totalDays: 0, totalNights: 0, startCity: '', endCity: '', uniqueCities: '', finalPerPerson: 0, costLabel: '', rawDayPlans: [] };

//     const routes = itinerary.routingData?.routes || [];
//     const _startCity = routes.length > 0 ? routes[0].cities[0]?.name : 'TBA';
//     const _endCity = routes.length > 0 ? routes[routes.length - 1].cities[0]?.name : 'TBA';
//     const _totalNights = routes.reduce((acc, curr) => acc + (curr.nights || 0), 0);
//     const _totalDays = _totalNights + 1;
//     const _uniqueCities = Array.from(new Set(routes.flatMap(r => r.cities.map(c => c.name)))).join(' | ');
//     const _rawDayPlans = (itinerary.dayWiseActivities || []) as DayPlan[];

//     // Price Logic
//     const travelerCount = safeNum(itinerary.numberOfTravelers) || 1;
//     let _finalPerPerson = 0;

//     if (itinerary.finalSellPrice && itinerary.finalSellPrice > 0) {
//         _finalPerPerson = itinerary.finalSellPrice / travelerCount;
//     } else if (itinerary.useFixedPrice && itinerary.fixedDepartures) {
//         const activeFixed = itinerary.fixedDepartures.find(d => d.isSelected);
//         if (activeFixed) _finalPerPerson = activeFixed.price;
//     } else {
//         let netTotal = 0;
//         _rawDayPlans.forEach(day => {
//             if(day.stays) day.stays.forEach(s => { if (isItemIncluded(s.inclusionType)) netTotal += safeNum(s.costPerNight) * safeNum(s.numRooms) * safeNum(s.nights); });
//             if(day.transports) day.transports.forEach(t => { if (isItemIncluded(t.inclusionType)) netTotal += safeNum(t.price) * safeNum(t.vehicleCount); });
//             if(day.activities) day.activities.forEach(a => { if (isItemIncluded(a.inclusionType)) netTotal += ((safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * travelerCount) + (a.guideType === 'guided' ? safeNum(a.guideFee) : 0); });
//             if(day.meals) day.meals.forEach(m => { if (isItemIncluded(m.inclusionType)) netTotal += safeNum(m.adultCost) * travelerCount; });
//         });

//         const netInSelected = convert(netTotal, currency);
//         const markupPercent = itinerary.markupPercentage ?? 20;
//         const grandTotal = netInSelected + (netInSelected * (markupPercent / 100));
//         const exactPP = travelerCount > 0 ? grandTotal / travelerCount : 0;
        
//         const mode = itinerary.roundingMode || 'none';
//         if (mode === '5') _finalPerPerson = Math.ceil(exactPP / 5) * 5;
//         else if (mode === '10') _finalPerPerson = Math.ceil(exactPP / 10) * 10;
//         else if (mode === '100') _finalPerPerson = Math.ceil(exactPP / 100) * 100;
//         else _finalPerPerson = exactPP;
//     }

//     const hasFlights = _rawDayPlans.some(day => day.transports?.some(t => t.mode === 'flight' && isItemIncluded(t.inclusionType)));
//     const _costLabel = hasFlights ? "(FLIGHTS INCL.)" : "(LAND ONLY)";

//     return { totalDays: _totalDays, totalNights: _totalNights, startCity: _startCity, endCity: _endCity, uniqueCities: _uniqueCities, finalPerPerson: _finalPerPerson, costLabel: _costLabel, rawDayPlans: _rawDayPlans };
//   }, [itinerary, currency, convert]);

//   // --- 4. RENDER HELPER ---
//   const getRenderableItemsForDay = (dayIndex: number, currentDay: DayPlan) => {
//     if (!itinerary) return [];
//     const items: any[] = [];
//     const plans = (itinerary.dayWiseActivities || []) as DayPlan[];

//     if(currentDay.activities) currentDay.activities.forEach(a => items.push({ ...a, category: 'Activity' }));
//     if(currentDay.transports) currentDay.transports.forEach(t => items.push({ ...t, category: 'Transport' }));
//     if(currentDay.meals) currentDay.meals.forEach(m => items.push({ ...m, category: 'Meal' }));
//     if(currentDay.stays) currentDay.stays.forEach(s => items.push({ ...s, category: 'Stay', status: 'Check-in' }));

//     for (let i = 0; i < dayIndex; i++) {
//         const pastDay = plans.find(d => d.dayNumber === (i + 1));
//         if (pastDay && pastDay.stays) {
//             pastDay.stays.forEach(stay => {
//                 const stayEndIndex = i + (stay.nights || 0); 
//                 if (dayIndex > i && dayIndex < stayEndIndex) {
//                     items.push({ ...stay, category: 'Stay', status: 'Residence' });
//                 }
//             });
//         }
//     }
//     return items.sort((a, b) => {
//         const order = { 'Activity': 1, 'Stay': 2 , 'Transport': 3, 'Meal': 4 };
//         return (order[a.category as keyof typeof order] || 5) - (order[b.category as keyof typeof order] || 5);
//     });
//   };

//   // --- 5. PDF GENERATION (Using Corrected Local 'itinerary' Data) ---
//   const handleDownloadPdf = () => {
//     if (!itinerary) return;
//     setIsDownloading(true);

//     try {
//         const doc = new jsPDF();
//         const pageWidth = doc.internal.pageSize.width;
        
//         // --- COLORS (Explicitly Typed for TS) ---
//         const redColor: [number, number, number] = [220, 38, 38]; 
//         const beigeColor: [number, number, number] = [254, 252, 232];
//         const headerBgColor: [number, number, number] = [255, 237, 213]; 
//         const borderColor: [number, number, number] = [200, 200, 200]; 
//         const blueTextColor: [number, number, number] = [29, 78, 216];
//         const gridHeaderColor: [number, number, number] = [249, 250, 251];

//         // --- HEADER ---
//         doc.setFillColor(redColor[0], redColor[1], redColor[2]); 
//         doc.rect(0, 0, pageWidth, 4, 'F'); 

//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(24);
//         doc.setTextColor(31, 41, 55); 
//         doc.text("TRAVDEK", 14, 20); 

//         doc.setFontSize(18);
//         doc.setTextColor(redColor[0], redColor[1], redColor[2]); 
//         doc.text((itinerary.tripName || "Trip").toUpperCase(), 14, 30);

//         doc.setFontSize(10);
//         doc.setTextColor(50, 50, 50);
//         doc.text(`${totalDays} Days | ${totalNights} Nights   |   Ref: ${itinerary.tripId || '####'}`, 14, 38);

//         const boxWidth = 50; const boxHeight = 25; const boxX = pageWidth - boxWidth - 14; const boxY = 12;
//         doc.setFillColor(redColor[0], redColor[1], redColor[2]); 
//         doc.rect(boxX, boxY, boxWidth, boxHeight, 'F');
//         doc.setTextColor(255, 255, 255);
//         doc.setFontSize(8);
//         doc.text("STARTING AT", boxX + (boxWidth/2), boxY + 8, { align: 'center' });
//         doc.setFontSize(16);
//         doc.setFont("helvetica", "bold");
//         const priceStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(finalPerPerson);
//         doc.text(`${priceStr}`, boxX + (boxWidth/2), boxY + 16, { align: 'center' });
//         doc.setFontSize(7);
//         doc.text("PP " + costLabel, boxX + (boxWidth/2), boxY + 22, { align: 'center' });

//         // --- META TABLE ---
//         autoTable(doc, {
//             startY: 45,
//             head: [],
//             body: [
//                 ["Release Date:", formatDate(new Date().toISOString()), "Trip Validity:", `${formatDate(itinerary.routingData?.startDate)} - ${formatDate(itinerary.routingData?.endDate)}`],
//                 ["Cities:", uniqueCities, "Route:", `${itinerary.selectedCountries?.length || 1} Country | ${uniqueCities.split('|').length} Cities`],
//                 ["Trip Type:", itinerary.packageType || "Premium", "Start/End:", `${startCity} / ${endCity}`]
//             ],
//             theme: 'grid',
//             styles: { fontSize: 8, cellPadding: 2, lineColor: borderColor },
//             columnStyles: {
//                 0: { fontStyle: 'bold', fillColor: gridHeaderColor, cellWidth: 25 },
//                 1: { textColor: blueTextColor },
//                 2: { fontStyle: 'bold', fillColor: gridHeaderColor, cellWidth: 25 },
//                 3: { textColor: blueTextColor }
//             },
//         });

//         // --- ITINERARY TABLE ---
//         // @ts-ignore
//         const tableStartY = doc.lastAutoTable.finalY + 10;
        
//         doc.setFontSize(12);
//         doc.setTextColor(redColor[0], redColor[1], redColor[2]);
//         doc.setFont("helvetica", "bold");
//         doc.text("ITINERARY DETAILS", 14, tableStartY - 3);
//         doc.setDrawColor(redColor[0], redColor[1], redColor[2]);
//         doc.line(14, tableStartY - 2, 60, tableStartY - 2); 

//         const tableBody: any[] = [];

//         rawDayPlans.forEach((day, dayIndex) => {
//             const items = getRenderableItemsForDay(dayIndex, day);
            
//             tableBody.push([{ 
//                 content: `DAY ${day.dayNumber} | ${formatDate(day.date)} | ${day.city}`, 
//                 colSpan: 3, 
//                 styles: { 
//                     fillColor: beigeColor, 
//                     textColor: [0, 0, 0], 
//                     fontStyle: 'bold',
//                     fontSize: 10,
//                     cellPadding: 3
//                 } 
//             }]);

//             if (items.length === 0) {
//                  tableBody.push([
//                     { content: "Leisure", styles: { fontStyle: 'bold' } },
//                     { content: "Free day for leisure.", colSpan: 2, styles: { fontStyle: 'italic', textColor: [100, 100, 100] } }
//                  ]);
//             } else {
//                 items.forEach((item) => {
//                     const status = (item.inclusionType || 'included').toUpperCase();
//                     let categoryLabel = item.category;
//                     if(item.category === 'Stay' && item.status === 'Residence') categoryLabel = 'Stay (Cont.)';
                    
//                     const col1 = `${categoryLabel}\n[${status}]`;

//                     let title = "";
//                     if (item.category === 'Activity') title = item.heading;
//                     else if (item.category === 'Stay') title = item.hotelName;
//                     else if (item.category === 'Transport') title = `${item.vehicleType} (${item.subType})`;
//                     else if (item.category === 'Meal') title = `${item.mealType}: ${item.restaurantName}`;

//                     let details = "";
//                     if (item.category === 'Activity') details = `${item.description || ''}\nSlot: ${item.slot} | Duration: ${item.duration}`;
//                     else if (item.category === 'Stay') details = `Type: ${item.stayType} | Room: ${item.roomCategory} | ${item.status === 'Check-in' ? item.nights + ' Nights' : 'Continuing'}`;
//                     else if (item.category === 'Transport') details = `Pickup: ${item.pickupLocation}\n${item.serviceDescription || ''}`;
//                     else if (item.category === 'Meal') details = `${item.cuisine} | ${item.menuType}`;

//                     tableBody.push([
//                         { content: col1, styles: { fontSize: 7, valign: 'top', fontStyle: 'bold', textColor: [80, 80, 80] } },
//                         { content: title, styles: { fontSize: 9, valign: 'top', fontStyle: 'bold', textColor: [0, 0, 0] } },
//                         { content: details, styles: { fontSize: 8, valign: 'top', textColor: [60, 60, 60] } }
//                     ]);
//                 });
//             }
//         });

//         autoTable(doc, {
//             startY: tableStartY,
//             head: [['Category', 'Title', 'Details']],
//             body: tableBody,
//             theme: 'grid',
//             headStyles: { 
//                 fillColor: headerBgColor, 
//                 textColor: [0, 0, 0], 
//                 lineColor: borderColor, 
//                 lineWidth: 0.1,
//                 fontStyle: 'bold'
//             },
//             styles: { 
//                 lineColor: borderColor, 
//                 lineWidth: 0.1,
//                 overflow: 'linebreak'
//             },
//             columnStyles: {
//                 0: { cellWidth: 25 },
//                 1: { cellWidth: 50 },
//                 2: { cellWidth: 'auto' }
//             }
//         });

//         // @ts-ignore
//         const finalY = doc.lastAutoTable.finalY + 10;
//         doc.setFontSize(8);
//         doc.setTextColor(100, 100, 100);
//         doc.text("Generated by Travdek. Prices and availability are subject to change.", pageWidth / 2, finalY + 10, { align: 'center' });

//         doc.save(`${itinerary.tripName || 'Itinerary'}.pdf`);

//     } catch (error) {
//         console.error("PDF Gen Error:", error);
//         alert("Failed to generate PDF.");
//     } finally {
//         setIsDownloading(false);
//     }
//   };

//   // --- 6. LOADING STATE ---
//   if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;
  
//   if (!itinerary) {
//       return (
//         <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
//             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
//                 <h3 className="text-xl font-bold text-gray-800">Itinerary Not Found</h3>
//                 <p className="text-gray-500 mt-2 mb-6">Could not load trip data for ID: {params.id}</p>
//                 <button onClick={() => router.push('/dashboard/trips')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Back to Dashboard</button>
//             </div>
//         </div>
//       );
//   }

//   // --- 7. HTML RENDER ---
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      
//       {/* Top Nav */}
//       <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm print:hidden">
//         <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
//              <button onClick={() => router.push('/dashboard/trips')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold text-sm">
//                 <ArrowLeft size={18} /> Back to Dashboard
//              </button>
//              <div className="flex gap-3">
//                  <button onClick={() => { if(itinerary.id) { sessionStorage.setItem('editing_itinerary_id', itinerary.id); router.push('/dashboard/itinerary/create'); } }} className="flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-sm font-bold">
//                     <Edit size={16}/> Edit Itinerary
//                  </button>
//                  <button onClick={handleDownloadPdf} disabled={isDownloading} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md disabled:opacity-50">
//                     {isDownloading ? <><Loader2 className="animate-spin" size={18} /> Downloading...</> : <><Download size={18} /> Download PDF</>}
//                  </button>
//              </div>
//         </div>
//       </div>

//       {/* HTML Preview (Using 'itinerary' state NOT 'itineraryData' context) */}
//       <div className="flex-1 w-full overflow-y-auto p-8 flex justify-center print:p-0 print:overflow-visible">
//         <div className="w-full max-w-[310mm] min-h-[297mm] shadow-2xl p-0 bg-white print:shadow-none print:max-w-full">
//             {/* Header */}
//             <div style={{ borderBottom: '4px solid #dc2626' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
//                     <div style={{ flex: 1, padding: '24px' }}>
//                         <div style={{ height: '48px', marginBottom: '16px' }}>
//                             <img src="/logo.png" alt="TRAVDEK" style={{ height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
//                         </div>
//                         <h1 style={{ color: '#dc2626', fontSize: '30px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, lineHeight: '1.1' }}>{itinerary.tripName}</h1>
//                         <div style={{ display: 'flex', gap: '8px', marginTop: '12px', fontSize: '14px', fontWeight: 'bold', color: '#202020ff' }}>
//                             <span style={{ backgroundColor: '#fef2f2', color:'#bb0000ff' ,  padding: '4px 8px', borderRadius: '4px' }}>{totalDays} Days | {totalNights} Nights</span>
//                             <span style={{ backgroundColor: '#f3f4f6', color:'#202020ff',  padding: '4px 8px', borderRadius: '4px' }}>Ref: {itinerary.tripId || "#######"}</span>
//                         </div>
//                     </div>
//                     <div style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '250px', textAlign: 'center' }}>
//                         <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.9, marginBottom: '4px' }}>Starting at</span>
//                         <span style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.025em', lineHeight: '1' }}>
//                         {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(finalPerPerson)}
//                             <span style={{ fontSize: '16px', fontWeight: '500', marginLeft: '4px' }}>PP*</span>
//                         </span>
//                         <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8, marginTop: '4px', letterSpacing: '0.05em' }}>{costLabel}</span>
//                     </div>
//                 </div>
//                 {/* Meta Grid */}
//                 <div style={{ borderTop: '1px solid #636363ff' }}>
//                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', fontSize: '12px' }}>
//                          <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Release Date:</div>
//                         <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{formatDate(new Date().toISOString())}</div>
//                         <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Trip Validity:</div>
//                         <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{formatDate(itinerary.routingData?.startDate)} to {formatDate(itinerary.routingData?.endDate)}</div>
//                         <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Country:</div>
//                         <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{itinerary.selectedCountries?.join(', ') || "India"}</div>
//                         <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Cities:</div>
//                         <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{uniqueCities}</div>
//                     </div>
//                 </div>
//             </div>

//             {/* Itinerary Body */}
//             <div style={{ marginTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '48px' }}>
//                 <h3 style={{ color: '#dc2626', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'underline', marginBottom: '16px', fontSize: '14px', letterSpacing: '0em' }}>Itinerary Details</h3>
//                 <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #636363ff', fontSize: '14px' }}>
//                     {/* Header */}
//                     <thead>
//                         <tr style={{ backgroundColor: '#ffedd5', color: '#2c3441ff', textTransform: 'uppercase', fontSize: '12px' }}>
//                             <th style={{ border: '1px solid #636363ff', padding: '12px', width: '96px', textAlign: 'center' }}>Day</th>
//                             <th style={{ border: '1px solid #636363ff', padding: '12px', width: '128px', textAlign: 'left' }}>City</th>
//                             <th style={{ border: '1px solid #636363ff', padding: '12px', width: '120px', textAlign: 'left' }}>Category</th>
//                             <th style={{ border: '1px solid #636363ff', padding: '12px', textAlign: 'left' }}>Description</th>
//                         </tr>
//                     </thead>
                    
//                     {/* Render Days */}
//                     {rawDayPlans.map((day, idx) => {
//                          const items = getRenderableItemsForDay(idx, day);
//                          return (
//                              <tbody key={day.dayNumber}>
//                                  <tr style={{ backgroundColor: '#fefce8', borderTop: '2px solid #636363ff' }}>
//                                      <td colSpan={4} style={{ backgroundColor: '#f3f4f6', color: '#303030', padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold' }}>DAY {day.dayNumber} | {formatDate(day.date)}</td>
//                                  </tr>
//                                  {items.length === 0 && (
//                                      <tr>
//                                          <td style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', textAlign: 'center' }}>{day.dayNumber}</td>
//                                          <td style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold' }}>{day.city}</td>
//                                          <td colSpan={2} style={{ border: '1px solid #636363ff', padding: '12px', color: '#9ca3af', fontStyle: 'italic' }}>Leisure day.</td>
//                                      </tr>
//                                  )}
//                                  {items.map((item, itemIdx) => (
//                                      <tr key={`${day.dayNumber}-${itemIdx}`}>
//                                          {itemIdx === 0 ? (
//                                              <>
//                                                  <td rowSpan={items.length} style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#ffffff', verticalAlign: 'top' }}>DAY {day.dayNumber}</td>
//                                                  <td rowSpan={items.length} style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', backgroundColor: '#ffffff', verticalAlign: 'top', color: '#dc2626' }}>{day.city}</td>
//                                              </>
//                                          ) : null}
//                                          <td style={{ border: '1px solid #636363ff', padding: '12px', verticalAlign: 'top' }}>
//                                              <b>{item.category}</b><br/>
//                                              <span style={{ fontSize: '10px', color: '#15803d', backgroundColor:'#f0fdf4', padding:'2px 4px', borderRadius:'4px', border:'1px solid #86efac' }}>{(item.inclusionType || 'included').toUpperCase()}</span>
//                                          </td>
//                                          <td style={{ border: '1px solid #636363ff', padding: '12px', verticalAlign: 'top' }}>
//                                              {item.category === 'Activity' && <b>{item.heading}</b>}
//                                              {item.category === 'Stay' && <b>{item.hotelName}</b>}
//                                              {item.category === 'Transport' && <b>{item.vehicleType}</b>}
//                                              {item.category === 'Meal' && <b>{item.restaurantName}</b>}
//                                              <div style={{fontSize:'12px', color:'#555', marginTop:'4px'}}>
//                                                  {item.description || item.serviceDescription || item.stayType || item.cuisine}
//                                              </div>
//                                          </td>
//                                      </tr>
//                                  ))}
//                              </tbody>
//                          );
//                     })}
//                 </table>
//             </div>
            
//             <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', marginTop: '32px', padding: '24px', textAlign: 'center', fontSize: '12px', color: '#505050ff' }}>
//                 <p>Generated by Travdek. Prices and availability are subject to change.</p>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// } 




















// "use client";

// import React, { useState, useEffect, useMemo } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable'; 
// import { 
//   ArrowLeft, Edit, Download, Loader2, MapPin, Calendar, Users, DollarSign
// } from 'lucide-react';

// // --- IMPORTS ---
// import { getItineraryById, StoredItineraryData } from '@/utils/itineraryStorage';
// import { DayPlan } from '../../create-day/constants/daywiseConstants'; 
// import { useCurrency } from '@/hooks/useCurrency'; 

// // --- HELPERS ---
// const isItemIncluded = (status?: string) => !status || status.toLowerCase() === 'included';

// const safeNum = (val: any) => {
//   const num = parseFloat(val);
//   return isNaN(num) ? 0 : num;
// };

// const formatDate = (dateStr?: string) => {
//   if (!dateStr) return 'TBA';
//   const d = new Date(dateStr);
//   if(isNaN(d.getTime())) return dateStr; 
//   return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
// };

// export default function TripDetailsPage() {
//   const params = useParams();
//   const router = useRouter();
  
//   const [itinerary, setItinerary] = useState<StoredItineraryData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isDownloading, setIsDownloading] = useState(false);

//   // --- 1. DATA FETCHING (Fixes "Wrong Country" Bug) ---
//   useEffect(() => {
//     const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
//     if (id) {
//       // Strictly fetch by ID from URL
//       const data = getItineraryById(id as string);
//       if (data) setItinerary(data);
//     }
//     setLoading(false);
//   }, [params]);

//   // --- 2. CURRENCY ---
//   const { currency, setCurrency, convert } = useCurrency('USD');

//   useEffect(() => {
//     if (itinerary?.selectedCurrency) {
//         setCurrency(itinerary.selectedCurrency);
//     }
//   }, [itinerary, setCurrency]);

//   // --- 3. CALCULATIONS ENGINE (Fixes Price Logic) ---
//   const { totalDays, totalNights, startCity, endCity, uniqueCities, finalPerPerson, costLabel, rawDayPlans } = useMemo(() => {
//     if (!itinerary) return { totalDays: 0, totalNights: 0, startCity: '', endCity: '', uniqueCities: '', finalPerPerson: 0, costLabel: '', rawDayPlans: [] };

//     const routes = itinerary.routingData?.routes || [];
//     const _startCity = routes.length > 0 ? routes[0].cities[0]?.name : 'TBA';
//     const _endCity = routes.length > 0 ? routes[routes.length - 1].cities[0]?.name : 'TBA';
//     const _totalNights = routes.reduce((acc, curr) => acc + (curr.nights || 0), 0);
//     const _totalDays = _totalNights + 1;
//     const _uniqueCities = Array.from(new Set(routes.flatMap(r => r.cities.map(c => c.name)))).join(' | ');
//     const _rawDayPlans = (itinerary.dayWiseActivities || []) as DayPlan[];

//     // --- PRICE LOGIC ---
//     // Ensure we don't divide by zero
//     const travelerCount = safeNum(itinerary.numberOfTravelers) > 0 ? safeNum(itinerary.numberOfTravelers) : 1;
//     let _finalPerPerson = 0;

//     // PRIORITY 1: Confirmed "Final Sell Price" (From Operations/Confirm Modal)
//     // IMPORTANT: 'finalSellPrice' is usually the TOTAL group value. We divide by pax to get PP.
//     if (itinerary.finalSellPrice !== undefined && itinerary.finalSellPrice > 0) {
//         _finalPerPerson = itinerary.finalSellPrice / travelerCount;
//     } 
//     // PRIORITY 2: Fixed Price Override (e.g. Fixed Departure)
//     else if (itinerary.useFixedPrice && itinerary.fixedDepartures) {
//         const activeFixed = itinerary.fixedDepartures.find(d => d.isSelected);
//         if (activeFixed) _finalPerPerson = activeFixed.price;
//     } 
//     // PRIORITY 3: Dynamic Calculation (If not confirmed yet)
//     else {
//         let netTotal = 0;
//         _rawDayPlans.forEach(day => {
//             if(day.stays) day.stays.forEach(s => { if (isItemIncluded(s.inclusionType)) netTotal += safeNum(s.costPerNight) * safeNum(s.numRooms) * safeNum(s.nights); });
//             if(day.transports) day.transports.forEach(t => { if (isItemIncluded(t.inclusionType)) netTotal += safeNum(t.price) * safeNum(t.vehicleCount); });
//             if(day.activities) day.activities.forEach(a => { if (isItemIncluded(a.inclusionType)) netTotal += ((safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * travelerCount) + (a.guideType === 'guided' ? safeNum(a.guideFee) : 0); });
//             if(day.meals) day.meals.forEach(m => { if (isItemIncluded(m.inclusionType)) netTotal += safeNum(m.adultCost) * travelerCount; });
//         });

//         const netInSelected = convert(netTotal, currency);
//         const markupPercent = itinerary.markupPercentage ?? 20;
//         const grandTotal = netInSelected + (netInSelected * (markupPercent / 100));
//         const exactPP = grandTotal / travelerCount;
        
//         // Rounding
//         const mode = itinerary.roundingMode || 'none';
//         if (mode === '5') _finalPerPerson = Math.ceil(exactPP / 5) * 5;
//         else if (mode === '10') _finalPerPerson = Math.ceil(exactPP / 10) * 10;
//         else if (mode === '100') _finalPerPerson = Math.ceil(exactPP / 100) * 100;
//         else _finalPerPerson = exactPP;
//     }

//     const hasFlights = _rawDayPlans.some(day => day.transports?.some(t => t.mode === 'flight' && isItemIncluded(t.inclusionType)));
//     const _costLabel = hasFlights ? "(FLIGHTS INCL.)" : "(LAND ONLY)";

//     return { totalDays: _totalDays, totalNights: _totalNights, startCity: _startCity, endCity: _endCity, uniqueCities: _uniqueCities, finalPerPerson: _finalPerPerson, costLabel: _costLabel, rawDayPlans: _rawDayPlans };
//   }, [itinerary, currency, convert]);

//   // --- 4. RENDER HELPER (Data Flattening) ---
//   const getRenderableItemsForDay = (dayIndex: number, currentDay: DayPlan) => {
//     if (!itinerary) return [];
//     const items: any[] = [];
//     const plans = (itinerary.dayWiseActivities || []) as DayPlan[];

//     // Push Items
//     if(currentDay.activities) currentDay.activities.forEach(a => items.push({ ...a, category: 'Activity' }));
//     if(currentDay.transports) currentDay.transports.forEach(t => items.push({ ...t, category: 'Transport' }));
//     if(currentDay.meals) currentDay.meals.forEach(m => items.push({ ...m, category: 'Meal' }));
//     if(currentDay.stays) currentDay.stays.forEach(s => items.push({ ...s, category: 'Stay', status: 'Check-in' }));

//     // Ghost Stays
//     for (let i = 0; i < dayIndex; i++) {
//         const pastDay = plans.find(d => d.dayNumber === (i + 1));
//         if (pastDay && pastDay.stays) {
//             pastDay.stays.forEach(stay => {
//                 const stayEndIndex = i + (stay.nights || 0); 
//                 if (dayIndex > i && dayIndex < stayEndIndex) {
//                     items.push({ ...stay, category: 'Stay', status: 'Residence' });
//                 }
//             });
//         }
//     }
//     // Sort: Activity -> Stay -> Transport -> Meal
//     return items.sort((a, b) => {
//         const order = { 'Activity': 1, 'Stay': 2 , 'Transport': 3, 'Meal': 4 };
//         return (order[a.category as keyof typeof order] || 5) - (order[b.category as keyof typeof order] || 5);
//     });
//   };

//   // --- 5. PDF GENERATION (Fixed Data Mapping & Page Breaks) ---
//   const handleDownloadPdf = () => {
//     if (!itinerary) return;
//     setIsDownloading(true);

//     try {
//         const doc = new jsPDF();
//         const pageWidth = doc.internal.pageSize.width;
        
//         // Colors
//         const redColor: [number, number, number] = [220, 38, 38]; 
//         const beigeColor: [number, number, number] = [254, 252, 232];
//         const headerBgColor: [number, number, number] = [255, 237, 213]; 
//         const borderColor: [number, number, number] = [200, 200, 200]; 
//         const blueTextColor: [number, number, number] = [29, 78, 216];
//         const gridHeaderColor: [number, number, number] = [249, 250, 251];

//         // --- Header ---
//         doc.setFillColor(...redColor); 
//         doc.rect(0, 0, pageWidth, 4, 'F'); 

//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(24);
//         doc.setTextColor(31, 41, 55); 
//         doc.text("TRAVDEK", 14, 20); 

//         doc.setFontSize(18);
//         doc.setTextColor(...redColor); 
//         doc.text((itinerary.tripName || "Trip").toUpperCase(), 14, 30);

//         doc.setFontSize(10);
//         doc.setTextColor(50, 50, 50);
//         doc.text(`${totalDays} Days | ${totalNights} Nights   |   Ref: ${itinerary.tripId || '####'}`, 14, 38);

//         // Price Box
//         const boxWidth = 50; const boxHeight = 25; const boxX = pageWidth - boxWidth - 14; const boxY = 12;
//         doc.setFillColor(...redColor); 
//         doc.rect(boxX, boxY, boxWidth, boxHeight, 'F');
//         doc.setTextColor(255, 255, 255);
//         doc.setFontSize(8);
//         doc.text("STARTING AT", boxX + (boxWidth/2), boxY + 8, { align: 'center' });
//         doc.setFontSize(16);
//         doc.setFont("helvetica", "bold");
//         const priceStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(finalPerPerson);
//         doc.text(`${priceStr}`, boxX + (boxWidth/2), boxY + 16, { align: 'center' });
//         doc.setFontSize(7);
//         doc.text("PP " + costLabel, boxX + (boxWidth/2), boxY + 22, { align: 'center' });

//         // --- Meta Grid ---
//         autoTable(doc, {
//             startY: 45,
//             head: [],
//             body: [
//                 ["Release Date:", formatDate(new Date().toISOString()), "Trip Validity:", `${formatDate(itinerary.routingData?.startDate)} - ${formatDate(itinerary.routingData?.endDate)}`],
//                 ["Cities:", uniqueCities, "Route:", `${itinerary.selectedCountries?.length || 1} Country | ${uniqueCities.split('|').length} Cities`],
//                 ["Trip Type:", itinerary.packageType || "Premium", "Start/End:", `${startCity} / ${endCity}`]
//             ],
//             theme: 'grid',
//             styles: { fontSize: 8, cellPadding: 2, lineColor: borderColor },
//             columnStyles: {
//                 0: { fontStyle: 'bold', fillColor: gridHeaderColor, cellWidth: 25 },
//                 1: { textColor: blueTextColor },
//                 2: { fontStyle: 'bold', fillColor: gridHeaderColor, cellWidth: 25 },
//                 3: { textColor: blueTextColor }
//             },
//         });

//         // --- Itinerary Table (Rich Data) ---
//         // @ts-ignore
//         const tableStartY = doc.lastAutoTable.finalY + 10;
        
//         doc.setFontSize(12);
//         doc.setTextColor(...redColor);
//         doc.setFont("helvetica", "bold");
//         doc.text("ITINERARY DETAILS", 14, tableStartY - 3);
//         doc.setDrawColor(...redColor);
//         doc.line(14, tableStartY - 2, 60, tableStartY - 2); 

//         const tableBody: any[] = [];

//         rawDayPlans.forEach((day, dayIndex) => {
//             const items = getRenderableItemsForDay(dayIndex, day);
            
//             // 1. Day Heading
//             tableBody.push([{ 
//                 content: `DAY ${day.dayNumber} | ${formatDate(day.date)} | ${day.city}`, 
//                 colSpan: 3, 
//                 styles: { 
//                     fillColor: beigeColor, 
//                     textColor: [0, 0, 0], 
//                     fontStyle: 'bold',
//                     fontSize: 10,
//                     cellPadding: 3
//                 } 
//             }]);

//             if (items.length === 0) {
//                  tableBody.push([
//                     { content: "Leisure", styles: { fontStyle: 'bold' } },
//                     { content: "Free day for leisure.", colSpan: 2, styles: { fontStyle: 'italic', textColor: [100, 100, 100] } }
//                  ]);
//             } else {
//                 items.forEach((item) => {
//                     // 1. Category Column
//                     const status = (item.inclusionType || 'included').toUpperCase();
//                     let categoryLabel = item.category;
//                     if(item.category === 'Stay' && item.status === 'Residence') categoryLabel = 'Stay (Cont.)';
//                     const col1 = `${categoryLabel}\n[${status}]`;

//                     // 2. Title Column
//                     let title = "";
//                     if (item.category === 'Activity') title = item.heading;
//                     else if (item.category === 'Stay') title = item.hotelName;
//                     else if (item.category === 'Transport') title = `${item.vehicleType} (${item.subType})`;
//                     else if (item.category === 'Meal') title = `${item.mealType}: ${item.restaurantName}`;

//                     // 3. Details Column (RICH TEXT MAPPING)
//                     let details = "";
//                     if (item.category === 'Activity') {
//                         details = `${item.description || ''}\n`;
//                         if(item.slot) details += `Slot: ${item.slot}  `;
//                         if(item.startTime) details += `Start: ${item.startTime}  `;
//                         if(item.duration) details += `Duration: ${item.duration}\n`;
//                         if(item.pickupLocation) details += `Pickup: ${item.pickupLocation}`;
//                     }
//                     else if (item.category === 'Stay') {
//                         details = `Type: ${item.stayType} | Room: ${item.roomCategory}\n`;
//                         if (item.status === 'Check-in') details += `Check-in | ${item.nights} Nights`;
//                         else details += `Continuing Stay`;
//                     }
//                     else if (item.category === 'Transport') {
//                         if(item.serviceDescription) details += `${item.serviceDescription}\n`;
//                         if(item.pickupLocation) details += `Pickup: ${item.pickupLocation} `;
//                         if(item.pickupTime) details += `(@ ${item.pickupTime})\n`;
//                         if(item.subType === 'transfer' && item.dropoffLocation) details += `Drop: ${item.dropoffLocation}`;
//                         if(item.subType === 'disposal' && item.duration) details += `Duration: ${item.duration}`;
//                     }
//                     else if (item.category === 'Meal') {
//                         details = `${item.cuisine} | ${item.menuType}`;
//                     }

//                     tableBody.push([
//                         { content: col1, styles: { fontSize: 7, valign: 'top', fontStyle: 'bold', textColor: [80, 80, 80] } },
//                         { content: title, styles: { fontSize: 9, valign: 'top', fontStyle: 'bold', textColor: [0, 0, 0] } },
//                         { content: details, styles: { fontSize: 8, valign: 'top', textColor: [60, 60, 60] } }
//                     ]);
//                 });
//             }
//         });

//         autoTable(doc, {
//             startY: tableStartY,
//             head: [['Category', 'Title', 'Details']],
//             body: tableBody,
//             theme: 'grid',
//             headStyles: { 
//                 fillColor: headerBgColor, 
//                 textColor: [0, 0, 0], 
//                 lineColor: borderColor, 
//                 lineWidth: 0.1,
//                 fontStyle: 'bold'
//             },
//             styles: { 
//                 lineColor: borderColor, 
//                 lineWidth: 0.1,
//                 overflow: 'linebreak'
//             },
//             columnStyles: {
//                 0: { cellWidth: 25 },
//                 1: { cellWidth: 50 },
//                 2: { cellWidth: 'auto' }
//             }
//         });

//         // @ts-ignore
//         const finalY = doc.lastAutoTable.finalY + 10;
//         doc.setFontSize(8);
//         doc.setTextColor(100, 100, 100);
//         doc.text("Generated by Travdek. Prices and availability are subject to change.", pageWidth / 2, finalY + 10, { align: 'center' });

//         doc.save(`${itinerary.tripName || 'Itinerary'}.pdf`);

//     } catch (error) {
//         console.error("PDF Gen Error:", error);
//         alert("Failed to generate PDF.");
//     } finally {
//         setIsDownloading(false);
//     }
//   };

//   // --- 6. LOADING STATE ---
//   if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;
//   if (!itinerary) return <div className="h-screen flex items-center justify-center">Itinerary Not Found</div>;

//   // --- 7. HTML RENDER ---
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      
//       {/* Top Nav */}
//       <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm print:hidden">
//         <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
//              <button onClick={() => router.push('/dashboard/trips')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold text-sm">
//                 <ArrowLeft size={18} /> Back to Dashboard
//              </button>
//              <div className="flex gap-3">
//                  <button onClick={() => { if(itinerary.id) { sessionStorage.setItem('editing_itinerary_id', itinerary.id); router.push('/dashboard/itinerary/create'); } }} className="flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-sm font-bold">
//                     <Edit size={16}/> Edit Itinerary
//                  </button>
//                  <button onClick={handleDownloadPdf} disabled={isDownloading} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md disabled:opacity-50">
//                     {isDownloading ? <><Loader2 className="animate-spin" size={18} /> Downloading...</> : <><Download size={18} /> Download PDF</>}
//                  </button>
//              </div>
//         </div>
//       </div>

//       {/* HTML PREVIEW */}
//       <div className="flex-1 w-full overflow-y-auto p-8 flex justify-center print:p-0 print:overflow-visible">
//         <div className="w-full max-w-[310mm] min-h-[297mm] shadow-2xl p-0 bg-white print:shadow-none print:max-w-full">
            
//             {/* Header */}
//             <div style={{ borderBottom: '4px solid #dc2626' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
//                     <div style={{ flex: 1, padding: '24px' }}>
//                         <div style={{ height: '48px', marginBottom: '16px' }}>
//                             <img src="/logo.png" alt="TRAVDEK" style={{ height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
//                         </div>
//                         <h1 style={{ color: '#dc2626', fontSize: '30px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, lineHeight: '1.1' }}>{itinerary.tripName}</h1>
//                         <div style={{ display: 'flex', gap: '8px', marginTop: '12px', fontSize: '14px', fontWeight: 'bold', color: '#202020ff' }}>
//                             <span style={{ backgroundColor: '#fef2f2', color:'#bb0000ff' ,  padding: '4px 8px', borderRadius: '4px' }}>{totalDays} Days | {totalNights} Nights</span>
//                             <span style={{ backgroundColor: '#f3f4f6', color:'#202020ff',  padding: '4px 8px', borderRadius: '4px' }}>Ref: {itinerary.tripId || "#######"}</span>
//                         </div>
//                     </div>
//                     <div style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '250px', textAlign: 'center' }}>
//                         <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.9, marginBottom: '4px' }}>Starting at</span>
//                         <span style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.025em', lineHeight: '1' }}>
//                         {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(finalPerPerson)}
//                             <span style={{ fontSize: '16px', fontWeight: '500', marginLeft: '4px' }}>PP*</span>
//                         </span>
//                         <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8, marginTop: '4px', letterSpacing: '0.05em' }}>{costLabel}</span>
//                     </div>
//                 </div>
                
//                 {/* Meta Grid */}
//                 <div style={{ borderTop: '1px solid #636363ff' }}>
//                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', fontSize: '12px' }}>
//                          <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Release Date:</div>
//                         <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{formatDate(new Date().toISOString())}</div>
//                         <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Trip Validity:</div>
//                         <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{formatDate(itinerary.routingData?.startDate)} to {formatDate(itinerary.routingData?.endDate)}</div>
//                         <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Country:</div>
//                         <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{itinerary.selectedCountries?.join(', ') || "India"}</div>
//                         <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Cities:</div>
//                         <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{uniqueCities}</div>
//                     </div>
//                 </div>
//             </div>

//             {/* Itinerary Body */}
//             <div style={{ marginTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '48px' }}>
//                 <h3 style={{ color: '#dc2626', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'underline', marginBottom: '16px', fontSize: '14px', letterSpacing: '0em' }}>Itinerary Details</h3>
//                 <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #636363ff', fontSize: '14px' }}>
//                     <thead>
//                         <tr style={{ backgroundColor: '#ffedd5', color: '#2c3441ff', textTransform: 'uppercase', fontSize: '12px' }}>
//                             <th style={{ border: '1px solid #636363ff', padding: '12px', width: '96px', textAlign: 'center' }}>Day</th>
//                             <th style={{ border: '1px solid #636363ff', padding: '12px', width: '128px', textAlign: 'left' }}>City</th>
//                             <th style={{ border: '1px solid #636363ff', padding: '12px', width: '120px', textAlign: 'left' }}>Category</th>
//                             <th style={{ border: '1px solid #636363ff', padding: '12px', textAlign: 'left' }}>Description</th>
//                         </tr>
//                     </thead>
//                     {rawDayPlans.map((day, idx) => {
//                          const items = getRenderableItemsForDay(idx, day);
//                          return (
//                              <tbody key={day.dayNumber}>
//                                  <tr style={{ backgroundColor: '#fefce8', borderTop: '2px solid #636363ff' }}>
//                                      <td colSpan={4} style={{ backgroundColor: '#f3f4f6', color: '#303030', padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold' }}>DAY {day.dayNumber} | {formatDate(day.date)}</td>
//                                  </tr>
//                                  {items.length === 0 && (
//                                      <tr>
//                                          <td style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', textAlign: 'center' }}>{day.dayNumber}</td>
//                                          <td style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold' }}>{day.city}</td>
//                                          <td colSpan={2} style={{ border: '1px solid #636363ff', padding: '12px', color: '#9ca3af', fontStyle: 'italic' }}>Leisure day.</td>
//                                      </tr>
//                                  )}
//                                  {items.map((item, itemIdx) => (
//                                      <tr key={`${day.dayNumber}-${itemIdx}`}>
//                                          {itemIdx === 0 ? (
//                                              <>
//                                                  <td rowSpan={items.length} style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#ffffff', verticalAlign: 'top' }}>DAY {day.dayNumber}</td>
//                                                  <td rowSpan={items.length} style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', backgroundColor: '#ffffff', verticalAlign: 'top', color: '#dc2626' }}>{day.city}</td>
//                                              </>
//                                          ) : null}
//                                          <td style={{ border: '1px solid #636363ff', padding: '12px', verticalAlign: 'top' }}>
//                                              <b>{item.category}</b><br/>
//                                              <span style={{ fontSize: '10px', color: '#15803d', backgroundColor:'#f0fdf4', padding:'2px 4px', borderRadius:'4px', border:'1px solid #86efac' }}>{(item.inclusionType || 'included').toUpperCase()}</span>
//                                          </td>
//                                          <td style={{ border: '1px solid #636363ff', padding: '12px', verticalAlign: 'top' }}>
//                                              {item.category === 'Activity' && 
//                                                 <div>
//                                                     <b>{item.heading}</b>
//                                                     <div style={{fontSize:'12px', color:'#555', marginTop:'4px'}}>{item.description}</div>
//                                                     <div style={{fontSize:'11px', color:'#777', marginTop:'4px', display:'flex', gap:'8px'}}>
//                                                         <span>Slot: {item.slot}</span>
//                                                         <span>Start: {item.startTime}</span>
//                                                         <span>Pickup: {item.pickupLocation}</span>
//                                                     </div>
//                                                 </div>
//                                              }
//                                              {item.category === 'Stay' && 
//                                                 <div>
//                                                     <b>{item.hotelName}</b> <span className="text-yellow-500 text-xs">★{item.rating}</span>
//                                                     <div style={{fontSize:'12px', color:'#555', marginTop:'4px'}}>
//                                                         {item.status === 'Check-in' ? `Check-in: ${item.roomCategory} (${item.stayType})` : 'Continuing Stay'}
//                                                     </div>
//                                                 </div>
//                                              }
//                                              {item.category === 'Transport' && 
//                                                 <div>
//                                                     <b>{item.vehicleType}</b> <span className="text-xs text-gray-500">({item.subType})</span>
//                                                     <div style={{fontSize:'12px', color:'#555', marginTop:'4px'}}>{item.serviceDescription}</div>
//                                                     <div style={{fontSize:'11px', color:'#777', marginTop:'4px'}}>
//                                                         Pickup: {item.pickupLocation} | Drop: {item.dropoffLocation || 'N/A'}
//                                                     </div>
//                                                 </div>
//                                              }
//                                              {item.category === 'Meal' && 
//                                                 <div>
//                                                     <b>{item.mealType}: {item.restaurantName}</b>
//                                                     <div style={{fontSize:'12px', color:'#555', marginTop:'4px'}}>{item.cuisine} | {item.menuType}</div>
//                                                 </div>
//                                              }
//                                          </td>
//                                      </tr>
//                                  ))}
//                              </tbody>
//                          );
//                     })}
//                 </table>
//             </div>
            
//             <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', marginTop: '32px', padding: '24px', textAlign: 'center', fontSize: '12px', color: '#505050ff' }}>
//                 <p>Generated by Travdek. Prices and availability are subject to change.</p>
//             </div>
//         </div>
//       </div>
//     </div> 
//   );
// } 































//PDF PART 
//   const handleDownloadPdf = () => {
//     if (!itinerary) return;
//     setIsDownloading(true);

//     try {
//         const doc = new jsPDF();
//         const pageWidth = doc.internal.pageSize.width;
        
//         // --- COLORS (Matched to your Screenshots) ---
//         const brandRed: [number, number, number] = [220, 38, 38];       // The main red
//         const textDark: [number, number, number] = [31, 41, 55];        // Dark grey text
//         const textLight: [number, number, number] = [107, 114, 128];    // Light grey text
//         const beigeBg: [number, number, number] = [255, 247, 237];      // Day header background (Orange-50/Beige)
//         const greenText: [number, number, number] = [22, 163, 74];      // Success Green for badges
//         const greenBg: [number, number, number] = [220, 252, 231];      // Light Green for badge background
//         const borderColor: [number, number, number] = [229, 231, 235];  // Light grey border

//         // --- 1. HEADER SECTION ---
//         // Red Top Bar
//         doc.setFillColor(brandRed[0], brandRed[1], brandRed[2]); 
//         doc.rect(0, 0, pageWidth, 4, 'F'); 

//         // Logo / Brand Name
//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(24);
//         doc.setTextColor(textDark[0], textDark[1], textDark[2]); 
//         doc.text("TRAVDEK", 14, 20); 

//         // Trip Name (Red)
//         doc.setFontSize(18);
//         doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]); 
//         const tripName = (itinerary.tripName || "Italy Tour (Copy)").toUpperCase();
//         doc.text(tripName, 14, 30);

//         // Trip Meta (Days | Ref)
//         doc.setFontSize(10);
//         doc.setTextColor(textDark[0], textDark[1], textDark[2]);
//         doc.setFont("helvetica", "normal");
//         // Example logic for days - replace with your actual variables
//         doc.text(`${totalDays} Days | ${totalNights} Nights   |   Ref: ${itinerary.tripId || 'COPY-307539'}`, 14, 38);

//         // --- 2. PRICE BOX (Top Right) ---
//         // Matched exact look of screenshot
//         const boxWidth = 65; 
//         const boxHeight = 28; 
//         const boxX = pageWidth - boxWidth - 14; 
//         const boxY = 12;
        
//         doc.setFillColor(brandRed[0], brandRed[1], brandRed[2]); 
//         doc.rect(boxX, boxY, boxWidth, boxHeight, 'F');
        
//         doc.setTextColor(255, 255, 255);
//         doc.setFontSize(8);
//         doc.setFont("helvetica", "bold");
//         doc.text("TOTAL TRIP COST", boxX + (boxWidth/2), boxY + 8, { align: 'center' });
        
//         doc.setFontSize(18);
//         // Replace with your formatting logic
//         const totalStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(finalGroupPrice);
//         doc.text(totalStr, boxX + (boxWidth/2), boxY + 18, { align: 'center' });
        
//         doc.setFontSize(7);
//         doc.setFont("helvetica", "normal");
//         const ppStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(finalPerPerson);
//         doc.text(`(${ppStr} per person) LAND ONLY`, boxX + (boxWidth/2), boxY + 24, { align: 'center' });

//         // --- 3. METADATA GRID ---
//         // We use autoTable but style it to look like the clean info grid
//         autoTable(doc, {
//             startY: 45,
//             head: [],
//             body: [
//                 ["Release Date:", formatDate(new Date().toISOString()), "Trip Validity:", `${formatDate(itinerary.routingData?.startDate)} - ${formatDate(itinerary.routingData?.endDate)}`],
//                 ["Cities:", uniqueCities, "Route:", `1 Country | ${uniqueCities.split('|').length} Cities`],
//                 ["Trip Type:", "Land", "Start/End:", `${startCity} / ${endCity}`]
//             ],
//             theme: 'plain', // Removes default heavy borders
//             styles: { 
//                 fontSize: 8, 
//                 cellPadding: 1.5, 
//                 textColor: textDark 
//             },
//             columnStyles: {
//                 0: { fontStyle: 'bold', cellWidth: 25 }, // Label
//                 1: { textColor: [29, 78, 216] },         // Blue Text for value
//                 2: { fontStyle: 'bold', cellWidth: 25 }, // Label
//                 3: { textColor: [29, 78, 216] }          // Blue Text for value
//             },
//             didDrawCell: (data) => {
//                 // Optional: Draw bottom border for grid look if needed
//                 if(data.column.index === 3 && data.row.index < 2) {
//                      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
//                      doc.line(14, data.cell.y + data.cell.height, pageWidth - 14, data.cell.y + data.cell.height);
//                 }
//             }
//         });

//         // --- 4. ITINERARY DETAILS TABLE ---
//         // @ts-ignore
//         const tableStartY = doc.lastAutoTable.finalY + 10;
        
//         // "ITINERARY DETAILS" Header
//         doc.setFontSize(11);
//         doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
//         doc.setFont("helvetica", "bold");
//         doc.text("ITINERARY DETAILS", 14, tableStartY - 4);
//         doc.setDrawColor(brandRed[0], brandRed[1], brandRed[2]);
//         doc.setLineWidth(0.5);
//         doc.line(14, tableStartY - 2, 60, tableStartY - 2); 

//         // Prepare Data for the Table
//         const tableBody: any[] = [];

//         rawDayPlans.forEach((day, dayIndex) => {
//             const items = getRenderableItemsForDay(dayIndex, day);
            
//             // -- ROW TYPE A: Day Header (The Beige Bar) --
//             tableBody.push([{ 
//                 content: `DAY ${day.dayNumber} | TBA | ${day.city}`, 
//                 colSpan: 3, 
//                 styles: { 
//                     fillColor: beigeBg, 
//                     textColor: textDark, 
//                     fontStyle: 'bold', 
//                     fontSize: 10, 
//                     cellPadding: {top: 5, bottom: 5, left: 3} 
//                 } 
//             }]);

//             // -- ROW TYPE B: Content Items --
//             if (items.length === 0) {
//                  tableBody.push([
//                     { content: "", styles: { minCellHeight: 15 } }, // Empty col for alignment
//                     { content: "Leisure", styles: { fontStyle: 'bold' } },
//                     { content: "Free day for leisure.", styles: { fontStyle: 'italic', textColor: textLight } }
//                  ]);
//             } else {
//                 items.forEach((item) => {
//                     // 1. Prepare Badge Data
//                     const status = (item.inclusionType || 'included').toUpperCase();
                    
//                     // 2. Prepare Title
//                     let title = "";
//                     if (item.category === 'Activity') title = item.heading;
//                     else if (item.category === 'Stay') title = item.hotelName;
//                     else if (item.category === 'Transport') title = `${item.vehicleType} ${item.subType ? `(${item.subType})` : ''}`;
//                     else if (item.category === 'Meal') title = `${item.mealType}: ${item.restaurantName || 'City Restaurant'}`;

//                     // 3. Prepare Details (Description + Meta)
//                     let details = "";
//                     if (item.category === 'Activity') {
//                         details = item.description || '';
//                         // Append meta info visually distinct? For PDF just text for now
//                         const meta = [];
//                         if(item.slot) meta.push(`Slot: ${item.slot}`);
//                         if(item.duration) meta.push(`Duration: ${item.duration}`);
//                         if(item.startTime) meta.push(`Start: ${item.startTime}`);
//                         if(item.pickupLocation) meta.push(`Pickup: ${item.pickupLocation}`);
                        
//                         if(meta.length > 0) details += "\n\n" + meta.join("   ");
//                     }
//                     else if (item.category === 'Stay') {
//                         details = `Type: ${item.stayType || 'Standard'} | Room: ${item.roomCategory || 'Standard Room'}\n`;
//                         if (item.status === 'Check-in') details += `${item.nights} Nights Stay`;
//                         else details += `Continuing Stay`;
//                     }
//                     else if (item.category === 'Transport') {
//                         details = item.serviceDescription || '';
//                         const meta = [];
//                         if(item.pickupLocation) meta.push(`PICKUP: ${item.pickupLocation}`);
//                         if(item.dropoffLocation) meta.push(`DROP: ${item.dropoffLocation}`);
//                         if(item.startTime) meta.push(`START: ${item.startTime}`);
//                         if(meta.length > 0) details += "\n" + meta.join("   ");
//                     }
//                     else if (item.category === 'Meal') {
//                         details = `${item.cuisine || 'Multi-Cuisine'} | ${item.menuType || 'Buffet'}`;
//                     }

//                     // Push row. Note: We put badge TEXT in col 0, but we will draw the graphic in hooks
//                     tableBody.push([
//                         { 
//                             content: item.category, // e.g. "Activity"
//                             badgeText: status, // Custom property we will use in didDrawCell
//                             styles: { valign: 'top', fontStyle: 'bold', textColor: textDark, fontSize: 9 } 
//                         },
//                         { 
//                             content: title, 
//                             styles: { valign: 'top', fontStyle: 'bold', textColor: textDark, fontSize: 10 } 
//                         },
//                         { 
//                             content: details, 
//                             styles: { valign: 'top', textColor: textLight, fontSize: 9 } 
//                         }
//                     ]);
//                 });
//             }
//         });

//         // --- DRAW TABLE ---
//         autoTable(doc, {
//             startY: tableStartY,
//             head: [['Category', 'Title', 'Details']],
//             body: tableBody,
//             theme: 'grid',
//             // HEADER STYLES (The Beige header row for "Category | Title | Details")
//             headStyles: { 
//                 fillColor: [253, 230, 138], // A slightly darker beige for the main table header
//                 textColor: textDark, 
//                 lineColor: borderColor, 
//                 lineWidth: 0.1, 
//                 fontStyle: 'bold',
//                 fontSize: 8
//             },
//             // BODY STYLES
//             styles: { 
//                 lineColor: borderColor, 
//                 lineWidth: 0.1, 
//                 cellPadding: 4,
//                 overflow: 'linebreak' 
//             },
//             columnStyles: { 
//                 0: { cellWidth: 35 }, 
//                 1: { cellWidth: 50 }, 
//                 2: { cellWidth: 'auto' } 
//             },
            
//             // --- THE MAGIC: Custom Drawing for Badges ---
//             didDrawCell: (data) => {
//                 // Check if this is the "Category" column and not a header row
//                 if (data.section === 'body' && data.column.index === 0 && data.cell.raw && (data.cell.raw as any).badgeText) {
                    
//                     const badgeText = (data.cell.raw as any).badgeText; // e.g. "INCLUDED"
                    
//                     // Coordinates for the Badge (Below the Category text)
//                     const badgeX = data.cell.x + 4;
//                     const badgeY = data.cell.y + 12; // Push it down below "Activity"
//                     const badgeWidth = doc.getTextWidth(badgeText) + 6;
//                     const badgeHeight = 5;

//                     // Draw Badge Background (Rounded Rect)
//                     // If "INCLUDED" use Green, else use custom
//                     if(badgeText === 'INCLUDED') {
//                         doc.setDrawColor(greenText[0], greenText[1], greenText[2]); // Green Border
//                         doc.setFillColor(255, 255, 255); // White BG (like screenshot)
//                         doc.setTextColor(greenText[0], greenText[1], greenText[2]); // Green Text
//                     } else {
//                         // e.g. DISPOSAL / TRANSFER
//                         doc.setDrawColor(textLight[0], textLight[1], textLight[2]);
//                         doc.setFillColor(255, 255, 255);
//                         doc.setTextColor(textLight[0], textLight[1], textLight[2]);
//                     }

//                     // Draw Rect
//                     doc.setLineWidth(0.1);
//                     doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 1, 1, 'FD');

//                     // Draw Text
//                     doc.setFontSize(6);
//                     doc.setFont("helvetica", "bold");
//                     doc.text(badgeText, badgeX + 3, badgeY + 3.5);
//                 }
//             }
//         });

//         // Footer
//         // @ts-ignore
//         const finalY = doc.lastAutoTable.finalY + 10;
//         doc.setFontSize(8);
//         doc.setTextColor(150, 150, 150);
//         doc.text("Generated by Travdek. Prices and availability are subject to change.", pageWidth / 2, finalY, { align: 'center' });

//         doc.save(`${itinerary.tripName || 'Itinerary'}.pdf`);

//     } catch (error) {
//         console.error("PDF Gen Error:", error);
//         alert("Failed to generate PDF.");
//     } finally {
//         setIsDownloading(false);
//     }
// };



































"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import html2canvas from 'html2canvas';
import { 
  ArrowLeft, Edit, Download, Loader2, Users
} from 'lucide-react';

// --- IMPORTS ---
import { getItineraryById, StoredItineraryData } from '@/utils/itineraryStorage';
import { DayPlan } from '../../create-day/constants/daywiseConstants'; 
import { useCurrency } from '@/hooks/useCurrency'; 

// --- HELPERS ---
const isItemIncluded = (status?: string) => !status || status.toLowerCase() === 'included';

const safeNum = (val: any) => {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'TBA';
  const d = new Date(dateStr);
  if(isNaN(d.getTime())) return dateStr; 
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  
  const [itinerary, setItinerary] = useState<StoredItineraryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // --- 1. DATA FETCHING ---
  useEffect(() => {
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    if (id) {
      const data = getItineraryById(id as string);
      if (data) setItinerary(data);
    }
    setLoading(false);
  }, [params]);

  // --- 2. CURRENCY ---
  const { currency, setCurrency, convert } = useCurrency('USD');

  useEffect(() => {
    if (itinerary?.selectedCurrency) {
        setCurrency(itinerary.selectedCurrency);
    }
  }, [itinerary, setCurrency]);


// --- 3. CALCULATIONS ENGINE (UPDATED: Fixed Price & Date Auto-Correction) ---
  const { 
      totalDays, totalNights, startCity, endCity, uniqueCities, 
      finalGroupPrice, finalPerPerson, costLabel, rawDayPlans, travelerCount 
  } = useMemo(() => {
    if (!itinerary) return { 
        totalDays: 0, totalNights: 0, startCity: '', endCity: '', 
        uniqueCities: '', finalGroupPrice: 0, finalPerPerson: 0, 
        costLabel: '', rawDayPlans: [], travelerCount: 1 
    };

    const routes = itinerary.routingData?.routes || [];
    const _startCity = routes.length > 0 ? routes[0].cities[0]?.name : 'TBA';
    const _endCity = routes.length > 0 ? routes[routes.length - 1].cities[0]?.name : 'TBA';
    const _totalNights = routes.reduce((acc, curr) => acc + (curr.nights || 0), 0);
    const _totalDays = _totalNights + 1;
    const _uniqueCities = Array.from(new Set(routes.flatMap(r => r.cities.map(c => c.name)))).join(' | ');
    const _travelerCount = safeNum(itinerary.numberOfTravelers) > 0 ? safeNum(itinerary.numberOfTravelers) : 1;

    // --- A. DATE AUTO-CORRECTION LOGIC ---
    // This ensures the preview always shows the CORRECT dates based on the trip Start Date,
    // even if the saved 'dayWiseActivities' has old dates from the template.
    const tripStartDate = itinerary.routingData?.startDate ? new Date(itinerary.routingData.startDate) : null;
    
    let _rawDayPlans = (itinerary.dayWiseActivities || []) as DayPlan[];

    if (tripStartDate) {
        _rawDayPlans = _rawDayPlans.map(day => {
            const current = new Date(tripStartDate);
            current.setDate(current.getDate() + (day.dayNumber - 1));
            return {
                ...day,
                date: current.toISOString().split('T')[0] // Overwrites with correct date: "2026-02-13"
            };
        });
    }

    // --- B. PRICE LOGIC (UPDATED) ---
    let _finalGroupPrice = 0;
    let _finalPerPerson = 0;

    // PRIORITY 1: Confirmed "Final Sell Price" (If trip is already booked)
    if (itinerary.bookingStatus === 'confirmed' && itinerary.finalSellPrice && itinerary.finalSellPrice > 0) {
        _finalGroupPrice = itinerary.finalSellPrice;
        _finalPerPerson = _finalGroupPrice / _travelerCount;
    } 
    
    // PRIORITY 2: Fixed Departure Price (The Logic You Asked For)
    // We check if 'useFixedPrice' is ON and a specific departure ID is selected.
    else if (itinerary.useFixedPrice && itinerary.selectedDepartureId && itinerary.fixedDepartures) {
        const selectedDep = itinerary.fixedDepartures.find(d => d.id === itinerary.selectedDepartureId);
        
        if (selectedDep) {
            _finalPerPerson = selectedDep.price;
            _finalGroupPrice = _finalPerPerson * _travelerCount;
        } else {
             // Fallback: If ID not found, check if one is marked 'isSelected'
            const activeFixed = itinerary.fixedDepartures.find(d => d.isSelected);
            if (activeFixed) {
                _finalPerPerson = activeFixed.price;
                _finalGroupPrice = _finalPerPerson * _travelerCount;
            }
        }
    } 

    // PRIORITY 3: Dynamic Calculation (Fallback to summing up hotels/activities)
    if (_finalGroupPrice === 0) {
        let netTotal = 0;
        _rawDayPlans.forEach(day => {
            // Stays
            if(day.stays) day.stays.forEach(s => { 
                if (isItemIncluded(s.inclusionType)) netTotal += safeNum(s.costPerNight) * safeNum(s.numRooms) * safeNum(s.nights); 
            });
            // Transports
            if(day.transports) day.transports.forEach(t => { 
                if (isItemIncluded(t.inclusionType)) netTotal += safeNum(t.price) * safeNum(t.vehicleCount); 
            });
            // Activities
            if(day.activities) day.activities.forEach(a => { 
                if (isItemIncluded(a.inclusionType)) {
                    const guide = a.guideType === 'guided' ? safeNum(a.guideFee) : 0;
                    const fees = (safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * _travelerCount;
                    netTotal += fees + guide;
                } 
            });
            // Meals
            if(day.meals) day.meals.forEach(m => { 
                if (isItemIncluded(m.inclusionType)) netTotal += safeNum(m.adultCost) * _travelerCount; 
            });
        });

        // Apply Markup
        const netInSelected = convert(netTotal, currency);
        const markupPercent = itinerary.markupPercentage ?? 20;
        
        _finalGroupPrice = netInSelected + (netInSelected * (markupPercent / 100));
        
        const exactPP = _finalGroupPrice / _travelerCount;
        
        // Rounding
        const mode = itinerary.roundingMode || 'none';
        if (mode === '5') _finalPerPerson = Math.ceil(exactPP / 5) * 5;
        else if (mode === '10') _finalPerPerson = Math.ceil(exactPP / 10) * 10;
        else if (mode === '100') _finalPerPerson = Math.ceil(exactPP / 100) * 100;
        else _finalPerPerson = exactPP;

        // Recalculate Group Price to match rounded PP
        _finalGroupPrice = _finalPerPerson * _travelerCount;
    }
    // --- PRICE LOGIC END ---

    const hasFlights = _rawDayPlans.some(day => day.transports?.some(t => t.mode === 'flight' && isItemIncluded(t.inclusionType)));
    const _costLabel = hasFlights ? "(FLIGHTS INCL.)" : "(LAND ONLY)";

    return { 
        totalDays: _totalDays, 
        totalNights: _totalNights, 
        startCity: _startCity, 
        endCity: _endCity, 
        uniqueCities: _uniqueCities, 
        finalGroupPrice: _finalGroupPrice,
        finalPerPerson: _finalPerPerson, 
        costLabel: _costLabel, 
        rawDayPlans: _rawDayPlans, // Now contains CORRECTED DATES
        travelerCount: _travelerCount
    };
  }, [itinerary, currency, convert]);

  // --- 4. RENDER HELPER ---
  const getRenderableItemsForDay = (dayIndex: number, currentDay: DayPlan) => {
    if (!itinerary) return [];
    const items: any[] = [];
    const plans = (itinerary.dayWiseActivities || []) as DayPlan[];

    if(currentDay.activities) currentDay.activities.forEach(a => items.push({ ...a, category: 'Activity' }));
    if(currentDay.transports) currentDay.transports.forEach(t => items.push({ ...t, category: 'Transport' }));
    if(currentDay.meals) currentDay.meals.forEach(m => items.push({ ...m, category: 'Meal' }));
    if(currentDay.stays) currentDay.stays.forEach(s => items.push({ ...s, category: 'Stay', status: 'Check-in' }));

    for (let i = 0; i < dayIndex; i++) {
        const pastDay = plans.find(d => d.dayNumber === (i + 1));
        if (pastDay && pastDay.stays) {
            pastDay.stays.forEach(stay => {
                const stayEndIndex = i + (stay.nights || 0); 
                if (dayIndex > i && dayIndex < stayEndIndex) {
                    items.push({ ...stay, category: 'Stay', status: 'Residence' });
                }
            });
        }
    }
    return items.sort((a, b) => {
        const order = { 'Activity': 1, 'Stay': 2 , 'Transport': 3, 'Meal': 4 };
        return (order[a.category as keyof typeof order] || 5) - (order[b.category as keyof typeof order] || 5);
    });
  };

    const handleDownloadPdf = async () => {
      if (!printRef.current) return;
      setIsDownloading(true);
  
      const element = printRef.current;
      
      // A4 Dimensions in MM
      const PDF_WIDTH = 210;
      const PDF_HEIGHT = 297;
      const TOP_MARGIN = 0; // Adjust if you want white space at the top of PDF
      const PAGE_HEIGHT_PX_ESTIMATE = (PDF_HEIGHT * 3.78); // Approx conversion mm to px (96 DPI)
  
      // 1. PREPARE DOM FOR SNAPSHOT
      // (Optional: Hide scrollbars or temporary styles here if needed)
      
      try {
          // 2. CAPTURE THE ELEMENT
          // Scale 2 ensures high quality (Retina-like) for the PDF
          const canvas = await html2canvas(element, {
              scale: 2,
              useCORS: true, 
              logging: false,
              backgroundColor: '#ffffff',
              // Ensure we capture the full scroll height
              height: element.scrollHeight, 
              windowHeight: element.scrollHeight,
              onclone: (clonedDoc) => {
                  // Fix for missing images or distinct styles during capture can go here
                  const clonedElement = clonedDoc.getElementById('itinerary-preview-container');
                  if(clonedElement) {
                      clonedElement.style.height = 'auto'; 
                      clonedElement.style.overflow = 'visible';
                  }
              }
          });
  
          // 3. CALCULATE DIMENSIONS
          const imgData = canvas.toDataURL('image/jpeg', 0.95); // JPEG is faster/smaller than PNG
          const pdf = new jsPDF('p', 'mm', 'a4');
          
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
  
          // Calculate the height of the image on the PDF based on A4 Width
          // formula: (original height * pdf width) / original width
          const imgHeightInPdf = (imgHeight * PDF_WIDTH) / imgWidth; 
          
          let heightLeft = imgHeightInPdf;
          let position = 0; // Starts at top of page
  
          // 4. ADD FIRST PAGE
          pdf.addImage(imgData, 'JPEG', 0, position + TOP_MARGIN, PDF_WIDTH, imgHeightInPdf);
          heightLeft -= PDF_HEIGHT;
  
          // 5. LOOP FOR ADDITIONAL PAGES
          while (heightLeft > 0) {
              position = heightLeft - imgHeightInPdf; // Shift position up for next page
              pdf.addPage();
              pdf.addImage(imgData, 'JPEG', 0, position + TOP_MARGIN, PDF_WIDTH, imgHeightInPdf);
              heightLeft -= PDF_HEIGHT;
          }
  
      if (itinerary) {
          pdf.save(`${itinerary.tripName || 'Itinerary'}.pdf`);
      }

  } catch (error) {
      console.error("PDF Gen Error:", error);
      alert("Failed to generate PDF. Please check console.");
  } finally {
      setIsDownloading(false);
  }
};
  




 
  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;
  if (!itinerary) return <div className="h-screen flex items-center justify-center">Itinerary Not Found</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      
      {/* Top Nav */}
      <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
             <button onClick={() => router.push('/dashboard/trips')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold text-sm">
                <ArrowLeft size={18} /> Back to Dashboard
             </button>
             <div className="flex gap-3">
                 <button onClick={() => { if(itinerary.id) { sessionStorage.setItem('editing_itinerary_id', itinerary.id); router.push('/dashboard/itinerary/create'); } }} className="flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-sm font-bold">
                    <Edit size={16}/> Edit Itinerary
                 </button>
                 <button onClick={handleDownloadPdf} disabled={isDownloading} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md disabled:opacity-50">
                    {isDownloading ? <><Loader2 className="animate-spin" size={18} /> Downloading...</> : <><Download size={18} /> Download PDF</>}
                 </button>
             </div>
        </div>
      </div>
      {/* HTML PREVIEW */}
      <div className="flex-1 w-full overflow-y-auto p-8 flex justify-center print:p-0 print:overflow-visible">
        <div ref={printRef} className="w-full max-w-[310mm] min-h-[297mm] shadow-2xl p-0 bg-white print:shadow-none print:max-w-full">
            
            {/* Header */}
            <div style={{ borderBottom: '4px solid #dc2626' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
                    <div style={{ flex: 1, padding: '24px' }}>
                        <div style={{ height: '48px', marginBottom: '16px' }}>
                            <img src="/logo.png" alt="TRAVDEK" style={{ height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        </div>
                        <h1 style={{ color: '#dc2626', fontSize: '30px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, lineHeight: '1.1' }}>{itinerary.tripName}</h1>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', fontSize: '14px', fontWeight: 'bold', color: '#202020ff' }}>
                            <span style={{ backgroundColor: '#fef2f2', color:'#bb0000ff' ,  padding: '4px 8px', borderRadius: '4px' }}>{totalDays} Days | {totalNights} Nights</span>
                                                                                                                                            {/*   {itinerary.tripId || "#######"} */}
                            <span style={{ backgroundColor: '#f3f4f6', color:'#202020ff',  padding: '4px 8px', borderRadius: '4px' }}>Ref: {"#######"}</span>
                        </div>
                    </div>
                    
                    {/* --- UPDATED PRICE DISPLAY --- */}
                    <div style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '280px', textAlign: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.9, marginBottom: '6px' }}>TOTAL TRIP COST ({travelerCount} Pax)</span>
                        
                        {/* BIG TOTAL PRICE */}
                        <span style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.025em', lineHeight: '1' }}>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(finalGroupPrice)}
                        </span>
                        
                        {/* PER PERSON PRICE */}
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.9 }}>
                            <Users size={14} />
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(finalPerPerson)}
                            </span>
                            <span style={{ fontSize: '10px' }}>/ person</span>
                        </div>
                        
                        <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7, marginTop: '4px' }}>{costLabel}</span>
                    </div>
                </div>
                
                {/* Meta Grid */}
                <div style={{ borderTop: '1px solid #636363ff' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', fontSize: '12px' }}>
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Release Date:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{formatDate(new Date().toISOString())}</div>
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Trip Validity:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{formatDate(itinerary.routingData?.startDate)} to {formatDate(itinerary.routingData?.endDate)}</div>
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Country:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{itinerary.selectedCountries?.join(', ') || "India"}</div>
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Cities:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{uniqueCities}</div>
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Start / End:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{startCity} / {endCity}</div>
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Route:</div>
                 <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{itinerary.selectedCountries?.length || 1} Country | {(itinerary.routingData?.routes || []).length} Cities</div>
                    
                   
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff' }}>Trip Category:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', textTransform: 'uppercase', gridColumn: 'span 3' }}>{itinerary.packageType || "Premium"}</div>
                </div>
            </div>
            </div>

            {/* Itinerary Body */}
            <div style={{ marginTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '48px' }}>
                <h3 style={{ color: '#dc2626', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'underline', marginBottom: '16px', fontSize: '14px', letterSpacing: '0em' }}>Itinerary Details</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #636363ff', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#ffedd5', color: '#2c3441ff', textTransform: 'uppercase', fontSize: '12px' }}>
                            <th style={{ border: '1px solid #636363ff', padding: '12px', width: '96px', textAlign: 'center' }}>Day</th>
                            <th style={{ border: '1px solid #636363ff', padding: '12px', width: '128px', textAlign: 'left' }}>City</th>
                            <th style={{ border: '1px solid #636363ff', padding: '12px', width: '120px', textAlign: 'left' }}>Category</th>
                            <th style={{ border: '1px solid #636363ff', padding: '12px', textAlign: 'left' }}>Description</th>
                        </tr>
                    </thead>


                     {rawDayPlans.map((day, idx) => {
                        const items = getRenderableItemsForDay(idx, day);
                        return (
                            <tbody key={day.dayNumber} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                                
                                {/* Day Heading Row */}
                                <tr style={{ backgroundColor: '#fefce8', borderTop: '2px solid #636363ff' }}>
                                    <td colSpan={4} style={{ backgroundColor: '#f3f4f6', color: '#303030', padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold' }}>DAY {day.dayNumber} | {formatDate(day.date)}</td>
                                </tr>

                                {/* Leisure Day Check */}
                                {items.length === 0 && (
                                    <tr>
                                        <td style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', textAlign: 'center' }}>{day.dayNumber}</td>
                                        <td style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold' }}>{day.city}</td>
                                        <td colSpan={2} style={{ border: '1px solid #636363ff', padding: '12px', color: '#9ca3af', fontStyle: 'italic' }}>Leisure day. No activities scheduled.</td>
                                    </tr>
                                )}

                                {/* Items Rendering Loop */}
                                {items.map((item, itemIdx) => {
                                    
                                    // Determine Status Color and Text
                                    const inclusionStatus = item.inclusionType || 'included'; 
                                    const isExcluded = inclusionStatus === 'excluded';
                                    const isOptional = inclusionStatus === 'optional';
                                    
                                    // Visual Styles for Badge
                                    const badgeBg = isExcluded ? '#fef2f2' : isOptional ? '#eff6ff' : '#f0fdf4';
                                    const badgeColor = isExcluded ? '#dc2626' : isOptional ? '#1d4ed8' : '#15803d';
                                    const badgeBorder = isExcluded ? '#fca5a5' : isOptional ? '#93c5fd' : '#86efac';
                                    const badgeText = isExcluded ? 'Excluded' : isOptional ? 'Optional' : 'Included';

                                    return (
                                        <tr key={`${day.dayNumber}-${itemIdx}`} className="pdf-row" >
                                            {/* Col 1 & 2: Day & City (Merged for first item) */}
                                            {itemIdx === 0 ? (
                                                <>
                                                    <td rowSpan={items.length} style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#ffffff', verticalAlign: 'top' }}>DAY {day.dayNumber}</td>
                                                    <td rowSpan={items.length} style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', backgroundColor: '#ffffff', verticalAlign: 'top', color: '#dc2626' }}>{day.city}</td>
                                                </>
                                            ) : null}

                                            {/* Col 3: Category & INCLUSION STATUS */}
                                            <td style={{ border: '1px solid #636363ff', padding: '12px', verticalAlign: 'top', color: '#292d33ff' }}>
                                              
                                                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                                    {item.category === 'Stay' ? (
                                                        <span style={{ color: item.status === 'Check-in' ? '#1f2937' : '#757575ff' }}>Stay</span>
                                                    ) : item.category}
                                                </div>

                                                <div style={{ 
                                                        fontSize: '10px', 
                                                        fontWeight: 'bold', 
                                                        textTransform: 'uppercase', 
                                                        padding: '3px 8px', 
                                                        borderRadius: '4px', 
                                                        backgroundColor: badgeBg, 
                                                        color: badgeColor, 
                                                        border: `1px solid ${badgeBorder}`,
                                                        width: 'fit-content', 
                                                        display: 'block', 
                                                        marginTop: '10px'
                                                    }}>
                                                        {badgeText}
                                                    </div>
                                            </td>

                                            {/* Col 4: Description */}
                                            <td style={{ border: '1px solid #636363ff', padding: '12px', verticalAlign: 'top' }}>
                                                
                                                {item.category === 'Activity' && (
                                                    <div>
                                                        <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '16px' }}>{item.heading}</div>
                                                        <div style={{ color: '#292d33ff', fontSize: '12px', marginTop: '4px', marginBottom: '8px' }}>{item.description}</div>
                                                        <div style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6', display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', padding: '8px', borderRadius: '4px' }}>
                                                            <span style={{ color: '#292d33ff', display: 'flex', alignItems: 'center', gap: '4px', }}>Slot: {item.slot}</span>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Duration: {item.duration}</span>
                                                            {item.startTime && <span style={{ color: '#292d33ff' }}>Start: {item.startTime}</span>}
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Pickup: {item.pickupLocation || "TBA"}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {item.category === 'Stay' && (
                                                    <div style={{ opacity: item.status === 'Residence' ? 0.8 : 1 }}>
                                                        <div style={{ fontWeight: 'bold', color: '#22252bff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            {item.hotelName}
                                                            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#fff' }}>⭐ {item.rating}</span>
                                                        </div>
                                                        <div style={{ marginTop: '2px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                                                            {item.status === 'Check-in' ? (
                                                                <>
                                                                    <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Type: {item.stayType} (Stay)</div>
                                                                    <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
                                                                    <div style={{ backgroundColor: '#f9fafb', color: '#292d33ff', padding: '2px', borderRadius: '4px' }}>{item.nights} Nights Stay</div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div style={{ gridColumn: 'span 2', fontSize: '12px', color: '#292d33ff', fontStyle: 'italic', marginTop: '2px' }}>Continuing stay at {item.hotelName}. </div>
                                                                      <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Type: {item.stayType} (Stay)</div>
                                                                    <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
                                                                </>
                                                           )}
                                                        </div>
                                                    </div>
                                                )}

                                        



{item.category === 'Transport' && (
    <div>
        {/* 1. Header (Vehicle & Type) */}
        <div style={{ fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {item.vehicleType}
            <span style={{ 
                backgroundColor: '#f0fdf4', 
                color: '#15803d', 
                fontSize: '10px', 
                textTransform: 'uppercase', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                fontWeight: '600',
                border: '1px solid #dcfce7'
            }}>
                {item.subType}
            </span>
        </div>

        {/* 2. NEW: Service Description (The "From Barcelona..." text) */}
        {/* THIS IS THE PART YOU ARE MISSING */}
        {item.serviceDescription && (
            <div style={{ 
                marginTop: '6px', 
                marginBottom: '8px',
                fontSize: '13px', 
                color: '#4b5563', 
                lineHeight: '1.4',
                paddingBottom: '6px',
                borderBottom: '1px dashed #e5e7eb'
            }}>
                {item.serviceDescription}
            </div>
        )}

        {/* 3. Logistics (Pickup, Time, Drop) - Better Styled */}
        <div style={{ 
            marginTop: '4px', 
            fontSize: '12px', 
            color: '#1f2937', 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '8px' 
        }}>
            {/* Pickup */}
            <div>
                <span style={{color:'#4e4e4eff', fontWeight:'700', fontSize:'10px', textTransform:'uppercase'}}>Pickup: </span> 
                {item.pickupLocation} 
            </div>
            
            {/* Time */}
            <div>
                {item.pickupTime ? (
                    <>
                    <span style={{color:'#4e4e4eff', fontWeight:'700', fontSize:'10px', textTransform:'uppercase'}}>Start: </span> 
                    {item.pickupTime}
                    </>
                ) : ''}
            </div>

            {/* Drop / Duration */}
            <div style={{ gridColumn: 'span 2' }}>
                <span style={{color:'#4e4e4eff', fontWeight:'700', fontSize:'10px', textTransform:'uppercase'}}>
                    {item.subType === 'transfer' ? 'Drop: ' : 'Duration: '}
                </span> 
                {item.subType === 'transfer' ? item.dropoffLocation : item.duration}
            </div>
        </div>
    </div>
)}
                                                {item.category === 'Meal' && (
                                                    <div>
                                                        <div style={{ fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                             {item.mealType}: {item.restaurantName}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#292d33ff', marginTop: '4px' }}>
                                                            {item.cuisine} | {item.menuType}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        );
                    })}
            </table>
           
        </div>

            <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', marginTop: '32px', padding: '24px', textAlign: 'center', fontSize: '12px', color: '#505050ff' }}>
                <p>Generated by Travdek. Prices and availability are subject to change.</p>
            </div>
        </div>
        </div>
      </div>
   
  );
}