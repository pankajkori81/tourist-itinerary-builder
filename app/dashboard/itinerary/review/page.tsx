"use client";

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, FileText, Send, ArrowRight, Clock, AlertTriangle, Printer } from "lucide-react";

import { useItinerary } from '@/app/context/ItineraryContext';
import { useUser } from '@/app/context/UserContext';
import { DayPlan } from '../create-day/constants/daywiseConstants';

// --- HELPER TO FORMAT DAY LABEL (No Dates in Review) ---
const formatDayLabel = (dayNum: number) => {
  return `DAY ${dayNum}`; 
};

// --- HELPER FOR INCLUSION BADGES ---
const getBadgeStyles = (status: string | undefined) => {
    const s = status || 'included';
    if (s === 'excluded') return { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5', text: 'Excluded' };
    if (s === 'optional') return { bg: '#eff6ff', color: '#1d4ed8', border: '#93c5fd', text: 'Optional' };
    return { bg: '#f0fdf4', color: '#15803d', border: '#86efac', text: 'Included' };
};

export default function ReviewPage() {
  const router = useRouter();
  const { user } = useUser();
  const { itineraryData, submitForCosting, completeStep, requestReEdit } = useItinerary();
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // --- DATA PREPARATION ---
  const routes = itineraryData.routingData?.routes || [];
  const startCity = routes.length > 0 ? routes[0].cities[0]?.name : 'TBA';
  const endCity = routes.length > 0 ? routes[routes.length - 1].cities[0]?.name : 'TBA';
  const totalNights = routes.reduce((acc, curr) => acc + (curr.nights || 0), 0);
  const totalDays = totalNights + 1;
  const uniqueCities = Array.from(new Set(routes.flatMap(r => r.cities.map(c => c.name)))).join(' | ');
  
  const rawDayPlans = (itineraryData.dayWiseActivities || []) as DayPlan[];
  const currentStatus = itineraryData.status || 'draft';

  // --- LOGIC: HANDLE CONTINUED STAYS & FLATTENING ---
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

  // --- PDF GENERATION ---
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsDownloading(true);
    const element = printRef.current;
    
    try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff', height: element.scrollHeight, windowHeight: element.scrollHeight });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const PDF_WIDTH = 210;
        const PDF_HEIGHT = 297;
        const imgHeightInPdf = (imgHeight * PDF_WIDTH) / imgWidth; 
        
        let heightLeft = imgHeightInPdf;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, PDF_WIDTH, imgHeightInPdf);
        heightLeft -= PDF_HEIGHT;

        while (heightLeft > 0) {
            position = heightLeft - imgHeightInPdf;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, PDF_WIDTH, imgHeightInPdf);
            heightLeft -= PDF_HEIGHT;
        }
        pdf.save(`${itineraryData.tripName || 'Itinerary_Review'}.pdf`);
    } catch (error) {
        console.error("PDF Error:", error);
        alert("Failed to generate PDF.");
    } finally {
        setIsDownloading(false);
    }
  };

  // --- SUBMIT LOGIC ---
  const handleSubmitCosting = () => {
      completeStep('review');
      submitForCosting(); 
      
      // FORCE SAVE
      const allLibs = JSON.parse(localStorage.getItem('itinerary_library') || '[]');
      const idx = allLibs.findIndex((i:any) => i.id === itineraryData.id);
      if (idx !== -1) {
          allLibs[idx].status = 'pending_costing';
          localStorage.setItem('itinerary_library', JSON.stringify(allLibs));
      }
      
      alert("Itinerary submitted for Costing! Admin has been notified.");
      window.location.reload(); 
  };

  const isPending = currentStatus === 'pending_costing';
  const isApproved = currentStatus === 'approved';
  const isReEdit = currentStatus === 'reedit_requested';

  return (
    <div className="min-h-screen bg-gray-300 p-8 flex flex-col items-center gap-6 pb-32">
      
      {/* TOOLBAR */}
      <div className="w-full max-w-[410mm] flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-400">
         <h2 className="font-bold text-gray-700 flex items-center gap-2"><FileText size={20} className="text-blue-600"/> Review Itinerary Draft</h2>
         <div className="flex gap-3">
             <button onClick={() => alert('Excel Download Logic')} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-200 transition-colors text-sm font-bold border border-gray-300">
                <Download size={16} /> Excel
             </button>
             <button onClick={handleDownloadPdf} disabled={isDownloading} className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded shadow-sm hover:bg-gray-900 transition-colors text-sm font-bold disabled:opacity-50">
                {isDownloading ? 'Generating...' : <><Printer size={16} /> PDF</>}
             </button>
         </div>
      </div>

      {/* --- REVIEW DOCUMENT --- */}
      <div 
        ref={printRef}
        id="pdf-content"
        style={{ backgroundColor: '#ffffff', color: '#1f2937', fontFamily: 'Arial, sans-serif' }} 
        className="w-full max-w-[410mm] min-h-[297mm] shadow-2xl p-0"
      >
        
        {/* HEADER */}
        <div style={{ borderBottom: '2px solid #001d5a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
                <div style={{ flex: 1, padding: '24px' }}>
                    <div style={{ height: '48px', marginBottom: '16px' }}>
                         {/* Replace with your logo logic */}
                        <img src="/logo.png" alt="Company Logo" style={{ height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <h1 style={{ color: '#001d6a',  fontSize: '28px', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 8, lineHeight: '1.1' }}>{itineraryData.tripName || "Draft Itinerary"}</h1>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', marginLeft:'4px', fontSize: '14px', fontWeight: 'bold', color: '#202020ff' }}>
                        <span style={{ backgroundColor: '#eff6ff', color:'#001d6a' ,  padding: '4px 8px', borderRadius: '4px' }}>{totalDays} Days | {totalNights} Nights</span>
                        <span style={{ backgroundColor: '#f3f4f6', color:'#001d6a',  padding: '4px 8px', borderRadius: '4px' }}>{itineraryData.packageType || "Custom Package"}</span>
                    </div>
                </div>
            
            </div>
            
            {/* DETAILS GRID */}
            <div style={{ borderTop: '1px solid #636363ff' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', fontSize: '13px' }}>
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #989898', borderBottom: '1px solid #989898' }}>Generated:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #989898', borderBottom: '1px solid #989898' }}>{new Date().toLocaleDateString()}</div>
                    
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #989898', borderBottom: '1px solid #989898' }}>Travelers:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #989898' }}>{itineraryData.numberOfTravelers} Pax</div>
                    
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #989898', borderBottom: '1px solid #989898' }}>Countries:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #989898', textTransform: 'uppercase', gridColumn: 'span 3' }}>{itineraryData.selectedCountries?.join(', ') || "TBA"}</div>
                    
                    <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #989898', borderBottom: '1px solid #989898' }}>Cities:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #989898', textTransform: 'uppercase', gridColumn: 'span 3' }}>{uniqueCities}</div>
                    
                                        <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Start / End:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{startCity} / {endCity}</div>

                                        <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Route:</div>
                    <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{itineraryData.selectedCountries?.length || 1} Country | {routes.length} Cities</div>

                </div>
            </div>
        </div>

        {/* ITINERARY BODY */}

        <div style={{ marginTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '48px' }}>
            <h3 style={{ color: '#001d6a', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'underline', marginBottom: '16px', fontSize: '14px', letterSpacing: '0em' }}>Itinerary Details</h3>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #636363ff', fontSize: '14px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#e2dffd', color: 'rgb(35, 41, 52)', textTransform: 'uppercase', fontSize: '12px' }}>
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
                                    {/* <td colSpan={4} style={{ backgroundColor: '#f3f4f6', color: '#303030', padding: '8px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold' }}>DAY {day.dayNumber}{'}'}</td> */}
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
      </div>

      {/* --- FOOTER ACTION BAR --- */}
      {/* <div className="bottom-0 left-0 right-0 p-4 z-50 flex justify-end gap-4 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.1)]">
             */}
           < div className="w-full max-w-[410mm] mt-4 flex justify-end gap-4">
            {/* ========================================= */}
            {/* 1. ADMIN VIEW (God Mode)                  */}
            {/* ========================================= */}
            {user?.role === 'admin' && (
                <>
                    {isReEdit && (
                        <div className="flex items-center text-orange-600 font-bold mr-4">
                            <AlertTriangle size={18} className="mr-2"/> Waiting for Agent/Employee to edit
                        </div>
                    )}
                    <button 
                        onClick={() => router.push('/dashboard/itinerary/costing')}
                        className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-700 transition-transform hover:scale-105"
                    >
                        Proceed to Costing <ArrowRight size={18}/>
                    </button>
                </>
            )}

            {/* ========================================= */}
            {/* 2. AGENT / EMPLOYEE VIEW (Requester)      */}
            {/* ========================================= */}
            {(user?.role === 'agent' || user?.role === 'employee') && (
                <>
                    {/* A. Pending State */}
                    {isPending && (
                        <div className="flex items-center gap-3 text-orange-700 bg-orange-50 px-6 py-3 rounded-lg border border-orange-200 font-bold shadow-sm">
                            <Clock size={20} className="animate-pulse"/> 
                            <div>
                                <span className="block text-sm">Pricing Request Sent</span>
                                <span className="block text-[10px] opacity-80 uppercase">Waiting for Admin</span>
                            </div>
                        </div>
                    )}

                    {/* B. Re-Edit State */}
                    {isReEdit && (
                        <button 
                            onClick={handleSubmitCosting}
                            className="flex items-center gap-2 bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all hover:scale-105"
                        >
                            Resubmit for Costing <Send size={18}/>
                        </button>
                    )}

                    {/* C. Approved State */}
                    {isApproved && (
                        <button 
                            onClick={() => router.push('/dashboard/itinerary/costing')}
                            className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-700 transition-all hover:scale-105"
                        >
                            View Costing <ArrowRight size={18}/>
                        </button>
                    )}

                    {/* D. Default Submit State (Draft) */}
                    {!isPending && !isApproved && !isReEdit && (
                        <button 
                            onClick={handleSubmitCosting}
                            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-105"
                        >
                            Submit for Costing <Send size={18}/>
                        </button>
                    )}
                </>
            )}
      </div>

    </div>
  );
}