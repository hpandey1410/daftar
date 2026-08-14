"use client";

import Image from "next/image";
import { usePlayer } from "@/components/player/PlayerProvider";
import { formatTime, youtubeThumbnail } from "@/lib/playlists";
import {
  BadgeIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  QueueIcon,
  VolumeIcon,
  VolumeMuteIcon,
} from "@/components/icons";

export function PlayerBar() {
  const {
    hasStarted,
    currentTrack,
    isPlaying,
    isRealAudio,
    togglePlay,
    next,
    prev,
    elapsed,
    displayDuration,
    seek,
    volume,
    setVolume,
    toggleQueue,
    toggleBadge,
  } = usePlayer();

  if (!hasStarted) return null;

  const progressPct = (elapsed / displayDuration) * 100;

  return (
    <div className="rise-fade fixed inset-x-0 bottom-0 z-40 flex flex-col items-center px-3 pb-3 sm:px-6 sm:pb-5">
      <div className="w-full max-w-2xl rounded-2xl border border-paper/10 bg-office-900/90 px-4 pt-3 pb-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-5">
        {/* scrub bar */}
        <div className="flex items-center gap-2">
          <span className="w-9 shrink-0 text-right font-mono-office text-[10px] tabular-nums text-muted">
            {formatTime(elapsed)}
          </span>
          <input
            type="range"
            min={0}
            max={Math.max(displayDuration - 1, 1)}
            value={Math.min(elapsed, displayDuration - 1)}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Seek"
            className="office-range h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
            style={{
              background: `linear-gradient(to right, var(--color-highlighter) ${progressPct}%, rgba(244,239,226,0.15) ${progressPct}%)`,
            }}
          />
          <span className="w-9 shrink-0 font-mono-office text-[10px] tabular-nums text-muted">
            -{formatTime(displayDuration - elapsed)}
          </span>
        </div>

        {/* controls row */}
        <div className="mt-2 flex items-center gap-3">
          <div
            className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg"
            style={{
              background: `linear-gradient(135deg, hsl(${currentTrack.hue} 55% 38%), hsl(${currentTrack.hue} 60% 20%))`,
            }}
            aria-hidden="true"
          >
            {youtubeThumbnail(currentTrack) && (
              <Image
                src={youtubeThumbnail(currentTrack) as string}
                alt=""
                fill
                sizes="44px"
                className={`object-cover ${isPlaying ? "disc-spin" : ""}`}
                unoptimized
              />
            )}
            {isRealAudio && (
              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-highlighter text-office-950">
                <PlayIcon className="h-[7px] w-[7px]" />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-paper">
              {currentTrack.title}
            </p>
            <p className="truncate font-mono-office text-[11px] text-muted">
              {currentTrack.artist}
              {isRealAudio && (
                <span className="ml-1.5 text-highlighter">· real audio</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous track"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-paper-dim transition-colors duration-150 hover:text-paper"
            >
              <PrevIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-highlighter text-office-950 transition-transform duration-150 hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <PauseIcon className="h-[18px] w-[18px]" />
              ) : (
                <PlayIcon className="h-[18px] w-[18px]" />
              )}
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next track"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-paper-dim transition-colors duration-150 hover:text-paper"
            >
              <NextIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="hidden items-center gap-1.5 md:flex">
            <button
              type="button"
              onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
              aria-label={volume > 0 ? "Mute" : "Unmute"}
              className="flex h-8 w-8 cursor-pointer items-center justify-center text-paper-dim transition-colors duration-150 hover:text-paper"
            >
              {volume > 0 ? (
                <VolumeIcon className="h-4 w-4" />
              ) : (
                <VolumeMuteIcon className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
              className="office-range h-1.5 w-20 cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, var(--color-paper-dim) ${
                  volume * 100
                }%, rgba(244,239,226,0.15) ${volume * 100}%)`,
              }}
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleBadge}
              aria-label="Share your badge"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-paper-dim transition-colors duration-150 hover:text-highlighter"
            >
              <BadgeIcon className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              onClick={toggleQueue}
              aria-label="Toggle queue"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-paper-dim transition-colors duration-150 hover:text-highlighter"
            >
              <QueueIcon className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </div>

      <ShortcutsLegend />

      <style jsx global>{`
        .office-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 13px;
          height: 13px;
          border-radius: 999px;
          background: var(--color-highlighter);
          border: 2px solid var(--color-office-950);
          cursor: pointer;
        }
        .office-range::-moz-range-thumb {
          width: 13px;
          height: 13px;
          border-radius: 999px;
          background: var(--color-highlighter);
          border: 2px solid var(--color-office-950);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function ShortcutsLegend() {
  const shortcuts: [string, string][] = [
    ["Space", "play/pause"],
    ["←/→", "seek"],
    ["N/P", "track"],
    ["Q", "queue"],
    ["T", "badge"],
    ["H", "per my last email"],
  ];
  return (
    <div className="mt-2 hidden max-w-2xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-2 font-mono-office text-[10px] tracking-wide text-muted sm:flex">
      {shortcuts.map(([key, label]) => (
        <span key={key} className="flex items-center gap-1.5">
          <kbd className="rounded border border-paper/15 bg-office-900/70 px-1.5 py-0.5 text-paper-dim">
            {key}
          </kbd>
          {label}
        </span>
      ))}
    </div>
  );
}
