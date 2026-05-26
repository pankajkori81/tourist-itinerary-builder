// "use client";

// import React, { useState, useRef, useMemo, useEffect } from 'react';
// import { 
//   Plus, MapPin, Utensils, Star, 
//   Trash2, X, Save, Image as ImageIcon, 
//   ChevronDown, ChevronRight, Search, 
//   ChefHat, DollarSign, Calendar, Sun, Moon, PlusCircle, Copy,
//   Edit,
//   Globe
// } from 'lucide-react';
// import { useSRM } from '@/app/context/SRMContext';
// import { MealData, saveMeal, deleteMeal, MealRateCard, MonthlyMealRate } from '@/utils/srmStorage';

// // Default empty rates for a month
// const DEFAULT_MONTH_RATE: MonthlyMealRate = { 
//   lunchAdult: 0, lunchChild: 0, 
//   dinnerAdult: 0, dinnerChild: 0 
// };

// // Helper to create a full year of empty rates
// const createEmptyYearRates = () => {
//   const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
//   const rates: { [key: string]: MonthlyMealRate } = {};
//   months.forEach(m => rates[m] = { ...DEFAULT_MONTH_RATE });
//   return rates;
// };

// export default function MealSRMPage() {
//   const { meals, refreshAll, searchText } = useSRM();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState<'info' | 'rates'>('info'); // NEW: Tabs
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Nested Accordion State
//   const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
//   const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

//   // --- FORM STATE ---
//   const initialForm: MealData = {
//     id: '', 
//     restaurantName: '', 
//     cuisine: 'Multi-Cuisine', 
//     type: 'Standard', 
//     city: '', 
//     country: '', 
//     address: '',
//     rating: '4.0', 
//     description: '', 
//     images: [],
//     menuType: 'Buffet',
//     dietaryOptions: [],
//     inclusions: '', // NEW
//     currency: 'USD',
//     rateCards: [], // NEW
//     status: 'Active'
//   };
//   const [formData, setFormData] = useState<MealData>(initialForm);

//   // --- GROUPING LOGIC (Country -> City -> Meals) ---
//   const groupedData = useMemo(() => {
//     const filtered = meals.filter(m => 
//       (m.restaurantName || "").toLowerCase().includes(searchText.toLowerCase()) || 
//       (m.city || "").toLowerCase().includes(searchText.toLowerCase()) ||
//       (m.country || "").toLowerCase().includes(searchText.toLowerCase())
//     );

//     const groups: Record<string, Record<string, MealData[]>> = {};

//     filtered.forEach(item => {
//       const country = (item.country || "Uncategorized").trim();
//       const city = (item.city || "Unknown City").trim();
//       if (!groups[country]) groups[country] = {};
//       if (!groups[country][city]) groups[country][city] = [];
//       groups[country][city].push(item);
//     });

//     return Object.keys(groups).sort().reduce((acc, country) => {
//         acc[country] = groups[country];
//         return acc;
//     }, {} as Record<string, Record<string, MealData[]>>);
//   }, [meals, searchText]);

//   // Auto-expand on search
//   useEffect(() => {
//     if (searchText) {
//        const allCountries = Object.keys(groupedData);
//        setExpandedCountries(allCountries.reduce((acc, key) => ({...acc, [key]: true}), {}));
//        const newExpCities: Record<string, boolean> = {};
//        allCountries.forEach(c => {
//            Object.keys(groupedData[c]).forEach(city => {
//                newExpCities[`${c}-${city}`] = true;
//            });
//        });
//        setExpandedCities(newExpCities);
//     }
//   }, [searchText, groupedData]);

//   // --- HANDLERS ---
//   const handleEdit = (item: MealData) => { 
//     setFormData(JSON.parse(JSON.stringify(item))); 
//     setActiveTab('info');
//     setIsModalOpen(true); 
//   };

//   const handleDelete = (id: string) => { 
//     if (confirm('Delete this restaurant?')) { 
//       deleteMeal(id); 
//       refreshAll(); 
//     } 
//   };

