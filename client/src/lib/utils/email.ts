export const hideEmail = (email: string) => {
    const [local, domain] = email.split("@")

    if (!local || !domain) return ""

    const maskedLocal = local[0] + "*".repeat(Math.max(local.length - 1, 0))

    const [domainName, ...tldParts] = domain.split(".")
    const tld = tldParts.join(".")

    const maskedDomain = domainName[0] + "*".repeat(Math.max(domainName.length - 1, 0))

    return `${maskedLocal}@${maskedDomain}.${tld}`
}
