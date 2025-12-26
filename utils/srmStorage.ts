
// const SRM_STORAGE_KEY = 'srm_suppliers_data';

// // --- Interfaces ---

// export interface ContactPerson {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   email: string;
// }

// export interface InventoryRow {
//   id: string;
//   serviceName: string;
//   rates: { [key: string]: string }; 
// }

// export interface TaxRow {
//   id: string;
//   vehicle: string;
//   city: string;
//   taxType: string;
//   routingFrom?: string;
//   routingTo?: string;
//   chargesFor: string;
//   cost: string;
// }

// export interface DescriptionRow {
//   id: string;
//   vehicleType: string;
//   seatingCapacity: string;
//   comfortableFor: string;
//   luggageDetails: string;
//   luggageVan: boolean;
//   image: string | null; 
// }

// export interface SupplierData {
//   id: string; 
//   supplierId: string; // TD/SP/2025/001 format
//   name: string;
//   type: string;
//   services: string[]; 
//   commMode: string;
//   address: string;
//   country: string;
//   state: string;
//   city?: string; 
//   zipCode: string;
//   rating: string;
//   website: string;
//   referBy: string;
//   status: 'Active' | 'Inactive' | 'Blacklisted';
//   contacts: ContactPerson[]; 

//   // Validity
//   validityStart?: string;
//   validityEnd?: string;
  
//   // Inventory Module
//   inventoryRows?: InventoryRow[];

//   // Taxes Module
//   allTaxesIncluded?: boolean;
//   taxRows?: TaxRow[];

//   // Description Module
//   descriptionRows?: DescriptionRow[];
  
//   // Metadata
//   createdAt: string;
//   updatedAt: string;
// }

// // --- Helper Functions ---

// // Generate a display ID like TD/SP/2025/001
// const generateSupplierId = (index: number): string => {
//   const year = new Date().getFullYear();
//   const paddedIndex = (index + 1).toString().padStart(3, '0');
//   return `TD/SP/${year}/${paddedIndex}`;
// };

// export const getSuppliers = (): SupplierData[] => {
//   if (typeof window === 'undefined') return [];
//   try {
//     const data = localStorage.getItem(SRM_STORAGE_KEY);
//     return data ? JSON.parse(data) : [];
//   } catch (error) {
//     console.error("Error loading suppliers", error);
//     return [];
//   }
// };

// export const saveSupplier = (supplier: SupplierData): boolean => {
//   try {
//     const suppliers = getSuppliers();
    
//     if (supplier.id) {
//       // Update existing
//       const index = suppliers.findIndex(s => s.id === supplier.id);
//       if (index !== -1) {
//         suppliers[index] = { ...supplier, updatedAt: new Date().toISOString() };
//       } else {
//         suppliers.push(supplier);
//       }
//     } else {
//       // Create New
//       supplier.id = Date.now().toString();
//       supplier.supplierId = generateSupplierId(suppliers.length);
//       supplier.createdAt = new Date().toISOString();
//       supplier.updatedAt = new Date().toISOString();
//       suppliers.push(supplier);
//     }
    
//     localStorage.setItem(SRM_STORAGE_KEY, JSON.stringify(suppliers));
//     return true;
//   } catch (error) {
//     console.error("Error saving supplier", error);
//     return false;
//   }
// };

// export const deleteSupplier = (id: string): boolean => {
//   try {
//     const suppliers = getSuppliers();
//     const filtered = suppliers.filter(s => s.id !== id);
//     localStorage.setItem(SRM_STORAGE_KEY, JSON.stringify(filtered));
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

// export const getSupplierById = (id: string): SupplierData | undefined => {
//   const suppliers = getSuppliers();
//   return suppliers.find(s => s.id === id);
// };

// export const duplicateSupplier = (id: string): boolean => {
//   try {
//     const suppliers = getSuppliers();
//     const original = suppliers.find(s => s.id === id);
    
//     if (!original) return false;

//     // Create a deep copy
//     const newSupplier: SupplierData = JSON.parse(JSON.stringify(original));
    
//     // Update unique fields
//     newSupplier.id = Date.now().toString();
//     newSupplier.supplierId = generateSupplierId(suppliers.length); 
//     newSupplier.name = `${original.name} (Copy)`; 
//     newSupplier.createdAt = new Date().toISOString();
//     newSupplier.updatedAt = new Date().toISOString();

