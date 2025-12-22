import { DayItem } from '@/app/types/itinerary';
// Removed: import { TIMINGS } from '@/app/lib/constants';
import { Trash2, DollarSign } from 'lucide-react';

// Define TIMINGS locally to resolve the compilation error
const TIMINGS = ['Morning', 'Afternoon', 'Evening', 'Full Day']; 

interface DayItemComponentProps {
  item: DayItem;
  numTravelers: number; // Used for displaying the total calculated cost
  onUpdate: (updates: Partial<DayItem>) => void;
  onRemove: () => void;
}

export default function DayItemComponent({ item, numTravelers, onUpdate, onRemove }: DayItemComponentProps) {
  const updateCost = (field: keyof DayItem['costs'], value: string) => {
    onUpdate({
      costs: {
        ...item.costs,
        [field]: parseFloat(value) || 0
      }
    });
  };

  // Helper function to render a cost input field
  const CostInput = ({ label, field, placeholder, isTotalCost = false }: { 
    label: string, 
    field: keyof DayItem['costs'], 
    placeholder: string, 
    isTotalCost?: boolean 
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} €
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <DollarSign size={16} />
        </span>
        <input
          type="number"
          min="0"
          step="0.01"
          className={`w-full px-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-150 ${
            isTotalCost ? 'border-green-400 bg-green-50' : 'border-gray-300'
          }`}
          value={item.costs[field] || ''}
          onChange={(e) => updateCost(field, e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {isTotalCost && (
        <p className="text-xs text-green-700 mt-1">
          (Cost is for the entire item/room, not per person)
        </p>
      )}
    </div>
  );

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4 border-b pb-3">
        <span
          className={`px-3 py-1 rounded-full text-sm font-bold ${
            item.category === 'Activity'
              ? 'bg-purple-100 text-purple-700'
              : item.category === 'Stay'
              ? 'bg-blue-100 text-blue-700'
              : item.category === 'Transport'
              ? 'bg-green-100 text-green-700'
              : 'bg-orange-100 text-orange-700'
          }`}
        >
          {item.category}
        </span>
        <button 
          onClick={onRemove} 
          className="text-red-500 hover:text-red-700 p-1 rounded-full bg-red-50 transition duration-150"
          aria-label="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Input - Always present */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name / Description</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={item.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder={`Enter ${item.category.toLowerCase()} name (e.g., Belvedere Palace)`}
          />
        </div>

        {/* Activity Details */}
        {item.category === 'Activity' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timing</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                value={item.timing || ''}
                onChange={(e) => onUpdate({ timing: e.target.value })}
              >
                <option value="">Select Timing</option>
                {TIMINGS.map((timing) => (
                  <option key={timing} value={timing}>
                    {timing}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={item.duration || ''}
                onChange={(e) => onUpdate({ duration: e.target.value })}
                placeholder="e.g., 2 hours"
              />
            </div>

            <CostInput
              label="Entrance Fee (per person)"
              field="entranceFee"
              placeholder="0.00"
            />
            <CostInput
              label="Guide Fee (per person)"
              field="guideFee"
              placeholder="0.00"
            />
          </>
        )}

        {/* Transport Details */}
        {item.category === 'Transport' && (
          <>
            <CostInput
              label="Vehicle Fee (TOTAL COST, e.g., Taxi)"
              field="vehicleFee"
              placeholder="0.00"
              isTotalCost={true}
            />
             <div className="text-sm text-gray-600 p-2 border-l-4 border-gray-300 bg-gray-50 rounded-r-lg">
                This cost will be automatically divided among the {numTravelers} travelers.
            </div>
          </>
        )}

        {/* Stay Details */}
        {item.category === 'Stay' && (
          <>
            <CostInput
              label="Room Cost (per room/night)"
              field="roomCost"
              placeholder="0.00"
              isTotalCost={true}
            />
             <div className="text-sm text-gray-600 p-2 border-l-4 border-gray-300 bg-gray-50 rounded-r-lg">
                This cost assumes 2 travelers per room and will be divided accordingly in the costing summary.
            </div>
          </>
        )}

        {/* Meal Details */}
        {item.category === 'Meal' && (
          <CostInput
            label="Meal Cost (per person)"
            field="mealCost"
            placeholder="0.00"
          />
        )}
      </div>
    </div>
  );
}