import { Plus, Minus } from "lucide-react"
import { MouseEventHandler } from "react"
import { Button } from "../shadcn/button"

type ZoomControlsProps = {
    onZoomIn: MouseEventHandler<HTMLButtonElement>
    onZoomOut: MouseEventHandler<HTMLButtonElement>
}

const ZoomControls = ({ onZoomIn, onZoomOut }: ZoomControlsProps) => {
    const iconSize = 18
    return (
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            <Button
                onClick={onZoomIn}
                variant="glassy"
                className="rounded-xl"
                size="icon"
                aria-label="Zoom in"
            >
                <Plus size={iconSize} />
            </Button>
            <Button
                onClick={onZoomOut}
                variant="glassy"
                className="rounded-xl"
                size="icon"
                aria-label="Zoom out"
            >
                <Minus size={iconSize} />
            </Button>
        </div>
    )
}
export default ZoomControls
