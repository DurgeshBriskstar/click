import { NextResponse } from "next/server";
import { SUPER_ADMIN_ROLE, STORE_ADMIN_ROLE } from "utils/constants";
import { verifyToken } from "utils/helpers";
import { ROUTES } from "utils/routes";

const publicPaths = [
  "/",
  "/appointment",
  "/services",
  "/blogs",
  "/about",
  "/franchise",
  "/privacy",
  "/terms",
  "/contact",
  "/stores",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/verify-reset-token",
  "/api/auth/reset-password",
  "/api/public",
  "/api/backend-assets",
  "/api/quickbooks/callback", // QuickBooks OAuth callback
];

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isPublicPath = publicPaths.some((path) => {
    if (path.includes(":")) {
      const regex = new RegExp(path.replace(/:[^\s/]+/g, "[^/]+"));
      return regex.test(pathname);
    }
    // Check for exact match or if pathname starts with the public path (for /api/public/*)
    return pathname === path || pathname.startsWith(path + "/");
  });

  if (!isPublicPath && !token) {
    const loginUrl = new URL(ROUTES?.LOGIN, request.url);
    return NextResponse.redirect(loginUrl);
  }

  let isValidToken = false;
  let user = null;

  if (token) {
    const decoded = await verifyToken(token);
    user = decoded;
    isValidToken = !!decoded;

    if (!decoded) {
      const res = NextResponse.redirect(new URL(ROUTES?.LOGIN, request.url));

      // Set secure flag - only true if using HTTPS
      const protocol = request.headers.get('x-forwarded-proto') || 
                      (request.url?.startsWith('https') ? 'https' : 'http');
      const isHttps = protocol === 'https';
      const isSecure = isHttps && (process.env.SECURE_COOKIE === 'true' || 
                   (process.env.NODE_ENV === 'production' && isHttps));
      
      res.cookies.set("token", "", {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",
        expires: new Date(0),
      });

      return res;
    }
  }

  if (pathname === ROUTES?.LOGIN && isValidToken) {
    if (user?.role === SUPER_ADMIN_ROLE) {
      return NextResponse.redirect(
        new URL(ROUTES?.ADMIN?.DASHBOARD, request.url)
      );
    }
    if (user?.role === STORE_ADMIN_ROLE) {
      return NextResponse.redirect(
        new URL(ROUTES?.STORE?.DASHBOARD, request.url)
      );
    }
    return NextResponse.redirect(new URL(ROUTES?.HOMEPAGE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|backend-assets|fonts|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)).*)",
  ],
};
