import { LogIn } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/shadcn/sidebar"
import Logo from "@/components/ui/GlobalControls/Logo"
import NavLink from "@/components/ui/NavLink"
import { compactSidebarItems } from "../nav/navigation-items"

const CompactSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    return (
        <>
            <Sidebar collapsible="icon" {...props} className="relative">
                <SidebarHeader>
                    <Logo size={32} />
                </SidebarHeader>
                <SidebarTrigger />
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Pages</SidebarGroupLabel>
                        <SidebarMenu>
                            {compactSidebarItems.map((navigation) => (
                                <SidebarMenuItem key={navigation.title}>
                                    <SidebarMenuButton
                                        className="rounded-lg"
                                        asChild
                                        size="sm"
                                        tooltip={navigation.title}
                                    >
                                        <NavLink href={navigation.href}>
                                            {navigation.icon && <navigation.icon />}
                                            <span>{navigation.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton variant="black" className="rounded-xl" asChild>
                                <NavLink href="/authenticate/login">
                                    <LogIn size={16} />
                                    <span className="text-xs">Log In</span>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        </>
    )
}

export default CompactSidebar
