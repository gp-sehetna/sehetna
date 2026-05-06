import { BadRequestException, UnauthorizedException } from "@/shared/http/errors"
import logger from "@/shared/logger"
import { JwtPayload, sign, verify } from "jsonwebtoken"

export const EXPIRE = {
    access: 30 * 60,
    refresh: 30 * 24 * 60 * 60,
}

export const createTokens = async (user_id: string, role: string) => {
    try {
        const payload = { role }

        const accessToken = sign(payload, process.env.JWT_ACCESS_SECRET!, {
            subject: user_id,
            expiresIn: EXPIRE.access,
            issuer: "sehetna",
        })

        const refreshToken = sign({}, process.env.JWT_REFRESH_SECRET!, {
            subject: user_id,
            expiresIn: EXPIRE.refresh,
            issuer: "sehetna",
        })

        return { accessToken, refreshToken }
    } catch (error) {
        logger.error(
            {
                error: error instanceof Error ? error.message : error,
            },
            "Please check your JWT secrets and ensure they are properly set in the environment variables."
        )
        throw error
    }
}

export const decodeToken = (authorization: string, secret?: string) => {
    // Handle both "Bearer <token>" and raw token strings
    // Returns the full payload { _id, iat, exp, role... }
    const parts = authorization.split(" ")
    const token = parts.length === 2 ? parts[1] : parts[0]

    if (!token) throw new UnauthorizedException("Invalid or missing token")

    try {
        const decoded = verify(token, secret!) as JwtPayload

        if (!decoded.sub) throw new BadRequestException("Invalid token payload: Missing Subject")
        return decoded as Required<Pick<JwtPayload, "sub">>
    } catch (error) {
        if (error instanceof Error)
            throw new UnauthorizedException("Invalid or expired token: " + error.message, {
                cause: "expired",
            })

        throw new UnauthorizedException("Invalid or expired token", { cause: "expired" })
    }
}
