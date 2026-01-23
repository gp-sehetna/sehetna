import { NextRequest } from "next/server"

type Middleware = ((req: NextRequest, context?: any) => Promise<void>)

export const chainMiddlewares = (...middlewares: Middleware[]) => {
    
    return async (req: NextRequest, context?: any) => {
        for (const middleware of middlewares) {
                await middleware(req, context)
        }
    }
}
