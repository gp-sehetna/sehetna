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
            <div className="absolute flex h-full w-full flex-col gap-2 p-4 backdrop-blur-xs md:w-1/3 md:min-w-md md:backdrop-blur-none">
                {clickedZone && (
                    <Card className="glassy flex min-w-full flex-1 flex-col rounded-2xl border bg-neutral-100/40">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                            <ArrowLeft
                                className="text-muted-foreground hover:text-foreground h-5 w-5 cursor-pointer transition"
                                onClick={closeCountryDetails}
                            />
                            <h4>{clickedZone.properties.countryName}</h4>
                        </CardHeader>

                        <CardContent>
                            <HealthOutcomeCharts />
                        </CardContent>
                    </Card>
                )}

                <div className="glassy mt-auto flex min-w-full flex-col rounded-2xl border p-4">
                    <DatePickerSimple date={date} setDate={setDate} className="relative w-full" />
                </div>
            </div>
        </>
    )
}

export default MapSidebar
