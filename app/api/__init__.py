from flask import Blueprint

from . import auth

# create blueprint
bp = Blueprint('api', __name__, url_prefix="/api")
