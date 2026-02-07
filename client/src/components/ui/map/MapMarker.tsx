import { Marker } from "react-map-gl/maplibre"
import { Coordinates } from "@/shared/types/map"

type Props = {
    coords: Coordinates | null
}

const MapMarker = ({ coords }: Props) => {
    return (
        <>
            {coords && (
                <Marker
                    latitude={coords.lat}
                    longitude={coords.lng}
                    color="var(--color-danger-100)"
                    scale={0.7}
                    anchor="bottom"
                ></Marker>
            )}
        </>
    )
}

export default MapMarker
