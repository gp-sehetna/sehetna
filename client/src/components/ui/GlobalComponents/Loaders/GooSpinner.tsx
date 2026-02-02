import React from "react"

interface GooSpinnerProps {
    loading?: boolean
    size?: number
    color?: "primary" | "secondary" | "neutral"
    sizeUnit?: string
}
const colorsMap = {
    primary: "var(--color-primary-300)",
    secondary: "var(--color-secondary-400)",
    neutral: "var(--color-neutral-1000)",
}

export const GooSpinner: React.FC<GooSpinnerProps> = ({
    loading = true,
    size = 55,
    color = "neutral",
    sizeUnit = "px",
}) => {
    if (!loading) return null

    const center = size / 4
    const translatePositions = [-center, center]

    return (
        <div
            className="relative"
            style={{
                width: `${size}${sizeUnit}`,
                height: `${size}${sizeUnit}`,
                filter: "url(#goo)",
            }}
        >
            {/* Animations */}
            <style>{`
                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes move {
                    0% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(var(--translate)) scale(0.8); }
                    100% { transform: translateY(0) scale(1); }
                }
            `}</style>

            {/* Balls wrapper */}
            <div
                className="relative"
                style={{
                    width: `${size}${sizeUnit}`,
                    height: `${size}${sizeUnit}`,
                    animation: "rotate 1.7s linear infinite",
                }}
            >
                {translatePositions.map((translateTo, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            top: `${size / 2 - size / 6}${sizeUnit}`,
                            left: `${size / 2 - size / 6}${sizeUnit}`,
                            width: `${size / 3}${sizeUnit}`,
                            height: `${size / 3}${sizeUnit}`,
                            backgroundColor: colorsMap[color],
                            animation: "move 1.5s ease-in-out infinite",
                            ["--translate" as any]: `${translateTo}${sizeUnit}`,
                        }}
                    />
                ))}
            </div>

            {/* Goo filter */}
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  
                                    0 1 0 0 0  
                                    0 0 1 0 0  
                                    0 0 0 15 -5"
                            result="goo"
                        />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>
        </div>
    )
}
