

// //           {/* 👇 INCLUSIONS, EXCLUSIONS, NOTES, POLICIES & PRICING (Ref added!) */}

// //         <div ref={footerRef} style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            

// //             {/* 🌟 NEW: THE PRICING BLOCK (Prints perfectly above Important Notes) 🌟 */}

// //             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px', breakInside: 'avoid', width: '100%', maxWidth: '400px', alignSelf: 'flex-end' }}>

                

// //                 {/* BLUE BOX: Selling Price */}

// //                 <div style={{ backgroundColor: '#1d4ed8', borderRadius: '12px', padding: '20px', color: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>

// //                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>

// //                         <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#bfdbfe' }}>Price Per Person</span>

// //                         <i className="fa-solid fa-user" style={{ color: '#60a5fa', fontSize: '18px' }}></i>

// //                     </div>

                    

// //                     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>

// //                       {Object.entries(

// //                         finalPaxCosts.reduce((acc: any, cost: number) => {

// //                           acc[cost] = (acc[cost] || 0) + 1;

// //                           return acc;

// //                         }, {})

// //                       ).map(([cost, count], idx) => (

// //                         <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px' }}>

// //                             <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#dbeafe' }}>{Number(count)} Adult Cost</span>

// //                             <span style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'monospace' }}>

// //                                 {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(Number(cost))}

// //                             </span>

// //                         </div>

// //                       ))}

// //                     </div>



// //                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '12px' }}>

// //                         <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#bfdbfe' }}>Total Group Value ({travelerCount} Adult)</span>

// //                         <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>

// //                             {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(finalGrandTotal)}

// //                         </span>

// //                     </div>

// //                 </div>



// //                 {/* ORANGE BOX: Optionals (Only shows if there are checked optionals) */}

// //                 {processedOptionals.length > 0 && (

// //                     <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '16px' }}>

// //                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #fed7aa', paddingBottom: '8px' }}>

// //                             <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#9a3412' }}>Optional Add-ons</span>

// //                             <span style={{ fontSize: '10px', backgroundColor: '#fed7aa', color: '#9a3412', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>EXTRA</span>

// //                         </div>



// //                         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px', borderBottom: '1px solid #fed7aa', paddingBottom: '12px' }}>

// //                             {processedOptionals.map((opt: any, idx: number) => (

// //                                 <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>

// //                                     <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#7c2d12' }}>{opt.name}</div>

// //                                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>

// //                                         <span style={{ fontSize: '11px', color: '#ea580c', fontWeight: '500' }}>

// //                                             {opt.pax} Pax @ {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(opt.retailPP)}/pp

// //                                         </span>

// //                                         <span style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace', color: '#9a3412' }}>

// //                                             +{new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(opt.retailTotal)}

// //                                         </span>

// //                                     </div>

// //                                 </div>

// //                             ))}

// //                         </div>



// //                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

// //                             <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#9a3412' }}>Group Total Optionals</span>

// //                             <span style={{ fontSize: '16px', fontWeight: '900', fontFamily: 'monospace', color: '#7c2d12' }}>

// //                                 {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(finalOptionalGrandTotal)}

// //                             </span>

// //                         </div>

// //                     </div>

// //                 )}

// //             </div>

            



// //             {/* 1. IMPORTANT NOTES */}

// //             {/* <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', marginTop: '16px', borderRadius: '6px', padding: '16px', breakInside: 'avoid', display: 'inline-block', width: '100%' }}>   */}

// //             {/* 1. IMPORTANT NOTES */}

// //             <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', marginTop: '16px', borderRadius: '6px', padding: '16px', breakInside: 'avoid', display: 'inline-block', width: '100%' }}>

// //                 <h4 style={{ color: '#374151', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>Important Notes</h4>

// //                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: '1.4' }}>

// //                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Entrances, Tours once booked are non-refundable and non-transferable.</span></li>

// //                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>For all Group Based Tours, passengers have to join from a designated point advised upon confirmation. For Hotel Pickups, the meeting point is the Hotel Lobby.</span></li>

