import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbconnect";
import Stay from "@/app/models/Stay";

export async function GET() {
  await dbConnect();
  try {
    const stays = await Stay.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: stays });
  } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const newStay = await Stay.create(body);
    return NextResponse.json({ success: true, data: newStay });
  } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const updated = await Stay.findByIdAndUpdate(body._id, body, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const id = req.nextUrl.searchParams.get("id");
    await Stay.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
}