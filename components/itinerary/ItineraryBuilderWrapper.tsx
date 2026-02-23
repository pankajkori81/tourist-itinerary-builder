// "use client";

// import React, { useState, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { Loader2, Check, AlertCircle } from 'lucide-react';
// import { useItinerary } from '@/app/context/ItineraryContext';

// export default function ItineraryBuilderWrapper({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();
  
//   // Logic to hide Builder Header/Sidebar on specific pages
//   const isLibraryPage = pathname?.includes('/library');
//   const isPreviewDetailsPage = pathname ? /\/preview\/.+/.test(pathname) : false;
  
//   // If we are on Library or Preview, we act as a "Full Width" page inside the builder
//   const isFullWidthPage = isLibraryPage || isPreviewDetailsPage;

//   const { 
//     itineraryData, 
//     saveItinerary, 
//     isSaving, 
//     saveError 
//   } = useItinerary();

//   // Tab Navigation Logic
//   const [activeTab, setActiveTab] = useState('INTRO');
//   const [showErrorPopup, setShowErrorPopup] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   // Update active tab based on URL
//   useEffect(() => {
//     if (pathname?.includes('/routing')) setActiveTab('ROUTING');
//     else if (pathname?.includes('/create-day')) setActiveTab('CREATE DAY');
//     else if (pathname?.includes('/preview') && !isPreviewDetailsPage) setActiveTab('PREVIEW');
//     else setActiveTab('INTRO');
//   }, [pathname, isPreviewDetailsPage]);

//   // Define your tabs
//   const tabs = [
//     { id: 'INTRO', label: 'INTRO', path: '/dashboard/itinerary/create' },
//     { id: 'ROUTING', label: 'ROUTING', path: '/dashboard/itinerary/routing' },
//     { id: 'CREATE DAY', label: 'CREATE DAY', path: '/dashboard/itinerary/create-day' },
//     { id: 'COSTING', label: 'COSTING', path: '/dashboard/itinerary/costing' },
//     { id: 'PREVIEW', label: 'PREVIEW', path: '/dashboard/itinerary/preview' },
//   ];

//   // Error handling from Context
//   useEffect(() => {
//     if (saveError) {
//       setErrorMessage(saveError);
//       setShowErrorPopup(true);
//     }
//   }, [saveError]);

//   const handleTabChange = (path: string) => {
//     router.push(path);
//   };

//   const handleQuickSave = async () => {
//     await saveItinerary('quick');
//   };

//   const handleSaveAndExit = async () => {
//     const success = await saveItinerary('exit');
//     if (success) {
//       // You might want to redirect to SRM or Dashboard instead of library depending on workflow
//       setTimeout(() => {
//         router.push('/dashboard/itinerary/library'); 
//       }, 1000);
//     }
//   };

//   const libraryPage = async () => {
//    router.push('/dashboard/itinerary/library');
//   }

//   return (
//     // CHANGED: Height calculation to fit below Global Header (64px)
//     <div className="h-[calc(100vh-64px)] relative overflow-hidden bg-gray-50 flex flex-col">
      
//       {/* Background Styling */}
//       <div className="absolute inset-0 z-0 bg-slate-900"/>
//       <div 
//         className="absolute inset-0 z-0 opacity-20 pointer-events-none"
//         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600')", backgroundSize: 'cover' }}
//       />

//       {/* --- CONTENT LAYER --- */}
      
//       {/* 1. BUILDER HEADER (Quick Save, etc.) - Hidden on Library/Preview */}
//       {!isFullWidthPage && (
//         <div className="relative z-10 bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-700 px-4 py-3 flex items-center justify-between shrink-0">
//           {/* <div className="text-white font-bold text-lg tracking-wide">
//             Travdek<span className="text-blue-400"> Itinerary Builder</span>
//           </div> */}

//           <div className='hidden md:block'>
//               <button onClick={libraryPage} className="px-4 py-2 bg-blue-600 text-blue-100 hover:bg-blue-600/60 rounded-sm text-sm font-medium transition-all flex gap-2 border border-blue-500/30">
//                 Library
//              </button>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button 
//               onClick={handleQuickSave} 
//               disabled={isSaving} 
//               className="px-4 py-2 bg-blue-600 text-blue-100 hover:bg-blue-600/60 rounded-sm text-sm font-medium transition-all flex items-center gap-2 border border-blue-500/30"
//             >
//               {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4"/>}
//               {isSaving ? 'Saving...' : 'Quick Save'}
//             </button>
            
//             <button 
//               onClick={handleSaveAndExit} 
//               disabled={isSaving}
//               className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-sm text-sm font-medium transition-all shadow-lg"
//             >
//               Save & Exit
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 2. BUILDER BODY (Sidebar + Content) */}
//       <div className="relative z-10 flex flex-1 overflow-hidden">
        
//         {/* Builder Sidebar Tabs - Hidden on Library/Preview */}
//         {!isFullWidthPage && (
//           <div className="w-64 bg-[#1e293b]/90 backdrop-blur-md border-r border-gray-700 p-4 hidden md:flex flex-col overflow-y-auto shrink-0">
//             {/* Trip Summary Card */}
//             <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/10">
//               <h3 className="text-gray-200 text-sm font-bold mb-1 line-clamp-1">{itineraryData.tripName || 'Untitled Trip'}</h3>
//               <p className="text-blue-300 text-xs font-mono">Ref No.{'********'}</p>
//             </div>

