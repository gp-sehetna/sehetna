import { NavigationControl } from "react-map-gl/maplibre"

const ZoomControls = () => {
    return <NavigationControl position="top-right" showCompass={false} visualizePitch />
}
export default ZoomControls
