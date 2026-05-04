

// // utils/srmStorage.ts

// // ==========================================
// // 1. SUPPLIER MODULE (FINAL MERGED VERSION)
// // ==========================================

// const SRM_SUPPLIER_KEY = 'srm_suppliers_data';

// // --- A. HELPER INTERFACES ---

// // For the "Documents" Tab
// export interface SupplierDoc {
//   id: string;
//   name: string; // e.g. "GST Certificate"
//   url: string;         // Now stores Base64 string instead of blob URL
//   type: 'general' | 'trip'; // NEW: Classification
//   tripRef?: string;    // NEW: Only for trip contracts (e.g. "Manali Batch 1")
//   expiryDate?: string;

// }

// // Legacy / Detailed Contact Info
// export interface ContactPerson {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   email: string;
//   designation?: string; 
// }

// // Legacy Inventory Interfaces (Optional)
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

// export interface BankDetails {
//   bankName: string;
//   accountNumber: string;
//   ifscCode: string; // or Swift Code
//   accountName: string;
// }

// // --- B. MAIN SUPPLIER DATA INTERFACE ---
// export interface SupplierData {
//   // 1. Identity
//   id: string; 
//   supplierId: string; // Format: TD/SP/2025/001
//   name: string;
//   type?: string; 
  
//   // 2. Services (The "DMC" Logic)
//   services: string[]; // e.g. ["Transport", "Activity", "Stay"]

//   // 3. PRO FEATURES (Visuals & Rating)
//   logoUrl?: string;         // URL/Base64 of the logo
//   isPreferred: boolean;     // Gold Star status
//   rating: number;           // 1 to 5 (Number format for stars)
//   documents: SupplierDoc[]; // Array of contracts/files
  
//   // 4. Contact Info 
//   contactPerson: string; 
//   phone: string;         
//   email: string;         
//   website?: string;
//   contacts?: ContactPerson[]; 
  
//   // 5. Location
//   city: string; 
//   country: string;
//   address: string;
//   state?: string;
//   zipCode?: string;
  
//   // 6. Financials
//   paymentTerms: 'Prepaid' | 'Pay at Hotel' | 'Credit-7' | 'Credit-15' | 'Credit-30';
//   currency: string;
//   taxRegistered: boolean; 
//   taxNumber?: string; // GST/VAT
//   bankDetails?: BankDetails;

//   // 7. Metadata & Status
//   referBy?: string;
//   status: 'Active' | 'Inactive' | 'Blacklisted';
  
//   // 8. Legacy/Advanced Inventory (Optional)
//   validityStart?: string;
//   validityEnd?: string;
//   inventoryRows?: InventoryRow[];
//   allTaxesIncluded?: boolean;
//   taxRows?: TaxRow[];
//   descriptionRows?: DescriptionRow[];
  
//   createdAt: string;
//   updatedAt: string;
// }

// // --- C. HELPER FUNCTIONS ---

// const generateSupplierId = (index: number): string => {
//   const year = new Date().getFullYear();
//   const paddedIndex = (index + 1).toString().padStart(3, '0');
//   return `TD/SP/${year}/${paddedIndex}`;
// };

// export const getSuppliers = (): SupplierData[] => {
//   if (typeof window === 'undefined') return [];
//   try {
//     const data = localStorage.getItem(SRM_SUPPLIER_KEY);
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
    
//     localStorage.setItem(SRM_SUPPLIER_KEY, JSON.stringify(suppliers));
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
//     localStorage.setItem(SRM_SUPPLIER_KEY, JSON.stringify(filtered));
//     return true;
//   } catch (error) { return false; }
// };

// export const duplicateSupplier = (id: string): boolean => {
//   try {
//     const suppliers = getSuppliers();
//     const original = suppliers.find(s => s.id === id);
//     if (!original) return false;

