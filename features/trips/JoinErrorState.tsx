import Link from "next/link";
import { Link2Off } from "lucide-react";
import { cn } from "@/lib/utils";

export function JoinErrorState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center px-6 text-center",
        className
      )}
    >
      <div
        className={cn(
          "flex h-24 w-24 items-center justify-center",
          "rounded-[20px] border border-[#ffffff0f] bg-[#13131A]"
        )}
      >
        <Link2Off className="h-10 w-10 text-[#F43F5E]" strokeWidth={1.75} />
      </div>

      <h1 className="mt-4 text-[19px] font-bold text-[#F8F8FF]">
        Link not valid
      </h1>
      <p className="mt-1.5 max-w-[280px] text-[14px] font-normal leading-[1.5] text-[#94A3B8]">
        This invite link isn&apos;t valid. Ask your trip organizer for a new
        one.
      </p>

      <Link
        href="/dashboard"
        className={cn(
          "mt-6 flex h-[52px] w-full max-w-[327px] items-center justify-center",
          "rounded-[12px] bg-[#1C1C27] text-[15px] font-semibold text-[#F8F8FF]",
          "transition-colors duration-fast ease-tally hover:bg-[#252532]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
        )}
      >
        Back to dashboard
      </Link>
    </div>
  );
}
