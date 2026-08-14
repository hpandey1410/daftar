# दफ्तर (Cubicle FM)

> "184 songs of elevator jazz, hold music, and Monday motivation, hand-picked by the guy in Facilities who controls the office speaker system."

A satirical corporate-office music player microsite — the same full-screen, non-stop, tap-to-play mechanic as [busdriver.wtf](https://busdriver.wtf), reskinned as affectionate satire of open-plan office culture instead of a nostalgic Bollywood road trip.

Built with Next.js 16 (App Router) + Tailwind CSS v4.

Shipped under the brand **दफ्तर** (Hindi for "office"), internally still the `cubicle-fm` project/package (renaming the directory, npm package, and file/component names wasn't practical — npm package names can't contain Devanagari or spaces — so the rename is scoped to everywhere the name is actually *displayed*: the wordmark, header, badge, page titles, and share text). Two Devanagari fonts were added specifically for this — **Baloo 2** (bold display, standing in for Anton on the big wordmark) and **Teko** (condensed label font, standing in for Space Mono on small mentions) — see `src/app/layout.tsx`.

## Running it

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## The five required moments

1. **Hero → tap to start audio** — the "Clock In & Play" button in the hero is the user gesture that unlocks the Web Audio context (browsers block true autoplay).
2. **Floating player bar** — docked at the bottom once clocked in: scrub bar, transport controls, volume, badge + queue shortcuts, and the keyboard-shortcut legend (`Space`, `←/→`, `N/P`, `Q`, `T`, `H` — all live).
3. **Queue overlay** — the queue icon expands the compact track list into a full-screen scrollable queue with the category tabs still visible; `X` or `Q` returns to the hero view.
4. **Badge share modal** — the ticket/boarding-pass mechanic reskinned as a corporate ID badge (lanyard clip, department, now-playing, DESK/CLEARANCE/SHIFT ENDS fields randomized per visit, barcode). Uses the Web Share API where available, falls back to copy-link.
5. **Secondary share nudge** — a softer, more emotional prompt ("someone's still stuck in a meeting right now") that surfaces a couple of tracks into a session, once per visit.

## Content-sourcing decisions (please review)

**Track list is real, factual metadata — titles, singers, and film/year credits for 100 popular Hindi film songs (2003–2018), plus a few older tracks included by request** — spanning soft romantic (Elevator), item numbers (Hold Music, played straight-faced as "your call is important"), party anthems (Monday Motivation), dance-floor hits (Friday 4PM), and slower moody picks (Meeting That Should've Been an Email). No lyrics are reproduced anywhere. Every credit was verified via web research (not just recalled from memory) before shipping — a first pass had a meaningful number of misattributed singers and even wrong films, all corrected during verification.

**All 100 tracks play real audio** via the YouTube IFrame Player API (`src/lib/youtube-player.ts`) — each carries a verified official video ID (`youtubeId` on the `Track` type in `src/lib/playlists.ts`) and streams from YouTube's own servers under YouTube's rights agreements; nothing is downloaded or re-hosted here, same mechanism busdriver.wtf itself relies on. Tracks with real audio show a small play-badge on their thumbnail and a "· real audio" label in the player bar. The synth placeholder engine (`src/lib/synth-audio.ts`) is kept in the codebase as an automatic fallback for any track without a `youtubeId`, but every current track has one.

**Every video ID was independently verified twice**, not just trusted from the research pass: once via each track's real YouTube title returned by the [oEmbed API](https://oembed.com) (catching one video with embedding disabled, one accidental duplicate of another track's song, and three titles/credits that turned out not to correspond to any real released song), and again after fixing all five, confirming zero failures and zero duplicate video IDs across the full catalog. The five replacements — **Saathiya** (real title track, 2002, not the fabricated Singh Is Kinng credit), **Salaam-E-Ishq** (renamed from the invented "Signal"), **Piyu Bole** (replacing a duplicate), **Angreji Beat** (renamed from the invented "Pungi"), and **Fashion Khatam Mujhpe** (renamed from the invented "Coca Cola") — are all real, verified songs by singers from the target pool, correctly credited.

**Illustration is original flat-vector SVG**, not a licensed asset — a hand-built cubicle skyline, flickering fluorescent tubes, a spinning ceiling fan, a ticking wall clock, a lone desk lamp with drifting dust motes, a coffee mug with rising steam, a printer feeding a page on a loop, a Roomba patrolling the floor, and a rolling office chair crossing the hero — all continuously animated (respecting `prefers-reduced-motion`), plus a subtle scroll parallax between the background skyline and foreground cubicles. All in `src/components/scene/OfficeScene.tsx`. Track thumbnails are gradient tiles rather than real album artwork.

**Track "posters" are official YouTube video thumbnails**, hotlinked from `i.ytimg.com` (`youtubeThumbnail()` in `src/lib/playlists.ts`) — the same image any YouTube embed or share preview shows, not downloaded or re-hosted. Real album/movie poster art is copyrighted promotional material and isn't something this project sources or ships.

**Favicon** is still the default Next.js icon — swap `src/app/favicon.ico` for a real mark before launch.

**Social share images** (`opengraph-image.tsx`, `twitter-image.tsx`) are dynamically generated at request time via `next/og` and are production-ready as-is, though they currently use system fonts rather than the site's Anton/Space Mono pairing (custom font embedding in `ImageResponse` needs the font file fetched at build time).

## Hero motion design

- **Sonic waveform** (`src/components/ui/sonic-waveform.tsx`) — a canvas-based, pointer-reactive line field, available for reuse elsewhere in the UI (`src/components/ui/sonic-waveform-demo.tsx`), re-tinted live to whichever track is currently playing (`hueToRgb(currentTrack.hue)`).
- **Hero background video** (`public/hero/office-loop.mp4`, wired up in `src/components/hero/Hero.tsx`) — a looping office-floor animation plays behind the wordmark (`autoplay loop muted playsInline`, with a poster frame for the first paint). A radial + vertical scrim sits between the video and the text so **दफ्तर** stays sharply legible regardless of what's happening in the footage behind it.
- **Glow orbs + light-beam sweep** (`src/components/scene/GlowOrbs.tsx`) and a **wordmark shimmer** (`.text-shine` in `globals.css`) for ambient depth on top of the video.
- Mouse-parallax on the office backdrop, plus a subtle animated film-grain overlay across the whole page.
- All of the above respects `prefers-reduced-motion` and uses only `transform`/`opacity` for GPU-friendly performance (the background video is the one exception, being a `<video>` element rather than CSS).

## Share links

Every track has a "share this track" button (list rows) that copies/shares a URL like `/?playlist=hold-music&track=hold-3`. Opening that link seeds the player with that exact track — a small banner in the hero confirms it ("Someone sent you..."). It doesn't autoplay (browsers block audio before a user gesture), but the very next "Clock In & Play" click starts on that track instead of the playlist's default first song.

## What's production-ready

- Full interaction model, keyboard shortcuts, responsive layout (375 → 1440px), reduced-motion handling, focus states, accessible labels.
- Real audio playback for all 100 curated tracks via the YouTube IFrame API (double-verified, zero broken/duplicate video IDs).
- Playlist data model and routing (`src/lib/playlists.ts`) — verified singer/film credits, real video IDs, hotlinked official thumbnails.
- Shareable per-track links.
- Dynamic OG/Twitter images.
- All copy is original (not reused from the reference site).

## What's placeholder / needs your input

- Illustration style is original but intentionally simple flat-vector; a commissioned illustrator pass would raise production quality further.
- "Follow Gary's desk plant" footer social link is a stub `href="#"`.
- The synth placeholder engine (`src/lib/synth-audio.ts`) still exists as an automatic fallback for any track without a `youtubeId` — relevant if you add more curated tracks later without a verified video.
