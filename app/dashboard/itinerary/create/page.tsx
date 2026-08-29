
// "use client";

// import React, { useState, useEffect } from "react";
// import { Users, ArrowRight } from "lucide-react"; 
// // import { useRouter } from "next/navigation";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useItinerary } from "@/app/context/ItineraryContext";


// // --- UPDATED CONSTANTS ---

// // New: Trip Categories
// const TRIP_CATEGORIES = ["Classic", "Premium", "Deluxe", "Luxury"];

// // Updated: Trip Styles
// const TRIP_STYLES = ["Join-in / Shared", "Small Group", "Large Group", "Tailor Made"];

// // New: Trip Experiences
// const TRIP_EXPERIENCES = [
//   "Architecture", "Festival", "Culture", "Photography", 
//   "Culinary", "Sports", "Wildlife", "Signature (First Time Traveler)"
// ];

// // const DESTINATION_COUNTRIES: Record<string, string[]> = {
// //   "India & Subcontinent": ["India", "Sri Lanka", "Maldives"],
// //   "Europe": ["United Kingdom", "France", "Germany", "Switzerland", "Italy", "Austria"],
// //   "Middle East": ["United Arab Emirates"],
// //   "North America": ["United States of America", "Canada"],
// // };


// const DESTINATION_COUNTRIES: Record<string, string[]> = {
//   "India & Subcontinent": [
//     "India", "Sri Lanka", "Maldives", "Nepal", "Bhutan", "Bangladesh"
//   ],
//   "Europe": [
//     "United Kingdom", "France", "Germany", "Switzerland", "Italy", "Austria", 
//     "Greece", "Spain", "Portugal", "Netherlands", "Belgium", "Ireland", "Croatia"
//   ],
//   "Middle East": [
//     "United Arab Emirates", "Saudi Arabia", "Qatar", "Oman", "Turkey", "Jordan"
//   ],
//   "North America": [
//     "United States of America", "Canada", "Mexico"
//   ],
//   "Southeast Asia": [
//     "Thailand", "Vietnam", "Singapore", "Malaysia", "Indonesia", "Philippines"
//   ],
//   "Oceania": [
//     "Australia", "New Zealand", "Fiji"
//   ],
//   "Africa": [
//     "South Africa", "Egypt", "Morocco", "Kenya", "Tanzania"
//   ]
// };


// export default function CreateItineraryPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   // const { itineraryData, updateItineraryData } = useItinerary();
//   const { itineraryData, updateItineraryData, completeStep } = useItinerary(); // Destructure completeStep
//   const [showCountryDropdown, setShowCountryDropdown] = useState(false);


//   // 👈 NEW LOGIC: Pre-fill data from CRM Magic Button
//   useEffect(() => {
//      const clientName = searchParams.get('clientName');
//      const pax = searchParams.get('pax');
//      const dest = searchParams.get('dest');

//      // Only run if there are params AND we haven't already filled it 
//      // (prevents overwriting if they reload the page)
//      if ((clientName || pax || dest) && !itineraryData.tripName) {
//          updateItineraryData({
//              tripName: clientName ? `${clientName}'s Trip` : '',
//              creatingFor: 'guest',
//              leadGuestName: clientName || '', // Saves to DB for later
//              numberOfTravelers: pax ? parseInt(pax) : 2,
//              selectedCountries: dest ? [dest] : []
//          });
//      }
//   }, [searchParams]);


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
//         creatingFor: 'Library',     // Force Library
//         packageType: 'land',        // Force Land Only
//         showFlightDetails: false,
//         showTravelerDetails: false
//       });
//     } else {
//       updateItineraryData({
//         isMasterItinerary: false
//       });
//     }
//   };

//   // const handleNextStep = () => {
//   //   if (!itineraryData.tripName) {
//   //       alert("Please enter a Trip Name before proceeding.");
//   //       return;
//   //   }
//   //   router.push('/dashboard/itinerary/routing');
//   // };

