import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import React from "react"
import { Button } from "../../shadcn/button"
type BaseExtensionProps = {
    className?: string
    children?: React.ReactNode
}

function BaseExtension({ children, className }: BaseExtensionProps) {
    const [open, setOpen] = React.useState(true)

    return (
        open && (
            <div
                className={cn(
                    "text-background bg-foreground relative flex min-h-8 flex-row items-center justify-evenly px-3 py-1",
                    className
                )}
            >
                {children}
                <CloseButton set={setOpen} />
            </div>
        )
    )
}

export default BaseExtension

function CloseButton({ set }: { set: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <Button
            onClick={() => set(false)}
            variant="tonal"
            className="absolute top-1 right-1 h-6 w-6 rounded-md px-0 hover:scale-110"
        >
            <X className="stroke-2" />
        </Button>
    )
}
