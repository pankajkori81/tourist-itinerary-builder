
// "use client";

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { 
//   SupplierData, getSuppliers, saveSupplier, deleteSupplier, duplicateSupplier, saveAllSuppliers,
//   StayData, getStays, saveStay, deleteStay ,
//   AttractionData, getAttractions, saveAttraction, deleteAttraction // Import Attraction helpers
// } from "@/utils/srmStorage";

// interface SRMContextType {
//   // Global Search & View State
//   searchText: string;
//   setSearchText: (text: string) => void;
//   viewMode: 'grid' | 'list'; // <--- Added this
//   setViewMode: (mode: 'grid' | 'list') => void; // <--- Added this

//   // Supplier Methods
//   suppliers: SupplierData[];
//   refreshSuppliers: () => void;
//   handleSaveSupplier: (data: SupplierData) => boolean;
//   handleDeleteSupplier: (id: string) => boolean;
//   handleCloneSupplier: (id: string) => boolean;
//   handleReorderSuppliers: (newOrder: SupplierData[]) => void;

//   // Stay Methods
//   stays: StayData[];
//   refreshStays: () => void;
//   handleSaveStay: (data: StayData) => boolean;
//   handleDeleteStay: (id: string) => boolean;

//    // Activity (Attraction) Methods -- NEW
//    attractions: AttractionData[];
//   refreshAttractions: () => void;
//   handleSaveAttraction: (data: AttractionData) => boolean;
//   handleDeleteAttraction: (id: string) => boolean;
// }




// const SRMContext = createContext<SRMContextType | undefined>(undefined);

// export function SRMProvider({ children }: { children: React.ReactNode }) {
//   const [searchText, setSearchText] = useState("");
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Default is Grid
//   const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
//   const [stays, setStays] = useState<StayData[]>([]);
//   const [attractions, setAttractions] = useState<AttractionData[]>([]);


//   const refreshSuppliers = () => setSuppliers(getSuppliers());
//   const refreshStays = () => setStays(getStays());
//   const refreshAttractions = () => setAttractions(getAttractions());

//   useEffect(() => {
//     refreshSuppliers();
//     refreshStays();
//     refreshAttractions();
//   }, []);

//   // Supplier Logic
//   const handleSaveSupplier = (data: SupplierData) => { const s = saveSupplier(data); if(s) refreshSuppliers(); return s; };
//   const handleDeleteSupplier = (id: string) => { const s = deleteSupplier(id); if(s) refreshSuppliers(); return s; };
//   const handleCloneSupplier = (id: string) => { const s = duplicateSupplier(id); if(s) refreshSuppliers(); return s; };
//   const handleReorderSuppliers = (newOrder: SupplierData[]) => { setSuppliers(newOrder); saveAllSuppliers(newOrder); };

//   // Stay Logic
//   const handleSaveStay = (data: StayData) => { const s = saveStay(data); if(s) refreshStays(); return s; };
//   const handleDeleteStay = (id: string) => { const s = deleteStay(id); if(s) refreshStays(); return s; };


//   // Attraction Logic -- NEW
//   const handleSaveAttraction = (data: AttractionData) => { const s = saveAttraction(data); if(s) refreshAttractions(); return s; };
//   const handleDeleteAttraction = (id: string) => { const s = deleteAttraction(id); if(s) refreshAttractions(); return s; };

//   return (
//     <SRMContext.Provider value={{ 
//       searchText, setSearchText, viewMode, setViewMode,
//       suppliers, refreshSuppliers, handleSaveSupplier, handleDeleteSupplier, handleCloneSupplier, handleReorderSuppliers,
//       stays, refreshStays, handleSaveStay, handleDeleteStay,
//       attractions, refreshAttractions, handleSaveAttraction, handleDeleteAttraction
//     }}>
//       {children}
//     </SRMContext.Provider>
//   );
// }

// export function useSRM() {
//   const context = useContext(SRMContext);
//   if (context === undefined) throw new Error("useSRM must be used within an SRMProvider");
//   return context;
// } 
























// "use client";

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { 
//   // 1. Imports for all 5 Modules
//   SupplierData, getSuppliers, 
//   StayData, getStays, 
//   AttractionData, getAttractions,
//   TransportData, getTransports,
//   MealData, getMeals
// } from "@/utils/srmStorage";

// interface SRMContextType {
//   // Global Search & View State
//   searchText: string;
//   setSearchText: (text: string) => void;
//   viewMode: 'grid' | 'list';
//   setViewMode: (mode: 'grid' | 'list') => void;

//   // 2. Data Arrays for all Modules
//   suppliers: SupplierData[];
//   stays: StayData[];
//   attractions: AttractionData[];
//   transports: TransportData[]; // New
//   meals: MealData[];           // New

//   // 3. The Master Refresh Function (Fixes your error)
//   refreshAll: () => void;
// }

// const SRMContext = createContext<SRMContextType | undefined>(undefined);

// export function SRMProvider({ children }: { children: React.ReactNode }) {
//   // State
//   const [searchText, setSearchText] = useState("");
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
//   const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
//   const [stays, setStays] = useState<StayData[]>([]);
//   const [attractions, setAttractions] = useState<AttractionData[]>([]);
//   const [transports, setTransports] = useState<TransportData[]>([]);
//   const [meals, setMeals] = useState<MealData[]>([]);

//   // 4. The Logic to load everything from LocalStorage
//   const refreshAll = () => {
//     setSuppliers(getSuppliers());
//     setStays(getStays());
//     setAttractions(getAttractions());
//     setTransports(getTransports());
//     setMeals(getMeals());
//   };

//   // Initial Load
//   useEffect(() => {
//     refreshAll();
//   }, []);

//   return (
//     <SRMContext.Provider value={{ 
//       searchText, setSearchText, 
//       viewMode, setViewMode,
//       suppliers, 
//       stays, 
//       attractions, 
//       transports, 
//       meals,
//       refreshAll 
//     }}>
//       {children}
//     </SRMContext.Provider>
//   );
// }

// export function useSRM() {
//   const context = useContext(SRMContext);
//   if (context === undefined) {
//     throw new Error("useSRM must be used within an SRMProvider");
//   }
//   return context;
// } 




















































"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  SupplierData, getSuppliers, 
  StayData, getStays, 
  AttractionData, getAttractions,
  TransportData, getTransports,
  MealData, getMeals
} from "@/utils/srmStorage";

interface SRMContextType {
  searchText: string;
  setSearchText: (text: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // NEW: Loading State
  isLoading: boolean;

  suppliers: SupplierData[];
  stays: StayData[];
  attractions: AttractionData[];
  transports: TransportData[];
  meals: MealData[];

  // UPDATED: Now asynchronous
  refreshAll: () => Promise<void>;
}

const SRMContext = createContext<SRMContextType | undefined>(undefined);

export function SRMProvider({ children }: { children: React.ReactNode }) {
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true); // Start loading
  
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [stays, setStays] = useState<StayData[]>([]);
  const [attractions, setAttractions] = useState<AttractionData[]>([]);
  const [transports, setTransports] = useState<TransportData[]>([]);
  const [meals, setMeals] = useState<MealData[]>([]);

  // The async refresh function
  const refreshAll = async () => {
    setIsLoading(true);
    try {
      // Promise.all fetches all collections concurrently (much faster!)
      const [suppData, stayData, attrData, transData, mealData] = await Promise.all([
        getSuppliers(),
        getStays(),
        getAttractions(),
        getTransports(),
        getMeals()
      ]);

      setSuppliers(suppData);
      setStays(stayData);
      setAttractions(attrData);
      setTransports(transData);
      setMeals(mealData);
    } catch (error) {
      console.error("Error refreshing SRM data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <SRMContext.Provider value={{ 
      searchText, setSearchText, 
      viewMode, setViewMode,
      isLoading, // Provide loading state
      suppliers, 
      stays, 
      attractions, 
      transports, 
      meals,
      refreshAll 
    }}>
      {children}
    </SRMContext.Provider>
  );
}

export function useSRM() {
  const context = useContext(SRMContext);
  if (context === undefined) {
    throw new Error("useSRM must be used within an SRMProvider");
  }
  return context;
}