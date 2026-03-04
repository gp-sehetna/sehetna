"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "../../shadcn/button"

const STORAGE_KEY = "base_extension_open"

type BaseExtensionProps = {
    className?: string
    children?: React.ReactNode
}

function BaseExtension({ children, className }: BaseExtensionProps) {
    // null = not yet hydrated
    const [open, setOpen] = React.useState<boolean | null>(null)

    // Load initial state safely
    React.useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)

        // default to open if not stored
        if (stored === null) {
            setOpen(true)
        } else {
            setOpen(stored === "true")
        }
    }, [])

    const handleOpenChange = React.useCallback((value: boolean) => {
        setOpen(value)
        localStorage.setItem(STORAGE_KEY, String(value))
    }, [])

    return (
        <div
            className={cn(
                open ? "min-h-8 px-3 py-1 opacity-100" : "h-0 min-h-0 p-0 opacity-0",
                "text-background bg-foreground base-transition relative flex flex-row items-center justify-evenly",
                className
            )}
        >
            {children}
            <CloseButton onClose={() => handleOpenChange(false)} />
        </div>
    )
}

export default BaseExtension

function CloseButton({ onClose }: { onClose: () => void }) {
    return (
        <Button
            onClick={onClose}
            variant="tonal"
            className="absolute top-1 right-1 h-6 w-6 rounded-md px-0 transition hover:scale-110"
        >
            <X className="stroke-2" />
        </Button>
    )
}
