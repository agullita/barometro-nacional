"use client";

import Link from "next/link";
import { useEstadoGlobal } from "@/lib/storage";
import { generarId } from "@/lib/calculo";
import { useState } from "react";
import { ArrowLeft, Edit, Trash2, Plus, Save, X } from "lucide-react";
import { clsx } from "clsx";
import type { Actividad } from "@/lib/tipos";
import type { CatEstrategica } from "@/lib/tipos";

export default function ActividadesPage() {
  const { estado, setEstado } = useEstadoGlobal();
  const [categoria, setCategoria] = useState<CatEstrategica>("I");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Actividad | null>(null);

  if (!estado) return <div className="text-slate-500">Cargando</div>;

  const actividades = estado.actividades
    .filter((a) => a.categoriaEstrategica === categoria)
    .sort((a, b) => a.codigo.localeCompare(b.codigo));

  const categorias = [
    { id: "I" as CatEstrategica, label: "Categoría I · Consolidar" },
    { id: "II" as CatEstrategica, label: "Categoría II · Redistribuir" },
    { id: "III" as CatEstrategica, label: "Categoría III · Evaluar" },
  ];

  function guardarActividad() {
    if (!editData || !editData.codigo.trim()) {
      alert("El código de la actividad es obligatorio.");
      return;
    }
    if (!editData.texto.trim()) {
      alert("El texto de la actividad es obligatorio.");
      return;
    }
    if (!estado) return;

    const nuevasActividades = editingId
      ? estado.actividades.map((a) => (a.id === editingId ? editData : a))
      : [...estado.actividades, { ...editData, id: editData.id || generarId() }];

    const nuevoEstado = { ...estado, actividades: nuevasActividades };
    setEstado(nuevoEstado as any);
    cerrarEdicion();
  }

  function borrarActividad(id: string) {
    if (!confirm("¿Borrar esta actividad?")) return;
    if (!estado) return;

    const nuevasActividades = estado.actividades.filter((a) => a.id !== id);
    const nuevoEstado = { ...estado, actividades: nuevasActividades };
    setEstado(nuevoEstado as any);
  }

  function abrirEdicion(actividad: Actividad) {
    setEditingId(actividad.id);
    setEditData({ ...actividad });
  }

  function cerrarEdicion() {
    setEditingId(null);
    setEditData(null);
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
          <h1 className="text-3xl font-bold text-slate-900">Actividades Estratégicas</h1>
          <p className="text-sm text-slate-500 mt-1">Gestiona las actividades por categoría estratégica.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoria(cat.id)}
            className={clsx(
              "px-4 py-2 text-sm font-medium border-b-2 transition",
              categoria === cat.id
                ? "border-frm-azul text-frm-azul"
                : "border-transparent text-slate-600 hover:text-slate-900"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 w-20">Código</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Texto</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900 w-32">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {actividades.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{a.codigo}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{a.texto}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => abrirEdicion(a)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => borrarActividad(a.id)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-rose-50 text-rose-600 rounded hover:bg-rose-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {actividades.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          No hay actividades en esta categoría.
        </div>
      )}

      {/* Botón Añadir */}
      <button
        onClick={() => {
          abrirEdicion({
            id: "",
            codigo: "",
            categoriaEstrategica: categoria,
            texto: "",
          });
        }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-frm-azul text-white hover:bg-blue-700 transition"
      >
        <Plus size={18} />
        Añadir actividad
      </button>

      {/* Modal Edición */}
      {editingId !== null && editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingId === "" ? "Nueva Actividad" : "Editar Actividad"}
            </h2>

            <div className="space-y-4">
              {/* Código */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Código *</label>
                <input
                  type="text"
                  value={editData.codigo}
                  onChange={(e) => setEditData({ ...editData, codigo: e.target.value })}
                  placeholder="ej. I.1, II.3, III.2"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
                />
              </div>

              {/* Categoría (solo lectura para nuevas, editable para existentes si necesario) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría Estratégica</label>
                <select
                  value={editData.categoriaEstrategica}
                  onChange={(e) =>
                    setEditData({ ...editData, categoriaEstrategica: e.target.value as CatEstrategica })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
                >
                  <option value="I">Categoría I · Consolidar</option>
                  <option value="II">Categoría II · Redistribuir</option>
                  <option value="III">Categoría III · Evaluar</option>
                </select>
              </div>

              {/* Texto */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Texto de Actividad *</label>
                <textarea
                  rows={4}
                  value={editData.texto}
                  onChange={(e) => setEditData({ ...editData, texto: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
                />
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={guardarActividad}
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
