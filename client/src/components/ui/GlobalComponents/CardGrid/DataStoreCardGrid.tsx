"use client"

import { Badge } from "@/components/ui/shadcn/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn/card"
import { Skeleton } from "@/components/ui/shadcn/skeleton"
import { DataStoreClientService } from "@/features/datastores/datastore.service.client"
import { toProperCase } from "@/lib/utils"
import { useMemo } from "react"

import { useQuery } from "@tanstack/react-query"
import { formatDate } from "@/lib/utils/date"

const skeletonCards = Array.from({ length: 6 })

const getStatusVariant = (status?: string): "default" | "secondary" | "outline" => {
    // use switch case
    switch (status) {
        case "pending":
            return "default"
        case "approved":
            return "secondary"
        case "rejected":
            return "outline"
        default:
            return "default"
    }
}
const DataStoreCardGrid = () => {
    const dataStoreService = useMemo(() => new DataStoreClientService(), [])

    const {
        data: dataStores = [],
        isPending,
        error,
    } = useQuery({
        queryKey: ["datastores"],
        queryFn: async () => {
            const { data } = await dataStoreService.useDataStores()
            return data
        },
    })

    const errorMessage =
        error instanceof Error
            ? error.message
            : error
              ? "Unable to load datastore records right now."
              : null

    return (
        <>
            {/* ERROR */}
            {errorMessage && (
                <Card className="border-destructive/40">
                    <CardHeader>
                        <CardTitle>Unable to load data</CardTitle>
                        <CardDescription>{errorMessage}</CardDescription>
                    </CardHeader>
                </Card>
            )}

            {/* LOADING */}
            {!errorMessage && isPending && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {skeletonCards.map((_, index) => (
                        <Card key={`skeleton-card-${index}`}>
                            <CardHeader className="space-y-3">
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-4 w-full" />
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* EMPTY */}
            {!errorMessage && !isPending && dataStores.length === 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>No datastores found</CardTitle>
                        <CardDescription>
                            No records are currently available from the datastore API.
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}

            {/* DATA */}
            {!errorMessage && !isPending && dataStores.length > 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {dataStores.map((store, index) => {
                        const alias =
                            store.alias_name ||
                            `${store.source ?? "unknown"}-${store.version ?? "1.0"}`

                        const dateStart = formatDate(store.date_range?.start)
                        const dateEnd = formatDate(store.date_range?.end)

                        return (
                            <Card
                                key={`${alias}-${index}`}
                                className="transition-shadow hover:shadow-md"
                            >
                                <CardHeader className="gap-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <CardTitle className="text-lg">{alias}</CardTitle>

                                        <Badge variant={getStatusVariant(store.status)}>
                                            {toProperCase(store.status)}
                                        </Badge>
                                    </div>

                                    <CardDescription className="text-justify whitespace-pre-line">
                                        {store.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-2 text-sm">
                                    <p>
                                        <span className="text-muted-foreground">Source:</span>{" "}
                                        {toProperCase(store.source)}
                                    </p>

                                    <p>
                                        <span className="text-muted-foreground">Version:</span>{" "}
                                        {store.version}
                                    </p>

                                    <p>
                                        <span className="text-muted-foreground">Granularity:</span>{" "}
                                        {toProperCase(store.granularity)}
                                    </p>

                                    <p>
                                        <span className="text-muted-foreground">
                                            Geographic Level:
                                        </span>{" "}
                                        {toProperCase(store.geographic_level)}
                                    </p>

                                    <p>
                                        <span className="text-muted-foreground">Variables:</span>{" "}
                                        {store.variables.length}
                                    </p>

                                    <p>
                                        <span className="text-muted-foreground">Date Range:</span>{" "}
                                        {dateStart} to {dateEnd}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </>
    )
}

export default DataStoreCardGrid
