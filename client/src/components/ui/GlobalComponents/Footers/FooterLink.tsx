import { Url } from "next/dist/shared/lib/router/router"
import AppLink from "../../GlobalControls/AppLink"

type FooterLinkProps = {
    href: Url
    children: React.ReactNode
}

export default function FooterLink({ href, children }: FooterLinkProps) {
    return (
        <AppLink
            className="base-transition hover:text-neutral-1000 flex gap-1 text-xs text-neutral-700"
            href={href}
        >
            {children}
        </AppLink>
    )
}
