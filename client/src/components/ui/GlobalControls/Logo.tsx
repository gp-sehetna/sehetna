import Image from "next/image";

type LogoProps = {
    size?: number
}

export default function Logo({ size = 48 }: LogoProps) {
    return (
        <Image width={size} height={size} alt="Sehetna" src="/Branding/Logo/sehetna-logo.png" />
    )
}
