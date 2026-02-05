import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async () => {
  const cookieStore = await cookies();
  
  // We overwrite the cookie with empty data and an expiration date in the past
  cookieStore.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Match Login setting
    sameSite: "lax",                               // Match Login setting
    expires: new Date(0),                          // Expire immediately (Jan 1, 1970)
    path: "/",
  });

  return NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );
};