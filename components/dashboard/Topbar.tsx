// "use client";

// import React,{useState, useEffect} from 'react';
// import { 
//   Search, 
//   Calendar, 
//   Mail, 
//   MessageSquare, 
//   HelpCircle, 
//   CheckSquare, 
//   Bell, 
//   ChevronDown 
// } from 'lucide-react';
// import { useRouter, usePathname } from "next/navigation";
// import Link from "next/link";
// import Image from 'next/image';
// import { useAuth } from '@/app/context/AuthContext'; // <--- Import


//  export function Topbar() {

//       const [currentTime, setCurrentTime] = useState(new Date());
//       const [authChecked, setAuthChecked] = useState(false);
//       const router = useRouter();
//       const pathname = usePathname();

//       const { user, logout } = useAuth();
 

//   // Update time every second
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     });
//   };

//   const formatDate = (date: Date) => {
//     return date.toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };
//   return (
//     <header className="h-18 bg-white border-b border-gray-200 flex items-center justify-between px-0 fixed top-0 right-0 z-40 transition-all duration-300 w-full  lg:w-[calc(100%-4rem)]" 
//     // Note: The width above (lg:w-[...]) needs to be dynamic based on the sidebar state. 
//     // Since this component is inside the layout flex container, it's better to NOT make it fixed width 
//     // but rather let the flexbox handle it, or pass the state. 
//     // FOR SIMPLICITY in your layout, remove 'fixed' and let it sit in the flex flow, 
//     // OR keep it fixed and rely on the margin-left from the layout.
//     >
      

//        <div className="font-bold text-xl tracking-wider text-white">
//               <img
//                 src="/logo/TravDek-Logo-Blue.svg"
//                 alt="TravDek Logo"
//                 className="h-7 ml-2 w-auto object-contain"
//               />
            
//            </div>
//       {/* 1. LEFT: Action Buttons */}
//       <div className="flex items-center gap-3">
//         <ActionButton label="Task" icon={<CheckSquare size={16} />} />
//         <ActionButton label="Event" icon={<Calendar size={16} />} />
//         <ActionButton label="Webmail" icon={<Mail size={16} />} />
//         <ActionButton label="Messenger" icon={<MessageSquare size={16} />} />
//         <ActionButton label="Q&A" icon={<HelpCircle size={16} />} />
//       </div>

//       {/* 2. CENTER: Search Bar */}
//       <div className="flex-1 max-w-xl mx-6">
//         <div className="relative">
//           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//             <Search size={18} />
//           </span>
//           <input 
//             type="text" 
//             placeholder="Search..." 
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
//           />
//         </div>
//       </div>





//       {/* 3. RIGHT: Profile & Time */}
//       <div className="flex items-center gap-6">
        
//         {/* Date/Time Block */}
//         <div className="text-right hidden xl:block">
//           {/* <div className="text-sm font-bold text-gray-800">09:49:20 AM</div>
//           <div className="text-xs text-blue-600 font-medium">Tue, Dec 23, 2025</div> */}

//           <div className="hidden md:flex flex-col items-end bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
//               <div className="text-blue-900 font-bold text-sm">
//                 {formatTime(currentTime)}
//               </div>
//                <div className="text-xs text-blue-600 font-medium">
//                 {formatDate(currentTime)}
//               </div>
           
//             </div>
//         </div>

//         <div className="h-8 w-px bg-gray-200 hidden xl:block"></div>

//         {/* Profile Dropdown */}
//         {/* <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
//           <div className="relative">
//              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
           
//                <img 
//                  src="https://i.pravatar.cc/150?img=3" 
//                  alt="Profile" 
//                  className="w-full h-full object-cover"
//                />
//              </div>
//              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//           </div>
//           <ChevronDown size={16} className="text-gray-400" />
//         </div> */}


// {/* User Info Block */}
//         <div className="text-right hidden xl:block">
//            <div className="text-sm font-bold text-gray-800">{user?.name}</div>
//            <div className="text-xs text-blue-600 font-medium uppercase tracking-wider">{user?.role}</div>
//         </div>

//         {/* Profile Dropdown */}
//         <div 
//           onClick={logout} // Simple logout for now
//           className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
//           title="Click to Logout"
//         >
//           <div className="relative">
//              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
//                <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover"/>
//              </div>
//              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//           </div>
//           <ChevronDown size={16} className="text-gray-400" />
//         </div>
//       </div>
//     </header>
//   );
// }

// // Helper Component for the Top Buttons
// function ActionButton({ label, icon }: { label: string, icon: React.ReactNode }) {
//   return (
//     <button className="flex items-center gap-2 px-3 py-2 bg-white border border-blue-200 text-blue-900 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-xs font-bold shadow-sm">
//       {icon}
//       <span>{label}</span>
//     </button>
//   );
// } 




// "use client";

// import React, { useState, useEffect } from 'react';
// import { 
//   Search, 
//   Calendar, 
//   Mail, 
//   MessageSquare, 
//   HelpCircle, 
//   CheckSquare, 
//   ChevronDown 
// } from 'lucide-react';
// import { useUser } from '@/app/context/UserContext'; // <--- CORRECT IMPORT

// export function Topbar() {
//   const [currentTime, setCurrentTime] = useState(new Date());
  
//   // USE THE REAL USER CONTEXT (This fixes the error)
//   const { user, logout } = useUser(); 

//   // Update time every second
//   useEffect(() => {
//     setCurrentTime(new Date());
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     });
//   };

//   const formatDate = (date: Date) => {
//     return date.toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   return (
//     <header className="h-18 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      
//       {/* 1. LEFT: Logo Mobile Only */}
//       <div className="md:hidden font-bold text-xl tracking-wider text-blue-600">
//          TRAVDEK
//       </div>

