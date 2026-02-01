import { NextResponse } from "next/server"

export type SuccessResponseType = {
    success: true
    message: string
} & Record<string, any>

export type ErrorResponseType = {
    success: false
    message: string
    status_code: number
    err_details?: unknown
}

export type AppResponseType = SuccessResponseType | ErrorResponseType

export const successResponse = <T = unknown>(
    data: T,
    message = "Request was successful",
    status = 200
) => {
    return NextResponse.json<{ success: true; message: string; data?: T }>(
        { success: true, message, ...data },
        { status }
    )
}

export const errorResponse = (message: string, status = 400, err_details?: unknown) => {
    return NextResponse.json<ErrorResponseType>(
        { success: false, status_code: status, message, err_details },
        { status }
    )
}
