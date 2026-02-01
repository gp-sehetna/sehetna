import { PasswordSchema } from "@/features/auth/auth.validation"
import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { NextRequest } from "next/server"

// TODO: Endpoint should be authenticated to be called
export const POST = globalErrorHandler(async (req: NextRequest) => {
    const { password } = PasswordSchema.parse(await req.json())

    const mainService = await MainService.getInstance()
    /*
        TODO: Retrieve user_id from access_token or (refresh_token idk honestly)
        ! I retreived it from cookies for now idk if thats correct.
        TODO: Pass it to checkPassword method in authService with the password.
        TODO: Compare both passwords using compare() from bycrypt.
    */
    const user_id = req.cookies.get("user_id") as RequestCookie

    await mainService.authService.checkOldPassword(user_id.value, password)

    return [undefined, "Password is correct"]
})
