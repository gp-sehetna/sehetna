import Legend from "@/components/ui/legend/Legend"
import MapCog from "@/components/ui/map/MapCog"
import MapLayerSelector from "@/components/ui/map/MapLayerSelector"
import { cn, toDMS } from "@/lib/utils"
import { ActiveSlug } from "@/shared/config/map"
import { useMapStore } from "@/stores/map/use-map"
import { useThemeStore } from "@/stores/map/use-theme"
import { Dispatch, memo, useMemo, useState } from "react"
import { NavigationControl } from "react-map-gl/maplibre"
import { MapLegendDrawer } from "../drawers/MapLegendDrawer"
import MapSidebar, { MapSidebarProps } from "./MapSidebar"
import MapThemeSelector from "./MapThemeSelector"

type BottomRightProps = ActiveSlug & {
    onLayerSelect: Dispatch<string>
}
type BottomLeftProps = MapSidebarProps

const BottomRightContent = ({ slug, onLayerSelect }: BottomRightProps) => {
    const { theme } = useThemeStore()
    const [isOpen, setIsOpen] = useState(false)

    const onChange = (healthOutcome: string) => {
        setIsOpen(false)
        onLayerSelect(healthOutcome)
    }

    return (
        <div className={cn("absolute right-4 bottom-4 w-[calc(100%-30px)] md:w-65")}>
            <div className="hidden flex-col gap-2 md:flex">
                <MapThemeSelector />
                <MapLayerSelector
                    healthOutcome={slug.healthOutcome}
                    onLayerSelect={onLayerSelect}
                />
                <Legend healthOutcome={slug.healthOutcome} />
            </div>
            <div className="md:hidden">
                <MapLegendDrawer
                    title="Map Layers"
                    description="Select a layer to view on the map"
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    trigger={
                        <div
                            tabIndex={0}
                            className="group relative h-3 w-full cursor-pointer overflow-hidden rounded-full border shadow-md transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg focus-visible:scale-[1.02] focus-visible:ring-2 focus-visible:outline-none"
                            style={{ background: theme.gradientCSS }}
                        >
                            <div
                                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                style={{
                                    background:
                                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                                    backgroundSize: "200% 100%",
                                    animation: "shimmer 2s linear infinite",
                                }}
                            />
                        </div>
                    }
                >
                    <MapLayerSelector
                        className="border-0"
                        healthOutcome={slug.healthOutcome}
                        onLayerSelect={onChange}
                    />
                </MapLegendDrawer>
            </div>
        </div>
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
            <BottomLeftContent slug={props.slug} closeSidebar={props.closeSidebar} />
            <BottomRightContent slug={props.slug} onLayerSelect={props.onLayerSelect} />
        </>
    )
}

export default MapControls
