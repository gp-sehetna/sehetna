import { SidebarInset, SidebarProvider } from "@/components/ui/shadcn/sidebar"
import CompactSidebar from "../GlobalComponents/SideBars/CompactSidebar"

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <SidebarInset className="flex-1">
                <div className="flex h-screen w-full">
                    <CompactSidebar />
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default AppLayout
