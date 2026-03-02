import { handleErrors, handleUnauthorized } from "@/shared/api/hooks"
import ky from "ky"

const core = ky.create({
    timeout: process.env.NODE_ENV !== "production" ? 10000000 : 20000,
    hooks: {
        afterResponse: [handleErrors, handleUnauthorized],
    },
})

const api = core.extend({
    prefixUrl: "/",
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
    },
    hooks: {
        beforeRequest: [
            (request, _options, { retryCount }) => {
                // Only set default auth header on initial request, not on retries
                // (retries may have refreshed token set by beforeRetry)
                if (retryCount === 0) {
                    request.headers.set("Authorization", "token initial-token")
                }
            },
        ],
    },
})

const externalApi = core.extend({})

export { api, externalApi }
