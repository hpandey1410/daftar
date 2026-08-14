import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Same mark as LogoMark in src/components/icons.tsx, rebuilt with plain
// flex/div shapes since ImageResponse (Satori) can't reuse that SVG directly.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 2,
          background: "#f5c518",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 4,
            height: 9,
            borderRadius: 1.5,
            background: "#16140f",
            marginBottom: 4,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 4,
            height: 16,
            borderRadius: 1.5,
            background: "#16140f",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              marginLeft: 1,
              borderTop: "3px solid transparent",
              borderBottom: "3px solid transparent",
              borderLeft: "5px solid #f5c518",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            width: 4,
            height: 12,
            borderRadius: 1.5,
            background: "#16140f",
            marginBottom: 4,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
