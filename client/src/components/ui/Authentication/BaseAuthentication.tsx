import AuthenticationHeader from "@/components/ui/Authentication/Globals/AuthenticationHeader"
import { ReactNode } from "react"
import Flex from "../Flex"

type BaseAuthenticationProps = {
    title: ReactNode;
    subtitle: ReactNode;
    children?: ReactNode;
}

const BaseAuthentication = ({ title, subtitle, children }: BaseAuthenticationProps) => {
    return (
        <Flex direction="col" gap={8} className="items-center sm:items-start">
            <AuthenticationHeader title={title} subtitle={subtitle} />
            {children}
        </Flex>
    )
}

export default BaseAuthentication
