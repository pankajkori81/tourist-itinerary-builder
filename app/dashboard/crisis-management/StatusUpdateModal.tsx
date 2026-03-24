"use client";

import { useState } from 'react';
import { X, Save, AlertTriangle, ShieldCheck, HelpCircle, PauseCircle, Truck } from 'lucide-react';

interface StatusUpdateModalProps {
  traveler: any;
  onClose: () => void;
  onSuccess: (updatedTraveler: any) => void;
}

export default function StatusUpdateModal({ traveler, onClose, onSuccess }: StatusUpdateModalProps) {
  const [status, setStatus] = useState(traveler.safetyStatus || 'none');
  const [notes, setNotes] = useState(traveler.emergencyNotes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/crisis/update-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: traveler._id,
          safetyStatus: status,
          emergencyNotes: notes
        })
      });

      const data = await res.json();
      if (data.success) {
        // Pass the updated data back to the table so the UI updates instantly
        onSuccess({ ...traveler, safetyStatus: status, emergencyNotes: notes });
        onClose();
      } else {
        alert("Failed to update: " + data.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-white">Update Safety Status</h2>
            <p className="text-sm text-slate-400 mt-1">Guest: <span className="text-white font-semibold">{traveler.leadGuestName}</span></p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Current Status</label>
            <div className="grid grid-cols-2 gap-3">
              
             {/* 👇 CHANGED: Suspended Button (Orange/Amber styling) */}
              <button onClick={() => setStatus('suspended')} className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${status === 'suspended' ? 'bg-orange-500/10 border-orange-500/50 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                <PauseCircle size={18} className={status === 'suspended' ? 'text-orange-400' : ''} /> Suspended
              </button>

              <button onClick={() => setStatus('safe')} className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${status === 'safe' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                <ShieldCheck size={18} className={status === 'safe' ? 'text-emerald-400' : ''} /> Safe
              </button>

              <button onClick={() => setStatus('sos')} className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${status === 'sos' ? 'bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                <AlertTriangle size={18} className={status === 'sos' ? 'text-red-400' : ''} /> SOS (In Danger)
              </button>

              <button onClick={() => setStatus('evacuated')} className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${status === 'evacuated' ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                <Truck size={18} className={status === 'evacuated' ? 'text-blue-400' : ''} /> Evacuated
              </button>

            </div>
          </div>

          {/* Emergency Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Operation Notes / Action Taken</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Contacted DMC driver. Driver is heading to the hotel to pick up the guest..."
              className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 resize-none transition-all"
            ></textarea>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
          <button onClick={onClose} disabled={isSaving} className="px-6 py-2.5 rounded-lg text-slate-300 font-medium hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : <><Save size={18} /> Save Update</>}
          </button>
        </div>

      </div>
    </div>
  );
}