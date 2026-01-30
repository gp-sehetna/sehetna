import { cn } from "@/lib/utils/cn"
import FooterLink from "./FooterLink"
import Image from "next/image"

type SimpleFooterProps = {
    className?: string
    // [key: string]: string[]
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
                <FooterLink href="/more-about-us">About Us</FooterLink>
                <FooterLink href="/methodology">Methodology</FooterLink>
                <FooterLink href="/support/services-and-policies#terms">
                    Terms of Service
                </FooterLink>
                <FooterLink href="/support/services-and-policies#privacy-policy">
                    Privacy Policy
                </FooterLink>
                <FooterLink href="/support/services-and-policies#cookie-use">Cookie Use</FooterLink>
                <FooterLink href="/support">Help & Support</FooterLink>
                <div className="flex gap-1">
                    <FooterLink href="/">@GradProject</FooterLink>
                    <Image
                        width={15}
                        height={10}
                        src="https://media.tenor.com/0-M-_QQY4eQAAAAi/pixel-heart.gif"
                        alt="Red Heart"
                    />
                    <Image
                        width={15}
                        height={15}
                        src="https://media.tenor.com/mvLRHMrHUWwAAAAi/diamond-elegant.gif"
                        alt="Diamond"
                    />
                </div>
            </div>
        </footer>
    )
}
