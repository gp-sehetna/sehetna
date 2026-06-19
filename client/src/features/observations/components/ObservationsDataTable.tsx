"use client"
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
import { TooltipProvider } from "@/components/ui/shadcn/tooltip"
import useObservationTable from "@/hooks/useObservationTable"
import { RotateCcw } from "lucide-react"
import Image from "next/image"
import ObservationDetailsDialog from "./ObservationDetailsDialog"
import ObservationsTableContent from "./ObservationTableContent"

const pageSizes = [10, 25, 50, 100]

const ObservationsDataTable = () => {
    const {
        table,
        start,
        end,
        pages,
        page,
        setPage,
        pageSize,
        setPageSize,
        total,
        totalPages,
        selectedObservation,
        setSelectedObservation,
        observationToDelete,
        setObservationToDelete,
        columns,
        deleteMutation,
        exportMutation,
        observationsQuery,
    } = useObservationTable()

    return (
        <TooltipProvider>
            <div className="bg-background rounded-2xl border">
                <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-lg font-semibold">Scenario Observations</p>
                        <p className="text-muted-foreground text-sm">
                            Scenario records with climate, air quality, socioeconomic, and health
                            signals.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Button
                            variant="outline"
                            onClick={() => exportMutation.mutate()}
                            disabled={
                                exportMutation.isPending ||
                                observationsQuery.isLoading ||
                                observationsQuery.isError
                            }
                        >
                            <Image src="/icons/excel-csv.svg" width={16} height={16} alt="csv" />
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
                    <ObservationsTableContent table={table} observationsQuery={observationsQuery} columns={columns} setSelectedObservation={setSelectedObservation} />
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

            <ObservationDetailsDialog
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
                                observationToDelete && deleteMutation.mutate(String(observationToDelete._id))
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

export default ObservationsDataTable