//     suppliers.unshift(newSupplier); // Add to top of list
//     localStorage.setItem(SRM_STORAGE_KEY, JSON.stringify(suppliers));
//     return true;
//   } catch (error) {
//     console.error("Error cloning supplier", error);
//     return false;
//   }
// };

// // ** NEW: For Drag and Drop Reordering **
// export const saveAllSuppliers = (suppliers: SupplierData[]): boolean => {
//   try {
//     localStorage.setItem(SRM_STORAGE_KEY, JSON.stringify(suppliers));
//     return true;
//   } catch (error) {
//     console.error("Error saving all suppliers", error);
//     return false;
//   }
// };  



// // STay part 


// export interface StayContact {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   email: string;
// }


// export interface RoomRate {
//   single: string;
//   dbl: string;
//   triple: string;
// }

// export interface InventoryRow {
//   id: string;
//   validityStart: string;
//   validityEnd: string;
//   superior: RoomRate;
//   executive: RoomRate;
//   deluxe: RoomRate;
//   luxury: RoomRate; // Added Luxury as requested
// }

// export interface PeakPeriod {
//   id: string;
//   startDate: string;
//   endDate: string;
//   price: string;
// }

// export interface GalaMeal {
//   id: string;
//   date: string;
//   price: string;
// }


// export interface StayData {
//   id: string;
//   stayId: string; // e.g., TD/HTL/2025/001
//   stayName: string;
//   supplierDetails: string; // Linked supplier name or ID
//   category: string;
//   address: string;
//   stayType: string;
//   checkInTime: string;
//   checkOutTime: string;
//   country: string;
//   state: string;
//   zipCode: string;
//   reviewRating: string;
//   commMode: string;
//   website: string;
//   distanceFromCentre: string;
//   status: 'Active' | 'Inactive' | 'Blacklisted';
  
//   // Contacts (Primary, Secondary, Third)
//   contacts: StayContact[];


//   // --- NEW INVENTORY FIELDS ---
//   pricingType?: 'Per Night' | 'Per Stay';
  
//   // Room Grid
//   inventoryRows?: InventoryRow[];

//   // Commission & Tax
//   commission?: {
//     enabled: boolean;
//     rate: string;
//   };
//   tax?: {
//     enabled: boolean;
//     type: string; // GST, HST, VAT
//     rate: string;
//   };

//   // Supplements
//   peakPeriods?: PeakPeriod[];
  
//   // meals?: {
//   //   breakfast: string;
//   //   lunch: string;
//   //   dinner: string;
//   //   taxEnabled: boolean;
//   //   taxType: string;
//   //   taxRate: string;
//   // };

//   meals?: {
//     // Price fields
//     breakfast: string;
//     lunch: string;
//     dinner: string;

//     // NEW: Toggle states for "Included" logic
//     isBreakfastIncluded?: boolean;
//     isLunchIncluded?: boolean;
//     isDinnerIncluded?: boolean;

//     // Tax fields
//     taxEnabled: boolean;
//     taxType: string;
//     taxRate: string;
//   };

//   galaMeals?: GalaMeal[];
  
//   createdAt: string;
//   updatedAt: string;
// }




// export interface AttractionData {
//   id: string;
//   attractionId: string;
//   heading: string;
//   slot: string;
//   startTime: string;
//   duration: string;
//   country: string;
//   state: string;
//   city: string;
//   status: 'Active' | 'Inactive' | 'Blacklisted';
  
//   // Lists
//   monuments: string[]; 
//   selectedMonuments: string[]; 
  
//   // Financials
//   totalMonumentFee: string;
//   vehicleType: string;
//   allTaxesIncluded: boolean;
  
//   // Tax Details
//   salesTaxPercent: string;
  
//   // PERSISTENCE FIX: We need to store WHICH taxes were selected
//   selectedStateTaxIds: string[]; // List of IDs like ['tax1', 'tax2']
//   stateTaxAmount: string; 
  
//   selectedTollTaxIds: string[]; // List of IDs like ['toll1']
//   tollTaxAmount: string;  
  
