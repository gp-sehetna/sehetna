export const ComingSoonBadge = () => {
    return (
        <div className="bg-primary-50/20 ring-primary-200 mb-2 inline-flex items-center gap-2 rounded-full px-6 py-1 ring-1">
            <div className="flex h-2 w-2">
                <span className="bg-primary-400 absolute inline-flex h-2 w-2 animate-ping rounded-full opacity-75"></span>
                <span className="bg-primary-500 relative inline-flex h-2 w-2 rounded-full"></span>
            </div>
            <span className="text-primary-700 text-sm font-medium">Under Active Development</span>
        </div>
    )
}
