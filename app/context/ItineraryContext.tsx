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


































// "use client";

// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { 
//   saveItineraryToStorage, 
//   loadItineraryFromStorage, 
//   clearItineraryStorage,
//   saveToLibrary, // We need this for Quick Save too
//   getItineraryById,
//   StoredItineraryData,
//   RoutingData 
// } from '@/utils/itineraryStorage';

// export interface ItineraryData extends StoredItineraryData {
//   tripCategory: string;
//   tripExperience: string;
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
//   selectedCurrency: 'USD',
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

//   useEffect(() => {
//     const editingId = sessionStorage.getItem('editing_itinerary_id');
//     if (editingId) {
//       loadItineraryForEdit(editingId);
//       sessionStorage.removeItem('editing_itinerary_id');
//     } else {
//       loadSavedItinerary();
//     }
//   }, []);

//   const updateItineraryData = useCallback((data: Partial<ItineraryData>) => {
//     setItineraryData(prev => ({ ...prev, ...data }));
//   }, []);

//   const updateRoutingData = useCallback((routingData: RoutingData) => {
//     setItineraryData(prev => {
//       if (JSON.stringify(prev.routingData) === JSON.stringify(routingData)) return prev;
//       return { ...prev, routingData };
//     });
//   }, []);

//   const loadSavedItinerary = () => {
//     const savedData = loadItineraryFromStorage();
//     if (savedData) {
//       setItineraryData({ ...DEFAULT_ITINERARY, ...savedData });
//     } else {
//       setItineraryData({ ...DEFAULT_ITINERARY, tripId: `TRIP-${Date.now().toString().slice(-6)}` });
//     }
//   };

//   const loadItineraryForEdit = (id: string): boolean => {
//     const data = getItineraryById(id);
//     if (data) {
//       setItineraryData(data);
//       // Also update the draft storage immediately so refreshing the page works
//       saveItineraryToStorage(data);
//       return true;
//     }
//     return false;
//   };

//   const clearSavedItinerary = () => {
//     clearItineraryStorage();
//     setItineraryData({ 
//         ...DEFAULT_ITINERARY, 
//         tripId: `TRIP-${Date.now().toString().slice(-6)}` 
//     });
//   };

//  const saveItinerary = async (type: 'quick' | 'full' | 'exit'): Promise<boolean> => {
//     setIsSaving(true);
//     try {
//       // 1. Ensure Currency is set before saving
//       const dataToSave = {
//           ...itineraryData,
//           selectedCurrency: itineraryData.selectedCurrency || 'USD' 
//       };

//       // 2. Always save to Draft (LocalStorage) for immediate reload safety
//       saveItineraryToStorage(dataToSave);

//       // 3. CRITICAL FIX: Update Library on Quick Save too if ID exists
//       if (type === 'exit' || itineraryData.id) {
//         saveToLibrary(dataToSave);
//       }

//       // 4. Only clear draft if actually exiting
//       if (type === 'exit') {
//         clearItineraryStorage();
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

// // 1. Define the Stepper Structure
// export interface StepperStatus {
//   intro: 'completed' | 'incomplete';
//   routing: 'locked' | 'unlocked' | 'completed';
//   createDay: 'locked' | 'unlocked' | 'completed';
//   costing: 'locked' | 'unlocked' | 'completed';
//   preview: 'locked' | 'unlocked' | 'completed';
// }

// export interface ItineraryData extends StoredItineraryData {
//   tripCategory: string;
//   tripExperience: string;
//   // 2. Add Stepper Status to Data
//   stepperStatus: StepperStatus; 
// }

// interface ItineraryContextType {
//   itineraryData: ItineraryData;
//   updateItineraryData: (data: Partial<ItineraryData>) => void;
//   updateRoutingData: (routingData: RoutingData) => void;
//   saveItinerary: (type: 'quick' | 'full' | 'exit') => Promise<boolean>;
//   loadSavedItinerary: () => void;
//   loadItineraryForEdit: (id: string) => boolean;
//   clearSavedItinerary: () => void;
//   // 3. New Helper to Unlock Steps
//   completeStep: (step: keyof StepperStatus) => void; 
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
//   selectedCurrency: 'USD',
//   flights: [],
//   travelers: [],
//   agentTravelers: [],
//   routingData: undefined,
//   dayWiseActivities: [],
//   // 4. Default Lock State: Only Intro is open
//   stepperStatus: {
//     intro: 'incomplete',
//     routing: 'locked',
//     createDay: 'locked',
//     costing: 'locked',
//     preview: 'locked'
//   }
// };

// export function ItineraryProvider({ children }: { children: React.ReactNode }) {
//   const [itineraryData, setItineraryData] = useState<ItineraryData>(DEFAULT_ITINERARY);
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);

//   useEffect(() => {
//     const editingId = sessionStorage.getItem('editing_itinerary_id');
//     if (editingId) {
//       loadItineraryForEdit(editingId);
//       sessionStorage.removeItem('editing_itinerary_id');
//     } else {
//       loadSavedItinerary();
//     }
//   }, []);

