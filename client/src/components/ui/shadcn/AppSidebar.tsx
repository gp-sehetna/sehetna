import {
    Info,
    LucideProps,
    Map,
    ShieldCheck,
    Telescope,
    Waypoints
} from "lucide-react"

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
import Flex from "../Flex"
import Logo from "../GlobalControls/Logo"
import NavLink from "../NavLink"

type LinkType = {
    title: string
    url: string
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}
const items: LinkType[] = [
    // { title: "Log In", url: "/authenticate/login", icon: Home},
    // { title: "Sign Up", url: "/authenticate/signup" , icon: Home},
    { title: "Live Map", url: "/map", icon: Map },
    { title: "Data Explorer", url: "/data-explorer", icon: Telescope },
    { title: "Methodology", url: "/methodology", icon: Waypoints },
    // { title: "Account", url: "/settings/account" , icon: Home},
    { title: "Security", url: "/settings/security", icon: ShieldCheck },
    { title: "Help & Support", url: "/support", icon: Info },
]
const AppSidebar = () => {
    return (
        <Sidebar collapsible="icon" className="relative!  ">
            <SidebarContent className="">
                <SidebarGroup className="flex h-full flex-col justify-between glassy!">
                    <Flex direction="col" gap={4} >
                        <SidebarTrigger className="z-100 mb-16 size-5 " />
                        <Logo size={32} />
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title} >
                                        <SidebarMenuButton asChild tooltip={item.title} >
                                            <NavLink href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </NavLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </Flex>
                    <div className="mt-auto">img</div>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar
