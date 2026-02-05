import AppLayout from "@/components/ui/layouts/AppLayout"
import MapView from "@/components/ui/map/MapView"

const MapLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AppLayout>
            <MapView>{children}</MapView>
        </AppLayout>
    )
}

export default MapLayout
