"use client"
import { createObservationColumns } from "@/features/observations/components/ObservationColumns"
import { downloadCsv, isScenarioSortBy, observationsToCsv } from "@/features/observations/Observation.helpers"
import { scenarioClientService } from "@/features/observations/Observation.service.client"
import type {
    ObservationQueryParams,
    ScenarioObservation,
    ScenarioObservationSortBy,
} from "@/features/observations/Observation.types"
import { useUserStore } from "@/stores/user/use-user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getCoreRowModel, type SortingState, useReactTable } from "@tanstack/react-table"
import { format } from "date-fns"
import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"

const useObservationTable = () => {
    const queryClient = useQueryClient()
    const user = useUserStore((state) => state.user)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sorting, setSorting] = useState<SortingState>([{ id: "baseDate", desc: true }])
    const [selectedObservation, setSelectedObservation] = useState<ScenarioObservation | null>(null)
    const [observationToDelete, setObservationToDelete] = useState<ScenarioObservation | null>(null)

    const sortId = sorting[0]?.id ?? ""
    const sortBy: ScenarioObservationSortBy = isScenarioSortBy(sortId) ? sortId : "baseDate"
    const sortDirection = sorting[0]?.desc === false ? "asc" : "desc"
    const queryParams: ObservationQueryParams = {
        page,
        pageSize,
        sortBy,
        sortDirection,
    }

    const observationsQuery = useQuery({
        queryKey: ["scenario-observations", queryParams],
        queryFn: () => scenarioClientService.listObservations(queryParams),
    })

    const canDelete = useCallback(() => true, [])

    const deleteMutation = useMutation({
        mutationFn: (id: string) => scenarioClientService.deleteObservation(id),
        onSuccess: async () => {
            toast.success("Scenario observation deleted")
            setObservationToDelete(null)
            await queryClient.invalidateQueries({ queryKey: ["scenario-observations"] })
        },
        onError: () => toast.error("Unable to delete scenario observation"),
    })

    const exportMutation = useMutation({
        mutationFn: async () => {
            const result = await scenarioClientService.listObservations(queryParams)

            return observationsToCsv(result.data)
        },
        onSuccess: (csv) => {
            const userId = user?._id ? String(user._id) : "anonymous"
            const filename = `scenario-observations-${userId}-${format(new Date(), "yyyy-MM-dd")}.csv`

            downloadCsv(csv, filename)
            toast.success("Scenario observations exported")
        },
        onError: () => toast.error("Unable to export scenario observations"),
    })

    const columns = useMemo(
        () =>
            createObservationColumns({
                canDelete,
                onAddNote: () =>
                    toast.info("Notes are ready for the API and will be editable soon."),
                onDelete: setObservationToDelete,
                onViewDetails: setSelectedObservation,
            }),
        [canDelete]
    )

    const table = useReactTable({
        columns,
        data: observationsQuery.data?.data ?? [],
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        onSortingChange: (updater) => {
            setPage(1)
            setSorting((current) => (typeof updater === "function" ? updater(current) : updater))
        },
        pageCount: observationsQuery.data?.totalPages ?? -1,
        initialState: {
            columnPinning: {
                right: ["healthOutcomes", "actions"],
            },
        },
        state: { sorting },
    })
    const total = observationsQuery.data?.total ?? 0
    const totalPages = observationsQuery.data?.totalPages ?? 1
    const start = total === 0 ? 0 : (page - 1) * pageSize + 1
    const end = Math.min(page * pageSize, total)
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
        (value) => value === 1 || value === totalPages || Math.abs(value - page) <= 1
    )
    return {
        table,
        start,
        end,
        pages,
        page,
        setPage,
        pageSize,
        observationsQuery,
        columns,
        setPageSize,
        total,
        totalPages,
        selectedObservation,
        setSelectedObservation,
        observationToDelete,
        setObservationToDelete,
        deleteMutation,
        exportMutation,
    }
}

export default useObservationTable
