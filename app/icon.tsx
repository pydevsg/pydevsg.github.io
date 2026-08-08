import { ImageResponse } from "next/og";
import { site } from "@/site.config";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

const ACCENT = { acid: "#B8FF3A", magenta: "#FF3AA5" };

/** A prompt in a box. Reads at 16px, which is the only size that matters. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0D0E",
          color: ACCENT[site.accent],
          fontSize: 40,
          fontWeight: 700,
          fontFamily: "monospace",
          border: `3px solid ${ACCENT[site.accent]}`,
        }}
      >
        $_
      </div>
    ),
    size,
  );
}
