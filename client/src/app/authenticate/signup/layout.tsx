import { Metadata } from "next"

export const metadata: Metadata = {
    title: {
        default: "Sign Up",
        template: "%s · Sehetna Authentication",
    },
    description: "Create a new account on Sehetna to access healthcare insights and data.",
}

export default function GlobalAuthenticationLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
