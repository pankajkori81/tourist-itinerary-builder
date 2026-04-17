

// "use client";

// import React, { useState } from "react";
// import { ExternalLink, Users, ArrowRight } from "lucide-react"; // Added Icons
// import { useRouter } from "next/navigation";
// import { useItinerary } from "@/app/context/ItineraryContext";

// // --- CONSTANTS ---
// const TRIP_TYPES = ["Independent-Join In", "Group Tour", "Private Tour"];

// const TRIP_STYLES = [
//   "None", "Active", "Architecture", "Adventure", "Beach Stay", "Coastal Trip", "Food & Drink", 
//   "Culture & History", "Explore City", "Family Vacation", "Festival", "Nature & Wildlife", 
//   "Photography", "Rail Journey", "Solo Vacation", "Sports"
// ];

// const DESTINATION_COUNTRIES: Record<string, string[]> = {
//   "India & Subcontinent": ["India", "Sri Lanka", "Maldives"],
//   "Europe": ["United Kingdom", "France", "Germany", "Switzerland", "Italy" , "Austria"],
//   "Middle East": ["United Arab Emirates"],
//   "North America": ["United States of America", "Canada"],
// };

// export default function CreateItineraryPage() {
//   const router = useRouter();
//   const { itineraryData, updateItineraryData } = useItinerary();
//   const [showCountryDropdown, setShowCountryDropdown] = useState(false);

//   // --- HANDLERS ---

//   const updateField = (field: keyof typeof itineraryData, value: any) => {
//     updateItineraryData({ [field]: value });
//   };

//   const toggleCountry = (country: string) => {
//     const currentList = itineraryData.selectedCountries || [];
//     let newList;
    
//     if (currentList.includes(country)) {
//       newList = currentList.filter(c => c !== country);
//     } else {
//       newList = [...currentList, country];
//     }
    
//     updateItineraryData({ selectedCountries: newList });
//   };

//   const handleMasterItineraryChange = (isMaster: boolean) => {
//     if (isMaster) {
//       updateItineraryData({
//         isMasterItinerary: true,
//         creatingFor: 'Library',
//         showFlightDetails: false,
//         showTravelerDetails: false
//       });
//     } else {
//       updateItineraryData({
//         isMasterItinerary: false
//       });
//     }
//   };

//   const handleNextStep = () => {
//     // Basic validation before moving forward (optional)
//     if (!itineraryData.tripName) {
//         alert("Please enter a Trip Name before proceeding.");
//         return;
//     }
//     router.push('/dashboard/itinerary/routing');
//   };

//   return (
//     <div className="p-4 md:p-6 h-full overflow-y-auto pb-20"> {/* Added pb-20 for scrolling space */}
//       <div className="max-w-5xl mx-auto"> {/* Reduced max-width slightly for tighter look */}
        
//         <div className="bg-white/5 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-6"> {/* Reduced padding from p-8 to p-6 */}
          
//           {/* 1. MASTER ITINERARY TOGGLE */}
//           <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-500/30">
//             <div className="flex items-center gap-4">
//               <label className="block text-base font-bold text-white tracking-wide">
//                 Creating Master Itinerary?
//               </label>
//               <div className="flex gap-4 bg-black/20 p-1.5 rounded-lg">
//                 <label className="flex items-center gap-2 cursor-pointer px-2">
//                   <input 
//                     type="radio" 
//                     checked={itineraryData.isMasterItinerary === true} 
//                     onChange={() => handleMasterItineraryChange(true)} 
//                     className="w-4 h-4 text-blue-500 accent-blue-500" 
//                   />
//                   <span className="text-white text-sm font-medium">YES</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer px-2">
//                   <input 
//                     type="radio" 
//                     checked={itineraryData.isMasterItinerary === false} 
//                     onChange={() => handleMasterItineraryChange(false)} 
//                     className="w-4 h-4 text-blue-500 accent-blue-500" 
//                   />
//                   <span className="text-white text-sm font-medium">NO</span>
//                 </label>
//               </div>
//             </div>
            
         
//           </div>

