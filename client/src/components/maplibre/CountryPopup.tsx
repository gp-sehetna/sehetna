import { X } from "lucide-react";
import Flex from "../ui/Flex";
import Heading from "../ui/Heading";
import { Button } from "../ui/shadcn/button";

type MapPopupType = { name: string; iso: string; onClose: () => void };

export default function CountryPopup({ name, iso, onClose }: MapPopupType) {
  return (
    <Flex
      direction="col"
      gap={2}
      className="rounded-xl p-5 min-w-40 glassy" 
    >
      <Button
        size={"sm"}
        onClick={onClose}
        className="bg-transparent ml-auto  p-1! -mr-2 active:bg-transparent! -mt-1 hover:bg-danger/10  rounded-full h-fit"
      >
        <X size={24} />
      </Button>
      <Heading size={5}>{name}</Heading>
      <p className="text-xs text-slate-500">ISO: {iso}</p>
    </Flex>
  );
}
