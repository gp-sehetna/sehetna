import { Button } from "../../shadcn/button"

export default function MobileNav() {
    return (
        <div className="flex items-center gap-2">
            <Button variant="text" className="font-light">
                Log In
            </Button>
            <Button className="rounded-full font-light">Sign Up</Button>
        </div>
    )
}
