// "use client";

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { 
//   saveItineraryToStorage, 
//   loadItineraryFromStorage, 
//   clearItineraryStorage,
//   saveToLibrary,
//   getItineraryById,
//   StoredItineraryData
// } from '@/utils/itineraryStorage';
// import { DayPlan, RoutingData } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';

// // --- Types for Context ---
// export interface Flight {
//   id: number;
//   flightNumber: string;
//   givenName: string;
//   lastName: string;
//   departureDate: string;
//   from: string;
//   takeOff: string;
//   to: string;
//   landing: string;
//   arrivalDate: string;
// }

// export interface Traveler {
//   id: number;
//   leadGuest: boolean;
//   givenName: string;
//   lastName: string;
//   dateOfBirth: string;
//   gender: string;
//   email: string;
//   passportNo: string;
//   expiryDate: string;
// }

// export interface AgentTraveler {
//   id: number;
//   agencyName: string;
//   agentGivenName: string;
//   agentLastName: string;
//   country: string;
//   state: string;
//   email: string;
//   phone: string;
// }

// export interface ItineraryData {
//   id?: string;
//   tripId: string;
//   numberOfTravelers: number;
//   isMasterItinerary: boolean;
//   tripName: string;
//   tripType: string;
//   tripStyle: string;
//   packageType: string;
//   creatingFor: string;
//   showFlightDetails: boolean;
//   showTravelerDetails: boolean;
//   selectedCountries: string[];
//   flights: Flight[];
//   travelers: Traveler[];
//   agentTravelers: AgentTraveler[];
//   routingData?: RoutingData;
//   dayWiseActivities?: DayPlan[];
// }

// interface ItineraryContextType {
//   itineraryData: ItineraryData;
//   updateItineraryData: (data: Partial<ItineraryData>) => void;
//   updateRoutingData: (routingData: RoutingData) => void;
//   saveItinerary: (type: 'quick' | 'full' | 'exit') => Promise<boolean>;
//   loadSavedItinerary: () => void;
//   loadItineraryForEdit: (id: string) => boolean;
//   clearSavedItinerary: () => void;
//   isSaving: boolean;
//   saveSuccess: boolean;
//   saveError: string | null;
//   isEditMode: boolean;
// }

// const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

// const DEFAULT_ITINERARY: ItineraryData = {
//   tripId: '',
//   numberOfTravelers: 2,
//   isMasterItinerary: false,
//   tripName: '',
//   tripType: '',
//   tripStyle: '',
//   packageType: 'land',
//   creatingFor: 'guest',
//   showFlightDetails: false,
//   showTravelerDetails: true,
//   selectedCountries: [],
//   flights: [],
//   travelers: [],
//   agentTravelers: [],
//   routingData: undefined,
//   dayWiseActivities: [],
// };

// export function ItineraryProvider({ children }: { children: React.ReactNode }) {
//   const [itineraryData, setItineraryData] = useState<ItineraryData>(DEFAULT_ITINERARY);
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);
//   const [saveError, setSaveError] = useState<string | null>(null);
//   const [isEditMode, setIsEditMode] = useState(false);

//   // Load from session or local storage on mount
//   useEffect(() => {
//     // 1. Check if we are meant to be editing a specific ID (from Library)
//     const editingId = sessionStorage.getItem('editing_itinerary_id');
    
//     if (editingId) {
//       const loaded = loadItineraryForEdit(editingId);
//       if (loaded) {
//         // Clear the flag so refresh doesn't force reload from library over unsaved changes
//         sessionStorage.removeItem('editing_itinerary_id'); 
//       }
//     } else {
//       // 2. Otherwise load draft if exists
//       loadSavedItinerary();
//     }
//   }, []);

//   const updateItineraryData = (data: Partial<ItineraryData>) => {
//     setItineraryData(prev => ({ ...prev, ...data }));
//   };

//   const updateRoutingData = (routingData: RoutingData) => {
//     setItineraryData(prev => ({ ...prev, routingData }));
//   };


//   // Find the loadSavedItinerary function and update it to this:

