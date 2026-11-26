// Generado por `pnpm gen-client` desde packages/api-client/openapi.json. No editar a mano.
export interface paths {
  "/api/v1/health": { get: { responses: { 200: { content: { "application/json": { status: string; db: boolean; version: string; env: string } } } } } };
}
