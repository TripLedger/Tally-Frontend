"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyHeaderProps {
  title: string;
  backHref?: string;
  rightAction?: React.ReactNode;
  className?: string;
}

export function StickyHeader({
  title,
  backHref,
  rightAction,
  className,
}: StickyHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center gap-3",
        "border-b border-border-glass bg-background/95 backdrop-blur-lg",
        "safe-top px-4",
        className
      )}
    >
      {backHref ? (
        <Link
          href={backHref}
          className="flex h-9 w-9 items-center justify-center rounded-input text-text-secondary hover:bg-background-elevated"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      ) : (
        <div className="w-9" />
      )}
      <h1 className="flex-1 truncate text-base font-semibold text-text-primary">
        {title}
      </h1>
      <div className="flex min-w-[36px] justify-end">{rightAction}</div>
    </header>
  );
}
