
import { Car, Plane, Train, Ship , BedDouble, Utensils, Star } from 'lucide-react';

// ==========================================
// 1. SHARED INTERFACES (Routing & Global)
// ==========================================

export interface RouteCity {
  name: string;
  type: 'city' | 'airport';
  airportCode?: string;
  state?: string;
}

export interface RouteDay {
  id: number;
  day: number;
  date: string;
  nights: number;
  cities: RouteCity[];
  distance: string;
  mode: string;
  stay: string;
}

export interface RoutingData {
  startDate: string;
  endDate: string;
  routes: RouteDay[];
}

// ==========================================
// 2. ACTIVITY / STAY / TRANSPORT TYPES
// ==========================================

// --- Guide Details (Legacy / Internal Use) ---
export interface GuideDetails {
  name: string;
  language: string;
  serviceType: string;
  charges: number;
  mealAllowance: number;
  tipping: number;
  stayAllowance: number;
}



export interface Activity {
  id: number;
  type: 'activity';
  heading: string;
  description: string;
  // Timing
  slot: string; // Morning, Afternoon, etc.
  startTime?: string;
  duration: string;

  // Inclusions & Costing
  // inclusionType: 'included' | 'optional'; // New Radio Logic
  inclusionType: 'included' | 'excluded' | 'optional';
  entranceFeePP: number;
  activityFeePP: number;
  
  // Guide Logic
  guideType: 'guided' | 'self_guided';
  guideFee: number; // Logic: If guided, this amount is added

  // Logistics
  pickupLocation: string;
  pickupDate: string; // New
  pickupTime: string;
  dropoffLocation: string;
  dropoffDate: string; // New
  dropoffTime: string;

  // Defaults
  activityType: string;
  paxCount: number;
  linkedSupplierId?: string;
}




// --- UPDATED STAY INTERFACE ---
export interface Stay {
  country: string;
  city: string;
  roomName: string;
  id: number;
  type: 'stay';
  
  // Basic Info
  hotelName: string;
  description: string;
  inclusionType: 'included' | 'excluded' | 'optional';
  address?: string; // Optional but good for UI
  rating: string; // "4.5", "5"
  
  // Categorization
  category: string; // Hotel, Resort, Villa
  stayType: string; // Luxury, Deluxe, Standard
  roomCategory: string; // Superior, Suite, Standard
  
  // Inclusions
  // mealPlan: string; // Breakfast, Half Board, etc.
  
  // Dates & Time
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  nights: number;
  
  // Costing Variables (Crucial for Cost Sheet)
  costPerNight: number; // Cost per room per night
  numRooms: number;     // Number of rooms booked
  roomOccupancy?: number[];

  isGhost?: boolean;
  
  customImage?: string;

  linkedSupplierId?: string;
}




// --- UPDATED TRANSPORT INTERFACE ---
export interface Transport {

  id: number;
  type: 'transport';
  serviceType?: string;
  
  // 1. Service Config
  mode: 'vehicle' | 'flight' | 'rail' | 'ferry';
  subType: 'transfer' | 'disposal'; // New Toggle
  // serviceType: 'Planned' | 'Optional'; // Status
  inclusionType: 'included' | 'excluded' | 'optional';

  // 2. Vehicle Details
  vehicleType: string;
  vehicleCount: number; // New Multiplier

  // --- [THIS IS THE REQUIRED CHANGE] ---
  paxCount: number; // Required for Flight/Rail/Ferry costing
  // ------------------------------------

  flightNumber?: string; // Optional for Flight/Train
  // This is where "From Barcelona, journey to Montserrat..." goes.
  serviceDescription?: string;

  // 3. Logistics
  pickupLocation: string;
  pickupTime: string;
  
  // Conditional Fields
  dropoffLocation?: string; // Only for Transfer
  dropoffTime?: string;     // Only for Transfer
  duration?: string;        // Only for Disposal
  
  // 4. Costing
  price: number;

  linkedSupplierId?: string;
}



// --- 4. ADD MEAL INTERFACE ---
export interface Meal {
  id: number;
  type: 'meal';
  
  // Basic Info
  restaurantName: string;
  cuisine: string;    // Auto-filled
  rating: string;     // Auto-filled
  address: string;    // Auto-filled
  
  // Agency Planning
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'High Tea';
  menuType: 'Buffet' | 'Fixed Menu' | 'A La Carte';
  mealTime: string; // Start time

