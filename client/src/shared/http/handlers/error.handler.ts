import { base, handleError } from "@/shared/http/handlers/base.handler"
import { Handler } from "@/shared/http/types"
import { NextRequest, NextResponse } from "next/server"

export function globalErrorHandler<T = any, Args extends any[] = any[]>(handler: Handler<T, Args>) {
    return async (req: NextRequest, ...args: Args): Promise<NextResponse> => {
        try {
            const result = await handler(req, ...args)
            return base(result)
        } catch (err: unknown) {
            return handleError(err)
        }
    }
}
