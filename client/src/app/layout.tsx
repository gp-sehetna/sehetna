import "@/app/globals.css"
import { plusJakarta } from "@/fonts/fonts"
import "animate.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
    metadataBase: new URL("https://sehetna.from-masr.com"),
    title: {
        default: "Sehetna - From Masr",
        template: "%s · Sehetna",
    },
    description:
        "Sehetna is a healthcare and data platform by From Masr, providing insights, tools, and services for better health decisions. Sehetna is an intelligent analytics platform that integrates environmental, climate, and air quality data with public health indicators to predict health risks, support early warnings, and enable data-driven public health decision-making using advanced AI and machine learning.",
    keywords: [
        "Public Health Analytics",
        "Environmental Health",
        "Air Quality",
        "Climate Change",
        "Health Risk Prediction",
        "Machine Learning",
        "Data Analytics",
        "Early Warning Systems",
        "Digital Health",
        "Sehetna",
    ],
    authors: [
        { name: "Sehetna Project Team" },
        { name: "Ain Shams University - Faculty of Computer & Information Sciences" },
    ],
    creator: "Sehetna Graduation Project Team",
    publisher: "IIS",
    twitter: {
        card: "summary_large_image",
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={plusJakarta.className}>{children}</body>
        </html>
    )
}
