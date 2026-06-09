import { __DEV_AI_SERVER_BASE_URL } from "@/shared/http/base-url"
import type { NextConfig } from "next"

// Use: http://ai-server-app:8000 when running in docker, and http://127.0.0.1:8000 when running locally
const nextConfig: NextConfig = {
    /* config options here */
    allowedDevOrigins: ["127.0.0.1"],
    async rewrites() {
        if (process.env.NODE_ENV === "production") return []
        return [
            {
                source: "/ai/:path*",
                destination: `${__DEV_AI_SERVER_BASE_URL}/:path*`,
            },
        ]
    },
    async redirects() {
        return [
            {
                source: "/map/:country/respiratory-disease-rate",
                destination: "/map/:country",
                permanent: true,
            },
            {
                source: "/map/respiratory-disease-rate",
                destination: "/map",
                permanent: true,
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "media.tenor.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
}

export default nextConfig
