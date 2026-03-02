/**
 * "United States" → "united-states"
 */
function slugify(value: string): string {
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
function unslugify(slug: string, delimiter = " "): string {
    return String(slug).replace(/-/g, delimiter)
}

/**
 * "united states" → "United States"
 * "united_states" → "United States"
 */
function toProperCase(value: string): string {
    return value.replace(/[_\s]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Returns the initials of a given name.
 * e.g. "John Doe" -> "JD"
 * @param {string} name - The name to get the initials from.
 * @returns {string} The initials of the given name.
 */
function getInitials(name: string) {
    return name
        .replaceAll(/&\s/g, "")
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
}

function stringToColor(text: string | undefined) {
    if (!text) throw new Error("Text is required to generate color")
    let hash = 0

    for (let i = 0; i < text.length; i++) hash = text.charCodeAt(i) + ((hash << 5) - hash)

    let color = "#"

    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 255
        // Blend with white to make color lighter
        const lightValue = Math.floor((value + 200) / 1.3)
        color += ("00" + lightValue.toString(16)).slice(-2)
    }

    return color
}

export { getInitials, slugify, stringToColor, toProperCase, unslugify }
