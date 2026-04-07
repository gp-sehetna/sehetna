import { Url } from "next/dist/shared/lib/router/router"
import AppLink from "../../GlobalControls/AppLink"
import { cn } from "@/lib/utils"

type FooterLinkProps = {
    href: Url
    className?: string
    children: React.ReactNode
}

export default function FooterLink({ href, className, children }: FooterLinkProps) {
    return (
        <AppLink
            className={cn(
                "base-transition flex gap-1 text-xs text-neutral-500 hover:text-neutral-900",
                className
            )}
            href={href}
        >
            {children}
        </AppLink>
    )
}
