import DataStoreCardGrid from "../../components/ui/GlobalComponents/CardGrid/DataStoreCardGrid"
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
        <section className="flex w-full flex-col gap-4 p-8">
            <div className="space-y-2">
                <h2 className="font-semibold">Data Explorer</h2>
                <p className="text-muted-foreground">
                    Explore available datastore entries, metadata, and time coverage.
                </p>
            </div>
            <DataStoreCardGrid />
        </section>
    )
}

export default DataExplorerPage
