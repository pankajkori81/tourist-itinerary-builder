import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

// Define paths for cleaner logic
const LOGIN_URL = '/auth/login';
const DASHBOARD_URL = '/dashboard';
const UNAUTHORIZED_REDIRECT = '/dashboard/itinerary/create-day';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  // Define Route Scopes
  const isDashboard = pathname.startsWith('/dashboard');
  const isAuthPage = pathname.startsWith('/auth');
  const isAdminRoute = pathname.startsWith('/dashboard/itinerary/costing');

  // 1. SECURITY: If trying to access Dashboard without token -> Kick to Login
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL(LOGIN_URL, req.url));
  }

  // 2. UX: If already logged in and trying to access Login/Register -> Go to Dashboard
  if (isAuthPage && token) {
    // Optional: Verify token validity even here to prevent loops with bad tokens
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.redirect(new URL(DASHBOARD_URL, req.url));
    } catch (error) {
      // If token is bad, let them stay on Login page (and maybe clear the cookie)
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }

  // 3. RBAC: Role-Based Access Control (Admin Routes)
  if (token && isAdminRoute) {
    try {
      const { payload } = await jwtVerify(token, SECRET);
      
      // Strict Check: Must explicitly be 'admin'
      const role = payload.role as string;
      
      if (role !== 'admin') {
         console.warn(`[Security] User ${payload.userId} (Role: ${role}) tried to access Admin Route.`);
         // Employee trying to access Costing -> Send back to safe zone
         return NextResponse.redirect(new URL(UNAUTHORIZED_REDIRECT, req.url));
      }
      
    } catch (error) {
      // Token is invalid/expired/tampered -> Force Logout
      console.error("[Middleware] Token verification failed:", error);
      const response = NextResponse.redirect(new URL(LOGIN_URL, req.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply to all dashboard routes and auth routes
  // Excludes public assets like images, favicon, api routes (api is protected separately)
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};