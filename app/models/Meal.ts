import mongoose from "mongoose";

const MealSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true },
  cuisine: String,
  type: String,
  city: { type: String, required: true },
  country: String,
  address: String,
  rating: String,
  images: [String],
  menuType: String,
  dietaryOptions: [String],
  inclusions: String,
  description: String,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  linkedSupplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' } // RELATIONAL LINK
}, { timestamps: true });

const Meal = mongoose.models.Meal || mongoose.model("Meal", MealSchema);
export default Meal;