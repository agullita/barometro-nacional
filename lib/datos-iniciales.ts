import type { Criterio, Actividad } from "./tipos";

export const CRITERIOS_INICIALES: Criterio[] = [
  // ============ EJE ALCANCE ============
  {
    id: "alc-enfoque",
    eje: "alcance",
    orden: 1,
    nombre: "Enfoque de programa",
    definicion:
      "Alcance de las actividades que se implementan para los beneficiarios: del solo-deporte al proyecto integral con varias actividades socioeducativas.",
    ejemplos: [
      { nivel: 0, texto: "Realiza solo deporte." },
      { nivel: 1, texto: "Realiza Deporte + 1 Actividad Socioeducativa." },
      { nivel: 2, texto: "Realiza Deporte + 2 Actividades Socioeducativas." },
      { nivel: 3, texto: "Desarrolla Proyecto Integral." },
    ],
  },
  {
    id: "alc-familias",
    eje: "alcance",
    orden: 2,
    nombre: "Trabajo con familias",
    definicion:
      "Trabajo constante del socio local en el compromiso de fomentar la participación de las familias.",
    ejemplos: [
      { nivel: 0, texto: "No realiza actividad con familias." },
      { nivel: 1, texto: "Familias tienen acceso al proyecto, no se realiza trabajo específico." },
      { nivel: 2, texto: "Se realiza trabajo directo con padres/tutores." },
      { nivel: 3, texto: "Se realizan actividades conjuntas entre niños y padres/tutores." },
    ],
  },
  {
    id: "alc-nutricion",
    eje: "alcance",
    orden: 3,
    nombre: "Nutrición y hábitos saludables",
    definicion:
      "Trabajo del socio local para mejorar los hábitos saludables de los beneficiarios y sus familias.",
    ejemplos: [
      { nivel: 0, texto: "No realiza actividad en el área de nutrición." },
      { nivel: 1, texto: "Se ofrece aporte nutricional o talleres o chequeos nutricionales." },
      {
        nivel: 2,
        texto: "Se ofrece aporte nutricional + talleres de hábitos saludables o chequeos nutricionales.",
      },
      {
        nivel: 3,
        texto: "Se ofrece aporte nutricional, talleres, chequeo nutricional y seguimiento nutricional.",
      },
    ],
  },
  {
    id: "alc-genero",
    eje: "alcance",
    orden: 4,
    nombre: "Trabajo en género",
    definicion:
      "Trabajo del socio local para mejorar la situación de igualdad de género en el proyecto.",
    ejemplos: [
      { nivel: 0, texto: "No hay presencia de niñas." },
      { nivel: 1, texto: "Se realiza un diagnóstico de género." },
      { nivel: 2, texto: "Se realiza 1 acción específica que promueva la igualdad de género." },
      { nivel: 3, texto: "Se realiza una intervención específica en género." },
    ],
  },
  {
    id: "alc-proteccion",
    eje: "alcance",
    orden: 5,
    nombre: "Protección a la infancia",
    definicion:
      "Trabajo del socio local en el compromiso para mejorar la concienciación sobre la protección de menores.",
    ejemplos: [
      { nivel: 0, texto: "No constan medidas en este ámbito." },
      { nivel: 1, texto: "Consta alguna medida de protección de la infancia." },
      { nivel: 2, texto: "Se implementa la política de protección de la infancia de la FRM." },
      {
        nivel: 3,
        texto:
          "Se implementan medidas + política FRM + realización de actividades de protección de la infancia.",
      },
    ],
  },
  {
    id: "alc-capacidad",
    eje: "alcance",
    orden: 6,
    nombre: "Capacidad técnica del socio en terreno",
    definicion:
      "Trabajo e implementación de las actividades del socio en terreno.",
    ejemplos: [
      {
        nivel: 0,
        texto: "No existe capacidad técnica para implementar actividad socioeducativa.",
      },
      {
        nivel: 1,
        texto:
          "Existe capacidad técnica para implementar actividades socioeducativas, pero no hay voluntad o existen impedimentos de recursos.",
      },
      {
        nivel: 2,
        texto: "Existe capacidad técnica e implementa +1 actividad socioeducativa.",
      },
      {
        nivel: 3,
        texto: "Existe capacidad técnica e implementa +2 actividades socioeducativas.",
      },
    ],
  },
  {
    id: "alc-comunicacion",
    eje: "alcance",
    orden: 7,
    nombre: "Comunicación / Coordinación con FRM",
    definicion:
      "Trabajo en conjunto con FRM para la implementación de actividades y disponibilidad para necesidades institucionales.",
    ejemplos: [
      { nivel: 0, texto: "No responde en tiempo y forma." },
      { nivel: 1, texto: "Responde a necesidades básicas de la FRM." },
      {
        nivel: 2,
        texto: "Responde a necesidades básicas y muestra disponibilidad y colaboración.",
      },
      {
        nivel: 3,
        texto: "Responde a necesidades básicas y muestra disponibilidad, colaboración y proactividad.",
      },
    ],
  },

  // ============ EJE CARGA ============
  {
    id: "cag-informes",
    eje: "carga",
    orden: 1,
    nombre: "Calidad de informes",
    definicion:
      "Nivel de utilidad de los informes entregados por el socio local.",
    ejemplos: [
      {
        nivel: 0,
        texto:
          "Informes deficientes que no responden a necesidades de la FRM (poco detalle, sin desagregación).",
      },
      { nivel: 1, texto: "Informes básicos, con información parcial." },
      { nivel: 2, texto: "Informes adecuados con información requerida." },
      {
        nivel: 3,
        texto: "Informes adecuados que aportan información complementaria a la necesidad de la FRM.",
      },
    ],
  },
  {
    id: "cag-acompanamiento",
    eje: "carga",
    orden: 2,
    nombre: "Necesidad de acompañamiento al socio",
    definicion:
      "Esfuerzo de FRM para que el socio cumplimente correctamente sus informes.",
    ejemplos: [
      { nivel: 0, texto: "No hay necesidad de acompañamiento (informes de alta calidad)." },
      { nivel: 1, texto: "Requiere bajo acompañamiento en la cumplimentación de los informes." },
      {
        nivel: 2,
        texto: "Alta necesidad de acompañamiento de FRM para cumplimentar los informes.",
      },
      {
        nivel: 3,
        texto:
          "Necesidad total de acompañamiento (redefinir marco lógico, partidas presupuestarias, etc.) y/o FRM debe cumplimentar la información.",
      },
    ],
  },
  {
    id: "cag-subvencion",
    eje: "carga",
    orden: 3,
    nombre: "Subvención pública o privada",
    definicion:
      "Carga de trabajo derivada de la gestión y justificación de subvenciones.",
    ejemplos: [
      { nivel: 0, texto: "No cuenta con subvención pública o privada." },
      {
        nivel: 1,
        texto: "Cuenta con una subvención privada, con requisitos específicos de justificación.",
      },
      {
        nivel: 2,
        texto: "Cuenta con una subvención privada con alta demanda de coordinación de actividades.",
      },
      {
        nivel: 3,
        texto:
          "Cuenta con una subvención pública y/o privada que presenta alta demanda de coordinación y justificación.",
      },
    ],
  },
  {
    id: "cag-financiador",
    eje: "carga",
    orden: 4,
    nombre: "Financiador privado / fondos FRM",
    definicion:
      "Carga derivada de coordinaciones con financiadores privados o gestión de fondos FRM.",
    ejemplos: [
      { nivel: 0, texto: "No cuenta con financiador privado o fondos de la FRM." },
      {
        nivel: 1,
        texto:
          "Cuenta con fondos FRM y/o financiador privado que no requiere justificación específica (ej. Fundación Mapfre, Endesa).",
      },
      {
        nivel: 2,
        texto: "Cuenta con financiador privado que requiere justificación específica (auditoría).",
      },
      {
        nivel: 3,
        texto:
          "Cuenta con financiador privado que requiere alto monitoreo mensual y alta demanda de coordinación (ej. Abbott, Millicom).",
      },
    ],
  },
  {
    id: "cag-sedes",
    eje: "carga",
    orden: 5,
    nombre: "Gestión de sedes e instalaciones",
    definicion:
      "Esfuerzo dedicado a la gestión operativa de instalaciones, licencias federativas, seguros de menores y logística.",
    ejemplos: [
      { nivel: 0, texto: "Una sola sede, sin gestión adicional significativa." },
      { nivel: 1, texto: "Varias sedes en un municipio, gestión centralizada." },
      {
        nivel: 2,
        texto:
          "Varias sedes en distintos municipios, requiere coordinación de licencias, seguros y logística.",
      },
      {
        nivel: 3,
        texto:
          "Sedes dispersas en varias comunidades, gestión compleja con cesiones de espacio, mantenimiento y eventos.",
      },
    ],
  },
  {
    id: "cag-coordinacion",
    eje: "carga",
    orden: 6,
    nombre: "Coordinación externa y eventos",
    definicion:
      "Esfuerzo de coordinación con AMPAs, centros escolares, ayuntamientos, federaciones y organización de eventos o torneos.",
    ejemplos: [
      { nivel: 0, texto: "Sin coordinación externa ni eventos." },
      {
        nivel: 1,
        texto: "Coordinación puntual con un colegio o AMPA y un evento local al año.",
      },
      {
        nivel: 2,
        texto:
          "Coordinación estable con varios agentes locales y organización de torneo regional o jornada anual.",
      },
      {
        nivel: 3,
        texto:
          "Coordinación intensa con múltiples administraciones, federaciones autonómicas/nacional y organización de torneo nacional con financiación externa.",
      },
    ],
  },
];

