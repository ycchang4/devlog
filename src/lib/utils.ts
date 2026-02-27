/**
 * Given any date, return the Monday of that week at 00:00:00.000 UTC.
 * This is the canonical key for WeeklySummary lookups.
 */
export function getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getUTCDay() // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const diff = day === 0 ? -6 : 1 - day // how many days to rewind to Monday
    d.setUTCDate(d.getUTCDate() + diff)
    d.setUTCHours(0, 0, 0, 0)
    return d
}