// middleware.ts (Edge Runtime)
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);
const ALLOW_NO_AUTH = new Set(["GET", "HEAD", "OPTIONS"]);
const ADMIN_COOKIE = "admin_auth";
const ADMIN_COOKIE_PATH = "/";
const SESSION_TTL = 60 * 60 * 8;
const REALM = "Admin Area";

const SECRET = process.env.ADMIN_SESSION_SECRET || "dev-secret-change-me";

async function hmac(text: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(text)
  );
  // به base64url
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

type SessionPayload = { sub: "admin"; exp: number };

async function signSession(payload: SessionPayload) {
  const body = btoa(JSON.stringify(payload));
  const sig = await hmac(body);
  return `${body}.${sig}`;
}

async function verifySession(token: string | undefined) {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = await hmac(body);
  if (sig !== expected) return null;
  const json = JSON.parse(atob(body)) as SessionPayload;
  if (!json.exp || Date.now() / 1000 > json.exp) return null;
  return json;
}

function challenge401(message = "Authentication required") {
  return new NextResponse(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
    },
  });
}

function isBasicAuthed(req: NextRequest) {
  const header = req.headers.get("authorization") || "";
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return false;
  try {
    const [user, pass] = atob(encoded).split(":");
    return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS;
  } catch {
    return false;
  }
}

async function grantCookie() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL;
  const token = await signSession({ sub: "admin", exp });
  const res = NextResponse.next();
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: ADMIN_COOKIE_PATH,
    maxAge: SESSION_TTL,
  });
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminApi = pathname.startsWith("/api/admin");
  const isAdminPanel = pathname.startsWith("/admin");

  if (pathname.startsWith("/api")) {
    if (pathname.startsWith("/api/admin")) {
      if (ALLOW_NO_AUTH.has(req.method)) return NextResponse.next();
      const token = req.cookies.get(ADMIN_COOKIE)?.value;
      const session = await verifySession(token);
      if (session) return NextResponse.next();
      if (isBasicAuthed(req)) return grantCookie();
      return challenge401("Admin authentication required");
    }
    return NextResponse.next();
  }

  if (isAdminApi) {
    if (ALLOW_NO_AUTH.has(req.method)) return NextResponse.next();
    const session = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value);
    if (session) return NextResponse.next();
    if (isBasicAuthed(req)) return grantCookie();
    return challenge401("Admin authentication required");
  }

  if (isAdminPanel) {
    const session = await verifySession(req.cookies.get(ADMIN_COOKIE)?.value);
    if (session) return NextResponse.next();
    if (isBasicAuthed(req)) return grantCookie();
    return challenge401("Authentication required");
  }

  // سایر مسیرها → i18n
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|admin|trpc|_next|_vercel|.*\\..*).*)",
    "/admin/:path*",
    "/api/:path*", // اگر فقط /api/admin را می‌خواهی، این را به '/api/admin/:path*' محدود کن
  ],
};
