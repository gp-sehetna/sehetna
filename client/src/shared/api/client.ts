import { handleErrors, handleUnauthorized } from "@/shared/api/hooks"
import ky from "ky"

const core = ky.create({
    timeout: process.env.NODE_ENV !== "production" ? 5 * 60 * 1000 : 2 * 60 * 1000,
    hooks: {
        afterResponse: [handleErrors, handleUnauthorized],
    },
})

const api = core.extend({
    prefixUrl: "/",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
})

const externalApi = core.extend({})

export { api, externalApi }
