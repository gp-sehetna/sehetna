"use client";


type AppButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export default function AppButton({
  className,
  ...props
}: AppButtonProps) {
  return (
    <button
      {...props}
      className={className}
    />
  );
}
