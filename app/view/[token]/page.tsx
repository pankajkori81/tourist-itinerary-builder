// // ══════════════════════════════════════════════════════════════
// // FILE: app/view/[token]/page.tsx
// // PURPOSE: Public client-facing itinerary view page
// //          NO login required — token is the only key
// //          Client can view itinerary + approve/request changes
// // ══════════════════════════════════════════════════════════════

// "use client";

// import { useState, useEffect } from "react";
// import { useParams }           from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   MapPin, Calendar, Users, CheckCircle2,
//   Clock, MessageSquare, Loader2, AlertCircle,
//   ChevronDown, ChevronUp, Plane, Hotel,
//   Utensils, Car, Star, Globe, Send,
//   ThumbsUp, ThumbsDown, XCircle, Info
// } from "lucide-react";

// // ── Types ──────────────────────────────────────────────────────
// interface DayItem {
//   type       : string;
//   name       : string;
//   description: string;
//   isOptional : boolean;
//   isIncluded : boolean;
//   hotelName  : string;
//   roomType   : string;
//   starRating : number | null;
//   slot       : string;
//   duration   : string;
//   startTime  : string;
//   pickup     : string;
//   dropoff    : string;
//   vehicleType: string;
//   journeyInfo: string;
// }

// interface DayActivity {
//   dayNumber: number;
//   city     : string;
//   date     : string;
//   items    : DayItem[];
// }

// interface FixedDeparture {
//   month    : string;
//   baseMonth: string;
//   priceDBL : number;
//   priceSGL : number;
//   priceTRP : number;
//   priceQUD : number;
// }

// interface ShareInfo {
//   clientName: string;
//   expiresAt : string;
//   status    : string;
//   token     : string;
// }

// interface ItineraryData {
//   tripId           : string;
//   tripName         : string;
//   packageType      : string;
//   tripStyle        : string;
//   selectedCountries: string[];
//   routingData      : any;
//   numberOfTravelers: number;
//   dayWiseActivities: DayActivity[];
//   fixedDepartures  : FixedDeparture[];
//   finalSellPrice   : number;
//   selectedCurrency : string;
//   seasonStartDate  : string;
//   seasonEndDate    : string;
//   shareInfo        : ShareInfo;
// }

// // ── Helpers ────────────────────────────────────────────────────
// const fmt = (n: number, currency = "USD") =>
//   new Intl.NumberFormat("en-US", {
//     style   : "currency",
//     currency,
//     maximumFractionDigits: 0,
//   }).format(n);

// const ITEM_ICON: Record<string, React.ReactNode> = {
//   STAY      : <Hotel    size={16} className="text-purple-600" />,
//   ACTIVITY  : <Star     size={16} className="text-amber-500"  />,
//   TRANSPORT : <Car      size={16} className="text-blue-600"   />,
//   MEAL      : <Utensils size={16} className="text-orange-500" />,
//   FLIGHT    : <Plane    size={16} className="text-sky-600"    />,
// };

// const ITEM_BG: Record<string, string> = {
//   STAY      : "bg-purple-50  border-purple-100",
//   ACTIVITY  : "bg-amber-50   border-amber-100",
//   TRANSPORT : "bg-blue-50    border-blue-100",
//   MEAL      : "bg-orange-50  border-orange-100",
//   FLIGHT    : "bg-sky-50     border-sky-100",
// };

// // ── ERROR SCREEN ───────────────────────────────────────────────
// function ErrorScreen({
//   code, message
// }: { code: string; message: string }) {

//   const config: Record<string,{
//     icon: React.ReactNode; title: string; color: string; bg: string;
//   }> = {
//     NOT_FOUND   : { icon:<XCircle   size={48}/>, title:"Link Not Found",   color:"text-slate-500",  bg:"bg-slate-100"  },
//     DEACTIVATED : { icon:<XCircle   size={48}/>, title:"Link Deactivated", color:"text-red-500",    bg:"bg-red-50"     },
//     EXPIRED     : { icon:<Clock     size={48}/>, title:"Link Expired",     color:"text-amber-500",  bg:"bg-amber-50"   },
//     DEFAULT     : { icon:<AlertCircle size={48}/>, title:"Error",          color:"text-slate-500",  bg:"bg-slate-100"  },
//   };

//   const cfg = config[code] ?? config.DEFAULT;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
//       <motion.div
//         initial={{ opacity:0, scale:0.95 }}
//         animate={{ opacity:1, scale:1 }}
//         className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center"
//       >
//         <div className={`w-20 h-20 ${cfg.bg} rounded-full flex items-center justify-center mx-auto mb-6 ${cfg.color}`}>
//           {cfg.icon}
//         </div>
//         <h2 className="text-2xl font-black text-slate-800 mb-3">{cfg.title}</h2>
//         <p className="text-slate-500 text-base leading-relaxed mb-8">{message}</p>
//         <div className="bg-slate-50 rounded-2xl p-4">
//           <p className="text-sm text-slate-500 font-semibold">Need help?</p>
//           <p className="text-blue-600 font-bold text-sm mt-1">
//             Sandeep@TravDek.com
//           </p>
//           <p className="text-slate-500 text-sm">+1 650 759 4331</p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// // ── MAIN PAGE ──────────────────────────────────────────────────
// export default function ClientViewPage() {
//   const params = useParams();
//   const token  = params?.token as string;

//   // ── State ──
//   const [data,           setData]           = useState<ItineraryData | null>(null);
//   const [isLoading,      setIsLoading]      = useState(true);
//   const [error,          setError]          = useState<{code:string;message:string} | null>(null);
//   const [selectedMonth,  setSelectedMonth]  = useState<string>("");
//   const [expandedDays,   setExpandedDays]   = useState<Set<number>>(new Set([1]));
//   const [showResponse,   setShowResponse]   = useState(false);
//   const [responseAction, setResponseAction] = useState<"approved"|"changes_requested"|null>(null);
//   const [clientMessage,  setClientMessage]  = useState("");
//   const [clientName,     setClientName]     = useState("");
//   const [isSubmitting,   setIsSubmitting]   = useState(false);
//   const [submitted,      setSubmitted]      = useState(false);
//   const [submitMessage,  setSubmitMessage]  = useState("");

//   // ── Fetch itinerary by token ──
//   useEffect(() => {
//     if (!token) return;
//     (async () => {
//       setIsLoading(true);
//       try {
//         const res  = await fetch(`/api/share/${token}`);
//         const json = await res.json();

//         if (!json.success) {
//           setError({ code: json.code || "DEFAULT", message: json.message });
//           return;
//         }

//         setData(json.data);
//         // Default to first available month
//         if (json.data.fixedDepartures?.length > 0) {
//           setSelectedMonth(json.data.fixedDepartures[0].month);
//         }
//         // Pre-fill client name if provided
//         if (json.data.shareInfo?.clientName) {
//           setClientName(json.data.shareInfo.clientName);
//         }
//         // If already responded
//         if (["approved","changes_requested"].includes(json.data.shareInfo?.status)) {
//           setSubmitted(true);
//           setSubmitMessage(
//             json.data.shareInfo.status === "approved"
//               ? "You have already approved this itinerary. Your advisor will contact you soon."
//               : "Your change request has already been submitted."
//           );
//         }
//       } catch (e) {
//         setError({ code: "DEFAULT", message: "Failed to load itinerary. Please try again." });
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, [token]);

//   // ── Toggle day expansion ──
//   const toggleDay = (dayNum: number) => {
//     setExpandedDays(prev => {
//       const next = new Set(prev);
//       next.has(dayNum) ? next.delete(dayNum) : next.add(dayNum);
//       return next;
//     });
//   };

//   // ── Get selected pricing ──
//   const selectedPrice = data?.fixedDepartures?.find(
//     d => d.month === selectedMonth
//   );

//   // ── Submit response ──
//   const handleSubmit = async () => {
//     if (!responseAction) return;
//     if (responseAction === "changes_requested" && !clientMessage.trim()) {
//       alert("Please describe the changes you'd like.");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const res  = await fetch(`/api/share/${token}/respond`, {
//         method  : "POST",
//         headers : { "Content-Type": "application/json" },
//         body    : JSON.stringify({
//           action        : responseAction,
//           clientMessage : clientMessage.trim(),
//           selectedMonth,
//           selectedPax   : data?.numberOfTravelers,
//           clientName    : clientName.trim(),
//         }),
//       });
//       const json = await res.json();
//       if (json.success) {
//         setSubmitted(true);
//         setSubmitMessage(json.message);
//         setShowResponse(false);
//       } else {
//         alert(json.message || "Failed to submit. Please try again.");
//       }
//     } catch (e) {
//       alert("Network error. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ── Night count ──
//   const totalNights = (data?.routingData?.routes || [])
//     .reduce((sum: number, r: any) => sum + (r.nights || 0), 0);

//   // ─────────────────────────────────────────────────────────────
//   if (isLoading) return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
//       <div className="flex flex-col items-center gap-4">
//         <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
//           <Plane className="text-white animate-pulse" size={28}/>
//         </div>
//         <p className="text-slate-500 text-sm font-semibold flex items-center gap-2">
//           <Loader2 size={14} className="animate-spin text-blue-600"/>
//           Loading your itinerary...
//         </p>
//       </div>
//     </div>
//   );

//   if (error) return <ErrorScreen code={error.code} message={error.message}/>;
//   if (!data)  return <ErrorScreen code="DEFAULT" message="Something went wrong."/>;

//   // ─────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

//       {/* ── TOPBAR ── */}
//       <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
//         <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-black text-sm">T</span>
//             </div>
//             <span className="font-black text-slate-800 text-base">TRAVDEK</span>
//           </div>
//           <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
//             <Info size={13}/>
//             <span>
//               Expires{" "}
//               {new Date(data.shareInfo.expiresAt).toLocaleDateString("en-US",{
//                 month:"short", day:"numeric", year:"numeric"
//               })}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

//         {/* ── HERO SECTION ── */}
//         <motion.div
//           initial={{ opacity:0, y:-12 }}
//           animate={{ opacity:1, y:0 }}
//           className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200"
//         >
//           {data.shareInfo.clientName && (
//             <p className="text-blue-200 text-sm font-semibold mb-2">
//               Prepared for {data.shareInfo.clientName}
//             </p>
//           )}
//           <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
//             {data.tripName}
//           </h1>
//           <div className="flex flex-wrap items-center gap-3 mt-4">
//             {data.selectedCountries.length > 0 && (
//               <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold">
//                 <Globe size={13}/> {data.selectedCountries.join(" · ")}
//               </span>
//             )}
//             {totalNights > 0 && (
//               <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold">
//                 <Calendar size={13}/> {totalNights+1} Days / {totalNights} Nights
//               </span>
//             )}
//             {data.numberOfTravelers > 0 && (
//               <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold">
//                 <Users size={13}/> {data.numberOfTravelers} Travelers
//               </span>
//             )}
//           </div>
//         </motion.div>

//         {/* ── PRICING MONTH SELECTOR ── */}
//         {data.fixedDepartures?.length > 0 && (
//           <motion.div
//             initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
//             transition={{ delay:0.1 }}
//             className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
//           >
//             <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
//               <Calendar size={17} className="text-blue-600"/>
//               Select Your Travel Month
//             </h3>

