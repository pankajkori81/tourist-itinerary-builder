
// import { DayPlan } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';

// // --- 1. UPDATED ROUTING INTERFACES ---
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



// export interface FixedDeparture {
//   id: string;
//   date: string;       // e.g., "2026-01-09"
//   label: string;      // e.g., "Fri, Jan 09, 2026"
//   price: number;      // e.g., 1250
//   status: 'Open' | 'Filling Fast' | 'Sold Out';
//   isSelected: boolean; // To track which one is active
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
  
//   // NEW FIELD: Stores the currency used for this trip (e.g., 'USD', 'INR')
//   selectedCurrency?: string; 

//   // ADD THIS LINE:
//   roundingMode?: string;

//   // Arrays for other steps
//   flights: any[];
//   travelers: any[];
//   agentTravelers: any[];
  
//   // UPDATED FIELD:
//   routingData?: RoutingData; 
  
//   dayWiseActivities?: DayPlan[];

//   markupPercentage?: number; 
//   taxPercentage?: number;

//   fixedDepartures?: FixedDeparture[]; 
//   useFixedPrice?: boolean; // Toggle to know if we are using manual pricing

//   // 1. ADD THESE TWO FIELDS
//   adultCount?: number; 
//   childCount?: number;

//   // --- NEW FIELDS FOR TRIPS MODULE (Highlight) ---
//   bookingStatus?: 'quote' | 'confirmed' | 'cancelled' | 'completed'; // Default 'quote'
//   leadGuestName?: string; // The specific name required for the Trip Card
//   finalSellPrice?: number; // Snapshot of the price at confirmation
  
  
//   // Metadata
//   lastSaved?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   status?: 'draft' | 'active' | 'archived';
// }



// // --- 4. DATE HELPER (CRITICAL FIX) ---
// // JavaScript hates "dd/mm/yyyy". This function fixes it.
// export const parseDate = (dateStr: string | undefined): Date | null => {
//   if (!dateStr) return null;
  
//   // Check if it's already ISO format (yyyy-mm-dd)
//   if (dateStr.includes('-')) {
//     const d = new Date(dateStr);
//     return isNaN(d.getTime()) ? null : d;
//   }

//   // Handle "dd/mm/yyyy"
//   if (dateStr.includes('/')) {
//     const parts = dateStr.split('/');
//     if (parts.length === 3) {
//       // Create date: year, month (0-indexed), day
//       // parseInt("01") works correctly
//       const day = parseInt(parts[0], 10);
//       const month = parseInt(parts[1], 10) - 1; 
//       const year = parseInt(parts[2], 10);
//       const d = new Date(year, month, day);
//       return isNaN(d.getTime()) ? null : d;
//     }
//   }
  
//   return null;
// };

// // --- 5. GENERATOR ---
// const generateId = (): string => {
//   return `ITN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
// };

// // --- 5. DRAFT FUNCTIONS (Quick Save) ---

// // Save draft
// export const saveItineraryToStorage = (data: StoredItineraryData): boolean => {
//   try {
//     // FORCE CURRENCY SAVE: Ensure selectedCurrency is never undefined
//     const dataToSave = {
//       ...data,
//       selectedCurrency: data.selectedCurrency || 'USD',
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



// export const loadItineraryFromStorage = (): StoredItineraryData | null => {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     if (!stored) return null;
    
//     const data = JSON.parse(stored);
    
//     // FORCE USD: Prevent any "undefined" currency from defaulting to INR later
//     if (!data.selectedCurrency) {
//         data.selectedCurrency = 'USD';
//     }
    
//     return data;
//   } catch (error) {
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



// export const getLibrary = (): StoredItineraryData[] => {
//   try {
//     const stored = localStorage.getItem(LIBRARY_KEY);
//     if (!stored) return [];
//     const library = JSON.parse(stored);
//     return library.map((item: StoredItineraryData) => ({
//         ...item,
//         selectedCurrency: item.selectedCurrency || 'USD',
//         // Ensure default booking status is 'quote' if undefined
//         bookingStatus: item.bookingStatus || 'quote'
//     }));
//   } catch (error) { return []; }
// };

