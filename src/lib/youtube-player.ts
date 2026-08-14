// Thin wrapper around the YouTube IFrame Player API. Used only for tracks
// that carry a verified `youtubeId` — playback streams from YouTube's own
// servers under YouTube's rights agreements; nothing is downloaded or
// re-hosted here. See README for which tracks have real audio vs the
// synthesized placeholder.

type YTPlayerState = -1 | 0 | 1 | 2 | 3 | 5;

interface YTPlayerInstance {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(videoId: string): void;
  cueVideoById(videoId: string): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): YTPlayerState;
  destroy(): void;
}

interface YTNamespace {
  Player: new (
    elementId: string,
    options: {
      height?: string | number;
      width?: string | number;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (e: { target: YTPlayerInstance }) => void;
        onStateChange?: (e: { data: YTPlayerState }) => void;
        onError?: (e: { data: number }) => void;
      };
    }
  ) => YTPlayerInstance;
  PlayerState: { ENDED: 0; PLAYING: 1; PAUSED: 2; BUFFERING: 3; CUED: 5 };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT as YTNamespace);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return apiPromise;
}

export class YouTubeEngine {
  private player: YTPlayerInstance | null = null;
  private ready = false;
  private pendingVideoId: string | null = null;
  private pendingAutoplay = false;
  // guards against React StrictMode's dev-only double effect invocation:
  // if this instance is torn down before the async API load resolves, skip
  // creating a Player so we never end up with two Players fighting over
  // the same DOM node
  private aborted = false;
  onEnded: (() => void) | null = null;

  async attach(elementId: string) {
    const YT = await loadYouTubeApi();
    if (this.aborted) return;
    this.player = new YT.Player(elementId, {
      height: "1",
      width: "1",
      playerVars: { controls: 0, disablekb: 1, playsinline: 1 },
      events: {
        onReady: () => {
          this.ready = true;
          if (this.pendingVideoId) {
            this.loadVideo(this.pendingVideoId, this.pendingAutoplay);
            this.pendingVideoId = null;
          }
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED) this.onEnded?.();
        },
      },
    });
  }

  loadVideo(videoId: string, autoplay: boolean) {
    if (!this.ready || !this.player) {
      this.pendingVideoId = videoId;
      this.pendingAutoplay = autoplay;
      return;
    }
    if (autoplay) this.player.loadVideoById(videoId);
    else this.player.cueVideoById(videoId);
  }

  play() {
    this.player?.playVideo();
  }

  pause() {
    this.player?.pauseVideo();
  }

  seekTo(seconds: number) {
    this.player?.seekTo(seconds, true);
  }

  setVolume(v: number) {
    this.player?.setVolume(Math.round(v * 100));
  }

  getCurrentTime(): number {
    if (!this.ready || !this.player) return 0;
    return this.player.getCurrentTime() ?? 0;
  }

  getDuration(): number {
    if (!this.ready || !this.player) return 0;
    return this.player.getDuration() ?? 0;
  }

  destroy() {
    this.aborted = true;
    this.player?.destroy();
    this.player = null;
  }
}
