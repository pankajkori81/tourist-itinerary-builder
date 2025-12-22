import { DayItem } from '@/app/types/itinerary';
import { TIMINGS } from '@/app/lib/constants';
import { Trash2 } from 'lucide-react';

interface DayItemProps {
  item: DayItem;
  onUpdate: (updates: Partial<DayItem>) => void;
  onRemove: () => void;
}

export default function DayItemComponent({ item, onUpdate, onRemove }: DayItemProps) {
  const updateCost = (field: string, value: string) => {
    onUpdate({
      costs: {
        ...item.costs,
        [field]: parseFloat(value) || 0
      }
    });
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
        <button onClick={onRemove} className="text-red-500 hover:text-red-700">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={item.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder={`Enter ${item.category.toLowerCase()} name`}
          />
        </div>

        {item.category === 'Activity' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timing</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={item.timing}
                onChange={(e) => onUpdate({ timing: e.target.value })}
              >
                {TIMINGS.map((timing) => (
                  <option key={timing} value={timing}>
                    {timing}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entrance Fee (per person) €
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={item.costs.entranceFee || ''}
                onChange={(e) => updateCost('entranceFee', e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guide Fee (per person) €
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={item.costs.guideFee || ''}
                onChange={(e) => updateCost('guideFee', e.target.value)}
                placeholder="0"
              />
            </div>
          </>
        )}

        {item.category === 'Transport' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Fee (total, will be divided) €
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={item.costs.vehicleFee || ''}
              onChange={(e) => updateCost('vehicleFee', e.target.value)}
              placeholder="0"
            />
          </div>
        )}

        {item.category === 'Stay' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Cost (per room/night) €
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={item.costs.roomCost || ''}
              onChange={(e) => updateCost('roomCost', e.target.value)}
              placeholder="0"
            />
          </div>
        )}

        {item.category === 'Meal' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meal Cost (per person) €
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={item.costs.mealCost || ''}
              onChange={(e) => updateCost('mealCost', e.target.value)}
              placeholder="0"
            />
          </div>
        )}
      </div>
    </div>
  );
}