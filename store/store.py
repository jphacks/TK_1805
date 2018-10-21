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
