import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { getPlaylistByPath } from "@/lib/playlists";

export const metadata: Metadata = {
  title: "Monday Motivation",
  description:
    "Fake energy for a real 9am standup. Synergy, KPIs, and low-hanging fruit, set to music.",
};

export default function MondayMotivationPage() {
  const playlist = getPlaylistByPath("/monday-motivation");
  return <PageShell playlist={playlist} />;
}
