import { LogIn } from "lucide-react"

import { compactSidebarItems } from "@/components/ui/GlobalComponents/nav/navigation-items"
import SidebarFooterActions from "@/components/ui/GlobalComponents/SideBars/SidebarFooterActions"
import Logo from "@/components/ui/GlobalControls/Logo"
import NavLink from "@/components/ui/NavLink"
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
import { ProfilePictureAvatar } from "../../GlobalControls/AvatarMenu"

const CompactSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    return (
        <>
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader>
                    <Logo withText size={32} />
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
                <a
                    href="/settings/account"
                    className="base-transition bg-background shrink-0 rounded-xl border px-3 py-1 text-xs font-bold hover:scale-103 hover:shadow-2xl"
                >
                    Settings
                </a>
            </div>
        </SidebarMenuButton>
    )
}
