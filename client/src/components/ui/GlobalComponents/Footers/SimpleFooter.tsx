import { cn } from "@/lib/utils"
import FooterLink from "./FooterLink"

type SimpleFooterProps = {
    className?: string
    // [key: string]: string[]
}

export default function SimpleFooter({ className }: SimpleFooterProps) {
    return (
        <footer
            className={cn(
                "flex justify-center items-center py-3 border-t border-gray-300 text-sm text-muted-foreground",
                className
            )}
        >
            <div className="flex justify-evenly w-3/4">
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
