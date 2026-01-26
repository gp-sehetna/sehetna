import ky from "ky"

const api = ky.create({
    prefixUrl: "/",
    credentials: "include",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    hooks: {
        beforeRequest: [
            (req) => {
                // TODO: Add auth token
                req.headers.set("Authorization", `Bearer access_token`)
                console.log("Request:", req.method, req.url)
                return req
            },
        ],
        // Handle error responses globally
        afterResponse: [
            // Unauthorized handler
            (req, opts, res) => {
                if (res.status !== 401) return res

                // optional: refresh token logic & retry original request
                // const {token} = await ky.post('https://example.com/auth/refresh').json();
                // return ky.retry({
                //     request: new Request(_request, {headers: {"Authorization": `Bearer ${token}`}}),
                //     code: 'TOKEN_REFRESHED'
                // });
            },
        ],
    },
})

export default api

// import axios, { AxiosInstance } from "axios"
// import { applyInterceptors } from "./interceptors"

// export function createClient(baseURL: string): AxiosInstance {
//     return axios.create({
//         baseURL,
//         withCredentials: true, // cookies (important)
//         timeout: 10_000,
//         headers: {
//             "Content-Type": "application/json",
//         },
//     })
// }

// const nextApi = createClient("/api")
// const aiApi = createClient("/ai")
// applyInterceptors(nextApi)
// applyInterceptors(aiApi)

// export { nextApi, aiApi }

// import { requestInterceptor, responseInterceptor } from "./interceptors"

// type FetchMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
// type FetchConfig = {
//     headers?: HeadersInit
//     cache?: RequestCache
//     next?: NextFetchRequestConfig
// }

// async function request<T>(
//     method: FetchMethod,
//     endpoint: string,
//     body?: unknown,
//     config: FetchConfig = {}
// ): Promise<T> {
//     let init: RequestInit = {
//         method,
//         cache: config.cache ?? "no-store",
//         next: config.next,
//         headers: {
//             "Content-Type": "application/json",
//             ...config.headers,
//         },
//         body: body ? JSON.stringify(body) : undefined,
//     }

//     init = await requestInterceptor(init)

//     const res = await fetch(endpoint, init)

//     await responseInterceptor(res)

//     if (!res.ok) {
//         const text = await res.text()
//         throw new Error(`[${method}] ${endpoint} → ${res.status}: ${text}`)
//     }

//     return res.json()
// }

// export const serverApi = {
//     get<T>(endpoint: string, config?: FetchConfig) {
//         return request<T>("GET", endpoint, undefined, config)
//     },

//     post<T>(endpoint: string, body?: unknown, config?: FetchConfig) {
//         return request<T>("POST", endpoint, body, config)
//     },

//     put<T>(endpoint: string, body?: unknown, config?: FetchConfig) {
//         return request<T>("PUT", endpoint, body, config)
//     },

//     patch<T>(endpoint: string, body?: unknown, config?: FetchConfig) {
//         return request<T>("PATCH", endpoint, body, config)
//     },

//     delete<T>(endpoint: string, config?: FetchConfig) {
//         return request<T>("DELETE", endpoint, undefined, config)
//     },
// }
