"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePlayer } from "@/components/player/PlayerProvider";
import { shareUrlFor, youtubeThumbnail } from "@/lib/playlists";
import { CloseIcon, LogoMark, ShareIcon } from "@/components/icons";

const DESKS = ["4B", "12F", "7C", "2E", "9A", "14D"];
const CLEARANCES = ["Guest", "Level 2", "Visitor", "Need-to-Know"];
const SHIFT_ENDS = ["17:30", "18:15", "17:00", "19:45", "23:59"];

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// deterministic 6-digit "employee number" from the track id, so it stays
// stable for a given track instead of re-randomizing on every render
function employeeNumber(seed: string) {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return String(Math.abs(hash) % 900000 + 100000);
}

export function BadgeModal() {
  const { badgeOpen, closeBadge, activePlaylist, currentTrack } = usePlayer();
  const [copied, setCopied] = useState(false);

  const badgeFields = useMemo(
    () => ({
      desk: pick(DESKS),
      clearance: pick(CLEARANCES),
      shiftEnds: pick(SHIFT_ENDS),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [badgeOpen]
  );

  useEffect(() => {
    if (!badgeOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeBadge();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [badgeOpen, closeBadge]);

  if (!badgeOpen) return null;

  async function handleShare() {
    const path = shareUrlFor(activePlaylist, currentTrack);
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${path}`
        : `https://daftarco.in${path}`;
    const text = `Now playing on दफ्तर: "${currentTrack.title}" — ${currentTrack.artist}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "दफ्तर", text, url });
      } catch {
        // user cancelled share sheet, ignore
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable, silently ignore
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-office-950/85 p-4 backdrop-blur-sm"
      onClick={closeBadge}
    >
      <div
        className="modal-in w-full max-w-[300px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* lanyard clip + strap */}
        <div className="flex justify-center">
          <div className="h-4 w-4 rounded-t-md bg-office-600" />
        </div>
        <div className="mx-auto -mt-0.5 h-2.5 w-16 rounded-b-sm bg-office-700" />
        <div className="mx-auto h-2 w-2.5 rounded-b-full bg-office-600" />

        {/* the card itself */}
        <div className="relative -mt-1 overflow-hidden rounded-xl bg-paper text-office-950 shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
          {/* clearance-color side accent, doubles as a department color code */}
          <div
            className="absolute inset-y-0 left-0 w-1.5"
            style={{ background: `hsl(${currentTrack.hue} 65% 45%)` }}
            aria-hidden="true"
          />
          {/* holographic security sheen */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
            style={{
              background:
                "linear-gradient(115deg, transparent 20%, #7dd3fc 32%, #f0abfc 40%, #fde68a 48%, transparent 60%)",
            }}
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={closeBadge}
            aria-label="Close badge"
            className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-office-950/10 text-office-950 transition-colors duration-150 hover:bg-office-950/20"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>

          {/* header band */}
          <div className="flex items-center gap-2 bg-office-950 py-2.5 pl-4 pr-3">
            <LogoMark className="h-6 w-6 shrink-0" />
            <div className="min-w-0 leading-tight">
              <p className="font-display-dv text-base tracking-tight text-paper" lang="hi">
                दफ्तर
              </p>
              <p className="font-mono-office text-[8px] uppercase tracking-[0.2em] text-paper-dim">
                Employee Access Card
              </p>
            </div>
          </div>

          <div className="flex gap-3 px-4 pb-3 pt-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-office-950/15 bg-office-950/5">
              {youtubeThumbnail(currentTrack) ? (
                <Image
                  src={youtubeThumbnail(currentTrack) as string}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-display text-2xl text-office-600">
                  {currentTrack.artist.slice(0, 1)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="font-mono-office text-[8px] uppercase tracking-[0.2em] text-office-600">
                Department
              </p>
              <p className="truncate text-sm font-semibold">{activePlaylist.name}</p>
              <p className="mt-2 font-mono-office text-[8px] uppercase tracking-[0.2em] text-office-600">
                ID No.
              </p>
              <p className="font-mono-office text-xs font-bold tabular-nums">
                {employeeNumber(currentTrack.id)}
              </p>
            </div>
          </div>

          <div className="px-4">
            <div className="rounded-lg bg-office-950/5 px-3 py-2.5">
              <p className="font-mono-office text-[8px] uppercase tracking-[0.2em] text-office-600">
                Now Playing
              </p>
              <p className="truncate text-sm font-semibold">{currentTrack.title}</p>
              <p className="truncate font-mono-office text-[11px] text-office-700">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-office-950/10 px-4 py-3 text-center">
            <div>
              <p className="font-mono-office text-[8px] uppercase tracking-wide text-office-600">
                Desk
              </p>
              <p className="font-mono-office text-xs font-bold">{badgeFields.desk}</p>
            </div>
            <div>
              <p className="font-mono-office text-[8px] uppercase tracking-wide text-office-600">
                Clearance
              </p>
              <p className="font-mono-office text-xs font-bold">
                {badgeFields.clearance}
              </p>
            </div>
            <div>
              <p className="font-mono-office text-[8px] uppercase tracking-wide text-office-600">
                Shift Ends
              </p>
              <p className="font-mono-office text-xs font-bold">
                {badgeFields.shiftEnds}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 border-t border-office-950/10 py-3">
            <div
              className="h-7 w-36"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #16140f 0 2px, transparent 2px 4px, #16140f 4px 5px, transparent 5px 9px, #16140f 9px 12px, transparent 12px 14px)",
              }}
              aria-hidden="true"
            />
            <p className="font-mono-office text-[9px] tracking-wide text-office-600">
              daftarco.in · if found, return to Floor 4
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-paper py-3.5 font-mono-office text-sm font-bold uppercase tracking-wide text-office-950 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShareIcon className="h-4 w-4" />
            {copied ? "Link copied" : "Share your badge"}
          </button>
          <button
            type="button"
            onClick={closeBadge}
            className="cursor-pointer rounded-full py-2.5 font-mono-office text-xs uppercase tracking-wide text-paper-dim transition-colors duration-150 hover:text-paper"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