//             {/* Navigation Links */}
//             <nav className="space-y-1">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => handleTabChange(tab.path)}
//                   className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
//                     activeTab === tab.id
//                       ? 'bg-blue-600 text-white shadow-lg'
//                       : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                   }`}
//                 >
//                   {tab.label}
//                   {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
//                 </button>
//               ))}
//             </nav>
//           </div>
//         )}

//         {/* Main Page Content */}
//         <main className={`flex-1 overflow-y-auto bg-gray-50/5 ${!isFullWidthPage ? 'p-0' : ''}`}>
//           {children}
//         </main>
//       </div>

//       {/* Notifications */}
//       {showErrorPopup && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//           <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="text-red-500 w-6 h-6 shrink-0"/>
//               <div>
//                 <h3 className="font-bold text-gray-900">Error</h3>
//                 <p className="text-sm text-gray-600 mt-1">{errorMessage}</p>
//               </div>
//             </div>
//             <button onClick={() => setShowErrorPopup(false)} className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700">Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// } 




























// "use client";

// import React, { useState, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { Loader2, Check, AlertCircle } from 'lucide-react';
// import { useItinerary } from '@/app/context/ItineraryContext';

// export default function ItineraryBuilderWrapper({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();
  
//   const isLibraryPage = pathname?.includes('/library');
//   const isPreviewDetailsPage = pathname ? /\/preview\/.+/.test(pathname) : false;
//   const isFullWidthPage = isLibraryPage || isPreviewDetailsPage;

//   const { 
//     itineraryData, 
//     saveItinerary, 
//     isSaving, 
//     saveError 
//   } = useItinerary();

//   const [activeTab, setActiveTab] = useState('INTRO');
//   const [showErrorPopup, setShowErrorPopup] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     if (pathname?.includes('/routing')) setActiveTab('ROUTING');
//     else if (pathname?.includes('/create-day')) setActiveTab('CREATE DAY');
//     else if (pathname?.includes('/preview') && !isPreviewDetailsPage) setActiveTab('PREVIEW');
//     else setActiveTab('INTRO');
//   }, [pathname, isPreviewDetailsPage]);

//   // Error handling
//   useEffect(() => {
//     if (saveError) {
//       setErrorMessage(saveError);
//       setShowErrorPopup(true);
//     }
//   }, [saveError]);

//   const tabs = [
//     { id: 'INTRO', label: 'INTRO', path: '/dashboard/itinerary/create' },
//     { id: 'ROUTING', label: 'ROUTING', path: '/dashboard/itinerary/routing' },
//     { id: 'CREATE DAY', label: 'CREATE DAY', path: '/dashboard/itinerary/create-day' },
//     { id: 'COSTING', label: 'COSTING', path: '/dashboard/itinerary/costing' },
//     { id: 'PREVIEW', label: 'PREVIEW', path: '/dashboard/itinerary/preview' },
//   ];

//   const handleTabChange = (path: string) => router.push(path);
//   const handleQuickSave = async () => await saveItinerary('quick');
//   const handleSaveAndExit = async () => {
//     const success = await saveItinerary('exit');
//     if (success) setTimeout(() => router.push('/dashboard/itinerary/library'), 1000);
//   };
//   const libraryPage = async () => router.push('/dashboard/itinerary/library');

//   return (
//     // FIX: Use h-full to fill the space provided by dashboard/layout.tsx
//     <div className="h-full relative flex flex-col bg-gray-50">
      
//       {/* Background Styling */}
//       <div className="absolute inset-0 z-0 bg-slate-900"/>
//       <div 
//         className="absolute inset-0 z-0 opacity-20 pointer-events-none"
//         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600')", backgroundSize: 'cover' }}
//       />

//       {/* --- 1. BUILDER HEADER (No Logo, Just Title + Actions) --- */}
//       {!isFullWidthPage && (
//         <div className="relative z-10 bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-700 px-4 py-3 flex items-center justify-between shrink-0 h-16">
          
//           {/* LEFT: Builder Title (Logo removed) */}
//           <div className="flex items-center gap-4">
//              <h2 className="text-white font-bold text-lg tracking-wide">
//                Itinerary <span className="text-blue-400">Builder</span>
//              </h2>
             
//              {/* Library Button moved near title for better UX */}
//              <button onClick={libraryPage} className="hidden ml-11 md:flex px-7 py-2 bg-blue-600 text-blue-100 hover:bg-blue-600/40 rounded text-sm font-medium transition-all border border-blue-500/30">
//                 Library
//              </button>
//           </div>
          
//           {/* RIGHT: Action Buttons */}
//           <div className="flex items-center gap-3">
//             <button 
//               onClick={handleQuickSave} 
//               disabled={isSaving} 
//               className="px-4 py-2 bg-blue-600 text-blue-100 hover:bg-blue-500 rounded-sm text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
//             >
//               {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4"/>}
//               {isSaving ? 'Saving...' : 'Quick Save'}
//             </button>
            
//             <button 
//               onClick={handleSaveAndExit} 
//               disabled={isSaving}
//               className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-sm text-sm font-medium transition-all shadow-sm"
//             >
//               Save & Exit
//             </button>
//           </div>
//         </div>
//       )}

