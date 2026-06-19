

// // PostGreSQL pass: Bl@ckday77@#$%



// {rawDayPlans.map((day, idx) => {
//                               const items = getRenderableItemsForDay(idx, day);
                              
//                               // 🌟 DYNAMIC ROUTING LOGIC (e.g., DELHI - AGRA)
//                               const prevCity = idx > 0 ? rawDayPlans[idx - 1].city : null;
//                               const isCityChange = prevCity && prevCity !== day.city;
//                               const displayCityName = isCityChange ? `${prevCity} - ${day.city}` : day.city;
                              
//                               // Calculate Nights for the new city
//                               let nightCount = 0;
//                               if (!prevCity || isCityChange) {
//                                   const currentRoute = routes.find((r: any) => r.cities.some((c: any) => c.name === day.city));
//                                   if (currentRoute) nightCount = currentRoute.nights;
//                               }
//                               const displayNights = nightCount > 0 ? ` (${nightCount}N)` : '';
//                               const finalDayHeader = `${displayCityName}${displayNights}`.toUpperCase();

//                               return (
//                                 <Draggable key={day.dayNumber.toString()} draggableId={`day-${day.dayNumber}`} index={idx}>
//                                   {(provided, snapshot) => (

                        
//                                     <tbody 
//                                       ref={(el) => {
//                                         provided.innerRef(el as HTMLElement);
//                                         if (el) dayRefsMap.current.set(day.dayNumber, el);
//                                       }}
//                                       {...provided.draggableProps}
//                                       style={{ 
//                                         ...provided.draggableProps.style,
//                                         breakInside: 'avoid', 
//                                         pageBreakInside: 'avoid',
//                                         backgroundColor: snapshot.isDragging ? '#f3f4f6' : 'transparent',
//                                         boxShadow: snapshot.isDragging ? '0px 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
//                                         display: snapshot.isDragging ? 'table' : '', 
//                                         outline: '1px solid #6b6b6b',
//                                       }}
//                                     >
                                        
                              

//                                         {/* 🌟 THE FULL-WIDTH DAY HEADER ROW */}
// <tr style={{ backgroundColor: '#fefce8', borderTop: idx > 0 ? '1px solid #6b6b6b' : 'none' }}>
//     <td colSpan={3} style={{ 
//         padding: '12px 16px', 
//         border: '1px solid #6b6b6b',
//         borderTop: idx > 0 ? '2px solid #6b6b6b' : '1px solid #6b6b6b'
//     }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
//             <span style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '16px' }}>DAY {String(day.dayNumber).padStart(2, '0')}</span>
//             <span style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '16px' }}>{finalDayHeader}</span>
            
//             {/* Drag Handle */}
//             <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing hide-on-print ml-auto" style={{ color: '#9ca3af' }} data-html2canvas-ignore="true">
//                 <GripVertical size={18} />
//             </div>
//         </div>
//     </td>
// </tr>



//                                         {/* Leisure Day Check */}
//                                         {items.length === 0 && (
//                                             <tr>
//                                                 <td colSpan={3} style={{ border: '1px solid #6b6b6b', padding: '16px', color: '#9ca3af', fontStyle: 'italic', textAlign: 'center' }}>
//                                                     Leisure day. No activities scheduled.
//                                                 </td>
//                                             </tr>
//                                         )}

//                                         {/* Items Rendering Loop */}
//                                         {items.map((item, itemIdx) => {
                                            
//                                             // INCLUSION LOGIC
//                                             const inclusionStatus = item.inclusionType || 'included'; 
//                                             const isExcluded = inclusionStatus === 'excluded';
//                                             const isOptional = inclusionStatus === 'optional';
//                                             const badgeBg = isExcluded ? '#ffffff' : isOptional ? '#ffffff' : '#ffffff';
//                                             const badgeColor = isExcluded ? '#1f2937' : isOptional ? '#1f2937' : '#1f2937';
//                                             const badgeText = isExcluded ? 'Excluded' : isOptional ? 'Optional' : 'Included';

//                                             // 🌟 SMART ICON LOGIC
//                                             let IconComponent = Camera;
//                                             let iconColor = '#0284c7'; // Default blue
                                            
