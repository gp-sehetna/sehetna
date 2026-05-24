import type { ProxyHandler } from "@/lib/proxies/types"
import {
    forgotPasswordRoute,
    guestOnlyRoutes,
    homeRoute,
    newPasswordRoute,
    oldPasswordRoute,
    signupCredentialsRoute,
    signupRoute,
    verifyRoute,
} from "@/lib/proxies/routes"
import { hasCookie, isLoggedIn, matchesRoute, redirectTo, redirectToLogin } from "./utils"

export const authRoutesProxy: ProxyHandler = (request) => {
    const { pathname, searchParams } = request.nextUrl
    const loggedIn = isLoggedIn(request)

    if (matchesRoute(pathname, guestOnlyRoutes) && loggedIn) {
        return redirectTo(request, homeRoute)
    }

    if (matchesRoute(pathname, [signupCredentialsRoute])) {
        if (loggedIn) return redirectTo(request, homeRoute)
        if (!hasCookie(request, "otp_id")) return redirectTo(request, signupRoute)
    }

    if (matchesRoute(pathname, [verifyRoute])) {
        if (!hasCookie(request, "email_token")) return redirectTo(request, signupRoute)
        if (searchParams.get("purpose") === "email_change" && !loggedIn) {
            return redirectToLogin(request)
        }
    }

    if (matchesRoute(pathname, [oldPasswordRoute]) && !loggedIn) {
        return redirectToLogin(request)
    }

    if (matchesRoute(pathname, [newPasswordRoute]) && !hasCookie(request, "otp_id") && !loggedIn) {
        return redirectTo(request, forgotPasswordRoute)
    }
}
