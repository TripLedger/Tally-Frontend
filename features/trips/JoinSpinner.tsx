import { cn } from "@/lib/utils";

/** 24px gradient ring spinner for the join flow. */
export function JoinSpinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("h-6 w-6", className)}
    >
      <svg
        className="h-6 w-6 animate-spin"
        style={{ animationDuration: "800ms", animationTimingFunction: "linear" }}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient
            id="join-spinner-gradient"
            x1="0"
            y1="0"
            x2="24"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7C3AED" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="url(#join-spinner-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="42 20"
        />
      </svg>
    </div>
  );
}
