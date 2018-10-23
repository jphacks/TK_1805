from flask import Blueprint, request

from store import _get_store_groups


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
