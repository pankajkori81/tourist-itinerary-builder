
// "use client";

// import React, { useRef, useState, useMemo , useEffect } from 'react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// import { Download} from "lucide-react";
// import { useItinerary } from '@/app/context/ItineraryContext';
// import { DayPlan } from '../create-day/constants/daywiseConstants';
// import { useCurrency } from '@/hooks/useCurrency'; 
// import { calculateTripCosts } from '@/utils/costingLogic'; 

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
  
//   const dayPlans = (itineraryData.dayWiseActivities || []) as DayPlan[];



// // --- 2. CURRENCY & COST LOGIC (FIXED) ---
//   // CHANGE 1: Initialize with 'USD' so inputs are treated as Dollars.
//   const { currency, setCurrency, convert, formatPrice, loading } = useCurrency('USD');

//   // CHANGE 2: SYNC CURRENCY WITH COSTING PAGE PREFERENCE
//   useEffect(() => {
//     const savedCurrency = localStorage.getItem('travdek_preferred_currency');
//     if (savedCurrency && savedCurrency !== currency) {
//       setCurrency(savedCurrency);
//     } else if (!savedCurrency) {
//         // Force USD if no preference is set, to match Costing Page fix
//         setCurrency('USD');
//     }
//   }, []);

//   const travelerCount = itineraryData?.numberOfTravelers || 1;
//   const markupPercent = itineraryData.markupPercentage !== undefined ? itineraryData.markupPercentage : 20; 
//   const taxPercent = itineraryData.taxPercentage !== undefined ? itineraryData.taxPercentage : 5;



// // Calculate Base Costs (Raw numbers from DB, which are in USD)
//   const costs = useMemo(() => calculateTripCosts(dayPlans, travelerCount), [dayPlans, travelerCount]);

//   // CHANGE 3: Logic adjustment.
//   // If Selected='USD', convert(100, 'USD') returns 100.
//   // If Selected='INR', convert(100, 'INR') returns ~8400.
//   const netInSelected = convert(costs.totalNet, currency);
  
//   const markupAmount = netInSelected * (markupPercent / 100);
//   const preTaxTotal = netInSelected + markupAmount;
//   const taxAmount = preTaxTotal * (taxPercent / 100);
//   const grandTotal = preTaxTotal + taxAmount;


//   // Final Per Person Cost
//   const perPersonCost = grandTotal / (travelerCount || 1);
  
//   // Trip Type Label
//   const hasFlights = dayPlans.some(day => 
//     day.transports.some(t => t.mode === 'flight')
//   );
//   const costLabel = hasFlights ? "(FLIGHTS INCL.)" : "(LAND ONLY)";

//   // --- 3. LOGIC: HANDLE CONTINUED STAYS ---
//   const getRenderableItemsForDay = (dayIndex: number, currentDay: DayPlan) => {
//     const items: any[] = [];

//     // Add Items
//     currentDay.activities.forEach(a => items.push({ ...a, category: 'Activity' }));
//     currentDay.transports.forEach(t => items.push({ ...t, category: 'Transport' }));
//     currentDay.meals.forEach(m => items.push({ ...m, category: 'Meal' }));
    
//     // Add Stays (Check-in)
//     currentDay.stays.forEach(s => items.push({ ...s, category: 'Stay', status: 'Check-in' }));

//     // Add Ghost Stays (Residence)
//     for (let i = 0; i < dayIndex; i++) {
//         const pastDay = dayPlans.find(d => d.dayNumber === (i + 1));
//         if (pastDay) {
//             pastDay.stays.forEach(stay => {
//                 const stayEndIndex = i + stay.nights; 
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


// // --- PAGINATION LOGIC (THE FIX) ---
//   // We calculate which items go on which page based on an estimated height per item.
//   // This is safer than pixel calculation because we control the page container.
  
//   const ITEMS_PER_PAGE = 5; // Tweak this number! How many rows fit comfortably on A4?
//   const ITEMS_PER_FIRST_PAGE = 3; // First page has a big header, so fewer items.

//   const getRenderableItems = () => {
//      let allItems: any[] = [];
//      dayPlans.forEach((day, dayIndex) => {
//          // Get items for this day using your existing helper
//          const dayItems = getRenderableItemsForDay(dayIndex, day);
         
//          if (dayItems.length === 0) {
//              // Handle leisure day
//              allItems.push({ type: 'day-header', day });
//              allItems.push({ type: 'leisure', day });
//          } else {
//              // Add Day Header as a separate item row
//              allItems.push({ type: 'day-header', day });
//              dayItems.forEach((item, idx) => {
//                  allItems.push({ type: 'item', day, item, isFirstItem: idx === 0, totalItems: dayItems.length });
//              });
//          }
//      });
//      return allItems;
//   };

//   const paginatedPages = useMemo(() => {
//       const allItems = getRenderableItems();
//       const pages = [];
      
//       // Page 1
//       let currentPageItems = allItems.slice(0, ITEMS_PER_FIRST_PAGE);
//       pages.push(currentPageItems);
      
//       // Subsequent Pages
//       let remaining = allItems.slice(ITEMS_PER_FIRST_PAGE);
//       while(remaining.length > 0) {
//           pages.push(remaining.slice(0, ITEMS_PER_PAGE));
//           remaining = remaining.slice(ITEMS_PER_PAGE);
//       }
//       return pages;
//   }, [dayPlans]);


