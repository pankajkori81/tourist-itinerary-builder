import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import dbConnect from "@/app/lib/dbconnect";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

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


// 2. PUT: Update an Agent's Status (Approve / Reject / Suspend) & Set Terms
// export const PUT = async (req: NextRequest) => {
//   await dbConnect();

//   try {
//     const isAdmin = await verifyAdmin();
//     if (!isAdmin) {
//       return NextResponse.json({ success: false, message: "Unauthorized Admin Access" }, { status: 403 });
//     }

//     // 👇 CHANGED: Extract the new fields
//     const { agentId, status, commissionRate, internalNotes } = await req.json();

//     if (!agentId || !status) {
//       return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
//     }

//     const validStatuses = ["active", "inactive", "suspended", "pending", "rejected"];
//     if (!validStatuses.includes(status)) {
//       return NextResponse.json({ success: false, message: "Invalid status value" }, { status: 400 });
//     }

//     // 👇 CHANGED: Build dynamic update object
//     const updateData: any = { status: status };
    
//     if (status === 'active') {
//         if (commissionRate !== undefined) updateData.commissionRate = Number(commissionRate);
//         if (internalNotes !== undefined) updateData.internalNotes = internalNotes;
//     }

//     // 👇 CHANGED: Pass updateData to $set
//     const updatedAgent = await User.findByIdAndUpdate(
//       agentId,
//       { $set: updateData },
//       { new: true }
//     ).select("-password");

//     if (!updatedAgent) {
//       return NextResponse.json({ success: false, message: "Agent not found" }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       success: true, 
//       message: `Agent successfully marked as ${status}`, 
//       data: updatedAgent 
//     });

//   } catch (error) {
//     console.error("Update Agent Status Error:", error);
//     return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
//   }
// };




// 2. PUT: Update an Agent's Status OR Profile Details
export const PUT = async (req: NextRequest) => {
  await dbConnect();

  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized Admin Access" }, { status: 403 });
    }

    const { agentId, status, commissionRate, internalNotes, name, agencyName } = await req.json();

    if (!agentId) {
      return NextResponse.json({ success: false, message: "Missing agent ID" }, { status: 400 });
    }

    const updateData: any = {};

    // Logic 1: If updating status/financials (from Approval modal)
    if (status) {
        const validStatuses = ["active", "inactive", "suspended", "pending", "rejected"];
        if (!validStatuses.includes(status)) {
          return NextResponse.json({ success: false, message: "Invalid status value" }, { status: 400 });
        }
        updateData.status = status;
        if (status === 'active') {
            if (commissionRate !== undefined) updateData.commissionRate = Number(commissionRate);
            if (internalNotes !== undefined) updateData.internalNotes = internalNotes;
        }
    }

    // Logic 2: If updating profile details (from Edit Profile drawer)
    if (name) updateData.name = name;
    if (agencyName !== undefined) updateData.agencyName = agencyName;

    const updatedAgent = await User.findByIdAndUpdate(
      agentId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedAgent) {
      return NextResponse.json({ success: false, message: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Updated successfully", data: updatedAgent });

  } catch (error) {
    console.error("Update Agent Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};


export const POST = async (req: NextRequest) => {
  await dbConnect();

  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized Admin Access" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, agencyName, commissionRate } = body;

    // Basic Validation
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 });
    }

    // Check if email already exists in the system
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ success: false, message: "Email is already registered" }, { status: 409 });
    }

    // Hash the temporary password you give them
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the User directly as an ACTIVE AGENT
    const newAgent = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "agent",       // Directly set to agent
      status: "active",    // Directly set to active (bypassing pending)
      agencyName: agencyName || "Independent",
      commissionRate: Number(commissionRate) || 70, // Default to 70% if empty
    });

    // Remove password from response for security
    const agentData = newAgent.toObject();
    delete agentData.password;

    return NextResponse.json({ 
      success: true, 
      message: "Advisor created successfully", 
      data: agentData 
    }, { status: 201 });

  } catch (error) {
    console.error("Create Agent Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};