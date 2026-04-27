
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

import { Download , Share2, X, Loader2, Mail, ArrowLeft, BedDouble, Bus, Camera, Car, Plane, Ship, Train, Utensils} from "lucide-react";
// import toast, { Toaster } from 'react-hot-toast';
import { useItinerary } from '@/app/context/ItineraryContext';
import { DayPlan } from '../create-day/constants/daywiseConstants';
import { useUser } from '@/app/context/UserContext';
import { useCurrency } from '@/hooks/useCurrency'; 
import { calculateTripCosts } from '@/utils/costingLogic'; 
import { useRouter } from 'next/navigation';


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
  const router = useRouter();
  const { user } = useUser();
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

// 👇 UPDATED: Share Modal States (Added Phone & Checkboxes)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareForm, setShareForm] = useState({ 
      clientName: '', clientEmail: '', clientPhone: '', 
      sendEmail: true, sendWhatsapp: false 
  });



  // --- 1. DATA PREPARATION ---
  const routes = itineraryData.routingData?.routes || [];
  const startCity = routes.length > 0 ? routes[0].cities[0]?.name : 'TBA';
  const endCity = routes.length > 0 ? routes[routes.length - 1].cities[0]?.name : 'TBA';
  const totalNights = routes.reduce((acc, curr) => acc + (curr.nights || 0), 0);
  const totalDays = totalNights + 1;

  // 🌟 NEW: Dynamic Cities with Nights (e.g., "Athens (2N) | Mykonos (2N)")
  const citiesWithNights = routes
      .filter((r: any) => r.cities && r.cities.length > 0 && r.cities[0].name)
      .map((r: any) => {
          const cityNames = r.cities.map((c: any) => c.name).join(' / ');
          const n = parseInt(r.nights) || 0;
          return n > 0 ? `${cityNames} (${n}N)` : cityNames;
      })
      .join(' | ');

