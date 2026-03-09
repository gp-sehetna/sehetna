"use client"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/shadcn/drawer"
import { useThemeStore } from "@/stores/map/use-theme"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"

type MapDrawerProps = {
    title?: string
    description?: string
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    children: React.ReactNode
}

export function MapDrawer({ title, description, isOpen, setIsOpen, children }: MapDrawerProps) {
    const { theme } = useThemeStore()
    const touchStartY = useRef(0)
    const minSwipeDistance = 50

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) =>
            (touchStartY.current = e.targetTouches[0].clientY)
        const handleTouchEnd = (e: TouchEvent) => {
            const distance = touchStartY.current - e.changedTouches[0].clientY
            if (distance > minSwipeDistance) setIsOpen(true)
        }

        window.addEventListener("touchstart", handleTouchStart)
        window.addEventListener("touchend", handleTouchEnd)
        return () => {
            window.removeEventListener("touchstart", handleTouchStart)
            window.removeEventListener("touchend", handleTouchEnd)
        }
    })

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger className="absolute -bottom-2" asChild>
                <div
                    tabIndex={0}
                    className="group relative h-3 w-full cursor-pointer overflow-hidden rounded-full border shadow-md transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg focus-visible:scale-[1.02] focus-visible:ring-2 focus-visible:outline-none"
                    style={{ background: theme.gradientCSS }}
                >
                    <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 2s linear infinite",
                        }}
                    />
                </div>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                {children}
            </DrawerContent>
        </Drawer>
    )
}