//           {/* 2. IDENTIFIERS ROW */}
//           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
//             {/* Trip ID (Small col) */}
//             <div className="md:col-span-4">
//               <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
//                 Trip ID #
//               </label>
//               <input
//                 type="text"
//                 // value={itineraryData.tripId}
                
//                 disabled
//                 className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-600 rounded-lg text-gray-400 font-mono text-sm cursor-not-allowed"
//               />
//             </div>

//             {/* Country Selector (Larger col) */}
//             <div className="md:col-span-8 relative">
//               <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
//                 Destination Country <span className="text-red-400">*</span>
//               </label>
//               <div
//                 onClick={() => setShowCountryDropdown(!showCountryDropdown)}
//                 className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center hover:border-blue-500 transition-colors"
//               >
//                 <span className={`text-sm ${itineraryData.selectedCountries.length > 0 ? "text-gray-900 font-medium" : "text-gray-400"}`}>
//                   {itineraryData.selectedCountries.length > 0 
//                     ? itineraryData.selectedCountries.join(", ") 
//                     : "Select Destination Countries"}
//                 </span>
//                 <span className="text-gray-400 text-xs">▼</span>
//               </div>

//               {/* Dropdown Menu */}
//               {showCountryDropdown && (
//                 <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-h-60 overflow-y-auto p-3 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-100">
//                   {Object.entries(DESTINATION_COUNTRIES).map(([region, countries]) => (
//                     <div key={region}>
//                       <h4 className="font-bold text-[10px] text-blue-600 uppercase mb-1 border-b border-gray-100 pb-1">
//                         {region}
//                       </h4>
//                       <div className="space-y-0.5">
//                         {countries.map(country => (
//                           <label key={country} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-md cursor-pointer transition-colors group">
//                             <input 
//                               type="checkbox" 
//                               checked={itineraryData.selectedCountries.includes(country)}
//                               onChange={() => toggleCountry(country)}
//                               className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                             />
//                             <span className="text-xs text-gray-700 group-hover:text-gray-900">{country}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* 3. TRIP NAME & TRAVELERS (NEW SECTION) */}
//           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
            
//             {/* Trip Name takes up 8 columns */}
//             <div className="md:col-span-8">
//               <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
//                 Trip Name <span className="text-red-400">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={itineraryData.tripName}
//                 onChange={(e) => updateField("tripName", e.target.value)}
//                 placeholder="e.g. Royal Rajasthan Heritage Tour 2025"
//                 className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 text-sm font-medium"
//               />
//             </div>

//             {/* No. of Travelers takes up 4 columns */}
//             <div className="md:col-span-4">
//               <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
//                  No. of Travelers <Users size={12} className="text-blue-400" />
//               </label>
//               <div className="relative">
//                 <input
//                   type="number"
//                   min="1"
//                   value={itineraryData.numberOfTravelers}
//                   onChange={(e) => updateField("numberOfTravelers", parseInt(e.target.value) || 1)}
//                   className="w-full px-3 py-2.5 pl-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 text-sm font-bold"
//                 />
//                 <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">Pax</span>
//               </div>
//             </div>
//           </div>

