import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("role")?.value;
  const pathname = request.nextUrl.pathname;

  // Role-based dashboard paths
  const roleDashboardMap = {
    admin: "/admindashboard",
    Cafeteriachef: "/chefdashboard",
    Busdriver: "/driverdashboard",
    Clubpresident: "/clubdashboard",
    student: "/userdashboard",
  };

  // List of all protected paths
  const protectedPaths = Object.values(roleDashboardMap);
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Authentication pages
  const authPaths = ["/signin", "/signup"];
  const isAuthPath = authPaths.includes(pathname);

  // Redirect if accessing a protected route without login
  if (isProtectedPath && !accessToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 🔥 If user is already logged in, redirect from /signin or /signup to their correct dashboard
  if (isAuthPath && accessToken && userRole && roleDashboardMap[userRole]) {
    return NextResponse.redirect(
      new URL(`${roleDashboardMap[userRole]}/overview`, request.url)
    );
  }

  // 🔥 Prevent unauthorized access to other dashboards
  if (isProtectedPath && userRole) {
    const allowedPath = roleDashboardMap[userRole];
    if (!pathname.startsWith(allowedPath)) {
      return NextResponse.redirect(
        new URL(`${allowedPath}/overview`, request.url)
      );
    }
  }

  return NextResponse.next();
}

// Match all routes except API, Next.js static assets, images, and favicon
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
