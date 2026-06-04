import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import dbConnect from "@/app/lib/dbconnect";
import CustomField from "@/app/models/CustomField";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

// 1. GET: Fetch all active custom fields to display in the UI
export const GET = async () => {
  await dbConnect();
  try {
    // We only fetch active fields, sorted by when they were created
    const fields = await CustomField.find({ isActive: true }).sort({ createdAt: 1 }).lean();
    return NextResponse.json({ success: true, data: fields });
  } catch (error) {
    console.error("Fetch Custom Fields Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};

// 2. POST: Create a new custom field (e.g., adding a "Dietary Needs" dropdown)
export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    await jwtVerify(token, SECRET);

    const body = await req.json();
    const { name, type, options } = body;

    // Validation
    if (!name || !type) {
      return NextResponse.json({ success: false, message: "Name and type are required" }, { status: 400 });
    }

    // Save to Database
    const newField = await CustomField.create({
      name,
      type,
      // Only save options if the type is a dropdown
      options: type === "dropdown" ? options : [] 
    });

    return NextResponse.json({ success: true, data: newField }, { status: 201 });
  } catch (error) {
    console.error("Create Custom Field Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};

// 3. DELETE: Remove a custom field
export const DELETE = async (req: NextRequest) => {
  await dbConnect();
  try {
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    await jwtVerify(token, SECRET);

    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ success: false, message: "Field ID is required" }, { status: 400 });

    await CustomField.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Field deleted successfully" });
  } catch (error) {
    console.error("Delete Custom Field Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
};