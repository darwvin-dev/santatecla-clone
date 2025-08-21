import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};

const ALLOW_NO_AUTH = new Set(["GET", "HEAD", "OPTIONS"]);

function isAuthed(req: NextRequest) {
  const header = req.headers.get("authorization") || "";
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return false;
  try {
    const [user, pass] = atob(encoded).split(":");
    return (
      user === process.env.ADMIN_USER &&
      pass === process.env.ADMIN_PASS
    );
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  if (method === "OPTIONS") return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    if (isAuthed(req)) return NextResponse.next();
    return new NextResponse("Authentication required.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Area", charset="UTF-8"',
      },
    });
  }

  if (pathname.startsWith("/api")) {
    if (ALLOW_NO_AUTH.has(method)) return NextResponse.next();

    if (isAuthed(req)) return NextResponse.next();
    return new NextResponse("Admin authentication required for non-GET requests.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin API", charset="UTF-8"',
      },
    });
  }

  return NextResponse.next();
}
