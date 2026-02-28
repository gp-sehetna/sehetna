import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover"

type MetaTooltipProps = {
    title?: string
    description?: React.ReactNode
    initial?: string
    bgColor?: string
    side?: "top" | "right" | "bottom" | "left"
    trigger?: React.ReactNode
}

const MetaTooltip = ({ title, description, initial, bgColor, side, trigger }: MetaTooltipProps) => {
    if (typeof description == "string")
        description = <p className="text-muted-foreground mt-2 text-xs">{description}</p>

    if (!side) side = "right"

    return (
        <Popover>
            <PopoverTrigger asChild>
                {/* If not children then put a default trigger */}
                {trigger ? (
                    trigger
                ) : (
                    <div
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[10px] font-semibold text-white shadow-md transition hover:scale-105"
                        style={{
                            backgroundColor: bgColor,
                        }}
                    >
                        {initial}
                    </div>
                )}
            </PopoverTrigger>

            <PopoverContent
                side={side}
                className="glassy text-neutral-1000 bg-background/75 max-w-xs text-xs whitespace-pre-line"
            >
                {title && <p className="font-semibold">{title}</p>}
                {description}
            </PopoverContent>
        </Popover>
    )
}

export default MetaTooltip
