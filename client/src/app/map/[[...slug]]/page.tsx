import { toProperCase, unslugify } from "@/lib/utils"
import { MapPageProps, parseSlug } from "@/shared/config/map"
import { Metadata } from "next"

export async function generateMetadata({ params }: MapPageProps): Promise<Metadata> {
    const { country, healthOutcome } = parseSlug((await params).slug)

    if (!country)
        return {
            title: "Explore Health Data with Interactive Maps",
            description:
                "Explore interactive health and demographic visualizations across different countries. Click on any country to view detailed statistics and insights.",
            alternates: {
                canonical: "/map",
            },
        }

    const viewedCountry = toProperCase(unslugify(country))
    const viewedOutcome = toProperCase(unslugify(healthOutcome))

    return {
        title: `${viewedCountry} · ${viewedOutcome}`,
        description: `Explore ${viewedOutcome} statistics and interactive health data for ${viewedCountry}.`,
        alternates: {
            canonical: `/map/${country}/${healthOutcome}`,
        },
    }
}

const MapPage = () => {
    return <></>
}

export default MapPage
