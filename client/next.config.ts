import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    /* config options here */
    async rewrites() {
    if (process.env.NODE_ENV === "production") return []
    return [
      {
        source: "/ai/:path*",
        destination: "http://127.0.0.1:8000/:path*",
      },
    ]
  },
}

export default nextConfig