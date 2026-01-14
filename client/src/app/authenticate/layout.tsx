import "@/app/globals.css"
import Footer from "@/components/ui/GlobalComponents/Footers/Footer"

export default function AuthenticationLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex min-h-screen flex-col">
                <div className="flex flex-2 overflow-hidden">
                    <main className="m-4 flex flex-1 items-center justify-center sm:justify-start sm:p-20">
                        {children}
                    </main>

                    <div
                        className="hidden min-w-xs -skew-x-6 rounded-tl-[64px] bg-cover bg-right sm:block"
                        style={{
                            backgroundImage: "url('/Authentication Gradient.png')",
                        }}
                    />
                </div>

                <Footer className="hidden md:flex" variant="simple" />
            </div>
        </>
    )
}
