import { toast } from "sonner"

export function confirmIncompleteEnvironment<T>(environmentData: T): Promise<T | null> {
    return new Promise<T | null>((resolve) => {
        toast.warning("Action needed", {
            description: "You must fill in the remaining details for accurate results",
            onAutoClose: () => resolve(environmentData),
            onDismiss: () => resolve(environmentData),
        })
    })
}
