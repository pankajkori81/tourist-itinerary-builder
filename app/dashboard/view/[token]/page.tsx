// ══════════════════════════════════════════════════════════════
// FILE: app/view/[token]/page.tsx
// PURPOSE: Public client-facing itinerary view page
//          NO login required — token is the only key
//          Client can view itinerary + approve/request changes
// ══════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect } from "react";
import { useParams }           from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Calendar, Users, CheckCircle2,
  Clock, MessageSquare, Loader2, AlertCircle,
  ChevronDown, ChevronUp, Plane, Hotel,
  Utensils, Car, Star, Globe, Send,
  ThumbsUp, ThumbsDown, XCircle, Info
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────
interface DayItem {
  type       : string;
  name       : string;
  description: string;
  isOptional : boolean;
  isIncluded : boolean;
  hotelName  : string;
  roomType   : string;
  starRating : number | null;
  slot       : string;
  duration   : string;
  startTime  : string;
  pickup     : string;
  dropoff    : string;
  vehicleType: string;
  journeyInfo: string;
}

interface DayActivity {
  dayNumber: number;
  city     : string;
  date     : string;
  items    : DayItem[];
}

interface FixedDeparture {
  month    : string;
  baseMonth: string;
  priceDBL : number;
  priceSGL : number;
  priceTRP : number;
  priceQUD : number;
}

interface ShareInfo {
  clientName: string;
  expiresAt : string;
  status    : string;
  token     : string;
}

interface ItineraryData {
  tripId           : string;
  tripName         : string;
  packageType      : string;
  tripStyle        : string;
  selectedCountries: string[];
  routingData      : any;
  numberOfTravelers: number;
  dayWiseActivities: DayActivity[];
  fixedDepartures  : FixedDeparture[];
  finalSellPrice   : number;
  selectedCurrency : string;
  seasonStartDate  : string;
  seasonEndDate    : string;
  shareInfo        : ShareInfo;
}

// ── Helpers ────────────────────────────────────────────────────
const fmt = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style   : "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);

const ITEM_ICON: Record<string, React.ReactNode> = {
  STAY      : <Hotel    size={16} className="text-purple-600" />,
  ACTIVITY  : <Star     size={16} className="text-amber-500"  />,
  TRANSPORT : <Car      size={16} className="text-blue-600"   />,
  MEAL      : <Utensils size={16} className="text-orange-500" />,
  FLIGHT    : <Plane    size={16} className="text-sky-600"    />,
};

const ITEM_BG: Record<string, string> = {
  STAY      : "bg-purple-50  border-purple-100",
  ACTIVITY  : "bg-amber-50   border-amber-100",
  TRANSPORT : "bg-blue-50    border-blue-100",
  MEAL      : "bg-orange-50  border-orange-100",
  FLIGHT    : "bg-sky-50     border-sky-100",
};

