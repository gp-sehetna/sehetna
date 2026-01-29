import MapView from "@/components/ui/map/MapView"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Explore Health Data with Interactive Maps",
    description:
        "Explore interactive health and demographic visualizations across different countries. Click on any country to view detailed statistics and insights.",
    alternates: {
        canonical: "/map",
    },
}

const MapPage = () => {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center">
            <MapView />
        </div>
    )
}

export default MapPage