//   const handleNextStep = () => {
//     if (!itineraryData.tripName) {
//         alert("Please enter a Trip Name before proceeding.");
//         return;
//     }
//     // UNLOCK ROUTING
//     completeStep('intro');
//     router.push('/dashboard/itinerary/routing');
//   };

//   return (
//     <div className="p-4 md:p-6 h-full overflow-y-auto pb-20">
//       <div className="max-w-5xl mx-auto">
        
//         {/* Glassmorphism Container */}
//         <div className="bg-white/5 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-6">
          
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

//           {/* 2. IDENTIFIERS ROW (Trip ID & Country) */}
//           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
//             {/* Trip ID */}
//             <div className="md:col-span-4">
//               <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
//                 Trip ID #
//               </label>
//               <input
//                 type="text"
//                 disabled
//                 placeholder="#####"
//                 className="w-full px-3 py-2.5 bg-gray-800/50 border border-gray-600 rounded-lg text-gray-400 font-mono text-sm cursor-not-allowed"
//               />
//             </div>

//             {/* Country Selector */}
//             <div className="md:col-span-8 relative">
//               <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
//                 Destination Country <span className="text-red-400">*</span>
//               </label>
//               <div
//                 onClick={() => setShowCountryDropdown(!showCountryDropdown)}
//                 className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center hover:border-blue-500 transition-colors"
//               >
//                 <span className={`text-sm ${itineraryData.selectedCountries?.length > 0 ? "text-gray-900 font-medium" : "text-gray-400"}`}>
//                   {itineraryData.selectedCountries?.length > 0 
//                     ? itineraryData.selectedCountries.join(", ") 
//                     : "Select Destination Countries"}
//                 </span>
//                 <span className="text-gray-400 text-xs">▼</span>
//               </div>

//               {/* Country Dropdown */}
//               {showCountryDropdown && (
//                 <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-h-60 overflow-y-auto p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
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
//                               checked={itineraryData.selectedCountries?.includes(country)}
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

//           {/* 3. TRIP NAME & TRAVELERS */}
//           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
//             <div className="md:col-span-8">
//               <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
//                 Trip Name <span className="text-red-400">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={itineraryData.tripName || ''}
//                 onChange={(e) => updateField("tripName", e.target.value)}
//                 placeholder="e.g. Royal Rajasthan Heritage Tour 2026"
//                 className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 text-sm font-medium"
//               />
//             </div>

//             <div className="md:col-span-4">
//               <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
//                  No. of Travelers <Users size={12} className="text-blue-400" />
//               </label>
//               <div className="relative">
//                 <input
//                   type="number"
//                   min="1"
//                   value={itineraryData.numberOfTravelers || 1}
//                   onChange={(e) => updateField("numberOfTravelers", parseInt(e.target.value) || 1)}
//                   className="w-full px-3 py-2.5 pl-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 text-sm font-bold"
//                 />
//                 <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">Pax</span>
//               </div>
//             </div>
//           </div>

//           {/* 4. TRIP DETAILS: CATEGORY, STYLE, EXPERIENCES (ALL ENABLED FOR MASTER) */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            
//             {/* Trip Category */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
//                 Trip Category
//               </label>
//               <select
//                 value={itineraryData.tripCategory || ''}
//                 onChange={(e) => updateField("tripCategory", e.target.value)}
//                 className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900"
//               >
//                 <option value="">Select Category</option>
//                 {TRIP_CATEGORIES.map((cat) => (
//                   <option key={cat} value={cat}>{cat}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Trip Style */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
//                 Trip Style
//               </label>
//               <select
//                 value={itineraryData.tripStyle || ''}
//                 onChange={(e) => updateField("tripStyle", e.target.value)}
//                 className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900"
//               >
//                 <option value="">Select Style</option>
//                 {TRIP_STYLES.map((style) => (
//                   <option key={style} value={style}>{style}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Trip Experiences */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
//                 Trip Experiences
//               </label>
//               <select
//                 value={itineraryData.tripExperience || ''}
//                 onChange={(e) => updateField("tripExperience", e.target.value)}
//                 className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900"
//               >
//                 <option value="">Select Experience</option>
//                 {TRIP_EXPERIENCES.map((exp) => (
//                   <option key={exp} value={exp}>{exp}</option>
//                 ))}
//               </select>
//             </div>

