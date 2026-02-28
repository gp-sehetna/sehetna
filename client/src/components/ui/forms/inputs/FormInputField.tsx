import { Field, FieldError, FieldLabel } from "@/components/ui/shadcn/field"
import { InputProps } from "@/components/ui/shadcn/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/shadcn/input-group"
import { cn } from "@/lib/utils"
import RHF from "react-hook-form"

type FormInputProps = {
    label: string
    prependInnerIcon?: React.ReactNode
    appendInnerIcon?: React.ReactNode
    inlineOptions?: React.ReactNode
    errors?: Array<RHF.FieldError | undefined>
} & InputProps

export function FormInputField({
    label,
    id,
    prependInnerIcon,
    appendInnerIcon,
    inlineOptions,
    errors,
    className,
    ...props
}: FormInputProps) {
    return (
        <Field className={cn(className)}>
            <FieldLabel className="px-3 text-xs font-bold text-neutral-500" htmlFor={id}>
                {label}
                <div className="hover:text-neutral-1000 ml-auto pl-0 font-light italic">
                    {inlineOptions}
                </div>
            </FieldLabel>
            <InputGroup rounded="xxl">
                <InputGroupInput id={id} {...props} />
                <InputGroupAddon>{prependInnerIcon}</InputGroupAddon>
                <InputGroupAddon align="inline-end">{appendInnerIcon}</InputGroupAddon>
            </InputGroup>
            <FieldError errors={errors} />
        </Field>
    )
}
