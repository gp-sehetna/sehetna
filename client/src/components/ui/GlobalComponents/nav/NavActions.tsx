import { Button } from "@/components/ui/shadcn/button"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/stores/user/use-user"
import Link from "next/link"
import { ProfilePictureAvatar } from "../../GlobalControls/AvatarMenu"

export default function NavActions({ isScrolled }: { isScrolled?: boolean }) {
    const { user } = useUserStore()
    if (user) return <ProfilePictureAvatar name={user.fullName} />

    return (
        <div className="flex items-center gap-2">
            <Button
                asChild
                variant="text"
                className={cn("font-light", !isScrolled ? "text-background" : "text-neutral-1000")}
            >
                <Link href="/authenticate/login">Log In</Link>
            </Button>
            <Button asChild className="rounded-full font-light">
                <Link href="/authenticate/signup">Sign up</Link>
            </Button>
        </div>
    )
}
