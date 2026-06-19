// import { scenarioClientService } from "@/features/observations/Observation.service.client"
// import type {
//     ObservationQueryParams,
//     ScenarioObservationSortBy,
// } from "@/features/observations/Observation.types"
// import type { SortType } from "@/shared/db/types/pagination.type"
// import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
// import { NextResponse } from "next/server"

// const sortFields = new Set<ScenarioObservationSortBy>([
//     "baseDate",
//     "locationName",
//     "temperatureCelsius",
//     "precipitationMm",
//     "heatWaveDays",
//     "floodIndicator",
//     "pm25Ugm3",
//     "aqi",
//     "healthcareAccessIndex",
//     "foodSecurityIndex",
//     "gdpPerCapitaUsd",
// ])



// const parseQuery = (request: Request): ObservationQueryParams => {
//     const searchParams = new URL(request.url).searchParams
//     const sortBy = searchParams.get("sortBy") as ScenarioObservationSortBy | null
//     const sortDirection = searchParams.get("sortDirection") as SortType | null
//     const filtersParam = searchParams.get("filters")

//     return {
//         page: 1,
//         pageSize: 1000,
//         sortBy: sortBy && sortFields.has(sortBy) ? sortBy : "baseDate",
//         sortDirection: sortDirection === "asc" ? "asc" : "desc",
//         filters: filtersParam ? JSON.parse(filtersParam) : undefined,
//     }
// }

// export const GET = globalErrorHandler(async (request) => {
//     const observations = await scenarioClientService.listObservations(
//         parseQuery(request)
//     )

//     const rows = scenarioObservationToCsvRows(observations.data)

//     const csv = rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n")

//     return new NextResponse(csv, {
//         headers: {
//             "Content-Disposition":
//                 'attachment; filename="scenario-observations.csv"',
//             "Content-Type": "text/csv; charset=utf-8",
//         },
//     })
// })
