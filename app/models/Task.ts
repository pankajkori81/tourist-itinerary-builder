// ══════════════════════════════════════════════════════════════
// FILE: app/models/Task.ts
// PURPOSE: Task schema — admin assigns tasks to employees
// REFERENCES: User model (assignedTo + assignedBy)
// ══════════════════════════════════════════════════════════════

import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    // ── Core Task Info ─────────────────────────────────────────
    title: {
      type     : String,
      required : [true, "Task title is required"],
      trim     : true,
    },
    description: {
      type    : String,
      default : "",
      trim    : true,
    },

    // ── Assignment ─────────────────────────────────────────────
    // Which employee this task is assigned TO
    assignedTo: {
      type     : mongoose.Schema.Types.ObjectId,
      ref      : "User",
      required : [true, "Must assign task to an employee"],
    },
    // Which admin created/assigned this task
    assignedBy: {
      type     : mongoose.Schema.Types.ObjectId,
      ref      : "User",
      required : [true, "Assigner is required"],
    },

    // ── Priority ───────────────────────────────────────────────
    // Controls color + sort order on employee dashboard
    priority: {
      type    : String,
      enum    : ["low", "medium", "high", "urgent"],
      default : "medium",
    },

    // ── Status ─────────────────────────────────────────────────
    // Employee updates this as they work on the task
    status: {
      type    : String,
      enum    : ["pending", "in_progress", "completed", "overdue"],
      default : "pending",
    },

    // ── Deadline ───────────────────────────────────────────────
    deadline: {
      type     : Date,
      required : [true, "Deadline is required"],
    },

    // ── Category ───────────────────────────────────────────────
    // Used for icon display on the task card
    category: {
      type    : String,
      enum    : ["follow_up", "document", "client", "operations", "other"],
      default : "other",
    },

    // ── Optional: Link task to a specific trip ─────────────────
    // Pulls trip name from Itinerary for display
    linkedTripId: {
      type    : mongoose.Schema.Types.ObjectId,
      ref     : "Itinerary",
      default : null,
    },


    // ── Activity Feed / Comments (NEW) ─────────────────────────
    comments: [
      {
        senderId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "User", 
          required: true 
        },
        senderName: { 
          type: String, 
          required: true 
        },
        text: { 
          type: String, 
          required: true, 
          trim: true 
        },
        timestamp: { 
          type: Date, 
          default: Date.now 
        }
      }
    ],


    // ── Completion Tracking ────────────────────────────────────
    completedAt: {
      type    : Date,
      default : null,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// ── Index for fast lookups ────────────────────────────────────
// Most common query: "give me all tasks for this employee"
TaskSchema.index({ assignedTo: 1, status: 1 });
TaskSchema.index({ assignedBy: 1 });
TaskSchema.index({ deadline: 1 });

// ── Prevent duplicate model registration in Next.js dev ───────
const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export default Task;