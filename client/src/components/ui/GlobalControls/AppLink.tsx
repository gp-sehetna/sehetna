"use client";
import { cn } from "@/lib/utils";
import { Url } from "next/dist/shared/lib/router/router";
//* Simple Link, used in footer for example

import Link from "next/link";


type AppLinkProps = {
  href: Url;
  size?: "default" | "sm" | "lg";
  variant?: "link" | "ghost";
}

export default function AppLink({
  href,
  children,
  className
}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & AppLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative",
        "after:absolute after:left-0 after:bottom-0",
        "after:h-[0.5px] after:w-full after:bg-current",
        "after:origin-center after:scale-x-0",
        "after:transition-transform after:duration-300 after:ease-out",
        "hover:after:scale-x-100",
        className
      )}

    >
      {children}
    </Link>
  );
}
