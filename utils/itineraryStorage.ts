// // utils/itineraryStorage.ts

// import { DayPlan, RoutingData } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';

// const STORAGE_KEY = 'itinerary_draft';
// const LIBRARY_KEY = 'itinerary_library';

// export interface StoredItineraryData {
//   id?: string;
//   tripId: string;
//   tripName: string;
//   numberOfTravelers: number;
//   isMasterItinerary: boolean;
//   tripType: string;
//   tripStyle: string;
//   packageType: string;
//   creatingFor: string;
//   showFlightDetails: boolean;
//   showTravelerDetails: boolean;
//   selectedCountries: string[];
//   flights: any[];
//   travelers: any[];
//   agentTravelers: any[];
//   routingData?: RoutingData;
//   dayWiseActivities?: DayPlan[];
//   lastSaved?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   status?: 'draft' | 'active' | 'archived';
// }

// // Generate unique ID
// const generateId = (): string => {
//   return `ITN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
// };

// // Save draft
// export const saveItineraryToStorage = (data: StoredItineraryData): boolean => {
//   try {
//     const dataToSave = {
//       ...data,
//       lastSaved: new Date().toISOString()
//     };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
//     console.log('✅ Itinerary draft saved successfully');
//     return true;
//   } catch (error) {
//     console.error('❌ Error saving itinerary:', error);
//     return false;
//   }
// };

// // Load draft
// export const loadItineraryFromStorage = (): StoredItineraryData | null => {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     if (!stored) {
//       return null;
//     }
//     return JSON.parse(stored);
//   } catch (error) {
//     console.error('❌ Error loading itinerary:', error);
//     return null;
//   }
// };

// // Clear draft
// export const clearItineraryStorage = (): void => {
//   try {
//     localStorage.removeItem(STORAGE_KEY);
//     console.log('✅ Itinerary draft storage cleared');
//   } catch (error) {
//     console.error('❌ Error clearing itinerary:', error);
//   }
// };

// // Get Library
// export const getLibrary = (): StoredItineraryData[] => {
//   try {
//     const stored = localStorage.getItem(LIBRARY_KEY);
//     if (!stored) return [];
//     return JSON.parse(stored);
//   } catch (error) {
//     console.error('❌ Error loading library:', error);
//     return [];
//   }
// };

// // Save to Library (Full Save)
// export const saveToLibrary = (data: StoredItineraryData): boolean => {
//   try {
//     const library = getLibrary();
    
//     if (data.id) {
//       // Update existing
//       const index = library.findIndex(item => item.id === data.id);
//       if (index !== -1) {
//         library[index] = {
//           ...data,
//           updatedAt: new Date().toISOString()
//         };
//       } else {
//         // Add as new if ID exists but not in array
//         library.push({
//           ...data,
//           createdAt: data.createdAt || new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//           status: data.status || 'active'
//         });
//       }
//     } else {
//       // New Item
//       const newItinerary: StoredItineraryData = {
//         ...data,
//         id: generateId(),
//         // If it's a master itinerary, ensure ID format reflects that, else generate standard
//         tripId: data.tripId || `TRIP-${Date.now().toString().slice(-6)}`,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         status: 'active'
//       };
//       library.push(newItinerary);
//     }
    
//     localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
//     return true;
//   } catch (error) {
//     console.error('❌ Error saving to library:', error);
//     return false;
//   }
// };

// // Get Single by ID
// export const getItineraryById = (id: string): StoredItineraryData | null => {
//   try {
//     const library = getLibrary();
//     return library.find(item => item.id === id) || null;
//   } catch (error) {
//     console.error('❌ Error getting itinerary:', error);
//     return null;
//   }
// };

// // Delete
// export const deleteFromLibrary = (id: string): boolean => {
//   try {
//     const library = getLibrary();
//     const filtered = library.filter(item => item.id !== id);
//     localStorage.setItem(LIBRARY_KEY, JSON.stringify(filtered));
//     return true;
//   } catch (error) {
//     console.error('❌ Error deleting from library:', error);
//     return false;
//   }
// };

