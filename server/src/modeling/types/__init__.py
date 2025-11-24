from typing import Dict, List, Literal, Tuple

Pollutants = Literal["o3_8h", "o3_1h", "pm25", "pm10", "co", "so2", "no2"]
BreakPoint = List[Tuple[float, float, int, int]]
BreakPointsDict = Dict[Pollutants, BreakPoint]
