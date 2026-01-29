import MapView from "@/components/ui/map/MapView"
import { toProperCase, unslugifyCountry } from "@/lib/utils"
import { Metadata } from "next"

type Props = {
    params: {
        country: string
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { country } = await params
    const viewedCountry = toProperCase(unslugifyCountry(country))

    return {
        title: `${viewedCountry} Health Data`,
        description: `Explore interactive health and demographic visualizations for ${viewedCountry}. View detailed statistics and insights on our interactive map.`,
        alternates: {
            canonical: `/map/${country}`,
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
