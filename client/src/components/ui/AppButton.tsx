"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { AppButtonProps } from "./types";

const buttonVariants = {
  primary:
    "bg-primary text-white hover:bg-primary-500 active:bg-primary-600",

  secondary:
    "bg-secondary text-white hover:bg-secondary-400 active:bg-secondary-300",

  outline:
    "border border-primary text-primary bg-transparent hover:bg-primary-100 active:bg-primary-200",
};

export default function AppButton({
  className,
  variant = "primary",
  ...props
}: AppButtonProps) {
  return (
    <Button
      {...props}
      className={clsx(
        // base styles
        "cursor-pointer trans",
        // variant styles
        buttonVariants[variant],
        // user overrides
        className
      )}
    />
  );
}
