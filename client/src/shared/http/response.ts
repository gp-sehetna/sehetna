import { NextResponse } from "next/server"

interface MessageField {
    message: string
}
interface BaseSuccessResponse extends MessageField {
    success: true
}

type SuccessResponseWithData<T = any> = BaseSuccessResponse & { data: T }

interface BaseErrorResponse extends MessageField {
    success: false
    status_code: number
    err_details?: unknown
}

type AppResponseType = BaseSuccessResponse | BaseErrorResponse

const successResponse = <T = unknown>(
    data: T,
    message = "Request was successful",
    status = 200
) => {
    return NextResponse.json<{ success: true; message: string; data?: T }>(
        { success: true, message, ...data },
        { status }
    )
}

const errorResponse = (message: string, status = 400, err_details?: unknown) => {
    return NextResponse.json<BaseErrorResponse>(
        { success: false, status_code: status, message, err_details },
        { status }
    )
}

export type { BaseSuccessResponse, SuccessResponseWithData, BaseErrorResponse, AppResponseType }
export { successResponse, errorResponse }
