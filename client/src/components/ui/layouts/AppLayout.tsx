import { MobileSidebarTrigger, SidebarInset, SidebarProvider } from "@/components/ui/shadcn/sidebar"
import CompactSidebar from "../GlobalComponents/SideBars/CompactSidebar"

const AppLayout = ({ children }: { children: React.ReactNode }) => {
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

export default AppLayout
