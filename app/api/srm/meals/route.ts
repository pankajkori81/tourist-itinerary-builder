import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbconnect";
import Meal from "@/app/models/Meal";

export async function GET() {
  await dbConnect();
  try {
    const items = await Meal.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const newItem = await Meal.create(body);
    return NextResponse.json({ success: true, data: newItem });
  } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const updated = await Meal.findByIdAndUpdate(body._id, body, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const id = req.nextUrl.searchParams.get("id");
    await Meal.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
}