"use client";
//* Acts same as Link but with spacing of a Button

import { Button } from "@/components/ui/shadcn/button";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";


type LinkButtonProps = {
  href: Url;
  size?: "default" | "sm" | "lg";
  variant?: "link" | "ghost";
}

export default function LinkButton({
  href,
  size = "default",
  variant = "link",
  children
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & LinkButtonProps) {
  return (
    <Button size={size} variant={variant} asChild>
      <Link href={href}>
        {children}
      </Link>
    </Button>
  );
}