// // Clone
// export const cloneItinerary = (id: string): StoredItineraryData | null => {
//   try {
//     const library = getLibrary();
//     const original = library.find(item => item.id === id);
    
//     if (!original) return null;
    
//     const cloned: StoredItineraryData = {
//       ...original,
//       id: generateId(),
//       tripId: `COPY-${Date.now().toString().slice(-6)}`,
//       tripName: `${original.tripName} (Copy)`,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       status: 'active'
//     };
    
//     library.push(cloned);
//     localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
//     return cloned;
//   } catch (error) {
//     console.error('❌ Error cloning itinerary:', error);
//     return null;
//   }
// };




















// // utils/itineraryStorage.ts

// import { DayPlan } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';

// // --- NEW INTERFACES FOR ROUTING ---
// export interface RouteCity {
//   name: string;
//   type: 'city' | 'airport';
// }

// export interface RouteDay {
//   id: number;
//   dayNumber: number; // calculated automatically
//   date: string;      // calculated automatically
//   nights: number;    // user input
//   cities: RouteCity[];
//   transportMode: string;
// }

// export interface RoutingData {
//   startDate: string; // can be empty string ""
//   endDate: string;   // can be empty string ""
//   routes: RouteDay[];
// }

// // --- MAIN STORAGE CONSTANTS ---
// const STORAGE_KEY = 'itinerary_draft';
// const LIBRARY_KEY = 'itinerary_library';

// export interface StoredItineraryData {
//   id?: string;
//   tripId: string;
//   tripName: string;
//   numberOfTravelers: number;
//   isMasterItinerary: boolean;
//   tripType: string;
//   tripStyle: string;
//   packageType: string;
//   creatingFor: string;
//   showFlightDetails: boolean;
//   showTravelerDetails: boolean;
//   selectedCountries: string[];
//   flights: any[];
//   travelers: any[];
//   agentTravelers: any[];
  
//   // UPDATED FIELD:
//   routingData?: RoutingData; 
  
//   dayWiseActivities?: DayPlan[];
//   lastSaved?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   status?: 'draft' | 'active' | 'archived';
// }

// // Generate unique ID
// const generateId = (): string => {
//   return `ITN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
// };

// // Save draft
// export const saveItineraryToStorage = (data: StoredItineraryData): boolean => {
//   try {
//     const dataToSave = {
//       ...data,
//       lastSaved: new Date().toISOString()
//     };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
//     console.log('✅ Itinerary draft saved successfully');
//     return true;
//   } catch (error) {
//     console.error('❌ Error saving itinerary:', error);
//     return false;
//   }
// };

// // Load draft
// export const loadItineraryFromStorage = (): StoredItineraryData | null => {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     if (!stored) {
//       return null;
//     }
//     return JSON.parse(stored);
//   } catch (error) {
//     console.error('❌ Error loading itinerary:', error);
//     return null;
//   }
// };

// // Clear draft
// export const clearItineraryStorage = (): void => {
//   try {
//     localStorage.removeItem(STORAGE_KEY);
//     console.log('✅ Itinerary draft storage cleared');
//   } catch (error) {
//     console.error('❌ Error clearing itinerary:', error);
//   }
// };

// // Get Library
// export const getLibrary = (): StoredItineraryData[] => {
//   try {
//     const stored = localStorage.getItem(LIBRARY_KEY);
//     if (!stored) return [];
//     return JSON.parse(stored);
//   } catch (error) {
//     console.error('❌ Error loading library:', error);
//     return [];
//   }
// };

// // Save to Library (Full Save)
// export const saveToLibrary = (data: StoredItineraryData): boolean => {
//   try {
//     const library = getLibrary();
    
//     if (data.id) {
//       // Update existing
//       const index = library.findIndex(item => item.id === data.id);
//       if (index !== -1) {
//         library[index] = {
//           ...data,
//           updatedAt: new Date().toISOString()
//         };
//       } else {
//         // Add as new if ID exists but not in array
//         library.push({
//           ...data,
//           createdAt: data.createdAt || new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//           status: data.status || 'active'
//         });
//       }
//     } else {
//       // New Item
//       const newItinerary: StoredItineraryData = {
//         ...data,
//         id: generateId(),
//         // If it's a master itinerary, ensure ID format reflects that, else generate standard
//         tripId: data.tripId || `TRIP-${Date.now().toString().slice(-6)}`,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         status: 'active'
//       };
//       library.push(newItinerary);
//     }
    
