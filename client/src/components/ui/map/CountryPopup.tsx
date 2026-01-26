import { X } from "lucide-react"
import Flex from "../Flex"
import { Button } from "../shadcn/button"

type MapPopupType = { name: string; iso: string; onClose: () => void }

export default function CountryPopup({ name, iso, onClose }: MapPopupType) {
    return (
        <Flex direction="col" gap={2} className="glassy min-w-40 rounded-xl p-5">
            <Button
                size={"sm"}
                onClick={onClose}
                className="hover:bg-danger/10 -mt-1 -mr-2 ml-auto h-fit rounded-full bg-transparent p-1! active:bg-transparent!"
            >
                <X size={24} />
            </Button>
            <h5>{name}</h5>
            <p className="text-xs text-slate-500">ISO: {iso}</p>
        </Flex>
    )
}
