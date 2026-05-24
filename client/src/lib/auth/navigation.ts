import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { ReadonlyURLSearchParams } from "next/navigation"

export const navigateToLastRoute = (router: AppRouterInstance, params: ReadonlyURLSearchParams) => {
    const destination = params.get("dst") ?? params.get("callbackUrl") ?? "/"
    const isLocalPath = destination?.startsWith("/") && !destination.startsWith("//")

    router.push(isLocalPath ? destination : "/")
}
