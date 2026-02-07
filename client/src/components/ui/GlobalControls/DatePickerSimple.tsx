"use client"

import { Button } from "@/components/ui/shadcn/button"
import { Calendar } from "@/components/ui/shadcn/calendar"
import { Field, FieldLabel } from "@/components/ui/shadcn/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

type DatePickerSimpleProps = {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
    className?: string
}

export function DatePickerSimple({ date, setDate, className }: DatePickerSimpleProps) {
    return (
        <Field className={cn("mx-auto w-60 gap-1", className)}>
            <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
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
                            <span className="text-muted-foreground/80">Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="z-1000 w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        defaultMonth={date}
                    />
                </PopoverContent>
            </Popover>
        </Field>
    )
}
