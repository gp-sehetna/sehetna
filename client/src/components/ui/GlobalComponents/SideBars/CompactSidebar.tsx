import { Info, LogIn, LucideProps, Map, ShieldCheck, Telescope, Waypoints } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/shadcn/sidebar"
import { ForwardRefExoticComponent, RefAttributes } from "react"
import Flex from "../../Flex"
import Logo from "../../GlobalControls/Logo"
import NavLink from "../../NavLink"
import { Button } from "../../shadcn/button"

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
const CompactSidebar = () => {
    return (
        <Sidebar collapsible="icon" className="relative overflow-visible border-neutral-300">
            <SidebarContent className="overflow-visible!">
                <SidebarGroup className="flex h-full flex-col justify-between overflow-visible">
                    <Flex direction="col" gap={4}>
                        <Logo size={32} />
                        <SidebarTrigger />
                        <SidebarGroupContent>
                            <SidebarMenu className="peer-data-[state=collapsed]:items-center">
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
                        </SidebarGroupContent>
                    </Flex>
                    <div className="mt-auto">
                        <Button size="icon" asChild className="rounded-full" variant="black">
                            <NavLink href="/authenticate/login">
                                <LogIn size={16} />
                            </NavLink>
                        </Button>
                    </div>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default CompactSidebar
