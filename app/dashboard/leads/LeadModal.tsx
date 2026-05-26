"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, Mail, MapPin, Calendar, DollarSign, Users, ArrowRight, Loader2, X } from "lucide-react";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Triggered when save is successful to refresh the board
  existingLead?: any; // If passed, it's Edit mode. If null, it's New mode.
}

export default function LeadModal({ isOpen, onClose, onSuccess, existingLead }: LeadModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "", email: "", phone: "", destination: "",
    travelDates: "", numberOfTravelers: 2, budget: 0, notes: ""
  });

  // Populate form if editing
  useEffect(() => {
    if (existingLead) {
      setFormData({
        customerName: existingLead.customerName || "",
        email: existingLead.email || "",
        phone: existingLead.phone || "",
        destination: existingLead.destination || "",
        travelDates: existingLead.travelDates || "",
        numberOfTravelers: existingLead.numberOfTravelers || 2,
        budget: existingLead.budget || 0,
        notes: existingLead.notes || ""
      });
    } else {
      // Reset form if creating new
      setFormData({
        customerName: "", email: "", phone: "", destination: "",
        travelDates: "", numberOfTravelers: 2, budget: 0, notes: ""
      });
    }
  }, [existingLead, isOpen]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const isEditing = !!existingLead;
    const url = "/api/leads";
    const method = isEditing ? "PUT" : "POST";
    const bodyPayload = isEditing 
        ? { leadId: existingLead._id, ...formData, numberOfTravelers: Number(formData.numberOfTravelers), budget: Number(formData.budget) }
        : { ...formData, numberOfTravelers: Number(formData.numberOfTravelers), budget: Number(formData.budget) };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const json = await res.json();
      if (json.success) {
        onSuccess(); // Tell the dashboard to refresh
        onClose();   // Close the modal
      } else {
        alert(json.message);
      }
    } catch (error) {
      alert("Failed to save lead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {existingLead ? "Edit Inquiry" : "Create New Inquiry"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {existingLead ? `Update details for ${formData.customerName}` : "Log a new potential client into your CRM."}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50">
          <form id="leadForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Client Details */}
            <div>
               <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">1. Client Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name <span className="text-red-500">*</span></label>
                   <div className="relative">
                       <User className="absolute left-3 top-3 text-gray-400" size={16}/>
                       <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="John Doe" className="w-full pl-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all shadow-sm" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                   <div className="relative">
                       <Phone className="absolute left-3 top-3 text-gray-400" size={16}/>
                       <input required type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="w-full pl-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all shadow-sm" />
                   </div>
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Address</label>
                   <div className="relative">
                       <Mail className="absolute left-3 top-3 text-gray-400" size={16}/>
                       <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full pl-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all shadow-sm" />
                   </div>
                 </div>
               </div>
            </div>

            {/* 2. Trip Requirements */}
            <div className="pt-2">
               <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">2. Trip Requirements</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Destination <span className="text-red-500">*</span></label>
                   <div className="relative">
                       <MapPin className="absolute left-3 top-3 text-gray-400" size={16}/>
                       <input required type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="e.g. Paris & Rome" className="w-full pl-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all shadow-sm" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Travel Dates</label>
                   <div className="relative">
                       <Calendar className="absolute left-3 top-3 text-gray-400" size={16}/>
                       <input type="text" name="travelDates" value={formData.travelDates} onChange={handleChange} placeholder="e.g. Mid-October or Flexible" className="w-full pl-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all shadow-sm" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Total Travelers (Pax)</label>
                   <div className="relative">
                       <Users className="absolute left-3 top-3 text-gray-400" size={16}/>
                       <input type="number" min="1" name="numberOfTravelers" value={formData.numberOfTravelers} onChange={handleChange} className="w-full pl-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all shadow-sm" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Estimated Budget</label>
                   <div className="relative">
                       <DollarSign className="absolute left-3 top-3 text-gray-400" size={16}/>
                       <input type="number" name="budget" value={formData.budget || ''} onChange={handleChange} placeholder="0" className="w-full pl-10 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all shadow-sm" />
                   </div>
                 </div>
               </div>
            </div>

            {/* Notes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Additional Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Client prefers 5-star hotels, vegetarian food..." className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all resize-none shadow-sm"></textarea>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all">
            Cancel
          </button>
          <button type="submit" form="leadForm" disabled={loading} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-md shadow-indigo-200 transition-all disabled:opacity-70">
            {loading ? <Loader2 size={18} className="animate-spin"/> : (existingLead ? "Update Inquiry" : "Save Inquiry")} <ArrowRight size={16}/>
          </button>
        </div>

      </div>
    </div>
  );
}