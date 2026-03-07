const PredictionType = {
    forecasted: "forecasted",
    predicted: "predicted",
    historical: "historical",
} as const

type PredictionTypeEnum = (typeof PredictionType)[keyof typeof PredictionType]

export { PredictionType }
export type { PredictionTypeEnum }
