import ComingSoon from "@/components/ui/ComingSoon"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Data Explorer",
    description:
        "Explore healthcare datasets and insights through Sehetna's interactive data explorer.",
    alternates: {
        canonical: "/data-explorer",
    },
}

const DataExplorerPage = () => {
    return (
        <ComingSoon
            title="Data Explorer"
            description="An interactive data explorer for healthcare datasets and insights."
        />
    )
}

export default DataExplorerPage
