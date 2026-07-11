"use client";

import { useEffect } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import {
  useToasts,
  useRemoveToast,
  type ToastVariant,
} from "@/store";
import { cn } from "@/lib/utils";

const variantConfig: Record<
  ToastVariant,
  { icon: typeof CheckCircle; className: string }
> = {
  success: {
    icon: CheckCircle,
    className: "border-semantic-green/30 bg-semantic-green/10 text-semantic-green",
  },
  error: {
    icon: AlertCircle,
    className: "border-semantic-rose/30 bg-semantic-rose/10 text-semantic-rose",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  },
  info: {
    icon: Info,
    className: "border-accent-cobalt/30 bg-accent-cobalt/10 text-accent-cobalt",
  },
};

function ToastItem({
  id,
  message,
  variant,
  duration = 4000,
}: {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}) {
  const removeToast = useRemoveToast();
  const config = variantConfig[variant];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, removeToast]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-card border px-4 py-3 shadow-float-nav",
        "animate-in slide-in-from-top duration-fast ease-tally",
        "bg-background-elevated backdrop-blur-md",
        config.className
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 shrink-0" />
      <p className="flex-1 text-sm font-medium text-text-primary">
        {message}
      </p>
      <button
        onClick={() => removeToast(id)}
        className="shrink-0 rounded-full p-1 text-text-secondary hover:text-text-primary"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToasts();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] flex flex-col gap-2 p-4 safe-top pointer-events-none">
      <div className="mx-auto w-full max-w-mobile flex flex-col gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} />
        ))}
      </div>
    </div>
  );
}
