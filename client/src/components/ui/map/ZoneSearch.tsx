"use client"

import { Button } from "@/components/ui/shadcn/button"
import { slugify } from "@/lib/utils"
import {
    COUNTRIES_SOURCE,
    GeoJsonProperties,
    MapPageProps,
    parseSlug,
    zoomToCountry,
} from "@/shared/config/map"
import { useMapStore } from "@/stores/map/use-map"
import centroid from "@turf/centroid"
import { GeoJSONFeature } from "maplibre-gl"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import CountryFlag from "@/hooks/map/CountryFlag"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "../shadcn/combobox"

type ZoneFeature = GeoJSONFeature & {
    properties: GeoJsonProperties
}

const PAGE_SIZE = 8

// TODO: Fix problem with all zones not showing after country selection (only a portion of it)
function ZoneSearch() {
    const router = useRouter()
    const params = useParams<MapPageProps["params"]>()
    const searchParams = useSearchParams()

    const map = useMapStore((s) => s.map)
    const setClickedZone = useMapStore((s) => s.setClickedZone)
    const setHoveredZone = useMapStore((s) => s.setHoveredZone)
    const setHoveredCoords = useMapStore((s) => s.setHoveredCoords)
    const setMarkerCoords = useMapStore((s) => s.setMarkerCoords)

    const [query, setQuery] = useState("")
    const [requestedPage, setRequestedPage] = useState(0)

    const activeSlug = parseSlug(params.slug)

    const zones = useMemo(() => {
        if (!map) return []

        const uniqueZones = new Map<string, ZoneFeature>()

        for (const feature of map.querySourceFeatures(COUNTRIES_SOURCE) as ZoneFeature[]) {
            const isoA3 = feature.properties?.isoA3
            const name = feature.properties?.name

            if (!isoA3 || !name || uniqueZones.has(isoA3)) continue
            uniqueZones.set(isoA3, feature)
        }

        return [...uniqueZones.values()].sort((a, b) =>
            a.properties.name.localeCompare(b.properties.name)
        )
    }, [map])

    const filteredZones = useMemo(() => {
        console.log(query)
        const normalizedQuery = query.trim().toLowerCase()

        if (!normalizedQuery) return zones

        return zones.filter((zone) => zone.properties.name.toLowerCase().includes(normalizedQuery))
    }, [query, zones])

    const pageCount = Math.max(1, Math.ceil(filteredZones.length / PAGE_SIZE))
    const page = Math.min(requestedPage, pageCount - 1)
    const paginatedZones = useMemo(() => {
        const start = page * PAGE_SIZE
        return filteredZones.slice(start, start + PAGE_SIZE)
    }, [filteredZones, page])

    const onCountrySelect = (zone: ZoneFeature | null) => {
        if (!zone || !map) return

        const center = centroid(zone).geometry.coordinates as [number, number]
        const params = searchParams.toString()
        const path = `/map/${slugify(zone.properties.name)}/${activeSlug.healthOutcome}`

        setClickedZone(zone)
        setHoveredZone(null)
        setHoveredCoords(null)
        setMarkerCoords({ lng: center[0], lat: center[1] })
        zoomToCountry(zone, map, center)

        setQuery("")
        setRequestedPage(0)
        router.push(params ? `${path}?${params}` : path, { scroll: false })
    }

    return (
        <Combobox<ZoneFeature>
            items={zones}
            filteredItems={paginatedZones}
            inputValue={query}
            onInputValueChange={(value) => {
                setQuery(value)
                setRequestedPage(0)
            }}
            onValueChange={onCountrySelect}
            itemToStringLabel={(zone) => zone.properties.name}
            itemToStringValue={(zone) => zone.properties.isoA3}
        >
            <div className="glassy rounded-3xl p-2">
                <ComboboxInput
                    placeholder="Search for a country/zone"
                    showClear
                    className="w-full"
                />
            </div>
            <ComboboxContent className="w-full">
                <ComboboxEmpty>No countries found.</ComboboxEmpty>
                <ComboboxList>
                    {(zone: ZoneFeature) => (
                        <ComboboxItem
                            className="glassy gap-4 p-2"
                            key={zone.properties.isoA3}
                            value={zone}
                        >
                            <CountryFlag iso={zone.properties.isoA2} />
                            <span>{zone.properties.name}</span>
                        </ComboboxItem>
                    )}
                </ComboboxList>
                {filteredZones.length > PAGE_SIZE && (
                    <div className="border-border flex items-center justify-between border-t px-2 py-1.5">
                        <small className="text-muted-foreground">
                            Page {page + 1} of {pageCount}
                        </small>
                        <div className="flex items-center gap-1">
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                    setRequestedPage((currentPage) => Math.max(currentPage - 1, 0))
                                }
                                disabled={page === 0}
                            >
                                <ChevronLeftIcon />
                                Prev
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                    setRequestedPage((currentPage) =>
                                        Math.min(currentPage + 1, pageCount - 1)
                                    )
                                }
                                disabled={page >= pageCount - 1}
                            >
                                Next
                                <ChevronRightIcon />
                            </Button>
                        </div>
                    </div>
                )}
            </ComboboxContent>
        </Combobox>
    )
}

export default ZoneSearch
