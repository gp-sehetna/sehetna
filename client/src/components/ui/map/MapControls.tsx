import { Root, createRoot } from "react-dom/client"
import { useControl, IControl } from "react-map-gl/maplibre"
import Legend, { LegendProps } from "@/components/ui/legend/Legend"
import { useEffect } from "react"
import MapLayerSelector, { LayerSelectorProps } from "@/components/ui/map/MapLayerSelector"

type Props = LayerSelectorProps & LegendProps

const BottomRightContent = ({ healthOutcome, onLayerSelect }: Props) => {
    return (
        <div className="flex w-80 flex-col">
            <MapLayerSelector healthOutcome={healthOutcome} onLayerSelect={onLayerSelect} />
            <Legend healthOutcome={healthOutcome} />
        </div>
    )
}

class BottomRightView implements IControl {
    private root!: Root | null
    private container!: HTMLElement
    private healthOutcome: string
    private onLayerSelect: (outcome: string) => void

    constructor(healthOutcome: string, onLayerSelect: (outcome: string) => void) {
        this.healthOutcome = healthOutcome
        this.onLayerSelect = onLayerSelect
    }

    onAdd() {
        this.container = document.createElement("div")
        this.container.className = "maplibregl-ctrl custom"
        this.root = createRoot(this.container)
        this.root.render(
            <BottomRightContent
                healthOutcome={this.healthOutcome}
                onLayerSelect={this.onLayerSelect}
            />
        )

        return this.container
    }

    onRemove() {
        if (this.root) {
            const rootToUnmount = this.root
            this.root = null
            setTimeout(() => rootToUnmount.unmount(), 0)
        }
    }

    onUpdate(healthOutcome: string) {
        this.healthOutcome = healthOutcome
        if (this.root)
            this.root.render(
                <BottomRightContent
                    healthOutcome={healthOutcome}
                    onLayerSelect={this.onLayerSelect}
                />
            )
    }
}

const MapControls = ({ healthOutcome, onLayerSelect }: Props) => {
    const control = useControl(() => new BottomRightView(healthOutcome, onLayerSelect), {
        position: "bottom-right",
    })

    useEffect(() => {
        control.onUpdate(healthOutcome)
    }, [healthOutcome, control])

    return null
}

export default MapControls
