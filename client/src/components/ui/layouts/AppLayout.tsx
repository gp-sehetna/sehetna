"use client"

import ComplexFooter from "@/components/ui/GlobalComponents/Footers/ComplexFooter"
import MobileNav from "@/components/ui/GlobalComponents/nav/MobileNav"
import NavActions from "@/components/ui/GlobalComponents/nav/NavActions"
import { groupedNavItems } from "@/components/ui/GlobalComponents/nav/navigation-items"
import NavItems from "@/components/ui/GlobalComponents/nav/NavItems"
import Logo from "@/components/ui/GlobalControls/Logo"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const [isScrolled, setIsScrolled] = useState(false)

    // Adjust this value as needed for when the header should transform
    const SCROLL_THRESHOLD = 60

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="relative flex min-h-screen flex-col">
            <header
                className={cn(
                    // Base positioning: fixed ensures it floats over <main>
                    "fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-4 py-3",
                    "base-transition isolate",
                    isScrolled
                        ? "border-transparent bg-transparent"
                        : "glassy border-b-neutral-200/40"
                )}
            >
                <Logo withText size={18}></Logo>
                <div className="flex w-full justify-end gap-6">
                    <NavItems navigationItems={groupedNavItems} />
                    <div className="hidden sm:flex">
                        <NavActions />
                    </div>
                    <MobileNav navigationItems={groupedNavItems} />
                </div>
            </header>

            <main className="flex-1 bg-violet-50">{children}</main>
            <ComplexFooter />
        </div>
    )
}

export default AppLayout