//                                             if (item.category === 'Stay') { IconComponent = BedDouble; iconColor = '#059669'; } // Green
//                                             else if (item.category === 'Meal') { IconComponent = Utensils; iconColor = '#d97706'; } // Orange
//                                             else if (item.category === 'Transport') {
//                                                 iconColor = '#6366f1'; // Indigo
//                                                 if (item.mode === 'flight') IconComponent = Plane;
//                                                 else if (item.mode === 'rail') IconComponent = Train;
//                                                 else if (item.mode === 'ferry') IconComponent = Ship;
//                                                 else if (item.mode === 'bus') IconComponent = Bus;
//                                                 else IconComponent = Car;
//                                             }

//                                             return (
//                                                 <tr key={`${day.dayNumber}-${itemIdx}`} className="pdf-row" >
                                                    
                                               


//                                                     {/* 🌟 COL 1: CATEGORY WITH ICON */}
// <td style={{ border: '1px solid #6b6b6b', padding: '16px 24px', verticalAlign: 'middle', width: '200px' }}>
//     <div style={{ 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'flex-start', 
//         gap: '12px', 
//         fontWeight: 'bold', 
//         color: '#374151', 
//         fontSize: '14px', 
//         textTransform: 'uppercase', 
//         letterSpacing: '0.05em',
//         lineHeight: '20px'
//     }}>
//         <IconComponent 
//             size={20} 
//             style={{ 
//                 color: iconColor, 
//                 flexShrink: 0,
//                 display: 'inline-block',
//                 verticalAlign: 'middle',
//                 position: 'relative',
//                 top: '-1px'
//             }} 
//         />
//         <span style={{ lineHeight: '20px', display: 'inline-block', verticalAlign: 'middle' }}>
//             {item.category === 'Stay' ? 'Hotel' : item.category}
//         </span>
//     </div>
// </td>

//                                                     {/* 🌟 COL 2: DESCRIPTION (Middle Content) */}
// <td style={{ border: '1px solid #6b6b6b', padding: '16px', verticalAlign: 'top' }}>
                                                        
                                             

//                                                              {/* --- ACTIVITY PDF BLOCK --- */}
//                                                         {item.category === 'Activity' && (
//                                                             <div>
//                                                                 <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '16px' }}>{item.heading}</div>
//                                                                 <div style={{ color: '#292d33ff', fontSize: '12px', marginTop: '4px', marginBottom: '8px' }}>{item.description}</div>
//                                                                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', padding: '8px' }}>
//                                                                     <span style={{ color: '#292d33ff', display: 'flex', alignItems: 'center', gap: '4px', }}>Slot: {item.slot}</span>
//                                                                     <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Duration: {item.duration}</span>
//                                                                     {item.startTime && <span style={{ color: '#292d33ff' }}>Start: {item.startTime}</span>}
//                                                                     {(item as any).endTime && <span style={{ color: '#292d33ff' }}>End: {(item as any).endTime}</span>}
//                                                                     <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Pickup: {item.pickupLocation || "TBA"}</span>
//                                                                     {(item as any).dropoffLocation && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Drop: {(item as any).dropoffLocation}</span>}
//                                                                 </div>
//                                                             </div>
//                                                         )}

                                         
//                                                          {/* --- STAY PDF BLOCK --- */}
//                                                          {item.category === 'Stay' && (
//                                                             <div style={{ opacity: item.status === 'Residence' ? 0.8 : 1 }}>
//                                                                 <div style={{ fontWeight: 'bold', color: '#22252bff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                                     {item.hotelName}
//                                                                     <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#fff' }}>⭐ {item.rating}</span>
//                                                                 </div>
//                                                                 <div style={{ marginTop: '2px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
//                                                                     {item.status === 'Check-in' ? (
//                                                                         <>
//                                                                             <div style={{  color: '#292d33ff', padding: '2px', fontWeight: 'bold' }}>Type: {item.stayType} (Stay)</div>
//                                                                             <div style={{  color: '#292d33ff', padding: '2px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
//                                                                             <div style={{  color: '#292d33ff', padding: '2px' }}>{item.nights} Nights Stay</div>
//                                                                         </>
//                                                                     ) : (
//                                                                         <>
//                                                                             <div style={{ gridColumn: 'span 2', fontSize: '12px', color: '#292d33ff', fontStyle: 'italic', marginTop: '2px' }}>Continuing stay at {item.hotelName}. </div>
//                                                                               <div style={{  color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Type: {item.stayType} (Stay)</div>
//                                                                             <div style={{  color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
//                                                                         </>
//                                                                    )}
//                                                                 </div>
//                                                             </div>
//                                                         )}

