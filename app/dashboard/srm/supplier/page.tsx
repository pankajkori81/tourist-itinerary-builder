
// "use client";

// import { useState, useMemo, useEffect } from "react";
// import { 
//   Plus, Search, MapPin, 
//   Wallet, Pencil, Trash2, User, Star,
//   ChevronDown, ChevronRight, Globe, Briefcase
// } from "lucide-react";
// import { useSRM } from "@/app/context/SRMContext";
// import { SupplierData, deleteSupplier } from "@/utils/srmStorage";
// import SupplierModal from "./SupplierModal";

// export default function SupplierPage() {
//   const { suppliers, searchText, refreshAll } = useSRM();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingSupplier, setEditingSupplier] = useState<SupplierData | null>(null);

//   // Accordion State
//   const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
//   const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

//   // --- 1. HIERARCHY LOGIC (Grouping) ---
//   const groupedSuppliers = useMemo(() => {
//     // A. Filter first
//     const filtered = suppliers.filter((s) =>
//       s.name.toLowerCase().includes(searchText.toLowerCase()) ||
//       s.city?.toLowerCase().includes(searchText.toLowerCase()) ||
//       s.services.some(svc => svc.toLowerCase().includes(searchText.toLowerCase()))
//     );

//     // B. Group by Country -> City
//     const groups: Record<string, Record<string, SupplierData[]>> = {};

//     filtered.forEach(item => {
//       const country = (item.country || "Other Locations").trim();
//       const city = (item.city || "General").trim();

//       if (!groups[country]) groups[country] = {};
//       if (!groups[country][city]) groups[country][city] = [];
      
//       groups[country][city].push(item);
//     });

//     // C. Sort keys alphabetically
//     return Object.keys(groups).sort().reduce((acc, country) => {
//         acc[country] = groups[country];
//         return acc;
//     }, {} as Record<string, Record<string, SupplierData[]>>);

//   }, [suppliers, searchText]);

//   // --- 2. AUTO-EXPAND ON SEARCH ---
//   useEffect(() => {
//     if (searchText) {
//       const allCountries = Object.keys(groupedSuppliers);
//       const newExpCountries = allCountries.reduce((acc, key) => ({...acc, [key]: true}), {});
//       setExpandedCountries(newExpCountries);
      
//       const newExpCities: Record<string, boolean> = {};
//       allCountries.forEach(c => {
//           Object.keys(groupedSuppliers[c]).forEach(city => {
//               newExpCities[`${c}-${city}`] = true;
//           });
//       });
//       setExpandedCities(newExpCities);
//     }
//   }, [searchText, groupedSuppliers]);

//   // Actions
//   const handleAddNew = () => { setEditingSupplier(null); setIsModalOpen(true); };
//   const handleEdit = (s: SupplierData) => { setEditingSupplier(s); setIsModalOpen(true); };
  
//   const handleDelete = (id: string) => { 
//     if(confirm("Delete Supplier?")) { 
//       deleteSupplier(id); 
//       refreshAll(); 
//     }
//   };

//   const getServiceColor = (svc: string) => {
//      if(svc === 'Stay') return 'bg-blue-100 text-blue-800 border-blue-200';
//      if(svc === 'Transport') return 'bg-green-100 text-green-800 border-green-200';
//      if(svc === 'Activity') return 'bg-purple-100 text-purple-800 border-purple-200';
//      if(svc === 'Meal') return 'bg-orange-100 text-orange-800 border-orange-200';
//      return 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   return (
//     <div className="h-full w-full flex flex-col relative overflow-hidden">
      
