import React, { ReactNode } from "react";

export type Children = ReactNode;
// export type Spacing = 0 | 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 64;
export type HeadingSizes = 1 | 2 | 3 | 4 | 5 | 6;

export type FlexType = {
  children: Children;
  direction?: "row" | "col";
  gap?: number;
  className?:string
};

export type AppButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  variant?: "primary" | "secondary" | "outline";
};


export type HeadingType = {
  children: Children;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: HeadingSizes;
  color?: "primary" | "secondary" | "black";
  className?: string;
};
