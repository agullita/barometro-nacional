"use client";

import { useEffect, useState, useCallback } from "react";
import type { EstadoGlobal, Proyecto, Criterio, Actividad } from "./tipos";
import { CRITERIOS_INICIALES, ACTIVIDADES_INICIALES } from "./datos-iniciales";

const KEY = "barometro-nacional-cache";

export function useEstadoGlobal() {
  const [estado, setEstadoLocal] = useState<EstadoGlobal | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar estado desde Neon (con fallback a localStorage y luego a iniciales)
  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);

        // Intentar cargar desde Neon primero
        try {
          const response = await fetch("/api/load");
          if (response.ok) {
            const data = await response.json();
            setEstadoLocal({
              proyectos: data.proyectos || [],
              criterios: data.criterios?.length ? data.criterios : CRITERIOS_INICIALES,
              actividades: data.actividades?.length ? data.actividades : ACTIVIDADES_INICIALES,
            });
            // Cache en localStorage para offline
            localStorage.setItem(KEY, JSON.stringify(data));
            return;
          }
        } catch (error) {
          console.error("Error cargando desde Neon, intentando cache:", error);
        }

        // Fallback a localStorage
        const cached = localStorage.getItem(KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as EstadoGlobal;
          setEstadoLocal({
            proyectos: parsed.proyectos || [],
            criterios: parsed.criterios?.length ? parsed.criterios : CRITERIOS_INICIALES,
            actividades: parsed.actividades?.length ? parsed.actividades : ACTIVIDADES_INICIALES,
          });
          return;
        }

        // Fallback a iniciales
        setEstadoLocal({
          proyectos: [],
          criterios: CRITERIOS_INICIALES,
          actividades: ACTIVIDADES_INICIALES,
        });
      } catch (error) {
        console.error("Error cargando estado:", error);
        setEstadoLocal({
          proyectos: [],
          criterios: CRITERIOS_INICIALES,
          actividades: ACTIVIDADES_INICIALES,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Setter que sincroniza con Neon
  const setEstado = useCallback(
    (nuevo: EstadoGlobal | ((prev: EstadoGlobal) => EstadoGlobal)) => {
      if (!estado) return;

      const nuevoEstado =
        typeof nuevo === "function" ? nuevo(estado) : nuevo;

      // Update local state immediately
      setEstadoLocal(nuevoEstado);

      // Cache en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(KEY, JSON.stringify(nuevoEstado));

        // Sync to Neon in background
        fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoEstado),
        }).catch((error) => console.error("Error sincronizando:", error));
      }
    },
    [estado]
  );

  // Función para recargar desde BD
  const recargarDesdeBD = useCallback(async () => {
    try {
      const response = await fetch("/api/load");
      if (response.ok) {
        const data = await response.json();
        setEstadoLocal({
          proyectos: data.proyectos || [],
          criterios: data.criterios?.length ? data.criterios : CRITERIOS_INICIALES,
          actividades: data.actividades?.length ? data.actividades : ACTIVIDADES_INICIALES,
        });
        // Cache en localStorage
        localStorage.setItem(KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error recargando desde BD:", error);
    }
  }, []);

  return { estado: loading ? null : estado, setEstado, recargarDesdeBD };
}

export type { Proyecto, Criterio, Actividad };
