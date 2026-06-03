"use client"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/shadcn/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/shadcn/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/shadcn/select"
import { Skeleton } from "@/components/ui/shadcn/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/shadcn/table"
import { TooltipProvider } from "@/components/ui/shadcn/tooltip"
import {
    formatCurrency,
    formatInteger,
    formatNumber,
    formatScenarioDate,
    getAqiSeverity,
    getFloodSeverity,
    missingValue,
    SeverityBadge,
} from "@/features/scenarios/scenario.formatters"
import { scenarioClientService } from "@/features/scenarios/scenario.service.client"
import type {
    ScenarioObservation,
    ScenarioObservationQueryParams,
    ScenarioObservationSortBy,
} from "@/features/scenarios/scenario.types"
import { createScenarioColumns } from "@/features/scenarios/components/scenarioColumns"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/stores/user/use-user"
import { HEALTH_OUTCOMES_KEYS } from "@/shared/config/health-outcomes"
import { RoleEnum } from "@/shared/db/enums/auth.enum"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    type Column,
    flexRender,
    getCoreRowModel,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowDown, ArrowUp, Download, RotateCcw } from "lucide-react"
import Link from "next/link"
import type { CSSProperties } from "react"
import type { ReactNode } from "react"
import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"

const pageSizes = [10, 25, 50, 100]

const isScenarioSortBy = (id: string): id is ScenarioObservationSortBy =>
    [
        "baseDate",
        "locationName",
        "temperatureCelsius",
        "precipitationMm",
        "heatWaveDays",
        "floodIndicator",
        "pm25Ugm3",
        "aqi",
        "healthcareAccessIndex",
        "foodSecurityIndex",
        "gdpPerCapitaUsd",
    ].includes(id)

const downloadCsv = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")

    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
}

const getPinnedColumnStyles = (column: Column<ScenarioObservation>): CSSProperties => {
    const isPinned = column.getIsPinned()

    if (!isPinned) return {}
    return {
        left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
        right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
        position: "sticky",
        width: column.getSize(),
        zIndex: 20,
    }
}

const getPinnedColumnClassName = (column: Column<ScenarioObservation>) =>
    cn(
        column.getIsPinned() && "bg-background",
        column.getIsPinned() === "left" && column.getIsLastColumn("left") && "border-r",
        column.getIsPinned() === "right" && column.getIsFirstColumn("right") && "border-l"
    )

const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="flex items-center justify-between gap-4 border-b py-2 text-sm last:border-b-0">
        <dt className="text-muted-foreground">{label}</dt>
        <dd className="text-right font-medium">{value}</dd>
    </div>
)

const DetailSection = ({ children, title }: { children: ReactNode; title: string }) => (
    <section>
        <h3 className="mb-2 text-sm font-semibold">{title}</h3>
        <dl className="rounded-lg border px-3">{children}</dl>
    </section>
)

