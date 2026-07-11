import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-default ease-tally",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet/50",
          "disabled:pointer-events-none disabled:opacity-50",
          fullWidth && "w-full",
          size === "sm" && "h-9 px-4 text-sm rounded-input",
          size === "md" && "h-12 px-6 text-base rounded-input",
          size === "lg" && "h-14 px-8 text-lg rounded-card",
          variant === "primary" &&
            "bg-accent-gradient text-text-primary shadow-glow hover:opacity-90 active:scale-[0.98]",
          variant === "secondary" &&
            "bg-background-elevated text-text-primary border border-border-glass hover:bg-background-card",
          variant === "ghost" &&
            "text-text-secondary hover:text-text-primary hover:bg-background-elevated",
          variant === "danger" &&
            "bg-semantic-rose/10 text-semantic-rose border border-semantic-rose/20 hover:bg-semantic-rose/20",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
