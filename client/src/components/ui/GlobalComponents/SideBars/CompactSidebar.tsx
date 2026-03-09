import { LogIn } from "lucide-react"

import { compactSidebarItems } from "@/components/ui/GlobalComponents/nav/navigation-items"
import SidebarFooterActions from "@/components/ui/GlobalComponents/SideBars/SidebarFooterActions"
import Logo from "@/components/ui/GlobalControls/Logo"
import NavLink from "@/components/ui/NavLink"
import { Avatar, AvatarFallback } from "@/components/ui/shadcn/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/shadcn/sidebar"
import { UserWithoutPassword } from "@/features/auth/auth.types"
import { useIsMobile } from "@/hooks/use-mobile"
import { getInitials, stringToColor } from "@/lib/utils/string"
import { Shield, User } from "lucide-react"

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
                <SidebarFooterActions />
                <SidebarRail />
            </Sidebar>
        </>
    )
}

export default CompactSidebar

export const GuestButton = () => {
    return (
        <SidebarMenuButton variant="black" className="rounded-xl" asChild>
            <NavLink href="/authenticate/login">
                <LogIn size={16} />
                <span className="text-xs">Log In</span>
            </NavLink>
        </SidebarMenuButton>
    )
}
export const AuthenticatedUserButton = ({ user }: { user: UserWithoutPassword }) => {
    return (
        <SidebarMenuButton variant="text" size="lg" className="rounded-xl">
            <ProfilePictureAvatar name={user.fullName} />
            <div className="flex items-center justify-between gap-2">
                <div className="w-24">
                    <p className="min-w-0 truncate text-xs">{user.fullName}</p>
                </div>
                <a className="base-transition bg-background shrink-0 rounded-xl border px-3 py-1 text-xs font-bold hover:scale-103 hover:shadow-2xl">
                    Settings
                </a>
            </div>
        </SidebarMenuButton>
    )
}
export const ProfilePictureAvatar = ({ name }: { name: string }) => {
    const isMobile = useIsMobile()
    return (
        <DropdownMenu>
            {/* asChild is important here so the DropdownMenuTrigger doesn't wrap your Avatar in an extra <button> tag */}
            <DropdownMenuTrigger asChild>
                <Avatar className="base-transition cursor-pointer hover:scale-106">
                    <AvatarFallback
                        style={{ backgroundColor: stringToColor(name) }}
                        className="text-background font-semibold"
                    >
                        {getInitials(name)}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-64"
                side={isMobile ? "left" : "top"}
                align="start"
                forceMount
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm leading-none font-medium">{name}</p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-muted-foreground text-xs">
                        My Account
                    </DropdownMenuLabel>

                    <DropdownMenuItem asChild>
                        <a href="/settings/account" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Account Settings</span>
                        </a>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <a href="/settings/security" className="cursor-pointer">
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Security</span>
                        </a>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
