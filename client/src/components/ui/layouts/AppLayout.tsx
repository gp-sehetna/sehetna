"use client" // Required for hooks in Next.js App Router

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Logo from "../GlobalControls/Logo"
import NavItems from "@/components/ui/GlobalComponents/nav/NavItems"
import MobileNav from "../GlobalComponents/nav/MobileNav"
import NavActions from "../GlobalComponents/nav/NavActions"
import { groupedNavItems } from "../GlobalComponents/nav/navigation-items"
import ComplexFooter from "../GlobalComponents/Footers/ComplexFooter"

const SCROLL_THRESHOLD = 60 // Adjust this value as needed for when the header should transform

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const beforeTransform = "bg-transparent border-transparent"
    const afterTransform = "glassy border-b-neutral-200/40"

    return (
        <div className="relative flex min-h-screen flex-col">
            <header
                className={cn(
                    // Base positioning: fixed ensures it floats over <main>
                    "fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-4 py-3",
                    "base-transition isolate",
                    isScrolled ? afterTransform : beforeTransform
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
