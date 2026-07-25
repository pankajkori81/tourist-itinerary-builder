// // ══════════════════════════════════════════════════════════════
// // FILE: app/dashboard/employee/page.tsx
// // PURPOSE: Dashboard shown to employees after login
// //          Shows only what employees need — no admin data
// // ══════════════════════════════════════════════════════════════

// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { motion } from "framer-motion";
// import {
//   Calendar, Briefcase, MapPin, Loader2,
//   Plane, Clock, CheckCircle2, AlertCircle,
//   TrendingUp, Users
// } from "lucide-react";
// import { useUser } from "@/app/context/UserContext";
// import { getLibrary, StoredItineraryData } from "@/utils/itineraryStorage";

// // ── helpers ──
// const parseDateSafe = (s?: string) => {
//   if (!s) return null;
//   const d = new Date(s);
//   return isNaN(d.getTime()) ? null : d;
// };

// const fmt = (n: number) =>
//   new Intl.NumberFormat("en-US", {
//     style: "currency", currency: "USD", maximumFractionDigits: 0
//   }).format(n);

// // ── Small stat card ──
// function StatCard({
//   icon: Icon, label, value, color, delay = 0
// }: {
//   icon: React.ElementType; label: string;
//   value: string | number; color: string; delay?: number;
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay, duration: 0.4 }}
//       whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(37,99,235,0.12)" }}
//       className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
//     >
//       <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
//         <Icon size={18} className="text-white" />
//       </div>
//       <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
//       <p className="text-2xl font-black text-slate-800">{value}</p>
//     </motion.div>
//   );
// }

// export default function EmployeeDashboard() {
//   const { user } = useUser();
//   const [trips,     setTrips]     = useState<StoredItineraryData[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       setIsLoading(true);
//       try {
//         const all = await getLibrary();
//         setTrips(all ?? []);
//       } catch (e) { console.error(e); }
//       finally { setIsLoading(false); }
//     })();
//   }, []);

//   // Only non-master trips
//   const ops = useMemo(
//     () => trips.filter(t => t.isMasterItinerary !== true),
//     [trips]
//   );

//   // Metrics relevant to employee
//   const stats = useMemo(() => {
//     const today    = new Date(); today.setHours(0,0,0,0);
//     let active = 0, upcoming = 0, completed = 0, totalRevenue = 0;

//     ops.forEach(t => {
//       if (t.bookingStatus === "cancelled") return;
//       const s = parseDateSafe(t.routingData?.startDate);
//       const e = parseDateSafe(t.routingData?.endDate) ?? s;
//       totalRevenue += Number(t.finalSellPrice) || 0;
//       if (!s) return;
//       if (e && e < today)       completed++;
//       else if (s <= today)      active++;
//       else                      upcoming++;
//     });

//     return { active, upcoming, completed, totalRevenue, total: ops.length };
//   }, [ops]);

//   // Upcoming trips (next 30 days)
//   const upcomingTrips = useMemo(() => {
//     const today  = new Date(); today.setHours(0,0,0,0);
//     const in30   = new Date(today); in30.setDate(in30.getDate() + 30);
//     return ops.filter(t => {
//       if (t.bookingStatus === "cancelled") return false;
//       const s = parseDateSafe(t.routingData?.startDate);
//       return s && s >= today && s <= in30;
//     }).sort((a, b) =>
//       (parseDateSafe(a.routingData?.startDate)?.getTime() ?? 0) -
//       (parseDateSafe(b.routingData?.startDate)?.getTime() ?? 0)
//     ).slice(0, 8);
//   }, [ops]);

//   // Status pill color
//   const statusPill = (status?: string) => {
//     if (status === "confirmed") return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     if (status === "cancelled") return "bg-red-50 text-red-700 border-red-200";
//     return "bg-amber-50 text-amber-700 border-amber-200";
//   };

//   if (isLoading) return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//       <div className="flex flex-col items-center gap-3">
//         <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-200">
//           <Plane className="text-white animate-pulse" size={24}/>
//         </div>
//         <p className="text-slate-500 text-sm font-semibold flex items-center gap-2">
//           <Loader2 size={14} className="animate-spin text-blue-600"/>
//           Loading your workspace...
//         </p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#F0F4FF]">
//       <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">

//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
//           className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
//         >
//           <div>
//             <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
//               Welcome back,{" "}
//               <span className="text-blue-600">{user?.name ?? "Employee"}</span> 👋
//             </h1>
//             <p className="text-sm text-slate-500 mt-1">
//               Here is your workspace overview for today.
//             </p>
//           </div>
//           <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 shadow-sm">
//             <Calendar size={14} className="text-blue-500"/>
//             {new Date().toLocaleDateString("en-US", {
//               weekday:"short", month:"long", day:"numeric", year:"numeric"
//             })}
//           </div>
//         </motion.div>

//         {/* Stat Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <StatCard icon={Briefcase}    label="Total Bookings"   value={stats.total}                color="bg-blue-600"    delay={0}    />
//           <StatCard icon={Clock}        label="Active Trips"     value={stats.active}               color="bg-indigo-500"  delay={0.07} />
//           <StatCard icon={TrendingUp}   label="Upcoming (30d)"  value={stats.upcoming}              color="bg-amber-500"   delay={0.14} />
//           <StatCard icon={CheckCircle2} label="Completed"        value={stats.completed}             color="bg-emerald-500" delay={0.21} />
//         </div>

//         {/* Upcoming Trips Table */}
//         <motion.div
//           initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.25 }}
//           className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
//         >
//           <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
//             <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
//               <Calendar size={17} className="text-blue-600"/>
//               Upcoming Trips (Next 30 Days)
//             </h3>
//             <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
//               {upcomingTrips.length} trips
//             </span>
//           </div>

//           {upcomingTrips.length === 0 ? (
//             <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
//               <AlertCircle size={32} className="opacity-30"/>
//               <p className="text-sm font-semibold">No upcoming trips in the next 30 days</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-100">
//                     {["Client","Trip","Destination","Start Date","Travelers","Value","Status"].map(h => (
//                       <th key={h}
//                         className="px-4 py-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {upcomingTrips.map((t, idx) => (
//                     <motion.tr key={t.id ?? idx}
//                       initial={{ opacity: 0, y: 4 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: idx * 0.04 }}
//                       className="hover:bg-blue-50/30 transition-colors"
//                     >
//                       {/* Client */}
//                       <td className="px-4 py-3.5">
//                         <div className="flex items-center gap-2">
//                           <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
//                             {(t.leadGuestName || t.creatingFor || "?")[0].toUpperCase()}
//                           </div>
//                           <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
//                             {t.leadGuestName || t.creatingFor || "—"}
//                           </span>
//                         </div>
//                       </td>
//                       {/* Trip */}
//                       <td className="px-4 py-3.5">
//                         <span className="text-xs font-semibold text-slate-700 max-w-[130px] truncate block">
//                           {t.tripName || "—"}
//                         </span>
//                       </td>
//                       {/* Destination */}
//                       <td className="px-4 py-3.5">
//                         <span className="text-xs text-slate-500 flex items-center gap-1">
//                           <MapPin size={11} className="text-blue-400"/>
//                           {(t.selectedCountries || []).join(", ") || "—"}
//                         </span>
//                       </td>
//                       {/* Start Date */}
//                       <td className="px-4 py-3.5">
//                         <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
//                           {t.routingData?.startDate || "TBA"}
//                         </span>
//                       </td>
//                       {/* Travelers */}
//                       <td className="px-4 py-3.5">
//                         <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
//                           <Users size={11} className="text-slate-400"/>
//                           {t.numberOfTravelers || 1} Pax
//                         </span>
//                       </td>
//                       {/* Value */}
//                       <td className="px-4 py-3.5">
//                         <span className="text-xs font-black text-emerald-600">
//                           {t.finalSellPrice ? fmt(Number(t.finalSellPrice)) : "TBD"}
//                         </span>
//                       </td>
//                       {/* Status */}
//                       <td className="px-4 py-3.5">
//                         <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full border ${statusPill(t.bookingStatus)}`}>
//                           {t.bookingStatus || "Quote"}
//                         </span>
//                       </td>
//                     </motion.tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </motion.div>

