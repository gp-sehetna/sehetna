import CompactSidebar from "@/components/ui/GlobalComponents/SideBars/CompactSidebar"
import MapView from "@/components/ui/map/MapView"
import { SidebarProvider, SidebarInset, MobileSidebarTrigger } from "@/components/ui/shadcn/sidebar"

const MainMapLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <SidebarInset>
                <MobileSidebarTrigger />
                <CompactSidebar />
                <MapView>{children}</MapView>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default MainMapLayout
