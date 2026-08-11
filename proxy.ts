import { NextResponse, type NextRequest } from "next/server"

const accessTokenCookie = "caronaAccessToken"

function hasValidAccessToken(request: NextRequest) {
  const token = request.cookies.get(accessTokenCookie)?.value
  const payload = token?.split(".")[1]
  if (!payload) return false

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(payload.length / 4) * 4, "=")
    const decoded = JSON.parse(atob(normalized)) as { exp?: number; type?: string }
    return decoded.type === "access" && typeof decoded.exp === "number" && decoded.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function proxy(request: NextRequest) {
  if (hasValidAccessToken(request)) return NextResponse.next()

  const destination = `${request.nextUrl.pathname}${request.nextUrl.search}`
  const login = new URL("/login", request.url)
  login.searchParams.set("next", destination)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: [
    "/inicio/:path*",
    "/buscar-carona/:path*",
    "/oferecer-carona/:path*",
    "/caronas/:path*",
    "/perfil/:path*",
    "/conversas/:path*",
  ],
}
