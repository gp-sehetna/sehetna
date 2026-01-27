import { INextRequestWithBody } from "@/lib/types/next"
import { BadRequestException } from "@/shared/http/errors"
import { ZodType } from "zod"

// type KeyReqType = keyof NextRequest // 'body' | 'params' | 'query' | 'file'
// type SchemaType = Partial<Record<KeyReqType, ZodType>>

type SchemaType = {
    body?: ZodType
    query?: ZodType
    headers?: ZodType
}

export const validation = (schema: SchemaType) => {
    return async (req: INextRequestWithBody) => {
        const validationErrors: any = []
        // console.log({ schema })
        // Validate body
        if (schema.body) {
            let body: any
            try {
                body = await req.json()
            } catch {
                body = {}
            }

            const result = schema.body.safeParse(body)

            if (!result.success) {
                validationErrors.push({
                    key: "body",
                    issues: result.error.issues.map((issue) => ({
                        message: issue.message,
                        path: issue.path[0],
                    })),
                })
            }

            req.validatedBody = body
        }

        // Validate query
        if (schema.query) {
            const query = Object.fromEntries(req.nextUrl.searchParams)
            const result = schema.query.safeParse(query)
            if (!result.success) {
                validationErrors.push({
                    key: "query",
                    issues: result.error.issues.map((i) => ({
                        message: i.message,
                        path: i.path[0],
                    })),
                })
            }
        }

        // Validate headers
        if (schema.headers) {
            const headers = Object.fromEntries(req.headers)
            const result = schema.headers.safeParse(headers)
            if (!result.success) {
                validationErrors.push({
                    key: "headers",
                    issues: result.error.issues.map((i) => ({
                        message: i.message,
                        path: i.path[0],
                    })),
                })
            }
        }
        // for (const key of Object.keys(schema) as KeyReqType[]) {
        //     if (!schema[key]) continue

        //     const validationResult = schema[key].safeParse(req[key])

        //     if (!validationResult.success) {
        //         const errors = validationResult.error as ZodError
        //         validationErrors.push({
        //             key,
        //             issues: errors.issues.map((issue) => {
        //                 return { message: issue.message, path: issue.path[0] }
        //             }),
        //         })
        //     }
        // }

        if (validationErrors.length) {
            throw new BadRequestException("validation Error", {
                validationErrors,
            })
        }
    }
}
