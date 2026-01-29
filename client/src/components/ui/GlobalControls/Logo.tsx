import Image from "next/image"
import Link from "next/link"

type LogoProps = {
    size?: number
}

export default function Logo({ size = 48 }: LogoProps) {
    return (
        <Link href="/">
            <Image width={size} height={size} alt="Sehetna" src="/Branding/Logo/sehetna-logo.png" />
        </Link>
    )
}
