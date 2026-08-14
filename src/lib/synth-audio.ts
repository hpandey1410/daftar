import { PROGRESSIONS, type TrackSeed } from "./playlists";

// Placeholder audio engine. Generates procedural lounge/muzak-style pad loops
// with the Web Audio API so the player has real, functional audio without
// depending on any licensed or copyrighted recordings. See README for the
// production audio-sourcing decision this stands in for.

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export class SynthEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private activeNodes: AudioNode[] = [];
  private playing = false;
  private volume = 0.7;
  private stepIndex = 0;
  private currentSeed: TrackSeed | null = null;

  private ensureContext() {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.Q.value = 0.6;
      this.filter.connect(this.master);
      this.master.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  async unlock() {
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") await ctx.resume();
  }

  setVolume(v: number) {
    this.volume = Math.min(1, Math.max(0, v));
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  private clearScheduled() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    const now = this.ctx?.currentTime ?? 0;
    this.activeNodes.forEach((node) => {
      try {
        if (node instanceof GainNode) {
          node.gain.cancelScheduledValues(now);
          node.gain.setTargetAtTime(0, now, 0.08);
        }
        if (
          node instanceof OscillatorNode ||
          node instanceof AudioBufferSourceNode
        ) {
          node.stop(now + 0.3);
        }
      } catch {
        // node may already be stopped
      }
    });
    this.activeNodes = [];
  }

  loadTrack(seed: TrackSeed) {
    this.currentSeed = seed;
    this.stepIndex = 0;
    if (this.filter && this.ctx) {
      this.filter.frequency.setTargetAtTime(
        seed.brightness,
        this.ctx.currentTime,
        0.4
      );
    }
    if (this.playing) {
      this.clearScheduled();
      this.scheduleLoop();
    }
  }

  private playChord(freqs: number[], durationSec: number, waveform: OscillatorType) {
    const ctx = this.ctx;
    const filter = this.filter;
    if (!ctx || !filter) return;
    const now = ctx.currentTime;
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = waveform;
      osc.frequency.value = freq;
      osc.detune.value = (i % 2 === 0 ? -1 : 1) * (3 + i);

      const gain = ctx.createGain();
      const peak = 0.16 / Math.sqrt(freqs.length);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.4);
      gain.gain.setTargetAtTime(peak * 0.7, now + durationSec * 0.5, 0.6);
      gain.gain.setTargetAtTime(0, now + durationSec - 0.5, 0.3);

      osc.connect(gain);
      gain.connect(filter);
      osc.start(now);
      osc.stop(now + durationSec + 0.4);

      this.activeNodes.push(osc, gain);
    });

    // a couple of soft plucked "noodling" notes on top, office-sax style
    const sparkleCount = 2;
    for (let s = 0; s < sparkleCount; s++) {
      const delay = (durationSec / sparkleCount) * s + 0.3 + Math.random() * 0.4;
      const freq = freqs[(s + 1) % freqs.length] * 2;
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      const start = now + delay;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.05, start + 0.08);
      gain.gain.setTargetAtTime(0, start + 0.2, 0.4);
      osc.connect(gain);
      gain.connect(filter);
      osc.start(start);
      osc.stop(start + 1.2);
      this.activeNodes.push(osc, gain);
    }
  }

  private scheduleLoop() {
    if (!this.currentSeed) return;
    const seed = this.currentSeed;
    const chords = PROGRESSIONS[seed.progression % PROGRESSIONS.length];
    const chordOffsets = chords[this.stepIndex % chords.length];
    const freqs = chordOffsets.map((offset) =>
      midiToFreq(seed.rootMidi + offset)
    );
    const durationSec = seed.tempoMs / 1000;
    this.playChord(freqs, durationSec + 0.5, seed.waveform);
    this.stepIndex += 1;
    this.timer = setTimeout(() => this.scheduleLoop(), seed.tempoMs);
  }

  async play() {
    await this.unlock();
    if (this.playing) return;
    this.playing = true;
    this.scheduleLoop();
  }

  pause() {
    this.playing = false;
    this.clearScheduled();
  }

  isPlaying() {
    return this.playing;
  }

  dispose() {
    this.clearScheduled();
    this.ctx?.close();
    this.ctx = null;
  }

  // the "Per My Last Email" gag — a chipper little notification chime
  async playNotificationChime() {
    await this.unlock();
    const ctx = this.ctx;
    if (!ctx) return;
    const gain = ctx.createGain();
    gain.gain.value = 0.22;
    gain.connect(ctx.destination);

    const notes = [880, 1174.66, 1567.98];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const noteGain = ctx.createGain();
      const start = ctx.currentTime + i * 0.11;
      noteGain.gain.setValueAtTime(0, start);
      noteGain.gain.linearRampToValueAtTime(0.6, start + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
      osc.connect(noteGain);
      noteGain.connect(gain);
      osc.start(start);
      osc.stop(start + 0.55);
    });
  }
}
