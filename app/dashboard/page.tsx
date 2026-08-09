"use client";

import Link from "next/link";
import { useEstadoGlobal } from "@/lib/storage";
import { resumenCategorias } from "@/lib/calculo";
import { BadgeCategoria } from "@/components/BadgeCategoria";
import { ArrowLeft, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { estado } = useEstadoGlobal();

  if (!estado) return <div className="text-slate-500">Cargando</div>;

  const { proyectos, criterios } = estado;
  const evaluados = proyectos.filter((p) => p.puntuaciones.length > 0);
  const sinEvaluar = proyectos.length - evaluados.length;

  // Categorías
  const catI = evaluados.filter((p) => resumenCategorias(p, criterios).est.cat === "I");
  const catII = evaluados.filter((p) => resumenCategorias(p, criterios).est.cat === "II");
  const catIII = evaluados.filter((p) => resumenCategorias(p, criterios).est.cat === "III");

  // Estadísticas
  const promedioAlcance =
    evaluados.length > 0
      ? (
          evaluados.reduce((sum, p) => {
            const r = resumenCategorias(p, criterios);
            return sum + r.puntosAlcance / r.maxAlcance;
          }, 0) / evaluados.length
        ).toFixed(2)
      : "0";

  const promedioCarga =
    evaluados.length > 0
      ? (
          evaluados.reduce((sum, p) => {
            const r = resumenCategorias(p, criterios);
            return sum + r.puntosCarga / r.maxCarga;
          }, 0) / evaluados.length
        ).toFixed(2)
      : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-3">
          <ArrowLeft size={16} />
          Volver a cartera
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Resumen de la cartera de proyectos.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Total Proyectos</p>
          <p className="text-3xl font-bold text-slate-900">{proyectos.length}</p>
          <p className="text-xs text-slate-500 mt-2">{evaluados.length} evaluados</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Sin Evaluar</p>
          <p className="text-3xl font-bold text-rose-600">{sinEvaluar}</p>
          <p className="text-xs text-slate-500 mt-2">Pendiente de evaluación</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Promedio Alcance</p>
          <p className="text-3xl font-bold text-slate-900">{promedioAlcance}</p>
          <p className="text-xs text-slate-500 mt-2">Sobre máximo 1.0</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Promedio Carga</p>
          <p className="text-3xl font-bold text-slate-900">{promedioCarga}</p>
          <p className="text-xs text-slate-500 mt-2">Sobre máximo 1.0</p>
        </div>
      </div>

      {/* Distribución Categorías */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cat I */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-emerald-900">Categoría I · Consolidar</h3>
            <span className="text-2xl font-bold text-emerald-600">{catI.length}</span>
          </div>
          <p className="text-sm text-emerald-700 mb-3">Mantener recursos existentes</p>
          <div className="space-y-1">
            {catI.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/proyectos/${p.id}`}
                className="block text-xs text-emerald-600 hover:text-emerald-800 underline truncate"
              >
                {p.nombre}
              </Link>
            ))}
            {catI.length > 4 && <p className="text-xs text-emerald-500 mt-2">+ {catI.length - 4} más</p>}
          </div>
        </div>

        {/* Cat II */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-amber-900">Categoría II · Redistribuir</h3>
            <span className="text-2xl font-bold text-amber-600">{catII.length}</span>
          </div>
          <p className="text-sm text-amber-700 mb-3">Valorar distribución de recursos</p>
          <div className="space-y-1">
            {catII.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/proyectos/${p.id}`}
                className="block text-xs text-amber-600 hover:text-amber-800 underline truncate"
              >
                {p.nombre}
              </Link>
            ))}
            {catII.length > 4 && <p className="text-xs text-amber-500 mt-2">+ {catII.length - 4} más</p>}
          </div>
        </div>

        {/* Cat III */}
        <div className="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-rose-900">Categoría III · Evaluar</h3>
            <span className="text-2xl font-bold text-rose-600">{catIII.length}</span>
          </div>
          <p className="text-sm text-rose-700 mb-3">Evaluar cierre / reducir carga</p>
          <div className="space-y-1">
            {catIII.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/proyectos/${p.id}`}
                className="block text-xs text-rose-600 hover:text-rose-800 underline truncate"
              >
                {p.nombre}
              </Link>
            ))}
            {catIII.length > 4 && <p className="text-xs text-rose-500 mt-2">+ {catIII.length - 4} más</p>}
          </div>
        </div>
      </div>

      {/* Sin Evaluar */}
      {sinEvaluar > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Proyectos Sin Evaluar ({sinEvaluar})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {proyectos
              .filter((p) => p.puntuaciones.length === 0)
              .map((p) => (
                <Link
                  key={p.id}
                  href={`/proyectos/${p.id}`}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded hover:bg-slate-100 transition"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{p.nombre}</p>
                    <p className="text-xs text-slate-500">{p.municipio}</p>
                  </div>
                  <TrendingUp size={18} className="text-slate-400" />
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
