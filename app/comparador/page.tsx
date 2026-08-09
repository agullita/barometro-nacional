"use client";

import { useEstadoGlobal } from "@/lib/storage";
import { resumenCategorias } from "@/lib/calculo";
import { BadgeCategoria } from "@/components/BadgeCategoria";
import { ExportButton } from "@/components/ExportButton";
import { exportarComparacion } from "@/lib/pdf";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { clsx } from "clsx";

export default function ComparadorPage() {
  const { estado } = useEstadoGlobal();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedCriterio, setExpandedCriterio] = useState<string | null>(null);

  if (!estado) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  const proyectos = estado.proyectos;
  const criterios = estado.criterios || [];

  const seleccionados = proyectos.filter((p) => selectedIds.includes(p.id));
  const criteriosAlcance = criterios.filter((c) => c.eje === "alcance");
  const criteriosCarga = criterios.filter((c) => c.eje === "carga");

  function toggleSelection(id: string) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  }

  function obtenerPuntuacion(proyecto: typeof proyectos[0], criterioId: string) {
    const p = proyecto.puntuaciones.find((pun) => pun.criterioId === criterioId);
    return p ? p.valor : null;
  }

  function obtenerNota(proyecto: typeof proyectos[0], criterioId: string) {
    const p = proyecto.puntuaciones.find((pun) => pun.criterioId === criterioId);
    return p?.nota || "";
  }

  return (
    <div id="comparador-export-content" className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-3">
            <ArrowLeft size={16} />
            Volver a cartera
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Comparador de proyectos</h1>
          <p className="text-sm text-slate-500 mt-1">
            Selecciona hasta 3 proyectos para verlos lado a lado
          </p>
        </div>
        {seleccionados.length > 0 && (
          <ExportButton
            label="Exportar comparación"
            onClick={() => exportarComparacion(seleccionados, criterios, "comparador-export-content")}
          />
        )}
      </div>

      {/* Selector de proyectos */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Proyectos disponibles ({proyectos.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {proyectos.map((p) => (
            <label key={p.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={selectedIds.includes(p.id)}
                onChange={() => toggleSelection(p.id)}
                disabled={selectedIds.length >= 3 && !selectedIds.includes(p.id)}
                className="w-4 h-4"
              />
              <div className="flex-grow">
                <p className="font-medium text-slate-900">{p.nombre}</p>
                <p className="text-xs text-slate-500">{p.municipio} · {p.socioLocal}</p>
              </div>
              {p.puntuaciones.length > 0 && (
                <BadgeCategoria cat={resumenCategorias(p, criterios).est.cat} label={resumenCategorias(p, criterios).est.label} />
              )}
            </label>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-4">
          {selectedIds.length}/3 proyectos seleccionados
        </p>
      </div>

      {/* Tabla comparativa */}
      {seleccionados.length > 0 && (
        <div className="space-y-6">
          {/* Datos básicos */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Datos básicos</h2>
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "Nombre", key: "nombre" as const },
                  { label: "Municipio", key: "municipio" as const },
                  { label: "Socio local", key: "socioLocal" as const },
                  { label: "Responsable FRM", key: "responsableFRM" as const },
                  { label: "Nº beneficiarios", key: "numBeneficiarios" as const },
                  { label: "Tipo de beneficiario", key: "tipoBeneficiario" as const },
                  { label: "Fecha de inicio", key: "fechaInicio" as const },
                ].map((row) => (
                  <tr key={row.key} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 px-4 font-medium text-slate-600 w-32">{row.label}</td>
                    {seleccionados.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-slate-900">
                        {p[row.key] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumen evaluación */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Resumen de evaluación</h2>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-4 font-medium text-slate-600 w-32">Puntuación Alcance</td>
                  {seleccionados.map((p) => {
                    const r = resumenCategorias(p, criterios);
                    return (
                      <td key={p.id} className="py-3 px-4 text-slate-900">
                        {p.puntuaciones.length > 0 ? `${r.puntosAlcance}/${r.maxAlcance}` : "—"}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-4 font-medium text-slate-600 w-32">Categoría Alcance</td>
                  {seleccionados.map((p) => {
                    const r = resumenCategorias(p, criterios);
                    return (
                      <td key={p.id} className="py-3 px-4">
                        {p.puntuaciones.length > 0 ? <span className={clsx("px-2 py-1 rounded text-white text-xs font-semibold", r.catA.color)}>{r.catA.label}</span> : "—"}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-4 font-medium text-slate-600 w-32">Puntuación Carga</td>
                  {seleccionados.map((p) => {
                    const r = resumenCategorias(p, criterios);
                    return (
                      <td key={p.id} className="py-3 px-4 text-slate-900">
                        {p.puntuaciones.length > 0 ? `${r.puntosCarga}/${r.maxCarga}` : "—"}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-3 px-4 font-medium text-slate-600 w-32">Categoría Carga</td>
                  {seleccionados.map((p) => {
                    const r = resumenCategorias(p, criterios);
                    return (
                      <td key={p.id} className="py-3 px-4">
                        {p.puntuaciones.length > 0 ? <span className={clsx("px-2 py-1 rounded text-white text-xs font-semibold", r.catC.color)}>{r.catC.label}</span> : "—"}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-600 w-32">Categoría Estratégica</td>
                  {seleccionados.map((p) => {
                    const r = resumenCategorias(p, criterios);
                    return (
                      <td key={p.id} className="py-3 px-4">
                        {p.puntuaciones.length > 0 ? <span className={clsx("px-2 py-1 rounded text-xs font-semibold", r.est.color + " bg-opacity-20 text-opacity-100")}>{r.est.label}</span> : "—"}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Criterios Alcance */}
          {criteriosAlcance.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Eje Alcance</h2>
              <div className="space-y-2">
                {criteriosAlcance.map((c) => (
                  <div key={c.id} className="border border-slate-200 rounded-lg">
                    <button
                      onClick={() => setExpandedCriterio(expandedCriterio === c.id ? null : c.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition"
                    >
                      <div className="text-left">
                        <p className="font-medium text-slate-900">{c.nombre}</p>
                        <p className="text-xs text-slate-500 mt-1">{c.definicion}</p>
                      </div>
                      {expandedCriterio === c.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {expandedCriterio === c.id && (
                      <div className="border-t border-slate-200 p-4 bg-slate-50">
                        <div className="grid grid-cols-1 gap-4">
                          {seleccionados.map((p) => (
                            <div key={p.id} className="border border-slate-200 rounded p-3 bg-white">
                              <p className="font-medium text-slate-900 mb-2">{p.nombre}</p>
                              <p className="text-sm text-slate-600 mb-2">
                                Puntuación:{" "}
                                <span className="font-bold text-slate-900">
                                  {obtenerPuntuacion(p, c.id) !== null ? obtenerPuntuacion(p, c.id) : "—"}
                                </span>
                              </p>
                              {obtenerNota(p, c.id) && (
                                <p className="text-sm text-slate-600">
                                  Nota: <span className="italic text-slate-700">{obtenerNota(p, c.id)}</span>
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Criterios Carga */}
          {criteriosCarga.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Eje Carga</h2>
              <div className="space-y-2">
                {criteriosCarga.map((c) => (
                  <div key={c.id} className="border border-slate-200 rounded-lg">
                    <button
                      onClick={() => setExpandedCriterio(expandedCriterio === c.id ? null : c.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition"
                    >
                      <div className="text-left">
                        <p className="font-medium text-slate-900">{c.nombre}</p>
                        <p className="text-xs text-slate-500 mt-1">{c.definicion}</p>
                      </div>
                      {expandedCriterio === c.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {expandedCriterio === c.id && (
                      <div className="border-t border-slate-200 p-4 bg-slate-50">
                        <div className="grid grid-cols-1 gap-4">
                          {seleccionados.map((p) => (
                            <div key={p.id} className="border border-slate-200 rounded p-3 bg-white">
                              <p className="font-medium text-slate-900 mb-2">{p.nombre}</p>
                              <p className="text-sm text-slate-600 mb-2">
                                Puntuación:{" "}
                                <span className="font-bold text-slate-900">
                                  {obtenerPuntuacion(p, c.id) !== null ? obtenerPuntuacion(p, c.id) : "—"}
                                </span>
                              </p>
                              {obtenerNota(p, c.id) && (
                                <p className="text-sm text-slate-600">
                                  Nota: <span className="italic text-slate-700">{obtenerNota(p, c.id)}</span>
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {seleccionados.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
          <p className="text-slate-500">Selecciona al menos un proyecto para comenzar la comparación</p>
        </div>
      )}
    </div>
  );
}
