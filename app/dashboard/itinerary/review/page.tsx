// "use client";

// import React, { useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import { Download, FileText, Send, ArrowRight, Clock, AlertTriangle, Printer, GripVertical } from "lucide-react";

// // 🌟 NEW: Import Drag and Drop components
// import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// import { useItinerary } from '@/app/context/ItineraryContext';
// import { useUser } from '@/app/context/UserContext';
// import { DayPlan } from '../create-day/constants/daywiseConstants';

// // --- HELPER TO FORMAT DAY LABEL ---
// const formatDayLabel = (dayNum: number) => {
//   return `DAY ${dayNum}`;
// };

// // --- HELPER FOR INCLUSION BADGES ---
// const getBadgeStyles = (status: string | undefined) => {
//     const s = status || 'included';
//     if (s === 'excluded') return { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5', text: 'Excluded' };
//     if (s === 'optional') return { bg: '#eff6ff', color: '#1d4ed8', border: '#93c5fd', text: 'Optional' };
//     return { bg: '#f0fdf4', color: '#15803d', border: '#86efac', text: 'Included' };
// };

// export default function ReviewPage() {
//   const router = useRouter();
//   const { user } = useUser();

//   const { itineraryData, submitForCosting, completeStep, requestReEdit, updateItineraryData, saveItinerary } = useItinerary();
//   const printRef = useRef<HTMLDivElement>(null);
//   const [isDownloading, setIsDownloading] = useState(false);

//   // --- DATA PREPARATION ---
//   const routes = itineraryData.routingData?.routes || [];
//   const startCity = routes.length > 0 ? routes[0].cities[0]?.name : 'TBA';
//   const endCity = routes.length > 0 ? routes[routes.length - 1].cities[0]?.name : 'TBA';
//   const totalNights = routes.reduce((acc, curr) => acc + (curr.nights || 0), 0);
//   const totalDays = totalNights + 1;
//   const uniqueCities = Array.from(new Set(routes.flatMap(r => r.cities.map(c => c.name)))).join(' | ');

//   const rawDayPlans = (itineraryData.dayWiseActivities || []) as DayPlan[];
//   const currentStatus = itineraryData.status || 'draft';

//   // 🌟 HANDLE DRAGGING ENTIRE DAYS (With Global Sync)
//   const handleDayDragEnd = (result: DropResult) => {
//     const { source, destination } = result;
//     if (!destination || source.index === destination.index) return;

//     // 1. Copy the current days array
//     const newDayPlans = Array.from(rawDayPlans);

//     // 2. Remove the dragged day from its old position
//     const [movedDay] = newDayPlans.splice(source.index, 1);

//     // 3. Insert it into its new position
//     newDayPlans.splice(destination.index, 0, movedDay);

//     // 4. CRITICAL: Recalculate Dates and Day Numbers sequentially
//     const isMasterMode = itineraryData.isMasterItinerary;
//     let runningDate = itineraryData.routingData?.startDate ? new Date(itineraryData.routingData.startDate) : new Date();

//     const updatedDayPlans = newDayPlans.map((day, idx) => {
//         const dateString = (itineraryData.routingData?.startDate && !isMasterMode)
//             ? runningDate.toISOString().split('T')[0] : '';

//         if (itineraryData.routingData?.startDate && !isMasterMode) {
//             runningDate.setDate(runningDate.getDate() + 1);
//         }
//         return { ...day, dayNumber: idx + 1, date: dateString };
//     });

//     // 5. ✨ REBUILD ROUTING DATA (Reverse Synchronization) ✨
//     const newRoutes: any[] = [];
//     if (updatedDayPlans.length > 1) {
//         let currentCity = updatedDayPlans[0].city;
//         let currentNights = 0;

//         for (let i = 0; i < updatedDayPlans.length - 1; i++) {
//             const plan = updatedDayPlans[i];
//             if (plan.city === currentCity) {
//                 currentNights++;
//             } else {
//                 newRoutes.push({ id: Date.now() + i, cities: [{ name: currentCity, type: 'city' }], nights: currentNights });
//                 currentCity = plan.city;
//                 currentNights = 1;
//             }
//         }
//         if (currentNights > 0) {
//            newRoutes.push({ id: Date.now() + 1000, cities: [{ name: currentCity, type: 'city' }], nights: currentNights });
//         }
//     }

//     updateItineraryData({
//       dayWiseActivities: updatedDayPlans,
//       routingData: {
//           ...(itineraryData.routingData || {}),
//           routes: newRoutes
//       } as any
//     });
//     saveItinerary('quick');
//   };

//   // --- LOGIC: HANDLE CONTINUED STAYS & FLATTENING ---
//   const getRenderableItemsForDay = (dayIndex: number, currentDay: DayPlan) => {
//     const items: any[] = [];
//     if(currentDay.activities) currentDay.activities.forEach(a => items.push({ ...a, category: 'Activity' }));
//     if(currentDay.transports) currentDay.transports.forEach(t => items.push({ ...t, category: 'Transport' }));
//     if(currentDay.meals) currentDay.meals.forEach(m => items.push({ ...m, category: 'Meal' }));
//     if(currentDay.stays) currentDay.stays.forEach(s => items.push({ ...s, category: 'Stay', status: 'Check-in' }));

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

//   // --- PDF GENERATION ---
//   const handleDownloadPdf = async () => {
//     if (!printRef.current) return;
//     setIsDownloading(true);
//     const element = printRef.current;

//     try {
//         const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff', height: element.scrollHeight, windowHeight: element.scrollHeight });
//         const imgData = canvas.toDataURL('image/jpeg', 0.95);
//         const pdf = new jsPDF('p', 'mm', 'a4');
//         const imgWidth = canvas.width;
//         const imgHeight = canvas.height;
//         const PDF_WIDTH = 210;
//         const PDF_HEIGHT = 297;
//         const imgHeightInPdf = (imgHeight * PDF_WIDTH) / imgWidth;

//         let heightLeft = imgHeightInPdf;
//         let position = 0;

//         pdf.addImage(imgData, 'JPEG', 0, position, PDF_WIDTH, imgHeightInPdf);
//         heightLeft -= PDF_HEIGHT;

//         while (heightLeft > 0) {
//             position = heightLeft - imgHeightInPdf;
//             pdf.addPage();
//             pdf.addImage(imgData, 'JPEG', 0, position, PDF_WIDTH, imgHeightInPdf);
//             heightLeft -= PDF_HEIGHT;
//         }
//         pdf.save(`${itineraryData.tripName || 'Itinerary_Review'}.pdf`);
//     } catch (error) {
//         console.error("PDF Error:", error);
//         alert("Failed to generate PDF.");
//     } finally {
//         setIsDownloading(false);
//     }
//   };

//   // --- SUBMIT LOGIC ---
//   const handleSubmitCosting = () => {
//       completeStep('review');
//       submitForCosting();

//       const allLibs = JSON.parse(localStorage.getItem('itinerary_library') || '[]');
//       const idx = allLibs.findIndex((i:any) => i.id === itineraryData.id);
//       if (idx !== -1) {
//           allLibs[idx].status = 'pending_costing';
//           localStorage.setItem('itinerary_library', JSON.stringify(allLibs));
//       }

//       alert("Itinerary submitted for Costing! Admin has been notified.");
//       window.location.reload();
//   };

//   const isPending = currentStatus === 'pending_costing';
//   const isApproved = currentStatus === 'approved';
//   const isReEdit = currentStatus === 'reedit_requested';

//   return (
//     <div className="min-h-screen bg-gray-300 p-8 flex flex-col items-center gap-6 pb-32">

//       {/* TOOLBAR */}
//       <div className="w-full max-w-[410mm] flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-400">
//          <h2 className="font-bold text-gray-700 flex items-center gap-2"><FileText size={20} className="text-blue-600"/> Review Itinerary Draft</h2>
//          <div className="flex gap-3">
//              <button onClick={() => alert('Excel Download Logic')} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-200 transition-colors text-sm font-bold border border-gray-300">
//                 <Download size={16} /> Excel
//              </button>
//              <button onClick={handleDownloadPdf} disabled={isDownloading} className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded shadow-sm hover:bg-gray-900 transition-colors text-sm font-bold disabled:opacity-50">
//                 {isDownloading ? 'Generating...' : <><Printer size={16} /> PDF</>}
//              </button>
//          </div>
//       </div>

//       {/* --- REVIEW DOCUMENT --- */}
//       <div
//         ref={printRef}
//         id="pdf-content"
//         style={{
//           backgroundColor: '#ffffff',
//           color: '#1f2937',
//           fontFamily: 'Arial, sans-serif',
//           width: '100%',
//           maxWidth: '410mm',
//           minHeight: '297mm',
//           padding: 0
//         }}
//       >

//         {/* HEADER */}
//         <div style={{ borderBottom: '2px solid #001d5a' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
//                 <div style={{ flex: 1, padding: '24px' }}>

//                     <div style={{ height: '48px', marginBottom: '16px' }}>
//                         <img src="/logo.png" alt="Company Logo" style={{ height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
//                     </div>
//                     <h1 style={{ color: '#001d6a',  fontSize: '28px', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 8, lineHeight: '1.1' }}>{itineraryData.tripName || "Draft Itinerary"}</h1>
//                     <div style={{ display: 'flex', gap: '8px', marginTop: '12px', marginLeft:'4px', fontSize: '14px', fontWeight: 'bold', color: '#202020ff' }}>
//                         <span style={{ backgroundColor: '#eff6ff', color:'#001d6a' ,  padding: '4px 8px', borderRadius: '4px' }}>{totalDays} Days | {totalNights} Nights</span>
//                         <span style={{ backgroundColor: '#f3f4f6', color:'#001d6a',  padding: '4px 8px', borderRadius: '4px' }}>{itineraryData.packageType || "Custom Package"}</span>
//                     </div>

//                 </div>
//             </div>

//             {/* DETAILS GRID */}
//             <div style={{ borderTop: '1px solid #636363ff' }}>
//                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', fontSize: '13px' }}>
//                     <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #989898', borderBottom: '1px solid #989898' }}>Generated:</div>
//                     <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #989898', borderBottom: '1px solid #989898' }}>{new Date().toLocaleDateString()}</div>

//                     <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #989898', borderBottom: '1px solid #989898' }}>Travelers:</div>
//                     <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #989898' }}>{itineraryData.numberOfTravelers} Pax</div>

//                     <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #989898', borderBottom: '1px solid #989898' }}>Countries:</div>
//                     <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #989898', textTransform: 'uppercase', gridColumn: 'span 3' }}>{itineraryData.selectedCountries?.join(', ') || "TBA"}</div>

//                     <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #989898', borderBottom: '1px solid #989898' }}>Cities:</div>
//                     <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #989898', textTransform: 'uppercase', gridColumn: 'span 3' }}>{uniqueCities}</div>

//                     <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Start / End:</div>
//                     <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{startCity} / {endCity}</div>

//                     <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Route:</div>
//                     <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{itineraryData.selectedCountries?.length || 1} Country | {routes.length} Cities</div>
//                 </div>
//             </div>
//         </div>

//         {/* ITINERARY BODY */}
//         <div style={{ marginTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '48px' }}>
//             <h3 style={{ color: '#001d6a', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'underline', marginBottom: '16px', fontSize: '14px', letterSpacing: '0em' }}>Itinerary Details</h3>

//             <DragDropContext onDragEnd={handleDayDragEnd}>
//               <Droppable droppableId="itinerary-days-board" type="DAY">
//                 {(provided) => (
//                   <table
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #636363ff', fontSize: '14px' }}
//                   >
//                       <thead>
//                           <tr style={{ backgroundColor: '#e2dffd', color: 'rgb(35, 41, 52)', textTransform: 'uppercase', fontSize: '12px' }}>
//                               <th style={{ border: '1px solid #636363ff', padding: '12px', width: '96px', textAlign: 'center' }}>Day</th>
//                               <th style={{ border: '1px solid #636363ff', padding: '12px', width: '128px', textAlign: 'left' }}>City</th>
//                               <th style={{ border: '1px solid #636363ff', padding: '12px', width: '120px', textAlign: 'left' }}>Category</th>
//                               <th style={{ border: '1px solid #636363ff', padding: '12px', textAlign: 'left' }}>Description</th>
//                           </tr>
//                       </thead>

//                       {rawDayPlans.map((day, idx) => {
//                               const items = getRenderableItemsForDay(idx, day);

//                               return (
//                                 <Draggable key={day.dayNumber.toString()} draggableId={`day-${day.dayNumber}`} index={idx}>
//                                   {(provided, snapshot) => (
//                                     <tbody
//                                       ref={provided.innerRef}
//                                       {...provided.draggableProps}
//                                       style={{
//                                         ...provided.draggableProps.style,
//                                         breakInside: 'avoid',
//                                         pageBreakInside: 'avoid',
//                                         backgroundColor: snapshot.isDragging ? '#f3f4f6' : 'transparent',
//                                         boxShadow: snapshot.isDragging ? '0px 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
//                                         display: snapshot.isDragging ? 'table' : '',
//                                       }}
//                                     >

//                                         {/* Day Heading Row (Blank spacer) */}
//                                         <tr style={{ backgroundColor: '#fefce8', borderTop: '2px solid #636363ff' }}></tr>

//                                         {/* Leisure Day Check (No Items) */}
//                                         {items.length === 0 && (
//                                             <tr>
//                                                 <td style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', textAlign: 'center' }}>
//                                                     DAY {day.dayNumber}
//                                                     <div
//                                                       {...provided.dragHandleProps}
//                                                       className="cursor-grab active:cursor-grabbing hide-on-print flex justify-center mt-2"
//                                                       style={{ color: '#9ca3af' }}
//                                                       data-html2canvas-ignore="true"
//                                                     >
//                                                         <GripVertical size={20} />
//                                                     </div>
//                                                 </td>
//                                                 <td style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold' }}>{day.city}</td>
//                                                 <td colSpan={2} style={{ border: '1px solid #636363ff', padding: '12px', color: '#9ca3af', fontStyle: 'italic' }}>Leisure day. No activities scheduled.</td>
//                                             </tr>
//                                         )}

//                                         {/* Items Rendering Loop */}
//                                         {items.map((item, itemIdx) => {

//                                             const inclusionStatus = item.inclusionType || 'included';
//                                             const isExcluded = inclusionStatus === 'excluded';
//                                             const isOptional = inclusionStatus === 'optional';

//                                             const badgeBg = isExcluded ? '#fef2f2' : isOptional ? '#eff6ff' : '#f0fdf4';
//                                             const badgeColor = isExcluded ? '#dc2626' : isOptional ? '#1d4ed8' : '#15803d';
//                                             const badgeBorder = isExcluded ? '#fca5a5' : isOptional ? '#93c5fd' : '#86efac';
//                                             const badgeText = isExcluded ? 'Excluded' : isOptional ? 'Optional' : 'Included';

//                                             return (
//                                                 <tr key={`${day.dayNumber}-${itemIdx}`} className="pdf-row" >
//                                                     {/* Col 1 & 2: Day & City (Merged for first item) */}
//                                                     {itemIdx === 0 ? (
//                                                         <>
//                                                             <td rowSpan={items.length} style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#ffffff', verticalAlign: 'top' }}>
//                                                              DAY {day.dayNumber}
//                                                                 <div
//                                                                   {...provided.dragHandleProps}
//                                                                   className="cursor-grab active:cursor-grabbing hide-on-print flex justify-center mt-3"
//                                                                   title="Drag to reorder this entire day"
//                                                                   style={{ color: '#9ca3af' }}
//                                                                   data-html2canvas-ignore="true"
//                                                                 >
//                                                                     <GripVertical size={20} />
//                                                                 </div>
//                                                             </td>
//                                                             <td rowSpan={items.length} style={{ border: '1px solid #636363ff', padding: '12px', fontWeight: 'bold', backgroundColor: '#ffffff', verticalAlign: 'top', color: '#dc2626' }}>{day.city}</td>
//                                                         </>
//                                                     ) : null}

//                                                     {/* Col 3: Category & INCLUSION STATUS */}
//                                                     <td style={{ border: '1px solid #636363ff', padding: '12px', verticalAlign: 'top', color: '#292d33ff' }}>
//                                                         <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
//                                                             {item.category === 'Stay' ? (
//                                                                 <span style={{ color: item.status === 'Check-in' ? '#1f2937' : '#757575ff' }}>Stay</span>
//                                                             ) : item.category}
//                                                         </div>

//                                                         <div style={{
//                                                                 fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px', backgroundColor: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}`, width: 'fit-content', display: 'block', marginTop: '10px'
//                                                             }}>
//                                                                 {badgeText}
//                                                             </div>
//                                                     </td>

//                                                     {/* Col 4: Description */}
//                                                     <td style={{ border: '1px solid #636363ff', padding: '12px', verticalAlign: 'top' }}>

//                                                         {/* --- ACTIVITY PDF BLOCK --- */}
//                                                         {item.category === 'Activity' && (
//                                                             <div>
//                                                                 <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '16px' }}>{item.heading}</div>
//                                                                 <div style={{ color: '#292d33ff', fontSize: '12px', marginTop: '4px', marginBottom: '8px' }}>{item.description}</div>
//                                                                 <div style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6', display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', padding: '8px', borderRadius: '4px' }}>
//                                                                     <span style={{ color: '#292d33ff', display: 'flex', alignItems: 'center', gap: '4px', }}>Slot: {item.slot}</span>
//                                                                     <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Duration: {item.duration}</span>
//                                                                     {item.startTime && <span style={{ color: '#292d33ff' }}>Start: {item.startTime}</span>}
//                                                                     {(item as any).endTime && <span style={{ color: '#292d33ff' }}>End: {(item as any).endTime}</span>}
//                                                                     <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Pickup: {item.pickupLocation || "TBA"}</span>
//                                                                     {(item as any).dropoffLocation && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Drop: {(item as any).dropoffLocation}</span>}
//                                                                 </div>
//                                                             </div>
//                                                         )}

//                                                         {/* --- STAY PDF BLOCK --- */}
//                                                         {item.category === 'Stay' && (
//                                                             <div style={{ opacity: item.status === 'Residence' ? 0.8 : 1 }}>
//                                                                 <div style={{ fontWeight: 'bold', color: '#22252bff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                                     {item.hotelName}
//                                                                     <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#fff' }}>⭐ {item.rating}</span>
//                                                                 </div>
//                                                                 <div style={{ marginTop: '2px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
//                                                                     {item.status === 'Check-in' ? (
//                                                                         <>
//                                                                             <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Type: {item.stayType} (Stay)</div>
//                                                                             <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
//                                                                             <div style={{ backgroundColor: '#f9fafb', color: '#292d33ff', padding: '2px', borderRadius: '4px' }}>{item.nights} Nights Stay</div>
//                                                                         </>
//                                                                     ) : (
//                                                                         <>
//                                                                             <div style={{ gridColumn: 'span 2', fontSize: '12px', color: '#292d33ff', fontStyle: 'italic', marginTop: '2px' }}>Continuing stay at {item.hotelName}. </div>
//                                                                               <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Type: {item.stayType} (Stay)</div>
//                                                                             <div style={{ backgroundColor: '#faf5ff', color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
//                                                                         </>
//                                                                    )}
//                                                                 </div>
//                                                             </div>
//                                                         )}

//                                                         {/* --- TRANSPORT PDF BLOCK --- */}
//                                                         {item.category === 'Transport' && (
//                                                             <div>
//                                                                 {/* Title & Badge */}
//                                                                 <div style={{ fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
//                                                                     {item.vehicleType}
//                                                                     {['flight', 'rail', 'ferry'].includes(item.mode) && item.flightNumber && (
//                                                                         <span style={{ color: '#2563eb' }}> • {item.flightNumber}</span>
//                                                                     )}
//                                                                     <span style={{
//                                                                         backgroundColor: ['flight', 'rail', 'ferry'].includes(item.mode) ? '#eff6ff' : '#f0fdf4',
//                                                                         color: ['flight', 'rail', 'ferry'].includes(item.mode) ? '#1d4ed8' : '#15803d',
//                                                                         fontSize: '10px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', fontWeight: '600',
//                                                                         border: `1px solid ${['flight', 'rail', 'ferry'].includes(item.mode) ? '#bfdbfe' : '#dcfce7'}`
//                                                                     }}>
//                                                                         {['flight', 'rail', 'ferry'].includes(item.mode) ? 'Transit Ticket' : item.subType}
//                                                                     </span>
//                                                                 </div>

//                                                                 {/* Flight Layout */}
//                                                                 {item.mode === 'flight' ? (
//                                                                     <div style={{ marginTop: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', backgroundColor: '#f9fafb' }}>
//                                                                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center', gap: '16px' }}>
//                                                                             {/* Dep */}
//                                                                             <div>
//                                                                                 <div style={{ fontSize: '18px', fontWeight: '900', color: '#111827' }}>{item.pickupTime || '--:--'}</div>
//                                                                                 <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>{item.pickupLocation || 'Not Set'}</div>
//                                                                             </div>
//                                                                             {/* Middle */}
//                                                                             <div style={{ textAlign: 'center' }}>
//                                                                                 <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 'bold', marginBottom: '4px' }}>DURATION: {item.duration || '--'}</div>
//                                                                                 <div style={{ position: 'relative', width: '100%', height: '2px', backgroundColor: '#d1d5db', margin: '8px 0' }}>
//                                                                                     {item.flightStops && item.flightStops !== 'Direct' ? (
//                                                                                         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '8px', height: '8px', backgroundColor: '#2563eb', borderRadius: '50%', border: '2px solid #f9fafb' }}></div>
//                                                                                     ) : (
//                                                                                         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '14px' }}>✈️</div>
//                                                                                     )}
//                                                                                 </div>
//                                                                                 <div style={{ fontSize: '10px', fontWeight: 'bold', color: item.flightStops && item.flightStops !== 'Direct' ? '#2563eb' : '#16a34a' }}>
//                                                                                     {item.flightStops && item.flightStops !== 'Direct' ? `${item.flightStops} ${item.layoverInfo ? `• ${item.layoverInfo}` : ''}` : 'Direct Flight'}
//                                                                                 </div>
//                                                                             </div>
//                                                                             {/* Arr */}
//                                                                             <div style={{ textAlign: 'right' }}>
//                                                                                 <div style={{ fontSize: '18px', fontWeight: '900', color: '#111827' }}>
//                                                                                     {item.dropoffTime || '--:--'}
//                                                                                     {(item as any).arrivalDayOffset === '+1' && <sup style={{ fontSize: '10px', color: '#ef4444', marginLeft: '2px' }}>+1</sup>}
//                                                                                 </div>
//                                                                                 <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase' }}>{item.dropoffLocation || 'Not Set'}</div>
//                                                                             </div>
//                                                                         </div>
//                                                                         {item.serviceDescription && (
//                                                                             <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', fontSize: '11px', color: '#4b5563' }}>
//                                                                                 <strong>Cabin:</strong> {item.serviceDescription}
//                                                                             </div>
//                                                                         )}
//                                                                     </div>
//                                                                 ) : ['rail', 'ferry'].includes(item.mode) ? (
//                                                                     <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Schedule</div>
//                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937' }}>
//                                                                                 {item.pickupTime || '--:--'} <span style={{color: '#9ca3af', fontWeight: 'normal'}}>to</span> {item.dropoffTime || '--:--'}
//                                                                                 {(item as any).arrivalDayOffset === '+1' && <sup style={{ fontSize: '9px', color: '#ef4444', marginLeft: '2px' }}>+1</sup>}
//                                                                             </div>
//                                                                         </div>
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>{item.mode === 'ferry' ? 'Ports' : 'Route'}</div>
//                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937' }}>{item.pickupLocation || 'Not Set'} → {item.dropoffLocation || 'Not Set'}</div>
//                                                                         </div>
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Duration</div>
//                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#15803d', backgroundColor: '#dcfce7', display: 'inline-block', padding: '2px 6px', borderRadius: '4px' }}>{item.duration || '--'}</div>
//                                                                         </div>
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>{item.mode === 'ferry' ? 'Deck Info' : 'Travel Info'}</div>
//                                                                             <div style={{ fontSize: '12px', color: '#4b5563' }}>{item.serviceDescription || '--'}</div>
//                                                                         </div>
//                                                                     </div>
//                                                                 ) : (
//                                                                     /* Vehicle Mode */
// <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: item.subType === 'transfer' ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap: '12px', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>

