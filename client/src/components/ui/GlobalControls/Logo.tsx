import Image from "next/image"
import Link from "next/link"

type LogoProps = {
    size?: number
    withText?: boolean
}

export default function Logo({ size = 48, withText = false }: LogoProps) {
    return (
        <Link className="flex flex-row items-center justify-start gap-2" href="/">
            <Image width={size} height={size} alt="Sehetna" src="/brand/logo.png" />
            {withText && <span className="font-semibold">Sehetna</span>}
        </Link>
    )
}
