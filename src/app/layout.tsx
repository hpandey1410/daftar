import type { Metadata, Viewport } from "next";
import { Anton, Baloo_2, Epilogue, Space_Mono, Teko } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/components/player/PlayerProvider";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Devanagari wordmark fonts — मूल Latin display/mono pairing (Anton /
// Space Mono) has no Devanagari glyphs, so दफ्तर gets its own matching pair:
// Baloo 2 (bold, high-impact) stands in for Anton on the big wordmark; Teko
// (condensed, technical) stands in for Space Mono on small label mentions.
const baloo2 = Baloo_2({
  variable: "--font-baloo2",
  subsets: ["devanagari", "latin"],
  weight: ["600", "700", "800"],
});

const teko = Teko({
  variable: "--font-teko",
  subsets: ["devanagari", "latin"],
  weight: ["500", "600", "700"],
});

const SITE_URL = "https://daftarco.in";
const TITLE = "दफ्तर — the office playlist that never clocks out";
const DESCRIPTION =
  "184 songs of elevator jazz, hold music and Monday motivation, hand-picked by the guy in Facilities who controls the office speaker system. Non-stop, no notice period.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — दफ्तर",
  },
  description: DESCRIPTION,
  keywords: [
    "office playlist",
    "corporate meme site",
    "cubicle music",
    "work from home playlist",
    "elevator music playlist",
    "hold music playlist",
    "funny office site",
  ],
  applicationName: "दफ्तर",
  authors: [{ name: "दफ्तर" }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "दफ्तर — Floor 4, Conference Rm B",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16140f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${epilogue.variable} ${spaceMono.variable} ${baloo2.variable} ${teko.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-office-950 text-paper">
        <PlayerProvider>{children}</PlayerProvider>
      </body>
    </html>
  );
}
