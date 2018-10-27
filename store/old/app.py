from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

import views

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///store.db'
db = SQLAlchemy(app)

app.register_blueprint(views.app, url_prefix = '')


class Store(db.Model):
    __tablename__ = 'stores'

    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return '<Store %r>' % self.name


class Menu(db.Model):
    __tablename__ = 'menus'

    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'))

    stores = db.relationship('Store', backref=db.backref('menus', lazy=True))

    def __repr__(self):
        return '<Menu %r>' % self.name


class Item(db.Model):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey('menus.id'))

    def __repr__(self):
        return '<Item %r>' % self.name


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
