"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import type { Playlist } from "@/lib/playlists";
import { CloseIcon } from "@/components/icons";
import { PlaylistTabs } from "./PlaylistTabs";
import { TrackListCard } from "./TrackListCard";

export function QueueOverlay({ playlist }: { playlist: Playlist }) {
  const { queueOpen, closeQueue } = usePlayer();

  if (!queueOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-office-950/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 pt-4 sm:px-6">
        <p className="font-display text-2xl tracking-tight text-paper">
          Queue
        </p>
        <button
          type="button"
          onClick={closeQueue}
          aria-label="Close queue"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-paper/15 bg-office-900/70 text-paper transition-colors duration-150 hover:border-highlighter/40 hover:text-highlighter"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4">
        <PlaylistTabs />
      </div>

      <div className="mt-4 flex flex-1 flex-col overflow-hidden px-4 pb-40 sm:px-6">
        <TrackListCard playlist={playlist} variant="expanded" />
      </div>
    </div>
  );
}
