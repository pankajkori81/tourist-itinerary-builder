"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, Users, ArrowRight 
} from 'lucide-react';
// Make sure this import path matches where your types are defined
import { DayPlan } from '../../create-day/constants/daywiseConstants';

interface CostingSheetProps {
  // We rename this to 'dayPlans' to avoid confusion with the global itinerary object
  dayPlans: DayPlan[] | undefined; 
  initialTravelers: number;
}

export default function CostingSheet({ dayPlans, initialTravelers }: CostingSheetProps) {
  
  // --- STATE ---
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [exchangeRate, setExchangeRate] = useState<number>(85.0); 
  const [totalTravelers, setTotalTravelers] = useState<number>(initialTravelers || 2);
  const [markupPercentage, setMarkupPercentage] = useState<number>(0);

  // Sync state if prop changes (e.g. data loaded from context)
  useEffect(() => {
    if (initialTravelers) {
        setTotalTravelers(initialTravelers);
    }
  }, [initialTravelers]);

  // --- HELPER: FORMAT CURRENCY ---
  const formatMoney = (amount: number) => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(amount / exchangeRate);
    }
  };

  // --- CALCULATIONS ---
  const calculations = useMemo(() => {
    // 1. SAFETY CHECK: If data is undefined, return zeros to prevent CRASH
    if (!dayPlans || !Array.isArray(dayPlans)) {
        return {
            totalActivityCost: 0,
            totalStayCost: 0,
            totalTransportCost: 0,
            detailedRows: [],
            netTotal: 0,
            markupAmount: 0,
            finalTotal: 0,
            perPersonCost: 0
        };
    }

    let totalActivityCost = 0;
    let totalStayCost = 0;
    let totalTransportCost = 0;
    const detailedRows: any[] = [];

    // 2. ITERATE SAFELY
    dayPlans.forEach((day) => {
      
      // A. ACTIVITIES
      if (day.activities) {
          day.activities.forEach(act => {
            if (act.inclusionType === 'included') {
              const variableCost = (act.entranceFeePP + act.activityFeePP) * totalTravelers;
              const fixedCost = act.guideFee || 0; 
              const rowTotal = variableCost + fixedCost;

              totalActivityCost += rowTotal;

              detailedRows.push({
                day: `Day ${day.dayNumber}`,
                category: 'Activity',
                name: act.heading,
                logic: `(₹${act.entranceFeePP + act.activityFeePP} × ${totalTravelers}) + ₹${fixedCost}`,
                cost: rowTotal
              });
            }
          });
      }

      // B. STAYS
      if (day.stays) {
          day.stays.forEach(stay => {
            const rowTotal = stay.costPerNight * stay.numRooms * stay.nights;
            totalStayCost += rowTotal;

            detailedRows.push({
              day: `Day ${day.dayNumber}`,
              category: 'Stay',
              name: `${stay.hotelName} (${stay.nights}N)`,
              logic: `₹${stay.costPerNight} × ${stay.numRooms} × ${stay.nights}`,
              cost: rowTotal
            });
          });
      }

      // C. TRANSPORT
      if (day.transports) {
          day.transports.forEach(trans => {
       if ((trans as any).serviceType === 'Planned') {
              const rowTotal = trans.price * trans.vehicleCount;
              totalTransportCost += rowTotal;
      
              detailedRows.push({
                day: `Day ${day.dayNumber}`,
                category: 'Transport',
                name: `${trans.vehicleType} (${trans.subType})`,
                logic: `₹${trans.price} × ${trans.vehicleCount}`,
                cost: rowTotal
              });
            }
          });
      }
    });

    const netTotal = totalActivityCost + totalStayCost + totalTransportCost;
    const markupAmount = netTotal * (markupPercentage / 100);
    const finalTotal = netTotal + markupAmount;
    // Prevent division by zero
    const perPersonCost = totalTravelers > 0 ? finalTotal / totalTravelers : 0;

    return {
      totalActivityCost,
      totalStayCost,
      totalTransportCost,
      detailedRows,
      netTotal,
      markupAmount,
      finalTotal,
      perPersonCost
    };
  }, [dayPlans, totalTravelers, markupPercentage, currency, exchangeRate]); 


  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden rounded-xl border border-gray-200">
      
      {/* HEADER CONTROLS */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm flex flex-wrap gap-6 items-center justify-between z-10">
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
            <Calculator size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Trip Costing</h2>
            <p className="text-xs text-gray-500">
               {dayPlans ? `${dayPlans.length} Days Loaded` : 'No Itinerary Data'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-lg border border-gray-200">
           {/* Travelers Input */}
           <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Travelers</label>
              <div className="flex items-center gap-2">
                 <Users size={14} className="text-gray-400"/>
                 <input 
                    type="number" min="1"
                    value={totalTravelers}
                    onChange={(e) => setTotalTravelers(parseInt(e.target.value) || 1)}
                    className="w-12 bg-transparent font-bold text-sm outline-none border-b border-gray-300 focus:border-blue-500"
                 />
              </div>
           </div>

           <div className="w-px h-8 bg-gray-300"></div>

           {/* Currency Toggle */}
           <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Currency</label>
              <div className="flex items-center gap-2">
                 <button 
                    onClick={() => setCurrency('INR')}
                    className={`text-xs font-bold px-2 py-0.5 rounded ${currency === 'INR' ? 'bg-green-100 text-green-700' : 'text-gray-400'}`}
                 >INR</button>
                 <button 
                    onClick={() => setCurrency('USD')}
                    className={`text-xs font-bold px-2 py-0.5 rounded ${currency === 'USD' ? 'bg-blue-100 text-blue-700' : 'text-gray-400'}`}
                 >USD</button>
              </div>
           </div>

           {/* Exchange Rate (Only show if USD) */}
           {currency === 'USD' && (
             <div className="flex flex-col animate-in slide-in-from-left-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">1 USD = ₹</label>
                <input 
                    type="number" 
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1)}
                    className="w-16 bg-transparent font-bold text-sm outline-none border-b border-gray-300 text-blue-600"
                 />
             </div>
           )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT: DETAILED TABLE */}
        <div className="flex-1 overflow-y-auto p-6">
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Day</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Details</th>
                    {/* <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-right">Calculation</th> */}
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-right">Cost ({currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {calculations.detailedRows.map((row, index) => (
                    <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs font-bold text-gray-400">{row.day}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide
                          ${row.category === 'Activity' ? 'bg-orange-100 text-orange-700' : 
                            row.category === 'Stay' ? 'bg-purple-100 text-purple-700' : 
                            'bg-green-100 text-green-700'}`
                        }>
                          {row.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700">{row.name}</td>
                      {/* <td className="px-4 py-3 text-xs text-gray-500 font-mono text-right">{row.logic}</td> */}
                      <td className="px-4 py-3 text-sm font-bold text-gray-800 text-right">
                        {formatMoney(row.cost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* RIGHT: SUMMARY CARD */}
        <div className="w-96 bg-white border-l border-gray-200 p-6 shadow-xl z-20 flex flex-col gap-6">
           <div>
             <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Cost Breakdown</h3>
             <div className="space-y-3">
               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-sm text-gray-600">Activities</span>
                  <span className="text-sm font-bold text-gray-800">{formatMoney(calculations.totalActivityCost)}</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-sm text-gray-600">Accommodation</span>
                  <span className="text-sm font-bold text-gray-800">{formatMoney(calculations.totalStayCost)}</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-sm text-gray-600">Transport</span>
                  <span className="text-sm font-bold text-gray-800">{formatMoney(calculations.totalTransportCost)}</span>
               </div>
             </div>
           </div>

           <div className="h-px bg-gray-200"></div>

           <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-gray-500">Net Cost</label>
                <span className="text-xs font-bold text-gray-800">{formatMoney(calculations.netTotal)}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                 <label className="text-xs font-bold text-gray-500">Markup (%)</label>
                 <input 
                   type="number" 
                   value={markupPercentage} 
                   onChange={(e) => setMarkupPercentage(parseFloat(e.target.value) || 0)}
                   className="w-16 p-1 text-right text-xs border border-gray-300 rounded focus:border-blue-500 outline-none"
                 />
              </div>
              <div className="flex justify-between text-blue-600">
                <label className="text-xs font-bold">Profit</label>
                <span className="text-xs font-bold">+{formatMoney(calculations.markupAmount)}</span>
              </div>
           </div>

           <div className="mt-auto bg-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-200">
              <div className="flex justify-between items-end mb-1">
                 <span className="text-blue-100 text-xs font-bold uppercase">Total Group Cost</span>
                 <span className="text-2xl font-bold">{formatMoney(calculations.finalTotal)}</span>
              </div>
              <div className="h-px bg-blue-400/50 my-3"></div>
              <div className="flex justify-between items-center">
                 <span className="text-blue-100 text-xs font-bold uppercase flex items-center gap-1">
                    <Users size={12}/> Per Person
                 </span>
                 <span className="text-lg font-bold text-yellow-300">{formatMoney(calculations.perPersonCost)}</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}