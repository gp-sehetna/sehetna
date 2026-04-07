import MainHeroSection from "@/components/ui/heros/MainHeroSection"
import { CTAGroundSection } from "@/components/ui/sections/CTAGroundSection"
import { DashboardSection } from "@/components/ui/sections/DashboardSection"
import { InteractiveScenarioSimulationSection } from "@/components/ui/sections/InteractiveSimulationSection"
import { ProblemContext } from "@/components/ui/sections/ProblemContext"

export default function Home() {
    return (
        <>
            <MainHeroSection />
            <ProblemContext />
            <InteractiveScenarioSimulationSection />
            <DashboardSection />
            <CTAGroundSection />
        </>
    )
}