//   parkingTaxPercent: string;
  
//   createdAt: string;
//   updatedAt: string;
// }

// const SRM_STAY_KEY = 'srm_stay_data';

// // --- STAY HELPER FUNCTIONS ---

// const generateStayId = (index: number): string => {
//   const year = new Date().getFullYear();
//   const paddedIndex = (index + 1).toString().padStart(3, '0');
//   return `TD/HTL/${year}/${paddedIndex}`;
// };

// export const getStays = (): StayData[] => {
//   if (typeof window === 'undefined') return [];
//   try {
//     const data = localStorage.getItem(SRM_STAY_KEY);
//     return data ? JSON.parse(data) : [];
//   } catch (error) {
//     console.error("Error loading stays", error);
//     return [];
//   }
// };

// export const saveStay = (stay: StayData): boolean => {
//   try {
//     const stays = getStays();
    
//     if (stay.id) {
//       // Update existing
//       const index = stays.findIndex(s => s.id === stay.id);
//       if (index !== -1) {
//         stays[index] = { ...stay, updatedAt: new Date().toISOString() };
//       } else {
//         stays.push(stay);
//       }
//     } else {
//       // Create New
//       stay.id = Date.now().toString();
//       stay.stayId = generateStayId(stays.length);
//       stay.createdAt = new Date().toISOString();
//       stay.updatedAt = new Date().toISOString();
//       stays.push(stay);
//     }
    
//     localStorage.setItem(SRM_STAY_KEY, JSON.stringify(stays));
//     return true;
//   } catch (error) {
//     console.error("Error saving stay", error);
//     return false;
//   }
// };

// export const deleteStay = (id: string): boolean => {
//   try {
//     const stays = getStays();
//     const filtered = stays.filter(s => s.id !== id);
//     localStorage.setItem(SRM_STAY_KEY, JSON.stringify(filtered));
//     return true;
//   } catch (error) {
//     return false;
//   }
// };



// const SRM_ATTRACTION_KEY = 'srm_attraction_data';

// // Helper to get Attractions
// export const getAttractions = (): AttractionData[] => {
//   if (typeof window === 'undefined') return [];
//   try {
//     const data = localStorage.getItem(SRM_ATTRACTION_KEY);
//     return data ? JSON.parse(data) : [];
//   } catch (error) { return []; }
// };

// // Helper to save Attraction
// export const saveAttraction = (data: AttractionData): boolean => {
//   try {
//     const list = getAttractions();
//     if (data.id) {
//       const index = list.findIndex(i => i.id === data.id);
//       if (index !== -1) list[index] = { ...data, updatedAt: new Date().toISOString() };
//       else list.push(data);
//     } else {
//       data.id = Date.now().toString();
//       // Generate ID like TD/ATT/2025/001
//       const count = list.length + 1;
//       data.attractionId = `TD/ATT/${new Date().getFullYear()}/${count.toString().padStart(3, '0')}`;
//       data.createdAt = new Date().toISOString();
//       data.updatedAt = new Date().toISOString();
//       list.push(data);
//     }
//     localStorage.setItem(SRM_ATTRACTION_KEY, JSON.stringify(list));
//     return true;
//   } catch (error) { return false; }
// };

// export const deleteAttraction = (id: string): boolean => {
//     try {
//         const list = getAttractions();
//         const filtered = list.filter(i => i.id !== id);
//         localStorage.setItem(SRM_ATTRACTION_KEY, JSON.stringify(filtered));
//         return true;
//     } catch (e) { return false; }
// } 









// utils/srmStorage.ts

// ==========================================
// 1. SUPPLIER MODULE
// ==========================================

const SRM_SUPPLIER_KEY = 'srm_suppliers_data';

export interface ContactPerson {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface InventoryRow {
  id: string;
  serviceName: string;
  rates: { [key: string]: string }; 
}

export interface TaxRow {
  id: string;
  vehicle: string;
  city: string;
  taxType: string;
  routingFrom?: string;
  routingTo?: string;
  chargesFor: string;
  cost: string;
}

export interface DescriptionRow {
  id: string;
  vehicleType: string;
  seatingCapacity: string;
  comfortableFor: string;
  luggageDetails: string;
  luggageVan: boolean;
  image: string | null; 
}

export interface SupplierData {
  id: string; 
  supplierId: string; // Format: TD/SP/2025/001
  name: string;
  type: string;
  services: string[]; 
  commMode: string;
  address: string;
  country: string;
  state: string;
  city?: string; 
  zipCode: string;
  rating: string;
  website: string;
  referBy: string;
  status: 'Active' | 'Inactive' | 'Blacklisted';
  contacts: ContactPerson[]; 

