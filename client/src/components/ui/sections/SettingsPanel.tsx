import type { ReactNode } from "react"

type SettingsPanelProps = {
    title: string
    disabled?: boolean
    description?: string
    children: ReactNode
}

export default function SettingsPanel({
    title,
    disabled = false,
    description,
    children,
}: SettingsPanelProps) {
    return (
        <>
            <div className="home-surface relative overflow-hidden rounded-3xl p-6">
                <div className="mb-5 flex flex-col gap-1">
                    <p className="text-neutral-1000 text-sm font-bold">{title}</p>
                    {description ? <p className="text-xs text-neutral-600">{description}</p> : null}
                </div>
                {children}
                {disabled ? (
                    <div className="bg-background/80 glassy absolute inset-0 cursor-not-allowed after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-4xl after:font-bold after:text-neutral-700/20 after:content-['Soon!_:)']" />
                ) : null}
            </div>
        </>
    )
}
