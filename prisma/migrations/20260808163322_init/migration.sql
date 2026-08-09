-- CreateTable
CREATE TABLE "Proyecto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "socioLocal" TEXT NOT NULL,
    "sede" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "comunidad" TEXT NOT NULL,
    "fechaInicio" TEXT NOT NULL,
    "fechaFin" TEXT,
    "numBeneficiarios" INTEGER NOT NULL,
    "tipoBeneficiario" TEXT NOT NULL,
    "responsableFRM" TEXT NOT NULL,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Criterio" (
    "id" TEXT NOT NULL,
    "eje" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "definicion" TEXT NOT NULL,
    "ejemplos" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Criterio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "categoriaEstrategica" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Puntuacion" (
    "id" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,
    "criterioId" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "nota" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Puntuacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CambioHistorial" (
    "id" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "cambios" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CambioHistorial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Proyecto_municipio_idx" ON "Proyecto"("municipio");

-- CreateIndex
CREATE INDEX "Proyecto_responsableFRM_idx" ON "Proyecto"("responsableFRM");

-- CreateIndex
CREATE INDEX "Proyecto_createdAt_idx" ON "Proyecto"("createdAt");

-- CreateIndex
CREATE INDEX "Criterio_eje_idx" ON "Criterio"("eje");

-- CreateIndex
CREATE INDEX "Criterio_orden_idx" ON "Criterio"("orden");

-- CreateIndex
CREATE UNIQUE INDEX "Actividad_codigo_key" ON "Actividad"("codigo");

-- CreateIndex
CREATE INDEX "Actividad_categoriaEstrategica_idx" ON "Actividad"("categoriaEstrategica");

-- CreateIndex
CREATE INDEX "Puntuacion_proyectoId_idx" ON "Puntuacion"("proyectoId");

-- CreateIndex
CREATE INDEX "Puntuacion_criterioId_idx" ON "Puntuacion"("criterioId");

-- CreateIndex
CREATE UNIQUE INDEX "Puntuacion_proyectoId_criterioId_key" ON "Puntuacion"("proyectoId", "criterioId");

-- CreateIndex
CREATE INDEX "CambioHistorial_proyectoId_idx" ON "CambioHistorial"("proyectoId");

-- CreateIndex
CREATE INDEX "CambioHistorial_timestamp_idx" ON "CambioHistorial"("timestamp");

-- AddForeignKey
ALTER TABLE "Puntuacion" ADD CONSTRAINT "Puntuacion_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Puntuacion" ADD CONSTRAINT "Puntuacion_criterioId_fkey" FOREIGN KEY ("criterioId") REFERENCES "Criterio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CambioHistorial" ADD CONSTRAINT "CambioHistorial_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
