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

import React, { useState, useEffect , useRef } from "react";
import { useParams } from "next/navigation";
import {
  Loader2, AlertCircle, Clock, XCircle,
  ThumbsUp, ThumbsDown, Send, CheckCircle2, Plane,
  Download
} from "lucide-react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

  // --- PDF State & Ref ---
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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



    // --- REFS FOR NEW PDF ENGINE ---
     const printRef = useRef<HTMLDivElement>(null);
    const headerSectionRef  = useRef<HTMLDivElement>(null);
    const itineraryLabelRef = useRef<HTMLHeadingElement>(null);
    const tableRef          = useRef<HTMLTableElement | null>(null);
    const tableHeadRef      = useRef<HTMLTableSectionElement>(null);
    const dayRefsMap        = useRef<Map<number, HTMLElement>>(new Map());
    const pricingRef        = useRef<HTMLDivElement>(null);
    const footerRef         = useRef<HTMLDivElement>(null);
  

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


  // 👇 1. THE NEW OFF-SCREEN PDF ENGINE (Zero Blank Spaces!)
    const createPdfObject = async () => {
        const PDF_W_MM  = 210;  
        const PDF_H_MM  = 297;  
        const MARGIN_MM = 10;   
        const CONTENT_W_MM = PDF_W_MM - (MARGIN_MM * 2);
  
        const pdf = new jsPDF('p', 'mm', 'a4');
        let currentY = MARGIN_MM; 
  
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
        // A. CAPTURE HEADER
        // ─────────────────────────────────────────────────────────
        if (headerSectionRef.current) {
          const headerCanvas = await html2canvas(headerSectionRef.current, H2C_OPTS);
          ensureFits(toMm(headerCanvas));
          currentY += placeCanvas(headerCanvas, currentY) + 4;
        }
  
        // ─────────────────────────────────────────────────────────
        // B. NATIVE TEXT FOR "ITINERARY DETAILS"
        // ─────────────────────────────────────────────────────────
        ensureFits(8);
        pdf.setFontSize(10); 
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(220, 38, 38); 
        
        const headingText = "ITINERARY DETAILS";
        pdf.text(headingText, MARGIN_MM, currentY + 5);
        
        const textWidth = pdf.getTextWidth(headingText);
        pdf.setDrawColor(220, 38, 38);
        pdf.setLineWidth(0.5);
        pdf.line(MARGIN_MM, currentY + 6, MARGIN_MM + textWidth, currentY + 6); 
        
        currentY += 9; 
  
        // ─────────────────────────────────────────────────────────
        // C. OFF-SCREEN TABLE CLONING
        // ─────────────────────────────────────────────────────────
        if (tableRef.current) {
          const originalTable = tableRef.current;
          const hiddenWrapper = document.createElement('div');
          hiddenWrapper.style.position = 'absolute';
          hiddenWrapper.style.left = '-9999px';
          hiddenWrapper.style.top = '0px';
          hiddenWrapper.style.width = `${originalTable.offsetWidth + 2}px`;
          hiddenWrapper.style.paddingRight = '1px';
          hiddenWrapper.style.backgroundColor = '#ffffff';
  
          const clonedTable = originalTable.cloneNode(true) as HTMLTableElement;
          hiddenWrapper.appendChild(clonedTable);
          document.body.appendChild(hiddenWrapper);
  
          const clonedTbodies = Array.from(clonedTable.querySelectorAll('tbody'));
          const clonedThead = clonedTable.querySelector('thead');
  
          clonedTbodies.forEach(el => el.style.display = 'none');
          if (clonedThead) clonedThead.style.display = '';
  
          for (let i = 0; i < clonedTbodies.length; i++) {
            const currentTbody = clonedTbodies[i];
            currentTbody.style.display = '';
            currentTbody.style.boxShadow = 'none';
  
            const dayCanvas = await html2canvas(clonedTable, H2C_OPTS);
            const dayH = toMm(dayCanvas);
  
            ensureFits(dayH);
            currentY += placeCanvas(dayCanvas, currentY); 
  
            currentTbody.style.display = 'none';
            if (clonedThead) clonedThead.style.display = 'none';
          }
          
          document.body.removeChild(hiddenWrapper);
          currentY += 8; 
        }
  
        // ─────────────────────────────────────────────────────────
        // D. CAPTURE PRICING SEPARATELY (Off-Screen Clone Fix!)
        // ─────────────────────────────────────────────────────────
        if (pricingRef.current) {
            const hiddenWrapper = document.createElement('div');
            hiddenWrapper.style.position = 'absolute';
            hiddenWrapper.style.left = '-9999px';
            hiddenWrapper.style.top = '0px';
            hiddenWrapper.style.width = `${pricingRef.current.offsetWidth}px`;
            hiddenWrapper.style.backgroundColor = '#ffffff';
  
            const clone = pricingRef.current.cloneNode(true) as HTMLElement;
            hiddenWrapper.appendChild(clone);
            document.body.appendChild(hiddenWrapper);
  
            const pricingCanvas = await html2canvas(clone, H2C_OPTS);
            const pricingH = toMm(pricingCanvas);
            
            document.body.removeChild(hiddenWrapper);
  
            ensureFits(pricingH + 5);
            currentY += placeCanvas(pricingCanvas, currentY) + 12; 
        }
  
        // ─────────────────────────────────────────────────────────
        // E. CAPTURE FOOTER (Off-Screen Clone Fix!)
        // ─────────────────────────────────────────────────────────
        if (footerRef.current) {
            const hiddenWrapper = document.createElement('div');
            hiddenWrapper.style.position = 'absolute';
            hiddenWrapper.style.left = '-9999px';
            hiddenWrapper.style.top = '0px';
            hiddenWrapper.style.width = `${footerRef.current.offsetWidth}px`;
            hiddenWrapper.style.backgroundColor = '#ffffff';
  
            const clone = footerRef.current.cloneNode(true) as HTMLElement;
            hiddenWrapper.appendChild(clone);
            document.body.appendChild(hiddenWrapper);
  
            const footerCanvas = await html2canvas(clone, H2C_OPTS);
            const footerH = toMm(footerCanvas);
            
            document.body.removeChild(hiddenWrapper);
  
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
          pdf.save(`${data.tripName || 'Itinerary'}.pdf`);
      } catch (error) {
          console.error("PDF Gen Error:", error);
          alert("Failed to generate PDF.");
      } finally {
          setIsDownloading(false);
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

  // Calculate per-pax costs for display
  const finalPaxCosts = Array(travelerCount).fill(priceDBL);
  
  // Process optionals from data
  const processedOptionals = (data?.optionalExtras || []).map((opt: any) => ({
    name: opt.name,
    pax: opt.paxCount || travelerCount,
    retailPP: opt.pricePerPerson || 0,
    retailTotal: (opt.pricePerPerson || 0) * (opt.paxCount || travelerCount),
  }));
  
  const finalOptionalGrandTotal = processedOptionals.reduce((sum: number, opt: any) => sum + opt.retailTotal, 0);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency", currency, maximumFractionDigits: 0
    }).format(n);



     const logoBase64 = "data:image/png;base64,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";
    

  return (
    <div className="min-h-screen bg-gray-100 p-0  flex flex-col items-center gap-6">
         
      {/* --- TOP NOTIFICATION BAR --- */}
      <div style={{ width: "100%", background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        {/* LEFT SIDE: Actual Base64 Company Logo */}
  <div style={{ display: "flex", alignItems: "center" }}>
    <img 
      src={logoBase64} 
      alt="Travdek Logo" 
      style={{ 
        height: "32px", 
        width: "auto", 
        objectFit: "contain" 
      }} 
    />
  </div>


  <button 
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px",
            background: "#f1f5f9", color: "#334155", fontSize: "14px", fontWeight: "bold",
            borderRadius: "8px", border: "none", cursor: isDownloading ? "not-allowed" : "pointer",
            opacity: isDownloading ? 0.7 : 1, transition: "background 0.2s"
          }}
        >
          {isDownloading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={16} />}
          {isDownloading ? "Generating PDF..." : "Download PDF"}
        </button>


        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
          <Clock size={13} />
          <span>Expires {new Date(data.shareInfo?.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
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
                      {data.tripName || "Draft Itinerary"}
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
          <span style={{ color: '#001d6a', fontWeight: 'bold' }}>sandeep@travdek.com</span>
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
             
                  {/* DETAILS GRID */}
                  <div style={{ borderTop: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', fontSize: '12px' }}>
                          
                          {/* ROW 1: Ref ID & Travelers */}
                          <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Ref. ID:</div>
                          <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{data.tripId || "Pending..."}</div>
                          
                          <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Travelers:</div>
                          <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{data.numberOfTravelers} Pax</div>
      
                          {/* ROW 2: Release Date & Trip Validity */}
                          <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Release Date:</div>
                          <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{formatDate(new Date().toISOString())}</div>
                          
                          <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Trip Validity:</div>
                          <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>
                              {data.seasonStartDate ? formatDate(data.seasonStartDate) : formatDate(data.routingData?.startDate)} 
                              {' to '} 
                              {data.seasonEndDate ? formatDate(data.seasonEndDate) : formatDate(data.routingData?.endDate)}
                          </div>
      
                          {/* ROW 3: Country */}
                          <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Country:</div>
                          <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{data.selectedCountries?.join(', ') || "India"}</div>
                          
                          {/* ROW 4: Cities */}
                          <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Cities:</div>
                          <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff', textTransform: 'uppercase', gridColumn: 'span 3' }}>{citiesWithNights}</div>
                          
                          {/* ROW 5: Start / End & Route */}
                          <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Start / End:</div>
                          <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>{startCity} / {endCity}</div>
                          
                          <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff', borderBottom: '1px solid #636363ff' }}>Route:</div>
                          <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #636363ff' }}>{data.selectedCountries?.length || 1} Country | {routes.length} Cities</div>
                          
                      {/* ROW 6: Type & Package */}
                          <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff' }}>Type:</div>
                          <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', textTransform: 'uppercase', borderRight: '1px solid #636363ff' }}>{data.tripStyle || "TBA"}</div>
      
                          <div style={{ backgroundColor: '#f9fafb', padding: '8px', fontWeight: 'bold', borderRight: '1px solid #636363ff' }}>Package:</div>
                          <div style={{ color: '#1d4ed8', padding: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>{data.packageType || "Premium"}</div>
                      </div>
                  </div>
         
              </div>
      
              {/* 👇 ITINERARY Details Label (Ref added, font size fixed to 10px in PDF) */}
              <div style={{ marginTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '48px' }}>
                  <h3 ref={itineraryLabelRef} style={{ color: '#dc2626', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'underline', marginBottom: '16px', fontSize: '16px', letterSpacing: '0em' }}>Itinerary Details</h3>
                  
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
      
    {rawDayPlans.map((day: { city: any; dayNumber: React.Key | null | undefined; }, idx: number) => {
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
                          ref={(el) => { if (el && typeof day.dayNumber === 'number') dayRefsMap.current.set(day.dayNumber, el); }}
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
                                                                  <div style={{ 
                                                                      opacity: item.status === 'Residence' ? 0.8 : 1, 
                                                                      display: 'grid', 
                                                                      gridTemplateColumns: '1fr 1fr', 
                                                                      alignItems: 'center', 
                                                                      width: '100%' 
                                                                  }}>
                                                                      
                                                                      {item.status === 'Check-in' ? (
                                                                          <>
                                                                              {/* Left Side: Hotel Name & Rating */}
                                                                              <div style={{ fontWeight: 'bold', color: '#22252bff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                  {item.hotelName}
                                                                                  <span style={{ fontSize: '12px', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#fff' }}>⭐ {item.rating}</span>
                                                                              </div>
                                                                              
                                                                              {/* Right Side: Room Category */}
                                                                              <div style={{ color: '#555555', fontSize: '12px', fontWeight: 'bold' }}>
                                                                                  Room: {item.roomCategory}
                                                                              </div>
                                                                          </>
                                                                      ) : (
                                                                          <>
                                                                              {/* Left Side: Continuing Text */}
                                                                              <div style={{ fontSize: '13px', color: '#292d33ff', fontStyle: 'italic', fontWeight: 'bold' }}>
                                                                                  Continuing stay at {item.hotelName}. 
                                                                              </div>
                                                                              
                                                                              {/* Right Side: Room Category */}
                                                                              <div style={{ color: '#555555', fontSize: '12px', fontWeight: 'bold' }}>
                                                                                  Room: {item.roomCategory}
                                                                              </div>
                                                                          </>
                                                                      )}
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
      
      
                {/* 👇 INCLUSIONS, EXCLUSIONS, NOTES, POLICIES & PRICING (Ref added!) */}
             
             {/* 👇 NEW: PRICING BLOCK (Separated into its own ref so it fits under the table!) */}
              <div ref={pricingRef} style={{ paddingLeft: '24px', paddingRight: '24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%', boxSizing: 'border-box' }}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px', breakInside: 'avoid', width: '100%', maxWidth: '400px' }}>
                      
                      {/* BLUE BOX: Selling Price */}
                      <div style={{ backgroundColor: '#1d4ed8', borderRadius: '12px', padding: '20px', color: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#bfdbfe' }}>Price Per Person</span>
                              <i className="fa-solid fa-user" style={{ color: '#60a5fa', fontSize: '18px' }}></i>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                            {Object.entries(
                              finalPaxCosts.reduce((acc: any, cost: number) => {
                                acc[cost] = (acc[cost] || 0) + 1;
                                return acc;
                              }, {})
                            ).map(([cost, count], idx) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px' }}>
                                  <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#dbeafe' }}>{Number(count)} Adult Cost</span>
                                  <span style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'monospace' }}>
                                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(Number(cost))}
                                  </span>
                              </div>
                            ))}
                          </div>
      
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '12px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#bfdbfe' }}>Total Group Value ({travelerCount} Adult)</span>
                              <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(finalGrandTotal)}
                              </span>
                          </div>
                      </div>
      
                      {/* ORANGE BOX: Optionals (Only shows if there are checked optionals) */}
                      {processedOptionals.length > 0 && (
                          <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '16px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #fed7aa', paddingBottom: '8px' }}>
                                  <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#9a3412' }}>Optional Add-ons</span>
                                  <span style={{ fontSize: '10px', backgroundColor: '#fed7aa', color: '#9a3412', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>EXTRA</span>
                              </div>
      
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px', borderBottom: '1px solid #fed7aa', paddingBottom: '12px' }}>
                                  {processedOptionals.map((opt: any, idx: number) => (
                                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#7c2d12' }}>{opt.name}</div>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                              <span style={{ fontSize: '11px', color: '#ea580c', fontWeight: '500' }}>
                                                  {opt.pax} Pax @ {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(opt.retailPP)}/pp
                                              </span>
                                              <span style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace', color: '#9a3412' }}>
                                                  +{new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(opt.retailTotal)}
                                              </span>
                                          </div>
                                      </div>
                                  ))}
                              </div>
      
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#9a3412' }}>Group Total Optionals</span>
                                  <span style={{ fontSize: '16px', fontWeight: '900', fontFamily: 'monospace', color: '#7c2d12' }}>
                                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(finalOptionalGrandTotal)}
                                  </span>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
      
              {/* 👇 EXISTING FOOTER REF NOW STARTS HERE (Strictly sized for cloning) */}
              <div ref={footerRef} style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '32px', display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px', width: '100%', boxSizing: 'border-box' }}>
                  
                  {/* 1. IMPORTANT NOTES */}
                  <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '16px', breakInside: 'avoid', display: 'inline-block', width: '100%' }}>
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
              {/* <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', marginTop: '32px', padding: '24px', textAlign: 'center', fontSize: '12px', color: '#505050ff' }}>
                  <p>Generated by Travdek. Prices and availability are subject to change.</p>
              </div>
      
            </div> */}
           
          
            {/* Footer */}
              <div style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', marginTop: '32px', padding: '24px', textAlign: 'center', fontSize: '12px', color: '#505050ff' }}>
                  <p>Generated by Travdek. Prices and availability are subject to change.</p>
              </div>
      
            </div>
      
    
      
            {/* 👇 NEW SHARE MODAL UI PAasted HERE */}
            {/* {isShareModalOpen && (
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
            )} */}
      
      
    
      
          </div>


  );
}