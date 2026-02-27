import { ProjectionType, PopulateOptions, QueryFilter } from "mongoose"

type SortType = "asc" | "desc"

interface PaginationOptions<T> {
    page?: number
    limit?: number
    filter?: QueryFilter<T>
    sort?: Record<string, SortType>
    select?: ProjectionType<T>
    populate?: PopulateOptions | PopulateOptions[]
    lean?: boolean
}

interface PaginationResult<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export type { PaginationOptions, PaginationResult, SortType }
