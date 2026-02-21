import Link from "next/link"
import { Button } from "../../shadcn/button"

export default function MobileNav() {
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
