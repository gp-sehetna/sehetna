import { EyeOff, Eye } from "lucide-react"
import { Button } from "../shadcn/button"

type ShowHidePasswordButtonProps = {
    showPassword: boolean
    togglePasswordVisibility: () => void
}

const ShowHidePasswordButton = ({
    showPassword,
    togglePasswordVisibility,
}: ShowHidePasswordButtonProps) => {
    const size = 20
    return (
        <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
        >
            {showPassword ? <EyeOff size={size} /> : <Eye size={size} />}
        </Button>
    )
}

export default ShowHidePasswordButton
