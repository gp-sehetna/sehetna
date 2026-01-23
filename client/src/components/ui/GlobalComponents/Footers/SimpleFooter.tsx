import { cn } from "@/lib/utils/cn"
import FooterLink from "./FooterLink"

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
                <FooterLink href="#AboutUs">About Us</FooterLink>
                <FooterLink href="#Methodology">Methodology</FooterLink>
                <FooterLink href="#Terms">Terms of Service</FooterLink>
                <FooterLink href="#PrivacyPolicy">Privacy Policy</FooterLink>
                <FooterLink href="#CookieUse">Cookie Use</FooterLink>
                <FooterLink href="#Help">Help & Support</FooterLink>
                <FooterLink href="#Home">@GradProject</FooterLink>
            </div>
        </footer>
    )
}