  // Costing & Inclusion
  // inclusionType: 'included' | 'optional'; // Essential for Agency
  inclusionType: 'included' | 'excluded' | 'optional';
  adultCost: number;
  childCost: number;


  
  // --- NEW FIELDS TO ADD ---
  paxAdult: number; // The Quantity (e.g. 10)
  paxChild: number; // The Quantity (e.g. 2)

  // Description / Notes
  description: string;

  // Optional Logistics
  requiresTransfer: boolean;
  pickupLocation?: string;
  dropoffLocation?: string;
  linkedSupplierId?: string;
}


export interface DayPlan {
  dayNumber: number;
  date: string;
  city: string;
  activities: Activity[];
  stays: Stay[]; 
  transports: Transport[];
  meals: Meal[];
}

// ==========================================
// 3. CONSTANTS DATA
// ==========================================



export const TIME_SLOTS = [
   
  { value: 'Morning', label: 'Morning', timeRange: '(08:00 - 11:00)' },
  { value: 'Afternoon', label: 'Afternoon', timeRange: '(13:00 - 15:00)' },
  { value: 'Evening', label: 'Evening', timeRange: '(16:00 - 18:00)' },
  { value: 'Full Day', label: 'Full Day', timeRange: '(09:00 - 17:00)' },
  { value: 'Day Excursion', label: 'Day Excursion', timeRange: '(09:00 - 22:00)' },

  
];

// --- CONSTANTS ---
export const HOTEL_CATEGORIES = ['Hotel', 'Resort', 'Villa', 'Homestay', 'Apartment'];
export const HOTEL_TYPES = ['Luxury', 'Premium', 'Deluxe', 'Standard', 'Budget'];
export const MEAL_PLANS = ['Breakfast', 'Half Board', 'Full Board', 'All Inclusive'];





export const RECOMMENDED_HOTELS: Record<string, any[]> = {
  'default': [
    { name: 'Grand Hotel', rating: 4.5, image: 'https://placehold.co/400', address: 'City Center', price: 0, type: 'Deluxe' },
  ],
  'New Delhi': [
    { name: 'The Taj Mahal Hotel', rating: 5.0, image: 'https://placehold.co/400', address: 'Man Singh Road', price: 0, type: 'Luxury' },
    { name: 'The Leela Palace', rating: 4.8, image: 'https://placehold.co/400', address: 'Chanakyapuri', price:0, type: 'Luxury' },
    { name: 'Bloomrooms', rating: 4.0, image: 'https://placehold.co/400', address: 'Janpath', price:0, type: 'Standard' },
  ],
  'Mumbai': [
     { name: 'Taj Lands End', rating: 5.0, image: 'https://placehold.co/400', address: 'Bandra', price:0, type: 'Luxury' },
     { name: 'Trident', rating: 4.5, image: 'https://placehold.co/400', address: 'Nariman Point', price:0, type: 'Premium' },
  ], 

  // Austria
  'Vienna': [
    { name: 'Hotel Sacher Wien', rating: 5.0, image: 'https://placehold.co/400', address: 'Philharmoniker Str. 4', price: 0, type: 'Luxury' },
    { name: 'Hilton Vienna Plaza', rating: 4.5, image: 'https://placehold.co/400', address: 'Schottenring 11', price: 0, type: 'Premium' },
    { name: 'Motel One Wien-Staatsoper', rating: 4.2, image: 'https://placehold.co/400', address: 'Elisabethstraße 5', price: 0, type: 'Standard' },
  ],
  'Salzburg': [
    { name: 'Hotel Goldener Hirsch', rating: 5.0, image: 'https://placehold.co/400', address: 'Getreidegasse 37', price: 0, type: 'Luxury' },
    { name: 'IMLAUER HOTEL PITTER', rating: 4.5, image: 'https://placehold.co/400', address: 'Rainerstraße 6', price: 0, type: 'Premium' },
    { name: 'Star Inn Hotel', rating: 4.0, image: 'https://placehold.co/400', address: 'Hildmannplatz 5', price: 0, type: 'Standard' },
  ],
  'Innsbruck': [
    { name: 'The Penz Hotel', rating: 4.8, image: 'https://placehold.co/400', address: 'Adolf-Pichler-Platz 3', price: 0, type: 'Luxury' },
    { name: 'AC Hotel by Marriott', rating: 4.4, image: 'https://placehold.co/400', address: 'Salurner Str. 15', price: 0, type: 'Premium' },
    { name: 'Hotel Central', rating: 4.1, image: 'https://placehold.co/400', address: 'Gilmstraße 5', price: 0, type: 'Standard' },
  ],

  // Italy

  'Rome': [
    { name: 'Hotel de Russie', rating: 5.0, image: 'https://placehold.co/400', address: 'Via del Babuino 9', price: 0, type: 'Luxury' },
    { name: 'Hotel Artemide', rating: 4.8, image: 'https://placehold.co/400', address: 'Via Nazionale 22', price: 0, type: 'Premium' },
    { name: 'iQ Hotel Roma', rating: 4.2, image: 'https://placehold.co/400', address: 'Via Firenze 8', price: 0, type: 'Standard' },
  ],
  'Venice': [
    { name: 'The Gritti Palace', rating: 5.0, image: 'https://placehold.co/400', address: 'Campo S.Maria Del Giglio', price: 0, type: 'Luxury' },
    { name: 'Hotel L\'Orologio', rating: 4.5, image: 'https://placehold.co/400', address: 'Sestiere San Polo', price: 0, type: 'Premium' },
    { name: 'Hotel Olimpia', rating: 4.0, image: 'https://placehold.co/400', address: 'Fondamenta dei Tolentini', price: 0, type: 'Standard' },
  ],
  'Florence': [
    { name: 'Four Seasons Hotel Firenze', rating: 5.0, image: 'https://placehold.co/400', address: 'Borgo Pinti 99', price: 0, type: 'Luxury' },
    { name: 'Grand Hotel Baglioni', rating: 4.6, image: 'https://placehold.co/400', address: 'Piazza dell\'Unità Italiana 6', price: 0, type: 'Premium' },
    { name: 'Hotel Pendini', rating: 4.1, image: 'https://placehold.co/400', address: 'Via degli Strozzi 2', price: 0, type: 'Standard' },
  ],
  'Milan': [
    { name: 'Armani Hotel Milano', rating: 5.0, image: 'https://placehold.co/400', address: 'Via Alessandro Manzoni 31', price: 0, type: 'Luxury' },
    { name: 'NH Collection Milano President', rating: 4.5, image: 'https://placehold.co/400', address: 'Largo Augusto 10', price: 0, type: 'Premium' },
    { name: 'Hotel Berna', rating: 4.2, image: 'https://placehold.co/400', address: 'Via Napo Torriani 18', price: 0, type: 'Standard' },
  ],
};

