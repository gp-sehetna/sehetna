import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/shadcn/select"
import { AiModelEnum, aiModelsMeta } from "@/shared/db/enums/ai-model.enum"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { useUserStore } from "@/stores/user/use-user"

export const ModelSelector = () => {
    const selectedModel = usePredictionsStore((s) => s.forecaster)
    const setSelectedModel = usePredictionsStore((s) => s.setForecaster)
    const isAuthenticated = useUserStore((s) => s.isAuth)

    return (
        <div className="flex flex-col gap-2">
            <p className="text-muted-foreground mt-2 text-xs">
                Select a model to retrieve it&apos;s forecasts
            </p>
            <Select
                value={selectedModel}
                onValueChange={(value) => setSelectedModel(value as AiModelEnum)}
            >
                <SelectTrigger size="sm" variant="glassy">
                    <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(aiModelsMeta).map(([key, { title, require_auth }]) => (
                        <SelectItem
                            disabled={require_auth && !isAuthenticated}
                            key={key}
                            value={key}
                        >
                            <div className="flex items-center gap-2">{title}</div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
