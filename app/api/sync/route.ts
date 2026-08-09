import { prisma } from "@/lib/db";
import type { EstadoGlobal } from "@/lib/tipos";

export async function POST(request: Request) {
  try {
    const estado: EstadoGlobal = await request.json();

    if (!estado) {
      return Response.json({ error: "No state provided" }, { status: 400 });
    }

    // Sync proyectos
    for (const p of estado.proyectos || []) {
      try {
        await prisma.proyecto.create({
          data: {
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
      } catch {
        // Proyecto ya existe, update
        await prisma.proyecto.update({
          where: { id: p.id },
          data: {
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
      }

      // Sync puntuaciones
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

      // Sync historial
      for (const hist of p.historial || []) {
        try {
          await prisma.cambioHistorial.create({
            data: {
              id: hist.id,
              proyectoId: p.id,
              tipo: hist.tipo,
              cambios: hist.cambios,
              timestamp: new Date(hist.timestamp),
            },
          });
        } catch {
          // Ya existe
        }
      }
    }

    // Sync criterios (solo si se envían)
    if (estado.criterios && estado.criterios.length > 0) {
      for (const c of estado.criterios) {
        try {
          await prisma.criterio.create({
            data: {
              id: c.id,
              eje: c.eje,
              orden: c.orden,
              nombre: c.nombre,
              definicion: c.definicion,
              ejemplos: c.ejemplos,
            },
          });
        } catch {
          // Criterio ya existe, update
          await prisma.criterio.update({
            where: { id: c.id },
            data: {
              nombre: c.nombre,
              definicion: c.definicion,
              ejemplos: c.ejemplos,
              orden: c.orden,
            },
          });
        }
      }
    }

    // Sync actividades (solo si se envían)
    if (estado.actividades && estado.actividades.length > 0) {
      for (const a of estado.actividades) {
        try {
          await prisma.actividad.create({
            data: {
              id: a.id,
              codigo: a.codigo,
              texto: a.texto,
              categoriaEstrategica: a.categoriaEstrategica,
            },
          });
        } catch {
          // Actividad ya existe, update
          await prisma.actividad.update({
            where: { id: a.id },
            data: {
              texto: a.texto,
              categoriaEstrategica: a.categoriaEstrategica,
            },
          });
        }
      }
    }

    return Response.json({ message: "Sincronizado correctamente", estado });
  } catch (error) {
    console.error("Error en sync:", error);
    return Response.json(
      { error: "Error sincronizando", details: String(error) },
      { status: 500 }
    );
  }
}
