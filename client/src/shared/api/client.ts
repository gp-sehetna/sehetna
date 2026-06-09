import { handleErrors, handleUnauthorized } from "@/shared/api/hooks"
import ky from "ky"

const isProduction = process.env.NODE_ENV === "production"

const core = ky.create({
    timeout: isProduction ? 5 * 60 * 1000 : 2 * 60 * 1000 * 1000,
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
