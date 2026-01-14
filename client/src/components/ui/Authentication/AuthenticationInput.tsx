import { Field, FieldLabel } from "@/components/ui/shadcn/field"
import { Mail } from "lucide-react"
import { InputGroup, InputGroupInput, InputGroupAddon } from "../shadcn/input-group"

export function AuthenticationField() {
    //     <Input rounded="xxl" id="email" type="email" placeholder="abc@example.com" required />
    return (
        <>
            <Field className="gap-1">
                <FieldLabel className="px-3 text-xs font-bold text-neutral-500" htmlFor="email">
                    Email Address
                </FieldLabel>
                <InputGroup rounded="xxl">
                    <InputGroupInput
                        id="email"
                        type="email"
                        placeholder="abc@example.com"
                        required
                    />
                    <InputGroupAddon>
                        <Mail />
                    </InputGroupAddon>
                </InputGroup>
            </Field>
        </>
    )
}
