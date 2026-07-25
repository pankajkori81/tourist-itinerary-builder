// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { jwtVerify } from 'jose';

// const SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

// // Define paths for cleaner logic
// const LOGIN_URL = '/auth/login';
// const DASHBOARD_URL = '/dashboard';
// const UNAUTHORIZED_REDIRECT = '/dashboard/itinerary/create-day';

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const token = req.cookies.get('token')?.value;

//   // Define Route Scopes
//   const isDashboard = pathname.startsWith('/dashboard');
//   const isAuthPage = pathname.startsWith('/auth');
//   const isAdminRoute = pathname.startsWith('/dashboard/itinerary/costing');

//   // 1. SECURITY: If trying to access Dashboard without token -> Kick to Login
//   if (isDashboard && !token) {
//     return NextResponse.redirect(new URL(LOGIN_URL, req.url));
//   }

//   // 2. UX: If already logged in and trying to access Login/Register -> Go to Dashboard
//   if (isAuthPage && token) {
//     // Optional: Verify token validity even here to prevent loops with bad tokens
//     try {
//       await jwtVerify(token, SECRET);
//       return NextResponse.redirect(new URL(DASHBOARD_URL, req.url));
//     } catch (error) {
//       // If token is bad, let them stay on Login page (and maybe clear the cookie)
//       const response = NextResponse.next();
//       response.cookies.delete('token');
//       return response;
//     }
//   }


//   // 3. RBAC: Role-Based Access Control (Admin Routes)
//   if (token && isAdminRoute) {
//     try {
//       const { payload } = await jwtVerify(token, SECRET);
      
//       const role = payload.role as string;
      
//       // 👇 FIX: We now allow BOTH 'admin' and 'employee' to access the Costing route!
//       // (The Costing page itself will handle showing them different views)
//       if (role !== 'admin' && role !== 'employee' && role !== 'agent' ) {
//          console.warn(`[Security] User ${payload.userId} (Role: ${role}) tried to access Restricted Route.`);
//          // Someone unauthorized trying to access Costing -> Send back to safe zone
//          return NextResponse.redirect(new URL(UNAUTHORIZED_REDIRECT, req.url));
//       }
      
//     } catch (error) {
//       // Token is invalid/expired/tampered -> Force Logout
//       console.error("[Middleware] Token verification failed:", error);
//       const response = NextResponse.redirect(new URL(LOGIN_URL, req.url));
//       response.cookies.delete('token');
//       return response;
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   // Apply to all dashboard routes and auth routes
//   // Excludes public assets like images, favicon, api routes (api is protected separately)
//   matcher: ['/dashboard/:path*', '/auth/:path*'],
// };




























// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// // NextAuth's withAuth wrapper automatically verifies the token securely
// export default withAuth(
//   function middleware(req) {
//     const token = req.nextauth.token;
//     const path = req.nextUrl.pathname;

//     // 1. UX: If already logged in and trying to access Auth/Login -> Go to Dashboard
//     if (path.startsWith('/auth') && token) {
//       return NextResponse.redirect(new URL('/dashboard', req.url));
//     }

//     // 2. RBAC: Role-Based Access Control (Admin Routes)
//     if (path.startsWith('/dashboard/itinerary/costing')) {
//       const role = token?.role as string;
      
//       // Allow ONLY admin, employee, and agent to access Costing
//       if (role !== 'admin' && role !== 'employee' && role !== 'agent') {
//          console.warn(`[Security] Unauthorized role (${role}) tried to access Restricted Route.`);
//          // Someone unauthorized trying to access Costing -> Send back to safe zone
//          return NextResponse.redirect(new URL('/dashboard/itinerary/create-day', req.url));
//       }
//     }

//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       // 3. SECURITY: The Gatekeeper
//       authorized: ({ req, token }) => {
//         // Always let people access the /auth pages so they can log in
//         if (req.nextUrl.pathname.startsWith('/auth')) {
//           return true;
//         }
//         // For everything else (like /dashboard), ONLY allow if a valid token exists
//         return !!token;
//       },
//     },
//     // Specify your custom login page so NextAuth knows where to send unauthenticated users
//     pages: {
//       signIn: "/auth/login",
//     }
//   }
// );

// export const config = {
//   // Apply to all dashboard routes and auth routes
//   // Excludes public assets like images, favicon, api routes
//   matcher: ['/dashboard/:path*', '/auth/:path*'],
// };



























