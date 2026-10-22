import mongoose from "mongoose";

const RoomCategorySchema = new mongoose.Schema({
  name: String,
  maxOccupancy: Number,
  bedType: String,
  inclusions: [String]
});


// Sub-schema for amenities (Wi-Fi, Breakfast hours, Parking...).
// _id:false stops Mongoose from creating an id for every amenity line.
const KeyAmenitySchema = new mongoose.Schema({
  key: { type: String, required: true },
  details: { type: String, default: '' }
}, { _id: false });


const BaseRateSchema = new mongoose.Schema({
  period: { type: String, required: true }, // e.g. "Jan 2027"
  price: { type: Number, required: true }   // e.g. 195
}, { _id: false });

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

mealType: { type: String, default: '' },     // Breakfast / Lunch / Dinner / High Tea
menuStyle: { type: String, default: '' },    // Buffet / Fixed Menu / A La Carte
mealNotes: { type: String, default: '' },

  // 🌟 NEW OTA / GDS PROPERTY SPECS 🌟
  chainCode: { type: String, default: '' },
  brand: { type: String, default: '' },
  stateProvince: { type: String, default: '' },
  zipPostal: { type: String, default: '' },
  phone: { type: String, default: '' },
  propertyOverview: { type: String, default: '' },

   // NEW: guest review score, separate from `rating` (which is the star rating)
  reviewRating: { type: Number },

  // NEW: optional list of { key, details }
  keyAmenities: { type: [KeyAmenitySchema], default: [] },

  monthlyBaseRates: { type: [BaseRateSchema], default: [] },
  gdsLocation: { type: String, default: '' }, // e.g., Suburban, Resort, Downtown
  totalUnits: { type: Number, default: 0 },
  nonSmokingRooms: { type: Number, default: 0 },
  floors: { type: Number, default: 1 },
  latitude: { type: Number },
  longitude: { type: Number },


linkedSupplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }, 
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);
export default Stay;