const buildSteps = (start = 0, end: number, step: number) => {
    const arrayLength = Math.floor((end - start) / step) + 1
    return Array.from({ length: arrayLength }, (_, index) => start + index * step)
}

function spreadOverDomain(domain: [number, number], count: number = 20): number[] {
    const [min, max] = domain
    return Array.from({ length: count }, (_, i) => min + ((max - min) * i) / (count - 1))
}

export { buildSteps, spreadOverDomain }
