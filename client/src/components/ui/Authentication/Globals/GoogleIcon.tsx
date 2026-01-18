import Image from "next/image"

type GoogleIconProps = {
    size?: number
}

const GoogleIcon = ({ size = 16 }: GoogleIconProps) => {
    return <Image width={size} height={size} alt="Google logo" src="/Google.svg" />
}

export default GoogleIcon
