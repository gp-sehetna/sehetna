import { DatePickerSimple } from "@/components/ui/GlobalControls/DatePickerSimple"
import DateRangeSlider from "@/components/ui/map/view/DateFilterSlider"
import { useDateUrlSync } from "@/hooks/map/use-date"
import { ActiveSlug } from "@/shared/config/map"
import { useMapStore } from "@/stores/map/use-map"
import { MapDashboard, MapDashboardProps } from "./view/MapDashboard"

export type MapSidebarProps = ActiveSlug & MapDashboardProps & {}

const MapSidebar = ({ slug, closeSidebar, onSubmitForm, onLayerSelect }: MapSidebarProps) => {
    const clickedZone = useMapStore((s) => s.clickedZone)
    const { date, setDate } = useDateUrlSync(slug)

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
                <DatePickerSimple date={date} setDate={setDate} />
                <DateRangeSlider start={new Date("2015-01-05")} end={new Date()} />
            </div>
        </>
    )
}

export default MapSidebar
