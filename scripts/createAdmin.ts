import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

// 1. Load your environment variables
dotenv.config({ path: ".env.local" });

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error("❌ Error: MONGODB_URL is not defined in .env.local");
  process.exit(1);
}

// 2. Define a simple User model for this script
// (We redefine it here to avoid issues with Next.js imports in standalone scripts)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "employee" },
  status: { type: String, default: "active" },
});

// Use existing model or create new one
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const createAdmin = async () => {
  try {
    // 3. Connect to Database
    await mongoose.connect(MONGODB_URL);
    console.log("✅ Connected to MongoDB");

    // --- CONFIGURATION ---
    const adminName = "Super Admin";
    const adminEmail = "admin@travdek.com";
    const adminPass = "admin123"; // Initial password
    // ---------------------

    // 4. Check if Admin already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      console.log(`⚠️ User ${adminEmail} already exists.`);
      
      // Optional: Force update their role to admin if they exist
      existingUser.role = "admin";
      await existingUser.save();
      console.log("🔄 Updated existing user to Admin role.");
      process.exit(0);
    }

    // 5. Hash the password
    const hashedPassword = await bcrypt.hash(adminPass, 10);

    // 6. Create the Admin
    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin", // <--- THE SECURITY KEY
      status: "active"
    });

    console.log("\n🎉 Success! Admin Account Created.");
    console.log("-----------------------------------");
    console.log(`📧 Email:    ${adminEmail}`);
    console.log(`🔑 Password: ${adminPass}`);
    console.log("-----------------------------------");
    console.log("👉 You can now login at /auth/login");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();