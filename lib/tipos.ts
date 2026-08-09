export type Eje = "alcance" | "carga";

export type CatAlcance = 1 | 2 | 3; // 1 = Alto, 2 = Medio, 3 = Bajo
export type CatCarga = "A" | "B" | "C"; // A = Alta, B = Media, C = Baja
export type CatEstrategica = "I" | "II" | "III";

export interface Criterio {
  id: string;
  eje: Eje;
  orden: number;
  nombre: string;
  definicion: string;
  ejemplos: { nivel: 0 | 1 | 2 | 3; texto: string }[];
}

export interface Puntuacion {
  criterioId: string;
  valor: 0 | 1 | 2 | 3;
  nota?: string;
}

export interface Proyecto {
  id: string;
  nombre: string;
  socioLocal: string; // club / colegio / ayuntamiento / entidad
  sede: string;
  municipio: string;
  comunidad: string;
  fechaInicio: string;
  fechaFin?: string;
  numBeneficiarios: number;
  tipoBeneficiario: string;
  responsableFRM: string;
  observaciones?: string;
  puntuaciones: Puntuacion[];
  createdAt: string;
  updatedAt: string;
  historial?: CambioHistorial[];
}

export interface Actividad {
  id: string;
  codigo: string; // ej. "7.1.1"
  texto: string;
  categoriaEstrategica: CatEstrategica;
}

export interface CambioHistorial {
  id: string;
  tipo: "creacion" | "edicion_datos" | "evaluacion" | "eliminacion";
  timestamp: string;
  cambios?: Record<string, { antes: any; despues: any }>;
}

export interface EstadoGlobal {
  proyectos: Proyecto[];
  criterios: Criterio[];
  actividades: Actividad[];
}
