
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { BarChart3, Download, Search, LayoutGrid, List as ListIcon } from "lucide-react";
// import { SRMProvider, useSRM } from "@/app/context/SRMContext";

// // Internal Header Component to use Context
// const SRMHeader = () => {
//   const pathname = usePathname();
//   const { searchText, setSearchText, viewMode, setViewMode } = useSRM();

//   const isActive = (path: string) => pathname.includes(path);

//   return (
//     <div className="bg-[#0a1f44] text-white h-14 flex items-center justify-between px-4 shadow-md z-20 shrink-0">
//       {/* 1. Navigation Links */}
//       <div className="flex space-x-8 text-sm font-medium h-full">
//         <Link 
//           href="/dashboard/srm/supplier" 
//           className={`flex items-center h-full px-1 border-b-2 transition-colors ${
//             isActive('/srm/supplier') ? "border-yellow-400 text-yellow-400" : "border-transparent text-gray-400 hover:text-white"
//           }`}
//         >
//           SUPPLIER
//         </Link>
//         <Link 
//           href="/dashboard/srm/stay" 
//           className={`flex items-center h-full px-1 border-b-2 transition-colors ${
//             isActive('/srm/stay') ? "border-yellow-400 text-yellow-400" : "border-transparent text-gray-400 hover:text-white"
//           }`}
//         >
//           STAY
//         </Link>
//         <button className="flex items-center h-full px-1 text-gray-400 hover:text-white transition-colors">RESTAURANT</button>

//                 <Link 
//           href="/dashboard/srm/activity" 
//           className={`flex items-center h-full px-1 border-b-2 transition-colors ${
//             isActive('/srm/activity') ? "border-yellow-400 text-yellow-400" : "border-transparent text-gray-400 hover:text-white"
//           }`}
//         >
//           ACTIVITY
//         </Link>
//       </div>

//       {/* 2. Global Search Bar */}
//       <div className="flex-1 max-w-md mx-6 relative">
//           <input 
//             type="text" 
//             placeholder="Search Supplier, Stay, ID, Country..." 
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             className="w-full pl-9 pr-4 py-1.5 rounded bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:bg-white/20 text-sm"
//           />
//           <Search className="absolute left-2.5 top-2 text-gray-300 w-4 h-4" />
//       </div>

//       {/* 3. Action Buttons & View Toggles */}
//       <div className="flex items-center gap-4">
//          {/* View Toggles (Restored) */}
//          <div className="flex bg-white/10 rounded p-1 border border-white/20">
//             <button 
//               onClick={() => setViewMode('grid')}
//               className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-yellow-400 text-[#0a1f44]' : 'text-gray-300 hover:text-white'}`}
//               title="Grid View"
//             >
//               <LayoutGrid size={16} />
//             </button>
//             <button 
//               onClick={() => setViewMode('list')}
//               className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'bg-yellow-400 text-[#0a1f44]' : 'text-gray-300 hover:text-white'}`}
//               title="List View"
//             >
//               <ListIcon size={16} />
//             </button>
//          </div>

//          {/* Report & Download */}
//          <div className="flex gap-2">
//             <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-xs transition-colors font-medium">
//               <BarChart3 size={14} /> Reports
//             </button>
//             <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-xs transition-colors font-medium">
//               <Download size={14} /> Download
//             </button>
//          </div>
//       </div>
//     </div>
//   );
// };

// export default function SRMLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <SRMProvider>
//       <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
//         <SRMHeader />
//         <div className="flex-1 relative overflow-hidden">
//            {children}
//         </div>
//       </div>
//     </SRMProvider>
//   );
// } 






"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Download, Search, LayoutGrid, List as ListIcon } from "lucide-react";
import { SRMProvider, useSRM } from "@/app/context/SRMContext";

const SRMHeader = () => {
  const pathname = usePathname();
  const { searchText, setSearchText, viewMode, setViewMode } = useSRM();

  const isActive = (path: string) => pathname.includes(path);

  return (
    <div className="bg-[#0a1f44] text-white h-14 flex items-center justify-between px-4 shadow-md z-20 shrink-0">
      {/* 1. Navigation Links - UPDATED */}
      <div className="flex space-x-6 text-sm font-medium h-full">
        <Link href="/dashboard/srm/supplier" className={`flex items-center h-full px-1 border-b-2 transition-colors ${isActive('/srm/supplier') ? "border-yellow-400 text-yellow-400" : "border-transparent text-gray-400 hover:text-white"}`}>
          SUPPLIER
        </Link>
          <Link href="/dashboard/srm/activity" className={`flex items-center h-full px-1 border-b-2 transition-colors ${isActive('/srm/activity') ? "border-yellow-400 text-yellow-400" : "border-transparent text-gray-400 hover:text-white"}`}>
          ACTIVITY
        </Link>
        <Link href="/dashboard/srm/stay" className={`flex items-center h-full px-1 border-b-2 transition-colors ${isActive('/srm/stay') ? "border-yellow-400 text-yellow-400" : "border-transparent text-gray-400 hover:text-white"}`}>
          STAY
        </Link>
        <Link href="/dashboard/srm/transport" className={`flex items-center h-full px-1 border-b-2 transition-colors ${isActive('/srm/transport') ? "border-yellow-400 text-yellow-400" : "border-transparent text-gray-400 hover:text-white"}`}>
          TRANSPORT
        </Link>
        <Link href="/dashboard/srm/meal" className={`flex items-center h-full px-1 border-b-2 transition-colors ${isActive('/srm/meal') ? "border-yellow-400 text-yellow-400" : "border-transparent text-gray-400 hover:text-white"}`}>
          MEAL
        </Link>
      </div>

      {/* 2. Global Search Bar */}
      <div className="flex-1 max-w-md mx-6 relative">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:bg-white/20 text-sm"
          />
          <Search className="absolute left-2.5 top-2 text-gray-300 w-4 h-4" />
      </div>

      {/* 3. Action Buttons */}
      <div className="flex items-center gap-4">
         <div className="flex bg-white/10 rounded p-1 border border-white/20">
            <button onClick={() => setViewMode('grid')} className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-yellow-400 text-[#0a1f44]' : 'text-gray-300 hover:text-white'}`}><LayoutGrid size={16} /></button>
            <button onClick={() => setViewMode('list')} className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'bg-yellow-400 text-[#0a1f44]' : 'text-gray-300 hover:text-white'}`}><ListIcon size={16} /></button>
         </div>
      </div>
    </div>
  );
};

export default function SRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <SRMProvider>
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        <SRMHeader />
        <div className="flex-1 relative overflow-hidden">
           {children}
        </div>
      </div>
    </SRMProvider>
  );
}