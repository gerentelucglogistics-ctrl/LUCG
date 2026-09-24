import {
  Anchor,
  Boxes,
  ChartColumn,
  ChartLine,
  CircleDollarSign,
  ClipboardList,
  Clock,
  FileCheck,
  Gem,
  Eye,
  Globe,
  Handshake,
  Headset,
  MapPin,
  MonitorCheck,
  Navigation,
  Package,
  PackageCheck,
  Puzzle,
  Radar,
  RefreshCw,
  Route,
  Search,
  ShieldCheck,
  Tag,
  Target,
  Timer,
  Truck,
  Undo2,
  Warehouse,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type Feature = { icon: LucideIcon; title: string; text: string };

export const pillars: Feature[] = [
  { icon: ShieldCheck, title: "Seguridad", text: "Protegemos tu carga en cada paso." },
  { icon: Clock, title: "Rapidez", text: "Entregas eficientes y a tiempo." },
  { icon: MapPin, title: "Cobertura", text: "Llegamos a todo Urabá y más." },
  { icon: Handshake, title: "Confianza", text: "Comprometidos con tu negocio." },
];

export type Service = {
  id: string;
  icon: LucideIcon;
  title: string;
  kicker: string;
  summary: string;
  image: string;
  imageAlt: string;
  capabilities: Feature[];
};

export const services: Service[] = [
  {
    id: "bodega",
    icon: Warehouse,
    kicker: "Almacenamiento",
    title: "Servicio de bodega",
    summary:
      "Soluciones completas de almacenamiento y manejo de mercancía, diseñadas para garantizar organización, trazabilidad y eficiencia operativa en cada proceso.",
    image: "/img/bodega.webp",
    imageAlt: "Bodega con estanterías llenas de cajas",
    capabilities: [
      { icon: PackageCheck, title: "Recepción e inspección", text: "Control y validación eficiente de mercancía." },
      {
        icon: Warehouse,
        title: "Almacenamiento seguro",
        text: "Organización estratégica y protección de inventarios.",
      },
      { icon: ClipboardList, title: "Gestión de inventarios", text: "Monitoreo y control operativo en tiempo real." },
      { icon: MonitorCheck, title: "Tecnología WMS / TMS", text: "Integración tecnológica para mayor trazabilidad." },
      { icon: RefreshCw, title: "Control FIFO y LIFO", text: "Rotación eficiente e inteligente de inventarios." },
      { icon: ShieldCheck, title: "Disponibilidad permanente", text: "Control continuo y cumplimiento operativo." },
    ],
  },
  {
    id: "transporte",
    icon: Truck,
    kicker: "Transporte",
    title: "Transporte de carga",
    summary:
      "Transporte terrestre confiable, seguro y eficiente para que tu mercancía llegue a su destino en tiempo y forma, con cobertura local, nacional e internacional.",
    image: "/img/camion.webp",
    imageAlt: "Tractocamión con la marca LUCG Logistics en carretera",
    capabilities: [
      { icon: Truck, title: "Todo tipo de carga", text: "Soluciones eficientes y seguras para cada operación." },
      { icon: Globe, title: "Cobertura", text: "Operación local, regional, nacional e internacional." },
      { icon: Anchor, title: "Puertos", text: "Conexión con los principales puertos del Caribe colombiano." },
      { icon: Radar, title: "Rastreo", text: "Monitoreo y trazabilidad en tiempo real." },
      { icon: ShieldCheck, title: "Seguridad", text: "Control de la mercancía en cada etapa del trayecto." },
      { icon: Timer, title: "Cumplimiento", text: "Puntualidad para entregas confiables y oportunas." },
    ],
  },
  {
    id: "distribucion",
    icon: Package,
    kicker: "Distribución",
    title: "Distribución y última milla",
    summary:
      "Entregas rápidas, seguras y con trazabilidad en cada etapa de la operación, desde nuestra bodega hasta la puerta de tu cliente.",
    image: "/img/furgon.webp",
    imageAlt: "Camión furgón de distribución LUCG Logistics",
    capabilities: [
      { icon: Boxes, title: "Distribución", text: "Cobertura urbana y rural con entregas eficientes." },
      { icon: Navigation, title: "Última milla", text: "Entregas efectivas hasta la puerta del destino." },
      { icon: MapPin, title: "Rastreo", text: "Trazabilidad y monitoreo de cada envío." },
      { icon: Zap, title: "Entregas rápidas", text: "Optimización de rutas y tiempos." },
      { icon: ShieldCheck, title: "Seguridad", text: "Protección y control permanente de tu mercancía." },
      { icon: MonitorCheck, title: "Monitoreo en tiempo real", text: "Visibilidad completa de principio a fin." },
    ],
  },
  {
    id: "adicionales",
    icon: Puzzle,
    kicker: "Valor agregado",
    title: "Servicios adicionales",
    summary:
      "Soluciones complementarias para optimizar y fortalecer cada etapa de tu operación logística, adaptadas a las necesidades de tu empresa.",
    image: "/img/embalaje.webp",
    imageAlt: "Operario embalando una caja de LUCG Logistics",
    capabilities: [
      { icon: Package, title: "Embalaje y reembalaje", text: "Protección adecuada según el tipo de producto." },
      { icon: Tag, title: "Re-etiquetado", text: "Etiquetado y clasificación de mercancía." },
      { icon: Undo2, title: "Logística inversa", text: "Gestión de devoluciones y retornos." },
      { icon: FileCheck, title: "Gestión aduanera", text: "Mediante aliados estratégicos." },
      { icon: ChartColumn, title: "Reportes y análisis", text: "Indicadores operativos personalizados." },
      { icon: Headset, title: "Respuesta oportuna", text: "Acompañamiento en cada operación." },
    ],
  },
];

export const challenges = [
  "Costos operativos elevados",
  "Retrasos en entregas",
  "Falta de trazabilidad de la mercancía",
  "Inventarios desorganizados",
  "Ineficiencia en la última milla",
  "Fallas en transporte y distribución",
  "Riesgos operativos y aduaneros",
];

export const results: Feature[] = [
  { icon: Target, title: "Visibilidad total", text: "Control y trazabilidad en tiempo real de tu operación." },
  { icon: Timer, title: "Entregas más rápidas", text: "Optimizamos tiempos sin comprometer la calidad." },
  {
    icon: CircleDollarSign,
    title: "Optimización de costos",
    text: "Eficiencia operativa que se refleja en tu rentabilidad.",
  },
  { icon: Puzzle, title: "Soluciones flexibles", text: "Servicios adaptados a las necesidades de tu negocio." },
  { icon: ShieldCheck, title: "Seguridad garantizada", text: "Tu carga protegida con altos estándares." },
  { icon: Handshake, title: "Un solo aliado", text: "Integramos cada eslabón de tu cadena logística." },
];

export const methodology: Feature[] = [
  {
    icon: Search,
    title: "Diagnóstico operativo",
    text: "Analizamos tu operación logística actual para entender dónde se pierden tiempo y dinero.",
  },
  {
    icon: Puzzle,
    title: "Solución a la medida",
    text: "Diseñamos un plan adaptado a tu tipo de carga, volúmenes, rutas y tiempos.",
  },
  {
    icon: ChartLine,
    title: "Indicadores y trazabilidad",
    text: "Medimos con KPIs y te damos visibilidad de cada movimiento de tu mercancía.",
  },
  {
    icon: RefreshCw,
    title: "Mejora continua",
    text: "Optimizamos procesos de forma permanente, con acompañamiento y soporte.",
  },
];

export const coverage: (Feature & { places?: string })[] = [
  {
    icon: MapPin,
    title: "Región de Urabá",
    text: "Cubrimos todos los municipios de la región.",
    places: "Apartadó · Turbo · Chigorodó · Carepa · Mutatá · Necoclí",
  },
  {
    icon: Route,
    title: "Nivel nacional",
    text: "Llevamos tu carga a las principales ciudades de Colombia.",
    places: "Medellín · Bogotá · Cali · Barranquilla · Cartagena",
  },
  {
    icon: Globe,
    title: "Nivel internacional",
    text: "Alianzas estratégicas para mover mercancía hacia América y el resto del mundo.",
  },
  {
    icon: Anchor,
    title: "Conexión portuaria",
    text: "Acceso estratégico a los puertos del Caribe colombiano y rutas especializadas.",
  },
];

export const identity: Feature[] = [
  {
    icon: Target,
    title: "Misión",
    text: "Brindar soluciones logísticas integrales, seguras y eficientes, conectando el territorio de Urabá con el resto de Colombia y el mundo, garantizando la satisfacción y tranquilidad de nuestros clientes.",
  },
  {
    icon: Eye,
    title: "Visión",
    text: "Ser la empresa líder y referente en servicios logísticos en la región de Urabá y a nivel nacional, reconocida por nuestra excelencia, innovación y compromiso con la calidad y el desarrollo económico.",
  },
  {
    icon: Gem,
    title: "Valores",
    text: "Responsabilidad, honestidad, seguridad, puntualidad, trabajo en equipo, respeto, compromiso, calidad y servicio al cliente.",
  },
];
