const AiModel = {
    lgbm: "lgbm",
    patchtst: "patchtst",
    timesfm: "timesfm",
    xgboost: "xgboost",
    random_forest: "random_forest",
    lstm: "lstm",
    other: "other",
} as const

const aiModelsMeta: Partial<Record<AiModelEnum, { title: string; disabled?: boolean }>> = {
    [AiModel.patchtst]: { title: "PatchTST" },
    [AiModel.timesfm]: { title: "TimesFM", disabled: true },
}

const Task = {
    regresssion: "regression",
    forecasting: "forecasting",
} as const

const ModelStatus = {
    active: "active",
    deprecated: "deprecated",
    experimental: "experimental",
} as const

type AiModelEnum = (typeof AiModel)[keyof typeof AiModel]
type TaskEnum = (typeof Task)[keyof typeof Task]
type ModelStatusEnum = (typeof ModelStatus)[keyof typeof ModelStatus]

export { AiModel, aiModelsMeta, ModelStatus, Task }
export type { AiModelEnum, ModelStatusEnum, TaskEnum }
