// import { getAccessToken } from "@/lib/auth"
// import { AxiosInstance } from "axios"

// export function applyInterceptors(client: AxiosInstance) {
//     client.interceptors.request.use(
//         (config) => {
//             const token = getAccessToken()

//             if (token) {
//                 config.headers.Authorization = `Bearer ${token}`
//             }

//             return config
//         },
//         (error) => Promise.reject(error)
//     )

//     client.interceptors.response.use(
//         (res) => res,
//         async (error) => {
//             const status = error.response?.status

//             if (status === 401) {
//                 // optional: refresh token logic
//                 // await refreshToken();
//             }

//             return Promise.reject(error)
//         }
//     )
// }

// import { getAccessToken } from "../auth"

// export async function requestInterceptor(config: RequestInit): Promise<RequestInit> {
//     const token = getAccessToken()

//     if (token) {
//         config.headers = {
//             ...config.headers,
//             Authorization: `Bearer ${token}`,
//         }
//     }

//     return config
// }

// export async function responseInterceptor(res: Response) {
//     if (res.status === 401) {
//         // optional: refresh / redirect
//     }
//     return res
// }