// //                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>All mentioned Distances represent actual travel time and do not account for waiting periods at sightseeing activities, theme parks, airports, etc.</span></li>

// //                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Optional tours can be taken only when there is enough time available between leisure time and included tours; please plan accordingly.</span></li>

// //                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>You must be present at the meeting point at least 10 mins prior to the start time of the activity mentioned in the itinerary.</span></li>

// //                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Tour durations are indicative and subject to change based on local conditions. Meeting points will be confirmed post-booking.</span></li>

// //                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>In case mentioned hotels are unavailable, we will provide similar/alternate properties (any change/additional cost will be advised).</span></li>

// //                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Hotel Check-in time is between 2:00 PM - 3:00 PM and Check-out is 11:00 AM - 12:00 NOON. (Early Check In / Late Check Out is on Request ONLY - NOT GUARANTEED).</span></li>

// //                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>No booking has been made; prices may change depending on availability at the time of your confirmation.</span></li>

// //                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Credit Card will be required at Hotels for deposits and incidentals.</span></li>

// //                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Upon receipt, if you believe any details in the booking are wrong you must advise us immediately (within 24 Hours) as changes made after will incur Penalties/Fees.</span></li>

// //                  </ul>

// //             </div>  



// //             {/* 2. INCLUSIONS & EXCLUSIONS */}

// //             <div style={{ display: 'flex', width: '100%', gap: '16px',  marginTop: '14px', breakInside: 'avoid' }}>

                

// //                 {/* Inclusions (Green Box - 50% width) */}

// //                 <div style={{ flex: 1, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '16px' }}>

// //                     <h4 style={{ color: '#166534', fontWeight: 'bold', fontSize: '14px', marginBottom: '18px', textTransform: 'uppercase', borderBottom: '1px solid #bbf7d0', paddingBottom: '6px' }}>Inclusions</h4>

// //                     <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#1f2937', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Personalized Meet-and-Assist Services upon Arrival and Departure at the respective Airports</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Accommodation at the Mentioned Hotels</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Meals as Mentioned</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Sightseeing as Mentioned</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Entrance Fees for all Sites visited as per program mentioned</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Services of a Driver and Private Air-Conditioned Vehicles during all Tours and Transfers</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span><strong>For Individual Travelers:</strong> Services of an English-Speaking Guide during visits in each City</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span><strong>For Groups of 16 PAX or more:</strong> Services of an English-Speaking Tour Leader throughout the entire Tour, including all activities and transfers from Airport to Airport</span></li>

// //                     </ul>

// //                 </div>



// //                 {/* Exclusions (Red Box - 50% width) */}

// //                 <div style={{ flex: 1, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '16px' }}>

// //                     <h4 style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '14px', marginBottom: '18px', textTransform: 'uppercase', borderBottom: '1px solid #fecaca', paddingBottom: '6px' }}>Exclusions</h4>

// //                     <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#1f2937', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>International & Domestic Flights arriving into the starting City and departing from the ending City of the Tour</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>Visa Arrangement (not required for EU / US Citizenship)</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>All Service Charges / Local Taxes / Hotel Taxes, which have to be paid directly by the PAX at the Hotel during Check-in</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>Meals other than those mentioned above (Beverages during Meals)</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>Personal Expenses such as Laundry, Telephone, Drinks etc.</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>Tips for Guide / Driver / Restaurants / Porterage</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>Travel insurance - We strongly recommend the purchase of travel insurance (covering emergency medical evacuation)</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>If proposed service(s) is not available at the moment of booking/travel, we will try to find other similar service(s)</span></li>

// //                     </ul>

// //                 </div>



// //             </div>



// //             {/* 3. T&C and CANCELLATION */}

// //             <div style={{ display: 'flex', width: '100%', gap: '32px', marginTop: '12px' ,  backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderTop: '4px solid #dc2626', borderRadius: '6px', padding: '16px', breakInside: 'avoid' }}>

                

// //                 {/* Terms and Conditions */}

// //                 <div style={{ flex: 1 }}>