  validityStart?: string;
  validityEnd?: string;
  
  inventoryRows?: InventoryRow[];
  allTaxesIncluded?: boolean;
  taxRows?: TaxRow[];
  descriptionRows?: DescriptionRow[];
  
  createdAt: string;
  updatedAt: string;
}

// --- Supplier Helpers ---

const generateSupplierId = (index: number): string => {
  const year = new Date().getFullYear();
  const paddedIndex = (index + 1).toString().padStart(3, '0');
  return `TD/SP/${year}/${paddedIndex}`;
};

export const getSuppliers = (): SupplierData[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SRM_SUPPLIER_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading suppliers", error);
    return [];
  }
};

export const saveSupplier = (supplier: SupplierData): boolean => {
  try {
    const suppliers = getSuppliers();
    
    if (supplier.id) {
      // Update existing
      const index = suppliers.findIndex(s => s.id === supplier.id);
      if (index !== -1) {
        suppliers[index] = { ...supplier, updatedAt: new Date().toISOString() };
      } else {
        suppliers.push(supplier);
      }
    } else {
      // Create New
      supplier.id = Date.now().toString();
      supplier.supplierId = generateSupplierId(suppliers.length);
      supplier.createdAt = new Date().toISOString();
      supplier.updatedAt = new Date().toISOString();
      suppliers.push(supplier);
    }
    
    localStorage.setItem(SRM_SUPPLIER_KEY, JSON.stringify(suppliers));
    return true;
  } catch (error) {
    console.error("Error saving supplier", error);
    return false;
  }
};

