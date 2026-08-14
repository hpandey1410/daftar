import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { getPlaylistByPath } from "@/lib/playlists";

export const metadata: Metadata = {
  title: "Elevator",
  description:
    "For the 40 seconds between lobby and Floor 4. Smooth, forgettable, strangely comforting elevator muzak.",
};

export default function ElevatorPage() {
  const playlist = getPlaylistByPath("/elevator");
  return <PageShell playlist={playlist} />;
}
