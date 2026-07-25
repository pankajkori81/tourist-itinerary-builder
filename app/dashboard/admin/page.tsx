

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Calendar, DollarSign, TrendingUp, TrendingDown,
  Activity, Briefcase, CheckCircle2, Loader2, ArrowUpRight,
  Globe, Search, Plus, ChevronDown, MapPin, X,
  BarChart2, Plane, UserCheck, AlertCircle , Image as ImageIcon,
  HelpCircle,
  User,  ClipboardList, UserCircle, Flag, Trash2, Pencil, CheckCircle, Circle, Clock, ChevronRight, 
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell, CartesianGrid
} from "recharts";
import { useUser } from "@/app/context/UserContext";
import { getLibrary, StoredItineraryData } from "@/utils/itineraryStorage";
import { getSuppliers, SupplierData } from "@/utils/srmStorage";
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const PIE_COLORS = ["#2563EB","#0EA5E9","#6366F1","#8B5CF6","#EC4899","#F59E0B"];

const TABS = ["Dashboard", "Bookings", "Commissions", "Contacts" , "Tasks"] as const;
type Tab = typeof TABS[number];

const STATUS_STYLES: Record<string, string> = {
  confirmed:  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  cancelled:  "bg-red-50    text-red-700    border border-red-200",
  completed:  "bg-blue-50   text-blue-700   border border-blue-200",
  quote:      "bg-amber-50  text-amber-700  border border-amber-200",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US",{ style:"currency", currency:"USD", maximumFractionDigits:0 }).format(n);

const fmtShort = (n: number) =>
  n >= 1000 ? `$${(n/1000).toFixed(1)}k` : `$${n}`;

const parseDate = (s?: string): Date | null => {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};

const getMonth = (s?: string): number => {
  const d = parseDate(s);
  return d ? d.getMonth() : -1;
};

const getYear = (s?: string): number => {
  const d = parseDate(s);
  return d ? d.getFullYear() : -1;
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

// KPI Card
const KPICard = ({
  icon: Icon, label, value, sub, trend, color, delay = 0
}: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; trend?: number; color: string; delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
    whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(37,99,235,0.12)" }}
    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col gap-4 cursor-default"
  >
    <div className="flex justify-between items-start">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-bold flex items-center gap-0.5 px-2 py-1 rounded-full ${
          trend >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        }`}>
          {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  </motion.div>
);

// Custom Tooltip for charts
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.name === "Revenue" ? fmtShort(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();

  // ── State ──
  const [trips, setTrips]           = useState<StoredItineraryData[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [activeTab, setActiveTab]   = useState<Tab>("Dashboard"); // 👈 Dashboard is the default active tab
  const [destMonth, setDestMonth]   = useState<number>(new Date().getMonth());
  const [monthOpen, setMonthOpen]   = useState(false);
  const [search, setSearch]         = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [highlightDest, setHighlightDest] = useState<string | null>(null);

  const [pkgSort, setPkgSort] = useState<"latest"|"oldest"|"price">("latest");
  const [showAllPkgs, setShowAllPkgs] = useState(false);



  // ── NEW: Task tab states ──
const [tasks,          setTasks]          = useState<any[]>([]);
const [employees,      setEmployees]      = useState<any[]>([]);
const [loadingTasks,   setLoadingTasks]   = useState(false);
const [selectedEmp,    setSelectedEmp]    = useState<any | null>(null);
const [showTaskForm,   setShowTaskForm]   = useState(false);
const [taskSubmitting, setTaskSubmitting] = useState(false);
const [editingTask,    setEditingTask]    = useState<any | null>(null);

// 🌟 NEW: Global Table & Modal States
const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
const [taskSearch, setTaskSearch]           = useState("");
const [taskStatusFilter, setTaskStatusFilter]     = useState("all");
const [taskPriorityFilter, setTaskPriorityFilter] = useState("all");
const [taskUserFilter, setTaskUserFilter]         = useState("all");
const [taskTimeFilter, setTaskTimeFilter]         = useState("all");


// 🌟 NEW: Calculate Live KPI Metrics
const taskMetrics = useMemo(() => {
  const now = new Date().getTime();
  return {
    total: tasks.length,
    active: tasks.filter(t => t.status !== "completed").length,
    overdue: tasks.filter(t => t.status !== "completed" && new Date(t.deadline).getTime() < now).length,
    urgent: tasks.filter(t => t.priority === "urgent" && t.status !== "completed").length,
    completed: tasks.filter(t => t.status === "completed").length,
  };
}, [tasks]);



// 🌟 UPDATED: Advanced Filtering & Sorting Logic (Now with Time Filtering)
const filteredAndSortedTasks = useMemo(() => {
  return tasks
    .filter(t => {
      // 1. Search Filter
      const matchSearch = !taskSearch || 
        t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
        (t.linkedTripId?.tripName || "").toLowerCase().includes(taskSearch.toLowerCase());
      
      // 2. Status Filter
      const matchStatus = taskStatusFilter === "all" || t.status === taskStatusFilter;
      
      // 3. Priority Filter
      const matchPriority = taskPriorityFilter === "all" || t.priority === taskPriorityFilter;
      
      // 4. User Filter
      const matchUser = taskUserFilter === "all" || 
        t.assignedTo?._id === taskUserFilter || 
        t.assignedTo === taskUserFilter;

      // 5. Time Filter
      let matchTime = true;
      if (taskTimeFilter !== "all") {
        const deadlineTime = new Date(t.deadline).getTime();
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const tomorrowStart = todayStart + 86400000;
        const nextWeekStart = todayStart + (86400000 * 7);

        if (taskTimeFilter === "overdue") {
          matchTime = t.status !== "completed" && deadlineTime < now.getTime();
        } else if (taskTimeFilter === "today") {
          matchTime = deadlineTime >= todayStart && deadlineTime < tomorrowStart;
        } else if (taskTimeFilter === "week") {
          matchTime = deadlineTime >= todayStart && deadlineTime < nextWeekStart;
        }
      }

      return matchSearch && matchStatus && matchPriority && matchUser && matchTime;
    })
    .sort((a, b) => {
      // Sort newest created first
      const dateA = new Date(a.createdAt || a.deadline).getTime();
      const dateB = new Date(b.createdAt || b.deadline).getTime();
      return dateB - dateA;
    });
}, [tasks, taskSearch, taskStatusFilter, taskPriorityFilter, taskUserFilter, taskTimeFilter]);


// // 🌟 NEW: Advanced Filtering & Sorting Logic
// const filteredAndSortedTasks = useMemo(() => {
//   return tasks
//     .filter(t => {
//       // 1. Search Filter
//       const matchSearch = !taskSearch || 
//         t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
//         (t.linkedTripId?.tripName || "").toLowerCase().includes(taskSearch.toLowerCase());
      
//       // 2. Status Filter
//       const matchStatus = taskStatusFilter === "all" || t.status === taskStatusFilter;
      
//       // 3. Priority Filter
//       const matchPriority = taskPriorityFilter === "all" || t.priority === taskPriorityFilter;
      
//       // 4. User Filter
//       const matchUser = taskUserFilter === "all" || 
//         t.assignedTo?._id === taskUserFilter || 
//         t.assignedTo === taskUserFilter;

//       return matchSearch && matchStatus && matchPriority && matchUser;
//     })
//     .sort((a, b) => {
//       // Sort newest created first (so new tasks appear at the top)
//       const dateA = new Date(a.createdAt || a.deadline).getTime();
//       const dateB = new Date(b.createdAt || b.deadline).getTime();
//       return dateB - dateA;
//     });
// }, [tasks, taskSearch, taskStatusFilter, taskPriorityFilter, taskUserFilter]);

// Task form state
const [taskForm, setTaskForm] = useState({
  title       : "",
  description : "",
  assignedTo  : "",
  priority    : "medium",
  category    : "other",
  deadline    : "",
  linkedTripId: "",
});


  // Inner State for Contacts Tab
  const [contactSubTab, setContactSubTab] = useState<'suppliers' | 'clients'>('suppliers');
  const [addContactDropdown, setAddContactDropdown] = useState(false);
 const [suppliers, setSuppliers] = useState<SupplierData[]>([]); 
 const [clients, setClients] = useState<any[]>([]);
 

 const [contactSearch, setContactSearch] = useState("");

  const filteredSuppliers = useMemo(() => {
    if (!contactSearch.trim()) return suppliers;
    
    const query = contactSearch.toLowerCase();
    return suppliers.filter(sup => 
      (sup.name || "").toLowerCase().includes(query) ||
      (sup.email || "").toLowerCase().includes(query) ||
      (sup.phone || "").toLowerCase().includes(query) ||
      (sup.services || []).some(svc => svc.toLowerCase().includes(query))
    );
  }, [suppliers, contactSearch]);



  const handleGoToOperations = async (trip: any) => {
    try {
        // 1. Call the API to generate the manifest (Pass the required data)
        const response = await fetch('/api/operations/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tripId: trip.tripId, 
                tripName: trip.tripName,
                itineraryId: trip.itineraryId,
                dayPlans: trip.dayWiseActivities // Make sure you pass the array of days here!
            })
        });

        // It will return 201 if created, or 400 if it already exists. Both are fine!
        // 2. Redirect to the new Operations Manifest Page
        router.push(`/dashboard/travel-operations/${trip.tripId}`);
        
    } catch (error) {
        console.error("Failed to route to operations:", error);
        alert("Something went wrong connecting to Operations.");
    }
};



// ── Fetch tasks + employees when Tasks tab opens ──────────────
const fetchTasksData = async () => {
  setLoadingTasks(true);
  try {
    // 1. Fetch Tasks and Employees simultaneously using your exact backend routes
    const [tasksRes, empRes] = await Promise.all([
      fetch("/api/tasks"),
      fetch("/api/admin/employees") // 👈 Strictly use the employees endpoint
    ]);
    
    const tasksJson = await tasksRes.json();
    const empJson   = await empRes.json();

    if (tasksJson.success) {
        setTasks(tasksJson.data);
    }

    if (empJson?.success) {
      // 2. PERMANENT FIX: Safely filter the internal team
      // This ensures both 'Admins' (like Sandeep) and 'Employees' can be assigned tasks,
      // and it converts strings to lowercase so a typo in the DB doesn't break your app.
      const internalStaff = empJson.data.filter((e: any) => {
        const role = String(e.role || "").toLowerCase();
        const status = String(e.status || "").toLowerCase();
        
        return (role === "employee" || role === "admin") && status === "active";
      });
      
      setEmployees(internalStaff);
    }
  } catch (e) {
    console.error("Failed to load tasks data:", e);
  } finally {
    setLoadingTasks(false);
  }
};

// ── Handle task form submit ───────────────────────────────────

// ── Handle task form submit ───────────────────────────────────
const handleAssignTask = async (e: React.FormEvent) => {
  e.preventDefault();
  // 🌟 Check taskForm.assignedTo instead of selectedEmp
  if (!taskForm.assignedTo || !taskForm.title || !taskForm.deadline) {
    alert("Please fill all required fields, including assigning an employee.");
    return;
  }
  setTaskSubmitting(true);

  try {
    const url    = editingTask ? `/api/tasks/${editingTask._id}` : "/api/tasks";
    const method = editingTask ? "PUT" : "POST";

    const res  = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...taskForm,
        linkedTripId : taskForm.linkedTripId || null,
      }),
    });
    const json = await res.json();

    if (json.success) {
      await fetchTasksData();
      setIsTaskModalOpen(false); // 👈 Close the modal
      setEditingTask(null);
      setTaskForm({
        title:"", description:"", assignedTo:"", priority:"medium",
        category:"other", deadline:"", linkedTripId:"",
      });
    } else {
      alert(json.message || "Failed to save task");
    }
  } catch (e) {
    console.error(e);
    alert("Network error");
  } finally {
    setTaskSubmitting(false);
  }
};


// ── Handle task delete ────────────────────────────────────────
const handleDeleteTask = async (taskId: string) => {
  if (!confirm("Delete this task?")) return;
  try {
    const res  = await fetch(`/api/tasks/${taskId}`, { method:"DELETE" });
    const json = await res.json();
    if (json.success) {
      setTasks(prev => prev.filter(t => t._id !== taskId));
    }
  } catch(e) { console.error(e); }
};

// ── Handle status update ──────────────────────────────────────
const handleTaskStatusUpdate = async (taskId: string, status: string) => {
  try {
    const res  = await fetch(`/api/tasks/${taskId}`, {
      method : "PUT",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({ status }),
    });
    const json = await res.json();
    if (json.success) {
      setTasks(prev => prev.map(t => t._id === taskId ? json.data : t));
    }
  } catch(e) { console.error(e); }
};

 // ==========================================
  // EXPORT LOGIC (Download Suppliers)
  // ==========================================
  const handleDownloadSuppliers = () => {
    if (!suppliers || suppliers.length === 0) {
      alert("No suppliers available to download.");
      return;
    }

    // Map the raw database array to formatted Excel columns
    const exportData = suppliers.map(sup => ({
      'Name': sup.name,
      'Type': sup.services?.[0] || 'General',
      'Email': sup.email || 'N/A',
      'Phone': sup.phone || 'N/A',
      'Created': sup.createdAt ? new Date(sup.createdAt).toLocaleDateString() : 'N/A',
      'Bookings': 'TBD',     // Will be wired to operations count later
      'Profit Vol.': 'TBD'   // Will be wired to operations margin later
    }));

    // Generate and download the Excel workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");
    XLSX.writeFile(workbook, "Suppliers_Directory.xlsx");
  };


  // ── Derived: operational trips (non-master) ──
  const ops = useMemo(
    () => trips.filter(t => !t.isMasterItinerary),
    [trips]
  );

  // 🌟 DYNAMIC LOGIC 1: Calculate "New" Suppliers (Last 30 Days)
  const newSuppliersCount = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return suppliers.filter(s => {
      if (!s.createdAt) return false;
      return new Date(s.createdAt) >= thirtyDaysAgo;
    }).length;
  }, [suppliers]);

  // 🌟 DYNAMIC LOGIC 2: Calculate "Top Suppliers" based on Vendor Bookings
  const topSuppliersData = useMemo(() => {
    const spendMap: Record<string, number> = {};
    
    // Tally up costs for each supplier from confirmed/active trips
    ops.forEach(trip => {
      if (trip.bookingStatus === 'cancelled') return;
      const bookings = trip.operations?.vendorBookings || [];
      bookings.forEach(b => {
        if (b.assignedSupplierId && b.estimatedCost) {
          spendMap[b.assignedSupplierId] = (spendMap[b.assignedSupplierId] || 0) + Number(b.estimatedCost);
        }
      });
    });

    // Sort by highest spend and get top 2
    const sortedIds = Object.entries(spendMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);

    // Match IDs to Supplier Names
    return sortedIds.map(([id, amount]) => {
      const sup = suppliers.find(s => s.id === id);
      return {
        name: sup ? sup.name : 'Unknown Supplier',
        amount: amount
      };
    });
  }, [ops, suppliers]);



  // 🌟 DYNAMIC LOGIC: Calculate exact bookings and spend per supplier
  const supplierStats = useMemo(() => {
    const stats: Record<string, { bookings: number; spend: number }> = {};
    
    ops.forEach(trip => {
      // Don't count cancelled trips in supplier profits
      if (trip.bookingStatus === 'cancelled') return;
      
      const vendorBookings = trip.operations?.vendorBookings || [];
      vendorBookings.forEach(vb => {
        if (vb.assignedSupplierId) {
          if (!stats[vb.assignedSupplierId]) {
            stats[vb.assignedSupplierId] = { bookings: 0, spend: 0 };
          }
          // Add 1 to bookings count, and add the cost to total spend
          stats[vb.assignedSupplierId].bookings += 1;
          stats[vb.assignedSupplierId].spend += Number(vb.estimatedCost || 0);
        }
      });
    });
    
    return stats;
  }, [ops]);



  // ── Data fetch ──
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        // 🌟 FIX 3: Fetch BOTH Trips and Suppliers concurrently using Promise.all
        // const [allTrips, liveSuppliers] = await Promise.all([
        //   getLibrary(),
        //   getSuppliers()
        // ]);
        
        // setTrips(allTrips || []);
        // setSuppliers(liveSuppliers || []); // 👈 Store the fetched suppliers here
        

        const [allTrips, liveSuppliers, clientsRes] = await Promise.all([
          getLibrary(),
          getSuppliers(),
          fetch('/api/clients').then(res => res.json()).catch(() => ({ data: [] }))
        ]);
        
        setTrips(allTrips || []);
        setSuppliers(liveSuppliers || []); 
        setClients(clientsRes.data || []);

      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);


  // ── Tab-Specific Data Fetching ──
  // This ensures data is fetched exactly when the user navigates to the tab
  useEffect(() => {
    if (activeTab === "Tasks") {
      fetchTasksData();
    }
    // Note: If you build out API routes for Commissions later, add them here:
    // if (activeTab === "Commissions") { fetchCommissionsLedger(); }
  }, [activeTab]);

  // ── KPI Metrics ──
  const metrics = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const curMonth = today.getMonth(); const curYear = today.getFullYear();
    const prevMonth = curMonth === 0 ? 11 : curMonth - 1;
    const prevYear  = curMonth === 0 ? curYear - 1 : curYear;

    let totalBookings = 0, prevBookings = 0;
    let totalRevenue = 0,  prevRevenue = 0;
    const guestSet = new Set<string>(); const prevGuestSet = new Set<string>();
    let done = 0, active = 0, booked = 0, cancelled = 0;

    ops.forEach(t => {
      const m = getMonth(t.routingData?.startDate);
      const y = getYear(t.routingData?.startDate);
      const isCurMonth  = m === curMonth  && y === curYear;
      const isPrevMonth = m === prevMonth && y === prevYear;

      if (t.bookingStatus !== "cancelled") {
        booked++;
        totalBookings++;
        if (isCurMonth)  prevBookings; // counting cur (this line was a no-op in the provided code, but retained for structural consistency)
        if (isPrevMonth) prevBookings++;

        const price = Number(t.finalSellPrice) || 0;
        totalRevenue += price;
        if (isPrevMonth) prevRevenue += price;

        const guest = (t.leadGuestName || t.creatingFor || "").trim();
        if (guest) guestSet.add(guest.toLowerCase());
        if (isPrevMonth && guest) prevGuestSet.add(guest.toLowerCase());

        const s = parseDate(t.routingData?.startDate);
        const e = parseDate(t.routingData?.endDate) || s;
        if (s && e) {
          if (e < today) done++;
          else if (s <= today && e >= today) active++;
        }
      } else {
        cancelled++;
      }
    });

    const bkTrend = prevBookings ? Math.round(((totalBookings - prevBookings)/prevBookings)*100) : 0;
    const rvTrend = prevRevenue  ? Math.round(((totalRevenue - prevRevenue)/prevRevenue)*100) : 0;

    return {
      totalBookings, totalRevenue,
      totalCustomers: guestSet.size,
      bkTrend, rvTrend,
      done, active, booked, cancelled,
      totalTrips: ops.length
    };
  }, [ops]);

  // ── Chart Data: group by month ──
  const chartData = useMemo(() => {
    const grouped: Record<string, { trips: number; revenue: number }> = {};
    MONTHS.forEach(m => { grouped[m] = { trips: 0, revenue: 0 }; });

    ops.forEach(t => {
      const m = getMonth(t.routingData?.startDate);
      if (m < 0) return;
      const key = MONTHS[m];
      grouped[key].trips++;
      grouped[key].revenue += Number(t.finalSellPrice) || 0;
    });

    return MONTHS.map(m => ({
      month: m,
      Trips: grouped[m].trips,
      Revenue: grouped[m].revenue,
    }));
  }, [ops]);

  // ── Top Destinations (filtered by selected month) ──
  const topDest = useMemo(() => {
    const filtered = ops.filter(t => {
      const m = getMonth(t.routingData?.startDate);
      return m === destMonth;
    });

    const counts: Record<string, number> = {};
    filtered.forEach(t => {
      (t.selectedCountries || []).slice(0, 1).forEach(c => {
        counts[c] = (counts[c] || 0) + 1;
      });
    });

    const total = filtered.length || 1;
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, pct: Math.round((value/total)*100) }))
      .sort((a,b) => b.value - a.value)
      .slice(0, 5);
  }, [ops, destMonth]);

  // ── Bookings Table (filtered) ──
  const tableRows = useMemo(() => {
    return ops.filter(t => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (t.tripName || "").toLowerCase().includes(q) ||
        (t.tripId   || "").toLowerCase().includes(q) ||
        (t.leadGuestName || "").toLowerCase().includes(q);

      const matchDate = !dateFilter ||
        (t.routingData?.startDate || "").startsWith(dateFilter);

      return matchSearch && matchDate;
    }).sort((a,b) => {
      const da = parseDate(a.routingData?.startDate)?.getTime() || 0;
      const db = parseDate(b.routingData?.startDate)?.getTime() || 0;
      return db - da;
    });
  }, [ops, search, dateFilter]);

  // ── Master Itineraries (Travel Packages) ──
  const masterTrips = useMemo(() => {
   let result = trips.filter(t => t.isMasterItinerary === true || (t.isMasterItinerary as any) === "true");
    
    if (pkgSort === "oldest") {
      result.sort((a, b) => (parseDate(a.createdAt)?.getTime() || 0) - (parseDate(b.createdAt)?.getTime() || 0));
    } else if (pkgSort === "price") {
      result.sort((a, b) => {
        const priceA = Number(a.fixedDepartures?.[0]?.priceDBL || a.finalSellPrice || 0);
        const priceB = Number(b.fixedDepartures?.[0]?.priceDBL || b.finalSellPrice || 0);
        return priceB - priceA;
      });
    } else {
      result.sort((a, b) => (parseDate(b.createdAt)?.getTime() || 0) - (parseDate(a.createdAt)?.getTime() || 0));
    }
    
    return result;
  }, [trips, pkgSort]);

  // ── Loading screen ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-200">
            <Plane className="text-white animate-pulse" size={28} />
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
            <Loader2 size={16} className="animate-spin text-blue-600" />
            Loading your dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    // <div className="min-h-screen bg-[#F0F4FF] font-sans">
    <div className="min-h-screen bg-[#F0F4FF] font-sans overflow-y-auto">
      {/* ── Subtle grid pattern ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(90deg, #2563EB 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }}
      />

      <div className="relative max-w-[1600px] mx-auto px-6 py-8 space-y-7">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              Welcome back,{" "}
              <span className="text-blue-600">{user?.name || "Admin"}</span> 
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Here is everything happening across your travel business today.
            </p>
          </div>
         
        </motion.div>

        {/* ── TAB BAR ── */}
        <div className="flex items-center gap-1 border-b border-slate-200 bg-white rounded-t-2xl px-6 pt-4 mt-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-3 text-sm font-bold transition-all ${
                activeTab === tab
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="tabLine"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT AREA ── */}
        {/* <div className="bg-white/40 rounded-b-2xl shadow-sm border border-t-0 border-slate-200 p-6"> */}

        {/* <div className="bg-white/40 rounded-b-2xl shadow-sm border border-t-0 border-slate-200 p-6 overflow-y-auto"> */}
        <div className="bg-white/40 rounded-b-2xl shadow-sm border border-t-0 border-slate-200 p-6">
          
          {/* ========================================================
              DASHBOARD TAB (KPIs & Charts)
              ======================================================== */}
          {activeTab === "Dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* ── ROW 1: KPI CARDS ── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <KPICard
                  icon={Briefcase}  label="Total Bookings"
                  value={metrics.totalBookings}
                  sub="All confirmed trips"
                  trend={metrics.bkTrend}
                  color="bg-blue-600"
                  delay={0}
                />
                <KPICard
                  icon={UserCheck}  label="Total Customers"
                  value={metrics.totalCustomers}
                  sub="Unique guests across all trips"
                  color="bg-indigo-500"
                  delay={0.08}
                />
                <KPICard
                  icon={DollarSign} label="Total Revenue"
                  value={fmt(metrics.totalRevenue)}
                  sub="Gross from confirmed bookings"
                  trend={metrics.rvTrend}
                  color="bg-emerald-500"
                  delay={0.16}
                />
              </div>

              {/* ── ROW 2: CHART + TOP DESTINATIONS ── */}
   
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Trip Overview Chart */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <BarChart2 size={18} className="text-blue-600" />
                        Trip Overview
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Monthly bookings and revenue trend</p>
                    </div>
                    <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100">
                      Last 12 Months
                    </span>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gradTrips" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#F1F5F9" vertical={false} />
                        <XAxis
                          dataKey="month"
                          stroke="#CBD5E1" fontSize={11}
                          tickLine={false} axisLine={false}
                          tick={{ fill: "#94A3B8", fontWeight: 600 }}
                        />
                        <YAxis
                          stroke="#CBD5E1" fontSize={11}
                          tickLine={false} axisLine={false}
                          tick={{ fill: "#94A3B8" }}
                          tickFormatter={v => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`}
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Area
                          type="monotone" dataKey="Revenue"
                          stroke="#2563EB" strokeWidth={2.5}
                          fill="url(#gradRevenue)"
                          dot={{ fill:"#2563EB", strokeWidth:0, r:3 }}
                          activeDot={{ r:5, fill:"#2563EB", strokeWidth:2, stroke:"#fff" }}
                        />
                        <Area
                          type="monotone" dataKey="Trips"
                          stroke="#6366F1" strokeWidth={2}
                          strokeDasharray="5 3"
                          fill="url(#gradTrips)"
                          dot={false}
                          activeDot={{ r:4, fill:"#6366F1" }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Legend */}
                  <div className="flex items-center gap-5 mt-4 pt-4 border-t border-slate-100">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="w-6 h-0.5 bg-blue-600 rounded block" /> Revenue
                    </span>
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="w-6 border-t-2 border-dashed border-indigo-500 block" /> Trips
                    </span>
                  </div>
                </div>

                {/* Top Destinations */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <Globe size={18} className="text-blue-600" />
                      Top Destinations
                    </h3>
                    <div className="relative">
                      <button
                        onClick={() => setMonthOpen(!monthOpen)}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        {MONTHS[destMonth]}
                        <ChevronDown size={12} className={`transition-transform ${monthOpen ? "rotate-180":""}`} />
                      </button>
                      <AnimatePresence> {monthOpen && (
                          <motion.div
                            initial={{ opacity:0, scale:0.9, y:-8 }}
                            animate={{ opacity:1, scale:1, y:0 }}
                            exit={{ opacity:0, scale:0.9, y:-8 }}
                            transition={{ duration:0.15 }}
                            className="absolute right-0 top-9 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden w-32"
                          >
                            {MONTHS.map((m, i) => (
                              <button
                                key={m}
                                onClick={() => { setDestMonth(i); setMonthOpen(false); }}
                                className={`w-full text-left px-3 py-1.5 text-xs font-semibold transition-colors ${
                                  i === destMonth
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                {MONTH_FULL[i]}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {topDest.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
                      <Globe size={36} className="opacity-30" />
                      <p className="text-xs font-semibold text-center">
                        No trip data for {MONTH_FULL[destMonth]}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={topDest}
                              innerRadius={48} outerRadius={72}
                              paddingAngle={4} dataKey="value"
                              animationBegin={0} animationDuration={800}
                            >
                              {topDest.map((_, i) => (
                                <Cell
                                  key={i}
                                  fill={PIE_COLORS[i % PIE_COLORS.length]}
                                  opacity={highlightDest && highlightDest !== _.name ? 0.4 : 1}
                                  className="cursor-pointer transition-opacity"
                                  onClick={() => setHighlightDest(highlightDest === _.name ? null : _.name)}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:10, fontSize:11 }}
                              formatter={(v: any) => [`${v} trips`, "Bookings"]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-2 mt-2">
                        {topDest.map((d, i) => (
                          <motion.div
                            key={d.name}
                            whileHover={{ x: 3 }}
                            onClick={() => setHighlightDest(highlightDest === d.name ? null : d.name)}
                            className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                              highlightDest === d.name
                                ? "bg-blue-50 border-blue-200"
                                : "bg-slate-50 border-slate-100 hover:border-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                              />
                              <span className="text-xs font-bold text-slate-700 truncate max-w-[90px]">
                                {d.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400 font-semibold">
                                {d.value} trips
                              </span>
                              <span
                                className="text-[10px] font-black px-1.5 py-0.5 rounded"
                                style={{
                                  backgroundColor: `${PIE_COLORS[i % PIE_COLORS.length]}18`,
                                  color: PIE_COLORS[i % PIE_COLORS.length]
                                }}
                              >
                                {d.pct}%
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ── TRAVEL PACKAGES SECTION ── */}
{masterTrips.length > 0 && (() => {
  
  const displayed = showAllPkgs ? masterTrips : masterTrips.slice(0, 3);

  const getDuration = (t: StoredItineraryData) => {
    const nights = (t.routingData?.routes ?? []).reduce((a: number, r: any) => a + (r.nights || 0), 0);
    return nights ? `${nights + 1} Days / ${nights} Nights` : "—";
  };

  const getPricePP = (t: StoredItineraryData) => {
    const fixed = t.fixedDepartures?.[0]?.priceDBL;
    if (fixed && Number(fixed) > 0) return Number(fixed);
    if (t.finalSellPrice && t.numberOfTravelers) return Number(t.finalSellPrice) / (Number(t.numberOfTravelers) || 1);
    return 0;
  };

  const GRADIENTS = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
    "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)",
    "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    "linear-gradient(135deg, #f97316 0%, #eab308 100%)",
  ];

  const handleSeeDetails = (t: StoredItineraryData) => {
    sessionStorage.setItem('editing_itinerary_id', t.id!);
    if (user?.role === 'employee') {
      window.location.href = '/dashboard/itinerary/review';
    } else {
      window.location.href = '/dashboard/itinerary/preview';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">Travel Packages</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-xl px-3 py-2">
            <span className="text-slate-500 font-medium text-xs">Sort by:</span>
            <select
              value={pkgSort}
              onChange={e => setPkgSort(e.target.value as "latest"|"oldest"|"price")}
              className="text-slate-700 font-semibold text-xs outline-none bg-transparent cursor-pointer"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="price">Price</option>
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowAllPkgs(p => !p)}
            className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            {showAllPkgs ? "Show Less" : "View All"}
          </motion.button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${
        showAllPkgs ? "max-h-[700px] overflow-y-auto pr-1" : ""
      }`}>
        {displayed.map((t, idx) => {
          const pricePP = getPricePP(t);
          const duration = getDuration(t);
          const gradient = GRADIENTS[idx % GRADIENTS.length];

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(37,99,235,0.14)" }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
            >
          

              {/* Gradient Top — Modern Design */}
<div className="h-44 relative flex flex-col justify-between p-4 overflow-hidden"
  style={{ background: gradient }}>

  {/* ── Decorative blurred circles (depth effect) ── */}
  <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
  <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-black/10 rounded-full blur-2xl pointer-events-none" />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/5 rounded-full blur-lg pointer-events-none" />

  {/* ── Central Icon ── */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm rotate-6 shadow-xl">
      {/* <Plane  /> */}
      <ImageIcon size={28} className="text-white/80 -rotate-6" />
    </div>
  </div>

  {/* ── Top Row: Trip ID + Dates badge ── */}
  <div className="flex justify-between items-start relative z-10">
    <span className="text-[10px] font-black bg-black/20 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/20 tracking-wide shadow-sm">
      {t.tripId || "ID Pending"}
    </span>
    {t.fixedDepartures && t.fixedDepartures.length > 0 && (
      <span className="text-[9px] font-bold bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-sm">
        <Calendar size={9} />
        {t.fixedDepartures.length} Dates
      </span>
    )}
  </div>

  {/* ── Bottom Row: Country ── */}
  <div className="relative z-10 flex items-center gap-2">
    <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
      <Globe size={11} className="text-white/90"/>
      <span className="text-xs font-bold text-white truncate max-w-[140px]">
        {(t.selectedCountries || []).join(", ") || "—"}
      </span>
    </div>
  </div>
</div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col gap-3">
                <div>
                  <h4 className="text-sm font-black text-slate-800 leading-tight line-clamp-2">
                    {t.tripName}
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1">
                    <Calendar size={11}/> {duration}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    {pricePP > 0 ? (
                      <>
                        <p className="text-[10px] text-slate-400 font-semibold">From</p>
                        <p className="text-base font-black text-blue-600">
                          {new Intl.NumberFormat("en-US",{
                            style:"currency", currency: t.selectedCurrency || "USD",
                            maximumFractionDigits:0
                          }).format(pricePP)}
                          <span className="text-[10px] font-semibold text-slate-400 ml-1">/ pp</span>
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-slate-400 font-semibold italic">Price on request</p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleSeeDetails(t)}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-blue-200 transition-colors"
                  >
                    See Details
                    <ArrowUpRight size={13}/>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
})()}



            </motion.div>
          )}

          {/* ========================================================
              BOOKINGS TAB
              ======================================================== */}
          {activeTab === "Bookings" && (
            <motion.div
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.25 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5"
            >
              {/* Multi-State Bar */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-bold text-slate-700">Trip Fulfillment Overview</p>
                  <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    {metrics.totalTrips} Total Trips
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex gap-px mb-3">
                  {[
                    { val: metrics.done,      cls: "bg-emerald-500" },
                    { val: metrics.active,    cls: "bg-blue-500" },
                    { val: Math.max(0, metrics.booked - metrics.done - metrics.active), cls: "bg-indigo-400" },
                    { val: metrics.cancelled, cls: "bg-red-400" },
                  ].map((seg, i) => (
                    <motion.div key={i}
                      initial={{ width: 0 }}
                      animate={{ width: metrics.totalTrips ? `${((seg.val/metrics.totalTrips)*100).toFixed(0)}%` : "0%" }}
                      transition={{ duration: 0.9, delay: 0.1 + i * 0.1 }}
                      className={`h-full ${seg.cls}`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  {[
                    { label:"Done",      val:metrics.done,      cls:"bg-emerald-500" },
                    { label:"Active",    val:metrics.active,    cls:"bg-blue-500" },
                    { label:"Booked",    val:metrics.booked,    cls:"bg-indigo-400" },
                    { label:"Cancelled", val:metrics.cancelled, cls:"bg-red-400" },
                  ].map(s => (
                    <span key={s.label} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                      <span className={`w-2 h-2 rounded-full ${s.cls}`}/> {s.label}:{" "}
                      <span className="font-black text-slate-800">{s.val}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <h3 className="text-base font-bold text-slate-800">Bookings</h3>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input
                      type="text" value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Search name, package, etc"
                      className="pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-56 bg-white"
                    />
                    {search && (
                      <button onClick={() => setSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X size={13}/>
                      </button>
                    )}
                  </div>
                  {/* Date */}
                  <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-xl px-3 py-2.5">
                    <Calendar size={14} className="text-slate-400"/>
                    <input type="month" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
                      className="text-sm text-slate-600 outline-none bg-transparent cursor-pointer"/>
                    {dateFilter && (
                      <button onClick={() => setDateFilter("")} className="text-slate-400 hover:text-slate-600">
                        <X size={13}/>
                      </button>
                    )}
                  </div>
                  {/* Add Booking */}
                  <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-colors">
                    <Plus size={16}/> Add Booking
                  </motion.button>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto max-h-[420px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100 shadow-sm">
                      <tr>
                        {["Name","Booking Code","Package","Duration","Date","Price","Status"].map(h => (
                          <th key={h} className="px-4 py-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap bg-slate-50">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {tableRows.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-16 text-slate-400">
                            <div className="flex flex-col items-center gap-3">
                              <AlertCircle size={32} className="opacity-30"/>
                              <p className="text-sm font-semibold">No bookings found</p>
                              <p className="text-xs">Try adjusting your search or date filter</p>
                            </div>
                          </td>
                        </tr>
                      ) : tableRows.map((t, idx) => (
                        <motion.tr key={t.id ?? idx}
                          initial={{ opacity:0, y:5 }}
                          animate={{ opacity:1, y:0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="hover:bg-blue-50/40 transition-colors"
                        >
                          {/* Name */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
                                {(t.leadGuestName || t.creatingFor || "?")[0].toUpperCase()}
                              </div>
                              <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
                                {t.leadGuestName || t.creatingFor || "—"}
                              </span>
                            </div>
                          </td>
                          {/* Booking Code */}
                          <td className="px-4 py-3">
                            <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                              {t.tripId || "—"}
                            </span>
                          </td>
                          {/* Package / Trip Name */}
                          <td className="px-4 py-3">
                            <span className="text-xs font-semibold text-slate-700 max-w-[140px] truncate block">
                              {t.tripName || "—"}
                            </span>
                          </td>
                          {/* Duration */}
                          <td className="px-4 py-3">
                            <span className="text-xs text-slate-600">
                              {(() => {
                                const nights = (t.routingData?.routes ?? []).reduce((a:number,r:any) => a+(r.nights||0), 0);
                                return nights ? `${nights+1} Days / ${nights} Nights` : "—";
                              })()}
                            </span>
                          </td>
                          {/* Date */}
                          <td className="px-4 py-3">
                            <span className="text-xs font-semibold text-slate-600">
                              {t.routingData?.startDate
                                ? `${t.routingData.startDate}${t.routingData.endDate ? ` – ${t.routingData.endDate}` : ""}`
                                : "TBA"}
                            </span>
                          </td>
                          {/* Price */}
                          <td className="px-4 py-3">
                            <span className="text-xs font-black text-emerald-600">
                              {t.finalSellPrice
                                ? new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(Number(t.finalSellPrice))
                                : "TBD"}
                            </span>
                          </td>
                          {/* Status */}
                          <td className="px-4 py-3">
                            <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                              t.bookingStatus === "confirmed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                              t.bookingStatus === "cancelled" ? "bg-red-50 text-red-700 border border-red-200" :
                              t.bookingStatus === "completed" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                              "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>
                              {t.bookingStatus || "Quote"}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              COMMISSIONS TAB
              ======================================================== */}
          {activeTab === "Commissions" && (
            <motion.div
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 gap-4 text-slate-400"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                <DollarSign size={28} className="opacity-40"/>
              </div>
              <p className="text-base font-bold text-slate-500">Commissions Coming Soon</p>
              <p className="text-sm text-slate-400 text-center max-w-xs">Track agent commissions and payout schedules here.</p>
            </motion.div>
          )}

         
              {/* ========================================================
              CONTACTS TAB (CRM & SRM Center)
              ======================================================== */}
          {activeTab === "Contacts" && (
            <motion.div
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.25 }}
              className="space-y-6"
            >
              {/* --- HEADER CONTROLS --- */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                 <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input
                      type="text" 
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                      placeholder="Search suppliers & tags..."
                      className="pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 w-64 bg-slate-50 transition-all"
                    />
                    {/* Clear Search Button */}
                    {contactSearch && (
                      <button 
                        onClick={() => setContactSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X size={13}/>
                      </button>
                    )}
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                      <BarChart2 size={16}/> Reporting
                    </button>
                    {/* <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                      <ArrowUpRight size={16}/> Download
                    </button> */}

                    <button 
                      onClick={handleDownloadSuppliers}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      <ArrowUpRight size={16}/> Download
                    </button>
                    
                    {/* Add Contact Dropdown */}
                    <div className="relative">
                      <button 
                        onClick={() => setAddContactDropdown(!addContactDropdown)}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2 rounded-xl shadow-md shadow-emerald-200 transition-colors"
                      >
                        Add Contact <ChevronDown size={14} className={`transition-transform ${addContactDropdown ? "rotate-180":""}`}/>
                      </button>
                      
                      <AnimatePresence>
                        {addContactDropdown && (
                          <motion.div 
                            initial={{ opacity:0, y:5, scale:0.95 }}
                            animate={{ opacity:1, y:0, scale:1 }}
                            exit={{ opacity:0, y:5, scale:0.95 }}
                            className="absolute right-0 top-11 bg-white border border-slate-200 shadow-xl rounded-xl w-48 overflow-hidden z-50"
                          >
                            {/* 🌟 DYNAMIC NAVIGATION TO SRM */}
                            <button 
                              onClick={() => router.push('/dashboard/srm/supplier')}
                              className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 border-b border-slate-100 flex items-center gap-2"
                            >
                               <Briefcase size={16} className="text-blue-500"/> Add Supplier
                            </button>
                            <button className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                               <User size={16} className="text-emerald-500"/> Add Client Lead
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                 </div>
              </div>

              {/* --- KPI METRICS ROW --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                 <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Suppliers</p>
                    <h3 className="text-4xl font-black text-slate-800">{suppliers?.length || 0}</h3>
                 </div>
                 
                 <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"/>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      New (Last 30 Days) <HelpCircle size={12}/>
                    </p>
                    {/* 🌟 DYNAMIC NEW COUNT */}
                    <h3 className="text-4xl font-black text-emerald-600">+{newSuppliersCount}</h3>
                 </div>

                 <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                      Top Suppliers (By Spend) <HelpCircle size={12}/>
                    </p>
                    <div className="space-y-2">
                       {/* 🌟 DYNAMIC TOP SUPPLIERS */}
                       {topSuppliersData.length > 0 ? (
                         topSuppliersData.map((ts, index) => (
                           <div key={index} className="flex justify-between items-center text-sm font-bold text-slate-700">
                              <span className="flex items-center gap-2 truncate pr-2">
                                <span className="w-4 text-slate-400">{index + 1}.</span> {ts.name}
                              </span>
                              <span className="text-emerald-600">{fmtShort(ts.amount)}</span>
                           </div>
                         ))
                       ) : (
                         <p className="text-xs text-slate-400 italic">No operations spend recorded yet.</p>
                       )}
                    </div>
                 </div>
              </div>

              {/* --- INNER TABS & TABLE --- */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                 
                 {/* Inner Tab Bar */}
                 <div className="flex border-b border-slate-100 px-6 gap-6 pt-2">
                    <button 
                      onClick={() => setContactSubTab('clients')}
                      className={`pb-3 pt-2 text-sm font-bold border-b-2 transition-all ${contactSubTab === 'clients' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                      Clients
                    </button>
                    <button 
                      onClick={() => setContactSubTab('suppliers')}
                      className={`pb-3 pt-2 text-sm font-bold border-b-2 transition-all ${contactSubTab === 'suppliers' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                      Suppliers
                    </button>
                 </div>

                 {/* Table Area */}
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                             <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Name</th>
                             <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Type</th>
                             <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Email</th>
                             <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Phone</th>
                             <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Created</th>
                             <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Bookings</th>
                             <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Profit Vol.</th>
                          </tr>
                       </thead>
                
                       <tbody className="divide-y divide-slate-50">
                          {contactSubTab === 'suppliers' ? (
                              filteredSuppliers?.length > 0 ? filteredSuppliers.map((sup, idx) => (
                                <tr key={sup.id || idx} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                   <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded-lg bg-[#0a1f44] text-white flex items-center justify-center text-xs font-bold">
                                            {sup.name.charAt(0).toUpperCase()}
                                         </div>
                                         <span className="text-sm font-bold text-slate-800">{sup.name}</span>
                                      </div>
                                   </td>
                                   <td className="px-6 py-4">
                                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                                        {sup.services?.[0] || 'General'}
                                      </span>
                                   </td>
                                   <td className="px-6 py-4 text-xs font-semibold text-slate-500">{sup.email || 'N/A'}</td>
                                   <td className="px-6 py-4 text-xs font-semibold text-slate-500">{sup.phone || 'N/A'}</td>
                                   <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                                      {sup.createdAt ? new Date(sup.createdAt).toLocaleDateString() : '—'}
                                   </td>

                                   <td className="px-6 py-4 text-xs font-bold text-slate-700">
      {supplierStats[sup.id || ""]?.bookings || 0}
  </td>
  <td className="px-6 py-4 text-xs font-black text-emerald-600 text-right">
      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(supplierStats[sup.id || ""]?.spend || 0)}
  </td>
                                
                                </tr>
                              )) : (
                                <tr>
                                  <td colSpan={7} className="text-center py-10 text-slate-400 font-medium">
                                    {contactSearch ? `No suppliers found matching "${contactSearch}"` : "No Suppliers Found."}
                                  </td>
                                </tr>
                              )
                          ) : (
                              // <tr><td colSpan={7} className="text-center py-10 text-slate-400 font-medium">Client database initializing...</td></tr>
                              
                              clients?.length > 0 ? clients.map((client, idx) => (
                                <tr key={client._id || idx} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                   <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black shrink-0 border border-emerald-100">
                                            {client.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                         </div>
                                         <span className="text-sm font-bold text-slate-800">{client.name}</span>
                                      </div>
                                   </td>
                                   <td className="px-6 py-4">
                                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                                        Traveler
                                      </span>
                                   </td>
                                   <td className="px-6 py-4 text-xs font-semibold text-slate-500">{client.email || 'N/A'}</td>
                                   <td className="px-6 py-4 text-xs font-semibold text-slate-500">{client.phone || 'N/A'}</td>
                                   <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                                      {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : '—'}
                                   </td>
                                   <td className="px-6 py-4 text-xs font-bold text-slate-700">
                                      {client.totalTrips || 0}
                                   </td>
                                   <td className="px-6 py-4 text-xs font-black text-emerald-600 text-right">
                                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(client.lifetimeValue || 0)}
                                   </td>
                                </tr>
                              )) : (
                                <tr><td colSpan={7} className="text-center py-10 text-slate-400 font-medium">No Clients Found. Try adding a new Inquiry on the CRM board!</td></tr>
                              )
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
            </motion.div>
          )}



          {/* ════════════════════════════════════════════════
    TASKS TAB
════════════════════════════════════════════════ */}

{/* ========================================================
              TASKS TAB (Global Data Table)
              ======================================================== */}
          {activeTab === "Tasks" && (
            <motion.div key="tasks"
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.22 }}
              className="space-y-6"
            >
              {/* ── TOP CONTROL BAR ── */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                {/* ── KPI PULSE CHECK ── */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label:"Total Tasks", val: taskMetrics.total,    color:"bg-white text-slate-700 border-slate-200" },
                  { label:"Active",      val: taskMetrics.active,   color:"bg-blue-50 text-blue-700 border-blue-200" },
                  { label:"Urgent",      val: taskMetrics.urgent,   color:"bg-orange-50 text-orange-700 border-orange-200" },
                  { label:"Overdue",     val: taskMetrics.overdue,  color:"bg-red-50 text-red-700 border-red-200" },
                  { label:"Completed",   val: taskMetrics.completed,color:"bg-emerald-50 text-emerald-700 border-emerald-200" },
                ].map(s => (
                  <div key={s.label} className={`border rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center ${s.color}`}>
                    <p className="text-2xl font-black">{s.val}</p>
                    <p className="text-[11px] font-bold uppercase tracking-wider opacity-80 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* ── TOP CONTROL BAR ── */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                 <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                      <input type="text" placeholder="Search tasks or trips..."
                        value={taskSearch} onChange={e => setTaskSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-48 bg-slate-50"
                      />
                    </div>
                    {/* Status Filter */}
                    <select value={taskStatusFilter} onChange={e => setTaskStatusFilter(e.target.value)}
                      className="px-3 py-2 text-sm font-semibold border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    {/* Time Filter 👈 NEW */}
                    <select value={taskTimeFilter} onChange={e => setTaskTimeFilter(e.target.value)}
                      className="px-3 py-2 text-sm font-semibold border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
                      <option value="all">All Time</option>
                      <option value="overdue">⚠️ Overdue</option>
                      <option value="today">📅 Due Today</option>
                      <option value="week">📅 Due This Week</option>
                    </select>
                    {/* Priority Filter */}
                    <select value={taskPriorityFilter} onChange={e => setTaskPriorityFilter(e.target.value)}
                      className="px-3 py-2 text-sm font-semibold border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
                      <option value="all">All Priorities</option>
                      <option value="urgent">🔴 Urgent</option>
                      <option value="high">🟠 High</option>
                      <option value="medium">🔵 Medium</option>
                      <option value="low">🟢 Low</option>
                    </select>
                    {/* User Filter */}
                    <select value={taskUserFilter} onChange={e => setTaskUserFilter(e.target.value)}
                      className="px-3 py-2 text-sm font-semibold border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
                      <option value="all">All Team Members</option>
                      {employees.map(emp => (
                        <option key={emp._id} value={emp._id}>{emp.name}</option>
                      ))}
                    </select>
                 </div>

                 {/* Add Task Button */}
                 <motion.button
                    whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                    onClick={() => {
                      setEditingTask(null);
                      setTaskForm({ title:"", description:"", assignedTo:"", priority:"medium", category:"other", deadline:"", linkedTripId:"" });
                      setIsTaskModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors whitespace-nowrap"
                 >
                    <Plus size={16}/> Add Task
                 </motion.button>
              </div>

              </div>

              {/* ── DATA TABLE ── */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loadingTasks ? (
                  <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
                    <Loader2 size={22} className="animate-spin text-blue-600"/>
                    <span className="text-sm font-semibold">Loading tasks...</span>
                  </div>
                ) : filteredAndSortedTasks.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <ClipboardList size={36} className="opacity-30 mx-auto mb-3"/>
                    <p className="text-sm font-semibold">No tasks found matching your filters.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Task Type</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Priority</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Deadline</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Assign To</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredAndSortedTasks.map((task: any) => {
                          const isOverdue = task.status !== "completed" && new Date(task.deadline).getTime() < new Date().getTime();

                          const PRIORITY_STYLE: any = {
                            urgent:{ badge:"bg-red-50 text-red-700 border-red-100", label:"🔴 Urgent" },
                            high  :{ badge:"bg-orange-50 text-orange-700 border-orange-100", label:"🟠 High" },
                            medium:{ badge:"bg-blue-50 text-blue-700 border-blue-100", label:"🔵 Medium" },
                            low   :{ badge:"bg-green-50 text-green-700 border-green-100", label:"🟢 Low" },
                          };
                          
                          const STATUS_STYLE: any = {
                            pending: "bg-slate-100 text-slate-600",
                            in_progress: "bg-blue-100 text-blue-700",
                            completed: "bg-emerald-100 text-emerald-700",
                            overdue: "bg-red-100 text-red-700"
                          };
                          
                          const pCfg = PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.medium;

                          return (
                            <tr key={task._id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                <p className={`text-sm font-bold ${task.status === "completed" ? "text-slate-400 line-through" : "text-slate-800"}`}>
                                  {task.title}
                                </p>
                                {task.linkedTripId && (
                                  <p className="text-[11px] text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
                                    ✈️ {task.linkedTripId.tripName || "Linked Trip"}
                                  </p>
                                )}
                              </td>
                              <td className="px-6 py-4">
                              <span className="text-xs font-semibold text-slate-500 capitalize">
  {(task.category || "other").replace("_", " ")}
</span>
                              </td>
                              <td className="px-6 py-4">
                                <select
                                  value={task.status}
                                  onChange={(e) => handleTaskStatusUpdate(task._id, e.target.value)}
                                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full outline-none cursor-pointer appearance-none border border-transparent hover:border-slate-300 ${isOverdue ? STATUS_STYLE.overdue : STATUS_STYLE[task.status]}`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${pCfg.badge}`}>
                                   {pCfg.label}
                                 </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className={`text-xs font-semibold flex items-center gap-1.5 ${isOverdue ? "text-red-600" : "text-slate-600"}`}>
                                  <Clock size={12}/>
                                  {new Date(task.deadline).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                                    {task.assignedTo?.name?.[0]?.toUpperCase() || "?"}
                                  </div>
                                  <span className="text-xs font-bold text-slate-700">{task.assignedTo?.name?.split(" ")[0] || "Unknown"}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 ">
                                  <button
                                    onClick={() => {
                                      setEditingTask(task);
                                      setTaskForm({
                                        title: task.title, description: task.description || "",
                                        assignedTo: task.assignedTo?._id || task.assignedTo,
                                        priority: task.priority, category: task.category,
                                        deadline: new Date(task.deadline).toISOString().slice(0,16),
                                        linkedTripId: task.linkedTripId?._id || ""
                                      });
                                      setIsTaskModalOpen(true);
                                    }}
                                    className="p-1.5 text-slate-400  hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  >
                                    <Pencil size={14}/>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task._id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={14}/>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* ========================================================
                  GLOBAL TASK CREATION MODAL
                  ======================================================== */}
              <AnimatePresence>
                {isTaskModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                      {/* Modal Header */}
                      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                          {editingTask ? <Pencil size={18} className="text-blue-600"/> : <Plus size={18} className="text-blue-600"/>}
                          {editingTask ? "Edit Task" : "Create New Task"}
                        </h3>
                        <button
                          onClick={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                          <X size={18}/>
                        </button>
                      </div>

                      {/* Modal Body / Form */}
                      <div className="p-6 overflow-y-auto custom-scrollbar">
                        <form id="task-form" onSubmit={handleAssignTask} className="space-y-5">
                          
                          {/* Task Title */}
                          <div>
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Task Title *</label>
                            <input type="text" required
                              value={taskForm.title}
                              onChange={e => setTaskForm(p => ({ ...p, title:e.target.value }))}
                              placeholder="e.g. Prepare new quotation for Jason Family"
                              className="w-full px-4 py-2.5 text-sm font-semibold border border-slate-200 bg-slate-50 focus:bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                          </div>

                          {/* Assign To & Deadline Row */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Assign To *</label>
                              <select required
                                value={taskForm.assignedTo}
                                onChange={e => setTaskForm(p => ({ ...p, assignedTo:e.target.value }))}
                                className="w-full px-4 py-2.5 text-sm font-semibold border border-slate-200 bg-slate-50 focus:bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                              >
                                <option value="" disabled>Select Team Member...</option>
                                {employees.map(emp => (
                                  <option key={emp._id} value={emp._id}>{emp.name} ({emp.role})</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Deadline *</label>
                              <input type="datetime-local" required
                                value={taskForm.deadline}
                                onChange={e => setTaskForm(p => ({ ...p, deadline:e.target.value }))}
                                className="w-full px-4 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                              />
                            </div>
                          </div>

                          {/* Category & Priority Row */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Task Type</label>
                              <select
                                value={taskForm.category}
                                onChange={e => setTaskForm(p => ({ ...p, category:e.target.value }))}
                                className="w-full px-4 py-2.5 text-sm font-semibold border border-slate-200 bg-slate-50 focus:bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                              >
                                <option value="follow_up">📞 Follow Up / Call</option>
                                <option value="document">📄 Document / Quote</option>
                                <option value="client">👤 Client Meeting</option>
                                <option value="operations">✈️ Operations</option>
                                <option value="other">📋 Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Priority</label>
                              <select
                                value={taskForm.priority}
                                onChange={e => setTaskForm(p => ({ ...p, priority:e.target.value }))}
                                className="w-full px-4 py-2.5 text-sm font-semibold border border-slate-200 bg-slate-50 focus:bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                              >
                                <option value="low">🟢 Low</option>
                                <option value="medium">🔵 Medium</option>
                                <option value="high">🟡 High</option>
                                <option value="urgent">🔴 Urgent</option>
                              </select>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Description / Notes</label>
                            <textarea rows={3}
                              value={taskForm.description}
                              onChange={e => setTaskForm(p => ({ ...p, description:e.target.value }))}
                              placeholder="Add specific instructions for the assignee..."
                              className="w-full px-4 py-3 text-sm font-semibold border border-slate-200 bg-slate-50 focus:bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                            />
                          </div>
                        </form>
                      </div>

                      {/* Modal Footer */}
                      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                        <button type="button"
                          onClick={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
                          className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          type="submit" form="task-form" disabled={taskSubmitting}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-colors disabled:opacity-60"
                        >
                          {taskSubmitting ? <><Loader2 size={16} className="animate-spin"/> Saving...</> : <><CheckCircle2 size={16}/> {editingTask ? "Update Task" : "Assign Task"}</>}
                        </motion.button>
                      </div>

                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
          
        </div>


        {/* ── FOOTER ── */}
        <div className="text-center pb-4">
          <p className="text-xs text-slate-400 font-medium">
            Travdek Admin · All data sourced live from your trip database
          </p>
        </div>

      </div>
    </div>
  );
}