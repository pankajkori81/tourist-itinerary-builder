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












// // app/dashboard/layout.tsx
// "use client";

// import { DashboardUIProvider, useDashboardUI } from '@/app/context/DashboardUIContext';
// import { Sidebar } from '@/components/dashboard/Sidebar';
// import { Topbar } from '@/components/dashboard/Topbar';

// // Internal component to consume the Context
// function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
//   const { isSidebarCollapsed } = useDashboardUI();

//   return (
//     <div className="h-screen w-full bg-gray-50 flex overflow-hidden">
//       {/* 1. Global Sidebar (Fixed width handled by component) */}
//       <Sidebar />

//       {/* 2. Main Content Wrapper */}
//       <div 
//         className={`flex-1 flex flex-col h-full transition-all duration-300 ease-in-out
//           ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} 
//         `}
//       >
//         {/* 3. Global Topbar (Fixed Height: 64px / 4rem) */}
//         <div className="h-18 flex-shrink-0 z-40 relative shadow-sm">
//           <Topbar />
//         </div>

//         {/* 4. Page Content Area 
//             This div takes exactly the remaining height (100vh - 64px).
//             It does NOT scroll. The children inside (Itinerary) handle their own scrolling.
//         */}
//         <main className="flex-1 relative overflow-hidden">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// // Root Wrapper
// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <DashboardUIProvider>
//       <DashboardLayoutContent>{children}</DashboardLayoutContent>
//     </DashboardUIProvider>
//   );
// } 















// "use client";

// import { useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { DashboardUIProvider, useDashboardUI } from '@/app/context/DashboardUIContext';
// import { AuthProvider, useAuth } from '@/app/context/AuthContext'; // <--- NEW IMPORT
// import { Sidebar } from '@/components/dashboard/Sidebar';
// import { Topbar } from '@/components/dashboard/Topbar';

// // Guard Component: Handles Redirection
// function AuthGuard({ children }: { children: React.ReactNode }) {
//   const { user, isAuthenticated } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     // If not authenticated and NOT on login page, redirect to login
//     if (!isAuthenticated && pathname !== '/dashboard/login') {
//       router.push('/dashboard/login');
//     }
//     // If authenticated and ON login page, redirect to dashboard
//     if (isAuthenticated && pathname === '/dashboard/login') {
//       router.push('/dashboard');
//     }
//   }, [isAuthenticated, pathname, router]);

//   // If on login page, render children (LoginPage) directly without Sidebar/Topbar
//   if (pathname === '/dashboard/login') {
//     return <>{children}</>;
//   }

//   // If not authenticated (and not on login), show nothing (wait for redirect)
//   if (!isAuthenticated) return null;

//   return <DashboardLayoutInner>{children}</DashboardLayoutInner>;
// }

// // Internal Layout (Sidebar + Topbar)
// function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
//   const { isSidebarCollapsed } = useDashboardUI();

//   return (
//     <div className="h-screen w-full bg-gray-50 flex overflow-hidden">
//       <Sidebar />
//       <div 
//         className={`flex-1 flex flex-col h-full transition-all duration-300 ease-in-out
//           ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} 
//         `}
//       >
//         <div className="h-18 flex-shrink-0 z-40 relative shadow-sm">
//           <Topbar />
//         </div>
//         <main className="flex-1 relative overflow-hidden">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// // Root Wrapper
// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <AuthProvider> {/* 1. Wrap with Auth */}
//       <DashboardUIProvider>
//         <AuthGuard> {/* 2. Protect with Guard */}
//           {children}
//         </AuthGuard>
//       </DashboardUIProvider>
//     </AuthProvider>
//   );
// } 


















"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardUIProvider, useDashboardUI } from '@/app/context/DashboardUIContext';
import { useUser } from '@/app/context/UserContext'; // <--- Using Real Auth
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import LoadingScreen from '@/components/dashboard/LoadingScreen';

// Guard Component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If we are done loading, and there is no user, kick them to login
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Show a loading screen while checking session
  // if (loading) return (
  //   <div className="h-screen w-full bg-[#0f172a] flex items-center justify-center text-white">
  //     Loading...
  //   </div>
  // );
  

  // Show a loading screen while checking session
  if (loading) return <LoadingScreen />;

  
  // If no user (and redirecting), don't render dashboard content
  if (!user) return null;

  return (
      <DashboardUIProvider>
        <div className="h-screen w-full bg-gray-50 flex overflow-hidden">
          <Sidebar />
          
          {/* Main Layout Wrapper handles the margins */}
          <MainContentWrapper>
             {children}
          </MainContentWrapper>
        </div>
     </DashboardUIProvider>
  );
}

// Helper to handle the margin shift based on sidebar state
function MainContentWrapper({ children }: { children: React.ReactNode }) {
    const { isSidebarCollapsed } = useDashboardUI();
    return (
        <div className={`flex-1 flex flex-col h-full transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
            <div className="h-18 flex-shrink-0 z-40 relative shadow-sm">
              <Topbar />
            </div>
            <main className="flex-1 relative overflow-hidden">
              {children}
            </main>
        </div>
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // We do NOT wrap with UserProvider here because it is already in RootLayout
  return (
       <AuthGuard>{children}</AuthGuard>
  );
}