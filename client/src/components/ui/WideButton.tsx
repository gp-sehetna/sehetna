"use client";

import { Button } from "@/components/ui/shadcn/button";
import { ButtonSize } from "@/types/ui/Global";
import clsx from "clsx";

type WideButtonProps = {
  variant: "outline" | "gradient" | "black";
  size?: ButtonSize
  children?: React.ReactNode;
  onClick?: () => void;
};

const baseStyles =
  "w-[396px] sm:w-[488px] py-2 sm:py-3 flex items-center justify-center font-light rounded-full base-transition cursor-pointer";

const variants = {
  outline: clsx("bg-neutral-100 border border-neutral-1000", "hover:bg-neutral-200", "active:bg-neutral-300"),
  black: clsx("bg-black border border-neutral-1000 text-neutral-100", "hover:bg-neutral-1000 hover:opacity-90", "active:opacity-80"),

  gradient: clsx(
    "special-gradient text-neutral-100 border-none base-transition",
  ),
};

export default function WideButton({
  variant,
  size,
  onClick,
  children,
}: WideButtonProps) {
  return (
    <Button size={size} onClick={onClick} className={clsx(baseStyles, variants[variant])}>
      {children}
    </ Button>
  );
}
