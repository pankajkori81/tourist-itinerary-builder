import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  // Basic Contact Info
  name: { type: String, required: true },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  
  // CRM Custom Data
  preferences: { type: String, default: "" }, // e.g., "Aisle seat, vegetarian"
  tags: [{ type: String }], // e.g., ["VIP", "Honeymooner"]
  
  // Lifetime Value Tracking (The CRM Magic)
  totalTrips: { type: Number, default: 0 },
  lifetimeValue: { type: Number, default: 0 },
  
  // Security: Which agent owns this client?
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

}, { timestamps: true });

// Prevent mongoose from compiling the model multiple times in Next.js development
const Client = mongoose.models.Client || mongoose.model("Client", ClientSchema);
export default Client;