//     const newSupplier: SupplierData = JSON.parse(JSON.stringify(original));
//     newSupplier.id = Date.now().toString();
//     newSupplier.supplierId = generateSupplierId(suppliers.length); 
//     newSupplier.name = `${original.name} (Copy)`; 
//     newSupplier.createdAt = new Date().toISOString();
//     newSupplier.updatedAt = new Date().toISOString();

//     suppliers.unshift(newSupplier);
//     localStorage.setItem(SRM_SUPPLIER_KEY, JSON.stringify(suppliers));
//     return true;
//   } catch (error) { return false; }
// };

// export const saveAllSuppliers = (suppliers: SupplierData[]): boolean => {
//   try {
//     localStorage.setItem(SRM_SUPPLIER_KEY, JSON.stringify(suppliers));
//     return true;
//   } catch (error) { return false; }
// };



// // ==========================================
// // 2. STAY MODULE
// // ==========================================

// const SRM_STAY_KEY = 'srm_stay_data';

// export interface MonthlyRates {
//   jan: number;
//   feb: number;
//   mar: number;
//   apr: number;
//   may: number;
//   jun: number;
//   jul: number;
//   aug: number;
//   sep: number;
//   oct: number;
//   nov: number;
//   dec: number;
// }

// export interface RateCard {
//   year: number; // e.g., 2025
//   rates: MonthlyRates;
// }

// export interface RoomCategory {
//   id: string;
//   name: string;      // e.g. "Standard Room", "Suite"
//   maxOccupancy: number; // e.g. 2, 3, 4 (Crucial for your "pax" logic)
//   bedType: string;   // e.g. "King", "Twin"
//   inclusions: string[]; // e.g. ["Breakfast", "Wifi"]
//   rateCards: RateCard[]; // Stores 2025 rates, 2026 rates, etc.
// }

// export interface StayData {
//   id: string;
//   stayId?: string;
//   name: string; // Hotel Name
//   type: string; // Hotel, Resort, Villa
//   city: string;
//   country: string;
//   address: string;
//   rating: number; // 1-5
//   description: string;
  
//   // Media
//   images: string[]; // Array of base64 strings
  
//   // The Inventory
//   roomCategories: RoomCategory[];

//   linkedSupplierId?: string; 

//   // Metadata
//   status: 'Active' | 'Inactive';
//   createdAt: string;
//   updatedAt: string;
// }

// // --- Stay Helpers ---

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
//   } catch (error) { return []; }
// };

// export const saveStay = (stay: StayData): boolean => {
//   try {
//     const stays = getStays();
//     if (stay.id) {
//       const index = stays.findIndex(s => s.id === stay.id);
//       if (index !== -1) stays[index] = { ...stay, updatedAt: new Date().toISOString() };
//       else stays.push(stay);
//     } else {
//       stay.id = Date.now().toString();
//       stay.stayId = generateStayId(stays.length);
//       stay.createdAt = new Date().toISOString();
//       stay.updatedAt = new Date().toISOString();
//       stays.push(stay);
//     }
//     localStorage.setItem(SRM_STAY_KEY, JSON.stringify(stays));
//     return true;
//   } catch (error) { return false; }
// };

// export const deleteStay = (id: string): boolean => {
//   try {
//     const stays = getStays();
//     const filtered = stays.filter(s => s.id !== id);
//     localStorage.setItem(SRM_STAY_KEY, JSON.stringify(filtered));
//     return true;
//   } catch (error) { return false; }
// };


// // ==========================================
// // 3. ACTIVITY (ATTRACTION) MODULE
// // ==========================================

// const SRM_ATTRACTION_KEY = 'srm_attraction_data';


// export interface AttractionData {
//   id: string;
//   name: string;
//   type: 'Monument' | 'Attraction' | 'Museum' | 'Adventure' | 'Show';
//   city: string;
//   country: string;
  
//   // New Visuals
//   imageUrl?: string; // Store Base64 string for demo
  
 

