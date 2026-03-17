import MapLayout from "@/components/ui/layouts/MapLayout"
import MapView from "@/components/ui/map/MapView"
import MapTooltip from "@/hooks/map/MapTooltip"

const MainMapLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <MapLayout>
            <MapView>{children}</MapView>
            <MapTooltip />
        </MapLayout>
    )
}

export default MainMapLayout
