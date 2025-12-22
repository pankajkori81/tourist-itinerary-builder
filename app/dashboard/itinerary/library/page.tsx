"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutGrid, List, Plus, Loader2, 
  Eye, Trash2, Edit, MoreVertical, Copy, MapPin, Clock, Calendar 
} from 'lucide-react';
import { 
  getLibrary, 
  deleteFromLibrary, 
  cloneItinerary, 
  getItineraryById, 
  StoredItineraryData 
} from '@/utils/itineraryStorage';
import { useItinerary } from '@/app/context/ItineraryContext';

export default function LibraryPage() {
  const router = useRouter();
  const { clearSavedItinerary } = useItinerary(); // USE CONTEXT
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [libraries, setLibraries] = useState<StoredItineraryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadLibraries();
  }, []);

  const loadLibraries = () => {
    setLoading(true);
    const savedLibraries = getLibrary();
    // Filter to show only Master Itineraries
    const masterItineraries = savedLibraries.filter(lib => lib.isMasterItinerary === true);
    setLibraries(masterItineraries);
    setLoading(false);
  };

  const calculateDuration = (itinerary: StoredItineraryData) => {
    if (!itinerary.routingData?.routes || itinerary.routingData.routes.length === 0) return 'Duration Not Set';
    const totalNights = itinerary.routingData.routes.reduce((acc: number, route: any) => acc + (route.nights || 0), 0);
    return `${totalNights + 1} Days / ${totalNights} Nights`;
  };

  // const handleCreateNew = () => {
  //   sessionStorage.removeItem('editing_itinerary_id');
  //   router.push('/dashboard/itinerary/create');
  // };

  const handleCreateNew = () => {
    sessionStorage.removeItem('editing_itinerary_id'); // Clear session
    clearSavedItinerary(); // Clear Context State & LocalStorage Draft
    router.push('/dashboard/itinerary/create'); // Navigate
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/itinerary/preview/${id}`);
  };
  
  const handleEdit = (id: string) => {
    if (getItineraryById(id)) {
      sessionStorage.setItem('editing_itinerary_id', id);
      router.push('/dashboard/itinerary/create');
    }
  };

  const handleClone = (id: string) => {
    const cloned = cloneItinerary(id);
    if (cloned) {
      loadLibraries(); 
      setOpenMenuId(null);
      alert(`✅ Cloned: ${cloned.tripName}`);
    } else {
      alert('Failed to clone itinerary');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) {
      deleteFromLibrary(id);
      loadLibraries();
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-100px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* --- HEADER --- */}
      <div className="bg-[#1e293b] border-b border-gray-700 px-6 py-4 flex justify-between items-center shadow-md z-20">
        <div>
           <h1 className="text-white font-bold text-xl tracking-wide flex items-center gap-2">
             <MapPin className="text-blue-400" size={20}/> LIBRARY
           </h1>
           <p className="text-gray-400 text-xs mt-0.5">Manage your Master Itineraries</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={() => router.push('/dashboard/itinerary/agent-guest')} 
             className="px-4 py-2 bg-gray-700 text-gray-300 hover:text-white rounded hover:bg-gray-600 text-sm font-medium transition-colors border border-gray-600"
           >
             Agent / Guest View
           </button>
           
           <div className="flex bg-gray-800 rounded p-1 border border-gray-600">
             <button onClick={() => setViewMode('list')} className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                <List size={18} />
             </button>
             <button onClick={() => setViewMode('grid')} className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                <LayoutGrid size={18} />
             </button>
           </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* --- LEFT SIDEBAR STATS --- */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 hidden md:block overflow-y-auto">
           <button 
              onClick={handleCreateNew}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg mb-6"
            >
              <Plus size={20} /> Create New Tour
            </button>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
               <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Tours</div>
               <div className="text-3xl font-bold text-gray-800">{libraries.length}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Status Breakdown</div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2 text-gray-600"><div className="w-2 h-2 rounded-full bg-green-500"/> Active</span>
                        <span className="font-bold">{libraries.filter(l => l.status === 'active' || !l.status).length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2 text-gray-600"><div className="w-2 h-2 rounded-full bg-gray-400"/> Draft</span>
                        <span className="font-bold">{libraries.filter(l => l.status === 'draft').length}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100/50">
          
          {libraries.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MapPin size={48} className="mb-4 opacity-20"/>
                <p className="text-lg font-medium">No Master Itineraries Found</p>
                <p className="text-sm mb-6">Create your first template to get started.</p>
                <button onClick={handleCreateNew} className="text-blue-600 hover:underline">Create Now</button>
             </div>
          ) : (
            <>
              {/* GRID VIEW */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {libraries.map((library) => (
                    <div key={library.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                      {/* Card Image Header */}
                      <div className="h-40 bg-gradient-to-r from-blue-900 to-slate-800 relative flex items-center justify-center overflow-hidden">
                         {/* Placeholder pattern or image */}
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"/>
                         <MapPin className="text-white/20 group-hover:scale-110 transition-transform duration-500" size={64} />
                         
                         <div className="absolute top-3 right-3">
                            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full border ${library.status === 'draft' ? 'bg-gray-800 text-gray-300 border-gray-600' : 'bg-green-500 text-white border-green-400'}`}>
                              {library.status || 'Active'}
                            </span>
                         </div>
                      </div>

                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3 relative">
                          <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-1" title={library.tripName}>
                            {library.tripName}
                          </h3>
                          
                          {/* Actions Dropdown */}
                          <div className="relative">
                            <button 
                              onClick={() => setOpenMenuId(openMenuId === library.id ? null : library.id!)} 
                              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                            >
                              <MoreVertical size={20} />
                            </button>
                            
                            {openMenuId === library.id && (
                              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 animation-fade-in">
                                <button onClick={() => handleView(library.id!)} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                                    <Eye size={14} className="text-blue-500"/> View Details
                                </button>
                                <button onClick={() => handleEdit(library.id!)} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                                    <Edit size={14} className="text-green-600"/> Edit Trip
                                </button>
                                <button onClick={() => handleClone(library.id!)} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                                    <Copy size={14} className="text-purple-500"/> Clone
                                </button>
                                <div className="h-px bg-gray-100 my-1"/>
                                <button onClick={() => handleDelete(library.id!)} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-red-50 text-red-600 flex items-center gap-2">
                                    <Trash2 size={14}/> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Metadata Tags */}
                        <div className="space-y-2 mb-5">
                           <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin size={14} className="text-blue-500"/>
                              <span className="truncate">{library.selectedCountries?.join(', ') || 'No Country'}</span>
                           </div>
                           <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock size={14} className="text-orange-500"/>
                              <span>{calculateDuration(library)}</span>
                           </div>
                           <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar size={14} className="text-green-500"/>
                              <span>Created: {new Date(library.createdAt || Date.now()).toLocaleDateString()}</span>
                           </div>
                        </div>

                        <button 
                          onClick={() => handleView(library.id!)} 
                          className="w-full py-2.5 bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-600 text-sm font-bold rounded-lg transition-all border border-gray-200 hover:border-blue-600"
                        >
                          View Itinerary
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* LIST VIEW */}
              {viewMode === 'list' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4">Trip Name</th>
                        <th className="px-6 py-4">Destinations</th>
                        <th className="px-6 py-4">Duration</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Last Updated</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {libraries.map((library) => (
                        <tr key={library.id} className="hover:bg-blue-50/50 transition-colors group">
                          <td className="px-6 py-4 font-bold text-gray-800">{library.tripName}</td>
                          <td className="px-6 py-4 text-gray-600">{library.selectedCountries?.join(', ')}</td>
                          <td className="px-6 py-4 text-gray-600">{calculateDuration(library)}</td>
                          <td className="px-6 py-4">
                             <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${library.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                                {library.status || 'Active'}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500">{new Date(library.updatedAt || Date.now()).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleView(library.id!)} className="p-2 text-blue-600 hover:bg-blue-100 rounded" title="View"><Eye size={16}/></button>
                                <button onClick={() => handleEdit(library.id!)} className="p-2 text-green-600 hover:bg-green-100 rounded" title="Edit"><Edit size={16}/></button>
                                <button onClick={() => handleClone(library.id!)} className="p-2 text-purple-600 hover:bg-purple-100 rounded" title="Clone"><Copy size={16}/></button>
                                <button onClick={() => handleDelete(library.id!)} className="p-2 text-red-600 hover:bg-red-100 rounded" title="Delete"><Trash2 size={16}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}