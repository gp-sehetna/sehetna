import "@/app/globals.css"
import Footer from "@/components/ui/GlobalComponents/Footers/Footer"

import type { Metadata } from "next"

export const metadata: Metadata = {
    title: {
        default: "Sehetna · Environmental & Public Health Analytics",
        template: "%s · Sehetna",
    },
    description:
        "Sehetna is an intelligent analytics platform that integrates environmental, climate, and air quality data with public health indicators to predict health risks, support early warnings, and enable data-driven public health decision-making using advanced AI and machine learning.",
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
    creator: "Sehetna Graduation Project",
    publisher: "Ain Shams University",
    metadataBase: new URL("https://sehetna.app"), // change if needed
    openGraph: {
        title: "Sehetna | Predicting the Impact of Environmental Factors on Public Health",
        description:
            "An AI-powered analytics system that connects climate, air quality, and environmental data with public health indicators to forecast health risks and support preventive interventions.",
        type: "website",
        locale: "en_US",
        siteName: "Sehetna",
    },
    twitter: {
        card: "summary_large_image",
        title: "Sehetna | Environmental & Public Health Intelligence",
        description:
            "AI-driven platform for forecasting public health risks based on environmental and climate factors.",
    },
}

export default function AuthenticationLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex min-h-screen flex-col">
                <div className="flex flex-2 overflow-hidden">
                    <main className="m-8 flex flex-1 items-center justify-center md:justify-start md:p-20">
                        {children}
                    </main>

                    <div
                        className="hidden min-w-2xs -skew-x-6 rounded-tl-[64px] bg-cover bg-right lg:block"
                        style={{
                            backgroundImage: "url('/Authentication Gradient.png')",
                        }}
                    />
                </div>

                <Footer className="hidden md:flex" variant="simple" />
            </div>
        </>
    )
}
