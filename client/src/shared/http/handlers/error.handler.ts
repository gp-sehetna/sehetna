// import { ApplicationException } from "@/shared/http/errors"
// import { errorResponse, successResponse } from "@/shared/http/response"
// import logger from "@/shared/logger"
// import { NextRequest, NextResponse } from "next/server"

// type AppResponse<T = any> = Promise<NextResponse<T>> | NextResponse<T> | T

// // Handler that takes no arguments
// type HandlerNoArgs<T = any> = () => AppResponse<T>

// // Handler that takes NextRequest and optional additional args
// type HandlerWithRequest<T = any, Args extends any[] = any[]> = (
//     req: NextRequest,
//     ...args: Args
// ) => AppResponse<T>

// type Handler<T = any, Args extends any[] = any[]> = HandlerNoArgs<T> | HandlerWithRequest<T, Args>

// export function globalErrorHandler<T = any, Args extends any[] = any[]>(handler: Handler<T, Args>) {
//     return async (req?: NextRequest, ...args: Args): Promise<NextResponse> => {
//         try {
//             // Call handler with all available arguments
//             const result = await handler(req as any, ...args)

//             if (result instanceof NextResponse) return result
//             return successResponse(result)
//         } catch (err: unknown) {
//             if (err instanceof ApplicationException) {
//                 logger.error(`API error: ${err}`)
//                 return errorResponse(err.message, err.status, err.err_details)
//             }

//             logger.error(`Unhandled API error: ${err}`)
//             return errorResponse("Unhandled API error", 500)
//         }
//     }
// }


import { ApplicationException } from "@/shared/http/errors"
import { errorResponse, successResponse } from "@/shared/http/response"
import logger from "@/shared/logger"
import { NextRequest, NextResponse } from "next/server"

type AppResponse<T = any> = Promise<NextResponse<T>> | NextResponse<T> | T

// Handler that takes no arguments
type HandlerNoArgs<T = any> = () => AppResponse<T>

// Handler that takes NextRequest and optional additional args
type HandlerWithRequest<T = any, Args extends any[] = any[]> = (
    req: NextRequest,
    ...args: Args
) => AppResponse<T>

type Handler<T = any, Args extends any[] = any[]> = HandlerNoArgs<T> | HandlerWithRequest<T, Args>

export function globalErrorHandler<T = any, Args extends any[] = any[]>(handler: Handler<T, Args>) {
    return async (req?: NextRequest, ...args: Args): Promise<NextResponse> => {
        try {
            // Call handler with all available arguments
            const result = await handler(req as any, ...args)

            if (result instanceof NextResponse) return result
            return successResponse(result)
        } catch (err: unknown) {
            // Case 1: Handled Application Exceptions (User errors, Validation, etc.)
            if (err instanceof ApplicationException) {
                logger.error(`API error: ${err}`)
                return errorResponse(err.message, err.status, err.err_details)
            }

            // Case 2: Unhandled/System Errors (Crashes, DB issues)
            logger.error(`Unhandled API error: ${err}`)
            
            // Determine the message to send back
            // In Development: Send the specific error message for debugging
            // In Production: Send a generic message to avoid leaking security details
            const isDev = process.env.NODE_ENV === 'development';
            
            let message = "Internal Server Error";
            if (isDev && err instanceof Error) {
                message = err.message;
            } else if (typeof err === 'string') {
                message = err;
            }

            return errorResponse(message, 500)
        }
    }
}