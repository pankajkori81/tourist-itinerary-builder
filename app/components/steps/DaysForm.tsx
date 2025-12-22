// // import { useState, useEffect } from 'react';
// // import { DayPlan, DayItem, City } from '@/app/types/itinerary';
// // import { Activity, Hotel, Plane, UtensilsCrossed, Trash2 } from 'lucide-react';
// // import DayItemComponent from '@/app/components/steps/DaysForm';

// // interface DaysFormProps {
// //   days: DayPlan[];
// //   cities: City[];
// //   numTravelers: number;
// //   onUpdate: (days: DayPlan[]) => void;
// // }

// // export default function DaysForm({ days=[], cities=[], numTravelers, onUpdate }: DaysFormProps) {
// //   const [selectedDay, setSelectedDay] = useState(1);

// //   // Initialize days when cities change
// //   useEffect(() => {
// //     if (days.length === 0 && cities.length > 0) {
// //       const newDays: DayPlan[] = [];
// //       let dayCounter = 1;

// //       cities.forEach((city) => {
// //         for (let i = 0; i < city.nights; i++) {
// //           newDays.push({
// //             day: dayCounter++,
// //             city: city.name,
// //             items: []
// //           });
// //         }
// //       });

// //       onUpdate(newDays);
// //     }
// //   }, [cities, days.length, onUpdate]);

// //   const addItem = (category: DayItem['category']) => {
// //     const newItem: DayItem = {
// //       id: Date.now().toString(),
// //       category,
// //       type:
// //         category === 'Activity'
// //           ? 'Tour'
// //           : category === 'Stay'
// //           ? 'Hotel'
// //           : category === 'Transport'
// //           ? 'Transfer'
// //           : 'Breakfast',
// //       name: '',
// //       timing: category === 'Activity' ? 'Morning' : undefined,
// //       duration: category === 'Activity' ? '2h' : undefined,
// //       costs: {}
// //     };

// //     const newDays = [...days];
// //     const dayIndex = newDays.findIndex((d) => d.day === selectedDay);
// //     if (dayIndex !== -1) {
// //       newDays[dayIndex].items.push(newItem);
// //       onUpdate(newDays);
// //     }
// //   };

// //   const updateItem = (itemId: string, updates: Partial<DayItem>) => {
// //     const newDays = [...days];
// //     const dayIndex = newDays.findIndex((d) => d.day === selectedDay);
// //     if (dayIndex !== -1) {
// //       const itemIndex = newDays[dayIndex].items.findIndex((item) => item.id === itemId);
// //       if (itemIndex !== -1) {
// //         newDays[dayIndex].items[itemIndex] = {
// //           ...newDays[dayIndex].items[itemIndex],
// //           ...updates
// //         };
// //         onUpdate(newDays);
// //       }
// //     }
// //   };

// //   const removeItem = (itemId: string) => {
// //     const newDays = [...days];
// //     const dayIndex = newDays.findIndex((d) => d.day === selectedDay);
// //     if (dayIndex !== -1) {
// //       newDays[dayIndex].items = newDays[dayIndex].items.filter(
// //         (item) => item.id !== itemId
// //       );
// //       onUpdate(newDays);
// //     }
// //   };

// //   const currentDay = days.find((d) => d.day === selectedDay);

// //   if (cities.length === 0) {
// //     return (
// //       <div className="space-y-6">
// //         <h2 className="text-2xl font-bold text-gray-800 mb-6">Day-wise Planning</h2>
// //         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
// //           Please add cities in the previous step first.
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <h2 className="text-2xl font-bold text-gray-800 mb-6">Day-wise Planning</h2>

// //       {/* Day Selector */}
// //       <div className="flex gap-2 overflow-x-auto pb-2">
// //         {days.map((day) => (
// //           <button
// //             key={day.day}
// //             onClick={() => setSelectedDay(day.day)}
// //             className={`px-4 py-2 rounded-lg whitespace-nowrap ${
// //               selectedDay === day.day
// //                 ? 'bg-blue-600 text-white'
// //                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
// //             }`}
// //           >
// //             Day {day.day} - {day.city}
// //           </button>
// //         ))}
// //       </div>

