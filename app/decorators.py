from functools import wraps
from flask import jsonify, request, g, current_app

from app.db import Groups
from app.auth import current_user, is_admin, is_group


def json_request(f):
    @wraps(f)
    def wrapped_view(**kwargs):

        if not request.is_json:
            return jsonify({
                "success": False,
                "message": "Missing JSON in request"
            }), 400

        return f(**kwargs)
    return wrapped_view


def authenticated(f):
    @wraps(f)
    def wrapped_view(**kwargs):

        if not current_user():
            return jsonify({
                "success": False,
                "message": "Not authenticated"
            }), 401

        return f(**kwargs)
    return wrapped_view


def admin_required():
    @wraps(f)
    def wrapped_view(**kwargs):
        if not is_admin():
            return jsonify({
                "success": False,
                "message": "No permission"
            }), 403

        return f(**kwargs)
    return wrapped_view


def all_groups_required(groups=[Groups.USER]):
    def decorator(f):
        @wraps(f)
        def wrapped_view(**kwargs):
            if not all([is_group(g) for g in groups]):
                return jsonify({
                    "success": False,
                    "message": "No permission"
                }), 403

            return f(**kwargs)
        return wrapped_view
    return decorator


def any_groups_required(groups=[Groups.USER]):
    def decorator(f):
        @wraps(f)
        def wrapped_view(**kwargs):
            if not any([is_group(g) for g in groups]):
                return jsonify({
                    "success": False,
                    "message": "No permission"
                }), 403

            return f(**kwargs)
        return wrapped_view
    return decorator


def api_authenticated(f):
    @wraps(f)
    def wrapped_view(**kwargs):
        key = request.headers.get('X-API-Key')
        if key != current_app.config['API_KEY']:
            return jsonify({
                'success': False,
                'message': 'Invalid Api Key'
            }), 401
        return f(**kwargs)
    return wrapped_view
