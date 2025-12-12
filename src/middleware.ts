import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/workspace',
  '/board',
  '/settings',
  '/profile',
];

// Define auth routes (redirect to dashboard if already authenticated)
const authRoutes = ['/login', '/register'];

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/privacy-policy',
  '/terms-of-service',
  '/about',
  '/contact',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session token from cookies
  const sessionToken = request.cookies.get('session-token')?.value;
  const isAuthenticated = !!sessionToken;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is auth page
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + '/')
  );

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/login', request.url);
    // Add redirect parameter to return user after login
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if accessing auth route while authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  
  // Additional security headers (complementing next.config.ts)
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');
    
  // Comprehensive EU 2026 Security Headers
  response.headers.set('X-Frame-Options', 'DENY'); // Prevent clickjacking
  response.headers.set('X-XSS-Protection', '1; mode=block'); // XSS protection
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin'); // Referrer policy
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()'); // Permissions
  
  // Strict Transport Security (HSTS) - Force HTTPS for 2 years
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  
  // Content Security Policy (CSP) - Strict policy
  const cspPolicy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com", // Google OAuth
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://accounts.google.com",
    "frame-src 'self' https://accounts.google.com", // Google OAuth frames
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspPolicy);
  
  return response;
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately with their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