//     localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
//     return true;
//   } catch (error) {
//     console.error('❌ Error saving to library:', error);
//     return false;
//   }
// };

// // Get Single by ID
// export const getItineraryById = (id: string): StoredItineraryData | null => {
//   try {
//     const library = getLibrary();
//     return library.find(item => item.id === id) || null;
//   } catch (error) {
//     console.error('❌ Error getting itinerary:', error);
//     return null;
//   }
// };

// // Delete
// export const deleteFromLibrary = (id: string): boolean => {
//   try {
//     const library = getLibrary();
//     const filtered = library.filter(item => item.id !== id);
//     localStorage.setItem(LIBRARY_KEY, JSON.stringify(filtered));
//     return true;
//   } catch (error) {
//     console.error('❌ Error deleting from library:', error);
//     return false;
//   }
// };

// // Clone
// export const cloneItinerary = (id: string): StoredItineraryData | null => {
//   try {
//     const library = getLibrary();
//     const original = library.find(item => item.id === id);
    
//     if (!original) return null;
    
//     const cloned: StoredItineraryData = {
//       ...original,
//       id: generateId(),
//       tripId: `COPY-${Date.now().toString().slice(-6)}`,
//       tripName: `${original.tripName} (Copy)`,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       status: 'active'
//     };
    
//     library.push(cloned);
//     localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
//     return cloned;
//   } catch (error) {
//     console.error('❌ Error cloning itinerary:', error);
//     return null;
//   }
// }; 















// // utils/itineraryStorage.ts

// import { DayPlan } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';

// // --- ROUTING INTERFACES ---
// export interface RouteCity {
//   name: string;
//   type: 'city' | 'airport';
// }

// export interface RouteDay {
//   id: number;
//   dayNumber: number; 
//   date: string;      
//   nights: number;    
//   cities: RouteCity[];
//   transportMode: string;
// }

// export interface RoutingData {
//   startDate: string;
//   endDate: string;
//   routes: RouteDay[];
// }

// // --- MAIN STORAGE INTERFACE ---
// export interface StoredItineraryData {
//   id?: string;
//   tripId: string;
//   tripName: string;
//   numberOfTravelers: number;
//   isMasterItinerary: boolean;
//   tripType: string;
//   tripStyle: string;
//   packageType: string;
//   creatingFor: string;
//   showFlightDetails: boolean;
//   showTravelerDetails: boolean;
//   selectedCountries: string[];
  
//   // Dynamic Data
//   routingData?: RoutingData; 
//   dayWiseActivities?: DayPlan[];
  
//   // Metadata
//   lastSaved?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   status?: 'draft' | 'active' | 'archived';
  
//   // Placeholder arrays for other steps
//   flights: any[];
//   travelers: any[];
//   agentTravelers: any[];
// }

// const STORAGE_KEY = 'itinerary_draft';
// const LIBRARY_KEY = 'itinerary_library';

// // --- HELPER: GENERATE ID ---
// const generateId = (): string => {
//   return `ITN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
// };

// // --- SAVE DRAFT (QUICK SAVE) ---
// export const saveItineraryToStorage = (data: StoredItineraryData): boolean => {
//   try {
//     const dataToSave = {
//       ...data,
//       lastSaved: new Date().toISOString()
//     };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
//     console.log('✅ Itinerary draft saved to LocalStorage');
//     return true;
//   } catch (error) {
//     console.error('❌ Error saving itinerary:', error);
//     return false;
//   }
// };

// // --- LOAD DRAFT ---
// export const loadItineraryFromStorage = (): StoredItineraryData | null => {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     if (!stored) return null;
//     return JSON.parse(stored);
//   } catch (error) {
//     console.error('❌ Error loading itinerary:', error);
//     return null;
//   }
// };

