"use client";

import { Button } from "antd";
import type { ButtonProps } from "antd";
import clsx from "clsx";

type AppButtonProps = ButtonProps & {
  className?: string;
};

export default function AppButton({
  className,
  ...props
}: AppButtonProps) {
  return (
    <Button
      {...props}
      className={clsx(className)}
    />
  );
}