//       {/* --- 2. BUILDER CONTENT AREA --- */}
//       <div className="relative z-10 flex flex-1 overflow-hidden">
        
//         {/* Inner Sidebar (Tabs) */}
//         {!isFullWidthPage && (
//           <div className="w-55 bg-gradient-to-br from-[#0f172a]  to-[#2b3747ff] backdrop-blur-md border-r border-gray-700 p-4 hidden md:flex flex-col overflow-y-auto shrink-0">
//             <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/10">
//               <h3 className="text-gray-200 text-sm font-bold mb-1 line-clamp-1">{itineraryData.tripName || 'Untitled Trip'}</h3>
//               {/* {itineraryData.tripId ? itineraryData.tripId.slice(-6) : '****'} */}
//               <p className="text-blue-300 text-xs font-mono">Ref No. ####### </p>
//             </div>

//             <nav className="space-y-1">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => handleTabChange(tab.path)}
//                   className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
//                     activeTab === tab.id
//                       ? 'bg-blue-600 text-white shadow-lg'
//                       : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                   }`}
//                 >
//                   {tab.label}
//                   {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
//                 </button>
//               ))}
//             </nav>
//           </div>
//         )}

//         {/* Dynamic Page Content */}
//         <main className={`flex-1 overflow-y-auto bg-gray-50/5 relative ${!isFullWidthPage ? 'p-0' : ''}`}>
//           {children}
//         </main>
//       </div>

//       {/* Error Popup */}
//       {showErrorPopup && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//           <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="text-red-500 w-6 h-6 shrink-0"/>
//               <div>
//                 <h3 className="font-bold text-gray-900">Error</h3>
//                 <p className="text-sm text-gray-600 mt-1">{errorMessage}</p>
//               </div>
//             </div>
//             <button onClick={() => setShowErrorPopup(false)} className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700">Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// } 













































// "use client";

// import React, { useState, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { Loader2, Check, AlertCircle, Lock, CheckCircle2 , Bell } from 'lucide-react'; // Added Icons

// import { useItinerary } from '@/app/context/ItineraryContext';

// export default function ItineraryBuilderWrapper({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();
  
//   const isLibraryPage = pathname?.includes('/library');
//   const isPreviewDetailsPage = pathname ? /\/preview\/.+/.test(pathname) : false;
//   const isFullWidthPage = isLibraryPage || isPreviewDetailsPage;

//   const { 
//     itineraryData, 
//     saveItinerary, 
//     isSaving, 
//     saveError ,
//     toastMessage,
//   } = useItinerary();

//   const [activeTab, setActiveTab] = useState('INTRO');
//   const [showErrorPopup, setShowErrorPopup] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   // Tab Definitions mapped to Status Keys
//   const tabs = [
//     { id: 'INTRO', label: 'INTRO', path: '/dashboard/itinerary/create', statusKey: 'intro' },
//     { id: 'ROUTING', label: 'ROUTING', path: '/dashboard/itinerary/routing', statusKey: 'routing' },
//     { id: 'CREATE DAY', label: 'CREATE DAY', path: '/dashboard/itinerary/create-day', statusKey: 'createDay' },
//     { id: 'COSTING', label: 'COSTING', path: '/dashboard/itinerary/costing', statusKey: 'costing' },
//     { id: 'PREVIEW', label: 'PREVIEW', path: '/dashboard/itinerary/preview', statusKey: 'preview' },
//   ];

//   useEffect(() => {
//     if (pathname?.includes('/routing')) setActiveTab('ROUTING');
//     else if (pathname?.includes('/create-day')) setActiveTab('CREATE DAY');
//     else if (pathname?.includes('/costing')) setActiveTab('COSTING');
//     else if (pathname?.includes('/preview') && !isPreviewDetailsPage) setActiveTab('PREVIEW');
//     else setActiveTab('INTRO');
//   }, [pathname, isPreviewDetailsPage]);

//   // Error handling
//   useEffect(() => {
//     if (saveError) {
//       setErrorMessage(saveError);
//       setShowErrorPopup(true);
//     }
//   }, [saveError]);

//   const handleTabChange = (tab: any) => {
//     // LOCK LOGIC: Check Context status
//     // @ts-ignore
//     const status = itineraryData.stepperStatus?.[tab.statusKey];
    
//     // Always allow Intro. For others, check if unlocked or completed.
//     if (tab.id === 'INTRO' || status === 'unlocked' || status === 'completed') {
//         router.push(tab.path);
//     } else {
//         alert("Please complete the previous step to unlock this section.");
//     }
//   };

//   const handleQuickSave = async () => await saveItinerary('quick');
//   const handleSaveAndExit = async () => {
//     const success = await saveItinerary('exit');
//     if (success) setTimeout(() => router.push('/dashboard/itinerary/library'), 1000);
//   };
//   const libraryPage = async () => router.push('/dashboard/itinerary/library');

//   return (
//     <div className="h-full relative flex flex-col bg-gray-50">
      
//       {/* Background Styling */}
//       <div className="absolute inset-0 z-0 bg-slate-900"/>
//       <div 
//         className="absolute inset-0 z-0 opacity-20 pointer-events-none"
//         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600')", backgroundSize: 'cover' }}
//       />

