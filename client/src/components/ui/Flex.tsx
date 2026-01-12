import { FlexType } from "./types";

const Flex = ({ direction = "row", children, gap, className}: FlexType) => {
  return (
    <div
      style={{ flexDirection: direction == "row" ? "row" : "column", gap: gap ? 4 * gap : 12}}
      className={` flex items-center justify-center gap-4 ${className}`}
    >
      {children}
    </div>
  );
};

export default Flex;
