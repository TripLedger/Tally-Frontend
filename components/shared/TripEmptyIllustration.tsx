export function TripEmptyIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Dashed path */}
      <path
        d="M24 88 Q 60 40, 96 32"
        stroke="#7C3AED"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Map pin */}
      <circle cx="96" cy="32" r="6" fill="#7C3AED" opacity="0.3" />
      <path
        d="M96 22, C96 96, 96 44, 96 44, C96 36, 88 32, 96 32, C104 32, 96 36, 96 44, Z"
        fill="#2563EB"
        opacity="0.6"
      />
      <circle cx="96" cy="38" r="3" fill="#F8F8FF" />
      {/* Suitcase */}
      <rect
        x="28"
        y="52"
        width="48"
        height="36"
        rx="6"
        stroke="#94A3B8"
        strokeWidth="1.5"
        fill="#13131A"
      />
      <rect x="28" y="60" width="48" height="4" fill="#1C1C27" />
      <rect x="48" y="46" width="8" height="8" rx="2" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
      <circle cx="38" cy="92" r="3" stroke="#475569" strokeWidth="1.5" fill="none" />
      <circle cx="66" cy="92" r="3" stroke="#475569" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
