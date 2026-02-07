import { format } from "date-fns"

export function getWeekRange(dateStr: string, weeks: number = 1) {
    const date = new Date(dateStr)
    const dayIndex = date.getDay() // Sunday = 0

    const startDate = new Date(date)
    startDate.setDate(date.getDate() - dayIndex)

    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + (weeks * 7 - 1))

    return {
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
    }
}
