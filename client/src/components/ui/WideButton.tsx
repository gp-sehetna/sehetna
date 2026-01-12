"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";

type WideButtonProps = {
  variant: "outline" | "gradient" | "black";
  onClick?: () => void;
  content: string;
};

const baseStyles =
  "w-[396px] sm:w-[488px] py-2 sm:py-3 flex items-center justify-center rounded-full  trans cursor-pointer";

const variants = {
  outline: clsx("bg-transparent border border-black", "hover:bg-neutral-200", "active:bg-neutral-300"),
  black: clsx("bg-black border border-black text-white", "hover:bg-black hover:opacity-90", "active:opacity-80"),

  gradient: clsx(
    "text-white border-none",
    "bg-[linear-gradient(135deg,#3500AE_0%,#E74767_70%,var(--color-primary)_100%)]",
    "hover:bg-[linear-gradient(135deg,#3500AE_0%,#E74767_50%,var(--color-primary)_100%)] trans",
    "active:bg-[linear-gradient(135deg,#3500AE_0%,#E74767_90%,var(--color-primary)_100%)]"
  ),
};

export default function WideButton({
  variant,
  onClick,
  content,
}: WideButtonProps) {
  return (
    <Button onClick={onClick} className={clsx(baseStyles, variants[variant])}>
      {content}
    </Button>
  );
}
