import { prisma } from "@/lib/db";
import { CRITERIOS_INICIALES, ACTIVIDADES_INICIALES } from "@/lib/datos-iniciales";

export async function GET() {
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

    // Si no hay criterios en BD, insertar iniciales
    if (criterios.length === 0) {
      await Promise.all(
        CRITERIOS_INICIALES.map((c) =>
          prisma.criterio.create({
            data: {
              id: c.id,
              eje: c.eje,
              orden: c.orden,
              nombre: c.nombre,
              definicion: c.definicion,
              ejemplos: c.ejemplos,
            },
          })
        )
      );
    }

    // Si no hay actividades en BD, insertar iniciales
    if (actividades.length === 0) {
      await Promise.all(
        ACTIVIDADES_INICIALES.map((a) =>
          prisma.actividad.create({
            data: {
              id: a.id,
              codigo: a.codigo,
              texto: a.texto,
              categoriaEstrategica: a.categoriaEstrategica,
            },
          })
        )
      );
    }

    // Recargar después de insertar
    const [proyectosFinales, criteriosFinales, actividadesFinales] = await Promise.all([
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

    return Response.json({
      proyectos: proyectosFinales.map((p: any) => ({
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
          valor: pun.valor,
          nota: pun.nota || undefined,
        })),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        historial: p.historial.map((h: any) => ({
          id: h.id,
          tipo: h.tipo,
          timestamp: h.timestamp.toISOString(),
          cambios: h.cambios || undefined,
        })),
      })),
      criterios: criteriosFinales.map((c: any) => ({
        id: c.id,
        eje: c.eje,
        orden: c.orden,
        nombre: c.nombre,
        definicion: c.definicion,
        ejemplos: c.ejemplos || [],
      })),
      actividades: actividadesFinales.map((a: any) => ({
        id: a.id,
        codigo: a.codigo,
        texto: a.texto,
        categoriaEstrategica: a.categoriaEstrategica,
      })),
    });
  } catch (error) {
    console.error("Error cargando estado:", error);
    return Response.json(
      { error: "Error cargando estado", details: String(error) },
      { status: 500 }
    );
  }
}
