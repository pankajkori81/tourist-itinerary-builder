import mongoose, { Document, Model } from "mongoose";

export interface ILocation extends Document {
  name: string;             
  type: "country" | "city" | "airport"; 
  countryName: string;      
  countryCode?: string;     
  stateName?: string;       
  airportCode?: string;     
  latitude?: number;
  longitude?: number;
}

const LocationSchema = new mongoose.Schema<ILocation>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["country", "city", "airport"], required: true },
    countryName: { type: String, required: true },
    countryCode: { type: String },
    stateName: { type: String },
    airportCode: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { timestamps: true }
);

// Indexes are critical here. They make searching 150,000+ records lightning fast.
LocationSchema.index({ name: 1 });
LocationSchema.index({ type: 1 });
LocationSchema.index({ countryName: 1 });

const Location: Model<ILocation> =
  mongoose.models.Location || mongoose.model<ILocation>("Location", LocationSchema);

export default Location;