import Legend, { LegendProps } from "@/components/ui/legend/Legend"
import MapLayerSelector, { LayerSelectorProps } from "@/components/ui/map/MapLayerSelector"
import { cn } from "@/lib/utils"
import MapSidebar, { MapSidebarProps } from "./MapSidebar"

type BottomRightProps = LayerSelectorProps & LegendProps
type BottomLeftProps = MapSidebarProps

const BottomRightContent = ({ healthOutcome, onLayerSelect }: BottomRightProps) => {
    // Hidden if in mobile && has a clickedZone active
    return (
        <div className={cn("absolute right-4 bottom-4 z-10 flex w-80 flex-col")}>
            <MapLayerSelector healthOutcome={healthOutcome} onLayerSelect={onLayerSelect} />
            <Legend healthOutcome={healthOutcome} />
        </div>
    )
}

const BottomLeftContent = (props: BottomLeftProps) => {
    return <MapSidebar {...props} />
}

const MapControls = (props: BottomLeftProps & BottomRightProps) => {
    return (
        <>
            <BottomLeftContent
                clickedZone={props.clickedZone}
                closeCountryDetails={props.closeCountryDetails}
                date={props.date}
                setDate={props.setDate}
            />
            <BottomRightContent
                healthOutcome={props.healthOutcome}
                onLayerSelect={props.onLayerSelect}
            />
        </>
    )
}

export default MapControls