//           {/* 4. TYPE & STYLE */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
//                 Trip Type {!itineraryData.isMasterItinerary && <span className="text-red-400">*</span>}
//               </label>
//               <select
//                 value={itineraryData.tripType}
//                 onChange={(e) => updateField("tripType", e.target.value)}
//                 disabled={itineraryData.isMasterItinerary}
//                 className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm ${
//                   itineraryData.isMasterItinerary 
//                     ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
//                     : "bg-white text-gray-900"
//                 }`}
//               >
//                 <option value="">Select Trip Type</option>
//                 {TRIP_TYPES.map((type) => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
//                 Trip Style
//               </label>
//               <select
//                 value={itineraryData.tripStyle}
//                 onChange={(e) => updateField("tripStyle", e.target.value)}
//                 disabled={itineraryData.isMasterItinerary}
//                 className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm ${
//                   itineraryData.isMasterItinerary 
//                     ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
//                     : "bg-white text-gray-900"
//                 }`}
//               >
//                 <option value="">Select Trip Style</option>
//                 {TRIP_STYLES.map((style) => (
//                   <option key={style} value={style}>{style}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* 5. PACKAGE TYPE & CREATING FOR ROW */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Package Type */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
//                 Package Type
//               </label>
//               <div className="flex gap-3">
//                 <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${
//                   itineraryData.packageType === "land" 
//                     ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500" 
//                     : "bg-white border-gray-300 hover:bg-gray-50"
//                 } ${itineraryData.isMasterItinerary ? "opacity-60 cursor-not-allowed" : ""}`}>
//                   <input
//                     type="radio"
//                     value="land"
//                     checked={itineraryData.packageType === "land"}
//                     onChange={(e) => updateField("packageType", e.target.value)}
//                     disabled={itineraryData.isMasterItinerary}
//                     className="w-3.5 h-3.5 text-blue-600 accent-blue-600 hidden" // Hidden radio, styled container
//                   />
//                   <span className={`text-sm font-medium ${itineraryData.packageType === "land" ? "text-blue-700" : "text-gray-600"}`}>Land Only</span>
//                 </label>

//                 <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${
//                   itineraryData.packageType === "flight" 
//                     ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500" 
//                     : "bg-white border-gray-300 hover:bg-gray-50"
//                 } ${itineraryData.isMasterItinerary ? "opacity-60 cursor-not-allowed" : ""}`}>
//                   <input
//                     type="radio"
//                     value="flight"
//                     checked={itineraryData.packageType === "flight"}
//                     onChange={(e) => updateField("packageType", e.target.value)}
//                     disabled={itineraryData.isMasterItinerary}
//                     className="w-3.5 h-3.5 text-blue-600 accent-blue-600 hidden"
//                   />
//                   <span className={`text-sm font-medium ${itineraryData.packageType === "flight" ? "text-blue-700" : "text-gray-600"}`}>With Flight</span>
//                 </label>
//               </div>
//             </div>

//             {/* Creating For */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
//                 Creating For
//               </label>
//               <div className="flex gap-2">
//                 {['Library', 'agent', 'guest'].map((type) => {
//                   const isLibrary = type === 'Library';
//                   const isDisabled = !isLibrary && itineraryData.isMasterItinerary;
//                   const isSelected = itineraryData.creatingFor === type;

//                   return (
//                     <label 
//                       key={type} 
//                       className={`flex-1 flex items-center justify-center gap-2 px-2 py-2.5 rounded-lg border transition-all ${
//                         isSelected
//                           ? "bg-green-50 border-green-500 ring-1 ring-green-500" 
//                           : "bg-white border-gray-300"
//                       } ${isDisabled ? "bg-gray-200 border-gray-300 cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-gray-50"}`}
//                     >
//                       <input
//                         type="radio"
//                         value={type}
//                         checked={isSelected}
//                         onChange={(e) => {
//                           updateItineraryData({ 
//                             creatingFor: e.target.value,
//                             showTravelerDetails: e.target.value !== 'Library'
//                           });
//                         }}
//                         disabled={isDisabled}
//                         className="hidden" // Hidden input
//                       />
//                       <span className={`text-sm capitalize font-medium ${isSelected ? "text-green-800" : "text-gray-600"}`}>
//                         {type === 'agent' ? 'Agent' : type}
//                       </span>
//                     </label>
//                   );
//                 })}
//               </div>
//             </div>

//           </div>

//           {/* 6. NEXT STEP BUTTON (Global Action) */}
//           <div className="mt-10 pt-6 border-t border-white/10 flex justify-end">
//             <button
//               onClick={handleNextStep}
//               className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02]"
//             >
//               Next Step: Routing
//               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// } 


































































































