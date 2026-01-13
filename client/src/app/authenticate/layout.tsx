import "@/app/globals.css"

export default function AuthenticationLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <div className="flex flex-2">
                    <main className="p-4 md:p-20 flex flex-1 md:items-center">
                        {children}
                    </main>

                    <div
                        className="hidden md:block min-w-xs bg-cover bg-right rounded-tl-[64px]"
                        style={{
                            backgroundImage: "url('/Authentication Gradient.png')",
                        }}
                    />
                </div>

                <footer className="py-2 border-t border-gray-300 text-center text-sm text-muted-foreground">
                    <p>footer</p>
                </footer>
            </div>
        </>

    );
}