//       {!isFullWidthPage && (
//         <div className="relative z-10 bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-700 px-4 py-3 flex items-center justify-between shrink-0 h-16">
//           <div className="flex items-center gap-4">
//              <h2 className="text-white font-bold text-lg tracking-wide">
//                Itinerary <span className="text-blue-400">Builder</span>
//              </h2>
//              <button onClick={libraryPage} className="hidden ml-11 md:flex px-7 py-2 bg-blue-600 text-blue-100 hover:bg-blue-600/40 rounded text-sm font-medium transition-all border border-blue-500/30">
//                 Library
//              </button>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button 
//               onClick={handleQuickSave} 
//               disabled={isSaving} 
//               className="px-4 py-2 bg-blue-600 text-blue-100 hover:bg-blue-500 rounded-sm text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
//             >
//               {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4"/>}
//               {isSaving ? 'Saving...' : 'Quick Save'}
//             </button>
            
//             <button 
//               onClick={handleSaveAndExit} 
//               disabled={isSaving}
//               className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-sm text-sm font-medium transition-all shadow-sm"
//             >
//               Save & Exit
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="relative z-10 flex flex-1 overflow-hidden">
        
//         {/* Inner Sidebar (Tabs) with Locking Logic */}
//         {!isFullWidthPage && (
//           <div className="w-55 bg-gradient-to-br from-[#0f172a]  to-[#2b3747ff] backdrop-blur-md border-r border-gray-700 p-4 hidden md:flex flex-col overflow-y-auto shrink-0">
//             <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/10">
//               <h3 className="text-gray-200 text-sm font-bold mb-1 line-clamp-1">{itineraryData.tripName || 'Untitled Trip'}</h3>
//               <p className="text-blue-300 text-xs font-mono">Ref No. ####### </p>
//             </div>

//             <nav className="space-y-1">
//               {tabs.map((tab) => {
//                 // @ts-ignore
//                 const status = itineraryData.stepperStatus?.[tab.statusKey];
//                 const isLocked = tab.id !== 'INTRO' && status !== 'unlocked' && status !== 'completed';
//                 const isActive = activeTab === tab.id;

//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => handleTabChange(tab)}
//                     disabled={isLocked}
//                     className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group 
//                     ${isActive 
//                         ? 'bg-blue-600 text-white shadow-lg' 
//                         : isLocked 
//                             ? 'text-gray-500 cursor-not-allowed opacity-60' 
//                             : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                     }`}
//                   >
//                     <div className="flex items-center gap-2">
//                         {isLocked && <Lock size={12} />}
//                         {status === 'completed' && !isLocked && <CheckCircle2 size={12} className="text-green-400" />}
//                         {tab.label}
//                     </div>
//                     {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
//                   </button>
//                 );
//               })}
//             </nav>
//           </div>
//         )}

//         {/* Dynamic Page Content */}
//         <main className={`flex-1 overflow-y-auto bg-gray-50/5 relative ${!isFullWidthPage ? 'p-0' : ''}`}>
//           {children}
//         </main>
//       </div>

//       {/* Error Popup Code (Unchanged) */}
//       {showErrorPopup && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//           <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="text-red-500 w-6 h-6 shrink-0"/>
//               <div>
//                 <h3 className="font-bold text-gray-900">Error</h3>
//                 <p className="text-sm text-gray-600 mt-1">{errorMessage}</p>
//               </div>
//             </div>
//             <button onClick={() => setShowErrorPopup(false)} className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700">Close</button>
//           </div>
//         </div>
//       )}


//       {toastMessage && (
//         <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
//           <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border ${
//             toastMessage.type === 'success' 
//               ? 'bg-white border-green-500 text-gray-800' 
//               : 'bg-red-50 border-red-500 text-red-800'
//           }`}>
//             <div className={`p-2 rounded-full ${toastMessage.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
//                {toastMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
//             </div>
//             <div>
//               <h4 className={`font-bold text-sm ${toastMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
//                 {toastMessage.type === 'success' ? 'Success' : 'Error'}
//               </h4>
//               <p className="text-xs text-gray-600 font-medium">{toastMessage.message}</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// } 



























// "use client";

// import React, { useState, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { Loader2, Check, AlertCircle, Lock, CheckCircle2 , Bell } from 'lucide-react'; 

// import { useItinerary } from '@/app/context/ItineraryContext';

// export default function ItineraryBuilderWrapper({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();
  
//   const isLibraryPage = pathname?.includes('/library');
//   const isPreviewDetailsPage = pathname ? /\/preview\/.+/.test(pathname) : false;
//   const isFullWidthPage = isLibraryPage || isPreviewDetailsPage;

//   const { 
//     itineraryData, 
//     saveItinerary, 
//     isSaving, 
//     saveError ,
//     toastMessage,
//   } = useItinerary();

//   const [activeTab, setActiveTab] = useState('INTRO');
//   const [showErrorPopup, setShowErrorPopup] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   // Tab Definitions mapped to Status Keys
//   const tabs = [
//     { id: 'INTRO', label: 'INTRO', path: '/dashboard/itinerary/create', statusKey: 'intro' },
//     { id: 'ROUTING', label: 'ROUTING', path: '/dashboard/itinerary/routing', statusKey: 'routing' },
//     { id: 'CREATE DAY', label: 'CREATE DAY', path: '/dashboard/itinerary/create-day', statusKey: 'createDay' },
//     { id: 'REVIEW', label: 'REVIEW', path: '/dashboard/itinerary/review', statusKey: 'review' },
//     { id: 'COSTING', label: 'COSTING', path: '/dashboard/itinerary/costing', statusKey: 'costing' },
//     { id: 'PREVIEW', label: 'PREVIEW', path: '/dashboard/itinerary/preview', statusKey: 'preview' },
//   ];

