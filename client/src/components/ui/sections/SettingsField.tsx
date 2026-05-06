"use client"

import {
    getInputPadding,
    getResolvedInputType,
    InputFieldFrame,
    SharedInputFieldProps,
} from "@/components/ui/forms/inputs/InputFieldShared"
import { Input } from "@/components/ui/shadcn/input"
import { InputGroup, InputGroupTextarea } from "@/components/ui/shadcn/input-group"
import { Eye, EyeOff } from "lucide-react"

export default function SettingsField(
    props: Omit<SharedInputFieldProps, "onChange"> & {
        onChange: (value: string) => void
    }
) {
    const { label, hint, icon: Icon } = props

    return (
        <InputFieldFrame
            id={props.id}
            label={label}
            hint={hint}
            errors={props.errors}
            labelClassName="text-xs font-semibold text-neutral-900"
            hintClassName="text-2xs text-neutral-500"
            errorClassName="text-xs"
        >
            <div className="relative">
                {Icon ? (
                    <Icon
                        size={14}
                        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-500"
                        strokeWidth={1.5}
                    />
                ) : null}

                {props.multiline ? (
                    <InputGroup
                        className="bg-earth-100/30 text-neutral-1000 focus-visible:border-earth/90 focus-visible:ring-earth/10 min-h-28 resize-none rounded-xl border-neutral-200 px-4 py-3 text-sm placeholder:text-neutral-400"
                        rounded="xxl"
                    >
                        <InputGroupTextarea
                            id="contact-message"
                            rows={props.rows ?? 4}
                            maxLength={props.maxLength}
                            placeholder={props.placeholder}
                            // {...register("message")}
                        />
                    </InputGroup>
                ) : (
                    <>
                        <Input
                            type={getResolvedInputType(props)}
                            value={props.value}
                            onChange={(event) => props.onChange(event.target.value)}
                            placeholder={props.placeholder}
                            className={`bg-earth-100/30 text-neutral-1000 focus-visible:border-earth/90 focus-visible:ring-earth/10 rounded-xl border-neutral-200 py-2.5 pr-10 text-sm placeholder:text-neutral-400 ${getInputPadding(Boolean(Icon))}`}
                        />
                        {props.showToggle ? (
                            <button
                                type="button"
                                onClick={props.onToggleVisibility}
                                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-neutral-500 transition-colors hover:text-neutral-800"
                            >
                                {props.isVisible ? (
                                    <EyeOff size={14} strokeWidth={1.5} />
                                ) : (
                                    <Eye size={14} strokeWidth={1.5} />
                                )}
                            </button>
                        ) : null}
                    </>
                )}
            </div>
        </InputFieldFrame>
    )
}
