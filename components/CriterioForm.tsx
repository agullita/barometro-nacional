"use client";

import type { Criterio, Puntuacion } from "@/lib/tipos";
import { clsx } from "clsx";

interface Props {
  criterio: Criterio;
  puntuacion?: Puntuacion;
  onChange: (valor: 0 | 1 | 2 | 3, nota: string) => void;
}

export function CriterioForm({ criterio, puntuacion, onChange }: Props) {
  const valor = puntuacion?.valor;
  const nota = puntuacion?.nota || "";

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">{criterio.nombre}</h3>
        <p className="text-sm text-slate-600">{criterio.definicion}</p>
      </div>

      <div className="space-y-2">
        {criterio.ejemplos
          .sort((a, b) => a.nivel - b.nivel)
          .map((e) => {
            const selected = valor === e.nivel;
            return (
              <button
                key={e.nivel}
                type="button"
                onClick={() => onChange(e.nivel, nota)}
                className={clsx(
                  "w-full text-left px-4 py-3 rounded-lg border-2 transition",
                  selected
                    ? "border-frm-azul bg-blue-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={clsx(
                      "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm",
                      selected
                        ? "bg-frm-azul text-white"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {e.nivel}
                 </span>
                  <span className="text-sm text-slate-800 pt-1.5">{e.texto}</span>
                </div>
              </button>
            );
          })}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Nota (opcional)
       </label>
        <textarea
          value={nota}
          onChange={(ev) => onChange(valor ?? 0, ev.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-frm-azul focus:ring-1 focus:ring-frm-azul outline-none"
          placeholder="Observaciones que apoyen la puntuación..."
        />
      </div>
    </div>
  );
}
