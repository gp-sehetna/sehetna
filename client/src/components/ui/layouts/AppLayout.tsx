"use client"

import ComplexFooter from "@/components/ui/GlobalComponents/Footers/ComplexFooter"
import { useEffect, useState } from "react"
import AppHeader from "../GlobalComponents/headers/AppHeader"
import { usePathname } from "next/navigation"

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
    const [isScrolled, setIsScrolled] = useState(false)

    const pathname = usePathname()
    const isHomePage = pathname === "/"

    // Adjust this value as needed for when the header should transform
    const SCROLL_THRESHOLD = 60

    useEffect(() => {
        if (!isHomePage) {
            ;(() => setIsScrolled(true))()
            return
        }
        const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)

        // Initial check in case they refresh while down the page
        handleScroll()

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [isHomePage])

    return (
        <>
            <div className="relative flex min-h-screen flex-col">
                <AppHeader isScrolled={isHomePage ? isScrolled : true} />
                <main className="flex-1">{children}</main>
                <ComplexFooter />
            </div>
        </>
    )
}

export default HomeLayout
