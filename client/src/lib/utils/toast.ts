import { toast } from "sonner"

export function confirmIncompleteEnvironment<T>(
    environmentData: T,
    nullKeys: string[]
): Promise<T | null> {
    if (!nullKeys.length) return Promise.resolve(environmentData)

    return new Promise<T | null>((resolve) => {
        const toastId = toast.warning("Incomplete Environment Data", {
            description: `Missing environment data: ${nullKeys.join(", ")}.`,
            onAutoClose: () => resolve(null),
            onDismiss: () => resolve(null),
            action: {
                label: "Continue Anyway",
                onClick: () => {
                    toast.dismiss(toastId)
                    resolve(environmentData)
                },
            },
        })
    })
}
