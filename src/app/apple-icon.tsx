import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same mark as LogoMark in src/components/icons.tsx, scaled up for the iOS
// home-screen tile (which wants a fully opaque square, no transparency).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 11,
          background: "#f5c518",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 22,
            height: 50,
            borderRadius: 8,
            background: "#16140f",
            marginBottom: 22,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 90,
            borderRadius: 8,
            background: "#16140f",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              marginLeft: 6,
              borderTop: "16px solid transparent",
              borderBottom: "16px solid transparent",
              borderLeft: "27px solid #f5c518",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            width: 22,
            height: 67,
            borderRadius: 8,
            background: "#16140f",
            marginBottom: 22,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
