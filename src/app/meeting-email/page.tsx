import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { getPlaylistByPath } from "@/lib/playlists";

export const metadata: Metadata = {
  title: "Meeting That Should've Been an Email",
  description:
    "47 minutes, zero action items. The playlist for meetings that could have been one Slack message.",
};

export default function MeetingEmailPage() {
  const playlist = getPlaylistByPath("/meeting-email");
  return <PageShell playlist={playlist} />;
}
