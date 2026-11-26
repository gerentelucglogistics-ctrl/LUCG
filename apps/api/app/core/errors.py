from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class ErrorDominio(Exception):
    """Error de negocio con código estable para la interfaz (p. ej. TRANSICION_INVALIDA)."""

    def __init__(self, codigo: str, detalle: str, status: int = 409) -> None:
        super().__init__(detalle)
        self.codigo, self.detalle, self.status = codigo, detalle, status


def registrar_manejadores(app: FastAPI) -> None:
    @app.exception_handler(ErrorDominio)
    async def _dominio(_: Request, e: ErrorDominio) -> JSONResponse:
        return JSONResponse(
            status_code=e.status,
            media_type="application/problem+json",
            content={
                "type": f"urn:lucg:error:{e.codigo}",
                "title": e.codigo,
                "status": e.status,
                "detail": e.detalle,
            },
        )