//   const updateItineraryData = useCallback((data: Partial<ItineraryData>) => {
//     setItineraryData(prev => ({ ...prev, ...data }));
//   }, []);

//   // 5. The Logic to Unlock the NEXT step
//   const completeStep = useCallback((step: keyof StepperStatus) => {
//     setItineraryData(prev => {
//         const newStatus = { ...prev.stepperStatus };
        
//         // Mark current as completed
//         newStatus[step] = 'completed';

//         // Unlock the next logical step
//         if (step === 'intro') newStatus.routing = 'unlocked';
//         if (step === 'routing') newStatus.createDay = 'unlocked';
//         if (step === 'createDay') newStatus.costing = 'unlocked';
//         if (step === 'costing') newStatus.preview = 'unlocked';

//         const updatedData = { ...prev, stepperStatus: newStatus };
//         saveItineraryToStorage(updatedData); // Auto-save progress
//         return updatedData;
//     });
//   }, []);

//   const updateRoutingData = useCallback((routingData: RoutingData) => {
//     setItineraryData(prev => {
//       if (JSON.stringify(prev.routingData) === JSON.stringify(routingData)) return prev;
//       return { ...prev, routingData };
//     });
//   }, []);

//   const loadSavedItinerary = () => {
//     const savedData = loadItineraryFromStorage();
//     if (savedData) {
//       // Ensure stepperStatus exists for old data
//       const mergedData = { ...DEFAULT_ITINERARY, ...savedData };
//       if(!mergedData.stepperStatus) mergedData.stepperStatus = DEFAULT_ITINERARY.stepperStatus;
//       setItineraryData(mergedData);
//     } else {
//       setItineraryData({ ...DEFAULT_ITINERARY, tripId: `TRIP-${Date.now().toString().slice(-6)}` });
//     }
//   };

//   const loadItineraryForEdit = (id: string): boolean => {
//     const data = getItineraryById(id);
//     if (data) {
//       // Ensure stepperStatus exists
//       const mergedData = { ...DEFAULT_ITINERARY, ...data };
//       setItineraryData(mergedData);
//       saveItineraryToStorage(mergedData);
//       return true;
//     }
//     return false;
//   };

//   const clearSavedItinerary = () => {
//     clearItineraryStorage();
//     setItineraryData({ 
//         ...DEFAULT_ITINERARY, 
//         tripId: `TRIP-${Date.now().toString().slice(-6)}` 
//     });
//   };

//  const saveItinerary = async (type: 'quick' | 'full' | 'exit'): Promise<boolean> => {
//     setIsSaving(true);
//     try {
//       const dataToSave = {
//           ...itineraryData,
//           selectedCurrency: itineraryData.selectedCurrency || 'USD' 
//       };
//       saveItineraryToStorage(dataToSave);
//       if (type === 'exit' || itineraryData.id) {
//         saveToLibrary(dataToSave);
//       }
//       if (type === 'exit') {
//         clearItineraryStorage();
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
//       completeStep, // Export function
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

// // 1. DEFINE STATUS TYPES
// export type ItineraryStatus = 'draft' | 'pending_costing' | 'approved';

// export interface StepperStatus {
//   intro: 'completed' | 'incomplete';
//   routing: 'locked' | 'unlocked' | 'completed';
//   createDay: 'locked' | 'unlocked' | 'completed';
//   costing: 'locked' | 'unlocked' | 'completed';
//   preview: 'locked' | 'unlocked' | 'completed';
// }

// export interface ItineraryData extends StoredItineraryData {
//   tripCategory: string;
//   tripExperience: string;
//   stepperStatus: StepperStatus; 
//   status: ItineraryStatus; // <--- NEW FIELD
// }

// interface ItineraryContextType {
//   itineraryData: ItineraryData;
//   updateItineraryData: (data: Partial<ItineraryData>) => void;
//   updateRoutingData: (routingData: RoutingData) => void;
//   saveItinerary: (type: 'quick' | 'full' | 'exit') => Promise<boolean>;
//   loadSavedItinerary: () => void;
//   loadItineraryForEdit: (id: string) => boolean;
//   clearSavedItinerary: () => void;
  
//   // Workflow Actions
//   completeStep: (step: keyof StepperStatus) => void; 
//   submitForCosting: () => void; // <--- NEW: Employee Action
//   approveCosting: () => void;   // <--- NEW: Admin Action
  
//   isSaving: boolean;
//   saveSuccess: boolean;
// }

// const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

// // DEFAULT STATE
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
//   selectedCurrency: 'USD',
//   flights: [],
//   travelers: [],
//   agentTravelers: [],
//   routingData: undefined,
//   dayWiseActivities: [],
//   status: 'draft', // Default is draft
//   stepperStatus: {
//     intro: 'incomplete',
//     routing: 'locked',
//     createDay: 'locked',
//     costing: 'locked',
//     preview: 'locked'
//   }
// };

// export function ItineraryProvider({ children }: { children: React.ReactNode }) {
//   const [itineraryData, setItineraryData] = useState<ItineraryData>(DEFAULT_ITINERARY);
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);

