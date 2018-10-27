# Store
## 概要

本サービスのバックエンドAPIを担うものです。

## 準備

MySQLサーバの使うにはふた通りの方法があります。

- GCP Cloud SQLを使う方法
- PC内に立てる方法

後者はいままで通りなので前者だけ説明します

### Google Cloud Platform CLIツールのインストールと認証を済ませる

```
curl https://sdk.cloud.google.com | bash
```

認証は

```
gcloud auth login
```

### Cloud SQL Proxyのインストール

以下のコマンドでインストールして、権限付与します。

```
wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
chmod +x cloud_sql_proxy
```

コマンドが使用できるか確認してください。

```
which cloud_sql_proxy
```

### ServiceAccount秘密鍵の取得

GCPにアクセスして、サービスアカウントキーを以下の通りに作成してください。

サービス アカウントを作成するには:

1. Google Cloud Platform Console の Cloud SQL の [サービス アカウント] ページに移動します。
2. [サービス アカウントを作成] をクリックします。
3. サービス アカウントの作成ダイアログで、サービス アカウントのわかりやすい名前を指定します。
4. [役割] で [プロジェクト] > [編集者] を選択します。
5. [新しい秘密鍵の提供] をクリックします。デフォルトのキーのタイプは [JSON] であり、この値で問題ありません。
6. [作成] をクリックします。
7. 秘密鍵ファイルがマシンにダウンロードされます。このファイルは別の場所に移動できます。安全な場所に鍵ファイルを保管してください。

## 実行
### MySQLサーバーを起動

```
./proxy.sh
```

### Flaskサーバーを起動

```
python app.py
```

## デプロイ

今のところ、最新版が本番環境になるので注意してください。

```
make deploy
```

## Member

- @HiromuYamazaki
- @karzawa
- @KeisukeYamashita
- @yosshi0774