//           </div>

//           {/* 5. PACKAGE TYPE & CREATING FOR (CONDITIONAL DISABLE) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Package Type */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
//                 Package Type
//               </label>
//               <div className="flex gap-3">
//                 {/* Land Only - Always accessible for Master, default for Master */}
//                 <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${
//                   itineraryData.packageType === "land" 
//                     ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500" 
//                     : "bg-white border-gray-300 hover:bg-gray-50"
//                 }`}>
//                   <input
//                     type="radio"
//                     value="land"
//                     checked={itineraryData.packageType === "land"}
//                     onChange={(e) => updateField("packageType", e.target.value)}
//                     className="hidden" 
//                   />
//                   <span className={`text-sm font-medium ${itineraryData.packageType === "land" ? "text-blue-700" : "text-gray-600"}`}>Land Only</span>
//                 </label>

//                 {/* With Flight - Disabled if Master Itinerary is YES */}
//                 <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${
//                   itineraryData.packageType === "flight" 
//                     ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500" 
//                     : "bg-white border-gray-300"
//                 } ${itineraryData.isMasterItinerary ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer hover:bg-gray-50"}`}>
//                   <input
//                     type="radio"
//                     value="flight"
//                     checked={itineraryData.packageType === "flight"}
//                     onChange={(e) => updateField("packageType", e.target.value)}
//                     disabled={itineraryData.isMasterItinerary}
//                     className="hidden"
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
//                   // If Master Itinerary is ON, only Library is allowed
//                   const isDisabled = itineraryData.isMasterItinerary && !isLibrary;
//                   const isSelected = itineraryData.creatingFor === type;

//                   return (
//                     <label 
//                       key={type} 
//                       className={`flex-1 flex items-center justify-center gap-2 px-2 py-2.5 rounded-lg border transition-all ${
//                         isSelected
//                           ? "bg-green-50 border-green-500 ring-1 ring-green-500" 
//                           : "bg-white border-gray-300"
//                       } ${isDisabled ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-50"}`}
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
//                         className="hidden"
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

//           {/* 6. NEXT STEP BUTTON */}
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

import React, { useState, useEffect, useRef } from "react";
import { Users, ArrowRight } from "lucide-react"; 
import { useRouter, useSearchParams } from "next/navigation";
import { useItinerary } from "@/app/context/ItineraryContext";
import { getLibrary } from "@/utils/itineraryStorage"; // 👈 Added this to fetch existing trips!

// --- CONSTANTS ---
const TRIP_CATEGORIES = ["Value", "Standard", "Premium", "Deluxe", "Luxury",];
const TRIP_STYLES = ["Join-in / Shared", "Small Group", "Large Group", "Tailor Made", "Mix&Match" ];
const TRIP_EXPERIENCES = [
  "Architecture", "Festival", "Culture", "Photography", 
  "Culinary", "Sports", "Wildlife", "Signature (First Time Traveler)"
];

const DESTINATION_COUNTRIES: Record<string, string[]> = {
  "India & Subcontinent": ["India", "Sri Lanka", "Maldives", "Nepal", "Bhutan", "Bangladesh"],
  "Europe": ["United Kingdom", "France", "Germany", "Switzerland", "Italy", "Austria", "Greece", "Spain", "Portugal", "Netherlands", "Belgium", "Ireland", "Croatia"],
  "Middle East": ["United Arab Emirates", "Saudi Arabia", "Qatar", "Oman", "Turkey", "Jordan"],
  "North America": ["United States of America", "Canada", "Mexico"],
  "Southeast Asia": ["Thailand", "Vietnam", "Singapore", "Malaysia", "Indonesia", "Philippines"],
  "Oceania": ["Australia", "New Zealand", "Fiji"],
  "Africa": ["South Africa", "Egypt", "Morocco", "Kenya", "Tanzania"]
};

