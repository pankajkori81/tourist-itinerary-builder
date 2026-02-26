// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/app/lib/dbconnect";
// import Supplier from "@/app/models/Supplier";

// export async function GET() {
//   await dbConnect();
//   try {
//     const suppliers = await Supplier.find({}).sort({ createdAt: -1 });
//     return NextResponse.json({ success: true, data: suppliers });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: "Failed to fetch" }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const newSupplier = await Supplier.create(body);
//     return NextResponse.json({ success: true, data: newSupplier });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: "Creation failed" }, { status: 500 });
//   }
// }

// export async function PUT(req: NextRequest) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const updated = await Supplier.findByIdAndUpdate(body._id, body, { new: true });
//     return NextResponse.json({ success: true, data: updated });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
//   }
// }

// export async function DELETE(req: NextRequest) {
//   await dbConnect();
//   try {
//     const id = req.nextUrl.searchParams.get("id");
//     await Supplier.findByIdAndDelete(id);
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: "Deletion failed" }, { status: 500 });
//   }
// } 













import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbconnect";
import Supplier from "@/app/models/Supplier";

export async function GET() {
  await dbConnect();
  try {
    const suppliers = await Supplier.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: suppliers });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();

    // 👇 FIX: Auto-generate the custom supplierId before saving to MongoDB
    const count = await Supplier.countDocuments();
    const year = new Date().getFullYear();
    const paddedIndex = (count + 1).toString().padStart(3, '0');
    body.supplierId = `TD/SP/${year}/${paddedIndex}`;

    const newSupplier = await Supplier.create(body);
    return NextResponse.json({ success: true, data: newSupplier });
  } catch (error: any) {
    // 👇 FIX: Log the exact error to your VS Code terminal for easy debugging
    console.error("❌ SUPPLIER CREATION ERROR:", error.message || error);
    return NextResponse.json({ success: false, message: "Creation failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const updated = await Supplier.findByIdAndUpdate(body._id, body, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("❌ SUPPLIER UPDATE ERROR:", error.message || error);
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const id = req.nextUrl.searchParams.get("id");
    await Supplier.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Deletion failed" }, { status: 500 });
  }
}