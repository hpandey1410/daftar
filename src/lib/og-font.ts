// next/og's ImageResponse (Satori) doesn't pick up next/font automatically —
// it needs a font file handed to it as raw bytes. This fetches just the
// glyphs actually used (via Google's `text` subsetting param) from Google
// Fonts' CSS2 endpoint and pulls out the TTF url Satori can parse.
export async function loadGoogleFont(
  family: string,
  weight: number,
  text: string
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);
  if (match) {
    const res = await fetch(match[1]);
    if (res.ok) return res.arrayBuffer();
  }
  throw new Error(`Failed to load font data for ${family}`);
}
