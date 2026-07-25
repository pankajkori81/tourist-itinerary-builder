// ══════════════════════════════════════════════════════════════
// FILE: app/models/ShareLink.ts
// PURPOSE: Stores shareable client links for itineraries
// CONNECTS TO: Itinerary model + User model (both already exist)
// ══════════════════════════════════════════════════════════════

import mongoose from "mongoose";

const ShareLinkSchema = new mongoose.Schema(
  {
    // ── Which itinerary this link shows ──────────────────────
    // References your existing Itinerary model
    itineraryId: {
      type     : mongoose.Schema.Types.ObjectId,
      ref      : "Itinerary",
      required : [true, "Itinerary ID is required"],
    },

    // ── Unique public token (the URL key) ────────────────────
    // Example: travdek.com/view/xK9mP2qR7vN4wL1j
    // Generated automatically — never guessable
    token: {
      type     : String,
      required : true,
      unique   : true,
      index    : true,
    },

    // ── Who this link was sent to ─────────────────────────────
    // Pulled from Client model or entered manually
    clientName: {
      type    : String,
      default : "",
      trim    : true,
    },
    clientEmail: {
      type     : String,
      required : [true, "Client email is required"],
      trim     : true,
      lowercase: true,
    },
    clientPhone: {
      type    : String,
      default : "",
      trim    : true,
    },

    // ── Link expiry ───────────────────────────────────────────
    // Default: 30 days from creation
    // After this date, link shows "expired" to client
    expiresAt: {
      type     : Date,
      required : true,
    },

    // ── Current status of this share link ────────────────────
    status: {
      type    : String,
      enum    : [
        "pending",           // Sent, client not viewed yet
        "viewed",            // Client opened the link
        "approved",          // Client clicked "I Approve"
        "changes_requested", // Client requested changes
        "expired",           // Past expiry date
      ],
      default : "pending",
    },

    // ── View tracking (analytics) ─────────────────────────────
    viewCount: {
      type    : Number,
      default : 0,
    },
    firstViewedAt: {
      type    : Date,
      default : null,
    },
    lastViewedAt: {
      type    : Date,
      default : null,
    },

    // ── Client's response when they approve/request changes ───
    clientMessage: {
      type    : String,
      default : "",
      trim    : true,
    },
    // Which month client selected (from fixedDepartures pricing)
    selectedMonth: {
      type    : String,
      default : "",
    },
    // How many travelers client confirmed
    selectedPax: {
      type    : Number,
      default : null,
    },
    // When client responded
    respondedAt: {
      type    : Date,
      default : null,
    },

    // ── Admin control ─────────────────────────────────────────
    // Which admin/employee created this link
    // References your existing User model
    createdBy: {
      type : mongoose.Schema.Types.ObjectId,
      ref  : "User",
    },
    // Admin can manually deactivate a link before expiry
    isActive: {
      type    : Boolean,
      default : true,
    },
    // What email was sent (for audit trail)
    emailSentAt: {
      type    : Date,
      default : null,
    },
  },
  {
    // Adds createdAt + updatedAt automatically
    // Same pattern as your Itinerary + User models
    timestamps: true,
  }
);

// ── Indexes for fast lookups ──────────────────────────────────
// Most common query: GET /view/:token → find by token fast
ShareLinkSchema.index({ token: 1 });
// Admin listing: find all links for one itinerary
ShareLinkSchema.index({ itineraryId: 1 });
// Cleanup job: find expired links
ShareLinkSchema.index({ expiresAt: 1 });
// Admin dashboard: find links by who created them
ShareLinkSchema.index({ createdBy: 1, status: 1 });

// ── Prevent duplicate model in Next.js dev hot reload ─────────
// Same pattern as your Itinerary + User models
const ShareLink =
  mongoose.models.ShareLink ||
  mongoose.model("ShareLink", ShareLinkSchema);

export default ShareLink;