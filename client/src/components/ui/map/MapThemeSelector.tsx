import { Button } from "@/components/ui/shadcn/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover"
import { toProperCase, unslugify } from "@/lib/utils"
import { MAP_LAYER_IDS } from "@/shared/db/enums/enums.map"
import { useMapTheme } from "@/stores/map/use-map-themes"
import { Palette } from "lucide-react"

const buttonStyles =
    "transition-base rounded-md p-2 hover:bg-neutral-100/50 w-full active:bg-neutral-100/75 select-none text-black cursor-pointer"

const MapThemeSelector = () => {
    const themes = [{ name: MAP_LAYER_IDS.CONTINENTS }, { name: MAP_LAYER_IDS.INCOME }]
    const { toggleTheme } = useMapTheme()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="glassy" className={buttonStyles}>
                    <Palette />
                    Theme
                </Button>
            </PopoverTrigger>
            <PopoverContent side="left" className="shadow-xl" align="start">
                <Card className="border-0 bg-transparent shadow-none">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle>Theme</CardTitle>
                        <CardDescription>Select a theme for the map</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 overflow-y-auto p-0">
                        {themes.map((theme) => (
                            <Button key={theme.name} onClick={() => toggleTheme(theme.name)}>
                                {toProperCase(unslugify(theme.name))}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </PopoverContent>
        </Popover>
    )
}

export default MapThemeSelector
