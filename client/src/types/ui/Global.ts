import { ReactNode } from "react"

//// export type Spacing = 0 | 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 64;

type HeadingSizes = 1 | 2 | 3 | 4 | 5 | 6

type HeadingType = {
    children: ReactNode
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    size?: HeadingSizes
    color?: "primary" | "secondary" | "black"
    className?: string
}

// -----------------------------

type ButtonSize = LinkSize | "icon"
type LinkSize = "default" | "sm" | "lg"

export type { HeadingType, ButtonSize, LinkSize }
