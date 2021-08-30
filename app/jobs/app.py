from app.scheduler import scheduler, app_context_job

from app.db import get_db, Groups


@scheduler.scheduled_job("interval", seconds=1)
@app_context_job
def test():
    print("test")
