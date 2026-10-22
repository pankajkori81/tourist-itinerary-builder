// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/app/lib/dbconnect";
// import Activity from "@/app/models/Activity";

// export async function GET() {
//   await dbConnect();
//   try {
//     const items = await Activity.find({}).sort({ createdAt: -1 });
//     return NextResponse.json({ success: true, data: items });
//   } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
// }

// export async function POST(req: NextRequest) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const newItem = await Activity.create(body);
//     return NextResponse.json({ success: true, data: newItem });
//   } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
// }

// export async function PUT(req: NextRequest) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const updated = await Activity.findByIdAndUpdate(body._id, body, { new: true });
//     return NextResponse.json({ success: true, data: updated });
//   } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
// }

// export async function DELETE(req: NextRequest) {
//   await dbConnect();
//   try {
//     const id = req.nextUrl.searchParams.get("id");
//     await Activity.findByIdAndDelete(id);
//     return NextResponse.json({ success: true });
//   } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
// }




import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbconnect";
import Activity from "@/app/models/Activity";

// import { createActivityWithId } from "@/app/lib/activityId";
import { createActivityWithId, activityFilter } from "@/app/lib/activityId";

export async function GET() {
  await dbConnect();
  try {
    const items = await Activity.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) { 
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 }); 
  }
}

// export async function POST(req: NextRequest) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const newItem = await Activity.create(body);
//     return NextResponse.json({ success: true, data: newItem });
//   } catch (error: any) { 
//     console.error("POST Error:", error); // <-- This will print the exact issue in your terminal
//     return NextResponse.json({ success: false, message: error.message, error }, { status: 500 }); 
//   }
// }


// app/api/srm/activities/route.ts  →  REPLACE your existing POST function with this

// export async function POST(req: NextRequest) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const newItem = await createActivityWithId(body);   // ✅ was: Activity.create(body). Now assigns Act_####

//     return NextResponse.json({ success: true, data: newItem });
//   } catch (error: any) {
//     // ✅ NEW: duplicate Activity ID (unique index) -> clear 409 instead of a generic 500
//     if (error?.code === 11000) {
//       return NextResponse.json(
//         { success: false, message: "Activity ID already exists" },
//         { status: 409 }
//       );
//     }

//     console.error("POST Error:", error);   // prints the exact issue in your terminal (kept from your version)
//     return NextResponse.json({ success: false, message: error.message, error }, { status: 500 });
//   }
// }

// app/api/srm/activities/route.ts  →  REPLACE your existing POST function
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    
    // 🌟 FIX 3: Enforce manual ID on the backend
    if (!body.activityId || body.activityId.trim() === '') {
      return NextResponse.json({ success: false, message: "Activity ID is strictly required." }, { status: 400 });
    }

    const newItem = await Activity.create(body);

    return NextResponse.json({ success: true, data: newItem });
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Activity ID already exists" },
        { status: 409 }
      );
    }
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, message: error.message, error }, { status: 500 });
  }
}

// export async function PUT(req: NextRequest) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     delete body.activityId; 
//     const updated = await Activity.findByIdAndUpdate(body._id || body.id, body, { new: true });
//     return NextResponse.json({ success: true, data: updated });
//   } catch (error: any) { 
//     console.error("PUT Error:", error);
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 }); 
//   }
// }

// app/api/srm/activities/route.ts  →  REPLACE your existing PUT function
// export async function PUT(req: NextRequest) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const key = String(body._id || body.id || "");
//     if (!key) return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });

//     // never write the identifiers back: the ID can't change, and _id must not be re-cast
//     const { _id, id, activityId, ...update } = body;

//     const updated = await Activity.findOneAndUpdate(activityFilter(key), update, { new: true });
//     if (!updated) return NextResponse.json({ success: false, message: "Activity not found" }, { status: 404 });

//     return NextResponse.json({ success: true, data: updated });
//   } catch (error: any) {
//     console.error("PUT Error:", error);
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }


// app/api/srm/activities/route.ts  →  REPLACE your existing PUT function
export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    
    // 🌟 FIX 1: Prioritize _id if it exists, otherwise fallback to activityId
    const key = String(body._id || body.activityId || body.id || "");
    if (!key) return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });

    // 🌟 FIX 2: DO NOT strip activityId here. We WANT it to save to the database!
    const { _id, id, ...update } = body;

    const updated = await Activity.findOneAndUpdate(activityFilter(key), update, { new: true });
    
    if (!updated) {
      return NextResponse.json({ success: false, message: "Activity not found in database" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PUT Error:", error);
    
    // 🌟 FIX 3: Catch Duplicate ID errors if someone types an ID that is already taken
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, message: "This Activity ID is already in use." }, { status: 409 });
    }
    
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// export async function DELETE(req: NextRequest) {
//   await dbConnect();
//   try {
//     const id = req.nextUrl.searchParams.get("id");
//     await Activity.findByIdAndDelete(id);
//     return NextResponse.json({ success: true });
//   } catch (error: any) { 
//     console.error("DELETE Error:", error);
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 }); 
//   }
// }


// app/api/srm/activities/route.ts  →  REPLACE your existing DELETE function
export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });

    const deleted = await Activity.findOneAndDelete(activityFilter(id));   // ✅ was: findByIdAndDelete(id)
    if (!deleted) return NextResponse.json({ success: false, message: "Activity not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}