// // Save to Library (Full Save)
// export const saveToLibrary = (data: StoredItineraryData): boolean => {
//   try {
//     const library = getLibrary();
    
//     // Create a deep copy of the library to modify
//     const updatedLibrary = [...library];
    
//     // Explicitly set currency before saving
//     const cleanData = {
//         ...data,
//         selectedCurrency: data.selectedCurrency || 'USD'
//     };
    
//     if (data.id) {
//       // Update existing
//       const index = updatedLibrary.findIndex(item => item.id === data.id);
//       if (index !== -1) {
//         updatedLibrary[index] = {
//           ...cleanData,
//           updatedAt: new Date().toISOString()
//         };
//       } else {
//         // Add as new if ID exists but not in array (Edge case)
//         updatedLibrary.push({
//           ...cleanData,
//           createdAt: cleanData.createdAt || new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//           status: cleanData.status || 'active'
//         });
//       }
//     } else {
//       // New Item
//       const newItinerary: StoredItineraryData = {
//         ...cleanData,
//         id: generateId(),
//         // If it's a master itinerary, ensure ID format reflects that, else generate standard
//         tripId: data.tripId || `TRIP-${Date.now().toString().slice(-6)}`,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         status: 'active',
//         bookingStatus: data.isMasterItinerary ? 'quote' : 'quote' // Default
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

// // // Get Single by ID

// export const getItineraryById = (id: string): StoredItineraryData | null => {
//   try {
//     const library = getLibrary();
//     const item = library.find(item => item.id === id);
    
//     if (!item) return null;

//     // FORCE USD HERE TOO
//     if (!item.selectedCurrency) {
//         item.selectedCurrency = 'USD';
//     }

//     return item;
//   } catch (error) {
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
      
//       bookingStatus: 'quote', // Always starts as quote
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       status: 'active',
//       // SAFETY: Ensure cloned item explicitly carries over the currency
//       selectedCurrency: original.selectedCurrency || 'USD'
//     };
    
//     library.push(cloned);
//     localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
//     return cloned;
//   } catch (error) {
//     console.error('❌ Error cloning itinerary:', error);
//     return null;
//   }
// };



// export const updateItineraryStatus = (id: string, status: 'confirmed' | 'cancelled' | 'completed', extraData?: Partial<StoredItineraryData>): boolean => {
//   try {
//     const library = getLibrary();
//     const index = library.findIndex(item => item.id === id);
    
//     if (index !== -1) {
//       library[index] = {
//         ...library[index],
//         bookingStatus: status,
//         updatedAt: new Date().toISOString(),
//         ...extraData // Merge leadGuestName, finalSellPrice, etc.
//       };
//       localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
//       return true;
//     }
//     return false;
//   } catch (error) {
//     console.error('Error updating status:', error);
//     return false;
//   }
// };










































import { DayPlan } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';

// --- 1. UPDATED INTERFACES ---
export interface RouteCity {
  name: string;
  type: 'city' | 'airport';
}

export interface RouteDay {
  id: number;        
  dayNumber: number; 
  date: string;      
  nights: number;    
  cities: RouteCity[];
  transportMode: string;
}

export interface RoutingData {
  startDate: string; // Stored as "dd/mm/yyyy" or "yyyy-mm-dd"
  endDate: string;   
  routes: RouteDay[];
}

export interface FixedDeparture {
  id: string;
  month: string;       // 👈 REPLACED date with month
  occupancy: string;   // 👈 REPLACED label with occupancy
  price: number;      
  status: 'Available' | 'Limited Seat' | 'Sold';
  isSelected: boolean; 
}




// --- NEW OPERATIONS INTERFACES ---


export interface Installment {
  id: string;
  label: string; // e.g., "Initial Deposit", "2nd Installment", "Final Balance"
  dueDate: string;
  percentage: number; // e.g. 20%
  amount: number; // Calculated amount
  status: 'Pending' | 'Overdue' | 'Paid';
}


