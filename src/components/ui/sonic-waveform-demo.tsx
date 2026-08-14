import { SonicWaveformCanvas } from "@/components/ui/sonic-waveform";

// Standalone demo of the waveform canvas on its own, matching the
// shadcn-style demo convention. The real integration lives behind the
// hero wordmark in src/components/hero/Hero.tsx, colored live from
// whichever track is currently playing rather than a fixed teal.
export default function SonicWaveformDemo() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      <SonicWaveformCanvas colorRgb={[0, 255, 192]} />
    </main>
  );
}
