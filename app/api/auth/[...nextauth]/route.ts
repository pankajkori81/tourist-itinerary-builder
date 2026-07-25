// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import dbConnect from "@/app/lib/dbconnect"; // Adjust path if your dbconnect file is elsewhere
// import User from "@/app/models/User";        // Adjust path to your Mongoose User model

// const handler = NextAuth({
//   providers: [
//     // 1. Google Auth Provider
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),

//     // 2. Existing Credentials Provider (Your regular Email & Password login)
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Missing credentials");
//         }

//         await dbConnect();

//         // Find user by email
//         const user = await User.findOne({ email: credentials.email });
//         if (!user) {
//           throw new Error("No user found");
//         }

//         // TODO: Insert your password comparison logic here (e.g., bcrypt.compare)
//         // const isValid = await bcrypt.compare(credentials.password, user.password);
//         // if (!isValid) throw new Error("Wrong password");

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name,
//           role: user.role || "Agent", 
//         };
//       }
//     })
//   ],

//   callbacks: {
//     // 🚨 GOOGLE SECURITY GATEKEEPER 🚨
//     async signIn({ user, account }) {
//       if (account?.provider === "google") {
//         await dbConnect();

//         // Query MongoDB to see if this Google email is pre-approved in your system
//         const existingUser = await User.findOne({ email: user.email });

//         // If the email doesn't exist, block the sign-in completely
//         if (!existingUser) {
//           return false; // Automatically rejects them and prevents access
//         }

//         // Block suspended users
//         if (existingUser.status === "suspended") {
//           return false;
//         }
//       }
//       return true; // Allow login
//     },

//     // Save user fields like DB ID and Role into the web token
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = (user as any).role;
//       }
//       return token;
//     },

//     // Make ID and Role visible on your frontend components
//     async session({ session, token }) {
//       if (session.user) {
//         (session.user as any).id = token.id;
//         (session.user as any).role = token.role;
//       }
//       return session;
//     }
//   },

//   pages: {
//     signIn: "/login", // Use your custom login page instead of NextAuth's default layout
//     error: "/login",  // Redirect back to login if someone gets "Access Denied"
//   },
  
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   }
// });

// export { handler as GET, handler as POST }; 





























import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import dbConnect from "@/app/lib/dbconnect"; 
import User from "@/app/models/User";        
import bcrypt from "bcryptjs"; // <-- Make sure to import bcrypt!

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "text"     },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        await dbConnect();

        const user = await User.findOne({ 
          email: credentials.email.toLowerCase().trim() 
        });

        if (!user) {
          throw new Error("No account found with this email");
        }

        // Block only truly suspended/rejected accounts
        if (user.status === "suspended") {
          throw new Error("Your account has been suspended. Contact support.");
        }
        if (user.status === "rejected") {
          throw new Error("Your account access has been rejected. Contact support.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password. Please try again.");
        }

        // ✅ Auto-verify on successful login (fixes the isVerified problem permanently)
        if (!user.isVerified) {
          await User.findByIdAndUpdate(user._id, { 
            isVerified: true,
            lastLogin: new Date()
          });
        } else {
          await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
        }

        return {
          id    : user._id.toString(),
          email : user.email,
          name  : user.name,
          role  : user.role || "agent",
        };
      }
    })
  ],

  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();

      if (account?.provider === "google") {
        const dbUser = await User.findOne({ 
          email: user.email?.toLowerCase().trim() 
        });

        // Google user not in DB → deny
        if (!dbUser) {
          console.log("❌ Google login denied — not registered:", user.email);
          return false;
        }

        // Only block suspended/rejected
        if (dbUser.status === "suspended" || dbUser.status === "rejected") {
          console.log("❌ Google login denied — account status:", dbUser.status);
          return false;
        }

        // ✅ Auto-verify + update lastLogin for Google users too
        await User.findByIdAndUpdate(dbUser._id, {
          isVerified : true,
          lastLogin  : new Date(),
        });

        // Attach role so jwt callback can read it
        (user as any).role = dbUser.role;
        (user as any).id   = dbUser._id.toString();

        console.log("✅ Google login success:", user.email, "| role:", dbUser.role);
        return true;
      }

      // Credentials — always allow (blocked in authorize if needed)
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id   = (user as any).id   || user.id;
        token.role = (user as any).role || "agent";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id   = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },

  pages: {
    signIn : "/auth/login",
    error  : "/auth/login",
  },

  secret  : process.env.NEXTAUTH_SECRET,
  session : { strategy: "jwt" as const },
};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


