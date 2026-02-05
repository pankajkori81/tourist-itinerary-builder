// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";
// import { cookies } from "next/headers";
// import bcrypt from "bcryptjs";
// import dbConnect from "@/app/lib/dbconnect";
// import User from "@/app/models/User";

// const SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

// export const POST = async (req: NextRequest) => {
//   await dbConnect();
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
//     if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

//     const { payload } = await jwtVerify(token, SECRET);
//     const { currentPassword, newPassword } = await req.json();

//     // 1. Get User including password
//     const user = await User.findById(payload.userId);
//     if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

//     // 2. Verify Old Password
//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//         return NextResponse.json({ success: false, message: "Incorrect current password" }, { status: 400 });
//     }

//     // 3. Hash & Save New Password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     return NextResponse.json({ success: true, message: "Password updated successfully" });

//   } catch (error) {
//     console.error("Password Change Error:", error);
//     return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
//   }
// }; 







import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/lib/dbconnect";
import User from "@/app/models/User";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export const POST = async (req: NextRequest) => {
  await dbConnect();

  try {
    // 1. Authentication Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET);
    const { currentPassword, newPassword } = await req.json();

    // 2. Input Validation (From your older code)
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "New password must be at least 6 characters", success: false },
        { status: 400 }
      );
    }

    // 3. Find User
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 4. Verify Current Password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect current password", success: false },
        { status: 400 }
      );
    }

    // 5. Prevent Reusing the Same Password (From your older code)
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        { message: "New password must be different from the old one", success: false },
        { status: 400 }
      );
    }

    // 6. Hash & Save New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: "Password updated successfully" 
    });

  } catch (error) {
    console.error("Password Change Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
};

