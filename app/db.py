import datetime

from werkzeug.security import generate_password_hash
from flask.cli import with_appcontext
from flask import current_app, g

import pymongo
import click

global_db = None


class Groups:
    ADMIN = 'admin'
    USER = 'user'


def get_db():
    global global_db
    if global_db is not None:
        return global_db

    db_url = current_app.config['DATABASE']
    cn = pymongo.MongoClient(host=db_url.rsplit('/', 1)[0])
    g.db = cn[db_url.rsplit('/', 1)[1]]
    global_db = g.db

    db = g.db

    return db


def init_db():
    db = get_db()

    admin_group = db.groups.find_one_and_update({'slug': Groups.ADMIN}, {
        '$set': {
            'name': 'Administrator',
            'active': True,
            'created_at': datetime.datetime.utcnow()
        }},
        upsert=True,
        return_document=pymongo.ReturnDocument.AFTER
    )

    user_group = db.groups.find_one_and_update({'slug': Groups.USER}, {
        '$set': {
            'name': 'User',
            'active': True,
            'created_at': datetime.datetime.utcnow()
        }},
        upsert=True,
        return_document=pymongo.ReturnDocument.AFTER
    )

    db.users.update_one(
        {'username': 'admin'},
        {'$set': {
            'username': 'admin',
            'password': generate_password_hash('admin-pwd-123'),
            'groups': [admin_group['slug'], user_group['slug']],
            'created_at': datetime.datetime.utcnow(),
            'active': True
        }},
        upsert=True
    )


@click.command('init-db')
@with_appcontext
def init_db_command():
    init_db()
    click.echo("Initialized the database.")


def init_app(app):
    app.cli.add_command(init_db_command)