//                                                                         {/* Col 1: Pickup */}
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Pickup</div>
//                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937' }}>{item.pickupLocation || 'Not Set'}</div>
//                                                                             <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#2563eb', marginTop: '2px' }}>{item.pickupTime || '--:--'}</div>
//                                                                         </div>

//                                                                         {/* Col 2: Drop-off (Only for Transfers) */}
//                                                                         {item.subType === 'transfer' && (
//                                                                             <div>
//                                                                                 <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Drop-off</div>
//                                                                                 <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937' }}>{item.dropoffLocation || 'Not Set'}</div>
//                                                                                 <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#2563eb', marginTop: '2px' }}>{item.dropoffTime || '--:--'}</div>
//                                                                             </div>
//                                                                         )}

//                                                                         {/* Col 3: Duration (Always Visible) */}
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Duration</div>
//                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#15803d', backgroundColor: '#dcfce7', display: 'inline-block', padding: '2px 6px', borderRadius: '4px' }}>{item.duration || '--'}</div>
//                                                                         </div>

//                                                                         {/* Col 4: Journey Info */}
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Journey Info</div>
//                                                                             <div style={{ fontSize: '11px', color: '#4b5563' }}>{item.serviceDescription || '--'}</div>
//                                                                         </div>

//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         )}

//                                                         {/* --- MEAL PDF BLOCK --- */}
//                                                         {item.category === 'Meal' && (
//                                                             <div>
//                                                                 <div style={{ fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                                      {item.mealType}: {item.restaurantName}
//                                                                 </div>
//                                                                 <div style={{ fontSize: '12px', color: '#292d33ff', marginTop: '4px' }}>
//                                                                     {item.cuisine}  {item.menuType}
//                                                                 </div>
//                                                             </div>
//                                                         )}

//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                   )}
//                                 </Draggable>
//                               );
//                           })}
//                       {provided.placeholder}
//                   </table>
//                 )}
//               </Droppable>
//             </DragDropContext>
//         </div>
//       </div>

//       {/* --- FOOTER ACTION BAR --- */}
//       < div className="w-full max-w-[410mm] mt-4 flex justify-end gap-4">
//             {user?.role === 'admin' && (
//                 <>
//                     {isReEdit && (
//                         <div className="flex items-center text-orange-600 font-bold mr-4">
//                             <AlertTriangle size={18} className="mr-2"/> Waiting for Agent/Employee to edit
//                         </div>
//                     )}
//                     <button
//                         onClick={() => router.push('/dashboard/itinerary/costing')}
//                         className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-700 transition-transform hover:scale-105"
//                     >
//                         Proceed to Costing <ArrowRight size={18}/>
//                     </button>

//                 </>
//             )}

//             {(user?.role === 'agent' || user?.role === 'employee') && (
//                 <>

//                     {isPending && (
//                         <div className="flex items-center gap-3 text-orange-700 bg-orange-50 px-6 py-3 rounded-lg border border-orange-200 font-bold shadow-sm">
//                             <Clock size={20} className="animate-pulse"/>
//                             <div>
//                                 <span className="block text-sm">Pricing Request Sent</span>
//                                 <span className="block text-[10px] opacity-80 uppercase">Waiting for Admin</span>
//                             </div>
//                         </div>
//                     )}
//                     {isReEdit && (
//                         <button
//                             onClick={handleSubmitCosting}
//                             className="flex items-center gap-2 bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all hover:scale-105"
//                         >
//                             Resubmit for Costing <Send size={18}/>
//                         </button>
//                     )}
//                     {isApproved && (
//                         <button
//                             onClick={() => router.push('/dashboard/itinerary/costing')}
//                             className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-700 transition-all hover:scale-105"
//                         >
//                             View Costing <ArrowRight size={18}/>
//                         </button>
//                     )}
//                     {!isPending && !isApproved && !isReEdit && (
//                         <button
//                             onClick={handleSubmitCosting}
//                             className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-105"
//                         >
//                             Submit for Costing <Send size={18}/>
//                         </button>
//                     )}
//                 </>
//             )}
//       </div>

//     </div>
//   );
// }