//                                                           {/* --- TRANSPORT PDF BLOCK --- */}
//                                                          {item.category === 'Transport' && (
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
//                                                                     <div style={{ marginTop: '12px', padding: '12px'}}>
//                                                                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center', gap: '16px' }}>
//                                                                             {/* Dep */}
//                                                                             <div>
//                                                                                 <div style={{ fontSize: '14px', fontWeight: '900', color: '#555555' }}>{item.pickupTime || '--:--'}</div>
//                                                                                 <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#555555', textTransform: 'uppercase' }}>{item.pickupLocation || 'Not Set'}</div>
//                                                                             </div>
//                                                                             {/* Middle */}
//                                                                             <div style={{ textAlign: 'center' }}>
//                                                                                 <div style={{ fontSize: '10px', color: '#555555', fontWeight: 'bold', marginBottom: '4px' }}>DURATION: {item.duration || '--'}</div>
//                                                                                 <div style={{ position: 'relative', width: '100%', height: '2px', backgroundColor: '#6b6b6b', margin: '8px 0' }}>
//                                                                                     {item.flightStops && item.flightStops !== 'Direct' ? (
//                                                                                         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '8px', height: '8px', backgroundColor: '#2563eb', borderRadius: '50%', border: '#6b6b6b' }}></div>
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
//                                                                                 <div style={{ fontSize: '14px', fontWeight: '900', color: '#555555' }}>
//                                                                                     {item.dropoffTime || '--:--'}
//                                                                                     {(item as any).arrivalDayOffset === '+1' && <sup style={{ fontSize: '10px', color: '#ef4444', marginLeft: '2px' }}>+1</sup>}
//                                                                                 </div>
//                                                                                 <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#555555', textTransform: 'uppercase' }}>{item.dropoffLocation || 'Not Set'}</div>
//                                                                             </div>
//                                                                         </div>
//                                                                         {item.serviceDescription && (
//                                                                             <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', fontSize: '11px', fontWeight:"bold", color: '#555555' }}>
//                                                                                 <strong>Cabin:</strong> {item.serviceDescription}
//                                                                             </div>
//                                                                         )}
//                                                                     </div>
//                                                                 ) : ['rail', 'ferry'].includes(item.mode) ? (
//                                                                     <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px',  padding: '12px' }}>
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Schedule</div>
//                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>
//                                                                                 {item.pickupTime || '--:--'} <span style={{color: '555555', fontWeight: 'normal'}}>to</span> {item.dropoffTime || '--:--'}
//                                                                                 {(item as any).arrivalDayOffset === '+1' && <sup style={{ fontSize: '9px', color: '#ef4444', marginLeft: '2px' }}>+1</sup>}
//                                                                             </div>
//                                                                         </div>
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>{item.mode === 'ferry' ? 'Ports' : 'Route'}</div>
//                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>{item.pickupLocation || 'Not Set'} → {item.dropoffLocation || 'Not Set'}</div>
//                                                                         </div>
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Duration</div>
//                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555', display: 'inline-block', padding: '2px 6px', borderRadius: '4px' }}>{item.duration || '--'}</div>
//                                                                         </div>
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>{item.mode === 'ferry' ? 'Deck Info' : 'Travel Info'}</div>
//                                                                             <div style={{ fontSize: '12px', color: '#555555' }}>{item.serviceDescription || '--'}</div>
//                                                                         </div>
//                                                                     </div>
//                                                                 ) : (
//                                                                     /* Vehicle Mode */
// <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: item.subType === 'transfer' ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap: '12px', padding: '12px',  }}>
                                                                        
//                                                                         {/* Col 1: Pickup */}
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Pickup</div>
//                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>{item.pickupLocation || 'Not Set'}</div>
//                                                                             <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#555555', marginTop: '2px' }}>{item.pickupTime || '--:--'}</div>
//                                                                         </div>

//                                                                         {/* Col 2: Drop-off (Only for Transfers) */}
//                                                                         {item.subType === 'transfer' && (
//                                                                             <div>
//                                                                                 <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Drop-off</div>
//                                                                                 <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>{item.dropoffLocation || 'Not Set'}</div>
//                                                                                 <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#555555', marginTop: '2px' }}>{item.dropoffTime || '--:--'}</div>
//                                                                             </div>
//                                                                         )}