//       {/* Background Layer */}
//       <div 
//         className="absolute inset-0 z-0" 
//         style={{ 
//             backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')",
//             backgroundSize: 'cover',
//             backgroundPosition: 'center'
//         }} 
//       />
//       <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm" />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col relative z-10 h-full ">
        
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4 shrink-0 bg-white/95 p-4 border-b border-white/50 backdrop-blur-md shadow-sm">
//             <div>
//               <h1 className="text-xl font-bold text-[#0a1f44] flex items-center gap-2">
//                 <Briefcase className="text-blue-600"/> Supplier Directory
//               </h1>
//               <p className="text-xs text-gray-500">Manage B2B partners & contracts via Hierarchy.</p>
//             </div>
//             <button onClick={handleAddNew} className="bg-[#0a1f44] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-900 shadow-md transition-all">
//               <Plus size={18} /> <span>Add Supplier</span>
//             </button>
//         </div>

//         {/* HIERARCHICAL VIEW */}
//         <div className="flex-1 overflow-y-auto pb-10 pl-4 pr-4 space-y-4">
            
//             {Object.keys(groupedSuppliers).length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-white/50 rounded-xl bg-white/40 backdrop-blur-sm">
//                     <Search size={32} className="mb-2 opacity-50"/>
//                     <p className="font-medium">No suppliers found matching "{searchText}"</p>
//                 </div>
//             ) : (
//                 Object.entries(groupedSuppliers).map(([country, cities]) => (
//                     <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        
//                         {/* 1. Country Header */}
//                         <div 
//                             onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))}
//                             className="flex items-center bg-white/95 p-3 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white transition-all select-none border border-white/50 backdrop-blur-sm mb-2"
//                         >
//                             <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:text-blue-800 transition-colors">
//                                 {expandedCountries[country] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
//                             </div>
//                             <div className="flex-1">
//                                 <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
//                                     <Globe size={18} className="text-blue-600" /> {country}
//                                 </h3>
//                             </div>
//                             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
//                                 {Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Suppliers
//                             </span>
//                         </div>

//                         {/* 2. Cities List */}
//                         {expandedCountries[country] && (
//                             <div className="ml-4  pl-4 border-l-2 border-white/40 space-y-3">
//                                 {Object.entries(cities).map(([city, items]) => {
//                                     const cityKey = `${country}-${city}`;
//                                     return (
//                                         <div key={city}>
//                                             <div 
//                                                 onClick={() => setExpandedCities(prev => ({...prev, [cityKey]: !prev[cityKey]}))}
//                                                 className="flex items-center bg-white/95 p-3 rounded-lg gap-2 cursor-pointer hover:bg-white/90 transition-all select-none border border-white/30 backdrop-blur-sm mb-2"
//                                             >
//                                                 {expandedCities[cityKey] ? <ChevronDown size={16} className="text-gray-500"/> : <ChevronRight size={16} className="text-gray-500"/>}
//                                                 <MapPin size={16} className="text-red-800" />
//                                                 <span className="font-bold text-gray-900">{city}</span>
//                                                 <span className="text-xs text-gray-900 bg-blue-200 px-2 py-0.5 rounded-full">
//                                                     {items.length}
//                                                 </span>
//                                             </div>

//                                             {/* 3. Supplier Cards Grid */}
//                                             {expandedCities[cityKey] && (
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 ml-6 mb-4">
                                                  
//                                                     {items.map((supplier) => (
//                                                         <div key={supplier.id} className="bg-white/95 mt-2 border border-gray-300 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all group flex flex-col relative overflow-hidden  h-[284px]">
                                                            
//                                                             {/* Preferred Badge */}
//                                                             {supplier.isPreferred && (
//                                                                 <div className="absolute top-0 right-0 bg-orange-400 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 flex items-center gap-1 shadow-sm">
//                                                                     <Star size={10} fill="white" /> PREFERRED
//                                                                 </div>
//                                                             )}

//                                                             {/* Card Header */}
//                                                             <div className="w-full p-4 flex items-center justify-start bg-gradient-to-br from-blue-400 to-purple-500 shadow-inner border border-white/10">
//                                                                 <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
//                                                                     {supplier.logoUrl ? (
//                                                                         <img src={supplier.logoUrl} alt="logo" className="w-full h-full object-cover" />
//                                                                     ) : (
//                                                                         <span className="text-lg font-bold text-gray-500">{supplier.name.substring(0,2).toUpperCase()}</span>
//                                                                     )}
//                                                                 </div>
//                                                             </div>

