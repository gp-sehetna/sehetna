import AuthenticationHeader from "@/components/ui/Authentication/Globals/AuthenticationHeader"
import { cn } from "@/lib/utils"
import { DetailedHTMLProps, FormHTMLAttributes, ReactNode } from "react"
import Flex from "../Flex"

type BaseAuthenticationProps = {
    title: ReactNode
    subtitle: ReactNode
    children?: ReactNode
} & Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, "title">

const BaseAuthentication = ({
    title,
    subtitle,
    className,
    children,
    ...props
}: BaseAuthenticationProps) => {
    return (
        <form className="w-full" {...props} noValidate>
            <Flex
                direction="col"
                gap={8}
                className={cn("items-center md:items-start lg:w-lg", className)}
            >
                <AuthenticationHeader className={className} title={title} subtitle={subtitle} />
                {children}
            </Flex>
        </form>
    )
}

export default BaseAuthentication