// //                     <h4 style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>Terms & Conditions</h4>

// //                     <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span><strong>30% Non Refundable Deposit</strong> at the time of booking.</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span>Final payment to be made <strong>60 days prior</strong> to Tour Start Date.</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span>If your confirmed arrangements include a Flight, <strong>Full Payment</strong> for the flights must be made in advance.</span></li>

// //                     </ul>

// //                 </div>



// //                 {/* Cancellations */}

// //                 <div style={{ flex: 1 }}>

// //                     <h4 style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>For Cancellations</h4>

// //                     <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span>Received prior to final payment will incur loss of non-refundable deposit.</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span><strong>More than 91 days prior</strong> to departure: Loss of non-refundable deposit.</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span><strong>Between 90-61 days prior</strong> to departure: 75% of the total tour price.</span></li>

// //                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span><strong>60 days or less prior</strong> to departure: 100% Non-Refundable.</span></li>

// //                     </ul>

// //                 </div>



// //             </div>





// //         </div>

     

    

// //       {/* Footer */}

// //         <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', marginTop: '32px', padding: '24px', textAlign: 'center', fontSize: '12px', color: '#505050ff' }}>

// //             <p>Generated by Travdek. Prices and availability are subject to change.</p>

// //         </div>



// //       </div>





// //   {/* 👇 Wrapper forces the button to the far left corner */}

// //     {/* <div className="w-full max-w-[410mm] flex justify-start mt-4 mb-8">

// //         <button

// //             onClick={() => router.push('/dashboard/itinerary/costing')}

// //             className="flex items-center gap-2 text-gray-500 hover:text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all"

// //         >

// //             <ArrowLeft size={18} /> Back to Costing

// //         </button>

// //     </div> */}



// //     <div className="w-full max-w-[410mm] flex justify-start mt-4 mb-8 relative px-2">

        

// //         {/* 🌟 HIDDEN SVG FILTER FOR THE GOOEY EFFECT */}

// //         <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="hidden absolute">

// //             <defs>

// //                 <filter id="goo">

// //                     <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />

// //                     <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />

// //                     <feBlend in="SourceGraphic" in2="goo" />

// //                 </filter>

// //             </defs>

// //         </svg>



// //         {/* 🌟 ANIMATED BACK BUTTON (Gooey Glass Effect) */}

// //         <button

// //             onClick={() => router.push('/dashboard/itinerary/costing')}

// //             className="group relative z-10 inline-flex items-center px-5 py-2 text-gray-600 font-bold bg-white border border-gray-300 rounded-lg overflow-hidden transition-colors duration-700 ease-in-out hover:text-white hover:border-gray-700 shadow-sm"

// //         >

// //             {/* Button Content */}

// //             <span className="relative z-20 flex items-center gap-2">

// //                 <ArrowLeft size={18} /> Back to Costing

// //             </span>



// //             {/* Gooey Blobs Container */}

// //             <div

// //                 className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-lg"

// //                 style={{ filter: 'url(#goo)' }}

// //             >

// //                 <div className="absolute top-0 -left-[5%] w-[34%] h-full bg-gray-700 rounded-full scale-[1.4] translate-y-[125%] transition-transform duration-700 ease-in-out group-hover:translate-y-0" />

// //                 <div className="absolute top-0 left-[30%] w-[34%] h-full bg-gray-700 rounded-full scale-[1.4] translate-y-[125%] transition-transform duration-700 ease-in-out delay-[60ms] group-hover:translate-y-0" />

// //                 <div className="absolute top-0 left-[66%] w-[34%] h-full bg-gray-700 rounded-full scale-[1.4] translate-y-[125%] transition-transform duration-700 ease-in-out delay-[25ms] group-hover:translate-y-0" />

// //             </div>

// //         </button>



// //     </div>



// //       {/* 👇 NEW SHARE MODAL UI PAasted HERE */}

// //       {isShareModalOpen && (

// //           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">

// //               <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

// //                   <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">

// //                       <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">

// //                           <Share2 className="text-green-600" size={20} /> Share Itinerary

