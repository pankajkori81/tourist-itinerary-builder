import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import dbConnect from "@/app/lib/dbconnect";
import Lead from "@/app/models/Lead";
import { LeadSchema } from "@/app/lib/validations";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

// Helper to get logged-in user
async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload; // { userId, role }
  } catch (error) {
    return null;
  }
}

// 1. GET: Fetch Leads based on Role
export const GET = async (req: NextRequest) => {
  await dbConnect();
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    let query = {};
    // SECURITY: If user is an agent, ONLY return their own leads!
    if (user.role === 'agent') {
        query = { agentId: user.userId };
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: leads });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};

// 2. POST: Create a new Lead
export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = LeadSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 });
    }

    const newLead = await Lead.create({
        ...parsed.data,
        agentId: user.userId // Stamp the Lead with the logged-in User's ID
    });

    return NextResponse.json({ success: true, data: newLead });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};

// 3. PUT: Update Lead Status (e.g., New -> Contacted)
export const PUT = async (req: NextRequest) => {
    await dbConnect();
    try {
        const user = await getUser();
        if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const { leadId, status } = await req.json();
        
        // Find and ensure ownership before updating
        const query: any = { _id: leadId };
        if (user.role === 'agent') query.agentId = user.userId; 

        const updatedLead = await Lead.findOneAndUpdate(query, { status }, { new: true });
        if (!updatedLead) return NextResponse.json({ success: false, message: "Lead not found or unauthorized" }, { status: 404 });

        return NextResponse.json({ success: true, data: updatedLead });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}