//   // Timing & Logistics (NEW)
//   duration: string;       
//   suggestedSlot: string;  // Morning, Afternoon, etc.
//   startTime: string;      // e.g., "11:00"
//   pickupLocation: string; // e.g., "Hotel Lobby"
  
//   // UPDATED Financials (Matching Itinerary Builder)
//   entranceFee: number;
//   activityFee: number;
  
//   // Smart Logic
//   isGuideRequired: boolean; // Auto-selects "Guided" in builder
//   guideFee: number;       // Only if guide is required
  
//   // Ratings & External Info (NEW)
//   rating: number;         // 1 to 5
//   reviewsCount: number;   // e.g., 120
//   providerLink: string;
  
//   description: string;
//   status: 'Active' | 'Inactive';

//   linkedSupplierId?: string;

//   createdAt?: string;
//   updatedAt?: string;
// }


// // --- Activity Helpers ---

// export const getAttractions = (): AttractionData[] => {
//   if (typeof window === 'undefined') return [];
//   try { return JSON.parse(localStorage.getItem(SRM_ATTRACTION_KEY) || '[]'); } catch { return []; }
// };

// export const saveAttraction = (data: AttractionData): boolean => {
//   try {
//     const list = getAttractions();
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
//     localStorage.setItem(SRM_ATTRACTION_KEY, JSON.stringify(list));
//     return true;
//   } catch (error) { return false; }
// };

// export const deleteAttraction = (id: string): boolean => {
//   try {
//     const list = getAttractions();
//     const filtered = list.filter(i => i.id !== id);
//     localStorage.setItem(SRM_ATTRACTION_KEY, JSON.stringify(filtered));
//     return true;
//   } catch { return false; }
// };


// // ==========================================
// // 4. TRANSPORT MODULE
// // ==========================================

// const SRM_TRANSPORT_KEY = 'srm_transport_data';

// export interface TransportData {
//   id: string;
//   vehicleType: string; // e.g., Sedan, SUV, Coach
//   serviceType: 'Transfer' | 'Disposal';
//   city: string;
//   country: string;
  
//   // Specs for UI
//   maxGuests: number;
//   luggageCapacity: string;
  
//   // Cost
//   basePrice: number;

//   // --- NEW FIELDS FOR ITINERARY BUILDER ---
//   description?: string;      // The journey narrative
//   defaultPickup?: string;    // e.g. "Airport"
//   defaultDropoff?: string;   // e.g. "City Center" (For Transfers)
//   defaultDuration?: string;  // e.g. "8 Hours" (For Disposal)
//   // ----------------------------------------
  
//   status: 'Active' | 'Inactive';
//   createdAt?: string;
//   updatedAt?: string;
// }

// // --- Transport Helpers ---
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

// // ==========================================
// // 5. MEAL MODULE
// // ==========================================

// const SRM_MEAL_KEY = 'srm_meal_data';


// // utils/srmStorage.ts

// export interface MonthlyMealRate {
//   lunchAdult: number;
//   lunchChild: number;
//   dinnerAdult: number;
//   dinnerChild: number;
// }

// export interface MealRateCard {
//   year: number; // e.g. 2025
//   rates: { [key: string]: MonthlyMealRate }; // keys: 'jan', 'feb', etc.
// }

// export interface MealData {
//   id: string;
//   restaurantName: string;
//   cuisine: string;
//   type: 'Standard' | 'Premium' | 'Luxury';
//   city: string;
//   country: string;
//   address?: string;
//   rating: string;
  
//   // Visuals
//   images: string[];
  
//   // Menu Info
//   menuType: 'Buffet' | 'Fixed Menu' | 'A La Carte';
//   dietaryOptions: string[];
//   inclusions?: string; // NEW: "1 Starter, 2 Mains..."
  
//   // PRICING (Replaces static price)
//   currency: string;
//   rateCards: MealRateCard[]; // NEW: Matrix Logic
  
