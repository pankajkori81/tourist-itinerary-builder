



import { DayPlan } from '@/app/dashboard/itinerary/create-day/constants/daywiseConstants';

export interface CostBreakdown {
  stays: number;
  activities: number;
  transport: number;
  meals: number;
  totalNet: number;
}

export const calculateTripCosts = (days: DayPlan[], totalTravelers: number): CostBreakdown => {
  let staysCost = 0;
  let activityCost = 0;
  let transportCost = 0;
  let mealCost = 0;

  // Track IDs to prevent double counting (e.g., if a multi-night stay appears in multiple day arrays)
  const processedStayIds = new Set<number>();
  const processedTransportIds = new Set<number>();
  const processedActivityIds = new Set<number>();
  const processedMealIds = new Set<number>();

  days.forEach((day) => {
    // 1. Calculate Stays (Check inclusionType)
    day.stays.forEach((stay) => {
      if (stay.inclusionType === 'included' && !processedStayIds.has(stay.id)) {
        const roomCost = (stay.costPerNight || 0) * (stay.numRooms || 1) * (stay.nights || 1);
        staysCost += roomCost;
        processedStayIds.add(stay.id);
      }
    });

    // 2. Calculate Activities (Check inclusionType)
    day.activities.forEach((act) => {
      if (act.inclusionType === 'included' && !processedActivityIds.has(act.id)) {
        const entrance = (act.entranceFeePP || 0) * totalTravelers;
        const activity = (act.activityFeePP || 0) * totalTravelers;
        const guide = act.guideType === 'guided' ? (act.guideFee || 0) : 0; 
        
        activityCost += (entrance + activity + guide);
        processedActivityIds.add(act.id);
      }
    });

    // 3. Calculate Transport (Check inclusionType)
    day.transports.forEach((trans) => {
      // Changed from 'serviceType' to 'inclusionType'
      if (trans.inclusionType === 'included' && !processedTransportIds.has(trans.id)) {
        transportCost += (trans.price || 0) * (trans.vehicleCount || 1);
        processedTransportIds.add(trans.id);
      }
    });

    // 4. Calculate Meals (Check inclusionType)
    day.meals?.forEach((meal) => {
      if (meal.inclusionType === 'included' && !processedMealIds.has(meal.id)) {
        mealCost += (meal.adultCost || 0) * totalTravelers; 
        processedMealIds.add(meal.id);
      }
    });
  });

  return {
    stays: staysCost,
    activities: activityCost,
    transport: transportCost,
    meals: mealCost,
    totalNet: staysCost + activityCost + transportCost + mealCost
  };
};