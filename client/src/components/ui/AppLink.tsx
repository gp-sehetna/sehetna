"use client";

import Link from "next/link";

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
        {children}
      </Link>
    );
  }


  return (
    <Link href={href}>
      
      {children}
    </Link>
  );
}
