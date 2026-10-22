// app/lib/activityId.ts   (NEW FILE)
import Activity from "@/app/models/Activity";

export const ACTIVITY_ID_PREFIX = "Act_";   // change the style here only
const PAD = 4;                              // Act_0001
const ID_REGEX = new RegExp(`^${ACTIVITY_ID_PREFIX}(\\d+)$`, "i");

export const formatActivityId = (n: number) =>
  `${ACTIVITY_ID_PREFIX}${String(n).padStart(PAD, "0")}`;

// Highest existing number + 1 (ignores IDs that do not follow the Act_#### style)
export async function getNextActivityNumber(): Promise<number> {
  const docs = await Activity.find(
    { activityId: { $exists: true, $ne: null } },
    { activityId: 1, _id: 0 }
  ).lean();

  let max = 0;
  for (const d of docs as any[]) {
    const m = ID_REGEX.exec(d.activityId || "");
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return max + 1;
}

// Creates an activity and guarantees it gets an ID
export async function createActivityWithId(body: any) {
  const supplied = (body.activityId ?? "").toString().trim();

  // File/client gave an ID -> keep it. A duplicate throws E11000 (route returns 409).
  if (supplied) {
    body.activityId = supplied;
    return Activity.create(body);
  }

  // No ID -> generate the next one. Retry if two saves picked the same number at once.
  delete body.activityId;                      // never store '' / null
  for (let attempt = 0; attempt < 5; attempt++) {
    body.activityId = formatActivityId(await getNextActivityNumber());
    try {
      return await Activity.create(body);
    } catch (err: any) {
      if (err?.code === 11000 && err?.keyPattern?.activityId) continue; // taken, try the next number
      throw err;
    }
  }
  throw new Error("Could not allocate a unique Activity ID");
}



export const activityFilter = (id: string) =>
  /^[a-f\d]{24}$/i.test(id) ? { _id: id } : { activityId: id };