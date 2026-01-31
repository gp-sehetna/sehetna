import { Metadata } from "next"

// Generate some title and description common with these metadata below
export const metadata: Metadata = {
    title: {
        default: "Secure Access",
        template: "%s · Sehetna Authentication",
    },
    description:
        "Verified access to the Sehetna platform. Manage your credentials and account security settings.",
}

export default function GlobalAuthenticationLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
