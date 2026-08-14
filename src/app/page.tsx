import { PageShell } from "@/components/PageShell";
import { getPlaylistByPath } from "@/lib/playlists";

export default function Home() {
  const playlist = getPlaylistByPath("/");
  return <PageShell playlist={playlist} />;
}
