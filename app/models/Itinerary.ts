import mongoose from "mongoose";

const ItinerarySchema = new mongoose.Schema({
  // 1. Identifiers & Meta
  tripId: { type: String, required: true, unique: true },
  // 🌟 CRITICAL FIX: We MUST include this so Mongoose doesn't strip it out 
  itineraryCode: { type: String },
  tripName: { type: String, default: '' },
  numberOfTravelers: { type: Number, default: 2 },
  isMasterItinerary: { type: Boolean, default: false },
  
  // 2. Classification
  tripType: { type: String, default: '' },
  tripStyle: { type: String, default: '' },
  tripCategory: { type: String, default: '' },
  tripExperience: { type: String, default: '' },
  packageType: { type: String, default: 'land' },
  creatingFor: { type: String, default: 'guest' },
  
  // 3. Settings & Preferences
  showFlightDetails: { type: Boolean, default: false },
  showTravelerDetails: { type: Boolean, default: true },
  selectedCountries: [{ type: String }],
  selectedCurrency: { type: String, default: 'USD' },
  roundingMode: { type: String, default: 'none' },

  // 4. Core Data Arrays (Stored as Mixed JSON to allow deep nesting)
  flights: [{ type: mongoose.Schema.Types.Mixed }],
  travelers: [{ type: mongoose.Schema.Types.Mixed }],
  agentTravelers: [{ type: mongoose.Schema.Types.Mixed }],
  routingData: { type: mongoose.Schema.Types.Mixed },
  dayWiseActivities: [{ type: mongoose.Schema.Types.Mixed }],

  // 5. Financials
  markupPercentage: { type: Number, default: 0 },
  taxPercentage: { type: Number, default: 0 },
  agentMargin: { type: Number, default: 0 },
  finalSellPrice: { type: Number },
  pricingMatrix: { type: mongoose.Schema.Types.Mixed }, // The Smart Costing Grid

  // 6. Dates & Inventory
  seasonStartDate: { type: String },
  seasonEndDate: { type: String },
  simulationDate: { type: String },
  isFixedDeparture: { type: Boolean, default: false },
  fixedDepartures: [{ type: mongoose.Schema.Types.Mixed }],
  useFixedPrice: { type: Boolean, default: false },
  selectedDepartureId: { type: String },

  // 7. Operations & CRM
  bookingStatus: { type: String, default: 'quote' }, // quote, confirmed, cancelled, completed
  leadGuestName: { type: String, default: '' },
  assignedAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adultCount: { type: Number },
  childCount: { type: Number },
  operations: { type: mongoose.Schema.Types.Mixed },

  // 8. Workflow & Stepper
  status: { type: String, default: 'draft' }, // draft, pending_costing, approved, reedit_requested, active, archived
  stepperStatus: { type: mongoose.Schema.Types.Mixed },
  adminComment: { type: String },
  reEditReason: { type: String },

  // 9. Version Control & Auditing
  currentVersion: { type: String, default: '1.0' },
  auditLog: [{ type: mongoose.Schema.Types.Mixed }],


  // 🌟 10. NEW: Crisis Management (Duty of Care)
  crisisManagement: {
    safetyStatus: { 
      type: String, 
      enum: ['none', 'suspended', 'safe', 'sos', 'evacuated'], 
      default: 'none' 
    },
    lastPingedAt: { type: Date },
    emergencyNotes: { type: String, default: '' }
  }

}, { timestamps: true });

// Prevent Mongoose from recompiling the model if it already exists
const Itinerary = mongoose.models.Itinerary || mongoose.model("Itinerary", ItinerarySchema);
export default Itinerary;


