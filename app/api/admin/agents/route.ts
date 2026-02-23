import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import dbConnect from "@/app/lib/dbconnect";
import User from "@/app/models/User";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

// Helper to verify Admin access
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.role !== "admin") return null;
    return payload;
  } catch (error) {
    return null;
  }
}

// 1. GET: Fetch all agents for the Admin Dashboard
export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized Admin Access" }, { status: 403 });
    }

    // Fetch all users with role 'agent'. Exclude passwords for security.
    const agents = await User.find({ role: "agent" })
      .select("-password -verificationToken -forgotPasswordToken")
      .sort({ createdAt: -1 }) // Newest first
      .lean();

    return NextResponse.json({ success: true, data: agents });
  } catch (error) {
    console.error("Fetch Agents Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};

// 2. PUT: Update an Agent's Status (Approve / Reject / Suspend)
export const PUT = async (req: NextRequest) => {
  await dbConnect();

  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized Admin Access" }, { status: 403 });
    }

    const { agentId, status } = await req.json();

    if (!agentId || !status) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Ensure the status is one of the allowed Enums from your User Model
    const validStatuses = ["active", "inactive", "suspended", "pending", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status value" }, { status: 400 });
    }

    // Update the User in MongoDB
    const updatedAgent = await User.findByIdAndUpdate(
      agentId,
      { $set: { status: status } },
      { new: true }
    ).select("-password");

    if (!updatedAgent) {
      return NextResponse.json({ success: false, message: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Agent successfully marked as ${status}`, 
      data: updatedAgent 
    });

  } catch (error) {
    console.error("Update Agent Status Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};