import { cn } from "@/lib/utils"
import NavItems from "../nav/NavItems"
import Logo from "../../GlobalControls/Logo"
import MobileNav from "../nav/MobileNav"
import BaseExtension from "../HeaderExtensions/BaseExtension"
import NavActions from "../nav/NavActions"
import ScrollEffect from "../extras/scroll-header-effect"

function AppHeader() {
    return (
        <header className={cn("fixed top-0 right-0 left-0 z-50")}>
            <BaseExtension>
                <small className="selection:text-primary-100 font-extralight">
                    We are working hard to bring you a new experience. Stay tuned :{")"}
                </small>
            </BaseExtension>
            <ScrollEffect>
                <Logo withText size={18} />
                <div className="flex w-full justify-end gap-6">
                    <NavItems />
                    <MobileNav />
                    <NavActions />
                </div>
            </ScrollEffect>
        </header>
    )
}

export default AppHeader
