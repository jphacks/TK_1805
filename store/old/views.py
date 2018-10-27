from flask import Blueprint, request

from store import _get_store_groups, _post_store_groups, _get_store_menu


app = Blueprint(__name__, "views")


@app.route('/')
def index():
    return "Hello World"


# デプロイ時に必要なので残しておいてください
@app.route('/healthy')
def health():
    return "I am healthy"


@app.route('/store/groups')
def store_groups():
    if request.method == 'GET':
        return _get_store_groups()
    if request.method == 'POST':
        return _post_store_groups()


@app.route('/store/menu')
def store_menu():
    if request.method == 'GET':
        return _get_store_menu()