//   useEffect(() => {
//     if (pathname?.includes('/routing')) setActiveTab('ROUTING');
//     else if (pathname?.includes('/create-day')) setActiveTab('CREATE DAY');
//     else if (pathname?.includes('/costing')) setActiveTab('COSTING');
//     else if (pathname?.includes('/preview') && !isPreviewDetailsPage) setActiveTab('PREVIEW');
//     else setActiveTab('INTRO');
//   }, [pathname, isPreviewDetailsPage]);

//   // Error handling
//   useEffect(() => {
//     if (saveError) {
//       setErrorMessage(saveError);
//       setShowErrorPopup(true);
//     }
//   }, [saveError]);

//   const handleTabChange = (tab: any) => {
//     // @ts-ignore
//     const status = itineraryData.stepperStatus?.[tab.statusKey];
//     const globalStatus = itineraryData.status || 'draft';

//     let isCompleted = status === 'completed';
//     if (tab.id === 'INTRO' && itineraryData.tripName) isCompleted = true;
//     if (tab.id === 'ROUTING' && itineraryData.routingData?.routes?.length > 0) isCompleted = true;
//     if (tab.id === 'CREATE DAY' && ['pending_costing', 'reedit_requested', 'approved'].includes(globalStatus)) isCompleted = true;
//     if (tab.id === 'COSTING' && globalStatus === 'approved') isCompleted = true;
    
//     if (tab.id === 'INTRO' || status === 'unlocked' || isCompleted) {
//         router.push(tab.path);
//     } else {
//         alert("Please complete the previous step to unlock this section.");
//     }
//   };

//   const handleQuickSave = async () => await saveItinerary('quick');
//   const handleSaveAndExit = async () => {
//     const success = await saveItinerary('exit');
//     if (success) setTimeout(() => router.push('/dashboard/itinerary/library'), 1000);
//   };
//   const libraryPage = async () => router.push('/dashboard/itinerary/library');

//   return (
//     <div className="h-full relative flex flex-col bg-gray-50">
      
//       {/* Background Styling */}
//       <div className="absolute inset-0 z-0 bg-slate-900"/>
//       <div 
//         className="absolute inset-0 z-0 opacity-20 pointer-events-none"
//         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600')", backgroundSize: 'cover' }}
//       />

//       {!isFullWidthPage && (
//         <div className="relative z-10 bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-700 px-4 py-3 flex items-center justify-between shrink-0 h-16">
//           <div className="flex items-center gap-4">
//              <h2 className="text-white font-bold text-lg tracking-wide">
//                Itinerary <span className="text-blue-400">Builder</span>
//              </h2>
//              <button onClick={libraryPage} className="hidden ml-11 md:flex px-7 py-2 bg-blue-600 text-blue-100 hover:bg-blue-600/40 rounded text-sm font-medium transition-all border border-blue-500/30">
//                 Library
//              </button>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button 
//               onClick={handleQuickSave} 
//               disabled={isSaving} 
//               className="px-4 py-2 bg-blue-600 text-blue-100 hover:bg-blue-500 rounded-sm text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
//             >
//               {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4"/>}
//               {isSaving ? 'Saving...' : 'Quick Save'}
//             </button>
            
//             <button 
//               onClick={handleSaveAndExit} 
//               disabled={isSaving}
//               className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-sm text-sm font-medium transition-all shadow-sm"
//             >
//               Save & Exit
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="relative z-10 flex flex-1 overflow-hidden">
        
//         {/* Inner Sidebar (Tabs) with Locking Logic */}
//         {!isFullWidthPage && (
//           <div className="w-55 bg-gradient-to-br from-[#0f172a]  to-[#2b3747ff] backdrop-blur-md border-r border-gray-700 p-4 hidden md:flex flex-col overflow-y-auto shrink-0">
//             <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/10">
//               <h3 className="text-gray-200 text-sm font-bold mb-1 line-clamp-1">{itineraryData.tripName || 'Untitled Trip'}</h3>
//               <p className="text-blue-300 text-xs font-mono">Ref No. ####### </p>
//             </div>

//             <nav className="space-y-1">
//               {tabs.map((tab) => {
//                 // @ts-ignore
//                 const status = itineraryData.stepperStatus?.[tab.statusKey];
//                 const globalStatus = itineraryData.status || 'draft';

//                 // 👇 HIGHLIGHT: Smart Complete Logic ensures checkmarks appear accurately
//                 let isCompleted = status === 'completed';
//                 if (tab.id === 'INTRO' && itineraryData.tripName) isCompleted = true;
//                 if (tab.id === 'ROUTING' && itineraryData.routingData?.routes?.length > 0) isCompleted = true;
//                 if (tab.id === 'CREATE DAY' && ['pending_costing', 'reedit_requested', 'approved'].includes(globalStatus)) isCompleted = true;
//                 if (tab.id === 'COSTING' && globalStatus === 'approved') isCompleted = true;