//   useEffect(() => {
//     const editingId = sessionStorage.getItem('editing_itinerary_id');
//     if (editingId) {
//       loadItineraryForEdit(editingId);
//       sessionStorage.removeItem('editing_itinerary_id');
//     } else {
//       loadSavedItinerary();
//     }
//   }, []);

//   const updateItineraryData = useCallback((data: Partial<ItineraryData>) => {
//     setItineraryData(prev => ({ ...prev, ...data }));
//   }, []);

//   const updateRoutingData = useCallback((routingData: RoutingData) => {
//     setItineraryData(prev => {
//       if (JSON.stringify(prev.routingData) === JSON.stringify(routingData)) return prev;
//       return { ...prev, routingData };
//     });
//   }, []);

//   // --- WORKFLOW LOGIC ---

//   // 1. Normal Step Completion (Internal Logic)
//   const completeStep = useCallback((step: keyof StepperStatus) => {
//     setItineraryData(prev => {
//         const newStatus = { ...prev.stepperStatus };
//         newStatus[step] = 'completed';

//         // Standard unlocking flow
//         if (step === 'intro') newStatus.routing = 'unlocked';
//         if (step === 'routing') newStatus.createDay = 'unlocked';
//         // Note: We DO NOT automatically unlock Costing here anymore if we want strict handoff
//         // But for UI flow, we can leave it 'unlocked' but protected by the Page Guard.
//         if (step === 'createDay') newStatus.costing = 'unlocked'; 

//         const updatedData = { ...prev, stepperStatus: newStatus };
//         saveItineraryToStorage(updatedData);
//         return updatedData;
//     });
//   }, []);

//   // 2. Employee Submits -> Locks Itinerary
//   const submitForCosting = useCallback(() => {
//     setItineraryData(prev => {
//       const updated = {
//         ...prev,
//         status: 'pending_costing', // Change Status
//         // Optionally lock previous steps here if desired
//       } as ItineraryData;
      
//       saveItineraryToStorage(updated);
//       saveToLibrary(updated); // Persist to "DB"
//       return updated;
//     });
//   }, []);

//   // 3. Admin Approves -> Unlocks Preview
//   const approveCosting = useCallback(() => {
//     setItineraryData(prev => {
//       const newStepper = { ...prev.stepperStatus, costing: 'completed', preview: 'unlocked' } as StepperStatus;
//       const updated = {
//         ...prev,
//         status: 'approved',
//         stepperStatus: newStepper
//       } as ItineraryData;

//       saveItineraryToStorage(updated);
//       saveToLibrary(updated);
//       return updated;
//     });
//   }, []);

//   // --- STORAGE LOADERS ---

//   const loadSavedItinerary = () => {
//     const savedData = loadItineraryFromStorage();
//     if (savedData) {
//       const mergedData = { ...DEFAULT_ITINERARY, ...savedData };
//       // Ensure complex objects exist
//       if(!mergedData.stepperStatus) mergedData.stepperStatus = DEFAULT_ITINERARY.stepperStatus;
//       if(!mergedData.status) mergedData.status = 'draft';
//       setItineraryData(mergedData);
//     } else {
//       setItineraryData({ ...DEFAULT_ITINERARY, tripId: `TRIP-${Date.now().toString().slice(-6)}` });
//     }
//   };

//   const loadItineraryForEdit = (id: string): boolean => {
//     const data = getItineraryById(id);
//     if (data) {
//       // @ts-ignore - quick fix for type mismatch if storage is old
//       const mergedData = { ...DEFAULT_ITINERARY, ...data };
//       setItineraryData(mergedData);
//       saveItineraryToStorage(mergedData);
//       return true;
//     }
//     return false;
//   };

//   const clearSavedItinerary = () => {
//     clearItineraryStorage();
//     setItineraryData({ 
//         ...DEFAULT_ITINERARY, 
//         tripId: `TRIP-${Date.now().toString().slice(-6)}` 
//     });
//   };

//  const saveItinerary = async (type: 'quick' | 'full' | 'exit'): Promise<boolean> => {
//     setIsSaving(true);
//     try {
//       const dataToSave = { ...itineraryData };
//       saveItineraryToStorage(dataToSave);
      
//       if (type === 'exit' || itineraryData.id) {
//         saveToLibrary(dataToSave);
//       }
//       if (type === 'exit') {
//         clearItineraryStorage();
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
//       completeStep,
//       submitForCosting, // Exported
//       approveCosting,   // Exported
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

// // --- 1. TYPE DEFINITIONS ---

// // Workflow Status (Draft -> Pending -> Approved)
// export type ItineraryStatus = 'draft' | 'pending_costing' | 'approved' | 'active' | 'archived';

// // Stepper Locks (Locked -> Unlocked -> Completed)
// export interface StepperStatus {
//   intro: 'completed' | 'incomplete';
//   routing: 'locked' | 'unlocked' | 'completed';
//   createDay: 'locked' | 'unlocked' | 'completed';
//   costing: 'locked' | 'unlocked' | 'completed';
//   preview: 'locked' | 'unlocked' | 'completed';
// }

