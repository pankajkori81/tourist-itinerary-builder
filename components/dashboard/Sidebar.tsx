// "use client";

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Home, Map, Users, Settings, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
// import { useDashboardUI } from '@/app/context/DashboardUIContext';

// export function Sidebar() {
//   const pathname = usePathname();
//   const { isSidebarCollapsed, toggleSidebar } = useDashboardUI();

//   // Helper to check active link
//   const isActive = (path: string) => pathname?.startsWith(path);

//   const navItems = [
//     { label: 'Dashboard', path: '/dashboard', icon: Home, exact: true },
//     { label: 'Itinerary', path: '/dashboard/itinerary/create', icon: Map },
//     { label: 'SRM', path: '/dashboard/srm', icon: Users },
//     { label: 'Settings', path: '/dashboard/settings', icon: Settings },
//   ];

//   return (
//     <aside 
//       className={`fixed left-0 top-0 h-screen bg-[#0f172a] text-white transition-all duration-300 z-50 border-r border-gray-700
//         ${isSidebarCollapsed ? 'w-16' : 'w-64'}
//       `}
//     >
//       {/* 1. Header / Toggle Area */}
//       <div className={`flex items-center h-16 border-b border-gray-700 ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-4'}`}>
//         {!isSidebarCollapsed && (
//           <span className="font-bold text-xl tracking-wider">TRAVDEK</span>
//         )}
//         <button 
//           onClick={toggleSidebar}
//           className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
//         >
//           {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
//         </button>
//       </div>

//       {/* 2. Navigation Items */}
//       <nav className="p-2 space-y-1 mt-2">
//         {navItems.map((item) => {
//           const active = item.exact ? pathname === item.path : isActive(item.path);
          
//           return (
//             <Link 
//               key={item.path} 
//               href={item.path}
//               className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group relative
//                 ${active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
//                 ${isSidebarCollapsed ? 'justify-center' : ''}
//               `}
//             >
//               <item.icon size={20} className="shrink-0" />
              
//               {!isSidebarCollapsed && (
//                 <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
//               )}

//               {/* Tooltip for Collapsed Mode */}
//               {isSidebarCollapsed && (
//                 <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
//                   {item.label}
//                 </div>
//               )}
//             </Link>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }



























// // components/dashboard/Sidebar.tsx
// "use client";

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Home, Map, Users, Settings, ChevronLeft, Menu, RouteIcon, BarChart3, Plane, CreditCard, User, Settings2, HelpCircle, Calendar } from 'lucide-react'; // Removed duplicate icons
// import { useDashboardUI } from '@/app/context/DashboardUIContext';
// import Image from 'next/image'; // Assuming you use Next Image, or use <img>

// export function Sidebar() {
//   const pathname = usePathname();
//   const { isSidebarCollapsed, toggleSidebar } = useDashboardUI();

//   const isActive = (path: string) => pathname?.startsWith(path);

//   const navItems = [
//     { label: 'Dashboard', path: '/dashboard', icon: Home, exact: true },
//        { label: "Trips", href: "/dashboard/trips", icon: Calendar },
//     { label: 'Itinerary', path: '/dashboard/itinerary/create', icon: Map }, // Link to main itinerary page
//     { label: 'SRM', path: '/dashboard/srm', icon: Users },
//     {
//       label: "Travel Operations",
//       href: "/dashboard/travel-operations",
//       icon: RouteIcon,
//     },
//     { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
//     {
//       label: "Travel Advisor",
//       href: "/dashboard/travel-advisor",
//       icon: Plane,
//     },
//     {
//       label: "Subscription",
//       href: "/dashboard/subscription",
//       icon: CreditCard,
//     },
//     { label: "Employees", href: "/dashboard/employees", icon: User },
//     { label: "Settings", href: "/dashboard/settings", icon: Settings2 },
//     {
//       label: "Help Center",
//       href: "/dashboard/admin/help-center",
//       icon: HelpCircle,
//     },
//   ];

//   return (
//     <aside 
//       className={`fixed left-0 top-0 h-full bg-[#0f172a] text-white transition-all duration-300 z-50 border-r border-gray-700 flex flex-col
//         ${isSidebarCollapsed ? 'w-16' : 'w-61'}
//       `}
//     >
//       {/* 1. Header Area: Logo + Toggle */}
//       <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700 shrink-0">
        
//         {/* LOGO LOGIC: Show only when expanded */}
//         {!isSidebarCollapsed && (
//            <div className="font-bold text-xl tracking-wider text-white">
//               <img
//                 src="/logo/TravDek-Logo-Blue.svg"
//                 alt="TravDek Logo"
//                 className="h-8 w-auto  object-contain"
//               />
            
//            </div>
//         )}

//         {/* TOGGLE BUTTON */}
//         <button 
//           onClick={toggleSidebar}
//           className={`p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors ${isSidebarCollapsed ? 'mx-auto' : ''}`}
//         >
//           {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
//         </button>
//       </div>

