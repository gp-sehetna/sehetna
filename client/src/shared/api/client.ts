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
    headers: { "Content-Type": "application/json" },
})

const externalApi = core.extend({})

export { api, externalApi }
