import mongoose from "mongoose";

const RoomCategorySchema = new mongoose.Schema({
  name: String,
  maxOccupancy: Number,
  bedType: String,
  inclusions: [String]
});

const StaySchema = new mongoose.Schema({
  stayId: String,
  name: { type: String, required: true },
  category: { type: String, default: 'Hotel' },
  type: { type: String, default: 'Premium' },
  city: { type: String, required: true },
  country: String,
  address: String,
  rating: Number,
  description: String,
  images: [String],
  roomCategories: [RoomCategorySchema],
  linkedSupplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }, // RELATIONAL LINK
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);
export default Stay;