export const homeViewport = { once: true, margin: "-80px 0px -80px 0px" as const }

export const easeBehavior: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const fadeIn = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: homeViewport,
    transition: { duration: 0.8, ease: easeBehavior },
}

export const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: homeViewport,
    transition: { duration: 0.8, ease: easeBehavior },
}

export const fadeDown = {
    initial: { opacity: 0, y: -24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: homeViewport,
    transition: { duration: 0.8, ease: easeBehavior },
}

export const slideInLeft = {
    initial: { opacity: 0, x: -32 },
    whileInView: { opacity: 1, x: 0 },
    viewport: homeViewport,
    transition: { duration: 0.8, ease: easeBehavior },
}

export const slideInRight = {
    initial: { opacity: 0, x: 32 },
    whileInView: { opacity: 1, x: 0 },
    viewport: homeViewport,
    transition: { duration: 0.8, ease: easeBehavior },
}

export function staggerDelay(index: number, step = 0.1) {
    return index * step
}
