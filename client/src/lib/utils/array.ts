const buildSteps = (start = 0, end: number, step: number) => {
    const arrayLength = Math.floor((end - start) / step) + 1
    return Array.from({ length: arrayLength }, (_, index) => start + index * step)
}

export { buildSteps }
