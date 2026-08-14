"use client";

import { useEffect, useRef } from "react";

const CUBICLE_COUNT = 16;

// integer-only PRNG (mulberry32) — avoids Math.sin, whose transcendental
// implementation can differ by a few ULPs between Node and browser V8 and
// would otherwise cause SSR/client hydration mismatches on the generated layout
function seededRandom(seed: number) {
  let t = (Math.floor(seed * 1000) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function OfficeScene() {
  const skylineRef = useRef<SVGGElement>(null);
  const foregroundRef = useRef<SVGGElement>(null);

  // subtle scroll + pointer parallax on the backdrop layers — skipped
  // entirely under prefers-reduced-motion, driven off rAF so it never
  // fights scrolling, and pointer parallax only on fine-pointer (desktop)
  // devices so it never fires from touch scrolling on mobile
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const canHover = window.matchMedia("(pointer: fine)").matches;
    let raf = 0;
    let scrollY = 0;
    let pointerX = 0;
    let pointerY = 0;

    function apply() {
      if (skylineRef.current) {
        skylineRef.current.style.transform = `translate(${pointerX * 0.6}px, ${
          scrollY * 0.035 + pointerY * 0.6
        }px)`;
      }
      if (foregroundRef.current) {
        foregroundRef.current.style.transform = `translate(${pointerX * 1.4}px, ${
          scrollY * 0.09 + pointerY * 1.4
        }px)`;
      }
    }

    function onScroll() {
      scrollY = window.scrollY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    }

    function onPointerMove(e: PointerEvent) {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      pointerX = nx * -14;
      pointerY = ny * -10;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    if (canHover) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (canHover) window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const cubicles = Array.from({ length: CUBICLE_COUNT }, (_, i) => {
    const r1 = seededRandom(i * 7.1 + 1);
    const r2 = seededRandom(i * 3.7 + 2);
    const width = 92 + r1 * 20;
    const height = 120 + r2 * 60;
    const lit = seededRandom(i * 11.3) > 0.8;
    return { width, height, lit, key: i };
  });

  let cursorX = -40;
  const positioned = cubicles.map((c) => {
    const x = cursorX;
    cursorX += c.width + 6;
    return { ...c, x };
  });
  const totalWidth = cursorX;

  return (
    <div className="fixed inset-0 overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b0a08" />
            <stop offset="55%" stopColor="#151209" />
            <stop offset="100%" stopColor="#1c1811" />
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#100e0a" />
            <stop offset="100%" stopColor="#050403" />
          </linearGradient>
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f5c518" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f5c518" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8fd3e8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8fd3e8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tubeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e9e4d3" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#e9e4d3" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e9e4d3" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1600" height="900" fill="url(#sky)" />

        {/* ceiling truss + fluorescent tubes */}
        <g>
          <rect x="0" y="0" width="1600" height="6" fill="#2a251c" />
          {Array.from({ length: 7 }).map((_, i) => (
            <rect
              key={i}
              x={40 + i * 230}
              y={18}
              width={140}
              height={7}
              rx={3}
              fill="url(#tubeGrad)"
              className={i === 2 || i === 5 ? "flicker" : ""}
              style={i === 5 ? { animationDelay: "-2.4s" } : undefined}
            />
          ))}
        </g>

        {/* ceiling fan, continuously spinning */}
        <g transform="translate(870, 60)">
          <circle r="6" fill="#3a3325" />
          <g className="fan-spin">
            {[0, 90, 180, 270].map((deg) => (
              <ellipse
                key={deg}
                cx="0"
                cy="0"
                rx="38"
                ry="7"
                fill="#2a251c"
                opacity="0.85"
                transform={`rotate(${deg})`}
              />
            ))}
          </g>
        </g>

        {/* wall clock, continuously ticking */}
        <g transform="translate(1460, 95)">
          <circle r="26" fill="#1c1811" stroke="#3a3325" strokeWidth="3" />
          <line x1="0" y1="0" x2="0" y2="-13" stroke="#cfc7b3" strokeWidth="2.5" strokeLinecap="round" transform="rotate(40)" />
          <line x1="0" y1="0" x2="0" y2="-17" stroke="#cfc7b3" strokeWidth="2" strokeLinecap="round" transform="rotate(160)" />
          <g className="clock-tick">
            <line x1="0" y1="0" x2="0" y2="-20" stroke="#f5c518" strokeWidth="1.2" strokeLinecap="round" />
          </g>
          <circle r="2" fill="#f5c518" />
        </g>

        {/* distant skyline of cubicle partitions */}
        <g ref={skylineRef} opacity="0.55">
          {positioned.map((c) => (
            <rect
              key={`back-${c.key}`}
              x={((c.x + 40) * 1.15) % 1650}
              y={620 - c.height * 0.6}
              width={c.width * 0.9}
              height={c.height * 0.6}
              fill="#1c1811"
            />
          ))}
        </g>

        {/* foreground cubicle row */}
        <g ref={foregroundRef} transform="translate(0, 40)">
          <svg viewBox={`0 0 ${totalWidth} 900`} width="1600" height="900" x="0" y="0">
            {positioned.map((c) => (
              <g key={c.key}>
                <rect
                  x={c.x}
                  y={640 - c.height}
                  width={c.width}
                  height={c.height}
                  fill="#221d15"
                  stroke="#332b1e"
                  strokeWidth={2}
                />
                {/* desk surface */}
                <rect
                  x={c.x + 8}
                  y={620 - c.height * 0.25}
                  width={c.width - 16}
                  height={10}
                  fill="#141110"
                />
                {c.lit && (
                  <>
                    <circle
                      cx={c.x + c.width / 2}
                      cy={600 - c.height * 0.25}
                      r={46}
                      fill="url(#screenGlow)"
                    />
                    <rect
                      x={c.x + c.width / 2 - 18}
                      y={608 - c.height * 0.25}
                      width={36}
                      height={24}
                      rx={2}
                      fill="#0d3440"
                      stroke="#8fd3e8"
                      strokeOpacity={0.6}
                    />
                  </>
                )}
              </g>
            ))}

            {/* printer, continuously feeding a page */}
            <g transform="translate(430, 560)">
              <rect x="-32" y="8" width="64" height="30" rx="3" fill="#2a251c" stroke="#3a3325" strokeWidth="2" />
              <rect x="-24" y="0" width="48" height="10" rx="2" fill="#1c1811" />
              <rect
                className="printer-feed"
                x="-18"
                y="-28"
                width="36"
                height="30"
                fill="#e9e4d3"
                opacity="0.9"
              />
            </g>

            {/* coffee mug with rising steam */}
            <g transform="translate(720, 592)">
              <path d="M-12 0h24v14a12 12 0 0 1-24 0Z" fill="#2a251c" stroke="#3a3325" strokeWidth="1.5" />
              <path d="M12 4c8-2 8 12 0 10" fill="none" stroke="#3a3325" strokeWidth="2" />
              {[-5, 0, 5].map((dx, i) => (
                <path
                  key={dx}
                  className="steam-rise"
                  d={`M${dx} -2c-4 -6 4 -8 0 -14`}
                  fill="none"
                  stroke="#cfc7b3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ animationDelay: `${i * 0.9}s` }}
                />
              ))}
            </g>
          </svg>
        </g>

        {/* lone lit desk lamp, foreground hero moment */}
        <g transform="translate(1180, 560)">
          <circle cx="0" cy="0" r="120" fill="url(#lampGlow)" />
          <rect x="-6" y="0" width="12" height="70" fill="#2a251c" />
          <path d="M -34 -6 L 34 -6 L 18 -42 L -18 -42 Z" fill="#f5c518" opacity="0.9" />
          <rect x="-46" y="60" width="92" height="14" rx="3" fill="#1c1811" />

          {/* dust motes drifting through the lamp light */}
          {[
            { x: -30, y: -10, dx: 14, delay: 0 },
            { x: 10, y: -20, dx: -10, delay: 1.4 },
            { x: -12, y: 6, dx: 18, delay: 2.7 },
            { x: 26, y: -4, dx: -16, delay: 4.1 },
            { x: 0, y: 12, dx: 8, delay: 5.3 },
          ].map((mote, i) => (
            <circle
              key={i}
              className="dust-drift"
              cx={mote.x}
              cy={mote.y}
              r="1.6"
              fill="#f5e6b8"
              style={{
                animationDelay: `${mote.delay}s`,
                ["--dust-dx" as string]: `${mote.dx}px`,
              }}
            />
          ))}
        </g>

        <rect x="0" y="640" width="1600" height="260" fill="url(#floor)" />

        {/* roomba, patrolling back and forth all night */}
        <g transform="translate(1280, 830)">
          <g className="roomba-patrol">
            <ellipse cx="0" cy="4" rx="24" ry="6" fill="#000" opacity="0.3" />
            <g className="roomba-spin">
              <circle r="18" fill="#2a251c" stroke="#3a3325" strokeWidth="2" />
              <circle r="5" fill="#f5c518" opacity="0.8" />
            </g>
          </g>
        </g>
      </svg>

      {/* rolling office chair crossing the scene, bus-driver style */}
      <div
        className="roll-across absolute bottom-[6%] left-0 w-[9vw] max-w-[130px] min-w-[80px] opacity-90"
        style={{ animationDelay: "-6s" }}
      >
        <RollingChair />
      </div>
    </div>
  );
}

function RollingChair() {
  return (
    <svg viewBox="0 0 140 140" className="h-auto w-full drop-shadow-[0_8px_10px_rgba(0,0,0,0.5)]">
      <ellipse cx="70" cy="128" rx="46" ry="7" fill="#000" opacity="0.35" />
      <rect x="42" y="46" width="46" height="10" rx="4" fill="#3a3325" />
      <path d="M40 30 Q70 14 100 30 L96 58 Q70 46 44 58 Z" fill="#f5c518" />
      <rect x="60" y="56" width="20" height="30" fill="#2a251c" />
      <g stroke="#2a251c" strokeWidth="5" strokeLinecap="round">
        <line x1="70" y1="86" x2="35" y2="112" />
        <line x1="70" y1="86" x2="105" y2="112" />
        <line x1="70" y1="86" x2="70" y2="118" />
        <line x1="70" y1="86" x2="45" y2="70" />
        <line x1="70" y1="86" x2="95" y2="70" />
      </g>
      {[35, 105, 70, 45, 95].map((cx, i) => (
        <circle
          key={i}
          cx={cx}
          cy={i === 2 ? 122 : i < 2 ? 116 : 74}
          r="6"
          fill="#111"
        />
      ))}
    </svg>
  );
}
