function formatDate(date: Date): string {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")

    return `${yyyy}-${mm}-${dd}`
}

export function getWeekRange(dateStr: string, weeks: number = 1) {
    const date = new Date(dateStr)
    const dayIndex = date.getDay() // Sunday = 0

    const startDate = new Date(date)
    startDate.setDate(date.getDate() - dayIndex)

    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + (weeks * 7 - 1))

    return {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
    }
}
