import { Button } from "@/components/ui/shadcn/button"
import { Spinner } from "@/components/ui/shadcn/spinner"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

export function SpinnerButton() {
    useGSAP(() =>
        gsap.fromTo(".spinning", { y: -100 }, { y: 0, duration: 0.5, ease: "power3.out" })
    )

    return (
        /* 4. Attach the ref to the parent or the element itself */
        <Button
            className="spinning hover:bg-neutral-1000 absolute top-2 right-1/2 -translate-x-0.5 transform cursor-default"
            variant="black"
            size="sm"
        >
            <Spinner data-icon="inline-start" />
            Loading...
        </Button>
    )
}
