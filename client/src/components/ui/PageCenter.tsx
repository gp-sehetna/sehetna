const PageCenter = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen w-full items-center justify-center text-3xl font-bold">
            {children}
        </div>
    )
}

export default PageCenter
