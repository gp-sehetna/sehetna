const PrimarySecondaryDecoration = () => {
    return (
        <>
            <div className="from-primary/10 pointer-events-none absolute top-0 right-0 h-150 w-150 rounded-full bg-linear-to-bl to-transparent blur-3xl" />
            <div className="from-secondary/10 pointer-events-none absolute bottom-0 left-0 h-150 w-150 rounded-full bg-linear-to-tr to-transparent blur-3xl" />
        </>
    )
}
const MirroredPrimarySecondaryDecoration = () => {
    return (
        <>
            <div className="from-primary/10 pointer-events-none absolute -top-20 -left-20 h-100 w-125 rounded-full bg-linear-to-br to-transparent blur-3xl" />
            <div className="from-secondary/10 pointer-events-none absolute -right-20 -bottom-20 h-100 w-125 rounded-full bg-linear-to-tl to-transparent blur-3xl" />
        </>
    )
}
export { PrimarySecondaryDecoration, MirroredPrimarySecondaryDecoration }
