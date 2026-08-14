"use client";

import { useEffect, useState } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { CameraIcon, ClockIcon, LogoMark } from "@/components/icons";

const AUX_INSTAGRAM_URL = "https://www.instagram.com/genzbits/";

function formatClock(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => n.toString().padStart(2, "0")).join(":");
}

// simulated presence count — there's no real analytics backend behind this,
// just a plausible-looking number that drifts slightly, in the spirit of
// the site's other satirical "corporate dashboard" touches
function useOnlineCount() {
  const [online, setOnline] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOnline(14 + Math.floor(Math.random() * 30));
    const id = setInterval(() => {
      setOnline((n) => {
        if (n === null) return n;
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(58, Math.max(6, n + delta));
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return online;
}

export function Header() {
  const { sessionSeconds, hasStarted, auxAvatar } = usePlayer();
  const online = useOnlineCount();

  return (
    <header className="relative z-30 flex items-start justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[10px] shadow-[0_0_0_3px_rgba(0,0,0,0.35)]">
            <LogoMark className="h-full w-full" />
          </div>
          <div className="leading-tight">
            <p
              className="font-mono-office-dv text-[16px] font-semibold tracking-wide text-paper"
              lang="hi"
            >
              दफ्तर
            </p>
            <p className="font-mono-office text-[11px] tracking-wide text-muted">
              FLOOR 4 · MON&ndash;FRI
            </p>
          </div>
        </div>

        <div
          className="flex w-fit items-center gap-1.5 rounded-full border border-paper/10 bg-office-900/70 px-2.5 py-1 font-mono-office text-[11px] text-paper-dim backdrop-blur-sm"
          title="People currently clocked in on दफ्तर"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-away opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-away" />
          </span>
          <span className="tabular-nums text-paper">{online ?? "—"}</span>
          <span className="text-muted">online now</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-paper/10 bg-office-900/70 px-3 py-1.5 font-mono-office text-[11px] tabular-nums text-paper-dim backdrop-blur-sm">
          <ClockIcon className="h-3.5 w-3.5 text-highlighter" />
          <span>{hasStarted ? formatClock(sessionSeconds) : "00:00:00"}</span>
          <span className="hidden text-muted sm:inline">on the clock</span>
        </div>
        <a
          href={AUX_INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Psst — it's @genzbits on aux. Opens Instagram in a new tab."
          className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-paper/10 bg-office-900/70 px-2.5 py-1.5 backdrop-blur-sm transition-colors duration-300 hover:border-transparent"
        >
          {/* colorful sweep, teases the reveal without reproducing any app's actual logo */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 translate-x-[-100%] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(135deg, #feda75 0%, #fa7e1e 22%, #d62976 48%, #962fbf 72%, #4f5bd5 100%)",
            }}
          />

          <span
            className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-office-950 transition-transform duration-300 group-hover:scale-110"
            style={{
              background: auxAvatar
                ? `hsl(${auxAvatar.hue} 70% 60%)`
                : "var(--color-highlighter)",
            }}
          >
            <span className="transition-opacity duration-200 group-hover:opacity-0">
              {auxAvatar?.initials.slice(0, 2) ?? "YOU"}
            </span>
            <CameraIcon className="absolute h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </span>

          <span className="relative grid font-mono-office text-[11px] leading-none">
            <span className="col-start-1 row-start-1 whitespace-nowrap text-paper-dim transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:opacity-0">
              who&apos;s on aux?
            </span>
            <span className="col-start-1 row-start-1 flex translate-y-2 items-center gap-1 whitespace-nowrap font-bold text-white opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
              @genzbits <span aria-hidden="true">↗</span>
            </span>
          </span>
        </a>
      </div>
    </header>
  );
}
