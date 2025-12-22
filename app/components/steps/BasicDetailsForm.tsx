import { BasicDetails } from '@/app/types/itinerary';
import { MOCK_CITIES, TRIP_TYPES } from '@/app/lib/constants';

interface BasicDetailsFormProps {
  basicDetails: BasicDetails;
  onUpdate: (details: Partial<BasicDetails>) => void;
}

export default function BasicDetailsForm({ basicDetails, onUpdate }: BasicDetailsFormProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reference Code
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="AT43-2026-1"
            value={basicDetails.refCode}
            onChange={(e) => onUpdate({ refCode: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={basicDetails.country}
            onChange={(e) => onUpdate({ country: e.target.value })}
          >
            <option value="">Select Country</option>
            {Object.keys(MOCK_CITIES).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trip Type</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={basicDetails.tripType}
            onChange={(e) => onUpdate({ tripType: e.target.value })}
          >
            {TRIP_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Travelers
          </label>
          <input
            type="number"
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={basicDetails.numTravelers}
            onChange={(e) =>
              onUpdate({ numTravelers: parseInt(e.target.value) || 1 })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={basicDetails.startDate}
            onChange={(e) => onUpdate({ startDate: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}