// export interface ClientPayment {
//   id: string;
//   date: string;
//   amount: number;
//   mode: 'Bank Transfer' | 'Credit Card' | 'Cash' | 'UPI' | 'Cheque';
//   status: 'Cleared' | 'Pending';
//   referenceId: string; // Transaction ID
//   note?: string;
// }


export interface ClientPayment {
  id: string;
  date: string;
  type: 'Payment' | 'Refund'; // <--- NEW: Direction of money
  amount: number;
  mode: 'Bank Transfer' | 'Credit Card' | 'Cash' | 'UPI' | 'Cheque';
  status: 'Cleared' | 'Pending';
  referenceId: string;
  allocation?: string; // e.g. "Linked to Deposit"
  note?: string;
}



export interface VendorBooking {
  id: string;
  serviceId: string; // Links back to the itinerary item ID
  category: 'Stay' | 'Transport' | 'Activity' | 'Guide' | 'Meal';
  name: string; // e.g. "Grand Hyatt"
  
  // Link to SRM (Supplier Relationship Management)
  assignedSupplierId?: string; 

  // Financials
  estimatedCost: number; // Cost calculated during itinerary creation
  actualCost: number;    // What you actually pay the vendor (Net)
  paymentStatus: 'Unpaid' | 'Partial' | 'Paid'; 
  
  // Logistics & Documents
  bookingStatus: 'Pending' | 'Requested' | 'Confirmed' | 'Cancelled';
  confirmationNumber?: string; // <--- The "Real World" number you type in manually
  
  // Dates
  serviceDate: string; // <--- The Calculated Date (Fixes "TBA")
}

export interface VendorPayment {
  id: string;
  date: string;
  vendorId: string;        // Who did we pay?
  vendorName: string;      // Snapshot of name
  amount: number;          // Total amount sent
  mode: 'Bank Transfer' | 'Credit Card' | 'Cash' | 'Cheque';
  referenceId: string;     // Transaction ID / UTR
  bookingIds: string[];    // <--- CRITICAL: Which bookings does this payment cover?
  note?: string;
}

export interface OperationsData {
  isInitialized: boolean;
  
  clientPayments: ClientPayment[];
  vendorBookings: VendorBooking[];
  vendorPayments: VendorPayment[];
   installments: Installment[]; 
}


export interface PricingMatrix {
  [month: string]: { 
    [itemId: string]: number // Stores 'Net Total' for every item by ID
  }
}



// --- 2. STORAGE CONSTANTS ---
const STORAGE_KEY = 'itinerary_draft';
const LIBRARY_KEY = 'itinerary_library';

// --- 3. MAIN DATA INTERFACE ---
export interface StoredItineraryData {
  startDate(startDate: any): unknown;
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
  selectedCurrency?: string; 
  roundingMode?: string;
  
  flights: any[];
  travelers: any[];
  agentTravelers: any[];
  routingData?: RoutingData; 
  dayWiseActivities?: DayPlan[];
  markupPercentage?: number; 
  taxPercentage?: number;
 
  adultCount?: number; 
  childCount?: number;

  // --- NEW FIELDS FOR TRIPS MODULE ---
  bookingStatus?: 'quote' | 'confirmed' | 'cancelled' | 'completed'; 
  leadGuestName?: string; 
  finalSellPrice?: number; 

  assignedAgentId?: string;
  // -----------------------------------

  operations?: OperationsData; // <--- NEW FIELD


  // NEW: Template Level Fields
  isFixedDeparture?: boolean;         // Flag: Is this a Series Master?
  fixedDepartures?: FixedDeparture[]; // The Inventory List
  
  // NEW: Quote Instance Fields
  useFixedPrice?: boolean;            // If true, override dynamic calculation
  selectedDepartureId?: string;
  
  lastSaved?: string;
  createdAt?: string;
  updatedAt?: string;

  status?: 'draft' | 'pending_costing' | 'approved' | 'reedit_requested' | 'active' | 'archived';

  adminComment?: string;
  reEditReason?: string;

  // 👇 ADD THIS NEW FIELD
  pricingMatrix?: PricingMatrix;

  // 👇 ADD THESE
  seasonStartDate?: string; // e.g. "2026-01-01"
  seasonEndDate?: string;
}

