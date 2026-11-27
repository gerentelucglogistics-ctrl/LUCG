"""Idempotencia para escrituras desde la PWA y conectores.

Uso previsto (fase 1.1): dependencia que lee `Idempotency-Key`, busca en app.idempotencia; si existe y el
hash del cuerpo coincide devuelve la respuesta guardada; si no existe, ejecuta y guarda
{clave, hash, respuesta, expira_en = +7 días}.
Se implementa junto con el primer endpoint de escritura; este archivo fija el contrato.
"""

from typing import Annotated

from fastapi import Header

IdempotencyKey = Annotated[str | None, Header(alias="Idempotency-Key")]
