"use client"

import { useState } from "react"
import clsx from "clsx"
import { Eye, EyeOff } from "lucide-react"

type InputFieldProps = {
    label?: string
    type?: "text" | "email" | "password"
    placeholder?: string
    className?: string
}

export default function AppInput({
    label,
    type = "text",
    placeholder,
    className,
}: InputFieldProps) {
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === "password"

    return (
        <div className="flex w-full flex-col gap-2">
            {label && <label className="text-sm font-medium text-neutral-700">{label}</label>}

            <div className="relative">
                <input
                    type={isPassword && showPassword ? "text" : type}
                    placeholder={placeholder}
                    className={clsx(
                        "w-full rounded-full px-5 py-3",
                        "border border-neutral-300",
                        "bg-white text-neutral-900",
                        "placeholder:text-neutral-400",
                        "focus:ring-primary focus:border-transparent focus:ring-2 focus:outline-hidden",
                        "transition",
                        isPassword && "pr-12",
                        className
                    )}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
        </div>
    )
}
