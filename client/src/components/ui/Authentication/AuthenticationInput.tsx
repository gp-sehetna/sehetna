import { Field, FieldLabel } from "@/components/ui/shadcn/field"
import { Mail } from "lucide-react"
import { InputGroup, InputGroupInput, InputGroupAddon } from "../shadcn/input-group"

export function AuthenticationField() {
    //     <FieldLabel className="text-xs font-bold px-3" htmlFor="email">Email Address</FieldLabel>
    //     <Input rounded="xxl" id="email" type="email" placeholder="abc@example.com" required />
    return (
        <Field className="gap-1 text-neutral-500">
            <InputGroup>
                <InputGroupInput rounded="xxl" id="email" type="email" placeholder="abc@example.com" required />
                <InputGroupAddon>
                    <Mail />
                </InputGroupAddon>
            </ InputGroup>
        </ Field>
    )
}
