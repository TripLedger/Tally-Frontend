"use client";

import { Check } from "lucide-react";

const AVATARS = {
  left: {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    enterDelay: 100,
    floatDelay: 600,
  },
  center: {
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    enterDelay: 250,
    floatDelay: 750,
  },
  right: {
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    enterDelay: 380,
    floatDelay: 880,
  },
} as const;

function AvatarImg({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={80}
      height={80}
      loading="eager"
      decoding="async"
      referrerPolicy="no-referrer"
      className="block h-20 w-20 rounded-full border-[3px] border-[#0A0A0F] object-cover"
    />
  );
}

export function HeroMotion() {
  return (
    <div className="relative flex h-[200px] w-full items-center justify-center">
      {/* Faint ring behind cluster */}
      <div
        className="pointer-events-none absolute h-[172px] w-[172px] rounded-full border border-[#ffffff0a]"
        aria-hidden
      />

      {/* Cluster — fixed width, centered as one unit */}
      <div className="relative h-[88px] w-[232px]">
        {/* Left */}
        <div
          className="hero-avatar-float hero-float-a absolute bottom-0 left-0 z-10"
          style={{ animationDelay: `${AVATARS.left.floatDelay}ms` }}
        >
          <div
            className="hero-avatar-enter"
            style={{ animationDelay: `${AVATARS.left.enterDelay}ms` }}
          >
            <AvatarImg src={AVATARS.left.src} alt="Trip member" />
          </div>
        </div>

        {/* Center — forward & elevated */}
        <div
          className="hero-avatar-float hero-float-b absolute left-1/2 top-0 z-30 -translate-x-1/2"
          style={{ animationDelay: `${AVATARS.center.floatDelay}ms` }}
        >
          <div
            className="hero-avatar-enter relative"
            style={{ animationDelay: `${AVATARS.center.enterDelay}ms` }}
          >
            <AvatarImg src={AVATARS.center.src} alt="Trip member" />
            <div
              className="hero-checkmark-badge absolute flex h-7 w-7 items-center justify-center rounded-full bg-[#10B981] border-[3px] border-[#0A0A0F]"
              style={{ bottom: -8, right: -8 }}
              aria-hidden
            >
              <Check className="h-[14px] w-[14px] text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Right */}
        <div
          className="hero-avatar-float hero-float-c absolute bottom-0 right-0 z-20"
          style={{ animationDelay: `${AVATARS.right.floatDelay}ms` }}
        >
          <div
            className="hero-avatar-enter"
            style={{ animationDelay: `${AVATARS.right.enterDelay}ms` }}
          >
            <AvatarImg src={AVATARS.right.src} alt="Trip member" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AmbientCurrencyGlyphs() {
  return (
    <>
      <span
        className="pointer-events-none absolute right-6 top-[28%] text-[22px] font-normal text-[#10B981]/25 hero-currency-drift-a select-none"
        aria-hidden
      >
        $
      </span>
      <span
        className="pointer-events-none absolute left-4 top-[52%] text-[20px] font-normal text-[#7C3AED]/30 hero-currency-drift-b select-none"
        aria-hidden
      >
        £
      </span>
      <span
        className="pointer-events-none absolute right-10 top-[58%] text-[18px] font-normal text-[#475569]/40 hero-currency-drift-c select-none"
        aria-hidden
      >
        €
      </span>
    </>
  );
}
