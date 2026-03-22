"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"

import { cn } from "@/lib/utils/index"
import { cva, VariantProps } from "class-variance-authority"

const sliderVariants = cva("", {
    variants: {
        variant: {
            default: "bg-primary",
        },
    },
    defaultVariants: {
        variant: "default",
    },
})

type ExtendedSliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> &
    VariantProps<typeof sliderVariants> & {
        thumbClassName?: string
        showRange?: boolean
    }

const Slider = React.forwardRef<
    React.ComponentRef<typeof SliderPrimitive.Root>,
    ExtendedSliderProps
>(
    (
        {
            className,
            color,
            thumbClassName = "border-primary focus-visible:ring-primary/60",
            variant,
            showRange = false,
            ...props
        },
        ref
    ) => (
        <SliderPrimitive.Root
            ref={ref}
            className={cn(
                "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
                className
            )}
            {...props}
        >
            <SliderPrimitive.Track
                data-slot="slider-track"
                className="bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
            >
                {showRange && (
                    <SliderPrimitive.Range
                        className={cn(
                            sliderVariants({ variant }),
                            color,
                            "absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
                        )}
                    />
                )}
            </SliderPrimitive.Track>

            <SliderPrimitive.Thumb
                className={cn(
                    sliderVariants({ variant }),
                    color,
                    thumbClassName,
                    "border-primary ring-ring/50 flex size-4 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                )}
            >
                <div
                    className={cn(
                        sliderVariants({ variant }),
                        color,
                        "h-2 w-2 rounded-full transition-colors"
                    )}
                />
            </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>
    )
)
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
