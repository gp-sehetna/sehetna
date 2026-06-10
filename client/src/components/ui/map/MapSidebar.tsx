import { DatePickerSimple } from "@/components/ui/GlobalControls/DatePickerSimple"
import DateRangeSlider from "@/components/ui/map/view/DateFilterSlider"
import { useDateUrlSync } from "@/hooks/map/use-date"
import { ActiveSlug } from "@/shared/config/map"
import { useMapStore } from "@/stores/map/use-map"
import { MapDashboard, MapDashboardProps } from "./view/MapDashboard"
import { usePredictionsStore } from "@/stores/map/use-predictions"

export type MapSidebarProps = ActiveSlug & MapDashboardProps & {}

const MapSidebar = ({ slug, closeSidebar, onSubmitForm, onLayerSelect }: MapSidebarProps) => {
    const clickedZone = useMapStore((s) => s.clickedZone)
    const { date, setDate } = useDateUrlSync(slug)
    const isModifying = usePredictionsStore((s) => s.modifying)
    return (
        <>
            {clickedZone && (
                <MapDashboard
                    zoneProperties={clickedZone.properties}
                    closeSidebar={closeSidebar}
                    onLayerSelect={onLayerSelect}
                    onSubmitForm={onSubmitForm}
                />
            )}

            <div className="glassy flex min-w-full shrink-0 flex-col rounded-2xl border p-4">
                <DatePickerSimple disabled={isModifying} date={date} setDate={setDate} />
                <DateRangeSlider />
            </div>
        </>
    )
}

export default MapSidebar
