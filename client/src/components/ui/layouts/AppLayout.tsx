"use client"

import ComplexFooter from "@/components/ui/GlobalComponents/Footers/ComplexFooter"
import { useEffect, useState } from "react"
import AppHeader from "../GlobalComponents/headers/AppHeader"

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
        <>
            <div className="relative flex min-h-screen flex-col">
                <AppHeader isScrolled={isScrolled} />
                <main className="flex-1 bg-violet-50">{children}</main>
                <ComplexFooter />
            </div>
        </>
    )
}

export default AppLayout
