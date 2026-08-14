export function GlowOrbs() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="orb-drift-a absolute left-[8%] top-[6%] h-[38vw] w-[38vw] max-h-80 max-w-80 rounded-full opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(245,197,24,0.55) 0%, rgba(245,197,24,0) 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="orb-drift-b absolute right-[6%] top-[18%] h-[30vw] w-[30vw] max-h-72 max-w-72 rounded-full opacity-30 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(143,211,232,0.55) 0%, rgba(143,211,232,0) 70%)",
          filter: "blur(44px)",
        }}
      />
      <div
        className="orb-drift-c absolute left-[38%] top-[2%] h-[26vw] w-[26vw] max-h-64 max-w-64 rounded-full opacity-25 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(245,197,24,0.4) 0%, rgba(245,197,24,0) 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        <div
          className="beam-sweep absolute -top-1/4 left-0 h-[150%] w-1/3"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.05) 55%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>
    </div>
  );
}
