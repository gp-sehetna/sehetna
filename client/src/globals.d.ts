import type mongoose from "mongoose"
declare module "@/app/globals.css"
declare module "maplibre-gl/dist/maplibre-gl.css"

declare global {
    var mongoClient: {
        conn: typeof mongoose | null
        promise: Promise<typeof mongoose> | null
    }
}
