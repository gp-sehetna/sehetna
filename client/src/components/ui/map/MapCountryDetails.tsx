import Flex from "@/components/ui/Flex"
import { DatePickerSimple } from "@/components/ui/GlobalControls/DatePickerSimple"
import { ArrowLeft } from "lucide-react"
import { GeoJSONFeature } from "maplibre-gl"
import { Dispatch } from "react"

export type MainSidebarProps = {
    clickedZone: GeoJSONFeature | null

    date: Date | undefined
    setDate: Dispatch<Date | undefined>
    closeCountryDetails: () => void
}

const MapCountryDetails = ({
    date,
    setDate,
    clickedZone,
    closeCountryDetails,
}: MainSidebarProps) => {
    return (
        <>
            {clickedZone && (
                <div className="z-50 flex h-full w-1/3 min-w-md flex-col items-start justify-start">
                    <div className="glassy min-w-full flex-1 rounded-2xl border p-4">
                        <Flex className="items-center justify-start" gap={2}>
                            <ArrowLeft className="cursor-pointer" onClick={closeCountryDetails} />
                            <h5>{clickedZone.properties.countryName}</h5>
                        </Flex>
                    </div>
                    <DatePickerSimple
                        date={date}
                        setDate={setDate}
                        className="mt-auto w-full min-w-5!"
                    />
                </div>
            )}
        </>
    )
}

export default MapCountryDetails
