import MapLayout from "@/components/ui/layouts/MapLayout"
import MapView from "@/components/ui/map/MapView"

const MainMapLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <MapLayout>
            <MapView>{children}</MapView>
        </MapLayout>
    )
}

export default MainMapLayout
