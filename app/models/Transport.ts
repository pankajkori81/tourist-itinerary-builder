import mongoose from "mongoose";

const TransportSchema = new mongoose.Schema({
  vehicleType: { type: String, required: true },
  serviceType: { type: String, enum: ['Transfer', 'Disposal'], default: 'Transfer' },
  city: { type: String, required: true },
  country: String,
  maxGuests: Number,
  luggageCapacity: String,
  description: String,
  defaultPickup: String,
  defaultDropoff: String,
  defaultDuration: String,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  linkedSupplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' } // RELATIONAL LINK
}, { timestamps: true });

const Transport = mongoose.models.Transport || mongoose.model("Transport", TransportSchema);
export default Transport;