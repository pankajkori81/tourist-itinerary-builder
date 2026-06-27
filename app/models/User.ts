
// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: [true, "Name is required"],
//     trim: true, 
//     minlength: [2, "Name must be at least 2 characters"]
//   },
//   email: { 
//     type: String, 
//     required: [true, "Email is required"], 
//     unique: true,
//     trim: true,
//     lowercase: true, 
//     match: [
//       /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
//       "Please enter a valid email address"
//     ]
//   },
//   password: { 
//     type: String, 
//     required: [true, "Password is required"],
//   },
//   // 👇 UPDATE: Added 'agent' to enum
//   role: { 
//     type: String, 
//     enum: ["admin", "employee", "agent"], 
//     default: "employee" 
//   },
//   // 👇 UPDATE: Added 'pending' to enum for the approval flow
//   status: { 
//     type: String, 
//     enum: ["active", "inactive", "suspended", "pending"], 
//     default: "active" 
//   },
  
//   // =========================================================
//   // 👇 UPDATED SECTION: Dynamic Profile Fields
//   // =========================================================
  
//   // 1. Personal Information
//   profilePicture: { type: String, default: "" }, 
//   phone: { type: String, default: "" }, 
//   address: { type: String, default: "" }, 

//   // 2. Professional Information
//   department: { type: String, default: "" }, 
//   position: { type: String, default: "" },   
//   dateOfJoining: { type: Date, default: Date.now },
//     // 👇 NEW FIELD: Specific for Travel Agents
//   agencyName: { type: String, default: "" },

//   // 👇 NEW: Financial & Targets for Employees/Agents
//   monthlyTarget: { type: Number, default: 0 },
//   commissionRate: { type: Number, default: 0 },



//   // =========================================================

//   // Security Fields
//   isVerified: { type: Boolean, default: false }, 
//   verificationToken: String,
//   verificationTokenExpiry: Date,
  
//   forgotPasswordToken: String,
//   forgotPasswordTokenExpiry: Date,
  
//   lastLogin: { type: Date, default: null }, 
// }, 
// { 
//   timestamps: true 
// });

// // Prevent model overwrite in Next.js development mode
// const User = mongoose.models.User || mongoose.model("User", UserSchema);
// export default User;













import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"],
    trim: true, 
    minlength: [2, "Name must be at least 2 characters"]
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    trim: true,
    lowercase: true, 
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
      "Please enter a valid email address"
    ]
  },
  password: { 
    type: String, 
    required: [true, "Password is required"],
  },
  role: { 
    type: String, 
    enum: ["admin", "employee", "agent"], 
    default: "employee" 
  },
  status: { 
    type: String, 
    enum: ["active", "inactive", "suspended", "pending", "rejected"], 
    default: "active" 
  },
  
  // 1. Personal Information
  profilePicture: { type: String, default: "" }, 
  phone: { type: String, default: "" }, 
  address: { type: String, default: "" }, 

  // 2. Professional Information
  department: { type: String, default: "" }, 
  position: { type: String, default: "" },   
  dateOfJoining: { type: Date, default: Date.now },
  agencyName: { type: String, default: "" },
  internalNotes: { type: String, default: "" },

  // 👇 NEW FIELD: Employment Type (Needed for the new UI Cards)
  employmentType: { 
    type: String, 
    enum: ["Fulltime", "Contract", "Part-time"], 
    default: "Fulltime" 
  },

  // 3. Financial & Targets for Employees/Agents
  monthlyTarget: { type: Number, default: 0 },
  commissionRate: { type: Number, default: 0 },

  // 4. Security Fields
  isVerified: { type: Boolean, default: false }, 
  verificationToken: String,
  verificationTokenExpiry: Date,
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  lastLogin: { type: Date, default: null }, 
}, 
{ 
  timestamps: true 
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;