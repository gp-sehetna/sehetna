import { ApplicationException } from "@/shared/http/errors"
import { errorResponse, successResponse } from "@/shared/http/response"
import { AppResponse } from "@/shared/http/types"
import logger from "@/shared/logger"
import { NextResponse } from "next/server"
import { z, ZodError } from "zod"

const base = <T = any>(result: AppResponse<T>) => {
    if (result instanceof NextResponse) return result
    if (Array.isArray(result)) return successResponse(...result)
    return successResponse(result)
}

const handleError = (err: unknown) => {
    const notProduction = process.env.NODE_ENV !== "production"
    if (err instanceof ApplicationException) {
        // Case 1: Known Application Exception

        logger.error(`[${err.status}] ${err.name}: ${err.message}`)
        return errorResponse(err.message, err.status, {
            err_details: err.err_details,
            cause: err.cause,
        })
    } else if (err instanceof ZodError) {
        // Case 2: Zod Validation Error
        logger.error(`[422] ${err.name}: ${err.message}`)
        return errorResponse(err.message, 422, { err_details: z.treeifyError(err) })
    }

    // Determine the message to send back
    // In Development: Send the specific error message for debugging
    // In Production: Send a generic message to avoid leaking security details
    else if (err instanceof Error) {
        // Case 3: Generic Error
        const stack = notProduction ? err.stack : undefined,
            message = notProduction ? err.message : "Internal Server Error"

        logger.error(`[500] ${err.name}: ${message}`)
        return errorResponse(message, 500, { err_details: stack })
    }
    // Case 4: Unknown Error Type example: throw "string error"
    const message = notProduction ? String(err) : "Unknown error occurred"
    logger.error(`[500] ${message}`)
    return errorResponse(message, 500)
}

export { base, handleError }
