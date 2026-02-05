// ? Debugging bbox boundries
type BBox = [number, number, number, number] | [number, number, number, number, number, number]
const bboxToPolygon = (
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
): GeoJSON.GeoJSON => ({
    type: "Feature",
    geometry: {
        type: "Polygon",
        coordinates: [
            [
                [minX, minY],
                [maxX, minY],
                [maxX, maxY],
                [minX, maxY],
                [minX, minY], // close ring
            ],
        ],
    },
    properties: {},
})

const drawBBox = (map: maplibregl.Map, bbox: BBox) => {
    const [minX, minY, maxX, maxY] = bbox
    const feature = bboxToPolygon(minX, minY, maxX, maxY)

    const sourceId = "debug-bbox-source"
    const lineLayerId = "debug-bbox-line"
    const fillLayerId = "debug-bbox-fill"

    if (map.getSource(sourceId)) {
        ;(map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(feature)
        return
    }

    map.addSource(sourceId, {
        type: "geojson",
        data: feature,
    })

    map.addLayer({
        id: fillLayerId,
        type: "fill",
        source: sourceId,
        paint: {
            "fill-color": "#ff0000",
            "fill-opacity": 0.15,
        },
    })

    map.addLayer({
        id: lineLayerId,
        type: "line",
        source: sourceId,
        paint: {
            "line-color": "#ff0000",
            "line-width": 2,
        },
    })
}
