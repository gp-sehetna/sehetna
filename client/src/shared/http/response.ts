import { NextResponse } from "next/server"

export const successResponse = (data: any, message = "Request was successful", status = 200) => {
    return NextResponse.json({ success: true, message, ...data }, { status })
}

export const errorResponse = (message: string, status = 400, err_details?: unknown) => {
    return NextResponse.json(
        { success: false, status_code: status, message, err_details },
        { status }
    )
}
