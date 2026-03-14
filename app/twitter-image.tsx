import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const runtime = "edge";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#e2e8f0",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 600 }}>Leonid Petrov</div>
        <div style={{ fontSize: 30, color: "#94a3b8", marginTop: 12 }}>
          Senior Frontend Engineer
        </div>
        <div style={{ fontSize: 22, color: "#cbd5f5", marginTop: 24 }}>
          Architecture · Performance · Accessibility · Design Systems
        </div>
        <div style={{ fontSize: 18, color: "#64748b", marginTop: 36 }}>
          lvpjsdev@gmail.com · t.me/lvpjsdev
        </div>
      </div>
    ),
    size,
  );
}
