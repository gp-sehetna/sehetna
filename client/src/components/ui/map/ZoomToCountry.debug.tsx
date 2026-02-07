import { Map, GeoJSONSource } from "maplibre-gl"

// ? Debugging bbox boundries
type BBox = [number, number, number, number] | [number, number, number, number, number, number]
const bboxToPolygon = (bbox: BBox): GeoJSON.GeoJSON => {
    const [minX, minY, maxX, maxY] = bbox
    return {
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
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const drawBBox = (map: Map, bbox: BBox) => {
    const feature = bboxToPolygon(bbox),
        sourceId = "debug-bbox-source",
        lineLayerId = "debug-bbox-line",
        fillLayerId = "debug-bbox-fill",
        source = map.getSource<GeoJSONSource>(sourceId)

    if (source) {
        source.setData(feature)
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
