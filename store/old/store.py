from flask import jsonify, request


def _get_store_groups():
    # this is a mock
    return_dict = {
        "error": "",
        "message": {
            "groupId": "UTHER4TwQEYJERUEwHNhrxjo",
            "state": "IN_STORE"
        }
    }

    return jsonify(return_dict)


def _post_store_groups():
    # this is a mock
    return_dict = {
            "error": "",
            "message": {
                "groupId": "UTHER4TwQEYJERUEwHNhrxjo"
            }
        }

    return jsonify(return_dict)


def _get_store_menu():
    # this is a mock
    return_dict = {
        "error": "",
        "message": {
            "items": [
                {
                    "id": "TagaXrsTqbeM7fmwNMkFZTRF",
                    "categoryId": "qYTyxLh8YHFwPaJZiipppXTj",
                    "name": "鶏せせりの九条葱ぽん酢",
                    "description": "ビールに合うよ",
                    "photo": {
                        "url": "https://goo.gl/5dXWKW"
                    },
                    "price": 399
                },
        ],
            "categories": [
                {
                    "id": "qYTyxLh8YHFwPaJZiipppXTj",
                    "name": "逸品料理",
                    "description": "自慢の逸品が勢揃いです",
                    "photo": {
                        "url": "https://goo.gl/YqZ4Ye"
                    }
                },
            ]
        }
    }

    return jsonify(return_dict)

