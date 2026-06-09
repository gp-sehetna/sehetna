"use client"

import WideButton from "./Globals/WideButton"
import GoogleIcon from "./Globals/GoogleIcon"
import { signIn } from "next-auth/react"

function SignInWithGoogle() {
    const handleGoogleSignIn = async () => {
        try {
            await signIn("google", { callbackUrl: "/" })
        } catch (error) {
            console.error("Google Sign-In Error:", error)
        }
    }

    return (
        <WideButton type="button" onClick={handleGoogleSignIn} size="lg" variant="black-outline">
            <GoogleIcon />
            Sign in with Google
        </WideButton>
    )
}

export default SignInWithGoogle