// ── ERROR SCREEN ───────────────────────────────────────────────
function ErrorScreen({
  code, message
}: { code: string; message: string }) {

  const config: Record<string,{
    icon: React.ReactNode; title: string; color: string; bg: string;
  }> = {
    NOT_FOUND   : { icon:<XCircle   size={48}/>, title:"Link Not Found",   color:"text-slate-500",  bg:"bg-slate-100"  },
    DEACTIVATED : { icon:<XCircle   size={48}/>, title:"Link Deactivated", color:"text-red-500",    bg:"bg-red-50"     },
    EXPIRED     : { icon:<Clock     size={48}/>, title:"Link Expired",     color:"text-amber-500",  bg:"bg-amber-50"   },
    DEFAULT     : { icon:<AlertCircle size={48}/>, title:"Error",          color:"text-slate-500",  bg:"bg-slate-100"  },
  };

  const cfg = config[code] ?? config.DEFAULT;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity:0, scale:0.95 }}
        animate={{ opacity:1, scale:1 }}
        className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center"
      >
        <div className={`w-20 h-20 ${cfg.bg} rounded-full flex items-center justify-center mx-auto mb-6 ${cfg.color}`}>
          {cfg.icon}
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-3">{cfg.title}</h2>
        <p className="text-slate-500 text-base leading-relaxed mb-8">{message}</p>
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Need help?</p>
          <p className="text-blue-600 font-bold text-sm mt-1">
            Sandeep@TravDek.com
          </p>
          <p className="text-slate-500 text-sm">+1 650 759 4331</p>
        </div>
      </motion.div>
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────
export default function ClientViewPage() {
  const params = useParams();
  const token  = params?.token as string;

  // ── State ──
  const [data,           setData]           = useState<ItineraryData | null>(null);
  const [isLoading,      setIsLoading]      = useState(true);
  const [error,          setError]          = useState<{code:string;message:string} | null>(null);
  const [selectedMonth,  setSelectedMonth]  = useState<string>("");
  const [expandedDays,   setExpandedDays]   = useState<Set<number>>(new Set([1]));
  const [showResponse,   setShowResponse]   = useState(false);
  const [responseAction, setResponseAction] = useState<"approved"|"changes_requested"|null>(null);
  const [clientMessage,  setClientMessage]  = useState("");
  const [clientName,     setClientName]     = useState("");
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [submitted,      setSubmitted]      = useState(false);
  const [submitMessage,  setSubmitMessage]  = useState("");

  // ── Fetch itinerary by token ──
  useEffect(() => {
    if (!token) return;
    (async () => {
      setIsLoading(true);
      try {
        const res  = await fetch(`/api/share/${token}`);
        const json = await res.json();

        if (!json.success) {
          setError({ code: json.code || "DEFAULT", message: json.message });
          return;
        }

        setData(json.data);
        // Default to first available month
        if (json.data.fixedDepartures?.length > 0) {
          setSelectedMonth(json.data.fixedDepartures[0].month);
        }
        // Pre-fill client name if provided
        if (json.data.shareInfo?.clientName) {
          setClientName(json.data.shareInfo.clientName);
        }
        // If already responded
        if (["approved","changes_requested"].includes(json.data.shareInfo?.status)) {
          setSubmitted(true);
          setSubmitMessage(
            json.data.shareInfo.status === "approved"
              ? "You have already approved this itinerary. Your advisor will contact you soon."
              : "Your change request has already been submitted."
          );
        }
      } catch (e) {
        setError({ code: "DEFAULT", message: "Failed to load itinerary. Please try again." });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token]);

  // ── Toggle day expansion ──
  const toggleDay = (dayNum: number) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      next.has(dayNum) ? next.delete(dayNum) : next.add(dayNum);
      return next;
    });
  };

  // ── Get selected pricing ──
  const selectedPrice = data?.fixedDepartures?.find(
    d => d.month === selectedMonth
  );

  // ── Submit response ──
  const handleSubmit = async () => {
    if (!responseAction) return;
    if (responseAction === "changes_requested" && !clientMessage.trim()) {
      alert("Please describe the changes you'd like.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res  = await fetch(`/api/share/${token}/respond`, {
        method  : "POST",
        headers : { "Content-Type": "application/json" },
        body    : JSON.stringify({
          action        : responseAction,
          clientMessage : clientMessage.trim(),
          selectedMonth,
          selectedPax   : data?.numberOfTravelers,
          clientName    : clientName.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        setSubmitMessage(json.message);
        setShowResponse(false);
      } else {
        alert(json.message || "Failed to submit. Please try again.");
      }
    } catch (e) {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Night count ──
  const totalNights = (data?.routingData?.routes || [])
    .reduce((sum: number, r: any) => sum + (r.nights || 0), 0);

  // ─────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
          <Plane className="text-white animate-pulse" size={28}/>
        </div>
        <p className="text-slate-500 text-sm font-semibold flex items-center gap-2">
          <Loader2 size={14} className="animate-spin text-blue-600"/>
          Loading your itinerary...
        </p>
      </div>
    </div>
  );

  if (error) return <ErrorScreen code={error.code} message={error.message}/>;
  if (!data)  return <ErrorScreen code="DEFAULT" message="Something went wrong."/>;

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* ── TOPBAR ── */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">T</span>
            </div>
            <span className="font-black text-slate-800 text-base">TRAVDEK</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <Info size={13}/>
            <span>
              Expires{" "}
              {new Date(data.shareInfo.expiresAt).toLocaleDateString("en-US",{
                month:"short", day:"numeric", year:"numeric"
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* ── HERO SECTION ── */}
        <motion.div
          initial={{ opacity:0, y:-12 }}
          animate={{ opacity:1, y:0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200"
        >
          {data.shareInfo.clientName && (
            <p className="text-blue-200 text-sm font-semibold mb-2">
              Prepared for {data.shareInfo.clientName}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
            {data.tripName}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {data.selectedCountries.length > 0 && (
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold">
                <Globe size={13}/> {data.selectedCountries.join(" · ")}
              </span>
            )}
            {totalNights > 0 && (
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold">
                <Calendar size={13}/> {totalNights+1} Days / {totalNights} Nights
              </span>
            )}
            {data.numberOfTravelers > 0 && (
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold">
                <Users size={13}/> {data.numberOfTravelers} Travelers
              </span>
            )}
          </div>
        </motion.div>

        {/* ── PRICING MONTH SELECTOR ── */}
        {data.fixedDepartures?.length > 0 && (
          <motion.div
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
          >
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={17} className="text-blue-600"/>
              Select Your Travel Month
            </h3>

            {/* Month pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {data.fixedDepartures.map(dep => (
                <button key={dep.month}
                  onClick={() => setSelectedMonth(dep.month)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                    selectedMonth === dep.month
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300"
                  }`}
                >
                  {dep.month}
                  {dep.priceDBL > 0 && (
                    <span className={`ml-2 text-xs font-semibold ${
                      selectedMonth === dep.month ? "text-blue-100" : "text-slate-400"
                    }`}>
                      {fmt(dep.priceDBL, data.selectedCurrency)}/pp
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Price summary */}
            {selectedPrice && selectedPrice.priceDBL > 0 && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedPrice.priceDBL > 0 && (
                    <div className="text-center">
                      <p className="text-xs text-slate-500 font-semibold mb-1">Twin/Double</p>
                      <p className="text-lg font-black text-blue-600">
                        {fmt(selectedPrice.priceDBL, data.selectedCurrency)}
                      </p>
                      <p className="text-[10px] text-slate-400">per person</p>
                    </div>
                  )}
                  {selectedPrice.priceSGL > 0 && (
                    <div className="text-center">
                      <p className="text-xs text-slate-500 font-semibold mb-1">Single</p>
                      <p className="text-lg font-black text-indigo-600">
                        {fmt(selectedPrice.priceSGL, data.selectedCurrency)}
                      </p>
                      <p className="text-[10px] text-slate-400">per person</p>
                    </div>
                  )}
                  {selectedPrice.priceTRP > 0 && (
                    <div className="text-center">
                      <p className="text-xs text-slate-500 font-semibold mb-1">Triple</p>
                      <p className="text-lg font-black text-purple-600">
                        {fmt(selectedPrice.priceTRP, data.selectedCurrency)}
                      </p>
                      <p className="text-[10px] text-slate-400">per person</p>
                    </div>
                  )}
                  {/* Total */}
                  <div className="text-center bg-blue-600 rounded-xl p-3">
                    <p className="text-xs text-blue-100 font-semibold mb-1">
                      Total ({data.numberOfTravelers} pax)
                    </p>
                    <p className="text-lg font-black text-white">
                      {fmt(selectedPrice.priceDBL * data.numberOfTravelers, data.selectedCurrency)}
                    </p>
                    <p className="text-[10px] text-blue-200">all inclusive</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 text-center mt-3 font-semibold">
                  * Prices are per person and may vary. Contact your advisor for final confirmation.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* ── ITINERARY DETAILS ── */}
        <motion.div
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.15 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="text-base font-bold text-slate-800">
              📋 Itinerary Details
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Day-by-day plan — click any day to expand
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {data.dayWiseActivities.map((day, idx) => {
              const isExpanded = expandedDays.has(day.dayNumber);
              return (
                <div key={day.dayNumber}>
                  {/* Day Header */}
                  <button
                    onClick={() => toggleDay(day.dayNumber)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-black text-sm">
                          {day.dayNumber}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          Day {day.dayNumber} · {day.city}
                        </p>
                        {day.date && (
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">
                            {new Date(day.date).toLocaleDateString("en-US",{
                              weekday:"short", month:"short", day:"numeric"
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {day.items?.length || 0} items
                      </span>
                      {isExpanded
                        ? <ChevronUp   size={16} className="text-slate-400"/>
                        : <ChevronDown size={16} className="text-slate-400"/>
                      }
                    </div>
                  </button>

                  {/* Day Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height:0, opacity:0 }}
                        animate={{ height:"auto", opacity:1 }}
                        exit={{ height:0, opacity:0 }}
                        transition={{ duration:0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 space-y-3">
                          {(day.items || []).length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 text-center">
                              No items for this day
                            </p>
                          ) : (
                            (day.items || []).map((item, iIdx) => (
                              <div key={iIdx}
                                className={`flex gap-3 p-4 rounded-xl border ${
                                  ITEM_BG[item.type] || "bg-slate-50 border-slate-100"
                                }`}
                              >
                                {/* Icon */}
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-white">
                                  {ITEM_ICON[item.type] || <Star size={16}/>}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <p className="text-sm font-black text-slate-800 leading-tight">
                                        {item.name || item.hotelName}
                                      </p>
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                        {item.type}
                                      </span>
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
                                      item.isOptional
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-emerald-100 text-emerald-700"
                                    }`}>
                                      {item.isOptional ? "OPTIONAL" : "INCLUDED"}
                                    </span>
                                  </div>

                                  {item.description && (
                                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                      {item.description}
                                    </p>
                                  )}

                                  {/* Details row */}
                                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                                    {item.slot && (
                                      <span className="text-[11px] text-slate-400 font-semibold">
                                        🕐 {item.slot}
                                      </span>
                                    )}
                                    {item.duration && (
                                      <span className="text-[11px] text-slate-400 font-semibold">
                                        ⏱ {item.duration}
                                      </span>
                                    )}
                                    {item.roomType && (
                                      <span className="text-[11px] text-slate-400 font-semibold">
                                        🛏 {item.roomType}
                                      </span>
                                    )}
                                    {item.starRating && (
                                      <span className="text-[11px] text-amber-500 font-bold">
                                        {"★".repeat(item.starRating)}
                                      </span>
                                    )}
                                    {item.pickup && (
                                      <span className="text-[11px] text-slate-400 font-semibold">
                                        📍 {item.pickup} → {item.dropoff}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── RESPONSE SECTION ── */}
        {submitted ? (
          <motion.div
            initial={{ opacity:0, scale:0.95 }}
            animate={{ opacity:1, scale:1 }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center"
          >
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4"/>
            <h3 className="text-xl font-black text-emerald-800 mb-2">
              Response Submitted!
            </h3>
            <p className="text-emerald-700 text-sm leading-relaxed">
              {submitMessage}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.2 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5"
          >
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Your Response
              </h3>
              <p className="text-xs text-slate-400 font-semibold">
                Please review the itinerary above and let us know your decision
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                onClick={() => {
                  setResponseAction("approved");
                  setShowResponse(true);
                }}
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                  responseAction === "approved"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400"
                }`}
              >
                <ThumbsUp size={18}/>
                ✅ I Approve This Itinerary
              </motion.button>

              <motion.button
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                onClick={() => {
                  setResponseAction("changes_requested");
                  setShowResponse(true);
                }}
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                  responseAction === "changes_requested"
                    ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-200"
                    : "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400"
                }`}
              >
                <ThumbsDown size={18}/>
                📝 Request Changes
              </motion.button>
            </div>

            {/* Response Form */}
            <AnimatePresence>
              {showResponse && responseAction && (
                <motion.div
                  initial={{ opacity:0, height:0 }}
                  animate={{ opacity:1, height:"auto" }}
                  exit={{ opacity:0, height:0 }}
                  transition={{ duration:0.2 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Client Name */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">
                      Your Name
                    </label>
                    <input type="text"
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 text-sm border border-slate-200 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">
                      {responseAction === "approved"
                        ? "Any special requests? (optional)"
                        : "What changes would you like? *"}
                    </label>
                    <textarea
                      rows={4}
                      value={clientMessage}
                      onChange={e => setClientMessage(e.target.value)}
                      placeholder={
                        responseAction === "approved"
                          ? "e.g. Dietary requirements, room preferences..."
                          : "Please describe the changes you'd like to make..."
                      }
                      className="w-full px-4 py-3 text-sm border border-slate-200 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60 shadow-lg ${
                      responseAction === "approved"
                        ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                        : "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
                    }`}
                  >
                    {isSubmitting
                      ? <><Loader2 size={16} className="animate-spin"/> Submitting...</>
                      : <><Send size={16}/>
                          {responseAction === "approved"
                            ? "Confirm Approval"
                            : "Submit Change Request"}
                        </>
                    }
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── CONTACT FOOTER ── */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:0.3 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center"
        >
          <p className="text-sm text-slate-500 font-semibold mb-3">
            Questions about your itinerary?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="mailto:Sandeep@TravDek.com"
              className="flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:underline">
              📧 Sandeep@TravDek.com
            </a>
            <a href="tel:+16507594331"
              className="flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:underline">
              📞 +1 650 759 4331
            </a>
          </div>
          <p className="text-[11px] text-slate-300 font-semibold mt-4">
            Powered by Travdek · Official B2B Travel Network
          </p>
        </motion.div>

      </div>
    </div>
  );
}