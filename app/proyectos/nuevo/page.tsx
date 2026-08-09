"use client";

import { useRouter } from "next/navigation";
import { useEstadoGlobal } from "@/lib/storage";
import { generarId } from "@/lib/calculo";
import { registrarCambio } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";

export default function NuevoProyectoPage() {
  const router = useRouter();
  const { estado, setEstado } = useEstadoGlobal();
  const [form, setForm] = useState({
    nombre: "",
    socioLocal: "",
    sede: "",
    municipio: "",
    comunidad: "",
    fechaInicio: new Date().toISOString().slice(0, 10),
    numBeneficiarios: 0,
    tipoBeneficiario: "",
    responsableFRM: "",
    observaciones: "",
  });

  if (!estado) return <div>Cargando</div>;

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!form.nombre.trim()) {
      alert("El nombre del proyecto es obligatorio.");
      return;
    }
    if (!estado) return;
    const id = generarId();
    const now = new Date().toISOString();
    const cambioCreacion = registrarCambio("creacion");
    const nuevo = {
      id,
      ...form,
      numBeneficiarios: Number(form.numBeneficiarios) || 0,
      puntuaciones: [],
      createdAt: now,
      updatedAt: now,
      historial: [cambioCreacion],
    };
    setEstado({ ...estado, proyectos: [...estado.proyectos, nuevo] } as any);
    router.push(`/proyectos/${id}`);
  }

  function campo(k: keyof typeof form, label: string, type = "text", required = false) {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <input
          type={type}
          required={required}
          value={form[k] as string | number}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
          ← Volver a cartera
       </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Nuevo proyecto</h1>
        <p className="text-sm text-slate-500 mt-1">
          Crea la ficha del proyecto. Después podrás evaluarlo criterio a criterio.
       </p>
     </div>

      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campo("nombre", "Nombre del proyecto", "text", true)}
          {campo("socioLocal", "Socio local (club / colegio / ayuntamiento)", "text", true)}
          {campo("sede", "Sede", "text")}
          {campo("municipio", "Municipio", "text")}
          {campo("comunidad", "Comunidad autónoma", "text")}
          {campo("fechaInicio", "Fecha de inicio", "date")}
          {campo("numBeneficiarios", "Nº beneficiarios", "number")}
          {campo("tipoBeneficiario", "Tipo de beneficiarios", "text")}
          {campo("responsableFRM", "Responsable FRM", "text")}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
          <textarea
            rows={3}
            value={form.observaciones}
            onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="bg-frm-azul text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Crear proyecto
          </button>
        </div>
      </form>
    </div>
  );
}