// --- UPDATED ATTRACTIONS DATA (With suggestedSlot) ---
export const CITY_ATTRACTIONS: Record<string, any[]> = {
  'New Delhi': [
    { name: 'Red Fort', description: 'Historic fort in the city of Delhi', price:0, type: 'monument', suggestedSlot: 'Morning' },
    { name: 'Qutub Minar', description: 'Tallest brick minaret in the world', price:0, type: 'monument', suggestedSlot: 'Afternoon' },
    { name: 'India Gate', description: 'War memorial located astride the Rajpath', price: 0, type: 'monument', suggestedSlot: 'Evening' },
    { name: 'Akshardham Temple', description: 'Grand Hindu temple complex', price: 0, type: 'attraction', suggestedSlot: 'Evening' },
    { name: 'Lotus Temple', description: 'Flower-like shape, Baháʼí House of Worship', price: 0, type: 'attraction', suggestedSlot: 'Morning' },
  ],
  'Agra': [
    { name: 'Taj Mahal', description: 'Ivory-white marble mausoleum', price:0, type: 'monument', suggestedSlot: 'Morning' },
    { name: 'Agra Fort', description: 'Historical fort in the city of Agra', price:0, type: 'monument', suggestedSlot: 'Afternoon' },
    { name: 'Mohabbat-e-Taj Show', description: 'Evening cultural theater show', price:0, type: 'attraction', suggestedSlot: 'Evening' },
  ],
  'Mumbai': [
    { name: 'Gateway of India', description: 'Arch-monument built in the 20th century', price: 0, type: 'monument', suggestedSlot: 'Morning' },
    { name: 'Marine Drive', description: '3.6-kilometre-long boulevard', price: 0, type: 'attraction', suggestedSlot: 'Evening' },
    { name: 'Elephanta Caves', description: 'UNESCO World Heritage Site', price:0, type: 'attraction', suggestedSlot: 'Afternoon' },
  ],

  // Austria 

  'Vienna': [
    { name: 'Schönbrunn Palace', description: 'Former imperial summer residence', price: 0, type: 'monument', suggestedSlot: 'Morning' },
    { name: 'St. Stephen\'s Cathedral', description: 'Mother church of the Roman Catholic Archdiocese', price: 0, type: 'monument', suggestedSlot: 'Afternoon' },
    { name: 'The Hofburg', description: 'Former principal imperial palace', price: 0, type: 'monument', suggestedSlot: 'Afternoon' },
    { name: 'Prater Park', description: 'Large public park with the Giant Ferris Wheel', price:0, type: 'attraction', suggestedSlot: 'Evening' },
  ],
  'Salzburg': [
    { name: 'Hohensalzburg Fortress', description: 'One of the largest medieval castles in Europe', price:0, type: 'monument', suggestedSlot: 'Morning' },
    { name: 'Mirabell Palace', description: 'Historic building with famous gardens', price: 0, type: 'attraction', suggestedSlot: 'Afternoon' },
    { name: 'Mozart\'s Birthplace', description: 'Museum in the house where Mozart was born', price: 0, type: 'museum', suggestedSlot: 'Evening' },
  ],
  'Innsbruck': [
    { name: 'Golden Roof (Goldenes Dachl)', description: 'Landmark structure with fire-gilded copper tiles', price:0, type: 'monument', suggestedSlot: 'Morning' },
    { name: 'Nordkette Cable Car', description: 'Gondola lift to the top of the mountain', price: 0, type: 'attraction', suggestedSlot: 'Afternoon' },
    { name: 'Ambras Castle', description: 'Renaissance castle and palace', price:0, type: 'monument', suggestedSlot: 'Morning' },
    { name: 'Swarovski Crystal Worlds', description: 'Crystal museum and art exhibition (nearby)', price:0, type: 'attraction', suggestedSlot: 'Evening' },
  ],

  //Rome : 

  'Rome': [
    { name: 'Colosseum', description: 'Ancient gladiatorial arena and amphitheater', price:0, type: 'monument', suggestedSlot: 'Morning' },
    { name: 'Vatican Museums & Sistine Chapel', description: 'World-famous art collection and Michelangelo\'s frescoes', price:0, type: 'museum', suggestedSlot: 'Morning' },
    { name: 'Trevi Fountain', description: 'Iconic Baroque fountain (tradition says toss a coin)', price: 0, type: 'attraction', suggestedSlot: 'Evening' },
    { name: 'Pantheon', description: 'Former Roman temple, now a church', price:0, type: 'monument', suggestedSlot: 'Afternoon' },
  ],
  'Venice': [
    { name: 'St. Mark\'s Basilica', description: 'The most famous church in Venice with Byzantine architecture', price: 300, type: 'monument', suggestedSlot: 'Morning' },
    { name: 'Doge\'s Palace', description: 'Gothic palace, former residence of the Doge of Venice', price: 3000, type: 'museum', suggestedSlot: 'Afternoon' },
    { name: 'Grand Canal', description: 'Main waterway of Venice, ideal for Gondola rides', price: 0, type: 'attraction', suggestedSlot: 'Evening' },
  ],
  'Florence': [
    { name: 'Uffizi Gallery', description: 'Premier art museum housing Renaissance masterpieces', price: 0, type: 'museum', suggestedSlot: 'Afternoon' },
    { name: 'Florence Cathedral (Duomo)', description: 'Iconic cathedral with Brunelleschi\'s dome', price: 0, type: 'monument', suggestedSlot: 'Morning' },
    { name: 'Ponte Vecchio', description: 'Medieval stone closed-spandrel segmental arch bridge', price: 0, type: 'attraction', suggestedSlot: 'Evening' },
  ],
  'Milan': [
    { name: 'Duomo di Milano', description: 'Massive Gothic cathedral dominating the city center', price: 0, type: 'monument', suggestedSlot: 'Morning' },
    { name: 'Galleria Vittorio Emanuele II', description: 'Italy\'s oldest active shopping gallery', price: 0, type: 'attraction', suggestedSlot: 'Afternoon' },
    { name: 'Sforzesco Castle', description: 'Medieval fortification housing several museums', price:0, type: 'museum', suggestedSlot: 'Afternoon' },
  ],
};

