export type PostSection = { title: string; intro: string; points: string[] };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  cover: string;
  coverAlt: string;
  category: string;
  intro: string;
  sections: PostSection[];
};

export const posts: Post[] = [
  {
    slug: "recomendaciones-logistica-de-calidad",
    title: "Nuestras recomendaciones para una logística de calidad",
    excerpt:
      "Trabajo en equipo, seguridad, cuidado de la mercancía, puntualidad, orden y capacitación: los seis pilares que aplicamos en cada operación.",
    date: "2026-04-01",
    cover: "/img/equipo.webp",
    coverAlt: "Integrante del equipo LUCG Logistics en bodega con una tablet",
    category: "Buenas prácticas",
    intro:
      "En LUCG Logistics entendemos que la logística es mucho más que transportar mercancías: es el arte de conectar lugares, personas y oportunidades. Estas son las prácticas que aplicamos todos los días y que recomendamos a cualquier empresa que quiera una operación más eficiente, segura y confiable.",
    sections: [
      {
        title: "Trabajo en equipo: la clave del éxito",
        intro:
          "En el sector logístico ninguna tarea se realiza de forma aislada. Desde la recepción de la mercancía hasta su entrega final, cada paso depende de la coordinación de todo el personal. Un equipo unido agiliza los procesos, reduce errores y mejora la calidad del servicio.",
        points: [
          "Fomentar la comunicación clara y constante entre todas las áreas.",
          "Valorar las habilidades y conocimientos de cada integrante del equipo.",
          "Establecer metas comunes y celebrar los logros alcanzados en conjunto.",
          "Resolver los conflictos de manera constructiva, buscando el bien común.",
        ],
      },
      {
        title: "Trabajo seguro: nuestra mayor prioridad",
        intro:
          "La seguridad no es una opción, es un compromiso con la vida y el bienestar de todos. En logística se manejan cargas pesadas, maquinaria y vehículos, por lo que el riesgo está presente si no se toman las medidas adecuadas.",
        points: [
          "Usar siempre los elementos de protección personal (casco, guantes, calzado de seguridad, chaleco reflectante).",
          "Respetar todas las normas de tránsito y seguridad industrial.",
          "Realizar revisiones periódicas de vehículos, equipos e instalaciones.",
          "Participar activamente en capacitaciones sobre prevención de riesgos.",
          "No realizar maniobras que pongan en peligro tu vida o la de los demás.",
        ],
      },
      {
        title: "Cuidado de la mercancía: responsabilidad total",
        intro:
          "Cada producto que manejamos representa el esfuerzo y el patrimonio de nuestros clientes. Protegerlo de daños, pérdidas o deterioro es nuestra obligación y lo que nos distingue como empresa confiable.",
        points: [
          "Manipular las cargas con cuidado, respetando las señales de los empaques.",
          "Utilizar los equipos adecuados según el tipo de producto y su peso.",
          "Almacenar correctamente, separando productos según sus características.",
          "Verificar constantemente el estado de la mercancía durante todo el proceso.",
        ],
      },
      {
        title: "Puntualidad y responsabilidad: nuestra tarjeta de presentación",
        intro:
          "En logística, el tiempo es dinero. Cumplir con los plazos acordados satisface al cliente y fortalece la confianza en la empresa. Ser responsable significa comprometernos con lo prometido.",
        points: [
          "Planificar bien las rutas y los tiempos de cada operación.",
          "Informar de inmediato cualquier imprevisto que pueda retrasar el servicio.",
          "Cumplir estrictamente los horarios de trabajo y entrega.",
          "Asumir la responsabilidad ante cualquier error y buscar soluciones rápidas.",
        ],
      },
      {
        title: "Orden y limpieza: reflejo de profesionalismo",
        intro:
          "Un lugar de trabajo ordenado y limpio funciona mejor: reduce accidentes, evita pérdidas de tiempo y facilita todas las tareas.",
        points: [
          "Mantener áreas de trabajo, pasillos y vehículos limpios y despejados.",
          "Devolver cada herramienta y equipo a su lugar después de usarlo.",
          "Etiquetar y clasificar adecuadamente la mercancía y los materiales.",
          "Establecer rutinas diarias de limpieza y organización.",
        ],
      },
      {
        title: "Capacitación constante: crecer es nuestra meta",
        intro:
          "La logística evoluciona todos los días: nuevas tecnologías, normativas y herramientas. Aprender continuamente es la mejor inversión para la empresa y para cada trabajador.",
        points: [
          "Participar en cursos, talleres y charlas relacionadas con tu labor.",
          "Estar al día con las leyes y normativas del transporte y el almacenamiento.",
          "Aprender a usar las nuevas tecnologías y equipos del mercado.",
          "Compartir lo aprendido con el equipo para mejorar todos juntos.",
        ],
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeZone: "UTC" }).format(new Date(iso));
}

export const gallery = [
  { n: 1, title: "LUCG Logistics S.A.S" },
  { n: 12, title: "Tu carga en manos expertas" },
  { n: 13, title: "Somos más que una solución logística" },
  { n: 2, title: "Conoce a LUCG Logistics" },
  { n: 3, title: "Retos logísticos que resolvemos" },
  { n: 4, title: "Resultados que puedes lograr" },
  { n: 5, title: "Nuestros servicios logísticos" },
  { n: 6, title: "Servicio de bodega" },
  { n: 7, title: "Servicio de transporte" },
  { n: 8, title: "Distribución y última milla" },
  { n: 9, title: "Servicios logísticos adicionales" },
  { n: 10, title: "Garantía y seguridad operativa" },
  { n: 11, title: "Nuestra metodología operativa" },
].map((g) => ({ ...g, src: `/img/galeria/pieza-${g.n}.webp` }));
