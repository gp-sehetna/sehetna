enum DataSourcesEnum {
    kaggle = "kaggle",
    cdc = "cdc",
    dhs = "dhs",
    ghdx = "ghdx",
    merra2 = "merra2",
    fluview = "fluview",
    who = "who",
}

enum GranularityEnum {
    daily = "daily",
    weekly = "weekly",
    monthly = "monthly",
    annual = "annual",
}

enum GeoLevelEnum {
    country = "country",
    region = "region",
    state = "state",
}

enum StatusEnum {
    active = "active",
    archived = "archived",
    pending = "pending",
}

export { DataSourcesEnum, GranularityEnum, GeoLevelEnum, StatusEnum }
