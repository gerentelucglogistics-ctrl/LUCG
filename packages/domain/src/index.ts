// Enums de dominio. Deben coincidir con los enums de app.* en supabase/migrations (CI lo verifica en fase 1.1).
export const ESTADOS_OPERATIVOS = [
  "GUIA_CREADA","PENDIENTE_RECOGIDA","EN_TRANSITO_A_LUCG","RECIBIDO_BODEGA","CON_DIFERENCIA_RECEPCION",
  "DISPONIBLE_ASIGNACION","BLOQUEADO_BODEGA","ASIGNADO","EN_PODER_REPARTIDOR","EN_RUTA","ENTREGADO",
  "ENTREGADO_PARCIAL","CON_NOVEDAD","REPROGRAMADO","DEVUELTO_BODEGA","FALTANTE","EN_DEVOLUCION",
  "DEVUELTO_REMITENTE","ENTREGADO_TRANSPORTADOR_TERCERO","SINIESTRADO","ANULADO",
] as const;
export type EstadoOperativo = (typeof ESTADOS_OPERATIVOS)[number];

export const ESTADOS_RECAUDO = ["NO_APLICA","PENDIENTE","COBRADO","LEGALIZADO","GIRADO"] as const;
export const ESTADOS_FACTURACION = ["NO_FACTURABLE","FACTURABLE","PREFACTURADO","FACTURADO"] as const;
export const TIPOS_RECEPTOR = ["DESTINATARIO","FAMILIAR","HIJO","PADRE","AMIGO","AUTORIZADO","PORTERIA","VECINO","TIENDA","OTRO"] as const;
export const ROLES_INTERNOS = ["superadministrador","coordinador","bodega","repartidor","servicio_cliente","cartera","comercial","gerencia"] as const;
export const ROLES_EXTERNOS = ["admin_cuenta","operador_cuenta","consulta_cuenta"] as const;
