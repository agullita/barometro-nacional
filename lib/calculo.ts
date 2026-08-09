import type {
  Criterio,
  Proyecto,
  CatAlcance,
  CatCarga,
  CatEstrategica,
  Puntuacion,
} from "./tipos";

export function puntosEje(proyecto: Proyecto, eje: "alcance" | "carga"): number {
  return proyecto.puntuaciones
    .filter((p) => {
      // we need the criterio to know its eje; pass criteria in helper below
      return true;
    })
    .reduce((acc, p) => acc + p.valor, 0);
}

export function puntosEjeCon(
  proyecto: Proyecto,
  criterios: Criterio[],
  eje: "alcance" | "carga"
): number {
  const ids = new Set(criterios.filter((c) => c.eje === eje).map((c) => c.id));
  return proyecto.puntuaciones
    .filter((p) => ids.has(p.criterioId))
    .reduce((acc, p) => acc + p.valor, 0);
}

export function maxEje(criterios: Criterio[], eje: "alcance" | "carga"): number {
  return criterios.filter((c) => c.eje === eje).length * 3;
}

export function categoriaAlcance(
  puntos: number,
  max: number
): { cat: CatAlcance; label: string; color: string } {
  const tercio = max / 3;
  if (puntos > tercio * 2) return { cat: 1, label: "Alcance Alto", color: "bg-emerald-500" };
  if (puntos > tercio) return { cat: 2, label: "Alcance Medio", color: "bg-amber-500" };
  return { cat: 3, label: "Alcance Bajo", color: "bg-rose-500" };
}

export function categoriaCarga(
  puntos: number,
  max: number
): { cat: CatCarga; label: string; color: string } {
  const tercio = max / 3;
  if (puntos > tercio * 2) return { cat: "A", label: "Carga Alta", color: "bg-rose-500" };
  if (puntos > tercio) return { cat: "B", label: "Carga Media", color: "bg-amber-500" };
  return { cat: "C", label: "Carga Baja", color: "bg-emerald-500" };
}

export function categoriaEstrategica(
  catA: CatAlcance,
  catC: CatCarga
): { cat: CatEstrategica; label: string; estrategia: string; color: string } {
  const k = `${catA}${catC}`;
  // Categoría I (consolidar): 1C, 1B, 2C
  // Categoría II (redistribuir): 1A, 2B, 3C
  // Categoría III (evaluar cierre / reducir): 2A, 3A, 3B
  if (k === "1C" || k === "1B" || k === "2C") {
    return {
      cat: "I",
      label: "Consolidar",
      estrategia:
        "Mantener recursos existentes y no ampliar la carga de trabajo.",
      color: "bg-emerald-600",
    };
  }
  if (k === "1A" || k === "2B" || k === "3C") {
    return {
      cat: "II",
      label: "Redistribuir recursos",
      estrategia:
        "Valorar distribución de recursos para ampliar alcance del proyecto o disminuir la carga.",
      color: "bg-amber-600",
    };
  }
  // 2A, 3A, 3B
  return {
    cat: "III",
    label: "Evaluar cierre / reducir carga",
    estrategia:
      "Evaluar fórmulas para disminuir carga de trabajo o susceptible de cierre.",
    color: "bg-rose-600",
  };
}

export function resumenCategorias(
  proyecto: Proyecto,
  criterios: Criterio[]
): {
  puntosAlcance: number;
  puntosCarga: number;
  maxAlcance: number;
  maxCarga: number;
  catA: ReturnType<typeof categoriaAlcance>;
  catC: ReturnType<typeof categoriaCarga>;
  est: ReturnType<typeof categoriaEstrategica>;
} {
  const pa = puntosEjeCon(proyecto, criterios, "alcance");
  const pc = puntosEjeCon(proyecto, criterios, "carga");
  const ma = maxEje(criterios, "alcance");
  const mc = maxEje(criterios, "carga");
  const catA = categoriaAlcance(pa, ma);
  const catC = categoriaCarga(pc, mc);
  const est = categoriaEstrategica(catA.cat, catC.cat);
  return { puntosAlcance: pa, puntosCarga: pc, maxAlcance: ma, maxCarga: mc, catA, catC, est };
}

export function generarId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
