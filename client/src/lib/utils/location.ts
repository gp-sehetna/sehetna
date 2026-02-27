export function toDMS(value: number, type: "lat" | "lng", decimals = 2) {
    const abs = Math.abs(value)
    const deg = Math.floor(abs)
    const minFloat = (abs - deg) * 60
    const min = Math.floor(minFloat)
    const sec = ((minFloat - min) * 60).toFixed(decimals)

    const dir = type === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W"

    return `${deg}° ${min}' ${sec}" ${dir}`
}
