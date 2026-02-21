// app/sitemap.ts
import { slugify } from "@/lib/utils"
import { HEALTH_OUTCOMES } from "@/shared/config/health-outcomes"
import fs from "fs"
import { GeoJSONFeature } from "maplibre-gl"
import type { MetadataRoute } from "next"
import path from "path"

const BASE_URL = "https://sehetna.from-masr.com"

const USE_CASES = [
    "health-monitoring",
    "health-preparedness",
    "policy-planning",
    "research-insights",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routes: MetadataRoute.Sitemap = []

    // --------------------
    // Static Public Routes
    // --------------------
    const staticRoutes = [
        "",
        "/methodology",
        "/more-about-us",
        "/support",
        "/support/services-and-policies",
        "/data-explorer",
        "/map",
    ]

    staticRoutes.forEach((route) => {
        routes.push({
            url: `${BASE_URL}${route}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: route === "" ? 1 : 0.7,
        })
    })

    // --------------------
    // Use Cases
    // --------------------
    USE_CASES.forEach((useCase) => {
        routes.push({
            url: `${BASE_URL}/use-cases/${useCase}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        })
    })

    // --------------------
    // Map – health outcome only
    // /map/[healthOutcome]
    // --------------------
    HEALTH_OUTCOMES.forEach((outcome) => {
        routes.push({
            url: `${BASE_URL}/map/${outcome}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        })
    })

    // --------------------
    // Map – country + outcome
    // /map/[country]
    // /map/[country]/[healthOutcome]
    // --------------------
    const filePath = path.join(process.cwd(), "public/geo/countries.geojson")

    const file = fs.readFileSync(filePath, "utf8")
    const geojson = JSON.parse(file)

    const countries: string[] = geojson.features.map((feature: GeoJSONFeature) =>
        slugify(feature.properties.name)
    )

    countries.forEach((country: string) => {
        // /map/country
        routes.push({
            url: `${BASE_URL}/map/${country}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        })

        // /map/country/outcome
        HEALTH_OUTCOMES.forEach((outcome) => {
            routes.push({
                url: `${BASE_URL}/map/${country}/${outcome}`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: 0.8,
            })
        })
    })

    return routes
}
