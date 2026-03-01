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
            className={cn("relative flex w-full touch-none items-center select-none", className)}
            {...props}
        >
            <SliderPrimitive.Track className="bg-background relative h-2.5 w-full grow overflow-hidden rounded-full transition-colors">
                {showRange && (
                    <SliderPrimitive.Range
                        className={cn(sliderVariants({ variant }), color, "absolute h-full")}
                    />
                )}
            </SliderPrimitive.Track>

            <SliderPrimitive.Thumb
                className={cn(
                    sliderVariants({ variant }),
                    color,
                    thumbClassName,
                    "bg-background relative flex h-5 w-5 cursor-grab items-center justify-center rounded-full border-2 shadow-xl transition-colors duration-200 hover:scale-110 hover:shadow-2xl focus-visible:ring-4 focus-visible:outline-none active:scale-95 active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50"
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
