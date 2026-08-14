"use client";

import React, { useEffect, useRef } from "react";

export type SonicWaveformCanvasProps = {
  /** RGB triplet the wave lines animate towards, e.g. [0, 255, 192] */
  colorRgb?: [number, number, number];
  className?: string;
};

// convert an HSL hue (0-360, our track palette's format) to an RGB triplet
export function hueToRgb(hue: number, saturation = 70, lightness = 55): [number, number, number] {
  const s = saturation / 100;
  const l = lightness / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

// Sonic Waveform Canvas — audio-visualizer-style animated line field that
// reacts to pointer position. Color smoothly lerps toward `colorRgb` so it
// can be re-tinted live (e.g. to match whatever track is currently playing)
// without a jarring snap.
export function SonicWaveformCanvas({
  colorRgb = [0, 255, 192],
  className,
}: SonicWaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const targetColorRef = useRef<[number, number, number]>(colorRgb);
  const currentColorRef = useRef<[number, number, number]>(colorRgb);

  useEffect(() => {
    targetColorRef.current = colorRgb;
  }, [colorRgb]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    const mouse = { x: 0, y: 0 };
    let time = 0;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = canvas.width = rect?.width ?? window.innerWidth;
      height = canvas.height = rect?.height ?? window.innerHeight;
      mouse.x = width / 2;
      mouse.y = height / 2;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // lerp the live color toward the target track color each frame
      const cur = currentColorRef.current;
      const tgt = targetColorRef.current;
      currentColorRef.current = [
        cur[0] + (tgt[0] - cur[0]) * 0.03,
        cur[1] + (tgt[1] - cur[1]) * 0.03,
        cur[2] + (tgt[2] - cur[2]) * 0.03,
      ];
      const [r, g, b] = currentColorRef.current;

      const lineCount = 34;
      const segmentCount = 64;
      const mid = height / 2;

      for (let i = 0; i < lineCount; i++) {
        ctx.beginPath();
        const progress = i / lineCount;
        const colorIntensity = Math.sin(progress * Math.PI);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${colorIntensity * 0.45})`;
        ctx.lineWidth = 1.4;

        for (let j = 0; j <= segmentCount; j++) {
          const x = (j / segmentCount) * width;
          const distToMouse = Math.hypot(x - mouse.x, mid - mouse.y);
          const mouseEffect = Math.max(0, 1 - distToMouse / 420);

          const noise = Math.sin(j * 0.12 + time + i * 0.22) * 14;
          const spike =
            Math.cos(j * 0.2 + time + i * 0.1) *
            Math.sin(j * 0.05 + time) *
            32;
          const y = mid + noise + spike * (1 + mouseEffect * 1.6);

          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      if (!reduceMotion) time += 0.016;
      animationFrameId = requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const ro = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    resizeCanvas();
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? "absolute inset-0 h-full w-full"}
    />
  );
}
