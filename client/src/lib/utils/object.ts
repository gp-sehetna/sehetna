export interface IntervalPrediction {
    point: number
    lower: number | null
    upper: number | null
}

export const nullableNumber = {
    type: Number,
    default: null,
}
