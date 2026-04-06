"use client"

import { Badge } from "@/components/ui/shadcn/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn/card"
import { Skeleton } from "@/components/ui/shadcn/skeleton"
import { DataStoreClientService } from "@/features/datastores/datastore.service.client"
import { toProperCase } from "@/lib/utils"
import { useMemo } from "react"
import { ScrollArea } from "@/components/ui/shadcn/scroll-area"

import { useQuery } from "@tanstack/react-query"
import { formatDate } from "@/lib/utils/date"
import { Layers, Globe, Database, Calendar } from "lucide-react"
import { StatusEnum } from "@/shared/db/enums/data-store.enum"

const skeletonCards = Array.from({ length: 6 })

const getStatusVariant = (status?: StatusEnum) => {
    // use switch case
    if (!status) return "default"

    switch (status) {
        case "active":
            return "glassy"
        case "archived":
            return "secondary"
        case "pending":
            return "glassy"
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
                                className="group bg-background/60 relative overflow-hidden border shadow-none backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* Top Accent */}
                                <div className="bg-info-100 absolute inset-x-0 top-0 h-1 bg-linear-to-r opacity-80" />

                                <CardHeader className="space-y-3 pb-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <CardTitle className="text-xl font-semibold tracking-tight">
                                                {alias}
                                            </CardTitle>
                                            <p className="text-muted-foreground text-xs">
                                                {toProperCase(store.source)} • v{store.version}
                                            </p>
                                        </div>

                                        <Badge
                                            variant={getStatusVariant(store.status)}
                                            className="px-3 py-1 text-xs capitalize"
                                        >
                                            {toProperCase(store.status)}
                                        </Badge>
                                    </div>

                                    <CardDescription className="text-muted-foreground line-clamp-4 text-sm leading-relaxed">
                                        {store.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4 text-sm">
                                    {/* Metadata Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Granularity */}
                                        <div className="bg-muted/20 flex items-center gap-4 rounded-md p-2">
                                            <Layers className="text-primary h-4 w-4" />
                                            <div>
                                                <p className="text-muted-foreground text-xs uppercase">
                                                    Granularity
                                                </p>
                                                <p className="text-xs font-medium">
                                                    {toProperCase(store.granularity)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Geographic */}
                                        <div className="bg-muted/20 flex items-center gap-4 rounded-md p-2">
                                            <Globe className="text-primary h-4 w-4" />
                                            <div>
                                                <p className="text-muted-foreground text-xs uppercase">
                                                    Geographic
                                                </p>
                                                <p className="text-xs font-medium">
                                                    {toProperCase(store.geographic_level)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Variables */}
                                        <div className="bg-muted/20 flex items-center gap-4 rounded-md p-2">
                                            <Database className="text-primary h-4 w-4" />
                                            <div>
                                                <p className="text-muted-foreground text-xs uppercase">
                                                    Variables
                                                </p>
                                                <p className="text-xs font-medium">
                                                    {store.variables.length}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Date Range */}
                                        <div className="bg-muted/20 flex items-center gap-4 rounded-md p-2">
                                            <Calendar className="text-primary h-4 w-4" />
                                            <div>
                                                <p className="text-muted-foreground text-xs uppercase">
                                                    Date Range
                                                </p>
                                                <p className="text-xs font-medium">
                                                    {dateStart} → {dateEnd}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <Divider /> */}

                                    {/* Variables Preview */}
                                    <div className="space-y-2">
                                        <p className="text-muted-foreground text-xs font-medium">
                                            Variables
                                        </p>

                                        <ScrollArea className="w-full">
                                            <div className="flex flex-wrap gap-2">
                                                {store.variables
                                                    .slice(0, 8)
                                                    .map((v: string, i: number) => (
                                                        <Badge
                                                            key={i}
                                                            variant="outline"
                                                            className="rounded-md px-2 py-0.5 text-xs"
                                                        >
                                                            {v}
                                                        </Badge>
                                                    ))}

                                                {store.variables.length > 8 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{store.variables.length - 8} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                </CardContent>

                                <CardFooter className="text-muted-foreground relative flex justify-end text-xs">
                                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                                        View Details →
                                    </span>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}
        </>
    )
}

export default DataStoreCardGrid
