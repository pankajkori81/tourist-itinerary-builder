import mongoose from "mongoose";

const CustomFieldSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Field name is required"],
    trim: true 
  },
  type: { 
    type: String, 
    enum: ["text", "dropdown", "date"], 
    required: true 
  },
  // Options are only used if the type is "dropdown" (e.g. ["Vegan", "Halal"])
  options: [{ 
    type: String, 
    trim: true 
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

const CustomField = mongoose.models.CustomField || mongoose.model("CustomField", CustomFieldSchema);
export default CustomField;