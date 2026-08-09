"use server";

import { prisma } from "./db";
import type { Proyecto, Criterio, Actividad, EstadoGlobal } from "./tipos";

export async function cargarEstadoGlobal(): Promise<EstadoGlobal | null> {
  try {
    const [proyectos, criterios, actividades] = await Promise.all([
      prisma.proyecto.findMany({
        include: {
          puntuaciones: true,
          historial: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.criterio.findMany({
        orderBy: { orden: "asc" },
      }),
      prisma.actividad.findMany({
        orderBy: { codigo: "asc" },
      }),
    ]);

    return {
      proyectos: proyectos.map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        socioLocal: p.socioLocal,
        sede: p.sede,
        municipio: p.municipio,
        comunidad: p.comunidad,
        fechaInicio: p.fechaInicio,
        fechaFin: p.fechaFin || undefined,
        numBeneficiarios: p.numBeneficiarios,
        tipoBeneficiario: p.tipoBeneficiario,
        responsableFRM: p.responsableFRM,
        observaciones: p.observaciones || undefined,
        puntuaciones: p.puntuaciones.map((pun: any) => ({
          criterioId: pun.criterioId,
          valor: pun.valor as 0 | 1 | 2 | 3,
          nota: pun.nota || undefined,
        })),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        historial: p.historial.map((h: any) => ({
          id: h.id,
          tipo: h.tipo as "creacion" | "edicion_datos" | "evaluacion" | "eliminacion",
          timestamp: h.timestamp.toISOString(),
          cambios: h.cambios as Record<string, { antes: any; despues: any }> | undefined,
        })),
      })),
      criterios: criterios.map((c: any) => ({
        id: c.id,
        eje: c.eje as "alcance" | "carga",
        orden: c.orden,
        nombre: c.nombre,
        definicion: c.definicion,
        ejemplos: (c.ejemplos as any) || [],
      })),
      actividades: actividades.map((a: any) => ({
        id: a.id,
        codigo: a.codigo,
        texto: a.texto,
        categoriaEstrategica: a.categoriaEstrategica as "I" | "II" | "III",
      })),
    };
  } catch (error) {
    console.error("Error cargando estado global:", error);
    return null;
  }
}

export async function guardarProyecto(proyecto: Proyecto): Promise<Proyecto | null> {
  try {
    const saved = await prisma.proyecto.upsert({
      where: { id: proyecto.id },
      update: {
        nombre: proyecto.nombre,
        socioLocal: proyecto.socioLocal,
        sede: proyecto.sede,
        municipio: proyecto.municipio,
        comunidad: proyecto.comunidad,
        fechaInicio: proyecto.fechaInicio,
        fechaFin: proyecto.fechaFin,
        numBeneficiarios: proyecto.numBeneficiarios,
        tipoBeneficiario: proyecto.tipoBeneficiario,
        responsableFRM: proyecto.responsableFRM,
        observaciones: proyecto.observaciones,
      },
      create: {
        id: proyecto.id,
        nombre: proyecto.nombre,
        socioLocal: proyecto.socioLocal,
        sede: proyecto.sede,
        municipio: proyecto.municipio,
        comunidad: proyecto.comunidad,
        fechaInicio: proyecto.fechaInicio,
        fechaFin: proyecto.fechaFin,
        numBeneficiarios: proyecto.numBeneficiarios,
        tipoBeneficiario: proyecto.tipoBeneficiario,
        responsableFRM: proyecto.responsableFRM,
        observaciones: proyecto.observaciones,
      },
      include: {
        puntuaciones: true,
        historial: true,
      },
    });

    // Sincronizar puntuaciones
    await prisma.puntuacion.deleteMany({
      where: { proyectoId: proyecto.id },
    });

    await Promise.all(
      (proyecto.puntuaciones || []).map((pun) =>
        prisma.puntuacion.create({
          data: {
            id: `${proyecto.id}-${pun.criterioId}`,
            proyectoId: proyecto.id,
            criterioId: pun.criterioId,
            valor: pun.valor,
            nota: pun.nota,
          },
        })
      )
    );

    // Sincronizar historial
    if (proyecto.historial) {
      await Promise.all(
        proyecto.historial.map((hist) =>
          prisma.cambioHistorial.upsert({
            where: { id: hist.id },
            update: {
              cambios: hist.cambios,
            },
            create: {
              id: hist.id,
              proyectoId: proyecto.id,
              tipo: hist.tipo,
              cambios: hist.cambios,
              timestamp: new Date(hist.timestamp),
            },
          })
        )
      );
    }

    return proyecto;
  } catch (error) {
    console.error("Error guardando proyecto:", error);
    return null;
  }
}

export async function eliminarProyecto(proyectoId: string): Promise<boolean> {
  try {
    await prisma.proyecto.delete({
      where: { id: proyectoId },
    });
    return true;
  } catch (error) {
    console.error("Error eliminando proyecto:", error);
    return false;
  }
}

export async function guardarCriterio(criterio: Criterio): Promise<Criterio | null> {
  try {
    await prisma.criterio.upsert({
      where: { id: criterio.id },
      update: {
        nombre: criterio.nombre,
        definicion: criterio.definicion,
        ejemplos: criterio.ejemplos,
        orden: criterio.orden,
      },
      create: {
        id: criterio.id,
        eje: criterio.eje,
        orden: criterio.orden,
        nombre: criterio.nombre,
        definicion: criterio.definicion,
        ejemplos: criterio.ejemplos,
      },
    });
    return criterio;
  } catch (error) {
    console.error("Error guardando criterio:", error);
    return null;
  }
}

export async function eliminarCriterio(criterioId: string): Promise<boolean> {
  try {
    await prisma.criterio.delete({
      where: { id: criterioId },
    });
    return true;
  } catch (error) {
    console.error("Error eliminando criterio:", error);
    return false;
  }
}

export async function guardarActividad(actividad: Actividad): Promise<Actividad | null> {
  try {
    await prisma.actividad.upsert({
      where: { id: actividad.id },
      update: {
        texto: actividad.texto,
        categoriaEstrategica: actividad.categoriaEstrategica,
      },
      create: {
        id: actividad.id,
        codigo: actividad.codigo,
        texto: actividad.texto,
        categoriaEstrategica: actividad.categoriaEstrategica,
      },
    });
    return actividad;
  } catch (error) {
    console.error("Error guardando actividad:", error);
    return null;
  }
}

export async function eliminarActividad(actividadId: string): Promise<boolean> {
  try {
    await prisma.actividad.delete({
      where: { id: actividadId },
    });
    return true;
  } catch (error) {
    console.error("Error eliminando actividad:", error);
    return false;
  }
}
