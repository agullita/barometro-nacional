import { prisma } from "@/lib/db";
import { CRITERIOS_INICIALES, ACTIVIDADES_INICIALES } from "@/lib/datos-iniciales";

export async function POST() {
  try {
    // Insertar criterios iniciales con raw SQL
    for (const c of CRITERIOS_INICIALES) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "Criterio" (id, eje, orden, nombre, definicion, ejemplos, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         ON CONFLICT (id) DO NOTHING`,
        c.id,
        c.eje,
        c.orden,
        c.nombre,
        c.definicion,
        JSON.stringify(c.ejemplos)
      );
    }

    // Insertar actividades iniciales con raw SQL
    for (const a of ACTIVIDADES_INICIALES) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "Actividad" (id, codigo, texto, "categoriaEstrategica", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         ON CONFLICT (codigo) DO NOTHING`,
        a.id,
        a.codigo,
        a.texto,
        a.categoriaEstrategica
      );
    }

    return Response.json({
      message: "BD inicializada correctamente",
      criterios: CRITERIOS_INICIALES.length,
      actividades: ACTIVIDADES_INICIALES.length,
    });
  } catch (error) {
    console.error("Error inicializando BD:", error);
    return Response.json(
      { error: "Error inicializando BD", details: String(error) },
      { status: 500 }
    );
  }
}
