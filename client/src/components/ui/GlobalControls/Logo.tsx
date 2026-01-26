import Image from "next/image"

type LogoProps = {
    size?: number
}

export default function Logo({ size = 48 }: LogoProps) {
    return <Image width={size} height={size} alt="Sehetna" src="/branding/logo/sehetna-logo.png" />
}
