import { Coordinates } from "@/features/environment/week/week.types"
import { Marker } from "react-map-gl/maplibre"

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
                />
            )}
        </>
    )
}

export default MapMarker
