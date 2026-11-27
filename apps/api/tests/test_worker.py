from app.jobs.worker import app as worker_app
from app.jobs.worker import ping


async def test_worker_procesa_ping() -> None:
    async with worker_app.open_async():
        job_id = await ping.defer_async()
        await worker_app.run_worker_async(queues=["default"], wait=False)
        estado = await worker_app.job_manager.get_job_status_async(job_id)
    assert estado.value == "succeeded"
