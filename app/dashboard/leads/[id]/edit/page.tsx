"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { User, Phone, Mail, MapPin, Calendar, DollarSign, Users, ArrowRight, Loader2, Briefcase } from "lucide-react";

export default function EditLeadPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string; // Grabs the ID from the URL

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "", email: "", phone: "", destination: "",
    travelDates: "", numberOfTravelers: 2, budget: 0, notes: ""
  });

  // 1. Fetch the existing data when the page loads
  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const res = await fetch(`/api/leads?id=${leadId}`);
        const json = await res.json();
        if (json.success) {
          setFormData({
            customerName: json.data.customerName || "",
            email: json.data.email || "",
            phone: json.data.phone || "",
            destination: json.data.destination || "",
            travelDates: json.data.travelDates || "",
            numberOfTravelers: json.data.numberOfTravelers || 2,
            budget: json.data.budget || 0,
            notes: json.data.notes || ""
          });
        } else {
          alert("Could not load inquiry data.");
          router.push("/dashboard/leads");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (leadId) fetchLeadData();
  }, [leadId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Save the updated data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch("/api/leads", {
        method: "PUT", // Notice we use PUT here to update!
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            leadId, // We must pass the ID so the backend knows which one to update
            ...formData,
            numberOfTravelers: Number(formData.numberOfTravelers),
            budget: Number(formData.budget)
        }),
      });

      const json = await res.json();
      if (json.success) {
        router.push("/dashboard/leads"); 
      } else {
        alert(json.message);
      }
    } catch (error) {
      alert("Failed to update lead.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
      return (
          <div className="h-full flex items-center justify-center bg-black">
              <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-black">
      
      {/* BACKGROUND */}
      <div 
          className="absolute inset-0 z-0 bg-cover bg-center blur-sm scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1481487196290-c152efe083f5?q=80&w=1262&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
      />
      <div className="absolute inset-0 z-0 bg-black/50" />

      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-6 md:px-8 py-4 flex justify-between items-center shadow-sm shrink-0 relative z-10">
          <div className="flex items-center gap-3">
              <Briefcase className="text-blue-600" size={24}/> 
              <div>
                  <h1 className="text-gray-900 font-extrabold text-xl tracking-tight">Edit Inquiry</h1>
                  <p className="text-gray-500 text-xs mt-0.5">Update details for {formData.customerName}.</p>
              </div>
          </div>
      </div>

      {/* FORM CONTAINER */}
      <div className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 pb-24">
              
            <form onSubmit={handleSubmit} className="bg-gray-100 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-400 p-6 md:p-8 space-y-6">
          
           {/* Customer Details */}
           <div>
               <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">1. Client Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name <span className="text-red-500">*</span></label>
                   <div className="relative">
                       <User className="absolute left-3 top-3 text-gray-500" size={16}/>
                       <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full pl-10 px-4 py-2.5 bg-gray-200 border border-gray-400 rounded-lg text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                   <div className="relative">
                       <Phone className="absolute left-3 top-3 text-gray-500" size={16}/>
                       <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 px-4 py-2.5 bg-gray-200 border border-gray-400 rounded-lg text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" />
                   </div>
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Address</label>
                   <div className="relative">
                       <Mail className="absolute left-3 top-3 text-gray-500" size={16}/>
                       <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 px-4 py-2.5 bg-gray-200 border border-gray-400 rounded-lg text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" />
                   </div>
                 </div>
               </div>
           </div>

           {/* Trip Details */}
           <div className="pt-2">
               <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 border-b border-black/10 pb-2">2. Trip Requirements</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Destination <span className="text-red-500">*</span></label>
                   <div className="relative">
                       <MapPin className="absolute left-3 top-3 text-gray-500" size={16}/>
                       <input required type="text" name="destination" value={formData.destination} onChange={handleChange} className="w-full pl-10 px-4 py-2.5 bg-gray-200 border border-gray-400 rounded-lg text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Travel Dates</label>
                   <div className="relative">
                       <Calendar className="absolute left-3 top-3 text-gray-500" size={16}/>
                       <input type="text" name="travelDates" value={formData.travelDates} onChange={handleChange} className="w-full pl-10 px-4 py-2.5 bg-gray-200 border border-gray-400 rounded-lg text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Total Travelers (Pax)</label>
                   <div className="relative">
                       <Users className="absolute left-3 top-3 text-gray-500" size={16}/>
                       <input type="number" min="1" name="numberOfTravelers" value={formData.numberOfTravelers} onChange={handleChange} className="w-full pl-10 px-4 py-2.5 bg-gray-200 border border-gray-400 rounded-lg text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all font-bold" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Estimated Budget</label>
                   <div className="relative">
                       <DollarSign className="absolute left-3 top-3 text-gray-500" size={16}/>
                       <input type="number" name="budget" value={formData.budget || ''} onChange={handleChange} className="w-full pl-10 px-4 py-2.5 bg-gray-200 border border-gray-400 rounded-lg text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all font-bold" />
                   </div>
                 </div>
               </div>
           </div>

           <div className="pt-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Additional Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-gray-200 border border-gray-400 rounded-lg text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all resize-none"></textarea>
           </div>

           <div className="pt-6 border-t border-black/10 flex justify-end gap-3">
              <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-500 hover:text-black hover:bg-black/5 transition-all">Cancel</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all">
                 {saving ? <Loader2 size={18} className="animate-spin"/> : "Update Inquiry"} <ArrowRight size={16}/>
              </button>
           </div>
         </form>

          </div>
        </div>

    </div>
  );
}