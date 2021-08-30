import os
import functools

from apscheduler.schedulers.blocking import BlockingScheduler


scheduler = BlockingScheduler()


def app_context_job(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        # scheduler.app is set on the init
        with scheduler.app.app_context():
            return f(*args, **kwargs)

    return wrapper


def production_only_job(f):
    if not os.environ.get("BOT_FARM_PRODUCTION"):
        print("Function %s not running because it's not production environment" % f.__name__)
        def empty(*args, **kwargs):
            return
        return empty

    # return un-modified
    return f