// //       {/* Add Item Buttons */}
// //       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
// //         <button
// //           onClick={() => addItem('Activity')}
// //           className="p-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center justify-center gap-2"
// //         >
// //           <Activity size={20} />
// //           Add Activity
// //         </button>
// //         <button
// //           onClick={() => addItem('Stay')}
// //           className="p-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-2"
// //         >
// //           <Hotel size={20} />
// //           Add Stay
// //         </button>
// //         <button
// //           onClick={() => addItem('Transport')}
// //           className="p-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center justify-center gap-2"
// //         >
// //           <Plane size={20} />
// //           Add Transport
// //         </button>
// //         <button
// //           onClick={() => addItem('Meal')}
// //           className="p-4 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 flex items-center justify-center gap-2"
// //         >
// //           <UtensilsCrossed size={20} />
// //           Add Meal
// //         </button>
// //       </div>

// //       {/* Items List */}
// //       <div className="space-y-4">
// //         {currentDay?.items.map((item) => (
// //           <DayItemComponent
// //             key={item.id}
// //             item={item}
// //             onUpdate={(updates) => updateItem(item.id, updates)}
// //             onRemove={() => removeItem(item.id)}
// //           />
// //         ))}

// //         {currentDay?.items.length === 0 && (
// //           <div className="text-center py-12 text-gray-500">
// //             No items added for this day. Click the buttons above to add activities, stays,
// //             transport, or meals.
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }




















// import { useState, useEffect } from 'react';
// import { Activity, Hotel, Plane, UtensilsCrossed, Trash2 } from 'lucide-react';

// // Mocked types for compilation since the original file is not available
// interface City {
//   name: string;
//   nights: number;
// }
// interface DayItem {
//   id: string;
//   category: 'Activity' | 'Stay' | 'Transport' | 'Meal';
//   type: string;
//   name: string;
//   timing?: 'Morning' | 'Afternoon' | 'Evening';
//   duration?: string;
//   costs: Record<string, number>;
// }
// interface DayPlan {
//   day: number;
//   city: string;
//   items: DayItem[];
// }

// // Mocked DayItemComponent for demonstration purposes
// function DayItemComponent({ item, onUpdate, onRemove }: { 
//     item: DayItem, 
//     onUpdate: (updates: Partial<DayItem>) => void, 
//     onRemove: () => void 
// }) {
//     // This is a minimal mock to allow the main component to run
//     return (
//         <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
//             <span className="font-medium">{item.category}: {item.name || 'New Item'}</span>
//             <button 
//                 onClick={onRemove} 
//                 className="text-red-500 hover:text-red-700 p-1 rounded-full bg-red-50"
//             >
//                 <Trash2 size={16} />
//             </button>
//         </div>
//     );
// }
// // END Mocked DayItemComponent

// interface DaysFormProps {
//   days: DayPlan[];
//   cities: City[];
//   numTravelers: number;
//   onUpdate: (days: DayPlan[]) => void;
// }

// // **FIX APPLIED HERE:** Setting default values for array props 'days' and 'cities'
// export default function DaysForm({ 
//   days = [], 
//   cities = [], 
//   numTravelers, 
//   onUpdate 
// }: DaysFormProps) {
//   const [selectedDay, setSelectedDay] = useState(1);

//   // Initialize days when cities change
//   useEffect(() => {
//     // This check is now safe because 'days' is guaranteed to be an array (or [])
//     if (days.length === 0 && cities.length > 0) {
//       const newDays: DayPlan[] = [];
//       let dayCounter = 1;

//       cities.forEach((city) => {
//         for (let i = 0; i < city.nights; i++) {
//           newDays.push({
//             day: dayCounter++,
//             city: city.name,
//             items: []
//           });
//         }
//       });

//       onUpdate(newDays);
//     }
//     // Dependency array is also now safe: days.length will be 0, not undefined.
//   }, [cities, days.length, onUpdate]);

//   const addItem = (category: DayItem['category']) => {
//     const newItem: DayItem = {
//       id: Date.now().toString(),
//       category,
//       type:
//         category === 'Activity'
//           ? 'Tour'
//           : category === 'Stay'
//           ? 'Hotel'
//           : category === 'Transport'
//           ? 'Transfer'
//           : 'Breakfast',
//       name: '',
//       timing: category === 'Activity' ? 'Morning' : undefined,
//       duration: category === 'Activity' ? '2h' : undefined,
//       costs: {}
//     };

