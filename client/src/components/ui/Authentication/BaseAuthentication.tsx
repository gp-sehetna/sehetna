import AuthenticationHeader from "@/components/ui/Authentication/Globals/AuthenticationHeader"
import { ReactNode } from "react"
import Flex from "../Flex"
import { cn } from "@/lib/utils/cn"

type BaseAuthenticationProps = {
    title: ReactNode
    subtitle: ReactNode
    className?: string
    children?: ReactNode
}

const BaseAuthentication = ({ title, subtitle, className, children }: BaseAuthenticationProps) => {
    return (
        <Flex
            direction="col"
            gap={8}
            className={cn("items-center md:items-start lg:w-lg", className)}
        >
            <AuthenticationHeader className={className} title={title} subtitle={subtitle} />
            {children}
        </Flex>
    )
}

export default BaseAuthentication
