import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils/index"

const NavigationMenu = React.forwardRef<
    React.ComponentRef<typeof NavigationMenuPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
    <NavigationMenuPrimitive.Root
        ref={ref}
        className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
        {...props}
    >
        {children}
        {/* <NavigationMenuViewport /> */}
    </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
    React.ComponentRef<typeof NavigationMenuPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.List
        ref={ref}
        className={cn(
            "group flex flex-1 list-none items-center justify-center space-x-1",
            className
        )}
        {...props}
    />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = React.forwardRef<
    React.ComponentRef<typeof NavigationMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
>((props, ref) => <NavigationMenuPrimitive.Item ref={ref} className="relative" {...props} />)

NavigationMenuItem.displayName = NavigationMenuPrimitive.Item.displayName

const navigationMenuTriggerStyle = cva(
    "group base-transition hover:bg-muted/40 inline-flex h-9 w-max cursor-pointer items-center justify-center rounded-xl px-4 py-2 text-sm font-light disabled:pointer-events-none disabled:opacity-50 data-[state=open]:opacity-75"
)

const NavigationMenuTrigger = React.forwardRef<
    React.ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <NavigationMenuPrimitive.Trigger
        ref={ref}
        className={cn(navigationMenuTriggerStyle(), "group font-light", className)}
        {...props}
    >
        {children}{" "}
        <ChevronDown
            className="base-transition relative top-px ml-1 h-4 w-4 group-data-[state=open]:rotate-180"
            aria-hidden="true"
        />
    </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
    React.ComponentRef<typeof NavigationMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
    <div className={cn("absolute top-full left-0 flex justify-center pt-2")}>
        <NavigationMenuPrimitive.Content
            ref={ref}
            className={cn(
                "transform-gpu will-change-[filter,backdrop-filter]",
                // Layout
                "bg-popover text-popover-foreground relative mt-2 overflow-hidden rounded-2xl border shadow-lg",
                "h-(--radix-navigation-menu-viewport-height) md:absolute md:w-(--radix-navigation-menu-viewport-width)",

                // Animation: The "Unroll" logic
                "origin-top", // Ensures it expands downwards, not from the center
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",

                // Creative bit: Scale only the Y-axis + a tiny slide
                "data-[state=open]:slide-in-from-top-2 data-[state=open]:scale-y-100",
                "data-[state=closed]:slide-out-to-top-1 data-[state=closed]:scale-y-95",

                // Timing: A "Snap-then-Slow" easing
                "duration-600 ease-[cubic-bezier(0.33,1,0.68,1)]",

                // Horizontal Motion (when switching tabs)
                "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
                "data-[motion=from-end]:slide-in-from-right-10 data-[motion=from-start]:slide-in-from-left-10",
                "data-[motion=to-end]:slide-out-to-right-10 data-[motion=to-start]:slide-out-to-left-10",

                className
            )}
            {...props}
        />
    </div>
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
    React.ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
    <div className={cn("absolute top-full left-0 flex justify-center")}>
        <NavigationMenuPrimitive.Viewport
            className={cn(
                "origin-top-center text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 dialog-shadow relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-xl border md:w-(--radix-navigation-menu-viewport-width)",
                className
            )}
            ref={ref}
            {...props}
        />
    </div>
))
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
    React.ComponentRef<typeof NavigationMenuPrimitive.Indicator>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.Indicator
        ref={ref}
        className={cn(
            "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
            className
        )}
        {...props}
    >
        <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm" />
    </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName

export {
    navigationMenuTriggerStyle,
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuTrigger,
    NavigationMenuLink,
    NavigationMenuIndicator,
    NavigationMenuViewport,
}
