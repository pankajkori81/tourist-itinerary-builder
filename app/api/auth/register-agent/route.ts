import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/lib/dbconnect";
import User from "@/app/models/User";
import { AgentRegisterSchema } from "@/app/lib/validations";

export const POST = async (req: NextRequest) => {
  await dbConnect();

  try {
    const body = await req.json();

    // 1. Zod Validation using the AGENT specific schema
    const result = AgentRegisterSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0].message }, 
        { status: 400 }
      );
    }

    const { name, email, password, agencyName } = result.data;

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

    // 4. Create User with 'pending' status
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "agent",       // 👈 Explicitly set to agent
      status: "pending",   // 👈 Explicitly set to pending
      agencyName: agencyName
    });

    // 5. Success Response (Note: We do NOT generate a token here. They cannot login yet.)
    return NextResponse.json(
      { 
        success: true, 
        message: "Registration successful! Your account is pending Admin approval." 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Agent Registration Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
};