//         {/* Footer */}
//         <div className="text-center pb-2">
//           <p className="text-xs text-slate-400 font-medium">
//             Travdek Employee Portal · Showing your assigned trips only
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// }

























"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Briefcase, Loader2, Plane, Clock,
  CheckCircle2, AlertCircle, TrendingUp, Users,
  DollarSign, MapPin, Bell, Zap, Target,
  ChevronRight, Search, X, Filter, ArrowUpRight,
  Globe, BarChart2, UserCheck, AlertTriangle,
  ClipboardList, 
  Send
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell, CartesianGrid, BarChart, Bar
} from "recharts";
import { useUser } from "@/app/context/UserContext";
import { getLibrary, StoredItineraryData } from "@/utils/itineraryStorage";
import Link from "next/link";
// ── ADD this import at top with other imports ──
import TaskWidget from "@/components/dashboard/TaskWidget";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const MONTHS     = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PIE_COLORS = ["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US",{ style:"currency", currency:"USD", maximumFractionDigits:0 }).format(n);

const parseDateSafe = (s?: string): Date | null => {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};

const getMonthIdx  = (s?: string) => { const d = parseDateSafe(s); return d ? d.getMonth()    : -1; };
const daysUntil    = (s?: string): number => {
  const d = parseDateSafe(s);
  if (!d) return 999;
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((d.getTime() - today.getTime()) / 86400000);
};

// ─── CHART TOOLTIP ─────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/90 backdrop-blur-md border border-white/40 rounded-xl shadow-xl p-3 text-xs">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.name === "Revenue"
            ? `$${p.value >= 1000 ? `${(p.value/1000).toFixed(1)}k` : p.value}`
            : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── GLASS CARD ───────────────────────────────────────────────────────────────
function GlassCard({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.4, ease:"easeOut" }}
      className={`bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg shadow-blue-900/5 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
function KPICard({ icon: Icon, label, value, sub, color, trend, delay=0, pulse=false }: {
  icon: React.ElementType; label: string; value: string|number;
  sub?: string; color: string; trend?: number; delay?: number; pulse?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.4 }}
      whileHover={{ y:-5, boxShadow:"0 20px 40px rgba(59,130,246,0.15)" }}
      className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-5 shadow-lg shadow-blue-900/5 flex flex-col gap-3"
    >
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} relative`}>
          <Icon size={18} className="text-white"/>
          {pulse && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"/>
          )}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-bold flex items-center gap-0.5 px-2 py-1 rounded-full ${
            trend >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
          }`}>
            <TrendingUp size={10}/> {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-0.5">{label}</p>
        <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const { user } = useUser();

  const [trips,       setTrips]       = useState<StoredItineraryData[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [tableSearch, setTableSearch] = useState("");
  const [statusFilter,setStatusFilter]= useState("all");
  const [alertDismissed, setAlertDismissed] = useState(false);


  // ── NEW: Task panel states ──
const [showTasksPanel, setShowTasksPanel] = useState(false);
const [taskTabFilter,  setTaskTabFilter]  = useState<"all"|"pending"|"in_progress"|"completed"|"overdue">("all");
const [empTasks,       setEmpTasks]       = useState<any[]>([]);
const [tasksLoading,   setTasksLoading]   = useState(false);
const [updatingTask,   setUpdatingTask]   = useState<string|null>(null);
const [overviewTimeFilter, setOverviewTimeFilter] = useState<"1d"|"7d"|"1m">("1m");
const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

const [commentText, setCommentText] = useState("");
const [isSendingComment, setIsSendingComment] = useState(false);

const handleSendComment = async (taskId: string) => {
  if (!commentText.trim()) return;
  setIsSendingComment(true);
  try {
    const res = await fetch(`/api/tasks/${taskId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: commentText }),
    });
    const json = await res.json();
    if (json.success) {
      // Update the specific task in the local state with the new comment array
      setEmpTasks(prev => prev.map(t => t._id === taskId ? json.data : t));
      setCommentText(""); // Clear the input
    }
  } catch (error) {
    console.error("Failed to send comment:", error);
  } finally {
    setIsSendingComment(false);
  }
};

  // ── Fetch ──────────────────────────────────────────────────────────────────
 
  // ── Fetch employee's own tasks ─────────────────────────────
const fetchEmpTasks = async () => {
  setTasksLoading(true);
  try {
    const res  = await fetch("/api/tasks");
    const json = await res.json();
    if (json.success) setEmpTasks(json.data);
  } catch(e) { console.error(e); }
  finally { setTasksLoading(false); }
};

// ── Update task status ─────────────────────────────────────
const updateEmpTaskStatus = async (taskId: string, status: string) => {
  setUpdatingTask(taskId);
  try {
    const res  = await fetch(`/api/tasks/${taskId}`, {
      method  : "PUT",
      headers : { "Content-Type": "application/json" },
      body    : JSON.stringify({ status }),
    });
    const json = await res.json();
    if (json.success) {
      setEmpTasks(prev => prev.map(t => t._id === taskId ? json.data : t));
    }
  } catch(e) { console.error(e); }
  finally { setUpdatingTask(null); }
};

