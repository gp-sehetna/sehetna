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

    const maxContributors = useMemo(() => {
        if (explanationMethod === "cumulative") return 23
        return 10
    }, [explanationMethod])

    const minContributors = useMemo(() => {
        if (explanationMethod === "cumulative") return 5
        return 2
    }, [explanationMethod])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="glassy" size="icon" className="h-10 w-10 rounded-full">
                    <Cog className="h-6 w-6" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Explanation Method</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {explanations.map((method) => (
                    <DropdownMenuItem
                        key={method}
                        className={method === explanationMethod ? "bg-primary-200" : ""}
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
                        onClick={(e) => {
                            e.stopPropagation()
                            setContributors(Math.max(minContributors, contributors - 1))
                        }}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-4 text-center font-mono text-sm">{contributors}</span>
                    <Button
                        variant="glassy"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                            e.stopPropagation()
                            setContributors(Math.min(maxContributors, contributors + 1))
                        }}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default MapCog
