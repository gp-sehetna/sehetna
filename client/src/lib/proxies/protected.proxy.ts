import type { ProxyHandler } from "@/lib/proxies/types"
import { dataExplorerRoutes, settingsRoutes } from "@/lib/proxies/routes"
import { isLoggedIn, matchesRoute, redirectToLogin } from "@/lib/proxies/utils"

const protectedRoutes = [...settingsRoutes, ...dataExplorerRoutes]

export const protectedRoutesProxy: ProxyHandler = (request) => {
    const isProtected = matchesRoute(request.nextUrl.pathname, protectedRoutes)

    if (isProtected && !isLoggedIn(request)) return redirectToLogin(request)
}
