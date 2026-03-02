import { ErrDetails } from "@/shared/http/types"
import { NextResponse } from "next/server"

interface MessageField {
    message: string
}
interface BaseSuccessResponse extends MessageField {
    success: true
}

type SuccessResponseWithData<T = any> = BaseSuccessResponse & { data: T }

interface BaseErrorResponse extends MessageField, ErrDetails {
    success: false
    status_code: number
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

const errorResponse = (message: string, status = 400, details?: ErrDetails) => {
    return NextResponse.json<BaseErrorResponse>(
        {
            success: false,
            status_code: status,
            message,
            ...details,
        },
        { status }
    )
}

export { errorResponse, successResponse }
export type { AppResponseType, BaseErrorResponse, BaseSuccessResponse, SuccessResponseWithData }
