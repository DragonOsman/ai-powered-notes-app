import { auth } from "@/lib/auth";
import {
  NextRequest,
  NextResponse
} from "next/server";

export const proxy = async (
  request: NextRequest
) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (session?.user) {
      return NextResponse.next();
    }

    const loginUrl = new URL(
      "/auth/signin",
      request.url
    );

    const callbackUrl =
      `${request.nextUrl.pathname}` +
      `${request.nextUrl.search}`
    ;

    loginUrl.searchParams.set(
      "callbackUrl",
      callbackUrl
    );

    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error(
      "[PROXY AUTH ERROR]",
      error
    );

    return NextResponse.redirect(
      new URL("/auth/signin", request.url)
    );
  }
};

export const config = {
  matcher: [
    "/users/:path*",
    "/notes/:path*"
  ]
};