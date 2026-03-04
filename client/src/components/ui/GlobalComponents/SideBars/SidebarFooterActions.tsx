"use client"
import { SidebarFooter, SidebarMenu, SidebarMenuItem } from "../../shadcn/sidebar"
import { GuestButton, AuthenticatedUserButton } from "./CompactSidebar"
import { useUserStore } from "@/stores/user/use-user"

export default function SidebarFooterActions() {
    const { user } = useUserStore()
    return (
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    {/* Check if user is logged in */}
                    {!user ? <GuestButton /> : <AuthenticatedUserButton user={user} />}
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    )
}
