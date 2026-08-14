import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { getPlaylistByPath } from "@/lib/playlists";

export const metadata: Metadata = {
  title: "Hold Music",
  description:
    "Your call is very important to us. Please stay on the line for a playlist that never quite resolves.",
};

export default function HoldMusicPage() {
  const playlist = getPlaylistByPath("/hold-music");
  return <PageShell playlist={playlist} />;
}
