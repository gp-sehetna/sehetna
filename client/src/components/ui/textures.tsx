function DotTexture() {
    return (
        <div
            className="absolute inset-0 opacity-[0.1]"
            style={{
                backgroundImage:
                    "radial-gradient(circle at 1px 1px, var(--color-neutral-1000) 1px, transparent 0)",
                backgroundSize: "24px 24px",
            }}
        />
    )
}

function GridTexture() {
    return (
        <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "62px 62px",
            }}
        />
    )
}

const _textures = {
    dots: DotTexture,
    grid: GridTexture,
}

type TexturesType = keyof typeof _textures

const Texture = ({ texture }: { texture: TexturesType }) => {
    const ChosenTexture = _textures[texture]
    return ChosenTexture ? <ChosenTexture /> : null
}

export default Texture
export type { TexturesType }
