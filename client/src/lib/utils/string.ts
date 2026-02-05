/**
 * "United States" → "united-states"
 */
export function slugify(value: string): string {
    return (
        String(value)
            .trim()
            .toLowerCase()
            // Convert spaces and underscores to hyphens
            .replace(/[\s_]+/g, "-")
            // Remove any character that isn't a lowercase letter or hyphen
            .replace(/[^a-z-]/g, "")
    )
}

/**
 * "united-states" → "united states"
 * "respiratory-disease-rate" → "respiratory_disease_rate"
 */
export function unslugify(slug: string): string {
    return String(slug).replace(/-/g, " ")
}

/**
 * "united states" → "United States"
 * "united_states" → "United States"
 */
export function toProperCase(value: string): string {
    return value.replace(/[_\s]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}
