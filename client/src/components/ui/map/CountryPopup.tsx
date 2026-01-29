import { X } from "lucide-react"
import Flex from "../Flex"
import { Button } from "../shadcn/button"

type PopupProps = { name: string; iso: string; onClose: () => void }

export default function CountryPopup({ name, iso, onClose }: PopupProps) {
    return (
        <Flex direction="col" gap={2} className="glassy relative h-30 w-75 rounded-xl p-4">
            <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="absolute top-2 right-2 ml-auto h-fit p-1! hover:bg-neutral-400/60"
            >
                <X />
            </Button>
            <h6>{name}</h6>
            <p className="text-xs text-slate-500">{iso}</p>
        </Flex>
    )
}
