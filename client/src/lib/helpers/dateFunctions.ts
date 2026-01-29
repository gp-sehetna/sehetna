
// endCount is days divisble by 7
export function getWeekRange(
  dateStr: string,
  endCount: number = 7
) {
  const date = new Date(dateStr)
  const dayIndex = date.getDay() // Sunday = 0

  const startDate = new Date(date)
  startDate.setDate(date.getDate() - dayIndex)

  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + (endCount - 1))

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  }
}


// returns index of the day sunday -> 0
export const getDay = (date: Date) => date.getDay()

function formatDate(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")

  return `${yyyy}-${mm}-${dd}`
}

