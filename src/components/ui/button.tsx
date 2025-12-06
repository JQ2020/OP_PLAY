import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = {
  variant?: "primary" | "surface";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-primary text-white shadow-card hover:bg-primary/90 focus-visible:outline-primary",
    surface:
      "bg-surfaceContainer text-ink shadow-card hover:bg-surface focus-visible:outline-primary",
  };

  return (
    <button
      className={clsx(base, variants[variant], className)}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
