import { MapDrawer } from "@/components/ui/drawers/MapLegendDrawer"
import Legend from "@/components/ui/legend/Legend"
import MapCog from "@/components/ui/map/MapCog"
import MapLayerSelector, { LayerSelectorProps } from "@/components/ui/map/MapLayerSelector"
import MapSidebar, { MapSidebarProps } from "@/components/ui/map/MapSidebar"
import { MapThemeSelector, MapThemes } from "@/components/ui/map/MapThemeSelector"
import { cn, toDMS } from "@/lib/utils"
import { ActiveSlug } from "@/shared/config/map"
import { useMapStore } from "@/stores/map/use-map"
import { Dispatch, memo, useMemo, useState } from "react"
import { NavigationControl } from "react-map-gl/maplibre"

type BottomRightProps = ActiveSlug & {
    onLayerSelect: Dispatch<string>
}
type BottomLeftProps = MapSidebarProps

const BottomRightContent = ({ slug, onLayerSelect }: BottomRightProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const onChange = (healthOutcome: string) => {
        setIsOpen(false)
        onLayerSelect(healthOutcome)
    }

    return (
        <div className={cn("absolute right-4 bottom-4 w-[calc(100%-30px)] md:w-65")}>
            <div className="mb-2 ml-auto max-w-fit md:max-w-full">
                <MapThemeSelector />
            </div>
            <div className="hidden flex-col gap-2 md:flex">
                <LayerSelectorTrigger
                    className="transition-shadow hover:shadow-md"
                    healthOutcome={slug.healthOutcome}
                    onLayerSelect={onLayerSelect}
                />
                <Legend healthOutcome={slug.healthOutcome} />
            </div>
            <div className="md:hidden">
                <MapDrawer
                    title="Map Layers"
                    description="Select a layer to view on the map"
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                >
                    <div className="flex justify-center gap-2 p-2">
                        <MapThemes />
                    </div>
                    <MapLayerSelector
                        className="border-0"
                        healthOutcome={slug.healthOutcome}
                        onLayerSelect={onChange}
                    />
                </MapDrawer>
            </div>
        </div>
    )
}
const LayerSelectorTrigger = ({ healthOutcome, onLayerSelect, className }: LayerSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "bg-muted text-muted-foreground hover:text-foreground mx-auto w-10/12 cursor-pointer rounded-t-xl border border-b-0 text-center",
                    isOpen ? "-mb-2" : "-mb-4"
                )}
            >
                <small>Layer Selector</small>
            </div>
            <MapLayerSelector
                className={cn(
                    className,
                    "base-transition! overflow-hidden",
                    isOpen ? "max-h-full p-2" : "max-h-0 border-0 p-0"
                )}
                healthOutcome={healthOutcome}
                onLayerSelect={onLayerSelect}
            />
        </>
    )
}
const BottomLeftContent = (props: BottomLeftProps) => {
    return (
        <div className="absolute flex max-h-screen w-full flex-col gap-2 overflow-hidden p-4 backdrop-blur-xs md:w-1/3 md:min-w-md md:backdrop-blur-none">
            <MapSidebar {...props} />
        </div>
    )
}

const TopCenterContent = memo(() => {
    const markerCoords = useMapStore((s) => s.markerCoords)
    const hoveredCoords = useMapStore((s) => s.hoveredCoords)

    const markerText = useMemo(() => {
        if (!markerCoords) return null
        return `${toDMS(markerCoords.lat, "lat")}, ${toDMS(markerCoords.lng, "lng")}`
    }, [markerCoords])

    const hoveredText = useMemo(() => {
        if (!hoveredCoords) return null
        return `${toDMS(hoveredCoords.lat, "lat")}, ${toDMS(hoveredCoords.lng, "lng")}`
    }, [hoveredCoords])

    if (!markerText && !hoveredText) return null

    return (
        <div className="absolute top-0 z-10 flex w-full justify-center">
            <small className="text-muted-foreground">
                {markerText}
                {markerText && hoveredText && " ("}
                {hoveredText}
                {markerText && hoveredText && ")"}
            </small>
        </div>
    )
})

TopCenterContent.displayName = "TopCenterContent"

const TopRightContent = () => {
    return (
        <>
            <div className="absolute right-0 z-10 mt-2.5 mr-2.5 flex">
                <MapCog />
            </div>
            <NavigationControl position="top-right" showCompass={false} visualizePitch />
        </>
    )
}

const MapControls = (props: BottomLeftProps & BottomRightProps) => {
    return (
        <>
            <TopCenterContent />
            <TopRightContent />
            <BottomLeftContent
                slug={props.slug}
                onLayerSelect={props.onLayerSelect}
                onSubmitForm={props.onSubmitForm}
                closeSidebar={props.closeSidebar}
            />
            <BottomRightContent slug={props.slug} onLayerSelect={props.onLayerSelect} />
        </>
    )
}

export default MapControls
