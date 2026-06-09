import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/shadcn/input-group"
import { InputFieldFrame, SharedInputFieldProps } from "./InputFieldShared"

export function FormInputField({
    label,
    id,
    prependInnerIcon,
    appendInnerIcon,
    inlineOptions,
    errors,
    className,
    groupClassName,
    ...props
}: SharedInputFieldProps) {
    return (
        <InputFieldFrame
            id={id}
            label={label}
            inlineOptions={inlineOptions}
            errors={errors}
            className={className}
            labelClassName="px-3 text-xs font-bold text-neutral-500"
            inlineOptionsClassName="hover:text-neutral-1000 ml-auto pl-0 font-light italic"
        >
            <InputGroup className={groupClassName} rounded="xxl">
                <InputGroupInput id={id} {...props} />
                {prependInnerIcon && <InputGroupAddon>{prependInnerIcon}</InputGroupAddon>}
                {appendInnerIcon && (
                    <InputGroupAddon align="inline-end">{appendInnerIcon}</InputGroupAddon>
                )}
            </InputGroup>
        </InputFieldFrame>
    )
}
