"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, MapPin, Calendar, DollarSign, Users, ArrowRight, Loader2, Briefcase } from "lucide-react";

export default function NewLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "", email: "", phone: "", destination: "",
    travelDates: "", numberOfTravelers: 2, budget: 0, notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            numberOfTravelers: Number(formData.numberOfTravelers),
            budget: Number(formData.budget)
        }),
      });

      const json = await res.json();
      if (json.success) {
        router.push("/dashboard/leads"); // Go back to CRM board
      } else {
        alert(json.message);
      }
    } catch (error) {
      alert("Failed to create lead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto pb-20 bg-[#0f172a]">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-6 flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                <Briefcase size={20}/>
             </div>
             <div>
                 <h1 className="text-2xl font-bold text-white tracking-wide">Create New Inquiry</h1>
                 <p className="text-gray-400 text-sm">Log a new potential client into your CRM.</p>
             </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-6 md:p-8 space-y-6">
          
          {/* Customer Details */}
          <div>
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">1. Client Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-500" size={16}/>
                      <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="John Doe" className="w-full pl-10 px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-500" size={16}/>
                      <input required type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="w-full pl-10 px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Email Address</label>
                  <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-500" size={16}/>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full pl-10 px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" />
                  </div>
                </div>
              </div>
          </div>

          {/* Trip Details */}
          <div className="pt-2">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">2. Trip Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Destination <span className="text-red-500">*</span></label>
                  <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-500" size={16}/>
                      <input required type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="e.g. Paris & Rome" className="w-full pl-10 px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Travel Dates</label>
                  <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-gray-500" size={16}/>
                      <input type="text" name="travelDates" value={formData.travelDates} onChange={handleChange} placeholder="e.g. Mid-October or Flexible" className="w-full pl-10 px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Total Travelers (Pax)</label>
                  <div className="relative">
                      <Users className="absolute left-3 top-3 text-gray-500" size={16}/>
                      <input type="number" min="1" name="numberOfTravelers" value={formData.numberOfTravelers} onChange={handleChange} className="w-full pl-10 px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Estimated Budget</label>
                  <div className="relative">
                      <DollarSign className="absolute left-3 top-3 text-gray-500" size={16}/>
                      <input type="number" name="budget" value={formData.budget || ''} onChange={handleChange} placeholder="0" className="w-full pl-10 px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all font-bold" />
                  </div>
                </div>
              </div>
          </div>

          <div className="pt-2">
             <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Additional Notes</label>
             <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Client prefers 5-star hotels, vegetarian food..." className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all resize-none"></textarea>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
             <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
             <button type="submit" disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all">
                {loading ? <Loader2 size={18} className="animate-spin"/> : "Save Inquiry"} <ArrowRight size={16}/>
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}