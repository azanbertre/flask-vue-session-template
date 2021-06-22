from flask import Blueprint

# create blueprint
bp = Blueprint('api', __name__, url_prefix="/api")


from . import auth
