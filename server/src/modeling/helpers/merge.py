import pandas as pd
from fuzzywuzzy import fuzz, process


def fuzzy_merge(
    df_left: pd.DataFrame,
    df_right: pd.DataFrame,
    left_on: str | list[str],
    right_on: str | list[str],
    threshold=65,
):
    # Create mapping dictionary
    mapping = {}
    for left_val in df_left[left_on].unique():
        match = process.extractOne(left_val, df_right[right_on].unique(), scorer=fuzz.ratio)
        if match[1] >= threshold:
            mapping[left_val] = match[0]

    df_left["matched_country"] = df_left[left_on].map(mapping)

    result = df_left.merge(
        df_right[["DIM_TIME", "GEO_NAME_SHORT", "INDEX_N"]],
        how="left",
        left_on=["year", "matched_country"],
        right_on=["DIM_TIME", "GEO_NAME_SHORT"],
    )

    return result.drop(columns=["matched_country", "DIM_TIME", "GEO_NAME_SHORT"]).rename(
        columns={"INDEX_N": "uhs_service_coverage_index"}
    )
