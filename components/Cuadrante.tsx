"use client";

import Link from "next/link";
import type { Proyecto, Criterio } from "@/lib/tipos";
import { resumenCategorias, maxEje } from "@/lib/calculo";

interface Props {
  proyectos: Proyecto[];
  criterios: Criterio[];
  highlightId?: string;
  size?: "sm" | "lg";
}

export function Cuadrante({ proyectos, criterios, highlightId, size = "lg" }: Props) {
  const maxA = maxEje(criterios, "alcance") || 1;
  const maxC = maxEje(criterios, "carga") || 1;

  const isLg = size === "lg";
  const w = isLg ? 560 : 280;
  const h = isLg ? 420 : 220;
  const pad = 50;
  const plotW = w - pad * 2;
  const plotH = h - pad * 2;

  // mapea puntos a coordenadas SVG
  // X = carga (0 izq, max der), Y = alcance (max arriba, 0 abajo)
  function toXY(p: Proyecto) {
    const r = resumenCategorias(p, criterios);
    const x = pad + (r.puntosCarga / maxC) * plotW;
    const y = pad + (1 - r.puntosAlcance / maxA) * plotH;
    return { x, y, r };
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
        {/* Fondo por zonas (3x3) */}
        <rect x={pad} y={pad} width={plotW} height={plotH / 3} fill="#d1fae5" opacity="0.4" />
        <rect
          x={pad}
          y={pad + plotH / 3}
          width={plotW}
          height={plotH / 3}
          fill="#fef3c7"
          opacity="0.4"
        />
        <rect
          x={pad}
          y={pad + (plotH * 2) / 3}
          width={plotW}
          height={plotH / 3}
          fill="#fecaca"
          opacity="0.4"
        />

        {/* Ejes */}
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#333" strokeWidth={1.5} />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#333" strokeWidth={1.5} />

        {/* Líneas divisorias tercios */}
        <line
          x1={pad + plotW / 3}
          y1={pad}
          x2={pad + plotW / 3}
          y2={h - pad}
          stroke="#999"
          strokeDasharray="4 4"
          strokeWidth={0.5}
        />
        <line
          x1={pad + (plotW * 2) / 3}
          y1={pad}
          x2={pad + (plotW * 2) / 3}
          y2={h - pad}
          stroke="#999"
          strokeDasharray="4 4"
          strokeWidth={0.5}
        />
        <line
          x1={pad}
          y1={pad + plotH / 3}
          x2={w - pad}
          y2={pad + plotH / 3}
          stroke="#999"
          strokeDasharray="4 4"
          strokeWidth={0.5}
        />
        <line
          x1={pad}
          y1={pad + (plotH * 2) / 3}
          x2={w - pad}
          y2={pad + (plotH * 2) / 3}
          stroke="#999"
          strokeDasharray="4 4"
          strokeWidth={0.5}
        />

        {/* Etiquetas ejes */}
        <text
          x={w / 2}
          y={h - 10}
          textAnchor="middle"
          fontSize={isLg ? 13 : 10}
          fontWeight="600"
          fill="#333"
        >
          CARGA DE TRABAJO →
       </text>
        <text
          x={15}
          y={h / 2}
          textAnchor="middle"
          fontSize={isLg ? 13 : 10}
          fontWeight="600"
          fill="#333"
          transform={`rotate(-90, 15, ${h / 2})`}
        >
          ← ALCANCE DEL PROYECTO
       </text>

        {/* Etiquetas esquinas */}
        {isLg && (
          <>
            <text x={pad + 5} y={pad + 15} fontSize={10} fill="#065f46">
              +ALCANCE / -CARGA
           </text>
            <text
              x={w - pad - 5}
              y={h - pad - 5}
              fontSize={10}
              fill="#9f1239"
              textAnchor="end"
            >
              -ALCANCE / +CARGA
           </text>
          </>
        )}

        {/* Puntos */}
        {proyectos.map((p) => {
          const { x, y, r } = toXY(p);
          if (!isFinite(x) || !isFinite(y)) return null;
          const isHighlight = p.id === highlightId;
          const color =
            r.est.cat === "I"
              ? "#059669"
              : r.est.cat === "II"
              ? "#d97706"
              : "#e11d48";
          return (
            <g key={p.id} style={{ cursor: "pointer" }}>
              <title>{p.nombre}</title>
              <a href={`/proyectos/${p.id}`} style={{ textDecoration: "none" }}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHighlight ? (isLg ? 9 : 6) : isLg ? 6 : 4}
                  fill={color}
                  stroke="white"
                  strokeWidth={isLg ? 2 : 1}
                  opacity={isHighlight ? 1 : 0.75}
                  style={{ cursor: "pointer", transition: "r 0.2s" }}
                  onMouseEnter={(e) => {
                    (e.target as SVGCircleElement).setAttribute(
                      "r",
                      String(isHighlight ? (isLg ? 11 : 7) : isLg ? 8 : 5)
                    );
                  }}
                  onMouseLeave={(e) => {
                    (e.target as SVGCircleElement).setAttribute(
                      "r",
                      String(isHighlight ? (isLg ? 9 : 6) : isLg ? 6 : 4)
                    );
                  }}
                />
                {isLg && (
                  <text
                    x={x + 10}
                    y={y + 4}
                    fontSize={10}
                    fill="#1a1a1a"
                    fontWeight={isHighlight ? "700" : "400"}
                    style={{ pointerEvents: "none" }}
                  >
                    {p.nombre}
                  </text>
                )}
              </a>
           </g>
          );
        })}
     </svg>
   </div>
  );
}
