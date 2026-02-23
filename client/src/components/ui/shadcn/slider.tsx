"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"
import { GripVertical } from "lucide-react"
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
        <SliderPrimitive.Track className="bg-primary/20 relative h-2 w-full grow overflow-hidden rounded-full">
            {/* <SliderPrimitive.Range className="absolute h-full bg-primary" /> */}
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="border-primary-200 bg-primary-300 text-background focus-visible:ring-ring block flex h-6 w-6 items-center justify-center rounded-full border border-2 shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            <GripVertical size={18} />
        </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
