import { successResponse } from "@/shared/http/response"
import { AppResponse } from "@/shared/http/types"
import { NextResponse } from "next/server"

const base = <T = any>(result: AppResponse<T>) => {
    if (result instanceof NextResponse) return result
    if (Array.isArray(result)) return successResponse(...result)
    return successResponse(result)
}

export { base }
