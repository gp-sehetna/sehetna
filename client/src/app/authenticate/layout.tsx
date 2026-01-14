import "@/app/globals.css"
import Footer from "@/components/ui/GlobalComponents/Footers/Footer";

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

                <Footer className="hidden md:flex" variant="simple" />
            </div>
        </>

    );
}