// // --- CLEAR DRAFT ---
// export const clearItineraryStorage = (): void => {
//   try {
//     localStorage.removeItem(STORAGE_KEY);
//   } catch (error) {
//     console.error('❌ Error clearing itinerary:', error);
//   }
// };

// // --- LIBRARY FUNCTIONS (For permanent save) ---
// export const getLibrary = (): StoredItineraryData[] => {
//   try {
//     const stored = localStorage.getItem(LIBRARY_KEY);
//     return stored ? JSON.parse(stored) : [];
//   } catch (error) { return []; }
// };

// export const saveToLibrary = (data: StoredItineraryData): boolean => {
//   try {
//     const library = getLibrary();
//     let updatedLibrary = [...library];
    
//     // Check if updating existing or adding new
//     const existingIndex = data.id ? library.findIndex(item => item.id === data.id) : -1;
    
//     if (existingIndex !== -1) {
//       updatedLibrary[existingIndex] = { ...data, updatedAt: new Date().toISOString() };
//     } else {
//       updatedLibrary.push({
//         ...data,
//         id: data.id || generateId(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         status: 'active'
//       });
//     }
    
//     localStorage.setItem(LIBRARY_KEY, JSON.stringify(updatedLibrary));
//     return true;
//   } catch (error) {
//     console.error('❌ Library save failed:', error);
//     return false;
//   }
// };

// export const getItineraryById = (id: string): StoredItineraryData | null => {
//   const library = getLibrary();
//   return library.find(item => item.id === id) || null;
// };




//  // Delete
// export const deleteFromLibrary = (id: string): boolean => {
//   try {
//     const library = getLibrary();
//     const filtered = library.filter(item => item.id !== id);
//     localStorage.setItem(LIBRARY_KEY, JSON.stringify(filtered));
//     return true;
//   } catch (error) {
//     console.error('❌ Error deleting from library:', error);
//     return false;
//   }
// };

// // // Clone
// export const cloneItinerary = (id: string): StoredItineraryData | null => {
//   try {
//     const library = getLibrary();
//     const original = library.find(item => item.id === id);
    
//     if (!original) return null;
    
//     const cloned: StoredItineraryData = {
//       ...original,
//       id: generateId(),
//       tripId: `COPY-${Date.now().toString().slice(-6)}`,
//       tripName: `${original.tripName} (Copy)`,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       status: 'active'
//     };
    
//     library.push(cloned);
//     localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
//     return cloned;
//   } catch (error) {
//     console.error('❌ Error cloning itinerary:', error);
//     return null;
//   }
// }; 
 



// import { DayPlan } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';

// // --- 1. UPDATED ROUTING INTERFACES (Crucial for the Fix) ---
// export interface RouteCity {
//   name: string;
//   type: 'city' | 'airport';
// }

// export interface RouteDay {
//   id: number;        // ID is a number (timestamp)
//   dayNumber: number; // calculated automatically
//   date: string;      // calculated automatically
//   nights: number;    // Ensure this is treated as a number
//   cities: RouteCity[];
//   transportMode: string;
// }

// export interface RoutingData {
//   startDate: string; // can be empty string ""
//   endDate: string;   // can be empty string ""
//   routes: RouteDay[];
// }

// // --- 2. MAIN STORAGE CONSTANTS ---
// const STORAGE_KEY = 'itinerary_draft';
// const LIBRARY_KEY = 'itinerary_library';

// // --- 3. MAIN DATA INTERFACE ---
// export interface StoredItineraryData {
//   id?: string;
//   tripId: string;
//   tripName: string;
//   numberOfTravelers: number;
//   isMasterItinerary: boolean;
//   tripType: string;
//   tripStyle: string;
//   packageType: string;
//   creatingFor: string;
//   showFlightDetails: boolean;
//   showTravelerDetails: boolean;
//   selectedCountries: string[];
//   selectedCurrency?: string;
  
//   // Arrays for other steps
//   flights: any[];
//   travelers: any[];
//   agentTravelers: any[];
  
//   // UPDATED FIELD:
//   routingData?: RoutingData; 
  
