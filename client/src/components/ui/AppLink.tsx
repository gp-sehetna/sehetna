"use client";

import Link from "next/link";
import { Typography } from "antd";
import clsx from "clsx";

type AppLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "button";
  size?: "small" | "middle" | "large";
  type?: "primary" | "default" | "text" | "link" | "ghost";
  className?: string;
};

export default function AppLink({
  href,
  children,
  variant = "default",
  size = "small",
  type = "default",
  className,
}: AppLinkProps) {
  if (variant === "button") {
    return (
      <Link href={href} >
        <Typography.Link
          className={clsx(
            "inline-flex items-center justify-center px-4 py-2 rounded font-medium",
            type === "primary" && "bg-primary! text-white! hover:bg-primary-300!",
            type === "default" && "bg-gray-100! text-gray-900! hover:bg-gray-200!",
            size === "small" && "text-sm! py-1! px-2!",
            size === "middle" && "text-md! py-2! px-4!",
            size === "large" && "text-lg! py-3! px-6!",
            className
          )}
        >
          {children}
        </Typography.Link>
      </Link>
    );
  }

  
  return (
    <Link href={href} legacyBehavior>
      <Typography.Link className={clsx("text-primary hover:text-primary-hover", className)}>
        {children}
      </Typography.Link>
    </Link>
  );
}