// Transport Constants
export const TRANSPORT_MODES = [
  { id: 'vehicle', label: 'Vehicle', icon: Car },
  { id: 'rail', label: 'Rail', icon: Train },
  { id: 'flight', label: 'Flight', icon: Plane },
  { id: 'ferry', label: 'Ferry', icon: Ship },
];



export const VEHICLE_TYPES = [
  'Sedan Car', 'SUV / Crossover', 'Hatchback', 'Convertible', 'Coupe', 
  'Mini Van', 'Van', 'Pick-up Truck', 'Wagon', 'Mini Coach', 'Coach', 'Limousine'
];

export const VEHICLE_SPECS: Record<string, { seats: number, guests: number, luggageCheck: string, luggageCarry: string }> = {
  // Standard 4-door vehicle
  'Sedan Car': { 
    seats: 5, 
    guests: 3, // 3 adults comfortable, 4 is tight
    luggageCheck: '2 (L75, W47, D30)', 
    luggageCarry: '2 (L56, W45, D10)' 
  },

  // Larger vehicle with more vertical space
  'SUV / Crossover': { 
    seats: 5, // Can range to 7, but standard SUV is 5
    guests: 4, 
    luggageCheck: '3 (L75, W47, D30)', 
    luggageCarry: '3 (L56, W45, D10)' 
  },

  // Compact car with liftgate
  'Hatchback': { 
    seats: 5, 
    guests: 3, 
    luggageCheck: '1 (L75, W47, D30)', 
    luggageCarry: '2 (L56, W45, D10)' 
  },

  // Roof down, significantly reduced trunk space
  'Convertible': { 
    seats: 4, 
    guests: 2, 
    luggageCheck: '1 (L75, W47, D30)', 
    luggageCarry: '1 (L56, W45, D10)' 
  },

  // 2-door sporty car
  'Coupe': { 
    seats: 4, 
    guests: 2, 
    luggageCheck: '1 (L75, W47, D30)', 
    luggageCarry: '1 (L56, W45, D10)' 
  },

  // Family hauler (MPV)
  'Mini Van': { 
    seats: 7, 
    guests: 6, 
    luggageCheck: '4 (L75, W47, D30)', 
    luggageCarry: '4 (L56, W45, D10)' 
  },

  // Large passenger van (e.g., Ford Transit, Mercedes Sprinter)
  'Van': { 
    seats: 12, 
    guests: 10, 
    luggageCheck: '10 (L75, W47, D30)', 
    luggageCarry: '10 (L56, W45, D10)' 
  },

  // Truck with open bed (assuming double cab for passengers)
  'Pick-up Truck': { 
    seats: 5, 
    guests: 4, 
    luggageCheck: '5 (L75, W47, D30)', // Large capacity in bed
    luggageCarry: '2 (L56, W45, D10)' 
  },

  // Estate car (Long Sedan)
  'Wagon': { 
    seats: 5, 
    guests: 4, 
    luggageCheck: '3 (L75, W47, D30)', 
    luggageCarry: '3 (L56, W45, D10)' 
  },

  // Small bus
  'Mini Coach': { 
    seats: 25, 
    guests: 20, 
    luggageCheck: '20 (L75, W47, D30)', 
    luggageCarry: '20 (L56, W45, D10)' 
  },

  // Full size bus
  'Coach': { 
    seats: 50, 
    guests: 45, 
    luggageCheck: '45 (L75, W47, D30)', 
    luggageCarry: '45 (L56, W45, D10)' 
  },

  // Stretch Limo (High passenger count, surprisingly low luggage space)
  'Limousine': { 
    seats: 8, 
    guests: 8, 
    luggageCheck: '2 (L75, W47, D30)', // Trunk does not stretch
    luggageCarry: '2 (L56, W45, D10)' 
  },

  // Fallback
  'default': { 
    seats: 4, 
    guests: 3, 
    luggageCheck: '2 Standard', 
    luggageCarry: '2 Small' 
  }
};


