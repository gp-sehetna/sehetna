import clsx from "clsx";
import { HeadingType } from "../../types/ui/Global";
import { spaceGrotesk } from "@/fonts/fonts";

// const headingSizes = {
//   1: "text-[36px] leading-[42px] lg:text-[48px] lg:leading-[60px]",
//   2: "text-[30px] leading-[36px] lg:text-[40px] lg:leading-[50px]",
//   3: "text-[24px] leading-[28px] lg:text-[36px] lg:leading-[42px]",
//   4: "text-[20px] leading-[24px] lg:text-[30px] lg:leading-[36px]",
//   5: "text-[20px] leading-[24px] lg:text-[24px] lg:leading-[28px]",
//   6: "text-[20px] leading-[24px]",
// };

export default function Heading({
  children,
  as = "h1",
  size = 1,
  color = "primary",
  className,
}: HeadingType) {
  const Component = as;

  return (
    <>
      <h4
        className={clsx(
          "font-bold",
          spaceGrotesk.className,
          color === "primary" && "text-primary",
          color === "black" && "text-black",
          color === "secondary" && "text-secondary",
          className
        )}
      >
        {children}
      </h4>
    </>
  );
}
