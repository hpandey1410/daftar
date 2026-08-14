"use client";

import { useState } from "react";
import Image from "next/image";
import { usePlayer } from "@/components/player/PlayerProvider";
import type { Playlist, Track } from "@/lib/playlists";
import { formatTime, shareUrlFor, youtubeThumbnail } from "@/lib/playlists";
import { BadgeIcon, PlayIcon, ShareIcon } from "@/components/icons";

function NowPlayingBars() {
  return (
    <span className="flex h-4 w-4 items-end justify-center gap-[2px]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-highlighter"
          style={{
            animation: `bar-bounce 0.9s ${i * 0.15}s ease-in-out infinite`,
            height: "40%",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes bar-bounce {
          0%,
          100% {
            height: 30%;
          }
          50% {
            height: 100%;
          }
        }
      `}</style>
    </span>
  );
}

function TrackThumbnail({ track, spinning }: { track: Track; spinning?: boolean }) {
  const thumb = youtubeThumbnail(track);
  return (
    <span
      className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg"
      style={{
        background: `linear-gradient(135deg, hsl(${track.hue} 55% 38%), hsl(${track.hue} 60% 20%))`,
      }}
    >
      {thumb && (
        <Image
          src={thumb}
          alt=""
          fill
          sizes="40px"
          className={`object-cover ${spinning ? "disc-spin" : ""}`}
          unoptimized
        />
      )}
      {track.youtubeId && (
        <span
          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-highlighter text-office-950"
          title="Real audio"
        >
          <PlayIcon className="h-[7px] w-[7px]" />
        </span>
      )}
    </span>
  );
}

export function TrackListCard({
  playlist,
  variant = "compact",
}: {
  playlist: Playlist;
  variant?: "compact" | "expanded";
}) {
  const {
    activePlaylist,
    currentIndex,
    hasStarted,
    isPlaying,
    playFrom,
    openBadge,
  } = usePlayer();
  const [copiedTrackId, setCopiedTrackId] = useState<string | null>(null);

  async function handleShare(e: React.MouseEvent, track: Track) {
    e.stopPropagation();
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${shareUrlFor(playlist, track)}`
        : shareUrlFor(playlist, track);
    const text = `Listen to "${track.title}" on दफ्तर`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "दफ्तर", text, url });
      } catch {
        // user cancelled share sheet
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiedTrackId(track.id);
      setTimeout(() => setCopiedTrackId((id) => (id === track.id ? null : id)), 1800);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div
      className={`rise-fade relative z-10 mx-auto flex w-full max-w-xl flex-col rounded-2xl border border-paper/10 bg-office-900/85 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-md ${
        variant === "expanded" ? "flex-1 overflow-hidden" : ""
      }`}
    >
      <div className="flex items-center justify-between px-5 pt-4">
        <div>
          <p className="font-display text-xl tracking-tight text-paper">
            {playlist.name}
          </p>
          <p className="font-mono-office text-[10px] uppercase tracking-wide text-muted">
            {playlist.tracks.length} tracks · non-stop
          </p>
        </div>
      </div>

      <ul
        className={`scrollbar-thin mt-2 flex flex-col gap-0.5 overflow-y-auto px-2 ${
          variant === "expanded" ? "flex-1" : "max-h-[320px]"
        }`}
      >
        {playlist.tracks.map((track, index) => {
          const isActive =
            hasStarted &&
            activePlaylist.slug === playlist.slug &&
            currentIndex === index;
          return (
            <li key={track.id}>
              <div
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 ${
                  isActive ? "bg-highlighter/15" : "hover:bg-paper/5"
                }`}
              >
                <button
                  type="button"
                  onClick={() => playFrom(playlist, index)}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                >
                  <span className="flex w-6 shrink-0 items-center justify-center font-mono-office text-xs text-muted">
                    {isActive ? <NowPlayingBars /> : index + 1}
                  </span>
                  <TrackThumbnail track={track} spinning={isActive && isPlaying} />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-sm font-semibold ${
                        isActive ? "text-highlighter" : "text-paper"
                      }`}
                    >
                      {track.title}
                    </span>
                    <span className="block truncate font-mono-office text-[11px] text-muted">
                      {track.artist}
                    </span>
                  </span>
                </button>
                <span className="shrink-0 font-mono-office text-[11px] tabular-nums text-muted">
                  {formatTime(track.duration)}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleShare(e, track)}
                  aria-label={`Share ${track.title}`}
                  title={copiedTrackId === track.id ? "Link copied" : "Share this track"}
                  className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted opacity-0 transition-opacity duration-150 hover:text-highlighter focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <ShareIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="shrink-0 border-t border-paper/10 px-2 py-2">
        <button
          type="button"
          onClick={openBadge}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-dashed border-highlighter/30 px-3 py-3 text-left text-highlighter transition-colors duration-150 hover:bg-highlighter/10"
        >
          <span className="flex w-6 shrink-0 items-center justify-center">
            <BadgeIcon className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold">Share your badge</span>
        </button>
      </div>
    </div>
  );
}
