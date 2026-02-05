import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import dbConnect from "@/app/lib/dbconnect";
import User from "@/app/models/User";
import { LoginSchema } from "@/app/lib/validations" // Import Zod Schema

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export const POST = async (req: NextRequest) => {
  await dbConnect();

  try {
    const body = await req.json();

    // 1. Zod Validation (Modern Security)
    // Ensures email is valid format before touching DB
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // 2. Find User (Include status check)
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // 3. Security Check: Is account active?
    // This prevents suspended employees from logging in
    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, message: "Account is suspended or inactive. Contact Admin." },
        { status: 403 } // 403 Forbidden
      );
    }

    // 4. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // 5. Update Audit Trail (lastLogin)
    // This is crucial for tracking user activity
    user.lastLogin = new Date();
    await user.save();

    // 6. Generate JWT
    const token = await new SignJWT({ 
        userId: user._id.toString(), 
        role: user.role 
      })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(SECRET);

    // 7. Set Secure Cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400 // 1 Day
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: { 
        id: user._id, // Useful for frontend keys
        name: user.name, 
        email: user.email, 
        role: user.role,
        profilePicture: user.profilePicture 
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
};