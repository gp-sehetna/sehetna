import Flex from "@/components/ui/Flex"
import { DatePickerSimple } from "@/components/ui/GlobalControls/DatePickerSimple"
import { ArrowLeft } from "lucide-react"
import { GeoJSONFeature } from "maplibre-gl"
import { Dispatch } from "react"

import HealthOutcomeCharts from "./HealthOutcomeCharts"

export type MainSidebarProps = {
    clickedZone: GeoJSONFeature | null

    date: Date | undefined
    setDate: Dispatch<Date | undefined>
    closeCountryDetails: () => void
}
type MapCountryDetailsProps = MainSidebarProps

const MapCountryDetails = ({
    date,
    setDate,
    clickedZone,
    closeCountryDetails,
}: MapCountryDetailsProps) => {
    return (
        <>
            {clickedZone && (
                <div className="absolute flex h-full w-full flex-col gap-2 p-4 backdrop-blur-xs md:w-1/3 md:min-w-md md:backdrop-blur-none">
                    <div className="glassy flex min-w-full flex-1 flex-col rounded-2xl border p-4">
                        <Flex className="items-center justify-start" gap={2}>
                            <ArrowLeft className="cursor-pointer" onClick={closeCountryDetails} />
                            <h5>{clickedZone.properties.countryName}</h5>
                        </Flex>

                        <div className="flex flex-1 items-center justify-center">
                            <HealthOutcomeCharts />
                        </div>
                    </div>
                    <DatePickerSimple
                        date={date}
                        setDate={setDate}
                        className="relative mt-auto w-full min-w-5!"
                    />
                </div>
            )}
        </>
    )
}

export default MapCountryDetails