// const handleDownloadPdf = async () => {
//     if (!printRef.current) return;
//     setIsDownloading(true);

//     const element = printRef.current;
    
//     // --- 1. SETTINGS: VISUAL WHITE SPACE ---
//     // Increase these to make the white gaps bigger
//     const A4_HEIGHT_MM = 297;
//     const A4_WIDTH_MM = 210;
//     const MARGIN_TOP_PX = 50;    // White space at top of pages 2,3...
//     const MARGIN_BOTTOM_PX = 50; // White space at bottom of pages 1,2...
    
//     // --- 2. CALCULATE PAGE HEIGHT IN PIXELS ---
//     const elementWidth = element.scrollWidth;
//     const pxPerMm = elementWidth / A4_WIDTH_MM;
//     const pageHeightPx = A4_HEIGHT_MM * pxPerMm; // Exact height of one PDF page in pixels
    
//     // --- 3. ROBUST PAGE BREAK ALGORITHM ---
//     const originalStyles: { row: HTMLElement; style: string }[] = [];
//     const rows = element.querySelectorAll('.pdf-row') as NodeListOf<HTMLElement>;
    
//     // We need the absolute starting position of the content
//     const contentStartTop = element.getBoundingClientRect().top;
    
//     // This variable tracks how much we have pushed content down so far
//     let cumulativeShift = 0;

//     rows.forEach((row) => {
//         // 1. Get the row's natural position (before any spacers)
//         const rowRect = row.getBoundingClientRect();
//         const naturalTop = rowRect.top - contentStartTop;
//         const rowHeight = row.offsetHeight;

//         // 2. Calculate where this row WOULD sit after previous spacers
//         const virtualTop = naturalTop + cumulativeShift;
//         const virtualBottom = virtualTop + rowHeight;

//         // 3. Find which page this row belongs to (0-indexed)
//         const currentPage = Math.floor(virtualTop / pageHeightPx);
        
//         // 4. Calculate the "Cut Line" for this page (The bottom edge of the paper)
//         const pageEnd = (currentPage + 1) * pageHeightPx;
        
//         // 5. Calculate the "Safe Zone" (The line where we MUST stop content)
//         const safeLimit = pageEnd - MARGIN_BOTTOM_PX;

//         // CHECK: Does this row cross the Safe Limit?
//         if (virtualBottom > safeLimit) {
//             // YES, it fits poorly or gets cut. We must push it to the next page.

//             // Calculate how much space is left on the current page
//             const remainingSpaceOnPage = pageEnd - virtualTop;
            
//             // Calculate total spacer needed:
//             // (Space to finish page) + (Top Margin of next page)
//             // Note: We might need to correct for cases where remainingSpace is negative (overlap),
//             // but usually virtualTop < pageEnd.
//             const spacerHeight = remainingSpaceOnPage + MARGIN_TOP_PX;

//             // Apply the spacer
//             originalStyles.push({ row, style: row.style.borderTop });
//             row.style.borderTop = `${spacerHeight}px solid white`; 
            
//             // Update the shift tracker so future rows know they are lower down
//             cumulativeShift += spacerHeight;
//         }
//     });

//     try {
//         // Wait for React/Browser to render the white borders
//         await new Promise(resolve => setTimeout(resolve, 300)); 

//         // --- 4. CAPTURE IMAGE ---
//         const canvas = await html2canvas(element, {
//             scale: 2, 
//             useCORS: true,
//             logging: false,
//             backgroundColor: '#ffffff',
//             // Capture full scroll height which now includes our spacers
//             height: element.scrollHeight, 
//             windowHeight: element.scrollHeight
//         });

//         const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
//         // --- 5. GENERATE PDF ---
//         const pdf = new jsPDF('p', 'mm', 'a4');
//         const pdfWidth = A4_WIDTH_MM;
//         const pdfHeight = A4_HEIGHT_MM;
        
//         const imgProps = pdf.getImageProperties(imgData);
//         const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
//         let heightLeft = imgHeight;
//         let position = 0;

//         // Page 1
//         pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
//         heightLeft -= pdfHeight;

//         // Subsequent Pages
//         while (heightLeft > 0) {
//             position -= pdfHeight; // Move the "camera" down exactly one page height
//             pdf.addPage();
//             pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
//             heightLeft -= pdfHeight;
//         }

//         pdf.save(`${itineraryData.tripName || 'Itinerary'}.pdf`);

//     } catch (error) {
//         console.error("PDF Gen Error:", error);
//     } finally {
//         // --- 6. CLEANUP ---
//         // Instantly remove the spacers so the web view returns to normal
//         originalStyles.forEach(({ row, style }) => {
//             row.style.borderTop = style;
//         });
//         setIsDownloading(false);
//     }
//   };

