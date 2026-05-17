export const ComingSoonBadge = () => {
    return (
        <div className="bg-success-100/2 ring-success-100/50 mb-2 inline-flex items-center gap-2 rounded-full px-6 py-1 ring-1">
            <div className="flex h-2 w-2">
                <span className="bg-success-100 absolute inline-flex h-2 w-2 animate-ping rounded-full opacity-75"></span>
                <span className="bg-success-200 relative inline-flex h-2 w-2 rounded-full"></span>
            </div>
            <span className="text-success-300 text-sm font-medium">Under Active Development</span>
        </div>
    )
}