//       {/* 2. LEFT: Action Buttons (Desktop) */}
//       <div className="hidden md:flex items-center gap-3">
//         <ActionButton label="Task" icon={<CheckSquare size={16} />} />
//         <ActionButton label="Event" icon={<Calendar size={16} />} />
//         <ActionButton label="Webmail" icon={<Mail size={16} />} />
//         <ActionButton label="Messenger" icon={<MessageSquare size={16} />} />
//         <ActionButton label="Q&A" icon={<HelpCircle size={16} />} />
//       </div>

//       {/* 3. CENTER: Search Bar */}
//       <div className="flex-1 max-w-xl mx-6 hidden md:block">
//         <div className="relative">
//           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//             <Search size={18} />
//           </span>
//           <input 
//             type="text" 
//             placeholder="Search..." 
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
//           />
//         </div>
//       </div>

//       {/* 4. RIGHT: Profile & Time */}
//       <div className="flex items-center gap-6">
        
//         {/* Date/Time Block */}
//         <div className="hidden md:flex flex-col items-end bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
//            <div className="text-blue-900 font-bold text-sm">
//              {formatTime(currentTime)}
//            </div>
//             <div className="text-xs text-blue-600 font-medium">
//              {formatDate(currentTime)}
//            </div>
//         </div>

//         <div className="h-8 w-px bg-gray-200 hidden xl:block"></div>

//         {/* User Info Block */}
//         <div className="text-right hidden xl:block">
//            <div className="text-sm font-bold text-gray-800">{user?.name || 'Guest'}</div>
//            <div className="text-xs text-blue-600 font-medium uppercase tracking-wider">{user?.role || 'Visitor'}</div>
//         </div>

//         {/* Profile Dropdown */}
//         <div 
//           onClick={() => logout()} 
//           className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors group"
//           title="Click to Logout"
//         >
//           <div className="relative">
//              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300 group-hover:border-blue-400 transition-colors">
//                {/* Handles missing avatar with a default image */}
//                <img 
//                  src={user?.profilePicture || "https://i.pravatar.cc/150?u=default"} 
//                  alt="Profile" 
//                  className="w-full h-full object-cover"
//                />
//              </div>
//              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//           </div>
//           <ChevronDown size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
//         </div>
//       </div>
//     </header>
//   );
// }

// // Helper Component for the Top Buttons
// function ActionButton({ label, icon }: { label: string, icon: React.ReactNode }) {
//   return (
//     <button className="flex items-center gap-2 px-3 py-2 bg-white border border-blue-200 text-blue-900 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-xs font-bold shadow-sm">
//       {icon}
//       <span>{label}</span>
//     </button>
//   );
// } 





































































































"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Calendar, Mail, MessageSquare, HelpCircle, 
  CheckSquare, ChevronDown, User, Settings, LogOut 
} from 'lucide-react';
import { useUser } from '@/app/context/UserContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Topbar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // <--- NEW STATE
  const dropdownRef = useRef<HTMLDivElement>(null); // <--- For click outside
  
  const { user, logout } = useUser();
  const router = useRouter(); 

  // Update time
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <header className="h-18 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      
      {/* 1. Logo (Mobile) */}
      <div className="md:hidden font-bold text-xl tracking-wider text-blue-600">TRAVDEK</div>

      {/* 2. Action Buttons */}
      <div className="hidden md:flex items-center gap-3">
        <ActionButton label="Task" icon={<CheckSquare size={16} />} />
        <ActionButton label="Event" icon={<Calendar size={16} />} />
        <ActionButton label="Webmail" icon={<Mail size={16} />} />
        <ActionButton label="Messenger" icon={<MessageSquare size={16} />} />
        <ActionButton label="Q&A" icon={<HelpCircle size={16} />} />
      </div>

      {/* 3. Search Bar */}
      <div className="flex-1 max-w-xl mx-6 hidden md:block">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={18} /></span>
          <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all" />
        </div>
      </div>

      {/* 4. Right Section */}
      <div className="flex items-center gap-6">
        
        {/* Time */}
        <div className="hidden md:flex flex-col items-end bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
           <div className="text-blue-900 font-bold text-sm">{formatTime(currentTime)}</div>
           <div className="text-xs text-blue-600 font-medium">{formatDate(currentTime)}</div>
        </div>

        <div className="h-8 w-px bg-gray-200 hidden xl:block"></div>

        {/* User Info */}
        <div className="text-right hidden xl:block">
           <div className="text-sm font-bold text-gray-800">{user?.name || 'Guest'}</div>
           <div className="text-xs text-blue-600 font-medium uppercase tracking-wider">{user?.role || 'Visitor'}</div>
        </div>

        {/* --- DYNAMIC DROPDOWN --- */}
        <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300 group-hover:border-blue-400 transition-colors">
                  <img 
                    src={user?.profilePicture || "https://i.pravatar.cc/150?u=default"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Active Status Dot */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* THE DROPDOWN MENU */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-14 w-60 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2">
                 
                 {/* Header in Dropdown */}
                 <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                    <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                 </div>

                 <div className="p-1">
                    <Link 
                      href="/dashboard/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      <User size={16} /> Profile
                    </Link>
                    
                    <Link 
                      href="/dashboard/settings" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      <Settings size={16} /> Account Settings
                    </Link>
                 </div>

                 <div className="border-t border-gray-100 my-1"></div>

                 <div className="p-1">
                    <button 
                      onClick={() => { logout(); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                 </div>
              </div>
            )}
        </div>
      </div>
    </header>
  );
}

function ActionButton({ label, icon }: { label: string, icon: React.ReactNode }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-blue-200 text-blue-900 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-xs font-bold shadow-sm">
      {icon} <span>{label}</span>
    </button>
  );
}