//   const loadSavedItinerary = () => {
//     const savedData = loadItineraryFromStorage();
//     if (savedData) {
//       // FIX: Merge savedData onto DEFAULT_ITINERARY
//       // This ensures 'numberOfTravelers' (and future new fields) get their default value (2)
//       // even if the saved draft is old and missing that field.
//       setItineraryData({
//         ...DEFAULT_ITINERARY, 
//         ...savedData
//       } as ItineraryData);
//     } else {
//       setItineraryData(prev => ({
//         ...prev,
//         tripId: `TRIP-${Date.now().toString().slice(-6)}`
//       }));
//     }
//   };

//   const loadItineraryForEdit = (id: string): boolean => {
//     try {
//       const itinerary = getItineraryById(id);
//       if (itinerary) {
//         setItineraryData(itinerary as ItineraryData);
//         setIsEditMode(true);
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Failed to load itinerary for edit:', error);
//       return false;
//     }
//   };

//   const clearSavedItinerary = () => {
//     clearItineraryStorage();
//     setItineraryData({
//         ...DEFAULT_ITINERARY,
//         tripId: `TRIP-${Date.now().toString().slice(-6)}`
//     });
//     setIsEditMode(false);
//   };

//   const saveItinerary = async (type: 'quick' | 'full' | 'exit'): Promise<boolean> => {
//     setIsSaving(true);
//     setSaveSuccess(false);
//     setSaveError(null);

//     try {
//       // Validation Logic
//       if (type === 'full' || type === 'exit') {
//         if (!itineraryData.tripName || itineraryData.tripName.length < 3) {
//           throw new Error('Trip name must be at least 3 characters');
//         }
//         if (itineraryData.selectedCountries.length === 0) {
//           throw new Error('Please select at least one destination country');
//         }
//         // Master itineraries don't strictly require Trip Type/Style immediately, but good practice
//         if (!itineraryData.isMasterItinerary && !itineraryData.tripType && itineraryData.creatingFor !== 'Library') {
//            // Allow lax validation for library creation, strict for Agent/Guest
//            // throw new Error('Please select a trip type');
//         }
//       }

//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 800));

//       if (type === 'exit') {
//         // Save to Permanent Library
//         const success = saveToLibrary(itineraryData as StoredItineraryData);
//         if (!success) {
//           throw new Error('Failed to save itinerary to library');
//         }
//         clearItineraryStorage(); // Clear the draft since we saved permanently
//         setIsEditMode(false);
//       } else {
//         // Save to Draft (LocalStorage)
//         const success = saveItineraryToStorage(itineraryData as StoredItineraryData);
//         if (!success) {
//           throw new Error('Failed to save itinerary draft');
//         }
//       }

//       setSaveSuccess(true);
//       setTimeout(() => {
//         setSaveSuccess(false);
//       }, 3000);

