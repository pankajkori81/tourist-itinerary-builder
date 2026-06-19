// models/TravelOperation.ts
import mongoose, { Schema, Document, model, models } from 'mongoose';

// 1. Interface for an individual service (The Checklist Item)
export interface IServiceBooking {
  _id?: mongoose.Types.ObjectId;
  serviceType: 'hotel' | 'flight' | 'transport' | 'activity' | 'meal';
  serviceName: string;            // e.g., "Hera Hotel"
  linkedItemId: string;           // ID from the itinerary DayPlan
  dayNumber: number;              // Which day it belongs to
  supplierId?: string;            // Links to SRM
  
  status: 'Pending' | 'Requested' | 'Waitlisted' | 'Confirmed' | 'Cancelled';
  confirmationNumber?: string;    // PNR or Hotel Booking Ref
  
  netCost: number;
  currency: string;
  paymentStatus: 'Unpaid' | 'Deposit Paid' | 'Fully Paid';
  paymentDeadline?: Date;
  
  startDate?: Date;
  internalNotes?: string;

  poStatus: 'Not Generated' | 'Generated' | 'Sent';
  supplierInvoiceAmount?: number;
  supplierEmail?: string;
  poGeneratedAt?: Date;
}

// 2. Interface for the overall Trip Operation Document
export interface ITravelOperation extends Document {
  tripId: string;
  tripName: string;
  itineraryId: string;
  opsAgentId?: string;
  overallStatus: 'Pending' | 'In Progress' | 'Fully Confirmed' | 'Documents Sent';
  services: IServiceBooking[];
  createdAt: Date;
  updatedAt: Date;
}

// 3. Mongoose Schemas
const ServiceBookingSchema = new Schema<IServiceBooking>({
  serviceType: { type: String, enum: ['hotel', 'flight', 'transport', 'activity', 'meal'], required: true },
  serviceName: { type: String, required: true },
  linkedItemId: { type: String, required: true },
  dayNumber: { type: Number, required: true },
  supplierId: { type: String },
  
  status: { type: String, enum: ['Pending', 'Requested', 'Waitlisted', 'Confirmed', 'Cancelled'], default: 'Pending' },
  confirmationNumber: { type: String, default: '' },
  
  netCost: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  paymentStatus: { type: String, enum: ['Unpaid', 'Deposit Paid', 'Fully Paid'], default: 'Unpaid' },
  paymentDeadline: { type: Date },
  
  startDate: { type: Date },
  internalNotes: { type: String, default: '' } ,
  poStatus: { type: String, enum: ['Not Generated', 'Generated', 'Sent'], default: 'Not Generated' },
  supplierInvoiceAmount: { type: Number, default: 0 },
  supplierEmail: { type: String, default: '' },
  poGeneratedAt: { type: Date }

});

const TravelOperationSchema = new Schema<ITravelOperation>({
  tripId: { type: String, required: true, unique: true },
  tripName: { type: String, required: true },
  itineraryId: { type: String, required: true },
  opsAgentId: { type: String },
  overallStatus: { type: String, enum: ['Pending', 'In Progress', 'Fully Confirmed', 'Documents Sent'], default: 'Pending' },
  services: [ServiceBookingSchema],

  
}, { timestamps: true });

export const TravelOperation = models.TravelOperation || model<ITravelOperation>('TravelOperation', TravelOperationSchema);