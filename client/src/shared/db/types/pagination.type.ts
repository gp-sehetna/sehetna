import { ProjectionType, QueryFilter, PopulateOptions } from "mongoose"

type SortType = "asc" | "desc"

interface Pagination {
    page?: number
    limit?: number
    sort?: Record<string, SortType>
}

interface PaginationOptions<T> extends Pagination {
    filter?: QueryFilter<T>
    select?: ProjectionType<T>
    populate?: PopulateOptions | (PopulateOptions | string)[]
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

export type { PaginationOptions, Pagination, PaginationResult, SortType }
