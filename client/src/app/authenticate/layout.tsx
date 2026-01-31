import { BaseAuthenticationLayout } from "@/components/ui/layouts/BaseAuthenticationLayout"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: {
        default: "Sehetna Authentication",
        template: "%s · Sehetna Authentication",
    },
    robots: {
        index: false,
        follow: false,
    },
}

export default function GlobalAuthenticationLayout({ children }: { children: React.ReactNode }) {
    return <BaseAuthenticationLayout>{children}</BaseAuthenticationLayout>
}