// Fetch tasks when panel opens
useEffect(() => {
  if (showTasksPanel) fetchEmpTasks();
}, [showTasksPanel]);
 
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const all = await getLibrary();
        setTrips(all ?? []);
      } catch(e) { console.error(e); }
      finally { setIsLoading(false); }
    })();
  }, []);

  const ops = useMemo(() => trips.filter(t => t.isMasterItinerary !== true), [trips]);

  // ── Core Metrics ───────────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const today    = new Date(); today.setHours(0,0,0,0);
    const guestSet = new Set<string>();
    let totalBookings=0, totalRevenue=0, active=0, upcoming=0, completed=0, cancelled=0;

    ops.forEach(t => {
      if (t.bookingStatus === "cancelled") { cancelled++; return; }
      totalBookings++;
      totalRevenue += Number(t.finalSellPrice) || 0;
      const g = (t.leadGuestName || t.creatingFor || "").trim().toLowerCase();
      if (g) guestSet.add(g);
      const s = parseDateSafe(t.routingData?.startDate);
      const e = parseDateSafe(t.routingData?.endDate) ?? s;
      if (s && e) {
        if (e < today) completed++;
        else if (s <= today) active++;
        else upcoming++;
      }
    });

    const monthlyTarget = (user as any)?.monthlyTarget || 20000;
    const thisMonth     = new Date().getMonth();
    const monthRevenue  = ops.filter(t =>
      getMonthIdx(t.routingData?.startDate) === thisMonth
    ).reduce((sum, t) => sum + (Number(t.finalSellPrice) || 0), 0);

    return {
      totalBookings, totalRevenue, active, upcoming, completed, cancelled,
      totalCustomers: guestSet.size,
      monthlyTarget, monthRevenue,
      targetPct: Math.min(Math.round((monthRevenue / monthlyTarget) * 100), 100),
    };
  }, [ops, user]);

  // ── Priority Alerts (departing ≤ 48hrs) ───────────────────────────────────
  const urgentTrips = useMemo(() => {
    return ops.filter(t => {
      if (t.bookingStatus === "cancelled") return false;
      const du = daysUntil(t.routingData?.startDate);
      return du >= 0 && du <= 2;
    }).sort((a,b) => daysUntil(a.routingData?.startDate) - daysUntil(b.routingData?.startDate));
  }, [ops]);

  // ── Today's Schedule ───────────────────────────────────────────────────────
  const todaySchedule = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return ops.filter(t =>
      t.routingData?.startDate?.startsWith(today) ||
      t.routingData?.endDate?.startsWith(today)
    ).slice(0, 5);
  }, [ops]);

  // ── Smart Alerts ──────────────────────────────────────────────────────────
  const smartAlerts = useMemo(() => {
    const alerts: { type:"warn"|"info"|"success"; msg: string }[] = [];
    const today = new Date(); today.setHours(0,0,0,0);
    const in7   = new Date(today); in7.setDate(in7.getDate() + 7);
    const staleQuotes = ops.filter(t => {
      if (t.bookingStatus !== "quote") return false;
      const created = parseDateSafe((t as any).createdAt);
      return created && (today.getTime() - created.getTime()) > 7 * 86400000;
    });
    if (staleQuotes.length > 0)
      alerts.push({ type:"warn", msg:`${staleQuotes.length} quote(s) pending 7+ days — follow up needed` });
    if (metrics.cancelled > 0)
      alerts.push({ type:"warn", msg:`${metrics.cancelled} trip(s) cancelled this period` });
    if (metrics.targetPct >= 80)
      alerts.push({ type:"success", msg:`Great work! You're at ${metrics.targetPct}% of monthly target` });
    else
      alerts.push({ type:"info", msg:`Monthly target: ${metrics.targetPct}% achieved — $${(metrics.monthlyTarget - metrics.monthRevenue).toLocaleString()} remaining` });
    if (urgentTrips.length > 0)
      alerts.push({ type:"warn", msg:`${urgentTrips.length} trip(s) departing within 48 hours` });
    return alerts.slice(0, 5);
  }, [ops, metrics, urgentTrips]);

  // ── Revenue Chart ──────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    const g: Record<string,{trips:number;revenue:number}> = {};
    MONTHS.forEach(m => { g[m] = { trips:0, revenue:0 }; });
    ops.forEach(t => {
      const m = getMonthIdx(t.routingData?.startDate);
      if (m < 0) return;
      g[MONTHS[m]].trips++;
      g[MONTHS[m]].revenue += Number(t.finalSellPrice) || 0;
    });
    return MONTHS.map(m => ({ month:m, Trips:g[m].trips, Revenue:g[m].revenue }));
  }, [ops]);

  // ── Trip Status Donut ──────────────────────────────────────────────────────
  const statusData = useMemo(() => {
    const confirmed = ops.filter(t => t.bookingStatus === "confirmed").length;
    const quote     = ops.filter(t => t.bookingStatus === "quote" || !t.bookingStatus).length;
    const done      = metrics.completed;
    const cancelled = metrics.cancelled;
    return [
      { name:"Confirmed", value:confirmed },
      { name:"Completed", value:done },
      { name:"Quote",     value:quote },
      { name:"Cancelled", value:cancelled },
    ].filter(d => d.value > 0);
  }, [ops, metrics]);

  // ── Top Destinations ───────────────────────────────────────────────────────
  const topDest = useMemo(() => {
    const counts: Record<string,number> = {};
    ops.forEach(t => (t.selectedCountries ?? []).slice(0,1).forEach(c => {
      counts[c] = (counts[c] ?? 0) + 1;
    }));
    const total = ops.length || 1;
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, pct: Math.round((value/total)*100) }))
      .sort((a,b) => b.value - a.value).slice(0, 5);
  }, [ops]);

  // ── Filtered Table Rows ────────────────────────────────────────────────────
  const tableRows = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const in30  = new Date(today); in30.setDate(in30.getDate() + 30);
    return ops.filter(t => {
      if (t.bookingStatus === "cancelled") return false;
      const s = parseDateSafe(t.routingData?.startDate);
      if (!s || s < today || s > in30) return false;
      const q  = tableSearch.toLowerCase();
      const ms = !q || (t.tripName ?? "").toLowerCase().includes(q) ||
        (t.leadGuestName ?? "").toLowerCase().includes(q);
      const mf = statusFilter === "all" || (t.bookingStatus || "quote") === statusFilter;
      return ms && mf;
    }).sort((a,b) =>
      (parseDateSafe(a.routingData?.startDate)?.getTime() ?? 0) -
      (parseDateSafe(b.routingData?.startDate)?.getTime() ?? 0)
    );
  }, [ops, tableSearch, statusFilter]);

  // ─────────────────────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background:"linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 50%,#F0FDF4 100%)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-300">
          <Plane className="text-white animate-pulse" size={28}/>
        </div>
        <p className="text-slate-500 text-sm font-semibold flex items-center gap-2">
          <Loader2 size={14} className="animate-spin text-blue-600"/> Loading your workspace...
        </p>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative"
      style={{ background:"linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 40%,#F0FDF4 100%)" }}>

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"/>
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl"/>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl"/>
      </div>

      <div className="relative max-w-[1600px] mx-auto px-6 py-8 space-y-5">

        {/* ════════════════════════════════════════════════════
            HEADER
        ════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              Welcome back,{" "}
              <span className="text-blue-600">{user?.name ?? "Employee"}</span> 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Here is your workspace overview for today.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Date */}
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/60 rounded-xl px-4 py-2.5 text-sm text-slate-600 shadow-sm">
              <Calendar size={14} className="text-blue-500"/>
              {new Date().toLocaleDateString("en-US",{
                weekday:"short", month:"long", day:"numeric", year:"numeric"
              })}
            </div>

              {/* Tasks Tab Button with Badge */}
  <motion.button
    whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
    onClick={() => setShowTasksPanel(p => !p)}
    className={`relative flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl border transition-all shadow-sm ${
      showTasksPanel
        ? "bg-blue-600 text-white border-blue-600 shadow-blue-200"
        : "bg-white/70 backdrop-blur-md border-white/60 text-slate-700 hover:bg-white"
    }`}
  >
    <ClipboardList size={15}/>
    Tasks
    {/* Red badge with active task count */}
    {empTasks.filter(t => t.status !== "completed").length > 0 && (
      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm border-2 border-white">
        {empTasks.filter(t => t.status !== "completed").length}
      </span>
    )}
  </motion.button>

            {/* Quick Actions */}
            <Link href="/dashboard/itinerary/create">
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-300/40 transition-colors">
                <Zap size={15}/> New Itinerary
              </motion.button>
            </Link>
            <Link href="/dashboard/trips">
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/60 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors hover:bg-white">
                <Briefcase size={15}/> My Trips
              </motion.button>
            </Link>
          </div>
        </motion.div>


        {/* ════════════════════════════════════════════════════
    TASKS MODAL — opens over the page like admin modals
════════════════════════════════════════════════════ */}

