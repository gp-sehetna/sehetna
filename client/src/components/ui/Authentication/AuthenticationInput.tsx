import { Field, FieldLabel } from "@/components/ui/shadcn/field"
import { InputGroup, InputGroupInput, InputGroupAddon } from "../shadcn/input-group"
import { InputProps } from "../shadcn/input"
import { cn } from "@/lib/utils"

type AuthenticationFieldProps = {
    name: string
    htmlFor?: string
    prependInnerIcon?: React.ReactNode
    appendInnerIcon?: React.ReactNode
    inlineOptions?: React.ReactNode
} & InputProps

export function AuthenticationField({
    name,
    htmlFor,
    prependInnerIcon,
    appendInnerIcon,
    inlineOptions,
    className,
    ...props
}: AuthenticationFieldProps) {
    return (
        <>
            <Field className={cn("gap-1", className)}>
                <FieldLabel className="px-3 text-xs font-bold text-neutral-500" htmlFor={htmlFor}>
                    {name}
                    <div className="hover:text-neutral-1000 ml-auto pl-0 font-light italic">
                        {inlineOptions}
                    </div>
                </FieldLabel>
                <InputGroup rounded="xxl">
                    <InputGroupInput {...props} />
                    <InputGroupAddon>{prependInnerIcon}</InputGroupAddon>
                    <InputGroupAddon align="inline-end">{appendInnerIcon}</InputGroupAddon>
                </InputGroup>
            </Field>
        </>
    )
}
