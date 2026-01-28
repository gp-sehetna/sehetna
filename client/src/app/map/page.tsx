import MapView from "@/components/ui/map/MapView"
import type { Metadata as M } from "next"

type MProps = {
    params: { id: string }
    searchParams: { [key: string]: any }
}

export async function generateMetadata({ searchParams }: MProps): Promise<M> {
    const country = searchParams.country as string | undefined
    const date = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    if (country) {
        return {
            title: `${country} · Sehetna`,
            description: `Explore interactive health and demographic visualizations for ${country} as of ${date}. View detailed statistics and insights on our interactive map.`,
            openGraph: {
                title: `${country} · Sehetna`,
                description: `Interactive visualizations for ${country}`,
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: `${country} · Sehetna`,
                description: `Interactive visualizations for ${country}`,
            },
        }
    }

    return {
        title: "Interactive Map | Sehetna",
        description: `Explore interactive health and demographic visualizations across different countries. Click on any country to view detailed statistics and insights as of ${date}.`,
        openGraph: {
            title: "Interactive Map | Sehetna",
            description: "Interactive country visualizations and statistics",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "Interactive Map | Sehetna",
            description: "Interactive country visualizations and statistics",
        },
    }
}

const MapPage = () => {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center">
            <MapView />
        </div>
    )
}

export default MapPage
