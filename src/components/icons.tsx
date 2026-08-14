type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PlayIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} fill="currentColor" stroke="none">
      <path d="M7 5.5v13a1 1 0 0 0 1.53.85l10.5-6.5a1 1 0 0 0 0-1.7l-10.5-6.5A1 1 0 0 0 7 5.5Z" />
    </svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} fill="currentColor" stroke="none">
      <rect x="6.5" y="5" width="4" height="14" rx="1" />
      <rect x="13.5" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

export function PrevIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} fill="currentColor" stroke="none">
      <rect x="5" y="5" width="2.4" height="14" rx="1" />
      <path d="M18 5.6v12.8a1 1 0 0 1-1.53.85l-8.5-6.4a1 1 0 0 1 0-1.7l8.5-6.4A1 1 0 0 1 18 5.6Z" />
    </svg>
  );
}

export function NextIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} fill="currentColor" stroke="none">
      <rect x="16.6" y="5" width="2.4" height="14" rx="1" />
      <path d="M6 5.6v12.8a1 1 0 0 0 1.53.85l8.5-6.4a1 1 0 0 0 0-1.7l-8.5-6.4A1 1 0 0 0 6 5.6Z" />
    </svg>
  );
}

export function VolumeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 9.5h3.2L11 6v12l-3.8-3.5H4Z" strokeLinejoin="round" />
      <path d="M15 9a4 4 0 0 1 0 6" />
      <path d="M17.3 6.8a7.5 7.5 0 0 1 0 10.4" />
    </svg>
  );
}

export function VolumeMuteIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 9.5h3.2L11 6v12l-3.8-3.5H4Z" strokeLinejoin="round" />
      <path d="M15.5 9.5 19.5 14.5" />
      <path d="M19.5 9.5 15.5 14.5" />
    </svg>
  );
}

export function QueueIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 6h12" />
      <path d="M4 12h12" />
      <path d="M4 18h8" />
      <path d="M17 15l3-3-3-3" />
      <path d="M20 12h-5" />
    </svg>
  );
}

export function BadgeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="5" y="7" width="14" height="15" rx="2" />
      <circle cx="12" cy="12.5" r="2.4" />
      <path d="M8.5 18.5c.6-1.6 1.9-2.4 3.5-2.4s2.9.8 3.5 2.4" />
      <path d="M9.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function ShareIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="18" cy="5.5" r="2.4" />
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="18.5" r="2.4" />
      <path d="M8.2 10.7 15.8 6.8" />
      <path d="M8.2 13.3 15.8 17.2" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function BuildingIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="5" y="3.5" width="14" height="17" rx="1.2" />
      <path d="M9 7.5h1.4M13.6 7.5H15M9 11h1.4M13.6 11h1.4M9 14.5h1.4M13.6 14.5H15" />
      <rect x="10" y="17" width="4" height="3.5" />
    </svg>
  );
}

export function PaperclipBellIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 12.5V7a3 3 0 0 1 6 0v7.5a4.5 4.5 0 0 1-9 0V8" />
      <circle cx="18.5" cy="6.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M19 19l-4.3-4.3" />
    </svg>
  );
}

export function LoaderIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

// दफ्तर's mark: a skyline/equalizer of three bars (office + sound, at once),
// with a play-triangle knocked out of the tallest one. Original, not based
// on any existing app or brand's logo.
export function LogoMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className}>
      <rect x="0" y="0" width="32" height="32" rx="8" fill="#f5c518" />
      <rect x="7" y="17" width="4.5" height="9" rx="1.5" fill="#16140f" />
      <rect x="13.75" y="10" width="4.5" height="16" rx="1.5" fill="#16140f" />
      <rect x="20.5" y="14" width="4.5" height="12" rx="1.5" fill="#16140f" />
      <path d="M14.7 12.3 L17.7 15.8 L14.7 19.3 Z" fill="#f5c518" />
    </svg>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5Z" />
      <circle cx="12" cy="12.5" r="3.4" />
    </svg>
  );
}

export function CoffeeMugIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 8h11v6a5 5 0 0 1-5 5H9a4 4 0 0 1-4-4V8Z" />
      <path d="M16 9.5h1.5a2.2 2.2 0 0 1 0 4.4H16" />
      <path d="M8 5.5c-.6-.7-.6-1.3 0-2M11.5 5.5c-.6-.7-.6-1.3 0-2" />
    </svg>
  );
}
