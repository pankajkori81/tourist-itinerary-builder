import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  // Customer Info
  customerName: { type: String, required: true },
  email: { type: String, default: "" },
  phone: { type: String, required: true },
  
  // Trip Requirements
  destination: { type: String, required: true },
  travelDates: { type: String, default: "Flexible" },
  numberOfTravelers: { type: Number, default: 2 },
  budget: { type: Number, default: 0 },
  currency: { type: String, default: "USD" },
  notes: { type: String, default: "" },

  // CRM Pipeline Status
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Quoted', 'Won', 'Lost'], 
    default: 'New' 
  },

  // Role-Based Security: Who owns this lead?
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
}, { timestamps: true });

const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
export default Lead;