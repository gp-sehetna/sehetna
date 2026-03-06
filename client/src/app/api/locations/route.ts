import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"

export const GET = globalErrorHandler(async (_request) => {
    const mainService = await MainService.getInstance()
    const locations = await mainService.locationService.findAllLocations()
    return [{ data: locations }, `${locations.length} Locations retrieved successfully`]
})

/**
 *  Used to insert all locations from geojson file.
 * */
// export const POST = globalErrorHandler(async (request) => {
//     type Loc = Omit<ILocation, "_id" | "createdAt" | "updatedAt">
//     const origin = new URL(request.url).origin
//     const response = await fetch(`${origin}/geo/countries.geojson`)
//     const locations = await response.json()
//     const locationsToInsert = locations.features.map(
//         (feature: any) =>
//             ({
//                 name: feature.properties.countryName,
//                 code: feature.properties.isoA3,
//                 region: feature.properties.subRegion,
//             }) as Loc
//     )

//     const mainService = await MainService.getInstance()
//     const inserted = await mainService.locationService.insertLocations(locationsToInsert)
//     return [undefined, `Created ${inserted.length} location(s)  successfully`]
// })