export const deleteSupplier = (id: string): boolean => {
  try {
    const suppliers = getSuppliers();
    const filtered = suppliers.filter(s => s.id !== id);
    localStorage.setItem(SRM_SUPPLIER_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) { return false; }
};

export const duplicateSupplier = (id: string): boolean => {
  try {
    const suppliers = getSuppliers();
    const original = suppliers.find(s => s.id === id);
    if (!original) return false;

    const newSupplier: SupplierData = JSON.parse(JSON.stringify(original));
    newSupplier.id = Date.now().toString();
    newSupplier.supplierId = generateSupplierId(suppliers.length); 
    newSupplier.name = `${original.name} (Copy)`; 
    newSupplier.createdAt = new Date().toISOString();
    newSupplier.updatedAt = new Date().toISOString();

    suppliers.unshift(newSupplier);
    localStorage.setItem(SRM_SUPPLIER_KEY, JSON.stringify(suppliers));
    return true;
  } catch (error) { return false; }
};

export const saveAllSuppliers = (suppliers: SupplierData[]): boolean => {
  try {
    localStorage.setItem(SRM_SUPPLIER_KEY, JSON.stringify(suppliers));
    return true;
  } catch (error) { return false; }
};


// ==========================================
// 2. STAY MODULE
// ==========================================

const SRM_STAY_KEY = 'srm_stay_data';

export interface MonthlyRates {
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
}

export interface RateCard {
  year: number; // e.g., 2025
  rates: MonthlyRates;
}

export interface RoomCategory {
  id: string;
  name: string;      // e.g. "Standard Room", "Suite"
  maxOccupancy: number; // e.g. 2, 3, 4 (Crucial for your "pax" logic)
  bedType: string;   // e.g. "King", "Twin"
  inclusions: string[]; // e.g. ["Breakfast", "Wifi"]
  rateCards: RateCard[]; // Stores 2025 rates, 2026 rates, etc.
}

export interface StayData {
  id: string;
  stayId?: string;
  name: string; // Hotel Name
  type: string; // Hotel, Resort, Villa
  city: string;
  country: string;
  address: string;
  rating: number; // 1-5
  description: string;
  
  // Media
  images: string[]; // Array of base64 strings
  
  // The Inventory
  roomCategories: RoomCategory[];

  // Metadata
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

// --- Stay Helpers ---

const generateStayId = (index: number): string => {
  const year = new Date().getFullYear();
  const paddedIndex = (index + 1).toString().padStart(3, '0');
  return `TD/HTL/${year}/${paddedIndex}`;
};

export const getStays = (): StayData[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SRM_STAY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) { return []; }
};

export const saveStay = (stay: StayData): boolean => {
  try {
    const stays = getStays();
    if (stay.id) {
      const index = stays.findIndex(s => s.id === stay.id);
      if (index !== -1) stays[index] = { ...stay, updatedAt: new Date().toISOString() };
      else stays.push(stay);
    } else {
      stay.id = Date.now().toString();
      stay.stayId = generateStayId(stays.length);
      stay.createdAt = new Date().toISOString();
      stay.updatedAt = new Date().toISOString();
      stays.push(stay);
    }
    localStorage.setItem(SRM_STAY_KEY, JSON.stringify(stays));
    return true;
  } catch (error) { return false; }
};

export const deleteStay = (id: string): boolean => {
  try {
    const stays = getStays();
    const filtered = stays.filter(s => s.id !== id);
    localStorage.setItem(SRM_STAY_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) { return false; }
};


// ==========================================
// 3. ACTIVITY (ATTRACTION) MODULE
// ==========================================

const SRM_ATTRACTION_KEY = 'srm_attraction_data';


export interface AttractionData {
  id: string;
  name: string;
  type: 'Monument' | 'Attraction' | 'Museum' | 'Adventure' | 'Show';
  city: string;
  country: string;
  
  // New Visuals
  imageUrl?: string; // Store Base64 string for demo
  
 

  // Timing & Logistics (NEW)
  duration: string;       
  suggestedSlot: string;  // Morning, Afternoon, etc.
  startTime: string;      // e.g., "11:00"
  pickupLocation: string; // e.g., "Hotel Lobby"
  
  // UPDATED Financials (Matching Itinerary Builder)
  entranceFee: number;
  activityFee: number;
  
  // Smart Logic
  isGuideRequired: boolean; // Auto-selects "Guided" in builder
  guideFee: number;       // Only if guide is required
  
  // Ratings & External Info (NEW)
  rating: number;         // 1 to 5
  reviewsCount: number;   // e.g., 120
  providerLink: string;
  
  description: string;
  status: 'Active' | 'Inactive';

  createdAt?: string;
  updatedAt?: string;
}


// --- Activity Helpers ---

export const getAttractions = (): AttractionData[] => {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(SRM_ATTRACTION_KEY) || '[]'); } catch { return []; }
};

export const saveAttraction = (data: AttractionData): boolean => {
  try {
    const list = getAttractions();
    if (data.id) {
      const index = list.findIndex(i => i.id === data.id);
      if (index !== -1) list[index] = { ...data, updatedAt: new Date().toISOString() };
      else list.push(data);
    } else {
      data.id = Date.now().toString();
      data.createdAt = new Date().toISOString();
      data.updatedAt = new Date().toISOString();
      list.push(data);
    }
    localStorage.setItem(SRM_ATTRACTION_KEY, JSON.stringify(list));
    return true;
  } catch (error) { return false; }
};

export const deleteAttraction = (id: string): boolean => {
  try {
    const list = getAttractions();
    const filtered = list.filter(i => i.id !== id);
    localStorage.setItem(SRM_ATTRACTION_KEY, JSON.stringify(filtered));
    return true;
  } catch { return false; }
};


// ==========================================
// 4. TRANSPORT MODULE
// ==========================================

const SRM_TRANSPORT_KEY = 'srm_transport_data';

export interface TransportData {
  id: string;
  vehicleType: string; // e.g., Sedan, SUV, Coach
  serviceType: 'Transfer' | 'Disposal';
  city: string;
  country: string;
  
  // Specs for UI
  maxGuests: number;
  luggageCapacity: string;
  
  // Cost
  basePrice: number;

