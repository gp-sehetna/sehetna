type ComingSoonProps = {
    title: string
    description?: string
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
    return (
        <div className="mx-auto max-w-4xl px-6 py-24">
            <div className="text-center">
                {/* App Branding */}
                <div className="mb-8 flex items-center justify-center gap-3">
                    <h3 className="text-primary text-2xl font-bold">Sehetna</h3>
                </div>

                {/* Page Title */}
                <h1 className="mb-4 bg-clip-text text-5xl font-bold">{title} Page</h1>

                {/* Description */}
                {description && <p className="mb-24 text-xl text-gray-600">{description}</p>}

                {/* Coming Soon Badge */}
                <div className="bg-primary-50 ring-primary-200 mb-2 inline-flex items-center gap-2 rounded-full px-6 py-1 ring-1">
                    <div className="flex h-2 w-2">
                        <span className="bg-primary-400 absolute inline-flex h-2 w-2 animate-ping rounded-full opacity-75"></span>
                        <span className="bg-primary-500 relative inline-flex h-2 w-2 rounded-full"></span>
                    </div>
                    <span className="text-primary-700 text-sm font-medium">
                        Under Active Development
                    </span>
                </div>

                {/* Message */}
                <p className="mb-12 text-base text-gray-500">
                    We are working hard to bring you this feature. It will be available soon!
                </p>

                {/* Progress Illustration */}
                <div className="mx-auto max-w-md">
                    <svg
                        className="text-primary-500 mx-auto h-32 w-32"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                    </svg>
                    <p className="mt-4 text-sm text-gray-600">
                        Building something great for your health
                    </p>
                </div>
            </div>
        </div>
    )
}
