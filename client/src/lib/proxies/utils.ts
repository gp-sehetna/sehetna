import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { loginRoute } from "@/lib/proxies/routes"

const matchesRoute = (pathname: string, routes: string[]) => {
    return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

const isLoggedIn = (request: NextRequest) => {
    return !!request.cookies.get("access_token")?.value
}

const hasCookie = (request: NextRequest, name: string) => {
    return !!request.cookies.get(name)?.value
}

const redirectTo = (request: NextRequest, route: string) => {
    return NextResponse.redirect(new URL(route, request.url))
}

const redirectToLogin = (request: NextRequest) => {
    const loginUrl = new URL(loginRoute, request.url)
    loginUrl.searchParams.set("dst", request.nextUrl.pathname)

    return NextResponse.redirect(loginUrl)
}

export { matchesRoute, isLoggedIn, hasCookie, redirectTo, redirectToLogin }
