import CompactSidebar from "@/components/ui/GlobalComponents/SideBars/CompactSidebar"
import { SidebarProvider, SidebarInset, MobileSidebarTrigger } from "@/components/ui/shadcn/sidebar"

const DataExplorerLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <SidebarInset>
                <MobileSidebarTrigger />
                <CompactSidebar />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DataExplorerLayout
