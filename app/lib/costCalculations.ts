import { ItineraryData, CostBreakdown, DayPlan } from '@/app/types/itinerary';

export const calculateCosts = (itinerary: ItineraryData): CostBreakdown => {
  let activities = 0;
  let accommodation = 0;
  let transport = 0;
  let meals = 0;

  itinerary.days.forEach(day => {
    day.items.forEach(item => {
      switch (item.category) {
        case 'Activity':
          activities += (item.costs.entranceFee || 0) + (item.costs.guideFee || 0);
          break;
        case 'Transport':
          transport += (item.costs.vehicleFee || 0) / itinerary.basicDetails.numTravelers;
          break;
        case 'Stay':
          // Assuming 2 people per room (Standard Double)
          accommodation += (item.costs.roomCost || 0) / 2;
          break;
        case 'Meal':
          meals += item.costs.mealCost || 0;
          break;
      }
    });
  });

  const totalPerPerson = activities + accommodation + transport + meals;
  const totalGroup = totalPerPerson * itinerary.basicDetails.numTravelers;

  return {
    activities,
    accommodation,
    transport,
    meals,
    totalPerPerson,
    totalGroup
  };
};

export const calculateDayCost = (
  day: DayPlan,
  numTravelers: number
): number => {
  let dayCost = 0;
  
  day.items.forEach(item => {
    if (item.category === 'Activity') {
      dayCost += (item.costs.entranceFee || 0) + (item.costs.guideFee || 0);
    } else if (item.category === 'Transport') {
      dayCost += (item.costs.vehicleFee || 0) / numTravelers;
    } else if (item.category === 'Stay') {
      dayCost += (item.costs.roomCost || 0) / 2;
    } else if (item.category === 'Meal') {
      dayCost += item.costs.mealCost || 0;
    }
  });

  return dayCost;
};