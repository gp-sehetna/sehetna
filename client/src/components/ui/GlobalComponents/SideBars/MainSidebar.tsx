import { ArrowLeft } from "lucide-react"
import { MapGeoJSONFeature } from "maplibre-gl"
import Flex from "../../Flex"
import { redirect } from "next/navigation"

type SideBarType = {
    clickedcountryProps: MapGeoJSONFeature | null
}

const MainSidebar = ({ clickedcountryProps }: SideBarType) => {
    if (!clickedcountryProps) return


    return (
        <div className="glassy min-w-full flex-1 overflow-visible rounded-lg border p-3">
            <Flex className="items-center justify-start" gap={2}>
                <ArrowLeft className="cursor-pointer" onClick={() => redirect("/map")} />
                <h5>{clickedcountryProps?.properties.countryName}</h5>
            </Flex>
        </div>
    )
}

export default MainSidebar
