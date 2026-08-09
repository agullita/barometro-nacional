import { prisma } from "@/lib/db";
import type { EstadoGlobal } from "@/lib/tipos";

export async function POST(request: Request) {
  try {
    const estado: EstadoGlobal = await request.json();

    if (!estado) {
      return Response.json({ error: "No state provided" }, { status: 400 });
    }

    console.log(`[SYNC] Sincronizando ${estado.proyectos?.length || 0} proyectos`);

    // Sync proyectos y puntuaciones
    for (const p of estado.proyectos || []) {
      try {
        // Create or update proyecto
        await prisma.proyecto.upsert({
          where: { id: p.id },
          update: {
            nombre: p.nombre,
            socioLocal: p.socioLocal,
            sede: p.sede,
            municipio: p.municipio,
            comunidad: p.comunidad,
            fechaInicio: p.fechaInicio,
            fechaFin: p.fechaFin,
            numBeneficiarios: p.numBeneficiarios,
            tipoBeneficiario: p.tipoBeneficiario,
            responsableFRM: p.responsableFRM,
            observaciones: p.observaciones,
          },
          create: {
            id: p.id,
            nombre: p.nombre,
            socioLocal: p.socioLocal,
            sede: p.sede,
            municipio: p.municipio,
            comunidad: p.comunidad,
            fechaInicio: p.fechaInicio,
            fechaFin: p.fechaFin,
            numBeneficiarios: p.numBeneficiarios,
            tipoBeneficiario: p.tipoBeneficiario,
            responsableFRM: p.responsableFRM,
            observaciones: p.observaciones,
          },
        });

        // Delete old puntuaciones and insert new ones
        await prisma.puntuacion.deleteMany({
          where: { proyectoId: p.id },
        });

        for (const pun of p.puntuaciones || []) {
          await prisma.puntuacion.create({
            data: {
              id: `${p.id}-${pun.criterioId}`,
              proyectoId: p.id,
              criterioId: pun.criterioId,
              valor: pun.valor,
              nota: pun.nota,
            },
          });
        }

        // Sync historial entries
        for (const hist of p.historial || []) {
          await prisma.cambioHistorial.upsert({
            where: { id: hist.id },
            update: {},
            create: {
              id: hist.id,
              proyectoId: p.id,
              tipo: hist.tipo,
              cambios: hist.cambios,
              timestamp: new Date(hist.timestamp),
            },
          });
        }
      } catch (error) {
        console.error(`[SYNC] Error syncing project ${p.id}:`, error);
      }
    }

    // Sync criterios (solo si se envían)
    if (estado.criterios && estado.criterios.length > 0) {
      for (const c of estado.criterios) {
        try {
          await prisma.criterio.upsert({
            where: { id: c.id },
            update: {
              nombre: c.nombre,
              definicion: c.definicion,
              ejemplos: c.ejemplos,
              orden: c.orden,
            },
            create: {
              id: c.id,
              eje: c.eje,
              orden: c.orden,
              nombre: c.nombre,
              definicion: c.definicion,
              ejemplos: c.ejemplos,
            },
          });
        } catch (error) {
          console.error(`[SYNC] Error syncing criterio ${c.id}:`, error);
        }
      }
    }

    // Sync actividades (solo si se envían)
    if (estado.actividades && estado.actividades.length > 0) {
      for (const a of estado.actividades) {
        try {
          await prisma.actividad.upsert({
            where: { id: a.id },
            update: {
              texto: a.texto,
              categoriaEstrategica: a.categoriaEstrategica,
            },
            create: {
              id: a.id,
              codigo: a.codigo,
              texto: a.texto,
              categoriaEstrategica: a.categoriaEstrategica,
            },
          });
        } catch (error) {
          console.error(`[SYNC] Error syncing actividad ${a.id}:`, error);
        }
      }
    }

    console.log("[SYNC] Sincronización completada");
    return Response.json({ message: "Sincronizado correctamente" });
  } catch (error) {
    console.error("Error en sync:", error);
    return Response.json(
      { error: "Error sincronizando", details: String(error) },
      { status: 500 }
    );
  }
}
