import AppLayout from "@/components/ui/layouts/AppLayout"
import MapView from "@/components/ui/map/MapView"

const MapLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AppLayout>
            <div className="flex h-screen w-full flex-col items-center justify-center">
                <MapView children={children} />
            </div>
        </AppLayout>
    )
}

export default MapLayout