//   return (
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
//                         <span style={{ backgroundColor: '#f3f4f6', color:'#202020ff',  padding: '4px 8px', borderRadius: '4px' }}>Ref: {"########"}</span>
//                     </div>
//                 </div>
//              {/* PRICING BOX - UPDATED WITH CORRECT CURRENCY */}
//                 <div style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '250px', textAlign: 'center' }}>
//                     <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.9, marginBottom: '4px' }}>Starting at</span>
//                     <span style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.025em', lineHeight: '1' }}>
//                         {/* {formatPrice(perPersonCost, currency)}  */} $1370
//                         <span style={{ fontSize: '16px', fontWeight: '500', marginLeft: '4px' }}>PP*</span>
//                     </span>
//                     <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8, marginTop: '4px', letterSpacing: '0.05em' }}>{costLabel}</span>
//                     {/* <span style={{ fontSize: '9px', opacity: 0.7, marginTop: '2px' }}>Excl. GST/Tax</span> */}
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
//                         <th style={{ border: '1px solid #636363ff', padding: '12px', width: '112px', textAlign: 'left' }}>Category</th>
//                         <th style={{ border: '1px solid #636363ff', padding: '12px', textAlign: 'left' }}>Description</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {dayPlans.map((day, idx) => {
//                         const items = getRenderableItemsForDay(idx, day);
//                         return (
//                             <React.Fragment key={day.dayNumber}>
//                                 <tr style={{ backgroundColor: '#fefce8', borderTop: '2px solid #636363ff' }}>
//                                     <td colSpan={4} style={{ backgroundColor: '#f3f4f6', color: '#303030', padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold' }}>DAY {day.dayNumber} | {formatDate(day.date)}</td>
//                                 </tr>

//                                 {items.length === 0 && (
//                                     <tr>
//                                         <td style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', textAlign: 'center' }}>{day.dayNumber}</td>
//                                         <td style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold' }}>{day.city}</td>
//                                         <td colSpan={2} style={{ border: '1px solid #636363ff', padding: '12px', color: '#9ca3af', fontStyle: 'italic' }}>Leisure day. No activities scheduled.</td>
//                                     </tr>
//                                 )}

//                                 {items.map((item, itemIdx) => {
                                    
//                                     // --- STRICT "ALL INCLUSIVE" LOGIC ---
//                                     const inclusions = [];
                                    
//                                     // Always push "All Inclusive" first for every category as requested
//                                     inclusions.push("All Inclusive");

                            

//                                     return (
//                                         <tr key={`${day.dayNumber}-${itemIdx}`} className="pdf-row" >
//                                             {itemIdx === 0 ? (
//                                                 <>
//                                                     <td rowSpan={items.length} style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#ffffff', verticalAlign: 'top' }}>DAY {day.dayNumber}</td>
//                                                     <td rowSpan={items.length} style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', backgroundColor: '#ffffff', verticalAlign: 'top', color: '#dc2626' }}>{day.city}</td>
//                                                 </>
//                                             ) : null}

//                                             <td style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', verticalAlign: 'top', color: '#292d33ff' }}>
//                                                 {item.category === 'Stay' ? (
//                                                     <span style={{ color: item.status === 'Check-in' ? '#1f2937' : '#9ca3af' }}>{item.status === 'Check-in' ? 'Stay' : item.status}</span>
//                                                 ) : item.category}
//                                             </td>

//                                             <td style={{ border: '1px solid #636363ff', padding: '12px', verticalAlign: 'top' }}>
                                                
//                                                 {/* Content Details */}
//                                                 {item.category === 'Activity' && (
//                                                     <div>
//                                                         <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '16px' }}>{item.heading}</div>
//                                                         <div style={{ color: '#292d33ff', fontSize: '12px', marginTop: '4px', marginBottom: '8px' }}>{item.description}</div>
//                                                         <div style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6', display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', padding: '8px', borderRadius: '4px' }}>
//                                                             <span style={{ color: '#292d33ff', display: 'flex', alignItems: 'center', gap: '4px', }}> Slot: {item.slot}</span>
//                                                             <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Duration: {item.duration}</span>
//                                                             {item.startTime && <span style={{ color: '#292d33ff' }}>Start: {item.startTime}</span>}
//                                                             <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Pickup: {item.pickupLocation || "TBA"}</span>
//                                                         </div>
//                                                     </div>
//                                                 )}

//                                                 {item.category === 'Stay' && (
//                                                     <div style={{ opacity: item.status === 'Residence' ? 1 : 1 }}>
//                                                         <div style={{ fontWeight: 'bold', color: '#292d33ff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                             {item.hotelName}
//                                                             <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>Rating:  {item.rating}</span>
//                                                         </div>
//                                                         <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
//                                                             {item.status === 'Check-in' ? (
//                                                                 <>
//                                                                     <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '6px', borderRadius: '4px', fontWeight: 'bold' }}>Type: {item.stayType} ({item.category})</div>
//                                                                     <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '6px', borderRadius: '4px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
//                                                                     {/* Hardcode display to All Inclusive here if desired, otherwise use variable */}
                                                              
//                                                                     <div style={{ backgroundColor: '#f9fafb', color: '#292d33ff', padding: '6px', borderRadius: '4px' }}>{item.nights} Nights Stay</div>
//                                                                 </>
//                                                             ) : (
//                                                                 <>
                                                              
//                                                                 <div style={{ gridColumn: 'span 2', fontSize: '12px', color: '#292d33ff', fontStyle: 'italic', marginTop: '4px' }}>Continuing stay at {item.hotelName}.</div>
//                                                                                                                                 <div style={{ backgroundColor: '#faf5ff', color: '#111111', padding: '6px', borderRadius: '4px', fontWeight: 'bold' }}>Type: {item.stayType} ({item.category})</div>
//                                                                     <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '6px', borderRadius: '4px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
//                                                                     {/* Hardcode display to All Inclusive here if desired, otherwise use variable */}
//                                                                     <div style={{ backgroundColor: '#f9fafb', color: '#292d33ff', padding: '6px', borderRadius: '4px' }}>Inclusions: All Inclusive</div> 
//                                                                     <div style={{ backgroundColor: '#f9fafb', color: '#292d33ff', padding: '6px', borderRadius: '4px' }}>{item.nights} Nights Stay</div>
//                                                                  </>
//                                                            )}
//                                                         </div>
//                                                     </div>
//                                                 )}