// 🌟 STEP 1: THE COUNTRY CODE DICTIONARY
const COUNTRY_CODES: Record<string, string> = {
  "India": "IN", "Sri Lanka": "LK", "Maldives": "MV", "Nepal": "NP", "Bhutan": "BT", "Bangladesh": "BD",
  "United Kingdom": "UK", "France": "FR", "Germany": "DE", "Switzerland": "CH", "Italy": "IT", "Austria": "AT",
  "Greece": "GR", "Spain": "ES", "Portugal": "PT", "Netherlands": "NL", "Belgium": "BE", "Ireland": "IE", "Croatia": "HR",
  "United Arab Emirates": "AE", "Saudi Arabia": "SA", "Qatar": "QA", "Oman": "OM", "Turkey": "TR", "Jordan": "JO",
  "United States of America": "US", "Canada": "CA", "Mexico": "MX",
  "Thailand": "TH", "Vietnam": "VN", "Singapore": "SG", "Malaysia": "MY", "Indonesia": "ID", "Philippines": "PH",
  "Australia": "AU", "New Zealand": "NZ", "Fiji": "FJ",
  "South Africa": "ZA", "Egypt": "EG", "Morocco": "MA", "Kenya": "KE", "Tanzania": "TZ"
};

export default function CreateItineraryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { itineraryData, updateItineraryData, completeStep } = useItinerary();
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
   
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Pre-fill data from CRM Magic Button
  useEffect(() => {
     const clientName = searchParams.get('clientName');
     const pax = searchParams.get('pax');
     const dest = searchParams.get('dest');

     if ((clientName || pax || dest) && !itineraryData.tripName) {
         updateItineraryData({
             tripName: clientName ? `${clientName}'s Trip` : '',
             creatingFor: 'guest',
             leadGuestName: clientName || '', 
             numberOfTravelers: pax ? parseInt(pax) : 2,
             selectedCountries: dest ? [dest] : []
         });
     }
  }, [searchParams]);


    // 🌟 Click Outside Logic — closes the country dropdown when clicking anywhere else
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HANDLERS ---
  const updateField = (field: keyof typeof itineraryData, value: any) => {
    updateItineraryData({ [field]: value });
  };


  // 🌟 1. THE SMART ID GENERATOR HELPER
  // const generateSmartId = async (primaryCountry: string) => {
  //     const year = new Date().getFullYear();
  //     const code = COUNTRY_CODES[primaryCountry] || "XX";
  //     const library = await getLibrary(); 
  //     const existingCount = library.filter((t: any) =>
  //         t.selectedCountries?.[0] === primaryCountry &&
  //         t.tripId?.includes(year.toString()) &&
  //         t.id !== itineraryData.id 
  //     ).length;
  //     return `${existingCount + 1}-${code}50-${year}`;
  // };


  const generateSmartId = async (primaryCountry: string) => {
    const year = new Date().getFullYear();
    const code = COUNTRY_CODES[primaryCountry] || "XX";
    const library = await getLibrary();

    const relevant = library.filter((t: any) =>
        t.selectedCountries?.[0] === primaryCountry &&
        t.tripId?.includes(year.toString()) &&
        t.id !== itineraryData.id
    );

    // Find the highest number actually in use (e.g. "3-ZA50-2026" → 3),
    // instead of counting how many records currently exist. This is
    // immune to gaps caused by deleted/leftover records.
    const highestNumber = relevant.reduce((max: number, t: any) => {
        const match = t.tripId?.match(/^(\d+)-/);
        const num = match ? parseInt(match[1], 10) : 0;
        return num > max ? num : max;
    }, 0);

    return `${highestNumber + 1}-${code}50-${year}`;
};

  // 🌟 2. THE DRAFT AUTO-FIXER (Fixes bad IDs on load)
  // useEffect(() => {
  //     const autoFixId = async () => {
  //         const currentId = itineraryData.tripId || '';
  //         // If the DB forced a dummy 'TRIP-' ID, and we have a country selected, fix it instantly!
  //         if (currentId.startsWith('TRIP-') && itineraryData.selectedCountries?.length > 0) {
  //             const smartId = await generateSmartId(itineraryData.selectedCountries[0]);
  //             updateItineraryData({ tripId: smartId });
  //         }
  //     };
  //     autoFixId();
  // }, [itineraryData.tripId, itineraryData.selectedCountries]);


    // 🌟 2. THE DRAFT AUTO-FIXER (Fixes bad IDs on load)
  useEffect(() => {
      const autoFixId = async () => {
          const currentId = itineraryData.tripId || '';
          // 🔧 CHANGED: now also self-heals a BLANK tripId, not just one starting
          // with 'TRIP-'. This covers the edge case where a record was saved to
          // the DB before a country was selected (tripId === '') — previously
          // that record would show "ID Pending..." forever on the Library page
          // unless the user happened to re-select a country on the Edit screen.
          const needsFix = (currentId.startsWith('TRIP-') || currentId === '') 
                            && itineraryData.selectedCountries?.length > 0;

          if (needsFix) {
              const smartId = await generateSmartId(itineraryData.selectedCountries[0]);
              updateItineraryData({ tripId: smartId });
          }
      };
      autoFixId();
  }, [itineraryData.tripId, itineraryData.selectedCountries]);


  // 🌟 3. THE UPDATED COUNTRY TOGGLE
  const toggleCountry = async (country: string) => {
    const currentList = itineraryData.selectedCountries || [];
    let newList;
    
    if (currentList.includes(country)) {
      newList = currentList.filter(c => c !== country);
    } else {
      newList = [...currentList, country];
    }
    
    let newTripId = itineraryData.tripId || '';

    if (newList.length > 0) {
        const primaryCountry = newList[0];
        // Check if the ID is blank or a dummy fallback
        const isFallback = newTripId.startsWith('TRIP-') || newTripId === '';
        
        if (currentList[0] !== primaryCountry || isFallback) {
            newTripId = await generateSmartId(primaryCountry);
        }
    } else {
        newTripId = ''; 
    }

    updateItineraryData({ selectedCountries: newList, tripId: newTripId });
  };

  const handleMasterItineraryChange = (isMaster: boolean) => {
    if (isMaster) {
      updateItineraryData({
        isMasterItinerary: true,
        creatingFor: 'Library',     
        packageType: 'land',        
        showFlightDetails: false,
        showTravelerDetails: false
      });
    } else {
      updateItineraryData({ isMasterItinerary: false });
    }
  };

  const handleNextStep = () => {
    if (!itineraryData.tripName) {
        alert("Please enter a Trip Name before proceeding.");
        return;
    }
    if (!itineraryData.selectedCountries || itineraryData.selectedCountries.length === 0) {
        alert("Please select a Destination Country to generate a Trip ID.");
        return;
    }
    completeStep('intro');
    router.push('/dashboard/itinerary/routing');
  };



  return (
    // 🔧 CHANGED: p-4 md:p-6 → added min-[1700px] tier so only wide screens get the bigger padding
    <div className="p-3 md:p-4 min-[1700px]:p-6 h-full overflow-y-auto pb-20">
      {/* <div className="max-w-5xl mx-auto"> */}

       <div className="max-w-4xl min-[1700px]:max-w-5xl mx-auto">
        
        {/* <div className="bg-white/5 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-6"> */}
{/* 🔧 CHANGED: card padding p-6 → p-4 base, p-6 only at min-[1700px] */}
<div className="group relative overflow-hidden bg-white/5 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-4 min-[1700px]:p-6 transition-all duration-500 ease-out hover:bg-white/5 hover:backdrop-blur-lg hover:border-white/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1">
          
  
          {/* 1. MASTER ITINERARY TOGGLE */}
          {/* 🔧 CHANGED: mb-6 pb-4 → mb-4 pb-3 base, mb-6 pb-4 only at min-[1700px] */}
          <div className="flex items-center justify-between mb-4 pb-3 min-[1700px]:mb-6 min-[1700px]:pb-4 border-b border-gray-500/30">
            {/* 🔧 CHANGED: gap-4 → gap-3 base, gap-4 at min-[1700px] */}
            <div className="flex items-center gap-3 min-[1700px]:gap-4">
              {/* 🔧 CHANGED: text-base → text-sm base, text-base at min-[1700px] */}
              <label className="block text-sm min-[1700px]:text-base font-bold text-white tracking-wide">
                Creating Master Itinerary?
              </label>
              {/* 🔧 CHANGED: gap-4 p-1.5 → gap-3 p-1 base, gap-4 p-1.5 at min-[1700px] */}
              <div className="flex gap-3 min-[1700px]:gap-4 bg-black/20 p-1 min-[1700px]:p-1.5 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer px-2">
                  <input 
                    type="radio" 
                    checked={itineraryData.isMasterItinerary === true} 
                    onChange={() => handleMasterItineraryChange(true)} 
                    className="w-4 h-4 text-blue-500 accent-blue-500" 
                  />
                  {/* 🔧 CHANGED: text-sm → text-xs base, text-sm at min-[1700px] */}
                  <span className="text-white text-xs min-[1700px]:text-sm font-medium">YES</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer px-2">
                  <input 
                    type="radio" 
                    checked={itineraryData.isMasterItinerary === false} 
                    onChange={() => handleMasterItineraryChange(false)} 
                    className="w-4 h-4 text-blue-500 accent-blue-500" 
                  />
                  <span className="text-white text-xs min-[1700px]:text-sm font-medium">NO</span>
                </label>
              </div>
            </div>
          </div>


                        {/* 2. IDENTIFIERS ROW */}
          {/* 🔧 CHANGED: gap-6 mb-6 → gap-4 mb-4 base, gap-6 mb-6 at min-[1700px] */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 min-[1700px]:gap-6 min-[1700px]:mb-6">
            
            {/* 🌟 STEP 3: THE UI DISPLAY UPDATE */}
            <div className="md:col-span-4">
              {/* 🔧 CHANGED: mb-1.5 → mb-1 base, mb-1.5 at min-[1700px] */}
              <label className="block text-xs font-semibold text-gray-300 mb-1 min-[1700px]:mb-1.5 uppercase tracking-wider">
                Trip ID
              </label>
              <input
                type="text"
                disabled
                value={itineraryData.tripId || 'Pending Country...'} // 👈 Automatically shows the ID here!
                // 🔧 CHANGED: px-3 py-2.5 → px-3 py-2 base, py-2.5 at min-[1700px] (input height)
                className={`w-full px-3 py-2 min-[1700px]:py-2.5 bg-gray-800/50 border border-gray-600 rounded-lg font-mono text-sm cursor-not-allowed ${itineraryData.tripId ? 'text-green-400 font-bold' : 'text-gray-400'}`}
              />
            </div>

            {/* Country Selector */}
            <div className="md:col-span-8 relative" ref={countryDropdownRef} >
              <label className="block text-xs font-semibold text-gray-300 mb-1 min-[1700px]:mb-1.5 uppercase tracking-wider">
                Destination Country <span className="text-red-400">*</span>
              </label>
              <div
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                // 🔧 CHANGED: px-3 py-2.5 → px-3 py-2 base, py-2.5 at min-[1700px] (dropdown trigger height)
                className="w-full px-3 py-2 min-[1700px]:py-2.5 bg-white border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center hover:border-blue-500 transition-colors"
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 min-[1700px]:gap-6 min-[1700px]:mb-6">
            <div className="md:col-span-8">
             
              <label className="block text-xs font-semibold text-gray-300 mb-1 min-[1700px]:mb-1.5 uppercase tracking-wider">
                Trip Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={itineraryData.tripName || ''}
                onChange={(e) => updateField("tripName", e.target.value)}
                placeholder="e.g. Royal Rajasthan Heritage Tour 2026"
                // 🔧 CHANGED: py-2.5 → py-2 base, py-2.5 at min-[1700px]
                className="w-full px-3 py-2 min-[1700px]:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 text-sm font-medium"
              />
            </div>

            <div className="md:col-span-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-1 min-[1700px]:mb-1.5 uppercase tracking-wider">
                 No. of Travelers <Users size={12} className="text-blue-400" />
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={itineraryData.numberOfTravelers || 1}
                  onChange={(e) => updateField("numberOfTravelers", parseInt(e.target.value) || 1)}
                  // 🔧 CHANGED: py-2.5 → py-2 base, py-2.5 at min-[1700px]
                  className="w-full px-3 py-2 min-[1700px]:py-2.5 pl-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 text-sm font-bold"
                />
                
                <span className="absolute right-3 top-2 min-[1700px]:top-2.5 text-xs text-gray-400 font-medium">Pax</span>
              </div>
            </div>
          </div>



                    {/* 4. TRIP DETAILS */}
          {/* 🔧 CHANGED: gap-6 mb-6 → gap-4 mb-4 base, gap-6 mb-6 at min-[1700px] */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 min-[1700px]:gap-6 min-[1700px]:mb-6">
            <div>
              {/* 🔧 CHANGED: mb-1.5 → mb-1 base, mb-1.5 at min-[1700px] (applies to all 3 labels below too) */}
              <label className="block text-xs font-semibold text-gray-300 mb-1 min-[1700px]:mb-1.5 uppercase tracking-wider">Trip Category</label>
              {/* 🔧 CHANGED: py-2.5 → py-2 base, py-2.5 at min-[1700px] (applies to all 3 selects below too) */}
              <select value={itineraryData.tripCategory || ''} onChange={(e) => updateField("tripCategory", e.target.value)} className="w-full px-3 py-2 min-[1700px]:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900">
                <option value="">Select Category</option>
                {TRIP_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1 min-[1700px]:mb-1.5 uppercase tracking-wider">Trip Style</label>
              <select value={itineraryData.tripStyle || ''} onChange={(e) => updateField("tripStyle", e.target.value)} className="w-full px-3 py-2 min-[1700px]:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900">
                <option value="">Select Style</option>
                {TRIP_STYLES.map((style) => <option key={style} value={style}>{style}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1 min-[1700px]:mb-1.5 uppercase tracking-wider">Trip Experiences</label>
              <select value={itineraryData.tripExperience || ''} onChange={(e) => updateField("tripExperience", e.target.value)} className="w-full px-3 py-2 min-[1700px]:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900">
                <option value="">Select Experience</option>
                {TRIP_EXPERIENCES.map((exp) => <option key={exp} value={exp}>{exp}</option>)}
              </select>
            </div>
          </div>



                    {/* 5. PACKAGE TYPE & CREATING FOR */}
          {/* 🔧 CHANGED: gap-6 → gap-4 base, gap-6 at min-[1700px] */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-[1700px]:gap-6">
            <div>
              {/* 🔧 CHANGED: mb-2 → mb-1.5 base, mb-2 at min-[1700px] */}
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 min-[1700px]:mb-2 uppercase tracking-wider">Package Type</label>
              <div className="flex gap-3">
                {/* 🔧 CHANGED: py-2.5 → py-2 base, py-2.5 at min-[1700px] (both pill buttons) */}
                <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 min-[1700px]:py-2.5 rounded-lg border cursor-pointer transition-all ${itineraryData.packageType === "land" ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500" : "bg-white border-gray-300 hover:bg-gray-50"}`}>
                  <input type="radio" value="land" checked={itineraryData.packageType === "land"} onChange={(e) => updateField("packageType", e.target.value)} className="hidden" />
                  <span className={`text-sm font-medium ${itineraryData.packageType === "land" ? "text-blue-700" : "text-gray-600"}`}>Land Only</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 min-[1700px]:py-2.5 rounded-lg border transition-all ${itineraryData.packageType === "flight" ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500" : "bg-white border-gray-300"} ${itineraryData.isMasterItinerary ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer hover:bg-gray-50"}`}>
                  <input type="radio" value="flight" checked={itineraryData.packageType === "flight"} onChange={(e) => updateField("packageType", e.target.value)} disabled={itineraryData.isMasterItinerary} className="hidden"/>
                  <span className={`text-sm font-medium ${itineraryData.packageType === "flight" ? "text-blue-700" : "text-gray-600"}`}>With Flight</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 min-[1700px]:mb-2 uppercase tracking-wider">Creating For</label>
              <div className="flex gap-2">
                {['Library', 'agent', 'guest'].map((type) => {
                  const isLibrary = type === 'Library';
                  const isDisabled = itineraryData.isMasterItinerary && !isLibrary;
                  const isSelected = itineraryData.creatingFor === type;

                  return (
                    // 🔧 CHANGED: py-2.5 → py-2 base, py-2.5 at min-[1700px]
                    <label key={type} className={`flex-1 flex items-center justify-center gap-2 px-2 py-2 min-[1700px]:py-2.5 rounded-lg border transition-all ${isSelected ? "bg-green-50 border-green-500 ring-1 ring-green-500" : "bg-white border-gray-300"} ${isDisabled ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-50"}`}>
                      <input type="radio" value={type} checked={isSelected} onChange={(e) => updateItineraryData({ creatingFor: e.target.value, showTravelerDetails: e.target.value !== 'Library' })} disabled={isDisabled} className="hidden" />
                      <span className={`text-sm capitalize font-medium ${isSelected ? "text-green-800" : "text-gray-600"}`}>{type === 'agent' ? 'Agent' : type}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 6. NEXT STEP BUTTON */}
          {/* <div className="mt-10 pt-6 border-t border-white/10 flex justify-end"> */}

                    {/* 6. NEXT STEP BUTTON */}
          {/* 🔧 CHANGED: mt-10 pt-6 → mt-6 pt-4 base, mt-10 pt-6 at min-[1700px] */}
          <div className="mt-6 pt-4 min-[1700px]:mt-10 min-[1700px]:pt-6 border-t border-white/10 flex justify-end">
            
            {/* Local style for the infinite shine animation */}
            <style>{`
              @keyframes shine {
                0% { left: -100px; }
                60% { left: 100%; }
                100% { left: 100%; }
              }
              .group:hover .shine-effect {
                animation: shine 1.5s ease-out infinite;
              }
            `}</style>

          
               <button
              onClick={handleNextStep}
              className="group relative overflow-hidden flex items-center justify-center gap-2.5 px-6 py-1.5 min-[1700px]:px-8 min-[1700px]:py-2 bg-blue-600 text-white font-bold text-[15px] rounded-full border-[3px] border-white/30 shadow-[0_10px_20px_rgba(0,0,0,0.2)] outline-none cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:border-white/60"
            >
              {/* 🌟 The Shine Effect Element */}
              <div className="shine-effect absolute top-0 -left-[100px] w-[100px] h-full opacity-60 pointer-events-none bg-gradient-to-r from-transparent via-white/80 to-transparent z-0" />
              
              {/* Button Text */}
              <span className="relative z-10">Next Step: Routing</span>
              
              {/* Animated Arrow Icon */}
              <ArrowRight 
                size={20} 
                className="relative z-10 transition-transform duration-300 ease-in-out group-hover:translate-x-1" 
              />
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}