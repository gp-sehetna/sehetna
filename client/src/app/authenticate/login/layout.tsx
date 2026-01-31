import { Metadata } from "next"

export const metadata: Metadata = {
    title: {
        default: "Log In",
        template: "%s · Sehetna Authentication",
    },
    description: "Access your Sehetna account to explore healthcare insights and data.",
}

export default function GlobalAuthenticationLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
