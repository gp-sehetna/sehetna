import { Button } from "@/components/ui/shadcn/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu"
import { ExplanationMethod } from "@/features/environment/week/week.types"
import { useSettingsStore } from "@/stores/use-settings"
import { Cog, Minus, Plus } from "lucide-react"
import { useMemo } from "react"
const MapCog = () => {
    const { explanationMethod, setExplanationMethod, contributors, setContributors } =
        useSettingsStore()
    const explanations: ExplanationMethod[] = ["cumulative", "group"]

    const range = useMemo(() => {
        if (explanationMethod === "cumulative") return { min: 5, max: 25 }
        return { min: 2, max: 10 }
    }, [explanationMethod])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="glassy" size="icon" className="h-8 w-8 rounded-full">
                    <Cog className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Explanation Method</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {explanations.map((method) => (
                    <DropdownMenuItem
                        key={method}
                        className={method === explanationMethod ? "bg-accent" : undefined}
                        onClick={() => setExplanationMethod(method)}
                    >
                        <span className="capitalize">{method}</span>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Top Contributors</DropdownMenuLabel>
                <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                    <Button
                        variant="glassy"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setContributors(Math.max(range.min, contributors - 1))}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-4 text-center font-mono text-sm">{contributors}</span>
                    <Button
                        variant="glassy"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setContributors(Math.min(range.max, contributors + 1))}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default MapCog
