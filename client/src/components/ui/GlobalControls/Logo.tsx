import Image from "next/image"
import Link from "next/link"

type LogoProps = {
    size?: number
    withText?: boolean
}

export default function Logo({ size = 48, withText = false }: LogoProps) {
    return (
        <Link className="flex flex-row items-center justify-start gap-2" href="/">
            <Image
                width={size}
                height={size}
                className="z-10"
                alt="Sehetna"
                src="/brand/logo.png"
            />
            {withText && (
                <span className="base-transition font-semibold group-data-[collapsible=icon]:-ml-8 group-data-[collapsible=icon]:opacity-0">
                    Sehetna
                </span>
            )}
        </Link>
    )
}