"use client";

import React, { useState, useEffect } from "react";
import { Users, ArrowRight } from "lucide-react"; 
// import { useRouter } from "next/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { useItinerary } from "@/app/context/ItineraryContext";


// --- UPDATED CONSTANTS ---

// New: Trip Categories
const TRIP_CATEGORIES = ["Classic", "Premium", "Deluxe", "Luxury"];

// Updated: Trip Styles
const TRIP_STYLES = ["Join-in / Shared", "Small Group", "Large Group", "Tailor Made"];

// New: Trip Experiences
const TRIP_EXPERIENCES = [
  "Architecture", "Festival", "Culture", "Photography", 
  "Culinary", "Sports", "Wildlife", "Signature (First Time Traveler)"
];

// const DESTINATION_COUNTRIES: Record<string, string[]> = {
//   "India & Subcontinent": ["India", "Sri Lanka", "Maldives"],
//   "Europe": ["United Kingdom", "France", "Germany", "Switzerland", "Italy", "Austria"],
//   "Middle East": ["United Arab Emirates"],
//   "North America": ["United States of America", "Canada"],
// };


const DESTINATION_COUNTRIES: Record<string, string[]> = {
  "India & Subcontinent": [
    "India", "Sri Lanka", "Maldives", "Nepal", "Bhutan", "Bangladesh"
  ],
  "Europe": [
    "United Kingdom", "France", "Germany", "Switzerland", "Italy", "Austria", 
    "Greece", "Spain", "Portugal", "Netherlands", "Belgium", "Ireland", "Croatia"
  ],
  "Middle East": [
    "United Arab Emirates", "Saudi Arabia", "Qatar", "Oman", "Turkey", "Jordan"
  ],
  "North America": [
    "United States of America", "Canada", "Mexico"
  ],
  "Southeast Asia": [
    "Thailand", "Vietnam", "Singapore", "Malaysia", "Indonesia", "Philippines"
  ],
  "Oceania": [
    "Australia", "New Zealand", "Fiji"
  ],
  "Africa": [
    "South Africa", "Egypt", "Morocco", "Kenya", "Tanzania"
  ]
};