//                                                 {item.category === 'Transport' && (
//                                                     <div>
//                                                         <div style={{ fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                             {item.mode === 'flight' ? '' : ''} {item.vehicleType}
//                                                             <span style={{ backgroundColor: '#f0fdf4', color: '#292d33ff', fontSize: '10px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', fontWeight: 'normal' }}>{item.subType}</span>
//                                                         </div>
//                                                         <div style={{ marginTop: '4px', fontSize: '12px', color: '#292d33ff', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
//                                                             <div>Pickup: {item.pickupLocation} </div> <div> Start Time:{item.pickupTime}Hrs</div>
//                                                             <div>{item.subType === 'transfer' ? `Drop: ${item.dropoffLocation}` : `Duration: ${item.duration}`}</div>
//                                                         </div>
//                                                     </div>
//                                                 )}

//                                                 {item.category === 'Meal' && (
//                                                     <div>
//                                                         <div style={{ fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                              {item.mealType}: {item.restaurantName}
//                                                         </div>
//                                                         <div style={{ fontSize: '12px', color: '#292d33ff', marginTop: '4px' }}>
//                                                             {item.cuisine} | {item.inclusionType === 'included' ? 'Pre-Paid' : 'Direct Payment'}
//                                                         </div>
//                                                     </div>
//                                                 )}

//                                                 {/* --- INCLUSIONS SECTION --- */}
//                                                 {/* Logic: Show this block if we have items (which we always do now) and it's not a residence ghost stay */}
//                                                 {inclusions.length > 0 && item.status !== 'Residence' && (
//                                                     <div style={{ marginTop: '10px', paddingTop: '5px',}}>
//                                                         <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#1c241fff', fontWeight: 'bold' }}>
                                                           
//                                                             <span style={{ textTransform: 'uppercase' }}>Inclusions:</span>
//                                                         </div>
//                                                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
//                                                             {inclusions.map((inc, i) => (
//                                                                 <span key={i} style={{ fontSize: '12px', backgroundColor: '#f0fdf4', color: '#111814ff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #f0fdf4', fontWeight: '500' }}>
//                                                                      {inc}
//                                                                 </span>
//                                                             ))}
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                                 {/* -------------------------- */}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </React.Fragment>
//                         );
//                     })}
//                 </tbody>
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

// import React, { useRef, useState, useMemo , useEffect } from 'react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// import { Download} from "lucide-react";
// import { useItinerary } from '@/app/context/ItineraryContext';
// import { DayPlan } from '../create-day/constants/daywiseConstants';
// import { useCurrency } from '@/hooks/useCurrency'; 
// import { calculateTripCosts } from '@/utils/costingLogic'; 

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
  
//   const dayPlans = (itineraryData.dayWiseActivities || []) as DayPlan[];

//   // --- 2. CURRENCY & COST LOGIC ---
//   const { currency, setCurrency, convert, loading } = useCurrency('USD');

//   useEffect(() => {
//     const savedCurrency = localStorage.getItem('travdek_preferred_currency');
//     if (savedCurrency && savedCurrency !== currency) {
//       setCurrency(savedCurrency);
//     } else if (!savedCurrency) {
//         setCurrency('USD');
//     }
//   }, []);

//   const travelerCount = itineraryData?.numberOfTravelers || 1;
//   const markupPercent = itineraryData.markupPercentage !== undefined ? itineraryData.markupPercentage : 20; 
//   const taxPercent = itineraryData.taxPercentage !== undefined ? itineraryData.taxPercentage : 5;

//   // Calculate Base Costs 
//   // NOTE: Ensure your calculateTripCosts utility filters out 'excluded' items!
//   const costs = useMemo(() => calculateTripCosts(dayPlans, travelerCount), [dayPlans, travelerCount]);

//   const netInSelected = convert(costs.totalNet, currency);
//   const markupAmount = netInSelected * (markupPercent / 100);
//   const preTaxTotal = netInSelected + markupAmount;
//   const taxAmount = preTaxTotal * (taxPercent / 100);
//   const grandTotal = preTaxTotal + taxAmount;

//   // Final Per Person Cost
//   const perPersonCost = grandTotal / (travelerCount || 1);
  
//   const hasFlights = dayPlans.some(day => 
//     day.transports.some(t => t.mode === 'flight' && t.inclusionType !== 'excluded')
//   );
//   const costLabel = hasFlights ? "(FLIGHTS INCL.)" : "(LAND ONLY)";

//   // --- 3. LOGIC: HANDLE CONTINUED STAYS & FLATTENING ---
//   const getRenderableItemsForDay = (dayIndex: number, currentDay: DayPlan) => {
//     const items: any[] = [];

//     // Add Items (Ensure inclusionType is passed)
//     currentDay.activities.forEach(a => items.push({ ...a, category: 'Activity' }));
//     currentDay.transports.forEach(t => items.push({ ...t, category: 'Transport' }));
//     currentDay.meals.forEach(m => items.push({ ...m, category: 'Meal' }));
    
