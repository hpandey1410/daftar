"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PLAYLISTS } from "@/lib/playlists";

export function PlaylistTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Playlist categories"
      className="scrollbar-thin relative z-20 flex gap-2 overflow-x-auto px-4 pb-1 sm:justify-center sm:px-6"
    >
      {PLAYLISTS.map((p) => {
        const active = pathname === p.path;
        return (
          <Link
            key={p.slug}
            href={p.path}
            className={`shrink-0 rounded-full border px-4 py-2 font-mono-office text-[11px] font-bold uppercase tracking-wide transition-colors duration-200 ${
              active
                ? "border-highlighter bg-highlighter text-office-950"
                : "border-paper/15 bg-office-900/60 text-paper-dim hover:border-paper/30 hover:text-paper"
            }`}
          >
            {p.shortLabel}
          </Link>
        );
      })}
    </nav>
  );
}