//   dayWiseActivities?: DayPlan[];

//   markupPercentage?: number; 
//   taxPercentage?: number;
  
//   // Metadata
//   lastSaved?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   status?: 'draft' | 'active' | 'archived';
// }

// // --- 4. HELPER: GENERATE ID ---
// const generateId = (): string => {
//   return `ITN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
// };

// // --- 5. DRAFT FUNCTIONS (Quick Save) ---

// // Save draft
// export const saveItineraryToStorage = (data: StoredItineraryData): boolean => {
//   try {
//     const dataToSave = {
//       ...data,
//       lastSaved: new Date().toISOString()
//     };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
//     console.log('✅ Itinerary draft saved successfully');
//     return true;
//   } catch (error) {
//     console.error('❌ Error saving itinerary:', error);
//     return false;
//   }
// };



// // Load draft
// export const loadItineraryFromStorage = (): StoredItineraryData | null => {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     if (!stored) return null;
    
//     const data = JSON.parse(stored);
    
//     // FORCE USD IF MISSING
//     if (!data.selectedCurrency) {
//         data.selectedCurrency = 'USD';
//     }
    
//     return data;
//   } catch (error) {
//     console.error('❌ Error loading itinerary:', error);
//     return null;
//   }
// };




// // Clear draft
// export const clearItineraryStorage = (): void => {
//   try {
//     localStorage.removeItem(STORAGE_KEY);
//     console.log('✅ Itinerary draft storage cleared');
//   } catch (error) {
//     console.error('❌ Error clearing itinerary:', error);
//   }
// };

// // --- 6. LIBRARY FUNCTIONS (Permanent Save) ---

// // Get Library
// export const getLibrary = (): StoredItineraryData[] => {
//   try {
//     const stored = localStorage.getItem(LIBRARY_KEY);
//     if (!stored) return [];
//     return JSON.parse(stored);
//   } catch (error) {
//     console.error('❌ Error loading library:', error);
//     return [];
//   }
// };

// // Save to Library (Full Save)
// export const saveToLibrary = (data: StoredItineraryData): boolean => {
//   try {
//     const library = getLibrary();
    
//     // Create a deep copy of the library to modify
//     const updatedLibrary = [...library];
    
//     if (data.id) {
//       // Update existing
//       const index = updatedLibrary.findIndex(item => item.id === data.id);
//       if (index !== -1) {
//         updatedLibrary[index] = {
//           ...data,
//           updatedAt: new Date().toISOString()
//         };
//       } else {
//         // Add as new if ID exists but not in array (Edge case)
//         updatedLibrary.push({
//           ...data,
//           createdAt: data.createdAt || new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//           status: data.status || 'active'
//         });
//       }
//     } else {
//       // New Item
//       const newItinerary: StoredItineraryData = {
//         ...data,
//         id: generateId(),
//         // If it's a master itinerary, ensure ID format reflects that, else generate standard
//         tripId: data.tripId || `TRIP-${Date.now().toString().slice(-6)}`,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         status: 'active'
//       };
//       updatedLibrary.push(newItinerary);
//     }
    
//     localStorage.setItem(LIBRARY_KEY, JSON.stringify(updatedLibrary));
//     return true;
//   } catch (error) {
//     console.error('❌ Error saving to library:', error);
//     return false;
//   }
// };

// // Get Single by ID
// export const getItineraryById = (id: string): StoredItineraryData | null => {
//   try {
//     const library = getLibrary();
//     return library.find(item => item.id === id) || null;
//   } catch (error) {
//     console.error('❌ Error getting itinerary:', error);
//     return null;
//   }
// };

// // Delete
// export const deleteFromLibrary = (id: string): boolean => {
//   try {
//     const library = getLibrary();
//     const filtered = library.filter(item => item.id !== id);
//     localStorage.setItem(LIBRARY_KEY, JSON.stringify(filtered));
//     return true;
//   } catch (error) {
//     console.error('❌ Error deleting from library:', error);
//     return false;
//   }
// };