// // Main Data Interface
// export interface ItineraryData extends Omit<StoredItineraryData, 'status' | 'startDate'> {
//   tripCategory: string;
//   tripExperience: string;
//   stepperStatus: StepperStatus;
//   // Allow both our extended workflow statuses and the stored status values to keep compatibility
//   status: ItineraryStatus | StoredItineraryData['status'];
// }

// // Context Interface
// interface ItineraryContextType {
//   itineraryData: ItineraryData;
//   updateItineraryData: (data: Partial<ItineraryData>) => void;
//   updateRoutingData: (routingData: RoutingData) => void;
//   saveItinerary: (type: 'quick' | 'full' | 'exit') => Promise<boolean>;
//   loadSavedItinerary: () => void;
//   loadItineraryForEdit: (id: string) => boolean;
//   clearSavedItinerary: () => void;
  
//   // Workflow Actions
//   completeStep: (step: keyof StepperStatus) => void; 
//   submitForCosting: () => void; // Employee Action
//   approveCosting: () => void;   // Admin Action
  
//   isSaving: boolean;
//   saveSuccess: boolean;


//   // 👇 ADD TOAST STATE
//   toastMessage: { message: string, type: 'success' | 'error' } | null;
//   showToast: (msg: string, type: 'success' | 'error') => void;
// }

// const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

// // --- 2. DEFAULT STATE ---
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
//   selectedCurrency: 'USD',
//   flights: [],
//   travelers: [],
//   agentTravelers: [],
//   routingData: undefined,
//   dayWiseActivities: [],

//   // Compatibility / new fields required by ItineraryData
//   tripCategory: '',
//   tripExperience: '',
  

//   // Default Workflow State
//   status: 'draft', 
//   stepperStatus: {
//     intro: 'incomplete',
//     routing: 'locked',
//     createDay: 'locked',
//     costing: 'locked',
//     preview: 'locked'
//   }
// };

// export function ItineraryProvider({ children }: { children: React.ReactNode }) {
//   const [itineraryData, setItineraryData] = useState<ItineraryData>(DEFAULT_ITINERARY);
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);

//   // 👇 1. ADD TOAST STATE
//   const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

//   // 👇 2. HELPER TO SHOW TOAST
//   const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
//     setToastMessage({ message, type });
//     setTimeout(() => setToastMessage(null), 3000); // Auto-hide after 3 seconds
//   }, []);

//   // 👇 3. EMPLOYEE: SUBMIT ACTION
//   const submitForCosting = useCallback(() => {
//     setItineraryData(prev => {
//       const updated = { ...prev, status: 'pending_costing' as const };
//       saveItineraryToStorage(updated); // Save to LocalStorage
//       return updated;
//     });
//     showToast("Request sent to Admin! Waiting for approval.", "success");
//   }, []);

//   // 👇 4. ADMIN: APPROVE ACTION
//   const approveCosting = useCallback(() => {
//     setItineraryData(prev => {
//       const updated = { ...prev, status: 'approved' as const };
//       saveItineraryToStorage(updated); // Save to LocalStorage
//       return updated;
//     });
//     showToast("Costing Approved! Employee can now see Preview.", "success");
//   }, []);

//   // --- 3. INITIALIZATION ---
//   useEffect(() => {
//     const editingId = sessionStorage.getItem('editing_itinerary_id');
//     if (editingId) {
//       loadItineraryForEdit(editingId);
//       sessionStorage.removeItem('editing_itinerary_id');
//     } else {
//       loadSavedItinerary();
//     }
//   }, []);

//   // --- 4. CORE UPDATERS ---
//   const updateItineraryData = useCallback((data: Partial<ItineraryData>) => {
//     setItineraryData(prev => ({ ...prev, ...data }));
//   }, []);

//   const updateRoutingData = useCallback((routingData: RoutingData) => {
//     setItineraryData(prev => {
//       // Prevent infinite loops if data is identical
//       if (JSON.stringify(prev.routingData) === JSON.stringify(routingData)) return prev;
//       return { ...prev, routingData };
//     });
//   }, []);

//   // --- 5. WORKFLOW ACTIONS (THE KEY PART) ---

//   // Standard Step Completion (e.g. Intro -> Routing)
//   const completeStep = useCallback((step: keyof StepperStatus) => {
//     setItineraryData(prev => {
//         const newStatus = { ...prev.stepperStatus };
//         newStatus[step] = 'completed';

//         // Unlock next step logic
//         if (step === 'intro') newStatus.routing = 'unlocked';
//         if (step === 'routing') newStatus.createDay = 'unlocked';
        
//         // IMPORTANT: We do NOT auto-unlock Costing here. 
//         // Costing is unlocked only via submitForCosting() or by Admin role check on the page.
//         // But for UI visibility, we can mark it 'unlocked' so the sidebar link works, 
//         // and let the Page Guard handle the security.
//         if (step === 'createDay') newStatus.costing = 'unlocked'; 

//         const updatedData = { ...prev, stepperStatus: newStatus };
//         saveItineraryToStorage(updatedData);
//         return updatedData;
//     });
//   }, []);

