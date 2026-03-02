import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"

export class Cookies {
    static createSecure = (seconds: number): Partial<ResponseCookie> => ({
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: seconds,
        path: "/",
    })
}
