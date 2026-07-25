// // ══════════════════════════════════════════════════════════════
// // FILE: app/api/tasks/[id]/route.ts
// // PURPOSE:
// //   PUT    → Employee updates status OR admin edits any field
// //   DELETE → Admin deletes a task
// // ══════════════════════════════════════════════════════════════

// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import dbConnect from "@/app/lib/dbconnect";
// import Task from "@/app/models/Task";

// import "@/app/models/User";
// import "@/app/models/Itinerary";

// // ── PUT: Update a task ────────────────────────────────────────
// export const PUT = async (
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) => {
//   await dbConnect();

//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json(
//         { success: false, message: "Not authenticated" },
//         { status: 401 }
//       );
//     }

//     const role   = (session.user as any).role;
//     const userId = (session.user as any).id;
//     const body   = await req.json();

//     // Find the task first
//     const task = await Task.findById(params.id);
//     if (!task) {
//       return NextResponse.json(
//         { success: false, message: "Task not found" },
//         { status: 404 }
//       );
//     }

//     // ── Permission check ──────────────────────────────────────
//     // Employee can ONLY update status of tasks assigned to them
//     // Admin can update ANY field of ANY task
//     if (role === "employee") {
//       if (task.assignedTo.toString() !== userId) {
//         return NextResponse.json(
//           { success: false, message: "You can only update your own tasks" },
//           { status: 403 }
//         );
//       }
//       // Employee can only change status
//       const allowedStatus = ["pending", "in_progress", "completed"];
//       if (!allowedStatus.includes(body.status)) {
//         return NextResponse.json(
//           { success: false, message: "Invalid status value" },
//           { status: 400 }
//         );
//       }

//       // Set completedAt timestamp when marking done
//       const updateData: any = { status: body.status };
//       if (body.status === "completed") {
//         updateData.completedAt = new Date();
//       } else {
//         updateData.completedAt = null; // reset if un-completing
//       }

//       const updated = await Task.findByIdAndUpdate(
//         params.id,
//         { $set: updateData },
//         { new: true }
//       )
//         .populate("assignedTo", "name email")
//         .populate("assignedBy", "name email")
//         .lean();

//       return NextResponse.json({
//         success : true,
//         message : "Task status updated",
//         data    : updated,
//       });
//     }

//     // ── Admin: can update any field ───────────────────────────
//     if (role === "admin") {
//       const updateData: any = {};

//       if (body.title)        updateData.title       = body.title.trim();
//       if (body.description !== undefined)
//                              updateData.description = body.description.trim();
//       if (body.priority)     updateData.priority    = body.priority;
//       if (body.status)       updateData.status      = body.status;
//       if (body.deadline)     updateData.deadline    = new Date(body.deadline);
//       if (body.category)     updateData.category    = body.category;
//       if (body.assignedTo)   updateData.assignedTo  = body.assignedTo;
//       if (body.linkedTripId !== undefined)
//                              updateData.linkedTripId = body.linkedTripId || null;

//       const updated = await Task.findByIdAndUpdate(
//         params.id,
//         { $set: updateData },
//         { new: true }
//       )
//         .populate("assignedTo", "name email department profilePicture")
//         .populate("assignedBy", "name email")
//         .populate("linkedTripId", "tripName tripId")
//         .lean();

//       return NextResponse.json({
//         success : true,
//         message : "Task updated successfully",
//         data    : updated,
//       });
//     }

//     return NextResponse.json(
//       { success: false, message: "Unauthorized" },
//       { status: 403 }
//     );

//   } catch (error) {
//     console.error("Task PUT Error:", error);
//     return NextResponse.json(
//       { success: false, message: "Server Error" },
//       { status: 500 }
//     );
//   }
// };

// // ── DELETE: Admin removes a task ──────────────────────────────
// export const DELETE = async (
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) => {
//   await dbConnect();

//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json(
//         { success: false, message: "Not authenticated" },
//         { status: 401 }
//       );
//     }

//     const role = (session.user as any).role;

//     // Only admin can delete tasks
//     if (role !== "admin") {
//       return NextResponse.json(
//         { success: false, message: "Only admins can delete tasks" },
//         { status: 403 }
//       );
//     }

//     const deleted = await Task.findByIdAndDelete(params.id);
//     if (!deleted) {
//       return NextResponse.json(
//         { success: false, message: "Task not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success : true,
//       message : "Task deleted successfully",
//     });

//   } catch (error) {
//     console.error("Task DELETE Error:", error);
//     return NextResponse.json(
//       { success: false, message: "Server Error" },
//       { status: 500 }
//     );
//   }
// };


















// ══════════════════════════════════════════════════════════════
// FILE: app/api/tasks/[id]/route.ts
// FIX: params now awaited (Next.js 15 requirement)
// ══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/lib/dbconnect";
import Task from "@/app/models/Task";

import "@/app/models/User";
import "@/app/models/Itinerary";

// ── PUT: Update a task ────────────────────────────────────────
export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();

  try {
    // ✅ Await params first — Next.js 15 requirement
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const role   = (session.user as any).role;
    const userId = (session.user as any).id;
    const body   = await req.json();

    // Find the task first
    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    // ── Employee: can only update status of OWN tasks ─────────
    if (role === "employee") {
      if (task.assignedTo.toString() !== userId) {
        return NextResponse.json(
          { success: false, message: "You can only update your own tasks" },
          { status: 403 }
        );
      }

      const allowedStatus = ["pending", "in_progress", "completed"];
      if (!allowedStatus.includes(body.status)) {
        return NextResponse.json(
          { success: false, message: "Invalid status value" },
          { status: 400 }
        );
      }

      const updateData: any = { status: body.status };

      // Record completedAt timestamp
      if (body.status === "completed") {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }

      const updated = await Task.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      )
        .populate("assignedTo", "name email")
        .populate("assignedBy", "name email")
        .lean();

      return NextResponse.json({
        success : true,
        message : "Task status updated",
        data    : updated,
      });
    }

    // ── Admin: can update any field ───────────────────────────
    if (role === "admin") {
      const updateData: any = {};

      if (body.title !== undefined)
        updateData.title       = body.title.trim();
      if (body.description !== undefined)
        updateData.description = body.description.trim();
      if (body.priority)
        updateData.priority    = body.priority;
      if (body.status) {
        updateData.status      = body.status;
        if (body.status === "completed") {
          updateData.completedAt = new Date();
        }
      }
      if (body.deadline)
        updateData.deadline    = new Date(body.deadline);
      if (body.category)
        updateData.category    = body.category;
      if (body.assignedTo)
        updateData.assignedTo  = body.assignedTo;
      if (body.linkedTripId !== undefined)
        updateData.linkedTripId = body.linkedTripId || null;

      const updated = await Task.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      )
        .populate("assignedTo", "name email department profilePicture")
        .populate("assignedBy", "name email")
        .populate("linkedTripId", "tripName tripId")
        .lean();

      return NextResponse.json({
        success : true,
        message : "Task updated successfully",
        data    : updated,
      });
    }

    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );

  } catch (error) {
    console.error("Task PUT Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
};

// ── DELETE: Admin removes a task ──────────────────────────────
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await dbConnect();

  try {
    // ✅ Await params first — Next.js 15 requirement
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const role = (session.user as any).role;

    if (role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admins can delete tasks" },
        { status: 403 }
      );
    }

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success : true,
      message : "Task deleted successfully",
    });

  } catch (error) {
    console.error("Task DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
};






