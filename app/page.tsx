// // import Image from "next/image";

// // export default function Home() {
// //   return (
// //     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
// //       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
// //         <Image
// //           className="dark:invert"
// //           src="/next.svg"
// //           alt="Next.js logo"
// //           width={100}
// //           height={20}
// //           priority
// //         />
// //         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
// //           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
// //             To get started, edit the page.tsx file.
// //           </h1>
// //           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
// //             Looking for a starting point or more instructions? Head over to{" "}
// //             <a
// //               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //               className="font-medium text-zinc-950 dark:text-zinc-50"
// //             >
// //               Templates
// //             </a>{" "}
// //             or the{" "}
// //             <a
// //               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //               className="font-medium text-zinc-950 dark:text-zinc-50"
// //             >
// //               Learning
// //             </a>{" "}
// //             center.
// //           </p>
// //         </div>
// //         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
// //           <a
// //             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
// //             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //           >
// //             <Image
// //               className="dark:invert"
// //               src="/vercel.svg"
// //               alt="Vercel logomark"
// //               width={16}
// //               height={16}
// //             />
// //             Deploy Now
// //           </a>
// //           <a
// //             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
// //             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //           >
// //             Documentation
// //           </a>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }



// 'use client';

// import { useState } from 'react';
// import { useItinerary } from '@/app/hooks/useItinerary';
// import ProgressBar from '@/app/components/shared/ProgressBar';
// import NavigationButtons from '@/app/components/shared/NavigationButtons';
// import BasicDetailsForm from '@/app/components/steps/BasicDetailsForm';
// import CitiesForm from '@/app/components/steps/CitiesForm';
// import DaysForm from '@/app/components/steps/DaysForm';
// import CostingSummary from '@/app/components/steps/CostingSummary';

// export default function Home() {
//   const [step, setStep] = useState(1);
//   const { itinerary, updateBasicDetails, updateCities, updateDays, resetItinerary } = useItinerary();

//   const steps = ['Basic Details', 'Cities', 'Day Planning', 'Costing'];

//   const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
//   const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

//   const handleReset = () => {
//     if (confirm('Are you sure you want to reset? All data will be lost.')) {
//       resetItinerary();
//       setStep(1);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             Tourism Itinerary Builder
//           </h1>
//           <p className="text-gray-600">
//             Create custom travel itineraries with automatic cost calculations
//           </p>
//         </div>

//         {/* Progress Bar */}
//         <ProgressBar currentStep={step} totalSteps={4} steps={steps} />

//         {/* Main Content */}
//         <div className="bg-white rounded-xl shadow-lg p-6 my-6 min-h-[500px]">
//           {step === 1 && (
//             <BasicDetailsForm
//               basicDetails={itinerary.basicDetails}
//               onUpdate={updateBasicDetails}
//             />
//           )}
//           {step === 2 && (
//             <CitiesForm
//               cities={itinerary.cities}
//               country={itinerary.basicDetails.country}
//               onUpdate={updateCities}
//             />
//           )}
//           {step === 3 && (
//             <DaysForm
//               days={itinerary.days}
//               cities={itinerary.cities}
//               numTravelers={itinerary.basicDetails.numTravelers}
//               onUpdate={updateDays}
//             />
//           )}
//           {step === 4 && <CostingSummary itinerary={itinerary} />}
//         </div>

//         {/* Navigation */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <NavigationButtons
//             currentStep={step}
//             totalSteps={4}
//             onNext={nextStep}
//             onPrev={prevStep}
//             onReset={handleReset}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
















































"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Save, 
  Map, 
  Calendar, 
  DollarSign, 
  Users, 
  Hotel, 
  Car, 
  Utensils, 
  Activity, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Printer, 
  FileText 
} from 'lucide-react';

// --- Types ---

interface BasicDetails {
  tripId: string;
  tripName: string;
  country: string;
  travelers: number;
  startDate: string;
}

interface CityStop {
  id: string;
  cityName: string;
  nights: number;
}

interface ActivityItem {
  id: string;
  name: string;
  description: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Full Day';
  entranceFee: number; // Per Person
  guideCharge: number; // Per Person (or split, prompt implies PP usually, but we'll make it selectable or strict PP per prompt)
  activityFee: number; // Per Person
}

interface StayItem {
  id: string;
  hotelName: string;
  rating: string;
  costPerNight: number; // Total Room Cost
  roomCount: number;
}