//   // Employee: Submit for Costing
//   const submitForCosting = useCallback(() => {
//     setItineraryData(prev => {
//       const updated = {
//         ...prev,
//         status: 'pending_costing' as ItineraryStatus, // TypeScript Cast
//       };
      
//       saveItineraryToStorage(updated);
//       saveToLibrary(updated);
//       return updated;
//     });
//   }, []);

//   // Admin: Approve Costing
//   const approveCosting = useCallback(() => {
//     setItineraryData(prev => {
//       const newStepper = { 
//         ...prev.stepperStatus, 
//         costing: 'completed', 
//         preview: 'unlocked' 
//       } as StepperStatus;

//       const updated = {
//         ...prev,
//         status: 'approved' as ItineraryStatus,
//         stepperStatus: newStepper
//       };

//       saveItineraryToStorage(updated);
//       saveToLibrary(updated);
//       return updated;
//     });
//   }, []);

//   // --- 6. STORAGE HANDLERS ---

//   const loadSavedItinerary = () => {
//     const savedData = loadItineraryFromStorage();
//     if (savedData) {
//       // Merge saved data with defaults to ensure new fields (status, stepper) exist
//       const mergedData = { ...DEFAULT_ITINERARY, ...savedData };
      
//       // Safety check for old data formats
//       if(!mergedData.stepperStatus) mergedData.stepperStatus = DEFAULT_ITINERARY.stepperStatus;
//       if(!mergedData.status) mergedData.status = 'draft';
      
//       setItineraryData(mergedData);
//     } else {
//       setItineraryData({ 
//         ...DEFAULT_ITINERARY, 
//         tripId: `TRIP-${Date.now().toString().slice(-6)}` 
//       });
//     }
//   };

//   const loadItineraryForEdit = (id: string): boolean => {
//     const data = getItineraryById(id);
//     if (data) {
//       // Merge raw stored data with defaults, then normalize fields that may come from older schemas
//       const raw = { ...DEFAULT_ITINERARY, ...data } as any;

//       // Normalize status to one of ItineraryStatus values
//       const allowedStatuses = ['draft', 'pending_costing', 'approved'] as const;
//       const normalizedStatus: ItineraryStatus = allowedStatuses.includes(raw.status) ? raw.status : 'draft';

//       // Ensure stepperStatus exists and has a fallback
//       const normalizedStepper: StepperStatus = raw.stepperStatus ?? DEFAULT_ITINERARY.stepperStatus;

//       const mergedData: ItineraryData = {
//         ...DEFAULT_ITINERARY,
//         ...raw,
//         status: normalizedStatus,
//         stepperStatus: normalizedStepper
//       };

//       setItineraryData(mergedData);
//       saveItineraryToStorage(mergedData);
//       return true;
//     }
//     return false;
//   };

//   const clearSavedItinerary = () => {
//     clearItineraryStorage();
//     setItineraryData({ 
//         ...DEFAULT_ITINERARY, 
//         tripId: `TRIP-${Date.now().toString().slice(-6)}` 
//     });
//   };

//  const saveItinerary = async (type: 'quick' | 'full' | 'exit'): Promise<boolean> => {
//     setIsSaving(true);
//     try {
//       const dataToSave = { 
//           ...itineraryData,
//           selectedCurrency: itineraryData.selectedCurrency || 'USD' 
//       };
      
//       saveItineraryToStorage(dataToSave as StoredItineraryData);
      
//       if (type === 'exit' || itineraryData.id) {
//         saveToLibrary(dataToSave as StoredItineraryData);
//       }
//       if (type === 'exit') {
//         clearItineraryStorage();
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
      
//       // Exporting the new actions
//       completeStep,
//       submitForCosting,
//       approveCosting,

//       // 👇 PASS NEW VALUES
  
//       toastMessage,
//       showToast,
      
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
  saveToLibrary, 
  getItineraryById,
  StoredItineraryData,
  RoutingData 
} from '@/utils/itineraryStorage';

// --- 1. TYPE DEFINITIONS ---

// Workflow Status
// app/context/ItineraryContext.tsx

export type ItineraryStatus = 'draft' | 'pending_costing' | 'approved' | 'reedit_requested' | 'active' | 'archived';
// Stepper Locks
export interface StepperStatus {
  intro: 'completed' | 'incomplete';
  routing: 'locked' | 'unlocked' | 'completed';
  createDay: 'locked' | 'unlocked' | 'completed';
  review: 'locked' | 'unlocked' | 'completed';
  costing: 'locked' | 'unlocked' | 'completed';
  preview: 'locked' | 'unlocked' | 'completed';
}


// 👇 NEW: Audit Log Interfaces
export interface AuditLogEntry {
  version: string;
  action: 'ADD' | 'EDIT' | 'DELETE' | 'STATUS';
  module: string;
  details: string;
  userRole: string;
  timestamp: string;
}

// Main Data Interface
export interface ItineraryData extends Omit<StoredItineraryData, 'status'> {
  companyMarkup: number;
  tripCategory: string;
  tripExperience: string;
  stepperStatus: StepperStatus;
  status: ItineraryStatus; // Explicitly enforce our status type
  // 👇 NEW FIELDS ADDED HERE
  currentVersion: string; 
  auditLog: AuditLogEntry[];

  
}

// Context Interface
interface ItineraryContextType {
  itineraryData: ItineraryData;
  updateItineraryData: (data: Partial<ItineraryData>) => void;
  updateRoutingData: (routingData: RoutingData) => void;
  saveItinerary: (type: 'quick' | 'full' | 'exit') => Promise<boolean>;
  loadSavedItinerary: () => void;
  loadItineraryForEdit: (id: string) => boolean;
  clearSavedItinerary: () => void;
  
  // Workflow Actions
  completeStep: (step: keyof StepperStatus) => void; 
  submitForCosting: () => void;
  approveCosting: () => void;

  // 👇 ADD THIS NEW FUNCTION DEFINITION
  rejectCosting: (reason: string) => void;

  revertToPending: () => void;


  requestReEdit: (reason: string) => void; // 👈 NEW (Employee)
  allowReEdit: () => void;
  
  // Toast Notification
  toastMessage: { message: string, type: 'success' | 'error' } | null;
  showToast: (msg: string, type: 'success' | 'error') => void;

  isSaving: boolean;
  saveSuccess: boolean;


  // 👇 NEW METHOD ADDED HERE
  logAction: (action: 'ADD' | 'EDIT' | 'DELETE' | 'STATUS', module: string, details: string, userRole: string, isMajor?: boolean) => void;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

// --- 2. DEFAULT STATE ---
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

  // New fields
  tripCategory: '',
  tripExperience: '',
  status: 'draft',

  // 👇 NEW DEFAULTS ADDED HERE
  currentVersion: '1.0',
  auditLog: [{
     version: '1.0',
     action: 'STATUS',
     module: 'System',
     details: 'Itinerary Created',
     userRole: 'system',
     timestamp: new Date().toISOString()
  }],

  stepperStatus: {
    intro: 'incomplete',
    routing: 'locked',
    createDay: 'locked',
    review: 'locked',
    costing: 'locked',
    preview: 'locked'
  },
  companyMarkup: 0,
 
  startDate: function (startDate: any): unknown {
    throw new Error('Function not implemented.');
  }
};

