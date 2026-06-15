import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/users", "/notes"];

function isProtected(pathname: string) {
  return PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
}

export const proxy = async (request: NextRequest) => {
  try {
    const pathname = request.nextUrl.pathname;

    // skip static + auth routes
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/auth")
    ) {
      return NextResponse.next();
    }

    const protectedRoute = isProtected(pathname);

    if (!protectedRoute) {
      return NextResponse.next();
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // hard block unauthenticated users
    if (!session?.user) {
      const loginUrl = new URL("/auth/signin", request.url);
      loginUrl.searchParams.set("callback", pathname);

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (err) {
    console.error("[PROXY AUTH ERROR]", err);

    // fail closed (important for security)
    return NextResponse.redirect(
      new URL("/auth/signin", request.url)
    );
  }
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};