// //                       </h2>

// //                       <button onClick={() => setIsShareModalOpen(false)} disabled={isSharing} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">

// //                           <X size={20} />

// //                       </button>

// //                   </div>





// //                   <form onSubmit={handleShareEmail} className="p-6 space-y-5">

// //                       <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-800 mb-2">

// //                           Generate a clean PDF presentation and send it directly to your client.

// //                       </div>



// //                       {/* Delivery Methods Checkboxes */}

// //                       <div className="flex gap-4 mb-4">

// //                           <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">

// //                               <input type="checkbox" checked={shareForm.sendEmail} onChange={(e) => setShareForm({...shareForm, sendEmail: e.target.checked})} className="w-4 h-4 text-green-600 rounded" />

// //                               Send via Email

// //                           </label>

// //                           <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">

// //                               <input type="checkbox" checked={shareForm.sendWhatsapp} onChange={(e) => setShareForm({...shareForm, sendWhatsapp: e.target.checked})} className="w-4 h-4 text-green-600 rounded" />

// //                               Send WhatsApp Alert

// //                           </label>

// //                       </div>

                      

// //                       <div>

// //                           <label className="block text-xs font-bold text-gray-700 mb-1">Client Name</label>

// //                           <input 

// //                               type="text" required value={shareForm.clientName} onChange={(e) => setShareForm({...shareForm, clientName: e.target.value})}

// //                               placeholder="e.g. John Doe" 

// //                               className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"

// //                           />

// //                       </div>

                      

// //                       {shareForm.sendEmail && (

// //                           <div className="animate-in fade-in slide-in-from-top-2">

// //                               <label className="block text-xs font-bold text-gray-700 mb-1">Client Email <span className="text-red-500">*</span></label>

// //                               <div className="relative">

// //                                   <Mail size={16} className="absolute left-3 top-3 text-gray-400" />

// //                                   <input 

// //                                       type="email" required={shareForm.sendEmail} value={shareForm.clientEmail} onChange={(e) => setShareForm({...shareForm, clientEmail: e.target.value})}

// //                                       placeholder="john@example.com" 

// //                                       className="w-full pl-9 p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"

// //                                   />

// //                               </div>

// //                           </div>

// //                       )}



// //                       {shareForm.sendWhatsapp && (

// //                           <div className="animate-in fade-in slide-in-from-top-2">

// //                               <label className="block text-xs font-bold text-gray-700 mb-1">Client Phone <span className="text-red-500">*</span></label>

// //                               <input 

// //                                   type="tel" required={shareForm.sendWhatsapp} value={shareForm.clientPhone} onChange={(e) => setShareForm({...shareForm, clientPhone: e.target.value})}

// //                                   placeholder="+919876543210 (Include country code)" 

// //                                   className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"

// //                               />

// //                           </div>

// //                       )}



// //                       <button 

// //                           type="submit" disabled={isSharing || (!shareForm.sendEmail && !shareForm.sendWhatsapp)}

// //                           className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 mt-2"

// //                       >

// //                           {isSharing ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : 'Send to Client'}

// //                       </button>

// //                   </form>

// //               </div>

// //           </div>

// //       )}



// //     </div>

// //   );

// // } see. i want to separte into two section first section is header part  , itinerary details  , price part section and in other section i want just Terms and Policy . so i want to seprertly in this manner so so give me code in this way . see first img is of website screen and second one is of pdf. so we have to resolve this gaping and spacing issue in pdf page . so how we can resolve that give me first logic and apporch and give me code as well one by one. 9+








//  <div ref={footerRef} style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
//             {/* 🌟 NEW: THE PRICING BLOCK (Prints perfectly above Important Notes) 🌟 */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px', breakInside: 'avoid', width: '100%', maxWidth: '400px', alignSelf: 'flex-end' }}>
                