//   const uniqueCities = Array.from(new Set(routes.flatMap(r => r.cities.map(c => c.name)))).join(' | ');
  
  // Chop off ghost days
  const rawDayPlans = ((itineraryData.dayWiseActivities || []) as DayPlan[]).slice(0, totalDays);

  // --- 2. NEW PRICING MATH (100% Synced with Costing & Review Pages) ---
  const { currency, setCurrency, convert, loading } = useCurrency('USD');

  useEffect(() => {
    if (itineraryData.selectedCurrency) {
        setCurrency(itineraryData.selectedCurrency);
    } else {
        const savedCurrency = localStorage.getItem('travdek_preferred_currency');
        if (savedCurrency) setCurrency(savedCurrency);
    }
  }, [itineraryData.selectedCurrency]);

  const travelerCount = parseInt(String(itineraryData.numberOfTravelers)) || 1;
  const isAgent = user?.role === 'agent';

  const pricingMatrix = itineraryData.pricingMatrix || {};
  const markupPercent = itineraryData.markupPercentage !== undefined ? itineraryData.markupPercentage : 20;
  const agentMargin = (itineraryData as any).agentMargin || 0;
  const roundingMode = itineraryData.roundingMode || 'none';
  const fixedDepartures = itineraryData.fixedDepartures || [];
  const selectedDepartureId = itineraryData.selectedDepartureId || null;
  const includedOptionals: string[] = itineraryData.includedOptionals || [];
  const simulationDate = (itineraryData as any).simulationDate;

  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const selectedMonth = useMemo(() => {
      if (simulationDate) {
          const d = new Date(simulationDate);
          if (!isNaN(d.getTime())) return MONTHS[d.getMonth()];
      }
      return 'JAN';
  }, [simulationDate]);

  // Calculate Totals (includes optional toggles)
  const totals = useMemo(() => {
      let totalNet = 0;
      const currentMonthCosts = pricingMatrix[selectedMonth] || {};
      
      const addCost = (item: any) => {
          const cost = currentMonthCosts[item.id.toString()] || 0;
          const itemIdStr = item.id.toString();

          if (!item.inclusionType || item.inclusionType.toLowerCase() === 'included') {
              totalNet += cost;
          } else if (item.inclusionType.toLowerCase() === 'optional') {
              if (includedOptionals.includes(itemIdStr)) {
                  totalNet += cost; 
              }
          }
      };

      rawDayPlans.forEach(day => {
          day.stays?.forEach(addCost);
          day.transports?.forEach(addCost);
          day.activities?.forEach(addCost);
          day.meals?.forEach(addCost);
      });
      return { totalNet };
  }, [rawDayPlans, pricingMatrix, selectedMonth, includedOptionals]);

  const netInSelected = convert(totals.totalNet, currency);

  let activeFixedDeparture: any = null;
  let activePriceDBL = 0;

  for (const month of fixedDepartures) {
      if (month.id === selectedDepartureId) {
          activeFixedDeparture = month;
          activePriceDBL = month.priceDBL || 0; 
          break;
      }
      const specificDate = month.departures?.find((d: any) => d.id === selectedDepartureId);
      if (specificDate) {
          activeFixedDeparture = specificDate;
          activePriceDBL = specificDate.overridePriceDBL ? Number(specificDate.overridePriceDBL) : (month.priceDBL || 0);
          break;
      }
  }

  let wholesaleGrandTotal = 0;
  if (activeFixedDeparture) {
      wholesaleGrandTotal = convert(activePriceDBL * travelerCount, currency);
  } else {
      const adminMarkupAmount = netInSelected * (markupPercent / 100);
      wholesaleGrandTotal = netInSelected + adminMarkupAmount;
  }

  let finalPerPerson = 0;
  if (isAgent) {
      const agencyMarkupAmount = wholesaleGrandTotal * (agentMargin / 100);
      const exactPerPerson = travelerCount > 0 ? (wholesaleGrandTotal + agencyMarkupAmount) / travelerCount : 0;
      finalPerPerson = exactPerPerson;
  } else {
      finalPerPerson = travelerCount > 0 ? wholesaleGrandTotal / travelerCount : 0;
  }

  if (roundingMode === '5') finalPerPerson = Math.ceil(finalPerPerson / 5) * 5;
  else if (roundingMode === '10') finalPerPerson = Math.ceil(finalPerPerson / 10) * 10;
  else if (roundingMode === '100') finalPerPerson = Math.ceil(finalPerPerson / 100) * 100;

  const costLabel = rawDayPlans.some(day => day.transports?.some(t => t.mode === 'flight' && isItemIncluded(t.inclusionType))) ? "(FLIGHTS INCL.)" : "(LAND ONLY)";

  // --- 3. LOGIC: HANDLE CONTINUED STAYS & FLATTENING ---
  const getRenderableItemsForDay = (dayIndex: number, currentDay: DayPlan) => {
    const items: any[] = [];
    if(currentDay.activities) currentDay.activities.forEach(a => items.push({ ...a, category: 'Activity' }));
    if(currentDay.transports) currentDay.transports.forEach(t => items.push({ ...t, category: 'Transport' }));
    if(currentDay.meals) currentDay.meals.forEach(m => items.push({ ...m, category: 'Meal' }));
    if(currentDay.stays) currentDay.stays.forEach(s => items.push({ ...s, category: 'Stay', status: 'Check-in' }));

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

  // --- REFS FOR NEW PDF ENGINE ---
  const headerSectionRef  = useRef<HTMLDivElement>(null);
  const itineraryLabelRef = useRef<HTMLHeadingElement>(null);
  const tableRef          = useRef<HTMLTableElement | null>(null);
  const tableHeadRef      = useRef<HTMLTableSectionElement>(null);
  const dayRefsMap        = useRef<Map<number, HTMLElement>>(new Map());
  const footerRef         = useRef<HTMLDivElement>(null);



// 👇 1. THE NEW OFF-SCREEN PDF ENGINE (Handles Header, Table, and Footer!)
  const createPdfObject = async () => {
      const PDF_W_MM  = 210;  
      const PDF_H_MM  = 297;  
      const MARGIN_MM = 10;   
      const CONTENT_W_MM = PDF_W_MM - (MARGIN_MM * 2);

      const pdf = new jsPDF('p', 'mm', 'a4');
      let currentY = MARGIN_MM; 

      // High-res options, ignoring elements we don't want to print twice
      const H2C_OPTS = {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        ignoreElements: (el: Element) => el.hasAttribute('data-html2canvas-ignore'),
      };

      const toMm = (canvas: HTMLCanvasElement): number => (canvas.height * CONTENT_W_MM) / canvas.width;
      
      const placeCanvas = (canvas: HTMLCanvasElement, y: number): number => {
        const h = toMm(canvas);
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', MARGIN_MM, y, CONTENT_W_MM, h);
        return h;
      };
      
      const ensureFits = (neededMm: number): void => {
        if (currentY + neededMm > PDF_H_MM - MARGIN_MM) { 
            pdf.addPage(); 
            currentY = MARGIN_MM; 
        }
      };

      // ─────────────────────────────────────────────────────────
      // A. CAPTURE HEADER (Red/Blue Banner & Details Grid)
      // ─────────────────────────────────────────────────────────
      if (headerSectionRef.current) {
        const headerCanvas = await html2canvas(headerSectionRef.current, H2C_OPTS);
        const headerH = toMm(headerCanvas);
        ensureFits(headerH);
        currentY += placeCanvas(headerCanvas, currentY) + 4;
      }

      // ─────────────────────────────────────────────────────────
      // B. NATIVE TEXT FOR "ITINERARY DETAILS" (Crisp 10px Font)
      // ─────────────────────────────────────────────────────────
      ensureFits(8);
      pdf.setFontSize(10); // As requested!
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(220, 38, 38); // Red color to match Preview Page (#dc2626)
      
      const headingText = "ITINERARY DETAILS";
      pdf.text(headingText, MARGIN_MM, currentY + 5);
      
      // Exact underline width math
      const textWidth = pdf.getTextWidth(headingText);
      pdf.setDrawColor(220, 38, 38);
      pdf.setLineWidth(0.5);
      pdf.line(MARGIN_MM, currentY + 6, MARGIN_MM + textWidth, currentY + 6); 
      
      currentY += 9; // Spacing before table

      // ─────────────────────────────────────────────────────────
      // C. THE MAGIC TRICK: OFF-SCREEN TABLE CLONING
      // ─────────────────────────────────────────────────────────
      if (tableRef.current) {
        const originalTable = tableRef.current;
        const tableWidth = originalTable.offsetWidth;

        // Create invisible wrapper
        const hiddenWrapper = document.createElement('div');
        hiddenWrapper.style.position = 'absolute';
        hiddenWrapper.style.left = '-9999px';
        hiddenWrapper.style.top = '0px';
        // hiddenWrapper.style.width = `${tableWidth}px`;

        // 👇 FIX 1: Add + 2px to the width to prevent right-border clipping
        hiddenWrapper.style.width = `${tableWidth + 2}px`;
        // 👇 FIX 2: Add 1px padding to ensure the border doesn't touch the absolute edge of the canvas
        hiddenWrapper.style.paddingRight = '1px';
        hiddenWrapper.style.backgroundColor = '#ffffff';

        // Clone table
        const clonedTable = originalTable.cloneNode(true) as HTMLTableElement;
        hiddenWrapper.appendChild(clonedTable);
        document.body.appendChild(hiddenWrapper);

        const clonedTbodies = Array.from(clonedTable.querySelectorAll('tbody'));
        const clonedThead = clonedTable.querySelector('thead');

        // Hide all days initially
        clonedTbodies.forEach(el => el.style.display = 'none');
        if (clonedThead) clonedThead.style.display = '';

        // Loop through days one by one
        for (let i = 0; i < clonedTbodies.length; i++) {
          const currentTbody = clonedTbodies[i];
          currentTbody.style.display = '';
          currentTbody.style.boxShadow = 'none';

          const dayCanvas = await html2canvas(clonedTable, H2C_OPTS);
          const dayH = toMm(dayCanvas);

          ensureFits(dayH);
          currentY += placeCanvas(dayCanvas, currentY); 

          currentTbody.style.display = 'none';
          
          // Hide header after first day so it stitches seamlessly
          if (clonedThead) clonedThead.style.display = 'none';
        }
        
        // Cleanup clone
        document.body.removeChild(hiddenWrapper);
        currentY += 8; // Spacing after the table finishes
      }

      // ─────────────────────────────────────────────────────────
      // D. CAPTURE FOOTER (Inclusions, Exclusions, T&C)
      // ─────────────────────────────────────────────────────────
      if (footerRef.current) {
          const footerCanvas = await html2canvas(footerRef.current, H2C_OPTS);
          const footerH = toMm(footerCanvas);
          
          // Check if footer fits, otherwise push to brand new page
          ensureFits(footerH);
          placeCanvas(footerCanvas, currentY);
      }

      return pdf;
  };
  // 👇 2. Download Button Logic
  const handleDownloadPdf = async () => {
    try {
        setIsDownloading(true);
        const pdf = await createPdfObject();
        pdf.save(`${itineraryData.tripName || 'Itinerary'}.pdf`);
    } catch (error) {
        console.error("PDF Gen Error:", error);
        alert("Failed to generate PDF.");
    } finally {
        setIsDownloading(false);
    }
  };

  // 👇 3. Master Share Button Logic
  const handleShareEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (shareForm.sendEmail && !shareForm.clientEmail) return alert("Client Email is required.");
    if (shareForm.sendWhatsapp && !shareForm.clientPhone) return alert("Client Phone is required.");
    if (!shareForm.sendEmail && !shareForm.sendWhatsapp) return alert("Please select a sending method.");
    
    setIsSharing(true);

    try {
        const pdf = await createPdfObject();
        const pdfBase64 = pdf.output('datauristring'); 
        const res = await fetch('/api/share', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientName: shareForm.clientName,
                clientEmail: shareForm.clientEmail,
                clientPhone: shareForm.clientPhone,
                pdfBase64: pdfBase64,
                tripName: itineraryData.tripName || "Custom Itinerary",
                sendEmail: shareForm.sendEmail,
                sendWhatsapp: shareForm.sendWhatsapp
            })
        });

        const data = await res.json();
        if (data.success) {
            alert("Successfully shared with client!"); 
            setIsShareModalOpen(false);
            setShareForm({ clientName: '', clientEmail: '', clientPhone: '', sendEmail: true, sendWhatsapp: false });
        } else { alert("Failed to process: " + data.message); }
    } catch (error) {
        alert("An error occurred while sharing.");
    } finally {
        setIsSharing(false);
    }
  };

  if (loading) return <div>Loading Preview...</div>;



return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center gap-6">
      
      {/* TOOLBAR */}
      <div className="w-full max-w-[390mm] flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
         <h2 className="font-bold text-gray-700">Print Preview</h2>
      
         <div className="flex gap-3">
            <button 
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded shadow hover:bg-green-700 transition-colors"
            >
                <Share2 size={18} /> Share with Client
            </button>
            <button 
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
                {isDownloading ? 'Generating...' : <><Download size={18} /> Download PDF</>}
            </button>
         </div>
      </div>

      {/* --- PRINTABLE AREA --- */}
      <div 
        ref={printRef}
        id="pdf-content"
        style={{ backgroundColor: '#ffffff', color: '#1f2937', fontFamily: 'Arial, sans-serif' }} 
        className="w-full max-w-[390mm] min-h-[297mm] shadow-2xl p-0"
      >
        
        {/* 👇 HEADER SECTION (Ref added!) */}
  
            <div ref={headerSectionRef} style={{ borderBottom: '2px solid #e5e7eb', padding: '32px 24px', backgroundColor: '#fff' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        
        {/* LEFT SIDE: Trip Name & Duration */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '16px', textTransform: 'uppercase' }}>
            <h1 style={{ color: '#001d6a', fontSize: '32px', fontWeight: 'bold', margin: '0 0 4px 0', lineHeight: '1.2' }}>
                {itineraryData.tripName || "Draft Itinerary"}
            </h1>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#001d6a' }}>
                {totalDays} Days | {totalNights} Nights
            </div>
        </div>

        {/* RIGHT SIDE: Logo & Contact Details */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flexShrink: 0 }}>
            
            {/* Logo */}
            <div style={{ height: '50px', marginBottom: '14px' }}>
                <img 
                    src="/logo.png" 
                    alt="Company Logo" 
                    style={{ height: '100%', objectFit: 'contain', objectPosition: 'left center' }} 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                />
            </div>

            {/* Contact Details */}
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '6px', 
                fontSize: '13px', 
                fontFamily: 'inherit',
                minWidth: '240px' 
            }}>
      

            {/* Email */}
<div style={{ display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '18px' }}>
    <i className="fa-solid fa-envelope" style={{ color: '#712400', width: '16px', textAlign: 'center', fontSize: '13px' }}></i>
    <span style={{ width: '42px', color: '#121214', fontWeight: 'bold' }}>Email:</span>
    <span style={{ color: '#001d6a', fontWeight: 'bold' }}>Sandeep@TravDek.com</span>