{/* ════════════════════════════════════════════════════
            TASKS MODAL — ADVANCED ENTERPRISE DESIGN
        ════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {showTasksPanel && (
            <>
              
              <motion.div
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                onClick={() => setShowTasksPanel(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
              />

             
              <motion.div
                initial={{ opacity:0, scale:0.95, y:20 }}
                animate={{ opacity:1, scale:1,    y:0  }}
                exit={{   opacity:0, scale:0.95, y:20  }}
                transition={{ duration:0.25, ease:"easeOut" }}
                className="fixed ml-25 inset-x-4 top-[3%] bottom-[3%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[70%] z-50 flex flex-col bg-white rounded-[2rem] shadow-2xl shadow-slate-900/20 overflow-hidden border border-slate-100"
              >
             
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 flex-shrink-0 bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <ClipboardList size={20} className="text-white"/>
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-800 tracking-tight">My Tasks</h2>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        Manage and update your assigned tasks
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                      <span className="text-xs font-extrabold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200/60">
                        {empTasks.length} Total
                      </span>
                      {empTasks.filter(t => t.status === "overdue").length > 0 && (
                        <span className="text-xs font-extrabold bg-red-50 text-red-600 px-3 py-1.5 rounded-full border border-red-100 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
                          {empTasks.filter(t => t.status === "overdue").length} Overdue
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTasksPanel(false)}
                    className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    <X size={20}/>
                  </button>
                </div>

                <div className="px-8 py-4 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                  <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
                    {([
                      { key:"all",         label:"All Tasks",   count: empTasks.length },
                      { key:"pending",     label:"Pending",     count: empTasks.filter(t=>t.status==="pending").length },
                      { key:"in_progress", label:"In Progress", count: empTasks.filter(t=>t.status==="in_progress").length },
                      { key:"completed",   label:"Completed",   count: empTasks.filter(t=>t.status==="completed").length },
                      { key:"overdue",     label:"Overdue",     count: empTasks.filter(t=>t.status==="overdue").length },
                    ] as const).map(tab => {
                      const isActive = taskTabFilter === tab.key;
                      return (
                        <button key={tab.key}
                          onClick={() => setTaskTabFilter(tab.key as any)}
                          className={`relative flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                            isActive
                              ? "bg-slate-900 text-white shadow-md"
                              : "bg-white text-slate-600 hover:bg-slate-200/50 border border-slate-200 shadow-sm hover:text-slate-800"
                          }`}
                        >
                          {tab.label}
                          {tab.count > 0 && (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-colors ${
                              isActive
                                ? "bg-white/20 text-white"
                                : tab.key === "overdue" ? "bg-red-100 text-red-600"
                                : tab.key === "in_progress" ? "bg-blue-100 text-blue-600"
                                : "bg-slate-100 text-slate-500"
                            }`}>
                              {tab.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Task Grid (Scrollable) ── */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
                  {tasksLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
                      <Loader2 size={32} className="animate-spin text-blue-500"/>
                      <span className="text-sm font-bold text-slate-500">Syncing your workspace...</span>
                    </div>
                  ) : (() => {
                    const filtered = empTasks.filter(t =>
                      taskTabFilter === "all" ? true : t.status === taskTabFilter
                    );

                    if (filtered.length === 0) return (
                      <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400 bg-white border border-dashed border-slate-200 rounded-[2rem] p-12">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                          <CheckCircle2 size={40} className="text-slate-300"/>
                        </div>
                        <div className="text-center">
                          <p className="text-base font-bold text-slate-700">
                            {taskTabFilter === "all" ? "You're all caught up!" : `No ${taskTabFilter.replace("_"," ")} tasks`}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            {taskTabFilter === "all" ? "Enjoy your day, your admin will assign tasks here." : "Try changing your filters."}
                          </p>
                        </div>
                      </div>
                    );

                    const PRIORITY_CONFIG: Record<string,{dot:string;badge:string;label:string}> = {
                      urgent : { dot:"bg-red-500",    badge:"bg-red-50 text-red-700 border-red-200",       label:"🔴 URGENT" },
                      high   : { dot:"bg-orange-500", badge:"bg-orange-50 text-orange-700 border-orange-200",label:"🟠 HIGH"   },
                      medium : { dot:"bg-blue-500",   badge:"bg-blue-50 text-blue-700 border-blue-200",    label:"🔵 MEDIUM" },
                      low    : { dot:"bg-emerald-500",badge:"bg-emerald-50 text-emerald-700 border-emerald-200",label:"🟢 LOW"  },
                    };
                    const CATEGORY_ICON: Record<string,string> = {
                      follow_up:"📞", document:"📄", client:"👤", operations:"✈️", other:"📋"
                    };
                    const daysUntil = (d: string) => {
                      const date  = new Date(d);
                      const today = new Date(); today.setHours(0,0,0,0);
                      return Math.ceil((date.getTime() - today.getTime()) / 86400000);
                    };

                    return (
                      <div className="grid grid-cols-1 gap-5">
                        {filtered
                          .sort((a:any, b:any) => {
                            const order: Record<string,number> = { overdue:5,urgent:4,high:3,medium:2,low:1 };
                            const ap = a.status==="overdue"?5:order[a.priority]??0;
                            const bp = b.status==="overdue"?5:order[b.priority]??0;
                            if (bp!==ap) return bp-ap;
                            return new Date(a.deadline).getTime()-new Date(b.deadline).getTime();
                          })
                          .map((task:any, idx:number) => {
                            const du         = daysUntil(task.deadline);
                            const isOverdue  = task.status==="overdue" || (task.status!=="completed" && du<0);
                            const isDone     = task.status==="completed";
                            const isActive   = task.status==="in_progress";
                            const isUpdating = updatingTask===task._id;
                            const config     = PRIORITY_CONFIG[task.priority];
                            const isExpanded = expandedTaskId === task._id;

                            return (
                              <motion.div key={task._id}
                                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                                transition={{ delay:idx*0.04 }}
                                className={`relative rounded-[1.5rem] border flex flex-col overflow-hidden transition-all duration-300 ${
                                  isDone    ? "bg-slate-50/50 border-slate-200/60"
                                  :isOverdue? "bg-red-50/30 border-red-200"
                                  :isActive ? "bg-blue-50/30 border-blue-200"
                                  :           "bg-white border-slate-200"
                                } ${isExpanded ? "shadow-xl shadow-slate-900/5 ring-4 ring-blue-50/50 border-blue-300" : "hover:shadow-md hover:border-slate-300"}`}
                              >
                              
                                <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                                  isDone    ? "bg-slate-300" : isOverdue ? "bg-red-500"
                                  :isActive  ? "bg-blue-500" : config?.dot ?? "bg-slate-300"
                                }`}/>

                                <div 
                                  onClick={() => setExpandedTaskId(prev => prev === task._id ? null : task._id)}
                                  className="p-6 pl-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group/card bg-transparent"
                                >
                                 
                                  <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-colors ${isExpanded ? "bg-blue-100" : "bg-slate-100 group-hover/card:bg-slate-200"}`}>
                                      {CATEGORY_ICON[task.category]??"📋"}
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                      <p className={`text-base font-black leading-tight transition-colors ${
                                        isDone ? "line-through text-slate-400" : "text-slate-800 group-hover/card:text-blue-600"
                                      }`}>
                                        {task.title}
                                      </p>
                                     
                                      {task.description && !isExpanded && (
                                        <p className="text-xs font-semibold text-slate-500 mt-1 line-clamp-1 pr-4">
                                          {task.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap md:flex-nowrap items-center gap-2 flex-shrink-0">
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                                      isOverdue ? "bg-red-50 text-red-700 border-red-200" : config?.badge
                                    }`}>
                                      {isOverdue?"⚡ OVERDUE":config?.label}
                                    </span>
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                      isDone   ? "bg-emerald-100 text-emerald-700"
                                      :isActive ? "bg-blue-100 text-blue-700"
                                      :isOverdue? "bg-red-100 text-red-700"
                                      :           "bg-slate-100 text-slate-600"
                                    }`}>
                                      {task.status.replace("_"," ")}
                                    </span>
                                    
                                    <div className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full ml-2 ${
                                      isDone ? "text-emerald-600 bg-emerald-50" : isOverdue ? "text-red-600 bg-red-50" : du===0 ? "text-orange-600 bg-orange-50" : "text-slate-600 bg-slate-100"
                                    }`}>
                                      {isDone ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                                      {isDone ? "Completed" : isOverdue ? `Overdue (${Math.abs(du)}d)` : du===0 ? "Due TODAY" : `Due in ${du}d`}
                                    </div>

                                    <div className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isExpanded ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400 group-hover/card:bg-slate-200 group-hover/card:text-slate-700"}`}>
                                      <ChevronRight size={16} className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
                                    </div>
                                  </div>
                                </div>

                              
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="overflow-hidden bg-slate-50/80 border-t border-slate-100"
                                    >
                                      <div className="p-8 pl-10 space-y-6">
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                       
                                          <div className="space-y-6">
                                            
                                            <div>
                                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <Briefcase size={12}/> Details & Instructions
                                              </p>
                                              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-sm text-slate-700 font-medium leading-relaxed shadow-sm">
                                                {task.description || <span className="text-slate-400 italic">No specific instructions provided for this task.</span>}
                                              </div>
                                            </div>

                                           
                                            <div className="grid grid-cols-2 gap-4">
                                              {task.linkedTripId && (
                                                <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col gap-1.5 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group/trip">
                                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Linked Trip</p>
                                                  <p className="text-xs text-blue-600 font-bold truncate group-hover/trip:text-blue-700">✈️ {task.linkedTripId.tripName}</p>
                                                </div>
                                              )}
                                              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Assigned By</p>
                                                <div className="flex items-center gap-2">
                                                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-black text-slate-600">
                                                    {task.assignedBy?.name?.[0] || "A"}
                                                  </div>
                                                  <p className="text-xs text-slate-800 font-bold truncate">{task.assignedBy?.name || "Admin"}</p>
                                                </div>
                                              </div>
                                            </div>
                                            
                                       
                                            {!isDone && (
                                              <div className="flex gap-3 pt-2">
                                                {task.status==="pending" && (
                                                  <button
                                                    onClick={(e) => { e.stopPropagation(); updateEmpTaskStatus(task._id,"in_progress"); }}
                                                    disabled={isUpdating}
                                                    className="flex items-center gap-2 text-sm font-bold px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all disabled:opacity-60 flex-1 justify-center shadow-lg shadow-slate-900/20"
                                                  >
                                                    {isUpdating ? <Loader2 size={16} className="animate-spin"/> : <TrendingUp size={16}/>}
                                                    Start Working
                                                  </button>
                                                )}
                                                {(task.status==="in_progress"||task.status==="overdue") && (
                                                  <>
                                                    {task.status==="overdue" && (
                                                      <button
                                                        onClick={(e) => { e.stopPropagation(); updateEmpTaskStatus(task._id,"in_progress"); }}
                                                        disabled={isUpdating}
                                                        className="flex items-center gap-2 text-sm font-bold px-4 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl transition-all disabled:opacity-60 justify-center shadow-sm hover:shadow-md"
                                                      >
                                                        <TrendingUp size={16} className="text-orange-500"/> Restart
                                                      </button>
                                                    )}
                                                    <button
                                                      onClick={(e) => { e.stopPropagation(); updateEmpTaskStatus(task._id,"completed"); }}
                                                      disabled={isUpdating}
                                                      className="flex items-center gap-2 text-sm font-bold px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-60 flex-1 justify-center shadow-lg shadow-emerald-500/20"
                                                    >
                                                      {isUpdating ? <Loader2 size={16} className="animate-spin"/> : <CheckCircle2 size={16}/>}
                                                      Mark as Completed
                                                    </button>
                                                  </>
                                                )}
                                              </div>
                                            )}
                                          </div>

                                         
                                          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                                          
                                            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                              <p className="text-xs font-black text-slate-700 flex items-center gap-2">
                                                <Users size={14} className="text-blue-600"/> Discussion & Updates
                                              </p>
                                              <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-500">
                                                {(task.comments || []).length} 
                                              </span>
                                            </div>

                                         
                                            <div className="flex-1 p-5 overflow-y-auto space-y-5 custom-scrollbar bg-slate-50/50">
                                              {!(task.comments && task.comments.length > 0) ? (
                                                <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-60">
                                                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                                                    <Send size={16} className="text-slate-400 ml-1"/>
                                                  </div>
                                                  <p className="text-xs text-slate-500 font-bold">No activity yet</p>
                                                  <p className="text-[10px] text-slate-400 max-w-[150px]">Leave a note, ask a question, or log an update.</p>
                                                </div>
                                              ) : (
                                                task.comments.map((msg: any, i: number) => {
                                                  // Optional: check if sender is the current logged in user to right-align, 
                                                  // but for a task feed, left aligned is standard.
                                                  return (
                                                  <div key={i} className="flex gap-3 items-start group/msg">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 shadow-sm border border-slate-600">
                                                      {msg.senderName?.[0]?.toUpperCase() || "U"}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                      <div className="flex items-baseline gap-2 mb-1 pl-1">
                                                        <p className="text-xs font-bold text-slate-800">{msg.senderName}</p>
                                                        <p className="text-[9px] text-slate-400 font-semibold opacity-0 group-hover/msg:opacity-100 transition-opacity">
                                                          {new Date(msg.timestamp).toLocaleDateString("en-US", { month:"short", day:"numeric" })} at {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </p>
                                                      </div>
                                                      <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm border border-slate-200 shadow-sm inline-block max-w-[95%]">
                                                        <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                                                          {msg.text}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )})
                                              )}
                                            </div>

                                          
                                            <div className="p-4 bg-white border-t border-slate-100">
                                              <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                                                <textarea
                                                  rows={1}
                                                  placeholder="Type an update or comment..."
                                                  value={commentText}
                                                  onChange={(e) => setCommentText(e.target.value)}
                                                  onClick={(e) => e.stopPropagation()} 
                                                  className="flex-1 resize-none bg-transparent px-3 py-2 text-sm font-medium text-slate-700 outline-none custom-scrollbar max-h-32 min-h-[40px]"
                                                />
                                                <button
                                                  onClick={(e) => { e.stopPropagation(); handleSendComment(task._id); }}
                                                  disabled={!commentText.trim() || isSendingComment}
                                                  className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-md shadow-blue-600/20 mb-0.5 mr-0.5"
                                                >
                                                  {isSendingComment ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5"/>}
                                                </button>
                                              </div>
                                              <p className="text-[9px] text-slate-400 text-center font-semibold mt-2">
                                                Updates are visible to admins and assigned team members.
                                              </p>
                                            </div>
                                          </div>

                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            );
                          })
                        }
                      </div>
                    );
                  })()}
                </div>

                {/* ── Modal Footer ── */}
                <div className="px-8 py-4 border-t border-slate-100 bg-white flex-shrink-0 flex justify-between items-center">
                  <p className="text-xs text-slate-400 font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
                    Live Sync Active
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    Travdek Employee Workspace
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

                     
        

        {/* ════════════════════════════════════════════════════
            PRIORITY ALERT BANNER
        ════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {urgentTrips.length > 0 && !alertDismissed && (
            <motion.div
              initial={{ opacity:0, height:0, y:-10 }}
              animate={{ opacity:1, height:"auto", y:0 }}
              exit={{ opacity:0, height:0 }}
              transition={{ duration:0.3 }}
              className="bg-red-500/90 backdrop-blur-md border border-red-400/50 rounded-2xl px-5 py-4 flex items-start justify-between gap-4 shadow-lg shadow-red-500/20"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle size={16} className="text-white"/>
                </div>
                <div>
                  <p className="text-white font-black text-sm">
                    🚨 URGENT: {urgentTrips.length} trip{urgentTrips.length>1?"s":""} departing within 48 hours
                  </p>
                  <div className="mt-1.5 space-y-1">
                    {urgentTrips.slice(0,3).map((t,i) => {
                      const du = daysUntil(t.routingData?.startDate);
                      return (
                        <p key={i} className="text-red-100 text-xs font-semibold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"/>
                          {t.tripName} — {t.leadGuestName || "Client"} →{" "}
                          <span className="font-black text-white">
                            {du === 0 ? "TODAY" : du === 1 ? "TOMORROW" : `in ${du} days`}
                          </span>
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
              <button onClick={() => setAlertDismissed(true)}
                className="text-white/70 hover:text-white flex-shrink-0 mt-0.5">
                <X size={18}/>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════════════════
            MAIN GRID: LEFT CONTENT + RIGHT SIDEBAR
        ════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

          {/* ── LEFT CONTENT (col-9) ─────────────────────── */}
          <div className="xl:col-span-9 space-y-5">

            {/* ── ROW 1: KPI CARDS (5 cols) ── */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <KPICard icon={Briefcase}    label="Total Bookings"  value={metrics.totalBookings}
                sub="Confirmed trips" color="bg-blue-600"    delay={0}    />
              <KPICard icon={DollarSign}   label="Total Revenue"   value={fmt(metrics.totalRevenue)}
                sub="All confirmed"   color="bg-emerald-500" delay={0.06} />
              <KPICard icon={Clock}        label="Active Now"      value={metrics.active}
                sub="In progress"     color="bg-indigo-500"  delay={0.12} pulse={metrics.active > 0} />
              <KPICard icon={TrendingUp}   label="Upcoming (30d)"  value={metrics.upcoming}
                sub="Next 30 days"    color="bg-amber-500"   delay={0.18} />
              <KPICard icon={CheckCircle2} label="Completed"       value={metrics.completed}
                sub="Finished trips"  color="bg-teal-500"    delay={0.24} />
            </div>

            {/* ── MONTHLY TARGET PROGRESS ── */}
            <GlassCard className="p-5" delay={0.28}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-blue-600"/>
                  <span className="text-sm font-bold text-slate-700">Monthly Revenue Target</span>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                  metrics.targetPct >= 100 ? "bg-emerald-100 text-emerald-700" :
                  metrics.targetPct >= 70  ? "bg-blue-100 text-blue-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {metrics.targetPct}% achieved
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width:0 }} animate={{ width:`${metrics.targetPct}%` }}
                  transition={{ duration:1.2, ease:"easeOut", delay:0.3 }}
                  className={`h-full rounded-full ${
                    metrics.targetPct >= 100 ? "bg-emerald-500" :
                    metrics.targetPct >= 70  ? "bg-blue-500" : "bg-amber-500"
                  }`}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-slate-500 font-semibold">
                  {fmt(metrics.monthRevenue)} earned this month
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  Target: {fmt(metrics.monthlyTarget)}
                </span>
              </div>
            </GlassCard>

              {/* ── TASK OVERVIEW WIDGET ── */}
            <GlassCard className="p-5" delay={0.18}>
              {(() => {
                // 1. FILTER LOGIC: Filter tasks dynamically based on the selected timeframe
                const now = new Date().getTime();
                const timeFilteredTasks = empTasks.filter(t => {
                  if (!t.deadline && !t.createdAt) return true;
                  const targetDate = new Date(t.deadline || t.createdAt).getTime();
                  const diffInDays = Math.abs((targetDate - now) / (1000 * 60 * 60 * 24));

                  if (overviewTimeFilter === "1d") return diffInDays <= 1;
                  if (overviewTimeFilter === "7d") return diffInDays <= 7;
                  if (overviewTimeFilter === "1m") return diffInDays <= 30;
                  return true;
                });

                // 2. Calculate stats from the FILTERED tasks, not all empTasks
                const inProgress  = timeFilteredTasks.filter(t => t.status === "in_progress").length;
                const underReview = timeFilteredTasks.filter(t => t.status === "pending").length;
                const finished    = timeFilteredTasks.filter(t => t.status === "completed").length;
                const overdue     = timeFilteredTasks.filter(t => t.status === "overdue").length;
                const total       = timeFilteredTasks.length || 1;

                // 3. Bar segment widths
                const inProgressPct  = Math.round((inProgress  / total) * 100);
                const underReviewPct = Math.round((underReview / total) * 100);
                const finishedPct    = Math.round((finished    / total) * 100);
                const overduePct     = Math.max(0, 100 - inProgressPct - underReviewPct - finishedPct);

                return (
                  <div className="space-y-4">

                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                          <ClipboardList size={15} className="text-blue-600"/>
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">Task overview</p>
                          <p className="text-[11px] text-slate-400 font-semibold">
                            Overview spread to {overviewTimeFilter === "1m" ? "30 days" : overviewTimeFilter === "7d" ? "7 days" : "24 hours"}
                          </p>
                        </div>
                      </div>

                      {/* Dynamic Time filter pills */}
                      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                        {(["1d", "7d", "1m"] as const).map((t) => (
                          <button key={t}
                            onClick={() => setOverviewTimeFilter(t)}
                            className={`text-[10px] font-black px-2 py-1 rounded-lg transition-all ${
                              overviewTimeFilter === t
                                ? "bg-white text-slate-800 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Task count + segmented bar */}
                    <div>
                      <p className="text-xs font-black text-slate-700 mb-2.5">
                        Task{" "}
                        <span className="text-slate-400 font-bold">
                          ({timeFilteredTasks.length})
                        </span>
                      </p>

                      {/* Segmented progress bar */}
                      {timeFilteredTasks.length === 0 ? (
                        <div className="w-full h-3 bg-slate-100 rounded-full"/>
                      ) : (
                        <div className="w-full h-3 rounded-full overflow-hidden flex gap-0.5">
                          {inProgress > 0 && (
                            <motion.div
                              initial={{ width:0 }} animate={{ width:`${inProgressPct}%` }}
                              transition={{ duration:0.8, delay:0.1 }}
                              className="h-full bg-blue-500 rounded-full"
                            />
                          )}
                          {underReview > 0 && (
                            <motion.div
                              initial={{ width:0 }} animate={{ width:`${underReviewPct}%` }}
                              transition={{ duration:0.8, delay:0.2 }}
                              className="h-full bg-orange-400 rounded-full"
                            />
                          )}
                          {finished > 0 && (
                            <motion.div
                              initial={{ width:0 }} animate={{ width:`${finishedPct}%` }}
                              transition={{ duration:0.8, delay:0.3 }}
                              className="h-full bg-emerald-500 rounded-full"
                            />
                          )}
                          {overdue > 0 && (
                            <motion.div
                              initial={{ width:0 }} animate={{ width:`${overduePct}%` }}
                              transition={{ duration:0.8, delay:0.4 }}
                              className="h-full bg-red-400 rounded-full"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Task breakdown rows */}
                    <div className="space-y-2.5">
                      {[
                        { label: "In progress",  count: inProgress,  color: "bg-blue-500",    text: "text-blue-600",    bg: "bg-blue-50" },
                        { label: "Under review", count: underReview, color: "bg-orange-400",  text: "text-orange-600",  bg: "bg-orange-50" },
                        { label: "Finished",     count: finished,    color: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
                        ...(overdue > 0 ? [{ label: "Overdue", count: overdue, color: "bg-red-500", text: "text-red-600", bg: "bg-red-50" }] : []),
                      ].map((row, i) => (
                        <motion.div key={row.label}
                          initial={{ opacity:0, x:6 }} animate={{ opacity:1, x:0 }}
                          transition={{ delay: 0.2 + i * 0.06 }}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${row.bg} border border-white/60`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${row.color}`}/>
                            <span className="text-xs font-bold text-slate-700">{row.label}</span>
                          </div>
                          <span className={`text-xs font-black ${row.text}`}>
                            {row.count} task{row.count !== 1 ? "s" : ""}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-100 pt-3">
                      <button
                        onClick={() => setShowTasksPanel(true)}
                        className="w-full flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors group"
                      >
                        <span>View tasks details</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                      </button>
                    </div>

                  </div>
                );
              })()}
            </GlassCard>


            {/* ── ROW 2: REVENUE CHART ── */}
            <GlassCard className="p-6" delay={0.3}>
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <BarChart2 size={17} className="text-blue-600"/> Revenue Performance
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Monthly revenue and booking trends</p>
                </div>
                <span className="text-xs font-semibold bg-blue-50/80 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100">
                  Last 12 Months
                </span>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top:4, right:4, left:-18, bottom:0 }}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#3B82F6" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#6366F1" stopOpacity={0.7}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#E2E8F0" vertical={false}/>
                    <XAxis dataKey="month" stroke="#CBD5E1" fontSize={11}
                      tickLine={false} axisLine={false}
                      tick={{ fill:"#94A3B8", fontWeight:600 }}/>
                    <YAxis stroke="#CBD5E1" fontSize={11} tickLine={false} axisLine={false}
                      tick={{ fill:"#94A3B8" }}
                      tickFormatter={v => v>=1000?`$${(v/1000).toFixed(0)}k`:`$${v}`}/>
                    <Tooltip content={<ChartTooltip/>}/>
                    <Bar dataKey="Revenue" fill="url(#barGrad)" radius={[4,4,0,0]}
                      maxBarSize={32}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* ── ROW 2B: STATUS DONUT + TOP DESTINATIONS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

           
              <GlassCard className="p-6" delay={0.34}>
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                  <Briefcase size={15} className="text-blue-600"/> Trip Status Breakdown
                </h3>
                {statusData.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-slate-400 text-xs">No data</div>
                ) : (
                  <>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={statusData} innerRadius={42} outerRadius={66}
                            paddingAngle={4} dataKey="value"
                            animationBegin={0} animationDuration={800}>
                            {statusData.map((_,i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ background:"rgba(255,255,255,0.9)", backdropFilter:"blur(12px)",
                              border:"1px solid rgba(255,255,255,0.6)", borderRadius:10, fontSize:11 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {statusData.map((d,i) => (
                        <div key={d.name} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: PIE_COLORS[i%PIE_COLORS.length] }}/>
                          <span className="text-xs text-slate-600 font-semibold">
                            {d.name}: <span className="font-black">{d.value}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </GlassCard> 

              {/* Top Destinations */}
               <GlassCard className="p-6" delay={0.38}>
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                  <Globe size={15} className="text-blue-600"/> Top Destinations
                </h3>
                {topDest.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-slate-400 text-xs">No data</div>
                ) : (
                  <div className="space-y-3">
                    {topDest.map((d, i) => (
                      <div key={d.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i%PIE_COLORS.length] }}/>
                            {d.name}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">
                            {d.value} trips · <span className="font-black" style={{ color: PIE_COLORS[i%PIE_COLORS.length] }}>{d.pct}%</span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width:0 }}
                            animate={{ width:`${d.pct}%` }}
                            transition={{ duration:0.8, delay:0.4 + i*0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: PIE_COLORS[i%PIE_COLORS.length] }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div> 

            {/* ── ROW 3: UPCOMING TRIPS TABLE ── */}
             <GlassCard delay={0.4}> 
           
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 p-5 border-b border-white/40">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Calendar size={17} className="text-blue-600"/>
                  Upcoming Trips
                  <span className="text-xs font-semibold bg-blue-50/80 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 ml-1">
                    {tableRows.length} trips
                  </span>
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input type="text" value={tableSearch}
                      onChange={e => setTableSearch(e.target.value)}
                      placeholder="Search client, trip..."
                      className="pl-8 pr-7 py-2 text-xs border border-white/40 bg-white/60 backdrop-blur-md rounded-xl outline-none focus:ring-2 focus:ring-blue-400 w-48"/>
                    {tableSearch && (
                      <button onClick={() => setTableSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X size={12}/>
                      </button>
                    )}
                  </div>
              
                  <div className="flex items-center gap-1 bg-white/60 backdrop-blur-md border border-white/40 rounded-xl p-1">
                    {["all","confirmed","quote"].map(s => (
                      <button key={s} onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          statusFilter === s
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}>
                        {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {tableRows.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
                  <AlertCircle size={32} className="opacity-30"/>
                  <p className="text-sm font-semibold">No upcoming trips found</p>
                  <p className="text-xs">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-white/80 backdrop-blur-md border-b border-white/40">
                        {["Client","Trip","Destination","Departs","Pax","Value","Status"].map(h => (
                          <th key={h} className="px-4 py-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/40">
                      {tableRows.map((t, idx) => {
                        const du = daysUntil(t.routingData?.startDate);
                        const rowBg = du <= 1 ? "bg-red-50/40 hover:bg-red-50/60"
                          : du <= 3 ? "bg-amber-50/40 hover:bg-amber-50/60"
                          : "hover:bg-blue-50/30";
                        return (
                          <motion.tr key={t.id ?? idx}
                            initial={{ opacity:0, y:4 }}
                            animate={{ opacity:1, y:0 }}
                            transition={{ delay: Math.min(idx*0.03, 0.3) }}
                            className={`transition-colors ${rowBg}`}
                          >
                          
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
                                  {(t.leadGuestName || t.creatingFor || "?")[0].toUpperCase()}
                                </div>
                                <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
                                  {t.leadGuestName || t.creatingFor || "—"}
                                </span>
                              </div>
                            </td>
                            
                            <td className="px-4 py-3.5">
                              <span className="text-xs font-semibold text-slate-700 max-w-[130px] truncate block">
                                {t.tripName || "—"}
                              </span>
                            </td>
                           
                            <td className="px-4 py-3.5">
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <MapPin size={11} className="text-blue-400 flex-shrink-0"/>
                                {(t.selectedCountries||[]).join(", ")||"—"}
                              </span>
                            </td>
                        
                            <td className="px-4 py-3.5">
                              <div>
                                <p className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                                  {t.routingData?.startDate || "TBA"}
                                </p>
                                {du >= 0 && du <= 7 && (
                                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded mt-0.5 inline-block ${
                                    du === 0 ? "bg-red-100 text-red-700" :
                                    du <= 2  ? "bg-orange-100 text-orange-700" :
                                    "bg-amber-100 text-amber-700"
                                  }`}>
                                    {du === 0 ? "TODAY" : du === 1 ? "TOMORROW" : `${du}d away`}
                                  </span>
                                )}
                              </div>
                            </td>
                         
                            <td className="px-4 py-3.5">
                              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                                <Users size={11} className="text-slate-400"/>
                                {t.numberOfTravelers||1} Pax
                              </span>
                            </td>
                          
                            <td className="px-4 py-3.5">
                              <span className="text-xs font-black text-emerald-600">
                                {t.finalSellPrice ? fmt(Number(t.finalSellPrice)) : "TBD"}
                              </span>
                            </td>
                       
                            <td className="px-4 py-3.5">
                              <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full border ${
                                t.bookingStatus === "confirmed"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}>
                                {t.bookingStatus || "Quote"}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>

          </div>

          {/* ── RIGHT SIDEBAR (col-3) ────────────────────── */}
          <div className="xl:col-span-3 space-y-5">

            {/* Today's Schedule */}
            <GlassCard className="p-5" delay={0.2}>
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                <Clock size={15} className="text-blue-600"/> Today's Schedule
              </h3>
              {todaySchedule.length === 0 ? (
                <div className="flex flex-col items-center py-8 gap-2 text-slate-400">
                  <Calendar size={28} className="opacity-30"/>
                  <p className="text-xs font-semibold text-center">No departures or returns today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaySchedule.map((t, i) => {
                    const today     = new Date().toISOString().split("T")[0];
                    const departing = t.routingData?.startDate?.startsWith(today);
                    return (
                      <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-white/50 border border-white/60">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          departing ? "bg-blue-100" : "bg-emerald-100"
                        }`}>
                          <Plane size={14} className={departing ? "text-blue-600" : "text-emerald-600 rotate-180"}/>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-700 truncate">{t.tripName}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">
                            {t.leadGuestName || "Client"}
                          </p>
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded mt-1 inline-block ${
                            departing
                              ? "bg-blue-100 text-blue-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {departing ? "Departing" : "Returning"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>

            {/* Smart Alerts Panel */}
            <GlassCard className="p-5" delay={0.26}>
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                <Bell size={15} className="text-blue-600"/> Smart Alerts
                {smartAlerts.filter(a => a.type === "warn").length > 0 && (
                  <span className="w-5 h-5 bg-amber-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ml-auto">
                    {smartAlerts.filter(a => a.type === "warn").length}
                  </span>
                )}
              </h3>
              <div className="space-y-2.5">
                {smartAlerts.map((alert, i) => (
                  <motion.div key={i}
                    initial={{ opacity:0, x:10 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ delay:0.3 + i*0.06 }}
                    className={`flex gap-2.5 p-3 rounded-xl border text-xs font-semibold ${
                      alert.type === "warn"
                        ? "bg-amber-50/80 border-amber-200/60 text-amber-800"
                        : alert.type === "success"
                        ? "bg-emerald-50/80 border-emerald-200/60 text-emerald-800"
                        : "bg-blue-50/80 border-blue-200/60 text-blue-800"
                    }`}
                  >
                    <span className="flex-shrink-0 mt-0.5">
                      {alert.type === "warn" ? "⚠️" : alert.type === "success" ? "✅" : "ℹ️"}
                    </span>
                    <span>{alert.msg}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>


            {/* ── TASK OVERVIEW WIDGET ── */}
            <GlassCard className="p-5" delay={0.18}>
              {(() => {
                // 1. FILTER LOGIC: Filter tasks dynamically based on the selected timeframe
                const now = new Date().getTime();
                const timeFilteredTasks = empTasks.filter(t => {
                  if (!t.deadline && !t.createdAt) return true;
                  const targetDate = new Date(t.deadline || t.createdAt).getTime();
                  const diffInDays = Math.abs((targetDate - now) / (1000 * 60 * 60 * 24));

                  if (overviewTimeFilter === "1d") return diffInDays <= 1;
                  if (overviewTimeFilter === "7d") return diffInDays <= 7;
                  if (overviewTimeFilter === "1m") return diffInDays <= 30;
                  return true;
                });

                // 2. Calculate stats from the FILTERED tasks, not all empTasks
                const inProgress  = timeFilteredTasks.filter(t => t.status === "in_progress").length;
                const underReview = timeFilteredTasks.filter(t => t.status === "pending").length;
                const finished    = timeFilteredTasks.filter(t => t.status === "completed").length;
                const overdue     = timeFilteredTasks.filter(t => t.status === "overdue").length;
                const total       = timeFilteredTasks.length || 1;

                // 3. Bar segment widths
                const inProgressPct  = Math.round((inProgress  / total) * 100);
                const underReviewPct = Math.round((underReview / total) * 100);
                const finishedPct    = Math.round((finished    / total) * 100);
                const overduePct     = Math.max(0, 100 - inProgressPct - underReviewPct - finishedPct);

                return (
                  <div className="space-y-4">

                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                          <ClipboardList size={15} className="text-blue-600"/>
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">Task overview</p>
                          <p className="text-[11px] text-slate-400 font-semibold">
                            Overview spread to {overviewTimeFilter === "1m" ? "30 days" : overviewTimeFilter === "7d" ? "7 days" : "24 hours"}
                          </p>
                        </div>
                      </div>

                      {/* Dynamic Time filter pills */}
                      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                        {(["1d", "7d", "1m"] as const).map((t) => (
                          <button key={t}
                            onClick={() => setOverviewTimeFilter(t)}
                            className={`text-[10px] font-black px-2 py-1 rounded-lg transition-all ${
                              overviewTimeFilter === t
                                ? "bg-white text-slate-800 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Task count + segmented bar */}
                    <div>
                      <p className="text-xs font-black text-slate-700 mb-2.5">
                        Task{" "}
                        <span className="text-slate-400 font-bold">
                          ({timeFilteredTasks.length})
                        </span>
                      </p>

                      {/* Segmented progress bar */}
                      {timeFilteredTasks.length === 0 ? (
                        <div className="w-full h-3 bg-slate-100 rounded-full"/>
                      ) : (
                        <div className="w-full h-3 rounded-full overflow-hidden flex gap-0.5">
                          {inProgress > 0 && (
                            <motion.div
                              initial={{ width:0 }} animate={{ width:`${inProgressPct}%` }}
                              transition={{ duration:0.8, delay:0.1 }}
                              className="h-full bg-blue-500 rounded-full"
                            />
                          )}
                          {underReview > 0 && (
                            <motion.div
                              initial={{ width:0 }} animate={{ width:`${underReviewPct}%` }}
                              transition={{ duration:0.8, delay:0.2 }}
                              className="h-full bg-orange-400 rounded-full"
                            />
                          )}
                          {finished > 0 && (
                            <motion.div
                              initial={{ width:0 }} animate={{ width:`${finishedPct}%` }}
                              transition={{ duration:0.8, delay:0.3 }}
                              className="h-full bg-emerald-500 rounded-full"
                            />
                          )}
                          {overdue > 0 && (
                            <motion.div
                              initial={{ width:0 }} animate={{ width:`${overduePct}%` }}
                              transition={{ duration:0.8, delay:0.4 }}
                              className="h-full bg-red-400 rounded-full"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Task breakdown rows */}
                    <div className="space-y-2.5">
                      {[
                        { label: "In progress",  count: inProgress,  color: "bg-blue-500",    text: "text-blue-600",    bg: "bg-blue-50" },
                        { label: "Under review", count: underReview, color: "bg-orange-400",  text: "text-orange-600",  bg: "bg-orange-50" },
                        { label: "Finished",     count: finished,    color: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
                        ...(overdue > 0 ? [{ label: "Overdue", count: overdue, color: "bg-red-500", text: "text-red-600", bg: "bg-red-50" }] : []),
                      ].map((row, i) => (
                        <motion.div key={row.label}
                          initial={{ opacity:0, x:6 }} animate={{ opacity:1, x:0 }}
                          transition={{ delay: 0.2 + i * 0.06 }}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${row.bg} border border-white/60`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${row.color}`}/>
                            <span className="text-xs font-bold text-slate-700">{row.label}</span>
                          </div>
                          <span className={`text-xs font-black ${row.text}`}>
                            {row.count} task{row.count !== 1 ? "s" : ""}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-100 pt-3">
                      <button
                        onClick={() => setShowTasksPanel(true)}
                        className="w-full flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors group"
                      >
                        <span>View tasks details</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                      </button>
                    </div>

                  </div>
                );
              })()}
            </GlassCard>

    

  

            {/* Quick Actions */}
            <GlassCard className="p-5"   delay={0.32}>
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                <Zap size={15} className="text-blue-600"/> Quick Actions
              </h3>
              <div className="space-y-2">
                {[
                  { label:"New Itinerary",      href:"/dashboard/itinerary/create",   icon:Zap,          color:"bg-blue-600" },
                  { label:"View My Trips",       href:"/dashboard/trips",              icon:Briefcase,    color:"bg-indigo-500" },
                  { label:"Travel Operations",   href:"/dashboard/travel-operations",  icon:Plane,        color:"bg-amber-500" },
                  { label:"Crisis Management",   href:"/dashboard/crisis-management",  icon:AlertCircle,  color:"bg-red-500" },
                  { label:"My Profile",          href:"/dashboard/profile",            icon:UserCheck,    color:"bg-teal-500" },
                ].map((action, i) => (
                  <Link key={i} href={action.href}>
                    <motion.div whileHover={{ x:4 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/50 hover:bg-white/70 border border-white/60 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 ${action.color} rounded-lg flex items-center justify-center`}>
                          <action.icon size={13} className="text-white"/>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{action.label}</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600"/>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </GlassCard>

          </div>{/* end right sidebar */}
        </div>{/* end main grid */}

        {/* Footer */}
        <div className="text-center pb-4">
          <p className="text-xs text-slate-400 font-medium">
            Travdek Employee Portal · {new Date().toLocaleDateString("en-US",{ month:"long", year:"numeric" })}
          </p>
        </div>

      </div>
    </div>
  );
}