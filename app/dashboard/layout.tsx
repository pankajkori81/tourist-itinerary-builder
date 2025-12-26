// "use client";

// import { DashboardUIProvider, useDashboardUI } from '@/app/context/DashboardUIContext';
// import { Sidebar } from '@/components/dashboard/Sidebar'
// import { Topbar } from '@/components/dashboard/Topbar'; // (Assume standard topbar code)

// // We need a wrapper component to use the hook inside the provider
// function DashboardContent({ children }: { children: React.ReactNode }) {
//   const { isSidebarCollapsed } = useDashboardUI();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Sidebar />
      
//       {/* Dynamic Margin based on Sidebar State */}
//       <div 
//         className={`transition-all duration-300 flex flex-col min-h-screen
//           ${isSidebarCollapsed ? 'pl-16' : 'pl-64'}
//         `}
//       >
//         <Topbar />
//         <main className="flex-1 relative">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// // The Root Layout Export
// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <DashboardUIProvider>
//       <DashboardContent>{children}</DashboardContent>
//     </DashboardUIProvider>
//   );
// } 












// app/dashboard/layout.tsx
"use client";

import { DashboardUIProvider, useDashboardUI } from '@/app/context/DashboardUIContext';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';

// Internal component to consume the Context
function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useDashboardUI();

  return (
    <div className="h-screen w-full bg-gray-50 flex overflow-hidden">
      {/* 1. Global Sidebar (Fixed width handled by component) */}
      <Sidebar />

      {/* 2. Main Content Wrapper */}
      <div 
        className={`flex-1 flex flex-col h-full transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} 
        `}
      >
        {/* 3. Global Topbar (Fixed Height: 64px / 4rem) */}
        <div className="h-18 flex-shrink-0 z-40 relative shadow-sm">
          <Topbar />
        </div>

        {/* 4. Page Content Area 
            This div takes exactly the remaining height (100vh - 64px).
            It does NOT scroll. The children inside (Itinerary) handle their own scrolling.
        */}
        <main className="flex-1 relative overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

// Root Wrapper
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardUIProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardUIProvider>
  );
}