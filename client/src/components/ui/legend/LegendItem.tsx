import type { ReactElement } from "react"

type LegendItemProps = {
    label: string
    unit: string | ReactElement
    children: ReactElement
}
export function LegendItem({ label, unit, children }: LegendItemProps) {
    return (
        <div className="absolute right-0 bottom-0 text-center">
            <p className="py-1 text-base">
                {label} <small>{unit}</small>
            </p>
            {children}
        </div>
    )
}
