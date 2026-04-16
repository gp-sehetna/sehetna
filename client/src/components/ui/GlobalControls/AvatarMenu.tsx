"use client"

import { AuthClientService } from "@/features/auth/auth.service.client"
import { useIsMobile } from "@/hooks/use-mobile"
import { getInitials } from "@/lib/utils"
import { stringToColor } from "@/lib/utils/string"
import logger from "@/shared/logger"
import { useUserStore } from "@/stores/user/use-user"
import { Avatar, AvatarFallback } from "@/components/ui/shadcn/avatar"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuItem,
} from "@/components/ui/shadcn/dropdown-menu"
import { User, Shield, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"

export const ProfilePictureAvatar = ({ name }: { name: string }) => {
    const isMobile = useIsMobile()
    const authService = useMemo(() => new AuthClientService(), [])
    const { setUser } = useUserStore()
    const router = useRouter()
    const onSubmit = async () => {
        const { message } = await authService.logout()
        logger.info(message)
        setUser(null)
        router.push("/authenticate/login")
    }
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
                className="w-64 rounded-2xl"
                side={isMobile ? "left" : "top"}
                align="start"
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm leading-none font-medium">{name}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-muted-foreground text-xs">
                        My Profile
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
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={onSubmit}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log Out</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