// // Clone
// export const cloneItinerary = (id: string): StoredItineraryData | null => {
//   try {
//     const library = getLibrary();
//     const original = library.find(item => item.id === id);
    
//     if (!original) return null;
    
//     const cloned: StoredItineraryData = {
//       ...original,
//       id: generateId(),
//       tripId: `COPY-${Date.now().toString().slice(-6)}`,
//       tripName: `${original.tripName} (Copy)`,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       status: 'active'
//     };
    
//     library.push(cloned);
//     localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
//     return cloned;
//   } catch (error) {
//     console.error('❌ Error cloning itinerary:', error);
//     return null;
//   }
// };
























































import { DayPlan } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';

// --- 1. UPDATED ROUTING INTERFACES ---
export interface RouteCity {
  name: string;
  type: 'city' | 'airport';
}

export interface RouteDay {
  id: number;        // ID is a number (timestamp)
  dayNumber: number; // calculated automatically
  date: string;      // calculated automatically
  nights: number;    // Ensure this is treated as a number
  cities: RouteCity[];
  transportMode: string;
}

export interface RoutingData {
  startDate: string; // can be empty string ""
  endDate: string;   // can be empty string ""
  routes: RouteDay[];
}



export interface FixedDeparture {
  id: string;
  date: string;       // e.g., "2026-01-09"
  label: string;      // e.g., "Fri, Jan 09, 2026"
  price: number;      // e.g., 1250
  status: 'Open' | 'Filling Fast' | 'Sold Out';
  isSelected: boolean; // To track which one is active
}


// --- 2. MAIN STORAGE CONSTANTS ---
const STORAGE_KEY = 'itinerary_draft';
const LIBRARY_KEY = 'itinerary_library';

// --- 3. MAIN DATA INTERFACE ---
export interface StoredItineraryData {
  id?: string;
  tripId: string;
  tripName: string;
  numberOfTravelers: number;
  isMasterItinerary: boolean;
  tripType: string;
  tripStyle: string;
  packageType: string;
  creatingFor: string;
  showFlightDetails: boolean;
  showTravelerDetails: boolean;
  selectedCountries: string[];
  
  // NEW FIELD: Stores the currency used for this trip (e.g., 'USD', 'INR')
  selectedCurrency?: string; 

  // ADD THIS LINE:
  roundingMode?: string;

  // Arrays for other steps
  flights: any[];
  travelers: any[];
  agentTravelers: any[];
  
  // UPDATED FIELD:
  routingData?: RoutingData; 
  
  dayWiseActivities?: DayPlan[];

  markupPercentage?: number; 
  taxPercentage?: number;

  fixedDepartures?: FixedDeparture[]; 
  useFixedPrice?: boolean; // Toggle to know if we are using manual pricing
  
  // Metadata
  lastSaved?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: 'draft' | 'active' | 'archived';
}

