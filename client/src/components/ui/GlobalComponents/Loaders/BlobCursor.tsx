"use client"

import React, { useRef, useEffect, useCallback } from "react"
import gsap from "gsap"

export interface BlobCursorProps {
    blobType?: "circle" | "square"
    fillColor?: string
    trailCount?: number
    sizes?: number[]
    innerSizes?: number[]
    innerColor?: string
    opacities?: number[]
    shadowColor?: string
    shadowBlur?: number
    shadowOffsetX?: number
    shadowOffsetY?: number
    filterId?: string
    filterStdDeviation?: number
    filterColorMatrixValues?: string
    useFilter?: boolean
    fastDuration?: number
    slowDuration?: number
    fastEase?: string
    slowEase?: string
    zIndex?: number
}

export default function BlobCursor({
    blobType = "circle",
    fillColor = "var(--color-primary)",
    trailCount = 12,
    sizes = [60, 125, 75],
    innerSizes = [20, 35, 25],
    innerColor = "var(--color-neutral-100)",
    opacities = [0.6, 0.6, 0.6],
    shadowColor = "rgba(0,0,0,0.75)",
    shadowBlur = 10,
    shadowOffsetX = 15,
    shadowOffsetY = 15,
    filterId = "blob",
    filterStdDeviation = 30,
    filterColorMatrixValues = "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10",
    useFilter = true,
    fastDuration = 0.4,
    slowDuration = 0.8,
    fastEase = "power3.out",
    slowEase = "power1.out",
    zIndex = 100,
}: BlobCursorProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const blobsRef = useRef<(HTMLDivElement | null)[]>([])

    const updateOffset = useCallback(() => {
        if (!containerRef.current) return { left: 0, top: 0 }
        const rect = containerRef.current.getBoundingClientRect()
        return { left: rect.left, top: rect.top }
    }, [])

    const handleMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
            const { left, top } = updateOffset()
            const x = "clientX" in e ? e.clientX : e.touches[0].clientX
            const y = "clientY" in e ? e.clientY : e.touches[0].clientY

            blobsRef.current.forEach((el, i) => {
                if (!el) return
                const isLead = i === 0
                gsap.to(el, {
                    x: x - left,
                    y: y - top,
                    duration: isLead ? fastDuration : slowDuration,
                    ease: isLead ? fastEase : slowEase,
                })
            })
        },
        [updateOffset, fastDuration, slowDuration, fastEase, slowEase]
    )

    useEffect(() => {
        const onResize = () => updateOffset()
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [updateOffset])

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMove}
            onTouchMove={handleMove}
            className="absolute top-0 left-0 h-full w-full"
            style={{ zIndex }}
        >
            {useFilter && (
                <svg className="absolute h-0 w-0">
                    <filter id={filterId}>
                        <feGaussianBlur
                            in="SourceGraphic"
                            result="blur"
                            stdDeviation={filterStdDeviation}
                        />
                        <feColorMatrix in="blur" values={filterColorMatrixValues} />
                    </filter>
                </svg>
            )}

            <div
                className="pointer-events-none absolute inset-0 cursor-default overflow-hidden select-none"
                style={{ filter: useFilter ? `url(#${filterId})` : undefined }}
            >
                {Array.from({ length: trailCount }).map((_, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            blobsRef.current[i] = el
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 transform will-change-transform"
                        style={{
                            width: sizes[i],
                            height: sizes[i],
                            borderRadius: blobType === "circle" ? "50%" : "0",
                            backgroundColor: fillColor,
                            opacity: opacities[i],
                            boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`,
                        }}
                    >
                        <div
                            className="absolute"
                            style={{
                                width: innerSizes[i],
                                height: innerSizes[i],
                                top: (sizes[i] - innerSizes[i]) / 2,
                                left: (sizes[i] - innerSizes[i]) / 2,
                                backgroundColor: innerColor,
                                borderRadius: blobType === "circle" ? "50%" : "0",
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
