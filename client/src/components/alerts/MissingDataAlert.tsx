import { AlertTriangle } from "lucide-react"

type Props = {
    missingKeys: string[]
}

export function MissingDataAlert({ missingKeys }: Props) {
    return (
        <div className="space-y-3 text-left">
            <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Some environment indicators are missing</span>
            </div>

            <p className="text-muted-foreground text-sm">
                The following fields contain <strong>null</strong> values for this location and
                date:
            </p>

            <div className="flex flex-wrap gap-2">
                {missingKeys.map((key) => (
                    <span key={key} className="bg-muted rounded-md px-2 py-1 font-mono text-xs">
                        {key}
                    </span>
                ))}
            </div>

            <hr className="border-border" />

            <p className="text-muted-foreground text-xs">
                You may continue with the simulation, but results could be inaccurate or unstable.
            </p>
        </div>
    )
}
