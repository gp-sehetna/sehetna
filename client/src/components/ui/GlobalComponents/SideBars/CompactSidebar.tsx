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
import { Avatar, AvatarFallback } from "@/components/ui/shadcn/avatar"
import { getInitials, stringToColor } from "@/lib/utils/string"

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
                            {/* Check if user is logged in */}
                            {true ? (
                                <GuestButton />
                            ) : (
                                <AuthenticatedUserButton name="Hello World" />
                            )}
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        </>
    )
}

export default CompactSidebar

const GuestButton = () => {
    return (
        <SidebarMenuButton variant="black" className="rounded-xl" asChild>
            <NavLink href="/authenticate/login">
                <LogIn size={16} />
                <span className="text-xs">Log In</span>
            </NavLink>
        </SidebarMenuButton>
    )
}
const AuthenticatedUserButton = ({ name }: { name: string }) => {
    return (
        <SidebarMenuButton variant="text" size="lg" className="rounded-xl">
            <ProfilePictureAvatar name={name} />
            <div className="flex items-center justify-between gap-2">
                <div className="w-24">
                    <p className="min-w-0 truncate text-xs">{name}</p>
                </div>
                <a className="base-transition bg-background shrink-0 rounded-xl border px-3 py-1 text-xs font-bold hover:scale-103 hover:shadow-2xl">
                    Settings
                </a>
            </div>
        </SidebarMenuButton>
    )
}
const ProfilePictureAvatar = ({ name }: { name: string }) => {
    return (
        <Avatar>
            <AvatarFallback
                style={{ backgroundColor: stringToColor(name) }}
                className="font-semibold text-white"
            >
                {getInitials(name)}
            </AvatarFallback>
        </Avatar>
    )
}