</div>

{/* Phone */}
<div style={{ display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '18px' }}>
    <i className="fa-solid fa-phone" style={{ color: '#000000', width: '16px', textAlign: 'center', fontSize: '13px' }}></i>
    <span style={{ width: '42px', color: '#121214', fontWeight: 'bold' }}>Tel:</span>
    <span style={{ color: '#001d6a', fontWeight: 'bold' }}>+1 650 759 4331</span>
</div>

{/* Website */}
<div style={{ display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '18px' }}>
    <i className="fa-solid fa-globe" style={{ color: '#0038a8', width: '16px', textAlign: 'center', fontSize: '13px' }}></i>
    <span style={{ width: '42px', color: '#121214', fontWeight: 'bold' }}>Web:</span>
    <a href="http://www.TravDek.com" style={{ color: '#001d6a', fontWeight: 'bold', textDecoration: 'none' }}>www.TravDek.com</a>
</div>

{/* Address */}
<div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
    <i className="fa-solid fa-location-dot" style={{ color: '#df0000', width: '16px', textAlign: 'center', fontSize: '13px', marginTop: '2px' }}></i>
    <span style={{ width: '42px', color: '#121214', fontWeight: 'bold' }}>Add:</span>
    <span style={{ color: '#001d6a', fontWeight: 'bold', lineHeight: '1.5' }}>
        750 Alma lane #4459 Foster City, CA 94404 USA
    </span>
</div>
</div>
        </div>
    </div>
       

            {/* DETAILS GRID (Preview Page) */}
            {/* DETAILS GRID */}
            <div style={{ borderTop: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', fontSize: '12px' }}>
                    
                    {/* ROW 1: Ref ID & Travelers */}
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Ref. ID:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{itineraryData.tripId || "Pending..."}</div>
                    
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Travelers:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{itineraryData.numberOfTravelers} Pax</div>

                    {/* ROW 2: Release Date & Trip Validity */}
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Release Date:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{formatDate(new Date().toISOString())}</div>
                    
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Trip Validity:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>
                        {itineraryData.seasonStartDate ? formatDate(itineraryData.seasonStartDate) : formatDate(itineraryData.routingData?.startDate)} 
                        {' to '} 
                        {itineraryData.seasonEndDate ? formatDate(itineraryData.seasonEndDate) : formatDate(itineraryData.routingData?.endDate)}
                    </div>

                    {/* ROW 3: Country */}
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Country:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{itineraryData.selectedCountries?.join(', ') || "India"}</div>
                    
                    {/* ROW 4: Cities */}
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Cities:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{citiesWithNights}</div>
                    
                    {/* ROW 5: Start / End & Route */}
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Start / End:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{startCity} / {endCity}</div>
                    
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Route:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{itineraryData.selectedCountries?.length || 1} Country | {routes.length} Cities</div>
                    
                {/* ROW 6: Type & Package */}
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff' }}>Type:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', textTransform: 'uppercase', borderRight: '1px solid #636363ff' }}>{itineraryData.tripStyle || "TBA"}</div>

                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff' }}>Package:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>{itineraryData.packageType || "Premium"}</div>
                </div>
            </div>
   
        </div>

        {/* 👇 ITINERARY Details Label (Ref added, font size fixed to 10px in PDF) */}
        <div style={{ marginTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '48px' }}>
            <h3 ref={itineraryLabelRef} style={{ color: '#dc2626', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'underline', marginBottom: '16px', fontSize: '14px', letterSpacing: '0em' }}>Itinerary Details</h3>
            
            {/* 👇 TABLE SECTION (Ref & Colgroup added!) */}

            <table 
    ref={tableRef}
    style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #6b6b6b', fontSize: '14px', tableLayout: 'fixed' }}