//             {/* Month pills */}
//             <div className="flex flex-wrap gap-2 mb-5">
//               {data.fixedDepartures.map(dep => (
//                 <button key={dep.month}
//                   onClick={() => setSelectedMonth(dep.month)}
//                   className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
//                     selectedMonth === dep.month
//                       ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
//                       : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300"
//                   }`}
//                 >
//                   {dep.month}
//                   {dep.priceDBL > 0 && (
//                     <span className={`ml-2 text-xs font-semibold ${
//                       selectedMonth === dep.month ? "text-blue-100" : "text-slate-400"
//                     }`}>
//                       {fmt(dep.priceDBL, data.selectedCurrency)}/pp
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>

//             {/* Price summary */}
//             {selectedPrice && selectedPrice.priceDBL > 0 && (
//               <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {selectedPrice.priceDBL > 0 && (
//                     <div className="text-center">
//                       <p className="text-xs text-slate-500 font-semibold mb-1">Twin/Double</p>
//                       <p className="text-lg font-black text-blue-600">
//                         {fmt(selectedPrice.priceDBL, data.selectedCurrency)}
//                       </p>
//                       <p className="text-[10px] text-slate-400">per person</p>
//                     </div>
//                   )}
//                   {selectedPrice.priceSGL > 0 && (
//                     <div className="text-center">
//                       <p className="text-xs text-slate-500 font-semibold mb-1">Single</p>
//                       <p className="text-lg font-black text-indigo-600">
//                         {fmt(selectedPrice.priceSGL, data.selectedCurrency)}
//                       </p>
//                       <p className="text-[10px] text-slate-400">per person</p>
//                     </div>
//                   )}
//                   {selectedPrice.priceTRP > 0 && (
//                     <div className="text-center">
//                       <p className="text-xs text-slate-500 font-semibold mb-1">Triple</p>
//                       <p className="text-lg font-black text-purple-600">
//                         {fmt(selectedPrice.priceTRP, data.selectedCurrency)}
//                       </p>
//                       <p className="text-[10px] text-slate-400">per person</p>
//                     </div>
//                   )}
//                   {/* Total */}
//                   <div className="text-center bg-blue-600 rounded-xl p-3">
//                     <p className="text-xs text-blue-100 font-semibold mb-1">
//                       Total ({data.numberOfTravelers} pax)
//                     </p>
//                     <p className="text-lg font-black text-white">
//                       {fmt(selectedPrice.priceDBL * data.numberOfTravelers, data.selectedCurrency)}
//                     </p>
//                     <p className="text-[10px] text-blue-200">all inclusive</p>
//                   </div>
//                 </div>
//                 <p className="text-[11px] text-slate-400 text-center mt-3 font-semibold">
//                   * Prices are per person and may vary. Contact your advisor for final confirmation.
//                 </p>
//               </div>
//             )}
//           </motion.div>
//         )}

//         {/* ── ITINERARY DETAILS ── */}
//         <motion.div
//           initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
//           transition={{ delay:0.15 }}
//           className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
//         >
//           <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
//             <h3 className="text-base font-bold text-slate-800">
//               📋 Itinerary Details
//             </h3>
//             <p className="text-xs text-slate-400 mt-0.5">
//               Day-by-day plan — click any day to expand
//             </p>
//           </div>

//           <div className="divide-y divide-slate-100">
//             {data.dayWiseActivities.map((day, idx) => {
//               const isExpanded = expandedDays.has(day.dayNumber);
//               return (
//                 <div key={day.dayNumber}>
//                   {/* Day Header */}
//                   <button
//                     onClick={() => toggleDay(day.dayNumber)}
//                     className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors text-left"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
//                         <span className="text-white font-black text-sm">
//                           {day.dayNumber}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="font-bold text-slate-800 text-sm">
//                           Day {day.dayNumber} · {day.city}
//                         </p>
//                         {day.date && (
//                           <p className="text-xs text-slate-400 font-semibold mt-0.5">
//                             {new Date(day.date).toLocaleDateString("en-US",{
//                               weekday:"short", month:"short", day:"numeric"
//                             })}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
//                         {day.items?.length || 0} items
//                       </span>
//                       {isExpanded
//                         ? <ChevronUp   size={16} className="text-slate-400"/>
//                         : <ChevronDown size={16} className="text-slate-400"/>
//                       }
//                     </div>
//                   </button>

//                   {/* Day Content */}
//                   <AnimatePresence>
//                     {isExpanded && (
//                       <motion.div
//                         initial={{ height:0, opacity:0 }}
//                         animate={{ height:"auto", opacity:1 }}
//                         exit={{ height:0, opacity:0 }}
//                         transition={{ duration:0.2 }}
//                         className="overflow-hidden"
//                       >
//                         <div className="px-6 pb-4 space-y-3">
//                           {(day.items || []).length === 0 ? (
//                             <p className="text-xs text-slate-400 py-4 text-center">
//                               No items for this day
//                             </p>
//                           ) : (
//                             (day.items || []).map((item, iIdx) => (
//                               <div key={iIdx}
//                                 className={`flex gap-3 p-4 rounded-xl border ${
//                                   ITEM_BG[item.type] || "bg-slate-50 border-slate-100"
//                                 }`}
//                               >
//                                 {/* Icon */}
//                                 <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-white">
//                                   {ITEM_ICON[item.type] || <Star size={16}/>}
//                                 </div>

//                                 {/* Content */}
//                                 <div className="flex-1 min-w-0">
//                                   <div className="flex items-start justify-between gap-2">
//                                     <div>
//                                       <p className="text-sm font-black text-slate-800 leading-tight">
//                                         {item.name || item.hotelName}
//                                       </p>
//                                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
//                                         {item.type}
//                                       </span>
//                                     </div>
//                                     <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
//                                       item.isOptional
//                                         ? "bg-amber-100 text-amber-700"
//                                         : "bg-emerald-100 text-emerald-700"
//                                     }`}>
//                                       {item.isOptional ? "OPTIONAL" : "INCLUDED"}
//                                     </span>
//                                   </div>

//                                   {item.description && (
//                                     <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
//                                       {item.description}
//                                     </p>
//                                   )}

//                                   {/* Details row */}
//                                   <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
//                                     {item.slot && (
//                                       <span className="text-[11px] text-slate-400 font-semibold">
//                                         🕐 {item.slot}
//                                       </span>
//                                     )}
//                                     {item.duration && (
//                                       <span className="text-[11px] text-slate-400 font-semibold">
//                                         ⏱ {item.duration}
//                                       </span>
//                                     )}
//                                     {item.roomType && (
//                                       <span className="text-[11px] text-slate-400 font-semibold">
//                                         🛏 {item.roomType}
//                                       </span>
//                                     )}
//                                     {item.starRating && (
//                                       <span className="text-[11px] text-amber-500 font-bold">
//                                         {"★".repeat(item.starRating)}
//                                       </span>
//                                     )}
//                                     {item.pickup && (
//                                       <span className="text-[11px] text-slate-400 font-semibold">
//                                         📍 {item.pickup} → {item.dropoff}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             ))
//                           )}
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               );
//             })}
//           </div>
//         </motion.div>

//         {/* ── RESPONSE SECTION ── */}
//         {submitted ? (
//           <motion.div
//             initial={{ opacity:0, scale:0.95 }}
//             animate={{ opacity:1, scale:1 }}
//             className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center"
//           >
//             <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4"/>
//             <h3 className="text-xl font-black text-emerald-800 mb-2">
//               Response Submitted!
//             </h3>
//             <p className="text-emerald-700 text-sm leading-relaxed">
//               {submitMessage}
//             </p>
//           </motion.div>
//         ) : (
//           <motion.div
//             initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
//             transition={{ delay:0.2 }}
//             className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5"
//           >
//             <div>
//               <h3 className="text-base font-bold text-slate-800 mb-1">
//                 Your Response
//               </h3>
//               <p className="text-xs text-slate-400 font-semibold">
//                 Please review the itinerary above and let us know your decision
//               </p>
//             </div>

//             {/* Action Buttons */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               <motion.button
//                 whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
//                 onClick={() => {
//                   setResponseAction("approved");
//                   setShowResponse(true);
//                 }}
//                 className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-bold text-sm transition-all ${
//                   responseAction === "approved"
//                     ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200"
//                     : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400"
//                 }`}
//               >
//                 <ThumbsUp size={18}/>
//                 ✅ I Approve This Itinerary
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
//                 onClick={() => {
//                   setResponseAction("changes_requested");
//                   setShowResponse(true);
//                 }}
//                 className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-bold text-sm transition-all ${
//                   responseAction === "changes_requested"
//                     ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-200"
//                     : "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400"
//                 }`}
//               >
//                 <ThumbsDown size={18}/>
//                 📝 Request Changes
//               </motion.button>
//             </div>

//             {/* Response Form */}
//             <AnimatePresence>
//               {showResponse && responseAction && (
//                 <motion.div
//                   initial={{ opacity:0, height:0 }}
//                   animate={{ opacity:1, height:"auto" }}
//                   exit={{ opacity:0, height:0 }}
//                   transition={{ duration:0.2 }}
//                   className="space-y-4 overflow-hidden"
//                 >
//                   {/* Client Name */}
//                   <div>
//                     <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">
//                       Your Name
//                     </label>
//                     <input type="text"
//                       value={clientName}
//                       onChange={e => setClientName(e.target.value)}
//                       placeholder="Your full name"
//                       className="w-full px-4 py-3 text-sm border border-slate-200 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
//                     />
//                   </div>

//                   {/* Message */}
//                   <div>
//                     <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">
//                       {responseAction === "approved"
//                         ? "Any special requests? (optional)"
//                         : "What changes would you like? *"}
//                     </label>
//                     <textarea
//                       rows={4}
//                       value={clientMessage}
//                       onChange={e => setClientMessage(e.target.value)}
//                       placeholder={
//                         responseAction === "approved"
//                           ? "e.g. Dietary requirements, room preferences..."
//                           : "Please describe the changes you'd like to make..."
//                       }
//                       className="w-full px-4 py-3 text-sm border border-slate-200 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
//                     />
//                   </div>

//                   {/* Submit Button */}
//                   <motion.button
//                     whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
//                     onClick={handleSubmit}
//                     disabled={isSubmitting}
//                     className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60 shadow-lg ${
//                       responseAction === "approved"
//                         ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
//                         : "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
//                     }`}
//                   >
//                     {isSubmitting
//                       ? <><Loader2 size={16} className="animate-spin"/> Submitting...</>
//                       : <><Send size={16}/>
//                           {responseAction === "approved"
//                             ? "Confirm Approval"
//                             : "Submit Change Request"}
//                         </>
//                     }
//                   </motion.button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         )}

//         {/* ── CONTACT FOOTER ── */}
//         <motion.div
//           initial={{ opacity:0 }} animate={{ opacity:1 }}
//           transition={{ delay:0.3 }}
//           className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center"
//         >
//           <p className="text-sm text-slate-500 font-semibold mb-3">
//             Questions about your itinerary?
//           </p>
//           <div className="flex flex-wrap items-center justify-center gap-4">
//             <a href="mailto:Sandeep@TravDek.com"
//               className="flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:underline">
//               📧 Sandeep@TravDek.com
//             </a>
//             <a href="tel:+16507594331"
//               className="flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:underline">
//               📞 +1 650 759 4331
//             </a>
//           </div>
//           <p className="text-[11px] text-slate-300 font-semibold mt-4">
//             Powered by Travdek · Official B2B Travel Network
//           </p>
//         </motion.div>

//       </div>
//     </div>
//   );
// }





































































