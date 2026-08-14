import { ImageResponse } from "next/og";
import { TOTAL_TRACK_COUNT } from "@/lib/playlists";
import { loadGoogleFont } from "@/lib/og-font";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const WORDMARK = "दफ्तर";

export default async function Image() {
  const baloo2 = await loadGoogleFont("Baloo 2", 800, WORDMARK);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(160deg, #16140f 0%, #1c1811 55%, #221d15 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 56,
            left: 64,
            fontSize: 22,
            letterSpacing: 4,
            color: "#f5c518",
            fontWeight: 700,
          }}
        >
          FLOOR 4 · MON–FRI
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            color: "#f5c518",
            marginBottom: 18,
          }}
        >
          {TOTAL_TRACK_COUNT} SONGS · NEVER CLOCKS OUT
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 200,
            fontFamily: "Baloo 2",
            color: "#f4efe2",
            lineHeight: 1,
          }}
        >
          {WORDMARK}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 3,
            color: "#cfc7b3",
            marginTop: 26,
          }}
        >
          NON-STOP SINCE THE LAST RE-ORG
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Baloo 2", data: baloo2, weight: 800, style: "normal" }],
    }
  );
}