export const TRANSPORT_PACKAGES = ['Airport Transfer', 'Full Day Hire', 'Intercity Transfer'];
export const INDIVIDUAL_SERVICES = ['Pickup', 'Dropoff'];


export const RESTAURANT_DATA: Record<string, any[]> = {
  'New Delhi': [
    { name: 'Bukhara @ ITC Maurya', cuisine: 'North Indian, Mughlai', rating: '4.8', address: 'Diplomatic Enclave, Chanakyapuri', cost:0, type: 'Luxury' },
    { name: 'Karim\'s', cuisine: 'Mughlai', rating: '4.2', address: 'Jama Masjid, Old Delhi', cost:0, type: 'Budget' },
    { name: 'Indian Accent', cuisine: 'Modern Indian', rating: '4.9', address: 'The Lodhi, Lodhi Road', cost:0, type: 'Luxury' },
  ],
  'Mumbai': [
    { name: 'Britannia & Co.', cuisine: 'Parsi', rating: '4.4', address: 'Ballard Estate', cost:0, type: 'Heritage' },
    { name: 'Trishna', cuisine: 'Seafood', rating: '4.6', address: 'Kala Ghoda', cost:0, type: 'Premium' },
  ],
  'default': [
    { name: 'City Restaurant', cuisine: 'Multi-Cuisine', rating: '4.0', address: 'City Center', cost:0, type: 'Standard' },
  ]
};