//                 {/* BLUE BOX: Selling Price */}
//                 <div style={{ backgroundColor: '#1d4ed8', borderRadius: '12px', padding: '20px', color: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//                         <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#bfdbfe' }}>Price Per Person</span>
//                         <i className="fa-solid fa-user" style={{ color: '#60a5fa', fontSize: '18px' }}></i>
//                     </div>
                    
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
//                       {Object.entries(
//                         finalPaxCosts.reduce((acc: any, cost: number) => {
//                           acc[cost] = (acc[cost] || 0) + 1;
//                           return acc;
//                         }, {})
//                       ).map(([cost, count], idx) => (
//                         <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px' }}>
//                             <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#dbeafe' }}>{Number(count)} Adult Cost</span>
//                             <span style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'monospace' }}>
//                                 {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(Number(cost))}
//                             </span>
//                         </div>
//                       ))}
//                     </div>

//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '12px' }}>
//                         <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#bfdbfe' }}>Total Group Value ({travelerCount} Adult)</span>
//                         <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>
//                             {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(finalGrandTotal)}
//                         </span>
//                     </div>
//                 </div>

//                 {/* ORANGE BOX: Optionals (Only shows if there are checked optionals) */}
//                 {processedOptionals.length > 0 && (
//                     <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '16px' }}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #fed7aa', paddingBottom: '8px' }}>
//                             <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#9a3412' }}>Optional Add-ons</span>
//                             <span style={{ fontSize: '10px', backgroundColor: '#fed7aa', color: '#9a3412', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>EXTRA</span>
//                         </div>

//                         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px', borderBottom: '1px solid #fed7aa', paddingBottom: '12px' }}>
//                             {processedOptionals.map((opt: any, idx: number) => (
//                                 <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
//                                     <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#7c2d12' }}>{opt.name}</div>
//                                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
//                                         <span style={{ fontSize: '11px', color: '#ea580c', fontWeight: '500' }}>
//                                             {opt.pax} Pax @ {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(opt.retailPP)}/pp
//                                         </span>
//                                         <span style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace', color: '#9a3412' }}>
//                                             +{new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(opt.retailTotal)}
//                                         </span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#9a3412' }}>Group Total Optionals</span>
//                             <span style={{ fontSize: '16px', fontWeight: '900', fontFamily: 'monospace', color: '#7c2d12' }}>
//                                 {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(finalOptionalGrandTotal)}
//                             </span>
//                         </div>
//                     </div>
//                 )}
//             </div>
            

//             {/* 1. IMPORTANT NOTES */}
//             {/* <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', marginTop: '16px', borderRadius: '6px', padding: '16px', breakInside: 'avoid', display: 'inline-block', width: '100%' }}>   */}
//             {/* 1. IMPORTANT NOTES */}
//             <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', marginTop: '16px', borderRadius: '6px', padding: '16px', breakInside: 'avoid', display: 'inline-block', width: '100%' }}>
//                 <h4 style={{ color: '#374151', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>Important Notes</h4>
//                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: '1.4' }}>
//                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Entrances, Tours once booked are non-refundable and non-transferable.</span></li>
//                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>For all Group Based Tours, passengers have to join from a designated point advised upon confirmation. For Hotel Pickups, the meeting point is the Hotel Lobby.</span></li>
//                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>All mentioned Distances represent actual travel time and do not account for waiting periods at sightseeing activities, theme parks, airports, etc.</span></li>
//                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Optional tours can be taken only when there is enough time available between leisure time and included tours; please plan accordingly.</span></li>
//                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>You must be present at the meeting point at least 10 mins prior to the start time of the activity mentioned in the itinerary.</span></li>
//                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Tour durations are indicative and subject to change based on local conditions. Meeting points will be confirmed post-booking.</span></li>
//                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>In case mentioned hotels are unavailable, we will provide similar/alternate properties (any change/additional cost will be advised).</span></li>
//                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Hotel Check-in time is between 2:00 PM - 3:00 PM and Check-out is 11:00 AM - 12:00 NOON. (Early Check In / Late Check Out is on Request ONLY - NOT GUARANTEED).</span></li>
//                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>No booking has been made; prices may change depending on availability at the time of your confirmation.</span></li>
//                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Credit Card will be required at Hotels for deposits and incidentals.</span></li>
//                     <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#6b7280', marginTop: '2px' }}>➣</span> <span>Upon receipt, if you believe any details in the booking are wrong you must advise us immediately (within 24 Hours) as changes made after will incur Penalties/Fees.</span></li>
//                  </ul>
//             </div>  

