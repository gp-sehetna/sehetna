"use client"

import { Button } from "@/components/ui/shadcn/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ProfilePictureAvatar } from "../../GlobalControls/AvatarMenu"
import { useUserStore } from "@/stores/user/use-user"

export default function NavActions() {
    const { user } = useUserStore()

    if (user) {
        console.log("User: ", user.fullName)
        return <ProfilePictureAvatar name={user.fullName} />
    }
    return (
        <div className="flex items-center gap-2">
            <Button asChild variant="text" className={cn("font-light text-inherit")}>
                <Link href="/authenticate/login">Log In</Link>
            </Button>
            <Button asChild className="rounded-full font-light">
                <Link href="/authenticate/signup">Sign up</Link>
            </Button>
        </div>
    )
}
