import { ImageResponse } from "next/og";
import { datosDelEstudio as marca } from "@/lib/content";
import { getDatosDelEstudio } from "@/lib/cms";

// `alt` se evalúa al compilar, con los datos de respaldo (el panel de Sanity no llega acá).
export const alt = `${marca.nombre} — Abogados en ${marca.ciudad} desde ${marca.fundacion}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const datos = await getDatosDelEstudio();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3ede2",
          color: "#17150f",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4 }}>
          <span style={{ color: "#8c2a1c" }}>{`ESTUDIO JURÍDICO · ${datos.ciudad.toUpperCase()}`}</span>
          <span>{`DESDE ${datos.fundacion}`}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 104, lineHeight: 1, letterSpacing: -4 }}>
          <span>La ley es compleja.</span>
          <span style={{ color: "#8c2a1c", fontStyle: "italic" }}>Tu abogado, no.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "2px solid #17150f", paddingTop: 28 }}>
          <span style={{ fontSize: 40, letterSpacing: -1 }}>{datos.nombre}</span>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 999,
              background: "#8c2a1c",
              color: "#f3ede2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontStyle: "italic",
            }}
          >
            {datos.monograma}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
