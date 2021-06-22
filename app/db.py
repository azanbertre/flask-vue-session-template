from werkzeug.security import generate_password_hash
from flask.cli import with_appcontext
from flask import current_app, g

import pymongo
import click

global_db = None


class Groups:
    ADMIN = 'admin'
    USER = 'user'

def get_db() -> pymongo.database.Database:
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

    users_permission = db.permissions.find_one_and_update(
        {'slug': 'users'},
        {'$set': {
            'name': "Users",
            'description': ("Can edit users info, create a new user, "
                            "and assign users permissions"),
        }},
        upsert=True,
        return_document=pymongo.ReturnDocument.AFTER,
    )

    groups_permission = db.permissions.find_one_and_update(
        {'slug': 'groups'},
        {'$set': {
            'name': 'Groups and Permissions',
            'description': 'Can assign groups and permissions',
        }},
        upsert=True,
        return_document=pymongo.ReturnDocument.AFTER,
    )

    admin_users_permission = db.permissions.find_one_and_update(
        {'slug': 'users:admin'},
        {'$set': {
            'name': 'Edit Admin Users',
            'description': 'Can create and edit admin users',
        }},
        upsert=True,
        return_document=pymongo.ReturnDocument.AFTER,
    )

    edit_groups_permission = db.permissions.find_one_and_update(
        {'slug': 'groups:edit'},
        {'$set': {
            'name': 'Edit Groups',
            'description': 'Can edit groups and permissions',
        }},
        upsert=True,
        return_document=pymongo.ReturnDocument.AFTER,
    )

    admin_group = db.groups.find_one_and_update({'slug': Groups.ADMIN}, {
        '$set': {
            'name': 'Administrator',
            'permissions': [
                users_permission['_id'],
                groups_permission['_id'],
                admin_users_permission['_id'],
                edit_groups_permission['_id'],
            ]
        }},
        upsert=True,
        return_document=pymongo.ReturnDocument.AFTER
    )

    user_group = db.groups.find_one_and_update({'slug': Groups.USER}, {
        '$set': {
            'name': 'User',
            'permissions': []
        }},
        upsert=True,
        return_document=pymongo.ReturnDocument.AFTER
    )

    db.users.update_one(
        {'username': 'admin'},
        {'$set': {
            'username': 'admin',
            'password': generate_password_hash('admin123'),
            'groups': [admin_group['slug'], user_group['slug']]
        }},
        upsert=True
    )

    db.users.update_one(
        {'username': 'user'},
        {'$set': {
            'username': 'user',
            'password': generate_password_hash('user123'),
            'groups': [user_group['slug']]
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
