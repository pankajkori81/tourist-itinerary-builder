// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";
// import { cookies } from "next/headers";
// import dbConnect from "@/app/lib/dbconnect";
// import User from "@/app/models/User";

// const SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

// export const GET = async (req: NextRequest) => {
//   await dbConnect();
  
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
//     }

//     // 1. Verify Token
//     const { payload } = await jwtVerify(token, SECRET);
    
//     // 2. Fetch User & EXCLUDE Sensitive Fields
//     // We remove password AND the new token fields we added to the schema
//     const user = await User.findById(payload.userId)
//       .select("-password -verificationToken -forgotPasswordToken") 
//       .lean();

//     if (!user) {
//       return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
//     }

//     // 3. SECURITY CHECK: Is account still active?
//     // If an admin suspended them 5 minutes ago, this blocks their access immediately.
//     if (user.status !== 'active') {
//       return NextResponse.json(
//         { success: false, message: "Account is suspended or inactive." },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json({ success: true, data: user });

//   } catch (error) {
//     return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
//   }
// }; 












// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";
// import { cookies } from "next/headers";
// import dbConnect from "@/app/lib/dbconnect";
// import User from "@/app/models/User";

// const SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

// // GET: Fetch Data
// export const GET = async (req: NextRequest) => {
//   await dbConnect();
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
//     if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

//     const { payload } = await jwtVerify(token, SECRET);
//     const user = await User.findById(payload.userId).select("-password").lean();

//     if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

//     return NextResponse.json({ success: true, data: user });
//   } catch (error) {
//     return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//   }
// };

// // PUT: Update Data (Name, Phone, etc.)
// export const PUT = async (req: NextRequest) => {
//   await dbConnect();
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
//     if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

//     const { payload } = await jwtVerify(token, SECRET);
//     const body = await req.json();

//     // 1. Find and Update
//     // We strictly control what can be updated here to prevent role escalation hack
//     const updatedUser = await User.findByIdAndUpdate(
//       payload.userId,
//       {
//         $set: {
//           name: body.name,
//           phone: body.phone,
//           address: body.address,
//           department: body.department, // Allow these
//           position: body.position
//         }
//       },
//       { new: true } // Return the NEW data
//     ).select("-password");

//     return NextResponse.json({ 
//       success: true, 
//       message: "Profile updated successfully", 
//       data: updatedUser 
//     });

//   } catch (error) {
//     console.error("Update Error:", error);
//     return NextResponse.json({ success: false, message: "Update Failed" }, { status: 500 });
//   }
// }; 

























// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";
// import { cookies } from "next/headers";
// import dbConnect from "@/app/lib/dbconnect";
// import User from "@/app/models/User";

// const SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

// // GET: Fetch User Details (Secured)
// export const GET = async (req: NextRequest) => {
//   await dbConnect();
  
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
//     }

//     const { payload } = await jwtVerify(token, SECRET);
    
//     // Select all profile fields but EXCLUDE sensitive auth tokens
//     const user = await User.findById(payload.userId)
//       .select("-password -verificationToken -forgotPasswordToken") 
//       .lean();

//     if (!user) {
//       return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: user });

//   } catch (error) {
//     return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
//   }
// };

// // PUT: Update User Details (Dynamic Update)
// export const PUT = async (req: NextRequest) => {
//   await dbConnect();

//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

//     const { payload } = await jwtVerify(token, SECRET);
//     const body = await req.json();

//     // Securely update specific fields
//     const updatedUser = await User.findByIdAndUpdate(
//       payload.userId,
//       {
//         $set: {
//           name: body.name,
//           phone: body.phone,
//           address: body.address,
//           department: body.department,
//           position: body.position,
//           // We do not allow updating email/role here for security
//         }
//       },
//       { new: true } // Return the updated document
//     ).select("-password");

//     return NextResponse.json({ 
//       success: true, 
//       message: "Profile updated successfully", 
//       data: updatedUser 
//     });

//   } catch (error) {
//     console.error("Profile Update Error:", error);
//     return NextResponse.json({ success: false, message: "Update Failed" }, { status: 500 });
//   }
// };




// // ... (Your existing GET and PUT functions are above here) ...

// // DELETE: Permanently Delete Account
// export const DELETE = async (req: NextRequest) => {
//   await dbConnect();

//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const { payload } = await jwtVerify(token, SECRET);

//     // 1. Delete the user from MongoDB
//     const deletedUser = await User.findByIdAndDelete(payload.userId);

//     if (!deletedUser) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     // 2. Prepare Response
//     const response = NextResponse.json({ 
//       success: true, 
//       message: "Account permanently deleted" 
//     });

//     // 3. Clear the Authentication Cookie (Force Logout)
//     response.cookies.set("token", "", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       expires: new Date(0), // Set expiry to past date
//       path: "/",
//     });

//     return response;

//   } catch (error) {
//     console.error("Delete Account Error:", error);
//     return NextResponse.json({ success: false, message: "Delete Failed" }, { status: 500 });
//   }
// }; 
























import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route"; // Ensure this path points to your NextAuth config
import dbConnect from "@/app/lib/dbconnect";
import User from "@/app/models/User";

// GET: Fetch User Details (Secured)
export const GET = async (req: NextRequest) => {
  await dbConnect();
  
  try {
    // 1. Let NextAuth read and verify the secure session automatically
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    // 2. Look up the user by email (Universal for both Google & Credentials login)
    const user = await User.findOne({ email: session.user.email })
      .select("-password -verificationToken -forgotPasswordToken") 
      .lean();

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found in database" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });

  } catch (error) {
    console.error("Profile GET Error:", error);
    return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
  }
};


// PUT: Update User Details (Dynamic Update)
export const PUT = async (req: NextRequest) => {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Securely update specific fields using the session email as the identifier
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          name: body.name,
          phone: body.phone,
          address: body.address,
          department: body.department,
          position: body.position,
          // We do not allow updating email/role here for security
        }
      },
      { new: true } // Return the updated document
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Profile updated successfully", 
      data: updatedUser 
    });

  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ success: false, message: "Update Failed" }, { status: 500 });
  }
};


// DELETE: Permanently Delete Account
export const DELETE = async (req: NextRequest) => {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. Delete the user from MongoDB using their session email
    const deletedUser = await User.findOneAndDelete({ email: session.user.email });

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2. Prepare Response
    // Note: We no longer manually clear cookies here! 
    // Your frontend UserContext calls `signOut()`, which wipes the NextAuth cookies automatically.
    return NextResponse.json({ 
      success: true, 
      message: "Account permanently deleted" 
    });

  } catch (error) {
    console.error("Delete Account Error:", error);
    return NextResponse.json({ success: false, message: "Delete Failed" }, { status: 500 });
  }
};