import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { authRoutesProxy } from "@/lib/proxies/auth.proxy"
import { protectedRoutesProxy } from "@/lib/proxies/protected.proxy"

export function proxy(request: NextRequest) {
    const proxyHandlers = [protectedRoutesProxy, authRoutesProxy]

    for (const proxyHandler of proxyHandlers) {
        const response = proxyHandler(request)
        if (response) return response
    }

    return NextResponse.next()
}
