import { errorResponse } from "./api.response"

export const handleErrors = (error: unknown) => {
  let statusCode = 500
  let message = "Internal server error"
  let details: any = null

  if (error instanceof Error) {
    message = error.message
    if ("statusCode" in error) {
      statusCode = (error as any).statusCode
      details = (error as any).cause ?? null
    }
  }

  return errorResponse(message, statusCode, details)
}