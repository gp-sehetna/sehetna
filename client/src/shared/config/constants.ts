export const expirations = {
    EMAIL_VERIFICATION_TOKEN: 5 * 60, // 5 mins,
    ACCESS_TOKEN: 30 * 60, // 30 mins
    REFRESH_TOKEN: 30 * 24 * 60 * 60, // 30 days
} as const
