export interface BasicDetails {
  refCode: string;
  country: string;
  tripType: string;
  numTravelers: number;
  startDate: string;
}

export interface City {
  name: string;
  nights: number;
}

export interface Cost {
  entranceFee?: number;
  guideFee?: number;
  vehicleFee?: number;
  roomCost?: number;
  mealCost?: number;
}

export interface DayItem {
  id: string;
  category: 'Activity' | 'Stay' | 'Transport' | 'Meal';
  type: string;
  name: string;
  timing?: string;
  duration?: string;
  costs: Cost;
}

export interface DayPlan {
  day: number;
  city: string;
  items: DayItem[];
}

export interface ItineraryData {
  basicDetails: BasicDetails;
  cities: City[];
  days: DayPlan[];
}

export interface CostBreakdown {
  activities: number;
  accommodation: number;
  transport: number;
  meals: number;
  totalPerPerson: number;
  totalGroup: number;
}