"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  PLAYLISTS,
  getPlaylistBySlug,
  type Playlist,
  type Track,
} from "@/lib/playlists";
import { SynthEngine } from "@/lib/synth-audio";
import { YouTubeEngine } from "@/lib/youtube-player";

const YT_ELEMENT_ID = "cubicle-fm-youtube-player";

type PlayerContextValue = {
  playlists: Playlist[];
  activePlaylist: Playlist;
  currentTrack: Track;
  currentIndex: number;
  isPlaying: boolean;
  hasStarted: boolean;
  elapsed: number;
  displayDuration: number;
  isRealAudio: boolean;
  volume: number;
  queueOpen: boolean;
  badgeOpen: boolean;
  nudgeOpen: boolean;
  sessionSeconds: number;
  gagPulse: boolean;
  auxAvatar: { initials: string; hue: number } | null;
  sharedTrack: { playlist: Playlist; track: Track } | null;
  startSession: (playlist: Playlist) => void;
  playFrom: (playlist: Playlist, index: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  seekBy: (delta: number) => void;
  setVolume: (v: number) => void;
  openQueue: () => void;
  closeQueue: () => void;
  toggleQueue: () => void;
  openBadge: () => void;
  closeBadge: () => void;
  toggleBadge: () => void;
  closeNudge: () => void;
  triggerGag: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

const AUX_NAMES = ["YOU", "RM4", "K.J.", "D.P.", "S.T."];

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [activePlaylist, setActivePlaylist] = useState<Playlist>(PLAYLISTS[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [liveDuration, setLiveDuration] = useState<number | null>(null);
  const [volume, setVolumeState] = useState(0.7);
  const [queueOpen, setQueueOpen] = useState(false);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [nudgeOpen, setNudgeOpen] = useState(false);
  const [nudgeShown, setNudgeShown] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [gagPulse, setGagPulse] = useState(false);
  const [auxAvatar, setAuxAvatar] = useState<{
    initials: string;
    hue: number;
  } | null>(null);
  const [trackChangeCount, setTrackChangeCount] = useState(0);
  const [sharedTrack, setSharedTrack] = useState<{
    playlist: Playlist;
    track: Track;
  } | null>(null);

  const engineRef = useRef<SynthEngine | null>(null);
  const youtubeRef = useRef<YouTubeEngine | null>(null);
  const isPlayingRef = useRef(false);
  const youtubeContainerRef = useRef<HTMLDivElement | null>(null);
  // consumed once by the first startSession() call, then cleared
  const seededTrackRef = useRef<{ playlist: Playlist; index: number } | null>(
    null
  );

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    engineRef.current = new SynthEngine();
    const yt = new YouTubeEngine();
    youtubeRef.current = yt;

    // The YouTube IFrame API replaces its target element with an <iframe> via
    // plain DOM APIs, which desyncs React's fiber tree from the real DOM and
    // throws insertBefore/removeChild errors on the next re-render if React
    // owns that node. So React only ever owns a stable, childless wrapper div
    // (below); the actual target div is created and appended imperatively,
    // entirely outside JSX, so React never tries to reconcile it.
    const target = document.createElement("div");
    target.id = YT_ELEMENT_ID;
    youtubeContainerRef.current?.appendChild(target);
    yt.attach(YT_ELEMENT_ID);

    return () => {
      engineRef.current?.dispose();
      youtubeRef.current?.destroy();
      target.remove();
    };
  }, []);

  useEffect(() => {
    // randomize after mount, deliberately, so server and first client
    // render match (SSR can't know who's "on aux" ahead of time)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuxAvatar({
      initials: AUX_NAMES[Math.floor(Math.random() * AUX_NAMES.length)],
      hue: Math.floor(Math.random() * 360),
    });
  }, []);

  // shared-link support: a track link looks like /?playlist=slug&track=id.
  // We can't autoplay it (browsers block audio before a user gesture), so
  // we just seed which track "Clock In & Play" will start on.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const playlistSlug = params.get("playlist");
    const trackId = params.get("track");
    if (!playlistSlug || !trackId) return;
    const playlist = getPlaylistBySlug(playlistSlug);
    const index = playlist?.tracks.findIndex((t) => t.id === trackId) ?? -1;
    if (!playlist || index < 0) return;
    seededTrackRef.current = { playlist, index };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSharedTrack({ playlist, track: playlist.tracks[index] });
  }, []);

  // session clock, counts up from first tap
  useEffect(() => {
    if (!hasStarted) return;
    const t = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [hasStarted]);

  const currentTrack = activePlaylist.tracks[currentIndex];
  const displayDuration = liveDuration ?? currentTrack.duration;
  const isRealAudio = Boolean(currentTrack.youtubeId);

  // routes playback to the YouTube player (real audio) or the synth engine
  // (placeholder), and makes sure only one of the two is ever making sound
  const engineLoad = useCallback((track: Track, autoplay: boolean) => {
    if (track.youtubeId) {
      engineRef.current?.pause();
      youtubeRef.current?.loadVideo(track.youtubeId, autoplay);
    } else {
      youtubeRef.current?.pause();
      engineRef.current?.loadTrack(track.seed);
      if (autoplay) engineRef.current?.play();
    }
  }, []);

  const enginePlay = useCallback((track: Track) => {
    if (track.youtubeId) {
      engineRef.current?.pause();
      youtubeRef.current?.play();
    } else {
      youtubeRef.current?.pause();
      engineRef.current?.play();
    }
  }, []);

  const enginePause = useCallback((track: Track) => {
    if (track.youtubeId) youtubeRef.current?.pause();
    else engineRef.current?.pause();
  }, []);

  // keep the YouTube "ended" callback pointed at the current advance()
  const advance = useCallback(
    (direction: 1 | -1) => {
      const len = activePlaylist.tracks.length;
      const nextIndex = (currentIndex + direction + len) % len;
      setCurrentIndex(nextIndex);
      setElapsed(0);
      setLiveDuration(null);
      setTrackChangeCount((c) => c + 1);
      engineLoad(activePlaylist.tracks[nextIndex], isPlayingRef.current);
    },
    [activePlaylist, currentIndex, engineLoad]
  );

  useEffect(() => {
    if (youtubeRef.current) {
      youtubeRef.current.onEnded = () => advance(1);
    }
  }, [advance]);

  // elapsed clock: real time for YouTube tracks, simulated tick for synth
  useEffect(() => {
    if (!isPlaying) return;
    const track = currentTrack;
    const t = setInterval(() => {
      if (track.youtubeId) {
        const cur = youtubeRef.current?.getCurrentTime() ?? 0;
        const dur = youtubeRef.current?.getDuration() ?? 0;
        setElapsed(cur);
        if (dur > 0) {
          setLiveDuration((prev) => (prev === dur ? prev : dur));
        }
      } else {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= track.duration) {
            queueMicrotask(() => advance(1));
            return 0;
          }
          return next;
        });
      }
    }, 1000);
    return () => clearInterval(t);
  }, [isPlaying, currentTrack, advance]);

  // soft share-nudge trigger: after a couple of track changes, once per session
  useEffect(() => {
    if (trackChangeCount >= 2 && hasStarted && !nudgeShown) {
      const t = setTimeout(() => {
        setNudgeOpen(true);
        setNudgeShown(true);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [trackChangeCount, hasStarted, nudgeShown]);

  const startSession = useCallback(
    (playlist: Playlist) => {
      const seeded = seededTrackRef.current;
      const targetPlaylist = seeded?.playlist ?? playlist;
      const targetIndex = seeded?.index ?? 0;
      seededTrackRef.current = null;
      setSharedTrack(null);
      setActivePlaylist(targetPlaylist);
      setCurrentIndex(targetIndex);
      setElapsed(0);
      setLiveDuration(null);
      setHasStarted(true);
      setIsPlaying(true);
      engineLoad(targetPlaylist.tracks[targetIndex], true);
    },
    [engineLoad]
  );

  const playFrom = useCallback(
    (playlist: Playlist, index: number) => {
      setActivePlaylist(playlist);
      setCurrentIndex(index);
      setElapsed(0);
      setLiveDuration(null);
      setIsPlaying(true);
      setHasStarted(true);
      setTrackChangeCount((c) => c + 1);
      engineLoad(playlist.tracks[index], true);
    },
    [engineLoad]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => {
      const next = !p;
      if (next) enginePlay(currentTrack);
      else enginePause(currentTrack);
      return next;
    });
  }, [currentTrack, enginePlay, enginePause]);

  const next = useCallback(() => advance(1), [advance]);
  const prev = useCallback(() => advance(-1), [advance]);

  const seek = useCallback(
    (seconds: number) => {
      const clamped = Math.min(Math.max(0, seconds), displayDuration - 1);
      setElapsed(clamped);
      if (currentTrack.youtubeId) youtubeRef.current?.seekTo(clamped);
    },
    [currentTrack, displayDuration]
  );

  const seekBy = useCallback(
    (delta: number) => {
      setElapsed((e) => {
        const clamped = Math.min(Math.max(0, e + delta), displayDuration - 1);
        if (currentTrack.youtubeId) youtubeRef.current?.seekTo(clamped);
        return clamped;
      });
    },
    [currentTrack, displayDuration]
  );

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    engineRef.current?.setVolume(v);
    youtubeRef.current?.setVolume(v);
  }, []);

  const openQueue = useCallback(() => setQueueOpen(true), []);
  const closeQueue = useCallback(() => setQueueOpen(false), []);
  const toggleQueue = useCallback(() => setQueueOpen((v) => !v), []);
  const openBadge = useCallback(() => setBadgeOpen(true), []);
  const closeBadge = useCallback(() => setBadgeOpen(false), []);
  const toggleBadge = useCallback(() => setBadgeOpen((v) => !v), []);
  const closeNudge = useCallback(() => setNudgeOpen(false), []);

  const triggerGag = useCallback(() => {
    engineRef.current?.playNotificationChime();
    setGagPulse(true);
    setTimeout(() => setGagPulse(false), 700);
  }, []);

  // global keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!hasStarted) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.code === "Space" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        togglePlay();
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          seekBy(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          seekBy(10);
          break;
        case "n":
        case "N":
          next();
          break;
        case "p":
        case "P":
          prev();
          break;
        case "q":
        case "Q":
          toggleQueue();
          break;
        case "t":
        case "T":
          toggleBadge();
          break;
        case "h":
        case "H":
          triggerGag();
          break;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    hasStarted,
    togglePlay,
    seekBy,
    next,
    prev,
    toggleQueue,
    toggleBadge,
    triggerGag,
  ]);

  const value = useMemo<PlayerContextValue>(
    () => ({
      playlists: PLAYLISTS,
      activePlaylist,
      currentTrack,
      currentIndex,
      isPlaying,
      hasStarted,
      elapsed,
      displayDuration,
      isRealAudio,
      volume,
      queueOpen,
      badgeOpen,
      nudgeOpen,
      sessionSeconds,
      gagPulse,
      auxAvatar,
      sharedTrack,
      startSession,
      playFrom,
      togglePlay,
      next,
      prev,
      seek,
      seekBy,
      setVolume,
      openQueue,
      closeQueue,
      toggleQueue,
      openBadge,
      closeBadge,
      toggleBadge,
      closeNudge,
      triggerGag,
    }),
    [
      activePlaylist,
      currentTrack,
      currentIndex,
      isPlaying,
      hasStarted,
      elapsed,
      displayDuration,
      isRealAudio,
      volume,
      queueOpen,
      badgeOpen,
      nudgeOpen,
      sessionSeconds,
      gagPulse,
      auxAvatar,
      sharedTrack,
      startSession,
      playFrom,
      togglePlay,
      next,
      prev,
      seek,
      seekBy,
      setVolume,
      openQueue,
      closeQueue,
      toggleQueue,
      openBadge,
      closeBadge,
      toggleBadge,
      closeNudge,
      triggerGag,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <div
        ref={youtubeContainerRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: -9999,
          top: -9999,
          width: 2,
          height: 2,
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
