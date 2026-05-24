import { type ReactNode } from "react"
import ComplexFooter from "../GlobalComponents/Footers/ComplexFooter"
import AppHeader from "../GlobalComponents/headers/AppHeader"

const HomeLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="relative flex min-h-screen flex-col">
            <AppHeader />
            <main className="flex-1">{children}</main>
            <ComplexFooter />
        </div>
    )
}

export default HomeLayout
