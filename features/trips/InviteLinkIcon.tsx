/** Gradient chain/link icon for the invite hero card. */
export function InviteLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient
          id="invite-link-gradient"
          x1="8"
          y1="40"
          x2="40"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7C3AED" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <path
        d="M20.5 27.5a8 8 0 0 0 11.31.53l5.66-5.66a8 8 0 0 0-11.31-11.31l-1.41 1.41"
        stroke="url(#invite-link-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.5 20.5a8 8 0 0 0-11.31-.53l-5.66 5.66a8 8 0 0 0 11.31 11.31l1.41-1.41"
        stroke="url(#invite-link-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
