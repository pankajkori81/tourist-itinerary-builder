// ══════════════════════════════════════════════════════════════
// FILE: app/api/tasks/route.ts
// PURPOSE:
//   GET  → Employee fetches their own assigned tasks
//   POST → Admin creates + assigns a task to an employee
// ══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/app/lib/dbconnect";
import Task from "@/app/models/Task";

// Import refs so Mongoose can populate them
import "@/app/models/User";
import "@/app/models/Itinerary";

// ── GET: Employee fetches their own tasks ─────────────────────
export const GET = async (req: NextRequest) => {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const role   = (session.user as any).role;

    // Admin can get ALL tasks, employee gets only their own
    const filter = role === "admin"
      ? {}                         // admin sees everything
      : { assignedTo: userId };    // employee sees only theirs

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email department profilePicture")
      .populate("assignedBy", "name email")
      .populate("linkedTripId", "tripName tripId selectedCountries")
      .sort({ deadline: 1 }) // soonest deadline first
      .lean();

    // ── Auto-mark overdue tasks ───────────────────────────────
    // If deadline passed and not completed → mark as overdue
    const now     = new Date();
    const updated = tasks.map((t: any) => {
      if (
        t.status !== "completed" &&
        t.status !== "overdue" &&
        new Date(t.deadline) < now
      ) {
        // Fire-and-forget update (don't await to keep response fast)
        Task.findByIdAndUpdate(t._id, { status: "overdue" }).exec();
        return { ...t, status: "overdue" };
      }
      return t;
    });

    return NextResponse.json({ success: true, data: updated });

  } catch (error) {
    console.error("Tasks GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
};

// ── POST: Admin creates + assigns a new task ──────────────────
export const POST = async (req: NextRequest) => {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const role = (session.user as any).role;

    // Only admin can create tasks
    if (role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admins can assign tasks" },
        { status: 403 }
      );
    }

    const adminId = (session.user as any).id;
    const body    = await req.json();

    // ── Validate required fields ──────────────────────────────
    if (!body.title || !body.assignedTo || !body.deadline) {
      return NextResponse.json(
        { success: false, message: "Title, assignedTo, and deadline are required" },
        { status: 400 }
      );
    }

    // ── Create the task ───────────────────────────────────────
    const task = await Task.create({
      title        : body.title.trim(),
      description  : body.description?.trim() || "",
      assignedTo   : body.assignedTo,
      assignedBy   : adminId,              // auto-set from session
      priority     : body.priority     || "medium",
      category     : body.category     || "other",
      deadline     : new Date(body.deadline),
      linkedTripId : body.linkedTripId || null,
      status       : "pending",            // always starts as pending
    });

    // Return populated task for immediate UI update
    const populated = await Task.findById(task._id)
      .populate("assignedTo", "name email department profilePicture")
      .populate("assignedBy", "name email")
      .populate("linkedTripId", "tripName tripId")
      .lean();

    return NextResponse.json(
      { success: true, message: "Task assigned successfully", data: populated },
      { status: 201 }
    );

  } catch (error) {
    console.error("Tasks POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
};