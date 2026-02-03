import Flex from "@/components/ui/Flex"
import CompactSidebar from "@/components/ui/GlobalComponents/SideBars/CompactSidebar"
import MainSidebar from "@/components/ui/GlobalComponents/SideBars/MainSidebar"
import AppLayout from "@/components/ui/layouts/AppLayout"
import MapView from "@/components/ui/map/MapView"

const MapLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AppLayout>
            <div className="flex h-screen w-full flex-col items-center justify-center">
                <MapView>{children}</MapView>
            </div>
        </AppLayout>
    )
}

export default MapLayout
