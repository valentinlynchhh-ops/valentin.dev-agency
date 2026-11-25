import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_ADMIN, tokenValido } from "@/lib/adminSesion";

/* Protege /admin: sin sesión válida, al login. El login mismo queda abierto. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (await tokenValido(request.cookies.get(COOKIE_ADMIN)?.value)) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*"] };