export function ItineraryProvider({ children }: { children: React.ReactNode }) {
  const [itineraryData, setItineraryData] = useState<ItineraryData>(DEFAULT_ITINERARY);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // --- 1. TOAST STATE (This was missing in your code) ---
  const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // --- 2. HELPER TO SHOW TOAST (This was missing) ---
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000); // Auto-hide after 3 seconds
  }, []);

  // --- 3. INITIALIZATION ---
  useEffect(() => {
    const editingId = sessionStorage.getItem('editing_itinerary_id');
    if (editingId) {
      loadItineraryForEdit(editingId);
      sessionStorage.removeItem('editing_itinerary_id');
    } else {
      loadSavedItinerary();
    }
  }, []);

  // --- 4. CORE UPDATERS ---
  const updateItineraryData = useCallback((data: Partial<ItineraryData>) => {
    setItineraryData(prev => ({ ...prev, ...data }));
  }, []);

  const updateRoutingData = useCallback((routingData: RoutingData) => {
    setItineraryData(prev => {
      if (JSON.stringify(prev.routingData) === JSON.stringify(routingData)) return prev;
      return { ...prev, routingData };
    });
  }, []);


  // 👇 NEW: Function to record changes and bump versions
  const logAction = useCallback((action: 'ADD' | 'EDIT' | 'DELETE' | 'STATUS', module: string, details: string, userRole: string, isMajor = false) => {
    setItineraryData(prev => {
      // Calculate new version
      const [major, minor] = (prev.currentVersion || '1.0').split('.').map(Number);
      const newVersion = isMajor ? `${major + 1}.0` : `${major}.${(minor || 0) + 1}`;

      const newLog: AuditLogEntry = {
        version: newVersion,
        action,
        module,
        details,
        userRole,
        timestamp: new Date().toISOString()
      };

      const updated = { 
          ...prev, 
          currentVersion: newVersion,
          auditLog: [newLog, ...(prev.auditLog || [])] // Push to top of list
      };
      
      saveItineraryToStorage(updated);
      return updated;
    });
  }, []);

  // --- 5. WORKFLOW ACTIONS ---

  const completeStep = useCallback((step: keyof StepperStatus) => {
    setItineraryData(prev => {
        const newStatus = { ...prev.stepperStatus };
        newStatus[step] = 'completed';

        if (step === 'intro') newStatus.routing = 'unlocked';
        if (step === 'routing') newStatus.createDay = 'unlocked';
        if (step === 'createDay') newStatus.costing = 'unlocked'; 

        const updatedData = { ...prev, stepperStatus: newStatus };
        saveItineraryToStorage(updatedData);
        return updatedData;
    });
  }, []);

  // // Employee: Submit for Costing
  // const submitForCosting = useCallback(() => {
  //   setItineraryData(prev => {
  //     const updated = {
  //       ...prev,
  //       status: 'pending_costing' as ItineraryStatus,
  //     };
      
  //     saveItineraryToStorage(updated);
  //     saveToLibrary(updated);
  //     return updated;
  //   });
  //   showToast("Request sent to Admin! Waiting for approval.", "success");
  // }, [showToast]);

  // // Admin: Approve Costing
  // const approveCosting = useCallback(() => {
  //   setItineraryData(prev => {
  //     const newStepper = { 
  //       ...prev.stepperStatus, 
  //       costing: 'completed', 
  //       preview: 'unlocked' 
  //     } as StepperStatus;

  //     const updated = {
  //       ...prev,
  //       status: 'approved' as ItineraryStatus,
  //       stepperStatus: newStepper
  //     };

  //     saveItineraryToStorage(updated);
  //     saveToLibrary(updated);
  //     return updated;
  //   });
  //   showToast("Costing Approved! Employee can now see Preview.", "success");
  // }, [showToast]);





  // // 👇 ADD THIS NEW FUNCTION (The Logic for Rejection)
  // const rejectCosting = useCallback((reason: string) => {
  //   setItineraryData(prev => {
  //     const updated = {
  //       ...prev,
  //       status: 'draft' as ItineraryStatus, // Unlock for employee
  //       adminComment: reason, // Save the reason
  //       // Reset stepper if needed, or keep as is
  //     };
      
  //     saveItineraryToStorage(updated);
  //     saveToLibrary(updated);
  //     return updated;
  //   });
  //   showToast("Returned to Employee for changes.", "error");
  // }, [showToast]);


  // // 👇 ADD THIS NEW FUNCTION
  // const revertToPending = useCallback(() => {
  //   setItineraryData(prev => {
  //     const updated = {
  //       ...prev,
  //       status: 'pending_costing' as ItineraryStatus, // Move back to Pending
  //     };
  //     saveItineraryToStorage(updated);
  //     saveToLibrary(updated);
  //     return updated;
  //   });
  //   showToast("Costing Unlocked for corrections.", "success");
  // }, [showToast]);


  // // 👇 1. EMPLOYEE: REQUEST RE-EDIT
  // const requestReEdit = useCallback((reason: string) => {
  //   setItineraryData(prev => {
  //     const updated = {
  //       ...prev,
  //       status: 'reedit_requested' as ItineraryStatus,
  //       reEditReason: reason
  //     };
  //     saveItineraryToStorage(updated);
  //     saveToLibrary(updated);
  //     return updated;
  //   });
  //   showToast("Re-edit request sent to Admin.", "success");
  // }, [showToast]);

  // // 👇 2. ADMIN: ALLOW RE-EDIT (Reset to Draft)
  // const allowReEdit = useCallback(() => {
  //   setItineraryData(prev => {
  //     const updated = {
  //       ...prev,
  //       status: 'draft' as ItineraryStatus, // Back to start
  //       reEditReason: undefined, // Clear the reason
  //       adminComment: "Re-edit request granted. Please make your changes."
  //     };
  //     saveItineraryToStorage(updated);
  //     saveToLibrary(updated);
  //     return updated;
  //   });
  //   showToast("Itinerary unlocked for Employee.", "success");
  // }, [showToast]);



  // Employee: Submit for Costing
  const submitForCosting = useCallback(() => {
    setItineraryData(prev => {
      // 👇 Calculate Major Version Bump (e.g. 1.2 -> 2.0)
      const [major] = (prev.currentVersion || '1.0').split('.').map(Number);
      const newVersion = `${major + 1}.0`;
      const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: 'Submitted Itinerary for Costing', userRole: 'Agent / Employee', timestamp: new Date().toISOString() };

      const updated = {
        ...prev,
        status: 'pending_costing' as ItineraryStatus,
        currentVersion: newVersion,
        auditLog: [newLog, ...(prev.auditLog || [])]
      };
      
      saveItineraryToStorage(updated);
      saveToLibrary(updated);
      return updated;
    });
    showToast("Request sent to Admin! Waiting for approval.", "success");
  }, [showToast]);

  // Admin: Approve Costing
  const approveCosting = useCallback(() => {
    setItineraryData(prev => {
      const [major] = (prev.currentVersion || '1.0').split('.').map(Number);
      const newVersion = `${major + 1}.0`;
      const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: 'Costing Approved & Finalized', userRole: 'Admin', timestamp: new Date().toISOString() };

      const newStepper = { 
        ...prev.stepperStatus, 
        costing: 'completed', 
        preview: 'unlocked' 
      } as StepperStatus;

      const updated = {
        ...prev,
        status: 'approved' as ItineraryStatus,
        stepperStatus: newStepper,
        currentVersion: newVersion,
        auditLog: [newLog, ...(prev.auditLog || [])]
      };

      saveItineraryToStorage(updated);
      saveToLibrary(updated);
      return updated;
    });
    showToast("Costing Approved! Employee can now see Preview.", "success");
  }, [showToast]);

  // Admin: Reject Costing
  const rejectCosting = useCallback((reason: string) => {
    setItineraryData(prev => {
      const [major] = (prev.currentVersion || '1.0').split('.').map(Number);
      const newVersion = `${major + 1}.0`;
      const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: `Admin requested changes: "${reason}"`, userRole: 'Admin', timestamp: new Date().toISOString() };

      const updated = {
        ...prev,
        status: 'draft' as ItineraryStatus, // Unlock for employee
        adminComment: reason, // Save the reason
        currentVersion: newVersion,
        auditLog: [newLog, ...(prev.auditLog || [])]
      };
      
      saveItineraryToStorage(updated);
      saveToLibrary(updated);
      return updated;
    });
    showToast("Returned to Employee for changes.", "error");
  }, [showToast]);

  // Admin: Revert to Pending
  const revertToPending = useCallback(() => {
    setItineraryData(prev => {
      const [major] = (prev.currentVersion || '1.0').split('.').map(Number);
      const newVersion = `${major + 1}.0`;
      const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: 'Unlocked Costing (Reverted to Pending)', userRole: 'Admin', timestamp: new Date().toISOString() };

      const updated = {
        ...prev,
        status: 'pending_costing' as ItineraryStatus, // Move back to Pending
        currentVersion: newVersion,
        auditLog: [newLog, ...(prev.auditLog || [])]
      };
      saveItineraryToStorage(updated);
      saveToLibrary(updated);
      return updated;
    });
    showToast("Costing Unlocked for corrections.", "success");
  }, [showToast]);

  // Employee: Request Re-Edit
  const requestReEdit = useCallback((reason: string) => {
    setItineraryData(prev => {
      const [major] = (prev.currentVersion || '1.0').split('.').map(Number);
      const newVersion = `${major + 1}.0`;
      const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: `Requested Re-Edit: "${reason}"`, userRole: 'Agent / Employee', timestamp: new Date().toISOString() };

      const updated = {
        ...prev,
        status: 'reedit_requested' as ItineraryStatus,
        reEditReason: reason,
        currentVersion: newVersion,
        auditLog: [newLog, ...(prev.auditLog || [])]
      };
      saveItineraryToStorage(updated);
      saveToLibrary(updated);
      return updated;
    });
    showToast("Re-edit request sent to Admin.", "success");
  }, [showToast]);

  // Admin: Allow Re-Edit (Reset to Draft)
  const allowReEdit = useCallback(() => {
    setItineraryData(prev => {
      const [major] = (prev.currentVersion || '1.0').split('.').map(Number);
      const newVersion = `${major + 1}.0`;
      const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: 'Granted Re-Edit Request (Unlocked)', userRole: 'Admin', timestamp: new Date().toISOString() };

      const updated = {
        ...prev,
        status: 'draft' as ItineraryStatus, // Back to start
        reEditReason: undefined, // Clear the reason
        adminComment: "Re-edit request granted. Please make your changes.",
        currentVersion: newVersion,
        auditLog: [newLog, ...(prev.auditLog || [])]
      };
      saveItineraryToStorage(updated);
      saveToLibrary(updated);
      return updated;
    });
    showToast("Itinerary unlocked for Employee.", "success");
  }, [showToast]);



  // --- 6. STORAGE HANDLERS ---

  const loadSavedItinerary = () => {
    const savedData = loadItineraryFromStorage();
    if (savedData) {
      const mergedData = { ...DEFAULT_ITINERARY, ...savedData } as ItineraryData;
      
      if(!mergedData.stepperStatus) mergedData.stepperStatus = DEFAULT_ITINERARY.stepperStatus;
      if(!mergedData.status) mergedData.status = 'draft';
      
      setItineraryData(mergedData);
    } else {
      setItineraryData({ 
        ...DEFAULT_ITINERARY, 
        tripId: `TRIP-${Date.now().toString().slice(-6)}` 
      });
    }
  };

  const loadItineraryForEdit = (id: string): boolean => {
    const data = getItineraryById(id);
    if (data) {
      const raw = { ...DEFAULT_ITINERARY, ...data } as any;
      const allowedStatuses = ['draft', 'pending_costing', 'approved', 'active', 'archived'];
      const normalizedStatus = allowedStatuses.includes(raw.status) ? raw.status : 'draft';
      const normalizedStepper = raw.stepperStatus ?? DEFAULT_ITINERARY.stepperStatus;

      const mergedData: ItineraryData = {
        ...DEFAULT_ITINERARY,
        ...raw,
        status: normalizedStatus,
        stepperStatus: normalizedStepper
      };

      setItineraryData(mergedData);
      saveItineraryToStorage(mergedData);
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
      const dataToSave = { 
          ...itineraryData,
          selectedCurrency: itineraryData.selectedCurrency || 'USD' 
      };
      
      saveItineraryToStorage(dataToSave);
      
      if (type === 'exit' || itineraryData.id) {
        saveToLibrary(dataToSave);
      }
      if (type === 'exit') {
        clearItineraryStorage();
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      showToast("Itinerary saved successfully!", "success");
      return true;
    } catch (e) {
      console.error(e);
      showToast("Failed to save itinerary.", "error");
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
      
      // Actions
      completeStep,
      submitForCosting,
      approveCosting,
      rejectCosting,
      revertToPending,
      requestReEdit,
      allowReEdit,
      logAction,
      
      // Toast Values (Now properly defined)
      toastMessage,
      showToast,
      
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