//                                                             <div className="px-4 mt-2 mb-1">
//                                                                 <h3 className="font-bold text-gray-800 text-md truncate" title={supplier.name}>Supplier: {supplier.name}</h3>
//                                                             </div>
                                                            
//                                                             <div className="px-4 mt-1 flex flex-wrap gap-1">
//                                                                 {supplier.services.map(s => (
//                                                                     <span key={s} className={`text-[10px] px-1.5 py-0.5 rounded border ${getServiceColor(s)}`}>{s}</span>
//                                                                 ))}
//                                                             </div>

//                                                             {/* Details */}
//                                                             <div className="p-4 flex-1 flex flex-col gap-2">
//                                                                 <div className="flex items-center gap-2 text-xs text-gray-600">
//                                                                     <User size={14} className="text-gray-400 shrink-0"/> 
//                                                                     <span className="truncate">{supplier.contactPerson || 'No contact'}</span>
//                                                                 </div>
//                                                                 <div className="flex items-center gap-2 text-xs text-gray-600">
//                                                                     <Wallet size={14} className="text-gray-400 shrink-0"/> 
//                                                                     <span className="bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-100 font-medium">
//                                                                     {supplier.paymentTerms}
//                                                                     </span>
//                                                                 </div>
                                                                
//                                                                 {/* Action Footer */}
//                                                                 <div className="mt-auto border-t border-gray-50 flex gap-2 pt-2">
//                                                                     <button onClick={() => handleEdit(supplier)} className="flex-1 py-1.5 text-xs font-medium text-gray-100 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center gap-1 transition-colors">
//                                                                     <Pencil size={12}/> Edit
//                                                                     </button>
//                                                                     <button onClick={() => handleDelete(supplier.id)} className="flex-1 py-1.5 text-xs font-medium text-gray-100 bg-red-500 hover:bg-red-600 rounded flex items-center justify-center gap-1 transition-colors">
//                                                                     <Trash2 size={12}/> Delete
//                                                                     </button>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         )}
//                     </div>
//                 ))
//             )}
//         </div>

//         {/* Modal Logic */}
//         {isModalOpen && (
//             <SupplierModal 
//             initialData={editingSupplier} 
//             onClose={() => setIsModalOpen(false)} 
//             onSave={() => { refreshAll(); setIsModalOpen(false); }} 
//             />
//         )}
//       </div>
//     </div>
//   );
// } 




















































"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Plus, Search, MapPin, 
  Wallet, Pencil, Trash2, User, Star,
  ChevronDown, ChevronRight, Globe, Briefcase, Loader2
} from "lucide-react";
import { useSRM } from "@/app/context/SRMContext";
import { SupplierData, deleteSupplier } from "@/utils/srmStorage";
import SupplierModal from "./SupplierModal";