interface TransportItem {
  id: string;
  vehicleType: string;
  vehicleCost: number; // Total Fixed Cost
}

interface MealItem {
  id: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  costPerPerson: number;
}

interface DayPlan {
  dayNumber: number;
  date?: string; // Calculated based on start date
  activities: ActivityItem[];
  stays: StayItem[];
  transports: TransportItem[];
  meals: MealItem[];
}

interface ItineraryData {
  basic: BasicDetails;
  cities: CityStop[];
  days: DayPlan[];
}

const INITIAL_DATA: ItineraryData = {
  basic: {
    tripId: `TRIP-${new Date().getFullYear()}-001`,
    tripName: '',
    country: '',
    travelers: 2,
    startDate: new Date().toISOString().split('T')[0],
  },
  cities: [],
  days: [],
};

// --- Main Component ---

export default function ItineraryBuilder() {
  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<ItineraryData>(INITIAL_DATA);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'activity' | 'stay' | 'transport' | 'meal'>('activity');
  const [showPrintView, setShowPrintView] = useState(false);

  // --- Persistence ---

  useEffect(() => {
    const saved = localStorage.getItem('tourism_itinerary_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('tourism_itinerary_data', JSON.stringify(data));
    alert("Trip data saved successfully to local storage!");
  };

  // --- Calculations ---

  const totalNights = useMemo(() => data.cities.reduce((acc, city) => acc + city.nights, 0), [data.cities]);
  const totalDays = totalNights + 1;

  // Ensure day objects exist for the calculated duration
  useEffect(() => {
    setData(prev => {
      const currentDayCount = prev.days.length;
      if (currentDayCount === totalDays) return prev;

      const newDays = [...prev.days];
      if (currentDayCount < totalDays) {
        // Add needed days
        for (let i = currentDayCount; i < totalDays; i++) {
          newDays.push({
            dayNumber: i + 1,
            activities: [],
            stays: [],
            transports: [],
            meals: []
          });
        }
      } else {
        // Truncate (optional, usually safer to keep data, but for this logic we resize)
        newDays.length = totalDays;
      }
      return { ...prev, days: newDays };
    });
  }, [totalDays]);

  const calculateDayDate = (dayIndex: number) => {
    const date = new Date(data.basic.startDate);
    date.setDate(date.getDate() + dayIndex);
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // --- Logic Handlers ---

  const updateBasic = (field: keyof BasicDetails, value: any) => {
    setData(prev => ({ ...prev, basic: { ...prev.basic, [field]: value } }));
  };

  const addCity = () => {
    setData(prev => ({
      ...prev,
      cities: [...prev.cities, { id: crypto.randomUUID(), cityName: '', nights: 1 }]
    }));
  };

  const updateCity = (id: string, field: keyof CityStop, value: any) => {
    setData(prev => ({
      ...prev,
      cities: prev.cities.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const removeCity = (id: string) => {
    setData(prev => ({
      ...prev,
      cities: prev.cities.filter(c => c.id !== id)
    }));
  };

  // Generic adder for day items
  const addItemToDay = (dayIndex: number, type: 'activities' | 'stays' | 'transports' | 'meals', item: any) => {
    setData(prev => {
      const newDays = [...prev.days];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        [type]: [...newDays[dayIndex][type], { ...item, id: crypto.randomUUID() }]
      };
      return { ...prev, days: newDays };
    });
  };

  const removeItemFromDay = (dayIndex: number, type: 'activities' | 'stays' | 'transports' | 'meals', itemId: string) => {
    setData(prev => {
      const newDays = [...prev.days];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        [type]: newDays[dayIndex][type].filter((x: any) => x.id !== itemId)
      };
      return { ...prev, days: newDays };
    });
  };

  // --- Costing Logic ---

  const calculateCosts = () => {
    let totalActivityCost = 0;
    let totalStayCost = 0;
    let totalTransportCost = 0;
    let totalMealCost = 0;

    data.days.forEach(day => {
      // Activities: (Entrance + Guide + Fee) * Travelers
      day.activities.forEach(a => {
        totalActivityCost += (Number(a.entranceFee) + Number(a.guideCharge) + Number(a.activityFee)) * data.basic.travelers;
      });
      // Stays: (Cost Per Night * Rooms)
      day.stays.forEach(s => {
        totalStayCost += (Number(s.costPerNight) * Number(s.roomCount));
      });
      // Transport: Fixed Cost
      day.transports.forEach(t => {
        totalTransportCost += Number(t.vehicleCost);
      });
      // Meals: Cost Per Person * Travelers
      day.meals.forEach(m => {
        totalMealCost += Number(m.costPerPerson) * data.basic.travelers;
      });
    });

    const grandTotal = totalActivityCost + totalStayCost + totalTransportCost + totalMealCost;
    const perPerson = grandTotal / (data.basic.travelers || 1);

    return { totalActivityCost, totalStayCost, totalTransportCost, totalMealCost, grandTotal, perPerson };
  };

  const costs = calculateCosts();

  // --- Views ---

  if (showPrintView) {
    return (
      <div className="bg-white min-h-screen p-8 text-black font-sans">
        <div className="max-w-4xl mx-auto border border-gray-300 p-8 shadow-none print:border-none">
          <div className="flex justify-between items-start mb-8 border-b pb-4">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-wide text-blue-900">{data.basic.tripName || 'Untitled Trip'}</h1>
              <p className="text-gray-600 mt-2">Trip ID: {data.basic.tripId}</p>
              <p className="text-gray-600">Destination: {data.basic.country}</p>
            </div>
            <div className="text-right">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded font-bold text-xl">
                {data.basic.travelers} Travelers
              </div>
              <p className="mt-2 text-gray-500">{data.basic.startDate} ({totalDays} Days)</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold border-b border-gray-300 mb-4 pb-2 text-blue-800">Route Summary</h2>
            <div className="flex flex-wrap gap-2">
              {data.cities.map((city, idx) => (
                <span key={city.id} className="flex items-center text-gray-700">
                  <span className="font-semibold">{city.cityName}</span>
                  <span className="ml-1 text-sm bg-gray-100 px-2 rounded">({city.nights} nights)</span>
                  {idx < data.cities.length - 1 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold border-b border-gray-300 mb-4 pb-2 text-blue-800">Detailed Itinerary</h2>
            {data.days.map((day) => (
              <div key={day.dayNumber} className="mb-6 break-inside-avoid">
                <h3 className="font-bold text-lg bg-gray-50 p-2 border-l-4 border-blue-500 flex justify-between">
                  <span>Day {day.dayNumber}</span>
                  <span className="font-normal text-sm text-gray-500">{calculateDayDate(day.dayNumber - 1)}</span>
                </h3>
                <div className="pl-4 mt-2 space-y-3">
                  {/* Activities */}
                  {day.activities.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-blue-600 uppercase tracking-wider mb-1">Activities</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-700">
                        {day.activities.map(a => (
                          <li key={a.id}>
                             <span className="font-semibold">{a.timeSlot}:</span> {a.name} - {a.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Stays */}
                  {day.stays.length > 0 && (
                    <div className="flex gap-4 text-sm text-gray-700">
                      <span className="font-semibold text-blue-600 uppercase">Stay:</span>
                      {day.stays.map(s => (
                        <span key={s.id}>{s.hotelName} ({s.rating}★)</span>
                      ))}
                    </div>
                  )}
                  {/* Transport */}
                  {day.transports.length > 0 && (
                    <div className="flex gap-4 text-sm text-gray-700">
                      <span className="font-semibold text-blue-600 uppercase">Transport:</span>
                      {day.transports.map(t => (
                        <span key={t.id}>{t.vehicleType}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="break-inside-avoid">
            <h2 className="text-xl font-bold border-b border-gray-300 mb-4 pb-2 text-blue-800">Costing Sheet</h2>
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-2">Category</th>
                  <th className="p-2 text-right">Calculation Logic</th>
                  <th className="p-2 text-right">Group Total</th>
                  <th className="p-2 text-right">Per Person</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-2">Activities & Guide</td>
                  <td className="p-2 text-right text-gray-500">Sum of (Fees × Travelers)</td>
                  <td className="p-2 text-right">${costs.totalActivityCost.toFixed(2)}</td>
                  <td className="p-2 text-right">${(costs.totalActivityCost / data.basic.travelers).toFixed(2)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2">Accommodation</td>
                  <td className="p-2 text-right text-gray-500">Shared (Room Cost / 2 approx)</td>
                  <td className="p-2 text-right">${costs.totalStayCost.toFixed(2)}</td>
                  <td className="p-2 text-right">${(costs.totalStayCost / data.basic.travelers).toFixed(2)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2">Transport</td>
                  <td className="p-2 text-right text-gray-500">Shared (Vehicle / Travelers)</td>
                  <td className="p-2 text-right">${costs.totalTransportCost.toFixed(2)}</td>
                  <td className="p-2 text-right">${(costs.totalTransportCost / data.basic.travelers).toFixed(2)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-2">Meals</td>
                  <td className="p-2 text-right text-gray-500">Per Person Cost</td>
                  <td className="p-2 text-right">${costs.totalMealCost.toFixed(2)}</td>
                  <td className="p-2 text-right">${(costs.totalMealCost / data.basic.travelers).toFixed(2)}</td>
                </tr>
                <tr className="bg-blue-50 font-bold text-blue-900 text-lg">
                  <td className="p-3">TOTAL</td>
                  <td className="p-3"></td>
                  <td className="p-3 text-right">${costs.grandTotal.toFixed(2)}</td>
                  <td className="p-3 text-right">${costs.perPerson.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex gap-4 print:hidden">
            <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
              <Printer size={18} /> Print / Save as PDF
            </button>
            <button onClick={() => setShowPrintView(false)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300">
              Close Preview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Map size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 leading-tight">Itinerary<span className="text-blue-600">Pro</span></h1>
              <p className="text-xs text-gray-500">Builder & Costing Engine</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  step === s 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {s === 1 && 'Basic Info'}
                {s === 2 && 'Routing'}
                {s === 3 && 'Planner'}
                {s === 4 && 'Costing'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleSave} className="flex items-center gap-2 text-sm bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-md hover:bg-green-100 transition-colors">
              <Save size={16} /> Quick Save
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Step 1: Basic Details */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
              <FileText className="text-blue-500" /> Basic Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Trip Reference ID</label>
                <input 
                  type="text" 
                  value={data.basic.tripId} 
                  onChange={(e) => updateBasic('tripId', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Country</label>
                <input 
                  type="text" 
                  value={data.basic.country} 
                  onChange={(e) => updateBasic('country', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Switzerland"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Trip Name</label>
                <input 
                  type="text" 
                  value={data.basic.tripName} 
                  onChange={(e) => updateBasic('tripName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Summer Alps Tour 2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input 
                  type="date" 
                  value={data.basic.startDate} 
                  onChange={(e) => updateBasic('startDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Travelers</label>
                <input 
                  type="number" 
                  min="1"
                  value={data.basic.travelers} 
                  onChange={(e) => updateBasic('travelers', parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setStep(2)} 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
              >
                Next Step: Routing <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Routing */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
              <Map className="text-blue-500" /> Cities & Routing
            </h2>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6 flex justify-between items-center">
              <div>
                <span className="text-blue-800 font-medium">Total Duration:</span>
                <span className="text-2xl font-bold text-blue-900 ml-2">{totalNights} Nights / {totalDays} Days</span>
              </div>
              <button onClick={addCity} className="bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium flex items-center gap-2">
                <Plus size={16} /> Add City
              </button>
            </div>

            <div className="space-y-4">
              {data.cities.map((city, index) => (
                <div key={city.id} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-200 group">
                  <div className="flex-grow">
                    <label className="block text-xs font-medium text-gray-500 mb-1">City / Stop Name</label>
                    <input 
                      type="text" 
                      value={city.cityName} 
                      onChange={(e) => updateCity(city.id, 'cityName', e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. Paris"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nights</label>
                    <input 
                      type="number" 
                      min="0"
                      value={city.nights} 
                      onChange={(e) => updateCity(city.id, 'nights', parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none text-center"
                    />
                  </div>
                  <button 
                    onClick={() => removeCity(city.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {data.cities.length === 0 && (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  No cities added yet. Click "Add City" to start your route.
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-100">
                 Back
              </button>
              <button 
                onClick={() => setStep(3)} 
                disabled={data.cities.length === 0}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step: Day Planning <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Day Planning */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
            
            {/* Sidebar: Day Selector */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-bold text-gray-700">Select Day</h3>
              </div>
              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {data.days.map((day, idx) => (
                  <button
                    key={day.dayNumber}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm flex justify-between items-center ${
                      selectedDayIndex === idx 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <span>Day {day.dayNumber}</span>
                    <span className="text-xs text-gray-400">{calculateDayDate(idx)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content: Tabs & Forms */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
              {/* Day Header */}
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Day {data.days[selectedDayIndex]?.dayNumber} Planning</h2>
                  <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {calculateDayDate(selectedDayIndex)}
                  </span>
                </div>
                
                {/* Tabs */}
                <div className="flex space-x-2 border-b border-gray-200">
                  <button 
                    onClick={() => setActiveTab('activity')}
                    className={`pb-2 px-4 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'activity' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    <Activity size={16} /> Activities
                  </button>
                  <button 
                    onClick={() => setActiveTab('stay')}
                    className={`pb-2 px-4 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'stay' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    <Hotel size={16} /> Stay / Hotel
                  </button>
                  <button 
                    onClick={() => setActiveTab('transport')}
                    className={`pb-2 px-4 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'transport' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    <Car size={16} /> Transport
                  </button>
                  <button 
                    onClick={() => setActiveTab('meal')}
                    className={`pb-2 px-4 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'meal' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    <Utensils size={16} /> Meals
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                
                {/* ACTIVITY TAB */}
                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-xs text-gray-500 uppercase font-bold">Activity Name</label>
                        <input id="actName" type="text" className="w-full border p-2 rounded mt-1" placeholder="e.g. Louvre Museum" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-xs text-gray-500 uppercase font-bold">Time Slot</label>
                        <select id="actTime" className="w-full border p-2 rounded mt-1">
                          <option>Morning</option>
                          <option>Afternoon</option>
                          <option>Evening</option>
                          <option>Full Day</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500 uppercase font-bold">Description</label>
                        <input id="actDesc" type="text" className="w-full border p-2 rounded mt-1" placeholder="Guided tour of main gallery" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-bold">Entrance Fee (PP)</label>
                        <input id="actEnt" type="number" className="w-full border p-2 rounded mt-1" placeholder="0" />
                      </div>
                      <div>
                         <label className="text-xs text-gray-500 uppercase font-bold">Guide Charge (PP)</label>
                         <input id="actGuide" type="number" className="w-full border p-2 rounded mt-1" placeholder="0" />
                      </div>
                      <div>
                         <label className="text-xs text-gray-500 uppercase font-bold">Activity Fee (PP)</label>
                         <input id="actFee" type="number" className="w-full border p-2 rounded mt-1" placeholder="0" />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <button 
                          onClick={() => {
                            const name = (document.getElementById('actName') as HTMLInputElement).value;
                            if(!name) return;
                            addItemToDay(selectedDayIndex, 'activities', {
                              name,
                              description: (document.getElementById('actDesc') as HTMLInputElement).value,
                              timeSlot: (document.getElementById('actTime') as HTMLSelectElement).value,
                              entranceFee: parseFloat((document.getElementById('actEnt') as HTMLInputElement).value) || 0,
                              guideCharge: parseFloat((document.getElementById('actGuide') as HTMLInputElement).value) || 0,
                              activityFee: parseFloat((document.getElementById('actFee') as HTMLInputElement).value) || 0,
                            });
                            // Reset
                            (document.getElementById('actName') as HTMLInputElement).value = '';
                            (document.getElementById('actDesc') as HTMLInputElement).value = '';
                            (document.getElementById('actEnt') as HTMLInputElement).value = '';
                            (document.getElementById('actGuide') as HTMLInputElement).value = '';
                            (document.getElementById('actFee') as HTMLInputElement).value = '';
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Add Activity
                        </button>
                      </div>
                    </div>

                    {/* List */}
                    <div className="space-y-3">
                      {data.days[selectedDayIndex]?.activities.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded border border-gray-200 flex justify-between items-start">
                          <div>
                            <div className="font-bold text-gray-800">{item.name} <span className="text-xs font-normal text-gray-500 ml-2 bg-gray-100 px-2 py-1 rounded">{item.timeSlot}</span></div>
                            <div className="text-sm text-gray-600">{item.description}</div>
                            <div className="text-xs text-gray-500 mt-2">
                              Costs (PP): Ent: ${item.entranceFee} | Guide: ${item.guideCharge} | Fee: ${item.activityFee}
                            </div>
                          </div>
                          <button onClick={() => removeItemFromDay(selectedDayIndex, 'activities', item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STAY TAB */}
                {activeTab === 'stay' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-xs text-gray-500 uppercase font-bold">Hotel Name</label>
                        <input id="stayName" type="text" className="w-full border p-2 rounded mt-1" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-xs text-gray-500 uppercase font-bold">Rating</label>
                        <select id="stayRate" className="w-full border p-2 rounded mt-1">
                          <option>5</option>
                          <option>4</option>
                          <option>3</option>
                          <option>2</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-bold">Cost Per Room (Night)</label>
                        <input id="stayCost" type="number" className="w-full border p-2 rounded mt-1" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-bold">Number of Rooms</label>
                        <input id="stayCount" type="number" defaultValue={1} className="w-full border p-2 rounded mt-1" />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <button 
                          onClick={() => {
                            const name = (document.getElementById('stayName') as HTMLInputElement).value;
                            if(!name) return;
                            addItemToDay(selectedDayIndex, 'stays', {
                              hotelName: name,
                              rating: (document.getElementById('stayRate') as HTMLSelectElement).value,
                              costPerNight: parseFloat((document.getElementById('stayCost') as HTMLInputElement).value) || 0,
                              roomCount: parseInt((document.getElementById('stayCount') as HTMLInputElement).value) || 1,
                            });
                            (document.getElementById('stayName') as HTMLInputElement).value = '';
                            (document.getElementById('stayCost') as HTMLInputElement).value = '';
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >Add Stay</button>
                      </div>
                    </div>
                    {/* List */}
                    <div className="space-y-3">
                       {data.days[selectedDayIndex]?.stays.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded border border-gray-200 flex justify-between items-start">
                          <div>
                            <div className="font-bold text-gray-800">{item.hotelName} <span className="text-yellow-500 text-sm">{'★'.repeat(parseInt(item.rating))}</span></div>
                            <div className="text-sm text-gray-600">Total: ${item.costPerNight} x {item.roomCount} room(s)</div>
                            <div className="text-xs text-blue-600 mt-1">Shared Cost Logic Applied</div>
                          </div>
                          <button onClick={() => removeItemFromDay(selectedDayIndex, 'stays', item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TRANSPORT TAB */}
                {activeTab === 'transport' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-xs text-gray-500 uppercase font-bold">Vehicle Type</label>
                        <select id="transType" className="w-full border p-2 rounded mt-1">
                          <option>Private Sedan</option>
                          <option>SUV / Van</option>
                          <option>Bus</option>
                          <option>Train Ticket</option>
                          <option>Flight</option>
                        </select>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-xs text-gray-500 uppercase font-bold">Total Vehicle Fee</label>
                        <input id="transCost" type="number" className="w-full border p-2 rounded mt-1" placeholder="Total cost for the group" />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <button 
                          onClick={() => {
                            addItemToDay(selectedDayIndex, 'transports', {
                              vehicleType: (document.getElementById('transType') as HTMLSelectElement).value,
                              vehicleCost: parseFloat((document.getElementById('transCost') as HTMLInputElement).value) || 0,
                            });
                            (document.getElementById('transCost') as HTMLInputElement).value = '';
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >Add Transport</button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {data.days[selectedDayIndex]?.transports.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded border border-gray-200 flex justify-between items-start">
                          <div>
                            <div className="font-bold text-gray-800">{item.vehicleType}</div>
                            <div className="text-sm text-gray-600">Group Cost: ${item.vehicleCost}</div>
                            <div className="text-xs text-blue-600 mt-1">Split by {data.basic.travelers} travelers</div>
                          </div>
                          <button onClick={() => removeItemFromDay(selectedDayIndex, 'transports', item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                 {/* MEAL TAB */}
                 {activeTab === 'meal' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-xs text-gray-500 uppercase font-bold">Meal Type</label>
                        <select id="mealType" className="w-full border p-2 rounded mt-1">
                          <option>Breakfast</option>
                          <option>Lunch</option>
                          <option>Dinner</option>
                          <option>Snack</option>
                        </select>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-xs text-gray-500 uppercase font-bold">Cost Per Person</label>
                        <input id="mealCost" type="number" className="w-full border p-2 rounded mt-1" />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <button 
                          onClick={() => {
                            addItemToDay(selectedDayIndex, 'meals', {
                              mealType: (document.getElementById('mealType') as HTMLSelectElement).value,
                              costPerPerson: parseFloat((document.getElementById('mealCost') as HTMLInputElement).value) || 0,
                            });
                            (document.getElementById('mealCost') as HTMLInputElement).value = '';
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >Add Meal</button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {data.days[selectedDayIndex]?.meals.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded border border-gray-200 flex justify-between items-start">
                          <div>
                            <div className="font-bold text-gray-800">{item.mealType}</div>
                            <div className="text-sm text-gray-600">${item.costPerPerson} per person</div>
                          </div>
                          <button onClick={() => removeItemFromDay(selectedDayIndex, 'meals', item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

             {/* Footer Nav for Step 3 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-20 flex justify-between">
               <button onClick={() => setStep(2)} className="text-gray-600">Back</button>
               <button onClick={() => setStep(4)} className="bg-blue-600 text-white px-4 py-2 rounded">Next: Costing</button>
            </div>
            <div className="hidden lg:flex fixed bottom-8 right-8 gap-4">
               <button onClick={() => setStep(2)} className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium">Back</button>
               <button onClick={() => setStep(4)} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg font-medium flex items-center gap-2">Next: Costing <ChevronRight size={18}/></button>
            </div>
          </div>
        )}

        {/* Step 4: Costing */}
        {step === 4 && (
           <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <DollarSign className="text-blue-500" /> Costing Breakdown
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="text-blue-800 font-bold text-lg mb-2">Trip Summary</h3>
                  <div className="space-y-2 text-sm text-blue-900">
                     <p><span className="font-semibold">Name:</span> {data.basic.tripName}</p>
                     <p><span className="font-semibold">Duration:</span> {totalDays} Days / {totalNights} Nights</p>
                     <p><span className="font-semibold">Travelers:</span> {data.basic.travelers}</p>
                  </div>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex flex-col justify-center items-center text-center">
                   <p className="text-green-700 font-medium mb-1">Total Per Person Cost</p>
                   <p className="text-4xl font-bold text-green-800">${costs.perPerson.toFixed(2)}</p>
                   <p className="text-xs text-green-600 mt-2">Group Total: ${costs.grandTotal.toFixed(2)}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="p-4 font-semibold text-gray-700">Category</th>
                      <th className="p-4 font-semibold text-gray-700 text-right">Calculation Details</th>
                      <th className="p-4 font-semibold text-gray-700 text-right">Group Total</th>
                      <th className="p-4 font-semibold text-gray-700 text-right">Per Person</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     <tr>
                        <td className="p-4 font-medium">Activities</td>
                        <td className="p-4 text-right text-gray-500">Entrance + Guide + Fees</td>
                        <td className="p-4 text-right">${costs.totalActivityCost.toFixed(2)}</td>
                        <td className="p-4 text-right">${(costs.totalActivityCost / data.basic.travelers).toFixed(2)}</td>
                     </tr>
                     <tr>
                        <td className="p-4 font-medium">Accommodation</td>
                        <td className="p-4 text-right text-gray-500">Shared Cost</td>
                        <td className="p-4 text-right">${costs.totalStayCost.toFixed(2)}</td>
                        <td className="p-4 text-right">${(costs.totalStayCost / data.basic.travelers).toFixed(2)}</td>
                     </tr>
                     <tr>
                        <td className="p-4 font-medium">Transport</td>
                        <td className="p-4 text-right text-gray-500">Vehicle Cost / {data.basic.travelers}</td>
                        <td className="p-4 text-right">${costs.totalTransportCost.toFixed(2)}</td>
                        <td className="p-4 text-right">${(costs.totalTransportCost / data.basic.travelers).toFixed(2)}</td>
                     </tr>
                     <tr>
                        <td className="p-4 font-medium">Meals</td>
                        <td className="p-4 text-right text-gray-500">Individual Cost</td>
                        <td className="p-4 text-right">${costs.totalMealCost.toFixed(2)}</td>
                        <td className="p-4 text-right">${(costs.totalMealCost / data.basic.travelers).toFixed(2)}</td>
                     </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex justify-between pt-6 border-t border-gray-200">
                 <button onClick={() => setStep(3)} className="text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-100">Back to Planning</button>
                 <button 
                  onClick={() => setShowPrintView(true)} 
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 shadow-lg font-bold flex items-center gap-2"
                >
                  <FileText size={20} /> Generate Sheet / PDF
                 </button>
              </div>
           </div>
        )}

      </main>
    </div>
  );
}