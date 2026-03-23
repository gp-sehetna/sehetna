import { Metadata } from "next"
import MoreAboutUsClient from "@/components/ui/sections/MoreAboutUsClient"

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about Sehetna, our goals, and how we aim to improve healthcare transparency and accessibility.",
    alternates: {
        canonical: "/more-about-us",
    },
}

export default function MoreAboutUsPage() {
    return <MoreAboutUsClient />
}
