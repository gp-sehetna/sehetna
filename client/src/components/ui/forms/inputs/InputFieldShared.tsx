import type { ElementType, ReactNode } from "react"
import RHF from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/shadcn/field"
import { InputProps } from "@/components/ui/shadcn/input"
import { cn } from "@/lib/utils"

export type SharedInputFieldProps = {
    label: string
    hint?: ReactNode
    icon?: ElementType
    prependInnerIcon?: ReactNode
    appendInnerIcon?: ReactNode
    inlineOptions?: ReactNode
    errors?: Array<RHF.FieldError | undefined>
    multiline?: boolean
    rows?: number
    maxLength?: number
    showToggle?: boolean
    isVisible?: boolean
    onToggleVisibility?: () => void
} & InputProps

type InputFieldFrameProps = {
    id?: string
    label: string
    hint?: ReactNode
    inlineOptions?: ReactNode
    errors?: Array<RHF.FieldError | undefined>
    className?: string
    labelClassName?: string
    inlineOptionsClassName?: string
    hintClassName?: string
    errorClassName?: string
    children: ReactNode
}

export function InputFieldFrame({
    id,
    label,
    hint,
    inlineOptions,
    errors,
    className,
    labelClassName,
    inlineOptionsClassName,
    hintClassName,
    errorClassName,
    children,
}: InputFieldFrameProps) {
    return (
        <Field className={className}>
            <FieldLabel className={labelClassName} htmlFor={id}>
                {label}
                {inlineOptions ? (
                    <div className={inlineOptionsClassName}>{inlineOptions}</div>
                ) : null}
            </FieldLabel>
            {children}
            {hint ? <p className={hintClassName}>{hint}</p> : null}
            <FieldError className={errorClassName} errors={errors} />
        </Field>
    )
}

export function getResolvedInputType({
    type,
    showToggle,
    isVisible,
}: Pick<SharedInputFieldProps, "type" | "showToggle" | "isVisible">) {
    if (!showToggle) return type
    return isVisible ? "text" : "password"
}

export function getInputPadding(hasLeadingIcon: boolean) {
    return cn(hasLeadingIcon ? "pl-10" : "pl-4")
}
