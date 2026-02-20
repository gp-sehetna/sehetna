import Legend from "@/components/ui/legend/Legend"
import MapCog from "@/components/ui/map/MapCog"
import MapLayerSelector from "@/components/ui/map/MapLayerSelector"
import { cn } from "@/lib/utils"
import { ActiveSlug } from "@/shared/config/map"
import { Dispatch } from "react"
import { NavigationControl } from "react-map-gl/maplibre"
import MapSidebar, { MapSidebarProps } from "./MapSidebar"

type BottomRightProps = ActiveSlug & {
    onLayerSelect: Dispatch<string>
}
type BottomLeftProps = MapSidebarProps

const BottomRightContent = ({ slug, onLayerSelect }: BottomRightProps) => {
    return (
        <div className={cn("absolute right-4 bottom-4 z-10 flex w-80 flex-col")}>
            <MapLayerSelector healthOutcome={slug.healthOutcome} onLayerSelect={onLayerSelect} />
            <Legend healthOutcome={slug.healthOutcome} />
        </div>
    )
}

const BottomLeftContent = (props: BottomLeftProps) => {
    return (
        <div className="absolute inset-0 flex max-h-screen w-full flex-col gap-2 overflow-hidden p-4 backdrop-blur-xs md:w-1/3 md:min-w-md md:backdrop-blur-none">
            <MapSidebar {...props} />
        </div>
    )
}

const TopRightContent = () => {
    return (
        <>
            <div className="absolute right-0 z-10 mt-[10px] mr-[10px] flex">
                <MapCog />
            </div>
            <NavigationControl position="top-right" showCompass={false} visualizePitch />
        </>
    )
}

const MapControls = (props: BottomLeftProps & BottomRightProps) => {
    return (
        <>
            <TopRightContent />
            <BottomLeftContent slug={props.slug} closeSidebar={props.closeSidebar} />
            <BottomRightContent slug={props.slug} onLayerSelect={props.onLayerSelect} />
        </>
    )
}

export default MapControls
