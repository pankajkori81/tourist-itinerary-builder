// import mongoose from "mongoose";

// // Sub-schema for the individual prices (e.g., Standard Room = $100)
// const RateItemSchema = new mongoose.Schema({
//   name: { type: String, required: true }, // e.g., "Standard Room", "Sedan Car"
//   netPrice: { type: Number, required: true, default: 0 },
// });

// // Sub-schema for the Date Ranges
// const SeasonSchema = new mongoose.Schema({
//   seasonName: { type: String, required: true }, // e.g., "Summer Peak 2026"
//   startDate: { type: String, required: true },  // Stored as YYYY-MM-DD
//   endDate: { type: String, required: true },    // Stored as YYYY-MM-DD
//   rates: [RateItemSchema]
// });

// // The Main Tariff Document
// const TariffSchema = new mongoose.Schema({
//   serviceId: { type: String, required: true, index: true }, // The hidden _id from SRM Stay/Transport
//   serviceName: { type: String, required: true }, // e.g., "Grand Hotel Palatino" (for quick reference)
//   serviceType: { type: String, enum: ['Stay', 'Transport', 'Activity', 'Meal'], required: true },
//   seasons: [SeasonSchema],
//   source: { type: String, default: 'Manual Contract' }, // Future proofing: "Manual" or "Hotelbeds API"
//   lastVerified: { type: Date, default: Date.now }
// }, { timestamps: true });

// const Tariff = mongoose.models.Tariff || mongoose.model("Tariff", TariffSchema);
// export default Tariff;














import mongoose from "mongoose";

// 🌟 UPGRADED: Sub-schema for Per-Night Occupancy Pricing
const RateItemSchema = new mongoose.Schema({
  name: { type: String,default: "" }, // e.g., "Standard Room"
  singleRate: { type: Number,  default: 0 }, // 1 Pax
  doubleRate: { type: Number,  default: 0 }, // 2 Pax (Twin/Double)
  tripleRate: { type: Number,  default: 0 }, // 3 Pax
  quadRate: { type: Number,    default: 0 },   // 4 Pax



  // 2. 👇 ADDED THIS FOR TRANSPORT 👇
  vehicleType: { type: String , default: ""}, 
  transferRate: { type: Number, default: 0 }, 
  disposalRate: { type: Number, default: 0 }
});

// Sub-schema for the Date Ranges
const SeasonSchema = new mongoose.Schema({
  seasonName: { type: String, required: true }, // e.g., "Summer Peak 2026"
  startDate: { type: String, required: true },  // Stored as YYYY-MM-DD
  endDate: { type: String, required: true },    // Stored as YYYY-MM-DD
  rates: [RateItemSchema]
});

// The Main Tariff Document
const TariffSchema = new mongoose.Schema({
  serviceId: { type: String, required: true, index: true }, 
  serviceName: { type: String, required: true }, 
  serviceType: { type: String, enum: ['Stay', 'Transport', 'Activity', 'Meal'], required: true },
  seasons: [SeasonSchema],
  source: { type: String, default: 'Manual Contract' }, 
  lastVerified: { type: Date, default: Date.now }
}, { timestamps: true });

const Tariff = mongoose.models.Tariff || mongoose.model("Tariff", TariffSchema);
export default Tariff;