//                                                                         {/* Col 3: Duration (Always Visible) */}
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Duration</div>
//                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555', display: 'inline-block', padding: '2px 6px', borderRadius: '4px' }}>{item.duration || '--'}</div>
//                                                                         </div>

//                                                                         {/* Col 4: Journey Info */}
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '##656565', textTransform: 'uppercase', marginBottom: '4px' }}>Journey Info</div>
//                                                                             <div style={{ fontSize: '11px', color: '#555555'  }}>{item.serviceDescription || '--'}</div>
//                                                                         </div>
                                                                        
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         )}


//                                                         {/* --- MEAL PDF BLOCK --- */}
//                                                         {item.category === 'Meal' && (
//                                                             <div>
//                                                                 <div style={{ color: '#1f2937', fontSize: '15px', fontWeight: 'bold' }}>
//                                                                      {item.mealType}
//                                                                 </div>
//                                                                 {(item.restaurantName || item.cuisine) && (
//                                                                     <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '4px' }}>
//                                                                         {item.restaurantName ? `at ${item.restaurantName}` : ''} {item.cuisine ? `(${item.cuisine})` : ''}
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         )}
                                                        
//                                                     </td>

//                                                     {/* 🌟 COL 3: INCLUSION BADGE (Far Right) */}
                                                 
// {/* 🌟 COL 3: INCLUSION BADGE (Far Right) */}
// <td style={{ border: '1px solid #6b6b6b', padding: '16px', verticalAlign: 'middle', textAlign: 'center', width: '140px' }}>
                                                        
//                                                         <span style={{ 
//                                                             fontSize: '12px', 
//                                                             fontWeight: 'bold', 
//                                                             color: badgeColor, 
//                                                             backgroundColor: badgeBg,
//                                                             textTransform:"uppercase"
//                                                         }}>
//                                                             {badgeText}
//                                                         </span>
//                                                     </td>

//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                   )}
//                                 </Draggable>
//                               );
//                           })}








// {rawDayPlans.map((day, idx) => {
//                               const items = getRenderableItemsForDay(idx, day);
                              
//                               // 🌟 DYNAMIC ROUTING LOGIC (e.g., DELHI - AGRA)
//                               const prevCity = idx > 0 ? rawDayPlans[idx - 1].city : null;
//                               const isCityChange = prevCity && prevCity !== day.city;
//                               const displayCityName = isCityChange ? `${prevCity} - ${day.city}` : day.city;
                              
//                               // Calculate Nights for the new city
//                               let nightCount = 0;
//                               if (!prevCity || isCityChange) {
//                                   const currentRoute = routes.find((r: any) => r.cities.some((c: any) => c.name === day.city));
//                                   if (currentRoute) nightCount = currentRoute.nights;
//                               }
//                               const displayNights = nightCount > 0 ? ` (${nightCount}N)` : '';
//                               const finalDayHeader = `${displayCityName}${displayNights}`.toUpperCase();

//                               return (
//                                 <Draggable key={day.dayNumber.toString()} draggableId={`day-${day.dayNumber}`} index={idx}>
//                                   {(provided, snapshot) => (
//                                     <tbody 
//                                       ref={(el) => {
//                                         provided.innerRef(el as HTMLElement);
//                                         if (el) dayRefsMap.current.set(day.dayNumber, el);
//                                       }}
//                                       {...provided.draggableProps}
//                                       style={{ 
//                                         ...provided.draggableProps.style,
//                                         breakInside: 'avoid', 
//                                         pageBreakInside: 'avoid',
//                                         backgroundColor: snapshot.isDragging ? '#f3f4f6' : 'transparent',
//                                         boxShadow: snapshot.isDragging ? '0px 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
//                                         display: snapshot.isDragging ? 'table' : '', 
//                                         outline: '1px solid #6b6b6b',
//                                       }}
//                                     >
                                        
                              

