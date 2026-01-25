"use client"

import { cn } from "@/lib/utils/cn"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

const NavLink = React.forwardRef<HTMLAnchorElement, React.ComponentProps<typeof Link>>(
    ({ children, href, className, ...props }, ref) => {
        const pathname = usePathname()

        const isActive = href == pathname
        return (
            <Link
                ref={ref}
                {...props}
                href={href}
                className={cn(
                    isActive &&
                        "bg-primary-100 text-primary-700 hover:bg-primary-200! hover:text-primary-800!",
                    !isActive && "hover:bg-neutral-100",
                    className,
                    "base-transition"
                )}
            >
                {children}
            </Link>
        )
    }
)

NavLink.displayName = "NavLink"
export default NavLink
