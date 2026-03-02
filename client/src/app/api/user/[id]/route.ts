import { decodeToken } from "@/lib/auth/token"
import { MainService } from "@/shared/db/main.service"
import { UnauthorizedException, UserNotFoundException } from "@/shared/http/errors"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { NextRequest } from "next/server"

type ParamsProps = { params: Promise<{ id: string }> }

export const GET = globalErrorHandler(async (req: NextRequest, { params }: ParamsProps) => {
    const { id } = await params
    const mainService = await MainService.getInstance()

    let targetId = id

    if (id === "me") {
        const token = req.cookies.get("access_token")?.value

        if (!token) throw new UnauthorizedException("Session expired", { cause: "expired" })

        targetId = decodeToken(token, process.env.JWT_ACCESS_SECRET).sub
    }

    const user = await mainService.authService.getUserById(targetId)

    if (!user) throw new UserNotFoundException()

    return [user, "User retrieved successfully."]
})