// --- 4. DATE HELPER (CRITICAL FIX) ---
// JavaScript hates "dd/mm/yyyy". This function fixes it.
export const parseDate = (dateStr: string | undefined): Date | null => {
  if (!dateStr) return null;
  
  // Check if it's already ISO format (yyyy-mm-dd)
  if (dateStr.includes('-')) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }

  // Handle "dd/mm/yyyy"
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      // Create date: year, month (0-indexed), day
      // parseInt("01") works correctly
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; 
      const year = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return isNaN(d.getTime()) ? null : d;
    }
  }
  
  return null;
};

// --- 5. GENERATOR ---
const generateId = (): string => {
  return `ITN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
};

// --- 6. STORAGE FUNCTIONS ---

export const saveItineraryToStorage = (data: StoredItineraryData): boolean => {
  try {
    const dataToSave = {
      ...data,
      selectedCurrency: data.selectedCurrency || 'USD',
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('Error saving draft:', error);
    return false;
  }
};

export const loadItineraryFromStorage = (): StoredItineraryData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const data = JSON.parse(stored);
    if (!data.selectedCurrency) data.selectedCurrency = 'USD';
    return data;
  } catch (error) { return null; }
};

export const clearItineraryStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getLibrary = (): StoredItineraryData[] => {
  try {
    const stored = localStorage.getItem(LIBRARY_KEY);
    if (!stored) return [];
    const library = JSON.parse(stored);
    return library.map((item: StoredItineraryData) => ({
        ...item,
        selectedCurrency: item.selectedCurrency || 'USD',
        // Ensure default booking status is 'quote' if undefined
        bookingStatus: item.bookingStatus || 'quote'
    }));
  } catch (error) { return []; }
};

export const saveToLibrary = (data: StoredItineraryData): boolean => {
  try {
    const library = getLibrary();
    const updatedLibrary = [...library];
    const cleanData = {
        ...data,
        selectedCurrency: data.selectedCurrency || 'USD'
    };
    
    if (data.id) {
      const index = updatedLibrary.findIndex(item => item.id === data.id);
      if (index !== -1) {
        updatedLibrary[index] = { ...cleanData, updatedAt: new Date().toISOString() };
      } else {
        updatedLibrary.push({
          ...cleanData,
          createdAt: cleanData.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: cleanData.status || 'active'
        });
      }
    } else {
      const newItinerary: StoredItineraryData = {
        ...cleanData,
        id: generateId(),
        tripId: data.tripId || `TRIP-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        bookingStatus: data.isMasterItinerary ? 'quote' : 'quote' // Default
      };
      updatedLibrary.push(newItinerary);
    }
    
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(updatedLibrary));
    return true;
  } catch (error) { return false; }
};

export const getItineraryById = (id: string): StoredItineraryData | null => {
  const library = getLibrary();
  return library.find(item => item.id === id) || null;
};

export const deleteFromLibrary = (id: string): boolean => {
  try {
    const library = getLibrary();
    const filtered = library.filter(item => item.id !== id);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) { return false; }
};

// export const cloneItinerary = (id: string, asQuote = false): StoredItineraryData | null => {
//   try {
//     const library = getLibrary();
//     const original = library.find(item => item.id === id);
//     if (!original) return null;
    
//     const cloned: StoredItineraryData = {
//       ...original,
//       id: generateId(),
//       tripId: `COPY-${Date.now().toString().slice(-6)}`,
//       tripName: `${original.tripName} (Copy)`,
//       isMasterItinerary: asQuote ? false : original.isMasterItinerary, // If asQuote is true, it becomes a regular trip
//       bookingStatus: 'quote', // Always starts as quote
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       status: 'active',
//       selectedCurrency: original.selectedCurrency || 'USD'
//     };
    
//     library.push(cloned);
//     localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
//     return cloned;
//   } catch (error) { return null; }
// };