export const ACTIVIDADES_INICIALES: Actividad[] = [
  // Categoría I — Consolidar
  {
    id: "act-i-1",
    codigo: "I.1",
    categoriaEstrategica: "I",
    texto:
      "Mantener recursos existentes y procurar disminuir la carga de trabajo en lo posible.",
  },
  {
    id: "act-i-2",
    codigo: "I.2",
    categoriaEstrategica: "I",
    texto:
      "Reforzar los proyectos que ya cuentan con un programa integral.",
  },
  {
    id: "act-i-3",
    codigo: "I.3",
    categoriaEstrategica: "I",
    texto:
      "Utilizar los resultados del barómetro para asignación de fondos extras a socios comprometidos.",
  },
  {
    id: "act-i-4",
    codigo: "I.4",
    categoriaEstrategica: "I",
    texto:
      "Fomentar espacios de intercambio de experiencias entre equipos de proyectos (presencial u online).",
  },

  // Categoría II — Redistribuir
  {
    id: "act-ii-1",
    codigo: "II.1",
    categoriaEstrategica: "II",
    texto:
      "Valorar distribución de recursos para ampliar alcance del proyecto.",
  },
  {
    id: "act-ii-2",
    codigo: "II.2",
    categoriaEstrategica: "II",
    texto:
      "Acompañar al socio en la búsqueda de colaboraciones privadas y subvenciones públicas.",
  },
  {
    id: "act-ii-3",
    codigo: "II.3",
    categoriaEstrategica: "II",
    texto:
      "Evaluar ampliar alcance con recursos adicionales o disminuir carga de trabajo. Periodo de evaluación de hasta 2 temporadas.",
  },
  {
    id: "act-ii-4",
    codigo: "II.4",
    categoriaEstrategica: "II",
    texto:
      "Establecer sinergias entre colaboradores y los socios locales en función de su expertise.",
  },

  // Categoría III — Evaluar cierre / reducir carga
  {
    id: "act-iii-1",
    codigo: "III.1",
    categoriaEstrategica: "III",
    texto:
      "Evaluar fórmulas para disminuir carga de trabajo.",
  },
  {
    id: "act-iii-2",
    codigo: "III.2",
    categoriaEstrategica: "III",
    texto:
      "Proyecto susceptible de cierre si no se revierte la tendencia en 1 temporada.",
  },
  {
    id: "act-iii-3",
    codigo: "III.3",
    categoriaEstrategica: "III",
    texto:
      "Aumentar alcance de proyecto en un periodo de hasta 2 temporadas y/o redirigir a otro tipo de producto FRM.",
  },
  {
    id: "act-iii-4",
    codigo: "III.4",
    categoriaEstrategica: "III",
    texto:
      "Disminuir carga de trabajo mediante delegación administrativa y auditoría externa.",
  },
];
