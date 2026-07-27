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
  Landmark, PlaneTakeoff, Building2, MapPin
} from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from "recharts";

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

interface ReportPayload {
  success: boolean;
  timeframe: string;
  kpis: KPIStats;
  liquidity: Liquidity;
  breakdowns: {
    byDestination: BreakdownItem[];
    byService: BreakdownItem[];
  };
  chartData: ChartData[];
}

export default function EnterpriseReportsPage() {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState("ytd"); 
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportPayload | null>(null);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/reports/financials?timeframe=${timeframe}`);
        if (res.ok) {
          const data = await res.json();
          setReportData(data);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [timeframe]);

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
        
        {/* --- Header Section --- */}
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
              Financial Intelligence
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Macro-level revenue, liquidity, and margin analysis.
            </p>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
            {/* Elegant Segmented Control */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex items-center gap-1 min-w-max">
              {[
                { id: "last_month", label: "Last Month" },
                { id: "this_quarter", label: "This QTR" },
                { id: "ytd", label: "YTD" },
                { id: "this_year", label: "12 Months" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTimeframe(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                    timeframe === tab.id
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button className="bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-100 p-2.5 rounded-xl shadow-sm transition-colors shrink-0">
              <Calendar size={18} />
            </button>
            <button className="bg-indigo-600 text-white hover:bg-indigo-700 p-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 text-sm font-bold shrink-0">
              <Download size={18} /> Export
            </button>
          </div>
        </div>

        {/* --- Loading State --- */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <Loader2 size={40} className="animate-spin text-indigo-500" />
            <p className="text-sm font-bold text-slate-400 animate-pulse">Aggregating Financial Data...</p>
          </div>
        ) : reportData ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            
            {/* --- 1. KPI Cards Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: GBV */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                    <Wallet size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">Gross Revenue</span>
                </div>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">{formatCurrency(reportData.kpis?.current?.totalGBV || 0)}</h3>
                  <div className="mb-1">{renderTrend(reportData.kpis.trends.gbvChange)}</div>
                </div>
                <p className="text-xs font-semibold text-slate-400 mt-2">Total invoiced to clients</p>
              </div>

              {/* Card 2: Costs */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-sm border border-rose-100/50">
                    <CreditCard size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-50 px-2 py-1 rounded-md">Total COGS</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">{formatCurrency(reportData.kpis.current.totalCosts)}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-2">Expected & actual supplier payouts</p>
              </div>

              {/* Card 3: Net Profit */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100/50">
                    <TrendingUp size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">Net Profit</span>
                </div>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-emerald-600 font-mono tracking-tight">{formatCurrency(reportData.kpis.current.netProfit)}</h3>
                  <div className="mb-1">{renderTrend(reportData.kpis.trends.profitChange)}</div>
                </div>
                <p className="text-xs font-semibold text-slate-400 mt-2">Gross Revenue minus COGS</p>
              </div>

              {/* Card 4: Profit Margin */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100/50">
                    <PieChart size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-50 px-2 py-1 rounded-md">Blended Margin</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">{reportData.kpis.current.profitMargin}%</h3>
                <p className="text-xs font-semibold text-slate-400 mt-2">Average markup retention</p>
              </div>

            </div>

            {/* --- 2. Liquidity (Cash Flow) Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Accounts Receivable */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Accounts Receivable</h4>
                  <p className="text-2xl font-black text-slate-900 font-mono">{formatCurrency(reportData.liquidity.awaitingFromClients)}</p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">Pending payments from clients</p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                  <Landmark className="text-emerald-500" size={24} />
                </div>
              </div>
              
              {/* Accounts Payable */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Accounts Payable</h4>
                  <p className="text-2xl font-black text-slate-900 font-mono">{formatCurrency(reportData.liquidity.pendingToSuppliers)}</p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">Pending payouts to suppliers</p>
                </div>
                <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100">
                  <PlaneTakeoff className="text-rose-500" size={24} />
                </div>
              </div>
            </div>

            {/* --- 3. Main Interactive Chart --- */}
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
                {reportData.chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reportData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      
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

            {/* --- 4. Breakdowns Grid --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Top Destinations by Profit */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><MapPin size={20}/></div>
                  <h3 className="text-base font-black text-slate-900">Top Destinations</h3>
                </div>
                
                <div className="space-y-5">
                  {reportData.breakdowns.byDestination.length > 0 ? (
                    reportData.breakdowns.byDestination.map((dest, idx) => {
                      const maxProfit = reportData.breakdowns.byDestination[0]?.profit || 1;
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

              {/* Cost Breakdown by Service */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><Building2 size={20}/></div>
                  <h3 className="text-base font-black text-slate-900">Cost by Service Type</h3>
                </div>

                <div className="space-y-5">
                  {reportData.breakdowns.byService.length > 0 ? (
                    reportData.breakdowns.byService.map((srv, idx) => {
                      const maxCost = reportData.breakdowns.byService[0]?.cost || 1;
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
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-400 font-bold">Failed to load reports. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}

