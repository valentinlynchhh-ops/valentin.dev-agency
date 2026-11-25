import { ImageResponse } from "next/og";

export const alt = "valentin.dev — diseño y desarrollo web para negocios de Argentina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#0A0A0A", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: 128, fontWeight: 800, letterSpacing: -8, color: "#F5F5F0" }}>
          <span>valentin</span>
          <span style={{ background: "#FFE600", color: "#0A0A0A", padding: "0 26px 10px 18px", marginLeft: -4, transform: "skewX(-12deg)", display: "flex" }}>.dev</span>
        </div>
        <div style={{ display: "flex", fontSize: 54, fontWeight: 700, color: "#F5F5F0", letterSpacing: -2, lineHeight: 1.05 }}>
          Diseño y programo tu web. Sin intermediarios.
        </div>
      </div>
    ),
    size,
  );
}
