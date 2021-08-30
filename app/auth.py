from flask import current_app, g
from app.db import Groups


def current_user():
    return g.user


def is_admin():
    return is_group(Groups.ADMIN)


def is_group(group=Groups.USER):
    user = current_user()
    if not user:
        return False
    return group in user.get("groups", [])
