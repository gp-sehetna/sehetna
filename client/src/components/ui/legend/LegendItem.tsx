import type { ReactElement } from "react"

type LegendItemProps = {
    label: string
    unit: string | ReactElement
    children: ReactElement
}
export function LegendItem({ label, unit, children }: LegendItemProps) {
    return (
        <div className="glassy text-neutral-1000 rounded-2xl">
            <h6 className="flex px-3 py-2 text-sm!">
                <span className="w-full">{label}</span>{" "}
                <small className="text-muted-foreground mx-auto">{unit}</small>
            </h6>
            {children}
        </div>
    )
}
