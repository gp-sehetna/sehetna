"use client";

type LogoProps = {
    test?: string
}

export default function Logo({
}: LogoProps) {

    return (
        <div className="w-9 h-9 bg-neutral-600 text-white rounded-full flex justify-center items-center">
            L
        </div>
    )
}
