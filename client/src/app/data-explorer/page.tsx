import Divider from "@/components/ui/GlobalControls/Divider"
import { Metadata } from "next"
import Image from "next/image"
import DataExplorerCrumb from "@/components/ui/GlobalComponents/Breadcrumbs/DataExplorerCrumb"
import ScenariosDataTable from "@/features/scenarios/components/ScenarioDataTable"

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
        <section className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between p-6">
                <div className="space-y-2">
                    <h4 className="font-semibold">Data Explorer</h4>
                    <p className="text-muted-foreground text-sm">
                        Explore available datastore entries, metadata, and time coverage.
                    </p>
                </div>
                <div>
                    <Image src="/images/cubes.svg" alt="Cubes" width={75} height={75} />
                </div>
            </div>
            <Divider hideDecorations />
            <div className="flex flex-col gap-4 p-4">
                <DataExplorerCrumb />
                <ScenariosDataTable />
                {/* <DataStoreCardGrid /> */}
            </div>
        </section>
    )
}

export default DataExplorerPage
