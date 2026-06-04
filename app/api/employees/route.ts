

// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import User from "@/app/models/User";

// // 1. GET: Fetch all INTERNAL Employees
// export async function GET() {
//   try {
//     if (mongoose.connection.readyState !== 1) {
//       await mongoose.connect(process.env.MONGODB_URI as string);
//     }
//     const employees = await User.find({ 
//         role: { $in: ["admin", "employee"] } 
//     }).select("-password").sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, data: employees });
//   } catch (error: any) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// // 2. POST: Create Single Employee OR Bulk Import CSV
// export async function POST(request: Request) {
//   try {
//     if (mongoose.connection.readyState !== 1) {
//       await mongoose.connect(process.env.MONGODB_URI as string);
//     }

//     const body = await request.json();

//     // 👇 NEW: BULK IMPORT LOGIC (If the frontend sends an array from a CSV)
//     if (Array.isArray(body)) {
//       // 1. Find existing emails so we don't create duplicates
//       const existingUsers = await User.find({ email: { $in: body.map(e => e.email.toLowerCase()) } });
//       const existingEmails = new Set(existingUsers.map(u => u.email.toLowerCase()));

//       // 2. Filter out duplicates and invalid rows
//       const validNewEmployees = body.filter(emp => 
//         emp.email && emp.name && !existingEmails.has(emp.email.toLowerCase())
//       );

//       if (validNewEmployees.length === 0) {
//         return NextResponse.json({ success: false, message: "No valid new employees found or all emails already exist." }, { status: 400 });
//       }

//       // 3. Hash passwords and prepare for bulk insertion
//       const salt = await bcrypt.genSalt(10);
//       const employeesToInsert = await Promise.all(validNewEmployees.map(async (emp) => {
//         // Provide a default password if the CSV didn't have one
//         const hashedPassword = await bcrypt.hash(emp.password || "Travdek@123", salt); 
//         return {
//           name: emp.name,
//           email: emp.email.toLowerCase(),
//           password: hashedPassword,
//           phone: emp.phone || "",
//           role: emp.role || "employee",
//           status: "active",
//           department: emp.department || "Unassigned",
//           position: emp.position || "",
//           employmentType: emp.employmentType || "Fulltime",
//           monthlyTarget: Number(emp.monthlyTarget) || 0,
//         };
//       }));

//       // 4. Insert all into MongoDB at once
//       await User.insertMany(employeesToInsert);
      
//       return NextResponse.json({ 
//         success: true, 
//         message: `Successfully imported ${employeesToInsert.length} employees.` 
//       }, { status: 201 });
//     }


//     // 👇 EXISTING: SINGLE EMPLOYEE CREATION LOGIC
//     const { name, email, password, role, department, position, phone, monthlyTarget, employmentType } = body;

//     if (!name || !email || !password || !role) {
//       return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = await User.create({
//       name, email, password: hashedPassword, phone, role, 
//       status: "active", department, position, 
//       employmentType: employmentType || "Fulltime", // Added employmentType
//       monthlyTarget: Number(monthlyTarget) || 0,
//     });

//     return NextResponse.json({ success: true, message: "Employee created successfully!" }, { status: 201 });
//   } catch (error: any) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// // 3. PUT: Update Employee
// export async function PUT(request: Request) {
//     try {
//       if (mongoose.connection.readyState !== 1) {
//         await mongoose.connect(process.env.MONGODB_URI as string);
//       }
      
//       const body = await request.json();
//       const { id, name, email, role, department, position, phone, monthlyTarget, status, employmentType } = body;
  
//       if (!id) return NextResponse.json({ success: false, message: "Employee ID required" }, { status: 400 });
  
//       const updateData: any = {};
//       if (name) updateData.name = name;
//       if (email) updateData.email = email;
//       if (role) updateData.role = role;
//       if (department) updateData.department = department;
//       if (position) updateData.position = position;
//       if (phone) updateData.phone = phone;
//       if (employmentType) updateData.employmentType = employmentType; // Added employmentType
//       if (monthlyTarget !== undefined) updateData.monthlyTarget = Number(monthlyTarget);
//       if (status) updateData.status = status;
  
//       const updatedUser = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select("-password");
  
//       if (!updatedUser) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  
//       return NextResponse.json({ success: true, message: "Employee updated successfully!", data: updatedUser });
//     } catch (error: any) {
//       return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     }
//   }
  
//   // 4. DELETE: Remove Employee
//   export async function DELETE(request: Request) {
//       try {
//         if (mongoose.connection.readyState !== 1) {
//           await mongoose.connect(process.env.MONGODB_URI as string);
//         }
        
