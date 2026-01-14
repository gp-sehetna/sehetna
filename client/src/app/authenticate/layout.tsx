import "@/app/globals.css"
import Footer from "@/components/ui/GlobalComponents/Footers/Footer"

export default function AuthenticationLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex min-h-screen flex-col">
                <div className="flex flex-2">
                    <main className="flex flex-1 p-4 md:items-center md:p-20">{children}</main>

                    <div
                        className="hidden min-w-xs rounded-tl-[64px] bg-cover bg-right md:block"
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
