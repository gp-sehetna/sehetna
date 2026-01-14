"use client";

import { useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import Flex from "./Flex";
import AppLink from "./GlobalControls/AppLink";

type InputFieldProps = {
  label?: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  className?: string;
};

export default function AppInput({
  label,
  type = "text",
  placeholder,
  className,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <Flex direction="col" gap={1} className="w-full">
      <Flex className=" w-full justify-between items-center px-2">
        {label && <label className="text-neutral-700 ">{label}</label>}
        {isPassword && (
          <AppLink href={"#ForgetPasswordPage"} hoverEffect={false} className="underline text-xs hover:text-neutral-900 base-transition text-[#666666]">
            Forget Password?
          </AppLink>
        )}
      </Flex>

      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={isPassword ? "********" : placeholder}
          className={clsx(
            "w-full rounded-[20px] px-5 py-3",
            "border border-neutral-300",
            "bg-white text-neutral-900",
            "placeholder:text-neutral-400",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "transition",
            isPassword && "pr-12",
            className
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 cursor-pointer -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
          >
            {showPassword ? (
              <EyeOff size={18} className=" scale-x-[-1]" />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>
    </Flex>
  );
}
