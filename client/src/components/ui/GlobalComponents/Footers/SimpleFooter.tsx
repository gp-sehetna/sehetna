import { cn } from "@/lib/utils"
import Image from "next/image"
import FooterLink from "./FooterLink"
import { simpleFooterItems } from "../nav/navigation-items"

type SimpleFooterProps = {
    className?: string
}

export default function SimpleFooter({ className }: SimpleFooterProps) {
    return (
        <footer
            className={cn(
                "text-muted-foreground flex items-center justify-center border-t border-gray-300 py-3 text-sm",
                className
            )}
        >
            <div className="flex w-3/4 justify-evenly">
                {simpleFooterItems.map((item) => (
                    <FooterLink key={item.href} href={item.href}>
                        {item.title}
                    </FooterLink>
                ))}
                <div className="flex gap-1">
                    <FooterLink href="/">@GradProject</FooterLink>
                    <Image
                        width={15}
                        height={10}
                        unoptimized
                        src="https://media.tenor.com/0-M-_QQY4eQAAAAi/pixel-heart.gif"
                        alt="Red Heart"
                    />
                    <Image
                        width={15}
                        height={15}
                        unoptimized
                        src="https://media.tenor.com/mvLRHMrHUWwAAAAi/diamond-elegant.gif"
                        alt="Diamond"
                    />
                </div>
            </div>
        </footer>
    )
}
