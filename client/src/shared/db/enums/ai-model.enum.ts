enum AiModelEnum {
    lgbm = "lgbm",
    patchtst = "patchtst",
    timesfm = "timesfm",
    xgboost = "xgboost",
    random_forest = "random_forest",
    lstm = "lstm",
    other = "other",
}

enum TaskEnum {
    regresssion = "regression",
    forecasting = "forecasting",
}

enum ModelStatusEnum {
    active = "active",
    deprecated = "deprecated",
    experimental = "experimental",
}

export { AiModelEnum, TaskEnum, ModelStatusEnum }
