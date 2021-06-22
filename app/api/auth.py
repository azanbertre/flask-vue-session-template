from flask import request, jsonify, session
from werkzeug.security import check_password_hash, generate_password_hash

from app.decorators import json_request
from app.db import get_db

from . import bp


@bp.route("/auth/login", methods=["POST"])
@json_request
def login():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    if not is_user_request_valid(data, False):
        return jsonify({
            "success": False,
            "message": "Missing username or password"
        }), 400

    db = get_db()

    user = db.users.find_one({
        "username": username
    })

    if user is None:
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    # check for password match
    if not check_password_hash(user["password"], password):
        return jsonify({
            "success": False,
            "message": "Username or password don't match"
        }), 400

    # clear and set new session
    session.clear()
    session["user_id"] = str(user["_id"])

    return jsonify({
        "success": True,
        "message": "Logged in"
    }), 200


@bp.route("/auth/register", methods=["POST"])
@json_request
def register():
    data = request.json

    # check valid request
    if not is_user_request_valid(data):
        return jsonify({
            "success": False,
            "message": "User already exists"
        }), 400

    db = get_db()

    # insert new user
    db.users.insert_one(data)

    return jsonify({
        "success": True,
        "message": "Registered successfully"
    }), 200


@bp.route("/auth/logout")
def logout():
    session.clear()

    return jsonify({
        "success": True,
        "message": "Logged out"
    })


# TODO handle valid username, pass
def is_user_request_valid(data, check_exists=True):
    username = data.get("username")
    password = data.get("password")

    if not username:
        return False

    if check_exists is True:
        db = get_db()
        user = db.users.find_one({
            "username": username
        })

        if user:
            return False

    if not password:
        return False

    return True
