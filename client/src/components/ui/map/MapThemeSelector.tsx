import { ThemeOption } from "@/components/ui/map/ThemeOption"
import { Button } from "@/components/ui/shadcn/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover"
import { MAP_THEME_DEFINITIONS } from "@/shared/config/map-theme-config"
import { useThemeStore } from "@/stores/map/use-theme"
import { Layers } from "lucide-react"

const MapThemes = () => {
    const { toggleTheme, isThemeActive } = useThemeStore()

    return MAP_THEME_DEFINITIONS.map((theme) => (
        <button key={theme.id} type="button" onClick={() => toggleTheme(theme.id)}>
            <ThemeOption
                themeName={theme.name}
                colors={theme.colors}
                active={isThemeActive(theme.id)}
            />
        </button>
    ))
}

const MapThemeSelector = () => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="glassy"
                    className="hidden w-full transition-shadow hover:shadow-md md:flex"
                >
                    <Layers />
                    Layers
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="top"
                className="mx-4 my-1 w-65 overflow-visible rounded-2xl p-2 shadow-xl sm:max-w-none"
                align="start"
            >
                <CardHeader className="p-2">
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>Select a theme for the map</CardDescription>
                </CardHeader>

                {/* even the vertical gap here isn't working */}
                <CardContent className="flex flex-wrap gap-4 p-2">
                    <MapThemes />
                </CardContent>
            </PopoverContent>
        </Popover>
    )
}

export { MapThemes, MapThemeSelector }
