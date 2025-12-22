import { City } from '@/app/types/itinerary';
import { MOCK_CITIES } from '@/app/lib/constants';
import { Trash2 } from 'lucide-react';

interface CitiesFormProps {
  cities: City[];
  country: string;
  onUpdate: (cities: City[]) => void;
}

export default function CitiesForm({ cities, country, onUpdate }: CitiesFormProps) {
  const addCity = () => {
    onUpdate([...cities, { name: '', nights: 1 }]);
  };

  const updateCity = (index: number, field: keyof City, value: string | number) => {
    const newCities = [...cities];
    newCities[index] = { ...newCities[index], [field]: value };
    onUpdate(newCities);
  };

  const removeCity = (index: number) => {
    const newCities = cities.filter((_, i) => i !== index);
    onUpdate(newCities);
  };

  const totalNights = cities.reduce((sum, city) => sum + city.nights, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Cities & Duration</h2>

      {!country && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          Please select a country in the Basic Details step first.
        </div>
      )}

      {cities.map((city, index) => (
        <div key={index} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={city.name}
              onChange={(e) => updateCity(index, 'name', e.target.value)}
              disabled={!country}
            >
              <option value="">Select City</option>
              {country &&
                MOCK_CITIES[country]?.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nights</label>
            <input
              type="number"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={city.nights}
              onChange={(e) => updateCity(index, 'nights', parseInt(e.target.value) || 1)}
            />
          </div>
          <button
            onClick={() => removeCity(index)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
          >
            <Trash2 size={18} />
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={addCity}
        disabled={!country}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        + Add City
      </button>

      {cities.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-lg font-semibold text-blue-900">
            Total: {totalNights} Nights / {totalNights + 1} Days
          </p>
        </div>
      )}
    </div>
  );
}