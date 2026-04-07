import HealthOutcomeCharts from "@/components/ui/map/MapSidebarContent"
import MapModifyInputs from "@/components/ui/map/simulation/MapModifyInputs"
import { LiveContent } from "@/components/ui/map/view/LiveContent"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs"
import { IEnvironmentData } from "@/features/environment/week/week.dto"
import { GeoJsonProperties } from "@/shared/config/map"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { ArrowLeft, Info } from "lucide-react"
import { Dispatch } from "react"
import { InterpreterMessageBanner } from "../simulation/InterpreterMessageBanner"

export type MapDashboardProps = {
    onLayerSelect: Dispatch<string>
    onSubmitForm: (data: IEnvironmentData) => void
    closeSidebar: () => void
}

export const MapDashboard = ({
    zoneProperties,
    closeSidebar,
    onSubmitForm,
    onLayerSelect,
}: MapDashboardProps & {
    zoneProperties: GeoJsonProperties
}) => {
    const isModifying = usePredictionsStore((s) => s.modifying)
    
    
    
    return (
        <Card className="glassy flex h-full min-w-full flex-col overflow-hidden rounded-2xl border bg-neutral-100/40">
            <CardHeader className="flex flex-row items-center gap-2 border-b p-4">
                <ArrowLeft className="cursor-pointer" onClick={closeSidebar} />
                <CardTitle>
                    <h5>{zoneProperties.name}</h5>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex h-screen flex-col gap-4 overflow-y-auto p-4">
                <Tabs className="flex flex-1 flex-col" defaultValue="live">
                    <TabsList className="glassy grid w-full grid-cols-2 bg-transparent">
                        <TabsTrigger value="live">Near Live Data</TabsTrigger>
                        <TabsTrigger value="simulation">Simulation</TabsTrigger>
                    </TabsList>
                    <TabsContent className="flex-1" value="simulation">
                        {!isModifying  ? (
                            <HealthOutcomeCharts  />
                        ) : (
                            <MapModifyInputs onSubmitForm={onSubmitForm} />
                        )}
                    </TabsContent>
                    <TabsContent className="flex-1" value="live">
                        <LiveContent
                            onLayerSelect={onLayerSelect}
                            zoneProperties={zoneProperties}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