// // ══════════════════════════════════════════════════════════════
// // FILE: app/view/[token]/page.tsx
// // PURPOSE: Public client-facing itinerary view
// //          EXACT same visual as preview page
// //          + Month selector + Approve/Changes form at bottom
// //          NO login required — token is the security key
// //          NO sensitive data (costs/margins never sent)
// // ══════════════════════════════════════════════════════════════

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useParams }                    from "next/navigation";
// import {
//   Loader2, AlertCircle, Clock, XCircle,
//   ThumbsUp, ThumbsDown, Send, CheckCircle2,
//   BedDouble, Bus, Camera, Car, Plane,
//   Ship, Train, Utensils
// } from "lucide-react";

// // ── Helpers (copied from your preview page) ───────────────────
// const formatDate = (dateStr?: string) => {
//   if (!dateStr) return "TBA";
//   return new Date(dateStr).toLocaleDateString("en-GB", {
//     day: "numeric", month: "short", year: "numeric"
//   });
// };

// const isItemIncluded = (status?: string) =>
//   !status || status.toLowerCase() === "included";

// // ── Transport icon (same as preview page) ─────────────────────
// const getTransportIcon = (mode?: string) => {
//   const m = (mode || "").toLowerCase();
//   if (m.includes("flight") || m.includes("air"))  return <Plane   size={20} color="#0284c7" />;
//   if (m.includes("ferry") || m.includes("ship"))  return <Ship    size={20} color="#0284c7" />;
//   if (m.includes("train") || m.includes("rail"))  return <Train   size={20} color="#0284c7" />;
//   if (m.includes("bus")   || m.includes("coach")) return <Bus     size={20} color="#0284c7" />;
//   return <Car size={20} color="#0284c7" />;
// };

// // ── Category icon (same as preview page) ──────────────────────
// const getCategoryIcon = (category: string, mode?: string) => {
//   if (category === "Stay")      return <BedDouble size={20} color="#7c3aed" />;
//   if (category === "Activity")  return <Camera   size={20} color="#0284c7" />;
//   if (category === "Meal")      return <Utensils size={20} color="#ea580c" />;
//   if (category === "Transport") return getTransportIcon(mode);
//   return null;
// };

// // ── Error screen ──────────────────────────────────────────────
// function ErrorScreen({ code, message }: { code: string; message: string }) {
//   const cfg: Record<string, { icon: React.ReactNode; title: string; bg: string; color: string }> = {
//     NOT_FOUND   : { icon: <XCircle    size={48} />, title: "Link Not Found",   bg: "#f1f5f9", color: "#64748b" },
//     DEACTIVATED : { icon: <XCircle    size={48} />, title: "Link Deactivated", bg: "#fef2f2", color: "#ef4444" },
//     EXPIRED     : { icon: <Clock      size={48} />, title: "Link Expired",     bg: "#fffbeb", color: "#f59e0b" },
//     DEFAULT     : { icon: <AlertCircle size={48} />, title: "Something Went Wrong", bg: "#f1f5f9", color: "#64748b" },
//   };
//   const c = cfg[code] ?? cfg.DEFAULT;
//   return (
//     <div style={{ minHeight: "100vh", background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
//       <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "48px", maxWidth: "420px", width: "100%", textAlign: "center" }}>
//         <div style={{ width: "80px", height: "80px", background: c.bg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: c.color }}>
//           {c.icon}
//         </div>
//         <h2 style={{ color: "#0f172a", fontSize: "22px", fontWeight: 900, margin: "0 0 12px" }}>{c.title}</h2>
//         <p style={{ color: "#64748b", fontSize: "15px", lineHeight: 1.6, margin: "0 0 32px" }}>{message}</p>
//         <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "16px" }}>
//           <p style={{ color: "#64748b", fontSize: "13px", fontWeight: 600, margin: "0 0 4px" }}>Need help?</p>
//           <p style={{ color: "#1d4ed8", fontWeight: 700, fontSize: "13px", margin: 0 }}>Sandeep@TravDek.com</p>
//           <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>+1 650 759 4331</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ════════════════════════════════════════════════════════════
// // MAIN PAGE
// // ════════════════════════════════════════════════════════════
// export default function ClientViewPage() {
//   const params = useParams();
//   const token  = params?.token as string;

//   // ── State ─────────────────────────────────────────────────
//   const [data,           setData]           = useState<any>(null);
//   const [isLoading,      setIsLoading]      = useState(true);
//   const [error,          setError]          = useState<{ code: string; message: string } | null>(null);
//   const [selectedMonth,  setSelectedMonth]  = useState<string>("");
//   const [responseAction, setResponseAction] = useState<"approved" | "changes_requested" | null>(null);
//   const [clientName,     setClientName]     = useState("");
//   const [clientMessage,  setClientMessage]  = useState("");
//   const [isSubmitting,   setIsSubmitting]   = useState(false);
//   const [submitted,      setSubmitted]      = useState(false);
//   const [submitMessage,  setSubmitMessage]  = useState("");

//   // ── Fetch itinerary ────────────────────────────────────────
//   useEffect(() => {
//     if (!token) return;
//     (async () => {
//       setIsLoading(true);
//       try {
//         const res  = await fetch(`/api/share/${token}`);
//         const json = await res.json();
//         if (!json.success) {
//           setError({ code: json.code || "DEFAULT", message: json.message });
//           return;
//         }
//         setData(json.data);
//         if (json.data.fixedDepartures?.length > 0) {
//           setSelectedMonth(json.data.fixedDepartures[0].month);
//         }
//         if (json.data.shareInfo?.clientName) {
//           setClientName(json.data.shareInfo.clientName);
//         }
//         if (["approved", "changes_requested"].includes(json.data.shareInfo?.status)) {
//           setSubmitted(true);
//           setSubmitMessage(
//             json.data.shareInfo.status === "approved"
//               ? "You have already approved this itinerary. Your advisor will be in touch soon."
//               : "Your change request has already been submitted."
//           );
//         }
//       } catch {
//         setError({ code: "DEFAULT", message: "Failed to load. Please try again." });
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, [token]);

//   // ── Derived values (same logic as preview page) ────────────
//   const routes        = data?.routingData?.routes || [];
//   const startCity     = routes.length > 0 ? routes[0].cities?.[0]?.name : "TBA";
//   const endCity       = routes.length > 0 ? routes[routes.length - 1].cities?.[0]?.name : "TBA";
//   const totalNights   = routes.reduce((acc: number, r: any) => acc + (r.nights || 0), 0);
//   const totalDays     = totalNights + 1;
//   const rawDayPlans   = (data?.dayWiseActivities || []).slice(0, totalDays);

//   const citiesWithNights = routes
//     .filter((r: any) => r.cities?.length > 0 && r.cities[0].name)
//     .map((r: any) => {
//       const names = r.cities.map((c: any) => c.name).join(" / ");
//       const n     = parseInt(r.nights) || 0;
//       return n > 0 ? `${names} (${n}N)` : names;
//     })
//     .join(" | ");

//   // ── Same getRenderableItemsForDay as preview page ──────────
//   const getRenderableItemsForDay = (dayIndex: number, currentDay: any) => {
//     const items: any[] = [];
//     currentDay.activities?.forEach((a: any) => items.push({ ...a, category: "Activity" }));
//     currentDay.transports?.forEach((t: any) => items.push({ ...t, category: "Transport" }));
//     currentDay.meals?.forEach((m: any)      => items.push({ ...m, category: "Meal" }));
//     currentDay.stays?.forEach((s: any)      => items.push({ ...s, category: "Stay", status: "Check-in" }));

//     for (let i = 0; i < dayIndex; i++) {
//       const pastDay = rawDayPlans.find((d: any) => d.dayNumber === i + 1);
//       if (pastDay?.stays) {
//         pastDay.stays.forEach((stay: any) => {
//           const stayEndIndex = i + (stay.nights || 0);
//           if (dayIndex > i && dayIndex < stayEndIndex) {
//             items.push({ ...stay, category: "Stay", status: "Residence" });
//           }
//         });
//       }
//     }
//     return items.sort((a, b) => {
//       const order: Record<string, number> = { Activity: 1, Stay: 2, Transport: 3, Meal: 4 };
//       return (order[a.category] || 5) - (order[b.category] || 5);
//     });
//   };

//   // ── Selected pricing month ─────────────────────────────────
//   const selectedDep = data?.fixedDepartures?.find((d: any) => d.month === selectedMonth);
//   const priceDBL    = selectedDep?.priceDBL || data?.finalSellPrice || 0;
//   const currency    = data?.selectedCurrency || "USD";

//   const fmt = (n: number) =>
//     new Intl.NumberFormat("en-US", {
//       style: "currency", currency, maximumFractionDigits: 0
//     }).format(n);

//   // ── Submit response ────────────────────────────────────────
//   const handleSubmit = async () => {
//     if (!responseAction) return;
//     if (responseAction === "changes_requested" && !clientMessage.trim()) {
//       alert("Please describe the changes you'd like.");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const res  = await fetch(`/api/share/${token}/respond`, {
//         method  : "POST",
//         headers : { "Content-Type": "application/json" },
//         body    : JSON.stringify({
//           action        : responseAction,
//           clientMessage : clientMessage.trim(),
//           selectedMonth,
//           selectedPax   : data?.numberOfTravelers,
//           clientName    : clientName.trim(),
//         }),
//       });
//       const json = await res.json();
//       if (json.success) {
//         setSubmitted(true);
//         setSubmitMessage(json.message);
//       } else {
//         alert(json.message || "Failed. Please try again.");
//       }
//     } catch {
//       alert("Network error. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ── Loading ────────────────────────────────────────────────
//   if (isLoading) return (
//     <div style={{ minHeight: "100vh", background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
//       <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
//         <div style={{ width: "64px", height: "64px", background: "#2563EB", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//           <Plane style={{ color: "#fff" }} size={28} />
//         </div>
//         <p style={{ color: "#64748b", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
//           <Loader2 size={14} style={{ color: "#2563EB" }} />
//           Loading your itinerary...
//         </p>
//       </div>
//     </div>
//   );

//   if (error) return <ErrorScreen code={error.code} message={error.message} />;
//   if (!data)  return <ErrorScreen code="DEFAULT" message="Something went wrong." />;

//   // ────────────────────────────────────────────────────────────
//   return (
//     <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Arial, sans-serif" }}>

