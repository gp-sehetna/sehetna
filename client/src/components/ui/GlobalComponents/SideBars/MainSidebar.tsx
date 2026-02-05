import { ArrowLeft } from "lucide-react"
import { MapGeoJSONFeature } from "maplibre-gl"
import Flex from "../../Flex"
import { redirect } from "next/navigation"

type SideBarType = {
    clickedcountryProps: MapGeoJSONFeature | null
}

const MainSidebar = ({ clickedcountryProps }: SideBarType) => {
    if (!clickedcountryProps) return

    console.log("clicked country props -> ", clickedcountryProps)

    return (
        <div className="glassy flex-1 min-w-full overflow-visible rounded-lg border p-3">
            <Flex className=" items-center justify-start" gap={2}>
                <ArrowLeft className=" cursor-pointer" onClick={() => redirect("/map")}   />
                <h5>{clickedcountryProps?.properties.NAME}</h5>
            </Flex>
        </div>
    )
}

export default MainSidebar
