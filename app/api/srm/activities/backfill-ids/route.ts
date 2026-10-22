// app/api/srm/activities/backfill-ids/route.ts   (NEW FILE, TEMPORARY: delete after running once)
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbconnect";
import Activity from "@/app/models/Activity";
import { formatActivityId, getNextActivityNumber } from "@/app/lib/activityId";

export async function POST() {
  await dbConnect();
  try {
    // Activities with no ID, oldest first so the numbering follows creation order
    const missing = await Activity.find({
      $or: [{ activityId: { $exists: false } }, { activityId: null }, { activityId: "" }],
    }).sort({ createdAt: 1 }).select("_id");

    let next = await getNextActivityNumber();
    for (const doc of missing) {
      await Activity.updateOne({ _id: doc._id }, { $set: { activityId: formatActivityId(next++) } });
    }
    return NextResponse.json({ success: true, updated: missing.length });
  } catch (error) {
    console.error("Backfill error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}