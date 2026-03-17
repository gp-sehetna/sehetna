import { UserWithoutPassword } from "@/features/auth/auth.types"
import { ClientSession } from "mongoose"
import { NextRequest, NextResponse } from "next/server"

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

type ProtectedHandler<T = any, Args extends any[] = any[]> = (
    req: NextRequest,
    user: UserWithoutPassword,
    ...args: Args
) => AppResponse<T>

type SessionHandler<T = any, Args extends any[] = any[]> = (
    req: NextRequest,
    session: ClientSession,
    ...args: Args
) => AppResponse<T>

type Handler<T = any, Args extends any[] = any[]> = HandlerNoArgs<T> | HandlerWithRequest<T, Args>

interface ErrDetails {
    err_details?: any
    cause?: unknown
    destination?: string
}

export type {
    AppResponse,
    ErrDetails,
    Handler,
    HandlerNoArgs,
    HandlerWithRequest,
    ProtectedHandler,
    SessionHandler,
}