//     // Add Stays (Check-in)
//     currentDay.stays.forEach(s => items.push({ ...s, category: 'Stay', status: 'Check-in' }));

//     // Add Ghost Stays (Residence)
//     for (let i = 0; i < dayIndex; i++) {
//         const pastDay = dayPlans.find(d => d.dayNumber === (i + 1));
//         if (pastDay) {
//             pastDay.stays.forEach(stay => {
//                 const stayEndIndex = i + stay.nights; 
//                 if (dayIndex > i && dayIndex < stayEndIndex) {
//                     // Inherit the inclusionType from the original stay
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

//   // --- PDF GENERATION LOGIC (Unchanged) ---
//   const handleDownloadPdf = async () => {
//     if (!printRef.current) return;
//     setIsDownloading(true);

//     const element = printRef.current;
//     const A4_HEIGHT_MM = 297;
//     const A4_WIDTH_MM = 210;
//     const MARGIN_TOP_PX = 50;   
//     const MARGIN_BOTTOM_PX = 50;
    
//     const elementWidth = element.scrollWidth;
//     const pxPerMm = elementWidth / A4_WIDTH_MM;
//     const pageHeightPx = A4_HEIGHT_MM * pxPerMm; 
    
//     const originalStyles: { row: HTMLElement; style: string }[] = [];
//     const rows = element.querySelectorAll('.pdf-row') as NodeListOf<HTMLElement>;
//     const contentStartTop = element.getBoundingClientRect().top;
//     let cumulativeShift = 0;

//     rows.forEach((row) => {
//         const rowRect = row.getBoundingClientRect();
//         const naturalTop = rowRect.top - contentStartTop;
//         const rowHeight = row.offsetHeight;
//         const virtualTop = naturalTop + cumulativeShift;
//         const virtualBottom = virtualTop + rowHeight;
//         const currentPage = Math.floor(virtualTop / pageHeightPx);
//         const pageEnd = (currentPage + 1) * pageHeightPx;
//         const safeLimit = pageEnd - MARGIN_BOTTOM_PX;

//         if (virtualBottom > safeLimit) {
//             const remainingSpaceOnPage = pageEnd - virtualTop;
//             const spacerHeight = remainingSpaceOnPage + MARGIN_TOP_PX;
//             originalStyles.push({ row, style: row.style.borderTop });
//             row.style.borderTop = `${spacerHeight}px solid white`; 
//             cumulativeShift += spacerHeight;
//         }
//     });

//     try {
//         await new Promise(resolve => setTimeout(resolve, 300)); 
//         const canvas = await html2canvas(element, {
//             scale: 2, 
//             useCORS: true,
//             logging: false,
//             backgroundColor: '#ffffff',
//             height: element.scrollHeight, 
//             windowHeight: element.scrollHeight
//         });

//         const imgData = canvas.toDataURL('image/jpeg', 1.0);
//         const pdf = new jsPDF('p', 'mm', 'a4');
//         const pdfWidth = A4_WIDTH_MM;
//         const pdfHeight = A4_HEIGHT_MM;
//         const imgProps = pdf.getImageProperties(imgData);
//         const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
//         let heightLeft = imgHeight;
//         let position = 0;

//         pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
//         heightLeft -= pdfHeight;

//         while (heightLeft > 0) {
//             position -= pdfHeight; 
//             pdf.addPage();
//             pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
//             heightLeft -= pdfHeight;
//         }

//         pdf.save(`${itineraryData.tripName || 'Itinerary'}.pdf`);
//     } catch (error) {
//         console.error("PDF Gen Error:", error);
//     } finally {
//         originalStyles.forEach(({ row, style }) => {
//             row.style.borderTop = style;
//         });
//         setIsDownloading(false);
//     }
//   };

//   return (
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
        
//         {/* HEADER (Unchanged) */}
//         <div style={{ borderBottom: '4px solid #dc2626' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
//                 <div style={{ flex: 1, padding: '24px' }}>
//                     <div style={{ height: '48px', marginBottom: '16px' }}>
//                         <img src="/logo.png" alt="Company Logo" style={{ height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
//                     </div>
//                     <h1 style={{ color: '#dc2626', fontSize: '30px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, lineHeight: '1.1' }}>{itineraryData.tripName || "Luxury Getaway"}</h1>
//                     <div style={{ display: 'flex', gap: '8px', marginTop: '12px', fontSize: '14px', fontWeight: 'bold', color: '#202020ff' }}>
//                         <span style={{ backgroundColor: '#fef2f2', color:'#bb0000ff' ,  padding: '4px 8px', borderRadius: '4px' }}>{totalDays} Days | {totalNights} Nights</span>
//                         <span style={{ backgroundColor: '#f3f4f6', color:'#202020ff',  padding: '4px 8px', borderRadius: '4px' }}>Ref: {"ITN-" + Math.floor(Math.random() * 10000)}</span>
//                     </div>
//                 </div>
//                 <div style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '250px', textAlign: 'center' }}>
//                     <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.9, marginBottom: '4px' }}>Starting at</span>
//                     <span style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.025em', lineHeight: '1' }}>
//                         ${Math.round(perPersonCost).toLocaleString()}
//                         <span style={{ fontSize: '16px', fontWeight: '500', marginLeft: '4px' }}>PP*</span>
//                     </span>
//                     <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8, marginTop: '4px', letterSpacing: '0.05em' }}>{costLabel}</span>
//                 </div>
//             </div>
//             {/* DETAILS GRID (Unchanged) */}
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
//                 <tbody>
//                     {dayPlans.map((day, idx) => {
//                         const items = getRenderableItemsForDay(idx, day);
//                         return (
//                             <React.Fragment key={day.dayNumber}>
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
//                                     const inclusionStatus = item.inclusionType || 'included'; // Default to included
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

