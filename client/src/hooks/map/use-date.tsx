import { Slug } from "@/shared/config/map"
import { useMapStore } from "@/stores/map/use-map"
import { format, startOfWeek, subDays } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect } from "react"

export const useDateUrlSync = (activeSlug: Slug) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const { date, setDate } = useMapStore()

    useEffect(() => {
        const value = searchParams.get("date")
        setDate(value ? new Date(value) : subDays(startOfWeek(new Date()), 1))
    }, [searchParams, setDate])

    const updateDate = useCallback(
        (newDate?: Date) => {
            const params = new URLSearchParams(searchParams.toString())

            if (!newDate) params.delete("date")
            else params.set("date", format(newDate, "yyyy-MM-dd"))

            const basePath = activeSlug.country
                ? `/map/${activeSlug.country}/${activeSlug.healthOutcome}`
                : `/map/${activeSlug.healthOutcome}`

            router.push(`${basePath}?${params.toString()}`, {
                scroll: false,
            })

            setDate(newDate)
        },
        [searchParams, router, activeSlug, setDate]
    )

    return {
        date,
        setDate: updateDate,
    }
}
