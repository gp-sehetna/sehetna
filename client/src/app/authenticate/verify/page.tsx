"use client"
import PageCenter from "@/src/components/ui/PageCenter"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

const purposes = new Set(["email_verification", "password_reset"])

const VerifyPage = () => {

    //* Should be in the middleware
    const searchParams = useSearchParams()
    const requiredParam = searchParams.get("purpose")
    const router = useRouter()
    if (!requiredParam || !purposes.has(requiredParam)) router.push("/authenticate/login")
    //* ------------------------------

    return (
        <PageCenter>
            Verify Page for {requiredParam}
        </PageCenter>
    )
}

export default VerifyPage