//                 const isLocked = tab.id !== 'INTRO' && status !== 'unlocked' && !isCompleted;
//                 const isActive = activeTab === tab.id;

//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => handleTabChange(tab)}
//                     disabled={isLocked}
//                     className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group 
//                     ${isActive 
//                         ? 'bg-blue-600 text-white shadow-lg' 
//                         : isLocked 
//                             ? 'text-gray-500 cursor-not-allowed opacity-60' 
//                             : 'text-gray-400 hover:bg-white/5 hover:text-white'
//                     }`}
//                   >
//                     <div className="flex items-center gap-2">
//                         {isLocked && <Lock size={12} />}
//                         {isCompleted && !isLocked && <CheckCircle2 size={12} className={isActive ? "text-white" : "text-green-400"} />}
//                         {tab.label}
//                     </div>
//                     {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
//                   </button>
//                 );
//               })}
//             </nav>
//           </div>
//         )}

//         {/* Dynamic Page Content */}
//         <main className={`flex-1 overflow-y-auto bg-gray-50/5 relative ${!isFullWidthPage ? 'p-0' : ''}`}>
//           {children}
//         </main>
//       </div>

//       {/* Error Popup Code */}
//       {showErrorPopup && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//           <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="text-red-500 w-6 h-6 shrink-0"/>
//               <div>
//                 <h3 className="font-bold text-gray-900">Error</h3>
//                 <p className="text-sm text-gray-600 mt-1">{errorMessage}</p>
//               </div>
//             </div>
//             <button onClick={() => setShowErrorPopup(false)} className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700">Close</button>
//           </div>
//         </div>
//       )}

//       {/* Toast Notification */}
//       {toastMessage && (
//         <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
//           <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border ${
//             toastMessage.type === 'success' 
//               ? 'bg-white border-green-500 text-gray-800' 
//               : 'bg-red-50 border-red-500 text-red-800'
//           }`}>
//             <div className={`p-2 rounded-full ${toastMessage.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
//                {toastMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
//             </div>
//             <div>
//               <h4 className={`font-bold text-sm ${toastMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
//                 {toastMessage.type === 'success' ? 'Success' : 'Error'}
//               </h4>
//               <p className="text-xs text-gray-600 font-medium">{toastMessage.message}</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// } 















































































































































"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, Check, AlertCircle, Lock, CheckCircle2 , Bell , History, X , Plus, Pencil, Trash2, Clock, User } from 'lucide-react'; 

import { useItinerary } from '@/app/context/ItineraryContext';
import { useUser } from '@/app/context/UserContext'; // 👈 ADDED THIS IMPORT

