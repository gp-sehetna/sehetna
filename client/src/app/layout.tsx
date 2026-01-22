import "./globals.css"

import { plusJakarta } from "@/fonts/fonts"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={plusJakarta.className}>
                {children}
            </body>
        </html>
    )
}
