import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import dbConnect from "@/app/lib/dbconnect";
import Client from "@/app/models/Client";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

// Helper to get logged-in user securely
async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload; // Returns { userId, role }
  } catch (error) {
    return null;
  }
}

// 1. GET: Fetch all Clients (or one specific Client by ID)
export const GET = async (req: NextRequest) => {
  await dbConnect();
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Security: Agents only see their own clients
    let query: any = {};
    if (user.role === 'agent') query.agentId = user.userId;

    if (id) {
        query._id = id;
        const client = await Client.findOne(query);
        if (!client) return NextResponse.json({ success: false, message: "Client not found" }, { status: 404 });
        return NextResponse.json({ success: true, data: client });
    }

    // Return all clients sorted by newest first
    const clients = await Client.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: clients });

  } catch (error) {
    console.error("GET Clients Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};

// 2. POST: Create a new Client
export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ success: false, message: "Client name is required" }, { status: 400 });
    }

    const newClient = await Client.create({
        ...body,
        agentId: user.userId 
    });

    return NextResponse.json({ success: true, data: newClient });

  } catch (error) {
    console.error("POST Client Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};

// 3. PUT: Update an existing Client (Preferences, Tags, Lifetime Value)
export const PUT = async (req: NextRequest) => {
    await dbConnect();
    try {
        const user = await getUser();
        if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { clientId, ...updateData } = body; 
        
        if (!clientId) {
            return NextResponse.json({ success: false, message: "Client ID is required" }, { status: 400 });
        }

        const query: any = { _id: clientId };
        if (user.role === 'agent') query.agentId = user.userId; 

        const updatedClient = await Client.findOneAndUpdate(query, updateData, { new: true });
        if (!updatedClient) return NextResponse.json({ success: false, message: "Client not found or unauthorized" }, { status: 404 });

        return NextResponse.json({ success: true, data: updatedClient });

    } catch (error) {
        console.error("PUT Client Error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

// 4. DELETE: Remove a Client
export const DELETE = async (req: NextRequest) => {
    await dbConnect();
    try {
        const user = await getUser();
        if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { id } = body;
        
        if (!id) {
             return NextResponse.json({ success: false, message: "Client ID is required" }, { status: 400 });
        }

        const query: any = { _id: id };
        if (user.role === 'agent') query.agentId = user.userId; 

        const deletedClient = await Client.findOneAndDelete(query);
        if (!deletedClient) return NextResponse.json({ success: false, message: "Client not found or unauthorized" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Client deleted successfully" });

    } catch (error) {
        console.error("DELETE Client Error:", error);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}