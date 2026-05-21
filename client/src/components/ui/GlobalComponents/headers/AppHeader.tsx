import { cn } from "@/lib/utils"
import NavItems from "../nav/NavItems"
import Logo from "../../GlobalControls/Logo"
import NavActions from "../nav/NavActions"
import { groupedNavItems } from "../nav/navigation-items"
import MobileNav from "../nav/MobileNav"
import BaseExtension from "../HeaderExtensions/BaseExtension"

type AppHeaderProps = {
    isScrolled?: boolean
}

function AppHeader({ isScrolled }: AppHeaderProps) {
    return (
        <header className={cn("fixed top-0 right-0 left-0 z-50")}>
            <BaseExtension>
                <small className="selection:text-primary-100 font-extralight">
                    We are working hard to bring you a new experience. Stay tuned :{")"}
                </small>
            </BaseExtension>
            <div
                className={cn(
                    "flex items-center justify-between px-4 py-3",
                    "base-transition",
                    !isScrolled
                        ? "text-background border-transparent bg-transparent"
                        : "text-neutral-1000 glassy border-0 border-b border-b-neutral-200/40"
                )}
            >
                <Logo withText size={18}></Logo>
                <div className="flex w-full justify-end gap-6">
                    <NavItems navigationItems={groupedNavItems} />
                    <div className="hidden sm:flex">
                        {/* TODO: Make NavActions a server component */}
                        <NavActions isScrolled={isScrolled} />
                    </div>
                    <MobileNav isScrolled={isScrolled} navigationItems={groupedNavItems} />
                </div>
            </div>
        </header>
    )
}

export default AppHeader
