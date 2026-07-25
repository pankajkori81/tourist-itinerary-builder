// "use client";

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";

// // Updated Interface matching your MongoDB Schema
// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: 'admin' | 'employee';
//   status: 'active' | 'inactive' | 'suspended';
//   profilePicture?: string;
// }

// interface UserContextType {
//   user: User | null;
//   loading: boolean;
//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>; // Added refresh capability
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export function UserProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const pathname = usePathname();

//   // Function to fetch user data
//   const fetchUser = async () => {
//     // Skip fetching on public auth pages to prevent loops
//     if (pathname?.startsWith("/auth/")) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("/api/auth/profile");
//       const json = await res.json();

//       if (json.success) {
//         setUser(json.data);
//       } else {
//         setUser(null);
//         // If we are on a protected route but auth failed, redirect
//         if (pathname?.startsWith("/dashboard")) {
//           router.push("/auth/login");
//         }
//       }
//     } catch (err) {
//       console.error("Auth Check Error:", err);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check auth on mount
//   useEffect(() => {
//     fetchUser();
//   }, []);

//   // Re-check auth when route changes (optional but safer)
//   useEffect(() => {
//     fetchUser();
//   }, [pathname]);

//   const logout = async () => {
//     try {
//       await fetch("/api/auth/logout");
//       setUser(null);
//       router.push("/auth/login");
//     } catch (err) {
//       console.error("Logout Error:", err);
//     }
//   };

//   return (
//     <UserContext.Provider 
//       value={{ 
//         user, 
//         loading, 
//         logout,
//         refreshUser: fetchUser // Exported so other components can force a refresh
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUser() {
//   const context = useContext(UserContext);
//   if (context === undefined) throw new Error("useUser must be used within UserProvider");
//   return context;
// } 



















































// "use client";

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";

// // --- UPDATE STARTS HERE ---
// // We added phone, address, department, etc. to fix the red errors in ProfilePage
// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: 'admin' | 'employee' | 'agent';
//   status: 'active' | 'inactive' | 'suspended';
//   profilePicture?: string;
  
//   // New Dynamic Fields
//   phone?: string;
//   address?: string;
//   department?: string;
//   position?: string;
//   dateOfJoining?: string;
//   lastLogin?: string;
//   createdAt?: string;
// }
// // --- UPDATE ENDS HERE ---

// interface UserContextType {
//   user: User | null;
//   loading: boolean;
//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export function UserProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const pathname = usePathname();

//   const fetchUser = async () => {
//     // Skip fetching on public auth pages to prevent loops
//     if (pathname?.startsWith("/auth/")) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("/api/auth/profile");
//       const json = await res.json();

//       if (json.success) {
//         setUser(json.data);
//       } else {
//         setUser(null);
//         // If on a protected route but auth failed, redirect
//         if (pathname?.startsWith("/dashboard")) {
//           router.push("/auth/login");
//         }
//       }
//     } catch (err) {
//       console.error("Auth Check Error:", err);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check auth on mount
//   useEffect(() => {
//     fetchUser();
//   }, []);

//   // Optional: Re-check on route change
//   useEffect(() => {
//     fetchUser();
//   }, [pathname]);

//   const logout = async () => {
//     try {
//       await fetch("/api/auth/logout");
//       setUser(null);
//       router.push("/auth/login");
//     } catch (err) {
//       console.error("Logout Error:", err);
//     }
//   };

//   return (
//     <UserContext.Provider value={{ user, loading, logout, refreshUser: fetchUser }}>
     
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUser() {
//   const context = useContext(UserContext);
//   if (context === undefined) throw new Error("useUser must be used within UserProvider");
//   return context;
// } 













"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react"; // 👈 NEW: Import NextAuth's signOut

// --- UPDATE STARTS HERE ---
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'agent';
  status: 'active' | 'inactive' | 'suspended';
  profilePicture?: string;
  
  // Dynamic Fields
  phone?: string;
  address?: string;
  department?: string;
  position?: string;
  dateOfJoining?: string;
  lastLogin?: string;
  createdAt?: string;
}
// --- UPDATE ENDS HERE ---

interface UserContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    // Skip fetching on public auth pages to prevent loops
    if (pathname?.startsWith("/auth/")) {
      setLoading(false);
      return;
    }

    try {
      // NOTE: Make sure you updated THIS backend route with getServerSession 
      // (like we did in the previous step) so it can read the NextAuth token!
      const res = await fetch("/api/auth/profile"); 
      const json = await res.json();

      // Accepting both json.data or json.user depending on how your API returns it
      if (res.ok && (json.data || json.user)) {
        setUser(json.data || json.user);
      } else {
        setUser(null);
        // 🚨 FIX 1: THE ROUTER.PUSH WAS REMOVED FROM HERE 🚨
        // We let middleware.ts handle all redirects now!
      }
    } catch (err) {
      console.error("Auth Check Error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check auth on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Optional: Re-check on route change
  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const logout = async () => {
    try {
      // 🚨 FIX 2: USE NEXTAUTH LOGOUT 🚨
      // This guarantees the secure Google/NextAuth cookies are actually destroyed
      await signOut({ callbackUrl: '/auth/login' }); 
      setUser(null);
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, logout, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error("useUser must be used within UserProvider");
  return context;
}