//                                             {/* Col 3: Category & INCLUSION STATUS (Updated) */}
//                                             <td style={{ border: '1px solid #636363ff', padding: '12px', verticalAlign: 'top', color: '#292d33ff' }}>
//                                                 {/* Category Name */}
//                                                 <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
//                                                     {item.category === 'Stay' ? (
//                                                         <span style={{ color: item.status === 'Check-in' ? '#1f2937' : '#9ca3af' }}>{item.status === 'Check-in' ? 'Stay' : item.status}</span>
//                                                     ) : item.category}
//                                                 </div>

//                                                 {/* NEW: Inclusion Badge */}
//                                                 <span style={{ 
//                                                     fontSize: '10px', 
//                                                     fontWeight: 'bold', 
//                                                     textTransform: 'uppercase', 
//                                                     padding: '3px 8px', 
//                                                     borderRadius: '4px', 
//                                                     backgroundColor: badgeBg, 
//                                                     color: badgeColor, 
//                                                     border: `1px solid ${badgeBorder}`,
//                                                     display: 'inline-block'
//                                                 }}>
//                                                     {badgeText}
//                                                 </span>
//                                             </td>

//                                             {/* Col 4: Description (Cleaned) */}
//                                             <td style={{ border: '1px solid #636363ff', padding: '12px', verticalAlign: 'top' }}>
                                                
//                                                 {item.category === 'Activity' && (
//                                                     <div>
//                                                         <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '16px' }}>{item.heading}</div>
//                                                         <div style={{ color: '#292d33ff', fontSize: '12px', marginTop: '4px', marginBottom: '8px' }}>{item.description}</div>
//                                                         <div style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6', display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', padding: '8px', borderRadius: '4px' }}>
//                                                             <span style={{ color: '#292d33ff', display: 'flex', alignItems: 'center', gap: '4px', }}> Slot: {item.slot}</span>
//                                                             <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Duration: {item.duration}</span>
//                                                             {item.startTime && <span style={{ color: '#292d33ff' }}>Start: {item.startTime}</span>}
//                                                             <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Pickup: {item.pickupLocation || "TBA"}</span>
//                                                         </div>
//                                                     </div>
//                                                 )}

//                                                 {item.category === 'Stay' && (
//                                                     <div style={{ opacity: item.status === 'Residence' ? 0.8 : 1 }}>
//                                                         <div style={{ fontWeight: 'bold', color: '#292d33ff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                             {item.hotelName}
//                                                             <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#fff', border: '1px solid #ddd' }}>⭐ {item.rating}</span>
//                                                         </div>
//                                                         <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
//                                                             {item.status === 'Check-in' ? (
//                                                                 <>
//                                                                     <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '6px', borderRadius: '4px', fontWeight: 'bold' }}>Type: {item.stayType}</div>
//                                                                     <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '6px', borderRadius: '4px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
//                                                                     <div style={{ backgroundColor: '#f9fafb', color: '#292d33ff', padding: '6px', borderRadius: '4px' }}>{item.nights} Nights Stay</div>
//                                                                 </>
//                                                             ) : (
//                                                                 <>
//                                                                     <div style={{ gridColumn: 'span 2', fontSize: '12px', color: '#292d33ff', fontStyle: 'italic', marginTop: '4px' }}>Continuing stay at {item.hotelName}.</div>
//                                                                 </>
//                                                            )}
//                                                         </div>
//                                                     </div>
//                                                 )}

//                                                 {item.category === 'Transport' && (
//                                                     <div>
//                                                         <div style={{ fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                             {item.vehicleType}
//                                                             <span style={{ backgroundColor: '#f0fdf4', color: '#292d33ff', fontSize: '10px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', fontWeight: 'normal' }}>{item.subType}</span>
//                                                         </div>
//                                                         <div style={{ marginTop: '4px', fontSize: '12px', color: '#292d33ff', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
//                                                             <div>Pickup: {item.pickupLocation} </div>
//                                                             <div>{item.pickupTime ? `Start Time: ${item.pickupTime} Hrs` : ''}</div>
//                                                             <div>{item.subType === 'transfer' ? `Drop: ${item.dropoffLocation}` : `Duration: ${item.duration}`}</div>
//                                                         </div>
//                                                     </div>
//                                                 )}

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
                                                
//                                                 {/* NOTE: We removed the duplicate inclusions block from here */}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </React.Fragment>
//                         );
//                     })}
//                 </tbody>
//             </table>
//         </div>

//         {/* Footer (Unchanged) */}
//         <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', marginTop: '32px', padding: '24px', textAlign: 'center', fontSize: '12px', color: '#505050ff' }}>
//             <p>Generated by Travdek. Prices and availability are subject to change.</p>
//         </div>
//       </div>
//     </div>
//   );
// } 























"use client";

import React, { useRef, useState, useMemo , useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Download} from "lucide-react";
import { useItinerary } from '@/app/context/ItineraryContext';
import { DayPlan } from '../create-day/constants/daywiseConstants';
import { useCurrency } from '@/hooks/useCurrency'; 
import { calculateTripCosts } from '@/utils/costingLogic'; 


// --- HELPERS (Copied from Costing Sheet for consistency) ---
const isItemIncluded = (status?: string) => !status || status.toLowerCase() === 'included';
const safeNum = (val: any) => {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
};

// --- HELPER TO FORMAT DATES ---
const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'TBA';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function PreviewPage() {
  const { itineraryData } = useItinerary();
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // --- 1. DATA PREPARATION ---
  const routes = itineraryData.routingData?.routes || [];
  const startCity = routes.length > 0 ? routes[0].cities[0]?.name : 'TBA';
  const endCity = routes.length > 0 ? routes[routes.length - 1].cities[0]?.name : 'TBA';
  const totalNights = routes.reduce((acc, curr) => acc + (curr.nights || 0), 0);
  const totalDays = totalNights + 1;
  const uniqueCities = Array.from(new Set(routes.flatMap(r => r.cities.map(c => c.name)))).join(' | ');
  
  const rawDayPlans = (itineraryData.dayWiseActivities || []) as DayPlan[];

  // --- 2. CURRENCY & COST LOGIC (SYNCED WITH COSTING SHEET) ---
  const { currency, setCurrency, convert, loading } = useCurrency('USD');

  useEffect(() => {
    // Priority: 1. Itinerary Specific Currency, 2. Local Storage, 3. Default USD
    if (itineraryData.selectedCurrency) {
        setCurrency(itineraryData.selectedCurrency);
    } else {
        const savedCurrency = localStorage.getItem('travdek_preferred_currency');
        if (savedCurrency) setCurrency(savedCurrency);
    }
  }, [itineraryData.selectedCurrency]);

  const travelerCount = safeNum(itineraryData?.numberOfTravelers) || 1;
  const markupPercent = itineraryData.markupPercentage !== undefined ? itineraryData.markupPercentage : 20; 
  const roundingMode = itineraryData.roundingMode || 'none';

  // --- EXACT CALCULATION ENGINE (Copied from CostingPage) ---
  const calculatedNetTotal = useMemo(() => {
    let total = 0;
    rawDayPlans.forEach(day => {
        if(day.stays) {
            day.stays.forEach(s => {
                if (isItemIncluded(s.inclusionType)) {
                    total += safeNum(s.costPerNight) * safeNum(s.numRooms) * safeNum(s.nights);
                }
            });
        }
        if(day.transports) {
            day.transports.forEach(t => {
                if (isItemIncluded(t.inclusionType)) {
                    total += safeNum(t.price) * safeNum(t.vehicleCount);
                }
            });
        }
        if(day.activities) {
            day.activities.forEach(a => {
                if (isItemIncluded(a.inclusionType)) {
                    const guideCost = a.guideType === 'guided' ? safeNum(a.guideFee) : 0;
                    const itemCost = (safeNum(a.entranceFeePP) + safeNum(a.activityFeePP)) * travelerCount;
                    total += itemCost + guideCost;
                }
            });
        }
        if(day.meals) {
            day.meals.forEach(m => {
                if (isItemIncluded(m.inclusionType)) {
                    total += safeNum(m.adultCost) * travelerCount;
                }
            });
        }
    });
    return total;
  }, [rawDayPlans, travelerCount]);

  // --- 2. DETERMINE FINAL PRICE ---
  const netInSelected = convert(calculatedNetTotal, currency);
  
  // NEW: CHECK FOR FIXED PRICE OVERRIDE
  let finalPerPerson = 0;

  // Check if fixed pricing is enabled and a row is selected
  const activeFixedDeparture = itineraryData.fixedDepartures?.find(d => d.isSelected);

  if (itineraryData.useFixedPrice && activeFixedDeparture) {
      // OVERRIDE: Use the manual price
      finalPerPerson = activeFixedDeparture.price;
  } else {
      // STANDARD: Use calculated price
      const markupAmount = netInSelected * (markupPercent / 100);
      const exactGrandTotal = netInSelected + markupAmount;
      const exactPerPerson = travelerCount > 0 ? exactGrandTotal / travelerCount : 0;
      
      finalPerPerson = exactPerPerson;
      if (roundingMode === '5') finalPerPerson = Math.ceil(exactPerPerson / 5) * 5;
      else if (roundingMode === '10') finalPerPerson = Math.ceil(exactPerPerson / 10) * 10;
      else if (roundingMode === '100') finalPerPerson = Math.ceil(exactPerPerson / 100) * 100;
  }

//   // --- FINAL TOTALS CALCULATION (Exact Match) ---
//   const netInSelected = convert(calculatedNetTotal, currency);
//   const markupAmount = netInSelected * (markupPercent / 100);
//   const exactGrandTotal = netInSelected + markupAmount;
//   const exactPerPerson = travelerCount > 0 ? exactGrandTotal / travelerCount : 0;

//   // --- ROUNDING LOGIC (The Missing Piece) ---
//   let finalPerPerson = exactPerPerson;
//   if (roundingMode === '5') finalPerPerson = Math.ceil(exactPerPerson / 5) * 5;
//   else if (roundingMode === '10') finalPerPerson = Math.ceil(exactPerPerson / 10) * 10;
//   else if (roundingMode === '100') finalPerPerson = Math.ceil(exactPerPerson / 100) * 100;
  
  // Logic for display label
  const hasFlights = rawDayPlans.some(day => 
    day.transports?.some(t => t.mode === 'flight' && isItemIncluded(t.inclusionType))
  );
  const costLabel = hasFlights ? "(FLIGHTS INCL.)" : "(LAND ONLY)";

  // --- 3. LOGIC: HANDLE CONTINUED STAYS & FLATTENING ---
  const getRenderableItemsForDay = (dayIndex: number, currentDay: DayPlan) => {
    const items: any[] = [];

    // Add Items (Ensure inclusionType is passed)
    if(currentDay.activities) currentDay.activities.forEach(a => items.push({ ...a, category: 'Activity' }));
    if(currentDay.transports) currentDay.transports.forEach(t => items.push({ ...t, category: 'Transport' }));
    if(currentDay.meals) currentDay.meals.forEach(m => items.push({ ...m, category: 'Meal' }));
    
    // Add Stays (Check-in)
    if(currentDay.stays) currentDay.stays.forEach(s => items.push({ ...s, category: 'Stay', status: 'Check-in' }));

    // Add Ghost Stays (Residence)
    for (let i = 0; i < dayIndex; i++) {
        const pastDay = rawDayPlans.find(d => d.dayNumber === (i + 1));
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


// --- PDF GENERATION: VISUAL CAPTURE (Preserves HTML Design) ---
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

        pdf.save(`${itineraryData.tripName || 'Itinerary'}.pdf`);

    } catch (error) {
        console.error("PDF Gen Error:", error);
        alert("Failed to generate PDF. Please check console.");
    } finally {
        setIsDownloading(false);
    }
  };



  if (loading) return <div>Loading Preview...</div>;


return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center gap-6">
      
      {/* TOOLBAR */}
      <div className="w-full max-w-[370mm] flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
         <h2 className="font-bold text-gray-700">Print Preview</h2>
         <button 
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
         >
            {isDownloading ? 'Generating...' : <><Download size={18} /> Download PDF</>}
         </button>
      </div>

      {/* --- PRINTABLE AREA --- */}
      <div 
        ref={printRef}
        id="pdf-content"
        style={{ backgroundColor: '#ffffff', color: '#1f2937', fontFamily: 'Arial, sans-serif' }} 
        className="w-full max-w-[370mm] min-h-[297mm] shadow-2xl p-0"
      >
        
        {/* HEADER */}
        <div style={{ borderBottom: '4px solid #dc2626' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
                <div style={{ flex: 1, padding: '24px' }}>
                    <div style={{ height: '48px', marginBottom: '16px' }}>
                        <img src="/logo.png" alt="Company Logo" style={{ height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <h1 style={{ color: '#dc2626', fontSize: '30px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, lineHeight: '1.1' }}>{itineraryData.tripName || "Luxury Getaway"}</h1>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', fontSize: '14px', fontWeight: 'bold', color: '#202020ff' }}>
                        <span style={{ backgroundColor: '#fef2f2', color:'#bb0000ff' ,  padding: '4px 8px', borderRadius: '4px' }}>{totalDays} Days | {totalNights} Nights</span>
                        {/* <span style={{ backgroundColor: '#f3f4f6', color:'#202020ff',  padding: '4px 8px', borderRadius: '4px' }}>Ref: {"ITN-" + Math.floor(Math.random() * 10000)}</span> */}
                        <span style={{ backgroundColor: '#f3f4f6', color:'#202020ff',  padding: '4px 8px', borderRadius: '4px' }}>Ref: ######</span>
                    </div>
                </div>
                <div style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '250px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.9, marginBottom: '4px' }}>Starting at</span>
                    <span style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.025em', lineHeight: '1' }}>
                       $ {finalPerPerson.toLocaleString(undefined, {currency: currency, maximumFractionDigits: 0 })}
                        <span style={{ fontSize: '16px', fontWeight: '500', marginLeft: '4px' }}>PP*</span>
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8, marginTop: '4px', letterSpacing: '0.05em' }}>{costLabel}</span>
                </div>
            </div>
            {/* DETAILS GRID */}
            <div style={{ borderTop: '1px solid #636363ff' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', fontSize: '12px' }}>
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Release Date:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{formatDate(new Date().toISOString())}</div>
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Trip Validity:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{formatDate(itineraryData.routingData?.startDate)} to {formatDate(itineraryData.routingData?.endDate)}</div>
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Country:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{itineraryData.selectedCountries?.join(', ') || "India"}</div>
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Cities:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{uniqueCities}</div>
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Start / End:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{startCity} / {endCity}</div>
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Route:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{itineraryData.selectedCountries?.length || 1} Country | {routes.length} Cities</div>
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff' }}>Trip Type:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', textTransform: 'uppercase', gridColumn: 'span 3' }}>{itineraryData.packageType || "Premium"}</div>
                </div>
            </div>
        </div>

        {/* ITINERARY BODY */}
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

                {/* --- FIX: Map directly to tbody for page break avoidance --- */}
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
                                                            {item.cuisine}  {item.menuType}
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

        {/* Footer */}
        <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', marginTop: '32px', padding: '24px', textAlign: 'center', fontSize: '12px', color: '#505050ff' }}>
            <p>Generated by Travdek. Prices and availability are subject to change.</p>
        </div>
      </div>
    </div>
  );
}