"use client";

import Link from "next/link";
import { useEstadoGlobal } from "@/lib/storage";
import { generarId } from "@/lib/calculo";
import { useState } from "react";
import { ArrowLeft, Edit, Trash2, Plus, Save, X, ChevronUp, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import type { Criterio } from "@/lib/tipos";

type Eje = "alcance" | "carga";

export default function CriteriosPage() {
  const { estado, setEstado } = useEstadoGlobal();
  const [eje, setEje] = useState<Eje>("alcance");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Criterio | null>(null);

  if (!estado) return <div className="text-slate-500">Cargando</div>;

  const criterios = estado.criterios.filter((c) => c.eje === eje).sort((a, b) => a.orden - b.orden);

  function guardarCriterio() {
    if (!editData || !editData.nombre.trim()) {
      alert("El nombre del criterio es obligatorio.");
      return;
    }
    if (editData.ejemplos.length !== 4 || editData.ejemplos.some((e) => !e.texto.trim())) {
      alert("Todos los 4 ejemplos (niveles 0-3) son obligatorios.");
      return;
    }
    if (!estado) return;

    const nuevosCriterios = editingId
      ? estado.criterios.map((c) => (c.id === editingId ? editData : c))
      : [...estado.criterios, { ...editData, id: editData.id || generarId() }];

    const nuevoEstado = { ...estado, criterios: nuevosCriterios };
    setEstado(nuevoEstado as any);
    cerrarEdicion();
  }

  function borrarCriterio(id: string) {
    if (!confirm("¿Borrar este criterio? También se eliminarán sus puntuaciones en todos los proyectos.")) return;
    if (!estado) return;

    // Borrar criterio
    const nuevosCriterios = estado.criterios.filter((c) => c.id !== id);

    // Borrar puntuaciones asociadas en todos los proyectos
    const nuevosProyectos = estado.proyectos.map((p) => ({
      ...p,
      puntuaciones: p.puntuaciones.filter((pun) => pun.criterioId !== id),
    }));

    const nuevoEstado = {
      ...estado,
      criterios: nuevosCriterios,
      proyectos: nuevosProyectos,
    };
    setEstado(nuevoEstado as any);
  }

  function cambiarOrden(id: string, direccion: "up" | "down") {
    if (!estado) return;
    const idx = criterios.findIndex((c) => c.id === id);
    if ((direccion === "up" && idx === 0) || (direccion === "down" && idx === criterios.length - 1)) return;

    const c1 = criterios[idx];
    const c2 = criterios[idx + (direccion === "up" ? -1 : 1)];

    const nuevosCriterios = estado.criterios.map((c) => {
      if (c.id === c1.id) return { ...c, orden: c2.orden };
      if (c.id === c2.id) return { ...c, orden: c1.orden };
      return c;
    });

    setEstado({ ...estado, criterios: nuevosCriterios } as any);
  }

  function abrirEdicion(criterio: Criterio) {
    setEditingId(criterio.id);
    setEditData({ ...criterio });
  }

  function cerrarEdicion() {
    setEditingId(null);
    setEditData(null);
  }

  function actualizarEjemplo(nivel: 0 | 1 | 2 | 3, texto: string) {
    if (!editData) return;
    const nuevosEjemplos = editData.ejemplos.map((e) =>
      e.nivel === nivel ? { ...e, texto } : e
    );
    setEditData({ ...editData, ejemplos: nuevosEjemplos });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-3">
            <ArrowLeft size={16} />
            Volver
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Criterios de Evaluación</h1>
          <p className="text-sm text-slate-500 mt-1">Gestiona los criterios de alcance y carga para la evaluación de proyectos.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {(["alcance", "carga"] as Eje[]).map((e) => (
          <button
            key={e}
            onClick={() => setEje(e)}
            className={clsx(
              "px-4 py-2 text-sm font-medium border-b-2 transition",
              eje === e
                ? "border-frm-azul text-frm-azul"
                : "border-transparent text-slate-600 hover:text-slate-900"
            )}
          >
            {e === "alcance" ? "Eje Alcance" : "Eje Carga"}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Definición</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 w-20">Orden</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900 w-32">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {criterios.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{c.nombre}</td>
                <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">{c.definicion}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{c.orden}</td>
                <td className="px-6 py-4 text-right space-x-1">
                  <button
                    onClick={() => cambiarOrden(c.id, "up")}
                    disabled={criterios.indexOf(c) === 0}
                    className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-slate-50 text-slate-600 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Subir"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => cambiarOrden(c.id, "down")}
                    disabled={criterios.indexOf(c) === criterios.length - 1}
                    className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-slate-50 text-slate-600 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Bajar"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    onClick={() => abrirEdicion(c)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => borrarCriterio(c.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-rose-50 text-rose-600 rounded hover:bg-rose-100 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón Añadir */}
      <button
        onClick={() => {
          abrirEdicion({
            id: "",
            eje,
            orden: Math.max(...criterios.map((c) => c.orden), 0) + 1,
            nombre: "",
            definicion: "",
            ejemplos: [
              { nivel: 0, texto: "" },
              { nivel: 1, texto: "" },
              { nivel: 2, texto: "" },
              { nivel: 3, texto: "" },
            ],
          });
        }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-frm-azul text-white hover:bg-blue-700 transition"
      >
        <Plus size={18} />
        Añadir criterio
      </button>

      {/* Modal Edición */}
      {editingId !== null && editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingId === "" ? "Nuevo Criterio" : "Editar Criterio"}
            </h2>

            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={editData.nombre}
                  onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
                />
              </div>

              {/* Definición */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Definición *</label>
                <textarea
                  rows={3}
                  value={editData.definicion}
                  onChange={(e) => setEditData({ ...editData, definicion: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
                />
              </div>

              {/* Orden */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Orden</label>
                <input
                  type="number"
                  value={editData.orden}
                  onChange={(e) => setEditData({ ...editData, orden: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
                />
              </div>

              {/* Ejemplos */}
              <div className="border-t border-slate-200 pt-4">
                <h3 className="font-semibold text-slate-900 mb-3">Ejemplos (Niveles 0-3) *</h3>
                <div className="space-y-3">
                  {editData.ejemplos.map((e) => (
                    <div key={e.nivel}>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nivel {e.nivel}
                      </label>
                      <textarea
                        rows={2}
                        value={e.texto}
                        onChange={(evt) => actualizarEjemplo(e.nivel as 0 | 1 | 2 | 3, evt.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
                        placeholder={`Ejemplo para nivel ${e.nivel}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={guardarCriterio}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-frm-azul text-white hover:bg-blue-700 transition"
              >
                <Save size={16} />
                Guardar
              </button>
              <button
                onClick={cerrarEdicion}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                <X size={16} />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