export default function ItineraryBuilderWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser(); // 👈 ADDED THIS HOOK
  
  const isLibraryPage = pathname?.includes('/library');
  const isPreviewDetailsPage = pathname ? /\/preview\/.+/.test(pathname) : false;
  const isFullWidthPage = isLibraryPage || isPreviewDetailsPage;

  const { 
    itineraryData, 
    saveItinerary, 
    isSaving, 
    saveError ,
    toastMessage,
  } = useItinerary();

  const [activeTab, setActiveTab] = useState('INTRO');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Tab Definitions mapped to Status Keys
  const tabs = [
    { id: 'INTRO', label: 'INTRO', path: '/dashboard/itinerary/create', statusKey: 'intro' },
    { id: 'ROUTING', label: 'ROUTING', path: '/dashboard/itinerary/routing', statusKey: 'routing' },
    { id: 'CREATE DAY', label: 'CREATE DAY', path: '/dashboard/itinerary/create-day', statusKey: 'createDay' },
    // 👇 NEW TAB ADDED HERE
    { id: 'REVIEW', label: 'REVIEW', path: '/dashboard/itinerary/review', statusKey: 'review' },
    { id: 'COSTING', label: 'COSTING', path: '/dashboard/itinerary/costing', statusKey: 'costing' },
    { id: 'PREVIEW', label: 'PREVIEW', path: '/dashboard/itinerary/preview', statusKey: 'preview' },
  ];

  useEffect(() => {
    if (pathname?.includes('/routing')) setActiveTab('ROUTING');
    else if (pathname?.includes('/create-day')) setActiveTab('CREATE DAY');
    else if (pathname?.includes('/review')) setActiveTab('REVIEW'); // 👈 ADDED THIS CHECK
    else if (pathname?.includes('/costing')) setActiveTab('COSTING');
    else if (pathname?.includes('/preview') && !isPreviewDetailsPage) setActiveTab('PREVIEW');
    else setActiveTab('INTRO');
  }, [pathname, isPreviewDetailsPage]);

  // Error handling
  useEffect(() => {
    if (saveError) {
      setErrorMessage(saveError);
      setShowErrorPopup(true);
    }
  }, [saveError]);

  // 👇 HIGHLIGHT: Updated Locking Logic (Review-First Flow)
  const getTabState = (tabId: string) => {
      const globalStatus = itineraryData.status || 'draft';
      
      // 1. Determine Completion of previous steps
      const introDone = !!itineraryData.tripName;
      const routingDone = introDone && (itineraryData.routingData?.routes?.length > 0);
      
      // Create Day is "done" if we have at least one activity/hotel, or if we moved past it
      const hasDayItems = (itineraryData.dayWiseActivities?.length || 0) > 0;
      const createDayDone = routingDone && hasDayItems;
      
      // Review is done if status is NOT draft (meaning it was submitted at least once)
      const reviewDone = ['pending_costing', 'reedit_requested', 'approved'].includes(globalStatus);
      
      const costingDone = reviewDone && globalStatus === 'approved';

      let isLocked = false;
      let isCompleted = false;

      switch(tabId) {
          case 'INTRO':
              isLocked = false;
              isCompleted = introDone;
              break;
          case 'ROUTING':
              isLocked = !introDone;
              isCompleted = routingDone;
              break;
          case 'CREATE DAY':
              isLocked = !routingDone;
              isCompleted = createDayDone;
              break;
          case 'REVIEW':
              // Only locked if Create Day isn't "done"
              isLocked = !createDayDone; 
              isCompleted = reviewDone;
              break;
          case 'COSTING':
              if (user?.role === 'admin') {
                  isLocked = !reviewDone; // Admin can access if submitted
              } else {
                  isLocked = !costingDone; // Agents/Employees locked until APPROVED
              }
              isCompleted = costingDone;
              break;
          case 'PREVIEW':
              isLocked = !costingDone; 
              isCompleted = false; 
              break;
      }

      return { isLocked, isCompleted };
  };

  const handleTabChange = (tab: any) => {
    // 👇 Use the strict logic to determine if clickable
    const { isLocked } = getTabState(tab.id);
    
    if (!isLocked) {
        router.push(tab.path);
    } else {
        // Determine specific error message
        let msg = "Please complete the previous step.";
        if (tab.id === 'COSTING' && user?.role !== 'admin') msg = "Costing is locked until approved by Admin.";
        if (tab.id === 'PREVIEW') msg = "Preview is locked until Costing is approved.";
        alert(msg);
    }
  };

  const handleQuickSave = async () => await saveItinerary('quick');
  const handleSaveAndExit = async () => {
    const success = await saveItinerary('exit');
    if (success) setTimeout(() => router.push('/dashboard/itinerary/library'), 1000);
  };
  const libraryPage = async () => router.push('/dashboard/itinerary/library');

  return (
    <div className="h-full relative flex flex-col bg-gray-50">
      
      {/* Background Styling */}
      <div className="absolute inset-0 z-0 bg-slate-900"/>
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600')", backgroundSize: 'cover' }}
      />

      {!isFullWidthPage && (
        <div className="relative z-10 bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-700 px-4 py-3 flex items-center justify-between shrink-0 h-16">
          <div className="flex items-center gap-4">
             <h2 className="text-white font-bold text-lg tracking-wide">
               Itinerary <span className="text-blue-400">Builder</span>
             </h2>
             <button onClick={libraryPage} className="hidden ml-11 md:flex px-7 py-2 bg-blue-600 text-blue-100 hover:bg-blue-600/40 rounded text-sm font-medium transition-all border border-blue-500/30">
                Library
             </button>
          </div>
          
          <div className="flex items-center gap-3">

            {/* 👇 NEW: View History Button */}
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="px-4 py-2 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white rounded-sm text-sm font-bold transition-all flex items-center gap-2 shadow-sm border border-gray-600"
            >
              <History className="w-4 h-4" /> History
            </button>
            <button 
              onClick={handleQuickSave} 
              disabled={isSaving} 
              className="px-4 py-2 bg-blue-600 text-blue-100 hover:bg-blue-500 rounded-sm text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4"/>}
              {isSaving ? 'Saving...' : 'Quick Save'}
            </button>
            
            <button 
              onClick={handleSaveAndExit} 
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-sm text-sm font-medium transition-all shadow-sm"
            >
              Save & Exit
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-1 overflow-hidden">
        
        {/* Inner Sidebar (Tabs) with Locking Logic */}
        {!isFullWidthPage && (
          <div className="w-55 bg-gradient-to-br from-[#0f172a]  to-[#2b3747ff] backdrop-blur-md border-r border-gray-700 p-4 hidden md:flex flex-col overflow-y-auto shrink-0">
            <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/10">
              <h3 className="text-gray-200 text-sm font-bold mb-1 line-clamp-1">{itineraryData.tripName || 'Untitled Trip'}</h3>
              <p className="text-blue-300 text-xs font-mono">Ref No. ####### </p>

              <span className="bg-blue-900/50 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
                    v{itineraryData.currentVersion || '1.0'}
                 </span>
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                
                // 👇 CALL THE NEW FUNCTION
                const { isLocked, isCompleted } = getTabState(tab.id);

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab)}
                    disabled={isLocked}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group 
                    ${isActive 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : isLocked 
                            ? 'text-gray-500 cursor-not-allowed opacity-60' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                        {isLocked && <Lock size={12} />}
                        {isCompleted && !isLocked && <CheckCircle2 size={12} className={isActive ? "text-white" : "text-green-400"} />}
                        {tab.label}
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className={`flex-1 overflow-y-auto bg-gray-50/5 relative ${!isFullWidthPage ? 'p-0' : ''}`}>
          {children}
        </main>
      </div>

      {/* Error Popup Code */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 w-6 h-6 shrink-0"/>
              <div>
                <h3 className="font-bold text-gray-900">Error</h3>
                <p className="text-sm text-gray-600 mt-1">{errorMessage}</p>
              </div>
            </div>
            <button onClick={() => setShowErrorPopup(false)} className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700">Close</button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border ${
            toastMessage.type === 'success' 
              ? 'bg-white border-green-500 text-gray-800' 
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <div className={`p-2 rounded-full ${toastMessage.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
               {toastMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            </div>
            <div>
              <h4 className={`font-bold text-sm ${toastMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {toastMessage.type === 'success' ? 'Success' : 'Error'}
              </h4>
              <p className="text-xs text-gray-600 font-medium">{toastMessage.message}</p>
            </div>
          </div>
        </div>
      )}


      {/* 👇 NEW: SLIDING HISTORY DRAWER */}

      {/* 👇 NEW: PREMIUM SLIDING HISTORY DRAWER */}
      <div className={`fixed top-0 right-0 h-full border border-gray-400 w-[340px] bg-[#001e3a] shadow-[0_0_40px_rgba(0,0,0,0.3)] z-[60] transform transition-transform duration-300 ease-in-out flex flex-col ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         
         {/* Drawer Header */}
         <div className="px-6 py-5 border-b border-gray-200 bg-gray-200 shadow-sm z-10 flex justify-between items-center">
            <div>
               <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                  <History size={20} className="text-blue-600"/>Activity Log
               </h3>
               <p className="text-[11px] text-gray-600 mt-1 uppercase tracking-wider font-semibold">Track versions, edits & status</p>
            </div>
            <button onClick={() => setIsHistoryOpen(false)} className="text-gray-100 hover:text-gray-800 bg-gray-400 hover:bg-gray-100 p-2 rounded-lg transition-colors">
               <X size={18}/>
            </button>
         </div>

         {/* Drawer Timeline Content */}
         <div className="flex-1 overflow-y-auto p-6">
            <div className="relative">
               {/* Vertical Dashed Line */}
               <div className="absolute left-[15px] top-4 bottom-4 w-px border-l-2 border-dashed border-blue-200" />
               
               {itineraryData.auditLog && itineraryData.auditLog.length > 0 ? (
                  itineraryData.auditLog.map((log, idx) => {
                     // 1. Dynamic Icons & Badge Colors based on Action
                     let Icon = CheckCircle2;
                     let iconStyle = 'bg-blue-100 text-blue-600 border-blue-200';
                     
                     if (log.action === 'ADD') { Icon = Plus; iconStyle = 'bg-green-100 text-green-600 border-green-200'; }
                     else if (log.action === 'EDIT') { Icon = Pencil; iconStyle = 'bg-orange-100 text-orange-500 border-orange-200'; }
                     else if (log.action === 'DELETE') { Icon = Trash2; iconStyle = 'bg-red-100 text-red-500 border-red-200'; }

                     // 2. Dynamic Role Colors
                     let roleColor = 'bg-gray-100 text-gray-600 border-gray-200';
                     const role = (log.userRole || '').toLowerCase();
                     if (role === 'admin') roleColor = 'bg-purple-100 text-purple-700 border-purple-200';
                     else if (role === 'employee') roleColor = 'bg-blue-100 text-blue-700 border-blue-200';
                     else if (role === 'agent') roleColor = 'bg-teal-100 text-teal-700 border-teal-200';
                     else if (role === 'system') roleColor = 'bg-gray-800 text-white border-gray-900';

                     return (
                        <div key={idx} className="relative pl-12 pb-6 group">
                           
                           {/* The Icon Badge on the Timeline */}
                           <div className={`absolute left-0 top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white shadow-sm z-10 transition-transform group-hover:scale-110 ${iconStyle}`}>
                              <Icon size={14} strokeWidth={3} />
                           </div>
                           
                           {/* The Content Card */}
                           <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 group-hover:shadow-md group-hover:border-blue-300 transition-all duration-200">
                              
                              <div className="flex justify-between items-start mb-2.5">
                                 {/* Version Tag */}
                                 <span className={`text-[10px] px-2 py-1 rounded font-black uppercase tracking-wider shadow-sm ${log.action === 'STATUS' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                    v{log.version}
                                 </span>
                                 
                                 {/* Timestamp */}
                                 <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                    <Clock size={11}/> {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', month:'short', day:'numeric'})}
                                 </span>
                              </div>
                              
                              {/* The Action Details */}
                              <p className="text-sm text-gray-800 font-medium leading-relaxed mb-3">
                                 {log.details}
                              </p>
                              
                              {/* The User Role Tag */}
                              <div className="flex items-center">
                                 <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border flex items-center gap-1.5 ${roleColor}`}>
                                    <User size={10} strokeWidth={2.5}/> {log.userRole}
                                 </span>
                              </div>

                           </div>
                        </div>
                     );
                  })
               ) : (
                  <div className="text-center text-gray-400 text-sm mt-10 italic bg-white p-6 rounded-xl border border-dashed border-gray-300 shadow-sm">
                     No activity yet.<br/><span className="text-xs mt-1 block">Changes made to this itinerary will appear here.</span>
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* Drawer Overlay Background */}
      {isHistoryOpen && (
         <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-[55] animate-in fade-in duration-200" 
            onClick={() => setIsHistoryOpen(false)}
         />
      )}
      {/* 👆 END OF DRAWER */}
      
      {/* 👆 END OF DRAWER */}
    </div>
  );
}