//     const newDays = [...days];
//     const dayIndex = newDays.findIndex((d) => d.day === selectedDay);
//     if (dayIndex !== -1) {
//       newDays[dayIndex].items.push(newItem);
//       onUpdate(newDays);
//     }
//   };

//   const updateItem = (itemId: string, updates: Partial<DayItem>) => {
//     const newDays = [...days];
//     const dayIndex = newDays.findIndex((d) => d.day === selectedDay);
//     if (dayIndex !== -1) {
//       const itemIndex = newDays[dayIndex].items.findIndex((item) => item.id === itemId);
//       if (itemIndex !== -1) {
//         newDays[dayIndex].items[itemIndex] = {
//           ...newDays[dayIndex].items[itemIndex],
//           ...updates
//         };
//         onUpdate(newDays);
//       }
//     }
//   };

//   const removeItem = (itemId: string) => {
//     const newDays = [...days];
//     const dayIndex = newDays.findIndex((d) => d.day === selectedDay);
//     if (dayIndex !== -1) {
//       newDays[dayIndex].items = newDays[dayIndex].items.filter(
//         (item) => item.id !== itemId
//       );
//       onUpdate(newDays);
//     }
//   };

//   const currentDay = days.find((d) => d.day === selectedDay);

//   // **Line 90 is now safe** because 'cities' is guaranteed to be an array (or [])
//   if (cities.length === 0) {
//     return (
//       <div className="space-y-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Day-wise Planning</h2>
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
//           Please add cities in the previous step first.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 p-4 md:p-8 bg-gray-50 min-h-screen">
//       <h2 className="text-3xl font-extrabold text-blue-800 mb-6 border-b pb-2">Day-wise Planning</h2>

//       {/* Day Selector */}
//       <div className="flex gap-2 overflow-x-auto pb-4 border-b border-gray-200">
//         {days.map((day) => (
//           <button
//             key={day.day}
//             onClick={() => setSelectedDay(day.day)}
//             className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 shadow-md ${
//               selectedDay === day.day
//                 ? 'bg-blue-600 text-white font-semibold transform scale-105'
//                 : 'bg-white text-gray-700 hover:bg-blue-100 hover:text-blue-700'
//             }`}
//           >
//             Day {day.day} <span className="text-sm font-light"> - {day.city}</span>
//           </button>
//         ))}
//       </div>

//       <h3 className="text-xl font-bold text-gray-700 mt-6 mb-3">Add Items to Day {selectedDay}</h3>
//       {/* Add Item Buttons */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <button
//           onClick={() => addItem('Activity')}
//           className="p-4 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 flex flex-col items-center justify-center gap-1 shadow-lg transition-transform hover:scale-[1.02] active:scale-100"
//         >
//           <Activity size={24} />
//           <span className="text-sm font-medium">Activity</span>
//         </button>
//         <button
//           onClick={() => addItem('Stay')}
//           className="p-4 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 flex flex-col items-center justify-center gap-1 shadow-lg transition-transform hover:scale-[1.02] active:scale-100"
//         >
//           <Hotel size={24} />
//           <span className="text-sm font-medium">Stay</span>
//         </button>
//         <button
//           onClick={() => addItem('Transport')}
//           className="p-4 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 flex flex-col items-center justify-center gap-1 shadow-lg transition-transform hover:scale-[1.02] active:scale-100"
//         >
//           <Plane size={24} />
//           <span className="text-sm font-medium">Transport</span>
//         </button>
//         <button
//           onClick={() => addItem('Meal')}
//           className="p-4 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 flex flex-col items-center justify-center gap-1 shadow-lg transition-transform hover:scale-[1.02] active:scale-100"
//         >
//           <UtensilsCrossed size={24} />
//           <span className="text-sm font-medium">Meal</span>
//         </button>
//       </div>

//       <h3 className="text-xl font-bold text-gray-700 mt-8 mb-3">Itinerary for Day {selectedDay}</h3>
      
