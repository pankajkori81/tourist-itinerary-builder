import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: String,
  city: { type: String, required: true },
  country: String,
  imageUrl: String,
  duration: String,
  suggestedSlot: String,
  startTime: String,
  pickupLocation: String,
  isGuideRequired: { type: Boolean, default: false },
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 0 },
  providerLink: String,
  description: String,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  linkedSupplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' } // RELATIONAL LINK
}, { timestamps: true });

const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
export default Activity;