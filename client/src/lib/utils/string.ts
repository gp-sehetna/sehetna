/**
 * "United States" → "united-states"
 */
export function slugifyCountry(value: string): string {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z-]/g, "")
}

/**
 * "united-states" → "united states"
 */
export function unslugifyCountry(slug: string): string {
    return String(slug).replace(/-/g, " ")
}

/**
 * "united states" → "United States"
 */
export function toProperCase(value: string): string {
    return String(value).replace(
        /\w\S*/g,
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
}