//       {/* Items List */}
//       <div className="space-y-4">
//         {currentDay?.items.map((item) => (
//           <DayItemComponent
//             key={item.id}
//             item={item}
//             onUpdate={(updates) => updateItem(item.id, updates)}
//             onRemove={() => removeItem(item.id)}
//           />
//         ))}

//         {currentDay?.items.length === 0 && (
//           <div className="text-center py-12 text-gray-500 border border-dashed rounded-xl p-4 bg-white shadow-inner">
//             <p className="mb-2">No items planned for Day {selectedDay} in {currentDay?.city}.</p>
//             <p className="text-sm">Use the buttons above to start building the day's itinerary.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




import { useState, useEffect } from 'react';
import { Activity, Hotel, Plane, UtensilsCrossed, Trash2, DollarSign } from 'lucide-react';
// Removed: import DayItemComponent from './DayItemComponent'; 
// Mocked types for compilation since the original file is not available
interface City {
  name: string;
  nights: number;
}
interface DayItem {
  id: string;
  category: 'Activity' | 'Stay' | 'Transport' | 'Meal';
  type: string;
  name: string;
  timing?: 'Morning' | 'Afternoon' | 'Evening' | 'Full Day'; // Updated type based on TIMINGS
  duration?: string;
  costs: Record<string, number>; // Ensure this matches the Cost type keys
}
interface DayPlan {
  day: number;
  city: string;
  items: DayItem[];
}

// Define TIMINGS locally to resolve potential compilation issues with external imports
const TIMINGS = ['Morning', 'Afternoon', 'Evening', 'Full Day']; 

interface DayItemComponentProps {
  item: DayItem;
  numTravelers: number; // Used for displaying the total calculated cost
  onUpdate: (updates: Partial<DayItem>) => void;
  onRemove: () => void;
}