//                                         {/* 🌟 THE FULL-WIDTH DAY HEADER ROW */}
// <tr style={{ backgroundColor: '#fefce8', borderTop: idx > 0 ? '1px solid #6b6b6b' : 'none' }}>
//     <td colSpan={3} style={{ 
//         padding: '12px 16px', 
//         border: '1px solid #6b6b6b',
//         borderTop: idx > 0 ? '2px solid #6b6b6b' : '1px solid #6b6b6b'
//     }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
//             <span style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '16px' }}>DAY {String(day.dayNumber).padStart(2, '0')}</span>
//             <span style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '16px' }}>{finalDayHeader}</span>
            
//             {/* Drag Handle */}
//             <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing hide-on-print ml-auto" style={{ color: '#9ca3af' }} data-html2canvas-ignore="true">
//                 <GripVertical size={18} />
//             </div>
//         </div>
//     </td>
// </tr>



//                                         {/* Leisure Day Check */}
//                                         {items.length === 0 && (
//                                             <tr>
//                                                 <td colSpan={3} style={{ border: '1px solid #6b6b6b', padding: '16px', color: '#9ca3af', fontStyle: 'italic', textAlign: 'center' }}>
//                                                     Leisure day. No activities scheduled.
//                                                 </td>
//                                             </tr>
//                                         )}

//                                         {/* Items Rendering Loop */}
//                                         {items.map((item, itemIdx) => {
                                            
//                                             // INCLUSION LOGIC
//                                             const inclusionStatus = item.inclusionType || 'included'; 
//                                             const isExcluded = inclusionStatus === 'excluded';
//                                             const isOptional = inclusionStatus === 'optional';
//                                             const badgeBg = isExcluded ? '#ffffff' : isOptional ? '#ffffff' : '#ffffff';
//                                             const badgeColor = isExcluded ? '#1f2937' : isOptional ? '#1f2937' : '#1f2937';
//                                             const badgeText = isExcluded ? 'Excluded' : isOptional ? 'Optional' : 'Included';

//                                             // 🌟 SMART ICON LOGIC
//                                             let IconComponent = Camera;
//                                             let iconColor = '#0284c7'; // Default blue
                                            
//                                             if (item.category === 'Stay') { IconComponent = BedDouble; iconColor = '#059669'; } // Green
//                                             else if (item.category === 'Meal') { IconComponent = Utensils; iconColor = '#d97706'; } // Orange
//                                             else if (item.category === 'Transport') {
//                                                 iconColor = '#6366f1'; // Indigo
//                                                 if (item.mode === 'flight') IconComponent = Plane;
//                                                 else if (item.mode === 'rail') IconComponent = Train;
//                                                 else if (item.mode === 'ferry') IconComponent = Ship;
//                                                 else if (item.mode === 'bus') IconComponent = Bus;
//                                                 else IconComponent = Car;
//                                             }

//                                             return (
//                                                 <tr key={`${day.dayNumber}-${itemIdx}`} className="pdf-row" >
                                                    
                                               


//                                                     {/* 🌟 COL 1: CATEGORY WITH ICON */}
// <td style={{ border: '1px solid #6b6b6b', padding: '16px 24px', verticalAlign: 'middle', width: '200px' }}>
//     <div style={{ 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'flex-start', 
//         gap: '12px', 
//         fontWeight: 'bold', 
//         color: '#374151', 
//         fontSize: '14px', 
//         textTransform: 'uppercase', 
//         letterSpacing: '0.05em',
//         lineHeight: '20px'
//     }}>
//         <IconComponent 
//             size={20} 
//             style={{ 
//                 color: iconColor, 
//                 flexShrink: 0,
//                 display: 'inline-block',
//                 verticalAlign: 'middle',
//                 position: 'relative',
//                 top: '-1px'
//             }} 
//         />
//         <span style={{ lineHeight: '20px', display: 'inline-block', verticalAlign: 'middle' }}>
//             {item.category === 'Stay' ? 'Hotel' : item.category}
//         </span>
//     </div>
// </td>

//                                                     {/* 🌟 COL 2: DESCRIPTION (Middle Content) */}
// <td style={{ border: '1px solid #6b6b6b', padding: '16px', verticalAlign: 'top' }}>
                                                        
                                             

