import { DatePickerSimple } from "@/components/ui/GlobalControls/DatePickerSimple"
import { ArrowLeft } from "lucide-react"

import AppLoader from "@/components/ui/GlobalComponents/Loaders/AppLoader"
import HealthOutcomeCharts from "@/components/ui/map/MapSidebarContent"
import { DateRangeSlider } from "@/components/ui/map/view/DateFilterSlider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs"
import { IEnvironmentData } from "@/features/environment/week/week.dto"
import { useDateUrlSync } from "@/hooks/map/use-date"
import { useForecasts } from "@/hooks/map/use-forecasts"
import { ActiveSlug } from "@/shared/config/map"
import { useMapStore } from "@/stores/map/use-map"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { Dispatch } from "react"
import MapModifyInputs from "./simulation/MapModifyInputs"
import { ForecastDashboard } from "./view/ForecastDashboard"

export type MapSidebarProps = ActiveSlug & {
    onLayerSelect: Dispatch<string>
    onSubmitForm: (data: IEnvironmentData) => void
    closeSidebar: () => void
}

const MapSidebar = ({ slug, closeSidebar, onSubmitForm, onLayerSelect }: MapSidebarProps) => {
    const isModifying = usePredictionsStore((s) => s.modifying)
    const modelId = usePredictionsStore((s) => s.forecaster)
    const { data: forecasts, isLoading: isForecastsLoading } = useForecasts({ modelId })
    const clickedZone = useMapStore((s) => s.clickedZone)
    const { date, setDate } = useDateUrlSync(slug)

    return (
        <>
            {clickedZone && (
                <Card className="glassy flex h-full min-w-full flex-col overflow-hidden rounded-2xl border bg-neutral-100/40">
                    <CardHeader className="flex flex-row items-center gap-2 border-b p-4">
                        <ArrowLeft className="cursor-pointer" onClick={closeSidebar} />
                        <CardTitle>
                            <h5>{clickedZone.properties.name}</h5>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex h-screen flex-col gap-4 overflow-y-auto p-4">
                        <Tabs defaultValue="live">
                            <TabsList className="glassy grid w-full grid-cols-2 bg-transparent">
                                <TabsTrigger value="live">Live Data</TabsTrigger>
                                <TabsTrigger value="simulation">Simulation</TabsTrigger>
                            </TabsList>
                            <TabsContent className="h-full" value="simulation">
                                {!isModifying ? (
                                    <HealthOutcomeCharts />
                                ) : (
                                    <MapModifyInputs onSubmitForm={onSubmitForm} />
                                )}
                            </TabsContent>
                            <TabsContent value="live">
                                {forecasts ? (
                                    <ForecastDashboard
                                        onCardClick={onLayerSelect}
                                        forecasts={forecasts}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        {isForecastsLoading ? <AppLoader /> : <p>No data</p>}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            )}

            <div className="glassy flex min-w-full shrink-0 flex-col rounded-2xl border p-4">
                <DatePickerSimple date={date} setDate={setDate} />
                <DateRangeSlider />
            </div>
        </>
    )
}

export default MapSidebar