//             {/* 2. INCLUSIONS & EXCLUSIONS */}
//             <div style={{ display: 'flex', width: '100%', gap: '16px',  marginTop: '14px', breakInside: 'avoid' }}>
                
//                 {/* Inclusions (Green Box - 50% width) */}
//                 <div style={{ flex: 1, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '16px' }}>
//                     <h4 style={{ color: '#166534', fontWeight: 'bold', fontSize: '14px', marginBottom: '18px', textTransform: 'uppercase', borderBottom: '1px solid #bbf7d0', paddingBottom: '6px' }}>Inclusions</h4>
//                     <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#1f2937', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Personalized Meet-and-Assist Services upon Arrival and Departure at the respective Airports</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Accommodation at the Mentioned Hotels</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Meals as Mentioned</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Sightseeing as Mentioned</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Entrance Fees for all Sites visited as per program mentioned</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span>Services of a Driver and Private Air-Conditioned Vehicles during all Tours and Transfers</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span><strong>For Individual Travelers:</strong> Services of an English-Speaking Guide during visits in each City</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> <span><strong>For Groups of 16 PAX or more:</strong> Services of an English-Speaking Tour Leader throughout the entire Tour, including all activities and transfers from Airport to Airport</span></li>
//                     </ul>
//                 </div>

//                 {/* Exclusions (Red Box - 50% width) */}
//                 <div style={{ flex: 1, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '16px' }}>
//                     <h4 style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '14px', marginBottom: '18px', textTransform: 'uppercase', borderBottom: '1px solid #fecaca', paddingBottom: '6px' }}>Exclusions</h4>
//                     <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#1f2937', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>International & Domestic Flights arriving into the starting City and departing from the ending City of the Tour</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>Visa Arrangement (not required for EU / US Citizenship)</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>All Service Charges / Local Taxes / Hotel Taxes, which have to be paid directly by the PAX at the Hotel during Check-in</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>Meals other than those mentioned above (Beverages during Meals)</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>Personal Expenses such as Laundry, Telephone, Drinks etc.</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>Tips for Guide / Driver / Restaurants / Porterage</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>Travel insurance - We strongly recommend the purchase of travel insurance (covering emergency medical evacuation)</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '1px' }}>⛌</span> <span>If proposed service(s) is not available at the moment of booking/travel, we will try to find other similar service(s)</span></li>
//                     </ul>
//                 </div>

//             </div>

//             {/* 3. T&C and CANCELLATION */}
//             <div style={{ display: 'flex', width: '100%', gap: '32px', marginTop: '12px' ,  backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderTop: '4px solid #dc2626', borderRadius: '6px', padding: '16px', breakInside: 'avoid' }}>
                
//                 {/* Terms and Conditions */}
//                 <div style={{ flex: 1 }}>
//                     <h4 style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>Terms & Conditions</h4>
//                     <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span><strong>30% Non Refundable Deposit</strong> at the time of booking.</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span>Final payment to be made <strong>60 days prior</strong> to Tour Start Date.</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span>If your confirmed arrangements include a Flight, <strong>Full Payment</strong> for the flights must be made in advance.</span></li>
//                     </ul>
//                 </div>

//                 {/* Cancellations */}
//                 <div style={{ flex: 1 }}>
//                     <h4 style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>For Cancellations</h4>
//                     <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span>Received prior to final payment will incur loss of non-refundable deposit.</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span><strong>More than 91 days prior</strong> to departure: Loss of non-refundable deposit.</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span><strong>Between 90-61 days prior</strong> to departure: 75% of the total tour price.</span></li>
//                         <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span><strong>60 days or less prior</strong> to departure: 100% Non-Refundable.</span></li>
//                     </ul>
//                 </div>

//             </div>


//         </div>