import mongoose from "mongoose";

const SupplierDocSchema = new mongoose.Schema({
  name: String,
  url: String, // Will hold Base64 string
  type: { type: String, enum: ['general', 'trip'] },
  tripRef: String,
  expiryDate: String
});

const BankDetailsSchema = new mongoose.Schema({
  bankName: String,
  accountNumber: String,
  ifscCode: String,
  accountName: String,
});

const SupplierSchema = new mongoose.Schema({
  supplierId: { type: String, required: true },
  name: { type: String, required: true },
  type: String,
  services: [{ type: String }], // e.g. ["Transport", "Activity"]
  logoUrl: String,
  isPreferred: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  documents: [SupplierDocSchema],
  contactPerson: String,
  phone: String,
  email: String,
  website: String,
  city: String,
  country: String,
  address: String,
  state: String,
  zipCode: String,
  paymentTerms: { type: String, enum: ['Prepaid', 'Pay at Hotel', 'Credit-7', 'Credit-15', 'Credit-30'] },
  currency: { type: String, default: 'USD' },
  taxRegistered: { type: Boolean, default: false },
  taxNumber: String,
  bankDetails: BankDetailsSchema,
  status: { type: String, enum: ['Active', 'Inactive', 'Blacklisted'], default: 'Active' },
}, { timestamps: true });

const Supplier = mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema);
export default Supplier;