//   const handleSave = () => {
//     if (!formData.restaurantName || !formData.city) return alert("Restaurant Name and City are required");
//     const cleanData = {
//         ...formData,
//         city: formData.city.trim(),
//         country: formData.country.trim()
//     };
//     saveMeal(cleanData);
//     refreshAll();
//     setIsModalOpen(false);
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({ ...prev, images: [reader.result as string] }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const toggleDietary = (option: string) => {
//     const current = formData.dietaryOptions || [];
//     if (current.includes(option)) {
//       setFormData({...formData, dietaryOptions: current.filter(o => o !== option)});
//     } else {
//       setFormData({...formData, dietaryOptions: [...current, option]});
//     }
//   };

//   // --- RATE CARD LOGIC ---
//   const addRateCard = () => {
//     const maxYear = formData.rateCards.length > 0 
//       ? Math.max(...formData.rateCards.map(rc => rc.year)) 
//       : new Date().getFullYear() - 1;
    
//     const newCard: MealRateCard = {
//       year: maxYear + 1,
//       rates: createEmptyYearRates()
//     };
    
//     setFormData(prev => ({
//       ...prev,
//       rateCards: [...prev.rateCards, newCard].sort((a,b) => a.year - b.year)
//     }));
//   };

//   const removeRateCard = (year: number) => {
//     if(confirm(`Remove rates for ${year}?`)) {
//       setFormData(prev => ({
//         ...prev,
//         rateCards: prev.rateCards.filter(rc => rc.year !== year)
//       }));
//     }
//   };

//   const updateRate = (yearIndex: number, month: string, field: keyof MonthlyMealRate, value: number) => {
//     const newCards = [...formData.rateCards];
//     newCards[yearIndex].rates[month][field] = value;
//     setFormData({ ...formData, rateCards: newCards });
//   };

//   // Helper to get display price (shows range)
//   const getPriceRange = (meal: MealData) => {
//     if (!meal.rateCards || meal.rateCards.length === 0) return "N/A";
//     // Just grab the first available rate to show representative price
//     const rates = Object.values(meal.rateCards[0].rates);
//     const lunchPrices = rates.map(r => r.lunchAdult).filter(p => p > 0);
//     const min = Math.min(...lunchPrices);
//     return min === Infinity ? "On Request" : `$${min}+`;
//   };

//   return (
//    <div className="h-full w-full flex flex-col relative overflow-hidden">
      
//       {/* BACKGROUND */}
//       <div className="absolute inset-0 z-0" style={{ 
//           backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000")', 
//           backgroundSize: 'cover', 
//           backgroundPosition: 'center' 
//       }} />
//       <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm" />

//       {/* CONTENT WRAPPER */}
//       <div className="flex-1 flex flex-col relative z-10 h-full">
        
//         {/* HEADER */}
//         <div className="bg-white/95 border-b border-white/50 px-6 py-4 flex justify-between items-center backdrop-blur-md shadow-sm">
//             <div>
//                 <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                 <Utensils className="text-orange-600"/> Meal Inventory
//                 </h1>
//                 <p className="text-xs text-gray-600 font-medium">Manage restaurants, menus, and seasonal pricing.</p>
//             </div>
//             <button onClick={() => { setFormData(initialForm); setActiveTab('info'); setIsModalOpen(true); }} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
//             <Plus size={18} /> Add Restaurant
//             </button>
//         </div>

//         {/* LIST AREA */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
//             {Object.keys(groupedData).length === 0 ? (
//                  <div className="flex flex-col items-center justify-center h-64 text-gray-200 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md">
//                     <Utensils size={48} className="opacity-50 mb-2"/>
//                     <p className="font-bold">No restaurants found.</p>
//                     <p className="text-sm">Click "Add Restaurant" to begin.</p>
//                  </div>
//              ) : (
//                 Object.entries(groupedData).map(([country, cities]) => (
//                     <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        
//                         {/* 1. COUNTRY ROW */}
//                         <div 
//                             onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))}
//                             className="flex items-center bg-white/95 p-4 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white transition-all select-none border border-white/50 mb-2"
//                         >
//                             <div className="p-2 bg-orange-100 rounded-lg text-orange-600 group-hover:text-orange-800 transition-colors">
//                                 {expandedCountries[country] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
//                             </div>

//                                <div className="flex-1">
//                                                             <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
//                                                                 <Globe size={18} className="text-blue-800" />
//                                                                 {country}
//                                                             </h3>
//                                                         </div>
//                             {/* <h3 className="font-bold text-gray-800 text-lg flex-1">{country}</h3> */}
//                             <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
//                                 {Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Places
//                             </span>
//                         </div>
                        
//                         {/* 2. CITIES ROW */}
//                         {expandedCountries[country] && (
//                             <div className="ml-4 pl-4 border-l-2 border-white/30 space-y-3">
//                                 {Object.entries(cities).map(([city, items]) => {
//                                     const cityKey = `${country}-${city}`;
//                                     return (
//                                         <div key={city}>
//                                             <div 
//                                                 onClick={() => setExpandedCities(prev => ({...prev, [cityKey]: !prev[cityKey]}))}
//                                                 className="flex items-center bg-white/95 p-3 rounded-lg gap-2 cursor-pointer hover:bg-white transition-all select-none mb-2"
//                                             >
//                                                 {expandedCities[cityKey] ? <ChevronDown size={16} className="text-gray-500"/> : <ChevronRight size={16} className="text-gray-500"/>}
//                                                 <MapPin size={16} className="text-red-700" />
//                                                 <span className="font-bold text-gray-900">{city}</span>
//                                                 <span className="text-xs text-gray-900 bg-blue-300 px-2 py-0.5 rounded-full">{items.length}</span>
//                                             </div>

//                                             {/* 3. RESTAURANT GRID */}
//                                             {expandedCities[cityKey] && (
//                                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-6 mb-4">
//                                                     {items.map(meal => (
//                                                         <div key={meal.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
                                                            
//                                                             {/* Image Header */}
//                                                             <div className="h-32 bg-gray-100 relative overflow-hidden">
//                                                                 {meal.images?.[0] ? (
//                                                                     <img src={meal.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={meal.restaurantName}/>
//                                                                 ) : (
//                                                                     // <div className="w-full h-full flex items-center justify-center bg-orange-200">
//                                                                     //     <ChefHat size={32} className="text-orange-200"/>
//                                                                     // </div>
//                                                                       <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 shadow-inner border border-white/10 group">
//                                                                                                                                             <ChefHat
//                                                                                                                                                 size={48}
//                                                                                                                                                 className="text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
//                                                                                                                                             />
//                                                                                                                                         </div>
//                                                                 )}
//                                                                 <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-[11px] font-bold shadow text-gray-800 flex items-center gap-1">
//                                                                     <Star size={10} className="fill-yellow-700 text-yellow-700"/> {meal.rating}
//                                                                 </div>
//                                                                 <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">
//                                                                     {meal.cuisine}
//                                                                 </div>
//                                                             </div>

//                                                             {/* Info Body */}
//                                                             <div className="p-4 flex-1 flex flex-col">
//                                                                 <h4 className="font-bold text-gray-800 text-lg leading-tight mb-1">{meal.restaurantName}</h4>
//                                                                 <p className="text-xs text-gray-700 flex items-center gap-1 mt-1 mb-3">
//                                                                     <MapPin size={12}/> {meal.address || `${meal.city}, ${meal.country}`}
//                                                                 </p>

//                                                                 {/* Chips */}
//                                                                 <div className="flex flex-wrap gap-1 mt-1 mb-3">
//                                                                     <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">
//                                                                         {meal.menuType}
//                                                                     </span>
//                                                                     {(meal.dietaryOptions || []).slice(0, 2).map(opt => (
//                                                                         <span key={opt} className="px-2 py-0.5 rounded bg-green-50 text-green-700 text-[11px] font-bold border border-green-100">
//                                                                             {opt}
//                                                                         </span>
//                                                                     ))}
//                                                                 </div>

//                                                                 {/* Price Footer */}
//                                                                 <div className="mt-auto pt-1 mb-4 border-t border-dashed border-gray-200 flex justify-between items-center">
//                                                                     <div className="flex flex-col">
                                                                      
//                                                                         <div className="font-bold text-gray-800 text-sm">
//                                                                          Starts From:  <span className="  text-[14px]  text-green-800 font-bold uppercase">{getPriceRange(meal)}</span>
                                                                          
//                                                                         </div>
//                                                                     </div>
                                                                    
                                                                 
//                                                                 </div>
                                                             

//                                                                                                  <div className="mt-auto border-t border-gray-100 flex items-center gap-3">
//                                                                                                                                         <button 
//                                                                                                                                             onClick={() => handleEdit(meal)} 
//                                                                                                                                             className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all active:scale-95 flex items-center justify-center gap-2"
//                                                                                                                                         >
//                                                                                                                                             <Edit size={14} /> Edit Rates
//                                                                                                                                         </button>
                                                                    
//                                                                                                                                             <button 
//                                                                                                                                             onClick={() => handleDelete(meal.id)} 
//                                                                                                                                             className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all active:scale-95 flex items-center justify-center gap-2"
//                                                                                                                                         >
//                                                                                                                                             <Trash2 size={14} /> Delete 
//                                                                                                                                         </button>
                                                                                                                                        
                                                                                                                                      
//                                                                                                                                     </div>
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
//       </div>

//       {/* --- ADD/EDIT MODAL --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
//            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
              
//               {/* Modal Header */}
//               <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
//                  <div>
//                     <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Restaurant' : 'Add New Restaurant'}</h2>
//                     <p className="text-xs text-gray-500">Configure seasonal menus and meal pricing</p>
//                  </div>
//                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><X size={20}/></button>
//               </div>

//               {/* Tabs */}
//               <div className="flex border-b border-gray-200 px-6 gap-6 bg-white shrink-0">
//                   <button onClick={() => setActiveTab('info')} className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-600'}`}>
//                       Basic Info & Menu
//                   </button>
//                   <button onClick={() => setActiveTab('rates')} className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'rates' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-600'}`}>
//                       Pricing Matrix
//                   </button>
//               </div>

//               {/* Modal Body */}
//               <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  
//                   {/* TAB 1: INFO */}
//                   {activeTab === 'info' && (
//                     <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//                       <div className="md:col-span-4 space-y-4">
//                           <div 
//                             onClick={() => fileInputRef.current?.click()}
//                             className="h-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white bg-cover bg-center transition-all relative overflow-hidden bg-gray-100"
//                             style={{ backgroundImage: `url(${formData.images[0]})` }}
//                           >
//                               {!formData.images[0] && (
//                                 <div className="text-center text-gray-400">
//                                     <ImageIcon className="mx-auto mb-2"/>
//                                     <span className="text-xs font-bold">Upload Photo</span>
//                                 </div>
//                               )}
//                               <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
//                           </div>
                          
//                           <div className="bg-orange-50 p-2 rounded-lg border border-orange-100">
//                                 <label className="text-xs font-bold text-orange-800 mb-2 block flex items-center gap-1"><Star size={12} className="fill-yellow-700 text-yellow-700"/> Rating</label>
//                                 <input type="number" step="0.1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full p-2 border border-orange-200 rounded text-start font-bold text-orange-900 focus:ring-orange-500"/>
//                           </div>
//                       </div>

//                       <div className="md:col-span-8 space-y-4">
//                           <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="text-xs font-semi-bold text-gray-600 mb-1 block">Restaurant Name *</label>
//                                     <input type="text" value={formData.restaurantName} onChange={e => setFormData({...formData, restaurantName: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg font-bold" placeholder="e.g. The Curry House"/>
//                                 </div>
//                                 <div>
//                                     <label className="text-xs font-bold text-gray-600 mb-1 block">Cuisine Type</label>
//                                     <select value={formData.cuisine} onChange={e => setFormData({...formData, cuisine: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg bg-white">
//                                         <option>Multi-Cuisine</option><option>Italian</option><option>Indian</option><option>Chinese</option><option>Continental</option><option>Mexican</option><option>Thai</option>
//                                     </select>
//                                 </div>
//                           </div>

//                           <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="text-xs font-bold text-gray-600 mb-1 block">City *</label>
//                                     <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg"/>
//                                 </div>
//                                 <div>
//                                     <label className="text-xs font-bold text-gray-600 mb-1 block">Country *</label>
//                                     <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg"/>
//                                 </div>
//                           </div>

//                           <div>
//                                 <label className="text-xs font-bold text-gray-600 mb-1 block">Full Address</label>
//                                 <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="Street, landmark..."/>
//                           </div>

//                           <hr className="border-gray-200"/>

//                           <div className="grid grid-cols-2 gap-4">
//                               <div>
//                                   <label className="text-xs font-bold text-gray-600 mb-1 block">Menu Style</label>
//                                   <select value={formData.menuType} onChange={e => setFormData({...formData, menuType: e.target.value as any})} className="w-full p-2 border border-gray-300 rounded-lg bg-white">
//                                       <option>Buffet</option><option>Fixed Menu</option><option>A La Carte</option>
//                                   </select>
//                               </div>
//                               <div>
//                                   <label className="text-xs font-bold text-gray-600 mb-1 block">Dietary Options</label>
//                                   <div className="flex gap-2">
//                                       {['Veg', 'Non-Veg', 'Jain'].map(opt => (
//                                           <button 
//                                             key={opt}
//                                             onClick={() => toggleDietary(opt)}
//                                             className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${formData.dietaryOptions?.includes(opt) ? 'bg-green-100 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
//                                           >
//                                               {opt}
//                                           </button>
//                                       ))}
//                                   </div>
//                               </div>
//                           </div>

//                           {/* INCLUSIONS FIELD (IMPROVEMENT 2) */}
//                           <div>
//                                 <label className="text-xs font-bold text-gray-600 mb-1 block">Menu Inclusions (What gets booked)</label>
//                                 <textarea 
//                                     rows={3}
//                                     value={formData.inclusions} 
//                                     onChange={e => setFormData({...formData, inclusions: e.target.value})} 
//                                     className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700"
//                                     placeholder="e.g. 1 Soup, 2 Starters, 1 Main Course, 1 Dessert, Unlimited Soft Drinks"
//                                 />
//                                 <p className="text-[10px] text-gray-400 mt-1">This text will appear in the proposal to explain value.</p>
//                           </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* TAB 2: PRICING MATRIX (IMPROVEMENT 1 & 3) */}
//                   {activeTab === 'rates' && (
//                     <div className="space-y-6">
//                         {formData.rateCards.length === 0 ? (
//                              <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-xl">
//                                 <Calendar className="mx-auto text-gray-300 mb-3" size={48}/>
//                                 <p className="text-gray-600 font-medium mb-4">No seasonal rates configured.</p>
//                                 <button onClick={addRateCard} className="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700 transition-colors">
//                                     + Add Rate Card (Start with {new Date().getFullYear()})
//                                 </button>
//                              </div>
//                         ) : (
//                             formData.rateCards.map((card, cIndex) => (
//                                 <div key={card.year} className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2">
//                                     {/* Year Header */}
//                                     <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 flex justify-between items-center sticky top-0 z-10">
//                                         <div className="flex items-center gap-3">
//                                             <div className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-bold shadow-sm">{card.year}</div>
//                                             <span className="text-xs text-gray-600 font-bold uppercase">Rate Card</span>
//                                         </div>
//                                         <button onClick={() => removeRateCard(card.year)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
//                                             <Trash2 size={16}/>
//                                         </button>
//                                     </div>
                                    
//                                     {/* The Matrix Table */}
//                                     <div className="overflow-x-auto">
//                                         <table className="w-full text-sm">
//                                             <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
//                                                 <tr>
//                                                     <th className="p-3 text-left w-24">Month</th>
//                                                     <th className="p-3 text-center border-l border-gray-200 bg-yellow-50/50">
//                                                         <div className="flex items-center justify-center gap-1 text-yellow-700">
//                                                             <Sun size={14}/> Lunch
//                                                         </div>
//                                                     </th>
//                                                     <th className="p-3 text-center border-l border-gray-200 bg-indigo-50/50">
//                                                         <div className="flex items-center justify-center gap-1 text-indigo-700">
//                                                             <Moon size={14}/> Dinner
//                                                         </div>
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody className="divide-y divide-gray-100">
//                                                 {Object.keys(card.rates).map((month) => (
//                                                     <tr key={month} className="hover:bg-gray-50 transition-colors">
//                                                         <td className="p-3 font-bold text-gray-500 uppercase text-xs">{month}</td>
                                                        
//                                                         {/* LUNCH INPUTS */}
//                                                         <td className="p-2 border-l border-gray-100 bg-yellow-50/30">
//                                                             <div className="flex gap-2">
//                                                                 <div className="relative flex-1 ">
//                                                                     <span className="absolute left-2 top-2 text-[11px] text-gray-600 uppercase">Ad:</span>
//                                                                     <input 
//                                                                         type="number" 
//                                                                         value={card.rates[month].lunchAdult}
//                                                                         onChange={e => updateRate(cIndex, month, 'lunchAdult', parseFloat(e.target.value) || 0)}
//                                                                         className="w-full p-2 pl-7  text-xs font-bold border border-yellow-200 rounded focus:border-yellow-500 outline-none text-gray-700 bg-white"
//                                                                         placeholder="0"
//                                                                     />
//                                                                 </div>
//                                                                 <div className="relative flex-1">
//                                                                     <span className="absolute left-2 top-2 text-[11px] text-gray-600 uppercase">Ch:</span>
//                                                                     <input 
//                                                                         type="number" 
//                                                                         value={card.rates[month].lunchChild}
//                                                                         onChange={e => updateRate(cIndex, month, 'lunchChild', parseFloat(e.target.value) || 0)}
//                                                                         className="w-full p-2 pl-7  text-xs font-bold border border-yellow-200 rounded focus:border-yellow-500 outline-none text-gray-700 bg-white"
//                                                                         placeholder="0"
//                                                                     />
//                                                                 </div>
//                                                             </div>
//                                                         </td>

//                                                         {/* DINNER INPUTS */}
//                                                         <td className="p-2 border-l border-gray-100 bg-indigo-50/30">
//                                                             <div className="flex gap-2">
//                                                                 <div className="relative flex-1">
//                                                                     <span className="absolute left-2 top-2 text-[11px] text-gray-600 uppercase">Ad:</span>
//                                                                     <input 
//                                                                         type="number" 
//                                                                         value={card.rates[month].dinnerAdult}
//                                                                         onChange={e => updateRate(cIndex, month, 'dinnerAdult', parseFloat(e.target.value) || 0)}
//                                                                         className="w-full p-2 pl-7 text-xs font-bold border border-indigo-200 rounded focus:border-indigo-500 outline-none text-gray-700 bg-white"
//                                                                         placeholder="0"
//                                                                     />
//                                                                 </div>
//                                                                 <div className="relative flex-1">
//                                                                     <span className="absolute left-2 top-2 text-[11px] text-gray-600">Ch</span>
//                                                                     <input 
//                                                                         type="number" 
//                                                                         value={card.rates[month].dinnerChild}
//                                                                         onChange={e => updateRate(cIndex, month, 'dinnerChild', parseFloat(e.target.value) || 0)}
//                                                                         className="w-full p-2 pl-7 text-xs font-bold border border-indigo-200 rounded focus:border-indigo-500 outline-none text-gray-700 bg-white"
//                                                                         placeholder="0"
//                                                                     />
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                         <button onClick={addRateCard} className="w-full py-3 border-2 border-dashed border-orange-300 bg-orange-50 text-orange-700 font-bold rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-2">
//                             <PlusCircle size={20}/> Add Rate Card for Next Year
//                         </button>
//                     </div>
//                   )}
//               </div>

//               {/* Modal Footer */}
//               <div className="px-6 py-4 border-t border-gray-200 bg-white rounded-b-xl flex justify-end gap-3 shrink-0">
//                   <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
//                   <button onClick={handleSave} className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2">
//                       <Save size={18}/> Save Meal
//                   </button>
//               </div>
//            </div>
//         </div>
//       )}
//    </div>
//   );
// } 








































// "use client";

// import React, { useState, useRef, useMemo, useEffect } from 'react';
// import { 
//   Plus, MapPin, Utensils, Star, 
//   Trash2, X, Save, Image as ImageIcon, 
//   ChevronDown, ChevronRight, Globe, 
//   Edit, DollarSign, Briefcase, Phone, Mail, CreditCard,
//   Sun, Moon, Calendar, PlusCircle
// } from 'lucide-react';
// import { useSRM } from '@/app/context/SRMContext';
// import { MealData, saveMeal, deleteMeal, MonthlyMealRate, MealRateCard } from '@/utils/srmStorage';

// // Default empty rates
// const DEFAULT_RATES: MonthlyMealRate = { lunchAdult: 0, lunchChild: 0, dinnerAdult: 0, dinnerChild: 0 };

// // Helper to create empty year
// const createEmptyYearRates = () => {
//   const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
//   const rates: { [key: string]: MonthlyMealRate } = {};
//   months.forEach(m => rates[m] = { ...DEFAULT_RATES });
//   return rates;
// };

// export default function MealSRMPage() {
//   // [CHANGE 1: Added 'suppliers' to context]
//   const { meals, suppliers, refreshAll, searchText } = useSRM();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState<'info' | 'rates'>('info');
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
//   const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

//   // --- FORM STATE ---
//   const initialForm: MealData & { linkedSupplierId?: string } = {
//     id: '', 
//     restaurantName: '', 
//     cuisine: 'Multi-Cuisine', 
//     type: 'Standard', 
//     city: '', 
//     country: '', 
//     address: '',
//     rating: '4.0', 
//     images: [], 
//     menuType: 'Buffet',
//     dietaryOptions: [], 
//     inclusions: '', 
//     currency: 'USD', 
//     rateCards: [], 
//     status: 'Active', 
//     createdAt: '', 
//     updatedAt: '',
//     linkedSupplierId: '' // [CHANGE 2: Added Linked Supplier Field]
//   };
//   const [formData, setFormData] = useState(initialForm);

//   // --- [NEW LOGIC START]: SMART SUPPLIER FILTERING & AUTO-SELECT ---
//   // 1. Filter: Show suppliers that provide "Meal" and match the city
//   const availableSuppliers = useMemo(() => {
//     return suppliers.filter(s => {
//       const basicCheck = s.status === 'Active' && s.services.includes('Meal');
//       const cityCheck = formData.city 
//         ? s.city.toLowerCase().trim() === formData.city.toLowerCase().trim() 
//         : true; 
//       return basicCheck && cityCheck;
//     });
//   }, [suppliers, formData.city]);

//   // 2. Auto-Select "Preferred" Partner
//   useEffect(() => {
//      if(isModalOpen && formData.city && !formData.linkedSupplierId) {
//         const preferred = suppliers.find(s => 
//            s.status === 'Active' &&
//            s.services.includes('Meal') &&
//            s.city.toLowerCase().trim() === formData.city.toLowerCase().trim() &&
//            s.isPreferred
//         );
//         if(preferred) {
//            setFormData(prev => ({...prev, linkedSupplierId: preferred.id}));
//         }
//      }
//   }, [formData.city, isModalOpen, suppliers]);

//   // 3. Data for Intelligence Box
//   const selectedSupplierData = suppliers.find(s => s.id === formData.linkedSupplierId);
//   // --- [NEW LOGIC END] ---

//   // --- GROUPING LOGIC ---
//   const groupedData = useMemo(() => {
//     const filtered = meals.filter(m => 
//       (m.restaurantName || "").toLowerCase().includes(searchText.toLowerCase()) || 
//       (m.city || "").toLowerCase().includes(searchText.toLowerCase())
//     );
//     const groups: Record<string, Record<string, MealData[]>> = {};
//     filtered.forEach(item => {
//       const country = (item.country || "Uncategorized").trim();
//       const city = (item.city || "General").trim();
//       if (!groups[country]) groups[country] = {};
//       if (!groups[country][city]) groups[country][city] = [];
//       groups[country][city].push(item);
//     });
//     return Object.keys(groups).sort().reduce((acc, country) => {
//         acc[country] = groups[country];
//         return acc;
//     }, {} as Record<string, Record<string, MealData[]>>);
//   }, [meals, searchText]);

//   useEffect(() => {
//     if (searchText) {
//        const allCountries = Object.keys(groupedData);
//        setExpandedCountries(allCountries.reduce((acc, key) => ({...acc, [key]: true}), {}));
//        const newExpCities: Record<string, boolean> = {};
//        allCountries.forEach(c => {
//            Object.keys(groupedData[c]).forEach(city => newExpCities[`${c}-${city}`] = true);
//        });
//        setExpandedCities(newExpCities);
//     }
//   }, [searchText, groupedData]);

//   // --- HANDLERS ---
//   const handleEdit = (item: MealData) => { 
//     setFormData(JSON.parse(JSON.stringify(item))); 
//     setActiveTab('info');
//     setIsModalOpen(true); 
//   };

//   const handleDelete = (id: string) => { 
//     if (confirm('Delete this restaurant?')) { 
//       deleteMeal(id); 
//       refreshAll(); 
//     } 
//   };

//   const handleSave = () => {
//     if (!formData.restaurantName || !formData.city) return alert("Restaurant Name and City are required");
//     saveMeal({...formData, city: formData.city.trim(), country: formData.country.trim()});
//     refreshAll();
//     setIsModalOpen(false);
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setFormData(prev => ({ ...prev, images: [reader.result as string] }));
//       reader.readAsDataURL(file);
//     }
//   };

//   const toggleDietary = (option: string) => {
//     const current = formData.dietaryOptions || [];
//     if (current.includes(option)) {
//       setFormData({...formData, dietaryOptions: current.filter(o => o !== option)});
//     } else {
//       setFormData({...formData, dietaryOptions: [...current, option]});
//     }
//   };

//   // --- RESTORED PRICING MATRIX LOGIC ---
//   const addRateCard = () => {
//     const maxYear = formData.rateCards.length > 0 ? Math.max(...formData.rateCards.map(rc => rc.year)) : new Date().getFullYear() - 1;
//     const newCard: MealRateCard = { year: maxYear + 1, rates: createEmptyYearRates() };
//     setFormData(prev => ({ ...prev, rateCards: [...prev.rateCards, newCard].sort((a,b) => a.year - b.year) }));
//   };

//   const removeRateCard = (year: number) => {
//     if(confirm(`Remove rates for ${year}?`)) {
//       setFormData(prev => ({ ...prev, rateCards: prev.rateCards.filter(rc => rc.year !== year) }));
//     }
//   };

//   const updateRate = (yearIndex: number, month: string, field: keyof MonthlyMealRate, value: number) => {
//     const newCards = [...formData.rateCards];
//     // @ts-ignore
//     newCards[yearIndex].rates[month][field] = value;
//     setFormData({ ...formData, rateCards: newCards });
//   };

//   const getPriceRange = (meal: MealData) => {
//     if (!meal.rateCards || meal.rateCards.length === 0) return "N/A";
//     const rates = Object.values(meal.rateCards[0].rates);
//     const lunchPrices = rates.map(r => r.lunchAdult).filter(p => p > 0);
//     const min = Math.min(...lunchPrices);
//     return min === Infinity ? "On Request" : `$${min}+`;
//   };

//   return (
//    <div className="h-full w-full flex flex-col relative overflow-hidden">
//       <div className="absolute inset-0 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
//       <div className="absolute inset-0 z-0 bg-black/50 backdrop-blur-sm" />

//       <div className="flex-1 flex flex-col relative z-10 h-full">
//         <div className="bg-white/95 border-b border-white/50 px-6 py-4 flex justify-between items-center backdrop-blur-md shadow-sm z-10">
//             <div>
//                 <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Utensils className="text-orange-600"/> Meal Inventory</h1>
//                 <p className="text-xs text-gray-600 font-medium">Manage restaurants, menus, and meal pricing.</p>
//             </div>
//             <button onClick={() => { setFormData(initialForm); setActiveTab('info'); setIsModalOpen(true); }} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
//                 <Plus size={18} /> Add Restaurant
//             </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
//             {Object.entries(groupedData).map(([country, cities]) => (
//                 <div key={country} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
//                     <div onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))} className="flex items-center bg-white/95 p-4 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white border border-white/50 backdrop-blur-sm mb-2">
//                         <div className="p-2 bg-orange-100 rounded-lg text-orange-600 group-hover:text-orange-800"><ChevronDown size={20}/></div>
//                         <div className="flex-1"><h3 className="font-bold text-gray-800 text-lg flex items-center gap-2"><Globe size={18} className="text-orange-600" />{country}</h3></div>
//                         <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">{Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Places</span>
//                     </div>
//                     {expandedCountries[country] && (
//                         <div className="ml-4 pl-4 border-l-2 border-white/40 space-y-3">
//                             {Object.entries(cities).map(([city, items]) => (
//                                 <div key={city}>
//                                     <div className="flex items-center bg-white/95 p-3 rounded-lg gap-2 border border-white/30 backdrop-blur-sm mb-2"><MapPin size={16} className="text-red-800" /><span className="font-bold text-gray-900">{city}</span></div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-6 mb-4">
//                                         {items.map(item => {
//                                             // [CHANGE 3: LINKED SUPPLIER DISPLAY]
//                                             const sup = suppliers.find(s => s.id === (item as any).linkedSupplierId);
                                            
//                                             return (
//                                                 <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg group flex flex-col overflow-hidden">
//                                                     {/* RESTORED CARD DESIGN */}
//                                                     <div className="h-32 bg-gray-100 relative shrink-0 overflow-hidden">
//                                                         {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500"><Utensils size={48} className="text-white"/></div>}
//                                                         <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border border-purple-400">MULTI-CUISINE</div>
//                                                         <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded shadow text-xs font-bold flex items-center gap-1"><Star size={10} className="fill-yellow-700 text-yellow-700"/> {item.rating}</div>
//                                                     </div>
//                                                     <div className="p-4 flex-1 flex flex-col">
//                                                         <h4 className="font-bold text-gray-800 text-lg leading-tight mb-1">{item.restaurantName}</h4>
//                                                         <p className="text-xs text-gray-600 flex items-center gap-1 mb-2"><MapPin size={12}/> {item.address || `${item.city}, ${item.country}`}</p>
                                                        
//                                                         {/* [CHANGE 4: SUPPLIER BADGE] */}
//                                                         {sup && (
//                                                             <div className="mb-2 inline-flex items-center gap-1 bg-orange-50 text-orange-800 px-2 py-1 rounded text-[10px] border border-orange-100 w-fit">
//                                                                 <Briefcase size={10} /> <span className="font-bold truncate max-w-[150px]">By: {sup.name}</span>
//                                                             </div>
//                                                         )}

//                                                         <div className="flex flex-wrap gap-1 mb-3">
//                                                             <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">{item.menuType}</span>
//                                                             {(item.dietaryOptions || []).map(opt => (
//                                                                 <span key={opt} className="px-2 py-0.5 rounded bg-green-50 text-green-700 text-[10px] font-bold border border-green-100">{opt}</span>
//                                                             ))}
//                                                         </div>
                                                        
//                                                         <div className="mt-auto pt-2 border-t border-dashed border-gray-200">
//                                                             <p className="text-xs text-gray-500">Starts From: <span className="text-green-700 font-bold text-sm">{getPriceRange(item)}</span></p>
//                                                         </div>

//                                                         <div className="flex gap-2 mt-3">
//                                                             <button onClick={() => handleEdit(item)} className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"><Edit size={12}/> Edit Rates</button>
//                                                             <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"><Trash2 size={12}/> Delete</button>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             ))}
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
//            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
//               <div className="px-6 py-4 border-b border-gray-200 flex justify-between bg-gray-50 items-center">
//                  <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Restaurant' : 'Add New Restaurant'}</h2>
//                  <button onClick={() => setIsModalOpen(false)} className="hover:bg-gray-200 p-1 rounded-full"><X size={20}/></button>
//               </div>
              
//               <div className="flex border-b border-gray-200 px-6 gap-6 bg-white shrink-0">
//                   <button onClick={() => setActiveTab('info')} className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500'}`}>Basic Info & Menu</button>
//                   <button onClick={() => setActiveTab('rates')} className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'rates' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500'}`}>Pricing Matrix</button>
//               </div>

//               <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
//                   {/* TAB 1: BASIC INFO */}
//                   {activeTab === 'info' && (
//                       <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//                           <div className="md:col-span-4 space-y-4">
//                               <div onClick={() => fileInputRef.current?.click()} className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-100 hover:bg-white transition-colors relative overflow-hidden" style={{ backgroundImage: `url(${formData.images[0]})`, backgroundSize: 'cover' }}>
//                                   {!formData.images[0] && <div className="text-center text-gray-400"><ImageIcon className="mx-auto mb-2"/><span className="text-xs font-bold">Upload Photo</span></div>}
//                                   <input ref={fileInputRef} type="file" hidden onChange={handleImageUpload}/>
//                               </div>
//                               <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
//                                 <label className="text-xs font-bold text-orange-800 mb-1 flex items-center gap-1"><Star size={12} className="fill-yellow-600 text-yellow-600"/> Rating</label>
//                                 <input type="number" step="0.1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full p-2 border border-orange-200 rounded font-bold text-orange-900"/>
//                               </div>
//                           </div>

//                           <div className="md:col-span-8 space-y-4">
//                               {/* [CHANGE 5: SUPPLIER SECTION INJECTED HERE] */}
//                               <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex gap-4 items-start">
//                                   <div className="flex-1">
//                                       <label className="block text-xs font-bold text-orange-900 mb-2 flex items-center gap-1"><Briefcase size={14} /> Fulfillment Partner (Meal)</label>
//                                       <select className="w-full p-2.5 border border-orange-200 rounded-lg text-sm bg-white" value={formData.linkedSupplierId || ""} onChange={(e) => setFormData({...formData, linkedSupplierId: e.target.value})}>
//                                           <option value="">-- Direct / Unknown --</option>
//                                           {availableSuppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.city}) {s.isPreferred ? '★' : ''}</option>)}
//                                       </select>
//                                   </div>
//                                   {selectedSupplierData && (
//                                       <div className="flex-1 bg-white p-3 rounded-lg border border-orange-100 shadow-sm text-xs">
//                                           <div className="font-bold text-gray-800 mb-2 border-b border-gray-100 pb-1 flex justify-between">
//                                               <span>{selectedSupplierData.contactPerson}</span>
//                                               <span className="text-orange-600 font-bold">{selectedSupplierData.paymentTerms}</span>
//                                           </div>
//                                           <div className="grid grid-cols-1 gap-1 text-gray-500">
//                                               <div className="flex items-center gap-1"><Phone size={10}/> {selectedSupplierData.phone}</div>
//                                               <div className="flex items-center gap-1 truncate"><Mail size={10}/> {selectedSupplierData.email}</div>
//                                               <div className="font-bold text-orange-700 flex items-center gap-1"><DollarSign size={10}/> {selectedSupplierData.currency || 'USD'}</div>
//                                           </div>
//                                       </div>
//                                   )}
//                               </div>

//                               {/* RESTORED ALL OLD FIELDS */}
//                               <div className="grid grid-cols-2 gap-4">
//                                   <div><label className="text-xs font-bold text-gray-600 mb-1 block">Restaurant Name *</label><input type="text" value={formData.restaurantName} onChange={e => setFormData({...formData, restaurantName: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg font-bold" placeholder="e.g. Curry House"/></div>
//                                   <div><label className="text-xs font-bold text-gray-600 mb-1 block">Cuisine Type</label><select value={formData.cuisine} onChange={e => setFormData({...formData, cuisine: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg bg-white"><option>Multi-Cuisine</option><option>Italian</option><option>Indian</option><option>Chinese</option></select></div>
//                               </div>
//                               <div className="grid grid-cols-2 gap-4">
//                                   <div><label className="text-xs font-bold text-gray-600 mb-1 block">City *</label><input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg"/></div>
//                                   <div><label className="text-xs font-bold text-gray-600 mb-1 block">Country *</label><input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg"/></div>
//                               </div>
//                               <div><label className="text-xs font-bold text-gray-600 mb-1 block">Full Address</label><input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Street, Landmark..."/></div>
                              
//                               <div className="grid grid-cols-2 gap-4">
//                                   <div><label className="text-xs font-bold text-gray-600 mb-1 block">Menu Style</label><select value={formData.menuType} onChange={e => setFormData({...formData, menuType: e.target.value as any})} className="w-full p-2 border border-gray-300 rounded-lg bg-white"><option>Buffet</option><option>Fixed Menu</option><option>A La Carte</option></select></div>
//                                   <div>
//                                       <label className="text-xs font-bold text-gray-600 mb-1 block">Dietary Options</label>
//                                       <div className="flex gap-2">
//                                           {['Veg', 'Non-Veg', 'Jain'].map(opt => (
//                                               <button key={opt} onClick={() => toggleDietary(opt)} className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${formData.dietaryOptions?.includes(opt) ? 'bg-green-100 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>{opt}</button>
//                                           ))}
//                                       </div>
//                                   </div>
//                               </div>
//                               <div><label className="text-xs font-bold text-gray-600 mb-1 block">Menu Inclusions</label><textarea rows={3} value={formData.inclusions} onChange={e => setFormData({...formData, inclusions: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. 1 Soup, 2 Starters..."/></div>
//                           </div>
//                       </div>
//                   )}

//                   {/* TAB 2: PRICING MATRIX (RESTORED FULL LOGIC) */}
//                   {activeTab === 'rates' && (
//                       <div className="space-y-6">
//                           {formData.rateCards.length === 0 ? (
//                               <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-xl">
//                                   <Calendar className="mx-auto text-gray-300 mb-3" size={48}/><p className="text-gray-500 font-medium mb-4">No rates configured.</p>
//                                   <button onClick={addRateCard} className="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700 transition-colors">+ Add Rate Card</button>
//                               </div>
//                           ) : (
//                               formData.rateCards.map((card, cIndex) => (
//                                   <div key={card.year} className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2">
//                                       <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 flex justify-between items-center sticky top-0 z-10">
//                                           <div className="flex items-center gap-3"><div className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-bold shadow-sm">{card.year}</div><span className="text-xs text-gray-600 font-bold uppercase">Rate Card</span></div>
//                                           <button onClick={() => removeRateCard(card.year)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"><Trash2 size={16}/></button>
//                                       </div>
//                                       <div className="overflow-x-auto">
//                                           <table className="w-full text-sm">
//                                               <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
//                                                   <tr>
//                                                       <th className="p-3 text-left w-24">Month</th>
//                                                       <th className="p-3 text-center border-l border-gray-200 bg-yellow-50/50"><div className="flex items-center justify-center gap-1 text-yellow-700"><Sun size={14}/> Lunch</div></th>
//                                                       <th className="p-3 text-center border-l border-gray-200 bg-indigo-50/50"><div className="flex items-center justify-center gap-1 text-indigo-700"><Moon size={14}/> Dinner</div></th>
//                                                   </tr>
//                                               </thead>
//                                               <tbody className="divide-y divide-gray-100">
//                                                   {Object.keys(card.rates).map((month) => (
//                                                       <tr key={month} className="hover:bg-gray-50 transition-colors">
//                                                           <td className="p-3 font-bold text-gray-500 uppercase text-xs">{month}</td>
//                                                           <td className="p-2 border-l border-gray-100 bg-yellow-50/30"><div className="flex gap-2"><div className="relative flex-1"><span className="absolute left-2 top-2 text-[10px] text-gray-500 uppercase">Ad:</span><input type="number" value={card.rates[month].lunchAdult} onChange={e => updateRate(cIndex, month, 'lunchAdult', parseFloat(e.target.value) || 0)} className="w-full p-2 pl-8 text-xs font-bold border border-yellow-200 rounded outline-none"/></div><div className="relative flex-1"><span className="absolute left-2 top-2 text-[10px] text-gray-500 uppercase">Ch:</span><input type="number" value={card.rates[month].lunchChild} onChange={e => updateRate(cIndex, month, 'lunchChild', parseFloat(e.target.value) || 0)} className="w-full p-2 pl-8 text-xs font-bold border border-yellow-200 rounded outline-none"/></div></div></td>
//                                                           <td className="p-2 border-l border-gray-100 bg-indigo-50/30"><div className="flex gap-2"><div className="relative flex-1"><span className="absolute left-2 top-2 text-[10px] text-gray-500 uppercase">Ad:</span><input type="number" value={card.rates[month].dinnerAdult} onChange={e => updateRate(cIndex, month, 'dinnerAdult', parseFloat(e.target.value) || 0)} className="w-full p-2 pl-8 text-xs font-bold border border-indigo-200 rounded outline-none"/></div><div className="relative flex-1"><span className="absolute left-2 top-2 text-[10px] text-gray-500 uppercase">Ch:</span><input type="number" value={card.rates[month].dinnerChild} onChange={e => updateRate(cIndex, month, 'dinnerChild', parseFloat(e.target.value) || 0)} className="w-full p-2 pl-8 text-xs font-bold border border-indigo-200 rounded outline-none"/></div></div></td>
//                                                       </tr>
//                                                   ))}
//                                               </tbody>
//                                           </table>
//                                       </div>
//                                   </div>
//                               ))
//                           )}
//                           <button onClick={addRateCard} className="w-full py-3 border-2 border-dashed border-orange-300 bg-orange-50 text-orange-700 font-bold rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"><PlusCircle size={20}/> Add Next Year Rate Card</button>
//                       </div>
//                   )}
//               </div>

//               <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0 rounded-b-xl">
//                   <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
//                   <button onClick={handleSave} className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2"><Save size={18}/> Save Meal</button>
//               </div>
//            </div>
//         </div>
//       )}
//    </div>
//   );
// } 























































































































































"use client";

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MapPin, Utensils, Star, 
  Trash2, X, Save, Image as ImageIcon, 
  ChevronDown, ChevronRight, Globe, 
  Edit, DollarSign, Briefcase, Phone, Mail, CreditCard,
  Loader2
} from 'lucide-react';
import { useSRM } from '@/app/context/SRMContext';
import { MealData, saveMeal, deleteMeal } from '@/utils/srmStorage';

export default function MealSRMPage() {
  const { meals, suppliers, refreshAll, searchText, isLoading } = useSRM();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // NEW STATE
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});

  const initialForm: MealData = {
    id: '', 
    restaurantName: '', 
    cuisine: 'Multi-Cuisine', 
    type: 'Standard', 
    city: '', 
    country: '', 
    address: '',
    rating: '4.0', 
    images: [], 
    menuType: 'Buffet',
    dietaryOptions: [], 
    inclusions: '', 
    description: '',
    status: 'Active', 
    createdAt: '', 
    updatedAt: '',
    linkedSupplierId: '' 
  };
  const [formData, setFormData] = useState<MealData>(initialForm);

  const availableSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const basicCheck = s.status === 'Active' && s.services.includes('Meal');
      const cityCheck = formData.city 
        ? s.city.toLowerCase().trim() === formData.city.toLowerCase().trim() 
        : true; 
      return basicCheck && cityCheck;
    });
  }, [suppliers, formData.city]);

  useEffect(() => {
     if(isModalOpen && formData.city && !formData.linkedSupplierId) {
        const preferred = suppliers.find(s => 
           s.status === 'Active' &&
           s.services.includes('Meal') &&
           s.city.toLowerCase().trim() === formData.city.toLowerCase().trim() &&
           s.isPreferred
        );
        if(preferred) {
           setFormData(prev => ({...prev, linkedSupplierId: preferred.id}));
        }
     }
  }, [formData.city, isModalOpen, suppliers]);

  const selectedSupplierData = suppliers.find(s => s.id === formData.linkedSupplierId);

  const groupedData = useMemo(() => {
    const filtered = meals.filter(m => 
      (m.restaurantName || "").toLowerCase().includes(searchText.toLowerCase()) || 
      (m.city || "").toLowerCase().includes(searchText.toLowerCase())
    );
    const groups: Record<string, Record<string, MealData[]>> = {};
    filtered.forEach(item => {
      const country = (item.country || "Uncategorized").trim();
      const city = (item.city || "General").trim();
      if (!groups[country]) groups[country] = {};
      if (!groups[country][city]) groups[country][city] = [];
      groups[country][city].push(item);
    });
    return Object.keys(groups).sort().reduce((acc, country) => {
        acc[country] = groups[country];
        return acc;
    }, {} as Record<string, Record<string, MealData[]>>);
  }, [meals, searchText]);

  useEffect(() => {
    if (searchText) {
       const allCountries = Object.keys(groupedData);
       setExpandedCountries(allCountries.reduce((acc, key) => ({...acc, [key]: true}), {}));
       const newExpCities: Record<string, boolean> = {};
       allCountries.forEach(c => {
           Object.keys(groupedData[c]).forEach(city => newExpCities[`${c}-${city}`] = true);
       });
       setExpandedCities(newExpCities);
    }
  }, [searchText, groupedData]);

  const handleEdit = (item: MealData) => { 
    setFormData(JSON.parse(JSON.stringify(item))); 
    setIsModalOpen(true); 
  };

  // CHANGED: Async
  const handleDelete = async (id: string) => { 
    if (confirm('Delete this restaurant?')) { 
      await deleteMeal(id); 
      await refreshAll(); 
    } 
  };

  // CHANGED: Async
  // const handleSave = async () => {
  //   if (!formData.restaurantName || !formData.city) return alert("Restaurant Name and City are required");
  //   setIsSaving(true);
  //   const success = await saveMeal({...formData, city: formData.city.trim(), country: formData.country.trim()});
  //   if(success) {
  //     await refreshAll();
  //     setIsModalOpen(false);
  //   } else {
  //     alert("Failed to save.");
  //   }
  //   setIsSaving(false);
  // };

  // CHANGED: Async with Error Handling and Empty String Fix
  const handleSave = async () => {
    if (!formData.restaurantName || !formData.city) return alert("Restaurant Name and City are required");
    setIsSaving(true);
    
    try {
      const cleanData = {
          ...formData,
          city: formData.city.trim(),
          country: formData.country.trim()
      };

      // 👇 THE CRITICAL FIX: Prevent empty string from crashing Mongoose
      if (!cleanData.linkedSupplierId || cleanData.linkedSupplierId === "") {
          delete cleanData.linkedSupplierId;
      }

      const success = await saveMeal(cleanData);
      
      if(success) {
        await refreshAll();
        setIsModalOpen(false);
      } else {
        alert("Failed to save. Check your database connection.");
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save due to an unexpected error.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, images: [reader.result as string] }));
      reader.readAsDataURL(file);
    }
  };

  const toggleDietary = (option: string) => {
    const current = formData.dietaryOptions || [];
    if (current.includes(option)) {
      setFormData({...formData, dietaryOptions: current.filter(o => o !== option)});
    } else {
      setFormData({...formData, dietaryOptions: [...current, option]});
    }
  };

  return (
   <div className="h-full w-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 z-0 bg-black/50 backdrop-blur-sm" />

      <div className="flex-1 flex flex-col relative z-10 h-full">
        <div className="bg-white/95 border-b border-white/50 px-6 py-4 flex justify-between items-center backdrop-blur-md shadow-sm z-10">
            <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Utensils className="text-orange-600"/> Meal Inventory</h1>
                <p className="text-xs text-gray-600 font-medium">Manage restaurants, menus, and details.</p>
            </div>
            <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
                <Plus size={18} /> Add Restaurant
            </button>
        </div>

{/* =========================================================================
            HIERARCHICAL LIST VIEW (Animated & Modernized for Meals)
            ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-white">
                    <Loader2 size={40} className="animate-spin mb-4 text-orange-300" />
                    <p className="font-medium text-lg drop-shadow-md">Loading Restaurants...</p>
                </div>
            ) : Object.keys(groupedData).length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-gray-600 bg-white/40 rounded-xl border border-white/50 backdrop-blur-sm">
                    <Utensils size={48} className="opacity-50 mb-2"/>
                    <p className="font-bold">No restaurants found.</p>
                 </div>
            ) : (
                Object.entries(groupedData).map(([country, cities]) => (
                    <motion.div layout key={country} className="mb-2">
                        
                        {/* 1. COUNTRY HEADER */}
                        <motion.div 
                            onClick={() => setExpandedCountries(prev => ({...prev, [country]: !prev[country]}))}
                            className="flex items-center bg-white/95 p-4 rounded-xl gap-3 cursor-pointer group shadow-sm hover:bg-white transition-all border border-white/50 backdrop-blur-sm"
                        >
                            <motion.div animate={{ rotate: expandedCountries[country] ? 90 : 0 }} className="p-2 bg-orange-100 rounded-lg text-orange-600 group-hover:text-orange-800 transition-colors">
                                <ChevronRight size={20}/>
                            </motion.div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                    <Globe size={18} className="text-orange-600" /> {country}
                                </h3>
                            </div>
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                                {Object.values(cities).reduce((acc, list) => acc + list.length, 0)} Places
                            </span>
                        </motion.div>

                        {/* 2. CITIES EXPANSION */}
                        <AnimatePresence initial={false}>
                            {expandedCountries[country] && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }} 
                                    animate={{ height: "auto", opacity: 1 }} 
                                    exit={{ height: 0, opacity: 0 }} 
                                    className="overflow-hidden"
                                >
                                    <div className="ml-4 pl-4 border-l-2 border-white/40 space-y-3 pt-3 pb-2">
                                        {Object.entries(cities).map(([city, items]) => {
                                            const cityKey = `${country}-${city}`;
                                            return (
                                                <div key={city}>
                                                    
                                                    {/* CITY HEADER */}
                                                    <div 
                                                        onClick={() => setExpandedCities(prev => ({...prev, [cityKey]: !prev[cityKey]}))}
                                                        className="flex items-center bg-white/95 p-3 rounded-lg gap-2 cursor-pointer hover:bg-white/80 transition-all border border-white/30 backdrop-blur-sm shadow-sm"
                                                    >
                                                        <ChevronRight size={16} className={`text-gray-500 transition-transform ${expandedCities[cityKey] ? 'rotate-90' : ''}`}/>
                                                        <MapPin size={18} className="text-red-700" />
                                                        <span className="font-bold text-gray-900">{city}</span>
                                                        <span className="text-xs text-gray-900 bg-orange-100 px-2 py-0.5 rounded-full">
                                                            {items.length}
                                                        </span>
                                                    </div>

                                                    {/* 3. RESTAURANT CARDS GRID (Animated) */}
                                                    <AnimatePresence initial={false}>
                                                        {expandedCities[cityKey] && (
                                                            <motion.div 
                                                                initial={{ height: 0, opacity: 0 }} 
                                                                animate={{ height: "auto", opacity: 1 }} 
                                                                exit={{ height: 0, opacity: 0 }} 
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ml-6 mb-4 mt-3">
                                                                    {items.map(item => (
                                                                        <motion.div 
                                                                            layout 
                                                                            initial={{ opacity: 0, y: 10 }} 
                                                                            animate={{ opacity: 1, y: 0 }} 
                                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                                            whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.15)" }}
                                                                            key={item.id} 
                                                                            className="bg-white rounded-2xl border border-gray-200 shadow-md flex flex-col overflow-hidden relative"
                                                                        >
                                                                            {/* Card Image / Gradient Header */}
                                                                            <div className="h-36 w-full relative shrink-0 overflow-hidden flex items-center justify-center bg-gradient-to-br from-orange-500 to-rose-500">
                                                                                {item.images?.[0] ? (
                                                                                    <img src={item.images[0]} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" alt={item.restaurantName}/>
                                                                                ) : (
                                                                                    <Utensils size={56} className="text-white opacity-90 drop-shadow-md"/>
                                                                                )}
                                                                                
                                                                                {/* Cuisine Badge (Top Left) */}
                                                                                <div className="absolute top-3 left-3 bg-[#8b5cf6] text-white px-2 py-1 rounded text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
                                                                                    {item.cuisine || 'MULTI-CUISINE'}
                                                                                </div>
                                                                                
                                                                                {/* Rating Badge (Top Right) */}
                                                                                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded shadow-sm text-[11px] font-bold flex items-center gap-1 text-gray-800">
                                                                                    <Star size={12} className="fill-[#f59e0b] text-[#f59e0b]"/> {item.rating || 'N/A'}
                                                                                </div>
                                                                            </div>

                                                                            {/* Card Body */}
                                                                            <div className="p-5 pt-4 flex-1 flex flex-col bg-white">
                                                                                <h4 className="font-bold text-gray-900 text-[18px] leading-tight mb-1 truncate" title={item.restaurantName}>
                                                                                    {item.restaurantName}
                                                                                </h4>
                                                                                <div className="flex items-center text-[11px] text-gray-500 font-medium mb-3">
                                                                                    <MapPin size={12} className="mr-1 shrink-0" />
                                                                                    <span className="truncate">{item.address || `${item.city}, ${item.country}`}</span>
                                                                                </div>
                                                                                
                                                                                {/* Tags (Menu Type & Dietary) */}
                                                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                                                    {item.menuType && (
                                                                                        <span className="px-2 py-0.5 rounded bg-[#eff6ff] text-[#2563eb] text-[10px] font-bold border border-[#bfdbfe]">
                                                                                            {item.menuType}
                                                                                        </span>
                                                                                    )}
                                                                                    {(item.dietaryOptions || []).map(opt => (
                                                                                        <span key={opt} className="px-2 py-0.5 rounded bg-[#f0fdf4] text-[#16a34a] text-[10px] font-bold border border-[#bbf7d0]">
                                                                                            {opt}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                                
                                                                                {/* Action Buttons */}
                                                                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-3">
                                                                                    <button onClick={() => handleEdit(item)} className="flex-1 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                                                                                        <Edit size={14}/> Edit Details
                                                                                    </button>
                                                                                    <button onClick={() => handleDelete(item.id as string)} className="flex-1 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                                                                                        <Trash2 size={14}/> Delete
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))
            )}
        </div>
        {/* =========================================================================
            END HIERARCHICAL LIST VIEW
            ========================================================================= */}
      
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh]">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between bg-gray-50 items-center">
                 <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Restaurant' : 'Add New Restaurant'}</h2>
                 <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="hover:bg-gray-200 p-1 rounded-full disabled:opacity-50"><X size={20}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-4 space-y-4">
                          <div onClick={() => fileInputRef.current?.click()} className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-100 hover:bg-white transition-colors relative overflow-hidden" style={{ backgroundImage: `url(${formData.images[0]})`, backgroundSize: 'cover' }}>
                              {!formData.images[0] && <div className="text-center text-gray-400"><ImageIcon className="mx-auto mb-2"/><span className="text-xs font-bold">Upload Photo</span></div>}
                              <input ref={fileInputRef} type="file" hidden onChange={handleImageUpload}/>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                            <label className="text-xs font-bold text-orange-800 mb-1 flex items-center gap-1"><Star size={12} className="fill-yellow-600 text-yellow-600"/> Rating</label>
                            <input type="number" step="0.1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full p-2 border border-orange-200 rounded font-bold text-orange-900"/>
                          </div>
                      </div>

                      <div className="md:col-span-8 space-y-4">
                    
                          <div className="grid grid-cols-2 gap-4">
                              <div><label className="text-xs font-bold text-gray-600 mb-1 block">Restaurant Name *</label><input type="text" value={formData.restaurantName} onChange={e => setFormData({...formData, restaurantName: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg font-bold" placeholder="e.g. Curry House"/></div>
                              <div><label className="text-xs font-bold text-gray-600 mb-1 block">Cuisine Type</label><select value={formData.cuisine} onChange={e => setFormData({...formData, cuisine: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg bg-white"><option>Multi-Cuisine</option><option>Italian</option><option>Indian</option><option>Chinese</option><option>None</option></select></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div><label className="text-xs font-bold text-gray-600 mb-1 block">City *</label><input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg"/></div>
                              <div><label className="text-xs font-bold text-gray-600 mb-1 block">Country *</label><input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg"/></div>
                          </div>
                          <div><label className="text-xs font-bold text-gray-600 mb-1 block">Full Address</label><input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Street, Landmark..."/></div>
                          
                          <div className="grid grid-cols-2 gap-4">
                              <div><label className="text-xs font-bold text-gray-600 mb-1 block">Menu Style</label><select value={formData.menuType} onChange={e => setFormData({...formData, menuType: e.target.value as any})} className="w-full p-2 border border-gray-300 rounded-lg bg-white"><option>Buffet</option><option>Fixed Menu</option><option>A La Carte</option></select></div>
                              <div>
                                  <label className="text-xs font-bold text-gray-600 mb-1 block">Dietary Options</label>
                                  <div className="flex gap-2">
                                      {['Veg', 'Non-Veg', 'Jain'].map(opt => (
                                          <button key={opt} type="button" onClick={() => toggleDietary(opt)} className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${formData.dietaryOptions?.includes(opt) ? 'bg-green-100 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>{opt}</button>
                                      ))}
                                  </div>
                              </div>
                          </div>
                          <div><label className="text-xs font-bold text-gray-600 mb-1 block">Menu Inclusions</label><textarea rows={3} value={formData.inclusions} onChange={e => setFormData({...formData, inclusions: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. 1 Soup, 2 Starters..."/></div>
                      </div>
                  </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0 rounded-b-xl">
                  <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">Cancel</button>
                  <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 disabled:opacity-70">
                    {isSaving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18}/> Save Meal</>}
                  </button>
              </div>
           </div>
        </div>
      )}
   </div>
  );
}