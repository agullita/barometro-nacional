import type { CambioHistorial } from "./tipos";
import { generarId } from "./calculo";

export function registrarCambio(
  tipo: "creacion" | "edicion_datos" | "evaluacion" | "eliminacion",
  cambios?: Record<string, { antes: any; despues: any }>
): CambioHistorial {
  return {
    id: generarId(),
    tipo,
    timestamp: new Date().toISOString(),
    cambios,
  };
}

export function formatearTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function obtenerLabelTipoCambio(tipo: string): string {
  const labels: Record<string, string> = {
    creacion: "Creación",
    edicion_datos: "Edición de datos",
    evaluacion: "Evaluación",
    eliminacion: "Eliminación",
  };
  return labels[tipo] || tipo;
}
