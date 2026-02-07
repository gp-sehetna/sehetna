import { Info, LogIn, LucideProps, Map, ShieldCheck, Telescope, Waypoints } from "lucide-react"

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
import { ForwardRefExoticComponent, RefAttributes } from "react"
import Logo from "@/components/ui/GlobalControls/Logo"
import NavLink from "@/components/ui/NavLink"

type LinkType = {
    title: string
    url: string
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}
const navigations: LinkType[] = [
    { title: "Live Map", url: "/map", icon: Map },
    { title: "Data Explorer", url: "/data-explorer", icon: Telescope },
    { title: "Methodology", url: "/methodology", icon: Waypoints },
    { title: "Security", url: "/settings/security", icon: ShieldCheck },
    { title: "Help & Support", url: "/support", icon: Info },
]
const CompactSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    return (
        <>
            <Sidebar collapsible="icon" {...props} className="  z-1000 relative">
                <SidebarHeader>
                    <Logo size={32} />
                </SidebarHeader>
                <SidebarTrigger className="z-1000" />
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Pages</SidebarGroupLabel>
                        <SidebarMenu>
                            {navigations.map((navigation) => (
                                <SidebarMenuItem key={navigation.title}>
                                    <SidebarMenuButton
                                        className="rounded-lg"
                                        asChild
                                        size="sm"
                                        tooltip={navigation.title}
                                    >
                                        <NavLink href={navigation.url}>
                                            <navigation.icon />
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
