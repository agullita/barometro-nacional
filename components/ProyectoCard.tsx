"use client";

import Link from "next/link";
import type { Proyecto, Criterio } from "@/lib/tipos";
import { resumenCategorias } from "@/lib/calculo";
import { BadgeCategoria } from "./BadgeCategoria";

interface Props {
  proyecto: Proyecto;
  criterios: Criterio[];
}

export function ProyectoCard({ proyecto, criterios }: Props) {
  const r = resumenCategorias(proyecto, criterios);
  const evaluado = proyecto.puntuaciones.length > 0;

  return (
    <Link
      href={`/proyectos/${proyecto.id}`}
      className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-frm-azul hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="font-semibold text-slate-900">{proyecto.nombre}</h3>
          <p className="text-sm text-slate-500">
            {proyecto.municipio} · {proyecto.comunidad}
          </p>
        </div>
        {evaluado ? (
          <BadgeCategoria cat={r.est.cat} label={r.est.label} />
        ) : (
          <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-500">Sin evaluar</span>
        )}
     </div>

      <div className="flex items-center gap-4 text-xs text-slate-600 mt-3">
        <span>
          <strong className="text-slate-900">{proyecto.numBeneficiarios}</strong> beneficiarios
        </span>
        <span>·</span>
        <span>{proyecto.socioLocal}</span>
      </div>

      {evaluado && (
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Alcance: <strong>{r.puntosAlcance}</strong>/{r.maxAlcance}
          </span>
          <span className="text-slate-500">
            Carga: <strong>{r.puntosCarga}</strong>/{r.maxCarga}
          </span>
        </div>
      )}
    </Link>
  );
}