//                                                              {/* --- ACTIVITY PDF BLOCK --- */}
//                                                         {item.category === 'Activity' && (
//                                                             <div>
//                                                                 <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '16px' }}>{item.heading}</div>
//                                                                 <div style={{ color: '#292d33ff', fontSize: '12px', marginTop: '4px', marginBottom: '8px' }}>{item.description}</div>
//                                                                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', padding: '8px' }}>
//                                                                     <span style={{ color: '#292d33ff', display: 'flex', alignItems: 'center', gap: '4px', }}>Slot: {item.slot}</span>
//                                                                     <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Duration: {item.duration}</span>
//                                                                     {item.startTime && <span style={{ color: '#292d33ff' }}>Start: {item.startTime}</span>}
//                                                                     {(item as any).endTime && <span style={{ color: '#292d33ff' }}>End: {(item as any).endTime}</span>}
//                                                                     <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Pickup: {item.pickupLocation || "TBA"}</span>
//                                                                     {(item as any).dropoffLocation && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#292d33ff' }}>Drop: {(item as any).dropoffLocation}</span>}
//                                                                 </div>
//                                                             </div>
//                                                         )}

                                         
//                                                          {/* --- STAY PDF BLOCK --- */}
//                                                          {item.category === 'Stay' && (
//                                                             <div style={{ opacity: item.status === 'Residence' ? 0.8 : 1 }}>
//                                                                 <div style={{ fontWeight: 'bold', color: '#22252bff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                                                     {item.hotelName}
//                                                                     <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#fff' }}>⭐ {item.rating}</span>
//                                                                 </div>
//                                                                 <div style={{ marginTop: '2px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
//                                                                     {item.status === 'Check-in' ? (
//                                                                         <>
//                                                                             <div style={{  color: '#292d33ff', padding: '2px', fontWeight: 'bold' }}>Type: {item.stayType} (Stay)</div>
//                                                                             <div style={{  color: '#292d33ff', padding: '2px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
//                                                                             <div style={{  color: '#292d33ff', padding: '2px' }}>{item.nights} Nights Stay</div>
//                                                                         </>
//                                                                     ) : (
//                                                                         <>
//                                                                             <div style={{ gridColumn: 'span 2', fontSize: '12px', color: '#292d33ff', fontStyle: 'italic', marginTop: '2px' }}>Continuing stay at {item.hotelName}. </div>
//                                                                               <div style={{  color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Type: {item.stayType} (Stay)</div>
//                                                                             <div style={{  color: '#292d33ff', padding: '2px', borderRadius: '4px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
//                                                                         </>
//                                                                    )}
//                                                                 </div>
//                                                             </div>
//                                                         )}

//                                                           {/* --- TRANSPORT PDF BLOCK --- */}
//                                                          {item.category === 'Transport' && (
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
//                                                                     <div style={{ marginTop: '12px', padding: '12px'}}>
//                                                                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center', gap: '16px' }}>
//                                                                             {/* Dep */}
//                                                                             <div>
//                                                                                 <div style={{ fontSize: '14px', fontWeight: '900', color: '#555555' }}>{item.pickupTime || '--:--'}</div>
//                                                                                 <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#555555', textTransform: 'uppercase' }}>{item.pickupLocation || 'Not Set'}</div>
//                                                                             </div>
//                                                                             {/* Middle */}
//                                                                             <div style={{ textAlign: 'center' }}>
//                                                                                 <div style={{ fontSize: '10px', color: '#555555', fontWeight: 'bold', marginBottom: '4px' }}>DURATION: {item.duration || '--'}</div>
//                                                                                 <div style={{ position: 'relative', width: '100%', height: '2px', backgroundColor: '#6b6b6b', margin: '8px 0' }}>
//                                                                                     {item.flightStops && item.flightStops !== 'Direct' ? (
//                                                                                         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '8px', height: '8px', backgroundColor: '#2563eb', borderRadius: '50%', border: '#6b6b6b' }}></div>
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
//                                                                                 <div style={{ fontSize: '14px', fontWeight: '900', color: '#555555' }}>
//                                                                                     {item.dropoffTime || '--:--'}
//                                                                                     {(item as any).arrivalDayOffset === '+1' && <sup style={{ fontSize: '10px', color: '#ef4444', marginLeft: '2px' }}>+1</sup>}
//                                                                                 </div>
//                                                                                 <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#555555', textTransform: 'uppercase' }}>{item.dropoffLocation || 'Not Set'}</div>
//                                                                             </div>
//                                                                         </div>
//                                                                         {item.serviceDescription && (
//                                                                             <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', fontSize: '11px', fontWeight:"bold", color: '#555555' }}>
//                                                                                 <strong>Cabin:</strong> {item.serviceDescription}
//                                                                             </div>
//                                                                         )}
//                                                                     </div>
//                                                                 ) : ['rail', 'ferry'].includes(item.mode) ? (
//                                                                     <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px',  padding: '12px' }}>
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Schedule</div>
//                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>
//                                                                                 {item.pickupTime || '--:--'} <span style={{color: '555555', fontWeight: 'normal'}}>to</span> {item.dropoffTime || '--:--'}
//                                                                                 {(item as any).arrivalDayOffset === '+1' && <sup style={{ fontSize: '9px', color: '#ef4444', marginLeft: '2px' }}>+1</sup>}
//                                                                             </div>
//                                                                         </div>
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>{item.mode === 'ferry' ? 'Ports' : 'Route'}</div>
//                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>{item.pickupLocation || 'Not Set'} → {item.dropoffLocation || 'Not Set'}</div>
//                                                                         </div>
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Duration</div>
//                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555', display: 'inline-block', padding: '2px 6px', borderRadius: '4px' }}>{item.duration || '--'}</div>
//                                                                         </div>
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>{item.mode === 'ferry' ? 'Deck Info' : 'Travel Info'}</div>
//                                                                             <div style={{ fontSize: '12px', color: '#555555' }}>{item.serviceDescription || '--'}</div>
//                                                                         </div>
//                                                                     </div>
//                                                                 ) : (
//                                                                     /* Vehicle Mode */
// <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: item.subType === 'transfer' ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap: '12px', padding: '12px',  }}>
                                                                        