// 👇 UPDATED: Added agentId as the 3rd parameter
export const cloneItinerary = (id: string, asQuote = false, agentId?: string): StoredItineraryData | null => {
  try {
    const library = getLibrary();
    const original = library.find(item => item.id === id);
    if (!original) return null;
    
    const cloned: StoredItineraryData = {
      ...original,
      id: generateId(),
      tripId: `COPY-${Date.now().toString().slice(-6)}`,
      tripName: `${original.tripName} (Copy)`,
      isMasterItinerary: asQuote ? false : original.isMasterItinerary, 
      bookingStatus: 'quote', 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      selectedCurrency: original.selectedCurrency || 'USD',
      assignedAgentId: agentId // 👈 NEW: Stamp the owner's ID!
    };
    
    library.push(cloned);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
    return cloned;
  } catch (error) { return null; }
};

// --- NEW HELPER: STATUS UPDATER ---
export const updateItineraryStatus = (id: string, status: 'confirmed' | 'cancelled' | 'completed', extraData?: Partial<StoredItineraryData>): boolean => {
  try {
    const library = getLibrary();
    const index = library.findIndex(item => item.id === id);
    
    if (index !== -1) {
      library[index] = {
        ...library[index],
        bookingStatus: status,
        updatedAt: new Date().toISOString(),
        ...extraData 
      };
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
      return true;
    }
    return false;
  } catch (error) { return false; }
};




// ... inside utils/itineraryStorage.ts

export const deleteItinerary = (id: string): boolean => {
  try {
    const library = getLibrary();
    // Filter out the trip with the matching ID
    const updatedLibrary = library.filter(item => item.id !== id);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(updatedLibrary));
    return true;
  } catch (error) {
    console.error("Error deleting itinerary:", error);
    return false;
  }
}; 




// // =========================================================
// // 5. [FIXED] INITIALIZE OPERATIONS (SMART MERGE LOGIC)
// // =========================================================

