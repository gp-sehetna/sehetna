import ComingSoon from "@/components/ui/ComingSoon"
import MainHeroSection from "@/components/ui/heros/MainHeroSection"

export default function Home() {
    return (
        <>
            <MainHeroSection />
            <section>
                <ComingSoon
                    title="Home"
                    description="A healthcare and data exploration platform by From Masr, built to provide insights, mapping tools, and transparent methodologies."
                />
            </section>
        </>
    )
}
