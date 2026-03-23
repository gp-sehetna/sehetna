"use client"

import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils/index"

const Accordion = AccordionPrimitive.Root

const accordionItemVariants = cva("group/accordion-item overflow-hidden", {
    variants: {
        variant: {
            default: "border-border/70 border-b",
            card: "bg-background/85 mb-3 rounded-2xl border border-white/80 shadow-sm backdrop-blur-sm last:mb-0",
            ghost: "hover:border-border/70 hover:bg-background/50 rounded-2xl border border-transparent",
        },
        size: {
            sm: "",
            default: "",
            lg: "",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
})

const accordionTriggerVariants = cva(
    "base-transition ring-offset-background focus-visible:ring-ring flex flex-1 items-center justify-between gap-4 text-left font-medium outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]_[data-accordion-chevron]]:rotate-180",
    {
        variants: {
            variant: {
                default:
                    "hover:text-neutral-1000 data-[state=open]:text-neutral-1000 text-neutral-900 hover:no-underline",
                card: cn(
                    "rounded-xl",
                    "hover:bg-primary-50/80 hover:text-neutral-1000",
                    "data-[state=open]:bg-primary-50 data-[state=open]:text-neutral-1000"
                ),
                ghost: cn(
                    "rounded-xl",
                    "hover:bg-background/80 hover:text-neutral-1000",
                    "data-[state=open]:bg-background data-[state=open]:text-neutral-1000"
                ),
            },
            size: {
                sm: "min-h-12 px-4 py-3 text-sm",
                default: "min-h-14 px-5 py-4 text-sm",
                lg: "min-h-16 px-6 py-5 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const accordionContentVariants = cva(
    cn(
        "overflow-hidden text-sm text-neutral-800 will-change-[height]",
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        "data-[state=open]:[&>div]:animate-in data-[state=open]:[&>div]:fade-in-0 data-[state=open]:[&>div]:slide-in-from-top-1",
        "data-[state=closed]:[&>div]:animate-out data-[state=closed]:[&>div]:fade-out-0 data-[state=closed]:[&>div]:slide-out-to-top-1"
    ),
    {
        variants: {
            variant: {
                default: "",
                card: "",
                ghost: "",
            },
            size: {
                sm: "",
                default: "",
                lg: "",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const accordionContentInnerVariants = cva("", {
    variants: {
        variant: {
            default: "pt-0 pb-4",
            card: "px-5 pt-0 pb-5",
            ghost: "px-5 pt-0 pb-4",
        },
        size: {
            sm: "",
            default: "",
            lg: "text-base",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
})

type AccordionVisualVariants = VariantProps<typeof accordionItemVariants>

const AccordionItemVariantContext = React.createContext<Required<AccordionVisualVariants>>({
    variant: "default",
    size: "default",
})

type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> &
    AccordionVisualVariants

const AccordionItem = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    AccordionItemProps
>(({ className, variant = "default", size = "default", ...props }, ref) => (
    <AccordionItemVariantContext.Provider value={{ variant, size }}>
        <AccordionPrimitive.Item
            ref={ref}
            className={cn(accordionItemVariants({ variant, size }), className)}
            {...props}
        />
    </AccordionItemVariantContext.Provider>
))
AccordionItem.displayName = "AccordionItem"

type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> &
    Partial<AccordionVisualVariants>

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    AccordionTriggerProps
>(({ className, children, variant, size, ...props }, ref) => {
    const context = React.useContext(AccordionItemVariantContext)
    const resolvedVariant = variant ?? context.variant
    const resolvedSize = size ?? context.size

    return (
        <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
                ref={ref}
                className={cn(
                    accordionTriggerVariants({ variant: resolvedVariant, size: resolvedSize }),
                    className
                )}
                {...props}
            >
                <span className="flex-1">{children}</span>
                <span
                    className={cn(
                        "bg-muted text-muted-foreground base-transition flex size-8 shrink-0 items-center justify-center rounded-full"
                    )}
                >
                    <ChevronDown
                        data-accordion-chevron
                        className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out"
                    />
                </span>
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

type AccordionContentProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> &
    Partial<AccordionVisualVariants>

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    AccordionContentProps
>(({ className, children, variant, size, ...props }, ref) => {
    const context = React.useContext(AccordionItemVariantContext)
    const resolvedVariant = variant ?? context.variant
    const resolvedSize = size ?? context.size

    return (
        <AccordionPrimitive.Content
            ref={ref}
            className={cn(
                accordionContentVariants({ variant: resolvedVariant, size: resolvedSize })
            )}
            {...props}
        >
            <div
                className={cn(
                    accordionContentInnerVariants({
                        variant: resolvedVariant,
                        size: resolvedSize,
                    }),
                    className
                )}
            >
                {children}
            </div>
        </AccordionPrimitive.Content>
    )
})
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
