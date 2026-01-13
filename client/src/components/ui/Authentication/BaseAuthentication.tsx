import AuthenticationHeader from "@/components/ui/Authentication/Globals/AuthenticationHeader"
import { ReactNode } from "react"

type BaseAuthenticationProps = {
    title: ReactNode
    subtitle: ReactNode
    children?: ReactNode
    OtherOptionsComponent?: ReactNode
}

const BaseAuthentication = ({
    title,
    subtitle,
    children,
    OtherOptionsComponent
}: BaseAuthenticationProps) => {

    return (
        <div className="flex flex-col gap-8">
            <AuthenticationHeader title={title} subtitle={subtitle} />
            {children}
            {OtherOptionsComponent}
        </div>
    )
}

export default BaseAuthentication