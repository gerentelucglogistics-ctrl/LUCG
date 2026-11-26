from fastapi.testclient import TestClient


def test_health_responde(client: TestClient) -> None:
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    assert r.json()["status"] in {"ok", "degradado"}
    assert "version" in r.json()
