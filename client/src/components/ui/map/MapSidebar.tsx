import { DatePickerSimple } from "@/components/ui/GlobalControls/DatePickerSimple"
import { ArrowLeft } from "lucide-react"

import HealthOutcomeCharts from "@/components/ui/map/MapSidebarContent"
import { Card, CardContent, CardHeader } from "@/components/ui/shadcn/card"
import { useDateUrlSync } from "@/hooks/map/use-date"
import { ActiveSlug } from "@/shared/config/map"
import { useMapStore } from "@/stores/map/use-map"

export type MapSidebarProps = ActiveSlug & {
    closeSidebar: () => void
}

const MapSidebar = ({ slug, closeSidebar }: MapSidebarProps) => {
    const { clickedZone } = useMapStore()
    const { date, setDate } = useDateUrlSync(slug)
    return (
        <>
            {clickedZone && (
                <Card className="glassy flex h-full min-w-full flex-col overflow-hidden rounded-2xl border bg-neutral-100/40">
                    <CardHeader className="flex flex-row items-center gap-2 border-b p-4">
                        <ArrowLeft className="cursor-pointer" onClick={closeSidebar} />
                        <h5>{clickedZone.properties.countryName}</h5>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4 overflow-y-auto p-4">
                        <HealthOutcomeCharts />
                    </CardContent>
                </Card>
            )}

            <div className="glassy flex min-w-full shrink-0 flex-col rounded-2xl border p-4">
                <DatePickerSimple date={date} setDate={setDate} className="relative w-full" />
            </div>
        </>
    )
}

export default MapSidebar
