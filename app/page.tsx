"use client";

import Link from "next/link";
import { Plus, X, RefreshCw } from "lucide-react";
import { useEstadoGlobal } from "@/lib/storage";
import { ProyectoCard } from "@/components/ProyectoCard";
import { Cuadrante } from "@/components/Cuadrante";
import { ExportButton } from "@/components/ExportButton";
import { exportarCartera } from "@/lib/pdf";
import { useState } from "react";
import { clsx } from "clsx";

type Filtro = "todos" | "I" | "II" | "III" | "sin-evaluar";

export default function HomePage() {
  const { estado, setEstado, recargarDesdeBD } = useEstadoGlobal();
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [municipioFiltro, setMunicipioFiltro] = useState("");
  const [socioFiltro, setSocioFiltro] = useState("");
  const [responsableFiltro, setResponsableFiltro] = useState("");
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  const [recargando, setRecargando] = useState(false);

  if (!estado) {
    return <div className="text-slate-500">Cargando</div>;
  }

  const proyectos = estado.proyectos;

  // Obtener opciones únicas para filtros
  const municipios = Array.from(new Set(proyectos.map((p) => p.municipio).filter(Boolean))).sort();
  const socios = Array.from(new Set(proyectos.map((p) => p.socioLocal).filter(Boolean))).sort();
  const responsables = Array.from(new Set(proyectos.map((p) => p.responsableFRM).filter(Boolean))).sort();

  const proyectosFiltrados = proyectos.filter((p) => {
    // Filtro categoría
    if (filtro !== "todos") {
      if (filtro === "sin-evaluar") {
        if (p.puntuaciones.length !== 0) return false;
      } else {
        if (p.puntuaciones.length === 0) return false;
        const { resumenCategorias } = require("@/lib/calculo");
        const r = resumenCategorias(p, estado.criterios);
        if (r.est.cat !== filtro) return false;
      }
    }

    // Búsqueda por nombre
    if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase())) {
      return false;
    }

    // Filtros avanzados
    if (municipioFiltro && p.municipio !== municipioFiltro) return false;
    if (socioFiltro && p.socioLocal !== socioFiltro) return false;
    if (responsableFiltro && p.responsableFRM !== responsableFiltro) return false;

    return true;
  });

  const filtros: { id: Filtro; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "I", label: "Cat. I — Consolidar" },
    { id: "II", label: "Cat. II — Redistribuir" },
    { id: "III", label: "Cat. III — Evaluar" },
    { id: "sin-evaluar", label: "Sin evaluar" },
  ];

  const tieneFiltroseAvanzados = municipioFiltro || socioFiltro || responsableFiltro || busqueda;

  return (
    <div id="cartera-export-content" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cartera de proyectos</h1>
          <p className="text-sm text-slate-500 mt-1">
            {proyectos.length} proyecto{proyectos.length === 1 ? "" : "s"} en cartera
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              setRecargando(true);
              await recargarDesdeBD();
              setRecargando(false);
            }}
            disabled={recargando}
            className="inline-flex items-center gap-2 bg-slate-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition disabled:opacity-50"
          >
            <RefreshCw size={18} className={recargando ? "animate-spin" : ""} />
            {recargando ? "Recargando..." : "Recargar"}
          </button>
          {proyectos.length > 0 && (
            <ExportButton
              label="Exportar cartera"
              onClick={() => exportarCartera(proyectos, estado.criterios, "cartera-export-content")}
            />
          )}
          {proyectos.length > 1 && (
            <Link
              href="/comparador"
              className="inline-flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-700 transition"
            >
              Comparar proyectos
            </Link>
          )}
          <Link
            href="/proyectos/nuevo"
            className="inline-flex items-center gap-2 bg-frm-azul text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Nuevo proyecto
          </Link>
        </div>
      </div>

      {proyectos.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            Mapa de cartera · Alcance × Carga
          </h2>
          <Cuadrante proyectos={proyectos} criterios={estado.criterios} />
        </div>
      )}

      {/* Filtros Categoría */}
      <div className="flex gap-2 flex-wrap">
        {filtros.map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={clsx(
              "px-3 py-1.5 rounded-md text-sm font-medium border transition",
              filtro === f.id
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            )}
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
          className="px-3 py-1.5 rounded-md text-sm font-medium border bg-white text-slate-600 border-slate-200 hover:border-slate-300 ml-auto"
        >
          {mostrarFiltrosAvanzados ? "Ocultar filtros" : "Filtros avanzados"}
        </button>
      </div>

      {/* Filtros Avanzados */}
      {mostrarFiltrosAvanzados && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Búsqueda */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Buscar por nombre</label>
              <input
                type="text"
                placeholder="Nombre proyecto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
              />
            </div>

            {/* Municipio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Municipio</label>
              <select
                value={municipioFiltro}
                onChange={(e) => setMunicipioFiltro(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
              >
                <option value="">Todos</option>
                {municipios.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Socio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Socio Local</label>
              <select
                value={socioFiltro}
                onChange={(e) => setSocioFiltro(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
              >
                <option value="">Todos</option>
                {socios.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Responsable */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Responsable FRM</label>
              <select
                value={responsableFiltro}
                onChange={(e) => setResponsableFiltro(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
              >
                <option value="">Todos</option>
                {responsables.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {tieneFiltroseAvanzados && (
            <button
              onClick={() => {
                setBusqueda("");
                setMunicipioFiltro("");
                setSocioFiltro("");
                setResponsableFiltro("");
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900"
            >
              <X size={16} />
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {proyectosFiltrados.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-lg p-12 text-center">
          <p className="text-slate-500 mb-4">
            {proyectos.length === 0
              ? "Aún no hay proyectos. Crea el primero para empezar."
              : "No hay proyectos que coincidan con los filtros."}
          </p>
          {proyectos.length === 0 && (
            <Link
              href="/proyectos/nuevo"
              className="inline-flex items-center gap-2 bg-frm-azul text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              <Plus size={18} />
              Crear primer proyecto
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proyectosFiltrados.map((p) => (
            <ProyectoCard key={p.id} proyecto={p} criterios={estado.criterios} />
          ))}
        </div>
      )}
    </div>
  );
}
