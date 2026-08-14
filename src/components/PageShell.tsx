"use client";

import type { Playlist } from "@/lib/playlists";
import { OfficeScene } from "@/components/scene/OfficeScene";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { PlaylistTabs } from "@/components/tracklist/PlaylistTabs";
import { TrackListCard } from "@/components/tracklist/TrackListCard";
import { QueueOverlay } from "@/components/tracklist/QueueOverlay";
import { PlayerBar } from "@/components/player/PlayerBar";
import { BadgeModal } from "@/components/modals/BadgeModal";
import { ShareNudge } from "@/components/modals/ShareNudge";

export function PageShell({ playlist }: { playlist: Playlist }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <OfficeScene />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-office-950/10 via-office-950/40 to-office-950" />
      <div
        className="grain-layer pointer-events-none fixed inset-0 z-[5] opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "120px 120px",
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-1 flex-col">
        <Header />
        <Hero playlist={playlist} />

        <div className="mt-8 flex flex-col gap-4 pb-2">
          <PlaylistTabs />
          <div className="px-4 sm:px-6">
            <TrackListCard playlist={playlist} />
          </div>
        </div>

        <Footer />
      </div>

      <PlayerBar />
      <QueueOverlay playlist={playlist} />
      <BadgeModal />
      <ShareNudge />
    </div>
  );
}
