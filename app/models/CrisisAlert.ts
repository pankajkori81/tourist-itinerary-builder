import mongoose from "mongoose";

const CrisisAlertSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Civil Unrest in Rome"
  description: { type: String, default: '' }, // Details of the crisis
  affectedRegions: [{ type: String, required: true }], // Array of cities/countries e.g., ["Rome", "Italy"]
  severity: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' },
  isActive: { type: Boolean, default: true }, // Turn false when the crisis is over
  declaredBy: { type: String }, // Admin name or ID who initiated the alert
}, { timestamps: true });

const CrisisAlert = mongoose.models.CrisisAlert || mongoose.model("CrisisAlert", CrisisAlertSchema);
export default CrisisAlert;