  // --- NEW FIELDS FOR ITINERARY BUILDER ---
  description?: string;      // The journey narrative
  defaultPickup?: string;    // e.g. "Airport"
  defaultDropoff?: string;   // e.g. "City Center" (For Transfers)
  defaultDuration?: string;  // e.g. "8 Hours" (For Disposal)
  // ----------------------------------------
  
  status: 'Active' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}

// --- Transport Helpers ---

// export const getTransports = (): TransportData[] => {
//    if (typeof window === 'undefined') return [];
//    try { return JSON.parse(localStorage.getItem(SRM_TRANSPORT_KEY) || '[]'); } catch { return []; }
// };

// export const saveTransport = (data: TransportData): boolean => {
//   try {
//     const list = getTransports();
//     if (data.id) {
//       const index = list.findIndex(i => i.id === data.id);
//       if (index !== -1) list[index] = { ...data, updatedAt: new Date().toISOString() };
//       else list.push(data);
//     } else {
//       data.id = Date.now().toString();
//       data.createdAt = new Date().toISOString();
//       data.updatedAt = new Date().toISOString();
//       list.push(data);
//     }
//     localStorage.setItem(SRM_TRANSPORT_KEY, JSON.stringify(list));
//     return true;
//   } catch (error) { return false; }
// };

// export const deleteTransport = (id: string): boolean => {
//   try {
//     const list = getTransports();
//     const filtered = list.filter(i => i.id !== id);
//     localStorage.setItem(SRM_TRANSPORT_KEY, JSON.stringify(filtered));
//     return true;
//   } catch { return false; }
// };


export const getTransports = (): TransportData[] => {
   if (typeof window === 'undefined') return [];
   try { return JSON.parse(localStorage.getItem(SRM_TRANSPORT_KEY) || '[]'); } catch { return []; }
};

export const saveTransport = (data: TransportData): boolean => {
  try {
    const list = getTransports();
    if (data.id) {
      const index = list.findIndex(i => i.id === data.id);
      if (index !== -1) list[index] = { ...data, updatedAt: new Date().toISOString() };
      else list.push(data);
    } else {
      data.id = Date.now().toString();
      data.createdAt = new Date().toISOString();
      data.updatedAt = new Date().toISOString();
      list.push(data);
    }
    localStorage.setItem(SRM_TRANSPORT_KEY, JSON.stringify(list));
    return true;
  } catch (error) { return false; }
};

export const deleteTransport = (id: string): boolean => {
  try {
    const list = getTransports();
    const filtered = list.filter(i => i.id !== id);
    localStorage.setItem(SRM_TRANSPORT_KEY, JSON.stringify(filtered));
    return true;
  } catch { return false; }
};

// ==========================================
// 5. MEAL MODULE
// ==========================================

const SRM_MEAL_KEY = 'srm_meal_data';

export interface MealData {
  id: string;
  restaurantName: string;
  cuisine: string;
  type: 'Standard' | 'Premium' | 'Luxury';
  city: string;
  country: string;
  rating: string;
  
  // Menu Info
  menuType: 'Buffet' | 'Fixed Menu' | 'A La Carte';
  
  // Cost
  adultPrice: number;
  childPrice?: number;
  
  status: 'Active' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}

// --- Meal Helpers ---

export const getMeals = (): MealData[] => {
   if (typeof window === 'undefined') return [];
   try { return JSON.parse(localStorage.getItem(SRM_MEAL_KEY) || '[]'); } catch { return []; }
};

export const saveMeal = (data: MealData): boolean => {
  try {
    const list = getMeals();
    if (data.id) {
      const index = list.findIndex(i => i.id === data.id);
      if (index !== -1) list[index] = { ...data, updatedAt: new Date().toISOString() };
      else list.push(data);
    } else {
      data.id = Date.now().toString();
      data.createdAt = new Date().toISOString();
      data.updatedAt = new Date().toISOString();
      list.push(data);
    }
    localStorage.setItem(SRM_MEAL_KEY, JSON.stringify(list));
    return true;
  } catch (error) { return false; }
};

export const deleteMeal = (id: string): boolean => {
  try {
    const list = getMeals();
    const filtered = list.filter(i => i.id !== id);
    localStorage.setItem(SRM_MEAL_KEY, JSON.stringify(filtered));
    return true;
  } catch { return false; }
};