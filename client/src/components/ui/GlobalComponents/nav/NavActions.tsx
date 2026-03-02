"use client"

import { ProfilePictureAvatar } from "@/components/ui/GlobalComponents/SideBars/CompactSidebar"
import { Button } from "@/components/ui/shadcn/button"
import { useUserStore } from "@/stores/user/use-user"
import Link from "next/link"

export default function MobileNav() {
    const { user } = useUserStore()
    if (user) return <ProfilePictureAvatar name={user.fullName} />

    return (
        <div className="flex items-center gap-2">
            <Button asChild variant="text" className="font-light">
                <Link href="/authenticate/login">Log In</Link>
            </Button>
            <Button asChild className="rounded-full font-light">
                <Link href="/authenticate/signup">Sign up</Link>
            </Button>
        </div>
    )
}
