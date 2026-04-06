enum DataSourcesEnum {
    openmeteo = "openmeteo",
    kaggle = "kaggle",
    cdc = "cdc",
    dhs = "dhs",
    ghdx = "ghdx",
    merra2 = "merra2",
    fluview = "fluview",
    who = "who",
    openweather = "openweather",
    world_bank_climate = "world_bank_climate",
    openaq = "openaq",
    purpleair = "purpleair",
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
