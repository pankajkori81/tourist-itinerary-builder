
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Eye, Copy, Loader2, Check, AlertCircle, X } from 'lucide-react';
import { ItineraryProvider, useItinerary } from '@/app/context/ItineraryContext';

// --- 1. The Content Component (Consumes Context) ---
// We split this so 'useItinerary' is used INSIDE the provider, not same level.
function ItineraryLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Logic to hide header/sidebar on specific pages
  const isLibraryPage = pathname?.includes('/library');
  const isPreviewDetailsPage = pathname ? /\/preview\/.+/.test(pathname) : false;
  // If you have a main dashboard page that shouldn't show this layout's header:
  const isMainDashboard = pathname === '/dashboard/itinerary'; 
  
  const isFullWidthPage = isLibraryPage || isPreviewDetailsPage || isMainDashboard;

  const { 
    itineraryData, 
    saveItinerary, 
    isSaving, 
    saveSuccess, 
    saveError 
  } = useItinerary();

  // Tab Navigation Logic
  const [activeTab, setActiveTab] = useState('INTRO');

  // Update active tab based on URL
  useEffect(() => {
    if (pathname?.includes('/routing')) setActiveTab('ROUTING');
    else if (pathname?.includes('/create-day')) setActiveTab('CREATE DAY');
    else if (pathname?.includes('/preview') && !isPreviewDetailsPage) setActiveTab('PREVIEW');
    else setActiveTab('INTRO');
  }, [pathname, isPreviewDetailsPage]);

  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  // Define your tabs
  const tabs = [
    { id: 'INTRO', label: 'INTRO', path: '/dashboard/itinerary/create' },
    { id: 'ROUTING', label: 'ROUTING', path: '/dashboard/itinerary/routing' },
    { id: 'CREATE DAY', label: 'CREATE DAY', path: '/dashboard/itinerary/create-day' },
    { id: 'COSTING', label: 'COSTING', path: '/dashboard/itinerary/costing' },
    { id: 'PREVIEW', label: 'PREVIEW', path: '/dashboard/itinerary/preview' },



  ];

  // Error handling from Context
  useEffect(() => {
    if (saveError) {
      setErrorMessage(saveError);
      setShowErrorPopup(true);
    }
  }, [saveError]);

  const handleTabChange = (path: string) => {
    router.push(path);
  };

  const handleQuickSave = async () => {
    await saveItinerary('quick');
  };

  const handleSaveAndExit = async () => {
    const success = await saveItinerary('exit');
    if (success) {
      setTimeout(() => {
        router.push('/dashboard/itinerary/library'); 
      }, 1000);
    }
  };


  const libraryPage=async()=>{
   router.push('/dashboard/itinerary/library');
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      
      {/* Background Styling (Optional) */}
      <div className="fixed inset-0 z-0 bg-slate-900"/>
      <div 
        className="fixed inset-0 z-0 opacity-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600')", backgroundSize: 'cover' }}
      />

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Header Bar - Hidden on Library/Preview */}
        {!isFullWidthPage && (
          <div className="bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
            <div className="text-white font-bold text-lg tracking-wide">
              Travdek<span className="text-blue-400"> Itinerary Builder</span>
            </div>

            <div className='mr-[67%] '>
                <button onClick={libraryPage} className="px-4 py-2 bg-blue-600 text-blue-100 hover:bg-blue-600/60 rounded-sm text-sm font-medium transition-all flex  gap-2 border border-blue-500/30"
               >Library
               </button>
            </div>
            
            <div className="flex items-center gap-3">
            

              <button 
                onClick={handleQuickSave} 
                disabled={isSaving} 
                className="px-4 py-2 bg-blue-600 text-blue-100 hover:bg-blue-600/60 rounded-sm text-sm font-medium transition-all flex items-center gap-2 border border-blue-500/30"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4"/>}
                {isSaving ? 'Saving...' : 'Quick Save'}
              </button>
              
              <button 
                onClick={handleSaveAndExit} 
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-sm text-sm font-medium transition-all shadow-lg"
              >
                Save & Exit
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-1 h-[calc(100vh-64px)]">
          
          {/* Sidebar Tabs - Hidden on Library/Preview */}
          {!isFullWidthPage && (
            <div className="w-64 bg-[#1e293b]/90 backdrop-blur-md border-r border-gray-700 p-4 hidden md:block overflow-y-auto">
              {/* Trip Summary Card */}
              <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/10">
                <h3 className="text-gray-200 text-sm font-bold mb-1 line-clamp-1">{itineraryData.tripName || 'Untitled Trip'}</h3>
                {/* <p className="text-blue-300 text-xs font-mono">{itineraryData.tripId}</p> */}
                <p className="text-blue-300 text-xs font-mono">Ref No.{'********'}</p>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.path)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Main Page Content */}
          <main className={`flex-1 overflow-y-auto ${!isFullWidthPage ? 'p-0' : ''}`}>
            {children}
          </main>
        </div>
      </div>

      {/* Notifications */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
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
    </div>
  );
}

// --- 2. The Main Layout Export ---
// This wraps the content with the Provider
export default function ItineraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <ItineraryProvider>
      <ItineraryLayoutContent>
        {children}
      </ItineraryLayoutContent>
    </ItineraryProvider>
  );
}