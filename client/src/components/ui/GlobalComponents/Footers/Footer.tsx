import ComplexFooter from "./ComplexFooter"
import SimpleFooter from "./SimpleFooter"

type FooterProps = {
    variant?: "default" | "simple"
    className?: string
}

export default function Footer({ variant = "default", className }: FooterProps) {
    switch (variant) {
        case "simple":
            return <SimpleFooter className={className} />

        default:
            return <ComplexFooter />
    }
}
