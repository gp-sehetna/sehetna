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
    if (err instanceof ApplicationException) {
        const log = `[APPLICATION API (${err.name}):${err.status}] ${err.message}`
        logger.error({ error_details: err.err_details }, log)
        return errorResponse(log, err.status, err.err_details)
    } else if (err instanceof ZodError) {
        const log = `[VALIDATION (${err.name}):422]: ${err.message}`
        logger.error({ error_details: z.treeifyError(err) }, log)
        return errorResponse(log, 422, z.treeifyError(err))
    }
    // Determine the message to send back
    // In Development: Send the specific error message for debugging
    // In Production: Send a generic message to avoid leaking security details
    else if (err instanceof Error) {
        const notProduction = process.env.NODE_ENV !== "production",
            stack = notProduction ? err.stack : undefined,
            message = notProduction ? err.message : "Internal Server Error",
            log = `[UNHANDLED (${err.name}):500]: ${message}`

        logger.error({ error_details: stack }, log)
        return errorResponse(log, 500, stack)
    }
    return errorResponse("Unknown error occurred", 500)
}
