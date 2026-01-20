import axios from "axios"

const apiClient = axios.create({
    // process.env.NEXT_PUBLIC_API_BASE_URL
    baseURL: "http://127.0.0.1:8000",
    timeout: 10000,
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
    },
})

export default apiClient