//       return true;
//     } catch (error: any) {
//       console.error('Save error:', error);
//       setSaveError(error.message || 'An error occurred while saving');
//       return false;
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const value: ItineraryContextType = {
//     itineraryData,
//     updateItineraryData,
//     updateRoutingData,
//     saveItinerary,
//     loadSavedItinerary,
//     loadItineraryForEdit,
//     clearSavedItinerary,
//     isSaving,
//     saveSuccess,
//     saveError,
//     isEditMode,
//   };

//   return (
//     <ItineraryContext.Provider value={value}>
//       {children}
//     </ItineraryContext.Provider>
//   );
// }

// export function useItinerary() {
//   const context = useContext(ItineraryContext);
//   if (context === undefined) {
//     throw new Error('useItinerary must be used within an ItineraryProvider');
//   }
//   return context;
// }



































// "use client";

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { 
//   saveItineraryToStorage, 
//   loadItineraryFromStorage, 
//   clearItineraryStorage,
//   saveToLibrary,
//   getItineraryById,
//   StoredItineraryData,
//   RoutingData // <--- IMPORT THIS FROM STORAGE NOW
// } from '@/utils/itineraryStorage';
// import { DayPlan } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';

// // --- Types for Context ---
// export interface Flight {
//   id: number;
//   flightNumber: string;
//   givenName: string;
//   lastName: string;
//   departureDate: string;
//   from: string;
//   takeOff: string;
//   to: string;
//   landing: string;
//   arrivalDate: string;
// }

// export interface Traveler {
//   id: number;
//   leadGuest: boolean;
//   givenName: string;
//   lastName: string;
//   dateOfBirth: string;
//   gender: string;
//   email: string;
//   passportNo: string;
//   expiryDate: string;
// }

// export interface AgentTraveler {
//   id: number;
//   agencyName: string;
//   agentGivenName: string;
//   agentLastName: string;
//   country: string;
//   state: string;
//   email: string;
//   phone: string;
// }

// export interface ItineraryData {
//   id?: string;
//   tripId: string;
//   numberOfTravelers: number;
//   isMasterItinerary: boolean;
//   tripName: string;
//   tripType: string;
//   tripStyle: string;
//   packageType: string;
//   creatingFor: string;
//   showFlightDetails: boolean;
//   showTravelerDetails: boolean;
//   selectedCountries: string[];
//   flights: Flight[];
//   travelers: Traveler[];
//   agentTravelers: AgentTraveler[];
//   routingData?: RoutingData; // This now uses the shared interface
//   dayWiseActivities?: DayPlan[];
// }

// interface ItineraryContextType {
//   itineraryData: ItineraryData;
//   updateItineraryData: (data: Partial<ItineraryData>) => void;
//   updateRoutingData: (routingData: RoutingData) => void;
//   saveItinerary: (type: 'quick' | 'full' | 'exit') => Promise<boolean>;
//   loadSavedItinerary: () => void;
//   loadItineraryForEdit: (id: string) => boolean;
//   clearSavedItinerary: () => void;
//   isSaving: boolean;
//   saveSuccess: boolean;
//   saveError: string | null;
//   isEditMode: boolean;
// }

// const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

// const DEFAULT_ITINERARY: ItineraryData = {
//   tripId: '',
//   numberOfTravelers: 2,
//   isMasterItinerary: false,
//   tripName: '',
//   tripType: '',
//   tripStyle: '',
//   packageType: 'land',
//   creatingFor: 'guest',
//   showFlightDetails: false,
//   showTravelerDetails: true,
//   selectedCountries: [],
//   flights: [],
//   travelers: [],
//   agentTravelers: [],
//   routingData: undefined,
//   dayWiseActivities: [],
// };

// export function ItineraryProvider({ children }: { children: React.ReactNode }) {
//   const [itineraryData, setItineraryData] = useState<ItineraryData>(DEFAULT_ITINERARY);
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);
//   const [saveError, setSaveError] = useState<string | null>(null);
//   const [isEditMode, setIsEditMode] = useState(false);

//   // Load from session or local storage on mount
//   useEffect(() => {
//     // 1. Check if we are meant to be editing a specific ID (from Library)
//     const editingId = sessionStorage.getItem('editing_itinerary_id');
    
//     if (editingId) {
//       const loaded = loadItineraryForEdit(editingId);
//       if (loaded) {
//         // Clear the flag so refresh doesn't force reload from library over unsaved changes
//         sessionStorage.removeItem('editing_itinerary_id'); 
//       }
//     } else {
//       // 2. Otherwise load draft if exists
//       loadSavedItinerary();
//     }
//   }, []);

//   const updateItineraryData = (data: Partial<ItineraryData>) => {
//     setItineraryData(prev => ({ ...prev, ...data }));
//   };

//   const updateRoutingData = (routingData: RoutingData) => {
//     setItineraryData(prev => ({ ...prev, routingData }));
//   };

//   const loadSavedItinerary = () => {
//     const savedData = loadItineraryFromStorage();
//     if (savedData) {
//       // FIX: Merge savedData onto DEFAULT_ITINERARY
//       // This ensures 'numberOfTravelers' (and future new fields) get their default value (2)
//       // even if the saved draft is old and missing that field.
//       setItineraryData({
//         ...DEFAULT_ITINERARY, 
//         ...savedData
//       } as ItineraryData);
//     } else {
//       setItineraryData(prev => ({
//         ...prev,
//         tripId: `TRIP-${Date.now().toString().slice(-6)}`
//       }));
//     }
//   };

//   const loadItineraryForEdit = (id: string): boolean => {
//     try {
//       const itinerary = getItineraryById(id);
//       if (itinerary) {
//         setItineraryData(itinerary as ItineraryData);
//         setIsEditMode(true);
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Failed to load itinerary for edit:', error);
//       return false;
//     }
//   };

//   const clearSavedItinerary = () => {
//     clearItineraryStorage();
//     setItineraryData({
//         ...DEFAULT_ITINERARY,
//         tripId: `TRIP-${Date.now().toString().slice(-6)}`
//     });
//     setIsEditMode(false);
//   };

//   const saveItinerary = async (type: 'quick' | 'full' | 'exit'): Promise<boolean> => {
//     setIsSaving(true);
//     setSaveSuccess(false);
//     setSaveError(null);

//     try {
//       // Validation Logic
//       if (type === 'full' || type === 'exit') {
//         if (!itineraryData.tripName || itineraryData.tripName.length < 3) {
//           throw new Error('Trip name must be at least 3 characters');
//         }
//         if (itineraryData.selectedCountries.length === 0) {
//           throw new Error('Please select at least one destination country');
//         }
//         // Master itineraries don't strictly require Trip Type/Style immediately, but good practice
//         if (!itineraryData.isMasterItinerary && !itineraryData.tripType && itineraryData.creatingFor !== 'Library') {
//            // Allow lax validation for library creation, strict for Agent/Guest
//            // throw new Error('Please select a trip type');
//         }
//       }

//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 800));

//       if (type === 'exit') {
//         // Save to Permanent Library
//         const success = saveToLibrary(itineraryData as StoredItineraryData);
//         if (!success) {
//           throw new Error('Failed to save itinerary to library');
//         }
//         clearItineraryStorage(); // Clear the draft since we saved permanently
//         setIsEditMode(false);
//       } else {
//         // Save to Draft (LocalStorage)
//         const success = saveItineraryToStorage(itineraryData as StoredItineraryData);
//         if (!success) {
//           throw new Error('Failed to save itinerary draft');
//         }
//       }

//       setSaveSuccess(true);
//       setTimeout(() => {
//         setSaveSuccess(false);
//       }, 3000);

//       return true;
//     } catch (error: any) {
//       console.error('Save error:', error);
//       setSaveError(error.message || 'An error occurred while saving');
//       return false;
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const value: ItineraryContextType = {
//     itineraryData,
//     updateItineraryData,
//     updateRoutingData,
//     saveItinerary,
//     loadSavedItinerary,
//     loadItineraryForEdit,
//     clearSavedItinerary,
//     isSaving,
//     saveSuccess,
//     saveError,
//     isEditMode,
//   };

//   return (
//     <ItineraryContext.Provider value={value}>
//       {children}
//     </ItineraryContext.Provider>
//   );
// }

// export function useItinerary() {
//   const context = useContext(ItineraryContext);
//   if (context === undefined) {
//     throw new Error('useItinerary must be used within an ItineraryProvider');
//   }
//   return context;
// } 




































// "use client";

// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { 
//   saveItineraryToStorage, 
//   loadItineraryFromStorage, 
//   clearItineraryStorage,
//   saveToLibrary,
//   getItineraryById,
//   StoredItineraryData,
//   RoutingData 
// } from '@/utils/itineraryStorage';

// // Use strict types for Context to match Storage
// export interface ItineraryData extends StoredItineraryData {}

// interface ItineraryContextType {
//   itineraryData: ItineraryData;
//   updateItineraryData: (data: Partial<ItineraryData>) => void;
//   updateRoutingData: (routingData: RoutingData) => void;
//   saveItinerary: (type: 'quick' | 'full' | 'exit') => Promise<boolean>;
//   loadSavedItinerary: () => void;
//   loadItineraryForEdit: (id: string) => boolean;
//   clearSavedItinerary: () => void;
//   isSaving: boolean;
//   saveSuccess: boolean;
// }

// const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

// // Define Defaults
// const DEFAULT_ITINERARY: ItineraryData = {
//   tripId: '',
//   numberOfTravelers: 2,
//   isMasterItinerary: false,
//   tripName: '',
//   tripType: '',
//   tripStyle: '',
//   packageType: 'land',
//   creatingFor: 'guest',
//   showFlightDetails: false,
//   showTravelerDetails: true,
//   selectedCountries: [],
//   flights: [],
//   travelers: [],
//   agentTravelers: [],
//   routingData: undefined, // undefined initially
//   dayWiseActivities: [],
// };

// export function ItineraryProvider({ children }: { children: React.ReactNode }) {
//   const [itineraryData, setItineraryData] = useState<ItineraryData>(DEFAULT_ITINERARY);
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);

//   // --- 1. INITIAL LOAD ---
//   useEffect(() => {
//     // Check session for edit mode or load draft
//     const editingId = sessionStorage.getItem('editing_itinerary_id');
//     if (editingId) {
//       loadItineraryForEdit(editingId);
//       sessionStorage.removeItem('editing_itinerary_id');
//     } else {
//       loadSavedItinerary();
//     }
//   }, []);

//   // --- 2. UPDATE HANDLERS ---
//   const updateItineraryData = useCallback((data: Partial<ItineraryData>) => {
//     setItineraryData(prev => ({ ...prev, ...data }));
//   }, []);

//   const updateRoutingData = useCallback((routingData: RoutingData) => {
//     setItineraryData(prev => {
//       // JSON Stringify Comparison to prevent infinite loops in useEffects
//       if (JSON.stringify(prev.routingData) === JSON.stringify(routingData)) {
//         return prev;
//       }
//       return { ...prev, routingData };
//     });
//   }, []);

//   // --- 3. LOAD/SAVE LOGIC ---
//   const loadSavedItinerary = () => {
//     const savedData = loadItineraryFromStorage();
//     if (savedData) {
//       console.log("Context: Loaded Saved Draft", savedData.tripId);
//       setItineraryData({ ...DEFAULT_ITINERARY, ...savedData });
//     } else {
//       console.log("Context: New Trip Initialized");
//       setItineraryData(prev => ({ 
//         ...prev, 
//         tripId: `TRIP-${Date.now().toString().slice(-6)}` 
//       }));
//     }
//   };

//   const loadItineraryForEdit = (id: string): boolean => {
//     const data = getItineraryById(id);
//     if (data) {
//       setItineraryData(data);
//       return true;
//     }
//     return false;
//   };

//   // const clearSavedItinerary = () => {
//   //   clearItineraryStorage();
//   //   setItineraryData({ ...DEFAULT_ITINERARY, tripId: `TRIP-${Date.now().toString().slice(-6)}` });
//   // };

//   const clearSavedItinerary = () => {
//     clearItineraryStorage(); // 1. Wipes LocalStorage
//     setItineraryData({ 
//         ...DEFAULT_ITINERARY, 
//         tripId: `TRIP-${Date.now().toString().slice(-6)}` // 2. Resets State with new ID
//     });
//   };

//   const saveItinerary = async (type: 'quick' | 'full' | 'exit'): Promise<boolean> => {
//     setIsSaving(true);
//     try {
//       // Simulate network delay for UX
//       await new Promise(r => setTimeout(r, 500));

//       if (type === 'exit') {
//         saveToLibrary(itineraryData);
//         clearItineraryStorage();
//       } else {
//         // Quick Save / Full Save -> Local Storage
//         saveItineraryToStorage(itineraryData);
//       }

//       setSaveSuccess(true);
//       setTimeout(() => setSaveSuccess(false), 2000);
//       return true;
//     } catch (e) {
//       console.error(e);
//       return false;
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <ItineraryContext.Provider value={{
//       itineraryData,
//       updateItineraryData,
//       updateRoutingData,
//       saveItinerary,
//       loadSavedItinerary,
//       loadItineraryForEdit,
//       clearSavedItinerary,
//       isSaving,
//       saveSuccess
//     }}>
//       {children}
//     </ItineraryContext.Provider>
//   );
// }

// export function useItinerary() {
//   const context = useContext(ItineraryContext);
//   if (context === undefined) throw new Error('useItinerary must be used within Provider');
//   return context;
// } 


































"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  saveItineraryToStorage, 
  loadItineraryFromStorage, 
  clearItineraryStorage,
  saveToLibrary, // We need this for Quick Save too
  getItineraryById,
  StoredItineraryData,
  RoutingData 
} from '@/utils/itineraryStorage';

export interface ItineraryData extends StoredItineraryData {}

interface ItineraryContextType {
  itineraryData: ItineraryData;
  updateItineraryData: (data: Partial<ItineraryData>) => void;
  updateRoutingData: (routingData: RoutingData) => void;
  saveItinerary: (type: 'quick' | 'full' | 'exit') => Promise<boolean>;
  loadSavedItinerary: () => void;
  loadItineraryForEdit: (id: string) => boolean;
  clearSavedItinerary: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

// Define Defaults
const DEFAULT_ITINERARY: ItineraryData = {
  tripId: '',
  numberOfTravelers: 2,
  isMasterItinerary: false,
  tripName: '',
  tripType: '',
  tripStyle: '',
  packageType: 'land',
  creatingFor: 'guest',
  showFlightDetails: false,
  showTravelerDetails: true,
  selectedCountries: [],
  selectedCurrency: 'USD',
  flights: [],
  travelers: [],
  agentTravelers: [],
  routingData: undefined,
  dayWiseActivities: [],
};

export function ItineraryProvider({ children }: { children: React.ReactNode }) {
  const [itineraryData, setItineraryData] = useState<ItineraryData>(DEFAULT_ITINERARY);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const editingId = sessionStorage.getItem('editing_itinerary_id');
    if (editingId) {
      loadItineraryForEdit(editingId);
      sessionStorage.removeItem('editing_itinerary_id');
    } else {
      loadSavedItinerary();
    }
  }, []);

  const updateItineraryData = useCallback((data: Partial<ItineraryData>) => {
    setItineraryData(prev => ({ ...prev, ...data }));
  }, []);

  const updateRoutingData = useCallback((routingData: RoutingData) => {
    setItineraryData(prev => {
      if (JSON.stringify(prev.routingData) === JSON.stringify(routingData)) return prev;
      return { ...prev, routingData };
    });
  }, []);

  const loadSavedItinerary = () => {
    const savedData = loadItineraryFromStorage();
    if (savedData) {
      setItineraryData({ ...DEFAULT_ITINERARY, ...savedData });
    } else {
      setItineraryData({ ...DEFAULT_ITINERARY, tripId: `TRIP-${Date.now().toString().slice(-6)}` });
    }
  };

  const loadItineraryForEdit = (id: string): boolean => {
    const data = getItineraryById(id);
    if (data) {
      setItineraryData(data);
      // Also update the draft storage immediately so refreshing the page works
      saveItineraryToStorage(data);
      return true;
    }
    return false;
  };

  const clearSavedItinerary = () => {
    clearItineraryStorage();
    setItineraryData({ 
        ...DEFAULT_ITINERARY, 
        tripId: `TRIP-${Date.now().toString().slice(-6)}` 
    });
  };

 const saveItinerary = async (type: 'quick' | 'full' | 'exit'): Promise<boolean> => {
    setIsSaving(true);
    try {
      // 1. Ensure Currency is set before saving
      const dataToSave = {
          ...itineraryData,
          selectedCurrency: itineraryData.selectedCurrency || 'USD' 
      };

      // 2. Always save to Draft (LocalStorage) for immediate reload safety
      saveItineraryToStorage(dataToSave);

      // 3. CRITICAL FIX: Update Library on Quick Save too if ID exists
      if (type === 'exit' || itineraryData.id) {
        saveToLibrary(dataToSave);
      }

      // 4. Only clear draft if actually exiting
      if (type === 'exit') {
        clearItineraryStorage();
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ItineraryContext.Provider value={{
      itineraryData,
      updateItineraryData,
      updateRoutingData,
      saveItinerary,
      loadSavedItinerary,
      loadItineraryForEdit,
      clearSavedItinerary,
      isSaving,
      saveSuccess
    }}>
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (context === undefined) throw new Error('useItinerary must be used within Provider');
  return context;
}