import { Field, FieldLabel } from "@/components/ui/shadcn/field"
import { InputGroup, InputGroupInput, InputGroupAddon } from "../shadcn/input-group"
import { InputProps } from "../shadcn/input"

type AuthenticationFieldProps = {
    name: string
    htmlFor?: string
    icon?: React.ReactNode
} & InputProps

export function AuthenticationField({ name, htmlFor, icon, ...props }: AuthenticationFieldProps) {
    //     <Input rounded="xxl" id="email" type="email" placeholder="abc@example.com" required />
    return (
        <>
            <Field className="gap-1">
                <FieldLabel className="px-3 text-xs font-bold text-neutral-500" htmlFor={htmlFor}>
                    {name}
                </FieldLabel>
                <InputGroup rounded="xxl">
                    <InputGroupInput {...props} />
                    <InputGroupAddon>{icon}</InputGroupAddon>
                </InputGroup>
            </Field>
        </>
    )
}
