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
                <div className="relative z-100 flex h-[calc(100vh-20px)]  w-full flex-col items-start justify-start gap-2 p-2 backdrop-blur-xs md:backdrop-blur-none my-auto md:w-1/3 md:min-w-md md:p-4">
                    <div className="glassy min-w-full flex-1 rounded-2xl border p-4">
                        <Flex className="items-center justify-start" gap={2}>
                            <ArrowLeft className="cursor-pointer" onClick={closeCountryDetails} />
                            <h5>{clickedZone.properties.countryName}</h5>
                        </Flex>
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
