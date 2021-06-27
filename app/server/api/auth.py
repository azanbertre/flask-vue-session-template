from flask import request, jsonify, session, g
from werkzeug.security import check_password_hash, generate_password_hash
from bson import ObjectId

from app.decorators import json_request, authenticated
from app.db import get_db

from app.server import bp

import string


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

    if not validate_username(data.get("username", "")):
        return jsonify({
            "success": False,
            "message": "Bad username"
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
        "message": "Logged in",
        "data": {
            "user": {
                "username": user["username"]
            }
        }
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

    if not validate_username(data.get("username", "")):
        return jsonify({
            "success": False,
            "message": "Bad username"
        }), 400

    if not validate_password(data.get("password", "")):
        return jsonify({
            "success": False,
            "message": "Bad password"
        }), 400

    db = get_db()

    password = generate_password_hash(data["password"])
    del data["password"]

    # insert new user
    db.users.insert_one({
        **data,
        "password": password
    })

    return jsonify({
        "success": True,
        "message": "Registered successfully"
    }), 201


@bp.route("/auth/refresh", methods=["GET"])
@authenticated
def refresh():
    if not g.user:
        return jsonify({
            "success": False,
            "message": "Refreshed"
        })

    return jsonify({
        "success": True,
        "message": "Refreshed",
        "data": {
            "user": {
                "username": g.user["username"]
            }
        }
    })


@bp.route("/auth/logout", methods=["POST"])
def logout():
    session.clear()

    return jsonify({
        "success": True,
        "message": "Logged out"
    })


# load user
@bp.before_app_request
def load_logged_user():
    user_id = session.get("user_id")

    if not user_id:
        g.user = None
    else:
        db = get_db()

        g.user = db.users.find_one({
            "_id": ObjectId(user_id)
        })


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


def validate_username(username: str) -> bool:
    """ Validate an username

        @param username : str \n
        @return : bool
    """

    valid_characters = string.ascii_uppercase + string.ascii_lowercase + string.digits + '_'

    if not all([False for k in username if k not in valid_characters]):
        return False

    return True


def validate_password(password: str) -> bool:
    """ Validate a password

        @param password : str \n
        @return : bool
    """

    valid_characters = string.ascii_uppercase + string.ascii_lowercase + string.digits + "_-?!#@*&"

    if not all([False for k in password if k not in valid_characters]):
        return False

    return True