//                                                                         {/* Col 1: Pickup */}
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Pickup</div>
//                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>{item.pickupLocation || 'Not Set'}</div>
//                                                                             <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#555555', marginTop: '2px' }}>{item.pickupTime || '--:--'}</div>
//                                                                         </div>

//                                                                         {/* Col 2: Drop-off (Only for Transfers) */}
//                                                                         {item.subType === 'transfer' && (
//                                                                             <div>
//                                                                                 <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Drop-off</div>
//                                                                                 <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>{item.dropoffLocation || 'Not Set'}</div>
//                                                                                 <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#555555', marginTop: '2px' }}>{item.dropoffTime || '--:--'}</div>
//                                                                             </div>
//                                                                         )}

//                                                                         {/* Col 3: Duration (Always Visible) */}
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Duration</div>
//                                                                             <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555', display: 'inline-block', padding: '2px 6px', borderRadius: '4px' }}>{item.duration || '--'}</div>
//                                                                         </div>

//                                                                         {/* Col 4: Journey Info */}
//                                                                         <div>
//                                                                             <div style={{ fontSize: '10px', fontWeight: 'bold', color: '##656565', textTransform: 'uppercase', marginBottom: '4px' }}>Journey Info</div>
//                                                                             <div style={{ fontSize: '11px', color: '#555555'  }}>{item.serviceDescription || '--'}</div>
//                                                                         </div>
                                                                        
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         )}


//                                                         {/* --- MEAL PDF BLOCK --- */}
//                                                         {item.category === 'Meal' && (
//                                                             <div>
//                                                                 <div style={{ color: '#1f2937', fontSize: '15px', fontWeight: 'bold' }}>
//                                                                      {item.mealType}
//                                                                 </div>
//                                                                 {(item.restaurantName || item.cuisine) && (
//                                                                     <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '4px' }}>
//                                                                         {item.restaurantName ? `at ${item.restaurantName}` : ''} {item.cuisine ? `(${item.cuisine})` : ''}
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         )}
                                                        
//                                                     </td>

//                                                     {/* 🌟 COL 3: INCLUSION BADGE (Far Right) */}
                                                 
// {/* 🌟 COL 3: INCLUSION BADGE (Far Right) */}
// <td style={{ border: '1px solid #6b6b6b', padding: '16px', verticalAlign: 'middle', textAlign: 'center', width: '140px' }}>
                                                        
//                                                         <span style={{ 
//                                                             fontSize: '12px', 
//                                                             fontWeight: 'bold', 
//                                                             color: badgeColor, 
//                                                             backgroundColor: badgeBg,
//                                                             textTransform:"uppercase"
//                                                         }}>
//                                                             {badgeText}
//                                                         </span>
//                                                     </td>

//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                   )}
//                                 </Draggable>
//                               );
//                           }