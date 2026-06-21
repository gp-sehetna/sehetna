"use client"
import { Button } from "@/components/ui/shadcn/button"
import { Skeleton } from "@/components/ui/shadcn/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/shadcn/table"
import { cn } from "@/lib/utils"
import { ColumnDef, flexRender, Table as TanstackTable } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { getPinnedColumnClassName, getPinnedColumnStyles } from "../scenario.helpers"
import { ScenarioListResult, Scenario } from "../scenario.types"
import { UseQueryResult } from "@tanstack/react-query"
import { Dispatch, SetStateAction } from "react"

type TableProps = {
    table: TanstackTable<Scenario>
    observationsQuery: UseQueryResult<NoInfer<ScenarioListResult>, Error>
    columns: ColumnDef<Scenario>[]
    setSelectedObservation: Dispatch<SetStateAction<Scenario | null>>
}

const ObservationsTableContent = ({
    table,
    observationsQuery,
    columns,
    setSelectedObservation,
}: TableProps) => {
    return (
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
                                        "bg-muted! text-center whitespace-nowrap",
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
                                  if (event.key === "Enter") setSelectedObservation(row.original)
                              }}
                          >
                              {row.getVisibleCells().map((cell) => {
                                  return (
                                      <TableCell
                                          key={cell.id}
                                          className={cn(
                                              "place-items-center text-center whitespace-nowrap",
                                              getPinnedColumnClassName(cell.column)
                                          )}
                                          style={getPinnedColumnStyles(cell.column)}
                                      >
                                          {flexRender(
                                              cell.column.columnDef.cell,
                                              cell.getContext()
                                          )}
                                      </TableCell>
                                  )
                              })}
                          </TableRow>
                      ))}
                {!observationsQuery.isLoading && table.getRowModel().rows.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={columns.length}>
                            <div className="flex min-h-40 flex-col items-center justify-center gap-4 text-center">
                                <p className="text-muted-foreground max-w-64 font-medium">
                                    No observations found. Go to Live Map page to create one.
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
    )
}

export default ObservationsTableContent
