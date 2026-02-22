// app/robots.ts
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                disallow: ["/ai/"],
            },
        ],
        sitemap: "https://sehetna.from-masr.com/sitemap.xml",
    }
}