const ScenarioDetailsDialog = ({
    observation,
    onOpenChange,
}: {
    observation: ScenarioObservation | null
    onOpenChange: (open: boolean) => void
}) => (
    <Dialog open={!!observation} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Observation Details</DialogTitle>
                <DialogDescription>
                    {observation
                        ? `${observation.locationName} on ${formatScenarioDate(observation.baseDate)}`
                        : "Scenario observation details"}
                </DialogDescription>
            </DialogHeader>
            {observation && (
                <div className="grid gap-4 md:grid-cols-2">
                    <DetailSection title="General">
                        <DetailRow label="Date" value={formatScenarioDate(observation.baseDate)} />
                        <DetailRow
                            label="Location"
                            value={observation.locationName || missingValue("Unknown")}
                        />
                    </DetailSection>
                    <DetailSection title="Climate">
                        <DetailRow
                            label="Temperature"
                            value={
                                formatNumber(observation.climate.temperatureCelsius, "°C") ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="Precipitation"
                            value={
                                formatNumber(observation.climate.precipitationMm, "mm") ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="Heat Wave Days"
                            value={
                                formatInteger(observation.climate.heatWaveDays, "days") ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="Flood Indicator"
                            value={
                                <SeverityBadge
                                    severity={getFloodSeverity(observation.climate.floodIndicator)}
                                />
                            }
                        />
                    </DetailSection>
                    <DetailSection title="Air Quality">
                        <DetailRow
                            label="PM2.5"
                            value={
                                formatNumber(observation.airQuality.pm25Ugm3, "µg/m³") ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="AQI"
                            value={
                                <SeverityBadge
                                    severity={getAqiSeverity(observation.airQuality.aqi)}
                                />
                            }
                        />
                    </DetailSection>
                    <DetailSection title="Socioeconomic">
                        <DetailRow
                            label="Healthcare Access Index"
                            value={
                                formatNumber(observation.socioeconomic.healthcareAccessIndex) ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="Food Security Index"
                            value={
                                formatNumber(observation.socioeconomic.foodSecurityIndex) ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="GDP Per Capita"
                            value={
                                formatCurrency(observation.socioeconomic.gdpPerCapitaUsd) ??
                                missingValue()
                            }
                        />
                    </DetailSection>
                    <DetailSection title="Health Outcomes">
                        {HEALTH_OUTCOMES_KEYS.map((key) => (
                            <DetailRow
                                key={key}
                                label={key.replaceAll("_", " ")}
                                value={
                                    formatNumber(observation.healthOutcomes[key]) ?? missingValue()
                                }
                            />
                        ))}
                    </DetailSection>
                    <DetailSection title="Notes">
                        <DetailRow
                            label="Current Note"
                            value={observation.note || missingValue()}
                        />
                    </DetailSection>
                </div>
            )}
        </DialogContent>
    </Dialog>
)

const ScenariosDataTable = () => {
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
    const queryParams: ScenarioObservationQueryParams = {
        page,
        pageSize,
        sortBy,
        sortDirection,
    }

    const observationsQuery = useQuery({
        queryKey: ["scenario-observations", queryParams],
        queryFn: () => scenarioClientService.listObservations(queryParams),
    })

    const canDelete = useCallback(() => user?.role === RoleEnum.admin, [user?.role])

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
        mutationFn: () => scenarioClientService.exportObservations(queryParams),
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
            createScenarioColumns({
                canDelete,
                onAddNote: () =>
                    toast.info("Notes are ready for the API and will be editable soon."),
                onDelete: setObservationToDelete,
                onViewDetails: setSelectedObservation,
            }),
        [canDelete]
    )

    // TanStack Table intentionally returns function-bearing instances; this is the library's standard hook API.
    // eslint-disable-next-line react-hooks/incompatible-library
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

    return (
        <TooltipProvider>
            <div className="bg-background rounded-2xl border">
                <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-lg font-semibold">Scenario Observations</p>
                        <p className="text-muted-foreground text-sm">
                            Paginated scenario records with climate, air quality, socioeconomic, and
                            health signals.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        {/* <div className="text-muted-foreground flex min-h-9 items-center rounded-lg border border-dashed px-3 text-sm">
                            Filters: date range, location, thresholds
                        </div> */}
                        <Button
                            variant="bright"
                            onClick={() => exportMutation.mutate()}
                            disabled={
                                exportMutation.isPending ||
                                observationsQuery.isLoading ||
                                observationsQuery.isError
                            }
                        >
                            <Download className="size-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {observationsQuery.isError ? (
                    <div className="flex min-h-56 flex-col items-center justify-center gap-4 border-t text-center">
                        <p className="text-muted-foreground font-medium">
                            Unable to load observations.
                        </p>
                        <Button variant="outline" onClick={() => observationsQuery.refetch()}>
                            <RotateCcw className="size-4" />
                            Retry
                        </Button>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        const sorted = header.column.getIsSorted()

                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={cn(
                                                    "bg-muted! whitespace-nowrap",
                                                    getPinnedColumnClassName(header.column)
                                                )}
                                                style={getPinnedColumnStyles(header.column)}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="-ml-3 max-w-48"
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {sorted === "asc" && <ArrowUp />}
                                                        {sorted === "desc" && <ArrowDown />}
                                                    </Button>
                                                )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {observationsQuery.isLoading
                                ? Array.from({ length: 6 }, (_, rowIndex) => (
                                      <TableRow className="hover:bg-transparent" key={rowIndex}>
                                          <TableCell colSpan={3}>
                                              <Skeleton className="h-4" />
                                          </TableCell>
                                          <TableCell colSpan={columns.length - 4}>
                                              <Skeleton className="h-4" />
                                          </TableCell>
                                          <TableCell>
                                              <Skeleton className="size-6 rounded-lg" />
                                          </TableCell>
                                      </TableRow>
                                  ))
                                : table.getRowModel().rows.map((row) => (
                                      <TableRow
                                          key={row.id}
                                          className="cursor-pointer"
                                          tabIndex={0}
                                          onClick={() => setSelectedObservation(row.original)}
                                          onKeyDown={(event) => {
                                              if (event.key === "Enter")
                                                  setSelectedObservation(row.original)
                                          }}
                                      >
                                          {row.getVisibleCells().map((cell) => (
                                              <TableCell
                                                  key={cell.id}
                                                  className={cn(
                                                      "whitespace-nowrap",
                                                      getPinnedColumnClassName(cell.column)
                                                  )}
                                                  style={getPinnedColumnStyles(cell.column)}
                                              >
                                                  {flexRender(
                                                      cell.column.columnDef.cell,
                                                      cell.getContext()
                                                  )}
                                              </TableCell>
                                          ))}
                                      </TableRow>
                                  ))}
                            {!observationsQuery.isLoading &&
                                table.getRowModel().rows.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={columns.length}>
                                            <div className="flex min-h-40 flex-col items-center justify-center gap-4 text-center">
                                                <p className="text-muted-foreground max-w-64 font-medium">
                                                    No observations found. Go to Live Map page to
                                                    create one.
                                                </p>
                                                <Button asChild variant="black">
                                                    <Link href="/map">
                                                        Live Map
                                                        <ArrowUpRight />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                        </TableBody>
                    </Table>
                )}

                <div className="flex flex-col gap-3 p-4 text-sm md:flex-row md:items-center md:justify-between">
                    <div className="text-muted-foreground">
                        Page {page} of {totalPages}. Showing {start}-{end} of {total}.
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select
                            value={String(pageSize)}
                            onValueChange={(value) => {
                                setPage(1)
                                setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger variant="outline" className="w-28">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {pageSizes.map((size) => (
                                    <SelectItem key={size} value={String(size)}>
                                        {size} rows
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage((current) => Math.max(current - 1, 1))}
                        >
                            Prev
                        </Button>
                        {pages.map((pageNumber, index) => (
                            <div key={pageNumber} className="flex items-center gap-2">
                                {index > 0 && pageNumber - pages[index - 1] > 1 && (
                                    <span className="text-muted-foreground">...</span>
                                )}
                                <Button
                                    variant={pageNumber === page ? "bright" : "tonal"}
                                    size="sm"
                                    onClick={() => setPage(pageNumber)}
                                >
                                    {pageNumber}
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            <ScenarioDetailsDialog
                observation={selectedObservation}
                onOpenChange={(open) => !open && setSelectedObservation(null)}
            />

            <Dialog
                open={!!observationToDelete}
                onOpenChange={(open) => !open && setObservationToDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete observation?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the current observation with its
                            prediction values?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="tonal" onClick={() => setObservationToDelete(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={!observationToDelete || deleteMutation.isPending}
                            onClick={() =>
                                observationToDelete && deleteMutation.mutate(observationToDelete.id)
                            }
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    )
}

export default ScenariosDataTable