"use client";
import React, { useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import { Download, FileText, Send, ArrowRight, Clock, AlertTriangle, Printer, GripVertical, User, ArrowLeft, Mail, Phone, Globe, MapPin } from "lucide-react";

import {
  Download,
  FileText,
  Send,
  ArrowRight,
  Clock,
  AlertTriangle,
  Printer,
  GripVertical,
  User,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Camera,
  BedDouble,
  Utensils,
  Plane,
  Train,
  Ship,
  Car,
  Bus,
} from "lucide-react";
// 🌟 Import Drag and Drop components
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { useItinerary } from "@/app/context/ItineraryContext";
import { useUser } from "@/app/context/UserContext";
import { DayPlan } from "../create-day/constants/daywiseConstants";
import { useCurrency } from "@/hooks/useCurrency";

// --- HELPER TO FORMAT DAY LABEL ---
const formatDayLabel = (dayNum: number) => {
  return `DAY ${dayNum}`;
};

// --- HELPER FOR INCLUSION BADGES ---
const getBadgeStyles = (status: string | undefined) => {
  const s = status || "included";
  if (s === "excluded")
    return {
      bg: "#fef2f2",
      color: "#dc2626",
      border: "#fca5a5",
      text: "Excluded",
    };
  if (s === "optional")
    return {
      bg: "#eff6ff",
      color: "#1d4ed8",
      border: "#93c5fd",
      text: "Optional",
    };
  return {
    bg: "#f0fdf4",
    color: "#15803d",
    border: "#86efac",
    text: "Included",
  };
};

export default function ReviewPage() {
  const router = useRouter();
  const { user } = useUser();

  const {
    itineraryData,
    submitForCosting,
    completeStep,
    requestReEdit,
    updateItineraryData,
    saveItinerary,
  } = useItinerary();

  // ─────────────────────────────────────────────────────────────────────────────
  // REFS FOR PDF GENERATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const printRef = useRef<HTMLDivElement>(null);
  const headerSectionRef = useRef<HTMLDivElement>(null);
  const itineraryLabelRef = useRef<HTMLHeadingElement>(null);
  const tableHeadRef = useRef<HTMLTableSectionElement>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const dayRefsMap = useRef<Map<number, HTMLElement>>(new Map());
  const footerRef = useRef<HTMLDivElement>(null);

  const [isDownloading, setIsDownloading] = useState(false);

  // --- DATA PREPARATION ---
  const routes = itineraryData.routingData?.routes || [];
  const startCity = routes.length > 0 ? routes[0].cities[0]?.name : "TBA";
  const endCity =
    routes.length > 0 ? routes[routes.length - 1].cities[0]?.name : "TBA";
  const totalNights = routes.reduce((acc, curr) => acc + (curr.nights || 0), 0);
  const totalDays = totalNights + 1;

  // 🌟 NEW: Dynamic Cities with Nights (e.g., "Athens (2N) | Mykonos (2N)")
  const citiesWithNights = routes
    .filter((r: any) => r.cities && r.cities.length > 0 && r.cities[0].name)
    .map((r: any) => {
      const cityNames = r.cities.map((c: any) => c.name).join(" / ");
      const n = parseInt(r.nights) || 0;
      return n > 0 ? `${cityNames} (${n}N)` : cityNames;
    })
    .join(" | ");

  // This forces the Review Page to perfectly match the length of the Routing Page.
  const rawDayPlans = (
    (itineraryData.dayWiseActivities || []) as DayPlan[]
  ).slice(0, totalDays);
  const currentStatus = itineraryData.status || "draft";

  // ─────────────────────────────────────────────────────────────────────────────
  // 🌟 NEW: LIGHTWEIGHT PRICING MATH FOR APPROVED EMPLOYEES
  // ─────────────────────────────────────────────────────────────────────────────
  const { currency, formatPrice } = useCurrency(
    itineraryData.selectedCurrency || "USD",
  );
  const travelerCount = parseInt(String(itineraryData.numberOfTravelers)) || 1;
  const isAgent = user?.role === "agent";

  const pricingMatrix = itineraryData.pricingMatrix || {};
  const markupPercent = itineraryData.markupPercentage || 0;
  const agentMargin = (itineraryData as any).agentMargin || 0;
  const roundingMode = itineraryData.roundingMode || "none";
  const fixedDepartures = itineraryData.fixedDepartures || [];
  const selectedDepartureId = itineraryData.selectedDepartureId || null;
  const includedOptionals: string[] = itineraryData.includedOptionals || [];
  const simulationDate = (itineraryData as any).simulationDate;

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
  const selectedMonth = useMemo(() => {
    if (simulationDate) {
      const d = new Date(simulationDate);
      if (!isNaN(d.getTime())) return MONTHS[d.getMonth()];
    }
    return "JAN";
  }, [simulationDate]);

  // Calculate Totals
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
        if (includedOptionals.includes(itemIdStr)) {
          totalNet += cost;
        } else {
          optionalNet += cost;
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
  }, [rawDayPlans, pricingMatrix, selectedMonth, includedOptionals]);

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

  let wholesaleGrandTotal = 0;
  if (activeFixedDeparture) {
    wholesaleGrandTotal = activePriceDBL * travelerCount;
  } else {
    const adminMarkupAmount = totals.totalNet * (markupPercent / 100);
    wholesaleGrandTotal = totals.totalNet + adminMarkupAmount;
  }

  let finalPerPerson = 0;
  let finalGrandTotal = 0;

  if (isAgent) {
    const agencyMarkupAmount = wholesaleGrandTotal * (agentMargin / 100);
    const exactPerPerson =
      travelerCount > 0
        ? (wholesaleGrandTotal + agencyMarkupAmount) / travelerCount
        : 0;
    finalPerPerson = exactPerPerson;
  } else {
    finalPerPerson =
      travelerCount > 0 ? wholesaleGrandTotal / travelerCount : 0;
  }

  // Apply Rounding
  if (roundingMode === "5") finalPerPerson = Math.ceil(finalPerPerson / 5) * 5;
  else if (roundingMode === "10")
    finalPerPerson = Math.ceil(finalPerPerson / 10) * 10;
  else if (roundingMode === "100")
    finalPerPerson = Math.ceil(finalPerPerson / 100) * 100;
  finalGrandTotal = finalPerPerson * travelerCount;

  // Optional Math
  const adminOptionalMarkup = totals.optionalNet * (markupPercent / 100);
  const wholesaleOptionalTotal = totals.optionalNet + adminOptionalMarkup;
  let finalOptionalGrandTotal = isAgent
    ? wholesaleOptionalTotal + wholesaleOptionalTotal * (agentMargin / 100)
    : wholesaleOptionalTotal;

  let finalOptionalPerPerson =
    travelerCount > 0 ? finalOptionalGrandTotal / travelerCount : 0;
  if (roundingMode === "5")
    finalOptionalPerPerson = Math.ceil(finalOptionalPerPerson / 5) * 5;
  else if (roundingMode === "10")
    finalOptionalPerPerson = Math.ceil(finalOptionalPerPerson / 10) * 10;
  else if (roundingMode === "100")
    finalOptionalPerPerson = Math.ceil(finalOptionalPerPerson / 100) * 100;
  finalOptionalGrandTotal = finalOptionalPerPerson * travelerCount;
  // ─────────────────────────────────────────────────────────────────────────────

  // 🌟 HANDLE DRAGGING ENTIRE DAYS (With Global Sync)
  const handleDayDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const newDayPlans = Array.from(rawDayPlans);
    const [movedDay] = newDayPlans.splice(source.index, 1);
    newDayPlans.splice(destination.index, 0, movedDay);

    const isMasterMode = itineraryData.isMasterItinerary;
    let runningDate = itineraryData.routingData?.startDate
      ? new Date(itineraryData.routingData.startDate)
      : new Date();

    const updatedDayPlans = newDayPlans.map((day, idx) => {
      const dateString =
        itineraryData.routingData?.startDate && !isMasterMode
          ? runningDate.toISOString().split("T")[0]
          : "";
      if (itineraryData.routingData?.startDate && !isMasterMode) {
        runningDate.setDate(runningDate.getDate() + 1);
      }
      return { ...day, dayNumber: idx + 1, date: dateString };
    });

    const newRoutes: any[] = [];
    if (updatedDayPlans.length > 1) {
      let currentCity = updatedDayPlans[0].city;
      let currentNights = 0;

      for (let i = 0; i < updatedDayPlans.length - 1; i++) {
        const plan = updatedDayPlans[i];
        if (plan.city === currentCity) {
          currentNights++;
        } else {
          newRoutes.push({
            id: Date.now() + i,
            cities: [{ name: currentCity, type: "city" }],
            nights: currentNights,
          });
          currentCity = plan.city;
          currentNights = 1;
        }
      }
      if (currentNights > 0) {
        newRoutes.push({
          id: Date.now() + 1000,
          cities: [{ name: currentCity, type: "city" }],
          nights: currentNights,
        });
      }
    }

    updateItineraryData({
      dayWiseActivities: updatedDayPlans,
      routingData: {
        ...(itineraryData.routingData || {}),
        routes: newRoutes,
      } as any,
    });
    saveItinerary("quick");
  };

  // --- LOGIC: HANDLE CONTINUED STAYS & FLATTENING ---
  const getRenderableItemsForDay = (dayIndex: number, currentDay: DayPlan) => {
    const items: any[] = [];
    if (currentDay.activities)
      currentDay.activities.forEach((a) =>
        items.push({ ...a, category: "Activity" }),
      );
    if (currentDay.transports)
      currentDay.transports.forEach((t) =>
        items.push({ ...t, category: "Transport" }),
      );
    if (currentDay.meals)
      currentDay.meals.forEach((m) => items.push({ ...m, category: "Meal" }));
    if (currentDay.stays)
      currentDay.stays.forEach((s) =>
        items.push({ ...s, category: "Stay", status: "Check-in" }),
      );

    for (let i = 0; i < dayIndex; i++) {
      const pastDay = rawDayPlans.find((d) => d.dayNumber === i + 1);
      if (pastDay && pastDay.stays) {
        pastDay.stays.forEach((stay) => {
          const stayEndIndex = i + (stay.nights || 0);
          if (dayIndex > i && dayIndex < stayEndIndex) {
            items.push({ ...stay, category: "Stay", status: "Residence" });
          }
        });
      }
    }

    return items.sort((a, b) => {
      const order = { Activity: 1, Stay: 2, Transport: 3, Meal: 4 };
      return (
        (order[a.category as keyof typeof order] || 5) -
        (order[b.category as keyof typeof order] || 5)
      );
    });
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);

    // 👇 INJECT FIX: Force SVG icons to align correctly during html2canvas capture
    const fixStyle = document.createElement("style");
    fixStyle.id = "html2canvas-svg-fix";
    fixStyle.innerHTML = `
      svg {
        display: inline-block !important;
        vertical-align: middle !important;
        position: relative !important;
        top: 0px !important;
        overflow: visible !important;
      }
      [class*="lucide"] {
        display: inline-block !important;
        vertical-align: middle !important;
        position: relative !important;
        top: 0px !important;
      }
    `;
    document.head.appendChild(fixStyle);

    try {
      const PDF_W_MM = 210;
      const PDF_H_MM = 297;
      const MARGIN_MM = 10;
      const CONTENT_W_MM = PDF_W_MM - MARGIN_MM * 2;

      const pdf = new jsPDF("p", "mm", "a4");
      let currentY = MARGIN_MM;

      const H2C_OPTS = {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        ignoreElements: (el: Element) =>
          el.hasAttribute("data-html2canvas-ignore"),
        // 👇 ADD THIS: give browser time to apply the injected styles
        onclone: (clonedDoc: Document) => {
          const clonedStyle = clonedDoc.createElement("style");
          clonedStyle.innerHTML = `
            svg {
              display: inline-block !important;
              vertical-align: middle !important;
              position: relative !important;
              top: 0px !important;
              overflow: visible !important;
            }
            [class*="lucide"] {
              display: inline-block !important;
              vertical-align: middle !important;
              position: relative !important;
              top: 0px !important;
            }
            /* Fix flex containers that hold icons */
            td > div {
              align-items: center !important;
            }
          `;
          clonedDoc.head.appendChild(clonedStyle);
        },
      };

      const toMm = (canvas: HTMLCanvasElement): number =>
        (canvas.height * CONTENT_W_MM) / canvas.width;

      const placeCanvas = (canvas: HTMLCanvasElement, y: number): number => {
        const h = toMm(canvas);
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.95),
          "JPEG",
          MARGIN_MM,
          y,
          CONTENT_W_MM,
          h,
        );
        return h;
      };

      const ensureFits = (neededMm: number): void => {
        if (currentY + neededMm > PDF_H_MM - MARGIN_MM) {
          pdf.addPage();
          currentY = MARGIN_MM;
        }
      };

      // 1. Capture Header
      if (headerSectionRef.current) {
        const headerCanvas = await html2canvas(
          headerSectionRef.current,
          H2C_OPTS,
        );
        ensureFits(toMm(headerCanvas));
        currentY += placeCanvas(headerCanvas, currentY) + 8;
      }

      // 2. Native Text for "ITINERARY DETAILS"
      ensureFits(15);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 29, 106);

      const headingText = "ITINERARY DETAILS";
      pdf.text(headingText, MARGIN_MM, currentY + 5);

      const textWidth = pdf.getTextWidth(headingText);

      pdf.setDrawColor(0, 29, 106);
      pdf.setLineWidth(0.5);
      pdf.line(MARGIN_MM, currentY + 6, MARGIN_MM + textWidth, currentY + 6);

      currentY += 12;

      // 3. THE MAGIC TRICK: OFF-SCREEN CLONING FOR TABLE!
      if (tableRef.current) {
        const originalTable = tableRef.current;
        const tableWidth = originalTable.offsetWidth;

        const hiddenWrapper = document.createElement("div");
        hiddenWrapper.style.position = "absolute";
        hiddenWrapper.style.left = "-9999px";
        hiddenWrapper.style.top = "0px";
        hiddenWrapper.style.width = `${tableWidth}px`;
        hiddenWrapper.style.backgroundColor = "#ffffff";

        const clonedTable = originalTable.cloneNode(true) as HTMLTableElement;
        hiddenWrapper.appendChild(clonedTable);
        document.body.appendChild(hiddenWrapper);

        // 👇 Force all SVGs inside the cloned table to align correctly
        const svgsInClone = clonedTable.querySelectorAll("svg");
        svgsInClone.forEach((svg) => {
          (svg as unknown as HTMLElement).style.display = "inline-block";
          (svg as unknown as HTMLElement).style.verticalAlign = "middle";
          (svg as unknown as HTMLElement).style.position = "relative";
          (svg as unknown as HTMLElement).style.top = "0px";
          (svg as unknown as HTMLElement).style.overflow = "visible";
        });

        // 👇 Force all icon wrapper divs to align correctly
        const iconWrappers = clonedTable.querySelectorAll("td > div");
        iconWrappers.forEach((div) => {
          (div as HTMLElement).style.alignItems = "center";
          (div as HTMLElement).style.display = "flex";
        });

        const clonedTbodies = Array.from(clonedTable.querySelectorAll("tbody"));
        const clonedThead = clonedTable.querySelector("thead");

        clonedTbodies.forEach((el) => (el.style.display = "none"));
        if (clonedThead) clonedThead.style.display = "";

        for (let i = 0; i < clonedTbodies.length; i++) {
          const currentTbody = clonedTbodies[i];

          currentTbody.style.display = "";
          currentTbody.style.boxShadow = "none";

          // 👇 Re-apply SVG fix inside each tbody before capture
          const tbodySvgs = currentTbody.querySelectorAll("svg");
          tbodySvgs.forEach((svg) => {
            (svg as unknown as HTMLElement).style.display = "inline-block";
            (svg as unknown as HTMLElement).style.verticalAlign = "middle";
            (svg as unknown as HTMLElement).style.position = "relative";
            (svg as unknown as HTMLElement).style.top = "0px";
          });

          const dayCanvas = await html2canvas(clonedTable, H2C_OPTS);
          const dayH = toMm(dayCanvas);

          ensureFits(dayH);
          currentY += placeCanvas(dayCanvas, currentY);

          currentTbody.style.display = "none";
          if (clonedThead) clonedThead.style.display = "none";
        }

        document.body.removeChild(hiddenWrapper);
        currentY += 8;
      }

      // 4. CAPTURE THE FOOTER
      if (footerRef.current) {
        const footerCanvas = await html2canvas(footerRef.current, H2C_OPTS);
        const footerH = toMm(footerCanvas);
        ensureFits(footerH);
        placeCanvas(footerCanvas, currentY);
      }

      // 5. Save the PDF
      pdf.save(`${itineraryData.tripName || "Itinerary_Review"}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      // 👇 ALWAYS remove the injected style after capture, success or failure
      const injected = document.getElementById("html2canvas-svg-fix");
      if (injected) injected.remove();

      setIsDownloading(false);
    }
  };

  // --- SUBMIT LOGIC ---
  const handleSubmitCosting = async () => {
    completeStep("review");

    // 👇 FIX 1: Update the global context state properly
    updateItineraryData({ status: "pending_costing" });

    // 👇 FIX 2: Use your actual DB save function instead of localStorage!
    await saveItinerary("quick");

    alert("Itinerary submitted for Costing! Admin has been notified.");
    //   router.push('/dashboard/itinerary/library'); // Better UX than a hard reload
  };

  const isPending = currentStatus === "pending_costing";
  const isApproved = currentStatus === "approved";
  const isReEdit = currentStatus === "reedit_requested";

  return (
    <div className="min-h-screen bg-gray-300 p-8 flex flex-col items-center gap-6 pb-32">
      {/* TOOLBAR */}
      <div className="w-full max-w-[410mm] flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-400">
        <h2 className="font-bold text-gray-700 flex items-center gap-2">
          <FileText size={20} className="text-blue-600" /> Review Itinerary
          Draft
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => alert("Excel Download Logic")}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-200 transition-colors text-sm font-bold border border-gray-300"
          >
            <Download size={16} /> Excel
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded shadow-sm hover:bg-gray-900 transition-colors text-sm font-bold disabled:opacity-50"
          >
            {isDownloading ? (
              "Generating..."
            ) : (
              <>
                <Printer size={16} /> PDF
              </>
            )}
          </button>
        </div>
      </div>
      {/* --- REVIEW DOCUMENT --- */}
      <div
        ref={printRef}
        id="pdf-content"
        style={{
          backgroundColor: "#ffffff",
          color: "#1f2937",
          fontFamily: "Arial, sans-serif",
          width: "100%",
          maxWidth: "410mm",
          minHeight: "297mm",
          padding: 0,
        }}
      >
        {/* HEADER */}
        <div
          ref={headerSectionRef}
          style={{
            borderBottom: "2px solid #e5e7eb",
            padding: "32px 24px",
            backgroundColor: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "5px",
            }}
          >
            {/* 🌟 LEFT SIDE: Tour Name & Duration */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                paddingTop: "16px",
                textTransform: "uppercase",
              }}
            >
              <h1
                style={{
                  color: "#001d6a",
                  fontSize: "32px",
                  fontWeight: "bold",
                  margin: "0 0 4px 0",
                  lineHeight: "1.2",
                }}
              >
                {itineraryData.tripName || "Draft Itinerary"}
              </h1>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#001d6a",
                }}
              >
                {totalDays} Days | {totalNights} Nights
              </div>
            </div>

            {/* 🌟 RIGHT SIDE: Logo & Company Details */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                flexShrink: 0,
              }}
            >
              <div style={{ height: "50px", marginBottom: "14px" }}>
                <img
                  src="/logo.png"
                  alt="Company Logo"
                  // 👇 FIX: Added objectPosition: 'left center' to force it flush to the green line!
                  style={{
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "left center",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  minWidth: "240px",
                }}
              >
                {/* Email */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    lineHeight: "18px",
                  }}
                >
                  <i
                    className="fa-solid fa-envelope"
                    style={{
                      color: "#712400",
                      width: "16px",
                      textAlign: "center",
                      fontSize: "13px",
                    }}
                  ></i>
                  <span
                    style={{
                      width: "42px",
                      color: "#121214",
                      fontWeight: "bold",
                    }}
                  >
                    Email:
                  </span>
                  <span style={{ color: "#001d6a", fontWeight: "bold" }}>
                    Sandeep@TravDek.com
                  </span>
                </div>

                {/* Phone */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    lineHeight: "18px",
                  }}
                >
                  <i
                    className="fa-solid fa-phone"
                    style={{
                      color: "#000000",
                      width: "16px",
                      textAlign: "center",
                      fontSize: "13px",
                    }}
                  ></i>
                  <span
                    style={{
                      width: "42px",
                      color: "#121214",
                      fontWeight: "bold",
                    }}
                  >
                    Tel:
                  </span>
                  <span style={{ color: "#001d6a", fontWeight: "bold" }}>
                    +1 650 759 4331
                  </span>
                </div>

                {/* Website */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    lineHeight: "18px",
                  }}
                >
                  <i
                    className="fa-solid fa-globe"
                    style={{
                      color: "#0038a8",
                      width: "16px",
                      textAlign: "center",
                      fontSize: "13px",
                    }}
                  ></i>
                  <span
                    style={{
                      width: "42px",
                      color: "#121214",
                      fontWeight: "bold",
                    }}
                  >
                    Web:
                  </span>
                  <a
                    href="http://www.TravDek.com"
                    style={{
                      color: "#001d6a",
                      fontWeight: "bold",
                      textDecoration: "none",
                    }}
                  >
                    www.TravDek.com
                  </a>
                </div>

                {/* Address */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "6px",
                  }}
                >
                  <i
                    className="fa-solid fa-location-dot"
                    style={{
                      color: "#df0000",
                      width: "16px",
                      textAlign: "center",
                      fontSize: "13px",
                      marginTop: "2px",
                    }}
                  ></i>
                  <span
                    style={{
                      width: "42px",
                      color: "#121214",
                      fontWeight: "bold",
                    }}
                  >
                    Add:
                  </span>
                  <span
                    style={{
                      color: "#001d6a",
                      fontWeight: "bold",
                      lineHeight: "1.5",
                    }}
                  >
                    750 Alma lane #4459 Foster City, CA 94404 USA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div
            style={{
              borderTop: "1px solid #989898",
              borderBottom: "1px solid #989898",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                fontSize: "13px",
              }}
            >
              {/* ROW 1: Trip ID & Travelers */}
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "8px",
                  fontWeight: "bold",
                  borderRight: "1px solid #989898",
                  borderBottom: "1px solid #989898",
                }}
              >
                Ref / Trip ID:
              </div>
              <div
                style={{
                  color: "#1d4ed8",
                  padding: "8px",
                  fontWeight: "bold",
                  borderRight: "1px solid #989898",
                  borderBottom: "1px solid #989898",
                }}
              >
                {itineraryData.tripId || "Pending..."}
              </div>

              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "8px",
                  fontWeight: "bold",
                  borderRight: "1px solid #989898",
                  borderBottom: "1px solid #989898",
                }}
              >
                Travelers:
              </div>
              <div
                style={{
                  color: "#1d4ed8",
                  padding: "8px",
                  fontWeight: "bold",
                  borderBottom: "1px solid #989898",
                }}
              >
                {itineraryData.numberOfTravelers} Pax
              </div>

              {/* ROW 2: Release Date & Type */}
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "8px",
                  fontWeight: "bold",
                  borderRight: "1px solid #989898",
                  borderBottom: "1px solid #989898",
                }}
              >
                Release Date:
              </div>
              <div
                style={{
                  color: "#1d4ed8",
                  padding: "8px",
                  fontWeight: "bold",
                  borderRight: "1px solid #989898",
                  borderBottom: "1px solid #989898",
                }}
              >
                {new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>

              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "8px",
                  fontWeight: "bold",
                  borderRight: "1px solid #989898",
                  borderBottom: "1px solid #989898",
                }}
              >
                Type:
              </div>
              <div
                style={{
                  color: "#1d4ed8",
                  padding: "8px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  borderBottom: "1px solid #989898",
                }}
              >
                {itineraryData.tripStyle || "TBA"}
              </div>

              {/* ROW 3: Countries */}
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "8px",
                  fontWeight: "bold",
                  borderRight: "1px solid #989898",
                  borderBottom: "1px solid #989898",
                }}
              >
                Countries:
              </div>
              <div
                style={{
                  color: "#1d4ed8",
                  padding: "8px",
                  fontWeight: "bold",
                  borderBottom: "1px solid #989898",
                  textTransform: "uppercase",
                  gridColumn: "span 3",
                }}
              >
                {itineraryData.selectedCountries?.join(", ") || "TBA"}
              </div>

              {/* ROW 4: Cities */}
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "8px",
                  fontWeight: "bold",
                  borderRight: "1px solid #989898",
                  borderBottom: "1px solid #989898",
                }}
              >
                Cities:
              </div>
              <div
                style={{
                  color: "#1d4ed8",
                  padding: "8px",
                  fontWeight: "bold",
                  borderBottom: "1px solid #989898",
                  textTransform: "uppercase",
                  gridColumn: "span 3",
                }}
              >
                {citiesWithNights}
              </div>

              {/* ROW 5: Start/End & Route */}
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "8px",
                  fontWeight: "bold",
                  borderRight: "1px solid #989898",
                  borderBottom: "1px solid #989898",
                }}
              >
                Start / End:
              </div>
              <div
                style={{
                  color: "#1d4ed8",
                  padding: "8px",
                  fontWeight: "bold",
                  borderRight: "1px solid #989898",
                  borderBottom: "1px solid #989898",
                }}
              >
                {startCity} / {endCity}
              </div>

              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "8px",
                  fontWeight: "bold",
                  borderRight: "1px solid #989898",
                  borderBottom: "1px solid #989898",
                }}
              >
                Route:
              </div>
              <div
                style={{
                  color: "#1d4ed8",
                  padding: "8px",
                  fontWeight: "bold",
                  borderBottom: "1px solid #989898",
                }}
              >
                {itineraryData.selectedCountries?.length || 1} Country |{" "}
                {routes.length} Cities
              </div>

              {/* ROW 6: Package (Spans 3 cols to balance the grid!) */}
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "8px",
                  fontWeight: "bold",
                  borderRight: "1px solid #989898",
                }}
              >
                Package:
              </div>
              <div
                style={{
                  color: "#1d4ed8",
                  padding: "8px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  gridColumn: "span 3",
                }}
              >
                {itineraryData.packageType || "LAND"}
              </div>
            </div>
          </div>
        </div>

        {/* ITINERARY BODY */}

        <div
          style={{
            marginTop: "32px",
            paddingLeft: "26px",
            paddingRight: "26px",
            paddingBottom: "48px",
          }}
        >
          <h3
            ref={itineraryLabelRef}
            style={{
              color: "#001d6a",
              fontWeight: "bold",
              textTransform: "uppercase",
              textDecoration: "underline",
              marginBottom: "10px",
              fontSize: "16px",
              letterSpacing: "0em",
            }}
          >
            Itinerary Details
          </h3>

          <DragDropContext onDragEnd={handleDayDragEnd}>
            <Droppable droppableId="itinerary-days-board" type="DAY">
              {(provided) => (
                <table
                  ref={(el) => {
                    provided.innerRef(el);

                    tableRef.current = el as HTMLTableElement;
                  }}
                  {...provided.droppableProps}
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid #6b6b6b",
                    fontSize: "14px",
                    tableLayout: "fixed",
                  }}
                >
                  {/* NEW: 3 Columns -> Category(Left), Details(Middle), Inclusion(Right) */}

                  <colgroup>
                    <col style={{ width: "200px" }} />

                    <col style={{ width: "auto" }} />

                    <col style={{ width: "140px" }} />
                  </colgroup>

                  {rawDayPlans.map((day, idx) => {
                    const items = getRenderableItemsForDay(idx, day);

                    // 🌟 DYNAMIC ROUTING LOGIC (e.g., DELHI - AGRA)

                    const prevCity = idx > 0 ? rawDayPlans[idx - 1].city : null;

                    const isCityChange = prevCity && prevCity !== day.city;

                    const displayCityName = isCityChange
                      ? `${prevCity} - ${day.city}`
                      : day.city;

                    // Calculate Nights for the new city

                    let nightCount = 0;

                    if (!prevCity || isCityChange) {
                      const currentRoute = routes.find((r: any) =>
                        r.cities.some((c: any) => c.name === day.city),
                      );

                      if (currentRoute) nightCount = currentRoute.nights;
                    }

                    const displayNights =
                      nightCount > 0 ? ` (${nightCount}N)` : "";

                    const finalDayHeader =
                      `${displayCityName}${displayNights}`.toUpperCase();

                    return (
                      <Draggable
                        key={day.dayNumber.toString()}
                        draggableId={`day-${day.dayNumber}`}
                        index={idx}
                      >
                        {(provided, snapshot) => (
                          <tbody
                            ref={(el) => {
                              provided.innerRef(el as HTMLElement);

                              if (el) dayRefsMap.current.set(day.dayNumber, el);
                            }}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,

                              breakInside: "avoid",

                              pageBreakInside: "avoid",

                              backgroundColor: snapshot.isDragging
                                ? "#f3f4f6"
                                : "transparent",

                              boxShadow: snapshot.isDragging
                                ? "0px 10px 15px -3px rgba(0,0,0,0.1)"
                                : "none",

                              display: snapshot.isDragging ? "table" : "",

                              outline: "1px solid #6b6b6b",
                            }}
                          >
                            {/* 🌟 THE FULL-WIDTH DAY HEADER ROW */}

                            <tr
                              style={{
                                backgroundColor: "#fefce8",
                                borderTop:
                                  idx > 0 ? "1px solid #6b6b6b" : "none",
                              }}
                            >
                              <td
                                colSpan={3}
                                style={{
                                  padding: "12px 16px",

                                  border: "1px solid #6b6b6b",

                                  borderTop:
                                    idx > 0
                                      ? "2px solid #6b6b6b"
                                      : "1px solid #6b6b6b",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "24px",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "#991b1b",
                                      fontWeight: "bold",
                                      fontSize: "16px",
                                    }}
                                  >
                                    DAY {String(day.dayNumber).padStart(2, "0")}
                                  </span>

                                  <span
                                    style={{
                                      color: "#991b1b",
                                      fontWeight: "bold",
                                      fontSize: "16px",
                                    }}
                                  >
                                    {finalDayHeader}
                                  </span>

                                  {/* Drag Handle */}

                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab active:cursor-grabbing hide-on-print ml-auto"
                                    style={{ color: "#9ca3af" }}
                                    data-html2canvas-ignore="true"
                                  >
                                    <GripVertical size={18} />
                                  </div>
                                </div>
                              </td>
                            </tr>

                            {/* Leisure Day Check */}

                            {items.length === 0 && (
                              <tr>
                                <td
                                  colSpan={3}
                                  style={{
                                    border: "1px solid #6b6b6b",
                                    padding: "16px",
                                    color: "#9ca3af",
                                    fontStyle: "italic",
                                    textAlign: "center",
                                  }}
                                >
                                  Leisure day. No activities scheduled.
                                </td>
                              </tr>
                            )}

                            {/* Items Rendering Loop */}

                            {items.map((item, itemIdx) => {
                              // INCLUSION LOGIC

                              const inclusionStatus =
                                item.inclusionType || "included";

                              const isExcluded = inclusionStatus === "excluded";

                              const isOptional = inclusionStatus === "optional";

                              const badgeBg = isExcluded
                                ? "#ffffff"
                                : isOptional
                                  ? "#ffffff"
                                  : "#ffffff";

                              const badgeColor = isExcluded
                                ? "#1f2937"
                                : isOptional
                                  ? "#1f2937"
                                  : "#1f2937";

                              const badgeText = isExcluded
                                ? "Excluded"
                                : isOptional
                                  ? "Optional"
                                  : "Included";

                              // 🌟 SMART ICON LOGIC

                              let IconComponent = Camera;

                              let iconColor = "#0284c7"; // Default blue

                              if (item.category === "Stay") {
                                IconComponent = BedDouble;
                                iconColor = "#059669";
                              } // Green
                              else if (item.category === "Meal") {
                                IconComponent = Utensils;
                                iconColor = "#d97706";
                              } // Orange
                              else if (item.category === "Transport") {
                                iconColor = "#6366f1"; // Indigo

                                if (item.mode === "flight")
                                  IconComponent = Plane;
                                else if (item.mode === "rail")
                                  IconComponent = Train;
                                else if (item.mode === "ferry")
                                  IconComponent = Ship;
                                else if (item.mode === "bus")
                                  IconComponent = Bus;
                                else IconComponent = Car;
                              }

                              return (
                                <tr
                                  key={`${day.dayNumber}-${itemIdx}`}
                                  className="pdf-row"
                                >
                                  {/* 🌟 COL 1: CATEGORY WITH ICON */}

                                  <td
                                    style={{
                                      border: "1px solid #6b6b6b",
                                      padding: "16px 24px",
                                      verticalAlign: "middle",
                                      width: "200px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",

                                        alignItems: "center",

                                        justifyContent: "flex-start",

                                        gap: "12px",

                                        fontWeight: "bold",

                                        color: "#374151",

                                        fontSize: "14px",

                                        textTransform: "uppercase",

                                        letterSpacing: "0.05em",

                                        lineHeight: "20px",
                                      }}
                                    >
                                      <IconComponent
                                        size={20}
                                        style={{
                                          color: iconColor,

                                          flexShrink: 0,

                                          display: "inline-block",

                                          verticalAlign: "middle",

                                          position: "relative",

                                          top: "-1px",
                                        }}
                                      />

                                      <span
                                        style={{
                                          lineHeight: "20px",
                                          display: "inline-block",
                                          verticalAlign: "middle",
                                        }}
                                      >
                                        {item.category === "Stay"
                                          ? "Hotel"
                                          : item.category}
                                      </span>
                                    </div>
                                  </td>

                                  {/* 🌟 COL 2: DESCRIPTION (Middle Content) */}

                                  <td
                                    style={{
                                      border: "1px solid #6b6b6b",
                                      padding: "16px",
                                      verticalAlign: "top",
                                    }}
                                  >
                                    {/* --- ACTIVITY PDF BLOCK --- */}

                                    {item.category === "Activity" && (
                                      <div>
                                        <div
                                          style={{
                                            fontWeight: "bold",
                                            color: "#1f2937",
                                            fontSize: "16px",
                                          }}
                                        >
                                          {item.heading}
                                        </div>

                                        <div
                                          style={{
                                            color: "#292d33ff",
                                            fontSize: "12px",
                                            marginTop: "4px",
                                            marginBottom: "8px",
                                          }}
                                        >
                                          {item.description}
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "12px",
                                            fontSize: "12px",
                                            padding: "8px",
                                          }}
                                        >
                                          <span
                                            style={{
                                              color: "#292d33ff",
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "4px",
                                            }}
                                          >
                                            Slot: {item.slot}
                                          </span>

                                          <span
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "4px",
                                              color: "#292d33ff",
                                            }}
                                          >
                                            Duration: {item.duration}
                                          </span>

                                          {item.startTime && (
                                            <span
                                              style={{ color: "#292d33ff" }}
                                            >
                                              Start: {item.startTime}
                                            </span>
                                          )}

                                          {(item as any).endTime && (
                                            <span
                                              style={{ color: "#292d33ff" }}
                                            >
                                              End: {(item as any).endTime}
                                            </span>
                                          )}

                                          <span
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "4px",
                                              color: "#292d33ff",
                                            }}
                                          >
                                            Pickup:{" "}
                                            {item.pickupLocation || "TBA"}
                                          </span>

                                          {(item as any).dropoffLocation && (
                                            <span
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                color: "#292d33ff",
                                              }}
                                            >
                                              Drop:{" "}
                                              {(item as any).dropoffLocation}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* --- STAY PDF BLOCK --- */}

                                    {item.category === "Stay" && (
                                      <div
                                        style={{
                                          opacity:
                                            item.status === "Residence"
                                              ? 0.8
                                              : 1,
                                        }}
                                      >
                                        <div
                                          style={{
                                            fontWeight: "bold",
                                            color: "#22252bff",
                                            fontSize: "16px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                          }}
                                        >
                                          {item.hotelName}

                                          <span
                                            style={{
                                              fontSize: "10px",
                                              padding: "2px 6px",
                                              borderRadius: "4px",
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "2px",
                                              backgroundColor: "#fff",
                                            }}
                                          >
                                            ⭐ {item.rating}
                                          </span>
                                        </div>

                                        <div
                                          style={{
                                            marginTop: "2px",
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: "8px",
                                            fontSize: "12px",
                                          }}
                                        >
                                          {item.status === "Check-in" ? (
                                            <>
                                              <div
                                                style={{
                                                  color: "#292d33ff",
                                                  padding: "2px",
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                Type: {item.stayType} (Stay)
                                              </div>

                                              <div
                                                style={{
                                                  color: "#292d33ff",
                                                  padding: "2px",
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                Room: {item.roomCategory}
                                              </div>

                                              <div
                                                style={{
                                                  color: "#292d33ff",
                                                  padding: "2px",
                                                }}
                                              >
                                                {item.nights} Nights Stay
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <div
                                                style={{
                                                  gridColumn: "span 2",
                                                  fontSize: "12px",
                                                  color: "#292d33ff",
                                                  fontStyle: "italic",
                                                  marginTop: "2px",
                                                }}
                                              >
                                                Continuing stay at{" "}
                                                {item.hotelName}.{" "}
                                              </div>

                                              <div
                                                style={{
                                                  color: "#292d33ff",
                                                  padding: "2px",
                                                  borderRadius: "4px",
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                Type: {item.stayType} (Stay)
                                              </div>

                                              <div
                                                style={{
                                                  color: "#292d33ff",
                                                  padding: "2px",
                                                  borderRadius: "4px",
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                Room: {item.roomCategory}
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* --- TRANSPORT PDF BLOCK --- */}

                                    {item.category === "Transport" && (
                                      <div>
                                        {/* Title & Badge */}

                                        <div
                                          style={{
                                            fontWeight: "bold",
                                            color: "#1f2937",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            fontSize: "16px",
                                          }}
                                        >
                                          {item.vehicleType}

                                          {["flight", "rail", "ferry"].includes(
                                            item.mode,
                                          ) &&
                                            item.flightNumber && (
                                              <span
                                                style={{ color: "#2563eb" }}
                                              >
                                                {" "}
                                                • {item.flightNumber}
                                              </span>
                                            )}

                                          <span
                                            style={{
                                              backgroundColor: [
                                                "flight",
                                                "rail",
                                                "ferry",
                                              ].includes(item.mode)
                                                ? "#eff6ff"
                                                : "#f0fdf4",

                                              color: [
                                                "flight",
                                                "rail",
                                                "ferry",
                                              ].includes(item.mode)
                                                ? "#1d4ed8"
                                                : "#15803d",

                                              fontSize: "10px",
                                              textTransform: "uppercase",
                                              padding: "2px 6px",
                                              borderRadius: "4px",
                                              fontWeight: "600",

                                              border: `1px solid ${["flight", "rail", "ferry"].includes(item.mode) ? "#bfdbfe" : "#dcfce7"}`,
                                            }}
                                          >
                                            {[
                                              "flight",
                                              "rail",
                                              "ferry",
                                            ].includes(item.mode)
                                              ? "Transit Ticket"
                                              : item.subType}
                                          </span>
                                        </div>

                                        {/* Flight Layout */}

                                        {item.mode === "flight" ? (
                                          <div
                                            style={{
                                              marginTop: "12px",
                                              padding: "12px",
                                            }}
                                          >
                                            <div
                                              style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                  "1fr 2fr 1fr",
                                                alignItems: "center",
                                                gap: "16px",
                                              }}
                                            >
                                              {/* Dep */}

                                              <div>
                                                <div
                                                  style={{
                                                    fontSize: "14px",
                                                    fontWeight: "900",
                                                    color: "#555555",
                                                  }}
                                                >
                                                  {item.pickupTime || "--:--"}
                                                </div>

                                                <div
                                                  style={{
                                                    fontSize: "10px",
                                                    fontWeight: "bold",
                                                    color: "#555555",
                                                    textTransform: "uppercase",
                                                  }}
                                                >
                                                  {item.pickupLocation ||
                                                    "Not Set"}
                                                </div>
                                              </div>

                                              {/* Middle */}

                                              <div
                                                style={{ textAlign: "center" }}
                                              >
                                                <div
                                                  style={{
                                                    fontSize: "10px",
                                                    color: "#555555",
                                                    fontWeight: "bold",
                                                    marginBottom: "4px",
                                                  }}
                                                >
                                                  DURATION:{" "}
                                                  {item.duration || "--"}
                                                </div>

                                                <div
                                                  style={{
                                                    position: "relative",
                                                    width: "100%",
                                                    height: "2px",
                                                    backgroundColor: "#6b6b6b",
                                                    margin: "8px 0",
                                                  }}
                                                >
                                                  {item.flightStops &&
                                                  item.flightStops !==
                                                    "Direct" ? (
                                                    <div
                                                      style={{
                                                        position: "absolute",
                                                        top: "50%",
                                                        left: "50%",
                                                        transform:
                                                          "translate(-50%, -50%)",
                                                        width: "8px",
                                                        height: "8px",
                                                        backgroundColor:
                                                          "#2563eb",
                                                        borderRadius: "50%",
                                                        border: "#6b6b6b",
                                                      }}
                                                    ></div>
                                                  ) : (
                                                    <div
                                                      style={{
                                                        position: "absolute",
                                                        top: "50%",
                                                        left: "50%",
                                                        transform:
                                                          "translate(-50%, -50%)",
                                                        fontSize: "14px",
                                                      }}
                                                    >
                                                      ✈️
                                                    </div>
                                                  )}
                                                </div>

                                                <div
                                                  style={{
                                                    fontSize: "10px",
                                                    fontWeight: "bold",
                                                    color:
                                                      item.flightStops &&
                                                      item.flightStops !==
                                                        "Direct"
                                                        ? "#2563eb"
                                                        : "#16a34a",
                                                  }}
                                                >
                                                  {item.flightStops &&
                                                  item.flightStops !== "Direct"
                                                    ? `${item.flightStops} ${item.layoverInfo ? `• ${item.layoverInfo}` : ""}`
                                                    : "Direct Flight"}
                                                </div>
                                              </div>

                                              {/* Arr */}

                                              <div
                                                style={{ textAlign: "right" }}
                                              >
                                                <div
                                                  style={{
                                                    fontSize: "14px",
                                                    fontWeight: "900",
                                                    color: "#555555",
                                                  }}
                                                >
                                                  {item.dropoffTime || "--:--"}

                                                  {(item as any)
                                                    .arrivalDayOffset ===
                                                    "+1" && (
                                                    <sup
                                                      style={{
                                                        fontSize: "10px",
                                                        color: "#ef4444",
                                                        marginLeft: "2px",
                                                      }}
                                                    >
                                                      +1
                                                    </sup>
                                                  )}
                                                </div>

                                                <div
                                                  style={{
                                                    fontSize: "10px",
                                                    fontWeight: "bold",
                                                    color: "#555555",
                                                    textTransform: "uppercase",
                                                  }}
                                                >
                                                  {item.dropoffLocation ||
                                                    "Not Set"}
                                                </div>
                                              </div>
                                            </div>

                                            {item.serviceDescription && (
                                              <div
                                                style={{
                                                  marginTop: "12px",
                                                  paddingTop: "8px",
                                                  borderTop:
                                                    "1px solid #e5e7eb",
                                                  fontSize: "11px",
                                                  fontWeight: "bold",
                                                  color: "#555555",
                                                }}
                                              >
                                                <strong>Cabin:</strong>{" "}
                                                {item.serviceDescription}
                                              </div>
                                            )}
                                          </div>
                                        ) : ["rail", "ferry"].includes(
                                            item.mode,
                                          ) ? (
                                          <div
                                            style={{
                                              marginTop: "12px",
                                              display: "grid",
                                              gridTemplateColumns:
                                                "1fr 1fr 1fr 1fr",
                                              gap: "12px",
                                              padding: "12px",
                                            }}
                                          >
                                            <div>
                                              <div
                                                style={{
                                                  fontSize: "10px",
                                                  fontWeight: "bold",
                                                  color: "#656565",
                                                  textTransform: "uppercase",
                                                  marginBottom: "4px",
                                                }}
                                              >
                                                Schedule
                                              </div>

                                              <div
                                                style={{
                                                  fontSize: "12px",
                                                  fontWeight: "bold",
                                                  color: "#555555",
                                                }}
                                              >
                                                {item.pickupTime || "--:--"}{" "}
                                                <span
                                                  style={{
                                                    color: "555555",
                                                    fontWeight: "normal",
                                                  }}
                                                >
                                                  to
                                                </span>{" "}
                                                {item.dropoffTime || "--:--"}
                                                {(item as any)
                                                  .arrivalDayOffset ===
                                                  "+1" && (
                                                  <sup
                                                    style={{
                                                      fontSize: "9px",
                                                      color: "#ef4444",
                                                      marginLeft: "2px",
                                                    }}
                                                  >
                                                    +1
                                                  </sup>
                                                )}
                                              </div>
                                            </div>

                                            <div>
                                              <div
                                                style={{
                                                  fontSize: "10px",
                                                  fontWeight: "bold",
                                                  color: "#656565",
                                                  textTransform: "uppercase",
                                                  marginBottom: "4px",
                                                }}
                                              >
                                                {item.mode === "ferry"
                                                  ? "Ports"
                                                  : "Route"}
                                              </div>

                                              <div
                                                style={{
                                                  fontSize: "12px",
                                                  fontWeight: "bold",
                                                  color: "#555555",
                                                }}
                                              >
                                                {item.pickupLocation ||
                                                  "Not Set"}{" "}
                                                →{" "}
                                                {item.dropoffLocation ||
                                                  "Not Set"}
                                              </div>
                                            </div>

                                            <div>
                                              <div
                                                style={{
                                                  fontSize: "10px",
                                                  fontWeight: "bold",
                                                  color: "#656565",
                                                  textTransform: "uppercase",
                                                  marginBottom: "4px",
                                                }}
                                              >
                                                Duration
                                              </div>

                                              <div
                                                style={{
                                                  fontSize: "12px",
                                                  fontWeight: "bold",
                                                  color: "#555555",
                                                  display: "inline-block",
                                                  padding: "2px 6px",
                                                  borderRadius: "4px",
                                                }}
                                              >
                                                {item.duration || "--"}
                                              </div>
                                            </div>

                                            <div>
                                              <div
                                                style={{
                                                  fontSize: "10px",
                                                  fontWeight: "bold",
                                                  color: "#656565",
                                                  textTransform: "uppercase",
                                                  marginBottom: "4px",
                                                }}
                                              >
                                                {item.mode === "ferry"
                                                  ? "Deck Info"
                                                  : "Travel Info"}
                                              </div>

                                              <div
                                                style={{
                                                  fontSize: "12px",
                                                  color: "#555555",
                                                }}
                                              >
                                                {item.serviceDescription ||
                                                  "--"}
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          /* Vehicle Mode */

                                          <div
                                            style={{
                                              marginTop: "12px",
                                              display: "grid",
                                              gridTemplateColumns:
                                                item.subType === "transfer"
                                                  ? "1fr 1fr 1fr 1fr"
                                                  : "1fr 1fr 1fr",
                                              gap: "12px",
                                              padding: "12px",
                                            }}
                                          >
                                            {/* Col 1: Pickup */}

                                            <div>
                                              <div
                                                style={{
                                                  fontSize: "10px",
                                                  fontWeight: "bold",
                                                  color: "#656565",
                                                  textTransform: "uppercase",
                                                  marginBottom: "4px",
                                                }}
                                              >
                                                Pickup
                                              </div>

                                              <div
                                                style={{
                                                  fontSize: "12px",
                                                  fontWeight: "bold",
                                                  color: "#555555",
                                                }}
                                              >
                                                {item.pickupLocation ||
                                                  "Not Set"}
                                              </div>

                                              <div
                                                style={{
                                                  fontSize: "11px",
                                                  fontWeight: "bold",
                                                  color: "#555555",
                                                  marginTop: "2px",
                                                }}
                                              >
                                                {item.pickupTime || "--:--"}
                                              </div>
                                            </div>

                                            {/* Col 2: Drop-off (Only for Transfers) */}

                                            {item.subType === "transfer" && (
                                              <div>
                                                <div
                                                  style={{
                                                    fontSize: "10px",
                                                    fontWeight: "bold",
                                                    color: "#656565",
                                                    textTransform: "uppercase",
                                                    marginBottom: "4px",
                                                  }}
                                                >
                                                  Drop-off
                                                </div>

                                                <div
                                                  style={{
                                                    fontSize: "12px",
                                                    fontWeight: "bold",
                                                    color: "#555555",
                                                  }}
                                                >
                                                  {item.dropoffLocation ||
                                                    "Not Set"}
                                                </div>

                                                <div
                                                  style={{
                                                    fontSize: "11px",
                                                    fontWeight: "bold",
                                                    color: "#555555",
                                                    marginTop: "2px",
                                                  }}
                                                >
                                                  {item.dropoffTime || "--:--"}
                                                </div>
                                              </div>
                                            )}

                                            {/* Col 3: Duration (Always Visible) */}

                                            <div>
                                              <div
                                                style={{
                                                  fontSize: "10px",
                                                  fontWeight: "bold",
                                                  color: "#656565",
                                                  textTransform: "uppercase",
                                                  marginBottom: "4px",
                                                }}
                                              >
                                                Duration
                                              </div>

                                              <div
                                                style={{
                                                  fontSize: "12px",
                                                  fontWeight: "bold",
                                                  color: "#555555",
                                                  display: "inline-block",
                                                  padding: "2px 6px",
                                                  borderRadius: "4px",
                                                }}
                                              >
                                                {item.duration || "--"}
                                              </div>
                                            </div>

                                            {/* Col 4: Journey Info */}

                                            <div>
                                              <div
                                                style={{
                                                  fontSize: "10px",
                                                  fontWeight: "bold",
                                                  color: "##656565",
                                                  textTransform: "uppercase",
                                                  marginBottom: "4px",
                                                }}
                                              >
                                                Journey Info
                                              </div>

                                              <div
                                                style={{
                                                  fontSize: "11px",
                                                  color: "#555555",
                                                }}
                                              >
                                                {item.serviceDescription ||
                                                  "--"}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* --- MEAL PDF BLOCK --- */}

                                    {item.category === "Meal" && (
                                      <div>
                                        <div
                                          style={{
                                            color: "#1f2937",
                                            fontSize: "15px",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {item.mealType}
                                        </div>

                                        {(item.restaurantName ||
                                          item.cuisine) && (
                                          <div
                                            style={{
                                              fontSize: "13px",
                                              color: "#4b5563",
                                              marginTop: "4px",
                                            }}
                                          >
                                            {item.restaurantName
                                              ? `at ${item.restaurantName}`
                                              : ""}{" "}
                                            {item.cuisine
                                              ? `(${item.cuisine})`
                                              : ""}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </td>

                                  {/* 🌟 COL 3: INCLUSION BADGE (Far Right) */}

                                  {/* 🌟 COL 3: INCLUSION BADGE (Far Right) */}

                                  <td
                                    style={{
                                      border: "1px solid #6b6b6b",
                                      padding: "16px",
                                      verticalAlign: "middle",
                                      textAlign: "center",
                                      width: "140px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "12px",

                                        fontWeight: "bold",

                                        color: badgeColor,

                                        backgroundColor: badgeBg,

                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {badgeText}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                </table>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* 👇 NEW: INCLUSIONS, EXCLUSIONS, NOTES & POLICIES */}
        <div
          ref={footerRef}
          style={{
            paddingLeft: "26px",
            paddingRight: "26px",
            paddingBottom: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            backgroundColor: "#ffffff",
          }}
        >
          {/* 1. IMPORTANT NOTES */}
          <div
            style={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              marginTop: "16px",
              borderRadius: "6px",
              padding: "16px",
              breakInside: "avoid",
              display: "inline-block",
              width: "100%",
            }}
          >
            <h4
              style={{
                color: "#374151",
                fontWeight: "bold",
                fontSize: "14px",
                marginBottom: "12px",
                textTransform: "uppercase",
              }}
            >
              Important Notes
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: "13px",
                color: "#4b5563",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                lineHeight: "1.4",
              }}
            >
              <li
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#6b7280", marginTop: "2px" }}>➣</span>{" "}
                <span>
                  Entrances, Tours once booked are non-refundable and
                  non-transferable.
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#6b7280", marginTop: "2px" }}>➣</span>{" "}
                <span>
                  For all Group Based Tours, passengers have to join from a
                  designated point advised upon confirmation. For Hotel Pickups,
                  the meeting point is the Hotel Lobby.
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#6b7280", marginTop: "2px" }}>➣</span>{" "}
                <span>
                  All mentioned Distances represent actual travel time and do
                  not account for waiting periods at sightseeing activities,
                  theme parks, airports, etc.
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#6b7280", marginTop: "2px" }}>➣</span>{" "}
                <span>
                  Optional tours can be taken only when there is enough time
                  available between leisure time and included tours; please plan
                  accordingly.
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#6b7280", marginTop: "2px" }}>➣</span>{" "}
                <span>
                  You must be present at the meeting point at least 10 mins
                  prior to the start time of the activity mentioned in the
                  itinerary.
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#6b7280", marginTop: "2px" }}>➣</span>{" "}
                <span>
                  Tour durations are indicative and subject to change based on
                  local conditions. Meeting points will be confirmed
                  post-booking.
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#6b7280", marginTop: "2px" }}>➣</span>{" "}
                <span>
                  In case mentioned hotels are unavailable, we will provide
                  similar/alternate properties (any change/additional cost will
                  be advised).
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#6b7280", marginTop: "2px" }}>➣</span>{" "}
                <span>
                  Hotel Check-in time is between 2:00 PM - 3:00 PM and Check-out
                  is 11:00 AM - 12:00 NOON. (Early Check In / Late Check Out is
                  on Request ONLY - NOT GUARANTEED).
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#6b7280", marginTop: "2px" }}>➣</span>{" "}
                <span>
                  No booking has been made; prices may change depending on
                  availability at the time of your confirmation.
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#6b7280", marginTop: "2px" }}>➣</span>{" "}
                <span>
                  Credit Card will be required at Hotels for deposits and
                  incidentals.
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#6b7280", marginTop: "2px" }}>➣</span>{" "}
                <span>
                  Upon receipt, if you believe any details in the booking are
                  wrong you must advise us immediately (within 24 Hours) as
                  changes made after will incur Penalties/Fees.
                </span>
              </li>
            </ul>
          </div>

          {/* 2. INCLUSIONS & EXCLUSIONS */}
          <div
            style={{
              display: "flex",
              width: "100%",
              gap: "16px",
              marginTop: "14px",
              breakInside: "avoid",
            }}
          >
            {/* Inclusions */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "6px",
                padding: "16px",
              }}
            >
              <h4
                style={{
                  color: "#166534",
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "18px",
                  textTransform: "uppercase",
                  borderBottom: "1px solid #bbf7d0",
                  paddingBottom: "6px",
                }}
              >
                Inclusions
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "13px",
                  color: "#1f2937",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  lineHeight: "1.4",
                }}
              >
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                    ✓
                  </span>{" "}
                  <span>
                    Personalized Meet-and-Assist Services upon Arrival and
                    Departure at the respective Airports
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                    ✓
                  </span>{" "}
                  <span>Accommodation at the Mentioned Hotels</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                    ✓
                  </span>{" "}
                  <span>Meals as Mentioned</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                    ✓
                  </span>{" "}
                  <span>Sightseeing as Mentioned</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                    ✓
                  </span>{" "}
                  <span>
                    Entrance Fees for all Sites visited as per program mentioned
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                    ✓
                  </span>{" "}
                  <span>
                    Services of a Driver and Private Air-Conditioned Vehicles
                    during all Tours and Transfers
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                    ✓
                  </span>{" "}
                  <span>
                    <strong>For Individual Travelers:</strong> Services of an
                    English-Speaking Guide during visits in each City
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                    ✓
                  </span>{" "}
                  <span>
                    <strong>For Groups of 16 PAX or more:</strong> Services of
                    an English-Speaking Tour Leader throughout the entire Tour,
                    including all activities and transfers from Airport to
                    Airport
                  </span>
                </li>
              </ul>
            </div>

            {/* Exclusions */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "6px",
                padding: "16px",
              }}
            >
              <h4
                style={{
                  color: "#991b1b",
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "18px",
                  textTransform: "uppercase",
                  borderBottom: "1px solid #fecaca",
                  paddingBottom: "6px",
                }}
              >
                Exclusions
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "13px",
                  color: "#1f2937",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  lineHeight: "1.4",
                }}
              >
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#dc2626",
                      fontWeight: "bold",
                      marginTop: "1px",
                    }}
                  >
                    ⛌
                  </span>{" "}
                  <span>
                    International & Domestic Flights arriving into the starting
                    City and departing from the ending City of the Tour
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#dc2626",
                      fontWeight: "bold",
                      marginTop: "1px",
                    }}
                  >
                    ⛌
                  </span>{" "}
                  <span>
                    Visa Arrangement (not required for EU / US Citizenship)
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#dc2626",
                      fontWeight: "bold",
                      marginTop: "1px",
                    }}
                  >
                    ⛌
                  </span>{" "}
                  <span>
                    All Service Charges / Local Taxes / Hotel Taxes, which have
                    to be paid directly by the PAX at the Hotel during Check-in
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#dc2626",
                      fontWeight: "bold",
                      marginTop: "1px",
                    }}
                  >
                    ⛌
                  </span>{" "}
                  <span>
                    Meals other than those mentioned above (Beverages during
                    Meals)
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#dc2626",
                      fontWeight: "bold",
                      marginTop: "1px",
                    }}
                  >
                    ⛌
                  </span>{" "}
                  <span>
                    Personal Expenses such as Laundry, Telephone, Drinks etc.
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#dc2626",
                      fontWeight: "bold",
                      marginTop: "1px",
                    }}
                  >
                    ⛌
                  </span>{" "}
                  <span>Tips for Guide / Driver / Restaurants / Porterage</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#dc2626",
                      fontWeight: "bold",
                      marginTop: "1px",
                    }}
                  >
                    ⛌
                  </span>{" "}
                  <span>
                    Travel insurance - We strongly recommend the purchase of
                    travel insurance (covering emergency medical evacuation)
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#dc2626",
                      fontWeight: "bold",
                      marginTop: "1px",
                    }}
                  >
                    ⛌
                  </span>{" "}
                  <span>
                    If proposed service(s) is not available at the moment of
                    booking/travel, we will try to find other similar service(s)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. T&C and CANCELLATION */}
          <div
            style={{
              display: "flex",
              width: "100%",
              gap: "32px",
              marginTop: "12px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderTop: "4px solid #dc2626",
              borderRadius: "6px",
              padding: "16px",
              breakInside: "avoid",
            }}
          >
            {/* Terms and Conditions */}
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  color: "#1f2937",
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                }}
              >
                Terms & Conditions
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "13px",
                  color: "#4b5563",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  lineHeight: "1.4",
                }}
              >
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#dc2626" }}>➣</span>{" "}
                  <span>
                    <strong>30% Non Refundable Deposit</strong> at the time of
                    booking.
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#dc2626" }}>➣</span>{" "}
                  <span>
                    Final payment to be made <strong>60 days prior</strong> to
                    Tour Start Date.
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#dc2626" }}>➣</span>{" "}
                  <span>
                    If your confirmed arrangements include a Flight,{" "}
                    <strong>Full Payment</strong> for the flights must be made
                    in advance.
                  </span>
                </li>
              </ul>
            </div>

            {/* Cancellations */}
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  color: "#1f2937",
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                }}
              >
                For Cancellations
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "13px",
                  color: "#4b5563",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  lineHeight: "1.4",
                }}
              >
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#dc2626" }}>➣</span>{" "}
                  <span>
                    Received prior to final payment will incur loss of
                    non-refundable deposit.
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#dc2626" }}>➣</span>{" "}
                  <span>
                    <strong>More than 91 days prior</strong> to departure: Loss
                    of non-refundable deposit.
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#dc2626" }}>➣</span>{" "}
                  <span>
                    <strong>Between 90-61 days prior</strong> to departure: 75%
                    of the total tour price.
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#dc2626" }}>➣</span>{" "}
                  <span>
                    <strong>60 days or less prior</strong> to departure: 100%
                    Non-Refundable.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              backgroundColor: "#f9fafb",
              marginTop: "32px",
              padding: "24px",
              textAlign: "center",
              fontSize: "12px",
              color: "#505050ff",
            }}
          >
            <p>
              Generated by Travdek. Prices and availability are subject to
              change.
            </p>
          </div>
        </div>
      </div>
      {/* --- FOOTER ACTION BAR --- */}
      <div className="w-full max-w-[410mm] mt-4 flex flex-col items-end gap-4">
        {/* 1. THE PRICE DISPLAY FOR APPROVED EMPLOYEES/AGENTS */}
        {user?.role !== "admin" && isApproved && (
          <div className="w-full sm:w-[400px] shrink-0 flex flex-col gap-0 bg-white p-6 rounded-xl shadow-lg border border-gray-300">
            <h3 className="text-gray-800 font-bold mb-3 uppercase tracking-wide text-sm border-b pb-2">
              Final Quotation
            </h3>

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
            </div>

            {finalOptionalGrandTotal > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl shadow-sm border border-orange-200 mt-3">
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
        )}

        {/* 2. NAVIGATION & ACTION BUTTONS WRAPPER */}

        <div className="flex justify-between items-center w-full mt-8 relative px-1">
          {/* 🌟 1. HIDDEN SVG FILTER FOR THE GOOEY EFFECT */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            className="hidden absolute"
          >
            <defs>
              <filter id="goo">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="10"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                  result="goo"
                />
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
            onClick={() => router.push("/dashboard/itinerary/create-day")}
            className="group relative z-10 inline-flex items-center px-5 py-2 text-gray-600 font-bold bg-white border border-gray-300 rounded-lg overflow-hidden transition-colors duration-700 ease-in-out hover:text-white hover:border-gray-700 shadow-sm"
          >
            {/* Button Content */}
            <span className="relative z-20 flex items-center gap-2">
              <ArrowLeft size={18} /> Back to Edit
            </span>

            {/* Gooey Blobs Container (Dark Gray blobs for light background) */}
            <div
              className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-lg"
              style={{ filter: "url(#goo)" }}
            >
              <div className="absolute top-0 -left-[5%] w-[34%] h-full bg-gray-700 rounded-full scale-[1.4] translate-y-[125%] transition-transform duration-700 ease-in-out group-hover:translate-y-0" />
              <div className="absolute top-0 left-[30%] w-[34%] h-full bg-gray-700 rounded-full scale-[1.4] translate-y-[125%] transition-transform duration-700 ease-in-out delay-[60ms] group-hover:translate-y-0" />
              <div className="absolute top-0 left-[66%] w-[34%] h-full bg-gray-700 rounded-full scale-[1.4] translate-y-[125%] transition-transform duration-700 ease-in-out delay-[25ms] group-hover:translate-y-0" />
            </div>
          </button>

          {/* Right Side: SUBMIT/PROCEED BUTTONS */}
          <div className="flex gap-4">
            {/* --- ADMIN ACTIONS --- */}
            {user?.role === "admin" && (
              <>
                {isReEdit && (
                  <div className="flex items-center text-orange-600 font-bold mr-4">
                    <AlertTriangle size={18} className="mr-2" /> Waiting for
                    Agent/Employee to edit
                  </div>
                )}
                <button
                  onClick={() => router.push("/dashboard/itinerary/costing")}
                  className="group relative overflow-hidden flex items-center justify-center gap-2 px-8 py-2 bg-green-600 text-white font-bold rounded-full border-[3px] border-white/30 shadow-[0_10px_20px_rgba(0,0,0,0.15)] outline-none cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:border-white/60"
                >
                  <div className="shine-effect absolute top-0 -left-[100px] w-[100px] h-full opacity-60 pointer-events-none bg-gradient-to-r from-transparent via-white/80 to-transparent z-0" />
                  <span className="relative z-10">Proceed to Costing</span>
                  <ArrowRight
                    size={18}
                    className="relative z-10 transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                  />
                </button>
              </>
            )}

            {/* --- AGENT / EMPLOYEE ACTIONS --- */}
            {(user?.role === "agent" || user?.role === "employee") && (
              <>
                {/* Pending State */}
                {isPending && (
                  <div className="flex items-center gap-3 text-orange-700 bg-orange-50 px-6 py-2 rounded-lg border border-orange-200 font-bold shadow-sm">
                    <Clock size={20} className="animate-pulse" />
                    <div>
                      <span className="block text-sm">
                        Pricing Request Sent
                      </span>
                      <span className="block text-[10px] opacity-80 uppercase">
                        Waiting for Admin
                      </span>
                    </div>
                  </div>
                )}

                {/* Resubmit State */}
                {isReEdit && (
                  <button
                    onClick={handleSubmitCosting}
                    className="group relative overflow-hidden flex items-center justify-center gap-2 px-8 py-2 bg-orange-600 text-white font-bold rounded-full border-[3px] border-white/30 shadow-[0_10px_20px_rgba(0,0,0,0.15)] outline-none cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:border-white/60"
                  >
                    <div className="shine-effect absolute top-0 -left-[100px] w-[100px] h-full opacity-60 pointer-events-none bg-gradient-to-r from-transparent via-white/80 to-transparent z-0" />
                    <span className="relative z-10">Resubmit for Costing</span>
                    <Send
                      size={18}
                      className="relative z-10 transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </button>
                )}

                {/* Approved State */}
                {isApproved && (
                  <button
                    onClick={() => router.push("/dashboard/itinerary/preview")}
                    className="group relative overflow-hidden flex items-center justify-center gap-2 px-8 py-2 bg-green-600 text-white font-bold rounded-full border-[3px] border-white/30 shadow-[0_10px_20px_rgba(0,0,0,0.15)] outline-none cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:border-white/60"
                  >
                    <div className="shine-effect absolute top-0 -left-[100px] w-[100px] h-full opacity-60 pointer-events-none bg-gradient-to-r from-transparent via-white/80 to-transparent z-0" />
                    <span className="relative z-10">Proceed to Preview</span>
                    <ArrowRight
                      size={18}
                      className="relative z-10 transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                    />
                  </button>
                )}

                {/* Base Draft State */}
                {!isPending && !isApproved && !isReEdit && (
                  <button
                    onClick={handleSubmitCosting}
                    className="group relative overflow-hidden flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-full border-[3px] border-white/30 shadow-[0_10px_20px_rgba(0,0,0,0.15)] outline-none cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:border-white/60"
                  >
                    <div className="shine-effect absolute top-0 -left-[100px] w-[100px] h-full opacity-60 pointer-events-none bg-gradient-to-r from-transparent via-white/80 to-transparent z-0" />
                    <span className="relative z-10">Submit for Costing</span>
                    {/* Notice the cool send icon animation here! */}
                    <Send
                      size={18}
                      className="relative z-10 transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>{" "}
      {/* <-- Closes the FOOTER ACTION BAR */}
    </div>
  );
}
