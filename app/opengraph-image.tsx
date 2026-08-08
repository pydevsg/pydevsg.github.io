import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/site.config";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = { acid: "#B8FF3A", magenta: "#FF3AA5" };

/** Built once at build time. Same type pairing as the site, so it reads as the site. */
export default async function OpengraphImage() {
  const accent = ACCENT[site.accent];
  const dir = join(process.cwd(), "assets", "fonts");

  const [mono, serif] = await Promise.all([
    readFile(join(dir, "JetBrainsMono-Regular.ttf")),
    readFile(join(dir, "InstrumentSerif-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0D0E",
          color: "#EDEAE0",
          fontFamily: "mono",
          padding: "56px 64px",
          position: "relative",
        }}
      >
        {/* The 12-column grid, drawn rather than implied. */}
        {Array.from({ length: 11 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: (1200 / 12) * (i + 1),
              width: 1,
              background: "rgba(237,234,224,0.07)",
            }}
          />
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22 }}>
          <span style={{ color: "#4A4A45" }}>~/sudipto</span>
          <span style={{ color: accent }}>$</span>
          <span style={{ color: "#7A7A72" }}>whoami</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              fontFamily: "serif",
              fontSize: 132,
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            <span>Sudipto Ghosh</span>
            <span style={{ marginLeft: 18, marginBottom: 22, fontFamily: "mono", fontSize: 26, color: accent }}>
              $_
            </span>
          </div>
          <div style={{ marginTop: 26, fontSize: 28, color: "#7A7A72" }}>{site.tagline}</div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(237,234,224,0.14)",
            paddingTop: 22,
            fontSize: 20,
            color: "#7A7A72",
          }}
        >
          <span>{site.domain}</span>
          <span style={{ color: accent }}>
            {site.featured.install} · 13K+ downloads
          </span>
          <span>{site.location.toLowerCase()}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "mono", data: mono, style: "normal", weight: 400 },
        { name: "serif", data: serif, style: "normal", weight: 400 },
      ],
    },
  );
}