// --- 4. HELPER: GENERATE ID ---
const generateId = (): string => {
  return `ITN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
};

// --- 5. DRAFT FUNCTIONS (Quick Save) ---

// Save draft
export const saveItineraryToStorage = (data: StoredItineraryData): boolean => {
  try {
    // FORCE CURRENCY SAVE: Ensure selectedCurrency is never undefined
    const dataToSave = {
      ...data,
      selectedCurrency: data.selectedCurrency || 'USD',
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    console.log('✅ Itinerary draft saved successfully');
    return true;
  } catch (error) {
    console.error('❌ Error saving itinerary:', error);
    return false;
  }
};

// // Load draft
// export const loadItineraryFromStorage = (): StoredItineraryData | null => {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     if (!stored) {
//       return null;
//     }
    
//     const data = JSON.parse(stored);

//     // SAFETY FIX: If the draft is missing currency, force it to USD.
//     // This prevents the system from defaulting to INR and multiplying the values.
//     if (!data.selectedCurrency) {
//         data.selectedCurrency = 'USD';
//     }

//     return data;
//   } catch (error) {
//     console.error('❌ Error loading itinerary:', error);
//     return null;
//   }
// };

export const loadItineraryFromStorage = (): StoredItineraryData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    
    // FORCE USD: Prevent any "undefined" currency from defaulting to INR later
    if (!data.selectedCurrency) {
        data.selectedCurrency = 'USD';
    }
    
    return data;
  } catch (error) {
    return null;
  }
};

// Clear draft
export const clearItineraryStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Itinerary draft storage cleared');
  } catch (error) {
    console.error('❌ Error clearing itinerary:', error);
  }
};

// --- 6. LIBRARY FUNCTIONS (Permanent Save) ---

// Get Library
export const getLibrary = (): StoredItineraryData[] => {
  try {
    const stored = localStorage.getItem(LIBRARY_KEY);
    if (!stored) return [];
    
    const library = JSON.parse(stored);
    
    // SAFETY FIX: Map over library items to ensure none have missing currencies
    // This fixes older items created before the currency update
    return library.map((item: StoredItineraryData) => ({
        ...item,
        selectedCurrency: item.selectedCurrency || 'USD'
    }));

  } catch (error) {
    console.error('❌ Error loading library:', error);
    return [];
  }
};

// Save to Library (Full Save)
export const saveToLibrary = (data: StoredItineraryData): boolean => {
  try {
    const library = getLibrary();
    
    // Create a deep copy of the library to modify
    const updatedLibrary = [...library];
    
    // Explicitly set currency before saving
    const cleanData = {
        ...data,
        selectedCurrency: data.selectedCurrency || 'USD'
    };
    
    if (data.id) {
      // Update existing
      const index = updatedLibrary.findIndex(item => item.id === data.id);
      if (index !== -1) {
        updatedLibrary[index] = {
          ...cleanData,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Add as new if ID exists but not in array (Edge case)
        updatedLibrary.push({
          ...cleanData,
          createdAt: cleanData.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: cleanData.status || 'active'
        });
      }
    } else {
      // New Item
      const newItinerary: StoredItineraryData = {
        ...cleanData,
        id: generateId(),
        // If it's a master itinerary, ensure ID format reflects that, else generate standard
        tripId: data.tripId || `TRIP-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      };
      updatedLibrary.push(newItinerary);
    }
    
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(updatedLibrary));
    return true;
  } catch (error) {
    console.error('❌ Error saving to library:', error);
    return false;
  }
};

// // Get Single by ID
// export const getItineraryById = (id: string): StoredItineraryData | null => {
//   try {
//     const library = getLibrary();
//     const item = library.find(item => item.id === id);
    
//     if (!item) return null;

//     // SAFETY FIX: If this old itinerary has no currency, force 'USD'.
//     // This is the specific fix for your "Edit Trip -> Refresh -> Wrong Price" issue.
//     if (!item.selectedCurrency) {
//         item.selectedCurrency = 'USD';
//     }

//     return item;
//   } catch (error) {
//     console.error('❌ Error getting itinerary:', error);
//     return null;
//   }
// };


export const getItineraryById = (id: string): StoredItineraryData | null => {
  try {
    const library = getLibrary();
    const item = library.find(item => item.id === id);
    
    if (!item) return null;

    // FORCE USD HERE TOO
    if (!item.selectedCurrency) {
        item.selectedCurrency = 'USD';
    }

    return item;
  } catch (error) {
    return null;
  }
};

// Delete
export const deleteFromLibrary = (id: string): boolean => {
  try {
    const library = getLibrary();
    const filtered = library.filter(item => item.id !== id);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('❌ Error deleting from library:', error);
    return false;
  }
};

// Clone
export const cloneItinerary = (id: string): StoredItineraryData | null => {
  try {
    const library = getLibrary();
    const original = library.find(item => item.id === id);
    
    if (!original) return null;
    
    const cloned: StoredItineraryData = {
      ...original,
      id: generateId(),
      tripId: `COPY-${Date.now().toString().slice(-6)}`,
      tripName: `${original.tripName} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      // SAFETY: Ensure cloned item explicitly carries over the currency
      selectedCurrency: original.selectedCurrency || 'USD'
    };
    
    library.push(cloned);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
    return cloned;
  } catch (error) {
    console.error('❌ Error cloning itinerary:', error);
    return null;
  }
};




