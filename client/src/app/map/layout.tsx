import AppSidebar from "@/components/ui/GlobalComponents/SideBars/CompactSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/shadcn/sidebar"

const MapLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex-1">{children}</SidebarInset>
        </SidebarProvider>
    )
}

export default MapLayout
