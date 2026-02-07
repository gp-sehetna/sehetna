import Legend, { LegendProps } from "@/components/ui/legend/Legend"
import MapLayerSelector, { LayerSelectorProps } from "@/components/ui/map/MapLayerSelector"
import { GeoJSONFeature } from "maplibre-gl"
import { useEffect } from "react"
import { Root, createRoot } from "react-dom/client"
import { IControl, useControl } from "react-map-gl/maplibre"
import MapCountryDetails, { MainSidebarProps } from "./MapCountryDetails"

type BottomRightProps = LayerSelectorProps & LegendProps
type BottomLeftProps = MainSidebarProps

const BottomRightContent = ({ healthOutcome, onLayerSelect }: BottomRightProps) => {
    return (
        <div className="flex w-80 flex-col">
            <MapLayerSelector healthOutcome={healthOutcome} onLayerSelect={onLayerSelect} />
            <Legend healthOutcome={healthOutcome} />
        </div>
    )
}

const BottomLeftContent = (props: BottomLeftProps) => {
    return <MapCountryDetails {...props} />
}

class BottomRightView implements IControl {
    private root!: Root | null
    private container!: HTMLElement
    private props: BottomRightProps

    constructor(props: BottomRightProps) {
        this.props = props
    }

    onAdd() {
        this.container = document.createElement("div")
        this.container.className = "maplibregl-ctrl custom"
        this.root = createRoot(this.container)
        this.root.render(<BottomRightContent {...this.props} />)

        return this.container
    }

    onRemove() {
        if (!this.root) return
        const rootToUnmount = this.root
        this.root = null
        queueMicrotask(() => rootToUnmount.unmount())
    }

    onUpdate(healthOutcome: string) {
        if (this.root)
            this.root.render(
                <BottomRightContent
                    healthOutcome={healthOutcome}
                    onLayerSelect={this.props.onLayerSelect}
                />
            )
    }
}

class BottomLeftView implements IControl {
    private root!: Root | null
    private container!: HTMLElement

    private props: BottomLeftProps

    constructor(props: BottomLeftProps) {
        this.props = props
    }

    onAdd() {
        this.container = document.createElement("div")
        this.container.className = "maplibregl-ctrl custom"
        this.root = createRoot(this.container)
        this.root.render(<BottomLeftContent {...this.props} />)

        return this.container
    }

    onRemove() {
        if (!this.root) return
        const rootToUnmount = this.root
        this.root = null
        queueMicrotask(() => rootToUnmount.unmount())
    }

    onUpdate(clickedZone: GeoJSONFeature | null, date: Date | undefined) {
        if (this.root)
            this.root.render(
                <BottomLeftContent
                    clickedZone={clickedZone}
                    date={date}
                    closeCountryDetails={this.props.closeCountryDetails}
                    setDate={this.props.setDate}
                />
            )
    }
}

const MapControls = ({
    clickedZone,
    closeCountryDetails,
    date,
    setDate,
    healthOutcome,
    onLayerSelect,
}: BottomRightProps & BottomLeftProps) => {
    const layerControls = useControl(() => new BottomRightView({ healthOutcome, onLayerSelect }), {
        position: "bottom-right",
    })

    const countryControls = useControl(
        () => new BottomLeftView({ clickedZone, closeCountryDetails, date, setDate }),
        {
            position: "bottom-left",
        }
    )

    useEffect(() => {
        layerControls.onUpdate(healthOutcome)
    }, [layerControls, healthOutcome])

    useEffect(() => {
        countryControls.onUpdate(clickedZone, date)
    }, [countryControls, clickedZone, date])

    return null
}

export default MapControls