//       {/* ══════════════════════════════════════════════════════
//           SIMPLE TOPBAR (replaces admin toolbar)
//       ══════════════════════════════════════════════════════ */}
//       <div style={{
//         background: "#fff",
//         borderBottom: "1px solid #e5e7eb",
//         padding: "12px 24px",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         position: "sticky",
//         top: 0,
//         zIndex: 50,
//         boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
//       }}>
//         {/* Logo */}
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <div style={{
//             width: "32px", height: "32px", background: "#2563EB",
//             borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center"
//           }}>
//             <span style={{ color: "#fff", fontWeight: 900, fontSize: "14px" }}>T</span>
//           </div>
//           <span style={{ fontWeight: 900, color: "#0f172a", fontSize: "16px", letterSpacing: "0.5px" }}>
//             TRAVDEK
//           </span>
//         </div>

//         {/* Expiry info */}
//         <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
//           <Clock size={13} />
//           <span>
//             Expires {new Date(data.shareInfo.expiresAt).toLocaleDateString("en-US", {
//               month: "short", day: "numeric", year: "numeric"
//             })}
//           </span>
//         </div>
//       </div>

//       {/* ══════════════════════════════════════════════════════
//           MAIN CONTENT WRAPPER
//       ══════════════════════════════════════════════════════ */}
//       <div style={{ padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>

//         {/* White page container — same max-width as preview */}
//         <div style={{
//           width: "100%",
//           maxWidth: "1100px",
//           background: "#fff",
//           boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
//           padding: "0"
//         }}>

//           {/* ════════════════════════════════════════════════
//               HEADER SECTION — EXACT COPY FROM PREVIEW PAGE
//           ════════════════════════════════════════════════ */}
//           <div style={{ borderBottom: "2px solid #e5e7eb", padding: "32px 24px", backgroundColor: "#fff" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>

//               {/* LEFT: Trip Name & Duration */}
//               <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: "16px", textTransform: "uppercase" }}>
//                 <h1 style={{ color: "#001d6a", fontSize: "32px", fontWeight: "bold", margin: "0 0 4px 0", lineHeight: 1.2 }}>
//                   {data.tripName || "Your Itinerary"}
//                 </h1>
//                 <div style={{ fontSize: "20px", fontWeight: "bold", color: "#001d6a" }}>
//                   {totalDays} Days | {totalNights} Nights
//                 </div>
//               </div>

//               {/* RIGHT: Logo + Contact */}
//               <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flexShrink: 0 }}>
//                 {/* Logo */}
//                 <div style={{ height: "50px", marginBottom: "14px" }}>
//                   <img
//                     src="/logo.png"
//                     alt="Travdek Logo"
//                     style={{ height: "100%", objectFit: "contain", objectPosition: "left center" }}
//                     onError={(e) => { e.currentTarget.style.display = "none"; }}
//                   />
//                 </div>
//                 {/* Contact Details — same as preview */}
//                 <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", minWidth: "240px" }}>
//                   {[
//                     { icon: "✉️", label: "Email:", value: "Sandeep@TravDek.com",              color: "#001d6a" },
//                     { icon: "📞", label: "Tel:",   value: "+1 650 759 4331",                   color: "#001d6a" },
//                     { icon: "🌐", label: "Web:",   value: "www.TravDek.com",                   color: "#001d6a" },
//                     { icon: "📍", label: "Add:",   value: "750 Alma lane #4459 Foster City, CA 94404 USA", color: "#001d6a" },
//                   ].map(row => (
//                     <div key={row.label} style={{ display: "flex", alignItems: "flex-start", gap: "6px", lineHeight: "18px" }}>
//                       <span style={{ width: "18px", textAlign: "center" }}>{row.icon}</span>
//                       <span style={{ width: "42px", color: "#121214", fontWeight: "bold" }}>{row.label}</span>
//                       <span style={{ color: row.color, fontWeight: "bold" }}>{row.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* DETAILS GRID — EXACT COPY from preview */}
//             <div style={{ borderTop: "1px solid #636363", borderBottom: "1px solid #636363" }}>
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", fontSize: "12px" }}>

//                 {/* Ref ID & Travelers */}
//                 <div style={{ backgroundColor: "#f9fafb", padding: "8px", fontWeight: "bold", borderRight: "1px solid #636363", borderBottom: "1px solid #636363" }}>Ref. ID:</div>
//                 <div style={{ color: "#1d4ed8", padding: "8px", fontWeight: "bold", borderRight: "1px solid #636363", borderBottom: "1px solid #636363" }}>{data.tripId}</div>
//                 <div style={{ backgroundColor: "#f9fafb", padding: "8px", fontWeight: "bold", borderRight: "1px solid #636363", borderBottom: "1px solid #636363" }}>Travelers:</div>
//                 <div style={{ color: "#1d4ed8", padding: "8px", fontWeight: "bold", borderBottom: "1px solid #636363" }}>{data.numberOfTravelers} Pax</div>

//                 {/* Release Date & Trip Validity */}
//                 <div style={{ backgroundColor: "#f9fafb", padding: "8px", fontWeight: "bold", borderRight: "1px solid #636363", borderBottom: "1px solid #636363" }}>Release Date:</div>
//                 <div style={{ color: "#1d4ed8", padding: "8px", fontWeight: "bold", borderRight: "1px solid #636363", borderBottom: "1px solid #636363" }}>{formatDate(new Date().toISOString())}</div>
//                 <div style={{ backgroundColor: "#f9fafb", padding: "8px", fontWeight: "bold", borderRight: "1px solid #636363", borderBottom: "1px solid #636363" }}>Trip Validity:</div>
//                 <div style={{ color: "#1d4ed8", padding: "8px", fontWeight: "bold", borderBottom: "1px solid #636363" }}>
//                   {formatDate(data.seasonStartDate || data.routingData?.startDate)}
//                   {" to "}
//                   {formatDate(data.seasonEndDate   || data.routingData?.endDate)}
//                 </div>

//                 {/* Country */}
//                 <div style={{ backgroundColor: "#f9fafb", padding: "8px", fontWeight: "bold", borderRight: "1px solid #636363", borderBottom: "1px solid #636363" }}>Country:</div>
//                 <div style={{ color: "#1d4ed8", padding: "8px", fontWeight: "bold", borderBottom: "1px solid #636363", textTransform: "uppercase", gridColumn: "span 3" }}>
//                   {data.selectedCountries?.join(", ")}
//                 </div>

//                 {/* Cities */}
//                 <div style={{ backgroundColor: "#f9fafb", padding: "8px", fontWeight: "bold", borderRight: "1px solid #636363", borderBottom: "1px solid #636363" }}>Cities:</div>
//                 <div style={{ color: "#1d4ed8", padding: "8px", fontWeight: "bold", borderBottom: "1px solid #636363", textTransform: "uppercase", gridColumn: "span 3" }}>
//                   {citiesWithNights}
//                 </div>

//                 {/* Start/End & Route */}
//                 <div style={{ backgroundColor: "#f9fafb", padding: "8px", fontWeight: "bold", borderRight: "1px solid #636363", borderBottom: "1px solid #636363" }}>Start / End:</div>
//                 <div style={{ color: "#1d4ed8", padding: "8px", fontWeight: "bold", borderRight: "1px solid #636363", borderBottom: "1px solid #636363" }}>{startCity} / {endCity}</div>
//                 <div style={{ backgroundColor: "#f9fafb", padding: "8px", fontWeight: "bold", borderRight: "1px solid #636363", borderBottom: "1px solid #636363" }}>Route:</div>
//                 <div style={{ color: "#1d4ed8", padding: "8px", fontWeight: "bold", borderBottom: "1px solid #636363" }}>
//                   {data.selectedCountries?.length || 1} Country | {routes.length} Cities
//                 </div>

//                 {/* Type & Package */}
//                 <div style={{ backgroundColor: "#f9fafb", padding: "8px", fontWeight: "bold", borderRight: "1px solid #636363" }}>Type:</div>
//                 <div style={{ color: "#1d4ed8", padding: "8px", fontWeight: "bold", textTransform: "uppercase", borderRight: "1px solid #636363" }}>{data.tripStyle || "TBA"}</div>
//                 <div style={{ backgroundColor: "#f9fafb", padding: "8px", fontWeight: "bold", borderRight: "1px solid #636363" }}>Package:</div>
//                 <div style={{ color: "#1d4ed8", padding: "8px", fontWeight: "bold", textTransform: "uppercase" }}>{data.packageType || "LAND"}</div>

//               </div>
//             </div>
//           </div>

//           {/* ════════════════════════════════════════════════
//               ITINERARY TABLE — EXACT COPY from preview page
//           ════════════════════════════════════════════════ */}
//           <div style={{ padding: "32px 24px 0" }}>

//             {/* Red heading — same as preview */}
//             <h3 style={{
//               color: "#dc2626",
//               fontWeight: "bold",
//               textTransform: "uppercase",
//               textDecoration: "underline",
//               marginBottom: "16px",
//               fontSize: "16px",
//             }}>
//               Itinerary Details
//             </h3>

//             {/* Table — same structure as preview */}
//             <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #6b6b6b", fontSize: "14px", tableLayout: "fixed" }}>
//               <colgroup>
//                 <col style={{ width: "200px" }} />
//                 <col style={{ width: "auto" }} />
//                 <col style={{ width: "140px" }} />
//               </colgroup>

//               {rawDayPlans.map((day: any, idx: number) => {
//                 const items = getRenderableItemsForDay(idx, day);

//                 const prevCity       = idx > 0 ? rawDayPlans[idx - 1].city : null;
//                 const isCityChange   = prevCity && prevCity !== day.city;
//                 const displayCityName= isCityChange ? `${prevCity} - ${day.city}` : day.city;

//                 let nightCount = 0;
//                 if (!prevCity || isCityChange) {
//                   const route = routes.find((r: any) => r.cities?.some((c: any) => c.name === day.city));
//                   if (route) nightCount = route.nights;
//                 }
//                 const displayNights  = nightCount > 0 ? ` (${nightCount}N)` : "";
//                 const finalDayHeader = `${displayCityName}${displayNights}`.toUpperCase();

//                 return (
//                   <tbody key={day.dayNumber} style={{ outline: "1px solid #6b6b6b" }}>

//                     {/* DAY HEADER ROW — same as preview */}
//                     <tr style={{ backgroundColor: "#fefce8" }}>
//                       <td colSpan={3} style={{
//                         padding: "12px 16px",
//                         border: "1px solid #6b6b6b",
//                         borderTop: idx > 0 ? "2px solid #6b6b6b" : "1px solid #6b6b6b"
//                       }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
//                           <span style={{ color: "#991b1b", fontWeight: "bold", fontSize: "16px" }}>
//                             DAY {String(day.dayNumber).padStart(2, "0")}
//                           </span>
//                           <span style={{ color: "#991b1b", fontWeight: "bold", fontSize: "16px" }}>
//                             {finalDayHeader}
//                           </span>
//                         </div>
//                       </td>
//                     </tr>

//                     {/* ITEMS — same cell rendering as preview */}
//                     {items.map((item: any, iIdx: number) => {
//                       const included = isItemIncluded(item.inclusionType);

//                       // ── STAY row ───────────────────────
//                       if (item.category === "Stay") {
//                         const isResidence = item.status === "Residence";
//                         return (
//                           <tr key={iIdx} style={{ borderBottom: "1px solid #d1d5db" }}>
//                             {/* Category cell */}
//                             <td style={{ padding: "12px 16px", border: "1px solid #6b6b6b", verticalAlign: "top" }}>
//                               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
//                                 <div style={{
//                                   width: "36px", height: "36px", background: "#f3e8ff",
//                                   borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center"
//                                 }}>
//                                   <BedDouble size={20} color="#7c3aed" />
//                                 </div>
//                                 <span style={{ fontSize: "11px", fontWeight: "bold", color: "#7c3aed", textTransform: "uppercase", textAlign: "center" }}>
//                                   {isResidence ? "HOTEL" : "HOTEL"}
//                                 </span>
//                               </div>
//                             </td>

//                             {/* Details cell */}
//                             <td style={{ padding: "12px 16px", border: "1px solid #6b6b6b", verticalAlign: "top" }}>
//                               {isResidence ? (
//                                 <p style={{ fontStyle: "italic", color: "#374151", margin: "0 0 4px" }}>
//                                   Continuing stay at {item.hotelName}.
//                                 </p>
//                               ) : (
//                                 <div style={{ fontWeight: "bold", color: "#111827", fontSize: "14px", marginBottom: "4px" }}>
//                                   {item.hotelName}
//                                   {item.starRating && (
//                                     <span style={{ color: "#f59e0b", marginLeft: "8px" }}>
//                                       {"★".repeat(item.starRating)} {item.starRating}
//                                     </span>
//                                   )}
//                                 </div>
//                               )}
//                               {item.roomType && (
//                                 <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>
//                                   Room: {item.roomType}
//                                 </p>
//                               )}
//                               {!isResidence && item.checkIn && (
//                                 <p style={{ color: "#6b7280", fontSize: "12px", margin: "4px 0 0" }}>
//                                   In: {item.checkIn} &nbsp; Out: {item.checkOut}
//                                 </p>
//                               )}
//                             </td>

//                             {/* Inclusion cell */}
//                             <td style={{ padding: "12px 16px", border: "1px solid #6b6b6b", verticalAlign: "top", textAlign: "right", fontWeight: "bold", fontSize: "12px", color: included ? "#374151" : "#9ca3af" }}>
//                               {item.inclusionType?.toUpperCase() || "INCLUDED"}
//                             </td>
//                           </tr>
//                         );
//                       }

//                       // ── TRANSPORT row ──────────────────
//                       if (item.category === "Transport") {
//                         const isFerry    = (item.mode || "").toLowerCase().includes("ferry") || (item.mode || "").toLowerCase().includes("ship");
//                         const isFlight   = (item.mode || "").toLowerCase().includes("flight") || (item.mode || "").toLowerCase().includes("air");

//                         return (
//                           <tr key={iIdx} style={{ borderBottom: "1px solid #d1d5db" }}>
//                             <td style={{ padding: "12px 16px", border: "1px solid #6b6b6b", verticalAlign: "top" }}>
//                               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
//                                 <div style={{
//                                   width: "36px", height: "36px", background: "#eff6ff",
//                                   borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center"
//                                 }}>
//                                   {getCategoryIcon("Transport", item.mode)}
//                                 </div>
//                                 <span style={{ fontSize: "11px", fontWeight: "bold", color: "#0284c7", textTransform: "uppercase", textAlign: "center" }}>
//                                   TRANSPORT
//                                 </span>
//                               </div>
//                             </td>
//                             <td style={{ padding: "12px 16px", border: "1px solid #6b6b6b", verticalAlign: "top" }}>
//                               <div style={{ fontWeight: "bold", color: "#111827", fontSize: "14px", marginBottom: "8px" }}>
//                                 {item.vehicleType}
//                               </div>
//                               {/* Ferry layout */}
//                               {isFerry ? (
//                                 <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", fontSize: "12px" }}>
//                                   <div><p style={{ color: "#6b7280", fontWeight: 600, margin: "0 0 2px", fontSize: "10px", textTransform: "uppercase" }}>SCHEDULE</p><p style={{ margin: 0, fontWeight: 600 }}>{item.departureTime} to {item.arrivalTime}</p></div>
//                                   <div><p style={{ color: "#6b7280", fontWeight: 600, margin: "0 0 2px", fontSize: "10px", textTransform: "uppercase" }}>PORTS</p><p style={{ margin: 0, fontWeight: 600 }}>{item.departurePort} → {item.arrivalPort}</p></div>
//                                   <div><p style={{ color: "#6b7280", fontWeight: 600, margin: "0 0 2px", fontSize: "10px", textTransform: "uppercase" }}>DURATION</p><p style={{ margin: 0, fontWeight: 600 }}>{item.duration}</p></div>
//                                   <div><p style={{ color: "#6b7280", fontWeight: 600, margin: "0 0 2px", fontSize: "10px", textTransform: "uppercase" }}>DECK INFO</p><p style={{ margin: 0, fontWeight: 600 }}>{item.deckClass || "Economy"}</p></div>
//                                 </div>
//                               ) : (
//                                 <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", fontSize: "12px" }}>
//                                   <div><p style={{ color: "#6b7280", fontWeight: 600, margin: "0 0 2px", fontSize: "10px", textTransform: "uppercase" }}>PICKUP</p><p style={{ margin: 0, fontWeight: 600 }}>{item.pickup}<br />{item.pickupTime}</p></div>
//                                   <div><p style={{ color: "#6b7280", fontWeight: 600, margin: "0 0 2px", fontSize: "10px", textTransform: "uppercase" }}>DROP-OFF</p><p style={{ margin: 0, fontWeight: 600 }}>{item.dropoff}<br />{item.dropoffTime}</p></div>
//                                   <div><p style={{ color: "#6b7280", fontWeight: 600, margin: "0 0 2px", fontSize: "10px", textTransform: "uppercase" }}>DURATION</p><p style={{ margin: 0, fontWeight: 600 }}>{item.duration}</p></div>
//                                   <div><p style={{ color: "#6b7280", fontWeight: 600, margin: "0 0 2px", fontSize: "10px", textTransform: "uppercase" }}>JOURNEY INFO</p><p style={{ margin: 0, fontWeight: 600 }}>{item.journeyInfo}</p></div>
//                                 </div>
//                               )}
//                             </td>
//                             <td style={{ padding: "12px 16px", border: "1px solid #6b6b6b", verticalAlign: "top", textAlign: "right", fontWeight: "bold", fontSize: "12px", color: included ? "#374151" : "#9ca3af" }}>
//                               {item.inclusionType?.toUpperCase() || "INCLUDED"}
//                             </td>
//                           </tr>
//                         );
//                       }

//                       // ── ACTIVITY row ───────────────────
//                       if (item.category === "Activity") {
//                         return (
//                           <tr key={iIdx} style={{ borderBottom: "1px solid #d1d5db" }}>
//                             <td style={{ padding: "12px 16px", border: "1px solid #6b6b6b", verticalAlign: "top" }}>
//                               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
//                                 <div style={{
//                                   width: "36px", height: "36px", background: "#eff6ff",
//                                   borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center"
//                                 }}>
//                                   <Camera size={20} color="#0284c7" />
//                                 </div>
//                                 <span style={{ fontSize: "11px", fontWeight: "bold", color: "#0284c7", textTransform: "uppercase", textAlign: "center" }}>
//                                   ACTIVITY
//                                 </span>
//                               </div>
//                             </td>
//                             <td style={{ padding: "12px 16px", border: "1px solid #6b6b6b", verticalAlign: "top" }}>
//                               <div style={{ fontWeight: "bold", color: "#111827", fontSize: "14px", marginBottom: "4px" }}>
//                                 {item.heading}
//                               </div>
//                               {item.description && (
//                                 <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 8px" }}>{item.description}</p>
//                               )}
//                               <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "12px", color: "#374151" }}>
//                                 {item.slot      && <span>Slot: {item.slot}</span>}
//                                 {item.duration  && <span>Duration: {item.duration}</span>}
//                                 {item.startTime && <span>Start: {item.startTime}</span>}
//                                 {item.pickup    && <span>Pickup: {item.pickup}</span>}
//                                 {item.dropoff   && <span>Drop: {item.dropoff}</span>}
//                               </div>
//                             </td>
//                             <td style={{ padding: "12px 16px", border: "1px solid #6b6b6b", verticalAlign: "top", textAlign: "right", fontWeight: "bold", fontSize: "12px", color: included ? "#374151" : "#9ca3af" }}>
//                               {item.inclusionType?.toUpperCase() || "INCLUDED"}
//                             </td>
//                           </tr>
//                         );
//                       }

//                       // ── MEAL row ───────────────────────
//                       if (item.category === "Meal") {
//                         return (
//                           <tr key={iIdx} style={{ borderBottom: "1px solid #d1d5db" }}>
//                             <td style={{ padding: "12px 16px", border: "1px solid #6b6b6b", verticalAlign: "top" }}>
//                               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
//                                 <div style={{
//                                   width: "36px", height: "36px", background: "#fff7ed",
//                                   borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center"
//                                 }}>
//                                   <Utensils size={20} color="#ea580c" />
//                                 </div>
//                                 <span style={{ fontSize: "11px", fontWeight: "bold", color: "#ea580c", textTransform: "uppercase", textAlign: "center" }}>
//                                   MEAL
//                                 </span>
//                               </div>
//                             </td>
//                             <td style={{ padding: "12px 16px", border: "1px solid #6b6b6b", verticalAlign: "top" }}>
//                               <div style={{ fontWeight: "bold", color: "#111827", fontSize: "14px" }}>
//                                 {item.mealType || item.restaurantName || "Meal"}
//                               </div>
//                               {item.restaurantName && item.restaurantName !== item.mealType && (
//                                 <p style={{ color: "#6b7280", fontSize: "12px", margin: "4px 0 0" }}>{item.restaurantName}</p>
//                               )}
//                             </td>
//                             <td style={{ padding: "12px 16px", border: "1px solid #6b6b6b", verticalAlign: "top", textAlign: "right", fontWeight: "bold", fontSize: "12px", color: "#374151" }}>
//                               {item.inclusionType?.toUpperCase() || "INCLUDED"}
//                             </td>
//                           </tr>
//                         );
//                       }

//                       return null;
//                     })}
//                   </tbody>
//                 );
//               })}
//             </table>
//           </div>

//           {/* ════════════════════════════════════════════════
//               NEW ADDITION 1: MONTH SELECTOR
//               (between table and pricing box)
//           ════════════════════════════════════════════════ */}
//           {data.fixedDepartures?.length > 0 && (
//             <div style={{ padding: "24px 24px 0" }}>
//               <div style={{
//                 border: "1px solid #e2e8f0",
//                 borderRadius: "12px",
//                 padding: "20px",
//                 background: "#f8fafc"
//               }}>
//                 <p style={{ color: "#1e293b", fontWeight: 700, fontSize: "14px", margin: "0 0 14px", display: "flex", alignItems: "center", gap: "8px" }}>
//                   📅 Select Your Travel Month
//                 </p>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                   {data.fixedDepartures.map((dep: any) => (
//                     <button
//                       key={dep.month}
//                       onClick={() => setSelectedMonth(dep.month)}
//                       style={{
//                         padding: "8px 16px",
//                         borderRadius: "8px",
//                         border: selectedMonth === dep.month ? "2px solid #1d4ed8" : "1px solid #cbd5e1",
//                         background: selectedMonth === dep.month ? "#1d4ed8" : "#fff",
//                         color: selectedMonth === dep.month ? "#fff" : "#374151",
//                         fontWeight: 700,
//                         fontSize: "13px",
//                         cursor: "pointer",
//                         transition: "all 0.15s"
//                       }}
//                     >
//                       {dep.month}
//                       {dep.priceDBL > 0 && (
//                         <span style={{
//                           marginLeft: "6px",
//                           fontSize: "11px",
//                           fontWeight: 600,
//                           color: selectedMonth === dep.month ? "#bfdbfe" : "#64748b"
//                         }}>
//                           {fmt(dep.priceDBL)}/pp
//                         </span>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ════════════════════════════════════════════════
//               PRICING BOX — same as preview page
//           ════════════════════════════════════════════════ */}
//           {priceDBL > 0 && (
//             <div style={{ padding: "24px", display: "flex", justifyContent: "flex-end" }}>
//               <div style={{
//                 background: "#1d4ed8",
//                 borderRadius: "12px",
//                 padding: "20px 28px",
//                 minWidth: "280px",
//                 color: "#fff"
//               }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", fontWeight: 600 }}>
//                   <span style={{ color: "#bfdbfe" }}>PRICE PER PERSON</span>
//                   <span style={{ color: "#bfdbfe" }}>👤</span>
//                 </div>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
//                   <span style={{ fontSize: "13px", fontWeight: 600 }}>
//                     {data.numberOfTravelers} ADULT COST
//                   </span>
//                   <span style={{ fontSize: "22px", fontWeight: 900 }}>
//                     {fmt(priceDBL)}
//                   </span>
//                 </div>
//                 <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <span style={{ fontSize: "13px", fontWeight: 600 }}>
//                     Total Group Value ({data.numberOfTravelers} Adult)
//                   </span>
//                   <span style={{ fontSize: "20px", fontWeight: 900 }}>
//                     {fmt(priceDBL * data.numberOfTravelers)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ════════════════════════════════════════════════
//               IMPORTANT NOTES — same as preview page
//           ════════════════════════════════════════════════ */}
//           <div style={{ padding: "0 24px 32px" }}>
//             <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "20px" }}>
//               <h4 style={{ fontWeight: "bold", fontSize: "14px", color: "#111827", margin: "0 0 12px", textTransform: "uppercase" }}>
//                 Important Notes
//               </h4>
//               {[
//                 "Entrances, Tours once booked are non-refundable and non-transferable.",
//                 "For all Group Based Tours, passengers have to join from a designated point advised upon confirmation. For Hotel Pickups, the meeting point is the Hotel Lobby.",
//                 "All mentioned Distances represent actual travel time and do not account for waiting periods at sightseeing activities, theme parks, airports, etc.",
//                 "Optional tours can be taken only when there is enough time available between leisure time and included tours; please plan accordingly.",
//                 "You must be present at the meeting point at least 10 mins prior to the activity mentioned in the itinerary.",
//               ].map((note, i) => (
//                 <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
//                   <span style={{ color: "#374151", fontSize: "13px" }}>➤</span>
//                   <span style={{ color: "#374151", fontSize: "13px", lineHeight: 1.5 }}>{note}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ════════════════════════════════════════════════
//               NEW ADDITION 2: CLIENT RESPONSE SECTION
//               (below important notes — this is all NEW)
//           ════════════════════════════════════════════════ */}
//           <div style={{ borderTop: "2px solid #e5e7eb", padding: "32px 24px" }}>
//             {submitted ? (
//               <div style={{
//                 background: "#f0fdf4",
//                 border: "1px solid #bbf7d0",
//                 borderRadius: "12px",
//                 padding: "40px",
//                 textAlign: "center"
//               }}>
//                 <CheckCircle2 size={48} style={{ color: "#16a34a", margin: "0 auto 16px" }} />
//                 <h3 style={{ color: "#15803d", fontSize: "20px", fontWeight: 900, margin: "0 0 8px" }}>
//                   Response Submitted!
//                 </h3>
//                 <p style={{ color: "#166534", fontSize: "14px", margin: 0 }}>{submitMessage}</p>
//               </div>
//             ) : (
//               <div>
//                 <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: 900, margin: "0 0 6px" }}>
//                   Your Response
//                 </h3>
//                 <p style={{ color: "#64748b", fontSize: "13px", fontWeight: 600, margin: "0 0 20px" }}>
//                   Please review the itinerary above and let us know your decision
//                 </p>

//                 {/* Action buttons */}
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
//                   <button
//                     onClick={() => setResponseAction("approved")}
//                     style={{
//                       padding: "16px",
//                       borderRadius: "12px",
//                       border: `2px solid ${responseAction === "approved" ? "#16a34a" : "#bbf7d0"}`,
//                       background: responseAction === "approved" ? "#16a34a" : "#f0fdf4",
//                       color: responseAction === "approved" ? "#fff" : "#15803d",
//                       fontWeight: 700,
//                       fontSize: "14px",
//                       cursor: "pointer",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: "8px",
//                       transition: "all 0.15s"
//                     }}
//                   >
//                     <ThumbsUp size={18} />
//                     ✅ I Approve This Itinerary
//                   </button>
//                   <button
//                     onClick={() => setResponseAction("changes_requested")}
//                     style={{
//                       padding: "16px",
//                       borderRadius: "12px",
//                       border: `2px solid ${responseAction === "changes_requested" ? "#d97706" : "#fde68a"}`,
//                       background: responseAction === "changes_requested" ? "#d97706" : "#fffbeb",
//                       color: responseAction === "changes_requested" ? "#fff" : "#92400e",
//                       fontWeight: 700,
//                       fontSize: "14px",
//                       cursor: "pointer",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       gap: "8px",
//                       transition: "all 0.15s"
//                     }}
//                   >
//                     <ThumbsDown size={18} />
//                     📝 Request Changes
//                   </button>
//                 </div>

//                 {/* Response form — shown after selecting action */}
//                 {responseAction && (
//                   <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "20px", border: "1px solid #e2e8f0" }}>
//                     <p style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a", margin: "0 0 16px" }}>
//                       {responseAction === "approved" ? "Confirm your approval:" : `Describe the changes needed:`}
//                     </p>

//                     {/* Name */}
//                     <div style={{ marginBottom: "12px" }}>
//                       <label style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
//                         Your Name
//                       </label>
//                       <input
//                         type="text"
//                         value={clientName}
//                         onChange={e => setClientName(e.target.value)}
//                         placeholder="Your full name"
//                         style={{
//                           width: "100%",
//                           padding: "10px 14px",
//                           border: "1px solid #cbd5e1",
//                           borderRadius: "8px",
//                           fontSize: "14px",
//                           outline: "none",
//                           boxSizing: "border-box"
//                         }}
//                       />
//                     </div>

//                     {/* Message */}
//                     <div style={{ marginBottom: "16px" }}>
//                       <label style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
//                         {responseAction === "approved" ? "Any special requests? (optional)" : "What changes would you like? *"}
//                       </label>
//                       <textarea
//                         rows={4}
//                         value={clientMessage}
//                         onChange={e => setClientMessage(e.target.value)}
//                         placeholder={
//                           responseAction === "approved"
//                             ? "e.g. Dietary requirements, room preferences..."
//                             : "Please describe the changes you'd like..."
//                         }
//                         style={{
//                           width: "100%",
//                           padding: "10px 14px",
//                           border: "1px solid #cbd5e1",
//                           borderRadius: "8px",
//                           fontSize: "14px",
//                           outline: "none",
//                           resize: "none",
//                           boxSizing: "border-box",
//                           fontFamily: "Arial, sans-serif"
//                         }}
//                       />
//                     </div>

//                     {/* Submit */}
//                     <button
//                       onClick={handleSubmit}
//                       disabled={isSubmitting}
//                       style={{
//                         width: "100%",
//                         padding: "14px",
//                         borderRadius: "10px",
//                         border: "none",
//                         background: responseAction === "approved" ? "#16a34a" : "#d97706",
//                         color: "#fff",
//                         fontWeight: 700,
//                         fontSize: "15px",
//                         cursor: isSubmitting ? "not-allowed" : "pointer",
//                         opacity: isSubmitting ? 0.7 : 1,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: "8px"
//                       }}
//                     >
//                       {isSubmitting
//                         ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Submitting...</>
//                         : <><Send size={16} />
//                             {responseAction === "approved" ? "Confirm Approval" : "Submit Change Request"}
//                           </>
//                       }
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* ════════════════════════════════════════════════
//               CONTACT FOOTER
//           ════════════════════════════════════════════════ */}
//           <div style={{
//             borderTop: "1px solid #e5e7eb",
//             padding: "20px 24px",
//             textAlign: "center",
//             background: "#f8fafc"
//           }}>
//             <p style={{ color: "#64748b", fontSize: "13px", fontWeight: 600, margin: "0 0 8px" }}>
//               Questions about your itinerary?
//             </p>
//             <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
//               <a href="mailto:Sandeep@TravDek.com" style={{ color: "#1d4ed8", fontWeight: 700, fontSize: "13px" }}>
//                 📧 Sandeep@TravDek.com
//               </a>
//               <a href="tel:+16507594331" style={{ color: "#1d4ed8", fontWeight: 700, fontSize: "13px" }}>
//                 📞 +1 650 759 4331
//               </a>
//             </div>
//             <p style={{ color: "#cbd5e1", fontSize: "11px", fontWeight: 600, margin: "12px 0 0" }}>
//               Powered by Travdek · Official B2B Travel Network
//             </p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

















"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Loader2, AlertCircle, Clock, XCircle,
  ThumbsUp, ThumbsDown, Send, CheckCircle2, Plane
} from "lucide-react";

// --- HELPERS ---
const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'TBA';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const isItemIncluded = (status?: string) => !status || status.toLowerCase() === 'included';

// --- ERROR SCREEN ---
function ErrorScreen({ code, message }: { code: string; message: string }) {
  const cfg: Record<string, { icon: React.ReactNode; title: string; bg: string; color: string }> = {
    NOT_FOUND   : { icon: <XCircle size={48} />, title: "Link Not Found", bg: "#f1f5f9", color: "#64748b" },
    DEACTIVATED : { icon: <XCircle size={48} />, title: "Link Deactivated", bg: "#fef2f2", color: "#ef4444" },
    EXPIRED     : { icon: <Clock size={48} />, title: "Link Expired", bg: "#fffbeb", color: "#f59e0b" },
    DEFAULT     : { icon: <AlertCircle size={48} />, title: "Something Went Wrong", bg: "#f1f5f9", color: "#64748b" },
  };
  const c = cfg[code] ?? cfg.DEFAULT;
  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "48px", maxWidth: "420px", width: "100%", textAlign: "center" }}>
        <div style={{ width: "80px", height: "80px", background: c.bg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: c.color }}>
          {c.icon}
        </div>
        <h2 style={{ color: "#0f172a", fontSize: "22px", fontWeight: 900, margin: "0 0 12px" }}>{c.title}</h2>
        <p style={{ color: "#64748b", fontSize: "15px", lineHeight: 1.6, margin: "0 0 32px" }}>{message}</p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════
