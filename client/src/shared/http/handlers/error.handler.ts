import { globalLimiter } from "@/lib/utils/rateLimiter"
import { ApplicationException } from "@/shared/http/errors"
import { errorResponse, successResponse } from "@/shared/http/response"
import logger from "@/shared/logger"
import { NextRequest, NextResponse } from "next/server"
import { z, ZodError } from "zod"

type AppResponse<T = any> =
    | Promise<NextResponse<T>>
    | NextResponse<T>
    | Promise<[T, string?, number?]>
    | [T, string?, number?]
    | Promise<T>
    | T

// Handler that takes no arguments
type HandlerNoArgs<T = any> = () => AppResponse<T>

// Handler that takes NextRequest and optional additional args
type HandlerWithRequest<T = any, Args extends any[] = any[]> = (
    req: NextRequest,
    ...args: Args
) => AppResponse<T>

type Handler<T = any, Args extends any[] = any[]> = HandlerNoArgs<T> | HandlerWithRequest<T, Args>

export function globalErrorHandler<T = any, Args extends any[] = any[]>(handler: Handler<T, Args>) {
    return async (req: NextRequest, ...args: Args): Promise<NextResponse> => {
        try {
            const ip = req.headers.get("x-forwarded-for") || "0.0.0.0"
            const { success } = await globalLimiter(3, "1 m", ip)
            if (!success) {
                return errorResponse("Too many requests", 429)
            }
            const result = await handler(req, ...args)

            if (result instanceof NextResponse) return result
            if (Array.isArray(result)) return successResponse(...result)
            return successResponse(result)
        } catch (err: unknown) {
            return handleError(err)
        }
    }
}


const handleError = (err: unknown) => {
    const notProduction = process.env.NODE_ENV !== "production"
    if (err instanceof ApplicationException) {
        // Case 1: Known Application Exception
        const log = `[APPLICATION API (${err.name}):${err.status}] ${err.message}`
        // logger.error({ error_details: err.err_details }, log)
        logger.error(log)
        return errorResponse(err.message, err.status, err.err_details)
    } else if (err instanceof ZodError) {
        // Case 2: Zod Validation Error
        const log = `[VALIDATION (${err.name}):422]: ${err.message}`
        // logger.error({ error_details: z.treeifyError(err) }, log)
        logger.error(log)
        return errorResponse(err.message, 422, z.treeifyError(err))
    }

    // Determine the message to send back
    // In Development: Send the specific error message for debugging
    // In Production: Send a generic message to avoid leaking security details
    else if (err instanceof Error) {
        // Case 3: Generic Error
        const stack = notProduction ? err.stack : undefined,
            message = notProduction ? err.message : "Internal Server Error",
            log = `[UNHANDLED (${err.name}):500]: ${message}`

        // logger.error({ error_details: stack }, log)
        logger.error(log)
        return errorResponse(message, 500, stack)
    }
    // Case 4: Unknown Error Type example: throw "string error"
    const message = notProduction ? String(err) : "Unknown error occurred",
        log = `[UNHANDLED UNKNOWN:500]: ${message}`
    logger.error(log)
    return errorResponse(message, 500)
}
