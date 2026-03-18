import { LocationClientService } from "@/features/locations/location.service.client"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

const useLocation = () => {
    const locationService = useMemo(() => new LocationClientService(), [])

    const {
        data: locations = [],
        isPending,
        error,
    } = useQuery({
        queryKey: ["locations"],
        queryFn: async () => {
            const { data } = await locationService.useLocationData()
            return data
        },
    })
    return { locations, isPending, error }
}

export default useLocation
