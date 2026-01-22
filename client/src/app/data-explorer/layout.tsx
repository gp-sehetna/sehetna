import AppSidebar from "@/components/ui/shadcn/AppSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/shadcn/sidebar"

const DataExplorerLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex-1">{children}</SidebarInset>
        </SidebarProvider>
    )
}

export default DataExplorerLayout
