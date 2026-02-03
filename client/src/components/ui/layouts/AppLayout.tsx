import CompactSidebar from "@/components/ui/GlobalComponents/SideBars/CompactSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/shadcn/sidebar"
import MainSidebar from "../GlobalComponents/SideBars/MainSidebar"

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <SidebarInset className="flex-1">{children}</SidebarInset>
        </SidebarProvider>
    )
}

export default AppLayout