export const initializeOperations = (itinerary: any): any => {
  const oldOperations = itinerary.operations || { isInitialized: false, clientPayments: [], vendorBookings: [], installments: [] };
  
  // 1. Initialize Installments (Default Plan) if missing
  let installments = oldOperations.installments || [];
  if (installments.length === 0 && itinerary.finalSellPrice > 0) {
     const total = itinerary.finalSellPrice;
     installments = [
        { id: 'inst_1', label: 'Booking Deposit', dueDate: new Date().toISOString().split('T')[0], percentage: 20, amount: total * 0.20, status: 'Pending' },
        { id: 'inst_2', label: 'Final Balance', dueDate: itinerary.routingData?.startDate || '', percentage: 80, amount: total * 0.80, status: 'Pending' }
     ];
  }

  // 2. Initialize Vendors (Logic remains same as before, just ensuring date calculation)
  const existingBookingsMap = new Map(oldOperations.vendorBookings.map((b: VendorBooking) => [b.serviceId, b]));
  const newBookings: VendorBooking[] = [];
  const days = (itinerary.dayWiseActivities || []) as DayPlan[];
  const pax = Number(itinerary.numberOfTravelers) || 1;

  const getServiceDate = (day: DayPlan): string => {
    if (day.date && day.date !== "") return day.date;
    if (itinerary.routingData?.startDate) {
        const start = parseDate(itinerary.routingData.startDate);
        if (start) {
            const current = new Date(start);
            current.setDate(current.getDate() + (day.dayNumber - 1));
            return current.toISOString().split('T')[0]; 
        }
    }
    return 'TBA'; 
  };

  days.forEach((day) => {
    const dateStr = getServiceDate(day);

    // Stays
    day.stays?.forEach((s) => {
       if(s.inclusionType === 'included') {
         const booking: VendorBooking = {
           id: `bk_stay_${s.id}`,
           serviceId: String(s.id),
           category: 'Stay',
           name: s.hotelName || 'Unknown Hotel',
           estimatedCost: (Number(s.costPerNight) || 0) * (Number(s.numRooms) || 1) * (Number(s.nights) || 1),
           actualCost: 0,
           paymentStatus: 'Unpaid',
           bookingStatus: 'Pending',
           assignedSupplierId: '', 
           confirmationNumber: '',
           serviceDate: dateStr
         };
         const oldData = existingBookingsMap.get(String(s.id)) as VendorBooking | undefined;
         if (oldData) Object.assign(booking, { actualCost: oldData.actualCost, paymentStatus: oldData.paymentStatus, bookingStatus: oldData.bookingStatus, confirmationNumber: oldData.confirmationNumber, assignedSupplierId: oldData.assignedSupplierId });
         newBookings.push(booking);
       }
    });

    // Transports
    day.transports?.forEach((t) => {
        if(t.inclusionType === 'included') {
            const booking: VendorBooking = {
                id: `bk_trans_${t.id}`,
                serviceId: String(t.id),
                category: 'Transport',
                name: `${t.vehicleType} (${t.subType})`,
                estimatedCost: (Number(t.price) || 0) * (Number(t.vehicleCount) || 1),
                actualCost: 0,
                paymentStatus: 'Unpaid',
                bookingStatus: 'Pending',
                assignedSupplierId: '',
                confirmationNumber: '',
                serviceDate: dateStr
            };
            const oldData = existingBookingsMap.get(String(t.id)) as VendorBooking | undefined;
            if (oldData) Object.assign(booking, { actualCost: oldData.actualCost, paymentStatus: oldData.paymentStatus, bookingStatus: oldData.bookingStatus, confirmationNumber: oldData.confirmationNumber, assignedSupplierId: oldData.assignedSupplierId });
            newBookings.push(booking);
        }
    });

    // Activities
    day.activities?.forEach((a) => {
        if(a.inclusionType === 'included') {
            const booking: VendorBooking = {
                id: `bk_act_${a.id}`,
                serviceId: String(a.id),
                category: 'Activity',
                name: a.heading || 'Unknown Activity',
                estimatedCost: ((Number(a.entranceFeePP) || 0) + (Number(a.activityFeePP) || 0)) * pax,
                actualCost: 0,
                paymentStatus: 'Unpaid',
                bookingStatus: 'Pending',
                assignedSupplierId: '',
                confirmationNumber: '',
                serviceDate: dateStr
            };
            const oldData = existingBookingsMap.get(String(a.id)) as VendorBooking | undefined;
            if (oldData) Object.assign(booking, { actualCost: oldData.actualCost, paymentStatus: oldData.paymentStatus, bookingStatus: oldData.bookingStatus, confirmationNumber: oldData.confirmationNumber, assignedSupplierId: oldData.assignedSupplierId });
            newBookings.push(booking);

            if (a.guideType === 'guided') {
                const guideId = `guide_${a.id}`;
                const guideBooking: VendorBooking = {
                    id: `bk_${guideId}`,
                    serviceId: guideId,
                    category: 'Guide',
                    name: `Guide for: ${a.heading}`,
                    estimatedCost: Number(a.guideFee) || 0,
                    actualCost: 0,
                    paymentStatus: 'Unpaid',
                    bookingStatus: 'Pending',
                    assignedSupplierId: '',
                    confirmationNumber: '',
                    serviceDate: dateStr
                };
                const oldGuide = existingBookingsMap.get(guideId) as VendorBooking | undefined;
                if (oldGuide) Object.assign(guideBooking, { actualCost: oldGuide.actualCost, paymentStatus: oldGuide.paymentStatus, bookingStatus: oldGuide.bookingStatus, confirmationNumber: oldGuide.confirmationNumber, assignedSupplierId: oldGuide.assignedSupplierId });
                newBookings.push(guideBooking);
            }
        }
    });
  });

  return {
    ...itinerary,
    operations: {
        isInitialized: true,
        installments: installments, // Preserved or Defaulted
        clientPayments: oldOperations.clientPayments, // Preserved
        vendorBookings: newBookings // Recalculated/Merged
    }
  };
};

export const saveOperationsData = (tripId: string, opsData: OperationsData) => {
    const libraryStr = localStorage.getItem(LIBRARY_KEY); 
    if (!libraryStr) return;
    const library = JSON.parse(libraryStr);

    const index = library.findIndex((item: any) => item.id === tripId);
    if (index !== -1) {
        library[index].operations = opsData;
        localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
    }
};




