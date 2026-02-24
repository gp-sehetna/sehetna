import { Palette } from "lucide-react"
import { Button } from "../shadcn/button"
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover"
import { useMapTheme } from "@/stores/map/use-map-themes"
import { MAP_LAYER_IDS } from "@/shared/db/enums/enums.map"

const buttonStyles =
    "transition-base rounded-md p-2  hover:bg-neutral-100/50 flex select-none text-black cursor-pointer items-center gap-2"

const MapThemeSelector = () => {
    const themes = [
        {name: MAP_LAYER_IDS.CONTINENTS},
        {name: MAP_LAYER_IDS.INCOME}
    ]

    const {toggleTheme} = useMapTheme()
    
    return (
        <div className="">
            <Popover >
                <PopoverTrigger asChild>
                    <Button
                        variant="glassy"
                        className={buttonStyles}
                    >
                        <Palette />
                        <p>Theme</p>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="z-1000 w-fit   p-2 flex gap-3 flex-col" align="end">
                    <h6>Themes</h6>
                    <div className=" flex gap-5">
                        {
                            themes.map((theme) => <Button key={theme.name} onClick={() => toggleTheme(theme.name)}>{theme.name}</Button>)
                        }

                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default MapThemeSelector