// **DayItemComponent Definition (Integrated to resolve import error)**
function DayItemComponent({ item, numTravelers, onUpdate, onRemove }: DayItemComponentProps) {
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
          {item.category}: {item.name || 'New Item'}
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
// **End DayItemComponent Definition**


interface DaysFormProps {
  days: DayPlan[];
  cities: City[];
  numTravelers: number;
  onUpdate: (days: DayPlan[]) => void;
}

export default function DaysForm({ 
  days = [], 
  cities = [], 
  numTravelers, 
  onUpdate 
}: DaysFormProps) {
  const [selectedDay, setSelectedDay] = useState(1);

  // Initialize days when cities change
  useEffect(() => {
    // Only run if the day list is empty and cities are available
    if (days.length === 0 && cities.length > 0) {
      const newDays: DayPlan[] = [];
      let dayCounter = 1;

      cities.forEach((city) => {
        for (let i = 0; i < city.nights; i++) {
          newDays.push({
            day: dayCounter++,
            city: city.name,
            items: []
          });
        }
      });

      onUpdate(newDays);
      // Automatically select the first day if the list was just created
      setSelectedDay(1); 
    } else if (days.length > 0) {
        // Ensure selectedDay is valid if days exist
        const currentDayIndex = days.findIndex(d => d.day === selectedDay);
        if (currentDayIndex === -1 && days.length > 0) {
             setSelectedDay(days[0].day);
        }
    }
  }, [cities, days.length, onUpdate]);

  // Determine initial cost key for the new item based on category
  const getInitialCostKey = (category: DayItem['category']): Record<string, number> => {
      switch (category) {
          case 'Activity': return { entranceFee: 0, guideFee: 0 };
          case 'Stay': return { roomCost: 0 };
          case 'Transport': return { vehicleFee: 0 };
          case 'Meal': return { mealCost: 0 };
          default: return {};
      }
  };

  const addItem = (category: DayItem['category']) => {
    const newItem: DayItem = {
      id: Date.now().toString(),
      category,
      type:
        category === 'Activity'
          ? 'Tour'
          : category === 'Stay'
          ? 'Hotel'
          : category === 'Transport'
          ? 'Transfer'
          : 'Breakfast',
      name: '',
      timing: category === 'Activity' ? 'Morning' : undefined,
      duration: category === 'Activity' ? '2h' : undefined,
      costs: getInitialCostKey(category) // Initialize with relevant cost fields
    };

    const newDays = [...days];
    const dayIndex = newDays.findIndex((d) => d.day === selectedDay);
    if (dayIndex !== -1) {
      newDays[dayIndex].items.push(newItem);
      onUpdate(newDays);
    }
  };

  const updateItem = (itemId: string, updates: Partial<DayItem>) => {
    const newDays = [...days];
    const dayIndex = newDays.findIndex((d) => d.day === selectedDay);
    if (dayIndex !== -1) {
      const itemIndex = newDays[dayIndex].items.findIndex((item) => item.id === itemId);
      if (itemIndex !== -1) {
        newDays[dayIndex].items[itemIndex] = {
          ...newDays[dayIndex].items[itemIndex],
          ...updates
        };
        onUpdate(newDays);
      }
    }
  };

  const removeItem = (itemId: string) => {
    const newDays = [...days];
    const dayIndex = newDays.findIndex((d) => d.day === selectedDay);
    if (dayIndex !== -1) {
      newDays[dayIndex].items = newDays[dayIndex].items.filter(
        (item) => item.id !== itemId
      );
      onUpdate(newDays);
    }
  };

  const currentDay = days.find((d) => d.day === selectedDay);

  if (cities.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Day-wise Planning</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          Please add cities in the previous step first.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold text-blue-800 mb-6 border-b pb-2">Day-wise Planning</h2>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-4 border-b border-gray-200">
        {days.map((day) => (
          <button
            key={day.day}
            onClick={() => setSelectedDay(day.day)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 shadow-md ${
              selectedDay === day.day
                ? 'bg-blue-600 text-white font-semibold transform scale-105'
                : 'bg-white text-gray-700 hover:bg-blue-100 hover:text-blue-700'
            }`}
          >
            Day {day.day} <span className="text-sm font-light"> - {day.city}</span>
          </button>
        ))}
      </div>

      <h3 className="text-xl font-bold text-gray-700 mt-6 mb-3">
        Plan for Day {selectedDay} in {currentDay?.city}
      </h3>
      {/* Add Item Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => addItem('Activity')}
          className="p-4 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 flex flex-col items-center justify-center gap-1 shadow-lg transition-transform hover:scale-[1.02] active:scale-100"
        >
          <Activity size={24} />
          <span className="text-sm font-medium">Activity</span>
        </button>
        <button
          onClick={() => addItem('Stay')}
          className="p-4 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 flex flex-col items-center justify-center gap-1 shadow-lg transition-transform hover:scale-[1.02] active:scale-100"
        >
          <Hotel size={24} />
          <span className="text-sm font-medium">Stay</span>
        </button>
        <button
          onClick={() => addItem('Transport')}
          className="p-4 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 flex flex-col items-center justify-center gap-1 shadow-lg transition-transform hover:scale-[1.02] active:scale-100"
        >
          <Plane size={24} />
          <span className="text-sm font-medium">Transport</span>
        </button>
        <button
          onClick={() => addItem('Meal')}
          className="p-4 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 flex flex-col items-center justify-center gap-1 shadow-lg transition-transform hover:scale-[1.02] active:scale-100"
        >
          <UtensilsCrossed size={24} />
          <span className="text-sm font-medium">Meal</span>
        </button>
      </div>

      <h3 className="text-xl font-bold text-gray-700 mt-8 mb-3">Itinerary Items ({currentDay?.items.length})</h3>
      
      {/* Items List */}
      <div className="space-y-4">
        {currentDay?.items.map((item) => (
          <DayItemComponent
            key={item.id}
            item={item}
            numTravelers={numTravelers}
            onUpdate={(updates) => updateItem(item.id, updates)}
            onRemove={() => removeItem(item.id)}
          />
        ))}

        {currentDay?.items.length === 0 && (
          <div className="text-center py-12 text-gray-500 border border-dashed rounded-xl p-4 bg-white shadow-inner">
            <p className="mb-2">No items planned for Day {selectedDay}.</p>
            <p className="text-sm">Use the buttons above to start building the day's itinerary.</p>
          </div>
        )}
      </div>
    </div>
  );
}