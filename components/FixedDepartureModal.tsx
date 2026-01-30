"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, X, AlertTriangle } from 'lucide-react';
import { FixedDeparture } from '@/utils/itineraryStorage';

interface FixedDepartureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (departures: FixedDeparture[]) => void;
  initialData: FixedDeparture[];
}

export default function FixedDepartureModal({ isOpen, onClose, onSave, initialData }: FixedDepartureModalProps) {
  const [departures, setDepartures] = useState<FixedDeparture[]>([]);

  useEffect(() => {
    if (isOpen) {
        // Deep copy to prevent mutating state directly before save
        setDepartures(JSON.parse(JSON.stringify(initialData || [])));
    }
  }, [isOpen, initialData]);

  const addRow = () => {
    const newRow: FixedDeparture = {
        id: Date.now().toString(),
        date: '',
        label: '',
        price: 0,
        status: 'Open',
        isSelected: false
    };
    setDepartures([...departures, newRow]);
  };

  const updateRow = (id: string, field: keyof FixedDeparture, value: any) => {
    setDepartures(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const deleteRow = (id: string) => {
    setDepartures(prev => prev.filter(d => d.id !== id));
  };

  const handleSave = () => {
    // Basic Validation
    const invalid = departures.some(d => !d.date || d.price <= 0);
    if(invalid) {
        if(!confirm("Some rows have missing dates or 0 price. Save anyway?")) return;
    }
    onSave(departures);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/5  z-50 flex items-center justify-center  backdrop-blur-sm">
      <div className=" pt-15 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4  border-t border-gray-200 flex justify-between items-center bg-white rounded-lg">
            <div>
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <Calendar className="text-blue-600" size={20}/> 
                    Fixed Departures & Pricing
                </h3>
                <p className="text-xs text-gray-500">Manage dates and base prices for this series.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
        </div>

        {/* Table Body */}
        <div className="p-6  bg-white overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-xs font-bold text-gray-500 uppercase border-b border-gray-200 bg-gray-50/50">
                        <th className="py-3 pl-4 w-12 text-center">#</th>
                        <th className="py-3 w-48">Date</th>
                        <th className="py-3">Display Label</th>
                        <th className="py-3 w-32">Price (PP)</th>
                        <th className="py-3 w-40">Status</th>
                        <th className="py-3 w-16 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {departures.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-blue-50/30 group transition-colors">
                            <td className="py-3 pl-4 text-center">
                                <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-bold">
                                    {idx + 1}
                                </div>
                            </td>
                            <td className="py-3 pr-4">
                                <input 
                                    type="date" 
                                    value={row.date} 
                                    onChange={(e) => updateRow(row.id, 'date', e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                />
                            </td>
                            <td className="py-3 pr-4">
                                <input 
                                    type="text" 
                                    placeholder="e.g. Valentine's Batch"
                                    value={row.label} 
                                    onChange={(e) => updateRow(row.id, 'label', e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                />
                            </td>
                            <td className="py-3 pr-4">
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-400 text-xs font-bold">$</span>
                                    <input 
                                        type="number" 
                                        value={row.price} 
                                        onChange={(e) => updateRow(row.id, 'price', parseFloat(e.target.value))}
                                        className="w-full pl-6 p-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </td>
                            <td className="py-3 pr-4">
                                <select 
                                    value={row.status}
                                    onChange={(e) => updateRow(row.id, 'status', e.target.value)}
                                    className={`w-full p-2 rounded-lg text-xs font-bold border outline-none cursor-pointer ${
                                        row.status === 'Open' ? 'bg-green-50 text-green-700 border-green-200' :
                                        row.status === 'Filling Fast' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                        'bg-red-50 text-red-700 border-red-200'
                                    }`}
                                >
                                    <option value="Open">Open</option>
                                    <option value="Filling Fast">Filling Fast</option>
                                    <option value="Sold Out">Sold Out</option>
                                </select>
                            </td>
                            <td className="py-3 text-center">
                                <button 
                                    onClick={() => deleteRow(row.id)} 
                                    className="p-2 text-gray-300 text-red-600 hover:bg-red-50 rounded-full transition-all"
                                >
                                    <Trash2 size={16}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    
                    {departures.length === 0 && (
                        <tr>
                            <td colSpan={6} className="py-8 text-center text-gray-400 text-sm italic bg-gray-50/50 rounded-lg border border-dashed border-gray-200 my-4">
                                No dates added yet. Click "Add Date" to start.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            <div className="mt-4">
                <button 
                    onClick={addRow}
                    className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                >
                    <Plus size={16}/> Add New Departure Date
                </button>
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm hover:shadow-md transition-all">
                Save Inventory
            </button>
        </div>
      </div>
    </div>
  );
}