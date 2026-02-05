import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import dbConnect from "@/app/lib/dbconnect";
import User from "@/app/models/User";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    // 1. Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    
    const { payload } = await jwtVerify(token, SECRET);

    // 2. Process File
    const formData = await req.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    // 3. Save File to Disk (Local Strategy)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads/avatars");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create unique name: user-id-timestamp.jpg
    const ext = file.name.split('.').pop();
    const fileName = `user-${payload.userId}-${Date.now()}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // 4. Update User in DB
    const publicUrl = `/uploads/avatars/${fileName}`;
    
    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { profilePicture: publicUrl },
      { new: true }
    ).select("-password");

    return NextResponse.json({ 
        success: true, 
        message: "Avatar updated", 
        data: updatedUser 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
};