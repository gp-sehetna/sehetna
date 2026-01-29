import ComingSoon from "@/components/ui/ComingSoon"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about Sehetna, our goals, and how we aim to improve healthcare transparency and accessibility.",
}

const page = () => {
    return <ComingSoon title="About Us" description="Learn about Sehetna and our mission" />
}

export default page
