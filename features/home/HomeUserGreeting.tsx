"use client";

import { cn } from "@/lib/utils";

interface HomeUserGreetingProps {
  displayName: string;
  className?: string;
}

/** Figma paragraph mini/regular — "Hi, {name}" on light home screens. */
export function HomeUserGreeting({
  displayName,
  className,
}: HomeUserGreetingProps) {
  const name = displayName.trim() || "there";

  return (
    <p className={cn("text-tabr-ink-paragraph-mini min-w-0 truncate", className)}>
      <span className="text-tabr-ink-paragraph-mini-secondary">Hi, </span>
      <span>{name}</span>
    </p>
  );
}
