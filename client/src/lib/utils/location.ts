function toDMS(value: number, type: "lat" | "lng", decimals = 2) {
    const abs = Math.abs(value)
    const deg = Math.floor(abs)
    const minFloat = (abs - deg) * 60
    const min = Math.floor(minFloat)
    const sec = ((minFloat - min) * 60).toFixed(decimals)

    const dir = type === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W"

    return `${deg}° ${min}' ${sec}" ${dir}`
}

const parseCoords = (coords?: string | null): readonly [number, number] => {
    if (!coords) throw new Error("coords is required")
    const parts = coords.split(",").map((s) => s.trim())
    if (parts.length !== 2) throw new Error("coords must be in format lat,lng")

    const [lat, lng] = parts.map(Number)
    if (isNaN(lat) || isNaN(lng)) throw new Error("coords must be in format lat,lng")
    return [lat, lng]
}

const formatCoords = (coords?: string | null): readonly [string, string] => {
    try {
        const [lat, lng] = parseCoords(coords)
        return [toDMS(lat, "lat"), toDMS(lng, "lng")]
    } catch (error) {
        console.error(error)
        return ["err", "err"]
    }
}
const refineCoords = (coords?: string | null) => {
    try {
        const [lat, lng] = parseCoords(coords)
        return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
    } catch (error) {
        console.error(error)
        return false
    }
}

export { formatCoords, parseCoords, refineCoords, toDMS }