//   description?: string;
//   status: 'Active' | 'Inactive';
//   createdAt?: string;
//   updatedAt?: string;
// }



// // --- Meal Helpers ---

// export const getMeals = (): MealData[] => {
//    if (typeof window === 'undefined') return [];
//    try { return JSON.parse(localStorage.getItem(SRM_MEAL_KEY) || '[]'); } catch { return []; }
// };

// export const saveMeal = (data: MealData): boolean => {
//   try {
//     const list = getMeals();
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
//     localStorage.setItem(SRM_MEAL_KEY, JSON.stringify(list));
//     return true;
//   } catch (error) { return false; }
// };

// export const deleteMeal = (id: string): boolean => {
//   try {
//     const list = getMeals();
//     const filtered = list.filter(i => i.id !== id);
//     localStorage.setItem(SRM_MEAL_KEY, JSON.stringify(filtered));
//     return true;
//   } catch { return false; }
// }; 


























































// utils/srmStorage.ts

// ==========================================
// INTERFACES (Cleaned of Costing Fields)
// ==========================================

export interface SupplierDoc {
  id?: string;
  name: string;
  url: string;
  type: 'general' | 'trip';
  tripRef?: string;
  expiryDate?: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountName: string;
}

export interface SupplierData {
  id?: string; // Mapped from MongoDB _id
  _id?: string; // MongoDB internal ID
  supplierId: string;
  name: string;
  type?: string;
  services: string[];
  logoUrl?: string;
  isPreferred: boolean;
  rating: number;
  documents: SupplierDoc[];
  contactPerson: string;
  phone: string;
  email: string;
  website?: string;
  city: string;
  country: string;
  address: string;
  state?: string;
  zipCode?: string;
  paymentTerms: 'Prepaid' | 'Pay at Hotel' | 'Credit-7' | 'Credit-15' | 'Credit-30';
  currency: string;
  taxRegistered: boolean;
  taxNumber?: string;
  bankDetails?: BankDetails;
  status: 'Active' | 'Inactive' | 'Blacklisted';
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomCategory {
  rateCards: any;
  name: string;
  maxOccupancy: number;
  bedType: string;
  inclusions: string[];
}

export interface StayData {
  id?: string;
  _id?: string;
  stayId?: string;
  name: string;
  category?: string;
  type: string;
  city: string;
  country: string;
  address: string;
  rating: number;
  description: string;
  images: string[];
  roomCategories: RoomCategory[];
  linkedSupplierId?: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface AttractionData {
  id?: string;
  _id?: string;
  name: string;
  type: 'Monument' | 'Attraction' | 'Museum' | 'Adventure' | 'Show';
  city: string;
  country: string;
  imageUrl?: string;
  duration: string;
  suggestedSlot: string;
  startTime: string;
  pickupLocation: string;
  isGuideRequired: boolean;
  rating: number;
  reviewsCount: number;
  providerLink: string;
  description: string;
  status: 'Active' | 'Inactive';
  linkedSupplierId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransportData {
  id?: string;
  _id?: string;
  vehicleType: string;
  serviceType: 'Transfer' | 'Disposal';
  city: string;
  country: string;
  maxGuests: number;
  luggageCapacity: string;
  description?: string;
  defaultPickup?: string;
  defaultDropoff?: string;
  defaultDuration?: string;
  status: 'Active' | 'Inactive';
  linkedSupplierId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MealData {
  id?: string;
  _id?: string;
  restaurantName: string;
  cuisine: string;
  type: 'Standard' | 'Premium' | 'Luxury';
  city: string;
  country: string;
  address?: string;
  rating: string;
  images: string[];
  menuType: 'Buffet' | 'Fixed Menu' | 'A La Carte';
  dietaryOptions: string[];
  inclusions?: string;
  description?: string;
  status: 'Active' | 'Inactive';
  linkedSupplierId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// HELPER: Map MongoDB _id to frontend id
// ==========================================
const mapId = (item: any) => {
  if (!item) return item;
  const mapped = { ...item, id: item._id };
  return mapped;
};

// ==========================================
// 1. SUPPLIER API CALLS
// ==========================================
export const getSuppliers = async (): Promise<SupplierData[]> => {
  try {
    const res = await fetch('/api/srm/suppliers');
    const json = await res.json();
    return json.success ? json.data.map(mapId) : [];
  } catch (error) {
    console.error("Fetch suppliers failed:", error);
    return [];
  }
};

export const saveSupplier = async (data: SupplierData): Promise<boolean> => {
  try {
    // If it has an id (from the frontend), it's an update. We must send _id to the backend.
    const payload = data.id ? { ...data, _id: data.id } : data;
    const method = data.id ? 'PUT' : 'POST';

    const res = await fetch('/api/srm/suppliers', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const deleteSupplier = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/srm/suppliers?id=${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (error) {
    return false;
  }
};

// ==========================================
// 2. STAY API CALLS
// ==========================================
export const getStays = async (): Promise<StayData[]> => {
  try {
    const res = await fetch('/api/srm/stays');
    const json = await res.json();
    return json.success ? json.data.map(mapId) : [];
  } catch { return []; }
};

export const saveStay = async (data: StayData): Promise<boolean> => {
  try {
    const payload = data.id ? { ...data, _id: data.id } : data;
    const method = data.id ? 'PUT' : 'POST';
    const res = await fetch('/api/srm/stays', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch { return false; }
};

export const deleteStay = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/srm/stays?id=${id}`, { method: 'DELETE' });
    return res.ok;
  } catch { return false; }
};

// ==========================================
// 3. ACTIVITY (ATTRACTION) API CALLS
// ==========================================
export const getAttractions = async (): Promise<AttractionData[]> => {
  try {
    const res = await fetch('/api/srm/activities');
    const json = await res.json();
    return json.success ? json.data.map(mapId) : [];
  } catch { return []; }
};

export const saveAttraction = async (data: AttractionData): Promise<boolean> => {
  try {
    const payload = data.id ? { ...data, _id: data.id } : data;
    const method = data.id ? 'PUT' : 'POST';
    const res = await fetch('/api/srm/activities', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch { return false; }
};

export const deleteAttraction = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/srm/activities?id=${id}`, { method: 'DELETE' });
    return res.ok;
  } catch { return false; }
};

// ==========================================
// 4. TRANSPORT API CALLS
// ==========================================
export const getTransports = async (): Promise<TransportData[]> => {
  try {
    const res = await fetch('/api/srm/transports');
    const json = await res.json();
    return json.success ? json.data.map(mapId) : [];
  } catch { return []; }
};

export const saveTransport = async (data: TransportData): Promise<boolean> => {
  try {
    const payload = data.id ? { ...data, _id: data.id } : data;
    const method = data.id ? 'PUT' : 'POST';
    const res = await fetch('/api/srm/transports', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch { return false; }
};

export const deleteTransport = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/srm/transports?id=${id}`, { method: 'DELETE' });
    return res.ok;
  } catch { return false; }
};

// ==========================================
// 5. MEAL API CALLS
// ==========================================
export const getMeals = async (): Promise<MealData[]> => {
  try {
    const res = await fetch('/api/srm/meals');
    const json = await res.json();
    return json.success ? json.data.map(mapId) : [];
  } catch { return []; }
};

export const saveMeal = async (data: MealData): Promise<boolean> => {
  try {
    const payload = data.id ? { ...data, _id: data.id } : data;
    const method = data.id ? 'PUT' : 'POST';
    const res = await fetch('/api/srm/meals', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch { return false; }
};

export const deleteMeal = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/srm/meals?id=${id}`, { method: 'DELETE' });
    return res.ok;
  } catch { return false; }
};