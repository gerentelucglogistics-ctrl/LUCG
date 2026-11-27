import Dexie, { type EntityTable } from "dexie";

// Cola local (skill pwa-offline). Nada se borra hasta que el servidor confirme aceptado o duplicado.
export interface EventoPendiente {
  id: string; // uuid generado en el teléfono
  tipo: string;
  envio_ref: string;
  bulto_ref?: string;
  hora_dispositivo: string;
  payload: Record<string, unknown>;
  estado: "pendiente" | "enviando" | "aceptado" | "rechazado";
  intentos: number;
  motivo?: string;
}
export interface FotoPendiente { id: string; evento_id: string; blob: Blob; estado: "pendiente" | "subida" }
export interface RutaLocal { id: string; version: number; fecha: string; datos: unknown }

export const db = new Dexie("lucg-driver") as Dexie & {
  ruta: EntityTable<RutaLocal, "id">;
  eventos_pendientes: EntityTable<EventoPendiente, "id">;
  fotos_pendientes: EntityTable<FotoPendiente, "id">;
};
db.version(1).stores({ ruta: "id, version", eventos_pendientes: "id, estado, hora_dispositivo", fotos_pendientes: "id, evento_id, estado" });
