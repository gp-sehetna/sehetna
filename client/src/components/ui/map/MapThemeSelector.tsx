import { Button } from "@/components/ui/shadcn/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover"
import { useMapTheme } from "@/stores/map/use-map-themes"
import { Palette } from "lucide-react"
import { ThemeOption } from "./ThemeOption"
import { AVAILABLE_THEMES } from "@/shared/config/map-theme-config"

const buttonStyles =
    "transition-base rounded-md p-2 hover:bg-neutral-100/50 w-full active:bg-neutral-100/75 select-none text-black cursor-pointer"

const MapThemeSelector = ({isPhone=false} : {isPhone?: boolean}) => {
    const { toggleTheme, isThemeActive } = useMapTheme()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="glassy" className={buttonStyles}>
                    <Palette />
                    Theme
                </Button>
            </PopoverTrigger>
            <PopoverContent side={isPhone ? "top" : "left"} className="shadow-xl -translate-y-1/6 md:translate-0 max-w-48 sm:max-w-none  h-auto min-h-fit max-h-none overflow-visible" align="start">
                <Card className="flex flex-col gap-4 border-0 bg-transparent shadow-none ">
                    <CardHeader className="p-0">
                        <CardTitle>Theme</CardTitle>
                        <CardDescription>Select a theme for the map</CardDescription>
                    </CardHeader>

                    {/* even the vertical gap here isn't working */}
                    <CardContent className="flex flex-wrap w-full gap-4 p-0">
                        {AVAILABLE_THEMES.map((theme) => (
                            <button  key={theme.id} onClick={() => toggleTheme(theme.id)}>
                                <ThemeOption
                                    themeName={theme.name}
                                    colors={theme.colors}
                                    active={isThemeActive(theme.id)}
                                />
                            </button>
                        ))}
                    </CardContent>
                </Card>
            </PopoverContent>
        </Popover>
    )
}

export default MapThemeSelector
