import mongoose, { Schema, Document, model, models } from 'mongoose';

// 1. TypeScript Interface for the Commission Document
export interface ICommission extends Document {
  agentId: mongoose.Types.ObjectId;
  travelOperationId: mongoose.Types.ObjectId;
  itineraryId: mongoose.Types.ObjectId;
  
  // Financial Math
  totalSalePrice: number;        // What the client paid (from Itinerary)
  totalNetCost: number;          // Sum of all service netCosts (from TravelOperation)
  grossProfit: number;           // totalSalePrice - totalNetCost
  
  // Commission Split Details
  commissionRateApplied: number; // Snapshot of the agent's rate (e.g., 80) at the time of calculation
  agentCut: number;              // grossProfit * (commissionRateApplied / 100)
  adminCut: number;              // grossProfit - agentCut
  
  // Payout Tracking
  status: 'Pending' | 'Ready for Payout' | 'Paid';
  paidAt?: Date;
  transactionRef?: string;       // Optional field for bank transfer IDs or notes
  
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schema
const CommissionSchema = new Schema<ICommission>({
  // Relational Links (ObjectIds ensure .populate() works in the API)
  agentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  travelOperationId: { 
    type: Schema.Types.ObjectId, 
    ref: 'TravelOperation', 
    required: true 
  },
  itineraryId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Itinerary', 
    required: true 
  },
  
  // Core Financials
  totalSalePrice: { 
    type: Number, 
    required: true,
    default: 0
  },
  totalNetCost: { 
    type: Number, 
    required: true,
    default: 0 
  },
  grossProfit: { 
    type: Number, 
    required: true,
    default: 0 
  },
  
  // Commission Splits
  commissionRateApplied: { 
    type: Number, 
    required: true 
  },
  agentCut: { 
    type: Number, 
    required: true 
  },
  adminCut: { 
    type: Number, 
    required: true 
  },
  
  // Status and Tracking
  status: { 
    type: String, 
    enum: ['Pending', 'Ready for Payout', 'Paid'], 
    default: 'Pending' 
  },
  paidAt: { 
    type: Date 
  },
  transactionRef: { 
    type: String 
  }
}, { 
  timestamps: true 
});

// Prevent Mongoose from recompiling the model in Next.js development mode
export const Commission = models.Commission || model<ICommission>('Commission', CommissionSchema);