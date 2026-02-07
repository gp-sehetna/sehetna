from typing import Literal

type Pollutants = Literal["o3_8h", "o3_1h", "pm25", "pm10", "co", "so2", "no2"]
BreakPoint = list[tuple[float, float, int, int]]
BreakPointsDict = dict[Pollutants, BreakPoint]
type ExplainerMethod = Literal["cumulative", "group"]
