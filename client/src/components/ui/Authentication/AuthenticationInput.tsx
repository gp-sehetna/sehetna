import { Field, FieldLabel } from "@/components/ui/shadcn/field"
import { cn } from "@/lib/utils"
import { InputProps } from "../shadcn/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../shadcn/input-group"

type AuthenticationFieldProps = {
    name: string
    prependInnerIcon?: React.ReactNode
    appendInnerIcon?: React.ReactNode
    inlineOptions?: React.ReactNode
} & InputProps

export function AuthenticationField({
    name,
    id,
    prependInnerIcon,
    appendInnerIcon,
    inlineOptions,
    className,
    ...props
}: AuthenticationFieldProps) {
    return (
        <>
            <Field className={cn("gap-1", className)}>
                <FieldLabel className="px-3 text-xs font-bold text-neutral-500" htmlFor={id}>
                    {name}
                    <div className="hover:text-neutral-1000 ml-auto pl-0 font-light italic">
                        {inlineOptions}
                    </div>
                </FieldLabel>
                <InputGroup rounded="xxl">
                    <InputGroupInput id={id} {...props} />
                    <InputGroupAddon>{prependInnerIcon}</InputGroupAddon>
                    <InputGroupAddon align="inline-end">{appendInnerIcon}</InputGroupAddon>
                </InputGroup>
            </Field>
        </>
    )
}
