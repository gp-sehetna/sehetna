"use client"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/shadcn/drawer"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"

type MapLegendDrawerProps = {
    title?: string
    description?: string
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    trigger: React.ReactNode
    children: React.ReactNode
}

export function MapLegendDrawer({
    title,
    description,
    isOpen,
    setIsOpen,
    trigger,
    children,
}: MapLegendDrawerProps) {
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
                {trigger}
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
