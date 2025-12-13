import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = {
  variant?: "primary" | "surface" | "ghost";
  size?: "default" | "icon";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "default",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-primary text-white shadow-card hover:bg-primary/90 focus-visible:outline-primary",
    surface:
      "bg-surfaceContainer text-ink shadow-card hover:bg-surface focus-visible:outline-primary",
    ghost:
      "bg-transparent text-ink hover:bg-surface-variant focus-visible:outline-primary",
  };

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    default: "px-4 py-2",
    icon: "h-9 w-9 p-0",
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

