import { DatePickerSimple } from "@/components/ui/GlobalControls/DatePickerSimple"
import { ArrowLeft } from "lucide-react"
import { GeoJSONFeature } from "maplibre-gl"
import { Dispatch } from "react"

import HealthOutcomeCharts from "@/components/ui/map/HealthOutcomeCharts"
import { Card, CardHeader, CardContent } from "@/components/ui/shadcn/card"

export type MapSidebarProps = {
    clickedZone: GeoJSONFeature | null

    date: Date | undefined
    setDate: Dispatch<Date | undefined>
    closeCountryDetails: () => void
}

const MapSidebar = ({ date, setDate, clickedZone, closeCountryDetails }: MapSidebarProps) => {
    return (
        <>
            <div className="absolute inset-0 flex max-h-screen w-full flex-col gap-2 overflow-hidden p-4 backdrop-blur-xs md:w-1/3 md:min-w-md md:backdrop-blur-none">
                {clickedZone && (
                    <Card className="glassy flex h-full min-w-full flex-col overflow-hidden rounded-2xl border bg-neutral-100/40">
                        <CardHeader className="flex flex-row items-center gap-2 border-b p-4">
                            <ArrowLeft className="cursor-pointer" onClick={closeCountryDetails} />
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
            </div>
        </>
    )
}

export default MapSidebar