// // 👇 FIX 1: We pull the config out into an EXPORTED constant
// export const authOptions: NextAuthOptions = {
//   providers: [
//     // 1. Google Auth Provider
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),

//     // 2. Existing Credentials Provider
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Missing credentials");
//         }

//         await dbConnect();

//         const user = await User.findOne({ email: credentials.email });
//         if (!user) {
//           throw new Error("No user found");
//         }

//         // 👇 Password check is now active 👇
//         const isValid = await bcrypt.compare(credentials.password, user.password);
//         if (!isValid) throw new Error("Wrong password");

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name,
//           role: user.role || "agent", 
//         };
//       }
//     })
//   ],

//   callbacks: {
//     async signIn({ user, account }: { user: any; account: any }) {
//       if (account?.provider === "google") {
//         await dbConnect();
//         const existingUser = await User.findOne({ email: user.email });
//         if (!existingUser) return false; 
//         if (existingUser.status === "suspended") return false;
//       }
//       return true; 
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = (user as any).role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         (session.user as any).id = token.id;
//         (session.user as any).role = token.role;
//       }
//       return session;
//     }
//   },

//   pages: {
//     signIn: "/auth/login", // <-- Make sure this matches your exact login path
//     error: "/auth/login",  
//   },
  
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt" as const, // <-- TypeScript requires this 'as const' here
//   }
// };

// // 👇 FIX 1 CONTINUED: Pass the constant into NextAuth
// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };



























// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import type { NextAuthOptions } from "next-auth";
// import type { JWT } from "next-auth/jwt";
// import dbConnect from "@/app/lib/dbconnect"; 
// import User from "@/app/models/User";        
// import bcrypt from "bcryptjs"; 

// export const authOptions: NextAuthOptions = {
//   providers: [
//     // 1. Google Auth Provider
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),

//     // 2. Existing Credentials Provider
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Missing credentials");
//         }

//         await dbConnect();

//         const user = await User.findOne({ email: credentials.email });
//         if (!user) {
//           throw new Error("No user found");
//         }

//         // 👇 Password check is active 👇
//         const isValid = await bcrypt.compare(credentials.password, user.password);
//         if (!isValid) throw new Error("Wrong password");

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name,
//           role: user.role || "Agent", 
//         };
//       }
//     })
//   ],

//   callbacks: {
//     // 👇 The updated signIn callback with Google Sync logic 👇
//     async signIn({ user, account }: { user: any; account: any }) {
//       if (account?.provider === "google") {
//         await dbConnect();
        
//         const existingUser = await User.findOne({ email: user.email });
        
//         if (!existingUser) return false; 
//         if (existingUser.status === "suspended") return false;

//         // Automatically sync Google Name and Avatar to MongoDB
//         if (user.name && existingUser.name !== user.name) {
//             existingUser.name = user.name;
//         }
//         if (user.image && existingUser.profilePicture !== user.image) {
//             existingUser.profilePicture = user.image;
//         }
//         await existingUser.save(); // Save the updated Google info to your database
//       }
//       return true; 
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = (user as any).role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         (session.user as any).id = token.id;
//         (session.user as any).role = token.role;
//       }
//       return session;
//     }
//   },

//   pages: {
//     signIn: "/auth/login", 
//     error: "/auth/login",  
//   },
  
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt" as const, 
//   }
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };