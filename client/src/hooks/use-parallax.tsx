"use client"

import { RefObject } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

interface ParallaxOptions {
    speed?: number // how much movement
    start?: string
    end?: string
    scrub?: boolean | number
    scale?: number
}

export function useParallax(
    containerRef: RefObject<HTMLElement | null>,
    targetRef: RefObject<HTMLElement | null>,
    {
        speed = 30,
        start = "top bottom",
        end = "bottom top",
        scrub = true,
        scale,
    }: ParallaxOptions = {}
) {
    useGSAP(
        () => {
            if (!containerRef?.current || !targetRef?.current) return

            gsap.fromTo(
                targetRef.current,
                {
                    yPercent: speed,
                },
                {
                    yPercent: -speed,
                    scale,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start,
                        end,
                        scrub,
                    },
                }
            )
        },
        { scope: containerRef ?? undefined }
    )
}
