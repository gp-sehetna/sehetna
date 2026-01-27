import ky from "ky"

const api = ky.create({
    prefixUrl: "/",
    credentials: "include",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
})

export default api
