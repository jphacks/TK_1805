#!/bin/sh

PRIVATE_KEY_PATH=.gcp/private_key.json
COMBINED_NAME="jphack2018-219415:asia-northeast1:store-db"
PORT=3306

if [ ! -r $PRIVATE_KEY_PATH ];then
    echo "No private key"
fi

cloud_sql_proxy -instances=$COMBINED_NAME=tcp:$PORT  -credential_file=$PRIVATE_KEY_PATH