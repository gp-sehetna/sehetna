import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { ReadonlyURLSearchParams } from "next/navigation"

export const toLast = (router: AppRouterInstance, params: ReadonlyURLSearchParams) => {
    const callbackUrl = params.get("callbackUrl")
    router.push(callbackUrl ?? "/")
}
