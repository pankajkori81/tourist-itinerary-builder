// "use client";

// import React, { useState, useEffect } from "react";
// import { 
//   TrendingUp, 
//   Wallet, 
//   CreditCard, 
//   PieChart, 
//   Calendar, 
//   Download, 
//   Loader2, 
//   ArrowLeft,
//   Activity
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { 
//   AreaChart, 
//   Area, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer, 
//   Legend 
// } from "recharts";

// // --- Types ---
// interface KPIStats {
//   totalGBV: number;
//   totalCosts: number;
//   netProfit: number;
//   profitMargin: number;
// }

// interface ChartData {
//   month: string;
//   gbv: number;
//   cost: number;
//   profit: number;
// }

// interface ReportPayload {
//   success: boolean;
//   timeframe: string;
//   kpis: KPIStats;
//   chartData: ChartData[];
// }

// export default function EnterpriseReportsPage() {
//   const router = useRouter();
//   const [timeframe, setTimeframe] = useState("ytd"); // ytd, this_quarter, last_month, this_year
//   const [isLoading, setIsLoading] = useState(true);
//   const [reportData, setReportData] = useState<ReportPayload | null>(null);

//   // --- Fetch Data ---
//   useEffect(() => {
//     const fetchReports = async () => {
//       setIsLoading(true);
//       try {
//         const res = await fetch(`/api/reports/financials?timeframe=${timeframe}`);
//         if (res.ok) {
//           const data = await res.json();
//           setReportData(data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch reports:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchReports();
//   }, [timeframe]);

//   // --- Formatters ---
//   const formatCurrency = (val: number) => 
//     new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

//   // --- Custom Tooltip for Recharts ---
//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-200 min-w-[200px]">
//           <p className="text-sm font-black text-slate-800 mb-3 uppercase tracking-wider border-b border-slate-100 pb-2">{label}</p>
//           {payload.map((entry: any, index: number) => (
//             <div key={index} className="flex items-center justify-between mb-1.5 last:mb-0">
//               <span className="flex items-center gap-2 text-xs font-bold text-slate-600">
//                 <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
//                 {entry.name}:
//               </span>
//               <span className="text-sm font-mono font-bold text-slate-900">
//                 {formatCurrency(entry.value)}
//               </span>
//             </div>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      
//       {/* --- Background Accents --- */}
//       <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-indigo-900/5 to-transparent pointer-events-none" />
//       <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

//       <div className="relative z-10 p-8 max-w-[1400px] mx-auto w-full flex-1 flex flex-col">
        
//         {/* --- Header Section --- */}
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
//           <div>
//             <button 
//               onClick={() => router.back()} 
//               className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-4 bg-white/50 px-3 py-1.5 rounded-full backdrop-blur-md w-max border border-slate-200/60 shadow-sm"
//             >
//               <ArrowLeft size={14} /> Back to Dashboard
//             </button>
//             <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
//               <Activity className="text-indigo-600" size={32} />
//               Financial Intelligence
//             </h1>
//             <p className="text-sm font-semibold text-slate-500 mt-1">
//               Macro-level revenue, supplier costs, and margin analysis.
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             {/* Elegant Segmented Control */}
//             <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex items-center gap-1">
//               {[
//                 { id: "last_month", label: "Last Month" },
//                 { id: "this_quarter", label: "This QTR" },
//                 { id: "ytd", label: "YTD" },
//                 { id: "this_year", label: "12 Months" },
//               ].map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setTimeframe(tab.id)}
//                   className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
//                     timeframe === tab.id
//                       ? "bg-slate-900 text-white shadow-md"
//                       : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             <button className="bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-100 p-2.5 rounded-xl shadow-sm transition-colors" title="Custom Date Range">
//               <Calendar size={18} />
//             </button>
//             <button className="bg-indigo-600 text-white hover:bg-indigo-700 p-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 text-sm font-bold">
//               <Download size={18} /> Export
//             </button>
//           </div>
//         </div>

//         {/* --- Loading State --- */}
//         {isLoading ? (
//           <div className="flex-1 flex flex-col items-center justify-center gap-4">
//             <Loader2 size={40} className="animate-spin text-indigo-500" />
//             <p className="text-sm font-bold text-slate-400 animate-pulse">Aggregating Financial Data...</p>
//           </div>
//         ) : reportData ? (
//           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            
//             {/* --- KPI Cards Grid --- */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
//               {/* Card 1: GBV */}
//               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
//                 <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
//                     <Wallet size={20} />
//                   </div>
//                   <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">Gross Revenue</span>
//                 </div>
//                 <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">{formatCurrency(reportData.kpis.totalGBV)}</h3>
//                 <p className="text-xs font-semibold text-slate-400 mt-2">Total invoiced to clients</p>
//               </div>

//               {/* Card 2: Costs */}
//               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
//                 <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-sm border border-rose-100/50">
//                     <CreditCard size={20} />
//                   </div>
//                   <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-50 px-2 py-1 rounded-md">Total COGS</span>
//                 </div>
//                 <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">{formatCurrency(reportData.kpis.totalCosts)}</h3>
//                 <p className="text-xs font-semibold text-slate-400 mt-2">Expected & actual supplier payouts</p>
//               </div>

//               {/* Card 3: Net Profit */}
//               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
//                 <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100/50">
//                     <TrendingUp size={20} />
//                   </div>
//                   <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">Net Profit</span>
//                 </div>
//                 <h3 className="text-3xl font-black text-emerald-600 font-mono tracking-tight">{formatCurrency(reportData.kpis.netProfit)}</h3>
//                 <p className="text-xs font-semibold text-slate-400 mt-2">Gross Revenue minus COGS</p>
//               </div>

//               {/* Card 4: Profit Margin */}
//               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
//                 <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100/50">
//                     <PieChart size={20} />
//                   </div>
//                   <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-50 px-2 py-1 rounded-md">Blended Margin</span>
//                 </div>
//                 <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">{reportData.kpis.profitMargin}%</h3>
//                 <p className="text-xs font-semibold text-slate-400 mt-2">Average markup retention</p>
//               </div>

//             </div>

//             {/* --- Main Interactive Chart --- */}
//             <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
//               <div className="flex items-center justify-between mb-8">
//                 <div>
//                   <h3 className="text-lg font-black text-slate-900">Revenue vs. Cost Analysis</h3>
//                   <p className="text-xs font-semibold text-slate-500 mt-1">Monthly progression of cashflow and margins.</p>
//                 </div>
//                 <div className="flex items-center gap-4 text-xs font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
//                   <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Revenue</span>
//                   <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Costs</span>
//                   <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Profit</span>
//                 </div>
//               </div>
              
//               <div className="w-full h-[450px]">
//                 {reportData.chartData.length > 0 ? (
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={reportData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      
                     
//                       <defs>
//                         <linearGradient id="colorGbv" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
//                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
//                         </linearGradient>
//                         <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2} />
//                           <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
//                         </linearGradient>
//                         <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
//                           <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
//                         </linearGradient>
//                       </defs>

//                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      
//                       <XAxis 
//                         dataKey="month" 
//                         axisLine={false} 
//                         tickLine={false} 
//                         tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
//                         dy={10} 
//                       />
                      
//                       <YAxis 
//                         axisLine={false} 
//                         tickLine={false} 
//                         tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
//                         tickFormatter={(val) => `$${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
//                       />
                      
//                       <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      
//                       <Area 
//                         type="monotone" 
//                         dataKey="gbv" 
//                         name="Gross Revenue"
//                         stroke="#6366f1" 
//                         strokeWidth={3}
//                         fillOpacity={1} 
//                         fill="url(#colorGbv)" 
//                         activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
//                       />
//                       <Area 
//                         type="monotone" 
//                         dataKey="cost" 
//                         name="Total Costs"
//                         stroke="#fb7185" 
//                         strokeWidth={2}
//                         fillOpacity={1} 
//                         fill="url(#colorCost)" 
//                       />
//                       <Area 
//                         type="monotone" 
//                         dataKey="profit" 
//                         name="Net Profit"
//                         stroke="#10b981" 
//                         strokeWidth={2}
//                         fillOpacity={1} 
//                         fill="url(#colorProfit)" 
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl">
//                     <p className="text-slate-400 font-bold">No financial data available for this timeframe.</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="flex-1 flex items-center justify-center">
//             <p className="text-slate-400 font-bold">Failed to load reports. Please try again.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }









































































"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, Wallet, CreditCard, PieChart, 
  Calendar, Download, Loader2, ArrowLeft,
  Activity, ArrowUpRight, ArrowDownRight, 
  Landmark, PlaneTakeoff, Building2, MapPin,
  Trophy,
  Filter,
  Users,
  Target
} from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from "recharts";

import * as XLSX from 'xlsx';

// --- Types ---
interface KPIStats {
  current: {
    totalGBV: number;
    totalCosts: number;
    netProfit: number;
    profitMargin: number;
  };
  previous: {
    totalGBV: number;
    totalCosts: number;
    netProfit: number;
    profitMargin: number;
  };
  trends: {
    gbvChange: string;
    profitChange: string;
  };
}

interface Liquidity {
  awaitingFromClients: number;
  pendingToSuppliers: number;
}

interface BreakdownItem {
  country?: string;
  name?: string;
  profit?: number;
  cost?: number;
}

interface ChartData {
  month: string;
  gbv: number;
  cost: number;
  profit: number;
}

interface FinancialPayload {
  success: boolean;
  timeframe: string;
  kpis: {
    current: { totalGBV: number; totalCosts: number; netProfit: number; profitMargin: string };
    trends: { gbvChange: string; profitChange: string };
  };
  liquidity: { awaitingFromClients: number; pendingToSuppliers: number };
  chartData: { month: string; gbv: number; cost: number; profit: number }[];
  breakdowns: {
    byDestination: { country: string; profit: number }[];
    byService: { name: string; cost: number }[];
  };
}
interface SalesPayload {
  success: boolean;
  timeframe?: string;
  kpis: { totalLeads: number; conversionRate: number; activeAgents: number; };
  funnel: { stage: string; count: number; value: number; color: string; }[]; // Added 'value' here
  leaderboard: {
    monthlyTarget: number; agentId: string; name: string; avatar: string; totalRevenue: number; dealsClosed: number; 
}[];
}

export default function EnterpriseReportsPage() {
const router = useRouter();

// 1. New Tab Switcher State
const [activeTab, setActiveTab] = useState<"financials" | "sales">("financials");

// 2. Existing Shared States
const [timeframe, setTimeframe] = useState("ytd"); 
const [isLoading, setIsLoading] = useState(true);

// 3. New Split Data States (Replacing reportData)
const [finData, setFinData] = useState<FinancialPayload | null>(null);
const [salesData, setSalesData] = useState<SalesPayload | null>(null);


// --- Enterprise Excel Export Logic ---
  const handleExport = () => {
    // Create a new, blank Excel workbook
    const workbook = XLSX.utils.book_new();
    const today = new Date().toLocaleDateString();

    // 💰 Set your platform's main currency symbol right here!
    const currency = "$"; // Change to "₹" if your primary billing is in Rupees

    // 👇 ADD THIS TRANSLATION LOGIC
    const timeframeLabels: Record<string, string> = {
      "last_month": "Last Month",
      "this_qtr": "This Quarter",
      "ytd": "Year to Date",
      "12_months": "Last 12 Months"
    };

    // This checks our dictionary. If it doesn't find an exact match, it removes the underscore.
    const displayTimeframe = timeframeLabels[timeframe] || timeframe.replace(/_/g, ' ').toUpperCase();

    if (activeTab === "financials" && finData) {
      // 1. Build the Financial Excel Layout
      const financialSheetData = [
        ["TRAVDEK - FINANCIAL INTELLIGENCE REPORT"],
       ["Exported on:", today, "Timeframe:", displayTimeframe],
        [], 
        ["KEY PERFORMANCE INDICATORS"],
        ["Metric", "Amount"],
        ["Gross Revenue", `${currency}${finData.kpis.current.totalGBV.toLocaleString()}`],
        ["Total COGS", `${currency}${finData.kpis.current.totalCosts.toLocaleString()}`],
        ["Net Profit", `${currency}${finData.kpis.current.netProfit.toLocaleString()}`],
        ["Blended Margin", `${finData.kpis.current.profitMargin}%`],
        [],
        ["CASH FLOW LIQUIDITY"],
        ["Accounts Receivable", `${currency}${finData.liquidity.awaitingFromClients.toLocaleString()}`],
        ["Accounts Payable", `${currency}${finData.liquidity.pendingToSuppliers.toLocaleString()}`],
        [],
        ["TOP DESTINATIONS (PROFIT)"],
        ["Country", "Profit Generated"],
       ...finData.breakdowns.byDestination.map(dest => [
          dest.country, 
          // 👇 Add .toFixed(0) here to round to the nearest whole dollar
          `${currency}${Number(dest.profit.toFixed(0)).toLocaleString()}`
        ])
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(financialSheetData);
      worksheet['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(workbook, worksheet, "Financials");

    } else if (activeTab === "sales" && salesData) {
      // 2. Build the Sales Excel Layout
      const salesSheetData = [
        ["TRAVDEK - SALES & PIPELINE REPORT"],
        ["Exported on:", today, "Timeframe:", timeframe.toUpperCase()],
        [], 
        ["PIPELINE HEALTH"],
        ["Metric", "Value"],
        ["Total Leads", salesData.kpis.totalLeads],
        ["Conversion Rate", `${salesData.kpis.conversionRate}%`],
        [],
        ["EMPLOYEE LEADERBOARD"],
        ["Rank", "Employee Name", "Deals Closed", "Target Goal", "Revenue Generated"],
        ...salesData.leaderboard.map((agent, index) => [
          index + 1,
          agent.name,
          agent.dealsClosed,
          `${currency}${(agent.monthlyTarget || 0).toLocaleString()}`,
          `${currency}${agent.totalRevenue.toLocaleString()}`
        ])
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(salesSheetData);
      worksheet['!cols'] = [{ wch: 10 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(workbook, worksheet, "Team Performance");
    } else {
      return;
    }

    // 3. Download the actual .xlsx file
    XLSX.writeFile(workbook, `Travdek_${activeTab}_Report.xlsx`);
  };

// --- Fetch Logic ---
useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "financials") {
        const res = await fetch(`/api/reports/financials?timeframe=${timeframe}`);
        if (res.ok) setFinData(await res.json());
      } else {
        const res = await fetch(`/api/reports/sales?timeframe=${timeframe}`);
        if (res.ok) setSalesData(await res.json());
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  fetchData();
}, [timeframe, activeTab]);

// --- Formatters ---
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  const renderTrend = (trendStr: string) => {
    if (!trendStr) return null;
    const isPositive = trendStr.startsWith("+");
    return (
      <span className={`flex items-center gap-0.5 text-[10px] font-black px-2 py-1 rounded-md shadow-sm ${
        isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
      }`}>
        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {trendStr}
      </span>
    );
  };


  // --- Custom Tooltip for Recharts ---
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-200 min-w-[200px]">
          <p className="text-sm font-black text-slate-800 mb-3 uppercase tracking-wider border-b border-slate-100 pb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between mb-1.5 last:mb-0">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}:
              </span>
              <span className="text-sm font-mono font-bold text-slate-900">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

 return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      
      {/* --- Background Accents --- */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-indigo-900/5 to-transparent pointer-events-none" />
      <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 p-4 md:p-8 max-w-[1400px] mx-auto w-full flex-1 flex flex-col">
        
        {/* --- Unified Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-4 bg-white/50 px-3 py-1.5 rounded-full backdrop-blur-md w-max border border-slate-200/60 shadow-sm"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Activity className="text-indigo-600" size={32} />
              Enterprise Analytics
            </h1>
            
            {/* 🌟 NEW: Master Tab Switcher */}
            <div className="flex items-center gap-2 mt-4 bg-slate-200/50 p-1 rounded-xl w-max">
              <button onClick={() => setActiveTab("financials")} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "financials" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                Financials
              </button>
              <button onClick={() => setActiveTab("sales")} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "sales" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                Sales & Pipeline
              </button>
            </div>
          </div>

          {/* Timeframe Controls */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex items-center gap-1 min-w-max">
              {[{ id: "last_month", label: "Last Month" }, { id: "this_quarter", label: "This QTR" }, { id: "ytd", label: "YTD" }, { id: "this_year", label: "12 Months" }].map((tab) => (
                <button key={tab.id} onClick={() => setTimeframe(tab.id)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeframe === tab.id ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <button className="bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-100 p-2.5 rounded-xl shadow-sm transition-colors shrink-0">
              <Calendar size={18} />
            </button>
         <button 
  onClick={handleExport}
  className="bg-indigo-600 text-white hover:bg-indigo-700 p-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 text-sm font-bold shrink-0"
>
  <Download size={18} /> Export
</button>
          </div>
        </div>

        {/* --- Loading State --- */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <Loader2 size={40} className="animate-spin text-indigo-500" />
            <p className="text-sm font-bold text-slate-400 animate-pulse">Aggregating Enterprise Data...</p>
          </div>
        ) : activeTab === "financials" && finData ? (
          
          /* ════════════════════════════════════════════════════════════ */
          /* PHASE 1: FINANCIAL DASHBOARD                                 */
          /* ════════════════════════════════════════════════════════════ */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                    <Wallet size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">Gross Revenue</span>
                </div>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">{formatCurrency(finData.kpis?.current?.totalGBV || 0)}</h3>
                  <div className="mb-1">{renderTrend(finData.kpis.trends.gbvChange)}</div>
                </div>
                <p className="text-xs font-semibold text-slate-400 mt-2">Total invoiced to clients</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-sm border border-rose-100/50">
                    <CreditCard size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-50 px-2 py-1 rounded-md">Total COGS</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">{formatCurrency(finData.kpis.current.totalCosts)}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-2">Expected & actual supplier payouts</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100/50">
                    <TrendingUp size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">Net Profit</span>
                </div>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-emerald-600 font-mono tracking-tight">{formatCurrency(finData.kpis.current.netProfit)}</h3>
                  <div className="mb-1">{renderTrend(finData.kpis.trends.profitChange)}</div>
                </div>
                <p className="text-xs font-semibold text-slate-400 mt-2">Gross Revenue minus COGS</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100/50">
                    <PieChart size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-50 px-2 py-1 rounded-md">Blended Margin</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">{finData.kpis.current.profitMargin}%</h3>
                <p className="text-xs font-semibold text-slate-400 mt-2">Average markup retention</p>
              </div>

            </div>

            {/* Liquidity Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Accounts Receivable</h4>
                  <p className="text-2xl font-black text-slate-900 font-mono">{formatCurrency(finData.liquidity.awaitingFromClients)}</p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">Pending payments from clients</p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                  <Landmark className="text-emerald-500" size={24} />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Accounts Payable</h4>
                  <p className="text-2xl font-black text-slate-900 font-mono">{formatCurrency(finData.liquidity.pendingToSuppliers)}</p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">Pending payouts to suppliers</p>
                </div>
                <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100">
                  <PlaneTakeoff className="text-rose-500" size={24} />
                </div>
              </div>
            </div>

            {/* Main Interactive Chart */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Revenue vs. Cost Analysis</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">Monthly progression of cashflow and margins.</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-max">
                  <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Revenue</span>
                  <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Costs</span>
                  <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Profit</span>
                </div>
              </div>
              
              <div className="w-full h-[400px]">
                {finData.chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={finData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorGbv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} tickFormatter={(val) => `$${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`} />
                      <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      
                      <Area type="monotone" dataKey="gbv" name="Gross Revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorGbv)" activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }} />
                      <Area type="monotone" dataKey="cost" name="Total Costs" stroke="#fb7185" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
                      <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl">
                    <p className="text-slate-400 font-bold">No financial data available for this timeframe.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Breakdowns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><MapPin size={20}/></div>
                  <h3 className="text-base font-black text-slate-900">Top Destinations</h3>
                </div>
                
                <div className="space-y-5">
                  {finData.breakdowns.byDestination.length > 0 ? (
                    finData.breakdowns.byDestination.map((dest: { profit: any; country: any; }, idx: React.Key | null | undefined) => {
                      const maxProfit = finData.breakdowns.byDestination[0]?.profit || 1;
                      const widthPercent = ((dest.profit || 0) / maxProfit) * 100;
                      
                      return (
                        <div key={idx}>
                          <div className="flex justify-between text-sm font-bold text-slate-700 mb-1.5">
                            <span>{dest.country || "Unknown"}</span>
                            <span className="font-mono">{formatCurrency(dest.profit || 0)}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full" 
                              style={{ width: `${widthPercent}%` }}
                            />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-slate-400 font-bold">No destination data found.</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><Building2 size={20}/></div>
                  <h3 className="text-base font-black text-slate-900">Cost by Service Type</h3>
                </div>

                <div className="space-y-5">
                  {finData.breakdowns.byService.length > 0 ? (
                    finData.breakdowns.byService.map((srv: { cost: any; name: any; }, idx: React.Key | null | undefined) => {
                      const maxCost = finData.breakdowns.byService[0]?.cost || 1;
                      const widthPercent = ((srv.cost || 0) / maxCost) * 100;
                      
                      return (
                        <div key={idx}>
                          <div className="flex justify-between text-sm font-bold text-slate-700 mb-1.5 capitalize">
                            <span>{srv.name || "Other"}</span>
                            <span className="font-mono">{formatCurrency(srv.cost || 0)}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-rose-400 rounded-full" 
                              style={{ width: `${widthPercent}%` }}
                            />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-slate-400 font-bold">No service cost data found.</p>
                  )}
                </div>
              </div>

            </div>
          </div>

        ) : activeTab === "sales" && salesData ? (

          /* ════════════════════════════════════════════════════════════ */
          /* PHASE 2: SALES & PIPELINE DASHBOARD                          */
          /* ════════════════════════════════════════════════════════════ */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            
            {/* Sales KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-2 text-slate-500 font-bold text-xs uppercase tracking-wider"><Filter size={16}/> Total Leads</div>
                <div className="text-4xl font-black text-slate-900 font-mono">{salesData.kpis.totalLeads}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-2 text-indigo-500 font-bold text-xs uppercase tracking-wider"><Target size={16}/> Conversion Rate</div>
                <div className="text-4xl font-black text-indigo-600 font-mono">{salesData.kpis.conversionRate}%</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-2 text-slate-500 font-bold text-xs uppercase tracking-wider"><Users size={16}/> Active Employees</div>
                <div className="text-4xl font-black text-slate-900 font-mono">{salesData.kpis.activeAgents}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Pipeline Funnel Visualization */}
              {/* <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 lg:col-span-1 flex flex-col">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><Filter size={20} className="text-indigo-500"/> Lead Funnel</h3>
                
                <div className="flex-1 flex flex-col items-center justify-center gap-2 w-full max-w-[300px] mx-auto">
                  {salesData.funnel.map((item, i) => {
                    // Calculate visual width based on count relative to total
                    const maxCount = Math.max(...salesData.funnel.map(f => f.count), 1);
                    const widthPercent = Math.max(20, (item.count / maxCount) * 100);
                    
                    return (
                      <div key={item.stage} 
                           className={`w-full h-14 rounded-xl flex items-center justify-between px-4 transition-all ${item.color}`}
                           style={{ width: `${widthPercent}%`, minWidth: '150px' }}>
                        <span className="font-bold text-sm uppercase tracking-wide">{item.stage}</span>
                        <span className="font-black text-lg font-mono">{item.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div> */}


              {/* Pipeline Funnel Visualization */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 lg:col-span-1 flex flex-col">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><Filter size={20} className="text-indigo-500"/> Lead Funnel</h3>
                
                <div className="flex-1 flex flex-col items-center justify-center gap-2 w-full max-w-[300px] mx-auto">
                  {salesData.funnel.map((item, i) => {
                    const maxCount = Math.max(...salesData.funnel.map(f => f.count), 1);
                    const widthPercent = Math.max(20, (item.count / maxCount) * 100);
                    
                    return (
                      <div key={item.stage} 
                           className={`w-full py-3 rounded-xl flex flex-col justify-center px-4 transition-all ${item.color}`}
                           style={{ width: `${widthPercent}%`, minWidth: '150px' }}>
                        
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-sm uppercase tracking-wide">{item.stage}</span>
                          <span className="font-black text-lg font-mono">{item.count}</span>
                        </div>

                        {/* The new Business Feature: Showing Money on the Table */}
                        {item.stage === "Quoted" && item.value > 0 && (
                          <div className="mt-1 text-[11px] font-black tracking-wide bg-white/40 px-2 py-1 rounded-md border border-amber-200/50 flex justify-between items-center w-full">
                            <span>PIPELINE VALUE:</span>
                            <span className="font-mono">{formatCurrency(item.value)}</span>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Agent Leaderboard */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 lg:col-span-2">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><Trophy size={20} className="text-amber-500"/> Employee Leaderboard</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
                        <th className="pb-4 font-bold">Rank</th>
                        <th className="pb-4 font-bold">Employee</th>
                        <th className="pb-4 font-bold text-center">Deals Closed</th>
                        <th className="pb-4 font-bold text-right">Revenue Generated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.leaderboard.length > 0 ? (
                        salesData.leaderboard.map((agent, index) => (
                          <tr key={agent.agentId} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                            <td className="py-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-200 text-slate-600' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-400'}`}>
                                #{index + 1}
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                {agent.avatar ? (
                                  <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm uppercase border border-indigo-100">
                                    {agent.name.substring(0, 2)}
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-slate-900 text-sm">{agent.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-center">
                              <span className="inline-flex items-center justify-center bg-slate-100 text-slate-600 font-bold text-xs px-3 py-1 rounded-full">
                                {agent.dealsClosed} Trips
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <span className="font-black text-slate-900 font-mono text-base tracking-tight">
                                {formatCurrency(agent.totalRevenue)}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400 font-bold text-sm">
                            No closed deals found for this timeframe.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
             <p className="text-slate-400 font-bold">Failed to load reports. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}

