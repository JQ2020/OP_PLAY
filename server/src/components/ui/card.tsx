import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
}

export function Card({
  variant = "default",
  className,
  children,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-white dark:bg-surface border border-border-light dark:border-border",
    elevated: "bg-white dark:bg-surface shadow-card",
    outlined: "bg-transparent border-2 border-border dark:border-border",
  };

  return (
    <div
      className={cn(
        "rounded-xl transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
