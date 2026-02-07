"use client"
import { Root, createRoot } from "react-dom/client"
import { useControl, IControl } from "react-map-gl/maplibre"
import Legend, { LegendProps } from "@/components/ui/legend/Legend"
import MapLayerSelector, { LayerSelectorProps } from "@/components/ui/map/MapLayerSelector"
import MapCountryDetails, { MainSidebarProps } from "./MapCountryDetails"
import { useEffect } from "react"

type BottomRightProps = LayerSelectorProps & LegendProps
type BottomLeftProps = MainSidebarProps

const BottomRightContent = ({ healthOutcome }: BottomRightProps) => {
    return (
        <div className="flex w-80 flex-col">
            <MapLayerSelector healthOutcome={healthOutcome} />
            <Legend healthOutcome={healthOutcome} />
        </div>
    )
}

const BottomLeftContent = ({ healthOutcome }: BottomLeftProps) => {
    return <MapCountryDetails healthOutcome={healthOutcome} />
}

class BottomRightView implements IControl {
    private root!: Root | null
    private container!: HTMLElement
    private healthOutcome: string

    constructor(healthOutcome: string) {
        this.healthOutcome = healthOutcome
    }

    onAdd() {
        this.container = document.createElement("div")
        this.container.className = "maplibregl-ctrl custom"
        this.root = createRoot(this.container)
        this.root.render(<BottomRightContent healthOutcome={this.healthOutcome} />)

        return this.container
    }

    onRemove() {
        if (!this.root) return
        const rootToUnmount = this.root
        this.root = null
        queueMicrotask(() => rootToUnmount.unmount())
    }

    onUpdate(healthOutcome: string) {
        this.healthOutcome = healthOutcome
        if (this.root) this.root.render(<BottomRightContent healthOutcome={healthOutcome} />)
    }
}

class BottomLeftView implements IControl {
    private root!: Root | null
    private container!: HTMLElement
    private healthOutcome: string

    constructor(healthOutcome: string) {
        this.healthOutcome = healthOutcome
    }

    onAdd() {
        this.container = document.createElement("div")
        this.container.className = "maplibregl-ctrl custom"
        this.root = createRoot(this.container)
        this.root.render(<BottomLeftContent healthOutcome={this.healthOutcome} />)

        return this.container
    }

    onRemove() {
        if (!this.root) return
        const rootToUnmount = this.root
        this.root = null
        queueMicrotask(() => rootToUnmount.unmount())
    }

    onUpdate(healthOutcome: string) {
        this.healthOutcome = healthOutcome
        if (this.root) this.root.render(<BottomLeftContent healthOutcome={healthOutcome} />)
    }
}

const MapControls = ({ healthOutcome }: BottomRightProps) => {
    const layerControls = useControl(() => new BottomRightView(healthOutcome), {
        position: "bottom-right",
    })

    const countryControls = useControl(() => new BottomLeftView(healthOutcome), {
        position: "bottom-left",
    })

    useEffect(() => {
        layerControls.onUpdate(healthOutcome)
    }, [layerControls, healthOutcome])

    useEffect(() => {
        countryControls.onUpdate(healthOutcome)
    }, [countryControls, healthOutcome])

    return null
}

export default MapControls
