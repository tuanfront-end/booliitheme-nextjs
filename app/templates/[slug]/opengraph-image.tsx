import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { industries, priceOf, projects } from "@/lib/data/projects";
import { ogSize } from "@/lib/og/size";

// A template's own share card: its name and what it is on the panel's tint,
// and its two live captures drawn the way the site's cards draw them — the
// desktop in a window cut by the card's foot, the phone standing over the
// window's end with the deep shadow that lifts it off. A link to Waypoint shows
// Waypoint, not the site's card.
//
// Built once per template at build time. The captures are read off disk by
// the names `npm run shots` writes them under; a template with no live capture
// gets the site's own card instead of a half-drawn one.

export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// The tokens of app/globals.css, written out in sRGB: the renderer reads no
// CSS variables and no oklch().
const ink = "#1b1a18";
const quiet = "#6a6662";
const panel = "#eeedec";
const page = "#fdfdfc";

// Every path is written out whole, the captures' up to the slug, so the build
// traces these files and not the whole project.
const root = process.cwd();
const jpeg = async (bytes: Promise<Buffer>) => `data:image/jpeg;base64,${(await bytes).toString("base64")}`;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((t) => t.slug === slug);

  if (!p?.live) {
    return new Response(new Uint8Array(await readFile(join(root, "app/opengraph-image.png"))), {
      headers: { "content-type": "image/png" },
    });
  }

  const [desktop, mobile, serif, sans, medium, mono] = await Promise.all([
    jpeg(readFile(join(root, "images/live", `${slug}-desktop.jpg`))),
    jpeg(readFile(join(root, "images/live", `${slug}-mobile.jpg`))),
    readFile(join(root, "lib/og/GeistSerif-Regular.ttf")),
    readFile(join(root, "node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf")),
    readFile(join(root, "node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf")),
    readFile(join(root, "node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf")),
  ]);
  const price = priceOf(p);
  // The renderer never breaks a word, so the name shrinks until its longest
  // word fits the column: 66px holds nine letters, "WooCommerce" sets at 57.
  const longest = Math.max(...p.name.split(" ").map((w) => w.length));
  const nameSize = Math.min(66, Math.floor((66 * 9.5) / longest));

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        background: panel,
        fontFamily: "Geist",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", position: "absolute", left: 64, top: 64, width: 372 }}>
        <div
          style={{
            fontFamily: "Geist Mono",
            fontSize: 15,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: quiet,
          }}
        >
          {industries[p.industry]}
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: "Geist Serif",
            fontSize: nameSize,
            lineHeight: 1.02,
            letterSpacing: -2,
            color: ink,
          }}
        >
          {p.name}
        </div>
        <div style={{ marginTop: 20, fontSize: 23, lineHeight: 1.4, color: quiet }}>{p.tagline}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", position: "absolute", left: 64, bottom: 58 }}>
        <div style={{ fontSize: 20, fontWeight: 500, color: ink }}>{price ? `${p.build} · $${price}` : p.build}</div>
        <div style={{ marginTop: 8, fontFamily: "Geist Mono", fontSize: 15, color: quiet }}>booliitheme.com</div>
      </div>

      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 480,
          top: 64,
          width: 760,
          height: 620,
          overflow: "hidden",
          background: page,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          boxShadow: "0 1px 2px rgba(27,26,24,0.06), 0 14px 36px -10px rgba(27,26,24,0.16)",
        }}
      >
        <img src={desktop} width={760} height={950} alt="" />
      </div>

      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 964,
          top: 148,
          padding: 5,
          background: page,
          borderRadius: 27,
          boxShadow: "0 32px 64px -14px rgba(27,26,24,0.38)",
        }}
      >
        <img src={mobile} width={176} height={381} alt="" style={{ borderRadius: 22 }} />
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Geist Serif", data: serif, weight: 400, style: "normal" },
        { name: "Geist", data: sans, weight: 400, style: "normal" },
        { name: "Geist", data: medium, weight: 500, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
