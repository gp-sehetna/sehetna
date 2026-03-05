"use client"

import { useRef } from "react"
import Gradient from "../GlobalComponents/extras/gradient"
import Image from "next/image"
import { useParallax } from "@/hooks/use-parallax"

function MainHeroSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLDivElement>(null)

    useParallax(containerRef, imageRef, {
        speed: -40,
        scale: 1.1,
    })
    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
            <div ref={imageRef} className="absolute inset-0 border">
                <Image
                    src="/images/gis-island.jpg"
                    alt="Climate Change"
                    fill
                    priority
                    className="object-cover"
                />
                <Gradient />
            </div>
        </section>
    )
}

export default MainHeroSection