>
    {/* 3 Columns: Category, Details, Inclusion */}
    <colgroup>
        <col style={{ width: '200px' }} />
        <col style={{ width: 'auto' }} />
        <col style={{ width: '140px' }} />
    </colgroup>

    {rawDayPlans.map((day, idx) => {
        const items = getRenderableItemsForDay(idx, day);

        const prevCity = idx > 0 ? rawDayPlans[idx - 1].city : null;
        const isCityChange = prevCity && prevCity !== day.city;
        const displayCityName = isCityChange ? `${prevCity} - ${day.city}` : day.city;

        let nightCount = 0;
        if (!prevCity || isCityChange) {
            const currentRoute = routes.find((r: any) => r.cities.some((c: any) => c.name === day.city));
            if (currentRoute) nightCount = currentRoute.nights;
        }
        const displayNights = nightCount > 0 ? ` (${nightCount}N)` : '';
        const finalDayHeader = `${displayCityName}${displayNights}`.toUpperCase();

        return (
            <tbody
                key={day.dayNumber}
                ref={(el) => { if (el) dayRefsMap.current.set(day.dayNumber, el); }}
                style={{ 
                    breakInside: 'avoid', 
                    pageBreakInside: 'avoid',
                    outline: '1px solid #6b6b6b',
                }}
            >
                {/* DAY HEADER ROW */}
                <tr style={{ backgroundColor: '#fefce8' }}>
                    <td colSpan={3} style={{ 
                        padding: '12px 16px', 
                        border: '1px solid #6b6b6b',
                        borderTop: idx > 0 ? '2px solid #6b6b6b' : '1px solid #6b6b6b'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <span style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '16px' }}>DAY {String(day.dayNumber).padStart(2, '0')}</span>
                            <span style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '16px' }}>{finalDayHeader}</span>
                        </div>
                    </td>
                </tr>

                {/* Leisure Day */}
                {items.length === 0 && (
                    <tr>
                        <td colSpan={3} style={{ border: '1px solid #6b6b6b', padding: '16px', color: '#9ca3af', fontStyle: 'italic', textAlign: 'center' }}>
                            Leisure day. No activities scheduled.
                        </td>
                    </tr>
                )}

                {/* Items Loop */}
                {items.map((item, itemIdx) => {
                    const inclusionStatus = item.inclusionType || 'included'; 
                    const isExcluded = inclusionStatus === 'excluded';
                    const isOptional = inclusionStatus === 'optional';
                    const badgeBg = isExcluded ? '#ffffff' : isOptional ? '#ffffff' : '#ffffff';
                    const badgeColor = isExcluded ? '#454545' : isOptional ? '#454545' : '#454545';
                    const badgeText = isExcluded ? 'Excluded' : isOptional ? 'Optional' : 'Included';

                 

                    // 🌟 SMART ICON LOGIC (FontAwesome)
                                            let iconClass = 'fa-solid fa-camera'; // Default for Activity
                                            let iconColor = '#0284c7'; // Default blue
                                            
                                            if (item.category === 'Stay') { 
                                                iconClass = 'fa-solid fa-hotel'; 
                                                iconColor = '#059669'; 
                                            } 
                                            else if (item.category === 'Meal') { 
                                                iconClass = 'fa-solid fa-utensils'; 
                                                iconColor = '#d97706'; 
                                            } 
                                            else if (item.category === 'Transport') {
                                                iconColor = '#6366f1'; // Indigo
                                                if (item.mode === 'flight') iconClass = 'fa-solid fa-plane';
                                                else if (item.mode === 'rail') iconClass = 'fa-solid fa-train';
                                                else if (item.mode === 'ferry') iconClass = 'fa-solid fa-ship';
                                                else if (item.mode === 'bus') iconClass = 'fa-solid fa-bus';
                                                else iconClass = 'fa-solid fa-car';
                                            }

                    return (
                                                <tr key={`${day.dayNumber}-${itemIdx}`} className="pdf-row" >
                                                    
                                          


                                                    {/* 🌟 COL 1: CATEGORY WITH ICON (FontAwesome + PDF Fixed) */}
                                                    <td style={{ border: '1px solid #6b6b6b', padding: '16px 24px', verticalAlign: 'middle', width: '200px' }}>
                                                        <div style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'flex-start', 
                                                            gap: '16px', 
                                                            fontWeight: 'bold', 
                                                            color: '#454545', 
                                                            fontSize: '14px', 
                                                            textTransform: 'uppercase', 
                                                            letterSpacing: '0.05em',
                                                            height: '20px' // Lock container height
                                                        }}>
                                                            {/* Strict Icon Wrapper for FontAwesome */}
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px' }}>
                                                                <i className={iconClass} style={{ color: iconColor, fontSize: '18px', display: 'block', textAlign: 'center', lineHeight: '20px' }}></i>
                                                            </div>
                                                            {/* Strict Text Wrapper with Locked Line-Height */}
                                                            <span style={{ lineHeight: '20px', display: 'inline-block' }}>
                                                                {item.category === 'Stay' ? 'Hotel' : item.category}
                                                            </span>
                                                        </div>
                                                    </td>



                                                 
                                                    {/* 🌟 COL 2: DESCRIPTION (Middle Content) */}
<td style={{ border: '1px solid #6b6b6b', padding: '16px', verticalAlign: 'top' }}>
                                                        
                                             

                                                             {/* --- ACTIVITY PDF BLOCK --- */}
                                                        {item.category === 'Activity' && (
                                                            <div>
                                                                <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '16px' }}>{item.heading}</div>
                                                                <div style={{ color: '#292d33ff', fontSize: '12px', marginTop: '4px', marginBottom: '8px' }}>{item.description}</div>
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', padding: '8px' }}>
                                                                    <span style={{ color: '#292d33ff', display: 'flex', alignItems: 'center', gap: '4px', }}>Slot: {item.slot}</span>
                                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Duration: {item.duration}</span>
                                                                    {item.startTime && <span style={{ color: '#292d33ff' }}>Start: {item.startTime}</span>}
                                                                    {(item as any).endTime && <span style={{ color: '#292d33ff' }}>End: {(item as any).endTime}</span>}
                                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Pickup: {item.pickupLocation || "TBA"}</span>
                                                                    {(item as any).dropoffLocation && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Drop: {(item as any).dropoffLocation}</span>}
                                                                </div>
                                                            </div>
                                                        )}

                                         
                                                         {/* --- STAY PDF BLOCK --- */}
                                                         {item.category === 'Stay' && (
                                                            <div style={{ opacity: item.status === 'Residence' ? 0.8 : 1 }}>
                                                                <div style={{ fontWeight: 'bold', color: '#22252bff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    {item.hotelName}
                                                                    <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#fff' }}>⭐ {item.rating}</span>
                                                                </div>
                                                                <div style={{ marginTop: '2px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                                                                    {item.status === 'Check-in' ? (
                                                                        <>
                                                                            <div style={{  color: '#555555', padding: '2px', fontWeight: 'bold' }}>Type: {item.stayType} (Stay)</div>
                                                                            <div style={{  color: '#555555', padding: '2px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
                                                                            <div style={{  color: '#555555', padding: '2px' }}>{item.nights} Nights Stay</div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div style={{ gridColumn: 'span 2', fontSize: '12px', color: '#292d33ff', fontStyle: 'italic', marginTop: '2px' }}>Continuing stay at {item.hotelName}. </div>
                                                                              <div style={{  color: '#555555', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Type: {item.stayType} (Stay)</div>
                                                                            <div style={{  color: '#555555', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
                                                                        </>
                                                                   )}
                                                                </div>
                                                            </div>
                                                        )}

                                                          {/* --- TRANSPORT PDF BLOCK --- */}
                                                         {item.category === 'Transport' && (
                                                            <div>
                                                                {/* Title & Badge */}
                                                                <div style={{ fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                                                                    {item.vehicleType}
                                                                    {['flight', 'rail', 'ferry'].includes(item.mode) && item.flightNumber && (
                                                                        <span style={{ color: '#2563eb' }}> • {item.flightNumber}</span>
                                                                    )}
                                                                    <span style={{ 
                                                                        backgroundColor: ['flight', 'rail', 'ferry'].includes(item.mode) ? '#eff6ff' : '#f0fdf4', 
                                                                        color: ['flight', 'rail', 'ferry'].includes(item.mode) ? '#1d4ed8' : '#15803d', 
                                                                        fontSize: '10px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', 
                                                                        border: `1px solid ${['flight', 'rail', 'ferry'].includes(item.mode) ? '#bfdbfe' : '#dcfce7'}` 
                                                                    }}>
                                                                        {['flight', 'rail', 'ferry'].includes(item.mode) ? 'Transit Ticket' : item.subType}
                                                                    </span>
                                                                </div>

                                                                {/* Flight Layout */}
                                                                {item.mode === 'flight' ? (
                                                                    <div style={{ marginTop: '12px', padding: '12px'}}>
                                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center', gap: '16px' }}>
                                                                            {/* Dep */}
                                                                            <div>
                                                                                <div style={{ fontSize: '14px', fontWeight: '900', color: '#555555' }}>{item.pickupTime || '--:--'}</div>
                                                                                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#555555', textTransform: 'uppercase' }}>{item.pickupLocation || 'Not Set'}</div>
                                                                            </div>
                                                                            {/* Middle */}
                                                                            <div style={{ textAlign: 'center' }}>
                                                                                <div style={{ fontSize: '10px', color: '#555555', fontWeight: 'bold', marginBottom: '4px' }}>DURATION: {item.duration || '--'}</div>
                                                                                <div style={{ position: 'relative', width: '100%', height: '2px', backgroundColor: '#6b6b6b', margin: '8px 0' }}>
                                                                                    {item.flightStops && item.flightStops !== 'Direct' ? (
                                                                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '8px', height: '8px', backgroundColor: '#2563eb', borderRadius: '50%', border: '#6b6b6b' }}></div>
                                                                                    ) : (
                                                                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '14px' }}>✈️</div>
                                                                                    )}
                                                                                </div>
                                                                                <div style={{ fontSize: '10px', fontWeight: 'bold', color: item.flightStops && item.flightStops !== 'Direct' ? '#2563eb' : '#16a34a' }}>
                                                                                    {item.flightStops && item.flightStops !== 'Direct' ? `${item.flightStops} ${item.layoverInfo ? `• ${item.layoverInfo}` : ''}` : 'Direct Flight'}
                                                                                </div>
                                                                            </div>
                                                                            {/* Arr */}
                                                                            <div style={{ textAlign: 'right' }}>
                                                                                <div style={{ fontSize: '14px', fontWeight: '900', color: '#555555' }}>
                                                                                    {item.dropoffTime || '--:--'}
                                                                                    {(item as any).arrivalDayOffset === '+1' && <sup style={{ fontSize: '10px', color: '#ef4444', marginLeft: '2px' }}>+1</sup>}
                                                                                </div>
                                                                                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#555555', textTransform: 'uppercase' }}>{item.dropoffLocation || 'Not Set'}</div>
                                                                            </div>
                                                                        </div>
                                                                        {item.serviceDescription && (
                                                                            <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', fontSize: '11px', fontWeight:"bold", color: '#555555' }}>
                                                                                <strong>Cabin:</strong> {item.serviceDescription}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : ['rail', 'ferry'].includes(item.mode) ? (
                                                                    <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px',  padding: '12px' }}>
                                                                        <div>
                                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Schedule</div>
                                                                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>
                                                                                {item.pickupTime || '--:--'} <span style={{color: '555555', fontWeight: 'normal'}}>to</span> {item.dropoffTime || '--:--'}
                                                                                {(item as any).arrivalDayOffset === '+1' && <sup style={{ fontSize: '9px', color: '#ef4444', marginLeft: '2px' }}>+1</sup>}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>{item.mode === 'ferry' ? 'Ports' : 'Route'}</div>
                                                                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>{item.pickupLocation || 'Not Set'} → {item.dropoffLocation || 'Not Set'}</div>
                                                                        </div>
                                                                        <div>
                                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Duration</div>
                                                                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555', display: 'inline-block', padding: '2px 6px', borderRadius: '4px' }}>{item.duration || '--'}</div>
                                                                        </div>
                                                                        <div>
                                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>{item.mode === 'ferry' ? 'Deck Info' : 'Travel Info'}</div>
                                                                            <div style={{ fontSize: '12px', color: '#555555' }}>{item.serviceDescription || '--'}</div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    /* Vehicle Mode */
<div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: item.subType === 'transfer' ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap: '12px', padding: '12px',  }}>
                                                                        
                                                                        {/* Col 1: Pickup */}
                                                                        <div>
                                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Pickup</div>
                                                                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>{item.pickupLocation || 'Not Set'}</div>
                                                                            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#555555', marginTop: '2px' }}>{item.pickupTime || '--:--'}</div>
                                                                        </div>

                                                                        {/* Col 2: Drop-off (Only for Transfers) */}
                                                                        {item.subType === 'transfer' && (
                                                                            <div>
                                                                                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Drop-off</div>
                                                                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>{item.dropoffLocation || 'Not Set'}</div>
                                                                                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#555555', marginTop: '2px' }}>{item.dropoffTime || '--:--'}</div>
                                                                            </div>
                                                                        )}

                                                                        {/* Col 3: Duration (Always Visible) */}
                                                                        <div>
                                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Duration</div>
                                                                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555', display: 'inline-block', padding: '2px 6px', borderRadius: '4px' }}>{item.duration || '--'}</div>
                                                                        </div>

                                                                        {/* Col 4: Journey Info */}
                                                                        <div>
                                                                            <div style={{ fontSize: '10px',  fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Journey Info</div>
                                                                            <div style={{ fontSize: '11px', color: '#555555'  }}>{item.serviceDescription || '--'}</div>
                                                                        </div>
                                                                        
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}


                                                        {/* --- MEAL PDF BLOCK --- */}
                                                        {item.category === 'Meal' && (
                                                            <div>
                                                                <div style={{ color: '#1f2937', fontSize: '15px', fontWeight: 'bold' }}>
                                                                     {item.mealType}
                                                                </div>
                                                                {(item.restaurantName || item.cuisine) && (
                                                                    <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '4px' }}>
                                                                        {item.restaurantName ? `at ${item.restaurantName}` : ''} {item.cuisine ? `(${item.cuisine})` : ''}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        
                                                    </td>

                                                    {/* 🌟 COL 3: INCLUSION BADGE (Far Right) */}
                                                 
{/* 🌟 COL 3: INCLUSION BADGE (Far Right) */}
<td style={{ border: '1px solid #6b6b6b', padding: '16px', verticalAlign: 'middle', textAlign: 'center', width: '140px' }}>
                                                        
                                                        <span style={{ 
                                                            fontSize: '12px', 
                                                            fontWeight: 'bold', 
                                                            color: badgeColor, 
                                                            backgroundColor: badgeBg,
                                                            textTransform:"uppercase"
                                                        }}>
                                                            {badgeText}
                                                        </span>
                                                    </td>

                                                </tr>
                    
                    );
                })}
            </tbody>
        );
    })}
</table>
    
        </div>

        {/* 👇 INCLUSIONS, EXCLUSIONS, NOTES & POLICIES (Ref added!) */}
        <div ref={footerRef} style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* 1. IMPORTANT NOTES */}
            <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', marginTop: '16px', borderRadius: '6px', padding: '16px', breakInside: 'avoid', display: 'inline-block', width: '100%' }}>
                <h4 style={{ color: '#374151', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>Important Notes</h4>
                 <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: '1.4' }}>
                    <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Entrances, Tours once booked are non-refundable and non-transferable.</span></li>
                    <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>For all Group Based Tours, passengers have to join from a designated point advised upon confirmation. For Hotel Pickups, the meeting point is the Hotel Lobby.</span></li>
                    <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>All mentioned Distances represent actual travel time and do not account for waiting periods at sightseeing activities, theme parks, airports, etc.</span></li>
                    <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Optional tours can be taken only when there is enough time available between leisure time and included tours; please plan accordingly.</span></li>
                    <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>You must be present at the meeting point at least 10 mins prior to the start time of the activity mentioned in the itinerary.</span></li>
                    <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Tour durations are indicative and subject to change based on local conditions. Meeting points will be confirmed post-booking.</span></li>
                    <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>In case mentioned hotels are unavailable, we will provide similar/alternate properties (any change/additional cost will be advised).</span></li>
                    <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Hotel Check-in time is between 2:00 PM - 3:00 PM and Check-out is 11:00 AM - 12:00 NOON. (Early Check In / Late Check Out is on Request ONLY - NOT GUARANTEED).</span></li>
                    <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>No booking has been made; prices may change depending on availability at the time of your confirmation.</span></li>
                    <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Credit Card will be required at Hotels for deposits and incidentals.</span></li>
                    <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Upon receipt, if you believe any details in the booking are wrong you must advise us immediately (within 24 Hours) as changes made after will incur Penalties/Fees.</span></li>
                 </ul>
            </div>  

            {/* 2. INCLUSIONS & EXCLUSIONS */}
            <div style={{ display: 'flex', width: '100%', gap: '16px',  marginTop: '14px', breakInside: 'avoid' }}>
                
                {/* Inclusions (Green Box - 50% width) */}
                <div style={{ flex: 1, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '16px' }}>
                    <h4 style={{ color: '#166534', fontWeight: 'bold', fontSize: '14px', marginBottom: '18px', textTransform: 'uppercase', borderBottom: '1px solid #bbf7d0', paddingBottom: '6px' }}>Inclusions</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#1f2937', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Personalized Meet-and-Assist Services upon Arrival and Departure at the respective Airports</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Accommodation at the Mentioned Hotels</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Meals as Mentioned</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Sightseeing as Mentioned</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Entrance Fees for all Sites visited as per program mentioned</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Services of a Driver and Private Air-Conditioned Vehicles during all Tours and Transfers</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span><strong>For Individual Travelers:</strong> Services of an English-Speaking Guide during visits in each City</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span><strong>For Groups of 16 PAX or more:</strong> Services of an English-Speaking Tour Leader throughout the entire Tour, including all activities and transfers from Airport to Airport</span></li>
                    </ul>
                </div>

                {/* Exclusions (Red Box - 50% width) */}
                <div style={{ flex: 1, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '16px' }}>
                    <h4 style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '14px', marginBottom: '18px', textTransform: 'uppercase', borderBottom: '1px solid #fecaca', paddingBottom: '6px' }}>Exclusions</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#1f2937', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>International & Domestic Flights arriving into the starting City and departing from the ending City of the Tour</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>Visa Arrangement (not required for EU / US Citizenship)</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>All Service Charges / Local Taxes / Hotel Taxes, which have to be paid directly by the PAX at the Hotel during Check-in</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>Meals other than those mentioned above (Beverages during Meals)</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>Personal Expenses such as Laundry, Telephone, Drinks etc.</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>Tips for Guide / Driver / Restaurants / Porterage</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>Travel insurance - We strongly recommend the purchase of travel insurance (covering emergency medical evacuation)</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>If proposed service(s) is not available at the moment of booking/travel, we will try to find other similar service(s)</span></li>
                    </ul>
                </div>

            </div>

            {/* 3. T&C and CANCELLATION */}
            <div style={{ display: 'flex', width: '100%', gap: '32px', marginTop: '12px' ,  backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderTop: '4px solid #dc2626', borderRadius: '6px', padding: '16px', breakInside: 'avoid' }}>
                
                {/* Terms and Conditions */}
                <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>Terms & Conditions</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span><strong>30% Non Refundable Deposit</strong> at the time of booking.</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span>Final payment to be made <strong>60 days prior</strong> to Tour Start Date.</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span>If your confirmed arrangements include a Flight, <strong>Full Payment</strong> for the flights must be made in advance.</span></li>
                    </ul>
                </div>

                {/* Cancellations */}
                <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>For Cancellations</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span>Received prior to final payment will incur loss of non-refundable deposit.</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span><strong>More than 91 days prior</strong> to departure: Loss of non-refundable deposit.</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span><strong>Between 90-61 days prior</strong> to departure: 75% of the total tour price.</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span><strong>60 days or less prior</strong> to departure: 100% Non-Refundable.</span></li>
                    </ul>
                </div>

            </div>

        </div>
     
    
      {/* Footer */}
        <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', marginTop: '32px', padding: '24px', textAlign: 'center', fontSize: '12px', color: '#505050ff' }}>
            <p>Generated by Travdek. Prices and availability are subject to change.</p>
        </div>

      </div>


  {/* 👇 Wrapper forces the button to the far left corner */}
    {/* <div className="w-full max-w-[410mm] flex justify-start mt-4 mb-8">
        <button
            onClick={() => router.push('/dashboard/itinerary/costing')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all"
        >
            <ArrowLeft size={18} /> Back to Costing
        </button>
    </div> */}

    <div className="w-full max-w-[410mm] flex justify-start mt-4 mb-8 relative px-2">
        
        {/* 🌟 HIDDEN SVG FILTER FOR THE GOOEY EFFECT */}
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="hidden absolute">
            <defs>
                <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                    <feBlend in="SourceGraphic" in2="goo" />
                </filter>
            </defs>
        </svg>

        {/* 🌟 ANIMATED BACK BUTTON (Gooey Glass Effect) */}
        <button
            onClick={() => router.push('/dashboard/itinerary/costing')}
            className="group relative z-10 inline-flex items-center px-5 py-2 text-gray-600 font-bold bg-white border border-gray-300 rounded-lg overflow-hidden transition-colors duration-700 ease-in-out hover:text-white hover:border-gray-700 shadow-sm"
        >
            {/* Button Content */}
            <span className="relative z-20 flex items-center gap-2">
                <ArrowLeft size={18} /> Back to Costing
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

    </div>

      {/* 👇 NEW SHARE MODAL UI PAasted HERE */}
      {isShareModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                          <Share2 className="text-green-600" size={20} /> Share Itinerary
                      </h2>
                      <button onClick={() => setIsShareModalOpen(false)} disabled={isSharing} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
                          <X size={20} />
                      </button>
                  </div>


                  <form onSubmit={handleShareEmail} className="p-6 space-y-5">
                      <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-800 mb-2">
                          Generate a clean PDF presentation and send it directly to your client.
                      </div>

                      {/* Delivery Methods Checkboxes */}
                      <div className="flex gap-4 mb-4">
                          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
                              <input type="checkbox" checked={shareForm.sendEmail} onChange={(e) => setShareForm({...shareForm, sendEmail: e.target.checked})} className="w-4 h-4 text-green-600 rounded" />
                              Send via Email
                          </label>
                          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
                              <input type="checkbox" checked={shareForm.sendWhatsapp} onChange={(e) => setShareForm({...shareForm, sendWhatsapp: e.target.checked})} className="w-4 h-4 text-green-600 rounded" />
                              Send WhatsApp Alert
                          </label>
                      </div>
                      
                      <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Client Name</label>
                          <input 
                              type="text" required value={shareForm.clientName} onChange={(e) => setShareForm({...shareForm, clientName: e.target.value})}
                              placeholder="e.g. John Doe" 
                              className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                          />
                      </div>
                      
                      {shareForm.sendEmail && (
                          <div className="animate-in fade-in slide-in-from-top-2">
                              <label className="block text-xs font-bold text-gray-700 mb-1">Client Email <span className="text-red-500">*</span></label>
                              <div className="relative">
                                  <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                                  <input 
                                      type="email" required={shareForm.sendEmail} value={shareForm.clientEmail} onChange={(e) => setShareForm({...shareForm, clientEmail: e.target.value})}
                                      placeholder="john@example.com" 
                                      className="w-full pl-9 p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                                  />
                              </div>
                          </div>
                      )}

                      {shareForm.sendWhatsapp && (
                          <div className="animate-in fade-in slide-in-from-top-2">
                              <label className="block text-xs font-bold text-gray-700 mb-1">Client Phone <span className="text-red-500">*</span></label>
                              <input 
                                  type="tel" required={shareForm.sendWhatsapp} value={shareForm.clientPhone} onChange={(e) => setShareForm({...shareForm, clientPhone: e.target.value})}
                                  placeholder="+919876543210 (Include country code)" 
                                  className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                              />
                          </div>
                      )}

                      <button 
                          type="submit" disabled={isSharing || (!shareForm.sendEmail && !shareForm.sendWhatsapp)}
                          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 mt-2"
                      >
                          {isSharing ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : 'Send to Client'}
                      </button>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
}