// ══════════════════════════════════════════════════════════════
// FILE: middleware.ts
// LOCATION: Root of project (same level as package.json)
// PURPOSE: Single source of truth for ALL route protection.
//          Runs on every request BEFORE the page loads.
//          Combines old code's UX features + new code's RBAC.
// ══════════════════════════════════════════════════════════════

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token    = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const role     = (token?.role as string) || "";

    // ══════════════════════════════════════════════════════════
    // RULE 1 — UX: Already logged in + visiting /auth pages
    // → Redirect them to their own dashboard (from OLD code)
    // ══════════════════════════════════════════════════════════
    if (pathname.startsWith("/auth") && token) {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      } else if (role === "employee") {
        return NextResponse.redirect(new URL("/dashboard/employee", req.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard/agent", req.url));
      }
    }

    // ══════════════════════════════════════════════════════════
    // RULE 2 — ADMIN-ONLY pages
    // → Employee or Agent visiting these → kicked to own dashboard
    // (from NEW code)
    // ══════════════════════════════════════════════════════════
    const adminOnlyPaths = [
      "/dashboard/admin",
      "/dashboard/employees",
      "/dashboard/admin/agents",
      "/dashboard/rate-manager",
      "/dashboard/reports",
      "/dashboard/subscription",
      "/dashboard/travel-advisor",
    ];

    const isAdminOnly = adminOnlyPaths.some(p => pathname.startsWith(p));
    if (isAdminOnly && role !== "admin") {
      console.warn(`[Security] Role (${role}) blocked from admin path: ${pathname}`);
      const redirectTo = role === "employee"
        ? "/dashboard/employee"
        : "/dashboard/agent";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    // ══════════════════════════════════════════════════════════
    // RULE 3 — EMPLOYEE + ADMIN pages (agents blocked)
    // → Agent visiting these → kicked to agent dashboard
    // (from NEW code)
    // ══════════════════════════════════════════════════════════
    const employeeAndAbovePaths = [
      "/dashboard/srm",
      "/dashboard/travel-operations",
      "/dashboard/crisis-management",
      "/dashboard/employee",
    ];

    const isEmployeeAndAbove = employeeAndAbovePaths.some(p =>
      pathname.startsWith(p)
    );
    if (isEmployeeAndAbove && role === "agent") {
      console.warn(`[Security] Agent blocked from employee path: ${pathname}`);
      return NextResponse.redirect(new URL("/dashboard/agent", req.url));
    }

    // ══════════════════════════════════════════════════════════
    // RULE 4 — COSTING page protection
    // → Only admin, employee, agent allowed (no unknown roles)
    // (from OLD code — kept because costing has financial data)
    // ══════════════════════════════════════════════════════════
    if (pathname.startsWith("/dashboard/itinerary/costing")) {
      const allowedRoles = ["admin", "employee", "agent"];
      if (!allowedRoles.includes(role)) {
        console.warn(`[Security] Unknown role (${role}) blocked from costing`);
        return NextResponse.redirect(
          new URL("/dashboard/itinerary/create-day", req.url)
        );
      }
    }

    // ══════════════════════════════════════════════════════════
    // RULE 5 — Agent dashboard protection
    // → Only agents should access /dashboard/agent
    // → Admin/employee visiting it → redirect to their dashboard
    // ══════════════════════════════════════════════════════════
    if (pathname.startsWith("/dashboard/agent") && role !== "agent") {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      }
      if (role === "employee") {
        return NextResponse.redirect(new URL("/dashboard/employee", req.url));
      }
    }

    // ══════════════════════════════════════════════════════════
    // RULE 6 — Employee dashboard protection
    // → Only employees should access /dashboard/employee
    // ══════════════════════════════════════════════════════════
    if (pathname.startsWith("/dashboard/employee") && role !== "employee") {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      }
      if (role === "agent") {
        return NextResponse.redirect(new URL("/dashboard/agent", req.url));
      }
    }

    // All checks passed — allow request
    return NextResponse.next();
  },
  {
    callbacks: {
      // ── GATEKEEPER: Who is allowed through at all? ──
      authorized: ({ req, token }) => {
        // /auth pages are always public (login, register, forgot-password)
        if (req.nextUrl.pathname.startsWith("/auth")) {
          return true;
        }
        // Everything else requires a valid session token
        return !!token;
      },
    },
    // Tell NextAuth where the login page is
    // (from OLD code — critical for unauthenticated redirects)
    pages: {
      signIn: "/auth/login",
    },
  }
);

// ══════════════════════════════════════════════════════════════
// MATCHER: Which paths does this middleware run on?
// Combined from BOTH old and new code
// ══════════════════════════════════════════════════════════════
export const config = {
  matcher: [
    "/dashboard/:path*",  // All dashboard pages
    "/auth/:path*",       // Auth pages (for already-logged-in redirect)
    "/api/admin/:path*",  // All admin API routes
  ],
};