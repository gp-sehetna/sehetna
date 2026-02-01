import ky from "ky"

const api = ky.create({
    prefixUrl: "/",
    credentials: "include",
    timeout: process.env.NODE_ENV !== "production" ? 10000000 : 20000,
    headers: {
        "Content-Type": "application/json",
    },
})

export default api
