// import { MainService } from "@/shared/db/main.service"
// import { globalErrorHandler } from "@/shared/http/handlers/error.handler"

// export const GET = globalErrorHandler(async (_request) => {
//     const mainService = await MainService.getInstance()
//     const predictions = await mainService.predictionService.findAllPredictions()
//     return [{ data: predictions }, `${predictions.length} Predictions retrieved successfully`]
// })
// export const POST = globalErrorHandler(async (request) => {
//     const prediction = await request.json()
//     const mainService = await MainService.getInstance()
//     const _id = await mainService.predictionService.createPrediction(prediction)
//     return [undefined, "New Prediction created successfully"]
// })
/**
 * Read CSV file and insert historical data into db
 */
// export const POST = globalErrorHandler(
//     userProvider(async (request, user) => {
//         type Pred = Omit<IPrediction, "_id" | "createdAt" | "updatedAt">
//         const origin = new URL(request.url).origin
//         const response = await fetch(`${origin}/historical.json`)
//         const predictions = await response.json()

//         // Get all locations
//         const mainService = await MainService.getInstance()
//         const locations = await mainService.locationService.findAllLocations()
//         // get location id from p.country_code
//         const locationIdMap = new Map<string, Types.ObjectId>()
//         for (const location of locations) {
//             locationIdMap.set(location.code!, location._id)
//         }

//         const predictionsToInsert = predictions.map(
//             (p: any) =>
//                 ({
//                     user_id: user._id,
//                     location_id: locationIdMap.get(p.country_code),
//                     model_id: null,
//                     prediction_type: PredictionType.historical,
//                     base_date: new Date(p.date),
//                     health_outcomes: {
//                         respiratory_disease_rate: { point: Number(p.respiratory_disease_rate) },
//                         cardio_mortality_rate: { point: Number(p.cardio_mortality_rate) },
//                         vector_disease_risk_score: { point: Number(p.vector_disease_risk_score) },
//                         waterborne_disease_incidents: {
//                             point: Number(p.waterborne_disease_incidents),
//                         },
//                         heat_related_admissions: { point: Number(p.heat_related_admissions) },
//                     },
//                 }) as unknown as Pred
//         )

//         // Insert predictions
//         const inserted = await mainService.predictionService.insertMany(predictionsToInsert)
//         return [undefined, `Created ${inserted.length} prediction(s) successfully`]
//         // return [undefined, `Created prediction(s) successfully`]
//     })
// )
