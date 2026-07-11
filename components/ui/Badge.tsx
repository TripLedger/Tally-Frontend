import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "rose" | "violet";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium",
        variant === "default" &&
          "bg-background-elevated text-text-secondary border border-border-glass",
        variant === "success" &&
          "bg-semantic-green/10 text-semantic-green",
        variant === "rose" && "bg-semantic-rose/10 text-semantic-rose",
        variant === "violet" &&
          "bg-accent-violet/10 text-accent-violet",
        className
      )}
    >
      {children}
    </span>
  );
}
