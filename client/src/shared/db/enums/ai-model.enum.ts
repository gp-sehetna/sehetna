const AiModel = {
    lgbm: "lgbm",
    patchtst: "patchtst",
    timesfm: "timesfm",
    xgboost: "xgboost",
    random_forest: "random_forest",
    lstm: "lstm",
    "gpt2-forecaster": "gpt2-forecaster",
    other: "other",
} as const

const aiModelsMeta: Partial<Record<AiModelEnum, { title: string; require_auth?: boolean }>> = {
    [AiModel.patchtst]: { title: "PatchTST" },
    [AiModel.timesfm]: { title: "TimesFM", require_auth: true },
    [AiModel["gpt2-forecaster"]]: { title: "GPT2 Forecaster", require_auth: true },
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
