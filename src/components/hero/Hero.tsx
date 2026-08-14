"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";
import type { Playlist } from "@/lib/playlists";
import { TOTAL_TRACK_COUNT } from "@/lib/playlists";
import { PaperclipBellIcon, PlayIcon } from "@/components/icons";
import { GlowOrbs } from "@/components/scene/GlowOrbs";

export function Hero({ playlist }: { playlist: Playlist }) {
  const { hasStarted, startSession, triggerGag, gagPulse, sharedTrack } =
    usePlayer();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // belt-and-braces: some browsers only honor autoplay if `muted` is also
  // set as a DOM property (not just the JSX attribute) before play() fires
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {
      // autoplay can still be blocked (e.g. low-power mode) — the poster
      // frame stays visible in that case, which is a fine fallback
    });
  }, []);

  return (
    <section className="relative z-10 flex min-h-[560px] flex-col items-center overflow-hidden px-4 pt-5 text-center sm:min-h-[640px] sm:pt-7">
      {/* looping office-floor video, the hero's visual theme */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/hero/office-loop.mp4"
          poster="/hero/office-loop-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </div>

      {/* scrim: keeps दफ्तर legible and in focus over the busy footage, with
          a tighter dark vignette right behind the wordmark */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 58% 46% at 50% 40%, rgba(13,15,18,0.92) 0%, rgba(13,15,18,0.78) 45%, rgba(13,15,18,0.5) 78%, rgba(13,15,18,0.3) 100%), linear-gradient(180deg, rgba(13,15,18,0.55) 0%, rgba(13,15,18,0.25) 26%, rgba(13,15,18,0.35) 60%, rgba(13,15,18,0.85) 100%)",
        }}
      />

      <GlowOrbs />

      <p className="font-mono-office text-[11px] tracking-[0.25em] text-highlighter sm:text-xs">
        {TOTAL_TRACK_COUNT} SONGS · NEVER CLOCKS OUT
      </p>

      <h1 className="mt-2 font-display-dv text-[26vw] leading-[0.9] tracking-tight drop-shadow-[0_6px_28px_rgba(0,0,0,0.75)] sm:text-[11rem] md:text-[13rem]">
        <span className="text-shine text-shine-cream" lang="hi">
          दफ्तर
        </span>
      </h1>

      <p className="mt-3 font-mono-office text-[11px] tracking-[0.2em] text-paper-dim sm:text-xs">
        NON-STOP SINCE THE LAST RE-ORG
      </p>

      {sharedTrack && !hasStarted && (
        <p className="mt-6 max-w-xs rounded-full border border-highlighter/30 bg-highlighter/10 px-4 py-2 font-mono-office text-[11px] text-highlighter">
          Someone sent you &ldquo;{sharedTrack.track.title}&rdquo; — clock in
          to hear it
        </p>
      )}

      <div className="mt-8 mb-4 flex flex-wrap items-center justify-center gap-3">
        {!hasStarted ? (
          <button
            type="button"
            onClick={() => startSession(playlist)}
            className="group flex cursor-pointer items-center gap-2 rounded-full bg-highlighter px-6 py-3.5 font-mono-office text-sm font-bold uppercase tracking-wide text-office-950 shadow-[0_8px_24px_rgba(245,197,24,0.25)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            <PlayIcon className="h-4 w-4" />
            Clock In &amp; Play
          </button>
        ) : (
          <span className="rounded-full border border-highlighter/40 bg-highlighter/10 px-5 py-3 font-mono-office text-xs font-bold uppercase tracking-wide text-highlighter">
            You&apos;re clocked in
          </span>
        )}

        <button
          type="button"
          onClick={triggerGag}
          aria-label="Per my last email — plays a notification chime"
          className={`flex cursor-pointer items-center gap-2 rounded-full border border-paper/15 bg-office-900/70 px-5 py-3.5 font-mono-office text-xs font-bold uppercase tracking-wide text-paper backdrop-blur-sm transition-transform duration-200 hover:border-highlighter/40 hover:text-highlighter active:scale-95 ${
            gagPulse ? "animate-[shake_0.6s_ease]" : ""
          }`}
        >
          <PaperclipBellIcon className="h-4 w-4" />
          <span className="flex flex-col items-start leading-tight">
            <span>Per My Last Email</span>
            <span className="text-[9px] font-normal normal-case tracking-normal text-muted">
              just circling back!!
            </span>
          </span>
        </button>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0) rotate(0deg);
          }
          20% {
            transform: translateX(-3px) rotate(-2deg);
          }
          40% {
            transform: translateX(3px) rotate(2deg);
          }
          60% {
            transform: translateX(-2px) rotate(-1deg);
          }
          80% {
            transform: translateX(2px) rotate(1deg);
          }
        }
      `}</style>
    </section>
  );
}