export default function SupplierPage() {
  // Added isLoading from context
  const { suppliers, searchText, refreshAll, isLoading } = useSRM();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierData | null>(null);

  // Accordion State
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

  // --- 1. HIERARCHY LOGIC (Grouping) ---
  const groupedSuppliers = useMemo(() => {
    const filtered = suppliers.filter((s) =>
      s.name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.city?.toLowerCase().includes(searchText.toLowerCase()) ||
      s.services.some(svc => svc.toLowerCase().includes(searchText.toLowerCase()))
    );

    const groups: Record<string, Record<string, SupplierData[]>> = {};

    filtered.forEach(item => {
      const country = (item.country || "Other Locations").trim();
      const city = (item.city || "General").trim();

      if (!groups[country]) groups[country] = {};
      if (!groups[country][city]) groups[country][city] = [];
      
      groups[country][city].push(item);
    });

    return Object.keys(groups).sort().reduce((acc, country) => {
        acc[country] = groups[country];
        return acc;
    }, {} as Record<string, Record<string, SupplierData[]>>);

  }, [suppliers, searchText]);

  // --- 2. AUTO-EXPAND ON SEARCH ---
  useEffect(() => {
    if (searchText) {
      const allCountries = Object.keys(groupedSuppliers);
      const newExpCountries = allCountries.reduce((acc, key) => ({...acc, [key]: true}), {});
      setExpandedCountries(newExpCountries);
      
      const newExpCities: Record<string, boolean> = {};
      allCountries.forEach(c => {
          Object.keys(groupedSuppliers[c]).forEach(city => {
              newExpCities[`${c}-${city}`] = true;
          });
      });
      setExpandedCities(newExpCities);
    }
  }, [searchText, groupedSuppliers]);

  // Actions
  const handleAddNew = () => { setEditingSupplier(null); setIsModalOpen(true); };
  const handleEdit = (s: SupplierData) => { setEditingSupplier(s); setIsModalOpen(true); };
  
  // CHANGED: Now async
  const handleDelete = async (id: string) => { 
    if(confirm("Delete Supplier?")) { 
      // Important: id here is mapped to _id under the hood in srmStorage
      await deleteSupplier(id); 
      await refreshAll(); 
    }
  };

  const getServiceColor = (svc: string) => {
     if(svc === 'Stay') return 'bg-blue-100 text-blue-800 border-blue-200';
     if(svc === 'Transport') return 'bg-green-100 text-green-800 border-green-200';
     if(svc === 'Activity') return 'bg-purple-100 text-purple-800 border-purple-200';
     if(svc === 'Meal') return 'bg-orange-100 text-orange-800 border-orange-200';
     return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden">
      
      {/* Background Layer */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }} 
      />
      <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 h-full ">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 shrink-0 bg-white/95 p-4 border-b border-white/50 backdrop-blur-md shadow-sm">
            <div>
              <h1 className="text-xl font-bold text-[#0a1f44] flex items-center gap-2">
                <Briefcase className="text-blue-600"/> Supplier Directory
              </h1>
              <p className="text-xs text-gray-500">Manage B2B partners & contracts via Hierarchy.</p>
            </div>
            <button onClick={handleAddNew} className="bg-[#0a1f44] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-900 shadow-md transition-all">
              <Plus size={18} /> <span>Add Supplier</span>
            </button>
        </div>

        {/* HIERARCHICAL VIEW */}
        <div className="flex-1 overflow-y-auto pb-10 pl-4 pr-4 space-y-4">
            
            {/* Loader Check */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-white">
                    <Loader2 size={40} className="animate-spin mb-4" />
                    <p className="font-medium text-lg drop-shadow-md">Loading Suppliers from Database...</p>
                </div>
            ) : Object.keys(groupedSuppliers).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-white/50 rounded-xl bg-white/40 backdrop-blur-sm">
                    <Search size={32} className="mb-2 opacity-50"/>
                    <p className="font-medium">No suppliers found matching "{searchText}"</p>
                </div>
            ) : (
                Object.entries(groupedSuppliers).map(([country, cities]) => (
                    <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        
                        {/* 1. Country Header */}
                        <div 
                            onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))}
                            className="flex items-center bg-white/95 p-3 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white transition-all select-none border border-white/50 backdrop-blur-sm mb-2"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:text-blue-800 transition-colors">
                                {expandedCountries[country] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                    <Globe size={18} className="text-blue-600" /> {country}
                                </h3>
                            </div>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                {Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Suppliers
                            </span>
                        </div>

                        {/* 2. Cities List */}
                        {expandedCountries[country] && (
                            <div className="ml-4  pl-4 border-l-2 border-white/40 space-y-3">
                                {Object.entries(cities).map(([city, items]) => {
                                    const cityKey = `${country}-${city}`;
                                    return (
                                        <div key={city}>
                                            <div 
                                                onClick={() => setExpandedCities(prev => ({...prev, [cityKey]: !prev[cityKey]}))}
                                                className="flex items-center bg-white/95 p-3 rounded-lg gap-2 cursor-pointer hover:bg-white/90 transition-all select-none border border-white/30 backdrop-blur-sm mb-2"
                                            >
                                                {expandedCities[cityKey] ? <ChevronDown size={16} className="text-gray-500"/> : <ChevronRight size={16} className="text-gray-500"/>}
                                                <MapPin size={16} className="text-red-800" />
                                                <span className="font-bold text-gray-900">{city}</span>
                                                <span className="text-xs text-gray-900 bg-blue-200 px-2 py-0.5 rounded-full">
                                                    {items.length}
                                                </span>
                                            </div>

                                            {/* 3. Supplier Cards Grid */}
                                            {expandedCities[cityKey] && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 ml-6 mb-4">
                                                  
                                                    {items.map((supplier) => (
                                                        <div key={supplier.id} className="bg-white/95 mt-2 border border-gray-300 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all group flex flex-col relative overflow-hidden  h-[284px]">
                                                            
                                                            {/* Preferred Badge */}
                                                            {supplier.isPreferred && (
                                                                <div className="absolute top-0 right-0 bg-orange-400 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 flex items-center gap-1 shadow-sm">
                                                                    <Star size={10} fill="white" /> PREFERRED
                                                                </div>
                                                            )}

                                                            {/* Card Header */}
                                                            <div className="w-full p-4 flex items-center justify-start bg-gradient-to-br from-blue-400 to-purple-500 shadow-inner border border-white/10">
                                                                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                                                    {supplier.logoUrl ? (
                                                                        <img src={supplier.logoUrl} alt="logo" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <span className="text-lg font-bold text-gray-500">{supplier.name.substring(0,2).toUpperCase()}</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="px-4 mt-2 mb-1">
                                                                <h3 className="font-bold text-gray-800 text-md truncate" title={supplier.name}>Supplier: {supplier.name}</h3>
                                                            </div>
                                                            
                                                            <div className="px-4 mt-1 flex flex-wrap gap-1">
                                                                {supplier.services.map(s => (
                                                                    <span key={s} className={`text-[10px] px-1.5 py-0.5 rounded border ${getServiceColor(s)}`}>{s}</span>
                                                                ))}
                                                            </div>

                                                            {/* Details */}
                                                            <div className="p-4 flex-1 flex flex-col gap-2">
                                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                                    <User size={14} className="text-gray-400 shrink-0"/> 
                                                                    <span className="truncate">{supplier.contactPerson || 'No contact'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                                    <Wallet size={14} className="text-gray-400 shrink-0"/> 
                                                                    <span className="bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-100 font-medium">
                                                                    {supplier.paymentTerms}
                                                                    </span>
                                                                </div>
                                                                
                                                                {/* Action Footer */}
                                                                <div className="mt-auto border-t border-gray-50 flex gap-2 pt-2">
                                                                    <button onClick={() => handleEdit(supplier)} className="flex-1 py-1.5 text-xs font-medium text-gray-100 bg-blue-500 hover:bg-blue-600 rounded flex items-center justify-center gap-1 transition-colors">
                                                                    <Pencil size={12}/> Edit
                                                                    </button>
                                                                    <button onClick={() => handleDelete(supplier.id as string)} className="flex-1 py-1.5 text-xs font-medium text-gray-100 bg-red-500 hover:bg-red-600 rounded flex items-center justify-center gap-1 transition-colors">
                                                                    <Trash2 size={12}/> Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>

        {/* Modal Logic */}
        {isModalOpen && (
            <SupplierModal 
            initialData={editingSupplier} 
            onClose={() => setIsModalOpen(false)} 
            // Changed: Made async
            onSave={async () => { await refreshAll(); setIsModalOpen(false); }} 
            />
        )}
      </div>
    </div>
  );
}