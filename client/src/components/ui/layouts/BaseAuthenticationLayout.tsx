import { ReactNode, Suspense } from "react"
import Footer from "@/components/ui/GlobalComponents/Footers/Footer"
import { GooSpinner } from "../GlobalComponents/Loaders/GooSpinner"

export const BaseAuthenticationLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <div className="flex min-h-screen flex-col">
                <div className="flex flex-2 overflow-hidden">
                    <main className="m-8 flex flex-1 items-center justify-center md:justify-start md:p-20">
                        <Suspense fallback={<GooSpinner color="primary" />} children={children} />
                    </main>

                    <div
                        className="hidden min-w-2xs -skew-x-6 rounded-tl-[64px] bg-cover bg-right lg:block"
                        style={{
                            backgroundImage: "url('/images/Authentication Gradient.png')",
                        }}
                    />
                </div>

                <Footer className="hidden md:flex" variant="simple" />
            </div>
        </>
    )
}
