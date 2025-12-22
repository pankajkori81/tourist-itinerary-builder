import { ItineraryData } from '@/app/types/itinerary';
import { calculateCosts, calculateDayCost } from '@/app/lib/costCalculations';
import { DollarSign } from 'lucide-react';

interface CostingSummaryProps {
  itinerary: ItineraryData;
}

export default function CostingSummary({ itinerary }: CostingSummaryProps) {
  const costs = calculateCosts(itinerary);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Costing Summary</h2>

      {/* Cost Cards */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Activities</div>
            <div className="text-2xl font-bold text-purple-600">
              €{costs.activities.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">per person</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Accommodation</div>
            <div className="text-2xl font-bold text-blue-600">
              €{costs.accommodation.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">per person</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Transport</div>
            <div className="text-2xl font-bold text-green-600">
              €{costs.transport.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">per person</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Meals</div>
            <div className="text-2xl font-bold text-orange-600">
              €{costs.meals.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">per person</div>
          </div>
        </div>

        {/* Total Summary */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold text-gray-700">Total Per Person</span>
            <span className="text-3xl font-bold text-blue-600">
              €{costs.totalPerPerson.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-xl font-semibold text-gray-700">
              Total for Group ({itinerary.basicDetails.numTravelers} travelers)
            </span>
            <span className="text-3xl font-bold text-green-600">
              €{costs.totalGroup.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Day-wise Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Day-wise Breakdown</h3>
        {itinerary.days.map((day) => {
          const dayCost = calculateDayCost(day, itinerary.basicDetails.numTravelers);

          return (
            <div key={day.day} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-800">
                  Day {day.day} - {day.city}
                </h4>
                <span className="text-lg font-bold text-blue-600">
                  €{dayCost.toFixed(2)}
                </span>
              </div>
              <div className="space-y-1">
                {day.items.map((item) => {
                  let itemCost = 0;
                  if (item.category === 'Transport') {
                    itemCost =
                      (item.costs.vehicleFee || 0) / itinerary.basicDetails.numTravelers;
                  } else if (item.category === 'Stay') {
                    itemCost = (item.costs.roomCost || 0) / 2;
                  } else if (item.category === 'Activity') {
                    itemCost =
                      (item.costs.entranceFee || 0) + (item.costs.guideFee || 0);
                  } else {
                    itemCost = item.costs.mealCost || 0;
                  }

                  return (
                    <div
                      key={item.id}
                      className="text-sm text-gray-600 flex justify-between"
                    >
                      <span>
                        • {item.name || `${item.category} ${item.type}`}
                      </span>
                      <span className="font-medium">€{itemCost.toFixed(2)}</span>
                    </div>
                  );
                })}
                {day.items.length === 0 && (
                  <div className="text-sm text-gray-400 italic">No items for this day</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}