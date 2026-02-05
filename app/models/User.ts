// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: [true, "Name is required"],
//     trim: true, // Auto-removes extra spaces
//     minlength: [2, "Name must be at least 2 characters"]
//   },
//   email: { 
//     type: String, 
//     required: [true, "Email is required"], 
//     unique: true,
//     trim: true,
//     lowercase: true, // 'Admin@Test.com' becomes 'admin@test.com'
//     match: [
//       /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
//       "Please enter a valid email address"
//     ]
//   },
//   password: { 
//     type: String, 
//     required: [true, "Password is required"],
//     // Note: This validates the HASH length in DB, not the user input. 
//     // Input validation should happen in your API route/Zod.
//   },
//   role: { 
//     type: String, 
//     enum: ["admin", "employee"], 
//     default: "employee" 
//   },
//   status: { 
//     type: String, 
//     enum: ["active", "inactive", "suspended"], // Added 'suspended' for security
//     default: "active" 
//   },
  
//   // --- NEW FIELDS FOR ROBUSTNESS ---
//   profilePicture: { type: String, default: "" }, // UI Polish
//   phone: { type: String, default: "" }, // For potential 2FA later
  
//   // Security Fields
//   isVerified: { type: Boolean, default: false }, // Email verification status
//   verificationToken: String,
//   verificationTokenExpiry: Date,
  
//   forgotPasswordToken: String,
//   forgotPasswordTokenExpiry: Date,
  
//   lastLogin: { type: Date }, // Audit trail
// }, 
// { 
//   timestamps: true // Automatically adds 'createdAt' and 'updatedAt'
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
    enum: ["admin", "employee"], 
    default: "employee" 
  },
  status: { 
    type: String, 
    enum: ["active", "inactive", "suspended"], 
    default: "active" 
  },
  
  // =========================================================
  // 👇 UPDATED SECTION: Dynamic Profile Fields
  // =========================================================
  
  // 1. Personal Information
  profilePicture: { type: String, default: "" }, 
  phone: { type: String, default: "" }, 
  address: { type: String, default: "" }, // <--- ADDED

  // 2. Professional Information
  department: { type: String, default: "" }, // <--- ADDED
  position: { type: String, default: "" },   // <--- ADDED
  dateOfJoining: { type: Date, default: Date.now }, // <--- ADDED

  // =========================================================

  // Security Fields
  isVerified: { type: Boolean, default: false }, 
  verificationToken: String,
  verificationTokenExpiry: Date,
  
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  
  lastLogin: { type: Date, default: null }, // Updated to default null
}, 
{ 
  timestamps: true 
});

// Prevent model overwrite in Next.js development mode
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;