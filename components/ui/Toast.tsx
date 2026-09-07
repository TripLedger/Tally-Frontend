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
  { icon: typeof CheckCircle; accent: string }
> = {
  success: {
    icon: CheckCircle,
    accent: "text-[#10B981]",
  },
  error: {
    icon: AlertCircle,
    accent: "text-[#F43F5E]",
  },
  warning: {
    icon: AlertTriangle,
    accent: "text-[#F59E0B]",
  },
  info: {
    icon: Info,
    accent: "text-[#8B5CF6]",
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
        "flex items-center gap-3 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3",
        "shadow-[0_8px_28px_rgba(21,19,26,0.12)]",
        "animate-in slide-in-from-top duration-fast ease-tally"
      )}
      role="status"
      aria-live="polite"
    >
      <Icon className={cn("h-5 w-5 shrink-0", config.accent)} />
      <p className="flex-1 text-[14px] font-medium leading-5 text-[#15131A]">
        {message}
      </p>
      <button
        type="button"
        onClick={() => removeToast(id)}
        className="shrink-0 rounded-full p-1 text-[#8E8E93] transition-colors hover:text-[#15131A]"
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
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[70] flex flex-col gap-2 p-4 safe-top">
      <div className="pointer-events-auto mx-auto flex w-full max-w-mobile flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} />
        ))}
      </div>
    </div>
  );
}
