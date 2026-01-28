import Image from "next/image"
import NavLink from "../NavLink"

type LogoProps = {
    size?: number
}

export default function Logo({ size = 48 }: LogoProps) {
    return (
        <NavLink href="/">
            <Image width={size} height={size} alt="Sehetna" src="/Branding/Logo/sehetna-logo.png" />
        </NavLink>
    )
}
