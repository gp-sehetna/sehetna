import { MAP_LAYER_IDS } from "@/shared/db/enums/enums.map"
import { create } from "zustand"

type MapThemeState = {
    mapThemes: string[]
    toggleTheme: (theme: string) => void
    reset: () => void
}
export const useMapTheme = create<MapThemeState>((set, get) => {
    

    return {
        mapThemes: [MAP_LAYER_IDS.CONTINENTS, MAP_LAYER_IDS.INCOME],
        toggleTheme: (theme: string) => {
            const { mapThemes } = get()
            if (mapThemes.includes(theme)) {
                set({ mapThemes: mapThemes.filter((t) => t !== theme) })
            } else {
                set({ mapThemes: [...mapThemes, theme] })
            }
        },
        reset: () => set({ mapThemes: [MAP_LAYER_IDS.CONTINENTS, MAP_LAYER_IDS.INCOME] }),
    }
})
