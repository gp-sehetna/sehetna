import { ThEME_SVG_PATHS } from "@/shared/config/map-theme-config"

type ThemeOptionProps = {
    themeName: string
    colors: Record<string, string>
    active?: boolean
}

export const ThemeOption = ({ themeName, colors, active = false }: ThemeOptionProps) => {
    const colorArray = Object.values(colors)

    return (
        <div className="h-fit w-16 text-center text-wrap">
            <div
                className={`relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 transition-all ${active ? "border-primary-200 hover:border-primary-200/70" : "border-neutral-200/60 hover:border-neutral-200"} `}
            >
                <svg
                    viewBox="5 1 72 72"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full"
                >
                    <g clipPath="url(#background_clip)">
                        {ThEME_SVG_PATHS.map((path, index) => (
                            <path
                                key={path}
                                d={path}
                                fill={colorArray[index % colorArray.length]}
                            />
                        ))}
                    </g>
                    <defs>
                        <clipPath id="background_clip">
                            <path d="M5 13C5 6.37258 10.3726 1 17 1H65C71.6274 1 77 6.37258 77 13V61C77 67.6274 71.6274 73 65 73H17C10.3726 73 5 67.6274 5 61V13Z"></path>
                        </clipPath>
                    </defs>
                </svg>
                <div className="absolute inset-0 bg-neutral-100/20 dark:bg-neutral-800/15"></div>
            </div>
            <p className="mt-1 cursor-pointer text-xs text-neutral-900">{themeName}</p>
        </div>
    )
}
