// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import Task from "@/app/models/Task";

// export async function POST(req: Request, { params }: { params: { id: string } }) {
//   try {
//     // Ensure database is connected (Replace with your actual DB connection utility if different)
//     if (mongoose.connection.readyState === 0) {
//       await mongoose.connect(process.env.MONGODB_URI as string);
//     }

//     const { id } = params;
//     const body = await req.json();
//     const { senderId, senderName, text } = body;

//     if (!text || !senderId || !senderName) {
//       return NextResponse.json(
//         { success: false, message: "Missing required comment fields (text, senderId, senderName)." },
//         { status: 400 }
//       );
//     }

//     // Push the new comment into the array and return the updated task
//     const updatedTask = await Task.findByIdAndUpdate(
//       id,
//       {
//         $push: {
//           comments: { senderId, senderName, text, timestamp: new Date() }
//         }
//       },
//       { new: true }
//     )
//     .populate("assignedTo", "name email role")
//     .populate("assignedBy", "name email role")
//     .populate("linkedTripId", "tripName tripId");

//     if (!updatedTask) {
//        return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: updatedTask });
//   } catch (error: any) {
//     console.error("Comment Error:", error);
//     return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
//   }
// } 













import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/lib/dbconnect";
import Task from "@/app/models/Task";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();

  try {
    // ✅ Next.js 15 FIX: You MUST await params before destructuring
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const senderId = (session.user as any).id;
    const senderName = (session.user as any).name || "User";

    const body = await req.json();
    const { text } = body;

    if (!text || text.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Comment text is required." },
        { status: 400 }
      );
    }

    // Push the new comment into the array and return the updated task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: { 
            senderId, 
            senderName, 
            text: text.trim(), 
            timestamp: new Date() 
          }
        }
      },
      { new: true }
    )
      .populate("assignedTo", "name email department profilePicture")
      .populate("assignedBy", "name email")
      .populate("linkedTripId", "tripName tripId")
      .lean();

    if (!updatedTask) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedTask });
  } catch (error: any) {
    console.error("Comment Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
};