import { decodeToken } from "@/lib/auth/token"
import { MainService } from "@/shared/db/main.service"
import { UnauthorizedException } from "@/shared/http/errors"
import { base } from "@/shared/http/handlers/base.handler"
import { ProtectedHandler } from "@/shared/http/types"
import { NextRequest, NextResponse } from "next/server"

export function userProvider<Args extends any[] = any[]>(handler: ProtectedHandler<any, Args>) {
    return async (req: NextRequest, ...args: Args): Promise<NextResponse> => {
        const mainService = await MainService.getInstance()

        const token = req.cookies.get("access_token")?.value

        if (!token) throw new UnauthorizedException("Session expired", { cause: "expired" })

        const decoded = decodeToken(token, process.env.JWT_ACCESS_SECRET)
        const { user } = await mainService.authService.getUserById(decoded.sub)

        const result = await handler(req, user, ...args)
        return base(result)
    }
}
