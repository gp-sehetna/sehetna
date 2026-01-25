import { NextResponse } from "next/server"

export const successResponse = (data: any, status = 200, message = undefined) => {
    return NextResponse.json({ success: true, message, ...data }, { status })
}

export const errorResponse = (message: string, status = 400, err_details?: unknown) => {
    return NextResponse.json({ success: false, message, err_details }, { status })
}