//       {/* 2. Navigation Items */}
//       <nav className="flex-1 p-2 space-y-1 mt-2 overflow-y-auto">
//         {navItems.map((item) => {
//           // Fix exact match logic for dashboard home
//           const active = item.exact 
//             ? pathname === item.path 
//             : pathname?.startsWith(item.path);
          
//           return (
//             <Link 
//               key={item.path} 
//               href={item.path}
//               className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group relative
//                 ${active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
//                 ${isSidebarCollapsed ? 'justify-center' : ''}
//               `}
//             >
//               <item.icon size={20} className="shrink-0" />
              
//               {!isSidebarCollapsed && (
//                 <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
//               )}

//               {/* Tooltip for Collapsed Mode */}
//               {isSidebarCollapsed && (
//                 <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-lg">
//                   {item.label}
//                 </div>
//               )}
//             </Link>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// } 







// "use client";

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { 
//   Home, Map, Users, Settings, ChevronLeft, Menu, 
//   RouteIcon, BarChart3, Plane, CreditCard, User, 
//   Settings2, HelpCircle, Calendar 
// } from 'lucide-react';
// import { useDashboardUI } from '@/app/context/DashboardUIContext';
// import Image from 'next/image';

// export function Sidebar() {
//   const pathname = usePathname();
//   const { isSidebarCollapsed, toggleSidebar } = useDashboardUI();

//   // Helper to check active link
//   const isActive = (path: string) => pathname?.startsWith(path);

//   // FIXED: Changed all 'href' properties to 'path' to match your map function
//   const navItems = [
//     { label: 'Dashboard', path: '/dashboard', icon: Home, exact: true },
//     { label: "Trips", path: "/dashboard/trips", icon: Calendar }, 
//     { label: 'Itinerary', path: '/dashboard/itinerary/create', icon: Map },
//     { label: 'SRM', path: '/dashboard/srm/activity', icon: Users },
//     { label: "Travel Operations", path: "/dashboard/travel-operations", icon: RouteIcon },
//     { label: "Reports", path: "/dashboard/reports", icon: BarChart3 },
//     { label: "Travel Advisor", path: "/dashboard/travel-advisor", icon: Plane },
//     { label: "Subscription", path: "/dashboard/subscription", icon: CreditCard },
//     { label: "Employees", path: "/dashboard/employees", icon: User },
//     { label: "Settings", path: "/dashboard/settings", icon: Settings2 },
//     { label: "Help Center", path: "/dashboard/admin/help-center", icon: HelpCircle },
//   ];

//   return (
//     <aside 
//       className={`fixed left-0 top-0 h-full bg-[#0f172a] text-white transition-all duration-300 z-50 border-r border-gray-700 flex flex-col
//         ${isSidebarCollapsed ? 'w-16' : 'w-64'} 
//       `}
//     >
//       {/* 1. Header Area: Logo + Toggle */}
//       <div className="h-18 flex items-center justify-between px-4 border-b border-gray-700 shrink-0">
        
//         {/* LOGO LOGIC: Show only when expanded */}
//         {!isSidebarCollapsed && (
//            <div className="font-bold text-xl tracking-wider text-white">
//               {/* Ensure you have the width/height set for optimization if not using fill */}
//               <img
//                 src="/logo/Travdek-white.svg"
//                 alt="TravDek Logo"
//                 className="h-7 w-auto object-contain"
//               />
//            </div>
//         )}

//         {/* TOGGLE BUTTON */}
//         <button 
//           onClick={toggleSidebar}
//           className={`p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors ${isSidebarCollapsed ? 'mx-auto' : ''}`}
//         >
//           {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
//         </button>
//       </div>

//       {/* 2. Navigation Items */}
//       <nav className="flex-1 p-2 space-y-1 mt-2 overflow-y-auto">
//         {navItems.map((item) => {
//           // Logic handles string | undefined safely now
//           const active = item.exact 
//             ? pathname === item.path 
//             : pathname?.startsWith(item.path);
          
//           return (
//             <Link 
//               key={item.path} 
//               href={item.path}
//               className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group relative
//                 ${active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
//                 ${isSidebarCollapsed ? 'justify-center' : ''}
//               `}
//             >
//               <item.icon size={20} className="shrink-0" />
              
//               {!isSidebarCollapsed && (
//                 <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
//               )}

//               {/* Tooltip for Collapsed Mode */}
//               {isSidebarCollapsed && (
//                 <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-lg">
//                   {item.label}
//                 </div>
//               )}
//             </Link>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// } 






















"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Map, Users, Settings, ChevronLeft, Menu, 
  RouteIcon, BarChart3, Plane, CreditCard, User, 
  Settings2, HelpCircle, Calendar, Briefcase, 
  Landmark , ShieldAlert
} from 'lucide-react';
import { useDashboardUI } from '@/app/context/DashboardUIContext';
import { useUser } from '@/app/context/UserContext'; // <--- Import User Context

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useDashboardUI();
  const { user } = useUser(); // <--- Get current user role

  // Helper to check active link
  const isActive = (path: string) => pathname?.startsWith(path);

  // --- 1. DEFINE ALL MENUS WITH ROLES ---
  const allNavItems = [
    // 1. Dashboard (Everyone)
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: Home, 
      exact: true,
      roles: ['admin', 'employee', 'agent'] 
    },
    
    // 2. Lead Management (New: Agents & Admins)
    { 
      label: "Leads", 
      path: "/dashboard/leads", 
      icon: Briefcase, 
      roles: ['admin', 'agent'] 
    },

    // 3. Core Trips & Itinerary (Everyone)
    { 
      label: "Trips", 
      path: "/dashboard/trips", 
      icon: Calendar,
      roles: ['admin', 'employee', 'agent']
    }, 
    { 
      label: 'Itinerary', 
      path: '/dashboard/itinerary/create', // Restored your original path
      icon: Map,
      roles: ['admin', 'employee', 'agent']
    },

    // 4. SRM / Suppliers (Admins & Employees)
    { 
      label: 'SRM', 
      path: '/dashboard/srm/activity', 
      icon: Users,
      roles: ['admin', 'employee'] // Agents don't see backend suppliers
    },

    // 5. Travel Operations (Everyone)
    { 
      label: "Travel Operations", 
      path: "/dashboard/travel-operations", 
      icon: RouteIcon,
      roles: ['admin', 'employee', 'agent']
    },


      { 
      label: "Rate Manager", 
      path: "/dashboard/rate-manager", 
      icon: Landmark,
      roles: ['admin']
    },

    // 6. Reports (Admin Only)
    { 
      label: "Reports", 
      path: "/dashboard/reports", 
      icon: BarChart3,
      roles: ['admin']
    },

    // Crisis / Duty of Care (Admin & Employee Only)
    { 
      label: "Crisis Management", 
      path: "/dashboard/crisis-management", 
      icon: ShieldAlert,
      roles: ['admin', 'employee']
    },


    // 7. Travel Advisor (Admin & Employee)
    { 
      label: "Travel Advisor", 
      path: "/dashboard/travel-advisor", // Restored missing menu
      icon: Plane,
      roles: ['admin', 'employee'] 
    },

    // 8. Subscription (Admin Only)
    { 
      label: "Subscription", 
      path: "/dashboard/subscription", 
      icon: CreditCard,
      roles: ['admin']
    },

    // 9. HR / Employee Management (Admin Only)
    { 
      label: "Employees", 
      path: "/dashboard/employees", 
      icon: User,
      roles: ['admin']
    },

    // 10. Agent Approvals (New: Admin Only)
    {
      label: "Agent Approvals",
      path: "/dashboard/admin/agents",
      icon: Users,
      roles: ['admin']
    },

    // 11. Settings & Help (Everyone)
    { 
      label: "Settings", 
      path: "/dashboard/settings", 
      icon: Settings2,
      roles: ['admin', 'employee', 'agent']
    },
    { 
      label: "Help Center", 
      path: "/dashboard/admin/help-center", 
      icon: HelpCircle,
      roles: ['admin', 'employee', 'agent']
    },
  ];

  // --- 2. FILTER BASED ON ROLE ---
  // If user is loading or doesn't exist, return empty to prevent errors
  const visibleItems = allNavItems.filter(item => {
    if (!user) return false; 
    return item.roles.includes(user.role);
  });

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-[#0f172a] text-white transition-all duration-300 z-50 border-r border-gray-700 flex flex-col
        ${isSidebarCollapsed ? 'w-16' : 'w-64'} 
      `}
    >
      {/* 1. Header Area: Logo + Toggle */}
      <div className="h-18 flex items-center justify-between px-4 border-b border-gray-700 shrink-0">
        
        {/* LOGO LOGIC: Show only when expanded */}
        {!isSidebarCollapsed && (
           <div className="font-bold text-xl tracking-wider text-white">
              <img
                src="/logo/Travdek-white.svg"
                alt="TravDek Logo"
                className="h-7 w-auto object-contain"
              />
           </div>
        )}

        {/* TOGGLE BUTTON */}
        <button 
          onClick={toggleSidebar}
          className={`p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors ${isSidebarCollapsed ? 'mx-auto' : ''}`}
        >
          {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* 2. Navigation Items */}
      <nav className="flex-1 p-2 space-y-1 mt-2 overflow-y-auto">
        {/* Map over visibleItems instead of all navItems */}
        {visibleItems.map((item) => {
          const active = item.exact 
            ? pathname === item.path 
            : pathname?.startsWith(item.path);
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group relative
                ${active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                ${isSidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <item.icon size={20} className="shrink-0" />
              
              {!isSidebarCollapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}

              {/* Tooltip for Collapsed Mode */}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-lg">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}