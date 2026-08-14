import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { getPlaylistByPath } from "@/lib/playlists";

export const metadata: Metadata = {
  title: "Friday 4PM",
  description:
    "The slowest, holiest hour of the week. Calendar cleared, status set to away.",
};

export default function Friday4pmPage() {
  const playlist = getPlaylistByPath("/friday-4pm");
  return <PageShell playlist={playlist} />;
}
