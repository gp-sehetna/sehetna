import { ArrowLeft } from "lucide-react"
import Flex from "@/components/ui/Flex"
import { redirect } from "next/navigation"
import { DatePickerSimple } from "@/components/ui/GlobalControls/DatePickerSimple"
import useMapHook from "@/hooks/map/use-map"

export type MainSidebarProps = {
    healthOutcome: string
}

const MapCountryDetails = ({ healthOutcome }: MainSidebarProps) => {
    const { date, setDate, clickedZone, setClickedZone, setMarkerCoords } = useMapHook()

    const closeSideBar = () => {
        setClickedZone(null)
        setMarkerCoords(null)
        redirect(`/map/${healthOutcome}`)
    }

    return (
        <>
            {clickedZone && (
                <div className="z-50 flex h-full w-1/3 min-w-md flex-col items-start justify-start p-4 pb-5">
                    <div className="glassy min-w-full flex-1 rounded-2xl border p-4">
                        <Flex className="items-center justify-start" gap={2}>
                            <ArrowLeft className="cursor-pointer" onClick={closeSideBar} />
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
