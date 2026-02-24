"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"

import { cn } from "@/lib/utils/index"

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none items-center select-none", className)}
        {...props}
    >
        <SliderPrimitive.Track className="bg-background relative h-2.5 w-full grow overflow-hidden rounded-full">
            {/* <SliderPrimitive.Range className="bg-primary absolute h-full transition-all" /> */}
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb className="bg-background border-primary focus-visible:ring-primary/60 relative flex h-5 w-5 cursor-grab items-center justify-center rounded-full border-2 shadow-xl transition-all duration-200 hover:scale-110 hover:shadow-2xl focus-visible:ring-4 focus-visible:outline-none active:scale-95 active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50">
            <div className="bg-primary h-2 w-2 rounded-full" />
        </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
