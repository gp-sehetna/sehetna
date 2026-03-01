import "@/app/globals.css"
import { Toaster } from "@/components/ui/shadcn/sonner"
import { plusJakarta } from "@/fonts/fonts"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { Metadata } from "next"
import Providers from "./providers"
export const metadata: Metadata = {
    metadataBase: new URL("https://sehetna.from-masr.com"),
    title: {
        default: "Sehetna · AI-Powered Public Health Analytics Platform",
        template: "%s · Sehetna",
    },
    description:
        "Sehetna is a healthcare and data platform by From Masr, providing insights, tools, and services for better health decisions. Sehetna is an intelligent analytics platform that integrates environmental, climate, and air quality data with public health indicators to predict health risks, support early warnings, and enable data-driven public health decision-making using advanced AI and machine learning.",
    keywords: [
        // Core Platform
        "Sehetna",
        "public health analytics",
        "health risk prediction platform",
        "AI-powered healthcare",

        // Environmental & Climate
        "environmental health monitoring",
        "air quality index",
        "climate change health impact",
        "pollution tracking",
        "environmental data analytics",

        // Technology & AI
        "machine learning healthcare",
        "predictive health analytics",
        "health data science",
        "artificial intelligence public health",
        "big data healthcare",

        // Health Systems
        "early warning systems",
        "disease surveillance",
        "digital health platform",
        "health decision support",
        "epidemiological analytics",

        // Regional
        "Egypt healthcare",
        "MENA health technology",
        "From Masr",
    ],
    authors: [
        { name: "Sehetna Project Team", url: "https://sehetna.from-masr.com" },
        {
            name: "Ain Shams University · Faculty of Computer & Information Sciences",
            url: "https://cis.asu.edu.eg",
        },
    ],
    creator: "Sehetna Graduation Project Team · Ain Shams University",
    publisher: "From Masr",
    applicationName: "Sehetna",
    openGraph: { locale: "en_US", siteName: "Sehetna" },
    twitter: { card: "summary_large_image" },
    robots: {
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    verification: {
        // Add these if you have them
        // google: "your-google-verification-code",
        // yandex: "your-yandex-verification-code",
    },
    category: "Healthcare Technology",
    alternates: {
        canonical: "https://sehetna.from-masr.com",
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta name="apple-mobile-web-app-title" content="Sehetna" />
            </head>
            <body className={plusJakarta.className}>
                <Providers>{children}</Providers>
                <Toaster position="top-center" />
            </body>
        </html>
    )
}
