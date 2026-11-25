import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "valentin.dev — Diseño productos que generan negocio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const mono = `data:image/png;base64,${readFileSync(join(process.cwd(), "public", "brand", "monogram.png")).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#0A0A0A", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 68, position: "relative" }}>
        <div style={{ position: "absolute", right: -160, top: -140, width: 620, height: 620, borderRadius: 620, background: "radial-gradient(circle, rgba(255,230,0,0.55), rgba(255,230,0,0) 68%)", display: "flex" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={mono} width={112} height={67} alt="" />
          <div style={{ display: "flex", fontSize: 50, fontWeight: 700, color: "#F5F5F0", letterSpacing: -2 }}>valentin.dev</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, fontWeight: 800, fontStyle: "italic", color: "#F5F5F0", letterSpacing: -4, lineHeight: 1 }}>
          <div style={{ display: "flex" }}>Diseño productos</div>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <span>que generan</span>
            <span style={{ background: "#FFE600", color: "#0A0A0A", padding: "0 26px 8px", borderRadius: 26, display: "flex" }}>negocio.</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