export default function CreateItineraryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const { itineraryData, updateItineraryData } = useItinerary();
  const { itineraryData, updateItineraryData, completeStep } = useItinerary(); // Destructure completeStep
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);


  // 👈 NEW LOGIC: Pre-fill data from CRM Magic Button
  useEffect(() => {
     const clientName = searchParams.get('clientName');
     const pax = searchParams.get('pax');
     const dest = searchParams.get('dest');

     // Only run if there are params AND we haven't already filled it 
     // (prevents overwriting if they reload the page)
     if ((clientName || pax || dest) && !itineraryData.tripName) {
         updateItineraryData({
             tripName: clientName ? `${clientName}'s Trip` : '',
             creatingFor: 'guest',
             leadGuestName: clientName || '', // Saves to DB for later
             numberOfTravelers: pax ? parseInt(pax) : 2,
             selectedCountries: dest ? [dest] : []
         });
     }
  }, [searchParams]);


  // --- HANDLERS ---

  const updateField = (field: keyof typeof itineraryData, value: any) => {
    updateItineraryData({ [field]: value });
  };

  const toggleCountry = (country: string) => {
    const currentList = itineraryData.selectedCountries || [];
    let newList;
    
    if (currentList.includes(country)) {
      newList = currentList.filter(c => c !== country);
    } else {
      newList = [...currentList, country];
    }
    
    updateItineraryData({ selectedCountries: newList });
  };

  // LOGIC UPDATE: When Master Itinerary is YES
  // We do NOT disable Category/Style/Experience.
  // We ONLY force 'Library' and 'Land Only'.
  const handleMasterItineraryChange = (isMaster: boolean) => {
    if (isMaster) {
      updateItineraryData({
        isMasterItinerary: true,
        creatingFor: 'Library',     // Force Library
        packageType: 'land',        // Force Land Only
        showFlightDetails: false,
        showTravelerDetails: false
      });
    } else {
      updateItineraryData({
        isMasterItinerary: false
      });
    }
  };

  // const handleNextStep = () => {
  //   if (!itineraryData.tripName) {
  //       alert("Please enter a Trip Name before proceeding.");
  //       return;
  //   }
  //   router.push('/dashboard/itinerary/routing');
  // };

  const handleNextStep = () => {
    if (!itineraryData.tripName) {
        alert("Please enter a Trip Name before proceeding.");
        return;
    }
    // UNLOCK ROUTING
    completeStep('intro');
    router.push('/dashboard/itinerary/routing');
  };

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto pb-20">
      <div className="max-w-5xl mx-auto">
        
        {/* Glassmorphism Container */}
        <div className="bg-white/5 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-6">
          
          {/* 1. MASTER ITINERARY TOGGLE */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-500/30">
            <div className="flex items-center gap-4">
              <label className="block text-base font-bold text-white tracking-wide">
                Creating Master Itinerary?
              </label>
              <div className="flex gap-4 bg-black/20 p-1.5 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer px-2">
                  <input 
                    type="radio" 
                    checked={itineraryData.isMasterItinerary === true} 
                    onChange={() => handleMasterItineraryChange(true)} 
                    className="w-4 h-4 text-blue-500 accent-blue-500" 
                  />
                  <span className="text-white text-sm font-medium">YES</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer px-2">
                  <input 
                    type="radio" 
                    checked={itineraryData.isMasterItinerary === false} 
                    onChange={() => handleMasterItineraryChange(false)} 
                    className="w-4 h-4 text-blue-500 accent-blue-500" 
                  />
                  <span className="text-white text-sm font-medium">NO</span>
                </label>
              </div>
            </div>
          </div>

          {/* 2. IDENTIFIERS ROW (Trip ID & Country) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
            {/* Trip ID */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Trip ID #
              </label>
              <input
                type="text"
                disabled
                placeholder="#####"
                className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-600 rounded-lg text-gray-400 font-mono text-sm cursor-not-allowed"
              />
            </div>

            {/* Country Selector */}
            <div className="md:col-span-8 relative">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Destination Country <span className="text-red-400">*</span>
              </label>
              <div
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center hover:border-blue-500 transition-colors"
              >
                <span className={`text-sm ${itineraryData.selectedCountries?.length > 0 ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                  {itineraryData.selectedCountries?.length > 0 
                    ? itineraryData.selectedCountries.join(", ") 
                    : "Select Destination Countries"}
                </span>
                <span className="text-gray-400 text-xs">▼</span>
              </div>

              {/* Country Dropdown */}
              {showCountryDropdown && (
                <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-h-60 overflow-y-auto p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(DESTINATION_COUNTRIES).map(([region, countries]) => (
                    <div key={region}>
                      <h4 className="font-bold text-[10px] text-blue-600 uppercase mb-1 border-b border-gray-100 pb-1">
                        {region}
                      </h4>
                      <div className="space-y-0.5">
                        {countries.map(country => (
                          <label key={country} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-md cursor-pointer transition-colors group">
                            <input 
                              type="checkbox" 
                              checked={itineraryData.selectedCountries?.includes(country)}
                              onChange={() => toggleCountry(country)}
                              className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs text-gray-700 group-hover:text-gray-900">{country}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. TRIP NAME & TRAVELERS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
            <div className="md:col-span-8">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Trip Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={itineraryData.tripName || ''}
                onChange={(e) => updateField("tripName", e.target.value)}
                placeholder="e.g. Royal Rajasthan Heritage Tour 2026"
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 text-sm font-medium"
              />
            </div>

            <div className="md:col-span-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                 No. of Travelers <Users size={12} className="text-blue-400" />
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={itineraryData.numberOfTravelers || 1}
                  onChange={(e) => updateField("numberOfTravelers", parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2.5 pl-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 text-sm font-bold"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">Pax</span>
              </div>
            </div>
          </div>

          {/* 4. TRIP DETAILS: CATEGORY, STYLE, EXPERIENCES (ALL ENABLED FOR MASTER) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            
            {/* Trip Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Trip Category
              </label>
              <select
                value={itineraryData.tripCategory || ''}
                onChange={(e) => updateField("tripCategory", e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900"
              >
                <option value="">Select Category</option>
                {TRIP_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Trip Style */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Trip Style
              </label>
              <select
                value={itineraryData.tripStyle || ''}
                onChange={(e) => updateField("tripStyle", e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900"
              >
                <option value="">Select Style</option>
                {TRIP_STYLES.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            {/* Trip Experiences */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Trip Experiences
              </label>
              <select
                value={itineraryData.tripExperience || ''}
                onChange={(e) => updateField("tripExperience", e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900"
              >
                <option value="">Select Experience</option>
                {TRIP_EXPERIENCES.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

          </div>

          {/* 5. PACKAGE TYPE & CREATING FOR (CONDITIONAL DISABLE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Package Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Package Type
              </label>
              <div className="flex gap-3">
                {/* Land Only - Always accessible for Master, default for Master */}
                <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${
                  itineraryData.packageType === "land" 
                    ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500" 
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }`}>
                  <input
                    type="radio"
                    value="land"
                    checked={itineraryData.packageType === "land"}
                    onChange={(e) => updateField("packageType", e.target.value)}
                    className="hidden" 
                  />
                  <span className={`text-sm font-medium ${itineraryData.packageType === "land" ? "text-blue-700" : "text-gray-600"}`}>Land Only</span>
                </label>

                {/* With Flight - Disabled if Master Itinerary is YES */}
                <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${
                  itineraryData.packageType === "flight" 
                    ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500" 
                    : "bg-white border-gray-300"
                } ${itineraryData.isMasterItinerary ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer hover:bg-gray-50"}`}>
                  <input
                    type="radio"
                    value="flight"
                    checked={itineraryData.packageType === "flight"}
                    onChange={(e) => updateField("packageType", e.target.value)}
                    disabled={itineraryData.isMasterItinerary}
                    className="hidden"
                  />
                  <span className={`text-sm font-medium ${itineraryData.packageType === "flight" ? "text-blue-700" : "text-gray-600"}`}>With Flight</span>
                </label>
              </div>
            </div>

            {/* Creating For */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Creating For
              </label>
              <div className="flex gap-2">
                {['Library', 'agent', 'guest'].map((type) => {
                  const isLibrary = type === 'Library';
                  // If Master Itinerary is ON, only Library is allowed
                  const isDisabled = itineraryData.isMasterItinerary && !isLibrary;
                  const isSelected = itineraryData.creatingFor === type;

                  return (
                    <label 
                      key={type} 
                      className={`flex-1 flex items-center justify-center gap-2 px-2 py-2.5 rounded-lg border transition-all ${
                        isSelected
                          ? "bg-green-50 border-green-500 ring-1 ring-green-500" 
                          : "bg-white border-gray-300"
                      } ${isDisabled ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-50"}`}
                    >
                      <input
                        type="radio"
                        value={type}
                        checked={isSelected}
                        onChange={(e) => {
                          updateItineraryData({ 
                            creatingFor: e.target.value,
                            showTravelerDetails: e.target.value !== 'Library'
                          });
                        }}
                        disabled={isDisabled}
                        className="hidden"
                      />
                      <span className={`text-sm capitalize font-medium ${isSelected ? "text-green-800" : "text-gray-600"}`}>
                        {type === 'agent' ? 'Agent' : type}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 6. NEXT STEP BUTTON */}
          <div className="mt-10 pt-6 border-t border-white/10 flex justify-end">
            <button
              onClick={handleNextStep}
              className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02]"
            >
              Next Step: Routing
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}