//         const { searchParams } = new URL(request.url);
//         const id = searchParams.get('id');
    
//         if (!id) return NextResponse.json({ success: false, message: "Employee ID required" }, { status: 400 });
    
//         const deletedUser = await User.findByIdAndDelete(id);
    
//         if (!deletedUser) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    
//         return NextResponse.json({ success: true, message: "Employee deleted successfully!" });
//       } catch (error: any) {
//         return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//       }
//   } 
















import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import dbConnect from "@/app/lib/dbconnect"; // 👉 FIX: Imported your proper database connection helper

// 👉 FIX: This single line stops Next.js from caching the data on your live hosted website!
export const dynamic = "force-dynamic";

// 1. GET: Fetch all INTERNAL Employees
export async function GET() {
  try {
    await dbConnect(); // 👉 FIX: Replaced raw mongoose.connect with dbConnect()
    
    const employees = await User.find({ 
        role: { $in: ["admin", "employee"] } 
    }).select("-password").sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: employees });
  } catch (error: any) {
    // 👉 FIX: Standardized error format to 'message' instead of 'error'
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 2. POST: Create Single Employee OR Bulk Import CSV
export async function POST(request: Request) {
  try {
    await dbConnect(); // 👉 FIX: Replaced raw mongoose.connect

    const body = await request.json();

    // BULK IMPORT LOGIC
    if (Array.isArray(body)) {
      const existingUsers = await User.find({ email: { $in: body.map(e => e.email.toLowerCase()) } });
      const existingEmails = new Set(existingUsers.map(u => u.email.toLowerCase()));

      const validNewEmployees = body.filter(emp => 
        emp.email && emp.name && !existingEmails.has(emp.email.toLowerCase())
      );

      if (validNewEmployees.length === 0) {
        return NextResponse.json({ success: false, message: "No valid new employees found or all emails already exist." }, { status: 400 });
      }

      const salt = await bcrypt.genSalt(10);
      const employeesToInsert = await Promise.all(validNewEmployees.map(async (emp) => {
        const hashedPassword = await bcrypt.hash(emp.password || "Travdek@123", salt); 
        return {
          name: emp.name,
          email: emp.email.toLowerCase(),
          password: hashedPassword,
          phone: emp.phone || "",
          role: emp.role || "employee",
          status: "active",
          department: emp.department || "Unassigned",
          position: emp.position || "",
          employmentType: emp.employmentType || "Fulltime",
          monthlyTarget: Number(emp.monthlyTarget) || 0,
        };
      }));

      await User.insertMany(employeesToInsert);
      
      return NextResponse.json({ 
        success: true, 
        message: `Successfully imported ${employeesToInsert.length} employees.` 
      }, { status: 201 });
    }

    // SINGLE EMPLOYEE CREATION LOGIC
    const { name, email, password, role, department, position, phone, monthlyTarget, employmentType } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name, email, password: hashedPassword, phone, role, 
      status: "active", department, position, 
      employmentType: employmentType || "Fulltime",
      monthlyTarget: Number(monthlyTarget) || 0,
    });

    return NextResponse.json({ success: true, message: "Employee created successfully!" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 3. PUT: Update Employee
export async function PUT(request: Request) {
    try {
      await dbConnect(); // 👉 FIX: Replaced raw mongoose.connect
      
      const body = await request.json();
      const { id, name, email, role, department, position, phone, monthlyTarget, status, employmentType } = body;
  
      if (!id) return NextResponse.json({ success: false, message: "Employee ID required" }, { status: 400 });
  
      const updateData: any = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;
      if (department) updateData.department = department;
      if (position) updateData.position = position;
      if (phone) updateData.phone = phone;
      if (employmentType) updateData.employmentType = employmentType;
      if (monthlyTarget !== undefined) updateData.monthlyTarget = Number(monthlyTarget);
      if (status) updateData.status = status;
  
      const updatedUser = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select("-password");
  
      if (!updatedUser) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  
      return NextResponse.json({ success: true, message: "Employee updated successfully!", data: updatedUser });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }
  
  // 4. DELETE: Remove Employee
  export async function DELETE(request: Request) {
      try {
        await dbConnect(); // 👉 FIX: Replaced raw mongoose.connect
        
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
    
        if (!id) return NextResponse.json({ success: false, message: "Employee ID required" }, { status: 400 });
    
        const deletedUser = await User.findByIdAndDelete(id);
    
        if (!deletedUser) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    
        return NextResponse.json({ success: true, message: "Employee deleted successfully!" });
      } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }
  }