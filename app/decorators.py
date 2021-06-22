from functools import wraps
from flask import jsonify, request


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
