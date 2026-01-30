import { NextResponse } from "next/server"

export const successResponse = ({data , status , message}:{data?: any, status?: number, message : string}) => {
    return NextResponse.json({ success: true, message, ...data }, { status })
}

export const errorResponse = (message: string, status = 400, err_details?: unknown) => {
    return NextResponse.json(
        { success: false, status_code: status, message, err_details },
        { status }
    )
}

