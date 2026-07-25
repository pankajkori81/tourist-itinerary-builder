import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/lib/dbconnect";
import User from "@/app/models/User";
import bcrypt from "bcryptjs"; // Needed for the POST method to hash passwords

// Helper to verify Admin access
async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "admin") {
    return null;
  }
  
  return session.user;
}

// ==========================================
// 1. GET: Fetch all internal staff (Admins & Employees)
// ==========================================
export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized Admin Access" }, { status: 403 });
    }

    // Fetch users who are either admins or employees. Exclude passwords.
    const internalStaff = await User.find({ 
        role: { $in: ["admin", "employee"] } 
    })
      .select("-password -verificationToken -forgotPasswordToken")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: internalStaff });
    
  } catch (error) {
    console.error("Fetch Internal Staff Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};

// ==========================================
// 2. POST: Create a new internal Employee
// ==========================================
export const POST = async (req: NextRequest) => {
  await dbConnect();

  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized Admin Access" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, department, position, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ success: false, message: "Email is already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "employee", // Default to employee, but allow admin creation
      status: "active",
      department: department || "General",
      position: position || "Staff",
    });

    const empData = newEmployee.toObject();
    delete empData.password;

    return NextResponse.json({ 
      success: true, 
      message: "Employee created successfully", 
      data: empData 
    }, { status: 201 });

  } catch (error) {
    console.error("Create Employee Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};

// ==========================================
// 3. PUT: Update Employee Status or Details
// ==========================================
export const PUT = async (req: NextRequest) => {
  await dbConnect();

  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized Admin Access" }, { status: 403 });
    }

    const { employeeId, status, department, position, name, role } = await req.json();

    if (!employeeId) {
      return NextResponse.json({ success: false, message: "Missing employee ID" }, { status: 400 });
    }

    const updateData: any = {};

    if (status) updateData.status = status;
    if (name) updateData.name = name;
    if (department) updateData.department = department;
    if (position) updateData.position = position;
    if (role) updateData.role = role;

    const updatedEmployee = await User.findByIdAndUpdate(
      employeeId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedEmployee) {
      return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Updated successfully", data: updatedEmployee });

  } catch (error) {
    console.error("Update Employee Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};