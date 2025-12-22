// app/dashboard/admin/itinerary/routing/constants.ts

export const TRANSPORT_MODES = [
  { value: 'vehicle', label: '🚗 Vehicle' },
  { value: 'flight', label: '✈️ Flight' },
  { value: 'train', label: '🚂 Train' },
  { value: 'ferry', label: '⛴️ Ferry' },
];

export interface RouteCityData {
  name: string;
  type: 'city' | 'airport';
  airportCode?: string;
  state?: string;
}

// GROUPED BY COUNTRY (Important for Dynamic Filter)
export const CITIES_BY_COUNTRY: Record<string, RouteCityData[]> = {
  // "India": [
  //   { name: 'New Delhi', type: 'city' },
  //   { name: 'Delhi Airport (DEL)', type: 'airport' },
  //   { name: 'Mumbai', type: 'city' },
  //   { name: 'Mumbai Airport (BOM)', type: 'airport' },
  //   { name: 'Jaipur', type: 'city' },
  //   { name: 'Agra', type: 'city' },
  //   { name: 'Bangalore', type: 'city' },
  //   { name: 'Goa', type: 'city' },
  //   { name: 'Udaipur', type: 'city' },
  //   { name: 'Varanasi', type: 'city' },
  //   { name: 'Kochi', type: 'city' },
  // ],

  'India': [
    { name: 'New Delhi', type: 'city', state: 'Delhi' },
    { name: 'Indira Gandhi International Airport (DEL)', type: 'airport', airportCode: 'DEL', state: 'Delhi' },

    { name: 'Mumbai', type: 'city', state: 'Maharashtra' },
    { name: 'Chhatrapati Shivaji Maharaj International Airport (BOM)', type: 'airport', airportCode: 'BOM', state: 'Maharashtra' },

    { name: 'Bangalore', type: 'city', state: 'Karnataka' },
    { name: 'Kempegowda International Airport (BLR)', type: 'airport', airportCode: 'BLR', state: 'Karnataka' },

    { name: 'Agra', type: 'city', state: 'Uttar Pradesh' },
    { name: 'Agra Airport (AGR)', type: 'airport', airportCode: 'AGR', state: 'Uttar Pradesh' },


    { name: 'Jaipur', type: 'city', state: 'Rajasthan' },
    { name: 'Jaipur International Airport (JAI)', type: 'airport', airportCode: 'JAI', state: 'Rajasthan' },

    { name: 'Goa', type: 'city', state: 'Goa' },
    { name: 'Goa International Airport (GOI)', type: 'airport', airportCode: 'GOI', state: 'Goa' },

       // Chennai
    { name: 'Chennai', type: 'city', state: 'Tamil Nadu' },
    { name: 'Chennai International Airport (MAA)', type: 'airport', airportCode: 'MAA', state: 'Tamil Nadu' },
    
    // Kolkata
    { name: 'Kolkata', type: 'city', state: 'West Bengal' },
    { name: 'Netaji Subhas Chandra Bose International Airport (CCU)', type: 'airport', airportCode: 'CCU', state: 'West Bengal' },
    
    // Hyderabad
    { name: 'Hyderabad', type: 'city', state: 'Telangana' },
    { name: 'Rajiv Gandhi International Airport (HYD)', type: 'airport', airportCode: 'HYD', state: 'Telangana' },
    
    // Pune
    { name: 'Pune', type: 'city', state: 'Maharashtra' },
    { name: 'Pune Airport (PNQ)', type: 'airport', airportCode: 'PNQ', state: 'Maharashtra' },
    
    // Ahmedabad
    { name: 'Ahmedabad', type: 'city', state: 'Gujarat' },
    { name: 'Sardar Vallabhbhai Patel International Airport (AMD)', type: 'airport', airportCode: 'AMD', state: 'Gujarat' },
    
    // Kochi
    { name: 'Kochi', type: 'city', state: 'Kerala' },
    { name: 'Cochin International Airport (COK)', type: 'airport', airportCode: 'COK', state: 'Kerala' },
    
    // Lucknow
    { name: 'Lucknow', type: 'city', state: 'Uttar Pradesh' },
    { name: 'Chaudhary Charan Singh International Airport (LKO)', type: 'airport', airportCode: 'LKO', state: 'Uttar Pradesh' },
    
    // Varanasi
    { name: 'Varanasi', type: 'city', state: 'Uttar Pradesh' },
    { name: 'Lal Bahadur Shastri International Airport (VNS)', type: 'airport', airportCode: 'VNS', state: 'Uttar Pradesh' },
    
    // Udaipur
    { name: 'Udaipur', type: 'city', state: 'Rajasthan' },
    { name: 'Maharana Pratap Airport (UDR)', type: 'airport', airportCode: 'UDR', state: 'Rajasthan' },
    
    // Jodhpur
    { name: 'Jodhpur', type: 'city', state: 'Rajasthan' },
    { name: 'Jodhpur Airport (JDH)', type: 'airport', airportCode: 'JDH', state: 'Rajasthan' },
    
    // Jaisalmer
    { name: 'Jaisalmer', type: 'city', state: 'Rajasthan' },
    
    // Amritsar
    { name: 'Amritsar', type: 'city', state: 'Punjab' },
    { name: 'Sri Guru Ram Dass Jee International Airport (ATQ)', type: 'airport', airportCode: 'ATQ', state: 'Punjab' },
    
    // Mysore
    { name: 'Mysore', type: 'city', state: 'Karnataka' },
    
    // Hampi
    { name: 'Hampi', type: 'city', state: 'Karnataka' },
    
    // Rishikesh
    { name: 'Rishikesh', type: 'city', state: 'Uttarakhand' },
    { name: 'Jolly Grant Airport (DED)', type: 'airport', airportCode: 'DED', state: 'Uttarakhand' },
    
    // Shimla
    { name: 'Shimla', type: 'city', state: 'Himachal Pradesh' },
    
    // Manali
    { name: 'Manali', type: 'city', state: 'Himachal Pradesh' },
    { name: 'Kullu Manali Airport (KUU)', type: 'airport', airportCode: 'KUU', state: 'Himachal Pradesh' },
  ],
  'Austria': [
    { name: 'Vienna', type: 'city', state: 'Vienna' },
    { name: 'Vienna International Airport (VIE)', type: 'airport', airportCode: 'VIE', state: 'Vienna' },
    
    { name: 'Salzburg', type: 'city', state: 'Salzburg' },
    { name: 'Salzburg Airport (SZG)', type: 'airport', airportCode: 'SZG', state: 'Salzburg' },

    { name: 'Innsbruck', type: 'city', state: 'Tyrol' },
    { name: 'Innsbruck Airport (INN)', type: 'airport', airportCode: 'INN', state: 'Tyrol' },
  ],
  "United Arab Emirates": [
    { name: 'Dubai', type: 'city' },
    { name: 'Dubai Airport (DXB)', type: 'airport' },
    { name: 'Abu Dhabi', type: 'city' },
    { name: 'Sharjah', type: 'city' },
  ],
  "United Kingdom": [
    { name: 'London', type: 'city' },
    { name: 'Heathrow (LHR)', type: 'airport' },
    { name: 'Manchester', type: 'city' },
    { name: 'Edinburgh', type: 'city' },
  ],
  "France": [
    { name: 'Paris', type: 'city' },
    { name: 'CDG Airport', type: 'airport' },
    { name: 'Nice', type: 'city' },
    { name: 'Lyon', type: 'city' },
  ],
  'Italy': [
    // Rome (Roma)
    { name: 'Rome', type: 'city', state: 'Lazio' },
    { name: 'Leonardo da Vinci–Fiumicino Airport (FCO)', type: 'airport', airportCode: 'FCO', state: 'Lazio' },
    { name: 'Ciampino–G. B. Pastine International Airport (CIA)', type: 'airport', airportCode: 'CIA', state: 'Lazio' },

    // Milan (Milano)
    { name: 'Milan', type: 'city', state: 'Lombardy' },
    { name: 'Milan Malpensa Airport (MXP)', type: 'airport', airportCode: 'MXP', state: 'Lombardy' },
    { name: 'Milan Linate Airport (LIN)', type: 'airport', airportCode: 'LIN', state: 'Lombardy' },
    { name: 'Orio al Serio International Airport (BGY)', type: 'airport', airportCode: 'BGY', state: 'Lombardy' }, // Often serves Milan

    // Venice (Venezia)
    { name: 'Venice', type: 'city', state: 'Veneto' },
    { name: 'Venice Marco Polo Airport (VCE)', type: 'airport', airportCode: 'VCE', state: 'Veneto' },

    // Florence (Firenze)
    { name: 'Florence', type: 'city', state: 'Tuscany' },
    { name: 'Florence Airport, Peretola (FLR)', type: 'airport', airportCode: 'FLR', state: 'Tuscany' },

    // Naples (Napoli)
    { name: 'Naples', type: 'city', state: 'Campania' },
    { name: 'Naples International Airport (NAP)', type: 'airport', airportCode: 'NAP', state: 'Campania' },

    // Turin (Torino)
    { name: 'Turin', type: 'city', state: 'Piedmont' },
    { name: 'Turin Airport (TRN)', type: 'airport', airportCode: 'TRN', state: 'Piedmont' },

    // Bologna
    { name: 'Bologna', type: 'city', state: 'Emilia-Romagna' },
    { name: 'Bologna Guglielmo Marconi Airport (BLQ)', type: 'airport', airportCode: 'BLQ', state: 'Emilia-Romagna' },

    // Palermo
    { name: 'Palermo', type: 'city', state: 'Sicily' },
    { name: 'Falcone Borsellino Airport (PMO)', type: 'airport', airportCode: 'PMO', state: 'Sicily' },

    // Catania
    { name: 'Catania', type: 'city', state: 'Sicily' },
    { name: 'Catania–Fontanarossa Airport (CTA)', type: 'airport', airportCode: 'CTA', state: 'Sicily' },

    // Verona
    { name: 'Verona', type: 'city', state: 'Veneto' },
    { name: 'Verona Villafranca Airport (VRN)', type: 'airport', airportCode: 'VRN', state: 'Veneto' },

    // Genoa (Genova)
    { name: 'Genoa', type: 'city', state: 'Liguria' },
    { name: 'Genoa Cristoforo Colombo Airport (GOA)', type: 'airport', airportCode: 'GOA', state: 'Liguria' },

    // Pisa
    { name: 'Pisa', type: 'city', state: 'Tuscany' },
    { name: 'Pisa International Airport (PSA)', type: 'airport', airportCode: 'PSA', state: 'Tuscany' },

    // Bari
    { name: 'Bari', type: 'city', state: 'Apulia' },
    { name: 'Bari Karol Wojtyła Airport (BRI)', type: 'airport', airportCode: 'BRI', state: 'Apulia' },

    // Cagliari
    { name: 'Cagliari', type: 'city', state: 'Sardinia' },
    { name: 'Cagliari Elmas Airport (CAG)', type: 'airport', airportCode: 'CAG', state: 'Sardinia' },
    
    // Olbia
    { name: 'Olbia', type: 'city', state: 'Sardinia' },
    { name: 'Olbia Costa Smeralda Airport (OLB)', type: 'airport', airportCode: 'OLB', state: 'Sardinia' },

    // Lamezia Terme
    { name: 'Lamezia Terme', type: 'city', state: 'Calabria' },
    { name: 'Lamezia Terme International Airport (SUF)', type: 'airport', airportCode: 'SUF', state: 'Calabria' },

    // Trieste
    { name: 'Trieste', type: 'city', state: 'Friuli-Venezia Giulia' },
    { name: 'Trieste – Friuli Venezia Giulia Airport (TRS)', type: 'airport', airportCode: 'TRS', state: 'Friuli-Venezia Giulia' },

    // Popular Tourist Destinations (Non-Airport Specific)
    { name: 'Siena', type: 'city', state: 'Tuscany' },
    { name: 'Sorrento', type: 'city', state: 'Campania' },
    { name: 'Amalfi', type: 'city', state: 'Campania' },
    { name: 'Positano', type: 'city', state: 'Campania' },
    { name: 'Cinque Terre', type: 'city', state: 'Liguria' },
    { name: 'Como', type: 'city', state: 'Lombardy' },
    { name: 'Assisi', type: 'city', state: 'Umbria' },
  ],
  "United States of America": [
    { name: 'New York', type: 'city' },
    { name: 'JFK Airport', type: 'airport' },
    { name: 'Los Angeles', type: 'city' },
    { name: 'San Francisco', type: 'city' },
    { name: 'Las Vegas', type: 'city' },
  ],
   "Sri Lanka": [
    { name: 'Colombo', type: 'city' },
    { name: 'Kandy', type: 'city' },
    { name: 'Galle', type: 'city' },
  ],
  "Maldives": [
    { name: 'Male', type: 'city' },
    { name: 'Male Airport (MLE)', type: 'airport' },
  ]
};