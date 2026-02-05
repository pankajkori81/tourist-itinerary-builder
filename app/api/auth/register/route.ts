import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/lib/dbconnect";
import User from "@/app/models/User";
import { RegisterSchema } from "@/app/lib/validations"; // <--- Import Zod

export const POST = async (req: NextRequest) => {
  await dbConnect();

  try {
    const body = await req.json();

    // 1. Zod Validation (Security Layer)
    // Checks min length, email format, etc. BEFORE database check
    const result = RegisterSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0].message }, 
        { status: 400 }
      );
    }

    // Use the CLEAN, validated data
    const { name, email, password } = result.data;

    // 2. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { success: false, message: "Email already registered" }, 
        { status: 409 }
      );
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User
    // We explicitly force role to 'employee' here to prevent
    // anyone from sending role: 'admin' in the JSON body.
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "employee", // <--- Security Enforcement
      status: "active"
    });

    return NextResponse.json(
      { success: true, message: "User registered successfully" }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
};