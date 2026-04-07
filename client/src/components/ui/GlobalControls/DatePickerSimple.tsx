"use client"

import { Button } from "@/components/ui/shadcn/button"
import { Calendar } from "@/components/ui/shadcn/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover"
import { format } from "date-fns"

type DatePickerSimpleProps = {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
}

export function DatePickerSimple({ date, setDate }: DatePickerSimpleProps) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="glassy"
                    className="text-neutral-1000 justify-start px-2.5 font-normal"
                    id="date-picker-simple"
                >
                    {date ? (
                        format(date, "PPP")
                    ) : (
                        <span className="text-muted-foreground/80">
                            Pick a date for scenario simulation...
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="z-1000 w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    defaultMonth={date}
                    disabled={{ after: today }}
                />
            </PopoverContent>
        </Popover>
    )
}