export default function ClientViewPage() {
  const params = useParams();
  const token  = params?.token as string;

  // --- State ---
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  
  // Client Response State
  const [responseAction, setResponseAction] = useState<"approved" | "changes_requested" | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientMessage, setClientMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // --- Fetch Data ---
  useEffect(() => {
    if (!token) return;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/share/${token}`);
        const json = await res.json();
        if (!json.success) {
          setError({ code: json.code || "DEFAULT", message: json.message });
          return;
        }
        setData(json.data);
        
        if (json.data.fixedDepartures?.length > 0) {
          setSelectedMonth(json.data.fixedDepartures[0].month);
        }
        if (json.data.shareInfo?.clientName) {
          setClientName(json.data.shareInfo.clientName);
        }
        if (["approved", "changes_requested"].includes(json.data.shareInfo?.status)) {
          setSubmitted(true);
          setSubmitMessage(
            json.data.shareInfo.status === "approved"
              ? "You have already approved this itinerary. Your advisor will be in touch soon."
              : "Your change request has already been submitted."
          );
        }
      } catch {
        setError({ code: "DEFAULT", message: "Failed to load. Please try again." });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token]);

  // --- Submit Response ---
  const handleSubmit = async () => {
    if (!responseAction) return;
    if (responseAction === "changes_requested" && !clientMessage.trim()) {
      alert("Please describe the changes you'd like.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/share/${token}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: responseAction,
          clientMessage: clientMessage.trim(),
          selectedMonth,
          selectedPax: data?.numberOfTravelers,
          clientName: clientName.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        setSubmitMessage(json.message);
      } else {
        alert(json.message || "Failed. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Loading & Error States ---
  if (isLoading) return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "64px", height: "64px", background: "#2563EB", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader2 style={{ color: "#fff", animation: "spin 1s linear infinite" }} size={28} />
        </div>
        <p style={{ color: "#64748b", fontSize: "14px", fontWeight: 600 }}>Loading your itinerary...</p>
      </div>
    </div>
  );

  if (error) return <ErrorScreen code={error.code} message={error.message} />;
  if (!data) return <ErrorScreen code="DEFAULT" message="Something went wrong." />;

  // --- Data Preparation (Matched EXACTLY to PreviewPage logic) ---
  const routes = data?.routingData?.routes || [];
  const startCity = routes.length > 0 ? routes[0]?.cities?.[0]?.name : 'TBA';
  const endCity = routes.length > 0 ? routes[routes.length - 1]?.cities?.[0]?.name : 'TBA';
  const totalNights = routes.reduce((acc: number, curr: any) => acc + (curr.nights || 0), 0);
  const totalDays = totalNights + 1;

  const citiesWithNights = routes
    .filter((r: any) => r.cities && r.cities.length > 0 && r.cities[0]?.name)
    .map((r: any) => {
        const cityNames = r.cities.map((c: any) => c.name).join(' / ');
        const n = parseInt(r.nights) || 0;
        return n > 0 ? `${cityNames} (${n}N)` : cityNames;
    })
    .join(' | ');

  const rawDayPlans = (data?.dayWiseActivities || []).slice(0, totalDays);

  const getRenderableItemsForDay = (dayIndex: number, currentDay: any) => {
    const items: any[] = [];
    if(currentDay.activities) currentDay.activities.forEach((a: any) => items.push({ ...a, category: 'Activity' }));
    if(currentDay.transports) currentDay.transports.forEach((t: any) => items.push({ ...t, category: 'Transport' }));
    if(currentDay.meals) currentDay.meals.forEach((m: any) => items.push({ ...m, category: 'Meal' }));
    if(currentDay.stays) currentDay.stays.forEach((s: any) => items.push({ ...s, category: 'Stay', status: 'Check-in' }));

    for (let i = 0; i < dayIndex; i++) {
        const pastDay = rawDayPlans.find((d: any) => d.dayNumber === (i + 1));
        if (pastDay && pastDay.stays) {
            pastDay.stays.forEach((stay: any) => {
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

  // --- Pricing Logic (Safe for Public View) ---
  const travelerCount = parseInt(String(data?.numberOfTravelers)) || 1;
  const currency = data?.selectedCurrency || 'USD';
  const selectedDep = data?.fixedDepartures?.find((d: any) => d.month === selectedMonth);
  // Uses fixed departure price if selected, otherwise defaults to the final calculated sell price passed from backend
  const priceDBL = selectedDep?.priceDBL || data?.finalSellPrice || 0;
  const finalGrandTotal = priceDBL * travelerCount;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency", currency, maximumFractionDigits: 0
    }).format(n);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      
      {/* --- TOP NOTIFICATION BAR --- */}
      <div style={{ width: "100%", background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "#2563EB", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: "14px" }}>T</span>
          </div>
          <span style={{ fontWeight: 900, color: "#0f172a", fontSize: "16px", letterSpacing: "0.5px" }}>TRAVDEK</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
          <Clock size={13} />
          <span>Expires {new Date(data.shareInfo?.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>

      <div className="w-full max-w-[390mm] bg-white shadow-2xl mt-8 mb-8" style={{ color: '#1f2937', fontFamily: 'Arial, sans-serif' }}>
        
        {/* --- EXACT HEADER FROM PREVIEW --- */}
        <div style={{ borderBottom: '2px solid #e5e7eb', padding: '32px 24px', backgroundColor: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '16px', textTransform: 'uppercase' }}>
                  <h1 style={{ color: '#001d6a', fontSize: '32px', fontWeight: 'bold', margin: '0 0 4px 0', lineHeight: '1.2' }}>
                      {data?.tripName || "Itinerary"}
                  </h1>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#001d6a' }}>
                      {totalDays} Days | {totalNights} Nights
                  </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flexShrink: 0 }}>
                  <div style={{ height: '50px', marginBottom: '14px' }}>
                      <img src="/logo.png" alt="Company Logo" style={{ height: '100%', objectFit: 'contain', objectPosition: 'left center' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontFamily: 'inherit', minWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '18px' }}>
                          <i className="fa-solid fa-envelope" style={{ color: '#712400', width: '16px', textAlign: 'center', fontSize: '13px' }}></i>
                          <span style={{ width: '42px', color: '#121214', fontWeight: 'bold' }}>Email:</span>
                          <span style={{ color: '#001d6a', fontWeight: 'bold' }}>Sandeep@TravDek.com</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '18px' }}>
                          <i className="fa-solid fa-phone" style={{ color: '#000000', width: '16px', textAlign: 'center', fontSize: '13px' }}></i>
                          <span style={{ width: '42px', color: '#121214', fontWeight: 'bold' }}>Tel:</span>
                          <span style={{ color: '#001d6a', fontWeight: 'bold' }}>+1 650 759 4331</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '18px' }}>
                          <i className="fa-solid fa-globe" style={{ color: '#0038a8', width: '16px', textAlign: 'center', fontSize: '13px' }}></i>
                          <span style={{ width: '42px', color: '#121214', fontWeight: 'bold' }}>Web:</span>
                          <a href="http://www.TravDek.com" style={{ color: '#001d6a', fontWeight: 'bold', textDecoration: 'none' }}>www.TravDek.com</a>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <i className="fa-solid fa-location-dot" style={{ color: '#df0000', width: '16px', textAlign: 'center', fontSize: '13px', marginTop: '2px' }}></i>
                          <span style={{ width: '42px', color: '#121214', fontWeight: 'bold' }}>Add:</span>
                          <span style={{ color: '#001d6a', fontWeight: 'bold', lineHeight: '1.5' }}>750 Alma lane #4459 Foster City, CA 94404 USA</span>
                      </div>
                  </div>
              </div>
          </div>
             
          {/* EXACT DETAILS GRID FROM PREVIEW */}
          <div style={{ borderTop: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', fontSize: '12px' }}>
                  <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Ref. ID:</div>
                  <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{data?.tripId || "Pending..."}</div>
                  
                  <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Travelers:</div>
                  <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{data?.numberOfTravelers} Pax</div>

                  <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Release Date:</div>
                  <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{formatDate(new Date().toISOString())}</div>
                  
                  <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Trip Validity:</div>
                  <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>
                      {data?.seasonStartDate ? formatDate(data?.seasonStartDate) : formatDate(data?.routingData?.startDate)} 
                      {' to '} 
                      {data?.seasonEndDate ? formatDate(data?.seasonEndDate) : formatDate(data?.routingData?.endDate)}
                  </div>

                  <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Country:</div>
                  <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{data?.selectedCountries?.join(', ') || "India"}</div>
                  
                  <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Cities:</div>
                  <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{citiesWithNights}</div>
                  
                  <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Start / End:</div>
                  <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{startCity} / {endCity}</div>
                  
                  <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Route:</div>
                  <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{data?.selectedCountries?.length || 1} Country | {routes.length} Cities</div>
                  
                  <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff' }}>Type:</div>
                  <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', textTransform: 'uppercase', borderRight: '1px solid #636363ff' }}>{data?.tripStyle || "TBA"}</div>

                  <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff' }}>Package:</div>
                  <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>{data?.packageType || "Premium"}</div>
              </div>
          </div>
        </div>

        {/* --- EXACT ITINERARY TABLE FROM PREVIEW --- */}
        <div style={{ marginTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '48px' }}>
          <h3 style={{ color: '#dc2626', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'underline', marginBottom: '16px', fontSize: '16px', letterSpacing: '0em' }}>Itinerary Details</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #6b6b6b', fontSize: '14px', tableLayout: 'fixed' }}>
            <colgroup>
                <col style={{ width: '200px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '140px' }} />
            </colgroup>

            {rawDayPlans.map((day: any, idx: number) => {
                const items = getRenderableItemsForDay(idx, day);
                const prevCity = idx > 0 ? rawDayPlans[idx - 1].city : null;
                const isCityChange = prevCity && prevCity !== day.city;
                const displayCityName = isCityChange ? `${prevCity} - ${day.city}` : day.city;

                // let nightCount = 0;
                // if (!prevCity || isCityChange) {
                //     const currentRoute = routes.find((r: any) => r.cities.some((c: any) => c.name === day.city));
                //     if (currentRoute) nightCount = currentRoute.nights;
                // }
                // const displayNights = nightCount > 0 ? ` (${nightCount}N)` : '';
                let nightCount = 0;
if (!prevCity || isCityChange) {
    // FIX: Added the '?' after r.cities to safely handle undefined arrays
    const currentRoute = routes.find((r: any) => r.cities?.some((c: any) => c.name === day.city));
    if (currentRoute) nightCount = currentRoute.nights;
}
const displayNights = nightCount > 0 ? ` (${nightCount}N)` : '';
                const finalDayHeader = `${displayCityName}${displayNights}`.toUpperCase();

                return (
                    <tbody key={day.dayNumber} style={{ breakInside: 'avoid', pageBreakInside: 'avoid', outline: '1px solid #6b6b6b' }}>
                        <tr style={{ backgroundColor: '#fefce8' }}>
                            <td colSpan={3} style={{ padding: '12px 16px', border: '1px solid #6b6b6b', borderTop: idx > 0 ? '2px solid #6b6b6b' : '1px solid #6b6b6b' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    <span style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '16px' }}>DAY {String(day.dayNumber).padStart(2, '0')}</span>
                                    <span style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '16px' }}>{finalDayHeader}</span>
                                </div>
                            </td>
                        </tr>

                        {items.length === 0 && (
                            <tr>
                                <td colSpan={3} style={{ border: '1px solid #6b6b6b', padding: '16px', color: '#9ca3af', fontStyle: 'italic', textAlign: 'center' }}>
                                    Leisure day. No activities scheduled.
                                </td>
                            </tr>
                        )}

                        {items.map((item, itemIdx) => {
                            const inclusionStatus = item.inclusionType || 'included'; 
                            const isExcluded = inclusionStatus === 'excluded';
                            const isOptional = inclusionStatus === 'optional';
                            const badgeBg = '#ffffff';
                            const badgeColor = '#454545';
                            const badgeText = isExcluded ? 'Excluded' : isOptional ? 'Optional' : 'Included';

                            // FontAwesome Icon Logic
                            let iconClass = 'fa-solid fa-camera'; 
                            let iconColor = '#0284c7'; 
                            
                            if (item.category === 'Stay') { 
                                iconClass = 'fa-solid fa-hotel'; iconColor = '#059669'; 
                            } else if (item.category === 'Meal') { 
                                iconClass = 'fa-solid fa-utensils'; iconColor = '#d97706'; 
                            } else if (item.category === 'Transport') {
                                iconColor = '#6366f1'; 
                                if (item.mode === 'flight') iconClass = 'fa-solid fa-plane';
                                else if (item.mode === 'rail') iconClass = 'fa-solid fa-train';
                                else if (item.mode === 'ferry') iconClass = 'fa-solid fa-ship';
                                else if (item.mode === 'bus') iconClass = 'fa-solid fa-bus';
                                else iconClass = 'fa-solid fa-car';
                            }

                            return (
                                <tr key={`${day.dayNumber}-${itemIdx}`}>
                                    {/* COL 1: CATEGORY WITH ICON */}
                                    <td style={{ border: '1px solid #6b6b6b', padding: '16px 24px', verticalAlign: 'middle', width: '200px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '16px', fontWeight: 'bold', color: '#454545', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', height: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px' }}>
                                                <i className={iconClass} style={{ color: iconColor, fontSize: '18px', display: 'block', textAlign: 'center', lineHeight: '20px' }}></i>
                                            </div>
                                            <span style={{ lineHeight: '20px', display: 'inline-block' }}>
                                                {item.category === 'Stay' ? 'Hotel' : item.category}
                                            </span>
                                        </div>
                                    </td>

                                    {/* COL 2: DESCRIPTION */}
                                    <td style={{ border: '1px solid #6b6b6b', padding: '16px', verticalAlign: 'top' }}>
                                        
                                        {item.category === 'Activity' && (
                                            <div>
                                                <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '16px' }}>{item.heading}</div>
                                                <div style={{ color: '#292d33ff', fontSize: '12px', marginTop: '4px', marginBottom: '8px' }}>{item.description}</div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', padding: '8px' }}>
                                                    {item.slot && <span style={{ color: '#292d33ff' }}>Slot: {item.slot}</span>}
                                                    {item.duration && <span style={{ color: '#292d33ff' }}>Duration: {item.duration}</span>}
                                                    {item.startTime && <span style={{ color: '#292d33ff' }}>Start: {item.startTime}</span>}
                                                    {item.pickupLocation && <span style={{ color: '#292d33ff' }}>Pickup: {item.pickupLocation}</span>}
                                                    {item.dropoffLocation && <span style={{ color: '#292d33ff' }}>Drop: {item.dropoffLocation}</span>}
                                                </div>
                                            </div>
                                        )}

                                        {item.category === 'Stay' && (
                                            <div style={{ opacity: item.status === 'Residence' ? 0.8 : 1, display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', width: '100%' }}>
                                                {item.status === 'Check-in' ? (
                                                    <>
                                                        <div style={{ fontWeight: 'bold', color: '#22252bff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            {item.hotelName}
                                                            {item.rating && <span style={{ fontSize: '12px', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#fff' }}>⭐ {item.rating}</span>}
                                                        </div>
                                                        <div style={{ color: '#555555', fontSize: '12px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div style={{ fontSize: '13px', color: '#292d33ff', fontStyle: 'italic', fontWeight: 'bold' }}>Continuing stay at {item.hotelName}.</div>
                                                        <div style={{ color: '#555555', fontSize: '12px', fontWeight: 'bold' }}>Room: {item.roomCategory}</div>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {item.category === 'Transport' && (
                                            <div>
                                                <div style={{ fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                                                    {item.vehicleType}
                                                    {['flight', 'rail', 'ferry'].includes(item.mode) && item.flightNumber && <span style={{ color: '#2563eb' }}> • {item.flightNumber}</span>}
                                                </div>

                                                {item.mode === 'flight' ? (
                                                    <div style={{ marginTop: '12px', padding: '12px'}}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center', gap: '16px' }}>
                                                            <div>
                                                                <div style={{ fontSize: '14px', fontWeight: '900', color: '#555555' }}>{item.pickupTime || '--:--'}</div>
                                                                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#555555', textTransform: 'uppercase' }}>{item.pickupLocation || 'Not Set'}</div>
                                                            </div>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <div style={{ fontSize: '10px', color: '#555555', fontWeight: 'bold', marginBottom: '4px' }}>DURATION: {item.duration || '--'}</div>
                                                                <div style={{ position: 'relative', width: '100%', height: '2px', backgroundColor: '#6b6b6b', margin: '8px 0' }}>
                                                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '14px' }}>✈️</div>
                                                                </div>
                                                                <div style={{ fontSize: '10px', fontWeight: 'bold', color: item.flightStops && item.flightStops !== 'Direct' ? '#2563eb' : '#16a34a' }}>
                                                                    {item.flightStops && item.flightStops !== 'Direct' ? `${item.flightStops} ${item.layoverInfo ? `• ${item.layoverInfo}` : ''}` : 'Direct Flight'}
                                                                </div>
                                                            </div>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <div style={{ fontSize: '14px', fontWeight: '900', color: '#555555' }}>{item.dropoffTime || '--:--'}</div>
                                                                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#555555', textTransform: 'uppercase' }}>{item.dropoffLocation || 'Not Set'}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : ['rail', 'ferry'].includes(item.mode) ? (
                                                    <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px',  padding: '12px' }}>
                                                        <div>
                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Schedule</div>
                                                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>{item.pickupTime || '--:--'} to {item.dropoffTime || '--:--'}</div>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>{item.mode === 'ferry' ? 'Ports' : 'Route'}</div>
                                                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>{item.pickupLocation || 'Not Set'} → {item.dropoffLocation || 'Not Set'}</div>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Duration</div>
                                                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>{item.duration || '--'}</div>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>{item.mode === 'ferry' ? 'Deck Info' : 'Travel Info'}</div>
                                                            <div style={{ fontSize: '12px', color: '#555555' }}>{item.serviceDescription || '--'}</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: item.subType === 'transfer' ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap: '12px', padding: '12px' }}>
                                                        <div>
                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Pickup</div>
                                                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>{item.pickupLocation || 'Not Set'}</div>
                                                            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#555555', marginTop: '2px' }}>{item.pickupTime || '--:--'}</div>
                                                        </div>
                                                        {item.subType === 'transfer' && (
                                                            <div>
                                                                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Drop-off</div>
                                                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>{item.dropoffLocation || 'Not Set'}</div>
                                                                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#555555', marginTop: '2px' }}>{item.dropoffTime || '--:--'}</div>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Duration</div>
                                                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#555555' }}>{item.duration || '--'}</div>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '10px',  fontWeight: 'bold', color: '#656565', textTransform: 'uppercase', marginBottom: '4px' }}>Journey Info</div>
                                                            <div style={{ fontSize: '11px', color: '#555555' }}>{item.serviceDescription || '--'}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {item.category === 'Meal' && (
                                            <div>
                                                <div style={{ color: '#1f2937', fontSize: '15px', fontWeight: 'bold' }}>{item.mealType}</div>
                                                {(item.restaurantName || item.cuisine) && (
                                                    <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '4px' }}>
                                                        {item.restaurantName ? `at ${item.restaurantName}` : ''} {item.cuisine ? `(${item.cuisine})` : ''}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>

                                    {/* COL 3: INCLUSION BADGE */}
                                    <td style={{ border: '1px solid #6b6b6b', padding: '16px', verticalAlign: 'middle', textAlign: 'center', width: '140px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: badgeColor, backgroundColor: badgeBg, textTransform:"uppercase" }}>
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

        {/* --- PRICING BOX FROM PREVIEW --- */}
        {priceDBL > 0 && (
          <div style={{ paddingLeft: '24px', paddingRight: '24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ backgroundColor: '#1d4ed8', borderRadius: '12px', padding: '20px', color: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#bfdbfe' }}>Price Per Person</span>
                      <i className="fa-solid fa-user" style={{ color: '#60a5fa', fontSize: '18px' }}></i>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#dbeafe' }}>{travelerCount} Adult Cost</span>
                      <span style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'monospace' }}>
                          {fmt(priceDBL)}
                      </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#bfdbfe' }}>Total Group Value ({travelerCount} Adult)</span>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                          {fmt(finalGrandTotal)}
                      </span>
                  </div>
              </div>
          </div>
        )}

        {/* --- EXACT TERMS AND CONDITIONS FROM PREVIEW --- */}
        <div style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '32px', display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '16px' }}>
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

            <div style={{ display: 'flex', width: '100%', gap: '16px' }}>
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

            <div style={{ display: 'flex', width: '100%', gap: '32px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderTop: '4px solid #dc2626', borderRadius: '6px', padding: '16px' }}>
                <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase' }}>Terms & Conditions</h4>
                     <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span><strong>30% Non Refundable Deposit</strong> at the time of booking.</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span>Final payment to be made <strong>60 days prior</strong> to Tour Start Date.</span></li>
                        <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><span style={{ color: '#dc2626' }}>➣</span> <span>If your confirmed arrangements include a Flight, <strong>Full Payment</strong> for the flights must be made in advance.</span></li>
                    </ul>
                </div>
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

        {/* --- CLIENT APPROVAL ACTION FORM --- */}
        {/* <div style={{ borderTop: "2px solid #e5e7eb", padding: "32px 24px" }}>
          {submitted ? (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
              <CheckCircle2 size={48} style={{ color: "#16a34a", margin: "0 auto 16px" }} />
              <h3 style={{ color: "#15803d", fontSize: "20px", fontWeight: 900, margin: "0 0 8px" }}>Response Submitted!</h3>
              <p style={{ color: "#166534", fontSize: "14px", margin: 0 }}>{submitMessage}</p>
            </div>
          ) : (
            <div>
              <h3 style={{ color: "#0f172a", fontSize: "16px", fontWeight: 900, margin: "0 0 6px" }}>Your Response</h3>
              <p style={{ color: "#64748b", fontSize: "13px", fontWeight: 600, margin: "0 0 20px" }}>Please review the itinerary above and let us know your decision</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                <button
                  onClick={() => setResponseAction("approved")}
                  style={{
                    padding: "16px", borderRadius: "12px", border: `2px solid ${responseAction === "approved" ? "#16a34a" : "#bbf7d0"}`,
                    background: responseAction === "approved" ? "#16a34a" : "#f0fdf4", color: responseAction === "approved" ? "#fff" : "#15803d",
                    fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                  }}
                >
                  <ThumbsUp size={18} /> ✅ I Approve This Itinerary
                </button>
                <button
                  onClick={() => setResponseAction("changes_requested")}
                  style={{
                    padding: "16px", borderRadius: "12px", border: `2px solid ${responseAction === "changes_requested" ? "#d97706" : "#fde68a"}`,
                    background: responseAction === "changes_requested" ? "#d97706" : "#fffbeb", color: responseAction === "changes_requested" ? "#fff" : "#92400e",
                    fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                  }}
                >
                  <ThumbsDown size={18} /> 📝 Request Changes
                </button>
              </div>

              {responseAction && (
                <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "20px", border: "1px solid #e2e8f0" }}>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Your Name</label>
                    <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Your full name" style={{ width: "100%", padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>{responseAction === "approved" ? "Any special requests? (optional)" : "What changes would you like? *"}</label>
                    <textarea rows={4} value={clientMessage} onChange={e => setClientMessage(e.target.value)} placeholder={responseAction === "approved" ? "e.g. Dietary requirements..." : "Please describe..."} style={{ width: "100%", padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "14px", outline: "none", resize: "none", boxSizing: "border-box" }} />
                  </div>
                  <button onClick={handleSubmit} disabled={isSubmitting} style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "none", background: responseAction === "approved" ? "#16a34a" : "#d97706", color: "#fff", fontWeight: 700, fontSize: "15px", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    {isSubmitting ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Submitting...</> : <><Send size={16} /> {responseAction === "approved" ? "Confirm Approval" : "Submit Change Request"}</>}
                  </button>
                </div>
              )}
            </div>
          )}
        </div> */}

      </div>
    </div>
  );
}