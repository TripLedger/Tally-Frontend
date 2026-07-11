import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-12 w-full rounded-input bg-background-elevated px-4 text-text-primary",
            "border border-border-glass placeholder:text-text-disabled",
            "transition-all duration-default ease-tally",
            "focus:border-accent-violet/50 focus:outline-none focus:ring-2 focus:ring-accent-violet/20",
            error && "border-semantic-rose/50 focus:ring-semantic-rose/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-semantic-rose">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-text-disabled">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
