import VerifyClient from "@/app/authenticate/verify/verify-client"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Verify Your Account",
    description: "Verify your account by entering the code sent to your email address.",
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyClient />
        </Suspense>
    )
}
