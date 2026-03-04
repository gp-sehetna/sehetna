"use client"

import Link from "next/link"
import { Button } from "../../shadcn/button"
import { useUserStore } from "@/stores/user/use-user"
import { ProfilePictureAvatar } from "../SideBars/CompactSidebar"

export default function MobileNav() {
    const { user } = useUserStore()
    if (user) {
        return <ProfilePictureAvatar name={user.fullName} />
    }

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
