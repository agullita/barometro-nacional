"use client";

import { useParams, useRouter } from "next/navigation";
import { useEstadoGlobal } from "@/lib/storage";
import { resumenCategorias } from "@/lib/calculo";
import { CriterioForm } from "@/components/CriterioForm";
import { BadgeCategoria } from "@/components/BadgeCategoria";
import { ExportButton } from "@/components/ExportButton";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Save, X, FileText, Clock } from "lucide-react";
import { clsx } from "clsx";
import { formatearTimestamp, obtenerLabelTipoCambio, registrarCambio } from "@/lib/utils";
import { exportarProyecto } from "@/lib/pdf";
import type { CambioHistorial } from "@/lib/tipos";

export default function ProyectoPage() {
  const params = useParams();
  const router = useRouter();
  const { estado, setEstado } = useEstadoGlobal();
  const id = params.id as string;

  const proyecto = estado?.proyectos.find((p) => p.id === id);
  const criterios = estado?.criterios || [];

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(proyecto ? { ...proyecto } : null);
  const [tabActual, setTabActual] = useState<"datos" | "evaluacion" | "historial">("datos");

  if (!estado || !proyecto) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Proyecto no encontrado</p>
      </div>
    );
  }

  const r = resumenCategorias(proyecto, criterios);
  const criteriosAlcance = criterios.filter((c) => c.eje === "alcance");
  const criteriosCarga = criterios.filter((c) => c.eje === "carga");

  function actualizarPuntuacion(criterioId: string, valor: 0 | 1 | 2 | 3, nota: string) {
    if (!proyecto) return;
    const nuevoProyecto = { ...proyecto };
    const puntuaciones = nuevoProyecto.puntuaciones || [];
    const pIndex = puntuaciones.findIndex((p) => p.criterioId === criterioId);
    const valorAnterior = proyecto.puntuaciones.find((p) => p.criterioId === criterioId)?.valor || null;

    if (pIndex >= 0) {
      puntuaciones[pIndex] = { criterioId, valor, ...(nota && { nota }) };
    } else {
      puntuaciones.push({ criterioId, valor, ...(nota && { nota }) });
    }
    nuevoProyecto.puntuaciones = puntuaciones;
    nuevoProyecto.updatedAt = new Date().toISOString();

    // Registrar cambio en evaluación
    const cambio = registrarCambio("evaluacion", {
      criterioId: { antes: valorAnterior, despues: valor },
    });
    nuevoProyecto.historial = [...(nuevoProyecto.historial || []), cambio];

    if (!estado) return;
    const nuevoEstado = {
      ...estado,
      proyectos: estado.proyectos.map((p) => (p.id === id ? nuevoProyecto : p)),
    } as any;
    setEstado(nuevoEstado);
  }

  function guardarEdicion() {
    if (!editData || !editData.nombre.trim()) {
      alert("El nombre del proyecto es obligatorio.");
      return;
    }
    if (!estado) return;

    // Calcular cambios realizados
    const cambios: Record<string, { antes: any; despues: any }> = {};
    const keys = ["nombre", "socioLocal", "sede", "municipio", "comunidad", "fechaInicio", "responsableFRM", "numBeneficiarios", "tipoBeneficiario", "observaciones"];
    keys.forEach((key) => {
      if (((proyecto as any)[key] || "") !== ((editData as any)[key] || "")) {
        cambios[key] = { antes: (proyecto as any)[key] || "", despues: (editData as any)[key] || "" };
      }
    });

    const actualizado = { ...editData, updatedAt: new Date().toISOString() } as typeof proyecto;

    // Registrar cambio en datos si hay cambios
    if (Object.keys(cambios).length > 0) {
      const cambio = registrarCambio("edicion_datos", cambios);
      (actualizado as any).historial = [...((actualizado as any).historial || []), cambio];
    }

    const nuevoEstado = {
      ...estado,
      proyectos: estado.proyectos.map((p) => (p.id === id ? actualizado : p)),
    } as any;
    setEstado(nuevoEstado);
    setEditMode(false);
  }

  function eliminarProyecto() {
    if (!confirm("¿Eliminar este proyecto? Esta acción no se puede deshacer.")) return;
    if (!estado || !proyecto) return;

    // Registrar cambio de eliminación (aunque el proyecto se elimine, registramos el cambio)
    const cambio = registrarCambio("eliminacion");
    const proyectoActualizado = { ...proyecto, historial: [...(proyecto.historial || []), cambio] };

    const nuevoEstado = {
      ...estado,
      proyectos: estado.proyectos.filter((p) => p.id !== id),
    };
    setEstado(nuevoEstado as any);
    router.push("/");
  }

  function campoEdicion(k: string, label: string, type = "text") {
    if (!editData) return null;
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input
          type={type}
          value={(editData as any)[k] as string | number}
          onChange={(e) => setEditData({ ...editData, [k]: e.target.value } as any)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
        />
      </div>
    );
  }

  return (
    <div id="proyecto-export-content" className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-3">
            <ArrowLeft size={16} />
            Volver a cartera
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">{proyecto.nombre}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {proyecto.municipio} · {proyecto.comunidad}
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            label="Exportar PDF"
            onClick={() => exportarProyecto(proyecto, criterios, "proyecto-export-content")}
            disabled={proyecto.puntuaciones.length === 0}
          />
          {proyecto.puntuaciones.length > 0 && (
            <BadgeCategoria cat={r.est.cat} label={r.est.label} />
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setTabActual("datos")}
          className={clsx(
            "px-4 py-2 text-sm font-medium border-b-2 transition",
            tabActual === "datos"
              ? "border-frm-azul text-frm-azul"
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          Datos del proyecto
        </button>
        <button
          onClick={() => setTabActual("evaluacion")}
          className={clsx(
            "px-4 py-2 text-sm font-medium border-b-2 transition",
            tabActual === "evaluacion"
              ? "border-frm-azul text-frm-azul"
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          Evaluación {proyecto.puntuaciones.length > 0 && <span className="text-xs ml-1">({proyecto.puntuaciones.length})</span>}
        </button>
        <button
          onClick={() => setTabActual("historial")}
          className={clsx(
            "px-4 py-2 text-sm font-medium border-b-2 transition",
            tabActual === "historial"
              ? "border-frm-azul text-frm-azul"
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          Historial {proyecto.historial && proyecto.historial.length > 0 && <span className="text-xs ml-1">({proyecto.historial.length})</span>}
        </button>
      </div>

      {/* TAB: DATOS */}
      {tabActual === "datos" && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          {!editMode ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Socio local</p>
                  <p className="text-slate-900">{proyecto.socioLocal}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Sede</p>
                  <p className="text-slate-900">{proyecto.sede || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Municipio</p>
                  <p className="text-slate-900">{proyecto.municipio || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Comunidad autónoma</p>
                  <p className="text-slate-900">{proyecto.comunidad || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Fecha de inicio</p>
                  <p className="text-slate-900">{proyecto.fechaInicio}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Responsable FRM</p>
                  <p className="text-slate-900">{proyecto.responsableFRM || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Nº beneficiarios</p>
                  <p className="text-slate-900">{proyecto.numBeneficiarios}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Tipo de beneficiarios</p>
                  <p className="text-slate-900">{proyecto.tipoBeneficiario || "—"}</p>
                </div>
              </div>
              {(proyecto.observaciones || true) && (
                <div className="mb-6 pb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} className="text-blue-600" />
                    <p className="text-xs text-blue-700 uppercase font-semibold">Notas del Proyecto</p>
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {proyecto.observaciones || "(sin notas)"}
                  </p>
                </div>
              )}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-frm-azul text-white hover:bg-blue-700 transition"
                >
                  Editar datos
                </button>
                <button
                  onClick={eliminarProyecto}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
                >
                  Eliminar proyecto
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {campoEdicion("nombre", "Nombre del proyecto")}
                {campoEdicion("socioLocal", "Socio local")}
                {campoEdicion("sede", "Sede")}
                {campoEdicion("municipio", "Municipio")}
                {campoEdicion("comunidad", "Comunidad autónoma")}
                {campoEdicion("fechaInicio", "Fecha de inicio", "date")}
                {campoEdicion("numBeneficiarios", "Nº beneficiarios", "number")}
                {campoEdicion("tipoBeneficiario", "Tipo de beneficiarios")}
                {campoEdicion("responsableFRM", "Responsable FRM")}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
                <textarea
                  rows={3}
                  value={editData?.observaciones || ""}
                  onChange={(e) => setEditData({ ...editData!, observaciones: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={guardarEdicion}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-frm-azul text-white hover:bg-blue-700 transition"
                >
                  <Save size={16} />
                  Guardar cambios
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setEditData({ ...proyecto });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  <X size={16} />
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB: EVALUACION */}
      {tabActual === "evaluacion" && (
        <div className="space-y-8">
          {/* Resumen */}
          {proyecto.puntuaciones.length > 0 && (
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Resumen de evaluación</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Alcance */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Alcance</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {r.puntosAlcance}/{r.maxAlcance}
                  </p>
                  <div
                    className={clsx("w-full h-1 rounded-full mt-3", r.catA.color)}
                  />
                  <p className="text-sm font-medium text-slate-700 mt-2">{r.catA.label}</p>
                </div>

                {/* Carga */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Carga</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {r.puntosCarga}/{r.maxCarga}
                  </p>
                  <div
                    className={clsx("w-full h-1 rounded-full mt-3", r.catC.color)}
                  />
                  <p className="text-sm font-medium text-slate-700 mt-2">{r.catC.label}</p>
                </div>

                {/* Estrategia */}
                <div className={clsx("rounded-lg p-4 border", r.est.color + " bg-opacity-10 border-opacity-30")}>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Categoría estratégica</p>
                  <p className="text-2xl font-bold text-slate-900 mb-2">{r.est.label}</p>
                  <p className="text-xs text-slate-600">{r.est.estrategia}</p>
                </div>
              </div>
            </div>
          )}

          {/* Criterios Alcance */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Eje Alcance</h3>
            <div className="space-y-8">
              {criteriosAlcance.map((c) => (
                <div key={c.id} className="border-b border-slate-200 pb-8 last:border-0 last:pb-0">
                  <CriterioForm
                    criterio={c}
                    puntuacion={proyecto.puntuaciones.find((p) => p.criterioId === c.id)}
                    onChange={(valor, nota) => actualizarPuntuacion(c.id, valor, nota)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Criterios Carga */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Eje Carga</h3>
            <div className="space-y-8">
              {criteriosCarga.map((c) => (
                <div key={c.id} className="border-b border-slate-200 pb-8 last:border-0 last:pb-0">
                  <CriterioForm
                    criterio={c}
                    puntuacion={proyecto.puntuaciones.find((p) => p.criterioId === c.id)}
                    onChange={(valor, nota) => actualizarPuntuacion(c.id, valor, nota)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <button
              onClick={() => {
                // Force sync to Neon
                if (estado) {
                  setEstado(estado);
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              <Save size={18} />
              Guardar evaluación
            </button>
            <p className="text-xs text-slate-500 self-center">Los cambios se sincronizan automáticamente con la base de datos</p>
          </div>
        </div>
      )}

      {/* TAB: HISTORIAL */}
      {tabActual === "historial" && (
        <div className="space-y-4">
          {!proyecto.historial || proyecto.historial.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
              <Clock size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-slate-500">Sin cambios registrados</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="space-y-4">
                {[...(proyecto.historial || [])].reverse().map((cambio, idx) => (
                  <div key={cambio.id} className="pb-4 border-b border-slate-100 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-frm-azul flex items-center justify-center text-white text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-slate-900">{obtenerLabelTipoCambio(cambio.tipo)}</p>
                        <p className="text-sm text-slate-500 mt-1">{formatearTimestamp(cambio.timestamp)}</p>
                        {cambio.cambios && Object.keys(cambio.cambios).length > 0 && (
                          <div className="mt-3 bg-slate-50 rounded p-3 text-sm space-y-2">
                            {Object.entries(cambio.cambios).map(([key, value]) => (
                              <div key={key} className="flex gap-2">
                                <span className="font-mono text-slate-600 flex-shrink-0">{key}:</span>
                                <span className="text-slate-500">
                                  <span className="line-through">{String(value.antes)}</span>
                                  {" → "}
                                  <span className="font-medium text-slate-700">{String(value.despues)}</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
