import { useParams } from "react-router-dom";
export default function Tracking() { const { guia } = useParams(); return <main style={{ padding: 24 }}><h1>Seguimiento</h1><p>Guía {guia} (fase 5.5).</p></main>; }
